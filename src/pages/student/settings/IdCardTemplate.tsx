import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Plus,
  Edit2,
  Copy,
  Trash2,
  Check,
  Eye,
  Settings,
  Image,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RefreshCw,
  MoreVertical } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
// --- Types ---
interface CustomField {
  id: string;
  label: string;
  source: 'Student Field' | 'Static Text';
  value?: string; // For static text or field name
  showOnBack: boolean;
  x?: number;
  y?: number;
  alignment?: 'left' | 'center' | 'right';
}
interface IDCardTemplate {
  id: string;
  name: string;
  layout: 'Portrait' | 'Landscape';
  fields: string[]; // Standard enabled fields
  customFields: CustomField[];
  backSideContent: string;
  isActive: boolean;
  // Layout & Sizing
  cardWidth: number; // mm
  cardHeight: number; // mm
  outerPadding: number; // mm
  lineSpacing: number; // px
  fieldSpacing: number; // px
  photoWidth: number; // mm
  photoHeight: number; // mm
  baseFontSize: number; // pt
  // Design
  useCustomDesign: boolean;
  frontDesignUrl?: string;
  backDesignUrl?: string;
  // Element Positions (simplified for mock drag-drop)
  elementPositions: Record<
    string,
    {
      x: number;
      y: number;
      alignment?: 'left' | 'center' | 'right';
    }>;

}
const MOCK_TEMPLATES: IDCardTemplate[] = [
{
  id: 'TMP001',
  name: 'Standard Student ID',
  layout: 'Portrait',
  fields: [
  'Photo',
  'Name',
  'GR No',
  'Class',
  'DOB',
  'Blood Group',
  'Emergency Contact'],

  customFields: [],
  backSideContent: 'If found, please return to School Office.',
  isActive: true,
  cardWidth: 54,
  cardHeight: 85.6,
  outerPadding: 5,
  lineSpacing: 1.2,
  fieldSpacing: 8,
  photoWidth: 25,
  photoHeight: 30,
  baseFontSize: 10,
  useCustomDesign: false,
  elementPositions: {
    Photo: {
      x: 14.5,
      y: 10
    },
    Name: {
      x: 5,
      y: 45,
      alignment: 'center'
    },
    'GR No': {
      x: 5,
      y: 55
    },
    Class: {
      x: 5,
      y: 60
    },
    DOB: {
      x: 5,
      y: 65
    },
    'Blood Group': {
      x: 5,
      y: 70
    },
    'Emergency Contact': {
      x: 5,
      y: 75
    }
  }
}];

const STANDARD_FIELDS = [
'Photo',
'Name',
'GR No',
'Class',
'Roll No',
'DOB',
'Blood Group',
'Address',
'Parent Names',
'Emergency Contact',
'Route No',
'Stop Name',
'Validity'];

// Default position helper
const getDefaultPosition = (
field: string,
index: number,
layout: 'Portrait' | 'Landscape') =>
{
  // Simple stacking logic for demo
  const startY = field === 'Photo' ? 10 : 45 + index * 5;
  return {
    x: 5,
    y: startY,
    alignment: 'left' as const
  };
};
export function IdCardTemplate() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<IDCardTemplate[]>(MOCK_TEMPLATES);
  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<IDCardTemplate | null>(
    null
  );
  // Form Data
  const [formData, setFormData] = useState<Partial<IDCardTemplate>>({});
  // UI State for Editor
  const [activeTab, setActiveTab] = useState<'Front' | 'Back'>('Front');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  // Custom Field Input State
  const [newCustomFieldLabel, setNewCustomFieldLabel] = useState('');
  const [newCustomFieldSource, setNewCustomFieldSource] = useState<
    'Student Field' | 'Static Text'>(
    'Student Field');
  const [newCustomFieldValue, setNewCustomFieldValue] = useState('');
  const [newCustomFieldShowOnBack, setNewCustomFieldShowOnBack] =
  useState(false);
  const [isAddingCustomField, setIsAddingCustomField] = useState(false);
  const handleOpenEditor = (template?: IDCardTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData(JSON.parse(JSON.stringify(template))); // Deep copy
    } else {
      setEditingTemplate(null);
      // Default new template state
      setFormData({
        layout: 'Portrait',
        fields: ['Photo', 'Name', 'GR No'],
        customFields: [],
        isActive: true,
        cardWidth: 54,
        cardHeight: 85.6,
        outerPadding: 5,
        lineSpacing: 1.2,
        fieldSpacing: 5,
        photoWidth: 25,
        photoHeight: 30,
        baseFontSize: 10,
        useCustomDesign: false,
        elementPositions: {
          Photo: {
            x: 14.5,
            y: 10
          },
          Name: {
            x: 5,
            y: 45,
            alignment: 'center'
          },
          'GR No': {
            x: 5,
            y: 55
          }
        },
        backSideContent: ''
      });
    }
    setActiveTab('Front');
    setIsEditorOpen(true);
  };
  const toggleStandardField = (field: string) => {
    const currentFields = formData.fields || [];
    let newFields = [];
    let newPositions = {
      ...formData.elementPositions
    };
    if (currentFields.includes(field)) {
      newFields = currentFields.filter((f) => f !== field);
      delete newPositions[field];
    } else {
      newFields = [...currentFields, field];
      // Assign default position if adding
      if (!newPositions[field]) {
        newPositions[field] = getDefaultPosition(
          field,
          newFields.length,
          formData.layout || 'Portrait'
        );
      }
    }
    setFormData({
      ...formData,
      fields: newFields,
      elementPositions: newPositions
    });
  };
  const addCustomField = () => {
    if (!newCustomFieldLabel) return;
    const newField: CustomField = {
      id: `CF-${Date.now()}`,
      label: newCustomFieldLabel,
      source: newCustomFieldSource,
      value: newCustomFieldValue,
      showOnBack: newCustomFieldShowOnBack,
      x: 5,
      y: 50,
      alignment: 'left'
    };
    setFormData({
      ...formData,
      customFields: [...(formData.customFields || []), newField]
    });
    // Reset input
    setNewCustomFieldLabel('');
    setNewCustomFieldValue('');
    setIsAddingCustomField(false);
  };
  const removeCustomField = (id: string) => {
    setFormData({
      ...formData,
      customFields: formData.customFields?.filter((cf) => cf.id !== id)
    });
  };
  const updateElementPosition = (id: string, x: number, y: number) => {
    // Mock update for standard fields
    if (formData.fields?.includes(id)) {
      setFormData({
        ...formData,
        elementPositions: {
          ...formData.elementPositions,
          [id]: {
            ...(formData.elementPositions?.[id] || {
              alignment: 'left'
            }),
            x,
            y
          }
        }
      });
    } else {
      // Mock update for custom fields
      setFormData({
        ...formData,
        customFields: formData.customFields?.map((cf) =>
        cf.id === id ?
        {
          ...cf,
          x,
          y
        } :
        cf
        )
      });
    }
  };
  const handleSave = () => {
    // Validation
    if (!formData.name) {
      alert('Template Name is required.');
      return;
    }
    if (editingTemplate) {
      setTemplates((prev) =>
      prev.map((t) =>
      t.id === editingTemplate.id ?
      {
        ...t,
        ...formData
      } as IDCardTemplate :
      t
      )
      );
    } else {
      const newTemplate = {
        ...formData,
        id: `TMP${String(templates.length + 1).padStart(3, '0')}`
      } as IDCardTemplate;
      setTemplates((prev) => [...prev, newTemplate]);
    }
    setIsEditorOpen(false);
  };
  // --- Mock Canvas Preview ---
  const CanvasPreview = () => {
    const isPortrait = formData.layout === 'Portrait';
    // Scale for display: 1mm = 3.78px roughly, usually scaled down.
    // Let's use a scale factor to fit in UI
    const scale = 3;
    const widthPx = (formData.cardWidth || 54) * scale;
    const heightPx = (formData.cardHeight || 85.6) * scale;
    // Background Image
    const bgUrl =
    activeTab === 'Front' ? formData.frontDesignUrl : formData.backDesignUrl;
    const renderElement = (
    id: string,
    label: string,
    x: number,
    y: number,
    align: string = 'left',
    isPhoto = false) =>
    {
      const isSelected = selectedElementId === id;
      return (
        <div
          key={id}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedElementId(id);
          }}
          style={{
            position: 'absolute',
            left: `${x * scale}px`,
            top: `${y * scale}px`,
            width: isPhoto ?
            `${(formData.photoWidth || 25) * scale}px` :
            'auto',
            height: isPhoto ?
            `${(formData.photoHeight || 30) * scale}px` :
            'auto',
            textAlign: align as any,
            fontSize: `${formData.baseFontSize}px`,
            cursor: 'move',
            border: isSelected ? '1px dashed blue' : '1px dashed transparent',
            backgroundColor: isPhoto ? '#e5e7eb' : 'transparent',
            padding: '2px',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}
          className={`hover:border-blue-300 transition-colors select-none ${isPhoto ? 'flex items-center justify-center text-xs text-gray-400' : ''}`}>

          {isPhoto ? 'PHOTO' : label}
          {isSelected &&
          <div className="absolute -top-6 left-0 bg-blue-600 text-white text-[10px] px-1 rounded flex gap-1">
              <AlignLeft className="w-3 h-3 cursor-pointer" />
              <AlignCenter className="w-3 h-3 cursor-pointer" />
              <AlignRight className="w-3 h-3 cursor-pointer" />
            </div>
          }
        </div>);

    };
    return (
      <div className="flex flex-col items-center">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('Front')}
            className={`px-4 py-1 text-sm rounded-full ${activeTab === 'Front' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>

            Front
          </button>
          <button
            onClick={() => setActiveTab('Back')}
            className={`px-4 py-1 text-sm rounded-full ${activeTab === 'Back' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>

            Back
          </button>
        </div>

        <div
          className="relative bg-white shadow-lg overflow-hidden border border-gray-300"
          style={{
            width: widthPx,
            height: heightPx
          }}
          onClick={() => setSelectedElementId(null)}>

          {/* Background Layer */}
          {formData.useCustomDesign && bgUrl ?
          <img
            src={bgUrl}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" /> :


          // Default generic background
          <div className="absolute inset-0 z-0">
              <div className="h-[15%] bg-blue-600 w-full"></div>
              <div className="absolute bottom-0 h-[5%] bg-gray-200 w-full"></div>
            </div>
          }

          {/* Content Layer */}
          {activeTab === 'Front' &&
          <>
              {formData.fields?.map((field) => {
              const pos = formData.elementPositions?.[field] || {
                x: 5,
                y: 5
              };
              return renderElement(
                field,
                field === 'Name' ? 'STUDENT NAME' : `${field}: Sample`,
                pos.x,
                pos.y,
                pos.alignment,
                field === 'Photo'
              );
            })}
              {formData.customFields?.
            filter((cf) => !cf.showOnBack).
            map((cf) =>
            renderElement(
              cf.id,
              `${cf.label}: ${cf.value || 'Value'}`,
              cf.x || 5,
              cf.y || 5,
              cf.alignment
            )
            )}
            </>
          }

          {activeTab === 'Back' &&
          <div className="p-4 pt-8 text-xs text-gray-600 text-center w-full">
              <p>{formData.backSideContent}</p>
              {formData.customFields?.
            filter((cf) => cf.showOnBack).
            map((cf) =>
            <div
              key={cf.id}
              style={{
                position: 'absolute',
                left: `${(cf.x || 5) * scale}px`,
                top: `${(cf.y || 5) * scale}px`
              }}>

                    {cf.label}: {cf.value || 'Value'}
                  </div>
            )}
            </div>
          }
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}}
            leftIcon={<RefreshCw className="w-3 h-3" />}>

            Reset Layout
          </Button>
        </div>
      </div>);

  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header (Fixed) */}
      <div className="flex items-center justify-between p-6 bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ID Card Templates
            </h1>
            <p className="text-sm text-gray-500">
              Design and configure student ID card layouts.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-xs text-gray-500 mr-2 bg-blue-50 px-2 py-1 rounded border border-blue-100 hidden md:block">
            Tip: Use custom fields for house, bus route, etc.
          </div>
          <Button
            onClick={() => handleOpenEditor()}
            leftIcon={<Plus className="w-4 h-4" />}>

            Create Template
          </Button>
        </div>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) =>
          <Card
            key={template.id}
            className="group hover:shadow-lg transition-shadow border-gray-200">

              <div className="p-4 border-b bg-gray-50 flex justify-between items-center rounded-t-lg">
                <div>
                  <h3
                  className="font-bold text-gray-900 truncate max-w-[150px]"
                  title={template.name}>

                    {template.name}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {template.layout}
                    </Badge>
                    {template.useCustomDesign &&
                  <Badge variant="outline" className="text-[10px]">
                        Custom Design
                      </Badge>
                  }
                  </div>
                </div>
                <Badge variant={template.isActive ? 'success' : 'secondary'}>
                  {template.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="p-6 bg-gray-100 flex justify-center items-center h-48 border-b">
                {/* Mini Preview */}
                <div
                className={`bg-white shadow-sm border border-gray-300 ${template.layout === 'Portrait' ? 'w-16 h-24' : 'w-24 h-16'} flex flex-col items-center justify-center gap-1 relative overflow-hidden`}>

                  <div className="w-full h-1/4 bg-blue-600 absolute top-0"></div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full z-10 mt-2"></div>
                  <div className="w-10 h-1 bg-gray-200 z-10"></div>
                  <div className="w-8 h-0.5 bg-gray-200 z-10"></div>
                </div>
              </div>

              <div className="p-3 flex gap-2 bg-white rounded-b-lg">
                <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-gray-50"
                onClick={() => handleOpenEditor(template)}>

                  <Edit2 className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button
                variant="ghost"
                size="sm"
                className="flex-1 hover:bg-gray-50">

                  <Copy className="w-3 h-3 mr-1" /> Clone
                </Button>
                <div className="w-px bg-gray-200 my-1"></div>
                <Button
                variant="ghost"
                size="sm"
                className="w-8 px-0 text-red-500 hover:text-red-700 hover:bg-red-50">

                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          )}

          {/* Add New Placeholder */}
          <div
            onClick={() => handleOpenEditor()}
            className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer h-full min-h-[300px]">

            <Plus className="w-12 h-12 mb-2 stroke-1" />
            <span className="font-medium text-lg">Create New Template</span>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      <Modal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        title={
        editingTemplate ? 'Edit ID Card Template' : 'Create ID Card Template'
        }
        size="full" // Full screen modal
      >
        <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] overflow-hidden gap-0 lg:gap-6 -mx-6 -my-4 p-6 bg-gray-50">
          {/* Left: Configuration Panel */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2 pb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4" /> Template Basics
              </h4>
              <div className="space-y-3">
                <Input
                  label="Template Name *"
                  value={formData.name || ''}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                  } />

                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Orientation"
                    options={[
                    {
                      value: 'Portrait',
                      label: 'Portrait'
                    },
                    {
                      value: 'Landscape',
                      label: 'Landscape'
                    }]
                    }
                    value={formData.layout}
                    onChange={(val) =>
                    setFormData({
                      ...formData,
                      layout: val as any
                    })
                    } />

                  <div className="pt-7">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.checked
                        })
                        }
                        className="rounded text-blue-600" />

                      Active
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Check className="w-4 h-4" /> Standard Fields
              </h4>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {STANDARD_FIELDS.map((field) =>
                <label
                  key={field}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer text-xs">

                    <input
                    type="checkbox"
                    checked={formData.fields?.includes(field)}
                    onChange={() => toggleStandardField(field)}
                    className="rounded text-blue-600" />

                    {field}
                  </label>
                )}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Custom Fields
                </h4>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setIsAddingCustomField(!isAddingCustomField)}>

                  {isAddingCustomField ? 'Cancel' : 'Add Field'}
                </Button>
              </div>

              {isAddingCustomField &&
              <div className="p-3 bg-blue-50 rounded mb-3 border border-blue-100 text-sm space-y-2">
                  <Input
                  label="Label"
                  value={newCustomFieldLabel}
                  onChange={(e) => setNewCustomFieldLabel(e.target.value)}
                  placeholder="e.g. House" />

                  <Select
                  label="Source"
                  options={[
                  {
                    value: 'Student Field',
                    label: 'Student Field'
                  },
                  {
                    value: 'Static Text',
                    label: 'Static Text'
                  }]
                  }
                  value={newCustomFieldSource}
                  onChange={(val) => setNewCustomFieldSource(val as any)} />

                  <Input
                  label={
                  newCustomFieldSource === 'Static Text' ?
                  'Text Value' :
                  'Field Name'
                  }
                  value={newCustomFieldValue}
                  onChange={(e) => setNewCustomFieldValue(e.target.value)}
                  placeholder={
                  newCustomFieldSource === 'Static Text' ?
                  'e.g. 2024-2025' :
                  'Select field...'
                  } />

                  <label className="flex items-center gap-2 text-xs">
                    <input
                    type="checkbox"
                    checked={newCustomFieldShowOnBack}
                    onChange={(e) =>
                    setNewCustomFieldShowOnBack(e.target.checked)
                    }
                    className="rounded" />

                    Show on Back Side
                  </label>
                  <Button size="xs" className="w-full" onClick={addCustomField}>
                    Add to Template
                  </Button>
                </div>
              }

              <div className="space-y-1">
                {formData.customFields?.map((cf) =>
                <div
                  key={cf.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border text-xs">

                    <span>
                      {cf.label}{' '}
                      <span className="text-gray-400">
                        ({cf.source === 'Static Text' ? 'Static' : 'Dynamic'})
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-gray-200 px-1 rounded">
                        {cf.showOnBack ? 'Back' : 'Front'}
                      </span>
                      <button
                      onClick={() => removeCustomField(cf.id)}
                      className="text-red-500 hover:text-red-700">

                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                {!formData.customFields?.length && !isAddingCustomField &&
                <p className="text-xs text-gray-400 italic text-center">
                    No custom fields added.
                  </p>
                }
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <AlignLeft className="w-4 h-4" /> Layout & Sizing
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <Input
                  label="Width (mm)"
                  type="number"
                  value={formData.cardWidth}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    cardWidth: Number(e.target.value)
                  })
                  } />

                <Input
                  label="Height (mm)"
                  type="number"
                  value={formData.cardHeight}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    cardHeight: Number(e.target.value)
                  })
                  } />

                <Input
                  label="Photo W (mm)"
                  type="number"
                  value={formData.photoWidth}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    photoWidth: Number(e.target.value)
                  })
                  } />

                <Input
                  label="Photo H (mm)"
                  type="number"
                  value={formData.photoHeight}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    photoHeight: Number(e.target.value)
                  })
                  } />

                <Input
                  label="Font Size (pt)"
                  type="number"
                  value={formData.baseFontSize}
                  onChange={(e) =>
                  setFormData({
                    ...formData,
                    baseFontSize: Number(e.target.value)
                  })
                  } />

              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Image className="w-4 h-4" /> Background / Design
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.useCustomDesign}
                    onChange={(e) =>
                    setFormData({
                      ...formData,
                      useCustomDesign: e.target.checked
                    })
                    }
                    className="rounded text-blue-600" />

                  Use Custom Design
                </label>

                {formData.useCustomDesign &&
                <div className="space-y-3 pl-6 border-l-2 border-gray-100">
                    <div>
                      <span className="text-xs font-medium block mb-1">
                        Front Design
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          Choose File
                          <input
                          type="file"
                          className="hidden"
                          accept="image/*" />

                        </label>
                        <span className="text-sm text-gray-500">
                          No file chosen
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium block mb-1">
                        Back Design (Optional)
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          Choose File
                          <input
                          type="file"
                          className="hidden"
                          accept="image/*" />

                        </label>
                        <span className="text-sm text-gray-500">
                          No file chosen
                        </span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-2">
                Back Side Content
              </h4>
              <textarea
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={formData.backSideContent}
                onChange={(e) =>
                setFormData({
                  ...formData,
                  backSideContent: e.target.value
                })
                }
                placeholder="e.g. If found, please return to..." />

            </div>
          </div>

          {/* Right: Live Preview Canvas */}
          <div className="w-full lg:w-2/3 bg-gray-200 rounded-lg flex items-center justify-center p-8 relative overflow-hidden border border-gray-300">
            <div className="absolute top-4 right-4 bg-white/80 p-2 rounded text-xs text-gray-500 pointer-events-none z-0">
              Canvas Preview
            </div>
            <CanvasPreview />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t bg-white -mx-6 -mb-6 p-6 sticky bottom-0 z-30">
          <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Template
          </Button>
        </div>
      </Modal>
    </div>);

}