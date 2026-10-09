import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Edit3,
  Copy,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Info,
  Settings,
  Calculator,
  Percent,
  Hash,
  Layers,
  RefreshCw,
  X,
  Check,
  Clock,
  Archive,
  Target,
  History,
  ArrowRight,
  Sparkles,
  Lock,
  Unlock,
  Zap,
  Filter,
  Search,
  PlayCircle,
  PauseCircle,
  FileText,
  Award,
  BookOpen,
  GraduationCap,
  Building2,
  Calendar,
  Users,
  User,
  Activity,
  BarChart3,
  AlertTriangle,
  HelpCircle,
  Link,
  Unlink,
  Grip,
  MoreVertical,
  Star,
  Heart,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
  Handshake,
  Trophy,
  Medal,
  Brain,
  Palette,
  Music,
  Dumbbell,
  Presentation,
  ListChecks,
  ClipboardList,
  ClipboardCheck,
  FileCheck,
  Smile,
  Frown,
  Meh,
  Shield,
  Flag,
  Bookmark,
  Tag,
  Folder,
  FolderOpen,
  LayoutList,
  List,
  Grid3X3,
  Table2,
  PieChart,
  TrendingUp,
  Gauge,
  CircleDot,
  Square,
  Circle,
  CheckSquare,
  XSquare,
  MinusSquare,
  PlusSquare,
  SquareStack,
  Boxes,
  Package,
  Briefcase,
  Crown,
  Gem,
  Flame,
  Rocket,
  Wand2,
  Sparkle,
  Sun,
  Moon,
  Cloud,
  Wind,
  Droplet } from
'lucide-react';

// ============================================
// Types
// ============================================

type ListStatus = 'Draft' | 'Active' | 'Archived';

interface EvaluationItem {
  id: string;
  name: string;
  maxMarks: number;
  description: string;
  order: number;
}

interface EvaluationList {
  id: string;
  name: string;
  description: string;
  totalMarks: number;
  autoCalculate: boolean;
  items: EvaluationItem[];
  linkedSubjects: string[];
  isSubjectLinked: boolean;
  status: ListStatus;
  isLocked: boolean;
  isExpanded: boolean;
}

interface ClassEvaluationConfig {
  id: string;
  academicYear: string;
  board: string;
  classId: string;
  className: string;
  section: string;
  evaluationLists: EvaluationList[];
  status: ListStatus;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  version: string;
}

interface VersionHistory {
  version: string;
  modifiedBy: string;
  modifiedAt: string;
  changeNotes: string;
  isActive: boolean;
}

interface EvaluationTemplate {
  id: string;
  name: string;
  icon: React.ElementType;
  suggestedMarks: number;
  description: string;
  category: string;
}

// ============================================
// Mock Data
// ============================================

const academicYears = ['2024-25', '2025-26', '2026-27'];
const boards = [
{ id: 'cbse', name: 'CBSE' },
{ id: 'icse', name: 'ICSE' },
{ id: 'gseb', name: 'GSEB' },
{ id: 'state', name: 'State Board' }];

const classes = [
{ id: '1', name: 'Class I' },
{ id: '2', name: 'Class II' },
{ id: '3', name: 'Class III' },
{ id: '4', name: 'Class IV' },
{ id: '5', name: 'Class V' },
{ id: '6', name: 'Class VI' },
{ id: '7', name: 'Class VII' },
{ id: '8', name: 'Class VIII' },
{ id: '9', name: 'Class IX' },
{ id: '10', name: 'Class X' },
{ id: '11', name: 'Class XI' },
{ id: '12', name: 'Class XII' }];

const sections = ['A', 'B', 'C', 'D'];

const subjects = [
{ id: 'math', name: 'Mathematics' },
{ id: 'science', name: 'Science' },
{ id: 'english', name: 'English' },
{ id: 'hindi', name: 'Hindi' },
{ id: 'sst', name: 'Social Studies' },
{ id: 'cs', name: 'Computer Science' },
{ id: 'art', name: 'Art & Craft' },
{ id: 'pe', name: 'Physical Education' },
{ id: 'music', name: 'Music' }];


const evaluationTemplates: EvaluationTemplate[] = [
{ id: 't1', name: 'Discipline', icon: Shield, suggestedMarks: 10, description: 'Following rules and maintaining order', category: 'Behavior' },
{ id: 't2', name: 'Communication Skills', icon: MessageSquare, suggestedMarks: 10, description: 'Verbal and written communication ability', category: 'Skills' },
{ id: 't3', name: 'Leadership', icon: Crown, suggestedMarks: 10, description: 'Leading and guiding peers', category: 'Skills' },
{ id: 't4', name: 'Creativity', icon: Lightbulb, suggestedMarks: 10, description: 'Innovative thinking and ideas', category: 'Skills' },
{ id: 't5', name: 'Teamwork', icon: Handshake, suggestedMarks: 10, description: 'Collaboration with peers', category: 'Behavior' },
{ id: 't6', name: 'Presentation Skills', icon: Presentation, suggestedMarks: 10, description: 'Presenting ideas effectively', category: 'Skills' },
{ id: 't7', name: 'Attendance & Punctuality', icon: Clock, suggestedMarks: 10, description: 'Regular attendance and being on time', category: 'Conduct' },
{ id: 't8', name: 'Participation', icon: Activity, suggestedMarks: 10, description: 'Active class participation', category: 'Behavior' },
{ id: 't9', name: 'Homework Completion', icon: ClipboardCheck, suggestedMarks: 10, description: 'Regular homework submission', category: 'Academic' },
{ id: 't10', name: 'Respect for Others', icon: Heart, suggestedMarks: 10, description: 'Showing respect to teachers and peers', category: 'Behavior' },
{ id: 't11', name: 'Problem Solving', icon: Brain, suggestedMarks: 10, description: 'Analytical and problem-solving ability', category: 'Skills' },
{ id: 't12', name: 'Sports Performance', icon: Trophy, suggestedMarks: 10, description: 'Physical activities and sports', category: 'Physical' },
{ id: 't13', name: 'Art & Craft Skills', icon: Palette, suggestedMarks: 10, description: 'Artistic abilities', category: 'Co-curricular' },
{ id: 't14', name: 'Music & Dance', icon: Music, suggestedMarks: 10, description: 'Musical and dance abilities', category: 'Co-curricular' },
{ id: 't15', name: 'Initiative', icon: Rocket, suggestedMarks: 10, description: 'Taking initiative and self-motivation', category: 'Behavior' }];


const listTemplates = [
{ name: 'Co-Scholastic Evaluation', description: 'Assessment of skills beyond academics', suggestedMarks: 50 },
{ name: 'Skill Assessment', description: 'Evaluation of various life skills', suggestedMarks: 40 },
{ name: 'Behavior Evaluation', description: 'Assessment of conduct and behavior', suggestedMarks: 30 },
{ name: 'Continuous Assessment', description: 'Ongoing performance evaluation', suggestedMarks: 30 },
{ name: 'Activity Participation', description: 'Participation in co-curricular activities', suggestedMarks: 20 },
{ name: 'Discipline & Conduct', description: 'Discipline and classroom conduct', suggestedMarks: 20 }];


const mockEvaluationLists: EvaluationList[] = [
{
  id: 'list1',
  name: 'Co-Scholastic Evaluation',
  description: 'Assessment of skills beyond academics',
  totalMarks: 50,
  autoCalculate: true,
  items: [
  { id: 'i1', name: 'Discipline', maxMarks: 10, description: 'Following rules', order: 1 },
  { id: 'i2', name: 'Communication Skills', maxMarks: 10, description: 'Verbal communication', order: 2 },
  { id: 'i3', name: 'Creativity', maxMarks: 10, description: 'Innovative thinking', order: 3 },
  { id: 'i4', name: 'Teamwork', maxMarks: 10, description: 'Collaboration', order: 4 },
  { id: 'i5', name: 'Attendance & Conduct', maxMarks: 10, description: 'Regular presence', order: 5 }],

  linkedSubjects: [],
  isSubjectLinked: false,
  status: 'Active',
  isLocked: false,
  isExpanded: true
},
{
  id: 'list2',
  name: 'Skill Assessment',
  description: 'Evaluation of various life skills',
  totalMarks: 40,
  autoCalculate: true,
  items: [
  { id: 'i6', name: 'Problem Solving', maxMarks: 10, description: 'Analytical skills', order: 1 },
  { id: 'i7', name: 'Leadership', maxMarks: 10, description: 'Leading abilities', order: 2 },
  { id: 'i8', name: 'Presentation Skills', maxMarks: 10, description: 'Presenting ideas', order: 3 },
  { id: 'i9', name: 'Initiative', maxMarks: 10, description: 'Self-motivation', order: 4 }],

  linkedSubjects: [],
  isSubjectLinked: false,
  status: 'Active',
  isLocked: false,
  isExpanded: false
}];


const mockVersionHistory: VersionHistory[] = [
{ version: '1.0', modifiedBy: 'Admin User', modifiedAt: '2024-01-15', changeNotes: 'Initial configuration', isActive: false },
{ version: '1.1', modifiedBy: 'Coordinator', modifiedAt: '2024-02-10', changeNotes: 'Added Skill Assessment list', isActive: false },
{ version: '2.0', modifiedBy: 'Principal', modifiedAt: '2024-03-01', changeNotes: 'Updated marks distribution', isActive: true }];


// ============================================
// Utility Functions
// ============================================

const generateId = () => Math.random().toString(36).substring(2, 11);

const getStatusColor = (status: ListStatus) => {
  switch (status) {
    case 'Active':return 'success';
    case 'Draft':return 'warning';
    case 'Archived':return 'default';
    default:return 'default';
  }
};

const getStatusIcon = (status: ListStatus) => {
  switch (status) {
    case 'Active':return CheckCircle2;
    case 'Draft':return Clock;
    case 'Archived':return Archive;
    default:return Circle;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Behavior':return 'bg-blue-100 text-blue-800';
    case 'Skills':return 'bg-green-100 text-green-800';
    case 'Conduct':return 'bg-purple-100 text-purple-800';
    case 'Academic':return 'bg-yellow-100 text-yellow-800';
    case 'Physical':return 'bg-orange-100 text-orange-800';
    case 'Co-curricular':return 'bg-pink-100 text-pink-800';
    default:return 'bg-gray-100 text-gray-800';
  }
};

// ============================================
// Sub Components
// ============================================

const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>;


const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };

  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}>

      {children}
    </button>);

};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>);

};

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: {value: string;label: string;}[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
}> = ({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false, label }) =>
<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}>

      <option value="">{placeholder}</option>
      {options.map((opt) =>
    <option key={opt.value} value={opt.value}>{opt.label}</option>
    )}
    </select>
  </div>;


const Input: React.FC<{
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  min?: number;
  max?: number;
}> = ({ value, onChange, placeholder, type = 'text', className = '', disabled = false, label, error, min, max }) =>
<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    min={min}
    max={max}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${error ? 'border-red-500' : 'border-gray-300'} ${className}`} />

    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>;


const TextArea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, className = '', disabled = false, label, rows = 2 }) =>
<div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${className}`} />

  </div>;


const Toggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled = false }) =>
<label className={`flex items-center gap-3 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
    <div
    onClick={() => !disabled && onChange(!checked)}
    className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>

      <div
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />

    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
  </label>;


// ============================================
// Main Component
// ============================================

export function EvaluationSetup() {
  // Selection state
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [board, setBoard] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [section, setSection] = useState('');

  // Data state
  const [evaluationLists, setEvaluationLists] = useState<EvaluationList[]>([]);
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>(mockVersionHistory);

  // UI state
  const [showAddListModal, setShowAddListModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [editingList, setEditingList] = useState<EvaluationList | null>(null);
  const [editingItem, setEditingItem] = useState<EvaluationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state for new list
  const [newList, setNewList] = useState({
    name: '',
    description: '',
    totalMarks: 50,
    autoCalculate: true,
    isSubjectLinked: false,
    linkedSubjects: [] as string[]
  });

  // Form state for new item
  const [newItem, setNewItem] = useState({
    name: '',
    maxMarks: 10,
    description: ''
  });

  // Load data when class is selected
  useEffect(() => {
    if (selectedClass && board) {
      // Load existing evaluation lists for this class
      setEvaluationLists(mockEvaluationLists);
    }
  }, [selectedClass, board]);

  // ============================================
  // Computed Values
  // ============================================

  const totalListsCount = evaluationLists.length;
  const activeListsCount = evaluationLists.filter((l) => l.status === 'Active').length;
  const totalItemsCount = evaluationLists.reduce((sum, l) => sum + l.items.length, 0);
  const grandTotalMarks = evaluationLists.reduce((sum, l) => sum + l.totalMarks, 0);

  const validationErrors = useMemo(() => {
    const errs: string[] = [];

    evaluationLists.forEach((list) => {
      const itemsTotal = list.items.reduce((sum, item) => sum + item.maxMarks, 0);
      if (list.autoCalculate && list.items.length > 0) {
        if (itemsTotal !== list.totalMarks) {
          errs.push(`${list.name}: Items total (${itemsTotal}) doesn't match list total (${list.totalMarks})`);
        }
      }
      if (list.items.length === 0) {
        errs.push(`${list.name}: No evaluation items defined`);
      }

      // Check for duplicate item names
      const itemNames = list.items.map((i) => i.name.toLowerCase());
      const duplicates = itemNames.filter((name, idx) => itemNames.indexOf(name) !== idx);
      if (duplicates.length > 0) {
        errs.push(`${list.name}: Duplicate item names found`);
      }
    });

    // Check for duplicate list names
    const listNames = evaluationLists.map((l) => l.name.toLowerCase());
    const duplicateLists = listNames.filter((name, idx) => listNames.indexOf(name) !== idx);
    if (duplicateLists.length > 0) {
      errs.push('Duplicate evaluation list names found');
    }

    return errs;
  }, [evaluationLists]);

  const getListItemsTotal = (list: EvaluationList) => {
    return list.items.reduce((sum, item) => sum + item.maxMarks, 0);
  };

  const getListRemainingMarks = (list: EvaluationList) => {
    return list.totalMarks - getListItemsTotal(list);
  };

  // ============================================
  // Handlers
  // ============================================

  const toggleListExpansion = (listId: string) => {
    setEvaluationLists((prev) => prev.map((list) =>
    list.id === listId ? { ...list, isExpanded: !list.isExpanded } : list
    ));
  };

  const handleAddList = () => {
    if (!newList.name.trim()) {
      setErrors({ listName: 'List name is required' });
      return;
    }

    // Check for duplicate names
    if (evaluationLists.some((l) => l.name.toLowerCase() === newList.name.toLowerCase())) {
      setErrors({ listName: 'A list with this name already exists' });
      return;
    }

    const list: EvaluationList = {
      id: generateId(),
      name: newList.name,
      description: newList.description,
      totalMarks: newList.totalMarks,
      autoCalculate: newList.autoCalculate,
      items: [],
      linkedSubjects: newList.linkedSubjects,
      isSubjectLinked: newList.isSubjectLinked,
      status: 'Draft',
      isLocked: false,
      isExpanded: true
    };

    setEvaluationLists((prev) => [...prev, list]);
    setNewList({
      name: '',
      description: '',
      totalMarks: 50,
      autoCalculate: true,
      isSubjectLinked: false,
      linkedSubjects: []
    });
    setShowAddListModal(false);
    setErrors({});
  };

  const handleUpdateList = (listId: string, updates: Partial<EvaluationList>) => {
    setEvaluationLists((prev) => prev.map((list) =>
    list.id === listId ? { ...list, ...updates } : list
    ));
  };

  const handleDeleteList = (listId: string) => {
    const list = evaluationLists.find((l) => l.id === listId);
    if (list?.isLocked) {
      alert('Cannot delete a locked list. It may be in use for result processing.');
      return;
    }

    if (confirm('Are you sure you want to delete this evaluation list?')) {
      setEvaluationLists((prev) => prev.filter((l) => l.id !== listId));
    }
  };

  const handleDuplicateList = (list: EvaluationList) => {
    const newListCopy: EvaluationList = {
      ...list,
      id: generateId(),
      name: `${list.name} (Copy)`,
      status: 'Draft',
      isLocked: false,
      items: list.items.map((item) => ({ ...item, id: generateId() }))
    };
    setEvaluationLists((prev) => [...prev, newListCopy]);
  };

  const handleOpenAddItem = (listId: string) => {
    setSelectedListId(listId);
    setNewItem({ name: '', maxMarks: 10, description: '' });
    setShowAddItemModal(true);
  };

  const handleAddItem = () => {
    if (!selectedListId) return;

    if (!newItem.name.trim()) {
      setErrors({ itemName: 'Item name is required' });
      return;
    }

    if (newItem.maxMarks <= 0) {
      setErrors({ itemMarks: 'Marks must be greater than 0' });
      return;
    }

    const list = evaluationLists.find((l) => l.id === selectedListId);
    if (!list) return;

    // Check for duplicate names within list
    if (list.items.some((i) => i.name.toLowerCase() === newItem.name.toLowerCase())) {
      setErrors({ itemName: 'An item with this name already exists in this list' });
      return;
    }

    // Check marks limit
    const currentTotal = getListItemsTotal(list);
    if (list.autoCalculate && currentTotal + newItem.maxMarks > list.totalMarks) {
      setErrors({ itemMarks: `Adding ${newItem.maxMarks} marks would exceed list total (${list.totalMarks}). Remaining: ${list.totalMarks - currentTotal}` });
      return;
    }

    const item: EvaluationItem = {
      id: generateId(),
      name: newItem.name,
      maxMarks: newItem.maxMarks,
      description: newItem.description,
      order: list.items.length + 1
    };

    setEvaluationLists((prev) => prev.map((l) =>
    l.id === selectedListId ? { ...l, items: [...l.items, item] } : l
    ));

    setNewItem({ name: '', maxMarks: 10, description: '' });
    setShowAddItemModal(false);
    setSelectedListId(null);
    setErrors({});
  };

  const handleUpdateItem = (listId: string, itemId: string, updates: Partial<EvaluationItem>) => {
    setEvaluationLists((prev) => prev.map((list) =>
    list.id === listId ?
    { ...list, items: list.items.map((item) => item.id === itemId ? { ...item, ...updates } : item) } :
    list
    ));
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    setEvaluationLists((prev) => prev.map((list) =>
    list.id === listId ?
    { ...list, items: list.items.filter((item) => item.id !== itemId) } :
    list
    ));
  };

  const handleAddTemplateItem = (listId: string, template: EvaluationTemplate) => {
    const list = evaluationLists.find((l) => l.id === listId);
    if (!list) return;

    // Check if item already exists
    if (list.items.some((i) => i.name.toLowerCase() === template.name.toLowerCase())) {
      alert('This item already exists in the list');
      return;
    }

    // Check marks limit
    const currentTotal = getListItemsTotal(list);
    if (list.autoCalculate && currentTotal + template.suggestedMarks > list.totalMarks) {
      alert(`Cannot add. Would exceed list total (${list.totalMarks}). Remaining: ${list.totalMarks - currentTotal}`);
      return;
    }

    const item: EvaluationItem = {
      id: generateId(),
      name: template.name,
      maxMarks: template.suggestedMarks,
      description: template.description,
      order: list.items.length + 1
    };

    setEvaluationLists((prev) => prev.map((l) =>
    l.id === listId ? { ...l, items: [...l.items, item] } : l
    ));
  };

  const handleApplyListTemplate = (template: typeof listTemplates[0]) => {
    setNewList((prev) => ({
      ...prev,
      name: template.name,
      description: template.description,
      totalMarks: template.suggestedMarks
    }));
  };

  const handleSaveAll = async () => {
    if (validationErrors.length > 0) {
      alert('Please fix all validation errors before saving.');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update version
    const newVersion: VersionHistory = {
      version: `${parseFloat(versionHistory[0]?.version || '1.0') + 0.1}`,
      modifiedBy: 'Current User',
      modifiedAt: new Date().toISOString().split('T')[0],
      changeNotes: 'Updated evaluation configuration',
      isActive: true
    };

    setVersionHistory((prev) => [
    newVersion,
    ...prev.map((v) => ({ ...v, isActive: false }))]
    );

    setIsSaving(false);
    alert('Configuration saved successfully!');
  };

  const handleActivateAll = () => {
    if (validationErrors.length > 0) {
      alert('Cannot activate. Please fix all validation errors.');
      return;
    }

    setEvaluationLists((prev) => prev.map((list) => ({ ...list, status: 'Active' })));
    alert('All evaluation lists activated!');
  };

  const handleChangeListStatus = (listId: string, status: ListStatus) => {
    setEvaluationLists((prev) => prev.map((list) =>
    list.id === listId ? { ...list, status } : list
    ));
  };

  // ============================================
  // Render Functions
  // ============================================

  const renderEvaluationList = (list: EvaluationList) => {
    const itemsTotal = getListItemsTotal(list);
    const remainingMarks = getListRemainingMarks(list);
    const isValid = !list.autoCalculate || itemsTotal === list.totalMarks || list.items.length === 0;
    const StatusIcon = getStatusIcon(list.status);

    return (
      <Card key={list.id} className={`overflow-hidden ${list.isLocked ? 'border-yellow-300 bg-yellow-50/30' : ''}`}>
        {/* List Header */}
        <div
          className={`p-4 cursor-pointer ${list.isExpanded ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gray-50'}`}
          onClick={() => toggleListExpansion(list.id)}>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              list.status === 'Active' ? 'bg-green-100' : list.status === 'Draft' ? 'bg-yellow-100' : 'bg-gray-100'}`
              }>
                <ClipboardList className={`w-5 h-5 ${
                list.status === 'Active' ? 'text-green-600' : list.status === 'Draft' ? 'text-yellow-600' : 'text-gray-500'}`
                } />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{list.name}</h3>
                  {list.isLocked && <Lock className="w-4 h-4 text-yellow-600" />}
                  {list.isSubjectLinked &&
                  <Badge variant="info">
                      <Link className="w-3 h-3 mr-1" />
                      Subject Linked
                    </Badge>
                  }
                </div>
                <p className="text-sm text-gray-500">{list.description || 'No description'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">{list.totalMarks}</p>
                  <span className="text-sm text-gray-500">Total Marks</span>
                </div>
                <p className="text-xs text-gray-400">{list.items.length} items</p>
              </div>
              
              <Badge variant={getStatusColor(list.status)}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {list.status}
              </Badge>
              
              {!isValid && <AlertCircle className="w-5 h-5 text-red-500" />}
              
              {list.isExpanded ?
              <ChevronUp className="w-5 h-5 text-gray-400" /> :

              <ChevronDown className="w-5 h-5 text-gray-400" />
              }
            </div>
          </div>
        </div>
        
        {/* List Content */}
        {list.isExpanded &&
        <div className="border-t">
            {/* Marks Progress */}
            <div className="p-4 bg-white border-b">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Marks Distribution</span>
                <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {itemsTotal} / {list.totalMarks} marks
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                className={`h-3 rounded-full transition-all duration-300 ${
                itemsTotal > list.totalMarks ?
                'bg-red-500' :
                itemsTotal === list.totalMarks ?
                'bg-green-500' :
                'bg-blue-500'}`
                }
                style={{ width: `${Math.min(itemsTotal / list.totalMarks * 100, 100)}%` }} />

              </div>
              {remainingMarks !== 0 && list.items.length > 0 &&
            <p className={`text-xs mt-1 ${remainingMarks > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {remainingMarks > 0 ? `${remainingMarks} marks remaining to allocate` : `Exceeded by ${Math.abs(remainingMarks)} marks`}
                </p>
            }
            </div>
            
            {/* Items List */}
            <div className="p-4 space-y-3">
              {list.items.length === 0 ?
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No evaluation items</p>
                  <p className="text-sm text-gray-500 mb-4">Add items to this evaluation list</p>
                  <Button variant="primary" size="sm" onClick={() => handleOpenAddItem(list.id)} disabled={list.isLocked}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div> :

            <>
                  <div className="space-y-2">
                    {list.items.map((item, idx) =>
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.description &&
                    <p className="text-xs text-gray-500">{item.description}</p>
                    }
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                      type="number"
                      value={item.maxMarks}
                      onChange={(e) => handleUpdateItem(list.id, item.id, { maxMarks: parseInt(e.target.value) || 0 })}
                      className="w-16 px-2 py-1 text-center border rounded font-bold text-blue-600"
                      min={0}
                      disabled={list.isLocked} />

                          <span className="text-sm text-gray-500">marks</span>
                        </div>
                        {!list.isLocked &&
                  <button
                    onClick={() => handleDeleteItem(list.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity">

                            <Trash2 className="w-4 h-4" />
                          </button>
                  }
                      </div>
                )}
                  </div>
                  
                  {!list.isLocked &&
              <Button variant="outline" size="sm" onClick={() => handleOpenAddItem(list.id)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Another Item
                    </Button>
              }
                </>
            }
            </div>
            
            {/* Quick Add Templates */}
            {!list.isLocked &&
          <div className="p-4 bg-blue-50 border-t">
                <div className="flex items-center gap-2 text-blue-800 font-medium text-sm mb-3">
                  <Sparkles className="w-4 h-4" />
                  Quick Add from Templates
                </div>
                <div className="flex flex-wrap gap-2">
                  {evaluationTemplates.slice(0, 6).map((template) => {
                const TemplateIcon = template.icon;
                const alreadyExists = list.items.some((i) => i.name.toLowerCase() === template.name.toLowerCase());
                return (
                  <button
                    key={template.id}
                    onClick={() => !alreadyExists && handleAddTemplateItem(list.id, template)}
                    disabled={alreadyExists}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    alreadyExists ?
                    'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    'bg-white border border-blue-200 hover:border-blue-400 text-blue-700'}`
                    }>

                        <TemplateIcon className="w-3 h-3" />
                        {template.name}
                        {!alreadyExists && <Badge variant="info">{template.suggestedMarks}</Badge>}
                        {alreadyExists && <Check className="w-3 h-3" />}
                      </button>);

              })}
                </div>
              </div>
          }
            
            {/* List Actions */}
            <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select
                value={list.status}
                onChange={(value) => handleChangeListStatus(list.id, value as ListStatus)}
                options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Active', label: 'Active' },
                { value: 'Archived', label: 'Archived' }]
                }
                className="w-32"
                disabled={list.isLocked} />

                <Toggle
                checked={list.autoCalculate}
                onChange={(checked) => handleUpdateList(list.id, { autoCalculate: checked })}
                label="Auto-calculate total"
                disabled={list.isLocked} />

              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleDuplicateList(list)}>
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteList(list.id)}
                disabled={list.isLocked}
                className="text-red-600 hover:bg-red-50">

                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>);

  };

  // ============================================
  // Main Render
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Evaluation Setup</h1>
              <p className="text-gray-500">Configure class-wise evaluation lists and criteria</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="success" onClick={handleActivateAll} disabled={validationErrors.length > 0}>
              <Zap className="w-4 h-4 mr-2" />
              Activate All
            </Button>
            <Button variant="primary" onClick={handleSaveAll} disabled={isSaving}>
              {isSaving ?
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

              <Save className="w-4 h-4 mr-2" />
              }
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
      
      {/* Validation Errors */}
      {validationErrors.length > 0 &&
      <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Validation Errors</h4>
              <ul className="mt-1 space-y-1">
                {validationErrors.map((err, idx) =>
              <li key={idx} className="text-sm text-red-700">• {err}</li>
              )}
              </ul>
            </div>
          </div>
        </Card>
      }
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Selection Panel */}
          <Card className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              Basic Selection
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Academic Year"
                value={academicYear}
                onChange={setAcademicYear}
                options={academicYears.map((y) => ({ value: y, label: y }))} />

              <Select
                label="Board"
                value={board}
                onChange={setBoard}
                options={boards.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select Board" />

              <Select
                label="Class"
                value={selectedClass}
                onChange={setSelectedClass}
                options={classes.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Select Class" />

              <Select
                label="Section (Optional)"
                value={section}
                onChange={setSection}
                options={sections.map((s) => ({ value: s, label: `Section ${s}` }))}
                placeholder="All Sections" />

            </div>
          </Card>
          
          {/* Summary Stats */}
          {selectedClass && board &&
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-900">{totalListsCount}</p>
                    <p className="text-sm text-blue-600">Evaluation Lists</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-900">{activeListsCount}</p>
                    <p className="text-sm text-green-600">Active Lists</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ListChecks className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-900">{totalItemsCount}</p>
                    <p className="text-sm text-purple-600">Total Items</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-900">{grandTotalMarks}</p>
                    <p className="text-sm text-orange-600">Grand Total Marks</p>
                  </div>
                </div>
              </Card>
            </div>
          }
          
          {/* Evaluation Lists */}
          {selectedClass && board &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gray-600" />
                  Evaluation Lists
                </h2>
                <Button variant="primary" onClick={() => setShowAddListModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Evaluation List
                </Button>
              </div>
              
              {evaluationLists.length === 0 ?
            <Card className="p-12 text-center">
                  <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Evaluation Lists</h3>
                  <p className="text-gray-500 mt-2 mb-4">
                    Create evaluation lists to define assessment criteria for this class.
                  </p>
                  <Button variant="primary" onClick={() => setShowAddListModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First List
                  </Button>
                </Card> :

            <div className="space-y-4">
                  {evaluationLists.map((list) => renderEvaluationList(list))}
                </div>
            }
            </div>
          }
          
          {(!selectedClass || !board) &&
          <Card className="p-12 text-center">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Select Class and Board</h3>
              <p className="text-gray-500 mt-2">
                Please select an academic year, board, and class to configure evaluation lists.
              </p>
            </Card>
          }
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setShowTemplates(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="w-4 h-4 mr-2" />
                Copy from Another Class
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset All Lists
              </Button>
            </div>
          </Card>
          
          {/* Version History */}
          {showHistory &&
          <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <History className="w-4 h-4 text-gray-600" />
                  Version History
                </h3>
                <button onClick={() => setShowHistory(false)}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {versionHistory.map((version, idx) =>
              <div key={idx} className={`p-3 rounded-lg border ${version.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">v{version.version}</span>
                      {version.isActive && <Badge variant="success">Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{version.changeNotes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {version.modifiedBy} • {version.modifiedAt}
                    </p>
                  </div>
              )}
              </div>
            </Card>
          }
          
          {/* List Templates */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-600" />
              List Templates
            </h3>
            <div className="space-y-2">
              {listTemplates.slice(0, 4).map((template, idx) =>
              <button
                key={idx}
                onClick={() => {
                  handleApplyListTemplate(template);
                  setShowAddListModal(true);
                }}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 transition-colors">

                  <p className="font-medium text-gray-900 text-sm">{template.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{template.suggestedMarks} marks</p>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              )}
            </div>
          </Card>
          
          {/* Help */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Setup Tips</h4>
                <ul className="text-xs text-blue-700 mt-2 space-y-1">
                  <li>• Create multiple evaluation lists per class</li>
                  <li>• Item marks must equal list total</li>
                  <li>• Optionally link lists to subjects</li>
                  <li>• Locked lists are in use for results</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Add List Modal */}
      {showAddListModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Evaluation List
              </h2>
              <button onClick={() => setShowAddListModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Input
              label="List Name *"
              value={newList.name}
              onChange={(value) => setNewList((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Co-Scholastic Evaluation"
              error={errors.listName} />

              
              <TextArea
              label="Description (Optional)"
              value={newList.description}
              onChange={(value) => setNewList((prev) => ({ ...prev, description: value }))}
              placeholder="Brief description of this evaluation list..." />

              
              <Input
              label="Total Marks"
              type="number"
              value={newList.totalMarks}
              onChange={(value) => setNewList((prev) => ({ ...prev, totalMarks: parseInt(value) || 0 }))}
              min={0} />

              
              <Toggle
              checked={newList.autoCalculate}
              onChange={(checked) => setNewList((prev) => ({ ...prev, autoCalculate: checked }))}
              label="Auto-calculate total from items" />

              
              <Toggle
              checked={newList.isSubjectLinked}
              onChange={(checked) => setNewList((prev) => ({ ...prev, isSubjectLinked: checked }))}
              label="Link to specific subjects" />

              
              {newList.isSubjectLinked &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {subjects.map((subject) =>
                <label key={subject.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                    type="checkbox"
                    checked={newList.linkedSubjects.includes(subject.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewList((prev) => ({
                          ...prev,
                          linkedSubjects: [...prev.linkedSubjects, subject.id]
                        }));
                      } else {
                        setNewList((prev) => ({
                          ...prev,
                          linkedSubjects: prev.linkedSubjects.filter((id) => id !== subject.id)
                        }));
                      }
                    }}
                    className="rounded border-gray-300" />

                        <span className="text-sm">{subject.name}</span>
                      </label>
                )}
                  </div>
                </div>
            }
              
              {/* Quick Apply Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Apply Template</label>
                <div className="flex flex-wrap gap-2">
                  {listTemplates.slice(0, 4).map((template, idx) =>
                <button
                  key={idx}
                  onClick={() => handleApplyListTemplate(template)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">

                      {template.name}
                    </button>
                )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddListModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddList}>
                <Plus className="w-4 h-4 mr-2" />
                Add List
              </Button>
            </div>
          </Card>
        </div>
      }
      
      {/* Add Item Modal */}
      {showAddItemModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Evaluation Item
              </h2>
              <button onClick={() => setShowAddItemModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <Input
              label="Item Name *"
              value={newItem.name}
              onChange={(value) => setNewItem((prev) => ({ ...prev, name: value }))}
              placeholder="e.g., Discipline, Communication Skills"
              error={errors.itemName} />

              
              <Input
              label="Maximum Marks *"
              type="number"
              value={newItem.maxMarks}
              onChange={(value) => setNewItem((prev) => ({ ...prev, maxMarks: parseInt(value) || 0 }))}
              min={0}
              error={errors.itemMarks} />

              
              <TextArea
              label="Description (Optional)"
              value={newItem.description}
              onChange={(value) => setNewItem((prev) => ({ ...prev, description: value }))}
              placeholder="Brief description of this evaluation criteria..." />

              
              {/* Quick Select Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                <div className="flex flex-wrap gap-2">
                  {evaluationTemplates.slice(0, 8).map((template) => {
                  const TemplateIcon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setNewItem({
                        name: template.name,
                        maxMarks: template.suggestedMarks,
                        description: template.description
                      })}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">

                        <TemplateIcon className="w-3 h-3" />
                        {template.name}
                      </button>);

                })}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddItemModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAddItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </Card>
        </div>
      }
      
      {/* Preview Modal */}
      {showPreview &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-green-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-6 h-6" />
                <h2 className="text-lg font-bold">Configuration Preview</h2>
              </div>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Academic Year:</span>
                    <p className="font-medium">{academicYear}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Board:</span>
                    <p className="font-medium">{boards.find((b) => b.id === board)?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Class:</span>
                    <p className="font-medium">{classes.find((c) => c.id === selectedClass)?.name || '-'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Section:</span>
                    <p className="font-medium">{section || 'All Sections'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {evaluationLists.map((list) =>
              <div key={list.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{list.name}</span>
                        <Badge variant={getStatusColor(list.status)}>{list.status}</Badge>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{list.totalMarks} marks</span>
                    </div>
                    
                    {list.items.length > 0 &&
                <table className="w-full">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {list.items.map((item, idx) =>
                    <tr key={item.id}>
                              <td className="px-4 py-2 text-gray-500">{idx + 1}</td>
                              <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{item.description || '-'}</td>
                              <td className="px-4 py-2 text-center font-bold text-blue-600">{item.maxMarks}</td>
                            </tr>
                    )}
                          <tr className="bg-blue-50">
                            <td colSpan={3} className="px-4 py-2 text-right font-semibold text-gray-900">Total</td>
                            <td className="px-4 py-2 text-center font-bold text-blue-700">
                              {list.items.reduce((sum, i) => sum + i.maxMarks, 0)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                }
                    
                    {list.items.length === 0 &&
                <div className="p-4 text-center text-gray-500">
                        No items configured
                      </div>
                }
                    
                    {list.isSubjectLinked && list.linkedSubjects.length > 0 &&
                <div className="px-4 py-2 bg-purple-50 border-t flex items-center gap-2 text-sm">
                        <Link className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-700">
                          Linked to: {list.linkedSubjects.map((id) => subjects.find((s) => s.id === id)?.name).join(', ')}
                        </span>
                      </div>
                }
                  </div>
              )}
              </div>
              
              {/* Grand Total */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Grand Total (All Lists)</span>
                  <span className="text-2xl font-bold">{grandTotalMarks} Marks</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </div>
          </Card>
        </div>
      }
      
      {/* Templates Browser Modal */}
      {showTemplates &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-lg font-bold">Evaluation Item Templates</h2>
              </div>
              <button onClick={() => setShowTemplates(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {evaluationTemplates.map((template) => {
                const TemplateIcon = template.icon;
                return (
                  <div key={template.id} className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <TemplateIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="info">{template.suggestedMarks} marks</Badge>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(template.category)}`}>
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowTemplates(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default EvaluationSetup;