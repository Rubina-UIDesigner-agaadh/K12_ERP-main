// src/pages/academic/event-activities/ConflictDetection.tsx

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import {
  AlertTriangle, Search, X, Check, Filter, Download, RefreshCw, Calendar, Clock,
  Users, MapPin, BookOpen, Layers, Zap, Eye, Edit, AlertCircle, Info, ChevronRight,
  Settings, Play, History, Trash2, Bell, FileText, CheckCircle, Loader2, GraduationCap,
  ChevronDown, ChevronUp, ArrowUpDown, Shield, Activity, Target, XCircle } from
'lucide-react';

// ==================== TYPES ====================

type ConflictType = 'teacher_double_booking' | 'room_double_booking' | 'class_overlap' | 'resource_conflict' | 'time_gap_violation' | 'workload_violation' | 'consecutive_period_violation';
type ConflictSeverity = 'critical' | 'warning' | 'info';
type ConflictStatus = 'unresolved' | 'acknowledged' | 'resolved' | 'ignored';
type ResolutionAction = 'reassign_teacher' | 'change_room' | 'reschedule_time' | 'cancel_activity' | 'merge_activities' | 'split_class';
type ActivityType = 'class' | 'exam' | 'meeting' | 'duty' | 'event';
type ActivityStatus = 'scheduled' | 'cancelled';

type Teacher = {id: string;name: string;shortName: string;maxPeriodsPerDay: number;department: string;};
type Room = {id: string;name: string;capacity: number;type: string;};
type ClassSection = {id: string;name: string;strength: number;};
type Period = {id: string;number: number;startTime: string;endTime: string;label: string;};

type Activity = {
  id: string;type: ActivityType;title: string;date: string;periodId: string;
  teacherIds: string[];roomId: string;classId: string;subject: string;
  status: ActivityStatus;createdAt: string;
};

type Conflict = {
  id: string;type: ConflictType;severity: ConflictSeverity;status: ConflictStatus;
  detectedAt: string;resolvedAt: string | null;resolvedBy: string | null;
  date: string;periodId: string;description: string;conflictingActivities: string[];
  affectedTeachers: string[];affectedRooms: string[];affectedClasses: string[];
  resolutionAction: ResolutionAction | null;resolutionNotes: string;
  acknowledgedBy: string | null;acknowledgedAt: string | null;
  autoResolvable: boolean;suggestedActions: ResolutionAction[];
};

type ConflictRule = {
  id: string;name: string;type: ConflictType;enabled: boolean;severity: ConflictSeverity;
  description: string;autoResolve: boolean;notifyOnDetect: boolean;
};

type FilterType = ConflictType | 'all';
type FilterSeverity = ConflictSeverity | 'all';
type FilterStatus = ConflictStatus | 'all';
type SortKey = 'date' | 'severity' | 'type' | 'status';
type SortOrder = 'asc' | 'desc';
type ModalType = 'none' | 'detail' | 'resolve' | 'rules' | 'activity';

// ==================== DATA ====================

const CONFLICT_TYPES: {value: ConflictType;label: string;icon: React.ElementType;description: string;}[] = [
{ value: 'teacher_double_booking', label: 'Teacher Double Booking', icon: Users, description: 'Teacher assigned to multiple activities at same time' },
{ value: 'room_double_booking', label: 'Room Double Booking', icon: MapPin, description: 'Room booked for multiple activities simultaneously' },
{ value: 'class_overlap', label: 'Class Overlap', icon: Layers, description: 'Same class scheduled for multiple subjects at once' },
{ value: 'resource_conflict', label: 'Resource Conflict', icon: BookOpen, description: 'Shared resource allocated to multiple users' },
{ value: 'time_gap_violation', label: 'Time Gap Violation', icon: Clock, description: 'Insufficient break between consecutive periods' },
{ value: 'workload_violation', label: 'Workload Violation', icon: Zap, description: 'Teacher exceeds maximum periods per day' },
{ value: 'consecutive_period_violation', label: 'Consecutive Period Limit', icon: AlertCircle, description: 'Teacher has too many consecutive periods' }];


const SEVERITY_CONFIG: Record<ConflictSeverity, {label: string;variant: 'danger' | 'warning' | 'default';bgColor: string;}> = {
  critical: { label: 'Critical', variant: 'danger', bgColor: 'bg-red-50 border-red-200' },
  warning: { label: 'Warning', variant: 'warning', bgColor: 'bg-yellow-50 border-yellow-200' },
  info: { label: 'Info', variant: 'default', bgColor: 'bg-blue-50 border-blue-200' }
};

const STATUS_CONFIG: Record<ConflictStatus, {label: string;variant: 'danger' | 'warning' | 'success' | 'default';}> = {
  unresolved: { label: 'Unresolved', variant: 'danger' },
  acknowledged: { label: 'Acknowledged', variant: 'warning' },
  resolved: { label: 'Resolved', variant: 'success' },
  ignored: { label: 'Ignored', variant: 'default' }
};

const RESOLUTION_ACTIONS: {value: ResolutionAction;label: string;description: string;}[] = [
{ value: 'reassign_teacher', label: 'Reassign Teacher', description: 'Assign different teacher to one activity' },
{ value: 'change_room', label: 'Change Room', description: 'Move activity to different room' },
{ value: 'reschedule_time', label: 'Reschedule', description: 'Move activity to different time slot' },
{ value: 'cancel_activity', label: 'Cancel Activity', description: 'Cancel one of the conflicting activities' },
{ value: 'merge_activities', label: 'Merge Activities', description: 'Combine similar activities' },
{ value: 'split_class', label: 'Split Class', description: 'Divide class into sections' }];


const TEACHERS: Teacher[] = [
{ id: 't1', name: 'Dr. Rajesh Sharma', shortName: 'R. Sharma', maxPeriodsPerDay: 7, department: 'Mathematics' },
{ id: 't2', name: 'Mr. Ankit Gupta', shortName: 'A. Gupta', maxPeriodsPerDay: 6, department: 'Science' },
{ id: 't3', name: 'Mrs. Kavita Devi', shortName: 'K. Devi', maxPeriodsPerDay: 7, department: 'Languages' },
{ id: 't4', name: 'Mr. Mohan Verma', shortName: 'M. Verma', maxPeriodsPerDay: 6, department: 'Science' },
{ id: 't5', name: 'Mrs. Priya Joshi', shortName: 'P. Joshi', maxPeriodsPerDay: 7, department: 'English' },
{ id: 't6', name: 'Mr. Suresh Kumar', shortName: 'S. Kumar', maxPeriodsPerDay: 6, department: 'Social Studies' }];


const ROOMS: Room[] = [
{ id: 'r1', name: 'Room 101', capacity: 40, type: 'Classroom' },
{ id: 'r2', name: 'AV Room', capacity: 100, type: 'Auditorium' },
{ id: 'r3', name: 'Physics Lab', capacity: 30, type: 'Laboratory' },
{ id: 'r4', name: 'Computer Lab', capacity: 35, type: 'Laboratory' },
{ id: 'r5', name: 'Hall A', capacity: 200, type: 'Hall' },
{ id: 'r6', name: 'Room 102', capacity: 40, type: 'Classroom' }];


const CLASSES: ClassSection[] = [
{ id: 'c1', name: 'X-A', strength: 40 },
{ id: 'c2', name: 'X-B', strength: 38 },
{ id: 'c3', name: 'IX-A', strength: 42 },
{ id: 'c4', name: 'VIII-A', strength: 35 },
{ id: 'c5', name: 'IX-B', strength: 40 }];


const PERIODS: Period[] = [
{ id: 'p1', number: 1, startTime: '08:00', endTime: '08:45', label: 'P1 (08:00-08:45)' },
{ id: 'p2', number: 2, startTime: '08:45', endTime: '09:30', label: 'P2 (08:45-09:30)' },
{ id: 'p3', number: 3, startTime: '09:45', endTime: '10:30', label: 'P3 (09:45-10:30)' },
{ id: 'p4', number: 4, startTime: '10:30', endTime: '11:15', label: 'P4 (10:30-11:15)' },
{ id: 'p5', number: 5, startTime: '11:30', endTime: '12:15', label: 'P5 (11:30-12:15)' },
{ id: 'p6', number: 6, startTime: '12:15', endTime: '13:00', label: 'P6 (12:15-13:00)' },
{ id: 'p7', number: 7, startTime: '14:00', endTime: '14:45', label: 'P7 (14:00-14:45)' },
{ id: 'p8', number: 8, startTime: '14:45', endTime: '15:30', label: 'P8 (14:45-15:30)' }];


// ==================== UTILITIES ====================

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatDateTime = (datetime: string) => new Date(datetime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const getDateString = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {const d = new Date(date);d.setDate(d.getDate() + days);return d;};

const getTeacherName = (id: string) => TEACHERS.find((t) => t.id === id)?.shortName || id;
const getRoomName = (id: string) => ROOMS.find((r) => r.id === id)?.name || id;
const getClassName = (id: string) => CLASSES.find((c) => c.id === id)?.name || id;
const getPeriodLabel = (id: string) => PERIODS.find((p) => p.id === id)?.label || id;

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

const FormField = ({ label, required, children }: {label: string;required?: boolean;children: React.ReactNode;}) =>
<div><label className="block text-sm font-medium mb-1">{label} {required && <span className="text-red-500">*</span>}</label>{children}</div>;


const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) =>
<input className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`} {...props} />;


const Textarea = ({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) =>
<textarea className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`} {...props} />;


const Select = ({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) =>
<select className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`} {...props}>{children}</select>;


const StatCard = ({ value, label, color, icon: Icon }: {value: number;label: string;color: string;icon?: React.ElementType;}) =>
<div className="border rounded-lg p-4">
    <div className="flex items-center gap-3">
      {Icon && <Icon className={`h-6 w-6 ${color}`} />}
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
    </div>
  </div>;


const Alert = ({ type, children }: {type: 'info' | 'warning' | 'error' | 'success';children: React.ReactNode;}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    success: 'bg-green-50 border-green-200 text-green-800'
  };
  return <div className={`p-3 border rounded-lg text-sm ${styles[type]}`}>{children}</div>;
};

// ==================== INITIAL DATA GENERATOR ====================

const generateInitialActivities = (): Activity[] => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const dayAfter = addDays(today, 2);

  return [
  // Teacher double booking scenario
  { id: 'a1', type: 'class', title: 'Mathematics', date: getDateString(tomorrow), periodId: 'p2', teacherIds: ['t1'], roomId: 'r1', classId: 'c1', subject: 'Mathematics', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a2', type: 'exam', title: 'Exam Invigilation', date: getDateString(tomorrow), periodId: 'p2', teacherIds: ['t1'], roomId: 'r5', classId: '', subject: '', status: 'scheduled', createdAt: new Date().toISOString() },

  // Room double booking scenario
  { id: 'a3', type: 'meeting', title: 'Guest Lecture', date: getDateString(dayAfter), periodId: 'p5', teacherIds: ['t2'], roomId: 'r2', classId: '', subject: '', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a4', type: 'meeting', title: 'Staff Meeting', date: getDateString(dayAfter), periodId: 'p5', teacherIds: ['t3', 't4', 't5'], roomId: 'r2', classId: '', subject: '', status: 'scheduled', createdAt: new Date().toISOString() },

  // Consecutive periods violation (4+ consecutive)
  { id: 'a5', type: 'class', title: 'Physics', date: getDateString(today), periodId: 'p1', teacherIds: ['t2'], roomId: 'r3', classId: 'c3', subject: 'Physics', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a6', type: 'class', title: 'Physics', date: getDateString(today), periodId: 'p2', teacherIds: ['t2'], roomId: 'r3', classId: 'c4', subject: 'Physics', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a7', type: 'class', title: 'Physics', date: getDateString(today), periodId: 'p3', teacherIds: ['t2'], roomId: 'r3', classId: 'c5', subject: 'Physics', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a8', type: 'class', title: 'Physics', date: getDateString(today), periodId: 'p4', teacherIds: ['t2'], roomId: 'r3', classId: 'c1', subject: 'Physics', status: 'scheduled', createdAt: new Date().toISOString() },

  // Normal activities (no conflict)
  { id: 'a9', type: 'class', title: 'English', date: getDateString(today), periodId: 'p1', teacherIds: ['t5'], roomId: 'r1', classId: 'c1', subject: 'English', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a10', type: 'class', title: 'Hindi', date: getDateString(today), periodId: 'p2', teacherIds: ['t3'], roomId: 'r6', classId: 'c2', subject: 'Hindi', status: 'scheduled', createdAt: new Date().toISOString() },

  // Workload violation - 8 classes in one day
  { id: 'a11', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p1', teacherIds: ['t6'], roomId: 'r1', classId: 'c1', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a12', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p3', teacherIds: ['t6'], roomId: 'r1', classId: 'c2', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a13', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p4', teacherIds: ['t6'], roomId: 'r1', classId: 'c3', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a14', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p5', teacherIds: ['t6'], roomId: 'r1', classId: 'c4', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a15', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p6', teacherIds: ['t6'], roomId: 'r1', classId: 'c5', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a16', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p7', teacherIds: ['t6'], roomId: 'r1', classId: 'c1', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() },
  { id: 'a17', type: 'class', title: 'Social Studies', date: getDateString(tomorrow), periodId: 'p8', teacherIds: ['t6'], roomId: 'r1', classId: 'c2', subject: 'Social Studies', status: 'scheduled', createdAt: new Date().toISOString() }];

};

const generateInitialRules = (): ConflictRule[] => [
{ id: 'cr1', name: 'Teacher Double Booking', type: 'teacher_double_booking', enabled: true, severity: 'critical', description: 'Prevent teachers from being scheduled in two places at once', autoResolve: false, notifyOnDetect: true },
{ id: 'cr2', name: 'Room Double Booking', type: 'room_double_booking', enabled: true, severity: 'critical', description: 'Prevent room scheduling conflicts', autoResolve: false, notifyOnDetect: true },
{ id: 'cr3', name: 'Class Overlap', type: 'class_overlap', enabled: true, severity: 'critical', description: 'Prevent same class from having multiple subjects at once', autoResolve: false, notifyOnDetect: true },
{ id: 'cr4', name: 'Workload Violation', type: 'workload_violation', enabled: true, severity: 'warning', description: 'Check if teacher exceeds maximum daily periods', autoResolve: false, notifyOnDetect: true },
{ id: 'cr5', name: 'Consecutive Periods', type: 'consecutive_period_violation', enabled: true, severity: 'warning', description: 'Maximum 3 consecutive periods per teacher', autoResolve: false, notifyOnDetect: false },
{ id: 'cr6', name: 'Resource Conflict', type: 'resource_conflict', enabled: false, severity: 'warning', description: 'Check shared resource availability', autoResolve: false, notifyOnDetect: false },
{ id: 'cr7', name: 'Time Gap Violation', type: 'time_gap_violation', enabled: false, severity: 'info', description: 'Ensure sufficient breaks between activities', autoResolve: false, notifyOnDetect: false }];


// ==================== MAIN COMPONENT ====================

export function ConflictDetection() {
  const [activities, setActivities] = useState<Activity[]>(generateInitialActivities);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [conflictRules, setConflictRules] = useState<ConflictRule[]>(generateInitialRules);

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterSeverity, setFilterSeverity] = useState<FilterSeverity>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('severity');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);
  const [autoScanEnabled, setAutoScanEnabled] = useState(false);

  const [modal, setModal] = useState<ModalType>('none');
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedAction, setSelectedAction] = useState<ResolutionAction | ''>('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Conflict detection logic
  const detectConflicts = useCallback(() => {
    setIsScanning(true);

    setTimeout(() => {
      const newConflicts: Conflict[] = [];
      const activeRules = conflictRules.filter((r) => r.enabled);
      const scheduledActivities = activities.filter((a) => a.status === 'scheduled');

      // Teacher double booking
      if (activeRules.some((r) => r.type === 'teacher_double_booking')) {
        scheduledActivities.forEach((activity, i) => {
          scheduledActivities.slice(i + 1).forEach((other) => {
            if (activity.date === other.date && activity.periodId === other.periodId) {
              const commonTeachers = activity.teacherIds.filter((t) => other.teacherIds.includes(t));
              commonTeachers.forEach((teacherId) => {
                const existing = newConflicts.find((c) =>
                c.type === 'teacher_double_booking' &&
                c.date === activity.date &&
                c.periodId === activity.periodId &&
                c.affectedTeachers.includes(teacherId)
                );
                if (!existing) {
                  newConflicts.push({
                    id: generateId(), type: 'teacher_double_booking', severity: 'critical', status: 'unresolved',
                    detectedAt: new Date().toISOString(), resolvedAt: null, resolvedBy: null,
                    date: activity.date, periodId: activity.periodId,
                    description: `${getTeacherName(teacherId)} is scheduled for multiple activities at the same time`,
                    conflictingActivities: [activity.id, other.id], affectedTeachers: [teacherId],
                    affectedRooms: [], affectedClasses: [], resolutionAction: null, resolutionNotes: '',
                    acknowledgedBy: null, acknowledgedAt: null, autoResolvable: false,
                    suggestedActions: ['reassign_teacher', 'reschedule_time', 'cancel_activity']
                  });
                }
              });
            }
          });
        });
      }

      // Room double booking
      if (activeRules.some((r) => r.type === 'room_double_booking')) {
        scheduledActivities.filter((a) => a.roomId).forEach((activity, i) => {
          scheduledActivities.filter((a) => a.roomId).slice(i + 1).forEach((other) => {
            if (activity.date === other.date && activity.periodId === other.periodId && activity.roomId === other.roomId) {
              const existing = newConflicts.find((c) =>
              c.type === 'room_double_booking' &&
              c.date === activity.date &&
              c.periodId === activity.periodId &&
              c.affectedRooms.includes(activity.roomId)
              );
              if (!existing) {
                newConflicts.push({
                  id: generateId(), type: 'room_double_booking', severity: 'critical', status: 'unresolved',
                  detectedAt: new Date().toISOString(), resolvedAt: null, resolvedBy: null,
                  date: activity.date, periodId: activity.periodId,
                  description: `${getRoomName(activity.roomId)} is booked for multiple activities simultaneously`,
                  conflictingActivities: [activity.id, other.id], affectedTeachers: [],
                  affectedRooms: [activity.roomId], affectedClasses: [], resolutionAction: null, resolutionNotes: '',
                  acknowledgedBy: null, acknowledgedAt: null, autoResolvable: true,
                  suggestedActions: ['change_room', 'reschedule_time', 'merge_activities']
                });
              }
            }
          });
        });
      }

      // Class overlap
      if (activeRules.some((r) => r.type === 'class_overlap')) {
        scheduledActivities.filter((a) => a.classId).forEach((activity, i) => {
          scheduledActivities.filter((a) => a.classId).slice(i + 1).forEach((other) => {
            if (activity.date === other.date && activity.periodId === other.periodId && activity.classId === other.classId) {
              const existing = newConflicts.find((c) =>
              c.type === 'class_overlap' &&
              c.date === activity.date &&
              c.periodId === activity.periodId &&
              c.affectedClasses.includes(activity.classId)
              );
              if (!existing) {
                newConflicts.push({
                  id: generateId(), type: 'class_overlap', severity: 'critical', status: 'unresolved',
                  detectedAt: new Date().toISOString(), resolvedAt: null, resolvedBy: null,
                  date: activity.date, periodId: activity.periodId,
                  description: `${getClassName(activity.classId)} has multiple subjects scheduled at the same time`,
                  conflictingActivities: [activity.id, other.id], affectedTeachers: [],
                  affectedRooms: [], affectedClasses: [activity.classId], resolutionAction: null, resolutionNotes: '',
                  acknowledgedBy: null, acknowledgedAt: null, autoResolvable: false,
                  suggestedActions: ['reschedule_time', 'split_class', 'cancel_activity']
                });
              }
            }
          });
        });
      }

      // Workload violation
      if (activeRules.some((r) => r.type === 'workload_violation')) {
        const teacherDailyLoad: Record<string, Record<string, string[]>> = {};
        scheduledActivities.filter((a) => a.type === 'class').forEach((activity) => {
          activity.teacherIds.forEach((teacherId) => {
            if (!teacherDailyLoad[teacherId]) teacherDailyLoad[teacherId] = {};
            if (!teacherDailyLoad[teacherId][activity.date]) teacherDailyLoad[teacherId][activity.date] = [];
            teacherDailyLoad[teacherId][activity.date].push(activity.id);
          });
        });

        Object.entries(teacherDailyLoad).forEach(([teacherId, dates]) => {
          const teacher = TEACHERS.find((t) => t.id === teacherId);
          if (!teacher) return;
          Object.entries(dates).forEach(([date, activityIds]) => {
            if (activityIds.length > teacher.maxPeriodsPerDay) {
              newConflicts.push({
                id: generateId(), type: 'workload_violation', severity: 'warning', status: 'unresolved',
                detectedAt: new Date().toISOString(), resolvedAt: null, resolvedBy: null,
                date, periodId: '',
                description: `${teacher.shortName} has ${activityIds.length} periods on this day (maximum: ${teacher.maxPeriodsPerDay})`,
                conflictingActivities: activityIds, affectedTeachers: [teacherId],
                affectedRooms: [], affectedClasses: [], resolutionAction: null, resolutionNotes: '',
                acknowledgedBy: null, acknowledgedAt: null, autoResolvable: false,
                suggestedActions: ['reassign_teacher', 'cancel_activity']
              });
            }
          });
        });
      }

      // Consecutive periods violation
      if (activeRules.some((r) => r.type === 'consecutive_period_violation')) {
        TEACHERS.forEach((teacher) => {
          const teacherActivities = scheduledActivities.
          filter((a) => a.teacherIds.includes(teacher.id)).
          sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            const periodA = PERIODS.find((p) => p.id === a.periodId)?.number || 0;
            const periodB = PERIODS.find((p) => p.id === b.periodId)?.number || 0;
            return periodA - periodB;
          });

          const dailyGroups: Record<string, Activity[]> = {};
          teacherActivities.forEach((a) => {
            if (!dailyGroups[a.date]) dailyGroups[a.date] = [];
            dailyGroups[a.date].push(a);
          });

          Object.entries(dailyGroups).forEach(([date, dayActivities]) => {
            if (dayActivities.length < 4) return;

            let consecutive = 1;
            let maxConsecutive = 1;
            let consecutiveIds: string[] = [dayActivities[0]?.id];
            let maxConsecutiveIds: string[] = [dayActivities[0]?.id];

            for (let i = 1; i < dayActivities.length; i++) {
              const prevPeriod = PERIODS.find((p) => p.id === dayActivities[i - 1].periodId)?.number || 0;
              const currPeriod = PERIODS.find((p) => p.id === dayActivities[i].periodId)?.number || 0;

              if (currPeriod === prevPeriod + 1) {
                consecutive++;
                consecutiveIds.push(dayActivities[i].id);
                if (consecutive > maxConsecutive) {
                  maxConsecutive = consecutive;
                  maxConsecutiveIds = [...consecutiveIds];
                }
              } else {
                consecutive = 1;
                consecutiveIds = [dayActivities[i].id];
              }
            }

            if (maxConsecutive > 3) {
              newConflicts.push({
                id: generateId(), type: 'consecutive_period_violation', severity: 'warning', status: 'unresolved',
                detectedAt: new Date().toISOString(), resolvedAt: null, resolvedBy: null,
                date, periodId: '',
                description: `${teacher.shortName} has ${maxConsecutive} consecutive periods (maximum: 3)`,
                conflictingActivities: maxConsecutiveIds, affectedTeachers: [teacher.id],
                affectedRooms: [], affectedClasses: [], resolutionAction: null, resolutionNotes: '',
                acknowledgedBy: null, acknowledgedAt: null, autoResolvable: false,
                suggestedActions: ['reschedule_time', 'reassign_teacher']
              });
            }
          });
        });
      }

      setConflicts(newConflicts);
      setLastScanTime(new Date());
      setIsScanning(false);
    }, 1000);
  }, [activities, conflictRules]);

  // Auto scan effect
  useEffect(() => {
    if (autoScanEnabled) {
      const interval = setInterval(detectConflicts, 30000);
      return () => clearInterval(interval);
    }
  }, [autoScanEnabled, detectConflicts]);

  // Filtered and sorted conflicts
  const filteredConflicts = useMemo(() => {
    let data = [...conflicts];

    if (filterType !== 'all') data = data.filter((c) => c.type === filterType);
    if (filterSeverity !== 'all') data = data.filter((c) => c.severity === filterSeverity);
    if (filterStatus !== 'all') data = data.filter((c) => c.status === filterStatus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter((c) =>
      c.description.toLowerCase().includes(q) ||
      c.affectedTeachers.some((id) => getTeacherName(id).toLowerCase().includes(q)) ||
      c.affectedRooms.some((id) => getRoomName(id).toLowerCase().includes(q))
      );
    }

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);else
      if (sortKey === 'severity') {
        const order = { critical: 0, warning: 1, info: 2 };
        cmp = order[a.severity] - order[b.severity];
      } else if (sortKey === 'type') cmp = a.type.localeCompare(b.type);else
      if (sortKey === 'status') {
        const order = { unresolved: 0, acknowledged: 1, resolved: 2, ignored: 3 };
        cmp = order[a.status] - order[b.status];
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [conflicts, filterType, filterSeverity, filterStatus, searchQuery, sortKey, sortOrder]);

  // Stats
  const stats = useMemo(() => ({
    total: conflicts.length,
    critical: conflicts.filter((c) => c.severity === 'critical').length,
    warning: conflicts.filter((c) => c.severity === 'warning').length,
    unresolved: conflicts.filter((c) => c.status === 'unresolved').length,
    resolved: conflicts.filter((c) => c.status === 'resolved').length
  }), [conflicts]);

  // Handlers
  const handleAcknowledge = useCallback((id: string) => {
    setConflicts((prev) => prev.map((c) => c.id === id ? {
      ...c, status: 'acknowledged', acknowledgedBy: 'Admin', acknowledgedAt: new Date().toISOString()
    } : c));
  }, []);

  const handleResolve = useCallback(() => {
    if (!selectedConflict || !selectedAction) return;
    setConflicts((prev) => prev.map((c) => c.id === selectedConflict.id ? {
      ...c, status: 'resolved', resolutionAction: selectedAction, resolutionNotes,
      resolvedBy: 'Admin', resolvedAt: new Date().toISOString()
    } : c));
    setModal('none');
    setSelectedConflict(null);
    setSelectedAction('');
    setResolutionNotes('');
  }, [selectedConflict, selectedAction, resolutionNotes]);

  const handleIgnore = useCallback((id: string) => {
    setConflicts((prev) => prev.map((c) => c.id === id ? { ...c, status: 'ignored' } : c));
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this conflict?')) {
      setConflicts((prev) => prev.filter((c) => c.id !== id));
    }
  }, []);

  const handleToggleRule = useCallback((id: string) => {
    setConflictRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }, []);

  const handleExport = useCallback(() => {
    const data = filteredConflicts.map((c) => ({
      Type: CONFLICT_TYPES.find((t) => t.value === c.type)?.label,
      Severity: SEVERITY_CONFIG[c.severity].label,
      Status: STATUS_CONFIG[c.status].label,
      Date: formatDate(c.date),
      Period: c.periodId ? getPeriodLabel(c.periodId) : '-',
      Description: c.description,
      Teachers: c.affectedTeachers.map(getTeacherName).join(', '),
      Rooms: c.affectedRooms.map(getRoomName).join(', '),
      DetectedAt: formatDateTime(c.detectedAt),
      ResolvedAt: c.resolvedAt ? formatDateTime(c.resolvedAt) : '-'
    }));

    const headers = Object.keys(data[0] || {});
    const csv = [headers.join(','), ...data.map((row) => headers.map((h) => `"${(row as any)[h] || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');a.href = URL.createObjectURL(blob);
    a.download = `conflicts_${new Date().toISOString().split('T')[0]}.csv`;a.click();
  }, [filteredConflicts]);

  const getConflictTypeConfig = (type: ConflictType) => CONFLICT_TYPES.find((t) => t.value === type) || CONFLICT_TYPES[0];
  const getActivityDetails = (activityId: string) => activities.find((a) => a.id === activityId);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conflict Detection</h1>
          <p className="text-sm text-gray-500">Identify and resolve scheduling overlaps for teachers and rooms</p>
          {lastScanTime && <p className="text-xs text-gray-400 mt-1">Last scan: {formatDateTime(lastScanTime.toISOString())}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setModal('rules')}><Settings className="w-4 h-4 mr-2" />Rules</Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-2" />Filters</Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredConflicts.length === 0}><Download className="w-4 h-4 mr-2" />Export</Button>
          <label className="flex items-center gap-2 px-3 py-1.5 border rounded-md cursor-pointer hover:bg-gray-50 text-sm">
            <input type="checkbox" checked={autoScanEnabled} onChange={(e) => setAutoScanEnabled(e.target.checked)} className="rounded" />
            <span>Auto-scan</span>
          </label>
          <Button onClick={detectConflicts} disabled={isScanning}>
            {isScanning ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Scanning...</> : <><Search className="w-4 h-4 mr-2" />Run Conflict Check</>}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard value={stats.total} label="Total Conflicts" color="text-gray-900" icon={AlertTriangle} />
        <StatCard value={stats.critical} label="Critical" color="text-red-600" icon={XCircle} />
        <StatCard value={stats.warning} label="Warnings" color="text-yellow-600" icon={AlertCircle} />
        <StatCard value={stats.unresolved} label="Unresolved" color="text-red-600" icon={Clock} />
        <StatCard value={stats.resolved} label="Resolved" color="text-green-600" icon={CheckCircle} />
      </div>

      {/* Filters */}
      {showFilters &&
      <Card>
          <div className="p-4 flex flex-wrap gap-4">
            <FormField label="Type">
              <Select value={filterType} onChange={(e) => setFilterType(e.target.value as FilterType)} className="w-48">
                <option value="all">All Types</option>
                {CONFLICT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Severity">
              <Select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value as FilterSeverity)} className="w-36">
                <option value="all">All Severity</option>
                {Object.entries(SEVERITY_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Status">
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)} className="w-36">
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </Select>
            </FormField>
            <div className="flex-1 min-w-48">
              <FormField label="Search">
                <Input placeholder="Search conflicts..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </FormField>
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={() => {setFilterType('all');setFilterSeverity('all');setFilterStatus('all');setSearchQuery('');}}>Clear</Button>
            </div>
          </div>
        </Card>
      }

      {/* Conflicts List */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Detected Conflicts ({filteredConflicts.length})</h3>
          {conflicts.length > 0 &&
          <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Sort by:</span>
              <Select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)} className="w-28 py-1">
                <option value="severity">Severity</option>
                <option value="date">Date</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => setSortOrder((o) => o === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          }
        </div>

        {filteredConflicts.length === 0 ?
        <div className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Conflicts Detected</h3>
            <p className="text-sm text-gray-500">All activities are properly scheduled without overlaps</p>
            {conflicts.length === 0 && !lastScanTime &&
          <Button className="mt-4" onClick={detectConflicts}>Run Initial Scan</Button>
          }
          </div> :

        <div className="p-4 space-y-4">
            {filteredConflicts.map((conflict) => {
            const typeConfig = getConflictTypeConfig(conflict.type);
            const severityConfig = SEVERITY_CONFIG[conflict.severity];
            const statusConfig = STATUS_CONFIG[conflict.status];
            const TypeIcon = typeConfig.icon;

            return (
              <div key={conflict.id} className={`p-4 border rounded-lg ${severityConfig.bgColor}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${conflict.severity === 'critical' ? 'text-red-500' : conflict.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold">{typeConfig.label}</h3>
                          <Badge variant={severityConfig.variant}>{severityConfig.label}</Badge>
                          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                          {conflict.autoResolvable && <Badge variant="default"><Zap className="w-3 h-3 mr-1" />Auto-resolvable</Badge>}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm font-medium mb-2">{conflict.description}</p>

                      {/* Details */}
                      <div className="text-xs space-y-1 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(conflict.date)}</span>
                          {conflict.periodId &&
                        <>
                              <Clock className="w-3 h-3 ml-2" />
                              <span>{getPeriodLabel(conflict.periodId)}</span>
                            </>
                        }
                        </div>
                        {conflict.affectedTeachers.length > 0 &&
                      <div className="flex items-center gap-2">
                            <Users className="w-3 h-3" />
                            <span>Teachers: {conflict.affectedTeachers.map(getTeacherName).join(', ')}</span>
                          </div>
                      }
                        {conflict.affectedRooms.length > 0 &&
                      <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>Rooms: {conflict.affectedRooms.map(getRoomName).join(', ')}</span>
                          </div>
                      }
                        {conflict.affectedClasses.length > 0 &&
                      <div className="flex items-center gap-2">
                            <GraduationCap className="w-3 h-3" />
                            <span>Classes: {conflict.affectedClasses.map(getClassName).join(', ')}</span>
                          </div>
                      }
                      </div>

                      {/* Conflicting Activities */}
                      {conflict.conflictingActivities.length > 0 &&
                    <div className="flex flex-wrap gap-2 mb-3">
                          {conflict.conflictingActivities.map((actId) => {
                        const activity = getActivityDetails(actId);
                        return activity ?
                        <div key={actId} className="bg-white/80 px-3 py-1.5 rounded border text-xs font-medium">
                                <span className="text-gray-500 capitalize">{activity.type}:</span> {activity.title || activity.subject}
                                {activity.classId && <span className="text-gray-400 ml-1">({getClassName(activity.classId)})</span>}
                              </div> :
                        null;
                      })}
                        </div>
                    }

                      {/* Acknowledgment info */}
                      {conflict.acknowledgedBy &&
                    <p className="text-xs text-gray-500 mb-2">
                          Acknowledged by {conflict.acknowledgedBy} on {formatDateTime(conflict.acknowledgedAt!)}
                        </p>
                    }

                      {/* Resolution info */}
                      {conflict.resolutionAction &&
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-2 mb-2">
                          <p className="text-xs font-medium text-green-800">
                            Resolution: {RESOLUTION_ACTIONS.find((a) => a.value === conflict.resolutionAction)?.label}
                          </p>
                          {conflict.resolutionNotes && <p className="text-xs text-green-700 mt-1">{conflict.resolutionNotes}</p>}
                          <p className="text-xs text-green-600 mt-1">
                            Resolved by {conflict.resolvedBy} on {formatDateTime(conflict.resolvedAt!)}
                          </p>
                        </div>
                    }

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {conflict.status === 'unresolved' &&
                      <>
                            <Button variant="outline" size="sm" onClick={() => handleAcknowledge(conflict.id)}>
                              <Check className="w-4 h-4 mr-1" />Acknowledge
                            </Button>
                            <Button size="sm" onClick={() => {setSelectedConflict(conflict);setModal('resolve');}}>
                              <CheckCircle className="w-4 h-4 mr-1" />Resolve
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleIgnore(conflict.id)}>Ignore</Button>
                          </>
                      }
                        {conflict.status === 'acknowledged' &&
                      <Button size="sm" onClick={() => {setSelectedConflict(conflict);setModal('resolve');}}>
                            <CheckCircle className="w-4 h-4 mr-1" />Resolve
                          </Button>
                      }
                        <Button variant="ghost" size="sm" onClick={() => {setSelectedConflict(conflict);setModal('detail');}}>
                          <Eye className="w-4 h-4 mr-1" />Details
                        </Button>
                        {conflict.status !== 'unresolved' &&
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(conflict.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-1" />Delete
                          </Button>
                      }
                      </div>
                    </div>
                  </div>
                </div>);

          })}
          </div>
        }
      </Card>

      {/* Detail Modal */}
      <Modal isOpen={modal === 'detail' && !!selectedConflict} onClose={() => {setModal('none');setSelectedConflict(null);}} title="Conflict Details" size="lg">
        {selectedConflict && (() => {
          const typeConfig = getConflictTypeConfig(selectedConflict.type);
          return (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={SEVERITY_CONFIG[selectedConflict.severity].variant}>{SEVERITY_CONFIG[selectedConflict.severity].label}</Badge>
                <Badge variant={STATUS_CONFIG[selectedConflict.status].variant}>{STATUS_CONFIG[selectedConflict.status].label}</Badge>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Type</p>
                <p className="font-medium">{typeConfig.label}</p>
                <p className="text-sm text-gray-600 mt-1">{typeConfig.description}</p>
              </div>

              <div>
                <p className="text-gray-500 text-xs">Description</p>
                <p className="font-medium">{selectedConflict.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="font-medium">{formatDate(selectedConflict.date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Period</p>
                  <p className="font-medium">{selectedConflict.periodId ? getPeriodLabel(selectedConflict.periodId) : 'N/A'}</p>
                </div>
              </div>

              {selectedConflict.conflictingActivities.length > 0 &&
              <div>
                  <p className="text-gray-500 text-xs mb-2">Conflicting Activities</p>
                  {selectedConflict.conflictingActivities.map((actId) => {
                  const activity = getActivityDetails(actId);
                  return activity ?
                  <div key={actId} className="bg-gray-50 p-3 rounded mb-2">
                        <p className="font-medium">{activity.title || activity.subject}</p>
                        <p className="text-xs text-gray-500">
                          Type: {activity.type} • Teachers: {activity.teacherIds.map(getTeacherName).join(', ')}
                        </p>
                        {activity.roomId && <p className="text-xs text-gray-500">Room: {getRoomName(activity.roomId)}</p>}
                        {activity.classId && <p className="text-xs text-gray-500">Class: {getClassName(activity.classId)}</p>}
                      </div> :
                  null;
                })}
                </div>
              }

              {selectedConflict.suggestedActions.length > 0 &&
              <div>
                  <p className="text-gray-500 text-xs mb-2">Suggested Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConflict.suggestedActions.map((action) =>
                  <Badge key={action} variant="default">{RESOLUTION_ACTIONS.find((a) => a.value === action)?.label}</Badge>
                  )}
                  </div>
                </div>
              }

              <div className="text-xs text-gray-400 pt-2 border-t">
                Detected: {formatDateTime(selectedConflict.detectedAt)}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => {setModal('none');setSelectedConflict(null);}}>Close</Button>
              </div>
            </div>);

        })()}
      </Modal>

      {/* Resolve Modal */}
      <Modal isOpen={modal === 'resolve' && !!selectedConflict} onClose={() => {setModal('none');setSelectedConflict(null);setSelectedAction('');setResolutionNotes('');}} title="Resolve Conflict" size="md">
        {selectedConflict &&
        <div className="space-y-4">
            <Alert type="info">Select a resolution action and provide notes to resolve this conflict.</Alert>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">{selectedConflict.description}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(selectedConflict.date)} {selectedConflict.periodId && `• ${getPeriodLabel(selectedConflict.periodId)}`}</p>
            </div>

            <FormField label="Resolution Action" required>
              <Select value={selectedAction} onChange={(e) => setSelectedAction(e.target.value as ResolutionAction)}>
                <option value="">-- Select Action --</option>
                {selectedConflict.suggestedActions.map((action) =>
              <option key={action} value={action}>{RESOLUTION_ACTIONS.find((a) => a.value === action)?.label}</option>
              )}
              </Select>
            </FormField>

            {selectedAction &&
          <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                {RESOLUTION_ACTIONS.find((a) => a.value === selectedAction)?.description}
              </p>
          }

            <FormField label="Resolution Notes">
              <Textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} placeholder="Describe how the conflict was resolved..." rows={3} />
            </FormField>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {setModal('none');setSelectedConflict(null);setSelectedAction('');setResolutionNotes('');}}>Cancel</Button>
              <Button onClick={handleResolve} disabled={!selectedAction}><CheckCircle className="w-4 h-4 mr-2" />Mark as Resolved</Button>
            </div>
          </div>
        }
      </Modal>

      {/* Rules Modal */}
      <Modal isOpen={modal === 'rules'} onClose={() => setModal('none')} title="Conflict Detection Rules" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Configure which conflict types to detect and their severity levels.</p>

          {conflictRules.map((rule) => {
            const typeConfig = CONFLICT_TYPES.find((t) => t.value === rule.type);
            return (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={rule.enabled} onChange={() => handleToggleRule(rule.id)} className="rounded" />
                        <span className="font-medium">{rule.name}</span>
                      </label>
                      <Badge variant={SEVERITY_CONFIG[rule.severity].variant}>{SEVERITY_CONFIG[rule.severity].label}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-xs mt-2">
                  <label className="flex items-center gap-1 text-gray-500">
                    <input type="checkbox" checked={rule.autoResolve} disabled className="rounded opacity-50" />
                    Auto-resolve
                  </label>
                  <label className="flex items-center gap-1 text-gray-500">
                    <input type="checkbox" checked={rule.notifyOnDetect} disabled className="rounded opacity-50" />
                    Notify on detect
                  </label>
                </div>
              </div>);

          })}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setModal('none')}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>);

}