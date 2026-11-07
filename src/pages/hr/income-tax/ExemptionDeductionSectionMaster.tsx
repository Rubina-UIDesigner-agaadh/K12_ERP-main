import React, { useState, Children } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Toggle } from '../../../components/ui/Toggle';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  FileText,
  DollarSign,
  CheckCircle } from
'lucide-react';
interface ExemptionSection {
  id: string;
  sectionCode: string;
  sectionName: string;
  category:
  'Investment' |
  'Insurance' |
  'Medical' |
  'Housing' |
  'Education' |
  'Donation' |
  'Other';
  maximumLimit: number;
  subLimitDetails: string;
  allowedUnderRegimes: 'Old Only' | 'New Only' | 'Both';
  requiresProof: boolean;
  allowMonthlyConsideration: boolean;
  status: 'Active' | 'Inactive';
}
interface ExemptionSubCategory {
  id: string;
  name: string;
  parentId: string;
  maxAmount: number;
  description: string;
  requiresProof: boolean;
  proofTypes: string[];
  status: 'Active' | 'Inactive';
}
const mockSections: ExemptionSection[] = [
{
  id: 'ES001',
  sectionCode: '80C',
  sectionName: 'Investments & Savings (80C)',
  category: 'Investment',
  maximumLimit: 150000,
  subLimitDetails: 'PPF, ELSS, LIC, NSC, Home Loan Principal, etc.',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: true,
  status: 'Active'
},
{
  id: 'ES002',
  sectionCode: '80D',
  sectionName: 'Medical Insurance Premium (80D)',
  category: 'Insurance',
  maximumLimit: 25000,
  subLimitDetails:
  'Additional ₹25,000 for parents; ₹50,000 if senior citizen',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active'
},
{
  id: 'ES003',
  sectionCode: '80E',
  sectionName: 'Education Loan Interest (80E)',
  category: 'Education',
  maximumLimit: 0,
  subLimitDetails: 'No upper limit; actual interest paid',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active'
},
{
  id: 'ES004',
  sectionCode: '80G',
  sectionName: 'Donations to Charitable Institutions (80G)',
  category: 'Donation',
  maximumLimit: 0,
  subLimitDetails: '50% or 100% deduction depending on institution',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active'
},
{
  id: 'ES005',
  sectionCode: '24B',
  sectionName: 'Home Loan Interest (24B)',
  category: 'Housing',
  maximumLimit: 200000,
  subLimitDetails: 'For self-occupied property',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: true,
  status: 'Active'
},
{
  id: 'ES006',
  sectionCode: '10(13A)',
  sectionName: 'HRA Exemption (10(13A))',
  category: 'Other',
  maximumLimit: 0,
  subLimitDetails:
  'Least of: Actual HRA, 50%/40% of salary, Rent paid minus 10% salary',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: true,
  status: 'Active'
},
{
  id: 'ES007',
  sectionCode: '80CCD(1B)',
  sectionName: 'NPS Additional Contribution (80CCD(1B))',
  category: 'Investment',
  maximumLimit: 50000,
  subLimitDetails: 'Over and above 80C limit',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: true,
  status: 'Active'
},
{
  id: 'ES008',
  sectionCode: '10(14)',
  sectionName: 'Special Allowances (10(14))',
  category: 'Other',
  maximumLimit: 0,
  subLimitDetails: 'Children Education, Hostel, Transport, etc.',
  allowedUnderRegimes: 'Old Only',
  requiresProof: false,
  allowMonthlyConsideration: true,
  status: 'Active'
},
{
  id: 'ES009',
  sectionCode: '80TTA',
  sectionName: 'Interest on Savings Account (80TTA)',
  category: 'Other',
  maximumLimit: 10000,
  subLimitDetails: 'Interest on savings account up to ₹10,000',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active'
},
{
  id: 'ES010',
  sectionCode: 'LTA',
  sectionName: 'Leave Travel Allowance',
  category: 'Other',
  maximumLimit: 0,
  subLimitDetails: 'As per employer policy',
  allowedUnderRegimes: 'Old Only',
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active'
}];
const mockSubCategories: ExemptionSubCategory[] = [
  { id: 'SUB001', name: 'Life Insurance Premium', parentId: 'ES001', maxAmount: 150000, description: 'LIC / term insurance premium receipts', requiresProof: true, proofTypes: ['PDF', 'Image'], status: 'Active' },
  { id: 'SUB002', name: 'PPF (Public Provident Fund)', parentId: 'ES001', maxAmount: 150000, description: 'PPF passbook / deposit proof', requiresProof: true, proofTypes: ['PDF', 'Image'], status: 'Active' },
  { id: 'SUB003', name: 'ELSS Mutual Funds', parentId: 'ES001', maxAmount: 150000, description: 'ELSS statement', requiresProof: true, proofTypes: ['PDF'], status: 'Active' },
  { id: 'SUB004', name: 'Tuition Fees (Children)', parentId: 'ES001', maxAmount: 150000, description: 'School fee receipts for children', requiresProof: true, proofTypes: ['PDF', 'Image', 'Certificate'], status: 'Active' },
  { id: 'SUB005', name: 'Home Loan – Principal', parentId: 'ES001', maxAmount: 150000, description: 'Bank principal repayment certificate', requiresProof: true, proofTypes: ['PDF', 'Certificate'], status: 'Active' },
  { id: 'SUB006', name: 'EPF Contribution', parentId: 'ES001', maxAmount: 150000, description: 'Employee PF contribution', requiresProof: false, proofTypes: [], status: 'Active' },
  { id: 'SUB007', name: 'NSC', parentId: 'ES001', maxAmount: 150000, description: 'National Savings Certificate', requiresProof: true, proofTypes: ['PDF', 'Image'], status: 'Active' },
  { id: 'SUB008', name: 'Mediclaim (Self)', parentId: 'ES002', maxAmount: 25000, description: 'Medical insurance premium for self', requiresProof: true, proofTypes: ['PDF', 'Image'], status: 'Active' },
  { id: 'SUB009', name: 'Mediclaim (Parents Senior)', parentId: 'ES002', maxAmount: 50000, description: 'Medical insurance for senior citizen parents', requiresProof: true, proofTypes: ['PDF', 'Certificate'], status: 'Active' },
  { id: 'SUB010', name: 'Education Loan Interest', parentId: 'ES003', maxAmount: 0, description: 'Interest on education loan — no upper limit', requiresProof: true, proofTypes: ['PDF', 'Certificate'], status: 'Active' }
];
const PROOF_TYPE_OPTIONS = [
  { value: 'PDF', label: 'PDF' },
  { value: 'Image', label: 'Image' },
  { value: 'Certificate', label: 'Certificate' }
];

const categoryColor = (
cat: string)
: 'success' | 'info' | 'warning' | 'secondary' | 'error' => {
  const map: Record<
    string,
    'success' | 'info' | 'warning' | 'secondary' | 'error'> =
  {
    Investment: 'success',
    Insurance: 'info',
    Medical: 'warning',
    Housing: 'info',
    Education: 'secondary',
    Donation: 'secondary',
    Other: 'secondary'
  };
  return map[cat] || 'secondary';
};
const emptyForm = {
  sectionCode: '',
  sectionName: '',
  category: 'Investment' as ExemptionSection['category'],
  maximumLimit: 0,
  subLimitDetails: '',
  allowedUnderRegimes: 'Old Only' as ExemptionSection['allowedUnderRegimes'],
  requiresProof: true,
  allowMonthlyConsideration: false,
  status: 'Active' as ExemptionSection['status']
};
const emptySubForm = {
  name: '',
  parentId: '',
  maxAmount: 0,
  description: '',
  requiresProof: true,
  proofTypes: [] as string[],
  status: 'Active' as ExemptionSubCategory['status']
};
export function ExemptionDeductionSectionMaster() {
  const [view, setView] = useState<'category' | 'sub'>('category');
  const [sections, setSections] = useState(mockSections);
  const [subCategories, setSubCategories] = useState(mockSubCategories);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regimeFilter, setRegimeFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [subForm, setSubForm] = useState(emptySubForm);
  const [subNotice, setSubNotice] = useState('');
  const filtered = sections.filter((s) => {
    const matchSearch =
    s.sectionName.toLowerCase().includes(search.toLowerCase()) ||
    s.sectionCode.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || s.category === categoryFilter;
    const matchRegime =
    !regimeFilter ||
    s.allowedUnderRegimes === regimeFilter ||
    s.allowedUnderRegimes === 'Both';
    return matchSearch && matchCat && matchRegime;
  });
  const resetForm = () => {
    setForm(emptyForm);
    setSubForm(emptySubForm);
    setShowForm(false);
    setEditId(null);
    setSubNotice('');
  };
  const handleSave = () => {
    if (!form.sectionName.trim()) return;
    if (editId) {
      setSections((prev) =>
      prev.map((s) =>
      s.id === editId ?
      {
        ...s,
        ...form
      } :
      s
      )
      );
    } else {
      setSections((prev) => [
      ...prev,
      {
        ...form,
        id: `ES${Date.now()}`,
        status: form.status
      }]
      );
    }
    resetForm();
  };
  const handleSaveSub = () => {
    if (!subForm.name.trim() || !subForm.parentId) { setSubNotice('Sub-category name and parent category are required.'); return; }
    const parent = sections.find((s) => s.id === subForm.parentId);
    if (parent && parent.maximumLimit > 0 && subForm.maxAmount > parent.maximumLimit) {
      setSubNotice(`Max deduction cannot exceed parent category limit of ₹${parent.maximumLimit.toLocaleString('en-IN')}.`);
      return;
    }
    if (editId) {
      setSubCategories((prev) => prev.map((s) => s.id === editId ? { ...s, ...subForm } : s));
    } else {
      setSubCategories((prev) => [...prev, { ...subForm, id: `SUB${Date.now()}` }]);
    }
    resetForm();
  };
  const handleEdit = (s: ExemptionSection) => {
    setView('category');
    setForm({
      sectionCode: s.sectionCode,
      sectionName: s.sectionName,
      category: s.category,
      maximumLimit: s.maximumLimit,
      subLimitDetails: s.subLimitDetails,
      allowedUnderRegimes: s.allowedUnderRegimes,
      requiresProof: s.requiresProof,
      allowMonthlyConsideration: s.allowMonthlyConsideration,
      status: s.status
    });
    setEditId(s.id);
    setShowForm(true);
  };
  const handleEditSub = (s: ExemptionSubCategory) => {
    setView('sub');
    setSubForm({
      name: s.name,
      parentId: s.parentId,
      maxAmount: s.maxAmount,
      description: s.description,
      requiresProof: s.requiresProof,
      proofTypes: s.proofTypes,
      status: s.status
    });
    setEditId(s.id);
    setShowForm(true);
  };
  const proofRequired = sections.filter((s) => s.requiresProof).length;
  const monthlyConsideration = sections.filter(
    (s) => s.allowMonthlyConsideration
  ).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Exemption & Deduction Section Master
          </h1>
          <p className="text-sm text-gray-500">
            Maintain tax sections for employee deduction and exemption claims
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          {view === 'sub' ? 'Add Sub-Category' : 'Add Section'}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${view === 'category' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => { setView('category'); resetForm(); }}>Employee Tax Exemption Category</button>
        <button type="button" className={`rounded-lg border px-3 py-2 text-sm ${view === 'sub' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'}`} onClick={() => { setView('sub'); resetForm(); }}>Employee Tax Exemption Sub-Category</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{sections.length}</p>
            <p className="text-xs text-gray-500">Total Sections</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {sections.filter((s) => s.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active Sections</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{proofRequired}</p>
            <p className="text-xs text-gray-500">Proof Required</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{monthlyConsideration}</p>
            <p className="text-xs text-gray-500">Monthly in Payroll</p>
          </div>
        </div>
      </div>

      {showForm && view === 'category' &&
      <Card title={editId ? 'Edit Section' : 'Add New Section'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Section Code *"
            value={form.sectionCode}
            onChange={(e) =>
            setForm({
              ...form,
              sectionCode: e.target.value
            })
            }
            placeholder="e.g., 80C" />

            <Input
            label="Section Name *"
            value={form.sectionName}
            onChange={(e) =>
            setForm({
              ...form,
              sectionName: e.target.value
            })
            }
            placeholder="e.g., Investments & Savings (80C)" />

            <Select
            label="Category *"
            options={[
            {
              value: 'Investment',
              label: 'Investment'
            },
            {
              value: 'Insurance',
              label: 'Insurance'
            },
            {
              value: 'Medical',
              label: 'Medical'
            },
            {
              value: 'Housing',
              label: 'Housing'
            },
            {
              value: 'Education',
              label: 'Education'
            },
            {
              value: 'Donation',
              label: 'Donation'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={form.category}
            onChange={(e) =>
            setForm({
              ...form,
              category: e.target.value as any
            })
            } />

            <Input
            label="Maximum Annual Limit (₹, 0 = No Limit)"
            type="number"
            value={form.maximumLimit}
            onChange={(e) =>
            setForm({
              ...form,
              maximumLimit: parseInt(e.target.value) || 0
            })
            } />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-limit Details / Notes
              </label>
              <textarea
              value={form.subLimitDetails}
              onChange={(e) =>
              setForm({
                ...form,
                subLimitDetails: e.target.value
              })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <Select
            label="Allowed Under Regimes *"
            options={[
            {
              value: 'Old Only',
              label: 'Old Regime Only'
            },
            {
              value: 'New Only',
              label: 'New Regime Only'
            },
            {
              value: 'Both',
              label: 'Both Regimes'
            }]
            }
            value={form.allowedUnderRegimes}
            onChange={(e) =>
            setForm({
              ...form,
              allowedUnderRegimes: e.target.value as any
            })
            } />

            <div className="flex flex-col gap-3 justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.requiresProof}
                onChange={(e) =>
                setForm({
                  ...form,
                  requiresProof: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Requires Proof Submission
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.allowMonthlyConsideration}
                onChange={(e) =>
                setForm({
                  ...form,
                  allowMonthlyConsideration: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Allow Monthly Consideration in Payroll
                </span>
              </label>
              <Toggle label="Is Active" checked={form.status === 'Active'} onChange={(checked) => setForm({ ...form, status: checked ? 'Active' : 'Inactive' })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }
      {showForm && view === 'sub' &&
      <Card title={editId ? 'Edit Sub-Category' : 'Add Sub-Category'}>
          {subNotice && <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{subNotice}</p>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Sub-Category Name *" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} placeholder="e.g., Life Insurance Premium" />
            <Select
              label="Parent Category *"
              options={[{ value: '', label: 'Select category' }, ...sections.filter((s) => s.status === 'Active').map((s) => ({ value: s.id, label: s.sectionName }))]}
              value={subForm.parentId}
              onChange={(e) => setSubForm({ ...subForm, parentId: typeof e === 'string' ? e : e.target.value })}
            />
            <Input
              label="Max Deduction Amount (₹, 0 = No Limit)"
              type="number"
              value={subForm.maxAmount}
              onChange={(e) => setSubForm({ ...subForm, maxAmount: parseInt(e.target.value, 10) || 0 })}
            />
            <Toggle label="Requires Proof" checked={subForm.requiresProof} onChange={(checked) => setSubForm({ ...subForm, requiresProof: checked, proofTypes: checked ? subForm.proofTypes : [] })} />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={subForm.description}
                onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tooltip text on the declaration form"
              />
            </div>
            {subForm.requiresProof && (
              <div className="col-span-2">
                <MultiSelect label="Proof Document Types" options={PROOF_TYPE_OPTIONS} value={subForm.proofTypes} onChange={(proofTypes) => setSubForm({ ...subForm, proofTypes })} placeholder="PDF / Image / Certificate" />
              </div>
            )}
            <Toggle label="Is Active" checked={subForm.status === 'Active'} onChange={(checked) => setSubForm({ ...subForm, status: checked ? 'Active' : 'Inactive' })} />
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSaveSub}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      }

      {view === 'category' && <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Categories'
            },
            {
              value: 'Investment',
              label: 'Investment'
            },
            {
              value: 'Insurance',
              label: 'Insurance'
            },
            {
              value: 'Medical',
              label: 'Medical'
            },
            {
              value: 'Housing',
              label: 'Housing'
            },
            {
              value: 'Education',
              label: 'Education'
            },
            {
              value: 'Donation',
              label: 'Donation'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)} />

          <Select
            options={[
            {
              value: '',
              label: 'All Regimes'
            },
            {
              value: 'Old Only',
              label: 'Old Regime'
            },
            {
              value: 'New Only',
              label: 'New Regime'
            }]
            }
            value={regimeFilter}
            onChange={(e) => setRegimeFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Section
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Max Limit
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Regimes
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Proof
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Monthly
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) =>
              <tr
                key={s.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {s.sectionName}
                        </p>
                        <p className="text-xs text-gray-500">{s.sectionCode}</p>
                        {s.sectionCode === '10(13A)' && (
                          <p className="mt-1 text-[11px] text-amber-700">HRA computation — three-leg formula, Metro/Non-Metro classification and proof documents — is governed by HRA & Special Exemption Rule Master. Configure that page before activating HRA exemption in payroll.</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={categoryColor(s.category)}>
                      {s.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">
                    {s.maximumLimit > 0 ?
                  `₹${s.maximumLimit.toLocaleString()}` :
                  'No Limit'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    s.allowedUnderRegimes === 'Both' ?
                    'success' :
                    s.allowedUnderRegimes === 'Old Only' ?
                    'secondary' :
                    'info'
                    }>

                      {s.allowedUnderRegimes}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={s.requiresProof ? 'warning' : 'secondary'}>
                      {s.requiresProof ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    s.allowMonthlyConsideration ? 'success' : 'secondary'
                    }>

                      {s.allowMonthlyConsideration ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={s.status === 'Active' ? 'success' : 'secondary'}>

                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(s)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-1.5 hover:bg-red-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>}
      {view === 'sub' && <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Sub-Category</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Parent Category</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Max Amount</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Proof</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase())).map((s, i) => {
                const parent = sections.find((p) => p.id === s.parentId);
                return (
                  <tr key={s.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.description}</p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">{parent?.sectionName || '—'}</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-700">{s.maxAmount > 0 ? `₹${s.maxAmount.toLocaleString('en-IN')}` : 'No Limit'}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={s.requiresProof ? 'warning' : 'secondary'}>{s.requiresProof ? (s.proofTypes.join(', ') || 'Yes') : 'No'}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={s.status === 'Active' ? 'success' : 'secondary'}>{s.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => handleEditSub(s)} className="p-1.5 hover:bg-blue-100 rounded-lg"><Edit className="w-4 h-4 text-blue-600" /></button>
                        <button type="button" onClick={() => setSubCategories((prev) => prev.filter((item) => item.id !== s.id))} className="p-1.5 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>}
    </div>);

}