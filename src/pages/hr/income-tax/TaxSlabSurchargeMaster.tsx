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
  BarChart3,
  Percent,
  TrendingUp } from
'lucide-react';
interface TaxSlab {
  id: string;
  financialYear: string;
  taxRegime: string;
  ageCategory: '<60' | '60-80' | '>80' | 'All';
  slabSequence: number;
  incomeFrom: number;
  incomeTo: number | null;
  isAbove: boolean;
  basicTaxRate: number;
  cessPercent: number;
  surchargeApplicable: boolean;
  surchargeRate: number;
  surchargeThreshold: number;
  marginalReliefApplicable: boolean;
  status: 'Active' | 'Inactive';
}
const mockSlabs: TaxSlab[] = [
{
  id: 'TS001',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 1,
  incomeFrom: 0,
  incomeTo: 400000,
  isAbove: false,
  basicTaxRate: 0,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS002',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 2,
  incomeFrom: 400001,
  incomeTo: 800000,
  isAbove: false,
  basicTaxRate: 5,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS003',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 3,
  incomeFrom: 800001,
  incomeTo: 1200000,
  isAbove: false,
  basicTaxRate: 10,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS004',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 4,
  incomeFrom: 1200001,
  incomeTo: 1600000,
  isAbove: false,
  basicTaxRate: 15,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS005',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 5,
  incomeFrom: 1600001,
  incomeTo: 2000000,
  isAbove: false,
  basicTaxRate: 20,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS006',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 6,
  incomeFrom: 2000001,
  incomeTo: 2400000,
  isAbove: false,
  basicTaxRate: 25,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS007',
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All',
  slabSequence: 7,
  incomeFrom: 2400001,
  incomeTo: null,
  isAbove: true,
  basicTaxRate: 30,
  cessPercent: 4,
  surchargeApplicable: true,
  surchargeRate: 10,
  surchargeThreshold: 5000000,
  marginalReliefApplicable: true,
  status: 'Active'
},
{
  id: 'TS008',
  financialYear: 'FY 2025-26',
  taxRegime: 'Old Regime',
  ageCategory: '<60',
  slabSequence: 1,
  incomeFrom: 0,
  incomeTo: 250000,
  isAbove: false,
  basicTaxRate: 0,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS009',
  financialYear: 'FY 2025-26',
  taxRegime: 'Old Regime',
  ageCategory: '<60',
  slabSequence: 2,
  incomeFrom: 250001,
  incomeTo: 500000,
  isAbove: false,
  basicTaxRate: 5,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS010',
  financialYear: 'FY 2025-26',
  taxRegime: 'Old Regime',
  ageCategory: '<60',
  slabSequence: 3,
  incomeFrom: 500001,
  incomeTo: 1000000,
  isAbove: false,
  basicTaxRate: 20,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false,
  status: 'Active'
},
{
  id: 'TS011',
  financialYear: 'FY 2025-26',
  taxRegime: 'Old Regime',
  ageCategory: '<60',
  slabSequence: 4,
  incomeFrom: 1000001,
  incomeTo: null,
  isAbove: true,
  basicTaxRate: 30,
  cessPercent: 4,
  surchargeApplicable: true,
  surchargeRate: 10,
  surchargeThreshold: 5000000,
  marginalReliefApplicable: true,
  status: 'Active'
}];

const emptyForm = {
  financialYear: 'FY 2025-26',
  taxRegime: 'New Regime',
  ageCategory: 'All' as TaxSlab['ageCategory'],
  slabSequence: 1,
  incomeFrom: 0,
  incomeTo: 0,
  isAbove: false,
  basicTaxRate: 0,
  cessPercent: 4,
  surchargeApplicable: false,
  surchargeRate: 0,
  surchargeThreshold: 0,
  marginalReliefApplicable: false
};
export function TaxSlabSurchargeMaster() {
  const [slabs, setSlabs] = useState(mockSlabs);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [fyFilter, setFyFilter] = useState('FY 2025-26');
  const [regimeFilter, setRegimeFilter] = useState('');
  const [form, setForm] = useState(emptyForm);
  const filtered = slabs.
  filter((s) => {
    const matchFY = !fyFilter || s.financialYear === fyFilter;
    const matchRegime = !regimeFilter || s.taxRegime === regimeFilter;
    return matchFY && matchRegime;
  }).
  sort((a, b) => a.slabSequence - b.slabSequence);
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setSlabs((prev) =>
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
      setSlabs((prev) => [
      ...prev,
      {
        ...form,
        id: `TS${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (s: TaxSlab) => {
    setForm({
      financialYear: s.financialYear,
      taxRegime: s.taxRegime,
      ageCategory: s.ageCategory,
      slabSequence: s.slabSequence,
      incomeFrom: s.incomeFrom,
      incomeTo: s.incomeTo || 0,
      isAbove: s.isAbove,
      basicTaxRate: s.basicTaxRate,
      cessPercent: s.cessPercent,
      surchargeApplicable: s.surchargeApplicable,
      surchargeRate: s.surchargeRate,
      surchargeThreshold: s.surchargeThreshold,
      marginalReliefApplicable: s.marginalReliefApplicable
    });
    setEditId(s.id);
    setShowForm(true);
  };
  const uniqueRegimes = [...new Set(slabs.map((s) => s.taxRegime))];
  const surchargeSlabs = slabs.filter((s) => s.surchargeApplicable).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tax Slab & Surcharge Master
          </h1>
          <p className="text-sm text-gray-500">
            Define slab-wise tax rates and surcharge rules per regime
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Slab
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{slabs.length}</p>
            <p className="text-xs text-gray-500">Total Slabs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Percent className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{uniqueRegimes.length}</p>
            <p className="text-xs text-gray-500">Regimes Configured</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{surchargeSlabs}</p>
            <p className="text-xs text-gray-500">Surcharge Slabs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Percent className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">4%</p>
            <p className="text-xs text-gray-500">Health & Edu Cess</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Tax Slab' : 'Add New Tax Slab'}>
          <div className="grid grid-cols-3 gap-4 mb-4">
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
            }]
            }
            value={form.financialYear}
            onChange={(e) =>
            setForm({
              ...form,
              financialYear: e.target.value
            })
            } />

            <Select
            label="Tax Regime *"
            options={[
            {
              value: 'New Regime',
              label: 'New Regime'
            },
            {
              value: 'Old Regime',
              label: 'Old Regime'
            }]
            }
            value={form.taxRegime}
            onChange={(e) =>
            setForm({
              ...form,
              taxRegime: e.target.value
            })
            } />

            <Select
            label="Age Category"
            options={[
            {
              value: 'All',
              label: 'All Ages'
            },
            {
              value: '<60',
              label: 'Below 60'
            },
            {
              value: '60-80',
              label: '60 to 80 (Senior)'
            },
            {
              value: '>80',
              label: 'Above 80 (Super Senior)'
            }]
            }
            value={form.ageCategory}
            onChange={(e) =>
            setForm({
              ...form,
              ageCategory: e.target.value as any
            })
            } />

            <Input
            label="Slab Sequence *"
            type="number"
            value={form.slabSequence}
            onChange={(e) =>
            setForm({
              ...form,
              slabSequence: parseInt(e.target.value) || 1
            })
            } />

            <Input
            label="Income From (₹) *"
            type="number"
            value={form.incomeFrom}
            onChange={(e) =>
            setForm({
              ...form,
              incomeFrom: parseInt(e.target.value) || 0
            })
            } />

            <div>
              <Input
              label="Income To (₹)"
              type="number"
              value={form.incomeTo}
              onChange={(e) =>
              setForm({
                ...form,
                incomeTo: parseInt(e.target.value) || 0
              })
              } />

              <label className="flex items-center gap-2 cursor-pointer mt-1">
                <input
                type="checkbox"
                checked={form.isAbove}
                onChange={(e) =>
                setForm({
                  ...form,
                  isAbove: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-xs text-gray-600">
                  Above (no upper limit)
                </span>
              </label>
            </div>
            <Input
            label="Basic Tax Rate (%)"
            type="number"
            value={form.basicTaxRate}
            onChange={(e) =>
            setForm({
              ...form,
              basicTaxRate: parseFloat(e.target.value) || 0
            })
            } />

            <Input
            label="Cess (%)"
            type="number"
            value={form.cessPercent}
            onChange={(e) =>
            setForm({
              ...form,
              cessPercent: parseFloat(e.target.value) || 0
            })
            } />

            <div />
            <div className="col-span-3 grid grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.surchargeApplicable}
                onChange={(e) =>
                setForm({
                  ...form,
                  surchargeApplicable: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Surcharge Applicable
                </span>
              </label>
              {form.surchargeApplicable &&
            <>
                  <Input
                label="Surcharge Rate (%)"
                type="number"
                value={form.surchargeRate}
                onChange={(e) =>
                setForm({
                  ...form,
                  surchargeRate: parseFloat(e.target.value) || 0
                })
                } />

                  <Input
                label="Surcharge Threshold (₹)"
                type="number"
                value={form.surchargeThreshold}
                onChange={(e) =>
                setForm({
                  ...form,
                  surchargeThreshold: parseInt(e.target.value) || 0
                })
                } />

                </>
            }
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.marginalReliefApplicable}
                onChange={(e) =>
                setForm({
                  ...form,
                  marginalReliefApplicable: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                <span className="text-sm text-gray-700">
                  Marginal Relief Applicable
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Slab
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <Select
            label=""
            options={[
            {
              value: 'FY 2025-26',
              label: 'FY 2025-26'
            },
            {
              value: 'FY 2024-25',
              label: 'FY 2024-25'
            }]
            }
            value={fyFilter}
            onChange={(e) => setFyFilter(e.target.value)} />

          <Select
            options={[
            {
              value: '',
              label: 'All Regimes'
            },
            {
              value: 'New Regime',
              label: 'New Regime'
            },
            {
              value: 'Old Regime',
              label: 'Old Regime'
            }]
            }
            value={regimeFilter}
            onChange={(e) => setRegimeFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase">
                  Seq
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Regime
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Age
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Income From
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Income To
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Tax Rate
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Cess
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Surcharge
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

                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {s.slabSequence}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                    variant={
                    s.taxRegime === 'New Regime' ? 'info' : 'secondary'
                    }>

                      {s.taxRegime}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {s.ageCategory}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">
                    ₹{s.incomeFrom.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">
                    {s.isAbove ?
                  'Above' :
                  `₹${(s.incomeTo || 0).toLocaleString()}`}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                    className={`text-sm font-bold ${s.basicTaxRate === 0 ? 'text-green-600' : s.basicTaxRate >= 30 ? 'text-red-600' : 'text-amber-600'}`}>

                      {s.basicTaxRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {s.cessPercent}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {s.surchargeApplicable ?
                  <Badge variant="warning">{s.surchargeRate}%</Badge> :

                  <span className="text-xs text-gray-400">—</span>
                  }
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