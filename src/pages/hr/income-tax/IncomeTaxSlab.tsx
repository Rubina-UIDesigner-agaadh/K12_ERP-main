import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Modal } from '../../../components/ui/Modal';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { PAYROLL_COMPANIES } from '../payroll/PayrollSetup';
import { ANNUAL_PERIOD_STORE, INCOME_TAX_SLAB_STORE, type AnnualPeriod } from '../payroll/PayrollCalendarPeriodMaster';
import { calculateIncomeTax, remainingPayrollMonths } from './incomeTax';
import type { TaxPack } from './incomeTax';

type Regime = 'Old Regime' | 'New Regime' | 'Custom';
type SlabRow = { id: string; from: number; to: number | null; rate: number; condition: string };
type ExemptionRow = { id: string; category: string; sub: string; maxAmount: number; basedOn: 'Fixed' | 'Declared' | 'Formula'; appliesIf: string; oldOnly: boolean };
type TaxCharge = { id: string; description: string; kind: 'Percentage of Tax' | 'Flat Amount'; rate: number; condition: string; minAmount: number | null; maxAmount: number | null };
export type TaxSlabPack = {
  id: string;
  name: string;
  periodId: string;
  company: string;
  regime: Regime;
  effectiveFrom: string;
  currency: string;
  status: 'Active' | 'Inactive';
  submitted: boolean;
  allowExemption: boolean;
  standardExemption: number;
  taxReliefLimit: number;
  employees: number;
  rows: SlabRow[];
  surchargeRate: number;
  surchargeThreshold: number;
  cessPercent: number;
  charges: TaxCharge[];
  exemptions: ExemptionRow[];
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const FALLBACK_PERIODS: AnnualPeriod[] = [
  { id: 'AY-2026-27', name: 'AY 2026-27 Payroll Period', company: 'edumanager', financialYear: '2026-27', academicYear: '2026-27', fiscalYear: 'FY 2026-27', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', declarationStart: '2026-04-15', declarationEnd: '2026-11-30', hasSalarySlips: true, description: '', frequency: 'Monthly', paymentDay: 1, holidayList: '', currency: 'INR', costCenter: '', flexibleBenefits: false, benefitClaimDeadline: '', autoTaxUnclaimed: false }
];
const loadPeriods = (): AnnualPeriod[] => {
  try {
    const raw = localStorage.getItem(ANNUAL_PERIOD_STORE);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.length ? parsed : FALLBACK_PERIODS;
  } catch {
    return FALLBACK_PERIODS;
  }
};
const defaultCharges = (): TaxCharge[] => [
  { id: 'c1', description: 'Health & Education Cess', kind: 'Percentage of Tax', rate: 4, condition: '', minAmount: 0, maxAmount: null },
  { id: 'c2', description: 'Surcharge (10%)', kind: 'Percentage of Tax', rate: 10, condition: 'annual_taxable_earning > 5000000', minAmount: 5000001, maxAmount: 10000000 },
  { id: 'c3', description: 'Surcharge (15%)', kind: 'Percentage of Tax', rate: 15, condition: 'annual_taxable_earning > 10000000', minAmount: 10000001, maxAmount: 20000000 },
  { id: 'c4', description: 'Surcharge (25%)', kind: 'Percentage of Tax', rate: 25, condition: 'annual_taxable_earning > 20000000', minAmount: 20000001, maxAmount: null }
];
const defaultExemptions = (): ExemptionRow[] => [
  { id: 'e1', category: 'Standard Deduction', sub: '—', maxAmount: 50000, basedOn: 'Fixed', appliesIf: 'Always', oldOnly: false },
  { id: 'e2', category: 'HRA Exemption', sub: '80GG / Actual', maxAmount: 0, basedOn: 'Formula', appliesIf: 'Declared', oldOnly: true },
  { id: 'e3', category: '80C', sub: 'ELSS/PPF/LIC/Tuition/Principal', maxAmount: 150000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e4', category: '80D', sub: 'Medical Insurance', maxAmount: 75000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e5', category: '80E', sub: 'Education loan interest', maxAmount: 0, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e6', category: '80G', sub: 'Donations', maxAmount: 0, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e7', category: '80CCD(1B)', sub: 'NPS additional', maxAmount: 50000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e8', category: 'Section 24b', sub: 'Home loan interest', maxAmount: 200000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e9', category: '80TTA', sub: 'Savings interest', maxAmount: 10000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e10', category: 'LTA', sub: 'Leave Travel', maxAmount: 0, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true }
];
const oldRows = (): SlabRow[] => [
  { id: 'o1', from: 0, to: 300000, rate: 0, condition: '' },
  { id: 'o2', from: 300001, to: 700000, rate: 5, condition: '' },
  { id: 'o3', from: 700001, to: 1000000, rate: 10, condition: '' },
  { id: 'o4', from: 1000001, to: 1200000, rate: 15, condition: '' },
  { id: 'o5', from: 1200001, to: 1500000, rate: 20, condition: '' },
  { id: 'o6', from: 1500001, to: null, rate: 30, condition: '' }
];
const newRows = (): SlabRow[] => [
  { id: 'n1', from: 0, to: 400000, rate: 0, condition: '' },
  { id: 'n2', from: 400001, to: 800000, rate: 5, condition: '' },
  { id: 'n3', from: 800001, to: 1200000, rate: 10, condition: '' },
  { id: 'n4', from: 1200001, to: 1600000, rate: 15, condition: '' },
  { id: 'n5', from: 1600001, to: 2000000, rate: 20, condition: '' },
  { id: 'n6', from: 2000001, to: 2400000, rate: 25, condition: '' },
  { id: 'n7', from: 2400001, to: null, rate: 30, condition: '' }
];
const SEED: TaxSlabPack[] = [
  { id: 'SLAB-OLD-2627', name: 'Old Regime FY 2026-27', periodId: 'AY-2026-27', company: 'edumanager', regime: 'Old Regime', effectiveFrom: '2026-04-01', currency: 'INR', status: 'Active', submitted: true, allowExemption: true, standardExemption: 50000, taxReliefLimit: 0, employees: 142, rows: oldRows(), surchargeRate: 10, surchargeThreshold: 5000000, cessPercent: 4, charges: defaultCharges(), exemptions: defaultExemptions() },
  { id: 'SLAB-NEW-2627', name: 'New Regime FY 2026-27', periodId: 'AY-2026-27', company: 'edumanager', regime: 'New Regime', effectiveFrom: '2026-04-01', currency: 'INR', status: 'Active', submitted: true, allowExemption: false, standardExemption: 0, taxReliefLimit: 60000, employees: 105, rows: newRows(), surchargeRate: 10, surchargeThreshold: 5000000, cessPercent: 4, charges: defaultCharges(), exemptions: [{ id: 'e1n', category: 'Standard Deduction', sub: '—', maxAmount: 75000, basedOn: 'Fixed', appliesIf: 'New Regime', oldOnly: false }] }
];
const loadPacks = (): TaxSlabPack[] => {
  try {
    const raw = localStorage.getItem(INCOME_TAX_SLAB_STORE);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED;
  } catch {
    return SEED;
  }
};
const savePacks = (rows: TaxSlabPack[]) => localStorage.setItem(INCOME_TAX_SLAB_STORE, JSON.stringify(rows));

const compute = (gross: number, pack: TaxSlabPack | undefined, declarations: boolean, extra80c: number, extra80d: number) => {
  if (!pack) return { gross, std: 0, d80c: 0, d80d: 0, taxable: gross, tax: 0, rebate: 0, surcharge: 0, cess: 0, total: 0, monthly: 0, rate: 0, remainingMonths: remainingPayrollMonths() };
  const result = calculateIncomeTax({
    pack: pack as TaxPack,
    regime: pack.regime,
    periodId: pack.periodId,
    annualGrossSalary: gross,
    applyDeclarations: declarations,
    deductions: { section80C: extra80c, section80D: extra80d },
    remainingMonths: remainingPayrollMonths()
  });
  return {
    gross: result.grossIncome,
    std: result.standardDeduction,
    d80c: result.deductionsApplied.section80C || 0,
    d80d: result.deductionsApplied.section80D || 0,
    taxable: result.taxableIncome,
    tax: result.taxAfterRebate,
    rebate: result.rebate,
    surcharge: result.surcharge,
    cess: result.cess,
    total: result.finalAnnualTax,
    monthly: result.monthlyTdsEstimate,
    rate: result.effectiveRate,
    remainingMonths: result.remainingMonths
  };
};

const blankPack = (periodId: string, regime: Regime): TaxSlabPack => ({
  id: `SLAB-${Date.now()}`,
  name: `${regime} FY 2026-27`,
  periodId,
  company: 'edumanager',
  regime,
  effectiveFrom: '2026-04-01',
  currency: 'INR',
  status: 'Inactive',
  submitted: false,
  allowExemption: regime !== 'New Regime',
  standardExemption: regime === 'New Regime' ? 0 : 50000,
  taxReliefLimit: regime === 'New Regime' ? 60000 : 0,
  employees: 0,
  rows: regime === 'New Regime' ? newRows() : oldRows(),
  surchargeRate: 10,
  surchargeThreshold: 5000000,
  cessPercent: 4,
  charges: defaultCharges(),
  exemptions: regime === 'New Regime' ? [{ id: 'e1n', category: 'Standard Deduction', sub: '—', maxAmount: 75000, basedOn: 'Fixed', appliesIf: 'New Regime', oldOnly: false }] : defaultExemptions()
});

export function IncomeTaxSlab() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState<TaxSlabPack[]>(() => loadPacks());
  const [periods, setPeriods] = useState<AnnualPeriod[]>(() => loadPeriods());
  const [tab, setTab] = useState('All');
  const [periodFilter, setPeriodFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [draft, setDraft] = useState<TaxSlabPack | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const [notice, setNotice] = useState('');
  const [salary, setSalary] = useState(1200000);
  const [calcRegime, setCalcRegime] = useState<Regime>('Old Regime');
  const [declOn, setDeclOn] = useState(true);
  const [v80c, setV80c] = useState(150000);
  const [v80d, setV80d] = useState(25000);
  const [showCompare, setShowCompare] = useState(false);
  const [previewSalary, setPreviewSalary] = useState(1500000);
  const [gapDelete, setGapDelete] = useState<{ id: string; from: number; to: number | null } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInput, setPreviewInput] = useState('1200000');

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('payroll_period') || '';
    if (param) setPeriodFilter(param);
    setPeriods(loadPeriods());
  }, []);

  const persist = (next: TaxSlabPack[], message?: string) => {
    setPacks(next);
    savePacks(next);
    if (message) setNotice(message);
  };
  const filtered = packs.filter((item) => {
    if (tab !== 'All' && item.regime !== tab) return false;
    if (periodFilter && item.periodId !== periodFilter) return false;
    if (companyFilter !== 'all' && item.company !== companyFilter) return false;
    return true;
  });
  const periodLabel = (id: string) => periods.find((item) => item.id === id)?.name || id;
  const periodRange = (id: string) => {
    const p = periods.find((item) => item.id === id);
    return p ? `${p.startDate} → ${p.endDate}` : '';
  };
  const companyLabel = (value: string) => PAYROLL_COMPANIES.find((item) => item.value === value)?.label || value;
  const patchDraft = (partial: Partial<TaxSlabPack>) => setDraft((current) => current ? { ...current, ...partial } : current);
  const openCreate = () => {
    const periodId = periodFilter || periods[0]?.id || 'AY-2026-27';
    setDraft(blankPack(periodId, 'Old Regime'));
    setMode('form');
  };
  const overlapPair = (rows: SlabRow[]) => {
    const sorted = [...rows].sort((a, b) => a.from - b.from);
    for (let i = 1; i < sorted.length; i += 1) {
      const prev = sorted[i - 1];
      if (prev.to != null && sorted[i].from <= prev.to) return [i, i + 1] as const;
    }
    return null;
  };
  const bandTax = (row: SlabRow) => {
    if (row.to == null) return null;
    const lo = row.from <= 0 ? 0 : row.from - 1;
    return Math.max(0, row.to - lo) * (row.rate / 100);
  };
  const saveDraft = () => {
    if (!draft) return;
    if (draft.submitted) { setNotice('Submitted slabs cannot be edited. Use Amend to create a copy.'); return; }
    if (!draft.name.trim()) { setNotice('Tax slab name is required.'); return; }
    if (!draft.periodId) { setNotice('Payroll period is required.'); return; }
    const overlap = overlapPair(draft.rows);
    if (overlap) { setNotice(`Tax slab ranges overlap between Row ${overlap[0]} and Row ${overlap[1]}. Please correct before saving.`); return; }
    const stdRow = draft.exemptions.find((item) => item.category === 'Standard Deduction');
    const synced = { ...draft, standardExemption: stdRow?.maxAmount ?? draft.standardExemption };
    const exists = packs.some((item) => item.id === synced.id);
    persist(exists ? packs.map((item) => item.id === synced.id ? synced : item) : [...packs, { ...synced, status: synced.status || 'Active' }], 'Tax slab saved.');
    setMode('list');
  };
  const submitDraft = () => {
    if (!draft) return;
    const overlap = overlapPair(draft.rows);
    if (overlap) { setNotice(`Tax slab ranges overlap between Row ${overlap[0]} and Row ${overlap[1]}. Please correct before saving.`); return; }
    const stdRow = draft.exemptions.find((item) => item.category === 'Standard Deduction');
    const next = { ...draft, standardExemption: stdRow?.maxAmount ?? draft.standardExemption, submitted: true, status: 'Active' as const };
    const exists = packs.some((item) => item.id === draft.id);
    persist(exists ? packs.map((item) => item.id === draft.id ? next : item) : [...packs, next], 'Tax slab submitted and locked.');
    setDraft(next);
  };
  const amendDraft = () => {
    if (!draft) return;
    const copy = { ...draft, id: `SLAB-${Date.now()}`, name: `${draft.name} (amendment)`, submitted: false, status: 'Inactive' as const, charges: (draft.charges || defaultCharges()).map((c) => ({ ...c })), rows: draft.rows.map((r) => ({ ...r })), exemptions: draft.exemptions.map((e) => ({ ...e })) };
    setDraft(copy);
    setNotice('Editable amendment copy created. Save when ready.');
  };
  const calcPack = packs.find((item) => item.regime === calcRegime && (!periodFilter || item.periodId === periodFilter)) || (draft && draft.regime === calcRegime ? draft : packs.find((item) => item.regime === calcRegime));
  const result = compute(salary, calcPack, declOn, v80c, v80d);
  const oldResult = compute(salary, packs.find((item) => item.regime === 'Old Regime') || draft, true, v80c, v80d);
  const newResult = compute(salary, packs.find((item) => item.regime === 'New Regime') || draft, false, 0, 0);
  const better = oldResult.total <= newResult.total ? 'Old Regime' : 'New Regime';
  const savedAmt = Math.abs(oldResult.total - newResult.total);
  const chartPoints = [500000, 1000000, 1500000, 2000000, 3000000];
  const chartPack = draft || calcPack;
  const chartMax = Math.max(1, ...chartPoints.map((n) => compute(n, chartPack, declOn, v80c, v80d).total));

  return (
    <div className="space-y-6 p-6">
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}
      {mode === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400">HR &gt; Payroll &gt; Income Tax Slab</p>
              <h1 className="text-2xl font-bold text-gray-900">Income Tax Slabs</h1>
              <p className="text-sm text-gray-500">Configure tax rates applicable to each payroll period.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCompare((v) => !v)}>{compare ? 'Exit compare' : 'Compare regimes'}</Button>
              <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />New Tax Slab</Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
            {['All', 'Old Regime', 'New Regime', 'Custom'].map((item) => (
              <button key={item} type="button" onClick={() => setTab(item)} className={`px-3 py-2 text-sm font-medium border-b-2 ${tab === item ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>{item}</button>
            ))}
            <select className="h-9 rounded-lg border border-gray-300 px-2 text-sm" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
              <option value="">All payroll periods</option>
              {periods.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select className="h-9 rounded-lg border border-gray-300 px-2 text-sm" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
              <option value="all">All companies</option>
              {PAYROLL_COMPANIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <Button variant="outline" size="sm" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Open Payroll Periods</Button>
          </div>
          {filtered.length === 0 && <Card><p className="p-6 text-sm text-gray-500">No tax slabs for this filter. <button type="button" className="text-indigo-700 underline" onClick={openCreate}>Create one</button></p></Card>}
          <div className={`grid gap-4 ${compare ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
            {filtered.map((pack) => {
              const other = filtered.find((item) => item.periodId === pack.periodId && item.regime !== pack.regime);
              const showRows = expanded === pack.id ? pack.rows : pack.rows.slice(0, 3);
              return (
                <Card key={pack.id}>
                  <div className="p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{pack.name}</p>
                        <p className="text-xs text-gray-500">{periodLabel(pack.periodId)} · {companyLabel(pack.company)}</p>
                        <Badge variant={pack.regime === 'Old Regime' ? 'warning' : pack.regime === 'New Regime' ? 'primary' : 'secondary'}>{pack.regime}</Badge>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={pack.status === 'Active' ? 'success' : 'secondary'}>{pack.status}</Badge>
                        <Button size="xs" variant="outline" onClick={() => { setDraft({ ...pack }); setMode('form'); }}><Edit className="w-3 h-3 mr-1" />Edit</Button>
                      </div>
                    </div>
                    <table className="w-full text-xs">
                      <tbody>
                        {showRows.map((row, i) => {
                          const otherRow = compare ? other?.rows[i] : undefined;
                          const diff = otherRow && otherRow.rate !== row.rate;
                          return (
                            <tr key={row.id} className={`${i % 2 ? 'bg-gray-50' : ''} ${diff ? 'bg-amber-50' : ''}`}>
                              <td className="py-1">{inr(row.from)} – {row.to == null ? '∞' : inr(row.to)}</td>
                              <td className="py-1 text-right">{row.rate}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {pack.rows.length > 3 && <button type="button" className="mt-1 text-xs text-indigo-700" onClick={() => setExpanded(expanded === pack.id ? null : pack.id)}>{expanded === pack.id ? 'Show less' : `+ ${pack.rows.length - 3} more slabs`}</button>}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-gray-50 px-4 py-2 text-xs text-gray-600">
                    <span>Employees using this slab: {pack.employees}</span>
                    <div className="flex gap-2">
                      <button type="button" className="text-indigo-700" onClick={() => { setDraft({ ...pack }); setMode('form'); }}>View full slab</button>
                      <button type="button" className="text-indigo-700" onClick={() => navigate('/hr/payroll/employee-pay-structure')}>Assign to employees</button>
                      <button type="button" onClick={() => persist([...packs, { ...pack, id: `SLAB-${Date.now()}`, name: `${pack.name} (copy)`, status: 'Inactive' }], 'Slab duplicated.')}>Duplicate</button>
                      <button type="button" onClick={() => persist(packs.map((item) => item.id === pack.id ? { ...item, status: item.status === 'Active' ? 'Inactive' : 'Active' } : item))}>{pack.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                      <button type="button" className="text-red-600" onClick={() => persist(packs.filter((item) => item.id !== pack.id), 'Slab deleted.')}>Delete</button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {mode === 'form' && draft && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <button type="button" className="text-sm text-indigo-600" onClick={() => setMode('list')}>← Back to Income Tax Slabs</button>
            <Card>
              <div className="grid gap-3 p-4 md:grid-cols-4">
                <Input label="Slab Name *" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} disabled={draft.submitted} />
                <Select label="Company" options={PAYROLL_COMPANIES.map((item) => ({ value: item.value, label: item.label }))} value={draft.company} onChange={(e) => patchDraft({ company: typeof e === 'string' ? e : e.target.value })} />
                <Select label="Payroll period *" options={[{ value: '', label: 'Select period' }, ...periods.map((item) => ({ value: item.id, label: item.name }))]} value={draft.periodId} onChange={(e) => {
                  const id = typeof e === 'string' ? e : e.target.value;
                  const p = periods.find((item) => item.id === id);
                  patchDraft({ periodId: id, effectiveFrom: p?.startDate || draft.effectiveFrom });
                }} />
                <Input label="Effective from *" type="date" value={draft.effectiveFrom} onChange={(e) => patchDraft({ effectiveFrom: e.target.value })} disabled={draft.submitted} />
                <Select label="Currency" options={[{ value: 'INR', label: '₹ INR' }]} value={draft.currency} onChange={(e) => patchDraft({ currency: typeof e === 'string' ? e : e.target.value })} />
                <Toggle label="Is Active" checked={draft.status === 'Active'} onChange={(checked) => patchDraft({ status: checked ? 'Active' : 'Inactive' })} />
                {draft.periodId && <p className="md:col-span-4 text-xs text-gray-500">{periodRange(draft.periodId)}</p>}
                <div className="md:col-span-4 flex flex-wrap gap-2">
                  {(['Old Regime', 'New Regime', 'Custom'] as Regime[]).map((item) => (
                    <button key={item} type="button" className={`rounded-lg border px-3 py-2 text-sm ${draft.regime === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patchDraft({ regime: item, rows: item === 'New Regime' ? newRows() : item === 'Old Regime' ? oldRows() : draft.rows, allowExemption: item !== 'New Regime', standardExemption: item === 'New Regime' ? 0 : 50000, taxReliefLimit: item === 'New Regime' ? 60000 : 0 })}>
                      {item}{item === 'Old Regime' ? ' — with exemptions' : item === 'New Regime' ? ' — lower rates, no 80C/80D' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            <Card title="Tax slab table">
              <div className="overflow-x-auto p-4">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500"><tr><th>#</th><th>From Amount (₹)</th><th>To Amount (₹)</th><th>Tax Rate (%)</th><th>Condition</th><th>Annual Tax Amount</th><th></th></tr></thead>
                  <tbody>
                    {draft.rows.map((row, index) => {
                      const prev = draft.rows[index - 1];
                      const expected = prev && prev.to != null ? prev.to + 1 : row.from;
                      const mismatch = prev && prev.to != null && row.from !== expected;
                      const last = index === draft.rows.length - 1;
                      return (
                        <tr key={row.id} className="border-t">
                          <td className="py-2">{index + 1}</td>
                          <td>
                            <input type="number" className={`h-9 w-36 rounded border px-2 ${mismatch ? 'border-red-400' : 'border-gray-300'}`} value={row.from} onChange={(e) => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, from: Number(e.target.value) || 0 } : item) })} />
                            {mismatch && <button type="button" className="ml-1 text-xs text-red-600" onClick={() => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, from: expected } : item) })}>Fix → {expected}</button>}
                          </td>
                          <td>
                            {last ? <span className="text-gray-400">No upper limit (∞)</span> : <input type="number" className="h-9 w-36 rounded border border-gray-300 px-2" value={row.to ?? ''} onChange={(e) => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, to: e.target.value === '' ? null : Number(e.target.value) } : item) })} />}
                          </td>
                          <td>
                            <input type="number" min={0} max={35} className="h-9 w-20 rounded border border-gray-300 px-2" value={row.rate} onChange={(e) => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, rate: Number(e.target.value) || 0 } : item) })} />
                            {row.rate > 35 && <p className="text-[10px] text-amber-700">Unusual rate</p>}
                          </td>
                          <td><input className="h-9 w-full rounded border border-gray-200 bg-gray-50 px-2 font-mono text-xs" placeholder="e.g. date_of_birth < date(1965, 4, 1)" value={row.condition} onChange={(e) => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, condition: e.target.value } : item) })} disabled={draft.submitted} /></td>
                          <td className="text-xs text-gray-600">{bandTax(row) == null ? '—' : inr(bandTax(row) || 0)}</td>
                          <td><button type="button" disabled={draft.submitted} onClick={() => {
                            const idx = draft.rows.findIndex((item) => item.id === row.id);
                            const prev = draft.rows[idx - 1];
                            const next = draft.rows[idx + 1];
                            if (prev && next) setGapDelete(row);
                            else patchDraft({ rows: draft.rows.filter((item) => item.id !== row.id) });
                          }}><Trash2 className="h-4 w-4 text-red-500" /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Button variant="outline" className="mt-2 w-full" onClick={() => {
                  const last = draft.rows[draft.rows.length - 1];
                  const from = last?.to != null ? last.to + 1 : 0;
                  patchDraft({ rows: [...draft.rows.map((item, i) => i === draft.rows.length - 1 && item.to == null ? { ...item, to: from + 99999 } : item), { id: `r-${Date.now()}`, from, to: null, rate: 0, condition: '' }] });
                }}>+ Add slab row</Button>
                {overlapPair(draft.rows) && <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">Tax slab ranges overlap between Row {overlapPair(draft.rows)?.[0]} and Row {overlapPair(draft.rows)?.[1]}. Please correct before saving.</div>}
                <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm">
                  <p className="mb-2 text-xs uppercase text-violet-700">Surcharge & cess</p>
                  <p>Surcharge (&gt; {inr(draft.surchargeThreshold)}): {draft.surchargeRate}%</p>
                  <p>Health & education cess: {draft.cessPercent}% (always applies)</p>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Taxes and charges on income tax</p>
                  <table className="w-full min-w-[720px] text-sm">
                    <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Description</th><th>Type</th><th>Rate / Amount</th><th>Condition</th><th>Min</th><th>Max</th></tr></thead>
                    <tbody>
                      {(draft.charges || defaultCharges()).map((charge) => (
                        <tr key={charge.id} className="border-t">
                          <td className="py-2"><input className="h-8 w-full rounded border px-2" value={charge.description} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, description: e.target.value } : item) })} /></td>
                          <td>
                            <select className="h-8 rounded border px-1" value={charge.kind} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, kind: e.target.value as TaxCharge['kind'] } : item) })}>
                              <option>Percentage of Tax</option>
                              <option>Flat Amount</option>
                            </select>
                          </td>
                          <td><input type="number" className="h-8 w-20 rounded border px-2" value={charge.rate} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, rate: Number(e.target.value) || 0 } : item) })} /></td>
                          <td><input className="h-8 w-full rounded border px-2 font-mono text-xs" value={charge.condition} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, condition: e.target.value } : item) })} /></td>
                          <td><input type="number" className="h-8 w-24 rounded border px-2" value={charge.minAmount ?? ''} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, minAmount: e.target.value === '' ? null : Number(e.target.value) } : item) })} /></td>
                          <td><input type="number" className="h-8 w-24 rounded border px-2" value={charge.maxAmount ?? ''} disabled={draft.submitted} onChange={(e) => patchDraft({ charges: (draft.charges || defaultCharges()).map((item) => item.id === charge.id ? { ...item, maxAmount: e.target.value === '' ? null : Number(e.target.value) } : item) })} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase text-gray-400">Tax curve preview</p>
                  <div className="flex h-32 items-end gap-2">
                    {chartPoints.map((n) => {
                      const t = compute(n, draft, declOn, v80c, v80d);
                      return (
                        <div key={n} className="flex-1 text-center" title={`Gross ${inr(n)} · Tax ${inr(t.total)} · Effective ${t.rate.toFixed(1)}%`}>
                          <div className="mx-auto w-full rounded-t bg-indigo-500" style={{ height: `${Math.max(8, (t.total / chartMax) * 110)}px` }} />
                          <p className="mt-1 text-[10px] text-gray-500">{inr(n)}</p>
                        </div>
                      );
                    })}
                  </div>
                  <label className="mt-2 block text-xs text-gray-500">Preview salary
                    <input type="range" min={300000} max={3000000} step={50000} value={previewSalary} onChange={(e) => setPreviewSalary(Number(e.target.value))} className="w-full" />
                    {inr(previewSalary)} · tax {inr(compute(previewSalary, draft, declOn, v80c, v80d).total)} · effective {compute(previewSalary, draft, declOn, v80c, v80d).rate.toFixed(1)}%
                  </label>
                </div>
              </div>
            </Card>
            <Card title="Tax exemption settings">
              <div className="grid gap-3 p-4 md:grid-cols-2">
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input type="checkbox" checked={Boolean(draft.allowExemption)} disabled={draft.submitted || draft.regime === 'New Regime'} onChange={(e) => patchDraft({ allowExemption: e.target.checked })} />
                  Allow Tax Exemption {draft.regime === 'New Regime' && <span className="text-xs text-amber-700">(must stay OFF for New Tax Regime)</span>}
                </label>
                <Input label="Standard Tax Exemption Amount" type="number" value={String(draft.standardExemption || 0)} disabled={draft.submitted} onChange={(e) => {
                  const amount = Number(e.target.value) || 0;
                  patchDraft({
                    standardExemption: amount,
                    exemptions: draft.exemptions.map((item) => item.category === 'Standard Deduction' ? { ...item, maxAmount: amount } : item)
                  });
                }} />
                <Input label="Tax Relief Limit (e.g. 87A)" type="number" value={String(draft.taxReliefLimit || 0)} disabled={draft.submitted} onChange={(e) => patchDraft({ taxReliefLimit: Number(e.target.value) || 0 })} />
              </div>
            </Card>
            <Card title="Standard deductions & exemptions">
              <div className={`overflow-x-auto p-4 ${draft.allowExemption ? '' : 'pointer-events-none opacity-50'}`}>
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Category</th><th>Sub-category</th><th>Max amount</th><th>Based on</th><th>Applies if</th></tr></thead>
                  <tbody>
                    {draft.exemptions.map((row) => (
                      <tr key={row.id} className={`border-t ${row.oldOnly && draft.regime === 'New Regime' ? 'bg-amber-50' : ''}`}>
                        <td className="py-2">{row.category}{row.oldOnly && draft.regime === 'New Regime' && <span className="ml-1 text-[10px] text-amber-700">Old regime only</span>}</td>
                        <td>{row.sub}</td>
                        <td><input type="number" className="h-8 w-28 rounded border px-1" disabled={draft.submitted} value={row.maxAmount} onChange={(e) => {
                          const amount = Number(e.target.value) || 0;
                          patchDraft({
                            exemptions: draft.exemptions.map((item) => item.id === row.id ? { ...item, maxAmount: amount } : item),
                            standardExemption: row.category === 'Standard Deduction' ? amount : draft.standardExemption
                          });
                        }} /></td>
                        <td>
                          <select className="h-8 rounded border px-1" value={row.basedOn} onChange={(e) => patchDraft({ exemptions: draft.exemptions.map((item) => item.id === row.id ? { ...item, basedOn: e.target.value as ExemptionRow['basedOn'] } : item) })}>
                            {['Fixed', 'Declared', 'Formula'].map((item) => <option key={item}>{item}</option>)}
                          </select>
                        </td>
                        <td>{row.appliesIf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <div className="flex flex-wrap gap-2">
              <Button onClick={saveDraft} disabled={draft.submitted}><Save className="w-4 h-4 mr-2" />Save</Button>
              <Button variant="outline" onClick={submitDraft} disabled={draft.submitted}>Submit</Button>
              {draft.submitted && <Button variant="outline" onClick={amendDraft}>Amend</Button>}
              <Button variant="outline" onClick={() => setPreviewOpen(true)}>Preview Tax Calculation</Button>
              <Button variant="outline" onClick={() => persist([...packs, { ...draft, id: `SLAB-${Date.now()}`, name: `${draft.name} (copy)`, status: 'Inactive', submitted: false }], 'Slab cloned.')}>Clone Slab</Button>
              <Button variant="outline" onClick={() => setMode('list')}>Cancel</Button>
            </div>
          </div>
          <div>
            <Card title="Tax calculator">
              <div className="space-y-3 p-4 text-sm">
                <p className="text-xs text-gray-400">Live preview based on configured slabs</p>
                <Input label="Annual salary (₹)" type="number" value={String(salary)} onChange={(e) => setSalary(Number(String(e.target.value).replace(/,/g, '')) || 0)} />
                <div className="flex gap-2">
                  {(['Old Regime', 'New Regime'] as Regime[]).map((item) => <button key={item} type="button" className={`rounded-full border px-3 py-1 text-xs ${calcRegime === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => setCalcRegime(item)}>{item}</button>)}
                </div>
                <Toggle label="Declarations applied" checked={declOn} onChange={setDeclOn} />
                {declOn && calcRegime === 'Old Regime' && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-gray-100 px-2 py-1">80C: {inr(v80c)}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-1">80D: {inr(v80d)}</span>
                    <Input label="80C" type="number" value={String(v80c)} onChange={(e) => setV80c(Number(e.target.value) || 0)} />
                    <Input label="80D" type="number" value={String(v80d)} onChange={(e) => setV80d(Number(e.target.value) || 0)} />
                  </div>
                )}
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p>Gross: {inr(result.gross)}</p>
                  <p>Standard deduction: ({inr(result.std)})</p>
                  <p>80C: ({inr(result.d80c)})</p>
                  <p>80D: ({inr(result.d80d)})</p>
                  <p className="font-medium">Net taxable: {inr(result.taxable)}</p>
                  <p>Tax: {inr(result.tax)}</p>
                  <p>Rebate / tax relief: ({inr(result.rebate)})</p>
                  <p>Surcharge: {inr(result.surcharge)}</p>
                  <p>Cess: {inr(result.cess)}</p>
                  <p className="font-semibold">Total tax: {inr(result.total)}</p>
                  <p>Monthly TDS ({result.remainingMonths} remaining months): {inr(result.monthly)}</p>
                  <p>Effective rate: {result.rate.toFixed(2)}% {result.rate <= 10 ? '(green band)' : result.rate <= 20 ? '(amber band)' : '(red band)'}</p>
                </div>
                <Button variant="outline" className="w-full" onClick={() => setShowCompare((v) => !v)}>Compare Old vs New Regime</Button>
                {showCompare && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
                    <p>Old: {inr(oldResult.total)} · New: {inr(newResult.total)}</p>
                    <p className="font-medium">Save {inr(savedAmt)} with {better}.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      <Modal isOpen={Boolean(gapDelete)} onClose={() => setGapDelete(null)} title="Gap detected in slab range" footer={<div className="flex justify-end gap-2"><Button variant="outline" onClick={() => { if (!draft || !gapDelete) return; patchDraft({ rows: draft.rows.filter((item) => item.id !== gapDelete.id) }); setGapDelete(null); }}>Delete without fill</Button><Button onClick={() => {
        if (!draft || !gapDelete) return;
        const idx = draft.rows.findIndex((item) => item.id === gapDelete.id);
        const prev = draft.rows[idx - 1];
        const next = draft.rows[idx + 1];
        const nextRows = draft.rows.filter((item) => item.id !== gapDelete.id).map((item) => item.id === next?.id && prev ? { ...item, from: prev.to != null ? prev.to + 1 : item.from } : item);
        patchDraft({ rows: nextRows });
        setGapDelete(null);
      }}>Auto-fill gap</Button></div>}>
        <p className="text-sm text-gray-600">Deleting a middle row leaves a gap. Auto-fill gap?</p>
      </Modal>
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview tax calculation" footer={<Button onClick={() => setPreviewOpen(false)}>Close</Button>}>
        {draft && (() => {
          const r = compute(Number(previewInput.replace(/,/g, '')) || 0, draft, Boolean(draft.allowExemption), v80c, v80d);
          return (
            <div className="space-y-2 text-sm">
              <Input label="Sample annual salary" value={previewInput} onChange={(e) => setPreviewInput(e.target.value)} />
              <p>Gross {inr(r.gross)}</p>
              <p>Standard deduction ({inr(draft.allowExemption ? r.std : 0)})</p>
              <p>Taxable {inr(r.taxable)}</p>
              <p>Tax {inr(r.tax)}</p>
              <p>Surcharge {inr(r.surcharge)}</p>
              <p>Cess {inr(r.cess)}</p>
              <p>Rebate / tax relief {inr(r.rebate)}</p>
              <p>Relief limit {inr(draft.taxReliefLimit || 0)}</p>
              <p className="font-semibold">Total {inr(r.total)}</p>
              <p>Monthly TDS ({r.remainingMonths} remaining months) {inr(r.monthly)}</p>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default IncomeTaxSlab;
