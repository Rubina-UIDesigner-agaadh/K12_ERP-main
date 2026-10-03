import React, { useState, useMemo } from 'react';
import {
  Settings,
  Save,
  RefreshCcw,
  Eye,
  Edit3,
  X,
  Check,
  Plus,
  Trash2,
  Copy,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Info,
  HelpCircle,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Clock,
  Hash,
  Bookmark,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  MoreVertical,
  Layers,
  GraduationCap,
  School,
  Building2,
  BookOpen,
  Users,
  Percent,
  Target,
  ClipboardCheck,
  FileText,
  ArrowRight,
  ArrowLeft,
  ChevronUp,
  Grip,
  Move,
  PlayCircle,
  PauseCircle,
  RotateCcw } from
'lucide-react';

// ============ TYPE DEFINITIONS ============

type ClassLevel = 'PRIMARY' | 'UPPER_PRIMARY' | 'SECONDARY' | 'SENIOR_SECONDARY';
type ExamCategory = 'PERIODIC' | 'TERMINAL' | 'ANNUAL' | 'PRACTICAL' | 'PROJECT' | 'INTERNAL';
type ConfigStatus = 'draft' | 'active' | 'locked';

interface ExamType {
  id: string;
  name: string;
  shortName: string;
  category: ExamCategory;
  maxMarks: number;
  weightage: number;
  passingMarks: number;
  isInternal: boolean;
  isPractical: boolean;
  sequence: number;
  isActive: boolean;
  conductedBy: 'school' | 'board';
  description?: string;
}

interface Term {
  id: string;
  name: string;
  shortName: string;
  weightage: number;
  startMonth: number;
  endMonth: number;
  isActive: boolean;
  examTypes: ExamType[];
}

interface ClassExamConfig {
  id: string;
  standard: number;
  classLevel: ClassLevel;
  academicYear: string;
  terms: Term[];
  totalMarks: number;
  status: ConfigStatus;
  isDefault: boolean;
  lastModified: string;
  modifiedBy: string;
}

// ============ UTILITY FUNCTIONS ============

const getClassLevel = (standard: number): ClassLevel => {
  if (standard >= 1 && standard <= 5) return 'PRIMARY';
  if (standard >= 6 && standard <= 8) return 'UPPER_PRIMARY';
  if (standard >= 9 && standard <= 10) return 'SECONDARY';
  return 'SENIOR_SECONDARY';
};

const getClassLevelConfig = (level: ClassLevel) => {
  const configs = {
    PRIMARY: { label: 'Primary', range: '1-5', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: BookOpen },
    UPPER_PRIMARY: { label: 'Upper Primary', range: '6-8', bg: 'bg-blue-100', text: 'text-blue-700', icon: School },
    SECONDARY: { label: 'Secondary', range: '9-10', bg: 'bg-purple-100', text: 'text-purple-700', icon: GraduationCap },
    SENIOR_SECONDARY: { label: 'Senior Secondary', range: '11-12', bg: 'bg-rose-100', text: 'text-rose-700', icon: Building2 }
  };
  return configs[level];
};

const getExamCategoryConfig = (category: ExamCategory) => {
  const configs = {
    PERIODIC: { label: 'Periodic Test', bg: 'bg-blue-100', text: 'text-blue-700', color: 'blue' },
    TERMINAL: { label: 'Terminal Exam', bg: 'bg-purple-100', text: 'text-purple-700', color: 'purple' },
    ANNUAL: { label: 'Annual Exam', bg: 'bg-rose-100', text: 'text-rose-700', color: 'rose' },
    PRACTICAL: { label: 'Practical', bg: 'bg-green-100', text: 'text-green-700', color: 'green' },
    PROJECT: { label: 'Project Work', bg: 'bg-amber-100', text: 'text-amber-700', color: 'amber' },
    INTERNAL: { label: 'Internal Assessment', bg: 'bg-cyan-100', text: 'text-cyan-700', color: 'cyan' }
  };
  return configs[category];
};

const months = [
'January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];


// ============ DEFAULT DATA ============

const createDefaultTerms = (classLevel: ClassLevel): Term[] => {
  // CBSE Standard Term Structure
  const term1ExamTypes: ExamType[] = [
  {
    id: 'pt1',
    name: 'Periodic Test 1',
    shortName: 'PT-1',
    category: 'PERIODIC',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 1,
    isActive: true,
    conductedBy: 'school',
    description: 'First periodic assessment'
  },
  {
    id: 'pt2',
    name: 'Periodic Test 2',
    shortName: 'PT-2',
    category: 'PERIODIC',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 2,
    isActive: true,
    conductedBy: 'school',
    description: 'Second periodic assessment'
  },
  {
    id: 'nb1',
    name: 'Notebook Submission',
    shortName: 'NB-1',
    category: 'INTERNAL',
    maxMarks: 5,
    weightage: 2.5,
    passingMarks: 2,
    isInternal: true,
    isPractical: false,
    sequence: 3,
    isActive: true,
    conductedBy: 'school',
    description: 'Notebook assessment'
  },
  {
    id: 'sea1',
    name: 'Subject Enrichment',
    shortName: 'SEA-1',
    category: 'PROJECT',
    maxMarks: 5,
    weightage: 2.5,
    passingMarks: 2,
    isInternal: true,
    isPractical: false,
    sequence: 4,
    isActive: true,
    conductedBy: 'school',
    description: 'Subject enrichment activities'
  },
  {
    id: 'hy',
    name: 'Half Yearly Examination',
    shortName: 'HY',
    category: 'TERMINAL',
    maxMarks: 80,
    weightage: 40,
    passingMarks: 26,
    isInternal: false,
    isPractical: false,
    sequence: 5,
    isActive: true,
    conductedBy: 'school',
    description: 'Mid-term examination'
  }];


  const term2ExamTypes: ExamType[] = [
  {
    id: 'pt3',
    name: 'Periodic Test 3',
    shortName: 'PT-3',
    category: 'PERIODIC',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 1,
    isActive: true,
    conductedBy: 'school',
    description: 'Third periodic assessment'
  },
  {
    id: 'pt4',
    name: 'Periodic Test 4',
    shortName: 'PT-4',
    category: 'PERIODIC',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 2,
    isActive: true,
    conductedBy: 'school',
    description: 'Fourth periodic assessment'
  },
  {
    id: 'nb2',
    name: 'Notebook Submission',
    shortName: 'NB-2',
    category: 'INTERNAL',
    maxMarks: 5,
    weightage: 2.5,
    passingMarks: 2,
    isInternal: true,
    isPractical: false,
    sequence: 3,
    isActive: true,
    conductedBy: 'school',
    description: 'Notebook assessment'
  },
  {
    id: 'sea2',
    name: 'Subject Enrichment',
    shortName: 'SEA-2',
    category: 'PROJECT',
    maxMarks: 5,
    weightage: 2.5,
    passingMarks: 2,
    isInternal: true,
    isPractical: false,
    sequence: 4,
    isActive: true,
    conductedBy: 'school',
    description: 'Subject enrichment activities'
  },
  {
    id: 'annual',
    name: 'Annual Examination',
    shortName: 'AE',
    category: 'ANNUAL',
    maxMarks: 80,
    weightage: 40,
    passingMarks: 26,
    isInternal: false,
    isPractical: false,
    sequence: 5,
    isActive: classLevel !== 'SECONDARY' && classLevel !== 'SENIOR_SECONDARY',
    conductedBy: classLevel === 'SECONDARY' || classLevel === 'SENIOR_SECONDARY' ? 'board' : 'school',
    description: 'End of year examination'
  }];


  // For board classes (9-12), add board exam
  if (classLevel === 'SECONDARY' || classLevel === 'SENIOR_SECONDARY') {
    term2ExamTypes.push({
      id: 'board',
      name: 'Board Examination',
      shortName: 'BOARD',
      category: 'ANNUAL',
      maxMarks: 80,
      weightage: 40,
      passingMarks: 26,
      isInternal: false,
      isPractical: false,
      sequence: 6,
      isActive: true,
      conductedBy: 'board',
      description: 'CBSE Board examination'
    });
  }

  return [
  {
    id: 'term1',
    name: 'Term 1 (April - September)',
    shortName: 'T1',
    weightage: 50,
    startMonth: 4, // April
    endMonth: 9, // September
    isActive: true,
    examTypes: term1ExamTypes
  },
  {
    id: 'term2',
    name: 'Term 2 (October - March)',
    shortName: 'T2',
    weightage: 50,
    startMonth: 10, // October
    endMonth: 3, // March
    isActive: true,
    examTypes: term2ExamTypes
  }];

};

const generateInitialConfigs = (): ClassExamConfig[] => {
  const configs: ClassExamConfig[] = [];

  for (let std = 1; std <= 12; std++) {
    const classLevel = getClassLevel(std);
    configs.push({
      id: `config-${std}`,
      standard: std,
      classLevel,
      academicYear: '2024-25',
      terms: createDefaultTerms(classLevel),
      totalMarks: 100,
      status: std <= 8 ? 'active' : 'draft',
      isDefault: true,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Admin'
    });
  }

  return configs;
};

// ============ UI COMPONENTS ============

const Card: React.FC<{children: React.ReactNode;className?: string;onClick?: () => void;}> = ({
  children, className = '', onClick
}) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
  onClick={onClick}>

    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', disabled = false, className = '', onClick }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>

      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>);

};

const Toggle: React.FC<{value: boolean;onChange: (v: boolean) => void;disabled?: boolean;}> = ({
  value, onChange, disabled
}) =>
<button
  type="button"
  onClick={() => !disabled && onChange(!value)}
  disabled={disabled}
  className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-indigo-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>;


// ============ EXAM TYPE EDITOR ============

const ExamTypeEditor: React.FC<{
  exam: ExamType;
  onUpdate: (updates: Partial<ExamType>) => void;
  onDelete: () => void;
  isLocked: boolean;
}> = ({ exam, onUpdate, onDelete, isLocked }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryConfig = getExamCategoryConfig(exam.category);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
    exam.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`
    }>
      {/* Header */}
      <div className="flex items-center gap-4 p-4">
        <button
          className="p-1 hover:bg-gray-100 rounded"
          onClick={() => setIsExpanded(!isExpanded)}>

          {isExpanded ?
          <ChevronDown className="w-5 h-5 text-gray-400" /> :

          <ChevronRight className="w-5 h-5 text-gray-400" />
          }
        </button>
        
        {/* Toggle Active */}
        <Toggle
          value={exam.isActive}
          onChange={(v) => onUpdate({ isActive: v })}
          disabled={isLocked} />

        
        {/* Category Indicator */}
        <div className={`w-1.5 h-10 rounded-full bg-${categoryConfig.color}-500`} />
        
        {/* Exam Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{exam.name}</h4>
            <Badge className={`${categoryConfig.bg} ${categoryConfig.text}`}>
              {categoryConfig.label}
            </Badge>
            {exam.isInternal &&
            <Badge variant="info">Internal</Badge>
            }
            {exam.conductedBy === 'board' &&
            <Badge variant="purple">Board</Badge>
            }
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{exam.shortName} • {exam.description}</p>
        </div>
        
        {/* Marks */}
        <div className="text-center px-4">
          <p className="text-lg font-bold text-gray-900">{exam.maxMarks}</p>
          <p className="text-xs text-gray-500">Max Marks</p>
        </div>
        
        {/* Weightage */}
        <div className="text-center px-4">
          <p className="text-lg font-bold text-indigo-600">{exam.weightage}%</p>
          <p className="text-xs text-gray-500">Weightage</p>
        </div>
        
        {/* Passing */}
        <div className="text-center px-4">
          <p className="text-lg font-bold text-amber-600">{exam.passingMarks}</p>
          <p className="text-xs text-gray-500">Pass Marks</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" disabled={isLocked}>
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600" onClick={onDelete} disabled={isLocked}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {isExpanded &&
      <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Exam Name</label>
              <input
              type="text"
              value={exam.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Short Name</label>
              <input
              type="text"
              value={exam.shortName}
              onChange={(e) => onUpdate({ shortName: e.target.value })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
              value={exam.category}
              onChange={(e) => onUpdate({ category: e.target.value as ExamCategory })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100">

                <option value="PERIODIC">Periodic Test</option>
                <option value="TERMINAL">Terminal Exam</option>
                <option value="ANNUAL">Annual Exam</option>
                <option value="PRACTICAL">Practical</option>
                <option value="PROJECT">Project Work</option>
                <option value="INTERNAL">Internal Assessment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Conducted By</label>
              <select
              value={exam.conductedBy}
              onChange={(e) => onUpdate({ conductedBy: e.target.value as 'school' | 'board' })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100">

                <option value="school">School</option>
                <option value="board">Board (CBSE)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Maximum Marks</label>
              <input
              type="number"
              value={exam.maxMarks}
              onChange={(e) => onUpdate({ maxMarks: Number(e.target.value) })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weightage (%)</label>
              <input
              type="number"
              value={exam.weightage}
              onChange={(e) => onUpdate({ weightage: Number(e.target.value) })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />

            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Passing Marks</label>
              <input
              type="number"
              value={exam.passingMarks}
              onChange={(e) => onUpdate({ passingMarks: Number(e.target.value) })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100" />

            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={exam.isInternal}
                onChange={(e) => onUpdate({ isInternal: e.target.checked })}
                disabled={isLocked}
                className="rounded border-gray-300" />

                <span className="text-sm text-gray-600">Internal</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={exam.isPractical}
                onChange={(e) => onUpdate({ isPractical: e.target.checked })}
                disabled={isLocked}
                className="rounded border-gray-300" />

                <span className="text-sm text-gray-600">Practical</span>
              </label>
            </div>
          </div>
        </div>
      }
    </div>);

};

// ============ TERM EDITOR ============

const TermEditor: React.FC<{
  term: Term;
  onUpdate: (updates: Partial<Term>) => void;
  onUpdateExam: (examId: string, updates: Partial<ExamType>) => void;
  onDeleteExam: (examId: string) => void;
  onAddExam: () => void;
  isLocked: boolean;
}> = ({ term, onUpdate, onUpdateExam, onDeleteExam, onAddExam, isLocked }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeExams = term.examTypes.filter((e) => e.isActive);
  const totalWeightage = activeExams.reduce((sum, e) => sum + e.weightage, 0);
  const totalMaxMarks = activeExams.reduce((sum, e) => sum + e.maxMarks, 0);

  return (
    <Card className="overflow-hidden">
      {/* Term Header */}
      <div className={`p-4 ${term.isActive ? 'bg-gradient-to-r from-indigo-50 to-white' : 'bg-gray-50'} border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/50 rounded-lg">

              {isExpanded ?
              <ChevronDown className="w-5 h-5 text-gray-500" /> :

              <ChevronRight className="w-5 h-5 text-gray-500" />
              }
            </button>
            
            <Toggle
              value={term.isActive}
              onChange={(v) => onUpdate({ isActive: v })}
              disabled={isLocked} />

            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{term.name}</h3>
                <Badge variant={term.isActive ? 'success' : 'default'}>
                  {term.shortName}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                {months[term.startMonth - 1]} - {months[term.endMonth - 1]} • 
                {activeExams.length} exams active
              </p>
            </div>
          </div>
          
          {/* Term Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-indigo-600">{term.weightage}%</p>
              <p className="text-xs text-gray-500">Term Weightage</p>
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${totalWeightage === term.weightage ? 'text-green-600' : 'text-amber-600'}`}>
                {totalWeightage}%
              </p>
              <p className="text-xs text-gray-500">Exam Weightage</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-700">{totalMaxMarks}</p>
              <p className="text-xs text-gray-500">Total Marks</p>
            </div>
            
            {!isLocked &&
            <Button variant="outline" size="sm" onClick={onAddExam}>
                <Plus className="w-4 h-4 mr-1" />
                Add Exam
              </Button>
            }
          </div>
        </div>
        
        {/* Weightage Validation */}
        {totalWeightage !== term.weightage &&
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              Exam weightages ({totalWeightage}%) don't match term weightage ({term.weightage}%)
            </span>
          </div>
        }
      </div>
      
      {/* Exam Types */}
      {isExpanded &&
      <div className="p-4 space-y-3">
          {term.examTypes.
        sort((a, b) => a.sequence - b.sequence).
        map((exam) =>
        <ExamTypeEditor
          key={exam.id}
          exam={exam}
          onUpdate={(updates) => onUpdateExam(exam.id, updates)}
          onDelete={() => onDeleteExam(exam.id)}
          isLocked={isLocked} />

        )}
          
          {term.examTypes.length === 0 &&
        <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No exams configured for this term</p>
              {!isLocked &&
          <Button variant="outline" size="sm" className="mt-3" onClick={onAddExam}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Exam
                </Button>
          }
            </div>
        }
        </div>
      }
    </Card>);

};

// ============ CLASS CONFIGURATION CARD ============

const ClassConfigCard: React.FC<{
  config: ClassExamConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ config, isSelected, onSelect }) => {
  const levelConfig = getClassLevelConfig(config.classLevel);
  const LevelIcon = levelConfig.icon;

  const totalActiveExams = config.terms.reduce(
    (sum, t) => sum + t.examTypes.filter((e) => e.isActive).length, 0
  );

  const totalWeightage = config.terms.
  filter((t) => t.isActive).
  reduce((sum, t) => sum + t.weightage, 0);

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
      isSelected ?
      'border-indigo-500 bg-indigo-50 shadow-md' :
      'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`
      }>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${levelConfig.bg}`}>
            <LevelIcon className={`w-5 h-5 ${levelConfig.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Class {config.standard}</h3>
            <p className="text-xs text-gray-500">{levelConfig.label}</p>
          </div>
        </div>
        
        <Badge variant={
        config.status === 'active' ? 'success' :
        config.status === 'locked' ? 'default' : 'warning'
        }>
          {config.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
          {config.status === 'locked' && <Lock className="w-3 h-3 mr-1" />}
          {config.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-white rounded-lg">
          <p className="text-lg font-bold text-gray-900">{config.terms.filter((t) => t.isActive).length}</p>
          <p className="text-[10px] text-gray-500 uppercase">Terms</p>
        </div>
        <div className="p-2 bg-white rounded-lg">
          <p className="text-lg font-bold text-gray-900">{totalActiveExams}</p>
          <p className="text-[10px] text-gray-500 uppercase">Exams</p>
        </div>
        <div className="p-2 bg-white rounded-lg">
          <p className={`text-lg font-bold ${totalWeightage === 100 ? 'text-green-600' : 'text-amber-600'}`}>
            {totalWeightage}%
          </p>
          <p className="text-[10px] text-gray-500 uppercase">Weight</p>
        </div>
      </div>
    </div>);

};

// ============ MAIN COMPONENT ============

export function CBSEExamStructureSetup() {
  const [configurations, setConfigurations] = useState<ClassExamConfig[]>(generateInitialConfigs());
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [filterLevel, setFilterLevel] = useState<ClassLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Get selected configuration
  const selectedConfig = useMemo(() =>
  configurations.find((c) => c.standard === selectedClass),
  [configurations, selectedClass]
  );

  // Filtered configurations
  const filteredConfigs = useMemo(() => {
    return configurations.filter((config) => {
      const matchesLevel = filterLevel === 'all' || config.classLevel === filterLevel;
      const matchesSearch = searchQuery === '' ||
      `Class ${config.standard}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [configurations, filterLevel, searchQuery]);

  // Group configurations by level
  const groupedConfigs = useMemo(() => {
    const groups: Record<ClassLevel, ClassExamConfig[]> = {
      PRIMARY: [],
      UPPER_PRIMARY: [],
      SECONDARY: [],
      SENIOR_SECONDARY: []
    };
    filteredConfigs.forEach((config) => {
      groups[config.classLevel].push(config);
    });
    return groups;
  }, [filteredConfigs]);

  // Handlers
  const handleUpdateTerm = (termId: string, updates: Partial<Term>) => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        terms: config.terms.map((term) =>
        term.id === termId ? { ...term, ...updates } : term
        ),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleUpdateExam = (termId: string, examId: string, updates: Partial<ExamType>) => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        terms: config.terms.map((term) => {
          if (term.id !== termId) return term;
          return {
            ...term,
            examTypes: term.examTypes.map((exam) =>
            exam.id === examId ? { ...exam, ...updates } : exam
            )
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleDeleteExam = (termId: string, examId: string) => {
    if (!confirm('Delete this exam type?')) return;

    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        terms: config.terms.map((term) => {
          if (term.id !== termId) return term;
          return {
            ...term,
            examTypes: term.examTypes.filter((exam) => exam.id !== examId)
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleAddExam = (termId: string) => {
    const newExam: ExamType = {
      id: `exam-${Date.now()}`,
      name: 'New Exam',
      shortName: 'NEW',
      category: 'PERIODIC',
      maxMarks: 20,
      weightage: 5,
      passingMarks: 7,
      isInternal: true,
      isPractical: false,
      sequence: 99,
      isActive: true,
      conductedBy: 'school',
      description: 'New exam type'
    };

    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        terms: config.terms.map((term) => {
          if (term.id !== termId) return term;
          return {
            ...term,
            examTypes: [...term.examTypes, newExam]
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleCopyToClasses = (targetClasses: number[]) => {
    if (!selectedConfig) return;

    setConfigurations((prev) => prev.map((config) => {
      if (!targetClasses.includes(config.standard)) return config;
      return {
        ...config,
        terms: JSON.parse(JSON.stringify(selectedConfig.terms)),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
    setShowCopyModal(false);
  };

  const handleSave = () => {
    // Validation
    let hasErrors = false;
    configurations.forEach((config) => {
      const totalTermWeightage = config.terms.
      filter((t) => t.isActive).
      reduce((sum, t) => sum + t.weightage, 0);

      if (totalTermWeightage !== 100) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      alert('Please fix validation errors before saving');
      return;
    }

    setIsDirty(false);
    alert('Configuration saved successfully!');
  };

  const handleResetToDefault = () => {
    if (!confirm('Reset this class to default CBSE pattern? This will remove all customizations.')) return;

    const classLevel = getClassLevel(selectedClass);
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        terms: createDefaultTerms(classLevel),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleLockConfig = () => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        status: config.status === 'locked' ? 'active' : 'locked',
        lastModified: new Date().toISOString()
      };
    }));
  };

  const isLocked = selectedConfig?.status === 'locked';

  // Stats
  const stats = useMemo(() => {
    return {
      total: configurations.length,
      active: configurations.filter((c) => c.status === 'active').length,
      draft: configurations.filter((c) => c.status === 'draft').length,
      locked: configurations.filter((c) => c.status === 'locked').length
    };
  }, [configurations]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Exam Structure Setup</h1>
                <p className="text-sm text-gray-500">Configure terms and examinations for all classes</p>
              </div>
              <Badge variant="info" className="ml-2">CBSE Pattern</Badge>
              <Badge variant="default">2024-25</Badge>
              {isDirty &&
              <Badge variant="warning">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              }
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={!isDirty}>
                <Save className="w-4 h-4 mr-2" />
                Save All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Layers className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Classes</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
              <p className="text-sm text-gray-500">Draft</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Lock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.locked}</p>
              <p className="text-sm text-gray-500">Locked</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Class Selection Sidebar */}
          <div className="xl:col-span-1 space-y-4">
            {/* Search & Filter */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search class..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />

                </div>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value as ClassLevel | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                  <option value="all">All Levels</option>
                  <option value="PRIMARY">Primary (1-5)</option>
                  <option value="UPPER_PRIMARY">Upper Primary (6-8)</option>
                  <option value="SECONDARY">Secondary (9-10)</option>
                  <option value="SENIOR_SECONDARY">Sr. Secondary (11-12)</option>
                </select>
              </div>
            </Card>

            {/* Class List */}
            <div className="space-y-4">
              {Object.entries(groupedConfigs).map(([level, configs]) => {
                if (configs.length === 0) return null;
                const levelConfig = getClassLevelConfig(level as ClassLevel);

                return (
                  <div key={level}>
                    <div className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-lg ${levelConfig.bg}`}>
                      <levelConfig.icon className={`w-4 h-4 ${levelConfig.text}`} />
                      <span className={`text-sm font-semibold ${levelConfig.text}`}>
                        {levelConfig.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {configs.map((config) =>
                      <ClassConfigCard
                        key={config.id}
                        config={config}
                        isSelected={config.standard === selectedClass}
                        onSelect={() => setSelectedClass(config.standard)} />

                      )}
                    </div>
                  </div>);

              })}
            </div>
          </div>

          {/* Configuration Editor */}
          <div className="xl:col-span-3 space-y-6">
            {selectedConfig &&
            <>
                {/* Class Header */}
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${getClassLevelConfig(selectedConfig.classLevel).bg}`}>
                        {React.createElement(getClassLevelConfig(selectedConfig.classLevel).icon, {
                        className: `w-6 h-6 ${getClassLevelConfig(selectedConfig.classLevel).text}`
                      })}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Class {selectedConfig.standard}</h2>
                        <p className="text-sm text-gray-500">
                          {getClassLevelConfig(selectedConfig.classLevel).label} • 
                          Last modified: {new Date(selectedConfig.lastModified).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                    selectedConfig.status === 'active' ? 'success' :
                    selectedConfig.status === 'locked' ? 'default' : 'warning'
                    }>
                        {selectedConfig.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setShowCopyModal(true)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Other Classes
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleResetToDefault} disabled={isLocked}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset to Default
                      </Button>
                      <Button
                      variant={isLocked ? 'success' : 'secondary'}
                      size="sm"
                      onClick={handleLockConfig}>

                        {isLocked ?
                      <>
                            <Unlock className="w-4 h-4 mr-2" />
                            Unlock
                          </> :

                      <>
                            <Lock className="w-4 h-4 mr-2" />
                            Lock
                          </>
                      }
                      </Button>
                    </div>
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">
                        {selectedConfig.terms.filter((t) => t.isActive).length}
                      </p>
                      <p className="text-xs text-gray-500">Active Terms</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedConfig.terms.reduce((sum, t) => sum + t.examTypes.filter((e) => e.isActive).length, 0)}
                      </p>
                      <p className="text-xs text-gray-500">Total Exams</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${
                    selectedConfig.terms.filter((t) => t.isActive).reduce((sum, t) => sum + t.weightage, 0) === 100 ?
                    'text-green-600' :
                    'text-amber-600'}`
                    }>
                        {selectedConfig.terms.filter((t) => t.isActive).reduce((sum, t) => sum + t.weightage, 0)}%
                      </p>
                      <p className="text-xs text-gray-500">Total Weightage</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-700">
                        {selectedConfig.totalMarks}
                      </p>
                      <p className="text-xs text-gray-500">Total Marks</p>
                    </div>
                  </div>
                </Card>

                {/* Locked Warning */}
                {isLocked &&
              <Card className="p-4 bg-amber-50 border-amber-200">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-800">Configuration Locked</p>
                        <p className="text-sm text-amber-700">
                          This configuration is locked and cannot be edited. Unlock to make changes.
                        </p>
                      </div>
                    </div>
                  </Card>
              }

                {/* Terms */}
                <div className="space-y-6">
                  {selectedConfig.terms.map((term) =>
                <TermEditor
                  key={term.id}
                  term={term}
                  onUpdate={(updates) => handleUpdateTerm(term.id, updates)}
                  onUpdateExam={(examId, updates) => handleUpdateExam(term.id, examId, updates)}
                  onDeleteExam={(examId) => handleDeleteExam(term.id, examId)}
                  onAddExam={() => handleAddExam(term.id)}
                  isLocked={isLocked} />

                )}
                </div>

                {/* CBSE Guidelines */}
                <Card className="p-6 bg-indigo-50 border-indigo-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Info className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-indigo-900">CBSE Assessment Guidelines</h3>
                      <div className="mt-2 space-y-2 text-sm text-indigo-700">
                        <p>• <strong>Term System:</strong> Academic year divided into Term 1 (April-September) and Term 2 (October-March)</p>
                        <p>• <strong>Internal Assessment:</strong> 20 marks (Periodic Tests: 10, Multiple Assessment: 5, Portfolio: 5)</p>
                        <p>• <strong>Board Examination:</strong> 80 marks for Classes 9-12</p>
                        <p>• <strong>Passing Marks:</strong> 33% in each subject</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            }
          </div>
        </div>
      </div>

      {/* Copy to Classes Modal */}
      {showCopyModal && selectedConfig &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Copy Configuration</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCopyModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Copy exam structure from <strong>Class {selectedConfig.standard}</strong> to other classes:
            </p>
            
            <CopyToClassesSelector
            currentClass={selectedConfig.standard}
            configurations={configurations}
            onCopy={handleCopyToClasses}
            onCancel={() => setShowCopyModal(false)} />

          </Card>
        </div>
      }
    </div>);

}

// ============ COPY TO CLASSES SELECTOR ============

const CopyToClassesSelector: React.FC<{
  currentClass: number;
  configurations: ClassExamConfig[];
  onCopy: (targetClasses: number[]) => void;
  onCancel: () => void;
}> = ({ currentClass, configurations, onCopy, onCancel }) => {
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  const toggleClass = (standard: number) => {
    setSelectedClasses((prev) =>
    prev.includes(standard) ?
    prev.filter((s) => s !== standard) :
    [...prev, standard]
    );
  };

  const selectSameLevel = () => {
    const currentLevel = getClassLevel(currentClass);
    const sameLevel = configurations.
    filter((c) => c.classLevel === currentLevel && c.standard !== currentClass).
    map((c) => c.standard);
    setSelectedClasses(sameLevel);
  };

  const selectAll = () => {
    setSelectedClasses(
      configurations.
      filter((c) => c.standard !== currentClass).
      map((c) => c.standard)
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={selectSameLevel}>
          Same Level
        </Button>
        <Button variant="outline" size="sm" onClick={selectAll}>
          Select All
        </Button>
        <Button variant="outline" size="sm" onClick={() => setSelectedClasses([])}>
          Clear
        </Button>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {configurations.
        filter((c) => c.standard !== currentClass).
        map((config) =>
        <button
          key={config.id}
          onClick={() => toggleClass(config.standard)}
          className={`p-3 rounded-lg border-2 text-center transition-all ${
          selectedClasses.includes(config.standard) ?
          'border-indigo-500 bg-indigo-50' :
          'border-gray-200 hover:border-gray-300'}`
          }>

              <p className="font-bold text-gray-900">Class {config.standard}</p>
              <p className="text-xs text-gray-500">{getClassLevelConfig(config.classLevel).label}</p>
            </button>
        )}
      </div>
      
      {selectedClasses.length > 0 &&
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              This will overwrite existing configurations for {selectedClasses.length} class(es)
            </span>
          </div>
        </div>
      }
      
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => onCopy(selectedClasses)}
          disabled={selectedClasses.length === 0}>

          <Copy className="w-4 h-4 mr-2" />
          Copy to {selectedClasses.length} Class(es)
        </Button>
      </div>
    </div>);

};

export default CBSEExamStructureSetup;