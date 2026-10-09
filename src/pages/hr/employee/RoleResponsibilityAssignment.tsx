import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  ChevronRight,
  Home,
  Users,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  Edit,
  Plus,
  Download,
  FileText,
  Printer,
  RefreshCw,
  X,
  Check,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Filter,
  Settings,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Zap,
  UserCheck,
  UserX,
  BookOpen,
  GraduationCap,
  Building,
  Briefcase,
  CalendarDays,
  ClipboardList,
  MoreHorizontal,
  ArrowRight,
  Repeat,
  History,
  PieChart,
  Activity,
  MoveRight,
  ArrowLeftRight,
  Shuffle,
  Undo2,
  Save,
  Trash2,
  Copy,
  Layers } from
'lucide-react';

// ==================== TYPES ====================
interface Teacher {
  id: string;
  code: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  subjects: string[];
  maxWeeklyLoad: number;
  currentLoad: number;
  classes: string[];
  status: 'Active' | 'On Leave' | 'Part-time';
  joiningDate: string;
  periodDistribution: PeriodDistribution;
  allocations: SubjectAllocation[];
  freePeriods: FreePeriod[];
  substitutionHistory: SubstitutionRecord[];
  extraDuties: string[];
}

interface PeriodDistribution {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
}

interface SubjectAllocation {
  id: string;
  subject: string;
  class: string;
  section: string;
  periodsPerWeek: number;
  type: 'Regular' | 'Lab' | 'Co-curricular';
  teacherId?: string;
}

interface FreePeriod {
  day: string;
  period: number;
}

interface SubstitutionRecord {
  id: string;
  date: string;
  originalTeacher: string;
  originalTeacherId: string;
  substituteTeacher?: string;
  substituteTeacherId?: string;
  period: number;
  class: string;
  subject: string;
  reason: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
}

interface WorkloadTransfer {
  id: string;
  timestamp: string;
  fromTeacherId: string;
  fromTeacherName: string;
  toTeacherId: string;
  toTeacherName: string;
  allocation: SubjectAllocation;
  reason: string;
  status: 'Completed' | 'Pending' | 'Reverted';
}

interface WorkloadConfig {
  maxWeeklyLoad: number;
  overloadThreshold: number;
  underutilizedThreshold: number;
  periodsPerDay: number;
  workingDays: string[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

type ViewMode = 'teacher-wise' | 'period-distribution' | 'heatmap';
type TabType = 'workload' | 'substitutions' | 'transfers' | 'analytics';

interface SelectOption {
  value: string;
  label: string;
}

// ==================== MOCK DATA ====================
const academicYears: SelectOption[] = [
{ value: '2024-25', label: '2024-25 (Current)' },
{ value: '2023-24', label: '2023-24' }];


const terms: SelectOption[] = [
{ value: 'term-1', label: 'Term 1 (Apr - Sep)' },
{ value: 'term-2', label: 'Term 2 (Oct - Mar)' }];


const departments: SelectOption[] = [
{ value: '', label: 'All Departments' },
{ value: 'mathematics', label: 'Mathematics' },
{ value: 'science', label: 'Science' },
{ value: 'english', label: 'English' },
{ value: 'hindi', label: 'Hindi' },
{ value: 'social-science', label: 'Social Science' },
{ value: 'computer', label: 'Computer Science' },
{ value: 'physical-education', label: 'Physical Education' },
{ value: 'arts', label: 'Arts & Craft' }];


const classes: SelectOption[] = [
{ value: '', label: 'All Classes' },
{ value: '6', label: 'Class 6' },
{ value: '7', label: 'Class 7' },
{ value: '8', label: 'Class 8' },
{ value: '9', label: 'Class 9' },
{ value: '10', label: 'Class 10' },
{ value: '11', label: 'Class 11' },
{ value: '12', label: 'Class 12' }];


const sections: SelectOption[] = [
{ value: '', label: 'All Sections' },
{ value: 'A', label: 'Section A' },
{ value: 'B', label: 'Section B' },
{ value: 'C', label: 'Section C' },
{ value: 'D', label: 'Section D' }];


const transferReasons: SelectOption[] = [
{ value: '', label: 'Select Reason' },
{ value: 'workload-balancing', label: 'Workload Balancing' },
{ value: 'teacher-request', label: 'Teacher Request' },
{ value: 'expertise-match', label: 'Better Expertise Match' },
{ value: 'schedule-conflict', label: 'Schedule Conflict' },
{ value: 'temporary-absence', label: 'Temporary Absence' },
{ value: 'administrative', label: 'Administrative Decision' },
{ value: 'other', label: 'Other' }];


const createMockTeachers = (): Teacher[] => [
{
  id: 'TCH001',
  code: 'TCH001',
  name: 'Mr. Arun Kumar',
  avatar: 'AK',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  email: 'arun.kumar@school.edu',
  phone: '+91 98765 43210',
  subjects: ['Mathematics', 'Statistics'],
  maxWeeklyLoad: 30,
  currentLoad: 32,
  classes: ['8A', '8B', '9A', '9B', '10A'],
  status: 'Active',
  joiningDate: '2018-06-15',
  periodDistribution: { mon: 6, tue: 5, wed: 7, thu: 6, fri: 8, sat: 0 },
  allocations: [
  { id: 'AL001', subject: 'Mathematics', class: '8', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH001' },
  { id: 'AL002', subject: 'Mathematics', class: '8', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH001' },
  { id: 'AL003', subject: 'Mathematics', class: '9', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH001' },
  { id: 'AL004', subject: 'Mathematics', class: '9', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH001' },
  { id: 'AL005', subject: 'Statistics', class: '10', section: 'A', periodsPerWeek: 8, type: 'Regular', teacherId: 'TCH001' }],

  freePeriods: [
  { day: 'Monday', period: 7 },
  { day: 'Wednesday', period: 1 },
  { day: 'Friday', period: 3 }],

  substitutionHistory: [
  { id: '1', date: '2025-01-15', originalTeacher: 'Ms. Priya Sharma', originalTeacherId: 'TCH002', period: 3, class: '7A', subject: 'Mathematics', reason: 'Medical Leave', status: 'Completed' }],

  extraDuties: ['Exam Coordinator', 'Math Club Incharge']
},
{
  id: 'TCH002',
  code: 'TCH002',
  name: 'Ms. Priya Sharma',
  avatar: 'PS',
  department: 'English',
  designation: 'Senior Teacher',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43211',
  subjects: ['English', 'Literature'],
  maxWeeklyLoad: 30,
  currentLoad: 26,
  classes: ['7A', '7B', '8A', '8B'],
  status: 'Active',
  joiningDate: '2019-04-01',
  periodDistribution: { mon: 5, tue: 5, wed: 5, thu: 5, fri: 6, sat: 0 },
  allocations: [
  { id: 'AL006', subject: 'English', class: '7', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH002' },
  { id: 'AL007', subject: 'English', class: '7', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH002' },
  { id: 'AL008', subject: 'English', class: '8', section: 'A', periodsPerWeek: 7, type: 'Regular', teacherId: 'TCH002' },
  { id: 'AL009', subject: 'Literature', class: '8', section: 'B', periodsPerWeek: 7, type: 'Regular', teacherId: 'TCH002' }],

  freePeriods: [
  { day: 'Monday', period: 6 },
  { day: 'Tuesday', period: 6 },
  { day: 'Thursday', period: 6 },
  { day: 'Friday', period: 7 }],

  substitutionHistory: [],
  extraDuties: ['Literary Club']
},
{
  id: 'TCH003',
  code: 'TCH003',
  name: 'Dr. Rajesh Verma',
  avatar: 'RV',
  department: 'Science',
  designation: 'HOD - Science',
  email: 'rajesh.verma@school.edu',
  phone: '+91 98765 43212',
  subjects: ['Physics', 'General Science'],
  maxWeeklyLoad: 24,
  currentLoad: 22,
  classes: ['10A', '10B', '11A', '11B'],
  status: 'Active',
  joiningDate: '2015-07-01',
  periodDistribution: { mon: 4, tue: 4, wed: 5, thu: 5, fri: 4, sat: 0 },
  allocations: [
  { id: 'AL010', subject: 'Physics', class: '10', section: 'A', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH003' },
  { id: 'AL011', subject: 'Physics', class: '10', section: 'B', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH003' },
  { id: 'AL012', subject: 'Physics', class: '11', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH003' },
  { id: 'AL013', subject: 'Physics', class: '11', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH003' }],

  freePeriods: [
  { day: 'Monday', period: 5 },
  { day: 'Monday', period: 6 },
  { day: 'Friday', period: 5 },
  { day: 'Friday', period: 6 }],

  substitutionHistory: [],
  extraDuties: ['Science Fair Coordinator', 'Lab Incharge']
},
{
  id: 'TCH004',
  code: 'TCH004',
  name: 'Mrs. Sunita Devi',
  avatar: 'SD',
  department: 'Hindi',
  designation: 'Teacher',
  email: 'sunita.devi@school.edu',
  phone: '+91 98765 43213',
  subjects: ['Hindi', 'Sanskrit'],
  maxWeeklyLoad: 30,
  currentLoad: 16,
  classes: ['6A', '6B', '7A'],
  status: 'Active',
  joiningDate: '2020-08-01',
  periodDistribution: { mon: 3, tue: 3, wed: 3, thu: 4, fri: 3, sat: 0 },
  allocations: [
  { id: 'AL014', subject: 'Hindi', class: '6', section: 'A', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH004' },
  { id: 'AL015', subject: 'Hindi', class: '6', section: 'B', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH004' },
  { id: 'AL016', subject: 'Hindi', class: '7', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH004' }],

  freePeriods: [
  { day: 'Monday', period: 4 },
  { day: 'Monday', period: 5 },
  { day: 'Tuesday', period: 4 },
  { day: 'Tuesday', period: 5 },
  { day: 'Wednesday', period: 4 },
  { day: 'Thursday', period: 5 },
  { day: 'Friday', period: 4 },
  { day: 'Friday', period: 5 }],

  substitutionHistory: [],
  extraDuties: []
},
{
  id: 'TCH005',
  code: 'TCH005',
  name: 'Mr. Amit Patel',
  avatar: 'AP',
  department: 'Science',
  designation: 'Senior Teacher',
  email: 'amit.patel@school.edu',
  phone: '+91 98765 43214',
  subjects: ['Chemistry', 'General Science'],
  maxWeeklyLoad: 30,
  currentLoad: 34,
  classes: ['9A', '9B', '10A', '10B', '11A', '11B'],
  status: 'Active',
  joiningDate: '2017-06-15',
  periodDistribution: { mon: 7, tue: 6, wed: 7, thu: 7, fri: 7, sat: 0 },
  allocations: [
  { id: 'AL017', subject: 'Chemistry', class: '9', section: 'A', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH005' },
  { id: 'AL018', subject: 'Chemistry', class: '9', section: 'B', periodsPerWeek: 5, type: 'Regular', teacherId: 'TCH005' },
  { id: 'AL019', subject: 'Chemistry', class: '10', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH005' },
  { id: 'AL020', subject: 'Chemistry', class: '10', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH005' },
  { id: 'AL021', subject: 'Chemistry', class: '11', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH005' },
  { id: 'AL022', subject: 'Chemistry', class: '11', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH005' }],

  freePeriods: [],
  substitutionHistory: [],
  extraDuties: ['Chemistry Lab Incharge']
},
{
  id: 'TCH006',
  code: 'TCH006',
  name: 'Ms. Neha Gupta',
  avatar: 'NG',
  department: 'Computer Science',
  designation: 'Teacher',
  email: 'neha.gupta@school.edu',
  phone: '+91 98765 43215',
  subjects: ['Computer Science', 'IT'],
  maxWeeklyLoad: 30,
  currentLoad: 28,
  classes: ['8A', '8B', '9A', '9B', '10A', '10B'],
  status: 'Active',
  joiningDate: '2019-07-01',
  periodDistribution: { mon: 5, tue: 6, wed: 5, thu: 6, fri: 6, sat: 0 },
  allocations: [
  { id: 'AL023', subject: 'Computer Science', class: '8', section: 'A', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' },
  { id: 'AL024', subject: 'Computer Lab', class: '8', section: 'A', periodsPerWeek: 2, type: 'Lab', teacherId: 'TCH006' },
  { id: 'AL025', subject: 'Computer Science', class: '8', section: 'B', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' },
  { id: 'AL026', subject: 'Computer Lab', class: '8', section: 'B', periodsPerWeek: 2, type: 'Lab', teacherId: 'TCH006' },
  { id: 'AL027', subject: 'Computer Science', class: '9', section: 'A', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' },
  { id: 'AL028', subject: 'Computer Science', class: '9', section: 'B', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' },
  { id: 'AL029', subject: 'IT', class: '10', section: 'A', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' },
  { id: 'AL030', subject: 'IT', class: '10', section: 'B', periodsPerWeek: 4, type: 'Regular', teacherId: 'TCH006' }],

  freePeriods: [
  { day: 'Monday', period: 6 },
  { day: 'Wednesday', period: 6 }],

  substitutionHistory: [],
  extraDuties: ['Computer Lab Incharge', 'Website Coordinator']
},
{
  id: 'TCH007',
  code: 'TCH007',
  name: 'Mr. Vikram Singh',
  avatar: 'VS',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  email: 'vikram.singh@school.edu',
  phone: '+91 98765 43216',
  subjects: ['Physical Education', 'Sports'],
  maxWeeklyLoad: 36,
  currentLoad: 30,
  classes: ['6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B'],
  status: 'Active',
  joiningDate: '2018-04-01',
  periodDistribution: { mon: 6, tue: 6, wed: 6, thu: 6, fri: 6, sat: 0 },
  allocations: [
  { id: 'AL031', subject: 'Physical Education', class: '6', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL032', subject: 'Physical Education', class: '6', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL033', subject: 'Physical Education', class: '7', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL034', subject: 'Physical Education', class: '7', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL035', subject: 'Physical Education', class: '8', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL036', subject: 'Physical Education', class: '8', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL037', subject: 'Physical Education', class: '9', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL038', subject: 'Physical Education', class: '9', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL039', subject: 'Physical Education', class: '10', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' },
  { id: 'AL040', subject: 'Physical Education', class: '10', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH007' }],

  freePeriods: [
  { day: 'Monday', period: 7 },
  { day: 'Tuesday', period: 7 },
  { day: 'Wednesday', period: 7 },
  { day: 'Thursday', period: 7 },
  { day: 'Friday', period: 7 }],

  substitutionHistory: [],
  extraDuties: ['Sports Day Coordinator', 'Cricket Team Coach', 'Football Team Coach']
},
{
  id: 'TCH008',
  code: 'TCH008',
  name: 'Mrs. Kavita Joshi',
  avatar: 'KJ',
  department: 'Social Science',
  designation: 'Teacher',
  email: 'kavita.joshi@school.edu',
  phone: '+91 98765 43217',
  subjects: ['History', 'Geography', 'Civics'],
  maxWeeklyLoad: 30,
  currentLoad: 24,
  classes: ['8A', '8B', '9A', '9B'],
  status: 'Active',
  joiningDate: '2020-06-15',
  periodDistribution: { mon: 5, tue: 5, wed: 4, thu: 5, fri: 5, sat: 0 },
  allocations: [
  { id: 'AL041', subject: 'History', class: '8', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL042', subject: 'Geography', class: '8', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL043', subject: 'History', class: '8', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL044', subject: 'Geography', class: '8', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL045', subject: 'History', class: '9', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL046', subject: 'Geography', class: '9', section: 'A', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL047', subject: 'History', class: '9', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' },
  { id: 'AL048', subject: 'Civics', class: '9', section: 'B', periodsPerWeek: 3, type: 'Regular', teacherId: 'TCH008' }],

  freePeriods: [
  { day: 'Monday', period: 6 },
  { day: 'Wednesday', period: 5 },
  { day: 'Wednesday', period: 6 },
  { day: 'Friday', period: 6 }],

  substitutionHistory: [],
  extraDuties: ['Social Science Club']
},
{
  id: 'TCH009',
  code: 'TCH009',
  name: 'Mr. Rakesh Sharma',
  avatar: 'RS',
  department: 'Mathematics',
  designation: 'Part-time Teacher',
  email: 'rakesh.sharma@school.edu',
  phone: '+91 98765 43218',
  subjects: ['Mathematics'],
  maxWeeklyLoad: 18,
  currentLoad: 12,
  classes: ['6A', '6B'],
  status: 'Part-time',
  joiningDate: '2022-04-01',
  periodDistribution: { mon: 3, tue: 3, wed: 0, thu: 3, fri: 3, sat: 0 },
  allocations: [
  { id: 'AL049', subject: 'Mathematics', class: '6', section: 'A', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH009' },
  { id: 'AL050', subject: 'Mathematics', class: '6', section: 'B', periodsPerWeek: 6, type: 'Regular', teacherId: 'TCH009' }],

  freePeriods: [],
  substitutionHistory: [],
  extraDuties: []
},
{
  id: 'TCH010',
  code: 'TCH010',
  name: 'Ms. Anita Rao',
  avatar: 'AR',
  department: 'Arts',
  designation: 'Teacher',
  email: 'anita.rao@school.edu',
  phone: '+91 98765 43219',
  subjects: ['Art', 'Craft', 'Drawing'],
  maxWeeklyLoad: 30,
  currentLoad: 20,
  classes: ['6A', '6B', '7A', '7B', '8A', '8B'],
  status: 'Active',
  joiningDate: '2021-07-01',
  periodDistribution: { mon: 4, tue: 4, wed: 4, thu: 4, fri: 4, sat: 0 },
  allocations: [
  { id: 'AL051', subject: 'Art', class: '6', section: 'A', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL052', subject: 'Art', class: '6', section: 'B', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL053', subject: 'Art', class: '7', section: 'A', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL054', subject: 'Art', class: '7', section: 'B', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL055', subject: 'Craft', class: '8', section: 'A', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL056', subject: 'Craft', class: '8', section: 'B', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL057', subject: 'Drawing', class: '6', section: 'A', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL058', subject: 'Drawing', class: '6', section: 'B', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL059', subject: 'Drawing', class: '7', section: 'A', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' },
  { id: 'AL060', subject: 'Drawing', class: '7', section: 'B', periodsPerWeek: 2, type: 'Co-curricular', teacherId: 'TCH010' }],

  freePeriods: [
  { day: 'Monday', period: 5 },
  { day: 'Monday', period: 6 },
  { day: 'Tuesday', period: 5 },
  { day: 'Tuesday', period: 6 },
  { day: 'Wednesday', period: 5 },
  { day: 'Wednesday', period: 6 },
  { day: 'Thursday', period: 5 },
  { day: 'Thursday', period: 6 },
  { day: 'Friday', period: 5 },
  { day: 'Friday', period: 6 }],

  substitutionHistory: [],
  extraDuties: ['Art Exhibition Coordinator']
}];


const initialSubstitutionRecords: SubstitutionRecord[] = [
{ id: '1', date: '2025-01-20', originalTeacher: 'Ms. Priya Sharma', originalTeacherId: 'TCH002', substituteTeacher: 'Mr. Arun Kumar', substituteTeacherId: 'TCH001', period: 3, class: '7A', subject: 'English', reason: 'Medical Leave', status: 'Completed' },
{ id: '2', date: '2025-01-21', originalTeacher: 'Mr. Amit Patel', originalTeacherId: 'TCH005', period: 5, class: '9B', subject: 'Chemistry', reason: 'Personal Leave', status: 'Upcoming' },
{ id: '3', date: '2025-01-18', originalTeacher: 'Mrs. Kavita Joshi', originalTeacherId: 'TCH008', substituteTeacher: 'Dr. Rajesh Verma', substituteTeacherId: 'TCH003', period: 2, class: '8A', subject: 'History', reason: 'Training', status: 'Completed' },
{ id: '4', date: '2025-01-22', originalTeacher: 'Dr. Rajesh Verma', originalTeacherId: 'TCH003', period: 4, class: '10A', subject: 'Physics', reason: 'Meeting', status: 'Upcoming' },
{ id: '5', date: '2025-01-19', originalTeacher: 'Ms. Neha Gupta', originalTeacherId: 'TCH006', period: 6, class: '9A', subject: 'Computer Science', reason: 'Sick Leave', status: 'Cancelled' }];


// ==================== UTILITY COMPONENTS ====================
const ToastContainer: React.FC<{toasts: Toast[];onDismiss: (id: string) => void;}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  const getStyle = (type: Toast['type']): string => {
    switch (type) {
      case 'success':return 'bg-green-50 border-green-200 text-green-800';
      case 'error':return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: Toast['type']): React.ReactNode => {
    switch (type) {
      case 'success':return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg min-w-[320px] animate-slide-in ${getStyle(toast.type)}`}>

          {getIcon(toast.type)}
          <span className="font-medium flex-1">{toast.message}</span>
          <button onClick={() => onDismiss(toast.id)} className="hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>);

};

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: {value: number;isUp: boolean;};
  onClick?: () => void;
}> = ({ title, value, icon, color, bgColor, trend, onClick }) =>
<div
  onClick={onClick}
  className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-blue-300' : ''}`}>

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend &&
      <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend.value}% from last term</span>
          </div>
      }
      </div>
      <div className={`p-3 rounded-xl ${bgColor}`}>
        {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${color}` })}
      </div>
    </div>
  </div>;


const WorkloadStatusBadge: React.FC<{current: number;max: number;}> = ({ current, max }) => {
  const percentage = current / max * 100;

  if (percentage > 100) {
    return (
      <Badge variant="danger" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Overloaded
      </Badge>);

  }
  if (percentage < 60) {
    return (
      <Badge variant="warning" className="flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Underutilized
      </Badge>);

  }
  return (
    <Badge variant="success" className="flex items-center gap-1">
      <CheckCircle className="w-3 h-3" />
      Normal
    </Badge>);

};

const WorkloadProgressBar: React.FC<{current: number;max: number;showLabels?: boolean;}> = ({
  current,
  max,
  showLabels = true
}) => {
  const percentage = Math.min(current / max * 100, 100);
  const overloadPercentage = current > max ? (current - max) / max * 100 : 0;

  const getColor = (): string => {
    if (current > max) return 'bg-red-500';
    if (percentage >= 80) return 'bg-amber-500';
    if (percentage < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-1">
      {showLabels &&
      <div className="flex justify-between text-xs">
          <span className={current > max ? 'text-red-600 font-medium' : 'text-gray-600'}>
            {current} / {max} periods
          </span>
          <span className={current > max ? 'text-red-600 font-medium' : 'text-gray-500'}>
            {Math.round(current / max * 100)}%
          </span>
        </div>
      }
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }} />

        {overloadPercentage > 0 &&
        <div
          className="absolute top-0 right-0 h-full bg-red-300 animate-pulse"
          style={{ width: `${Math.min(overloadPercentage, 20)}%` }} />

        }
      </div>
    </div>);

};

const TeacherAvatar: React.FC<{
  avatar: string;
  current: number;
  max: number;
  size?: 'sm' | 'md' | 'lg';
}> = ({ avatar, current, max, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-xl'
  };

  const getColor = (): string => {
    if (current > max) return 'bg-red-100 text-red-600 ring-red-300';
    if (current / max < 0.6) return 'bg-yellow-100 text-yellow-600 ring-yellow-300';
    return 'bg-blue-100 text-blue-600 ring-blue-300';
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold ring-2 ${getColor()}`}>
      {avatar}
    </div>);

};

// ==================== MAIN COMPONENT ====================
export function StaffWorkloadManagement(): React.ReactElement {
  // Filter State
  const [academicYear, setAcademicYear] = useState<string>('2024-25');
  const [term, setTerm] = useState<string>('term-1');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('');
  const [sectionFilter, setSectionFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'overloaded' | 'underutilized' | 'normal'>('all');

  // View State
  const [activeTab, setActiveTab] = useState<TabType>('workload');
  const [viewMode, setViewMode] = useState<ViewMode>('teacher-wise');
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Data State
  const [teachers, setTeachers] = useState<Teacher[]>(() => createMockTeachers());
  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>(initialSubstitutionRecords);
  const [transferHistory, setTransferHistory] = useState<WorkloadTransfer[]>([]);

  // Modal State
  const [showTeacherDetailModal, setShowTeacherDetailModal] = useState<boolean>(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showBulkTransferModal, setShowBulkTransferModal] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Transfer State
  const [transferForm, setTransferForm] = useState<{
    fromTeacherId: string;
    toTeacherId: string;
    selectedAllocations: string[];
    reason: string;
  }>({
    fromTeacherId: '',
    toTeacherId: '',
    selectedAllocations: [],
    reason: ''
  });

  // Substitution Form State
  const [substitutionForm, setSubstitutionForm] = useState({
    date: '',
    originalTeacherId: '',
    substituteTeacherId: '',
    period: '',
    class: '',
    subject: '',
    reason: ''
  });

  // Config State
  const [workloadConfig, setWorkloadConfig] = useState<WorkloadConfig>({
    maxWeeklyLoad: 30,
    overloadThreshold: 100,
    underutilizedThreshold: 60,
    periodsPerDay: 8,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ==================== TOAST HELPERS ====================
  const addToast = useCallback((type: Toast['type'], message: string): void => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const dismissToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ==================== COMPUTED VALUES ====================
  const filteredTeachers = useMemo((): Teacher[] => {
    return teachers.filter((teacher) => {
      const matchesSearch = !searchQuery ||
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDepartment = !departmentFilter ||
      teacher.department.toLowerCase().replace(/\s+/g, '-') === departmentFilter;

      const matchesClass = !classFilter ||
      teacher.classes.some((c) => c.startsWith(classFilter));

      const matchesSection = !sectionFilter ||
      teacher.classes.some((c) => c.endsWith(sectionFilter));

      const matchesStatus = statusFilter === 'all' ||
      statusFilter === 'overloaded' && teacher.currentLoad > teacher.maxWeeklyLoad ||
      statusFilter === 'underutilized' && teacher.currentLoad / teacher.maxWeeklyLoad < 0.6 ||
      statusFilter === 'normal' && teacher.currentLoad <= teacher.maxWeeklyLoad && teacher.currentLoad / teacher.maxWeeklyLoad >= 0.6;

      return matchesSearch && matchesDepartment && matchesClass && matchesSection && matchesStatus;
    });
  }, [teachers, searchQuery, departmentFilter, classFilter, sectionFilter, statusFilter]);

  const statistics = useMemo(() => {
    const totalTeachers = teachers.length;
    const totalLoad = teachers.reduce((sum, t) => sum + t.currentLoad, 0);
    const avgWeeklyLoad = Math.round(totalLoad / totalTeachers);
    const overloadedTeachers = teachers.filter((t) => t.currentLoad > t.maxWeeklyLoad).length;
    const underutilizedTeachers = teachers.filter((t) => t.currentLoad / t.maxWeeklyLoad < 0.6).length;
    const totalPeriods = totalLoad;

    return { totalTeachers, avgWeeklyLoad, overloadedTeachers, underutilizedTeachers, totalPeriods };
  }, [teachers]);

  const pendingSubstitutions = useMemo((): number => {
    return substitutions.filter((s) => s.status === 'Upcoming').length;
  }, [substitutions]);

  const pendingTransfers = useMemo((): number => {
    return transferHistory.filter((t) => t.status === 'Pending').length;
  }, [transferHistory]);

  // Get source teacher's allocations for transfer
  const sourceTeacherAllocations = useMemo((): SubjectAllocation[] => {
    if (!transferForm.fromTeacherId) return [];
    const teacher = teachers.find((t) => t.id === transferForm.fromTeacherId);
    return teacher?.allocations || [];
  }, [transferForm.fromTeacherId, teachers]);

  // Get available teachers for transfer (excluding source and those who would be overloaded)
  const availableTargetTeachers = useMemo((): Teacher[] => {
    if (!transferForm.fromTeacherId) return [];

    const selectedAllocationsLoad = transferForm.selectedAllocations.reduce((sum, allocId) => {
      const alloc = sourceTeacherAllocations.find((a) => a.id === allocId);
      return sum + (alloc?.periodsPerWeek || 0);
    }, 0);

    return teachers.filter((t) => {
      if (t.id === transferForm.fromTeacherId) return false;
      if (t.status === 'On Leave') return false;
      const projectedLoad = t.currentLoad + selectedAllocationsLoad;
      return projectedLoad <= t.maxWeeklyLoad * 1.1; // Allow up to 10% over max for flexibility
    });
  }, [transferForm.fromTeacherId, transferForm.selectedAllocations, teachers, sourceTeacherAllocations]);

  // ==================== TRANSFER HANDLERS ====================
  const handleOpenTransferModal = (teacher: Teacher): void => {
    setTransferForm({
      fromTeacherId: teacher.id,
      toTeacherId: '',
      selectedAllocations: [],
      reason: ''
    });
    setShowTransferModal(true);
  };

  const handleToggleAllocation = (allocationId: string): void => {
    setTransferForm((prev) => ({
      ...prev,
      selectedAllocations: prev.selectedAllocations.includes(allocationId) ?
      prev.selectedAllocations.filter((id) => id !== allocationId) :
      [...prev.selectedAllocations, allocationId]
    }));
  };

  const handleSelectAllAllocations = (): void => {
    if (transferForm.selectedAllocations.length === sourceTeacherAllocations.length) {
      setTransferForm((prev) => ({ ...prev, selectedAllocations: [] }));
    } else {
      setTransferForm((prev) => ({
        ...prev,
        selectedAllocations: sourceTeacherAllocations.map((a) => a.id)
      }));
    }
  };

  const calculateTransferImpact = useMemo(() => {
    const totalPeriods = transferForm.selectedAllocations.reduce((sum, allocId) => {
      const alloc = sourceTeacherAllocations.find((a) => a.id === allocId);
      return sum + (alloc?.periodsPerWeek || 0);
    }, 0);

    const sourceTeacher = teachers.find((t) => t.id === transferForm.fromTeacherId);
    const targetTeacher = teachers.find((t) => t.id === transferForm.toTeacherId);

    return {
      totalPeriods,
      sourceNewLoad: sourceTeacher ? sourceTeacher.currentLoad - totalPeriods : 0,
      targetNewLoad: targetTeacher ? targetTeacher.currentLoad + totalPeriods : 0,
      sourceMaxLoad: sourceTeacher?.maxWeeklyLoad || 0,
      targetMaxLoad: targetTeacher?.maxWeeklyLoad || 0
    };
  }, [transferForm, sourceTeacherAllocations, teachers]);

  const handleExecuteTransfer = (): void => {
    if (!transferForm.toTeacherId || transferForm.selectedAllocations.length === 0) {
      addToast('error', 'Please select allocations and target teacher');
      return;
    }

    if (!transferForm.reason) {
      addToast('error', 'Please provide a reason for the transfer');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const sourceTeacher = teachers.find((t) => t.id === transferForm.fromTeacherId);
      const targetTeacher = teachers.find((t) => t.id === transferForm.toTeacherId);

      if (!sourceTeacher || !targetTeacher) {
        addToast('error', 'Invalid transfer: teachers not found');
        setIsLoading(false);
        return;
      }

      // Get the allocations being transferred
      const allocationsToTransfer = sourceTeacher.allocations.filter((a) =>
      transferForm.selectedAllocations.includes(a.id)
      );

      const totalPeriodsTransferred = allocationsToTransfer.reduce(
        (sum, a) => sum + a.periodsPerWeek,
        0
      );

      // Update teachers state
      setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id === transferForm.fromTeacherId) {
          // Remove allocations from source teacher
          const newAllocations = teacher.allocations.filter(
            (a) => !transferForm.selectedAllocations.includes(a.id)
          );
          const newClasses = [...new Set(newAllocations.map((a) => `${a.class}${a.section}`))];
          return {
            ...teacher,
            allocations: newAllocations,
            currentLoad: teacher.currentLoad - totalPeriodsTransferred,
            classes: newClasses
          };
        }
        if (teacher.id === transferForm.toTeacherId) {
          // Add allocations to target teacher
          const transferredAllocations = allocationsToTransfer.map((a) => ({
            ...a,
            teacherId: teacher.id
          }));
          const newAllocations = [...teacher.allocations, ...transferredAllocations];
          const newClasses = [...new Set(newAllocations.map((a) => `${a.class}${a.section}`))];
          return {
            ...teacher,
            allocations: newAllocations,
            currentLoad: teacher.currentLoad + totalPeriodsTransferred,
            classes: newClasses
          };
        }
        return teacher;
      })
      );

      // Create transfer history records
      const newTransfers: WorkloadTransfer[] = allocationsToTransfer.map((alloc) => ({
        id: `TRF-${Date.now()}-${alloc.id}`,
        timestamp: new Date().toISOString(),
        fromTeacherId: sourceTeacher.id,
        fromTeacherName: sourceTeacher.name,
        toTeacherId: targetTeacher.id,
        toTeacherName: targetTeacher.name,
        allocation: alloc,
        reason: transferForm.reason,
        status: 'Completed' as const
      }));

      setTransferHistory((prev) => [...newTransfers, ...prev]);

      setIsLoading(false);
      setShowTransferModal(false);
      setTransferForm({
        fromTeacherId: '',
        toTeacherId: '',
        selectedAllocations: [],
        reason: ''
      });

      addToast(
        'success',
        `Successfully transferred ${allocationsToTransfer.length} allocation(s) (${totalPeriodsTransferred} periods) from ${sourceTeacher.name} to ${targetTeacher.name}`
      );
    }, 1000);
  };

  const handleRevertTransfer = (transfer: WorkloadTransfer): void => {
    setIsLoading(true);

    setTimeout(() => {
      // Swap the teachers back
      setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id === transfer.toTeacherId) {
          // Remove allocation from current holder
          const newAllocations = teacher.allocations.filter(
            (a) => a.id !== transfer.allocation.id
          );
          const newClasses = [...new Set(newAllocations.map((a) => `${a.class}${a.section}`))];
          return {
            ...teacher,
            allocations: newAllocations,
            currentLoad: teacher.currentLoad - transfer.allocation.periodsPerWeek,
            classes: newClasses
          };
        }
        if (teacher.id === transfer.fromTeacherId) {
          // Return allocation to original teacher
          const revertedAllocation = {
            ...transfer.allocation,
            teacherId: teacher.id
          };
          const newAllocations = [...teacher.allocations, revertedAllocation];
          const newClasses = [...new Set(newAllocations.map((a) => `${a.class}${a.section}`))];
          return {
            ...teacher,
            allocations: newAllocations,
            currentLoad: teacher.currentLoad + transfer.allocation.periodsPerWeek,
            classes: newClasses
          };
        }
        return teacher;
      })
      );

      // Update transfer status
      setTransferHistory((prev) =>
      prev.map((t) =>
      t.id === transfer.id ? { ...t, status: 'Reverted' as const } : t
      )
      );

      setIsLoading(false);
      addToast(
        'success',
        `Transfer reverted: ${transfer.allocation.subject} (${transfer.allocation.class}${transfer.allocation.section}) returned to ${transfer.fromTeacherName}`
      );
    }, 800);
  };

  // ==================== OTHER HANDLERS ====================
  const handleViewTeacherDetails = (teacher: Teacher): void => {
    setSelectedTeacher(teacher);
    setShowTeacherDetailModal(true);
  };

  const handleResetFilters = (): void => {
    setDepartmentFilter('');
    setClassFilter('');
    setSectionFilter('');
    setSearchQuery('');
    setStatusFilter('all');
    addToast('info', 'Filters reset');
  };

  const handleExport = (format: 'excel' | 'pdf'): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast('success', `Workload report exported as ${format.toUpperCase()}`);
    }, 1500);
  };

  const handleAddSubstitution = (): void => {
    if (!substitutionForm.date || !substitutionForm.originalTeacherId || !substitutionForm.substituteTeacherId) {
      addToast('error', 'Please fill in all required fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const originalTeacher = teachers.find((t) => t.id === substitutionForm.originalTeacherId);
      const substituteTeacher = teachers.find((t) => t.id === substitutionForm.substituteTeacherId);

      const newSubstitution: SubstitutionRecord = {
        id: `SUB-${Date.now()}`,
        date: substitutionForm.date,
        originalTeacher: originalTeacher?.name || '',
        originalTeacherId: substitutionForm.originalTeacherId,
        substituteTeacher: substituteTeacher?.name,
        substituteTeacherId: substitutionForm.substituteTeacherId,
        period: parseInt(substitutionForm.period),
        class: substitutionForm.class,
        subject: substitutionForm.subject,
        reason: substitutionForm.reason,
        status: 'Upcoming'
      };

      setSubstitutions((prev) => [newSubstitution, ...prev]);
      setIsLoading(false);
      setShowSubstitutionModal(false);
      setSubstitutionForm({
        date: '',
        originalTeacherId: '',
        substituteTeacherId: '',
        period: '',
        class: '',
        subject: '',
        reason: ''
      });
      addToast('success', 'Substitution scheduled successfully');
    }, 1000);
  };

  const handleSaveConfig = (): void => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowConfigModal(false);
      addToast('success', 'Workload configuration saved');
    }, 1000);
  };

  // ==================== TABLE COLUMNS ====================
  const teacherColumns = [
  {
    key: 'teacher',
    header: 'Teacher',
    render: (row: Teacher) =>
    <div className="flex items-center gap-3">
          <TeacherAvatar
        avatar={row.avatar}
        current={row.currentLoad}
        max={row.maxWeeklyLoad} />

          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.code}</p>
          </div>
        </div>

  },
  {
    key: 'department',
    header: 'Department',
    render: (row: Teacher) =>
    <div>
          <p className="font-medium text-gray-900">{row.department}</p>
          <p className="text-xs text-gray-500">{row.designation}</p>
        </div>

  },
  {
    key: 'subjects',
    header: 'Subjects',
    render: (row: Teacher) =>
    <div className="flex flex-wrap gap-1">
          {row.subjects.slice(0, 2).map((subj, i) =>
      <Badge key={i} variant="secondary" className="text-xs">
              {subj}
            </Badge>
      )}
          {row.subjects.length > 2 &&
      <Badge variant="secondary" className="text-xs">
              +{row.subjects.length - 2}
            </Badge>
      }
        </div>

  },
  {
    key: 'classes',
    header: 'Classes',
    render: (row: Teacher) =>
    <div className="flex flex-wrap gap-1">
          {row.classes.slice(0, 4).map((cls, i) =>
      <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              {cls}
            </span>
      )}
          {row.classes.length > 4 &&
      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
              +{row.classes.length - 4}
            </span>
      }
        </div>

  },
  {
    key: 'workload',
    header: 'Weekly Periods',
    render: (row: Teacher) =>
    <div className="w-36">
          <WorkloadProgressBar current={row.currentLoad} max={row.maxWeeklyLoad} />
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Teacher) =>
    <WorkloadStatusBadge current={row.currentLoad} max={row.maxWeeklyLoad} />

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Teacher) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewTeacherDetails(row)}
        title="View Details">

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleOpenTransferModal(row)}
        title="Transfer Workload"
        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">

            <ArrowLeftRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Edit Allocation">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

  }];


  const periodDistributionColumns = [
  {
    key: 'teacher',
    header: 'Teacher',
    render: (row: Teacher) =>
    <div className="flex items-center gap-2">
          <TeacherAvatar
        avatar={row.avatar}
        current={row.currentLoad}
        max={row.maxWeeklyLoad}
        size="sm" />

          <span className="font-medium text-gray-900">{row.name}</span>
        </div>

  },
  ...['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => ({
    key: day,
    header: day.charAt(0).toUpperCase() + day.slice(1),
    render: (row: Teacher) => {
      const periods = row.periodDistribution[day as keyof PeriodDistribution];
      return (
        <span
          className={`inline-flex items-center justify-center w-8 h-8 rounded ${
          periods > 6 ?
          'bg-red-100 text-red-700' :
          periods === 0 ?
          'bg-gray-100 text-gray-400' :
          'bg-blue-50 text-blue-700'} text-sm font-medium`
          }>

            {periods}
          </span>);

    }
  })),
  {
    key: 'total',
    header: 'Total',
    render: (row: Teacher) =>
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded font-semibold ${
      row.currentLoad > row.maxWeeklyLoad ?
      'bg-red-100 text-red-700' :
      row.currentLoad / row.maxWeeklyLoad < 0.6 ?
      'bg-yellow-100 text-yellow-700' :
      'bg-green-100 text-green-700'}`
      }>

          {row.currentLoad}
        </span>

  },
  {
    key: 'actions',
    header: '',
    render: (row: Teacher) =>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleOpenTransferModal(row)}
      title="Transfer Workload"
      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">

          <ArrowLeftRight className="w-4 h-4" />
        </Button>

  }];


  const substitutionColumns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: SubstitutionRecord) =>
    <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-medium">
            {new Date(row.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })}
          </span>
        </div>

  },
  {
    key: 'originalTeacher',
    header: 'Original Teacher',
    render: (row: SubstitutionRecord) =>
    <span className="text-gray-900">{row.originalTeacher}</span>

  },
  {
    key: 'substituteTeacher',
    header: 'Substitute',
    render: (row: SubstitutionRecord) =>
    <span className="text-gray-900">{row.substituteTeacher || '-'}</span>

  },
  {
    key: 'class',
    header: 'Class',
    render: (row: SubstitutionRecord) => <Badge variant="secondary">{row.class}</Badge>
  },
  {
    key: 'period',
    header: 'Period',
    render: (row: SubstitutionRecord) =>
    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
          {row.period}
        </span>

  },
  {
    key: 'subject',
    header: 'Subject',
    render: (row: SubstitutionRecord) => <span className="text-gray-700">{row.subject}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: SubstitutionRecord) => {
      const config = {
        Completed: { variant: 'success' as const, icon: CheckCircle },
        Upcoming: { variant: 'primary' as const, icon: Clock },
        Cancelled: { variant: 'danger' as const, icon: XCircle }
      }[row.status];
      const Icon = config.icon;
      return (
        <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
            <Icon className="w-3 h-3" />
            {row.status}
          </Badge>);

    }
  }];


  const transferHistoryColumns = [
  {
    key: 'timestamp',
    header: 'Date & Time',
    render: (row: WorkloadTransfer) =>
    <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-400" />
          <div>
            <p className="font-medium">
              {new Date(row.timestamp).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short'
          })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(row.timestamp).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit'
          })}
            </p>
          </div>
        </div>

  },
  {
    key: 'allocation',
    header: 'Allocation',
    render: (row: WorkloadTransfer) =>
    <div>
          <p className="font-medium text-gray-900">{row.allocation.subject}</p>
          <p className="text-xs text-gray-500">
            Class {row.allocation.class}-{row.allocation.section} • {row.allocation.periodsPerWeek}{' '}
            periods
          </p>
        </div>

  },
  {
    key: 'from',
    header: 'From',
    render: (row: WorkloadTransfer) =>
    <span className="text-gray-900">{row.fromTeacherName}</span>

  },
  {
    key: 'to',
    header: 'To',
    render: (row: WorkloadTransfer) =>
    <span className="text-gray-900">{row.toTeacherName}</span>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: WorkloadTransfer) =>
    <span className="text-sm text-gray-600 capitalize">
          {row.reason.replace(/-/g, ' ')}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: WorkloadTransfer) => {
      const config = {
        Completed: { variant: 'success' as const, icon: CheckCircle },
        Pending: { variant: 'warning' as const, icon: Clock },
        Reverted: { variant: 'secondary' as const, icon: Undo2 }
      }[row.status];
      const Icon = config.icon;
      return (
        <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
            <Icon className="w-3 h-3" />
            {row.status}
          </Badge>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: WorkloadTransfer) =>
    <div className="flex gap-1">
          {row.status === 'Completed' &&
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRevertTransfer(row)}
        title="Revert Transfer"
        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">

              <Undo2 className="w-4 h-4" />
            </Button>
      }
        </div>

  }];


  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Academics</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Staff Workload Management</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Staff Workload Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage teacher workload, allocations, transfers, and substitutions
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowConfigModal(true)}
            leftIcon={<Settings className="w-4 h-4" />}>

            Configure
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            leftIcon={<Download className="w-4 h-4" />}>

            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setTransferForm({
                fromTeacherId: '',
                toTeacherId: '',
                selectedAllocations: [],
                reason: ''
              });
              setShowTransferModal(true);
            }}
            leftIcon={<ArrowLeftRight className="w-4 h-4" />}
            className="text-blue-600 border-blue-300 hover:bg-blue-50">

            Transfer Workload
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowSubstitutionModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}>

            Add Substitution
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-500 hover:text-gray-700 transition-colors">

            {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showFilters &&
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Select
              value={academicYear}
              onChange={setAcademicYear}
              options={academicYears}
              label="Academic Year" />

              <Select value={term} onChange={setTerm} options={terms} label="Term" />
              <Select
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={departments}
              label="Department" />

              <Select
              value={classFilter}
              onChange={setClassFilter}
              options={classes}
              label="Class" />

              <Select
              value={sectionFilter}
              onChange={setSectionFilter}
              options={sections}
              label="Section" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                placeholder="Teacher name or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {[
              { value: 'all', label: 'All', color: 'bg-gray-100 text-gray-700' },
              { value: 'overloaded', label: 'Overloaded', color: 'bg-red-100 text-red-700' },
              { value: 'underutilized', label: 'Underutilized', color: 'bg-yellow-100 text-yellow-700' },
              { value: 'normal', label: 'Normal', color: 'bg-green-100 text-green-700' }].
              map((status) =>
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value as typeof statusFilter)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                statusFilter === status.value ?
                status.color :
                'bg-gray-50 text-gray-600 hover:bg-gray-100'}`
                }>

                    {status.label}
                  </button>
              )}
              </div>
              <Button
              variant="ghost"
              onClick={handleResetFilters}
              leftIcon={<RefreshCw className="w-4 h-4" />}>

                Reset Filters
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Teachers"
          value={statistics.totalTeachers}
          icon={<Users />}
          color="text-blue-600"
          bgColor="bg-blue-100" />

        <StatCard
          title="Avg Weekly Load"
          value={`${statistics.avgWeeklyLoad} periods`}
          icon={<Clock />}
          color="text-purple-600"
          bgColor="bg-purple-100"
          trend={{ value: 5, isUp: true }} />

        <StatCard
          title="Overloaded"
          value={statistics.overloadedTeachers}
          icon={<AlertCircle />}
          color="text-red-600"
          bgColor="bg-red-100"
          onClick={() => setStatusFilter('overloaded')} />

        <StatCard
          title="Underutilized"
          value={statistics.underutilizedTeachers}
          icon={<AlertTriangle />}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
          onClick={() => setStatusFilter('underutilized')} />

        <StatCard
          title="Recent Transfers"
          value={transferHistory.filter((t) => t.status === 'Completed').length}
          icon={<ArrowLeftRight />}
          color="text-green-600"
          bgColor="bg-green-100"
          onClick={() => setActiveTab('transfers')} />

      </div>

      {/* Smart Alerts */}
      {(statistics.overloadedTeachers > 0 || pendingSubstitutions > 0) &&
      <div className="space-y-3">
          {statistics.overloadedTeachers > 0 &&
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800">Workload Alert</p>
                <p className="text-sm text-red-700">
                  {statistics.overloadedTeachers} teacher(s) are currently overloaded beyond their
                  maximum capacity. Consider transferring some allocations.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter('overloaded')}
              className="border-red-300 text-red-700 hover:bg-red-100">

                  View Teachers
                </Button>
                <Button
              variant="primary"
              size="sm"
              onClick={() => setShowTransferModal(true)}
              className="bg-red-600 hover:bg-red-700"
              leftIcon={<ArrowLeftRight className="w-4 h-4" />}>

                  Transfer Workload
                </Button>
              </div>
            </div>
        }
          {pendingSubstitutions > 0 &&
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-blue-800">Pending Substitutions</p>
                <p className="text-sm text-blue-700">
                  {pendingSubstitutions} substitution(s) scheduled for upcoming days.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveTab('substitutions')}>
                View All
              </Button>
            </div>
        }
        </div>
      }

      {/* Main Content with Tabs */}
      <Card className="p-0 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex -mb-px overflow-x-auto">
            {[
            { id: 'workload' as TabType, label: 'Workload Overview', icon: BarChart3 },
            {
              id: 'substitutions' as TabType,
              label: 'Substitutions',
              icon: Repeat,
              count: pendingSubstitutions
            },
            {
              id: 'transfers' as TabType,
              label: 'Transfer History',
              icon: ArrowLeftRight,
              count: transferHistory.length
            },
            { id: 'analytics' as TabType, label: 'Analytics', icon: PieChart }].
            map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive ?
                  'border-blue-500 text-blue-600' :
                  'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                  }>

                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 &&
                  <Badge variant={isActive ? 'primary' : 'secondary'} className="ml-1">
                      {tab.count}
                    </Badge>
                  }
                </button>);

            })}
          </nav>
        </div>

        <div className="p-6">
          {/* ==================== WORKLOAD TAB ==================== */}
          {activeTab === 'workload' &&
          <div className="space-y-4">
              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredTeachers.length}</span> of{' '}
                  <span className="font-semibold">{teachers.length}</span> teachers
                </p>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                  onClick={() => setViewMode('teacher-wise')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'teacher-wise' ?
                  'bg-white shadow text-gray-900' :
                  'text-gray-600 hover:text-gray-900'}`
                  }>

                    Teacher View
                  </button>
                  <button
                  onClick={() => setViewMode('period-distribution')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  viewMode === 'period-distribution' ?
                  'bg-white shadow text-gray-900' :
                  'text-gray-600 hover:text-gray-900'}`
                  }>

                    Period Distribution
                  </button>
                </div>
              </div>

              {/* Quick Actions for Workload Balancing */}
              {statistics.overloadedTeachers > 0 && statistics.underutilizedTeachers > 0 &&
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">Workload Balancing Opportunity</p>
                        <p className="text-sm text-blue-700">
                          {statistics.overloadedTeachers} overloaded and{' '}
                          {statistics.underutilizedTeachers} underutilized teachers detected.
                          Consider redistributing the workload.
                        </p>
                      </div>
                    </div>
                    <Button
                  variant="primary"
                  onClick={() => setShowTransferModal(true)}
                  leftIcon={<Shuffle className="w-4 h-4" />}>

                      Balance Workload
                    </Button>
                  </div>
                </div>
            }

              {/* Table */}
              {filteredTeachers.length > 0 ?
            <div className="overflow-x-auto">
                  <Table
                columns={viewMode === 'teacher-wise' ? teacherColumns : periodDistributionColumns}
                data={filteredTeachers} />

                </div> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
            }

              {/* Legend */}
              <div className="flex items-center gap-6 pt-4 border-t border-gray-200 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Normal (60-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-600">Underutilized (&lt;60%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Overloaded (&gt;100%)</span>
                </div>
              </div>
            </div>
          }

          {/* ==================== SUBSTITUTIONS TAB ==================== */}
          {activeTab === 'substitutions' &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{substitutions.length}</span> substitution
                  records
                </p>
                <Button
                variant="primary"
                onClick={() => setShowSubstitutionModal(true)}
                leftIcon={<Plus className="w-4 h-4" />}>

                  Schedule Substitution
                </Button>
              </div>

              {substitutions.length > 0 ?
            <Table columns={substitutionColumns} data={substitutions} /> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <Repeat className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No substitutions recorded</h3>
                  <p className="text-gray-500">Substitution records will appear here</p>
                </div>
            }
            </div>
          }

          {/* ==================== TRANSFERS TAB ==================== */}
          {activeTab === 'transfers' &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{transferHistory.length}</span> transfer
                  records
                </p>
                <Button
                variant="primary"
                onClick={() => setShowTransferModal(true)}
                leftIcon={<ArrowLeftRight className="w-4 h-4" />}>

                  New Transfer
                </Button>
              </div>

              {transferHistory.length > 0 ?
            <Table columns={transferHistoryColumns} data={transferHistory} /> :

            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transfers recorded</h3>
                  <p className="text-gray-500 mb-4">
                    Transfer workload between teachers to balance the load
                  </p>
                  <Button
                variant="outline"
                onClick={() => setShowTransferModal(true)}
                leftIcon={<ArrowLeftRight className="w-4 h-4" />}>

                    Create Transfer
                  </Button>
                </div>
            }
            </div>
          }

          {/* ==================== ANALYTICS TAB ==================== */}
          {activeTab === 'analytics' &&
          <div className="space-y-6">
              {/* Department Workload Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Department-wise Workload Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments.
                filter((d) => d.value).
                map((dept) => {
                  const deptTeachers = teachers.filter(
                    (t) => t.department.toLowerCase().replace(/\s+/g, '-') === dept.value
                  );
                  const totalLoad = deptTeachers.reduce((sum, t) => sum + t.currentLoad, 0);
                  const avgLoad =
                  deptTeachers.length > 0 ? Math.round(totalLoad / deptTeachers.length) : 0;
                  const overloaded = deptTeachers.filter(
                    (t) => t.currentLoad > t.maxWeeklyLoad
                  ).length;

                  return (
                    <div
                      key={dept.value}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{dept.label}</h4>
                            {overloaded > 0 &&
                        <Badge variant="danger" className="text-xs">
                                {overloaded} overloaded
                              </Badge>
                        }
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Teachers</span>
                              <span className="font-medium">{deptTeachers.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Total Periods</span>
                              <span className="font-medium">{totalLoad}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Avg Load</span>
                              <span className="font-medium">{avgLoad} periods</span>
                            </div>
                          </div>
                        </div>);

                })}
                </div>
              </div>

              {/* Workload Distribution Chart Placeholder */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Workload Analytics</h3>
                <p className="text-gray-500 mb-4">
                  Interactive charts and detailed analytics will be displayed here
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" leftIcon={<BarChart3 className="w-4 h-4" />}>
                    View Charts
                  </Button>
                  <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
                    Download Report
                  </Button>
                </div>
              </div>
            </div>
          }
        </div>
      </Card>

      {/* ==================== MODALS ==================== */}

      {/* Teacher Detail Modal */}
      <Modal
        isOpen={showTeacherDetailModal}
        onClose={() => {
          setShowTeacherDetailModal(false);
          setSelectedTeacher(null);
        }}
        title="Teacher Workload Details"
        size="xl">

        {selectedTeacher &&
        <div className="space-y-6">
            {/* Teacher Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <TeacherAvatar
              avatar={selectedTeacher.avatar}
              current={selectedTeacher.currentLoad}
              max={selectedTeacher.maxWeeklyLoad}
              size="lg" />

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTeacher.name}</h3>
                <p className="text-gray-500">
                  {selectedTeacher.designation} • {selectedTeacher.department}
                </p>
                <p className="text-sm text-gray-500">{selectedTeacher.email}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <WorkloadStatusBadge
                current={selectedTeacher.currentLoad}
                max={selectedTeacher.maxWeeklyLoad} />

                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowTeacherDetailModal(false);
                  handleOpenTransferModal(selectedTeacher);
                }}
                leftIcon={<ArrowLeftRight className="w-4 h-4" />}>

                  Transfer Workload
                </Button>
              </div>
            </div>

            {/* Workload Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedTeacher.currentLoad}</p>
                <p className="text-sm text-blue-700">Current Load</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-700">{selectedTeacher.maxWeeklyLoad}</p>
                <p className="text-sm text-gray-600">Max Limit</p>
              </div>
              <div
              className={`rounded-lg p-4 text-center ${
              selectedTeacher.currentLoad > selectedTeacher.maxWeeklyLoad ?
              'bg-red-50' :
              'bg-green-50'}`
              }>

                <p
                className={`text-2xl font-bold ${
                selectedTeacher.currentLoad > selectedTeacher.maxWeeklyLoad ?
                'text-red-600' :
                'text-green-600'}`
                }>

                  {Math.abs(selectedTeacher.maxWeeklyLoad - selectedTeacher.currentLoad)}
                </p>
                <p
                className={`text-sm ${
                selectedTeacher.currentLoad > selectedTeacher.maxWeeklyLoad ?
                'text-red-700' :
                'text-green-700'}`
                }>

                  {selectedTeacher.currentLoad > selectedTeacher.maxWeeklyLoad ?
                'Over by' :
                'Available'}
                </p>
              </div>
            </div>

            {/* Period Distribution */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Period Distribution</h4>
              <div className="grid grid-cols-6 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                const dayKey = day.toLowerCase() as keyof PeriodDistribution;
                const periods = selectedTeacher.periodDistribution[dayKey];
                return (
                  <div key={day} className="text-center">
                      <p className="text-xs text-gray-500 mb-1">{day}</p>
                      <div
                      className={`py-2 rounded-lg font-semibold ${
                      periods > 6 ?
                      'bg-red-100 text-red-700' :
                      periods === 0 ?
                      'bg-gray-100 text-gray-400' :
                      'bg-blue-100 text-blue-700'}`
                      }>

                        {periods}
                      </div>
                    </div>);

              })}
              </div>
            </div>

            {/* Subject Allocations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Subject Allocations</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Subject</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Class</th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Section</th>
                      <th className="text-center py-2 px-3 font-medium text-gray-700">
                        Periods/Week
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTeacher.allocations.map((alloc) =>
                  <tr key={alloc.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{alloc.subject}</td>
                        <td className="py-2 px-3">{alloc.class}</td>
                        <td className="py-2 px-3">{alloc.section}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            {alloc.periodsPerWeek}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <Badge
                        variant={
                        alloc.type === 'Lab' ?
                        'primary' :
                        alloc.type === 'Co-curricular' ?
                        'warning' :
                        'secondary'
                        }>

                            {alloc.type}
                          </Badge>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Free Periods */}
            {selectedTeacher.freePeriods.length > 0 &&
          <div>
                <h4 className="font-semibold text-gray-900 mb-3">Free Periods</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.freePeriods.map((fp, i) =>
              <span
                key={i}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">

                      {fp.day} - Period {fp.period}
                    </span>
              )}
                </div>
              </div>
          }

            {/* Extra Duties */}
            {selectedTeacher.extraDuties.length > 0 &&
          <div>
                <h4 className="font-semibold text-gray-900 mb-3">Extra Duties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.extraDuties.map((duty, i) =>
              <Badge key={i} variant="secondary">
                      {duty}
                    </Badge>
              )}
                </div>
              </div>
          }

            <div className="flex justify-end pt-4 border-t gap-2">
              <Button
              variant="outline"
              onClick={() => {
                setShowTeacherDetailModal(false);
                setSelectedTeacher(null);
              }}>

                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Transfer Workload Modal */}
      <Modal
        isOpen={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setTransferForm({
            fromTeacherId: '',
            toTeacherId: '',
            selectedAllocations: [],
            reason: ''
          });
        }}
        title="Transfer Workload"
        size="xl">

        <div className="space-y-6">
          {/* Step 1: Select Source Teacher */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Step 1: Select Source Teacher *
            </label>
            <Select
              value={transferForm.fromTeacherId}
              onChange={(val) =>
              setTransferForm((prev) => ({
                ...prev,
                fromTeacherId: val,
                toTeacherId: '',
                selectedAllocations: []
              }))
              }
              options={[
              { value: '', label: 'Select teacher to transfer from...' },
              ...teachers.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.department}) - ${t.currentLoad}/${t.maxWeeklyLoad} periods`
              }))]
              } />

          </div>

          {/* Step 2: Select Allocations */}
          {transferForm.fromTeacherId &&
          <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Step 2: Select Allocations to Transfer *
                </label>
                <Button variant="ghost" size="sm" onClick={handleSelectAllAllocations}>
                  {transferForm.selectedAllocations.length === sourceTeacherAllocations.length ?
                'Deselect All' :
                'Select All'}
                </Button>
              </div>
              <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                {sourceTeacherAllocations.length > 0 ?
              <div className="divide-y divide-gray-100">
                    {sourceTeacherAllocations.map((alloc) =>
                <label
                  key={alloc.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  transferForm.selectedAllocations.includes(alloc.id) ? 'bg-blue-50' : ''}`
                  }>

                        <input
                    type="checkbox"
                    checked={transferForm.selectedAllocations.includes(alloc.id)}
                    onChange={() => handleToggleAllocation(alloc.id)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{alloc.subject}</p>
                          <p className="text-xs text-gray-500">
                            Class {alloc.class}-{alloc.section}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {alloc.periodsPerWeek} periods/week
                          </span>
                        </div>
                        <Badge
                    variant={
                    alloc.type === 'Lab' ?
                    'primary' :
                    alloc.type === 'Co-curricular' ?
                    'warning' :
                    'secondary'
                    }>

                          {alloc.type}
                        </Badge>
                      </label>
                )}
                  </div> :

              <div className="p-4 text-center text-gray-500">
                    No allocations found for this teacher
                  </div>
              }
              </div>
              {transferForm.selectedAllocations.length > 0 &&
            <p className="mt-2 text-sm text-blue-600">
                  {transferForm.selectedAllocations.length} allocation(s) selected (
                  {calculateTransferImpact.totalPeriods} periods)
                </p>
            }
            </div>
          }

          {/* Step 3: Select Target Teacher */}
          {transferForm.selectedAllocations.length > 0 &&
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step 3: Select Target Teacher *
              </label>
              <Select
              value={transferForm.toTeacherId}
              onChange={(val) => setTransferForm((prev) => ({ ...prev, toTeacherId: val }))}
              options={[
              { value: '', label: 'Select teacher to transfer to...' },
              ...availableTargetTeachers.map((t) => ({
                value: t.id,
                label: `${t.name} (${t.department}) - ${t.currentLoad}/${t.maxWeeklyLoad} periods • ${t.maxWeeklyLoad - t.currentLoad} available`
              }))]
              } />

              {availableTargetTeachers.length === 0 &&
            <p className="mt-2 text-sm text-amber-600">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  No teachers have sufficient capacity for this transfer. Consider transferring
                  fewer allocations.
                </p>
            }
            </div>
          }

          {/* Step 4: Reason */}
          {transferForm.toTeacherId &&
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step 4: Reason for Transfer *
              </label>
              <Select
              value={transferForm.reason}
              onChange={(val) => setTransferForm((prev) => ({ ...prev, reason: val }))}
              options={transferReasons} />

            </div>
          }

          {/* Transfer Preview */}
          {transferForm.fromTeacherId &&
          transferForm.toTeacherId &&
          transferForm.selectedAllocations.length > 0 &&
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Transfer Preview
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  {/* Source Teacher */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Source Teacher</p>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {teachers.find((t) => t.id === transferForm.fromTeacherId)?.name}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Load:</span>
                          <span className="font-medium">
                            {teachers.find((t) => t.id === transferForm.fromTeacherId)?.currentLoad}{' '}
                            periods
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">After Transfer:</span>
                          <span className="font-medium text-green-600">
                            {calculateTransferImpact.sourceNewLoad} periods
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Change:</span>
                          <span className="font-medium text-green-600">
                            -{calculateTransferImpact.totalPeriods} periods
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <WorkloadProgressBar
                      current={calculateTransferImpact.sourceNewLoad}
                      max={calculateTransferImpact.sourceMaxLoad}
                      showLabels={false} />

                      </div>
                    </div>
                  </div>

                  {/* Target Teacher */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Target Teacher</p>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="font-semibold text-gray-900">
                        {teachers.find((t) => t.id === transferForm.toTeacherId)?.name}
                      </p>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Load:</span>
                          <span className="font-medium">
                            {teachers.find((t) => t.id === transferForm.toTeacherId)?.currentLoad}{' '}
                            periods
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">After Transfer:</span>
                          <span
                        className={`font-medium ${
                        calculateTransferImpact.targetNewLoad >
                        calculateTransferImpact.targetMaxLoad ?
                        'text-red-600' :
                        'text-blue-600'}`
                        }>

                            {calculateTransferImpact.targetNewLoad} periods
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Change:</span>
                          <span className="font-medium text-blue-600">
                            +{calculateTransferImpact.totalPeriods} periods
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <WorkloadProgressBar
                      current={calculateTransferImpact.targetNewLoad}
                      max={calculateTransferImpact.targetMaxLoad}
                      showLabels={false} />

                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning if target will be overloaded */}
                {calculateTransferImpact.targetNewLoad > calculateTransferImpact.targetMaxLoad &&
            <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      Warning: This transfer will cause the target teacher to exceed their maximum
                      weekly load.
                    </p>
                  </div>
            }
              </div>
          }

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowTransferModal(false);
                setTransferForm({
                  fromTeacherId: '',
                  toTeacherId: '',
                  selectedAllocations: [],
                  reason: ''
                });
              }}>

              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExecuteTransfer}
              disabled={
              isLoading ||
              !transferForm.fromTeacherId ||
              !transferForm.toTeacherId ||
              transferForm.selectedAllocations.length === 0 ||
              !transferForm.reason
              }
              leftIcon={
              isLoading ?
              <RefreshCw className="w-4 h-4 animate-spin" /> :

              <ArrowLeftRight className="w-4 h-4" />

              }>

              {isLoading ? 'Transferring...' : 'Execute Transfer'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Substitution Modal */}
      <Modal
        isOpen={showSubstitutionModal}
        onClose={() => setShowSubstitutionModal(false)}
        title="Schedule Substitution"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={substitutionForm.date}
              onChange={(e) => setSubstitutionForm((prev) => ({ ...prev, date: e.target.value }))} />

            <Select
              label="Period *"
              value={substitutionForm.period}
              onChange={(val) => setSubstitutionForm((prev) => ({ ...prev, period: val }))}
              options={[
              { value: '', label: 'Select Period' },
              { value: '1', label: 'Period 1' },
              { value: '2', label: 'Period 2' },
              { value: '3', label: 'Period 3' },
              { value: '4', label: 'Period 4' },
              { value: '5', label: 'Period 5' },
              { value: '6', label: 'Period 6' },
              { value: '7', label: 'Period 7' },
              { value: '8', label: 'Period 8' }]
              } />

          </div>

          <Select
            label="Original Teacher (Absent) *"
            value={substitutionForm.originalTeacherId}
            onChange={(val) => setSubstitutionForm((prev) => ({ ...prev, originalTeacherId: val }))}
            options={[
            { value: '', label: 'Select Teacher' },
            ...teachers.map((t) => ({ value: t.id, label: `${t.name} (${t.department})` }))]
            } />


          <Select
            label="Substitute Teacher *"
            value={substitutionForm.substituteTeacherId}
            onChange={(val) =>
            setSubstitutionForm((prev) => ({ ...prev, substituteTeacherId: val }))
            }
            options={[
            { value: '', label: 'Select Teacher' },
            ...teachers.
            filter(
              (t) =>
              t.id !== substitutionForm.originalTeacherId &&
              t.currentLoad < t.maxWeeklyLoad &&
              t.status !== 'On Leave'
            ).
            map((t) => ({
              value: t.id,
              label: `${t.name} (${t.department}) - ${t.maxWeeklyLoad - t.currentLoad} periods available`
            }))]
            } />


          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Class"
              value={substitutionForm.class}
              onChange={(e) => setSubstitutionForm((prev) => ({ ...prev, class: e.target.value }))}
              placeholder="e.g., 9A" />

            <Input
              label="Subject"
              value={substitutionForm.subject}
              onChange={(e) =>
              setSubstitutionForm((prev) => ({ ...prev, subject: e.target.value }))
              }
              placeholder="e.g., Mathematics" />

          </div>

          <Select
            label="Reason"
            value={substitutionForm.reason}
            onChange={(val) => setSubstitutionForm((prev) => ({ ...prev, reason: val }))}
            options={[
            { value: '', label: 'Select Reason' },
            { value: 'Medical Leave', label: 'Medical Leave' },
            { value: 'Personal Leave', label: 'Personal Leave' },
            { value: 'Training', label: 'Training' },
            { value: 'Meeting', label: 'Meeting' },
            { value: 'Emergency', label: 'Emergency' },
            { value: 'Other', label: 'Other' }]
            } />


          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSubstitutionModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddSubstitution}
              disabled={isLoading}
              leftIcon={<Plus className="w-4 h-4" />}>

              {isLoading ? 'Scheduling...' : 'Schedule Substitution'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Configuration Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Workload Configuration"
        size="md">

        <div className="space-y-4">
          <Input
            label="Default Max Weekly Load"
            type="number"
            value={workloadConfig.maxWeeklyLoad}
            onChange={(e) =>
            setWorkloadConfig((prev) => ({
              ...prev,
              maxWeeklyLoad: parseInt(e.target.value) || 0
            }))
            } />

          <Input
            label="Overload Threshold (%)"
            type="number"
            value={workloadConfig.overloadThreshold}
            onChange={(e) =>
            setWorkloadConfig((prev) => ({
              ...prev,
              overloadThreshold: parseInt(e.target.value) || 0
            }))
            } />

          <Input
            label="Underutilized Threshold (%)"
            type="number"
            value={workloadConfig.underutilizedThreshold}
            onChange={(e) =>
            setWorkloadConfig((prev) => ({
              ...prev,
              underutilizedThreshold: parseInt(e.target.value) || 0
            }))
            } />

          <Input
            label="Periods Per Day"
            type="number"
            value={workloadConfig.periodsPerDay}
            onChange={(e) =>
            setWorkloadConfig((prev) => ({
              ...prev,
              periodsPerDay: parseInt(e.target.value) || 0
            }))
            } />


          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">
                Changes to configuration will affect how workload status is calculated for all
                teachers.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveConfig} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add some basic animations */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>);

}

export { StaffWorkloadManagement as RolePermissionAssignment };
export { StaffWorkloadManagement as RoleResponsibilityAssignment };
export default StaffWorkloadManagement;