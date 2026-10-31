import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Edit, Trash2, Save, Search, Calendar, Lock, Unlock, RefreshCw, MoreVertical } from 'lucide-react';
import {
  generateMissingPeriods,
  loadPayrollPolicyConfig,
  periodOverlaps,
  PAYROLL_COMPANIES,
  savePayrollPolicyConfig,
  subscribePayrollPolicyConfig,
  type PayrollCalendarRecord,
  type PayrollPeriodRecord,
  type PayrollPeriodStatus
} from './PayrollSetup';

export const ANNUAL_PERIOD_STORE = 'k12-payroll-annual-periods-v1';
export const INCOME_TAX_SLAB_STORE = 'k12-income-tax-slabs-v1';

export type AnnualPeriodStatus = 'Draft' | 'Active' | 'Closed' | 'Upcoming';
export type AnnualPeriod = {
  id: string;
  name: string;
  company: string;
  financialYear: string;
  startDate: string;
  endDate: string;
  status: AnnualPeriodStatus;
  declarationStart: string;
  declarationEnd: string;
  hasSalarySlips: boolean;
  description: string;
};

const TODAY = '2026-10-29';
const YEARS = ['2024-25', '2025-26', '2026-27', '2027-28'];

const SEED_ANNUAL: AnnualPeriod[] = [
  { id: 'AY-2026-27', name: 'AY 2026-27 Payroll Period', company: 'edumanager', financialYear: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', declarationStart: '2026-04-15', declarationEnd: '2026-11-30', hasSalarySlips: true, description: 'Current academic / tax year.' },
  { id: 'AY-2025-26', name: 'AY 2025-26 Payroll Period', company: 'edumanager', financialYear: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', status: 'Closed', declarationStart: '2025-04-15', declarationEnd: '2025-11-30', hasSalarySlips: true, description: 'Closed prior year.' },
  { id: 'AY-2027-28', name: 'AY 2027-28 Payroll Period', company: 'edumanager', financialYear: '2027-28', startDate: '2027-04-01', endDate: '2028-03-31', status: 'Upcoming', declarationStart: '', declarationEnd: '', hasSalarySlips: false, description: '' }
];

const loadAnnual = (): AnnualPeriod[] => {
  try {
    const raw = localStorage.getItem(ANNUAL_PERIOD_STORE);
    if (!raw) return SEED_ANNUAL;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED_ANNUAL;
  } catch {
    return SEED_ANNUAL;
  }
};
const saveAnnual = (rows: AnnualPeriod[]) => {
  localStorage.setItem(ANNUAL_PERIOD_STORE, JSON.stringify(rows));
};
const slabCountFor = (periodId: string) => {
  try {
    const raw = localStorage.getItem(INCOME_TAX_SLAB_STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item: { periodId?: string }) => item.periodId === periodId).length : 0;
  } catch {
    return 0;
  }
};
const daysBetween = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
};
const monthsBetween = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) return 0;
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
};
const addYears = (iso: string, years: number) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  d.setFullYear(d.getFullYear() + years);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const fmtLong = (iso: string) => {
  if (!iso) return '—';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};
const displayStatus = (row: AnnualPeriod): 'Active' | 'Closed' | 'Upcoming' | 'Draft' => {
  if (row.status === 'Closed' || row.status === 'Draft' || row.status === 'Upcoming') return row.status;
  if (row.startDate > TODAY) return 'Upcoming';
  if (row.endDate < TODAY) return 'Closed';
  return 'Active';
};
const isCurrent = (row: AnnualPeriod) => displayStatus(row) === 'Active' && row.startDate <= TODAY && row.endDate >= TODAY;
const highlight = (text: string, query: string) => {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return text;
  return <>{text.slice(0, i)}<mark className="bg-yellow-200">{text.slice(i, i + query.length)}</mark>{text.slice(i + query.length)}</>;
};
const companyLabel = (value: string) => PAYROLL_COMPANIES.find((item) => item.value === value)?.label || value;
const blankAnnual = (): AnnualPeriod => ({
  id: `AY-${Date.now()}`,
  name: '',
  company: 'edumanager',
  financialYear: '2026-27',
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  status: 'Draft',
  declarationStart: '',
  declarationEnd: '',
  hasSalarySlips: false,
  description: ''
});

const emptyCalendarForm = { calendarName: '', calendarCode: '', frequency: 'Monthly' as PayrollCalendarRecord['frequency'], financialYear: 'FY 2026-27', fyStart: '2026-04-01', fyEnd: '2027-03-31', description: '', campusId: 'all', status: 'Active' as PayrollCalendarRecord['status'] };
const emptyPeriodForm = { periodCode: '', periodName: '', startDate: '', endDate: '', lockDate: '', inputCutoffDate: '', plannedReviewDate: '', plannedApprovalDate: '', intendedPaymentDate: '', financialYear: 'FY 2026-27', status: 'Draft' as PayrollPeriodStatus };

export function PayrollCalendarPeriodMaster() {
  const navigate = useNavigate();
  const boot = loadPayrollPolicyConfig();
  const [screen, setScreen] = useState<'annual' | 'monthly'>('annual');
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [rows, setRows] = useState<AnnualPeriod[]>(() => loadAnnual());
  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [editing, setEditing] = useState<AnnualPeriod | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [duplicateOf, setDuplicateOf] = useState<AnnualPeriod | null>(null);
  const [dupName, setDupName] = useState('');
  const [dupIncrement, setDupIncrement] = useState(true);
  const [dupDeclarations, setDupDeclarations] = useState(true);
  const [notice, setNotice] = useState('');

  const persistAnnual = (next: AnnualPeriod[], message?: string) => {
    setRows(next);
    saveAnnual(next);
    if (message) setNotice(message);
  };

  const filtered = rows.filter((row) => {
    const status = displayStatus(row);
    if (statusTab !== 'All' && status !== statusTab) return false;
    if (companyFilter !== 'all' && row.company !== companyFilter) return false;
    if (yearFilter !== 'all' && row.financialYear !== yearFilter) return false;
    if (search && !(`${row.name} ${row.financialYear} ${companyLabel(row.company)}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const duration = editing ? daysBetween(editing.startDate, editing.endDate) : 0;
  const durationMonths = editing ? monthsBetween(editing.startDate, editing.endDate) : 0;
  const dateError = editing && editing.startDate && editing.endDate && editing.endDate < editing.startDate;
  const nameChips = editing ? [
    `AY ${editing.financialYear} Payroll Period`,
    `FY ${editing.financialYear}`,
    `Academic Year April ${editing.financialYear.slice(0, 4)} - March ${Number(editing.financialYear.slice(0, 4)) + 1}`
  ] : [];
  const declDays = editing && editing.declarationStart && editing.declarationEnd ? daysBetween(editing.declarationStart, editing.declarationEnd) : 0;

  const openCreate = () => { setEditing(blankAnnual()); setMode('form'); };
  const openEdit = (row: AnnualPeriod) => { setEditing({ ...row }); setMode('form'); setMenuId(null); };
  const saveForm = () => {
    if (!editing) return;
    if (!editing.name.trim()) { setNotice('Period name is required.'); return; }
    if (!editing.company) { setNotice('Company is required.'); return; }
    if (!editing.startDate || !editing.endDate) { setNotice('Start and end dates are required.'); return; }
    if (editing.endDate < editing.startDate) { setNotice('End date must be after start date.'); return; }
    const exists = rows.some((item) => item.id === editing.id);
    persistAnnual(exists ? rows.map((item) => item.id === editing.id ? editing : item) : [editing, ...rows], exists ? 'Payroll period updated.' : 'Payroll period created.');
    setMode('list');
  };
  const closePeriod = (row: AnnualPeriod) => {
    persistAnnual(rows.map((item) => item.id === row.id ? { ...item, status: 'Closed' } : item), 'Period closed.');
    setMenuId(null);
  };
  const deletePeriodAnnual = (row: AnnualPeriod) => {
    if (row.hasSalarySlips) { setNotice('Delete is blocked while salary slips reference this period.'); setMenuId(null); return; }
    persistAnnual(rows.filter((item) => item.id !== row.id), 'Period deleted.');
    setMenuId(null);
  };
  const applyDuplicate = () => {
    if (!duplicateOf) return;
    const copy: AnnualPeriod = {
      ...duplicateOf,
      id: `AY-${Date.now()}`,
      name: dupName || `${duplicateOf.name} (copy)`,
      status: 'Draft',
      hasSalarySlips: false,
      startDate: dupIncrement ? addYears(duplicateOf.startDate, 1) : duplicateOf.startDate,
      endDate: dupIncrement ? addYears(duplicateOf.endDate, 1) : duplicateOf.endDate,
      financialYear: dupIncrement ? `${Number(duplicateOf.financialYear.slice(0, 4)) + 1}-${String(Number(duplicateOf.financialYear.slice(5, 7)) + 1).padStart(2, '0')}` : duplicateOf.financialYear,
      declarationStart: dupDeclarations ? (dupIncrement ? addYears(duplicateOf.declarationStart, 1) : duplicateOf.declarationStart) : '',
      declarationEnd: dupDeclarations ? (dupIncrement ? addYears(duplicateOf.declarationEnd, 1) : duplicateOf.declarationEnd) : ''
    };
    persistAnnual([copy, ...rows], 'Duplicate period created. Dates were incremented only if selected.');
    setDuplicateOf(null);
    setMenuId(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap gap-1 border-b border-gray-200 bg-white">
        {[{ id: 'annual', label: 'Payroll Periods' }, { id: 'monthly', label: 'Monthly calendars' }].map((item) => (
          <button key={item.id} type="button" onClick={() => { setScreen(item.id as 'annual' | 'monthly'); setMode('list'); }} className={`px-3 py-2.5 text-sm font-medium border-b-2 ${screen === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item.label}</button>
        ))}
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {screen === 'annual' && mode === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400">HR &gt; Payroll &gt; Payroll Period</p>
              <h1 className="text-2xl font-bold text-gray-900">Payroll Periods</h1>
              <p className="text-sm text-gray-500">Annual payroll / tax periods. These are not monthly payroll runs.</p>
            </div>
            <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Payroll Period</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
            {['All', 'Active', 'Closed', 'Upcoming'].map((item) => (
              <button key={item} type="button" onClick={() => { setStatusTab(item); setPage(1); }} className={`px-3 py-2 text-sm font-medium border-b-2 ${statusTab === item ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item}</button>
            ))}
            <div className="relative min-w-[200px] flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search payroll periods..." className="h-9 w-full rounded-full border border-gray-300 pl-9 pr-3 text-sm" />
            </div>
            <select value={companyFilter} onChange={(e) => { setCompanyFilter(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-gray-300 px-2 text-sm">
              <option value="all">All Companies</option>
              {PAYROLL_COMPANIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <select value={yearFilter} onChange={(e) => { setYearFilter(e.target.value); setPage(1); }} className="h-9 rounded-lg border border-gray-300 px-2 text-sm">
              <option value="all">All years</option>
              {YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          {search && <p className="text-xs text-gray-500">Showing {filtered.length} result{filtered.length === 1 ? '' : 's'} for “{search}”.</p>}
          {filtered.length === 0 ? (
            <Card>
              <div className="p-10 text-center">
                <Calendar className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                <p className="text-lg font-medium text-gray-700">{search ? `No periods found for “${search}”` : 'No Payroll Periods Configured'}</p>
                <p className="mt-1 text-sm text-gray-500">{search ? 'Try another search.' : 'Create your first payroll period to begin configuring income tax slabs and processing payroll.'}</p>
                {search ? <Button className="mt-4" variant="outline" onClick={() => setSearch('')}>Clear Search</Button> : <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Create First Payroll Period</Button>}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3 text-left">#</th>
                      <th className="px-3 py-3 text-left">Period Name</th>
                      <th className="px-3 py-3">Company</th>
                      <th className="px-3 py-3">Start Date</th>
                      <th className="px-3 py-3">End Date</th>
                      <th className="px-3 py-3">Duration</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((row, index) => {
                      const status = displayStatus(row);
                      const current = isCurrent(row);
                      return (
                        <tr key={row.id} className={`border-t hover:bg-gray-50 ${current ? 'border-l-4 border-l-indigo-400' : ''} ${status === 'Closed' ? 'bg-gray-50 text-gray-500' : ''}`}>
                          <td className="px-3 py-3">{(page - 1) * pageSize + index + 1}</td>
                          <td className="px-3 py-3">
                            <button type="button" className={`text-left font-medium underline-offset-2 hover:underline ${status === 'Closed' ? 'text-gray-500' : 'text-indigo-700'}`} onClick={() => openEdit(row)}>{highlight(row.name, search)}</button>
                            {current && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Current</span>}
                          </td>
                          <td className="px-3 py-3 text-center">{companyLabel(row.company)}</td>
                          <td className="px-3 py-3 text-center">{row.startDate}</td>
                          <td className="px-3 py-3 text-center">{row.endDate}</td>
                          <td className="px-3 py-3 text-center" title={`${daysBetween(row.startDate, row.endDate)} days`}>{monthsBetween(row.startDate, row.endDate)} months</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : status === 'Closed' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-800'}`}>
                              <span className={`h-2 w-2 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'Upcoming' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                              {status === 'Closed' ? 'Closed' : status}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" className="rounded px-2 py-1 text-[10px] text-indigo-700 hover:bg-indigo-50" onClick={() => navigate(`/hr/master/income-tax-slab?payroll_period=${encodeURIComponent(row.id)}`)}>View Tax Slabs</button>
                              <button type="button" className="rounded p-1 hover:bg-gray-100" title="More" onClick={() => setMenuId(menuId === row.id ? null : row.id)}><MoreVertical className="h-4 w-4" /></button>
                            </div>
                            {menuId === row.id && (
                              <div className="absolute z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 text-left text-sm shadow">
                                {status !== 'Closed' && <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-gray-50" onClick={() => openEdit(row)}>Edit</button>}
                                {status === 'Closed' && <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-gray-50" onClick={() => openEdit(row)}>View</button>}
                                <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-gray-50" onClick={() => { setDuplicateOf(row); setDupName(`AY ${Number(row.financialYear.slice(0, 4)) + 1}-${String(Number(row.financialYear.slice(5, 7)) + 1).padStart(2, '0')} Payroll Period`); setDupIncrement(true); setDupDeclarations(true); }}>Duplicate</button>
                                {status === 'Active' && <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-gray-50" onClick={() => closePeriod(row)}>Close Period</button>}
                                {!row.hasSalarySlips && <button type="button" className="block w-full rounded px-2 py-1 text-left text-red-600 hover:bg-red-50" onClick={() => deletePeriodAnnual(row)}>Delete</button>}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t px-3 py-2 text-xs text-gray-500">
                <span>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length} periods</span>
                <div className="flex items-center gap-2">
                  {Array.from({ length: pages }).map((_, i) => <button key={i} type="button" className={`rounded px-2 py-1 ${page === i + 1 ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>)}
                  <button type="button" disabled={page >= pages} className="rounded px-2 py-1 disabled:opacity-40" onClick={() => setPage((p) => Math.min(pages, p + 1))}>Next</button>
                  <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-8 rounded border px-1">
                    {[10, 20, 50].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {screen === 'annual' && mode === 'form' && editing && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div>
              <button type="button" className="text-sm text-indigo-600" onClick={() => setMode('list')}>← Back to Payroll Periods</button>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <h1 className="text-2xl font-bold text-gray-900">{editing.name || 'New Payroll Period'}</h1>
                <Badge variant={displayStatus(editing) === 'Active' ? 'success' : displayStatus(editing) === 'Upcoming' ? 'info' : 'secondary'}>{displayStatus(editing)}</Badge>
              </div>
            </div>
            <Card title="Basic information">
              <div className="grid gap-4 p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <div className="mb-1 flex justify-between text-xs text-gray-500"><span>Period name *</span><span>{editing.name.length}/80</span></div>
                  <Input value={editing.name} maxLength={80} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g., AY 2026-27 Payroll Period" />
                  <div className="mt-2 flex flex-wrap gap-2">{nameChips.map((chip) => <button key={chip} type="button" className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700" onClick={() => setEditing({ ...editing, name: chip })}>{chip}</button>)}</div>
                </div>
                <Select label="Company *" options={PAYROLL_COMPANIES.map((item) => ({ value: item.value, label: item.label }))} value={editing.company} onChange={(e) => setEditing({ ...editing, company: typeof e === 'string' ? e : e.target.value })} />
                <Select label="Financial year" options={YEARS.map((item) => ({ value: item, label: item }))} value={editing.financialYear} onChange={(e) => setEditing({ ...editing, financialYear: typeof e === 'string' ? e : e.target.value })} />
                <Input label="Start date *" type="date" value={editing.startDate} disabled={editing.hasSalarySlips} onChange={(e) => {
                  const start = e.target.value;
                  const endYear = Number(start.slice(0, 4)) + 1;
                  setEditing({ ...editing, startDate: start, endDate: editing.hasSalarySlips ? editing.endDate : `${endYear}-03-31` });
                }} />
                <Input label="End date *" type="date" value={editing.endDate} disabled={editing.hasSalarySlips} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} />
                {editing.hasSalarySlips && <p className="md:col-span-2 text-xs text-gray-500">Dates are locked because salary slips exist for this period.</p>}
                <button type="button" className="text-xs text-indigo-700 underline" onClick={() => setEditing({ ...editing, startDate: `${editing.financialYear.slice(0, 4)}-04-01` })}>April 1st (recommended)</button>
                <div className={`md:col-span-2 rounded-lg border p-3 text-sm ${dateError ? 'border-red-200 bg-red-50 text-red-800' : 'border-indigo-100 bg-indigo-50 text-indigo-900'}`}>
                  {dateError ? 'End date must be after start date.' : `Duration: ${durationMonths} months (${duration} days). Start: ${fmtLong(editing.startDate)}. End: ${fmtLong(editing.endDate)}.`}
                </div>
              </div>
            </Card>
            <Card title="Tax exemption declaration window">
              <div className="space-y-3 p-4">
                <p className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-900">Set the window during which school staff can submit investment declarations. Outside this window the declaration form is locked.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input label="Declarations open from" type="date" value={editing.declarationStart} onChange={(e) => setEditing({ ...editing, declarationStart: e.target.value })} />
                  <Input label="Declarations close on" type="date" value={editing.declarationEnd} onChange={(e) => setEditing({ ...editing, declarationEnd: e.target.value })} />
                </div>
                {editing.declarationStart && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm">
                    <p>To: All active staff</p>
                    <p>Subject: Investment Declaration Open for FY {editing.financialYear}</p>
                    <p className="text-xs text-gray-500">Notifications are sent to all active employees on this date. Template editing is a frontend preview.</p>
                  </div>
                )}
                {editing.declarationEnd && (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm">
                    <p>Declaration window: {declDays || '—'} days</p>
                    <p>Closes: {fmtLong(editing.declarationEnd)}</p>
                    <p className="text-xs">Submissions lock after this date. TDS will use declared values.</p>
                  </div>
                )}
              </div>
            </Card>
            <div className="flex gap-2">
              <Button onClick={saveForm}><Save className="w-4 h-4 mr-2" />Save Period</Button>
              <Button variant="outline" onClick={() => setMode('list')}>Cancel</Button>
            </div>
          </div>
          <div className="space-y-3">
            <Card title="Period summary">
              <div className="space-y-3 p-4 text-sm">
                <p><b>{fmtLong(editing.startDate)}</b><br />Period starts</p>
                <p><b>{editing.declarationStart ? fmtLong(editing.declarationStart) : 'Not set'}</b><br />Declarations open</p>
                <p><b>{editing.declarationEnd ? fmtLong(editing.declarationEnd) : 'Not set'}</b><br />Declarations close</p>
                <p><b>{fmtLong(editing.endDate)}</b><br />Period ends</p>
                <div className="border-t pt-3">
                  <p className="text-xs uppercase text-gray-400">Linked documents</p>
                  <p>Tax slabs: {slabCountFor(editing.id)} configured {slabCountFor(editing.id) === 0 && <button type="button" className="ml-1 text-indigo-700 underline" onClick={() => navigate(`/hr/master/income-tax-slab?payroll_period=${encodeURIComponent(editing.id)}`)}>Create</button>}</p>
                  <p>Salary structures using this period: 0 (not established)</p>
                  <p>Active employees: not established in this preview</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {duplicateOf && (
        <Modal isOpen onClose={() => setDuplicateOf(null)} title="Duplicate Payroll Period" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setDuplicateOf(null)}>Cancel</Button><Button onClick={applyDuplicate}>Create Duplicate</Button></div>}>
          <div className="space-y-3">
            <Input label="New period name" value={dupName} onChange={(e) => setDupName(e.target.value)} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dupIncrement} onChange={(e) => setDupIncrement(e.target.checked)} /> Auto-increment dates by 1 year</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={dupDeclarations} onChange={(e) => setDupDeclarations(e.target.checked)} /> Copy declaration dates</label>
          </div>
        </Modal>
      )}

      {screen === 'monthly' && <MonthlyCalendarPanel notice={notice} setNotice={setNotice} bootCalendars={boot.config.calendars} bootWarning={boot.warning || ''} />}
    </div>
  );
}

function MonthlyCalendarPanel({ notice, setNotice, bootCalendars, bootWarning }: { notice: string; setNotice: (v: string) => void; bootCalendars: PayrollCalendarRecord[]; bootWarning: string }) {
  const [calendars, setCalendars] = useState<PayrollCalendarRecord[]>(bootCalendars);
  const [selectedCalendarId, setSelectedCalendarId] = useState(bootCalendars[0]?.id || '');
  const [showCalendarForm, setShowCalendarForm] = useState(false);
  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [editCalendarId, setEditCalendarId] = useState<string | null>(null);
  const [editPeriodId, setEditPeriodId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [calendarForm, setCalendarForm] = useState(emptyCalendarForm);
  const [periodForm, setPeriodForm] = useState(emptyPeriodForm);
  const [preview, setPreview] = useState<{ period: PayrollPeriodRecord; result: string }[] | null>(null);
  const [blockMessage, setBlockMessage] = useState('');

  const persist = (next: PayrollCalendarRecord[], success?: string) => {
    const loaded = loadPayrollPolicyConfig();
    const result = savePayrollPolicyConfig({ ...loaded.config, calendars: next });
    if (!result.ok) { setNotice(result.error || 'Save failed. Edits remain on screen.'); return false; }
    setCalendars(next);
    setNotice(success || 'Saved in this browser only.');
    return true;
  };

  useEffect(() => subscribePayrollPolicyConfig(() => {
    const next = loadPayrollPolicyConfig();
    setCalendars(next.config.calendars);
    if (next.warning) setNotice(next.warning);
  }), [setNotice]);

  useEffect(() => { if (bootWarning && !notice) setNotice(bootWarning); }, [bootWarning, notice, setNotice]);

  const selectedCalendar = calendars.find((c) => c.id === selectedCalendarId);
  const filteredPeriods = (selectedCalendar?.periods || []).filter((p) => p.periodName.toLowerCase().includes(search.toLowerCase()) || p.periodCode.toLowerCase().includes(search.toLowerCase()));
  const referencedPeriod = (period: PayrollPeriodRecord) => {
    const { config } = loadPayrollPolicyConfig();
    if (config.policies.some((item) => item.calendarId === period.calendarId)) return 'This calendar is selected on a saved payroll policy.';
    if (config.snapshots.some((item) => item.periodId === period.id)) return 'This period is captured on a saved payroll-policy preview.';
    return '';
  };
  const handleSaveCalendar = () => {
    if (!calendarForm.calendarName.trim()) { setNotice('Calendar name is required.'); return; }
    if (editCalendarId) persist(calendars.map((c) => c.id === editCalendarId ? { ...c, ...calendarForm } : c), 'Calendar updated.');
    else {
      const newCal: PayrollCalendarRecord = { ...calendarForm, id: `PC-${Date.now()}`, periods: [], status: 'Active' };
      persist([...calendars, newCal], 'Calendar created.');
      setSelectedCalendarId(newCal.id);
    }
    setCalendarForm(emptyCalendarForm); setShowCalendarForm(false); setEditCalendarId(null);
  };
  const validatePeriod = (form: typeof emptyPeriodForm, ignoreId?: string) => {
    if (!form.periodCode.trim() || !form.periodName.trim()) return 'Period code and name are required.';
    if (!form.startDate || !form.endDate) return 'Start and end dates are required.';
    if (form.endDate < form.startDate) return 'End date cannot be before start date.';
    const others = (selectedCalendar?.periods || []).filter((p) => p.id !== ignoreId);
    if (others.some((p) => p.periodCode === form.periodCode)) return 'Duplicate period code in this calendar.';
    const candidate = { ...form, id: ignoreId || 'tmp', calendarId: selectedCalendarId, isProcessed: false, isLocked: false, isReviewed: false } as PayrollPeriodRecord;
    if (others.some((p) => periodOverlaps(p, candidate))) return 'This period overlaps another period in the same calendar.';
    return '';
  };
  const handleSavePeriod = () => {
    if (!selectedCalendarId) return;
    const problem = validatePeriod(periodForm, editPeriodId || undefined);
    if (problem) { setNotice(problem); return; }
    const payload: Omit<PayrollPeriodRecord, 'id' | 'isProcessed' | 'isLocked' | 'isReviewed'> = { ...periodForm, calendarId: selectedCalendarId };
    if (editPeriodId) persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: c.periods.map((p) => p.id === editPeriodId ? { ...p, ...payload } : p) } : c), 'Period updated.');
    else persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: [...c.periods, { ...payload, id: `${selectedCalendarId}-${periodForm.periodCode}`, isProcessed: false, isLocked: false, isReviewed: false }] } : c), 'Period added.');
    setPeriodForm(emptyPeriodForm); setShowPeriodForm(false); setEditPeriodId(null);
  };
  const applyGenerated = () => {
    if (!selectedCalendar || !preview) return;
    const missing = preview.filter((row) => row.result === 'New').map((row) => row.period);
    if (!missing.length) { setNotice('No new periods to add. Existing periods were not replaced.'); setPreview(null); return; }
    persist(calendars.map((c) => c.id === selectedCalendar.id ? { ...c, periods: [...c.periods, ...missing] } : c), `Added ${missing.length} missing period(s). Existing, overlapping and locked periods were not replaced.`);
    setPreview(null);
  };
  const startEditPeriod = (p: PayrollPeriodRecord) => {
    setEditPeriodId(p.id);
    setPeriodForm({ periodCode: p.periodCode, periodName: p.periodName, startDate: p.startDate, endDate: p.endDate, lockDate: p.lockDate, inputCutoffDate: p.inputCutoffDate, plannedReviewDate: p.plannedReviewDate, plannedApprovalDate: p.plannedApprovalDate, intendedPaymentDate: p.intendedPaymentDate, financialYear: p.financialYear, status: p.status });
    setShowPeriodForm(true);
  };
  const deletePeriod = (p: PayrollPeriodRecord) => {
    if (p.isProcessed || p.isLocked || p.isReviewed) { setBlockMessage('This period is processed, locked or reviewed and cannot be removed.'); return; }
    const reason = referencedPeriod(p);
    if (reason) { setBlockMessage(`${reason} Deletion was blocked.`); return; }
    persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: c.periods.filter((row) => row.id !== p.id) } : c), 'Period deleted.');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Monthly calendars</h2>
          <p className="text-sm text-gray-500">Generate and lock monthly processing periods. Academic year is not stored here.</p>
        </div>
        <Button onClick={() => { setCalendarForm(emptyCalendarForm); setEditCalendarId(null); setShowCalendarForm(true); }}><Plus className="w-4 h-4 mr-2" />New Calendar</Button>
      </div>
      {showCalendarForm && <Card title={editCalendarId ? 'Edit Calendar' : 'New Payroll Calendar'}>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <Input label="Calendar Name *" value={calendarForm.calendarName} onChange={(e) => setCalendarForm({ ...calendarForm, calendarName: e.target.value })} />
          <Input label="Calendar code" value={calendarForm.calendarCode} onChange={(e) => setCalendarForm({ ...calendarForm, calendarCode: e.target.value })} />
          <Select label="Frequency *" options={['Monthly', 'Weekly', 'Every Two Weeks', 'Twice Monthly', 'Bi-weekly', 'Custom'].map((v) => ({ value: v, label: v }))} value={calendarForm.frequency} onChange={(e) => setCalendarForm({ ...calendarForm, frequency: (typeof e === 'string' ? e : e.target.value) as PayrollCalendarRecord['frequency'] })} />
          <Select label="Financial Year *" options={['FY 2025-26', 'FY 2026-27', 'FY 2027-28'].map((v) => ({ value: v, label: v }))} value={calendarForm.financialYear} onChange={(e) => setCalendarForm({ ...calendarForm, financialYear: typeof e === 'string' ? e : e.target.value })} />
          <Input label="Calendar start" type="date" value={calendarForm.fyStart} onChange={(e) => setCalendarForm({ ...calendarForm, fyStart: e.target.value })} />
          <Input label="Calendar end" type="date" value={calendarForm.fyEnd} onChange={(e) => setCalendarForm({ ...calendarForm, fyEnd: e.target.value })} />
          <Select label="Campus scope" options={[{ value: 'all', label: 'All campuses' }, { value: 'main', label: 'Main Campus' }, { value: 'city', label: 'City Centre Branch' }, { value: 'north', label: 'North Zone Campus' }]} value={calendarForm.campusId} onChange={(e) => setCalendarForm({ ...calendarForm, campusId: typeof e === 'string' ? e : e.target.value })} />
          <Select label="Status" options={['Draft', 'Active', 'Inactive'].map((v) => ({ value: v, label: v }))} value={calendarForm.status} onChange={(e) => setCalendarForm({ ...calendarForm, status: (typeof e === 'string' ? e : e.target.value) as PayrollCalendarRecord['status'] })} />
          <div className="md:col-span-2"><Input label="Description" value={calendarForm.description} onChange={(e) => setCalendarForm({ ...calendarForm, description: e.target.value })} /></div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveCalendar}><Save className="w-4 h-4 mr-2" />{editCalendarId ? 'Update' : 'Create'} Calendar</Button>
          <Button variant="outline" onClick={() => { setShowCalendarForm(false); setEditCalendarId(null); }}>Cancel</Button>
        </div>
      </Card>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Card title="Calendars">
            <div className="space-y-2">
              {calendars.map((c) => (
                <div key={c.id} className={`rounded-lg border p-3 ${selectedCalendarId === c.id ? 'bg-blue-50 border-blue-300' : 'border-gray-200'}`}>
                  <button type="button" className="w-full text-left" onClick={() => setSelectedCalendarId(c.id)}>
                    <p className="text-sm font-semibold text-gray-900">{c.calendarName}{c.sample ? ' (sample)' : ''}</p>
                    <div className="flex items-center gap-2 mt-1"><Badge variant={c.status === 'Active' ? 'success' : 'secondary'}>{c.status}</Badge><span className="text-xs text-gray-500">{c.frequency} · {c.id}</span></div>
                  </button>
                  <button type="button" className="mt-2 text-xs text-blue-700" onClick={() => { setEditCalendarId(c.id); setCalendarForm({ calendarName: c.calendarName, calendarCode: c.calendarCode || '', frequency: c.frequency, financialYear: c.financialYear, fyStart: c.fyStart, fyEnd: c.fyEnd, description: c.description || '', campusId: c.campusId || 'all', status: c.status }); setShowCalendarForm(true); }}>Edit</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="lg:col-span-9">
          <Card title={selectedCalendar ? `Periods – ${selectedCalendar.calendarName}` : 'Select a Calendar'}>
            {selectedCalendar && <>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[180px]"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search periods..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /></div>
                <Button variant="outline" onClick={() => {
                  if (selectedCalendar.frequency === 'Custom') { setNotice('Custom frequency does not auto-generate. Add periods manually.'); return; }
                  const proposed = generateMissingPeriods({ ...selectedCalendar, periods: [] });
                  const classified = proposed.map((period) => {
                    const exists = selectedCalendar.periods.some((row) => row.periodCode === period.periodCode);
                    const overlap = selectedCalendar.periods.some((row) => row.periodCode !== period.periodCode && periodOverlaps(row, period));
                    return { period, result: exists ? 'Already exists' : overlap ? 'Overlaps an existing period' : 'New' };
                  });
                  if (!classified.length) { setNotice('No periods could be generated for this calendar’s financial year and frequency.'); return; }
                  setPreview(classified);
                }}><RefreshCw className="w-4 h-4 mr-2" />Generate Periods</Button>
                <Button onClick={() => { setPeriodForm({ ...emptyPeriodForm, financialYear: selectedCalendar.financialYear }); setEditPeriodId(null); setShowPeriodForm(true); }}><Plus className="w-4 h-4 mr-2" />Add Period</Button>
              </div>
              {preview && <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
                <p className="font-semibold">Preview for {selectedCalendar.financialYear}. Add Missing Periods keeps existing, reviewed and locked periods unchanged.</p>
                <ul className="mt-2 max-h-40 overflow-auto text-xs">{preview.map((row) => <li key={row.period.id}>{row.period.periodName} ({row.period.periodCode}): {row.period.startDate} → {row.period.endDate} — {row.result}</li>)}</ul>
                <div className="mt-2 flex gap-2"><Button size="sm" onClick={applyGenerated}>Add Missing Periods</Button><Button size="sm" variant="outline" onClick={() => setPreview(null)}>Cancel</Button></div>
              </div>}
              {showPeriodForm && <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-1 gap-3 mb-3 md:grid-cols-2">
                  <Input label="Period Code *" value={periodForm.periodCode} onChange={(e) => setPeriodForm({ ...periodForm, periodCode: e.target.value })} />
                  <Input label="Period Name *" value={periodForm.periodName} onChange={(e) => setPeriodForm({ ...periodForm, periodName: e.target.value })} />
                  <Input label="Start Date *" type="date" value={periodForm.startDate} onChange={(e) => setPeriodForm({ ...periodForm, startDate: e.target.value })} />
                  <Input label="End Date *" type="date" value={periodForm.endDate} onChange={(e) => setPeriodForm({ ...periodForm, endDate: e.target.value })} />
                  <Input label="Input cutoff date" type="date" value={periodForm.inputCutoffDate} onChange={(e) => setPeriodForm({ ...periodForm, inputCutoffDate: e.target.value })} />
                  <Input label="Planned review date" type="date" value={periodForm.plannedReviewDate} onChange={(e) => setPeriodForm({ ...periodForm, plannedReviewDate: e.target.value })} />
                  <Input label="Planned approval date" type="date" value={periodForm.plannedApprovalDate} onChange={(e) => setPeriodForm({ ...periodForm, plannedApprovalDate: e.target.value })} />
                  <Input label="Intended payment date" type="date" value={periodForm.intendedPaymentDate} onChange={(e) => setPeriodForm({ ...periodForm, intendedPaymentDate: e.target.value })} />
                  <Input label="Lock Date" type="date" value={periodForm.lockDate} onChange={(e) => setPeriodForm({ ...periodForm, lockDate: e.target.value })} />
                  <Select label="Period status" options={['Draft', 'Open', 'Reviewed', 'Processed', 'Locked', 'Closed'].map((v) => ({ value: v, label: v }))} value={periodForm.status} onChange={(e) => setPeriodForm({ ...periodForm, status: (typeof e === 'string' ? e : e.target.value) as PayrollPeriodStatus })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSavePeriod}><Save className="w-4 h-4 mr-2" />{editPeriodId ? 'Update' : 'Add'} Period</Button>
                  <Button variant="outline" onClick={() => { setShowPeriodForm(false); setEditPeriodId(null); }}>Cancel</Button>
                </div>
              </div>}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead><tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Period</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Start</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">End</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Locked</th>
                    <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr></thead>
                  <tbody>
                    {filteredPeriods.map((p) => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4"><p className="text-sm font-semibold">{p.periodName}</p><p className="text-xs text-gray-500">{p.periodCode}</p></td>
                        <td className="py-3 px-4 text-center text-sm">{p.startDate}</td>
                        <td className="py-3 px-4 text-center text-sm">{p.endDate}</td>
                        <td className="py-3 px-4 text-center"><Badge variant={p.isProcessed ? 'success' : 'secondary'}>{p.status}</Badge></td>
                        <td className="py-3 px-4 text-center">{p.isLocked ? <Lock className="w-4 h-4 text-red-500 mx-auto" /> : <Unlock className="w-4 h-4 text-green-500 mx-auto" />}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button type="button" className="p-1.5 hover:bg-blue-100 rounded-lg" title="Edit" onClick={() => startEditPeriod(p)}><Edit className="w-4 h-4 text-blue-600" /></button>
                            <button type="button" className="p-1.5 hover:bg-amber-100 rounded-lg" title={p.isLocked ? 'Unlock' : 'Lock'} onClick={() => persist(calendars.map((c) => c.id === selectedCalendarId ? { ...c, periods: c.periods.map((row) => row.id === p.id ? { ...row, isLocked: !row.isLocked, status: !row.isLocked ? 'Locked' : (row.status === 'Locked' ? 'Open' : row.status) } : row) } : c), p.isLocked ? 'Period unlocked.' : 'Period locked.')}>{p.isLocked ? <Unlock className="w-4 h-4 text-green-600" /> : <Lock className="w-4 h-4 text-amber-600" />}</button>
                            <button type="button" className="p-1.5 hover:bg-red-100 rounded-lg" title="Delete" onClick={() => deletePeriod(p)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>}
          </Card>
        </div>
      </div>
      <Modal isOpen={Boolean(blockMessage)} onClose={() => setBlockMessage('')} title="Period cannot be removed" footer={<Button onClick={() => setBlockMessage('')}>OK</Button>}>
        <p className="text-sm text-gray-700">{blockMessage}</p>
      </Modal>
    </div>
  );
}

export default PayrollCalendarPeriodMaster;
