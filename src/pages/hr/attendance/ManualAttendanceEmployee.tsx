// File: ManualAttendanceMarking.tsx

import React, { useState, useMemo } from 'react';
import {
  Search,
  Save,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Coffee,
  Home,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  Edit3,
  Building2,
  Filter,
  Calendar,
  Printer,
  ChevronRight,
  LogIn,
  LogOut,
  Timer,
  PauseCircle,
  PlayCircle,
  Check,
  X,
  MoreVertical,
  FileSpreadsheet,
  ChevronLeft,
  AlertTriangle } from
'lucide-react';

// Types
type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave' | 'wfh' | 'on_duty' | 'week_off';

interface Employee {
  id: string;
  serialNo: number;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  shift: string;
  shiftStart: string;
  shiftEnd: string;
  loginTime: string;
  logoutTime: string;
  breakStartTime: string;
  breakEndTime: string;
  grossHours: number;
  breakDuration: number;
  netWorkingHours: number;
  overtime: number;
  status: AttendanceStatus;
  isLate: boolean;
  lateByMinutes: number;
  isEarlyLeave: boolean;
  earlyLeaveMinutes: number;
  remarks: string;
  isEditing: boolean;
}

// Status Configuration
const statusConfig: Record<AttendanceStatus, {label: string;bgColor: string;textColor: string;icon: React.ReactNode;}> = {
  present: {
    label: 'Present',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: <CheckCircle className="w-3.5 h-3.5" />
  },
  absent: {
    label: 'Absent',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: <XCircle className="w-3.5 h-3.5" />
  },
  half_day: {
    label: 'Half Day',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: <Clock className="w-3.5 h-3.5" />
  },
  leave: {
    label: 'On Leave',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: <Coffee className="w-3.5 h-3.5" />
  },
  wfh: {
    label: 'WFH',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    icon: <Home className="w-3.5 h-3.5" />
  },
  on_duty: {
    label: 'On Duty',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
    icon: <UserCheck className="w-3.5 h-3.5" />
  },
  week_off: {
    label: 'Week Off',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: <Calendar className="w-3.5 h-3.5" />
  }
};

const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
  value: value as AttendanceStatus,
  label: config.label
}));

// Department Options
const departments = [
{ value: 'all', label: 'All Departments' },
{ value: 'IT Department', label: 'IT Department' },
{ value: 'Human Resources', label: 'Human Resources' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Marketing', label: 'Marketing' },
{ value: 'Operations', label: 'Operations' },
{ value: 'Sales', label: 'Sales' },
{ value: 'Administration', label: 'Administration' }];


// Shift Options
const shifts = [
{ value: 'all', label: 'All Shifts' },
{ value: 'Morning', label: 'Morning (8:00 AM - 4:00 PM)' },
{ value: 'General', label: 'General (9:00 AM - 6:00 PM)' },
{ value: 'Evening', label: 'Evening (2:00 PM - 10:00 PM)' }];


// Initial Employee Data
const initialEmployees: Employee[] = [
{
  id: '1',
  serialNo: 1,
  employeeId: 'EMP001',
  name: 'John Anderson',
  avatar: 'JA',
  department: 'IT Department',
  designation: 'Senior Developer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:55',
  logoutTime: '18:15',
  breakStartTime: '13:00',
  breakEndTime: '13:45',
  grossHours: 9.33,
  breakDuration: 0.75,
  netWorkingHours: 8.58,
  overtime: 0.25,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '2',
  serialNo: 2,
  employeeId: 'EMP002',
  name: 'Sarah Williams',
  avatar: 'SW',
  department: 'Human Resources',
  designation: 'HR Manager',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:20',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '14:00',
  grossHours: 8.67,
  breakDuration: 1.0,
  netWorkingHours: 7.67,
  overtime: 0,
  status: 'present',
  isLate: true,
  lateByMinutes: 20,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Late arrival - 20 mins',
  isEditing: false
},
{
  id: '3',
  serialNo: 3,
  employeeId: 'EMP003',
  name: 'Michael Chen',
  avatar: 'MC',
  department: 'Finance',
  designation: 'Accountant',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'absent',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Absent - No information',
  isEditing: false
},
{
  id: '4',
  serialNo: 4,
  employeeId: 'EMP004',
  name: 'Emily Johnson',
  avatar: 'EJ',
  department: 'Marketing',
  designation: 'Marketing Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:00',
  logoutTime: '13:30',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 4.5,
  breakDuration: 0,
  netWorkingHours: 4.5,
  overtime: 0,
  status: 'half_day',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: true,
  earlyLeaveMinutes: 270,
  remarks: 'Half day - Permission granted',
  isEditing: false
},
{
  id: '5',
  serialNo: 5,
  employeeId: 'EMP005',
  name: 'David Martinez',
  avatar: 'DM',
  department: 'Operations',
  designation: 'Operations Manager',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'leave',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'CL - Approved',
  isEditing: false
},
{
  id: '6',
  serialNo: 6,
  employeeId: 'EMP006',
  name: 'Lisa Parker',
  avatar: 'LP',
  department: 'IT Department',
  designation: 'Junior Developer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:00',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 9.0,
  breakDuration: 0.5,
  netWorkingHours: 8.5,
  overtime: 0,
  status: 'wfh',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Working from home',
  isEditing: false
},
{
  id: '7',
  serialNo: 7,
  employeeId: 'EMP007',
  name: 'Robert Kim',
  avatar: 'RK',
  department: 'Sales',
  designation: 'Sales Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:30',
  logoutTime: '19:00',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 10.5,
  breakDuration: 0.5,
  netWorkingHours: 10.0,
  overtime: 1.0,
  status: 'on_duty',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Client visit',
  isEditing: false
},
{
  id: '8',
  serialNo: 8,
  employeeId: 'EMP008',
  name: 'Jennifer Davis',
  avatar: 'JD',
  department: 'Human Resources',
  designation: 'HR Executive',
  shift: 'Morning',
  shiftStart: '08:00',
  shiftEnd: '16:00',
  loginTime: '08:00',
  logoutTime: '16:05',
  breakStartTime: '12:00',
  breakEndTime: '12:30',
  grossHours: 8.08,
  breakDuration: 0.5,
  netWorkingHours: 7.58,
  overtime: 0,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '9',
  serialNo: 9,
  employeeId: 'EMP009',
  name: 'Thomas Brown',
  avatar: 'TB',
  department: 'IT Department',
  designation: 'System Administrator',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:05',
  logoutTime: '18:30',
  breakStartTime: '13:15',
  breakEndTime: '14:00',
  grossHours: 9.42,
  breakDuration: 0.75,
  netWorkingHours: 8.67,
  overtime: 0.5,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '10',
  serialNo: 10,
  employeeId: 'EMP010',
  name: 'Maria Garcia',
  avatar: 'MG',
  department: 'Finance',
  designation: 'Financial Analyst',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '',
  logoutTime: '',
  breakStartTime: '',
  breakEndTime: '',
  grossHours: 0,
  breakDuration: 0,
  netWorkingHours: 0,
  overtime: 0,
  status: 'week_off',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'Sunday - Week Off',
  isEditing: false
},
{
  id: '11',
  serialNo: 11,
  employeeId: 'EMP011',
  name: 'James Wilson',
  avatar: 'JW',
  department: 'Administration',
  designation: 'Admin Executive',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '08:50',
  logoutTime: '18:00',
  breakStartTime: '13:00',
  breakEndTime: '13:45',
  grossHours: 9.17,
  breakDuration: 0.75,
  netWorkingHours: 8.42,
  overtime: 0,
  status: 'present',
  isLate: false,
  lateByMinutes: 0,
  isEarlyLeave: false,
  earlyLeaveMinutes: 0,
  remarks: 'On time',
  isEditing: false
},
{
  id: '12',
  serialNo: 12,
  employeeId: 'EMP012',
  name: 'Patricia Moore',
  avatar: 'PM',
  department: 'Marketing',
  designation: 'Content Writer',
  shift: 'General',
  shiftStart: '09:00',
  shiftEnd: '18:00',
  loginTime: '09:45',
  logoutTime: '17:30',
  breakStartTime: '13:00',
  breakEndTime: '13:30',
  grossHours: 7.75,
  breakDuration: 0.5,
  netWorkingHours: 7.25,
  overtime: 0,
  status: 'present',
  isLate: true,
  lateByMinutes: 45,
  isEarlyLeave: true,
  earlyLeaveMinutes: 30,
  remarks: 'Late arrival, Early departure',
  isEditing: false
}];


// Utility Functions
const parseTime = (timeString: string): number | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const calculateWorkingHours = (
loginTime: string,
logoutTime: string,
breakStart: string,
breakEnd: string)
: {grossHours: number;breakDuration: number;netWorkingHours: number;} => {
  const login = parseTime(loginTime);
  const logout = parseTime(logoutTime);
  const breakS = parseTime(breakStart);
  const breakE = parseTime(breakEnd);

  if (login === null || logout === null) {
    return { grossHours: 0, breakDuration: 0, netWorkingHours: 0 };
  }

  const grossMinutes = logout - login;
  const grossHours = grossMinutes / 60;

  let breakDuration = 0;
  if (breakS !== null && breakE !== null) {
    breakDuration = (breakE - breakS) / 60;
  }

  const netWorkingHours = grossHours - breakDuration;

  return {
    grossHours: Math.round(grossHours * 100) / 100,
    breakDuration: Math.round(breakDuration * 100) / 100,
    netWorkingHours: Math.round(netWorkingHours * 100) / 100
  };
};

export function ManualAttendanceMarking() {
  // State
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Filtered Data
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
      const matchesShift = shiftFilter === 'all' || emp.shift === shiftFilter;
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesShift && matchesStatus;
    });
  }, [employees, searchQuery, departmentFilter, shiftFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const present = employees.filter((e) => e.status === 'present').length;
    const absent = employees.filter((e) => e.status === 'absent').length;
    const halfDay = employees.filter((e) => e.status === 'half_day').length;
    const leave = employees.filter((e) => e.status === 'leave').length;
    const wfh = employees.filter((e) => e.status === 'wfh').length;
    const onDuty = employees.filter((e) => e.status === 'on_duty').length;
    const weekOff = employees.filter((e) => e.status === 'week_off').length;
    const late = employees.filter((e) => e.isLate).length;

    const totalNetHours = employees.reduce((sum, e) => sum + e.netWorkingHours, 0);
    const totalOvertime = employees.reduce((sum, e) => sum + e.overtime, 0);

    return { total, present, absent, halfDay, leave, wfh, onDuty, weekOff, late, totalNetHours, totalOvertime };
  }, [employees]);

  // Handlers
  const handleDateChange = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'prev' ? -1 : 1));
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees(new Set());
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map((e) => e.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectEmployee = (id: string) => {
    const newSelected = new Set(selectedEmployees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmployees(newSelected);
    setSelectAll(newSelected.size === filteredEmployees.length);
  };

  const handleEditEmployee = (id: string) => {
    setEmployees((prev) =>
    prev.map((emp) => ({
      ...emp,
      isEditing: emp.id === id ? !emp.isEditing : emp.isEditing
    }))
    );
  };

  const handleUpdateField = (id: string, field: keyof Employee, value: string) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id !== id) return emp;

      const updated = { ...emp, [field]: value };

      // Recalculate working hours when time fields change
      if (['loginTime', 'logoutTime', 'breakStartTime', 'breakEndTime'].includes(field)) {
        const hours = calculateWorkingHours(
          field === 'loginTime' ? value : emp.loginTime,
          field === 'logoutTime' ? value : emp.logoutTime,
          field === 'breakStartTime' ? value : emp.breakStartTime,
          field === 'breakEndTime' ? value : emp.breakEndTime
        );
        updated.grossHours = hours.grossHours;
        updated.breakDuration = hours.breakDuration;
        updated.netWorkingHours = hours.netWorkingHours;

        // Auto-determine status based on hours
        if (hours.netWorkingHours >= 8) {
          updated.status = 'present';
          updated.overtime = Math.round((hours.netWorkingHours - 8) * 100) / 100;
        } else if (hours.netWorkingHours >= 4) {
          updated.status = 'half_day';
          updated.overtime = 0;
        } else if (hours.netWorkingHours > 0) {
          updated.status = 'half_day';
          updated.overtime = 0;
        }

        // Check for late arrival
        const shiftStartMinutes = parseTime(emp.shiftStart);
        const loginMinutes = parseTime(field === 'loginTime' ? value : emp.loginTime);
        if (shiftStartMinutes !== null && loginMinutes !== null) {
          const gracePeriod = 5; // 5 minutes grace period
          if (loginMinutes > shiftStartMinutes + gracePeriod) {
            updated.isLate = true;
            updated.lateByMinutes = loginMinutes - shiftStartMinutes;
          } else {
            updated.isLate = false;
            updated.lateByMinutes = 0;
          }
        }
      }

      setHasUnsavedChanges(true);
      return updated;
    })
    );
  };

  const handleStatusChange = (id: string, status: AttendanceStatus) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id !== id) return emp;

      const updated = { ...emp, status };

      // Clear times for certain statuses
      if (['absent', 'leave', 'week_off'].includes(status)) {
        updated.loginTime = '';
        updated.logoutTime = '';
        updated.breakStartTime = '';
        updated.breakEndTime = '';
        updated.grossHours = 0;
        updated.breakDuration = 0;
        updated.netWorkingHours = 0;
        updated.overtime = 0;
        updated.isLate = false;
        updated.lateByMinutes = 0;
      }

      setHasUnsavedChanges(true);
      return updated;
    })
    );
  };

  const handleBulkStatusChange = (status: AttendanceStatus) => {
    if (selectedEmployees.size === 0) return;

    setEmployees((prev) =>
    prev.map((emp) => {
      if (!selectedEmployees.has(emp.id)) return emp;

      const updated = { ...emp, status };

      if (status === 'present') {
        updated.loginTime = emp.shiftStart;
        updated.logoutTime = emp.shiftEnd;
        updated.breakStartTime = '13:00';
        updated.breakEndTime = '13:30';
        const hours = calculateWorkingHours(updated.loginTime, updated.logoutTime, updated.breakStartTime, updated.breakEndTime);
        updated.grossHours = hours.grossHours;
        updated.breakDuration = hours.breakDuration;
        updated.netWorkingHours = hours.netWorkingHours;
        updated.isLate = false;
        updated.lateByMinutes = 0;
        updated.remarks = 'On time';
      } else if (['absent', 'leave', 'week_off'].includes(status)) {
        updated.loginTime = '';
        updated.logoutTime = '';
        updated.breakStartTime = '';
        updated.breakEndTime = '';
        updated.grossHours = 0;
        updated.breakDuration = 0;
        updated.netWorkingHours = 0;
        updated.overtime = 0;
        updated.isLate = false;
        updated.lateByMinutes = 0;
        updated.remarks = status === 'absent' ? 'Absent' : status === 'leave' ? 'On Leave' : 'Week Off';
      }

      return updated;
    })
    );
    setHasUnsavedChanges(true);
    setSelectedEmployees(new Set());
    setSelectAll(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    // Close all editing modes
    setEmployees((prev) => prev.map((emp) => ({ ...emp, isEditing: false })));
    alert('Attendance saved successfully!');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setShiftFilter('all');
    setStatusFilter('all');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-3">
            <span className="hover:text-gray-700 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="hover:text-gray-700 cursor-pointer">Attendance</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium">Manual Marking</span>
          </nav>

          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-7 h-7 text-blue-600" />
                Manual Attendance Marking
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Mark attendance with login, logout, and break timings
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Date Navigation */}
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => handleDateChange('prev')}
                  className="p-2.5 hover:bg-gray-100 transition-colors border-r border-gray-300">

                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex items-center gap-2 px-4 py-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border-none outline-none text-sm font-medium text-gray-900 bg-transparent w-32" />

                </div>
                <button
                  onClick={() => handleDateChange('next')}
                  className="p-2.5 hover:bg-gray-100 transition-colors border-l border-gray-300">

                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {!isToday &&
              <button
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                  Today
                </button>
              }

              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
                Import
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <FileSpreadsheet className="w-4 h-4" />
                Export
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !hasUnsavedChanges}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${
                hasUnsavedChanges ?
                'bg-blue-600 hover:bg-blue-700' :
                'bg-gray-400 cursor-not-allowed'}`
                }>

                {isSaving ?
                <RefreshCw className="w-4 h-4 animate-spin" /> :

                <Save className="w-4 h-4" />
                }
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges &&
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-800 font-medium">
              You have unsaved changes. Click "Save Attendance" to save your changes.
            </p>
          </div>
        }

        {/* Date Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Marking Attendance For</p>
              <h2 className="text-2xl font-bold mt-1">{formatDate(selectedDate)}</h2>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.present + stats.wfh + stats.onDuty}</p>
                <p className="text-blue-100 text-sm">Working</p>
              </div>
              <div className="w-px h-12 bg-blue-400" />
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.absent}</p>
                <p className="text-blue-100 text-sm">Absent</p>
              </div>
              <div className="w-px h-12 bg-blue-400" />
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.leave}</p>
                <p className="text-blue-100 text-sm">On Leave</p>
              </div>
              <div className="w-px h-12 bg-blue-400" />
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-blue-100 text-sm">Total Staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4">
          {[
          { label: 'Total', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Present', value: stats.present, icon: CheckCircle, color: 'green' },
          { label: 'Absent', value: stats.absent, icon: XCircle, color: 'red' },
          { label: 'Half Day', value: stats.halfDay, icon: Clock, color: 'amber' },
          { label: 'On Leave', value: stats.leave, icon: Coffee, color: 'blue' },
          { label: 'WFH', value: stats.wfh, icon: Home, color: 'purple' },
          { label: 'On Duty', value: stats.onDuty, icon: UserCheck, color: 'indigo' },
          { label: 'Week Off', value: stats.weekOff, icon: Calendar, color: 'gray' },
          { label: 'Late', value: stats.late, icon: AlertCircle, color: 'orange' }].
          map((stat) =>
          <div
            key={stat.label}
            className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow`}>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className={`text-xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }>

              <Filter className="w-4 h-4" />
              Filters
              {(departmentFilter !== 'all' || shiftFilter !== 'all' || statusFilter !== 'all') &&
              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {[departmentFilter, shiftFilter, statusFilter].filter((f) => f !== 'all').length}
                </span>
              }
            </button>

            {(departmentFilter !== 'all' || shiftFilter !== 'all' || statusFilter !== 'all' || searchQuery) &&
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">

                <XCircle className="w-4 h-4" />
                Clear Filters
              </button>
            }
          </div>

          {/* Expanded Filters */}
          {showFilters &&
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {departments.map((dept) =>
                <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                  {shifts.map((shift) =>
                <option key={shift.value} value={shift.value}>
                      {shift.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="all">All Status</option>
                  {statusOptions.map((status) =>
                <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                )}
                </select>
              </div>
            </div>
          }
        </div>

        {/* Bulk Actions */}
        {selectedEmployees.size > 0 &&
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {selectedEmployees.size}
              </div>
              <span className="font-medium text-blue-900">
                {selectedEmployees.size} employee{selectedEmployees.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
              onClick={() => handleBulkStatusChange('present')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">

                <CheckCircle className="w-4 h-4" />
                Present
              </button>
              <button
              onClick={() => handleBulkStatusChange('absent')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">

                <XCircle className="w-4 h-4" />
                Absent
              </button>
              <button
              onClick={() => handleBulkStatusChange('half_day')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">

                <Clock className="w-4 h-4" />
                Half Day
              </button>
              <button
              onClick={() => handleBulkStatusChange('leave')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">

                <Coffee className="w-4 h-4" />
                Leave
              </button>
              <button
              onClick={() => handleBulkStatusChange('wfh')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">

                <Home className="w-4 h-4" />
                WFH
              </button>
              <button
              onClick={() => {
                setSelectedEmployees(new Set());
                setSelectAll(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">

                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        }

        {/* Main Attendance Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendance Register</h3>
              <p className="text-sm text-gray-500">
                {filteredEmployees.length} of {employees.length} employees
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Timer className="w-4 h-4 text-blue-600" />
                Total Net Hours: <span className="font-bold text-blue-600">{stats.totalNetHours.toFixed(1)}h</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-green-600" />
                Overtime: <span className="font-bold text-green-600">{stats.totalOvertime.toFixed(1)}h</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Emp ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[200px]">
                    Employee Details
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Shift
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <LogIn className="w-3.5 h-3.5" />
                      Login Time
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <LogOut className="w-3.5 h-3.5" />
                      Logout Time
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <PauseCircle className="w-3.5 h-3.5" />
                      Break Start
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <PlayCircle className="w-3.5 h-3.5" />
                      Break End
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center justify-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      Net Hours
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[150px]">
                    Remarks
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee) => {
                  const status = statusConfig[employee.status];
                  const isNonWorking = ['absent', 'leave', 'week_off'].includes(employee.status);

                  return (
                    <tr
                      key={employee.id}
                      className={`hover:bg-gray-50 transition-colors ${
                      employee.isEditing ? 'bg-blue-50' : ''} ${
                      isNonWorking ? 'bg-gray-50/50' : ''}`}>

                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.has(employee.id)}
                          onChange={() => handleSelectEmployee(employee.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                      </td>

                      {/* Serial No */}
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-500">{employee.serialNo}</span>
                      </td>

                      {/* Employee ID */}
                      <td className="py-3 px-4">
                        <span className="text-sm font-mono text-gray-600">{employee.employeeId}</span>
                      </td>

                      {/* Employee Details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${
                            isNonWorking ?
                            'bg-gray-400' :
                            'bg-gradient-to-br from-blue-500 to-indigo-600'}`
                            }>

                            {employee.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                            <p className="text-xs text-gray-500">
                              {employee.department} • {employee.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Shift */}
                      <td className="py-3 px-4 text-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{employee.shift}</p>
                          <p className="text-xs text-gray-500">
                            {employee.shiftStart} - {employee.shiftEnd}
                          </p>
                        </div>
                      </td>

                      {/* Login Time */}
                      <td className="py-3 px-4 text-center">
                        {employee.isEditing && !isNonWorking ?
                        <input
                          type="time"
                          value={employee.loginTime}
                          onChange={(e) => handleUpdateField(employee.id, 'loginTime', e.target.value)}
                          className="w-24 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" /> :

                        employee.loginTime ?
                        <div>
                            <span
                            className={`text-sm font-semibold ${
                            employee.isLate ? 'text-red-600' : 'text-green-600'}`
                            }>

                              {employee.loginTime}
                            </span>
                            {employee.isLate &&
                          <p className="text-xs text-red-500">Late by {employee.lateByMinutes}m</p>
                          }
                          </div> :

                        <span className="text-sm text-gray-400">—</span>
                        }
                      </td>

                      {/* Logout Time */}
                      <td className="py-3 px-4 text-center">
                        {employee.isEditing && !isNonWorking ?
                        <input
                          type="time"
                          value={employee.logoutTime}
                          onChange={(e) => handleUpdateField(employee.id, 'logoutTime', e.target.value)}
                          className="w-24 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" /> :

                        employee.logoutTime ?
                        <span
                          className={`text-sm font-semibold ${
                          employee.isEarlyLeave ? 'text-orange-600' : 'text-blue-600'}`
                          }>

                            {employee.logoutTime}
                          </span> :

                        <span className="text-sm text-gray-400">—</span>
                        }
                      </td>

                      {/* Break Start Time */}
                      <td className="py-3 px-4 text-center">
                        {employee.isEditing && !isNonWorking ?
                        <input
                          type="time"
                          value={employee.breakStartTime}
                          onChange={(e) => handleUpdateField(employee.id, 'breakStartTime', e.target.value)}
                          className="w-24 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" /> :

                        employee.breakStartTime ?
                        <span className="text-sm font-medium text-gray-700">{employee.breakStartTime}</span> :

                        <span className="text-sm text-gray-400">—</span>
                        }
                      </td>

                      {/* Break End Time */}
                      <td className="py-3 px-4 text-center">
                        {employee.isEditing && !isNonWorking ?
                        <input
                          type="time"
                          value={employee.breakEndTime}
                          onChange={(e) => handleUpdateField(employee.id, 'breakEndTime', e.target.value)}
                          className="w-24 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" /> :

                        employee.breakEndTime ?
                        <span className="text-sm font-medium text-gray-700">{employee.breakEndTime}</span> :

                        <span className="text-sm text-gray-400">—</span>
                        }
                      </td>

                      {/* Net Working Hours */}
                      <td className="py-3 px-4 text-center">
                        {employee.netWorkingHours > 0 ?
                        <div>
                            <span
                            className={`text-sm font-bold ${
                            employee.netWorkingHours >= 8 ?
                            'text-green-600' :
                            employee.netWorkingHours >= 6 ?
                            'text-amber-600' :
                            'text-red-600'}`
                            }>

                              {employee.netWorkingHours.toFixed(2)}h
                            </span>
                            {employee.overtime > 0 &&
                          <p className="text-xs text-green-600">+{employee.overtime.toFixed(1)}h OT</p>
                          }
                          </div> :

                        <span className="text-sm text-gray-400">—</span>
                        }
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {employee.isEditing ?
                        <select
                          value={employee.status}
                          onChange={(e) => handleStatusChange(employee.id, e.target.value as AttendanceStatus)}
                          className="px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

                            {statusOptions.map((opt) =>
                          <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                          )}
                          </select> :

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>

                            {status.icon}
                            {status.label}
                          </span>
                        }
                      </td>

                      {/* Remarks */}
                      <td className="py-3 px-4">
                        {employee.isEditing ?
                        <input
                          type="text"
                          value={employee.remarks}
                          onChange={(e) => handleUpdateField(employee.id, 'remarks', e.target.value)}
                          placeholder="Add remarks..."
                          className="w-full px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /> :


                        <span className="text-sm text-gray-600">{employee.remarks || '—'}</span>
                        }
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {employee.isEditing ?
                          <>
                              <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Save">

                                <Check className="w-4 h-4" />
                              </button>
                              <button
                              onClick={() => handleEditEmployee(employee.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel">

                                <X className="w-4 h-4" />
                              </button>
                            </> :

                          <button
                            onClick={() => handleEditEmployee(employee.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit">

                              <Edit3 className="w-4 h-4" />
                            </button>
                          }
                        </div>
                      </td>
                    </tr>);

                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredEmployees.length === 0 &&
          <div className="flex flex-col items-center justify-center py-16">
              <UserX className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-500">No employees found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">

                Clear all filters
              </button>
            </div>
          }

          {/* Table Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{filteredEmployees.length}</span> of{' '}
                <span className="font-semibold">{employees.length}</span> employees
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-sm text-gray-600">Half Day</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600">Leave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">WFH</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Quick Tips for Attendance Marking</h4>
              <ul className="text-sm text-blue-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Click the <Edit3 className="w-3.5 h-3.5 inline text-blue-600" /> edit icon to modify individual employee attendance
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Select multiple employees using checkboxes for bulk status updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Working hours are automatically calculated when you enter login, logout, and break times
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Late arrivals are automatically detected based on shift start time (5 min grace period)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  Don't forget to click <strong>"Save Attendance"</strong> to save all changes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

export default ManualAttendanceMarking;