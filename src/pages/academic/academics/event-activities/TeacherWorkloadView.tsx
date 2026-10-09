// src/pages/admin/scheduling/TeacherWorkloadView.tsx

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  Users, Search, Filter, Eye, Download, X, Clock, Calendar, BookOpen, ClipboardList,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  ArrowUpDown, RefreshCw, BarChart3, PieChart, Settings, FileText, Send, Edit,
  UserCheck, AlertCircle, Briefcase, GraduationCap, Activity, Target, Minus } from
'lucide-react';

// ==================== TYPES ====================

type Department = 'Mathematics' | 'Science' | 'English' | 'Hindi' | 'Social Studies' | 'Computer Science' | 'Physical Education' | 'Arts' | 'Commerce' | 'Physics' | 'Chemistry' | 'Biology';
type WorkloadStatus = 'Overloaded' | 'Balanced' | 'Underloaded' | 'Critical' | 'Optimal';
type Designation = 'Principal' | 'Vice Principal' | 'HOD' | 'Senior Teacher' | 'Teacher' | 'Junior Teacher' | 'Guest Faculty' | 'Sports Teacher';
type DutyType = 'Assembly' | 'Corridor' | 'Cafeteria' | 'Bus' | 'Gate' | 'Library' | 'Lab' | 'Exam' | 'Event' | 'Substitution';

type TeachingAssignment = {class: string;section: string;subject: string;periodsPerWeek: number;students: number;};
type DutyAssignment = {type: DutyType;description: string;hoursPerWeek: number;frequency: string;};
type LeaveRecord = {date: string;type: string;status: 'Approved' | 'Pending' | 'Rejected';};

type WorkloadBreakdown = {
  teachingHours: number;
  dutyHours: number;
  adminHours: number;
  meetingHours: number;
  extraCurricularHours: number;
  totalHours: number;
  maxHours: number;
  utilizationPercent: number;
};

type Teacher = {
  id: number;
  name: string;
  employeeId: string;
  department: Department;
  designation: Designation;
  email: string;
  phone: string;
  joiningDate: string;
  experience: number;
  qualification: string;
  teachingAssignments: TeachingAssignment[];
  dutyAssignments: DutyAssignment[];
  workload: WorkloadBreakdown;
  status: WorkloadStatus;
  trend: 'increasing' | 'stable' | 'decreasing';
  lastUpdated: string;
  leaveBalance: number;
  upcomingLeaves: LeaveRecord[];
  skills: string[];
  certifications: string[];
  performanceRating: number;
  remarks?: string;
};

type WorkloadThreshold = {underloaded: number;optimal: number;balanced: number;overloaded: number;critical: number;};
type SortKey = 'name' | 'department' | 'teachingHours' | 'dutyHours' | 'utilization' | 'status';
type SortOrder = 'asc' | 'desc';
type FilterStatus = 'All' | WorkloadStatus;
type FilterDepartment = 'All' | Department;
type ModalType = 'none' | 'viewTeacher' | 'adjustWorkload' | 'bulkRebalance' | 'settings' | 'export' | 'recommendations';

// ==================== DATA ====================

const DEPARTMENTS: Department[] = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Physical Education', 'Arts', 'Commerce', 'Physics', 'Chemistry', 'Biology'];
const STATUSES: WorkloadStatus[] = ['Critical', 'Overloaded', 'Balanced', 'Optimal', 'Underloaded'];
const DUTY_TYPES: DutyType[] = ['Assembly', 'Corridor', 'Cafeteria', 'Bus', 'Gate', 'Library', 'Lab', 'Exam', 'Event', 'Substitution'];

const DEFAULT_THRESHOLDS: WorkloadThreshold = { underloaded: 50, optimal: 70, balanced: 85, overloaded: 95, critical: 100 };

const calculateStatus = (utilization: number, thresholds: WorkloadThreshold): WorkloadStatus => {
  if (utilization >= thresholds.critical) return 'Critical';
  if (utilization >= thresholds.overloaded) return 'Overloaded';
  if (utilization >= thresholds.balanced) return 'Balanced';
  if (utilization >= thresholds.optimal) return 'Optimal';
  return 'Underloaded';
};

const teachersData: Teacher[] = [
{
  id: 1, name: 'Dr. Ramesh Sharma', employeeId: 'EMP001', department: 'Mathematics', designation: 'Senior Teacher',
  email: 'r.sharma@school.edu', phone: '+91 98765 43210', joiningDate: '2015-06-15', experience: 12, qualification: 'Ph.D. Mathematics',
  teachingAssignments: [
  { class: 'X', section: 'A', subject: 'Mathematics', periodsPerWeek: 6, students: 45 },
  { class: 'X', section: 'B', subject: 'Mathematics', periodsPerWeek: 6, students: 42 },
  { class: 'XI', section: 'A', subject: 'Mathematics', periodsPerWeek: 8, students: 38 },
  { class: 'XI', section: 'B', subject: 'Mathematics', periodsPerWeek: 8, students: 36 }],

  dutyAssignments: [
  { type: 'Assembly', description: 'Morning Assembly Supervision', hoursPerWeek: 2, frequency: 'Daily' },
  { type: 'Exam', description: 'Exam Invigilation', hoursPerWeek: 2, frequency: 'As Scheduled' }],

  workload: { teachingHours: 28, dutyHours: 4, adminHours: 2, meetingHours: 1, extraCurricularHours: 0, totalHours: 35, maxHours: 36, utilizationPercent: 97 },
  status: 'Overloaded', trend: 'increasing', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 8,
  upcomingLeaves: [], skills: ['Calculus', 'Statistics', 'Competitive Math'], certifications: ['CBSE Master Trainer'],
  performanceRating: 4.5, remarks: 'Excellent teacher, consider reducing load'
},
{
  id: 2, name: 'Mrs. Anita Gupta', employeeId: 'EMP002', department: 'Science', designation: 'Teacher',
  email: 'a.gupta@school.edu', phone: '+91 98765 43211', joiningDate: '2018-07-01', experience: 8, qualification: 'M.Sc. Physics',
  teachingAssignments: [
  { class: 'X', section: 'A', subject: 'Science', periodsPerWeek: 6, students: 45 },
  { class: 'X', section: 'B', subject: 'Science', periodsPerWeek: 6, students: 42 },
  { class: 'XII', section: 'A', subject: 'Physics', periodsPerWeek: 6, students: 35 },
  { class: 'XII', section: 'B', subject: 'Physics', periodsPerWeek: 6, students: 32 }],

  dutyAssignments: [
  { type: 'Lab', description: 'Physics Lab Supervision', hoursPerWeek: 3, frequency: 'Twice Weekly' },
  { type: 'Corridor', description: 'Corridor Duty - 1st Floor', hoursPerWeek: 2, frequency: 'Daily Break' }],

  workload: { teachingHours: 24, dutyHours: 5, adminHours: 1, meetingHours: 1, extraCurricularHours: 2, totalHours: 33, maxHours: 38, utilizationPercent: 87 },
  status: 'Balanced', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 12,
  upcomingLeaves: [], skills: ['Physics', 'Lab Work', 'Science Projects'], certifications: [],
  performanceRating: 4.2
},
{
  id: 3, name: 'Mr. Mohit Singh', employeeId: 'EMP003', department: 'English', designation: 'Senior Teacher',
  email: 'm.singh@school.edu', phone: '+91 98765 43212', joiningDate: '2012-04-10', experience: 15, qualification: 'M.A. English Literature',
  teachingAssignments: [
  { class: 'IX', section: 'A', subject: 'English', periodsPerWeek: 6, students: 48 },
  { class: 'IX', section: 'B', subject: 'English', periodsPerWeek: 6, students: 46 },
  { class: 'X', section: 'A', subject: 'English', periodsPerWeek: 5, students: 45 },
  { class: 'X', section: 'B', subject: 'English', periodsPerWeek: 5, students: 42 }],

  dutyAssignments: [
  { type: 'Library', description: 'Library Period Supervision', hoursPerWeek: 2, frequency: 'Twice Weekly' },
  { type: 'Event', description: 'Literary Club Mentor', hoursPerWeek: 2, frequency: 'Weekly' },
  { type: 'Cafeteria', description: 'Lunch Duty', hoursPerWeek: 2, frequency: 'Daily' }],

  workload: { teachingHours: 22, dutyHours: 6, adminHours: 1, meetingHours: 2, extraCurricularHours: 2, totalHours: 33, maxHours: 40, utilizationPercent: 83 },
  status: 'Balanced', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 10,
  upcomingLeaves: [], skills: ['Literature', 'Creative Writing', 'Debate'], certifications: ['British Council Certified'],
  performanceRating: 4.8
},
{
  id: 4, name: 'Mr. Suresh Patel', employeeId: 'EMP004', department: 'Computer Science', designation: 'Teacher',
  email: 's.patel@school.edu', phone: '+91 98765 43213', joiningDate: '2020-08-15', experience: 5, qualification: 'M.Tech Computer Science',
  teachingAssignments: [
  { class: 'XI', section: 'A', subject: 'Computer Science', periodsPerWeek: 6, students: 32 },
  { class: 'XII', section: 'A', subject: 'Computer Science', periodsPerWeek: 6, students: 28 }],

  dutyAssignments: [
  { type: 'Lab', description: 'Computer Lab Supervision', hoursPerWeek: 2, frequency: 'As Needed' }],

  workload: { teachingHours: 12, dutyHours: 2, adminHours: 1, meetingHours: 1, extraCurricularHours: 1, totalHours: 17, maxHours: 36, utilizationPercent: 47 },
  status: 'Underloaded', trend: 'decreasing', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 15,
  upcomingLeaves: [], skills: ['Programming', 'Web Development', 'Networking'], certifications: ['Google Certified Educator'],
  performanceRating: 3.9, remarks: 'Can take additional classes or duties'
},
{
  id: 5, name: 'Mrs. Vidya Kumar', employeeId: 'EMP005', department: 'Social Studies', designation: 'Teacher',
  email: 'v.kumar@school.edu', phone: '+91 98765 43214', joiningDate: '2017-03-20', experience: 9, qualification: 'M.A. History',
  teachingAssignments: [
  { class: 'VIII', section: 'A', subject: 'Social Studies', periodsPerWeek: 6, students: 50 },
  { class: 'VIII', section: 'B', subject: 'Social Studies', periodsPerWeek: 6, students: 48 },
  { class: 'IX', section: 'A', subject: 'Social Studies', periodsPerWeek: 5, students: 48 }],

  dutyAssignments: [
  { type: 'Gate', description: 'Main Gate Duty', hoursPerWeek: 2, frequency: 'Daily Morning' },
  { type: 'Event', description: 'Heritage Club Coordinator', hoursPerWeek: 2, frequency: 'Weekly' }],

  workload: { teachingHours: 17, dutyHours: 4, adminHours: 1, meetingHours: 1, extraCurricularHours: 3, totalHours: 26, maxHours: 36, utilizationPercent: 72 },
  status: 'Optimal', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 11,
  upcomingLeaves: [], skills: ['History', 'Geography', 'Civics'], certifications: [],
  performanceRating: 4.1
},
{
  id: 6, name: 'Mrs. Kavita Devi', employeeId: 'EMP006', department: 'Hindi', designation: 'Teacher',
  email: 'k.devi@school.edu', phone: '+91 98765 43215', joiningDate: '2016-07-01', experience: 10, qualification: 'M.A. Hindi',
  teachingAssignments: [
  { class: 'VII', section: 'A', subject: 'Hindi', periodsPerWeek: 6, students: 52 },
  { class: 'VII', section: 'B', subject: 'Hindi', periodsPerWeek: 6, students: 50 },
  { class: 'VIII', section: 'A', subject: 'Hindi', periodsPerWeek: 6, students: 50 },
  { class: 'VIII', section: 'B', subject: 'Hindi', periodsPerWeek: 6, students: 48 }],

  dutyAssignments: [
  { type: 'Assembly', description: 'Prayer Assembly', hoursPerWeek: 1, frequency: 'Daily' },
  { type: 'Corridor', description: 'Corridor Duty - Ground Floor', hoursPerWeek: 2, frequency: 'Daily Break' }],

  workload: { teachingHours: 24, dutyHours: 3, adminHours: 1, meetingHours: 1, extraCurricularHours: 1, totalHours: 30, maxHours: 36, utilizationPercent: 83 },
  status: 'Balanced', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 9,
  upcomingLeaves: [{ date: '2026-03-14', type: 'Casual Leave', status: 'Approved' }], skills: ['Hindi Literature', 'Grammar'],
  certifications: [], performanceRating: 4.0
},
{
  id: 7, name: 'Mr. Pradeep Joshi', employeeId: 'EMP007', department: 'Physical Education', designation: 'Sports Teacher',
  email: 'p.joshi@school.edu', phone: '+91 98765 43216', joiningDate: '2014-06-01', experience: 12, qualification: 'M.P.Ed',
  teachingAssignments: [
  { class: 'VI-X', section: 'All', subject: 'Physical Education', periodsPerWeek: 20, students: 500 }],

  dutyAssignments: [
  { type: 'Assembly', description: 'PT Assembly', hoursPerWeek: 5, frequency: 'Daily' },
  { type: 'Event', description: 'Sports Events Coordinator', hoursPerWeek: 5, frequency: 'Ongoing' },
  { type: 'Bus', description: 'Bus Duty - Sports Ground', hoursPerWeek: 3, frequency: 'Match Days' }],

  workload: { teachingHours: 20, dutyHours: 13, adminHours: 2, meetingHours: 1, extraCurricularHours: 5, totalHours: 41, maxHours: 40, utilizationPercent: 103 },
  status: 'Critical', trend: 'increasing', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 5,
  upcomingLeaves: [], skills: ['Athletics', 'Cricket', 'Basketball', 'Yoga'], certifications: ['NIS Certified Coach'],
  performanceRating: 4.3, remarks: 'Critical overload during sports season'
},
{
  id: 8, name: 'Dr. Priya Verma', employeeId: 'EMP008', department: 'Chemistry', designation: 'HOD',
  email: 'p.verma@school.edu', phone: '+91 98765 43217', joiningDate: '2010-01-15', experience: 18, qualification: 'Ph.D. Chemistry',
  teachingAssignments: [
  { class: 'XI', section: 'A', subject: 'Chemistry', periodsPerWeek: 6, students: 38 },
  { class: 'XII', section: 'A', subject: 'Chemistry', periodsPerWeek: 6, students: 35 }],

  dutyAssignments: [
  { type: 'Lab', description: 'Chemistry Lab Supervision', hoursPerWeek: 4, frequency: 'Daily' }],

  workload: { teachingHours: 12, dutyHours: 4, adminHours: 8, meetingHours: 3, extraCurricularHours: 1, totalHours: 28, maxHours: 32, utilizationPercent: 88 },
  status: 'Balanced', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 14,
  upcomingLeaves: [], skills: ['Organic Chemistry', 'Research', 'Lab Management'], certifications: ['State Level Science Award'],
  performanceRating: 4.7
},
{
  id: 9, name: 'Mr. Ajay Mishra', employeeId: 'EMP009', department: 'Hindi', designation: 'Teacher',
  email: 'a.mishra@school.edu', phone: '+91 98765 43218', joiningDate: '2019-06-01', experience: 6, qualification: 'M.A. Hindi',
  teachingAssignments: [
  { class: 'IX', section: 'A', subject: 'Hindi', periodsPerWeek: 5, students: 48 },
  { class: 'IX', section: 'B', subject: 'Hindi', periodsPerWeek: 5, students: 46 },
  { class: 'X', section: 'A', subject: 'Hindi', periodsPerWeek: 5, students: 45 }],

  dutyAssignments: [
  { type: 'Cafeteria', description: 'Lunch Supervision', hoursPerWeek: 3, frequency: 'Daily' }],

  workload: { teachingHours: 15, dutyHours: 3, adminHours: 1, meetingHours: 1, extraCurricularHours: 1, totalHours: 21, maxHours: 36, utilizationPercent: 58 },
  status: 'Underloaded', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 13,
  upcomingLeaves: [], skills: ['Hindi Literature', 'Poetry'], certifications: [],
  performanceRating: 4.0, remarks: 'Available for additional assignments'
},
{
  id: 10, name: 'Mrs. Sunita Rao', employeeId: 'EMP010', department: 'Physics', designation: 'Teacher',
  email: 's.rao@school.edu', phone: '+91 98765 43219', joiningDate: '2016-07-15', experience: 10, qualification: 'M.Sc. Physics',
  teachingAssignments: [
  { class: 'XI', section: 'A', subject: 'Physics', periodsPerWeek: 6, students: 38 },
  { class: 'XI', section: 'B', subject: 'Physics', periodsPerWeek: 6, students: 36 },
  { class: 'XII', section: 'B', subject: 'Physics', periodsPerWeek: 6, students: 32 }],

  dutyAssignments: [
  { type: 'Lab', description: 'Physics Lab', hoursPerWeek: 3, frequency: 'As Scheduled' },
  { type: 'Exam', description: 'Exam Coordination', hoursPerWeek: 2, frequency: 'Exam Period' }],

  workload: { teachingHours: 18, dutyHours: 5, adminHours: 1, meetingHours: 1, extraCurricularHours: 2, totalHours: 27, maxHours: 36, utilizationPercent: 75 },
  status: 'Optimal', trend: 'stable', lastUpdated: '2026-03-10T08:00:00', leaveBalance: 10,
  upcomingLeaves: [], skills: ['Physics', 'Practical Work', 'Science Olympiad'], certifications: [],
  performanceRating: 4.3
}];


// ==================== UTILITIES ====================

const getStatusVariant = (status: WorkloadStatus): 'danger' | 'warning' | 'success' | 'default' => {
  const map: Record<WorkloadStatus, 'danger' | 'warning' | 'success' | 'default'> = {
    Critical: 'danger', Overloaded: 'danger', Balanced: 'success', Optimal: 'success', Underloaded: 'warning'
  };
  return map[status];
};

const getUtilizationColor = (percent: number): string => {
  if (percent >= 100) return 'bg-red-500';
  if (percent >= 90) return 'bg-orange-500';
  if (percent >= 70) return 'bg-green-500';
  if (percent >= 50) return 'bg-yellow-500';
  return 'bg-gray-400';
};

const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ==================== COMPONENTS ====================

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>);

};

const StatCard = ({ icon: Icon, value, label, color, trend }: {icon: React.ElementType;value: string | number;label: string;color: string;trend?: 'up' | 'down' | 'stable';}) =>
<div className="border rounded-lg p-4">
    <div className="flex items-center justify-between">
      <Icon className={`h-6 w-6 ${color}`} />
      {trend && (trend === 'up' ? <TrendingUp className="h-4 w-4 text-red-500" /> : trend === 'down' ? <TrendingDown className="h-4 w-4 text-green-500" /> : <Minus className="h-4 w-4 text-gray-400" />)}
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>;


const ProgressBar = ({ value, max, showLabel = true }: {value: number;max: number;showLabel?: boolean;}) => {
  const percent = Math.round(value / max * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full ${getUtilizationColor(percent)}`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      {showLabel && <span className="text-xs text-gray-500 w-10 text-right">{percent}%</span>}
    </div>);

};

const TeacherDetailView = ({ teacher, onClose }: {teacher: Teacher;onClose: () => void;}) => {
  const totalStudents = teacher.teachingAssignments.reduce((sum, a) => sum + a.students, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
          {teacher.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{teacher.name}</h3>
            <Badge variant={getStatusVariant(teacher.status)}>{teacher.status}</Badge>
          </div>
          <p className="text-gray-500">{teacher.designation} • {teacher.department}</p>
          <p className="text-sm text-gray-400">{teacher.employeeId} • {teacher.experience} years exp</p>
        </div>
      </div>

      {/* Workload Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="border rounded-lg p-3 text-center">
          <BookOpen className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.workload.teachingHours}h</p>
          <p className="text-xs text-gray-500">Teaching</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <ClipboardList className="h-5 w-5 text-green-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.workload.dutyHours}h</p>
          <p className="text-xs text-gray-500">Duties</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Briefcase className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.workload.adminHours}h</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
        <div className="border rounded-lg p-3 text-center">
          <Activity className="h-5 w-5 text-orange-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{teacher.workload.extraCurricularHours}h</p>
          <p className="text-xs text-gray-500">Extra</p>
        </div>
      </div>

      {/* Utilization Bar */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Total Utilization</span>
          <span className="text-sm">{teacher.workload.totalHours}/{teacher.workload.maxHours} hours ({teacher.workload.utilizationPercent}%)</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className={`h-3 rounded-full ${getUtilizationColor(teacher.workload.utilizationPercent)}`} style={{ width: `${Math.min(teacher.workload.utilizationPercent, 100)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      {/* Teaching Assignments */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4" />Teaching Assignments ({teacher.teachingAssignments.length})</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 font-medium">Class</th>
                <th className="text-left py-2 px-3 font-medium">Subject</th>
                <th className="text-center py-2 px-3 font-medium">Periods/Week</th>
                <th className="text-center py-2 px-3 font-medium">Students</th>
              </tr>
            </thead>
            <tbody>
              {teacher.teachingAssignments.map((a, i) =>
              <tr key={i} className="border-t">
                  <td className="py-2 px-3">{a.class}-{a.section}</td>
                  <td className="py-2 px-3">{a.subject}</td>
                  <td className="py-2 px-3 text-center font-mono">{a.periodsPerWeek}</td>
                  <td className="py-2 px-3 text-center">{a.students}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr className="border-t">
                <td className="py-2 px-3 font-medium" colSpan={2}>Total</td>
                <td className="py-2 px-3 text-center font-mono font-medium">{teacher.teachingAssignments.reduce((sum, a) => sum + a.periodsPerWeek, 0)}</td>
                <td className="py-2 px-3 text-center font-medium">{totalStudents}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Duty Assignments */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2"><ClipboardList className="h-4 w-4" />Duty Assignments ({teacher.dutyAssignments.length})</h4>
        <div className="space-y-2">
          {teacher.dutyAssignments.map((d, i) =>
          <div key={i} className="p-3 border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">{d.description}</p>
                <p className="text-xs text-gray-500">{d.type} • {d.frequency}</p>
              </div>
              <span className="font-mono text-sm">{d.hoursPerWeek}h/week</span>
            </div>
          )}
        </div>
      </div>

      {/* Skills & Certifications */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {teacher.skills.map((s, i) => <Badge key={i} variant="default">{s}</Badge>)}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-2">Certifications</h4>
          <div className="flex flex-wrap gap-1">
            {teacher.certifications.length ? teacher.certifications.map((c, i) => <Badge key={i} variant="success">{c}</Badge>) : <span className="text-sm text-gray-400">None</span>}
          </div>
        </div>
      </div>

      {/* Remarks */}
      {teacher.remarks &&
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">Admin Remarks</p>
          <p className="text-sm text-yellow-700">{teacher.remarks}</p>
        </div>
      }

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-500">
        <div>
          <p>Performance Rating: <span className="font-medium text-gray-700">{teacher.performanceRating}/5</span></p>
          <p>Leave Balance: <span className="font-medium text-gray-700">{teacher.leaveBalance} days</span></p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-2" />Adjust Workload</Button>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>);

};

const RecommendationsView = ({ teachers, onClose }: {teachers: Teacher[];onClose: () => void;}) => {
  const overloaded = teachers.filter((t) => t.status === 'Overloaded' || t.status === 'Critical');
  const underloaded = teachers.filter((t) => t.status === 'Underloaded');

  const recommendations = useMemo(() => {
    const recs: {type: 'transfer' | 'redistribute' | 'hire' | 'reduce';description: string;from?: string;to?: string;impact: string;}[] = [];

    overloaded.forEach((over) => {
      const available = underloaded.find((under) => under.department === over.department || under.workload.utilizationPercent < 60);
      if (available) {
        recs.push({ type: 'transfer', description: `Transfer duty from ${over.name} to ${available.name}`, from: over.name, to: available.name, impact: `Reduces ${over.name}'s load by ~5%` });
      }
    });

    if (overloaded.length > 3) {
      recs.push({ type: 'hire', description: 'Consider hiring additional staff', impact: 'Multiple teachers are overloaded' });
    }

    underloaded.forEach((under) => {
      if (under.workload.utilizationPercent < 50) {
        recs.push({ type: 'redistribute', description: `Assign additional classes to ${under.name}`, to: under.name, impact: `Can take ${Math.round((under.workload.maxHours - under.workload.totalHours) / 6)} more classes` });
      }
    });

    return recs;
  }, [overloaded, underloaded]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
          <p className="text-sm font-medium text-red-800">Overloaded Teachers</p>
          <p className="text-2xl font-bold text-red-600">{overloaded.length}</p>
        </div>
        <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-800">Underloaded Teachers</p>
          <p className="text-2xl font-bold text-yellow-600">{underloaded.length}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Recommendations ({recommendations.length})</h4>
        <div className="space-y-2">
          {recommendations.map((rec, i) =>
          <div key={i} className="p-3 border rounded-lg flex items-start justify-between">
              <div className="flex items-start gap-3">
                {rec.type === 'transfer' && <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5" />}
                {rec.type === 'redistribute' && <Target className="h-5 w-5 text-green-500 mt-0.5" />}
                {rec.type === 'hire' && <Users className="h-5 w-5 text-purple-500 mt-0.5" />}
                <div>
                  <p className="font-medium text-sm">{rec.description}</p>
                  <p className="text-xs text-gray-500">{rec.impact}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Apply</Button>
            </div>
          )}
          {recommendations.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No recommendations at this time. Workload is balanced.</p>}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>);

};

// ==================== MAIN COMPONENT ====================

export function TeacherWorkloadView() {
  const [teachers] = useState<Teacher[]>(teachersData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [departmentFilter, setDepartmentFilter] = useState<FilterDepartment>('All');
  const [sortKey, setSortKey] = useState<SortKey>('utilization');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [modal, setModal] = useState<ModalType>('none');
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    total: teachers.length,
    critical: teachers.filter((t) => t.status === 'Critical').length,
    overloaded: teachers.filter((t) => t.status === 'Overloaded').length,
    balanced: teachers.filter((t) => t.status === 'Balanced' || t.status === 'Optimal').length,
    underloaded: teachers.filter((t) => t.status === 'Underloaded').length,
    avgUtilization: Math.round(teachers.reduce((sum, t) => sum + t.workload.utilizationPercent, 0) / teachers.length),
    totalTeachingHours: teachers.reduce((sum, t) => sum + t.workload.teachingHours, 0),
    totalDutyHours: teachers.reduce((sum, t) => sum + t.workload.dutyHours, 0)
  }), [teachers]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let data = [...teachers];
    if (search) data = data.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.employeeId.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'All') data = data.filter((t) => t.status === statusFilter);
    if (departmentFilter !== 'All') data = data.filter((t) => t.department === departmentFilter);

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);else
      if (sortKey === 'department') cmp = a.department.localeCompare(b.department);else
      if (sortKey === 'teachingHours') cmp = a.workload.teachingHours - b.workload.teachingHours;else
      if (sortKey === 'dutyHours') cmp = a.workload.dutyHours - b.workload.dutyHours;else
      if (sortKey === 'utilization') cmp = a.workload.utilizationPercent - b.workload.utilizationPercent;else
      if (sortKey === 'status') cmp = STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return data;
  }, [teachers, search, statusFilter, departmentFilter, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {if (sortKey === key) setSortOrder((o) => o === 'asc' ? 'desc' : 'asc');else {setSortKey(key);setSortOrder('desc');}};
  const SortIcon = ({ column }: {column: SortKey;}) => sortKey === column ? sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" /> : <ArrowUpDown className="h-3 w-3 opacity-30" />;

  const closeModal = () => {setModal('none');setSelectedTeacher(null);};

  const exportData = (format: 'csv' | 'json') => {
    const content = format === 'csv' ?
    [['Name', 'Department', 'Teaching Hours', 'Duty Hours', 'Total Hours', 'Max Hours', 'Utilization', 'Status'].join(','),
    ...teachers.map((t) => [t.name, t.department, t.workload.teachingHours, t.workload.dutyHours, t.workload.totalHours, t.workload.maxHours, `${t.workload.utilizationPercent}%`, t.status].join(','))].join('\n') :
    JSON.stringify(teachers, null, 2);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const a = document.createElement('a');a.href = URL.createObjectURL(blob);a.download = `teacher_workload.${format}`;a.click();
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Workload Analysis</h1>
          <p className="text-sm text-gray-500">Analyze and balance workload distribution across staff</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setModal('recommendations')}><Target className="h-4 w-4 mr-2" />Recommendations</Button>
          <Button variant="outline" size="sm" onClick={() => setModal('export')}><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} value={stats.total} label="Total Teachers" color="text-blue-500" />
        <StatCard icon={AlertCircle} value={stats.critical + stats.overloaded} label="Overloaded" color="text-red-500" trend={stats.critical > 0 ? 'up' : 'stable'} />
        <StatCard icon={CheckCircle} value={stats.balanced} label="Balanced" color="text-green-500" />
        <StatCard icon={AlertTriangle} value={stats.underloaded} label="Underloaded" color="text-yellow-500" />
        <StatCard icon={BarChart3} value={`${stats.avgUtilization}%`} label="Avg Utilization" color="text-purple-500" />
        <StatCard icon={Clock} value={stats.totalTeachingHours} label="Total Teaching Hrs" color="text-indigo-500" />
      </div>

      {/* Workload Distribution Summary */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-3">Workload Distribution</h3>
          <div className="flex items-center gap-2 h-8 rounded-lg overflow-hidden">
            {stats.critical > 0 && <div className="bg-red-600 h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.critical / stats.total * 100}%` }}>{stats.critical}</div>}
            <div className="bg-red-400 h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.overloaded / stats.total * 100}%` }}>{stats.overloaded}</div>
            <div className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium" style={{ width: `${stats.balanced / stats.total * 100}%` }}>{stats.balanced}</div>
            <div className="bg-yellow-400 h-full flex items-center justify-center text-gray-800 text-xs font-medium" style={{ width: `${stats.underloaded / stats.total * 100}%` }}>{stats.underloaded}</div>
          </div>
          <div className="flex justify-between text-xs mt-2 text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span>Critical/Overloaded</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span>Balanced/Optimal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded"></span>Underloaded</span>
          </div>
        </div>
      </Card>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search by name, ID, or department..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}><Filter className="h-4 w-4 mr-2" />Filters</Button>
      </div>

      {showFilters &&
      <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FilterStatus)} className="px-3 py-1.5 border rounded text-sm">
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Department</label>
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value as FilterDepartment)} className="px-3 py-1.5 border rounded text-sm">
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="ghost" size="sm" onClick={() => {setStatusFilter('All');setDepartmentFilter('All');setSearch('');}}>Clear</Button>
          </div>
        </div>
      }

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}><div className="flex items-center gap-1">Teacher Name <SortIcon column="name" /></div></th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}><div className="flex items-center gap-1">Department <SortIcon column="department" /></div></th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('teachingHours')}><div className="flex items-center justify-center gap-1">Teaching <SortIcon column="teachingHours" /></div></th>
                <th className="text-center py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('dutyHours')}><div className="flex items-center justify-center gap-1">Duty <SortIcon column="dutyHours" /></div></th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 w-48 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('utilization')}><div className="flex items-center gap-1">Utilization <SortIcon column="utilization" /></div></th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}><div className="flex items-center gap-1">Status <SortIcon column="status" /></div></th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length ? filteredData.map((teacher) =>
              <tr key={teacher.id} className={`border-b border-gray-100 hover:bg-gray-50 ${teacher.status === 'Critical' ? 'bg-red-50' : ''}`}>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{teacher.name}</p>
                      <p className="text-xs text-gray-400">{teacher.employeeId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{teacher.department}</td>
                  <td className="py-3 px-4 text-center font-mono">{teacher.workload.teachingHours}h</td>
                  <td className="py-3 px-4 text-center font-mono">{teacher.workload.dutyHours}h</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={teacher.workload.totalHours} max={teacher.workload.maxHours} />
                      {teacher.trend === 'increasing' && <TrendingUp className="h-3 w-3 text-red-500" />}
                      {teacher.trend === 'decreasing' && <TrendingDown className="h-3 w-3 text-green-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4"><Badge variant={getStatusVariant(teacher.status)}>{teacher.status}</Badge></td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => {setSelectedTeacher(teacher);setModal('viewTeacher');}}><Eye className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ) :
              <tr><td colSpan={7} className="py-8 text-center text-gray-500">No teachers found matching your criteria</td></tr>
              }
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t text-sm text-gray-500">Showing {filteredData.length} of {teachers.length} teachers</div>
      </Card>

      {/* Department Summary */}
      <Card>
        <div className="p-4">
          <h3 className="font-semibold mb-3">Department-wise Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {DEPARTMENTS.filter((d) => teachers.some((t) => t.department === d)).map((dept) => {
              const deptTeachers = teachers.filter((t) => t.department === dept);
              const avgUtil = Math.round(deptTeachers.reduce((sum, t) => sum + t.workload.utilizationPercent, 0) / deptTeachers.length);
              const overloaded = deptTeachers.filter((t) => t.status === 'Overloaded' || t.status === 'Critical').length;
              return (
                <div key={dept} className="p-3 border rounded-lg">
                  <p className="text-sm font-medium truncate">{dept}</p>
                  <p className="text-lg font-bold">{avgUtil}%</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{deptTeachers.length} teachers</span>
                    {overloaded > 0 && <span className="text-red-500">{overloaded} overloaded</span>}
                  </div>
                </div>);

            })}
          </div>
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={modal === 'viewTeacher'} onClose={closeModal} title="Teacher Workload Details" size="xl">
        {selectedTeacher && <TeacherDetailView teacher={selectedTeacher} onClose={closeModal} />}
      </Modal>

      <Modal isOpen={modal === 'recommendations'} onClose={closeModal} title="Workload Recommendations" size="lg">
        <RecommendationsView teachers={teachers} onClose={closeModal} />
      </Modal>

      <Modal isOpen={modal === 'export'} onClose={closeModal} title="Export Workload Data" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Export workload data for {teachers.length} teachers</p>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => {exportData('csv');closeModal();}}><FileText className="h-4 w-4 mr-2" />Export as CSV</Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => {exportData('json');closeModal();}}><FileText className="h-4 w-4 mr-2" />Export as JSON</Button>
          </div>
        </div>
      </Modal>
    </div>);

}