import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle,
  Info,
  AlertTriangle,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Layers,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Copy,
  RotateCcw } from
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
      {helperText &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
    </div>);

}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

function Input({
  label,
  helperText,
  error,
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
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

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false
}: ToggleProps) {
  return (
    <label
      className={`flex items-start gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

      <div className="relative mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled} />

        <div
          className={`w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'}`
          }>

          <div
            className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'}`
            } />

        </div>
      </div>
      {(label || description) &&
      <div>
          {label &&
        <p className="text-sm font-medium text-gray-900">{label}</p>
        }
          {description &&
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        }
        </div>
      }
    </label>);

}

// ============ TYPES ============
type CceMode = 'complete' | 'supplementary';
type ResultIntegration = 'separate' | 'combined' | 'both';
type GradeScale = 'abc' | 'abcde' | 'points' | 'custom';

interface TermConfig {
  id: string;
  name: string;
  selected: boolean;
  weightage: number;
  startDate: string;
  endDate: string;
}

interface EvaluationArea {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  weightageInResult: number;
  gradeType: 'grade' | 'marks' | 'descriptive';
  maxMarks?: number;
  passMarks?: number;
}

interface StandardConfig {
  standard: string;
  cceMode: CceMode;
  terms: TermConfig[];
  resultIntegration: ResultIntegration;
  gradeScale: GradeScale;
  evaluationAreas: EvaluationArea[];
  maxIndicatorsPerSubject: number | null;
  lockAfterGeneration: boolean;
  allowReEvaluation: boolean;
  requireApproval: boolean;
  includeAttendance: boolean;
  includeRemarks: boolean;
}

interface GlobalSettings {
  academicYear: string;
  schoolName: string;
  defaultCceMode: CceMode;
  defaultResultIntegration: ResultIntegration;
  defaultGradeScale: GradeScale;
  enableAuditLog: boolean;
  requireDigitalSignature: boolean;
  allowBulkEntry: boolean;
  showGradePoints: boolean;
  printFormat: 'portrait' | 'landscape';
}

// ============ INITIAL DATA ============
const DEFAULT_TERMS: TermConfig[] = [
{
  id: 'term1',
  name: 'Term 1',
  selected: true,
  weightage: 25,
  startDate: '',
  endDate: ''
},
{
  id: 'term2',
  name: 'Term 2',
  selected: true,
  weightage: 25,
  startDate: '',
  endDate: ''
},
{
  id: 'half-yearly',
  name: 'Half Yearly',
  selected: false,
  weightage: 0,
  startDate: '',
  endDate: ''
},
{
  id: 'term3',
  name: 'Term 3',
  selected: false,
  weightage: 25,
  startDate: '',
  endDate: ''
},
{
  id: 'annual',
  name: 'Annual',
  selected: true,
  weightage: 50,
  startDate: '',
  endDate: ''
}];


const DEFAULT_EVALUATION_AREAS: EvaluationArea[] = [
{
  id: 'scholastic',
  name: 'Scholastic Areas',
  code: 'SCH',
  enabled: true,
  weightageInResult: 80,
  gradeType: 'marks',
  maxMarks: 100,
  passMarks: 33
},
{
  id: 'co-scholastic',
  name: 'Co-Scholastic Areas',
  code: 'COS',
  enabled: true,
  weightageInResult: 10,
  gradeType: 'grade'
},
{
  id: 'discipline',
  name: 'Discipline',
  code: 'DIS',
  enabled: true,
  weightageInResult: 5,
  gradeType: 'grade'
},
{
  id: 'work-education',
  name: 'Work Education',
  code: 'WRK',
  enabled: false,
  weightageInResult: 0,
  gradeType: 'grade'
},
{
  id: 'health-pe',
  name: 'Health & Physical Education',
  code: 'HPE',
  enabled: true,
  weightageInResult: 5,
  gradeType: 'grade'
},
{
  id: 'life-skills',
  name: 'Life Skills',
  code: 'LIF',
  enabled: false,
  weightageInResult: 0,
  gradeType: 'descriptive'
}];


const createDefaultStandardConfig = (
standard: string,
isLower: boolean)
: StandardConfig => ({
  standard,
  cceMode: isLower ? 'complete' : 'supplementary',
  terms: DEFAULT_TERMS.map((t) => ({ ...t })),
  resultIntegration: isLower ? 'separate' : 'combined',
  gradeScale: 'abc',
  evaluationAreas: DEFAULT_EVALUATION_AREAS.map((ea) => ({ ...ea })),
  maxIndicatorsPerSubject: isLower ? 20 : null,
  lockAfterGeneration: true,
  allowReEvaluation: true,
  requireApproval: false,
  includeAttendance: true,
  includeRemarks: true
});

const INITIAL_STANDARD_CONFIGS: StandardConfig[] = [
createDefaultStandardConfig('1', true),
createDefaultStandardConfig('2', true),
createDefaultStandardConfig('3', false),
createDefaultStandardConfig('4', false),
createDefaultStandardConfig('5', false),
createDefaultStandardConfig('6', false),
createDefaultStandardConfig('7', false),
createDefaultStandardConfig('8', false)];


const INITIAL_GLOBAL_SETTINGS: GlobalSettings = {
  academicYear: '2024-25',
  schoolName: '',
  defaultCceMode: 'supplementary',
  defaultResultIntegration: 'combined',
  defaultGradeScale: 'abc',
  enableAuditLog: true,
  requireDigitalSignature: false,
  allowBulkEntry: true,
  showGradePoints: true,
  printFormat: 'portrait'
};

// ============ MAIN COMPONENT ============
export function CceEvaluationSetup() {
  const [globalSettings, setGlobalSettings] =
  useState<GlobalSettings>(INITIAL_GLOBAL_SETTINGS);
  const [standardConfigs, setStandardConfigs] = useState<StandardConfig[]>(
    INITIAL_STANDARD_CONFIGS
  );
  const [expandedStandards, setExpandedStandards] = useState<string[]>(['1']);
  const [activeTab, setActiveTab] = useState<
    'global' | 'standards' | 'terms' | 'areas'>(
    'global');
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ============ HANDLERS ============
  const markChanged = () => {
    setHasChanges(true);
    setSaved(false);
  };

  const updateGlobalSetting = <K extends keyof GlobalSettings,>(
  key: K,
  value: GlobalSettings[K]) =>
  {
    setGlobalSettings((prev) => ({ ...prev, [key]: value }));
    markChanged();
  };

  const updateStandardConfig = (
  standard: string,
  updates: Partial<StandardConfig>) =>
  {
    setStandardConfigs((prev) =>
    prev.map((config) =>
    config.standard === standard ? { ...config, ...updates } : config
    )
    );
    markChanged();
  };

  const toggleTermForStandard = (standard: string, termId: string) => {
    setStandardConfigs((prev) =>
    prev.map((config) => {
      if (config.standard !== standard) return config;
      return {
        ...config,
        terms: config.terms.map((t) =>
        t.id === termId ? { ...t, selected: !t.selected } : t
        )
      };
    })
    );
    markChanged();
  };

  const updateTermWeightage = (
  standard: string,
  termId: string,
  weightage: number) =>
  {
    setStandardConfigs((prev) =>
    prev.map((config) => {
      if (config.standard !== standard) return config;
      return {
        ...config,
        terms: config.terms.map((t) =>
        t.id === termId ? { ...t, weightage } : t
        )
      };
    })
    );
    markChanged();
  };

  const toggleEvaluationArea = (standard: string, areaId: string) => {
    setStandardConfigs((prev) =>
    prev.map((config) => {
      if (config.standard !== standard) return config;
      return {
        ...config,
        evaluationAreas: config.evaluationAreas.map((ea) =>
        ea.id === areaId ? { ...ea, enabled: !ea.enabled } : ea
        )
      };
    })
    );
    markChanged();
  };

  const updateAreaWeightage = (
  standard: string,
  areaId: string,
  weightage: number) =>
  {
    setStandardConfigs((prev) =>
    prev.map((config) => {
      if (config.standard !== standard) return config;
      return {
        ...config,
        evaluationAreas: config.evaluationAreas.map((ea) =>
        ea.id === areaId ? { ...ea, weightageInResult: weightage } : ea
        )
      };
    })
    );
    markChanged();
  };

  const toggleStandardExpand = (standard: string) => {
    setExpandedStandards((prev) =>
    prev.includes(standard) ?
    prev.filter((s) => s !== standard) :
    [...prev, standard]
    );
  };

  const copyConfigToStandards = (fromStandard: string, toStandards: string[]) => {
    const sourceConfig = standardConfigs.find((c) => c.standard === fromStandard);
    if (!sourceConfig) return;

    setStandardConfigs((prev) =>
    prev.map((config) => {
      if (!toStandards.includes(config.standard)) return config;
      return {
        ...sourceConfig,
        standard: config.standard
      };
    })
    );
    markChanged();
  };

  const resetToDefaults = () => {
    if (
    window.confirm(
      'Are you sure you want to reset all configurations to defaults?'
    ))
    {
      setGlobalSettings(INITIAL_GLOBAL_SETTINGS);
      setStandardConfigs(INITIAL_STANDARD_CONFIGS);
      setHasChanges(false);
      setSaved(false);
    }
  };

  const handleSave = () => {
    // Validate configurations
    const totalWeightageValid = standardConfigs.every((config) => {
      const enabledAreas = config.evaluationAreas.filter((ea) => ea.enabled);
      const totalWeightage = enabledAreas.reduce(
        (sum, ea) => sum + ea.weightageInResult,
        0
      );
      return totalWeightage === 100 || config.cceMode === 'complete';
    });

    if (!totalWeightageValid) {
      alert(
        'Warning: Some standards have evaluation area weightages that do not sum to 100%'
      );
    }

    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // ============ RENDER TABS ============
  const renderGlobalSettings = () =>
  <div className="space-y-6">
      {/* Basic Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-500" />
          Basic Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
          label="Academic Year"
          value={globalSettings.academicYear}
          onChange={(e) => updateGlobalSetting('academicYear', e.target.value)}
          options={[
          { value: '2024-25', label: '2024-25' },
          { value: '2023-24', label: '2023-24' },
          { value: '2025-26', label: '2025-26' }]
          } />

          <Input
          label="School Name (for reports)"
          value={globalSettings.schoolName}
          onChange={(e) => updateGlobalSetting('schoolName', e.target.value)}
          placeholder="Enter school name" />

          <Select
          label="Default CCE Mode"
          value={globalSettings.defaultCceMode}
          onChange={(e) =>
          updateGlobalSetting('defaultCceMode', e.target.value as CceMode)
          }
          options={[
          { value: 'complete', label: 'Complete Evaluation (CCE Only)' },
          {
            value: 'supplementary',
            label: 'Supplementary (Part of Final Result)'
          }]
          }
          helperText="Applied to new standard configurations" />

        </div>
      </div>

      {/* Result Integration Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-gray-500" />
          Result Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
          label="Default Result Integration"
          value={globalSettings.defaultResultIntegration}
          onChange={(e) =>
          updateGlobalSetting(
            'defaultResultIntegration',
            e.target.value as ResultIntegration
          )
          }
          options={[
          { value: 'separate', label: 'Separate CCE Report Card' },
          { value: 'combined', label: 'Combined with Main Result' },
          { value: 'both', label: 'Both (Separate + Combined)' }]
          } />

          <Select
          label="Default Grade Scale"
          value={globalSettings.defaultGradeScale}
          onChange={(e) =>
          updateGlobalSetting(
            'defaultGradeScale',
            e.target.value as GradeScale
          )
          }
          options={[
          { value: 'abc', label: 'A / B / C' },
          { value: 'abcde', label: 'A / B / C / D / E' },
          { value: 'points', label: 'Grade Points (10-point)' },
          { value: 'custom', label: 'Custom Scale' }]
          } />

          <Select
          label="Print Format"
          value={globalSettings.printFormat}
          onChange={(e) =>
          updateGlobalSetting(
            'printFormat',
            e.target.value as 'portrait' | 'landscape'
          )
          }
          options={[
          { value: 'portrait', label: 'Portrait' },
          { value: 'landscape', label: 'Landscape' }]
          } />

        </div>
      </div>

      {/* System Options */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-gray-500" />
          System Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Toggle
          checked={globalSettings.enableAuditLog}
          onChange={(checked) => updateGlobalSetting('enableAuditLog', checked)}
          label="Enable Audit Log"
          description="Track all changes to CCE entries with user and timestamp" />

          <Toggle
          checked={globalSettings.requireDigitalSignature}
          onChange={(checked) =>
          updateGlobalSetting('requireDigitalSignature', checked)
          }
          label="Require Digital Signature"
          description="Teachers must digitally sign before final submission" />

          <Toggle
          checked={globalSettings.allowBulkEntry}
          onChange={(checked) =>
          updateGlobalSetting('allowBulkEntry', checked)
          }
          label="Allow Bulk Entry"
          description="Enable bulk grade entry via Excel import" />

          <Toggle
          checked={globalSettings.showGradePoints}
          onChange={(checked) =>
          updateGlobalSetting('showGradePoints', checked)
          }
          label="Show Grade Points"
          description="Display grade point equivalents on report cards" />

        </div>
      </div>
    </div>;


  const renderStandardConfigs = () => {
    const lowerClasses = standardConfigs.filter((c) =>
    ['1', '2'].includes(c.standard)
    );
    const upperClasses = standardConfigs.filter((c) =>
    ['3', '4', '5', '6', '7', '8'].includes(c.standard)
    );

    return (
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold mb-1">CCE Evaluation Modes</p>
            <p>
              <strong>Complete Evaluation:</strong> CCE is the primary/only
              assessment. Creates a standalone CCE report card without
              traditional exams.
            </p>
            <p className="mt-1">
              <strong>Supplementary Evaluation:</strong> CCE supplements
              traditional exams. CCE grades are included in the final result
              with configurable weightage.
            </p>
          </div>
        </div>

        {/* Lower Classes (1-2) */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <h3 className="font-semibold text-rose-800">
                Standards 1 & 2 — Primary Level
              </h3>
              <Badge variant="danger">Subject-Skill Based</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
              copyConfigToStandards('1', ['2'])
              }>

              <Copy className="w-4 h-4 mr-1" />
              Copy Std 1 → Std 2
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {lowerClasses.map((config) =>
            <StandardConfigRow
              key={config.standard}
              config={config}
              expanded={expandedStandards.includes(config.standard)}
              onToggleExpand={() => toggleStandardExpand(config.standard)}
              onUpdate={(updates) =>
              updateStandardConfig(config.standard, updates)
              }
              onToggleTerm={(termId) =>
              toggleTermForStandard(config.standard, termId)
              }
              onUpdateTermWeightage={(termId, weightage) =>
              updateTermWeightage(config.standard, termId, weightage)
              }
              onToggleArea={(areaId) =>
              toggleEvaluationArea(config.standard, areaId)
              }
              onUpdateAreaWeightage={(areaId, weightage) =>
              updateAreaWeightage(config.standard, areaId, weightage)
              } />

            )}
          </div>
        </div>

        {/* Upper Classes (3-8) */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-purple-50 border-b border-purple-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <h3 className="font-semibold text-purple-800">
                Standards 3–8 — Middle Level
              </h3>
              <Badge variant="purple">Personality & Life Skills</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
              copyConfigToStandards('3', ['4', '5', '6', '7', '8'])
              }>

              <Copy className="w-4 h-4 mr-1" />
              Copy Std 3 → All
            </Button>
          </div>
          <div className="divide-y divide-gray-100">
            {upperClasses.map((config) =>
            <StandardConfigRow
              key={config.standard}
              config={config}
              expanded={expandedStandards.includes(config.standard)}
              onToggleExpand={() => toggleStandardExpand(config.standard)}
              onUpdate={(updates) =>
              updateStandardConfig(config.standard, updates)
              }
              onToggleTerm={(termId) =>
              toggleTermForStandard(config.standard, termId)
              }
              onUpdateTermWeightage={(termId, weightage) =>
              updateTermWeightage(config.standard, termId, weightage)
              }
              onToggleArea={(areaId) =>
              toggleEvaluationArea(config.standard, areaId)
              }
              onUpdateAreaWeightage={(areaId, weightage) =>
              updateAreaWeightage(config.standard, areaId, weightage)
              } />

            )}
          </div>
        </div>
      </div>);

  };

  const renderTermsConfig = () =>
  <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-semibold mb-1">Term Configuration</p>
          <p>
            Configure which terms are active for CCE evaluation. For
            supplementary mode, ensure term weightages align with your result
            calculation formula.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            Term Weightage Distribution
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Standard
                </th>
                {DEFAULT_TERMS.map((term) =>
              <th
                key={term.id}
                className="text-center px-4 py-3 font-semibold text-gray-600">

                    {term.name}
                  </th>
              )}
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {standardConfigs.map((config) => {
              const totalWeightage = config.terms.
              filter((t) => t.selected).
              reduce((sum, t) => sum + t.weightage, 0);
              const isValid = totalWeightage === 100;

              return (
                <tr key={config.standard} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      Standard {config.standard}
                    </td>
                    {config.terms.map((term) =>
                  <td key={term.id} className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <input
                        type="checkbox"
                        checked={term.selected}
                        onChange={() =>
                        toggleTermForStandard(config.standard, term.id)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                          {term.selected &&
                      <input
                        type="number"
                        value={term.weightage}
                        onChange={(e) =>
                        updateTermWeightage(
                          config.standard,
                          term.id,
                          Number(e.target.value)
                        )
                        }
                        className="w-16 text-center text-xs border border-gray-300 rounded px-1 py-0.5"
                        min={0}
                        max={100} />

                      }
                        </div>
                      </td>
                  )}
                    <td className="px-4 py-3 text-center">
                      <Badge variant={isValid ? 'success' : 'danger'}>
                        {totalWeightage}%
                      </Badge>
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;


  const renderEvaluationAreas = () =>
  <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-700">
          <p className="font-semibold mb-1">Evaluation Areas</p>
          <p>
            Configure which evaluation areas are active for each standard. For
            combined results, weightages should total 100%.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-500" />
            Area-wise Weightage (for Combined Results)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Standard
                </th>
                {DEFAULT_EVALUATION_AREAS.map((area) =>
              <th
                key={area.id}
                className="text-center px-4 py-3 font-semibold text-gray-600">

                    <div className="flex flex-col items-center">
                      <span>{area.code}</span>
                      <span className="text-xs font-normal text-gray-400">
                        {area.name}
                      </span>
                    </div>
                  </th>
              )}
                <th className="text-center px-4 py-3 font-semibold text-gray-600">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {standardConfigs.map((config) => {
              const totalWeightage = config.evaluationAreas.
              filter((ea) => ea.enabled).
              reduce((sum, ea) => sum + ea.weightageInResult, 0);
              const isValid =
              totalWeightage === 100 || config.cceMode === 'complete';

              return (
                <tr key={config.standard} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      Standard {config.standard}
                    </td>
                    {config.evaluationAreas.map((area) =>
                  <td key={area.id} className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <input
                        type="checkbox"
                        checked={area.enabled}
                        onChange={() =>
                        toggleEvaluationArea(config.standard, area.id)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                          {area.enabled &&
                      config.resultIntegration !== 'separate' &&
                      <input
                        type="number"
                        value={area.weightageInResult}
                        onChange={(e) =>
                        updateAreaWeightage(
                          config.standard,
                          area.id,
                          Number(e.target.value)
                        )
                        }
                        className="w-14 text-center text-xs border border-gray-300 rounded px-1 py-0.5"
                        min={0}
                        max={100} />

                      }
                        </div>
                      </td>
                  )}
                    <td className="px-4 py-3 text-center">
                      {config.resultIntegration !== 'separate' ?
                    <Badge variant={isValid ? 'success' : 'danger'}>
                          {totalWeightage}%
                        </Badge> :

                    <Badge variant="secondary">N/A</Badge>
                    }
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CCE Evaluation Setup
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure evaluation parameters, terms, grading rules, and result
            integration settings
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges &&
          <Badge variant="warning" className="animate-pulse">
              Unsaved Changes
            </Badge>
          }
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saved &&
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          Evaluation setup saved successfully!
        </div>
      }

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6">
          {[
          { id: 'global', label: 'Global Settings', icon: Settings },
          { id: 'standards', label: 'Standard Configuration', icon: Users },
          { id: 'terms', label: 'Term Setup', icon: Calendar },
          { id: 'areas', label: 'Evaluation Areas', icon: Layers }].
          map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() =>
                setActiveTab(
                  tab.id as 'global' | 'standards' | 'terms' | 'areas'
                )
                }
                className={`flex items-center gap-2 px-1 py-3 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id ?
                'border-blue-600 text-blue-600' :
                'border-transparent text-gray-500 hover:text-gray-700'}`
                }>

                <Icon className="w-4 h-4" />
                {tab.label}
              </button>);

          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'global' && renderGlobalSettings()}
      {activeTab === 'standards' && renderStandardConfigs()}
      {activeTab === 'terms' && renderTermsConfig()}
      {activeTab === 'areas' && renderEvaluationAreas()}

      {/* Validation Rules */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-gray-500" />
          Validation & Business Rules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-700 mb-2">
              Complete Evaluation Mode
            </h4>
            <ul className="space-y-1 text-xs text-blue-600">
              <li>• Creates standalone CCE report card</li>
              <li>• No integration with exam results</li>
              <li>• Ideal for Std 1-2 with skill indicators</li>
              <li>• Fixed 20 indicators per subject</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-700 mb-2">
              Supplementary Mode
            </h4>
            <ul className="space-y-1 text-xs text-purple-600">
              <li>• CCE grades added to final result</li>
              <li>• Weightage configurable per area</li>
              <li>• Personality/Life skills assessment</li>
              <li>• Flexible indicator count</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-700 mb-2">
              Result Integration
            </h4>
            <ul className="space-y-1 text-xs text-green-600">
              <li>• Separate: Independent CCE report</li>
              <li>• Combined: Merged with exam results</li>
              <li>• Both: Generates both reports</li>
              <li>• Configurable per standard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>);

}

// ============ SUB COMPONENTS ============
interface StandardConfigRowProps {
  config: StandardConfig;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (updates: Partial<StandardConfig>) => void;
  onToggleTerm: (termId: string) => void;
  onUpdateTermWeightage: (termId: string, weightage: number) => void;
  onToggleArea: (areaId: string) => void;
  onUpdateAreaWeightage: (areaId: string, weightage: number) => void;
}

function StandardConfigRow({
  config,
  expanded,
  onToggleExpand,
  onUpdate,
  onToggleTerm,
  onUpdateTermWeightage,
  onToggleArea,
  onUpdateAreaWeightage
}: StandardConfigRowProps) {
  const selectedTerms = config.terms.filter((t) => t.selected);
  const enabledAreas = config.evaluationAreas.filter((ea) => ea.enabled);

  return (
    <div>
      {/* Summary Row */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
        onClick={onToggleExpand}>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {config.standard}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">
              Standard {config.standard}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                variant={config.cceMode === 'complete' ? 'info' : 'purple'}>

                {config.cceMode === 'complete' ?
                'Complete Evaluation' :
                'Supplementary'}
              </Badge>
              <Badge variant="secondary">
                {selectedTerms.length} terms
              </Badge>
              <Badge variant="secondary">
                {enabledAreas.length} areas
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500">Result Integration</p>
            <p className="text-sm font-medium text-gray-700">
              {config.resultIntegration === 'separate' ?
              'Separate Report' :
              config.resultIntegration === 'combined' ?
              'Combined' :
              'Both'}
            </p>
          </div>
          {expanded ?
          <ChevronUp className="w-5 h-5 text-gray-400" /> :

          <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </div>

      {/* Expanded Details */}
      {expanded &&
      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
            <Select
            label="CCE Mode"
            value={config.cceMode}
            onChange={(e) =>
            onUpdate({ cceMode: e.target.value as CceMode })
            }
            options={[
            { value: 'complete', label: 'Complete Evaluation (CCE Only)' },
            { value: 'supplementary', label: 'Supplementary (Part of Result)' }]
            } />

            <Select
            label="Result Integration"
            value={config.resultIntegration}
            onChange={(e) =>
            onUpdate({
              resultIntegration: e.target.value as ResultIntegration
            })
            }
            options={[
            { value: 'separate', label: 'Separate CCE Report' },
            { value: 'combined', label: 'Combined with Main Result' },
            { value: 'both', label: 'Both Reports' }]
            } />

            <Select
            label="Grade Scale"
            value={config.gradeScale}
            onChange={(e) =>
            onUpdate({ gradeScale: e.target.value as GradeScale })
            }
            options={[
            { value: 'abc', label: 'A / B / C' },
            { value: 'abcde', label: 'A / B / C / D / E' },
            { value: 'points', label: 'Grade Points' },
            { value: 'custom', label: 'Custom' }]
            } />

            <Input
            label="Max Indicators/Subject"
            type="number"
            value={
            config.maxIndicatorsPerSubject === null ?
            '' :
            String(config.maxIndicatorsPerSubject)
            }
            onChange={(e) =>
            onUpdate({
              maxIndicatorsPerSubject: e.target.value ?
              Number(e.target.value) :
              null
            })
            }
            placeholder="No limit" />

          </div>

          {/* Terms Selection */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">
              Active Terms
            </h5>
            <div className="flex flex-wrap gap-3">
              {config.terms.map((term) =>
            <label
              key={term.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
              term.selected ?
              'bg-blue-50 border-blue-300' :
              'bg-white border-gray-200 hover:border-gray-300'}`
              }>

                  <input
                type="checkbox"
                checked={term.selected}
                onChange={() => onToggleTerm(term.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                  <span className="text-sm font-medium text-gray-700">
                    {term.name}
                  </span>
                  {term.selected &&
              <input
                type="number"
                value={term.weightage}
                onChange={(e) =>
                onUpdateTermWeightage(term.id, Number(e.target.value))
                }
                onClick={(e) => e.stopPropagation()}
                className="w-14 text-center text-xs border border-gray-300 rounded px-1 py-0.5"
                min={0}
                max={100} />

              }
                </label>
            )}
            </div>
          </div>

          {/* Options */}
          <div className="border-t border-gray-200 pt-4">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">
              Options
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Toggle
              checked={config.lockAfterGeneration}
              onChange={(checked) =>
              onUpdate({ lockAfterGeneration: checked })
              }
              label="Lock After Generation" />

              <Toggle
              checked={config.allowReEvaluation}
              onChange={(checked) =>
              onUpdate({ allowReEvaluation: checked })
              }
              label="Allow Re-Evaluation" />

              <Toggle
              checked={config.requireApproval}
              onChange={(checked) => onUpdate({ requireApproval: checked })}
              label="Require Approval" />

              <Toggle
              checked={config.includeAttendance}
              onChange={(checked) =>
              onUpdate({ includeAttendance: checked })
              }
              label="Include Attendance" />

              <Toggle
              checked={config.includeRemarks}
              onChange={(checked) => onUpdate({ includeRemarks: checked })}
              label="Include Remarks" />

            </div>
          </div>
        </div>
      }
    </div>);

}

export default CceEvaluationSetup;