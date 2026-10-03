import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Save,
  Eye,
  Award,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Star,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Target,
  Percent,
  Hash,
  FileText,
  Shield,
  AlertCircle,
  GraduationCap,
  BarChart3,
  TrendingUp,
  Lock,
  Unlock,
  History,
  Copy,
  RotateCcw } from
'lucide-react';

/* ================================
   Types & Interfaces
================================ */

interface GradeDefinition {
  id: string;
  gradeName: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
  description: string;
  color: string;
  isDistinction: boolean;
  isPass: boolean;
  order: number;
  remarks: string;
}

interface GraceMarksRule {
  id: string;
  ruleName: string;
  maxGraceMarks: number;
  applicableFor: 'all' | 'failing' | 'distinction';
  conditions: string[];
  isActive: boolean;
}

interface RoundingRule {
  type: 'none' | 'nearest' | 'up' | 'down';
  decimalPlaces: number;
  threshold: number;
}

interface CGPAConfig {
  enabled: boolean;
  maxGradePoint: number;
  formula: 'simple_average' | 'weighted_average' | 'credit_based';
  minimumCGPA: number;
}

interface PromotionRule {
  id: string;
  ruleName: string;
  minPassingSubjects: number;
  totalSubjects: number;
  compulsorySubjects: string[];
  allowCompartment: boolean;
  maxCompartmentSubjects: number;
  attendanceRequired: number;
  isActive: boolean;
}

interface GradeConfiguration {
  id: string;
  configName: string;
  academicYear: string;
  boardType: 'GSEB' | 'CBSE' | 'ICSE' | 'STATE' | 'CUSTOM';
  classLevel: string[];
  status: 'draft' | 'active' | 'archived';
  passingPercentage: number;
  distinctionPercentage: number;
  meritPercentage: number;
  grades: GradeDefinition[];
  graceMarksRules: GraceMarksRule[];
  roundingRule: RoundingRule;
  cgpaConfig: CGPAConfig;
  promotionRules: PromotionRule[];
  specialCases: {
    absentMarking: string;
    medicalCases: boolean;
    sportsQuota: boolean;
    differentlyAbled: boolean;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isLocked: boolean;
  version: number;
}

type TabType = 'overview' | 'grades' | 'grace' | 'cgpa' | 'promotion' | 'preview';

/* ================================
   Default GSEB Configuration
================================ */

const DEFAULT_GSEB_GRADES: GradeDefinition[] = [
{ id: '1', gradeName: 'A1', minPercentage: 91, maxPercentage: 100, gradePoint: 10.0, description: 'Outstanding', color: '#059669', isDistinction: true, isPass: true, order: 1, remarks: 'Exceptional performance' },
{ id: '2', gradeName: 'A2', minPercentage: 81, maxPercentage: 90, gradePoint: 9.0, description: 'Excellent', color: '#10b981', isDistinction: true, isPass: true, order: 2, remarks: 'Excellent performance' },
{ id: '3', gradeName: 'B1', minPercentage: 71, maxPercentage: 80, gradePoint: 8.0, description: 'Very Good', color: '#22c55e', isDistinction: true, isPass: true, order: 3, remarks: 'Very good performance' },
{ id: '4', gradeName: 'B2', minPercentage: 61, maxPercentage: 70, gradePoint: 7.0, description: 'Good', color: '#3b82f6', isDistinction: false, isPass: true, order: 4, remarks: 'Good performance' },
{ id: '5', gradeName: 'C1', minPercentage: 51, maxPercentage: 60, gradePoint: 6.0, description: 'Above Average', color: '#6366f1', isDistinction: false, isPass: true, order: 5, remarks: 'Above average performance' },
{ id: '6', gradeName: 'C2', minPercentage: 41, maxPercentage: 50, gradePoint: 5.0, description: 'Average', color: '#8b5cf6', isDistinction: false, isPass: true, order: 6, remarks: 'Average performance' },
{ id: '7', gradeName: 'D', minPercentage: 33, maxPercentage: 40, gradePoint: 4.0, description: 'Below Average', color: '#f59e0b', isDistinction: false, isPass: true, order: 7, remarks: 'Needs improvement' },
{ id: '8', gradeName: 'E1', minPercentage: 21, maxPercentage: 32, gradePoint: 0, description: 'Unsatisfactory', color: '#ef4444', isDistinction: false, isPass: false, order: 8, remarks: 'Failed - needs remedial' },
{ id: '9', gradeName: 'E2', minPercentage: 0, maxPercentage: 20, gradePoint: 0, description: 'Fail', color: '#dc2626', isDistinction: false, isPass: false, order: 9, remarks: 'Failed' }];


const DEFAULT_CBSE_GRADES: GradeDefinition[] = [
{ id: '1', gradeName: 'A1', minPercentage: 91, maxPercentage: 100, gradePoint: 10.0, description: 'Outstanding', color: '#059669', isDistinction: true, isPass: true, order: 1, remarks: 'Exceptional' },
{ id: '2', gradeName: 'A2', minPercentage: 81, maxPercentage: 90, gradePoint: 9.0, description: 'Excellent', color: '#10b981', isDistinction: true, isPass: true, order: 2, remarks: 'Excellent' },
{ id: '3', gradeName: 'B1', minPercentage: 71, maxPercentage: 80, gradePoint: 8.0, description: 'Very Good', color: '#22c55e', isDistinction: false, isPass: true, order: 3, remarks: 'Very Good' },
{ id: '4', gradeName: 'B2', minPercentage: 61, maxPercentage: 70, gradePoint: 7.0, description: 'Good', color: '#3b82f6', isDistinction: false, isPass: true, order: 4, remarks: 'Good' },
{ id: '5', gradeName: 'C1', minPercentage: 51, maxPercentage: 60, gradePoint: 6.0, description: 'Fair', color: '#6366f1', isDistinction: false, isPass: true, order: 5, remarks: 'Fair' },
{ id: '6', gradeName: 'C2', minPercentage: 41, maxPercentage: 50, gradePoint: 5.0, description: 'Average', color: '#8b5cf6', isDistinction: false, isPass: true, order: 6, remarks: 'Average' },
{ id: '7', gradeName: 'D', minPercentage: 33, maxPercentage: 40, gradePoint: 4.0, description: 'Below Average', color: '#f59e0b', isDistinction: false, isPass: true, order: 7, remarks: 'Below Average' },
{ id: '8', gradeName: 'E', minPercentage: 0, maxPercentage: 32, gradePoint: 0, description: 'Fail', color: '#dc2626', isDistinction: false, isPass: false, order: 8, remarks: 'Needs Improvement' }];


const DEFAULT_ICSE_GRADES: GradeDefinition[] = [
{ id: '1', gradeName: 'A+', minPercentage: 90, maxPercentage: 100, gradePoint: 10.0, description: 'Exceptional', color: '#059669', isDistinction: true, isPass: true, order: 1, remarks: 'Exceptional' },
{ id: '2', gradeName: 'A', minPercentage: 80, maxPercentage: 89, gradePoint: 9.0, description: 'Excellent', color: '#10b981', isDistinction: true, isPass: true, order: 2, remarks: 'Excellent' },
{ id: '3', gradeName: 'B+', minPercentage: 70, maxPercentage: 79, gradePoint: 8.0, description: 'Very Good', color: '#22c55e', isDistinction: false, isPass: true, order: 3, remarks: 'Very Good' },
{ id: '4', gradeName: 'B', minPercentage: 60, maxPercentage: 69, gradePoint: 7.0, description: 'Good', color: '#3b82f6', isDistinction: false, isPass: true, order: 4, remarks: 'Good' },
{ id: '5', gradeName: 'C+', minPercentage: 50, maxPercentage: 59, gradePoint: 6.0, description: 'Fair', color: '#6366f1', isDistinction: false, isPass: true, order: 5, remarks: 'Fair' },
{ id: '6', gradeName: 'C', minPercentage: 40, maxPercentage: 49, gradePoint: 5.0, description: 'Satisfactory', color: '#8b5cf6', isDistinction: false, isPass: true, order: 6, remarks: 'Satisfactory' },
{ id: '7', gradeName: 'D', minPercentage: 35, maxPercentage: 39, gradePoint: 4.0, description: 'Pass', color: '#f59e0b', isDistinction: false, isPass: true, order: 7, remarks: 'Pass' },
{ id: '8', gradeName: 'F', minPercentage: 0, maxPercentage: 34, gradePoint: 0, description: 'Fail', color: '#dc2626', isDistinction: false, isPass: false, order: 8, remarks: 'Fail' }];


const DEFAULT_GRACE_RULES: GraceMarksRule[] = [
{ id: '1', ruleName: 'Standard Grace Marks', maxGraceMarks: 5, applicableFor: 'failing', conditions: ['Within 5 marks of passing', 'Maximum 2 subjects'], isActive: true },
{ id: '2', ruleName: 'Sports Quota Grace', maxGraceMarks: 10, applicableFor: 'all', conditions: ['State/National level participation', 'Certificate required'], isActive: true },
{ id: '3', ruleName: 'NCC/NSS Grace', maxGraceMarks: 5, applicableFor: 'all', conditions: ['Active participation certificate'], isActive: true }];


const DEFAULT_PROMOTION_RULES: PromotionRule[] = [
{ id: '1', ruleName: 'Standard Promotion', minPassingSubjects: 5, totalSubjects: 6, compulsorySubjects: ['English', 'Mathematics'], allowCompartment: true, maxCompartmentSubjects: 2, attendanceRequired: 75, isActive: true }];


/* ================================
   Utility Components
================================ */

const Card: React.FC<{children: React.ReactNode;className?: string;}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {children}
  </div>;


const Badge: React.FC<{children: React.ReactNode;variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';}> = ({ children, variant = 'neutral' }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[variant]}`}>
      {children}
    </span>);

};

const Tooltip: React.FC<{content: string;children: React.ReactNode;}> = ({ content, children }) =>
<div className="relative group inline-block">
    {children}
    <div className="absolute z-50 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg py-2 px-3 -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>;


const Switch: React.FC<{checked: boolean;onChange: (checked: boolean) => void;disabled?: boolean;}> = ({ checked, onChange, disabled = false }) =>
<button
  type="button"
  onClick={() => !disabled && onChange(!checked)}
  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
  checked ? 'bg-blue-600' : 'bg-gray-200'} ${
  disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

    <span
    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
    checked ? 'translate-x-6' : 'translate-x-1'}`
    } />

  </button>;


/* ================================
   Main Component
================================ */

export function GradeCalculationSetup() {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [config, setConfig] = useState<GradeConfiguration | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basicInfo: true,
    thresholds: true,
    rounding: true,
    specialCases: true
  });

  // Preview state
  const [testPercentage, setTestPercentage] = useState<string>('');
  const [previewResult, setPreviewResult] = useState<GradeDefinition | null>(null);

  /* ================================
     Initialize Configuration
  ================================ */

  useEffect(() => {
    const savedConfig = localStorage.getItem('gradeConfiguration');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch {
        initializeDefaultConfig('GSEB');
      }
    } else {
      initializeDefaultConfig('GSEB');
    }
  }, []);

  const initializeDefaultConfig = (boardType: GradeConfiguration['boardType']) => {
    let grades = DEFAULT_GSEB_GRADES;
    let passingPercentage = 33;

    switch (boardType) {
      case 'CBSE':
        grades = DEFAULT_CBSE_GRADES;
        passingPercentage = 33;
        break;
      case 'ICSE':
        grades = DEFAULT_ICSE_GRADES;
        passingPercentage = 35;
        break;
      default:
        grades = DEFAULT_GSEB_GRADES;
        passingPercentage = 33;
    }

    const defaultConfig: GradeConfiguration = {
      id: crypto.randomUUID(),
      configName: `${boardType} Standard Grading System`,
      academicYear: '2024-25',
      boardType,
      classLevel: ['9', '10', '11', '12'],
      status: 'draft',
      passingPercentage,
      distinctionPercentage: 75,
      meritPercentage: 60,
      grades: grades.map((g) => ({ ...g, id: crypto.randomUUID() })),
      graceMarksRules: DEFAULT_GRACE_RULES.map((r) => ({ ...r, id: crypto.randomUUID() })),
      roundingRule: {
        type: 'nearest',
        decimalPlaces: 2,
        threshold: 0.5
      },
      cgpaConfig: {
        enabled: true,
        maxGradePoint: 10,
        formula: 'simple_average',
        minimumCGPA: 4.0
      },
      promotionRules: DEFAULT_PROMOTION_RULES.map((r) => ({ ...r, id: crypto.randomUUID() })),
      specialCases: {
        absentMarking: 'AB',
        medicalCases: true,
        sportsQuota: true,
        differentlyAbled: true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'System',
      isLocked: false,
      version: 1
    };
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  /* ================================
     Validation
  ================================ */

  const validateConfiguration = useCallback((): string[] => {
    const errors: string[] = [];
    if (!config) return errors;

    // Sort grades by max percentage descending
    const sortedGrades = [...config.grades].sort((a, b) => b.maxPercentage - a.maxPercentage);

    // Check for empty grade names
    const emptyGrades = config.grades.filter((g) => !g.gradeName.trim());
    if (emptyGrades.length > 0) {
      errors.push('All grades must have a name');
    }

    // Check highest grade ends at 100
    if (sortedGrades.length > 0 && sortedGrades[0].maxPercentage !== 100) {
      errors.push('Highest grade must end at 100%');
    }

    // Check lowest grade starts at 0
    if (sortedGrades.length > 0 && sortedGrades[sortedGrades.length - 1].minPercentage !== 0) {
      errors.push('Lowest grade must start at 0%');
    }

    // Check for gaps and overlaps
    for (let i = 0; i < sortedGrades.length - 1; i++) {
      const current = sortedGrades[i];
      const next = sortedGrades[i + 1];

      if (current.minPercentage - 1 !== next.maxPercentage) {
        if (current.minPercentage <= next.maxPercentage) {
          errors.push(`Overlap between ${current.gradeName} and ${next.gradeName}`);
        } else {
          errors.push(`Gap between ${current.gradeName} and ${next.gradeName}`);
        }
      }
    }

    // Validate min < max for each grade
    config.grades.forEach((grade) => {
      if (grade.minPercentage > grade.maxPercentage) {
        errors.push(`${grade.gradeName}: Min percentage cannot be greater than max percentage`);
      }
    });

    // Validate at least one passing grade
    const passingGrades = config.grades.filter((g) => g.isPass);
    if (passingGrades.length === 0) {
      errors.push('At least one grade must be marked as passing');
    }

    // Validate CGPA max matches highest grade point
    if (config.cgpaConfig.enabled) {
      const maxGP = Math.max(...config.grades.map((g) => g.gradePoint));
      if (maxGP !== config.cgpaConfig.maxGradePoint) {
        errors.push(`Max grade point (${maxGP}) should match CGPA max (${config.cgpaConfig.maxGradePoint})`);
      }
    }

    return errors;
  }, [config]);

  useEffect(() => {
    if (config) {
      const errors = validateConfiguration();
      setValidationErrors(errors);
    }
  }, [config, validateConfiguration]);

  /* ================================
     Save Configuration
  ================================ */

  const saveConfiguration = async () => {
    if (!config) return;

    const errors = validateConfiguration();
    if (errors.length > 0) {
      setShowValidation(true);
      return;
    }

    setIsSaving(true);
    try {
      const updatedConfig = {
        ...config,
        updatedAt: new Date().toISOString(),
        version: config.version + 1,
        status: 'active' as const
      };

      localStorage.setItem('gradeConfiguration', JSON.stringify(updatedConfig));
      setConfig(updatedConfig);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /* ================================
     Update Handlers
  ================================ */

  const updateConfig = <K extends keyof GradeConfiguration,>(key: K, value: GradeConfiguration[K]) => {
    if (!config || config.isLocked) return;
    setConfig({ ...config, [key]: value });
    setHasChanges(true);
  };

  const updateGrade = (gradeId: string, updates: Partial<GradeDefinition>) => {
    if (!config || config.isLocked) return;
    const updatedGrades = config.grades.map((g) =>
    g.id === gradeId ? { ...g, ...updates } : g
    );
    updateConfig('grades', updatedGrades);
  };

  const addGrade = () => {
    if (!config || config.isLocked) return;
    const newGrade: GradeDefinition = {
      id: crypto.randomUUID(),
      gradeName: '',
      minPercentage: 0,
      maxPercentage: 0,
      gradePoint: 0,
      description: '',
      color: '#6b7280',
      isDistinction: false,
      isPass: false,
      order: config.grades.length + 1,
      remarks: ''
    };
    updateConfig('grades', [...config.grades, newGrade]);
  };

  const deleteGrade = (gradeId: string) => {
    if (!config || config.isLocked) return;
    if (config.grades.length <= 2) {
      return;
    }
    updateConfig('grades', config.grades.filter((g) => g.id !== gradeId));
  };

  const duplicateGrade = (grade: GradeDefinition) => {
    if (!config || config.isLocked) return;
    const newGrade: GradeDefinition = {
      ...grade,
      id: crypto.randomUUID(),
      gradeName: `${grade.gradeName} (Copy)`,
      order: config.grades.length + 1
    };
    updateConfig('grades', [...config.grades, newGrade]);
  };

  /* ================================
     Grade Calculation
  ================================ */

  const calculateGrade = (percentage: number): GradeDefinition | null => {
    if (!config) return null;
    return config.grades.find(
      (g) => percentage >= g.minPercentage && percentage <= g.maxPercentage
    ) || null;
  };

  const handleTestCalculation = () => {
    const percentage = parseFloat(testPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      setPreviewResult(null);
      return;
    }
    const grade = calculateGrade(percentage);
    setPreviewResult(grade);
  };

  /* ================================
     Export/Import
  ================================ */

  const exportConfiguration = () => {
    if (!config) return;
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grade-config-${config.boardType}-${config.academicYear}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as GradeConfiguration;
        imported.id = crypto.randomUUID();
        imported.createdAt = new Date().toISOString();
        imported.updatedAt = new Date().toISOString();
        imported.isLocked = false;
        setConfig(imported);
        setHasChanges(true);
      } catch {
        alert('Invalid configuration file');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const loadTemplate = (boardType: GradeConfiguration['boardType']) => {
    if (config?.isLocked) return;
    initializeDefaultConfig(boardType);
  };

  const resetToDefault = () => {
    if (config?.isLocked) return;
    if (window.confirm('Are you sure you want to reset to default? All changes will be lost.')) {
      initializeDefaultConfig(config?.boardType || 'GSEB');
    }
  };

  /* ================================
     Toggle Sections
  ================================ */

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  /* ================================
     Render
  ================================ */

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading configuration...</p>
        </div>
      </div>);

  }

  const tabs: {id: TabType;label: string;icon: React.ReactNode;}[] = [
  { id: 'overview', label: 'Overview', icon: <Settings className="w-4 h-4" /> },
  { id: 'grades', label: 'Grade Scale', icon: <Award className="w-4 h-4" /> },
  { id: 'grace', label: 'Grace Marks', icon: <Star className="w-4 h-4" /> },
  { id: 'cgpa', label: 'CGPA Setup', icon: <Calculator className="w-4 h-4" /> },
  { id: 'promotion', label: 'Promotion Rules', icon: <TrendingUp className="w-4 h-4" /> },
  { id: 'preview', label: 'Preview & Test', icon: <Eye className="w-4 h-4" /> }];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Grade Calculation Setup</h1>
                <p className="text-sm text-gray-500">
                  {config.boardType} • {config.academicYear}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Save Success Message */}
              {saveSuccess &&
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Saved successfully!
                </div>
              }

              {/* Status Badge */}
              <Badge variant={config.status === 'active' ? 'success' : config.status === 'draft' ? 'warning' : 'neutral'}>
                {config.status.charAt(0).toUpperCase() + config.status.slice(1)}
              </Badge>

              {/* Lock Status */}
              <Tooltip content={config.isLocked ? 'Configuration is locked' : 'Configuration is unlocked'}>
                <button
                  onClick={() => updateConfig('isLocked', !config.isLocked)}
                  className={`p-2 rounded-lg transition-colors ${
                  config.isLocked ?
                  'text-amber-500 bg-amber-50 hover:bg-amber-100' :
                  'text-green-500 bg-green-50 hover:bg-green-100'}`
                  }>

                  {config.isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </button>
              </Tooltip>

              {/* Validation Status */}
              {validationErrors.length > 0 ?
              <Tooltip content={`${validationErrors.length} validation error(s)`}>
                  <button
                  onClick={() => setShowValidation(true)}
                  className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg">

                    <AlertCircle className="w-5 h-5" />
                  </button>
                </Tooltip> :

              <Tooltip content="All validations passed">
                  <div className="p-2 text-green-500 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </Tooltip>
              }

              {/* Export */}
              <Tooltip content="Export Configuration">
                <button
                  onClick={exportConfiguration}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">

                  <Download className="w-5 h-5" />
                </button>
              </Tooltip>

              {/* Import */}
              <Tooltip content="Import Configuration">
                <label className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg cursor-pointer">
                  <Upload className="w-5 h-5" />
                  <input type="file" accept=".json" onChange={importConfiguration} className="hidden" />
                </label>
              </Tooltip>

              {/* Reset */}
              <Tooltip content="Reset to Default">
                <button
                  onClick={resetToDefault}
                  disabled={config.isLocked}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">

                  <RotateCcw className="w-5 h-5" />
                </button>
              </Tooltip>

              {/* Save Button */}
              <button
                onClick={saveConfiguration}
                disabled={isSaving || config.isLocked || !hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                hasChanges && !config.isLocked ?
                'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25' :
                'bg-gray-100 text-gray-400 cursor-not-allowed'}`
                }>

                {isSaving ?
                <RefreshCw className="w-4 h-4 animate-spin" /> :

                <Save className="w-4 h-4" />
                }
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ?
              'border-blue-600 text-blue-600' :
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
              }>

                {tab.icon}
                {tab.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Validation Modal */}
        {showValidation && validationErrors.length > 0 &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Validation Errors</h3>
                    <p className="text-sm text-gray-500">Please fix the following issues before saving</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                  {validationErrors.map((error, idx) =>
                <li key={idx} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                      <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {error}
                    </li>
                )}
                </ul>
                <button
                onClick={() => setShowValidation(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors">

                  Close
                </button>
              </div>
            </Card>
          </div>
        }

        {/* Locked Warning Banner */}
        {config.isLocked &&
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="font-medium text-amber-800">Configuration is Locked</p>
              <p className="text-sm text-amber-600">Unlock the configuration to make changes</p>
            </div>
            <button
            onClick={() => updateConfig('isLocked', false)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm">

              Unlock
            </button>
          </div>
        }

        {/* Overview Tab */}
        {activeTab === 'overview' &&
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Grades</p>
                    <p className="text-2xl font-bold text-gray-900">{config.grades.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Passing %</p>
                    <p className="text-2xl font-bold text-gray-900">{config.passingPercentage}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Distinction %</p>
                    <p className="text-2xl font-bold text-gray-900">{config.distinctionPercentage}%</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Max CGPA</p>
                    <p className="text-2xl font-bold text-gray-900">{config.cgpaConfig.maxGradePoint}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Basic Information */}
            <Card>
              <button
              onClick={() => toggleSection('basicInfo')}
              className="w-full flex items-center justify-between p-5 text-left">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <p className="text-sm text-gray-500">Configuration name, academic year, and board type</p>
                  </div>
                </div>
                {expandedSections.basicInfo ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {expandedSections.basicInfo &&
            <div className="px-5 pb-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Configuration Name
                      </label>
                      <input
                    type="text"
                    value={config.configName}
                    onChange={(e) => updateConfig('configName', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={config.isLocked} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Academic Year
                      </label>
                      <input
                    type="text"
                    value={config.academicYear}
                    onChange={(e) => updateConfig('academicYear', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="2024-25"
                    disabled={config.isLocked} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Board Type
                      </label>
                      <select
                    value={config.boardType}
                    onChange={(e) => {
                      const newBoard = e.target.value as GradeConfiguration['boardType'];
                      if (window.confirm(`Loading ${newBoard} template will replace current grades. Continue?`)) {
                        loadTemplate(newBoard);
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    disabled={config.isLocked}>

                        <option value="GSEB">GSEB - Gujarat Board</option>
                        <option value="CBSE">CBSE - Central Board</option>
                        <option value="ICSE">ICSE - Indian Certificate</option>
                        <option value="STATE">State Board</option>
                        <option value="CUSTOM">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable Classes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map((cls) =>
                  <button
                    key={cls}
                    onClick={() => {
                      const current = config.classLevel;
                      const updated = current.includes(cls) ?
                      current.filter((c) => c !== cls) :
                      [...current, cls];
                      updateConfig('classLevel', updated);
                    }}
                    disabled={config.isLocked}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    config.classLevel.includes(cls) ?
                    'bg-blue-600 text-white shadow-lg shadow-blue-600/25' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${
                    config.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>

                          Class {cls}
                        </button>
                  )}
                    </div>
                  </div>
                </div>
            }
            </Card>

            {/* Threshold Settings */}
            <Card>
              <button
              onClick={() => toggleSection('thresholds')}
              className="w-full flex items-center justify-between p-5 text-left">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Threshold Settings</h2>
                    <p className="text-sm text-gray-500">Passing, distinction, and merit percentages</p>
                  </div>
                </div>
                {expandedSections.thresholds ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {expandedSections.thresholds &&
            <div className="px-5 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Passing Percentage
                      </label>
                      <div className="relative">
                        <input
                      type="number"
                      value={config.passingPercentage}
                      onChange={(e) => updateConfig('passingPercentage', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      min="0"
                      max="100"
                      disabled={config.isLocked} />

                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">Minimum to pass</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Distinction Percentage
                      </label>
                      <div className="relative">
                        <input
                      type="number"
                      value={config.distinctionPercentage}
                      onChange={(e) => updateConfig('distinctionPercentage', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      min="0"
                      max="100"
                      disabled={config.isLocked} />

                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">Minimum for distinction</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Merit Percentage
                      </label>
                      <div className="relative">
                        <input
                      type="number"
                      value={config.meritPercentage}
                      onChange={(e) => updateConfig('meritPercentage', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      min="0"
                      max="100"
                      disabled={config.isLocked} />

                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">Minimum for merit</p>
                    </div>
                  </div>
                </div>
            }
            </Card>

            {/* Rounding Rules */}
            <Card>
              <button
              onClick={() => toggleSection('rounding')}
              className="w-full flex items-center justify-between p-5 text-left">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Rounding Rules</h2>
                    <p className="text-sm text-gray-500">How percentages and grades are rounded</p>
                  </div>
                </div>
                {expandedSections.rounding ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {expandedSections.rounding &&
            <div className="px-5 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Rounding Type
                      </label>
                      <select
                    value={config.roundingRule.type}
                    onChange={(e) => updateConfig('roundingRule', { ...config.roundingRule, type: e.target.value as RoundingRule['type'] })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={config.isLocked}>

                        <option value="none">No Rounding</option>
                        <option value="nearest">Round to Nearest</option>
                        <option value="up">Round Up</option>
                        <option value="down">Round Down</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Decimal Places
                      </label>
                      <input
                    type="number"
                    value={config.roundingRule.decimalPlaces}
                    onChange={(e) => updateConfig('roundingRule', { ...config.roundingRule, decimalPlaces: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="4"
                    disabled={config.isLocked} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Rounding Threshold
                      </label>
                      <input
                    type="number"
                    value={config.roundingRule.threshold}
                    onChange={(e) => updateConfig('roundingRule', { ...config.roundingRule, threshold: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    step="0.1"
                    min="0"
                    max="1"
                    disabled={config.isLocked} />

                    </div>
                  </div>
                </div>
            }
            </Card>

            {/* Special Cases */}
            <Card>
              <button
              onClick={() => toggleSection('specialCases')}
              className="w-full flex items-center justify-between p-5 text-left">

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Special Cases</h2>
                    <p className="text-sm text-gray-500">Medical cases, sports quota, and other provisions</p>
                  </div>
                </div>
                {expandedSections.specialCases ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </button>

              {expandedSections.specialCases &&
            <div className="px-5 pb-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Absent Marking Symbol
                    </label>
                    <input
                  type="text"
                  value={config.specialCases.absentMarking}
                  onChange={(e) => updateConfig('specialCases', { ...config.specialCases, absentMarking: e.target.value })}
                  className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-mono"
                  maxLength={3}
                  disabled={config.isLocked} />

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Medical Cases</p>
                          <p className="text-sm text-gray-500">Special consideration</p>
                        </div>
                      </div>
                      <Switch
                    checked={config.specialCases.medicalCases}
                    onChange={(checked) => updateConfig('specialCases', { ...config.specialCases, medicalCases: checked })}
                    disabled={config.isLocked} />

                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Sports Quota</p>
                          <p className="text-sm text-gray-500">Sports benefits</p>
                        </div>
                      </div>
                      <Switch
                    checked={config.specialCases.sportsQuota}
                    onChange={(checked) => updateConfig('specialCases', { ...config.specialCases, sportsQuota: checked })}
                    disabled={config.isLocked} />

                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">Differently Abled</p>
                          <p className="text-sm text-gray-500">Special provisions</p>
                        </div>
                      </div>
                      <Switch
                    checked={config.specialCases.differentlyAbled}
                    onChange={(checked) => updateConfig('specialCases', { ...config.specialCases, differentlyAbled: checked })}
                    disabled={config.isLocked} />

                    </div>
                  </div>
                </div>
            }
            </Card>

            {/* Version Info */}
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <History className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Version {config.version}</p>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(config.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={hasChanges ? 'warning' : 'success'}>
                  {hasChanges ? 'Unsaved Changes' : 'All Changes Saved'}
                </Badge>
              </div>
            </Card>
          </div>
        }

        {/* Grades Tab */}
        {activeTab === 'grades' &&
        <div className="space-y-6">
            <Card>
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Grade Scale Definition</h2>
                    <p className="text-sm text-gray-500">Define grade ranges, points, and descriptions</p>
                  </div>
                  <button
                  onClick={addGrade}
                  disabled={config.isLocked}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                    <Plus className="w-4 h-4" />
                    Add Grade
                  </button>
                </div>
              </div>

              {/* Grade Scale Visual */}
              <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <p className="text-sm font-medium text-gray-700 mb-3">Grade Scale Preview</p>
                <div className="flex h-10 rounded-xl overflow-hidden shadow-inner">
                  {[...config.grades].
                sort((a, b) => b.maxPercentage - a.maxPercentage).
                map((grade) => {
                  const width = grade.maxPercentage - grade.minPercentage + 1;
                  return (
                    <Tooltip key={grade.id} content={`${grade.gradeName}: ${grade.minPercentage}% - ${grade.maxPercentage}%`}>
                          <div
                        className="flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
                        style={{
                          backgroundColor: grade.color,
                          width: `${width}%`,
                          minWidth: width > 5 ? '30px' : '10px'
                        }}>

                            {width > 8 && grade.gradeName}
                          </div>
                        </Tooltip>);

                })}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <span className="text-xs text-gray-500 font-medium">0%</span>
                  <span className="text-xs text-gray-500 font-medium">50%</span>
                  <span className="text-xs text-gray-500 font-medium">100%</span>
                </div>
              </div>

              {/* Grade Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Range (%)</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade Point</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Remarks</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Color</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[...config.grades].
                  sort((a, b) => b.maxPercentage - a.maxPercentage).
                  map((grade) =>
                  <tr key={grade.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
                          style={{ backgroundColor: grade.color }}>

                                {grade.gradeName || '?'}
                              </div>
                              <input
                          type="text"
                          value={grade.gradeName}
                          onChange={(e) => updateGrade(grade.id, { gradeName: e.target.value })}
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="A1"
                          disabled={config.isLocked} />

                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <input
                          type="number"
                          value={grade.minPercentage}
                          onChange={(e) => updateGrade(grade.id, { minPercentage: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          disabled={config.isLocked} />

                              <span className="text-gray-400 font-medium">-</span>
                              <input
                          type="number"
                          value={grade.maxPercentage}
                          onChange={(e) => updateGrade(grade.id, { maxPercentage: parseFloat(e.target.value) || 0 })}
                          className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                          disabled={config.isLocked} />

                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <input
                        type="number"
                        value={grade.gradePoint}
                        onChange={(e) => updateGrade(grade.id, { gradePoint: parseFloat(e.target.value) || 0 })}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:ring-2 focus:ring-blue-500"
                        step="0.5"
                        min="0"
                        max="10"
                        disabled={config.isLocked} />

                          </td>
                          <td className="px-4 py-4">
                            <input
                        type="text"
                        value={grade.description}
                        onChange={(e) => updateGrade(grade.id, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Description"
                        disabled={config.isLocked} />

                          </td>
                          <td className="px-4 py-4">
                            <input
                        type="text"
                        value={grade.remarks}
                        onChange={(e) => updateGrade(grade.id, { remarks: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Remarks"
                        disabled={config.isLocked} />

                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col items-center gap-2">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                            type="checkbox"
                            checked={grade.isPass}
                            onChange={(e) => updateGrade(grade.id, { isPass: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                            disabled={config.isLocked} />

                                <span className={grade.isPass ? 'text-green-600 font-medium' : 'text-gray-500'}>Pass</span>
                              </label>
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                            type="checkbox"
                            checked={grade.isDistinction}
                            onChange={(e) => updateGrade(grade.id, { isDistinction: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={config.isLocked} />

                                <span className={grade.isDistinction ? 'text-blue-600 font-medium' : 'text-gray-500'}>Distinction</span>
                              </label>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <input
                        type="color"
                        value={grade.color}
                        onChange={(e) => updateGrade(grade.id, { color: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-300 transition-colors"
                        disabled={config.isLocked} />

                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip content="Duplicate">
                                <button
                            onClick={() => duplicateGrade(grade)}
                            disabled={config.isLocked}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                                  <Copy className="w-4 h-4" />
                                </button>
                              </Tooltip>
                              <Tooltip content="Delete">
                                <button
                            onClick={() => deleteGrade(grade.id)}
                            disabled={config.isLocked || config.grades.length <= 2}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Quick Templates */}
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Load Board Template</h3>
              <p className="text-sm text-gray-500 mb-4">Select a board to load its standard grade configuration</p>
              <div className="flex flex-wrap gap-3">
                {(['GSEB', 'CBSE', 'ICSE'] as const).map((board) =>
              <button
                key={board}
                onClick={() => {
                  if (window.confirm(`Loading ${board} template will replace current grades. Continue?`)) {
                    loadTemplate(board);
                  }
                }}
                disabled={config.isLocked}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                config.boardType === board ?
                'bg-blue-600 text-white shadow-lg shadow-blue-600/25' :
                'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`
                }>

                    {board} Template
                  </button>
              )}
              </div>
            </Card>
          </div>
        }

        {/* Grace Marks Tab */}
        {activeTab === 'grace' &&
        <div className="space-y-6">
            <Card>
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Grace Marks Rules</h2>
                    <p className="text-sm text-gray-500">Configure grace marks policies and conditions</p>
                  </div>
                  <button
                  onClick={() => {
                    const newRule: GraceMarksRule = {
                      id: crypto.randomUUID(),
                      ruleName: '',
                      maxGraceMarks: 0,
                      applicableFor: 'failing',
                      conditions: [],
                      isActive: true
                    };
                    updateConfig('graceMarksRules', [...config.graceMarksRules, newRule]);
                  }}
                  disabled={config.isLocked}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">

                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {config.graceMarksRules.map((rule) =>
              <div key={rule.id} className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Rule Name</label>
                        <input
                      type="text"
                      value={rule.ruleName}
                      onChange={(e) => {
                        const updated = config.graceMarksRules.map((r) =>
                        r.id === rule.id ? { ...r, ruleName: e.target.value } : r
                        );
                        updateConfig('graceMarksRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Rule name"
                      disabled={config.isLocked} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Grace Marks</label>
                        <input
                      type="number"
                      value={rule.maxGraceMarks}
                      onChange={(e) => {
                        const updated = config.graceMarksRules.map((r) =>
                        r.id === rule.id ? { ...r, maxGraceMarks: parseInt(e.target.value) || 0 } : r
                        );
                        updateConfig('graceMarksRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      disabled={config.isLocked} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Applicable For</label>
                        <select
                      value={rule.applicableFor}
                      onChange={(e) => {
                        const updated = config.graceMarksRules.map((r) =>
                        r.id === rule.id ? { ...r, applicableFor: e.target.value as GraceMarksRule['applicableFor'] } : r
                        );
                        updateConfig('graceMarksRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      disabled={config.isLocked}>

                          <option value="failing">Failing Students</option>
                          <option value="all">All Students</option>
                          <option value="distinction">Distinction Boundary</option>
                        </select>
                      </div>
                      <div className="flex items-end gap-3">
                        <label className="flex items-center gap-2">
                          <Switch
                        checked={rule.isActive}
                        onChange={(checked) => {
                          const updated = config.graceMarksRules.map((r) =>
                          r.id === rule.id ? { ...r, isActive: checked } : r
                          );
                          updateConfig('graceMarksRules', updated);
                        }}
                        disabled={config.isLocked} />

                          <span className="text-sm font-medium">{rule.isActive ? 'Active' : 'Inactive'}</span>
                        </label>
                        <button
                      onClick={() => {
                        updateConfig('graceMarksRules', config.graceMarksRules.filter((r) => r.id !== rule.id));
                      }}
                      disabled={config.isLocked}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-2">Conditions</label>
                      <div className="flex flex-wrap gap-2">
                        {rule.conditions.map((condition, idx) =>
                    <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {condition}
                            <button
                        onClick={() => {
                          const updated = config.graceMarksRules.map((r) =>
                          r.id === rule.id ?
                          { ...r, conditions: r.conditions.filter((_, i) => i !== idx) } :
                          r
                          );
                          updateConfig('graceMarksRules', updated);
                        }}
                        disabled={config.isLocked}
                        className="ml-1 text-blue-400 hover:text-red-500 transition-colors">

                              <X className="w-3 h-3" />
                            </button>
                          </span>
                    )}
                        <input
                      type="text"
                      placeholder="Add condition + Enter"
                      className="px-3 py-1.5 border border-dashed border-gray-300 rounded-full text-sm focus:border-blue-500 focus:outline-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            const updated = config.graceMarksRules.map((r) =>
                            r.id === rule.id ?
                            { ...r, conditions: [...r.conditions, input.value.trim()] } :
                            r
                            );
                            updateConfig('graceMarksRules', updated);
                            input.value = '';
                          }
                        }
                      }}
                      disabled={config.isLocked} />

                      </div>
                    </div>
                  </div>
              )}

                {config.graceMarksRules.length === 0 &&
              <div className="p-10 text-center text-gray-500">
                    <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No grace marks rules configured</p>
                    <p className="text-sm">Add rules to define grace marks policies</p>
                  </div>
              }
              </div>
            </Card>
          </div>
        }

        {/* CGPA Tab */}
        {activeTab === 'cgpa' &&
        <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">CGPA Configuration</h2>
                    <p className="text-sm text-gray-500">Configure Cumulative Grade Point Average calculation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {config.cgpaConfig.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Switch
                  checked={config.cgpaConfig.enabled}
                  onChange={(checked) => updateConfig('cgpaConfig', { ...config.cgpaConfig, enabled: checked })}
                  disabled={config.isLocked} />

                </div>
              </div>

              {config.cgpaConfig.enabled &&
            <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Maximum Grade Point
                      </label>
                      <input
                    type="number"
                    value={config.cgpaConfig.maxGradePoint}
                    onChange={(e) => updateConfig('cgpaConfig', { ...config.cgpaConfig, maxGradePoint: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    step="0.5"
                    min="1"
                    max="10"
                    disabled={config.isLocked} />

                      <p className="text-xs text-gray-500 mt-1.5">Usually 10 for Indian boards</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Minimum CGPA for Pass
                      </label>
                      <input
                    type="number"
                    value={config.cgpaConfig.minimumCGPA}
                    onChange={(e) => updateConfig('cgpaConfig', { ...config.cgpaConfig, minimumCGPA: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    step="0.5"
                    min="0"
                    max="10"
                    disabled={config.isLocked} />

                      <p className="text-xs text-gray-500 mt-1.5">Minimum CGPA required to pass</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Calculation Formula
                    </label>
                    <select
                  value={config.cgpaConfig.formula}
                  onChange={(e) => updateConfig('cgpaConfig', { ...config.cgpaConfig, formula: e.target.value as CGPAConfig['formula'] })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={config.isLocked}>

                      <option value="simple_average">Simple Average (Sum of GP / Number of Subjects)</option>
                      <option value="weighted_average">Weighted Average (Based on Max Marks)</option>
                      <option value="credit_based">Credit Based (Higher Education Style)</option>
                    </select>
                  </div>

                  {/* Formula Preview */}
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Formula Preview
                    </h4>
                    <code className="block text-sm text-purple-800 bg-white/50 p-3 rounded-lg font-mono">
                      {config.cgpaConfig.formula === 'simple_average' && 'CGPA = Σ(Grade Points) / Number of Subjects'}
                      {config.cgpaConfig.formula === 'weighted_average' && 'CGPA = Σ(Grade Points × Max Marks) / Σ(Max Marks)'}
                      {config.cgpaConfig.formula === 'credit_based' && 'CGPA = Σ(Grade Points × Credits) / Σ(Credits)'}
                    </code>
                  </div>
                </div>
            }
            </Card>
          </div>
        }

        {/* Promotion Rules Tab */}
        {activeTab === 'promotion' &&
        <div className="space-y-6">
            <Card>
              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Promotion Rules</h2>
                    <p className="text-sm text-gray-500">Define rules for student promotion to next class</p>
                  </div>
                  <button
                  onClick={() => {
                    const newRule: PromotionRule = {
                      id: crypto.randomUUID(),
                      ruleName: '',
                      minPassingSubjects: 0,
                      totalSubjects: 0,
                      compulsorySubjects: [],
                      allowCompartment: false,
                      maxCompartmentSubjects: 0,
                      attendanceRequired: 75,
                      isActive: true
                    };
                    updateConfig('promotionRules', [...config.promotionRules, newRule]);
                  }}
                  disabled={config.isLocked}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">

                    <Plus className="w-4 h-4" />
                    Add Rule
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {config.promotionRules.map((rule) =>
              <div key={rule.id} className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Rule Name</label>
                        <input
                      type="text"
                      value={rule.ruleName}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, ruleName: e.target.value } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Rule name"
                      disabled={config.isLocked} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Passing Subjects</label>
                        <input
                      type="number"
                      value={rule.minPassingSubjects}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, minPassingSubjects: parseInt(e.target.value) || 0 } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      disabled={config.isLocked} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Total Subjects</label>
                        <input
                      type="number"
                      value={rule.totalSubjects}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, totalSubjects: parseInt(e.target.value) || 0 } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      disabled={config.isLocked} />

                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">Attendance Required (%)</label>
                        <input
                      type="number"
                      value={rule.attendanceRequired}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, attendanceRequired: parseInt(e.target.value) || 0 } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="100"
                      disabled={config.isLocked} />

                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={rule.allowCompartment}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, allowCompartment: e.target.checked } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={config.isLocked} />

                        <span className="text-sm font-medium">Allow Compartment</span>
                      </label>

                      {rule.allowCompartment &&
                  <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Max Compartment Subjects:</label>
                          <input
                      type="number"
                      value={rule.maxCompartmentSubjects}
                      onChange={(e) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, maxCompartmentSubjects: parseInt(e.target.value) || 0 } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="5"
                      disabled={config.isLocked} />

                        </div>
                  }
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <label className="flex items-center gap-2">
                        <Switch
                      checked={rule.isActive}
                      onChange={(checked) => {
                        const updated = config.promotionRules.map((r) =>
                        r.id === rule.id ? { ...r, isActive: checked } : r
                        );
                        updateConfig('promotionRules', updated);
                      }}
                      disabled={config.isLocked} />

                        <span className="text-sm font-medium">{rule.isActive ? 'Active' : 'Inactive'}</span>
                      </label>
                      <button
                    onClick={() => {
                      updateConfig('promotionRules', config.promotionRules.filter((r) => r.id !== rule.id));
                    }}
                    disabled={config.isLocked}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50 transition-colors">

                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
              )}

                {config.promotionRules.length === 0 &&
              <div className="p-10 text-center text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No promotion rules configured</p>
                    <p className="text-sm">Add rules to define promotion criteria</p>
                  </div>
              }
              </div>
            </Card>
          </div>
        }

        {/* Preview Tab */}
        {activeTab === 'preview' &&
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Grade Calculator */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Test Grade Calculation</h2>
                    <p className="text-sm text-gray-500">Enter a percentage to see the corresponding grade</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Percentage
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input
                      type="number"
                      value={testPercentage}
                      onChange={(e) => setTestPercentage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTestCalculation()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                      placeholder="Enter percentage (0-100)"
                      min="0"
                      max="100" />

                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                    onClick={handleTestCalculation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">

                      Calculate
                    </button>
                  </div>
                </div>

                {/* Result */}
                {previewResult &&
              <div
                className="p-8 rounded-2xl text-white text-center shadow-lg"
                style={{ backgroundColor: previewResult.color }}>

                    <div className="text-6xl font-bold mb-2">{previewResult.gradeName}</div>
                    <div className="text-xl opacity-90 mb-4">{previewResult.description}</div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                      <div>
                        <div className="text-sm opacity-75">Grade Point</div>
                        <div className="text-3xl font-bold">{previewResult.gradePoint}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-75">Range</div>
                        <div className="text-xl font-bold">{previewResult.minPercentage}% - {previewResult.maxPercentage}%</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center gap-3">
                      {previewResult.isPass ?
                  <Badge variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" /> Pass
                        </Badge> :

                  <Badge variant="error">
                          <X className="w-3 h-3 mr-1" /> Fail
                        </Badge>
                  }
                      {previewResult.isDistinction &&
                  <Badge variant="info">
                          <Star className="w-3 h-3 mr-1" /> Distinction
                        </Badge>
                  }
                    </div>
                    {previewResult.remarks &&
                <p className="mt-4 text-sm opacity-75 italic">"{previewResult.remarks}"</p>
                }
                  </div>
              }

                {testPercentage && !previewResult &&
              <div className="p-6 bg-gray-100 rounded-xl text-center text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No grade found for this percentage</p>
                    <p className="text-sm">Check your grade configuration</p>
                  </div>
              }
              </Card>

              {/* Grade Reference Card */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Grade Reference</h2>
                    <p className="text-sm text-gray-500">Complete grade scale for {config.boardType}</p>
                  </div>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {[...config.grades].
                sort((a, b) => b.maxPercentage - a.maxPercentage).
                map((grade) =>
                <div
                  key={grade.id}
                  className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:shadow-md"
                  style={{ backgroundColor: `${grade.color}10`, borderLeft: `4px solid ${grade.color}` }}>

                        <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm"
                    style={{ backgroundColor: grade.color }}>

                          {grade.gradeName}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{grade.description}</div>
                          <div className="text-sm text-gray-500">
                            {grade.minPercentage}% - {grade.maxPercentage}% • GP: {grade.gradePoint}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {grade.isPass ?
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Pass</span> :

                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Fail</span>
                    }
                          {grade.isDistinction &&
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Distinction</span>
                    }
                        </div>
                      </div>
                )}
                </div>
              </Card>
            </div>

            {/* Configuration Summary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Configuration Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Board Type</p>
                  <p className="text-lg font-bold text-gray-900">{config.boardType}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="text-lg font-bold text-gray-900">{config.academicYear}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Total Grades</p>
                  <p className="text-lg font-bold text-gray-900">{config.grades.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Passing %</p>
                  <p className="text-lg font-bold text-gray-900">{config.passingPercentage}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Max CGPA</p>
                  <p className="text-lg font-bold text-gray-900">{config.cgpaConfig.maxGradePoint}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={config.status === 'active' ? 'success' : 'warning'}>
                    {config.status}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        }
      </div>
    </div>);

}

export default GradeCalculationSetup;