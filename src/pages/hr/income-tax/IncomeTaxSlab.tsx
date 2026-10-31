import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { PAYROLL_COMPANIES } from '../payroll/PayrollSetup';
import { ANNUAL_PERIOD_STORE, INCOME_TAX_SLAB_STORE, type AnnualPeriod } from '../payroll/PayrollCalendarPeriodMaster';

type Regime = 'Old Regime' | 'New Regime' | 'Custom';
type SlabRow = { id: string; from: number; to: number | null; rate: number; condition: string };
type ExemptionRow = { id: string; category: string; sub: string; maxAmount: number; basedOn: 'Fixed' | 'Declared' | 'Formula'; appliesIf: string; oldOnly: boolean };
export type TaxSlabPack = {
  id: string;
  name: string;
  periodId: string;
  company: string;
  regime: Regime;
  effectiveFrom: string;
  currency: string;
  status: 'Active' | 'Inactive';
  employees: number;
  rows: SlabRow[];
  surchargeRate: number;
  surchargeThreshold: number;
  cessPercent: number;
  exemptions: ExemptionRow[];
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const FALLBACK_PERIODS: AnnualPeriod[] = [
  { id: 'AY-2026-27', name: 'AY 2026-27 Payroll Period', company: 'edumanager', financialYear: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', status: 'Active', declarationStart: '2026-04-15', declarationEnd: '2026-11-30', hasSalarySlips: true, description: '' }
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
const defaultExemptions = (): ExemptionRow[] => [
  { id: 'e1', category: 'Standard Deduction', sub: '—', maxAmount: 75000, basedOn: 'Fixed', appliesIf: 'Old Regime only', oldOnly: true },
  { id: 'e2', category: 'HRA Exemption', sub: '80GG / Actual', maxAmount: 0, basedOn: 'Formula', appliesIf: 'Declared', oldOnly: true },
  { id: 'e3', category: '80C', sub: 'ELSS/PPF/LIC', maxAmount: 150000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e4', category: '80D', sub: 'Medical Insurance', maxAmount: 25000, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true },
  { id: 'e5', category: 'LTA', sub: 'Leave Travel', maxAmount: 0, basedOn: 'Declared', appliesIf: 'Old Regime', oldOnly: true }
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
  { id: 'SLAB-OLD-2627', name: 'Old Regime FY 2026-27', periodId: 'AY-2026-27', company: 'edumanager', regime: 'Old Regime', effectiveFrom: '2026-04-01', currency: 'INR', status: 'Active', employees: 142, rows: oldRows(), surchargeRate: 10, surchargeThreshold: 5000000, cessPercent: 4, exemptions: defaultExemptions() },
  { id: 'SLAB-NEW-2627', name: 'New Regime FY 2026-27', periodId: 'AY-2026-27', company: 'edumanager', regime: 'New Regime', effectiveFrom: '2026-04-01', currency: 'INR', status: 'Active', employees: 105, rows: newRows(), surchargeRate: 10, surchargeThreshold: 5000000, cessPercent: 4, exemptions: [{ id: 'e1n', category: 'Standard Deduction', sub: '—', maxAmount: 75000, basedOn: 'Fixed', appliesIf: 'New Regime', oldOnly: false }] }
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

const taxOn = (income: number, rows: SlabRow[]) => {
  let tax = 0;
  [...rows].sort((a, b) => a.from - b.from).forEach((row) => {
    const hi = row.to == null ? income : row.to;
    const lo = row.from === 0 ? 0 : row.from - 1;
    const amount = Math.max(0, Math.min(income, hi) - lo);
    tax += amount * (row.rate / 100);
  });
  return tax;
};
const compute = (gross: number, pack: TaxSlabPack | undefined, declarations: boolean, extra80c: number, extra80d: number) => {
  if (!pack) return { gross, std: 0, d80c: 0, d80d: 0, taxable: gross, tax: 0, surcharge: 0, cess: 0, total: 0, monthly: 0, rate: 0 };
  const std = pack.exemptions.find((item) => item.category === 'Standard Deduction')?.maxAmount || 0;
  const d80c = declarations && pack.regime === 'Old Regime' ? extra80c : 0;
  const d80d = declarations && pack.regime === 'Old Regime' ? extra80d : 0;
  const taxable = Math.max(0, gross - std - d80c - d80d);
  const tax = taxOn(taxable, pack.rows);
  const surcharge = taxable > pack.surchargeThreshold ? tax * (pack.surchargeRate / 100) : 0;
  const cess = (tax + surcharge) * (pack.cessPercent / 100);
  const total = tax + surcharge + cess;
  return { gross, std, d80c, d80d, taxable, tax, surcharge, cess, total, monthly: total / 12, rate: gross ? (total / gross) * 100 : 0 };
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
  employees: 0,
  rows: regime === 'New Regime' ? newRows() : oldRows(),
  surchargeRate: 10,
  surchargeThreshold: 5000000,
  cessPercent: 4,
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
  const saveDraft = () => {
    if (!draft) return;
    if (!draft.name.trim()) { setNotice('Tax slab name is required.'); return; }
    if (!draft.periodId) { setNotice('Payroll period is required.'); return; }
    const exists = packs.some((item) => item.id === draft.id);
    persist(exists ? packs.map((item) => item.id === draft.id ? draft : item) : [...packs, { ...draft, status: 'Active' }], 'Tax slab saved.');
    setMode('list');
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
                <Input label="Tax slab name *" value={draft.name} onChange={(e) => patchDraft({ name: e.target.value })} />
                <Select label="Payroll period *" options={[{ value: '', label: 'Select period' }, ...periods.map((item) => ({ value: item.id, label: item.name }))]} value={draft.periodId} onChange={(e) => {
                  const id = typeof e === 'string' ? e : e.target.value;
                  const p = periods.find((item) => item.id === id);
                  patchDraft({ periodId: id, effectiveFrom: p?.startDate || draft.effectiveFrom });
                }} />
                <Input label="Effective from *" type="date" value={draft.effectiveFrom} onChange={(e) => patchDraft({ effectiveFrom: e.target.value })} />
                <Select label="Currency" options={[{ value: 'INR', label: '₹ INR' }]} value={draft.currency} onChange={(e) => patchDraft({ currency: typeof e === 'string' ? e : e.target.value })} />
                {draft.periodId && <p className="md:col-span-4 text-xs text-gray-500">{periodRange(draft.periodId)}</p>}
                <div className="md:col-span-4 flex flex-wrap gap-2">
                  {(['Old Regime', 'New Regime', 'Custom'] as Regime[]).map((item) => (
                    <button key={item} type="button" className={`rounded-lg border px-3 py-2 text-sm ${draft.regime === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => patchDraft({ regime: item, rows: item === 'New Regime' ? newRows() : item === 'Old Regime' ? oldRows() : draft.rows })}>
                      {item}{item === 'Old Regime' ? ' — with exemptions' : item === 'New Regime' ? ' — lower rates, no 80C/80D' : ''}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            <Card title="Tax slab table">
              <div className="overflow-x-auto p-4">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500"><tr><th>#</th><th>Income from (₹)</th><th>Income to (₹)</th><th>Tax rate (%)</th><th>Condition</th><th></th></tr></thead>
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
                          <td><input className="h-9 w-full rounded border border-gray-200 bg-gray-50 px-2 font-mono text-xs" placeholder="e.g. annual_taxable_earning > 500000" value={row.condition} onChange={(e) => patchDraft({ rows: draft.rows.map((item) => item.id === row.id ? { ...item, condition: e.target.value } : item) })} /></td>
                          <td><button type="button" onClick={() => patchDraft({ rows: draft.rows.filter((item) => item.id !== row.id) })}><Trash2 className="h-4 w-4 text-red-500" /></button></td>
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
                <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 p-3 text-sm">
                  <p className="mb-2 text-xs uppercase text-violet-700">Surcharge & cess</p>
                  <p>Surcharge (&gt; {inr(draft.surchargeThreshold)}): {draft.surchargeRate}%</p>
                  <p>Health & education cess: {draft.cessPercent}% (always applies)</p>
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
            <Card title="Standard deductions & exemptions">
              <div className="overflow-x-auto p-4">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="text-left text-xs uppercase text-gray-500"><tr><th>Category</th><th>Sub-category</th><th>Max amount</th><th>Based on</th><th>Applies if</th></tr></thead>
                  <tbody>
                    {draft.exemptions.map((row) => (
                      <tr key={row.id} className={`border-t ${row.oldOnly && draft.regime === 'New Regime' ? 'bg-amber-50' : ''}`}>
                        <td className="py-2">{row.category}{row.oldOnly && draft.regime === 'New Regime' && <span className="ml-1 text-[10px] text-amber-700">Old regime only</span>}</td>
                        <td>{row.sub}</td>
                        <td>{row.maxAmount ? inr(row.maxAmount) : '—'}</td>
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
            <div className="flex gap-2">
              <Button onClick={saveDraft}><Save className="w-4 h-4 mr-2" />Save slab</Button>
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
                  <p>Surcharge: {inr(result.surcharge)}</p>
                  <p>Cess: {inr(result.cess)}</p>
                  <p className="font-semibold">Total tax: {inr(result.total)}</p>
                  <p>Monthly TDS: {inr(result.monthly)}</p>
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
    </div>
  );
}

export default IncomeTaxSlab;
