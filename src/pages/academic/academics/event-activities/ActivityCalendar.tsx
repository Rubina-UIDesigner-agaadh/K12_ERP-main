import React, {
  useCallback,
  useMemo,
  useState,
  Fragment,
  createElement } from
'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  CalendarIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  FilterIcon,
  DownloadIcon,
  PrinterIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  RepeatIcon,
  SearchIcon,
  CheckIcon,
  AlertTriangleIcon,
  BookOpenIcon,
  ShieldIcon,
  MessageSquareIcon,
  PartyPopperIcon,
  CoffeeIcon,
  ClipboardListIcon,
  UserIcon,
  BellIcon,
  CopyIcon } from
'lucide-react';
type ActivityType =
'teaching' |
'supervision' |
'meeting' |
'event' |
'training' |
'duty' |
'break' |
'planning' |
'other';
type ActivityStatus =
'scheduled' |
'ongoing' |
'completed' |
'cancelled' |
'rescheduled';
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
type ViewMode = 'day' | 'week' | 'month';
type Teacher = {
  id: string;
  name: string;
  shortName: string;
  department: string;
  subjects: string[];
};
type TimeSlot = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
};
type Department = {
  id: string;
  name: string;
  head: string;
};
type Activity = {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  teacherIds: string[];
  department: string;
  status: ActivityStatus;
  isRecurring: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate: string;
  priority: 'low' | 'medium' | 'high';
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  relatedClass?: string;
  reminders: number[];
};
const ACTIVITY_TYPES: {
  value: ActivityType;
  label: string;
  icon: any;
  color: string;
}[] = [
{
  value: 'teaching',
  label: 'Teaching',
  icon: BookOpenIcon,
  color: 'bg-blue-100 text-blue-700 border-blue-200'
},
{
  value: 'supervision',
  label: 'Supervision Duty',
  icon: ShieldIcon,
  color: 'bg-orange-100 text-orange-700 border-orange-200'
},
{
  value: 'meeting',
  label: 'Meeting',
  icon: MessageSquareIcon,
  color: 'bg-purple-100 text-purple-700 border-purple-200'
},
{
  value: 'event',
  label: 'Event',
  icon: PartyPopperIcon,
  color: 'bg-green-100 text-green-700 border-green-200'
},
{
  value: 'training',
  label: 'Training',
  icon: UsersIcon,
  color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
},
{
  value: 'duty',
  label: 'Special Duty',
  icon: ClipboardListIcon,
  color: 'bg-red-100 text-red-700 border-red-200'
},
{
  value: 'break',
  label: 'Break',
  icon: CoffeeIcon,
  color: 'bg-gray-100 text-gray-700 border-gray-200'
},
{
  value: 'planning',
  label: 'Planning/Prep',
  icon: ClipboardListIcon,
  color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
},
{
  value: 'other',
  label: 'Other',
  icon: CalendarIcon,
  color: 'bg-slate-100 text-slate-700 border-slate-200'
}];

const STATUS_CONFIG: Record<
  ActivityStatus,
  {
    label: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  }> =
{
  scheduled: {
    label: 'Scheduled',
    variant: 'info'
  },
  ongoing: {
    label: 'Ongoing',
    variant: 'warning'
  },
  completed: {
    label: 'Completed',
    variant: 'success'
  },
  cancelled: {
    label: 'Cancelled',
    variant: 'error'
  },
  rescheduled: {
    label: 'Rescheduled',
    variant: 'default'
  }
};
const TIME_SLOTS: TimeSlot[] = [
{
  id: 'ts1',
  label: '07:00',
  startTime: '07:00',
  endTime: '08:00'
},
{
  id: 'ts2',
  label: '08:00',
  startTime: '08:00',
  endTime: '09:00'
},
{
  id: 'ts3',
  label: '09:00',
  startTime: '09:00',
  endTime: '10:00'
},
{
  id: 'ts4',
  label: '10:00',
  startTime: '10:00',
  endTime: '11:00'
},
{
  id: 'ts5',
  label: '11:00',
  startTime: '11:00',
  endTime: '12:00'
},
{
  id: 'ts6',
  label: '12:00',
  startTime: '12:00',
  endTime: '13:00'
},
{
  id: 'ts7',
  label: '13:00',
  startTime: '13:00',
  endTime: '14:00'
},
{
  id: 'ts8',
  label: '14:00',
  startTime: '14:00',
  endTime: '15:00'
},
{
  id: 'ts9',
  label: '15:00',
  startTime: '15:00',
  endTime: '16:00'
},
{
  id: 'ts10',
  label: '16:00',
  startTime: '16:00',
  endTime: '17:00'
},
{
  id: 'ts11',
  label: '17:00',
  startTime: '17:00',
  endTime: '18:00'
}];

const TEACHERS: Teacher[] = [
{
  id: 't1',
  name: 'Ankit Gupta',
  shortName: 'A. Gupta',
  department: 'Science',
  subjects: ['Physics', 'Science']
},
{
  id: 't2',
  name: 'Kavita Devi',
  shortName: 'K. Devi',
  department: 'Languages',
  subjects: ['Hindi', 'Sanskrit']
},
{
  id: 't3',
  name: 'Mohan Verma',
  shortName: 'M. Verma',
  department: 'Science',
  subjects: ['Biology', 'Science']
},
{
  id: 't4',
  name: 'Sunita Patel',
  shortName: 'S. Patel',
  department: 'Science',
  subjects: ['Chemistry']
},
{
  id: 't5',
  name: 'Rajesh Sharma',
  shortName: 'R. Sharma',
  department: 'Mathematics',
  subjects: ['Mathematics']
},
{
  id: 't6',
  name: 'Vinod Kumar',
  shortName: 'V. Kumar',
  department: 'Social Studies',
  subjects: ['History', 'Geography']
},
{
  id: 't7',
  name: 'Priya Joshi',
  shortName: 'P. Joshi',
  department: 'Languages',
  subjects: ['English']
},
{
  id: 't8',
  name: 'Deepak Singh',
  shortName: 'D. Singh',
  department: 'Computer',
  subjects: ['Computer Science']
}];

const DEPARTMENTS: Department[] = [
{
  id: 'd1',
  name: 'Science',
  head: 'Dr. Singh'
},
{
  id: 'd2',
  name: 'Mathematics',
  head: 'Mr. Sharma'
},
{
  id: 'd3',
  name: 'Languages',
  head: 'Mrs. Joshi'
},
{
  id: 'd4',
  name: 'Social Studies',
  head: 'Mr. Kumar'
},
{
  id: 'd5',
  name: 'Computer',
  head: 'Mr. Singh'
},
{
  id: 'd6',
  name: 'Administration',
  head: 'Principal'
}];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = [
'Sunday',
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'];

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

const CLASSES_LIST = [
'I',
'II',
'III',
'IV',
'V',
'VI',
'VII',
'VIII',
'IX',
'X',
'XI',
'XII'];

const BRANCHES_LIST = [
'Main Campus',
'North Branch',
'South Branch',
'East Wing',
'West Campus'];

const STAFFS_LIST = [
'R. Sharma',
'A. Gupta',
'M. Singh',
'S. Patel',
'P. Kumar',
'V. Verma',
'K. Devi',
'D. Singh'];

const generateId = () =>
`${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const formatDate = (date: string) =>
new Date(date).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const formatDateShort = (date: string) =>
new Date(date).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short'
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
const getWeekDates = (date: Date) => {
  const day = date.getDay();
  const start = addDays(date, -day);
  return Array.from(
    {
      length: 7
    },
    (_, i) => addDays(start, i)
  );
};
const getDaysInMonth = (year: number, month: number) =>
new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
new Date(year, month, 1).getDay();
const getActivityStatus = (activity: Activity): ActivityStatus => {
  if (activity.status === 'cancelled' || activity.status === 'rescheduled')
  return activity.status;
  const now = new Date();
  const activityDate = new Date(activity.date);
  const startDateTime = new Date(`${activity.date}T${activity.startTime}`);
  const endDateTime = new Date(`${activity.date}T${activity.endTime}`);
  if (now > endDateTime) return 'completed';
  if (now >= startDateTime && now <= endDateTime) return 'ongoing';
  return 'scheduled';
};
export function ActivityCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<ActivityStatus | 'all'>(
    'all'
  );
  const [filterMasterFranchise, setFilterMasterFranchise] = useState('all');
  const [filterCentre, setFilterCentre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([
  {
    id: 'a1',
    title: 'Physics Class - XI Sci',
    description: 'Regular physics lecture',
    type: 'teaching',
    date: getDateString(today),
    startTime: '08:00',
    endTime: '08:45',
    location: 'Room 101',
    teacherIds: ['t1'],
    department: 'Science',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'weekly',
    recurrenceEndDate: '2026-12-31',
    priority: 'high',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedClass: 'XI-Sci',
    reminders: [15]
  },
  {
    id: 'a2',
    title: 'Morning Assembly Duty',
    description: 'Supervision during morning assembly',
    type: 'supervision',
    date: getDateString(today),
    startTime: '07:30',
    endTime: '08:00',
    location: 'Main Ground',
    teacherIds: ['t2', 't3'],
    department: 'Administration',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'daily',
    recurrenceEndDate: '2026-12-31',
    priority: 'medium',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [30]
  },
  {
    id: 'a3',
    title: 'Staff Meeting',
    description: 'Weekly staff meeting',
    type: 'meeting',
    date: getDateString(today),
    startTime: '15:00',
    endTime: '16:00',
    location: 'Conference Room',
    teacherIds: ['t1', 't2', 't3', 't4', 't5'],
    department: 'Administration',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'weekly',
    recurrenceEndDate: '2026-12-31',
    priority: 'high',
    notes: 'Agenda: Exam preparation',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [60, 15]
  },
  {
    id: 'a4',
    title: 'Science Fair Prep',
    description: 'Preparation for annual science fair',
    type: 'event',
    date: getDateString(addDays(today, 1)),
    startTime: '14:00',
    endTime: '16:00',
    location: 'Science Lab',
    teacherIds: ['t1', 't3', 't4'],
    department: 'Science',
    status: 'scheduled',
    isRecurring: false,
    recurrence: 'none',
    recurrenceEndDate: '',
    priority: 'high',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [60]
  },
  {
    id: 'a5',
    title: 'Computer Lab Duty',
    description: 'Lab supervision during free periods',
    type: 'duty',
    date: getDateString(today),
    startTime: '10:00',
    endTime: '11:00',
    location: 'Computer Lab',
    teacherIds: ['t8'],
    department: 'Computer',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'daily',
    recurrenceEndDate: '2026-12-31',
    priority: 'medium',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [15]
  },
  {
    id: 'a6',
    title: 'Teacher Training',
    description: 'Digital tools workshop',
    type: 'training',
    date: getDateString(addDays(today, 2)),
    startTime: '09:00',
    endTime: '12:00',
    location: 'Auditorium',
    teacherIds: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
    department: 'Administration',
    status: 'scheduled',
    isRecurring: false,
    recurrence: 'none',
    recurrenceEndDate: '',
    priority: 'high',
    notes: 'Mandatory for all teachers',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [1440, 60]
  },
  {
    id: 'a7',
    title: 'Lunch Break',
    description: '',
    type: 'break',
    date: getDateString(today),
    startTime: '12:30',
    endTime: '13:30',
    location: 'Staff Room',
    teacherIds: [],
    department: 'Administration',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'daily',
    recurrenceEndDate: '2026-12-31',
    priority: 'low',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: []
  },
  {
    id: 'a8',
    title: 'Lesson Planning',
    description: 'Weekly lesson planning session',
    type: 'planning',
    date: getDateString(addDays(today, 3)),
    startTime: '14:00',
    endTime: '15:00',
    location: 'Staff Room',
    teacherIds: ['t5'],
    department: 'Mathematics',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'weekly',
    recurrenceEndDate: '2026-12-31',
    priority: 'medium',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [30]
  },
  {
    id: 'a9',
    title: 'Hindi Class - VIII A',
    description: '',
    type: 'teaching',
    date: getDateString(today),
    startTime: '09:00',
    endTime: '09:45',
    location: 'Room 205',
    teacherIds: ['t2'],
    department: 'Languages',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'weekly',
    recurrenceEndDate: '2026-12-31',
    priority: 'high',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedClass: 'VIII-A',
    reminders: [15]
  },
  {
    id: 'a10',
    title: 'Bus Duty - Departure',
    description: 'Supervise student departure',
    type: 'supervision',
    date: getDateString(today),
    startTime: '15:30',
    endTime: '16:00',
    location: 'Bus Stand',
    teacherIds: ['t6'],
    department: 'Administration',
    status: 'scheduled',
    isRecurring: true,
    recurrence: 'daily',
    recurrenceEndDate: '2026-12-31',
    priority: 'high',
    notes: '',
    createdBy: 'Admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminders: [15]
  }]
  );
  const [activityForm, setActivityForm] = useState<
    Partial<Activity> & {
      classes?: string[];
      branches?: string[];
      staffs?: string[];
    }>(
    {
      title: '',
      description: '',
      type: 'teaching',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      location: '',
      teacherIds: [],
      department: '',
      status: 'scheduled',
      isRecurring: false,
      recurrence: 'none',
      recurrenceEndDate: '',
      priority: 'medium',
      notes: '',
      relatedClass: '',
      classes: [],
      branches: [],
      staffs: []
    });
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear(),
      month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month),
      firstDay = getFirstDayOfMonth(year, month);
    const days: {
      date: Date;
      isCurrentMonth: boolean;
    }[] = [];
    const prevMonth = month === 0 ? 11 : month - 1,
      prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
    for (let i = firstDay - 1; i >= 0; i--)
    days.push({
      date: new Date(prevYear, prevMonth, prevMonthDays - i),
      isCurrentMonth: false
    });
    for (let d = 1; d <= daysInMonth; d++)
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true
    });
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++)
    days.push({
      date: new Date(
        month === 11 ? year + 1 : year,
        month === 11 ? 0 : month + 1,
        d
      ),
      isCurrentMonth: false
    });
    return days;
  }, [currentDate]);
  const getActivitiesForDate = useCallback(
    (date: string) => {
      return activities.filter(
        (a) => a.date === date && a.status !== 'cancelled'
      );
    },
    [activities]
  );
  const getActivitiesForSlot = useCallback(
    (date: string, startTime: string) => {
      return activities.filter(
        (a) =>
        a.date === date &&
        a.startTime <= startTime &&
        a.endTime > startTime &&
        a.status !== 'cancelled'
      );
    },
    [activities]
  );
  const filteredActivities = useMemo(() => {
    return activities.
    filter((a) => {
      if (filterType !== 'all' && a.type !== filterType) return false;
      if (filterDepartment !== 'all' && a.department !== filterDepartment)
      return false;
      if (filterTeacher !== 'all' && !a.teacherIds.includes(filterTeacher))
      return false;
      if (filterStatus !== 'all' && getActivityStatus(a) !== filterStatus)
      return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q));

      }
      return true;
    }).
    sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)
    );
  }, [
  activities,
  filterType,
  filterDepartment,
  filterTeacher,
  filterStatus,
  searchQuery]
  );
  const stats = useMemo(() => {
    const todayStr = getDateString(today);
    const todayActivities = activities.filter((a) => a.date === todayStr);
    const weekStart = getDateString(weekDates[0]),
      weekEnd = getDateString(weekDates[6]);
    const weekActivities = activities.filter(
      (a) => a.date >= weekStart && a.date <= weekEnd
    );
    return {
      todayTotal: todayActivities.length,
      todayTeaching: todayActivities.filter((a) => a.type === 'teaching').
      length,
      todayMeetings: todayActivities.filter((a) => a.type === 'meeting').length,
      weekTotal: weekActivities.length,
      recurringCount: activities.filter((a) => a.isRecurring).length
    };
  }, [activities, weekDates]);
  const navigate = (delta: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') newDate.setDate(newDate.getDate() + delta);else
    if (viewMode === 'week') newDate.setDate(newDate.getDate() + delta * 7);else
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentDate(newDate);
  };
  const goToToday = () => setCurrentDate(new Date());
  const handleAddActivity = useCallback(() => {
    if (!activityForm.title || !activityForm.date || !activityForm.startTime)
    return;
    const newActivity: Activity = {
      id: generateId(),
      title: activityForm.title!,
      description: activityForm.description || '',
      type: activityForm.type as ActivityType,
      date: activityForm.date!,
      startTime: activityForm.startTime!,
      endTime: activityForm.endTime || activityForm.startTime!,
      location: activityForm.location || '',
      teacherIds: activityForm.teacherIds || [],
      department: activityForm.department || '',
      status: 'scheduled',
      isRecurring: activityForm.isRecurring || false,
      recurrence: activityForm.recurrence as RecurrenceType || 'none',
      recurrenceEndDate: activityForm.recurrenceEndDate || '',
      priority: activityForm.priority as any || 'medium',
      notes: activityForm.notes || '',
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedClass: activityForm.relatedClass,
      reminders: [15]
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
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
      setShowDetailModal(null);
    }
  }, []);
  const handleCancelActivity = useCallback((id: string) => {
    setActivities((prev) =>
    prev.map((a) =>
    a.id === id ?
    {
      ...a,
      status: 'cancelled' as ActivityStatus
    } :
    a
    )
    );
  }, []);
  const handleDuplicateActivity = useCallback((activity: Activity) => {
    const newActivity = {
      ...activity,
      id: generateId(),
      title: `${activity.title} (Copy)`,
      status: 'scheduled' as ActivityStatus,
      createdAt: new Date().toISOString()
    };
    setActivities((prev) => [...prev, newActivity]);
  }, []);
  const resetForm = () => {
    setActivityForm({
      title: '',
      description: '',
      type: 'teaching',
      date: selectedSlot?.date || '',
      startTime: selectedSlot?.time || '09:00',
      endTime: '',
      location: '',
      teacherIds: [],
      department: '',
      status: 'scheduled',
      isRecurring: false,
      recurrence: 'none',
      recurrenceEndDate: '',
      priority: 'medium',
      notes: '',
      relatedClass: '',
      classes: [],
      branches: [],
      staffs: []
    });
    setSelectedSlot(null);
  };
  const openAddModal = (date?: string, time?: string) => {
    resetForm();
    if (date)
    setActivityForm((p) => ({
      ...p,
      date,
      startTime: time || '09:00'
    }));
    setShowAddModal(true);
  };
  const toggleTeacherSelection = (teacherId: string) => {
    const current = activityForm.teacherIds || [];
    setActivityForm((p) => ({
      ...p,
      teacherIds: current.includes(teacherId) ?
      current.filter((t) => t !== teacherId) :
      [...current, teacherId]
    }));
  };
  const toggleSelection = (
  item: string,
  field: 'classes' | 'branches' | 'staffs') =>
  {
    setActivityForm((prev) => {
      const current = prev[field] || [];
      return {
        ...prev,
        [field]: current.includes(item) ?
        current.filter((i) => i !== item) :
        [...current, item]
      };
    });
  };
  const handleExport = useCallback(() => {
    const data = filteredActivities.map((a) => ({
      Title: a.title,
      Type: ACTIVITY_TYPES.find((t) => t.value === a.type)?.label,
      Date: formatDate(a.date),
      Time: `${formatTime(a.startTime)} - ${formatTime(a.endTime)}`,
      Location: a.location,
      Teachers: a.teacherIds.
      map((id) => TEACHERS.find((t) => t.id === id)?.name).
      join(', '),
      Department: a.department,
      Status: STATUS_CONFIG[getActivityStatus(a)].label,
      Recurring: a.isRecurring ? 'Yes' : 'No'
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
    a.download = `activities_${getDateString(currentDate)}.csv`;
    a.click();
  }, [filteredActivities, currentDate]);
  const getActivityTypeConfig = (type: ActivityType) =>
  ACTIVITY_TYPES.find((t) => t.value === type) ||
  ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];
  const getViewTitle = () => {
    if (viewMode === 'day') return formatDate(getDateString(currentDate));
    if (viewMode === 'week')
    return `${formatDateShort(getDateString(weekDates[0]))} - ${formatDateShort(getDateString(weekDates[6]))}, ${currentDate.getFullYear()}`;
    return `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Activity Calendar
          </h1>
          <p className="text-sm text-gray-500">
            Weekly view of all teacher duties and non-teaching activities
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
          <Button variant="primary" onClick={() => openAddModal()}>
            <PlusIcon className="w-4 h-4 mr-1" />
            Add Activity
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
        {
          value: stats.todayTotal,
          label: "Today's Activities"
        },
        {
          value: stats.todayTeaching,
          label: 'Teaching Today'
        },
        {
          value: stats.todayMeetings,
          label: 'Meetings Today'
        },
        {
          value: stats.weekTotal,
          label: 'This Week'
        },
        {
          value: stats.recurringCount,
          label: 'Recurring'
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
            label="Department"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-40"
            options={[
            {
              value: 'all',
              label: 'All Departments'
            },
            ...DEPARTMENTS.map((d) => ({
              value: d.name,
              label: d.name
            }))]
            } />
          
            <Select
            label="Teacher"
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="w-44"
            options={[
            {
              value: 'all',
              label: 'All Teachers'
            },
            ...TEACHERS.map((t) => ({
              value: t.id,
              label: t.name
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
                setFilterDepartment('all');
                setFilterTeacher('all');
                setFilterStatus('all');
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

      {/* Calendar Card */}
      <Card>
        {/* Calendar Header */}
        <div className="flex flex-wrap items-center justify-between p-4 border-b gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(1)}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
            <h2 className="text-lg font-semibold ml-2">{getViewTitle()}</h2>
          </div>
          <div className="flex gap-1">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) =>
            <Button
              key={mode}
              variant={viewMode === mode ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode(mode)}>
              
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            )}
          </div>
        </div>

        {/* Day View */}
        {viewMode === 'day' &&
        <div className="p-4">
            <div className="grid grid-cols-[80px_1fr] gap-2">
              {TIME_SLOTS.map((slot) => {
              const slotActivities = getActivitiesForSlot(
                getDateString(currentDate),
                slot.startTime
              );
              return (
                <Fragment key={slot.id}>
                    <div className="text-xs text-gray-500 text-right pr-2 py-2">
                      {formatTime(slot.startTime)}
                    </div>
                    <div
                    className="border-t border-gray-100 min-h-[60px] relative cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                    openAddModal(getDateString(currentDate), slot.startTime)
                    }>
                    
                      <div className="flex flex-wrap gap-1 p-1">
                        {slotActivities.map((activity) => {
                        const typeConfig = getActivityTypeConfig(
                          activity.type
                        );
                        return (
                          <div
                            key={activity.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDetailModal(activity.id);
                            }}
                            className={`px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 ${typeConfig.color}`}>
                            
                              <div className="font-medium truncate max-w-[200px]">
                                {activity.title}
                              </div>
                              <div className="text-[10px] opacity-80">
                                {formatTime(activity.startTime)} -{' '}
                                {formatTime(activity.endTime)}
                              </div>
                            </div>);

                      })}
                      </div>
                    </div>
                  </Fragment>);

            })}
            </div>
          </div>
        }

        {/* Week View */}
        {viewMode === 'week' &&
        <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Week Header */}
              <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b">
                <div className="p-2 text-xs text-gray-500"></div>
                {weekDates.map((date, i) => {
                const dateStr = getDateString(date);
                const isToday = dateStr === getDateString(today);
                return (
                  <div
                    key={i}
                    className={`p-2 text-center border-l ${isToday ? 'bg-blue-50' : ''}`}>
                    
                      <div className="text-xs text-gray-500">
                        {DAYS[date.getDay()]}
                      </div>
                      <div
                      className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white w-7 h-7 rounded-full mx-auto flex items-center justify-center' : ''}`}>
                      
                        {date.getDate()}
                      </div>
                    </div>);

              })}
              </div>

              {/* Time Grid */}
              {TIME_SLOTS.map((slot) =>
            <div
              key={slot.id}
              className="grid grid-cols-[80px_repeat(7,1fr)] border-b">
              
                  <div className="text-xs text-gray-500 text-right pr-2 py-1 border-r">
                    {formatTime(slot.startTime)}
                  </div>
                  {weekDates.map((date, i) => {
                const dateStr = getDateString(date);
                const slotActivities = getActivitiesForSlot(
                  dateStr,
                  slot.startTime
                );
                const isToday = dateStr === getDateString(today);
                return (
                  <div
                    key={i}
                    className={`min-h-[50px] border-l p-0.5 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50/30' : ''}`}
                    onClick={() => openAddModal(dateStr, slot.startTime)}>
                    
                        {slotActivities.slice(0, 2).map((activity) => {
                      const typeConfig = getActivityTypeConfig(
                        activity.type
                      );
                      return (
                        <div
                          key={activity.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetailModal(activity.id);
                          }}
                          className={`px-1 py-0.5 mb-0.5 rounded text-[10px] cursor-pointer hover:opacity-80 truncate ${typeConfig.color}`}
                          title={activity.title}>
                          
                              {activity.title}
                            </div>);

                    })}
                        {slotActivities.length > 2 &&
                    <div className="text-[10px] text-gray-500 px-1">
                            +{slotActivities.length - 2}
                          </div>
                    }
                      </div>);

              })}
                </div>
            )}
            </div>
          </div>
        }

        {/* Month View */}
        {viewMode === 'month' &&
        <div className="p-4">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {DAYS.map((d) =>
            <div
              key={d}
              className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">
              
                  {d}
                </div>
            )}
              {monthDays.map((day, i) => {
              const dateStr = getDateString(day.date);
              const dayActivities = getActivitiesForDate(dateStr);
              const isToday = dateStr === getDateString(today);
              return (
                <div
                  key={i}
                  className={`bg-white min-h-[80px] p-1 cursor-pointer hover:bg-gray-50 ${!day.isCurrentMonth ? 'bg-gray-50/50' : ''} ${isToday ? 'bg-blue-50/50' : ''}`}
                  onClick={() => {
                    setCurrentDate(day.date);
                    setViewMode('day');
                  }}>
                  
                    <span
                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                    
                      {day.date.getDate()}
                    </span>
                    <div className="mt-1 space-y-0.5">
                      {dayActivities.slice(0, 2).map((a) => {
                      const typeConfig = getActivityTypeConfig(a.type);
                      return (
                        <div
                          key={a.id}
                          className={`text-[10px] px-1 rounded truncate ${typeConfig.color}`}>
                          
                            {a.title}
                          </div>);

                    })}
                      {dayActivities.length > 2 &&
                    <div className="text-[10px] text-gray-500">
                          +{dayActivities.length - 2}
                        </div>
                    }
                    </div>
                  </div>);

            })}
            </div>
          </div>
        }

        {/* Legend */}
        <div className="p-4 border-t flex flex-wrap gap-4 text-xs justify-center">
          {ACTIVITY_TYPES.slice(0, 6).map((type) =>
          <div key={type.value} className="flex items-center gap-1">
              <div
              className={`w-3 h-3 rounded ${type.color.split(' ')[0]}`}>
            </div>
              <span>{type.label}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Activity List */}
      <Card title="Upcoming Activities">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {[
                'Activity',
                'Type',
                'Date & Time',
                'Location',
                'Teachers',
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
              {filteredActivities.slice(0, 10).length === 0 ?
              <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No activities found
                  </td>
                </tr> :

              filteredActivities.slice(0, 10).map((activity) => {
                const typeConfig = getActivityTypeConfig(activity.type);
                const status = getActivityStatus(activity);
                const TypeIcon = typeConfig.icon;
                return (
                  <tr key={activity.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${typeConfig.color}`}>
                            <TypeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            {activity.relatedClass &&
                          <p className="text-xs text-gray-500">
                                {activity.relatedClass}
                              </p>
                          }
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="default">{typeConfig.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p>{formatDate(activity.date)}</p>
                        <p className="text-xs text-gray-500">
                          {formatTime(activity.startTime)} -{' '}
                          {formatTime(activity.endTime)}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {activity.location || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {activity.teacherIds.slice(0, 2).map((id) => {
                          const teacher = TEACHERS.find((t) => t.id === id);
                          return (
                            <span
                              key={id}
                              className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                              
                                {teacher?.shortName}
                              </span>);

                        })}
                          {activity.teacherIds.length > 2 &&
                        <span className="text-xs text-gray-500">
                              +{activity.teacherIds.length - 2}
                            </span>
                        }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={STATUS_CONFIG[status].variant}>
                          {STATUS_CONFIG[status].label}
                        </Badge>
                        {activity.isRecurring &&
                      <RepeatIcon className="w-3 h-3 text-gray-400 inline ml-1" />
                      }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDetailModal(activity.id)}>
                          
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingActivity(activity)}>
                          
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteActivity(activity.id)}>
                          
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
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
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
              label="Activity Title *"
              value={editingActivity?.title || activityForm.title}
              onChange={(e) =>
              editingActivity ?
              setEditingActivity((p) =>
              p ?
              {
                ...p,
                title: e.target.value
              } :
              null
              ) :
              setActivityForm((p) => ({
                ...p,
                title: e.target.value
              }))
              }
              placeholder="Physics Class - XI Sci" />
            

              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Activity Type *"
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

              <div className="grid grid-cols-3 gap-4">
                <Input
                type="date"
                label="Date *"
                value={editingActivity?.date || activityForm.date}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  date: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  date: e.target.value
                }))
                } />
              
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
              
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                placeholder="Room 101" />
              
                <Select
                label="Department"
                value={editingActivity?.department || activityForm.department}
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  department: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  department: e.target.value
                }))
                }
                options={[
                {
                  value: '',
                  label: '-- Select --'
                },
                ...DEPARTMENTS.map((d) => ({
                  value: d.name,
                  label: d.name
                }))]
                } />
              
              </div>

              <Input
              label="Related Class"
              value={
              editingActivity?.relatedClass || activityForm.relatedClass
              }
              onChange={(e) =>
              editingActivity ?
              setEditingActivity((p) =>
              p ?
              {
                ...p,
                relatedClass: e.target.value
              } :
              null
              ) :
              setActivityForm((p) => ({
                ...p,
                relatedClass: e.target.value
              }))
              }
              placeholder="XI-Sci, VIII-A" />
            

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded max-h-32 overflow-y-auto">
                  {CLASSES_LIST.map((cls) => {
                  const selected = (activityForm.classes || []).includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleSelection(cls, 'classes')}
                      className={`px-3 py-1 text-xs rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                      
                        {cls}
                      </button>);

                })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branches
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded max-h-32 overflow-y-auto">
                  {BRANCHES_LIST.map((branch) => {
                  const selected = (activityForm.branches || []).includes(
                    branch
                  );
                  return (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => toggleSelection(branch, 'branches')}
                      className={`px-3 py-1 text-xs rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                      
                        {branch}
                      </button>);

                })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staffs (Additional)
                </label>
                <div className="flex flex-wrap gap-2 p-3 border rounded max-h-32 overflow-y-auto">
                  {STAFFS_LIST.map((staff) => {
                  const selected = (activityForm.staffs || []).includes(staff);
                  return (
                    <button
                      key={staff}
                      type="button"
                      onClick={() => toggleSelection(staff, 'staffs')}
                      className={`px-3 py-1 text-xs rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                      
                        {staff}
                      </button>);

                })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Teachers
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                  {TEACHERS.map((teacher) => {
                  const selected = editingActivity ?
                  editingActivity.teacherIds.includes(teacher.id) :
                  (activityForm.teacherIds || []).includes(teacher.id);
                  return (
                    <button
                      key={teacher.id}
                      type="button"
                      onClick={() => {
                        if (editingActivity)
                        setEditingActivity((p) =>
                        p ?
                        {
                          ...p,
                          teacherIds: selected ?
                          p.teacherIds.filter(
                            (t) => t !== teacher.id
                          ) :
                          [...p.teacherIds, teacher.id]
                        } :
                        null
                        );else
                        toggleTeacherSelection(teacher.id);
                      }}
                      className={`px-2 py-1 text-xs rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                      
                        {teacher.shortName}
                      </button>);

                })}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={
                  editingActivity?.isRecurring ?? activityForm.isRecurring
                  }
                  onChange={(e) =>
                  editingActivity ?
                  setEditingActivity((p) =>
                  p ?
                  {
                    ...p,
                    isRecurring: e.target.checked
                  } :
                  null
                  ) :
                  setActivityForm((p) => ({
                    ...p,
                    isRecurring: e.target.checked
                  }))
                  }
                  className="rounded" />
                
                  <span className="text-sm">Recurring Activity</span>
                </label>
              </div>

              {(editingActivity?.isRecurring ?? activityForm.isRecurring) &&
            <div className="grid grid-cols-2 gap-4">
                  <Select
                label="Recurrence"
                value={
                editingActivity?.recurrence || activityForm.recurrence
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  recurrence: e.target.value as RecurrenceType
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  recurrence: e.target.value as RecurrenceType
                }))
                }
                options={[
                {
                  value: 'daily',
                  label: 'Daily'
                },
                {
                  value: 'weekly',
                  label: 'Weekly'
                },
                {
                  value: 'biweekly',
                  label: 'Bi-weekly'
                },
                {
                  value: 'monthly',
                  label: 'Monthly'
                }]
                } />
              
                  <Input
                type="date"
                label="End Date"
                value={
                editingActivity?.recurrenceEndDate ||
                activityForm.recurrenceEndDate
                }
                onChange={(e) =>
                editingActivity ?
                setEditingActivity((p) =>
                p ?
                {
                  ...p,
                  recurrenceEndDate: e.target.value
                } :
                null
                ) :
                setActivityForm((p) => ({
                  ...p,
                  recurrenceEndDate: e.target.value
                }))
                } />
              
                </div>
            }

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
              
                {editingActivity ? 'Update' : 'Add'} Activity
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
        const typeConfig = getActivityTypeConfig(activity.type);
        const TypeIcon = typeConfig.icon;
        const status = getActivityStatus(activity);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className={`p-4 ${typeConfig.color} rounded-t-lg`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <TypeIcon className="w-6 h-6" />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {activity.title}
                        </h3>
                        <p className="text-sm opacity-80">{typeConfig.label}</p>
                      </div>
                    </div>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetailModal(null)}>
                    
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_CONFIG[status].variant}>
                      {STATUS_CONFIG[status].label}
                    </Badge>
                    <Badge variant="default">
                      {activity.priority} priority
                    </Badge>
                    {activity.isRecurring &&
                  <Badge variant="info">
                        <RepeatIcon className="w-3 h-3 mr-1" />
                        {activity.recurrence}
                      </Badge>
                  }
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
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
                  </div>

                  {activity.location &&
                <div className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium">{activity.location}</p>
                      </div>
                    </div>
                }

                  {activity.teacherIds.length > 0 &&
                <div className="text-sm">
                      <p className="text-gray-500 mb-1">
                        Teachers ({activity.teacherIds.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {activity.teacherIds.map((id) => {
                      const t = TEACHERS.find((t) => t.id === id);
                      return (
                        <Badge key={id} variant="default">
                              {t?.name}
                            </Badge>);

                    })}
                      </div>
                    </div>
                }

                  {activity.department &&
                <div className="text-sm">
                      <p className="text-gray-500">Department</p>
                      <p className="font-medium">{activity.department}</p>
                    </div>
                }
                  {activity.relatedClass &&
                <div className="text-sm">
                      <p className="text-gray-500">Related Class</p>
                      <p className="font-medium">{activity.relatedClass}</p>
                    </div>
                }
                  {activity.description &&
                <div className="text-sm">
                      <p className="text-gray-500 mb-1">Description</p>
                      <p>{activity.description}</p>
                    </div>
                }
                  {activity.notes &&
                <div className="text-sm">
                      <p className="text-gray-500 mb-1">Notes</p>
                      <p className="text-gray-600">{activity.notes}</p>
                    </div>
                }

                  <div className="text-xs text-gray-400 pt-2 border-t">
                    Created: {formatDate(activity.createdAt)} by{' '}
                    {activity.createdBy}
                  </div>
                </div>
                <div className="p-4 border-t flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    {status !== 'cancelled' && status !== 'completed' &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelActivity(activity.id)}>
                    
                        <XIcon className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                  }
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateActivity(activity)}>
                    
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
    </div>);

}