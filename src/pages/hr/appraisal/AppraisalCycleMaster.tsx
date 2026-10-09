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
  X,
  Calendar,
  CheckCircle,
  Clock,
  Lock,
  Eye,
  Copy,
  Search } from
'lucide-react';
interface Cycle {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  selfDeadline: string;
  managerDeadline: string;
  calibrationDeadline: string;
  status: 'Draft' | 'Active' | 'Locked' | 'Published';
  templateId: string;
  createdBy: string;
  createdOn: string;
}
const statusBadge = (s: string) => {
  if (s === 'Active') return <Badge variant="success">Active</Badge>;
  if (s === 'Published') return <Badge variant="info">Published</Badge>;
  if (s === 'Locked') return <Badge variant="warning">Locked</Badge>;
  return <Badge variant="secondary">Draft</Badge>;
};
const mockCycles: Cycle[] = [
{
  id: 'CYC001',
  name: 'Annual Review 2024-25',
  academicYear: '2024-25',
  startDate: '2024-10-01',
  endDate: '2025-03-31',
  selfDeadline: '2024-11-30',
  managerDeadline: '2025-01-15',
  calibrationDeadline: '2025-02-28',
  status: 'Active',
  templateId: 'teaching',
  createdBy: 'Admin',
  createdOn: '2024-09-15'
},
{
  id: 'CYC002',
  name: 'Mid-Term Review Oct 2024',
  academicYear: '2024-25',
  startDate: '2024-10-01',
  endDate: '2024-11-30',
  selfDeadline: '2024-10-31',
  managerDeadline: '2024-11-15',
  calibrationDeadline: '2024-11-25',
  status: 'Published',
  templateId: 'teaching',
  createdBy: 'Admin',
  createdOn: '2024-09-01'
},
{
  id: 'CYC003',
  name: 'Probation Review Q4 2024',
  academicYear: '2024-25',
  startDate: '2024-12-01',
  endDate: '2025-01-31',
  selfDeadline: '2024-12-31',
  managerDeadline: '2025-01-15',
  calibrationDeadline: '2025-01-25',
  status: 'Draft',
  templateId: 'admin',
  createdBy: 'HR Head',
  createdOn: '2024-11-20'
},
{
  id: 'CYC004',
  name: 'Annual Review 2023-24',
  academicYear: '2023-24',
  startDate: '2023-10-01',
  endDate: '2024-03-31',
  selfDeadline: '2023-11-30',
  managerDeadline: '2024-01-15',
  calibrationDeadline: '2024-02-28',
  status: 'Published',
  templateId: 'teaching',
  createdBy: 'Admin',
  createdOn: '2023-09-15'
}];

export function AppraisalCycleMaster() {
  const [cycles, setCycles] = useState(mockCycles);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '',
    academicYear: '2024-25',
    startDate: '',
    endDate: '',
    selfDeadline: '',
    managerDeadline: '',
    calibrationDeadline: '',
    templateId: ''
  });
  const filtered = cycles.filter((c) =>
  c.name.toLowerCase().includes(search.toLowerCase())
  );
  const resetForm = () => {
    setForm({
      name: '',
      academicYear: '2024-25',
      startDate: '',
      endDate: '',
      selfDeadline: '',
      managerDeadline: '',
      calibrationDeadline: '',
      templateId: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setCycles((prev) =>
      prev.map((c) =>
      c.id === editId ?
      {
        ...c,
        ...form
      } :
      c
      )
      );
    } else {
      setCycles((prev) => [
      ...prev,
      {
        ...form,
        id: `CYC${Date.now()}`,
        status: 'Draft' as const,
        createdBy: 'Admin',
        createdOn: new Date().toISOString().split('T')[0]
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (cycle: Cycle) => {
    setForm({
      name: cycle.name,
      academicYear: cycle.academicYear,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      selfDeadline: cycle.selfDeadline,
      managerDeadline: cycle.managerDeadline,
      calibrationDeadline: cycle.calibrationDeadline,
      templateId: cycle.templateId
    });
    setEditId(cycle.id);
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setCycles((prev) => prev.filter((c) => c.id !== id));
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Cycle Master
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage appraisal review cycles
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Create New Cycle
        </Button>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Cycle' : 'Create New Cycle'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Cycle Name *"
            value={form.name}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              name: e.target.value
            }))
            }
            placeholder="e.g., Annual Review 2024-25" />

            <Select
            label="Academic Year *"
            options={[
            {
              value: '2024-25',
              label: '2024-25'
            },
            {
              value: '2023-24',
              label: '2023-24'
            }]
            }
            value={form.academicYear}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              academicYear: e.target.value
            }))
            } />

            <Input
            label="Start Date *"
            type="date"
            value={form.startDate}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              startDate: e.target.value
            }))
            } />

            <Input
            label="End Date *"
            type="date"
            value={form.endDate}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              endDate: e.target.value
            }))
            } />

            <Input
            label="Self-Appraisal Deadline"
            type="date"
            value={form.selfDeadline}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              selfDeadline: e.target.value
            }))
            } />

            <Input
            label="Manager Review Deadline"
            type="date"
            value={form.managerDeadline}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              managerDeadline: e.target.value
            }))
            } />

            <Input
            label="Calibration Deadline"
            type="date"
            value={form.calibrationDeadline}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              calibrationDeadline: e.target.value
            }))
            } />

            <Select
            label="Default Template"
            options={[
            {
              value: '',
              label: 'Select...'
            },
            {
              value: 'teaching',
              label: 'Teaching Staff'
            },
            {
              value: 'admin',
              label: 'Admin Staff'
            },
            {
              value: 'support',
              label: 'Support Staff'
            }]
            }
            value={form.templateId}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              templateId: e.target.value
            }))
            } />

          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Cycle
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
              placeholder="Search cycles..."
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
                  Cycle Name
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Year
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Period
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Self Deadline
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Manager Deadline
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
              {filtered.map((c, i) =>
              <tr
                key={c.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {c.id} · Created by {c.createdBy}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {c.academicYear}
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-600">
                    {c.startDate} → {c.endDate}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {c.selfDeadline}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {c.managerDeadline}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {statusBadge(c.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(c)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Duplicate">

                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                      onClick={() => handleDelete(c.id)}
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