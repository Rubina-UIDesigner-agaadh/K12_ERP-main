import React, { useState, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
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
  Plus,
  PieChart,
  Heart,
  Baby,
  Home,
  Award,
  Database,
  Share2,
  CalendarCheck,
  UserX,
  TimerOff,
  Flag,
  BellRing,
  Phone,
  Send } from
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
  count: 1,
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
              <optgroup label="Absenteeism Reports">
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
function AttendanceReportTemplates() {
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

interface LeaveDetail {
  date: string;
  days: number;
}
interface LeaveBucket {
  taken: number;
  balance: number;
  details: LeaveDetail[];
}
interface EmpLeaves {
  total: number;
  CL?: LeaveBucket;
  SL?: LeaveBucket;
  PL?: LeaveBucket;
  EL?: LeaveBucket;
  ML?: LeaveBucket;
  PTL?: LeaveBucket;
  CO?: LeaveBucket;
  LOP?: LeaveBucket;
}
interface LeaveEmployee {
  id: string;
  name: string;
  department: string;
  designation: string;
  leaves: EmpLeaves;
  attendance: number;
}

const bucket = (emp: LeaveEmployee, id: string): LeaveBucket | undefined => {
  return (emp.leaves as Record<string, LeaveBucket | number | undefined>)[id] as LeaveBucket | undefined;
};

function EmbeddedLeaveReport() {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart' | 'summary'>('table');
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  const leaveTypes = [
    { id: 'CL', name: 'Casual Leave', color: 'blue', icon: Calendar, entitled: 12, iconBg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-500', soft: 'bg-blue-50', border: 'border-blue-500' },
    { id: 'SL', name: 'Sick Leave', color: 'red', icon: Heart, entitled: 10, iconBg: 'bg-red-100', text: 'text-red-600', bar: 'bg-red-500', soft: 'bg-red-50', border: 'border-red-500' },
    { id: 'PL', name: 'Privilege Leave', color: 'green', icon: Award, entitled: 15, iconBg: 'bg-green-100', text: 'text-green-600', bar: 'bg-green-500', soft: 'bg-green-50', border: 'border-green-500' },
    { id: 'EL', name: 'Earned Leave', color: 'purple', icon: Briefcase, entitled: 20, iconBg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-500', soft: 'bg-purple-50', border: 'border-purple-500' },
    { id: 'ML', name: 'Maternity Leave', color: 'pink', icon: Baby, entitled: 180, iconBg: 'bg-pink-100', text: 'text-pink-600', bar: 'bg-pink-500', soft: 'bg-pink-50', border: 'border-pink-500' },
    { id: 'PTL', name: 'Paternity Leave', color: 'indigo', icon: Home, entitled: 15, iconBg: 'bg-indigo-100', text: 'text-indigo-600', bar: 'bg-indigo-500', soft: 'bg-indigo-50', border: 'border-indigo-500' },
    { id: 'CO', name: 'Comp Off', color: 'teal', icon: Clock, entitled: 0, iconBg: 'bg-teal-100', text: 'text-teal-600', bar: 'bg-teal-500', soft: 'bg-teal-50', border: 'border-teal-500' },
    { id: 'LOP', name: 'Loss of Pay', color: 'gray', icon: XCircle, entitled: 0, iconBg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500', soft: 'bg-gray-50', border: 'border-gray-500' }
  ];

  const departments = [
    { id: 'DEPT001', name: 'Engineering', employees: 45, color: 'blue', text: 'text-blue-500', soft: 'bg-blue-50', border: 'border-blue-500' },
    { id: 'DEPT002', name: 'Human Resources', employees: 8, color: 'purple', text: 'text-purple-500', soft: 'bg-purple-50', border: 'border-purple-500' },
    { id: 'DEPT003', name: 'Finance', employees: 12, color: 'green', text: 'text-green-500', soft: 'bg-green-50', border: 'border-green-500' },
    { id: 'DEPT004', name: 'Marketing', employees: 15, color: 'orange', text: 'text-orange-500', soft: 'bg-orange-50', border: 'border-orange-500' },
    { id: 'DEPT005', name: 'Operations', employees: 20, color: 'red', text: 'text-red-500', soft: 'bg-red-50', border: 'border-red-500' },
    { id: 'DEPT006', name: 'Sales', employees: 25, color: 'teal', text: 'text-teal-500', soft: 'bg-teal-50', border: 'border-teal-500' },
    { id: 'DEPT007', name: 'IT Support', employees: 10, color: 'indigo', text: 'text-indigo-500', soft: 'bg-indigo-50', border: 'border-indigo-500' }
  ];

  const leaveData: LeaveEmployee[] = [
    {
      id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', attendance: 92.5,
      leaves: {
        CL: { taken: 8, balance: 4, details: [{ date: '2024-01-05', days: 2 }, { date: '2024-01-20', days: 1 }] },
        SL: { taken: 2, balance: 8, details: [{ date: '2024-01-15', days: 2 }] },
        PL: { taken: 5, balance: 10, details: [{ date: '2024-01-25', days: 5 }] },
        EL: { taken: 0, balance: 20, details: [] },
        total: 15
      }
    },
    {
      id: 'EMP002', name: 'Jane Smith', department: 'HR', designation: 'HR Manager', attendance: 88.0,
      leaves: {
        CL: { taken: 5, balance: 7, details: [{ date: '2024-01-10', days: 3 }, { date: '2024-01-28', days: 2 }] },
        SL: { taken: 3, balance: 7, details: [{ date: '2024-01-18', days: 3 }] },
        PL: { taken: 0, balance: 15, details: [] },
        EL: { taken: 10, balance: 10, details: [{ date: '2024-01-08', days: 10 }] },
        total: 18
      }
    },
    {
      id: 'EMP003', name: 'Robert Johnson', department: 'Finance', designation: 'Accountant', attendance: 93.0,
      leaves: {
        CL: { taken: 10, balance: 2, details: [{ date: '2024-01-02', days: 5 }, { date: '2024-01-22', days: 5 }] },
        SL: { taken: 1, balance: 9, details: [{ date: '2024-01-30', days: 1 }] },
        PL: { taken: 3, balance: 12, details: [{ date: '2024-01-12', days: 3 }] },
        EL: { taken: 0, balance: 20, details: [] },
        total: 14
      }
    },
    {
      id: 'EMP004', name: 'Emily Davis', department: 'Marketing', designation: 'Marketing Lead', attendance: 88.0,
      leaves: {
        CL: { taken: 6, balance: 6, details: [{ date: '2024-01-03', days: 3 }, { date: '2024-01-24', days: 3 }] },
        SL: { taken: 0, balance: 10, details: [] },
        PL: { taken: 7, balance: 8, details: [{ date: '2024-01-15', days: 7 }] },
        EL: { taken: 5, balance: 15, details: [{ date: '2024-01-29', days: 5 }] },
        total: 18
      }
    },
    {
      id: 'EMP005', name: 'Michael Brown', department: 'Engineering', designation: 'Developer', attendance: 89.5,
      leaves: {
        CL: { taken: 12, balance: 0, details: [{ date: '2024-01-04', days: 4 }, { date: '2024-01-16', days: 4 }, { date: '2024-01-26', days: 4 }] },
        SL: { taken: 5, balance: 5, details: [{ date: '2024-01-11', days: 5 }] },
        PL: { taken: 0, balance: 15, details: [] },
        EL: { taken: 0, balance: 20, details: [] },
        total: 17
      }
    },
    {
      id: 'EMP006', name: 'Sarah Wilson', department: 'Operations', designation: 'Operations Manager', attendance: 0,
      leaves: {
        ML: { taken: 90, balance: 90, details: [{ date: '2024-01-01', days: 90 }] },
        total: 90
      }
    }
  ];

  const toggleLeaveType = (id: string) => {
    setSelectedLeaveTypes((prev) => prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]);
  };
  const toggleDepartment = (id: string) => {
    setSelectedDepartments((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  };
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };
  const getLeaveTypeColor = (type: string) => leaveTypes.find((lt) => lt.id === type)?.text || 'text-gray-700';

  const departmentStats: Record<string, { totalLeaves: number; avgLeaves: string | number; employees: number }> = {};
  departments.forEach((dept) => {
    const deptEmployees = leaveData.filter((emp) => emp.department === dept.name);
    const totalLeaves = deptEmployees.reduce((sum, emp) => sum + emp.leaves.total, 0);
    departmentStats[dept.name] = {
      totalLeaves,
      avgLeaves: deptEmployees.length > 0 ? (totalLeaves / deptEmployees.length).toFixed(1) : 0,
      employees: deptEmployees.length
    };
  });

  const totalLeavesTaken = leaveData.reduce((sum, emp) => sum + emp.leaves.total, 0);
  const avgLeavePerEmployee = (totalLeavesTaken / leaveData.length).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Report</h1>
          <p className="text-sm text-gray-500">Analytics and insights on employee leave usage patterns</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Bookmark className="w-4 h-4 mr-2" />Saved Reports</Button>
          <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Data</Button>
          <Button variant="primary" onClick={handleGenerateReport}>
            {isGenerating ? <><Loader className="w-4 h-4 mr-2 animate-spin" />Generating...</> : <><BarChart3 className="w-4 h-4 mr-2" />Generate Report</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2"><Calendar className="w-5 h-5 text-blue-600" /><span className="text-xs text-blue-600 font-medium">Total</span></div>
          <p className="text-2xl font-bold text-blue-700">{totalLeavesTaken}</p>
          <p className="text-xs text-blue-600">Leaves Taken</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2"><Users className="w-5 h-5 text-green-600" /><span className="text-xs text-green-600 font-medium">Avg</span></div>
          <p className="text-2xl font-bold text-green-700">{avgLeavePerEmployee}</p>
          <p className="text-xs text-green-600">Per Employee</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2"><CheckCircle className="w-5 h-5 text-purple-600" /><span className="text-xs text-purple-600 font-medium">CL</span></div>
          <p className="text-2xl font-bold text-purple-700">46</p>
          <p className="text-xs text-purple-600">Casual Leaves</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2"><Heart className="w-5 h-5 text-red-600" /><span className="text-xs text-red-600 font-medium">SL</span></div>
          <p className="text-2xl font-bold text-red-700">11</p>
          <p className="text-xs text-red-600">Sick Leaves</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2"><TrendingUp className="w-5 h-5 text-orange-600" /><span className="text-xs text-orange-600 font-medium">Trend</span></div>
          <p className="text-2xl font-bold text-orange-700">+12%</p>
          <p className="text-xs text-orange-600">vs Last Month</p>
        </div>
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200">
          <div className="flex items-center justify-between mb-2"><Activity className="w-5 h-5 text-teal-600" /><span className="text-xs text-teal-600 font-medium">Rate</span></div>
          <p className="text-2xl font-bold text-teal-700">91.2%</p>
          <p className="text-xs text-teal-600">Attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Period Selection">
            <div className="space-y-4">
              <Select
                label="Year"
                value={selectedYear}
                onChange={setSelectedYear}
                options={[{ value: '2024', label: '2024' }, { value: '2023', label: '2023' }, { value: '2022', label: '2022' }, { value: '2021', label: '2021' }]}
              />
              <Select
                label="Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={[
                  { value: 'all', label: 'All Months' },
                  { value: '01', label: 'January' },
                  { value: '02', label: 'February' },
                  { value: '03', label: 'March' },
                  { value: '04', label: 'April' },
                  { value: '05', label: 'May' },
                  { value: '06', label: 'June' },
                  { value: '07', label: 'July' },
                  { value: '08', label: 'August' },
                  { value: '09', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' }
                ]}
              />
              <div className="flex gap-2">
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <Button key={q} variant="outline" size="sm" className="flex-1">{q}</Button>)}
              </div>
            </div>
          </Card>

          <Card title="Leave Type Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Select leave types to include</span>
                <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setSelectedLeaveTypes(leaveTypes.map((lt) => lt.id))}>Select All</button>
              </div>
              {leaveTypes.map((type) => {
                const Icon = type.icon;
                const on = selectedLeaveTypes.includes(type.id);
                return (
                  <div key={type.id} onClick={() => toggleLeaveType(type.id)} className={`p-3 rounded-lg cursor-pointer transition-all ${on ? `${type.soft} border-2 ${type.border}` : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={on} onChange={() => undefined} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                      <div className={`w-8 h-8 ${type.iconBg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${type.text}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.id} • {type.entitled > 0 ? `${type.entitled} days` : 'As needed'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Department Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Filter by department</span>
                <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setSelectedDepartments(departments.map((d) => d.id))}>Select All</button>
              </div>
              {departments.map((dept) => {
                const on = selectedDepartments.includes(dept.id);
                return (
                  <div key={dept.id} onClick={() => toggleDepartment(dept.id)} className={`p-3 rounded-lg cursor-pointer transition-all ${on ? `${dept.soft} border-2 ${dept.border}` : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={on} onChange={() => undefined} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                      <Building className={`w-5 h-5 ${dept.text}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">{dept.employees} employees</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                {([
                  { id: 'table' as const, icon: Database, label: 'Table View' },
                  { id: 'chart' as const, icon: BarChart3, label: 'Chart View' },
                  { id: 'summary' as const, icon: PieChart, label: 'Summary' }
                ]).map((m) => (
                  <button key={m.id} type="button" onClick={() => setViewMode(m.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === m.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                    <m.icon className="w-4 h-4 inline mr-2" />{m.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
                <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" />Print</Button>
                <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" />Share</Button>
              </div>
            </div>

            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      {leaveTypes.slice(0, 4).map((type) => (
                        <th key={type.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex flex-col items-center"><span>{type.id}</span><span className="text-[10px] font-normal">({type.entitled})</span></div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Others</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveData.map((employee, index) => (
                      <Fragment key={employee.id}>
                        <tr className={`hover:bg-blue-50/50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="px-4 py-3 sticky left-0 bg-inherit border-r">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-white">{employee.name.split(' ').map((n) => n[0]).join('')}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                                <p className="text-xs text-gray-500">{employee.id} • {employee.designation}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{employee.department}</td>
                          {leaveTypes.slice(0, 4).map((type) => {
                            const leaveInfo = bucket(employee, type.id);
                            if (!leaveInfo) return <td key={type.id} className="px-4 py-3 text-center text-sm text-gray-400">—</td>;
                            return (
                              <td key={type.id} className="px-4 py-3 text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <span className={`text-sm font-bold ${type.text}`}>{leaveInfo.taken}</span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">Bal:</span>
                                    <span className={`text-xs ${leaveInfo.balance <= 2 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>{leaveInfo.balance}</span>
                                  </div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center text-sm text-gray-600">{employee.leaves.ML?.taken || employee.leaves.PTL?.taken || employee.leaves.CO?.taken || employee.leaves.LOP?.taken || 0}</td>
                          <td className="px-4 py-3 text-center bg-gray-50"><span className="text-lg font-bold text-gray-900">{employee.leaves.total}</span></td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${employee.attendance >= 95 ? 'bg-green-100 text-green-700' : employee.attendance >= 90 ? 'bg-yellow-100 text-yellow-700' : employee.attendance >= 80 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{employee.attendance}%</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button type="button" className="text-blue-600 hover:text-blue-700" onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}>
                              {expandedEmployee === employee.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                        {expandedEmployee === employee.id && (
                          <tr>
                            <td colSpan={10} className="px-4 py-3 bg-blue-50/30">
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700">Leave Details for {employee.name}</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  {Object.entries(employee.leaves).filter(([key]) => key !== 'total').map(([type, data]) => {
                                    const info = data as LeaveBucket;
                                    if (!info.details || info.details.length === 0) return null;
                                    return (
                                      <div key={type} className="bg-white rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className={`text-sm font-medium ${getLeaveTypeColor(type)}`}>{type} - {info.taken} days</span>
                                        </div>
                                        <div className="space-y-1">
                                          {info.details.map((detail, idx) => (
                                            <div key={idx} className="text-xs text-gray-600">
                                              <CalendarCheck className="w-3 h-3 inline mr-1" />
                                              {detail.date} ({detail.days} days)
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr className="font-semibold">
                      <td className="px-4 py-3 text-sm text-gray-700 sticky left-0 bg-gray-100 border-r">Total ({leaveData.length} Employees)</td>
                      <td className="px-4 py-3" />
                      {leaveTypes.slice(0, 4).map((type) => {
                        const total = leaveData.reduce((sum, emp) => sum + (bucket(emp, type.id)?.taken || 0), 0);
                        return <td key={type.id} className="px-4 py-3 text-center"><span className={`text-sm font-bold ${type.text.replace('600', '700')}`}>{total}</span></td>;
                      })}
                      <td className="px-4 py-3 text-center text-sm font-bold text-gray-700">
                        {leaveData.reduce((sum, emp) => sum + (emp.leaves.ML?.taken || emp.leaves.PTL?.taken || emp.leaves.CO?.taken || emp.leaves.LOP?.taken || 0), 0)}
                      </td>
                      <td className="px-4 py-3 text-center text-lg font-bold text-gray-900 bg-gray-200">{totalLeavesTaken}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold text-green-700">{(leaveData.reduce((sum, emp) => sum + emp.attendance, 0) / leaveData.length).toFixed(1)}%</span>
                      </td>
                      <td className="px-4 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {viewMode === 'chart' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Leave Distribution by Type</h3>
                    <div className="space-y-3">
                      {leaveTypes.slice(0, 5).map((type) => {
                        const total = leaveData.reduce((sum, emp) => sum + (bucket(emp, type.id)?.taken || 0), 0);
                        const percentage = totalLeavesTaken > 0 ? (total / totalLeavesTaken) * 100 : 0;
                        return (
                          <div key={type.id}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-700">{type.name}</span>
                              <span className={`text-sm font-bold ${type.text}`}>{total}</span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${type.bar} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Department-wise Leave Usage</h3>
                    <div className="space-y-3">
                      {Object.entries(departmentStats).map(([dept, stats]) => (
                        <div key={dept} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{dept}</p>
                            <p className="text-xs text-gray-500">{stats.employees} employees</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{stats.totalLeaves}</p>
                            <p className="text-xs text-gray-500">Avg: {stats.avgLeaves}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'summary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3"><Calendar className="w-5 h-5 text-blue-600" /><h3 className="text-sm font-semibold text-blue-900">Most Used Leave Type</h3></div>
                    <p className="text-2xl font-bold text-blue-700">Casual Leave</p>
                    <p className="text-sm text-blue-600 mt-1">46 days total</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-3"><TrendingUp className="w-5 h-5 text-green-600" /><h3 className="text-sm font-semibold text-green-900">Highest Utilization</h3></div>
                    <p className="text-2xl font-bold text-green-700">Engineering</p>
                    <p className="text-sm text-green-600 mt-1">47 total leaves</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-3 mb-3"><Award className="w-5 h-5 text-purple-600" /><h3 className="text-sm font-semibold text-purple-900">Best Attendance</h3></div>
                    <p className="text-2xl font-bold text-purple-700">Robert Johnson</p>
                    <p className="text-sm text-purple-600 mt-1">93% attendance rate</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Average Leave per Month</p>
                          <p className="text-xs text-gray-600">Employees take an average of {avgLeavePerEmployee} leaves per month</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">High Sick Leave Usage</p>
                          <p className="text-xs text-gray-600">11 sick leaves taken, consider wellness programs</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Good Attendance Rate</p>
                          <p className="text-xs text-gray-600">Overall attendance at 91.2% - above target</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Leave Trend</p>
                          <p className="text-xs text-gray-600">12% increase compared to last month</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card title="Export Options">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700"><FileText className="w-4 h-4 mr-2" />Generate PDF Report</Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700"><FileSpreadsheet className="w-4 h-4 mr-2" />Export to Excel</Button>
              <Button variant="outline"><Mail className="w-4 h-4 mr-2" />Email Report</Button>
              <Button variant="outline"><Bookmark className="w-4 h-4 mr-2" />Save Template</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

type AbsenteeIssue = {
  date: string;
  type: 'absent' | 'late';
  reason: string;
  status: 'excused' | 'unexcused';
  notified?: boolean;
  scheduledTime?: string;
  actualTime?: string;
  lateBy?: number;
};

type AbsenteeEmployee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  manager: string;
  issues: AbsenteeIssue[];
  totalAbsent: number;
  totalLate: number;
  avgLateMinutes: number;
  pattern: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  previousWarnings: number;
};

const ABSENTEE_DEPARTMENTS = [
  { id: 'DEPT001', name: 'Engineering', employees: 45, manager: 'James Taylor', email: 'james.taylor@company.com' },
  { id: 'DEPT002', name: 'Human Resources', employees: 8, manager: 'Jane Smith', email: 'jane.smith@company.com' },
  { id: 'DEPT003', name: 'Finance', employees: 12, manager: 'Robert Johnson', email: 'robert.johnson@company.com' },
  { id: 'DEPT004', name: 'Marketing', employees: 15, manager: 'Emily Davis', email: 'emily.davis@company.com' },
  { id: 'DEPT005', name: 'Operations', employees: 20, manager: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
  { id: 'DEPT006', name: 'Sales', employees: 25, manager: 'Michael Brown', email: 'michael.brown@company.com' },
  { id: 'DEPT007', name: 'IT Support', employees: 10, manager: 'David Lee', email: 'david.lee@company.com' }
];

const ABSENTEE_DATA: AbsenteeEmployee[] = [
  {
    id: 'EMP001', name: 'John Doe', department: 'Engineering', designation: 'Senior Developer', manager: 'James Taylor',
    issues: [
      { date: '2024-01-15', type: 'absent', reason: 'Unauthorized absence', status: 'unexcused', notified: false },
      { date: '2024-01-22', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:45 AM', lateBy: 45, reason: 'Traffic', status: 'excused' },
      { date: '2024-01-25', type: 'late', scheduledTime: '09:00 AM', actualTime: '10:15 AM', lateBy: 75, reason: 'Not specified', status: 'unexcused' }
    ],
    totalAbsent: 1, totalLate: 2, avgLateMinutes: 60, pattern: 'Recurring late arrivals on Mondays', riskLevel: 'high', previousWarnings: 2
  },
  {
    id: 'EMP002', name: 'Lisa Anderson', department: 'Sales', designation: 'Sales Executive', manager: 'Michael Brown',
    issues: [
      { date: '2024-01-08', type: 'absent', reason: 'No call no show', status: 'unexcused', notified: false },
      { date: '2024-01-09', type: 'absent', reason: 'No call no show', status: 'unexcused', notified: false },
      { date: '2024-01-16', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:30 AM', lateBy: 30, reason: 'Personal emergency', status: 'excused' }
    ],
    totalAbsent: 2, totalLate: 1, avgLateMinutes: 30, pattern: 'Consecutive absences without notice', riskLevel: 'critical', previousWarnings: 3
  },
  {
    id: 'EMP003', name: 'Robert Chen', department: 'IT Support', designation: 'IT Administrator', manager: 'David Lee',
    issues: [
      { date: '2024-01-05', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:20 AM', lateBy: 20, reason: 'Public transport delay', status: 'excused' },
      { date: '2024-01-12', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:25 AM', lateBy: 25, reason: 'Traffic', status: 'excused' },
      { date: '2024-01-19', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:35 AM', lateBy: 35, reason: 'Not specified', status: 'unexcused' },
      { date: '2024-01-26', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:40 AM', lateBy: 40, reason: 'Weather', status: 'excused' }
    ],
    totalAbsent: 0, totalLate: 4, avgLateMinutes: 30, pattern: 'Consistent late arrivals (weekly)', riskLevel: 'medium', previousWarnings: 1
  },
  {
    id: 'EMP004', name: 'Sarah Williams', department: 'Marketing', designation: 'Content Writer', manager: 'Emily Davis',
    issues: [
      { date: '2024-01-03', type: 'absent', reason: 'Sick - no medical certificate', status: 'unexcused', notified: true },
      { date: '2024-01-17', type: 'absent', reason: 'Personal leave - unapproved', status: 'unexcused', notified: true },
      { date: '2024-01-24', type: 'late', scheduledTime: '09:00 AM', actualTime: '10:30 AM', lateBy: 90, reason: 'Car breakdown', status: 'excused' }
    ],
    totalAbsent: 2, totalLate: 1, avgLateMinutes: 90, pattern: 'Frequent unexcused absences', riskLevel: 'high', previousWarnings: 2
  },
  {
    id: 'EMP005', name: 'Michael Park', department: 'Finance', designation: 'Financial Analyst', manager: 'Robert Johnson',
    issues: [
      { date: '2024-01-10', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:15 AM', lateBy: 15, reason: 'Traffic', status: 'excused' }
    ],
    totalAbsent: 0, totalLate: 1, avgLateMinutes: 15, pattern: 'Minor - isolated incident', riskLevel: 'low', previousWarnings: 0
  },
  {
    id: 'EMP006', name: 'Jennifer Adams', department: 'Operations', designation: 'Operations Coordinator', manager: 'Sarah Wilson',
    issues: [
      { date: '2024-01-11', type: 'absent', reason: 'No show - unreachable', status: 'unexcused', notified: false },
      { date: '2024-01-18', type: 'late', scheduledTime: '08:00 AM', actualTime: '08:45 AM', lateBy: 45, reason: 'Overslept', status: 'unexcused' },
      { date: '2024-01-23', type: 'late', scheduledTime: '08:00 AM', actualTime: '09:00 AM', lateBy: 60, reason: 'Not specified', status: 'unexcused' },
      { date: '2024-01-30', type: 'absent', reason: 'Called in sick - no certificate', status: 'unexcused', notified: true }
    ],
    totalAbsent: 2, totalLate: 2, avgLateMinutes: 52, pattern: 'Erratic attendance pattern', riskLevel: 'critical', previousWarnings: 4
  },
  {
    id: 'EMP007', name: 'David Kim', department: 'Engineering', designation: 'Developer', manager: 'James Taylor',
    issues: [
      { date: '2024-01-29', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:50 AM', lateBy: 50, reason: 'Medical appointment ran late', status: 'excused' }
    ],
    totalAbsent: 0, totalLate: 1, avgLateMinutes: 50, pattern: 'Minor - isolated incident', riskLevel: 'low', previousWarnings: 0
  },
  {
    id: 'EMP008', name: 'Emma Thompson', department: 'HR', designation: 'HR Coordinator', manager: 'Jane Smith',
    issues: [
      { date: '2024-01-04', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:10 AM', lateBy: 10, reason: 'Traffic', status: 'excused' },
      { date: '2024-01-14', type: 'late', scheduledTime: '09:00 AM', actualTime: '09:12 AM', lateBy: 12, reason: 'Parking issues', status: 'excused' }
    ],
    totalAbsent: 0, totalLate: 2, avgLateMinutes: 11, pattern: 'Minor delays - within grace period consideration', riskLevel: 'low', previousWarnings: 0
  }
];

const iso = (d: Date) => d.toISOString().split('T')[0];

function EmbeddedAbsenteeReport() {
  const [selectedDateFrom, setSelectedDateFrom] = useState('2024-01-01');
  const [selectedDateTo, setSelectedDateTo] = useState('2024-01-31');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [reportType, setReportType] = useState<'absent' | 'late' | 'both'>('both');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [unexcusedOnly, setUnexcusedOnly] = useState(true);
  const [repeatOnly, setRepeatOnly] = useState(false);
  const [extraEmail, setExtraEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Absentee/Latecomer Report - ${selectedDateFrom} to ${selectedDateTo}`);

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const setPreset = (kind: 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    if (kind === 'thisMonth') {
      setSelectedDateFrom(iso(new Date(now.getFullYear(), now.getMonth(), 1)));
      setSelectedDateTo(iso(now));
    } else if (kind === 'lastMonth') {
      setSelectedDateFrom(iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
      setSelectedDateTo(iso(new Date(now.getFullYear(), now.getMonth(), 0)));
    } else if (kind === 'thisWeek') {
      const day = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - ((day + 6) % 7));
      setSelectedDateFrom(iso(start));
      setSelectedDateTo(iso(now));
    } else {
      const day = now.getDay();
      const start = new Date(now);
      start.setDate(now.getDate() - ((day + 6) % 7) - 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setSelectedDateFrom(iso(start));
      setSelectedDateTo(iso(end));
    }
  };

  const toggleDepartment = (id: string) => {
    setSelectedDepartments((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  };
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  };

  const filteredData = ABSENTEE_DATA.filter((emp) => {
    if (selectedDepartments.length > 0) {
      const dept = ABSENTEE_DEPARTMENTS.find((d) => d.name === emp.department);
      if (!dept || !selectedDepartments.includes(dept.id)) return false;
    }
    if (reportType === 'absent' && emp.totalAbsent === 0) return false;
    if (reportType === 'late' && emp.totalLate === 0) return false;
    if (repeatOnly && emp.previousWarnings < 2) return false;
    if (unexcusedOnly && !emp.issues.some((i) => i.status === 'unexcused')) return false;
    return true;
  });

  const toggleSelectAll = () => {
    setSelectedRows(selectedRows.length === filteredData.length ? [] : filteredData.map((e) => e.id));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      setIsGenerating(false);
      flash('Absentee / latecomer report generated.');
    }, 1200);
  };

  const getRiskBadge = (level: AbsenteeEmployee['riskLevel']) => {
    if (level === 'critical') return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3 h-3" />Critical</span>;
    if (level === 'high') return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200"><AlertTriangle className="w-3 h-3" />High Risk</span>;
    if (level === 'medium') return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200"><Flag className="w-3 h-3" />Medium</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3" />Low</span>;
  };

  const totalAbsences = filteredData.reduce((sum, emp) => sum + emp.totalAbsent, 0);
  const totalLateInstances = filteredData.reduce((sum, emp) => sum + emp.totalLate, 0);
  const criticalCount = filteredData.filter((emp) => emp.riskLevel === 'critical').length;
  const highRiskCount = filteredData.filter((emp) => emp.riskLevel === 'high').length;

  const downloadCsv = () => {
    const header = ['Emp ID', 'Name', 'Department', 'Absences', 'Late', 'Avg Late', 'Pattern', 'Risk', 'Warnings'];
    const body = filteredData.map((e) => [e.id, e.name, e.department, e.totalAbsent, e.totalLate, e.avgLateMinutes, e.pattern, e.riskLevel, e.previousWarnings]);
    const csv = [header, ...body].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `absentee-latecomer-${selectedDateFrom}-to-${selectedDateTo}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash('Excel file exported.');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Absentee / Latecomer Report</h1>
          <p className="text-sm text-gray-500">Non-compliance report highlighting attendance issues and patterns</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={() => flash('Opened previous generated reports.')}><History className="w-4 h-4 mr-2" />Report History</Button>
          <Button variant="outline" onClick={() => flash('Alert settings saved for this session.')}><Settings className="w-4 h-4 mr-2" />Alert Settings</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setShowEmailModal(true)}><Mail className="w-4 h-4 mr-2" />Email Report</Button>
        </div>
      </div>

      {notice && <div className="rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm text-indigo-800">{notice}</div>}

      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="bg-red-100 p-3 rounded-lg"><AlertCircle className="w-6 h-6 text-red-600" /></div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800">Attention Required</h3>
            <p className="text-sm text-red-700 mt-1">{criticalCount} critical and {highRiskCount} high-risk employees identified in the selected period. Immediate action recommended.</p>
            <div className="flex gap-3 mt-3 flex-wrap">
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100" onClick={() => flash('Alerts sent to department managers.')}><BellRing className="w-4 h-4 mr-2" />Send Alerts to Managers</Button>
              <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-100" onClick={() => flash('Warning letters queued for high-risk employees.')}><FileText className="w-4 h-4 mr-2" />Generate Warning Letters</Button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-700">{criticalCount + highRiskCount}</p>
            <p className="text-xs text-red-600">Need Attention</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2"><UserX className="w-5 h-5 text-red-600" /><span className="text-xs text-red-600 font-medium">Total</span></div>
          <p className="text-2xl font-bold text-red-700">{totalAbsences}</p>
          <p className="text-xs text-red-600">Absences</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center justify-between mb-2"><TimerOff className="w-5 h-5 text-orange-600" /><span className="text-xs text-orange-600 font-medium">Total</span></div>
          <p className="text-2xl font-bold text-orange-700">{totalLateInstances}</p>
          <p className="text-xs text-orange-600">Late Arrivals</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2"><Users className="w-5 h-5 text-purple-600" /><span className="text-xs text-purple-600 font-medium">Affected</span></div>
          <p className="text-2xl font-bold text-purple-700">{filteredData.length}</p>
          <p className="text-xs text-purple-600">Employees</p>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl border border-red-300">
          <div className="flex items-center justify-between mb-2"><AlertCircle className="w-5 h-5 text-red-700" /><span className="text-xs text-red-700 font-medium">Critical</span></div>
          <p className="text-2xl font-bold text-red-800">{criticalCount}</p>
          <p className="text-xs text-red-700">Critical Cases</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-2"><XCircle className="w-5 h-5 text-yellow-600" /><span className="text-xs text-yellow-600 font-medium">Status</span></div>
          <p className="text-2xl font-bold text-yellow-700">68%</p>
          <p className="text-xs text-yellow-600">Unexcused</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2"><Clock className="w-5 h-5 text-blue-600" /><span className="text-xs text-blue-600 font-medium">Avg</span></div>
          <p className="text-2xl font-bold text-blue-700">38m</p>
          <p className="text-xs text-blue-600">Late Duration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Date Range">
            <div className="space-y-4">
              <Input label="From Date" type="date" value={selectedDateFrom} onChange={(e) => setSelectedDateFrom(e.target.value)} />
              <Input label="To Date" type="date" value={selectedDateTo} onChange={(e) => setSelectedDateTo(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreset('thisWeek')}>This Week</Button>
                <Button variant="outline" size="sm" onClick={() => setPreset('lastWeek')}>Last Week</Button>
                <Button variant="outline" size="sm" onClick={() => setPreset('thisMonth')}>This Month</Button>
                <Button variant="outline" size="sm" onClick={() => setPreset('lastMonth')}>Last Month</Button>
              </div>
            </div>
          </Card>

          <Card title="Department Filter">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Filter by department</span>
                <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setSelectedDepartments(ABSENTEE_DEPARTMENTS.map((d) => d.id))}>Select All</button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {ABSENTEE_DEPARTMENTS.map((dept) => (
                  <div key={dept.id} onClick={() => toggleDepartment(dept.id)} className={`p-3 rounded-lg cursor-pointer transition-all ${selectedDepartments.includes(dept.id) ? 'bg-blue-50 border-2 border-blue-500' : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={selectedDepartments.includes(dept.id)} onChange={() => undefined} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                      <Building className="w-4 h-4 text-gray-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dept.name}</p>
                        <p className="text-xs text-gray-500">{dept.employees} employees</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedDepartments([])}>Clear Selection</Button>
            </div>
          </Card>

          <Card title="Report Type">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Select what to include in the report</p>
              {([
                { id: 'absent' as const, title: 'Show Absent Only', sub: 'Employees with absences', icon: UserX, on: 'bg-red-50 border-2 border-red-500', iconCls: 'text-red-500' },
                { id: 'late' as const, title: 'Show Late Comers', sub: 'Employees with late arrivals', icon: TimerOff, on: 'bg-orange-50 border-2 border-orange-500', iconCls: 'text-orange-500' },
                { id: 'both' as const, title: 'Both', sub: 'All non-compliance issues', icon: AlertTriangle, on: 'bg-purple-50 border-2 border-purple-500', iconCls: 'text-purple-500' }
              ]).map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${reportType === opt.id ? opt.on : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`} onClick={() => setReportType(opt.id)}>
                  <input type="radio" name="absenteeReportType" checked={reportType === opt.id} onChange={() => undefined} className="h-4 w-4" />
                  <opt.icon className={`w-5 h-5 ${opt.iconCls}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{opt.title}</p>
                    <p className="text-xs text-gray-500">{opt.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card title="Additional Options">
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" checked={unexcusedOnly} onChange={(e) => setUnexcusedOnly(e.target.checked)} /><span className="text-sm text-gray-700">Show unexcused only</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" checked={repeatOnly} onChange={(e) => setRepeatOnly(e.target.checked)} /><span className="text-sm text-gray-700">Show repeat offenders only</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" defaultChecked /><span className="text-sm text-gray-700">Include patterns analysis</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" /><span className="text-sm text-gray-700">Group by department</span></label>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Non-Compliance Report</h3>
                <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">{filteredData.length} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleGenerateReport}><RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />Refresh</Button>
                <Button variant="outline" size="sm" onClick={() => flash('Sorted by risk level.')}><Filter className="w-4 h-4 mr-2" />Sort By</Button>
                <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print</Button>
              </div>
            </div>

            {selectedRows.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-blue-700"><span className="font-semibold">{selectedRows.length}</span> employee(s) selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => flash(`Warning issued to ${selectedRows.length} employee(s).`)}><AlertTriangle className="w-3 h-3 mr-1" />Issue Warning</Button>
                  <Button variant="outline" size="sm" onClick={() => flash(`Notice emailed to ${selectedRows.length} employee(s).`)}><Mail className="w-3 h-3 mr-1" />Send Notice</Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedRows([])}>Clear</Button>
                </div>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" checked={filteredData.length > 0 && selectedRows.length === filteredData.length} onChange={toggleSelectAll} /></th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase bg-red-50 text-red-700">Absences</th>
                      <th className="px-4 py-3 text-center text-xs font-medium uppercase bg-orange-50 text-orange-700">Late Arrivals</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Late</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pattern</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Warnings</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((employee, index) => (
                      <Fragment key={employee.id}>
                        <tr className={`hover:bg-gray-50 ${selectedRows.includes(employee.id) ? 'bg-blue-50' : employee.riskLevel === 'critical' ? 'bg-red-50/30' : employee.riskLevel === 'high' ? 'bg-orange-50/30' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <td className="px-3 py-3"><input type="checkbox" className="h-4 w-4 text-blue-600 rounded" checked={selectedRows.includes(employee.id)} onChange={() => toggleRowSelection(employee.id)} /></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${employee.riskLevel === 'critical' ? 'bg-red-100' : employee.riskLevel === 'high' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                                <span className={`text-sm font-medium ${employee.riskLevel === 'critical' ? 'text-red-700' : employee.riskLevel === 'high' ? 'text-orange-700' : 'text-blue-700'}`}>{employee.name.split(' ').map((n) => n[0]).join('')}</span>
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
                          <td className="px-4 py-3 text-center bg-red-50/30">{employee.totalAbsent > 0 ? <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-red-100 text-red-700">{employee.totalAbsent}</span> : <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3 text-center bg-orange-50/30">{employee.totalLate > 0 ? <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full bg-orange-100 text-orange-700">{employee.totalLate}</span> : <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3 text-center">{employee.totalLate > 0 ? <span className={`text-sm font-medium ${employee.avgLateMinutes > 60 ? 'text-red-600' : employee.avgLateMinutes > 30 ? 'text-orange-600' : 'text-yellow-600'}`}>{employee.avgLateMinutes}m</span> : <span className="text-gray-400">—</span>}</td>
                          <td className="px-4 py-3"><p className="text-xs text-gray-700 max-w-xs truncate" title={employee.pattern}>{employee.pattern}</p></td>
                          <td className="px-4 py-3 text-center">{getRiskBadge(employee.riskLevel)}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full ${employee.previousWarnings >= 3 ? 'bg-red-100 text-red-700' : employee.previousWarnings >= 2 ? 'bg-orange-100 text-orange-700' : employee.previousWarnings > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{employee.previousWarnings}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" onClick={() => setExpandedEmployee(expandedEmployee === employee.id ? null : employee.id)}>{expandedEmployee === employee.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}</button>
                              <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="Send Warning" onClick={() => flash(`Warning sent to ${employee.name}.`)}><AlertTriangle className="w-4 h-4 text-orange-500" /></button>
                              <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="Contact Employee" onClick={() => flash(`Contacting ${employee.name}.`)}><Phone className="w-4 h-4 text-blue-500" /></button>
                              <button type="button" className="p-1.5 hover:bg-gray-200 rounded-lg" title="More Options" onClick={() => flash(`More actions for ${employee.name}.`)}><MoreHorizontal className="w-4 h-4 text-gray-500" /></button>
                            </div>
                          </td>
                        </tr>
                        {expandedEmployee === employee.id && (
                          <tr>
                            <td colSpan={10} className="px-4 py-4 bg-gray-50">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900">Detailed Issue Log for {employee.name}</h4>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => flash(`Full history opened for ${employee.name}.`)}><FileText className="w-3 h-3 mr-1" />View Full History</Button>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-300" onClick={() => flash(`Warning issued to ${employee.name}.`)}><AlertTriangle className="w-3 h-3 mr-1" />Issue Warning</Button>
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
                                      {employee.issues.map((issue, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                          <td className="px-4 py-2 text-sm text-gray-900">{issue.date}</td>
                                          <td className="px-4 py-2">
                                            {issue.type === 'absent'
                                              ? <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700"><UserX className="w-3 h-3" />Absent</span>
                                              : <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700"><TimerOff className="w-3 h-3" />Late</span>}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">
                                            {issue.type === 'late'
                                              ? <span>{issue.scheduledTime} → {issue.actualTime}<span className="text-red-600 font-medium ml-1">({issue.lateBy}m late)</span></span>
                                              : <span>Full day absence</span>}
                                          </td>
                                          <td className="px-4 py-2 text-sm text-gray-600">{issue.reason}</td>
                                          <td className="px-4 py-2 text-center">
                                            {issue.status === 'excused'
                                              ? <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Excused</span>
                                              : <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Unexcused</span>}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr className="font-semibold">
                      <td className="px-3 py-3" />
                      <td className="px-4 py-3 text-sm text-gray-700">Total: {filteredData.length} Employees</td>
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3 text-center bg-red-100"><span className="text-lg font-bold text-red-700">{totalAbsences}</span></td>
                      <td className="px-4 py-3 text-center bg-orange-100"><span className="text-lg font-bold text-orange-700">{totalLateInstances}</span></td>
                      <td colSpan={5} className="px-4 py-3" />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </Card>

          <Card title="Export & Share">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" className="bg-blue-600 hover:bg-blue-700" onClick={() => flash('PDF report generated.')}><FileText className="w-4 h-4 mr-2" />Generate PDF</Button>
              <Button variant="primary" className="bg-green-600 hover:bg-green-700" onClick={downloadCsv}><FileSpreadsheet className="w-4 h-4 mr-2" />Export Excel</Button>
              <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setShowEmailModal(true)}><Mail className="w-4 h-4 mr-2" />Email Report</Button>
              <Button variant="outline" onClick={() => flash('Template saved.')}><Bookmark className="w-4 h-4 mr-2" />Save Template</Button>
            </div>
          </Card>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Email Report to Managers</h2>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => setShowEmailModal(false)}><XCircle className="w-5 h-5 text-gray-500" /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {ABSENTEE_DEPARTMENTS.map((dept) => (
                    <label key={dept.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" defaultChecked />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{dept.manager}</p>
                        <p className="text-xs text-gray-500">{dept.name} • {dept.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <Input label="Additional Recipients" type="email" placeholder="Enter email addresses (comma separated)" value={extraEmail} onChange={(e) => setExtraEmail(e.target.value)} />
              <Input label="Email Subject" type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder="Add a custom message to the email..." />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-800">This report contains sensitive employee data. Ensure recipients are authorized to view this information.</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>Cancel</Button>
              <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => { setShowEmailModal(false); flash('Report emailed to selected managers.'); }}><Send className="w-4 h-4 mr-2" />Send Report</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type AttendanceReportView = 'attendance' | 'leave' | 'absentee';

const ATTENDANCE_REPORT_VIEWS: { id: AttendanceReportView; label: string }[] = [
  { id: 'attendance', label: 'Attendance Report' },
  { id: 'leave', label: 'Leave Report' },
  { id: 'absentee', label: 'Absentee / Latecomer Report' }
];

export function HrAttendanceReport() {
  const [view, setView] = useState<AttendanceReportView>('attendance');
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-6 pt-6">
        <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <span className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Report type</span>
          {ATTENDANCE_REPORT_VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {view === 'attendance' && <AttendanceReportTemplates />}
      {view === 'leave' && <EmbeddedLeaveReport />}
      {view === 'absentee' && <EmbeddedAbsenteeReport />}
    </div>
  );
}
