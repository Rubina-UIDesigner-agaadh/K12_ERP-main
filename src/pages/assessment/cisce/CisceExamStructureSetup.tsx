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
  RotateCcw,
  Shield,
  Award,
  Briefcase,
  UserCheck,
  Scale,
  Beaker,
  PenTool } from
'lucide-react';

// ============ TYPE DEFINITIONS ============

type ClassLevel = 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY';
type ExamCategory = 'UNIT_TEST' | 'TERMINAL' | 'BOARD' | 'PRACTICAL' | 'PROJECT' | 'INTERNAL' | 'VIVA' | 'ASSIGNMENT';
type ConfigStatus = 'draft' | 'active' | 'locked';
type BoardType = 'ICSE' | 'ISC';
type Stream = 'Science' | 'Commerce' | 'Humanities' | 'Not Applicable';

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
  conductedBy: 'school' | 'board' | 'external';
  requiresExternalExaminer: boolean;
  description?: string;
}

interface AssessmentPhase {
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
  boardType: BoardType;
  stream: Stream;
  academicYear: string;
  phases: AssessmentPhase[];
  totalMarks: number;
  passingPercentage: number;
  status: ConfigStatus;
  isDefault: boolean;
  lastModified: string;
  modifiedBy: string;
  supwEnabled: boolean;
  supwMarks: number;
  graceMarksEnabled: boolean;
  graceMaxMarks: number;
}

// ============ UTILITY FUNCTIONS ============

const getClassLevel = (standard: number): ClassLevel => {
  if (standard >= 1 && standard <= 5) return 'PRIMARY';
  if (standard >= 6 && standard <= 8) return 'MIDDLE';
  if (standard >= 9 && standard <= 10) return 'SECONDARY';
  return 'SENIOR_SECONDARY';
};

const getBoardType = (standard: number): BoardType => {
  if (standard <= 10) return 'ICSE';
  return 'ISC';
};

const getClassLevelConfig = (level: ClassLevel) => {
  const configs = {
    PRIMARY: { label: 'Primary', range: '1-5', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: BookOpen },
    MIDDLE: { label: 'Middle School', range: '6-8', bg: 'bg-blue-100', text: 'text-blue-700', icon: School },
    SECONDARY: { label: 'Secondary (ICSE)', range: '9-10', bg: 'bg-purple-100', text: 'text-purple-700', icon: GraduationCap },
    SENIOR_SECONDARY: { label: 'Sr. Secondary (ISC)', range: '11-12', bg: 'bg-rose-100', text: 'text-rose-700', icon: Building2 }
  };
  return configs[level];
};

const getExamCategoryConfig = (category: ExamCategory) => {
  const configs = {
    UNIT_TEST: { label: 'Unit Test', bg: 'bg-blue-100', text: 'text-blue-700', color: 'blue' },
    TERMINAL: { label: 'Terminal Exam', bg: 'bg-purple-100', text: 'text-purple-700', color: 'purple' },
    BOARD: { label: 'Board Exam', bg: 'bg-rose-100', text: 'text-rose-700', color: 'rose' },
    PRACTICAL: { label: 'Practical', bg: 'bg-green-100', text: 'text-green-700', color: 'green' },
    PROJECT: { label: 'Project Work', bg: 'bg-amber-100', text: 'text-amber-700', color: 'amber' },
    INTERNAL: { label: 'Internal Assessment', bg: 'bg-cyan-100', text: 'text-cyan-700', color: 'cyan' },
    VIVA: { label: 'Viva Voce', bg: 'bg-indigo-100', text: 'text-indigo-700', color: 'indigo' },
    ASSIGNMENT: { label: 'Assignment', bg: 'bg-teal-100', text: 'text-teal-700', color: 'teal' }
  };
  return configs[category];
};

const months = [
'January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];


// ============ DEFAULT DATA ============

const createDefaultPhases = (classLevel: ClassLevel, standard: number): AssessmentPhase[] => {
  // ICSE/ISC Assessment Structure
  const isBoardClass = standard === 10 || standard === 12;

  // Internal Assessment Phase
  const internalAssessmentExams: ExamType[] = [
  {
    id: 'ut1',
    name: 'Unit Test 1',
    shortName: 'UT-1',
    category: 'UNIT_TEST',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 1,
    isActive: true,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'First unit assessment'
  },
  {
    id: 'ut2',
    name: 'Unit Test 2',
    shortName: 'UT-2',
    category: 'UNIT_TEST',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: false,
    sequence: 2,
    isActive: true,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Second unit assessment'
  },
  {
    id: 'proj1',
    name: 'Project Work',
    shortName: 'PROJ',
    category: 'PROJECT',
    maxMarks: 10,
    weightage: 5,
    passingMarks: 3,
    isInternal: true,
    isPractical: false,
    sequence: 3,
    isActive: true,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Subject project assessment'
  },
  {
    id: 'assign',
    name: 'Assignments & Classwork',
    shortName: 'ASGN',
    category: 'ASSIGNMENT',
    maxMarks: 10,
    weightage: 5,
    passingMarks: 3,
    isInternal: true,
    isPractical: false,
    sequence: 4,
    isActive: true,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Regular assignments and classwork'
  }];


  // Half Yearly / Terminal Phase
  const terminalExams: ExamType[] = [
  {
    id: 'hy',
    name: 'Half Yearly Examination',
    shortName: 'HY',
    category: 'TERMINAL',
    maxMarks: 80,
    weightage: 20,
    passingMarks: 26,
    isInternal: false,
    isPractical: false,
    sequence: 1,
    isActive: !isBoardClass,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Mid-year terminal examination'
  },
  {
    id: 'prac_hy',
    name: 'Practical Examination (HY)',
    shortName: 'PR-HY',
    category: 'PRACTICAL',
    maxMarks: 20,
    weightage: 5,
    passingMarks: 7,
    isInternal: true,
    isPractical: true,
    sequence: 2,
    isActive: classLevel !== 'PRIMARY',
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Half-yearly practical assessment'
  }];


  // Board / Annual Examination Phase
  const boardExams: ExamType[] = [
  {
    id: 'prelim',
    name: 'Preliminary Examination',
    shortName: 'PRELIM',
    category: 'TERMINAL',
    maxMarks: 80,
    weightage: isBoardClass ? 0 : 20,
    passingMarks: 26,
    isInternal: false,
    isPractical: false,
    sequence: 1,
    isActive: isBoardClass,
    conductedBy: 'school',
    requiresExternalExaminer: false,
    description: 'Pre-board examination'
  },
  {
    id: 'board_theory',
    name: isBoardClass ? 'Board Theory Examination' : 'Annual Theory Examination',
    shortName: isBoardClass ? 'BOARD' : 'ANNUAL',
    category: isBoardClass ? 'BOARD' : 'TERMINAL',
    maxMarks: 80,
    weightage: 40,
    passingMarks: 26,
    isInternal: false,
    isPractical: false,
    sequence: 2,
    isActive: true,
    conductedBy: isBoardClass ? 'board' : 'school',
    requiresExternalExaminer: isBoardClass,
    description: isBoardClass ? 'CISCE Board theory examination' : 'Annual theory examination'
  },
  {
    id: 'board_practical',
    name: isBoardClass ? 'Board Practical Examination' : 'Annual Practical Examination',
    shortName: isBoardClass ? 'PRAC-B' : 'PRAC-A',
    category: 'PRACTICAL',
    maxMarks: 20,
    weightage: 10,
    passingMarks: 7,
    isInternal: false,
    isPractical: true,
    sequence: 3,
    isActive: classLevel !== 'PRIMARY',
    conductedBy: isBoardClass ? 'external' : 'school',
    requiresExternalExaminer: isBoardClass,
    description: isBoardClass ? 'CISCE Board practical examination' : 'Annual practical examination'
  },
  {
    id: 'viva',
    name: 'Viva Voce',
    shortName: 'VIVA',
    category: 'VIVA',
    maxMarks: 10,
    weightage: 5,
    passingMarks: 3,
    isInternal: false,
    isPractical: false,
    sequence: 4,
    isActive: isBoardClass && classLevel !== 'PRIMARY',
    conductedBy: isBoardClass ? 'external' : 'school',
    requiresExternalExaminer: isBoardClass,
    description: 'Oral examination'
  }];


  return [
  {
    id: 'internal',
    name: 'Internal Assessment (April - August)',
    shortName: 'IA',
    weightage: 20,
    startMonth: 4, // April
    endMonth: 8, // August
    isActive: true,
    examTypes: internalAssessmentExams
  },
  {
    id: 'terminal',
    name: 'Terminal Assessment (September - November)',
    shortName: 'TA',
    weightage: 25,
    startMonth: 9, // September
    endMonth: 11, // November
    isActive: true,
    examTypes: terminalExams
  },
  {
    id: 'final',
    name: isBoardClass ? 'Board Examination (December - March)' : 'Annual Examination (December - March)',
    shortName: isBoardClass ? 'BOARD' : 'AE',
    weightage: 55,
    startMonth: 12, // December
    endMonth: 3, // March
    isActive: true,
    examTypes: boardExams
  }];

};

const generateInitialConfigs = (): ClassExamConfig[] => {
  const configs: ClassExamConfig[] = [];

  for (let std = 1; std <= 12; std++) {
    const classLevel = getClassLevel(std);
    const boardType = getBoardType(std);

    configs.push({
      id: `config-${std}`,
      standard: std,
      classLevel,
      boardType,
      stream: std >= 11 ? 'Science' : 'Not Applicable',
      academicYear: '2024-25',
      phases: createDefaultPhases(classLevel, std),
      totalMarks: 100,
      passingPercentage: 33,
      status: std <= 8 ? 'active' : 'draft',
      isDefault: true,
      lastModified: new Date().toISOString(),
      modifiedBy: 'Admin',
      supwEnabled: std >= 6 && std <= 10,
      supwMarks: 100,
      graceMarksEnabled: true,
      graceMaxMarks: 5
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
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
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
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'rose';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    rose: 'bg-rose-100 text-rose-700'
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
  className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

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
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900">{exam.name}</h4>
            <Badge className={`${categoryConfig.bg} ${categoryConfig.text}`}>
              {categoryConfig.label}
            </Badge>
            {exam.isInternal &&
            <Badge variant="info">Internal</Badge>
            }
            {exam.isPractical &&
            <Badge variant="success">Practical</Badge>
            }
            {exam.conductedBy === 'board' &&
            <Badge variant="rose">CISCE Board</Badge>
            }
            {exam.requiresExternalExaminer &&
            <Badge variant="purple">Ext. Examiner</Badge>
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
          <p className="text-lg font-bold text-blue-600">{exam.weightage}%</p>
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

                <option value="UNIT_TEST">Unit Test</option>
                <option value="TERMINAL">Terminal Exam</option>
                <option value="BOARD">Board Exam</option>
                <option value="PRACTICAL">Practical</option>
                <option value="PROJECT">Project Work</option>
                <option value="INTERNAL">Internal Assessment</option>
                <option value="VIVA">Viva Voce</option>
                <option value="ASSIGNMENT">Assignment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Conducted By</label>
              <select
              value={exam.conductedBy}
              onChange={(e) => onUpdate({ conductedBy: e.target.value as 'school' | 'board' | 'external' })}
              disabled={isLocked}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100">

                <option value="school">School</option>
                <option value="board">Board (CISCE)</option>
                <option value="external">External Examiner</option>
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
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={exam.requiresExternalExaminer}
                onChange={(e) => onUpdate({ requiresExternalExaminer: e.target.checked })}
                disabled={isLocked}
                className="rounded border-gray-300" />

                <span className="text-sm text-gray-600">Ext. Examiner</span>
              </label>
            </div>
          </div>
        </div>
      }
    </div>);

};

// ============ PHASE EDITOR (equivalent to Term Editor) ============

const PhaseEditor: React.FC<{
  phase: AssessmentPhase;
  onUpdate: (updates: Partial<AssessmentPhase>) => void;
  onUpdateExam: (examId: string, updates: Partial<ExamType>) => void;
  onDeleteExam: (examId: string) => void;
  onAddExam: () => void;
  isLocked: boolean;
  isBoardPhase: boolean;
}> = ({ phase, onUpdate, onUpdateExam, onDeleteExam, onAddExam, isLocked, isBoardPhase }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeExams = phase.examTypes.filter((e) => e.isActive);
  const totalWeightage = activeExams.reduce((sum, e) => sum + e.weightage, 0);
  const totalMaxMarks = activeExams.reduce((sum, e) => sum + e.maxMarks, 0);
  const practicalExams = activeExams.filter((e) => e.isPractical);
  const boardExams = activeExams.filter((e) => e.conductedBy === 'board' || e.conductedBy === 'external');

  return (
    <Card className="overflow-hidden">
      {/* Phase Header */}
      <div className={`p-4 ${phase.isActive ? 'bg-gradient-to-r from-blue-50 to-white' : 'bg-gray-50'} border-b`}>
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
              value={phase.isActive}
              onChange={(v) => onUpdate({ isActive: v })}
              disabled={isLocked} />

            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">{phase.name}</h3>
                <Badge variant={phase.isActive ? 'success' : 'default'}>
                  {phase.shortName}
                </Badge>
                {isBoardPhase &&
                <Badge variant="rose">
                    <Shield className="w-3 h-3 mr-1" />
                    CISCE
                  </Badge>
                }
              </div>
              <p className="text-sm text-gray-500">
                {months[phase.startMonth - 1]} - {months[phase.endMonth - 1]} • 
                {activeExams.length} exams active
                {practicalExams.length > 0 && ` • ${practicalExams.length} practicals`}
                {boardExams.length > 0 && ` • ${boardExams.length} board exams`}
              </p>
            </div>
          </div>
          
          {/* Phase Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">{phase.weightage}%</p>
              <p className="text-xs text-gray-500">Phase Weightage</p>
            </div>
            <div className="text-center">
              <p className={`text-xl font-bold ${totalWeightage === phase.weightage ? 'text-green-600' : 'text-amber-600'}`}>
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
        {totalWeightage !== phase.weightage &&
        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              Exam weightages ({totalWeightage}%) don't match phase weightage ({phase.weightage}%)
            </span>
          </div>
        }
      </div>
      
      {/* Exam Types */}
      {isExpanded &&
      <div className="p-4 space-y-3">
          {phase.examTypes.
        sort((a, b) => a.sequence - b.sequence).
        map((exam) =>
        <ExamTypeEditor
          key={exam.id}
          exam={exam}
          onUpdate={(updates) => onUpdateExam(exam.id, updates)}
          onDelete={() => onDeleteExam(exam.id)}
          isLocked={isLocked} />

        )}
          
          {phase.examTypes.length === 0 &&
        <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No exams configured for this phase</p>
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

  const totalActiveExams = config.phases.reduce(
    (sum, p) => sum + p.examTypes.filter((e) => e.isActive).length, 0
  );

  const totalWeightage = config.phases.
  filter((p) => p.isActive).
  reduce((sum, p) => sum + p.weightage, 0);

  const isBoardClass = config.standard === 10 || config.standard === 12;

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
      isSelected ?
      'border-blue-500 bg-blue-50 shadow-md' :
      'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`
      }>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${levelConfig.bg}`}>
            <LevelIcon className={`w-5 h-5 ${levelConfig.text}`} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Class {config.standard}</h3>
            <p className="text-xs text-gray-500">{config.boardType}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <Badge variant={
          config.status === 'active' ? 'success' :
          config.status === 'locked' ? 'default' : 'warning'
          }>
            {config.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {config.status === 'locked' && <Lock className="w-3 h-3 mr-1" />}
            {config.status}
          </Badge>
          {isBoardClass &&
          <Badge variant="rose" className="text-[10px]">Board Year</Badge>
          }
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-white rounded-lg">
          <p className="text-lg font-bold text-gray-900">{config.phases.filter((p) => p.isActive).length}</p>
          <p className="text-[10px] text-gray-500 uppercase">Phases</p>
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

      {/* Stream indicator for ISC */}
      {config.standard >= 11 &&
      <div className="mt-2 pt-2 border-t">
          <Badge variant="info" className="text-xs w-full justify-center">
            {config.stream}
          </Badge>
        </div>
      }
    </div>);

};

// ============ SPECIAL SETTINGS PANEL ============

const SpecialSettingsPanel: React.FC<{
  config: ClassExamConfig;
  onUpdate: (updates: Partial<ClassExamConfig>) => void;
  isLocked: boolean;
}> = ({ config, onUpdate, isLocked }) => {
  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-blue-600" />
        CISCE Special Settings
      </h3>
      <div className="space-y-4">
        
        {/* SUPW Toggle */}
        {config.standard >= 6 && config.standard <= 10 &&
        <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-green-900">SUPW Included</span>
              </div>
              <Toggle
              value={config.supwEnabled}
              onChange={(v) => onUpdate({ supwEnabled: v })}
              disabled={isLocked} />

            </div>
            <p className="text-[10px] text-green-700">
              Socially Useful Productive Work (Mandatory for ICSE)
            </p>
            {config.supwEnabled &&
          <div className="mt-3">
                <label className="text-xs text-green-800">SUPW Marks</label>
                <input
              type="number"
              value={config.supwMarks}
              onChange={(e) => onUpdate({ supwMarks: parseInt(e.target.value) || 0 })}
              disabled={isLocked}
              className="w-full mt-1 border border-green-200 rounded px-2 py-1 text-sm" />

              </div>
          }
          </div>
        }

        {/* Stream Selector for ISC */}
        {config.standard >= 11 &&
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">Stream Selection</span>
            </div>
            <select
            value={config.stream}
            onChange={(e) => onUpdate({ stream: e.target.value as Stream })}
            disabled={isLocked}
            className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100">

              <option value="Science">Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>
        }

        {/* Grace Marks Toggle */}
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-purple-900">Grace Marks</span>
            </div>
            <Toggle
              value={config.graceMarksEnabled}
              onChange={(v) => onUpdate({ graceMarksEnabled: v })}
              disabled={isLocked} />

          </div>
          {config.graceMarksEnabled &&
          <div className="mt-3">
              <label className="text-xs text-purple-800">Max Grace Marks</label>
              <input
              type="number"
              value={config.graceMaxMarks}
              onChange={(e) => onUpdate({ graceMaxMarks: parseInt(e.target.value) || 0 })}
              disabled={isLocked}
              className="w-full mt-1 border border-purple-200 rounded px-2 py-1 text-sm" />

            </div>
          }
        </div>

        {/* Passing Percentage */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-900">Passing Criteria</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={config.passingPercentage}
              onChange={(e) => onUpdate({ passingPercentage: parseInt(e.target.value) || 0 })}
              disabled={isLocked}
              min="0"
              max="100"
              className="w-20 border border-amber-200 rounded px-2 py-1 text-sm text-center" />

            <span className="text-sm text-amber-700">% in each subject</span>
          </div>
        </div>
      </div>
    </Card>);

};

// ============ CONFIGURATION SUMMARY ============

const ConfigSummary: React.FC<{config: ClassExamConfig;}> = ({ config }) => {
  const totalExams = config.phases.reduce((sum, p) => sum + p.examTypes.filter((e) => e.isActive).length, 0);
  const practicalExams = config.phases.reduce(
    (sum, p) => sum + p.examTypes.filter((e) => e.isActive && e.isPractical).length, 0
  );
  const boardExams = config.phases.reduce(
    (sum, p) => sum + p.examTypes.filter((e) => e.isActive && (e.conductedBy === 'board' || e.conductedBy === 'external')).length, 0
  );

  return (
    <Card className="p-6">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-4 h-4 text-blue-600" />
        Configuration Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Board</span>
          <Badge variant={config.boardType === 'ISC' ? 'rose' : 'info'}>{config.boardType}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Academic Year</span>
          <Badge variant="default">{config.academicYear}</Badge>
        </div>
        {config.standard >= 11 &&
        <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Stream</span>
            <Badge variant="purple">{config.stream}</Badge>
          </div>
        }
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Total Phases</span>
          <span className="text-sm font-bold text-gray-900">{config.phases.filter((p) => p.isActive).length}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Total Exams</span>
          <span className="text-sm font-bold text-gray-900">{totalExams}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Practicals</span>
          <span className="text-sm font-bold text-green-700">{practicalExams}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Board/External</span>
          <span className="text-sm font-bold text-rose-700">{boardExams}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">SUPW</span>
          <span className={`text-sm font-bold ${config.supwEnabled ? 'text-green-700' : 'text-gray-400'}`}>
            {config.supwEnabled ? 'Enabled' : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Passing %</span>
          <span className="text-sm font-bold text-amber-700">{config.passingPercentage}%</span>
        </div>
      </div>
    </Card>);

};

// ============ MAIN COMPONENT ============

export function CISCEExamStructureSetup() {
  const [configurations, setConfigurations] = useState<ClassExamConfig[]>(generateInitialConfigs());
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [filterLevel, setFilterLevel] = useState<ClassLevel | 'all'>('all');
  const [filterBoard, setFilterBoard] = useState<BoardType | 'all'>('all');
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
      const matchesBoard = filterBoard === 'all' || config.boardType === filterBoard;
      const matchesSearch = searchQuery === '' ||
      `Class ${config.standard}`.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLevel && matchesBoard && matchesSearch;
    });
  }, [configurations, filterLevel, filterBoard, searchQuery]);

  // Group configurations by level
  const groupedConfigs = useMemo(() => {
    const groups: Record<ClassLevel, ClassExamConfig[]> = {
      PRIMARY: [],
      MIDDLE: [],
      SECONDARY: [],
      SENIOR_SECONDARY: []
    };
    filteredConfigs.forEach((config) => {
      groups[config.classLevel].push(config);
    });
    return groups;
  }, [filteredConfigs]);

  // Validation
  const validation = useMemo(() => {
    if (!selectedConfig) return { isValid: true, errors: [], warnings: [] };

    const errors: string[] = [];
    const warnings: string[] = [];

    // Check total weightage
    const totalWeightage = selectedConfig.phases.
    filter((p) => p.isActive).
    reduce((sum, p) => sum + p.weightage, 0);

    if (totalWeightage !== 100) {
      errors.push(`Total phase weightage must equal 100% (currently ${totalWeightage}%)`);
    }

    // Check each phase
    selectedConfig.phases.forEach((phase) => {
      const examWeightage = phase.examTypes.
      filter((e) => e.isActive).
      reduce((sum, e) => sum + e.weightage, 0);

      if (phase.isActive && examWeightage !== phase.weightage) {
        warnings.push(`${phase.name}: Exam weightages (${examWeightage}%) don't match phase weightage (${phase.weightage}%)`);
      }
    });

    // SUPW check for ICSE
    if (selectedConfig.standard >= 6 && selectedConfig.standard <= 10 && !selectedConfig.supwEnabled) {
      warnings.push('SUPW is typically required for ICSE examinations');
    }

    // Board class specific checks
    if (selectedConfig.standard === 10 || selectedConfig.standard === 12) {
      const boardExams = selectedConfig.phases.flatMap((p) =>
      p.examTypes.filter((e) => e.conductedBy === 'board' || e.conductedBy === 'external')
      );
      if (boardExams.length === 0) {
        warnings.push('Board class should have at least one CISCE board examination');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }, [selectedConfig]);

  // Handlers
  const handleUpdatePhase = (phaseId: string, updates: Partial<AssessmentPhase>) => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        phases: config.phases.map((phase) =>
        phase.id === phaseId ? { ...phase, ...updates } : phase
        ),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleUpdateExam = (phaseId: string, examId: string, updates: Partial<ExamType>) => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        phases: config.phases.map((phase) => {
          if (phase.id !== phaseId) return phase;
          return {
            ...phase,
            examTypes: phase.examTypes.map((exam) =>
            exam.id === examId ? { ...exam, ...updates } : exam
            )
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleDeleteExam = (phaseId: string, examId: string) => {
    if (!confirm('Delete this exam type?')) return;

    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        phases: config.phases.map((phase) => {
          if (phase.id !== phaseId) return phase;
          return {
            ...phase,
            examTypes: phase.examTypes.filter((exam) => exam.id !== examId)
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleAddExam = (phaseId: string) => {
    const newExam: ExamType = {
      id: `exam-${Date.now()}`,
      name: 'New Exam',
      shortName: 'NEW',
      category: 'UNIT_TEST',
      maxMarks: 20,
      weightage: 5,
      passingMarks: 7,
      isInternal: true,
      isPractical: false,
      sequence: 99,
      isActive: true,
      conductedBy: 'school',
      requiresExternalExaminer: false,
      description: 'New exam type'
    };

    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        phases: config.phases.map((phase) => {
          if (phase.id !== phaseId) return phase;
          return {
            ...phase,
            examTypes: [...phase.examTypes, newExam]
          };
        }),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleUpdateConfig = (updates: Partial<ClassExamConfig>) => {
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        ...updates,
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
        phases: JSON.parse(JSON.stringify(selectedConfig.phases)),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
    setShowCopyModal(false);
  };

  const handleSave = () => {
    if (!validation.isValid) {
      alert('Please fix validation errors before saving');
      return;
    }

    setIsDirty(false);
    alert('CISCE Exam Structure saved successfully!');
  };

  const handleResetToDefault = () => {
    if (!confirm('Reset this class to default CISCE pattern? This will remove all customizations.')) return;

    const classLevel = getClassLevel(selectedClass);
    setConfigurations((prev) => prev.map((config) => {
      if (config.standard !== selectedClass) return config;
      return {
        ...config,
        phases: createDefaultPhases(classLevel, selectedClass),
        lastModified: new Date().toISOString()
      };
    }));
    setIsDirty(true);
  };

  const handleLockConfig = () => {
    if (selectedConfig?.status !== 'locked' && !validation.isValid) {
      alert('Cannot lock configuration with validation errors');
      return;
    }

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
  const isBoardClass = selectedConfig && (selectedConfig.standard === 10 || selectedConfig.standard === 12);

  // Stats
  const stats = useMemo(() => {
    return {
      total: configurations.length,
      active: configurations.filter((c) => c.status === 'active').length,
      draft: configurations.filter((c) => c.status === 'draft').length,
      locked: configurations.filter((c) => c.status === 'locked').length,
      icse: configurations.filter((c) => c.boardType === 'ICSE').length,
      isc: configurations.filter((c) => c.boardType === 'ISC').length
    };
  }, [configurations]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CISCE Exam Structure Setup</h1>
                <p className="text-sm text-gray-500">Council for the Indian School Certificate Examinations</p>
              </div>
              <Badge variant="info" className="ml-2">ICSE/ISC Pattern</Badge>
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
        <div className="grid grid-cols-6 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Layers className="w-6 h-6 text-blue-600" />
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
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <School className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.icse}</p>
              <p className="text-sm text-gray-500">ICSE</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="p-3 bg-rose-100 rounded-xl">
              <Building2 className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.isc}</p>
              <p className="text-sm text-gray-500">ISC</p>
            </div>
          </Card>
        </div>

        {/* Validation Alerts */}
        {selectedConfig && (validation.errors.length > 0 || validation.warnings.length > 0) &&
        <Card className={`p-4 mb-6 ${validation.errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {validation.errors.length > 0 ?
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" /> :

            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            }
              <div className="flex-1">
                {validation.errors.length > 0 &&
              <div className="mb-2">
                    <p className="text-sm font-bold text-red-900">Validation Errors:</p>
                    <ul className="mt-1 space-y-1">
                      {validation.errors.map((err, idx) =>
                  <li key={idx} className="text-xs text-red-700">• {err}</li>
                  )}
                    </ul>
                  </div>
              }
                {validation.warnings.length > 0 &&
              <div>
                    <p className="text-sm font-bold text-amber-900">Warnings:</p>
                    <ul className="mt-1 space-y-1">
                      {validation.warnings.map((warn, idx) =>
                  <li key={idx} className="text-xs text-amber-700">• {warn}</li>
                  )}
                    </ul>
                  </div>
              }
              </div>
            </div>
          </Card>
        }

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
                  <option value="MIDDLE">Middle School (6-8)</option>
                  <option value="SECONDARY">Secondary - ICSE (9-10)</option>
                  <option value="SENIOR_SECONDARY">Sr. Secondary - ISC (11-12)</option>
                </select>
                <select
                  value={filterBoard}
                  onChange={(e) => setFilterBoard(e.target.value as BoardType | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                  <option value="all">All Boards</option>
                  <option value="ICSE">ICSE Only</option>
                  <option value="ISC">ISC Only</option>
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
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-gray-900">Class {selectedConfig.standard}</h2>
                          <Badge variant={selectedConfig.boardType === 'ISC' ? 'rose' : 'info'}>
                            {selectedConfig.boardType}
                          </Badge>
                          {selectedConfig.standard >= 11 &&
                        <Badge variant="purple">{selectedConfig.stream}</Badge>
                        }
                        </div>
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
                  <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedConfig.phases.filter((p) => p.isActive).length}
                      </p>
                      <p className="text-xs text-gray-500">Active Phases</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedConfig.phases.reduce((sum, p) => sum + p.examTypes.filter((e) => e.isActive).length, 0)}
                      </p>
                      <p className="text-xs text-gray-500">Total Exams</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${
                    selectedConfig.phases.filter((p) => p.isActive).reduce((sum, p) => sum + p.weightage, 0) === 100 ?
                    'text-green-600' :
                    'text-amber-600'}`
                    }>
                        {selectedConfig.phases.filter((p) => p.isActive).reduce((sum, p) => sum + p.weightage, 0)}%
                      </p>
                      <p className="text-xs text-gray-500">Total Weightage</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-700">
                        {selectedConfig.passingPercentage}%
                      </p>
                      <p className="text-xs text-gray-500">Pass %</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${selectedConfig.supwEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                        {selectedConfig.supwEnabled ? 'Yes' : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">SUPW</p>
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

                {/* Special Settings & Summary Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SpecialSettingsPanel
                    config={selectedConfig}
                    onUpdate={handleUpdateConfig}
                    isLocked={isLocked} />

                  </div>
                  <ConfigSummary config={selectedConfig} />
                </div>

                {/* Assessment Phases */}
                <div className="space-y-6">
                  {selectedConfig.phases.map((phase) =>
                <PhaseEditor
                  key={phase.id}
                  phase={phase}
                  onUpdate={(updates) => handleUpdatePhase(phase.id, updates)}
                  onUpdateExam={(examId, updates) => handleUpdateExam(phase.id, examId, updates)}
                  onDeleteExam={(examId) => handleDeleteExam(phase.id, examId)}
                  onAddExam={() => handleAddExam(phase.id)}
                  isLocked={isLocked}
                  isBoardPhase={phase.id === 'final' && !!isBoardClass} />

                )}
                </div>

                {/* CISCE Guidelines */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Info className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-900">CISCE Assessment Guidelines</h3>
                      <div className="mt-2 space-y-2 text-sm text-blue-700">
                        <p>• <strong>ICSE (Class X):</strong> Internal Assessment (20%) + Board Examination (80%)</p>
                        <p>• <strong>ISC (Class XII):</strong> Internal Assessment varies by subject (15-30%) + Board Examination</p>
                        <p>• <strong>SUPW:</strong> Socially Useful Productive Work - Mandatory for Classes 6-10</p>
                        <p>• <strong>Practical Examinations:</strong> External examiner required for board classes</p>
                        <p>• <strong>Passing Criteria:</strong> Minimum 33% in each subject (Theory + IA combined)</p>
                        <p>• <strong>Project Work:</strong> Subject-specific, assessed internally with external moderation</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* CISCE Compliance Badge */}
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-lg">CISCE Compliant Configuration</p>
                    <p className="text-blue-100 text-sm">
                      This structure follows Council for the Indian School Certificate Examinations guidelines for {selectedConfig.boardType}.
                    </p>
                  </div>
                  <Badge className="bg-white/20 text-white border-0">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verified
                  </Badge>
                </div>
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
              Copy exam structure from <strong>Class {selectedConfig.standard} ({selectedConfig.boardType})</strong> to other classes:
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

  const selectSameBoard = () => {
    const currentBoard = getBoardType(currentClass);
    const sameBoard = configurations.
    filter((c) => c.boardType === currentBoard && c.standard !== currentClass).
    map((c) => c.standard);
    setSelectedClasses(sameBoard);
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
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Button variant="outline" size="sm" onClick={selectSameLevel}>
          Same Level
        </Button>
        <Button variant="outline" size="sm" onClick={selectSameBoard}>
          Same Board
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
          'border-blue-500 bg-blue-50' :
          'border-gray-200 hover:border-gray-300'}`
          }>

              <p className="font-bold text-gray-900">Class {config.standard}</p>
              <p className="text-xs text-gray-500">{config.boardType}</p>
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

export default CISCEExamStructureSetup;