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
  Shield,
  CheckCircle,
  Star } from
'lucide-react';
interface TaxRegime {
  id: string;
  regimeCode: string;
  regimeName: string;
  financialYear: string;
  description: string;
  isDefault: boolean;
  allowsDeductionsExemptions: boolean;
  separateSlabsByAgeGender: boolean;
  status: 'Active' | 'Inactive';
}
const mockRegimes: TaxRegime[] = [
{
  id: 'TR001',
  regimeCode: 'NEW_2526',
  regimeName: 'New Tax Regime',
  financialYear: 'FY 2025-26',
  description:
  'Lower tax rates with no deductions/exemptions (except standard deduction). Default from FY 2023-24 onwards.',
  isDefault: true,
  allowsDeductionsExemptions: false,
  separateSlabsByAgeGender: false,
  status: 'Active'
},
{
  id: 'TR002',
  regimeCode: 'OLD_2526',
  regimeName: 'Old Tax Regime',
  financialYear: 'FY 2025-26',
  description:
  'Traditional regime with higher rates but allows all deductions under 80C, 80D, HRA, LTA, etc.',
  isDefault: false,
  allowsDeductionsExemptions: true,
  separateSlabsByAgeGender: true,
  status: 'Active'
},
{
  id: 'TR003',
  regimeCode: 'NEW_2425',
  regimeName: 'New Tax Regime',
  financialYear: 'FY 2024-25',
  description: 'New regime for FY 2024-25.',
  isDefault: true,
  allowsDeductionsExemptions: false,
  separateSlabsByAgeGender: false,
  status: 'Inactive'
},
{
  id: 'TR004',
  regimeCode: 'OLD_2425',
  regimeName: 'Old Tax Regime',
  financialYear: 'FY 2024-25',
  description: 'Old regime for FY 2024-25.',
  isDefault: false,
  allowsDeductionsExemptions: true,
  separateSlabsByAgeGender: true,
  status: 'Inactive'
}];

const emptyForm = {
  regimeCode: '',
  regimeName: '',
  financialYear: 'FY 2025-26',
  description: '',
  isDefault: false,
  allowsDeductionsExemptions: true,
  separateSlabsByAgeGender: false
};
export function TaxRegimeMaster() {
  const [regimes, setRegimes] = useState(mockRegimes);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [fyFilter, setFyFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const filtered = regimes.filter((r) => {
    const matchSearch =
    r.regimeName.toLowerCase().includes(search.toLowerCase()) ||
    r.regimeCode.toLowerCase().includes(search.toLowerCase());
    const matchFY = !fyFilter || r.financialYear === fyFilter;
    return matchSearch && matchFY;
  });
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setRegimes((prev) =>
      prev.map((r) =>
      r.id === editId ?
      {
        ...r,
        ...form
      } :
      r
      )
      );
    } else {
      setRegimes((prev) => [
      ...prev,
      {
        ...form,
        id: `TR${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (r: TaxRegime) => {
    setForm({
      regimeCode: r.regimeCode,
      regimeName: r.regimeName,
      financialYear: r.financialYear,
      description: r.description,
      isDefault: r.isDefault,
      allowsDeductionsExemptions: r.allowsDeductionsExemptions,
      separateSlabsByAgeGender: r.separateSlabsByAgeGender
    });
    setEditId(r.id);
    setShowForm(true);
  };
  const activeCount = regimes.filter((r) => r.status === 'Active').length;
  const defaultCount = regimes.filter((r) => r.isDefault).length;
  const fyCount = new Set(regimes.map((r) => r.financialYear)).size;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tax Regime Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure available tax regimes for each financial year
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Regime
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{regimes.length}</p>
            <p className="text-xs text-gray-500">Total Regimes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{activeCount}</p>
            <p className="text-xs text-gray-500">Active Regimes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{defaultCount}</p>
            <p className="text-xs text-gray-500">Default Regimes</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{fyCount}</p>
            <p className="text-xs text-gray-500">Financial Years</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Tax Regime' : 'Add New Tax Regime'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Regime Code *"
            value={form.regimeCode}
            onChange={(e) =>
            setForm({
              ...form,
              regimeCode: e.target.value
            })
            }
            placeholder="e.g., NEW_2526" />

            <Input
            label="Regime Name *"
            value={form.regimeName}
            onChange={(e) =>
            setForm({
              ...form,
              regimeName: e.target.value
            })
            }
            placeholder="e.g., New Tax Regime" />

            <Select
            label="Financial Year *"
            options={[
            {
              value: 'FY 2025-26',
              label: 'FY 2025-26'
            },
            {
              value: 'FY 2024-25',
              label: 'FY 2024-25'
            },
            {
              value: 'FY 2023-24',
              label: 'FY 2023-24'
            }]
            }
            value={form.financialYear}
            onChange={(e) =>
            setForm({
              ...form,
              financialYear: e.target.value
            })
            } />

            <div />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
              value={form.description}
              onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this regime..." />

            </div>
            <div className="col-span-2 grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) =>
                setForm({
                  ...form,
                  isDefault: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Is Default for New Employees
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.allowsDeductionsExemptions}
                onChange={(e) =>
                setForm({
                  ...form,
                  allowsDeductionsExemptions: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Allows Deductions / Exemptions
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.separateSlabsByAgeGender}
                onChange={(e) =>
                setForm({
                  ...form,
                  separateSlabsByAgeGender: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Separate Slabs by Age / Gender
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Regime
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
              placeholder="Search regimes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Financial Years'
            },
            {
              value: 'FY 2025-26',
              label: 'FY 2025-26'
            },
            {
              value: 'FY 2024-25',
              label: 'FY 2024-25'
            },
            {
              value: 'FY 2023-24',
              label: 'FY 2023-24'
            }]
            }
            value={fyFilter}
            onChange={(e) => setFyFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Regime
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  FY
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Default
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Deductions
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Age Slabs
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
              {filtered.map((r, i) =>
              <tr
                key={r.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {r.regimeName}
                        </p>
                        <p className="text-xs text-gray-500">{r.regimeCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {r.financialYear}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {r.isDefault ?
                  <Badge variant="info">Default</Badge> :

                  <span className="text-xs text-gray-400">—</span>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    r.allowsDeductionsExemptions ? 'success' : 'secondary'
                    }>

                      {r.allowsDeductionsExemptions ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    r.separateSlabsByAgeGender ? 'warning' : 'secondary'
                    }>

                      {r.separateSlabsByAgeGender ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={r.status === 'Active' ? 'success' : 'secondary'}>

                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(r)}
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