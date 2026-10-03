// TimetableFrameworkShiftSetup.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Textarea } from '../../../components/ui/Textarea';
import {
  Plus,
  Edit2,
  Clock,
  Trash2,
  Save,
  X,
  Search,
  Copy,
  Download,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  Eye,
  Calendar,
  Coffee,
  BookOpen,
  Users,
  Layers,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Grid3X3,
  List,
  RefreshCw,
  FileText,
  Zap,
  Sun,
  Moon,
  Sunrise } from
'lucide-react';

// Type definitions
interface Period {
  id: number;
  periodNumber: number;
  name: string;
  type: PeriodType;
  startTime: string;
  endTime: string;
  duration: number;
  isBreak: boolean;
  order: number;
}

type PeriodType = 'Regular' | 'Assembly' | 'Recess' | 'Lunch' | 'Short Break' | 'PT/Sports' | 'Lab' | 'Library' | 'Activity' | 'Zero Period' | 'Remedial';

interface Shift {
  id: number;
  name: string;
  code: string;
  description: string;
  startTime: string;
  endTime: string;
  totalPeriods: number;
  periodDuration: number;
  breakDuration: number;
  lunchDuration: number;
  periods: Period[];
  workingDays: string[];
  applicableClasses: string[];
  status: 'Active' | 'Inactive';
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface TimetableTemplate {
  id: number;
  name: string;
  shiftId: number;
  shiftName: string;
  description: string;
  assignedTo: string[];
  schedule: DaySchedule[];
  status: 'Active' | 'Inactive' | 'Draft';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DaySchedule {
  day: string;
  periods: ScheduledPeriod[];
}

interface ScheduledPeriod {
  periodId: number;
  periodNumber: number;
  subject?: string;
  teacher?: string;
  room?: string;
}

interface WorkingDay {
  day: string;
  shortName: string;
  isWorking: boolean;
  order: number;
}

const PERIOD_TYPES: PeriodType[] = [
'Regular', 'Assembly', 'Recess', 'Lunch', 'Short Break',
'PT/Sports', 'Lab', 'Library', 'Activity', 'Zero Period', 'Remedial'];


const WORKING_DAYS: WorkingDay[] = [
{ day: 'Monday', shortName: 'Mon', isWorking: true, order: 1 },
{ day: 'Tuesday', shortName: 'Tue', isWorking: true, order: 2 },
{ day: 'Wednesday', shortName: 'Wed', isWorking: true, order: 3 },
{ day: 'Thursday', shortName: 'Thu', isWorking: true, order: 4 },
{ day: 'Friday', shortName: 'Fri', isWorking: true, order: 5 },
{ day: 'Saturday', shortName: 'Sat', isWorking: true, order: 6 },
{ day: 'Sunday', shortName: 'Sun', isWorking: false, order: 7 }];


const CLASS_OPTIONS = [
'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
'Class 11 - Science', 'Class 11 - Commerce', 'Class 11 - Arts',
'Class 12 - Science', 'Class 12 - Commerce', 'Class 12 - Arts'];


export function TimetableFrameworkShiftSetup() {
  // Initial mock data for shifts
  const initialShifts: Shift[] = [
  {
    id: 1,
    name: 'Morning Shift',
    code: 'MS',
    description: 'Early morning shift for junior classes',
    startTime: '07:30',
    endTime: '12:30',
    totalPeriods: 6,
    periodDuration: 40,
    breakDuration: 15,
    lunchDuration: 0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableClasses: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    status: 'Active',
    effectiveFrom: new Date('2024-04-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    periods: [
    { id: 1, periodNumber: 0, name: 'Assembly', type: 'Assembly', startTime: '07:30', endTime: '07:50', duration: 20, isBreak: false, order: 1 },
    { id: 2, periodNumber: 1, name: 'Period 1', type: 'Regular', startTime: '07:50', endTime: '08:30', duration: 40, isBreak: false, order: 2 },
    { id: 3, periodNumber: 2, name: 'Period 2', type: 'Regular', startTime: '08:30', endTime: '09:10', duration: 40, isBreak: false, order: 3 },
    { id: 4, periodNumber: 0, name: 'Short Break', type: 'Short Break', startTime: '09:10', endTime: '09:20', duration: 10, isBreak: true, order: 4 },
    { id: 5, periodNumber: 3, name: 'Period 3', type: 'Regular', startTime: '09:20', endTime: '10:00', duration: 40, isBreak: false, order: 5 },
    { id: 6, periodNumber: 4, name: 'Period 4', type: 'Regular', startTime: '10:00', endTime: '10:40', duration: 40, isBreak: false, order: 6 },
    { id: 7, periodNumber: 0, name: 'Recess', type: 'Recess', startTime: '10:40', endTime: '10:55', duration: 15, isBreak: true, order: 7 },
    { id: 8, periodNumber: 5, name: 'Period 5', type: 'Regular', startTime: '10:55', endTime: '11:35', duration: 40, isBreak: false, order: 8 },
    { id: 9, periodNumber: 6, name: 'Period 6', type: 'Regular', startTime: '11:35', endTime: '12:15', duration: 40, isBreak: false, order: 9 },
    { id: 10, periodNumber: 0, name: 'Dispersal', type: 'Activity', startTime: '12:15', endTime: '12:30', duration: 15, isBreak: false, order: 10 }]

  },
  {
    id: 2,
    name: 'Day Shift',
    code: 'DS',
    description: 'Full day shift for middle and senior classes',
    startTime: '08:00',
    endTime: '14:30',
    totalPeriods: 8,
    periodDuration: 40,
    breakDuration: 15,
    lunchDuration: 30,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    status: 'Active',
    effectiveFrom: new Date('2024-04-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    periods: [
    { id: 11, periodNumber: 0, name: 'Assembly', type: 'Assembly', startTime: '08:00', endTime: '08:20', duration: 20, isBreak: false, order: 1 },
    { id: 12, periodNumber: 1, name: 'Period 1', type: 'Regular', startTime: '08:20', endTime: '09:00', duration: 40, isBreak: false, order: 2 },
    { id: 13, periodNumber: 2, name: 'Period 2', type: 'Regular', startTime: '09:00', endTime: '09:40', duration: 40, isBreak: false, order: 3 },
    { id: 14, periodNumber: 3, name: 'Period 3', type: 'Regular', startTime: '09:40', endTime: '10:20', duration: 40, isBreak: false, order: 4 },
    { id: 15, periodNumber: 0, name: 'Short Break', type: 'Short Break', startTime: '10:20', endTime: '10:35', duration: 15, isBreak: true, order: 5 },
    { id: 16, periodNumber: 4, name: 'Period 4', type: 'Regular', startTime: '10:35', endTime: '11:15', duration: 40, isBreak: false, order: 6 },
    { id: 17, periodNumber: 5, name: 'Period 5', type: 'Regular', startTime: '11:15', endTime: '11:55', duration: 40, isBreak: false, order: 7 },
    { id: 18, periodNumber: 0, name: 'Lunch Break', type: 'Lunch', startTime: '11:55', endTime: '12:25', duration: 30, isBreak: true, order: 8 },
    { id: 19, periodNumber: 6, name: 'Period 6', type: 'Regular', startTime: '12:25', endTime: '13:05', duration: 40, isBreak: false, order: 9 },
    { id: 20, periodNumber: 7, name: 'Period 7', type: 'Regular', startTime: '13:05', endTime: '13:45', duration: 40, isBreak: false, order: 10 },
    { id: 21, periodNumber: 8, name: 'Period 8', type: 'Regular', startTime: '13:45', endTime: '14:25', duration: 40, isBreak: false, order: 11 },
    { id: 22, periodNumber: 0, name: 'Dispersal', type: 'Activity', startTime: '14:25', endTime: '14:30', duration: 5, isBreak: false, order: 12 }]

  },
  {
    id: 3,
    name: 'Afternoon Shift',
    code: 'AS',
    description: 'Afternoon shift for additional batches',
    startTime: '12:30',
    endTime: '17:30',
    totalPeriods: 6,
    periodDuration: 40,
    breakDuration: 15,
    lunchDuration: 0,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    applicableClasses: [],
    status: 'Inactive',
    effectiveFrom: new Date('2024-04-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    periods: [
    { id: 23, periodNumber: 1, name: 'Period 1', type: 'Regular', startTime: '12:30', endTime: '13:10', duration: 40, isBreak: false, order: 1 },
    { id: 24, periodNumber: 2, name: 'Period 2', type: 'Regular', startTime: '13:10', endTime: '13:50', duration: 40, isBreak: false, order: 2 },
    { id: 25, periodNumber: 3, name: 'Period 3', type: 'Regular', startTime: '13:50', endTime: '14:30', duration: 40, isBreak: false, order: 3 },
    { id: 26, periodNumber: 0, name: 'Break', type: 'Recess', startTime: '14:30', endTime: '14:45', duration: 15, isBreak: true, order: 4 },
    { id: 27, periodNumber: 4, name: 'Period 4', type: 'Regular', startTime: '14:45', endTime: '15:25', duration: 40, isBreak: false, order: 5 },
    { id: 28, periodNumber: 5, name: 'Period 5', type: 'Regular', startTime: '15:25', endTime: '16:05', duration: 40, isBreak: false, order: 6 },
    { id: 29, periodNumber: 6, name: 'Period 6', type: 'Regular', startTime: '16:05', endTime: '16:45', duration: 40, isBreak: false, order: 7 },
    { id: 30, periodNumber: 0, name: 'Activity Period', type: 'Activity', startTime: '16:45', endTime: '17:30', duration: 45, isBreak: false, order: 8 }]

  },
  {
    id: 4,
    name: 'Senior Secondary Shift',
    code: 'SSS',
    description: 'Extended shift for Class 11 and 12 with lab sessions',
    startTime: '07:45',
    endTime: '14:00',
    totalPeriods: 8,
    periodDuration: 45,
    breakDuration: 20,
    lunchDuration: 30,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    applicableClasses: ['Class 11 - Science', 'Class 11 - Commerce', 'Class 11 - Arts', 'Class 12 - Science', 'Class 12 - Commerce', 'Class 12 - Arts'],
    status: 'Active',
    effectiveFrom: new Date('2024-04-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    periods: [
    { id: 31, periodNumber: 0, name: 'Zero Period', type: 'Zero Period', startTime: '07:45', endTime: '08:15', duration: 30, isBreak: false, order: 1 },
    { id: 32, periodNumber: 1, name: 'Period 1', type: 'Regular', startTime: '08:15', endTime: '09:00', duration: 45, isBreak: false, order: 2 },
    { id: 33, periodNumber: 2, name: 'Period 2', type: 'Regular', startTime: '09:00', endTime: '09:45', duration: 45, isBreak: false, order: 3 },
    { id: 34, periodNumber: 3, name: 'Period 3', type: 'Regular', startTime: '09:45', endTime: '10:30', duration: 45, isBreak: false, order: 4 },
    { id: 35, periodNumber: 0, name: 'Short Break', type: 'Short Break', startTime: '10:30', endTime: '10:50', duration: 20, isBreak: true, order: 5 },
    { id: 36, periodNumber: 4, name: 'Period 4', type: 'Regular', startTime: '10:50', endTime: '11:35', duration: 45, isBreak: false, order: 6 },
    { id: 37, periodNumber: 5, name: 'Period 5', type: 'Regular', startTime: '11:35', endTime: '12:20', duration: 45, isBreak: false, order: 7 },
    { id: 38, periodNumber: 0, name: 'Lunch', type: 'Lunch', startTime: '12:20', endTime: '12:50', duration: 30, isBreak: true, order: 8 },
    { id: 39, periodNumber: 6, name: 'Period 6', type: 'Lab', startTime: '12:50', endTime: '13:35', duration: 45, isBreak: false, order: 9 },
    { id: 40, periodNumber: 7, name: 'Period 7', type: 'Lab', startTime: '13:35', endTime: '14:20', duration: 45, isBreak: false, order: 10 },
    { id: 41, periodNumber: 8, name: 'Remedial/Activity', type: 'Remedial', startTime: '14:20', endTime: '15:00', duration: 40, isBreak: false, order: 11 }]

  },
  {
    id: 5,
    name: 'Saturday Special',
    code: 'SAT',
    description: 'Half-day Saturday schedule with activities',
    startTime: '08:00',
    endTime: '12:00',
    totalPeriods: 4,
    periodDuration: 45,
    breakDuration: 15,
    lunchDuration: 0,
    workingDays: ['Saturday'],
    applicableClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    status: 'Active',
    effectiveFrom: new Date('2024-04-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    periods: [
    { id: 42, periodNumber: 0, name: 'Assembly', type: 'Assembly', startTime: '08:00', endTime: '08:30', duration: 30, isBreak: false, order: 1 },
    { id: 43, periodNumber: 1, name: 'Period 1', type: 'Regular', startTime: '08:30', endTime: '09:15', duration: 45, isBreak: false, order: 2 },
    { id: 44, periodNumber: 2, name: 'Period 2', type: 'Regular', startTime: '09:15', endTime: '10:00', duration: 45, isBreak: false, order: 3 },
    { id: 45, periodNumber: 0, name: 'Break', type: 'Recess', startTime: '10:00', endTime: '10:15', duration: 15, isBreak: true, order: 4 },
    { id: 46, periodNumber: 3, name: 'Period 3 (Activity)', type: 'Activity', startTime: '10:15', endTime: '11:00', duration: 45, isBreak: false, order: 5 },
    { id: 47, periodNumber: 4, name: 'Period 4 (Sports/PT)', type: 'PT/Sports', startTime: '11:00', endTime: '11:45', duration: 45, isBreak: false, order: 6 },
    { id: 48, periodNumber: 0, name: 'Dispersal', type: 'Activity', startTime: '11:45', endTime: '12:00', duration: 15, isBreak: false, order: 7 }]

  }];


  const initialTemplates: TimetableTemplate[] = [
  {
    id: 1,
    name: 'Primary Classes Timetable',
    shiftId: 1,
    shiftName: 'Morning Shift',
    description: 'Standard timetable for Class 1-5',
    assignedTo: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    status: 'Active',
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    schedule: []
  },
  {
    id: 2,
    name: 'Middle School Timetable',
    shiftId: 2,
    shiftName: 'Day Shift',
    description: 'Standard timetable for Class 6-10',
    assignedTo: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'],
    status: 'Active',
    version: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-10'),
    schedule: []
  },
  {
    id: 3,
    name: 'Senior Secondary Timetable',
    shiftId: 4,
    shiftName: 'Senior Secondary Shift',
    description: 'Timetable for Class 11-12 with lab sessions',
    assignedTo: ['Class 11 - Science', 'Class 11 - Commerce', 'Class 12 - Science', 'Class 12 - Commerce'],
    status: 'Active',
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    schedule: []
  }];


  // State management
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [templates, setTemplates] = useState<TimetableTemplate[]>(initialTemplates);
  const [activeTab, setActiveTab] = useState<'shifts' | 'periods' | 'templates'>('shifts');
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showPeriodConfigModal, setShowPeriodConfigModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showQuickSetupModal, setShowQuickSetupModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingPeriodId, setEditingPeriodId] = useState<number | null>(null);

  // Form data
  const [shiftFormData, setShiftFormData] = useState({
    name: '',
    code: '',
    description: '',
    startTime: '08:00',
    endTime: '14:00',
    totalPeriods: 8,
    periodDuration: 40,
    breakDuration: 15,
    lunchDuration: 30,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as string[],
    applicableClasses: [] as string[],
    status: 'Active' as 'Active' | 'Inactive',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  const [periodFormData, setPeriodFormData] = useState({
    shiftId: 0,
    periodNumber: 1,
    name: '',
    type: 'Regular' as PeriodType,
    startTime: '08:00',
    endTime: '08:40',
    duration: 40,
    isBreak: false
  });

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    shiftId: 0,
    description: '',
    assignedTo: [] as string[],
    status: 'Draft' as 'Active' | 'Inactive' | 'Draft'
  });

  const [quickSetupData, setQuickSetupData] = useState({
    shiftId: 0,
    startTime: '08:00',
    regularPeriods: 8,
    periodDuration: 40,
    includeAssembly: true,
    assemblyDuration: 20,
    includeShortBreak: true,
    shortBreakAfterPeriod: 3,
    shortBreakDuration: 15,
    includeLunch: true,
    lunchAfterPeriod: 5,
    lunchDuration: 30,
    includeDispersal: true,
    dispersalDuration: 5
  });

  // Toast notification
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'info' });

  // Confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'deleteShift' | 'deletePeriod' | 'deleteTemplate' | 'duplicateShift' | null;
    targetId: number | null;
    secondaryId?: number | null;
    message: string;
  }>({ isOpen: false, type: null, targetId: null, message: '' });

  // Show toast
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  // Filter shifts
  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch = shift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shift.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || shift.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalShifts: shifts.length,
    activeShifts: shifts.filter((s) => s.status === 'Active').length,
    totalPeriods: shifts.reduce((acc, s) => acc + s.periods.filter((p) => !p.isBreak).length, 0),
    totalTemplates: templates.length,
    activeTemplates: templates.filter((t) => t.status === 'Active').length
  };

  // Helper functions
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    return endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
  };

  // Reset form data
  const resetShiftForm = () => {
    setShiftFormData({
      name: '',
      code: '',
      description: '',
      startTime: '08:00',
      endTime: '14:00',
      totalPeriods: 8,
      periodDuration: 40,
      breakDuration: 15,
      lunchDuration: 30,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      applicableClasses: [],
      status: 'Active',
      effectiveFrom: new Date().toISOString().split('T')[0]
    });
  };

  const resetPeriodForm = () => {
    setPeriodFormData({
      shiftId: selectedShift?.id || 0,
      periodNumber: 1,
      name: '',
      type: 'Regular',
      startTime: '08:00',
      endTime: '08:40',
      duration: 40,
      isBreak: false
    });
  };

  const resetTemplateForm = () => {
    setTemplateFormData({
      name: '',
      shiftId: shifts[0]?.id || 0,
      description: '',
      assignedTo: [],
      status: 'Draft'
    });
  };

  // CRUD Operations for Shift
  const handleCreateShift = () => {
    if (!shiftFormData.name.trim() || !shiftFormData.code.trim()) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newShift: Shift = {
      id: Date.now(),
      name: shiftFormData.name,
      code: shiftFormData.code,
      description: shiftFormData.description,
      startTime: shiftFormData.startTime,
      endTime: shiftFormData.endTime,
      totalPeriods: shiftFormData.totalPeriods,
      periodDuration: shiftFormData.periodDuration,
      breakDuration: shiftFormData.breakDuration,
      lunchDuration: shiftFormData.lunchDuration,
      workingDays: shiftFormData.workingDays,
      applicableClasses: shiftFormData.applicableClasses,
      status: shiftFormData.status,
      effectiveFrom: new Date(shiftFormData.effectiveFrom),
      periods: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setShifts((prev) => [...prev, newShift]);
    setShowShiftModal(false);
    resetShiftForm();
    showToast('Shift created successfully', 'success');
  };

  const handleUpdateShift = () => {
    if (!editingId) return;

    if (!shiftFormData.name.trim()) {
      showToast('Please enter a shift name', 'error');
      return;
    }

    setShifts((prev) => prev.map((shift) => {
      if (shift.id === editingId) {
        return {
          ...shift,
          name: shiftFormData.name,
          code: shiftFormData.code,
          description: shiftFormData.description,
          startTime: shiftFormData.startTime,
          endTime: shiftFormData.endTime,
          totalPeriods: shiftFormData.totalPeriods,
          periodDuration: shiftFormData.periodDuration,
          breakDuration: shiftFormData.breakDuration,
          lunchDuration: shiftFormData.lunchDuration,
          workingDays: shiftFormData.workingDays,
          applicableClasses: shiftFormData.applicableClasses,
          status: shiftFormData.status,
          effectiveFrom: new Date(shiftFormData.effectiveFrom),
          updatedAt: new Date()
        };
      }
      return shift;
    }));

    setShowShiftModal(false);
    setIsEditing(false);
    setEditingId(null);
    resetShiftForm();
    showToast('Shift updated successfully', 'success');
  };

  const handleDeleteShift = (shiftId: number) => {
    setShifts((prev) => prev.filter((s) => s.id !== shiftId));
    setTemplates((prev) => prev.filter((t) => t.shiftId !== shiftId));
    if (selectedShift?.id === shiftId) {
      setSelectedShift(null);
    }
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Shift deleted successfully', 'success');
  };

  const handleDuplicateShift = (shiftId: number) => {
    const originalShift = shifts.find((s) => s.id === shiftId);
    if (!originalShift) return;

    const duplicatedShift: Shift = {
      ...originalShift,
      id: Date.now(),
      name: `${originalShift.name} (Copy)`,
      code: `${originalShift.code}_COPY`,
      status: 'Inactive',
      periods: originalShift.periods.map((p) => ({ ...p, id: Date.now() + Math.random() * 1000 })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setShifts((prev) => [...prev, duplicatedShift]);
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Shift duplicated successfully', 'success');
  };

  // Edit shift
  const handleEditShift = (shift: Shift) => {
    setShiftFormData({
      name: shift.name,
      code: shift.code,
      description: shift.description,
      startTime: shift.startTime,
      endTime: shift.endTime,
      totalPeriods: shift.totalPeriods,
      periodDuration: shift.periodDuration,
      breakDuration: shift.breakDuration,
      lunchDuration: shift.lunchDuration,
      workingDays: shift.workingDays,
      applicableClasses: shift.applicableClasses,
      status: shift.status,
      effectiveFrom: shift.effectiveFrom.toISOString().split('T')[0]
    });
    setEditingId(shift.id);
    setIsEditing(true);
    setShowShiftModal(true);
  };

  // CRUD Operations for Period
  const handleCreatePeriod = () => {
    if (!periodFormData.name.trim() || !selectedShift) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newPeriod: Period = {
      id: Date.now(),
      periodNumber: periodFormData.isBreak ? 0 : periodFormData.periodNumber,
      name: periodFormData.name,
      type: periodFormData.type,
      startTime: periodFormData.startTime,
      endTime: periodFormData.endTime,
      duration: periodFormData.duration,
      isBreak: periodFormData.isBreak,
      order: selectedShift.periods.length + 1
    };

    setShifts((prev) => prev.map((shift) => {
      if (shift.id === selectedShift.id) {
        return {
          ...shift,
          periods: [...shift.periods, newPeriod],
          updatedAt: new Date()
        };
      }
      return shift;
    }));

    setSelectedShift((prev) => prev ? {
      ...prev,
      periods: [...prev.periods, newPeriod],
      updatedAt: new Date()
    } : null);

    setShowPeriodModal(false);
    resetPeriodForm();
    showToast('Period added successfully', 'success');
  };

  const handleUpdatePeriod = () => {
    if (!editingPeriodId || !selectedShift) return;

    setShifts((prev) => prev.map((shift) => {
      if (shift.id === selectedShift.id) {
        return {
          ...shift,
          periods: shift.periods.map((period) => {
            if (period.id === editingPeriodId) {
              return {
                ...period,
                periodNumber: periodFormData.isBreak ? 0 : periodFormData.periodNumber,
                name: periodFormData.name,
                type: periodFormData.type,
                startTime: periodFormData.startTime,
                endTime: periodFormData.endTime,
                duration: periodFormData.duration,
                isBreak: periodFormData.isBreak
              };
            }
            return period;
          }),
          updatedAt: new Date()
        };
      }
      return shift;
    }));

    setSelectedShift((prev) => prev ? {
      ...prev,
      periods: prev.periods.map((period) => {
        if (period.id === editingPeriodId) {
          return {
            ...period,
            periodNumber: periodFormData.isBreak ? 0 : periodFormData.periodNumber,
            name: periodFormData.name,
            type: periodFormData.type,
            startTime: periodFormData.startTime,
            endTime: periodFormData.endTime,
            duration: periodFormData.duration,
            isBreak: periodFormData.isBreak
          };
        }
        return period;
      }),
      updatedAt: new Date()
    } : null);

    setShowPeriodModal(false);
    setIsEditing(false);
    setEditingPeriodId(null);
    resetPeriodForm();
    showToast('Period updated successfully', 'success');
  };

  const handleDeletePeriod = (shiftId: number, periodId: number) => {
    setShifts((prev) => prev.map((shift) => {
      if (shift.id === shiftId) {
        return {
          ...shift,
          periods: shift.periods.filter((p) => p.id !== periodId),
          updatedAt: new Date()
        };
      }
      return shift;
    }));

    if (selectedShift?.id === shiftId) {
      setSelectedShift((prev) => prev ? {
        ...prev,
        periods: prev.periods.filter((p) => p.id !== periodId),
        updatedAt: new Date()
      } : null);
    }

    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Period deleted successfully', 'success');
  };

  // Edit period
  const handleEditPeriod = (period: Period) => {
    setPeriodFormData({
      shiftId: selectedShift?.id || 0,
      periodNumber: period.periodNumber,
      name: period.name,
      type: period.type,
      startTime: period.startTime,
      endTime: period.endTime,
      duration: period.duration,
      isBreak: period.isBreak
    });
    setEditingPeriodId(period.id);
    setIsEditing(true);
    setShowPeriodModal(true);
  };

  // Move period
  const handleMovePeriod = (periodId: number, direction: 'up' | 'down') => {
    if (!selectedShift) return;

    const periods = [...selectedShift.periods];
    const index = periods.findIndex((p) => p.id === periodId);

    if (direction === 'up' && index > 0) {
      [periods[index], periods[index - 1]] = [periods[index - 1], periods[index]];
    } else if (direction === 'down' && index < periods.length - 1) {
      [periods[index], periods[index + 1]] = [periods[index + 1], periods[index]];
    }

    // Update order
    periods.forEach((p, i) => {p.order = i + 1;});

    setShifts((prev) => prev.map((shift) => {
      if (shift.id === selectedShift.id) {
        return { ...shift, periods, updatedAt: new Date() };
      }
      return shift;
    }));

    setSelectedShift((prev) => prev ? { ...prev, periods } : null);
  };

  // Quick setup periods
  const handleQuickSetup = () => {
    if (!quickSetupData.shiftId) {
      showToast('Please select a shift', 'error');
      return;
    }

    const periods: Period[] = [];
    let currentTime = quickSetupData.startTime;
    let periodCount = 0;
    let order = 1;

    // Add Assembly
    if (quickSetupData.includeAssembly) {
      const endTime = calculateEndTime(currentTime, quickSetupData.assemblyDuration);
      periods.push({
        id: Date.now() + order,
        periodNumber: 0,
        name: 'Assembly',
        type: 'Assembly',
        startTime: currentTime,
        endTime: endTime,
        duration: quickSetupData.assemblyDuration,
        isBreak: false,
        order: order++
      });
      currentTime = endTime;
    }

    // Add periods with breaks
    for (let i = 1; i <= quickSetupData.regularPeriods; i++) {
      // Add regular period
      const endTime = calculateEndTime(currentTime, quickSetupData.periodDuration);
      periods.push({
        id: Date.now() + order,
        periodNumber: i,
        name: `Period ${i}`,
        type: 'Regular',
        startTime: currentTime,
        endTime: endTime,
        duration: quickSetupData.periodDuration,
        isBreak: false,
        order: order++
      });
      currentTime = endTime;
      periodCount++;

      // Add short break
      if (quickSetupData.includeShortBreak && periodCount === quickSetupData.shortBreakAfterPeriod) {
        const breakEnd = calculateEndTime(currentTime, quickSetupData.shortBreakDuration);
        periods.push({
          id: Date.now() + order,
          periodNumber: 0,
          name: 'Short Break',
          type: 'Short Break',
          startTime: currentTime,
          endTime: breakEnd,
          duration: quickSetupData.shortBreakDuration,
          isBreak: true,
          order: order++
        });
        currentTime = breakEnd;
      }

      // Add lunch
      if (quickSetupData.includeLunch && periodCount === quickSetupData.lunchAfterPeriod) {
        const lunchEnd = calculateEndTime(currentTime, quickSetupData.lunchDuration);
        periods.push({
          id: Date.now() + order,
          periodNumber: 0,
          name: 'Lunch Break',
          type: 'Lunch',
          startTime: currentTime,
          endTime: lunchEnd,
          duration: quickSetupData.lunchDuration,
          isBreak: true,
          order: order++
        });
        currentTime = lunchEnd;
      }
    }

    // Add Dispersal
    if (quickSetupData.includeDispersal) {
      const endTime = calculateEndTime(currentTime, quickSetupData.dispersalDuration);
      periods.push({
        id: Date.now() + order,
        periodNumber: 0,
        name: 'Dispersal',
        type: 'Activity',
        startTime: currentTime,
        endTime: endTime,
        duration: quickSetupData.dispersalDuration,
        isBreak: false,
        order: order++
      });
    }

    // Update shift
    setShifts((prev) => prev.map((shift) => {
      if (shift.id === quickSetupData.shiftId) {
        return {
          ...shift,
          periods: periods,
          startTime: quickSetupData.startTime,
          endTime: periods[periods.length - 1]?.endTime || shift.endTime,
          totalPeriods: quickSetupData.regularPeriods,
          updatedAt: new Date()
        };
      }
      return shift;
    }));

    if (selectedShift?.id === quickSetupData.shiftId) {
      setSelectedShift((prev) => prev ? {
        ...prev,
        periods: periods,
        startTime: quickSetupData.startTime,
        endTime: periods[periods.length - 1]?.endTime || prev.endTime,
        totalPeriods: quickSetupData.regularPeriods,
        updatedAt: new Date()
      } : null);
    }

    setShowQuickSetupModal(false);
    showToast('Periods configured successfully', 'success');
  };

  // Template operations
  const handleCreateTemplate = () => {
    if (!templateFormData.name.trim() || !templateFormData.shiftId) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const shift = shifts.find((s) => s.id === templateFormData.shiftId);

    const newTemplate: TimetableTemplate = {
      id: Date.now(),
      name: templateFormData.name,
      shiftId: templateFormData.shiftId,
      shiftName: shift?.name || '',
      description: templateFormData.description,
      assignedTo: templateFormData.assignedTo,
      status: templateFormData.status,
      version: 1,
      schedule: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTemplates((prev) => [...prev, newTemplate]);
    setShowTemplateModal(false);
    resetTemplateForm();
    showToast('Template created successfully', 'success');
  };

  const handleDeleteTemplate = (templateId: number) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Template deleted successfully', 'success');
  };

  // Toggle working day
  const handleWorkingDayToggle = (day: string) => {
    setShiftFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day) ?
      prev.workingDays.filter((d) => d !== day) :
      [...prev.workingDays, day]
    }));
  };

  // Toggle applicable class
  const handleClassToggle = (className: string) => {
    setShiftFormData((prev) => ({
      ...prev,
      applicableClasses: prev.applicableClasses.includes(className) ?
      prev.applicableClasses.filter((c) => c !== className) :
      [...prev.applicableClasses, className]
    }));
  };

  // Toggle template class assignment
  const handleTemplateClassToggle = (className: string) => {
    setTemplateFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(className) ?
      prev.assignedTo.filter((c) => c !== className) :
      [...prev.assignedTo, className]
    }));
  };

  // Export data
  const handleExportData = () => {
    const exportData = { shifts, templates };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable-framework-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
  };

  // Get period type icon
  const getPeriodTypeIcon = (type: PeriodType) => {
    switch (type) {
      case 'Assembly':return <Users className="w-4 h-4" />;
      case 'Regular':return <BookOpen className="w-4 h-4" />;
      case 'Recess':case 'Short Break':return <Coffee className="w-4 h-4" />;
      case 'Lunch':return <Coffee className="w-4 h-4" />;
      case 'PT/Sports':return <Zap className="w-4 h-4" />;
      case 'Lab':return <Settings className="w-4 h-4" />;
      case 'Library':return <BookOpen className="w-4 h-4" />;
      case 'Activity':return <PlayCircle className="w-4 h-4" />;
      case 'Zero Period':return <Sunrise className="w-4 h-4" />;
      case 'Remedial':return <RefreshCw className="w-4 h-4" />;
      default:return <Clock className="w-4 h-4" />;
    }
  };

  // Table columns for shifts
  const shiftColumns = [
  {
    key: 'name',
    header: 'Shift Name',
    render: (row: Shift) =>
    <div className="flex items-center gap-2">
          {row.name.includes('Morning') ? <Sunrise className="w-4 h-4 text-orange-500" /> :
      row.name.includes('Afternoon') ? <Sun className="w-4 h-4 text-yellow-500" /> :
      <Moon className="w-4 h-4 text-blue-500" />}
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.code}</p>
          </div>
        </div>

  },
  {
    key: 'timing',
    header: 'Timing',
    render: (row: Shift) =>
    <div>
          <p className="font-medium">{formatTime(row.startTime)} - {formatTime(row.endTime)}</p>
          <p className="text-xs text-gray-500">{calculateDuration(row.startTime, row.endTime)} mins</p>
        </div>

  },
  {
    key: 'periods',
    header: 'Periods',
    render: (row: Shift) =>
    <div>
          <p className="font-medium">{row.periods.filter((p) => !p.isBreak && p.type === 'Regular').length} Regular</p>
          <p className="text-xs text-gray-500">{row.periods.length} Total slots</p>
        </div>

  },
  {
    key: 'duration',
    header: 'Duration',
    render: (row: Shift) => `${row.periodDuration} min`
  },
  {
    key: 'workingDays',
    header: 'Working Days',
    render: (row: Shift) =>
    <div className="flex gap-1">
          {WORKING_DAYS.slice(0, 6).map((day) =>
      <span
        key={day.day}
        className={`text-xs px-1.5 py-0.5 rounded ${
        row.workingDays.includes(day.day) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`
        }>

              {day.shortName.charAt(0)}
            </span>
      )}
        </div>

  },
  {
    key: 'classes',
    header: 'Applicable Classes',
    render: (row: Shift) =>
    <div className="flex flex-wrap gap-1">
          {row.applicableClasses.length > 0 ?
      <>
              {row.applicableClasses.slice(0, 2).map((c) =>
        <Badge key={c} variant="default">{c}</Badge>
        )}
              {row.applicableClasses.length > 2 &&
        <Badge variant="default">+{row.applicableClasses.length - 2}</Badge>
        }
            </> :

      <span className="text-gray-400 text-sm">None</span>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Shift) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Shift) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="Configure Periods"
        onClick={() => {
          setSelectedShift(row);
          setShowPeriodConfigModal(true);
        }}>

            <Clock className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Preview"
        onClick={() => {
          setSelectedShift(row);
          setShowPreviewModal(true);
        }}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit"
        onClick={() => handleEditShift(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Duplicate"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'duplicateShift',
          targetId: row.id,
          message: `Duplicate "${row.name}" with all its periods?`
        })}>

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        className="text-red-500"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'deleteShift',
          targetId: row.id,
          message: `Delete "${row.name}"? This will also remove associated templates.`
        })}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.isVisible &&
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'}`
      }>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Confirmation Modal */}
      {confirmModal.isOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' })}>

                Cancel
              </Button>
              <Button
              variant={confirmModal.type === 'duplicateShift' ? 'primary' : 'danger'}
              onClick={() => {
                if (confirmModal.type === 'deleteShift' && confirmModal.targetId) {
                  handleDeleteShift(confirmModal.targetId);
                } else if (confirmModal.type === 'duplicateShift' && confirmModal.targetId) {
                  handleDuplicateShift(confirmModal.targetId);
                } else if (confirmModal.type === 'deletePeriod' && confirmModal.targetId && confirmModal.secondaryId) {
                  handleDeletePeriod(confirmModal.targetId, confirmModal.secondaryId);
                } else if (confirmModal.type === 'deleteTemplate' && confirmModal.targetId) {
                  handleDeleteTemplate(confirmModal.targetId);
                }
              }}>

                {confirmModal.type === 'duplicateShift' ? 'Duplicate' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Shift Modal */}
      {showShiftModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Shift' : 'Add New Shift'}
              </h3>
              <button onClick={() => {
              setShowShiftModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetShiftForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Shift Name *"
                placeholder="e.g., Morning Shift"
                value={shiftFormData.name}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Input
                label="Shift Code *"
                placeholder="e.g., MS"
                value={shiftFormData.code}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))} />

              </div>

              <Textarea
              label="Description"
              placeholder="Enter shift description"
              value={shiftFormData.description}
              onChange={(e) => setShiftFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Start Time *"
                type="time"
                value={shiftFormData.startTime}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, startTime: e.target.value }))} />

                <Input
                label="End Time *"
                type="time"
                value={shiftFormData.endTime}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, endTime: e.target.value }))} />

              </div>

              <div className="grid grid-cols-4 gap-4">
                <Input
                label="Total Periods"
                type="number"
                min={1}
                max={12}
                value={shiftFormData.totalPeriods}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, totalPeriods: parseInt(e.target.value) || 8 }))} />

                <Input
                label="Period Duration (min)"
                type="number"
                min={15}
                max={90}
                value={shiftFormData.periodDuration}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, periodDuration: parseInt(e.target.value) || 40 }))} />

                <Input
                label="Break Duration (min)"
                type="number"
                min={5}
                max={30}
                value={shiftFormData.breakDuration}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, breakDuration: parseInt(e.target.value) || 15 }))} />

                <Input
                label="Lunch Duration (min)"
                type="number"
                min={0}
                max={60}
                value={shiftFormData.lunchDuration}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, lunchDuration: parseInt(e.target.value) || 30 }))} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {WORKING_DAYS.map((day) =>
                <label key={day.day} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                    type="checkbox"
                    checked={shiftFormData.workingDays.includes(day.day)}
                    onChange={() => handleWorkingDayToggle(day.day)}
                    className="rounded border-gray-300" />

                      <span className="text-sm">{day.day}</span>
                    </label>
                )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Classes</label>
                <div className="grid grid-cols-3 gap-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
                  {CLASS_OPTIONS.map((className) =>
                <label key={className} className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={shiftFormData.applicableClasses.includes(className)}
                    onChange={() => handleClassToggle(className)}
                    className="rounded border-gray-300" />

                      <span className="text-sm">{className}</span>
                    </label>
                )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Effective From"
                type="date"
                value={shiftFormData.effectiveFrom}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, effectiveFrom: e.target.value }))} />

                <Select
                label="Status"
                options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }]
                }
                value={shiftFormData.status}
                onChange={(e) => setShiftFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowShiftModal(false);
              setIsEditing(false);
              setEditingId(null);
              resetShiftForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdateShift : handleCreateShift}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Shift' : 'Add Shift'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Period Modal */}
      {showPeriodModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isEditing ? 'Edit Period' : 'Add New Period'}
              </h3>
              <button onClick={() => {
              setShowPeriodModal(false);
              setIsEditing(false);
              setEditingPeriodId(null);
              resetPeriodForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Period Name *"
                placeholder="e.g., Period 1, Recess"
                value={periodFormData.name}
                onChange={(e) => setPeriodFormData((prev) => ({ ...prev, name: e.target.value }))} />

                <Select
                label="Period Type *"
                options={PERIOD_TYPES.map((t) => ({ value: t, label: t }))}
                value={periodFormData.type}
                onChange={(e) => {
                  const type = e.target.value as PeriodType;
                  const isBreak = ['Recess', 'Lunch', 'Short Break'].includes(type);
                  setPeriodFormData((prev) => ({ ...prev, type, isBreak }));
                }} />

              </div>

              {!periodFormData.isBreak &&
            <Input
              label="Period Number"
              type="number"
              min={0}
              value={periodFormData.periodNumber}
              onChange={(e) => setPeriodFormData((prev) => ({ ...prev, periodNumber: parseInt(e.target.value) || 0 }))} />

            }

              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Start Time *"
                type="time"
                value={periodFormData.startTime}
                onChange={(e) => {
                  const startTime = e.target.value;
                  const endTime = calculateEndTime(startTime, periodFormData.duration);
                  setPeriodFormData((prev) => ({ ...prev, startTime, endTime }));
                }} />

                <Input
                label="Duration (minutes) *"
                type="number"
                min={5}
                max={120}
                value={periodFormData.duration}
                onChange={(e) => {
                  const duration = parseInt(e.target.value) || 40;
                  const endTime = calculateEndTime(periodFormData.startTime, duration);
                  setPeriodFormData((prev) => ({ ...prev, duration, endTime }));
                }} />

              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>End Time:</strong> {formatTime(periodFormData.endTime)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                type="checkbox"
                id="isBreak"
                checked={periodFormData.isBreak}
                onChange={(e) => setPeriodFormData((prev) => ({ ...prev, isBreak: e.target.checked }))}
                className="rounded border-gray-300" />

                <label htmlFor="isBreak" className="text-sm text-gray-700">
                  This is a break period
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowPeriodModal(false);
              setIsEditing(false);
              setEditingPeriodId(null);
              resetPeriodForm();
            }}>
                Cancel
              </Button>
              <Button onClick={isEditing ? handleUpdatePeriod : handleCreatePeriod}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Period' : 'Add Period'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Period Configuration Modal */}
      {showPeriodConfigModal && selectedShift &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Configure Periods - {selectedShift.name}</h3>
                <p className="text-sm text-gray-500">
                  {formatTime(selectedShift.startTime)} - {formatTime(selectedShift.endTime)}
                </p>
              </div>
              <button onClick={() => {
              setShowPeriodConfigModal(false);
              setSelectedShift(null);
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Badge variant="default">{selectedShift.periods.length} Slots</Badge>
                <Badge variant="info">
                  {selectedShift.periods.filter((p) => !p.isBreak && p.type === 'Regular').length} Regular Periods
                </Badge>
                <Badge variant="warning">
                  {selectedShift.periods.filter((p) => p.isBreak).length} Breaks
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuickSetupData({
                    shiftId: selectedShift.id,
                    startTime: selectedShift.startTime,
                    regularPeriods: selectedShift.totalPeriods,
                    periodDuration: selectedShift.periodDuration,
                    includeAssembly: true,
                    assemblyDuration: 20,
                    includeShortBreak: true,
                    shortBreakAfterPeriod: 3,
                    shortBreakDuration: selectedShift.breakDuration,
                    includeLunch: selectedShift.lunchDuration > 0,
                    lunchAfterPeriod: 5,
                    lunchDuration: selectedShift.lunchDuration,
                    includeDispersal: true,
                    dispersalDuration: 5
                  });
                  setShowQuickSetupModal(true);
                }}>

                  <Zap className="w-4 h-4 mr-2" />
                  Quick Setup
                </Button>
                <Button
                size="sm"
                onClick={() => {
                  resetPeriodForm();
                  setIsEditing(false);
                  setShowPeriodModal(true);
                }}>

                  <Plus className="w-4 h-4 mr-2" />
                  Add Period
                </Button>
              </div>
            </div>

            {selectedShift.periods.length === 0 ?
          <div className="py-8 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No periods configured</p>
                <p className="text-sm">Add periods or use Quick Setup</p>
              </div> :

          <div className="space-y-2">
                {selectedShift.periods.sort((a, b) => a.order - b.order).map((period, index) =>
            <div
              key={period.id}
              className={`border rounded-lg p-3 flex items-center justify-between ${
              period.isBreak ? 'bg-orange-50 border-orange-200' :
              period.type === 'Assembly' ? 'bg-blue-50 border-blue-200' :
              period.type === 'Activity' ? 'bg-purple-50 border-purple-200' :
              period.type === 'Lab' ? 'bg-green-50 border-green-200' : ''}`
              }>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-0.5">
                        <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleMovePeriod(period.id, 'up')}
                    disabled={index === 0}>

                          <ChevronDown className="w-3 h-3 rotate-180" />
                        </Button>
                        <span className="text-xs text-gray-400">{period.order}</span>
                        <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleMovePeriod(period.id, 'down')}
                    disabled={index === selectedShift.periods.length - 1}>

                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {getPeriodTypeIcon(period.type)}
                        <div>
                          <p className="font-medium">{period.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatTime(period.startTime)} - {formatTime(period.endTime)} ({period.duration} min)
                          </p>
                        </div>
                      </div>

                      <Badge variant={period.isBreak ? 'warning' : 'default'}>
                        {period.type}
                      </Badge>
                    </div>

                    <div className="flex gap-1">
                      <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleEditPeriod(period)}>

                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                  variant="ghost"
                  size="xs"
                  className="text-red-500"
                  onClick={() => setConfirmModal({
                    isOpen: true,
                    type: 'deletePeriod',
                    targetId: selectedShift.id,
                    secondaryId: period.id,
                    message: `Delete "${period.name}"?`
                  })}>

                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
            )}
              </div>
          }

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => {
              setShowPeriodConfigModal(false);
              setSelectedShift(null);
            }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Quick Setup Modal */}
      {showQuickSetupModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Quick Period Setup</h3>
              <button onClick={() => setShowQuickSetupModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                This will replace all existing periods in the selected shift.
              </div>

              <Input
              label="Start Time"
              type="time"
              value={quickSetupData.startTime}
              onChange={(e) => setQuickSetupData((prev) => ({ ...prev, startTime: e.target.value }))} />


              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Regular Periods"
                type="number"
                min={1}
                max={12}
                value={quickSetupData.regularPeriods}
                onChange={(e) => setQuickSetupData((prev) => ({ ...prev, regularPeriods: parseInt(e.target.value) || 8 }))} />

                <Input
                label="Period Duration (min)"
                type="number"
                min={15}
                max={90}
                value={quickSetupData.periodDuration}
                onChange={(e) => setQuickSetupData((prev) => ({ ...prev, periodDuration: parseInt(e.target.value) || 40 }))} />

              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={quickSetupData.includeAssembly}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, includeAssembly: e.target.checked }))}
                    className="rounded border-gray-300" />

                    <span>Include Assembly</span>
                  </label>
                  {quickSetupData.includeAssembly &&
                <Input
                  type="number"
                  min={10}
                  max={45}
                  value={quickSetupData.assemblyDuration}
                  onChange={(e) => setQuickSetupData((prev) => ({ ...prev, assemblyDuration: parseInt(e.target.value) || 20 }))}
                  className="w-20" />

                }
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={quickSetupData.includeShortBreak}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, includeShortBreak: e.target.checked }))}
                    className="rounded border-gray-300" />

                    <span>Include Short Break after Period</span>
                  </label>
                  {quickSetupData.includeShortBreak &&
                <div className="flex gap-2">
                      <Input
                    type="number"
                    min={1}
                    max={quickSetupData.regularPeriods}
                    value={quickSetupData.shortBreakAfterPeriod}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, shortBreakAfterPeriod: parseInt(e.target.value) || 3 }))}
                    className="w-16" />

                      <Input
                    type="number"
                    min={5}
                    max={30}
                    value={quickSetupData.shortBreakDuration}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, shortBreakDuration: parseInt(e.target.value) || 15 }))}
                    className="w-20" />

                    </div>
                }
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={quickSetupData.includeLunch}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, includeLunch: e.target.checked }))}
                    className="rounded border-gray-300" />

                    <span>Include Lunch after Period</span>
                  </label>
                  {quickSetupData.includeLunch &&
                <div className="flex gap-2">
                      <Input
                    type="number"
                    min={1}
                    max={quickSetupData.regularPeriods}
                    value={quickSetupData.lunchAfterPeriod}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, lunchAfterPeriod: parseInt(e.target.value) || 5 }))}
                    className="w-16" />

                      <Input
                    type="number"
                    min={15}
                    max={60}
                    value={quickSetupData.lunchDuration}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, lunchDuration: parseInt(e.target.value) || 30 }))}
                    className="w-20" />

                    </div>
                }
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    checked={quickSetupData.includeDispersal}
                    onChange={(e) => setQuickSetupData((prev) => ({ ...prev, includeDispersal: e.target.checked }))}
                    className="rounded border-gray-300" />

                    <span>Include Dispersal</span>
                  </label>
                  {quickSetupData.includeDispersal &&
                <Input
                  type="number"
                  min={5}
                  max={15}
                  value={quickSetupData.dispersalDuration}
                  onChange={(e) => setQuickSetupData((prev) => ({ ...prev, dispersalDuration: parseInt(e.target.value) || 5 }))}
                  className="w-20" />

                }
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowQuickSetupModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleQuickSetup}>
                <Zap className="w-4 h-4 mr-2" />
                Generate Periods
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreviewModal && selectedShift &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedShift.name} - Preview</h3>
                <p className="text-sm text-gray-500">{selectedShift.description}</p>
              </div>
              <button onClick={() => {
              setShowPreviewModal(false);
              setSelectedShift(null);
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Timing</p>
                <p className="font-medium">{formatTime(selectedShift.startTime)} - {formatTime(selectedShift.endTime)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Working Days</p>
                <p className="font-medium">{selectedShift.workingDays.join(', ')}</p>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 grid grid-cols-4 gap-4 font-medium text-sm">
                <span>Slot</span>
                <span>Time</span>
                <span>Type</span>
                <span>Duration</span>
              </div>
              {selectedShift.periods.sort((a, b) => a.order - b.order).map((period) =>
            <div
              key={period.id}
              className={`p-3 grid grid-cols-4 gap-4 text-sm border-t ${
              period.isBreak ? 'bg-orange-50' : ''}`
              }>

                  <span className="font-medium">{period.name}</span>
                  <span>{formatTime(period.startTime)} - {formatTime(period.endTime)}</span>
                  <span>
                    <Badge variant={period.isBreak ? 'warning' : 'default'}>{period.type}</Badge>
                  </span>
                  <span>{period.duration} min</span>
                </div>
            )}
            </div>

            {selectedShift.applicableClasses.length > 0 &&
          <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Applicable Classes:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedShift.applicableClasses.map((c) =>
              <Badge key={c} variant="default">{c}</Badge>
              )}
                </div>
              </div>
          }

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => {
              setShowPreviewModal(false);
              setSelectedShift(null);
            }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Template Modal */}
      {showTemplateModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Create Timetable Template</h3>
              <button onClick={() => {
              setShowTemplateModal(false);
              resetTemplateForm();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
              label="Template Name *"
              placeholder="e.g., Primary Classes Timetable"
              value={templateFormData.name}
              onChange={(e) => setTemplateFormData((prev) => ({ ...prev, name: e.target.value }))} />


              <Select
              label="Base Shift *"
              options={shifts.map((s) => ({ value: s.id.toString(), label: `${s.name} (${formatTime(s.startTime)} - ${formatTime(s.endTime)})` }))}
              value={templateFormData.shiftId.toString()}
              onChange={(e) => setTemplateFormData((prev) => ({ ...prev, shiftId: parseInt(e.target.value) }))} />


              <Textarea
              label="Description"
              placeholder="Enter template description"
              value={templateFormData.description}
              onChange={(e) => setTemplateFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={2} />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Classes</label>
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
                  {CLASS_OPTIONS.map((className) =>
                <label key={className} className="flex items-center gap-2 cursor-pointer">
                      <input
                    type="checkbox"
                    checked={templateFormData.assignedTo.includes(className)}
                    onChange={() => handleTemplateClassToggle(className)}
                    className="rounded border-gray-300" />

                      <span className="text-sm">{className}</span>
                    </label>
                )}
                </div>
              </div>

              <Select
              label="Status"
              options={[
              { value: 'Draft', label: 'Draft' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={templateFormData.status}
              onChange={(e) => setTemplateFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setShowTemplateModal(false);
              resetTemplateForm();
            }}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Timetable & Shifts
          </h1>
          <p className="text-sm text-gray-500">
            Configure school timings, shifts, and period structures
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => {
            resetShiftForm();
            setIsEditing(false);
            setShowShiftModal(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <Clock className="w-6 h-6 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalShifts}</p>
            <p className="text-xs text-gray-500">Total Shifts</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.activeShifts}</p>
            <p className="text-xs text-gray-500">Active Shifts</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <BookOpen className="w-6 h-6 mx-auto mb-1 text-purple-500" />
            <p className="text-2xl font-bold">{stats.totalPeriods}</p>
            <p className="text-xs text-gray-500">Total Periods</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <FileText className="w-6 h-6 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalTemplates}</p>
            <p className="text-xs text-gray-500">Templates</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Layers className="w-6 h-6 mx-auto mb-1 text-indigo-500" />
            <p className="text-2xl font-bold">{stats.activeTemplates}</p>
            <p className="text-xs text-gray-500">Active Templates</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'shifts' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('shifts')}>

          <Clock className="w-4 h-4 mr-2" />
          Shifts
        </Button>
        <Button
          variant={activeTab === 'templates' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('templates')}>

          <FileText className="w-4 h-4 mr-2" />
          Templates
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg" />

            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-2">

            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {/* Content based on active tab */}
      {activeTab === 'shifts' &&
      <Card>
          {filteredShifts.length === 0 ?
        <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No shifts found</p>
              <p className="text-sm">Add shifts to define school timings</p>
            </div> :

        <Table columns={shiftColumns} data={filteredShifts} />
        }
        </Card>
      }

      {activeTab === 'templates' &&
      <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => {
            resetTemplateForm();
            setShowTemplateModal(true);
          }}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>

          {templates.length === 0 ?
        <Card className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No templates found</p>
              <p className="text-sm">Create timetable templates based on shifts</p>
            </Card> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) =>
          <Card key={template.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                    <Badge
                variant={
                template.status === 'Active' ? 'success' :
                template.status === 'Draft' ? 'warning' : 'default'
                }>

                      {template.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Base Shift:</span>
                      <span className="font-medium">{template.shiftName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Version:</span>
                      <span>v{template.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Updated:</span>
                      <span>{template.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>

                  {template.assignedTo.length > 0 &&
            <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-1">Assigned to:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.assignedTo.slice(0, 3).map((c) =>
                <Badge key={c} variant="default">{c}</Badge>
                )}
                        {template.assignedTo.length > 3 &&
                <Badge variant="default">+{template.assignedTo.length - 3}</Badge>
                }
                      </div>
                    </div>
            }

                  <div className="mt-4 flex justify-end gap-1">
                    <Button variant="ghost" size="xs" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="xs" title="Duplicate">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                variant="ghost"
                size="xs"
                title="Delete"
                className="text-red-500"
                onClick={() => setConfirmModal({
                  isOpen: true,
                  type: 'deleteTemplate',
                  targetId: template.id,
                  message: `Delete template "${template.name}"?`
                })}>

                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
          )}
            </div>
        }
        </div>
      }

      {/* Quick Reference Card */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Active Shifts Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shifts.filter((s) => s.status === 'Active').map((shift) =>
          <div key={shift.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {shift.name.includes('Morning') ? <Sunrise className="w-4 h-4 text-orange-500" /> :
              shift.name.includes('Afternoon') ? <Sun className="w-4 h-4 text-yellow-500" /> :
              <Clock className="w-4 h-4 text-blue-500" />}
                <span className="font-medium">{shift.name}</span>
              </div>
              <p className="text-sm text-gray-600">
                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {shift.periods.filter((p) => !p.isBreak && p.type === 'Regular').length} periods • {shift.periodDuration} min each
              </p>
              <div className="flex gap-1 mt-2">
                {shift.workingDays.slice(0, 6).map((day) =>
              <span
                key={day}
                className="text-xs px-1 bg-green-100 text-green-700 rounded">

                    {day.charAt(0)}
                  </span>
              )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>);

}