import React, { useState } from 'react';
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
  ArrowRight,
  DollarSign,
  CheckCircle } from
'lucide-react';
interface IncomeHeadMapping {
  id: string;
  payHeadCode: string;
  payHeadName: string;
  incomeTaxHeadCategory:
  'Basic Salary' |
  'Allowances' |
  'Perquisites' |
  'Bonus' |
  'Reimbursement' |
  'Other Income';
  isFullyTaxable: boolean;
  exemptionSection: string;
  standardExemptAmount: number;
  standardExemptPercent: number;
  status: 'Active' | 'Inactive';
}
const mockMappings: IncomeHeadMapping[] = [
{
  id: 'IH001',
  payHeadCode: 'BASIC',
  payHeadName: 'Basic Salary',
  incomeTaxHeadCategory: 'Basic Salary',
  isFullyTaxable: true,
  exemptionSection: '',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH002',
  payHeadCode: 'DA',
  payHeadName: 'Dearness Allowance',
  incomeTaxHeadCategory: 'Allowances',
  isFullyTaxable: true,
  exemptionSection: '',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH003',
  payHeadCode: 'HRA',
  payHeadName: 'House Rent Allowance',
  incomeTaxHeadCategory: 'Allowances',
  isFullyTaxable: false,
  exemptionSection: '10(13A)',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH004',
  payHeadCode: 'CONV',
  payHeadName: 'Conveyance Allowance',
  incomeTaxHeadCategory: 'Allowances',
  isFullyTaxable: false,
  exemptionSection: '10(14)',
  standardExemptAmount: 1600,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH005',
  payHeadCode: 'MED_ALL',
  payHeadName: 'Medical Allowance',
  incomeTaxHeadCategory: 'Allowances',
  isFullyTaxable: false,
  exemptionSection: '10(14)',
  standardExemptAmount: 15000,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH006',
  payHeadCode: 'BONUS',
  payHeadName: 'Annual Bonus',
  incomeTaxHeadCategory: 'Bonus',
  isFullyTaxable: true,
  exemptionSection: '',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH007',
  payHeadCode: 'LTA',
  payHeadName: 'Leave Travel Allowance',
  incomeTaxHeadCategory: 'Allowances',
  isFullyTaxable: false,
  exemptionSection: '10(5)',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
},
{
  id: 'IH008',
  payHeadCode: 'REIMB',
  payHeadName: 'Expense Reimbursement',
  incomeTaxHeadCategory: 'Reimbursement',
  isFullyTaxable: false,
  exemptionSection: '',
  standardExemptAmount: 0,
  standardExemptPercent: 0,
  status: 'Active'
}];

const categoryColor = (
cat: string)
: 'success' | 'info' | 'warning' | 'secondary' | 'error' => {
  const map: Record<
    string,
    'success' | 'info' | 'warning' | 'secondary' | 'error'> =
  {
    'Basic Salary': 'success',
    Allowances: 'info',
    Perquisites: 'warning',
    Bonus: 'error',
    Reimbursement: 'secondary',
    'Other Income': 'secondary'
  };
  return map[cat] || 'secondary';
};
const emptyForm = {
  payHeadCode: '',
  payHeadName: '',
  incomeTaxHeadCategory:
  'Basic Salary' as IncomeHeadMapping['incomeTaxHeadCategory'],
  isFullyTaxable: true,
  exemptionSection: '',
  standardExemptAmount: 0,
  standardExemptPercent: 0
};
export function IncomeHeadMappingMaster() {
  const [mappings, setMappings] = useState(mockMappings);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const filtered = mappings.filter((m) => {
    const matchSearch =
    m.payHeadName.toLowerCase().includes(search.toLowerCase()) ||
    m.payHeadCode.toLowerCase().includes(search.toLowerCase());
    const matchCat =
    !categoryFilter || m.incomeTaxHeadCategory === categoryFilter;
    return matchSearch && matchCat;
  });
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setMappings((prev) =>
      prev.map((m) =>
      m.id === editId ?
      {
        ...m,
        ...form
      } :
      m
      )
      );
    } else {
      setMappings((prev) => [
      ...prev,
      {
        ...form,
        id: `IH${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (m: IncomeHeadMapping) => {
    setForm({
      payHeadCode: m.payHeadCode,
      payHeadName: m.payHeadName,
      incomeTaxHeadCategory: m.incomeTaxHeadCategory,
      isFullyTaxable: m.isFullyTaxable,
      exemptionSection: m.exemptionSection,
      standardExemptAmount: m.standardExemptAmount,
      standardExemptPercent: m.standardExemptPercent
    });
    setEditId(m.id);
    setShowForm(true);
  };
  const fullyTaxable = mappings.filter((m) => m.isFullyTaxable).length;
  const partiallyExempt = mappings.filter(
    (m) => !m.isFullyTaxable && m.exemptionSection
  ).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Income Head Mapping Master
          </h1>
          <p className="text-sm text-gray-500">
            Map salary pay heads to income tax head categories for TDS and Form
            16
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{mappings.length}</p>
            <p className="text-xs text-gray-500">Total Mappings</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{fullyTaxable}</p>
            <p className="text-xs text-gray-500">Fully Taxable</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{partiallyExempt}</p>
            <p className="text-xs text-gray-500">Partially Exempt</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {new Set(mappings.map((m) => m.incomeTaxHeadCategory)).size}
            </p>
            <p className="text-xs text-gray-500">Tax Head Categories</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Mapping' : 'Add New Mapping'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Pay Head Code *"
            value={form.payHeadCode}
            onChange={(e) =>
            setForm({
              ...form,
              payHeadCode: e.target.value
            })
            }
            placeholder="e.g., BASIC" />

            <Input
            label="Pay Head Name *"
            value={form.payHeadName}
            onChange={(e) =>
            setForm({
              ...form,
              payHeadName: e.target.value
            })
            }
            placeholder="e.g., Basic Salary" />

            <Select
            label="Income Tax Head Category *"
            options={[
            {
              value: 'Basic Salary',
              label: 'Basic Salary'
            },
            {
              value: 'Allowances',
              label: 'Allowances'
            },
            {
              value: 'Perquisites',
              label: 'Perquisites'
            },
            {
              value: 'Bonus',
              label: 'Bonus'
            },
            {
              value: 'Reimbursement',
              label: 'Reimbursement'
            },
            {
              value: 'Other Income',
              label: 'Other Income'
            }]
            }
            value={form.incomeTaxHeadCategory}
            onChange={(e) =>
            setForm({
              ...form,
              incomeTaxHeadCategory: e.target.value as any
            })
            } />

            <div className="flex items-center mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isFullyTaxable}
                onChange={(e) =>
                setForm({
                  ...form,
                  isFullyTaxable: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">Fully Taxable</span>
              </label>
            </div>
            {!form.isFullyTaxable &&
          <>
                <Input
              label="Exemption Section (if partially exempt)"
              value={form.exemptionSection}
              onChange={(e) =>
              setForm({
                ...form,
                exemptionSection: e.target.value
              })
              }
              placeholder="e.g., 10(13A)" />

                <div />
                <Input
              label="Standard Exempt Amount (₹, 0 = N/A)"
              type="number"
              value={form.standardExemptAmount}
              onChange={(e) =>
              setForm({
                ...form,
                standardExemptAmount: parseInt(e.target.value) || 0
              })
              } />

                <Input
              label="Standard Exempt Percentage (%, 0 = N/A)"
              type="number"
              value={form.standardExemptPercent}
              onChange={(e) =>
              setForm({
                ...form,
                standardExemptPercent: parseFloat(e.target.value) || 0
              })
              } />

              </>
          }
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Mapping
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
              placeholder="Search pay heads..."
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
              value: 'Basic Salary',
              label: 'Basic Salary'
            },
            {
              value: 'Allowances',
              label: 'Allowances'
            },
            {
              value: 'Perquisites',
              label: 'Perquisites'
            },
            {
              value: 'Bonus',
              label: 'Bonus'
            },
            {
              value: 'Reimbursement',
              label: 'Reimbursement'
            },
            {
              value: 'Other Income',
              label: 'Other Income'
            }]
            }
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Pay Head
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  →
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  IT Head Category
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Fully Taxable
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Exemption Section
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Exempt Amount
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
              {filtered.map((m, i) =>
              <tr
                key={m.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <p className="text-sm font-semibold text-gray-900">
                      {m.payHeadName}
                    </p>
                    <p className="text-xs text-gray-500">{m.payHeadCode}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={categoryColor(m.incomeTaxHeadCategory)}>
                      {m.incomeTaxHeadCategory}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={m.isFullyTaxable ? 'error' : 'success'}>
                      {m.isFullyTaxable ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {m.exemptionSection || '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-600">
                    {m.standardExemptAmount > 0 ?
                  `₹${m.standardExemptAmount.toLocaleString()}` :
                  m.standardExemptPercent > 0 ?
                  `${m.standardExemptPercent}%` :
                  '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={m.status === 'Active' ? 'success' : 'secondary'}>

                      {m.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(m)}
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