// AttendanceReports.tsx - Attendance Reports with Branch & Batch Selection

import React, { useState, useMemo } from 'react';
import {
  FileText, Download, BarChart, TrendingUp, Users, Calendar, Filter, X, Search, Eye, Printer, Mail,
  RefreshCw, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight,
  UserCheck, UserX, Activity, AlertTriangle, ClipboardList, CalendarDays, GraduationCap, Timer,
  FileCheck, CalendarX, BarChart3, MapPin, Check, Building } from
'lucide-react';

// Types
interface StudentAttendanceSummary {
  id: string;studentId: string;studentName: string;rollNo: string;class: string;section: string;
  gender: 'Male' | 'Female' | 'Other';parentName: string;mobile: string;totalDays: number;
  presentDays: number;absentDays: number;lateDays: number;halfDays: number;leaveDays: number;
  attendancePercentage: number;consecutiveAbsent: number;lastAbsentDate?: string;
  branch: string;batch: string;
}

interface ReportTemplate {
  id: string;title: string;description: string;icon: React.ElementType;
  category: 'register' | 'summary' | 'analysis' | 'defaulter';lastGenerated?: string;
}

interface GeneratedReport {
  id: string;name: string;type: string;generatedAt: string;generatedBy: string;
  status: 'completed' | 'processing' | 'failed';filters: Record<string, string>;
}

// Branch & Batch Options
const branchOptions = [
{ value: 'main-campus', label: 'Main Campus - Ahmedabad', color: 'bg-blue-500' },
{ value: 'satellite', label: 'Satellite Branch - Ahmedabad', color: 'bg-green-500' },
{ value: 'gandhinagar', label: 'Gandhinagar Branch', color: 'bg-purple-500' },
{ value: 'vadodara', label: 'Vadodara Branch', color: 'bg-orange-500' },
{ value: 'surat', label: 'Surat Branch', color: 'bg-pink-500' },
{ value: 'rajkot', label: 'Rajkot Branch', color: 'bg-cyan-500' }];


const batchOptions = [
{ value: '', label: 'All Batches' },
{ value: 'morning', label: 'Morning (7:00 AM - 12:00 PM)' },
{ value: 'afternoon', label: 'Afternoon (12:00 PM - 5:00 PM)' },
{ value: 'evening', label: 'Evening (5:00 PM - 8:00 PM)' },
{ value: 'full-day', label: 'Full Day' }];


// Sample Data
const studentAttendanceData: StudentAttendanceSummary[] = [
{ id: '1', studentId: 'STU/2024/001', studentName: 'Rahul Sharma', rollNo: '01', class: 'Class 10', section: 'A', gender: 'Male', parentName: 'Amit Sharma', mobile: '+91 98765 43210', totalDays: 25, presentDays: 23, absentDays: 1, lateDays: 1, halfDays: 0, leaveDays: 0, attendancePercentage: 92, consecutiveAbsent: 0, branch: 'main-campus', batch: 'morning' },
{ id: '2', studentId: 'STU/2024/002', studentName: 'Priya Patel', rollNo: '02', class: 'Class 10', section: 'A', gender: 'Female', parentName: 'Rajesh Patel', mobile: '+91 98765 43211', totalDays: 25, presentDays: 20, absentDays: 3, lateDays: 2, halfDays: 0, leaveDays: 0, attendancePercentage: 80, consecutiveAbsent: 0, branch: 'main-campus', batch: 'afternoon' },
{ id: '3', studentId: 'STU/2024/003', studentName: 'Vikram Singh', rollNo: '03', class: 'Class 9', section: 'B', gender: 'Male', parentName: 'Harpreet Singh', mobile: '+91 76543 21098', totalDays: 25, presentDays: 17, absentDays: 6, lateDays: 1, halfDays: 1, leaveDays: 0, attendancePercentage: 68, consecutiveAbsent: 4, lastAbsentDate: '2024-02-15', branch: 'gandhinagar', batch: 'morning' },
{ id: '4', studentId: 'STU/2024/004', studentName: 'Ananya Reddy', rollNo: '04', class: 'Class 11', section: 'A', gender: 'Female', parentName: 'Suresh Reddy', mobile: '+91 65432 10987', totalDays: 25, presentDays: 24, absentDays: 0, lateDays: 1, halfDays: 0, leaveDays: 0, attendancePercentage: 96, consecutiveAbsent: 0, branch: 'satellite', batch: 'full-day' },
{ id: '5', studentId: 'STU/2024/005', studentName: 'Arjun Nair', rollNo: '05', class: 'Class 8', section: 'A', gender: 'Male', parentName: 'Krishnan Nair', mobile: '+91 54321 09876', totalDays: 25, presentDays: 22, absentDays: 2, lateDays: 0, halfDays: 1, leaveDays: 0, attendancePercentage: 88, consecutiveAbsent: 0, branch: 'vadodara', batch: 'morning' },
{ id: '6', studentId: 'STU/2024/006', studentName: 'Kavya Menon', rollNo: '06', class: 'Class 7', section: 'B', gender: 'Female', parentName: 'Sunil Menon', mobile: '+91 87654 32109', totalDays: 25, presentDays: 25, absentDays: 0, lateDays: 0, halfDays: 0, leaveDays: 0, attendancePercentage: 100, consecutiveAbsent: 0, branch: 'surat', batch: 'afternoon' },
{ id: '7', studentId: 'STU/2024/007', studentName: 'Rohan Gupta', rollNo: '07', class: 'Class 10', section: 'B', gender: 'Male', parentName: 'Ramesh Gupta', mobile: '+91 98123 45678', totalDays: 25, presentDays: 15, absentDays: 8, lateDays: 2, halfDays: 0, leaveDays: 0, attendancePercentage: 60, consecutiveAbsent: 5, lastAbsentDate: '2024-02-16', branch: 'rajkot', batch: 'evening' },
{ id: '8', studentId: 'STU/2024/008', studentName: 'Sneha Iyer', rollNo: '08', class: 'Class 9', section: 'A', gender: 'Female', parentName: 'Venkat Iyer', mobile: '+91 87612 34567', totalDays: 25, presentDays: 21, absentDays: 2, lateDays: 1, halfDays: 1, leaveDays: 0, attendancePercentage: 84, consecutiveAbsent: 0, branch: 'main-campus', batch: 'morning' },
{ id: '9', studentId: 'STU/2024/009', studentName: 'Aditya Kumar', rollNo: '09', class: 'Class 10', section: 'A', gender: 'Male', parentName: 'Vijay Kumar', mobile: '+91 98456 12345', totalDays: 25, presentDays: 18, absentDays: 5, lateDays: 2, halfDays: 0, leaveDays: 0, attendancePercentage: 72, consecutiveAbsent: 3, lastAbsentDate: '2024-02-14', branch: 'satellite', batch: 'morning' },
{ id: '10', studentId: 'STU/2024/010', studentName: 'Meera Das', rollNo: '10', class: 'Class 8', section: 'B', gender: 'Female', parentName: 'Ashok Das', mobile: '+91 87654 98765', totalDays: 25, presentDays: 24, absentDays: 1, lateDays: 0, halfDays: 0, leaveDays: 0, attendancePercentage: 96, consecutiveAbsent: 0, branch: 'gandhinagar', batch: 'afternoon' }];


const reportTemplates: ReportTemplate[] = [
{ id: '1', title: 'Attendance Register', description: 'Complete day-wise attendance register for a class.', icon: ClipboardList, category: 'register', lastGenerated: '2024-02-15' },
{ id: '2', title: 'Attendance Report', description: 'Comprehensive attendance report with statistics.', icon: FileText, category: 'summary', lastGenerated: '2024-02-14' },
{ id: '3', title: 'Class-wise Attendance', description: 'Attendance summary broken down by class.', icon: GraduationCap, category: 'summary', lastGenerated: '2024-02-13' },
{ id: '4', title: 'Class & Gender-wise Attendance', description: 'Attendance analysis by class and gender.', icon: Users, category: 'analysis', lastGenerated: '2024-02-12' },
{ id: '5', title: 'Daily Attendance Summary', description: 'Class-wise summary for a specific date.', icon: CalendarDays, category: 'summary', lastGenerated: '2024-02-15' },
{ id: '6', title: 'Monthly Attendance Register', description: 'Detailed monthly attendance register.', icon: Calendar, category: 'register', lastGenerated: '2024-02-10' },
{ id: '7', title: 'Defaulter List Report', description: 'Students with attendance below threshold.', icon: AlertTriangle, category: 'defaulter' },
{ id: '8', title: 'Late Arrival Report', description: 'Students frequently arriving late.', icon: Timer, category: 'analysis' },
{ id: '9', title: 'Consecutive Absence Report', description: 'Students absent for 3+ consecutive days.', icon: CalendarX, category: 'defaulter', lastGenerated: '2024-02-14' },
{ id: '10', title: 'Attendance Trend Analysis', description: 'Graphical analysis of attendance trends.', icon: TrendingUp, category: 'analysis' },
{ id: '11', title: 'Section-wise Comparison', description: 'Compare attendance across sections.', icon: BarChart3, category: 'analysis' },
{ id: '12', title: 'Student-wise Detailed Report', description: 'Individual student attendance report.', icon: UserCheck, category: 'summary' }];


// UI Components
const Card = ({ title, children, className = '', headerAction }: {title?: string;children: React.ReactNode;className?: string;headerAction?: React.ReactNode;}) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {title && <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-semibold text-gray-900">{title}</h3>{headerAction}</div>}
    <div className={title ? 'p-5' : ''}>{children}</div>
  </div>;


const Badge = ({ children, variant = 'default' }: {children: React.ReactNode;variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';}) => {
  const variants = { default: 'bg-gray-100 text-gray-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700', info: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>);

};

const Toast = ({ message, type, onClose }: {message: string;type: 'success' | 'error' | 'info';onClose: () => void;}) => {
  const icons = { success: CheckCircle, error: AlertCircle, info: Clock };
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  const Icon = icons[type];
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${colors[type]} text-white`}>
      <Icon className="w-5 h-5" /><span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded"><X className="w-4 h-4" /></button>
    </div>);

};

// Main Component
export function AttendanceReports() {
  // States
  const [filters, setFilters] = useState({ period: 'all', class: 'all', section: 'all', gender: 'all', attendance: 'all', status: 'all', search: '' });
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reportFilters, setReportFilters] = useState({ academicYear: '2024-25', dateFrom: '', dateTo: '', class: 'all', section: 'all', gender: 'all', attendanceThreshold: '75', status: 'all', format: 'pdf' });
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
  { id: '1', name: 'Monthly Attendance Register - Feb 2024', type: 'Attendance Register', generatedAt: '2024-02-15 10:30 AM', generatedBy: 'Admin User', status: 'completed', filters: { academicYear: '2024-25', class: 'Class 10' } },
  { id: '2', name: 'Defaulter List - Below 75%', type: 'Defaulter List Report', generatedAt: '2024-02-14 03:45 PM', generatedBy: 'Admin User', status: 'completed', filters: { threshold: '75%', class: 'All' } }]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'generated' | 'data'>('templates');
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [toast, setToast] = useState<{message: string;type: 'success' | 'error' | 'info';} | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [collapsedBranches, setCollapsedBranches] = useState<string[]>([]);

  // Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {setToast({ message, type });setTimeout(() => setToast(null), 4000);};
  const getBranchLabel = (v: string) => branchOptions.find((b) => b.value === v)?.label || v;
  const getBranchColor = (v: string) => branchOptions.find((b) => b.value === v)?.color || 'bg-gray-500';
  const toggleBranch = (v: string) => setSelectedBranches((prev) => prev.includes(v) ? prev.filter((b) => b !== v) : [...prev, v]);
  const toggleBranchCollapse = (b: string) => setCollapsedBranches((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  const getAttendanceBadge = (p: number) => p >= 90 ? <Badge variant="success">{p}%</Badge> : p >= 75 ? <Badge variant="warning">{p}%</Badge> : <Badge variant="error">{p}%</Badge>;

  // Filtered Data
  const filteredStudents = useMemo(() => {
    return studentAttendanceData.filter((s) => {
      if (selectedBranches.length > 0 && !selectedBranches.includes(s.branch)) return false;
      if (selectedBatch && s.batch !== selectedBatch) return false;
      if (filters.class !== 'all' && !s.class.toLowerCase().includes(filters.class.toLowerCase())) return false;
      if (filters.section !== 'all' && s.section !== filters.section) return false;
      if (filters.gender !== 'all' && s.gender !== filters.gender) return false;
      if (filters.attendance === 'above90' && s.attendancePercentage < 90) return false;
      if (filters.attendance === 'between75-90' && (s.attendancePercentage < 75 || s.attendancePercentage >= 90)) return false;
      if (filters.attendance === 'below75' && s.attendancePercentage >= 75) return false;
      if (filters.status === 'defaulter' && s.attendancePercentage >= 75) return false;
      if (filters.status === 'consecutiveAbsent' && s.consecutiveAbsent < 3) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!s.studentName.toLowerCase().includes(q) && !s.studentId.toLowerCase().includes(q) && !s.rollNo.includes(q)) return false;
      }
      return true;
    });
  }, [filters, selectedBranches, selectedBatch]);

  // Grouped by Branch
  const groupedByBranch = useMemo(() => {
    const groups: Record<string, StudentAttendanceSummary[]> = {};
    filteredStudents.forEach((s) => {if (!groups[s.branch]) groups[s.branch] = [];groups[s.branch].push(s);});
    return groups;
  }, [filteredStudents]);

  // Branch Stats
  const branchStats = useMemo(() => {
    const stats: Record<string, {total: number;present: number;absent: number;avgAttendance: number;defaulters: number;}> = {};
    Object.entries(groupedByBranch).forEach(([branch, students]) => {
      const total = students.length;
      const present = students.reduce((sum, s) => sum + s.presentDays, 0);
      const absent = students.reduce((sum, s) => sum + s.absentDays, 0);
      const avgAttendance = students.reduce((sum, s) => sum + s.attendancePercentage, 0) / total;
      const defaulters = students.filter((s) => s.attendancePercentage < 75).length;
      stats[branch] = { total, present, absent, avgAttendance, defaulters };
    });
    return stats;
  }, [groupedByBranch]);

  // Overall Stats
  const stats = useMemo(() => ({
    totalStudents: filteredStudents.length,
    presentTotal: filteredStudents.reduce((sum, s) => sum + s.presentDays, 0),
    absentTotal: filteredStudents.reduce((sum, s) => sum + s.absentDays, 0),
    lateTotal: filteredStudents.reduce((sum, s) => sum + s.lateDays, 0),
    avgAttendance: filteredStudents.length > 0 ? filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / filteredStudents.length : 0,
    defaulters: filteredStudents.filter((s) => s.attendancePercentage < 75).length,
    consecutiveAbsent: filteredStudents.filter((s) => s.consecutiveAbsent >= 3).length,
    above90: filteredStudents.filter((s) => s.attendancePercentage >= 90).length,
    between75And90: filteredStudents.filter((s) => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length,
    below75: filteredStudents.filter((s) => s.attendancePercentage < 75).length
  }), [filteredStudents]);

  const handleGenerateReport = () => {
    if (!selectedReportType) {showToast('Please select a report type', 'error');return;}
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: GeneratedReport = { id: Date.now().toString(), name: `${selectedReportType} - ${new Date().toLocaleDateString()}`, type: selectedReportType, generatedAt: new Date().toLocaleString(), generatedBy: 'Admin User', status: 'completed', filters: { ...reportFilters } };
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);setShowReportModal(false);setSelectedReportType('');
      showToast('Report generated successfully!');
    }, 2000);
  };

  const handleResetFilters = () => {setFilters({ period: 'all', class: 'all', section: 'all', gender: 'all', attendance: 'all', status: 'all', search: '' });setSelectedBranches([]);setSelectedBatch('');};
  const isFilterActive = Object.values(filters).some((v) => v !== 'all' && v !== '') || selectedBranches.length > 0 || selectedBatch !== '';
  const filteredTemplates = reportTemplates.filter((t) => reportCategoryFilter === 'all' || t.category === reportCategoryFilter);
  const inputClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const selectClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1><p className="text-gray-500 text-sm">Generate and analyze student attendance reports</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><BarChart className="w-4 h-4" />Generate Report</button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"><Download className="w-4 h-4" />Export All</button>
          </div>
        </div>
      </div>

      {/* Branch & Batch Selection */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Branch & Batch:</span></div>
          
          {/* Multi-select Branch */}
          <div className="relative">
            <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white min-w-[200px]">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="flex-1 text-left">
                {selectedBranches.length === 0 ? 'All Branches' : selectedBranches.length === branchOptions.length ? 'All Branches Selected' : `${selectedBranches.length} Branch(es)`}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showBranchDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showBranchDropdown &&
            <div className="absolute z-20 w-72 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2 border-b flex justify-between">
                  <button onClick={() => setSelectedBranches(branchOptions.map((b) => b.value))} className="text-xs text-blue-600 hover:text-blue-700 font-medium">Select All</button>
                  <button onClick={() => setSelectedBranches([])} className="text-xs text-gray-500 hover:text-gray-700">Clear All</button>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {branchOptions.map((branch) =>
                <label key={branch.value} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedBranches.includes(branch.value) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {selectedBranches.includes(branch.value) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`w-3 h-3 rounded-full ${branch.color}`}></span>
                      <span className="text-sm text-gray-700">{branch.label}</span>
                    </label>
                )}
                </div>
                <div className="p-2 border-t"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">Done</button></div>
              </div>
            }
          </div>

          {/* Selected Branch Tags */}
          {selectedBranches.length > 0 &&
          <div className="flex flex-wrap gap-1">
              {selectedBranches.slice(0, 3).map((b) =>
            <span key={b} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${getBranchColor(b)}`}>
                  {getBranchLabel(b).split(' - ')[0]}
                  <button onClick={() => toggleBranch(b)} className="hover:bg-white/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                </span>
            )}
              {selectedBranches.length > 3 && <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">+{selectedBranches.length - 3} more</span>}
            </div>
          }

          {/* Single-select Batch */}
          <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white">
            {batchOptions.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
          </select>

          {isFilterActive && <button onClick={handleResetFilters} className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><X className="w-4 h-4" />Reset</button>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {[{ id: 'templates', label: 'Report Templates', icon: FileText }, { id: 'generated', label: 'Generated Reports', icon: FileCheck }, { id: 'data', label: 'Live Data & Analytics', icon: Activity }].map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Templates Tab */}
        {activeTab === 'templates' &&
        <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              <div className="flex gap-2">
                {[{ id: 'all', label: 'All Reports' }, { id: 'register', label: 'Register' }, { id: 'summary', label: 'Summary' }, { id: 'analysis', label: 'Analysis' }, { id: 'defaulter', label: 'Defaulter' }].map((cat) =>
              <button key={cat.id} onClick={() => setReportCategoryFilter(cat.id)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${reportCategoryFilter === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat.label}</button>
              )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((report) =>
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg"><report.icon className="w-6 h-6 text-blue-600" /></div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      {report.lastGenerated && <p className="text-xs text-gray-400 mt-2">Last generated: {report.lastGenerated}</p>}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <Badge variant={report.category === 'register' ? 'info' : report.category === 'summary' ? 'success' : report.category === 'analysis' ? 'purple' : 'warning'}>{report.category.charAt(0).toUpperCase() + report.category.slice(1)}</Badge>
                    <div className="flex gap-1">
                      <button onClick={() => setPreviewReport(report)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => {setSelectedReportType(report.title);setShowReportModal(true);}} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><BarChart className="w-4 h-4" /></button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Download className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
            )}
            </div>
          </div>
        }

        {/* Generated Reports Tab */}
        {activeTab === 'generated' &&
        <Card title="Recently Generated Reports">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Report Name', 'Type', 'Generated At', 'Generated By', 'Status', 'Actions'].map((h) => <th key={h} className={`px-4 py-3 text-${h === 'Actions' ? 'right' : 'left'} text-xs font-medium text-gray-500 uppercase`}>{h}</th>)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedReports.map((report) =>
                <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-gray-400" /><span className="font-medium text-gray-900">{report.name}</span></div></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.generatedAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.generatedBy}</td>
                      <td className="px-4 py-3"><Badge variant={report.status === 'completed' ? 'success' : report.status === 'processing' ? 'warning' : 'error'}>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {[{ icon: Eye, color: 'blue' }, { icon: Download, color: 'green' }, { icon: Printer, color: 'purple' }, { icon: Mail, color: 'orange' }].map((a, i) =>
                      <button key={i} className={`p-1.5 text-gray-400 hover:text-${a.color}-600 hover:bg-${a.color}-50 rounded`}><a.icon className="w-4 h-4" /></button>
                      )}
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
            {generatedReports.length === 0 &&
          <div className="text-center py-12"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No reports generated yet</p></div>
          }
          </Card>
        }

        {/* Live Data Tab */}
        {activeTab === 'data' &&
        <div className="space-y-6">
            {/* Overall Summary */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div><h3 className="text-lg font-semibold text-gray-900">Overall Summary</h3><p className="text-sm text-gray-500">Showing {filteredStudents.length} students across {Object.keys(groupedByBranch).length} branch(es)</p></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
              { label: 'Total Students', value: stats.totalStudents, color: 'blue' },
              { label: 'Above 90%', value: stats.above90, color: 'green' },
              { label: '75% - 90%', value: stats.between75And90, color: 'yellow' },
              { label: 'Below 75%', value: stats.below75, color: 'red' },
              { label: 'Defaulters', value: stats.defaulters, color: 'orange' },
              { label: 'Consecutive Absent', value: stats.consecutiveAbsent, color: 'purple' },
              { label: 'Avg. Attendance', value: `${stats.avgAttendance.toFixed(1)}%`, color: 'teal' }].
              map((s, i) =>
              <div key={i} className={`p-3 bg-${s.color}-50 rounded-lg border border-${s.color}-200`}>
                    <p className="text-xs text-gray-600">{s.label}</p>
                    <p className={`text-xl font-bold text-${s.color}-700 mt-1`}>{s.value}</p>
                  </div>
              )}
              </div>
            </Card>

            {/* Branch Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(branchStats).map(([branch, stat]) =>
            <div key={branch} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-3 h-3 rounded-full ${getBranchColor(branch)}`}></span>
                    <span className="text-xs font-medium text-gray-600 truncate">{getBranchLabel(branch).split(' - ')[0]}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.total}</div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span className="text-green-600">{stat.avgAttendance.toFixed(0)}% avg</span>
                    <span className="text-red-600">{stat.defaulters} defaulters</span>
                  </div>
                </div>
            )}
            </div>

            {/* Branch-wise Data */}
            {Object.entries(groupedByBranch).map(([branch, students]) =>
          <Card key={branch} className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b cursor-pointer hover:bg-gray-50" onClick={() => toggleBranchCollapse(branch)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${getBranchColor(branch)}`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{getBranchLabel(branch)}</h3>
                        <p className="text-sm text-gray-500">{students.length} students | Avg: {branchStats[branch].avgAttendance.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden md:flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" />{students.filter((s) => s.attendancePercentage >= 90).length} Excellent</span>
                        <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4 text-red-500" />{branchStats[branch].defaulters} Defaulters</span>
                      </div>
                      {collapsedBranches.includes(branch) ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronUp className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {!collapsedBranches.includes(branch) &&
            <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Student ID', 'Student', 'Class', 'Batch', 'Present', 'Absent', 'Late', 'Attendance %', 'Status'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {students.map((student) =>
                  <tr key={student.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{student.studentId}</td>
                            <td className="px-4 py-3"><div><p className="font-medium text-gray-900">{student.studentName}</p><p className="text-xs text-gray-500">Roll: {student.rollNo} | {student.gender}</p></div></td>
                            <td className="px-4 py-3"><div><p className="text-sm text-gray-900">{student.class}</p><p className="text-xs text-gray-500">Section {student.section}</p></div></td>
                            <td className="px-4 py-3"><Badge variant="info">{student.batch.charAt(0).toUpperCase() + student.batch.slice(1).replace('-', ' ')}</Badge></td>
                            <td className="px-4 py-3 text-sm text-green-600 font-medium">{student.presentDays}</td>
                            <td className="px-4 py-3 text-sm text-red-600 font-medium">{student.absentDays}</td>
                            <td className="px-4 py-3 text-sm text-yellow-600 font-medium">{student.lateDays}</td>
                            <td className="px-4 py-3">{getAttendanceBadge(student.attendancePercentage)}</td>
                            <td className="px-4 py-3">{student.attendancePercentage < 75 ? <Badge variant="error">Defaulter</Badge> : student.consecutiveAbsent >= 3 ? <Badge variant="warning">Alert</Badge> : <Badge variant="success">Regular</Badge>}</td>
                          </tr>
                  )}
                      </tbody>
                    </table>
                  </div>
            }
              </Card>
          )}

            {Object.keys(groupedByBranch).length === 0 &&
          <Card className="p-8">
                <div className="text-center"><Users className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No students found matching your criteria</p><button onClick={handleResetFilters} className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">Clear all filters</button></div>
              </Card>
          }
          </div>
        }
      </div>

      {/* Generate Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => {setShowReportModal(false);setSelectedReportType('');}} title="Generate Attendance Report" size="xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
            <select value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)} className={selectClass}>
              <option value="">Select Report Type</option>
              {reportTemplates.map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
            </select>
          </div>

          {/* Branch & Batch Selection in Modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Branches</label>
              <p className="text-sm text-gray-600">{selectedBranches.length === 0 ? 'All Branches' : selectedBranches.map((b) => getBranchLabel(b).split(' - ')[0]).join(', ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected Batch</label>
              <p className="text-sm text-gray-600">{selectedBatch ? batchOptions.find((b) => b.value === selectedBatch)?.label : 'All Batches'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
            { label: 'Academic Year', field: 'academicYear', options: [{ v: '2024-25', l: '2024-2025' }, { v: '2023-24', l: '2023-2024' }] },
            { label: 'Class', field: 'class', options: [{ v: 'all', l: 'All Classes' }, ...['Nursery', 'LKG', 'UKG', ...Array(12).fill(0).map((_, i) => `Class ${i + 1}`)].map((c) => ({ v: c.toLowerCase(), l: c }))] },
            { label: 'Section', field: 'section', options: [{ v: 'all', l: 'All Sections' }, { v: 'A', l: 'Section A' }, { v: 'B', l: 'Section B' }, { v: 'C', l: 'Section C' }] },
            { label: 'Gender', field: 'gender', options: [{ v: 'all', l: 'All Genders' }, { v: 'Male', l: 'Male' }, { v: 'Female', l: 'Female' }] },
            { label: 'Attendance Threshold', field: 'attendanceThreshold', options: [{ v: '90', l: '90%' }, { v: '85', l: '85%' }, { v: '80', l: '80%' }, { v: '75', l: '75%' }] },
            { label: 'Export Format', field: 'format', options: [{ v: 'pdf', l: 'PDF' }, { v: 'excel', l: 'Excel (.xlsx)' }, { v: 'csv', l: 'CSV' }] }].
            map((f) =>
            <div key={f.field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                <select value={(reportFilters as any)[f.field]} onChange={(e) => setReportFilters({ ...reportFilters, [f.field]: e.target.value })} className={selectClass}>
                  {f.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
              <input type="date" value={reportFilters.dateFrom} onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
              <input type="date" value={reportFilters.dateTo} onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => {setShowReportModal(false);setSelectedReportType('');}} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleGenerateReport} disabled={isGenerating || !selectedReportType} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><BarChart className="w-4 h-4" />Generate Report</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewReport} onClose={() => setPreviewReport(null)} title={previewReport?.title || 'Report Preview'} size="lg">
        {previewReport &&
        <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-lg"><previewReport.icon className="w-8 h-8 text-blue-600" /></div>
              <div>
                <h4 className="font-semibold text-gray-900">{previewReport.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{previewReport.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <Badge variant={previewReport.category === 'register' ? 'info' : previewReport.category === 'summary' ? 'success' : previewReport.category === 'analysis' ? 'purple' : 'warning'}>{previewReport.category.charAt(0).toUpperCase() + previewReport.category.slice(1)}</Badge>
                  {previewReport.lastGenerated && <span className="text-xs text-gray-500">Last generated: {previewReport.lastGenerated}</span>}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">This report includes:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Day-wise attendance records</li><li>Present, absent, late, and leave counts</li><li>Attendance percentage calculations</li>
                <li>Branch-wise breakdown</li><li>Batch-wise statistics</li><li>Exportable in PDF, Excel, and CSV formats</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={() => setPreviewReport(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Close</button>
              <button onClick={() => {setSelectedReportType(previewReport.title);setPreviewReport(null);setShowReportModal(true);}} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><BarChart className="w-4 h-4" />Generate This Report</button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}