// CustomFieldsDynamicForms.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  FileText,
  Settings,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  GripVertical,
  ToggleLeft,
  ToggleRight,
  Download,
  Upload,
  Layers,
  PlusCircle,
  FolderPlus } from
'lucide-react';

// Type definitions
interface FieldOption {
  value: string;
  label: string;
}

interface ValidationRule {
  type: 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'email' | 'phone';
  value: string | number;
  message: string;
}

interface CustomField {
  id: number;
  name: string;
  type: 'text' | 'number' | 'dropdown' | 'date' | 'checkbox' | 'textarea' | 'radio' | 'file' | 'email' | 'phone' | 'multiselect';
  placeholder?: string;
  helpText?: string;
  defaultValue?: string;
  required: boolean;
  options?: FieldOption[];
  validations?: ValidationRule[];
  order: number;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface CustomForm {
  id: number;
  name: string;
  description: string;
  assignedTo: string[];
  fields: CustomField[];
  status: 'Active' | 'Inactive' | 'Draft';
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  submissions: number;
}

interface FormAssignment {
  value: string;
  label: string;
  description: string;
}

const FORM_ASSIGNMENTS: FormAssignment[] = [
{ value: 'admission', label: 'Admission Form', description: 'New student admission process' },
{ value: 'student_profile', label: 'Student Profile', description: 'Student information management' },
{ value: 'employee_profile', label: 'Employee Profile', description: 'Staff information management' },
{ value: 'fee_collection', label: 'Fee Collection', description: 'Payment and fee forms' },
{ value: 'leave_application', label: 'Leave Application', description: 'Leave request forms' },
{ value: 'transport_registration', label: 'Transport Registration', description: 'Bus service enrollment' },
{ value: 'hostel_admission', label: 'Hostel Admission', description: 'Boarding facility forms' },
{ value: 'library_membership', label: 'Library Membership', description: 'Library card application' },
{ value: 'examination', label: 'Examination', description: 'Exam registration forms' },
{ value: 'feedback', label: 'Feedback Form', description: 'Feedback collection' },
{ value: 'event_registration', label: 'Event Registration', description: 'Event participation forms' },
{ value: 'scholarship', label: 'Scholarship Application', description: 'Financial aid forms' }];


const FIELD_TYPES = [
{ value: 'text', label: 'Text Input', icon: '📝' },
{ value: 'number', label: 'Number', icon: '🔢' },
{ value: 'email', label: 'Email', icon: '📧' },
{ value: 'phone', label: 'Phone Number', icon: '📱' },
{ value: 'dropdown', label: 'Dropdown Select', icon: '📋' },
{ value: 'multiselect', label: 'Multi-Select', icon: '☑️' },
{ value: 'radio', label: 'Radio Buttons', icon: '🔘' },
{ value: 'checkbox', label: 'Checkbox', icon: '✅' },
{ value: 'date', label: 'Date Picker', icon: '📅' },
{ value: 'textarea', label: 'Text Area', icon: '📄' },
{ value: 'file', label: 'File Upload', icon: '📎' }];


export function CustomFieldsDynamicForms() {
  // Initial mock data for forms
  const initialForms: CustomForm[] = [
  {
    id: 1,
    name: 'Extended Student Information',
    description: 'Additional fields for comprehensive student data collection',
    assignedTo: ['admission', 'student_profile'],
    status: 'Active',
    version: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    createdBy: 'Admin',
    submissions: 245,
    fields: [
    {
      id: 1,
      name: 'Blood Group',
      type: 'dropdown',
      required: true,
      options: [
      { value: 'a_pos', label: 'A+' },
      { value: 'a_neg', label: 'A-' },
      { value: 'b_pos', label: 'B+' },
      { value: 'b_neg', label: 'B-' },
      { value: 'ab_pos', label: 'AB+' },
      { value: 'ab_neg', label: 'AB-' },
      { value: 'o_pos', label: 'O+' },
      { value: 'o_neg', label: 'O-' }],

      order: 1,
      status: 'Active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'Mother Tongue',
      type: 'text',
      placeholder: 'Enter mother tongue',
      required: false,
      order: 2,
      status: 'Active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 3,
      name: 'Aadhar Number',
      type: 'text',
      placeholder: 'XXXX-XXXX-XXXX',
      required: true,
      helpText: 'Enter 12-digit Aadhar number',
      validations: [
      { type: 'pattern', value: '^[0-9]{12}$', message: 'Please enter valid 12-digit Aadhar number' }],

      order: 3,
      status: 'Active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 4,
      name: 'Previous School',
      type: 'text',
      placeholder: 'Enter previous school name',
      required: true,
      order: 4,
      status: 'Active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }]

  },
  {
    id: 2,
    name: 'Medical Information',
    description: 'Health and medical details for emergency purposes',
    assignedTo: ['admission', 'student_profile', 'hostel_admission'],
    status: 'Active',
    version: 1,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'Admin',
    submissions: 189,
    fields: [
    {
      id: 5,
      name: 'Known Allergies',
      type: 'textarea',
      placeholder: 'List any known allergies',
      required: false,
      helpText: 'Include food, medicine, and environmental allergies',
      order: 1,
      status: 'Active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 6,
      name: 'Medical Conditions',
      type: 'multiselect',
      required: false,
      options: [
      { value: 'asthma', label: 'Asthma' },
      { value: 'diabetes', label: 'Diabetes' },
      { value: 'epilepsy', label: 'Epilepsy' },
      { value: 'heart_condition', label: 'Heart Condition' },
      { value: 'none', label: 'None' }],

      order: 2,
      status: 'Active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 7,
      name: 'Emergency Contact Number',
      type: 'phone',
      placeholder: '+91 XXXXX XXXXX',
      required: true,
      order: 3,
      status: 'Active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 8,
      name: 'Family Doctor Name',
      type: 'text',
      placeholder: 'Enter doctor name',
      required: false,
      order: 4,
      status: 'Active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: 9,
      name: 'Doctor Contact',
      type: 'phone',
      placeholder: '+91 XXXXX XXXXX',
      required: false,
      order: 5,
      status: 'Active',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    }]

  },
  {
    id: 3,
    name: 'Employee Additional Details',
    description: 'Extended information for staff members',
    assignedTo: ['employee_profile'],
    status: 'Active',
    version: 3,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-10'),
    createdBy: 'HR Admin',
    submissions: 78,
    fields: [
    {
      id: 10,
      name: 'PAN Number',
      type: 'text',
      placeholder: 'XXXXX0000X',
      required: true,
      validations: [
      { type: 'pattern', value: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$', message: 'Please enter valid PAN number' }],

      order: 1,
      status: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 11,
      name: 'Bank Account Number',
      type: 'text',
      placeholder: 'Enter account number',
      required: true,
      order: 2,
      status: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 12,
      name: 'IFSC Code',
      type: 'text',
      placeholder: 'Enter IFSC code',
      required: true,
      order: 3,
      status: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 13,
      name: 'Highest Qualification',
      type: 'dropdown',
      required: true,
      options: [
      { value: 'high_school', label: 'High School' },
      { value: 'diploma', label: 'Diploma' },
      { value: 'bachelors', label: 'Bachelor\'s Degree' },
      { value: 'masters', label: 'Master\'s Degree' },
      { value: 'phd', label: 'Ph.D.' }],

      order: 4,
      status: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: 14,
      name: 'Years of Experience',
      type: 'number',
      placeholder: 'Enter years',
      required: true,
      validations: [
      { type: 'min', value: 0, message: 'Experience cannot be negative' },
      { type: 'max', value: 50, message: 'Please enter valid experience' }],

      order: 5,
      status: 'Active',
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    }]

  },
  {
    id: 4,
    name: 'Transport Preferences',
    description: 'Bus service and route preferences',
    assignedTo: ['transport_registration'],
    status: 'Active',
    version: 1,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'Transport Admin',
    submissions: 156,
    fields: [
    {
      id: 15,
      name: 'Pickup Address',
      type: 'textarea',
      placeholder: 'Enter complete pickup address',
      required: true,
      order: 1,
      status: 'Active',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 16,
      name: 'Preferred Pickup Time',
      type: 'dropdown',
      required: true,
      options: [
      { value: '7_00', label: '7:00 AM' },
      { value: '7_30', label: '7:30 AM' },
      { value: '8_00', label: '8:00 AM' },
      { value: '8_30', label: '8:30 AM' }],

      order: 2,
      status: 'Active',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    },
    {
      id: 17,
      name: 'Return Trip Required',
      type: 'radio',
      required: true,
      options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }],

      order: 3,
      status: 'Active',
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-02-15')
    }]

  },
  {
    id: 5,
    name: 'Scholarship Application Fields',
    description: 'Additional information for scholarship applications',
    assignedTo: ['scholarship'],
    status: 'Draft',
    version: 1,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'Finance Admin',
    submissions: 0,
    fields: [
    {
      id: 18,
      name: 'Annual Family Income',
      type: 'dropdown',
      required: true,
      options: [
      { value: 'below_1', label: 'Below ₹1,00,000' },
      { value: '1_to_3', label: '₹1,00,000 - ₹3,00,000' },
      { value: '3_to_5', label: '₹3,00,000 - ₹5,00,000' },
      { value: 'above_5', label: 'Above ₹5,00,000' }],

      order: 1,
      status: 'Active',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: 19,
      name: 'Income Certificate',
      type: 'file',
      required: true,
      helpText: 'Upload income certificate (PDF/JPG, max 2MB)',
      order: 2,
      status: 'Active',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: 20,
      name: 'Reason for Scholarship',
      type: 'textarea',
      placeholder: 'Explain why you need this scholarship',
      required: true,
      validations: [
      { type: 'minLength', value: 100, message: 'Please provide at least 100 characters' }],

      order: 3,
      status: 'Active',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-03-01')
    }]

  }];


  // State management
  const [forms, setForms] = useState<CustomForm[]>(initialForms);
  const [selectedForm, setSelectedForm] = useState<CustomForm | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [isAddingField, setIsAddingField] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [assignmentFilter, setAssignmentFilter] = useState('All');
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'forms' | 'fields'>('forms');

  // Form state for creating/editing forms
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignedTo: [] as string[],
    status: 'Draft' as 'Active' | 'Inactive' | 'Draft'
  });

  // Field state for creating/editing fields
  const [fieldData, setFieldData] = useState({
    name: '',
    type: 'text' as CustomField['type'],
    placeholder: '',
    helpText: '',
    defaultValue: '',
    required: false,
    options: '',
    validationMinLength: '',
    validationMaxLength: '',
    validationMin: '',
    validationMax: '',
    validationPattern: ''
  });

  // Toast notification state
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isVisible: false, message: '', type: 'info' });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'deleteForm' | 'deleteField' | 'duplicateForm' | null;
    targetId: number | null;
    message: string;
  }>({ isOpen: false, type: null, targetId: null, message: '' });

  // Show toast notification
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, isVisible: false })), 4000);
  }, []);

  // Filter forms based on search and filters
  const filteredForms = forms.filter((form) => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || form.status === statusFilter;
    const matchesAssignment = assignmentFilter === 'All' || form.assignedTo.includes(assignmentFilter);
    return matchesSearch && matchesStatus && matchesAssignment;
  });

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      assignedTo: [],
      status: 'Draft'
    });
  };

  // Reset field data
  const resetFieldData = () => {
    setFieldData({
      name: '',
      type: 'text',
      placeholder: '',
      helpText: '',
      defaultValue: '',
      required: false,
      options: '',
      validationMinLength: '',
      validationMaxLength: '',
      validationMin: '',
      validationMax: '',
      validationPattern: ''
    });
  };

  // Create new form
  const handleCreateForm = () => {
    if (!formData.name.trim()) {
      showToast('Please enter a form name', 'error');
      return;
    }

    if (formData.assignedTo.length === 0) {
      showToast('Please select at least one form assignment', 'error');
      return;
    }

    const newForm: CustomForm = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      assignedTo: formData.assignedTo,
      status: formData.status,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Current User',
      submissions: 0,
      fields: []
    };

    setForms((prev) => [...prev, newForm]);
    setIsCreatingForm(false);
    resetFormData();
    setSelectedForm(newForm);
    showToast('Form created successfully', 'success');
  };

  // Update existing form
  const handleUpdateForm = () => {
    if (!selectedForm) return;

    if (!formData.name.trim()) {
      showToast('Please enter a form name', 'error');
      return;
    }

    setForms((prev) => prev.map((form) => {
      if (form.id === selectedForm.id) {
        return {
          ...form,
          name: formData.name,
          description: formData.description,
          assignedTo: formData.assignedTo,
          status: formData.status,
          version: form.version + 1,
          updatedAt: new Date()
        };
      }
      return form;
    }));

    setSelectedForm((prev) => prev ? {
      ...prev,
      name: formData.name,
      description: formData.description,
      assignedTo: formData.assignedTo,
      status: formData.status,
      version: prev.version + 1,
      updatedAt: new Date()
    } : null);

    setIsEditingForm(false);
    showToast('Form updated successfully', 'success');
  };

  // Delete form
  const handleDeleteForm = (formId: number) => {
    setForms((prev) => prev.filter((form) => form.id !== formId));
    if (selectedForm?.id === formId) {
      setSelectedForm(null);
    }
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Form deleted successfully', 'success');
  };

  // Duplicate form
  const handleDuplicateForm = (formId: number) => {
    const originalForm = forms.find((form) => form.id === formId);
    if (!originalForm) return;

    const duplicatedForm: CustomForm = {
      ...originalForm,
      id: Date.now(),
      name: `${originalForm.name} (Copy)`,
      status: 'Draft',
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      submissions: 0,
      fields: originalForm.fields.map((field) => ({
        ...field,
        id: Date.now() + Math.random() * 1000
      }))
    };

    setForms((prev) => [...prev, duplicatedForm]);
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Form duplicated successfully', 'success');
  };

  // Toggle form status
  const handleToggleFormStatus = (formId: number) => {
    setForms((prev) => prev.map((form) => {
      if (form.id === formId) {
        const newStatus = form.status === 'Active' ? 'Inactive' : 'Active';
        return { ...form, status: newStatus, updatedAt: new Date() };
      }
      return form;
    }));

    if (selectedForm?.id === formId) {
      setSelectedForm((prev) => prev ? {
        ...prev,
        status: prev.status === 'Active' ? 'Inactive' : 'Active',
        updatedAt: new Date()
      } : null);
    }

    showToast('Form status updated', 'success');
  };

  // Open form for editing
  const handleEditForm = (form: CustomForm) => {
    setSelectedForm(form);
    setFormData({
      name: form.name,
      description: form.description,
      assignedTo: form.assignedTo,
      status: form.status
    });
    setIsEditingForm(true);
  };

  // Add field to form
  const handleAddField = () => {
    if (!selectedForm) return;

    if (!fieldData.name.trim()) {
      showToast('Please enter a field name', 'error');
      return;
    }

    // Parse options for dropdown/multiselect/radio
    let options: FieldOption[] | undefined;
    if (['dropdown', 'multiselect', 'radio'].includes(fieldData.type) && fieldData.options) {
      options = fieldData.options.split('\n').
      filter((opt) => opt.trim()).
      map((opt) => ({
        value: opt.toLowerCase().replace(/\s+/g, '_'),
        label: opt.trim()
      }));

      if (options.length === 0) {
        showToast('Please provide at least one option', 'error');
        return;
      }
    }

    // Parse validations
    const validations: ValidationRule[] = [];
    if (fieldData.validationMinLength) {
      validations.push({
        type: 'minLength',
        value: parseInt(fieldData.validationMinLength),
        message: `Minimum ${fieldData.validationMinLength} characters required`
      });
    }
    if (fieldData.validationMaxLength) {
      validations.push({
        type: 'maxLength',
        value: parseInt(fieldData.validationMaxLength),
        message: `Maximum ${fieldData.validationMaxLength} characters allowed`
      });
    }
    if (fieldData.validationMin) {
      validations.push({
        type: 'min',
        value: parseInt(fieldData.validationMin),
        message: `Minimum value is ${fieldData.validationMin}`
      });
    }
    if (fieldData.validationMax) {
      validations.push({
        type: 'max',
        value: parseInt(fieldData.validationMax),
        message: `Maximum value is ${fieldData.validationMax}`
      });
    }
    if (fieldData.validationPattern) {
      validations.push({
        type: 'pattern',
        value: fieldData.validationPattern,
        message: 'Please enter valid format'
      });
    }

    const newField: CustomField = {
      id: Date.now(),
      name: fieldData.name,
      type: fieldData.type,
      placeholder: fieldData.placeholder || undefined,
      helpText: fieldData.helpText || undefined,
      defaultValue: fieldData.defaultValue || undefined,
      required: fieldData.required,
      options: options,
      validations: validations.length > 0 ? validations : undefined,
      order: selectedForm.fields.length + 1,
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedForm = {
      ...selectedForm,
      fields: [...selectedForm.fields, newField],
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
    setIsAddingField(false);
    resetFieldData();
    showToast('Field added successfully', 'success');
  };

  // Update field
  const handleUpdateField = () => {
    if (!selectedForm || !editingFieldId) return;

    if (!fieldData.name.trim()) {
      showToast('Please enter a field name', 'error');
      return;
    }

    // Parse options
    let options: FieldOption[] | undefined;
    if (['dropdown', 'multiselect', 'radio'].includes(fieldData.type) && fieldData.options) {
      options = fieldData.options.split('\n').
      filter((opt) => opt.trim()).
      map((opt) => ({
        value: opt.toLowerCase().replace(/\s+/g, '_'),
        label: opt.trim()
      }));
    }

    // Parse validations
    const validations: ValidationRule[] = [];
    if (fieldData.validationMinLength) {
      validations.push({
        type: 'minLength',
        value: parseInt(fieldData.validationMinLength),
        message: `Minimum ${fieldData.validationMinLength} characters required`
      });
    }
    if (fieldData.validationMaxLength) {
      validations.push({
        type: 'maxLength',
        value: parseInt(fieldData.validationMaxLength),
        message: `Maximum ${fieldData.validationMaxLength} characters allowed`
      });
    }

    const updatedFields = selectedForm.fields.map((field) => {
      if (field.id === editingFieldId) {
        return {
          ...field,
          name: fieldData.name,
          type: fieldData.type,
          placeholder: fieldData.placeholder || undefined,
          helpText: fieldData.helpText || undefined,
          defaultValue: fieldData.defaultValue || undefined,
          required: fieldData.required,
          options: options,
          validations: validations.length > 0 ? validations : undefined,
          updatedAt: new Date()
        };
      }
      return field;
    });

    const updatedForm = {
      ...selectedForm,
      fields: updatedFields,
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
    setIsEditingField(false);
    setEditingFieldId(null);
    resetFieldData();
    showToast('Field updated successfully', 'success');
  };

  // Delete field
  const handleDeleteField = (fieldId: number) => {
    if (!selectedForm) return;

    const updatedFields = selectedForm.fields.
    filter((field) => field.id !== fieldId).
    map((field, index) => ({ ...field, order: index + 1 }));

    const updatedForm = {
      ...selectedForm,
      fields: updatedFields,
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
    setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' });
    showToast('Field deleted successfully', 'success');
  };

  // Move field up
  const handleMoveFieldUp = (fieldId: number) => {
    if (!selectedForm) return;

    const fieldIndex = selectedForm.fields.findIndex((f) => f.id === fieldId);
    if (fieldIndex <= 0) return;

    const updatedFields = [...selectedForm.fields];
    const temp = updatedFields[fieldIndex];
    updatedFields[fieldIndex] = updatedFields[fieldIndex - 1];
    updatedFields[fieldIndex - 1] = temp;

    // Update order numbers
    updatedFields.forEach((field, index) => {
      field.order = index + 1;
    });

    const updatedForm = {
      ...selectedForm,
      fields: updatedFields,
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
  };

  // Move field down
  const handleMoveFieldDown = (fieldId: number) => {
    if (!selectedForm) return;

    const fieldIndex = selectedForm.fields.findIndex((f) => f.id === fieldId);
    if (fieldIndex >= selectedForm.fields.length - 1) return;

    const updatedFields = [...selectedForm.fields];
    const temp = updatedFields[fieldIndex];
    updatedFields[fieldIndex] = updatedFields[fieldIndex + 1];
    updatedFields[fieldIndex + 1] = temp;

    // Update order numbers
    updatedFields.forEach((field, index) => {
      field.order = index + 1;
    });

    const updatedForm = {
      ...selectedForm,
      fields: updatedFields,
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
  };

  // Toggle field status
  const handleToggleFieldStatus = (fieldId: number) => {
    if (!selectedForm) return;

    const updatedFields = selectedForm.fields.map((field) => {
      if (field.id === fieldId) {
        return {
          ...field,
          status: field.status === 'Active' ? 'Inactive' as const : 'Active' as const,
          updatedAt: new Date()
        };
      }
      return field;
    });

    const updatedForm = {
      ...selectedForm,
      fields: updatedFields,
      updatedAt: new Date()
    };

    setForms((prev) => prev.map((form) =>
    form.id === selectedForm.id ? updatedForm : form
    ));
    setSelectedForm(updatedForm);
    showToast('Field status updated', 'success');
  };

  // Open field for editing
  const handleEditField = (field: CustomField) => {
    setFieldData({
      name: field.name,
      type: field.type,
      placeholder: field.placeholder || '',
      helpText: field.helpText || '',
      defaultValue: field.defaultValue || '',
      required: field.required,
      options: field.options?.map((opt) => opt.label).join('\n') || '',
      validationMinLength: field.validations?.find((v) => v.type === 'minLength')?.value?.toString() || '',
      validationMaxLength: field.validations?.find((v) => v.type === 'maxLength')?.value?.toString() || '',
      validationMin: field.validations?.find((v) => v.type === 'min')?.value?.toString() || '',
      validationMax: field.validations?.find((v) => v.type === 'max')?.value?.toString() || '',
      validationPattern: field.validations?.find((v) => v.type === 'pattern')?.value?.toString() || ''
    });
    setEditingFieldId(field.id);
    setIsEditingField(true);
  };

  // Handle assignment toggle
  const handleAssignmentToggle = (assignment: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(assignment) ?
      prev.assignedTo.filter((a) => a !== assignment) :
      [...prev.assignedTo, assignment]
    }));
  };

  // Export form configuration
  const handleExportForm = (form: CustomForm) => {
    const exportData = JSON.stringify(form, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-${form.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Form exported successfully', 'success');
  };

  // Get field type display info
  const getFieldTypeInfo = (type: string) => {
    return FIELD_TYPES.find((t) => t.value === type) || { label: type, icon: '📝' };
  };

  // Form list columns
  const formColumns = [
  {
    key: 'name',
    header: 'Form Name',
    render: (row: CustomForm) =>
    <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">{row.description}</p>
        </div>

  },
  {
    key: 'fields',
    header: 'Fields',
    render: (row: CustomForm) =>
    <span className="font-medium">{row.fields.length}</span>

  },
  {
    key: 'assignedTo',
    header: 'Assigned To',
    render: (row: CustomForm) =>
    <div className="flex flex-wrap gap-1">
          {row.assignedTo.slice(0, 2).map((assignment) =>
      <Badge key={assignment} variant="default">
              {FORM_ASSIGNMENTS.find((a) => a.value === assignment)?.label || assignment}
            </Badge>
      )}
          {row.assignedTo.length > 2 &&
      <Badge variant="default">+{row.assignedTo.length - 2}</Badge>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: CustomForm) =>
    <Badge
      variant={
      row.status === 'Active' ? 'success' :
      row.status === 'Draft' ? 'warning' : 'default'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'submissions',
    header: 'Submissions',
    render: (row: CustomForm) =>
    <span>{row.submissions}</span>

  },
  {
    key: 'updatedAt',
    header: 'Last Updated',
    render: (row: CustomForm) =>
    <span className="text-sm text-gray-500">
          {row.updatedAt.toLocaleDateString()}
        </span>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CustomForm) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="View/Edit Fields"
        onClick={() => setSelectedForm(row)}>

            <Layers className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit Form"
        onClick={() => handleEditForm(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Preview"
        onClick={() => {
          setSelectedForm(row);
          setShowPreview(true);
        }}>

            <Eye className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Duplicate"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'duplicateForm',
          targetId: row.id,
          message: `Do you want to create a copy of "${row.name}"?`
        })}>

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
        onClick={() => handleToggleFormStatus(row.id)}>

            {row.status === 'Active' ?
        <ToggleRight className="w-4 h-4 text-green-500" /> :

        <ToggleLeft className="w-4 h-4 text-gray-400" />
        }
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Export"
        onClick={() => handleExportForm(row)}>

            <Download className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        className="text-red-500 hover:text-red-700"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'deleteForm',
          targetId: row.id,
          message: `Are you sure you want to delete "${row.name}"? This action cannot be undone.`
        })}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  // Field list columns
  const fieldColumns = [
  {
    key: 'order',
    header: '#',
    render: (row: CustomField) =>
    <div className="flex items-center gap-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <span>{row.order}</span>
        </div>

  },
  {
    key: 'name',
    header: 'Field Name',
    render: (row: CustomField) =>
    <div>
          <p className="font-medium">{row.name}</p>
          {row.helpText &&
      <p className="text-xs text-gray-500">{row.helpText}</p>
      }
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: CustomField) => {
      const typeInfo = getFieldTypeInfo(row.type);
      return (
        <span className="flex items-center gap-2">
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.label}</span>
          </span>);

    }
  },
  {
    key: 'required',
    header: 'Required',
    render: (row: CustomField) =>
    <Badge variant={row.required ? 'danger' : 'default'}>
          {row.required ? 'Yes' : 'No'}
        </Badge>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: CustomField) =>
    <Badge variant={row.status === 'Active' ? 'success' : 'default'}>
          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: CustomField, index: number) =>
    <div className="flex items-center gap-1">
          <Button
        variant="ghost"
        size="xs"
        title="Move Up"
        onClick={() => handleMoveFieldUp(row.id)}
        disabled={index === 0}>

            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Move Down"
        onClick={() => handleMoveFieldDown(row.id)}
        disabled={selectedForm && index === selectedForm.fields.length - 1}>

            <ChevronDown className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Edit"
        onClick={() => handleEditField(row)}>

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title={row.status === 'Active' ? 'Deactivate' : 'Activate'}
        onClick={() => handleToggleFieldStatus(row.id)}>

            {row.status === 'Active' ?
        <ToggleRight className="w-4 h-4 text-green-500" /> :

        <ToggleLeft className="w-4 h-4 text-gray-400" />
        }
          </Button>
          <Button
        variant="ghost"
        size="xs"
        title="Delete"
        className="text-red-500 hover:text-red-700"
        onClick={() => setConfirmModal({
          isOpen: true,
          type: 'deleteField',
          targetId: row.id,
          message: `Are you sure you want to delete the field "${row.name}"?`
        })}>

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Toast Notification */}
      {toast.isVisible &&
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      'bg-blue-500 text-white'}`
      }>
          {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast((prev) => ({ ...prev, isVisible: false }))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Confirmation Modal */}
      {confirmModal.isOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
            <p className="text-gray-600 mb-4">{confirmModal.message}</p>
            <div className="flex justify-end gap-2">
              <Button
              variant="outline"
              onClick={() => setConfirmModal({ isOpen: false, type: null, targetId: null, message: '' })}>

                Cancel
              </Button>
              <Button
              variant={confirmModal.type === 'deleteForm' || confirmModal.type === 'deleteField' ? 'danger' : 'primary'}
              onClick={() => {
                if (confirmModal.type === 'deleteForm' && confirmModal.targetId) {
                  handleDeleteForm(confirmModal.targetId);
                } else if (confirmModal.type === 'deleteField' && confirmModal.targetId) {
                  handleDeleteField(confirmModal.targetId);
                } else if (confirmModal.type === 'duplicateForm' && confirmModal.targetId) {
                  handleDuplicateForm(confirmModal.targetId);
                }
              }}>

                {confirmModal.type === 'duplicateForm' ? 'Duplicate' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Create/Edit Form Modal */}
      {(isCreatingForm || isEditingForm) &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isCreatingForm ? 'Create New Form' : 'Edit Form'}
              </h3>
              <button onClick={() => {
              setIsCreatingForm(false);
              setIsEditingForm(false);
              resetFormData();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
              label="Form Name"
              placeholder="Enter form name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />


              <Textarea
              label="Description"
              placeholder="Enter form description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3} />


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Forms/Modules
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {FORM_ASSIGNMENTS.map((assignment) =>
                <label key={assignment.value} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(assignment.value)}
                    onChange={() => handleAssignmentToggle(assignment.value)}
                    className="mt-1 rounded border-gray-300" />

                      <div>
                        <p className="text-sm font-medium">{assignment.label}</p>
                        <p className="text-xs text-gray-500">{assignment.description}</p>
                      </div>
                    </label>
                )}
                </div>
              </div>

              <Select
              label="Status"
              options={[
              { value: 'Draft', label: 'Draft' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }]
              }
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))} />

            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setIsCreatingForm(false);
              setIsEditingForm(false);
              resetFormData();
            }}>
                Cancel
              </Button>
              <Button onClick={isCreatingForm ? handleCreateForm : handleUpdateForm}>
                <Save className="w-4 h-4 mr-2" />
                {isCreatingForm ? 'Create Form' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add/Edit Field Modal */}
      {(isAddingField || isEditingField) &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">
                {isAddingField ? 'Add New Field' : 'Edit Field'}
              </h3>
              <button onClick={() => {
              setIsAddingField(false);
              setIsEditingField(false);
              setEditingFieldId(null);
              resetFieldData();
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
              label="Field Name"
              placeholder="e.g. Blood Group, Phone Number"
              value={fieldData.name}
              onChange={(e) => setFieldData((prev) => ({ ...prev, name: e.target.value }))} />


              <Select
              label="Input Type"
              options={FIELD_TYPES.map((type) => ({
                value: type.value,
                label: `${type.icon} ${type.label}`
              }))}
              value={fieldData.type}
              onChange={(e) => setFieldData((prev) => ({ ...prev, type: e.target.value as any }))} />


              <Input
              label="Placeholder Text"
              placeholder="Enter placeholder text"
              value={fieldData.placeholder}
              onChange={(e) => setFieldData((prev) => ({ ...prev, placeholder: e.target.value }))} />


              <Input
              label="Help Text"
              placeholder="Additional instructions for users"
              value={fieldData.helpText}
              onChange={(e) => setFieldData((prev) => ({ ...prev, helpText: e.target.value }))} />


              <Input
              label="Default Value"
              placeholder="Default value (optional)"
              value={fieldData.defaultValue}
              onChange={(e) => setFieldData((prev) => ({ ...prev, defaultValue: e.target.value }))} />


              <div className="flex items-center gap-2">
                <input
                type="checkbox"
                id="required"
                checked={fieldData.required}
                onChange={(e) => setFieldData((prev) => ({ ...prev, required: e.target.checked }))}
                className="rounded border-gray-300" />

                <label htmlFor="required" className="text-sm text-gray-700">
                  Mark as Required Field
                </label>
              </div>

              {['dropdown', 'multiselect', 'radio'].includes(fieldData.type) &&
            <Textarea
              label="Options (One per line)"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
              value={fieldData.options}
              onChange={(e) => setFieldData((prev) => ({ ...prev, options: e.target.value }))}
              rows={4} />

            }

              {/* Validation Rules */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium text-gray-700">Validation Rules (Optional)</h4>
                
                {['text', 'textarea'].includes(fieldData.type) &&
              <div className="grid grid-cols-2 gap-4">
                    <Input
                  label="Min Length"
                  type="number"
                  placeholder="Minimum characters"
                  value={fieldData.validationMinLength}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, validationMinLength: e.target.value }))} />

                    <Input
                  label="Max Length"
                  type="number"
                  placeholder="Maximum characters"
                  value={fieldData.validationMaxLength}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, validationMaxLength: e.target.value }))} />

                  </div>
              }

                {fieldData.type === 'number' &&
              <div className="grid grid-cols-2 gap-4">
                    <Input
                  label="Minimum Value"
                  type="number"
                  placeholder="Min value"
                  value={fieldData.validationMin}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, validationMin: e.target.value }))} />

                    <Input
                  label="Maximum Value"
                  type="number"
                  placeholder="Max value"
                  value={fieldData.validationMax}
                  onChange={(e) => setFieldData((prev) => ({ ...prev, validationMax: e.target.value }))} />

                  </div>
              }

                {['text', 'phone'].includes(fieldData.type) &&
              <Input
                label="Pattern (Regex)"
                placeholder="e.g. ^[0-9]{10}$ for 10-digit number"
                value={fieldData.validationPattern}
                onChange={(e) => setFieldData((prev) => ({ ...prev, validationPattern: e.target.value }))} />

              }
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => {
              setIsAddingField(false);
              setIsEditingField(false);
              setEditingFieldId(null);
              resetFieldData();
            }}>
                Cancel
              </Button>
              <Button onClick={isAddingField ? handleAddField : handleUpdateField}>
                <Save className="w-4 h-4 mr-2" />
                {isAddingField ? 'Add Field' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreview && selectedForm &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedForm.name}</h3>
                <p className="text-sm text-gray-500">{selectedForm.description}</p>
              </div>
              <button onClick={() => setShowPreview(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-t pt-4 space-y-4">
              <p className="text-sm text-gray-500">Form Preview - This is how the form will appear to users</p>
              
              {selectedForm.fields.filter((f) => f.status === 'Active').map((field) =>
            <div key={field.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {field.type === 'text' &&
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.type === 'email' &&
              <input
                type="email"
                placeholder={field.placeholder || 'email@example.com'}
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.type === 'phone' &&
              <input
                type="tel"
                placeholder={field.placeholder || '+91 XXXXX XXXXX'}
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.type === 'number' &&
              <input
                type="number"
                placeholder={field.placeholder}
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.type === 'textarea' &&
              <textarea
                placeholder={field.placeholder}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                disabled />

              }

                  {field.type === 'date' &&
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.type === 'dropdown' &&
              <select className="w-full border rounded-lg px-3 py-2" disabled>
                      <option value="">Select an option</option>
                      {field.options?.map((opt) =>
                <option key={opt.value} value={opt.value}>{opt.label}</option>
                )}
                    </select>
              }

                  {field.type === 'multiselect' &&
              <div className="border rounded-lg p-3 space-y-2">
                      {field.options?.map((opt) =>
                <label key={opt.value} className="flex items-center gap-2">
                          <input type="checkbox" disabled className="rounded" />
                          <span>{opt.label}</span>
                        </label>
                )}
                    </div>
              }

                  {field.type === 'radio' &&
              <div className="space-y-2">
                      {field.options?.map((opt) =>
                <label key={opt.value} className="flex items-center gap-2">
                          <input type="radio" disabled name={field.name} />
                          <span>{opt.label}</span>
                        </label>
                )}
                    </div>
              }

                  {field.type === 'checkbox' &&
              <label className="flex items-center gap-2">
                      <input type="checkbox" disabled className="rounded" />
                      <span>{field.placeholder || 'Check this option'}</span>
                    </label>
              }

                  {field.type === 'file' &&
              <input
                type="file"
                className="w-full border rounded-lg px-3 py-2"
                disabled />

              }

                  {field.helpText &&
              <p className="text-xs text-gray-500">{field.helpText}</p>
              }
                </div>
            )}

              {selectedForm.fields.filter((f) => f.status === 'Active').length === 0 &&
            <p className="text-center text-gray-500 py-8">No active fields in this form</p>
            }
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Forms Builder</h1>
          <p className="text-sm text-gray-500">
            Create custom forms and assign them to different modules
          </p>
        </div>
        <Button onClick={() => {
          resetFormData();
          setIsCreatingForm(true);
        }}>
          <FolderPlus className="w-4 h-4 mr-2" />
          Create New Form
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Total Forms</p>
            <p className="text-3xl font-bold text-gray-900">{forms.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Active Forms</p>
            <p className="text-3xl font-bold text-green-600">
              {forms.filter((f) => f.status === 'Active').length}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Total Fields</p>
            <p className="text-3xl font-bold text-blue-600">
              {forms.reduce((acc, form) => acc + form.fields.length, 0)}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 font-medium">Total Submissions</p>
            <p className="text-3xl font-bold text-purple-600">
              {forms.reduce((acc, form) => acc + form.submissions, 0)}
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forms List */}
        <div className="lg:col-span-2">
          <Card>
            {/* Search and Filters */}
            <div className="p-4 border-b">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search forms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg" />

                  </div>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2">

                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <select
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2">

                  <option value="All">All Assignments</option>
                  {FORM_ASSIGNMENTS.map((assignment) =>
                  <option key={assignment.value} value={assignment.value}>
                      {assignment.label}
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Forms Table */}
            {filteredForms.length === 0 ?
            <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No forms found</p>
                <p className="text-sm">Create your first custom form to get started</p>
              </div> :

            <Table columns={formColumns} data={filteredForms} />
            }
          </Card>
        </div>

        {/* Selected Form Details / Field Editor */}
        <div>
          {selectedForm ?
          <Card>
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedForm.name}</h3>
                    <p className="text-sm text-gray-500">{selectedForm.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={selectedForm.status === 'Active' ? 'success' : 'warning'}>
                        {selectedForm.status}
                      </Badge>
                      <Badge variant="default">v{selectedForm.version}</Badge>
                    </div>
                  </div>
                  <button onClick={() => setSelectedForm(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Fields ({selectedForm.fields.length})</h4>
                  <Button size="sm" onClick={() => {
                  resetFieldData();
                  setIsAddingField(true);
                }}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </div>

              {selectedForm.fields.length === 0 ?
            <div className="p-8 text-center text-gray-500">
                  <Layers className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No fields yet</p>
                  <p className="text-sm">Add fields to this form</p>
                </div> :

            <div className="divide-y max-h-[400px] overflow-y-auto">
                  {selectedForm.fields.map((field, index) =>
              <div key={field.id} className={`p-3 ${field.status === 'Inactive' ? 'opacity-50' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 text-sm">{field.order}.</span>
                          <div>
                            <p className="font-medium text-sm">
                              {field.name}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getFieldTypeInfo(field.type).icon} {getFieldTypeInfo(field.type).label}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="xs" onClick={() => handleMoveFieldUp(field.id)} disabled={index === 0}>
                            <ChevronUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="xs" onClick={() => handleMoveFieldDown(field.id)} disabled={index === selectedForm.fields.length - 1}>
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="xs" onClick={() => handleEditField(field)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                      variant="ghost"
                      size="xs"
                      className="text-red-500"
                      onClick={() => setConfirmModal({
                        isOpen: true,
                        type: 'deleteField',
                        targetId: field.id,
                        message: `Delete field "${field.name}"?`
                      })}>

                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowPreview(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportForm(selectedForm)}>

                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card> :

          <Card className="p-8 text-center">
              <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium text-gray-900">Select a Form</h3>
              <p className="text-sm text-gray-500 mt-1">
                Click on a form from the list to view and edit its fields
              </p>
            </Card>
          }

          {/* Quick Stats for Selected Form */}
          {selectedForm &&
          <Card className="mt-4">
              <div className="p-4">
                <h4 className="font-medium mb-3">Form Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created</span>
                    <span>{selectedForm.createdAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span>{selectedForm.updatedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created By</span>
                    <span>{selectedForm.createdBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Submissions</span>
                    <span>{selectedForm.submissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Required Fields</span>
                    <span>{selectedForm.fields.filter((f) => f.required).length}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="text-gray-500">Assigned To:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedForm.assignedTo.map((assignment) =>
                    <Badge key={assignment} variant="default">
                          {FORM_ASSIGNMENTS.find((a) => a.value === assignment)?.label}
                        </Badge>
                    )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          }
        </div>
      </div>
    </div>);

}