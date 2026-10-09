import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import {
  Save,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Users,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Bell,
  Calendar,
  Target,
  TrendingUp,
  Zap,
  ArrowUp,
  ArrowDown,
  Info,
  Type,
  Hash,
  AtSign,
  MapPin,
  Smartphone,
  List,
  Settings,
  ArrowLeft } from
'lucide-react';

// Field type icons mapping
const fieldTypeIcons: Record<string, React.ElementType> = {
  text: Type,
  number: Hash,
  email: AtSign,
  phone: Smartphone,
  select: List,
  textarea: FileText,
  date: Calendar,
  address: MapPin
};

export function AdmissionInquirySetup() {
  const navigate = useNavigate();

  // Edit mode states for each section
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Modal states
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [showAddTemplateModal, setShowAddTemplateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: number | null;
  }>({ type: '', id: null });
  const [currentEditField, setCurrentEditField] = useState<any>(null);

  // Inquiry Form Fields State
  const [formFields, setFormFields] = useState([
  {
    id: 1,
    name: 'Student Name',
    fieldKey: 'student_name',
    type: 'text',
    isRequired: true,
    isActive: true,
    order: 1,
    placeholder: 'Enter student full name'
  },
  {
    id: 2,
    name: 'Date of Birth',
    fieldKey: 'dob',
    type: 'date',
    isRequired: true,
    isActive: true,
    order: 2,
    placeholder: ''
  },
  {
    id: 3,
    name: 'Gender',
    fieldKey: 'gender',
    type: 'select',
    isRequired: true,
    isActive: true,
    order: 3,
    placeholder: 'Select gender',
    options: ['Male', 'Female', 'Other']
  },
  {
    id: 4,
    name: 'Class Applied For',
    fieldKey: 'class_applied',
    type: 'select',
    isRequired: true,
    isActive: true,
    order: 4,
    placeholder: 'Select class',
    options: [
    'Nursery',
    'LKG',
    'UKG',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9',
    'Class 10',
    'Class 11',
    'Class 12']

  },
  {
    id: 5,
    name: 'Father Name',
    fieldKey: 'father_name',
    type: 'text',
    isRequired: true,
    isActive: true,
    order: 5,
    placeholder: "Enter father's name"
  },
  {
    id: 6,
    name: 'Mother Name',
    fieldKey: 'mother_name',
    type: 'text',
    isRequired: false,
    isActive: true,
    order: 6,
    placeholder: "Enter mother's name"
  },
  {
    id: 7,
    name: 'Primary Mobile',
    fieldKey: 'primary_mobile',
    type: 'phone',
    isRequired: true,
    isActive: true,
    order: 7,
    placeholder: 'Enter 10-digit mobile number'
  },
  {
    id: 8,
    name: 'Alternate Mobile',
    fieldKey: 'alternate_mobile',
    type: 'phone',
    isRequired: false,
    isActive: true,
    order: 8,
    placeholder: 'Enter alternate number'
  },
  {
    id: 9,
    name: 'Email Address',
    fieldKey: 'email',
    type: 'email',
    isRequired: false,
    isActive: true,
    order: 9,
    placeholder: 'Enter email address'
  },
  {
    id: 10,
    name: 'WhatsApp Number',
    fieldKey: 'whatsapp',
    type: 'phone',
    isRequired: false,
    isActive: true,
    order: 10,
    placeholder: 'Enter WhatsApp number'
  },
  {
    id: 11,
    name: 'Current Address',
    fieldKey: 'address',
    type: 'textarea',
    isRequired: false,
    isActive: true,
    order: 11,
    placeholder: 'Enter full address'
  },
  {
    id: 12,
    name: 'City',
    fieldKey: 'city',
    type: 'text',
    isRequired: false,
    isActive: true,
    order: 12,
    placeholder: 'Enter city'
  },
  {
    id: 13,
    name: 'Pincode',
    fieldKey: 'pincode',
    type: 'number',
    isRequired: false,
    isActive: true,
    order: 13,
    placeholder: 'Enter 6-digit pincode'
  },
  {
    id: 14,
    name: 'Previous School',
    fieldKey: 'previous_school',
    type: 'text',
    isRequired: false,
    isActive: true,
    order: 14,
    placeholder: 'Enter previous school name'
  },
  {
    id: 15,
    name: 'Source of Inquiry',
    fieldKey: 'source',
    type: 'select',
    isRequired: true,
    isActive: true,
    order: 15,
    placeholder: 'How did you hear about us?',
    options: [
    'Website',
    'Walk-in',
    'Phone Call',
    'Referral',
    'Advertisement',
    'Social Media',
    'School Event',
    'Other']

  },
  {
    id: 16,
    name: 'Referral Details',
    fieldKey: 'referral_details',
    type: 'text',
    isRequired: false,
    isActive: true,
    order: 16,
    placeholder: 'Enter referrer name/details'
  },
  {
    id: 17,
    name: 'Special Requirements',
    fieldKey: 'special_requirements',
    type: 'textarea',
    isRequired: false,
    isActive: false,
    order: 17,
    placeholder: 'Any special requirements or notes'
  }]
  );

  // New field form state
  const [newField, setNewField] = useState({
    name: '',
    fieldKey: '',
    type: 'text',
    isRequired: false,
    isActive: true,
    placeholder: '',
    options: [] as string[],
    optionsText: ''
  });

  // Inquiry Sources State
  const [inquirySources, setInquirySources] = useState([
  { id: 1, name: 'Website', isActive: true, color: 'blue' },
  { id: 2, name: 'Walk-in', isActive: true, color: 'green' },
  { id: 3, name: 'Phone Call', isActive: true, color: 'purple' },
  { id: 4, name: 'Referral', isActive: true, color: 'orange' },
  { id: 5, name: 'Advertisement', isActive: true, color: 'pink' },
  { id: 6, name: 'Social Media', isActive: true, color: 'cyan' },
  { id: 7, name: 'School Event', isActive: true, color: 'yellow' },
  { id: 8, name: 'Newspaper', isActive: false, color: 'gray' },
  { id: 9, name: 'Other', isActive: true, color: 'gray' }]
  );

  // New source form state
  const [newSource, setNewSource] = useState({
    name: '',
    color: 'blue',
    isActive: true
  });

  // Inquiry Status State
  const [inquiryStatuses, setInquiryStatuses] = useState([
  {
    id: 1,
    name: 'New',
    color: 'blue',
    isDefault: true,
    isActive: true,
    order: 1,
    description: 'Fresh inquiry received'
  },
  {
    id: 2,
    name: 'Contacted',
    color: 'purple',
    isDefault: false,
    isActive: true,
    order: 2,
    description: 'Initial contact made'
  },
  {
    id: 3,
    name: 'Follow-up Scheduled',
    color: 'yellow',
    isDefault: false,
    isActive: true,
    order: 3,
    description: 'Follow-up call/visit scheduled'
  },
  {
    id: 4,
    name: 'Visit Scheduled',
    color: 'orange',
    isDefault: false,
    isActive: true,
    order: 4,
    description: 'School visit scheduled'
  },
  {
    id: 5,
    name: 'Visited',
    color: 'cyan',
    isDefault: false,
    isActive: true,
    order: 5,
    description: 'Completed school visit'
  },
  {
    id: 6,
    name: 'Interested',
    color: 'green',
    isDefault: false,
    isActive: true,
    order: 6,
    description: 'Shown interest in admission'
  },
  {
    id: 7,
    name: 'Application Submitted',
    color: 'emerald',
    isDefault: false,
    isActive: true,
    order: 7,
    description: 'Application form submitted'
  },
  {
    id: 8,
    name: 'Not Interested',
    color: 'red',
    isDefault: false,
    isActive: true,
    order: 8,
    description: 'Not proceeding with admission'
  },
  {
    id: 9,
    name: 'Closed - Lost',
    color: 'gray',
    isDefault: false,
    isActive: true,
    order: 9,
    description: 'Inquiry closed - not converted'
  },
  {
    id: 10,
    name: 'Closed - Won',
    color: 'green',
    isDefault: false,
    isActive: true,
    order: 10,
    description: 'Inquiry closed - converted to admission'
  }]
  );

  // New status form state
  const [newStatus, setNewStatus] = useState({
    name: '',
    color: 'blue',
    description: '',
    isActive: true
  });

  // Follow-up Settings State
  const [followUpSettings, setFollowUpSettings] = useState({
    defaultFollowUpDays: 3,
    maxFollowUpAttempts: 5,
    followUpReminderHours: 2,
    autoCloseAfterDays: 30,
    escalateAfterMissedFollowUps: 2,
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    excludeWeekends: true
  });

  // Assignment Settings State
  const [assignmentSettings, setAssignmentSettings] = useState({
    autoAssignEnabled: true,
    assignmentMethod: 'round_robin',
    defaultAssignee: 'counselor_pool',
    notifyOnAssignment: true,
    reassignOnNoResponse: true,
    reassignAfterHours: 24
  });

  // Notification Templates State
  const [notificationTemplates, setNotificationTemplates] = useState([
  {
    id: 1,
    name: 'Inquiry Confirmation SMS',
    type: 'sms',
    trigger: 'on_inquiry',
    isActive: true,
    template:
    'Dear {parent_name}, Thank you for your inquiry at {school_name}. Your inquiry ID is {inquiry_id}. We will contact you soon.'
  },
  {
    id: 2,
    name: 'Inquiry Confirmation Email',
    type: 'email',
    trigger: 'on_inquiry',
    isActive: true,
    template: 'Thank you for your interest in {school_name}...'
  },
  {
    id: 3,
    name: 'Follow-up Reminder SMS',
    type: 'sms',
    trigger: 'before_followup',
    isActive: true,
    template:
    'Dear {parent_name}, This is a reminder about your scheduled school visit tomorrow at {time}.'
  },
  {
    id: 4,
    name: 'Brochure Email',
    type: 'email',
    trigger: 'on_inquiry',
    isActive: false,
    template: 'Please find attached our school brochure...'
  },
  {
    id: 5,
    name: 'Staff Assignment Notification',
    type: 'internal',
    trigger: 'on_assignment',
    isActive: true,
    template: 'New inquiry {inquiry_id} has been assigned to you.'
  }]
  );

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    type: 'sms',
    trigger: 'on_inquiry',
    template: '',
    isActive: true
  });

  // Auto Actions State
  const [autoActions, setAutoActions] = useState({
    sendConfirmationSMS: true,
    sendConfirmationEmail: false,
    sendBrochureEmail: false,
    createFollowUpTask: true,
    notifyAssignedStaff: true,
    sendWhatsAppMessage: false
  });

  // Lead Scoring State
  const [leadScoring, setLeadScoring] = useState({
    enabled: true,
    factors: [
    { id: 1, name: 'Source is Referral', points: 20, isActive: true },
    { id: 2, name: 'Email Provided', points: 10, isActive: true },
    { id: 3, name: 'Previous School Mentioned', points: 5, isActive: true },
    { id: 4, name: 'Within School Zone', points: 15, isActive: true },
    { id: 5, name: 'Sibling in School', points: 25, isActive: true },
    { id: 6, name: 'Responded to Follow-up', points: 10, isActive: true },
    { id: 7, name: 'Scheduled Visit', points: 20, isActive: true },
    { id: 8, name: 'Completed Visit', points: 25, isActive: true }]

  });

  // Handle field operations
  const handleFieldUpdate = (id: number, field: string, value: any) => {
    setFormFields((prev) =>
    prev.map((f) => f.id === id ? { ...f, [field]: value } : f)
    );
  };

  const handleAddField = () => {
    const newId = Math.max(...formFields.map((f) => f.id)) + 1;
    const newOrder = Math.max(...formFields.map((f) => f.order)) + 1;
    const options =
    newField.type === 'select' ?
    newField.optionsText.split('\n').filter((o) => o.trim()) :
    [];

    setFormFields([
    ...formFields,
    {
      id: newId,
      name: newField.name,
      fieldKey:
      newField.fieldKey ||
      newField.name.toLowerCase().replace(/\s+/g, '_'),
      type: newField.type,
      isRequired: newField.isRequired,
      isActive: newField.isActive,
      order: newOrder,
      placeholder: newField.placeholder,
      options
    }]
    );
    setNewField({
      name: '',
      fieldKey: '',
      type: 'text',
      isRequired: false,
      isActive: true,
      placeholder: '',
      options: [],
      optionsText: ''
    });
    setShowAddFieldModal(false);
  };

  const handleEditField = () => {
    if (currentEditField) {
      const options =
      currentEditField.type === 'select' ?
      (
      currentEditField.optionsText ||
      currentEditField.options?.join('\n') ||
      '').

      split('\n').
      filter((o: string) => o.trim()) :
      currentEditField.options || [];

      setFormFields((prev) =>
      prev.map((f) =>
      f.id === currentEditField.id ?
      { ...f, ...currentEditField, options } :
      f
      )
      );
      setShowEditFieldModal(false);
      setCurrentEditField(null);
    }
  };

  const moveField = (id: number, direction: 'up' | 'down') => {
    const index = formFields.findIndex((f) => f.id === id);
    if (direction === 'up' && index > 0) {
      const newFields = [...formFields];
      [newFields[index - 1], newFields[index]] = [
      newFields[index],
      newFields[index - 1]];

      newFields.forEach((f, i) => f.order = i + 1);
      setFormFields(newFields);
    } else if (direction === 'down' && index < formFields.length - 1) {
      const newFields = [...formFields];
      [newFields[index], newFields[index + 1]] = [
      newFields[index + 1],
      newFields[index]];

      newFields.forEach((f, i) => f.order = i + 1);
      setFormFields(newFields);
    }
  };

  // Handle source operations
  const handleAddSource = () => {
    const newId = Math.max(...inquirySources.map((s) => s.id)) + 1;
    setInquirySources([...inquirySources, { ...newSource, id: newId }]);
    setNewSource({ name: '', color: 'blue', isActive: true });
    setShowAddSourceModal(false);
  };

  // Handle status operations
  const handleAddStatus = () => {
    const newId = Math.max(...inquiryStatuses.map((s) => s.id)) + 1;
    const newOrder = Math.max(...inquiryStatuses.map((s) => s.order)) + 1;
    setInquiryStatuses([
    ...inquiryStatuses,
    { ...newStatus, id: newId, isDefault: false, order: newOrder }]
    );
    setNewStatus({ name: '', color: 'blue', description: '', isActive: true });
    setShowAddStatusModal(false);
  };

  // Handle template operations
  const handleAddTemplate = () => {
    const newId = Math.max(...notificationTemplates.map((t) => t.id)) + 1;
    setNotificationTemplates([
    ...notificationTemplates,
    { ...newTemplate, id: newId }]
    );
    setNewTemplate({
      name: '',
      type: 'sms',
      trigger: 'on_inquiry',
      template: '',
      isActive: true
    });
    setShowAddTemplateModal(false);
  };

  // Confirm delete handler
  const confirmDelete = () => {
    if (deleteTarget.type === 'field' && deleteTarget.id) {
      setFormFields((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'source' && deleteTarget.id) {
      setInquirySources((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'status' && deleteTarget.id) {
      setInquiryStatuses((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'template' && deleteTarget.id) {
      setNotificationTemplates((prev) =>
      prev.filter((t) => t.id !== deleteTarget.id)
      );
    }
    setShowDeleteConfirmModal(false);
    setDeleteTarget({ type: '', id: null });
  };

  // Color options for badges
  const colorOptions = [
  'blue',
  'green',
  'purple',
  'orange',
  'pink',
  'cyan',
  'yellow',
  'red',
  'gray',
  'emerald'];


  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
      orange: 'bg-orange-100 text-orange-700',
      pink: 'bg-pink-100 text-pink-700',
      cyan: 'bg-cyan-100 text-cyan-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      red: 'bg-red-100 text-red-700',
      gray: 'bg-gray-100 text-gray-700',
      emerald: 'bg-emerald-100 text-emerald-700'
    };
    return colors[color] || colors.gray;
  };

  // Section Header Component
  const SectionHeader = ({
    title,
    subtitle,
    sectionKey,
    onAdd,
    addLabel,
    icon: Icon







  }: {title: string;subtitle?: string;sectionKey: string;onAdd?: () => void;addLabel?: string;icon?: React.ElementType;}) => {
    const isEditing = editingSection === sectionKey;

    return (
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <div className="flex items-center gap-3">
          {Icon &&
          <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
          }
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onAdd &&
          <Button variant="outline" size="sm" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-1" />
              {addLabel || 'Add'}
            </Button>
          }
          <Button
            variant={isEditing ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setEditingSection(isEditing ? null : sectionKey)}>

            {isEditing ?
            <>
                <Check className="w-4 h-4 mr-1" />
                Done
              </> :

            <>
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </>
            }
          </Button>
        </div>
      </div>);

  };

  return (
    // MAIN SCROLLABLE CONTAINER
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-gray-50/50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
      <div className="space-y-6 p-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admission Inquiry Setup
              </h1>
              <p className="text-sm text-gray-500">
                Configure inquiry form fields, sources, statuses, follow-up
                rules, and notifications
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button variant="primary">
              <Save className="w-4 h-4 mr-2" />
              Save AllF Changes
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4 text-center">
            <FileText className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {formFields.filter((f) => f.isActive).length}
            </p>
            <p className="text-xs text-gray-500">Active Fields</p>
          </Card>
          <Card className="p-4 text-center">
            <Tag className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {inquirySources.filter((s) => s.isActive).length}
            </p>
            <p className="text-xs text-gray-500">Active Sources</p>
          </Card>
          <Card className="p-4 text-center">
            <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {inquiryStatuses.filter((s) => s.isActive).length}
            </p>
            <p className="text-xs text-gray-500">Status Options</p>
          </Card>
          <Card className="p-4 text-center">
            <Bell className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {notificationTemplates.filter((t) => t.isActive).length}
            </p>
            <p className="text-xs text-gray-500">Active Templates</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {leadScoring.factors.filter((f) => f.isActive).length}
            </p>
            <p className="text-xs text-gray-500">Scoring Factors</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inquiry Form Fields */}
            <Card className="p-4">
              <SectionHeader
                title="Inquiry Form Fields"
                subtitle="Configure fields shown in inquiry form"
                sectionKey="fields"
                onAdd={() => setShowAddFieldModal(true)}
                addLabel="Add Field"
                icon={FileText} />

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {formFields.
                sort((a, b) => a.order - b.order).
                map((field, index) => {
                  const FieldIcon = fieldTypeIcons[field.type] || Type;
                  return (
                    <div
                      key={field.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                      !field.isActive ?
                      'bg-gray-50 opacity-60' :
                      'bg-white hover:bg-gray-50'}`
                      }>

                        <div className="flex items-center gap-3">
                          {editingSection === 'fields' &&
                        <div className="flex flex-col gap-1">
                              <button
                            onClick={() => moveField(field.id, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">

                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                            onClick={() => moveField(field.id, 'down')}
                            disabled={index === formFields.length - 1}
                            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">

                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                        }
                          <div
                          className={`p-2 rounded-lg ${field.isActive ? 'bg-blue-50' : 'bg-gray-100'}`}>

                            <FieldIcon
                            className={`w-4 h-4 ${field.isActive ? 'text-blue-600' : 'text-gray-400'}`} />

                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-gray-900">
                                {field.name}
                              </span>
                              {field.isRequired &&
                            <span className="text-red-500 text-xs">
                                  *Required
                                </span>
                            }
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="font-mono bg-gray-100 px-1 rounded">
                                {field.fieldKey}
                              </span>
                              <span>•</span>
                              <span className="capitalize">{field.type}</span>
                              {field.type === 'select' && field.options &&
                            <>
                                  <span>•</span>
                                  <span>{field.options.length} options</span>
                                </>
                            }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {editingSection === 'fields' ?
                        <>
                              <button
                            onClick={() =>
                            handleFieldUpdate(
                              field.id,
                              'isRequired',
                              !field.isRequired
                            )
                            }
                            className={`px-2 py-1 rounded text-xs font-medium ${
                            field.isRequired ?
                            'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-500'}`
                            }>

                                {field.isRequired ? 'Required' : 'Optional'}
                              </button>
                              <button
                            onClick={() =>
                            handleFieldUpdate(
                              field.id,
                              'isActive',
                              !field.isActive
                            )
                            }
                            className={`p-1 rounded ${field.isActive ? 'text-green-600' : 'text-gray-400'}`}>

                                {field.isActive ?
                            <Eye className="w-4 h-4" /> :

                            <EyeOff className="w-4 h-4" />
                            }
                              </button>
                              <button
                            onClick={() => {
                              setCurrentEditField({
                                ...field,
                                optionsText:
                                field.options?.join('\n') || ''
                              });
                              setShowEditFieldModal(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-700">

                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'field',
                                id: field.id
                              });
                              setShowDeleteConfirmModal(true);
                            }}
                            className="p-1 text-red-500 hover:text-red-700">

                                <Trash2 className="w-4 h-4" />
                              </button>
                            </> :

                        <>
                              {field.isRequired &&
                          <Badge variant="error" className="text-xs">
                                  Required
                                </Badge>
                          }
                              <Badge
                            variant={
                            field.isActive ? 'success' : 'secondary'
                            }
                            className="text-xs">

                                {field.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </>
                        }
                        </div>
                      </div>);

                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Total: {formFields.length} fields | Active:{' '}
                {formFields.filter((f) => f.isActive).length} | Required:{' '}
                {
                formFields.filter((f) => f.isRequired && f.isActive).length
                }
              </p>
            </Card>

            {/* Inquiry Sources */}
            <Card className="p-4">
              <SectionHeader
                title="Inquiry Sources"
                subtitle="Track where inquiries come from"
                sectionKey="sources"
                onAdd={() => setShowAddSourceModal(true)}
                addLabel="Add Source"
                icon={Tag} />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inquirySources.map((source) =>
                <div
                  key={source.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                  !source.isActive ? 'bg-gray-50 opacity-60' : 'bg-white'}`
                  }>

                    <div className="flex items-center gap-2">
                      <span
                      className={`w-3 h-3 rounded-full ${getColorClasses(source.color).split(' ')[0]}`}>
                    </span>
                      <span className="text-sm font-medium text-gray-700">
                        {source.name}
                      </span>
                    </div>
                    {editingSection === 'sources' &&
                  <div className="flex items-center gap-1">
                        <button
                      onClick={() => {
                        setInquirySources((prev) =>
                        prev.map((s) =>
                        s.id === source.id ?
                        { ...s, isActive: !s.isActive } :
                        s
                        )
                        );
                      }}
                      className={`p-1 rounded ${source.isActive ? 'text-green-600' : 'text-gray-400'}`}>

                          {source.isActive ?
                      <Eye className="w-4 h-4" /> :

                      <EyeOff className="w-4 h-4" />
                      }
                        </button>
                        <button
                      onClick={() => {
                        setDeleteTarget({ type: 'source', id: source.id });
                        setShowDeleteConfirmModal(true);
                      }}
                      className="p-1 text-red-500 hover:text-red-700">

                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  }
                  </div>
                )}
              </div>
            </Card>

            {/* Inquiry Statuses */}
            <Card className="p-4">
              <SectionHeader
                title="Inquiry Statuses"
                subtitle="Define inquiry lifecycle stages"
                sectionKey="statuses"
                onAdd={() => setShowAddStatusModal(true)}
                addLabel="Add Status"
                icon={Target} />

              <div className="space-y-2">
                {inquiryStatuses.
                sort((a, b) => a.order - b.order).
                map((status, index) =>
                <div
                  key={status.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                  !status.isActive ? 'bg-gray-50 opacity-60' : 'bg-white'}`
                  }>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-6">
                          {index + 1}.
                        </span>
                        <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(status.color)}`}>

                          {status.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {status.description}
                        </span>
                        {status.isDefault &&
                    <Badge variant="info" className="text-xs">
                            Default
                          </Badge>
                    }
                      </div>
                      {editingSection === 'statuses' &&
                  <div className="flex items-center gap-1">
                          <button
                      onClick={() => {
                        setInquiryStatuses((prev) =>
                        prev.map((s) =>
                        s.id === status.id ?
                        { ...s, isActive: !s.isActive } :
                        s
                        )
                        );
                      }}
                      className={`p-1 rounded ${status.isActive ? 'text-green-600' : 'text-gray-400'}`}>

                            {status.isActive ?
                      <Eye className="w-4 h-4" /> :

                      <EyeOff className="w-4 h-4" />
                      }
                          </button>
                          {!status.isDefault &&
                    <button
                      onClick={() => {
                        setDeleteTarget({
                          type: 'status',
                          id: status.id
                        });
                        setShowDeleteConfirmModal(true);
                      }}
                      className="p-1 text-red-500 hover:text-red-700">

                              <Trash2 className="w-4 h-4" />
                            </button>
                    }
                        </div>
                  }
                    </div>
                )}
              </div>
            </Card>

            
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Follow-up Settings */}
            <Card className="p-4">
              <SectionHeader
                title="Follow-up Rules"
                subtitle="Configure follow-up automation"
                sectionKey="followup"
                icon={Clock} />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Follow-up Days
                  </label>
                  <input
                    type="number"
                    value={followUpSettings.defaultFollowUpDays}
                    onChange={(e) =>
                    editingSection === 'followup' &&
                    setFollowUpSettings({
                      ...followUpSettings,
                      defaultFollowUpDays: parseInt(e.target.value)
                    })
                    }
                    disabled={editingSection !== 'followup'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />

                  <p className="text-xs text-gray-500 mt-1">
                    Days after inquiry to schedule first follow-up
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Follow-up Attempts
                  </label>
                  <input
                    type="number"
                    value={followUpSettings.maxFollowUpAttempts}
                    onChange={(e) =>
                    editingSection === 'followup' &&
                    setFollowUpSettings({
                      ...followUpSettings,
                      maxFollowUpAttempts: parseInt(e.target.value)
                    })
                    }
                    disabled={editingSection !== 'followup'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />

                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Auto-close After (Days)
                  </label>
                  <input
                    type="number"
                    value={followUpSettings.autoCloseAfterDays}
                    onChange={(e) =>
                    editingSection === 'followup' &&
                    setFollowUpSettings({
                      ...followUpSettings,
                      autoCloseAfterDays: parseInt(e.target.value)
                    })
                    }
                    disabled={editingSection !== 'followup'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />

                  <p className="text-xs text-gray-500 mt-1">
                    Close inquiry if no response
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      value={followUpSettings.workingHoursStart}
                      onChange={(e) =>
                      editingSection === 'followup' &&
                      setFollowUpSettings({
                        ...followUpSettings,
                        workingHoursStart: e.target.value
                      })
                      }
                      disabled={editingSection !== 'followup'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      value={followUpSettings.workingHoursEnd}
                      onChange={(e) =>
                      editingSection === 'followup' &&
                      setFollowUpSettings({
                        ...followUpSettings,
                        workingHoursEnd: e.target.value
                      })
                      }
                      disabled={editingSection !== 'followup'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />

                  </div>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={followUpSettings.excludeWeekends}
                    onChange={(e) =>
                    editingSection === 'followup' &&
                    setFollowUpSettings({
                      ...followUpSettings,
                      excludeWeekends: e.target.checked
                    })
                    }
                    disabled={editingSection !== 'followup'}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">
                    Exclude Weekends
                  </span>
                </label>
              </div>
            </Card>

            {/* Assignment Settings */}
            <Card className="p-4">
              <SectionHeader
                title="Assignment Rules"
                subtitle="Auto-assign inquiries to staff"
                sectionKey="assignment"
                icon={Users} />

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    Enable Auto-Assignment
                  </span>
                  <button
                    onClick={() =>
                    editingSection === 'assignment' &&
                    setAssignmentSettings({
                      ...assignmentSettings,
                      autoAssignEnabled:
                      !assignmentSettings.autoAssignEnabled
                    })
                    }
                    disabled={editingSection !== 'assignment'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    assignmentSettings.autoAssignEnabled ?
                    'bg-green-500' :
                    'bg-gray-300'} ${
                    editingSection !== 'assignment' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      assignmentSettings.autoAssignEnabled ?
                      'translate-x-6' :
                      'translate-x-1'}`
                      } />

                  </button>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Method
                  </label>
                  <select
                    value={assignmentSettings.assignmentMethod}
                    onChange={(e) =>
                    editingSection === 'assignment' &&
                    setAssignmentSettings({
                      ...assignmentSettings,
                      assignmentMethod: e.target.value
                    })
                    }
                    disabled={editingSection !== 'assignment'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">

                    <option value="round_robin">Round Robin</option>
                    <option value="load_balanced">Load Balanced</option>
                    <option value="random">Random</option>
                    <option value="manual">Manual Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Assignee
                  </label>
                  <select
                    value={assignmentSettings.defaultAssignee}
                    onChange={(e) =>
                    editingSection === 'assignment' &&
                    setAssignmentSettings({
                      ...assignmentSettings,
                      defaultAssignee: e.target.value
                    })
                    }
                    disabled={editingSection !== 'assignment'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">

                    <option value="counselor_pool">Counselor Pool</option>
                    <option value="admission_head">Admission Head</option>
                    <option value="front_desk">Front Desk</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={assignmentSettings.notifyOnAssignment}
                      onChange={(e) =>
                      editingSection === 'assignment' &&
                      setAssignmentSettings({
                        ...assignmentSettings,
                        notifyOnAssignment: e.target.checked
                      })
                      }
                      disabled={editingSection !== 'assignment'}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                    <span className="text-sm text-gray-700">
                      Notify staff on assignment
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={assignmentSettings.reassignOnNoResponse}
                      onChange={(e) =>
                      editingSection === 'assignment' &&
                      setAssignmentSettings({
                        ...assignmentSettings,
                        reassignOnNoResponse: e.target.checked
                      })
                      }
                      disabled={editingSection !== 'assignment'}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                    <span className="text-sm text-gray-700">
                      Reassign if no response
                    </span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Auto Actions */}
            <Card className="p-4">
              <SectionHeader
                title="Auto Actions"
                subtitle="Actions on new inquiry"
                sectionKey="actions"
                icon={Zap} />

              <div className="space-y-3">
                {[
                {
                  key: 'sendConfirmationSMS',
                  label: 'Send Confirmation SMS',
                  icon: MessageSquare
                },
                {
                  key: 'sendConfirmationEmail',
                  label: 'Send Confirmation Email',
                  icon: Mail
                },
                {
                  key: 'sendBrochureEmail',
                  label: 'Send Brochure Email',
                  icon: FileText
                },
                {
                  key: 'createFollowUpTask',
                  label: 'Create Follow-up Task',
                  icon: Clock
                },
                {
                  key: 'notifyAssignedStaff',
                  label: 'Notify Assigned Staff',
                  icon: Bell
                },
                {
                  key: 'sendWhatsAppMessage',
                  label: 'Send WhatsApp Message',
                  icon: MessageSquare
                }].
                map((action) => {
                  const Icon = action.icon;
                  return (
                    <label
                      key={action.key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">

                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          {action.label}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={
                        autoActions[action.key as keyof typeof autoActions]
                        }
                        onChange={(e) =>
                        editingSection === 'actions' &&
                        setAutoActions({
                          ...autoActions,
                          [action.key]: e.target.checked
                        })
                        }
                        disabled={editingSection !== 'actions'}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                    </label>);

                })}
              </div>
            </Card>

            {/* Lead Scoring */}
            <Card className="p-4">
              <SectionHeader
                title="Lead Scoring"
                subtitle="Score inquiries for prioritization"
                sectionKey="scoring"
                icon={TrendingUp} />

              <div className="space-y-3">
                <label className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    Enable Lead Scoring
                  </span>
                  <button
                    onClick={() =>
                    editingSection === 'scoring' &&
                    setLeadScoring({
                      ...leadScoring,
                      enabled: !leadScoring.enabled
                    })
                    }
                    disabled={editingSection !== 'scoring'}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    leadScoring.enabled ? 'bg-green-500' : 'bg-gray-300'} ${
                    editingSection !== 'scoring' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>

                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      leadScoring.enabled ? 'translate-x-6' : 'translate-x-1'}`
                      } />

                  </button>
                </label>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {leadScoring.factors.map((factor) =>
                  <div
                    key={factor.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                    !factor.isActive ? 'bg-gray-50 opacity-60' : 'bg-white'}`
                    }>

                      <div className="flex items-center gap-2">
                        {editingSection === 'scoring' &&
                      <input
                        type="checkbox"
                        checked={factor.isActive}
                        onChange={(e) => {
                          setLeadScoring({
                            ...leadScoring,
                            factors: leadScoring.factors.map((f) =>
                            f.id === factor.id ?
                            { ...f, isActive: e.target.checked } :
                            f
                            )
                          });
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                      }
                        <span className="text-sm text-gray-700">
                          {factor.name}
                        </span>
                      </div>
                      {editingSection === 'scoring' ?
                    <input
                      type="number"
                      value={factor.points}
                      onChange={(e) => {
                        setLeadScoring({
                          ...leadScoring,
                          factors: leadScoring.factors.map((f) =>
                          f.id === factor.id ?
                          { ...f, points: parseInt(e.target.value) } :
                          f
                          )
                        });
                      }}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center" /> :


                    <span className="text-sm font-semibold text-blue-600">
                          +{factor.points}
                        </span>
                    }
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Max Score:{' '}
                  {leadScoring.factors.
                  filter((f) => f.isActive).
                  reduce((sum, f) => sum + f.points, 0)}{' '}
                  points
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Add Field Modal */}
        <Modal
          isOpen={showAddFieldModal}
          onClose={() => setShowAddFieldModal(false)}
          title="Add New Field"
          size="md">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Sibling Name"
                value={newField.name}
                onChange={(e) =>
                setNewField({ ...newField, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Key
                </label>
                <input
                  type="text"
                  placeholder="e.g., sibling_name"
                  value={
                  newField.fieldKey ||
                  newField.name.toLowerCase().replace(/\s+/g, '_')
                  }
                  onChange={(e) =>
                  setNewField({ ...newField, fieldKey: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <select
                  value={newField.type}
                  onChange={(e) =>
                  setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">

                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="date">Date</option>
                  <option value="select">Dropdown</option>
                  <option value="textarea">Text Area</option>
                  <option value="address">Address</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder Text
              </label>
              <input
                type="text"
                placeholder="Enter placeholder text..."
                value={newField.placeholder}
                onChange={(e) =>
                setNewField({ ...newField, placeholder: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            {newField.type === 'select' &&
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (one per line)
                </label>
                <textarea
                placeholder="Option 1&#10;Option 2&#10;Option 3"
                value={newField.optionsText}
                onChange={(e) =>
                setNewField({ ...newField, optionsText: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

              </div>
            }
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newField.isRequired}
                  onChange={(e) =>
                  setNewField({ ...newField, isRequired: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                <span className="text-sm text-gray-700">Required Field</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newField.isActive}
                  onChange={(e) =>
                  setNewField({ ...newField, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddFieldModal(false)}>

                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddField}
                disabled={!newField.name}>

                <Plus className="w-4 h-4 mr-2" />
                Add Field
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Field Modal */}
        <Modal
          isOpen={showEditFieldModal}
          onClose={() => {
            setShowEditFieldModal(false);
            setCurrentEditField(null);
          }}
          title="Edit Field"
          size="md">

          {currentEditField &&
          <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Name *
                </label>
                <input
                type="text"
                value={currentEditField.name}
                onChange={(e) =>
                setCurrentEditField({
                  ...currentEditField,
                  name: e.target.value
                })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Key
                  </label>
                  <input
                  type="text"
                  value={currentEditField.fieldKey}
                  onChange={(e) =>
                  setCurrentEditField({
                    ...currentEditField,
                    fieldKey: e.target.value
                  })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type
                  </label>
                  <select
                  value={currentEditField.type}
                  onChange={(e) =>
                  setCurrentEditField({
                    ...currentEditField,
                    type: e.target.value
                  })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">

                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="date">Date</option>
                    <option value="select">Dropdown</option>
                    <option value="textarea">Text Area</option>
                    <option value="address">Address</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placeholder Text
                </label>
                <input
                type="text"
                value={currentEditField.placeholder}
                onChange={(e) =>
                setCurrentEditField({
                  ...currentEditField,
                  placeholder: e.target.value
                })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

              </div>
              {currentEditField.type === 'select' &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Options (one per line)
                  </label>
                  <textarea
                value={
                currentEditField.optionsText ||
                currentEditField.options?.join('\n') ||
                ''
                }
                onChange={(e) =>
                setCurrentEditField({
                  ...currentEditField,
                  optionsText: e.target.value
                })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

                </div>
            }
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={currentEditField.isRequired}
                  onChange={(e) =>
                  setCurrentEditField({
                    ...currentEditField,
                    isRequired: e.target.checked
                  })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Required Field</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={currentEditField.isActive}
                  onChange={(e) =>
                  setCurrentEditField({
                    ...currentEditField,
                    isActive: e.target.checked
                  })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                variant="outline"
                onClick={() => {
                  setShowEditFieldModal(false);
                  setCurrentEditField(null);
                }}>

                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditField}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          }
        </Modal>

        {/* Add Source Modal */}
        <Modal
          isOpen={showAddSourceModal}
          onClose={() => setShowAddSourceModal(false)}
          title="Add Inquiry Source"
          size="sm">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Name *
              </label>
              <input
                type="text"
                placeholder="e.g., LinkedIn"
                value={newSource.name}
                onChange={(e) =>
                setNewSource({ ...newSource, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) =>
                <button
                  key={color}
                  onClick={() => setNewSource({ ...newSource, color })}
                  className={`w-8 h-8 rounded-full ${getColorClasses(color).split(' ')[0]} ${
                  newSource.color === color ?
                  'ring-2 ring-offset-2 ring-blue-500' :
                  ''}`
                  } />

                )}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newSource.isActive}
                onChange={(e) =>
                setNewSource({ ...newSource, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />

              <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddSourceModal(false)}>

                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddSource}
                disabled={!newSource.name}>

                <Plus className="w-4 h-4 mr-2" />
                Add Source
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Status Modal */}
        <Modal
          isOpen={showAddStatusModal}
          onClose={() => setShowAddStatusModal(false)}
          title="Add Inquiry Status"
          size="sm">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Document Pending"
                value={newStatus.name}
                onChange={(e) =>
                setNewStatus({ ...newStatus, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="Brief description..."
                value={newStatus.description}
                onChange={(e) =>
                setNewStatus({ ...newStatus, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) =>
                <button
                  key={color}
                  onClick={() => setNewStatus({ ...newStatus, color })}
                  className={`w-8 h-8 rounded-full ${getColorClasses(color).split(' ')[0]} ${
                  newStatus.color === color ?
                  'ring-2 ring-offset-2 ring-blue-500' :
                  ''}`
                  } />

                )}
              </div>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newStatus.isActive}
                onChange={(e) =>
                setNewStatus({ ...newStatus, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />

              <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddStatusModal(false)}>

                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddStatus}
                disabled={!newStatus.name}>

                <Plus className="w-4 h-4 mr-2" />
                Add Status
              </Button>
            </div>
          </div>
        </Modal>

        {/* Add Template Modal */}
        <Modal
          isOpen={showAddTemplateModal}
          onClose={() => setShowAddTemplateModal(false)}
          title="Add Notification Template"
          size="md">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Visit Confirmation"
                value={newTemplate.name}
                onChange={(e) =>
                setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newTemplate.type}
                  onChange={(e) =>
                  setNewTemplate({ ...newTemplate, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">

                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="internal">Internal Notification</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trigger
                </label>
                <select
                  value={newTemplate.trigger}
                  onChange={(e) =>
                  setNewTemplate({ ...newTemplate, trigger: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">

                  <option value="on_inquiry">On New Inquiry</option>
                  <option value="on_assignment">On Assignment</option>
                  <option value="before_followup">Before Follow-up</option>
                  <option value="after_followup">After Follow-up</option>
                  <option value="on_status_change">On Status Change</option>
                  <option value="on_visit_scheduled">On Visit Scheduled</option>
                  <option value="manual">Manual Only</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Content
              </label>
              <textarea
                placeholder="Enter template text with variables like {student_name}, {parent_name}..."
                value={newTemplate.template}
                onChange={(e) =>
                setNewTemplate({ ...newTemplate, template: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />

              <p className="text-xs text-gray-500 mt-1">
                Variables: {'{student_name}'}, {'{parent_name}'},{' '}
                {'{inquiry_id}'}, {'{school_name}'}, {'{time}'}, {'{date}'}
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newTemplate.isActive}
                onChange={(e) =>
                setNewTemplate({ ...newTemplate, isActive: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-blue-600" />

              <span className="text-sm text-gray-700">Active</span>
            </label>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowAddTemplateModal(false)}>

                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddTemplate}
                disabled={!newTemplate.name || !newTemplate.template}>

                <Plus className="w-4 h-4 mr-2" />
                Add Template
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteConfirmModal}
          onClose={() => {
            setShowDeleteConfirmModal(false);
            setDeleteTarget({ type: '', id: null });
          }}
          title="Confirm Delete"
          size="sm">

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-medium text-red-800">Are you sure?</p>
                <p className="text-sm text-red-600">
                  This action cannot be undone. This will permanently delete the{' '}
                  {deleteTarget.type}.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setDeleteTarget({ type: '', id: null });
                }}>

                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>);

}