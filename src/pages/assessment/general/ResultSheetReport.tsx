import React, { useState, useMemo } from 'react';
import {
  RefreshCw, Plus, Edit, Trash2, Search, X, ChevronDown, ChevronLeft, Eye, Save,
  Power, PowerOff, AlertTriangle, CheckCircle, BookOpen, Calculator, FileText,
  Target, Activity, Building, Percent, Grid, List, Info, Settings, Layers,
  Calendar, Users, TrendingUp, RotateCcw, Repeat, GitMerge, Copy, FileCheck,
  ArrowRight, Replace, Maximize, ListChecks, UserX, XCircle, Clock } from
'lucide-react';

// Types
type ReExamType = 'Absentee Re-Exam' | 'Fail Subject Re-Test' | 'Improvement Re-Exam';
type EligibilityCriteria = 'Absent in Main Exam' | 'Failed Subjects Only' | 'Below Target Percentage' | 'Voluntary Improvement';
type ResultMergeRule = 'Replace Original' | 'Best of Both' | 'Separate Record';
type ConfigStatus = 'Active' | 'Inactive' | 'Draft';

interface ReExamConfig {
  id: string;
  name: string;
  code: string;
  reExamType: ReExamType;
  description: string;
  academicYear: string;
  linkedExamId: string;
  linkedExamName: string;
  eligibilityCriteria: EligibilityCriteria;
  thresholdPercentage: number | null;
  minFailedSubjects: number | null;
  maxFailedSubjects: number | null;
  samePatternAsMain: boolean;
  reducedSyllabus: boolean;
  syllabusReductionPercent: number | null;
  reducedMaxMarks: number | null;
  carryForwardInternal: boolean;
  requiresApproval: boolean;
  feeRequired: boolean;
  feeAmount: number | null;
  maxAttempts: number;
  trackAttempts: boolean;
  resultMergeRule: ResultMergeRule;
  showInReportCard: boolean;
  separateColumn: boolean;
  applicableBoards: string[];
  applicableClasses: string[];
  registrationStart: string;
  registrationEnd: string;
  examStart: string;
  examEnd: string;
  resultDate: string;
  status: ConfigStatus;
  isUsed: boolean;
  studentsRegistered: number;
  createdAt: string;
  updatedAt: string;
}

// Constants
const reExamTypes: ReExamType[] = ['Absentee Re-Exam', 'Fail Subject Re-Test', 'Improvement Re-Exam'];

const eligibilityByType: Record<ReExamType, EligibilityCriteria[]> = {
  'Absentee Re-Exam': ['Absent in Main Exam'],
  'Fail Subject Re-Test': ['Failed Subjects Only', 'Below Target Percentage'],
  'Improvement Re-Exam': ['Below Target Percentage', 'Voluntary Improvement']
};

const resultMergeRules: ResultMergeRule[] = ['Replace Original', 'Best of Both', 'Separate Record'];
const boards = ['General', 'CBSE', 'ICSE', 'GSEB', 'IB', 'Cambridge'];
const classes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const academicYears = ['2023-24', '2024-25', '2025-26'];

const mainExams = [
{ id: 'annual-2025', name: 'Annual Examination 2024-25' },
{ id: 'halfyearly-2025', name: 'Half Yearly 2024-25' },
{ id: 'unit3-2025', name: 'Unit Test 3 2024-25' },
{ id: 'preboard-2025', name: 'Pre-Board 2024-25' }];


const typeConfig: Record<ReExamType, {icon: any;color: string;bgColor: string;description: string;}> = {
  'Absentee Re-Exam': {
    icon: UserX,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 border-orange-300',
    description: 'For students who were absent during the main examination due to valid reasons'
  },
  'Fail Subject Re-Test': {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 border-red-300',
    description: 'For students who failed in one or more subjects and need to clear them'
  },
  'Improvement Re-Exam': {
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-100 border-green-300',
    description: 'For students who want to improve their marks in specific subjects'
  }
};

// Initial Data
const initialConfigs: ReExamConfig[] = [
{
  id: '1',
  name: 'Annual Absentee Re-Exam 2024-25',
  code: 'ABS-ANN-2025',
  reExamType: 'Absentee Re-Exam',
  description: 'Re-examination for students who were absent during Annual Examination with valid medical or emergency reasons',
  academicYear: '2024-25',
  linkedExamId: 'annual-2025',
  linkedExamName: 'Annual Examination 2024-25',
  eligibilityCriteria: 'Absent in Main Exam',
  thresholdPercentage: null,
  minFailedSubjects: null,
  maxFailedSubjects: null,
  samePatternAsMain: true,
  reducedSyllabus: false,
  syllabusReductionPercent: null,
  reducedMaxMarks: null,
  carryForwardInternal: true,
  requiresApproval: true,
  feeRequired: false,
  feeAmount: null,
  maxAttempts: 1,
  trackAttempts: true,
  resultMergeRule: 'Replace Original',
  showInReportCard: true,
  separateColumn: false,
  applicableBoards: ['CBSE', 'General'],
  applicableClasses: ['IX', 'X', 'XI', 'XII'],
  registrationStart: '2025-04-01',
  registrationEnd: '2025-04-10',
  examStart: '2025-04-20',
  examEnd: '2025-04-30',
  resultDate: '2025-05-10',
  status: 'Active',
  isUsed: true,
  studentsRegistered: 23,
  createdAt: '2025-03-01',
  updatedAt: '2025-03-15'
},
{
  id: '2',
  name: 'Fail Subject Re-Test - Annual 2024-25',
  code: 'FAIL-ANN-2025',
  reExamType: 'Fail Subject Re-Test',
  description: 'Re-test for students who failed in up to 3 subjects in Annual Examination',
  academicYear: '2024-25',
  linkedExamId: 'annual-2025',
  linkedExamName: 'Annual Examination 2024-25',
  eligibilityCriteria: 'Failed Subjects Only',
  thresholdPercentage: null,
  minFailedSubjects: 1,
  maxFailedSubjects: 3,
  samePatternAsMain: true,
  reducedSyllabus: true,
  syllabusReductionPercent: 20,
  reducedMaxMarks: null,
  carryForwardInternal: true,
  requiresApproval: false,
  feeRequired: true,
  feeAmount: 500,
  maxAttempts: 2,
  trackAttempts: true,
  resultMergeRule: 'Replace Original',
  showInReportCard: true,
  separateColumn: false,
  applicableBoards: ['CBSE', 'GSEB'],
  applicableClasses: ['IX', 'X', 'XI', 'XII'],
  registrationStart: '2025-05-01',
  registrationEnd: '2025-05-15',
  examStart: '2025-06-01',
  examEnd: '2025-06-10',
  resultDate: '2025-06-20',
  status: 'Active',
  isUsed: true,
  studentsRegistered: 67,
  createdAt: '2025-03-10',
  updatedAt: '2025-04-01'
},
{
  id: '3',
  name: 'Improvement Exam - Half Yearly',
  code: 'IMP-HY-2025',
  reExamType: 'Improvement Re-Exam',
  description: 'Improvement examination for students scoring below 75% who want to improve their grades',
  academicYear: '2024-25',
  linkedExamId: 'halfyearly-2025',
  linkedExamName: 'Half Yearly 2024-25',
  eligibilityCriteria: 'Below Target Percentage',
  thresholdPercentage: 75,
  minFailedSubjects: null,
  maxFailedSubjects: null,
  samePatternAsMain: true,
  reducedSyllabus: false,
  syllabusReductionPercent: null,
  reducedMaxMarks: null,
  carryForwardInternal: false,
  requiresApproval: false,
  feeRequired: true,
  feeAmount: 300,
  maxAttempts: 1,
  trackAttempts: true,
  resultMergeRule: 'Best of Both',
  showInReportCard: true,
  separateColumn: true,
  applicableBoards: ['CBSE'],
  applicableClasses: ['XI', 'XII'],
  registrationStart: '2025-01-15',
  registrationEnd: '2025-01-25',
  examStart: '2025-02-01',
  examEnd: '2025-02-10',
  resultDate: '2025-02-20',
  status: 'Active',
  isUsed: true,
  studentsRegistered: 45,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-10'
},
{
  id: '4',
  name: 'Unit Test 3 Absentee Re-Exam',
  code: 'ABS-UT3-2025',
  reExamType: 'Absentee Re-Exam',
  description: 'Re-exam for students who missed Unit Test 3',
  academicYear: '2024-25',
  linkedExamId: 'unit3-2025',
  linkedExamName: 'Unit Test 3 2024-25',
  eligibilityCriteria: 'Absent in Main Exam',
  thresholdPercentage: null,
  minFailedSubjects: null,
  maxFailedSubjects: null,
  samePatternAsMain: true,
  reducedSyllabus: false,
  syllabusReductionPercent: null,
  reducedMaxMarks: null,
  carryForwardInternal: false,
  requiresApproval: true,
  feeRequired: false,
  feeAmount: null,
  maxAttempts: 1,
  trackAttempts: false,
  resultMergeRule: 'Replace Original',
  showInReportCard: false,
  separateColumn: false,
  applicableBoards: ['General'],
  applicableClasses: ['VI', 'VII', 'VIII', 'IX', 'X'],
  registrationStart: '2025-02-01',
  registrationEnd: '2025-02-05',
  examStart: '2025-02-10',
  examEnd: '2025-02-12',
  resultDate: '2025-02-15',
  status: 'Inactive',
  isUsed: true,
  studentsRegistered: 12,
  createdAt: '2025-01-25',
  updatedAt: '2025-02-15'
}];


// Components
const Card = ({ children, className = '', onClick }: any) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} onClick={onClick}>{children}</div>;


const Button = ({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  const sizes: any = { xs: 'px-2 py-1 text-xs', sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
    className={`inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>);

};

const Badge = ({ children, variant = 'default', size = 'md', className = '' }: any) => {
  const variants: any = {
    default: 'bg-gray-100 text-gray-800', success: 'bg-green-100 text-green-800', warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800', info: 'bg-blue-100 text-blue-800', purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };
  const sizes: any = { sm: 'px-2 py-0.5 text-[10px]', md: 'px-2.5 py-0.5 text-xs' };
  return <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};

const Toggle = ({ checked, onChange, disabled = false }: any) =>
<button onClick={() => !disabled && onChange(!checked)} disabled={disabled}
className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>;


const SectionHeader = ({ title, icon: Icon, expanded, onToggle, badge }: any) =>
<div onClick={onToggle} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border-b cursor-pointer hover:bg-slate-100 transition-all">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-600 rounded-lg"><Icon className="w-5 h-5 text-white" /></div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      {badge && <Badge variant="info" size="sm">{badge}</Badge>}
    </div>
    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
  </div>;


const StatCard = ({ title, value, icon: Icon, color, onClick }: any) =>
<div onClick={onClick} className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${color} ${onClick ? 'cursor-pointer' : ''}`}>
    <div className="flex items-center justify-between mb-2">
      <Icon className="w-5 h-5" />
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <p className="text-sm font-medium">{title}</p>
  </div>;


const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export function ReExamSetup() {
  const [configs, setConfigs] = useState<ReExamConfig[]>(initialConfigs);
  const [panel, setPanel] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: '', type: '', status: '', year: '2024-25', exam: '' });

  const [form, setForm] = useState<Partial<ReExamConfig>>({});
  const [sections, setSections] = useState({ basic: true, eligibility: true, structure: true, attempts: true, merge: true, applicability: false, schedule: false });

  const selected = useMemo(() => configs.find((c) => c.id === selectedId), [configs, selectedId]);

  const filtered = useMemo(() => configs.filter((c) => {
    if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase()) && !c.code.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.type && c.reExamType !== filters.type) return false;
    if (filters.status && c.status !== filters.status) return false;
    if (filters.year && c.academicYear !== filters.year) return false;
    if (filters.exam && c.linkedExamId !== filters.exam) return false;
    return true;
  }), [configs, filters]);

  const stats = useMemo(() => ({
    total: configs.length,
    active: configs.filter((c) => c.status === 'Active').length,
    inactive: configs.filter((c) => c.status === 'Inactive').length,
    absentee: configs.filter((c) => c.reExamType === 'Absentee Re-Exam').length,
    fail: configs.filter((c) => c.reExamType === 'Fail Subject Re-Test').length,
    improvement: configs.filter((c) => c.reExamType === 'Improvement Re-Exam').length,
    students: configs.reduce((s, c) => s + c.studentsRegistered, 0)
  }), [configs]);

  const activeFilters = [filters.type, filters.status, filters.exam].filter(Boolean).length;

  const initForm = (config?: ReExamConfig) => {
    setForm(config || {
      name: '', code: `RE-${Date.now().toString().slice(-6)}`, reExamType: 'Absentee Re-Exam',
      description: '', academicYear: '2024-25', linkedExamId: '', linkedExamName: '',
      eligibilityCriteria: 'Absent in Main Exam', thresholdPercentage: null, minFailedSubjects: null, maxFailedSubjects: 3,
      samePatternAsMain: true, reducedSyllabus: false, syllabusReductionPercent: null, reducedMaxMarks: null,
      carryForwardInternal: true, requiresApproval: false, feeRequired: false, feeAmount: null,
      maxAttempts: 1, trackAttempts: true, resultMergeRule: 'Replace Original',
      showInReportCard: true, separateColumn: false, applicableBoards: [], applicableClasses: [],
      registrationStart: '', registrationEnd: '', examStart: '', examEnd: '', resultDate: '', status: 'Active'
    });
    setSections({ basic: true, eligibility: true, structure: true, attempts: true, merge: true, applicability: true, schedule: true });
  };

  const handleCreate = () => {initForm();setSelectedId(null);setPanel('create');};
  const handleEdit = (c: ReExamConfig) => {initForm(c);setSelectedId(c.id);setPanel('edit');};
  const handleView = (c: ReExamConfig) => {setSelectedId(c.id);setPanel('view');};

  const handleSave = () => {
    if (!form.name?.trim() || !form.linkedExamId || !form.applicableBoards?.length || !form.applicableClasses?.length) {
      alert('Please fill all required fields');return;
    }
    const linked = mainExams.find((e) => e.id === form.linkedExamId);
    if (panel === 'create') {
      setConfigs((prev) => [...prev, { ...form, id: Date.now().toString(), linkedExamName: linked?.name || '', isUsed: false, studentsRegistered: 0, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] } as ReExamConfig]);
    } else if (selectedId) {
      setConfigs((prev) => prev.map((c) => c.id === selectedId ? { ...c, ...form, linkedExamName: linked?.name || c.linkedExamName, updatedAt: new Date().toISOString().split('T')[0] } : c));
    }
    setPanel('list');setSelectedId(null);
  };

  const handleDelete = (id: string) => {
    if (configs.find((c) => c.id === id)?.isUsed) {alert('Cannot delete - in use');setDeleteConfirm(null);return;}
    setConfigs((prev) => prev.filter((c) => c.id !== id));setDeleteConfirm(null);
  };

  const handleToggleStatus = (id: string) => {
    setConfigs((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date().toISOString().split('T')[0] } : c));
  };

  const handleTypeChange = (type: ReExamType) => {
    const defaultEligibility = eligibilityByType[type][0];
    setForm((prev) => ({ ...prev, reExamType: type, eligibilityCriteria: defaultEligibility,
      thresholdPercentage: type === 'Improvement Re-Exam' ? 75 : null,
      minFailedSubjects: type === 'Fail Subject Re-Test' ? 1 : null,
      maxFailedSubjects: type === 'Fail Subject Re-Test' ? 3 : null,
      requiresApproval: type === 'Absentee Re-Exam',
      feeRequired: type !== 'Absentee Re-Exam',
      feeAmount: type === 'Fail Subject Re-Test' ? 500 : type === 'Improvement Re-Exam' ? 300 : null,
      resultMergeRule: type === 'Improvement Re-Exam' ? 'Best of Both' : 'Replace Original'
    }));
  };

  // Config Card
  const ConfigCard = ({ config }: {config: ReExamConfig;}) => {
    const { icon: TypeIcon, bgColor } = typeConfig[config.reExamType];
    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-all ${config.status === 'Inactive' ? 'opacity-60' : ''}`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg border ${bgColor}`}><TypeIcon className="w-5 h-5" /></div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-1">{config.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{config.code}</p>
              </div>
            </div>
            <Badge variant={config.status === 'Active' ? 'success' : config.status === 'Draft' ? 'warning' : 'default'}>{config.status}</Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={bgColor}>{config.reExamType}</Badge>
            {config.feeRequired && <Badge variant="orange" size="sm">Fee: ₹{config.feeAmount}</Badge>}
            {config.requiresApproval && <Badge variant="purple" size="sm">Approval Required</Badge>}
          </div>

          <div className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="truncate">{config.linkedExamName}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-gray-400" />{config.academicYear}</div>
            <div className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4 text-gray-400" />{config.studentsRegistered} students</div>
            <div className="flex items-center gap-2 text-gray-600"><Repeat className="w-4 h-4 text-gray-400" />Max {config.maxAttempts} attempt</div>
            <div className="flex items-center gap-2 text-gray-600"><GitMerge className="w-4 h-4 text-gray-400" /><span className="truncate">{config.resultMergeRule}</span></div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {config.reducedSyllabus && <Badge variant="warning" size="sm">Reduced Syllabus</Badge>}
            {config.carryForwardInternal && <Badge variant="info" size="sm">Carry Forward</Badge>}
            {config.showInReportCard && <Badge variant="success" size="sm">In Report</Badge>}
            {config.isUsed && <Badge variant="purple" size="sm">In Use</Badge>}
          </div>

          <div className="flex items-center gap-2 pt-4 border-t">
            <Button variant="ghost" size="sm" className="flex-1 text-blue-600 hover:bg-blue-50" onClick={() => handleView(config)}><Eye className="w-4 h-4 mr-1" />View</Button>
            <Button variant="ghost" size="sm" className="flex-1 text-green-600 hover:bg-green-50" onClick={() => handleEdit(config)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
            <Button variant="ghost" size="sm" className={`px-2 ${config.status === 'Active' ? 'text-orange-500' : 'text-green-500'}`} onClick={() => handleToggleStatus(config.id)}>
              {config.status === 'Active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className={`px-2 ${!config.isUsed ? 'text-red-500' : 'text-gray-400 cursor-not-allowed'}`} onClick={() => !config.isUsed && setDeleteConfirm(config.id)} disabled={config.isUsed}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>);

  };

  // List Row
  const ConfigRow = ({ config }: {config: ReExamConfig;}) => {
    const { icon: TypeIcon, bgColor } = typeConfig[config.reExamType];
    return (
      <div className={`flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-md transition-all ${config.status === 'Inactive' ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`p-2 rounded-lg border ${bgColor}`}><TypeIcon className="w-5 h-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{config.name}</h3>
              <Badge className={bgColor} size="sm">{config.reExamType}</Badge>
              <Badge variant={config.status === 'Active' ? 'success' : 'default'} size="sm">{config.status}</Badge>
              {config.isUsed && <Badge variant="purple" size="sm">In Use</Badge>}
            </div>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="font-mono">{config.code}</span>
              <span>•</span>
              <span>{config.linkedExamName}</span>
              <span>•</span>
              <span>{config.studentsRegistered} students</span>
              {config.feeRequired && <><span>•</span><span>₹{config.feeAmount}</span></>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(config)}><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => handleEdit(config)}><Edit className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className={config.status === 'Active' ? 'text-orange-500' : 'text-green-500'} onClick={() => handleToggleStatus(config.id)}>
            {config.status === 'Active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="sm" className={!config.isUsed ? 'text-red-500' : 'text-gray-400'} onClick={() => !config.isUsed && setDeleteConfirm(config.id)} disabled={config.isUsed}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>);

  };

  // View Panel
  const ViewPanel = () => {
    if (!selected) return null;
    const { icon: TypeIcon, bgColor, description } = typeConfig[selected.reExamType];
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setPanel('list')}><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
          <Button variant="outline" onClick={() => handleEdit(selected)}><Edit className="w-4 h-4 mr-2" />Edit</Button>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl"><TypeIcon className="w-8 h-8" /></div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selected.name}</h2>
                    <Badge className="bg-white/20 text-white">{selected.status}</Badge>
                  </div>
                  <p className="text-blue-100">{selected.reExamType} • {selected.code} • {selected.academicYear}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{selected.studentsRegistered}</p>
                <p className="text-sm text-blue-200">Students Registered</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className={`p-4 border ${bgColor}`}>
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">About {selected.reExamType}</p>
              <p className="text-sm mt-1">{description}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Linked Main Examination</p>
              <p className="text-lg font-bold text-blue-800">{selected.linkedExamName}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg"><Target className="w-5 h-5 text-orange-600" /></div>
              <div><p className="text-xs text-gray-500">Eligibility</p><p className="font-semibold">{selected.eligibilityCriteria}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><GitMerge className="w-5 h-5 text-green-600" /></div>
              <div><p className="text-xs text-gray-500">Merge Rule</p><p className="font-semibold">{selected.resultMergeRule}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg"><Repeat className="w-5 h-5 text-purple-600" /></div>
              <div><p className="text-xs text-gray-500">Max Attempts</p><p className="font-semibold">{selected.maxAttempts}</p></div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
              <div><p className="text-xs text-gray-500">Exam Period</p><p className="font-semibold">{formatDate(selected.examStart)} - {formatDate(selected.examEnd)}</p></div>
            </div>
          </Card>
        </div>

        {selected.feeRequired &&
        <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg"><Calculator className="w-5 h-5 text-orange-600" /></div>
              <div><p className="text-sm text-orange-600 font-medium">Re-Exam Fee</p><p className="text-lg font-bold text-orange-800">₹{selected.feeAmount}</p></div>
            </div>
          </Card>
        }

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" />Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            { label: 'Same Pattern', value: selected.samePatternAsMain, icon: Copy, color: 'green' },
            { label: 'Reduced Syllabus', value: selected.reducedSyllabus, icon: FileText, color: 'yellow', extra: selected.reducedSyllabus ? `${selected.syllabusReductionPercent}%` : null },
            { label: 'Carry Forward', value: selected.carryForwardInternal, icon: ArrowRight, color: 'purple' },
            { label: 'Approval Required', value: selected.requiresApproval, icon: CheckCircle, color: 'blue' }].
            map((item) =>
            <div key={item.label} className={`p-4 rounded-xl border-2 text-center ${item.value ? `bg-${item.color}-50 border-${item.color}-300` : 'bg-gray-50 border-gray-200'}`}>
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.value ? `text-${item.color}-600` : 'text-gray-400'}`} />
                <p className="text-sm font-medium">{item.label}</p>
                <p className={`text-xs mt-1 ${item.value ? `text-${item.color}-600` : 'text-gray-400'}`}>{item.value ? item.extra || 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-blue-600" />Applicability</h3>
          <div className="space-y-4">
            <div><p className="text-sm font-medium text-gray-700 mb-2">Boards</p><div className="flex flex-wrap gap-2">{selected.applicableBoards.map((b) => <Badge key={b} variant="info">{b}</Badge>)}</div></div>
            <div><p className="text-sm font-medium text-gray-700 mb-2">Classes</p><div className="flex flex-wrap gap-2">{selected.applicableClasses.map((c) => <Badge key={c} variant="purple">Class {c}</Badge>)}</div></div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" />Schedule</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Registration</p>
              <p className="font-semibold text-blue-900">{formatDate(selected.registrationStart)} - {formatDate(selected.registrationEnd)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs text-green-600 font-medium mb-1">Examination</p>
              <p className="font-semibold text-green-900">{formatDate(selected.examStart)} - {formatDate(selected.examEnd)}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <p className="text-xs text-purple-600 font-medium mb-1">Result</p>
              <p className="font-semibold text-purple-900">{formatDate(selected.resultDate)}</p>
            </div>
          </div>
        </Card>

        {selected.description &&
        <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-blue-600" />Description</h3>
            <p className="text-gray-600">{selected.description}</p>
          </Card>
        }

        <Card className="p-4 bg-gray-50">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Created: {formatDate(selected.createdAt)}</span>
            <span>Updated: {formatDate(selected.updatedAt)}</span>
          </div>
        </Card>
      </div>);

  };

  // Form Panel
  const FormPanel = () => {
    const isEdit = panel === 'edit';
    const eligibilityOptions = form.reExamType ? eligibilityByType[form.reExamType] : [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setPanel('list')}><ChevronLeft className="w-4 h-4 mr-2" />Back</Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPanel('list')}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}><Save className="w-4 h-4 mr-2" />{isEdit ? 'Save Changes' : 'Create'}</Button>
          </div>
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-2xl font-bold">{isEdit ? `Edit: ${form.name}` : 'Create New Re-Exam Configuration'}</h2>
          <p className="text-blue-100 mt-1">Configure re-examination settings for absentees, failed students, or improvement</p>
        </Card>

        {/* Basic Info */}
        <Card className="overflow-hidden shadow-lg">
          <SectionHeader title="Basic Information" icon={FileText} expanded={sections.basic} onToggle={() => setSections((p) => ({ ...p, basic: !p.basic }))} />
          {sections.basic &&
          <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Re-Exam Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-4">
                  {reExamTypes.map((type) => {
                  const { icon: Icon, bgColor, description } = typeConfig[type];
                  return (
                    <button key={type} onClick={() => handleTypeChange(type)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${form.reExamType === type ? `${bgColor} ring-2 ring-blue-500` : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg ${bgColor}`}><Icon className="w-5 h-5" /></div>
                          <p className="font-semibold">{type}</p>
                        </div>
                        <p className="text-xs text-gray-500">{description}</p>
                      </button>);

                })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name || ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Annual Absentee Re-Exam" className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Code <span className="text-red-500">*</span></label>
                  <input type="text" value={form.code || ''} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g., ABS-ANN-2025" className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Academic Year</label>
                  <select value={form.academicYear || '2024-25'} onChange={(e) => setForm((p) => ({ ...p, academicYear: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                    {academicYears.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Linked Main Exam <span className="text-red-500">*</span></label>
                <select value={form.linkedExamId || ''} onChange={(e) => setForm((p) => ({ ...p, linkedExamId: e.target.value }))} className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Main Examination</option>
                  {mainExams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Enter description..." className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
          }
        </Card>

        {/* Eligibility */}
        <Card className="overflow-hidden shadow-lg">
          <SectionHeader title="Eligibility Criteria" icon={Target} expanded={sections.eligibility} onToggle={() => setSections((p) => ({ ...p, eligibility: !p.eligibility }))} />
          {sections.eligibility &&
          <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Eligibility Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-4">
                  {eligibilityOptions.map((criteria) =>
                <button key={criteria} onClick={() => setForm((p) => ({ ...p, eligibilityCriteria: criteria }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${form.eligibilityCriteria === criteria ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${form.eligibilityCriteria === criteria ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {criteria === 'Absent in Main Exam' && <UserX className="w-5 h-5 text-orange-600" />}
                          {criteria === 'Failed Subjects Only' && <XCircle className="w-5 h-5 text-red-600" />}
                          {criteria === 'Below Target Percentage' && <Percent className="w-5 h-5 text-yellow-600" />}
                          {criteria === 'Voluntary Improvement' && <TrendingUp className="w-5 h-5 text-green-600" />}
                        </div>
                        <p className="font-medium">{criteria}</p>
                      </div>
                    </button>
                )}
                </div>
              </div>

              {form.reExamType === 'Fail Subject Re-Test' &&
            <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Min Failed Subjects</label>
                    <input type="number" value={form.minFailedSubjects || ''} onChange={(e) => setForm((p) => ({ ...p, minFailedSubjects: Number(e.target.value) }))} min={1} max={10} className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Max Failed Subjects</label>
                    <input type="number" value={form.maxFailedSubjects || ''} onChange={(e) => setForm((p) => ({ ...p, maxFailedSubjects: Number(e.target.value) }))} min={1} max={10} className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
            }

              {(form.eligibilityCriteria === 'Below Target Percentage' || form.reExamType === 'Improvement Re-Exam') &&
            <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Threshold Percentage</label>
                  <div className="flex items-center gap-4">
                    <input type="number" value={form.thresholdPercentage || ''} onChange={(e) => setForm((p) => ({ ...p, thresholdPercentage: Number(e.target.value) }))} min={0} max={100} className="w-32 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    <span className="text-gray-500">Students scoring below this % are eligible</span>
                  </div>
                </div>
            }

              <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${form.requiresApproval ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className={`w-5 h-5 ${form.requiresApproval ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div><p className="text-sm font-medium">Requires Approval</p><p className="text-xs text-gray-500">Admin approval before registration</p></div>
                  </div>
                  <Toggle checked={form.requiresApproval || false} onChange={(v: boolean) => setForm((p) => ({ ...p, requiresApproval: v }))} />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${form.feeRequired ? 'bg-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Calculator className={`w-5 h-5 ${form.feeRequired ? 'text-orange-600' : 'text-gray-400'}`} />
                    <div><p className="text-sm font-medium">Fee Required</p><p className="text-xs text-gray-500">Charge fee for re-exam</p></div>
                  </div>
                  <Toggle checked={form.feeRequired || false} onChange={(v: boolean) => setForm((p) => ({ ...p, feeRequired: v }))} />
                </div>
              </div>

              {form.feeRequired &&
            <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Fee Amount (₹)</label>
                  <input type="number" value={form.feeAmount || ''} onChange={(e) => setForm((p) => ({ ...p, feeAmount: Number(e.target.value) }))} placeholder="e.g., 500" className="w-40 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
            }
            </div>
          }
        </Card>

        {/* Structure */}
        <Card className="overflow-hidden shadow-lg">
          <SectionHeader title="Exam Structure" icon={Settings} expanded={sections.structure} onToggle={() => setSections((p) => ({ ...p, structure: !p.structure }))} />
          {sections.structure &&
          <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
              { key: 'samePatternAsMain', label: 'Same Pattern as Main', desc: 'Use same exam structure', icon: Copy, color: 'green' },
              { key: 'reducedSyllabus', label: 'Reduced Syllabus', desc: 'Cover partial syllabus', icon: FileText, color: 'yellow' },
              { key: 'carryForwardInternal', label: 'Carry Forward Internal', desc: 'Use internal marks from main', icon: ArrowRight, color: 'purple' }].
              map((item) =>
              <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border-2 ${(form as any)[item.key] ? `bg-${item.color}-50 border-${item.color}-300` : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <item.icon className={`w-5 h-5 ${(form as any)[item.key] ? `text-${item.color}-600` : 'text-gray-400'}`} />
                      <div><p className="text-sm font-medium">{item.label}</p><p className="text-xs text-gray-500">{item.desc}</p></div>
                    </div>
                    <Toggle checked={(form as any)[item.key] || false} onChange={(v: boolean) => setForm((p) => ({ ...p, [item.key]: v }))} />
                  </div>
              )}
              </div>

              {form.reducedSyllabus &&
            <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Syllabus Reduction %</label>
                    <input type="number" value={form.syllabusReductionPercent || ''} onChange={(e) => setForm((p) => ({ ...p, syllabusReductionPercent: Number(e.target.value) }))} min={0} max={100} className="w-32 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Reduced Max Marks (optional)</label>
                    <input type="number" value={form.reducedMaxMarks || ''} onChange={(e) => setForm((p) => ({ ...p, reducedMaxMarks: Number(e.target.value) }))} placeholder="e.g., 70" className="w-32 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
            }
            </div>
          }
        </Card>

        {/* Attempts */}
        <Card className="overflow-hidden shadow-lg">
          <SectionHeader title="Attempt Limits" icon={Repeat} expanded={sections.attempts} onToggle={() => setSections((p) => ({ ...p, attempts: !p.attempts }))} />
          {sections.attempts &&
          <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Maximum Attempts</label>
                  <input type="number" value={form.maxAttempts || 1} onChange={(e) => setForm((p) => ({ ...p, maxAttempts: Number(e.target.value) }))} min={1} max={5} className="w-32 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${form.trackAttempts ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Activity className={`w-5 h-5 ${form.trackAttempts ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div><p className="text-sm font-medium">Track Attempts</p><p className="text-xs text-gray-500">Monitor attempt count per student</p></div>
                  </div>
                  <Toggle checked={form.trackAttempts || false} onChange={(v: boolean) => setForm((p) => ({ ...p, trackAttempts: v }))} />
                </div>
              </div>
            </div>
          }
        </Card>

        {/* Merge Rules */}
        <Card className="overflow-hidden shadow-lg">
          <SectionHeader title="Result Merge Rules" icon={GitMerge} expanded={sections.merge} onToggle={() => setSections((p) => ({ ...p, merge: !p.merge }))} />
          {sections.merge &&
          <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {resultMergeRules.map((rule) =>
              <button key={rule} onClick={() => setForm((p) => ({ ...p, resultMergeRule: rule, separateColumn: rule === 'Separate Record' }))}
              className={`p-4 rounded-xl border-2 text-left transition-all ${form.resultMergeRule === rule ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200 hover:border-green-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${form.resultMergeRule === rule ? 'bg-green-100' : 'bg-gray-100'}`}>
                        {rule === 'Replace Original' && <Replace className={`w-5 h-5 ${form.resultMergeRule === rule ? 'text-green-600' : 'text-gray-500'}`} />}
                        {rule === 'Best of Both' && <Maximize className={`w-5 h-5 ${form.resultMergeRule === rule ? 'text-green-600' : 'text-gray-500'}`} />}
                        {rule === 'Separate Record' && <Layers className={`w-5 h-5 ${form.resultMergeRule === rule ? 'text-green-600' : 'text-gray-500'}`} />}
                      </div>
                      <p className="font-medium">{rule}</p>
                    </div>
                  </button>
              )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${form.showInReportCard ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <FileCheck className={`w-5 h-5 ${form.showInReportCard ? 'text-green-600' : 'text-gray-400'}`} />
                    <div><p className="text-sm font-medium">Show in Report Card</p><p className="text-xs text-gray-500">Include in final report</p></div>
                  </div>
                  <Toggle checked={form.showInReportCard || false} onChange={(v: boolean) => setForm((p) => ({ ...p, showInReportCard: v }))} />
                </div>
                <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${form.separateColumn ? 'bg-purple-50 border-purple-300' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center gap-3">
                    <Layers className={`w-5 h-5 ${form.separateColumn ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div><p className="text-sm font-medium">Separate Column</p><p className="text-xs text-gray-500">Show as separate column</p></div>
                  </div>
                  <Toggle checked={form.separateColumn || false} onChange={(v: boolean) => setForm((p) => ({ ...p, separateColumn: v }))} />
                </div>
              </div>
            </div>
          }
        </Card>

        

        
      </div>);

  };

  // Delete Modal
  const DeleteModal = () => {
    if (!deleteConfirm) return null;
    const c = configs.find((x) => x.id === deleteConfirm);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-lg font-bold">Delete Re-Exam</h3><p className="text-sm text-gray-500">This cannot be undone</p></div>
          </div>
          <p className="text-gray-600 mb-6">Delete <strong>"{c?.name}"</strong>?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => handleDelete(deleteConfirm)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>
          </div>
        </Card>
      </div>);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg"><RefreshCw className="w-8 h-8 text-white" /></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Re-Exam Setup</h1>
            <p className="text-sm text-gray-500">Configure re-examination for absentees, failed students, or improvement</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select value={filters.year} onChange={(e) => setFilters((p) => ({ ...p, year: e.target.value }))} className="rounded-lg border border-gray-300 px-4 py-2 font-semibold focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            {academicYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {panel === 'list' && <Button variant="primary" onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />Add Re-Exam</Button>}
        </div>
      </div>

      {panel === 'list' &&
      <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <StatCard title="Total" value={stats.total} icon={Layers} color="bg-blue-50 text-blue-700 border-blue-200" />
            <StatCard title="Active" value={stats.active} icon={CheckCircle} color="bg-green-50 text-green-700 border-green-200" onClick={() => setFilters((p) => ({ ...p, status: 'Active' }))} />
            <StatCard title="Inactive" value={stats.inactive} icon={PowerOff} color="bg-gray-50 text-gray-700 border-gray-200" onClick={() => setFilters((p) => ({ ...p, status: 'Inactive' }))} />
            <StatCard title="Absentee" value={stats.absentee} icon={UserX} color="bg-orange-50 text-orange-700 border-orange-200" onClick={() => setFilters((p) => ({ ...p, type: 'Absentee Re-Exam' }))} />
            <StatCard title="Fail Re-Test" value={stats.fail} icon={XCircle} color="bg-red-50 text-red-700 border-red-200" onClick={() => setFilters((p) => ({ ...p, type: 'Fail Subject Re-Test' }))} />
            <StatCard title="Improvement" value={stats.improvement} icon={TrendingUp} color="bg-green-50 text-green-700 border-green-200" onClick={() => setFilters((p) => ({ ...p, type: 'Improvement Re-Exam' }))} />
            <StatCard title="Students" value={stats.students} icon={Users} color="bg-teal-50 text-teal-700 border-teal-200" />
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search..." value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <select value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">All Types</option>
                  {reExamTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
                <select value={filters.exam} onChange={(e) => setFilters((p) => ({ ...p, exam: e.target.value }))} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">All Exams</option>
                  {mainExams.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
                </select>
                {activeFilters > 0 && <Button variant="ghost" size="sm" onClick={() => setFilters({ search: '', type: '', status: '', year: '2024-25', exam: '' })}><X className="w-4 h-4 mr-1" />Clear ({activeFilters})</Button>}
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}><Grid className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
          </Card>

          {/* Grid/List */}
          {viewMode === 'grid' ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((c) => <ConfigCard key={c.id} config={c} />)}
              {filtered.length === 0 &&
          <div className="col-span-full p-12 text-center text-gray-500">
                  <RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No re-exam configurations found</p>
                  <Button variant="primary" className="mt-4" onClick={handleCreate}><Plus className="w-4 h-4 mr-2" />Create Re-Exam</Button>
                </div>
          }
            </div> :

        <div className="space-y-3">
              {filtered.map((c) => <ConfigRow key={c.id} config={c} />)}
              {filtered.length === 0 && <Card className="p-12 text-center text-gray-500"><RefreshCw className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p className="text-lg font-medium">No re-exam configurations found</p></Card>}
            </div>
        }

          {/* Info */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Re-Exam Types</p>
                <ul className="text-sm text-blue-600 mt-1 space-y-1">
                  <li><strong>Absentee Re-Exam:</strong> For students absent during main exam with valid reasons</li>
                  <li><strong>Fail Subject Re-Test:</strong> For students who failed in subjects and need to clear them</li>
                  <li><strong>Improvement Re-Exam:</strong> For students wanting to improve their scores</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      }

      {(panel === 'create' || panel === 'edit') && <FormPanel />}
      {panel === 'view' && <ViewPanel />}
      <DeleteModal />
    </div>);

}

export default ReExamSetup;