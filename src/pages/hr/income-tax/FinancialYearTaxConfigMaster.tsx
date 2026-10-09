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
  Calendar,
  Lock,
  CheckCircle,
  AlertCircle } from
'lucide-react';
interface FinancialYear {
  id: string;
  fyCode: string;
  fyName: string;
  startDate: string;
  endDate: string;
  defaultTaxRegime: string;
  investmentDeclStartDate: string;
  investmentDeclEndDate: string;
  proofSubmissionStartDate: string;
  proofSubmissionEndDate: string;
  standardDeductionAmount: number;
  rebateUnder87A: number;
  isPayrollProcessed: boolean;
  status: 'Active' | 'Inactive';
}
const mockFYs: FinancialYear[] = [
{
  id: 'FY001',
  fyCode: 'FY2025-26',
  fyName: 'FY 2025-26',
  startDate: '2025-04-01',
  endDate: '2026-03-31',
  defaultTaxRegime: 'New Regime',
  investmentDeclStartDate: '2025-04-01',
  investmentDeclEndDate: '2025-06-30',
  proofSubmissionStartDate: '2026-01-01',
  proofSubmissionEndDate: '2026-02-28',
  standardDeductionAmount: 75000,
  rebateUnder87A: 25000,
  isPayrollProcessed: false,
  status: 'Active'
},
{
  id: 'FY002',
  fyCode: 'FY2024-25',
  fyName: 'FY 2024-25',
  startDate: '2024-04-01',
  endDate: '2025-03-31',
  defaultTaxRegime: 'New Regime',
  investmentDeclStartDate: '2024-04-01',
  investmentDeclEndDate: '2024-06-30',
  proofSubmissionStartDate: '2025-01-01',
  proofSubmissionEndDate: '2025-02-28',
  standardDeductionAmount: 50000,
  rebateUnder87A: 25000,
  isPayrollProcessed: true,
  status: 'Inactive'
},
{
  id: 'FY003',
  fyCode: 'FY2023-24',
  fyName: 'FY 2023-24',
  startDate: '2023-04-01',
  endDate: '2024-03-31',
  defaultTaxRegime: 'Old Regime',
  investmentDeclStartDate: '2023-04-01',
  investmentDeclEndDate: '2023-06-30',
  proofSubmissionStartDate: '2024-01-01',
  proofSubmissionEndDate: '2024-02-29',
  standardDeductionAmount: 50000,
  rebateUnder87A: 12500,
  isPayrollProcessed: true,
  status: 'Inactive'
}];

const emptyForm = {
  fyCode: '',
  fyName: '',
  startDate: '',
  endDate: '',
  defaultTaxRegime: 'New Regime',
  investmentDeclStartDate: '',
  investmentDeclEndDate: '',
  proofSubmissionStartDate: '',
  proofSubmissionEndDate: '',
  standardDeductionAmount: 75000,
  rebateUnder87A: 25000
};
export function FinancialYearTaxConfigMaster() {
  const [fyList, setFyList] = useState(mockFYs);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const filtered = fyList.filter(
    (f) =>
    f.fyName.toLowerCase().includes(search.toLowerCase()) ||
    f.fyCode.toLowerCase().includes(search.toLowerCase())
  );
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setFyList((prev) =>
      prev.map((f) =>
      f.id === editId ?
      {
        ...f,
        ...form
      } :
      f
      )
      );
    } else {
      setFyList((prev) => [
      ...prev,
      {
        ...form,
        id: `FY${Date.now()}`,
        isPayrollProcessed: false,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (fy: FinancialYear) => {
    setForm({
      fyCode: fy.fyCode,
      fyName: fy.fyName,
      startDate: fy.startDate,
      endDate: fy.endDate,
      defaultTaxRegime: fy.defaultTaxRegime,
      investmentDeclStartDate: fy.investmentDeclStartDate,
      investmentDeclEndDate: fy.investmentDeclEndDate,
      proofSubmissionStartDate: fy.proofSubmissionStartDate,
      proofSubmissionEndDate: fy.proofSubmissionEndDate,
      standardDeductionAmount: fy.standardDeductionAmount,
      rebateUnder87A: fy.rebateUnder87A
    });
    setEditId(fy.id);
    setShowForm(true);
  };
  const activeFY = fyList.find((f) => f.status === 'Active');
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Financial Year & Tax Configuration Master
          </h1>
          <p className="text-sm text-gray-500">
            Maintain financial years and high-level tax configuration
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Financial Year
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{fyList.length}</p>
            <p className="text-xs text-gray-500">Financial Years</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold">{activeFY?.fyName || '—'}</p>
            <p className="text-xs text-gray-500">Current Active FY</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {fyList.filter((f) => f.isPayrollProcessed).length}
            </p>
            <p className="text-xs text-gray-500">Processed FYs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold">
              {activeFY?.defaultTaxRegime || '—'}
            </p>
            <p className="text-xs text-gray-500">Default Regime</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Financial Year' : 'Add New Financial Year'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="FY Code *"
            value={form.fyCode}
            onChange={(e) =>
            setForm({
              ...form,
              fyCode: e.target.value
            })
            }
            placeholder="e.g., FY2025-26" />

            <Input
            label="FY Name *"
            value={form.fyName}
            onChange={(e) =>
            setForm({
              ...form,
              fyName: e.target.value
            })
            }
            placeholder="e.g., FY 2025-26" />

            <Input
            label="Start Date *"
            type="date"
            value={form.startDate}
            onChange={(e) =>
            setForm({
              ...form,
              startDate: e.target.value
            })
            } />

            <Input
            label="End Date *"
            type="date"
            value={form.endDate}
            onChange={(e) =>
            setForm({
              ...form,
              endDate: e.target.value
            })
            } />

            <Select
            label="Default Tax Regime for New Employees"
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
            value={form.defaultTaxRegime}
            onChange={(e) =>
            setForm({
              ...form,
              defaultTaxRegime: e.target.value
            })
            } />

            <div />
            <Input
            label="Investment Declaration Start Date"
            type="date"
            value={form.investmentDeclStartDate}
            onChange={(e) =>
            setForm({
              ...form,
              investmentDeclStartDate: e.target.value
            })
            } />

            <Input
            label="Investment Declaration End Date"
            type="date"
            value={form.investmentDeclEndDate}
            onChange={(e) =>
            setForm({
              ...form,
              investmentDeclEndDate: e.target.value
            })
            } />

            <Input
            label="Proof Submission Start Date"
            type="date"
            value={form.proofSubmissionStartDate}
            onChange={(e) =>
            setForm({
              ...form,
              proofSubmissionStartDate: e.target.value
            })
            } />

            <Input
            label="Proof Submission End Date"
            type="date"
            value={form.proofSubmissionEndDate}
            onChange={(e) =>
            setForm({
              ...form,
              proofSubmissionEndDate: e.target.value
            })
            } />

            <Input
            label="Standard Deduction Amount (₹)"
            type="number"
            value={form.standardDeductionAmount}
            onChange={(e) =>
            setForm({
              ...form,
              standardDeductionAmount: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Rebate under Section 87A (₹)"
            type="number"
            value={form.rebateUnder87A}
            onChange={(e) =>
            setForm({
              ...form,
              rebateUnder87A: parseInt(e.target.value) || 0
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Financial Year
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
              placeholder="Search financial years..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Financial Year
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Period
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Default Regime
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Std. Deduction
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  87A Rebate
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Payroll
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
              {filtered.map((fy, i) =>
              <tr
                key={fy.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {fy.fyName}
                        </p>
                        <p className="text-xs text-gray-500">{fy.fyCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-600">
                    {fy.startDate} → {fy.endDate}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    fy.defaultTaxRegime === 'New Regime' ?
                    'info' :
                    'secondary'
                    }>

                      {fy.defaultTaxRegime}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">
                    ₹{fy.standardDeductionAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-gray-700">
                    ₹{fy.rebateUnder87A.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {fy.isPayrollProcessed ?
                  <Lock
                    className="w-4 h-4 text-red-500 mx-auto"
                    title="Payroll processed – locked" /> :


                  <CheckCircle
                    className="w-4 h-4 text-green-500 mx-auto"
                    title="Open" />

                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={fy.status === 'Active' ? 'success' : 'secondary'}>

                      {fy.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(fy)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit"
                      disabled={fy.isPayrollProcessed}>

                        <Edit
                        className={`w-4 h-4 ${fy.isPayrollProcessed ? 'text-gray-300' : 'text-blue-600'}`} />

                      </button>
                      <button
                      className="p-1.5 hover:bg-red-100 rounded-lg"
                      title="Delete">

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