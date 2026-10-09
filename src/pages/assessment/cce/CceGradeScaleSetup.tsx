import React, { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Settings,
  Layers,
  Hash,
  Type,
  Percent,
  Star,
  FileText,
  Copy,
  Eye,
  MoreVertical,
  AlertCircle,
  Info,
  GripVertical,
  X,
  Check,
  Award,
  Target,
  TrendingUp,
  BookOpen } from
'lucide-react';

// ==================== TYPES ====================

type GradingSystemType = 'alphabetic' | 'numeric' | 'percentage' | 'points' | 'descriptive';

interface GradeLevel {
  id: string;
  symbol: string;
  label: string;
  description: string;
  minValue?: number;
  maxValue?: number;
  points?: number;
  performanceLevel: 'excellent' | 'very-good' | 'good' | 'satisfactory' | 'needs-improvement' | 'unsatisfactory';
  remarks: string;
  colorCode: string;
  order: number;
  isActive: boolean;
}

interface GradingSystem {
  id: string;
  name: string;
  type: GradingSystemType;
  description: string;
  isDefault: boolean;
  isActive: boolean;
  applicableFor: string[];
  grades: GradeLevel[];
  createdAt: string;
  updatedAt: string;
}

// ==================== CONFIGURATIONS ====================

const GRADING_SYSTEM_TYPES: {
  type: GradingSystemType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  example: string;
}[] = [
{
  type: 'alphabetic',
  label: 'Alphabetic Grades',
  description: 'Letter-based grading (A, B, C, D, E, F)',
  icon: Type,
  color: 'text-blue-600',
  bgColor: 'bg-blue-50',
  borderColor: 'border-blue-200',
  example: 'A, B, C, D, E'
},
{
  type: 'numeric',
  label: 'Numeric Grades',
  description: 'Number-based grading (1, 2, 3, 4, 5)',
  icon: Hash,
  color: 'text-green-600',
  bgColor: 'bg-green-50',
  borderColor: 'border-green-200',
  example: '1, 2, 3, 4, 5'
},
{
  type: 'percentage',
  label: 'Percentage Based',
  description: 'Grade based on percentage ranges',
  icon: Percent,
  color: 'text-purple-600',
  bgColor: 'bg-purple-50',
  borderColor: 'border-purple-200',
  example: '90-100%, 80-89%, etc.'
},
{
  type: 'points',
  label: 'Grade Points',
  description: 'GPA/CGPA style point system',
  icon: Star,
  color: 'text-amber-600',
  bgColor: 'bg-amber-50',
  borderColor: 'border-amber-200',
  example: '4.0, 3.5, 3.0, etc.'
},
{
  type: 'descriptive',
  label: 'Descriptive Grades',
  description: 'Text-based assessment descriptions',
  icon: FileText,
  color: 'text-indigo-600',
  bgColor: 'bg-indigo-50',
  borderColor: 'border-indigo-200',
  example: 'Excellent, Good, etc.'
}];


const PERFORMANCE_LEVELS = [
{ value: 'excellent', label: 'Excellent', color: 'bg-emerald-500' },
{ value: 'very-good', label: 'Very Good', color: 'bg-green-500' },
{ value: 'good', label: 'Good', color: 'bg-blue-500' },
{ value: 'satisfactory', label: 'Satisfactory', color: 'bg-yellow-500' },
{ value: 'needs-improvement', label: 'Needs Improvement', color: 'bg-orange-500' },
{ value: 'unsatisfactory', label: 'Unsatisfactory', color: 'bg-red-500' }];


const APPLICABLE_FOR_OPTIONS = [
'Scholastic',
'Co-Scholastic',
'Discipline',
'Work Education',
'Health & Physical Education',
'Life Skills',
'All Areas'];


const COLOR_PRESETS = [
'#22c55e', // green
'#3b82f6', // blue
'#8b5cf6', // purple
'#f59e0b', // amber
'#ef4444', // red
'#06b6d4', // cyan
'#ec4899', // pink
'#6b7280' // gray
];

// ==================== INITIAL DATA ====================

const INITIAL_GRADING_SYSTEMS: GradingSystem[] = [
{
  id: '1',
  name: 'Standard Alphabetic (A-E)',
  type: 'alphabetic',
  description: 'Standard 5-point alphabetic grading scale used for most evaluations',
  isDefault: true,
  isActive: true,
  applicableFor: ['Scholastic', 'Co-Scholastic'],
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10',
  grades: [
  {
    id: '1-1',
    symbol: 'A',
    label: 'Outstanding',
    description: 'Exceptional performance exceeding all expectations',
    minValue: 90,
    maxValue: 100,
    points: 5,
    performanceLevel: 'excellent',
    remarks: 'Outstanding! Keep up the excellent work.',
    colorCode: '#22c55e',
    order: 1,
    isActive: true
  },
  {
    id: '1-2',
    symbol: 'B',
    label: 'Very Good',
    description: 'Very good performance above expectations',
    minValue: 75,
    maxValue: 89,
    points: 4,
    performanceLevel: 'very-good',
    remarks: 'Very good performance. Continue the effort.',
    colorCode: '#3b82f6',
    order: 2,
    isActive: true
  },
  {
    id: '1-3',
    symbol: 'C',
    label: 'Good',
    description: 'Good performance meeting expectations',
    minValue: 60,
    maxValue: 74,
    points: 3,
    performanceLevel: 'good',
    remarks: 'Good work. There is room for improvement.',
    colorCode: '#8b5cf6',
    order: 3,
    isActive: true
  },
  {
    id: '1-4',
    symbol: 'D',
    label: 'Satisfactory',
    description: 'Satisfactory performance with scope for improvement',
    minValue: 45,
    maxValue: 59,
    points: 2,
    performanceLevel: 'satisfactory',
    remarks: 'Satisfactory. More effort needed.',
    colorCode: '#f59e0b',
    order: 4,
    isActive: true
  },
  {
    id: '1-5',
    symbol: 'E',
    label: 'Needs Improvement',
    description: 'Below expectations, needs significant improvement',
    minValue: 0,
    maxValue: 44,
    points: 1,
    performanceLevel: 'needs-improvement',
    remarks: 'Needs more attention and practice.',
    colorCode: '#ef4444',
    order: 5,
    isActive: true
  }]

},
{
  id: '2',
  name: 'Numeric Scale (1-5)',
  type: 'numeric',
  description: 'Simple numeric grading from 1 to 5',
  isDefault: false,
  isActive: true,
  applicableFor: ['Discipline', 'Life Skills'],
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10',
  grades: [
  {
    id: '2-1',
    symbol: '5',
    label: 'Excellent',
    description: 'Consistently demonstrates outstanding behavior',
    points: 5,
    performanceLevel: 'excellent',
    remarks: 'Excellent! Role model behavior.',
    colorCode: '#22c55e',
    order: 1,
    isActive: true
  },
  {
    id: '2-2',
    symbol: '4',
    label: 'Very Good',
    description: 'Frequently demonstrates positive behavior',
    points: 4,
    performanceLevel: 'very-good',
    remarks: 'Very good conduct.',
    colorCode: '#3b82f6',
    order: 2,
    isActive: true
  },
  {
    id: '2-3',
    symbol: '3',
    label: 'Good',
    description: 'Generally demonstrates expected behavior',
    points: 3,
    performanceLevel: 'good',
    remarks: 'Good behavior overall.',
    colorCode: '#8b5cf6',
    order: 3,
    isActive: true
  },
  {
    id: '2-4',
    symbol: '2',
    label: 'Satisfactory',
    description: 'Sometimes demonstrates expected behavior',
    points: 2,
    performanceLevel: 'satisfactory',
    remarks: 'Behavior needs consistency.',
    colorCode: '#f59e0b',
    order: 4,
    isActive: true
  },
  {
    id: '2-5',
    symbol: '1',
    label: 'Needs Improvement',
    description: 'Rarely demonstrates expected behavior',
    points: 1,
    performanceLevel: 'needs-improvement',
    remarks: 'Significant improvement required.',
    colorCode: '#ef4444',
    order: 5,
    isActive: true
  }]

},
{
  id: '3',
  name: 'Descriptive Assessment',
  type: 'descriptive',
  description: 'Descriptive grading for primary classes (1-2)',
  isDefault: false,
  isActive: true,
  applicableFor: ['All Areas'],
  createdAt: '2024-01-10',
  updatedAt: '2024-01-10',
  grades: [
  {
    id: '3-1',
    symbol: 'AE',
    label: 'Above Expected',
    description: 'Performance is above the expected level for age/grade',
    performanceLevel: 'excellent',
    remarks: 'Exceptional progress! Child is performing above expectations.',
    colorCode: '#22c55e',
    order: 1,
    isActive: true
  },
  {
    id: '3-2',
    symbol: 'ME',
    label: 'Meets Expected',
    description: 'Performance meets the expected level for age/grade',
    performanceLevel: 'good',
    remarks: 'Good progress. Child is on track.',
    colorCode: '#3b82f6',
    order: 2,
    isActive: true
  },
  {
    id: '3-3',
    symbol: 'BE',
    label: 'Below Expected',
    description: 'Performance is below the expected level for age/grade',
    performanceLevel: 'needs-improvement',
    remarks: 'Additional support and attention needed.',
    colorCode: '#f59e0b',
    order: 3,
    isActive: true
  }]

}];


// ==================== VIEW TYPES ====================

type ViewType = 'list' | 'detail' | 'create';

// ==================== MAIN COMPONENT ====================

export function CceGradeScaleSetup() {
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);

  // Data State
  const [gradingSystems, setGradingSystems] = useState<GradingSystem[]>(INITIAL_GRADING_SYSTEMS);
  const [academicYear, setAcademicYear] = useState('2024-25');

  // Modal State
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeLevel | null>(null);

  // System Form State
  const [systemForm, setSystemForm] = useState({
    name: '',
    type: 'alphabetic' as GradingSystemType,
    description: '',
    applicableFor: [] as string[],
    isDefault: false
  });

  // Grade Form State
  const [gradeForm, setGradeForm] = useState({
    symbol: '',
    label: '',
    description: '',
    minValue: 0,
    maxValue: 100,
    points: 0,
    performanceLevel: 'good' as GradeLevel['performanceLevel'],
    remarks: '',
    colorCode: '#6b7280',
    order: 1,
    isActive: true
  });

  // ==================== COMPUTED VALUES ====================

  const selectedSystem = useMemo(() => {
    return gradingSystems.find((s) => s.id === selectedSystemId) || null;
  }, [selectedSystemId, gradingSystems]);

  const getSystemTypeConfig = useCallback((type: GradingSystemType) => {
    return GRADING_SYSTEM_TYPES.find((t) => t.type === type)!;
  }, []);

  const totalActiveGrades = useMemo(() => {
    return gradingSystems.reduce((acc, sys) => acc + sys.grades.filter((g) => g.isActive).length, 0);
  }, [gradingSystems]);

  // ==================== NAVIGATION ====================

  const handleViewSystem = useCallback((systemId: string) => {
    setSelectedSystemId(systemId);
    setCurrentView('detail');
  }, []);

  const handleCreateSystem = useCallback(() => {
    setSystemForm({
      name: '',
      type: 'alphabetic',
      description: '',
      applicableFor: [],
      isDefault: false
    });
    setCurrentView('create');
  }, []);

  const handleGoBack = useCallback(() => {
    if (currentView === 'detail' || currentView === 'create') {
      setSelectedSystemId(null);
      setCurrentView('list');
    }
  }, [currentView]);

  // ==================== SYSTEM CRUD ====================

  const handleSaveSystem = useCallback(() => {
    if (!systemForm.name || !systemForm.type) return;

    const now = new Date().toISOString().split('T')[0];

    const newSystem: GradingSystem = {
      id: Date.now().toString(),
      name: systemForm.name,
      type: systemForm.type,
      description: systemForm.description,
      isDefault: systemForm.isDefault,
      isActive: true,
      applicableFor: systemForm.applicableFor,
      grades: [],
      createdAt: now,
      updatedAt: now
    };

    // If this is set as default, unset other defaults of same type
    if (systemForm.isDefault) {
      setGradingSystems((prev) => prev.map((s) => ({
        ...s,
        isDefault: s.type === systemForm.type ? false : s.isDefault
      })));
    }

    setGradingSystems((prev) => [...prev, newSystem]);
    setSelectedSystemId(newSystem.id);
    setCurrentView('detail');
  }, [systemForm]);

  const handleDeleteSystem = useCallback((systemId: string) => {
    if (window.confirm('Are you sure you want to delete this grading system? All associated grades will be removed.')) {
      setGradingSystems((prev) => prev.filter((s) => s.id !== systemId));
      if (selectedSystemId === systemId) {
        setSelectedSystemId(null);
        setCurrentView('list');
      }
    }
  }, [selectedSystemId]);

  const handleToggleSystemActive = useCallback((systemId: string) => {
    setGradingSystems((prev) => prev.map((s) => {
      if (s.id === systemId) {
        return { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString().split('T')[0] };
      }
      return s;
    }));
  }, []);

  const handleSetDefault = useCallback((systemId: string) => {
    const system = gradingSystems.find((s) => s.id === systemId);
    if (!system) return;

    setGradingSystems((prev) => prev.map((s) => ({
      ...s,
      isDefault: s.id === systemId ? true : s.type === system.type ? false : s.isDefault,
      updatedAt: s.id === systemId ? new Date().toISOString().split('T')[0] : s.updatedAt
    })));
  }, [gradingSystems]);

  const handleDuplicateSystem = useCallback((system: GradingSystem) => {
    const now = new Date().toISOString().split('T')[0];
    const newSystem: GradingSystem = {
      ...system,
      id: Date.now().toString(),
      name: `${system.name} (Copy)`,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      grades: system.grades.map((g) => ({
        ...g,
        id: `${Date.now()}-${g.id}`
      }))
    };
    setGradingSystems((prev) => [...prev, newSystem]);
  }, []);

  // ==================== GRADE CRUD ====================

  const handleOpenAddGrade = useCallback(() => {
    if (!selectedSystem) return;

    const nextOrder = selectedSystem.grades.length + 1;

    setGradeForm({
      symbol: '',
      label: '',
      description: '',
      minValue: 0,
      maxValue: 100,
      points: nextOrder,
      performanceLevel: 'good',
      remarks: '',
      colorCode: COLOR_PRESETS[Math.min(nextOrder - 1, COLOR_PRESETS.length - 1)],
      order: nextOrder,
      isActive: true
    });
    setEditingGrade(null);
    setShowGradeModal(true);
  }, [selectedSystem]);

  const handleOpenEditGrade = useCallback((grade: GradeLevel) => {
    setGradeForm({
      symbol: grade.symbol,
      label: grade.label,
      description: grade.description,
      minValue: grade.minValue || 0,
      maxValue: grade.maxValue || 100,
      points: grade.points || 0,
      performanceLevel: grade.performanceLevel,
      remarks: grade.remarks,
      colorCode: grade.colorCode,
      order: grade.order,
      isActive: grade.isActive
    });
    setEditingGrade(grade);
    setShowGradeModal(true);
  }, []);

  const handleSaveGrade = useCallback(() => {
    if (!selectedSystemId || !gradeForm.symbol || !gradeForm.label) return;

    const now = new Date().toISOString().split('T')[0];

    setGradingSystems((prev) => prev.map((system) => {
      if (system.id !== selectedSystemId) return system;

      let updatedGrades: GradeLevel[];

      if (editingGrade) {
        updatedGrades = system.grades.map((g) => {
          if (g.id === editingGrade.id) {
            return {
              ...g,
              symbol: gradeForm.symbol,
              label: gradeForm.label,
              description: gradeForm.description,
              minValue: gradeForm.minValue,
              maxValue: gradeForm.maxValue,
              points: gradeForm.points,
              performanceLevel: gradeForm.performanceLevel,
              remarks: gradeForm.remarks,
              colorCode: gradeForm.colorCode,
              order: gradeForm.order,
              isActive: gradeForm.isActive
            };
          }
          return g;
        });
      } else {
        const newGrade: GradeLevel = {
          id: `${system.id}-${Date.now()}`,
          symbol: gradeForm.symbol,
          label: gradeForm.label,
          description: gradeForm.description,
          minValue: gradeForm.minValue,
          maxValue: gradeForm.maxValue,
          points: gradeForm.points,
          performanceLevel: gradeForm.performanceLevel,
          remarks: gradeForm.remarks,
          colorCode: gradeForm.colorCode,
          order: gradeForm.order,
          isActive: gradeForm.isActive
        };
        updatedGrades = [...system.grades, newGrade];
      }

      return {
        ...system,
        grades: updatedGrades,
        updatedAt: now
      };
    }));

    setShowGradeModal(false);
    setEditingGrade(null);
  }, [selectedSystemId, gradeForm, editingGrade]);

  const handleDeleteGrade = useCallback((gradeId: string) => {
    if (!selectedSystemId) return;

    if (window.confirm('Are you sure you want to delete this grade?')) {
      setGradingSystems((prev) => prev.map((system) => {
        if (system.id !== selectedSystemId) return system;
        return {
          ...system,
          grades: system.grades.filter((g) => g.id !== gradeId),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }));
    }
  }, [selectedSystemId]);

  const handleToggleGradeActive = useCallback((gradeId: string) => {
    if (!selectedSystemId) return;

    setGradingSystems((prev) => prev.map((system) => {
      if (system.id !== selectedSystemId) return system;
      return {
        ...system,
        grades: system.grades.map((g) => {
          if (g.id === gradeId) {
            return { ...g, isActive: !g.isActive };
          }
          return g;
        }),
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
  }, [selectedSystemId]);

  const handleToggleApplicableFor = useCallback((item: string) => {
    setSystemForm((prev) => ({
      ...prev,
      applicableFor: prev.applicableFor.includes(item) ?
      prev.applicableFor.filter((a) => a !== item) :
      [...prev.applicableFor, item]
    }));
  }, []);

  // ==================== RENDER: LIST VIEW ====================

  const renderListView = () =>
  <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CCE Grade Scale Setup</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure and manage different grading systems for CCE evaluation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white shadow-sm focus:ring-2 focus:ring-blue-500">

            <option value="2024-25">AY 2024-25</option>
            <option value="2023-24">AY 2023-24</option>
          </select>
          <button
          onClick={handleCreateSystem}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

            <Plus className="w-4 h-4" />
            Create Grading System
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Systems</p>
              <p className="text-3xl font-bold">{gradingSystems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-green-100 text-sm font-medium">Active Systems</p>
              <p className="text-3xl font-bold">{gradingSystems.filter((s) => s.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Grades</p>
              <p className="text-3xl font-bold">{totalActiveGrades}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-amber-100 text-sm font-medium">Default Systems</p>
              <p className="text-3xl font-bold">{gradingSystems.filter((s) => s.isDefault).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grading System Types Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Grading System Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GRADING_SYSTEM_TYPES.map((typeConfig) => {
          const systemsOfType = gradingSystems.filter((s) => s.type === typeConfig.type);
          const Icon = typeConfig.icon;

          return (
            <div
              key={typeConfig.type}
              className={`${typeConfig.bgColor} border ${typeConfig.borderColor} rounded-xl p-4`}>

                <div className={`w-10 h-10 rounded-lg ${typeConfig.bgColor} border ${typeConfig.borderColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                </div>
                <h3 className={`font-semibold ${typeConfig.color}`}>{typeConfig.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{typeConfig.example}</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{systemsOfType.length} system(s)</p>
              </div>);

        })}
        </div>
      </div>

      {/* Grading Systems List */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Grading Systems</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">System Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Grades</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Applicable For</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Default</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {gradingSystems.map((system) => {
              const typeConfig = getSystemTypeConfig(system.type);
              const Icon = typeConfig.icon;

              return (
                <tr key={system.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${typeConfig.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{system.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{system.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}>
                        {typeConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {system.grades.slice(0, 5).map((grade) =>
                      <span
                        key={grade.id}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: grade.colorCode }}
                        title={`${grade.symbol}: ${grade.label}`}>

                            {grade.symbol}
                          </span>
                      )}
                        {system.grades.length > 5 &&
                      <span className="text-xs text-gray-500 ml-1">+{system.grades.length - 5}</span>
                      }
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {system.applicableFor.slice(0, 2).map((item) =>
                      <span key={item} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            {item}
                          </span>
                      )}
                        {system.applicableFor.length > 2 &&
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            +{system.applicableFor.length - 2}
                          </span>
                      }
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {system.isDefault ?
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Default
                        </span> :

                    <button
                      onClick={() => handleSetDefault(system.id)}
                      className="text-xs text-gray-400 hover:text-blue-600 transition-colors">

                          Set Default
                        </button>
                    }
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button onClick={() => handleToggleSystemActive(system.id)}>
                        {system.isActive ?
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span> :

                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                      }
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                        onClick={() => handleViewSystem(system.id)}
                        className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                        title="View & Edit Grades">

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDuplicateSystem(system)}
                        className="p-1.5 rounded hover:bg-purple-50 text-purple-600 transition-colors"
                        title="Duplicate">

                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                        onClick={() => handleDeleteSystem(system.id)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                        title="Delete">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>);

            })}

              {gradingSystems.length === 0 &&
            <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <Layers className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-1">No Grading Systems</h3>
                      <p className="text-sm text-gray-500 mb-4">Create your first grading system to get started</p>
                      <button
                    onClick={handleCreateSystem}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

                        <Plus className="w-4 h-4" />
                        Create Grading System
                      </button>
                    </div>
                  </td>
                </tr>
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>;


  // ==================== RENDER: DETAIL VIEW ====================

  const renderDetailView = () => {
    if (!selectedSystem) return null;

    const typeConfig = getSystemTypeConfig(selectedSystem.type);
    const Icon = typeConfig.icon;
    const sortedGrades = [...selectedSystem.grades].sort((a, b) => a.order - b.order);

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
            <div className={`w-12 h-12 rounded-xl ${typeConfig.bgColor} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${typeConfig.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <button onClick={handleGoBack} className="hover:text-blue-600 transition-colors">Grading Systems</button>
                <ChevronRight className="w-4 h-4" />
                <span className={typeConfig.color}>{selectedSystem.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">{selectedSystem.name}</h1>
                {selectedSystem.isDefault &&
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <Star className="w-3 h-3" />
                    Default
                  </span>
                }
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenAddGrade}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

            <Plus className="w-4 h-4" />
            Add Grade
          </button>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`${typeConfig.bgColor} border ${typeConfig.borderColor} rounded-xl p-4`}>
            <p className={`text-xs font-semibold ${typeConfig.color} uppercase tracking-wide`}>System Type</p>
            <p className={`text-lg font-bold ${typeConfig.color} mt-1`}>{typeConfig.label}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Total Grades</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{selectedSystem.grades.length}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Active Grades</p>
            <p className="text-lg font-bold text-green-700 mt-1">{selectedSystem.grades.filter((g) => g.isActive).length}</p>
          </div>
        </div>

        {/* Description & Applicable For */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600">{selectedSystem.description || 'No description provided.'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Applicable For</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSystem.applicableFor.length > 0 ?
                selectedSystem.applicableFor.map((item) =>
                <span key={item} className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
                      {item}
                    </span>
                ) :

                <span className="text-sm text-gray-400">Not specified</span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Grade Scale Visualization */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Scale Preview</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {sortedGrades.map((grade, index) =>
            <React.Fragment key={grade.id}>
                <div
                className={`flex-shrink-0 w-28 p-4 rounded-xl text-center transition-all ${
                grade.isActive ? 'opacity-100' : 'opacity-40'}`
                }
                style={{ backgroundColor: `${grade.colorCode}15`, borderColor: grade.colorCode, borderWidth: 2 }}>

                  <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-lg"
                  style={{ backgroundColor: grade.colorCode }}>

                    {grade.symbol}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{grade.label}</p>
                  {(selectedSystem.type === 'percentage' || selectedSystem.type === 'alphabetic') && grade.minValue !== undefined &&
                <p className="text-xs text-gray-500 mt-1">{grade.minValue}-{grade.maxValue}%</p>
                }
                  {selectedSystem.type === 'points' && grade.points !== undefined &&
                <p className="text-xs text-gray-500 mt-1">{grade.points} pts</p>
                }
                </div>
                {index < sortedGrades.length - 1 &&
              <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              }
              </React.Fragment>
            )}
          </div>
        </div>

        {/* Grades Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Grade Configuration</h3>
            <span className="text-sm text-gray-500">{sortedGrades.length} grade(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 w-12">#</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Grade</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Label</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                  {(selectedSystem.type === 'percentage' || selectedSystem.type === 'alphabetic') &&
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Range</th>
                  }
                  {selectedSystem.type === 'points' &&
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Points</th>
                  }
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Performance</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Remarks</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedGrades.map((grade) => {
                  const perfLevel = PERFORMANCE_LEVELS.find((p) => p.value === grade.performanceLevel);

                  return (
                    <tr key={grade.id} className={`hover:bg-gray-50 transition-colors group ${!grade.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 text-gray-400 text-xs">{grade.order}</td>
                      <td className="px-4 py-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: grade.colorCode }}>

                          {grade.symbol}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{grade.label}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-xs">
                        <p className="line-clamp-2">{grade.description}</p>
                      </td>
                      {(selectedSystem.type === 'percentage' || selectedSystem.type === 'alphabetic') &&
                      <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-700">
                            {grade.minValue}% - {grade.maxValue}%
                          </span>
                        </td>
                      }
                      {selectedSystem.type === 'points' &&
                      <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-700">{grade.points}</span>
                        </td>
                      }
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full text-white ${perfLevel?.color || 'bg-gray-500'}`}>
                          {perfLevel?.label || grade.performanceLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm max-w-xs">
                        <p className="line-clamp-2">{grade.remarks}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleToggleGradeActive(grade.id)}>
                          {grade.isActive ?
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" /> :

                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditGrade(grade)}
                            className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit">

                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGrade(grade.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>);

                })}

                {sortedGrades.length === 0 &&
                <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-2xl ${typeConfig.bgColor} flex items-center justify-center mb-4`}>
                          <Icon className={`w-8 h-8 ${typeConfig.color}`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Grades Configured</h3>
                        <p className="text-sm text-gray-500 mb-4">Add grades to this grading system</p>
                        <button
                        onClick={handleOpenAddGrade}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">

                          <Plus className="w-4 h-4" />
                          Add Grade
                        </button>
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

  // ==================== RENDER: CREATE VIEW ====================

  const renderCreateView = () => {
    const selectedTypeConfig = getSystemTypeConfig(systemForm.type);
    const Icon = selectedTypeConfig.icon;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">

            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Grading System</h1>
            <p className="text-sm text-gray-500 mt-1">Configure a new grading system for CCE evaluation</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          {/* System Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Grading System Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {GRADING_SYSTEM_TYPES.map((typeConfig) => {
                const TypeIcon = typeConfig.icon;
                const isSelected = systemForm.type === typeConfig.type;

                return (
                  <button
                    key={typeConfig.type}
                    type="button"
                    onClick={() => setSystemForm((prev) => ({ ...prev, type: typeConfig.type }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected ?
                    `${typeConfig.borderColor} ${typeConfig.bgColor}` :
                    'border-gray-200 hover:border-gray-300'}`
                    }>

                    <div className={`w-10 h-10 rounded-lg ${typeConfig.bgColor} flex items-center justify-center mb-2`}>
                      <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>
                    <p className={`font-semibold text-sm ${isSelected ? typeConfig.color : 'text-gray-700'}`}>
                      {typeConfig.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{typeConfig.example}</p>
                  </button>);

              })}
            </div>
          </div>

          {/* System Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              System Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={systemForm.name}
              onChange={(e) => setSystemForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Standard Alphabetic (A-E)"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-gray-400">(Optional)</span>
            </label>
            <textarea
              value={systemForm.description}
              onChange={(e) => setSystemForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this grading system..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />

          </div>

          {/* Applicable For */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Applicable For
            </label>
            <div className="flex flex-wrap gap-2">
              {APPLICABLE_FOR_OPTIONS.map((item) => {
                const isSelected = systemForm.applicableFor.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleToggleApplicableFor(item)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isSelected ?
                    'bg-blue-600 text-white' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                    }>

                    {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                    {item}
                  </button>);

              })}
            </div>
          </div>

          {/* Set as Default */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">Set as Default</p>
              <p className="text-xs text-gray-500">Make this the default grading system for its type</p>
            </div>
            <button
              type="button"
              onClick={() => setSystemForm((prev) => ({ ...prev, isDefault: !prev.isDefault }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${systemForm.isDefault ? 'bg-green-500' : 'bg-gray-300'}`}>

              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow ${systemForm.isDefault ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">

              Cancel
            </button>
            <button
              onClick={handleSaveSystem}
              disabled={!systemForm.name}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">

              <Save className="w-4 h-4" />
              Create System
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Next Steps</p>
            <p className="text-sm text-blue-700 mt-1">
              After creating the grading system, you can add individual grades with their symbols, descriptions, and performance levels.
            </p>
          </div>
        </div>
      </div>);

  };

  // ==================== RENDER: GRADE MODAL ====================

  const renderGradeModal = () => {
    if (!showGradeModal || !selectedSystem) return null;

    const typeConfig = getSystemTypeConfig(selectedSystem.type);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingGrade ? 'Edit Grade' : 'Add New Grade'}
              </h2>
              <p className="text-sm text-gray-500">{selectedSystem.name}</p>
            </div>
            <button
              onClick={() => setShowGradeModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Symbol and Order */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Grade Symbol <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={gradeForm.symbol}
                  onChange={(e) => setGradeForm((prev) => ({ ...prev, symbol: e.target.value }))}
                  placeholder={selectedSystem.type === 'numeric' ? 'e.g., 5' : 'e.g., A'}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  value={gradeForm.order}
                  onChange={(e) => setGradeForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  min={1}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            </div>

            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Grade Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={gradeForm.label}
                onChange={(e) => setGradeForm((prev) => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., Outstanding, Excellent, Very Good"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={gradeForm.description}
                onChange={(e) => setGradeForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this grade means..."
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />

            </div>

            {/* Range (for percentage/alphabetic) */}
            {(selectedSystem.type === 'percentage' || selectedSystem.type === 'alphabetic') &&
            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Value (%)</label>
                  <input
                  type="number"
                  value={gradeForm.minValue}
                  onChange={(e) => setGradeForm((prev) => ({ ...prev, minValue: parseInt(e.target.value) || 0 }))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Maximum Value (%)</label>
                  <input
                  type="number"
                  value={gradeForm.maxValue}
                  onChange={(e) => setGradeForm((prev) => ({ ...prev, maxValue: parseInt(e.target.value) || 100 }))}
                  min={0}
                  max={100}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

                </div>
              </div>
            }

            {/* Points (for points/numeric) */}
            {(selectedSystem.type === 'points' || selectedSystem.type === 'numeric') &&
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Points Value</label>
                <input
                type="number"
                value={gradeForm.points}
                onChange={(e) => setGradeForm((prev) => ({ ...prev, points: parseFloat(e.target.value) || 0 }))}
                step={0.5}
                min={0}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

              </div>
            }

            {/* Performance Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Level</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PERFORMANCE_LEVELS.map((level) =>
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setGradeForm((prev) => ({ ...prev, performanceLevel: level.value as GradeLevel['performanceLevel'] }))}
                  className={`p-2 rounded-lg border-2 text-left transition-all flex items-center gap-2 ${
                  gradeForm.performanceLevel === level.value ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-200 hover:border-gray-300'}`
                  }>

                    <span className={`w-3 h-3 rounded-full ${level.color}`} />
                    <span className="text-sm font-medium">{level.label}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks / Teacher Comment</label>
              <textarea
                value={gradeForm.remarks}
                onChange={(e) => setGradeForm((prev) => ({ ...prev, remarks: e.target.value }))}
                placeholder="Standard remarks to be shown for this grade..."
                rows={2}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" />

            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Code</label>
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {COLOR_PRESETS.map((color) =>
                  <button
                    key={color}
                    type="button"
                    onClick={() => setGradeForm((prev) => ({ ...prev, colorCode: color }))}
                    className={`w-8 h-8 rounded-full transition-all ${
                    gradeForm.colorCode === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`
                    }
                    style={{ backgroundColor: color }} />

                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={gradeForm.colorCode}
                    onChange={(e) => setGradeForm((prev) => ({ ...prev, colorCode: e.target.value }))}
                    className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />

                  <span className="text-sm text-gray-500 font-mono">{gradeForm.colorCode}</span>
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Active Status</p>
                <p className="text-xs text-gray-500">Inactive grades won't be available for selection</p>
              </div>
              <button
                type="button"
                onClick={() => setGradeForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${gradeForm.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>

                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow ${gradeForm.isActive ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: gradeForm.colorCode }}>

                  {gradeForm.symbol || '?'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{gradeForm.label || 'Grade Label'}</p>
                  <p className="text-sm text-gray-500">{gradeForm.description || 'Grade description'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={() => setShowGradeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">

              Cancel
            </button>
            <button
              onClick={handleSaveGrade}
              disabled={!gradeForm.symbol || !gradeForm.label}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">

              <Save className="w-4 h-4" />
              {editingGrade ? 'Update' : 'Save'} Grade
            </button>
          </div>
        </div>
      </div>);

  };

  // ==================== MAIN RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {currentView === 'list' && renderListView()}
      {currentView === 'detail' && renderDetailView()}
      {currentView === 'create' && renderCreateView()}
      {renderGradeModal()}
    </div>);

}

export default CceGradeScaleSetup;