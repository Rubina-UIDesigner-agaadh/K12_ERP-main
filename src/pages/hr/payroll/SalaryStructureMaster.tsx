import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Plus, Edit, Trash2, Save, Search, X } from 'lucide-react';

interface StructureRow {
  id: string;
  component: string;
  abbr: string;
  amount: number;
  dependsOnPaymentDays: boolean;
  isTaxApplicable: boolean;
  accrualComponent: boolean;
}

interface BenefitRow {
  id: string;
  earningComponent: string;
  benefitAmount: number;
}

interface SalaryStructure {
  id: string;
  name: string;
  code: string;
  leaveEncashmentAmountPerDay: number;
  maxBenefits: number;
  salarySlipBasedOnTimesheet: boolean;
  payrollFrequency: string;
  modeOfPayment: string;
  paymentAccount: string;
  earnings: StructureRow[];
  deductions: StructureRow[];
  employerContributions: StructureRow[];
  flexibleBenefits: BenefitRow[];
}

const COMPONENT_OPTIONS = [
  { value: 'BASIC', label: 'Basic Salary', abbr: 'BASIC', type: 'Earning' },
  { value: 'DA', label: 'Dearness Allowance', abbr: 'DA', type: 'Earning' },
  { value: 'HRA', label: 'House Rent Allowance', abbr: 'HRA', type: 'Earning' },
  { value: 'CONV', label: 'Conveyance Allowance', abbr: 'CONV', type: 'Earning' },
  { value: 'SPECIAL', label: 'Special Allowance', abbr: 'SA', type: 'Earning' },
  { value: 'PF_EMP', label: 'Provident Fund (Employee)', abbr: 'PF', type: 'Deduction' },
  { value: 'ESI_EMP', label: 'ESI (Employee)', abbr: 'ESI', type: 'Deduction' },
  { value: 'PT', label: 'Professional Tax', abbr: 'PT', type: 'Deduction' },
  { value: 'TDS', label: 'TDS', abbr: 'TDS', type: 'Deduction' },
  { value: 'PF_ER', label: 'Provident Fund (Employer)', abbr: 'PF-ER', type: 'Employer Contribution' },
  { value: 'ESI_ER', label: 'ESI (Employer)', abbr: 'ESI-ER', type: 'Employer Contribution' },
  { value: 'GRATUITY', label: 'Gratuity Accrual', abbr: 'GR', type: 'Employer Contribution' },
];

const FREQUENCY = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Fortnightly', label: 'Fortnightly' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bimonthly', label: 'Bimonthly' },
];

const PAYMENT_MODES = [
  { value: 'Bank Transfer (NEFT/RTGS)', label: 'Bank Transfer (NEFT/RTGS)' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
];

const PAYMENT_ACCOUNTS = [
  { value: 'BANK-SAL', label: 'BANK-SAL · Salary Bank Account' },
  { value: 'SAL-PAYABLE', label: 'SAL-PAYABLE · Salary Payable' },
  { value: 'CASH', label: 'CASH · Cash Account' },
  { value: 'PETTY', label: 'PETTY · Petty Cash' },
];

const emptyRow = (): StructureRow => ({
  id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  component: '',
  abbr: '',
  amount: 0,
  dependsOnPaymentDays: false,
  isTaxApplicable: false,
  accrualComponent: false,
});

const emptyBenefit = (): BenefitRow => ({
  id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  earningComponent: '',
  benefitAmount: 0,
});

const INITIAL: SalaryStructure[] = [
  {
    id: 'SS001',
    name: 'Teaching Staff Structure',
    code: 'TSS-2026',
    leaveEncashmentAmountPerDay: 850,
    maxBenefits: 50000,
    salarySlipBasedOnTimesheet: false,
    payrollFrequency: 'Monthly',
    modeOfPayment: 'Bank Transfer (NEFT/RTGS)',
    paymentAccount: 'BANK-SAL',
    earnings: [
      { id: 'e1', component: 'BASIC', abbr: 'BASIC', amount: 25000, dependsOnPaymentDays: true, isTaxApplicable: true, accrualComponent: false },
      { id: 'e2', component: 'HRA', abbr: 'HRA', amount: 10000, dependsOnPaymentDays: false, isTaxApplicable: true, accrualComponent: false },
    ],
    deductions: [
      { id: 'd1', component: 'PF_EMP', abbr: 'PF', amount: 1800, dependsOnPaymentDays: false, isTaxApplicable: false, accrualComponent: false },
    ],
    employerContributions: [
      { id: 'c1', component: 'PF_ER', abbr: 'PF-ER', amount: 1800, dependsOnPaymentDays: false, isTaxApplicable: false, accrualComponent: true },
    ],
    flexibleBenefits: [
      { id: 'f1', earningComponent: 'CONV', benefitAmount: 19200 },
    ],
  },
];

function inr(n: number) {
  return `₹ ${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function optionsFor(type: string) {
  return [
    { value: '', label: 'Select component' },
    ...COMPONENT_OPTIONS.filter((c) => c.type === type).map((c) => ({ value: c.value, label: `${c.label} (${c.abbr})` })),
  ];
}

function applyComponent(row: StructureRow, value: string): StructureRow {
  const found = COMPONENT_OPTIONS.find((c) => c.value === value);
  return { ...row, component: value, abbr: found?.abbr || '' };
}

export function SalaryStructureMaster() {
  const [structures, setStructures] = useState<SalaryStructure[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [leaveEncashment, setLeaveEncashment] = useState(0);
  const [maxBenefits, setMaxBenefits] = useState(0);
  const [timesheet, setTimesheet] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');
  const [modeOfPayment, setModeOfPayment] = useState('Bank Transfer (NEFT/RTGS)');
  const [paymentAccount, setPaymentAccount] = useState('BANK-SAL');
  const [earnings, setEarnings] = useState<StructureRow[]>([emptyRow()]);
  const [deductions, setDeductions] = useState<StructureRow[]>([emptyRow()]);
  const [employer, setEmployer] = useState<StructureRow[]>([emptyRow()]);
  const [benefits, setBenefits] = useState<BenefitRow[]>([emptyBenefit()]);

  const filtered = structures.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
  });

  const reset = () => {
    setShowForm(false);
    setEditId(null);
    setName('');
    setCode('');
    setLeaveEncashment(0);
    setMaxBenefits(0);
    setTimesheet(false);
    setFrequency('Monthly');
    setModeOfPayment('Bank Transfer (NEFT/RTGS)');
    setPaymentAccount('BANK-SAL');
    setEarnings([emptyRow()]);
    setDeductions([emptyRow()]);
    setEmployer([emptyRow()]);
    setBenefits([emptyBenefit()]);
  };

  const openCreate = () => {
    reset();
    setShowForm(true);
  };

  const openEdit = (s: SalaryStructure) => {
    setEditId(s.id);
    setName(s.name);
    setCode(s.code);
    setLeaveEncashment(s.leaveEncashmentAmountPerDay);
    setMaxBenefits(s.maxBenefits);
    setTimesheet(s.salarySlipBasedOnTimesheet);
    setFrequency(s.payrollFrequency);
    setModeOfPayment(s.modeOfPayment);
    setPaymentAccount(s.paymentAccount);
    setEarnings(s.earnings.length ? s.earnings : [emptyRow()]);
    setDeductions(s.deductions.length ? s.deductions : [emptyRow()]);
    setEmployer(s.employerContributions.length ? s.employerContributions : [emptyRow()]);
    setBenefits(s.flexibleBenefits.length ? s.flexibleBenefits : [emptyBenefit()]);
    setShowForm(true);
  };

  const save = () => {
    if (!name.trim() || !code.trim()) return;
    const next: SalaryStructure = {
      id: editId || `SS${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      leaveEncashmentAmountPerDay: leaveEncashment,
      maxBenefits,
      salarySlipBasedOnTimesheet: timesheet,
      payrollFrequency: frequency,
      modeOfPayment,
      paymentAccount,
      earnings: earnings.filter((r) => r.component),
      deductions: deductions.filter((r) => r.component),
      employerContributions: employer.filter((r) => r.component),
      flexibleBenefits: benefits.filter((r) => r.earningComponent),
    };
    setStructures((prev) => (editId ? prev.map((s) => (s.id === editId ? next : s)) : [...prev, next]));
    reset();
  };

  const renderRows = (
    title: string,
    rows: StructureRow[],
    setRows: React.Dispatch<React.SetStateAction<StructureRow[]>>,
    type: string,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Button variant="outline" size="xs" onClick={() => setRows((prev) => [...prev, emptyRow()])}>
          <Plus className="h-3.5 w-3.5" /> Add row
        </Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2">No.</th>
              <th className="px-3 py-2">Component</th>
              <th className="px-3 py-2">Abbr</th>
              <th className="px-3 py-2">Amount (INR)</th>
              <th className="px-3 py-2">Depends on Payment Days</th>
              <th className="px-3 py-2">Is Tax Applicable</th>
              <th className="px-3 py-2">Accrual Component</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="border-t">
                <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                <td className="px-3 py-2 min-w-[220px]">
                  <Select
                    options={optionsFor(type)}
                    value={row.component}
                    onChange={(v) => setRows((prev) => prev.map((r) => (r.id === row.id ? applyComponent(r, v) : r)))}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input value={row.abbr} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, abbr: e.target.value } : r)))} />
                </td>
                <td className="px-3 py-2 w-36">
                  <Input
                    type="number"
                    value={row.amount}
                    onChange={(e) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, amount: parseFloat(e.target.value) || 0 } : r)))}
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={row.dependsOnPaymentDays} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, dependsOnPaymentDays: e.target.checked } : r)))} />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={row.isTaxApplicable} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isTaxApplicable: e.target.checked } : r)))} />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={row.accrualComponent} onChange={(e) => setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, accrualComponent: e.target.checked } : r)))} />
                </td>
                <td className="px-3 py-2">
                  {rows.length > 1 && (
                    <button type="button" className="rounded p-1 hover:bg-red-50" onClick={() => setRows((prev) => prev.filter((r) => r.id !== row.id))}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Structure Master</h1>
          <p className="text-sm text-gray-500">Define earnings, deductions, employer contributions and flexible benefits</p>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add Salary Structure</Button>
      </div>

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
                <th className="px-3 py-2">Max benefits</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <p className="font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.code}</p>
                  </td>
                  <td className="px-3 py-2">{s.payrollFrequency}</td>
                  <td className="px-3 py-2">{s.modeOfPayment}</td>
                  <td className="px-3 py-2">{inr(s.maxBenefits)}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button type="button" className="rounded p-1.5 hover:bg-blue-50" onClick={() => openEdit(s)}><Edit className="h-4 w-4 text-blue-600" /></button>
                      <button type="button" className="rounded p-1.5 hover:bg-red-50" onClick={() => setStructures((prev) => prev.filter((item) => item.id !== s.id))}><Trash2 className="h-4 w-4 text-red-500" /></button>
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) reset(); }}>
          <aside className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editId ? 'Edit Salary Structure' : 'Add Salary Structure'}</h2>
                <p className="text-xs text-gray-500">Earnings, deductions, employer contributions and flexible benefits</p>
              </div>
              <button type="button" onClick={reset} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Salary Structure Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Teaching Staff Structure" />
                <Input label="Code *" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. TSS-2026" />
                <Input label="Leave Encashment Amount Per Day (INR)" type="number" value={leaveEncashment} onChange={(e) => setLeaveEncashment(parseFloat(e.target.value) || 0)} />
                <Input label="Max Benefits (Amount) (INR)" type="number" value={maxBenefits} onChange={(e) => setMaxBenefits(parseFloat(e.target.value) || 0)} />
                <Select label="Payroll Frequency" options={FREQUENCY} value={frequency} onChange={setFrequency} />
                <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800">
                  <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={timesheet} onChange={(e) => setTimesheet(e.target.checked)} />
                  Salary Slip Based on Timesheet
                </label>
                <Select label="Mode of Payment" options={PAYMENT_MODES} value={modeOfPayment} onChange={setModeOfPayment} />
                <Select label="Payment Account" options={PAYMENT_ACCOUNTS} value={paymentAccount} onChange={setPaymentAccount} />
              </div>

              {renderRows('Earnings', earnings, setEarnings, 'Earning')}
              {renderRows('Deductions', deductions, setDeductions, 'Deduction')}
              {renderRows('Employer Contributions', employer, setEmployer, 'Employer Contribution')}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Flexible Benefits</h3>
                    <p className="text-xs text-gray-500">Enter yearly benefit amounts</p>
                  </div>
                  <Button variant="outline" size="xs" onClick={() => setBenefits((prev) => [...prev, emptyBenefit()])}>
                    <Plus className="h-3.5 w-3.5" /> Add row
                  </Button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                      <tr>
                        <th className="px-3 py-2">No.</th>
                        <th className="px-3 py-2">Earning Component</th>
                        <th className="px-3 py-2">Benefit Amount</th>
                        <th className="px-3 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {benefits.map((row, index) => (
                        <tr key={row.id} className="border-t">
                          <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                          <td className="px-3 py-2 min-w-[240px]">
                            <Select
                              options={optionsFor('Earning')}
                              value={row.earningComponent}
                              onChange={(v) => setBenefits((prev) => prev.map((r) => (r.id === row.id ? { ...r, earningComponent: v } : r)))}
                            />
                          </td>
                          <td className="px-3 py-2 w-48">
                            <Input
                              type="number"
                              value={row.benefitAmount}
                              onChange={(e) => setBenefits((prev) => prev.map((r) => (r.id === row.id ? { ...r, benefitAmount: parseFloat(e.target.value) || 0 } : r)))}
                            />
                            <p className="mt-1 text-xs text-gray-500">{inr(row.benefitAmount)}</p>
                          </td>
                          <td className="px-3 py-2">
                            {benefits.length > 1 && (
                              <button type="button" className="rounded p-1 hover:bg-red-50" onClick={() => setBenefits((prev) => prev.filter((r) => r.id !== row.id))}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4">
              <Button variant="outline" onClick={reset}>Cancel</Button>
              <Button variant="primary" onClick={save}><Save className="h-4 w-4 mr-2" /> {editId ? 'Update' : 'Save'} Salary Structure</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default SalaryStructureMaster;
