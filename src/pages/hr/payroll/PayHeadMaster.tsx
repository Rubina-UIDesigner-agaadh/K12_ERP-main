import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Tabs } from '../../../components/ui/Tabs';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Copy } from
'lucide-react';
interface PayHead {
  id: string;
  code: string;
  name: string;
  type: 'Earning' | 'Deduction' | 'Employer Contribution' | 'Reimbursement';
  category: 'Basic' | 'Allowance' | 'Statutory Deduction' | 'Loan' | 'Other';
  calculationType:
  'Flat Amount' |
  '% of Pay Head' |
  '% of Gross' |
  'Formula' |
  'Slab-based';
  calculationValue: string;
  isTaxable: boolean;
  includeInPF: boolean;
  includeInESI: boolean;
  includeInBonus: boolean;
  isAttendanceDependent: boolean;
  showInPayslip: boolean;
  ledgerCode: string;
  roundingRule: 'No Rounding' | 'Round Up' | 'Round Down' | 'Nearest';
  status: 'Active' | 'Inactive';
}
const mockPayHeads: PayHead[] = [
{
  id: 'PH001',
  code: 'BASIC',
  name: 'Basic Salary',
  type: 'Earning',
  category: 'Basic',
  calculationType: 'Flat Amount',
  calculationValue: '0',
  isTaxable: true,
  includeInPF: true,
  includeInESI: true,
  includeInBonus: true,
  isAttendanceDependent: true,
  showInPayslip: true,
  ledgerCode: 'SAL-001',
  roundingRule: 'Nearest',
  status: 'Active'
},
{
  id: 'PH002',
  code: 'DA',
  name: 'Dearness Allowance',
  type: 'Earning',
  category: 'Allowance',
  calculationType: '% of Pay Head',
  calculationValue: '50% of BASIC',
  isTaxable: true,
  includeInPF: true,
  includeInESI: true,
  includeInBonus: false,
  isAttendanceDependent: true,
  showInPayslip: true,
  ledgerCode: 'SAL-002',
  roundingRule: 'Nearest',
  status: 'Active'
},
{
  id: 'PH003',
  code: 'HRA',
  name: 'House Rent Allowance',
  type: 'Earning',
  category: 'Allowance',
  calculationType: '% of Pay Head',
  calculationValue: '40% of BASIC',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: 'SAL-003',
  roundingRule: 'Nearest',
  status: 'Active'
},
{
  id: 'PH004',
  code: 'CONV',
  name: 'Conveyance Allowance',
  type: 'Earning',
  category: 'Allowance',
  calculationType: 'Flat Amount',
  calculationValue: '1600',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: 'SAL-004',
  roundingRule: 'No Rounding',
  status: 'Active'
},
{
  id: 'PH005',
  code: 'PF_EMP',
  name: 'Provident Fund (Employee)',
  type: 'Deduction',
  category: 'Statutory Deduction',
  calculationType: '% of Pay Head',
  calculationValue: '12% of BASIC+DA',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: 'DED-001',
  roundingRule: 'Round Up',
  status: 'Active'
},
{
  id: 'PH006',
  code: 'ESI_EMP',
  name: 'ESI (Employee)',
  type: 'Deduction',
  category: 'Statutory Deduction',
  calculationType: '% of Gross',
  calculationValue: '0.75% of Gross',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: 'DED-002',
  roundingRule: 'Round Up',
  status: 'Active'
},
{
  id: 'PH007',
  code: 'PT',
  name: 'Professional Tax',
  type: 'Deduction',
  category: 'Statutory Deduction',
  calculationType: 'Slab-based',
  calculationValue: 'PT Slab',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: 'DED-003',
  roundingRule: 'No Rounding',
  status: 'Active'
},
{
  id: 'PH008',
  code: 'PF_ER',
  name: 'Provident Fund (Employer)',
  type: 'Employer Contribution',
  category: 'Statutory Deduction',
  calculationType: '% of Pay Head',
  calculationValue: '12% of BASIC+DA',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: false,
  ledgerCode: 'EMP-001',
  roundingRule: 'Round Up',
  status: 'Active'
}];

const emptyForm = {
  code: '',
  name: '',
  type: 'Earning' as PayHead['type'],
  category: 'Basic' as PayHead['category'],
  calculationType: 'Flat Amount' as PayHead['calculationType'],
  calculationValue: '',
  isTaxable: false,
  includeInPF: false,
  includeInESI: false,
  includeInBonus: false,
  isAttendanceDependent: false,
  showInPayslip: true,
  ledgerCode: '',
  roundingRule: 'Nearest' as PayHead['roundingRule']
};
const typeColor = (type: string) => {
  const map: Record<string, 'success' | 'error' | 'info' | 'secondary'> = {
    Earning: 'success',
    Deduction: 'error',
    'Employer Contribution': 'info',
    Reimbursement: 'secondary'
  };
  return map[type] || 'secondary';
};
export function PayHeadMaster() {
  const [payHeads, setPayHeads] = useState(mockPayHeads);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [form, setForm] = useState(emptyForm);
  const filtered = payHeads.filter((p) => {
    const matchSearch =
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || p.type === typeFilter;
    return matchSearch && matchType;
  });
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setPayHeads((prev) =>
      prev.map((p) =>
      p.id === editId ?
      {
        ...p,
        ...form
      } :
      p
      )
      );
    } else {
      setPayHeads((prev) => [
      ...prev,
      {
        ...form,
        id: `PH${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (ph: PayHead) => {
    setForm({
      code: ph.code,
      name: ph.name,
      type: ph.type,
      category: ph.category,
      calculationType: ph.calculationType,
      calculationValue: ph.calculationValue,
      isTaxable: ph.isTaxable,
      includeInPF: ph.includeInPF,
      includeInESI: ph.includeInESI,
      includeInBonus: ph.includeInBonus,
      isAttendanceDependent: ph.isAttendanceDependent,
      showInPayslip: ph.showInPayslip,
      ledgerCode: ph.ledgerCode,
      roundingRule: ph.roundingRule
    });
    setEditId(ph.id);
    setShowForm(true);
    setActiveTab('list');
  };
  const earningCount = payHeads.filter((p) => p.type === 'Earning').length;
  const deductionCount = payHeads.filter((p) => p.type === 'Deduction').length;
  const employerCount = payHeads.filter(
    (p) => p.type === 'Employer Contribution'
  ).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pay Head Master</h1>
          <p className="text-sm text-gray-500">
            Define all earning and deduction components for payroll
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Pay Head
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{payHeads.length}</p>
            <p className="text-xs text-gray-500">Total Pay Heads</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{earningCount}</p>
            <p className="text-xs text-gray-500">Earnings</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{deductionCount}</p>
            <p className="text-xs text-gray-500">Deductions</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{employerCount}</p>
            <p className="text-xs text-gray-500">Employer Contributions</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Pay Head' : 'Add New Pay Head'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Pay Head Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., BASIC" />

            <Input
            label="Pay Head Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., Basic Salary" />

            <Select
            label="Type *"
            options={[
            {
              value: 'Earning',
              label: 'Earning'
            },
            {
              value: 'Deduction',
              label: 'Deduction'
            },
            {
              value: 'Employer Contribution',
              label: 'Employer Contribution'
            },
            {
              value: 'Reimbursement',
              label: 'Reimbursement'
            }]
            }
            value={form.type}
            onChange={(e) =>
            setForm({
              ...form,
              type: e.target.value as PayHead['type']
            })
            } />

            <Select
            label="Category *"
            options={[
            {
              value: 'Basic',
              label: 'Basic'
            },
            {
              value: 'Allowance',
              label: 'Allowance'
            },
            {
              value: 'Statutory Deduction',
              label: 'Statutory Deduction'
            },
            {
              value: 'Loan',
              label: 'Loan'
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
              category: e.target.value as PayHead['category']
            })
            } />

            <Select
            label="Calculation Type *"
            options={[
            {
              value: 'Flat Amount',
              label: 'Flat Amount'
            },
            {
              value: '% of Pay Head',
              label: '% of Pay Head'
            },
            {
              value: '% of Gross',
              label: '% of Gross'
            },
            {
              value: 'Formula',
              label: 'Formula'
            },
            {
              value: 'Slab-based',
              label: 'Slab-based'
            }]
            }
            value={form.calculationType}
            onChange={(e) =>
            setForm({
              ...form,
              calculationType: e.target.value as PayHead['calculationType']
            })
            } />

            <Input
            label="Calculation Value / Formula"
            value={form.calculationValue}
            onChange={(e) =>
            setForm({
              ...form,
              calculationValue: e.target.value
            })
            }
            placeholder="e.g., 50% of BASIC or 5000" />

            <Select
            label="Rounding Rule"
            options={[
            {
              value: 'No Rounding',
              label: 'No Rounding'
            },
            {
              value: 'Round Up',
              label: 'Round Up'
            },
            {
              value: 'Round Down',
              label: 'Round Down'
            },
            {
              value: 'Nearest',
              label: 'Nearest'
            }]
            }
            value={form.roundingRule}
            onChange={(e) =>
            setForm({
              ...form,
              roundingRule: e.target.value as PayHead['roundingRule']
            })
            } />

            <Input
            label="Account / Ledger Code"
            value={form.ledgerCode}
            onChange={(e) =>
            setForm({
              ...form,
              ledgerCode: e.target.value
            })
            }
            placeholder="e.g., SAL-001" />

            <div className="col-span-2 grid grid-cols-3 gap-3">
              {[
            {
              key: 'isTaxable',
              label: 'Taxable'
            },
            {
              key: 'includeInPF',
              label: 'Include in PF'
            },
            {
              key: 'includeInESI',
              label: 'Include in ESI'
            },
            {
              key: 'includeInBonus',
              label: 'Include in Bonus/Gratuity'
            },
            {
              key: 'isAttendanceDependent',
              label: 'Attendance Dependent (LOP)'
            },
            {
              key: 'showInPayslip',
              label: 'Show in Payslip'
            }].
            map(({ key, label }) =>
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer">

                  <input
                type="checkbox"
                checked={(form as any)[key]}
                onChange={(e) =>
                setForm({
                  ...form,
                  [key]: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded" />

                  <span className="text-sm text-gray-700">{label}</span>
                </label>
            )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Pay Head
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
              label: 'All Types'
            },
            {
              value: 'Earning',
              label: 'Earning'
            },
            {
              value: 'Deduction',
              label: 'Deduction'
            },
            {
              value: 'Employer Contribution',
              label: 'Employer Contribution'
            },
            {
              value: 'Reimbursement',
              label: 'Reimbursement'
            }]
            }
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Pay Head
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Calculation
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Flags
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Rounding
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) =>
              <tr
                key={p.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.code} · {p.ledgerCode}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={typeColor(p.type)}>{p.type}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{p.category}</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-medium text-gray-700">
                      {p.calculationType}
                    </p>
                    {p.calculationValue &&
                  <p className="text-xs text-gray-500">
                        {p.calculationValue}
                      </p>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1 flex-wrap">
                      {p.isTaxable && <Badge variant="warning">Tax</Badge>}
                      {p.includeInPF && <Badge variant="info">PF</Badge>}
                      {p.includeInESI && <Badge variant="info">ESI</Badge>}
                      {p.isAttendanceDependent &&
                    <Badge variant="secondary">LOP</Badge>
                    }
                      {p.showInPayslip &&
                    <Badge variant="success">Payslip</Badge>
                    }
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-600">
                    {p.roundingRule}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(p)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Clone">

                        <Copy className="w-4 h-4 text-gray-500" />
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