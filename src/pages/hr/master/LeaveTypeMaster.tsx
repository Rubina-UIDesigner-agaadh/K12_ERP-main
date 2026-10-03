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
  Calendar,
  Copy,
  ChevronDown,
  ChevronRight } from
'lucide-react';
interface LeaveType {
  id: string;
  code: string;
  name: string;
  category: string;
  applicableStaffTypes: string[];
  eligibilityMonths: number;
  creditFrequency: string;
  creditQuota: number;
  prorateOnJoining: boolean;
  carryForwardAllowed: boolean;
  maxCarryForward: number;
  encashmentAllowed: boolean;
  maxEncashable: number;
  halfDayAllowed: boolean;
  minDuration: number;
  maxDuration: number;
  requiresDocument: boolean;
  canBeClubbed: string[];
  lopWhenNegative: boolean;
  isPaid: boolean;
  status: 'Active' | 'Inactive';
}
const mockLeaveTypes: LeaveType[] = [
{
  id: 'LT001',
  code: 'CL',
  name: 'Casual Leave',
  category: 'Casual',
  applicableStaffTypes: ['Teaching', 'Administrative', 'Support'],
  eligibilityMonths: 0,
  creditFrequency: 'Monthly',
  creditQuota: 12,
  prorateOnJoining: true,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: true,
  minDuration: 0.5,
  maxDuration: 3,
  requiresDocument: false,
  canBeClubbed: ['EL'],
  lopWhenNegative: true,
  isPaid: true,
  status: 'Active'
},
{
  id: 'LT002',
  code: 'EL',
  name: 'Earned Leave',
  category: 'Earned',
  applicableStaffTypes: ['Teaching', 'Administrative'],
  eligibilityMonths: 12,
  creditFrequency: 'Yearly',
  creditQuota: 30,
  prorateOnJoining: false,
  carryForwardAllowed: true,
  maxCarryForward: 60,
  encashmentAllowed: true,
  maxEncashable: 30,
  halfDayAllowed: false,
  minDuration: 1,
  maxDuration: 30,
  requiresDocument: false,
  canBeClubbed: ['CL'],
  lopWhenNegative: true,
  isPaid: true,
  status: 'Active'
},
{
  id: 'LT003',
  code: 'SL',
  name: 'Sick Leave',
  category: 'Sick',
  applicableStaffTypes: ['Teaching', 'Administrative', 'Support'],
  eligibilityMonths: 0,
  creditFrequency: 'Yearly',
  creditQuota: 12,
  prorateOnJoining: true,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: true,
  minDuration: 0.5,
  maxDuration: 7,
  requiresDocument: true,
  canBeClubbed: [],
  lopWhenNegative: true,
  isPaid: true,
  status: 'Active'
},
{
  id: 'LT004',
  code: 'ML',
  name: 'Maternity Leave',
  category: 'Maternity',
  applicableStaffTypes: ['Teaching', 'Administrative'],
  eligibilityMonths: 12,
  creditFrequency: 'On Joining',
  creditQuota: 180,
  prorateOnJoining: false,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: false,
  minDuration: 84,
  maxDuration: 180,
  requiresDocument: true,
  canBeClubbed: [],
  lopWhenNegative: false,
  isPaid: true,
  status: 'Active'
},
{
  id: 'LT005',
  code: 'PL',
  name: 'Paternity Leave',
  category: 'Paternity',
  applicableStaffTypes: ['Teaching', 'Administrative', 'Support'],
  eligibilityMonths: 12,
  creditFrequency: 'On Joining',
  creditQuota: 15,
  prorateOnJoining: false,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: false,
  minDuration: 5,
  maxDuration: 15,
  requiresDocument: true,
  canBeClubbed: [],
  lopWhenNegative: false,
  isPaid: true,
  status: 'Active'
},
{
  id: 'LT006',
  code: 'LOP',
  name: 'Leave Without Pay',
  category: 'LOP',
  applicableStaffTypes: ['Teaching', 'Administrative', 'Support'],
  eligibilityMonths: 0,
  creditFrequency: 'Manual',
  creditQuota: 0,
  prorateOnJoining: false,
  carryForwardAllowed: false,
  maxCarryForward: 0,
  encashmentAllowed: false,
  maxEncashable: 0,
  halfDayAllowed: true,
  minDuration: 0.5,
  maxDuration: 30,
  requiresDocument: false,
  canBeClubbed: [],
  lopWhenNegative: false,
  isPaid: false,
  status: 'Active'
}];

export function LeaveTypeMaster() {
  const [leaveTypes, setLeaveTypes] = useState(mockLeaveTypes);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'basic',
  'credit']
  );
  const [form, setForm] = useState({
    code: '',
    name: '',
    category: 'Casual',
    applicableStaffTypes: [] as string[],
    eligibilityMonths: 0,
    creditFrequency: 'Monthly',
    creditQuota: 0,
    prorateOnJoining: false,
    carryForwardAllowed: false,
    maxCarryForward: 0,
    encashmentAllowed: false,
    maxEncashable: 0,
    halfDayAllowed: false,
    minDuration: 1,
    maxDuration: 30,
    requiresDocument: false,
    canBeClubbed: [] as string[],
    lopWhenNegative: false,
    isPaid: true
  });
  const filtered = leaveTypes.filter((lt) => {
    const matchSearch =
    lt.name.toLowerCase().includes(search.toLowerCase()) ||
    lt.code.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || lt.category === categoryFilter;
    return matchSearch && matchCategory;
  });
  const resetForm = () => {
    setForm({
      code: '',
      name: '',
      category: 'Casual',
      applicableStaffTypes: [],
      eligibilityMonths: 0,
      creditFrequency: 'Monthly',
      creditQuota: 0,
      prorateOnJoining: false,
      carryForwardAllowed: false,
      maxCarryForward: 0,
      encashmentAllowed: false,
      maxEncashable: 0,
      halfDayAllowed: false,
      minDuration: 1,
      maxDuration: 30,
      requiresDocument: false,
      canBeClubbed: [],
      lopWhenNegative: false,
      isPaid: true
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setLeaveTypes((prev) =>
      prev.map((lt) =>
      lt.id === editId ?
      {
        ...lt,
        ...form
      } :
      lt
      )
      );
    } else {
      setLeaveTypes((prev) => [
      ...prev,
      {
        ...form,
        id: `LT${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (lt: LeaveType) => {
    setForm({
      code: lt.code,
      name: lt.name,
      category: lt.category,
      applicableStaffTypes: lt.applicableStaffTypes,
      eligibilityMonths: lt.eligibilityMonths,
      creditFrequency: lt.creditFrequency,
      creditQuota: lt.creditQuota,
      prorateOnJoining: lt.prorateOnJoining,
      carryForwardAllowed: lt.carryForwardAllowed,
      maxCarryForward: lt.maxCarryForward,
      encashmentAllowed: lt.encashmentAllowed,
      maxEncashable: lt.maxEncashable,
      halfDayAllowed: lt.halfDayAllowed,
      minDuration: lt.minDuration,
      maxDuration: lt.maxDuration,
      requiresDocument: lt.requiresDocument,
      canBeClubbed: lt.canBeClubbed,
      lopWhenNegative: lt.lopWhenNegative,
      isPaid: lt.isPaid
    });
    setEditId(lt.id);
    setShowForm(true);
  };
  const handleClone = (lt: LeaveType) => {
    setForm({
      code: `${lt.code}_COPY`,
      name: `${lt.name} (Copy)`,
      category: lt.category,
      applicableStaffTypes: lt.applicableStaffTypes,
      eligibilityMonths: lt.eligibilityMonths,
      creditFrequency: lt.creditFrequency,
      creditQuota: lt.creditQuota,
      prorateOnJoining: lt.prorateOnJoining,
      carryForwardAllowed: lt.carryForwardAllowed,
      maxCarryForward: lt.maxCarryForward,
      encashmentAllowed: lt.encashmentAllowed,
      maxEncashable: lt.maxEncashable,
      halfDayAllowed: lt.halfDayAllowed,
      minDuration: lt.minDuration,
      maxDuration: lt.maxDuration,
      requiresDocument: lt.requiresDocument,
      canBeClubbed: lt.canBeClubbed,
      lopWhenNegative: lt.lopWhenNegative,
      isPaid: lt.isPaid
    });
    setShowForm(true);
  };
  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
    prev.includes(section) ?
    prev.filter((s) => s !== section) :
    [...prev, section]
    );
  };
  const paidCount = leaveTypes.filter((lt) => lt.isPaid).length;
  const carryForwardCount = leaveTypes.filter(
    (lt) => lt.carryForwardAllowed
  ).length;
  const encashmentCount = leaveTypes.filter((lt) => lt.encashmentAllowed).length;
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Type Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure leave types, credit rules, and policies
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Add Leave Type
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{leaveTypes.length}</p>
            <p className="text-xs text-gray-500">Total Leave Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{paidCount}</p>
            <p className="text-xs text-gray-500">Paid Types</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{carryForwardCount}</p>
            <p className="text-xs text-gray-500">Carry-Forward Enabled</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{encashmentCount}</p>
            <p className="text-xs text-gray-500">Encashment Enabled</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Leave Type' : 'Add New Leave Type'}>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <button
              onClick={() => toggleSection('basic')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('basic') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Basic Information
              </button>
              {expandedSections.includes('basic') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Input
                label="Leave Code *"
                value={form.code}
                onChange={(e) =>
                setForm({
                  ...form,
                  code: e.target.value
                })
                }
                placeholder="e.g., CL" />

                  <Input
                label="Leave Name *"
                value={form.name}
                onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
                }
                placeholder="e.g., Casual Leave" />

                  <Select
                label="Category *"
                options={[
                {
                  value: 'Casual',
                  label: 'Casual'
                },
                {
                  value: 'Earned',
                  label: 'Earned'
                },
                {
                  value: 'Sick',
                  label: 'Sick'
                },
                {
                  value: 'Special',
                  label: 'Special'
                },
                {
                  value: 'Maternity',
                  label: 'Maternity'
                },
                {
                  value: 'Paternity',
                  label: 'Paternity'
                },
                {
                  value: 'Compensatory',
                  label: 'Compensatory'
                },
                {
                  value: 'LOP',
                  label: 'LOP'
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
                label="Eligibility (months of service)"
                type="number"
                value={form.eligibilityMonths}
                onChange={(e) =>
                setForm({
                  ...form,
                  eligibilityMonths: parseInt(e.target.value) || 0
                })
                } />

                  <div className="col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.isPaid}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      isPaid: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">Paid Leave</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.halfDayAllowed}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      halfDayAllowed: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Half-Day Allowed
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.requiresDocument}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      requiresDocument: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Requires Supporting Document
                      </span>
                    </label>
                  </div>
                </div>
            }
            </div>

            {/* Credit Rules Section */}
            <div>
              <button
              onClick={() => toggleSection('credit')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('credit') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Credit Rules
              </button>
              {expandedSections.includes('credit') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Select
                label="Credit Frequency *"
                options={[
                {
                  value: 'On Joining',
                  label: 'On Joining'
                },
                {
                  value: 'Monthly',
                  label: 'Monthly'
                },
                {
                  value: 'Quarterly',
                  label: 'Quarterly'
                },
                {
                  value: 'Yearly',
                  label: 'Yearly'
                },
                {
                  value: 'Manual',
                  label: 'Manual'
                }]
                }
                value={form.creditFrequency}
                onChange={(e) =>
                setForm({
                  ...form,
                  creditFrequency: e.target.value
                })
                } />

                  <Input
                label="Credit Quota (days)"
                type="number"
                value={form.creditQuota}
                onChange={(e) =>
                setForm({
                  ...form,
                  creditQuota: parseFloat(e.target.value) || 0
                })
                } />

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.prorateOnJoining}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      prorateOnJoining: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Prorate on Joining/Exit
                      </span>
                    </label>
                  </div>
                </div>
            }
            </div>

            {/* Carry-Forward Rules Section */}
            <div>
              <button
              onClick={() => toggleSection('carryforward')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('carryforward') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Carry-Forward Rules
              </button>
              {expandedSections.includes('carryforward') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.carryForwardAllowed}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      carryForwardAllowed: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Allow Carry-Forward
                      </span>
                    </label>
                  </div>
                  {form.carryForwardAllowed &&
              <Input
                label="Maximum Carry-Forward Days"
                type="number"
                value={form.maxCarryForward}
                onChange={(e) =>
                setForm({
                  ...form,
                  maxCarryForward: parseInt(e.target.value) || 0
                })
                } />

              }
                </div>
            }
            </div>

            {/* Encashment Rules Section */}
            <div>
              <button
              onClick={() => toggleSection('encashment')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('encashment') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Encashment Rules
              </button>
              {expandedSections.includes('encashment') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.encashmentAllowed}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      encashmentAllowed: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Allow Encashment
                      </span>
                    </label>
                  </div>
                  {form.encashmentAllowed &&
              <Input
                label="Maximum Encashable Days"
                type="number"
                value={form.maxEncashable}
                onChange={(e) =>
                setForm({
                  ...form,
                  maxEncashable: parseInt(e.target.value) || 0
                })
                } />

              }
                </div>
            }
            </div>

            {/* Duration & Other Rules Section */}
            <div>
              <button
              onClick={() => toggleSection('duration')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('duration') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Duration & Other Rules
              </button>
              {expandedSections.includes('duration') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Input
                label="Minimum Duration (days)"
                type="number"
                step="0.5"
                value={form.minDuration}
                onChange={(e) =>
                setForm({
                  ...form,
                  minDuration: parseFloat(e.target.value) || 0
                })
                } />

                  <Input
                label="Maximum Duration (days)"
                type="number"
                value={form.maxDuration}
                onChange={(e) =>
                setForm({
                  ...form,
                  maxDuration: parseInt(e.target.value) || 0
                })
                } />

                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.lopWhenNegative}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      lopWhenNegative: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Convert to LOP when balance is negative
                      </span>
                    </label>
                  </div>
                </div>
            }
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editId ? 'Update' : 'Create'} Leave Type
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
              placeholder="Search leave types..."
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
              value: 'Casual',
              label: 'Casual'
            },
            {
              value: 'Earned',
              label: 'Earned'
            },
            {
              value: 'Sick',
              label: 'Sick'
            },
            {
              value: 'Special',
              label: 'Special'
            },
            {
              value: 'Maternity',
              label: 'Maternity'
            },
            {
              value: 'Paternity',
              label: 'Paternity'
            },
            {
              value: 'Compensatory',
              label: 'Compensatory'
            },
            {
              value: 'LOP',
              label: 'LOP'
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
                  Leave Type
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Category
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Credit
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Quota
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Carry-Fwd
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Encash
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Type
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
              {filtered.map((lt, i) =>
              <tr
                key={lt.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {lt.name}
                        </p>
                        <p className="text-xs text-gray-500">{lt.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{lt.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {lt.creditFrequency}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {lt.creditQuota}d
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={lt.carryForwardAllowed ? 'success' : 'secondary'}>

                      {lt.carryForwardAllowed ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={lt.encashmentAllowed ? 'success' : 'secondary'}>

                      {lt.encashmentAllowed ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={lt.isPaid ? 'success' : 'warning'}>
                      {lt.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={lt.status === 'Active' ? 'success' : 'secondary'}>

                      {lt.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(lt)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleClone(lt)}
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