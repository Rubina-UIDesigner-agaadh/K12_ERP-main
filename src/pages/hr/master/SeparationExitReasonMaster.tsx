import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Search,
  UserX,
  TrendingDown } from
'lucide-react';
interface ExitReason {
  id: string;
  code: string;
  name: string;
  category: string;
  eligibleForRehire: boolean;
  defaultNoticePeriod: number;
  impactsGratuity: boolean;
  impactsPF: boolean;
  description: string;
  status: 'Active' | 'Inactive';
}
const mockReasons: ExitReason[] = [
{
  id: 'ER001',
  code: 'RESIGN',
  name: 'Resignation',
  category: 'Voluntary',
  eligibleForRehire: true,
  defaultNoticePeriod: 30,
  impactsGratuity: false,
  impactsPF: false,
  description: 'Employee voluntarily resigns from the position',
  status: 'Active'
},
{
  id: 'ER002',
  code: 'RETIRE',
  name: 'Retirement',
  category: 'Retirement',
  eligibleForRehire: false,
  defaultNoticePeriod: 60,
  impactsGratuity: false,
  impactsPF: false,
  description: 'Employee retires upon reaching retirement age',
  status: 'Active'
},
{
  id: 'ER003',
  code: 'TERM',
  name: 'Termination',
  category: 'Involuntary',
  eligibleForRehire: false,
  defaultNoticePeriod: 0,
  impactsGratuity: true,
  impactsPF: false,
  description: 'Employment terminated by the institution',
  status: 'Active'
},
{
  id: 'ER004',
  code: 'ABSCOND',
  name: 'Absconding',
  category: 'Involuntary',
  eligibleForRehire: false,
  defaultNoticePeriod: 0,
  impactsGratuity: true,
  impactsPF: true,
  description: 'Employee left without notice or information',
  status: 'Active'
},
{
  id: 'ER005',
  code: 'CONTRACT',
  name: 'End of Contract',
  category: 'Other',
  eligibleForRehire: true,
  defaultNoticePeriod: 0,
  impactsGratuity: false,
  impactsPF: false,
  description: 'Contract period completed',
  status: 'Active'
},
{
  id: 'ER006',
  code: 'DEATH',
  name: 'Death',
  category: 'Death',
  eligibleForRehire: false,
  defaultNoticePeriod: 0,
  impactsGratuity: false,
  impactsPF: false,
  description: 'Employee deceased',
  status: 'Active'
},
{
  id: 'ER007',
  code: 'MUTUAL',
  name: 'Mutual Separation',
  category: 'Voluntary',
  eligibleForRehire: true,
  defaultNoticePeriod: 15,
  impactsGratuity: false,
  impactsPF: false,
  description: 'Separation by mutual agreement',
  status: 'Active'
}];

export function SeparationExitReasonMaster() {
  const [reasons, setReasons] = useState(mockReasons);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Voluntary',
    eligibleForRehire: false,
    defaultNoticePeriod: 0,
    impactsGratuity: false,
    impactsPF: false,
    description: ''
  });
  const filtered = reasons.filter((r) => {
    const matchSearch =
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || r.category === categoryFilter;
    return matchSearch && matchCategory;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      category: 'Voluntary',
      eligibleForRehire: false,
      defaultNoticePeriod: 0,
      impactsGratuity: false,
      impactsPF: false,
      description: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setReasons((prev) =>
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
      setReasons((prev) => [
      ...prev,
      {
        ...form,
        id: `ER${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (reason: ExitReason) => {
    setForm({
      code: reason.code,
      name: reason.name,
      category: reason.category,
      eligibleForRehire: reason.eligibleForRehire,
      defaultNoticePeriod: reason.defaultNoticePeriod,
      impactsGratuity: reason.impactsGratuity,
      impactsPF: reason.impactsPF,
      description: reason.description
    });
    setEditId(reason.id);
    setShowForm(true);
  };
  const voluntaryCount = reasons.filter(
    (r) => r.category === 'Voluntary'
  ).length;
  const involuntaryCount = reasons.filter(
    (r) => r.category === 'Involuntary'
  ).length;
  const rehireCount = reasons.filter((r) => r.eligibleForRehire).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Separation / Exit Reason Master
          </h1>
          <p className="text-sm text-gray-500">
            Standardize reasons for employee exit and separation
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Exit Reason
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <UserX className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{reasons.length}</p>
            <p className="text-xs text-gray-500">Total Reasons</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{voluntaryCount}</p>
            <p className="text-xs text-gray-500">Voluntary</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <UserX className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{involuntaryCount}</p>
            <p className="text-xs text-gray-500">Involuntary</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <UserX className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{rehireCount}</p>
            <p className="text-xs text-gray-500">Rehire Eligible</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Exit Reason' : 'Add New Exit Reason'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Reason Code *"
            value={form.code}
            onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value
            })
            }
            placeholder="e.g., RESIGN" />

            <Input
            label="Reason Name *"
            value={form.name}
            onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
            }
            placeholder="e.g., Resignation" />

            <Select
            label="Category *"
            options={[
            {
              value: 'Voluntary',
              label: 'Voluntary'
            },
            {
              value: 'Involuntary',
              label: 'Involuntary'
            },
            {
              value: 'Retirement',
              label: 'Retirement'
            },
            {
              value: 'Death',
              label: 'Death'
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
              category: e.target.value
            })
            } />

            <Input
            label="Default Notice Period (days)"
            type="number"
            value={form.defaultNoticePeriod}
            onChange={(e) =>
            setForm({
              ...form,
              defaultNoticePeriod: parseInt(e.target.value) || 0
            })
            } />

            <div className="col-span-2">
              <Textarea
              label="Description"
              value={form.description}
              onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
              }
              placeholder="Brief description of this exit reason"
              rows={3} />

            </div>
            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.eligibleForRehire}
                onChange={(e) =>
                setForm({
                  ...form,
                  eligibleForRehire: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Eligible for Rehire
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.impactsGratuity}
                onChange={(e) =>
                setForm({
                  ...form,
                  impactsGratuity: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Impacts Gratuity Settlement
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={form.impactsPF}
                onChange={(e) =>
                setForm({
                  ...form,
                  impactsPF: e.target.checked
                })
                }
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                <span className="text-sm text-gray-700">
                  Impacts PF Settlement
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Exit Reason
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
              placeholder="Search exit reasons..."
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
              value: 'Voluntary',
              label: 'Voluntary'
            },
            {
              value: 'Involuntary',
              label: 'Involuntary'
            },
            {
              value: 'Retirement',
              label: 'Retirement'
            },
            {
              value: 'Death',
              label: 'Death'
            },
            {
              value: 'Other',
              label: 'Other'
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
                  Reason
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Notice Period
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Rehire
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Gratuity
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  PF
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
              {filtered.map((reason, i) =>
              <tr
                key={reason.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <UserX className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {reason.name}
                        </p>
                        <p className="text-xs text-gray-500">{reason.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    reason.category === 'Voluntary' ?
                    'info' :
                    reason.category === 'Involuntary' ?
                    'warning' :
                    'secondary'
                    }>

                      {reason.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {reason.defaultNoticePeriod > 0 ?
                  `${reason.defaultNoticePeriod}d` :
                  '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    reason.eligibleForRehire ? 'success' : 'secondary'
                    }>

                      {reason.eligibleForRehire ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={reason.impactsGratuity ? 'warning' : 'success'}>

                      {reason.impactsGratuity ? 'Impacted' : 'Normal'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={reason.impactsPF ? 'warning' : 'success'}>
                      {reason.impactsPF ? 'Impacted' : 'Normal'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    reason.status === 'Active' ? 'success' : 'secondary'
                    }>

                      {reason.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(reason)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
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