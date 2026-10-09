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
  Settings,
  Copy,
  TestTube,
  ChevronDown,
  ChevronRight } from
'lucide-react';
interface AttendanceRule {
  id: string;
  name: string;
  academicYear: string;
  applicableStaffTypes: string[];
  minHoursFullDay: number;
  halfDayMinHours: number;
  halfDayMaxHours: number;
  lateComingGrace: number;
  lateComingConversion: string;
  earlyGoingGrace: number;
  earlyGoingPenalty: string;
  absentLogic: string;
  overtimeEligible: boolean;
  overtimeThreshold: number;
  overtimeRounding: string;
  leaveDeductionPriority: string[];
  sandwichRule: boolean;
  lopBasis: string;
  overtimePaid: boolean;
  status: 'Active' | 'Inactive';
}
const mockRules: AttendanceRule[] = [
{
  id: 'AR001',
  name: 'Standard Teaching Staff Rule',
  academicYear: '2024-25',
  applicableStaffTypes: ['Teaching'],
  minHoursFullDay: 7,
  halfDayMinHours: 4,
  halfDayMaxHours: 6.5,
  lateComingGrace: 15,
  lateComingConversion: '3 late marks = 0.5 day LOP',
  earlyGoingGrace: 10,
  earlyGoingPenalty: '3 early goings = 0.5 day LOP',
  absentLogic: 'No punch or < 4 hours',
  overtimeEligible: false,
  overtimeThreshold: 0,
  overtimeRounding: 'Nearest 30 minutes',
  leaveDeductionPriority: ['CL', 'EL', 'LOP'],
  sandwichRule: true,
  lopBasis: 'Working Days',
  overtimePaid: false,
  status: 'Active'
},
{
  id: 'AR002',
  name: 'Administrative Staff Rule',
  academicYear: '2024-25',
  applicableStaffTypes: ['Administrative'],
  minHoursFullDay: 8,
  halfDayMinHours: 4,
  halfDayMaxHours: 7.5,
  lateComingGrace: 10,
  lateComingConversion: '4 late marks = 0.5 day LOP',
  earlyGoingGrace: 10,
  earlyGoingPenalty: '4 early goings = 0.5 day LOP',
  absentLogic: 'No punch or < 4 hours',
  overtimeEligible: true,
  overtimeThreshold: 8,
  overtimeRounding: 'Nearest 1 hour',
  leaveDeductionPriority: ['CL', 'EL', 'LOP'],
  sandwichRule: false,
  lopBasis: 'Calendar Days',
  overtimePaid: true,
  status: 'Active'
},
{
  id: 'AR003',
  name: 'Support Staff Rule',
  academicYear: '2024-25',
  applicableStaffTypes: ['Support Staff'],
  minHoursFullDay: 8,
  halfDayMinHours: 4,
  halfDayMaxHours: 7.5,
  lateComingGrace: 5,
  lateComingConversion: '2 late marks = 0.5 day LOP',
  earlyGoingGrace: 5,
  earlyGoingPenalty: '2 early goings = 0.5 day LOP',
  absentLogic: 'No punch or < 3 hours',
  overtimeEligible: true,
  overtimeThreshold: 8,
  overtimeRounding: 'Nearest 1 hour',
  leaveDeductionPriority: ['CL', 'LOP'],
  sandwichRule: false,
  lopBasis: 'Fixed 30',
  overtimePaid: true,
  status: 'Active'
}];

export function AttendanceRuleMaster() {
  const [rules, setRules] = useState(mockRules);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'basic',
  'hours']
  );
  const [form, setForm] = useState({
    name: '',
    academicYear: '2024-25',
    applicableStaffTypes: [] as string[],
    minHoursFullDay: 7,
    halfDayMinHours: 4,
    halfDayMaxHours: 6.5,
    lateComingGrace: 15,
    lateComingConversion: '',
    earlyGoingGrace: 10,
    earlyGoingPenalty: '',
    absentLogic: '',
    overtimeEligible: false,
    overtimeThreshold: 0,
    overtimeRounding: 'Nearest 30 minutes',
    leaveDeductionPriority: [] as string[],
    sandwichRule: false,
    lopBasis: 'Working Days',
    overtimePaid: false
  });
  const filtered = rules.filter((r) =>
  r.name.toLowerCase().includes(search.toLowerCase())
  );
  const resetForm = () => {
    setForm({
      name: '',
      academicYear: '2024-25',
      applicableStaffTypes: [],
      minHoursFullDay: 7,
      halfDayMinHours: 4,
      halfDayMaxHours: 6.5,
      lateComingGrace: 15,
      lateComingConversion: '',
      earlyGoingGrace: 10,
      earlyGoingPenalty: '',
      absentLogic: '',
      overtimeEligible: false,
      overtimeThreshold: 0,
      overtimeRounding: 'Nearest 30 minutes',
      leaveDeductionPriority: [],
      sandwichRule: false,
      lopBasis: 'Working Days',
      overtimePaid: false
    });
    setShowForm(false);
    setEditId(null);
  };
  const handleSave = () => {
    if (editId) {
      setRules((prev) =>
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
      setRules((prev) => [
      ...prev,
      {
        ...form,
        id: `AR${Date.now()}`,
        status: 'Active' as const
      }]
      );
    }
    resetForm();
  };
  const handleEdit = (rule: AttendanceRule) => {
    setForm({
      name: rule.name,
      academicYear: rule.academicYear,
      applicableStaffTypes: rule.applicableStaffTypes,
      minHoursFullDay: rule.minHoursFullDay,
      halfDayMinHours: rule.halfDayMinHours,
      halfDayMaxHours: rule.halfDayMaxHours,
      lateComingGrace: rule.lateComingGrace,
      lateComingConversion: rule.lateComingConversion,
      earlyGoingGrace: rule.earlyGoingGrace,
      earlyGoingPenalty: rule.earlyGoingPenalty,
      absentLogic: rule.absentLogic,
      overtimeEligible: rule.overtimeEligible,
      overtimeThreshold: rule.overtimeThreshold,
      overtimeRounding: rule.overtimeRounding,
      leaveDeductionPriority: rule.leaveDeductionPriority,
      sandwichRule: rule.sandwichRule,
      lopBasis: rule.lopBasis,
      overtimePaid: rule.overtimePaid
    });
    setEditId(rule.id);
    setShowForm(true);
  };
  const handleClone = (rule: AttendanceRule) => {
    setForm({
      name: `${rule.name} (Copy)`,
      academicYear: rule.academicYear,
      applicableStaffTypes: rule.applicableStaffTypes,
      minHoursFullDay: rule.minHoursFullDay,
      halfDayMinHours: rule.halfDayMinHours,
      halfDayMaxHours: rule.halfDayMaxHours,
      lateComingGrace: rule.lateComingGrace,
      lateComingConversion: rule.lateComingConversion,
      earlyGoingGrace: rule.earlyGoingGrace,
      earlyGoingPenalty: rule.earlyGoingPenalty,
      absentLogic: rule.absentLogic,
      overtimeEligible: rule.overtimeEligible,
      overtimeThreshold: rule.overtimeThreshold,
      overtimeRounding: rule.overtimeRounding,
      leaveDeductionPriority: rule.leaveDeductionPriority,
      sandwichRule: rule.sandwichRule,
      lopBasis: rule.lopBasis,
      overtimePaid: rule.overtimePaid
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
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Rule Master
          </h1>
          <p className="text-sm text-gray-500">
            Configure attendance interpretation and payroll integration rules
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}>

          <Plus className="w-4 h-4 mr-2" />
          Create Rule Set
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xl font-bold">{rules.length}</p>
            <p className="text-xs text-gray-500">Total Rule Sets</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {rules.filter((r) => r.status === 'Active').length}
            </p>
            <p className="text-xs text-gray-500">Active Rules</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {new Set(rules.flatMap((r) => r.applicableStaffTypes)).size}
            </p>
            <p className="text-xs text-gray-500">Staff Types Covered</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xl font-bold">
              {(
              rules.reduce((sum, r) => sum + r.overtimeThreshold, 0) /
              rules.filter((r) => r.overtimeEligible).length).
              toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">Avg OT Threshold</p>
          </div>
        </div>
      </div>

      {showForm &&
      <Card title={editId ? 'Edit Rule Set' : 'Create New Rule Set'}>
          <div className="space-y-6">
            {/* Basic Information */}
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
                label="Rule Set Name *"
                value={form.name}
                onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value
                })
                }
                placeholder="e.g., Standard Teaching Staff Rule" />

                  <Select
                label="Academic / Financial Year *"
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
                setForm({
                  ...form,
                  academicYear: e.target.value
                })
                } />

                </div>
            }
            </div>

            {/* Working Hours Definition */}
            <div>
              <button
              onClick={() => toggleSection('hours')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('hours') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Working Hours Definition
              </button>
              {expandedSections.includes('hours') &&
            <div className="grid grid-cols-3 gap-4 pl-6">
                  <Input
                label="Min Hours for Full Day *"
                type="number"
                step="0.5"
                value={form.minHoursFullDay}
                onChange={(e) =>
                setForm({
                  ...form,
                  minHoursFullDay: parseFloat(e.target.value) || 0
                })
                } />

                  <Input
                label="Half-Day Min Hours *"
                type="number"
                step="0.5"
                value={form.halfDayMinHours}
                onChange={(e) =>
                setForm({
                  ...form,
                  halfDayMinHours: parseFloat(e.target.value) || 0
                })
                } />

                  <Input
                label="Half-Day Max Hours *"
                type="number"
                step="0.5"
                value={form.halfDayMaxHours}
                onChange={(e) =>
                setForm({
                  ...form,
                  halfDayMaxHours: parseFloat(e.target.value) || 0
                })
                } />

                </div>
            }
            </div>

            {/* Late Coming Rules */}
            <div>
              <button
              onClick={() => toggleSection('late')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('late') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Late Coming Rules
              </button>
              {expandedSections.includes('late') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Input
                label="Grace Time (minutes)"
                type="number"
                value={form.lateComingGrace}
                onChange={(e) =>
                setForm({
                  ...form,
                  lateComingGrace: parseInt(e.target.value) || 0
                })
                } />

                  <Input
                label="Conversion Rule"
                value={form.lateComingConversion}
                onChange={(e) =>
                setForm({
                  ...form,
                  lateComingConversion: e.target.value
                })
                }
                placeholder="e.g., 3 late marks = 0.5 day LOP" />

                </div>
            }
            </div>

            {/* Early Going Rules */}
            <div>
              <button
              onClick={() => toggleSection('early')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('early') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Early Going Rules
              </button>
              {expandedSections.includes('early') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Input
                label="Grace Time (minutes)"
                type="number"
                value={form.earlyGoingGrace}
                onChange={(e) =>
                setForm({
                  ...form,
                  earlyGoingGrace: parseInt(e.target.value) || 0
                })
                } />

                  <Input
                label="Penalty Rule"
                value={form.earlyGoingPenalty}
                onChange={(e) =>
                setForm({
                  ...form,
                  earlyGoingPenalty: e.target.value
                })
                }
                placeholder="e.g., 3 early goings = 0.5 day LOP" />

                </div>
            }
            </div>

            {/* Overtime Rules */}
            <div>
              <button
              onClick={() => toggleSection('overtime')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('overtime') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Overtime Rules
              </button>
              {expandedSections.includes('overtime') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.overtimeEligible}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      overtimeEligible: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Overtime Eligible
                      </span>
                    </label>
                  </div>
                  {form.overtimeEligible &&
              <>
                      <Input
                  label="OT Threshold (hours)"
                  type="number"
                  step="0.5"
                  value={form.overtimeThreshold}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    overtimeThreshold: parseFloat(e.target.value) || 0
                  })
                  } />

                      <Select
                  label="Rounding Rule"
                  options={[
                  {
                    value: 'Nearest 15 minutes',
                    label: 'Nearest 15 minutes'
                  },
                  {
                    value: 'Nearest 30 minutes',
                    label: 'Nearest 30 minutes'
                  },
                  {
                    value: 'Nearest 1 hour',
                    label: 'Nearest 1 hour'
                  }]
                  }
                  value={form.overtimeRounding}
                  onChange={(e) =>
                  setForm({
                    ...form,
                    overtimeRounding: e.target.value
                  })
                  } />

                      <div className="col-span-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                      type="checkbox"
                      checked={form.overtimePaid}
                      onChange={(e) =>
                      setForm({
                        ...form,
                        overtimePaid: e.target.checked
                      })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                          <span className="text-sm text-gray-700">
                            Overtime is Paid
                          </span>
                        </label>
                      </div>
                    </>
              }
                </div>
            }
            </div>

            {/* Payroll Integration */}
            <div>
              <button
              onClick={() => toggleSection('payroll')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('payroll') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Payroll Integration
              </button>
              {expandedSections.includes('payroll') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <Select
                label="LOP Calculation Basis *"
                options={[
                {
                  value: 'Calendar Days',
                  label: 'Calendar Days'
                },
                {
                  value: 'Working Days',
                  label: 'Working Days'
                },
                {
                  value: 'Fixed 30',
                  label: 'Fixed 30'
                }]
                }
                value={form.lopBasis}
                onChange={(e) =>
                setForm({
                  ...form,
                  lopBasis: e.target.value
                })
                } />

                  <div />
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={form.sandwichRule}
                    onChange={(e) =>
                    setForm({
                      ...form,
                      sandwichRule: e.target.checked
                    })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                      <span className="text-sm text-gray-700">
                        Apply Sandwich Rule (holidays/weekends between absences
                        treated as leave/LOP)
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
              {editId ? 'Update' : 'Create'} Rule Set
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      }

      <Card>
        <div className="relative mb-4">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search rule sets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Rule Set
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Year
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Full Day
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Half Day
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Grace (min)
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  OT
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  LOP Basis
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
              {filtered.map((rule, i) =>
              <tr
                key={rule.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {rule.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {rule.applicableStaffTypes.join(', ')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {rule.academicYear}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
                      {rule.minHoursFullDay}h
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    {rule.halfDayMinHours}-{rule.halfDayMaxHours}h
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-600">
                    +{rule.lateComingGrace} / -{rule.earlyGoingGrace}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={rule.overtimeEligible ? 'success' : 'secondary'}>

                      {rule.overtimeEligible ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="secondary">{rule.lopBasis}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                    variant={
                    rule.status === 'Active' ? 'success' : 'secondary'
                    }>

                      {rule.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleEdit(rule)}
                      className="p-1.5 hover:bg-blue-100 rounded-lg"
                      title="Edit">

                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                      onClick={() => handleClone(rule)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg"
                      title="Clone">

                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                      className="p-1.5 hover:bg-green-100 rounded-lg"
                      title="Test Rule">

                        <TestTube className="w-4 h-4 text-green-600" />
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