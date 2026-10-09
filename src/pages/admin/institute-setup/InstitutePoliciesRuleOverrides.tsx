import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit2, Shield, Trash2, AlertTriangle, Eye, ChevronDown, ChevronUp,
  Check, X, Copy, Search, ArrowUpDown, GripVertical, Play, Save,
  Archive, History, RefreshCw, Users, Building, BookOpen, AlertCircle,
  Clock, Calendar, Layers, Settings, FileText, Download, Upload, RotateCcw,
  Maximize2, Minimize2, CheckCircle, Info } from
'lucide-react';

// ==================== TYPES ====================
interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  valueTo?: string;
  valueType: 'text' | 'number' | 'date' | 'select';
}

interface ConditionGroup {
  id: string;
  logic: 'AND' | 'OR';
  conditions: Condition[];
  groups: ConditionGroup[];
}

interface Override {
  id: string;
  name: string;
  description: string;
  conditions: ConditionGroup;
  action: string;
  actionParams: Record<string, string>;
  priority: number;
  enabled: boolean;
}

interface PolicyAction {
  id: string;
  type: string;
  params: Record<string, string>;
  order: number;
}

interface Exception {
  id: string;
  type: 'student' | 'staff' | 'class';
  entityId: string;
  entityName: string;
  reason: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'pending';
  createdBy: string;
  createdAt: string;
}

interface PolicyVersion {
  id: string;
  version: number;
  timestamp: string;
  changes: string;
  changedBy: string;
  snapshot: Policy;
}

interface ScopeSelection {
  type: 'all' | 'classes' | 'sections' | 'departments' | 'roles' | 'students' | 'custom';
  selectedIds: string[];
  excludedIds: string[];
}

interface Policy {
  id: string;
  name: string;
  description: string;
  category: string;
  effectiveDate: string;
  expiryDate: string;
  priority: number;
  status: 'active' | 'inactive' | 'archived' | 'draft';
  scope: ScopeSelection;
  conditions: ConditionGroup;
  overrides: Override[];
  actions: PolicyAction[];
  exceptions: Exception[];
  lastModified: string;
  createdAt: string;
  createdBy: string;
  tags: string[];
  notes: string;
}

interface SimulationInput {
  entityType: 'student' | 'staff';
  entityId: string;
  entityName: string;
  data: Record<string, string | number>;
}

interface SimulationResult {
  policyId: string;
  matched: boolean;
  matchedConditions: string[];
  triggeredActions: string[];
  appliedOverrides: string[];
  appliedExceptions: string[];
  explanation: string;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// ==================== CONSTANTS ====================
const categories = ['Attendance', 'Grading', 'Fee Management', 'Discipline', 'Admission', 'Leave Management', 'Library', 'Custom'];

const conditionFields = [
{ value: 'attendance_percentage', label: 'Attendance %', type: 'number', options: [] as string[] },
{ value: 'marks', label: 'Marks', type: 'number', options: [] as string[] },
{ value: 'fee_due', label: 'Fee Due Amount', type: 'number', options: [] as string[] },
{ value: 'behavior_points', label: 'Behavior Points', type: 'number', options: [] as string[] },
{ value: 'medical_leave', label: 'Medical Leave Days', type: 'number', options: [] as string[] },
{ value: 'late_submissions', label: 'Late Submissions', type: 'number', options: [] as string[] },
{ value: 'class', label: 'Class', type: 'select', options: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'] },
{ value: 'section', label: 'Section', type: 'select', options: ['A', 'B', 'C', 'D'] },
{ value: 'category', label: 'Category', type: 'select', options: ['General', 'SC', 'ST', 'OBC', 'EWS'] },
{ value: 'scholarship', label: 'Scholarship', type: 'select', options: ['None', 'Partial', 'Full'] }];


const operators = [
{ value: 'equals', label: 'Equals', types: ['text', 'number', 'select', 'date'] },
{ value: 'not_equals', label: 'Not Equals', types: ['text', 'number', 'select', 'date'] },
{ value: 'greater_than', label: 'Greater Than', types: ['number', 'date'] },
{ value: 'less_than', label: 'Less Than', types: ['number', 'date'] },
{ value: 'between', label: 'Between', types: ['number', 'date'] },
{ value: 'contains', label: 'Contains', types: ['text'] },
{ value: 'is_empty', label: 'Is Empty', types: ['text', 'number', 'select'] },
{ value: 'is_not_empty', label: 'Is Not Empty', types: ['text', 'number', 'select'] }];


const actionTypes = [
{ value: 'send_notification', label: 'Send Notification', params: ['recipient', 'message'] },
{ value: 'send_email', label: 'Send Email', params: ['recipient', 'subject', 'message'] },
{ value: 'restrict_access', label: 'Restrict Access', params: ['resource', 'duration'] },
{ value: 'add_fine', label: 'Add Fine', params: ['amount', 'description'] },
{ value: 'deduct_marks', label: 'Deduct Marks', params: ['percentage', 'reason'] },
{ value: 'generate_warning', label: 'Generate Warning', params: ['severity', 'message'] },
{ value: 'escalate', label: 'Escalate', params: ['authority', 'reason'] },
{ value: 'block_promotion', label: 'Block Promotion', params: ['reason'] }];


const overrideActions = [
{ value: 'allow', label: 'Allow (Skip Policy)' },
{ value: 'block', label: 'Block (Force Apply)' },
{ value: 'modify', label: 'Modify Rule' },
{ value: 'escalate', label: 'Escalate Instead' },
{ value: 'notify', label: 'Notify Only' }];


const scopeOptions = [
{ value: 'all', label: 'Entire Institute', icon: Building },
{ value: 'classes', label: 'Specific Classes', icon: BookOpen },
{ value: 'sections', label: 'Sections', icon: Layers },
{ value: 'departments', label: 'Departments', icon: Building },
{ value: 'students', label: 'Students', icon: Users },
{ value: 'custom', label: 'Custom Groups', icon: Settings }];


const mockClasses = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
const mockSections = ['Section A', 'Section B', 'Section C', 'Section D'];
const mockDepartments = ['Science', 'Arts', 'Commerce', 'Sports', 'Admin'];
const mockStudents = [
{ id: 's1', name: 'John Doe', class: 'Class 10', section: 'A' },
{ id: 's2', name: 'Jane Smith', class: 'Class 10', section: 'B' },
{ id: 's3', name: 'Mike Johnson', class: 'Class 9', section: 'A' },
{ id: 's4', name: 'Sarah Williams', class: 'Class 11', section: 'C' }];

const mockStaff = [
{ id: 'st1', name: 'Dr. Robert Wilson', role: 'Teacher' },
{ id: 'st2', name: 'Mrs. Patricia Taylor', role: 'Admin' }];

const mockCustomGroups = [
{ id: 'cg1', name: 'Sports Team', count: 45 },
{ id: 'cg2', name: 'Scholarship Recipients', count: 120 }];


// ==================== HELPERS ====================
const genId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const createConditionGroup = (): ConditionGroup => ({
  id: genId('cg'),
  logic: 'AND',
  conditions: [],
  groups: []
});

const createCondition = (): Condition => ({
  id: genId('c'),
  field: '',
  operator: 'equals',
  value: '',
  valueTo: '',
  valueType: 'text'
});

const createOverride = (priority: number): Override => ({
  id: genId('o'),
  name: '',
  description: '',
  conditions: createConditionGroup(),
  action: '',
  actionParams: {},
  priority,
  enabled: true
});

const createAction = (order: number): PolicyAction => ({
  id: genId('a'),
  type: '',
  params: {},
  order
});

const createException = (): Exception => ({
  id: genId('e'),
  type: 'student',
  entityId: '',
  entityName: '',
  reason: '',
  validFrom: new Date().toISOString().split('T')[0],
  validTo: '',
  status: 'active',
  createdBy: 'Current User',
  createdAt: new Date().toISOString()
});

const createPolicy = (): Policy => ({
  id: genId('p'),
  name: '',
  description: '',
  category: '',
  effectiveDate: new Date().toISOString().split('T')[0],
  expiryDate: '',
  priority: 1,
  status: 'draft',
  scope: { type: 'all', selectedIds: [], excludedIds: [] },
  conditions: createConditionGroup(),
  overrides: [],
  actions: [],
  exceptions: [],
  lastModified: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  createdBy: 'Current User',
  tags: [],
  notes: ''
});

// ==================== UI COMPONENTS ====================
const Card: React.FC<{children: React.ReactNode;className?: string;}> = ({ children, className = '' }) =>
<div className={`bg-white rounded-lg shadow border ${className}`}>{children}</div>;


const Badge: React.FC<{children: React.ReactNode;variant?: 'success' | 'warning' | 'error' | 'info' | 'default';}> = ({ children, variant = 'default' }) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[variant]}`}>{children}</span>;
};

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}> = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', type = 'button' }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>

      {children}
    </button>);

};

// ==================== INITIAL DATA ====================
const initialPolicies: Policy[] = [
{
  id: 'p1',
  name: 'Minimum Attendance Requirement',
  description: 'Students must maintain minimum 75% attendance to be eligible for exams',
  category: 'Attendance',
  effectiveDate: '2024-01-01',
  expiryDate: '2024-12-31',
  priority: 1,
  status: 'active',
  scope: { type: 'all', selectedIds: [], excludedIds: [] },
  conditions: {
    id: 'cg1',
    logic: 'AND',
    conditions: [{ id: 'c1', field: 'attendance_percentage', operator: 'less_than', value: '75', valueType: 'number' }],
    groups: []
  },
  overrides: [{
    id: 'o1',
    name: 'Medical Leave Override',
    description: 'Students with medical leave > 10 days exempted',
    conditions: {
      id: 'cg2',
      logic: 'AND',
      conditions: [{ id: 'c2', field: 'medical_leave', operator: 'greater_than', value: '10', valueType: 'number' }],
      groups: []
    },
    action: 'allow',
    actionParams: {},
    priority: 1,
    enabled: true
  }],
  actions: [
  { id: 'a1', type: 'restrict_access', params: { resource: 'Exam Portal', duration: 'Until resolved' }, order: 1 },
  { id: 'a2', type: 'send_notification', params: { recipient: 'parent', message: 'Low attendance warning' }, order: 2 }],

  exceptions: [{
    id: 'e1',
    type: 'student',
    entityId: 's1',
    entityName: 'John Doe',
    reason: 'Sports representation',
    validFrom: '2024-01-01',
    validTo: '2024-06-30',
    status: 'active',
    createdBy: 'Admin',
    createdAt: '2024-01-01'
  }],
  lastModified: '2024-01-15T10:30:00Z',
  createdAt: '2024-01-01',
  createdBy: 'Admin',
  tags: ['attendance', 'exam'],
  notes: ''
},
{
  id: 'p2',
  name: 'Late Fee Policy',
  description: 'Apply late fee for delayed payment',
  category: 'Fee Management',
  effectiveDate: '2024-01-01',
  expiryDate: '',
  priority: 2,
  status: 'active',
  scope: { type: 'classes', selectedIds: ['Class 9', 'Class 10', 'Class 11', 'Class 12'], excludedIds: [] },
  conditions: {
    id: 'cg3',
    logic: 'AND',
    conditions: [{ id: 'c3', field: 'fee_due', operator: 'greater_than', value: '0', valueType: 'number' }],
    groups: []
  },
  overrides: [],
  actions: [{ id: 'a3', type: 'add_fine', params: { amount: '500', description: 'Late fee' }, order: 1 }],
  exceptions: [],
  lastModified: '2024-01-10',
  createdAt: '2024-01-01',
  createdBy: 'Accounts',
  tags: ['fee'],
  notes: ''
},
{
  id: 'p3',
  name: 'Discipline Warning Policy',
  description: 'Issue warnings for low behavior points',
  category: 'Discipline',
  effectiveDate: '2024-02-01',
  expiryDate: '',
  priority: 3,
  status: 'inactive',
  scope: { type: 'all', selectedIds: [], excludedIds: [] },
  conditions: {
    id: 'cg4',
    logic: 'AND',
    conditions: [{ id: 'c4', field: 'behavior_points', operator: 'less_than', value: '50', valueType: 'number' }],
    groups: []
  },
  overrides: [],
  actions: [
  { id: 'a4', type: 'generate_warning', params: { severity: 'medium', message: 'Behavior improvement needed' }, order: 1 },
  { id: 'a5', type: 'escalate', params: { authority: 'Class Teacher', reason: 'Low behavior score' }, order: 2 }],

  exceptions: [],
  lastModified: '2024-02-01',
  createdAt: '2024-02-01',
  createdBy: 'Discipline Committee',
  tags: ['discipline'],
  notes: ''
}];


// ==================== MAIN COMPONENT ====================
export function InstitutePoliciesRuleOverrides() {
  // State
  const [policies, setPolicies] = useState<Policy[]>(initialPolicies);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit' | 'preview'>('list');
  const [draftPolicy, setDraftPolicy] = useState<Policy | null>(null);
  const [previewPolicy, setPreviewPolicy] = useState<Policy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'lastModified' | 'name'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [deletedPolicies, setDeletedPolicies] = useState<{policy: Policy;timestamp: number;}[]>([]);
  const [versionHistory, setVersionHistory] = useState<PolicyVersion[]>([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'scope' | 'conditions' | 'actions' | 'overrides' | 'exceptions'>('basic');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<PolicyVersion | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notifications
  const addNotification = useCallback((type: ToastNotification['type'], message: string) => {
    const notification: ToastNotification = { id: genId('n'), type, message };
    setNotifications((prev) => [...prev, notification]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== notification.id)), 4000);
  }, []);

  // Filter & Sort
  const filteredPolicies = policies.
  filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterCategory && p.category !== filterCategory) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  }).
  sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'priority') cmp = a.priority - b.priority;else
    if (sortBy === 'lastModified') cmp = new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();else
    cmp = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? cmp : -cmp;
  });

  // Validation
  const validatePolicy = useCallback((p: Policy): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!p.name.trim()) errors.name = 'Name required';
    if (!p.category) errors.category = 'Category required';
    if (!p.effectiveDate) errors.effectiveDate = 'Effective date required';
    if (p.expiryDate && p.expiryDate < p.effectiveDate) errors.expiryDate = 'Expiry must be after effective date';
    if (p.priority <= 0) errors.priority = 'Priority must be positive';
    if (p.conditions.conditions.length === 0 && p.conditions.groups.length === 0) errors.conditions = 'At least one condition required';
    if (p.actions.length === 0) errors.actions = 'At least one action required';
    const duplicate = policies.find((x) => x.id !== p.id && x.priority === p.priority && x.status === 'active');
    if (duplicate && p.status === 'active') errors.priority = `Priority used by "${duplicate.name}"`;
    return errors;
  }, [policies]);

  // Update draft
  const updateDraft = useCallback((updates: Partial<Policy>) => {
    setDraftPolicy((prev) => prev ? { ...prev, ...updates } : null);
    setHasUnsavedChanges(true);
    Object.keys(updates).forEach((key) => {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    });
  }, []);

  // Policy CRUD
  const handleCreatePolicy = () => {
    const newPolicy = createPolicy();
    newPolicy.priority = Math.max(...policies.map((p) => p.priority), 0) + 1;
    setDraftPolicy(newPolicy);
    setCurrentView('create');
    setHasUnsavedChanges(false);
    setValidationErrors({});
    setVersionHistory([]);
    setActiveTab('basic');
  };

  const handleEditPolicy = (policy: Policy) => {
    setDraftPolicy(JSON.parse(JSON.stringify(policy)));
    setCurrentView('edit');
    setHasUnsavedChanges(false);
    setValidationErrors({});
    setActiveTab('basic');
    setVersionHistory([{
      id: genId('v'),
      version: 1,
      timestamp: new Date().toISOString(),
      changes: 'Before edit',
      changedBy: 'User',
      snapshot: JSON.parse(JSON.stringify(policy))
    }]);
  };

  const handlePreviewPolicy = (policy: Policy) => {
    setPreviewPolicy(policy);
    setCurrentView('preview');
  };

  const handleSavePolicy = () => {
    if (!draftPolicy) return;
    const errors = validatePolicy(draftPolicy);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      addNotification('error', `Fix ${Object.keys(errors).length} error(s)`);
      return;
    }
    const updatedPolicy: Policy = {
      ...draftPolicy,
      status: draftPolicy.status === 'draft' ? 'inactive' : draftPolicy.status,
      lastModified: new Date().toISOString()
    };
    if (currentView === 'create') {
      setPolicies((prev) => [...prev, updatedPolicy]);
      addNotification('success', `Policy "${updatedPolicy.name}" created`);
    } else {
      setPolicies((prev) => prev.map((p) => p.id === updatedPolicy.id ? updatedPolicy : p));
      addNotification('success', `Policy "${updatedPolicy.name}" saved`);
    }
    setHasUnsavedChanges(false);
    setCurrentView('list');
    setDraftPolicy(null);
  };

  const handleCancelEdit = () => {
    if (hasUnsavedChanges && !window.confirm('Discard unsaved changes?')) return;
    setCurrentView('list');
    setDraftPolicy(null);
    setPreviewPolicy(null);
    setHasUnsavedChanges(false);
    setValidationErrors({});
    setSimulationResult(null);
  };

  const handleToggleStatus = (id: string) => {
    setPolicies((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const newStatus = p.status === 'active' ? 'inactive' : 'active';
      addNotification('info', `Policy "${p.name}" ${newStatus}`);
      return { ...p, status: newStatus, lastModified: new Date().toISOString() };
    }));
  };

  const handleDeletePolicy = (id: string) => {
    const policy = policies.find((p) => p.id === id);
    if (!policy) return;
    setDeletedPolicies((prev) => [...prev, { policy, timestamp: Date.now() }]);
    setPolicies((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteConfirm(null);
    addNotification('warning', `Deleted "${policy.name}". Undo available.`);
  };

  const handleUndoDelete = () => {
    if (deletedPolicies.length === 0) return;
    const last = deletedPolicies[deletedPolicies.length - 1];
    setPolicies((prev) => [...prev, last.policy]);
    setDeletedPolicies((prev) => prev.slice(0, -1));
    addNotification('success', `Restored "${last.policy.name}"`);
  };

  const handleArchivePolicy = (id: string) => {
    setPolicies((prev) => prev.map((p) =>
    p.id === id ? { ...p, status: 'archived' as const, lastModified: new Date().toISOString() } : p
    ));
    addNotification('info', 'Policy archived');
  };

  const handleDuplicatePolicy = (policy: Policy) => {
    const duplicated: Policy = {
      ...JSON.parse(JSON.stringify(policy)),
      id: genId('p'),
      name: `${policy.name} (Copy)`,
      status: 'draft',
      priority: Math.max(...policies.map((p) => p.priority), 0) + 1,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setPolicies((prev) => [...prev, duplicated]);
    addNotification('success', 'Policy duplicated');
  };

  const handleBulkAction = (action: 'enable' | 'disable' | 'delete' | 'archive') => {
    if (selectedPolicies.length === 0) {
      addNotification('warning', 'No policies selected');
      return;
    }
    if (action === 'delete') {
      setShowBulkDeleteConfirm(true);
      return;
    }
    const newStatus = action === 'enable' ? 'active' : action === 'disable' ? 'inactive' : 'archived';
    setPolicies((prev) => prev.map((p) =>
    selectedPolicies.includes(p.id) ? { ...p, status: newStatus as Policy['status'], lastModified: new Date().toISOString() } : p
    ));
    setSelectedPolicies([]);
    addNotification('info', `${selectedPolicies.length} policies ${action}d`);
  };

  const handleBulkDelete = () => {
    const toDelete = policies.filter((p) => selectedPolicies.includes(p.id));
    toDelete.forEach((p) => setDeletedPolicies((prev) => [...prev, { policy: p, timestamp: Date.now() }]));
    setPolicies((prev) => prev.filter((p) => !selectedPolicies.includes(p.id)));
    setSelectedPolicies([]);
    setShowBulkDeleteConfirm(false);
    addNotification('warning', `${toDelete.length} policies deleted`);
  };

  const handleSelectAll = () => {
    setSelectedPolicies(selectedPolicies.length === filteredPolicies.length ? [] : filteredPolicies.map((p) => p.id));
  };

  const handleRestoreVersion = (version: PolicyVersion) => {
    if (!window.confirm('Restore this version?')) return;
    setDraftPolicy(JSON.parse(JSON.stringify(version.snapshot)));
    setHasUnsavedChanges(true);
    setShowVersionHistory(false);
    addNotification('info', `Restored to version ${version.version}`);
  };

  const handleExportPolicies = (exportAll: boolean) => {
    const toExport = exportAll ? policies : policies.filter((p) => selectedPolicies.includes(p.id));
    const data = { exportDate: new Date().toISOString(), policies: toExport };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `policies_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    addNotification('success', `${toExport.length} policies exported`);
  };

  const handleImportPolicies = () => {
    setImportError('');
    try {
      const data = JSON.parse(importData);
      if (!data.policies?.length) throw new Error('Invalid format');
      let maxPriority = Math.max(...policies.map((p) => p.priority), 0);
      const imported: Policy[] = data.policies.map((p: Policy) => ({
        ...p,
        id: genId('p'),
        status: 'draft' as const,
        priority: ++maxPriority,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }));
      setPolicies((prev) => [...prev, ...imported]);
      setShowImportModal(false);
      setImportData('');
      addNotification('success', `${imported.length} policies imported`);
    } catch (error: any) {
      setImportError(error.message || 'Invalid JSON');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterCategory('');
    setFilterStatus('');
  };

  // Simulation
  const runSimulation = useCallback((input: SimulationInput, policy: Policy): SimulationResult => {
    const result: SimulationResult = {
      policyId: policy.id,
      matched: false,
      matchedConditions: [],
      triggeredActions: [],
      appliedOverrides: [],
      appliedExceptions: [],
      explanation: ''
    };

    // Check exceptions
    const exception = policy.exceptions.find((e) => e.status === 'active' && e.entityId === input.entityId);
    if (exception) {
      result.appliedExceptions.push(`${exception.entityName}: ${exception.reason}`);
      result.explanation = `Exempt: ${exception.reason}`;
      return result;
    }

    // Evaluate conditions
    const evaluateCondition = (condition: Condition): boolean => {
      const value = input.data[condition.field];
      if (value === undefined && !['is_empty', 'is_not_empty'].includes(condition.operator)) return false;
      switch (condition.operator) {
        case 'equals':return String(value) === condition.value;
        case 'not_equals':return String(value) !== condition.value;
        case 'greater_than':return Number(value) > Number(condition.value);
        case 'less_than':return Number(value) < Number(condition.value);
        case 'between':return Number(value) >= Number(condition.value) && Number(value) <= Number(condition.valueTo || condition.value);
        case 'contains':return String(value).toLowerCase().includes(condition.value.toLowerCase());
        case 'is_empty':return value === undefined || value === '';
        case 'is_not_empty':return value !== undefined && value !== '';
        default:return false;
      }
    };

    const evaluateGroup = (group: ConditionGroup): boolean => {
      const conditionResults = group.conditions.map(evaluateCondition);
      const groupResults = group.groups.map(evaluateGroup);
      const allResults = [...conditionResults, ...groupResults];
      if (allResults.length === 0) return true;
      return group.logic === 'AND' ? allResults.every((r) => r) : allResults.some((r) => r);
    };

    result.matched = evaluateGroup(policy.conditions);

    if (result.matched) {
      // Track matched conditions
      policy.conditions.conditions.filter((c) => evaluateCondition(c)).forEach((c) => {
        const field = conditionFields.find((f) => f.value === c.field);
        result.matchedConditions.push(`${field?.label || c.field} ${c.operator} ${c.value}`);
      });

      // Check overrides
      let overrideAction: string | null = null;
      policy.overrides.filter((o) => o.enabled).sort((a, b) => a.priority - b.priority).forEach((o) => {
        if (!overrideAction && evaluateGroup(o.conditions)) {
          result.appliedOverrides.push(`${o.name}: ${o.action}`);
          overrideAction = o.action;
        }
      });

      // Determine actions
      if (overrideAction !== 'allow') {
        policy.actions.sort((a, b) => a.order - b.order).forEach((a) => {
          const actionType = actionTypes.find((at) => at.value === a.type);
          result.triggeredActions.push(actionType?.label || a.type);
        });
      }

      result.explanation = overrideAction === 'allow' ?
      'Policy bypassed by override' :
      `${result.triggeredActions.length} action(s) triggered`;
    } else {
      result.explanation = 'Conditions not met';
    }

    return result;
  }, []);

  // Effects
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && draftPolicy) {
        e.preventDefault();
        handleSavePolicy();
      }
      if (e.key === 'Escape') {
        setShowDeleteConfirm(null);
        setShowBulkDeleteConfirm(false);
        setShowVersionHistory(false);
        setShowExportModal(false);
        setShowImportModal(false);
        setViewingVersion(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [draftPolicy]);

  useEffect(() => {
    const interval = setInterval(() => {
      const cutoff = Date.now() - 60000;
      setDeletedPolicies((prev) => prev.filter((d) => d.timestamp > cutoff));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // ==================== SUB-COMPONENTS ====================

  // Toast Notifications
  const NotificationToast = () =>
  <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((n) =>
    <div
      key={n.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${
      n.type === 'success' ? 'bg-green-600' :
      n.type === 'error' ? 'bg-red-600' :
      n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-600'}`
      }>

          {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {n.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {n.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {n.type === 'info' && <Info className="w-5 h-5" />}
          <span className="flex-1">{n.message}</span>
          {n.type === 'warning' && deletedPolicies.length > 0 &&
      <button onClick={handleUndoDelete} className="flex items-center gap-1 px-2 py-1 bg-white/20 rounded hover:bg-white/30">
              <RotateCcw className="w-4 h-4" /> Undo
            </button>
      }
          <button onClick={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}>
            <X className="w-4 h-4" />
          </button>
        </div>
    )}
    </div>;


  // Condition Builder
  const ConditionBuilder: React.FC<{
    group: ConditionGroup;
    onChange: (g: ConditionGroup) => void;
    level?: number;
    readOnly?: boolean;
  }> = ({ group, onChange, level = 0, readOnly = false }) => {
    const addCondition = () => onChange({ ...group, conditions: [...group.conditions, createCondition()] });
    const addGroup = () => onChange({ ...group, groups: [...group.groups, createConditionGroup()] });
    const updateCondition = (id: string, updates: Partial<Condition>) => {
      onChange({ ...group, conditions: group.conditions.map((c) => c.id === id ? { ...c, ...updates } : c) });
    };
    const removeCondition = (id: string) => onChange({ ...group, conditions: group.conditions.filter((c) => c.id !== id) });
    const updateNestedGroup = (id: string, g: ConditionGroup) => {
      onChange({ ...group, groups: group.groups.map((x) => x.id === id ? g : x) });
    };
    const removeNestedGroup = (id: string) => onChange({ ...group, groups: group.groups.filter((g) => g.id !== id) });
    const toggleLogic = () => onChange({ ...group, logic: group.logic === 'AND' ? 'OR' : 'AND' });
    const getOperators = (type: string) => operators.filter((o) => o.types.includes(type));
    const getOptions = (field: string) => conditionFields.find((f) => f.value === field)?.options || [];

    return (
      <div className={`p-4 rounded-lg ${level === 0 ? 'bg-blue-50' : 'bg-blue-100'} ${level > 0 ? 'ml-4 mt-2' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-600 text-white rounded font-bold text-sm">
            {level === 0 ? 'IF' : 'GROUP'}
          </span>
          {!readOnly ?
          <button
            onClick={toggleLogic}
            className={`px-3 py-1 rounded font-medium text-sm text-white ${group.logic === 'AND' ? 'bg-purple-600' : 'bg-orange-500'}`}>

              {group.logic}
            </button> :

          <span className={`px-3 py-1 rounded font-medium text-sm text-white ${group.logic === 'AND' ? 'bg-purple-600' : 'bg-orange-500'}`}>
              {group.logic}
            </span>
          }
          <span className="text-sm text-gray-600">conditions match</span>
        </div>

        {group.conditions.length === 0 && group.groups.length === 0 &&
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500 mb-3">
            No conditions defined
          </div>
        }

        {group.conditions.map((condition, index) => {
          const field = conditionFields.find((f) => f.value === condition.field);
          const fieldType = field?.type || 'text';
          const availableOperators = getOperators(fieldType);
          const options = getOptions(condition.field);

          return (
            <div key={condition.id} className="flex gap-2 mb-2 items-start flex-wrap">
              {index > 0 &&
              <span className={`text-sm font-medium w-12 pt-2 ${group.logic === 'AND' ? 'text-purple-600' : 'text-orange-600'}`}>
                  {group.logic}
                </span>
              }
              <div className="flex gap-2 flex-1 items-start flex-wrap">
                <select
                  value={condition.field}
                  onChange={(e) => {
                    const newField = conditionFields.find((f) => f.value === e.target.value);
                    const newType = newField?.type || 'text';
                    const validOps = getOperators(newType);
                    const newOperator = validOps.find((o) => o.value === condition.operator) ? condition.operator : validOps[0]?.value || 'equals';
                    updateCondition(condition.id, { field: e.target.value, valueType: newType as Condition['valueType'], operator: newOperator, value: '', valueTo: '' });
                  }}
                  className="flex-1 min-w-40 px-3 py-2 border rounded-lg bg-white"
                  disabled={readOnly}>

                  <option value="">Select Field</option>
                  {conditionFields.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>

                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                  className="w-40 px-3 py-2 border rounded-lg bg-white"
                  disabled={readOnly}>

                  {availableOperators.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>

                {!['is_empty', 'is_not_empty'].includes(condition.operator) && (
                fieldType === 'select' && options.length > 0 ?
                <select
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                  className="flex-1 min-w-32 px-3 py-2 border rounded-lg bg-white"
                  disabled={readOnly}>

                      <option value="">Select</option>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select> :

                <input
                  type={fieldType === 'number' ? 'number' : fieldType === 'date' ? 'date' : 'text'}
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                  className="flex-1 min-w-32 px-3 py-2 border rounded-lg"
                  placeholder={condition.operator === 'between' ? 'From' : 'Value'}
                  disabled={readOnly} />)


                }

                {condition.operator === 'between' &&
                <input
                  type={fieldType === 'number' ? 'number' : 'date'}
                  value={condition.valueTo || ''}
                  onChange={(e) => updateCondition(condition.id, { valueTo: e.target.value })}
                  className="flex-1 min-w-32 px-3 py-2 border rounded-lg"
                  placeholder="To"
                  disabled={readOnly} />

                }

                {!readOnly &&
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onChange({ ...group, conditions: [...group.conditions, { ...condition, id: genId('c') }] })}>
                      <Copy className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeCondition(condition.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                }
              </div>
            </div>);

        })}

        {group.groups.map((nestedGroup) =>
        <div key={nestedGroup.id} className="relative">
            {!readOnly &&
          <Button variant="ghost" size="sm" className="absolute -right-2 -top-2 z-10" onClick={() => removeNestedGroup(nestedGroup.id)}>
                <X className="w-4 h-4 text-red-500" />
              </Button>
          }
            <ConditionBuilder group={nestedGroup} onChange={(g) => updateNestedGroup(nestedGroup.id, g)} level={level + 1} readOnly={readOnly} />
          </div>
        )}

        {!readOnly &&
        <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" onClick={addCondition}>
              <Plus className="w-4 h-4 mr-1" /> Add Condition
            </Button>
            {level < 2 &&
          <Button variant="outline" size="sm" onClick={addGroup}>
                <Layers className="w-4 h-4 mr-1" /> Add Group
              </Button>
          }
          </div>
        }

        {level === 0 && (group.conditions.length > 0 || group.groups.length > 0) &&
        <div className="mt-4 p-3 bg-white rounded-lg border">
            <span className="text-sm font-medium text-gray-700">Summary: </span>
            <span className="text-sm text-gray-600">
              "If {group.conditions.map((c, i) => {
              const f = conditionFields.find((x) => x.value === c.field);
              const o = operators.find((x) => x.value === c.operator);
              let val = ['is_empty', 'is_not_empty'].includes(c.operator) ? '' : c.operator === 'between' ? `${c.value || '?'} and ${c.valueTo || '?'}` : c.value || '?';
              return `${i > 0 ? ` ${group.logic} ` : ''}${f?.label || c.field || '?'} ${o?.label || c.operator}${val ? ` ${val}` : ''}`;
            }).join('')}{group.groups.length > 0 && ` ${group.logic} (${group.groups.length} nested)`}"
            </span>
          </div>
        }
      </div>);

  };

  // Scope Selector
  const ScopeSelector: React.FC<{
    scope: ScopeSelection;
    onChange: (s: ScopeSelection) => void;
    readOnly?: boolean;
  }> = ({ scope, onChange, readOnly = false }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const getOptionsForType = (type: string): {id: string;name: string;}[] => {
      switch (type) {
        case 'classes':return mockClasses.map((c) => ({ id: c, name: c }));
        case 'sections':return mockSections.map((s) => ({ id: s, name: s }));
        case 'departments':return mockDepartments.map((d) => ({ id: d, name: d }));
        case 'students':return mockStudents.map((s) => ({ id: s.id, name: `${s.name} (${s.class})` }));
        case 'custom':return mockCustomGroups.map((g) => ({ id: g.id, name: g.name }));
        default:return [];
      }
    };

    const options = getOptionsForType(scope.type);
    const filteredOptions = options.filter((o) => o.name.toLowerCase().includes(searchTerm.toLowerCase()) && !scope.selectedIds.includes(o.id));

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {scopeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => !readOnly && onChange({ type: option.value as ScopeSelection['type'], selectedIds: [], excludedIds: [] })}
                disabled={readOnly}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                scope.type === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`
                }>

                <IconComponent className={`w-5 h-5 mb-1 ${scope.type === option.value ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className={`text-sm font-medium ${scope.type === option.value ? 'text-blue-600' : 'text-gray-600'}`}>
                  {option.label}
                </div>
              </button>);

          })}
        </div>

        {scope.type !== 'all' &&
        <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Select {scopeOptions.find((o) => o.value === scope.type)?.label}</label>
              {!readOnly &&
            <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onChange({ ...scope, selectedIds: options.map((o) => o.id) })}>
                    Select All
                  </Button>
                  {scope.selectedIds.length > 0 &&
              <Button variant="outline" size="sm" onClick={() => onChange({ ...scope, selectedIds: [] })}>
                      Clear
                    </Button>
              }
                </div>
            }
            </div>

            {scope.selectedIds.length > 0 &&
          <div className="flex flex-wrap gap-2 mb-3">
                {scope.selectedIds.map((id) => {
              const opt = options.find((o) => o.id === id);
              return (
                <Badge key={id} variant="info">
                      {opt?.name || id}
                      {!readOnly &&
                  <button className="ml-1" onClick={() => onChange({ ...scope, selectedIds: scope.selectedIds.filter((x) => x !== id) })}>
                          <X className="w-3 h-3" />
                        </button>
                  }
                    </Badge>);

            })}
              </div>
          }

            {!readOnly &&
          <>
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg" />

                </div>
                <div className="max-h-48 overflow-y-auto border rounded-lg bg-white">
                  {filteredOptions.length === 0 ?
              <p className="p-3 text-center text-gray-500 text-sm">{searchTerm ? 'No results' : 'All selected'}</p> :

              filteredOptions.map((opt) =>
              <button
                key={opt.id}
                onClick={() => onChange({ ...scope, selectedIds: [...scope.selectedIds, opt.id] })}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0 text-sm">

                        {opt.name}
                      </button>
              )
              }
                </div>
              </>
          }
          </div>
        }

        <div className="p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-blue-800">Applied to: </span>
          <span className="text-sm text-blue-700">
            {scope.type === 'all' ? 'Entire Institute' : scope.selectedIds.length === 0 ? 'None selected' : `${scope.selectedIds.length} ${scopeOptions.find((o) => o.value === scope.type)?.label}`}
          </span>
        </div>
      </div>);

  };

  // Action Manager
  const ActionManager: React.FC<{
    actions: PolicyAction[];
    onChange: (a: PolicyAction[]) => void;
    readOnly?: boolean;
  }> = ({ actions, onChange, readOnly = false }) => {
    const sortedActions = [...actions].sort((a, b) => a.order - b.order);

    const addAction = () => {
      const maxOrder = Math.max(...actions.map((a) => a.order), 0);
      onChange([...actions, createAction(maxOrder + 1)]);
    };

    const updateAction = (id: string, updates: Partial<PolicyAction>) => {
      onChange(actions.map((a) => a.id === id ? { ...a, ...updates } : a));
    };

    const removeAction = (id: string) => {
      onChange(actions.filter((a) => a.id !== id));
    };

    return (
      <div className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-600 text-white rounded font-bold text-sm">THEN</span>
              <span className="text-sm text-gray-600">Execute actions</span>
            </div>
            {!readOnly &&
            <Button variant="outline" size="sm" onClick={addAction}>
                <Plus className="w-4 h-4 mr-1" /> Add Action
              </Button>
            }
          </div>

          {sortedActions.length === 0 &&
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg border border-dashed">
              No actions configured
            </div>
          }

          {sortedActions.map((action, index) => {
            const actionType = actionTypes.find((at) => at.value === action.type);
            return (
              <div key={action.id} className="flex gap-2 mb-3 items-start p-3 bg-white rounded-lg border">
                <span className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full text-sm font-medium text-green-700">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <select
                    value={action.type}
                    onChange={(e) => {
                      const newType = actionTypes.find((at) => at.value === e.target.value);
                      const params: Record<string, string> = {};
                      newType?.params.forEach((p) => {params[p] = '';});
                      updateAction(action.id, { type: e.target.value, params });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={readOnly}>

                    <option value="">Select Action</option>
                    {actionTypes.map((at) => <option key={at.value} value={at.value}>{at.label}</option>)}
                  </select>

                  {actionType?.params && actionType.params.length > 0 &&
                  <div className="grid grid-cols-2 gap-2">
                      {actionType.params.map((param) =>
                    <div key={param}>
                          <label className="block text-xs text-gray-500 mb-1 capitalize">{param.replace(/_/g, ' ')}</label>
                          {param.includes('message') || param === 'description' || param === 'reason' ?
                      <textarea
                        value={action.params[param] || ''}
                        onChange={(e) => updateAction(action.id, { params: { ...action.params, [param]: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        rows={2}
                        disabled={readOnly} /> :

                      param === 'recipient' || param === 'authority' ?
                      <select
                        value={action.params[param] || ''}
                        onChange={(e) => updateAction(action.id, { params: { ...action.params, [param]: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        disabled={readOnly}>

                              <option value="">Select</option>
                              <option value="student">Student</option>
                              <option value="parent">Parent</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                              <option value="principal">Principal</option>
                            </select> :
                      param === 'severity' ?
                      <select
                        value={action.params[param] || ''}
                        onChange={(e) => updateAction(action.id, { params: { ...action.params, [param]: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        disabled={readOnly}>

                              <option value="">Select</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select> :

                      <input
                        type={['amount', 'percentage'].includes(param) ? 'number' : 'text'}
                        value={action.params[param] || ''}
                        onChange={(e) => updateAction(action.id, { params: { ...action.params, [param]: e.target.value } })}
                        className="w-full px-3 py-2 border rounded-lg text-sm"
                        disabled={readOnly} />

                      }
                        </div>
                    )}
                    </div>
                  }
                </div>
                {!readOnly &&
                <Button variant="ghost" size="sm" onClick={() => removeAction(action.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                }
              </div>);

          })}
        </div>

        {sortedActions.length > 0 &&
        <div className="p-3 bg-green-100 rounded-lg">
            <span className="text-sm font-medium text-green-800">Flow: </span>
            <span className="text-sm text-green-700">
              {sortedActions.filter((a) => a.type).map((a) => actionTypes.find((at) => at.value === a.type)?.label || a.type).join(' → ')}
            </span>
          </div>
        }
      </div>);

  };

  // Override Manager
  const OverrideManager: React.FC<{
    overrides: Override[];
    onChange: (o: Override[]) => void;
    readOnly?: boolean;
  }> = ({ overrides, onChange, readOnly = false }) => {
    const [editing, setEditing] = useState<Override | null>(null);
    const sortedOverrides = [...overrides].sort((a, b) => a.priority - b.priority);

    const addOverride = () => setEditing(createOverride(overrides.length + 1));

    const saveOverride = () => {
      if (!editing?.name.trim()) {addNotification('error', 'Name required');return;}
      if (!editing?.action) {addNotification('error', 'Action required');return;}
      const exists = overrides.find((o) => o.id === editing.id);
      onChange(exists ? overrides.map((o) => o.id === editing.id ? editing : o) : [...overrides, editing]);
      setEditing(null);
    };

    const deleteOverride = (id: string) => {
      if (window.confirm('Delete override?')) onChange(overrides.filter((o) => o.id !== id));
    };

    const toggleOverride = (id: string) => {
      onChange(overrides.map((o) => o.id === id ? { ...o, enabled: !o.enabled } : o));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Override Rules</h4>
            <p className="text-sm text-gray-500">Define exceptions</p>
          </div>
          {!readOnly &&
          <Button variant="outline" size="sm" onClick={addOverride}>
              <Plus className="w-4 h-4 mr-1" /> Add Override
            </Button>
          }
        </div>

        {sortedOverrides.length === 0 ?
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
            <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No overrides defined</p>
          </div> :

        <div className="space-y-2">
            {sortedOverrides.map((override) =>
          <div key={override.id} className={`p-4 border rounded-lg bg-white ${!override.enabled ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full text-sm font-bold text-purple-700">
                    {override.priority}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{override.name || 'Unnamed'}</span>
                      <Badge variant={override.enabled ? 'success' : 'default'}>{override.enabled ? 'Active' : 'Disabled'}</Badge>
                    </div>
                    {override.description && <p className="text-sm text-gray-500 mb-1">{override.description}</p>}
                    <div className="text-sm text-gray-600">
                      Action: {overrideActions.find((a) => a.value === override.action)?.label || override.action || 'Not set'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!readOnly &&
                <>
                        <button
                    onClick={() => toggleOverride(override.id)}
                    className={`relative w-10 h-5 rounded-full ${override.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>

                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${override.enabled ? 'right-0.5' : 'left-0.5'}`} />
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => setEditing({ ...override })}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteOverride(override.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                }
                    {readOnly &&
                <Button variant="ghost" size="sm" onClick={() => setEditing({ ...override })}>
                        <Eye className="w-4 h-4" />
                      </Button>
                }
                  </div>
                </div>
              </div>
          )}
          </div>
        }

        {/* Override Editor Modal */}
        {editing &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="text-lg font-bold">
                  {readOnly ? 'View' : overrides.find((o) => o.id === editing.id) ? 'Edit' : 'New'} Override
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={readOnly} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2}
                  disabled={readOnly} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Conditions</label>
                  <ConditionBuilder
                  group={editing.conditions}
                  onChange={(conditions) => setEditing({ ...editing, conditions })}
                  readOnly={readOnly} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Action *</label>
                  <select
                  value={editing.action}
                  onChange={(e) => setEditing({ ...editing, action: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  disabled={readOnly}>

                    <option value="">Select</option>
                    {overrideActions.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <input
                    type="number"
                    value={editing.priority}
                    onChange={(e) => setEditing({ ...editing, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg"
                    min="1"
                    disabled={readOnly} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                      type="checkbox"
                      checked={editing.enabled}
                      onChange={(e) => setEditing({ ...editing, enabled: e.target.checked })}
                      disabled={readOnly} />

                      <span className="text-sm">Active</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
                <Button variant="outline" onClick={() => setEditing(null)}>{readOnly ? 'Close' : 'Cancel'}</Button>
                {!readOnly &&
              <Button onClick={saveOverride}>
                    <Check className="w-4 h-4 mr-1" /> Save
                  </Button>
              }
              </div>
            </Card>
          </div>
        }
      </div>);

  };

  // Exception Manager
  const ExceptionManager: React.FC<{
    exceptions: Exception[];
    onChange: (e: Exception[]) => void;
    readOnly?: boolean;
  }> = ({ exceptions, onChange, readOnly = false }) => {
    const [editing, setEditing] = useState<Exception | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = exceptions.filter((e) =>
    e.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addException = () => setEditing(createException());

    const saveException = () => {
      if (!editing?.entityId) {addNotification('error', 'Select entity');return;}
      if (!editing?.reason.trim()) {addNotification('error', 'Reason required');return;}
      const today = new Date().toISOString().split('T')[0];
      const status = editing.validTo && editing.validTo < today ? 'expired' : editing.validFrom > today ? 'pending' : 'active';
      const updated: Exception = { ...editing, status };
      const exists = exceptions.find((e) => e.id === editing.id);
      onChange(exists ? exceptions.map((e) => e.id === editing.id ? updated : e) : [...exceptions, updated]);
      setEditing(null);
    };

    const removeException = (id: string) => {
      if (window.confirm('Remove?')) onChange(exceptions.filter((e) => e.id !== id));
    };

    const getEntityOptions = (type: string) => {
      if (type === 'student') return mockStudents.map((s) => ({ id: s.id, name: `${s.name} (${s.class})` }));
      if (type === 'staff') return mockStaff.map((s) => ({ id: s.id, name: s.name }));
      return mockClasses.map((c) => ({ id: c, name: c }));
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Manual Exceptions</h4>
            <p className="text-sm text-gray-500">Exempt specific entities</p>
          </div>
          {!readOnly &&
          <Button variant="outline" size="sm" onClick={addException}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          }
        </div>

        {exceptions.length > 0 &&
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />

          </div>
        }

        {filtered.length === 0 ?
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No exceptions</p>
          </div> :

        <div className="space-y-2">
            {filtered.map((exception) =>
          <div key={exception.id} className={`p-4 border rounded-lg ${exception.status === 'expired' ? 'bg-gray-50' : exception.status === 'pending' ? 'bg-yellow-50' : 'bg-white'}`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${exception.type === 'student' ? 'bg-blue-100' : exception.type === 'staff' ? 'bg-purple-100' : 'bg-green-100'}`}>
                      <Users className={`w-4 h-4 ${exception.type === 'student' ? 'text-blue-600' : exception.type === 'staff' ? 'text-purple-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <div className="font-medium">{exception.entityName}</div>
                      <div className="text-sm text-gray-500">{exception.reason}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={exception.status === 'active' ? 'success' : exception.status === 'pending' ? 'warning' : 'default'}>
                      {exception.status}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {exception.validFrom} - {exception.validTo || '∞'}
                    </span>
                    {!readOnly &&
                <>
                        <Button variant="ghost" size="sm" onClick={() => setEditing({ ...exception })}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removeException(exception.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                }
                  </div>
                </div>
              </div>
          )}
          </div>
        }

        {/* Exception Editor Modal */}
        {editing &&
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold">
                  {exceptions.find((e) => e.id === editing.id) ? 'Edit' : 'Add'} Exception
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value as Exception['type'], entityId: '', entityName: '' })}
                  className="w-full px-3 py-2 border rounded-lg">

                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="class">Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select *</label>
                  <select
                  value={editing.entityId}
                  onChange={(e) => {
                    const opt = getEntityOptions(editing.type).find((o) => o.id === e.target.value);
                    setEditing({ ...editing, entityId: e.target.value, entityName: opt?.name || '' });
                  }}
                  className="w-full px-3 py-2 border rounded-lg">

                    <option value="">Select</option>
                    {getEntityOptions(editing.type).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Reason *</label>
                  <textarea
                  value={editing.reason}
                  onChange={(e) => setEditing({ ...editing, reason: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={2} />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <input
                    type="date"
                    value={editing.validFrom}
                    onChange={(e) => setEditing({ ...editing, validFrom: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <input
                    type="date"
                    value={editing.validTo}
                    onChange={(e) => setEditing({ ...editing, validTo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" />

                    <p className="text-xs text-gray-500 mt-1">Empty = indefinite</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={saveException}>
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </Card>
          </div>
        }
      </div>);

  };

  // Simulation Panel
  const SimulationPanel: React.FC<{policy: Policy;}> = ({ policy }) => {
    const [input, setInput] = useState<SimulationInput>({
      entityType: 'student',
      entityId: '',
      entityName: '',
      data: { attendance_percentage: 80, marks: 75, fee_due: 0, behavior_points: 85, medical_leave: 0, late_submissions: 0 }
    });
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);

    const run = () => {
      if (!input.entityId) {addNotification('warning', 'Select entity');return;}
      setRunning(true);
      setTimeout(() => {
        const r = runSimulation(input, policy);
        setResult(r);
        setSimulationResult(r);
        setRunning(false);
      }, 300);
    };

    const reset = () => {
      setInput({
        entityType: 'student',
        entityId: '',
        entityName: '',
        data: { attendance_percentage: 80, marks: 75, fee_due: 0, behavior_points: 85, medical_leave: 0, late_submissions: 0 }
      });
      setResult(null);
      setSimulationResult(null);
    };

    return (
      <Card>
        <div className="p-4 border-b">
          <h3 className="font-semibold flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" /> Simulation
          </h3>
          <p className="text-sm text-gray-500">Test policy</p>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={input.entityType}
                onChange={(e) => setInput({ ...input, entityType: e.target.value as SimulationInput['entityType'], entityId: '', entityName: '' })}
                className="w-full px-3 py-2 border rounded-lg">

                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Entity</label>
              <select
                value={input.entityId}
                onChange={(e) => {
                  const entities = input.entityType === 'student' ? mockStudents : mockStaff;
                  const entity = entities.find((x) => x.id === e.target.value);
                  setInput({ ...input, entityId: e.target.value, entityName: entity?.name || '' });
                }}
                className="w-full px-3 py-2 border rounded-lg">

                <option value="">Select</option>
                {(input.entityType === 'student' ? mockStudents : mockStaff).map((e) =>
                <option key={e.id} value={e.id}>{e.name}</option>
                )}
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-sm">Mock Data</span>
              <Button variant="ghost" size="sm" onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {conditionFields.filter((f) => f.type === 'number').slice(0, 6).map((field) =>
              <div key={field.value}>
                  <label className="block text-xs text-gray-600 mb-1">{field.label}</label>
                  <input
                  type="number"
                  value={input.data[field.value] ?? ''}
                  onChange={(e) => setInput({ ...input, data: { ...input.data, [field.value]: Number(e.target.value) } })}
                  className="w-full px-3 py-2 border rounded-lg text-sm" />

                </div>
              )}
            </div>
          </div>

          <Button className="w-full" onClick={run} disabled={running}>
            {running ?
            <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Running...</> :

            <><Play className="w-4 h-4 mr-2" /> Run Simulation</>
            }
          </Button>

          {result &&
          <div className={`p-4 rounded-lg ${
          result.appliedExceptions.length > 0 ? 'bg-blue-50 border border-blue-200' :
          result.matched ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`
          }>
              <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
            result.appliedExceptions.length > 0 ? 'text-blue-800' :
            result.matched ? 'text-yellow-800' : 'text-green-800'}`
            }>
                {result.appliedExceptions.length > 0 ?
              <><Shield className="w-5 h-5" /> Exception Applied</> :
              result.matched ?
              <><AlertTriangle className="w-5 h-5" /> Policy Triggered</> :

              <><CheckCircle className="w-5 h-5" /> No Action</>
              }
              </h4>
              {result.matchedConditions.length > 0 &&
            <div className="mb-2">
                  <span className="text-sm font-medium">Matched:</span>
                  <ul className="text-sm text-gray-600 ml-4 list-disc">
                    {result.matchedConditions.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
            }
              {result.appliedOverrides.length > 0 &&
            <div className="mb-2">
                  <span className="text-sm font-medium">Overrides:</span>
                  <ul className="text-sm text-gray-600 ml-4 list-disc">
                    {result.appliedOverrides.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
            }
              {result.triggeredActions.length > 0 &&
            <div className="mb-2">
                  <span className="text-sm font-medium">Actions:</span>
                  <ul className="text-sm text-gray-600 ml-4 list-disc">
                    {result.triggeredActions.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>
            }
              {result.appliedExceptions.length > 0 &&
            <div className="mb-2">
                  <span className="text-sm font-medium">Exception:</span>
                  <ul className="text-sm text-gray-600 ml-4 list-disc">
                    {result.appliedExceptions.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
            }
              <p className="text-sm mt-3 p-2 bg-white rounded border">{result.explanation}</p>
            </div>
          }
        </div>
      </Card>);

  };

  // ==================== MAIN RENDER ====================
  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${isFullScreen ? 'fixed inset-0 z-40 overflow-auto' : ''}`}>
      <NotificationToast />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Shield className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Institute Policies & Rule Overrides</h1>
            <p className="text-sm text-gray-500">
              Create policies, define conditions, configure overrides
              {hasUnsavedChanges && <span className="ml-2 text-yellow-600">(Unsaved)</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentView === 'list' &&
          <>
              <Button variant="outline" onClick={() => setShowImportModal(true)}>
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
              <Button variant="outline" onClick={() => setShowExportModal(true)}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button onClick={handleCreatePolicy}>
                <Plus className="w-4 h-4 mr-2" /> Create Policy
              </Button>
            </>
          }

        </div>
      </div>

      {/* LIST VIEW */}
      {currentView === 'list' &&
      <div className="space-y-6">
          {/* Filters */}
          <Card>
            <div className="p-4 flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg" />

              </div>
              <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg">

                <option value="">All Categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg">

                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
                <option value="draft">Draft</option>
              </select>
              <div className="flex items-center gap-2">
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 border rounded-lg">

                  <option value="priority">Priority</option>
                  <option value="lastModified">Last Modified</option>
                  <option value="name">Name</option>
                </select>
                <button onClick={() => setSortOrder((o) => o === 'asc' ? 'desc' : 'asc')} className="p-2 border rounded-lg hover:bg-gray-50">
                  <ArrowUpDown className={`w-4 h-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {(searchQuery || filterCategory || filterStatus) &&
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="w-4 h-4 mr-1" /> Clear
                </Button>
            }
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedPolicies.length > 0 &&
        <Card>
              <div className="p-4 bg-blue-50 flex items-center justify-between">
                <span className="font-medium text-blue-800">{selectedPolicies.length} selected</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('enable')}>Enable</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('disable')}>Disable</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>Archive</Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction('delete')}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPolicies([])}>Clear</Button>
                </div>
              </div>
            </Card>
        }

          {/* Policy List */}
          <Card>
            <div className="divide-y">
              {filteredPolicies.length === 0 ?
            <div className="p-12 text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No policies found</h3>
                  <p className="text-sm">Create your first policy to get started.</p>
                </div> :

            <>
                  <div className="p-3 bg-gray-50 flex items-center gap-4">
                    <input
                  type="checkbox"
                  checked={selectedPolicies.length === filteredPolicies.length && filteredPolicies.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4" />

                    <span className="text-sm text-gray-600">Select all</span>
                  </div>
                  {filteredPolicies.map((policy) =>
              <div key={policy.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <input
                    type="checkbox"
                    checked={selectedPolicies.includes(policy.id)}
                    onChange={(e) => setSelectedPolicies(e.target.checked ? [...selectedPolicies, policy.id] : selectedPolicies.filter((x) => x !== policy.id))}
                    className="w-4 h-4" />

                        <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg text-purple-700 font-bold">
                          {policy.priority}
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => handlePreviewPolicy(policy)}>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{policy.name}</h3>
                            <Badge variant={policy.status === 'active' ? 'success' : policy.status === 'archived' ? 'default' : policy.status === 'draft' ? 'info' : 'warning'}>
                              {policy.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{policy.description}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span><FileText className="w-3 h-3 inline mr-1" />{policy.category}</span>
                            <span><Users className="w-3 h-3 inline mr-1" />{policy.scope.type === 'all' ? 'All' : `${policy.scope.selectedIds.length} selected`}</span>
                            <span><Clock className="w-3 h-3 inline mr-1" />{new Date(policy.lastModified).toLocaleDateString()}</span>
                            <span>{policy.actions.length} actions, {policy.overrides.length} overrides, {policy.exceptions.length} exceptions</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                      onClick={() => handleToggleStatus(policy.id)}
                      className={`relative w-12 h-6 rounded-full ${policy.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>

                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${policy.status === 'active' ? 'right-1' : 'left-1'}`} />
                          </button>
                          <Button variant="ghost" size="sm" onClick={() => handlePreviewPolicy(policy)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditPolicy(policy)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDuplicatePolicy(policy)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleArchivePolicy(policy.id)}>
                            <Archive className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(policy.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
              )}
                </>
            }
            </div>
          </Card>
        </div>
      }

      {/* CREATE/EDIT VIEW */}
      {(currentView === 'create' || currentView === 'edit') && draftPolicy &&
      <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <Card>
              <div className="flex border-b">
                {(['basic', 'scope', 'conditions', 'actions', 'overrides', 'exceptions'] as const).map((tab) =>
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>

                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {validationErrors[tab] && <span className="ml-1 w-2 h-2 bg-red-500 rounded-full inline-block" />}
                  </button>
              )}
              </div>
              <div className="p-6">
                {activeTab === 'basic' &&
              <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <input
                    type="text"
                    value={draftPolicy.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.name ? 'border-red-500' : ''}`} />

                      {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                    value={draftPolicy.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3} />

                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <select
                      value={draftPolicy.category}
                      onChange={(e) => updateDraft({ category: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${validationErrors.category ? 'border-red-500' : ''}`}>

                          <option value="">Select</option>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <input
                      type="number"
                      value={draftPolicy.priority}
                      onChange={(e) => updateDraft({ priority: parseInt(e.target.value) || 1 })}
                      className={`w-full px-3 py-2 border rounded-lg ${validationErrors.priority ? 'border-red-500' : ''}`}
                      min="1" />

                        {validationErrors.priority && <p className="text-red-500 text-sm mt-1">{validationErrors.priority}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Effective Date *</label>
                        <input
                      type="date"
                      value={draftPolicy.effectiveDate}
                      onChange={(e) => updateDraft({ effectiveDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${validationErrors.effectiveDate ? 'border-red-500' : ''}`} />

                        {validationErrors.effectiveDate && <p className="text-red-500 text-sm mt-1">{validationErrors.effectiveDate}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                      type="date"
                      value={draftPolicy.expiryDate}
                      onChange={(e) => updateDraft({ expiryDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg ${validationErrors.expiryDate ? 'border-red-500' : ''}`} />

                        {validationErrors.expiryDate && <p className="text-red-500 text-sm mt-1">{validationErrors.expiryDate}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tags</label>
                      <input
                    type="text"
                    value={draftPolicy.tags.join(', ')}
                    onChange={(e) => updateDraft({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Comma separated" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Notes</label>
                      <textarea
                    value={draftPolicy.notes}
                    onChange={(e) => updateDraft({ notes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={2} />

                    </div>
                  </div>
              }
                {activeTab === 'scope' &&
              <ScopeSelector scope={draftPolicy.scope} onChange={(scope) => updateDraft({ scope })} />
              }
                {activeTab === 'conditions' &&
              <>
                    <ConditionBuilder group={draftPolicy.conditions} onChange={(conditions) => updateDraft({ conditions })} />
                    {validationErrors.conditions && <p className="text-red-500 text-sm mt-2">{validationErrors.conditions}</p>}
                  </>
              }
                {activeTab === 'actions' &&
              <>
                    <ActionManager actions={draftPolicy.actions} onChange={(actions) => updateDraft({ actions })} />
                    {validationErrors.actions && <p className="text-red-500 text-sm mt-2">{validationErrors.actions}</p>}
                  </>
              }
                {activeTab === 'overrides' &&
              <OverrideManager overrides={draftPolicy.overrides} onChange={(overrides) => updateDraft({ overrides })} />
              }
                {activeTab === 'exceptions' &&
              <ExceptionManager exceptions={draftPolicy.exceptions} onChange={(exceptions) => updateDraft({ exceptions })} />
              }
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="p-4 border-b"><h3 className="font-semibold">Actions</h3></div>
              <div className="p-4 space-y-3">
                <Button className="w-full" onClick={handleSavePolicy}>
                  <Save className="w-4 h-4 mr-2" /> {currentView === 'create' ? 'Create' : 'Save'}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleCancelEdit}>Cancel</Button>
                {currentView === 'edit' &&
              <Button variant="outline" className="w-full" onClick={() => setShowVersionHistory(true)}>
                    <History className="w-4 h-4 mr-2" /> Version History
                  </Button>
              }
                {hasUnsavedChanges &&
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
                    <AlertCircle className="w-4 h-4" /> Unsaved changes
                  </div>
              }
              </div>
            </Card>
            <Card>
              <div className="p-4 border-b"><h3 className="font-semibold">Status</h3></div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Policy Status</span>
                  <button
                  onClick={() => updateDraft({ status: draftPolicy.status === 'active' ? 'inactive' : 'active' })}
                  className={`relative w-12 h-6 rounded-full ${draftPolicy.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>

                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${draftPolicy.status === 'active' ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <Badge variant={draftPolicy.status === 'active' ? 'success' : draftPolicy.status === 'draft' ? 'info' : 'warning'}>
                  {draftPolicy.status}
                </Badge>
              </div>
            </Card>
            <SimulationPanel policy={draftPolicy} />
          </div>
        </div>
      }

      {/* PREVIEW VIEW */}
      {currentView === 'preview' && previewPolicy &&
      <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={handleCancelEdit}>
                <ChevronDown className="w-5 h-5 rotate-90" />
              </Button>
              <div>
                <h2 className="text-xl font-bold">{previewPolicy.name}</h2>
                <p className="text-sm text-gray-500">{previewPolicy.description}</p>
              </div>
              <Badge variant={previewPolicy.status === 'active' ? 'success' : previewPolicy.status === 'archived' ? 'default' : 'warning'}>
                {previewPolicy.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleDuplicatePolicy(previewPolicy)}>
                <Copy className="w-4 h-4 mr-2" /> Duplicate
              </Button>
              <Button onClick={() => handleEditPolicy(previewPolicy)}>
                <Edit2 className="w-4 h-4 mr-2" /> Edit
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Basic Information</h3></div>
                <div className="p-4 grid grid-cols-3 gap-4 text-sm">
                  <div><label className="text-gray-500">Category</label><p className="font-medium">{previewPolicy.category}</p></div>
                  <div><label className="text-gray-500">Priority</label><p className="font-medium">{previewPolicy.priority}</p></div>
                  <div><label className="text-gray-500">Status</label><p className="font-medium">{previewPolicy.status}</p></div>
                  <div><label className="text-gray-500">Effective</label><p className="font-medium">{previewPolicy.effectiveDate}</p></div>
                  <div><label className="text-gray-500">Expiry</label><p className="font-medium">{previewPolicy.expiryDate || 'None'}</p></div>
                  <div><label className="text-gray-500">Scope</label><p className="font-medium">{previewPolicy.scope.type === 'all' ? 'All' : `${previewPolicy.scope.selectedIds.length} ${previewPolicy.scope.type}`}</p></div>
                </div>
              </Card>
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Conditions</h3></div>
                <div className="p-4"><ConditionBuilder group={previewPolicy.conditions} onChange={() => {}} readOnly /></div>
              </Card>
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Actions ({previewPolicy.actions.length})</h3></div>
                <div className="p-4"><ActionManager actions={previewPolicy.actions} onChange={() => {}} readOnly /></div>
              </Card>
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Overrides ({previewPolicy.overrides.length})</h3></div>
                <div className="p-4"><OverrideManager overrides={previewPolicy.overrides} onChange={() => {}} readOnly /></div>
              </Card>
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Exceptions ({previewPolicy.exceptions.length})</h3></div>
                <div className="p-4"><ExceptionManager exceptions={previewPolicy.exceptions} onChange={() => {}} readOnly /></div>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <div className="p-4 border-b"><h3 className="font-semibold">Metadata</h3></div>
                <div className="p-4 space-y-3 text-sm">
                  <div><label className="text-gray-500">Created</label><p>{new Date(previewPolicy.createdAt).toLocaleString()}</p></div>
                  <div><label className="text-gray-500">Modified</label><p>{new Date(previewPolicy.lastModified).toLocaleString()}</p></div>
                  <div><label className="text-gray-500">Created By</label><p>{previewPolicy.createdBy}</p></div>
                  <div>
                    <label className="text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {previewPolicy.tags.map((t) => <Badge key={t} variant="default">{t}</Badge>)}
                    </div>
                  </div>
                </div>
              </Card>
              <SimulationPanel policy={previewPolicy} />
            </div>
          </div>
        </div>
      }

      {/* MODALS */}
      {/* Delete Confirm */}
      {showDeleteConfirm &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                <h3 className="text-lg font-bold">Delete Policy</h3>
              </div>
              <p className="text-gray-600 mb-4">Are you sure? This can be undone within 60 seconds.</p>
              {policies.find((p) => p.id === showDeleteConfirm)?.status === 'active' &&
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4 text-sm text-yellow-800">
                  <strong>Warning:</strong> This is an active policy.
                </div>
            }
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={() => handleDeletePolicy(showDeleteConfirm)}>Delete</Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Bulk Delete Confirm */}
      {showBulkDeleteConfirm &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                <h3 className="text-lg font-bold">Delete {selectedPolicies.length} Policies</h3>
              </div>
              <p className="text-gray-600 mb-4">Are you sure you want to delete {selectedPolicies.length} selected policies?</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowBulkDeleteConfirm(false)}>Cancel</Button>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" onClick={handleBulkDelete}>Delete All</Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Version History */}
      {showVersionHistory &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg max-h-[80vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold flex items-center gap-2"><History className="w-5 h-5" /> Version History</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowVersionHistory(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-6">
              {versionHistory.length === 0 ?
            <p className="text-center text-gray-500">No history</p> :

            <div className="space-y-3">
                  {versionHistory.slice().reverse().map((v, i) =>
              <div key={v.id} className={`p-4 border rounded-lg ${i === 0 ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Version {v.version}{i === 0 && <Badge variant="info" className="ml-2">Current</Badge>}</div>
                          <div className="text-sm text-gray-500">{new Date(v.timestamp).toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{v.changes}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewingVersion(v)}><Eye className="w-4 h-4 mr-1" /> View</Button>
                          {i > 0 && <Button variant="outline" size="sm" onClick={() => handleRestoreVersion(v)}><RefreshCw className="w-4 h-4 mr-1" /> Restore</Button>}
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          </Card>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold"><Download className="w-5 h-5 inline mr-2" /> Export Policies</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-6 space-y-4">
              <Button className="w-full" onClick={() => handleExportPolicies(true)}>
                <Download className="w-4 h-4 mr-2" /> Export All ({policies.length})
              </Button>
              {selectedPolicies.length > 0 &&
            <Button variant="outline" className="w-full" onClick={() => handleExportPolicies(false)}>
                  <Download className="w-4 h-4 mr-2" /> Export Selected ({selectedPolicies.length})
                </Button>
            }
            </div>
          </Card>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold"><Upload className="w-5 h-5 inline mr-2" /> Import Policies</h3>
              <Button variant="ghost" size="sm" onClick={() => {setShowImportModal(false);setImportData('');setImportError('');}}><X className="w-5 h-5" /></Button>
            </div>
            <div className="p-6 space-y-4">
              <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => setImportData(ev.target?.result as string);
                  reader.readAsText(file);
                }
              }}
              className="hidden" />

              <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" /> Choose File
              </Button>
              <div className="text-center text-sm text-gray-500">— or paste JSON —</div>
              <textarea
              value={importData}
              onChange={(e) => {setImportData(e.target.value);setImportError('');}}
              placeholder='{"policies": [...]}'
              className="w-full h-48 px-3 py-2 border rounded-lg font-mono text-sm" />

              {importError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{importError}</div>}
              <Button className="w-full" onClick={handleImportPolicies} disabled={!importData.trim()}>
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Version View Modal */}
      {viewingVersion &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold">Version {viewingVersion.version}</h3>
                <p className="text-sm text-gray-500">{new Date(viewingVersion.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleRestoreVersion(viewingVersion)}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Restore
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setViewingVersion(null)}><X className="w-5 h-5" /></Button>
              </div>
            </div>
            <div className="p-6 grid grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Basic Info</h4>
                <p><span className="text-gray-500">Name:</span> {viewingVersion.snapshot.name}</p>
                <p><span className="text-gray-500">Category:</span> {viewingVersion.snapshot.category}</p>
                <p><span className="text-gray-500">Priority:</span> {viewingVersion.snapshot.priority}</p>
                <p><span className="text-gray-500">Status:</span> {viewingVersion.snapshot.status}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Dates</h4>
                <p><span className="text-gray-500">Effective:</span> {viewingVersion.snapshot.effectiveDate}</p>
                <p><span className="text-gray-500">Expiry:</span> {viewingVersion.snapshot.expiryDate || 'None'}</p>
              </div>
              <div className="col-span-2">
                <h4 className="font-medium mb-2">Conditions</h4>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-32">{JSON.stringify(viewingVersion.snapshot.conditions, null, 2)}</pre>
              </div>
              <div className="col-span-2">
                <h4 className="font-medium mb-2">Actions ({viewingVersion.snapshot.actions.length})</h4>
                <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-32">{JSON.stringify(viewingVersion.snapshot.actions, null, 2)}</pre>
              </div>
            </div>
          </Card>
        </div>
      }
    </div>);

}

export default InstitutePoliciesRuleOverrides;