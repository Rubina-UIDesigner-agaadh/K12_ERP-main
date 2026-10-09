import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  createElement } from
'react';
// src/pages/academic/academics/curriculum/LearningOutcomesMapping.tsx
import {
  Target,
  Plus,
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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Save,
  Filter,
  Grid,
  List,
  BookOpen,
  Layers,
  Brain,
  FileText,
  Link,
  AlertTriangle } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
// ==================== TYPE DEFINITIONS ====================
interface LearningOutcome {
  id: number;
  code: string;
  description: string;
  subjectId: number;
  subjectName: string;
  chapterId: number | null;
  chapterName: string;
  bloomLevel: BloomLevel;
  assessmentType: AssessmentType;
  status: 'mapped' | 'unmapped' | 'partial';
  classLevel: string;
  academicYear: string;
  keywords: string[];
  prerequisites: number[];
  weightage: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  notes: string;
}
type BloomLevel =
'remember' |
'understand' |
'apply' |
'analyze' |
'evaluate' |
'create';
type AssessmentType =
'written' |
'oral' |
'practical' |
'project' |
'observation' |
'portfolio';
interface Subject {
  id: number;
  name: string;
  code: string;
}
interface Chapter {
  id: number;
  name: string;
  subjectId: number;
}
interface OutcomeFormData {
  code: string;
  description: string;
  subjectId: number;
  chapterId: number | null;
  bloomLevel: BloomLevel;
  assessmentType: AssessmentType;
  classLevel: string;
  keywords: string;
  weightage: number;
  notes: string;
}
interface SelectOption {
  value: string;
  label: string;
}
// ==================== CONSTANTS ====================
const BLOOM_LEVELS: {
  value: BloomLevel;
  label: string;
  order: number;
}[] = [
{
  value: 'remember',
  label: 'Remember',
  order: 1
},
{
  value: 'understand',
  label: 'Understand',
  order: 2
},
{
  value: 'apply',
  label: 'Apply',
  order: 3
},
{
  value: 'analyze',
  label: 'Analyze',
  order: 4
},
{
  value: 'evaluate',
  label: 'Evaluate',
  order: 5
},
{
  value: 'create',
  label: 'Create',
  order: 6
}];

const ASSESSMENT_TYPES: {
  value: AssessmentType;
  label: string;
}[] = [
{
  value: 'written',
  label: 'Written Test'
},
{
  value: 'oral',
  label: 'Oral/Viva'
},
{
  value: 'practical',
  label: 'Practical/Lab'
},
{
  value: 'project',
  label: 'Project Work'
},
{
  value: 'observation',
  label: 'Observation'
},
{
  value: 'portfolio',
  label: 'Portfolio'
}];

const STATUS_OPTIONS: SelectOption[] = [
{
  value: 'all',
  label: 'All Status'
},
{
  value: 'mapped',
  label: 'Mapped'
},
{
  value: 'unmapped',
  label: 'Unmapped'
},
{
  value: 'partial',
  label: 'Partial'
}];

const CLASS_LEVELS: string[] = [
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

const SORT_OPTIONS: SelectOption[] = [
{
  value: 'code',
  label: 'Code'
},
{
  value: 'description',
  label: 'Description'
},
{
  value: 'subject',
  label: 'Subject'
},
{
  value: 'bloomLevel',
  label: "Bloom's Level"
},
{
  value: 'status',
  label: 'Status'
},
{
  value: 'createdAt',
  label: 'Created Date'
}];

const ITEMS_PER_PAGE = 10;
const INITIAL_FORM_DATA: OutcomeFormData = {
  code: '',
  description: '',
  subjectId: 0,
  chapterId: null,
  bloomLevel: 'remember',
  assessmentType: 'written',
  classLevel: 'VI',
  keywords: '',
  weightage: 1,
  notes: ''
};
const SUBJECTS: Subject[] = [
{
  id: 1,
  name: 'Mathematics',
  code: 'MATH'
},
{
  id: 2,
  name: 'Science',
  code: 'SCI'
},
{
  id: 3,
  name: 'English',
  code: 'ENG'
},
{
  id: 4,
  name: 'Social Science',
  code: 'SST'
},
{
  id: 5,
  name: 'Hindi',
  code: 'HIN'
}];

const CHAPTERS: Chapter[] = [
{
  id: 1,
  name: 'Force and Laws of Motion',
  subjectId: 2
},
{
  id: 2,
  name: 'Gravitation',
  subjectId: 2
},
{
  id: 3,
  name: 'Work and Energy',
  subjectId: 2
},
{
  id: 4,
  name: 'Sound',
  subjectId: 2
},
{
  id: 5,
  name: 'Number Systems',
  subjectId: 1
},
{
  id: 6,
  name: 'Polynomials',
  subjectId: 1
},
{
  id: 7,
  name: 'Linear Equations',
  subjectId: 1
},
{
  id: 8,
  name: 'Tenses',
  subjectId: 3
},
{
  id: 9,
  name: 'Comprehension',
  subjectId: 3
},
{
  id: 10,
  name: 'French Revolution',
  subjectId: 4
}];

const INITIAL_OUTCOMES: LearningOutcome[] = [
{
  id: 1,
  code: 'SCI-9-PHY-01',
  description: 'Define the laws of motion and provide real-world examples.',
  subjectId: 2,
  subjectName: 'Science',
  chapterId: 1,
  chapterName: 'Force and Laws of Motion',
  bloomLevel: 'remember',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['newton', 'motion', 'laws', 'force'],
  prerequisites: [],
  weightage: 2,
  createdAt: '2024-01-15',
  createdBy: 'Admin',
  updatedAt: '2024-02-10',
  updatedBy: 'Academic Head',
  notes: 'Foundation concept for mechanics'
},
{
  id: 2,
  code: 'SCI-9-PHY-02',
  description:
  'Calculate the acceleration of an object given mass and force.',
  subjectId: 2,
  subjectName: 'Science',
  chapterId: 1,
  chapterName: 'Force and Laws of Motion',
  bloomLevel: 'apply',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['acceleration', 'mass', 'force', 'calculation'],
  prerequisites: [1],
  weightage: 3,
  createdAt: '2024-01-16',
  createdBy: 'Admin',
  updatedAt: '2024-02-10',
  updatedBy: 'Admin',
  notes: 'Numerical application of F=ma'
},
{
  id: 3,
  code: 'SCI-9-PHY-03',
  description: 'Analyze the effect of friction on moving objects.',
  subjectId: 2,
  subjectName: 'Science',
  chapterId: 1,
  chapterName: 'Force and Laws of Motion',
  bloomLevel: 'analyze',
  assessmentType: 'practical',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['friction', 'motion', 'surfaces', 'resistance'],
  prerequisites: [1, 2],
  weightage: 3,
  createdAt: '2024-01-17',
  createdBy: 'Admin',
  updatedAt: '2024-02-11',
  updatedBy: 'Academic Head',
  notes: 'Lab experiment required'
},
{
  id: 4,
  code: 'SCI-9-PHY-04',
  description: "Design an experiment to prove Newton's third law.",
  subjectId: 2,
  subjectName: 'Science',
  chapterId: 1,
  chapterName: 'Force and Laws of Motion',
  bloomLevel: 'create',
  assessmentType: 'project',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['newton', 'third law', 'action', 'reaction', 'experiment'],
  prerequisites: [1, 2, 3],
  weightage: 4,
  createdAt: '2024-01-18',
  createdBy: 'Admin',
  updatedAt: '2024-02-12',
  updatedBy: 'Admin',
  notes: 'Group project assessment'
},
{
  id: 5,
  code: 'SCI-9-PHY-05',
  description: 'Explain the concept of inertia in own words.',
  subjectId: 2,
  subjectName: 'Science',
  chapterId: null,
  chapterName: 'Unassigned',
  bloomLevel: 'understand',
  assessmentType: 'oral',
  status: 'unmapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['inertia', 'rest', 'motion', 'tendency'],
  prerequisites: [],
  weightage: 2,
  createdAt: '2024-01-19',
  createdBy: 'Admin',
  updatedAt: '2024-01-19',
  updatedBy: 'Admin',
  notes: 'Pending chapter assignment'
},
{
  id: 6,
  code: 'MATH-9-ALG-01',
  description: 'Identify different types of polynomials based on degree.',
  subjectId: 1,
  subjectName: 'Mathematics',
  chapterId: 6,
  chapterName: 'Polynomials',
  bloomLevel: 'remember',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['polynomials', 'degree', 'linear', 'quadratic', 'cubic'],
  prerequisites: [],
  weightage: 2,
  createdAt: '2024-01-20',
  createdBy: 'Admin',
  updatedAt: '2024-02-10',
  updatedBy: 'Academic Head',
  notes: 'Basic algebraic concepts'
},
{
  id: 7,
  code: 'MATH-9-ALG-02',
  description: 'Factorize polynomials using various methods.',
  subjectId: 1,
  subjectName: 'Mathematics',
  chapterId: 6,
  chapterName: 'Polynomials',
  bloomLevel: 'apply',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['factorization', 'polynomials', 'methods', 'algebraic'],
  prerequisites: [6],
  weightage: 3,
  createdAt: '2024-01-21',
  createdBy: 'Admin',
  updatedAt: '2024-02-11',
  updatedBy: 'Admin',
  notes: 'Multiple factorization techniques'
},
{
  id: 8,
  code: 'ENG-9-GRM-01',
  description: 'Use correct tense forms in various sentence structures.',
  subjectId: 3,
  subjectName: 'English',
  chapterId: 8,
  chapterName: 'Tenses',
  bloomLevel: 'apply',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['tenses', 'grammar', 'sentence', 'structure'],
  prerequisites: [],
  weightage: 2,
  createdAt: '2024-01-22',
  createdBy: 'Admin',
  updatedAt: '2024-02-10',
  updatedBy: 'Admin',
  notes: 'All 12 tense forms covered'
},
{
  id: 9,
  code: 'SST-9-HIS-01',
  description: 'Evaluate the causes and effects of the French Revolution.',
  subjectId: 4,
  subjectName: 'Social Science',
  chapterId: 10,
  chapterName: 'French Revolution',
  bloomLevel: 'evaluate',
  assessmentType: 'written',
  status: 'mapped',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['french revolution', 'causes', 'effects', 'history'],
  prerequisites: [],
  weightage: 4,
  createdAt: '2024-01-23',
  createdBy: 'Admin',
  updatedAt: '2024-02-12',
  updatedBy: 'Academic Head',
  notes: 'Critical analysis expected'
},
{
  id: 10,
  code: 'SCI-9-PHY-06',
  description: 'Compare gravitational force on Earth and Moon.',
  subjectId: 2,
  subjectName: 'Science',
  chapterId: 2,
  chapterName: 'Gravitation',
  bloomLevel: 'analyze',
  assessmentType: 'written',
  status: 'partial',
  classLevel: 'IX',
  academicYear: '2025-26',
  keywords: ['gravity', 'earth', 'moon', 'comparison', 'force'],
  prerequisites: [1],
  weightage: 3,
  createdAt: '2024-01-24',
  createdBy: 'Admin',
  updatedAt: '2024-02-13',
  updatedBy: 'Admin',
  notes: 'Partial mapping - needs assessment linkage'
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
const getCurrentDate = (): string => new Date().toISOString().split('T')[0];
const generateId = (existingIds: number[]): number =>
Math.max(0, ...existingIds) + 1;
const generateCode = (
subjectCode: string,
classLevel: string,
count: number)
: string => {
  return `${subjectCode}-${classLevel}-${String(count + 1).padStart(2, '0')}`;
};
const parseKeywords = (keywordsString: string): string[] => {
  return keywordsString.
  split(',').
  map((k) => k.trim().toLowerCase()).
  filter((k) => k.length > 0);
};
const getBloomLevelOrder = (level: BloomLevel): number => {
  return BLOOM_LEVELS.find((b) => b.value === level)?.order || 0;
};
// ==================== MAIN COMPONENT ====================
export function LearningOutcomesMapping(): React.ReactElement {
  // ==================== STATE MANAGEMENT ====================
  const [outcomes, setOutcomes] = useState<LearningOutcome[]>(INITIAL_OUTCOMES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterBloomLevel, setFilterBloomLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('code');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedOutcomes, setSelectedOutcomes] = useState<number[]>([]);
  const [selectedOutcome, setSelectedOutcome] =
  useState<LearningOutcome | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showMappingModal, setShowMappingModal] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState<OutcomeFormData>(INITIAL_FORM_DATA);
  const [importData, setImportData] = useState<LearningOutcome[] | null>(null);
  const [importError, setImportError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // ==================== COMPUTED VALUES ====================
  const filteredOutcomes = useMemo((): LearningOutcome[] => {
    let result = [...outcomes];
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
        o.code.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search) ||
        o.subjectName.toLowerCase().includes(search) ||
        o.chapterName.toLowerCase().includes(search) ||
        o.keywords.some((k) => k.includes(search))
      );
    }
    if (filterSubject !== 'all') {
      result = result.filter((o) => o.subjectId === parseInt(filterSubject));
    }
    if (filterBloomLevel !== 'all') {
      result = result.filter((o) => o.bloomLevel === filterBloomLevel);
    }
    if (filterStatus !== 'all') {
      result = result.filter((o) => o.status === filterStatus);
    }
    if (filterClass !== 'all') {
      result = result.filter((o) => o.classLevel === filterClass);
    }
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'code':
          comparison = a.code.localeCompare(b.code);
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'subject':
          comparison = a.subjectName.localeCompare(b.subjectName);
          break;
        case 'bloomLevel':
          comparison =
          getBloomLevelOrder(a.bloomLevel) - getBloomLevelOrder(b.bloomLevel);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'createdAt':
          comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [
  outcomes,
  searchTerm,
  filterSubject,
  filterBloomLevel,
  filterStatus,
  filterClass,
  sortBy,
  sortOrder]
  );
  const paginatedOutcomes = useMemo((): LearningOutcome[] => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOutcomes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOutcomes, currentPage]);
  const totalPages = useMemo(
    (): number => Math.ceil(filteredOutcomes.length / ITEMS_PER_PAGE),
    [filteredOutcomes.length]
  );
  const statistics = useMemo(
    () => ({
      total: outcomes.length,
      mapped: outcomes.filter((o) => o.status === 'mapped').length,
      unmapped: outcomes.filter((o) => o.status === 'unmapped').length,
      partial: outcomes.filter((o) => o.status === 'partial').length,
      byBloomLevel: BLOOM_LEVELS.map((level) => ({
        level: level.label,
        count: outcomes.filter((o) => o.bloomLevel === level.value).length
      })),
      bySubject: SUBJECTS.map((subject) => ({
        subject: subject.name,
        count: outcomes.filter((o) => o.subjectId === subject.id).length
      }))
    }),
    [outcomes]
  );
  const availableChapters = useMemo((): Chapter[] => {
    if (!formData.subjectId) return [];
    return CHAPTERS.filter((c) => c.subjectId === formData.subjectId);
  }, [formData.subjectId]);
  // ==================== FORM HANDLERS ====================
  const resetFormData = useCallback((): void => {
    setFormData(INITIAL_FORM_DATA);
  }, []);
  const updateFormField = useCallback(
    <K extends keyof OutcomeFormData,>(
    field: K,
    value: OutcomeFormData[K])
    : void => {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    },
    []
  );
  // ==================== MODAL HANDLERS ====================
  const openAddModal = useCallback((): void => {
    resetFormData();
    setShowAddModal(true);
  }, [resetFormData]);
  const closeAddModal = useCallback((): void => {
    setShowAddModal(false);
    resetFormData();
  }, [resetFormData]);
  const openEditModal = useCallback((outcome: LearningOutcome): void => {
    setSelectedOutcome(outcome);
    setFormData({
      code: outcome.code,
      description: outcome.description,
      subjectId: outcome.subjectId,
      chapterId: outcome.chapterId,
      bloomLevel: outcome.bloomLevel,
      assessmentType: outcome.assessmentType,
      classLevel: outcome.classLevel,
      keywords: outcome.keywords.join(', '),
      weightage: outcome.weightage,
      notes: outcome.notes
    });
    setShowEditModal(true);
  }, []);
  const closeEditModal = useCallback((): void => {
    setShowEditModal(false);
    setSelectedOutcome(null);
    resetFormData();
  }, [resetFormData]);
  const openViewModal = useCallback((outcome: LearningOutcome): void => {
    setSelectedOutcome(outcome);
    setShowViewModal(true);
  }, []);
  const closeViewModal = useCallback((): void => {
    setShowViewModal(false);
    setSelectedOutcome(null);
  }, []);
  const openDeleteModal = useCallback((outcome: LearningOutcome): void => {
    setSelectedOutcome(outcome);
    setShowDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback((): void => {
    setShowDeleteModal(false);
    setSelectedOutcome(null);
  }, []);
  const openMappingModal = useCallback((outcome: LearningOutcome): void => {
    setSelectedOutcome(outcome);
    setShowMappingModal(true);
  }, []);
  const closeMappingModal = useCallback((): void => {
    setShowMappingModal(false);
    setSelectedOutcome(null);
  }, []);
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
  // ==================== CRUD OPERATIONS ====================
  const saveOutcome = useCallback((): void => {
    const subject = SUBJECTS.find((s) => s.id === formData.subjectId);
    const chapter = CHAPTERS.find((c) => c.id === formData.chapterId);
    const currentDate = getCurrentDate();
    const isEditing = showEditModal && selectedOutcome;
    const newOutcome: LearningOutcome = {
      id: isEditing ?
      selectedOutcome.id :
      generateId(outcomes.map((o) => o.id)),
      code:
      formData.code ||
      generateCode(
        subject?.code || 'GEN',
        formData.classLevel,
        outcomes.length
      ),
      description: formData.description,
      subjectId: formData.subjectId,
      subjectName: subject?.name || 'Unknown',
      chapterId: formData.chapterId,
      chapterName: chapter?.name || 'Unassigned',
      bloomLevel: formData.bloomLevel,
      assessmentType: formData.assessmentType,
      status: formData.chapterId ? 'mapped' : 'unmapped',
      classLevel: formData.classLevel,
      academicYear: '2025-26',
      keywords: parseKeywords(formData.keywords),
      prerequisites: isEditing ? selectedOutcome.prerequisites : [],
      weightage: formData.weightage,
      createdAt: isEditing ? selectedOutcome.createdAt : currentDate,
      createdBy: isEditing ? selectedOutcome.createdBy : 'Current User',
      updatedAt: currentDate,
      updatedBy: 'Current User',
      notes: formData.notes
    };
    if (isEditing) {
      setOutcomes((prev) =>
      prev.map((o) => o.id === selectedOutcome.id ? newOutcome : o)
      );
    } else {
      setOutcomes((prev) => [...prev, newOutcome]);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedOutcome(null);
    resetFormData();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  }, [formData, showEditModal, selectedOutcome, outcomes, resetFormData]);
  const deleteOutcome = useCallback((): void => {
    if (!selectedOutcome) return;
    setOutcomes((prev) => prev.filter((o) => o.id !== selectedOutcome.id));
    closeDeleteModal();
  }, [selectedOutcome, closeDeleteModal]);
  const updateMapping = useCallback(
    (chapterId: number | null): void => {
      if (!selectedOutcome) return;
      const chapter = CHAPTERS.find((c) => c.id === chapterId);
      setOutcomes((prev) =>
      prev.map((o) =>
      o.id === selectedOutcome.id ?
      {
        ...o,
        chapterId,
        chapterName: chapter?.name || 'Unassigned',
        status: chapterId ? 'mapped' : 'unmapped',
        updatedAt: getCurrentDate(),
        updatedBy: 'Current User'
      } :
      o
      )
      );
      closeMappingModal();
    },
    [selectedOutcome, closeMappingModal]
  );
  const duplicateOutcome = useCallback(
    (outcome: LearningOutcome): void => {
      const duplicate: LearningOutcome = {
        ...outcome,
        id: generateId(outcomes.map((o) => o.id)),
        code: `${outcome.code}-COPY`,
        status: 'unmapped',
        chapterId: null,
        chapterName: 'Unassigned',
        createdAt: getCurrentDate(),
        updatedAt: getCurrentDate(),
        createdBy: 'Current User',
        updatedBy: 'Current User'
      };
      setOutcomes((prev) => [...prev, duplicate]);
    },
    [outcomes]
  );
  // ==================== SELECTION HANDLERS ====================
  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      setSelectedOutcomes(
        e.target.checked ? paginatedOutcomes.map((o) => o.id) : []
      );
    },
    [paginatedOutcomes]
  );
  const toggleOutcomeSelection = useCallback((id: number): void => {
    setSelectedOutcomes((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);
  const clearSelection = useCallback((): void => {
    setSelectedOutcomes([]);
  }, []);
  // ==================== BULK OPERATIONS ====================
  const bulkUpdateStatus = useCallback(
    (status: LearningOutcome['status']): void => {
      setOutcomes((prev) =>
      prev.map((o) =>
      selectedOutcomes.includes(o.id) ?
      {
        ...o,
        status,
        updatedAt: getCurrentDate(),
        updatedBy: 'Current User'
      } :
      o
      )
      );
      clearSelection();
    },
    [selectedOutcomes, clearSelection]
  );
  const bulkDelete = useCallback((): void => {
    setOutcomes((prev) => prev.filter((o) => !selectedOutcomes.includes(o.id)));
    clearSelection();
  }, [selectedOutcomes, clearSelection]);
  // ==================== EXPORT/IMPORT HANDLERS ====================
  const exportToJSON = useCallback((): void => {
    const exportData =
    selectedOutcomes.length > 0 ?
    outcomes.filter((o) => selectedOutcomes.includes(o.id)) :
    outcomes;
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `learning-outcomes-${getCurrentDate()}.json`;
    link.click();
    clearSelection();
  }, [outcomes, selectedOutcomes, clearSelection]);
  const exportToCSV = useCallback((): void => {
    const exportData =
    selectedOutcomes.length > 0 ?
    outcomes.filter((o) => selectedOutcomes.includes(o.id)) :
    outcomes;
    const headers = [
    'Code',
    'Description',
    'Subject',
    'Chapter',
    "Bloom's Level",
    'Assessment Type',
    'Status',
    'Class'];

    const csvRows = [
    headers.join(','),
    ...exportData.map((o) =>
    [
    o.code,
    `"${o.description}"`,
    o.subjectName,
    o.chapterName,
    o.bloomLevel,
    o.assessmentType,
    o.status,
    o.classLevel].
    join(',')
    )];

    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `learning-outcomes-${getCurrentDate()}.csv`;
    link.click();
    clearSelection();
  }, [outcomes, selectedOutcomes, clearSelection]);
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          setImportData(Array.isArray(parsed) ? parsed : [parsed]);
          setImportError('');
        } catch {
          setImportError('Invalid JSON file format.');
          setImportData(null);
        }
      };
      reader.readAsText(file);
    },
    []
  );
  const confirmImport = useCallback((): void => {
    if (!importData?.length) return;
    const existingIds = outcomes.map((o) => o.id);
    const newOutcomes = importData.map((o, i) => ({
      ...o,
      id:
      generateId([
      ...existingIds,
      ...existingIds.map(
        (_, idx) => existingIds[existingIds.length - 1] + idx + 1
      )]
      ) + i,
      status: 'unmapped' as const,
      createdAt: getCurrentDate(),
      updatedAt: getCurrentDate()
    }));
    setOutcomes((prev) => [...prev, ...newOutcomes]);
    closeImportModal();
  }, [importData, outcomes, closeImportModal]);
  // ==================== FILTER HANDLERS ====================
  const clearFilters = useCallback((): void => {
    setSearchTerm('');
    setFilterSubject('all');
    setFilterBloomLevel('all');
    setFilterStatus('all');
    setFilterClass('all');
    setSortBy('code');
    setSortOrder('asc');
    setCurrentPage(1);
  }, []);
  const toggleSortOrder = useCallback((): void => {
    setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc');
  }, []);
  // ==================== PAGINATION HANDLERS ====================
  const goToPage = useCallback((page: number): void => setCurrentPage(page), []);
  const goToPreviousPage = useCallback(
    (): void => setCurrentPage((p) => Math.max(1, p - 1)),
    []
  );
  const goToNextPage = useCallback(
    (): void => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages]
  );
  const getVisiblePageNumbers = useCallback((): number[] => {
    const pages = Array.from(
      {
        length: totalPages
      },
      (_, i) => i + 1
    );
    return pages.slice(
      Math.max(0, currentPage - 3),
      Math.min(totalPages, currentPage + 2)
    );
  }, [totalPages, currentPage]);
  // ==================== BADGE RENDERERS ====================
  const renderBloomBadge = (level: BloomLevel): React.ReactElement => {
    const variants: Record<BloomLevel, string> = {
      remember: 'bg-gray-100 text-gray-700',
      understand: 'bg-blue-100 text-blue-700',
      apply: 'bg-green-100 text-green-700',
      analyze: 'bg-purple-100 text-purple-700',
      evaluate: 'bg-orange-100 text-orange-700',
      create: 'bg-red-100 text-red-700'
    };
    const label = BLOOM_LEVELS.find((b) => b.value === level)?.label || level;
    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${variants[level]}`}>
        
        {label}
      </span>);

  };
  const renderStatusBadge = (status: string): React.ReactElement => {
    switch (status) {
      case 'mapped':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Mapped
          </Badge>);

      case 'unmapped':
        return (
          <Badge variant="warning">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unmapped
          </Badge>);

      case 'partial':
        return (
          <Badge variant="info">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Partial
          </Badge>);

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };
  // ==================== VALIDATION ====================
  const isFormValid = useMemo((): boolean => {
    return formData.description.trim() !== '' && formData.subjectId > 0;
  }, [formData]);
  // ==================== RENDER ====================
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Learning Outcomes Mapping
          </h1>
          <p className="text-sm text-gray-500">
            Map learning outcomes to subjects, chapters, and Bloom's Taxonomy
            levels
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
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
            Add Outcome
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess &&
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-green-700 font-medium">
            Learning outcome saved successfully!
          </p>
        </div>
      }

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.total}
              </p>
              <p className="text-xs text-gray-500">Total Outcomes</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.mapped}
              </p>
              <p className="text-xs text-gray-500">Mapped</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.unmapped}
              </p>
              <p className="text-xs text-gray-500">Unmapped</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.partial}
              </p>
              <p className="text-xs text-gray-500">Partial</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search outcomes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) =>
            <option key={s.id} value={s.id}>
                {s.name}
              </option>
            )}
          </select>
          <select
            value={filterBloomLevel}
            onChange={(e) => setFilterBloomLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            
            <option value="all">All Bloom's Levels</option>
            {BLOOM_LEVELS.map((b) =>
            <option key={b.value} value={b.value}>
                {b.label}
              </option>
            )}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            
            {STATUS_OPTIONS.map((s) =>
            <option key={s.value} value={s.value}>
                {s.label}
              </option>
            )}
          </select>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            
            <option value="all">All Classes</option>
            {CLASS_LEVELS.map((c) =>
            <option key={c} value={c}>
                Class {c}
              </option>
            )}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            
            {SORT_OPTIONS.map((s) =>
            <option key={s.value} value={s.value}>
                Sort by {s.label}
              </option>
            )}
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            
            {sortOrder === 'asc' ?
            <ChevronUp className="w-5 h-5" /> :

            <ChevronDown className="w-5 h-5" />
            }
          </button>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
              
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}>
              
              <Grid className="w-5 h-5" />
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Bulk Actions */}
        {selectedOutcomes.length > 0 &&
        <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              {selectedOutcomes.length} selected
            </span>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => bulkUpdateStatus('mapped')}>
            
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Mapped
            </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => bulkUpdateStatus('unmapped')}>
            
              <AlertCircle className="w-4 h-4 mr-1" />
              Mark Unmapped
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
          Showing {filteredOutcomes.length} of {outcomes.length} outcomes
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
                    selectedOutcomes.length === paginatedOutcomes.length &&
                    paginatedOutcomes.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded" />
                  
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Code
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600 w-1/3">
                    Description
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Subject / Chapter
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Bloom's Level
                  </th>
                  <th className="py-3 px-4 text-left font-medium text-gray-600">
                    Assessment
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
                {paginatedOutcomes.map((outcome) =>
              <tr
                key={outcome.id}
                className="border-b border-gray-100 hover:bg-gray-50">
                
                    <td className="py-3 px-4">
                      <input
                    type="checkbox"
                    checked={selectedOutcomes.includes(outcome.id)}
                    onChange={() => toggleOutcomeSelection(outcome.id)}
                    className="rounded" />
                  
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        {outcome.code}
                      </span>
                      <p className="text-xs text-gray-500">
                        Class {outcome.classLevel}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {outcome.description}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium">{outcome.subjectName}</p>
                      <p className="text-xs text-gray-500">
                        {outcome.chapterName}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {renderBloomBadge(outcome.bloomLevel)}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {
                  ASSESSMENT_TYPES.find(
                    (a) => a.value === outcome.assessmentType
                  )?.label
                  }
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(outcome.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                      onClick={() => openViewModal(outcome)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="View">
                      
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => openEditModal(outcome)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit">
                      
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => openMappingModal(outcome)}
                      className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Map">
                      
                          <Link className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => duplicateOutcome(outcome)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Duplicate">
                      
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                      onClick={() => openDeleteModal(outcome)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
            {paginatedOutcomes.map((outcome) =>
          <div
            key={outcome.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white">
            
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <input
                  type="checkbox"
                  checked={selectedOutcomes.includes(outcome.id)}
                  onChange={() => toggleOutcomeSelection(outcome.id)}
                  className="rounded" />
                
                    <span className="font-medium text-gray-900">
                      {outcome.code}
                    </span>
                  </div>
                  {renderStatusBadge(outcome.status)}
                </div>
                <p className="text-sm text-gray-800 mb-3 line-clamp-2">
                  {outcome.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-600">
                    {outcome.subjectName}
                  </span>
                  {renderBloomBadge(outcome.bloomLevel)}
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {outcome.chapterName}
                </p>
                <div className="flex gap-1 pt-3 border-t border-gray-100">
                  <button
                onClick={() => openViewModal(outcome)}
                className="flex-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-center text-sm">
                
                    <Eye className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                onClick={() => openEditModal(outcome)}
                className="flex-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-center text-sm">
                
                    <Edit className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                onClick={() => openMappingModal(outcome)}
                className="flex-1 p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg text-center text-sm">
                
                    <Link className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
          )}
          </div>
        }

        {/* Empty State */}
        {filteredOutcomes.length === 0 &&
        <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-lg text-gray-700">
              No outcomes found
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your filters or add a new outcome
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
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredOutcomes.length)}{' '}
              of {filteredOutcomes.length}
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

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                {showEditModal ?
              <Edit className="w-6 h-6 text-blue-600" /> :

              <Plus className="w-6 h-6 text-blue-600" />
              }
                {showEditModal ? 'Edit Outcome' : 'Add New Outcome'}
              </h2>
              <button
              onClick={showEditModal ? closeEditModal : closeAddModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome Code
                  </label>
                  <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => updateFormField('code', e.target.value)}
                  placeholder="Auto-generated if empty"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class Level *
                  </label>
                  <select
                  value={formData.classLevel}
                  onChange={(e) =>
                  updateFormField('classLevel', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  
                    {CLASS_LEVELS.map((c) =>
                  <option key={c} value={c}>
                        Class {c}
                      </option>
                  )}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                value={formData.description}
                onChange={(e) =>
                updateFormField('description', e.target.value)
                }
                rows={3}
                placeholder="Enter learning outcome description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                  value={formData.subjectId}
                  onChange={(e) => {
                    updateFormField('subjectId', parseInt(e.target.value));
                    updateFormField('chapterId', null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  
                    <option value={0}>Select Subject</option>
                    {SUBJECTS.map((s) =>
                  <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter
                  </label>
                  <select
                  value={formData.chapterId || ''}
                  onChange={(e) =>
                  updateFormField(
                    'chapterId',
                    e.target.value ? parseInt(e.target.value) : null
                  )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  disabled={!formData.subjectId}>
                  
                    <option value="">Select Chapter (Optional)</option>
                    {availableChapters.map((c) =>
                  <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                  )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bloom's Level *
                  </label>
                  <select
                  value={formData.bloomLevel}
                  onChange={(e) =>
                  updateFormField(
                    'bloomLevel',
                    e.target.value as BloomLevel
                  )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  
                    {BLOOM_LEVELS.map((b) =>
                  <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                  )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assessment Type *
                  </label>
                  <select
                  value={formData.assessmentType}
                  onChange={(e) =>
                  updateFormField(
                    'assessmentType',
                    e.target.value as AssessmentType
                  )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
                  
                    {ASSESSMENT_TYPES.map((a) =>
                  <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                  )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) =>
                  updateFormField('keywords', e.target.value)
                  }
                  placeholder="e.g. newton, motion, force"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weightage (1-5)
                  </label>
                  <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.weightage}
                  onChange={(e) =>
                  updateFormField(
                    'weightage',
                    parseInt(e.target.value) || 1
                  )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                value={formData.notes}
                onChange={(e) => updateFormField('notes', e.target.value)}
                rows={2}
                placeholder="Additional notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button
              variant="outline"
              onClick={showEditModal ? closeEditModal : closeAddModal}>
              
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={saveOutcome}
              disabled={!isFormValid}>
              
                <Save className="w-4 h-4 mr-2" />
                Save Outcome
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Modal */}
      {showViewModal && selectedOutcome &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-start p-6 border-b bg-gradient-to-r from-blue-50 to-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedOutcome.code}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    {renderStatusBadge(selectedOutcome.status)}
                    {renderBloomBadge(selectedOutcome.bloomLevel)}
                  </div>
                </div>
              </div>
              <button
              onClick={closeViewModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Description
                </p>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {selectedOutcome.description}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Subject
                  </p>
                  <p className="font-semibold">{selectedOutcome.subjectName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Chapter
                  </p>
                  <p className="font-semibold">{selectedOutcome.chapterName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">Class</p>
                  <p className="font-semibold">{selectedOutcome.classLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Weightage
                  </p>
                  <p className="font-semibold">{selectedOutcome.weightage}/5</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Assessment Type
                  </p>
                  <p className="font-semibold">
                    {
                  ASSESSMENT_TYPES.find(
                    (a) => a.value === selectedOutcome.assessmentType
                  )?.label
                  }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase mb-1">
                    Academic Year
                  </p>
                  <p className="font-semibold">
                    {selectedOutcome.academicYear}
                  </p>
                </div>
              </div>
              {selectedOutcome.keywords.length > 0 &&
            <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOutcome.keywords.map((k, i) =>
                <Badge key={i} variant="outline">
                        {k}
                      </Badge>
                )}
                  </div>
                </div>
            }
              {selectedOutcome.notes &&
            <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Notes
                  </p>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                    {selectedOutcome.notes}
                  </p>
                </div>
            }
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl text-sm">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedOutcome.createdAt)} by{' '}
                    {selectedOutcome.createdBy}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Updated</p>
                  <p className="font-medium">
                    {formatDate(selectedOutcome.updatedAt)} by{' '}
                    {selectedOutcome.updatedBy}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                closeViewModal();
                openMappingModal(selectedOutcome);
              }}>
              
                <Link className="w-4 h-4 mr-1" />
                Update Mapping
              </Button>
              <div className="flex gap-2">
                <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  closeViewModal();
                  openEditModal(selectedOutcome);
                }}>
                
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

      {/* Mapping Modal */}
      {showMappingModal && selectedOutcome &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Link className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Update Chapter Mapping
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              Outcome: <strong>{selectedOutcome.code}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Current: {selectedOutcome.chapterName}
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Chapter
              </label>
              <select
              defaultValue={selectedOutcome.chapterId || ''}
              onChange={(e) =>
              updateMapping(
                e.target.value ? parseInt(e.target.value) : null
              )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white">
              
                <option value="">Unassigned</option>
                {CHAPTERS.filter(
                (c) => c.subjectId === selectedOutcome.subjectId
              ).map((c) =>
              <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
              )}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeMappingModal}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Modal */}
      {showDeleteModal && selectedOutcome &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Delete Outcome
              </h2>
            </div>
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete{' '}
              <strong>{selectedOutcome.code}</strong>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="danger" onClick={deleteOutcome}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Upload className="w-6 h-6 text-blue-600" />
                Import Outcomes
              </h2>
              <button
              onClick={closeImportModal}
              className="p-2 hover:bg-gray-100 rounded-lg">
              
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}>
              
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
              {importError &&
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  {importError}
                </div>
            }
              {importData &&
            <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      Ready to import {importData.length} outcome(s)
                    </span>
                  </div>
                </div>
            }
            </div>
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={closeImportModal}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={confirmImport}
              disabled={!importData?.length}>
              
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}