import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { MultiSelect } from '../../../components/ui/MultiSelect';
import { Table } from '../../../components/ui/Table';
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  BookOpen,
  Lock,
  Unlock,
  Eye,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Clock } from
'lucide-react';
interface AssessmentCycle {
  id: string;
  academicYear: string;
  class: string;
  assessmentType: string;
  startDate: string;
  endDate: string;
  status: 'Draft' | 'Published' | 'Locked';
  createdAt: string;
}
const BRANCH_OPTIONS = [
{
  value: 'main',
  label: 'Main Campus'
},
{
  value: 'west',
  label: 'West Branch'
},
{
  value: 'east',
  label: 'East Branch'
},
{
  value: 'north',
  label: 'North Branch'
}];

export function PreschoolExamMaster() {
  const [cycles, setCycles] = useState<AssessmentCycle[]>([
  {
    id: '1',
    academicYear: '2024-25',
    class: 'Nursery',
    assessmentType: 'Term 1 Observation',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    status: 'Published',
    createdAt: '2024-03-15'
  },
  {
    id: '2',
    academicYear: '2024-25',
    class: 'Jr KG',
    assessmentType: 'Term 2 Observation',
    startDate: '2024-10-01',
    endDate: '2025-03-31',
    status: 'Draft',
    createdAt: '2024-09-20'
  }]
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCycle, setEditingCycle] = useState<AssessmentCycle | null>(null);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    academicYear: '2024-25',
    class: 'Nursery',
    assessmentType: 'Term 1 Observation',
    startDate: '',
    endDate: '',
    status: 'Draft' as const
  });
  const handleCreate = () => {
    setEditingCycle(null);
    setFormData({
      academicYear: '2024-25',
      class: 'Nursery',
      assessmentType: 'Term 1 Observation',
      startDate: '',
      endDate: '',
      status: 'Draft'
    });
    setShowModal(true);
  };
  const handleEdit = (cycle: AssessmentCycle) => {
    setEditingCycle(cycle);
    setFormData({
      academicYear: cycle.academicYear,
      class: cycle.class,
      assessmentType: cycle.assessmentType,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      status: cycle.status
    });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editingCycle) {
      setCycles(
        cycles.map((c) =>
        c.id === editingCycle.id ?
        {
          ...c,
          ...formData
        } :
        c
        )
      );
    } else {
      const newCycle: AssessmentCycle = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCycles([...cycles, newCycle]);
    }
    setShowModal(false);
  };
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assessment cycle?')) {
      setCycles(cycles.filter((c) => c.id !== id));
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-700';
      case 'Locked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Published':
        return <CheckCircle className="w-3 h-3" />;
      case 'Locked':
        return <Lock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Preschool Assessment Cycles
          </h1>
          <p className="text-sm text-gray-500">
            Define observation periods for skill-based assessment (No marks or
            passing criteria)
          </p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assessment Cycle
        </Button>
      </div>

      {/* Branch Filter */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MultiSelect
            label="School Branch"
            options={BRANCH_OPTIONS}
            value={selectedBranches}
            onChange={setSelectedBranches}
            placeholder="All Branches" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option>2024-25</option>
              <option>2023-24</option>
              <option>2025-26</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">All Classes</option>
              <option>Nursery</option>
              <option>Jr KG</option>
              <option>Sr KG</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">
              Skill-Based Assessment
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Preschool assessments focus on developmental milestones and
              skills. No numerical marks or pass/fail criteria are used. Each
              cycle links to the Skill Master for evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Cycles Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Academic Year
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Class
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Assessment Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Period
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cycles.map((cycle) =>
              <tr key={cycle.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">
                    {cycle.academicYear}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className="bg-purple-100 text-purple-700">
                      {cycle.class}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {cycle.assessmentType}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(cycle.startDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                      </span>
                      <span>-</span>
                      <span>
                        {new Date(cycle.endDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                    className={`${getStatusColor(cycle.status)} flex items-center gap-1 w-fit`}>

                      {getStatusIcon(cycle.status)}
                      {cycle.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cycle)}>

                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cycle.id)}>

                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCycle ?
                'Edit Assessment Cycle' :
                'Create Assessment Cycle'}
                </h2>
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Academic Year"
                value={formData.academicYear}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  academicYear: e.target.value
                })
                }
                options={[
                {
                  value: '2023-24',
                  label: '2023-24'
                },
                {
                  value: '2024-25',
                  label: '2024-25'
                },
                {
                  value: '2025-26',
                  label: '2025-26'
                }]
                } />


                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Class *
                  </label>
                  <div className="flex gap-3">
                    {['Nursery', 'Jr KG', 'Sr KG'].map((cls) =>
                  <button
                    key={cls}
                    onClick={() =>
                    setFormData({
                      ...formData,
                      class: cls
                    })
                    }
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${formData.class === cls ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>

                        {cls}
                      </button>
                  )}
                  </div>
                </div>
              </div>

              <Select
              label="Assessment Type"
              value={formData.assessmentType}
              onChange={(e) =>
              setFormData({
                ...formData,
                assessmentType: e.target.value
              })
              }
              options={[
              {
                value: 'Term 1 Observation',
                label: 'Term 1 Observation'
              },
              {
                value: 'Term 2 Observation',
                label: 'Term 2 Observation'
              },
              {
                value: 'Monthly Review',
                label: 'Monthly Review'
              },
              {
                value: 'Quarterly Development Check',
                label: 'Quarterly Development Check'
              }]
              } />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Start Date"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  startDate: e.target.value
                })
                } />


                <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  endDate: e.target.value
                })
                } />

              </div>

              <Select
              label="Status"
              value={formData.status}
              onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as any
              })
              }
              options={[
              {
                value: 'Draft',
                label: 'Draft'
              },
              {
                value: 'Published',
                label: 'Published'
              },
              {
                value: 'Locked',
                label: 'Locked'
              }]
              } />


              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This assessment cycle will be linked to
                  skills defined in the Skill Master. No marks or passing
                  criteria are required for preschool assessments.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {editingCycle ? 'Save Changes' : 'Create Cycle'}
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}
export default PreschoolExamMaster;