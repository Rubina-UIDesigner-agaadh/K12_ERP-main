import React, { useCallback, useMemo, useState } from 'react';
// src/pages/admin/scheduling/PlannerDashboard.tsx

import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  Calendar,
  Users,
  AlertTriangle,
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
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  AlertCircle,
  Copy,
  Download,
  Send,
  Bell,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Repeat,
  CalendarDays,
  Building,
  Coffee,
  Bus,
  BookOpen,
  ClipboardList,
  Megaphone,
  Shield,
  Activity,
  UserPlus,
  Settings,
  MoreVertical } from
'lucide-react';
// ==================== TYPES ====================
type DutyType =
'Assembly' |
'Corridor' |
'Cafeteria' |
'Bus' |
'Gate' |
'Library' |
'Lab' |
'Playground' |
'Exam' |
'Event' |
'Substitution' |
'Other';
type DutyStatus =
'Scheduled' |
'In Progress' |
'Completed' |
'Cancelled' |
'Pending Confirmation';
type DutyPriority = 'High' | 'Medium' | 'Low';
type RecurrenceType = 'None' | 'Daily' | 'Weekly' | 'Monthly';
type ConflictType =
'Time Overlap' |
'Overload' |
'Leave Conflict' |
'Class Conflict';
type TeacherStatus = 'Available' | 'On Duty' | 'On Leave' | 'In Class' | 'Busy';
type Department =
'Mathematics' |
'Science' |
'English' |
'Hindi' |
'Social Studies' |
'Computer Science' |
'Physical Education' |
'Arts' |
'Commerce';
type TimeSlot = {
  start: string;
  end: string;
  label?: string;
};
type Location = {
  id: string;
  name: string;
  building?: string;
  floor?: string;
};
type Teacher = {
  id: number;
  name: string;
  employeeId: string;
  department: Department;
  designation: string;
  email: string;
  phone: string;
  status: TeacherStatus;
  currentDuty?: string;
  weeklyDutyHours: number;
  maxDutyHours: number;
  totalDutiesThisMonth: number;
  completedDuties: number;
  pendingDuties: number;
  onLeaveToday: boolean;
  leaveEndDate?: string;
  classes: string[];
  specializations: string[];
  preferences: {
    preferredSlots?: string[];
    avoidSlots?: string[];
    notes?: string;
  };
};
type DutyAssignment = {
  id: number;
  title: string;
  type: DutyType;
  description: string;
  date: string;
  timeSlot: TimeSlot;
  location: Location;
  assignedTeachers: {
    teacherId: number;
    teacherName: string;
    confirmed: boolean;
    confirmedAt?: string;
  }[];
  minTeachers: number;
  maxTeachers: number;
  priority: DutyPriority;
  status: DutyStatus;
  recurrence: RecurrenceType;
  recurrenceEndDate?: string;
  createdBy: string;
  createdAt: string;
  modifiedAt?: string;
  notes?: string;
  tags: string[];
  isSpecialActivity: boolean;
  relatedEvent?: string;
  substitutionFor?: {
    teacherId: number;
    teacherName: string;
    reason: string;
  };
};
type Conflict = {
  id: string;
  type: ConflictType;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  involvedTeachers: {
    id: number;
    name: string;
  }[];
  involvedDuties: {
    id: number;
    title: string;
  }[];
  detectedAt: string;
  resolved: boolean;
  resolvedAt?: string;
  resolution?: string;
};
type SpecialActivity = {
  id: number;
  title: string;
  date: string;
  duration: string;
  description: string;
  assignedTeachers: string;
  teacherCount: number;
  department?: string;
  status: 'Upcoming' | 'Today' | 'Completed';
};
type SortKey = 'name' | 'department' | 'weeklyDutyHours' | 'status';
type ViewMode = 'day' | 'week' | 'month';
type ModalType =
'none' |
'createDuty' |
'editDuty' |
'viewDuty' |
'deleteDuty' |
'viewTeacher' |
'assignTeacher' |
'resolveConflict' |
'substitute';
// ==================== DATA ====================
const DUTY_TYPES: DutyType[] = [
'Assembly',
'Corridor',
'Cafeteria',
'Bus',
'Gate',
'Library',
'Lab',
'Playground',
'Exam',
'Event',
'Substitution',
'Other'];

const DUTY_PRIORITIES: DutyPriority[] = ['High', 'Medium', 'Low'];
const DEPARTMENTS: Department[] = [
'Mathematics',
'Science',
'English',
'Hindi',
'Social Studies',
'Computer Science',
'Physical Education',
'Arts',
'Commerce'];

const RECURRENCE_TYPES: RecurrenceType[] = [
'None',
'Daily',
'Weekly',
'Monthly'];

const TIME_SLOTS: TimeSlot[] = [
{
  start: '07:30',
  end: '08:00',
  label: 'Early Morning'
},
{
  start: '08:00',
  end: '08:20',
  label: 'Assembly'
},
{
  start: '10:30',
  end: '10:45',
  label: 'Short Break'
},
{
  start: '12:30',
  end: '13:15',
  label: 'Lunch Break'
},
{
  start: '14:30',
  end: '15:00',
  label: 'Dispersal'
}];

const LOCATIONS: Location[] = [
{
  id: 'loc1',
  name: 'Main Gate',
  building: 'Main',
  floor: 'Ground'
},
{
  id: 'loc2',
  name: 'Assembly Ground',
  building: 'Main',
  floor: 'Ground'
},
{
  id: 'loc3',
  name: 'Corridor - 1st Floor',
  building: 'Main',
  floor: '1st'
},
{
  id: 'loc4',
  name: 'Corridor - 2nd Floor',
  building: 'Main',
  floor: '2nd'
},
{
  id: 'loc5',
  name: 'Cafeteria',
  building: 'Annex',
  floor: 'Ground'
},
{
  id: 'loc6',
  name: 'Library',
  building: 'Main',
  floor: '1st'
},
{
  id: 'loc7',
  name: 'Science Lab',
  building: 'Science Block',
  floor: '2nd'
},
{
  id: 'loc8',
  name: 'Computer Lab',
  building: 'IT Block',
  floor: '1st'
},
{
  id: 'loc9',
  name: 'Playground',
  building: 'Outdoor',
  floor: 'Ground'
},
{
  id: 'loc10',
  name: 'Bus Bay',
  building: 'Main',
  floor: 'Ground'
}];

const teachersData: Teacher[] = [
{
  id: 1,
  name: 'Dr. Ramesh Sharma',
  employeeId: 'EMP001',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  email: 'r.sharma@school.edu',
  phone: '+91 98765 43210',
  status: 'Available',
  weeklyDutyHours: 4,
  maxDutyHours: 6,
  totalDutiesThisMonth: 12,
  completedDuties: 10,
  pendingDuties: 2,
  onLeaveToday: false,
  classes: ['X-A', 'X-B', 'XI-A'],
  specializations: ['Calculus', 'Statistics'],
  preferences: {
    preferredSlots: ['Morning'],
    avoidSlots: ['Late Evening']
  }
},
{
  id: 2,
  name: 'Mrs. Anita Gupta',
  employeeId: 'EMP002',
  department: 'Science',
  designation: 'Teacher',
  email: 'a.gupta@school.edu',
  phone: '+91 98765 43211',
  status: 'On Duty',
  currentDuty: 'Morning Assembly',
  weeklyDutyHours: 5,
  maxDutyHours: 6,
  totalDutiesThisMonth: 14,
  completedDuties: 12,
  pendingDuties: 2,
  onLeaveToday: false,
  classes: ['X-A', 'XII-A'],
  specializations: ['Physics', 'Lab Work'],
  preferences: {}
},
{
  id: 3,
  name: 'Mr. Mohit Singh',
  employeeId: 'EMP003',
  department: 'English',
  designation: 'Senior Teacher',
  email: 'm.singh@school.edu',
  phone: '+91 98765 43212',
  status: 'In Class',
  weeklyDutyHours: 3,
  maxDutyHours: 6,
  totalDutiesThisMonth: 10,
  completedDuties: 8,
  pendingDuties: 2,
  onLeaveToday: false,
  classes: ['IX-A', 'IX-B', 'X-A'],
  specializations: ['Literature', 'Grammar'],
  preferences: {
    preferredSlots: ['Break Time']
  }
},
{
  id: 4,
  name: 'Mr. Suresh Patel',
  employeeId: 'EMP004',
  department: 'Computer Science',
  designation: 'Teacher',
  email: 's.patel@school.edu',
  phone: '+91 98765 43213',
  status: 'Available',
  weeklyDutyHours: 2,
  maxDutyHours: 6,
  totalDutiesThisMonth: 8,
  completedDuties: 6,
  pendingDuties: 2,
  onLeaveToday: false,
  classes: ['XI-A', 'XII-A'],
  specializations: ['Programming', 'Networking'],
  preferences: {}
},
{
  id: 5,
  name: 'Mrs. Vidya Kumar',
  employeeId: 'EMP005',
  department: 'Social Studies',
  designation: 'Teacher',
  email: 'v.kumar@school.edu',
  phone: '+91 98765 43214',
  status: 'Available',
  weeklyDutyHours: 4,
  maxDutyHours: 6,
  totalDutiesThisMonth: 11,
  completedDuties: 9,
  pendingDuties: 2,
  onLeaveToday: false,
  classes: ['VIII-A', 'IX-A'],
  specializations: ['History', 'Geography'],
  preferences: {}
},
{
  id: 6,
  name: 'Mrs. Kavita Devi',
  employeeId: 'EMP006',
  department: 'Hindi',
  designation: 'Teacher',
  email: 'k.devi@school.edu',
  phone: '+91 98765 43215',
  status: 'On Leave',
  weeklyDutyHours: 0,
  maxDutyHours: 6,
  totalDutiesThisMonth: 6,
  completedDuties: 6,
  pendingDuties: 0,
  onLeaveToday: true,
  leaveEndDate: '2026-03-15',
  classes: ['VII-A', 'VIII-A'],
  specializations: ['Hindi Literature'],
  preferences: {}
},
{
  id: 7,
  name: 'Mr. Pradeep Joshi',
  employeeId: 'EMP007',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  email: 'p.joshi@school.edu',
  phone: '+91 98765 43216',
  status: 'Available',
  weeklyDutyHours: 6,
  maxDutyHours: 8,
  totalDutiesThisMonth: 18,
  completedDuties: 15,
  pendingDuties: 3,
  onLeaveToday: false,
  classes: ['All'],
  specializations: ['Athletics', 'Cricket', 'Basketball'],
  preferences: {
    preferredSlots: ['Morning', 'Sports Period']
  }
},
{
  id: 8,
  name: 'Dr. Priya Verma',
  employeeId: 'EMP008',
  department: 'Science',
  designation: 'HOD',
  email: 'p.verma@school.edu',
  phone: '+91 98765 43217',
  status: 'Busy',
  weeklyDutyHours: 2,
  maxDutyHours: 4,
  totalDutiesThisMonth: 6,
  completedDuties: 5,
  pendingDuties: 1,
  onLeaveToday: false,
  classes: ['XI-A', 'XII-A'],
  specializations: ['Chemistry', 'Research'],
  preferences: {
    avoidSlots: ['Full Day Events']
  }
}];

const dutiesData: DutyAssignment[] = [
{
  id: 1,
  title: 'Morning Assembly Discipline',
  type: 'Assembly',
  description:
  'Maintain discipline during morning assembly and ensure students are in proper lines.',
  date: '2026-03-10',
  timeSlot: {
    start: '08:00',
    end: '08:20',
    label: 'Assembly'
  },
  location: LOCATIONS[1],
  assignedTeachers: [
  {
    teacherId: 1,
    teacherName: 'Dr. Ramesh Sharma',
    confirmed: true,
    confirmedAt: '2026-03-09T18:00:00'
  },
  {
    teacherId: 2,
    teacherName: 'Mrs. Anita Gupta',
    confirmed: true,
    confirmedAt: '2026-03-09T17:30:00'
  }],

  minTeachers: 2,
  maxTeachers: 3,
  priority: 'High',
  status: 'Scheduled',
  recurrence: 'Daily',
  createdBy: 'Admin',
  createdAt: '2026-03-01T10:00:00',
  tags: ['Daily', 'Morning'],
  isSpecialActivity: false
},
{
  id: 2,
  title: 'Corridor Supervision (1st Floor)',
  type: 'Corridor',
  description: 'Monitor student movement in corridors during break time.',
  date: '2026-03-10',
  timeSlot: {
    start: '10:30',
    end: '10:45',
    label: 'Short Break'
  },
  location: LOCATIONS[2],
  assignedTeachers: [
  {
    teacherId: 3,
    teacherName: 'Mr. Mohit Singh',
    confirmed: true,
    confirmedAt: '2026-03-09T16:00:00'
  }],

  minTeachers: 1,
  maxTeachers: 2,
  priority: 'Medium',
  status: 'Scheduled',
  recurrence: 'Daily',
  createdBy: 'Admin',
  createdAt: '2026-03-01T10:00:00',
  tags: ['Daily', 'Break'],
  isSpecialActivity: false
},
{
  id: 3,
  title: 'Cafeteria Duty',
  type: 'Cafeteria',
  description:
  'Supervise cafeteria during lunch, ensure orderly queues and cleanliness.',
  date: '2026-03-10',
  timeSlot: {
    start: '12:30',
    end: '13:15',
    label: 'Lunch Break'
  },
  location: LOCATIONS[4],
  assignedTeachers: [
  {
    teacherId: 4,
    teacherName: 'Mr. Suresh Patel',
    confirmed: true,
    confirmedAt: '2026-03-09T15:00:00'
  },
  {
    teacherId: 5,
    teacherName: 'Mrs. Vidya Kumar',
    confirmed: false
  }],

  minTeachers: 2,
  maxTeachers: 3,
  priority: 'High',
  status: 'Pending Confirmation',
  recurrence: 'Daily',
  createdBy: 'Admin',
  createdAt: '2026-03-01T10:00:00',
  tags: ['Daily', 'Lunch'],
  isSpecialActivity: false
},
{
  id: 4,
  title: 'Bus Boarding Duty',
  type: 'Bus',
  description: 'Ensure safe boarding of students onto school buses.',
  date: '2026-03-10',
  timeSlot: {
    start: '14:30',
    end: '15:00',
    label: 'Dispersal'
  },
  location: LOCATIONS[9],
  assignedTeachers: [
  {
    teacherId: 7,
    teacherName: 'Mr. Pradeep Joshi',
    confirmed: true,
    confirmedAt: '2026-03-09T14:00:00'
  }],

  minTeachers: 2,
  maxTeachers: 4,
  priority: 'High',
  status: 'Scheduled',
  recurrence: 'Daily',
  createdBy: 'Admin',
  createdAt: '2026-03-01T10:00:00',
  notes: 'Need one more teacher assigned',
  tags: ['Daily', 'Transport'],
  isSpecialActivity: false
},
{
  id: 5,
  title: 'Gate Duty - Main Entrance',
  type: 'Gate',
  description: 'Monitor main gate during arrival time.',
  date: '2026-03-10',
  timeSlot: {
    start: '07:30',
    end: '08:00',
    label: 'Early Morning'
  },
  location: LOCATIONS[0],
  assignedTeachers: [
  {
    teacherId: 8,
    teacherName: 'Dr. Priya Verma',
    confirmed: true,
    confirmedAt: '2026-03-09T20:00:00'
  }],

  minTeachers: 1,
  maxTeachers: 2,
  priority: 'Medium',
  status: 'Scheduled',
  recurrence: 'Weekly',
  createdBy: 'Admin',
  createdAt: '2026-03-01T10:00:00',
  tags: ['Weekly', 'Gate'],
  isSpecialActivity: false
},
{
  id: 6,
  title: 'Science Exhibition Setup',
  type: 'Event',
  description: 'Setup and coordination for annual science exhibition.',
  date: '2026-03-11',
  timeSlot: {
    start: '09:00',
    end: '16:00',
    label: 'Full Day'
  },
  location: LOCATIONS[6],
  assignedTeachers: [
  {
    teacherId: 2,
    teacherName: 'Mrs. Anita Gupta',
    confirmed: true
  },
  {
    teacherId: 8,
    teacherName: 'Dr. Priya Verma',
    confirmed: true
  }],

  minTeachers: 4,
  maxTeachers: 6,
  priority: 'High',
  status: 'Scheduled',
  recurrence: 'None',
  createdBy: 'Science HOD',
  createdAt: '2026-03-05T09:00:00',
  relatedEvent: 'Annual Science Exhibition',
  tags: ['Event', 'Science'],
  isSpecialActivity: true
},
{
  id: 7,
  title: 'PTM Coordination',
  type: 'Event',
  description: 'Coordinate parent-teacher meeting activities.',
  date: '2026-03-15',
  timeSlot: {
    start: '09:00',
    end: '13:00',
    label: 'Morning'
  },
  location: LOCATIONS[1],
  assignedTeachers: [],
  minTeachers: 10,
  maxTeachers: 20,
  priority: 'High',
  status: 'Pending Confirmation',
  recurrence: 'None',
  createdBy: 'Admin',
  createdAt: '2026-03-08T10:00:00',
  relatedEvent: 'Parent Teacher Meeting',
  tags: ['Event', 'PTM'],
  isSpecialActivity: true
},
{
  id: 8,
  title: 'Substitution - Class X-A Mathematics',
  type: 'Substitution',
  description:
  'Cover Mathematics class for Dr. Sharma who is on emergency leave.',
  date: '2026-03-10',
  timeSlot: {
    start: '10:45',
    end: '11:30',
    label: '3rd Period'
  },
  location: {
    id: 'room10a',
    name: 'Class X-A',
    building: 'Main',
    floor: '2nd'
  },
  assignedTeachers: [
  {
    teacherId: 4,
    teacherName: 'Mr. Suresh Patel',
    confirmed: false
  }],

  minTeachers: 1,
  maxTeachers: 1,
  priority: 'High',
  status: 'Pending Confirmation',
  recurrence: 'None',
  createdBy: 'Admin',
  createdAt: '2026-03-10T07:00:00',
  substitutionFor: {
    teacherId: 1,
    teacherName: 'Dr. Ramesh Sharma',
    reason: 'Emergency Leave'
  },
  tags: ['Substitution', 'Urgent'],
  isSpecialActivity: false
}];

const conflictsData: Conflict[] = [
{
  id: 'conf1',
  type: 'Time Overlap',
  severity: 'High',
  description:
  'Mr. Suresh Patel is assigned to Cafeteria Duty and Substitution at overlapping times.',
  involvedTeachers: [
  {
    id: 4,
    name: 'Mr. Suresh Patel'
  }],

  involvedDuties: [
  {
    id: 3,
    title: 'Cafeteria Duty'
  },
  {
    id: 8,
    title: 'Substitution - Class X-A'
  }],

  detectedAt: '2026-03-10T07:30:00',
  resolved: false
},
{
  id: 'conf2',
  type: 'Overload',
  severity: 'Medium',
  description:
  'Mr. Pradeep Joshi has exceeded weekly duty hours limit (6/6 hours used, 2 more assigned).',
  involvedTeachers: [
  {
    id: 7,
    name: 'Mr. Pradeep Joshi'
  }],

  involvedDuties: [
  {
    id: 4,
    title: 'Bus Boarding Duty'
  }],

  detectedAt: '2026-03-10T08:00:00',
  resolved: false
}];

const specialActivitiesData: SpecialActivity[] = [
{
  id: 1,
  title: 'Science Exhibition Setup',
  date: 'Tomorrow',
  duration: 'Full Day',
  description: 'Annual science exhibition preparation',
  assignedTeachers: 'Science Dept',
  teacherCount: 4,
  department: 'Science',
  status: 'Upcoming'
},
{
  id: 2,
  title: 'PTM Coordination',
  date: 'Saturday (Mar 15)',
  duration: '09:00 AM - 01:00 PM',
  description: 'Parent-Teacher Meeting',
  assignedTeachers: 'All Class Teachers',
  teacherCount: 25,
  status: 'Upcoming'
},
{
  id: 3,
  title: 'Staff Training Workshop',
  date: 'Next Monday',
  duration: '02:00 PM - 05:00 PM',
  description: 'Professional development session',
  assignedTeachers: 'All Staff',
  teacherCount: 85,
  status: 'Upcoming'
},
{
  id: 4,
  title: 'Annual Sports Day',
  date: 'Mar 25, 2026',
  duration: 'Full Day',
  description: 'Annual sports event',
  assignedTeachers: 'PE Dept + Volunteers',
  teacherCount: 15,
  department: 'Physical Education',
  status: 'Upcoming'
}];

// ==================== UTILITIES ====================
const getStatusVariant = (
status: DutyStatus | TeacherStatus)
: 'success' | 'warning' | 'destructive' | 'default' => {
  const map: Record<string, 'success' | 'warning' | 'destructive' | 'default'> =
  {
    Scheduled: 'default',
    'In Progress': 'warning',
    Completed: 'success',
    Cancelled: 'destructive',
    'Pending Confirmation': 'warning',
    Available: 'success',
    'On Duty': 'warning',
    'On Leave': 'destructive',
    'In Class': 'default',
    Busy: 'warning'
  };
  return map[status] || 'default';
};
const getPriorityVariant = (
priority: DutyPriority)
: 'destructive' | 'warning' | 'success' =>
({
  High: 'destructive',
  Medium: 'warning',
  Low: 'success'
})[priority] as 'destructive' | 'warning' | 'success';
const getSeverityVariant = (
severity: 'High' | 'Medium' | 'Low')
: 'destructive' | 'warning' | 'default' =>
({
  High: 'destructive',
  Medium: 'warning',
  Low: 'default'
})[severity] as 'destructive' | 'warning' | 'default';
const getDutyIcon = (type: DutyType) => {
  const icons: Record<DutyType, React.ElementType> = {
    Assembly: Megaphone,
    Corridor: Building,
    Cafeteria: Coffee,
    Bus: Bus,
    Gate: Shield,
    Library: BookOpen,
    Lab: Activity,
    Playground: Activity,
    Exam: ClipboardList,
    Event: Calendar,
    Substitution: UserPlus,
    Other: ClipboardList
  };
  return icons[type] || ClipboardList;
};
const formatTime = (time: string) => {
  const [h, m] = time.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
};
const formatDate = (date: string) =>
new Date(date).toLocaleDateString('en-IN', {
  weekday: 'short',
  day: '2-digit',
  month: 'short'
});
const formatDateTime = (date: string) =>
new Date(date).toLocaleString('en-IN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});
const isToday = (date: string) =>
new Date(date).toDateString() === new Date().toDateString();
// ==================== COMPONENTS ====================
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg'






}: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
  if (!isOpen) return null;
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
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
const StatCard = ({
  icon: Icon,
  value,
  label,
  color,
  onClick






}: {icon: React.ElementType;value: string | number;label: string;color: string;onClick?: () => void;}) =>
<Card>
    <div
    className={`p-4 flex items-center gap-3 ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    onClick={onClick}>
    
      <Icon className={`w-8 h-8 ${color}`} />
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  </Card>;

const FormField = ({
  label,
  required,
  children




}: {label: string;required?: boolean;children: React.ReactNode;}) =>
<div>
    <label className="block text-sm font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
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

const DutyForm = ({
  duty,
  teachers,
  onSubmit,
  onCancel





}: {duty?: DutyAssignment;teachers: Teacher[];onSubmit: (data: Partial<DutyAssignment>) => void;onCancel: () => void;}) => {
  const [data, setData] = useState({
    title: duty?.title || '',
    type: duty?.type || 'Other' as DutyType,
    description: duty?.description || '',
    date: duty?.date || new Date().toISOString().split('T')[0],
    timeStart: duty?.timeSlot.start || '08:00',
    timeEnd: duty?.timeSlot.end || '09:00',
    locationId: duty?.location.id || LOCATIONS[0].id,
    priority: duty?.priority || 'Medium' as DutyPriority,
    minTeachers: duty?.minTeachers || 1,
    maxTeachers: duty?.maxTeachers || 2,
    recurrence: duty?.recurrence || 'None' as RecurrenceType,
    selectedTeachers:
    duty?.assignedTeachers.map((t) => t.teacherId) || [] as number[],
    notes: duty?.notes || '',
    isSpecialActivity: duty?.isSpecialActivity || false
  });
  const availableTeachers = teachers.filter(
    (t) => !t.onLeaveToday && t.status !== 'On Leave'
  );
  const update = (key: string, value: any) =>
  setData((p) => ({
    ...p,
    [key]: value
  }));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const location = LOCATIONS.find((l) => l.id === data.locationId)!;
    onSubmit({
      title: data.title,
      type: data.type,
      description: data.description,
      date: data.date,
      timeSlot: {
        start: data.timeStart,
        end: data.timeEnd
      },
      location,
      priority: data.priority,
      minTeachers: data.minTeachers,
      maxTeachers: data.maxTeachers,
      recurrence: data.recurrence,
      assignedTeachers: data.selectedTeachers.map((id) => {
        const t = teachers.find((t) => t.id === id)!;
        return {
          teacherId: id,
          teacherName: t.name,
          confirmed: false
        };
      }),
      notes: data.notes,
      isSpecialActivity: data.isSpecialActivity,
      status: 'Scheduled'
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Title" required>
        <Input
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Duty title" />
        
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Type">
          <Select
            value={data.type}
            onChange={(e) => update('type', e.target.value)}>
            
            {DUTY_TYPES.map((t) =>
            <option key={t} value={t}>
                {t}
              </option>
            )}
          </Select>
        </FormField>
        <FormField label="Priority">
          <Select
            value={data.priority}
            onChange={(e) => update('priority', e.target.value)}>
            
            {DUTY_PRIORITIES.map((p) =>
            <option key={p} value={p}>
                {p}
              </option>
            )}
          </Select>
        </FormField>
      </div>
      <FormField label="Description">
        <Textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          rows={2} />
        
      </FormField>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Date" required>
          <Input
            type="date"
            value={data.date}
            onChange={(e) => update('date', e.target.value)} />
          
        </FormField>
        <FormField label="Start Time">
          <Input
            type="time"
            value={data.timeStart}
            onChange={(e) => update('timeStart', e.target.value)} />
          
        </FormField>
        <FormField label="End Time">
          <Input
            type="time"
            value={data.timeEnd}
            onChange={(e) => update('timeEnd', e.target.value)} />
          
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Location">
          <Select
            value={data.locationId}
            onChange={(e) => update('locationId', e.target.value)}>
            
            {LOCATIONS.map((l) =>
            <option key={l.id} value={l.id}>
                {l.name}
              </option>
            )}
          </Select>
        </FormField>
        <FormField label="Recurrence">
          <Select
            value={data.recurrence}
            onChange={(e) => update('recurrence', e.target.value)}>
            
            {RECURRENCE_TYPES.map((r) =>
            <option key={r} value={r}>
                {r}
              </option>
            )}
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Min Teachers">
          <Input
            type="number"
            value={data.minTeachers}
            onChange={(e) => update('minTeachers', +e.target.value)}
            min="1" />
          
        </FormField>
        <FormField label="Max Teachers">
          <Input
            type="number"
            value={data.maxTeachers}
            onChange={(e) => update('maxTeachers', +e.target.value)}
            min="1" />
          
        </FormField>
      </div>
      <FormField label="Assign Teachers">
        <div className="border rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
          {availableTeachers.map((t) =>
          <label
            key={t.id}
            className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded cursor-pointer">
            
              <input
              type="checkbox"
              checked={data.selectedTeachers.includes(t.id)}
              onChange={(e) =>
              update(
                'selectedTeachers',
                e.target.checked ?
                [...data.selectedTeachers, t.id] :
                data.selectedTeachers.filter((id) => id !== t.id)
              )
              }
              className="h-4 w-4 rounded" />
            
              <span className="text-sm">{t.name}</span>
              <span className="text-xs text-gray-400">({t.department})</span>
              <span className="ml-auto text-xs text-gray-500">
                {t.weeklyDutyHours}/{t.maxDutyHours}h
              </span>
            </label>
          )}
        </div>
      </FormField>
      <FormField label="Notes">
        <Textarea
          value={data.notes}
          onChange={(e) => update('notes', e.target.value)}
          rows={2}
          placeholder="Additional notes" />
        
      </FormField>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.isSpecialActivity}
          onChange={(e) => update('isSpecialActivity', e.target.checked)}
          className="h-4 w-4 rounded" />
        
        Mark as Special Activity
      </label>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <CheckCircle className="h-4 w-4 mr-2" />
          {duty ? 'Update' : 'Create'} Duty
        </Button>
      </div>
    </form>);

};
const DutyDetailView = ({
  duty,
  onClose,
  onEdit,
  onDelete





}: {duty: DutyAssignment;onClose: () => void;onEdit: () => void;onDelete: () => void;}) => {
  const DutyIcon = getDutyIcon(duty.type);
  const confirmedCount = duty.assignedTeachers.filter((t) => t.confirmed).length;
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <DutyIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold">{duty.title}</h3>
            <Badge variant={getPriorityVariant(duty.priority)}>
              {duty.priority}
            </Badge>
            <Badge variant={getStatusVariant(duty.status)}>{duty.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {duty.type} •{' '}
            {duty.recurrence !== 'None' ?
            `${duty.recurrence} recurring` :
            'One-time'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>{formatDate(duty.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>
            {formatTime(duty.timeSlot.start)} - {formatTime(duty.timeSlot.end)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{duty.location.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span>
            {duty.assignedTeachers.length}/{duty.maxTeachers} assigned
          </span>
        </div>
      </div>

      {duty.description &&
      <div className="text-sm p-3 bg-gray-50 rounded-lg">
          {duty.description}
        </div>
      }

      {duty.substitutionFor &&
      <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">Substitution</p>
          <p className="text-sm text-yellow-700">
            Covering for {duty.substitutionFor.teacherName} (
            {duty.substitutionFor.reason})
          </p>
        </div>
      }

      <div>
        <h4 className="font-medium text-sm mb-2">
          Assigned Teachers ({confirmedCount}/{duty.assignedTeachers.length}{' '}
          confirmed)
        </h4>
        <div className="space-y-2">
          {duty.assignedTeachers.map((t) =>
          <div
            key={t.teacherId}
            className="flex items-center justify-between p-2 border rounded">
            
              <span className="text-sm font-medium">{t.teacherName}</span>
              <Badge variant={t.confirmed ? 'success' : 'warning'}>
                {t.confirmed ? 'Confirmed' : 'Pending'}
              </Badge>
            </div>
          )}
          {duty.assignedTeachers.length < duty.minTeachers &&
          <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Need {duty.minTeachers - duty.assignedTeachers.length} more
              teacher(s)
            </p>
          }
        </div>
      </div>

      {duty.notes &&
      <div className="text-sm">
          <span className="font-medium">Notes:</span> {duty.notes}
        </div>
      }

      <div className="text-xs text-gray-400 pt-2 border-t">
        Created by {duty.createdBy} on {formatDateTime(duty.createdAt)}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-red-600">
          
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </div>);

};
const TeacherDetailView = ({
  teacher,
  duties,
  onClose




}: {teacher: Teacher;duties: DutyAssignment[];onClose: () => void;}) => {
  const teacherDuties = duties.filter((d) =>
  d.assignedTeachers.some((t) => t.teacherId === teacher.id)
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
          {teacher.name.
          split(' ').
          map((n) => n[0]).
          join('')}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{teacher.name}</h3>
          <p className="text-sm text-gray-500">
            {teacher.designation} • {teacher.department}
          </p>
          <Badge variant={getStatusVariant(teacher.status)}>
            {teacher.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 border rounded-lg">
          <p className="text-2xl font-bold">{teacher.weeklyDutyHours}</p>
          <p className="text-xs text-gray-500">Weekly Hours</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-2xl font-bold">{teacher.completedDuties}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
        <div className="p-3 border rounded-lg">
          <p className="text-2xl font-bold">{teacher.pendingDuties}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Workload</span>
          <span className="text-sm">
            {teacher.weeklyDutyHours}/{teacher.maxDutyHours} hours
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${teacher.weeklyDutyHours / teacher.maxDutyHours >= 1 ? 'bg-red-500' : teacher.weeklyDutyHours / teacher.maxDutyHours >= 0.8 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{
              width: `${Math.min(teacher.weeklyDutyHours / teacher.maxDutyHours * 100, 100)}%`
            }} />
          
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm mb-2">
          Assigned Duties ({teacherDuties.length})
        </h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {teacherDuties.length ?
          teacherDuties.map((d) =>
          <div
            key={d.id}
            className="p-2 border rounded flex items-center justify-between">
            
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(d.date)} • {formatTime(d.timeSlot.start)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(d.status)}>{d.status}</Badge>
              </div>
          ) :

          <p className="text-sm text-gray-500">No duties assigned</p>
          }
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>);

};
const ConflictCard = ({
  conflict,
  onResolve



}: {conflict: Conflict;onResolve: () => void;}) =>
<div
  className={`p-3 border rounded-lg ${conflict.severity === 'High' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
  
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle
        className={`h-4 w-4 mt-0.5 ${conflict.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`} />
      
        <div>
          <p className="text-sm font-medium">{conflict.type}</p>
          <p className="text-xs text-gray-600 mt-1">{conflict.description}</p>
        </div>
      </div>
      <Badge variant={getSeverityVariant(conflict.severity)}>
        {conflict.severity}
      </Badge>
    </div>
    <div className="flex justify-end mt-2">
      <Button size="sm" variant="outline" onClick={onResolve}>
        <CheckCircle className="h-3 w-3 mr-1" />
        Resolve
      </Button>
    </div>
  </div>;

// ==================== MAIN COMPONENT ====================
export function PlannerDashboard() {
  const [teachers] = useState<Teacher[]>(teachersData);
  const [duties, setDuties] = useState<DutyAssignment[]>(dutiesData);
  const [conflicts, setConflicts] = useState<Conflict[]>(conflictsData);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<ModalType>('none');
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<DutyType | 'All'>('All');
  // Stats
  const stats = useMemo(
    () => ({
      totalTeachers: teachers.length,
      availableTeachers: teachers.filter((t) => t.status === 'Available').
      length,
      onLeave: teachers.filter((t) => t.onLeaveToday).length,
      todayDuties: duties.filter((d) => isToday(d.date)).length,
      pendingAssignments: duties.filter(
        (d) =>
        d.status === 'Pending Confirmation' ||
        d.assignedTeachers.length < d.minTeachers
      ).length,
      conflictsCount: conflicts.filter((c) => !c.resolved).length
    }),
    [teachers, duties, conflicts]
  );
  // Filtered duties
  const filteredDuties = useMemo(() => {
    let data = duties.filter((d) => d.date === selectedDate);
    if (search)
    data = data.filter(
      (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.type.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'All') data = data.filter((d) => d.type === typeFilter);
    return data.sort((a, b) => a.timeSlot.start.localeCompare(b.timeSlot.start));
  }, [duties, selectedDate, search, typeFilter]);
  const todayDuties = useMemo(
    () =>
    duties.
    filter((d) => isToday(d.date) && !d.isSpecialActivity).
    sort((a, b) => a.timeSlot.start.localeCompare(b.timeSlot.start)),
    [duties]
  );
  const upcomingSpecial = useMemo(
    () =>
    specialActivitiesData.filter((a) => a.status === 'Upcoming').slice(0, 4),
    []
  );
  const closeModal = () => {
    setModal('none');
    setSelectedDuty(null);
    setSelectedTeacher(null);
  };
  const handleCreateDuty = (data: Partial<DutyAssignment>) => {
    const newDuty: DutyAssignment = {
      id: Math.max(...duties.map((d) => d.id), 0) + 1,
      ...(data as any),
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      tags: []
    };
    setDuties((p) => [...p, newDuty]);
    closeModal();
  };
  const handleUpdateDuty = (data: Partial<DutyAssignment>) => {
    if (!selectedDuty) return;
    setDuties((p) =>
    p.map((d) =>
    d.id === selectedDuty.id ?
    {
      ...d,
      ...data,
      modifiedAt: new Date().toISOString()
    } :
    d
    )
    );
    closeModal();
  };
  const handleDeleteDuty = () => {
    if (!selectedDuty) return;
    setDuties((p) => p.filter((d) => d.id !== selectedDuty.id));
    closeModal();
  };
  const handleResolveConflict = (conflictId: string) => {
    setConflicts((p) =>
    p.map((c) =>
    c.id === conflictId ?
    {
      ...c,
      resolved: true,
      resolvedAt: new Date().toISOString()
    } :
    c
    )
    );
  };
  const navigateDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Teacher Duties Planner Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Overview of teacher workloads, duty assignments, and scheduling
            conflicts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setModal('createDuty')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Duty
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          value={stats.totalTeachers}
          label="Total Teachers"
          color="text-blue-500" />
        
        <StatCard
          icon={UserCheck}
          value={stats.availableTeachers}
          label="Available Now"
          color="text-green-500" />
        
        <StatCard
          icon={UserX}
          value={stats.onLeave}
          label="On Leave"
          color="text-gray-500" />
        
        <StatCard
          icon={Calendar}
          value={stats.todayDuties}
          label="Today's Duties"
          color="text-purple-500" />
        
        <StatCard
          icon={Clock}
          value={stats.pendingAssignments}
          label="Pending"
          color="text-orange-500" />
        
        <StatCard
          icon={AlertTriangle}
          value={stats.conflictsCount}
          label="Conflicts"
          color="text-red-500" />
        
      </div>

      {/* Conflicts Alert */}
      {conflicts.filter((c) => !c.resolved).length > 0 &&
      <Card>
          <div className="p-4">
            <h3 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5" />
              Active Conflicts ({conflicts.filter((c) => !c.resolved).length})
            </h3>
            <div className="space-y-2">
              {conflicts.
            filter((c) => !c.resolved).
            map((c) =>
            <ConflictCard
              key={c.id}
              conflict={c}
              onResolve={() => handleResolveConflict(c.id)} />

            )}
            </div>
          </div>
        </Card>
      }

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Duty Roster */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Today's Duty Roster</h3>
              <span className="text-sm text-gray-500">
                {todayDuties.length} duties
              </span>
            </div>
            <div className="space-y-3">
              {todayDuties.length ?
              todayDuties.map((duty) => {
                const DutyIcon = getDutyIcon(duty.type);
                return (
                  <div
                    key={duty.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      setSelectedDuty(duty);
                      setModal('viewDuty');
                    }}>
                    
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <DutyIcon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{duty.title}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatTime(duty.timeSlot.start)} -{' '}
                              {formatTime(duty.timeSlot.end)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={getStatusVariant(duty.status)}>
                          {duty.status}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {duty.location.name}
                        </span>
                        <span className="text-blue-600 font-medium">
                          {duty.assignedTeachers.
                        map((t) => t.teacherName.split(' ')[0]).
                        join(', ')}
                        </span>
                      </div>
                    </div>);

              }) :

              <p className="text-sm text-gray-500 text-center py-4">
                  No duties scheduled for today
                </p>
              }
            </div>
          </div>
        </Card>

        {/* Upcoming Special Activities */}
        <Card>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Upcoming Special Activities</h3>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingSpecial.map((activity) =>
              <div key={activity.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.date} • {activity.duration}
                      </p>
                    </div>
                    <Badge variant="default">{activity.status}</Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      {activity.description}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                      {activity.assignedTeachers} ({activity.teacherCount})
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Duty Calendar View */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(-1)}>
                
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{formatDate(selectedDate)}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate(1)}>
                
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                setSelectedDate(new Date().toISOString().split('T')[0])
                }>
                
                Today
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search duties..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 border rounded text-sm" />
                
              </div>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-32">
                
                <option value="All">All Types</option>
                {DUTY_TYPES.map((t) =>
                <option key={t} value={t}>
                    {t}
                  </option>
                )}
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium">Time</th>
                  <th className="text-left py-2 px-3 font-medium">Duty</th>
                  <th className="text-left py-2 px-3 font-medium">Location</th>
                  <th className="text-left py-2 px-3 font-medium">Assigned</th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDuties.length ?
                filteredDuties.map((duty) =>
                <tr key={duty.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-mono text-xs">
                          {formatTime(duty.timeSlot.start)} -{' '}
                          {formatTime(duty.timeSlot.end)}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">{duty.type}</Badge>
                          <span className="font-medium">{duty.title}</span>
                          {duty.recurrence !== 'None' &&
                      <Repeat className="h-3 w-3 text-gray-400" />
                      }
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-600">
                        {duty.location.name}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1">
                          <span
                        className={`${duty.assignedTeachers.length < duty.minTeachers ? 'text-red-500' : 'text-gray-600'}`}>
                        
                            {duty.assignedTeachers.length}/{duty.minTeachers}
                          </span>
                          {duty.assignedTeachers.length < duty.minTeachers &&
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      }
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant={getStatusVariant(duty.status)}>
                          {duty.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex justify-end gap-1">
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDuty(duty);
                          setModal('viewDuty');
                        }}>
                        
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDuty(duty);
                          setModal('editDuty');
                        }}>
                        
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                ) :

                <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No duties found for this date
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Teacher Workload Overview */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Teacher Workload Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-3 font-medium">Teacher</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Department
                  </th>
                  <th className="text-left py-2 px-3 font-medium">Status</th>
                  <th className="text-left py-2 px-3 font-medium">
                    Weekly Hours
                  </th>
                  <th className="text-left py-2 px-3 font-medium">
                    This Month
                  </th>
                  <th className="text-right py-2 px-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.slice(0, 6).map((t) =>
                <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium">{t.name}</td>
                    <td className="py-2 px-3 text-gray-600">{t.department}</td>
                    <td className="py-2 px-3">
                      <Badge variant={getStatusVariant(t.status)}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div
                          className={`h-1.5 rounded-full ${t.weeklyDutyHours / t.maxDutyHours >= 1 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{
                            width: `${Math.min(t.weeklyDutyHours / t.maxDutyHours * 100, 100)}%`
                          }} />
                        
                        </div>
                        <span className="text-xs">
                          {t.weeklyDutyHours}/{t.maxDutyHours}h
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">
                      {t.completedDuties} done • {t.pendingDuties} pending
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedTeacher(t);
                        setModal('viewTeacher' as ModalType);
                      }}>
                      
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal
        isOpen={modal === 'createDuty'}
        onClose={closeModal}
        title="Create New Duty"
        size="lg">
        
        <DutyForm
          teachers={teachers}
          onSubmit={handleCreateDuty}
          onCancel={closeModal} />
        
      </Modal>

      <Modal
        isOpen={modal === 'editDuty'}
        onClose={closeModal}
        title="Edit Duty"
        size="lg">
        
        {selectedDuty &&
        <DutyForm
          duty={selectedDuty}
          teachers={teachers}
          onSubmit={handleUpdateDuty}
          onCancel={closeModal} />

        }
      </Modal>

      <Modal
        isOpen={modal === 'viewDuty'}
        onClose={closeModal}
        title="Duty Details"
        size="md">
        
        {selectedDuty &&
        <DutyDetailView
          duty={selectedDuty}
          onClose={closeModal}
          onEdit={() => setModal('editDuty')}
          onDelete={handleDeleteDuty} />

        }
      </Modal>

      <Modal
        isOpen={modal === 'viewTeacher' as ModalType}
        onClose={closeModal}
        title="Teacher Details"
        size="md">
        
        {selectedTeacher &&
        <TeacherDetailView
          teacher={selectedTeacher}
          duties={duties}
          onClose={closeModal} />

        }
      </Modal>

      <Modal
        isOpen={modal === 'deleteDuty'}
        onClose={closeModal}
        title="Delete Duty"
        size="sm">
        
        {selectedDuty &&
        <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-sm">
                Are you sure you want to delete "
                <span className="font-medium">{selectedDuty.title}</span>"?
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteDuty}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}