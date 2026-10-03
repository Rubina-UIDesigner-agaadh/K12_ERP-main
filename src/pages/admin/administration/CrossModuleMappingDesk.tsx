import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  RefreshCwIcon,
  CheckCircleIcon,
  PlusIcon,
  LinkIcon,
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  SettingsIcon,
  HistoryIcon,
  PlayIcon,
  PauseIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
  InfoIcon,
  CheckIcon,
  XCircleIcon,
  Loader2Icon,
  DatabaseIcon,
  GitBranchIcon,
  LayersIcon,
  RepeatIcon,
  ZapIcon,
  ClockIcon,
  AlertCircleIcon,
  FileTextIcon,
  CodeIcon,
  ArrowLeftRightIcon,
  MoreVerticalIcon,
  ChevronRightIcon,
  SaveIcon } from
'lucide-react';

// Types
interface ModuleMapping {
  id: string;
  source: string;
  target: string;
  type: string;
  description: string;
  lastSynced: string;
  lastSyncedDate: string;
  status: 'Synced' | 'Pending' | 'Error' | 'In Progress' | 'Disabled';
  recordsCount: number;
  errorCount: number;
  autoSync: boolean;
  syncInterval: string;
  createdBy: string;
  createdAt: string;
}

interface FieldMapping {
  id: string;
  sourceField: string;
  sourceType: string;
  targetField: string;
  targetType: string;
  transform: string;
  transformLogic: string;
  required: boolean;
  defaultValue: string;
  status: 'Active' | 'Inactive' | 'Error';
}

interface SyncLog {
  id: string;
  mappingId: string;
  timestamp: string;
  status: 'Success' | 'Failed' | 'Partial';
  recordsProcessed: number;
  recordsFailed: number;
  duration: string;
  initiatedBy: string;
  errorMessage?: string;
}

interface ValidationResult {
  field: string;
  status: 'Valid' | 'Warning' | 'Error';
  message: string;
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>);

};

// Table Component
interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  selectable?: boolean;
  selectedRows?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: () => void;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {selectable &&
            <th className="px-4 py-3 text-left">
                <input
                type="checkbox"
                checked={selectedRows.length === data.length && data.length > 0}
                onChange={onSelectAll}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

              </th>
            }
            {columns.map((column) =>
            <th
              key={column.key}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                {column.header}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, index) =>
          <tr key={row.id || index} className="hover:bg-gray-50 transition-colors">
              {selectable &&
            <td className="px-4 py-3">
                  <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={() => onSelectRow?.(row.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                </td>
            }
              {columns.map((column) =>
            <td key={column.key} className="px-4 py-3 text-sm">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
            )}
            </tr>
          )}
        </tbody>
      </table>
      {data.length === 0 &&
      <div className="text-center py-8 text-gray-500">No data available</div>
      }
    </div>);

}

// Mock Data
const mappingsData: ModuleMapping[] = [
{
  id: '1',
  source: 'Student',
  target: 'Fee',
  type: 'Student-Fee Linking',
  description: 'Links student records to their fee structure based on class and category',
  lastSynced: '10 mins ago',
  lastSyncedDate: '2025-02-20 10:30:00',
  status: 'Synced',
  recordsCount: 1250,
  errorCount: 0,
  autoSync: true,
  syncInterval: 'Every 30 minutes',
  createdBy: 'Admin',
  createdAt: '2024-06-15'
},
{
  id: '2',
  source: 'Employee',
  target: 'Payroll',
  type: 'Salary Structure',
  description: 'Maps employee details to payroll salary components',
  lastSynced: '1 hour ago',
  lastSyncedDate: '2025-02-20 09:40:00',
  status: 'Synced',
  recordsCount: 85,
  errorCount: 0,
  autoSync: true,
  syncInterval: 'Daily at 6:00 AM',
  createdBy: 'HR Admin',
  createdAt: '2024-05-20'
},
{
  id: '3',
  source: 'Student',
  target: 'Transport',
  type: 'Route Assignment',
  description: 'Assigns transport routes and calculates transport fees',
  lastSynced: '2 days ago',
  lastSyncedDate: '2025-02-18 14:20:00',
  status: 'Pending',
  recordsCount: 450,
  errorCount: 12,
  autoSync: false,
  syncInterval: 'Manual',
  createdBy: 'Transport Manager',
  createdAt: '2024-07-01'
},
{
  id: '4',
  source: 'Student',
  target: 'Hostel',
  type: 'Room Allocation',
  description: 'Maps student hostel preferences to room assignments',
  lastSynced: '1 day ago',
  lastSyncedDate: '2025-02-19 08:15:00',
  status: 'Error',
  recordsCount: 200,
  errorCount: 25,
  autoSync: true,
  syncInterval: 'Every 2 hours',
  createdBy: 'Hostel Warden',
  createdAt: '2024-08-10'
},
{
  id: '5',
  source: 'Fee',
  target: 'Account',
  type: 'Posting Mapping',
  description: 'Maps fee collections to accounting ledger entries',
  lastSynced: '5 mins ago',
  lastSyncedDate: '2025-02-20 10:35:00',
  status: 'Synced',
  recordsCount: 3500,
  errorCount: 0,
  autoSync: true,
  syncInterval: 'Real-time',
  createdBy: 'Accountant',
  createdAt: '2024-04-01'
},
{
  id: '6',
  source: 'Attendance',
  target: 'Payroll',
  type: 'Leave Deduction',
  description: 'Maps attendance records to payroll for leave calculations',
  lastSynced: '3 hours ago',
  lastSyncedDate: '2025-02-20 07:40:00',
  status: 'Synced',
  recordsCount: 85,
  errorCount: 2,
  autoSync: true,
  syncInterval: 'Daily at midnight',
  createdBy: 'HR Admin',
  createdAt: '2024-06-01'
},
{
  id: '7',
  source: 'Exam',
  target: 'Report Card',
  type: 'Result Mapping',
  description: 'Maps exam marks to report card generation',
  lastSynced: 'Never',
  lastSyncedDate: '-',
  status: 'Disabled',
  recordsCount: 0,
  errorCount: 0,
  autoSync: false,
  syncInterval: 'Manual',
  createdBy: 'Exam Controller',
  createdAt: '2024-09-15'
}];


const fieldMappingsData: FieldMapping[] = [
{
  id: '1',
  sourceField: 'admission_no',
  sourceType: 'VARCHAR(20)',
  targetField: 'student_id',
  targetType: 'VARCHAR(20)',
  transform: 'Direct Copy',
  transformLogic: 'target = source',
  required: true,
  defaultValue: '',
  status: 'Active'
},
{
  id: '2',
  sourceField: 'class_id',
  sourceType: 'INT',
  targetField: 'fee_category_id',
  targetType: 'INT',
  transform: 'Lookup Table',
  transformLogic: 'SELECT fee_category_id FROM class_fee_mapping WHERE class_id = ?',
  required: true,
  defaultValue: '1',
  status: 'Active'
},
{
  id: '3',
  sourceField: 'transport_route_id',
  sourceType: 'INT',
  targetField: 'transport_fee_head',
  targetType: 'DECIMAL(10,2)',
  transform: 'Conditional',
  transformLogic: 'IF route_id IS NOT NULL THEN lookup_route_fee(route_id) ELSE 0',
  required: false,
  defaultValue: '0',
  status: 'Active'
},
{
  id: '4',
  sourceField: 'hostel_type',
  sourceType: 'ENUM',
  targetField: 'hostel_fee_amount',
  targetType: 'DECIMAL(10,2)',
  transform: 'Lookup Table',
  transformLogic: 'SELECT fee_amount FROM hostel_fee_structure WHERE type = ?',
  required: false,
  defaultValue: '0',
  status: 'Active'
},
{
  id: '5',
  sourceField: 'scholarship_percent',
  sourceType: 'DECIMAL(5,2)',
  targetField: 'discount_amount',
  targetType: 'DECIMAL(10,2)',
  transform: 'Calculation',
  transformLogic: 'discount = total_fee * (scholarship_percent / 100)',
  required: false,
  defaultValue: '0',
  status: 'Active'
},
{
  id: '6',
  sourceField: 'sibling_count',
  sourceType: 'INT',
  targetField: 'sibling_discount',
  targetType: 'DECIMAL(10,2)',
  transform: 'Conditional',
  transformLogic: 'IF sibling_count > 0 THEN calculate_sibling_discount() ELSE 0',
  required: false,
  defaultValue: '0',
  status: 'Inactive'
}];


const syncLogsData: SyncLog[] = [
{
  id: '1',
  mappingId: '1',
  timestamp: '2025-02-20 10:30:00',
  status: 'Success',
  recordsProcessed: 1250,
  recordsFailed: 0,
  duration: '45s',
  initiatedBy: 'Auto Sync'
},
{
  id: '2',
  mappingId: '1',
  timestamp: '2025-02-20 10:00:00',
  status: 'Success',
  recordsProcessed: 1248,
  recordsFailed: 0,
  duration: '42s',
  initiatedBy: 'Auto Sync'
},
{
  id: '3',
  mappingId: '1',
  timestamp: '2025-02-20 09:30:00',
  status: 'Partial',
  recordsProcessed: 1245,
  recordsFailed: 3,
  duration: '48s',
  initiatedBy: 'Auto Sync',
  errorMessage: '3 records skipped due to missing class mapping'
},
{
  id: '4',
  mappingId: '1',
  timestamp: '2025-02-20 09:00:00',
  status: 'Success',
  recordsProcessed: 1242,
  recordsFailed: 0,
  duration: '40s',
  initiatedBy: 'Manual - Admin'
},
{
  id: '5',
  mappingId: '1',
  timestamp: '2025-02-19 18:00:00',
  status: 'Failed',
  recordsProcessed: 0,
  recordsFailed: 1242,
  duration: '5s',
  initiatedBy: 'Auto Sync',
  errorMessage: 'Database connection timeout'
}];


const modulesList = [
'Student',
'Employee',
'Fee',
'Payroll',
'Transport',
'Hostel',
'Account',
'Attendance',
'Exam',
'Report Card',
'Library',
'Inventory'];


const transformTypes = [
{ id: 'direct', name: 'Direct Copy', description: 'Copy value as-is' },
{ id: 'lookup', name: 'Lookup Table', description: 'Map using lookup table' },
{ id: 'conditional', name: 'Conditional', description: 'Apply conditional logic' },
{ id: 'calculation', name: 'Calculation', description: 'Perform calculation' },
{ id: 'concatenate', name: 'Concatenate', description: 'Combine multiple fields' },
{ id: 'split', name: 'Split', description: 'Split field into parts' },
{ id: 'format', name: 'Format', description: 'Apply formatting' },
{ id: 'custom', name: 'Custom Script', description: 'Custom transformation script' }];


// Main Component
export function CrossModuleMappingDesk() {
  // State
  const [mappings, setMappings] = useState<ModuleMapping[]>(mappingsData);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>(fieldMappingsData);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(syncLogsData);
  const [selectedMapping, setSelectedMapping] = useState<ModuleMapping | null>(null);
  const [selectedFieldMapping, setSelectedFieldMapping] = useState<FieldMapping | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedMappingIds, setSelectedMappingIds] = useState<string[]>([]);

  // Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddMappingModal, setShowAddMappingModal] = useState(false);
  const [showEditMappingModal, setShowEditMappingModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showEditFieldModal, setShowEditFieldModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showTransformModal, setShowTransformModal] = useState(false);

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentSyncMapping, setCurrentSyncMapping] = useState<string | null>(null);

  // Validation State
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Form States
  const [newMappingForm, setNewMappingForm] = useState({
    source: '',
    target: '',
    type: '',
    description: '',
    autoSync: false,
    syncInterval: 'Manual'
  });

  const [newFieldForm, setNewFieldForm] = useState({
    sourceField: '',
    sourceType: 'VARCHAR(255)',
    targetField: '',
    targetType: 'VARCHAR(255)',
    transform: 'Direct Copy',
    transformLogic: '',
    required: false,
    defaultValue: ''
  });

  // Active Tab in Detail View
  const [activeDetailTab, setActiveDetailTab] = useState<'fields' | 'history' | 'settings'>('fields');

  // Filter mappings
  const filteredMappings = mappings.filter((mapping) => {
    const matchesSearch =
    mapping.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || mapping.status === filterStatus;
    const matchesSource = filterSource === 'all' || mapping.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Handle row selection
  const handleSelectRow = (id: string) => {
    setSelectedMappingIds((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedMappingIds.length === filteredMappings.length) {
      setSelectedMappingIds([]);
    } else {
      setSelectedMappingIds(filteredMappings.map((m) => m.id));
    }
  };

  // Sync Functions
  const handleSync = async (mappingId: string) => {
    setCurrentSyncMapping(mappingId);
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setSyncProgress(i);
    }

    // Update mapping status
    setMappings((prev) =>
    prev.map((m) =>
    m.id === mappingId ?
    { ...m, status: 'Synced' as const, lastSynced: 'Just now', errorCount: 0 } :
    m
    )
    );

    // Add sync log
    const newLog: SyncLog = {
      id: String(syncLogs.length + 1),
      mappingId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Success',
      recordsProcessed: mappings.find((m) => m.id === mappingId)?.recordsCount || 0,
      recordsFailed: 0,
      duration: '2s',
      initiatedBy: 'Manual - Admin'
    };
    setSyncLogs((prev) => [newLog, ...prev]);

    setIsSyncing(false);
    setCurrentSyncMapping(null);
    setShowSyncModal(false);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    for (const mapping of mappings.filter((m) => m.status !== 'Disabled')) {
      setCurrentSyncMapping(mapping.id);
      setSyncProgress(0);
      for (let i = 0; i <= 100; i += 20) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSyncProgress(i);
      }
    }
    setMappings((prev) =>
    prev.map((m) =>
    m.status !== 'Disabled' ? { ...m, status: 'Synced' as const, lastSynced: 'Just now' } : m
    )
    );
    setIsSyncing(false);
    setCurrentSyncMapping(null);
  };

  // Validation Function
  const handleValidate = async (mappingId: string) => {
    setIsValidating(true);
    setValidationResults([]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const results: ValidationResult[] = [
    { field: 'admission_no → student_id', status: 'Valid', message: 'Mapping is correct' },
    { field: 'class_id → fee_category_id', status: 'Valid', message: 'Lookup table exists and is valid' },
    { field: 'transport_route_id → transport_fee_head', status: 'Warning', message: '12 records have null route_id' },
    { field: 'hostel_type → hostel_fee_amount', status: 'Valid', message: 'All enum values mapped correctly' },
    { field: 'scholarship_percent → discount_amount', status: 'Valid', message: 'Calculation formula is valid' },
    { field: 'sibling_count → sibling_discount', status: 'Error', message: 'Field is inactive but referenced in 5 records' }];


    setValidationResults(results);
    setIsValidating(false);
    setShowValidationModal(true);
  };

  // Add New Mapping
  const handleAddMapping = () => {
    const newMapping: ModuleMapping = {
      id: String(mappings.length + 1),
      source: newMappingForm.source,
      target: newMappingForm.target,
      type: newMappingForm.type,
      description: newMappingForm.description,
      lastSynced: 'Never',
      lastSyncedDate: '-',
      status: 'Pending',
      recordsCount: 0,
      errorCount: 0,
      autoSync: newMappingForm.autoSync,
      syncInterval: newMappingForm.syncInterval,
      createdBy: 'Admin',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMappings((prev) => [...prev, newMapping]);
    setShowAddMappingModal(false);
    setNewMappingForm({
      source: '',
      target: '',
      type: '',
      description: '',
      autoSync: false,
      syncInterval: 'Manual'
    });
  };

  // Delete Mapping
  const handleDeleteMapping = (id: string) => {
    setMappings((prev) => prev.filter((m) => m.id !== id));
    setShowDeleteConfirmModal(false);
    setSelectedMapping(null);
  };

  // Toggle Mapping Status
  const handleToggleStatus = (id: string) => {
    setMappings((prev) =>
    prev.map((m) =>
    m.id === id ?
    { ...m, status: m.status === 'Disabled' ? 'Pending' : 'Disabled' } :
    m
    )
    );
  };

  // Add Field Mapping
  const handleAddFieldMapping = () => {
    const newField: FieldMapping = {
      id: String(fieldMappings.length + 1),
      sourceField: newFieldForm.sourceField,
      sourceType: newFieldForm.sourceType,
      targetField: newFieldForm.targetField,
      targetType: newFieldForm.targetType,
      transform: newFieldForm.transform,
      transformLogic: newFieldForm.transformLogic,
      required: newFieldForm.required,
      defaultValue: newFieldForm.defaultValue,
      status: 'Active'
    };
    setFieldMappings((prev) => [...prev, newField]);
    setShowAddFieldModal(false);
    setNewFieldForm({
      sourceField: '',
      sourceType: 'VARCHAR(255)',
      targetField: '',
      targetType: 'VARCHAR(255)',
      transform: 'Direct Copy',
      transformLogic: '',
      required: false,
      defaultValue: ''
    });
  };

  // Update Field Mapping
  const handleUpdateFieldMapping = () => {
    if (!selectedFieldMapping) return;
    setFieldMappings((prev) =>
    prev.map((f) => f.id === selectedFieldMapping.id ? selectedFieldMapping : f)
    );
    setShowEditFieldModal(false);
    setSelectedFieldMapping(null);
  };

  // Delete Field Mapping
  const handleDeleteFieldMapping = (id: string) => {
    setFieldMappings((prev) => prev.filter((f) => f.id !== id));
  };

  // Toggle Field Status
  const handleToggleFieldStatus = (id: string) => {
    setFieldMappings((prev) =>
    prev.map((f) =>
    f.id === id ? { ...f, status: f.status === 'Active' ? 'Inactive' : 'Active' } : f
    )
    );
  };

  // Get status badge variant
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'Synced':
      case 'Success':
      case 'Active':
      case 'Valid':
        return 'success';
      case 'Pending':
      case 'In Progress':
      case 'Partial':
      case 'Warning':
        return 'warning';
      case 'Error':
      case 'Failed':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Synced':
      case 'Success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'In Progress':
        return <Loader2Icon className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'Pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'Error':
      case 'Failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'Disabled':
        return <PauseIcon className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  // Columns for mappings table
  const mappingColumns: TableColumn<ModuleMapping>[] = [
  {
    key: 'source',
    header: 'Source Module',
    render: (row) =>
    <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded">
            <DatabaseIcon className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">{row.source}</span>
        </div>

  },
  {
    key: 'arrow',
    header: '',
    render: () =>
    <ArrowRightIcon className="w-4 h-4 text-gray-400" />

  },
  {
    key: 'target',
    header: 'Target Module',
    render: (row) =>
    <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-50 rounded">
            <DatabaseIcon className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-medium text-gray-900">{row.target}</span>
        </div>

  },
  {
    key: 'type',
    header: 'Mapping Type',
    render: (row) =>
    <div>
          <span className="font-medium text-gray-900">{row.type}</span>
          <p className="text-xs text-gray-500 truncate max-w-xs">{row.description}</p>
        </div>

  },
  {
    key: 'records',
    header: 'Records',
    render: (row) =>
    <div className="text-sm">
          <span className="font-medium text-gray-900">{row.recordsCount.toLocaleString()}</span>
          {row.errorCount > 0 &&
      <span className="text-red-500 text-xs ml-1">({row.errorCount} errors)</span>
      }
        </div>

  },
  {
    key: 'autoSync',
    header: 'Auto Sync',
    render: (row) =>
    <div className="flex items-center gap-2">
          {row.autoSync ?
      <span className="flex items-center gap-1 text-green-600 text-sm">
              <CheckCircleIcon className="w-4 h-4" />
              {row.syncInterval}
            </span> :

      <span className="text-gray-500 text-sm">Manual</span>
      }
        </div>

  },
  {
    key: 'lastSynced',
    header: 'Last Synced',
    render: (row) =>
    <span className="text-sm text-gray-600">{row.lastSynced}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row) =>
    <div className="flex items-center gap-2">
          {getStatusIcon(row.status)}
          <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => {
          setSelectedMapping(row);
          setShowDetailModal(true);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="View Details">

            <EyeIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
        onClick={() => {
          setSelectedMapping(row);
          handleValidate(row.id);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Validate">

            <CheckCircleIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
        onClick={() => {
          setSelectedMapping(row);
          setShowSyncModal(true);
        }}
        disabled={row.status === 'Disabled' || isSyncing}
        className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
        title="Sync Now">

            {currentSyncMapping === row.id ?
        <Loader2Icon className="w-4 h-4 text-blue-600 animate-spin" /> :

        <RefreshCwIcon className="w-4 h-4 text-blue-600" />
        }
          </button>
          <button
        onClick={() => handleToggleStatus(row.id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title={row.status === 'Disabled' ? 'Enable' : 'Disable'}>

            {row.status === 'Disabled' ?
        <PlayIcon className="w-4 h-4 text-green-600" /> :

        <PauseIcon className="w-4 h-4 text-orange-500" />
        }
          </button>
          <button
        onClick={() => {
          setSelectedMapping(row);
          setShowDeleteConfirmModal(true);
        }}
        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
        title="Delete">

            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>

  }];


  // Columns for field mappings table
  const fieldColumns: TableColumn<FieldMapping>[] = [
  {
    key: 'sourceField',
    header: 'Source Field',
    render: (row) =>
    <div>
          <span className="font-mono text-sm text-gray-900">{row.sourceField}</span>
          <p className="text-xs text-gray-500">{row.sourceType}</p>
        </div>

  },
  {
    key: 'arrow',
    header: '',
    render: () => <ArrowRightIcon className="w-4 h-4 text-gray-400" />
  },
  {
    key: 'targetField',
    header: 'Target Field',
    render: (row) =>
    <div>
          <span className="font-mono text-sm text-gray-900">{row.targetField}</span>
          <p className="text-xs text-gray-500">{row.targetType}</p>
        </div>

  },
  {
    key: 'transform',
    header: 'Transformation',
    render: (row) =>
    <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded">
            {row.transform}
          </span>
          {row.required &&
      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded">Required</span>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row) =>
    <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => {
          setSelectedFieldMapping(row);
          setShowTransformModal(true);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="View Transform Logic">

            <CodeIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
        onClick={() => {
          setSelectedFieldMapping(row);
          setShowEditFieldModal(true);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title="Edit">

            <EditIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button
        onClick={() => handleToggleFieldStatus(row.id)}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        title={row.status === 'Active' ? 'Deactivate' : 'Activate'}>

            {row.status === 'Active' ?
        <PauseIcon className="w-4 h-4 text-orange-500" /> :

        <PlayIcon className="w-4 h-4 text-green-600" />
        }
          </button>
          <button
        onClick={() => handleDeleteFieldMapping(row.id)}
        className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
        title="Delete">

            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>

  }];


  // Columns for sync logs table
  const logColumns: TableColumn<SyncLog>[] = [
  {
    key: 'timestamp',
    header: 'Timestamp',
    render: (row) => <span className="text-sm text-gray-900">{row.timestamp}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) =>
    <div className="flex items-center gap-2">
          {row.status === 'Success' && <CheckCircleIcon className="w-4 h-4 text-green-500" />}
          {row.status === 'Failed' && <XCircleIcon className="w-4 h-4 text-red-500" />}
          {row.status === 'Partial' && <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />}
          <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
        </div>

  },
  {
    key: 'records',
    header: 'Records',
    render: (row) =>
    <div className="text-sm">
          <span className="text-green-600">{row.recordsProcessed} processed</span>
          {row.recordsFailed > 0 &&
      <span className="text-red-500 ml-2">{row.recordsFailed} failed</span>
      }
        </div>

  },
  {
    key: 'duration',
    header: 'Duration',
    render: (row) => <span className="text-sm text-gray-600">{row.duration}</span>
  },
  {
    key: 'initiatedBy',
    header: 'Initiated By',
    render: (row) => <span className="text-sm text-gray-600">{row.initiatedBy}</span>
  },
  {
    key: 'error',
    header: 'Error',
    render: (row) =>
    row.errorMessage ?
    <span className="text-sm text-red-600">{row.errorMessage}</span> :

    <span className="text-sm text-gray-400">-</span>

  }];


  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ArrowLeftRightIcon className="w-7 h-7 text-blue-600" />
            Cross-Module Mapping Desk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage data synchronization and field mappings between modules
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSyncAll}
            disabled={isSyncing}>

            <RefreshCwIcon className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Refresh All'}
          </Button>
          <Button variant="primary" onClick={() => setShowAddMappingModal(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Mapping
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search mappings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />

            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">

                <FilterIcon className="w-4 h-4" />
                Filters
                <ChevronDownIcon className="w-4 h-4" />
              </button>
              {showFilterDropdown &&
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 w-64">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                        <option value="all">All Status</option>
                        <option value="Synced">Synced</option>
                        <option value="Pending">Pending</option>
                        <option value="Error">Error</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Disabled">Disabled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source Module</label>
                      <select
                      value={filterSource}
                      onChange={(e) => setFilterSource(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                        <option value="all">All Modules</option>
                        {modulesList.map((module) =>
                      <option key={module} value={module}>
                            {module}
                          </option>
                      )}
                      </select>
                    </div>
                    <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterSource('all');
                      setShowFilterDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50">

                      Clear Filters
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedMappingIds.length > 0 &&
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedMappingIds.length} selected</span>
                <Button variant="outline" size="sm">
                  <RefreshCwIcon className="w-4 h-4 mr-1" />
                  Sync Selected
                </Button>
                <Button variant="outline" size="sm">
                  <TrashIcon className="w-4 h-4 mr-1 text-red-500" />
                  Delete
                </Button>
              </div>
            }
            <span className="text-sm text-gray-500">
              Showing {filteredMappings.length} of {mappings.length} mappings
            </span>
          </div>
        </div>
      </div>

      {/* Mappings Table */}
      <Card title="Mapping Overview">
        <Table
          columns={mappingColumns}
          data={filteredMappings}
          selectable
          selectedRows={selectedMappingIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll} />

      </Card>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMapping(null);
          setActiveDetailTab('fields');
        }}
        title={`Mapping Detail: ${selectedMapping?.type || ''}`}
        size="xl">

        {selectedMapping &&
        <div className="space-y-6">
            {/* Mapping Info Header */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DatabaseIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMapping.source}</p>
                    <p className="text-xs text-gray-500">Source</p>
                  </div>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DatabaseIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedMapping.target}</p>
                    <p className="text-xs text-gray-500">Target</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedMapping.status)}
                <Badge variant={getStatusVariant(selectedMapping.status)}>
                  {selectedMapping.status}
                </Badge>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Records</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedMapping.recordsCount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Errors</p>
                <p className={`text-lg font-semibold ${selectedMapping.errorCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {selectedMapping.errorCount}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Last Synced</p>
                <p className="text-lg font-semibold text-gray-900">{selectedMapping.lastSynced}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Auto Sync</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedMapping.autoSync ? selectedMapping.syncInterval : 'Off'}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 border-b border-gray-200">
              {[
            { id: 'fields' as const, label: 'Field Mappings', icon: <LayersIcon className="w-4 h-4" /> },
            { id: 'history' as const, label: 'Sync History', icon: <HistoryIcon className="w-4 h-4" /> },
            { id: 'settings' as const, label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> }].
            map((tab) =>
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeDetailTab === tab.id ?
              'border-blue-600 text-blue-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }>

                  {tab.icon}
                  {tab.label}
                </button>
            )}
            </div>

            {/* Tab Content */}
            {activeDetailTab === 'fields' &&
          <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Field Mappings</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowAddFieldModal(true)}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Field
                  </Button>
                </div>
                <Table columns={fieldColumns} data={fieldMappings} />
              </div>
          }

            {activeDetailTab === 'history' &&
          <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">Sync History</h3>
                  <Button variant="outline" size="sm">
                    <DownloadIcon className="w-4 h-4 mr-1" />
                    Export Logs
                  </Button>
                </div>
                <Table columns={logColumns} data={syncLogs.filter((l) => l.mappingId === selectedMapping.id)} />
              </div>
          }

            {activeDetailTab === 'settings' &&
          <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto Sync</label>
                    <div className="flex items-center gap-3">
                      <button
                    onClick={() => {
                      setMappings((prev) =>
                      prev.map((m) =>
                      m.id === selectedMapping.id ? { ...m, autoSync: !m.autoSync } : m
                      )
                      );
                      setSelectedMapping({ ...selectedMapping, autoSync: !selectedMapping.autoSync });
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    selectedMapping.autoSync ? 'bg-blue-600' : 'bg-gray-200'}`
                    }>

                        <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedMapping.autoSync ? 'translate-x-6' : 'translate-x-1'}`
                      } />

                      </button>
                      <span className="text-sm text-gray-600">
                        {selectedMapping.autoSync ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sync Interval</label>
                    <select
                  value={selectedMapping.syncInterval}
                  onChange={(e) => {
                    setMappings((prev) =>
                    prev.map((m) =>
                    m.id === selectedMapping.id ? { ...m, syncInterval: e.target.value } : m
                    )
                    );
                    setSelectedMapping({ ...selectedMapping, syncInterval: e.target.value });
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!selectedMapping.autoSync}>

                      <option value="Real-time">Real-time</option>
                      <option value="Every 5 minutes">Every 5 minutes</option>
                      <option value="Every 15 minutes">Every 15 minutes</option>
                      <option value="Every 30 minutes">Every 30 minutes</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily at 6:00 AM">Daily at 6:00 AM</option>
                      <option value="Daily at midnight">Daily at midnight</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                value={selectedMapping.description}
                onChange={(e) => {
                  setMappings((prev) =>
                  prev.map((m) =>
                  m.id === selectedMapping.id ? { ...m, description: e.target.value } : m
                  )
                  );
                  setSelectedMapping({ ...selectedMapping, description: e.target.value });
                }}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Created By</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMapping.createdBy}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Created At</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMapping.createdAt}</p>
                  </div>
                </div>
              </div>
          }

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                variant="outline"
                onClick={() => handleValidate(selectedMapping.id)}
                disabled={isValidating}>

                  {isValidating ?
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> :

                <CheckCircleIcon className="w-4 h-4 mr-2" />
                }
                  Validate
                </Button>
                <Button
                variant="primary"
                onClick={() => handleSync(selectedMapping.id)}
                disabled={selectedMapping.status === 'Disabled' || isSyncing}>

                  {isSyncing && currentSyncMapping === selectedMapping.id ?
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> :

                <LinkIcon className="w-4 h-4 mr-2" />
                }
                  Sync Now
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Add Mapping Modal */}
      <Modal
        isOpen={showAddMappingModal}
        onClose={() => setShowAddMappingModal(false)}
        title="Add New Mapping"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Module</label>
              <select
                value={newMappingForm.source}
                onChange={(e) => setNewMappingForm({ ...newMappingForm, source: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="">Select source module...</option>
                {modulesList.map((module) =>
                <option key={module} value={module}>
                    {module}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Module</label>
              <select
                value={newMappingForm.target}
                onChange={(e) => setNewMappingForm({ ...newMappingForm, target: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="">Select target module...</option>
                {modulesList.map((module) =>
                <option key={module} value={module}>
                    {module}
                  </option>
                )}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mapping Type</label>
            <input
              type="text"
              value={newMappingForm.type}
              onChange={(e) => setNewMappingForm({ ...newMappingForm, type: e.target.value })}
              placeholder="e.g., Student-Fee Linking"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={newMappingForm.description}
              onChange={(e) => setNewMappingForm({ ...newMappingForm, description: e.target.value })}
              rows={3}
              placeholder="Describe the purpose of this mapping..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoSync"
                checked={newMappingForm.autoSync}
                onChange={(e) => setNewMappingForm({ ...newMappingForm, autoSync: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

              <label htmlFor="autoSync" className="text-sm text-gray-700">
                Enable Auto Sync
              </label>
            </div>
            {newMappingForm.autoSync &&
            <select
              value={newMappingForm.syncInterval}
              onChange={(e) => setNewMappingForm({ ...newMappingForm, syncInterval: e.target.value })}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="Real-time">Real-time</option>
                <option value="Every 5 minutes">Every 5 minutes</option>
                <option value="Every 15 minutes">Every 15 minutes</option>
                <option value="Every 30 minutes">Every 30 minutes</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
              </select>
            }
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddMappingModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMapping}
              disabled={!newMappingForm.source || !newMappingForm.target || !newMappingForm.type}>

              <PlusIcon className="w-4 h-4 mr-2" />
              Create Mapping
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Field Mapping Modal */}
      <Modal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        title="Add Field Mapping"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Field</label>
              <input
                type="text"
                value={newFieldForm.sourceField}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, sourceField: e.target.value })}
                placeholder="e.g., admission_no"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source Type</label>
              <select
                value={newFieldForm.sourceType}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, sourceType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="VARCHAR(255)">VARCHAR(255)</option>
                <option value="VARCHAR(50)">VARCHAR(50)</option>
                <option value="VARCHAR(20)">VARCHAR(20)</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                <option value="DATE">DATE</option>
                <option value="DATETIME">DATETIME</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="TEXT">TEXT</option>
                <option value="ENUM">ENUM</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Field</label>
              <input
                type="text"
                value={newFieldForm.targetField}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, targetField: e.target.value })}
                placeholder="e.g., student_id"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Type</label>
              <select
                value={newFieldForm.targetType}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, targetType: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="VARCHAR(255)">VARCHAR(255)</option>
                <option value="VARCHAR(50)">VARCHAR(50)</option>
                <option value="VARCHAR(20)">VARCHAR(20)</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                <option value="DATE">DATE</option>
                <option value="DATETIME">DATETIME</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="TEXT">TEXT</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transformation Type</label>
            <div className="grid grid-cols-4 gap-2">
              {transformTypes.map((t) =>
              <button
                key={t.id}
                onClick={() => setNewFieldForm({ ...newFieldForm, transform: t.name })}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                newFieldForm.transform === t.name ?
                'border-blue-500 bg-blue-50' :
                'border-gray-200 hover:border-gray-300'}`
                }>

                  <p className="text-sm font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.description}</p>
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transformation Logic</label>
            <textarea
              value={newFieldForm.transformLogic}
              onChange={(e) => setNewFieldForm({ ...newFieldForm, transformLogic: e.target.value })}
              rows={3}
              placeholder="Enter transformation logic or SQL expression..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={newFieldForm.required}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, required: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

              <label htmlFor="required" className="text-sm text-gray-700">
                Required Field
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Value</label>
              <input
                type="text"
                value={newFieldForm.defaultValue}
                onChange={(e) => setNewFieldForm({ ...newFieldForm, defaultValue: e.target.value })}
                placeholder="Default value if source is null"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddFieldModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddFieldMapping}
              disabled={!newFieldForm.sourceField || !newFieldForm.targetField}>

              <PlusIcon className="w-4 h-4 mr-2" />
              Add Field Mapping
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Field Mapping Modal */}
      <Modal
        isOpen={showEditFieldModal}
        onClose={() => {
          setShowEditFieldModal(false);
          setSelectedFieldMapping(null);
        }}
        title="Edit Field Mapping"
        size="lg">

        {selectedFieldMapping &&
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source Field</label>
                <input
                type="text"
                value={selectedFieldMapping.sourceField}
                onChange={(e) =>
                setSelectedFieldMapping({ ...selectedFieldMapping, sourceField: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Field</label>
                <input
                type="text"
                value={selectedFieldMapping.targetField}
                onChange={(e) =>
                setSelectedFieldMapping({ ...selectedFieldMapping, targetField: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transformation Logic</label>
              <textarea
              value={selectedFieldMapping.transformLogic}
              onChange={(e) =>
              setSelectedFieldMapping({ ...selectedFieldMapping, transformLogic: e.target.value })
              }
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />

            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowEditFieldModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateFieldMapping}>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Sync Modal */}
      <Modal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        title="Sync Mapping"
        size="md">

        {selectedMapping &&
        <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <RefreshCwIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{selectedMapping.type}</p>
                  <p className="text-sm text-blue-700">
                    {selectedMapping.source} → {selectedMapping.target}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                This will synchronize <strong>{selectedMapping.recordsCount.toLocaleString()}</strong> records
                from {selectedMapping.source} to {selectedMapping.target}.
              </p>
            </div>
            {isSyncing &&
          <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Syncing...</span>
                  <span>{syncProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }} />

                </div>
              </div>
          }
            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowSyncModal(false)} disabled={isSyncing}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={() => handleSync(selectedMapping.id)}
              disabled={isSyncing}>

                {isSyncing ?
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> :

              <RefreshCwIcon className="w-4 h-4 mr-2" />
              }
                {isSyncing ? 'Syncing...' : 'Start Sync'}
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Validation Results Modal */}
      <Modal
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        title="Validation Results"
        size="lg">

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {validationResults.filter((r) => r.status === 'Valid').length}
              </p>
              <p className="text-xs text-gray-500">Valid</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {validationResults.filter((r) => r.status === 'Warning').length}
              </p>
              <p className="text-xs text-gray-500">Warnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {validationResults.filter((r) => r.status === 'Error').length}
              </p>
              <p className="text-xs text-gray-500">Errors</p>
            </div>
          </div>
          <div className="space-y-2">
            {validationResults.map((result, index) =>
            <div
              key={index}
              className={`p-3 rounded-lg border ${
              result.status === 'Valid' ?
              'bg-green-50 border-green-200' :
              result.status === 'Warning' ?
              'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'}`
              }>

                <div className="flex items-start gap-3">
                  {result.status === 'Valid' && <CheckCircleIcon className="w-5 h-5 text-green-600" />}
                  {result.status === 'Warning' && <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />}
                  {result.status === 'Error' && <XCircleIcon className="w-5 h-5 text-red-600" />}
                  <div>
                    <p className="font-medium text-gray-900">{result.field}</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end pt-4 border-t">
            <Button variant="primary" onClick={() => setShowValidationModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Transform Logic Modal */}
      <Modal
        isOpen={showTransformModal}
        onClose={() => {
          setShowTransformModal(false);
          setSelectedFieldMapping(null);
        }}
        title="Transformation Logic"
        size="md">

        {selectedFieldMapping &&
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-sm text-blue-600">{selectedFieldMapping.sourceField}</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                <span className="font-mono text-sm text-green-600">{selectedFieldMapping.targetField}</span>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                {selectedFieldMapping.transform}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logic / Expression</label>
              <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-sm font-mono overflow-x-auto">
                {selectedFieldMapping.transformLogic}
              </pre>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Required</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFieldMapping.required ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Default Value</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFieldMapping.defaultValue || 'None'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => setShowTransformModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => {
          setShowDeleteConfirmModal(false);
          setSelectedMapping(null);
        }}
        title="Delete Mapping"
        size="sm">

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
            <AlertTriangleIcon className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Are you sure?</p>
              <p className="text-sm text-red-700">
                This will permanently delete the mapping and all associated field configurations.
              </p>
            </div>
          </div>
          {selectedMapping &&
          <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>{selectedMapping.type}</strong>
                <br />
                {selectedMapping.source} → {selectedMapping.target}
              </p>
            </div>
          }
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDeleteConfirmModal(false)}>
              Cancel
            </Button>
            <button
              onClick={() => selectedMapping && handleDeleteMapping(selectedMapping.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">

              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>);

}