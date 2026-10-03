import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sliders,
  Save,
  RotateCcw,
  Eye,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Trash2,
  AlertCircle,
  AlertTriangle,
  X,
  CheckCircle
} from
  'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Table } from '../../../components/ui/Table';
// --- Types ---
interface FormField {
  id: string;
  label: string;
  type:
  'text' |
  'number' |
  'date' |
  'email' |
  'mobile' |
  'select' |
  'multiselect' |
  'checkbox' |
  'textarea' |
  'file';
  required: boolean;
  enabled: boolean;
  helpText?: string;
  options?: string[]; // for select/multiselect
  section: string;
}
interface FormSection {
  id: string;
  name: string;
  description?: string;
  order: number;
}
// --- Mock Data ---
const INITIAL_SECTIONS: FormSection[] = [
  {
    id: 'sec1',
    name: 'Student Personal Details',
    order: 1
  },
  {
    id: 'sec2',
    name: 'Contact & Address',
    order: 2
  },
  {
    id: 'sec3',
    name: 'Family / Guardian Details',
    order: 3
  },
  {
    id: 'sec4',
    name: 'Previous School Details',
    order: 4
  },
  {
    id: 'sec5',
    name: 'Category & Reservation',
    order: 5
  },
  {
    id: 'sec6',
    name: 'Transport & Hostel Preferences',
    order: 6
  },
  {
    id: 'sec7',
    name: 'Medical & Special Needs',
    order: 7
  },
  {
    id: 'sec8',
    name: 'Document Upload',
    order: 8
  },
  {
    id: 'sec9',
    name: 'Declarations',
    order: 9
  }];

const MOCK_FIELDS: FormField[] = [
  {
    id: 'f1',
    label: 'First Name',
    type: 'text',
    required: true,
    enabled: true,
    section: 'Student Personal Details'
  },
  {
    id: 'f2',
    label: 'Last Name',
    type: 'text',
    required: true,
    enabled: true,
    section: 'Student Personal Details'
  },
  {
    id: 'f3',
    label: 'Date of Birth',
    type: 'date',
    required: true,
    enabled: true,
    section: 'Student Personal Details'
  },
  {
    id: 'f4',
    label: 'Gender',
    type: 'select',
    required: true,
    enabled: true,
    options: ['Male', 'Female', 'Other'],
    section: 'Student Personal Details'
  },
  {
    id: 'f5',
    label: 'Blood Group',
    type: 'select',
    required: false,
    enabled: true,
    options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    section: 'Medical & Special Needs'
  },
  {
    id: 'f6',
    label: 'Father Name',
    type: 'text',
    required: true,
    enabled: true,
    section: 'Family / Guardian Details'
  },
  {
    id: 'f7',
    label: 'Father Mobile',
    type: 'mobile',
    required: true,
    enabled: true,
    section: 'Family / Guardian Details'
  },
  {
    id: 'f8',
    label: 'Previous School Name',
    type: 'text',
    required: false,
    enabled: true,
    section: 'Previous School Details'
  },
  {
    id: 'f9',
    label: 'Transport Required',
    type: 'checkbox',
    required: false,
    enabled: true,
    section: 'Transport & Hostel Preferences'
  },
  {
    id: 'f10',
    label: 'Pickup Point',
    type: 'select',
    required: false,
    enabled: true,
    options: ['Route 1', 'Route 2'],
    section: 'Transport & Hostel Preferences'
  },
  // Adding duplicate for demo
  {
    id: 'f11',
    label: 'Remarks',
    type: 'textarea',
    required: false,
    enabled: true,
    section: 'Student Personal Details'
  },
  {
    id: 'f12',
    label: 'Remarks',
    type: 'textarea',
    required: false,
    enabled: true,
    section: 'Medical & Special Needs'
  }];

  
export function AdmissionFormSettings() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<FormSection[]>(INITIAL_SECTIONS);
  const [fields, setFields] = useState<FormField[]>(MOCK_FIELDS);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    INITIAL_SECTIONS[0].name]
  );
  // console.log(sections, fields)
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  // Add Field Form State
  const [newFieldData, setNewFieldData] = useState<Partial<FormField>>({
    type: 'text',
    required: false,
    options: []
  });
  const [dropdownOptionCount, setDropdownOptionCount] = useState(2);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([
    'Option 1',
    'Option 2']
  );
  const [targetSectionForAdd, setTargetSectionForAdd] = useState('');
  // Add Section Form State
  const [newSectionData, setNewSectionData] = useState({
    name: '',
    description: '',
    position: 'end',
    relativeTo: ''
  });
  // --- Handlers ---
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName) ?
        prev.filter((s) => s !== sectionName) :
        [...prev, sectionName]
    );
  };
  const toggleFieldEnabled = (id: string) => {
    setFields(
      fields.map((f) =>
        f.id === id ?
          {
            ...f,
            enabled: !f.enabled
          } :
          f
      )
    );
  };
  const toggleFieldRequired = (id: string) => {
    setFields(
      fields.map((f) =>
        f.id === id ?
          {
            ...f,
            required: !f.required
          } :
          f
      )
    );
  };
  const updateFieldLabel = (id: string, newLabel: string) => {
    setFields(
      fields.map((f) =>
        f.id === id ?
          {
            ...f,
            label: newLabel
          } :
          f
      )
    );
  };
  const openAddFieldModal = (sectionName: string) => {
    setTargetSectionForAdd(sectionName);
    setNewFieldData({
      type: 'text',
      required: false,
      options: [],
      section: sectionName
    });
    setDropdownOptionCount(2);
    setDropdownOptions(['', '']);
    setIsAddModalOpen(true);
  };
  const handleDropdownCountChange = (count: number) => {
    const newCount = Math.max(1, Math.min(20, count));
    setDropdownOptionCount(newCount);
    const currentOptions = [...dropdownOptions];
    if (newCount > currentOptions.length) {
      // Add empty strings
      for (let i = currentOptions.length; i < newCount; i++)
        currentOptions.push('');
    } else {
      // Truncate
      currentOptions.length = newCount;
    }
    setDropdownOptions(currentOptions);
  };
  const handleDropdownOptionChange = (index: number, val: string) => {
    const newOpts = [...dropdownOptions];
    newOpts[index] = val;
    setDropdownOptions(newOpts);
  };
  const handleAddField = () => {
    if (!newFieldData.label) {
      alert('Field Label is required');
      return;
    }
    let options: string[] | undefined = undefined;
    if (newFieldData.type === 'select' || newFieldData.type === 'multiselect') {
      if (dropdownOptions.some((opt) => !opt.trim())) {
        alert('All dropdown options must have a label');
        return;
      }
      options = dropdownOptions;
    }
    const newField: FormField = {
      id: `custom_${Date.now()}`,
      label: newFieldData.label!,
      type: newFieldData.type as any,
      required: newFieldData.required || false,
      enabled: true,
      section: newFieldData.section || targetSectionForAdd,
      options: options
    };
    setFields([...fields, newField]);
    setIsAddModalOpen(false);
  };
  const handleAddSection = () => {
    if (!newSectionData.name) {
      alert('Section Name is required');
      return;
    }
    if (
      sections.some(
        (s) => s.name.toLowerCase() === newSectionData.name.toLowerCase()
      )) {
      alert('A section with this name already exists');
      return;
    }
    const newSection: FormSection = {
      id: `sec_${Date.now()}`,
      name: newSectionData.name,
      description: newSectionData.description,
      order: sections.length + 1 // Simplified ordering for demo
    };
    let updatedSections = [...sections];
    if (newSectionData.position === 'end') {
      updatedSections.push(newSection);
    } else if (
      newSectionData.position === 'above' &&
      newSectionData.relativeTo) {
      const index = updatedSections.findIndex(
        (s) => s.id === newSectionData.relativeTo
      );
      if (index !== -1) {
        updatedSections.splice(index, 0, newSection);
      } else {
        updatedSections.push(newSection);
      }
    }
    // Re-index order
    updatedSections = updatedSections.map((s, idx) => ({
      ...s,
      order: idx + 1
    }));
    setSections(updatedSections);
    setExpandedSections([...expandedSections, newSection.name]); // Auto expand
    setIsSectionModalOpen(false);
  };
  const handleReset = () => {
    if (
      confirm(
        'Reset admission form fields to system default? This will discard all unsaved changes and may remove custom fields.'
      )) {
      setFields(MOCK_FIELDS);
      setSections(INITIAL_SECTIONS);
    }
  };
  const handleSaveSettings = () => {
    // Basic validation
    const invalidFields = fields.filter((f) => !f.label);
    if (invalidFields.length > 0) {
      alert('Some fields have empty labels. Please fix them before saving.');
      return;
    }
    // In real app: save to backend
    alert('Admission form settings saved.');
  };
  // Duplicate Logic
  const getDuplicates = () => {
    const labelCounts: Record<string, number> = {};
    fields.forEach((f) => {
      const label = f.label.trim();
      labelCounts[label] = (labelCounts[label] || 0) + 1;
    });
    const duplicates: any[] = [];
    Object.entries(labelCounts).forEach(([label, count]) => {
      if (count > 1) {
        const occurrences = fields.filter((f) => f.label.trim() === label);
        const types = Array.from(new Set(occurrences.map((f) => f.type))).join(
          ', '
        );
        const sectionNames = Array.from(
          new Set(occurrences.map((f) => f.section))
        ).join(', ');
        duplicates.push({
          label,
          types,
          sections: sectionNames,
          count
        });
      }
    });
    return duplicates;
  };
  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* Header (Fixed) */}
      <div className="flex-shrink-0 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admission Form Field Settings
            </h1>
            <p className="text-sm text-gray-500">
              Configure mandatory and optional fields for admission forms
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsPreviewOpen(true)}>
            <Eye className="w-4 h-4 mr-2" /> Preview Form
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sections & Fields */}
          <div className="lg:col-span-2 space-y-4">
            {sections.
              sort((a, b) => a.order - b.order).
              map((section) =>
                <Card key={section.id} className="overflow-hidden" noPadding>
                  <div
                    className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection(section.name)}>

                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      {expandedSections.includes(section.name) ?
                        <ChevronDown className="w-4 h-4" /> :

                        <ChevronRight className="w-4 h-4" />
                      }
                      {section.name}
                    </h3>
                    <Badge variant="secondary">
                      {
                        fields.filter(
                          (f) => f.section === section.name && f.enabled
                        ).length
                      }{' '}
                      Active Fields
                    </Badge>
                  </div>

                  {expandedSections.includes(section.name) &&
                    <div className="p-4 space-y-3">
                      {fields.
                        filter((f) => f.section === section.name).
                        map((field) =>
                          <div
                            key={field.id}
                            className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg bg-white hover:border-blue-300 transition-colors group">

                            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Label Input */}
                              <div className="md:col-span-1">
                                <label className="text-xs text-gray-500 block mb-1">
                                  Field Label
                                </label>
                                <input
                                  type="text"
                                  value={field.label}
                                  onChange={(e) =>
                                    updateFieldLabel(field.id, e.target.value)
                                  }
                                  className="w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 px-2 py-1 border" />

                              </div>
                              {/* Type Info */}
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                  {field.type}
                                </Badge>
                                {field.options &&
                                  <Badge
                                    variant="secondary"
                                    className="text-xs">

                                    {field.options.length} options
                                  </Badge>
                                }
                              </div>
                              {/* Toggles */}
                              <div className="flex items-center justify-end gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={() =>
                                      toggleFieldRequired(field.id)
                                    }
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                                  <span className="text-sm text-gray-700">
                                    Required
                                  </span>
                                </label>
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={field.enabled}
                                    onChange={() =>
                                      toggleFieldEnabled(field.id)
                                    }
                                    className="sr-only peer" />

                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                  <span className="ml-2 text-sm font-medium text-gray-700">
                                    {field.enabled ? 'On' : 'Off'}
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed mt-2"
                        onClick={() => openAddFieldModal(section.name)}>

                        <Plus className="w-4 h-4 mr-2" /> Add Custom Field to{' '}
                        {section.name}
                      </Button>
                    </div>
                  }
                </Card>
              )}
          </div>

          {/* Right Column: Controls & Legend */}
          <div className="space-y-6">
            <Card title="Quick Actions">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setNewSectionData({
                      name: '',
                      description: '',
                      position: 'end',
                      relativeTo: ''
                    });
                    setIsSectionModalOpen(true);
                  }}>

                  <Plus className="w-4 h-4 mr-2" /> Add New Section
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsDuplicateModalOpen(true)}>

                  <Sliders className="w-4 h-4 mr-2" /> Duplicate Check Rules
                </Button>
              </div>
            </Card>

            <Card title="Field Types Legend">
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>{' '}
                  Text
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>{' '}
                  Number
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>{' '}
                  Date
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>{' '}
                  Select
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>{' '}
                  Checkbox
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>{' '}
                  File
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Add Field Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Custom Field"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </>
        }>

        <div className="space-y-4">
          <Input
            label="Field Label *"
            placeholder="e.g. Previous School Board"
            value={newFieldData.label || ''}
            onChange={(e) =>
              setNewFieldData({
                ...newFieldData,
                label: e.target.value
              })
            } />

          <Select
            label="Field Type *"
            options={[
              {
                value: 'text',
                label: 'Text Input'
              },
              {
                value: 'number',
                label: 'Number Input'
              },
              {
                value: 'date',
                label: 'Date Picker'
              },
              {
                value: 'select',
                label: 'Dropdown Selection'
              },
              {
                value: 'checkbox',
                label: 'Checkbox'
              },
              {
                value: 'textarea',
                label: 'Text Area'
              },
              {
                value: 'file',
                label: 'File Upload'
              }]
            }
            value={newFieldData.type}
            onChange={(val) =>
              setNewFieldData({
                ...newFieldData,
                type: val as any
              })
            } />

          <Select
            label="Section *"
            options={sections.map((s) => ({
              value: s.name,
              label: s.name
            }))}
            value={newFieldData.section}
            onChange={(val) =>
              setNewFieldData({
                ...newFieldData,
                section: val
              })
            } />


          {/* Conditional Dropdown Options */}
          {(newFieldData.type === 'select' ||
            newFieldData.type === 'multiselect') &&
            <div className="border rounded p-3 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-800 mb-2">
                Dropdown Options
              </h4>
              <Input
                label="Number of Options"
                type="number"
                min="1"
                max="20"
                value={dropdownOptionCount}
                onChange={(e) =>
                  handleDropdownCountChange(parseInt(e.target.value))
                } />

              <div className="space-y-2 mt-2 max-h-40 overflow-y-auto">
                {dropdownOptions.map((opt, idx) =>
                  <Input
                    key={idx}
                    placeholder={`Option ${idx + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleDropdownOptionChange(idx, e.target.value)
                    } />

                )}
              </div>
            </div>
          }

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newFieldData.required}
                onChange={(e) =>
                  setNewFieldData({
                    ...newFieldData,
                    required: e.target.checked
                  })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />

              <span className="text-sm text-gray-700">Required Field</span>
            </label>
          </div>
        </div>
      </Modal>

      {/* Add Section Modal */}
      <Modal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        title="Add New Section"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsSectionModalOpen(false)}>

              Cancel
            </Button>
            <Button onClick={handleAddSection}>Add Section</Button>
          </>
        }>

        <div className="space-y-4">
          <Input
            label="Section Name *"
            placeholder="e.g. Sibling Details"
            value={newSectionData.name}
            onChange={(e) =>
              setNewSectionData({
                ...newSectionData,
                name: e.target.value
              })
            } />

          <Input
            label="Description (Optional)"
            placeholder="Helper text for the section"
            value={newSectionData.description}
            onChange={(e) =>
              setNewSectionData({
                ...newSectionData,
                description: e.target.value
              })
            } />

          <Select
            label="Position"
            options={[
              {
                value: 'end',
                label: 'Add at end'
              },
              {
                value: 'above',
                label: 'Add Above...'
              }]
            }
            value={newSectionData.position}
            onChange={(val) =>
              setNewSectionData({
                ...newSectionData,
                position: val
              })
            } />

          {newSectionData.position === 'above' &&
            <Select
              label="Above Section"
              options={sections.map((s) => ({
                value: s.id,
                label: s.name
              }))}
              value={newSectionData.relativeTo}
              onChange={(val) =>
                setNewSectionData({
                  ...newSectionData,
                  relativeTo: val
                })
              } />

          }
        </div>
      </Modal>

      {/* Duplicate Check Modal */}
      <Modal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        title="Duplicate Field Names"
        size="lg"
        footer={
          <Button onClick={() => setIsDuplicateModalOpen(false)}>Close</Button>
        }>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Review fields that share the same label across multiple sections.
          </p>
          {getDuplicates().length > 0 ?
            <Table
              columns={[
                {
                  key: 'label',
                  header: 'Field Label'
                },
                {
                  key: 'types',
                  header: 'Types'
                },
                {
                  key: 'sections',
                  header: 'Sections'
                },
                {
                  key: 'count',
                  header: 'Count'
                }]
              }
              data={getDuplicates()} /> :


            <div className="p-8 text-center bg-gray-50 rounded border border-dashed">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">No duplicates found</h3>
              <p className="text-sm text-gray-500">
                Your form configuration is clean.
              </p>
            </div>
          }
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Admission Form Preview"
        size="xl"
        footer={
          <Button onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
        }>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto p-4 bg-gray-50 rounded-lg">
          {sections.
            sort((a, b) => a.order - b.order).
            map((section) => {
              const sectionFields = fields.filter(
                (f) => f.section === section.name && f.enabled
              );
              if (sectionFields.length === 0) return null;
              return (
                <div
                  key={section.id}
                  className="bg-white p-4 rounded shadow-sm border border-gray-200">

                  <h3 className="font-semibold text-gray-800 mb-1 pb-1 border-b">
                    {section.name}
                  </h3>
                  {section.description &&
                    <p className="text-xs text-gray-500 mb-3">
                      {section.description}
                    </p>
                  }
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionFields.map((field) =>
                      <div
                        key={field.id}
                        className={
                          field.type === 'textarea' ? 'md:col-span-2' : ''
                        }>

                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}{' '}
                          {field.required &&
                            <span className="text-red-500">*</span>
                          }
                        </label>
                        {field.type === 'select' ?
                          <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white">
                            <option>Select...</option>
                            {field.options?.map((opt) =>
                              <option key={opt}>{opt}</option>
                            )}
                          </select> :
                          field.type === 'checkbox' ?
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-blue-600" /> :

                            field.type === 'textarea' ?
                              <textarea
                                rows={3}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" /> :


                              <input
                                type={field.type === 'file' ? 'text' : field.type}
                                placeholder={
                                  field.type === 'file' ?
                                    'File upload placeholder' :
                                    ''
                                }
                                disabled={field.type === 'file'}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />

                        }
                      </div>
                    )}
                  </div>
                </div>);

            })}
        </div>
      </Modal>
    </div>);

}