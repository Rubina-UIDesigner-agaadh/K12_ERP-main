import React, { useState, useMemo } from 'react';
import {
  FileText, Download, PieChart, BarChart, TrendingUp, Users, GraduationCap, Filter, X, Search, Eye, Printer, Mail, RefreshCw, CheckCircle, Clock, AlertCircle, ArrowUpRight, Award, Layers, Activity, UserCheck, Globe, Star, Copy, Shield, Heart, Home, Bus, Percent, UserPlus, FileSpreadsheet, Settings, ChevronDown, ChevronUp, Check, Building } from
'lucide-react';

// --- Constants ---
const BRANCHES = [
{ id: 'main', name: 'Main Branch', color: '#3b82f6' },
{ id: 'north', name: 'North Campus', color: '#10b981' },
{ id: 'south', name: 'South Campus', color: '#f59e0b' },
{ id: 'west', name: 'West Campus', color: '#8b5cf6' }];


const BATCHES = [
{ value: '2024-25', label: '2024-25' },
{ value: '2023-24', label: '2023-24' },
{ value: '2022-23', label: '2022-23' }];


// --- Types ---
interface StudentProfile {
  id: string;admissionNo: string;studentName: string;fatherName: string;motherName: string;grade: string;section: string;rollNo: string;gender: 'Male' | 'Female' | 'Other';category: 'General' | 'SC' | 'ST' | 'OBC' | 'EWS';religion: 'Hindu' | 'Muslim' | 'Christian' | 'Sikh' | 'Jain' | 'Buddhist' | 'Other';isTransfer: boolean;hasSibling: boolean;academicScore: number;academicGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';achievements: string[];attendance: number;isRTE: boolean;isEWS: boolean;isMinority: boolean;admissionType: 'Regular' | 'RTE' | 'Management' | 'Transfer';caste: string;bloodGroup: string;transport: boolean;hostel: boolean;disability: boolean;disabilityType?: string;branchId: string;
}

interface ReportTemplate {
  id: string;title: string;description: string;icon: React.ElementType;category: 'demographic' | 'academic' | 'list' | 'strength' | 'reservation' | 'custom';lastGenerated?: string;tags?: string[];
}

interface GeneratedReport {
  id: string;name: string;type: string;generatedAt: string;generatedBy: string;status: 'completed' | 'processing' | 'failed';filters: Record<string, any>;format: string;
}

// --- Branch-wise Student Data Generator ---
const generateStudentData = (): StudentProfile[] => {
  const baseStudents = [
  { id: '1', admissionNo: 'ADM/2021/001', studentName: 'Aarav Gupta', fatherName: 'Rajeev Gupta', motherName: 'Suman Gupta', grade: 'Grade 10', section: 'A', rollNo: '10', gender: 'Male' as const, category: 'General' as const, religion: 'Hindu' as const, isTransfer: false, hasSibling: true, academicScore: 92.5, academicGrade: 'A+' as const, achievements: ['Math Olympiad Gold'], attendance: 98, isRTE: false, isEWS: false, isMinority: false, admissionType: 'Regular' as const, caste: 'Gupta', bloodGroup: 'B+', transport: true, hostel: false, disability: false },
  { id: '2', admissionNo: 'ADM/2021/045', studentName: 'Zara Khan', fatherName: 'Amir Khan', motherName: 'Fatima Khan', grade: 'Grade 10', section: 'B', rollNo: '12', gender: 'Female' as const, category: 'OBC' as const, religion: 'Muslim' as const, isTransfer: true, hasSibling: false, academicScore: 88.0, academicGrade: 'A' as const, achievements: ['Science Fair'], attendance: 94, isRTE: false, isEWS: false, isMinority: true, admissionType: 'Transfer' as const, caste: 'Khan', bloodGroup: 'O+', transport: false, hostel: false, disability: false },
  { id: '3', admissionNo: 'ADM/2022/102', studentName: 'John Dsouza', fatherName: 'Mark Dsouza', motherName: 'Mary Dsouza', grade: 'Grade 9', section: 'A', rollNo: '15', gender: 'Male' as const, category: 'General' as const, religion: 'Christian' as const, isTransfer: false, hasSibling: true, academicScore: 76.5, academicGrade: 'B+' as const, achievements: ['Football Captain'], attendance: 89, isRTE: false, isEWS: false, isMinority: true, admissionType: 'Regular' as const, caste: 'Dsouza', bloodGroup: 'A+', transport: true, hostel: false, disability: false },
  { id: '4', admissionNo: 'ADM/2023/088', studentName: 'Ishita Patel', fatherName: 'Nimesh Patel', motherName: 'Dipti Patel', grade: 'Grade 8', section: 'C', rollNo: '08', gender: 'Female' as const, category: 'EWS' as const, religion: 'Hindu' as const, isTransfer: false, hasSibling: false, academicScore: 95.0, academicGrade: 'A+' as const, achievements: ['Spelling Bee Winner'], attendance: 99, isRTE: true, isEWS: true, isMinority: false, admissionType: 'RTE' as const, caste: 'Patel', bloodGroup: 'AB+', transport: false, hostel: false, disability: false },
  { id: '5', admissionNo: 'ADM/2023/150', studentName: 'Gurpreet Singh', fatherName: 'Harjit Singh', motherName: 'Kiran Kaur', grade: 'Grade 8', section: 'A', rollNo: '22', gender: 'Male' as const, category: 'General' as const, religion: 'Sikh' as const, isTransfer: true, hasSibling: false, academicScore: 65.0, academicGrade: 'C' as const, achievements: [], attendance: 82, isRTE: false, isEWS: false, isMinority: true, admissionType: 'Transfer' as const, caste: 'Singh', bloodGroup: 'O-', transport: true, hostel: true, disability: false },
  { id: '6', admissionNo: 'ADM/2020/005', studentName: 'Ananya Rao', fatherName: 'Krishna Rao', motherName: 'Latha Rao', grade: 'Grade 11', section: 'Sci', rollNo: '01', gender: 'Female' as const, category: 'SC' as const, religion: 'Hindu' as const, isTransfer: false, hasSibling: true, academicScore: 89.5, academicGrade: 'A' as const, achievements: ['Robotix Lead'], attendance: 96, isRTE: false, isEWS: false, isMinority: false, admissionType: 'Regular' as const, caste: 'Rao', bloodGroup: 'B-', transport: false, hostel: true, disability: false },
  { id: '7', admissionNo: 'ADM/2023/200', studentName: 'Ravi Kumar', fatherName: 'Suresh Kumar', motherName: 'Lakshmi Kumar', grade: 'Grade 9', section: 'B', rollNo: '18', gender: 'Male' as const, category: 'ST' as const, religion: 'Hindu' as const, isTransfer: false, hasSibling: false, academicScore: 72.0, academicGrade: 'B' as const, achievements: [], attendance: 88, isRTE: true, isEWS: false, isMinority: false, admissionType: 'RTE' as const, caste: 'Kumar', bloodGroup: 'A-', transport: true, hostel: false, disability: true, disabilityType: 'Visual Impairment' },
  { id: '8', admissionNo: 'ADM/2022/080', studentName: 'Priya Sharma', fatherName: 'Vikram Sharma', motherName: 'Meera Sharma', grade: 'Grade 10', section: 'A', rollNo: '05', gender: 'Female' as const, category: 'OBC' as const, religion: 'Hindu' as const, isTransfer: false, hasSibling: true, academicScore: 85.0, academicGrade: 'A' as const, achievements: ['Art Winner'], attendance: 95, isRTE: false, isEWS: true, isMinority: false, admissionType: 'Regular' as const, caste: 'Sharma', bloodGroup: 'O+', transport: false, hostel: false, disability: false }];


  const allStudents: StudentProfile[] = [];
  BRANCHES.forEach((branch, bi) => {
    baseStudents.forEach((student, si) => {
      allStudents.push({ ...student, id: `${branch.id}-${student.id}`, admissionNo: `${branch.id.toUpperCase()}/${student.admissionNo}`, branchId: branch.id });
      if (bi < 2) allStudents.push({ ...student, id: `${branch.id}-${student.id}-2`, studentName: student.studentName + ' Jr', admissionNo: `${branch.id.toUpperCase()}/2/${student.admissionNo}`, branchId: branch.id, academicScore: student.academicScore - 5 });
    });
  });
  return allStudents;
};

const studentData = generateStudentData();

const reportTemplates: ReportTemplate[] = [
{ id: '1', title: 'Total Students Strength', description: 'Complete count of all enrolled students.', icon: Users, category: 'strength', tags: ['Total', 'Count'] },
{ id: '2', title: 'Class-wise Strength', description: 'Student count by class/section.', icon: GraduationCap, category: 'strength', tags: ['Class', 'Section'] },
{ id: '3', title: 'Gender Ratio Analysis', description: 'Male to female ratio analysis.', icon: Percent, category: 'strength', tags: ['Gender', 'Ratio'] },
{ id: '4', title: 'Gender Wise Class Strength', description: 'Gender distribution per class.', icon: BarChart, category: 'strength', tags: ['Gender', 'Class'] },
{ id: '5', title: 'RTE Students List', description: 'RTE quota students list.', icon: Shield, category: 'reservation', tags: ['RTE', 'Quota'] },
{ id: '6', title: 'RTE Students Strength & Gender', description: 'RTE count with gender breakdown.', icon: Shield, category: 'reservation', tags: ['RTE', 'Gender'] },
{ id: '7', title: 'SC/ST Students Breakdown', description: 'SC and ST category breakdown.', icon: Layers, category: 'reservation', tags: ['SC', 'ST'] },
{ id: '8', title: 'Minority Students List', description: 'Minority community students.', icon: Globe, category: 'reservation', tags: ['Minority'] },
{ id: '9', title: 'EWS Students List', description: 'EWS quota students.', icon: Heart, category: 'reservation', tags: ['EWS'] },
{ id: '10', title: 'Category and Gender Wise Strength', description: 'All categories with gender.', icon: PieChart, category: 'demographic', tags: ['Category', 'Gender'] },
{ id: '11', title: 'Religion Wise Strength', description: 'Religion distribution.', icon: PieChart, category: 'demographic', tags: ['Religion'] },
{ id: '12', title: 'Admission Type Analysis', description: 'By admission type.', icon: UserPlus, category: 'demographic', tags: ['Admission'] },
{ id: '13', title: 'Complete Student List', description: 'Master list of all students.', icon: FileText, category: 'list', tags: ['List', 'Complete'] },
{ id: '14', title: 'Sibling List', description: 'Students with siblings.', icon: Copy, category: 'list', tags: ['Sibling'] },
{ id: '15', title: 'Transport Users', description: 'Transport facility users.', icon: Bus, category: 'list', tags: ['Transport'] },
{ id: '16', title: 'Hostel Residents', description: 'Hostel residents list.', icon: Home, category: 'list', tags: ['Hostel'] },
{ id: '17', title: 'Academic Performance', description: 'Performance analysis.', icon: TrendingUp, category: 'academic', tags: ['Performance'] },
{ id: '18', title: 'Achievers List', description: 'Students with achievements.', icon: Star, category: 'academic', tags: ['Achievement'] },
{ id: '19', title: 'Custom Report', description: 'Build custom report.', icon: Settings, category: 'custom', tags: ['Custom'] }];


// --- Components ---
const Card = ({ title, children, className = '', headerAction }: {title?: string;children: React.ReactNode;className?: string;headerAction?: React.ReactNode;}) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>
    {title && <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50"><h3 className="font-semibold text-gray-900">{title}</h3>{headerAction}</div>}
    <div className={title ? 'p-5' : ''}>{children}</div>
  </div>;


const Badge = ({ children, variant = 'default' }: {children: React.ReactNode;variant?: string;}) => {
  const variants: Record<string, string> = { default: 'bg-gray-100 text-gray-700', success: 'bg-green-100 text-green-700', warning: 'bg-yellow-100 text-yellow-700', error: 'bg-red-100 text-red-700', info: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700', orange: 'bg-orange-100 text-orange-700', pink: 'bg-pink-100 text-pink-700' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>{children}</span>;
};

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: string;}) => {
  if (!isOpen) return null;
  const sizes: Record<string, string> = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', '2xl': 'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b"><h3 className="text-lg font-semibold">{title}</h3><button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button></div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>);

};

const Toast = ({ message, type, onClose }: {message: string;type: 'success' | 'error' | 'info';onClose: () => void;}) => {
  const icons = { success: CheckCircle, error: AlertCircle, info: Clock };
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  const Icon = icons[type];
  return <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${colors[type]} text-white`}><Icon className="w-5 h-5" /><span className="text-sm font-medium">{message}</span><button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded"><X className="w-4 h-4" /></button></div>;
};

const MultiSelect = ({ options, selected, onChange }: {options: typeof BRANCHES;selected: string[];onChange: (v: string[]) => void;}) => {
  const [open, setOpen] = useState(false);
  const allSelected = selected.length === options.length;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:border-gray-400 min-w-[180px]">
        <Building className="w-4 h-4 text-gray-500" />
        <span>{selected.length === 0 ? 'Select Branches' : allSelected ? 'All Branches' : `${selected.length} Branch${selected.length > 1 ? 'es' : ''}`}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
      </button>
      {open &&
      <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[200px]">
            <div className="p-2 border-b">
              <button onClick={() => onChange(allSelected ? [] : options.map((o) => o.id))} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${allSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{allSelected && <Check className="w-3 h-3 text-white" />}</div>Select All
              </button>
            </div>
            <div className="p-2 max-h-48 overflow-y-auto">
              {options.map((opt) =>
            <button key={opt.id} onClick={() => onChange(selected.includes(opt.id) ? selected.filter((s) => s !== opt.id) : [...selected, opt.id])} className="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-50 rounded">
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${selected.includes(opt.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>{selected.includes(opt.id) && <Check className="w-3 h-3 text-white" />}</div>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />{opt.name}
                </button>
            )}
            </div>
          </div>
        </>
      }
    </div>);

};

const BranchBadge = ({ branchId }: {branchId: string;}) => {
  const branch = BRANCHES.find((b) => b.id === branchId);
  if (!branch) return null;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${branch.color}15`, color: branch.color }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: branch.color }} />{branch.name}</span>;
};

// --- Main Component ---
export function StudentAcademicReports() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [selectedBatch, setSelectedBatch] = useState('2024-25');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [religionFilter, setReligionFilter] = useState('all');
  const [rteFilter, setRteFilter] = useState('all');
  const [ewsFilter, setEwsFilter] = useState('all');
  const [minorityFilter, setMinorityFilter] = useState('all');
  const [admissionTypeFilter, setAdmissionTypeFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'generated' | 'data'>('templates');
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [toast, setToast] = useState<{message: string;type: 'success' | 'error' | 'info';} | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([
  { id: '1', name: 'Student List - Feb 2024', type: 'Complete Student List', generatedAt: '2024-02-15 10:30 AM', generatedBy: 'Principal', status: 'completed', filters: { grade: 'All' }, format: 'PDF' },
  { id: '2', name: 'RTE Students Report', type: 'RTE Students Strength', generatedAt: '2024-02-14 03:45 PM', generatedBy: 'Vice Principal', status: 'completed', filters: { rte: 'Yes' }, format: 'Excel' }]
  );
  const [reportConfig, setReportConfig] = useState({ academicYear: '2024-25', grade: 'all', section: 'all', gender: 'all', category: 'all', religion: 'all', rte: 'all', ews: 'all', minority: 'all', admissionType: 'all', includePhoto: false, includeContact: true, includeParentInfo: true, includeAcademic: true, includeAttendance: true, includeAchievements: false, format: 'PDF', sortBy: 'name', groupBy: 'none' });

  const activeBranches = useMemo(() => BRANCHES.filter((b) => selectedBranches.includes(b.id)), [selectedBranches]);

  const filteredStudents = useMemo(() => {
    let filtered = studentData.filter((s) => selectedBranches.includes(s.branchId));
    if (gradeFilter !== 'all') filtered = filtered.filter((s) => s.grade === gradeFilter);
    if (genderFilter !== 'all') filtered = filtered.filter((s) => s.gender === genderFilter);
    if (categoryFilter !== 'all') filtered = filtered.filter((s) => s.category === categoryFilter);
    if (religionFilter !== 'all') filtered = filtered.filter((s) => s.religion === religionFilter);
    if (rteFilter !== 'all') filtered = filtered.filter((s) => rteFilter === 'yes' ? s.isRTE : !s.isRTE);
    if (ewsFilter !== 'all') filtered = filtered.filter((s) => ewsFilter === 'yes' ? s.isEWS : !s.isEWS);
    if (minorityFilter !== 'all') filtered = filtered.filter((s) => minorityFilter === 'yes' ? s.isMinority : !s.isMinority);
    if (admissionTypeFilter !== 'all') filtered = filtered.filter((s) => s.admissionType === admissionTypeFilter);
    if (typeFilter === 'transfer') filtered = filtered.filter((s) => s.isTransfer);
    if (typeFilter === 'sibling') filtered = filtered.filter((s) => s.hasSibling);
    if (typeFilter === 'achiever') filtered = filtered.filter((s) => s.achievements.length > 0);
    if (typeFilter === 'transport') filtered = filtered.filter((s) => s.transport);
    if (typeFilter === 'hostel') filtered = filtered.filter((s) => s.hostel);
    if (typeFilter === 'disability') filtered = filtered.filter((s) => s.disability);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((s) => s.studentName.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q));
    }
    return filtered;
  }, [selectedBranches, gradeFilter, genderFilter, categoryFilter, religionFilter, rteFilter, ewsFilter, minorityFilter, admissionTypeFilter, typeFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const byBranch = selectedBranches.map((id) => {
      const branchStudents = filteredStudents.filter((s) => s.branchId === id);
      const branch = BRANCHES.find((b) => b.id === id)!;
      return { ...branch, count: branchStudents.length, rte: branchStudents.filter((s) => s.isRTE).length, ews: branchStudents.filter((s) => s.isEWS).length, minority: branchStudents.filter((s) => s.isMinority).length, scst: branchStudents.filter((s) => s.category === 'SC' || s.category === 'ST').length, male: branchStudents.filter((s) => s.gender === 'Male').length, female: branchStudents.filter((s) => s.gender === 'Female').length };
    });
    return {
      total, male: filteredStudents.filter((s) => s.gender === 'Male').length, female: filteredStudents.filter((s) => s.gender === 'Female').length,
      rte: filteredStudents.filter((s) => s.isRTE).length, ews: filteredStudents.filter((s) => s.isEWS).length, minority: filteredStudents.filter((s) => s.isMinority).length,
      scst: filteredStudents.filter((s) => s.category === 'SC' || s.category === 'ST').length, byBranch,
      byCategory: filteredStudents.reduce((a, s) => ({ ...a, [s.category]: (a[s.category] || 0) + 1 }), {} as Record<string, number>),
      byReligion: filteredStudents.reduce((a, s) => ({ ...a, [s.religion]: (a[s.religion] || 0) + 1 }), {} as Record<string, number>),
      byAdmissionType: filteredStudents.reduce((a, s) => ({ ...a, [s.admissionType]: (a[s.admissionType] || 0) + 1 }), {} as Record<string, number>)
    };
  }, [filteredStudents, selectedBranches]);

  const handleResetFilters = () => {setGradeFilter('all');setGenderFilter('all');setCategoryFilter('all');setReligionFilter('all');setRteFilter('all');setEwsFilter('all');setMinorityFilter('all');setAdmissionTypeFilter('all');setTypeFilter('all');setSearchQuery('');};
  const isFilterActive = gradeFilter !== 'all' || genderFilter !== 'all' || categoryFilter !== 'all' || religionFilter !== 'all' || typeFilter !== 'all' || rteFilter !== 'all' || ewsFilter !== 'all' || minorityFilter !== 'all' || admissionTypeFilter !== 'all' || searchQuery !== '';
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {setToast({ message, type });setTimeout(() => setToast(null), 4000);};

  const handleGenerateReport = () => {
    if (!selectedReportType) return showToast('Please select a report type', 'error');
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedReports([{ id: Date.now().toString(), name: `${selectedReportType} - ${new Date().toLocaleDateString()}`, type: selectedReportType, generatedAt: new Date().toLocaleString(), generatedBy: 'Admin', status: 'completed', filters: { ...reportConfig, branches: selectedBranches, batch: selectedBatch }, format: reportConfig.format }, ...generatedReports]);
      setIsGenerating(false);setShowReportModal(false);setSelectedReportType('');showToast('Report generated!');
    }, 2000);
  };

  const filteredTemplates = reportTemplates.filter((t) => reportCategoryFilter === 'all' || t.category === reportCategoryFilter);
  const getCategoryColor = (c: string) => ({ strength: 'info', reservation: 'warning', demographic: 'purple', academic: 'success', list: 'default', custom: 'pink' })[c] || 'default';
  const selectClass = 'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white';

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><FileSpreadsheet className="w-7 h-7 text-blue-600" />Student Reports & Analytics</h1>
            <p className="text-gray-500 text-sm mt-1">Generate reports by branch and batch</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <MultiSelect options={BRANCHES} selected={selectedBranches} onChange={setSelectedBranches} />
            <select value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} className="px-3 py-2 bg-white border rounded-lg text-sm">
              {BATCHES.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
            <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"><BarChart className="w-4 h-4" />Generate Report</button>
          </div>
        </div>
      </div>

      {/* Branch Filter Display */}
      {selectedBranches.length > 0 &&
      <div className="flex-shrink-0 bg-white border-b px-6 py-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-gray-500">Active:</span>
            {activeBranches.map((b) => <BranchBadge key={b.id} branchId={b.id} />)}
            <span className="text-xs text-gray-400">| Batch: {selectedBatch}</span>
          </div>
        </div>
      }

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b px-6">
        <div className="flex gap-1">
          {[{ id: 'templates', label: 'Templates', icon: FileText, count: reportTemplates.length }, { id: 'generated', label: 'Generated', icon: CheckCircle, count: generatedReports.length }, { id: 'data', label: 'Live Data', icon: Activity }].map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}{tab.count && <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-100 rounded-full">{tab.count}</span>}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {selectedBranches.length === 0 ?
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center"><Building className="w-12 h-12 text-yellow-500 mx-auto mb-3" /><h3 className="font-semibold text-yellow-800">No Branch Selected</h3><p className="text-sm text-yellow-600">Please select at least one branch</p></div> :

        <>
            {/* Templates Tab */}
            {activeTab === 'templates' &&
          <div className="space-y-6">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                  {[{ id: 'all', label: 'All' }, { id: 'strength', label: 'Strength' }, { id: 'reservation', label: 'Reservation' }, { id: 'demographic', label: 'Demographics' }, { id: 'academic', label: 'Academic' }, { id: 'list', label: 'Lists' }, { id: 'custom', label: 'Custom' }].map((cat) =>
              <button key={cat.id} onClick={() => setReportCategoryFilter(cat.id)} className={`px-3 py-1.5 text-sm font-medium rounded-lg ${reportCategoryFilter === cat.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat.label}</button>
              )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((r) =>
              <div key={r.id} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${r.category === 'reservation' ? 'bg-orange-50' : r.category === 'academic' ? 'bg-green-50' : r.category === 'strength' ? 'bg-blue-50' : r.category === 'custom' ? 'bg-pink-50' : 'bg-indigo-50'}`}>
                          <r.icon className={`w-6 h-6 ${r.category === 'reservation' ? 'text-orange-600' : r.category === 'academic' ? 'text-green-600' : r.category === 'strength' ? 'text-blue-600' : r.category === 'custom' ? 'text-pink-600' : 'text-indigo-600'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{r.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                          {r.tags && <div className="flex flex-wrap gap-1 mt-2">{r.tags.map((t, i) => <span key={i} className="px-1.5 py-0.5 text-xs bg-gray-100 rounded">{t}</span>)}</div>}
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <Badge variant={getCategoryColor(r.category)}>{r.category}</Badge>
                        <div className="flex gap-1">
                          <button onClick={() => setPreviewReport(r)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => {setSelectedReportType(r.title);setShowReportModal(true);}} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><BarChart className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
              )}
                </div>
              </div>
          }

            {/* Generated Reports Tab */}
            {activeTab === 'generated' &&
          <Card title="Generated Reports">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>{['Report', 'Branch/Batch', 'Generated', 'Format', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y">
                      {generatedReports.map((r) =>
                  <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3"><p className="font-medium">{r.name}</p><p className="text-xs text-gray-500">{r.type}</p></td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {(r.filters.branches || ['main']).slice(0, 2).map((b: string) => <BranchBadge key={b} branchId={b} />)}
                              {(r.filters.branches?.length || 0) > 2 && <span className="text-xs text-gray-400">+{r.filters.branches.length - 2}</span>}
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{r.filters.batch || '2024-25'}</p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{r.generatedAt}</td>
                          <td className="px-4 py-3"><Badge variant={r.format === 'PDF' ? 'error' : 'success'}>{r.format}</Badge></td>
                          <td className="px-4 py-3"><Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Done</Badge></td>
                          <td className="px-4 py-3 flex gap-1">
                            {[{ icon: Eye, color: 'blue' }, { icon: Download, color: 'green' }, { icon: Printer, color: 'purple' }, { icon: Mail, color: 'orange' }].map(({ icon: Icon, color }) =>
                      <button key={color} className={`p-1.5 text-gray-400 hover:text-${color}-600 hover:bg-${color}-50 rounded`}><Icon className="w-4 h-4" /></button>
                      )}
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>
              </Card>
          }

            {/* Live Data Tab */}
            {activeTab === 'data' &&
          <div className="space-y-6">
                {/* Branch-wise Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.byBranch.map((b) =>
              <div key={b.id} className="bg-white rounded-xl border p-4" style={{ borderLeftWidth: 4, borderLeftColor: b.color }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">{b.name}</span>
                        <span className="text-2xl font-bold" style={{ color: b.color }}>{b.count}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between"><span className="text-gray-500">Male</span><span className="font-medium">{b.male}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Female</span><span className="font-medium">{b.female}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">RTE</span><span className="font-medium">{b.rte}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">SC/ST</span><span className="font-medium">{b.scst}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">EWS</span><span className="font-medium">{b.ews}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Minority</span><span className="font-medium">{b.minority}</span></div>
                      </div>
                    </div>
              )}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[{ label: 'Total', value: stats.total, icon: Users, color: 'blue' }, { label: 'RTE', value: stats.rte, icon: Shield, color: 'orange' }, { label: 'SC/ST', value: stats.scst, icon: Layers, color: 'purple' }, { label: 'Minority', value: stats.minority, icon: Globe, color: 'green' }, { label: 'EWS', value: stats.ews, icon: Heart, color: 'pink' }].map((s) =>
              <div key={s.label} className={`bg-white rounded-xl border p-4 border-l-4 border-l-${s.color}-500`}>
                      <div className="flex items-center justify-between">
                        <div><div className="text-xs text-gray-500 uppercase">{s.label}</div><div className="text-2xl font-bold mt-1">{s.value}</div></div>
                        <s.icon className={`w-8 h-8 text-${s.color}-500 opacity-50`} />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{stats.total > 0 ? (s.value / stats.total * 100).toFixed(1) : 0}% of total</p>
                    </div>
              )}
                </div>

                {/* Distribution Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[{ title: 'Category', data: stats.byCategory, color: 'blue' }, { title: 'Religion', data: stats.byReligion, color: 'green' }, { title: 'Admission Type', data: stats.byAdmissionType, color: 'purple' }].map(({ title, data, color }) =>
              <Card key={title} title={`${title} Distribution`}>
                      <div className="space-y-3">
                        {Object.entries(data).map(([k, v]) =>
                  <div key={k} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{k}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2"><div className={`bg-${color}-600 h-2 rounded-full`} style={{ width: `${v / stats.total * 100}%` }} /></div>
                              <span className="text-sm font-medium w-8">{v}</span>
                            </div>
                          </div>
                  )}
                      </div>
                    </Card>
              )}
                </div>

                {/* Data Table */}
                <Card>
                  <div className="p-5 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Student Data</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}><Filter className="w-4 h-4" />{showFilters ? 'Hide' : 'Show'} Filters</button>
                        {isFilterActive && <button onClick={handleResetFilters} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg"><X className="w-4 h-4" />Reset</button>}
                      </div>
                    </div>
                    {showFilters &&
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div><label className="block text-xs font-medium mb-1">Search</label><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><input type="text" placeholder="Name / ADM No..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`${selectClass} pl-10`} /></div></div>
                          <div><label className="block text-xs font-medium mb-1">Grade</label><select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className={selectClass}><option value="all">All</option>{['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'].map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
                          <div><label className="block text-xs font-medium mb-1">Gender</label><select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className={selectClass}><option value="all">All</option><option value="Male">Male</option><option value="Female">Female</option></select></div>
                          <div><label className="block text-xs font-medium mb-1">Category</label><select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={selectClass}><option value="all">All</option>{['General', 'OBC', 'SC', 'ST', 'EWS'].map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
                          <div><label className="block text-xs font-medium mb-1">RTE</label><select value={rteFilter} onChange={(e) => setRteFilter(e.target.value)} className={selectClass}><option value="all">All</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                          <div><label className="block text-xs font-medium mb-1">EWS</label><select value={ewsFilter} onChange={(e) => setEwsFilter(e.target.value)} className={selectClass}><option value="all">All</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                          <div><label className="block text-xs font-medium mb-1">Minority</label><select value={minorityFilter} onChange={(e) => setMinorityFilter(e.target.value)} className={selectClass}><option value="all">All</option><option value="yes">Yes</option><option value="no">No</option></select></div>
                          <div><label className="block text-xs font-medium mb-1">Admission</label><select value={admissionTypeFilter} onChange={(e) => setAdmissionTypeFilter(e.target.value)} className={selectClass}><option value="all">All</option>{['Regular', 'RTE', 'Management', 'Transfer'].map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                          <div><label className="block text-xs font-medium mb-1">Special</label><select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectClass}><option value="all">All</option>{['transfer', 'sibling', 'achiever', 'transport', 'hostel', 'disability'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
                        </div>
                      </div>
                }
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y">
                      <thead className="bg-gray-50">
                        <tr>{['Student', 'Branch', 'Class', 'Demographics', 'Quota', 'Admission', 'Performance'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredStudents.slice(0, 50).map((s) =>
                    <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3"><p className="font-medium">{s.studentName}</p><p className="text-xs text-gray-500">{s.admissionNo}</p></td>
                            <td className="px-4 py-3"><BranchBadge branchId={s.branchId} /></td>
                            <td className="px-4 py-3"><p className="text-sm">{s.grade}</p><p className="text-xs text-gray-500">Sec: {s.section}</p></td>
                            <td className="px-4 py-3"><Badge variant={s.gender === 'Male' ? 'info' : 'pink'}>{s.gender}</Badge><div className="flex gap-1 mt-1 flex-wrap"><span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{s.religion}</span><span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{s.category}</span></div></td>
                            <td className="px-4 py-3"><div className="flex flex-col gap-1">{s.isRTE && <Badge variant="warning">RTE</Badge>}{s.isEWS && <Badge variant="pink">EWS</Badge>}{s.isMinority && <Badge variant="purple">Minority</Badge>}{!s.isRTE && !s.isEWS && !s.isMinority && <span className="text-xs text-gray-400">-</span>}</div></td>
                            <td className="px-4 py-3"><Badge variant={s.admissionType === 'Regular' ? 'success' : s.admissionType === 'RTE' ? 'warning' : 'info'}>{s.admissionType}</Badge></td>
                            <td className="px-4 py-3"><span className={`text-lg font-bold ${s.academicGrade.startsWith('A') ? 'text-green-600' : s.academicGrade.startsWith('B') ? 'text-blue-600' : 'text-orange-600'}`}>{s.academicGrade}</span><span className="text-sm text-gray-500 ml-1">({s.academicScore}%)</span></td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing <span className="font-medium">{Math.min(50, filteredStudents.length)}</span> of <span className="font-medium">{filteredStudents.length}</span></span>
                    <button onClick={() => {setSelectedReportType('Custom List');setShowReportModal(true);}} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"><Download className="w-4 h-4" />Export</button>
                  </div>
                </Card>
              </div>
          }
          </>
        }
      </div>

      {/* Generate Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => {setShowReportModal(false);setSelectedReportType('');}} title="Generate Report" size="xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            {selectedReportType ?
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"><span className="font-medium text-blue-800">{selectedReportType}</span><button onClick={() => setSelectedReportType('')} className="text-blue-600"><X className="w-4 h-4" /></button></div> :

            <select className={selectClass} value={selectedReportType} onChange={(e) => setSelectedReportType(e.target.value)}>
                <option value="">Select...</option>
                {['strength', 'reservation', 'demographic', 'academic', 'list', 'custom'].map((cat) =>
              <optgroup key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)}>
                    {reportTemplates.filter((t) => t.category === cat).map((t) => <option key={t.id} value={t.title}>{t.title}</option>)}
                  </optgroup>
              )}
              </select>
            }
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="text-sm font-semibold mb-3">Selected Branches & Batch</h4>
            <div className="flex flex-wrap gap-2 mb-2">{activeBranches.map((b) => <BranchBadge key={b.id} branchId={b.id} />)}</div>
            <p className="text-xs text-gray-500">Batch: {selectedBatch}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ label: 'Grade', key: 'grade', opts: ['all', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11'] }, { label: 'Gender', key: 'gender', opts: ['all', 'Male', 'Female'] }, { label: 'Category', key: 'category', opts: ['all', 'General', 'OBC', 'SC', 'ST', 'EWS'] }].map((f) =>
            <div key={f.key}><label className="block text-sm font-medium mb-1">{f.label}</label><select className={selectClass} value={reportConfig[f.key as keyof typeof reportConfig] as string} onChange={(e) => setReportConfig({ ...reportConfig, [f.key]: e.target.value })}>{f.opts.map((o) => <option key={o} value={o}>{o === 'all' ? 'All' : o}</option>)}</select></div>
            )}
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h4 className="text-sm font-semibold text-orange-800 mb-3">Reservation Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: 'RTE', key: 'rte' }, { label: 'EWS', key: 'ews' }, { label: 'Minority', key: 'minority' }].map((f) =>
              <div key={f.key}><label className="block text-xs font-medium mb-1">{f.label}</label><select className={selectClass} value={reportConfig[f.key as keyof typeof reportConfig] as string} onChange={(e) => setReportConfig({ ...reportConfig, [f.key]: e.target.value })}><option value="all">All</option><option value="yes">Yes Only</option><option value="no">No Only</option></select></div>
              )}
            </div>
          </div>

          <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)} className="flex items-center gap-2 text-sm text-blue-600">{showAdvancedOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}{showAdvancedOptions ? 'Hide' : 'Show'} Advanced</button>

          {showAdvancedOptions &&
          <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <h4 className="text-sm font-semibold mb-3">Include</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Photo', 'Contact', 'Parent Info', 'Academic', 'Attendance', 'Achievements'].map((opt) => {
                  const key = `include${opt.replace(' ', '')}` as keyof typeof reportConfig;
                  return <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={reportConfig[key] as boolean} onChange={(e) => setReportConfig({ ...reportConfig, [key]: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />{opt}</label>;
                })}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Sort By</label><select className={selectClass} value={reportConfig.sortBy} onChange={(e) => setReportConfig({ ...reportConfig, sortBy: e.target.value })}>{['name', 'rollNo', 'admissionNo', 'grade', 'performance'].map((o) => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Group By</label><select className={selectClass} value={reportConfig.groupBy} onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}>{['none', 'grade', 'section', 'gender', 'category', 'branch'].map((o) => <option key={o} value={o}>{o === 'none' ? 'None' : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-1">Format</label><select className={selectClass} value={reportConfig.format} onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value })}>{['PDF', 'Excel', 'CSV'].map((o) => <option key={o} value={o}>{o}</option>)}</select></div>
              </div>
            </div>
          }

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button onClick={() => setShowReportModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleGenerateReport} disabled={isGenerating || !selectedReportType} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isGenerating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><BarChart className="w-4 h-4" />Generate</>}
            </button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewReport} onClose={() => setPreviewReport(null)} title={previewReport?.title || 'Preview'} size="lg">
        {previewReport &&
        <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-3 rounded-lg ${previewReport.category === 'reservation' ? 'bg-orange-100' : previewReport.category === 'academic' ? 'bg-green-100' : 'bg-blue-100'}`}>
                <previewReport.icon className={`w-8 h-8 ${previewReport.category === 'reservation' ? 'text-orange-600' : previewReport.category === 'academic' ? 'text-green-600' : 'text-blue-600'}`} />
              </div>
              <div>
                <h4 className="font-semibold">{previewReport.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{previewReport.description}</p>
                <div className="mt-2 flex items-center gap-2"><Badge variant={getCategoryColor(previewReport.category)}>{previewReport.category}</Badge>{previewReport.tags?.map((t, i) => <span key={i} className="px-2 py-0.5 text-xs bg-gray-100 rounded">{t}</span>)}</div>
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="font-medium">Contents:</h5>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Data table with filters</li><li>Summary statistics</li><li>Branch-wise breakdown</li><li>Export compatible</li>
              </ul>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button onClick={() => setPreviewReport(null)} className="px-4 py-2 text-sm font-medium border rounded-lg">Close</button>
              <button onClick={() => {setSelectedReportType(previewReport.title);setPreviewReport(null);setShowReportModal(true);}} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Generate This Report</button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}

export default StudentAcademicReports;