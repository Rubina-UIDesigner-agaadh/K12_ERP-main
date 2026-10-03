import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  createElement } from
'react';
// src/pages/academic/academics/curriculum/CurriculumSetup.tsx
import {
  BookOpen,
  Plus,
  Save,
  Search,
  X,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Archive,
  History,
  Layers,
  Grid,
  List,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight } from
'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
// ==================== TYPE DEFINITIONS ====================
interface Subject {
  id: number;
  name: string;
  code: string;
  type: 'core' | 'elective' | 'language' | 'vocational';
  credits: number;
  periods: number;
}
interface Framework {
  id: number;
  name: string;
  code: string;
  board: string;
  boardType: 'national' | 'international' | 'state';
  academicYear: string;
  classesApplicable: string[];
  status: 'active' | 'inactive' | 'draft' | 'archived';
  description: string;
  version: string;
  effectiveDate: string;
  expiryDate: string;
  subjects: Subject[];
  totalCredits: number;
  totalPeriods: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  approvedBy: string;
  approvedAt: string;
  isLocked: boolean;
  tags: string[];
  notes: string;
}
interface FrameworkFormData {
  name: string;
  code: string;
  board: string;
  academicYear: string;
  classesApplicable: string[];
  description: string;
  version: string;
  effectiveDate: string;
  expiryDate: string;
  tags: string;
  notes: string;
}
interface SubjectFormData {
  name: string;
  code: string;
  type: Subject['type'];
  credits: number;
  periods: number;
}
interface ChangeHistoryEntry {
  id: number;
  date: string;
  action: string;
  framework: string;
  user: string;
  details: string;
}
interface BoardOption {
  value: string;
  label: string;
  type: 'national' | 'international' | 'state';
}
interface SelectOption {
  value: string;
  label: string;
}
// ==================== CONSTANTS ====================
const BOARDS: BoardOption[] = [
{
  value: 'cbse',
  label: 'CBSE',
  type: 'national'
},
{
  value: 'icse',
  label: 'ICSE',
  type: 'national'
},
{
  value: 'ib',
  label: 'International Baccalaureate (IB)',
  type: 'international'
},
{
  value: 'cambridge',
  label: 'Cambridge (IGCSE)',
  type: 'international'
},
{
  value: 'state_mh',
  label: 'State Board - Maharashtra',
  type: 'state'
},
{
  value: 'state_ka',
  label: 'State Board - Karnataka',
  type: 'state'
},
{
  value: 'state_tn',
  label: 'State Board - Tamil Nadu',
  type: 'state'
},
{
  value: 'state_gj',
  label: 'State Board - Gujarat',
  type: 'state'
},
{
  value: 'nios',
  label: 'NIOS',
  type: 'national'
}];

const ACADEMIC_YEARS: string[] = ['2024-25', '2025-26', '2026-27', '2027-28'];
const CLASSES: string[] = [
'Nursery',
'LKG',
'UKG',
'I',
'II',
'III',
'IV',
'V',
'VI',
'VII',
'VIII',
'IX',
'X',
'XI',
'XII'];

const STATUS_OPTIONS: SelectOption[] = [
{
  value: 'all',
  label: 'All Status'
},
{
  value: 'active',
  label: 'Active'
},
{
  value: 'inactive',
  label: 'Inactive'
},
{
  value: 'draft',
  label: 'Draft'
},
{
  value: 'archived',
  label: 'Archived'
}];

const BOARD_TYPE_OPTIONS: SelectOption[] = [
{
  value: 'all',
  label: 'All Types'
},
{
  value: 'national',
  label: 'National'
},
{
  value: 'international',
  label: 'International'
},
{
  value: 'state',
  label: 'State'
}];

const SORT_OPTIONS: SelectOption[] = [
{
  value: 'name',
  label: 'Name'
},
{
  value: 'board',
  label: 'Board'
},
{
  value: 'status',
  label: 'Status'
},
{
  value: 'createdAt',
  label: 'Created Date'
},
{
  value: 'updatedAt',
  label: 'Updated Date'
}];

const SUBJECT_TYPES: SelectOption[] = [
{
  value: 'core',
  label: 'Core'
},
{
  value: 'elective',
  label: 'Elective'
},
{
  value: 'language',
  label: 'Language'
},
{
  value: 'vocational',
  label: 'Vocational'
}];

const ITEMS_PER_PAGE = 10;
const INITIAL_FORM_DATA: FrameworkFormData = {
  name: '',
  code: '',
  board: '',
  academicYear: '2025-26',
  classesApplicable: [],
  description: '',
  version: '1.0',
  effectiveDate: '',
  expiryDate: '',
  tags: '',
  notes: ''
};
const INITIAL_SUBJECT_FORM_DATA: SubjectFormData = {
  name: '',
  code: '',
  type: 'core',
  credits: 1,
  periods: 1
};
const INITIAL_FRAMEWORKS: Framework[] = [
{
  id: 1,
  name: 'CBSE Core 2025',
  code: 'CBSE-2025',
  board: 'CBSE',
  boardType: 'national',
  academicYear: '2025-26',
  classesApplicable: [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII'],

  status: 'active',
  description:
  'Central Board of Secondary Education curriculum framework for academic year 2025-26. Includes updated NEP 2020 guidelines and competency-based learning objectives.',
  version: '2.1',
  effectiveDate: '2025-04-01',
  expiryDate: '2026-03-31',
  subjects: [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH',
    type: 'core',
    credits: 5,
    periods: 6
  },
  {
    id: 2,
    name: 'Science',
    code: 'SCI',
    type: 'core',
    credits: 5,
    periods: 6
  },
  {
    id: 3,
    name: 'English',
    code: 'ENG',
    type: 'language',
    credits: 4,
    periods: 5
  },
  {
    id: 4,
    name: 'Hindi',
    code: 'HIN',
    type: 'language',
    credits: 4,
    periods: 5
  },
  {
    id: 5,
    name: 'Social Science',
    code: 'SST',
    type: 'core',
    credits: 4,
    periods: 5
  }],

  totalCredits: 22,
  totalPeriods: 27,
  createdAt: '2024-01-15',
  createdBy: 'Admin',
  updatedAt: '2024-02-10',
  updatedBy: 'Academic Head',
  approvedBy: 'Principal',
  approvedAt: '2024-02-12',
  isLocked: false,
  tags: ['NEP 2020', 'Competency Based'],
  notes: 'Aligned with latest NCERT guidelines'
},
{
  id: 2,
  name: 'ICSE Standard',
  code: 'ICSE-STD',
  board: 'ICSE',
  boardType: 'national',
  academicYear: '2025-26',
  classesApplicable: ['VI', 'VII', 'VIII', 'IX', 'X'],
  status: 'active',
  description:
  'Indian Certificate of Secondary Education curriculum for middle and secondary classes with enhanced practical components.',
  version: '1.5',
  effectiveDate: '2025-04-01',
  expiryDate: '2026-03-31',
  subjects: [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MATH',
    type: 'core',
    credits: 5,
    periods: 7
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHY',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 3,
    name: 'Chemistry',
    code: 'CHEM',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 4,
    name: 'Biology',
    code: 'BIO',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 5,
    name: 'English Literature',
    code: 'ENGLIT',
    type: 'language',
    credits: 4,
    periods: 5
  }],

  totalCredits: 21,
  totalPeriods: 27,
  createdAt: '2024-01-20',
  createdBy: 'Admin',
  updatedAt: '2024-02-08',
  updatedBy: 'Admin',
  approvedBy: 'Director',
  approvedAt: '2024-02-10',
  isLocked: false,
  tags: ['Practical Focus', 'Application Based'],
  notes: 'Enhanced practical components'
},
{
  id: 3,
  name: 'State Board (MH)',
  code: 'MH-STATE',
  board: 'State Board - Maharashtra',
  boardType: 'state',
  academicYear: '2025-26',
  classesApplicable: [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X'],

  status: 'inactive',
  description:
  'Maharashtra State Board curriculum framework with regional language integration and state-specific content.',
  version: '1.0',
  effectiveDate: '2025-06-01',
  expiryDate: '2026-04-30',
  subjects: [
  {
    id: 1,
    name: 'Marathi',
    code: 'MAR',
    type: 'language',
    credits: 4,
    periods: 5
  },
  {
    id: 2,
    name: 'Mathematics',
    code: 'MATH',
    type: 'core',
    credits: 5,
    periods: 6
  },
  {
    id: 3,
    name: 'General Science',
    code: 'GSCI',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 4,
    name: 'History & Civics',
    code: 'HISCIV',
    type: 'core',
    credits: 3,
    periods: 4
  }],

  totalCredits: 16,
  totalPeriods: 20,
  createdAt: '2024-02-01',
  createdBy: 'State Coordinator',
  updatedAt: '2024-02-05',
  updatedBy: 'State Coordinator',
  approvedBy: '',
  approvedAt: '',
  isLocked: false,
  tags: ['Regional', 'State Specific'],
  notes: 'Pending final approval'
},
{
  id: 4,
  name: 'IB Primary Years',
  code: 'IB-PYP',
  board: 'International Baccalaureate (IB)',
  boardType: 'international',
  academicYear: '2025-26',
  classesApplicable: ['Nursery', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V'],
  status: 'draft',
  description:
  'IB Primary Years Programme focusing on inquiry-based learning and transdisciplinary themes.',
  version: '0.9',
  effectiveDate: '2025-08-01',
  expiryDate: '2026-07-31',
  subjects: [
  {
    id: 1,
    name: 'Language Arts',
    code: 'LANG',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 2,
    name: 'Mathematics',
    code: 'MATH',
    type: 'core',
    credits: 4,
    periods: 5
  },
  {
    id: 3,
    name: 'Science & Technology',
    code: 'SCITECH',
    type: 'core',
    credits: 3,
    periods: 4
  },
  {
    id: 4,
    name: 'Arts & Music',
    code: 'ARTS',
    type: 'elective',
    credits: 2,
    periods: 3
  },
  {
    id: 5,
    name: 'Physical Education',
    code: 'PE',
    type: 'core',
    credits: 2,
    periods: 3
  }],

  totalCredits: 15,
  totalPeriods: 20,
  createdAt: '2024-02-10',
  createdBy: 'IB Coordinator',
  updatedAt: '2024-02-15',
  updatedBy: 'IB Coordinator',
  approvedBy: '',
  approvedAt: '',
  isLocked: false,
  tags: ['Inquiry Based', 'International'],
  notes: 'Under development - Draft version'
},
{
  id: 5,
  name: 'Cambridge IGCSE',
  code: 'CAM-IGCSE',
  board: 'Cambridge (IGCSE)',
  boardType: 'international',
  academicYear: '2025-26',
  classesApplicable: ['IX', 'X', 'XI', 'XII'],
  status: 'active',
  description:
  'Cambridge International General Certificate of Secondary Education curriculum for senior secondary students.',
  version: '3.0',
  effectiveDate: '2025-04-01',
  expiryDate: '2026-03-31',
  subjects: [
  {
    id: 1,
    name: 'Extended Mathematics',
    code: 'EMATH',
    type: 'core',
    credits: 5,
    periods: 7
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHY',
    type: 'core',
    credits: 5,
    periods: 6
  },
  {
    id: 3,
    name: 'Chemistry',
    code: 'CHEM',
    type: 'core',
    credits: 5,
    periods: 6
  },
  {
    id: 4,
    name: 'Computer Science',
    code: 'CS',
    type: 'elective',
    credits: 4,
    periods: 5
  },
  {
    id: 5,
    name: 'English First Language',
    code: 'EFL',
    type: 'language',
    credits: 4,
    periods: 5
  }],

  totalCredits: 23,
  totalPeriods: 29,
  createdAt: '2024-01-10',
  createdBy: 'Cambridge Coordinator',
  updatedAt: '2024-02-12',
  updatedBy: 'Academic Director',
  approvedBy: 'Principal',
  approvedAt: '2024-02-14',
  isLocked: true,
  tags: ['International', 'University Prep'],
  notes: 'Locked after final approval'
}];

const INITIAL_CHANGE_HISTORY: ChangeHistoryEntry[] = [
{
  id: 1,
  date: '2024-02-15 10:30 AM',
  action: 'Created',
  framework: 'CBSE Core 2025',
  user: 'Admin',
  details: 'Initial framework creation'
},
{
  id: 2,
  date: '2024-02-14 03:45 PM',
  action: 'Updated',
  framework: 'ICSE Standard',
  user: 'Academic Head',
  details: 'Added new subjects'
},
{
  id: 3,
  date: '2024-02-12 09:15 AM',
  action: 'Approved',
  framework: 'CBSE Core 2025',
  user: 'Principal',
  details: 'Framework approved for implementation'
},
{
  id: 4,
  date: '2024-02-10 02:00 PM',
  action: 'Status Changed',
  framework: 'State Board (MH)',
  user: 'State Coordinator',
  details: 'Changed from Draft to Inactive'
},
{
  id: 5,
  date: '2024-02-08 11:20 AM',
  action: 'Locked',
  framework: 'Cambridge IGCSE',
  user: 'Principal',
  details: 'Framework locked after approval'
}];

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};
const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};
const generateId = (existingIds: number[]): number => {
  return Math.max(0, ...existingIds) + 1;
};
const parseTags = (tagsString: string): string[] => {
  return tagsString.
  split(',').
  map((tag) => tag.trim()).
  filter((tag) => tag.length > 0);
};
const getBoardInfo = (boardValue: string): BoardOption | undefined => {
  return BOARDS.find((b) => b.value === boardValue || b.label === boardValue);
};
// ==================== MAIN COMPONENT ====================
export function CurriculumSetup(): React.ReactElement {
  // ==================== STATE MANAGEMENT ====================
  // Data State
  const [frameworks, setFrameworks] = useState<Framework[]>(INITIAL_FRAMEWORKS);
  const [changeHistory] = useState<ChangeHistoryEntry[]>(INITIAL_CHANGE_HISTORY);
  // Filter and Sort State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBoardType, setFilterBoardType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // View State
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Selection State
  const [selectedFrameworks, setSelectedFrameworks] = useState<number[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(
    null
  );
  // Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  // Notification State
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  // Import State
  const [importData, setImportData] = useState<Framework[] | null>(null);
  const [importError, setImportError] = useState<string>('');
  // Form State
  const [formData, setFormData] = useState<FrameworkFormData>(INITIAL_FORM_DATA);
  const [subjectFormData, setSubjectFormData] = useState<SubjectFormData>(
    INITIAL_SUBJECT_FORM_DATA
  );
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  // ==================== COMPUTED VALUES ====================
  const filteredFrameworks = useMemo((): Framework[] => {
    let result = [...frameworks];
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (framework) =>
        framework.name.toLowerCase().includes(search) ||
        framework.code.toLowerCase().includes(search) ||
        framework.board.toLowerCase().includes(search) ||
        framework.description.toLowerCase().includes(search)
      );
    }
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter((framework) => framework.status === filterStatus);
    }
    // Apply board type filter
    if (filterBoardType !== 'all') {
      result = result.filter(
        (framework) => framework.boardType === filterBoardType
      );
    }
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'board':
          comparison = a.board.localeCompare(b.board);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [frameworks, searchTerm, filterStatus, filterBoardType, sortBy, sortOrder]);
  const paginatedFrameworks = useMemo((): Framework[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredFrameworks.slice(startIndex, endIndex);
  }, [filteredFrameworks, currentPage]);
  const totalPages = useMemo((): number => {
    return Math.ceil(filteredFrameworks.length / ITEMS_PER_PAGE);
  }, [filteredFrameworks.length]);
  const statistics = useMemo(() => {
    return {
      total: frameworks.length,
      active: frameworks.filter((f) => f.status === 'active').length,
      inactive: frameworks.filter((f) => f.status === 'inactive').length,
      draft: frameworks.filter((f) => f.status === 'draft').length,
      archived: frameworks.filter((f) => f.status === 'archived').length,
      totalSubjects: frameworks.reduce((sum, f) => sum + f.subjects.length, 0),
      locked: frameworks.filter((f) => f.isLocked).length
    };
  }, [frameworks]);
  // ==================== FORM HANDLERS ====================
  const resetFormData = useCallback((): void => {
    setFormData(INITIAL_FORM_DATA);
  }, []);
  const resetSubjectFormData = useCallback((): void => {
    setSubjectFormData(INITIAL_SUBJECT_FORM_DATA);
  }, []);
  const updateFormField = useCallback(
    <K extends keyof FrameworkFormData,>(
    field: K,
    value: FrameworkFormData[K])
    : void => {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    []
  );
  const updateSubjectFormField = useCallback(
    <K extends keyof SubjectFormData,>(
    field: K,
    value: SubjectFormData[K])
    : void => {
      setSubjectFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    []
  );
  const toggleClassSelection = useCallback((className: string): void => {
    setFormData((prev) => ({
      ...prev,
      classesApplicable: prev.classesApplicable.includes(className) ?
      prev.classesApplicable.filter((c) => c !== className) :
      [...prev.classesApplicable, className]
    }));
  }, []);
  // ==================== MODAL HANDLERS ====================
  const openAddModal = useCallback((): void => {
    resetFormData();
    setShowAddModal(true);
  }, [resetFormData]);
  const closeAddModal = useCallback((): void => {
    setShowAddModal(false);
    resetFormData();
  }, [resetFormData]);
  const openEditModal = useCallback((framework: Framework): void => {
    setSelectedFramework(framework);
    setFormData({
      name: framework.name,
      code: framework.code,
      board: framework.board,
      academicYear: framework.academicYear,
      classesApplicable: [...framework.classesApplicable],
      description: framework.description,
      version: framework.version,
      effectiveDate: framework.effectiveDate,
      expiryDate: framework.expiryDate,
      tags: framework.tags.join(', '),
      notes: framework.notes
    });
    setShowEditModal(true);
  }, []);
  const closeEditModal = useCallback((): void => {
    setShowEditModal(false);
    setSelectedFramework(null);
    resetFormData();
  }, [resetFormData]);
  const openViewModal = useCallback((framework: Framework): void => {
    setSelectedFramework(framework);
    setShowViewModal(true);
  }, []);
  const closeViewModal = useCallback((): void => {
    setShowViewModal(false);
    setSelectedFramework(null);
  }, []);
  const openDeleteModal = useCallback((framework: Framework): void => {
    setSelectedFramework(framework);
    setShowDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback((): void => {
    setShowDeleteModal(false);
    setSelectedFramework(null);
  }, []);
  const openSubjectsModal = useCallback((framework: Framework): void => {
    setSelectedFramework(framework);
    setShowSubjectsModal(true);
  }, []);
  const closeSubjectsModal = useCallback((): void => {
    setShowSubjectsModal(false);
    setSelectedFramework(null);
    resetSubjectFormData();
  }, [resetSubjectFormData]);
  const openImportModal = useCallback((): void => {
    setShowImportModal(true);
    setImportData(null);
    setImportError('');
  }, []);
  const closeImportModal = useCallback((): void => {
    setShowImportModal(false);
    setImportData(null);
    setImportError('');
  }, []);
  const openHistoryModal = useCallback((): void => {
    setShowHistoryModal(true);
  }, []);
  const closeHistoryModal = useCallback((): void => {
    setShowHistoryModal(false);
  }, []);
  // ==================== CRUD OPERATIONS ====================
  const saveFramework = useCallback((): void => {
    const boardInfo = getBoardInfo(formData.board);
    const currentDate = getCurrentDate();
    const isEditing = showEditModal && selectedFramework;
    const newFramework: Framework = {
      id: isEditing ?
      selectedFramework.id :
      generateId(frameworks.map((f) => f.id)),
      name: formData.name,
      code: formData.code,
      board: boardInfo?.label || formData.board,
      boardType: (boardInfo?.type || 'national') as Framework['boardType'],
      academicYear: formData.academicYear,
      classesApplicable: formData.classesApplicable,
      status: isEditing ? selectedFramework.status : 'draft',
      description: formData.description,
      version: formData.version,
      effectiveDate: formData.effectiveDate,
      expiryDate: formData.expiryDate,
      subjects: isEditing ? selectedFramework.subjects : [],
      totalCredits: isEditing ? selectedFramework.totalCredits : 0,
      totalPeriods: isEditing ? selectedFramework.totalPeriods : 0,
      createdAt: isEditing ? selectedFramework.createdAt : currentDate,
      createdBy: isEditing ? selectedFramework.createdBy : 'Current User',
      updatedAt: currentDate,
      updatedBy: 'Current User',
      approvedBy: isEditing ? selectedFramework.approvedBy : '',
      approvedAt: isEditing ? selectedFramework.approvedAt : '',
      isLocked: isEditing ? selectedFramework.isLocked : false,
      tags: parseTags(formData.tags),
      notes: formData.notes
    };
    if (isEditing) {
      setFrameworks((prev) =>
      prev.map((f) => f.id === selectedFramework.id ? newFramework : f)
      );
    } else {
      setFrameworks((prev) => [...prev, newFramework]);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedFramework(null);
    resetFormData();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [formData, showEditModal, selectedFramework, frameworks, resetFormData]);
  const deleteFramework = useCallback((): void => {
    if (!selectedFramework) return;
    setFrameworks((prev) => prev.filter((f) => f.id !== selectedFramework.id));
    closeDeleteModal();
  }, [selectedFramework, closeDeleteModal]);
  const addSubject = useCallback((): void => {
    if (!selectedFramework || !subjectFormData.name || !subjectFormData.code)
    return;
    const newSubject: Subject = {
      id: generateId(selectedFramework.subjects.map((s) => s.id)),
      name: subjectFormData.name,
      code: subjectFormData.code,
      type: subjectFormData.type,
      credits: subjectFormData.credits,
      periods: subjectFormData.periods
    };
    const updatedFramework: Framework = {
      ...selectedFramework,
      subjects: [...selectedFramework.subjects, newSubject],
      totalCredits: selectedFramework.totalCredits + subjectFormData.credits,
      totalPeriods: selectedFramework.totalPeriods + subjectFormData.periods,
      updatedAt: getCurrentDate(),
      updatedBy: 'Current User'
    };
    setFrameworks((prev) =>
    prev.map((f) => f.id === selectedFramework.id ? updatedFramework : f)
    );
    setSelectedFramework(updatedFramework);
    resetSubjectFormData();
  }, [selectedFramework, subjectFormData, resetSubjectFormData]);
  const removeSubject = useCallback(
    (subjectId: number): void => {
      if (!selectedFramework) return;
      const subject = selectedFramework.subjects.find((s) => s.id === subjectId);
      if (!subject) return;
      const updatedFramework: Framework = {
        ...selectedFramework,
        subjects: selectedFramework.subjects.filter((s) => s.id !== subjectId),
        totalCredits: selectedFramework.totalCredits - subject.credits,
        totalPeriods: selectedFramework.totalPeriods - subject.periods,
        updatedAt: getCurrentDate(),
        updatedBy: 'Current User'
      };
      setFrameworks((prev) =>
      prev.map((f) => f.id === selectedFramework.id ? updatedFramework : f)
      );
      setSelectedFramework(updatedFramework);
    },
    [selectedFramework]
  );
  // ==================== STATUS AND LOCK OPERATIONS ====================
  const changeFrameworkStatus = useCallback(
    (framework: Framework, newStatus: Framework['status']): void => {
      setFrameworks((prev) =>
      prev.map((f) =>
      f.id === framework.id ?
      {
        ...f,
        status: newStatus,
        updatedAt: getCurrentDate(),
        updatedBy: 'Current User'
      } :
      f
      )
      );
    },
    []
  );
  const toggleFrameworkLock = useCallback((framework: Framework): void => {
    setFrameworks((prev) =>
    prev.map((f) =>
    f.id === framework.id ?
    {
      ...f,
      isLocked: !f.isLocked,
      updatedAt: getCurrentDate(),
      updatedBy: 'Current User'
    } :
    f
    )
    );
  }, []);
  const duplicateFramework = useCallback(
    (framework: Framework): void => {
      const currentDate = getCurrentDate();
      const duplicate: Framework = {
        ...framework,
        id: generateId(frameworks.map((f) => f.id)),
        name: `${framework.name} (Copy)`,
        code: `${framework.code}-COPY`,
        status: 'draft',
        createdAt: currentDate,
        updatedAt: currentDate,
        createdBy: 'Current User',
        updatedBy: 'Current User',
        approvedBy: '',
        approvedAt: '',
        isLocked: false
      };
      setFrameworks((prev) => [...prev, duplicate]);
    },
    [frameworks]
  );
  // ==================== SELECTION HANDLERS ====================
  const handleSelectAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (event.target.checked) {
        setSelectedFrameworks(paginatedFrameworks.map((f) => f.id));
      } else {
        setSelectedFrameworks([]);
      }
    },
    [paginatedFrameworks]
  );
  const toggleFrameworkSelection = useCallback((frameworkId: number): void => {
    setSelectedFrameworks((prev) =>
    prev.includes(frameworkId) ?
    prev.filter((id) => id !== frameworkId) :
    [...prev, frameworkId]
    );
  }, []);
  const clearSelection = useCallback((): void => {
    setSelectedFrameworks([]);
  }, []);
  // ==================== BULK OPERATIONS ====================
  const bulkChangeStatus = useCallback(
    (status: Framework['status']): void => {
      setFrameworks((prev) =>
      prev.map((f) =>
      selectedFrameworks.includes(f.id) && !f.isLocked ?
      {
        ...f,
        status,
        updatedAt: getCurrentDate(),
        updatedBy: 'Current User'
      } :
      f
      )
      );
      clearSelection();
    },
    [selectedFrameworks, clearSelection]
  );
  const bulkDelete = useCallback((): void => {
    setFrameworks((prev) =>
    prev.filter((f) => !selectedFrameworks.includes(f.id) || f.isLocked)
    );
    clearSelection();
  }, [selectedFrameworks, clearSelection]);
  // ==================== EXPORT HANDLERS ====================
  const exportToJSON = useCallback((): void => {
    const exportData =
    selectedFrameworks.length > 0 ?
    frameworks.filter((f) => selectedFrameworks.includes(f.id)) :
    frameworks;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `curriculum-frameworks-${getCurrentDate()}.json`;
    link.click();
    clearSelection();
  }, [frameworks, selectedFrameworks, clearSelection]);
  const exportToCSV = useCallback((): void => {
    const exportData =
    selectedFrameworks.length > 0 ?
    frameworks.filter((f) => selectedFrameworks.includes(f.id)) :
    frameworks;
    const headers = [
    'ID',
    'Name',
    'Code',
    'Board',
    'Academic Year',
    'Status',
    'Version',
    'Total Subjects',
    'Total Credits'];

    const csvRows = [
    headers.join(','),
    ...exportData.map((f) =>
    [
    f.id,
    `"${f.name}"`,
    f.code,
    `"${f.board}"`,
    f.academicYear,
    f.status,
    f.version,
    f.subjects.length,
    f.totalCredits].
    join(',')
    )];

    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `curriculum-frameworks-${getCurrentDate()}.csv`;
    link.click();
    clearSelection();
  }, [frameworks, selectedFrameworks, clearSelection]);
  // ==================== IMPORT HANDLERS ====================
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          const data = Array.isArray(parsed) ? parsed : [parsed];
          setImportData(data);
          setImportError('');
        } catch {
          setImportError(
            'Invalid JSON file format. Please check the file and try again.'
          );
          setImportData(null);
        }
      };
      reader.onerror = () => {
        setImportError('Error reading file. Please try again.');
        setImportData(null);
      };
      reader.readAsText(file);
    },
    []
  );
  const confirmImport = useCallback((): void => {
    if (!importData || importData.length === 0) return;
    const currentDate = getCurrentDate();
    const existingIds = frameworks.map((f) => f.id);
    const newFrameworks: Framework[] = importData.map((f, index) => ({
      ...f,
      id: generateId([
      ...existingIds,
      ...Array(index).
      fill(0).
      map((_, i) => existingIds[existingIds.length - 1] + i + 1)]
      ),
      status: 'draft' as const,
      createdAt: currentDate,
      updatedAt: currentDate,
      createdBy: 'Current User',
      updatedBy: 'Current User',
      isLocked: false
    }));
    setFrameworks((prev) => [...prev, ...newFrameworks]);
    closeImportModal();
  }, [importData, frameworks, closeImportModal]);
  const triggerFileInput = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);
  // ==================== FILTER HANDLERS ====================
  const clearFilters = useCallback((): void => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterBoardType('all');
    setSortBy('name');
    setSortOrder('asc');
    setCurrentPage(1);
  }, []);
  const toggleSortOrder = useCallback((): void => {
    setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
  }, []);
  // ==================== PAGINATION HANDLERS ====================
  const goToPage = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);
  const goToPreviousPage = useCallback((): void => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);
  const goToNextPage = useCallback((): void => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);
  const getVisiblePageNumbers = useCallback((): number[] => {
    const pages = Array.from(
      {
        length: totalPages
      },
      (_, i) => i + 1
    );
    const startIndex = Math.max(0, currentPage - 3);
    const endIndex = Math.min(totalPages, currentPage + 2);
    return pages.slice(startIndex, endIndex);
  }, [totalPages, currentPage]);
  // ==================== BADGE RENDERERS ====================
  const renderStatusBadge = (status: string): React.ReactElement => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Active
          </Badge>);

      case 'inactive':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Inactive
          </Badge>);

      case 'draft':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Draft
          </Badge>);

      case 'archived':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Archive className="w-3 h-3" />
            Archived
          </Badge>);

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  const renderBoardTypeBadge = (type: string): React.ReactElement => {
    switch (type) {
      case 'national':
        return <Badge variant="info">National</Badge>;
      case 'international':
        return <Badge variant="success">International</Badge>;
      case 'state':
        return <Badge variant="warning">State</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };
  const renderSubjectTypeBadge = (type: string): React.ReactElement => {
    switch (type) {
      case 'core':
        return <Badge variant="info">{type}</Badge>;
      case 'elective':
        return <Badge variant="warning">{type}</Badge>;
      case 'language':
        return <Badge variant="success">{type}</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };
  // ==================== VALIDATION ====================
  const isFormValid = useMemo((): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.code.trim() !== '' &&
      formData.board !== '' &&
      formData.classesApplicable.length > 0);

  }, [formData]);
  const isSubjectFormValid = useMemo((): boolean => {
    return (
      subjectFormData.name.trim() !== '' && subjectFormData.code.trim() !== '');

  }, [subjectFormData]);
  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Curriculum Setup</h1>
          <p className="text-sm text-gray-500">
            Configure curriculum frameworks, educational boards, and subject
            mappings
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={openHistoryModal}>
            <History className="w-4 h-4 mr-1" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={openImportModal}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={exportToJSON}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="primary" onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-1" />
            Add Framework
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess &&
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">
            Framework saved successfully!
          </p>
        </div>
      }

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.total}
              </p>
              <p className="text-xs text-gray-500">Total Frameworks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.active}
              </p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.inactive}
              </p>
              <p className="text-xs text-gray-500">Inactive</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.draft}
              </p>
              <p className="text-xs text-gray-500">Draft</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Archive className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.archived}
              </p>
              <p className="text-xs text-gray-500">Archived</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalSubjects}
              </p>
              <p className="text-xs text-gray-500">Total Subjects</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Lock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.locked}
              </p>
              <p className="text-xs text-gray-500">Locked</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="p-6">
        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          {/* Search Input */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search frameworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            
            {STATUS_OPTIONS.map((option) =>
            <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )}
          </select>

          {/* Board Type Filter */}
          <select
            value={filterBoardType}
            onChange={(e) => setFilterBoardType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            
            {BOARD_TYPE_OPTIONS.map((option) =>
            <option key={option.value} value={option.value}>
                {option.label}
              </option>
            )}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            
            {SORT_OPTIONS.map((option) =>
            <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            )}
          </select>

          {/* Sort Order Toggle */}
          <button
            onClick={toggleSortOrder}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}>
            
            {sortOrder === 'asc' ?
            <ChevronUp className="w-5 h-5" /> :

            <ChevronDown className="w-5 h-5" />
            }
          </button>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              title="Table View">
              
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
              title="Grid View">
              
              <Grid className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            title="Clear Filters">
            
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Bulk Actions Bar */}
        {selectedFrameworks.length > 0 &&
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedFrameworks.length} selected
            </span>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => bulkChangeStatus('active')}>
            
              <CheckCircle className="w-4 h-4 mr-1" />
              Activate
            </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => bulkChangeStatus('inactive')}>
            
              <AlertCircle className="w-4 h-4 mr-1" />
              Deactivate
            </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => bulkChangeStatus('archived')}>
            
              <Archive className="w-4 h-4 mr-1" />
              Archive
            </Button>
            <Button variant="ghost" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button
            variant="ghost"
            size="sm"
            className="text-red-600"
            onClick={bulkDelete}>
            
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        }

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredFrameworks.length} of {frameworks.length} frameworks
        </div>

        {/* Table View */}
        {viewMode === 'table' &&
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-4 text-left">
                    <input
                    type="checkbox"
                    checked={
                    selectedFrameworks.length ===
                    paginatedFrameworks.length &&
                    paginatedFrameworks.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300" />
                  
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Framework Name
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Board
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Academic Year
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Classes
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Subjects
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedFrameworks.map((framework) =>
              <tr
                key={framework.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${framework.isLocked ? 'bg-orange-50/30' : ''}`}>
                
                    <td className="py-3 px-4">
                      <input
                    type="checkbox"
                    checked={selectedFrameworks.includes(framework.id)}
                    onChange={() => toggleFrameworkSelection(framework.id)}
                    className="rounded border-gray-300" />
                  
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {framework.name}
                        </span>
                        {framework.isLocked &&
                    <Lock className="w-4 h-4 text-orange-500" />
                    }
                        <Badge variant="outline" className="text-xs">
                          {framework.version}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">{framework.code}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>{framework.board}</div>
                      <div className="mt-1">
                        {renderBoardTypeBadge(framework.boardType)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {framework.academicYear}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-600">
                        {framework.classesApplicable.length > 4 ?
                    `${framework.classesApplicable.slice(0, 2).join(', ')} ... ${framework.classesApplicable.slice(-1)}` :
                    framework.classesApplicable.join(', ')}
                      </span>
                      <p className="text-xs text-gray-400">
                        {framework.classesApplicable.length} classes
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {framework.subjects.length}
                        </span>
                        <button
                      onClick={() => openSubjectsModal(framework)}
                      className="text-blue-600 hover:underline text-xs">
                      
                          Manage
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        {framework.totalCredits} credits
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(framework.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                      onClick={() => openViewModal(framework)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View">
                      
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => openEditModal(framework)}
                      disabled={framework.isLocked}
                      className={`p-1.5 rounded-lg ${framework.isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                      title="Edit">
                      
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => duplicateFramework(framework)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Duplicate">
                      
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => toggleFrameworkLock(framework)}
                      className="p-1.5 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                      title={framework.isLocked ? 'Unlock' : 'Lock'}>
                      
                          {framework.isLocked ?
                      <Unlock className="w-4 h-4" /> :

                      <Lock className="w-4 h-4" />
                      }
                        </button>
                        <button
                      onClick={() => openDeleteModal(framework)}
                      disabled={framework.isLocked}
                      className={`p-1.5 rounded-lg ${framework.isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                      title="Delete">
                      
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }

        {/* Grid View */}
        {viewMode === 'grid' &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedFrameworks.map((framework) =>
          <div
            key={framework.id}
            className={`border rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer ${framework.isLocked ? 'border-l-4 border-l-orange-500 bg-orange-50/30' : 'border-gray-200 bg-white'}`}>
            
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                  type="checkbox"
                  checked={selectedFrameworks.includes(framework.id)}
                  onChange={() => toggleFrameworkSelection(framework.id)}
                  className="rounded border-gray-300" />
                
                    {framework.isLocked &&
                <Lock className="w-4 h-4 text-orange-500" />
                }
                  </div>
                  {renderStatusBadge(framework.status)}
                </div>
                <h3
              className="font-bold text-lg text-gray-900 mb-1"
              onClick={() => openViewModal(framework)}>
              
                  {framework.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {framework.code} • {framework.version}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    {framework.board}
                  </span>
                  {renderBoardTypeBadge(framework.boardType)}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {framework.subjects.length}
                    </p>
                    <p className="text-xs text-gray-500">Subjects</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {framework.totalCredits}
                    </p>
                    <p className="text-xs text-gray-500">Credits</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">
                      {framework.classesApplicable.length}
                    </p>
                    <p className="text-xs text-gray-500">Classes</p>
                  </div>
                </div>
                <div className="flex gap-1 pt-3 border-t border-gray-100">
                  <button
                onClick={() => openViewModal(framework)}
                className="flex-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-center text-sm">
                
                    <Eye className="w-4 h-4 mx-auto mb-1" />
                    View
                  </button>
                  <button
                onClick={() => openEditModal(framework)}
                disabled={framework.isLocked}
                className={`flex-1 p-2 rounded-lg text-center text-sm ${framework.isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}>
                
                    <Edit className="w-4 h-4 mx-auto mb-1" />
                    Edit
                  </button>
                  <button
                onClick={() => openSubjectsModal(framework)}
                className="flex-1 p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg text-center text-sm">
                
                    <Layers className="w-4 h-4 mx-auto mb-1" />
                    Subjects
                  </button>
                </div>
              </div>
          )}
          </div>
        }

        {/* Empty State */}
        {filteredFrameworks.length === 0 &&
        <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-lg text-gray-700">
              No frameworks found
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your filters or add a new framework
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        }

        {/* Pagination */}
        {totalPages > 1 &&
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
              {Math.min(
              currentPage * ITEMS_PER_PAGE,
              filteredFrameworks.length
            )}{' '}
              of {filteredFrameworks.length}
            </p>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}>
              
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {getVisiblePageNumbers().map((page) =>
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => goToPage(page)}>
              
                  {page}
                </Button>
            )}
              <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}>
              
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Add/Edit Framework Modal */}
      {(showAddModal || showEditModal) &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                {showEditModal ?
              <Edit className="w-6 h-6 text-blue-600" /> :

              <Plus className="w-6 h-6 text-blue-600" />
              }
                {showEditModal ? 'Edit Framework' : 'Add New Framework'}
              </h2>
              <button
              onClick={showEditModal ? closeEditModal : closeAddModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Framework Name and Code */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framework Name *
                  </label>
                  <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormField('name', e.target.value)}
                  placeholder="e.g. CBSE Core 2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Framework Code *
                  </label>
                  <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => updateFormField('code', e.target.value)}
                  placeholder="e.g. CBSE-2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
              </div>

              {/* Board and Academic Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Board Type *
                  </label>
                  <select
                  value={formData.board}
                  onChange={(e) => updateFormField('board', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  
                    <option value="">Select Board</option>
                    {BOARDS.map((board) =>
                  <option key={board.value} value={board.value}>
                        {board.label}
                      </option>
                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                  value={formData.academicYear}
                  onChange={(e) =>
                  updateFormField('academicYear', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  
                    {ACADEMIC_YEARS.map((year) =>
                  <option key={year} value={year}>
                        {year}
                      </option>
                  )}
                  </select>
                </div>
              </div>

              {/* Version and Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => updateFormField('version', e.target.value)}
                  placeholder="e.g. 1.0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => updateFormField('tags', e.target.value)}
                  placeholder="e.g. NEP 2020, Competency Based"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
              </div>

              {/* Effective and Expiry Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Effective Date
                  </label>
                  <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) =>
                  updateFormField('effectiveDate', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                  updateFormField('expiryDate', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
              </div>

              {/* Classes Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classes Applicable *
                </label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                  {CLASSES.map((cls) =>
                <button
                  key={cls}
                  type="button"
                  onClick={() => toggleClassSelection(cls)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${formData.classesApplicable.includes(cls) ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500'}`}>
                  
                      {cls}
                    </button>
                )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.classesApplicable.length} classes selected
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                value={formData.description}
                onChange={(e) =>
                updateFormField('description', e.target.value)
                }
                rows={3}
                placeholder="Enter framework details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                value={formData.notes}
                onChange={(e) => updateFormField('notes', e.target.value)}
                rows={2}
                placeholder="Internal notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button
              variant="outline"
              onClick={showEditModal ? closeEditModal : closeAddModal}>
              
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={saveFramework}
              disabled={!isFormValid}>
              
                <Save className="w-4 h-4 mr-2" />
                Save Framework
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Framework Modal */}
      {showViewModal && selectedFramework &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedFramework.name}
                    </h2>
                    {selectedFramework.isLocked &&
                  <Lock className="w-5 h-5 text-orange-500" />
                  }
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStatusBadge(selectedFramework.status)}
                    <Badge variant="outline">{selectedFramework.version}</Badge>
                    {renderBoardTypeBadge(selectedFramework.boardType)}
                  </div>
                </div>
              </div>
              <button
              onClick={closeViewModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Code</p>
                  <p className="font-semibold text-gray-900">
                    {selectedFramework.code}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Board</p>
                  <p className="font-semibold text-gray-900">
                    {selectedFramework.board}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Academic Year
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedFramework.academicYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Classes
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedFramework.classesApplicable.length} classes
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </p>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {selectedFramework.description || 'No description provided'}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Effective Date
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedFramework.effectiveDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Expiry Date
                  </p>
                  <p className="font-semibold text-gray-900">
                    {formatDate(selectedFramework.expiryDate)}
                  </p>
                </div>
              </div>

              {/* Subjects List */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Subjects ({selectedFramework.subjects.length})
                </p>
                <div className="space-y-2">
                  {selectedFramework.subjects.map((subject) =>
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {subject.name}
                        </span>
                        <Badge variant="outline">{subject.code}</Badge>
                        {renderSubjectTypeBadge(subject.type)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{subject.credits} credits</span>
                        <span>{subject.periods} periods</span>
                      </div>
                    </div>
                )}
                  {selectedFramework.subjects.length === 0 &&
                <p className="text-gray-500 text-center py-4">
                      No subjects added
                    </p>
                }
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-xl text-center">
                <div>
                  <p className="text-xs text-blue-600 mb-1">Total Subjects</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedFramework.subjects.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Total Credits</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedFramework.totalCredits}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600 mb-1">Total Periods</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {selectedFramework.totalPeriods}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {selectedFramework.tags.length > 0 &&
            <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFramework.tags.map((tag, index) =>
                <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                )}
                  </div>
                </div>
            }

              {/* Audit Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedFramework.createdAt)} by{' '}
                    {selectedFramework.createdBy}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p className="font-medium">
                    {formatDate(selectedFramework.updatedAt)} by{' '}
                    {selectedFramework.updatedBy}
                  </p>
                </div>
                {selectedFramework.approvedBy &&
              <div>
                    <p className="text-gray-500">Approved</p>
                    <p className="font-medium">
                      {formatDate(selectedFramework.approvedAt)} by{' '}
                      {selectedFramework.approvedBy}
                    </p>
                  </div>
              }
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => openSubjectsModal(selectedFramework)}>
                
                  <Layers className="w-4 h-4 mr-1" />
                  Manage Subjects
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateFramework(selectedFramework)}>
                
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicate
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeViewModal();
                  openEditModal(selectedFramework);
                }}
                disabled={selectedFramework.isLocked}>
                
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" onClick={closeViewModal}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Subjects Management Modal */}
      {showSubjectsModal && selectedFramework &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Layers className="w-6 h-6 text-purple-600" />
                Manage Subjects - {selectedFramework.name}
              </h2>
              <button
              onClick={closeSubjectsModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Add Subject Form */}
              <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                <p className="font-medium text-gray-700">Add New Subject</p>
                <div className="grid grid-cols-2 gap-4">
                  <input
                  type="text"
                  placeholder="Subject Name"
                  value={subjectFormData.name}
                  onChange={(e) =>
                  updateSubjectFormField('name', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                  <input
                  type="text"
                  placeholder="Subject Code"
                  value={subjectFormData.code}
                  onChange={(e) =>
                  updateSubjectFormField('code', e.target.value)
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <select
                  value={subjectFormData.type}
                  onChange={(e) =>
                  updateSubjectFormField(
                    'type',
                    e.target.value as Subject['type']
                  )
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  
                    {SUBJECT_TYPES.map((type) =>
                  <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                  )}
                  </select>
                  <input
                  type="number"
                  placeholder="Credits"
                  min="1"
                  max="10"
                  value={subjectFormData.credits}
                  onChange={(e) =>
                  updateSubjectFormField(
                    'credits',
                    parseInt(e.target.value) || 1
                  )
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                  <input
                  type="number"
                  placeholder="Periods/Week"
                  min="1"
                  max="10"
                  value={subjectFormData.periods}
                  onChange={(e) =>
                  updateSubjectFormField(
                    'periods',
                    parseInt(e.target.value) || 1
                  )
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <Button
                variant="primary"
                size="sm"
                onClick={addSubject}
                disabled={!isSubjectFormValid || selectedFramework.isLocked}>
                
                  <Plus className="w-4 h-4 mr-1" />
                  Add Subject
                </Button>
              </div>

              {/* Subjects List */}
              <div>
                <p className="font-medium text-gray-700 mb-3">
                  Current Subjects ({selectedFramework.subjects.length})
                </p>
                <div className="space-y-2">
                  {selectedFramework.subjects.map((subject) =>
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                  
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {subject.name}
                        </span>
                        <Badge variant="outline">{subject.code}</Badge>
                        {renderSubjectTypeBadge(subject.type)}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                          {subject.credits} cr / {subject.periods} per
                        </span>
                        <button
                      onClick={() => removeSubject(subject.id)}
                      disabled={selectedFramework.isLocked}
                      className={`p-1.5 rounded-lg ${selectedFramework.isLocked ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}>
                      
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                )}
                  {selectedFramework.subjects.length === 0 &&
                <p className="text-center text-gray-500 py-8">
                      No subjects added yet
                    </p>
                }
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-xl text-center">
                <div>
                  <p className="text-xs text-blue-600">Total Subjects</p>
                  <p className="text-xl font-bold text-blue-700">
                    {selectedFramework.subjects.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Credits</p>
                  <p className="text-xl font-bold text-blue-700">
                    {selectedFramework.totalCredits}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Periods</p>
                  <p className="text-xl font-bold text-blue-700">
                    {selectedFramework.totalPeriods}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={closeSubjectsModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedFramework &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete Framework
              </h2>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete{' '}
              <strong>{selectedFramework.name}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. All associated subjects and mappings
              will be removed.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteFramework}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Framework
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Upload className="w-6 h-6 text-blue-600" />
                Import Frameworks
              </h2>
              <button
              onClick={closeImportModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* File Upload Area */}
              <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={triggerFileInput}>
              
                <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileSelect}
                className="hidden" />
              
                <Upload className="w-14 h-14 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 font-medium mb-2">
                  Click to upload JSON file
                </p>
                <p className="text-sm text-gray-500">Supported format: JSON</p>
              </div>

              {/* Import Error */}
              {importError &&
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  {importError}
                </div>
            }

              {/* Import Preview */}
              {importData && importData.length > 0 &&
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      Ready to import {importData.length} framework(s)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {importData.slice(0, 3).map((framework, index) =>
                <div
                  key={index}
                  className="text-sm text-gray-700 flex items-center gap-2">
                  
                        <BookOpen className="w-4 h-4" />
                        {framework.name || 'Untitled'}
                      </div>
                )}
                    {importData.length > 3 &&
                <p className="text-sm text-gray-500">
                        ... and {importData.length - 3} more
                      </p>
                }
                  </div>
                </div>
            }
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={closeImportModal}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={confirmImport}
              disabled={!importData || importData.length === 0}>
              
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <History className="w-6 h-6 text-blue-600" />
                Change History
              </h2>
              <button
              onClick={closeHistoryModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {changeHistory.map((entry) =>
              <div
                key={entry.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {entry.framework}
                        </span>
                        <Badge
                      variant={
                      entry.action === 'Created' ?
                      'success' :
                      entry.action === 'Approved' ?
                      'info' :
                      entry.action === 'Locked' ?
                      'warning' :
                      'default'
                      }>
                      
                          {entry.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{entry.details}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {entry.date} by {entry.user}
                      </p>
                    </div>
                  </div>
              )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t">
              <Button variant="outline" onClick={closeHistoryModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}