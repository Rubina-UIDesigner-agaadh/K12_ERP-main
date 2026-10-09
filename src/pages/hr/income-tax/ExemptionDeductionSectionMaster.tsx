import React, { useState, Children } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
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
}];

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
  allowMonthlyConsideration: false
};
export function ExemptionDeductionSectionMaster() {
  const [sections, setSections] = useState(mockSections);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [regimeFilter, setRegimeFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
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
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
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
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (s: ExemptionSection) => {
    setForm({
      sectionCode: s.sectionCode,
      sectionName: s.sectionName,
      category: s.category,
      maximumLimit: s.maximumLimit,
      subLimitDetails: s.subLimitDetails,
      allowedUnderRegimes: s.allowedUnderRegimes,
      requiresProof: s.requiresProof,
      allowMonthlyConsideration: s.allowMonthlyConsideration
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
          Add Section
        </Button>
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

      {showForm &&
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
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Section
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
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
      </Card>
    </div>);

}