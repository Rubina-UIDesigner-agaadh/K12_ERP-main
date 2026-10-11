import React, { useEffect, useState } from 'react';
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
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  X,
  CheckCircle } from
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
  absentCustomRule: string;
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
  absentCustomRule: '',
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
  absentCustomRule: '',
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
  absentCustomRule: '',
  overtimeEligible: true,
  overtimeThreshold: 8,
  overtimeRounding: 'Nearest 1 hour',
  leaveDeductionPriority: ['CL', 'LOP'],
  sandwichRule: false,
  lopBasis: 'Fixed 30',
  overtimePaid: true,
  status: 'Active'
}];

const STAFF_TYPE_OPTIONS = [
'Teaching',
'Non-Teaching',
'Administrative',
'Support Staff',
'Transport Staff',
'Hostel Staff',
'Contractual'];

const ABSENT_LOGIC_OPTIONS = [
'No punch recorded',
'No punch or < 3 hours',
'No punch or < 4 hours',
'No punch or < 5 hours',
'Custom'];

const LEAVE_TYPE_OPTIONS = ['CL', 'SL', 'EL', 'PL', 'LOP'];

interface SimulationResult {
  hours: number;
  status: 'Full Day' | 'Half Day' | 'Absent';
  lateBy: number;
  withinGrace: boolean;
  markedAs: 'Present' | 'Present (0.5 day)' | 'Late Mark' | 'LOP';
  overtime: number | null;
}

interface TestInputs {
  punchIn: string;
  punchOut: string;
  shiftStart: string;
}

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const roundOvertime = (hours: number, rounding: string) => {
  const step = rounding === 'Nearest 1 hour' ? 1 : rounding === 'Nearest 15 minutes' ? 0.25 : 0.5;
  return Math.round(hours / step) * step;
};

// Applies the rule's thresholds to a punch-in / punch-out pair (test simulator logic).
const simulateRule = (rule: AttendanceRule, punchIn: string, punchOut: string, shiftStart: string): SimulationResult | string => {
  if (!punchIn || !punchOut) return 'Enter both punch in and punch out times.';
  const inMinutes = timeToMinutes(punchIn);
  const outMinutes = timeToMinutes(punchOut);
  if (outMinutes <= inMinutes) return 'Punch out must be later than punch in.';

  const hours = Math.round((outMinutes - inMinutes) / 60 * 100) / 100;
  let status: SimulationResult['status'] = 'Absent';
  if (hours >= rule.minHoursFullDay) status = 'Full Day';
  else if (hours >= rule.halfDayMinHours && hours <= rule.halfDayMaxHours) status = 'Half Day';

  const lateBy = shiftStart ? Math.max(0, inMinutes - timeToMinutes(shiftStart)) : 0;
  const withinGrace = lateBy <= rule.lateComingGrace;

  let markedAs: SimulationResult['markedAs'] = 'Present';
  if (status === 'Absent') markedAs = 'LOP';
  else if (lateBy > 0 && !withinGrace) markedAs = 'Late Mark';
  else if (status === 'Half Day') markedAs = 'Present (0.5 day)';

  let overtime: number | null = null;
  if (rule.overtimeEligible) {
    overtime = hours > rule.overtimeThreshold ? roundOvertime(hours - rule.overtimeThreshold, rule.overtimeRounding) : 0;
  }

  return { hours, status, lateBy, withinGrace, markedAs, overtime };
};

const statusVariant = (status: SimulationResult['status']) =>
status === 'Full Day' ? 'success' : status === 'Half Day' ? 'warning' : 'danger';

const markedVariant = (markedAs: SimulationResult['markedAs']) =>
markedAs === 'Present' ? 'success' : markedAs === 'LOP' ? 'danger' : 'warning';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg';
}

// Simple inline modal: fixed overlay with a centred card.
function Modal({ open, title, onClose, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${size === 'lg' ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-xl shadow-xl border border-gray-200`}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" title="Close">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer &&
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">{footer}</div>
        }
      </div>
    </div>);

}

export function AttendanceRuleMaster() {
  const [rules, setRules] = useState(mockRules);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>([
  'basic',
  'applicability',
  'hours',
  'absent',
  'leavePriority']
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<AttendanceRule | null>(null);
  const [testRule, setTestRule] = useState<AttendanceRule | null>(null);
  const [testInputs, setTestInputs] = useState<TestInputs>({ punchIn: '09:00', punchOut: '17:00', shiftStart: '09:00' });
  const [testResult, setTestResult] = useState<SimulationResult | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
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
    absentCustomRule: '',
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
      absentCustomRule: '',
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
    setFormErrors({});
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (form.applicableStaffTypes.length === 0) {
      errors.applicableStaffTypes = 'Select at least one staff type this rule applies to.';
    }
    if (!form.absentLogic) {
      errors.absentLogic = 'Select an absent criteria.';
    }
    if (form.absentLogic === 'Custom' && !form.absentCustomRule.trim()) {
      errors.absentCustomRule = 'Describe the custom absent rule.';
    }
    return errors;
  };

  const clearFormError = (key: string) => {
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSave = () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setExpandedSections((prev) => Array.from(new Set([...prev, 'applicability', 'absent'])));
      return;
    }
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
      absentCustomRule: rule.absentCustomRule,
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
      absentCustomRule: rule.absentCustomRule,
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
  const toggleStaffType = (type: string) => {
    setForm((prev) => ({
      ...prev,
      applicableStaffTypes: prev.applicableStaffTypes.includes(type) ?
      prev.applicableStaffTypes.filter((t) => t !== type) :
      [...prev.applicableStaffTypes, type]
    }));
    clearFormError('applicableStaffTypes');
  };

  const toggleLeaveType = (code: string) => {
    setForm((prev) => ({
      ...prev,
      leaveDeductionPriority: prev.leaveDeductionPriority.includes(code) ?
      prev.leaveDeductionPriority.filter((c) => c !== code) :
      [...prev.leaveDeductionPriority, code]
    }));
  };

  const moveLeaveType = (code: string, direction: -1 | 1) => {
    setForm((prev) => {
      const index = prev.leaveDeductionPriority.indexOf(code);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.leaveDeductionPriority.length) return prev;
      const next = [...prev.leaveDeductionPriority];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, leaveDeductionPriority: next };
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setRules((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    if (editId === deleteTarget.id) resetForm();
    setDeleteTarget(null);
    setToast('Rule deleted successfully.');
  };

  const toggleStatus = (rule: AttendanceRule) => {
    const nextStatus = rule.status === 'Active' ? 'Inactive' : 'Active';
    setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, status: nextStatus } : r));
    setToast(`Rule marked as ${nextStatus}.`);
  };

  const openTest = (rule: AttendanceRule) => {
    setTestRule(rule);
    setTestInputs({ punchIn: '09:00', punchOut: '17:00', shiftStart: '09:00' });
    setTestResult(null);
    setTestError(null);
  };

  const resetTest = () => {
    setTestInputs({ punchIn: '', punchOut: '', shiftStart: '09:00' });
    setTestResult(null);
    setTestError(null);
  };

  const runSimulation = () => {
    if (!testRule) return;
    const outcome = simulateRule(testRule, testInputs.punchIn, testInputs.punchOut, testInputs.shiftStart);
    if (typeof outcome === 'string') {
      setTestError(outcome);
      setTestResult(null);
      return;
    }
    setTestError(null);
    setTestResult(outcome);
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

            {/* Applicability */}
            <div>
              <button
              onClick={() => toggleSection('applicability')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('applicability') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Applicability <span className="text-red-500">*</span>
              </button>
              {expandedSections.includes('applicability') &&
            <div className="space-y-3 pl-6">
                  <p className="text-xs text-gray-500">Select the staff types this rule set applies to.</p>
                  {form.applicableStaffTypes.length > 0 &&
              <div className="flex flex-wrap gap-2">
                      {form.applicableStaffTypes.map((type) =>
                <span
                  key={type}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">

                          {type}
                          <button
                    type="button"
                    onClick={() => toggleStaffType(type)}
                    className="rounded-full hover:text-blue-900"
                    title={`Remove ${type}`}>

                            <X className="w-3 h-3" />
                          </button>
                        </span>
                )}
                    </div>
              }
                  <div className="grid grid-cols-3 gap-2">
                    {STAFF_TYPE_OPTIONS.map((type) =>
                <label
                  key={type}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">

                        <input
                    type="checkbox"
                    checked={form.applicableStaffTypes.includes(type)}
                    onChange={() => toggleStaffType(type)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                )}
                  </div>
                  {formErrors.applicableStaffTypes &&
              <p className="text-xs text-red-600">{formErrors.applicableStaffTypes}</p>
              }
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

            {/* Absent Marking Logic */}
            <div>
              <button
              onClick={() => toggleSection('absent')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('absent') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Absent Marking Logic
              </button>
              {expandedSections.includes('absent') &&
            <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Select
                  label="Absent Criteria *"
                  placeholder="Select absent criteria"
                  options={ABSENT_LOGIC_OPTIONS.map((option) => ({
                    value: option,
                    label: option
                  }))}
                  value={form.absentLogic}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    clearFormError('absentLogic');
                    setForm({
                      ...form,
                      absentLogic: e.target.value
                    });
                  }} />

                    {formErrors.absentLogic &&
                <p className="mt-1 text-xs text-red-600">{formErrors.absentLogic}</p>
                }
                    <p className="mt-1 text-xs text-gray-500">Decides when an employee is marked absent for the day.</p>
                  </div>
                  {form.absentLogic === 'Custom' &&
              <div className="col-span-2">
                      <Textarea
                  label="Custom Absent Rule *"
                  rows={3}
                  value={form.absentCustomRule}
                  onChange={(e) => {
                    clearFormError('absentCustomRule');
                    setForm({
                      ...form,
                      absentCustomRule: e.target.value
                    });
                  }}
                  placeholder="e.g., No punch, or punch duration under 3.5 hours on Saturdays"
                  helperText="Describe the rule in plain words. It is stored with this rule set."
                  error={formErrors.absentCustomRule} />

                    </div>
              }
                </div>
            }
            </div>

            {/* Leave Deduction Priority */}
            <div>
              <button
              onClick={() => toggleSection('leavePriority')}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">

                {expandedSections.includes('leavePriority') ?
              <ChevronDown className="w-4 h-4" /> :

              <ChevronRight className="w-4 h-4" />
              }
                Leave Deduction Priority
              </button>
              {expandedSections.includes('leavePriority') &&
            <div className="space-y-4 pl-6">
                  <p className="text-xs text-gray-500">System will deduct leaves in this order when an employee is absent.</p>
                  <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
                    {[
                ...form.leaveDeductionPriority,
                ...LEAVE_TYPE_OPTIONS.filter((code) => !form.leaveDeductionPriority.includes(code))].
                map((code) => {
                  const order = form.leaveDeductionPriority.indexOf(code);
                  const selected = order >= 0;
                  const lastIndex = form.leaveDeductionPriority.length - 1;
                  return (
                    <div key={code} className="flex items-center justify-between px-4 py-2.5">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleLeaveType(code)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />

                            <span className="text-sm font-semibold text-gray-800">{code}</span>
                          </label>
                          {selected ?
                      <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {order + 1}
                              </span>
                              <button
                          type="button"
                          onClick={() => moveLeaveType(code, -1)}
                          disabled={order === 0}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up">

                                <ArrowUp className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                          type="button"
                          onClick={() => moveLeaveType(code, 1)}
                          disabled={order === lastIndex}
                          className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down">

                                <ArrowDown className="w-4 h-4 text-gray-600" />
                              </button>
                            </div> :

                      <span className="text-xs text-gray-400">Not included</span>
                      }
                        </div>);

                })}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-4 py-3">
                    <span className="text-xs font-semibold text-blue-800 mr-1">Final order:</span>
                    {form.leaveDeductionPriority.length === 0 ?
                <span className="text-xs text-gray-500">No leave types selected</span> :

                form.leaveDeductionPriority.map((code, index) =>
                <React.Fragment key={code}>
                          {index > 0 && <ArrowRight className="w-3.5 h-3.5 text-gray-400" />}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-blue-200 px-2.5 py-1 text-xs font-semibold text-blue-800">
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">{index + 1}</span>
                            {code}
                          </span>
                        </React.Fragment>
                )}
                  </div>
                  <p className="text-xs text-gray-500">Tip: check a leave type to include it, then use the arrows to set its priority.</p>
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
                    <div className="inline-flex items-center gap-2">
                      <button
                      type="button"
                      role="switch"
                      aria-checked={rule.status === 'Active'}
                      onClick={() => toggleStatus(rule)}
                      title={rule.status === 'Active' ? 'Click to mark Inactive' : 'Click to mark Active'}
                      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${rule.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}>

                        <span
                        className={`ml-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${rule.status === 'Active' ? 'translate-x-4' : 'translate-x-0'}`} />

                      </button>
                      <span className={`text-xs font-medium ${rule.status === 'Active' ? 'text-green-700' : 'text-gray-500'}`}>
                        {rule.status}
                      </span>
                    </div>
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
                      onClick={() => openTest(rule)}
                      className="p-1.5 hover:bg-green-100 rounded-lg"
                      title="Test Rule">

                        <TestTube className="w-4 h-4 text-green-600" />
                      </button>
                      <button
                      onClick={() => setDeleteTarget(rule)}
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

      {/* Delete confirmation */}
      <Modal
        open={!!deleteTarget}
        title="Delete Attendance Rule?"
        onClose={() => setDeleteTarget(null)}
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>}>

        <p className="text-sm text-gray-600">
          Are you sure you want to delete '{deleteTarget?.name}'? This action cannot be undone and may affect payroll calculations for assigned staff.
        </p>
      </Modal>

      {/* Test rule simulator */}
      <Modal
        open={!!testRule}
        title={testRule ? `Test Rule: ${testRule.name}` : 'Test Rule'}
        size="lg"
        onClose={() => setTestRule(null)}
        footer={
        <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={resetTest}>Test Another</Button>
            <Button variant="primary" onClick={() => setTestRule(null)}>Close</Button>
          </div>}>

        {testRule &&
        <div className="space-y-5">
            <p className="text-xs text-gray-500">
              Rule: full day ≥ {testRule.minHoursFullDay} h · half day {testRule.halfDayMinHours}–{testRule.halfDayMaxHours} h · late grace {testRule.lateComingGrace} min
            </p>
            <div className="grid grid-cols-3 gap-4">
              <Input
              label="Punch In Time"
              type="time"
              value={testInputs.punchIn}
              onChange={(e) => setTestInputs({ ...testInputs, punchIn: e.target.value })} />

              <Input
              label="Punch Out Time"
              type="time"
              value={testInputs.punchOut}
              onChange={(e) => setTestInputs({ ...testInputs, punchOut: e.target.value })} />

              <Input
              label="Expected Shift Start"
              type="time"
              value={testInputs.shiftStart}
              onChange={(e) => setTestInputs({ ...testInputs, shiftStart: e.target.value })}
              helperText="Default 09:00" />

            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={runSimulation}>
                <TestTube className="w-4 h-4 mr-2" />
                Simulate
              </Button>
              {testError && <p className="text-sm text-red-600">{testError}</p>}
            </div>

            {testResult &&
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 text-sm font-semibold text-gray-900">Simulation Result</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <dt className="text-gray-600">Total Hours Worked</dt>
                  <dd className="font-semibold text-gray-900">{testResult.hours.toFixed(1)} hrs</dd>

                  <dt className="text-gray-600">Attendance Status</dt>
                  <dd>
                    <Badge variant={statusVariant(testResult.status)}>{testResult.status}</Badge>
                  </dd>

                  <dt className="text-gray-600">Late By</dt>
                  <dd className="font-semibold text-gray-900">
                    {testResult.lateBy > 0 ? `${testResult.lateBy} minutes` : 'Not late'}
                  </dd>

                  <dt className="text-gray-600">Within Grace Period</dt>
                  <dd>
                    <Badge variant={testResult.withinGrace ? 'success' : 'danger'}>
                      {testResult.withinGrace ? 'Yes' : 'No'}
                    </Badge>
                  </dd>

                  <dt className="text-gray-600">Will Be Marked As</dt>
                  <dd>
                    <Badge variant={markedVariant(testResult.markedAs)}>{testResult.markedAs}</Badge>
                  </dd>

                  <dt className="text-gray-600">Overtime Hours</dt>
                  <dd className="font-semibold text-gray-900">
                    {testResult.overtime === null ? 'Not eligible' : `${testResult.overtime.toFixed(1)} hrs`}
                  </dd>
                </dl>
              </div>
          }
          </div>
        }
      </Modal>

      {toast &&
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
          <CheckCircle className="w-4 h-4 text-green-400" />
          {toast}
        </div>
      }
    </div>);

}