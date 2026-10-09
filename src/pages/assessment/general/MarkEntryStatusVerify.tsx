import React, { useState, useMemo, useEffect } from 'react';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Eye,
  Save,
  Power,
  PowerOff,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Calculator,
  FileText,
  Star,
  Activity,
  GraduationCap,
  Building,
  Clipboard,
  Hash,
  Percent,
  ToggleLeft,
  ToggleRight,
  Grid,
  List,
  Copy,
  Info,
  AlertCircle,
  PieChart,
  BarChart3,
  Sparkles,
  Target,
  Award,
  ClipboardList,
  Beaker,
  PenTool,
  Users,
  Calendar,
  ChevronLeft,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  Download,
  Upload,
  Link,
  Unlink,
  Lock,
  CheckSquare,
  Square,
  MinusCircle,
  PlusCircle,
  Layers,
  Clock,
  History,
  FileCheck,
  Edit3,
  LayoutGrid,
  Notebook,
  UserCheck,
  ClipboardCheck,
  MessageSquare,
  Presentation,
  FlaskConical,
  Hand,
  BookMarked,
  Timer,
  Briefcase,
  Medal,
  Zap,
  Brain,
  Pencil,
  Check,
  ArrowRight,
  Eye as EyeIcon,
  Unlock,
  Archive,
  RotateCcw,
  Wand2,
  ArrowDown,
  ArrowUp,
  Home,
  Play } from
'lucide-react';

// ============================================
// Types
// ============================================

interface BulkCriterion {
  id: string;
  name: string;
  percentage: number;
  description: string;
  icon?: string;
  order: number;
}

interface SubjectCriterion {
  id: string;
  name: string;
  maxMarks: number;
  description: string;
  icon?: string;
  order: number;
}

interface SubjectInternalConfig {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  subjectType: 'core' | 'elective' | 'language' | 'activity';
  criteria: SubjectCriterion[];
  useCustomConfig: boolean;
  isConfigured: boolean;
  isLocked: boolean;
  isSelected: boolean;
}

interface VersionHistory {
  version: number;
  modifiedBy: string;
  modifiedAt: string;
  changeNotes: string;
  status: string;
}

interface ClassConfiguration {
  id: string;
  academicYear: string;
  board: string;
  standard: string;
  section: string;
  status: 'active' | 'draft' | 'inactive' | 'not_configured';
  totalSubjects: number;
  configuredSubjects: number;
  overallInternalMarks: number;
  lastModified: string;
  modifiedBy: string;
  version: number;
  subjects: SubjectInternalConfig[];
}

type ViewMode = 'dashboard' | 'configure';

// ============================================
// Constants
// ============================================

const academicYears = ['2023-24', '2024-25', '2025-26'];
const boards = ['CBSE', 'GSEB', 'ICSE', 'State Board', 'Internal'];
const standards = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const sections = ['A', 'B', 'C', 'D'];

const predefinedCriteria = [
{ name: 'Attendance', icon: 'UserCheck', description: 'Regular attendance and punctuality', defaultPercentage: 10 },
{ name: 'Notebook Submission', icon: 'Notebook', description: 'Quality and timely submission of notebooks', defaultPercentage: 15 },
{ name: 'Assignment', icon: 'ClipboardCheck', description: 'Completion and quality of assignments', defaultPercentage: 20 },
{ name: 'Class Participation', icon: 'Hand', description: 'Active participation in class activities', defaultPercentage: 15 },
{ name: 'Subject Knowledge', icon: 'Brain', description: 'Understanding and grasp of subject concepts', defaultPercentage: 10 },
{ name: 'Project Work', icon: 'Presentation', description: 'Quality of project submissions', defaultPercentage: 15 },
{ name: 'Viva', icon: 'MessageSquare', description: 'Oral examination performance', defaultPercentage: 10 },
{ name: 'Discipline', icon: 'Medal', description: 'Behavior and discipline in class', defaultPercentage: 5 },
{ name: 'Classwork', icon: 'Pencil', description: 'Daily classwork completion', defaultPercentage: 15 },
{ name: 'Practical Record', icon: 'FlaskConical', description: 'Maintenance of practical records', defaultPercentage: 20 },
{ name: 'Reading Skills', icon: 'BookMarked', description: 'Reading ability and comprehension', defaultPercentage: 15 },
{ name: 'Writing Skills', icon: 'PenTool', description: 'Writing ability and expression', defaultPercentage: 15 },
{ name: 'Test Performance', icon: 'FileCheck', description: 'Performance in periodic tests', defaultPercentage: 25 },
{ name: 'Homework', icon: 'Briefcase', description: 'Regular homework completion', defaultPercentage: 15 },
{ name: 'Activity', icon: 'Activity', description: 'Participation in activities', defaultPercentage: 10 }];


// Pre-configured class data
const initialClassConfigurations: ClassConfiguration[] = [
{
  id: 'config1',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '10',
  section: '',
  status: 'active',
  totalSubjects: 9,
  configuredSubjects: 9,
  overallInternalMarks: 20,
  lastModified: '2024-01-15 10:30 AM',
  modifiedBy: 'Admin User',
  version: 3,
  subjects: [
  {
    subjectId: 'sub1', subjectName: 'Mathematics', subjectCode: 'MAT', subjectType: 'core',
    useCustomConfig: false, isConfigured: true, isLocked: true, isSelected: true,
    criteria: [
    { id: 'c1', name: 'Notebook', maxMarks: 5, description: '', icon: '', order: 1 },
    { id: 'c2', name: 'Assignment', maxMarks: 5, description: '', icon: '', order: 2 },
    { id: 'c3', name: 'Class Participation', maxMarks: 5, description: '', icon: '', order: 3 },
    { id: 'c4', name: 'Test', maxMarks: 5, description: '', icon: '', order: 4 }]

  },
  {
    subjectId: 'sub2', subjectName: 'Science', subjectCode: 'SCI', subjectType: 'core',
    useCustomConfig: true, isConfigured: true, isLocked: true, isSelected: true,
    criteria: [
    { id: 'c5', name: 'Practical', maxMarks: 8, description: '', icon: '', order: 1 },
    { id: 'c6', name: 'Lab Record', maxMarks: 4, description: '', icon: '', order: 2 },
    { id: 'c7', name: 'Viva', maxMarks: 4, description: '', icon: '', order: 3 },
    { id: 'c8', name: 'Project', maxMarks: 4, description: '', icon: '', order: 4 }]

  },
  {
    subjectId: 'sub3', subjectName: 'English', subjectCode: 'ENG', subjectType: 'language',
    useCustomConfig: false, isConfigured: true, isLocked: true, isSelected: true,
    criteria: [
    { id: 'c9', name: 'Notebook', maxMarks: 5, description: '', icon: '', order: 1 },
    { id: 'c10', name: 'Assignment', maxMarks: 5, description: '', icon: '', order: 2 },
    { id: 'c11', name: 'Class Participation', maxMarks: 5, description: '', icon: '', order: 3 },
    { id: 'c12', name: 'Test', maxMarks: 5, description: '', icon: '', order: 4 }]

  }]

},
{
  id: 'config2',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '9',
  section: '',
  status: 'active',
  totalSubjects: 9,
  configuredSubjects: 9,
  overallInternalMarks: 20,
  lastModified: '2024-01-10 02:15 PM',
  modifiedBy: 'Admin User',
  version: 2,
  subjects: []
},
{
  id: 'config3',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '8',
  section: '',
  status: 'draft',
  totalSubjects: 7,
  configuredSubjects: 5,
  overallInternalMarks: 20,
  lastModified: '2024-01-18 11:00 AM',
  modifiedBy: 'Teacher A',
  version: 1,
  subjects: []
},
{
  id: 'config4',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '7',
  section: '',
  status: 'active',
  totalSubjects: 7,
  configuredSubjects: 7,
  overallInternalMarks: 20,
  lastModified: '2024-01-05 09:30 AM',
  modifiedBy: 'Admin User',
  version: 4,
  subjects: []
},
{
  id: 'config5',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '6',
  section: '',
  status: 'inactive',
  totalSubjects: 7,
  configuredSubjects: 7,
  overallInternalMarks: 20,
  lastModified: '2023-12-20 03:45 PM',
  modifiedBy: 'Admin User',
  version: 2,
  subjects: []
},
{
  id: 'config6',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '12',
  section: 'A',
  status: 'active',
  totalSubjects: 6,
  configuredSubjects: 6,
  overallInternalMarks: 30,
  lastModified: '2024-01-12 04:00 PM',
  modifiedBy: 'HOD Science',
  version: 5,
  subjects: []
},
{
  id: 'config7',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '11',
  section: '',
  status: 'draft',
  totalSubjects: 6,
  configuredSubjects: 4,
  overallInternalMarks: 30,
  lastModified: '2024-01-19 10:00 AM',
  modifiedBy: 'Teacher B',
  version: 1,
  subjects: []
},
{
  id: 'config8',
  academicYear: '2024-25',
  board: 'GSEB',
  standard: '10',
  section: '',
  status: 'active',
  totalSubjects: 8,
  configuredSubjects: 8,
  overallInternalMarks: 20,
  lastModified: '2024-01-08 11:30 AM',
  modifiedBy: 'Admin User',
  version: 3,
  subjects: []
},
{
  id: 'config9',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '5',
  section: '',
  status: 'not_configured',
  totalSubjects: 5,
  configuredSubjects: 0,
  overallInternalMarks: 20,
  lastModified: '',
  modifiedBy: '',
  version: 0,
  subjects: []
},
{
  id: 'config10',
  academicYear: '2024-25',
  board: 'CBSE',
  standard: '4',
  section: '',
  status: 'not_configured',
  totalSubjects: 5,
  configuredSubjects: 0,
  overallInternalMarks: 20,
  lastModified: '',
  modifiedBy: '',
  version: 0,
  subjects: []
}];


const getSubjectsForClass = (standard: string): SubjectInternalConfig[] => {
  const baseSubjects = [
  { id: 'sub1', name: 'Mathematics', code: 'MAT', type: 'core' as const },
  { id: 'sub2', name: 'English', code: 'ENG', type: 'language' as const },
  { id: 'sub3', name: 'Hindi', code: 'HIN', type: 'language' as const },
  { id: 'sub4', name: 'Science', code: 'SCI', type: 'core' as const },
  { id: 'sub5', name: 'Social Science', code: 'SSC', type: 'core' as const }];


  const seniorSubjects = [
  ...baseSubjects,
  { id: 'sub6', name: 'Computer Science', code: 'CS', type: 'elective' as const },
  { id: 'sub7', name: 'Physical Education', code: 'PE', type: 'activity' as const },
  { id: 'sub8', name: 'Physics', code: 'PHY', type: 'core' as const },
  { id: 'sub9', name: 'Chemistry', code: 'CHE', type: 'core' as const }];


  const primarySubjects = [
  { id: 'sub1', name: 'Mathematics', code: 'MAT', type: 'core' as const },
  { id: 'sub2', name: 'English', code: 'ENG', type: 'language' as const },
  { id: 'sub3', name: 'Hindi', code: 'HIN', type: 'language' as const },
  { id: 'sub4', name: 'Environmental Science', code: 'EVS', type: 'core' as const },
  { id: 'sub5', name: 'Art & Craft', code: 'ART', type: 'activity' as const }];


  const subjects = parseInt(standard) <= 5 ? primarySubjects :
  parseInt(standard) >= 9 ? seniorSubjects : baseSubjects;

  return subjects.map((sub) => ({
    subjectId: sub.id,
    subjectName: sub.name,
    subjectCode: sub.code,
    subjectType: sub.type,
    criteria: [],
    useCustomConfig: false,
    isConfigured: false,
    isLocked: false,
    isSelected: true
  }));
};

// Get icon component
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    UserCheck,
    Notebook,
    ClipboardCheck,
    Hand,
    Brain,
    Presentation,
    MessageSquare,
    Medal,
    Pencil,
    FlaskConical,
    BookMarked,
    PenTool,
    FileCheck,
    Briefcase,
    Activity,
    Timer
  };
  return icons[iconName] || ClipboardList;
};

const generateId = () => Math.random().toString(36).substring(2, 11);

// ============================================
// Main Component
// ============================================

export function BulkInternalMarkingSetup() {
  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [classConfigurations, setClassConfigurations] = useState<ClassConfiguration[]>(initialClassConfigurations);
  const [selectedConfig, setSelectedConfig] = useState<ClassConfiguration | null>(null);

  // Dashboard Filters
  const [dashboardAcademicYear, setDashboardAcademicYear] = useState('2024-25');
  const [dashboardBoard, setDashboardBoard] = useState('');
  const [dashboardStatus, setDashboardStatus] = useState<string>('');
  const [dashboardSearch, setDashboardSearch] = useState('');

  // Selection States
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [board, setBoard] = useState('');
  const [standard, setStandard] = useState('');
  const [section, setSection] = useState('');

  // Data States
  const [subjects, setSubjects] = useState<SubjectInternalConfig[]>([]);
  const [bulkCriteria, setBulkCriteria] = useState<BulkCriterion[]>([]);
  const [overallInternalMarks, setOverallInternalMarks] = useState<number>(20);
  const [configStatus, setConfigStatus] = useState<'draft' | 'active' | 'inactive'>('draft');
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([]);
  const [currentVersion, setCurrentVersion] = useState(1);
  const [changeNotes, setChangeNotes] = useState('');

  // UI States
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSubjectEditor, setShowSubjectEditor] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectInternalConfig | null>(null);
  const [showCriteriaSelector, setShowCriteriaSelector] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingConfig, setViewingConfig] = useState<ClassConfiguration | null>(null);

  // Bulk Criteria Form
  const [newCriterion, setNewCriterion] = useState({
    name: '',
    percentage: 0,
    description: '',
    icon: ''
  });

  // Filtered configurations for dashboard
  const filteredConfigurations = useMemo(() => {
    return classConfigurations.filter((config) => {
      const matchesYear = config.academicYear === dashboardAcademicYear;
      const matchesBoard = !dashboardBoard || config.board === dashboardBoard;
      const matchesStatus = !dashboardStatus || config.status === dashboardStatus;
      const matchesSearch = !dashboardSearch ||
      `Class ${config.standard}${config.section ? `-${config.section}` : ''}`.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      config.board.toLowerCase().includes(dashboardSearch.toLowerCase());
      return matchesYear && matchesBoard && matchesStatus && matchesSearch;
    });
  }, [classConfigurations, dashboardAcademicYear, dashboardBoard, dashboardStatus, dashboardSearch]);

  // Dashboard statistics
  const dashboardStats = useMemo(() => {
    const filtered = classConfigurations.filter((c) => c.academicYear === dashboardAcademicYear);
    return {
      total: filtered.length,
      active: filtered.filter((c) => c.status === 'active').length,
      draft: filtered.filter((c) => c.status === 'draft').length,
      inactive: filtered.filter((c) => c.status === 'inactive').length,
      notConfigured: filtered.filter((c) => c.status === 'not_configured').length
    };
  }, [classConfigurations, dashboardAcademicYear]);

  // Load subjects when class is selected
  useEffect(() => {
    if (standard && viewMode === 'configure') {
      const classSubjects = getSubjectsForClass(standard);
      setSubjects(classSubjects);
      setBulkCriteria([]);
    }
  }, [standard, viewMode]);

  // Open configuration for a class
  const openConfiguration = (config: ClassConfiguration) => {
    setSelectedConfig(config);
    setAcademicYear(config.academicYear);
    setBoard(config.board);
    setStandard(config.standard);
    setSection(config.section);
    setOverallInternalMarks(config.overallInternalMarks);
    setConfigStatus(config.status === 'not_configured' ? 'draft' : config.status as any);
    setCurrentVersion(config.version);

    if (config.subjects.length > 0) {
      setSubjects(config.subjects);
    } else {
      setSubjects(getSubjectsForClass(config.standard));
    }

    setViewMode('configure');
  };

  // Create new configuration
  const createNewConfiguration = () => {
    setSelectedConfig(null);
    setAcademicYear('2024-25');
    setBoard('');
    setStandard('');
    setSection('');
    setSubjects([]);
    setBulkCriteria([]);
    setOverallInternalMarks(20);
    setConfigStatus('draft');
    setCurrentVersion(1);
    setViewMode('configure');
  };

  // Back to dashboard
  const backToDashboard = () => {
    setViewMode('dashboard');
    setSelectedConfig(null);
    setSubjects([]);
    setBulkCriteria([]);
    setErrors({});
  };

  // View configuration details
  const viewConfigurationDetails = (config: ClassConfiguration) => {
    setViewingConfig(config);
    setShowViewModal(true);
  };

  // Calculate marks from percentage
  const calculateMarksFromPercentage = (percentage: number, totalMarks: number): number => {
    return Math.round(percentage / 100 * totalMarks);
  };

  // Apply bulk criteria to all selected subjects
  const applyBulkCriteriaToSubjects = () => {
    if (bulkCriteria.length === 0) {
      setErrors({ bulk: 'Please add at least one criterion' });
      return;
    }

    const totalPercentage = bulkCriteria.reduce((sum, c) => sum + c.percentage, 0);
    if (totalPercentage !== 100) {
      setErrors({ bulk: `Total percentage must be 100% (currently ${totalPercentage}%)` });
      return;
    }

    if (overallInternalMarks <= 0) {
      setErrors({ bulk: 'Overall internal marks must be greater than 0' });
      return;
    }

    const updatedSubjects = subjects.map((subject) => {
      if (!subject.isSelected || subject.useCustomConfig) {
        return subject;
      }

      const subjectCriteria: SubjectCriterion[] = bulkCriteria.map((bc, index) => ({
        id: generateId(),
        name: bc.name,
        maxMarks: calculateMarksFromPercentage(bc.percentage, overallInternalMarks),
        description: bc.description,
        icon: bc.icon,
        order: index + 1
      }));

      // Adjust for rounding differences
      const total = subjectCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
      if (total !== overallInternalMarks && subjectCriteria.length > 0) {
        subjectCriteria[0].maxMarks += overallInternalMarks - total;
      }

      return {
        ...subject,
        criteria: subjectCriteria,
        isConfigured: true
      };
    });

    setSubjects(updatedSubjects);
    setErrors({});
  };

  // Add bulk criterion
  const handleAddBulkCriterion = () => {
    if (!newCriterion.name.trim()) {
      setErrors({ criterion: 'Criterion name is required' });
      return;
    }

    if (newCriterion.percentage <= 0) {
      setErrors({ criterion: 'Percentage must be greater than 0' });
      return;
    }

    const currentTotal = bulkCriteria.reduce((sum, c) => sum + c.percentage, 0);
    if (currentTotal + newCriterion.percentage > 100) {
      setErrors({ criterion: `Adding ${newCriterion.percentage}% would exceed 100% (current: ${currentTotal}%)` });
      return;
    }

    const criterion: BulkCriterion = {
      id: generateId(),
      name: newCriterion.name.trim(),
      percentage: newCriterion.percentage,
      description: newCriterion.description,
      icon: newCriterion.icon,
      order: bulkCriteria.length + 1
    };

    setBulkCriteria((prev) => [...prev, criterion]);
    setNewCriterion({ name: '', percentage: 0, description: '', icon: '' });
    setErrors({});
  };

  // Delete bulk criterion
  const handleDeleteBulkCriterion = (id: string) => {
    setBulkCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  // Update bulk criterion
  const handleUpdateBulkCriterion = (id: string, updates: Partial<BulkCriterion>) => {
    setBulkCriteria((prev) => prev.map((c) => c.id === id ? { ...c, ...updates } : c));
  };

  // Select predefined criterion
  const handleSelectPredefined = (criterion: typeof predefinedCriteria[0]) => {
    setNewCriterion({
      name: criterion.name,
      percentage: criterion.defaultPercentage,
      description: criterion.description,
      icon: criterion.icon
    });
    setShowCriteriaSelector(false);
  };

  // Toggle subject selection
  const toggleSubjectSelection = (subjectId: string) => {
    setSubjects((prev) => prev.map((s) =>
    s.subjectId === subjectId ? { ...s, isSelected: !s.isSelected } : s
    ));
  };

  // Select/Deselect all subjects
  const toggleSelectAll = (selected: boolean) => {
    setSubjects((prev) => prev.map((s) => ({ ...s, isSelected: selected })));
  };

  // Open subject editor for custom config
  const openSubjectEditor = (subject: SubjectInternalConfig) => {
    setEditingSubject({ ...subject });
    setShowSubjectEditor(true);
  };

  // Save subject custom config
  const saveSubjectConfig = () => {
    if (!editingSubject) return;

    const total = editingSubject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
    if (total !== overallInternalMarks) {
      setErrors({ subject: `Criteria total (${total}) must equal overall internal marks (${overallInternalMarks})` });
      return;
    }

    setSubjects((prev) => prev.map((s) =>
    s.subjectId === editingSubject.subjectId ?
    { ...editingSubject, useCustomConfig: true, isConfigured: true } :
    s
    ));
    setShowSubjectEditor(false);
    setEditingSubject(null);
    setErrors({});
  };

  // Add criterion to editing subject
  const addCriterionToSubject = (name: string, maxMarks: number, description: string, icon: string) => {
    if (!editingSubject) return;

    const newCrit: SubjectCriterion = {
      id: generateId(),
      name,
      maxMarks,
      description,
      icon,
      order: editingSubject.criteria.length + 1
    };

    setEditingSubject((prev) => prev ? {
      ...prev,
      criteria: [...prev.criteria, newCrit]
    } : null);
  };

  // Delete criterion from editing subject
  const deleteCriterionFromSubject = (criterionId: string) => {
    if (!editingSubject) return;

    setEditingSubject((prev) => prev ? {
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== criterionId)
    } : null);
  };

  // Update criterion in editing subject
  const updateCriterionInSubject = (criterionId: string, updates: Partial<SubjectCriterion>) => {
    if (!editingSubject) return;

    setEditingSubject((prev) => prev ? {
      ...prev,
      criteria: prev.criteria.map((c) => c.id === criterionId ? { ...c, ...updates } : c)
    } : null);
  };

  // Reset subject to bulk config
  const resetSubjectToBulk = (subjectId: string) => {
    if (bulkCriteria.length === 0) return;

    const subjectCriteria: SubjectCriterion[] = bulkCriteria.map((bc, index) => ({
      id: generateId(),
      name: bc.name,
      maxMarks: calculateMarksFromPercentage(bc.percentage, overallInternalMarks),
      description: bc.description,
      icon: bc.icon,
      order: index + 1
    }));

    const total = subjectCriteria.reduce((sum, c) => sum + c.maxMarks, 0);
    if (total !== overallInternalMarks && subjectCriteria.length > 0) {
      subjectCriteria[0].maxMarks += overallInternalMarks - total;
    }

    setSubjects((prev) => prev.map((s) =>
    s.subjectId === subjectId ? {
      ...s,
      criteria: subjectCriteria,
      useCustomConfig: false,
      isConfigured: true
    } : s
    ));
  };

  // Validation
  const validateAllSubjects = (): string[] => {
    const errors: string[] = [];

    subjects.forEach((subject) => {
      if (subject.criteria.length > 0) {
        const total = subject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
        if (total !== overallInternalMarks) {
          errors.push(`${subject.subjectName}: Criteria total (${total}) ≠ Overall Internal Marks (${overallInternalMarks})`);
        }
      }
    });

    return errors;
  };

  // Save as draft
  const handleSaveAsDraft = async () => {
    const validationErrors = validateAllSubjects();
    if (validationErrors.length > 0) {
      setErrors({ validation: validationErrors.join('\n') });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update or create configuration
    const configId = selectedConfig?.id || generateId();
    const updatedConfig: ClassConfiguration = {
      id: configId,
      academicYear,
      board,
      standard,
      section,
      status: 'draft',
      totalSubjects: subjects.length,
      configuredSubjects: subjects.filter((s) => s.isConfigured).length,
      overallInternalMarks,
      lastModified: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      version: currentVersion + 1,
      subjects: subjects
    };

    setClassConfigurations((prev) => {
      const exists = prev.find((c) => c.id === configId);
      if (exists) {
        return prev.map((c) => c.id === configId ? updatedConfig : c);
      }
      return [...prev, updatedConfig];
    });

    setConfigStatus('draft');
    setCurrentVersion((prev) => prev + 1);
    setVersionHistory((prev) => [...prev, {
      version: currentVersion + 1,
      modifiedBy: 'Current User',
      modifiedAt: new Date().toLocaleString(),
      changeNotes: changeNotes || 'Saved as draft',
      status: 'draft'
    }]);
    setChangeNotes('');
    setIsSaving(false);
    setErrors({});
  };

  // Activate
  const handleActivate = async () => {
    const configuredSubjects = subjects.filter((s) => s.criteria.length > 0);
    if (configuredSubjects.length === 0) {
      setErrors({ validation: 'Please configure at least one subject' });
      return;
    }

    const validationErrors = validateAllSubjects();
    if (validationErrors.length > 0) {
      setErrors({ validation: validationErrors.join('\n') });
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update or create configuration
    const configId = selectedConfig?.id || generateId();
    const updatedConfig: ClassConfiguration = {
      id: configId,
      academicYear,
      board,
      standard,
      section,
      status: 'active',
      totalSubjects: subjects.length,
      configuredSubjects: subjects.filter((s) => s.isConfigured).length,
      overallInternalMarks,
      lastModified: new Date().toLocaleString(),
      modifiedBy: 'Current User',
      version: currentVersion + 1,
      subjects: subjects.map((s) => ({ ...s, isLocked: s.criteria.length > 0 }))
    };

    setClassConfigurations((prev) => {
      const exists = prev.find((c) => c.id === configId);
      if (exists) {
        return prev.map((c) => c.id === configId ? updatedConfig : c);
      }
      return [...prev, updatedConfig];
    });

    setConfigStatus('active');
    setSubjects((prev) => prev.map((s) => ({
      ...s,
      isLocked: s.criteria.length > 0
    })));
    setCurrentVersion((prev) => prev + 1);
    setVersionHistory((prev) => [...prev, {
      version: currentVersion + 1,
      modifiedBy: 'Current User',
      modifiedAt: new Date().toLocaleString(),
      changeNotes: changeNotes || 'Configuration activated',
      status: 'active'
    }]);
    setChangeNotes('');
    setIsSaving(false);
    setErrors({});
  };

  // Deactivate
  const handleDeactivate = () => {
    setConfigStatus('inactive');
    setSubjects((prev) => prev.map((s) => ({ ...s, isLocked: false })));
  };

  // Statistics
  const stats = useMemo(() => {
    const total = subjects.length;
    const selected = subjects.filter((s) => s.isSelected).length;
    const configured = subjects.filter((s) => s.isConfigured).length;
    const customized = subjects.filter((s) => s.useCustomConfig).length;
    const locked = subjects.filter((s) => s.isLocked).length;
    const bulkPercentage = bulkCriteria.reduce((sum, c) => sum + c.percentage, 0);

    return { total, selected, configured, customized, locked, bulkPercentage };
  }, [subjects, bulkCriteria]);

  // Get status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'draft':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Edit3 };
      case 'inactive':
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: PowerOff };
      case 'not_configured':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Info };
    }
  };

  // ============================================
  // Dashboard View
  // ============================================
  if (viewMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 rounded-xl">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Internal Marking Configurations</h1>
                <p className="text-sm text-gray-500">View and manage internal assessment setups for all classes</p>
              </div>
            </div>

            <button
              onClick={createNewConfiguration}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">

              <Plus className="w-4 h-4 mr-2" />
              New Configuration
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <Layers className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{dashboardStats.total}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">Total Classes</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">{dashboardStats.active}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">Active</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <Edit3 className="w-6 h-6 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">{dashboardStats.draft}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">Draft</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <PowerOff className="w-6 h-6 text-gray-600" />
              <span className="text-2xl font-bold text-gray-700">{dashboardStats.inactive}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">Inactive</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <span className="text-2xl font-bold text-red-700">{dashboardStats.notConfigured}</span>
            </div>
            <p className="text-sm font-medium text-gray-600 mt-2">Not Configured</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search class..."
                  value={dashboardSearch}
                  onChange={(e) => setDashboardSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-48 focus:ring-2 focus:ring-emerald-500 outline-none" />

              </div>

              <select
                value={dashboardAcademicYear}
                onChange={(e) => setDashboardAcademicYear(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">

                {academicYears.map((year) =>
                <option key={year} value={year}>{year}</option>
                )}
              </select>

              <select
                value={dashboardBoard}
                onChange={(e) => setDashboardBoard(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">

                <option value="">All Boards</option>
                {boards.map((b) =>
                <option key={b} value={b}>{b}</option>
                )}
              </select>

              <select
                value={dashboardStatus}
                onChange={(e) => setDashboardStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none">

                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
                <option value="not_configured">Not Configured</option>
              </select>

              {(dashboardSearch || dashboardBoard || dashboardStatus) &&
              <button
                onClick={() => {
                  setDashboardSearch('');
                  setDashboardBoard('');
                  setDashboardStatus('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">

                  <X className="w-4 h-4" />
                  Clear
                </button>
              }
            </div>
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredConfigurations.map((config) => {
            const statusStyle = getStatusBadge(config.status);
            const StatusIcon = statusStyle.icon;
            const progressPercent = config.totalSubjects > 0 ?
            Math.round(config.configuredSubjects / config.totalSubjects * 100) :
            0;

            return (
              <div key={config.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Card Header */}
                <div className={`p-4 ${
                config.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                config.status === 'draft' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                config.status === 'inactive' ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                'bg-gradient-to-r from-red-400 to-red-500'}`
                }>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Class {config.standard}{config.section ? `-${config.section}` : ''}
                        </h3>
                        <p className="text-sm text-white/80">{config.board}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.status === 'not_configured' ? 'Not Set' : config.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Configuration Progress</span>
                      <span className="font-medium">{progressPercent}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                        progressPercent === 100 ? 'bg-green-500' :
                        progressPercent > 0 ? 'bg-blue-500' : 'bg-gray-300'}`
                        }
                        style={{ width: `${progressPercent}%` }} />

                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Subjects</p>
                      <p className="text-lg font-bold text-gray-900">
                        {config.configuredSubjects}/{config.totalSubjects}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-500">Internal Marks</p>
                      <p className="text-lg font-bold text-emerald-600">{config.overallInternalMarks}</p>
                    </div>
                  </div>

                  {/* Meta Info */}
                  {config.lastModified &&
                  <div className="text-xs text-gray-500 mb-4">
                      <p>Modified: {config.lastModified}</p>
                      <p>By: {config.modifiedBy}</p>
                      {config.version > 0 && <p>Version: v{config.version}</p>}
                    </div>
                  }

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => viewConfigurationDetails(config)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">

                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => openConfiguration(config)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">

                      <Edit className="w-4 h-4 mr-1" />
                      {config.status === 'not_configured' ? 'Setup' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>);

          })}

          {filteredConfigurations.length === 0 &&
          <div className="col-span-full text-center py-12">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No configurations found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
            </div>
          }
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Dashboard Overview</p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• All subjects in a class share the same overall internal marks</li>
                <li>• Click "View" to see detailed configuration for any class</li>
                <li>• Click "Edit" or "Setup" to modify or create configurations</li>
                <li>• The criteria percentage distribution applies uniformly to all subjects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* View Configuration Modal */}
        {showViewModal && viewingConfig &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
              <div className={`p-4 ${
            viewingConfig.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
            viewingConfig.status === 'draft' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
            'bg-gradient-to-r from-gray-500 to-gray-600'} flex items-center justify-between`
            }>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Class {viewingConfig.standard}{viewingConfig.section ? `-${viewingConfig.section}` : ''} Configuration
                  </h3>
                  <p className="text-sm text-white/80">{viewingConfig.board} • {viewingConfig.academicYear}</p>
                </div>
                <button onClick={() => setShowViewModal(false)} className="text-white hover:bg-white/20 p-2 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Overview */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(viewingConfig.status).bg} ${getStatusBadge(viewingConfig.status).text}`}>
                      {viewingConfig.status}
                    </span>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Subjects</p>
                    <p className="text-xl font-bold text-gray-900">{viewingConfig.configuredSubjects}/{viewingConfig.totalSubjects}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Internal Marks (per subject)</p>
                    <p className="text-xl font-bold text-emerald-600">{viewingConfig.overallInternalMarks}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-500">Version</p>
                    <p className="text-xl font-bold text-gray-900">v{viewingConfig.version}</p>
                  </div>
                </div>

                {/* Subjects */}
                {viewingConfig.subjects.length > 0 ?
              <div className="space-y-4">
                    <h4 className="font-bold text-gray-900">Subject Configurations</h4>
                    {viewingConfig.subjects.map((subject) =>
                <div key={subject.subjectId} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-emerald-600" />
                            <div>
                              <h5 className="font-semibold">{subject.subjectName}</h5>
                              <p className="text-xs text-gray-500">{subject.subjectCode} • {subject.subjectType}</p>
                            </div>
                            {subject.useCustomConfig &&
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                Custom
                              </span>
                      }
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-emerald-600">{viewingConfig.overallInternalMarks}</p>
                            <p className="text-xs text-gray-500">marks</p>
                          </div>
                        </div>
                        {subject.criteria.length > 0 &&
                  <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {subject.criteria.map((c) =>
                      <span key={c.id} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm">
                                  {c.name}: <strong className="ml-1">{c.maxMarks}</strong>
                                </span>
                      )}
                            </div>
                          </div>
                  }
                      </div>
                )}
                  </div> :

              <div className="text-center py-8 text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No detailed configuration available</p>
                    <p className="text-sm">Click Edit to configure this class</p>
                  </div>
              }

                {/* Meta */}
                {viewingConfig.lastModified &&
              <div className="mt-6 pt-4 border-t text-sm text-gray-500">
                    <p>Last Modified: {viewingConfig.lastModified}</p>
                    <p>Modified By: {viewingConfig.modifiedBy}</p>
                  </div>
              }
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">

                  Close
                </button>
                <button
                onClick={() => {
                  setShowViewModal(false);
                  openConfiguration(viewingConfig);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">

                  <Edit className="w-4 h-4 mr-2 inline" />
                  Edit Configuration
                </button>
              </div>
            </div>
          </div>
        }
      </div>);

  }

  // ============================================
  // Configuration View
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={backToDashboard}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors">

              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="p-3 bg-emerald-600 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedConfig ? `Edit Configuration - Class ${standard}${section ? `-${section}` : ''}` : 'New Configuration'}
              </h1>
              <p className="text-sm text-gray-500">Configure internal assessment criteria for all subjects</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {configStatus === 'active' &&
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </span>
            }
            {configStatus === 'draft' &&
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                <Edit3 className="w-4 h-4 mr-1" />
                Draft
              </span>
            }
            <button
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">

              <History className="w-4 h-4 mr-2" />
              History
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">

              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Selection Panel */}
      <div className="bg-white rounded-xl border border-gray-200 mb-6">
        <div className="p-4 bg-emerald-600 rounded-t-xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Basic Selection
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Academic Year *</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                disabled={!!selectedConfig}>

                {academicYears.map((year) =>
                <option key={year} value={year}>{year}</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Board *</label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                disabled={!!selectedConfig}>

                <option value="">Select Board</option>
                {boards.map((b) =>
                <option key={b} value={b}>{b}</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Class *</label>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                disabled={!!selectedConfig}>

                <option value="">Select Class</option>
                {standards.map((s) =>
                <option key={s} value={s}>Class {s}</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Section (Optional)</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                disabled={!!selectedConfig}>

                <option value="">All Sections</option>
                {sections.map((s) =>
                <option key={s} value={s}>Section {s}</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {Object.keys(errors).length > 0 &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Validation Errors</h4>
              {Object.values(errors).map((error, idx) =>
            <p key={idx} className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            )}
            </div>
          </div>
        </div>
      }

      {standard && board &&
      <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <Layers className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Total Subjects</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <CheckSquare className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">{stats.selected}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Selected</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-700">{stats.configured}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Configured</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <Edit3 className="w-6 h-6 text-orange-600" />
                <span className="text-2xl font-bold text-orange-700">{stats.customized}</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Customized</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <Percent className="w-6 h-6 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-700">{stats.bulkPercentage}%</span>
              </div>
              <p className="text-sm font-medium text-gray-600 mt-2">Bulk Allocated</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Bulk Criteria Configuration */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-emerald-600" />
                  Bulk Criteria Template
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Define criteria once, apply to all selected subjects based on percentage
                </p>
              </div>

              <div className="p-4">
                {/* Overall Internal Marks Input */}
                <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-bold text-emerald-800 block">
                        Overall Internal Marks (for all subjects)
                      </label>
                      <p className="text-xs text-emerald-600 mt-1">
                        This value applies uniformly to every subject in the class
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                      type="number"
                      value={overallInternalMarks}
                      onChange={(e) => setOverallInternalMarks(parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-2 text-center text-xl font-bold border-2 border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                      min="1" />

                      <span className="text-sm font-medium text-emerald-700">marks</span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Total Allocation</span>
                    <span className={`text-sm font-bold ${
                  stats.bulkPercentage === 100 ? 'text-green-600' :
                  stats.bulkPercentage > 100 ? 'text-red-600' : 'text-yellow-600'}`
                  }>
                      {stats.bulkPercentage}% / 100%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full transition-all ${
                    stats.bulkPercentage === 100 ? 'bg-green-500' :
                    stats.bulkPercentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`
                    }
                    style={{ width: `${Math.min(stats.bulkPercentage, 100)}%` }} />

                  </div>
                  {stats.bulkPercentage === 100 &&
                <div className="mt-2 text-xs text-gray-500">
                      Each criterion will be: {bulkCriteria.map((c) => `${c.name} (${calculateMarksFromPercentage(c.percentage, overallInternalMarks)} marks)`).join(', ')}
                    </div>
                }
                </div>

                {/* Bulk Criteria List */}
                {bulkCriteria.length > 0 &&
              <div className="space-y-2 mb-4">
                    {bulkCriteria.map((criterion, index) => {
                  const IconComp = criterion.icon ? getIconComponent(criterion.icon) : ClipboardList;
                  const calculatedMarks = calculateMarksFromPercentage(criterion.percentage, overallInternalMarks);
                  return (
                    <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                              {index + 1}
                            </span>
                            <IconComp className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{criterion.name}</p>
                              {criterion.description &&
                          <p className="text-xs text-gray-500">{criterion.description}</p>
                          }
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="flex items-center gap-2">
                                <input
                              type="number"
                              value={criterion.percentage}
                              onChange={(e) => handleUpdateBulkCriterion(criterion.id, { percentage: parseInt(e.target.value) || 0 })}
                              className="w-16 px-2 py-1 text-center border border-gray-300 rounded-lg"
                              min="0"
                              max="100" />

                                <span className="text-sm text-gray-500">%</span>
                              </div>
                              <p className="text-xs text-emerald-600 mt-1">= {calculatedMarks} marks</p>
                            </div>
                            <button
                          onClick={() => handleDeleteBulkCriterion(criterion.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded">

                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>);

                })}
                  </div>
              }

                {bulkCriteria.length === 0 &&
              <div className="text-center py-8 mb-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500">No criteria defined</p>
                    <p className="text-xs text-gray-400">Add criteria below to create a template</p>
                  </div>
              }

                {/* Add Criterion Form */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Add Criterion</h4>
                    <button
                    onClick={() => setShowCriteriaSelector(!showCriteriaSelector)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">

                      <Sparkles className="w-4 h-4" />
                      Quick Select
                    </button>
                  </div>

                  {showCriteriaSelector &&
                <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {predefinedCriteria.map((pc) =>
                    <button
                      key={pc.name}
                      onClick={() => handleSelectPredefined(pc)}
                      className="inline-flex items-center px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50">

                            {React.createElement(getIconComponent(pc.icon), { className: 'w-3 h-3 mr-1' })}
                            {pc.name} ({pc.defaultPercentage}%)
                          </button>
                    )}
                      </div>
                    </div>
                }

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <input
                      type="text"
                      value={newCriterion.name}
                      onChange={(e) => setNewCriterion((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Criterion name"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm" />

                    </div>
                    <div className="flex items-center gap-2">
                      <input
                      type="number"
                      value={newCriterion.percentage || ''}
                      onChange={(e) => setNewCriterion((prev) => ({ ...prev, percentage: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      className="w-full rounded-lg border border-gray-300 p-2 text-sm text-center"
                      min="0"
                      max="100" />

                      <span className="text-sm text-gray-500">%</span>
                    </div>
                    <button
                    onClick={handleAddBulkCriterion}
                    disabled={!newCriterion.name || newCriterion.percentage <= 0}
                    className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed">

                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </button>
                  </div>

                  <input
                  type="text"
                  value={newCriterion.description}
                  onChange={(e) => setNewCriterion((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description (optional)"
                  className="w-full mt-3 rounded-lg border border-gray-300 p-2 text-sm" />

                </div>

                {/* Apply Button */}
                <button
                onClick={applyBulkCriteriaToSubjects}
                disabled={bulkCriteria.length === 0 || stats.bulkPercentage !== 100 || overallInternalMarks <= 0}
                className="w-full mt-4 inline-flex items-center justify-center px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed">

                  <Zap className="w-5 h-5 mr-2" />
                  Apply to {stats.selected} Selected Subjects ({overallInternalMarks} marks each)
                </button>
              </div>
            </div>

            {/* Subjects List */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    Subjects
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.selected} of {stats.total} selected • {overallInternalMarks} marks per subject
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                  onClick={() => toggleSelectAll(true)}
                  className="text-xs text-blue-600 hover:text-blue-700">

                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                  onClick={() => toggleSelectAll(false)}
                  className="text-xs text-gray-600 hover:text-gray-700">

                    Deselect All
                  </button>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-100">
                {subjects.map((subject) => {
                const criteriaTotal = subject.criteria.reduce((sum, c) => sum + c.maxMarks, 0);
                const isComplete = criteriaTotal === overallInternalMarks && subject.criteria.length > 0;

                return (
                  <div key={subject.subjectId} className={`p-4 ${subject.isLocked ? 'bg-gray-50 opacity-75' : ''}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button
                          onClick={() => toggleSubjectSelection(subject.subjectId)}
                          disabled={subject.isLocked}
                          className="mt-1">

                            {subject.isSelected ?
                          <CheckSquare className="w-5 h-5 text-emerald-600" /> :

                          <Square className="w-5 h-5 text-gray-400" />
                          }
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{subject.subjectName}</h4>
                              {subject.isLocked && <Lock className="w-3 h-3 text-gray-400" />}
                              {subject.useCustomConfig &&
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                  Custom
                                </span>
                            }
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 font-mono">{subject.subjectCode}</span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            subject.subjectType === 'core' ? 'bg-blue-100 text-blue-800' :
                            subject.subjectType === 'elective' ? 'bg-purple-100 text-purple-800' :
                            subject.subjectType === 'language' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'}`
                            }>
                                {subject.subjectType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-600">{overallInternalMarks}</div>
                            <p className="text-xs text-gray-500">internal marks</p>
                            {subject.criteria.length > 0 &&
                          <span className={`text-xs ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                                {criteriaTotal}/{overallInternalMarks} allocated
                              </span>
                          }
                          </div>

                          {isComplete ?
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Done
                            </span> :
                        subject.criteria.length > 0 ?
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Partial
                            </span> :

                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              Pending
                            </span>
                        }
                        </div>
                      </div>

                      {/* Subject Criteria Preview */}
                      {subject.criteria.length > 0 &&
                    <div className="mt-3 ml-8">
                          <div className="flex flex-wrap gap-2">
                            {subject.criteria.map((c) =>
                        <span key={c.id} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                                {c.name}: <strong className="ml-1">{c.maxMarks}</strong>
                              </span>
                        )}
                          </div>
                        </div>
                    }

                      {/* Subject Actions */}
                      {!subject.isLocked &&
                    <div className="mt-3 ml-8 flex items-center gap-2">
                          <button
                        onClick={() => openSubjectEditor(subject)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">

                            <Edit className="w-3 h-3" />
                            {subject.useCustomConfig ? 'Edit Custom Config' : 'Customize'}
                          </button>
                          {subject.useCustomConfig && bulkCriteria.length > 0 &&
                      <>
                              <span className="text-gray-300">|</span>
                              <button
                          onClick={() => resetSubjectToBulk(subject.subjectId)}
                          className="text-xs text-gray-600 hover:text-gray-700 flex items-center gap-1">

                                <RotateCcw className="w-3 h-3" />
                                Reset to Bulk
                              </button>
                            </>
                      }
                        </div>
                    }
                    </div>);

              })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border border-gray-200 mt-6 p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 block mb-2">Change Notes</label>
                <input
                type="text"
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                placeholder="Describe changes made..."
                className="w-full rounded-lg border border-gray-300 p-2.5" />

              </div>
              <div className="flex items-center gap-3">
                <button
                onClick={backToDashboard}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50">

                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
                {configStatus === 'active' &&
              <button
                onClick={handleDeactivate}
                className="inline-flex items-center px-4 py-2 border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50">

                    <Unlock className="w-4 h-4 mr-2" />
                    Unlock
                  </button>
              }
                <button
                onClick={handleSaveAsDraft}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">

                  {isSaving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Draft
                </button>
                <button
                onClick={handleActivate}
                disabled={isSaving || stats.configured === 0}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">

                  <CheckCircle className="w-4 h-4 mr-2" />
                  Activate
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
              <span>Version: v{currentVersion}</span>
              <span>Overall Internal Marks: {overallInternalMarks} per subject</span>
              <span>Status: {configStatus.charAt(0).toUpperCase() + configStatus.slice(1)}</span>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Bulk Configuration Guidelines</p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• <strong>Overall Internal Marks</strong> applies uniformly to ALL subjects in this class</li>
                  <li>• Define criteria percentages that total 100%</li>
                  <li>• Marks are auto-calculated based on the overall internal marks value</li>
                  <li>• Customize individual subjects if you need different criteria distribution (but same total marks)</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      }

      {/* Subject Editor Modal */}
      {showSubjectEditor && editingSubject &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-emerald-600 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{editingSubject.subjectName}</h3>
                <p className="text-sm text-emerald-100">Custom Internal Marking Configuration</p>
              </div>
              <button onClick={() => setShowSubjectEditor(false)} className="text-white hover:bg-white/20 p-2 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Marks Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Overall Internal Marks</p>
                  <p className="text-2xl font-bold text-emerald-600">{overallInternalMarks}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Allocated</p>
                  <p className={`text-2xl font-bold ${
                editingSubject.criteria.reduce((s, c) => s + c.maxMarks, 0) === overallInternalMarks ?
                'text-green-600' :
                'text-yellow-600'}`
                }>
                    {editingSubject.criteria.reduce((s, c) => s + c.maxMarks, 0)}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Remaining</p>
                  <p className={`text-2xl font-bold ${
                overallInternalMarks - editingSubject.criteria.reduce((s, c) => s + c.maxMarks, 0) === 0 ?
                'text-green-600' :
                'text-yellow-600'}`
                }>
                    {overallInternalMarks - editingSubject.criteria.reduce((s, c) => s + c.maxMarks, 0)}
                  </p>
                </div>
              </div>

              {/* Criteria List */}
              {editingSubject.criteria.length > 0 &&
            <div className="space-y-2 mb-4">
                  {editingSubject.criteria.map((criterion, index) =>
              <div key={criterion.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600">
                          {index + 1}
                        </span>
                        <input
                    type="text"
                    value={criterion.name}
                    onChange={(e) => updateCriterionInSubject(criterion.id, { name: e.target.value })}
                    className="border-0 bg-transparent font-medium focus:outline-none" />

                      </div>
                      <div className="flex items-center gap-3">
                        <input
                    type="number"
                    value={criterion.maxMarks}
                    onChange={(e) => updateCriterionInSubject(criterion.id, { maxMarks: parseInt(e.target.value) || 0 })}
                    className="w-16 px-2 py-1 text-center border rounded"
                    min="0" />

                        <button
                    onClick={() => deleteCriterionFromSubject(criterion.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
              )}
                </div>
            }

              {/* Add Criterion */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex gap-3">
                  <input
                  type="text"
                  placeholder="Criterion name"
                  id="subjectCriterionName"
                  className="flex-1 rounded-lg border border-gray-300 p-2 text-sm" />

                  <input
                  type="number"
                  placeholder="Marks"
                  id="subjectCriterionMarks"
                  className="w-20 rounded-lg border border-gray-300 p-2 text-sm text-center"
                  min="0" />

                  <button
                  onClick={() => {
                    const nameInput = document.getElementById('subjectCriterionName') as HTMLInputElement;
                    const marksInput = document.getElementById('subjectCriterionMarks') as HTMLInputElement;
                    if (nameInput.value && marksInput.value) {
                      addCriterionToSubject(nameInput.value, parseInt(marksInput.value), '', '');
                      nameInput.value = '';
                      marksInput.value = '';
                    }
                  }}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">

                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {errors.subject &&
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{errors.subject}</p>
                </div>
            }
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
              onClick={() => setShowSubjectEditor(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">

                Cancel
              </button>
              <button
              onClick={saveSubjectConfig}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">

                <Check className="w-4 h-4 mr-2 inline" />
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreview &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 bg-purple-600 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Configuration Preview
              </h3>
              <button onClick={() => setShowPreview(false)} className="text-white hover:bg-white/20 p-2 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div>
                  <p className="text-xs text-gray-500">Academic Year</p>
                  <p className="font-semibold">{academicYear}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Board</p>
                  <p className="font-semibold">{board}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="font-semibold">Class {standard}{section ? `-${section}` : ''}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Internal Marks (per subject)</p>
                  <p className="font-semibold text-emerald-600">{overallInternalMarks}</p>
                </div>
              </div>

              <div className="space-y-4">
                {subjects.filter((s) => s.criteria.length > 0).map((subject) =>
              <div key={subject.subjectId} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-emerald-600" />
                        <div>
                          <h4 className="font-bold">{subject.subjectName}</h4>
                          <p className="text-xs text-gray-500">{subject.subjectCode}</p>
                        </div>
                        {subject.useCustomConfig &&
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Custom
                          </span>
                    }
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-emerald-600">{overallInternalMarks}</p>
                        <p className="text-xs text-gray-500">Total Marks</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="text-xs text-gray-500 border-b">
                            <th className="text-left pb-2">Criterion</th>
                            <th className="text-right pb-2">Marks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subject.criteria.map((c) =>
                      <tr key={c.id} className="border-b border-gray-100">
                              <td className="py-2">{c.name}</td>
                              <td className="py-2 text-right font-medium">{c.maxMarks}</td>
                            </tr>
                      )}
                          <tr className="bg-emerald-50">
                            <td className="py-2 font-bold">Total</td>
                            <td className="py-2 text-right font-bold text-emerald-600">
                              {subject.criteria.reduce((s, c) => s + c.maxMarks, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
              )}

                {subjects.filter((s) => s.criteria.length > 0).length === 0 &&
              <div className="text-center py-12 text-gray-500">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No subjects configured yet</p>
                  </div>
              }
              </div>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistory &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div className="p-4 bg-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5" />
                Version History
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-white hover:bg-white/20 p-2 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {versionHistory.length === 0 ?
            <div className="text-center py-12 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No version history</p>
                </div> :

            <div className="space-y-3">
                  {versionHistory.map((v, idx) =>
              <div key={idx} className={`p-4 rounded-lg border ${
              v.version === currentVersion ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`
              }>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    v.status === 'active' ? 'bg-green-100 text-green-800' :
                    v.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`
                    }>
                            v{v.version}
                          </span>
                          {v.version === currentVersion &&
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Current
                            </span>
                    }
                        </div>
                        <span className="text-xs text-gray-500">{v.modifiedAt}</span>
                      </div>
                      <p className="text-sm text-gray-700">{v.changeNotes}</p>
                      <p className="text-xs text-gray-500 mt-1">By: {v.modifiedBy}</p>
                    </div>
              )}
                </div>
            }
            </div>
          </div>
        </div>
      }
    </div>);

}

export default BulkInternalMarkingSetup;