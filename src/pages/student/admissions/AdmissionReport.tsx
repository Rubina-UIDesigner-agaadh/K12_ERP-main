// AdmissionReport.tsx
import React, { useState, useMemo } from 'react';
import {
  FileText, Download, PieChart, BarChart, TrendingUp, Users, GraduationCap, Calendar, Filter, X, Search, Eye, Printer, Mail, RefreshCw, CheckCircle, Clock, AlertCircle, ArrowUpRight, BookOpen, Award, Layers, Activity, UserCheck, Globe, Star, Copy, Shield, Heart, Home, Bus, Percent, UserPlus, FileSpreadsheet, Settings, ChevronDown, ChevronUp, IndianRupee, MapPin, Building2, Target, FileCheck, BadgeCheck, ClipboardList, School, Wallet, Check } from
'lucide-react';

// Constants
const BRANCHES = [
{ id: 'main', name: 'Main Campus', city: 'Delhi', color: 'bg-blue-500' },
{ id: 'north', name: 'North Branch', city: 'Noida', color: 'bg-green-500' },
{ id: 'south', name: 'South Branch', city: 'Gurgaon', color: 'bg-purple-500' },
{ id: 'east', name: 'East Branch', city: 'Faridabad', color: 'bg-orange-500' }];


const BATCHES = ['2024-25', '2023-24', '2022-23', '2021-22', '2020-21'];

// Branch-wise admission data
const branchAdmissionData: Record<string, any> = {
  main: {
    total: 450, male: 245, female: 203, other: 2,
    rte: 45, ews: 38, minority: 52, sc: 42, st: 18, obc: 85, general: 267, disability: 8,
    transport: 125, hostel: 35, sibling: 42, scholarship: 28,
    feePaid: 320, feePartial: 85, feePending: 35, feeWaived: 10,
    docsComplete: 380, docsPending: 70,
    byGrade: { 'Nursery': 35, 'LKG': 38, 'UKG': 36, 'Class 1': 42, 'Class 2': 38, 'Class 3': 35, 'Class 4': 32, 'Class 5': 30, 'Class 6': 28, 'Class 7': 25, 'Class 8': 22, 'Class 9': 28, 'Class 10': 25, 'Class 11': 20, 'Class 12': 16 },
    byCategory: { 'General': 267, 'OBC': 85, 'SC': 42, 'ST': 18, 'EWS': 38 },
    byReligion: { 'Hindu': 312, 'Muslim': 68, 'Christian': 35, 'Sikh': 18, 'Jain': 10, 'Buddhist': 5, 'Other': 2 },
    byAdmissionType: { 'Regular': 320, 'RTE': 45, 'Management': 42, 'Transfer': 28, 'Sports': 10, 'Staff': 5 },
    bySource: { 'Website': 85, 'Referral': 120, 'Walk-in': 145, 'Advertisement': 55, 'Social Media': 30, 'Newspaper': 15 }
  },
  north: {
    total: 280, male: 152, female: 126, other: 2,
    rte: 28, ews: 22, minority: 35, sc: 25, st: 12, obc: 52, general: 163, disability: 5,
    transport: 85, hostel: 18, sibling: 28, scholarship: 18,
    feePaid: 195, feePartial: 55, feePending: 22, feeWaived: 8,
    docsComplete: 235, docsPending: 45,
    byGrade: { 'Nursery': 22, 'LKG': 24, 'UKG': 22, 'Class 1': 26, 'Class 2': 24, 'Class 3': 22, 'Class 4': 20, 'Class 5': 18, 'Class 6': 16, 'Class 7': 15, 'Class 8': 14, 'Class 9': 18, 'Class 10': 16, 'Class 11': 12, 'Class 12': 11 },
    byCategory: { 'General': 163, 'OBC': 52, 'SC': 25, 'ST': 12, 'EWS': 28 },
    byReligion: { 'Hindu': 195, 'Muslim': 42, 'Christian': 22, 'Sikh': 12, 'Jain': 6, 'Buddhist': 2, 'Other': 1 },
    byAdmissionType: { 'Regular': 198, 'RTE': 28, 'Management': 28, 'Transfer': 18, 'Sports': 5, 'Staff': 3 },
    bySource: { 'Website': 52, 'Referral': 75, 'Walk-in': 92, 'Advertisement': 35, 'Social Media': 18, 'Newspaper': 8 }
  },
  south: {
    total: 320, male: 175, female: 143, other: 2,
    rte: 32, ews: 28, minority: 42, sc: 30, st: 15, obc: 62, general: 185, disability: 6,
    transport: 95, hostel: 22, sibling: 32, scholarship: 22,
    feePaid: 225, feePartial: 62, feePending: 25, feeWaived: 8,
    docsComplete: 268, docsPending: 52,
    byGrade: { 'Nursery': 25, 'LKG': 28, 'UKG': 26, 'Class 1': 30, 'Class 2': 28, 'Class 3': 25, 'Class 4': 22, 'Class 5': 20, 'Class 6': 18, 'Class 7': 16, 'Class 8': 15, 'Class 9': 20, 'Class 10': 18, 'Class 11': 15, 'Class 12': 14 },
    byCategory: { 'General': 185, 'OBC': 62, 'SC': 30, 'ST': 15, 'EWS': 28 },
    byReligion: { 'Hindu': 222, 'Muslim': 48, 'Christian': 25, 'Sikh': 14, 'Jain': 7, 'Buddhist': 3, 'Other': 1 },
    byAdmissionType: { 'Regular': 228, 'RTE': 32, 'Management': 32, 'Transfer': 20, 'Sports': 5, 'Staff': 3 },
    bySource: { 'Website': 62, 'Referral': 85, 'Walk-in': 105, 'Advertisement': 38, 'Social Media': 22, 'Newspaper': 8 }
  },
  east: {
    total: 180, male: 98, female: 80, other: 2,
    rte: 18, ews: 15, minority: 22, sc: 16, st: 8, obc: 35, general: 106, disability: 3,
    transport: 55, hostel: 12, sibling: 18, scholarship: 12,
    feePaid: 125, feePartial: 35, feePending: 15, feeWaived: 5,
    docsComplete: 152, docsPending: 28,
    byGrade: { 'Nursery': 14, 'LKG': 15, 'UKG': 14, 'Class 1': 17, 'Class 2': 15, 'Class 3': 14, 'Class 4': 12, 'Class 5': 11, 'Class 6': 10, 'Class 7': 9, 'Class 8': 8, 'Class 9': 12, 'Class 10': 10, 'Class 11': 10, 'Class 12': 9 },
    byCategory: { 'General': 106, 'OBC': 35, 'SC': 16, 'ST': 8, 'EWS': 15 },
    byReligion: { 'Hindu': 125, 'Muslim': 28, 'Christian': 14, 'Sikh': 8, 'Jain': 3, 'Buddhist': 1, 'Other': 1 },
    byAdmissionType: { 'Regular': 128, 'RTE': 18, 'Management': 18, 'Transfer': 12, 'Sports': 2, 'Staff': 2 },
    bySource: { 'Website': 35, 'Referral': 48, 'Walk-in': 58, 'Advertisement': 22, 'Social Media': 12, 'Newspaper': 5 }
  }
};

// Types
interface ReportTemplate {id: string;title: string;description: string;icon: React.ElementType;category: string;lastGenerated?: string;tags?: string[];isNew?: boolean;isFavorite?: boolean;}
interface GeneratedReport {id: string;name: string;type: string;generatedAt: string;generatedBy: string;status: string;filters: Record<string, any>;format: string;fileSize?: string;}

// Components
const Badge = ({ children, variant = 'default' }: {children: React.ReactNode;variant?: string;}) => {
  const variants: Record<string, string> = { default: 'bg-gray-100 text-gray-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700', info: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700', orange: 'bg-orange-100 text-orange-700', pink: 'bg-pink-100 text-pink-700', teal: 'bg-teal-100 text-teal-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>{children}</span>;
};

const Card = ({ title, children, className = '', headerAction, subtitle }: {title?: string;children: React.ReactNode;className?: string;headerAction?: React.ReactNode;subtitle?: string;}) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {title && <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50"><div><h3 className="font-semibold text-gray-900">{title}</h3>{subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}</div>{headerAction}</div>}
    <div className={title ? 'p-5' : ''}>{children}</div>
  </div>;


const Modal = ({ isOpen, onClose, title, children, size = 'lg', subtitle }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: string;subtitle?: string;}) => {
  if (!isOpen) return null;
  const sizes: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div><h3 className="text-lg font-semibold text-gray-900">{title}</h3>{subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}</div>
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>);

};

const Toast = ({ message, type, onClose }: {message: string;type: string;onClose: () => void;}) => {
  const icons: Record<string, any> = { success: CheckCircle, error: AlertCircle, info: Clock };
  const colors: Record<string, string> = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  const Icon = icons[type] || Clock;
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${colors[type]} text-white`}>
      <Icon className="w-5 h-5" /><span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded"><X className="w-4 h-4" /></button>
    </div>);

};

const StatCard = ({ title, value, subtitle, icon: Icon, color, branchBreakdown }: {title: string;value: number | string;subtitle?: string;icon: React.ElementType;color: string;branchBreakdown?: any[];}) => {
  const colors: Record<string, string> = { blue: 'border-l-blue-500', green: 'border-l-green-500', orange: 'border-l-orange-500', purple: 'border-l-purple-500', pink: 'border-l-pink-500', teal: 'border-l-teal-500', red: 'border-l-red-500', indigo: 'border-l-indigo-500' };
  const iconColors: Record<string, string> = { blue: 'text-blue-500', green: 'text-green-500', orange: 'text-orange-500', purple: 'text-purple-500', pink: 'text-pink-500', teal: 'text-teal-500', red: 'text-red-500', indigo: 'text-indigo-500' };
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 border-l-4 ${colors[color]}`}>
      <div className="flex items-center justify-between">
        <div><div className="text-xs text-gray-500 uppercase">{title}</div><div className="text-2xl font-bold text-gray-900 mt-1">{value}</div></div>
        <Icon className={`w-8 h-8 ${iconColors[color]} opacity-50`} />
      </div>
      {subtitle && <p className="text-xs mt-2 text-gray-500">{subtitle}</p>}
      {branchBreakdown && branchBreakdown.length > 1 &&
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          {branchBreakdown.map((b: any) =>
        <div key={b.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${b.color}`} /><span className="text-gray-500">{b.name}</span></div>
              <span className="font-medium text-gray-700">{b.value}</span>
            </div>
        )}
        </div>
      }
    </div>);

};

// Report Templates
const reportTemplates: ReportTemplate[] = [
{ id: 'str-1', title: 'Total Students Strength', description: 'Complete count of all enrolled students.', icon: Users, category: 'strength', lastGenerated: '2024-02-15', tags: ['Total', 'Count'], isFavorite: true },
{ id: 'str-2', title: 'Class-wise Strength Report', description: 'Student count across all classes.', icon: GraduationCap, category: 'strength', tags: ['Class', 'Section'], isFavorite: true },
{ id: 'str-3', title: 'Gender Ratio Analysis', description: 'Male to female ratio analysis.', icon: Percent, category: 'strength', tags: ['Gender', 'Ratio'], isNew: true },
{ id: 'res-1', title: 'RTE Students Report', description: 'Students under RTE quota.', icon: Shield, category: 'reservation', tags: ['RTE', 'Quota'], isFavorite: true, isNew: true },
{ id: 'res-2', title: 'SC/ST Students Breakdown', description: 'SC and ST category breakdown.', icon: Layers, category: 'reservation', tags: ['SC', 'ST'], isFavorite: true },
{ id: 'res-3', title: 'EWS Students Report', description: 'Economically Weaker Section students.', icon: Heart, category: 'reservation', tags: ['EWS'], isNew: true },
{ id: 'res-4', title: 'Minority Students Report', description: 'Minority community students.', icon: Globe, category: 'reservation', tags: ['Minority'], isFavorite: true },
{ id: 'res-5', title: 'Complete Reservation Summary', description: 'All reservation categories in one report.', icon: ClipboardList, category: 'reservation', tags: ['All', 'Summary'], isFavorite: true },
{ id: 'dem-1', title: 'Category and Gender Wise Strength', description: 'Category and gender breakdown.', icon: PieChart, category: 'demographic', tags: ['Category', 'Gender'] },
{ id: 'dem-2', title: 'Religion-wise Distribution', description: 'Students by religion.', icon: Globe, category: 'demographic', tags: ['Religion'] },
{ id: 'fin-1', title: 'Fee Collection Status Report', description: 'Complete fee status overview.', icon: IndianRupee, category: 'financial', tags: ['Fee', 'Collection'], isFavorite: true },
{ id: 'fin-2', title: 'Scholarship & Concession Report', description: 'Scholarship details.', icon: Award, category: 'financial', tags: ['Scholarship'] },
{ id: 'lst-1', title: 'Complete Student List', description: 'Master list of all students.', icon: FileText, category: 'list', tags: ['Student', 'List'], isFavorite: true },
{ id: 'lst-2', title: 'New Admissions List', description: 'Newly admitted students.', icon: UserPlus, category: 'list', tags: ['New', 'Admission'], isNew: true },
{ id: 'lst-3', title: 'Transport Users List', description: 'Students using transport.', icon: Bus, category: 'list', tags: ['Transport'] },
{ id: 'anl-1', title: 'Admission Trend Analysis', description: 'Month/year-wise trends.', icon: TrendingUp, category: 'analysis', tags: ['Trend'] },
{ id: 'anl-2', title: 'Source Analysis Report', description: 'Admission source analysis.', icon: Target, category: 'analysis', tags: ['Source'] },
{ id: 'cust-1', title: 'Custom Admission Report', description: 'Build custom report.', icon: Settings, category: 'custom', tags: ['Custom'] }];


// Main Component
export function AdmissionReport() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'generated' | 'data'>('templates');
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [rteFilter, setRteFilter] = useState('all');
  const [toast, setToast] = useState<{message: string;type: string;} | null>(null);

  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
  { id: '1', name: 'Total Students Report - Feb 2024', type: 'Total Students Strength', generatedAt: '2024-02-15 10:30 AM', generatedBy: 'Principal', status: 'completed', filters: { branch: 'All' }, format: 'PDF', fileSize: '2.4 MB' },
  { id: '2', name: 'RTE Students Report - 2024', type: 'RTE Students Report', generatedAt: '2024-02-14 03:45 PM', generatedBy: 'Vice Principal', status: 'completed', filters: { rte: 'Yes' }, format: 'Excel', fileSize: '1.8 MB' }]
  );

  const [reportConfig, setReportConfig] = useState({
    academicYear: '2024-25', dateFrom: '', dateTo: '', grade: 'all', gender: 'all', category: 'all',
    rte: 'all', ews: 'all', minority: 'all', feeStatus: 'all', format: 'PDF', sortBy: 'admissionNo', groupBy: 'none',
    includeContact: true, includeParentInfo: true, includeCharts: true
  });

  const isAllSelected = selectedBranches.length === 0 || selectedBranches.length === BRANCHES.length;
  const activeBranches = useMemo(() => isAllSelected ? BRANCHES : BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches, isAllSelected]);

  const toggleBranch = (id: string) => {
    if (id === 'all') setSelectedBranches([]);else
    setSelectedBranches((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  // Aggregated stats
  const stats = useMemo(() => {
    const ids = activeBranches.map((b) => b.id);
    return ids.reduce((acc, id) => {
      const d = branchAdmissionData[id];
      return {
        total: acc.total + d.total, male: acc.male + d.male, female: acc.female + d.female, other: acc.other + d.other,
        rte: acc.rte + d.rte, ews: acc.ews + d.ews, minority: acc.minority + d.minority,
        sc: acc.sc + d.sc, st: acc.st + d.st, obc: acc.obc + d.obc, general: acc.general + d.general, disability: acc.disability + d.disability,
        transport: acc.transport + d.transport, hostel: acc.hostel + d.hostel, sibling: acc.sibling + d.sibling, scholarship: acc.scholarship + d.scholarship,
        feePaid: acc.feePaid + d.feePaid, feePartial: acc.feePartial + d.feePartial, feePending: acc.feePending + d.feePending, feeWaived: acc.feeWaived + d.feeWaived,
        docsComplete: acc.docsComplete + d.docsComplete, docsPending: acc.docsPending + d.docsPending
      };
    }, { total: 0, male: 0, female: 0, other: 0, rte: 0, ews: 0, minority: 0, sc: 0, st: 0, obc: 0, general: 0, disability: 0, transport: 0, hostel: 0, sibling: 0, scholarship: 0, feePaid: 0, feePartial: 0, feePending: 0, feeWaived: 0, docsComplete: 0, docsPending: 0 });
  }, [activeBranches]);

  const malePercentage = stats.total > 0 ? (stats.male / stats.total * 100).toFixed(1) : '0';
  const femalePercentage = stats.total > 0 ? (stats.female / stats.total * 100).toFixed(1) : '0';

  const showToast = (message: string, type: string = 'success') => {setToast({ message, type });setTimeout(() => setToast(null), 4000);};

  const handleGenerateReport = () => {
    if (!selectedReportType) {showToast('Please select a report type', 'error');return;}
    setIsGenerating(true);
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: Date.now().toString(), name: `${selectedReportType} - ${new Date().toLocaleDateString()}`, type: selectedReportType,
        generatedAt: new Date().toLocaleString(), generatedBy: 'Admin User', status: 'completed',
        filters: { ...reportConfig, branches: isAllSelected ? 'All' : selectedBranches.join(', ') }, format: reportConfig.format, fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`
      };
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);setShowReportModal(false);setSelectedReportType('');
      showToast('Report generated successfully!');
    }, 2000);
  };

  const filteredTemplates = reportTemplates.filter((t) => reportCategoryFilter === 'all' || t.category === reportCategoryFilter);
  const getCategoryColor = (cat: string) => ({ strength: 'info', reservation: 'orange', demographic: 'purple', financial: 'teal', list: 'default', analysis: 'success', custom: 'pink' })[cat] || 'default';
  const getCategoryBg = (cat: string) => ({ strength: 'bg-blue-50', reservation: 'bg-orange-50', demographic: 'bg-purple-50', financial: 'bg-teal-50', list: 'bg-gray-50', analysis: 'bg-green-50', custom: 'bg-pink-50' })[cat] || 'bg-gray-50';
  const getCategoryIcon = (cat: string) => ({ strength: 'text-blue-600', reservation: 'text-orange-600', demographic: 'text-purple-600', financial: 'text-teal-600', list: 'text-gray-600', analysis: 'text-green-600', custom: 'text-pink-600' })[cat] || 'text-gray-600';
  const gradeOptions = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const selectClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white';

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileSpreadsheet className="w-7 h-7 text-blue-600" />Admission Reports & Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Batch: {selectedBatch} • Generate comprehensive admission reports</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Batch Select */}
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 text-sm border rounded-lg bg-white">
              {BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            
            {/* Branch Multi-Select */}
            <div className="relative">
              <button onClick={() => setShowBranchDropdown(!showBranchDropdown)} className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg bg-white min-w-[180px]">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="flex-1 text-left">{isAllSelected ? 'All Branches' : `${selectedBranches.length} Selected`}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              {showBranchDropdown &&
              <div className="absolute top-full right-0 mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    <div onClick={() => toggleBranch('all')} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isAllSelected ? 'bg-blue-50' : ''}`}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${isAllSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isAllSelected && <Check className="w-3 h-3 text-white" />}</div>
                      <span className="text-sm font-medium">All Branches</span>
                    </div>
                    <div className="border-t my-2" />
                    {BRANCHES.map((branch) => {
                    const isSelected = selectedBranches.includes(branch.id);
                    return (
                      <div key={branch.id} onClick={() => toggleBranch(branch.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>{isSelected && <Check className="w-3 h-3 text-white" />}</div>
                          <div className={`w-3 h-3 rounded-full ${branch.color}`} />
                          <div><p className="text-sm font-medium">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div>
                        </div>);

                  })}
                  </div>
                  <div className="border-t p-2"><button onClick={() => setShowBranchDropdown(false)} className="w-full py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600">Apply</button></div>
                </div>
              }
            </div>
            
            <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><BarChart className="w-4 h-4" />Generate Report</button>
          </div>
        </div>
      </div>

      {/* Selected Branches Tags */}
      {!isAllSelected && selectedBranches.length > 0 &&
      <div className="flex-shrink-0 px-6 py-2 bg-gray-50 border-b flex flex-wrap gap-2">
          {selectedBranches.map((id) => {
          const branch = BRANCHES.find((b) => b.id === id);
          return branch &&
          <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded-full text-sm">
                <span className={`w-2 h-2 rounded-full ${branch.color}`} />{branch.name}
                <X className="w-3 h-3 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => toggleBranch(id)} />
              </span>;

        })}
          <button onClick={() => setSelectedBranches([])} className="text-sm text-blue-600 hover:text-blue-800 px-2">Clear All</button>
        </div>
      }

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {[
          { id: 'templates', label: 'Report Templates', icon: FileText, count: reportTemplates.length },
          { id: 'generated', label: 'Generated Reports', icon: CheckCircle, count: generatedReports.length },
          { id: 'data', label: 'Live Data & Analytics', icon: Activity }].
          map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}{tab.count && <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">{tab.count}</span>}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* TEMPLATES TAB */}
        {activeTab === 'templates' &&
        <div className="space-y-6">
            {/* Category Filter */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex gap-2 flex-wrap">
                {['all', 'strength', 'reservation', 'demographic', 'financial', 'list', 'analysis', 'custom'].map((cat) =>
              <button key={cat} onClick={() => setReportCategoryFilter(cat)} className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${reportCategoryFilter === cat ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)} ({cat === 'all' ? reportTemplates.length : reportTemplates.filter((t) => t.category === cat).length})
                  </button>
              )}
              </div>
            </div>

            {/* Key Reports */}
            {reportCategoryFilter === 'all' &&
          <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" />Key Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
              { id: 'str-1', stat: stats.total, label: 'Total Students' },
              { id: 'res-1', stat: stats.rte, label: 'RTE Students' },
              { id: 'res-2', stat: stats.sc + stats.st, label: 'SC/ST' },
              { id: 'res-4', stat: stats.minority, label: 'Minority' },
              { id: 'str-3', stat: `${stats.male}:${stats.female}`, label: 'M:F Ratio' },
              { id: 'fin-1', stat: stats.feePaid, label: 'Fee Paid' }].
              map((item) => {
                const template = reportTemplates.find((t) => t.id === item.id)!;
                const Icon = template.icon;
                return (
                  <div key={item.id} className="bg-white rounded-xl border p-5 hover:shadow-lg transition-all cursor-pointer group" onClick={() => {setSelectedReportType(template.title);setShowReportModal(true);}}>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl ${getCategoryBg(template.category)}`}><Icon className={`w-6 h-6 ${getCategoryIcon(template.category)}`} /></div>
                          <div className="text-right"><p className="text-2xl font-bold text-gray-900">{item.stat}</p><p className="text-xs text-gray-500">{item.label}</p></div>
                        </div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">{template.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                        {activeBranches.length > 1 &&
                    <div className="mt-3 pt-3 border-t flex flex-wrap gap-1">
                            {activeBranches.slice(0, 3).map((b) =>
                      <span key={b.id} className={`px-2 py-0.5 rounded text-xs text-white ${b.color}`}>{branchAdmissionData[b.id][item.id.includes('str-1') ? 'total' : item.id.includes('res-1') ? 'rte' : item.id.includes('res-2') ? 'sc' : 'minority']}</span>
                      )}
                          </div>
                    }
                      </div>);

              })}
                </div>
              </div>
          }

            {/* All Templates */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{reportCategoryFilter === 'all' ? 'All Templates' : `${reportCategoryFilter.charAt(0).toUpperCase() + reportCategoryFilter.slice(1)} Reports`} ({filteredTemplates.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((report) => {
                const Icon = report.icon;
                return (
                  <div key={report.id} className="bg-white rounded-xl border p-5 hover:shadow-md">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${getCategoryBg(report.category)}`}><Icon className={`w-6 h-6 ${getCategoryIcon(report.category)}`} /></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            {report.isNew && <Badge variant="success">New</Badge>}
                            {report.isFavorite && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                          {report.tags && <div className="flex flex-wrap gap-1 mt-2">{report.tags.slice(0, 3).map((tag, i) => <span key={i} className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>)}</div>}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <Badge variant={getCategoryColor(report.category)}>{report.category}</Badge>
                        <div className="flex gap-1">
                          <button onClick={() => setPreviewReport(report)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => {setSelectedReportType(report.title);setShowReportModal(true);}} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><BarChart className="w-4 h-4" /></button>
                          <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            </div>
          </div>
        }

        {/* GENERATED REPORTS TAB */}
        {activeTab === 'generated' &&
        <Card title="Generated Reports" subtitle={`${generatedReports.length} reports`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Report Name', 'Type', 'Generated', 'By', 'Branches', 'Format', 'Size', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {generatedReports.map((report) =>
                <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /><span className="font-medium text-gray-900">{report.name}</span></div></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.generatedAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.generatedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.filters.branches || 'All'}</td>
                      <td className="px-4 py-3"><Badge variant={report.format === 'PDF' ? 'error' : 'success'}>{report.format}</Badge></td>
                      <td className="px-4 py-3 text-sm text-gray-600">{report.fileSize}</td>
                      <td className="px-4 py-3 flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"><Download className="w-4 h-4" /></button>
                        <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded"><Printer className="w-4 h-4" /></button>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </Card>
        }

        {/* LIVE DATA TAB */}
        {activeTab === 'data' &&
        <div className="space-y-6">
            {/* Branch-wise Overview */}
            {activeBranches.length > 1 &&
          <Card title="Branch-wise Overview" subtitle={`${activeBranches.length} branches selected`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>{['Branch', 'Total', 'Male', 'Female', 'RTE', 'SC/ST', 'Minority', 'EWS', 'Fee Paid'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeBranches.map((branch) => {
                    const d = branchAdmissionData[branch.id];
                    return (
                      <tr key={branch.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><div className="flex items-center gap-2"><span className={`w-3 h-3 rounded-full ${branch.color}`} /><div><p className="font-medium">{branch.name}</p><p className="text-xs text-gray-500">{branch.city}</p></div></div></td>
                            <td className="px-4 py-3 font-semibold">{d.total}</td>
                            <td className="px-4 py-3 text-blue-600">{d.male}</td>
                            <td className="px-4 py-3 text-pink-600">{d.female}</td>
                            <td className="px-4 py-3"><Badge variant="orange">{d.rte}</Badge></td>
                            <td className="px-4 py-3"><Badge variant="purple">{d.sc + d.st}</Badge></td>
                            <td className="px-4 py-3"><Badge variant="teal">{d.minority}</Badge></td>
                            <td className="px-4 py-3"><Badge variant="pink">{d.ews}</Badge></td>
                            <td className="px-4 py-3 text-green-600 font-medium">{d.feePaid}</td>
                          </tr>);

                  })}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-3">Total</td>
                        <td className="px-4 py-3">{stats.total}</td>
                        <td className="px-4 py-3 text-blue-600">{stats.male}</td>
                        <td className="px-4 py-3 text-pink-600">{stats.female}</td>
                        <td className="px-4 py-3"><Badge variant="orange">{stats.rte}</Badge></td>
                        <td className="px-4 py-3"><Badge variant="purple">{stats.sc + stats.st}</Badge></td>
                        <td className="px-4 py-3"><Badge variant="teal">{stats.minority}</Badge></td>
                        <td className="px-4 py-3"><Badge variant="pink">{stats.ews}</Badge></td>
                        <td className="px-4 py-3 text-green-600">{stats.feePaid}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
          }

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <StatCard title="Total Students" value={stats.total} subtitle={`M: ${stats.male} | F: ${stats.female}`} icon={Users} color="blue" branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchAdmissionData[b.id].total })) : undefined} />
              <StatCard title="RTE Students" value={stats.rte} subtitle={`${stats.total > 0 ? (stats.rte / stats.total * 100).toFixed(1) : 0}% of total`} icon={Shield} color="orange" branchBreakdown={activeBranches.length > 1 ? activeBranches.map((b) => ({ id: b.id, name: b.name, color: b.color, value: branchAdmissionData[b.id].rte })) : undefined} />
              <StatCard title="SC/ST Students" value={stats.sc + stats.st} subtitle={`SC: ${stats.sc} | ST: ${stats.st}`} icon={Layers} color="purple" />
              <StatCard title="Minority" value={stats.minority} subtitle={`${stats.total > 0 ? (stats.minority / stats.total * 100).toFixed(1) : 0}% of total`} icon={Globe} color="green" />
              <StatCard title="EWS Students" value={stats.ews} subtitle={`${stats.total > 0 ? (stats.ews / stats.total * 100).toFixed(1) : 0}% of total`} icon={Heart} color="pink" />
              <StatCard title="OBC Students" value={stats.obc} subtitle={`${stats.total > 0 ? (stats.obc / stats.total * 100).toFixed(1) : 0}% of total`} icon={BadgeCheck} color="teal" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Gender Distribution */}
              <Card title="Gender Distribution" subtitle="Male vs Female">
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-8 py-4">
                    <div className="text-center"><div className="text-3xl font-bold text-blue-600">{stats.male}</div><div className="text-sm text-gray-500">Male</div><div className="text-xs text-gray-400">{malePercentage}%</div></div>
                    <div className="text-2xl font-bold text-gray-300">:</div>
                    <div className="text-center"><div className="text-3xl font-bold text-pink-600">{stats.female}</div><div className="text-sm text-gray-500">Female</div><div className="text-xs text-gray-400">{femalePercentage}%</div></div>
                  </div>
                  <div className="h-4 rounded-full bg-gray-100 overflow-hidden flex">
                    <div className="bg-blue-500 h-full" style={{ width: `${malePercentage}%` }} />
                    <div className="bg-pink-500 h-full" style={{ width: `${femalePercentage}%` }} />
                  </div>
                  {activeBranches.length > 1 &&
                <div className="pt-3 border-t space-y-2">
                      {activeBranches.map((b) =>
                  <div key={b.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-2 h-2 rounded-full ${b.color}`} />
                          <span className="text-gray-600 flex-1">{b.name}</span>
                          <span className="text-blue-600">{branchAdmissionData[b.id].male}</span>
                          <span className="text-pink-600">{branchAdmissionData[b.id].female}</span>
                        </div>
                  )}
                    </div>
                }
                </div>
              </Card>

              {/* Reservation Summary */}
              <Card title="Reservation Summary">
                <div className="space-y-3">
                  {[
                { label: 'RTE', value: stats.rte, icon: Shield, color: 'bg-orange-50', text: 'text-orange-700' },
                { label: 'SC/ST', value: stats.sc + stats.st, icon: Layers, color: 'bg-purple-50', text: 'text-purple-700' },
                { label: 'OBC', value: stats.obc, icon: BadgeCheck, color: 'bg-teal-50', text: 'text-teal-700' },
                { label: 'EWS', value: stats.ews, icon: Heart, color: 'bg-pink-50', text: 'text-pink-700' },
                { label: 'Minority', value: stats.minority, icon: Globe, color: 'bg-green-50', text: 'text-green-700' }].
                map((item) =>
                <div key={item.label} className={`flex items-center justify-between p-2 ${item.color} rounded-lg`}>
                      <div className="flex items-center gap-2"><item.icon className={`w-4 h-4 ${item.text}`} /><span className={`text-sm font-medium ${item.text}`}>{item.label}</span></div>
                      <span className={`font-bold ${item.text}`}>{item.value}</span>
                    </div>
                )}
                </div>
              </Card>

              {/* Fee Status */}
              <Card title="Fee Status">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg text-center"><div className="text-xl font-bold text-green-700">{stats.feePaid}</div><div className="text-xs text-green-600">Paid</div></div>
                  <div className="p-3 bg-yellow-50 rounded-lg text-center"><div className="text-xl font-bold text-yellow-700">{stats.feePartial}</div><div className="text-xs text-yellow-600">Partial</div></div>
                  <div className="p-3 bg-red-50 rounded-lg text-center"><div className="text-xl font-bold text-red-700">{stats.feePending}</div><div className="text-xs text-red-600">Pending</div></div>
                  <div className="p-3 bg-purple-50 rounded-lg text-center"><div className="text-xl font-bold text-purple-700">{stats.feeWaived}</div><div className="text-xs text-purple-600">Waived</div></div>
                </div>
                {activeBranches.length > 1 &&
              <div className="mt-4 pt-3 border-t space-y-2">
                    {activeBranches.map((b) =>
                <div key={b.id} className="flex items-center gap-2 text-xs">
                        <span className={`w-2 h-2 rounded-full ${b.color}`} />
                        <span className="text-gray-600 flex-1">{b.name}</span>
                        <span className="text-green-600">{branchAdmissionData[b.id].feePaid}</span>
                        <span className="text-yellow-600">{branchAdmissionData[b.id].feePartial}</span>
                        <span className="text-red-600">{branchAdmissionData[b.id].feePending}</span>
                      </div>
                )}
                  </div>
              }
              </Card>
            </div>

            {/* Export Button */}
            <div className="flex justify-center">
              <button onClick={() => {setSelectedReportType('Custom Admission Report');setShowReportModal(true);}} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                <Download className="w-4 h-4" />Export Full Data Report
              </button>
            </div>
          </div>
        }
      </div>

      {/* Generate Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => {setShowReportModal(false);setSelectedReportType('');}} title="Generate Admission Report" subtitle="Configure filters for your report" size="xl">
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type *</label>
            {selectedReportType ?
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="font-medium text-blue-800">{selectedReportType}</span>
                <button onClick={() => setSelectedReportType('')} className="text-blue-600 hover:text-blue-800"><X className="w-4 h-4" /></button>
              </div> :

            <select className={selectClass} value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)}>
                <option value="">Select Report Type...</option>
                {['strength', 'reservation', 'demographic', 'financial', 'list', 'analysis', 'custom'].map((cat) =>
              <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1) + ' Reports'}>
                    {reportTemplates.filter((t) => t.category === cat).map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                  </optgroup>
              )}
              </select>
            }
          </div>

          {/* Branch & Batch Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Selected Scope</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div><span className="text-blue-600">Batch:</span> <span className="font-medium">{selectedBatch}</span></div>
              <div><span className="text-blue-600">Branches:</span> <span className="font-medium">{isAllSelected ? 'All Branches' : activeBranches.map((b) => b.name).join(', ')}</span></div>
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label><select className={selectClass} value={reportConfig.academicYear} onChange={(e) => setReportConfig({ ...reportConfig, academicYear: e.target.value })}>{BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class</label><select className={selectClass} value={reportConfig.grade} onChange={(e) => setReportConfig({ ...reportConfig, grade: e.target.value })}><option value="all">All Grades</option>{gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select className={selectClass} value={reportConfig.gender} onChange={(e) => setReportConfig({ ...reportConfig, gender: e.target.value })}><option value="all">All</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className={selectClass} value={reportConfig.category} onChange={(e) => setReportConfig({ ...reportConfig, category: e.target.value })}><option value="all">All</option><option value="General">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option><option value="EWS">EWS</option></select></div>
          </div>

          {/* Reservation Filters */}
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center gap-2"><Shield className="w-4 h-4" />Reservation Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div><label className="block text-xs font-medium text-gray-700 mb-1">RTE</label><select className={selectClass} value={reportConfig.rte} onChange={(e) => setReportConfig({ ...reportConfig, rte: e.target.value })}><option value="all">All</option><option value="yes">RTE Only</option><option value="no">Non-RTE</option></select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">EWS</label><select className={selectClass} value={reportConfig.ews} onChange={(e) => setReportConfig({ ...reportConfig, ews: e.target.value })}><option value="all">All</option><option value="yes">EWS Only</option><option value="no">Non-EWS</option></select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Minority</label><select className={selectClass} value={reportConfig.minority} onChange={(e) => setReportConfig({ ...reportConfig, minority: e.target.value })}><option value="all">All</option><option value="yes">Minority Only</option><option value="no">Non-Minority</option></select></div>
              <div><label className="block text-xs font-medium text-gray-700 mb-1">Fee Status</label><select className={selectClass} value={reportConfig.feeStatus} onChange={(e) => setReportConfig({ ...reportConfig, feeStatus: e.target.value })}><option value="all">All</option><option value="Paid">Paid</option><option value="Partial">Partial</option><option value="Pending">Pending</option></select></div>
            </div>
          </div>

          {/* Output Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label><select className={selectClass} value={reportConfig.format} onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}><option value="PDF">PDF</option><option value="Excel">Excel</option><option value="CSV">CSV</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label><select className={selectClass} value={reportConfig.sortBy} onChange={(e) => setReportConfig({ ...reportConfig, sortBy: e.target.value })}><option value="admissionNo">Admission No</option><option value="studentName">Name</option><option value="grade">Grade</option></select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Group By</label><select className={selectClass} value={reportConfig.groupBy} onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}><option value="none">None</option><option value="branch">Branch</option><option value="grade">Grade</option><option value="category">Category</option></select></div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleGenerateReport} disabled={isGenerating || !selectedReportType} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><BarChart className="w-4 h-4" />Generate Report</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewReport} onClose={() => setPreviewReport(null)} title={previewReport?.title || 'Preview'} size="lg">
        {previewReport &&
        <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-3 rounded-lg ${getCategoryBg(previewReport.category)}`}><previewReport.icon className={`w-8 h-8 ${getCategoryIcon(previewReport.category)}`} /></div>
              <div>
                <div className="flex items-center gap-2"><h4 className="font-semibold text-gray-900">{previewReport.title}</h4>{previewReport.isNew && <Badge variant="success">New</Badge>}</div>
                <p className="text-sm text-gray-600 mt-1">{previewReport.description}</p>
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <Badge variant={getCategoryColor(previewReport.category)}>{previewReport.category}</Badge>
                  {previewReport.tags?.map((tag, i) => <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>)}
                </div>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">This report will include data from:</h5>
              <div className="flex flex-wrap gap-2">
                {activeBranches.map((b) => <span key={b.id} className={`px-2 py-1 rounded text-xs text-white ${b.color}`}>{b.name}</span>)}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={() => setPreviewReport(null)} className="px-4 py-2 text-sm font-medium border rounded-lg">Close</button>
              <button onClick={() => {setSelectedReportType(previewReport.title);setPreviewReport(null);setShowReportModal(true);}} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><BarChart className="w-4 h-4" />Generate This Report</button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}

export default AdmissionReport;