import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Textarea } from '../../../components/ui/Textarea';
import { Toggle } from '../../../components/ui/Toggle';
import { Modal } from '../../../components/ui/Modal';
import { Copy, Edit, LayoutGrid, List, Plus, Save, Search, Trash2 } from 'lucide-react';

type ComponentType = 'Earning' | 'Deduction' | 'Employer Contribution';
interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: ComponentType;
  description: string;
  calculationType: 'Flat Amount' | 'Formula';
  calculationValue: string;
  condition: string;
  formulaComponents: string[];
  formulaMode: 'percent' | 'sum' | 'days';
  formulaPercent: number;
  accounts: string[];
  company: string;
  dependsOnPaymentDays: boolean;
  dependsOnLwp: boolean;
  isTaxApplicable: boolean;
  variableBasedOnTaxableSalary: boolean;
  isAdditionalComponent: boolean;
  isRecurringAdditional: boolean;
  deductFullTaxOnSelectedPayrollDate: boolean;
  roundToTheNearestInteger: boolean;
  statisticalComponent: boolean;
  accrualComponent: boolean;
  doNotIncludeInTotal: boolean;
  removeIfZeroValued: boolean;
  arrearComponent: boolean;
  disabled: boolean;
  isFlexibleBenefit: boolean;
  payoutMethod: string;
  maxBenefitAmount: number;
  usedIn: number;
  status: 'Active' | 'Inactive';
}

const ACCOUNT_OPTIONS = [
  { value: 'SAL-BASIC', label: '5001 · Salaries & Wages' },
  { value: 'SAL-DA', label: 'SAL-DA · Dearness Allowance' },
  { value: 'SAL-HRA', label: 'SAL-HRA · House Rent Allowance' },
  { value: 'SAL-CONV', label: 'SAL-CONV · Conveyance' },
  { value: 'SAL-PAYABLE', label: 'SAL-PAYABLE · Salary Payable' },
  { value: 'PF-PAYABLE', label: '5010 · PF Contribution' },
  { value: 'ESI-PAYABLE', label: 'ESI-PAYABLE · ESI Payable' },
  { value: 'PT-PAYABLE', label: 'PT-PAYABLE · Professional Tax Payable' },
  { value: 'TDS-PAYABLE', label: 'TDS-PAYABLE · TDS Payable' },
  { value: 'BANK-SAL', label: 'BANK-SAL · Salary Bank Account' }
];
const PAYOUT_METHODS = [
  { value: 'Pay in Salary', label: 'Pay in Salary' },
  { value: 'Reimburse Later', label: 'Reimburse Later' },
  { value: 'Accrue in Benefit Ledger', label: 'Accrue in Benefit Ledger' }
];
const COMPANIES = [
  { value: 'edumanager', label: 'EduManager School' },
  { value: 'city-trust', label: 'City Campus Trust' },
  { value: 'north-society', label: 'North Campus Society' }
];
const CHIPS = ['basic * 0.40', 'basic * 0.12', 'basic * 0.45', 'gross * 0.0075', '(basic / total_working_days) * payment_days'];

const emptyForm = {
  name: '',
  code: '',
  type: 'Earning' as ComponentType,
  description: '',
  calculationType: 'Flat Amount' as 'Flat Amount' | 'Formula',
  calculationValue: '',
  condition: '',
  formulaComponents: [] as string[],
  formulaMode: 'percent' as 'percent' | 'sum' | 'days',
  formulaPercent: 0,
  accounts: [] as string[],
  company: 'edumanager',
  dependsOnPaymentDays: false,
  dependsOnLwp: false,
  isTaxApplicable: false,
  variableBasedOnTaxableSalary: false,
  isAdditionalComponent: false,
  isRecurringAdditional: false,
  deductFullTaxOnSelectedPayrollDate: false,
  roundToTheNearestInteger: false,
  statisticalComponent: false,
  accrualComponent: false,
  doNotIncludeInTotal: false,
  removeIfZeroValued: false,
  arrearComponent: false,
  disabled: false,
  isFlexibleBenefit: false,
  payoutMethod: 'Pay in Salary',
  maxBenefitAmount: 0
};

const baseFlags = {
  formulaComponents: [] as string[],
  formulaMode: 'percent' as const,
  formulaPercent: 0,
  accounts: [] as string[],
  company: 'edumanager',
  dependsOnPaymentDays: false,
  dependsOnLwp: false,
  isTaxApplicable: false,
  variableBasedOnTaxableSalary: false,
  isAdditionalComponent: false,
  isRecurringAdditional: false,
  deductFullTaxOnSelectedPayrollDate: false,
  roundToTheNearestInteger: true,
  statisticalComponent: false,
  accrualComponent: false,
  doNotIncludeInTotal: false,
  removeIfZeroValued: false,
  arrearComponent: false,
  disabled: false,
  isFlexibleBenefit: false,
  payoutMethod: 'Pay in Salary',
  maxBenefitAmount: 0,
  usedIn: 3,
  status: 'Active' as const
};

const mockComponents: SalaryComponent[] = [
  { id: 'SC001', name: 'Basic Pay', code: 'BASIC', type: 'Earning', description: 'Fixed amount per grade', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, accounts: ['SAL-BASIC', 'SAL-PAYABLE'], dependsOnPaymentDays: true, dependsOnLwp: true, isTaxApplicable: true, arrearComponent: true, usedIn: 5 },
  { id: 'SC002', name: 'Dearness Allowance', code: 'DA', type: 'Earning', description: 'Formula: basic * 0.45', calculationType: 'Formula', calculationValue: 'basic * 0.45', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 45, accounts: ['SAL-DA', 'SAL-PAYABLE'], dependsOnPaymentDays: true, dependsOnLwp: true, isTaxApplicable: true, arrearComponent: true },
  { id: 'SC003', name: 'House Rent Allowance', code: 'HRA', type: 'Earning', description: 'basic * 0.40 (metro)', calculationType: 'Formula', calculationValue: 'basic * 0.40', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 40, accounts: ['SAL-HRA'], isTaxApplicable: true, removeIfZeroValued: true, usedIn: 4 },
  { id: 'SC004', name: 'Transport Allowance', code: 'TA', type: 'Earning', description: 'Fixed ₹1,600 / month', calculationType: 'Flat Amount', calculationValue: '1600', condition: '', ...baseFlags, accounts: ['SAL-CONV'], removeIfZeroValued: true },
  { id: 'SC005', name: 'Special Responsibility Allowance', code: 'SRA', type: 'Earning', description: 'For HODs and coordinators', calculationType: 'Flat Amount', calculationValue: '0', condition: 'designation == "Department Head"', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC006', name: 'Teaching Allowance', code: 'TACH', type: 'Earning', description: 'For teachers only', calculationType: 'Flat Amount', calculationValue: '0', condition: 'staff_category == "Teaching Staff"', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC007', name: 'Medical Allowance', code: 'MA', type: 'Earning', description: 'Fixed ₹1,250 / month', calculationType: 'Flat Amount', calculationValue: '1250', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC008', name: 'Children Education Allowance', code: 'CEA', type: 'Earning', description: '₹100 / child / month, up to 2 children', calculationType: 'Flat Amount', calculationValue: '200', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC009', name: 'Performance Bonus', code: 'PBON', type: 'Earning', description: 'Additional component only', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, isAdditionalComponent: true, accounts: ['SAL-PAYABLE'], usedIn: 0 },
  { id: 'SC010', name: 'Leave Travel Allowance', code: 'LTA', type: 'Earning', description: 'Fixed / annual', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC011', name: 'Arrears', code: 'ARR', type: 'Earning', description: 'From payroll correction', calculationType: 'Formula', calculationValue: 'arrear_amount', condition: '', ...baseFlags, arrearComponent: true, accounts: ['SAL-PAYABLE'] },
  { id: 'SC012', name: 'Overtime Pay', code: 'OT', type: 'Earning', description: '(basic / working_days) * ot_hours', calculationType: 'Formula', calculationValue: '(basic / total_working_days) * ot_hours', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC013', name: 'Employee PF', code: 'EPF', type: 'Deduction', description: 'min(basic * 0.12, 1800)', calculationType: 'Formula', calculationValue: 'min(basic * 0.12, 1800)', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 12, accounts: ['PF-PAYABLE'], arrearComponent: true },
  { id: 'SC014', name: 'Employer PF Contribution', code: 'EPFER', type: 'Employer Contribution', description: 'Shown separately; not deducted from take-home', calculationType: 'Formula', calculationValue: 'min(basic * 0.12, 1800)', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 12, accounts: ['PF-PAYABLE'], doNotIncludeInTotal: true, arrearComponent: true },
  { id: 'SC015', name: 'ESI Employee', code: 'ESIE', type: 'Deduction', description: 'gross * 0.0075 if gross <= 21000', calculationType: 'Formula', calculationValue: 'gross * 0.0075', condition: 'gross <= 21000', ...baseFlags, accounts: ['ESI-PAYABLE'], removeIfZeroValued: true },
  { id: 'SC016', name: 'ESI Employer', code: 'ESIER', type: 'Employer Contribution', description: 'gross * 0.0325 if gross <= 21000', calculationType: 'Formula', calculationValue: 'gross * 0.0325', condition: 'gross <= 21000', ...baseFlags, accounts: ['ESI-PAYABLE'], doNotIncludeInTotal: true },
  { id: 'SC017', name: 'Professional Tax', code: 'PT', type: 'Deduction', description: 'Slab-based by state', calculationType: 'Flat Amount', calculationValue: '200', condition: '', ...baseFlags, accounts: ['PT-PAYABLE'], removeIfZeroValued: true },
  { id: 'SC018', name: 'Income Tax / TDS', code: 'TDS', type: 'Deduction', description: 'Variable based on taxable salary', calculationType: 'Formula', calculationValue: 'taxable_salary', condition: '', ...baseFlags, accounts: ['TDS-PAYABLE'], variableBasedOnTaxableSalary: true, isTaxApplicable: true },
  { id: 'SC019', name: 'Loan EMI Deduction', code: 'LOAN', type: 'Deduction', description: 'Links to Employee Loan record', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC020', name: 'Leave Without Pay', code: 'LWP', type: 'Deduction', description: '(basic / working_days) * lwp_days', calculationType: 'Formula', calculationValue: '(basic / total_working_days) * lwp_days', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC021', name: 'Salary Advance Recovery', code: 'SAR', type: 'Deduction', description: 'Fixed monthly recovery', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] }
];

function typeColor(type: string): 'success' | 'danger' | 'info' | 'secondary' {
  if (type === 'Earning') return 'success';
  if (type === 'Deduction') return 'danger';
  if (type === 'Employer Contribution') return 'info';
  return 'secondary';
}

function buildFormula(codes: string[], mode: 'percent' | 'sum' | 'days', percent: number, freeText: string) {
  if (freeText.trim()) return freeText.trim();
  if (!codes.length) return '';
  const joined = codes.join(' + ');
  if (mode === 'sum') return `(${joined})`;
  if (mode === 'days') return `(${joined}) * payment_days / total_working_days`;
  return `(${joined}) * ${(percent || 0) / 100}`;
}

function evalSimple(expr: string, vars: Record<string, number>) {
  let out = expr.replace(/×/g, '*').replace(/min\s*\(/g, 'Math.min(').replace(/max\s*\(/g, 'Math.max(');
  Object.keys(vars).sort((a, b) => b.length - a.length).forEach((key) => {
    out = out.replace(new RegExp(`\\b${key}\\b`, 'g'), String(vars[key]));
  });
  const safe = out.replace(/\bMath\.min\b/g, 'Mathmin').replace(/\bMath\.max\b/g, 'Mathmax');
  if (!/^[0-9+\-*/().,<>=!\s]+$/.test(safe.replace(/Mathmin|Mathmax/g, ''))) return { ok: false, value: 0, error: 'Use * for multiply. Unknown tokens were blocked.' };
  try {
    const value = Function(`"use strict"; return (${out});`)();
    return typeof value === 'number' && Number.isFinite(value) ? { ok: true, value, error: '' } : { ok: false, value: 0, error: 'Formula did not return a number.' };
  } catch (err) {
    return { ok: false, value: 0, error: err instanceof Error ? err.message : 'Formula error' };
  }
}

export function PayHeadMaster() {
  const navigate = useNavigate();
  const [components, setComponents] = useState(mockComponents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [formulaSearch, setFormulaSearch] = useState(false);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [lab, setLab] = useState({ basic: 50000, gross: 85000, total_working_days: 26, payment_days: 24, lwp: 2, result: '', error: '' });
  const [deactivate, setDeactivate] = useState<SalaryComponent | null>(null);
  const [deactMode, setDeactMode] = useState<'zero' | 'remove'>('zero');
  const [syncOpen, setSyncOpen] = useState(false);

  const componentOptions = useMemo(
    () => components.filter((c) => c.code !== form.code).map((c) => ({ value: c.code, label: `${c.name} (${c.code})` })),
    [components, form.code]
  );
  const formulaPreview = form.calculationType === 'Formula'
    ? buildFormula(form.formulaComponents, form.formulaMode, form.formulaPercent, form.calculationValue)
    : form.calculationValue;
  const abbrClash = form.code.trim() && components.some((c) => c.id !== editId && (
    c.calculationValue.toLowerCase().includes(form.code.toLowerCase()) || c.formulaComponents.includes(form.code)
  ));
  const filtered = components.filter((c) => {
    const q = search.toLowerCase();
    const hay = `${c.name} ${c.code} ${formulaSearch ? `${c.calculationValue} ${c.condition}` : ''}`.toLowerCase();
    const matchSearch = !q || hay.includes(q);
    const matchType = !typeFilter || c.type === typeFilter || (typeFilter === 'Deduction' && c.type === 'Employer Contribution');
    return matchSearch && matchType;
  });
  const earnings = filtered.filter((c) => c.type === 'Earning');
  const deductions = filtered.filter((c) => c.type !== 'Earning');

  const resetForm = () => { setForm(emptyForm); setShowForm(false); setEditId(null); };
  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) { setNotice('Component name and abbreviation are required.'); return; }
    const calculationValue = form.calculationType === 'Formula' ? formulaPreview : form.calculationValue;
    const payload = { ...form, calculationValue, status: form.disabled ? 'Inactive' as const : 'Active' as const, usedIn: components.find((c) => c.id === editId)?.usedIn || 0 };
    if (editId) setComponents((prev) => prev.map((c) => (c.id === editId ? { ...c, ...payload } : c)));
    else setComponents((prev) => [...prev, { ...payload, id: `SC${Date.now()}` }]);
    setNotice(editId ? 'Component updated. Future slips use the new formula; past slips are preserved.' : 'Component created.');
    resetForm();
  };
  const fillForm = (c: SalaryComponent, asCopy = false) => {
    setForm({
      name: asCopy ? `${c.name} (Copy)` : c.name,
      code: asCopy ? `${c.code}_COPY` : c.code,
      type: c.type,
      description: c.description,
      calculationType: c.calculationType,
      calculationValue: c.calculationValue,
      condition: c.condition,
      formulaComponents: c.formulaComponents,
      formulaMode: c.formulaMode,
      formulaPercent: c.formulaPercent,
      accounts: c.accounts,
      company: c.company,
      dependsOnPaymentDays: c.dependsOnPaymentDays,
      dependsOnLwp: c.dependsOnLwp,
      isTaxApplicable: c.isTaxApplicable,
      variableBasedOnTaxableSalary: c.variableBasedOnTaxableSalary,
      isAdditionalComponent: c.isAdditionalComponent,
      isRecurringAdditional: c.isRecurringAdditional,
      deductFullTaxOnSelectedPayrollDate: c.deductFullTaxOnSelectedPayrollDate,
      roundToTheNearestInteger: c.roundToTheNearestInteger,
      statisticalComponent: c.statisticalComponent,
      accrualComponent: c.accrualComponent,
      doNotIncludeInTotal: c.doNotIncludeInTotal,
      removeIfZeroValued: c.removeIfZeroValued,
      arrearComponent: c.arrearComponent,
      disabled: c.disabled,
      isFlexibleBenefit: c.isFlexibleBenefit,
      payoutMethod: c.payoutMethod,
      maxBenefitAmount: c.maxBenefitAmount
    });
    setEditId(asCopy ? null : c.id);
    setShowForm(true);
  };
  const runLab = () => {
    const expr = formulaPreview || '0';
    const cond = form.condition.trim();
    const vars = { basic: lab.basic, gross: lab.gross, total_working_days: lab.total_working_days, payment_days: lab.payment_days, lwp: lab.lwp };
    if (cond) {
      const condEval = evalSimple(cond.replace(/==/g, '===').replace(/designation|staff_category|employee\.grade/g, '1'), vars);
      if (!condEval.ok) { setLab((s) => ({ ...s, error: condEval.error, result: '' })); return; }
    }
    const out = evalSimple(expr, vars);
    setLab((s) => ({ ...s, error: out.ok ? '' : out.error, result: out.ok ? String(Math.round(out.value)) : '' }));
  };

  const FlagCard = ({ on, title, helper, onToggle, children }: { on: boolean; title: string; helper: string; onToggle: (v: boolean) => void; children?: React.ReactNode }) => (
    <label className={`flex cursor-pointer flex-col rounded-xl border p-3 ${on ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
      <span className="flex items-start justify-between gap-2">
        <span>
          <span className="block text-sm font-medium text-gray-800">{title}</span>
          <span className="mt-0.5 block text-xs text-gray-500">{helper}</span>
        </span>
        <input type="checkbox" className="mt-1 h-4 w-4" checked={on} onChange={(e) => onToggle(e.target.checked)} />
      </span>
      {on && children}
    </label>
  );

  const ComponentCard = ({ c }: { c: SalaryComponent }) => (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${c.disabled ? 'opacity-70' : ''}`}>
      <div className={`h-1.5 ${c.type === 'Earning' ? 'bg-emerald-500' : 'bg-red-500'}`} />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Badge variant={typeColor(c.type)}>{c.type === 'Earning' ? 'EARNING ↑' : c.type === 'Deduction' ? 'DEDUCTION ↓' : 'EMPLOYER'}</Badge>
          <button type="button" className={`h-2.5 w-2.5 rounded-full ${c.disabled ? 'bg-gray-300' : 'bg-emerald-500'}`} title={c.disabled ? 'Disabled' : 'Active'} onClick={() => setDeactivate(c)} />
        </div>
        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
        <div className="flex flex-wrap gap-1">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-mono text-[10px] text-indigo-700">{c.code}</span>
          {c.isTaxApplicable && <Badge variant="warning">Tax</Badge>}
          {c.dependsOnLwp && <Badge variant="info">LWP</Badge>}
          {c.isAdditionalComponent && <Badge variant="secondary">Add-on</Badge>}
          {c.doNotIncludeInTotal && <Badge variant="secondary">Not in total</Badge>}
        </div>
        <p className="rounded bg-gray-50 px-2 py-1 font-mono text-[11px] text-gray-700">{c.calculationType === 'Formula' ? c.calculationValue : `₹ ${Number(c.calculationValue || 0).toLocaleString('en-IN')}/month`}</p>
        {c.accounts[0] && <p className="text-[11px] text-gray-400">→ {ACCOUNT_OPTIONS.find((a) => a.value === c.accounts[0])?.label || c.accounts[0]}</p>}
      </div>
      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-2 text-[11px] text-gray-500">
        <span>Used in {c.usedIn} structures</span>
        <span className="flex gap-1">
          <button type="button" onClick={() => fillForm(c)} className="rounded p-1 hover:bg-blue-100" title="Edit"><Edit className="h-3.5 w-3.5 text-blue-600" /></button>
          <button type="button" onClick={() => fillForm(c, true)} className="rounded p-1 hover:bg-gray-100" title="Clone"><Copy className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => setComponents((prev) => prev.filter((item) => item.id !== c.id))} className="rounded p-1 hover:bg-red-100" title="Delete"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">HR &gt; Payroll &gt; Salary Components</p>
          <h1 className="text-2xl font-bold text-gray-900">Salary Component Library</h1>
          <p className="text-sm text-gray-500">Building blocks for salary structures and salary slips. Saving a component does not process payroll.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setNotice('Component import accepted for demonstration.')}>Import Components</Button>
          <Button variant="outline" onClick={() => setNotice('Component list exported.')}>Export All</Button>
          <Button variant="outline" onClick={() => navigate('/hr/master/salary-structure-master')}>Build Salary Structures</Button>
          <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" />New Component</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      {!showForm && (
        <>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
            {[{ id: '', label: `All (${components.length})` }, { id: 'Earning', label: `Earnings (${components.filter((c) => c.type === 'Earning').length})` }, { id: 'Deduction', label: `Deductions (${components.filter((c) => c.type !== 'Earning').length})` }].map((item) => (
              <button key={item.id || 'all'} type="button" onClick={() => setTypeFilter(item.id)} className={`rounded-full border px-3 py-1.5 text-sm ${typeFilter === item.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300 bg-white text-gray-700'}`}>{item.label}</button>
            ))}
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, abbreviation, or formula..." className="h-9 w-full rounded-full border border-gray-300 pl-9 pr-3 text-sm" />
            </div>
            <Toggle label="Search by formula" checked={formulaSearch} onChange={setFormulaSearch} />
            <button type="button" className={`rounded-lg border p-2 ${view === 'card' ? 'border-indigo-600 text-indigo-700' : 'border-gray-300'}`} onClick={() => setView('card')} title="Card view"><LayoutGrid className="h-4 w-4" /></button>
            <button type="button" className={`rounded-lg border p-2 ${view === 'table' ? 'border-indigo-600 text-indigo-700' : 'border-gray-300'}`} onClick={() => setView('table')} title="Table view"><List className="h-4 w-4" /></button>
            {view === 'table' && selected.length > 0 && (
              <Button size="sm" variant="outline" onClick={() => { setComponents((prev) => prev.map((c) => selected.includes(c.id) ? { ...c, disabled: true, status: 'Inactive' } : c)); setSelected([]); setNotice(`${selected.length} component(s) disabled.`); }}>Bulk Disable</Button>
            )}
          </div>

          {view === 'card' ? (
            <div className="space-y-6">
              {(!typeFilter || typeFilter === 'Earning') && (
                <div>
                  <p className="mb-3 border-l-2 border-emerald-300 pl-2 text-xs font-semibold uppercase text-emerald-700">↑ Earnings · {earnings.length} components</p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{earnings.map((c) => <ComponentCard key={c.id} c={c} />)}</div>
                </div>
              )}
              {(!typeFilter || typeFilter === 'Deduction') && (
                <div>
                  <p className="mb-3 border-l-2 border-red-300 pl-2 text-xs font-semibold uppercase text-red-700">↓ Deductions · {deductions.length} components</p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{deductions.map((c) => <ComponentCard key={c.id} c={c} />)}</div>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && filtered.every((c) => selected.includes(c.id))} onChange={(e) => setSelected(e.target.checked ? filtered.map((c) => c.id) : [])} /></th>
                      <th className="px-3 py-3 text-left">Name</th>
                      <th className="px-3 py-3">Abbr</th>
                      <th className="px-3 py-3">Type</th>
                      <th className="px-3 py-3 text-left">Formula</th>
                      <th className="px-3 py-3">Tax</th>
                      <th className="px-3 py-3">LWP</th>
                      <th className="px-3 py-3">Used in</th>
                      <th className="px-3 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 text-center"><input type="checkbox" checked={selected.includes(c.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id))} /></td>
                        <td className="px-3 py-2 font-medium">{c.name}</td>
                        <td className="px-3 py-2 text-center font-mono text-xs">{c.code}</td>
                        <td className="px-3 py-2 text-center"><Badge variant={typeColor(c.type)}>{c.type}</Badge></td>
                        <td className="px-3 py-2 font-mono text-xs">{c.calculationValue || c.calculationType}</td>
                        <td className="px-3 py-2 text-center">{c.isTaxApplicable ? 'Yes' : '—'}</td>
                        <td className="px-3 py-2 text-center">{c.dependsOnLwp ? 'Yes' : '—'}</td>
                        <td className="px-3 py-2 text-center">{c.usedIn}</td>
                        <td className="px-3 py-2 text-center">
                          <button type="button" onClick={() => fillForm(c)} className="p-1"><Edit className="inline h-4 w-4 text-blue-600" /></button>
                          <button type="button" onClick={() => fillForm(c, true)} className="p-1"><Copy className="inline h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {showForm && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <button type="button" className="text-sm text-indigo-600" onClick={resetForm}>← Back to library</button>
            {editId && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">This component may exist in submitted salary slips. Editing the formula affects future slips only.</div>}
            <Card title={editId ? form.name || 'Edit Salary Component' : 'New Salary Component'}>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-5">
                  <div className="md:col-span-3">
                    <Input label="Component name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Employee Provident Fund" />
                    <p className="mt-1 rounded border border-dashed border-gray-200 bg-gray-50 px-2 py-1 text-[11px] text-gray-500">Salary slip preview: [ {form.name || 'Component'} ..... ₹{form.calculationType === 'Flat Amount' ? form.calculationValue || '0' : 'calc'} ]</p>
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Abbreviation * (used in formulas)" value={form.code} maxLength={10} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g., EPF" />
                    <p className="mt-1 text-[11px] text-gray-400">{form.code.length}/10</p>
                    {abbrClash && <p className="text-xs text-red-600">This abbreviation is referenced in another formula. Changing it can break existing structures.</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['Earning', 'Deduction'] as const).map((item) => (
                    <button key={item} type="button" onClick={() => setForm({ ...form, type: item })} className={`flex-1 rounded-full border px-3 py-2 text-sm ${form.type === item ? (item === 'Earning' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-red-600 bg-red-600 text-white') : 'border-gray-300'}`}>{item === 'Earning' ? '↑ Earning' : '↓ Deduction'}</button>
                  ))}
                </div>
                <Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="grid gap-3 md:grid-cols-2">
                  <button type="button" onClick={() => setForm({ ...form, calculationType: 'Flat Amount' })} className={`rounded-xl border p-4 text-left ${form.calculationType === 'Flat Amount' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                    <p className="font-medium">Fixed amount</p>
                    <p className="text-xs text-gray-500">Same every month, e.g. ₹1,600 TA</p>
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, calculationType: 'Formula' })} className={`rounded-xl border p-4 text-left ${form.calculationType === 'Formula' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                    <p className="font-medium">Formula-based</p>
                    <p className="text-xs text-gray-500">Calculated from other components</p>
                  </button>
                </div>
                {form.calculationType === 'Flat Amount' && <Input label="Amount (₹)" type="number" value={form.calculationValue} onChange={(e) => setForm({ ...form, calculationValue: e.target.value })} />}
                {form.calculationType === 'Formula' && (
                  <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                    <Textarea label="Apply condition (optional)" rows={2} className="font-mono" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="e.g. gross <= 21000" />
                    <Textarea label="Formula *" rows={3} className="font-mono" value={form.calculationValue} onChange={(e) => setForm({ ...form, calculationValue: e.target.value })} placeholder="e.g. basic * 0.40" />
                    <div className="flex flex-wrap gap-2">{CHIPS.map((chip) => <button key={chip} type="button" className="rounded bg-slate-800 px-2 py-1 font-mono text-[11px] text-slate-100" onClick={() => setForm({ ...form, calculationValue: chip })}>{chip}</button>)}</div>
                    <MultiSelect label="Salary components used (optional builder)" options={componentOptions} value={form.formulaComponents} onChange={(codes) => setForm({ ...form, formulaComponents: codes })} placeholder="Select components in this formula" />
                    <p className="rounded bg-gray-50 px-3 py-2 text-sm">Formula: <span className="font-medium">{formulaPreview || 'Enter a formula'}</span></p>
                    {editId && <Button variant="warning" onClick={() => setSyncOpen(true)}>Update formula in all salary structures using this component</Button>}
                  </div>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  <FlagCard on={form.isTaxApplicable} title="Taxable component" helper="Included in annual tax computation" onToggle={(v) => setForm({ ...form, isTaxApplicable: v })} />
                  <FlagCard on={form.dependsOnLwp} title="Pro-rate on leaves" helper="Deducted proportionally on LWP days" onToggle={(v) => setForm({ ...form, dependsOnLwp: v })}>
                    <p className="mt-2 font-mono text-[11px] text-gray-600">(Amount / total_working_days) × lwp_days</p>
                  </FlagCard>
                  <FlagCard on={form.doNotIncludeInTotal} title="Informational only" helper="Shown on slip but excluded from totals" onToggle={(v) => setForm({ ...form, doNotIncludeInTotal: v })} />
                  <FlagCard on={form.variableBasedOnTaxableSalary} title="Auto-compute tax (TDS)" helper="Only for the Income Tax component." onToggle={(v) => setForm({ ...form, variableBasedOnTaxableSalary: v })}>
                    <p className="mt-2 text-xs text-amber-800">Enable this on only one component in each structure.</p>
                  </FlagCard>
                  <FlagCard on={form.isAdditionalComponent} title="Additional salary only" helper="Cannot be added to salary structures." onToggle={(v) => setForm({ ...form, isAdditionalComponent: v, isRecurringAdditional: v ? form.isRecurringAdditional : false })} />
                  <FlagCard on={form.isRecurringAdditional} title="Can recur monthly" helper="When added as Additional Salary" onToggle={(v) => form.isAdditionalComponent && setForm({ ...form, isRecurringAdditional: v })} />
                  <FlagCard on={form.isFlexibleBenefit} title="Is flexible benefit" helper="Shows payout method and max benefit" onToggle={(v) => setForm({ ...form, isFlexibleBenefit: v })} />
                  <FlagCard on={form.disabled} title="Disabled" helper="Next slips show ₹0 for this component" onToggle={(v) => setForm({ ...form, disabled: v })} />
                </div>
                {form.isFlexibleBenefit && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Select label="Payout method" options={PAYOUT_METHODS} value={form.payoutMethod} onChange={(v) => setForm({ ...form, payoutMethod: typeof v === 'string' ? v : v.target.value })} />
                    <Input label="Max benefit amount (yearly)" type="number" value={form.maxBenefitAmount} onChange={(e) => setForm({ ...form, maxBenefitAmount: parseFloat(e.target.value) || 0 })} />
                  </div>
                )}
                <MultiSelect label="Default account(s)" options={ACCOUNT_OPTIONS} value={form.accounts} onChange={(accounts) => setForm({ ...form, accounts })} placeholder="Select account(s)" />
                <Select label="Company" options={COMPANIES} value={form.company} onChange={(v) => setForm({ ...form, company: typeof v === 'string' ? v : v.target.value })} />
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />{editId ? 'Save' : 'Save component'}</Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                  {editId && <Button variant="outline" onClick={() => navigate('/hr/master/salary-structure-master')}>View in structures</Button>}
                </div>
              </div>
            </Card>
          </div>
          <div>
            <Card title="Formula testing lab">
              <div className="space-y-3 text-sm">
                <p className="text-xs text-gray-400">Test your formula before saving</p>
                {(['basic', 'gross', 'total_working_days', 'payment_days', 'lwp'] as const).map((key) => (
                  <Input key={key} label={key} type="number" value={lab[key]} onChange={(e) => setLab({ ...lab, [key]: Number(e.target.value) || 0 })} />
                ))}
                <Button className="w-full" onClick={runLab}>Run formula</Button>
                {lab.result && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">Component amount: ₹{Number(lab.result).toLocaleString('en-IN')}/month<br />Annual: ₹{(Number(lab.result) * 12).toLocaleString('en-IN')}</div>}
                {lab.error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{lab.error}</div>}
                {!formulaPreview && <p className="text-xs text-gray-400">Enter a formula above to test.</p>}
              </div>
            </Card>
          </div>
        </div>
      )}

      <Modal isOpen={!!deactivate} onClose={() => setDeactivate(null)} title={`Deactivating '${deactivate?.name || ''}'`} footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeactivate(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => {
            if (!deactivate) return;
            if (deactMode === 'remove') setComponents((prev) => prev.filter((item) => item.id !== deactivate.id));
            else setComponents((prev) => prev.map((item) => item.id === deactivate.id ? { ...item, disabled: true, status: 'Inactive' } : item));
            setNotice(deactMode === 'remove' ? 'Component removed from the library.' : 'Component deactivated. Next slips show ₹0.');
            setDeactivate(null);
          }}>Confirm deactivation</Button>
        </div>
      }>
        <p className="mb-3 text-sm text-gray-700">This component is used in {deactivate?.usedIn || 0} salary structures. Deactivating shows ₹0 on the next month’s slips.</p>
        <label className="mb-2 flex items-center gap-2 text-sm"><input type="radio" checked={deactMode === 'zero'} onChange={() => setDeactMode('zero')} /> Deactivate (keep in structures, show ₹0)</label>
        <label className="flex items-center gap-2 text-sm"><input type="radio" checked={deactMode === 'remove'} onChange={() => setDeactMode('remove')} /> Remove from library</label>
      </Modal>

      <Modal isOpen={syncOpen} onClose={() => setSyncOpen(false)} title="Update salary structures" footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSyncOpen(false)}>Cancel</Button>
          <Button onClick={() => { setSyncOpen(false); setNotice('Condition and formula values were marked for sync. Existing employee assignments are not rewritten.'); }}>Confirm update</Button>
        </div>
      }>
        <p className="text-sm text-gray-700">This updates the formula in structures that use this component. Active employees’ next salary slip will use the new formula.</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
          <li>Teaching Staff — Permanent</li>
          <li>Non-Teaching Staff — Admin</li>
        </ul>
      </Modal>
    </div>
  );
}

export default PayHeadMaster;
