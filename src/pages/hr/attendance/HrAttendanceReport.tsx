import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Search,
  Download,
  Printer,
  Mail,
  Eye,
  Save,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Users,
  Building,
  Clock,
  BarChart3,
  Activity,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Layers,
  Zap,
  Target,
  FileDown,
  Bookmark,
  History,
  Timer,
  Briefcase,
  Coffee,
  Percent,
  ChevronRight,
  PlayCircle,
  Loader,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MapPin,
  Hash,
  MoreHorizontal,
  Plus } from
'lucide-react';
// ============ TYPES ============
interface Branch {
  id: string;
  name: string;
  city: string;
  board: 'GSEB' | 'CBSE';
  color: string;
  bgColor: string;
}
interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  description: string;
  tags: string[];
  isNew?: boolean;
  isFavorite?: boolean;
  lastGenerated?: string;
  icon: React.ReactNode;
}
interface GeneratedReport {
  id: string;
  name: string;
  category: string;
  generatedAt: string;
  generatedBy: string;
  branches: string[];
  dateRange: string;
  format: 'PDF' | 'Excel' | 'CSV';
  fileSize: string;
  status: 'Completed' | 'Processing' | 'Failed';
}
// ============ DATA ============
const BRANCHES: Branch[] = [
{
  id: 'BR001',
  name: 'Main Campus',
  city: 'Ahmedabad',
  board: 'GSEB',
  color: 'text-teal-700',
  bgColor: 'bg-teal-100'
},
{
  id: 'BR002',
  name: 'North Branch',
  city: 'Gandhinagar',
  board: 'GSEB',
  color: 'text-blue-700',
  bgColor: 'bg-blue-100'
},
{
  id: 'BR003',
  name: 'South Branch',
  city: 'Surat',
  board: 'CBSE',
  color: 'text-purple-700',
  bgColor: 'bg-purple-100'
},
{
  id: 'BR004',
  name: 'East Branch',
  city: 'Vadodara',
  board: 'CBSE',
  color: 'text-orange-700',
  bgColor: 'bg-orange-100'
}];

const REPORT_TEMPLATES: ReportTemplate[] = [
// Daily
{
  id: 'RPT001',
  name: 'Daily Staff Attendance Register',
  category: 'Daily Attendance',
  categoryColor: 'bg-blue-100 text-blue-700',
  description: 'Complete daily attendance register with check-in/out times',
  tags: ['Daily', 'Register'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '2 hours ago',
  icon: <Calendar className="w-5 h-5" />
},
{
  id: 'RPT002',
  name: 'Present/Absent Staff List',
  category: 'Daily Attendance',
  categoryColor: 'bg-blue-100 text-blue-700',
  description: 'Quick list of present and absent staff for today',
  tags: ['Daily', 'Quick'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '1 day ago',
  icon: <Users className="w-5 h-5" />
},
{
  id: 'RPT003',
  name: 'Late Arrival Report (Daily)',
  category: 'Daily Attendance',
  categoryColor: 'bg-blue-100 text-blue-700',
  description: 'Staff who arrived after scheduled shift start',
  tags: ['Daily', 'Late'],
  isNew: true,
  isFavorite: false,
  lastGenerated: '3 days ago',
  icon: <Clock className="w-5 h-5" />
},
{
  id: 'RPT004',
  name: 'Branch-wise Daily Attendance',
  category: 'Daily Attendance',
  categoryColor: 'bg-blue-100 text-blue-700',
  description: 'Attendance breakdown per branch for the day',
  tags: ['Daily', 'Branch-wise'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '1 hour ago',
  icon: <Building className="w-5 h-5" />
},
// Monthly
{
  id: 'RPT005',
  name: 'Monthly Attendance Summary',
  category: 'Monthly Reports',
  categoryColor: 'bg-green-100 text-green-700',
  description: 'Comprehensive monthly attendance summary for all staff',
  tags: ['Monthly', 'Summary'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '1 week ago',
  icon: <BarChart3 className="w-5 h-5" />
},
{
  id: 'RPT006',
  name: 'Attendance Percentage Report',
  category: 'Monthly Reports',
  categoryColor: 'bg-green-100 text-green-700',
  description: 'Attendance percentage for each employee over the month',
  tags: ['Monthly', 'Percentage'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '2 weeks ago',
  icon: <Percent className="w-5 h-5" />
},
{
  id: 'RPT007',
  name: 'Monthly Attendance Trend',
  category: 'Monthly Reports',
  categoryColor: 'bg-green-100 text-green-700',
  description: 'Trend analysis of attendance over the month',
  tags: ['Monthly', 'Trend'],
  isNew: true,
  isFavorite: false,
  lastGenerated: '3 weeks ago',
  icon: <TrendingUp className="w-5 h-5" />
},
// Leave
{
  id: 'RPT008',
  name: 'Leave Summary Report',
  category: 'Leave & Absenteeism',
  categoryColor: 'bg-purple-100 text-purple-700',
  description: 'Summary of all leave types taken by staff',
  tags: ['Leave', 'Summary'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '5 days ago',
  icon: <Coffee className="w-5 h-5" />
},
{
  id: 'RPT009',
  name: 'Leave Balance Report',
  category: 'Leave & Absenteeism',
  categoryColor: 'bg-purple-100 text-purple-700',
  description: 'Current leave balance for all employees',
  tags: ['Leave', 'Balance'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '1 week ago',
  icon: <Target className="w-5 h-5" />
},
{
  id: 'RPT010',
  name: 'Frequent Absentee Report',
  category: 'Leave & Absenteeism',
  categoryColor: 'bg-purple-100 text-purple-700',
  description: 'Employees with frequent unplanned absences',
  tags: ['Absenteeism', 'Compliance'],
  isNew: true,
  isFavorite: false,
  lastGenerated: '2 weeks ago',
  icon: <AlertTriangle className="w-5 h-5" />
},
// Department
{
  id: 'RPT011',
  name: 'Department-wise Attendance',
  category: 'Department Reports',
  categoryColor: 'bg-orange-100 text-orange-700',
  description: 'Attendance statistics grouped by department',
  tags: ['Department', 'Summary'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '3 days ago',
  icon: <Briefcase className="w-5 h-5" />
},
{
  id: 'RPT012',
  name: 'Teaching vs Non-Teaching Attendance',
  category: 'Department Reports',
  categoryColor: 'bg-orange-100 text-orange-700',
  description: 'Comparative attendance for teaching and non-teaching staff',
  tags: ['Department', 'Comparison'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '1 week ago',
  icon: <Layers className="w-5 h-5" />
},
// Payroll
{
  id: 'RPT013',
  name: 'Attendance for Payroll Processing',
  category: 'Payroll Integration',
  categoryColor: 'bg-teal-100 text-teal-700',
  description: 'Attendance data formatted for payroll calculation',
  tags: ['Payroll', 'Export'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '1 month ago',
  icon: <FileSpreadsheet className="w-5 h-5" />
},
{
  id: 'RPT014',
  name: 'Leave Without Pay (LWP) Report',
  category: 'Payroll Integration',
  categoryColor: 'bg-teal-100 text-teal-700',
  description: 'Employees with leave without pay deductions',
  tags: ['Payroll', 'LWP'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '1 month ago',
  icon: <AlertCircle className="w-5 h-5" />
},
// Compliance
{
  id: 'RPT015',
  name: 'Branch Attendance Compliance Report',
  category: 'Compliance',
  categoryColor: 'bg-red-100 text-red-700',
  description: 'Compliance-ready attendance summary per branch',
  tags: ['Compliance', 'Branch-wise'],
  isNew: true,
  isFavorite: false,
  lastGenerated: 'Never',
  icon: <CheckCircle className="w-5 h-5" />
},
{
  id: 'RPT016',
  name: 'Biometric vs Manual Comparison',
  category: 'Compliance',
  categoryColor: 'bg-red-100 text-red-700',
  description: 'Comparison of biometric and manual attendance entries',
  tags: ['Compliance', 'Audit'],
  isNew: false,
  isFavorite: false,
  lastGenerated: '2 weeks ago',
  icon: <Activity className="w-5 h-5" />
},
// Comparative
{
  id: 'RPT017',
  name: 'Branch Attendance Comparison',
  category: 'Comparative Analysis',
  categoryColor: 'bg-indigo-100 text-indigo-700',
  description: 'Side-by-side attendance comparison across branches',
  tags: ['Comparison', 'Branch-wise'],
  isNew: false,
  isFavorite: true,
  lastGenerated: '4 days ago',
  icon: <BarChart3 className="w-5 h-5" />
},
{
  id: 'RPT018',
  name: 'Staff Attendance Performance Index',
  category: 'Comparative Analysis',
  categoryColor: 'bg-indigo-100 text-indigo-700',
  description: 'Performance index based on attendance metrics',
  tags: ['Analysis', 'Performance'],
  isNew: true,
  isFavorite: false,
  lastGenerated: 'Never',
  icon: <Zap className="w-5 h-5" />
}];

const GENERATED_REPORTS: GeneratedReport[] = [
{
  id: 'GR001',
  name: 'Monthly Attendance Summary - May 2025',
  category: 'Monthly Reports',
  generatedAt: '2025-05-31 09:15 AM',
  generatedBy: 'Admin',
  branches: ['Main Campus', 'North Branch'],
  dateRange: '01 May – 31 May 2025',
  format: 'PDF',
  fileSize: '2.4 MB',
  status: 'Completed'
},
{
  id: 'GR002',
  name: 'Branch Attendance Compliance Report',
  category: 'Compliance',
  generatedAt: '2025-05-30 02:30 PM',
  generatedBy: 'HR Manager',
  branches: ['All Branches'],
  dateRange: '01 Apr – 30 Apr 2025',
  format: 'Excel',
  fileSize: '1.8 MB',
  status: 'Completed'
},
{
  id: 'GR003',
  name: 'Attendance for Payroll Processing',
  category: 'Payroll Integration',
  generatedAt: '2025-05-29 11:00 AM',
  generatedBy: 'Payroll Admin',
  branches: ['Main Campus'],
  dateRange: '01 May – 31 May 2025',
  format: 'Excel',
  fileSize: '3.1 MB',
  status: 'Completed'
},
{
  id: 'GR004',
  name: 'Daily Staff Attendance Register',
  category: 'Daily Attendance',
  generatedAt: '2025-05-31 08:00 AM',
  generatedBy: 'Admin',
  branches: ['South Branch'],
  dateRange: '31 May 2025',
  format: 'PDF',
  fileSize: '0.8 MB',
  status: 'Processing'
},
{
  id: 'GR005',
  name: 'Leave Summary Report - Q1 2025',
  category: 'Leave & Absenteeism',
  generatedAt: '2025-04-01 10:00 AM',
  generatedBy: 'HR Manager',
  branches: ['All Branches'],
  dateRange: '01 Jan – 31 Mar 2025',
  format: 'CSV',
  fileSize: '0.5 MB',
  status: 'Completed'
},
{
  id: 'GR006',
  name: 'Branch Attendance Comparison',
  category: 'Comparative Analysis',
  generatedAt: '2025-05-28 03:00 PM',
  generatedBy: 'Admin',
  branches: ['All Branches'],
  dateRange: '01 May – 28 May 2025',
  format: 'PDF',
  fileSize: '4.2 MB',
  status: 'Failed'
}];

const CATEGORIES = [
{
  name: 'Daily Attendance Reports',
  count: 4,
  color: 'bg-blue-500',
  icon: <Calendar className="w-5 h-5" />
},
{
  name: 'Monthly & Periodic Reports',
  count: 3,
  color: 'bg-green-500',
  icon: <BarChart3 className="w-5 h-5" />
},
{
  name: 'Leave & Absenteeism Reports',
  count: 3,
  color: 'bg-purple-500',
  icon: <Coffee className="w-5 h-5" />
},
{
  name: 'Department & Role-Based Reports',
  count: 2,
  color: 'bg-orange-500',
  icon: <Briefcase className="w-5 h-5" />
},
{
  name: 'Late Mark & Short Leave Reports',
  count: 2,
  color: 'bg-yellow-500',
  icon: <Clock className="w-5 h-5" />
},
{
  name: 'Payroll & Salary Integration',
  count: 2,
  color: 'bg-teal-500',
  icon: <FileSpreadsheet className="w-5 h-5" />
},
{
  name: 'Compliance & Summary Reports',
  count: 2,
  color: 'bg-red-500',
  icon: <CheckCircle className="w-5 h-5" />
},
{
  name: 'Comparative & Analysis Reports',
  count: 2,
  color: 'bg-indigo-500',
  icon: <TrendingUp className="w-5 h-5" />
}];

// ============ COMPONENTS ============
function BranchTag({ branch }: {branch: Branch;}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${branch.bgColor} ${branch.color}`}>

      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {branch.name}
    </span>);

}
function StatusBadge({ status }: {status: GeneratedReport['status'];}) {
  const config = {
    Completed: 'bg-green-100 text-green-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Failed: 'bg-red-100 text-red-700'
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config[status]}`}>

      {status}
    </span>);

}
function FormatBadge({ format }: {format: GeneratedReport['format'];}) {
  const config = {
    PDF: 'bg-red-50 text-red-700 border border-red-200',
    Excel: 'bg-green-50 text-green-700 border border-green-200',
    CSV: 'bg-blue-50 text-blue-700 border border-blue-200'
  };
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${config[format]}`}>

      {format}
    </span>);

}
// Report Generation Modal
function GenerateReportModal({
  isOpen,
  onClose



}: {isOpen: boolean;onClose: () => void;}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [sortBy, setSortBy] = useState('name');
  const [groupBy, setGroupBy] = useState('none');
  const [attendanceStatus, setAttendanceStatus] = useState<string[]>([]);
  const [includeBiometric, setIncludeBiometric] = useState(true);
  const [includeLeave, setIncludeLeave] = useState(true);
  const [includeLate, setIncludeLate] = useState(false);
  const [includePayroll, setIncludePayroll] = useState(false);
  const toggleBranch = (id: string) => {
    setSelectedBranches((prev) =>
    prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };
  const toggleStatus = (s: string) => {
    setAttendanceStatus((prev) =>
    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };
  const handleGenerate = () => {
    if (!selectedReportType) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onClose();
    }, 2500);
  };
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}>

      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-5 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Generate Staff Attendance Report
              </h2>
              <p className="text-teal-100 text-sm mt-0.5">
                Configure filters for attendance report
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors">

              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">

              <option value="">Select Report Type...</option>
              <optgroup label="Daily Attendance Reports">
                <option value="daily-register">
                  Daily Staff Attendance Register
                </option>
                <option value="present-absent">
                  Present/Absent Staff List
                </option>
                <option value="late-arrival-daily">
                  Late Arrival Report (Daily)
                </option>
                <option value="branch-daily">
                  Branch-wise Daily Attendance
                </option>
              </optgroup>
              <optgroup label="Monthly Reports">
                <option value="monthly-summary">
                  Monthly Attendance Summary
                </option>
                <option value="attendance-percentage">
                  Attendance Percentage Report
                </option>
                <option value="monthly-trend">Monthly Attendance Trend</option>
              </optgroup>
              <optgroup label="Leave Reports">
                <option value="leave-summary">Leave Summary Report</option>
                <option value="leave-balance">Leave Balance Report</option>
                <option value="frequent-absentee">
                  Frequent Absentee Report
                </option>
              </optgroup>
              <optgroup label="Payroll Reports">
                <option value="payroll-attendance">
                  Attendance for Payroll Processing
                </option>
                <option value="lwp-report">
                  Leave Without Pay (LWP) Report
                </option>
              </optgroup>
              <optgroup label="Department Reports">
                <option value="dept-attendance">
                  Department-wise Attendance
                </option>
                <option value="teaching-nonteaching">
                  Teaching vs Non-Teaching Attendance
                </option>
              </optgroup>
              <optgroup label="Compliance Reports">
                <option value="branch-compliance">
                  Branch Attendance Compliance Report
                </option>
                <option value="biometric-manual">
                  Biometric vs Manual Comparison
                </option>
              </optgroup>
              <optgroup label="Comparative Reports">
                <option value="branch-comparison">
                  Branch Attendance Comparison
                </option>
                <option value="performance-index">
                  Staff Attendance Performance Index
                </option>
              </optgroup>
            </select>
            {selectedReportType &&
            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg border border-teal-200">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span className="text-sm text-teal-700 font-medium">
                  Selected:{' '}
                  {selectedReportType.
                replace(/-/g, ' ').
                replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
              </div>
            }
          </div>

          {/* Scope Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
              Selected Scope
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Calendar className="w-4 h-4" />
                <span>
                  Date Range: <strong>01 Jan 2026 – 31 Jan 2026</strong>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <Building className="w-4 h-4" />
                <span>Branches: </span>
                {selectedBranches.length === 0 ?
                <strong>All Branches</strong> :

                <div className="flex flex-wrap gap-1">
                    {selectedBranches.map((id) => {
                    const b = BRANCHES.find((br) => br.id === id);
                    return b ? <BranchTag key={id} branch={b} /> : null;
                  })}
                  </div>
                }
              </div>
            </div>
          </div>

          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Branch Selection
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedBranches([])}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedBranches.length === 0 ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'}`}>

                All Branches
              </button>
              {BRANCHES.map((branch) =>
              <button
                key={branch.id}
                onClick={() => toggleBranch(branch.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedBranches.includes(branch.id) ? `${branch.bgColor} ${branch.color} border-current` : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>

                  {branch.name} ({branch.board})
                </button>
              )}
            </div>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  defaultValue="2026-01-01"
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />

                <input
                  type="date"
                  defaultValue="2026-01-31"
                  className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" />

              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Department
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Departments</option>
                <option>Teaching</option>
                <option>Administration</option>
                <option>Support Staff</option>
                <option>IT Department</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Staff Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Staff</option>
                <option>Teaching</option>
                <option>Non-Teaching</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Employment Type
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          {/* Attendance Status Filters */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Attendance Status Filter
            </label>
            <div className="flex flex-wrap gap-2">
              {[
              {
                value: 'present',
                label: 'Present',
                color: 'bg-green-100 text-green-700 border-green-300'
              },
              {
                value: 'absent',
                label: 'Absent',
                color: 'bg-red-100 text-red-700 border-red-300'
              },
              {
                value: 'leave',
                label: 'On Leave',
                color: 'bg-blue-100 text-blue-700 border-blue-300'
              },
              {
                value: 'late',
                label: 'Late',
                color: 'bg-yellow-100 text-yellow-700 border-yellow-300'
              },
              {
                value: 'early-exit',
                label: 'Early Exit',
                color: 'bg-orange-100 text-orange-700 border-orange-300'
              }].
              map((s) =>
              <button
                key={s.value}
                onClick={() => toggleStatus(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${attendanceStatus.includes(s.value) ? s.color : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>

                  {attendanceStatus.includes(s.value) &&
                <Check className="w-3 h-3 inline mr-1" />
                }
                  {s.label}
                </button>
              )}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Output Format
              </label>
              <div className="flex gap-2">
                {['pdf', 'excel', 'csv'].map((f) =>
                <button
                  key={f}
                  onClick={() => setOutputFormat(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${outputFormat === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'}`}>

                    {f.toUpperCase()}
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option value="name">Name</option>
                <option value="emp-id">Employee ID</option>
                <option value="department">Department</option>
                <option value="attendance">Attendance %</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Group By
              </label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option value="none">None</option>
                <option value="branch">Branch</option>
                <option value="department">Department</option>
                <option value="designation">Designation</option>
              </select>
            </div>
          </div>

          {/* Include Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Include in Report
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
              {
                key: 'biometric',
                label: 'Biometric Logs',
                value: includeBiometric,
                setter: setIncludeBiometric
              },
              {
                key: 'leave',
                label: 'Leave Details',
                value: includeLeave,
                setter: setIncludeLeave
              },
              {
                key: 'late',
                label: 'Late Mark Summary',
                value: includeLate,
                setter: setIncludeLate
              },
              {
                key: 'payroll',
                label: 'Payroll Calculation Fields',
                value: includePayroll,
                setter: setIncludePayroll
              }].
              map((opt) =>
              <label
                key={opt.key}
                className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">

                  <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${opt.value ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}
                  onClick={() => opt.setter(!opt.value)}>

                    {opt.value && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">

            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!selectedReportType || isGenerating}
            className={`inline-flex items-center px-6 py-2.5 rounded-lg font-semibold text-white text-sm transition-all shadow-sm ${!selectedReportType || isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>

            {isGenerating ?
            <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </> :

            <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </>
            }
          </button>
        </div>
      </div>
    </div>);

}
// ============ MAIN COMPONENT ============
export function HrAttendanceReport() {
  const [activeTab, setActiveTab] = useState<
    'templates' | 'generated' | 'analytics'>(
    'templates');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set([
    'RPT001',
    'RPT004',
    'RPT005',
    'RPT008',
    'RPT011',
    'RPT013',
    'RPT017']
    )
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [reportFilter, setReportFilter] = useState({
    status: 'All',
    format: 'All'
  });
  const toggleBranch = (id: string) => {
    setSelectedBranches((prev) =>
    prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else
      next.add(id);
      return next;
    });
  };
  const filteredTemplates = REPORT_TEMPLATES.filter((t) => {
    const matchesSearch =
    searchQuery === '' ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
    selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const filteredReports = GENERATED_REPORTS.filter((r) => {
    const matchesStatus =
    reportFilter.status === 'All' || r.status === reportFilter.status;
    const matchesFormat =
    reportFilter.format === 'All' || r.format === reportFilter.format;
    return matchesStatus && matchesFormat;
  });
  const liveStats = [
  {
    label: 'Total Staff',
    value: '248',
    sub: 'Across all branches',
    color: 'text-gray-900',
    bg: 'bg-gray-100',
    icon: <Users className="w-5 h-5 text-gray-600" />
  },
  {
    label: 'Present Today',
    value: '221',
    sub: '89.1% attendance',
    color: 'text-green-700',
    bg: 'bg-green-100',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />
  },
  {
    label: 'Absent Today',
    value: '18',
    sub: '7.3% absenteeism',
    color: 'text-red-700',
    bg: 'bg-red-100',
    icon: <XCircle className="w-5 h-5 text-red-600" />
  },
  {
    label: 'On Leave',
    value: '9',
    sub: '3.6% on leave',
    color: 'text-purple-700',
    bg: 'bg-purple-100',
    icon: <Coffee className="w-5 h-5 text-purple-600" />
  },
  {
    label: 'Late Arrivals',
    value: '14',
    sub: 'Today so far',
    color: 'text-yellow-700',
    bg: 'bg-yellow-100',
    icon: <Clock className="w-5 h-5 text-yellow-600" />
  },
  {
    label: 'Avg Attendance',
    value: '91.4%',
    sub: 'This month',
    color: 'text-teal-700',
    bg: 'bg-teal-100',
    icon: <Percent className="w-5 h-5 text-teal-600" />
  }];

  const branchAnalytics = [
  {
    name: 'Main Campus',
    present: 89,
    total: 95,
    pct: 93.7
  },
  {
    name: 'North Branch',
    present: 62,
    total: 68,
    pct: 91.2
  },
  {
    name: 'South Branch',
    present: 44,
    total: 52,
    pct: 84.6
  },
  {
    name: 'East Branch',
    present: 26,
    total: 33,
    pct: 78.8
  }];

  const deptAnalytics = [
  {
    name: 'Teaching Staff',
    pct: 94.2,
    count: 142
  },
  {
    name: 'Administration',
    pct: 91.1,
    count: 45
  },
  {
    name: 'Support Staff',
    pct: 87.3,
    count: 38
  },
  {
    name: 'Finance & Accounts',
    pct: 95.8,
    count: 12
  },
  {
    name: 'IT Department',
    pct: 88.5,
    count: 8
  },
  {
    name: 'Operations',
    pct: 83.3,
    count: 3
  }];

  const weeklyData = [
  {
    day: 'Mon',
    pct: 93
  },
  {
    day: 'Tue',
    pct: 91
  },
  {
    day: 'Wed',
    pct: 89
  },
  {
    day: 'Thu',
    pct: 94
  },
  {
    day: 'Fri',
    pct: 87
  },
  {
    day: 'Sat',
    pct: 72
  }];

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Staff Attendance Reporting
          </h1>
          <p className="text-sm text-gray-500">
            Multi-branch attendance analytics & compliance reporting for GSEB &
            CBSE schools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <History className="w-4 h-4 mr-2" />
            Report History
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Bookmark className="w-4 h-4 mr-2" />
            Saved Templates
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="inline-flex items-center px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">

            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Branch Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-500" />
            Branches:
          </span>
          <button
            onClick={() => setSelectedBranches([])}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedBranches.length === 0 ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-400'}`}>

            All Branches
          </button>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => toggleBranch(branch.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedBranches.includes(branch.id) ? `${branch.bgColor} ${branch.color} border-current` : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}>

              <span
              className={`w-2 h-2 rounded-full ${selectedBranches.includes(branch.id) ? 'bg-current' : 'bg-gray-400'}`} />

              {branch.name}
              <span className="opacity-60">({branch.board})</span>
            </button>
          )}
          <button className="ml-auto text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200">
          {[
          {
            key: 'templates',
            label: 'Report Templates',
            icon: <FileText className="w-4 h-4" />
          },
          {
            key: 'generated',
            label: 'Generated Reports',
            icon: <FileDown className="w-4 h-4" />
          },
          {
            key: 'analytics',
            label: 'Live Analytics',
            icon: <Activity className="w-4 h-4" />
          }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-teal-600 text-teal-600 bg-teal-50/50' : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>

              {tab.icon}
              {tab.label}
            </button>
          )}
        </div>

        {/* TAB 1: Templates */}
        {activeTab === 'templates' &&
        <div className="p-6 space-y-6">
            {/* Featured Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
            {
              label: 'Total Staff',
              value: '248',
              color: 'text-gray-900',
              bg: 'bg-gray-50 border-gray-200'
            },
            {
              label: 'Present Today',
              value: '221',
              color: 'text-green-600',
              bg: 'bg-green-50 border-green-200'
            },
            {
              label: 'Absent Today',
              value: '18',
              color: 'text-red-600',
              bg: 'bg-red-50 border-red-200'
            },
            {
              label: 'On Leave',
              value: '9',
              color: 'text-purple-600',
              bg: 'bg-purple-50 border-purple-200'
            },
            {
              label: 'Late Marked',
              value: '14',
              color: 'text-yellow-600',
              bg: 'bg-yellow-50 border-yellow-200'
            },
            {
              label: 'Avg Attendance',
              value: '91.4%',
              color: 'text-teal-600',
              bg: 'bg-teal-50 border-teal-200'
            }].
            map((stat) =>
            <div
              key={stat.label}
              className={`p-3 rounded-xl border ${stat.bg} text-center`}>

                  <p className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
            )}
            </div>

            {/* Category Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Report Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CATEGORIES.map((cat) =>
              <button
                key={cat.name}
                onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.name ? 'All' : cat.name
                )
                }
                className={`p-3 rounded-xl border text-left transition-all ${selectedCategory === cat.name ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>

                    <div className="flex items-center justify-between mb-2">
                      <div
                    className={`w-8 h-8 ${cat.color} rounded-lg flex items-center justify-center text-white`}>

                        {cat.icon}
                      </div>
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 leading-tight">
                      {cat.name}
                    </p>
                  </button>
              )}
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search report templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" />

              </div>
              {selectedCategory !== 'All' &&
            <button
              onClick={() => setSelectedCategory('All')}
              className="inline-flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">

                  <X className="w-4 h-4" />
                  Clear Filter
                </button>
            }
            </div>

            {/* Template Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map((template) =>
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all group">

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors flex-shrink-0">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {template.name}
                            </h4>
                            {template.isNew &&
                        <span className="px-1.5 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                New
                              </span>
                        }
                          </div>
                          <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${template.categoryColor}`}>

                            {template.category}
                          </span>
                        </div>
                        <button
                      onClick={() => toggleFavorite(template.id)}
                      className="flex-shrink-0">

                          <Star
                        className={`w-4 h-4 transition-colors ${favorites.has(template.id) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} />

                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map((tag) =>
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">

                            {tag}
                          </span>
                    )}
                      </div>
                      {template.lastGenerated &&
                  <p className="text-xs text-gray-400 mt-2">
                          Last generated: {template.lastGenerated}
                        </p>
                  }
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>
                    <button
                  onClick={() => setShowGenerateModal(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-teal-600 border border-teal-200 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">

                      <Zap className="w-3.5 h-3.5" />
                      Generate
                    </button>
                    <button className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
            )}
            </div>

            {filteredTemplates.length === 0 &&
          <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No templates found</p>
                <p className="text-sm text-gray-400">
                  Try adjusting your search or filter
                </p>
              </div>
          }
          </div>
        }

        {/* TAB 2: Generated Reports */}
        {activeTab === 'generated' &&
        <div className="p-6 space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search reports..."
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm w-56" />

              </div>
              <select
              value={reportFilter.status}
              onChange={(e) =>
              setReportFilter((p) => ({
                ...p,
                status: e.target.value
              }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Processing">Processing</option>
                <option value="Failed">Failed</option>
              </select>
              <select
              value={reportFilter.format}
              onChange={(e) =>
              setReportFilter((p) => ({
                ...p,
                format: e.target.value
              }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">

                <option value="All">All Formats</option>
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
              <button className="ml-auto inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Bulk Download
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branches
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredReports.map((report) =>
                <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {report.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.fileSize} • By {report.generatedBy}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600">
                          {report.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700">
                          {report.generatedAt}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {report.branches.map((b) =>
                      <span
                        key={b}
                        className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">

                              {b}
                            </span>
                      )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700">
                          {report.dateRange}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <FormatBadge format={report.format} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={report.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                        className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View">

                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download">

                            <Download className="w-4 h-4" />
                          </button>
                          <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Email">

                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Print">

                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 &&
          <div className="text-center py-12">
                <FileDown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No reports found</p>
              </div>
          }
          </div>
        }

        {/* TAB 3: Live Analytics */}
        {activeTab === 'analytics' &&
        <div className="p-6 space-y-6">
            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {liveStats.map((stat) =>
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-xl p-4">

                  <div
                className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>

                    {stat.icon}
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
                </div>
            )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Branch Comparison */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Branch Attendance Comparison
                </h3>
                <div className="space-y-4">
                  {branchAnalytics.map((branch, index) =>
                <div key={branch.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">
                          {branch.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {branch.present}/{branch.total}
                          </span>
                          <span
                        className={`text-sm font-bold ${branch.pct >= 90 ? 'text-green-600' : branch.pct >= 80 ? 'text-teal-600' : 'text-orange-600'}`}>

                            {branch.pct}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                      className={`h-full rounded-full transition-all ${branch.pct >= 90 ? 'bg-green-500' : branch.pct >= 80 ? 'bg-teal-500' : 'bg-orange-500'}`}
                      style={{
                        width: `${branch.pct}%`
                      }} />

                      </div>
                    </div>
                )}
                </div>
              </div>

              {/* Department Breakdown */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Department-wise Attendance
                </h3>
                <div className="space-y-3">
                  {deptAnalytics.map((dept, index) =>
                <div key={dept.name} className="flex items-center gap-3">
                      <span
                    className={`text-xs font-bold w-5 ${index < 3 ? 'text-teal-600' : 'text-gray-400'}`}>

                        #{index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {dept.name}
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            {dept.pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                        className={`h-full rounded-full ${dept.pct >= 90 ? 'bg-green-500' : dept.pct >= 85 ? 'bg-teal-500' : 'bg-yellow-500'}`}
                        style={{
                          width: `${dept.pct}%`
                        }} />

                        </div>
                      </div>
                      <span className="text-xs text-gray-400 w-14 text-right">
                        {dept.count} staff
                      </span>
                    </div>
                )}
                </div>
              </div>
            </div>

            {/* Weekly Trend */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Daily Attendance Trend (This Week)
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-green-500 inline-block" />
                    ≥90%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-teal-500 inline-block" />
                    80-89%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-yellow-500 inline-block" />
                    &lt;80%
                  </span>
                </div>
              </div>
              <div className="flex items-end gap-4 h-40">
                {weeklyData.map((item) =>
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center">

                    <span className="text-xs font-semibold text-gray-700 mb-1">
                      {item.pct}%
                    </span>
                    <div
                  className="w-full flex items-end justify-center"
                  style={{
                    height: '100px'
                  }}>

                      <div
                    className={`w-full max-w-[48px] rounded-t-lg transition-all ${item.pct >= 90 ? 'bg-green-500' : item.pct >= 80 ? 'bg-teal-500' : 'bg-yellow-500'}`}
                    style={{
                      height: `${item.pct}%`
                    }} />

                    </div>
                    <span className="text-sm text-gray-600 mt-2">
                      {item.day}
                    </span>
                  </div>
              )}
              </div>
            </div>

            {/* Leave Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Leave Type Distribution (This Month)
                </h3>
                <div className="space-y-3">
                  {[
                {
                  type: 'Casual Leave',
                  count: 42,
                  pct: 38,
                  color: 'bg-blue-500'
                },
                {
                  type: 'Sick Leave',
                  count: 28,
                  pct: 25,
                  color: 'bg-red-500'
                },
                {
                  type: 'Earned Leave',
                  count: 22,
                  pct: 20,
                  color: 'bg-green-500'
                },
                {
                  type: 'Compensatory Off',
                  count: 12,
                  pct: 11,
                  color: 'bg-purple-500'
                },
                {
                  type: 'Others',
                  count: 7,
                  pct: 6,
                  color: 'bg-gray-400'
                }].
                map((leave) =>
                <div key={leave.type} className="flex items-center gap-3">
                      <div
                    className={`w-3 h-3 rounded-full ${leave.color} flex-shrink-0`} />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">
                            {leave.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {leave.count} instances ({leave.pct}%)
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                        className={`h-full rounded-full ${leave.color}`}
                        style={{
                          width: `${leave.pct}%`
                        }} />

                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Late Mark Frequency
                </h3>
                <div className="space-y-3">
                  {[
                {
                  dept: 'Support Staff',
                  count: 8,
                  color: 'bg-red-500'
                },
                {
                  dept: 'Operations',
                  count: 5,
                  color: 'bg-orange-500'
                },
                {
                  dept: 'IT Department',
                  count: 4,
                  color: 'bg-yellow-500'
                },
                {
                  dept: 'Administration',
                  count: 3,
                  color: 'bg-blue-500'
                },
                {
                  dept: 'Teaching Staff',
                  count: 2,
                  color: 'bg-teal-500'
                }].
                map((item) =>
                <div key={item.dept} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-32 flex-shrink-0">
                        {item.dept}
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${item.count / 8 * 100}%`
                      }} />

                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-6 text-right">
                        {item.count}
                      </span>
                    </div>
                )}
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <p className="text-xs text-yellow-700 font-medium">
                      22 late arrivals recorded this month across all branches
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Export</h3>
              <div className="flex flex-wrap gap-3">
                <button
                onClick={() => setShowGenerateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">

                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Full Report
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Export to Excel
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Export to PDF
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Report
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      {/* Generate Modal */}
      <GenerateReportModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)} />

    </div>);

}