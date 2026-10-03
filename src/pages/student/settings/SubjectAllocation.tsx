import React, { useEffect, useState, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  AlertTriangle,
  Info,
  RefreshCw,
  Hash } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
// --- Types ---
type PatternComponentType = 'year' | 'branch' | 'class' | 'separator' | 'text';
interface PatternToken {
  id: string;
  type: PatternComponentType;
  value: string;
  label: string;
}
interface SuIdConfig {
  ruleName: string;
  resetFrequency: string;
  pattern: PatternToken[];
  startNumber: number;
  numberWidth: number;
  incrementStep: number;
  ensureGlobalUniqueness: boolean;
  allowManualOverride: boolean;
  reuseCancelledNumbers: boolean;
}
// --- Mock Context for Preview ---
const PREVIEW_CONTEXT = {
  year: '24-25',
  branch: 'MAIN',
  class: '10A'
};
export function SubjectAllocation() {
  const navigate = useNavigate();
  // --- State ---
  const [config, setConfig] = useState<SuIdConfig>({
    ruleName: 'Standard SU ID Series',
    resetFrequency: 'academic_year',
    pattern: [
    {
      id: '1',
      type: 'year',
      value: 'year',
      label: 'Year'
    },
    {
      id: '2',
      type: 'separator',
      value: '/',
      label: '/'
    },
    {
      id: '3',
      type: 'branch',
      value: 'branch',
      label: 'Branch'
    },
    {
      id: '4',
      type: 'separator',
      value: '-',
      label: '-'
    },
    {
      id: '5',
      type: 'text',
      value: 'STU',
      label: 'STU'
    }],

    startNumber: 1,
    numberWidth: 4,
    incrementStep: 1,
    ensureGlobalUniqueness: true,
    allowManualOverride: false,
    reuseCancelledNumbers: false
  });
  const [customText, setCustomText] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  // --- Handlers ---
  const handleInputChange = (field: keyof SuIdConfig, value: any) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };
  const addToken = (
  type: PatternComponentType,
  value: string,
  label: string) =>
  {
    const newToken: PatternToken = {
      id: `tok_${Date.now()}_${Math.random()}`,
      type,
      value,
      label
    };
    setConfig((prev) => ({
      ...prev,
      pattern: [...prev.pattern, newToken]
    }));
    setIsDirty(true);
  };
  const removeToken = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      pattern: prev.pattern.filter((t) => t.id !== id)
    }));
    setIsDirty(true);
  };
  const handleAddCustomText = () => {
    if (!customText.trim()) return;
    addToken('text', customText, customText);
    setCustomText('');
  };
  const handleSave = () => {
    // Validation
    if (!config.ruleName.trim()) {
      alert('Rule Name is required.');
      return;
    }
    if (config.pattern.length === 0) {
      alert('Add at least one component before the serial number.');
      return;
    }
    if (config.startNumber < 1 || config.incrementStep < 1) {
      alert('Start Number and Increment Step must be greater than 0.');
      return;
    }
    // Success Logic
    console.log('Saving Configuration:', config);
    alert('SU ID configuration saved successfully.');
    setIsDirty(false);
  };
  const handleBack = () => {
    if (isDirty) {
      if (
      confirm('You have unsaved changes to SU ID rules. Discard changes?'))
      {
        navigate('/student-settings');
      }
    } else {
      navigate('/student-settings');
    }
  };
  // --- Logic: Generate Preview String ---
  const generatePreviewString = (seqIndex: number = 0) => {
    let prefix = '';
    config.pattern.forEach((token) => {
      switch (token.type) {
        case 'year':
          prefix += PREVIEW_CONTEXT.year;
          break;
        case 'branch':
          prefix += PREVIEW_CONTEXT.branch;
          break;
        case 'class':
          prefix += PREVIEW_CONTEXT.class;
          break;
        case 'separator':
        case 'text':
          prefix += token.value;
          break;
      }
    });
    const currentNumber = config.startNumber + seqIndex * config.incrementStep;
    const serialPart = String(currentNumber).padStart(config.numberWidth, '0');
    return `${prefix}${serialPart}`;
  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* --- Page Header --- */}
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
       
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              SU ID Generation Rules
            </h1>
            <p className="text-sm text-gray-500">
              Configure logic for automatic SU ID generation
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!isDirty || config.pattern.length === 0}
          leftIcon={<Save className="w-4 h-4" />}>

          Save Configuration
        </Button>
      </div>

      {/* --- Main Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* --- Left Column: Configuration --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rule Definition Card */}
            <Card title="Rule Definition">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Rule Name *"
                    value={config.ruleName}
                    onChange={(e) =>
                    handleInputChange('ruleName', e.target.value)
                    }
                    placeholder="e.g. Standard SU ID Series" />

                  <div>
                    <Select
                      label="Reset Frequency *"
                      options={[
                      {
                        value: 'never',
                        label: 'Never'
                      },
                      {
                        value: 'academic_year',
                        label: 'Every Academic Year'
                      },
                      {
                        value: 'calendar_year',
                        label: 'Every Calendar Year'
                      },
                      {
                        value: 'branch_ay',
                        label: 'Per Branch & Academic Year'
                      }]
                      }
                      value={config.resetFrequency}
                      onChange={(val) =>
                      handleInputChange('resetFrequency', val)
                      } />

                    <p className="text-xs text-gray-500 mt-1">
                      Controls when the running number resets.
                    </p>
                  </div>
                </div>

                {/* Pattern Construction */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Number Pattern Construction
                  </label>

                  {/* Pattern Visualizer */}
                  <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[60px] mb-4">
                    {config.pattern.length === 0 &&
                    <span className="text-sm text-gray-400 italic">
                        Add components below...
                      </span>
                    }

                    {config.pattern.map((token, index) =>
                    <div
                      key={token.id}
                      className="flex items-center bg-white border border-gray-300 text-gray-800 rounded-full px-3 py-1 text-sm shadow-sm animate-in fade-in zoom-in duration-200">

                        <span className="font-medium mr-2">{token.label}</span>
                        <button
                        onClick={() => removeToken(token.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors">

                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Implicit Serial Token */}
                    <div className="flex items-center bg-blue-100 border border-blue-200 text-blue-800 rounded-full px-3 py-1 text-sm font-bold shadow-sm">
                      <Hash className="w-3 h-3 mr-1" />
                      Serial No
                    </div>
                  </div>

                  {/* Token Controls */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addToken('year', 'year', 'Year')}>

                        + Year
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addToken('branch', 'branch', 'Branch')}>

                        + Branch
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addToken('class', 'class', 'Class')}>

                        + Class
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-1"></div>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addToken('separator', '/', '/')}>

                        + /
                      </Button>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => addToken('separator', '-', '-')}>

                        + -
                      </Button>
                    </div>

                    <div className="flex gap-2 items-center max-w-sm">
                      <Input
                        placeholder="Custom Text (e.g. STU)"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="h-8 text-sm" />

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleAddCustomText}
                        disabled={!customText}>

                        Add Text
                      </Button>
                    </div>
                    {config.pattern.length === 0 &&
                    <p className="text-xs text-red-500 mt-1">
                        Add at least one component (Year, Branch, Class, or
                        Text) before the serial number.
                      </p>
                    }
                  </div>
                </div>

                {/* Serial Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                  <Input
                    label="Start Number *"
                    type="number"
                    min="1"
                    value={config.startNumber}
                    onChange={(e) =>
                    handleInputChange('startNumber', parseInt(e.target.value))
                    } />

                  <Input
                    label="Number Width (Digits) *"
                    type="number"
                    min="1"
                    max="10"
                    value={config.numberWidth}
                    onChange={(e) =>
                    handleInputChange('numberWidth', parseInt(e.target.value))
                    } />

                  <Input
                    label="Increment Step *"
                    type="number"
                    min="1"
                    value={config.incrementStep}
                    onChange={(e) =>
                    handleInputChange(
                      'incrementStep',
                      parseInt(e.target.value)
                    )
                    } />

                </div>
              </div>
            </Card>

            {/* Validation & Scope Card */}
            <Card title="Validation & Scope">
              <div className="space-y-4">
                {/* Global Uniqueness */}
                <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id="globalUnique"
                    checked={config.ensureGlobalUniqueness}
                    onChange={(e) =>
                    handleInputChange(
                      'ensureGlobalUniqueness',
                      e.target.checked
                    )
                    }
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <div>
                    <label
                      htmlFor="globalUnique"
                      className="block text-sm font-medium text-gray-900">

                      Ensure Global Uniqueness
                    </label>
                    <p className="text-xs text-gray-500">
                      Prevent duplicate SU IDs across the entire school
                      database.
                    </p>
                    {!config.ensureGlobalUniqueness &&
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Turning off can
                        cause duplicate IDs. Use with caution.
                      </p>
                    }
                  </div>
                </div>

                {/* Manual Override */}
                <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id="manualOverride"
                    checked={config.allowManualOverride}
                    onChange={(e) =>
                    handleInputChange('allowManualOverride', e.target.checked)
                    }
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <div>
                    <label
                      htmlFor="manualOverride"
                      className="block text-sm font-medium text-gray-900">

                      Allow Manual Override
                    </label>
                    <p className="text-xs text-gray-500">
                      Allow admins to manually edit the generated SU ID during
                      admission.
                    </p>
                  </div>
                </div>

                {/* Reuse Cancelled */}
                <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    id="reuseCancelled"
                    checked={config.reuseCancelledNumbers}
                    onChange={(e) =>
                    handleInputChange(
                      'reuseCancelledNumbers',
                      e.target.checked
                    )
                    }
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                  <div>
                    <label
                      htmlFor="reuseCancelled"
                      className="block text-sm font-medium text-gray-900">

                      Reuse Cancelled Numbers
                    </label>
                    <p className="text-xs text-gray-500">
                      If an admission is cancelled, make the SU ID available
                      again.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* --- Right Column: Preview --- */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card title="Live Preview" className="bg-blue-50 border-blue-100">
              <div className="py-6 text-center">
                <div className="text-2xl font-mono font-bold text-blue-900 tracking-wide break-all">
                  {generatePreviewString(0)}
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  This is how the next SU ID will look.
                </p>
              </div>
              <div className="border-t border-blue-200 pt-3 mt-3 text-xs text-blue-800 space-y-1">
                <div className="flex justify-between">
                  <span>Year Context:</span>{' '}
                  <span className="font-medium">{PREVIEW_CONTEXT.year}</span>
                </div>
                <div className="flex justify-between">
                  <span>Branch Context:</span>{' '}
                  <span className="font-medium">{PREVIEW_CONTEXT.branch}</span>
                </div>
                {config.pattern.some((t) => t.type === 'class') &&
                <div className="flex justify-between">
                    <span>Class Context:</span>{' '}
                    <span className="font-medium">{PREVIEW_CONTEXT.class}</span>
                  </div>
                }
              </div>
            </Card>

            {/* Example Sequence */}
            <Card title="Example Sequence">
              <div className="space-y-0 divide-y divide-gray-100">
                {[0, 1, 2].map((idx) =>
                <div
                  key={idx}
                  className="py-3 flex justify-between items-center text-sm">

                    <span className="text-gray-500">Student {idx + 1}</span>
                    <span className="font-mono font-medium text-gray-900 bg-gray-50 px-2 py-1 rounded">
                      {generatePreviewString(idx)}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 flex gap-2">
                <Info className="w-4 h-4 flex-shrink-0" />
                <p>
                  This sequence is illustrative only and does not represent
                  actual assigned IDs.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>);

}