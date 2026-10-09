import React, { useCallback, useMemo, useState, createElement } from 'react';
// src/pages/academic/event-activities/BulkPlanning.tsx

import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  Calendar,
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Settings,
  Shuffle,
  Save,
  Send,
  FileText,
  UserCheck,
  UserX,
  AlertCircle,
  ClipboardList,
  Building,
  Check,
  Loader2,
  Bell } from
'lucide-react';
// ==================== TYPES ====================
type ActivityType =
'Exam Invigilation' |
'Event Duty' |
'Sports Day' |
'PTM' |
'Annual Day' |
'Assembly' |
'Gate Duty' |
'Cafeteria' |
'Custom';
type AssignmentStatus = 'Pending' | 'Confirmed' | 'Conflict' | 'Reassigned';
type Department =
'Mathematics' |
'Science' |
'English' |
'Hindi' |
'Social Studies' |
'Computer Science' |
'Physical Education' |
'Arts' |
'Commerce' |
'All';
type DistributionMethod =
'Equal' |
'Round Robin' |
'Random' |
'Workload Based' |
'Manual';
type TimeSlot = {
  id: string;
  label: string;
  start: string;
  end: string;
};
type Venue = {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: string;
};
type Teacher = {
  id: number;
  name: string;
  employeeId: string;
  department: Department;
  designation: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  onLeave: boolean;
  leaveDates: string[];
  currentWorkload: number;
  maxWorkload: number;
  preferences: {
    preferredSlots?: string[];
    avoidSlots?: string[];
    avoidDates?: string[];
  };
  classes: string[];
  selected: boolean;
};
type BulkAssignment = {
  id: string;
  teacherId: number;
  teacherName: string;
  department: Department;
  date: string;
  timeSlot: TimeSlot;
  venue: Venue;
  activity: string;
  status: AssignmentStatus;
  conflict?: string;
  notes?: string;
};
type BulkPlanConfig = {
  activityType: ActivityType;
  activityName: string;
  startDate: string;
  endDate: string;
  selectedTimeSlots: string[];
  selectedVenues: string[];
  selectedDepartments: Department[];
  selectedTeachers: number[];
  distributionMethod: DistributionMethod;
  teachersPerSlot: number;
  excludeWeekends: boolean;
  excludeHolidays: boolean;
  autoResolveConflicts: boolean;
  notifyTeachers: boolean;
  notes: string;
};
type ConflictInfo = {
  assignmentId: string;
  type: string;
  description: string;
  suggestion: string;
};
type ModalType =
'none' |
'preview' |
'conflicts' |
'settings' |
'import' |
'export' |
'confirm' |
'success' |
'editAssignment';
// ==================== DATA ====================
const ACTIVITY_TYPES: ActivityType[] = [
'Exam Invigilation',
'Event Duty',
'Sports Day',
'PTM',
'Annual Day',
'Assembly',
'Gate Duty',
'Cafeteria',
'Custom'];

const DEPARTMENTS: Department[] = [
'All',
'Mathematics',
'Science',
'English',
'Hindi',
'Social Studies',
'Computer Science',
'Physical Education',
'Arts',
'Commerce'];

const DISTRIBUTION_METHODS: DistributionMethod[] = [
'Equal',
'Round Robin',
'Random',
'Workload Based',
'Manual'];

const TIME_SLOTS: TimeSlot[] = [
{
  id: 'ts1',
  label: 'Morning Slot 1',
  start: '08:00',
  end: '10:00'
},
{
  id: 'ts2',
  label: 'Morning Slot 2',
  start: '10:15',
  end: '12:15'
},
{
  id: 'ts3',
  label: 'Afternoon Slot 1',
  start: '12:30',
  end: '14:30'
},
{
  id: 'ts4',
  label: 'Afternoon Slot 2',
  start: '14:45',
  end: '16:45'
},
{
  id: 'ts5',
  label: 'Full Day',
  start: '08:00',
  end: '16:00'
}];

const VENUES: Venue[] = [
{
  id: 'v1',
  name: 'Exam Hall A',
  capacity: 60,
  building: 'Main',
  floor: 'Ground'
},
{
  id: 'v2',
  name: 'Exam Hall B',
  capacity: 60,
  building: 'Main',
  floor: 'Ground'
},
{
  id: 'v3',
  name: 'Exam Hall C',
  capacity: 40,
  building: 'Main',
  floor: '1st'
},
{
  id: 'v4',
  name: 'Room 101',
  capacity: 30,
  building: 'Main',
  floor: '1st'
},
{
  id: 'v5',
  name: 'Room 102',
  capacity: 30,
  building: 'Main',
  floor: '1st'
},
{
  id: 'v6',
  name: 'Room 201',
  capacity: 35,
  building: 'Main',
  floor: '2nd'
},
{
  id: 'v7',
  name: 'Room 202',
  capacity: 35,
  building: 'Main',
  floor: '2nd'
},
{
  id: 'v8',
  name: 'Computer Lab',
  capacity: 40,
  building: 'IT Block',
  floor: '1st'
},
{
  id: 'v9',
  name: 'Science Lab',
  capacity: 30,
  building: 'Science Block',
  floor: '2nd'
},
{
  id: 'v10',
  name: 'Auditorium',
  capacity: 500,
  building: 'Main',
  floor: 'Ground'
}];

const HOLIDAYS = ['2026-03-14', '2026-03-15', '2026-03-26'];
const teachersData: Teacher[] = [
{
  id: 1,
  name: 'Dr. Ramesh Sharma',
  employeeId: 'EMP001',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  email: 'r.sharma@school.edu',
  phone: '+91 98765 43210',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 4,
  maxWorkload: 8,
  preferences: {
    preferredSlots: ['ts1', 'ts2']
  },
  classes: ['X-A', 'XI-A'],
  selected: false
},
{
  id: 2,
  name: 'Mrs. Anita Gupta',
  employeeId: 'EMP002',
  department: 'Science',
  designation: 'Teacher',
  email: 'a.gupta@school.edu',
  phone: '+91 98765 43211',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 5,
  maxWorkload: 8,
  preferences: {},
  classes: ['X-A', 'XII-A'],
  selected: false
},
{
  id: 3,
  name: 'Mr. Mohit Singh',
  employeeId: 'EMP003',
  department: 'English',
  designation: 'Senior Teacher',
  email: 'm.singh@school.edu',
  phone: '+91 98765 43212',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 3,
  maxWorkload: 8,
  preferences: {
    preferredSlots: ['ts2', 'ts3']
  },
  classes: ['IX-A', 'X-A'],
  selected: false
},
{
  id: 4,
  name: 'Mr. Suresh Patel',
  employeeId: 'EMP004',
  department: 'Computer Science',
  designation: 'Teacher',
  email: 's.patel@school.edu',
  phone: '+91 98765 43213',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 2,
  maxWorkload: 8,
  preferences: {},
  classes: ['XI-A', 'XII-A'],
  selected: false
},
{
  id: 5,
  name: 'Mrs. Vidya Kumar',
  employeeId: 'EMP005',
  department: 'Social Studies',
  designation: 'Teacher',
  email: 'v.kumar@school.edu',
  phone: '+91 98765 43214',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 4,
  maxWorkload: 8,
  preferences: {},
  classes: ['VIII-A', 'IX-A'],
  selected: false
},
{
  id: 6,
  name: 'Mrs. Kavita Devi',
  employeeId: 'EMP006',
  department: 'Hindi',
  designation: 'Teacher',
  email: 'k.devi@school.edu',
  phone: '+91 98765 43215',
  isAvailable: false,
  onLeave: true,
  leaveDates: ['2026-03-10', '2026-03-11', '2026-03-12'],
  currentWorkload: 0,
  maxWorkload: 8,
  preferences: {},
  classes: ['VII-A', 'VIII-A'],
  selected: false
},
{
  id: 7,
  name: 'Mr. Pradeep Joshi',
  employeeId: 'EMP007',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  email: 'p.joshi@school.edu',
  phone: '+91 98765 43216',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 6,
  maxWorkload: 10,
  preferences: {
    preferredSlots: ['ts1']
  },
  classes: ['All'],
  selected: false
},
{
  id: 8,
  name: 'Dr. Priya Verma',
  employeeId: 'EMP008',
  department: 'Science',
  designation: 'HOD',
  email: 'p.verma@school.edu',
  phone: '+91 98765 43217',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 2,
  maxWorkload: 6,
  preferences: {
    avoidSlots: ['ts4']
  },
  classes: ['XI-A', 'XII-A'],
  selected: false
},
{
  id: 9,
  name: 'Mr. Ajay Mishra',
  employeeId: 'EMP009',
  department: 'Hindi',
  designation: 'Teacher',
  email: 'a.mishra@school.edu',
  phone: '+91 98765 43218',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 4,
  maxWorkload: 8,
  preferences: {},
  classes: ['VIII-A', 'IX-A'],
  selected: false
},
{
  id: 10,
  name: 'Mrs. Sunita Rao',
  employeeId: 'EMP010',
  department: 'Science',
  designation: 'Teacher',
  email: 's.rao@school.edu',
  phone: '+91 98765 43219',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 3,
  maxWorkload: 8,
  preferences: {},
  classes: ['XI-A', 'XI-B'],
  selected: false
},
{
  id: 11,
  name: 'Mr. Vikram Reddy',
  employeeId: 'EMP011',
  department: 'Mathematics',
  designation: 'Teacher',
  email: 'v.reddy@school.edu',
  phone: '+91 98765 43220',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 5,
  maxWorkload: 8,
  preferences: {},
  classes: ['IX-A', 'IX-B'],
  selected: false
},
{
  id: 12,
  name: 'Mrs. Neha Kapoor',
  employeeId: 'EMP012',
  department: 'English',
  designation: 'Teacher',
  email: 'n.kapoor@school.edu',
  phone: '+91 98765 43221',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 4,
  maxWorkload: 8,
  preferences: {},
  classes: ['VII-A', 'VIII-A'],
  selected: false
},
{
  id: 13,
  name: 'Mr. Sanjay Mehta',
  employeeId: 'EMP013',
  department: 'Commerce',
  designation: 'Teacher',
  email: 's.mehta@school.edu',
  phone: '+91 98765 43222',
  isAvailable: true,
  onLeave: false,
  leaveDates: ['2026-03-11'],
  currentWorkload: 3,
  maxWorkload: 8,
  preferences: {},
  classes: ['XI-Com', 'XII-Com'],
  selected: false
},
{
  id: 14,
  name: 'Mrs. Rekha Agarwal',
  employeeId: 'EMP014',
  department: 'Arts',
  designation: 'Teacher',
  email: 'r.agarwal@school.edu',
  phone: '+91 98765 43223',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 2,
  maxWorkload: 6,
  preferences: {},
  classes: ['VI-A', 'VII-A'],
  selected: false
},
{
  id: 15,
  name: 'Mr. Deepak Sharma',
  employeeId: 'EMP015',
  department: 'Social Studies',
  designation: 'Teacher',
  email: 'd.sharma@school.edu',
  phone: '+91 98765 43224',
  isAvailable: true,
  onLeave: false,
  leaveDates: [],
  currentWorkload: 4,
  maxWorkload: 8,
  preferences: {},
  classes: ['X-A', 'X-B'],
  selected: false
}];

// ==================== UTILITIES ====================
const formatDate = (date: string) =>
new Date(date).toLocaleDateString('en-IN', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});
const formatTime = (time: string) => {
  const [h, m] = time.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};
const isWeekend = (date: string) => {
  const d = new Date(date).getDay();
  return d === 0 || d === 6;
};
const isHoliday = (date: string) => HOLIDAYS.includes(date);
const getDateRange = (
start: string,
end: string,
excludeWeekends: boolean,
excludeHolidays: boolean)
: string[] => {
  const dates: string[] = [];
  const current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    if (
    (!excludeWeekends || !isWeekend(dateStr)) && (
    !excludeHolidays || !isHoliday(dateStr)))

    dates.push(dateStr);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};
const getStatusVariant = (
status: AssignmentStatus)
: 'success' | 'warning' | 'danger' | 'default' => {
  const map: Record<
    AssignmentStatus,
    'success' | 'warning' | 'danger' | 'default'> =
  {
    Pending: 'warning',
    Confirmed: 'success',
    Conflict: 'danger',
    Reassigned: 'default'
  };
  return map[status];
};
// ==================== COMPONENTS ====================
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg'






}: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';}) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div
        className={`relative bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>);

};
const FormField = ({
  label,
  required,
  hint,
  children





}: {label: string;required?: boolean;hint?: string;children: React.ReactNode;}) =>
<div>
    <label className="block text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
  </div>;

const Input = ({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) =>
<input
  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
  {...props} />;


const Textarea = ({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) =>
<textarea
  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
  {...props} />;


const Select = ({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) =>
<select
  className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
  {...props}>
  
    {children}
  </select>;

const StatCard = ({
  icon: Icon,
  value,
  label,
  color





}: {icon: React.ElementType;value: string | number;label: string;color: string;}) =>
<div className="border rounded-lg p-3">
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  </div>;

const TeacherSelectionList = ({
  teachers,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  departmentFilter







}: {teachers: Teacher[];selectedIds: number[];onToggle: (id: number) => void;onSelectAll: () => void;onClearAll: () => void;departmentFilter: Department;}) => {
  const filtered =
  departmentFilter === 'All' ?
  teachers :
  teachers.filter((t) => t.department === departmentFilter);
  const available = filtered.filter((t) => t.isAvailable && !t.onLeave);
  return (
    <div className="border rounded-lg">
      <div className="p-2 border-b bg-gray-50 flex items-center justify-between">
        <span className="text-sm font-medium">
          {selectedIds.length} of {available.length} selected
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear
          </Button>
        </div>
      </div>
      <div className="max-h-60 overflow-y-auto p-2 space-y-1">
        {filtered.map((t) =>
        <label
          key={t.id}
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${!t.isAvailable || t.onLeave ? 'opacity-50' : ''}`}>
          
            <input
            type="checkbox"
            checked={selectedIds.includes(t.id)}
            onChange={() => onToggle(t.id)}
            disabled={!t.isAvailable || t.onLeave}
            className="h-4 w-4 rounded" />
          
            <div className="flex-1">
              <p className="text-sm font-medium">{t.name}</p>
              <p className="text-xs text-gray-500">
                {t.department} • {t.currentWorkload}/{t.maxWorkload}h
              </p>
            </div>
            {t.onLeave && <Badge variant="danger">On Leave</Badge>}
            {!t.onLeave && t.currentWorkload >= t.maxWorkload &&
          <Badge variant="warning">Overloaded</Badge>
          }
          </label>
        )}
      </div>
    </div>);

};
const AssignmentPreviewTable = ({
  assignments,
  onEdit,
  onRemove,
  onResolveConflict





}: {assignments: BulkAssignment[];onEdit: (id: string) => void;onRemove: (id: string) => void;onResolveConflict: (id: string) => void;}) => {
  const [sortKey, setSortKey] = useState<'date' | 'teacher' | 'venue'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const sorted = useMemo(() => {
    return [...assignments].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date')
      cmp =
      a.date.localeCompare(b.date) ||
      a.timeSlot.start.localeCompare(b.timeSlot.start);else
      if (sortKey === 'teacher')
      cmp = a.teacherName.localeCompare(b.teacherName);else
      if (sortKey === 'venue')
      cmp = a.venue.name.localeCompare(b.venue.name);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [assignments, sortKey, sortOrder]);
  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortOrder((o) => o === 'asc' ? 'desc' : 'asc');else
    {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  const SortIcon = ({ column }: {column: typeof sortKey;}) =>
  sortKey === column ?
  sortOrder === 'asc' ?
  <ChevronUp className="h-3 w-3" /> :

  <ChevronDown className="h-3 w-3" /> :


  <ArrowUpDown className="h-3 w-3 opacity-30" />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th
              className="text-left py-2 px-3 font-medium cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('date')}>
              
              <div className="flex items-center gap-1">
                Date & Time <SortIcon column="date" />
              </div>
            </th>
            <th
              className="text-left py-2 px-3 font-medium cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('teacher')}>
              
              <div className="flex items-center gap-1">
                Teacher <SortIcon column="teacher" />
              </div>
            </th>
            <th
              className="text-left py-2 px-3 font-medium cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('venue')}>
              
              <div className="flex items-center gap-1">
                Venue <SortIcon column="venue" />
              </div>
            </th>
            <th className="text-left py-2 px-3 font-medium">Status</th>
            <th className="text-right py-2 px-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) =>
          <tr
            key={a.id}
            className={`border-b hover:bg-gray-50 ${a.status === 'Conflict' ? 'bg-red-50' : ''}`}>
            
              <td className="py-2 px-3">
                <p className="font-medium">{formatDate(a.date)}</p>
                <p className="text-xs text-gray-500">
                  {formatTime(a.timeSlot.start)} - {formatTime(a.timeSlot.end)}
                </p>
              </td>
              <td className="py-2 px-3">
                <p className="font-medium">{a.teacherName}</p>
                <p className="text-xs text-gray-500">{a.department}</p>
              </td>
              <td className="py-2 px-3">
                <p>{a.venue.name}</p>
                <p className="text-xs text-gray-500">
                  {a.venue.building}, {a.venue.floor} Floor
                </p>
              </td>
              <td className="py-2 px-3">
                <Badge variant={getStatusVariant(a.status)}>{a.status}</Badge>
                {a.conflict &&
              <p className="text-xs text-red-500 mt-1">{a.conflict}</p>
              }
              </td>
              <td className="py-2 px-3">
                <div className="flex justify-end gap-1">
                  {a.status === 'Conflict' &&
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResolveConflict(a.id)}
                  title="Resolve">
                  
                      <RefreshCw className="h-4 w-4 text-yellow-500" />
                    </Button>
                }
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(a.id)}>
                  
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(a.id)}>
                  
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

};
const EditAssignmentForm = ({
  assignment,
  teachers,
  venues,
  timeSlots,
  onSave,
  onCancel







}: {assignment: BulkAssignment;teachers: Teacher[];venues: Venue[];timeSlots: TimeSlot[];onSave: (data: Partial<BulkAssignment>) => void;onCancel: () => void;}) => {
  const [data, setData] = useState({
    teacherId: assignment.teacherId,
    venueId: assignment.venue.id,
    timeSlotId: assignment.timeSlot.id,
    notes: assignment.notes || ''
  });
  const update = (key: string, value: any) =>
  setData((p) => ({
    ...p,
    [key]: value
  }));
  const handleSave = () => {
    const teacher = teachers.find((t) => t.id === data.teacherId)!;
    const venue = venues.find((v) => v.id === data.venueId)!;
    const timeSlot = timeSlots.find((ts) => ts.id === data.timeSlotId)!;
    onSave({
      teacherId: data.teacherId,
      teacherName: teacher.name,
      department: teacher.department,
      venue,
      timeSlot,
      notes: data.notes,
      status: 'Pending',
      conflict: undefined
    });
  };
  return (
    <div className="space-y-4">
      <div className="p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium">{formatDate(assignment.date)}</p>
        <p className="text-xs text-gray-500">{assignment.activity}</p>
      </div>
      <FormField label="Teacher">
        <Select
          value={data.teacherId}
          onChange={(e) => update('teacherId', +e.target.value)}>
          
          {teachers.
          filter((t) => t.isAvailable && !t.onLeave).
          map((t) =>
          <option key={t.id} value={t.id}>
                {t.name} ({t.department})
              </option>
          )}
        </Select>
      </FormField>
      <FormField label="Time Slot">
        <Select
          value={data.timeSlotId}
          onChange={(e) => update('timeSlotId', e.target.value)}>
          
          {timeSlots.map((ts) =>
          <option key={ts.id} value={ts.id}>
              {ts.label} ({formatTime(ts.start)} - {formatTime(ts.end)})
            </option>
          )}
        </Select>
      </FormField>
      <FormField label="Venue">
        <Select
          value={data.venueId}
          onChange={(e) => update('venueId', e.target.value)}>
          
          {venues.map((v) =>
          <option key={v.id} value={v.id}>
              {v.name} (Cap: {v.capacity})
            </option>
          )}
        </Select>
      </FormField>
      <FormField label="Notes">
        <Textarea
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          placeholder="Additional notes" />
        
      </FormField>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
    </div>);

};
// ==================== MAIN COMPONENT ====================
export function BulkPlanning() {
  const [teachers] = useState<Teacher[]>(teachersData);
  const [config, setConfig] = useState<BulkPlanConfig>({
    activityType: 'Exam Invigilation',
    activityName: 'Mid-Term Examination Invigilation',
    startDate: '2026-03-16',
    endDate: '2026-03-20',
    selectedTimeSlots: ['ts1', 'ts2'],
    selectedVenues: ['v1', 'v2', 'v3'],
    selectedDepartments: ['All'],
    selectedTeachers: [],
    distributionMethod: 'Round Robin',
    teachersPerSlot: 2,
    excludeWeekends: true,
    excludeHolidays: true,
    autoResolveConflicts: true,
    notifyTeachers: true,
    notes: ''
  });
  const [assignments, setAssignments] = useState<BulkAssignment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [modal, setModal] = useState<ModalType>('none');
  const [editingAssignment, setEditingAssignment] =
  useState<BulkAssignment | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<Department>('All');
  const [searchTeacher, setSearchTeacher] = useState('');
  // Stats
  const stats = useMemo(() => {
    const dates = getDateRange(
      config.startDate,
      config.endDate,
      config.excludeWeekends,
      config.excludeHolidays
    );
    const totalSlots =
    dates.length *
    config.selectedTimeSlots.length *
    config.selectedVenues.length;
    const totalAssignments = totalSlots * config.teachersPerSlot;
    const conflicts = assignments.filter((a) => a.status === 'Conflict').length;
    const confirmed = assignments.filter((a) => a.status === 'Confirmed').length;
    return {
      dates: dates.length,
      totalSlots,
      totalAssignments,
      generated: assignments.length,
      conflicts,
      confirmed,
      pending: assignments.length - conflicts - confirmed
    };
  }, [config, assignments]);
  // Filtered teachers
  const filteredTeachers = useMemo(() => {
    let data = teachers;
    if (departmentFilter !== 'All')
    data = data.filter((t) => t.department === departmentFilter);
    if (searchTeacher)
    data = data.filter((t) =>
    t.name.toLowerCase().includes(searchTeacher.toLowerCase())
    );
    return data;
  }, [teachers, departmentFilter, searchTeacher]);
  const updateConfig = (key: keyof BulkPlanConfig, value: any) =>
  setConfig((p) => ({
    ...p,
    [key]: value
  }));
  const toggleTeacher = (id: number) => {
    setConfig((p) => ({
      ...p,
      selectedTeachers: p.selectedTeachers.includes(id) ?
      p.selectedTeachers.filter((tid) => tid !== id) :
      [...p.selectedTeachers, id]
    }));
  };
  const selectAllTeachers = () => {
    const available = filteredTeachers.
    filter((t) => t.isAvailable && !t.onLeave).
    map((t) => t.id);
    setConfig((p) => ({
      ...p,
      selectedTeachers: [...new Set([...p.selectedTeachers, ...available])]
    }));
  };
  const clearTeachers = () =>
  setConfig((p) => ({
    ...p,
    selectedTeachers: []
  }));
  const toggleTimeSlot = (id: string) => {
    setConfig((p) => ({
      ...p,
      selectedTimeSlots: p.selectedTimeSlots.includes(id) ?
      p.selectedTimeSlots.filter((tsid) => tsid !== id) :
      [...p.selectedTimeSlots, id]
    }));
  };
  const toggleVenue = (id: string) => {
    setConfig((p) => ({
      ...p,
      selectedVenues: p.selectedVenues.includes(id) ?
      p.selectedVenues.filter((vid) => vid !== id) :
      [...p.selectedVenues, id]
    }));
  };
  const generateAssignments = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const dates = getDateRange(
        config.startDate,
        config.endDate,
        config.excludeWeekends,
        config.excludeHolidays
      );
      const selectedTeachersList = teachers.filter((t) =>
      config.selectedTeachers.includes(t.id)
      );
      const selectedTimeSlots = TIME_SLOTS.filter((ts) =>
      config.selectedTimeSlots.includes(ts.id)
      );
      const selectedVenues = VENUES.filter((v) =>
      config.selectedVenues.includes(v.id)
      );
      const newAssignments: BulkAssignment[] = [];
      let teacherIndex = 0;
      dates.forEach((date) => {
        selectedTimeSlots.forEach((timeSlot) => {
          selectedVenues.forEach((venue) => {
            for (let i = 0; i < config.teachersPerSlot; i++) {
              if (selectedTeachersList.length === 0) continue;
              const teacher =
              selectedTeachersList[teacherIndex % selectedTeachersList.length];
              const existingOnSameSlot = newAssignments.filter(
                (a) =>
                a.date === date &&
                a.timeSlot.id === timeSlot.id &&
                a.teacherId === teacher.id
              );
              const isOnLeave = teacher.leaveDates.includes(date);
              let status: AssignmentStatus = 'Pending';
              let conflict: string | undefined;
              if (isOnLeave) {
                status = 'Conflict';
                conflict = 'Teacher on leave';
              } else if (existingOnSameSlot.length > 0) {
                status = 'Conflict';
                conflict = 'Already assigned to another venue';
              } else if (teacher.currentWorkload >= teacher.maxWorkload) {
                status = 'Conflict';
                conflict = 'Workload exceeded';
              }
              newAssignments.push({
                id: `${date}-${timeSlot.id}-${venue.id}-${i}`,
                teacherId: teacher.id,
                teacherName: teacher.name,
                department: teacher.department,
                date,
                timeSlot,
                venue,
                activity: config.activityName,
                status,
                conflict
              });
              teacherIndex++;
            }
          });
        });
      });
      setAssignments(newAssignments);
      setIsGenerating(false);
      setIsGenerated(true);
    }, 1500);
  }, [config, teachers]);
  const removeAssignment = (id: string) =>
  setAssignments((p) => p.filter((a) => a.id !== id));
  const updateAssignment = (id: string, data: Partial<BulkAssignment>) => {
    setAssignments((p) =>
    p.map((a) =>
    a.id === id ?
    {
      ...a,
      ...data
    } :
    a
    )
    );
    setEditingAssignment(null);
    setModal('none');
  };
  const resolveConflict = (id: string) => {
    const assignment = assignments.find((a) => a.id === id);
    if (!assignment) return;
    const availableTeacher = teachers.find(
      (t) =>
      t.isAvailable &&
      !t.onLeave &&
      t.currentWorkload < t.maxWorkload &&
      !assignments.some(
        (a) =>
        a.date === assignment.date &&
        a.timeSlot.id === assignment.timeSlot.id &&
        a.teacherId === t.id
      )
    );
    if (availableTeacher) {
      setAssignments((p) =>
      p.map((a) =>
      a.id === id ?
      {
        ...a,
        teacherId: availableTeacher.id,
        teacherName: availableTeacher.name,
        department: availableTeacher.department,
        status: 'Reassigned',
        conflict: undefined
      } :
      a
      )
      );
    }
  };
  const resolveAllConflicts = () =>
  assignments.
  filter((a) => a.status === 'Conflict').
  forEach((a) => resolveConflict(a.id));
  const confirmAllAssignments = () => {
    setAssignments((p) =>
    p.map((a) =>
    a.status !== 'Conflict' ?
    {
      ...a,
      status: 'Confirmed'
    } :
    a
    )
    );
    setModal('success');
  };
  const shuffleAssignments = () => {
    const shuffled = [...assignments].sort(() => Math.random() - 0.5);
    let teacherIndex = 0;
    const selectedTeachersList = teachers.filter(
      (t) =>
      config.selectedTeachers.includes(t.id) && t.isAvailable && !t.onLeave
    );
    setAssignments(
      shuffled.map((a) => {
        const teacher =
        selectedTeachersList[teacherIndex % selectedTeachersList.length];
        teacherIndex++;
        return {
          ...a,
          teacherId: teacher.id,
          teacherName: teacher.name,
          department: teacher.department,
          status: 'Pending',
          conflict: undefined
        };
      })
    );
  };
  const exportAssignments = (format: 'csv' | 'json') => {
    const content =
    format === 'csv' ?
    [
    ['Date', 'Time', 'Teacher', 'Department', 'Venue', 'Status'].join(
      ','
    ),
    ...assignments.map((a) =>
    [
    a.date,
    `${a.timeSlot.start}-${a.timeSlot.end}`,
    a.teacherName,
    a.department,
    a.venue.name,
    a.status].
    join(',')
    )].
    join('\n') :
    JSON.stringify(assignments, null, 2);
    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv' : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_assignments.${format}`;
    a.click();
  };
  const closeModal = () => {
    setModal('none');
    setEditingAssignment(null);
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Planning</h1>
          <p className="text-sm text-gray-500">
            Assign duties to multiple teachers simultaneously
          </p>
        </div>
        {isGenerated &&
        <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setModal('export')}>
            
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => setModal('import')}>
            
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Setup Panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <div className="p-4">
              <h3 className="font-semibold mb-4">Bulk Assignment Setup</h3>
              <div className="space-y-4">
                <FormField label="Activity Type" required>
                  <Select
                    value={config.activityType}
                    onChange={(e) =>
                    updateConfig('activityType', e.target.value)
                    }>
                    
                    {ACTIVITY_TYPES.map((t) =>
                    <option key={t} value={t}>
                        {t}
                      </option>
                    )}
                  </Select>
                </FormField>

                <FormField label="Activity Name" required>
                  <Input
                    value={config.activityName}
                    onChange={(e) =>
                    updateConfig('activityName', e.target.value)
                    }
                    placeholder="Enter activity name" />
                  
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Start Date" required>
                    <Input
                      type="date"
                      value={config.startDate}
                      onChange={(e) =>
                      updateConfig('startDate', e.target.value)
                      } />
                    
                  </FormField>
                  <FormField label="End Date" required>
                    <Input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => updateConfig('endDate', e.target.value)} />
                    
                  </FormField>
                </div>

                <FormField label="Time Slots" required>
                  <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                    {TIME_SLOTS.map((ts) =>
                    <label
                      key={ts.id}
                      className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                      
                        <input
                        type="checkbox"
                        checked={config.selectedTimeSlots.includes(ts.id)}
                        onChange={() => toggleTimeSlot(ts.id)}
                        className="h-4 w-4 rounded" />
                      
                        <span className="text-sm">{ts.label}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {formatTime(ts.start)}-{formatTime(ts.end)}
                        </span>
                      </label>
                    )}
                  </div>
                </FormField>

                <FormField label="Venues" required>
                  <div className="space-y-1 max-h-32 overflow-y-auto border rounded p-2">
                    {VENUES.map((v) =>
                    <label
                      key={v.id}
                      className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
                      
                        <input
                        type="checkbox"
                        checked={config.selectedVenues.includes(v.id)}
                        onChange={() => toggleVenue(v.id)}
                        className="h-4 w-4 rounded" />
                      
                        <span className="text-sm">{v.name}</span>
                        <span className="text-xs text-gray-400 ml-auto">
                          Cap: {v.capacity}
                        </span>
                      </label>
                    )}
                  </div>
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Distribution">
                    <Select
                      value={config.distributionMethod}
                      onChange={(e) =>
                      updateConfig('distributionMethod', e.target.value)
                      }>
                      
                      {DISTRIBUTION_METHODS.map((m) =>
                      <option key={m} value={m}>
                          {m}
                        </option>
                      )}
                    </Select>
                  </FormField>
                  <FormField label="Teachers/Slot">
                    <Input
                      type="number"
                      value={config.teachersPerSlot}
                      onChange={(e) =>
                      updateConfig(
                        'teachersPerSlot',
                        Math.max(1, +e.target.value)
                      )
                      }
                      min="1" />
                    
                  </FormField>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={config.excludeWeekends}
                      onChange={(e) =>
                      updateConfig('excludeWeekends', e.target.checked)
                      }
                      className="h-4 w-4 rounded" />
                    
                    Exclude Weekends
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={config.excludeHolidays}
                      onChange={(e) =>
                      updateConfig('excludeHolidays', e.target.checked)
                      }
                      className="h-4 w-4 rounded" />
                    
                    Exclude Holidays
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={config.autoResolveConflicts}
                      onChange={(e) =>
                      updateConfig('autoResolveConflicts', e.target.checked)
                      }
                      className="h-4 w-4 rounded" />
                    
                    Auto-resolve Conflicts
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={config.notifyTeachers}
                      onChange={(e) =>
                      updateConfig('notifyTeachers', e.target.checked)
                      }
                      className="h-4 w-4 rounded" />
                    
                    Notify Teachers
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Select Teachers</h3>
                <span className="text-xs text-gray-500">
                  {config.selectedTeachers.length} selected
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Select
                    value={departmentFilter}
                    onChange={(e) =>
                    setDepartmentFilter(e.target.value as Department)
                    }
                    className="flex-1">
                    
                    {DEPARTMENTS.map((d) =>
                    <option key={d} value={d}>
                        {d}
                      </option>
                    )}
                  </Select>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search teachers..."
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="pl-8" />
                  
                </div>
                <TeacherSelectionList
                  teachers={filteredTeachers}
                  selectedIds={config.selectedTeachers}
                  onToggle={toggleTeacher}
                  onSelectAll={selectAllTeachers}
                  onClearAll={clearTeachers}
                  departmentFilter={departmentFilter} />
                
              </div>
            </div>
          </Card>

          <Button
            className="w-full"
            onClick={generateAssignments}
            disabled={
            isGenerating ||
            config.selectedTeachers.length === 0 ||
            config.selectedTimeSlots.length === 0 ||
            config.selectedVenues.length === 0
            }>
            
            {isGenerating ?
            <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </> :

            <>
                <ClipboardList className="h-4 w-4 mr-2" />
                Generate Preview
              </>
            }
          </Button>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Assignment Preview</h3>
                {isGenerated &&
                <div className="flex gap-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={shuffleAssignments}>
                    
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle
                    </Button>
                    {stats.conflicts > 0 &&
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resolveAllConflicts}>
                    
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resolve All ({stats.conflicts})
                      </Button>
                  }
                  </div>
                }
              </div>

              {!isGenerated ?
              <div className="h-64 bg-gray-50 border border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400">
                  <ClipboardList className="h-12 w-12 mb-2" />
                  <p className="text-sm">
                    Configure settings and click "Generate Preview"
                  </p>
                  <p className="text-xs mt-1">Assignments will appear here</p>
                </div> :

              <>
                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <StatCard
                    icon={Calendar}
                    value={stats.dates}
                    label="Days"
                    color="text-blue-500" />
                  
                    <StatCard
                    icon={ClipboardList}
                    value={stats.generated}
                    label="Assignments"
                    color="text-green-500" />
                  
                    <StatCard
                    icon={AlertTriangle}
                    value={stats.conflicts}
                    label="Conflicts"
                    color="text-red-500" />
                  
                    <StatCard
                    icon={CheckCircle}
                    value={stats.confirmed}
                    label="Confirmed"
                    color="text-emerald-500" />
                  
                  </div>

                  {/* Info Banner */}
                  <div
                  className={`p-3 rounded-lg mb-4 text-sm ${stats.conflicts > 0 ? 'bg-yellow-50 border border-yellow-100 text-yellow-800' : 'bg-blue-50 border border-blue-100 text-blue-800'}`}>
                  
                    <div className="flex items-center gap-2">
                      {stats.conflicts > 0 ?
                    <AlertTriangle className="h-4 w-4" /> :

                    <CheckCircle className="h-4 w-4" />
                    }
                      <span>
                        {stats.conflicts > 0 ?
                      `${stats.conflicts} conflict(s) detected. Please resolve before confirming.` :
                      `Generated ${stats.generated} assignments for ${config.selectedTeachers.length} teachers across ${stats.dates} days.`}
                      </span>
                    </div>
                  </div>

                  {/* Assignments Table */}
                  <div className="border rounded-lg max-h-96 overflow-y-auto">
                    <AssignmentPreviewTable
                    assignments={assignments}
                    onEdit={(id) => {
                      setEditingAssignment(
                        assignments.find((a) => a.id === id)!
                      );
                      setModal('editAssignment');
                    }}
                    onRemove={removeAssignment}
                    onResolveConflict={resolveConflict} />
                  
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {assignments.length} total assignments
                    </p>
                    <div className="flex gap-2">
                      <Button
                      variant="outline"
                      onClick={() => {
                        setAssignments([]);
                        setIsGenerated(false);
                      }}>
                      
                        Clear All
                      </Button>
                      <Button
                      onClick={() => setModal('confirm')}
                      disabled={stats.conflicts > 0}>
                      
                        <Send className="h-4 w-4 mr-2" />
                        Confirm & Assign All
                      </Button>
                    </div>
                  </div>
                </>
              }
            </div>
          </Card>

          {/* Summary by Date */}
          {isGenerated &&
          <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-3">Summary by Date</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {getDateRange(
                  config.startDate,
                  config.endDate,
                  config.excludeWeekends,
                  config.excludeHolidays
                ).map((date) => {
                  const dayAssignments = assignments.filter(
                    (a) => a.date === date
                  );
                  const dayConflicts = dayAssignments.filter(
                    (a) => a.status === 'Conflict'
                  ).length;
                  return (
                    <div
                      key={date}
                      className={`p-2 border rounded text-center ${dayConflicts > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                      
                        <p className="text-xs font-medium">
                          {formatDate(date)}
                        </p>
                        <p className="text-lg font-bold">
                          {dayAssignments.length}
                        </p>
                        {dayConflicts > 0 &&
                      <p className="text-xs text-red-500">
                            {dayConflicts} conflict(s)
                          </p>
                      }
                      </div>);

                })}
                </div>
              </div>
            </Card>
          }
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modal === 'editAssignment'}
        onClose={closeModal}
        title="Edit Assignment"
        size="md">
        
        {editingAssignment &&
        <EditAssignmentForm
          assignment={editingAssignment}
          teachers={teachers}
          venues={VENUES}
          timeSlots={TIME_SLOTS}
          onSave={(data) => updateAssignment(editingAssignment.id, data)}
          onCancel={closeModal} />

        }
      </Modal>

      <Modal
        isOpen={modal === 'confirm'}
        onClose={closeModal}
        title="Confirm Bulk Assignment"
        size="md">
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Assignment Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Activity:</span>{' '}
                <span className="font-medium">{config.activityName}</span>
              </div>
              <div>
                <span className="text-gray-500">Duration:</span>{' '}
                <span className="font-medium">
                  {formatDate(config.startDate)} - {formatDate(config.endDate)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Assignments:</span>{' '}
                <span className="font-medium">{assignments.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Teachers:</span>{' '}
                <span className="font-medium">
                  {config.selectedTeachers.length}
                </span>
              </div>
            </div>
          </div>
          {config.notifyTeachers &&
          <div className="flex items-center gap-2 text-sm text-blue-600">
              <Bell className="h-4 w-4" />
              <span>
                Teachers will be notified via email and app notification
              </span>
            </div>
          }
          <div className="flex items-start gap-2 text-sm text-yellow-600">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            <span>
              This action will create {assignments.length} duty assignments.
              Teachers will need to confirm their availability.
            </span>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={confirmAllAssignments}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm All
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal === 'success'}
        onClose={closeModal}
        title="Assignments Created"
        size="sm">
        
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Success!</h3>
          <p className="text-gray-600 mb-4">
            {stats.confirmed} assignments have been created successfully.
          </p>
          {config.notifyTeachers &&
          <p className="text-sm text-gray-500">
              Notifications sent to {config.selectedTeachers.length} teachers.
            </p>
          }
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setAssignments([]);
                setIsGenerated(false);
                closeModal();
              }}>
              
              Create New
            </Button>
            <Button onClick={closeModal}>Done</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal === 'export'}
        onClose={closeModal}
        title="Export Assignments"
        size="sm">
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Export {assignments.length} assignments
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                exportAssignments('csv');
                closeModal();
              }}>
              
              <FileText className="h-4 w-4 mr-2" />
              Export as CSV
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                exportAssignments('json');
                closeModal();
              }}>
              
              <FileText className="h-4 w-4 mr-2" />
              Export as JSON
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={modal === 'import'}
        onClose={closeModal}
        title="Import Assignments"
        size="md">
        
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Drag and drop a CSV or JSON file here
            </p>
            <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            <input type="file" className="hidden" accept=".csv,.json" />
            <Button variant="outline" size="sm" className="mt-4">
              Browse Files
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Required columns:</p>
            <p>Date, Time Slot, Venue, Teacher ID</p>
          </div>
        </div>
      </Modal>
    </div>);

}