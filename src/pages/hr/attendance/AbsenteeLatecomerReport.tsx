import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  Eye,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Users,
  Building,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Award,
  Target,
  Mail,
  Send,
  MessageSquare,
  UserX,
  UserMinus,
  TimerOff,
  CalendarX,
  CalendarOff,
  Frown,
  ThumbsDown,
  Flag,
  Bell,
  BellRing,
  Zap,
  Shield,
  MoreHorizontal,
  Loader,
  Settings,
  CheckSquare,
  Square,
  Bookmark,
  Share2,
  Copy,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Minus,
  Hash,
  Percent,
  Timer,
  LogIn,
  LogOut,
  MapPin,
  Smartphone,
  Fingerprint,
  Camera,
  Wifi,
  Edit,
  Trash2,
  History,
  Phone } from
'lucide-react';

export function AbsenteeLatecomerReport() {
  const [selectedDateFrom, setSelectedDateFrom] = useState('2024-01-01');
  const [selectedDateTo, setSelectedDateTo] = useState('2024-01-31');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [reportType, setReportType] = useState('both'); // absent, late, both
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const departments = [
  { id: 'DEPT001', name: 'Engineering', employees: 45, manager: 'James Taylor', email: 'james.taylor@company.com' },
  { id: 'DEPT002', name: 'Human Resources', employees: 8, manager: 'Jane Smith', email: 'jane.smith@company.com' },
  { id: 'DEPT003', name: 'Finance', employees: 12, manager: 'Robert Johnson', email: 'robert.johnson@company.com' },
  { id: 'DEPT004', name: 'Marketing', employees: 15, manager: 'Emily Davis', email: 'emily.davis@company.com' },
  { id: 'DEPT005', name: 'Operations', employees: 20, manager: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
  { id: 'DEPT006', name: 'Sales', employees: 25, manager: 'Michael Brown', email: 'michael.brown@company.com' },
  { id: 'DEPT007', name: 'IT Support', employees: 10, manager: 'David Lee', email: 'david.lee@company.com' }];


  const absenteeData = [
  {
    id: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    manager: 'James Taylor',
    photo: null,
    issues: [
    { date: '2024-01-15', type: 'absent', reason: 'Unauthorized absence', status: 'unexcused', notified: false },
    { date: '2024-01-22', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:45 AM', lateBy: 45, reason: 'Traffic', status: 'excused' },
    { date: '2024-01-25', type: 'late', scheduledTime: '09:00 AM', actualTime: '10:15 AM', lateBy: 75, reason: 'Not specified', status: 'unexcused' }],

    totalAbsent: 1,
    totalLate: 2,
    avgLateMinutes: 60,
    pattern: 'Recurring late arrivals on Mondays',
    riskLevel: 'high',
    previousWarnings: 2
  },
  {
    id: 'EMP002',
    name: 'Lisa Anderson',
    department: 'Sales',
    designation: 'Sales Executive',
    manager: 'Michael Brown',
    photo: null,
    issues: [
    { date: '2024-01-08', type: 'absent', reason: 'No call no show', status: 'unexcused', notified: false },
    { date: '2024-01-09', type: 'absent', reason: 'No call no show', status: 'unexcused', notified: false },
    { date: '2024-01-16', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:30 AM', lateBy: 30, reason: 'Personal emergency', status: 'excused' }],

    totalAbsent: 2,
    totalLate: 1,
    avgLateMinutes: 30,
    pattern: 'Consecutive absences without notice',
    riskLevel: 'critical',
    previousWarnings: 3
  },
  {
    id: 'EMP003',
    name: 'Robert Chen',
    department: 'IT Support',
    designation: 'IT Administrator',
    manager: 'David Lee',
    photo: null,
    issues: [
    { date: '2024-01-05', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:20 AM', lateBy: 20, reason: 'Public transport delay', status: 'excused' },
    { date: '2024-01-12', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:25 AM', lateBy: 25, reason: 'Traffic', status: 'excused' },
    { date: '2024-01-19', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:35 AM', lateBy: 35, reason: 'Not specified', status: 'unexcused' },
    { date: '2024-01-26', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:40 AM', lateBy: 40, reason: 'Weather', status: 'excused' }],

    totalAbsent: 0,
    totalLate: 4,
    avgLateMinutes: 30,
    pattern: 'Consistent late arrivals (weekly)',
    riskLevel: 'medium',
    previousWarnings: 1
  },
  {
    id: 'EMP004',
    name: 'Sarah Williams',
    department: 'Marketing',
    designation: 'Content Writer',
    manager: 'Emily Davis',
    photo: null,
    issues: [
    { date: '2024-01-03', type: 'absent', reason: 'Sick - no medical certificate', status: 'unexcused', notified: true },
    { date: '2024-01-17', type: 'absent', reason: 'Personal leave - unapproved', status: 'unexcused', notified: true },
    { date: '2024-01-24', type: 'late', scheduledTime: '09:00 AM', actualTime: '10:30 AM', lateBy: 90, reason: 'Car breakdown', status: 'excused' }],

    totalAbsent: 2,
    totalLate: 1,
    avgLateMinutes: 90,
    pattern: 'Frequent unexcused absences',
    riskLevel: 'high',
    previousWarnings: 2
  },
  {
    id: 'EMP005',
    name: 'Michael Park',
    department: 'Finance',
    designation: 'Financial Analyst',
    manager: 'Robert Johnson',
    photo: null,
    issues: [
    { date: '2024-01-10', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:15 AM', lateBy: 15, reason: 'Traffic', status: 'excused' }],

    totalAbsent: 0,
    totalLate: 1,
    avgLateMinutes: 15,
    pattern: 'Minor - isolated incident',
    riskLevel: 'low',
    previousWarnings: 0
  },
  {
    id: 'EMP006',
    name: 'Jennifer Adams',
    department: 'Operations',
    designation: 'Operations Coordinator',
    manager: 'Sarah Wilson',
    photo: null,
    issues: [
    { date: '2024-01-11', type: 'absent', reason: 'No show - unreachable', status: 'unexcused', notified: false },
    { date: '2024-01-18', type: 'late', scheduledTime: '08:00 AM', actualTime: '08:45 AM', lateBy: 45, reason: 'Overslept', status: 'unexcused' },
    { date: '2024-01-23', type: 'late', scheduledTime: '08:00 AM', actualTime: '09:00 AM', lateBy: 60, reason: 'Not specified', status: 'unexcused' },
    { date: '2024-01-30', type: 'absent', reason: 'Called in sick - no certificate', status: 'unexcused', notified: true }],

    totalAbsent: 2,
    totalLate: 2,
    avgLateMinutes: 52,
    pattern: 'Erratic attendance pattern',
    riskLevel: 'critical',
    previousWarnings: 4
  },
  {
    id: 'EMP007',
    name: 'David Kim',
    department: 'Engineering',
    designation: 'Developer',
    manager: 'James Taylor',
    photo: null,
    issues: [
    { date: '2024-01-29', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:50 AM', lateBy: 50, reason: 'Medical appointment ran late', status: 'excused' }],

    totalAbsent: 0,
    totalLate: 1,
    avgLateMinutes: 50,
    pattern: 'Minor - isolated incident',
    riskLevel: 'low',
    previousWarnings: 0
  },
  {
    id: 'EMP008',
    name: 'Emma Thompson',
    department: 'HR',
    designation: 'HR Coordinator',
    manager: 'Jane Smith',
    photo: null,
    issues: [
    { date: '2024-01-04', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:10 AM', lateBy: 10, reason: 'Traffic', status: 'excused' },
    { date: '2024-01-14', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:12 AM', lateBy: 12, reason: 'Parking issues', status: 'excused' }],

    totalAbsent: 0,
    totalLate: 2,
    avgLateMinutes: 11,
    pattern: 'Minor delays - within grace period consideration',
    riskLevel: 'low',
    previousWarnings: 0
  }];


  const toggleDepartment = (id) => {
    setSelectedDepartments((prev) =>
    prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleRowSelection = (id) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((e) => e.id));
    }
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3 h-3" />
            Critical
          </span>);

      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </span>);

      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Flag className="w-3 h-3" />
            Medium
          </span>);

      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Low
          </span>);

      default:
        return null;
    }
  };

  const filteredData = absenteeData.filter((emp) => {
    // Filter by department
    if (selectedDepartments.length > 0) {
      const dept = departments.find((d) => d.name === emp.department);
      if (!dept || !selectedDepartments.includes(dept.id)) return false;
    }

    // Filter by report type
    if (reportType === 'absent' && emp.totalAbsent === 0) return false;
    if (reportType === 'late' && emp.totalLate === 0) return false;

    return true;
  });

  const totalAbsences = filteredData.reduce((sum, emp) => sum + emp.totalAbsent, 0);
  const totalLateInstances = filteredData.reduce((sum, emp) => sum + emp.totalLate, 0);
  const criticalCount = filteredData.filter((emp) => emp.riskLevel === 'critical').length;
  const highRiskCount = filteredData.filter((emp) => emp.riskLevel === 'high').length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Absentee / Latecomer Report
          </h1>
          <p className="text-sm text-gray-500">
            Non-compliance report highlighting attendance issues and patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            Report History
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Alert Settings
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
            onClick={() => setShowEmailModal(true)}>

            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800">Attention Required</h3>
            <p className="text-sm text-red-700 mt-1">
              {criticalCount} critical and {highRiskCount} high-risk employees identified in the selected period. 
              Immediate action recommended.
            </p>
            <div className="flex gap-3 mt-3">
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                <BellRing className="w-4 h-4 mr-2" />
                Send Alerts to Managers
              </Button>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100">
                <FileText className="w-4 h-4 mr-2" />
                Generate Warning Letters
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-700">{criticalCount + highRiskCount}</p>
            <p className="text-xs text-red-600">Need Attention</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{totalAbsences}</p>
          <p className="text-xs text-red-600">Absences</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <TimerOff className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600 font-medium">Total</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{totalLateInstances}</p>
          <p className="text-xs text-orange-600">Late Arrivals</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-purple-600 font-medium">Affected</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{filteredData.length}</p>
          <p className="text-xs text-purple-600">Employees</p>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl border border-red-300">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-red-700" />
            <span className="text-xs text-red-700 font-medium">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{criticalCount}</p>
          <p className="text-xs text-red-700">Critical Cases</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">Status</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">68%</p>
          <p className="text-xs text-yellow-600">Unexcused</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">Avg</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">38m</p>
          <p className="text-xs text-blue-600">Late Duration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Date Range Filter */}
          <Card title="Date Range">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={selectedDateFrom}
                  onChange={(e) => setSelectedDateFrom(e.target.value)} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={selectedDateTo}
                  onChange={(e) => setSelectedDateTo(e.target.value)} />

              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">This Week</Button>
                <Button variant="outline" size="sm">Last Week</Button>
                <Button variant="outline" size="sm">This Month</Button>
                <Button variant="outline" size="sm">Last Month</Button>
              </div>
            </div>
          </Card>

          {/* Department Filter */}
          <Card title="Department Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Filter by department</span>
                <button
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => setSelectedDepartments(departments.map((d) => d.id))}>

                  Select All
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {departments.map((dept) =>
                <div
                  key={dept.id}
                  onClick={() => toggleDepartment(dept.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedDepartments.includes(dept.id) ?
                  'bg-blue-50 border-2 border-blue-500' :
                  'bg-gray-50 border border-gray-200 hover:border-gray-300'}`
                  }>

                    <div className="flex items-center gap-3">
                      <input
                      type="checkbox"
                      checked={selectedDepartments.includes(dept.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />

                      <Building className="w-4 h-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">{dept.employees} employees</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedDepartments([])}>

                Clear Selection
              </Button>
            </div>
          </Card>

          {/* Report Type Filter */}
          <Card title="Report Type">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">
                Select what to include in the report
              </p>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                reportType === 'absent' ?
                'bg-red-50 border-2 border-red-500' :
                'bg-gray-50 border border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setReportType('absent')}>

                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === 'absent'}
                  onChange={() => {}}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500" />

                <UserX className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Show Absent Only</p>
                  <p className="text-xs text-gray-500">Employees with absences</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                reportType === 'late' ?
                'bg-orange-50 border-2 border-orange-500' :
                'bg-gray-50 border border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setReportType('late')}>

                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === 'late'}
                  onChange={() => {}}
                  className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500" />

                <TimerOff className="w-5 h-5 text-orange-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Show Late Comers</p>
                  <p className="text-xs text-gray-500">Employees with late arrivals</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                reportType === 'both' ?
                'bg-purple-50 border-2 border-purple-500' :
                'bg-gray-50 border border-gray-200 hover:border-gray-300'}`
                }
                onClick={() => setReportType('both')}>

                <input
                  type="radio"
                  name="reportType"
                  checked={reportType === 'both'}
                  onChange={() => {}}
                  className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500" />

                <AlertTriangle className="w-5 h-5 text-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Both</p>
                  <p className="text-xs text-gray-500">All non-compliance issues</p>
                </div>
              </label>
            </div>
          </Card>

          {/* Additional Options */}
          <Card title="Additional Options">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Show unexcused only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Show repeat offenders only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked />
                <span className="text-sm text-gray-700">Include patterns analysis</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Group by department</span>
              </label>
            </div>
          </Card>
        </div>

        {/* Report Output Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Report Actions */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Non-Compliance Report
                </h3>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
                  {filteredData.length} employees
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Sort By
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>

            {selectedRows.length > 0 &&
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  <span className="font-semibold">{selectedRows.length}</span> employee(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Issue Warning
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-3 h-3 mr-1" />
                    Send Notice
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedRows([])}>
                    Clear
                  </Button>
                </div>
              </div>
            }

            {/* Preview Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={selectedRows.length === filteredData.length}
                          onChange={toggleSelectAll} />

                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-red-50 text-red-700">
                        Absences
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-orange-50 text-orange-700">
                        Late Arrivals
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Late
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pattern
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Level
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warnings
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((employee, index) =>
                    <React.Fragment key={employee.id}>
                        <tr
                        className={`hover:bg-gray-50 ${
                        selectedRows.includes(employee.id) ? 'bg-blue-50' :
                        employee.riskLevel === 'critical' ? 'bg-red-50/30' :
                        employee.riskLevel === 'high' ? 'bg-orange-50/30' :
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`
                        }>

                          <td className="px-3 py-3">
                            <input
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            checked={selectedRows.includes(employee.id)}
                            onChange={() => toggleRowSelection(employee.id)} />

                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            employee.riskLevel === 'critical' ? 'bg-red-100' :
                            employee.riskLevel === 'high' ? 'bg-orange-100' :
                            'bg-blue-100'}`
                            }>
                                <span className={`text-sm font-medium ${
                              employee.riskLevel === 'critical' ? 'text-red-700' :
                              employee.riskLevel === 'high' ? 'text-orange-700' :
                              'text-blue-700'}`
                              }>
                                  {employee.name.split(' ').map((n) => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                <p className="text-xs text-gray-500">{employee.id} • {employee.designation}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-700">{employee.department}</p>
                            <p className="text-xs text-gray-500">Mgr: {employee.manager}</p>
                          </td>
                          <td className="px-4 py-3 text-center bg-red-50/30">
                            {employee.totalAbsent > 0 ?
                          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-red-100 text-red-700">
                                {employee.totalAbsent}
                              </span> :

                          <span className="text-gray-400">—</span>
                          }
                          </td>
                          <td className="px-4 py-3 text-center bg-orange-50/30">
                            {employee.totalLate > 0 ?
                          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-orange-100 text-orange-700">
                                {employee.totalLate}
                              </span> :

                          <span className="text-gray-400">—</span>
                          }
                          </td>
                          <td className="px-4 py-3 text-center">
                            {employee.totalLate > 0 ?
                          <span className={`text-sm font-medium ${
                          employee.avgLateMinutes > 60 ? 'text-red-600' :
                          employee.avgLateMinutes > 30 ? 'text-orange-600' :
                          'text-yellow-600'}`
                          }>
                                {employee.avgLateMinutes}m
                              </span> :

                          <span className="text-gray-400">—</span>
                          }
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-700 max-w-xs truncate" title={employee.pattern}>
                              {employee.pattern}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {getRiskBadge(employee.riskLevel)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {employee.previousWarnings > 0 ?
                          <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${
                          employee.previousWarnings >= 3 ? 'bg-red-100 text-red-700' :
                          employee.previousWarnings >= 2 ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'}`
                          }>
                                {employee.previousWarnings}
                              </span> :

                          <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full bg-green-100 text-green-700">
                                0
                              </span>
                          }
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                              className="p-1.5 hover:bg-gray-200 rounded-lg"
                              onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}>

                                {expandedEmployee === employee.id ?
                              <ChevronUp className="w-4 h-4 text-gray-500" /> :

                              <ChevronDown className="w-4 h-4 text-gray-500" />
                              }
                              </button>
                              <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Send Warning">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="Contact Employee">
                                <Phone className="w-4 h-4 text-blue-500" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-200 rounded-lg" title="More Options">
                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedEmployee === employee.id &&
                      <tr>
                            <td colSpan="10" className="px-4 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    Detailed Issue Log for {employee.name}
                                  </h4>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                      <FileText className="w-3 h-3 mr-1" />
                                      View Full History
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Issue Warning
                                    </Button>
                                  </div>
                                </div>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Details</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Reason</th>
                                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {employee.issues.map((issue, idx) =>
                                  <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-sm text-gray-900">
                                            {issue.date}
                                          </td>
                                          <td className="px-4 py-2">
                                            {issue.type === 'absent' ?
                                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                                <UserX className="w-3 h-3" />
                                                Absent
                                              </span> :

                                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                                                <TimerOff className="w-3 h-3" />
                                                Late
                                              </span>
                                      }
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">
                                            {issue.type === 'late' ?
                                      <span>
                                                {issue.scheduledTime} → {issue.actualTime} 
                                                <span className="text-red-600 font-medium ml-1">({issue.lateBy}m late)</span>
                                              </span> :

                                      <span>Full day absence</span>
                                      }
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">{issue.reason}</td>
                                          <td className="px-4 py-2 text-center">
                                            {issue.status === 'excused' ?
                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                                                Excused
                                              </span> :

                                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                                Unexcused
                                              </span>
                                      }
                                          </td>
                                        </tr>
                                  )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                      }
                      </React.Fragment>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr className="font-semibold">
                      <td className="px-3 py-3"></td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        Total: {filteredData.length} Employees
                      </td>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-center bg-red-100">
                        <span className="text-lg font-bold text-red-700">{totalAbsences}</span>
                      </td>
                      <td className="px-4 py-3 text-center bg-orange-100">
                        <span className="text-lg font-bold text-orange-700">{totalLateInstances}</span>
                      </td>
                      <td colSpan="5" className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Card>

          {/* Export Actions */}
          <Card title="Export & Share">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export Excel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setShowEmailModal(true)}>

                <Mail className="w-4 h-4 mr-2" />
                Email Report
              </Button>
              <Button variant="outline">
                <Bookmark className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Email Report to Managers</h2>
                <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setShowEmailModal(false)}>

                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="space-y-2">
                  {departments.map((dept) =>
                <label key={dept.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dept.manager}</p>
                        <p className="text-xs text-gray-500">{dept.name} • {dept.email}</p>
                      </div>
                    </label>
                )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Recipients
                </label>
                <Input type="email" placeholder="Enter email addresses (comma separated)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <Input
                type="text"
                defaultValue={`Absentee/Latecomer Report - ${selectedDateFrom} to ${selectedDateTo}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add a custom message to the email..." />

              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                  <span className="text-sm text-gray-700">Attach PDF Report</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                  <span className="text-sm text-gray-700">Attach Excel Data</span>
                </label>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                    This report contains sensitive employee data. Ensure recipients are authorized to view this information.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setShowEmailModal(false);
                // Show success toast or notification
              }}>

                <Send className="w-4 h-4 mr-2" />
                Send Report
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}