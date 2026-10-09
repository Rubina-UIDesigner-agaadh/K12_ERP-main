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
  Search,
  Plane,
  MapPin,
  DollarSign,
  FileText } from
'lucide-react';
interface ODType {
  id: string;
  code: string;
  name: string;
  category: 'On-Campus' | 'Local Travel' | 'Outstation' | 'International';
  paid: boolean;
  leaveType?: string;
  requiresApproval: boolean;
  maxDays?: number;
  requiresDocuments: boolean;
  status: 'Active' | 'Inactive';
}
const mockODTypes: ODType[] = [
{
  id: 'OD001',
  code: 'WS',
  name: 'Workshop / Training',
  category: 'Outstation',
  paid: true,
  requiresApproval: true,
  maxDays: 5,
  requiresDocuments: true,
  status: 'Active'
},
{
  id: 'OD002',
  code: 'OV',
  name: 'Official Visit',
  category: 'Local Travel',
  paid: true,
  requiresApproval: true,
  maxDays: 1,
  requiresDocuments: false,
  status: 'Active'
},
{
  id: 'OD003',
  code: 'ED',
  name: 'Exam Duty',
  category: 'On-Campus',
  paid: true,
  requiresApproval: false,
  requiresDocuments: false,
  status: 'Active'
},
{
  id: 'OD004',
  code: 'INV',
  name: 'Invigilation',
  category: 'On-Campus',
  paid: true,
  requiresApproval: false,
  requiresDocuments: false,
  status: 'Active'
},
{
  id: 'OD005',
  code: 'CONF',
  name: 'Conference / Seminar',
  category: 'Outstation',
  paid: true,
  leaveType: 'Special Leave',
  requiresApproval: true,
  maxDays: 7,
  requiresDocuments: true,
  status: 'Active'
},
{
  id: 'OD006',
  code: 'INTL',
  name: 'International Conference',
  category: 'International',
  paid: true,
  requiresApproval: true,
  maxDays: 10,
  requiresDocuments: true,
  status: 'Active'
},
{
  id: 'OD007',
  code: 'FV',
  name: 'Field Visit',
  category: 'Local Travel',
  paid: true,
  requiresApproval: true,
  maxDays: 1,
  requiresDocuments: false,
  status: 'Active'
},
{
  id: 'OD008',
  code: 'PER',
  name: 'Personal Work',
  category: 'Local Travel',
  paid: false,
  leaveType: 'Casual Leave',
  requiresApproval: true,
  maxDays: 1,
  requiresDocuments: false,
  status: 'Inactive'
}];

const categoryColor = (cat: string) => {
  if (cat === 'On-Campus') return 'bg-blue-100 text-blue-700';
  if (cat === 'Local Travel') return 'bg-green-100 text-green-700';
  if (cat === 'Outstation') return 'bg-amber-100 text-amber-700';
  return 'bg-purple-100 text-purple-700';
};
export function OnDutyTravelTypeMaster() {
  const [types, setTypes] = useState(mockODTypes);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'On-Campus' as ODType['category'],
    paid: true,
    leaveType: '',
    requiresApproval: true,
    maxDays: '',
    requiresDocuments: false
  });
  const filtered = types.filter((t) => {
    const matchSearch =
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || t.category === categoryFilter;
    const matchPaid =
    !paidFilter ||
    paidFilter === 'paid' && t.paid ||
    paidFilter === 'unpaid' && !t.paid;
    return matchSearch && matchCategory && matchPaid;
  });
  const paidCount = types.filter((t) => t.paid).length;
  const approvalCount = types.filter((t) => t.requiresApproval).length;
  const avgMaxDays =
  types.filter((t) => t.maxDays).reduce((s, t) => s + (t.maxDays || 0), 0) /
  types.filter((t) => t.maxDays).length || 0;
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      category: 'On-Campus',
      paid: true,
      leaveType: '',
      requiresApproval: true,
      maxDays: '',
      requiresDocuments: false
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setTypes((prev) =>
      prev.map((t) =>
      t.id === editId ?
      {
        ...t,
        ...form,
        maxDays: form.maxDays ? parseInt(form.maxDays) : undefined
      } :
      t
      )
      );
    } else {
      setTypes((prev) => [
      ...prev,
      {
        ...form,
        id: `OD${Date.now()}`,
        maxDays: form.maxDays ? parseInt(form.maxDays) : undefined,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (type: ODType) => {
    setForm({
      code: type.code,
      name: type.name,
      category: type.category,
      paid: type.paid,
      leaveType: type.leaveType || '',
      requiresApproval: type.requiresApproval,
      maxDays: type.maxDays?.toString() || '',
      requiresDocuments: type.requiresDocuments
    });
    setEditId(type.id);
    setShowForm(true);
  };
  const handleDelete = (id: string) =>
  setTypes((prev) => prev.filter((t) => t.id !== id));
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            On-Duty / Travel Type Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure types of on-duty and official travel
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add OD Type
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{types.length}</p>
            <p className="text-xs text-gray-500">Total OD Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{paidCount}</p>
            <p className="text-xs text-gray-500">Paid Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{approvalCount}</p>
            <p className="text-xs text-gray-500">Approval Required</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{avgMaxDays.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Avg Max Days</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit OD Type' : 'Add New OD Type'}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
            label="Type Code *"
            value={form.code}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              code: e.target.value
            }))
            }
            placeholder="e.g., WS" />

            <Input
            label="Type Name *"
            value={form.name}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              name: e.target.value
            }))
            }
            placeholder="e.g., Workshop / Training" />

            <Select
            label="Category *"
            options={[
            {
              value: 'On-Campus',
              label: 'On-Campus'
            },
            {
              value: 'Local Travel',
              label: 'Local Travel'
            },
            {
              value: 'Outstation',
              label: 'Outstation'
            },
            {
              value: 'International',
              label: 'International'
            }]
            }
            value={form.category}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              category: e.target.value as ODType['category']
            }))
            } />

            <Select
            label="Paid / Unpaid *"
            options={[
            {
              value: 'paid',
              label: 'Paid'
            },
            {
              value: 'unpaid',
              label: 'Unpaid'
            }]
            }
            value={form.paid ? 'paid' : 'unpaid'}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              paid: e.target.value === 'paid'
            }))
            } />

            <Select
            label="Link to Leave Type"
            options={[
            {
              value: '',
              label: 'None'
            },
            {
              value: 'Casual Leave',
              label: 'Casual Leave'
            },
            {
              value: 'Special Leave',
              label: 'Special Leave'
            }]
            }
            value={form.leaveType}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              leaveType: e.target.value
            }))
            } />

            <Input
            label="Max Days per Request"
            type="number"
            value={form.maxDays}
            onChange={(e) =>
            setForm((p) => ({
              ...p,
              maxDays: e.target.value
            }))
            }
            placeholder="Optional" />

            <div className="col-span-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={form.requiresApproval}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  requiresApproval: e.target.checked
                }))
                }
                className="rounded border-gray-300" />

                <span className="text-sm text-gray-700">
                  Requires Prior Approval
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={form.requiresDocuments}
                onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  requiresDocuments: e.target.checked
                }))
                }
                className="rounded border-gray-300" />

                <span className="text-sm text-gray-700">
                  Requires Supporting Documents
                </span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSave}>
              {editId ? 'Update' : 'Create'} OD Type
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
              placeholder="Search OD types..."
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
              value: 'On-Campus',
              label: 'On-Campus'
            },
            {
              value: 'Local Travel',
              label: 'Local Travel'
            },
            {
              value: 'Outstation',
              label: 'Outstation'
            },
            {
              value: 'International',
              label: 'International'
            }]
            }
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)} />

          <Select
            options={[
            {
              value: '',
              label: 'All Types'
            },
            {
              value: 'paid',
              label: 'Paid Only'
            },
            {
              value: 'unpaid',
              label: 'Unpaid Only'
            }]
            }
            value={paidFilter}
            onChange={(e) => setPaidFilter(e.target.value)} />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Code
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Name
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Paid/Unpaid
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Max Days
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Approval
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Documents
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
              {filtered.map((type, i) =>
              <tr
                key={type.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    {type.code}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-gray-900">
                      {type.name}
                    </p>
                    {type.leaveType &&
                  <p className="text-xs text-gray-500">
                        Linked: {type.leaveType}
                      </p>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor(type.category)}`}>

                      {type.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {type.paid ?
                  <Badge variant="success">Paid</Badge> :

                  <Badge variant="secondary">Unpaid</Badge>
                  }
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {type.maxDays || '—'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {type.requiresApproval ?
                  <Badge variant="warning">Required</Badge> :

                  <Badge variant="secondary">Not Required</Badge>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    {type.requiresDocuments ?
                  <Badge variant="info">Required</Badge> :

                  <Badge variant="secondary">Not Required</Badge>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    {type.status === 'Active' ?
                  <Badge variant="success">Active</Badge> :

                  <Badge variant="secondary">Inactive</Badge>
                  }
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(type)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleDelete(type.id)}
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