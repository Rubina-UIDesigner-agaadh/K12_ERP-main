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
  Activity,
  Briefcase,
  ArrowRightLeft,
  DollarSign,
  AlertTriangle,
  Copy } from
'lucide-react';
interface ServiceEventType {
  id: string;
  code: string;
  name: string;
  category:
  'Joining' |
  'Movement' |
  'Pay Change' |
  'Disciplinary' |
  'Service Break' |
  'Other';
  affectsDesignation: boolean;
  affectsDepartment: boolean;
  affectsCampus: boolean;
  affectsPayScale: boolean;
  affectsProbation: boolean;
  affectsSeniority: boolean;
  requiresOrderUpload: boolean;
  generatesEmployeeCode: boolean;
  description: string;
  status: 'Active' | 'Inactive';
}
const mockEvents: ServiceEventType[] = [
{
  id: 'SE001',
  code: 'APPT',
  name: 'Appointment',
  category: 'Joining',
  affectsDesignation: true,
  affectsDepartment: true,
  affectsCampus: true,
  affectsPayScale: true,
  affectsProbation: true,
  affectsSeniority: true,
  requiresOrderUpload: true,
  generatesEmployeeCode: true,
  description: 'Initial appointment of a new employee to the institution',
  status: 'Active'
},
{
  id: 'SE002',
  code: 'CONF',
  name: 'Confirmation',
  category: 'Joining',
  affectsDesignation: false,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: false,
  affectsProbation: true,
  affectsSeniority: true,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description:
  'Confirmation of employee after successful completion of probation period',
  status: 'Active'
},
{
  id: 'SE003',
  code: 'PROMO',
  name: 'Promotion',
  category: 'Movement',
  affectsDesignation: true,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: true,
  affectsProbation: false,
  affectsSeniority: true,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description: 'Promotion of employee to a higher designation or grade',
  status: 'Active'
},
{
  id: 'SE004',
  code: 'TRNFR',
  name: 'Transfer',
  category: 'Movement',
  affectsDesignation: false,
  affectsDepartment: true,
  affectsCampus: true,
  affectsPayScale: false,
  affectsProbation: false,
  affectsSeniority: false,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description:
  'Transfer of employee to a different department, campus or location',
  status: 'Active'
},
{
  id: 'SE005',
  code: 'INCR',
  name: 'Increment',
  category: 'Pay Change',
  affectsDesignation: false,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: true,
  affectsProbation: false,
  affectsSeniority: false,
  requiresOrderUpload: false,
  generatesEmployeeCode: false,
  description: 'Annual or special increment in basic pay',
  status: 'Active'
},
{
  id: 'SE006',
  code: 'DECR',
  name: 'Decrement',
  category: 'Pay Change',
  affectsDesignation: false,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: true,
  affectsProbation: false,
  affectsSeniority: false,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description: 'Reduction in pay as a disciplinary measure',
  status: 'Active'
},
{
  id: 'SE007',
  code: 'SUSP',
  name: 'Suspension',
  category: 'Disciplinary',
  affectsDesignation: false,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: false,
  affectsProbation: false,
  affectsSeniority: true,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description:
  'Temporary suspension of employee pending inquiry or as disciplinary action',
  status: 'Active'
},
{
  id: 'SE008',
  code: 'REINST',
  name: 'Reinstatement',
  category: 'Disciplinary',
  affectsDesignation: true,
  affectsDepartment: true,
  affectsCampus: false,
  affectsPayScale: true,
  affectsProbation: false,
  affectsSeniority: true,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description:
  'Reinstatement of employee after suspension or disciplinary proceedings',
  status: 'Active'
},
{
  id: 'SE009',
  code: 'LWP',
  name: 'Leave Without Pay',
  category: 'Service Break',
  affectsDesignation: false,
  affectsDepartment: false,
  affectsCampus: false,
  affectsPayScale: false,
  affectsProbation: false,
  affectsSeniority: true,
  requiresOrderUpload: false,
  generatesEmployeeCode: false,
  description: 'Extended leave without pay affecting service continuity',
  status: 'Active'
},
{
  id: 'SE010',
  code: 'DEPUTE',
  name: 'Deputation',
  category: 'Movement',
  affectsDesignation: false,
  affectsDepartment: true,
  affectsCampus: true,
  affectsPayScale: false,
  affectsProbation: false,
  affectsSeniority: false,
  requiresOrderUpload: true,
  generatesEmployeeCode: false,
  description:
  'Temporary assignment of employee to another department or institution',
  status: 'Active'
}];

const categoryIcon = (category: string) => {
  switch (category) {
    case 'Joining':
      return <Briefcase className="w-4 h-4 text-green-500" />;
    case 'Movement':
      return <ArrowRightLeft className="w-4 h-4 text-blue-500" />;
    case 'Pay Change':
      return <DollarSign className="w-4 h-4 text-amber-500" />;
    case 'Disciplinary':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'Service Break':
      return <Activity className="w-4 h-4 text-purple-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-500" />;
  }
};
const categoryBadgeVariant = (
category: string)
: 'success' | 'info' | 'warning' | 'secondary' => {
  switch (category) {
    case 'Joining':
      return 'success';
    case 'Movement':
      return 'info';
    case 'Pay Change':
      return 'warning';
    case 'Disciplinary':
      return 'warning';
    case 'Service Break':
      return 'secondary';
    default:
      return 'secondary';
  }
};
interface AffectsBadgesProps {
  event: ServiceEventType;
}
function AffectsBadges({ event }: AffectsBadgesProps) {
  const affects: string[] = [];
  if (event.affectsDesignation) affects.push('Designation');
  if (event.affectsDepartment) affects.push('Department');
  if (event.affectsCampus) affects.push('Campus');
  if (event.affectsPayScale) affects.push('Pay Scale');
  if (event.affectsProbation) affects.push('Probation');
  if (event.affectsSeniority) affects.push('Seniority');
  if (affects.length === 0)
  return <span className="text-xs text-gray-400">None</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {affects.map((a) =>
      <span
        key={a}
        className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-600 border border-blue-100">

          {a}
        </span>
      )}
    </div>);

}
export function ServiceEventTypeMaster() {
  const [events, setEvents] = useState(mockEvents);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Joining' as ServiceEventType['category'],
    affectsDesignation: false,
    affectsDepartment: false,
    affectsCampus: false,
    affectsPayScale: false,
    affectsProbation: false,
    affectsSeniority: false,
    requiresOrderUpload: false,
    generatesEmployeeCode: false,
    description: ''
  });
  const filtered = events.filter((e) => {
    const matchSearch =
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      category: 'Joining',
      affectsDesignation: false,
      affectsDepartment: false,
      affectsCampus: false,
      affectsPayScale: false,
      affectsProbation: false,
      affectsSeniority: false,
      requiresOrderUpload: false,
      generatesEmployeeCode: false,
      description: ''
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setEvents((prev) =>
      prev.map((e) =>
      e.id === editId ?
      {
        ...e,
        ...form
      } :
      e
      )
      );
    } else {
      setEvents((prev) => [
      ...prev,
      {
        ...form,
        id: `SE${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (event: ServiceEventType) => {
    setForm({
      code: event.code,
      name: event.name,
      category: event.category,
      affectsDesignation: event.affectsDesignation,
      affectsDepartment: event.affectsDepartment,
      affectsCampus: event.affectsCampus,
      affectsPayScale: event.affectsPayScale,
      affectsProbation: event.affectsProbation,
      affectsSeniority: event.affectsSeniority,
      requiresOrderUpload: event.requiresOrderUpload,
      generatesEmployeeCode: event.generatesEmployeeCode,
      description: event.description
    });
    setEditId(event.id);
    setShowForm(true);
  };
  const handleClone = (event: ServiceEventType) => {
    setForm({
      code: `${event.code}_COPY`,
      name: `${event.name} (Copy)`,
      category: event.category,
      affectsDesignation: event.affectsDesignation,
      affectsDepartment: event.affectsDepartment,
      affectsCampus: event.affectsCampus,
      affectsPayScale: event.affectsPayScale,
      affectsProbation: event.affectsProbation,
      affectsSeniority: event.affectsSeniority,
      requiresOrderUpload: event.requiresOrderUpload,
      generatesEmployeeCode: event.generatesEmployeeCode,
      description: event.description
    });
    setShowForm(true);
  };
  const handleToggleStatus = (id: string) => {
    setEvents((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      status: e.status === 'Active' ? 'Inactive' : 'Active'
    } :
    e
    )
    );
  };
  const joiningCount = events.filter((e) => e.category === 'Joining').length;
  const movementCount = events.filter((e) => e.category === 'Movement').length;
  const payChangeCount = events.filter(
    (e) => e.category === 'Pay Change'
  ).length;
  const activeCount = events.filter((e) => e.status === 'Active').length;
  const CheckboxField = ({
    label,
    checked,
    onChange




  }: {label: string;checked: boolean;onChange: (v: boolean) => void;}) =>
  <label className="flex items-center gap-2 cursor-pointer">
      <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

      <span className="text-sm text-gray-700">{label}</span>
    </label>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Service Event Type Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure types of service events over the employee lifecycle
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Event Type
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{events.length}</p>
            <p className="text-xs text-gray-500">Total Event Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{joiningCount}</p>
            <p className="text-xs text-gray-500">Joining Events</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{movementCount}</p>
            <p className="text-xs text-gray-500">Movement Events</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{payChangeCount}</p>
            <p className="text-xs text-gray-500">Pay Change Events</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm &&
      <Card
        title={
        editId ? 'Edit Service Event Type' : 'Add New Service Event Type'
        }>

          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <Input
              label="Event Code *"
              value={form.code}
              onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value
              })
              }
              placeholder="e.g., PROMO" />

              <Input
              label="Event Name *"
              value={form.name}
              onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value
              })
              }
              placeholder="e.g., Promotion" />

              <Select
              label="Event Category *"
              options={[
              {
                value: 'Joining',
                label: 'Joining'
              },
              {
                value: 'Movement',
                label: 'Movement'
              },
              {
                value: 'Pay Change',
                label: 'Pay Change'
              },
              {
                value: 'Disciplinary',
                label: 'Disciplinary'
              },
              {
                value: 'Service Break',
                label: 'Service Break'
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
                category: e.target.value as ServiceEventType['category']
              })
              } />

              <div />
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
                placeholder="Brief description of this service event type..."
                rows={2} />

              </div>
            </div>

            {/* Affects Section */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                This Event Affects
              </p>
              <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <CheckboxField
                label="Designation"
                checked={form.affectsDesignation}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsDesignation: v
                })
                } />

                <CheckboxField
                label="Department"
                checked={form.affectsDepartment}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsDepartment: v
                })
                } />

                <CheckboxField
                label="Campus / Location"
                checked={form.affectsCampus}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsCampus: v
                })
                } />

                <CheckboxField
                label="Pay Scale / Salary Structure"
                checked={form.affectsPayScale}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsPayScale: v
                })
                } />

                <CheckboxField
                label="Probation / Confirmation Status"
                checked={form.affectsProbation}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsProbation: v
                })
                } />

                <CheckboxField
                label="Seniority / Service Date"
                checked={form.affectsSeniority}
                onChange={(v) =>
                setForm({
                  ...form,
                  affectsSeniority: v
                })
                } />

              </div>
            </div>

            {/* Additional Flags */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Additional Flags
              </p>
              <div className="grid grid-cols-2 gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <CheckboxField
                label="Requires Order / Letter Upload"
                checked={form.requiresOrderUpload}
                onChange={(v) =>
                setForm({
                  ...form,
                  requiresOrderUpload: v
                })
                } />

                <CheckboxField
                label="Generates Employee Code (Appointment only)"
                checked={form.generatesEmployeeCode}
                onChange={(v) =>
                setForm({
                  ...form,
                  generatesEmployeeCode: v
                })
                } />

              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Event Type
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      {/* List */}
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search event types..."
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
              value: 'Joining',
              label: 'Joining'
            },
            {
              value: 'Movement',
              label: 'Movement'
            },
            {
              value: 'Pay Change',
              label: 'Pay Change'
            },
            {
              value: 'Disciplinary',
              label: 'Disciplinary'
            },
            {
              value: 'Service Break',
              label: 'Service Break'
            },
            {
              value: 'Other',
              label: 'Other'
            }]
            }
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)} />

          <Select
            options={[
            {
              value: '',
              label: 'All Status'
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Event
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Affects
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Order Req.
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Gen. Emp. Code
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
              {filtered.map((event, i) =>
              <tr
                key={event.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {categoryIcon(event.category)}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {event.name}
                        </p>
                        <p className="text-xs text-gray-500">{event.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={categoryBadgeVariant(event.category)}>
                      {event.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <AffectsBadges event={event} />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    event.requiresOrderUpload ? 'warning' : 'secondary'
                    }>

                      {event.requiresOrderUpload ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    event.generatesEmployeeCode ? 'success' : 'secondary'
                    }>

                      {event.generatesEmployeeCode ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                    onClick={() => handleToggleStatus(event.id)}
                    className="focus:outline-none"
                    title="Toggle status">

                      <Badge
                      variant={
                      event.status === 'Active' ? 'success' : 'secondary'
                      }>

                        {event.status}
                      </Badge>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(event)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleClone(event)}
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
          {filtered.length === 0 &&
          <div className="text-center py-12 text-gray-400">
              <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                No event types found matching your search
              </p>
            </div>
          }
        </div>
      </Card>
    </div>);

}