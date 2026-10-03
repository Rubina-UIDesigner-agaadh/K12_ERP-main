import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Settings,
  Layers,
  Sparkles,
  ClipboardList,
  GraduationCap,
  Heart,
  Brain,
  Target,
  TrendingUp,
  Search,
  Copy,
  Award,
  X,
  Save,
  Home,
  Check } from
'lucide-react';

// ==================== TYPES ====================

type EvaluationType =
'scholastic' |
'co-scholastic' |
'discipline' |
'work-education' |
'health-physical' |
'life-skills';

type GradeType = 'marks' | 'grade' | 'descriptive';

interface Indicator {
  id: string;
  code: string;
  name: string;
  description?: string;
  classId: string;
  evaluationType: EvaluationType;
  gradeType: GradeType;
  maxMarks?: number;
  skillCategory?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ClassConfig {
  id: string;
  standard: string;
  label: string;
  evaluationTypes: EvaluationType[];
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
}

interface EvaluationConfig {
  type: EvaluationType;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

// ==================== CONFIGURATIONS ====================

const EVALUATION_CONFIGS: Record<EvaluationType, EvaluationConfig> = {
  scholastic: {
    type: 'scholastic',
    label: 'Scholastic Areas',
    shortLabel: 'Scholastic',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Academic subjects and learning outcomes assessment'
  },
  'co-scholastic': {
    type: 'co-scholastic',
    label: 'Co-Scholastic Areas',
    shortLabel: 'Co-Scholastic',
    icon: Sparkles,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Art, Music, Dance, Drama & Sports activities'
  },
  discipline: {
    type: 'discipline',
    label: 'Discipline',
    shortLabel: 'Discipline',
    icon: ClipboardList,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'Behavioral conduct and discipline indicators'
  },
  'work-education': {
    type: 'work-education',
    label: 'Work Education',
    shortLabel: 'Work Ed.',
    icon: Settings,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Practical work and vocational skill development'
  },
  'health-physical': {
    type: 'health-physical',
    label: 'Health & Physical Education',
    shortLabel: 'Health & PE',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    description: 'Physical fitness and health awareness'
  },
  'life-skills': {
    type: 'life-skills',
    label: 'Life Skills',
    shortLabel: 'Life Skills',
    icon: Brain,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Communication, leadership, teamwork & critical thinking'
  }
};

const CLASS_CONFIGS: ClassConfig[] = [
{
  id: 'class-1',
  standard: '1',
  label: 'Class 1',
  evaluationTypes: ['scholastic', 'co-scholastic'],
  color: 'text-rose-600',
  bgColor: 'bg-rose-50',
  borderColor: 'border-rose-200',
  gradientFrom: 'from-rose-500',
  gradientTo: 'to-rose-600'
},
{
  id: 'class-2',
  standard: '2',
  label: 'Class 2',
  evaluationTypes: ['scholastic', 'co-scholastic'],
  color: 'text-orange-600',
  bgColor: 'bg-orange-50',
  borderColor: 'border-orange-200',
  gradientFrom: 'from-orange-500',
  gradientTo: 'to-orange-600'
},
{
  id: 'class-3',
  standard: '3',
  label: 'Class 3',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education'],
  color: 'text-amber-600',
  bgColor: 'bg-amber-50',
  borderColor: 'border-amber-200',
  gradientFrom: 'from-amber-500',
  gradientTo: 'to-amber-600'
},
{
  id: 'class-4',
  standard: '4',
  label: 'Class 4',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education'],
  color: 'text-lime-600',
  bgColor: 'bg-lime-50',
  borderColor: 'border-lime-200',
  gradientFrom: 'from-lime-500',
  gradientTo: 'to-lime-600'
},
{
  id: 'class-5',
  standard: '5',
  label: 'Class 5',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education', 'life-skills'],
  color: 'text-green-600',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-200',
  gradientFrom: 'from-green-500',
  gradientTo: 'to-green-600'
},
{
  id: 'class-6',
  standard: '6',
  label: 'Class 6',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education', 'health-physical', 'life-skills'],
  color: 'text-teal-600',
  bgColor: 'bg-teal-50',
  borderColor: 'border-teal-200',
  gradientFrom: 'from-teal-500',
  gradientTo: 'to-teal-600'
},
{
  id: 'class-7',
  standard: '7',
  label: 'Class 7',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education', 'health-physical', 'life-skills'],
  color: 'text-cyan-600',
  bgColor: 'bg-cyan-50',
  borderColor: 'border-cyan-200',
  gradientFrom: 'from-cyan-500',
  gradientTo: 'to-cyan-600'
},
{
  id: 'class-8',
  standard: '8',
  label: 'Class 8',
  evaluationTypes: ['scholastic', 'co-scholastic', 'discipline', 'work-education', 'health-physical', 'life-skills'],
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  borderColor: 'border-blue-200',
  gradientFrom: 'from-blue-500',
  gradientTo: 'to-blue-600'
}];


const SKILL_CATEGORIES = [
'Reading',
'Writing',
'Speaking',
'Listening',
'Numeracy',
'Creativity',
'Leadership',
'Teamwork',
'Discipline',
'Communication',
'Critical Thinking',
'Problem Solving',
'Physical Fitness',
'Social Skills'];


const GRADE_TYPES: {value: GradeType;label: string;description: string;}[] = [
{ value: 'grade', label: 'Grade Based', description: 'A, B, C, D, E grades' },
{ value: 'marks', label: 'Marks Based', description: 'Numerical marks' },
{ value: 'descriptive', label: 'Descriptive', description: 'Written feedback' }];


// ==================== INITIAL DATA ====================

const INITIAL_INDICATORS: Indicator[] = [
{
  id: '1',
  code: 'C1-SCH-01',
  name: 'Recognizes and reads alphabets (A-Z)',
  description: 'Ability to identify and pronounce all English alphabets correctly',
  classId: 'class-1',
  evaluationType: 'scholastic',
  gradeType: 'descriptive',
  skillCategory: 'Reading',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '2',
  code: 'C1-SCH-02',
  name: 'Writes alphabets clearly',
  description: 'Can write both uppercase and lowercase letters legibly',
  classId: 'class-1',
  evaluationType: 'scholastic',
  gradeType: 'descriptive',
  skillCategory: 'Writing',
  displayOrder: 2,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '3',
  code: 'C1-SCH-03',
  name: 'Identifies numbers 1-100',
  description: 'Can recognize and count numbers from 1 to 100',
  classId: 'class-1',
  evaluationType: 'scholastic',
  gradeType: 'descriptive',
  skillCategory: 'Numeracy',
  displayOrder: 3,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '4',
  code: 'C1-COS-01',
  name: 'Participates in drawing activities',
  description: 'Shows interest and participation in art activities',
  classId: 'class-1',
  evaluationType: 'co-scholastic',
  gradeType: 'grade',
  skillCategory: 'Creativity',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '5',
  code: 'C1-COS-02',
  name: 'Enjoys rhymes and songs',
  description: 'Actively participates in singing rhymes and songs',
  classId: 'class-1',
  evaluationType: 'co-scholastic',
  gradeType: 'grade',
  displayOrder: 2,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '6',
  code: 'C3-SCH-01',
  name: 'Comprehends simple text passages',
  description: 'Understands and answers questions from short passages',
  classId: 'class-3',
  evaluationType: 'scholastic',
  gradeType: 'marks',
  maxMarks: 100,
  skillCategory: 'Reading',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '7',
  code: 'C3-DIS-01',
  name: 'Maintains discipline in class',
  description: 'Follows classroom rules and instructions',
  classId: 'class-3',
  evaluationType: 'discipline',
  gradeType: 'grade',
  skillCategory: 'Discipline',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '8',
  code: 'C5-LIF-01',
  name: 'Demonstrates leadership qualities',
  description: 'Takes initiative and guides peers in group activities',
  classId: 'class-5',
  evaluationType: 'life-skills',
  gradeType: 'grade',
  skillCategory: 'Leadership',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
},
{
  id: '9',
  code: 'C6-HPE-01',
  name: 'Participates actively in physical activities',
  description: 'Shows enthusiasm in sports and physical exercises',
  classId: 'class-6',
  evaluationType: 'health-physical',
  gradeType: 'grade',
  skillCategory: 'Physical Fitness',
  displayOrder: 1,
  isActive: true,
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10'
}];


// ==================== MAIN COMPONENT ====================

export function CceIndicatorMaster() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'classes' | 'evaluations' | 'indicators'>('classes');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedEvalType, setSelectedEvalType] = useState<EvaluationType | null>(null);

  // Data State
  const [indicators, setIndicators] = useState<Indicator[]>(INITIAL_INDICATORS);
  const [academicYear, setAcademicYear] = useState('2024-25');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    gradeType: 'grade' as GradeType,
    maxMarks: 100,
    skillCategory: '',
    displayOrder: 1,
    isActive: true
  });

  // ==================== COMPUTED VALUES ====================

  const selectedClass = useMemo(() => {
    return CLASS_CONFIGS.find((c) => c.id === selectedClassId) || null;
  }, [selectedClassId]);

  const selectedEvaluation = useMemo(() => {
    return selectedEvalType ? EVALUATION_CONFIGS[selectedEvalType] : null;
  }, [selectedEvalType]);

  const filteredIndicators = useMemo(() => {
    if (!selectedClassId || !selectedEvalType) return [];

    return indicators.
    filter((ind) => ind.classId === selectedClassId && ind.evaluationType === selectedEvalType).
    filter((ind) => {
      if (filterActive === 'active') return ind.isActive;
      if (filterActive === 'inactive') return !ind.isActive;
      return true;
    }).
    filter((ind) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        ind.name.toLowerCase().includes(query) ||
        ind.code.toLowerCase().includes(query) ||
        ind.description?.toLowerCase().includes(query) ||
        ind.skillCategory?.toLowerCase().includes(query));

    }).
    sort((a, b) => a.displayOrder - b.displayOrder);
  }, [indicators, selectedClassId, selectedEvalType, filterActive, searchQuery]);

  // ==================== HELPER FUNCTIONS ====================

  const getIndicatorCount = useCallback((classId: string, evalType?: EvaluationType) => {
    return indicators.filter((ind) => {
      if (evalType) {
        return ind.classId === classId && ind.evaluationType === evalType && ind.isActive;
      }
      return ind.classId === classId && ind.isActive;
    }).length;
  }, [indicators]);

  const getTotalIndicators = useCallback(() => {
    return indicators.filter((i) => i.isActive).length;
  }, [indicators]);

  // ==================== NAVIGATION ====================

  const handleSelectClass = useCallback((classId: string) => {
    console.log('Selecting class:', classId);
    setSelectedClassId(classId);
    setSelectedEvalType(null);
    setCurrentView('evaluations');
    setSearchQuery('');
    setFilterActive('all');
  }, []);

  const handleSelectEvaluation = useCallback((evalType: EvaluationType) => {
    console.log('Selecting evaluation:', evalType);
    setSelectedEvalType(evalType);
    setCurrentView('indicators');
    setSearchQuery('');
    setFilterActive('all');
  }, []);

  const handleGoBack = useCallback(() => {
    if (currentView === 'indicators') {
      setSelectedEvalType(null);
      setCurrentView('evaluations');
    } else if (currentView === 'evaluations') {
      setSelectedClassId(null);
      setCurrentView('classes');
    }
    setSearchQuery('');
    setFilterActive('all');
  }, [currentView]);

  const handleGoHome = useCallback(() => {
    setSelectedClassId(null);
    setSelectedEvalType(null);
    setCurrentView('classes');
    setSearchQuery('');
    setFilterActive('all');
  }, []);

  // ==================== CRUD OPERATIONS ====================

  const handleOpenAddModal = useCallback(() => {
    if (!selectedClass || !selectedEvaluation) return;

    const existingIndicators = indicators.filter(
      (i) => i.classId === selectedClassId && i.evaluationType === selectedEvalType
    );
    const nextOrder = existingIndicators.length + 1;
    const prefix = `C${selectedClass.standard}-${selectedEvaluation.shortLabel.replace(/[^A-Z]/g, '').substring(0, 3).toUpperCase()}`;

    setFormData({
      code: `${prefix}-${String(nextOrder).padStart(2, '0')}`,
      name: '',
      description: '',
      gradeType: 'grade',
      maxMarks: 100,
      skillCategory: '',
      displayOrder: nextOrder,
      isActive: true
    });
    setEditingIndicator(null);
    setShowModal(true);
  }, [selectedClass, selectedEvaluation, indicators, selectedClassId, selectedEvalType]);

  const handleOpenEditModal = useCallback((indicator: Indicator) => {
    setFormData({
      code: indicator.code,
      name: indicator.name,
      description: indicator.description || '',
      gradeType: indicator.gradeType,
      maxMarks: indicator.maxMarks || 100,
      skillCategory: indicator.skillCategory || '',
      displayOrder: indicator.displayOrder,
      isActive: indicator.isActive
    });
    setEditingIndicator(indicator);
    setShowModal(true);
  }, []);

  const handleSaveIndicator = useCallback(() => {
    if (!formData.code || !formData.name || !selectedClassId || !selectedEvalType) return;

    const now = new Date().toISOString().split('T')[0];

    if (editingIndicator) {
      setIndicators((prev) => prev.map((ind) => {
        if (ind.id === editingIndicator.id) {
          return {
            ...ind,
            code: formData.code,
            name: formData.name,
            description: formData.description || undefined,
            gradeType: formData.gradeType,
            maxMarks: formData.gradeType === 'marks' ? formData.maxMarks : undefined,
            skillCategory: formData.skillCategory || undefined,
            displayOrder: formData.displayOrder,
            isActive: formData.isActive,
            updatedAt: now
          };
        }
        return ind;
      }));
    } else {
      const newIndicator: Indicator = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        description: formData.description || undefined,
        classId: selectedClassId,
        evaluationType: selectedEvalType,
        gradeType: formData.gradeType,
        maxMarks: formData.gradeType === 'marks' ? formData.maxMarks : undefined,
        skillCategory: formData.skillCategory || undefined,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
        createdAt: now,
        updatedAt: now
      };
      setIndicators((prev) => [...prev, newIndicator]);
    }

    setShowModal(false);
    setEditingIndicator(null);
  }, [formData, editingIndicator, selectedClassId, selectedEvalType]);

  const handleDeleteIndicator = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this indicator?')) {
      setIndicators((prev) => prev.filter((ind) => ind.id !== id));
    }
  }, []);

  const handleToggleActive = useCallback((id: string) => {
    setIndicators((prev) => prev.map((ind) => {
      if (ind.id === id) {
        return {
          ...ind,
          isActive: !ind.isActive,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return ind;
    }));
  }, []);

  const handleDuplicateIndicator = useCallback((indicator: Indicator) => {
    const existingIndicators = indicators.filter(
      (i) => i.classId === indicator.classId && i.evaluationType === indicator.evaluationType
    );
    const now = new Date().toISOString().split('T')[0];

    const newIndicator: Indicator = {
      ...indicator,
      id: Date.now().toString(),
      code: `${indicator.code}-COPY`,
      name: `${indicator.name} (Copy)`,
      displayOrder: existingIndicators.length + 1,
      createdAt: now,
      updatedAt: now
    };
    setIndicators((prev) => [...prev, newIndicator]);
  }, [indicators]);

  // ==================== RENDER: CLASSES VIEW ====================

  const renderClassesView = () =>
  <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CCE Indicator Master</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure evaluation indicators for each class and evaluation type
          </p>
        </div>
        <select
        value={academicYear}
        onChange={(e) => setAcademicYear(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

          <option value="2024-25">AY 2024-25</option>
          <option value="2023-24">AY 2023-24</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Indicators</p>
              <p className="text-3xl font-bold">{getTotalIndicators()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100 text-sm font-medium">Classes</p>
              <p className="text-3xl font-bold">{CLASS_CONFIGS.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-sm font-medium">Evaluation Types</p>
              <p className="text-3xl font-bold">{Object.keys(EVALUATION_CONFIGS).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-amber-100 text-sm font-medium">Skill Categories</p>
              <p className="text-3xl font-bold">{SKILL_CATEGORIES.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Classes (1-2) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Primary Classes (1-2)</h2>
            <p className="text-sm text-gray-500">Basic subject skill evaluation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CLASS_CONFIGS.filter((c) => ['1', '2'].includes(c.standard)).map((config) =>
        <div
          key={config.id}
          onClick={() => handleSelectClass(config.id)}
          className={`bg-white border-2 ${config.borderColor} rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1`}>

              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{config.standard}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">{config.label}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {config.evaluationTypes.map((et) => {
              const evalConfig = EVALUATION_CONFIGS[et];
              return (
                <span key={et} className={`text-xs px-2 py-0.5 rounded-full ${evalConfig.bgColor} ${evalConfig.color}`}>
                      {evalConfig.shortLabel}
                    </span>);

            })}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getIndicatorCount(config.id)}</p>
                  <p className="text-xs text-gray-500">Indicators</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{config.evaluationTypes.length}</p>
                  <p className="text-xs text-gray-500">Eval Types</p>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>

      {/* Middle Classes (3-5) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Middle Classes (3-5)</h2>
            <p className="text-sm text-gray-500">Enhanced evaluation with work education</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLASS_CONFIGS.filter((c) => ['3', '4', '5'].includes(c.standard)).map((config) =>
        <div
          key={config.id}
          onClick={() => handleSelectClass(config.id)}
          className={`bg-white border-2 ${config.borderColor} rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1`}>

              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{config.standard}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">{config.label}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {config.evaluationTypes.slice(0, 3).map((et) => {
              const evalConfig = EVALUATION_CONFIGS[et];
              return (
                <span key={et} className={`text-xs px-2 py-0.5 rounded-full ${evalConfig.bgColor} ${evalConfig.color}`}>
                      {evalConfig.shortLabel}
                    </span>);

            })}
                {config.evaluationTypes.length > 3 &&
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    +{config.evaluationTypes.length - 3}
                  </span>
            }
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getIndicatorCount(config.id)}</p>
                  <p className="text-xs text-gray-500">Indicators</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{config.evaluationTypes.length}</p>
                  <p className="text-xs text-gray-500">Eval Types</p>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>

      {/* Senior Classes (6-8) */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Senior Classes (6-8)</h2>
            <p className="text-sm text-gray-500">Comprehensive evaluation with all areas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLASS_CONFIGS.filter((c) => ['6', '7', '8'].includes(c.standard)).map((config) =>
        <div
          key={config.id}
          onClick={() => handleSelectClass(config.id)}
          className={`bg-white border-2 ${config.borderColor} rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1`}>

              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl font-bold text-white">{config.standard}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-4">{config.label}</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {config.evaluationTypes.slice(0, 3).map((et) => {
              const evalConfig = EVALUATION_CONFIGS[et];
              return (
                <span key={et} className={`text-xs px-2 py-0.5 rounded-full ${evalConfig.bgColor} ${evalConfig.color}`}>
                      {evalConfig.shortLabel}
                    </span>);

            })}
                {config.evaluationTypes.length > 3 &&
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    +{config.evaluationTypes.length - 3}
                  </span>
            }
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getIndicatorCount(config.id)}</p>
                  <p className="text-xs text-gray-500">Indicators</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{config.evaluationTypes.length}</p>
                  <p className="text-xs text-gray-500">Eval Types</p>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>
    </div>;


  // ==================== RENDER: EVALUATIONS VIEW ====================

  const renderEvaluationsView = () => {
    if (!selectedClass) return null;

    const classIndicators = indicators.filter((ind) => ind.classId === selectedClass.id);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">

              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedClass.gradientFrom} ${selectedClass.gradientTo} flex items-center justify-center shadow-lg`}>
              <span className="text-2xl font-bold text-white">{selectedClass.standard}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <button onClick={handleGoHome} className="hover:text-blue-600 transition-colors">Classes</button>
                <ChevronRight className="w-4 h-4" />
                <span className={selectedClass.color}>{selectedClass.label}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedClass.label} - Evaluations</h1>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`${selectedClass.bgColor} border ${selectedClass.borderColor} rounded-xl p-4`}>
            <p className={`text-xs font-semibold ${selectedClass.color} uppercase tracking-wide`}>Total Indicators</p>
            <p className={`text-3xl font-bold ${selectedClass.color} mt-1`}>{classIndicators.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Active</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{classIndicators.filter((i) => i.isActive).length}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Inactive</p>
            <p className="text-3xl font-bold text-gray-700 mt-1">{classIndicators.filter((i) => !i.isActive).length}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Evaluation Types</p>
            <p className="text-3xl font-bold text-purple-700 mt-1">{selectedClass.evaluationTypes.length}</p>
          </div>
        </div>

        {/* Evaluation Types */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Evaluation Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedClass.evaluationTypes.map((evalType) => {
              const evalConfig = EVALUATION_CONFIGS[evalType];
              const evalIndicators = indicators.filter(
                (ind) => ind.classId === selectedClass.id && ind.evaluationType === evalType
              );
              const Icon = evalConfig.icon;

              return (
                <div
                  key={evalType}
                  onClick={() => handleSelectEvaluation(evalType)}
                  className={`bg-white border-2 ${evalConfig.borderColor} rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1`}>

                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-xl ${evalConfig.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${evalConfig.color}`} />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className={`text-lg font-semibold ${evalConfig.color} mt-4`}>{evalConfig.label}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{evalConfig.description}</p>
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{evalIndicators.length}</p>
                      <p className="text-xs text-gray-500">Indicators</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{evalIndicators.filter((i) => i.isActive).length}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>);

  };

  // ==================== RENDER: INDICATORS VIEW ====================

  const renderIndicatorsView = () => {
    if (!selectedClass || !selectedEvaluation) return null;

    const Icon = selectedEvaluation.icon;
    const activeCount = filteredIndicators.filter((i) => i.isActive).length;
    const inactiveCount = filteredIndicators.filter((i) => !i.isActive).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleGoBack}
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">

              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className={`w-12 h-12 rounded-xl ${selectedEvaluation.bgColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${selectedEvaluation.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <button onClick={handleGoHome} className="hover:text-blue-600 transition-colors">Classes</button>
                <ChevronRight className="w-4 h-4" />
                <button onClick={handleGoBack} className="hover:text-blue-600 transition-colors">{selectedClass.label}</button>
                <ChevronRight className="w-4 h-4" />
                <span className={selectedEvaluation.color}>{selectedEvaluation.label}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">{selectedEvaluation.label} - Indicators</h1>
            </div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

            <Plus className="w-4 h-4" />
            Add Indicator
          </button>
        </div>

        {/* Stats & Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex gap-3">
            <div className={`px-4 py-2 rounded-xl ${selectedEvaluation.bgColor} border ${selectedEvaluation.borderColor}`}>
              <span className={`text-sm font-semibold ${selectedEvaluation.color}`}>
                {filteredIndicators.length} Total
              </span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
              <span className="text-sm font-semibold text-green-600">{activeCount} Active</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-sm font-semibold text-gray-600">{inactiveCount} Inactive</span>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 justify-end">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">

              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Indicators Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Indicator Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-32">Skill Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-28">Grade Type</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 w-20">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredIndicators.map((indicator) =>
                <tr key={indicator.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-3 text-gray-400 text-xs">{indicator.displayOrder}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {indicator.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{indicator.name}</p>
                        {indicator.description &&
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{indicator.description}</p>
                      }
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {indicator.skillCategory ?
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {indicator.skillCategory}
                        </span> :

                    <span className="text-gray-400">—</span>
                    }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    indicator.gradeType === 'marks' ?
                    'bg-blue-100 text-blue-700' :
                    indicator.gradeType === 'grade' ?
                    'bg-green-100 text-green-700' :
                    'bg-amber-100 text-amber-700'}`
                    }>
                        {indicator.gradeType === 'marks' ?
                      `Marks (${indicator.maxMarks})` :
                      indicator.gradeType === 'grade' ?
                      'Grade' :
                      'Descriptive'
                      }
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleToggleActive(indicator.id)} className="focus:outline-none">
                        {indicator.isActive ?
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> :

                      <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                      }
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                        onClick={() => handleOpenEditModal(indicator)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Edit">

                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDuplicateIndicator(indicator)}
                        className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"
                        title="Duplicate">

                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDeleteIndicator(indicator.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredIndicators.length === 0 &&
                <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-2xl ${selectedEvaluation.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-8 h-8 ${selectedEvaluation.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Indicators Found</h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {searchQuery ?
                        'No indicators match your search criteria' :
                        'Add your first indicator for this evaluation type'
                        }
                        </p>
                        {!searchQuery &&
                      <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">

                            <Plus className="w-4 h-4" />
                            Add Indicator
                          </button>
                      }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>);

  };

  // ==================== RENDER: MODAL ====================

  const renderModal = () => {
    if (!showModal || !selectedClass || !selectedEvaluation) return null;

    const Icon = selectedEvaluation.icon;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${selectedEvaluation.bgColor} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${selectedEvaluation.color}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingIndicator ? 'Edit Indicator' : 'Add New Indicator'}
                </h2>
                <p className="text-sm text-gray-500">{selectedClass.label} • {selectedEvaluation.label}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Code and Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Indicator Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., C1-SCH-01"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, displayOrder: parseInt(e.target.value) || 1 }))}
                  min={1}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Indicator Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Recognizes and reads alphabets (A-Z)"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this indicator measures..."
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />

            </div>

           

           

            

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Active Status</p>
                <p className="text-xs text-gray-500">Inactive indicators won't appear in evaluations</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>

                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow ${formData.isActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">

              Cancel
            </button>
            <button
              onClick={handleSaveIndicator}
              disabled={!formData.code || !formData.name}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">

              <Save className="w-4 h-4" />
              {editingIndicator ? 'Update' : 'Save'} Indicator
            </button>
          </div>
        </div>
      </div>);

  };

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {currentView === 'classes' && renderClassesView()}
      {currentView === 'evaluations' && renderEvaluationsView()}
      {currentView === 'indicators' && renderIndicatorsView()}
      {renderModal()}
    </div>);

}

export default CceIndicatorMaster;