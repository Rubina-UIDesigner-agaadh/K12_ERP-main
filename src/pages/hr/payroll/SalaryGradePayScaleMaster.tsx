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
  Layers,
  DollarSign,
  Copy,
  ChevronDown,
  ChevronRight } from
'lucide-react';
interface PayHeadInGrade {
  payHeadCode: string;
  payHeadName: string;
  calculationType: string;
  calculationValue: string;
  isMandatory: boolean;
}
interface SalaryGrade {
  id: string;
  gradeCode: string;
  gradeName: string;
  payScaleNotation: string;
  minimumBasic: number;
  maximumBasic: number;
  incrementStep: number;
  payHeads: PayHeadInGrade[];
  applicableStaffTypes: string[];
  effectiveFrom: string;
  effectiveTo: string;
  status: 'Active' | 'Inactive';
}
const mockGrades: SalaryGrade[] = [
{
  id: 'SG001',
  gradeCode: 'GR-A',
  gradeName: 'Grade A – Senior',
  payScaleNotation: '56,100–1,77,500',
  minimumBasic: 56100,
  maximumBasic: 177500,
  incrementStep: 1800,
  payHeads: [
  {
    payHeadCode: 'BASIC',
    payHeadName: 'Basic Salary',
    calculationType: 'Flat Amount',
    calculationValue: '56100',
    isMandatory: true
  },
  {
    payHeadCode: 'DA',
    payHeadName: 'Dearness Allowance',
    calculationType: '% of Pay Head',
    calculationValue: '50% of BASIC',
    isMandatory: true
  },
  {
    payHeadCode: 'HRA',
    payHeadName: 'HRA',
    calculationType: '% of Pay Head',
    calculationValue: '40% of BASIC',
    isMandatory: true
  }],

  applicableStaffTypes: ['Teaching – Senior', 'HOD'],
  effectiveFrom: '2024-04-01',
  effectiveTo: '2025-03-31',
  status: 'Active'
},
{
  id: 'SG002',
  gradeCode: 'GR-B',
  gradeName: 'Grade B – Regular',
  payScaleNotation: '44,900–1,42,400',
  minimumBasic: 44900,
  maximumBasic: 142400,
  incrementStep: 1500,
  payHeads: [
  {
    payHeadCode: 'BASIC',
    payHeadName: 'Basic Salary',
    calculationType: 'Flat Amount',
    calculationValue: '44900',
    isMandatory: true
  },
  {
    payHeadCode: 'DA',
    payHeadName: 'Dearness Allowance',
    calculationType: '% of Pay Head',
    calculationValue: '50% of BASIC',
    isMandatory: true
  },
  {
    payHeadCode: 'HRA',
    payHeadName: 'HRA',
    calculationType: '% of Pay Head',
    calculationValue: '40% of BASIC',
    isMandatory: true
  }],

  applicableStaffTypes: ['Teaching – Regular', 'Administrative'],
  effectiveFrom: '2024-04-01',
  effectiveTo: '2025-03-31',
  status: 'Active'
},
{
  id: 'SG003',
  gradeCode: 'GR-C',
  gradeName: 'Grade C – Junior',
  payScaleNotation: '35,400–1,12,400',
  minimumBasic: 35400,
  maximumBasic: 112400,
  incrementStep: 1200,
  payHeads: [
  {
    payHeadCode: 'BASIC',
    payHeadName: 'Basic Salary',
    calculationType: 'Flat Amount',
    calculationValue: '35400',
    isMandatory: true
  },
  {
    payHeadCode: 'HRA',
    payHeadName: 'HRA',
    calculationType: '% of Pay Head',
    calculationValue: '30% of BASIC',
    isMandatory: true
  }],

  applicableStaffTypes: ['Non-Teaching', 'Support Staff'],
  effectiveFrom: '2024-04-01',
  effectiveTo: '2025-03-31',
  status: 'Active'
},
{
  id: 'SG004',
  gradeCode: 'GR-D',
  gradeName: 'Grade D – Support',
  payScaleNotation: '18,000–56,900',
  minimumBasic: 18000,
  maximumBasic: 56900,
  incrementStep: 600,
  payHeads: [
  {
    payHeadCode: 'BASIC',
    payHeadName: 'Basic Salary',
    calculationType: 'Flat Amount',
    calculationValue: '18000',
    isMandatory: true
  }],

  applicableStaffTypes: ['Support Staff', 'Contract'],
  effectiveFrom: '2024-04-01',
  effectiveTo: '2025-03-31',
  status: 'Active'
}];

const emptyForm = {
  gradeCode: '',
  gradeName: '',
  payScaleNotation: '',
  minimumBasic: 0,
  maximumBasic: 0,
  incrementStep: 0,
  applicableStaffTypes: [] as string[],
  effectiveFrom: '',
  effectiveTo: ''
};
export function SalaryGradePayScaleMaster() {
  const [grades, setGrades] = useState(mockGrades);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const filtered = grades.filter((g) => {
    const matchSearch =
    g.gradeName.toLowerCase().includes(search.toLowerCase()) ||
    g.gradeCode.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || g.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setGrades((prev) =>
      prev.map((g) =>
      g.id === editId ?
      {
        ...g,
        ...form
      } :
      g
      )
      );
    } else {
      setGrades((prev) => [
      ...prev,
      {
        ...form,
        id: `SG${Date.now()}`,
        payHeads: [],
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (g: SalaryGrade) => {
    setForm({
      gradeCode: g.gradeCode,
      gradeName: g.gradeName,
      payScaleNotation: g.payScaleNotation,
      minimumBasic: g.minimumBasic,
      maximumBasic: g.maximumBasic,
      incrementStep: g.incrementStep,
      applicableStaffTypes: g.applicableStaffTypes,
      effectiveFrom: g.effectiveFrom,
      effectiveTo: g.effectiveTo
    });
    setEditId(g.id);
    setShowForm(true);
  };
  const handleClone = (g: SalaryGrade) => {
    setGrades((prev) => [
    ...prev,
    {
      ...g,
      id: `SG${Date.now()}`,
      gradeCode: `${g.gradeCode}_COPY`,
      gradeName: `${g.gradeName} (Copy)`,
      status: 'Active'
    }]
    );
  };
  const toggleExpand = (id: string) =>
  setExpandedIds((prev) =>
  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
  const activeCount = grades.filter((g) => g.status === 'Active').length;
  const avgMin = Math.round(
    grades.reduce((sum, g) => sum + g.minimumBasic, 0) / grades.length
  );
  const avgMax = Math.round(
    grades.reduce((sum, g) => sum + g.maximumBasic, 0) / grades.length
  );
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Salary Grade / Pay Scale Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure salary structures and grade-wise pay head definitions
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Grade
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{grades.length}</p>
            <p className="text-xs text-gray-500">Total Grades</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{activeCount}</p>
            <p className="text-xs text-gray-500">Active Grades</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">₹{(avgMin / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Avg Min Basic</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">₹{(avgMax / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-500">Avg Max Basic</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Salary Grade' : 'Add New Salary Grade'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Grade Code *"
            value={form.gradeCode}
            onChange={(e) =>
            setForm({
              ...form,
              gradeCode: e.target.value
            })
            }
            placeholder="e.g., GR-A" />

            <Input
            label="Grade Name *"
            value={form.gradeName}
            onChange={(e) =>
            setForm({
              ...form,
              gradeName: e.target.value
            })
            }
            placeholder="e.g., Grade A – Senior" />

            <Input
            label="Pay Scale Notation"
            value={form.payScaleNotation}
            onChange={(e) =>
            setForm({
              ...form,
              payScaleNotation: e.target.value
            })
            }
            placeholder="e.g., 44,900–1,42,400" />

            <Input
            label="Increment Step (₹)"
            type="number"
            value={form.incrementStep}
            onChange={(e) =>
            setForm({
              ...form,
              incrementStep: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Minimum Basic (₹) *"
            type="number"
            value={form.minimumBasic}
            onChange={(e) =>
            setForm({
              ...form,
              minimumBasic: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Maximum Basic (₹) *"
            type="number"
            value={form.maximumBasic}
            onChange={(e) =>
            setForm({
              ...form,
              maximumBasic: parseInt(e.target.value) || 0
            })
            } />

            <Input
            label="Effective From"
            type="date"
            value={form.effectiveFrom}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveFrom: e.target.value
            })
            } />

            <Input
            label="Effective To"
            type="date"
            value={form.effectiveTo}
            onChange={(e) =>
            setForm({
              ...form,
              effectiveTo: e.target.value
            })
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Grade
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
              placeholder="Search grades..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            options={[
            {
              value: '',
              label: 'All Statuses'
            },
            {
              value: 'Active',
              label: 'Active'
            },
            {
              value: 'Inactive',
              label: 'Inactive'
            }]
            }
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)} />

        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 border-b-2 border-gray-200 py-3 px-4 grid grid-cols-12 gap-2">
            <span className="col-span-3 text-xs font-semibold text-gray-600 uppercase">
              Grade
            </span>
            <span className="col-span-2 text-xs font-semibold text-gray-600 uppercase text-center">
              Pay Scale
            </span>
            <span className="col-span-2 text-xs font-semibold text-gray-600 uppercase text-center">
              Basic Range
            </span>
            <span className="col-span-2 text-xs font-semibold text-gray-600 uppercase text-center">
              Staff Types
            </span>
            <span className="col-span-1 text-xs font-semibold text-gray-600 uppercase text-center">
              Status
            </span>
            <span className="col-span-2 text-xs font-semibold text-gray-600 uppercase text-center">
              Actions
            </span>
          </div>
          {filtered.map((g, i) =>
          <div key={g.id}>
              <div
              className={`py-3 px-4 grid grid-cols-12 gap-2 items-center border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                <div className="col-span-3 flex items-center gap-2">
                  <button
                  onClick={() => toggleExpand(g.id)}
                  className="p-1 hover:bg-gray-200 rounded">

                    {expandedIds.includes(g.id) ?
                  <ChevronDown className="w-4 h-4 text-gray-500" /> :

                  <ChevronRight className="w-4 h-4 text-gray-500" />
                  }
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {g.gradeName}
                    </p>
                    <p className="text-xs text-gray-500">{g.gradeCode}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center text-xs text-gray-600">
                  {g.payScaleNotation}
                </div>
                <div className="col-span-2 text-center text-xs text-gray-600">
                  ₹{g.minimumBasic.toLocaleString()} – ₹
                  {g.maximumBasic.toLocaleString()}
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs text-gray-600">
                    {g.applicableStaffTypes.join(', ')}
                  </span>
                </div>
                <div className="col-span-1 text-center">
                  <Badge
                  variant={g.status === 'Active' ? 'success' : 'secondary'}>

                    {g.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center justify-center gap-1">
                  <button
                  onClick={() => handleEdit(g)}
                  className="p-1.5 hover:bg-blue-100 rounded-lg"
                  title="Edit">

                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                  onClick={() => handleClone(g)}
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
              </div>
              {expandedIds.includes(g.id) &&
            <div className="bg-blue-50/40 border-b border-gray-200 px-8 py-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                    Pay Heads in this Grade
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-500">
                        <th className="text-left pb-1">Pay Head</th>
                        <th className="text-left pb-1">Calculation</th>
                        <th className="text-left pb-1">Value</th>
                        <th className="text-center pb-1">Mandatory</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.payHeads.map((ph) =>
                  <tr
                    key={ph.payHeadCode}
                    className="border-t border-blue-100">

                          <td className="py-1 font-medium text-gray-800">
                            {ph.payHeadName}{' '}
                            <span className="text-gray-400 font-normal">
                              ({ph.payHeadCode})
                            </span>
                          </td>
                          <td className="py-1 text-gray-600">
                            {ph.calculationType}
                          </td>
                          <td className="py-1 text-gray-600">
                            {ph.calculationValue}
                          </td>
                          <td className="py-1 text-center">
                            <Badge
                        variant={ph.isMandatory ? 'success' : 'secondary'}>

                              {ph.isMandatory ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
            }
            </div>
          )}
        </div>
      </Card>
    </div>);

}