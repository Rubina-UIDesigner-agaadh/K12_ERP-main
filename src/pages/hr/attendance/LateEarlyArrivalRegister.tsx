import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  ChevronRight,
  Home,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Printer,
  FileSpreadsheet,
  Filter,
  Calendar,
  Users,
  User,
  TrendingUp,
  TrendingDown,
  Timer,
  Shield,
  ShieldCheck,
  ShieldX,
  Search,
  X,
  Check,
  Info,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Ban,
  Zap,
  ClipboardCheck,
  History,
  Eye,
  MessageSquare } from
'lucide-react';
interface LateArrivalRecord {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  avatar: string;
  department: string;
  designation: string;
  shiftStartTime: string;
  actualArrivalTime: string;
  lateDurationMinutes: number;
  penaltyStatus: 'pending' | 'applied' | 'waived' | 'warning';
  penaltyAmount: number | null;
  reason: string | null;
  waivedBy: string | null;
  waivedDate: string | null;
  waiveReason: string | null;
  occurrenceThisMonth: number;
  isEarlyArrival: boolean;
  earlyByMinutes: number;
}
interface WaiveModalData {
  isOpen: boolean;
  record: LateArrivalRecord | null;
}
const departments = [
{
  value: 'all',
  label: 'All Departments'
},
{
  value: 'mathematics',
  label: 'Mathematics'
},
{
  value: 'science',
  label: 'Science'
},
{
  value: 'english',
  label: 'English'
},
{
  value: 'social_studies',
  label: 'Social Studies'
},
{
  value: 'computer_science',
  label: 'Computer Science'
},
{
  value: 'administration',
  label: 'Administration'
},
{
  value: 'finance',
  label: 'Finance'
},
{
  value: 'hr',
  label: 'Human Resources'
},
{
  value: 'transport',
  label: 'Transport'
}];

const generateMockData = (): LateArrivalRecord[] => {
  const employees = [
  {
    id: 'EMP001',
    name: 'Dr. Rajesh Kumar',
    avatar: 'RK',
    department: 'mathematics',
    designation: 'Senior Teacher'
  },
  {
    id: 'EMP002',
    name: 'Mrs. Priya Sharma',
    avatar: 'PS',
    department: 'science',
    designation: 'Teacher'
  },
  {
    id: 'EMP003',
    name: 'Mr. Amit Patel',
    avatar: 'AP',
    department: 'science',
    designation: 'HOD'
  },
  {
    id: 'EMP004',
    name: 'Ms. Sneha Reddy',
    avatar: 'SR',
    department: 'english',
    designation: 'Teacher'
  },
  {
    id: 'EMP005',
    name: 'Dr. Vikram Singh',
    avatar: 'VS',
    department: 'science',
    designation: 'Senior Teacher'
  },
  {
    id: 'EMP006',
    name: 'Mrs. Kavita Iyer',
    avatar: 'KI',
    department: 'social_studies',
    designation: 'Teacher'
  },
  {
    id: 'EMP007',
    name: 'Mr. Sanjay Gupta',
    avatar: 'SG',
    department: 'computer_science',
    designation: 'Teacher'
  },
  {
    id: 'EMP008',
    name: 'Ms. Meera Nair',
    avatar: 'MN',
    department: 'mathematics',
    designation: 'Assistant Teacher'
  },
  {
    id: 'EMP009',
    name: 'Dr. Arun Verma',
    avatar: 'AV',
    department: 'science',
    designation: 'Senior Teacher'
  },
  {
    id: 'EMP010',
    name: 'Mrs. Lakshmi Menon',
    avatar: 'LM',
    department: 'english',
    designation: 'Teacher'
  },
  {
    id: 'EMP011',
    name: 'Mr. Suresh Pillai',
    avatar: 'SP',
    department: 'administration',
    designation: 'Admin Officer'
  },
  {
    id: 'EMP012',
    name: 'Mrs. Geeta Krishnan',
    avatar: 'GK',
    department: 'finance',
    designation: 'Accountant'
  }];

  const shiftTimes = ['08:00', '08:30', '09:00', '09:30'];
  const penaltyStatuses: LateArrivalRecord['penaltyStatus'][] = [
  'pending',
  'applied',
  'waived',
  'warning'];

  const reasons = [
  'Traffic congestion',
  'Vehicle breakdown',
  'Medical appointment',
  'Family emergency',
  'Public transport delay',
  'Weather conditions',
  null];

  const records: LateArrivalRecord[] = [];
  // Generate records for the last 30 days
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    // Random number of late arrivals per day (2-5)
    const lateCount = Math.floor(Math.random() * 4) + 2;
    const selectedEmployees = [...employees].
    sort(() => Math.random() - 0.5).
    slice(0, lateCount);
    selectedEmployees.forEach((emp, index) => {
      const shiftStart =
      shiftTimes[Math.floor(Math.random() * shiftTimes.length)];
      const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
      // Random late duration (5 to 120 minutes)
      const lateDuration = Math.floor(Math.random() * 116) + 5;
      const arrivalHour = shiftHour + Math.floor((shiftMin + lateDuration) / 60);
      const arrivalMin = (shiftMin + lateDuration) % 60;
      const actualArrival = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
      const status =
      penaltyStatuses[Math.floor(Math.random() * penaltyStatuses.length)];
      records.push({
        id: `LAT${Date.now()}${index}${dayOffset}`,
        date: dateStr,
        employeeId: emp.id,
        employeeName: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        designation: emp.designation,
        shiftStartTime: shiftStart,
        actualArrivalTime: actualArrival,
        lateDurationMinutes: lateDuration,
        penaltyStatus: status,
        penaltyAmount:
        status === 'applied' ? Math.floor(lateDuration / 15) * 50 : null,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        waivedBy: status === 'waived' ? 'HR Manager' : null,
        waivedDate: status === 'waived' ? dateStr : null,
        waiveReason: status === 'waived' ? 'Approved medical emergency' : null,
        occurrenceThisMonth: Math.floor(Math.random() * 5) + 1,
        isEarlyArrival: false,
        earlyByMinutes: 0
      });
    });
    // Add some early arrivals
    const earlyCount = Math.floor(Math.random() * 2);
    const earlyEmployees = [...employees].
    sort(() => Math.random() - 0.5).
    slice(0, earlyCount);
    earlyEmployees.forEach((emp, index) => {
      const shiftStart =
      shiftTimes[Math.floor(Math.random() * shiftTimes.length)];
      const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
      // Random early duration (10 to 45 minutes)
      const earlyDuration = Math.floor(Math.random() * 36) + 10;
      let arrivalHour = shiftHour;
      let arrivalMin = shiftMin - earlyDuration;
      if (arrivalMin < 0) {
        arrivalHour -= 1;
        arrivalMin += 60;
      }
      const actualArrival = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMin.toString().padStart(2, '0')}`;
      records.push({
        id: `EAR${Date.now()}${index}${dayOffset}`,
        date: dateStr,
        employeeId: emp.id,
        employeeName: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        designation: emp.designation,
        shiftStartTime: shiftStart,
        actualArrivalTime: actualArrival,
        lateDurationMinutes: 0,
        penaltyStatus: 'waived',
        penaltyAmount: null,
        reason: null,
        waivedBy: null,
        waivedDate: null,
        waiveReason: null,
        occurrenceThisMonth: 0,
        isEarlyArrival: true,
        earlyByMinutes: earlyDuration
      });
    });
  }
  return records.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
const mockData = generateMockData();
type SortColumn =
'date' |
'employeeName' |
'lateDurationMinutes' |
'penaltyStatus';
type SortDirection = 'asc' | 'desc';
const getPenaltyStatusConfig = (status: LateArrivalRecord['penaltyStatus']) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        icon: <Clock className="w-3 h-3" />
      };
    case 'applied':
      return {
        label: 'Applied',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        icon: <ShieldX className="w-3 h-3" />
      };
    case 'waived':
      return {
        label: 'Waived',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        icon: <ShieldCheck className="w-3 h-3" />
      };
    case 'warning':
      return {
        label: 'Warning',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        icon: <AlertTriangle className="w-3 h-3" />
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
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
  }
  return `${mins} mins`;
};
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
};
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
export function LateEarlyArrivalRegister() {
  const today = new Date().toISOString().split('T')[0];
  const [dateFrom, setDateFrom] = useState(today);
  const [dateTo, setDateTo] = useState(today);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [lateByMinutes, setLateByMinutes] = useState(15);
  const [showEarlyArrivals, setShowEarlyArrivals] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [waiveModal, setWaiveModal] = useState<WaiveModalData>({
    isOpen: false,
    record: null
  });
  const [waiveReason, setWaiveReason] = useState('');
  const [viewDetailsModal, setViewDetailsModal] = useState<{
    isOpen: boolean;
    record: LateArrivalRecord | null;
  }>({
    isOpen: false,
    record: null
  });
  const [records, setRecords] = useState<LateArrivalRecord[]>(mockData);
  const filteredData = useMemo(() => {
    return records.filter((record) => {
      // Date range filter
      if (record.date < dateFrom || record.date > dateTo) return false;
      // Department filter
      if (departmentFilter !== 'all' && record.department !== departmentFilter)
      return false;
      // Late by minutes filter
      if (!showEarlyArrivals) {
        if (record.isEarlyArrival) return false;
        if (record.lateDurationMinutes < lateByMinutes) return false;
      } else {
        // Show only early arrivals
        if (!record.isEarlyArrival) return false;
      }
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
        !record.employeeName.toLowerCase().includes(query) &&
        !record.employeeId.toLowerCase().includes(query) &&
        !record.department.toLowerCase().includes(query))
        {
          return false;
        }
      }
      return true;
    });
  }, [
  records,
  dateFrom,
  dateTo,
  departmentFilter,
  lateByMinutes,
  showEarlyArrivals,
  searchQuery]
  );
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'employeeName':
          comparison = a.employeeName.localeCompare(b.employeeName);
          break;
        case 'lateDurationMinutes':
          comparison = a.lateDurationMinutes - b.lateDurationMinutes;
          break;
        case 'penaltyStatus':
          const statusOrder = {
            pending: 0,
            warning: 1,
            applied: 2,
            waived: 3
          };
          comparison =
          statusOrder[a.penaltyStatus] - statusOrder[b.penaltyStatus];
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  const handleWaivePenalty = (record: LateArrivalRecord) => {
    setWaiveModal({
      isOpen: true,
      record
    });
    setWaiveReason('');
  };
  const confirmWaive = () => {
    if (waiveModal.record && waiveReason) {
      setRecords(
        records.map((r) =>
        r.id === waiveModal.record!.id ?
        {
          ...r,
          penaltyStatus: 'waived' as const,
          waivedBy: 'Current Admin',
          waivedDate: new Date().toISOString().split('T')[0],
          waiveReason: waiveReason,
          penaltyAmount: null
        } :
        r
        )
      );
      setWaiveModal({
        isOpen: false,
        record: null
      });
      setWaiveReason('');
    }
  };
  const stats = useMemo(() => {
    const lateRecords = records.filter(
      (r) => !r.isEarlyArrival && r.date >= dateFrom && r.date <= dateTo
    );
    const totalLate = lateRecords.length;
    const pending = lateRecords.filter(
      (r) => r.penaltyStatus === 'pending'
    ).length;
    const applied = lateRecords.filter(
      (r) => r.penaltyStatus === 'applied'
    ).length;
    const waived = lateRecords.filter(
      (r) => r.penaltyStatus === 'waived'
    ).length;
    const warning = lateRecords.filter(
      (r) => r.penaltyStatus === 'warning'
    ).length;
    const avgLateMins =
    totalLate > 0 ?
    lateRecords.reduce((sum, r) => sum + r.lateDurationMinutes, 0) /
    totalLate :
    0;
    const severelyLate = lateRecords.filter(
      (r) => r.lateDurationMinutes > 60
    ).length;
    const uniqueEmployees = new Set(lateRecords.map((r) => r.employeeId)).size;
    return {
      totalLate,
      pending,
      applied,
      waived,
      warning,
      avgLateMins,
      severelyLate,
      uniqueEmployees
    };
  }, [records, dateFrom, dateTo]);
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
        <span className="text-gray-900 font-medium">
          Late / Early Arrival Register
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Late / Early Arrival Register
          </h1>
          <p className="text-sm text-gray-500">
            Track and manage employee punctuality records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.totalLate}
              </p>
              <p className="text-xs text-gray-500">Total Late</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <ShieldX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">{stats.applied}</p>
              <p className="text-xs text-gray-500">Applied</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{stats.waived}</p>
              <p className="text-xs text-gray-500">Waived</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-orange-600">
                {stats.warning}
              </p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.avgLateMins.toFixed(0)}m
              </p>
              <p className="text-xs text-gray-500">Avg Late</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-red-600">
                {stats.severelyLate}
              </p>
              <p className="text-xs text-gray-500">&gt; 60 mins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">
                {stats.uniqueEmployees}
              </p>
              <p className="text-xs text-gray-500">Employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <Card title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <Select
            label="Department"
            options={departments}
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Late By &gt; (Minutes)
            </label>
            <input
              type="number"
              value={lateByMinutes}
              onChange={(e) => setLateByMinutes(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={showEarlyArrivals} />

          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors w-full justify-center">
              <input
                type="checkbox"
                checked={showEarlyArrivals}
                onChange={(e) => setShowEarlyArrivals(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded" />

              <span className="text-sm font-medium text-gray-700">
                Early Arrivals
              </span>
            </label>
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setDateFrom(today);
                setDateTo(today);
                setDepartmentFilter('all');
                setLateByMinutes(15);
                setShowEarlyArrivals(false);
                setSearchQuery('');
              }}
              className="w-full">

              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                <X className="w-4 h-4" />
              </button>
            }
          </div>
        </div>
      </Card>

      {/* Data Table */}
      <Card
        title={
        showEarlyArrivals ? 'Early Arrival Records' : 'Late Arrival Records'
        }>

        {/* Info Banner */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <Info className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            {showEarlyArrivals ?
            'Showing employees who arrived before their shift start time' :
            `Showing employees who arrived more than ${lateByMinutes} minutes late. Red background indicates severely late (>60 mins).`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}>

                  <div className="flex items-center gap-2">
                    Date
                    <SortIcon column="date" />
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('employeeName')}>

                  <div className="flex items-center gap-2">
                    Employee Name
                    <SortIcon column="employeeName" />
                  </div>
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Shift Start Time
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                  Actual Arrival Time
                </th>
                <th
                  className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lateDurationMinutes')}>

                  <div className="flex items-center justify-center gap-2">
                    {showEarlyArrivals ? 'Early By' : 'Late Duration'}
                    <SortIcon column="lateDurationMinutes" />
                  </div>
                </th>
                {!showEarlyArrivals &&
                <>
                    <th
                    className="text-center py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('penaltyStatus')}>

                      <div className="flex items-center justify-center gap-2">
                        Penalty Status
                        <SortIcon column="penaltyStatus" />
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </>
                }
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ?
              paginatedData.map((record) => {
                const statusConfig = getPenaltyStatusConfig(
                  record.penaltyStatus
                );
                const isSeverelyLate =
                !record.isEarlyArrival && record.lateDurationMinutes > 60;
                return (
                  <tr
                    key={record.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${isSeverelyLate ? 'bg-red-50' : ''}`}>

                      {/* Date */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {formatDate(record.date)}
                          </span>
                        </div>
                      </td>

                      {/* Employee Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                            {record.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {record.employeeName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {record.employeeId} • {record.designation}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Shift Start Time */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-600">
                          {formatTime(record.shiftStartTime)}
                        </span>
                      </td>

                      {/* Actual Arrival Time - BOLD */}
                      <td className="py-3 px-4 text-center">
                        <span
                        className={`text-sm font-bold ${record.isEarlyArrival ? 'text-green-700' : 'text-gray-900'}`}>

                          {formatTime(record.actualArrivalTime)}
                        </span>
                      </td>

                      {/* Late Duration - RED BACKGROUND if > 60 mins */}
                      <td className="py-3 px-4 text-center">
                        {record.isEarlyArrival ?
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                            <TrendingUp className="w-3 h-3" />
                            {formatDuration(record.earlyByMinutes)}
                          </span> :

                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${record.lateDurationMinutes > 60 ? 'bg-red-500 text-white' : record.lateDurationMinutes > 30 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>

                            <Clock className="w-3 h-3" />
                            {formatDuration(record.lateDurationMinutes)}
                          </span>
                      }
                      </td>

                      {/* Penalty Status */}
                      {!showEarlyArrivals &&
                    <td className="py-3 px-4 text-center">
                          <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>

                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                          {record.penaltyAmount &&
                      <p className="text-xs text-red-600 mt-1">
                              ₹{record.penaltyAmount}
                            </p>
                      }
                        </td>
                    }

                      {/* Actions */}
                      {!showEarlyArrivals &&
                    <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                          onClick={() =>
                          setViewDetailsModal({
                            isOpen: true,
                            record
                          })
                          }
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details">

                              <Eye className="w-4 h-4" />
                            </button>
                            {record.penaltyStatus !== 'waived' &&
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWaivePenalty(record)}>

                                <ShieldCheck className="w-4 h-4 mr-1" />
                                Waive Penalty
                              </Button>
                        }
                          </div>
                        </td>
                    }
                    </tr>);

              }) :

              <tr>
                  <td
                  colSpan={showEarlyArrivals ? 5 : 7}
                  className="py-12 text-center">

                    <div className="flex flex-col items-center text-gray-400">
                      <Clock className="w-12 h-12 mb-3" />
                      <p className="text-lg font-medium text-gray-500">
                        No records found
                      </p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedData.length > 0 &&
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
                {sortedData.length} records
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Rows per page:</span>
                <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm">

                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">

                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        }

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200 text-sm">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
              15-30 mins
            </span>
            <span className="text-gray-500">Minor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
              30-60 mins
            </span>
            <span className="text-gray-500">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">
              &gt; 60 mins
            </span>
            <span className="text-gray-500">Severe</span>
          </div>
        </div>
      </Card>

      {/* Waive Penalty Modal */}
      {waiveModal.isOpen && waiveModal.record &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() =>
          setWaiveModal({
            isOpen: false,
            record: null
          })
          } />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Waive Penalty
                  </h2>
                  <p className="text-sm text-gray-500">
                    {waiveModal.record.employeeName}
                  </p>
                </div>
              </div>
              <button
              onClick={() =>
              setWaiveModal({
                isOpen: false,
                record: null
              })
              }
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Record Info */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(waiveModal.record.date)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Late Duration:</span>
                  <span className="font-medium text-red-600">
                    {formatDuration(waiveModal.record.lateDurationMinutes)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Penalty Amount:</span>
                  <span className="font-medium text-gray-900">
                    {waiveModal.record.penaltyAmount ?
                  `₹${waiveModal.record.penaltyAmount}` :
                  'Not Applied'}
                  </span>
                </div>
                {waiveModal.record.reason &&
              <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Employee Reason:</span>
                    <span className="font-medium text-gray-900">
                      {waiveModal.record.reason}
                    </span>
                  </div>
              }
              </div>

              {/* Waive Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Waiving <span className="text-red-500">*</span>
                </label>
                <textarea
                value={waiveReason}
                onChange={(e) => setWaiveReason(e.target.value)}
                placeholder="Enter reason for waiving the penalty..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

              </div>

              {/* Warning */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  This action will remove any penalty applied to this record.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button
              variant="outline"
              onClick={() =>
              setWaiveModal({
                isOpen: false,
                record: null
              })
              }>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={confirmWaive}
              disabled={!waiveReason}>

                <Check className="w-4 h-4 mr-2" />
                Confirm Waive
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {viewDetailsModal.isOpen && viewDetailsModal.record &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() =>
          setViewDetailsModal({
            isOpen: false,
            record: null
          })
          } />

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
                  {viewDetailsModal.record.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {viewDetailsModal.record.employeeName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {viewDetailsModal.record.employeeId} •{' '}
                    {viewDetailsModal.record.designation}
                  </p>
                </div>
              </div>
              <button
              onClick={() =>
              setViewDetailsModal({
                isOpen: false,
                record: null
              })
              }
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Date & Time Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(viewDetailsModal.record.date)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="text-sm font-semibold text-gray-900 capitalize">
                    {viewDetailsModal.record.department.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Shift Start Time</p>
                  <p className="text-sm font-semibold text-blue-900">
                    {formatTime(viewDetailsModal.record.shiftStartTime)}
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 mb-1">Actual Arrival</p>
                  <p className="text-sm font-bold text-red-900">
                    {formatTime(viewDetailsModal.record.actualArrivalTime)}
                  </p>
                </div>
              </div>

              {/* Late Duration */}
              <div
              className={`p-4 rounded-lg text-center ${viewDetailsModal.record.lateDurationMinutes > 60 ? 'bg-red-100 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>

                <p className="text-sm text-gray-600 mb-1">Late Duration</p>
                <p
                className={`text-2xl font-bold ${viewDetailsModal.record.lateDurationMinutes > 60 ? 'text-red-700' : 'text-amber-700'}`}>

                  {formatDuration(viewDetailsModal.record.lateDurationMinutes)}
                </p>
              </div>

              {/* Penalty Info */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Penalty Status:</span>
                  <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getPenaltyStatusConfig(viewDetailsModal.record.penaltyStatus).bgColor} ${getPenaltyStatusConfig(viewDetailsModal.record.penaltyStatus).textColor}`}>

                    {
                  getPenaltyStatusConfig(
                    viewDetailsModal.record.penaltyStatus
                  ).icon
                  }
                    {
                  getPenaltyStatusConfig(
                    viewDetailsModal.record.penaltyStatus
                  ).label
                  }
                  </span>
                </div>
                {viewDetailsModal.record.penaltyAmount &&
              <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Penalty Amount:
                    </span>
                    <span className="text-sm font-semibold text-red-600">
                      ₹{viewDetailsModal.record.penaltyAmount}
                    </span>
                  </div>
              }
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Occurrence This Month:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {viewDetailsModal.record.occurrenceThisMonth} time(s)
                  </span>
                </div>
              </div>

              {/* Reason */}
              {viewDetailsModal.record.reason &&
            <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">
                    Employee's Reason
                  </p>
                  <p className="text-sm text-blue-900">
                    {viewDetailsModal.record.reason}
                  </p>
                </div>
            }

              {/* Waive Info */}
              {viewDetailsModal.record.penaltyStatus === 'waived' &&
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 mb-2 font-medium">
                    Penalty Waived
                  </p>
                  <div className="space-y-1 text-sm text-green-800">
                    <p>
                      <span className="text-green-600">By:</span>{' '}
                      {viewDetailsModal.record.waivedBy}
                    </p>
                    {viewDetailsModal.record.waivedDate &&
                <p>
                        <span className="text-green-600">Date:</span>{' '}
                        {formatDate(viewDetailsModal.record.waivedDate)}
                      </p>
                }
                    {viewDetailsModal.record.waiveReason &&
                <p>
                        <span className="text-green-600">Reason:</span>{' '}
                        {viewDetailsModal.record.waiveReason}
                      </p>
                }
                  </div>
                </div>
            }
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button
              variant="outline"
              onClick={() =>
              setViewDetailsModal({
                isOpen: false,
                record: null
              })
              }>

                Close
              </Button>
              {viewDetailsModal.record.penaltyStatus !== 'waived' &&
            <Button
              variant="primary"
              onClick={() => {
                handleWaivePenalty(viewDetailsModal.record!);
                setViewDetailsModal({
                  isOpen: false,
                  record: null
                });
              }}>

                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Waive Penalty
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* Top Late Comers Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frequent Late Comers */}
        <Card title="Frequent Late Arrivals (This Month)">
          <div className="space-y-3">
            {(() => {
              const employeeLateCount = records.
              filter((r) => !r.isEarlyArrival).
              reduce(
                (acc, r) => {
                  acc[r.employeeId] = acc[r.employeeId] || {
                    ...r,
                    count: 0,
                    totalMins: 0
                  };
                  acc[r.employeeId].count++;
                  acc[r.employeeId].totalMins += r.lateDurationMinutes;
                  return acc;
                },
                {} as Record<
                  string,
                  LateArrivalRecord & {
                    count: number;
                    totalMins: number;
                  }>

              );
              return Object.values(employeeLateCount).
              sort((a, b) => b.count - a.count).
              slice(0, 5).
              map((emp, index) =>
              <div
                key={emp.employeeId}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">

                    <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-red-100 text-red-700' : index === 1 ? 'bg-orange-100 text-orange-700' : index === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>

                      {index + 1}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                      {emp.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {emp.employeeName}
                      </p>
                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        {emp.count}
                      </p>
                      <p className="text-xs text-gray-500">times late</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-700">
                        {Math.round(emp.totalMins / emp.count)}m
                      </p>
                      <p className="text-xs text-gray-500">avg</p>
                    </div>
                  </div>
              );
            })()}
          </div>
        </Card>

        {/* Late Arrival Trends */}
        <Card title="Daily Late Arrival Trend">
          <div className="space-y-3">
            {(() => {
              const last7Days = [];
              for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                  last7Days.push(date.toISOString().split('T')[0]);
                }
              }
              const maxCount = Math.max(
                ...last7Days.map(
                  (d) =>
                  records.filter((r) => r.date === d && !r.isEarlyArrival).
                  length
                ),
                1
              );
              return last7Days.map((dateStr) => {
                const dayRecords = records.filter(
                  (r) => r.date === dateStr && !r.isEarlyArrival
                );
                const count = dayRecords.length;
                const percentage = count / maxCount * 100;
                return (
                  <div key={dateStr} className="flex items-center gap-4">
                    <span className="w-16 text-xs text-gray-600">
                      {new Date(dateStr).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${count > 5 ? 'bg-red-500' : count > 3 ? 'bg-orange-500' : 'bg-green-500'}`}
                        style={{
                          width: `${percentage}%`
                        }} />

                    </div>
                    <span className="w-12 text-sm font-semibold text-gray-700 text-right">
                      {count}
                    </span>
                  </div>);

              });
            })()}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">≤ 3 (Low)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600">4-5 (Medium)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">&gt; 5 (High)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}