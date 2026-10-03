import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Link2,
  Save,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
  ArrowRightLeft,
  FileJson,
  Search,
  Info,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  Check,
  Clock,
  Building,
  Layers,
  FileText,
  ArrowRight,
  Zap,
  Filter,
  Copy,
  History,
  BookOpen,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  RotateCw,
  Database,
  Link,
  Unlink,
  GitBranch,
  Terminal,
  Code,
  FileSpreadsheet } from
'lucide-react';

// Types
interface GLAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Income' | 'Expense' | 'Equity';
  category: string;
  balance: number;
  isActive: boolean;
}

interface ChargeMapping {
  id: string;
  chargeId: string;
  chargeName: string;
  chargeCode: string;
  chargeCategory: string;
  chargeType: 'Fine' | 'Event' | 'Exam' | 'Material' | 'Transport' | 'Activity' | 'Other';
  creditAccountId: string;
  creditAccountName: string;
  debitAccountId: string;
  debitAccountName: string;
  taxApplicable: boolean;
  taxAccountId: string | null;
  costCenter: string | null;
  status: 'Mapped' | 'Unmapped' | 'Partial' | 'Error';
  lastSynced: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isAutoPosting: boolean;
  postingFrequency: 'Immediate' | 'Daily' | 'Weekly' | 'Monthly';
  validationRules: string[];
}

interface SyncLog {
  id: string;
  timestamp: string;
  type: 'Auto' | 'Manual';
  status: 'Success' | 'Failed' | 'Partial';
  mappingsUpdated: number;
  entriesPosted: number;
  errors: number;
  duration: string;
  initiatedBy: string;
}

export function ChargeAccountMapping() {
  // State Management
  const [activeTab, setActiveTab] = useState<'mappings' | 'accounts' | 'rules' | 'logs'>('mappings');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMappings, setSelectedMappings] = useState<string[]>([]);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<ChargeMapping | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    chargeType: 'all',
    accountType: 'all',
    postingStatus: 'all'
  });

  // Mapping Form State
  const [mappingForm, setMappingForm] = useState({
    chargeId: '',
    creditAccountId: '',
    debitAccountId: '',
    taxApplicable: false,
    taxAccountId: '',
    costCenter: '',
    isAutoPosting: true,
    postingFrequency: 'Immediate'
  });

  // Mock GL Accounts Data
  const glAccounts: GLAccount[] = [
  // Asset Accounts
  { id: 'gl_10001', code: '10001', name: 'Bank Account - Main', type: 'Asset', category: 'Bank', balance: 5000000, isActive: true },
  { id: 'gl_10002', code: '10002', name: 'Bank Account - Fee Collection', type: 'Asset', category: 'Bank', balance: 2500000, isActive: true },
  { id: 'gl_10005', code: '10005', name: 'Petty Cash Account', type: 'Asset', category: 'Cash', balance: 50000, isActive: true },
  { id: 'gl_10010', code: '10010', name: 'POS Settlement Account', type: 'Asset', category: 'Bank', balance: 125000, isActive: true },
  { id: 'gl_10015', code: '10015', name: 'UPI Collection Account', type: 'Asset', category: 'Bank', balance: 350000, isActive: true },
  // Liability Accounts
  { id: 'gl_20001', code: '20001', name: 'Fees Received in Advance', type: 'Liability', category: 'Current Liability', balance: 1200000, isActive: true },
  { id: 'gl_20002', code: '20002', name: 'Caution Money Payable', type: 'Liability', category: 'Current Liability', balance: 850000, isActive: true },
  { id: 'gl_20003', code: '20003', name: 'Security Deposit Payable', type: 'Liability', category: 'Current Liability', balance: 450000, isActive: true },
  { id: 'gl_20010', code: '20010', name: 'GST Payable', type: 'Liability', category: 'Tax Liability', balance: 125000, isActive: true },
  // Income Accounts
  { id: 'gl_40001', code: '40001', name: 'Miscellaneous Income', type: 'Income', category: 'Other Income', balance: 250000, isActive: true },
  { id: 'gl_40005', code: '40005', name: 'Penalty & Fines Revenue', type: 'Income', category: 'Fee Income', balance: 180000, isActive: true },
  { id: 'gl_40010', code: '40010', name: 'Library Charges Income', type: 'Income', category: 'Fee Income', balance: 95000, isActive: true },
  { id: 'gl_40012', code: '40012', name: 'Document Reissue Income', type: 'Income', category: 'Fee Income', balance: 45000, isActive: true },
  { id: 'gl_40015', code: '40015', name: 'Lab Charges Income', type: 'Income', category: 'Fee Income', balance: 125000, isActive: true },
  { id: 'gl_40020', code: '40020', name: 'Event & Activity Income', type: 'Income', category: 'Fee Income', balance: 350000, isActive: true },
  { id: 'gl_40025', code: '40025', name: 'Examination Fee Income', type: 'Income', category: 'Fee Income', balance: 275000, isActive: true },
  { id: 'gl_40030', code: '40030', name: 'Transport Charges Income', type: 'Income', category: 'Fee Income', balance: 450000, isActive: true },
  // Expense Accounts
  { id: 'gl_50001', code: '50001', name: 'Bank Charges', type: 'Expense', category: 'Administrative', balance: 15000, isActive: true },
  { id: 'gl_50002', code: '50002', name: 'Payment Gateway Charges', type: 'Expense', category: 'Administrative', balance: 25000, isActive: true }];


  // Mock Charge Mappings Data
  const [chargeMappings, setChargeMappings] = useState<ChargeMapping[]>([
  {
    id: 'MAP001',
    chargeId: 'CHG001',
    chargeName: 'Library Fine',
    chargeCode: 'LIB-FINE',
    chargeCategory: 'Library',
    chargeType: 'Fine',
    creditAccountId: 'gl_40010',
    creditAccountName: 'Library Charges Income (40010)',
    debitAccountId: 'gl_10005',
    debitAccountName: 'Petty Cash Account (10005)',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: 'CC001',
    status: 'Mapped',
    lastSynced: '2024-03-15 10:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0', 'Student ID Required']
  },
  {
    id: 'MAP002',
    chargeId: 'CHG002',
    chargeName: 'ID Card Replacement',
    chargeCode: 'ID-REPL',
    chargeCategory: 'Administrative',
    chargeType: 'Material',
    creditAccountId: 'gl_40012',
    creditAccountName: 'Document Reissue Income (40012)',
    debitAccountId: 'gl_10001',
    debitAccountName: 'Bank Account - Main (10001)',
    taxApplicable: true,
    taxAccountId: 'gl_20010',
    costCenter: 'CC002',
    status: 'Mapped',
    lastSynced: '2024-03-14 15:45:00',
    createdAt: '2024-01-05',
    updatedAt: '2024-03-14',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0']
  },
  {
    id: 'MAP003',
    chargeId: 'CHG003',
    chargeName: 'Caution Money',
    chargeCode: 'CAU-MON',
    chargeCategory: 'Security',
    chargeType: 'Other',
    creditAccountId: 'gl_20002',
    creditAccountName: 'Caution Money Payable (20002)',
    debitAccountId: 'gl_10001',
    debitAccountName: 'Bank Account - Main (10001)',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: null,
    status: 'Mapped',
    lastSynced: '2024-03-15 09:00:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0', 'One time per student']
  },
  {
    id: 'MAP004',
    chargeId: 'CHG004',
    chargeName: 'Lab Breakage Fee',
    chargeCode: 'LAB-BRK',
    chargeCategory: 'Laboratory',
    chargeType: 'Fine',
    creditAccountId: '',
    creditAccountName: '',
    debitAccountId: '',
    debitAccountName: '',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: null,
    status: 'Unmapped',
    lastSynced: null,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    createdBy: 'Admin',
    isAutoPosting: false,
    postingFrequency: 'Immediate',
    validationRules: []
  },
  {
    id: 'MAP005',
    chargeId: 'CHG005',
    chargeName: 'Annual Sports Kit Fee',
    chargeCode: 'SPT-KIT',
    chargeCategory: 'Sports',
    chargeType: 'Activity',
    creditAccountId: 'gl_40020',
    creditAccountName: 'Event & Activity Income (40020)',
    debitAccountId: 'gl_10002',
    debitAccountName: 'Bank Account - Fee Collection (10002)',
    taxApplicable: true,
    taxAccountId: 'gl_20010',
    costCenter: 'CC003',
    status: 'Mapped',
    lastSynced: '2024-03-15 11:00:00',
    createdAt: '2024-01-10',
    updatedAt: '2024-03-15',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Daily',
    validationRules: ['Amount > 0']
  },
  {
    id: 'MAP006',
    chargeId: 'CHG006',
    chargeName: 'Science Olympiad Fee',
    chargeCode: 'SCI-OLY',
    chargeCategory: 'Competition',
    chargeType: 'Exam',
    creditAccountId: 'gl_40025',
    creditAccountName: 'Examination Fee Income (40025)',
    debitAccountId: '',
    debitAccountName: '',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: 'CC004',
    status: 'Partial',
    lastSynced: '2024-03-10 14:30:00',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-10',
    createdBy: 'Admin',
    isAutoPosting: false,
    postingFrequency: 'Immediate',
    validationRules: []
  },
  {
    id: 'MAP007',
    chargeId: 'CHG007',
    chargeName: 'Transport Fine',
    chargeCode: 'TRN-FIN',
    chargeCategory: 'Transport',
    chargeType: 'Fine',
    creditAccountId: 'gl_40030',
    creditAccountName: 'Transport Charges Income (40030)',
    debitAccountId: 'gl_10001',
    debitAccountName: 'Bank Account - Main (10001)',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: 'CC005',
    status: 'Mapped',
    lastSynced: '2024-03-15 08:45:00',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-15',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0']
  },
  {
    id: 'MAP008',
    chargeId: 'CHG008',
    chargeName: 'Late Fee Submission Fine',
    chargeCode: 'LTE-FEE',
    chargeCategory: 'Administrative',
    chargeType: 'Fine',
    creditAccountId: 'gl_40005',
    creditAccountName: 'Penalty & Fines Revenue (40005)',
    debitAccountId: 'gl_10001',
    debitAccountName: 'Bank Account - Main (10001)',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: null,
    status: 'Mapped',
    lastSynced: '2024-03-15 12:00:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-15',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0', 'Days Late > 0']
  },
  {
    id: 'MAP009',
    chargeId: 'CHG009',
    chargeName: 'Art Supplies',
    chargeCode: 'ART-SUP',
    chargeCategory: 'Academic',
    chargeType: 'Material',
    creditAccountId: '',
    creditAccountName: '',
    debitAccountId: '',
    debitAccountName: '',
    taxApplicable: true,
    taxAccountId: null,
    costCenter: null,
    status: 'Unmapped',
    lastSynced: null,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    createdBy: 'Admin',
    isAutoPosting: false,
    postingFrequency: 'Immediate',
    validationRules: []
  },
  {
    id: 'MAP010',
    chargeId: 'CHG010',
    chargeName: 'Security Deposit',
    chargeCode: 'SEC-DEP',
    chargeCategory: 'Security',
    chargeType: 'Other',
    creditAccountId: 'gl_20003',
    creditAccountName: 'Security Deposit Payable (20003)',
    debitAccountId: 'gl_10001',
    debitAccountName: 'Bank Account - Main (10001)',
    taxApplicable: false,
    taxAccountId: null,
    costCenter: null,
    status: 'Mapped',
    lastSynced: '2024-03-14 16:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-14',
    createdBy: 'Admin',
    isAutoPosting: true,
    postingFrequency: 'Immediate',
    validationRules: ['Amount > 0']
  }]
  );

  // Mock Sync Logs
  const syncLogs: SyncLog[] = [
  {
    id: 'LOG001',
    timestamp: '2024-03-15 12:00:00',
    type: 'Auto',
    status: 'Success',
    mappingsUpdated: 8,
    entriesPosted: 45,
    errors: 0,
    duration: '2.3s',
    initiatedBy: 'System'
  },
  {
    id: 'LOG002',
    timestamp: '2024-03-15 08:00:00',
    type: 'Auto',
    status: 'Success',
    mappingsUpdated: 8,
    entriesPosted: 23,
    errors: 0,
    duration: '1.8s',
    initiatedBy: 'System'
  },
  {
    id: 'LOG003',
    timestamp: '2024-03-14 18:30:00',
    type: 'Manual',
    status: 'Partial',
    mappingsUpdated: 6,
    entriesPosted: 67,
    errors: 2,
    duration: '4.5s',
    initiatedBy: 'Mr. Rajesh Kumar'
  },
  {
    id: 'LOG004',
    timestamp: '2024-03-14 12:00:00',
    type: 'Auto',
    status: 'Success',
    mappingsUpdated: 7,
    entriesPosted: 34,
    errors: 0,
    duration: '2.1s',
    initiatedBy: 'System'
  },
  {
    id: 'LOG005',
    timestamp: '2024-03-13 18:00:00',
    type: 'Auto',
    status: 'Failed',
    mappingsUpdated: 0,
    entriesPosted: 0,
    errors: 1,
    duration: '0.5s',
    initiatedBy: 'System'
  }];


  // Statistics
  const stats = useMemo(() => {
    const total = chargeMappings.length;
    const mapped = chargeMappings.filter((m) => m.status === 'Mapped').length;
    const unmapped = chargeMappings.filter((m) => m.status === 'Unmapped').length;
    const partial = chargeMappings.filter((m) => m.status === 'Partial').length;
    const autoPosting = chargeMappings.filter((m) => m.isAutoPosting).length;
    const withTax = chargeMappings.filter((m) => m.taxApplicable).length;

    return {
      total,
      mapped,
      unmapped,
      partial,
      autoPosting,
      withTax,
      mappingPercentage: (mapped / total * 100).toFixed(1)
    };
  }, [chargeMappings]);

  // Filter mappings
  const filteredMappings = useMemo(() => {
    return chargeMappings.filter((mapping) => {
      const matchesSearch =
      mapping.chargeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.chargeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mapping.creditAccountName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || mapping.status === filters.status;
      const matchesType = filters.chargeType === 'all' || mapping.chargeType === filters.chargeType;
      const matchesPosting =
      filters.postingStatus === 'all' ||
      filters.postingStatus === 'auto' && mapping.isAutoPosting ||
      filters.postingStatus === 'manual' && !mapping.isAutoPosting;

      return matchesSearch && matchesStatus && matchesType && matchesPosting;
    });
  }, [searchTerm, filters, chargeMappings]);

  // Handle sync
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('Sync completed successfully!');
    }, 2000);
  };

  // Handle save mapping
  const handleSaveMapping = () => {
    alert('Mapping saved successfully!');
    setShowMappingModal(false);
    setEditingMapping(null);
  };

  // Handle auto-suggest
  const handleAutoSuggest = () => {
    alert('Auto-suggestion applied to unmapped charges based on charge category and type');
  };

  // Export mappings
  const exportMappings = (format: string) => {
    alert(`Exporting mappings as ${format.toUpperCase()}`);
  };

  // Import mappings
  const importMappings = () => {
    alert('Import mappings from file');
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Mapped':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Mapped
          </Badge>);

      case 'Unmapped':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Unmapped
          </Badge>);

      case 'Partial':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Partial
          </Badge>);

      case 'Error':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <X className="w-3 h-3" />
            Error
          </Badge>);

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Get account type color
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset':
        return 'text-blue-600 bg-blue-50';
      case 'Liability':
        return 'text-orange-600 bg-orange-50';
      case 'Income':
        return 'text-green-600 bg-green-50';
      case 'Expense':
        return 'text-red-600 bg-red-50';
      case 'Equity':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Mapping table columns
  const mappingColumns = [
  {
    key: 'select',
    header:
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedMappings.length === filteredMappings.length && filteredMappings.length > 0}
      onChange={(e) =>
      setSelectedMappings(e.target.checked ? filteredMappings.map((m) => m.id) : [])
      } />,


    render: (row: ChargeMapping) =>
    <input
      type="checkbox"
      className="rounded border-gray-300"
      checked={selectedMappings.includes(row.id)}
      onChange={() =>
      setSelectedMappings((prev) =>
      prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id]
      )
      } />


  },
  {
    key: 'charge',
    header: 'Charge Details',
    render: (row: ChargeMapping) =>
    <div className="flex items-center gap-3">
          <div
        className={`w-1.5 h-12 rounded-full ${
        row.status === 'Mapped' ?
        'bg-green-500' :
        row.status === 'Partial' ?
        'bg-yellow-500' :
        'bg-red-500'}`
        } />

          <div>
            <div className="font-medium text-gray-900">{row.chargeName}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="font-mono">{row.chargeCode}</span>
              <span>•</span>
              <span>{row.chargeCategory}</span>
            </div>
            <Badge variant="default" className="text-xs mt-1">
              {row.chargeType}
            </Badge>
          </div>
        </div>

  },
  {
    key: 'arrow',
    header: '',
    render: () =>
    <div className="flex justify-center">
          <ArrowRightLeft className="w-4 h-4 text-gray-300" />
        </div>

  },
  {
    key: 'creditAccount',
    header: 'Credit Account (Income/Liability)',
    render: (row: ChargeMapping) =>
    <div className="min-w-[220px]">
          {row.creditAccountId ?
      <div className="p-2 bg-green-50 rounded-lg border border-green-200">
              <div className="font-medium text-green-800 text-sm">
                {row.creditAccountName.split('(')[0].trim()}
              </div>
              <div className="text-xs text-green-600 font-mono">
                {row.creditAccountName.match(/\(([^)]+)\)/)?.[1]}
              </div>
            </div> :

      <div className="p-2 bg-red-50 rounded-lg border border-red-200 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Not Configured
            </div>
      }
        </div>

  },
  {
    key: 'debitAccount',
    header: 'Debit Account (Asset/Bank)',
    render: (row: ChargeMapping) =>
    <div className="min-w-[220px]">
          {row.debitAccountId ?
      <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="font-medium text-blue-800 text-sm">
                {row.debitAccountName.split('(')[0].trim()}
              </div>
              <div className="text-xs text-blue-600 font-mono">
                {row.debitAccountName.match(/\(([^)]+)\)/)?.[1]}
              </div>
            </div> :

      <div className="p-2 bg-red-50 rounded-lg border border-red-200 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Not Configured
            </div>
      }
        </div>

  },
  {
    key: 'settings',
    header: 'Settings',
    render: (row: ChargeMapping) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            {row.isAutoPosting ?
        <Badge variant="success" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Auto
              </Badge> :

        <Badge variant="default" className="text-xs">
                <Pause className="w-3 h-3 mr-1" />
                Manual
              </Badge>
        }
            {row.taxApplicable &&
        <Badge variant="info" className="text-xs">
                GST
              </Badge>
        }
          </div>
          {row.costCenter &&
      <div className="text-xs text-gray-500">
              CC: {row.costCenter}
            </div>
      }
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: ChargeMapping) =>
    <div className="space-y-1">
          {getStatusBadge(row.status)}
          {row.lastSynced &&
      <div className="text-xs text-gray-400">
              Synced: {new Date(row.lastSynced).toLocaleDateString()}
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: ChargeMapping) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="sm"
        title="Edit Mapping"
        onClick={() => {
          setEditingMapping(row);
          setShowMappingModal(true);
        }}>

            <Edit className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Preview Journal Entry"
        onClick={() => {
          setEditingMapping(row);
          setShowPreviewModal(true);
        }}>

            <Eye className="w-4 h-4 text-purple-600" />
          </Button>
          <Button
        variant="ghost"
        size="sm"
        title="Copy Mapping">

            <Copy className="w-4 h-4 text-gray-600" />
          </Button>
          {row.status === 'Unmapped' &&
      <Button
        variant="ghost"
        size="sm"
        title="Auto-Suggest">

              <Zap className="w-4 h-4 text-yellow-600" />
            </Button>
      }
        </div>

  }];


  // GL Accounts table columns
  const accountColumns = [
  {
    key: 'code',
    header: 'Account Code',
    render: (row: GLAccount) =>
    <span className="font-mono font-medium">{row.code}</span>

  },
  {
    key: 'name',
    header: 'Account Name',
    render: (row: GLAccount) =>
    <div className="font-medium text-gray-900">{row.name}</div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: GLAccount) =>
    <span className={`px-2 py-1 rounded text-xs font-medium ${getAccountTypeColor(row.type)}`}>
          {row.type}
        </span>

  },
  {
    key: 'category',
    header: 'Category',
    render: (row: GLAccount) => <span className="text-sm">{row.category}</span>
  },
  {
    key: 'balance',
    header: 'Balance',
    render: (row: GLAccount) =>
    <span className="font-medium">₹{row.balance.toLocaleString()}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: GLAccount) =>
    <Badge variant={row.isActive ? 'success' : 'default'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>

  }];


  // Sync logs table columns
  const logColumns = [
  {
    key: 'timestamp',
    header: 'Date & Time',
    render: (row: SyncLog) =>
    <div className="text-sm">
          <div>{new Date(row.timestamp).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(row.timestamp).toLocaleTimeString()}
          </div>
        </div>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: SyncLog) =>
    <Badge variant={row.type === 'Auto' ? 'info' : 'default'}>{row.type}</Badge>

  },
  {
    key: 'stats',
    header: 'Statistics',
    render: (row: SyncLog) =>
    <div className="text-sm space-y-1">
          <div>
            <span className="text-gray-500">Mappings:</span>{' '}
            <span className="font-medium">{row.mappingsUpdated}</span>
          </div>
          <div>
            <span className="text-gray-500">Entries:</span>{' '}
            <span className="font-medium text-green-600">{row.entriesPosted}</span>
          </div>
          {row.errors > 0 &&
      <div>
              <span className="text-gray-500">Errors:</span>{' '}
              <span className="font-medium text-red-600">{row.errors}</span>
            </div>
      }
        </div>

  },
  {
    key: 'duration',
    header: 'Duration',
    render: (row: SyncLog) => <span className="text-sm">{row.duration}</span>
  },
  {
    key: 'initiatedBy',
    header: 'Initiated By',
    render: (row: SyncLog) => <span className="text-sm">{row.initiatedBy}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: SyncLog) =>
    <Badge
      variant={
      row.status === 'Success' ? 'success' : row.status === 'Failed' ? 'danger' : 'warning'
      }>

          {row.status}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: SyncLog) =>
    <Button variant="ghost" size="sm" title="View Details">
          <Eye className="w-4 h-4 text-blue-600" />
        </Button>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Charge Account Mapping
            <Link2 className="w-7 h-7 text-blue-600" />
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure GL account mappings for charge receipts and enable automatic journal posting
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">Auto-Sync:</span>
            <button
              className={`relative w-12 h-6 rounded-full transition-colors ${
              isAutoSyncEnabled ? 'bg-green-500' : 'bg-gray-300'}`
              }
              onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}>

              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                isAutoSyncEnabled ? 'translate-x-7' : 'translate-x-1'}`
                } />

            </button>
          </div>
          <Button variant="outline" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ?
            <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> :

            <RefreshCcw className="w-4 h-4 mr-2" />
            }
            Sync Now
          </Button>
          <Button variant="primary" onClick={() => setShowMappingModal(true)}>
            <Save className="w-4 h-4 mr-2" />
            Save All Mappings
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileJson className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Total Charges</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Mapped</p>
              <p className="text-xl font-bold text-green-600">{stats.mapped}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Unmapped</p>
              <p className="text-xl font-bold text-red-600">{stats.unmapped}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Partial</p>
              <p className="text-xl font-bold text-yellow-600">{stats.partial}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Auto-Posting</p>
              <p className="text-xl font-bold text-purple-600">{stats.autoPosting}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase">Mapping %</p>
              <p className="text-xl font-bold text-orange-600">{stats.mappingPercentage}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Connected to Tally Prime</span>
            </div>
            <div className="text-sm text-gray-500">
              Last Sync: <span className="font-medium">Today, 12:00 PM</span>
            </div>
            <div className="text-sm text-gray-500">
              Next Auto-Sync: <span className="font-medium">Today, 06:00 PM</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Integration Settings
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Tally
            </Button>
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {[
        { id: 'mappings', label: 'Charge Mappings', icon: Link, count: stats.total },
        { id: 'accounts', label: 'GL Accounts', icon: Building, count: glAccounts.length },
        { id: 'rules', label: 'Posting Rules', icon: GitBranch },
        { id: 'logs', label: 'Sync Logs', icon: History, count: syncLogs.length }].
        map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id ?
              'border-blue-600 text-blue-600' :
              'border-transparent text-gray-500 hover:text-gray-700'}`
              }
              onClick={() => setActiveTab(tab.id as any)}>

              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined &&
              <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                  {tab.count}
                </span>
              }
            </button>);

        })}
      </div>

      {/* Mappings Tab */}
      {activeTab === 'mappings' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search by charge name, code, or account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'Mapped', label: 'Mapped' },
                { value: 'Unmapped', label: 'Unmapped' },
                { value: 'Partial', label: 'Partial' }]
                }
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })} />

                <Select
                options={[
                { value: 'all', label: 'All Types' },
                { value: 'Fine', label: 'Fine' },
                { value: 'Event', label: 'Event' },
                { value: 'Exam', label: 'Exam' },
                { value: 'Material', label: 'Material' },
                { value: 'Activity', label: 'Activity' },
                { value: 'Other', label: 'Other' }]
                }
                value={filters.chargeType}
                onChange={(e) => setFilters({ ...filters, chargeType: e.target.value })} />

                <Select
                options={[
                { value: 'all', label: 'All Posting' },
                { value: 'auto', label: 'Auto-Posting' },
                { value: 'manual', label: 'Manual' }]
                }
                value={filters.postingStatus}
                onChange={(e) => setFilters({ ...filters, postingStatus: e.target.value })} />

                <Button variant="outline" onClick={handleAutoSuggest}>
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Suggest
                </Button>
              </div>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedMappings.length > 0 &&
        <Card className="p-3 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800 font-medium">
                  {selectedMappings.length} mapping(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    <Edit className="w-4 h-4 mr-2" />
                    Bulk Edit
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Enable Auto-Post
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white text-red-600 border-red-200">
                    <Unlink className="w-4 h-4 mr-2" />
                    Remove Mapping
                  </Button>
                </div>
              </div>
            </Card>
        }

          {/* Import/Export */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredMappings.length} of {chargeMappings.length} mappings
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={importMappings}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportMappings('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Mappings Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={mappingColumns} data={filteredMappings} />
            </div>
          </Card>
        </div>
      }

      {/* GL Accounts Tab */}
      {activeTab === 'accounts' &&
      <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search accounts..."
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <Select
              options={[
              { value: 'all', label: 'All Types' },
              { value: 'Asset', label: 'Asset' },
              { value: 'Liability', label: 'Liability' },
              { value: 'Income', label: 'Income' },
              { value: 'Expense', label: 'Expense' }]
              } />

              <Button variant="outline">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Refresh from Tally
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={accountColumns} data={glAccounts} />
            </div>
          </Card>
        </div>
      }

      {/* Posting Rules Tab */}
      {activeTab === 'rules' &&
      <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Default Posting Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Debit Account for Cash Payments
                  </label>
                  <Select
                  options={glAccounts.
                  filter((a) => a.type === 'Asset').
                  map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Debit Account for Online Payments
                  </label>
                  <Select
                  options={glAccounts.
                  filter((a) => a.type === 'Asset').
                  map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default GST Payable Account
                  </label>
                  <Select
                  options={glAccounts.
                  filter((a) => a.type === 'Liability').
                  map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))} />

                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posting Frequency
                  </label>
                  <Select
                  options={[
                  { value: 'immediate', label: 'Immediate (Real-time)' },
                  { value: 'daily', label: 'Daily (End of Day)' },
                  { value: 'weekly', label: 'Weekly' }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal Narration Format
                  </label>
                  <Input
                  placeholder="e.g., {ChargeName} - {StudentName} - {ReceiptNo}"
                  defaultValue="{ChargeName} collected from {StudentName} vide Receipt #{ReceiptNo}" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validation Rules
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Require Student ID for all entries</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">Validate amount is greater than zero</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Require approver for amounts above ₹10,000</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="primary">
                <Save className="w-4 h-4 mr-2" />
                Save Rules
              </Button>
            </div>
          </Card>
        </div>
      }

      {/* Sync Logs Tab */}
      {activeTab === 'logs' &&
      <div className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                type="date"
                label="From Date" />

              </div>
              <div className="flex-1">
                <Input
                type="date"
                label="To Date" />

              </div>
              <Select
              label="Status"
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Success', label: 'Success' },
              { value: 'Failed', label: 'Failed' },
              { value: 'Partial', label: 'Partial' }]
              } />

              <div className="flex items-end">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table columns={logColumns} data={syncLogs} />
            </div>
          </Card>
        </div>
      }

      {/* Unmapped Warning */}
      {stats.unmapped > 0 &&
      <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900">
                {stats.unmapped} Unmapped Charge{stats.unmapped > 1 ? 's' : ''} Detected
              </h4>
              <p className="text-sm text-red-700 mt-1">
                Financial reports will be inaccurate until all charges are properly mapped to GL accounts.
                Journal entries cannot be posted for unmapped charges.
              </p>
            </div>
            <Button
            variant="outline"
            className="bg-white text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => setFilters({ ...filters, status: 'Unmapped' })}>

              <Link className="w-4 h-4 mr-2" />
              Map Now
            </Button>
          </div>
        </Card>
      }

      {/* Mapping Modal */}
      {showMappingModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingMapping ? 'Edit Mapping' : 'Configure Mapping'}
                  </h2>
                  {editingMapping &&
                <p className="text-sm text-gray-500">{editingMapping.chargeName}</p>
                }
                </div>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowMappingModal(false);
                  setEditingMapping(null);
                }}>

                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Charge Selection */}
              {!editingMapping &&
            <Select
              label="Select Charge"
              options={chargeMappings.
              filter((m) => m.status !== 'Mapped').
              map((m) => ({ value: m.chargeId, label: `${m.chargeName} (${m.chargeCode})` }))}
              value={mappingForm.chargeId}
              onChange={(e) => setMappingForm({ ...mappingForm, chargeId: e.target.value })} />

            }

              {/* Credit Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Account (Income/Liability)
                </label>
                <Select
                options={[
                { value: '', label: 'Select Account...' },
                ...glAccounts.
                filter((a) => a.type === 'Income' || a.type === 'Liability').
                map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))]
                }
                value={mappingForm.creditAccountId || editingMapping?.creditAccountId}
                onChange={(e) => setMappingForm({ ...mappingForm, creditAccountId: e.target.value })} />

                <p className="text-xs text-gray-500 mt-1">
                  Select the income or liability account to credit when this charge is collected
                </p>
              </div>

              {/* Debit Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Debit Account (Asset/Bank)
                </label>
                <Select
                options={[
                { value: '', label: 'Select Account...' },
                ...glAccounts.
                filter((a) => a.type === 'Asset').
                map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))]
                }
                value={mappingForm.debitAccountId || editingMapping?.debitAccountId}
                onChange={(e) => setMappingForm({ ...mappingForm, debitAccountId: e.target.value })} />

                <p className="text-xs text-gray-500 mt-1">
                  Select the bank or cash account to debit when payment is received
                </p>
              </div>

              {/* Tax Settings */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  className="rounded"
                  checked={mappingForm.taxApplicable}
                  onChange={(e) =>
                  setMappingForm({ ...mappingForm, taxApplicable: e.target.checked })
                  } />

                  <span className="text-sm font-medium">GST Applicable</span>
                </label>
                {mappingForm.taxApplicable &&
              <Select
                label="GST Account"
                options={glAccounts.
                filter((a) => a.type === 'Liability' && a.name.includes('GST')).
                map((a) => ({ value: a.id, label: `${a.name} (${a.code})` }))}
                value={mappingForm.taxAccountId}
                onChange={(e) => setMappingForm({ ...mappingForm, taxAccountId: e.target.value })} />

              }
              </div>

              {/* Cost Center */}
              <Input
              label="Cost Center (Optional)"
              placeholder="e.g., CC001"
              value={mappingForm.costCenter}
              onChange={(e) => setMappingForm({ ...mappingForm, costCenter: e.target.value })} />


              {/* Auto Posting */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  className="rounded"
                  checked={mappingForm.isAutoPosting}
                  onChange={(e) =>
                  setMappingForm({ ...mappingForm, isAutoPosting: e.target.checked })
                  } />

                  <span className="text-sm font-medium">Enable Auto-Posting</span>
                </label>
                {mappingForm.isAutoPosting &&
              <Select
                label="Posting Frequency"
                options={[
                { value: 'Immediate', label: 'Immediate (Real-time)' },
                { value: 'Daily', label: 'Daily (End of Day)' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' }]
                }
                value={mappingForm.postingFrequency}
                onChange={(e) =>
                setMappingForm({ ...mappingForm, postingFrequency: e.target.value })
                } />

              }
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white">
              <Button
              variant="outline"
              onClick={() => {
                setShowMappingModal(false);
                setEditingMapping(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveMapping}>
                <Save className="w-4 h-4 mr-2" />
                Save Mapping
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Journal Entry Preview Modal */}
      {showPreviewModal && editingMapping &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Journal Entry Preview</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 text-center">
                <h3 className="font-bold text-gray-900">{editingMapping.chargeName}</h3>
                <p className="text-sm text-gray-500">Sample Journal Entry</p>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Account</th>
                      <th className="px-4 py-2 text-right">Debit (₹)</th>
                      <th className="px-4 py-2 text-right">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {editingMapping.debitAccountName || 'Bank Account - Main'}
                        </div>
                        <div className="text-xs text-gray-500">Asset Account</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">1,000.00</td>
                      <td className="px-4 py-3 text-right">-</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {editingMapping.creditAccountName || 'Charge Income Account'}
                        </div>
                        <div className="text-xs text-gray-500">Income Account</div>
                      </td>
                      <td className="px-4 py-3 text-right">-</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-600">1,000.00</td>
                    </tr>
                    {editingMapping.taxApplicable &&
                  <tr className="border-t bg-yellow-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">GST Payable</div>
                          <div className="text-xs text-gray-500">Tax Liability</div>
                        </td>
                        <td className="px-4 py-3 text-right">-</td>
                        <td className="px-4 py-3 text-right font-medium text-orange-600">180.00</td>
                      </tr>
                  }
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td className="px-4 py-2 font-bold">Total</td>
                      <td className="px-4 py-2 text-right font-bold">
                        {editingMapping.taxApplicable ? '1,180.00' : '1,000.00'}
                      </td>
                      <td className="px-4 py-2 text-right font-bold">
                        {editingMapping.taxApplicable ? '1,180.00' : '1,000.00'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <strong>Narration:</strong> {editingMapping.chargeName} collected from Student Name
                vide Receipt #CHRG-2024-00XXX
              </div>
            </div>

            <div className="p-6 border-t flex justify-end">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Account Mapping Information:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Mappings enable automatic journal entry posting to your accounting software</li>
              <li>Credit accounts should be Income (revenue) or Liability (deposits) accounts</li>
              <li>Debit accounts should be Asset accounts (Bank, Cash, etc.)</li>
              <li>Enable auto-posting for real-time synchronization with Tally/accounting software</li>
              <li>Unmapped charges will require manual journal entries</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}