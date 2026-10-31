import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Plus, Edit, Trash2, Save, Search, X } from 'lucide-react';

interface StructureRow {
  id: string;
  component: string;
  abbr: string;
  amount: number;
  condition: string;
  formula: string;
  dependsOnPaymentDays: boolean;
  isTaxApplicable: boolean;
  accrualComponent: boolean;
}

interface BenefitRow {
  id: string;
  earningComponent: string;
  benefitAmount: number;
}

type StructureStatus = 'Draft' | 'Submitted' | 'Amended';

interface SalaryStructure {
  id: string;
  name: string;
  code: string;
  company: string;
  leaveEncashmentAmountPerDay: number;
  maxBenefits: number;
  salarySlipBasedOnTimesheet: boolean;
  payrollFrequency: string;
  modeOfPayment: string;
  paymentAccount: string;
  isActive: boolean;
  status: StructureStatus;
  earnings: StructureRow[];
  deductions: StructureRow[];
  employerContributions: StructureRow[];
  flexibleBenefits: BenefitRow[];
}

const COMPONENT_OPTIONS = [
  { value: 'BASIC', label: 'Basic Pay', abbr: 'BASIC', type: 'Earning' },
  { value: 'DA', label: 'Dearness Allowance', abbr: 'DA', type: 'Earning' },
  { value: 'HRA', label: 'House Rent Allowance', abbr: 'HRA', type: 'Earning' },
  { value: 'TA', label: 'Transport Allowance', abbr: 'TA', type: 'Earning' },
  { value: 'SRA', label: 'Special Responsibility Allowance', abbr: 'SRA', type: 'Earning' },
  { value: 'TACH', label: 'Teaching Allowance', abbr: 'TACH', type: 'Earning' },
  { value: 'MA', label: 'Medical Allowance', abbr: 'MA', type: 'Earning' },
  { value: 'CEA', label: 'Children Education Allowance', abbr: 'CEA', type: 'Earning' },
  { value: 'PBON', label: 'Performance Bonus', abbr: 'PBON', type: 'Earning' },
  { value: 'LTA', label: 'Leave Travel Allowance', abbr: 'LTA', type: 'Earning' },
  { value: 'ARR', label: 'Arrears', abbr: 'ARR', type: 'Earning' },
  { value: 'OT', label: 'Overtime Pay', abbr: 'OT', type: 'Earning' },
  { value: 'EPF', label: 'Employee PF', abbr: 'EPF', type: 'Deduction' },
  { value: 'ESIE', label: 'ESI Employee', abbr: 'ESIE', type: 'Deduction' },
  { value: 'PT', label: 'Professional Tax', abbr: 'PT', type: 'Deduction' },
  { value: 'TDS', label: 'Income Tax / TDS', abbr: 'TDS', type: 'Deduction' },
  { value: 'LOAN', label: 'Loan EMI Deduction', abbr: 'LOAN', type: 'Deduction' },
  { value: 'LWP', label: 'Leave Without Pay', abbr: 'LWP', type: 'Deduction' },
  { value: 'SAR', label: 'Salary Advance Recovery', abbr: 'SAR', type: 'Deduction' },
  { value: 'EPFER', label: 'Employer PF Contribution', abbr: 'EPFER', type: 'Employer Contribution' },
  { value: 'ESIER', label: 'ESI Employer', abbr: 'ESIER', type: 'Employer Contribution' }
];

const FREQUENCY = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Fortnightly', label: 'Fortnightly' },
  { value: 'Bi-Monthly', label: 'Bi-Monthly' },
  { value: 'Quarterly', label: 'Quarterly' }
];

const PAYMENT_MODES = [
  { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Cash', label: 'Cash' }
];

const PAYMENT_ACCOUNTS = [
  { value: 'BANK-SAL', label: 'BANK-SAL · Salary Bank Account' },
  { value: 'SAL-PAYABLE', label: 'SAL-PAYABLE · Salary Payable' },
  { value: 'CASH', label: 'CASH · Cash Account' }
];

const COMPANIES = [
  { value: 'edumanager', label: 'EduManager School' },
  { value: 'city-trust', label: 'City Campus Trust' }
];

const emptyRow = (): StructureRow => ({
  id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  component: '',
  abbr: '',
  amount: 0,
  condition: '',
  formula: '',
  dependsOnPaymentDays: false,
  isTaxApplicable: false,
  accrualComponent: false
});

const emptyBenefit = (): BenefitRow => ({
  id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  earningComponent: '',
  benefitAmount: 0
});

const row = (component: string, amount: number, extra: Partial<StructureRow> = {}): StructureRow => {
  const found = COMPONENT_OPTIONS.find((c) => c.value === component);
  return { ...emptyRow(), component, abbr: found?.abbr || component, amount, isTaxApplicable: found?.type === 'Earning', ...extra };
};

const INITIAL: SalaryStructure[] = [
  {
    id: 'SS001', name: 'Teaching Staff - Permanent', code: 'TSP-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 850, maxBenefits: 50000, salarySlipBasedOnTimesheet: false, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 25000, { dependsOnPaymentDays: true, isTaxApplicable: true }), row('DA', 0, { formula: 'basic * 0.45', isTaxApplicable: true }), row('HRA', 0, { formula: 'basic * 0.40', isTaxApplicable: true }), row('TA', 1600), row('TACH', 2000), row('MA', 1250)],
    deductions: [row('EPF', 0, { formula: 'min(basic * 0.12, 1800)' }), row('PT', 200), row('TDS', 0, { formula: 'taxable_salary' })],
    employerContributions: [row('EPFER', 0, { formula: 'min(basic * 0.12, 1800)', accrualComponent: true })],
    flexibleBenefits: []
  },
  {
    id: 'SS002', name: 'Teaching Staff - Contractual', code: 'TSC-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 0, maxBenefits: 0, salarySlipBasedOnTimesheet: false, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 18000, { dependsOnPaymentDays: true }), row('HRA', 0, { formula: 'basic * 0.20' }), row('TA', 1600)],
    deductions: [row('EPF', 0, { formula: 'min(basic * 0.12, 1800)' }), row('PT', 200)],
    employerContributions: [],
    flexibleBenefits: []
  },
  {
    id: 'SS003', name: 'Visiting Faculty - Hourly', code: 'VFH-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 0, maxBenefits: 0, salarySlipBasedOnTimesheet: true, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 0, { formula: 'hourly_rate * timesheet_hours' }), row('OT', 0, { formula: '(basic / total_working_days) * ot_hours' })],
    deductions: [row('TDS', 0, { formula: 'taxable_salary' })],
    employerContributions: [],
    flexibleBenefits: []
  },
  {
    id: 'SS004', name: 'Non-Teaching Staff - Admin', code: 'NTA-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 600, maxBenefits: 20000, salarySlipBasedOnTimesheet: false, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 22000, { dependsOnPaymentDays: true }), row('DA', 0, { formula: 'basic * 0.45' }), row('HRA', 0, { formula: 'basic * 0.20' }), row('TA', 1600), row('MA', 1250)],
    deductions: [row('EPF', 0, { formula: 'min(basic * 0.12, 1800)' }), row('PT', 200)],
    employerContributions: [row('EPFER', 0, { formula: 'min(basic * 0.12, 1800)', accrualComponent: true })],
    flexibleBenefits: []
  },
  {
    id: 'SS005', name: 'Non-Teaching Staff - Support', code: 'NTS-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 400, maxBenefits: 0, salarySlipBasedOnTimesheet: false, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 14000, { dependsOnPaymentDays: true }), row('TA', 1600)],
    deductions: [row('EPF', 0, { formula: 'min(basic * 0.12, 1800)' }), row('ESIE', 0, { formula: 'gross * 0.0075', condition: 'gross <= 21000' }), row('PT', 200)],
    employerContributions: [row('ESIER', 0, { formula: 'gross * 0.0325', condition: 'gross <= 21000' })],
    flexibleBenefits: []
  },
  {
    id: 'SS006', name: 'Management Cadre', code: 'MGT-2026', company: 'edumanager', leaveEncashmentAmountPerDay: 1200, maxBenefits: 80000, salarySlipBasedOnTimesheet: false, payrollFrequency: 'Monthly', modeOfPayment: 'Bank Transfer (NEFT/RTGS)', paymentAccount: 'BANK-SAL', isActive: true, status: 'Submitted',
    earnings: [row('BASIC', 45000, { dependsOnPaymentDays: true }), row('DA', 0, { formula: 'basic * 0.45' }), row('HRA', 0, { formula: 'basic * 0.40' }), row('SRA', 5000, { condition: 'designation in ["HOD","Coordinator","Incharge"]' }), row('MA', 1250), row('LTA', 3000)],
    deductions: [row('EPF', 0, { formula: 'min(basic * 0.12, 1800)' }), row('TDS', 0, { formula: 'taxable_salary' }), row('PT', 200)],
    employerContributions: [row('EPFER', 0, { formula: 'min(basic * 0.12, 1800)', accrualComponent: true })],
    flexibleBenefits: []
  }
];

function inr(n: number) {
  return `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function optionsFor(type: string) {
  return [{ value: '', label: 'Select component' }, ...COMPONENT_OPTIONS.filter((c) => c.type === type).map((c) => ({ value: c.value, label: `${c.label} (${c.abbr})` }))];
}

function applyComponent(rowItem: StructureRow, value: string, expectedType: string): { row: StructureRow; error: string } {
  const found = COMPONENT_OPTIONS.find((c) => c.value === value);
  if (found && found.type !== expectedType) return { row: rowItem, error: `Component type mismatch. ${found.label} is ${found.type}, not ${expectedType}.` };
  return { row: { ...rowItem, component: value, abbr: found?.abbr || '' }, error: '' };
}

function evalSimple(formula: string, basic: number, gross: number) {
  if (!formula.trim()) return 0;
  const expr = formula
    .replace(/min\(([^,]+),\s*([^)]+)\)/g, (_, a, b) => `Math.min(${a},${b})`)
    .replace(/\bbasic\b/g, String(basic))
    .replace(/\bgross\b/g, String(gross))
    .replace(/\btotal_working_days\b/g, '26')
    .replace(/\bpayment_days\b/g, '26')
    .replace(/\blwp_days\b/g, '0')
    .replace(/\bot_hours\b/g, '0')
    .replace(/\btimesheet_hours\b/g, '0')
    .replace(/\bhourly_rate\b/g, '0')
    .replace(/\btaxable_salary\b/g, '0')
    .replace(/\barrear_amount\b/g, '0');
  if (!/^[\d\s+\-*/().,Mathmin]+$/.test(expr.replace(/Math\.min/g, 'Mathmin'))) return 0;
  try {
    // eslint-disable-next-line no-new-func
    const value = Function(`"use strict"; return (${expr});`)();
    return Number.isFinite(value) ? Number(value) : 0;
  } catch {
    return 0;
  }
}

export function SalaryStructureMaster() {
  const navigate = useNavigate();
  const [structures, setStructures] = useState<SalaryStructure[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [company, setCompany] = useState('edumanager');
  const [leaveEncashment, setLeaveEncashment] = useState(0);
  const [maxBenefits, setMaxBenefits] = useState(0);
  const [timesheet, setTimesheet] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');
  const [modeOfPayment, setModeOfPayment] = useState('Bank Transfer (NEFT/RTGS)');
  const [paymentAccount, setPaymentAccount] = useState('BANK-SAL');
  const [isActive, setIsActive] = useState(true);
  const [status, setStatus] = useState<StructureStatus>('Draft');
  const [earnings, setEarnings] = useState<StructureRow[]>([emptyRow()]);
  const [deductions, setDeductions] = useState<StructureRow[]>([emptyRow()]);
  const [employer, setEmployer] = useState<StructureRow[]>([emptyRow()]);
  const [benefits, setBenefits] = useState<BenefitRow[]>([emptyBenefit()]);
  const [rowError, setRowError] = useState('');
  const [basePreview, setBasePreview] = useState(25000);
  const [notice, setNotice] = useState('');

  const filtered = structures.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
  });

  const preview = useMemo(() => {
    const earn = earnings.filter((r) => r.component).reduce((sum, r) => {
      if (r.amount) return sum + r.amount;
      return sum + evalSimple(r.formula, basePreview, basePreview);
    }, 0);
    const gross = earn;
    const deduct = deductions.filter((r) => r.component).reduce((sum, r) => {
      if (r.amount) return sum + r.amount;
      return sum + evalSimple(r.formula, basePreview, gross);
    }, 0);
    const net = gross - deduct;
    const rate = gross ? (deduct / gross) * 100 : 0;
    return { gross, deduct, net, rate };
  }, [earnings, deductions, basePreview]);

  const reset = () => {
    setShowForm(false);
    setEditId(null);
    setName('');
    setCode('');
    setCompany('edumanager');
    setLeaveEncashment(0);
    setMaxBenefits(0);
    setTimesheet(false);
    setFrequency('Monthly');
    setModeOfPayment('Bank Transfer (NEFT/RTGS)');
    setPaymentAccount('BANK-SAL');
    setIsActive(true);
    setStatus('Draft');
    setEarnings([emptyRow()]);
    setDeductions([emptyRow()]);
    setEmployer([emptyRow()]);
    setBenefits([emptyBenefit()]);
    setRowError('');
  };

  const openCreate = () => { reset(); setShowForm(true); setStatus('Draft'); };
  const openEdit = (s: SalaryStructure) => {
    setEditId(s.id);
    setName(s.name);
    setCode(s.code);
    setCompany(s.company);
    setLeaveEncashment(s.leaveEncashmentAmountPerDay);
    setMaxBenefits(s.maxBenefits);
    setTimesheet(s.salarySlipBasedOnTimesheet);
    setFrequency(s.payrollFrequency);
    setModeOfPayment(s.modeOfPayment);
    setPaymentAccount(s.paymentAccount);
    setIsActive(s.isActive);
    setStatus(s.status);
    setEarnings(s.earnings.length ? s.earnings : [emptyRow()]);
    setDeductions(s.deductions.length ? s.deductions : [emptyRow()]);
    setEmployer(s.employerContributions.length ? s.employerContributions : [emptyRow()]);
    setBenefits(s.flexibleBenefits.length ? s.flexibleBenefits : [emptyBenefit()]);
    setShowForm(true);
  };

  const save = (nextStatus?: StructureStatus) => {
    if (!name.trim() || !code.trim()) { setNotice('Structure name is required.'); return; }
    const resolved = nextStatus || status;
    const next: SalaryStructure = {
      id: editId || `SS${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      company,
      leaveEncashmentAmountPerDay: leaveEncashment,
      maxBenefits,
      salarySlipBasedOnTimesheet: timesheet,
      payrollFrequency: frequency,
      modeOfPayment,
      paymentAccount,
      isActive,
      status: resolved,
      earnings: earnings.filter((r) => r.component),
      deductions: deductions.filter((r) => r.component),
      employerContributions: employer.filter((r) => r.component),
      flexibleBenefits: benefits.filter((r) => r.earningComponent)
    };
    setStructures((prev) => (editId ? prev.map((s) => (s.id === editId ? next : s)) : [...prev, next]));
    setNotice(resolved === 'Submitted' ? 'Structure submitted. It can be assigned to employees. To edit later, amend it.' : 'Draft saved. Draft structures cannot be assigned.');
    reset();
  };

  const amend = (s: SalaryStructure) => {
    setStructures((prev) => prev.map((item) => item.id === s.id ? { ...item, status: 'Amended', isActive: false } : item));
    openEdit({ ...s, id: `SS${Date.now()}`, status: 'Draft', name: `${s.name} (amended)` });
    setNotice('Previous version cancelled. Re-assign employees after submitting the new version.');
  };

  const setComponent = (
    setRows: React.Dispatch<React.SetStateAction<StructureRow[]>>,
    rowId: string,
    value: string,
    type: string
  ) => {
    setRows((prev) => prev.map((r) => {
      if (r.id !== rowId) return r;
      const result = applyComponent(r, value, type);
      setRowError(result.error);
      return result.error ? r : result.row;
    }));
  };

  const renderRows = (
    title: string,
    rows: StructureRow[],
    setRows: React.Dispatch<React.SetStateAction<StructureRow[]>>,
    type: string
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Button variant="outline" size="xs" onClick={() => setRows((prev) => [...prev, emptyRow()])}><Plus className="h-3.5 w-3.5" /> Add row</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">No.</th>
              <th className="px-3 py-2">Component</th>
              <th className="px-3 py-2">Abbr</th>
              <th className="px-3 py-2">Condition</th>
              <th className="px-3 py-2">Formula</th>
              <th className="px-3 py-2">Amount (INR)</th>
              <th className="px-3 py-2">Tax</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                <td className="px-3 py-2 min-w-[220px]">
                  <Select options={optionsFor(type)} value={item.component} onChange={(v) => setComponent(setRows, item.id, v, type)} />
                </td>
                <td className="px-3 py-2 w-24"><Input value={item.abbr} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, abbr: e.target.value } : r)))} /></td>
                <td className="px-3 py-2 min-w-[160px]"><Input value={item.condition} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, condition: e.target.value } : r)))} placeholder="optional override" /></td>
                <td className="px-3 py-2 min-w-[180px]"><Input value={item.formula} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, formula: e.target.value } : r)))} placeholder="optional override" /></td>
                <td className="px-3 py-2 w-32"><Input type="number" value={item.amount} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, amount: parseFloat(e.target.value) || 0 } : r)))} /></td>
                <td className="px-3 py-2 text-center"><input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={item.isTaxApplicable} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === item.id ? { ...r, isTaxApplicable: e.target.checked } : r)))} /></td>
                <td className="px-3 py-2">
                  {rows.length > 1 && (
                    <button type="button" className="rounded p-1 hover:bg-red-50" onClick={() => setRows((prev) => prev.filter((r) => r.id !== item.id))}><Trash2 className="h-4 w-4 text-red-500" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">Row order affects formula sequence. Put Basic before components that reference basic.</p>
    </div>
  );

  const readOnly = status === 'Submitted' && Boolean(editId) && structures.find((s) => s.id === editId)?.status === 'Submitted';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">HR &gt; Payroll &gt; Salary Structure</p>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structure Master</h1>
          <p className="text-sm text-gray-500">Earnings, deductions, payroll frequency and payment mode. School structures are listed per staff category.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/hr/payroll/employee-pay-structure')}>Assign to Employees</Button>
          <Button variant="primary" onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Salary Structure</Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search salary structures" className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-3 py-2">Structure</th>
                <th className="px-3 py-2">Frequency</th>
                <th className="px-3 py-2">Mode of payment</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.code}{s.salarySlipBasedOnTimesheet ? ' · Timesheet' : ''}{s.isActive ? '' : ' · Inactive'}</p>
                  </td>
                  <td className="px-3 py-2">{s.payrollFrequency}</td>
                  <td className="px-3 py-2">{s.modeOfPayment}</td>
                  <td className="px-3 py-2"><Badge variant={s.status === 'Submitted' ? 'success' : s.status === 'Draft' ? 'warning' : 'secondary'}>{s.status}</Badge></td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" className="rounded p-1.5 hover:bg-blue-50" onClick={() => openEdit(s)}><Edit className="h-4 w-4 text-blue-600" /></button>
                      {s.status === 'Submitted' && <button type="button" className="rounded px-2 text-xs text-indigo-700 hover:bg-indigo-50" onClick={() => amend(s)}>Amend</button>}
                      {s.status === 'Draft' && <button type="button" className="rounded p-1.5 hover:bg-red-50" onClick={() => setStructures((prev) => prev.filter((item) => item.id !== s.id))}><Trash2 className="h-4 w-4 text-red-500" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-500">No salary structures yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>

      {showForm && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card title={editId ? 'Edit Salary Structure' : 'Add Salary Structure'}>
              <div className="space-y-5 p-4">
                {rowError && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{rowError}</p>}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input label="Salary Structure Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Teaching Staff - Permanent" disabled={readOnly} />
                  <Input label="Code *" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. TSP-2026" disabled={readOnly} />
                  <Select label="Company" options={COMPANIES} value={company} onChange={setCompany} />
                  <Select label="Payroll Frequency" options={FREQUENCY} value={frequency} onChange={setFrequency} />
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800">
                    <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    Is Active (inactive cannot be assigned to new employees)
                  </label>
                  <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800">
                    <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={timesheet} onChange={(e) => setTimesheet(e.target.checked)} />
                    Based on Timesheet (visiting / hourly faculty only)
                  </label>
                  <Select label="Mode of Payment" options={PAYMENT_MODES} value={modeOfPayment} onChange={setModeOfPayment} />
                  <Select label="Payment Account" options={PAYMENT_ACCOUNTS} value={paymentAccount} onChange={setPaymentAccount} />
                  <Input label="Leave Encashment Amount Per Day (INR)" type="number" value={leaveEncashment} onChange={(e) => setLeaveEncashment(parseFloat(e.target.value) || 0)} />
                  <Input label="Max Benefits (Amount) (INR)" type="number" value={maxBenefits} onChange={(e) => setMaxBenefits(parseFloat(e.target.value) || 0)} />
                </div>
                {timesheet && <p className="text-xs text-amber-800">Timesheet structures replace standard earnings with timesheet hours. Payroll Entry only picks timesheets for that period.</p>}
                {modeOfPayment.startsWith('Bank') && <p className="text-xs text-gray-500">Bank transfer (ECS / NEFT / RTGS) is the school default under CBSE affiliation bye-laws.</p>}

                {!timesheet && renderRows('Earnings', earnings, setEarnings, 'Earning')}
                {timesheet && <p className="rounded-lg border border-dashed border-gray-300 p-3 text-sm text-gray-600">Earnings table is replaced by a Timesheet link for this structure.</p>}
                {renderRows('Deductions', deductions, setDeductions, 'Deduction')}
                {renderRows('Employer Contributions', employer, setEmployer, 'Employer Contribution')}

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={reset}><X className="h-4 w-4 mr-1" />Cancel</Button>
                  <Button variant="outline" onClick={() => save('Draft')} disabled={readOnly}><Save className="h-4 w-4 mr-2" />Save Draft</Button>
                  <Button variant="primary" onClick={() => save('Submitted')} disabled={readOnly}>Submit</Button>
                </div>
                {readOnly && <p className="text-xs text-gray-500">Submitted structures are read-only. Use Amend to create a new version.</p>}
              </div>
            </Card>
          </div>
          <div>
            <Card title="Structure preview">
              <div className="space-y-3 p-4 text-sm">
                <Input label="Hypothetical basic / base amount" type="number" value={basePreview} onChange={(e) => setBasePreview(parseFloat(e.target.value) || 0)} />
                <div className="rounded-lg bg-indigo-50 p-3">
                  <p>Gross earnings: {inr(preview.gross)}</p>
                  <p>Total deductions: {inr(preview.deduct)}</p>
                  <p className="font-semibold">Net pay: {inr(preview.net)}</p>
                  <p>Effective deduction rate: {preview.rate.toFixed(1)}%</p>
                </div>
                <p className="text-xs text-gray-500">Illustration only. Actual slips use attendance, leave, tax slab and additional salary. This does not assign the structure.</p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/hr/payroll/employee-pay-structure')}>View assignments</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryStructureMaster;
