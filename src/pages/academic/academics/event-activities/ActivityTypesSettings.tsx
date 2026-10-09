// src/pages/academic/event-activities/ActivityTypesSettings.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  PlusIcon, SearchIcon, EditIcon, TrashIcon, XIcon, SettingsIcon, CopyIcon,
  CheckCircleIcon, AlertCircleIcon, EyeIcon, ToggleLeftIcon, ToggleRightIcon,
  TagIcon, FolderIcon, ClockIcon, UsersIcon, BellIcon, ShieldIcon, FileTextIcon,
  CalendarIcon, MapPinIcon, DollarSignIcon, ListIcon, ChevronDownIcon, ChevronUpIcon } from
'lucide-react';

// Types
interface ActivityType {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  status: 'Active' | 'Inactive' | 'Deprecated';
  requiresApproval: boolean;
  approvalLevels: ApprovalLevel[];
  allowRegistration: boolean;
  maxParticipants: number | null;
  minParticipants: number | null;
  requiresLocation: boolean;
  defaultLocation: string;
  requiresBudget: boolean;
  defaultDuration: number;
  durationUnit: 'minutes' | 'hours' | 'days';
  allowRecurring: boolean;
  recurringOptions: string[];
  targetAudience: string[];
  allowedAudiences: string[];
  requiresAttachment: boolean;
  attachmentTypes: string[];
  maxAttachmentSize: number;
  notificationSettings: NotificationSetting[];
  reminderSettings: ReminderSetting[];
  customFields: CustomField[];
  defaultPriority: 'Low' | 'Normal' | 'High' | 'Critical';
  isHolidayType: boolean;
  affectsAttendance: boolean;
  countAsWorkingDay: boolean;
  visibleToParents: boolean;
  visibleToStudents: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  sortOrder: number;
}

interface ApprovalLevel {
  level: number;
  role: string;
  required: boolean;
}

interface NotificationSetting {
  event: string;
  channels: string[];
  recipients: string[];
  enabled: boolean;
}

interface ReminderSetting {
  time: number;
  unit: 'minutes' | 'hours' | 'days';
  recipients: string[];
  enabled: boolean;
}

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  options: string[];
  defaultValue: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'Active' | 'Inactive';
  typesCount: number;
}

interface FilterState {
  search: string;
  categoryFilter: string;
  statusFilter: string;
  approvalFilter: string;
}

interface TypeFormData {
  name: string;
  code: string;
  description: string;
  category: string;
  color: string;
  status: string;
  requiresApproval: boolean;
  allowRegistration: boolean;
  maxParticipants: string;
  minParticipants: string;
  requiresLocation: boolean;
  defaultLocation: string;
  requiresBudget: boolean;
  defaultDuration: string;
  durationUnit: string;
  allowRecurring: boolean;
  targetAudience: string[];
  requiresAttachment: boolean;
  maxAttachmentSize: string;
  defaultPriority: string;
  isHolidayType: boolean;
  affectsAttendance: boolean;
  countAsWorkingDay: boolean;
  visibleToParents: boolean;
  visibleToStudents: boolean;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  status: string;
}

const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500', 'bg-gray-500'];
const ICONS = ['calendar', 'book', 'users', 'trophy', 'music', 'briefcase', 'graduation-cap', 'heart', 'star', 'flag', 'clipboard', 'bell'];
const AUDIENCES = ['All', 'Students', 'Teachers', 'Parents', 'Staff', 'Administrators', 'Specific Classes', 'Specific Grades'];
const ROLES = ['Class Teacher', 'HOD', 'Coordinator', 'Vice Principal', 'Principal', 'Administrator'];
const CHANNELS = ['Email', 'SMS', 'Push Notification', 'In-App', 'WhatsApp'];

export function ActivityTypesSettings() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([
  {
    id: '1', name: 'Exam Invigilation', code: 'EXAM-INV', description: 'Teacher duty for exam supervision', category: 'Duty', icon: 'clipboard', color: 'bg-blue-500',
    status: 'Active', requiresApproval: false, approvalLevels: [], allowRegistration: false, maxParticipants: null, minParticipants: null,
    requiresLocation: true, defaultLocation: 'Examination Hall', requiresBudget: false, defaultDuration: 3, durationUnit: 'hours',
    allowRecurring: false, recurringOptions: [], targetAudience: ['Teachers'], allowedAudiences: ['Teachers', 'Staff'],
    requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 5, notificationSettings: [{ event: 'assigned', channels: ['Email', 'Push Notification'], recipients: ['Assignee'], enabled: true }],
    reminderSettings: [{ time: 1, unit: 'days', recipients: ['Assignee'], enabled: true }], customFields: [], defaultPriority: 'High',
    isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: false, visibleToStudents: false,
    createdAt: new Date('2024-01-10'), updatedAt: new Date('2024-01-10'), createdBy: 'Admin', usageCount: 45, sortOrder: 1
  },
  {
    id: '2', name: 'Field Trip', code: 'FIELD-TRIP', description: 'Educational visit outside school premises', category: 'Event', icon: 'map-pin', color: 'bg-green-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'Coordinator', required: true }, { level: 2, role: 'Principal', required: true }],
    allowRegistration: true, maxParticipants: 50, minParticipants: 10, requiresLocation: true, defaultLocation: '', requiresBudget: true,
    defaultDuration: 1, durationUnit: 'days', allowRecurring: false, recurringOptions: [], targetAudience: ['Students'], allowedAudiences: ['Students', 'Teachers'],
    requiresAttachment: true, attachmentTypes: ['pdf', 'doc', 'image'], maxAttachmentSize: 10, notificationSettings: [{ event: 'created', channels: ['Email', 'SMS'], recipients: ['Parents'], enabled: true }],
    reminderSettings: [{ time: 3, unit: 'days', recipients: ['Parents', 'Students'], enabled: true }], customFields: [{ id: 'cf1', name: 'Permission Slip', type: 'checkbox', required: true, options: [], defaultValue: 'false' }],
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: true, countAsWorkingDay: true, visibleToParents: true, visibleToStudents: true,
    createdAt: new Date('2024-01-12'), updatedAt: new Date('2024-01-15'), createdBy: 'Admin', usageCount: 12, sortOrder: 2
  },
  {
    id: '3', name: 'Parent-Teacher Meeting', code: 'PTM', description: 'Scheduled meeting between parents and teachers', category: 'Meeting', icon: 'users', color: 'bg-purple-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'Coordinator', required: true }], allowRegistration: true, maxParticipants: null, minParticipants: null,
    requiresLocation: true, defaultLocation: 'Classrooms', requiresBudget: false, defaultDuration: 4, durationUnit: 'hours',
    allowRecurring: true, recurringOptions: ['Monthly', 'Quarterly'], targetAudience: ['Parents', 'Teachers'], allowedAudiences: ['Parents', 'Teachers', 'Administrators'],
    requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 5, notificationSettings: [{ event: 'scheduled', channels: ['Email', 'SMS', 'WhatsApp'], recipients: ['Parents'], enabled: true }],
    reminderSettings: [{ time: 1, unit: 'days', recipients: ['Parents'], enabled: true }, { time: 2, unit: 'hours', recipients: ['Parents'], enabled: true }],
    customFields: [], defaultPriority: 'High', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: true, visibleToStudents: false,
    createdAt: new Date('2024-01-05'), updatedAt: new Date('2024-01-18'), createdBy: 'Admin', usageCount: 8, sortOrder: 3
  },
  {
    id: '4', name: 'Sports Competition', code: 'SPORTS-COMP', description: 'Inter-house or inter-school sports events', category: 'Sports', icon: 'trophy', color: 'bg-orange-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'HOD', required: true }, { level: 2, role: 'Principal', required: false }],
    allowRegistration: true, maxParticipants: 100, minParticipants: 20, requiresLocation: true, defaultLocation: 'Sports Ground', requiresBudget: true,
    defaultDuration: 1, durationUnit: 'days', allowRecurring: false, recurringOptions: [], targetAudience: ['Students'], allowedAudiences: ['Students', 'Teachers', 'Parents'],
    requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 5, notificationSettings: [{ event: 'registration_open', channels: ['Push Notification'], recipients: ['Students'], enabled: true }],
    reminderSettings: [{ time: 1, unit: 'days', recipients: ['Participants'], enabled: true }], customFields: [{ id: 'cf2', name: 'Event Category', type: 'select', required: true, options: ['Athletics', 'Team Sports', 'Individual'], defaultValue: '' }],
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: true, visibleToStudents: true,
    createdAt: new Date('2024-01-08'), updatedAt: new Date('2024-01-08'), createdBy: 'Admin', usageCount: 15, sortOrder: 4
  },
  {
    id: '5', name: 'Cultural Program', code: 'CULTURAL', description: 'Cultural events and performances', category: 'Cultural', icon: 'music', color: 'bg-pink-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'Coordinator', required: true }], allowRegistration: true, maxParticipants: 200, minParticipants: 10,
    requiresLocation: true, defaultLocation: 'Auditorium', requiresBudget: true, defaultDuration: 3, durationUnit: 'hours',
    allowRecurring: false, recurringOptions: [], targetAudience: ['All'], allowedAudiences: ['All'], requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 5,
    notificationSettings: [{ event: 'created', channels: ['Email', 'Push Notification'], recipients: ['All'], enabled: true }],
    reminderSettings: [{ time: 1, unit: 'days', recipients: ['Participants', 'Parents'], enabled: true }], customFields: [],
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: true, visibleToStudents: true,
    createdAt: new Date('2024-01-06'), updatedAt: new Date('2024-01-20'), createdBy: 'Admin', usageCount: 6, sortOrder: 5
  },
  {
    id: '6', name: 'School Holiday', code: 'HOLIDAY', description: 'Official school holiday', category: 'Holiday', icon: 'calendar', color: 'bg-red-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'Principal', required: true }], allowRegistration: false, maxParticipants: null, minParticipants: null,
    requiresLocation: false, defaultLocation: '', requiresBudget: false, defaultDuration: 1, durationUnit: 'days',
    allowRecurring: true, recurringOptions: ['Yearly'], targetAudience: ['All'], allowedAudiences: ['All'], requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 0,
    notificationSettings: [{ event: 'announced', channels: ['Email', 'SMS', 'Push Notification'], recipients: ['All'], enabled: true }],
    reminderSettings: [], customFields: [], defaultPriority: 'Normal', isHolidayType: true, affectsAttendance: true, countAsWorkingDay: false, visibleToParents: true, visibleToStudents: true,
    createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'), createdBy: 'Admin', usageCount: 25, sortOrder: 6
  },
  {
    id: '7', name: 'Workshop', code: 'WORKSHOP', description: 'Training and skill development sessions', category: 'Academic', icon: 'book', color: 'bg-indigo-500',
    status: 'Active', requiresApproval: true, approvalLevels: [{ level: 1, role: 'HOD', required: true }], allowRegistration: true, maxParticipants: 30, minParticipants: 5,
    requiresLocation: true, defaultLocation: 'Training Room', requiresBudget: true, defaultDuration: 2, durationUnit: 'hours',
    allowRecurring: true, recurringOptions: ['Weekly', 'Monthly'], targetAudience: ['Teachers', 'Students'], allowedAudiences: ['Teachers', 'Students', 'Staff'],
    requiresAttachment: true, attachmentTypes: ['pdf', 'ppt'], maxAttachmentSize: 20, notificationSettings: [{ event: 'registration_open', channels: ['Email'], recipients: ['Target Audience'], enabled: true }],
    reminderSettings: [{ time: 1, unit: 'days', recipients: ['Registered'], enabled: true }], customFields: [{ id: 'cf3', name: 'Certificate Required', type: 'checkbox', required: false, options: [], defaultValue: 'true' }],
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: false, visibleToStudents: true,
    createdAt: new Date('2024-01-14'), updatedAt: new Date('2024-01-14'), createdBy: 'Admin', usageCount: 18, sortOrder: 7
  },
  {
    id: '8', name: 'Staff Meeting', code: 'STAFF-MEET', description: 'Internal staff coordination meeting', category: 'Meeting', icon: 'briefcase', color: 'bg-teal-500',
    status: 'Active', requiresApproval: false, approvalLevels: [], allowRegistration: false, maxParticipants: null, minParticipants: null,
    requiresLocation: true, defaultLocation: 'Conference Room', requiresBudget: false, defaultDuration: 1, durationUnit: 'hours',
    allowRecurring: true, recurringOptions: ['Weekly', 'Monthly'], targetAudience: ['Teachers', 'Staff'], allowedAudiences: ['Teachers', 'Staff', 'Administrators'],
    requiresAttachment: false, attachmentTypes: [], maxAttachmentSize: 5, notificationSettings: [{ event: 'scheduled', channels: ['Email', 'Push Notification'], recipients: ['Attendees'], enabled: true }],
    reminderSettings: [{ time: 30, unit: 'minutes', recipients: ['Attendees'], enabled: true }], customFields: [],
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: false, visibleToStudents: false,
    createdAt: new Date('2024-01-03'), updatedAt: new Date('2024-01-19'), createdBy: 'Admin', usageCount: 35, sortOrder: 8
  }]
  );

  const [categories, setCategories] = useState<Category[]>([
  { id: '1', name: 'Duty', description: 'Staff duty assignments', color: 'bg-blue-500', icon: 'clipboard', status: 'Active', typesCount: 1 },
  { id: '2', name: 'Event', description: 'General school events', color: 'bg-green-500', icon: 'calendar', status: 'Active', typesCount: 1 },
  { id: '3', name: 'Meeting', description: 'Meetings and conferences', color: 'bg-purple-500', icon: 'users', status: 'Active', typesCount: 2 },
  { id: '4', name: 'Sports', description: 'Sports and physical activities', color: 'bg-orange-500', icon: 'trophy', status: 'Active', typesCount: 1 },
  { id: '5', name: 'Cultural', description: 'Cultural programs and performances', color: 'bg-pink-500', icon: 'music', status: 'Active', typesCount: 1 },
  { id: '6', name: 'Holiday', description: 'School holidays and vacations', color: 'bg-red-500', icon: 'calendar', status: 'Active', typesCount: 1 },
  { id: '7', name: 'Academic', description: 'Academic activities and workshops', color: 'bg-indigo-500', icon: 'book', status: 'Active', typesCount: 1 }]
  );

  const [filters, setFilters] = useState<FilterState>({ search: '', categoryFilter: 'all', statusFilter: 'all', approvalFilter: 'all' });
  const [activeTab, setActiveTab] = useState<'types' | 'categories' | 'settings'>('types');
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null);
  const [editingType, setEditingType] = useState<ActivityType | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const [typeForm, setTypeForm] = useState<TypeFormData>({
    name: '', code: '', description: '', category: '', color: 'bg-blue-500', status: 'Active',
    requiresApproval: false, allowRegistration: false, maxParticipants: '', minParticipants: '',
    requiresLocation: false, defaultLocation: '', requiresBudget: false, defaultDuration: '1', durationUnit: 'hours',
    allowRecurring: false, targetAudience: [], requiresAttachment: false, maxAttachmentSize: '5',
    defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true,
    visibleToParents: true, visibleToStudents: true
  });

  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({ name: '', description: '', color: 'bg-blue-500', icon: 'calendar', status: 'Active' });

  // Statistics
  const stats = useMemo(() => ({
    totalTypes: activityTypes.length, activeTypes: activityTypes.filter((t) => t.status === 'Active').length,
    typesRequiringApproval: activityTypes.filter((t) => t.requiresApproval).length, totalCategories: categories.length,
    activeCategories: categories.filter((c) => c.status === 'Active').length, totalUsage: activityTypes.reduce((sum, t) => sum + t.usageCount, 0)
  }), [activityTypes, categories]);

  // Filtered Types
  const filteredTypes = useMemo(() => activityTypes.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(filters.search.toLowerCase()) || t.code.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.categoryFilter === 'all' || t.category === filters.categoryFilter;
    const matchesStatus = filters.statusFilter === 'all' || t.status === filters.statusFilter;
    const matchesApproval = filters.approvalFilter === 'all' || (filters.approvalFilter === 'yes' ? t.requiresApproval : !t.requiresApproval);
    return matchesSearch && matchesCategory && matchesStatus && matchesApproval;
  }).sort((a, b) => a.sortOrder - b.sortOrder), [activityTypes, filters]);

  // Handlers
  const updateFilter = useCallback((key: keyof FilterState, value: string) => setFilters((p) => ({ ...p, [key]: value })), []);
  const clearFilters = useCallback(() => setFilters({ search: '', categoryFilter: 'all', statusFilter: 'all', approvalFilter: 'all' }), []);

  const resetTypeForm = useCallback(() => {
    setTypeForm({ name: '', code: '', description: '', category: '', color: 'bg-blue-500', status: 'Active', requiresApproval: false, allowRegistration: false, maxParticipants: '', minParticipants: '', requiresLocation: false, defaultLocation: '', requiresBudget: false, defaultDuration: '1', durationUnit: 'hours', allowRecurring: false, targetAudience: [], requiresAttachment: false, maxAttachmentSize: '5', defaultPriority: 'Normal', isHolidayType: false, affectsAttendance: false, countAsWorkingDay: true, visibleToParents: true, visibleToStudents: true });
    setEditingType(null);
  }, []);

  const resetCategoryForm = useCallback(() => {setCategoryForm({ name: '', description: '', color: 'bg-blue-500', icon: 'calendar', status: 'Active' });setEditingCategory(null);}, []);

  const handleCreateType = useCallback(() => {
    if (!typeForm.name || !typeForm.category) {alert('Please fill required fields');return;}
    const newType: ActivityType = {
      id: `type-${Date.now()}`, name: typeForm.name, code: typeForm.code || typeForm.name.toUpperCase().replace(/\s+/g, '-'),
      description: typeForm.description, category: typeForm.category, icon: 'calendar', color: typeForm.color,
      status: typeForm.status as ActivityType['status'], requiresApproval: typeForm.requiresApproval, approvalLevels: [],
      allowRegistration: typeForm.allowRegistration, maxParticipants: typeForm.maxParticipants ? parseInt(typeForm.maxParticipants) : null,
      minParticipants: typeForm.minParticipants ? parseInt(typeForm.minParticipants) : null, requiresLocation: typeForm.requiresLocation,
      defaultLocation: typeForm.defaultLocation, requiresBudget: typeForm.requiresBudget, defaultDuration: parseInt(typeForm.defaultDuration) || 1,
      durationUnit: typeForm.durationUnit as ActivityType['durationUnit'], allowRecurring: typeForm.allowRecurring, recurringOptions: [],
      targetAudience: typeForm.targetAudience, allowedAudiences: typeForm.targetAudience, requiresAttachment: typeForm.requiresAttachment,
      attachmentTypes: ['pdf', 'doc', 'image'], maxAttachmentSize: parseInt(typeForm.maxAttachmentSize) || 5, notificationSettings: [],
      reminderSettings: [], customFields: [], defaultPriority: typeForm.defaultPriority as ActivityType['defaultPriority'],
      isHolidayType: typeForm.isHolidayType, affectsAttendance: typeForm.affectsAttendance, countAsWorkingDay: typeForm.countAsWorkingDay,
      visibleToParents: typeForm.visibleToParents, visibleToStudents: typeForm.visibleToStudents, createdAt: new Date(), updatedAt: new Date(),
      createdBy: 'Current User', usageCount: 0, sortOrder: activityTypes.length + 1
    };
    setActivityTypes((p) => [...p, newType]);
    setCategories((p) => p.map((c) => c.name === typeForm.category ? { ...c, typesCount: c.typesCount + 1 } : c));
    resetTypeForm();
    setShowTypeModal(false);
    alert('Activity type created successfully!');
  }, [typeForm, activityTypes.length, resetTypeForm]);

  const handleUpdateType = useCallback(() => {
    if (!editingType || !typeForm.name) {alert('Please fill required fields');return;}
    const oldCategory = editingType.category;
    setActivityTypes((p) => p.map((t) => t.id === editingType.id ? {
      ...t, name: typeForm.name, code: typeForm.code || t.code, description: typeForm.description, category: typeForm.category || t.category,
      color: typeForm.color, status: typeForm.status as ActivityType['status'], requiresApproval: typeForm.requiresApproval,
      allowRegistration: typeForm.allowRegistration, maxParticipants: typeForm.maxParticipants ? parseInt(typeForm.maxParticipants) : null,
      minParticipants: typeForm.minParticipants ? parseInt(typeForm.minParticipants) : null, requiresLocation: typeForm.requiresLocation,
      defaultLocation: typeForm.defaultLocation, requiresBudget: typeForm.requiresBudget, defaultDuration: parseInt(typeForm.defaultDuration) || t.defaultDuration,
      durationUnit: typeForm.durationUnit as ActivityType['durationUnit'], allowRecurring: typeForm.allowRecurring, targetAudience: typeForm.targetAudience,
      requiresAttachment: typeForm.requiresAttachment, maxAttachmentSize: parseInt(typeForm.maxAttachmentSize) || 5,
      defaultPriority: typeForm.defaultPriority as ActivityType['defaultPriority'], isHolidayType: typeForm.isHolidayType,
      affectsAttendance: typeForm.affectsAttendance, countAsWorkingDay: typeForm.countAsWorkingDay, visibleToParents: typeForm.visibleToParents,
      visibleToStudents: typeForm.visibleToStudents, updatedAt: new Date()
    } : t));
    if (oldCategory !== typeForm.category) {
      setCategories((p) => p.map((c) => c.name === oldCategory ? { ...c, typesCount: c.typesCount - 1 } : c.name === typeForm.category ? { ...c, typesCount: c.typesCount + 1 } : c));
    }
    resetTypeForm();
    setShowTypeModal(false);
    alert('Activity type updated successfully!');
  }, [editingType, typeForm, resetTypeForm]);

  const handleDeleteType = useCallback((id: string) => {
    const type = activityTypes.find((t) => t.id === id);
    if (!type || !window.confirm(`Delete "${type.name}"?`)) return;
    setActivityTypes((p) => p.filter((t) => t.id !== id));
    setCategories((p) => p.map((c) => c.name === type.category ? { ...c, typesCount: c.typesCount - 1 } : c));
    alert('Activity type deleted!');
  }, [activityTypes]);

  const handleToggleStatus = useCallback((id: string) => {
    setActivityTypes((p) => p.map((t) => t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date() } : t));
  }, []);

  const handleDuplicateType = useCallback((type: ActivityType) => {
    const newType: ActivityType = { ...type, id: `type-${Date.now()}`, name: `${type.name} (Copy)`, code: `${type.code}-COPY`, usageCount: 0, createdAt: new Date(), updatedAt: new Date(), sortOrder: activityTypes.length + 1 };
    setActivityTypes((p) => [...p, newType]);
    setCategories((p) => p.map((c) => c.name === type.category ? { ...c, typesCount: c.typesCount + 1 } : c));
    alert('Activity type duplicated!');
  }, [activityTypes.length]);

  const handleEditType = useCallback((type: ActivityType) => {
    setEditingType(type);
    setTypeForm({
      name: type.name, code: type.code, description: type.description, category: type.category, color: type.color, status: type.status,
      requiresApproval: type.requiresApproval, allowRegistration: type.allowRegistration, maxParticipants: type.maxParticipants?.toString() || '',
      minParticipants: type.minParticipants?.toString() || '', requiresLocation: type.requiresLocation, defaultLocation: type.defaultLocation,
      requiresBudget: type.requiresBudget, defaultDuration: type.defaultDuration.toString(), durationUnit: type.durationUnit, allowRecurring: type.allowRecurring,
      targetAudience: type.targetAudience, requiresAttachment: type.requiresAttachment, maxAttachmentSize: type.maxAttachmentSize.toString(),
      defaultPriority: type.defaultPriority, isHolidayType: type.isHolidayType, affectsAttendance: type.affectsAttendance, countAsWorkingDay: type.countAsWorkingDay,
      visibleToParents: type.visibleToParents, visibleToStudents: type.visibleToStudents
    });
    setShowTypeModal(true);
  }, []);

  const handleViewDetail = useCallback((type: ActivityType) => {setSelectedType(type);setShowDetailModal(true);}, []);

  const handleCreateCategory = useCallback(() => {
    if (!categoryForm.name) {alert('Please enter category name');return;}
    const newCategory: Category = { id: `cat-${Date.now()}`, name: categoryForm.name, description: categoryForm.description, color: categoryForm.color, icon: categoryForm.icon, status: categoryForm.status as Category['status'], typesCount: 0 };
    setCategories((p) => [...p, newCategory]);
    resetCategoryForm();
    setShowCategoryModal(false);
    alert('Category created successfully!');
  }, [categoryForm, resetCategoryForm]);

  const handleUpdateCategory = useCallback(() => {
    if (!editingCategory || !categoryForm.name) {alert('Please enter category name');return;}
    const oldName = editingCategory.name;
    setCategories((p) => p.map((c) => c.id === editingCategory.id ? { ...c, name: categoryForm.name, description: categoryForm.description, color: categoryForm.color, icon: categoryForm.icon, status: categoryForm.status as Category['status'] } : c));
    if (oldName !== categoryForm.name) {
      setActivityTypes((p) => p.map((t) => t.category === oldName ? { ...t, category: categoryForm.name } : t));
    }
    resetCategoryForm();
    setShowCategoryModal(false);
    alert('Category updated successfully!');
  }, [editingCategory, categoryForm, resetCategoryForm]);

  const handleDeleteCategory = useCallback((id: string) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    if (category.typesCount > 0) {alert('Cannot delete category with existing types');return;}
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    setCategories((p) => p.filter((c) => c.id !== id));
    alert('Category deleted!');
  }, [categories]);

  const handleEditCategory = useCallback((category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description, color: category.color, icon: category.icon, status: category.status });
    setShowCategoryModal(true);
  }, []);

  const toggleAudience = useCallback((audience: string) => {
    setTypeForm((p) => ({ ...p, targetAudience: p.targetAudience.includes(audience) ? p.targetAudience.filter((a) => a !== audience) : [...p.targetAudience, audience] }));
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'outline'> = { Active: 'success', Inactive: 'warning', Deprecated: 'danger' };
    return variants[status] || 'outline';
  };

  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const hasActiveFilters = filters.search || filters.categoryFilter !== 'all' || filters.statusFilter !== 'all' || filters.approvalFilter !== 'all';

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Types & Settings</h1>
          <p className="text-sm text-gray-500">Configure categories and rules for different activities</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'types' && <Button variant="primary" onClick={() => {resetTypeForm();setShowTypeModal(true);}}><PlusIcon className="w-4 h-4 mr-2" />Add Type</Button>}
          {activeTab === 'categories' && <Button variant="primary" onClick={() => {resetCategoryForm();setShowCategoryModal(true);}}><PlusIcon className="w-4 h-4 mr-2" />Add Category</Button>}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><div className="p-3"><p className="text-2xl font-bold text-gray-900">{stats.totalTypes}</p><p className="text-xs text-gray-500">Total Types</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-green-600">{stats.activeTypes}</p><p className="text-xs text-gray-500">Active Types</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-orange-500">{stats.typesRequiringApproval}</p><p className="text-xs text-gray-500">Need Approval</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-purple-600">{stats.totalCategories}</p><p className="text-xs text-gray-500">Categories</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-blue-600">{stats.activeCategories}</p><p className="text-xs text-gray-500">Active Categories</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p><p className="text-xs text-gray-500">Total Usage</p></div></Card>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-4">
          {[{ id: 'types', label: 'Activity Types', icon: ListIcon }, { id: 'categories', label: 'Categories', icon: FolderIcon }, { id: 'settings', label: 'Global Settings', icon: SettingsIcon }].map((tab) =>
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center py-3 px-1 border-b-2 text-sm font-medium ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <tab.icon className="w-4 h-4 mr-1" />{tab.label}
            </button>
          )}
        </nav>
      </div>

      {/* Activity Types Tab */}
      {activeTab === 'types' &&
      <Card>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search types..." className="pl-10" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} />
              </div>
              <Select options={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c.name, label: c.name }))]} value={filters.categoryFilter} onChange={(e) => updateFilter('categoryFilter', e.target.value)} />
              <Select options={[{ value: 'all', label: 'All Status' }, { value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={filters.statusFilter} onChange={(e) => updateFilter('statusFilter', e.target.value)} />
              <Select options={[{ value: 'all', label: 'All Approval' }, { value: 'yes', label: 'Requires Approval' }, { value: 'no', label: 'No Approval' }]} value={filters.approvalFilter} onChange={(e) => updateFilter('approvalFilter', e.target.value)} />
              {hasActiveFilters && <Button variant="outline" size="sm" onClick={clearFilters}><XIcon className="w-4 h-4" /></Button>}
            </div>

            <div className="text-sm text-gray-500">Showing {filteredTypes.length} of {activityTypes.length} types</div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Type Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Approval</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Registration</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Audience</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Usage</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.length === 0 ?
                <tr><td colSpan={9} className="py-12 text-center text-gray-500"><TagIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No activity types found</p></td></tr> :
                filteredTypes.map((type) => {
                  const isExpanded = expandedTypes.has(type.id);
                  return (
                    <React.Fragment key={type.id}>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setExpandedTypes((p) => {const n = new Set(p);isExpanded ? n.delete(type.id) : n.add(type.id);return n;})}>
                                {isExpanded ? <ChevronUpIcon className="w-4 h-4 text-gray-400" /> : <ChevronDownIcon className="w-4 h-4 text-gray-400" />}
                              </button>
                              <div className={`w-3 h-3 rounded ${type.color}`} />
                              <div>
                                <p className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleViewDetail(type)}>{type.name}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{type.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{type.code}</code></td>
                          <td className="py-3 px-4"><Badge variant="outline">{type.category}</Badge></td>
                          <td className="py-3 px-4">{type.requiresApproval ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <XIcon className="w-4 h-4 text-gray-300" />}</td>
                          <td className="py-3 px-4">{type.allowRegistration ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <XIcon className="w-4 h-4 text-gray-300" />}</td>
                          <td className="py-3 px-4"><span className="text-xs">{type.targetAudience.slice(0, 2).join(', ')}{type.targetAudience.length > 2 && `+${type.targetAudience.length - 2}`}</span></td>
                          <td className="py-3 px-4"><span className="font-medium">{type.usageCount}</span></td>
                          <td className="py-3 px-4"><Badge variant={getStatusBadge(type.status)}>{type.status}</Badge></td>
                          <td className="py-3 px-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetail(type)} title="View"><EyeIcon className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditType(type)} title="Edit"><EditIcon className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(type.id)} title="Toggle Status">{type.status === 'Active' ? <ToggleRightIcon className="w-4 h-4 text-green-500" /> : <ToggleLeftIcon className="w-4 h-4 text-gray-400" />}</Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDuplicateType(type)} title="Duplicate"><CopyIcon className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteType(type.id)} title="Delete"><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded &&
                      <tr><td colSpan={9} className="bg-gray-50 px-8 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{type.defaultDuration} {type.durationUnit}</span></div>
                              <div><span className="text-gray-500">Location:</span> <span className="font-medium">{type.defaultLocation || 'Not set'}</span></div>
                              <div><span className="text-gray-500">Priority:</span> <span className="font-medium">{type.defaultPriority}</span></div>
                              <div><span className="text-gray-500">Recurring:</span> <span className="font-medium">{type.allowRecurring ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Max Participants:</span> <span className="font-medium">{type.maxParticipants || 'Unlimited'}</span></div>
                              <div><span className="text-gray-500">Requires Budget:</span> <span className="font-medium">{type.requiresBudget ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Affects Attendance:</span> <span className="font-medium">{type.affectsAttendance ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Holiday Type:</span> <span className="font-medium">{type.isHolidayType ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Visible to Parents:</span> <span className="font-medium">{type.visibleToParents ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Visible to Students:</span> <span className="font-medium">{type.visibleToStudents ? 'Yes' : 'No'}</span></div>
                              <div><span className="text-gray-500">Created:</span> <span className="font-medium">{formatDate(type.createdAt)}</span></div>
                              <div><span className="text-gray-500">Updated:</span> <span className="font-medium">{formatDate(type.updatedAt)}</span></div>
                            </div>
                            {type.approvalLevels.length > 0 &&
                          <div className="mt-3"><span className="text-gray-500">Approval Levels:</span> <span className="font-medium">{type.approvalLevels.map((l) => l.role).join(' → ')}</span></div>
                          }
                          </td></tr>
                      }
                      </React.Fragment>);

                })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      }

      {/* Categories Tab */}
      {activeTab === 'categories' &&
      <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) =>
          <div key={category.id} className={`p-4 rounded-lg border-l-4 bg-gray-50 ${category.status === 'Inactive' ? 'opacity-60' : ''}`} style={{ borderLeftColor: category.color.replace('bg-', '').replace('-500', '') }}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color} text-white`}><TagIcon className="w-4 h-4" /></div>
                    <div><h3 className="font-semibold">{category.name}</h3><p className="text-xs text-gray-500">{category.typesCount} types</p></div>
                  </div>
                  <Badge variant={getStatusBadge(category.status)}>{category.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}><EditIcon className="w-3 h-3 mr-1" />Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteCategory(category.id)} disabled={category.typesCount > 0}><TrashIcon className="w-3 h-3 mr-1" />Delete</Button>
                </div>
              </div>
          )}
          </div>
        </Card>
      }

      {/* Global Settings Tab */}
      {activeTab === 'settings' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Default Settings">
            <div className="space-y-4">
              {[{ label: 'Default Activity Duration', value: '1 hour' }, { label: 'Default Priority', value: 'Normal' }, { label: 'Max Attachment Size', value: '10 MB' }, { label: 'Reminder Before Event', value: '1 day' }].map((setting, i) =>
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium text-sm">{setting.label}</span><span className="text-sm text-gray-600">{setting.value}</span></div>
            )}
            </div>
          </Card>
          <Card title="Notification Channels">
            <div className="space-y-4">
              {CHANNELS.map((channel) =>
            <div key={channel} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium text-sm">{channel}</span><Badge variant="success">Enabled</Badge></div>
            )}
            </div>
          </Card>
          <Card title="Approval Workflow">
            <div className="space-y-4">
              {ROLES.map((role, i) =>
            <div key={role} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium text-sm">Level {i + 1}: {role}</span><Badge variant="outline">Configured</Badge></div>
            )}
            </div>
          </Card>
          <Card title="Visibility Rules">
            <div className="space-y-4">
              {[{ label: 'Show to Parents by Default', value: true }, { label: 'Show to Students by Default', value: true }, { label: 'Public Calendar Access', value: false }, { label: 'Allow External Registrations', value: false }].map((rule, i) =>
            <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"><span className="font-medium text-sm">{rule.label}</span><Badge variant={rule.value ? 'success' : 'outline'}>{rule.value ? 'Yes' : 'No'}</Badge></div>
            )}
            </div>
          </Card>
        </div>
      }

      {/* Type Modal */}
      {showTypeModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">{editingType ? 'Edit Activity Type' : 'New Activity Type'}</h2>
                <Button variant="ghost" onClick={() => {setShowTypeModal(false);resetTypeForm();}}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Type Name" placeholder="e.g., Field Trip" value={typeForm.name} onChange={(e) => setTypeForm((p) => ({ ...p, name: e.target.value }))} required />
                  <Input label="Code" placeholder="e.g., FIELD-TRIP" value={typeForm.code} onChange={(e) => setTypeForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} />
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={2} value={typeForm.description} onChange={(e) => setTypeForm((p) => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <Select label="Category" options={[{ value: '', label: 'Select Category' }, ...categories.map((c) => ({ value: c.name, label: c.name }))]} value={typeForm.category} onChange={(e) => setTypeForm((p) => ({ ...p, category: e.target.value }))} />
                  <Select label="Status" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={typeForm.status} onChange={(e) => setTypeForm((p) => ({ ...p, status: e.target.value }))} />
                  <Select label="Default Priority" options={[{ value: 'Low', label: 'Low' }, { value: 'Normal', label: 'Normal' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} value={typeForm.defaultPriority} onChange={(e) => setTypeForm((p) => ({ ...p, defaultPriority: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Default Duration" type="number" min="1" value={typeForm.defaultDuration} onChange={(e) => setTypeForm((p) => ({ ...p, defaultDuration: e.target.value }))} />
                  <Select label="Duration Unit" options={[{ value: 'minutes', label: 'Minutes' }, { value: 'hours', label: 'Hours' }, { value: 'days', label: 'Days' }]} value={typeForm.durationUnit} onChange={(e) => setTypeForm((p) => ({ ...p, durationUnit: e.target.value }))} />
                  <Input label="Default Location" placeholder="e.g., Auditorium" value={typeForm.defaultLocation} onChange={(e) => setTypeForm((p) => ({ ...p, defaultLocation: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">{COLORS.map((color) =>
                  <button key={color} onClick={() => setTypeForm((p) => ({ ...p, color }))} className={`w-8 h-8 rounded-full ${color} ${typeForm.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} />
                  )}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                  <div className="flex flex-wrap gap-2">{AUDIENCES.map((audience) =>
                  <button key={audience} onClick={() => toggleAudience(audience)} className={`px-3 py-1 rounded-full text-sm border ${typeForm.targetAudience.includes(audience) ? 'bg-blue-100 border-blue-300 text-blue-800' : 'bg-white border-gray-300 text-gray-600'}`}>{audience}</button>
                  )}</div>
                </div>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    {[{ key: 'requiresApproval', label: 'Requires Approval' }, { key: 'allowRegistration', label: 'Allow Registration' }, { key: 'requiresLocation', label: 'Requires Location' }, { key: 'requiresBudget', label: 'Requires Budget' }, { key: 'allowRecurring', label: 'Allow Recurring' }].map((opt) =>
                  <label key={opt.key} className="flex items-center gap-2"><input type="checkbox" checked={(typeForm as any)[opt.key]} onChange={(e) => setTypeForm((p) => ({ ...p, [opt.key]: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">{opt.label}</span></label>
                  )}
                  </div>
                  <div className="space-y-2">
                    {[{ key: 'requiresAttachment', label: 'Requires Attachment' }, { key: 'isHolidayType', label: 'Is Holiday Type' }, { key: 'affectsAttendance', label: 'Affects Attendance' }, { key: 'visibleToParents', label: 'Visible to Parents' }, { key: 'visibleToStudents', label: 'Visible to Students' }].map((opt) =>
                  <label key={opt.key} className="flex items-center gap-2"><input type="checkbox" checked={(typeForm as any)[opt.key]} onChange={(e) => setTypeForm((p) => ({ ...p, [opt.key]: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">{opt.label}</span></label>
                  )}
                  </div>
                </div>
                {typeForm.allowRegistration &&
              <div className="grid grid-cols-2 gap-4">
                    <Input label="Max Participants" type="number" min="0" placeholder="Leave empty for unlimited" value={typeForm.maxParticipants} onChange={(e) => setTypeForm((p) => ({ ...p, maxParticipants: e.target.value }))} />
                    <Input label="Min Participants" type="number" min="0" value={typeForm.minParticipants} onChange={(e) => setTypeForm((p) => ({ ...p, minParticipants: e.target.value }))} />
                  </div>
              }
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => {setShowTypeModal(false);resetTypeForm();}}>Cancel</Button>
                  <Button variant="primary" onClick={editingType ? handleUpdateType : handleCreateType}>{editingType ? 'Update' : 'Create'} Type</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Category Modal */}
      {showCategoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
                <Button variant="ghost" onClick={() => {setShowCategoryModal(false);resetCategoryForm();}}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                <Input label="Category Name" placeholder="e.g., Sports" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} required />
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={2} value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} /></div>
                <Select label="Status" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={categoryForm.status} onChange={(e) => setCategoryForm((p) => ({ ...p, status: e.target.value }))} />
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Color</label><div className="flex flex-wrap gap-2">{COLORS.map((color) => <button key={color} onClick={() => setCategoryForm((p) => ({ ...p, color }))} className={`w-8 h-8 rounded-full ${color} ${categoryForm.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`} />)}</div></div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => {setShowCategoryModal(false);resetCategoryForm();}}>Cancel</Button>
                  <Button variant="primary" onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>{editingCategory ? 'Update' : 'Create'} Category</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal && selectedType &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 mb-2"><div className={`w-4 h-4 rounded ${selectedType.color}`} /><Badge variant={getStatusBadge(selectedType.status)}>{selectedType.status}</Badge><Badge variant="outline">{selectedType.category}</Badge></div>
                  <h2 className="text-xl font-bold">{selectedType.name}</h2><p className="text-sm text-gray-500">{selectedType.code}</p>
                </div>
                <Button variant="ghost" onClick={() => setShowDetailModal(false)}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedType.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Duration</p><p className="font-medium">{selectedType.defaultDuration} {selectedType.durationUnit}</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Location</p><p className="font-medium">{selectedType.defaultLocation || 'Not set'}</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Priority</p><p className="font-medium">{selectedType.defaultPriority}</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Usage Count</p><p className="font-medium">{selectedType.usageCount}</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Created</p><p className="font-medium">{formatDate(selectedType.createdAt)}</p></div>
                  <div className="p-3 bg-gray-50 rounded-lg"><p className="text-gray-500">Updated</p><p className="font-medium">{formatDate(selectedType.updatedAt)}</p></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Configuration</h4>
                  <div className="flex flex-wrap gap-2">
                    {[{ key: 'requiresApproval', label: 'Approval Required' }, { key: 'allowRegistration', label: 'Registration' }, { key: 'requiresLocation', label: 'Location Required' }, { key: 'requiresBudget', label: 'Budget Required' }, { key: 'allowRecurring', label: 'Recurring' }, { key: 'isHolidayType', label: 'Holiday Type' }, { key: 'affectsAttendance', label: 'Affects Attendance' }, { key: 'visibleToParents', label: 'Parent Visible' }, { key: 'visibleToStudents', label: 'Student Visible' }].map((opt) =>
                  <Badge key={opt.key} variant={(selectedType as any)[opt.key] ? 'success' : 'outline'}>{(selectedType as any)[opt.key] ? '✓' : '✗'} {opt.label}</Badge>
                  )}
                  </div>
                </div>
                <div><h4 className="font-medium mb-2">Target Audience</h4><div className="flex flex-wrap gap-1">{selectedType.targetAudience.map((a) => <Badge key={a} variant="info">{a}</Badge>)}</div></div>
                {selectedType.approvalLevels.length > 0 && <div><h4 className="font-medium mb-2">Approval Workflow</h4><div className="flex flex-wrap gap-2">{selectedType.approvalLevels.map((l, i) => <Badge key={i} variant="outline">Level {l.level}: {l.role}</Badge>)}</div></div>}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
                  <Button variant="outline" onClick={() => {setShowDetailModal(false);handleEditType(selectedType);}}><EditIcon className="w-4 h-4 mr-2" />Edit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}