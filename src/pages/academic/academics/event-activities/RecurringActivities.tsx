import React, { useCallback, useMemo, useState, createElement } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  RepeatIcon,
  PlusIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  FilterIcon,
  DownloadIcon,
  PrinterIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  CheckIcon,
  AlertTriangleIcon,
  SettingsIcon,
  CopyIcon,
  HistoryIcon,
  RefreshCwIcon,
  SearchIcon,
  ChevronRightIcon } from
'lucide-react';
type RecurrenceType =
'daily' |
'weekly' |
'biweekly' |
'monthly' |
'yearly' |
'custom';
type ActivityType =
'assembly' |
'meeting' |
'supervision' |
'duty' |
'training' |
'event' |
'other';
type AssignmentType =
'individual' |
'rotating' |
'department' |
'all_staff' |
'custom_group';
type ActivityStatus = 'active' | 'paused' | 'completed' | 'archived';
type OccurrenceStatus =
'scheduled' |
'completed' |
'skipped' |
'rescheduled' |
'cancelled';
type Teacher = {
  id: string;
  name: string;
  shortName: string;
  department: string;
};
type Department = {
  id: string;
  name: string;
};
type RecurringActivity = {
  id: string;
  name: string;
  description: string;
  type: ActivityType;
  location: string;
  startTime: string;
  endTime: string;
  recurrenceType: RecurrenceType;
  weekDays: number[];
  monthDay: number;
  monthWeek: number;
  monthWeekDay: number;
  yearMonth: number;
  yearDay: number;
  customPattern: string;
  interval: number;
  startDate: string;
  endDate: string;
  assignmentType: AssignmentType;
  assignedTeacherIds: string[];
  rotatingTeacherIds: string[];
  currentRotationIndex: number;
  departmentId: string;
  status: ActivityStatus;
  priority: 'low' | 'medium' | 'high';
  reminderMinutes: number[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  skipDates: string[];
  totalOccurrences: number;
  completedOccurrences: number;
};
type Occurrence = {
  id: string;
  activityId: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedTeacherIds: string[];
  status: OccurrenceStatus;
  completedBy: string | null;
  completedAt: string | null;
  notes: string;
  rescheduledTo: string | null;
};
const ACTIVITY_TYPES: {
  value: ActivityType;
  label: string;
}[] = [
{
  value: 'assembly',
  label: 'Assembly Duty'
},
{
  value: 'meeting',
  label: 'Meeting'
},
{
  value: 'supervision',
  label: 'Supervision'
},
{
  value: 'duty',
  label: 'Special Duty'
},
{
  value: 'training',
  label: 'Training'
},
{
  value: 'event',
  label: 'Event'
},
{
  value: 'other',
  label: 'Other'
}];

const RECURRENCE_TYPES: {
  value: RecurrenceType;
  label: string;
  description: string;
}[] = [
{
  value: 'daily',
  label: 'Daily',
  description: 'Repeats every day or specific weekdays'
},
{
  value: 'weekly',
  label: 'Weekly',
  description: 'Repeats on selected days every week'
},
{
  value: 'biweekly',
  label: 'Bi-weekly',
  description: 'Repeats every two weeks'
},
{
  value: 'monthly',
  label: 'Monthly',
  description: 'Repeats on specific day of month'
},
{
  value: 'yearly',
  label: 'Yearly',
  description: 'Repeats on specific date each year'
},
{
  value: 'custom',
  label: 'Custom',
  description: 'Custom interval pattern'
}];

const ASSIGNMENT_TYPES: {
  value: AssignmentType;
  label: string;
}[] = [
{
  value: 'individual',
  label: 'Individual Teacher(s)'
},
{
  value: 'rotating',
  label: 'Rotating Roster'
},
{
  value: 'department',
  label: 'Entire Department'
},
{
  value: 'all_staff',
  label: 'All Staff'
},
{
  value: 'custom_group',
  label: 'Custom Group'
}];

const STATUS_CONFIG: Record<
  ActivityStatus,
  {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'default';
  }> =
{
  active: {
    label: 'Active',
    variant: 'success'
  },
  paused: {
    label: 'Paused',
    variant: 'warning'
  },
  completed: {
    label: 'Completed',
    variant: 'default'
  },
  archived: {
    label: 'Archived',
    variant: 'error'
  }
};
const OCCURRENCE_STATUS: Record<
  OccurrenceStatus,
  {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  }> =
{
  scheduled: {
    label: 'Scheduled',
    variant: 'info'
  },
  completed: {
    label: 'Completed',
    variant: 'success'
  },
  skipped: {
    label: 'Skipped',
    variant: 'warning'
  },
  rescheduled: {
    label: 'Rescheduled',
    variant: 'default'
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error'
  }
};
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'];

const WEEK_OPTIONS = [
{
  value: 1,
  label: 'First'
},
{
  value: 2,
  label: 'Second'
},
{
  value: 3,
  label: 'Third'
},
{
  value: 4,
  label: 'Fourth'
},
{
  value: -1,
  label: 'Last'
}];

const MASTER_FRANCHISES = [
{
  value: 'all',
  label: 'All Franchises'
},
{
  value: 'mf1',
  label: 'ABC Education Group'
},
{
  value: 'mf2',
  label: 'XYZ Learning Hub'
},
{
  value: 'mf3',
  label: 'PQR Academy Network'
}];

const CENTRES = [
{
  value: 'all',
  label: 'All Centres'
},
{
  value: 'c1',
  label: 'Main Campus'
},
{
  value: 'c2',
  label: 'North Branch'
},
{
  value: 'c3',
  label: 'South Branch'
},
{
  value: 'c4',
  label: 'East Wing'
},
{
  value: 'c5',
  label: 'West Campus'
}];

const TEACHERS: Teacher[] = [
{
  id: 't1',
  name: 'Ankit Gupta',
  shortName: 'A. Gupta',
  department: 'Science'
},
{
  id: 't2',
  name: 'Kavita Devi',
  shortName: 'K. Devi',
  department: 'Languages'
},
{
  id: 't3',
  name: 'Mohan Verma',
  shortName: 'M. Verma',
  department: 'Science'
},
{
  id: 't4',
  name: 'Sunita Patel',
  shortName: 'S. Patel',
  department: 'Science'
},
{
  id: 't5',
  name: 'Rajesh Sharma',
  shortName: 'R. Sharma',
  department: 'Mathematics'
},
{
  id: 't6',
  name: 'Vinod Kumar',
  shortName: 'V. Kumar',
  department: 'Social Studies'
},
{
  id: 't7',
  name: 'Priya Joshi',
  shortName: 'P. Joshi',
  department: 'Languages'
},
{
  id: 't8',
  name: 'Deepak Singh',
  shortName: 'D. Singh',
  department: 'Computer'
}];

const DEPARTMENTS: Department[] = [
{
  id: 'd1',
  name: 'Science'
},
{
  id: 'd2',
  name: 'Mathematics'
},
{
  id: 'd3',
  name: 'Languages'
},
{
  id: 'd4',
  name: 'Social Studies'
},
{
  id: 'd5',
  name: 'Computer'
},
{
  id: 'd6',
  name: 'Administration'
}];

const generateId = () =>
`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const formatDate = (date: string) =>
new Date(date).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const formatTime = (time: string) =>
time ?
new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
}) :
'';
const getDateString = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const getNextOccurrence = (activity: RecurringActivity): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(activity.startDate);
  const end = activity.endDate ? new Date(activity.endDate) : null;
  if (activity.status !== 'active') return '-';
  if (end && today > end) return 'Ended';
  let nextDate = new Date(Math.max(today.getTime(), start.getTime()));
  const isValidDay = (date: Date): boolean => {
    const dateStr = getDateString(date);
    if (activity.skipDates.includes(dateStr)) return false;
    const dayOfWeek = date.getDay();
    switch (activity.recurrenceType) {
      case 'daily':
        return (
          activity.weekDays.length === 0 ||
          activity.weekDays.includes(dayOfWeek));

      case 'weekly':
      case 'biweekly':
        return activity.weekDays.includes(dayOfWeek);
      case 'monthly':
        if (activity.monthDay > 0) return date.getDate() === activity.monthDay;
        if (activity.monthWeek !== 0) {
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          if (activity.monthWeek === -1) {
            let checkDate = new Date(lastDay);
            while (checkDate.getDay() !== activity.monthWeekDay)
            checkDate.setDate(checkDate.getDate() - 1);
            return date.getDate() === checkDate.getDate();
          }
          let count = 0;
          for (let d = 1; d <= lastDay.getDate(); d++) {
            const checkDate = new Date(date.getFullYear(), date.getMonth(), d);
            if (checkDate.getDay() === activity.monthWeekDay) {
              count++;
              if (count === activity.monthWeek) return date.getDate() === d;
            }
          }
        }
        return false;
      case 'yearly':
        return (
          date.getMonth() === activity.yearMonth &&
          date.getDate() === activity.yearDay);

      default:
        return true;
    }
  };
  for (let i = 0; i < 365; i++) {
    if (isValidDay(nextDate)) {
      if (end && nextDate > end) return 'Ended';
      const diff = Math.ceil(
        (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff === 0) return 'Today';
      if (diff === 1) return 'Tomorrow';
      if (diff < 7) return `${DAYS[nextDate.getDay()]} (${diff} days)`;
      return formatDate(getDateString(nextDate));
    }
    nextDate = addDays(nextDate, 1);
  }
  return 'Not scheduled';
};
const getFrequencyText = (activity: RecurringActivity): string => {
  switch (activity.recurrenceType) {
    case 'daily':
      if (activity.weekDays.length === 0) return 'Every day';
      if (
      activity.weekDays.length === 5 &&
      !activity.weekDays.includes(0) &&
      !activity.weekDays.includes(6))

      return 'Daily (Mon-Fri)';
      return `Daily (${activity.weekDays.map((d) => DAYS[d]).join(', ')})`;
    case 'weekly':
      return `Weekly (${activity.weekDays.map((d) => DAYS[d]).join(', ')})`;
    case 'biweekly':
      return `Bi-weekly (${activity.weekDays.map((d) => DAYS[d]).join(', ')})`;
    case 'monthly':
      if (activity.monthDay > 0) return `Monthly (Day ${activity.monthDay})`;
      const weekLabel =
      WEEK_OPTIONS.find((w) => w.value === activity.monthWeek)?.label || '';
      return `Monthly (${weekLabel} ${DAYS[activity.monthWeekDay]})`;
    case 'yearly':
      return `Yearly (${MONTHS[activity.yearMonth]} ${activity.yearDay})`;
    case 'custom':
      return activity.customPattern || 'Custom pattern';
    default:
      return 'Unknown';
  }
};
const getAssignmentText = (activity: RecurringActivity): string => {
  switch (activity.assignmentType) {
    case 'individual':
      return (
        activity.assignedTeacherIds.
        map((id) => TEACHERS.find((t) => t.id === id)?.shortName).
        filter(Boolean).
        join(', ') || '-');

    case 'rotating':
      return `Rotating Roster (${activity.rotatingTeacherIds.length} teachers)`;
    case 'department':
      return (
        DEPARTMENTS.find((d) => d.id === activity.departmentId)?.name || '-');

    case 'all_staff':
      return 'All Staff';
    case 'custom_group':
      return `Custom Group (${activity.assignedTeacherIds.length})`;
    default:
      return '-';
  }
};
export function RecurringActivities() {
  const [activities, setActivities] = useState<RecurringActivity[]>([
  {
    id: 'r1',
    name: 'Morning Assembly Duty',
    description: 'Supervision during morning assembly',
    type: 'assembly',
    location: 'Main Ground',
    startTime: '07:30',
    endTime: '08:00',
    recurrenceType: 'daily',
    weekDays: [1, 2, 3, 4, 5],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'rotating',
    assignedTeacherIds: [],
    rotatingTeacherIds: ['t1', 't2', 't3', 't4', 't5', 't6'],
    currentRotationIndex: 0,
    departmentId: '',
    status: 'active',
    priority: 'high',
    reminderMinutes: [30, 15],
    notes: 'Ensure punctuality',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 250,
    completedOccurrences: 45
  },
  {
    id: 'r2',
    name: 'HOD Weekly Sync',
    description: 'Weekly coordination meeting for all HODs',
    type: 'meeting',
    location: 'Conference Room',
    startTime: '15:00',
    endTime: '16:00',
    recurrenceType: 'weekly',
    weekDays: [5],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'custom_group',
    assignedTeacherIds: ['t1', 't3', 't5', 't7'],
    rotatingTeacherIds: [],
    currentRotationIndex: 0,
    departmentId: '',
    status: 'active',
    priority: 'high',
    reminderMinutes: [60, 15],
    notes: 'Prepare department reports',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 52,
    completedOccurrences: 8
  },
  {
    id: 'r3',
    name: 'Library Supervision',
    description: 'Supervise students during library hours',
    type: 'supervision',
    location: 'Library',
    startTime: '12:30',
    endTime: '13:30',
    recurrenceType: 'weekly',
    weekDays: [1, 3],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'individual',
    assignedTeacherIds: ['t1'],
    rotatingTeacherIds: [],
    currentRotationIndex: 0,
    departmentId: '',
    status: 'active',
    priority: 'medium',
    reminderMinutes: [15],
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 104,
    completedOccurrences: 16
  },
  {
    id: 'r4',
    name: 'Monthly Staff Meeting',
    description: 'All staff mandatory meeting',
    type: 'meeting',
    location: 'Auditorium',
    startTime: '13:00',
    endTime: '14:30',
    recurrenceType: 'monthly',
    weekDays: [],
    monthDay: 0,
    monthWeek: -1,
    monthWeekDay: 6,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'all_staff',
    assignedTeacherIds: [],
    rotatingTeacherIds: [],
    currentRotationIndex: 0,
    departmentId: '',
    status: 'active',
    priority: 'high',
    reminderMinutes: [1440, 60],
    notes: 'Attendance mandatory',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 12,
    completedOccurrences: 2
  },
  {
    id: 'r5',
    name: 'Bus Departure Duty',
    description: 'Supervise student departure to buses',
    type: 'duty',
    location: 'Bus Stand',
    startTime: '15:30',
    endTime: '16:00',
    recurrenceType: 'daily',
    weekDays: [1, 2, 3, 4, 5],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'rotating',
    assignedTeacherIds: [],
    rotatingTeacherIds: ['t2', 't4', 't6', 't8'],
    currentRotationIndex: 2,
    departmentId: '',
    status: 'active',
    priority: 'high',
    reminderMinutes: [15],
    notes: 'Ensure all students board safely',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 250,
    completedOccurrences: 45
  },
  {
    id: 'r6',
    name: 'Science Department Meeting',
    description: 'Weekly science department coordination',
    type: 'meeting',
    location: 'Science Lab',
    startTime: '14:00',
    endTime: '15:00',
    recurrenceType: 'weekly',
    weekDays: [2],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    assignmentType: 'department',
    assignedTeacherIds: [],
    rotatingTeacherIds: [],
    currentRotationIndex: 0,
    departmentId: 'd1',
    status: 'paused',
    priority: 'medium',
    reminderMinutes: [30],
    notes: 'Paused for exam period',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 52,
    completedOccurrences: 6
  },
  {
    id: 'r7',
    name: 'Annual Day Preparation',
    description: 'Weekly preparation for annual day',
    type: 'event',
    location: 'Auditorium',
    startTime: '14:00',
    endTime: '16:00',
    recurrenceType: 'weekly',
    weekDays: [3, 5],
    monthDay: 0,
    monthWeek: 0,
    monthWeekDay: 0,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    assignmentType: 'custom_group',
    assignedTeacherIds: ['t2', 't7'],
    rotatingTeacherIds: [],
    currentRotationIndex: 0,
    departmentId: '',
    status: 'active',
    priority: 'high',
    reminderMinutes: [60],
    notes: 'Cultural committee activities',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    skipDates: [],
    totalOccurrences: 12,
    completedOccurrences: 4
  }]
  );
  const [occurrences, setOccurrences] = useState<Occurrence[]>([
  {
    id: 'o1',
    activityId: 'r1',
    date: getDateString(new Date()),
    startTime: '07:30',
    endTime: '08:00',
    assignedTeacherIds: ['t1'],
    status: 'scheduled',
    completedBy: null,
    completedAt: null,
    notes: '',
    rescheduledTo: null
  },
  {
    id: 'o2',
    activityId: 'r1',
    date: getDateString(addDays(new Date(), -1)),
    startTime: '07:30',
    endTime: '08:00',
    assignedTeacherIds: ['t6'],
    status: 'completed',
    completedBy: 'Admin',
    completedAt: new Date().toISOString(),
    notes: '',
    rescheduledTo: null
  }]
  );
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | 'all'>(
    'all'
  );
  const [filterAssignment, setFilterAssignment] = useState<
    AssignmentType | 'all'>(
    'all');
  const [filterMasterFranchise, setFilterMasterFranchise] = useState('all');
  const [filterCentre, setFilterCentre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [showOccurrencesModal, setShowOccurrencesModal] = useState<
    string | null>(
    null);
  const [showSkipModal, setShowSkipModal] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] =
  useState<RecurringActivity | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [skipDate, setSkipDate] = useState('');
  const [skipReason, setSkipReason] = useState('');
  const [activityForm, setActivityForm] = useState<Partial<RecurringActivity>>({
    name: '',
    description: '',
    type: 'duty',
    location: '',
    startTime: '09:00',
    endTime: '10:00',
    recurrenceType: 'weekly',
    weekDays: [],
    monthDay: 1,
    monthWeek: 1,
    monthWeekDay: 1,
    yearMonth: 0,
    yearDay: 1,
    customPattern: '',
    interval: 1,
    startDate: '',
    endDate: '',
    assignmentType: 'individual',
    assignedTeacherIds: [],
    rotatingTeacherIds: [],
    departmentId: '',
    status: 'active',
    priority: 'medium',
    reminderMinutes: [15],
    notes: ''
  });
  const stats = useMemo(
    () => ({
      total: activities.length,
      active: activities.filter((a) => a.status === 'active').length,
      paused: activities.filter((a) => a.status === 'paused').length,
      daily: activities.filter(
        (a) => a.recurrenceType === 'daily' && a.status === 'active'
      ).length,
      rotating: activities.filter((a) => a.assignmentType === 'rotating').
      length
    }),
    [activities]
  );
  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      if (filterType !== 'all' && a.type !== filterType) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterAssignment !== 'all' && a.assignmentType !== filterAssignment)
      return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q));

      }
      return true;
    });
  }, [activities, filterType, filterStatus, filterAssignment, searchQuery]);
  const handleAddActivity = useCallback(() => {
    if (!activityForm.name || !activityForm.startDate) return;
    const newActivity: RecurringActivity = {
      id: generateId(),
      name: activityForm.name!,
      description: activityForm.description || '',
      type: activityForm.type as ActivityType,
      location: activityForm.location || '',
      startTime: activityForm.startTime!,
      endTime: activityForm.endTime || activityForm.startTime!,
      recurrenceType: activityForm.recurrenceType as RecurrenceType,
      weekDays: activityForm.weekDays || [],
      monthDay: activityForm.monthDay || 0,
      monthWeek: activityForm.monthWeek || 0,
      monthWeekDay: activityForm.monthWeekDay || 0,
      yearMonth: activityForm.yearMonth || 0,
      yearDay: activityForm.yearDay || 1,
      customPattern: activityForm.customPattern || '',
      interval: activityForm.interval || 1,
      startDate: activityForm.startDate!,
      endDate: activityForm.endDate || '',
      assignmentType: activityForm.assignmentType as AssignmentType,
      assignedTeacherIds: activityForm.assignedTeacherIds || [],
      rotatingTeacherIds: activityForm.rotatingTeacherIds || [],
      currentRotationIndex: 0,
      departmentId: activityForm.departmentId || '',
      status: 'active',
      priority: activityForm.priority as any || 'medium',
      reminderMinutes: activityForm.reminderMinutes || [15],
      notes: activityForm.notes || '',
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      skipDates: [],
      totalOccurrences: 0,
      completedOccurrences: 0
    };
    setActivities((prev) => [...prev, newActivity]);
    resetForm();
    setShowAddModal(false);
  }, [activityForm]);
  const handleUpdateActivity = useCallback(() => {
    if (!editingActivity) return;
    setActivities((prev) =>
    prev.map((a) =>
    a.id === editingActivity.id ?
    {
      ...editingActivity,
      updatedAt: new Date().toISOString()
    } :
    a
    )
    );
    setEditingActivity(null);
  }, [editingActivity]);
  const handleDeleteActivity = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this recurring activity?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setOccurrences((prev) => prev.filter((o) => o.activityId !== id));
      setShowDetailModal(null);
    }
  }, []);
  const handleToggleStatus = useCallback((id: string) => {
    setActivities((prev) =>
    prev.map((a) =>
    a.id === id ?
    {
      ...a,
      status: a.status === 'active' ? 'paused' : 'active',
      updatedAt: new Date().toISOString()
    } :
    a
    )
    );
  }, []);
  const handleSkipOccurrence = useCallback(() => {
    if (!showSkipModal || !skipDate) return;
    setActivities((prev) =>
    prev.map((a) =>
    a.id === showSkipModal ?
    {
      ...a,
      skipDates: [...a.skipDates, skipDate],
      updatedAt: new Date().toISOString()
    } :
    a
    )
    );
    setShowSkipModal(null);
    setSkipDate('');
    setSkipReason('');
  }, [showSkipModal, skipDate]);
  const handleRotateNext = useCallback((id: string) => {
    setActivities((prev) =>
    prev.map((a) => {
      if (a.id !== id || a.assignmentType !== 'rotating') return a;
      return {
        ...a,
        currentRotationIndex:
        (a.currentRotationIndex + 1) % a.rotatingTeacherIds.length,
        updatedAt: new Date().toISOString()
      };
    })
    );
  }, []);
  const handleDuplicate = useCallback((activity: RecurringActivity) => {
    const newActivity = {
      ...activity,
      id: generateId(),
      name: `${activity.name} (Copy)`,
      status: 'paused' as ActivityStatus,
      createdAt: new Date().toISOString(),
      skipDates: [],
      completedOccurrences: 0
    };
    setActivities((prev) => [...prev, newActivity]);
  }, []);
  const handleCompleteOccurrence = useCallback(
    (occurrenceId: string) => {
      setOccurrences((prev) =>
      prev.map((o) =>
      o.id === occurrenceId ?
      {
        ...o,
        status: 'completed' as OccurrenceStatus,
        completedBy: 'Admin',
        completedAt: new Date().toISOString()
      } :
      o
      )
      );
      const occ = occurrences.find((o) => o.id === occurrenceId);
      if (occ)
      setActivities((prev) =>
      prev.map((a) =>
      a.id === occ.activityId ?
      {
        ...a,
        completedOccurrences: a.completedOccurrences + 1
      } :
      a
      )
      );
    },
    [occurrences]
  );
  const resetForm = () => {
    setActivityForm({
      name: '',
      description: '',
      type: 'duty',
      location: '',
      startTime: '09:00',
      endTime: '10:00',
      recurrenceType: 'weekly',
      weekDays: [],
      monthDay: 1,
      monthWeek: 1,
      monthWeekDay: 1,
      yearMonth: 0,
      yearDay: 1,
      customPattern: '',
      interval: 1,
      startDate: '',
      endDate: '',
      assignmentType: 'individual',
      assignedTeacherIds: [],
      rotatingTeacherIds: [],
      departmentId: '',
      status: 'active',
      priority: 'medium',
      reminderMinutes: [15],
      notes: ''
    });
  };
  const toggleWeekDay = (day: number, isEditing: boolean) => {
    if (isEditing && editingActivity) {
      setEditingActivity((p) =>
      p ?
      {
        ...p,
        weekDays: p.weekDays.includes(day) ?
        p.weekDays.filter((d) => d !== day) :
        [...p.weekDays, day].sort()
      } :
      null
      );
    } else {
      setActivityForm((p) => ({
        ...p,
        weekDays: (p.weekDays || []).includes(day) ?
        (p.weekDays || []).filter((d) => d !== day) :
        [...(p.weekDays || []), day].sort()
      }));
    }
  };
  const toggleTeacher = (
  teacherId: string,
  field: 'assignedTeacherIds' | 'rotatingTeacherIds',
  isEditing: boolean) =>
  {
    if (isEditing && editingActivity) {
      setEditingActivity((p) =>
      p ?
      {
        ...p,
        [field]: p[field].includes(teacherId) ?
        p[field].filter((t) => t !== teacherId) :
        [...p[field], teacherId]
      } :
      null
      );
    } else {
      const current = activityForm[field] || [];
      setActivityForm((p) => ({
        ...p,
        [field]: current.includes(teacherId) ?
        current.filter((t) => t !== teacherId) :
        [...current, teacherId]
      }));
    }
  };
  const handleExport = useCallback(() => {
    const data = filteredActivities.map((a) => ({
      Name: a.name,
      Type: ACTIVITY_TYPES.find((t) => t.value === a.type)?.label,
      Frequency: getFrequencyText(a),
      Time: `${formatTime(a.startTime)} - ${formatTime(a.endTime)}`,
      Assignment: getAssignmentText(a),
      NextOccurrence: getNextOccurrence(a),
      Status: STATUS_CONFIG[a.status].label,
      Location: a.location
    }));
    const csv = [
    Object.keys(data[0] || {}).join(','),
    ...data.map((row) =>
    Object.values(row).
    map((v) => `"${v}"`).
    join(',')
    )].
    join('\n');
    const blob = new Blob([csv], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recurring_activities.csv';
    a.click();
  }, [filteredActivities]);
  const getCurrentRotationTeacher = (activity: RecurringActivity): string => {
    if (
    activity.assignmentType !== 'rotating' ||
    activity.rotatingTeacherIds.length === 0)

    return '-';
    const teacherId = activity.rotatingTeacherIds[activity.currentRotationIndex];
    return TEACHERS.find((t) => t.id === teacherId)?.shortName || '-';
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Recurring Activities
          </h1>
          <p className="text-sm text-gray-500">
            Manage repeating duties like daily assembly or weekly meetings
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}>
            
            <FilterIcon className="w-4 h-4 mr-1" />
            Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <PlusIcon className="w-4 h-4 mr-1" />
            New Recurring Duty
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
        {
          value: stats.total,
          label: 'Total Activities'
        },
        {
          value: stats.active,
          label: 'Active'
        },
        {
          value: stats.paused,
          label: 'Paused'
        },
        {
          value: stats.daily,
          label: 'Daily Duties'
        },
        {
          value: stats.rotating,
          label: 'Rotating Roster'
        }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      {showFilters &&
      <Card>
          <div className="flex flex-wrap gap-4 p-4">
            <Select
            label="Master Franchise"
            value={filterMasterFranchise}
            onChange={(e) => setFilterMasterFranchise(e.target.value)}
            className="w-40"
            options={MASTER_FRANCHISES} />
          
            <Select
            label="Centre"
            value={filterCentre}
            onChange={(e) => setFilterCentre(e.target.value)}
            className="w-40"
            options={CENTRES} />
          
            <Select
            label="Activity Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-40"
            options={[
            {
              value: 'all',
              label: 'All Types'
            },
            ...ACTIVITY_TYPES.map((t) => ({
              value: t.value,
              label: t.label
            }))]
            } />
          
            <Select
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-36"
            options={[
            {
              value: 'all',
              label: 'All Status'
            },
            ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({
              value: v,
              label: c.label
            }))]
            } />
          
            <Select
            label="Assignment"
            value={filterAssignment}
            onChange={(e) => setFilterAssignment(e.target.value as any)}
            className="w-44"
            options={[
            {
              value: 'all',
              label: 'All Assignments'
            },
            ...ASSIGNMENT_TYPES.map((t) => ({
              value: t.value,
              label: t.label
            }))]
            } />
          
            <div className="flex-1 min-w-48">
              <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              label="Search" />
            
            </div>
            <div className="flex items-end">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterType('all');
                setFilterStatus('all');
                setFilterAssignment('all');
                setFilterMasterFranchise('all');
                setFilterCentre('all');
                setSearchQuery('');
              }}>
              
                Clear
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Activities Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {[
                'Activity Name',
                'Frequency / Pattern',
                'Time',
                'Assigned To',
                'Next Occurrence',
                'Progress',
                'Status',
                'Actions'].
                map((h) =>
                <th
                  key={h}
                  className="text-left py-3 px-4 font-medium text-gray-600">
                  
                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ?
              <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No recurring activities found
                  </td>
                </tr> :

              filteredActivities.map((activity) => {
                const nextOcc = getNextOccurrence(activity);
                const progress =
                activity.totalOccurrences > 0 ?
                Math.round(
                  activity.completedOccurrences /
                  activity.totalOccurrences *
                  100
                ) :
                0;
                return (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-100 hover:bg-gray-50">
                    
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <RepeatIcon
                          className={`w-4 h-4 ${activity.status === 'active' ? 'text-blue-500' : 'text-gray-400'}`} />
                        
                          <div>
                            <p className="font-medium">{activity.name}</p>
                            <p className="text-xs text-gray-500">
                              {
                            ACTIVITY_TYPES.find(
                              (t) => t.value === activity.type
                            )?.label
                            }{' '}
                              • {activity.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">
                        {getFrequencyText(activity)}
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {formatTime(activity.startTime)} -{' '}
                        {formatTime(activity.endTime)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          {getAssignmentText(activity)}
                        </div>
                        {activity.assignmentType === 'rotating' &&
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                            <span>
                              Current: {getCurrentRotationTeacher(activity)}
                            </span>
                            <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRotateNext(activity.id)}
                          className="p-0.5">
                          
                              <RefreshCwIcon className="w-3 h-3" />
                            </Button>
                          </div>
                      }
                      </td>
                      <td className="py-3 px-4 text-blue-600 text-xs font-medium">
                        {nextOcc}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${progress}%`
                            }} />
                          
                          </div>
                          <span className="text-xs text-gray-500">
                            {activity.completedOccurrences}/
                            {activity.totalOccurrences}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={STATUS_CONFIG[activity.status].variant}>
                          {STATUS_CONFIG[activity.status].label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDetailModal(activity.id)}
                          title="View">
                          
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowOccurrencesModal(activity.id)}
                          title="History">
                          
                            <HistoryIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(activity.id)}
                          title={
                          activity.status === 'active' ? 'Pause' : 'Resume'
                          }>
                          
                            {activity.status === 'active' ?
                          <PauseIcon className="w-4 h-4 text-orange-500" /> :

                          <PlayIcon className="w-4 h-4 text-green-500" />
                          }
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSkipModal(activity.id)}
                          title="Skip">
                          
                            <SkipForwardIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingActivity(activity)}
                          title="Edit">
                          
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}
                          title="Delete">
                          
                            <TrashIcon className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>);

              })
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {(showAddModal || editingActivity) &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {editingActivity ?
              'Edit Recurring Activity' :
              'New Recurring Duty'}
              </h3>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAddModal(false);
                setEditingActivity(null);
              }}>
              
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <Input
              label="Activity Name *"
              value={editingActivity?.name || activityForm.name}
              onChange={(e) =>
              editingActivity ?
              setEditingActivity((p) =>
              p ?
              {
                ...p,
                name: e.target.value
              } :
              null
              ) :
              setActivityForm((p) => ({
                ...p,
                name: e.target.value
              }))
              }
              placeholder="Morning Assembly Duty" />
            

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Activity Type"
                value={editingActivity?.type || activityForm.type}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  type: e.target.value as ActivityType
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  type: e.target.value as ActivityType
                }))
                }
                options={ACTIVITY_TYPES.map((t) => ({
                  value: t.value,
                  label: t.label
                }))} />
              
                <Input
                label="Location"
                value={editingActivity?.location || activityForm.location}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  location: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  location: e.target.value
                }))
                }
                placeholder="Main Ground" />
              
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                type="time"
                label="Start Time *"
                value={editingActivity?.startTime || activityForm.startTime}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  startTime: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  startTime: e.target.value
                }))
                } />
              
                <Input
                type="time"
                label="End Time"
                value={editingActivity?.endTime || activityForm.endTime}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  endTime: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  endTime: e.target.value
                }))
                } />
              
                <Select
                label="Priority"
                value={editingActivity?.priority || activityForm.priority}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  priority: e.target.value as any
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  priority: e.target.value as any
                }))
                }
                options={[
                {
                  value: 'low',
                  label: 'Low'
                },
                {
                  value: 'medium',
                  label: 'Medium'
                },
                {
                  value: 'high',
                  label: 'High'
                }]
                } />
              
              </div>

              {/* Recurrence Pattern */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <RepeatIcon className="w-4 h-4" />
                  Recurrence Pattern
                </h4>
                <Select
                label="Frequency"
                value={
                editingActivity?.recurrenceType ||
                activityForm.recurrenceType
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  recurrenceType: e.target.
                  value as RecurrenceType
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  recurrenceType: e.target.value as RecurrenceType
                }))
                }
                options={RECURRENCE_TYPES.map((r) => ({
                  value: r.value,
                  label: `${r.label} - ${r.description}`
                }))} />
              

                {['daily', 'weekly', 'biweekly'].includes(
                editingActivity?.recurrenceType ||
                activityForm.recurrenceType ||
                ''
              ) &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days of Week
                    </label>
                    <div className="flex gap-2">
                      {DAYS.map((day, i) => {
                    const selected = editingActivity ?
                    editingActivity.weekDays.includes(i) :
                    (activityForm.weekDays || []).includes(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleWeekDay(i, !!editingActivity)}
                        className={`w-10 h-10 rounded-full text-sm font-medium ${selected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        
                            {day.charAt(0)}
                          </button>);

                  })}
                    </div>
                  </div>
              }

                {(editingActivity?.recurrenceType ||
              activityForm.recurrenceType) === 'monthly' &&
              <div className="grid grid-cols-2 gap-4">
                    <Input
                  type="number"
                  label="Day of Month (1-31, 0 for week-based)"
                  value={editingActivity?.monthDay ?? activityForm.monthDay}
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    monthDay: parseInt(e.target.value) || 0
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    monthDay: parseInt(e.target.value) || 0
                  }))
                  }
                  min={0}
                  max={31} />
                
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                    label="Week"
                    value={
                    editingActivity?.monthWeek ?? activityForm.monthWeek
                    }
                    onChange={(e) =>
                    editingActivity ?
                    setEditingActivity((p) =>
                    p ?
                    {
                      ...p,
                      monthWeek: parseInt(e.target.value)
                    } :
                    null
                    ) :
                    setActivityForm((p) => ({
                      ...p,
                      monthWeek: parseInt(e.target.value)
                    }))
                    }
                    options={[
                    {
                      value: 0,
                      label: 'N/A'
                    },
                    ...WEEK_OPTIONS.map((w) => ({
                      value: w.value,
                      label: w.label
                    }))]
                    } />
                  
                      <Select
                    label="Day"
                    value={
                    editingActivity?.monthWeekDay ??
                    activityForm.monthWeekDay
                    }
                    onChange={(e) =>
                    editingActivity ?
                    setEditingActivity((p) =>
                    p ?
                    {
                      ...p,
                      monthWeekDay: parseInt(e.target.value)
                    } :
                    null
                    ) :
                    setActivityForm((p) => ({
                      ...p,
                      monthWeekDay: parseInt(e.target.value)
                    }))
                    }
                    options={DAYS.map((d, i) => ({
                      value: i,
                      label: d
                    }))} />
                  
                    </div>
                  </div>
              }

                {(editingActivity?.recurrenceType ||
              activityForm.recurrenceType) === 'yearly' &&
              <div className="grid grid-cols-2 gap-4">
                    <Select
                  label="Month"
                  value={
                  editingActivity?.yearMonth ?? activityForm.yearMonth
                  }
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    yearMonth: parseInt(e.target.value)
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    yearMonth: parseInt(e.target.value)
                  }))
                  }
                  options={MONTHS.map((m, i) => ({
                    value: i,
                    label: m
                  }))} />
                
                    <Input
                  type="number"
                  label="Day"
                  value={editingActivity?.yearDay ?? activityForm.yearDay}
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    yearDay: parseInt(e.target.value) || 1
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    yearDay: parseInt(e.target.value) || 1
                  }))
                  }
                  min={1}
                  max={31} />
                
                  </div>
              }

                <div className="grid grid-cols-2 gap-4">
                  <Input
                  type="date"
                  label="Start Date *"
                  value={editingActivity?.startDate || activityForm.startDate}
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    startDate: e.target.value
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    startDate: e.target.value
                  }))
                  } />
                
                  <Input
                  type="date"
                  label="End Date (Optional)"
                  value={editingActivity?.endDate || activityForm.endDate}
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    endDate: e.target.value
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    endDate: e.target.value
                  }))
                  } />
                
                </div>
              </div>

              {/* Assignment */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" />
                  Assignment
                </h4>
                <Select
                label="Assignment Type"
                value={
                editingActivity?.assignmentType ||
                activityForm.assignmentType
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  assignmentType: e.target.
                  value as AssignmentType
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  assignmentType: e.target.value as AssignmentType
                }))
                }
                options={ASSIGNMENT_TYPES.map((a) => ({
                  value: a.value,
                  label: a.label
                }))} />
              

                {['individual', 'custom_group'].includes(
                editingActivity?.assignmentType ||
                activityForm.assignmentType ||
                ''
              ) &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Teachers
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                      {TEACHERS.map((t) => {
                    const selected = editingActivity ?
                    editingActivity.assignedTeacherIds.includes(t.id) :
                    (activityForm.assignedTeacherIds || []).includes(
                      t.id
                    );
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                        toggleTeacher(
                          t.id,
                          'assignedTeacherIds',
                          !!editingActivity
                        )
                        }
                        className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                        
                            {t.shortName}
                          </button>);

                  })}
                    </div>
                  </div>
              }

                {(editingActivity?.assignmentType ||
              activityForm.assignmentType) === 'rotating' &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation Roster (select teachers in rotation order)
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                      {TEACHERS.map((t) => {
                    const selected = editingActivity ?
                    editingActivity.rotatingTeacherIds.includes(t.id) :
                    (activityForm.rotatingTeacherIds || []).includes(
                      t.id
                    );
                    const index = editingActivity ?
                    editingActivity.rotatingTeacherIds.indexOf(t.id) :
                    (activityForm.rotatingTeacherIds || []).indexOf(
                      t.id
                    );
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                        toggleTeacher(
                          t.id,
                          'rotatingTeacherIds',
                          !!editingActivity
                        )
                        }
                        className={`px-2 py-1 text-xs rounded border relative ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                        
                            {selected &&
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                {index + 1}
                              </span>
                        }
                            {t.shortName}
                          </button>);

                  })}
                    </div>
                  </div>
              }

                {(editingActivity?.assignmentType ||
              activityForm.assignmentType) === 'department' &&
              <Select
                label="Department"
                value={
                editingActivity?.departmentId || activityForm.departmentId
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  departmentId: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  departmentId: e.target.value
                }))
                }
                options={[
                {
                  value: '',
                  label: '-- Select --'
                },
                ...DEPARTMENTS.map((d) => ({
                  value: d.id,
                  label: d.name
                }))]
                } />

              }
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                value={
                editingActivity?.description || activityForm.description
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  description: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  description: e.target.value
                }))
                }
                placeholder="Activity description..."
                className="w-full px-3 py-2 border rounded-md text-sm"
                rows={2} />
              
              </div>

              <Input
              label="Notes"
              value={editingActivity?.notes || activityForm.notes}
              onChange={(e) =>
              editingActivity ?
              setEditingActivity((p) =>
              p ?
              {
                ...p,
                notes: e.target.value
              } :
              null
              ) :
              setActivityForm((p) => ({
                ...p,
                notes: e.target.value
              }))
              }
              placeholder="Additional notes" />
            
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setEditingActivity(null);
              }}>
              
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={
              editingActivity ? handleUpdateActivity : handleAddActivity
              }>
              
                {editingActivity ? 'Update' : 'Create'} Activity
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal &&
      (() => {
        const activity = activities.find((a) => a.id === showDetailModal);
        if (!activity) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <RepeatIcon className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-lg">{activity.name}</h3>
                  </div>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetailModal(null)}>
                  
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_CONFIG[activity.status].variant}>
                      {STATUS_CONFIG[activity.status].label}
                    </Badge>
                    <Badge variant="default">
                      {
                    ACTIVITY_TYPES.find((t) => t.value === activity.type)?.
                    label
                    }
                    </Badge>
                    <Badge variant="default">
                      {activity.priority} priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">
                          {formatTime(activity.startTime)} -{' '}
                          {formatTime(activity.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">
                          {activity.location || '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RepeatIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Pattern</p>
                      <p className="font-medium">
                        {getFrequencyText(activity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">
                        {formatDate(activity.startDate)} -{' '}
                        {activity.endDate ?
                      formatDate(activity.endDate) :
                      'No end date'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-gray-500">Assignment</p>
                    <p className="font-medium">{getAssignmentText(activity)}</p>
                    {activity.assignmentType === 'rotating' &&
                  <p className="text-xs text-blue-600">
                        Current: {getCurrentRotationTeacher(activity)} (Position{' '}
                        {activity.currentRotationIndex + 1})
                      </p>
                  }
                  </div>

                  <div>
                    <p className="text-gray-500">Next Occurrence</p>
                    <p className="font-medium text-blue-600">
                      {getNextOccurrence(activity)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Progress</p>
                    <p className="font-medium">
                      {activity.completedOccurrences} /{' '}
                      {activity.totalOccurrences} occurrences completed
                    </p>
                  </div>

                  {activity.skipDates.length > 0 &&
                <div>
                      <p className="text-gray-500">
                        Skipped Dates ({activity.skipDates.length})
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activity.skipDates.map((d) =>
                    <Badge key={d} variant="warning">
                            {formatDate(d)}
                          </Badge>
                    )}
                      </div>
                    </div>
                }

                  {activity.description &&
                <div>
                      <p className="text-gray-500">Description</p>
                      <p>{activity.description}</p>
                    </div>
                }
                  {activity.notes &&
                <div>
                      <p className="text-gray-500">Notes</p>
                      <p className="text-gray-600">{activity.notes}</p>
                    </div>
                }

                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Created: {formatDate(activity.createdAt)} • Updated:{' '}
                    {formatDate(activity.updatedAt)}
                  </div>
                </div>
                <div className="p-4 border-t flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(activity.id)}>
                    
                      {activity.status === 'active' ?
                    <>
                          <PauseIcon className="w-4 h-4 mr-1" />
                          Pause
                        </> :

                    <>
                          <PlayIcon className="w-4 h-4 mr-1" />
                          Resume
                        </>
                    }
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(activity)}>
                    
                      <CopyIcon className="w-4 h-4 mr-1" />
                      Duplicate
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteActivity(activity.id)}>
                    
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                    <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setShowDetailModal(null);
                      setEditingActivity(activity);
                    }}>
                    
                      <EditIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </Card>
            </div>);

      })()}

      {/* Occurrences Modal */}
      {showOccurrencesModal &&
      (() => {
        const activity = activities.find((a) => a.id === showOccurrencesModal);
        const activityOccurrences = occurrences.
        filter((o) => o.activityId === showOccurrencesModal).
        sort((a, b) => b.date.localeCompare(a.date));
        if (!activity) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-lg">
                    {activity.name} - Occurrence History
                  </h3>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOccurrencesModal(null)}>
                  
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-4">
                  {activityOccurrences.length === 0 ?
                <p className="text-center text-gray-500 py-8">
                      No occurrence history
                    </p> :

                <div className="space-y-2">
                      {activityOccurrences.map((occ) =>
                  <div
                    key={occ.id}
                    className="flex items-center justify-between p-3 border rounded-lg">
                    
                          <div>
                            <p className="font-medium">
                              {formatDate(occ.date)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatTime(occ.startTime)} -{' '}
                              {formatTime(occ.endTime)}
                            </p>
                            <div className="flex gap-1 mt-1">
                              {occ.assignedTeacherIds.map((id) =>
                        <span
                          key={id}
                          className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                          
                                  {TEACHERS.find((t) => t.id === id)?.shortName}
                                </span>
                        )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                        variant={OCCURRENCE_STATUS[occ.status].variant}>
                        
                              {OCCURRENCE_STATUS[occ.status].label}
                            </Badge>
                            {occ.status === 'scheduled' &&
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompleteOccurrence(occ.id)}>
                        
                                <CheckIcon className="w-4 h-4 text-green-500" />
                              </Button>
                      }
                          </div>
                        </div>
                  )}
                    </div>
                }
                </div>
                <div className="p-4 border-t flex justify-end">
                  <Button
                  variant="outline"
                  onClick={() => setShowOccurrencesModal(null)}>
                  
                    Close
                  </Button>
                </div>
              </Card>
            </div>);

      })()}

      {/* Skip Modal */}
      {showSkipModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">Skip Occurrence</h3>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSkipModal(null)}>
              
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <Input
              type="date"
              label="Date to Skip *"
              value={skipDate}
              onChange={(e) => setSkipDate(e.target.value)} />
            
              <Input
              label="Reason (Optional)"
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              placeholder="Holiday, Special event, etc." />
            
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSkipModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSkipOccurrence}>
                Skip Date
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}