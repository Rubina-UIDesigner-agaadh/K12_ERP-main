import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Textarea } from '../../../components/ui/Textarea';
import { Plus, Edit, Trash2, Save, Search, DollarSign, Copy } from 'lucide-react';

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
  { value: 'BANK-SAL', label: 'BANK-SAL · Salary Bank Account' },
  { value: 'BENEFIT-LEDGER', label: 'BENEFIT-LEDGER · Employee Benefit Ledger' }
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

const FLAG_FIELDS: { key: keyof SalaryComponent; title: string; hint?: string }[] = [
  { key: 'dependsOnPaymentDays', title: 'Depends on Payment Days' },
  { key: 'dependsOnLwp', title: 'Depends on LWP', hint: 'Deduct in proportion of LWP days to working days. Enable for Basic and DA.' },
  { key: 'isTaxApplicable', title: 'Is Tax Applicable', hint: 'Considered for tax as per Payroll Period and Income Tax Slab.' },
  { key: 'variableBasedOnTaxableSalary', title: 'Variable based on Taxable Salary', hint: 'Only for Income Tax / TDS. Calculates tax in the backend.' },
  { key: 'isAdditionalComponent', title: 'Is Additional Component', hint: 'Paid only as Additional Salary (e.g. Performance Bonus). Not part of the normal structure.' },
  { key: 'deductFullTaxOnSelectedPayrollDate', title: 'Deduct Full Tax on Selected Payroll Date' },
  { key: 'roundToTheNearestInteger', title: 'Round to the Nearest Integer' },
  { key: 'statisticalComponent', title: 'Statistical Component', hint: 'Value is not added to earnings or deductions but can be referenced.' },
  { key: 'accrualComponent', title: 'Accrual Component' },
  { key: 'doNotIncludeInTotal', title: 'Do Not Include in Total', hint: 'Shown on the slip but not added to take-home (e.g. Employer PF).' },
  { key: 'removeIfZeroValued', title: 'Remove if Zero Valued' },
  { key: 'arrearComponent', title: 'Arrear Component' },
  { key: 'disabled', title: 'Disabled' },
  { key: 'isFlexibleBenefit', title: 'Is Flexible Benefit' }
];

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
  status: 'Active' as const
};

const mockComponents: SalaryComponent[] = [
  { id: 'SC001', name: 'Basic Pay', code: 'BASIC', type: 'Earning', description: 'Fixed amount per grade', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, accounts: ['SAL-BASIC', 'SAL-PAYABLE'], dependsOnPaymentDays: true, dependsOnLwp: true, isTaxApplicable: true, arrearComponent: true },
  { id: 'SC002', name: 'Dearness Allowance', code: 'DA', type: 'Earning', description: 'Formula: basic * 0.45', calculationType: 'Formula', calculationValue: 'basic * 0.45', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 45, accounts: ['SAL-DA', 'SAL-PAYABLE'], dependsOnPaymentDays: true, dependsOnLwp: true, isTaxApplicable: true, arrearComponent: true },
  { id: 'SC003', name: 'House Rent Allowance', code: 'HRA', type: 'Earning', description: 'basic * 0.40 (metro) / basic * 0.20 (non-metro)', calculationType: 'Formula', calculationValue: 'basic * 0.40', condition: '', ...baseFlags, formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 40, accounts: ['SAL-HRA'], isTaxApplicable: true, removeIfZeroValued: true },
  { id: 'SC004', name: 'Transport Allowance', code: 'TA', type: 'Earning', description: 'Fixed ₹1,600 / month', calculationType: 'Flat Amount', calculationValue: '1600', condition: '', ...baseFlags, accounts: ['SAL-CONV'], removeIfZeroValued: true },
  { id: 'SC005', name: 'Special Responsibility Allowance', code: 'SRA', type: 'Earning', description: 'For HODs and coordinators', calculationType: 'Flat Amount', calculationValue: '0', condition: 'designation == "Department Head"', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC006', name: 'Teaching Allowance', code: 'TACH', type: 'Earning', description: 'For teachers only', calculationType: 'Flat Amount', calculationValue: '0', condition: 'staff_category == "Teaching Staff"', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC007', name: 'Medical Allowance', code: 'MA', type: 'Earning', description: 'Fixed ₹1,250 / month', calculationType: 'Flat Amount', calculationValue: '1250', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC008', name: 'Children Education Allowance', code: 'CEA', type: 'Earning', description: '₹100 / child / month, up to 2 children', calculationType: 'Flat Amount', calculationValue: '200', condition: '', ...baseFlags, accounts: ['SAL-PAYABLE'] },
  { id: 'SC009', name: 'Performance Bonus', code: 'PBON', type: 'Earning', description: 'Additional component only', calculationType: 'Flat Amount', calculationValue: '0', condition: '', ...baseFlags, isAdditionalComponent: true, accounts: ['SAL-PAYABLE'] },
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
  if (mode === 'days') return `(${joined}) × present days / payment days`;
  return `(${joined}) × ${percent || 0}%`;
}

export function PayHeadMaster() {
  const navigate = useNavigate();
  const [components, setComponents] = useState(mockComponents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState(emptyForm);

  const componentOptions = useMemo(
    () => components.filter((c) => c.code !== form.code).map((c) => ({ value: c.code, label: `${c.name} (${c.code})` })),
    [components, form.code]
  );

  const formulaPreview = form.calculationType === 'Formula'
    ? buildFormula(form.formulaComponents, form.formulaMode, form.formulaPercent, form.calculationValue)
    : form.calculationValue;

  const abbrClash = form.code.trim() && components.some((c) => c.id !== editId && (
    c.calculationValue.toLowerCase().includes(form.code.toLowerCase()) ||
    c.formulaComponents.includes(form.code)
  ));

  const filtered = components.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.calculationValue.toLowerCase().includes(q) || c.condition.toLowerCase().includes(q);
    const matchType = !typeFilter || c.type === typeFilter || (typeFilter === 'Deduction' && c.type === 'Employer Contribution');
    return matchSearch && matchType;
  });

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) { setNotice('Component name and abbreviation are required.'); return; }
    const calculationValue = form.calculationType === 'Formula' ? formulaPreview : form.calculationValue;
    const payload = { ...form, calculationValue, status: form.disabled ? 'Inactive' as const : 'Active' as const };
    if (editId) setComponents((prev) => prev.map((c) => (c.id === editId ? { ...c, ...payload } : c)));
    else setComponents((prev) => [...prev, { ...payload, id: `SC${Date.now()}` }]);
    setNotice(editId ? 'Component updated. Use Update Salary Structures to sync formulas.' : 'Component created.');
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

  const syncStructures = () => {
    setNotice('Condition and formula values were marked for sync with salary structures that use this component. Existing employee assignments are not rewritten.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">HR &gt; Payroll &gt; Salary Component</p>
          <h1 className="text-2xl font-bold text-gray-900">Salary Component Master</h1>
          <p className="text-sm text-gray-500">Building blocks for salary structures and salary slips. Saving a component does not process payroll.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => navigate('/hr/master/salary-structure-master')}>Build Salary Structures</Button>
          <Button variant="outline" onClick={() => navigate('/hr/master/payroll-calendar-period-master')}>Payroll Period</Button>
          <Button variant="outline" onClick={() => navigate('/hr/master/income-tax-slab')}>Income Tax Slab</Button>
          <Button variant="primary" onClick={() => { setForm(emptyForm); setEditId(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />Add Salary Component
          </Button>
        </div>
      </div>
      {notice && <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">{notice}</div>}

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {['', 'Earning', 'Deduction'].map((item) => (
            <button key={item || 'all'} type="button" onClick={() => setTypeFilter(item)} className={`rounded-lg border px-3 py-1.5 text-sm ${typeFilter === item ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>
              {item === '' ? 'All' : item === 'Earning' ? 'Show Earnings Only' : 'Show Deductions Only'}
            </button>
          ))}
          <div className="relative min-w-[220px] flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search name, abbreviation or formula..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          {selected.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => {
              setComponents((prev) => prev.map((c) => selected.includes(c.id) ? { ...c, disabled: true, status: 'Inactive' } : c));
              setSelected([]);
              setNotice(`${selected.length} component(s) disabled.`);
            }}>Disable selected</Button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && filtered.every((c) => selected.includes(c.id))} onChange={(e) => setSelected(e.target.checked ? filtered.map((c) => c.id) : [])} /></th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Salary Component</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Formula / Amount</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Flags</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                  <td className="px-3 py-3"><input type="checkbox" checked={selected.includes(c.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, c.id] : prev.filter((id) => id !== c.id))} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.code}{c.disabled ? ' · Disabled' : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center"><Badge variant={typeColor(c.type)}>{c.type}</Badge></td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-medium text-gray-700">{c.calculationType}</p>
                    {c.calculationValue && <p className="text-xs font-mono text-gray-500">{c.calculationValue}</p>}
                    {c.condition && <p className="text-[11px] text-gray-400">if {c.condition}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {c.dependsOnLwp && <Badge variant="secondary">LWP</Badge>}
                      {c.isTaxApplicable && <Badge variant="warning">Tax</Badge>}
                      {c.variableBasedOnTaxableSalary && <Badge variant="warning">TDS var</Badge>}
                      {c.isAdditionalComponent && <Badge variant="info">Additional</Badge>}
                      {c.doNotIncludeInTotal && <Badge variant="secondary">Not in total</Badge>}
                      {c.disabled && <Badge variant="danger">Disabled</Badge>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" onClick={() => fillForm(c)} className="p-1.5 hover:bg-blue-100 rounded-lg" title="Edit"><Edit className="w-4 h-4 text-blue-600" /></button>
                      <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg" title="Clone" onClick={() => fillForm(c, true)}><Copy className="w-4 h-4 text-gray-500" /></button>
                      <button type="button" className="p-1.5 hover:bg-red-100 rounded-lg" title="Delete" onClick={() => setComponents((prev) => prev.filter((item) => item.id !== c.id))}><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showForm && (
        <Card title={editId ? 'Edit Salary Component' : 'Add Salary Component'}>
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Component name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Employee Provident Fund" />
              <div>
                <Input label="Abbreviation *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g., basic" />
                {abbrClash && <p className="mt-1 text-xs text-red-600">This abbreviation is referenced in another component formula. Changing it can break existing salary structures.</p>}
              </div>
              <Select label="Component type *" options={[{ value: 'Earning', label: 'Earning' }, { value: 'Deduction', label: 'Deduction' }, { value: 'Employer Contribution', label: 'Employer Contribution' }]} value={form.type} onChange={(v) => setForm({ ...form, type: v as ComponentType })} />
              <Select label="Company" options={COMPANIES} value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
              <div className="md:col-span-2"><Textarea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="h-4 w-4 rounded text-blue-600" checked={form.calculationType === 'Formula'} onChange={(e) => setForm({ ...form, calculationType: e.target.checked ? 'Formula' : 'Flat Amount', calculationValue: '' })} />
              Amount based on formula
            </label>
            {form.calculationType === 'Flat Amount' && (
              <Input label="Amount" type="number" value={form.calculationValue} onChange={(e) => setForm({ ...form, calculationValue: e.target.value })} placeholder="Amount in INR" />
            )}
            {form.calculationType === 'Formula' && (
              <div className="space-y-3 rounded-xl border border-gray-200 p-4">
                <Textarea label="Condition" rows={2} className="font-mono" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder='e.g. gross <= 21000 or designation == "Department Head"' />
                <p className="text-xs text-gray-500">If the condition is false, the component shows ₹0 on the slip.</p>
                <Textarea label="Formula" rows={3} className="font-mono" value={form.calculationValue} onChange={(e) => setForm({ ...form, calculationValue: e.target.value })} placeholder="e.g. basic * 0.40" />
                <p className="text-xs text-gray-500">Variables: basic, gross, total_working_days, payment_days, lwp.</p>
                <MultiSelect label="Salary components used (optional builder)" options={componentOptions} value={form.formulaComponents} onChange={(codes) => setForm({ ...form, formulaComponents: codes })} placeholder="Select components in this formula" />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Select label="Calculate as" options={[{ value: 'percent', label: 'Percentage of selected components' }, { value: 'sum', label: 'Sum of selected components' }, { value: 'days', label: 'Selected × present days / payment days' }]} value={form.formulaMode} onChange={(v) => setForm({ ...form, formulaMode: v as 'percent' | 'sum' | 'days' })} />
                  {form.formulaMode === 'percent' && <Input label="Percentage" type="number" value={form.formulaPercent} onChange={(e) => setForm({ ...form, formulaPercent: parseFloat(e.target.value) || 0 })} />}
                </div>
                <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">Formula: <span className="font-medium">{formulaPreview || 'Enter a formula'}</span></p>
                <Button variant="outline" size="sm" onClick={syncStructures}>Update Salary Structures</Button>
              </div>
            )}

            <div>
              <p className="mb-1 text-sm font-medium text-gray-700">Accounts mapping</p>
              <p className="mb-2 text-xs text-gray-500">Default account drives the journal entry. If blank, journal creation fails.</p>
              <MultiSelect label="Default account(s)" options={ACCOUNT_OPTIONS} value={form.accounts} onChange={(accounts) => setForm({ ...form, accounts })} placeholder="Select account(s)" />
            </div>

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {FLAG_FIELDS.map((flag) => (
                <label key={String(flag.key)} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded text-blue-600" checked={Boolean(form[flag.key as keyof typeof form])} onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })} />
                  <span>
                    <span className="block text-sm font-medium text-gray-800">{flag.title}</span>
                    {flag.hint && <span className="mt-0.5 block text-xs text-gray-500">{flag.hint}</span>}
                  </span>
                </label>
              ))}
            </div>

            {form.isFlexibleBenefit && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Select label="Payout Method" options={PAYOUT_METHODS} value={form.payoutMethod} onChange={(v) => setForm({ ...form, payoutMethod: v })} />
                <Input label="Max Benefit Amount (Yearly)" type="number" value={form.maxBenefitAmount} onChange={(e) => setForm({ ...form, maxBenefitAmount: parseFloat(e.target.value) || 0 })} />
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="primary" onClick={handleSave}><Save className="w-4 h-4 mr-2" />{editId ? 'Update' : 'Create'} Salary Component</Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default PayHeadMaster;
