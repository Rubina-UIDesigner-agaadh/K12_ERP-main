import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  Home,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  Clock,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  X,
  LogIn,
  LogOut,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Fingerprint,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  Building,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Activity,
  Smartphone,
  Wifi,
  Info } from
'lucide-react';

interface PunchRecord {
  id: string;
  time: string;
  type: 'in' | 'out';
  device: string;
  location: string;
  method: 'biometric' | 'card' | 'face' | 'manual';
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  shift: string;
  shiftStartTime: string;
  shiftEndTime: string;
  firstInTime: string | null;
  lastOutTime: string | null;
  totalHoursWorked: number | null;
  status: 'present' | 'absent' | 'mismatched' | 'half_day' | 'late';
  punchHistory: PunchRecord[];
  isLate: boolean;
  earlyLeave: boolean;
}

const departments = [
{ value: 'all', label: 'All Departments' },
{ value: 'engineering', label: 'Engineering' },
{ value: 'science', label: 'Science' },
{ value: 'mathematics', label: 'Mathematics' },
{ value: 'administration', label: 'Administration' },
{ value: 'finance', label: 'Finance' },
{ value: 'hr', label: 'Human Resources' },
{ value: 'transport', label: 'Transport' }];


const shifts = [
{ value: 'all', label: 'All Shifts' },
{ value: 'morning', label: 'Morning Shift (8:00 AM - 4:00 PM)' },
{ value: 'general', label: 'General Shift (9:00 AM - 5:00 PM)' },
{ value: 'afternoon', label: 'Afternoon Shift (12:00 PM - 8:00 PM)' },
{ value: 'flexible', label: 'Flexible Shift' }];


const devices = [
{ value: 'all', label: 'All Devices' },
{ value: 'main_gate', label: 'Main Gate' },
{ value: 'reception', label: 'Reception' },
{ value: 'back_gate', label: 'Back Gate' },
{ value: 'parking', label: 'Parking Entry' },
{ value: 'cafeteria', label: 'Cafeteria' }];


const generatePunchHistory = (status: string, isLate: boolean): PunchRecord[] => {
  if (status === 'absent') return [];

  const history: PunchRecord[] = [];
  const deviceOptions = ['Main Gate', 'Reception', 'Back Gate', 'Parking Entry'];
  const methodOptions: ('biometric' | 'card' | 'face' | 'manual')[] = ['biometric', 'card', 'face', 'manual'];

  if (status === 'mismatched') {
    // Only one punch
    history.push({
      id: '1',
      time: isLate ? '09:35 AM' : '08:55 AM',
      type: 'in',
      device: deviceOptions[Math.floor(Math.random() * deviceOptions.length)],
      location: 'Building A',
      method: methodOptions[Math.floor(Math.random() * methodOptions.length)]
    });
  } else {
    // Normal punches
    const inTime = isLate ? '09:' + (Math.floor(Math.random() * 30) + 15) + ' AM' : '08:' + (Math.floor(Math.random() * 15) + 45) + ' AM';
    history.push({
      id: '1',
      time: inTime,
      type: 'in',
      device: deviceOptions[Math.floor(Math.random() * deviceOptions.length)],
      location: 'Building A',
      method: methodOptions[Math.floor(Math.random() * methodOptions.length)]
    });

    // Lunch out
    history.push({
      id: '2',
      time: '01:00 PM',
      type: 'out',
      device: 'Cafeteria',
      location: 'Building A',
      method: methodOptions[Math.floor(Math.random() * methodOptions.length)]
    });

    // Lunch in
    history.push({
      id: '3',
      time: '01:45 PM',
      type: 'in',
      device: 'Cafeteria',
      location: 'Building A',
      method: methodOptions[Math.floor(Math.random() * methodOptions.length)]
    });

    // Final out
    history.push({
      id: '4',
      time: status === 'half_day' ? '02:30 PM' : '05:' + (Math.floor(Math.random() * 30) + 10) + ' PM',
      type: 'out',
      device: deviceOptions[Math.floor(Math.random() * deviceOptions.length)],
      location: 'Building A',
      method: methodOptions[Math.floor(Math.random() * methodOptions.length)]
    });
  }

  return history;
};

const mockAttendance: AttendanceRecord[] = [
{
  id: '1',
  employeeId: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '08:55 AM',
  lastOutTime: '05:30 PM',
  totalHoursWorked: 8.5,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '2',
  employeeId: 'EMP002',
  name: 'Mrs. Priya Sharma',
  avatar: 'PS',
  department: 'Science',
  designation: 'Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '09:25 AM',
  lastOutTime: '05:15 PM',
  totalHoursWorked: 7.8,
  status: 'present',
  punchHistory: [],
  isLate: true,
  earlyLeave: false
},
{
  id: '3',
  employeeId: 'EMP003',
  name: 'Mr. Amit Patel',
  avatar: 'AP',
  department: 'Science',
  designation: 'HOD',
  shift: 'Morning Shift',
  shiftStartTime: '08:00 AM',
  shiftEndTime: '04:00 PM',
  firstInTime: '07:50 AM',
  lastOutTime: '04:10 PM',
  totalHoursWorked: 8.3,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '4',
  employeeId: 'EMP004',
  name: 'Ms. Sneha Reddy',
  avatar: 'SR',
  department: 'English',
  designation: 'Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: null,
  lastOutTime: null,
  totalHoursWorked: null,
  status: 'absent',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '5',
  employeeId: 'EMP005',
  name: 'Dr. Vikram Singh',
  avatar: 'VS',
  department: 'Biology',
  designation: 'Senior Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '08:45 AM',
  lastOutTime: null,
  totalHoursWorked: null,
  status: 'mismatched',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '6',
  employeeId: 'EMP006',
  name: 'Mrs. Kavita Iyer',
  avatar: 'KI',
  department: 'Social Studies',
  designation: 'Teacher',
  shift: 'Morning Shift',
  shiftStartTime: '08:00 AM',
  shiftEndTime: '04:00 PM',
  firstInTime: '08:35 AM',
  lastOutTime: '04:00 PM',
  totalHoursWorked: 7.4,
  status: 'present',
  punchHistory: [],
  isLate: true,
  earlyLeave: false
},
{
  id: '7',
  employeeId: 'EMP007',
  name: 'Mr. Sanjay Gupta',
  avatar: 'SG',
  department: 'Computer Science',
  designation: 'Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '09:05 AM',
  lastOutTime: '05:00 PM',
  totalHoursWorked: 7.9,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '8',
  employeeId: 'EMP008',
  name: 'Ms. Meera Nair',
  avatar: 'MN',
  department: 'Mathematics',
  designation: 'Assistant Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '08:50 AM',
  lastOutTime: '02:30 PM',
  totalHoursWorked: 5.7,
  status: 'half_day',
  punchHistory: [],
  isLate: false,
  earlyLeave: true
},
{
  id: '9',
  employeeId: 'EMP009',
  name: 'Dr. Arun Verma',
  avatar: 'AV',
  department: 'Physics',
  designation: 'Senior Teacher',
  shift: 'Morning Shift',
  shiftStartTime: '08:00 AM',
  shiftEndTime: '04:00 PM',
  firstInTime: '07:55 AM',
  lastOutTime: '04:15 PM',
  totalHoursWorked: 8.3,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '10',
  employeeId: 'EMP010',
  name: 'Mrs. Lakshmi Menon',
  avatar: 'LM',
  department: 'Geography',
  designation: 'Teacher',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: null,
  lastOutTime: null,
  totalHoursWorked: null,
  status: 'absent',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '11',
  employeeId: 'EMP011',
  name: 'Mr. Rohit Joshi',
  avatar: 'RJ',
  department: 'Physical Education',
  designation: 'Teacher',
  shift: 'Morning Shift',
  shiftStartTime: '08:00 AM',
  shiftEndTime: '04:00 PM',
  firstInTime: '07:45 AM',
  lastOutTime: '04:00 PM',
  totalHoursWorked: 8.25,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '12',
  employeeId: 'EMP012',
  name: 'Ms. Anita Das',
  avatar: 'AD',
  department: 'Arts',
  designation: 'Teacher',
  shift: 'Afternoon Shift',
  shiftStartTime: '12:00 PM',
  shiftEndTime: '08:00 PM',
  firstInTime: '12:15 PM',
  lastOutTime: null,
  totalHoursWorked: null,
  status: 'mismatched',
  punchHistory: [],
  isLate: true,
  earlyLeave: false
},
{
  id: '13',
  employeeId: 'EMP013',
  name: 'Mr. Suresh Pillai',
  avatar: 'SP',
  department: 'Administration',
  designation: 'Admin Officer',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '09:00 AM',
  lastOutTime: '05:30 PM',
  totalHoursWorked: 8.5,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '14',
  employeeId: 'EMP014',
  name: 'Mrs. Geeta Krishnan',
  avatar: 'GK',
  department: 'Finance',
  designation: 'Accountant',
  shift: 'General Shift',
  shiftStartTime: '09:00 AM',
  shiftEndTime: '05:00 PM',
  firstInTime: '08:45 AM',
  lastOutTime: '05:00 PM',
  totalHoursWorked: 8.25,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
},
{
  id: '15',
  employeeId: 'EMP015',
  name: 'Mr. David Thomas',
  avatar: 'DT',
  department: 'Transport',
  designation: 'Coordinator',
  shift: 'Morning Shift',
  shiftStartTime: '07:00 AM',
  shiftEndTime: '03:00 PM',
  firstInTime: '06:50 AM',
  lastOutTime: '03:10 PM',
  totalHoursWorked: 8.3,
  status: 'present',
  punchHistory: [],
  isLate: false,
  earlyLeave: false
}].
map((record) => ({
  ...record,
  punchHistory: generatePunchHistory(record.status, record.isLate)
}));

type SortColumn = 'name' | 'employeeId' | 'department' | 'firstInTime' | 'totalHoursWorked' | 'status';
type SortDirection = 'asc' | 'desc';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'present':
      return {
        label: 'Present',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: <CheckCircle className="w-3 h-3" />
      };
    case 'absent':
      return {
        label: 'Absent',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: <XCircle className="w-3 h-3" />
      };
    case 'mismatched':
      return {
        label: 'Mismatched Punch',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        icon: <AlertTriangle className="w-3 h-3" />
      };
    case 'half_day':
      return {
        label: 'Half Day',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        icon: <AlertCircle className="w-3 h-3" />
      };
    case 'late':
      return {
        label: 'Late',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: <Clock className="w-3 h-3" />
      };
    default:
      return {
        label: 'Unknown',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        icon: <AlertCircle className="w-3 h-3" />
      };
  }
};

const getPunchMethodIcon = (method: string) => {
  switch (method) {
    case 'biometric':
      return <Fingerprint className="w-4 h-4 text-blue-500" />;
    case 'card':
      return <Wifi className="w-4 h-4 text-purple-500" />;
    case 'face':
      return <Eye className="w-4 h-4 text-green-500" />;
    case 'manual':
      return <Smartphone className="w-4 h-4 text-gray-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-400" />;
  }
};

export function DailyAttendanceLog() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<AttendanceRecord | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredData = useMemo(() => {
    return mockAttendance.filter((record) => {
      if (departmentFilter !== 'all' && !record.department.toLowerCase().includes(departmentFilter)) {
        return false;
      }
      if (shiftFilter !== 'all') {
        const shiftMatch = record.shift.toLowerCase().includes(shiftFilter);
        if (!shiftMatch) return false;
      }
      return true;
    });
  }, [departmentFilter, shiftFilter, deviceFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'employeeId':
          comparison = a.employeeId.localeCompare(b.employeeId);
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
        case 'firstInTime':
          if (!a.firstInTime) return 1;
          if (!b.firstInTime) return -1;
          comparison = a.firstInTime.localeCompare(b.firstInTime);
          break;
        case 'totalHoursWorked':
          const aHours = a.totalHoursWorked || 0;
          const bHours = b.totalHoursWorked || 0;
          comparison = aHours - bHours;
          break;
        case 'status':
          const statusOrder = { present: 0, late: 1, half_day: 2, mismatched: 3, absent: 4 };
          comparison = (statusOrder[a.status as keyof typeof statusOrder] || 5) - (statusOrder[b.status as keyof typeof statusOrder] || 5);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (record: AttendanceRecord) => {
    setSelectedEmployee(record);
    setShowDrawer(true);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter((r) => r.status === 'present').length;
    const absent = filteredData.filter((r) => r.status === 'absent').length;
    const mismatched = filteredData.filter((r) => r.status === 'mismatched').length;
    const late = filteredData.filter((r) => r.isLate).length;
    const halfDay = filteredData.filter((r) => r.status === 'half_day').length;
    const avgHours = filteredData.
    filter((r) => r.totalHoursWorked).
    reduce((sum, r) => sum + (r.totalHoursWorked || 0), 0) / (present + halfDay || 1);

    return { total, present, absent, mismatched, late, halfDay, avgHours };
  }, [filteredData]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const SortIcon = ({ column }: {column: SortColumn;}) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ArrowUp className="w-4 h-4 text-blue-600" /> :

    <ArrowDown className="w-4 h-4 text-blue-600" />;

  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Attendance</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Daily Log</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Attendance Log</h1>
          <p className="text-sm text-gray-500">
            {formatDate(selectedDate)} • Raw punch data and attendance records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border-none outline-none text-sm text-gray-900 bg-transparent" />

          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.present}</p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.halfDay}</p>
              <p className="text-xs text-gray-500">Half Day</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.mismatched}</p>
              <p className="text-xs text-gray-500">Mismatched</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.avgHours.toFixed(1)}h</p>
              <p className="text-xs text-gray-500">Avg Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Department"
            options={departments}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)} />

          <Select
            label="Shift"
            options={shifts}
            value={shiftFilter}
            onChange={(e) => setShiftFilter(e.target.value)} />

          <Select
            label="Device Name"
            options={devices}
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)} />

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setDepartmentFilter('all');
                setShiftFilter('all');
                setDeviceFilter('all');
              }}
              className="w-full">

              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card title="Attendance Records">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            Click on any row to view detailed punch history for that employee
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeId')}>

                  <div className="flex items-center gap-2">
                    Employee ID
                    <SortIcon column="employeeId" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-2">
                    Employee Name
                    <SortIcon column="name" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}>

                  <div className="flex items-center gap-2">
                    Department
                    <SortIcon column="department" />
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Shift Name
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('firstInTime')}>

                  <div className="flex items-center justify-center gap-2">
                    First In-Time
                    <SortIcon column="firstInTime" />
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Last Out-Time
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalHoursWorked')}>

                  <div className="flex items-center justify-center gap-2">
                    Total Hours
                    <SortIcon column="totalHoursWorked" />
                  </div>
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center gap-2">
                    Status
                    <SortIcon column="status" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((record) => {
                const statusConfig = getStatusConfig(record.status);

                return (
                  <tr
                    key={record.id}
                    onClick={() => handleRowClick(record)}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                    record.status === 'absent' ? 'bg-red-50/30 hover:bg-red-50' :
                    record.status === 'mismatched' ? 'bg-orange-50/30 hover:bg-orange-50' :
                    'hover:bg-gray-50'}`
                    }>

                    {/* Employee ID */}
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono text-gray-600">{record.employeeId}</span>
                    </td>

                    {/* Employee Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                          {record.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{record.name}</p>
                          <p className="text-xs text-gray-500">{record.designation}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{record.department}</span>
                    </td>

                    {/* Shift Name */}
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm text-gray-900">{record.shift}</p>
                        <p className="text-xs text-gray-500">
                          {record.shiftStartTime} - {record.shiftEndTime}
                        </p>
                      </div>
                    </td>

                    {/* First In-Time */}
                    <td className="py-3 px-4 text-center">
                      {record.firstInTime ?
                      <span className={`text-sm font-medium ${record.isLate ? 'text-red-600' : 'text-gray-900'}`}>
                          {record.firstInTime}
                          {record.isLate &&
                        <span className="ml-1 text-xs text-red-500">(Late)</span>
                        }
                        </span> :

                      <span className="text-sm text-gray-400">--:--</span>
                      }
                    </td>

                    {/* Last Out-Time */}
                    <td className="py-3 px-4 text-center">
                      {record.lastOutTime ?
                      <span className={`text-sm font-medium ${record.earlyLeave ? 'text-orange-600' : 'text-gray-900'}`}>
                          {record.lastOutTime}
                          {record.earlyLeave &&
                        <span className="ml-1 text-xs text-orange-500">(Early)</span>
                        }
                        </span> :

                      <span className="text-sm text-gray-400">--:--</span>
                      }
                    </td>

                    {/* Total Hours */}
                    <td className="py-3 px-4 text-center">
                      {record.totalHoursWorked ?
                      <span className={`text-sm font-semibold ${
                      record.totalHoursWorked >= 8 ? 'text-green-600' :
                      record.totalHoursWorked >= 6 ? 'text-amber-600' : 'text-red-600'}`
                      }>
                          {record.totalHoursWorked.toFixed(1)} hrs
                        </span> :

                      <span className="text-sm text-gray-400">--</span>
                      }
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {sortedData.length} of {mockAttendance.length} records
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Present</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">Mismatched</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-gray-600">Half Day</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Punch History Drawer */}
      {showDrawer && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex justify-end">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowDrawer(false)} />

          <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Punch History</h2>
                <button
                onClick={() => setShowDrawer(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-colors">

                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.employeeId} • {selectedEmployee.designation}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department}</p>
                </div>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]">
              {/* Date & Shift Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {selectedEmployee.shift} ({selectedEmployee.shiftStartTime} - {selectedEmployee.shiftEndTime})
                  </span>
                </div>
              </div>

              {/* Status Summary */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <LogIn className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">First In</span>
                  </div>
                  <p className={`text-lg font-bold ${selectedEmployee.isLate ? 'text-red-600' : 'text-green-700'}`}>
                    {selectedEmployee.firstInTime || '--:--'}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <LogOut className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Last Out</span>
                  </div>
                  <p className={`text-lg font-bold ${selectedEmployee.earlyLeave ? 'text-orange-600' : 'text-blue-700'}`}>
                    {selectedEmployee.lastOutTime || '--:--'}
                  </p>
                </div>
              </div>

              {/* Punch Timeline */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Punch Timeline</h4>
                
                {selectedEmployee.punchHistory.length > 0 ?
              <div className="space-y-4">
                    {selectedEmployee.punchHistory.map((punch, index) =>
                <div
                  key={punch.id}
                  className={`relative flex items-start gap-4 p-4 rounded-lg border ${
                  punch.type === 'in' ?
                  'bg-green-50 border-green-200' :
                  'bg-red-50 border-red-200'}`
                  }>

                        {/* Timeline connector */}
                        {index < selectedEmployee.punchHistory.length - 1 &&
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300" />
                  }
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  punch.type === 'in' ? 'bg-green-500' : 'bg-red-500'}`
                  }>
                          {punch.type === 'in' ?
                    <LogIn className="w-5 h-5 text-white" /> :

                    <LogOut className="w-5 h-5 text-white" />
                    }
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-semibold ${
                      punch.type === 'in' ? 'text-green-700' : 'text-red-700'}`
                      }>
                              {punch.type === 'in' ? 'Punch In' : 'Punch Out'}
                            </span>
                            <span className="text-lg font-bold text-gray-900">{punch.time}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{punch.device}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              <span>{punch.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {getPunchMethodIcon(punch.method)}
                              <span className="capitalize">{punch.method}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                )}
                  </div> :

              <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No punch records found</p>
                    <p className="text-sm text-gray-400">Employee did not punch in today</p>
                  </div>
              }
              </div>

              {/* Summary Stats */}
              {selectedEmployee.totalHoursWorked &&
            <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-600 font-medium">Total Hours Worked</p>
                      <p className="text-2xl font-bold text-indigo-700">
                        {selectedEmployee.totalHoursWorked.toFixed(2)} hours
                      </p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                getStatusConfig(selectedEmployee.status).bgColor} ${
                getStatusConfig(selectedEmployee.status).textColor}`}>
                      {getStatusConfig(selectedEmployee.status).label}
                    </div>
                  </div>
                </div>
            }

              {/* Warnings */}
              {(selectedEmployee.isLate || selectedEmployee.earlyLeave || selectedEmployee.status === 'mismatched') &&
            <div className="mt-4 space-y-2">
                  {selectedEmployee.isLate &&
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700">Late arrival - Punched in after shift start time</span>
                    </div>
              }
                  {selectedEmployee.earlyLeave &&
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-700">Early departure - Left before shift end time</span>
                    </div>
              }
                  {selectedEmployee.status === 'mismatched' &&
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-700">Mismatched punch - Missing corresponding in/out punch</span>
                    </div>
              }
                </div>
            }
            </div>

            {/* Drawer Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDrawer(false)}>
                  Close
                </Button>
                <Button variant="primary" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}