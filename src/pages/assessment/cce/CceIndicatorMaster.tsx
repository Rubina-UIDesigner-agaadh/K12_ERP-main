import React, { useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BookOpen,
  Users,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Settings,
  Sparkles,
  GraduationCap,
  Save,
  X,
  Search,
  AlertCircle,
  Copy,
  Eye,
  Layers,
  FileText } from
'lucide-react';

// ============ UI COMPONENTS ============
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    outline:
    'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      disabled={disabled}
      {...props}>

      {children}
    </button>);

}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        error ? 'border-red-500' : ''} ${
        className}`}
        {...props} />

      {helperText && !error &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}

interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <textarea
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
        error ? 'border-red-500' : ''} ${
        className}`}
        rows={3}
        {...props} />

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>);

}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends
  Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  helperText?: string;
}

function Select({
  label,
  options,
  className = '',
  helperText,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${className}`}
        {...props}>

        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
      {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>);

}

interface BadgeProps {
  variant?:
  'primary' |
  'secondary' |
  'success' |
  'warning' |
  'danger' |
  'info' |
  'purple';
  children: React.ReactNode;
  className?: string;
}

function Badge({ variant = 'primary', children, className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-blue-100 text-blue-700',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>

      {children}
    </span>);

}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose} />

        <div
          className={`relative bg-white rounded-xl shadow-xl ${sizes[size]} w-full p-6 z-10 max-h-[90vh] overflow-y-auto`}>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>);

}

// ============ TYPES ============
interface Subject {
  id: string;
  name: string;
  code: string;
}

interface SchoolClass {
  id: string;
  standard: string;
  section: string;
  label: string;
  subjects: Subject[];
  totalStudents: number;
  color: string;
  bgColor: string;
}

type EvaluationType = 'subject' | 'skill';
type GradeSystem =
'abc' |
'abcde' |
'marks-100' |
'marks-50' |
'points-10' |
'descriptive';

interface EvaluationConfig {
  id: string;
  type: EvaluationType;
  name: string;
  description: string;
  gradeSystem: GradeSystem;
  selectedSubjects: string[];
  active: boolean;
  createdAt: string;
}

interface ClassCceConfig {
  classId: string;
  enabled: boolean;
  evaluations: EvaluationConfig[];
}

// ============ GRADE SYSTEM OPTIONS ============
const GRADE_SYSTEMS: SelectOption[] = [
{ value: 'abc', label: 'Grade A / B / C' },
{ value: 'abcde', label: 'Grade A / B / C / D / E' },
{ value: 'marks-100', label: 'Marks (Out of 100)' },
{ value: 'marks-50', label: 'Marks (Out of 50)' },
{ value: 'points-10', label: 'Grade Points (1-10)' },
{ value: 'descriptive', label: 'Descriptive Assessment' }];


const getGradeSystemLabel = (value: GradeSystem): string => {
  return GRADE_SYSTEMS.find((gs) => gs.value === value)?.label || value;
};

// ============ INITIAL DATA - SCHOOL CLASSES (Master Data) ============
const SCHOOL_CLASSES: SchoolClass[] = [
{
  id: 'class-1',
  standard: '1',
  section: 'A',
  label: 'Class 1',
  totalStudents: 45,
  color: 'text-rose-600',
  bgColor: 'bg-rose-50',
  subjects: [
  { id: 'eng-1', name: 'English', code: 'ENG' },
  { id: 'math-1', name: 'Mathematics', code: 'MATH' },
  { id: 'evs-1', name: 'Environmental Studies', code: 'EVS' },
  { id: 'hindi-1', name: 'Hindi', code: 'HIN' },
  { id: 'art-1', name: 'Art & Craft', code: 'ART' }]

},
{
  id: 'class-2',
  standard: '2',
  section: 'A',
  label: 'Class 2',
  totalStudents: 42,
  color: 'text-orange-600',
  bgColor: 'bg-orange-50',
  subjects: [
  { id: 'eng-2', name: 'English', code: 'ENG' },
  { id: 'math-2', name: 'Mathematics', code: 'MATH' },
  { id: 'evs-2', name: 'Environmental Studies', code: 'EVS' },
  { id: 'hindi-2', name: 'Hindi', code: 'HIN' },
  { id: 'art-2', name: 'Art & Craft', code: 'ART' },
  { id: 'gk-2', name: 'General Knowledge', code: 'GK' }]

},
{
  id: 'class-3',
  standard: '3',
  section: 'A',
  label: 'Class 3',
  totalStudents: 48,
  color: 'text-amber-600',
  bgColor: 'bg-amber-50',
  subjects: [
  { id: 'eng-3', name: 'English', code: 'ENG' },
  { id: 'math-3', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-3', name: 'Science', code: 'SCI' },
  { id: 'sst-3', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-3', name: 'Hindi', code: 'HIN' },
  { id: 'comp-3', name: 'Computer', code: 'COMP' }]

},
{
  id: 'class-4',
  standard: '4',
  section: 'A',
  label: 'Class 4',
  totalStudents: 44,
  color: 'text-lime-600',
  bgColor: 'bg-lime-50',
  subjects: [
  { id: 'eng-4', name: 'English', code: 'ENG' },
  { id: 'math-4', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-4', name: 'Science', code: 'SCI' },
  { id: 'sst-4', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-4', name: 'Hindi', code: 'HIN' },
  { id: 'comp-4', name: 'Computer', code: 'COMP' },
  { id: 'gk-4', name: 'General Knowledge', code: 'GK' }]

},
{
  id: 'class-5',
  standard: '5',
  section: 'A',
  label: 'Class 5',
  totalStudents: 50,
  color: 'text-green-600',
  bgColor: 'bg-green-50',
  subjects: [
  { id: 'eng-5', name: 'English', code: 'ENG' },
  { id: 'math-5', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-5', name: 'Science', code: 'SCI' },
  { id: 'sst-5', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-5', name: 'Hindi', code: 'HIN' },
  { id: 'comp-5', name: 'Computer', code: 'COMP' },
  { id: 'sans-5', name: 'Sanskrit', code: 'SANS' }]

},
{
  id: 'class-6',
  standard: '6',
  section: 'A',
  label: 'Class 6',
  totalStudents: 46,
  color: 'text-teal-600',
  bgColor: 'bg-teal-50',
  subjects: [
  { id: 'eng-6', name: 'English', code: 'ENG' },
  { id: 'math-6', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-6', name: 'Science', code: 'SCI' },
  { id: 'sst-6', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-6', name: 'Hindi', code: 'HIN' },
  { id: 'comp-6', name: 'Computer', code: 'COMP' },
  { id: 'sans-6', name: 'Sanskrit', code: 'SANS' },
  { id: 'pe-6', name: 'Physical Education', code: 'PE' }]

},
{
  id: 'class-7',
  standard: '7',
  section: 'A',
  label: 'Class 7',
  totalStudents: 43,
  color: 'text-cyan-600',
  bgColor: 'bg-cyan-50',
  subjects: [
  { id: 'eng-7', name: 'English', code: 'ENG' },
  { id: 'math-7', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-7', name: 'Science', code: 'SCI' },
  { id: 'sst-7', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-7', name: 'Hindi', code: 'HIN' },
  { id: 'comp-7', name: 'Computer', code: 'COMP' },
  { id: 'sans-7', name: 'Sanskrit', code: 'SANS' },
  { id: 'pe-7', name: 'Physical Education', code: 'PE' }]

},
{
  id: 'class-8',
  standard: '8',
  section: 'A',
  label: 'Class 8',
  totalStudents: 47,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  subjects: [
  { id: 'eng-8', name: 'English', code: 'ENG' },
  { id: 'math-8', name: 'Mathematics', code: 'MATH' },
  { id: 'sci-8', name: 'Science', code: 'SCI' },
  { id: 'sst-8', name: 'Social Studies', code: 'SST' },
  { id: 'hindi-8', name: 'Hindi', code: 'HIN' },
  { id: 'comp-8', name: 'Computer', code: 'COMP' },
  { id: 'sans-8', name: 'Sanskrit', code: 'SANS' },
  { id: 'pe-8', name: 'Physical Education', code: 'PE' },
  { id: 'art-8', name: 'Art Education', code: 'ART' }]

}];


// ============ INITIAL CCE CONFIGS ============
const INITIAL_CCE_CONFIGS: ClassCceConfig[] = [
{
  classId: 'class-1',
  enabled: true,
  evaluations: [
  {
    id: 'eval-1-1',
    type: 'subject',
    name: 'Scholastic Assessment',
    description: 'Academic performance evaluation for core subjects',
    gradeSystem: 'abc',
    selectedSubjects: ['eng-1', 'math-1', 'evs-1', 'hindi-1'],
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'eval-1-2',
    type: 'skill',
    name: 'Communication Skills',
    description: 'Ability to express thoughts clearly in speech and writing',
    gradeSystem: 'abc',
    selectedSubjects: [],
    active: true,
    createdAt: '2024-01-15'
  }]

},
{
  classId: 'class-3',
  enabled: true,
  evaluations: [
  {
    id: 'eval-3-1',
    type: 'subject',
    name: 'Academic Evaluation',
    description: 'Subject-wise academic assessment',
    gradeSystem: 'abcde',
    selectedSubjects: ['eng-3', 'math-3', 'sci-3', 'sst-3', 'hindi-3'],
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'eval-3-2',
    type: 'skill',
    name: 'Leadership & Teamwork',
    description: 'Assessment of leadership qualities and team collaboration',
    gradeSystem: 'abc',
    selectedSubjects: [],
    active: true,
    createdAt: '2024-01-15'
  },
  {
    id: 'eval-3-3',
    type: 'skill',
    name: 'Creative Thinking',
    description: 'Ability to think creatively and solve problems innovatively',
    gradeSystem: 'descriptive',
    selectedSubjects: [],
    active: true,
    createdAt: '2024-01-15'
  }]

}];


// ============ VIEWS ============
type ViewType = 'class-list' | 'class-detail';

interface ViewState {
  type: ViewType;
  selectedClassId?: string;
}

// ============ EMPTY EVALUATION FORM ============
const EMPTY_EVALUATION: Omit<EvaluationConfig, 'id' | 'createdAt'> = {
  type: 'subject',
  name: '',
  description: '',
  gradeSystem: 'abc',
  selectedSubjects: [],
  active: true
};

// ============ MAIN COMPONENT ============
export function CceClassEvaluationSetup() {
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [cceConfigs, setCceConfigs] = useState<ClassCceConfig[]>(INITIAL_CCE_CONFIGS);
  const [view, setView] = useState<ViewState>({ type: 'class-list' });
  const [searchTerm, setSearchTerm] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Modal states
  const [showEnableClassModal, setShowEnableClassModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [editingEvaluationId, setEditingEvaluationId] = useState<string | null>(null);
  const [evaluationForm, setEvaluationForm] = useState<Omit<EvaluationConfig, 'id' | 'createdAt'>>(EMPTY_EVALUATION);

  // ============ HELPER FUNCTIONS ============
  const getClassById = (classId: string): SchoolClass | undefined => {
    return SCHOOL_CLASSES.find((c) => c.id === classId);
  };

  const getClassCceConfig = (classId: string): ClassCceConfig | undefined => {
    return cceConfigs.find((c) => c.classId === classId);
  };

  const isClassEnabled = (classId: string): boolean => {
    const config = getClassCceConfig(classId);
    return config?.enabled ?? false;
  };

  const getEnabledClasses = (): SchoolClass[] => {
    return SCHOOL_CLASSES.filter((c) => isClassEnabled(c.id));
  };

  const getFilteredClasses = (): SchoolClass[] => {
    if (!searchTerm) return SCHOOL_CLASSES;
    return SCHOOL_CLASSES.filter(
      (c) =>
      c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.standard.includes(searchTerm)
    );
  };

  const getClassEvaluations = (classId: string): EvaluationConfig[] => {
    const config = getClassCceConfig(classId);
    return config?.evaluations ?? [];
  };

  const getSubjectEvaluationCount = (classId: string): number => {
    return getClassEvaluations(classId).filter((e) => e.type === 'subject').length;
  };

  const getSkillEvaluationCount = (classId: string): number => {
    return getClassEvaluations(classId).filter((e) => e.type === 'skill').length;
  };

  // ============ NAVIGATION ============
  const navigateToClass = (classId: string) => {
    setView({ type: 'class-detail', selectedClassId: classId });
  };

  const navigateBack = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Discard them?')) {
        setHasChanges(false);
        setView({ type: 'class-list' });
      }
    } else {
      setView({ type: 'class-list' });
    }
  };

  // ============ CLASS ENABLE/DISABLE ============
  const enableClassForCce = (classId: string) => {
    const existing = getClassCceConfig(classId);
    if (existing) {
      setCceConfigs((prev) =>
      prev.map((c) => c.classId === classId ? { ...c, enabled: true } : c)
      );
    } else {
      setCceConfigs((prev) => [
      ...prev,
      { classId, enabled: true, evaluations: [] }]
      );
    }
    setShowEnableClassModal(false);
    setHasChanges(true);
  };

  const disableClassForCce = (classId: string) => {
    if (window.confirm('Are you sure you want to disable CCE for this class? All evaluations will be preserved but inactive.')) {
      setCceConfigs((prev) =>
      prev.map((c) => c.classId === classId ? { ...c, enabled: false } : c)
      );
      setHasChanges(true);
    }
  };

  // ============ EVALUATION CRUD ============
  const openAddEvaluation = (classId: string) => {
    setEvaluationForm(EMPTY_EVALUATION);
    setEditingEvaluationId(null);
    setShowEvaluationModal(true);
  };

  const openEditEvaluation = (evaluation: EvaluationConfig) => {
    const { id, createdAt, ...rest } = evaluation;
    setEvaluationForm(rest);
    setEditingEvaluationId(id);
    setShowEvaluationModal(true);
  };

  const handleSaveEvaluation = () => {
    if (!evaluationForm.name) {
      alert('Please enter a name for the evaluation');
      return;
    }

    if (evaluationForm.type === 'subject' && evaluationForm.selectedSubjects.length === 0) {
      alert('Please select at least one subject for subject evaluation');
      return;
    }

    const classId = view.selectedClassId!;

    if (editingEvaluationId) {
      // Update existing
      setCceConfigs((prev) =>
      prev.map((config) => {
        if (config.classId !== classId) return config;
        return {
          ...config,
          evaluations: config.evaluations.map((e) =>
          e.id === editingEvaluationId ?
          { ...evaluationForm, id: editingEvaluationId, createdAt: e.createdAt } :
          e
          )
        };
      })
      );
    } else {
      // Add new
      const newEvaluation: EvaluationConfig = {
        ...evaluationForm,
        id: `eval-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setCceConfigs((prev) => {
        const existing = prev.find((c) => c.classId === classId);
        if (existing) {
          return prev.map((c) =>
          c.classId === classId ?
          { ...c, evaluations: [...c.evaluations, newEvaluation] } :
          c
          );
        } else {
          return [...prev, { classId, enabled: true, evaluations: [newEvaluation] }];
        }
      });
    }

    setShowEvaluationModal(false);
    setHasChanges(true);
  };

  const handleDeleteEvaluation = (evaluationId: string) => {
    if (!window.confirm('Are you sure you want to delete this evaluation?')) return;

    const classId = view.selectedClassId!;
    setCceConfigs((prev) =>
    prev.map((config) => {
      if (config.classId !== classId) return config;
      return {
        ...config,
        evaluations: config.evaluations.filter((e) => e.id !== evaluationId)
      };
    })
    );
    setHasChanges(true);
  };

  const toggleEvaluationActive = (evaluationId: string) => {
    const classId = view.selectedClassId!;
    setCceConfigs((prev) =>
    prev.map((config) => {
      if (config.classId !== classId) return config;
      return {
        ...config,
        evaluations: config.evaluations.map((e) =>
        e.id === evaluationId ? { ...e, active: !e.active } : e
        )
      };
    })
    );
    setHasChanges(true);
  };

  const duplicateEvaluation = (evaluation: EvaluationConfig) => {
    const classId = view.selectedClassId!;
    const newEvaluation: EvaluationConfig = {
      ...evaluation,
      id: `eval-${Date.now()}`,
      name: `${evaluation.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCceConfigs((prev) =>
    prev.map((config) => {
      if (config.classId !== classId) return config;
      return {
        ...config,
        evaluations: [...config.evaluations, newEvaluation]
      };
    })
    );
    setHasChanges(true);
  };

  // ============ SUBJECT SELECTION ============
  const toggleSubjectSelection = (subjectId: string) => {
    setEvaluationForm((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId) ?
      prev.selectedSubjects.filter((id) => id !== subjectId) :
      [...prev.selectedSubjects, subjectId]
    }));
  };

  const selectAllSubjects = (subjects: Subject[]) => {
    setEvaluationForm((prev) => ({
      ...prev,
      selectedSubjects: subjects.map((s) => s.id)
    }));
  };

  const clearAllSubjects = () => {
    setEvaluationForm((prev) => ({
      ...prev,
      selectedSubjects: []
    }));
  };

  // ============ SAVE ALL CHANGES ============
  const saveAllChanges = () => {
    // In real app, save to backend
    setHasChanges(false);
    alert('All changes saved successfully!');
  };

  // ============ RENDER: CLASS LIST VIEW ============
  const renderClassListView = () =>
  <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CCE Class & Evaluation Setup
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure CCE evaluations for each class
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          options={[
          { value: '2024-25', label: 'AY 2024-25' },
          { value: '2023-24', label: 'AY 2023-24' }]
          } />

          {hasChanges &&
        <Badge variant="warning" className="animate-pulse">
              Unsaved Changes
            </Badge>
        }
          <Button onClick={saveAllChanges} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-blue-100 text-xs font-medium">Total Classes</p>
              <p className="text-2xl font-bold">{SCHOOL_CLASSES.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-green-100 text-xs font-medium">CCE Enabled</p>
              <p className="text-2xl font-bold">{getEnabledClasses().length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-purple-100 text-xs font-medium">Subject Evaluations</p>
              <p className="text-2xl font-bold">
                {cceConfigs.reduce(
                (sum, c) => sum + c.evaluations.filter((e) => e.type === 'subject').length,
                0
              )}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-amber-100 text-xs font-medium">Skill Evaluations</p>
              <p className="text-2xl font-bold">
                {cceConfigs.reduce(
                (sum, c) => sum + c.evaluations.filter((e) => e.type === 'skill').length,
                0
              )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {getFilteredClasses().map((schoolClass) => {
        const enabled = isClassEnabled(schoolClass.id);
        const subjectCount = getSubjectEvaluationCount(schoolClass.id);
        const skillCount = getSkillEvaluationCount(schoolClass.id);

        return (
          <div
            key={schoolClass.id}
            className={`${schoolClass.bgColor} border rounded-xl p-5 transition-all ${
            enabled ? 'hover:shadow-lg' : 'opacity-70'}`
            }>

              <div className="flex items-start justify-between">
                <div
                onClick={() => enabled && navigateToClass(schoolClass.id)}
                className={`w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center ${
                enabled ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`
                }>

                  <span className={`text-2xl font-bold ${schoolClass.color}`}>
                    {schoolClass.standard}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {enabled ?
                <button
                  onClick={() => disableClassForCce(schoolClass.id)}
                  className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  title="Disable CCE">

                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </button> :

                <button
                  onClick={() => enableClassForCce(schoolClass.id)}
                  className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                  title="Enable CCE">

                      <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                }
                </div>
              </div>

              <div
              onClick={() => enabled && navigateToClass(schoolClass.id)}
              className={enabled ? 'cursor-pointer' : ''}>

                <h3 className="text-lg font-semibold text-gray-900 mt-4">
                  {schoolClass.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {schoolClass.subjects.length} subjects • {schoolClass.totalStudents} students
                </p>

                {enabled &&
              <div className="flex flex-wrap gap-2 mt-3">
                    {subjectCount > 0 &&
                <Badge variant="info">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {subjectCount} Subject
                      </Badge>
                }
                    {skillCount > 0 &&
                <Badge variant="purple">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {skillCount} Skill
                      </Badge>
                }
                    {subjectCount === 0 && skillCount === 0 &&
                <Badge variant="warning">No evaluations</Badge>
                }
                  </div>
              }

                {!enabled &&
              <div className="mt-3">
                    <Badge variant="secondary">CCE Not Enabled</Badge>
                  </div>
              }

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200/50">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {subjectCount + skillCount}
                      </p>
                      <p className="text-xs text-gray-500">Evaluations</p>
                    </div>
                  </div>
                  {enabled &&
                <ChevronRight className="w-5 h-5 text-gray-400" />
                }
                </div>
              </div>
            </div>);

      })}
      </div>
    </>;


  // ============ RENDER: CLASS DETAIL VIEW ============
  const renderClassDetailView = () => {
    const schoolClass = getClassById(view.selectedClassId!);
    if (!schoolClass) return null;

    const evaluations = getClassEvaluations(schoolClass.id);
    const subjectEvaluations = evaluations.filter((e) => e.type === 'subject');
    const skillEvaluations = evaluations.filter((e) => e.type === 'skill');

    return (
      <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={navigateBack}
              className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">

              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div
              className={`w-14 h-14 rounded-xl bg-white shadow-sm border flex items-center justify-center`}>

              <span className={`text-2xl font-bold ${schoolClass.color}`}>
                {schoolClass.standard}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {schoolClass.label}
                </h1>
                <Badge variant="success">CCE Enabled</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {schoolClass.subjects.length} subjects •{' '}
                {schoolClass.totalStudents} students • {evaluations.length}{' '}
                evaluations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasChanges &&
            <Badge variant="warning" className="animate-pulse">
                Unsaved Changes
              </Badge>
            }
            <Button
              variant="outline"
              onClick={() => openAddEvaluation(schoolClass.id)}>

              <Plus className="w-4 h-4 mr-2" />
              Add Evaluation
            </Button>
            <Button onClick={saveAllChanges} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${schoolClass.bgColor} border rounded-xl p-4`}>
            <p
              className={`text-xs font-semibold ${schoolClass.color} uppercase tracking-wide`}>

              Subjects
            </p>
            <p className={`text-3xl font-bold ${schoolClass.color} mt-1`}>
              {schoolClass.subjects.length}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
              Subject Evaluations
            </p>
            <p className="text-3xl font-bold text-blue-700 mt-1">
              {subjectEvaluations.length}
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Skill Evaluations
            </p>
            <p className="text-3xl font-bold text-purple-700 mt-1">
              {skillEvaluations.length}
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
              Total Students
            </p>
            <p className="text-3xl font-bold text-green-700 mt-1">
              {schoolClass.totalStudents}
            </p>
          </div>
        </div>

        {/* Subjects List */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-500" />
            Available Subjects
          </h3>
          <div className="flex flex-wrap gap-2">
            {schoolClass.subjects.map((subject) =>
            <span
              key={subject.id}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm">

                <span className="font-mono text-xs text-gray-500 mr-2">
                  {subject.code}
                </span>
                {subject.name}
              </span>
            )}
          </div>
        </div>

        {/* Evaluations List */}
        {evaluations.length === 0 ?
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Evaluations Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first evaluation for this class
            </p>
            <Button onClick={() => openAddEvaluation(schoolClass.id)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Evaluation
            </Button>
          </div> :

        <div className="space-y-4">
            {/* Subject Evaluations */}
            {subjectEvaluations.length > 0 &&
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">
                    Subject Evaluations
                  </h3>
                  <Badge variant="info">{subjectEvaluations.length}</Badge>
                </div>
                <div className="divide-y divide-gray-100">
                  {subjectEvaluations.map((evaluation) =>
              <EvaluationRow
                key={evaluation.id}
                evaluation={evaluation}
                subjects={schoolClass.subjects}
                onEdit={() => openEditEvaluation(evaluation)}
                onDelete={() => handleDeleteEvaluation(evaluation.id)}
                onToggleActive={() => toggleEvaluationActive(evaluation.id)}
                onDuplicate={() => duplicateEvaluation(evaluation)} />

              )}
                </div>
              </div>
          }

            {/* Skill Evaluations */}
            {skillEvaluations.length > 0 &&
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-purple-50 border-b border-purple-200 px-4 py-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">
                    Skill Evaluations
                  </h3>
                  <Badge variant="purple">{skillEvaluations.length}</Badge>
                </div>
                <div className="divide-y divide-gray-100">
                  {skillEvaluations.map((evaluation) =>
              <EvaluationRow
                key={evaluation.id}
                evaluation={evaluation}
                subjects={schoolClass.subjects}
                onEdit={() => openEditEvaluation(evaluation)}
                onDelete={() => handleDeleteEvaluation(evaluation.id)}
                onToggleActive={() => toggleEvaluationActive(evaluation.id)}
                onDuplicate={() => duplicateEvaluation(evaluation)} />

              )}
                </div>
              </div>
          }
          </div>
        }
      </>);

  };

  // ============ RENDER: EVALUATION MODAL ============
  const renderEvaluationModal = () => {
    const schoolClass = getClassById(view.selectedClassId!);
    if (!schoolClass) return null;

    return (
      <Modal
        isOpen={showEvaluationModal}
        onClose={() => setShowEvaluationModal(false)}
        title={editingEvaluationId ? 'Edit Evaluation' : 'Add New Evaluation'}
        size="lg">

        <div className="space-y-6">
          {/* Evaluation Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Evaluation Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                setEvaluationForm((p) => ({
                  ...p,
                  type: 'subject',
                  selectedSubjects: []
                }))
                }
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                evaluationForm.type === 'subject' ?
                'border-blue-500 bg-blue-50' :
                'border-gray-200 hover:border-gray-300'}`
                }>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    evaluationForm.type === 'subject' ?
                    'bg-blue-100' :
                    'bg-gray-100'}`
                    }>

                    <BookOpen
                      className={`w-5 h-5 ${
                      evaluationForm.type === 'subject' ?
                      'text-blue-600' :
                      'text-gray-500'}`
                      } />

                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                      evaluationForm.type === 'subject' ?
                      'text-blue-700' :
                      'text-gray-700'}`
                      }>

                      Subject Evaluation
                    </p>
                    <p className="text-xs text-gray-500">
                      Evaluate based on academic subjects
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                setEvaluationForm((p) => ({
                  ...p,
                  type: 'skill',
                  selectedSubjects: []
                }))
                }
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                evaluationForm.type === 'skill' ?
                'border-purple-500 bg-purple-50' :
                'border-gray-200 hover:border-gray-300'}`
                }>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    evaluationForm.type === 'skill' ?
                    'bg-purple-100' :
                    'bg-gray-100'}`
                    }>

                    <Sparkles
                      className={`w-5 h-5 ${
                      evaluationForm.type === 'skill' ?
                      'text-purple-600' :
                      'text-gray-500'}`
                      } />

                  </div>
                  <div>
                    <p
                      className={`font-semibold ${
                      evaluationForm.type === 'skill' ?
                      'text-purple-700' :
                      'text-gray-700'}`
                      }>

                      Skill Evaluation
                    </p>
                    <p className="text-xs text-gray-500">
                      Evaluate personality & life skills
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Evaluation Name"
              value={evaluationForm.name}
              onChange={(e) =>
              setEvaluationForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder={
              evaluationForm.type === 'subject' ?
              'e.g., Scholastic Assessment' :
              'e.g., Communication Skills'
              } />

            <Select
              label="Grading System"
              value={evaluationForm.gradeSystem}
              onChange={(e) =>
              setEvaluationForm((p) => ({
                ...p,
                gradeSystem: e.target.value as GradeSystem
              }))
              }
              options={GRADE_SYSTEMS} />

          </div>

          <Textarea
            label="Description"
            value={evaluationForm.description}
            onChange={(e) =>
            setEvaluationForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder={
            evaluationForm.type === 'subject' ?
            'Describe the academic evaluation criteria...' :
            'Describe the skill being evaluated...'
            } />


          {/* Subject Selection (only for subject type) */}
          {evaluationForm.type === 'subject' &&
          <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select Subjects
                </label>
                <div className="flex items-center gap-2">
                  <button
                  type="button"
                  onClick={() => selectAllSubjects(schoolClass.subjects)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium">

                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                  type="button"
                  onClick={clearAllSubjects}
                  className="text-xs text-gray-500 hover:text-gray-700 font-medium">

                    Clear All
                  </button>
                </div>
              </div>

              {evaluationForm.selectedSubjects.length === 0 &&
            <div className="flex items-center gap-2 text-amber-600 text-sm mb-3">
                  <AlertCircle className="w-4 h-4" />
                  Please select at least one subject
                </div>
            }

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {schoolClass.subjects.map((subject) => {
                const isSelected = evaluationForm.selectedSubjects.includes(
                  subject.id
                );
                return (
                  <label
                    key={subject.id}
                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ?
                    'bg-blue-50 border-blue-300' :
                    'bg-white border-gray-200 hover:border-gray-300'}`
                    }>

                      <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSubjectSelection(subject.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                      <div>
                        <p
                        className={`text-sm font-medium ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'}`
                        }>

                          {subject.name}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {subject.code}
                        </p>
                      </div>
                    </label>);

              })}
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {evaluationForm.selectedSubjects.length} of{' '}
                {schoolClass.subjects.length} subjects selected
              </p>
            </div>
          }

          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="evaluation-active"
              checked={evaluationForm.active}
              onChange={(e) =>
              setEvaluationForm((p) => ({ ...p, active: e.target.checked }))
              }
              className="w-4 h-4 rounded border-gray-300 text-blue-600" />

            <label
              htmlFor="evaluation-active"
              className="text-sm font-medium text-gray-700">

              Active
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEvaluationModal(false)}>

              Cancel
            </Button>
            <Button onClick={handleSaveEvaluation}>
              {editingEvaluationId ? 'Update' : 'Create'} Evaluation
            </Button>
          </div>
        </div>
      </Modal>);

  };

  return (
    <div className="p-6 space-y-6">
      {view.type === 'class-list' && renderClassListView()}
      {view.type === 'class-detail' && renderClassDetailView()}

      {/* Evaluation Modal */}
      {renderEvaluationModal()}
    </div>);

}

// ============ EVALUATION ROW COMPONENT ============
interface EvaluationRowProps {
  evaluation: EvaluationConfig;
  subjects: Subject[];
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onDuplicate: () => void;
}

function EvaluationRow({
  evaluation,
  subjects,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate
}: EvaluationRowProps) {
  const [expanded, setExpanded] = useState(false);

  const getSelectedSubjectNames = () => {
    return evaluation.selectedSubjects.
    map((id) => subjects.find((s) => s.id === id)?.name).
    filter(Boolean);
  };

  return (
    <div className={`${!evaluation.active ? 'opacity-60' : ''}`}>
      <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-gray-100">

            {expanded ?
            <ChevronUp className="w-4 h-4 text-gray-500" /> :

            <ChevronDown className="w-4 h-4 text-gray-500" />
            }
          </button>

          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            evaluation.type === 'subject' ? 'bg-blue-100' : 'bg-purple-100'}`
            }>

            {evaluation.type === 'subject' ?
            <BookOpen
              className={`w-5 h-5 ${
              evaluation.type === 'subject' ?
              'text-blue-600' :
              'text-purple-600'}`
              } /> :


            <Sparkles className="w-5 h-5 text-purple-600" />
            }
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 truncate">
                {evaluation.name}
              </h4>
              {!evaluation.active &&
              <Badge variant="secondary">Inactive</Badge>
              }
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={evaluation.type === 'subject' ? 'info' : 'purple'}>

                {evaluation.type === 'subject' ? 'Subject' : 'Skill'}
              </Badge>
              <Badge variant="secondary">
                {getGradeSystemLabel(evaluation.gradeSystem)}
              </Badge>
              {evaluation.type === 'subject' &&
              <span className="text-xs text-gray-500">
                  {evaluation.selectedSubjects.length} subjects
                </span>
              }
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleActive}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title={evaluation.active ? 'Deactivate' : 'Activate'}>

            {evaluation.active ?
            <CheckCircle className="w-4 h-4 text-green-500" /> :

            <XCircle className="w-4 h-4 text-gray-400" />
            }
          </button>
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Duplicate">

            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            title="Edit">

            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-red-500 transition-colors"
            title="Delete">

            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded &&
      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="pt-3 space-y-3">
            {evaluation.description &&
          <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-700">{evaluation.description}</p>
              </div>
          }

            {evaluation.type === 'subject' &&
          evaluation.selectedSubjects.length > 0 &&
          <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Selected Subjects
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {getSelectedSubjectNames().map((name, idx) =>
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">

                        {name}
                      </span>
              )}
                  </div>
                </div>
          }

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Created: {evaluation.createdAt}</span>
              <span>
                Grade System: {getGradeSystemLabel(evaluation.gradeSystem)}
              </span>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default CceClassEvaluationSetup;