import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Plus, Edit, Trash2, Save, Search, DollarSign, Copy, X } from 'lucide-react';

type ComponentType = 'Earning' | 'Deduction' | 'Employer Contribution';

interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: ComponentType;
  calculationType: 'Flat Amount' | 'Formula';
  calculationValue: string;
  formulaComponents: string[];
  formulaMode: 'percent' | 'sum' | 'days';
  formulaPercent: number;
  accounts: string[];
  dependsOnPaymentDays: boolean;
  isTaxApplicable: boolean;
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
  { value: 'SAL-BASIC', label: 'SAL-BASIC · Basic Salary' },
  { value: 'SAL-DA', label: 'SAL-DA · Dearness Allowance' },
  { value: 'SAL-HRA', label: 'SAL-HRA · House Rent Allowance' },
  { value: 'SAL-CONV', label: 'SAL-CONV · Conveyance' },
  { value: 'SAL-PAYABLE', label: 'SAL-PAYABLE · Salary Payable' },
  { value: 'PF-PAYABLE', label: 'PF-PAYABLE · Provident Fund Payable' },
  { value: 'ESI-PAYABLE', label: 'ESI-PAYABLE · ESI Payable' },
  { value: 'PT-PAYABLE', label: 'PT-PAYABLE · Professional Tax Payable' },
  { value: 'TDS-PAYABLE', label: 'TDS-PAYABLE · TDS Payable' },
  { value: 'BANK-SAL', label: 'BANK-SAL · Salary Bank Account' },
  { value: 'BENEFIT-LEDGER', label: 'BENEFIT-LEDGER · Employee Benefit Ledger' },
];

const PAYOUT_METHODS = [
  { value: 'Pay in Salary', label: 'Pay in Salary' },
  { value: 'Reimburse Later', label: 'Reimburse Later' },
  { value: 'Accrue in Benefit Ledger', label: 'Accrue in Benefit Ledger' },
];

const FLAG_FIELDS: { key: keyof Pick<SalaryComponent, 'dependsOnPaymentDays' | 'isTaxApplicable' | 'deductFullTaxOnSelectedPayrollDate' | 'roundToTheNearestInteger' | 'statisticalComponent' | 'accrualComponent' | 'doNotIncludeInTotal' | 'removeIfZeroValued' | 'arrearComponent' | 'disabled' | 'isFlexibleBenefit'>; title: string; hint?: string }[] = [
  { key: 'dependsOnPaymentDays', title: 'Depends on Payment Days' },
  { key: 'isTaxApplicable', title: 'Is Tax Applicable' },
  { key: 'deductFullTaxOnSelectedPayrollDate', title: 'Deduct Full Tax on Selected Payroll Date' },
  { key: 'roundToTheNearestInteger', title: 'Round to the Nearest Integer' },
  {
    key: 'statisticalComponent',
    title: 'Statistical Component',
    hint: "If enabled, the value specified or calculated in this component will not contribute to the earnings or deductions. However, it's value can be referenced by other components that can be added or deducted.",
  },
  {
    key: 'accrualComponent',
    title: 'Accrual Component',
    hint: 'If enabled, this component allows to accrue amounts without adding them to earnings. The accrued balance is tracked in the Employee Benefit Ledger and can be paid out later as needed.',
  },
  { key: 'doNotIncludeInTotal', title: 'Do Not Include in Total' },
  {
    key: 'removeIfZeroValued',
    title: 'Remove if Zero Valued',
    hint: 'If enabled, the component will not be displayed in the salary slip if the amount is zero',
  },
  {
    key: 'arrearComponent',
    title: 'Arrear Component',
    hint: 'If enabled, this component will be included in arrear calculations',
  },
  { key: 'disabled', title: 'Disabled' },
  { key: 'isFlexibleBenefit', title: 'Is Flexible Benefit' },
];

const emptyForm = {
  name: '',
  code: '',
  type: 'Earning' as ComponentType,
  calculationType: 'Flat Amount' as 'Flat Amount' | 'Formula',
  calculationValue: '',
  formulaComponents: [] as string[],
  formulaMode: 'percent' as 'percent' | 'sum' | 'days',
  formulaPercent: 0,
  accounts: [] as string[],
  dependsOnPaymentDays: false,
  isTaxApplicable: false,
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
  maxBenefitAmount: 0,
};

const mockComponents: SalaryComponent[] = [
  { id: 'SC001', name: 'Basic Salary', code: 'BASIC', type: 'Earning', calculationType: 'Flat Amount', calculationValue: '0', formulaComponents: [], formulaMode: 'percent', formulaPercent: 0, accounts: ['SAL-BASIC', 'SAL-PAYABLE'], dependsOnPaymentDays: true, isTaxApplicable: true, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: false, arrearComponent: true, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC002', name: 'Dearness Allowance', code: 'DA', type: 'Earning', calculationType: 'Formula', calculationValue: '(BASIC) × 50%', formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 50, accounts: ['SAL-DA', 'SAL-PAYABLE'], dependsOnPaymentDays: true, isTaxApplicable: true, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: false, arrearComponent: true, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC003', name: 'House Rent Allowance', code: 'HRA', type: 'Earning', calculationType: 'Formula', calculationValue: '(BASIC) × 40%', formulaComponents: ['BASIC'], formulaMode: 'percent', formulaPercent: 40, accounts: ['SAL-HRA'], dependsOnPaymentDays: false, isTaxApplicable: true, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: true, arrearComponent: false, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC004', name: 'Conveyance Allowance', code: 'CONV', type: 'Earning', calculationType: 'Flat Amount', calculationValue: '1600', formulaComponents: [], formulaMode: 'percent', formulaPercent: 0, accounts: ['SAL-CONV'], dependsOnPaymentDays: false, isTaxApplicable: false, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: false, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: true, arrearComponent: false, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC005', name: 'Provident Fund (Employee)', code: 'PF_EMP', type: 'Deduction', calculationType: 'Formula', calculationValue: '(BASIC + DA) × 12%', formulaComponents: ['BASIC', 'DA'], formulaMode: 'percent', formulaPercent: 12, accounts: ['PF-PAYABLE'], dependsOnPaymentDays: false, isTaxApplicable: false, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: true, arrearComponent: true, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC006', name: 'ESI (Employee)', code: 'ESI_EMP', type: 'Deduction', calculationType: 'Formula', calculationValue: '(BASIC + DA + HRA + CONV) × present days / payment days', formulaComponents: ['BASIC', 'DA', 'HRA', 'CONV'], formulaMode: 'days', formulaPercent: 0, accounts: ['ESI-PAYABLE'], dependsOnPaymentDays: true, isTaxApplicable: false, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: true, arrearComponent: false, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC007', name: 'Professional Tax', code: 'PT', type: 'Deduction', calculationType: 'Flat Amount', calculationValue: '200', formulaComponents: [], formulaMode: 'percent', formulaPercent: 0, accounts: ['PT-PAYABLE'], dependsOnPaymentDays: false, isTaxApplicable: false, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: false, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: true, arrearComponent: false, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
  { id: 'SC008', name: 'Provident Fund (Employer)', code: 'PF_ER', type: 'Employer Contribution', calculationType: 'Formula', calculationValue: '(BASIC + DA) × 12%', formulaComponents: ['BASIC', 'DA'], formulaMode: 'percent', formulaPercent: 12, accounts: ['PF-PAYABLE'], dependsOnPaymentDays: false, isTaxApplicable: false, deductFullTaxOnSelectedPayrollDate: false, roundToTheNearestInteger: true, statisticalComponent: false, accrualComponent: false, doNotIncludeInTotal: false, removeIfZeroValued: false, arrearComponent: true, disabled: false, isFlexibleBenefit: false, payoutMethod: 'Pay in Salary', maxBenefitAmount: 0, status: 'Active' },
];

function typeColor(type: string): 'success' | 'danger' | 'info' | 'secondary' {
  if (type === 'Earning') return 'success';
  if (type === 'Deduction') return 'danger';
  if (type === 'Employer Contribution') return 'info';
  return 'secondary';
}

function buildFormula(codes: string[], mode: 'percent' | 'sum' | 'days', percent: number) {
  if (!codes.length) return '';
  const joined = codes.join(' + ');
  if (mode === 'sum') return `(${joined})`;
  if (mode === 'days') return `(${joined}) × present days / payment days`;
  return `(${joined}) × ${percent || 0}%`;
}

export function PayHeadMaster() {
  const [components, setComponents] = useState(mockComponents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [form, setForm] = useState(emptyForm);

  const componentOptions = useMemo(
    () => components
      .filter((c) => c.code !== form.code)
      .map((c) => ({ value: c.code, label: `${c.name} (${c.code})` })),
    [components, form.code],
  );

  const formulaPreview = form.calculationType === 'Formula'
    ? buildFormula(form.formulaComponents, form.formulaMode, form.formulaPercent)
    : form.calculationValue;

  const filtered = components.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    const matchType = !typeFilter || c.type === typeFilter;
    return matchSearch && matchType;
  });

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.code.trim()) return;
    const calculationValue = form.calculationType === 'Formula' ? formulaPreview : form.calculationValue;
    const payload = { ...form, calculationValue };
    if (editId) {
      setComponents((prev) => prev.map((c) => (c.id === editId ? { ...c, ...payload } : c)));
    } else {
      setComponents((prev) => [...prev, { ...payload, id: `SC${Date.now()}`, status: form.disabled ? 'Inactive' : 'Active' }]);
    }
    resetForm();
  };

  const fillForm = (c: SalaryComponent, asCopy = false) => {
    setForm({
      name: asCopy ? `${c.name} (Copy)` : c.name,
      code: asCopy ? `${c.code}_COPY` : c.code,
      type: c.type,
      calculationType: c.calculationType,
      calculationValue: c.calculationValue,
      formulaComponents: c.formulaComponents,
      formulaMode: c.formulaMode,
      formulaPercent: c.formulaPercent,
      accounts: c.accounts,
      dependsOnPaymentDays: c.dependsOnPaymentDays,
      isTaxApplicable: c.isTaxApplicable,
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
      maxBenefitAmount: c.maxBenefitAmount,
    });
    setEditId(asCopy ? null : c.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Salary Component Master</h1>
          <p className="text-sm text-gray-500">Define earning and deduction components for payroll</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowForm(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Salary Component
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search salary components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Types' },
              { value: 'Earning', label: 'Earning' },
              { value: 'Deduction', label: 'Deduction' },
              { value: 'Employer Contribution', label: 'Employer Contribution' },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Salary Component</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Calculation</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Flags</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-500">{c.code}{c.disabled ? ' · Disabled' : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={typeColor(c.type)}>{c.type}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-medium text-gray-700">{c.calculationType}</p>
                    {c.calculationValue && <p className="text-xs text-gray-500">{c.calculationValue}</p>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {c.dependsOnPaymentDays && <Badge variant="secondary">Payment days</Badge>}
                      {c.isTaxApplicable && <Badge variant="warning">Tax</Badge>}
                      {c.statisticalComponent && <Badge variant="info">Statistical</Badge>}
                      {c.accrualComponent && <Badge variant="info">Accrual</Badge>}
                      {c.arrearComponent && <Badge variant="secondary">Arrear</Badge>}
                      {c.isFlexibleBenefit && <Badge variant="success">Flexible</Badge>}
                      {c.disabled && <Badge variant="danger">Disabled</Badge>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" onClick={() => fillForm(c)} className="p-1.5 hover:bg-blue-100 rounded-lg" title="Edit">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button type="button" className="p-1.5 hover:bg-gray-100 rounded-lg" title="Clone" onClick={() => fillForm(c, true)}>
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button type="button" className="p-1.5 hover:bg-red-100 rounded-lg" title="Delete" onClick={() => setComponents((prev) => prev.filter((item) => item.id !== c.id))}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-950/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <aside className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{editId ? 'Edit Salary Component' : 'Add Salary Component'}</h2>
                <p className="text-xs text-gray-500">Name, calculation and accounts for this component</p>
              </div>
              <button type="button" onClick={resetForm} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Salary Component Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Basic Salary" />
                <Input label="Code *" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g., BASIC" />
                <Select
                  label="Type *"
                  options={[
                    { value: 'Earning', label: 'Earning' },
                    { value: 'Deduction', label: 'Deduction' },
                    { value: 'Employer Contribution', label: 'Employer Contribution' },
                  ]}
                  value={form.type}
                  onChange={(v) => setForm({ ...form, type: v as ComponentType })}
                />
                <Select
                  label="Calculation Type *"
                  options={[
                    { value: 'Flat Amount', label: 'Flat Amount' },
                    { value: 'Formula', label: 'Formula' },
                  ]}
                  value={form.calculationType}
                  onChange={(v) => setForm({ ...form, calculationType: v as 'Flat Amount' | 'Formula', calculationValue: '', formulaComponents: [], formulaPercent: 0 })}
                />
                {form.calculationType === 'Flat Amount' && (
                  <Input
                    label="Calculation Value / Formula"
                    type="number"
                    value={form.calculationValue}
                    onChange={(e) => setForm({ ...form, calculationValue: e.target.value })}
                    placeholder="Amount in INR"
                  />
                )}
                {form.calculationType === 'Formula' && (
                  <div className="md:col-span-2 space-y-3 rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-800">Calculation Value / Formula</p>
                    <MultiSelect
                      label="Salary components used"
                      options={componentOptions}
                      value={form.formulaComponents}
                      onChange={(codes) => setForm({ ...form, formulaComponents: codes })}
                      placeholder="Select components in this formula"
                    />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <Select
                        label="Calculate as"
                        options={[
                          { value: 'percent', label: 'Percentage of selected components' },
                          { value: 'sum', label: 'Sum of selected components' },
                          { value: 'days', label: 'Selected × present days / payment days' },
                        ]}
                        value={form.formulaMode}
                        onChange={(v) => setForm({ ...form, formulaMode: v as 'percent' | 'sum' | 'days' })}
                      />
                      {form.formulaMode === 'percent' && (
                        <Input
                          label="Percentage"
                          type="number"
                          value={form.formulaPercent}
                          onChange={(e) => setForm({ ...form, formulaPercent: parseFloat(e.target.value) || 0 })}
                        />
                      )}
                    </div>
                    <p className="rounded-md bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      Formula: <span className="font-medium">{formulaPreview || 'Select components to build the formula'}</span>
                    </p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <MultiSelect
                    label="Accounts"
                    options={ACCOUNT_OPTIONS}
                    value={form.accounts}
                    onChange={(accounts) => setForm({ ...form, accounts })}
                    placeholder="Select account(s)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {FLAG_FIELDS.map((flag) => (
                  <label key={flag.key} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-white p-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded text-blue-600"
                      checked={Boolean(form[flag.key])}
                      onChange={(e) => setForm({ ...form, [flag.key]: e.target.checked })}
                    />
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
                  <div>
                    <Input
                      label="Max Benefit Amount (Yearly)"
                      type="number"
                      value={form.maxBenefitAmount}
                      onChange={(e) => setForm({ ...form, maxBenefitAmount: parseFloat(e.target.value) || 0 })}
                    />
                    <p className="mt-1 text-xs text-gray-500">If greater than zero, this sets the maximum benefit amount assignable to any employee</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t bg-gray-50 px-6 py-4">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editId ? 'Update' : 'Create'} Salary Component
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default PayHeadMaster;
