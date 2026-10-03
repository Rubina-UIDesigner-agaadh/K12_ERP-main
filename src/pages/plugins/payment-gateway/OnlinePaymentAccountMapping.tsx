import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Settings,
  Link2,
  Unlink,
  AlertTriangle,
  RefreshCw,
  FileText,
  Building2,
  CreditCard,
  ArrowRight,
  ArrowRightLeft,
  BookOpen,
  DollarSign,
  Percent,
  Info,
  Eye,
  Copy,
  CheckCircle2,
  AlertCircle,
  Layers,
  GitBranch,
  Wallet,
  ReceiptText,
  CircleDollarSign,
  Banknote,
  PiggyBank,
  Calculator,
  Save,
  TestTube,
  Zap,
  Database } from
'lucide-react';

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Income' | 'Expense';
  parentAccount: string | null;
}

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  testMode: boolean;
}

interface AccountMapping {
  id: string;
  gatewayId: string;
  gatewayName: string;
  gatewayProvider: string;
  bankLedgerAccountId: string;
  bankLedgerAccountCode: string;
  bankLedgerAccountName: string;
  convenienceFeeLedgerAccountId: string;
  convenienceFeeLedgerAccountCode: string;
  convenienceFeeLedgerAccountName: string;
  tdsLedgerAccountId: string | null;
  tdsLedgerAccountCode: string | null;
  tdsLedgerAccountName: string | null;
  refundLedgerAccountId: string | null;
  refundLedgerAccountCode: string | null;
  refundLedgerAccountName: string | null;
  settlementVarianceAccountId: string | null;
  settlementVarianceAccountCode: string | null;
  settlementVarianceAccountName: string | null;
  autoPostJournalEntry: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  transactionCount: number;
}

export function OnlinePaymentAccountMapping() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<AccountMapping | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean;message: string;entries: any[];} | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    gatewayId: '',
    bankLedgerAccountId: '',
    convenienceFeeLedgerAccountId: '',
    tdsLedgerAccountId: '',
    refundLedgerAccountId: '',
    settlementVarianceAccountId: '',
    autoPostJournalEntry: true,
    isActive: true
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string;}>({});

  // Sample Ledger Accounts (Chart of Accounts)
  const ledgerAccounts: LedgerAccount[] = [
  // Bank Accounts (Assets)
  { id: 'bank1', code: '1001', name: 'HDFC Bank - Current Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank2', code: '1002', name: 'ICICI Bank - Current Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank3', code: '1003', name: 'SBI - Current Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank4', code: '1004', name: 'Axis Bank - Current Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank5', code: '1005', name: 'Razorpay Settlement Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank6', code: '1006', name: 'PayU Settlement Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  { id: 'bank7', code: '1007', name: 'CCAvenue Settlement Account', type: 'Asset', parentAccount: 'Bank Accounts' },
  // Income Accounts
  { id: 'income1', code: '4001', name: 'Convenience Fee Income', type: 'Income', parentAccount: 'Other Income' },
  { id: 'income2', code: '4002', name: 'Payment Gateway Charges Recovered', type: 'Income', parentAccount: 'Other Income' },
  { id: 'income3', code: '4003', name: 'Processing Fee Income', type: 'Income', parentAccount: 'Other Income' },
  // Expense Accounts
  { id: 'expense1', code: '5001', name: 'Payment Gateway Charges', type: 'Expense', parentAccount: 'Operating Expenses' },
  { id: 'expense2', code: '5002', name: 'Bank Charges', type: 'Expense', parentAccount: 'Operating Expenses' },
  { id: 'expense3', code: '5003', name: 'Settlement Variance', type: 'Expense', parentAccount: 'Operating Expenses' },
  // Liability Accounts
  { id: 'liability1', code: '2001', name: 'TDS Payable', type: 'Liability', parentAccount: 'Current Liabilities' },
  { id: 'liability2', code: '2002', name: 'Refunds Payable', type: 'Liability', parentAccount: 'Current Liabilities' },
  { id: 'liability3', code: '2003', name: 'Advance from Students', type: 'Liability', parentAccount: 'Current Liabilities' }];


  // Sample Payment Gateways
  const paymentGateways: PaymentGateway[] = [
  { id: 'gw1', name: 'Razorpay Production', provider: 'Razorpay', isActive: true, testMode: false },
  { id: 'gw2', name: 'PayU India', provider: 'PayU', isActive: true, testMode: false },
  { id: 'gw3', name: 'CCAvenue', provider: 'CCAvenue', isActive: false, testMode: false },
  { id: 'gw4', name: 'Razorpay Sandbox', provider: 'Razorpay', isActive: true, testMode: true },
  { id: 'gw5', name: 'Cashfree Payments', provider: 'Cashfree', isActive: true, testMode: false }];


  const [accountMappings, setAccountMappings] = useState<AccountMapping[]>([
  {
    id: 'map1',
    gatewayId: 'gw1',
    gatewayName: 'Razorpay Production',
    gatewayProvider: 'Razorpay',
    bankLedgerAccountId: 'bank5',
    bankLedgerAccountCode: '1005',
    bankLedgerAccountName: 'Razorpay Settlement Account',
    convenienceFeeLedgerAccountId: 'income1',
    convenienceFeeLedgerAccountCode: '4001',
    convenienceFeeLedgerAccountName: 'Convenience Fee Income',
    tdsLedgerAccountId: 'liability1',
    tdsLedgerAccountCode: '2001',
    tdsLedgerAccountName: 'TDS Payable',
    refundLedgerAccountId: 'liability2',
    refundLedgerAccountCode: '2002',
    refundLedgerAccountName: 'Refunds Payable',
    settlementVarianceAccountId: 'expense3',
    settlementVarianceAccountCode: '5003',
    settlementVarianceAccountName: 'Settlement Variance',
    autoPostJournalEntry: true,
    isActive: true,
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-03-10T14:30:00',
    lastUsedAt: '2024-03-15T16:45:00',
    transactionCount: 15420
  },
  {
    id: 'map2',
    gatewayId: 'gw2',
    gatewayName: 'PayU India',
    gatewayProvider: 'PayU',
    bankLedgerAccountId: 'bank6',
    bankLedgerAccountCode: '1006',
    bankLedgerAccountName: 'PayU Settlement Account',
    convenienceFeeLedgerAccountId: 'income2',
    convenienceFeeLedgerAccountCode: '4002',
    convenienceFeeLedgerAccountName: 'Payment Gateway Charges Recovered',
    tdsLedgerAccountId: 'liability1',
    tdsLedgerAccountCode: '2001',
    tdsLedgerAccountName: 'TDS Payable',
    refundLedgerAccountId: 'liability2',
    refundLedgerAccountCode: '2002',
    refundLedgerAccountName: 'Refunds Payable',
    settlementVarianceAccountId: null,
    settlementVarianceAccountCode: null,
    settlementVarianceAccountName: null,
    autoPostJournalEntry: true,
    isActive: true,
    createdAt: '2024-02-01T10:00:00',
    updatedAt: '2024-03-08T11:15:00',
    lastUsedAt: '2024-03-14T09:30:00',
    transactionCount: 8750
  },
  {
    id: 'map3',
    gatewayId: 'gw5',
    gatewayName: 'Cashfree Payments',
    gatewayProvider: 'Cashfree',
    bankLedgerAccountId: 'bank1',
    bankLedgerAccountCode: '1001',
    bankLedgerAccountName: 'HDFC Bank - Current Account',
    convenienceFeeLedgerAccountId: 'income1',
    convenienceFeeLedgerAccountCode: '4001',
    convenienceFeeLedgerAccountName: 'Convenience Fee Income',
    tdsLedgerAccountId: null,
    tdsLedgerAccountCode: null,
    tdsLedgerAccountName: null,
    refundLedgerAccountId: 'liability2',
    refundLedgerAccountCode: '2002',
    refundLedgerAccountName: 'Refunds Payable',
    settlementVarianceAccountId: 'expense3',
    settlementVarianceAccountCode: '5003',
    settlementVarianceAccountName: 'Settlement Variance',
    autoPostJournalEntry: false,
    isActive: true,
    createdAt: '2024-03-05T10:00:00',
    updatedAt: '2024-03-14T16:00:00',
    lastUsedAt: '2024-03-15T11:20:00',
    transactionCount: 1850
  }]
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const filteredMappings = accountMappings.filter((mapping) => {
    const matchesSearch =
    searchQuery === '' ||
    mapping.gatewayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.bankLedgerAccountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mapping.bankLedgerAccountCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
    filterStatus === 'all' ||
    filterStatus === 'active' && mapping.isActive ||
    filterStatus === 'inactive' && !mapping.isActive ||
    filterStatus === 'autopost' && mapping.autoPostJournalEntry;

    return matchesSearch && matchesStatus;
  });

  const unmappedGateways = paymentGateways.filter(
    (gw) => !accountMappings.some((m) => m.gatewayId === gw.id) && gw.isActive
  );

  const resetForm = () => {
    setFormData({
      gatewayId: '',
      bankLedgerAccountId: '',
      convenienceFeeLedgerAccountId: '',
      tdsLedgerAccountId: '',
      refundLedgerAccountId: '',
      settlementVarianceAccountId: '',
      autoPostJournalEntry: true,
      isActive: true
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: {[key: string]: string;} = {};

    if (!formData.gatewayId) {
      errors.gatewayId = 'Please select a payment gateway';
    }
    if (!formData.bankLedgerAccountId) {
      errors.bankLedgerAccountId = 'Bank ledger account is required';
    }
    if (!formData.convenienceFeeLedgerAccountId) {
      errors.convenienceFeeLedgerAccountId = 'Convenience fee account is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddMapping = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const selectedGateway = paymentGateways.find((g) => g.id === formData.gatewayId);
    const bankAccount = ledgerAccounts.find((a) => a.id === formData.bankLedgerAccountId);
    const convenienceFeeAccount = ledgerAccounts.find((a) => a.id === formData.convenienceFeeLedgerAccountId);
    const tdsAccount = ledgerAccounts.find((a) => a.id === formData.tdsLedgerAccountId);
    const refundAccount = ledgerAccounts.find((a) => a.id === formData.refundLedgerAccountId);
    const varianceAccount = ledgerAccounts.find((a) => a.id === formData.settlementVarianceAccountId);

    const newMapping: AccountMapping = {
      id: Date.now().toString(),
      gatewayId: formData.gatewayId,
      gatewayName: selectedGateway?.name || '',
      gatewayProvider: selectedGateway?.provider || '',
      bankLedgerAccountId: formData.bankLedgerAccountId,
      bankLedgerAccountCode: bankAccount?.code || '',
      bankLedgerAccountName: bankAccount?.name || '',
      convenienceFeeLedgerAccountId: formData.convenienceFeeLedgerAccountId,
      convenienceFeeLedgerAccountCode: convenienceFeeAccount?.code || '',
      convenienceFeeLedgerAccountName: convenienceFeeAccount?.name || '',
      tdsLedgerAccountId: formData.tdsLedgerAccountId || null,
      tdsLedgerAccountCode: tdsAccount?.code || null,
      tdsLedgerAccountName: tdsAccount?.name || null,
      refundLedgerAccountId: formData.refundLedgerAccountId || null,
      refundLedgerAccountCode: refundAccount?.code || null,
      refundLedgerAccountName: refundAccount?.name || null,
      settlementVarianceAccountId: formData.settlementVarianceAccountId || null,
      settlementVarianceAccountCode: varianceAccount?.code || null,
      settlementVarianceAccountName: varianceAccount?.name || null,
      autoPostJournalEntry: formData.autoPostJournalEntry,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUsedAt: null,
      transactionCount: 0
    };

    setAccountMappings([...accountMappings, newMapping]);
    setIsSubmitting(false);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditMapping = async () => {
    if (!validateForm() || !selectedMapping) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const bankAccount = ledgerAccounts.find((a) => a.id === formData.bankLedgerAccountId);
    const convenienceFeeAccount = ledgerAccounts.find((a) => a.id === formData.convenienceFeeLedgerAccountId);
    const tdsAccount = ledgerAccounts.find((a) => a.id === formData.tdsLedgerAccountId);
    const refundAccount = ledgerAccounts.find((a) => a.id === formData.refundLedgerAccountId);
    const varianceAccount = ledgerAccounts.find((a) => a.id === formData.settlementVarianceAccountId);

    setAccountMappings(
      accountMappings.map((m) =>
      m.id === selectedMapping.id ?
      {
        ...m,
        bankLedgerAccountId: formData.bankLedgerAccountId,
        bankLedgerAccountCode: bankAccount?.code || '',
        bankLedgerAccountName: bankAccount?.name || '',
        convenienceFeeLedgerAccountId: formData.convenienceFeeLedgerAccountId,
        convenienceFeeLedgerAccountCode: convenienceFeeAccount?.code || '',
        convenienceFeeLedgerAccountName: convenienceFeeAccount?.name || '',
        tdsLedgerAccountId: formData.tdsLedgerAccountId || null,
        tdsLedgerAccountCode: tdsAccount?.code || null,
        tdsLedgerAccountName: tdsAccount?.name || null,
        refundLedgerAccountId: formData.refundLedgerAccountId || null,
        refundLedgerAccountCode: refundAccount?.code || null,
        refundLedgerAccountName: refundAccount?.name || null,
        settlementVarianceAccountId: formData.settlementVarianceAccountId || null,
        settlementVarianceAccountCode: varianceAccount?.code || null,
        settlementVarianceAccountName: varianceAccount?.name || null,
        autoPostJournalEntry: formData.autoPostJournalEntry,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      } :
      m
      )
    );

    setIsSubmitting(false);
    setShowEditModal(false);
    setSelectedMapping(null);
    resetForm();
  };

  const handleDeleteMapping = async () => {
    if (!selectedMapping) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAccountMappings(accountMappings.filter((m) => m.id !== selectedMapping.id));
    setIsSubmitting(false);
    setShowDeleteModal(false);
    setSelectedMapping(null);
  };

  const handleTestMapping = async (mapping: AccountMapping) => {
    setSelectedMapping(mapping);
    setIsTesting(true);
    setTestResult(null);
    setShowTestModal(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate journal entry preview
    const sampleAmount = 25000;
    const convenienceFee = 250;
    const tds = mapping.tdsLedgerAccountId ? 25 : 0;
    const netSettlement = sampleAmount - tds;

    setTestResult({
      success: true,
      message: 'Mapping validation successful. Sample journal entry generated.',
      entries: [
      {
        account: mapping.bankLedgerAccountName,
        code: mapping.bankLedgerAccountCode,
        debit: netSettlement,
        credit: 0,
        narration: 'Bank settlement received'
      },
      ...(mapping.tdsLedgerAccountId ?
      [
      {
        account: mapping.tdsLedgerAccountName,
        code: mapping.tdsLedgerAccountCode,
        debit: tds,
        credit: 0,
        narration: 'TDS deducted at source'
      }] :

      []),
      {
        account: 'Fee Receivable',
        code: '1100',
        debit: 0,
        credit: sampleAmount,
        narration: 'Fee collection via ' + mapping.gatewayProvider
      },
      {
        account: mapping.convenienceFeeLedgerAccountName,
        code: mapping.convenienceFeeLedgerAccountCode,
        debit: 0,
        credit: convenienceFee,
        narration: 'Convenience fee collected'
      }]

    });

    setIsTesting(false);
  };

  const openEditModal = (mapping: AccountMapping) => {
    setSelectedMapping(mapping);
    setFormData({
      gatewayId: mapping.gatewayId,
      bankLedgerAccountId: mapping.bankLedgerAccountId,
      convenienceFeeLedgerAccountId: mapping.convenienceFeeLedgerAccountId,
      tdsLedgerAccountId: mapping.tdsLedgerAccountId || '',
      refundLedgerAccountId: mapping.refundLedgerAccountId || '',
      settlementVarianceAccountId: mapping.settlementVarianceAccountId || '',
      autoPostJournalEntry: mapping.autoPostJournalEntry,
      isActive: mapping.isActive
    });
    setShowEditModal(true);
  };

  const toggleAutoPost = (mapping: AccountMapping) => {
    setAccountMappings(
      accountMappings.map((m) =>
      m.id === mapping.id ?
      { ...m, autoPostJournalEntry: !m.autoPostJournalEntry, updatedAt: new Date().toISOString() } :
      m
      )
    );
  };

  const toggleActive = (mapping: AccountMapping) => {
    setAccountMappings(
      accountMappings.map((m) =>
      m.id === mapping.id ?
      { ...m, isActive: !m.isActive, updatedAt: new Date().toISOString() } :
      m
      )
    );
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Razorpay':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PayU':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'CCAvenue':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Cashfree':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getBankAccounts = () =>
  ledgerAccounts.filter((a) => a.type === 'Asset' && a.parentAccount === 'Bank Accounts');

  const getIncomeAccounts = () => ledgerAccounts.filter((a) => a.type === 'Income');

  const getLiabilityAccounts = () => ledgerAccounts.filter((a) => a.type === 'Liability');

  const getExpenseAccounts = () => ledgerAccounts.filter((a) => a.type === 'Expense');

  const ToggleSwitch = ({
    checked,
    onChange,
    label,
    description





  }: {checked: boolean;onChange: (checked: boolean) => void;label: string;description?: string;}) =>
  <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {description && <div className="text-xs text-gray-500">{description}</div>}
      </div>
      <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-300'}`
      }>

        <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'}`
        } />

      </button>
    </div>;


  const columns = [
  {
    key: 'gateway',
    header: 'Payment Gateway',
    render: (row: AccountMapping) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">{row.gatewayName}</span>
            {!row.isActive &&
        <Badge variant="danger" className="text-xs">Inactive</Badge>
        }
          </div>
          <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getProviderColor(row.gatewayProvider)}`}>
            {row.gatewayProvider}
          </div>
        </div>

  },
  {
    key: 'bankAccount',
    header: 'Bank Ledger Account',
    render: (row: AccountMapping) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-gray-900">{row.bankLedgerAccountName}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">Code: {row.bankLedgerAccountCode}</div>
        </div>

  },
  {
    key: 'convenienceFee',
    header: 'Convenience Fee Account',
    render: (row: AccountMapping) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-green-500" />
            <span className="font-medium text-gray-900">{row.convenienceFeeLedgerAccountName}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">Code: {row.convenienceFeeLedgerAccountCode}</div>
        </div>

  },
  {
    key: 'otherAccounts',
    header: 'Other Mappings',
    render: (row: AccountMapping) =>
    <div className="flex flex-wrap gap-1">
          {row.tdsLedgerAccountId &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs" title={row.tdsLedgerAccountName || ''}>
              <Calculator className="w-3 h-3" />
              TDS
            </span>
      }
          {row.refundLedgerAccountId &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs" title={row.refundLedgerAccountName || ''}>
              <ReceiptText className="w-3 h-3" />
              Refund
            </span>
      }
          {row.settlementVarianceAccountId &&
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs" title={row.settlementVarianceAccountName || ''}>
              <ArrowRightLeft className="w-3 h-3" />
              Variance
            </span>
      }
          {!row.tdsLedgerAccountId && !row.refundLedgerAccountId && !row.settlementVarianceAccountId &&
      <span className="text-xs text-gray-400">None configured</span>
      }
        </div>

  },
  {
    key: 'autoPost',
    header: 'Auto Post',
    render: (row: AccountMapping) =>
    <button
      onClick={() => toggleAutoPost(row)}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
      row.autoPostJournalEntry ?
      'bg-green-100 text-green-700 hover:bg-green-200' :
      'bg-gray-100 text-gray-500 hover:bg-gray-200'}`
      }>

          {row.autoPostJournalEntry ?
      <>
              <Zap className="w-3 h-3" />
              Enabled
            </> :

      <>
              <XCircle className="w-3 h-3" />
              Disabled
            </>
      }
        </button>

  },
  {
    key: 'usage',
    header: 'Usage',
    render: (row: AccountMapping) =>
    <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">
            {row.transactionCount.toLocaleString()} txns
          </div>
          {row.lastUsedAt &&
      <div className="text-xs text-gray-500">
              Last: {formatDateTime(row.lastUsedAt).date}
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: AccountMapping) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => handleTestMapping(row)}
        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600"
        title="Test Mapping">

            <TestTube className="w-4 h-4" />
          </button>
          <button
        onClick={() => {
          setSelectedMapping(row);
          setShowPreviewModal(true);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        title="View Details">

            <Eye className="w-4 h-4" />
          </button>
          <button
        onClick={() => openEditModal(row)}
        className="p-2 hover:bg-yellow-50 rounded-lg text-yellow-600"
        title="Edit">

            <Edit3 className="w-4 h-4" />
          </button>
          <button
        onClick={() => {
          setSelectedMapping(row);
          setShowDeleteModal(true);
        }}
        className="p-2 hover:bg-red-50 rounded-lg text-red-600"
        title="Delete">

            <Trash2 className="w-4 h-4" />
          </button>
        </div>

  }];


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Account Mapping</h1>
          <p className="text-sm text-gray-500">
            Link payment gateways to General Ledger accounts for automated journal entries
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}>

            <Plus className="w-4 h-4 mr-2" />
            Add Mapping
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">How Account Mapping Works</h4>
            <p className="text-sm text-blue-700 mt-1">
              When a payment is successfully processed through a gateway, the system automatically creates
              a journal entry based on the mapping configuration. This ensures accurate financial records
              in the General Ledger without manual intervention.
            </p>
          </div>
        </div>
      </Card>

      {/* Unmapped Gateways Warning */}
      {unmappedGateways.length > 0 &&
      <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-yellow-800">Unmapped Payment Gateways</h4>
              <p className="text-sm text-yellow-700 mt-1">
                The following active gateways don't have account mappings. Transactions from these gateways
                won't be automatically posted to the ledger.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {unmappedGateways.map((gw) =>
              <span
                key={gw.id}
                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm border border-yellow-300">

                    <Unlink className="w-3 h-3" />
                    {gw.name}
                  </span>
              )}
              </div>
            </div>
            <Button
            variant="outline"
            size="sm"
            className="border-yellow-400 text-yellow-700 hover:bg-yellow-100"
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}>

              <Plus className="w-4 h-4 mr-1" />
              Map Now
            </Button>
          </div>
        </Card>
      }

      {/* Mapping Flow Visualization */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Journal Entry Flow</h3>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200 min-w-[140px]">
            <CreditCard className="w-8 h-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Payment Gateway</span>
            <span className="text-xs text-blue-600">Transaction Success</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200 min-w-[140px]">
            <Settings className="w-8 h-8 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Account Mapping</span>
            <span className="text-xs text-purple-600">Rule Configuration</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200 min-w-[140px]">
            <BookOpen className="w-8 h-8 text-green-600" />
            <span className="text-sm font-medium text-green-800">Journal Entry</span>
            <span className="text-xs text-green-600">Auto Posted</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
          <div className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg border border-orange-200 min-w-[140px]">
            <Database className="w-8 h-8 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">General Ledger</span>
            <span className="text-xs text-orange-600">Updated</span>
          </div>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by gateway name or account..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />

          </div>
          <Select
            className="w-48"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
            { value: 'all', label: 'All Mappings' },
            { value: 'active', label: 'Active Only' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'autopost', label: 'Auto-Post Enabled' }]
            } />

        </div>
      </Card>

      {/* Mappings Table */}
      <Card
        title={`Account Mappings (${filteredMappings.length})`}
        headerAction={
        <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link2 className="w-4 h-4" />
            <span>{accountMappings.filter((m) => m.isActive).length} active</span>
          </div>
        }>

        <div className="overflow-x-auto">
          <Table columns={columns} data={filteredMappings} />
        </div>

        {filteredMappings.length === 0 &&
        <div className="py-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Link2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Mappings Found</h3>
              <p className="text-sm text-gray-500 mb-4">
                {searchQuery || filterStatus !== 'all' ?
              'Try adjusting your search or filters' :
              'Create your first account mapping to get started'}
              </p>
              <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}>

                <Plus className="w-4 h-4 mr-2" />
                Add Mapping
              </Button>
            </div>
          </div>
        }
      </Card>

      {/* Add/Edit Mapping Modal */}
      {(showAddModal || showEditModal) &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  {showAddModal ? 'Add Account Mapping' : 'Edit Account Mapping'}
                </h3>
                <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedMapping(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Gateway Selection */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Gateway
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Gateway <span className="text-red-500">*</span>
                  </label>
                  <Select
                  className={`w-full ${formErrors.gatewayId ? 'border-red-500' : ''}`}
                  value={formData.gatewayId}
                  onChange={(e) => setFormData({ ...formData, gatewayId: e.target.value })}
                  options={[
                  { value: '', label: 'Select Payment Gateway' },
                  ...paymentGateways.
                  filter(
                    (gw) =>
                    showEditModal ?
                    gw.id === selectedMapping?.gatewayId :
                    !accountMappings.some((m) => m.gatewayId === gw.id)
                  ).
                  map((gw) => ({
                    value: gw.id,
                    label: `${gw.name} (${gw.provider})${gw.testMode ? ' - Sandbox' : ''}`
                  }))]
                  }
                  disabled={showEditModal} />

                  {formErrors.gatewayId &&
                <p className="text-xs text-red-500 mt-1">{formErrors.gatewayId}</p>
                }
                </div>
              </div>

              {/* Primary Accounts */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Primary Account Mapping
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bank Ledger Account <span className="text-red-500">*</span>
                    </label>
                    <Select
                    className={`w-full ${formErrors.bankLedgerAccountId ? 'border-red-500' : ''}`}
                    value={formData.bankLedgerAccountId}
                    onChange={(e) => setFormData({ ...formData, bankLedgerAccountId: e.target.value })}
                    options={[
                    { value: '', label: 'Select Bank Account' },
                    ...getBankAccounts().map((a) => ({
                      value: a.id,
                      label: `${a.code} - ${a.name}`
                    }))]
                    } />

                    {formErrors.bankLedgerAccountId &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.bankLedgerAccountId}</p>
                  }
                    <p className="text-xs text-gray-500 mt-1">
                      Settlement amounts will be debited to this account
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Convenience Fee Account <span className="text-red-500">*</span>
                    </label>
                    <Select
                    className={`w-full ${formErrors.convenienceFeeLedgerAccountId ? 'border-red-500' : ''}`}
                    value={formData.convenienceFeeLedgerAccountId}
                    onChange={(e) =>
                    setFormData({ ...formData, convenienceFeeLedgerAccountId: e.target.value })
                    }
                    options={[
                    { value: '', label: 'Select Income Account' },
                    ...getIncomeAccounts().map((a) => ({
                      value: a.id,
                      label: `${a.code} - ${a.name}`
                    }))]
                    } />

                    {formErrors.convenienceFeeLedgerAccountId &&
                  <p className="text-xs text-red-500 mt-1">{formErrors.convenienceFeeLedgerAccountId}</p>
                  }
                    <p className="text-xs text-gray-500 mt-1">
                      Convenience fees collected will be credited to this account
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Accounts */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Additional Account Mapping (Optional)
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TDS Payable Account
                    </label>
                    <Select
                    className="w-full"
                    value={formData.tdsLedgerAccountId}
                    onChange={(e) => setFormData({ ...formData, tdsLedgerAccountId: e.target.value })}
                    options={[
                    { value: '', label: 'Not Applicable' },
                    ...getLiabilityAccounts().map((a) => ({
                      value: a.id,
                      label: `${a.code} - ${a.name}`
                    }))]
                    } />

                    <p className="text-xs text-gray-500 mt-1">
                      For TDS deducted by gateway on settlements
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Refund Liability Account
                    </label>
                    <Select
                    className="w-full"
                    value={formData.refundLedgerAccountId}
                    onChange={(e) => setFormData({ ...formData, refundLedgerAccountId: e.target.value })}
                    options={[
                    { value: '', label: 'Not Applicable' },
                    ...getLiabilityAccounts().map((a) => ({
                      value: a.id,
                      label: `${a.code} - ${a.name}`
                    }))]
                    } />

                    <p className="text-xs text-gray-500 mt-1">
                      For tracking refund obligations
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Settlement Variance Account
                    </label>
                    <Select
                    className="w-full"
                    value={formData.settlementVarianceAccountId}
                    onChange={(e) =>
                    setFormData({ ...formData, settlementVarianceAccountId: e.target.value })
                    }
                    options={[
                    { value: '', label: 'Not Applicable' },
                    ...getExpenseAccounts().map((a) => ({
                      value: a.id,
                      label: `${a.code} - ${a.name}`
                    }))]
                    } />

                    <p className="text-xs text-gray-500 mt-1">
                      For reconciliation differences and gateway charges
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuration
                </h4>
                <div className="space-y-4">
                  <ToggleSwitch
                  checked={formData.autoPostJournalEntry}
                  onChange={(checked) => setFormData({ ...formData, autoPostJournalEntry: checked })}
                  label="Auto-Post Journal Entry"
                  description="Automatically create journal entries when payments are processed" />

                  <ToggleSwitch
                  checked={formData.isActive}
                  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  label="Is Active"
                  description="Enable this mapping for transaction processing" />

                </div>
              </div>

              {/* Auto-post info */}
              {formData.autoPostJournalEntry &&
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-700">
                      <p className="font-medium">Auto-Posting Enabled</p>
                      <p className="mt-1">
                        Journal entries will be automatically created and posted when transactions
                        are successfully processed through this gateway.
                      </p>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0">
              <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedMapping(null);
                resetForm();
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={showAddModal ? handleAddMapping : handleEditMapping}
              disabled={isSubmitting}>

                {isSubmitting ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {showAddModal ? 'Adding...' : 'Saving...'}
                  </> :

              <>
                    <Save className="w-4 h-4 mr-2" />
                    {showAddModal ? 'Add Mapping' : 'Save Changes'}
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Details Modal */}
      {showPreviewModal && selectedMapping &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-gray-900">Mapping Details</h3>
                  {selectedMapping.isActive ?
                <Badge variant="success">Active</Badge> :

                <Badge variant="danger">Inactive</Badge>
                }
                </div>
                <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedMapping(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Gateway Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg border">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{selectedMapping.gatewayName}</div>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border mt-1 ${getProviderColor(selectedMapping.gatewayProvider)}`}>
                      {selectedMapping.gatewayProvider}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-gray-500">Transactions</div>
                    <div className="font-bold text-gray-900">
                      {selectedMapping.transactionCount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Mappings */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Account Mappings</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-blue-600 font-medium">Bank Ledger Account</div>
                        <div className="font-medium text-gray-900">
                          {selectedMapping.bankLedgerAccountName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          Code: {selectedMapping.bankLedgerAccountCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <Percent className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-xs text-green-600 font-medium">Convenience Fee Account</div>
                        <div className="font-medium text-gray-900">
                          {selectedMapping.convenienceFeeLedgerAccountName}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          Code: {selectedMapping.convenienceFeeLedgerAccountCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedMapping.tdsLedgerAccountId &&
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3">
                        <Calculator className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-purple-600 font-medium">TDS Payable Account</div>
                          <div className="font-medium text-gray-900">
                            {selectedMapping.tdsLedgerAccountName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            Code: {selectedMapping.tdsLedgerAccountCode}
                          </div>
                        </div>
                      </div>
                    </div>
                }

                  {selectedMapping.refundLedgerAccountId &&
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <ReceiptText className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="text-xs text-orange-600 font-medium">Refund Liability Account</div>
                          <div className="font-medium text-gray-900">
                            {selectedMapping.refundLedgerAccountName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            Code: {selectedMapping.refundLedgerAccountCode}
                          </div>
                        </div>
                      </div>
                    </div>
                }

                  {selectedMapping.settlementVarianceAccountId &&
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <ArrowRightLeft className="w-5 h-5 text-red-600" />
                        <div>
                          <div className="text-xs text-red-600 font-medium">Settlement Variance Account</div>
                          <div className="font-medium text-gray-900">
                            {selectedMapping.settlementVarianceAccountName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            Code: {selectedMapping.settlementVarianceAccountCode}
                          </div>
                        </div>
                      </div>
                    </div>
                }
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Auto-Post Journal Entry</div>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedMapping.autoPostJournalEntry ?
                    <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-700">Enabled</span>
                        </> :

                    <>
                          <XCircle className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-500">Disabled</span>
                        </>
                    }
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedMapping.isActive ?
                    <>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="font-medium text-green-700">Active</span>
                        </> :

                    <>
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="font-medium text-gray-500">Inactive</span>
                        </>
                    }
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="text-sm font-medium">{formatDateTime(selectedMapping.createdAt).date}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Last Updated</div>
                  <div className="text-sm font-medium">{formatDateTime(selectedMapping.updatedAt).date}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500">Last Used</div>
                  <div className="text-sm font-medium">
                    {selectedMapping.lastUsedAt ?
                  formatDateTime(selectedMapping.lastUsedAt).date :
                  'Never'}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-between sticky bottom-0">
              <Button variant="outline" onClick={() => handleTestMapping(selectedMapping)}>
                <TestTube className="w-4 h-4 mr-2" />
                Test Mapping
              </Button>
              <div className="flex gap-2">
                <Button
                variant="outline"
                onClick={() => {
                  setShowPreviewModal(false);
                  openEditModal(selectedMapping);
                }}>

                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                variant="outline"
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedMapping(null);
                }}>

                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Test Mapping Modal */}
      {showTestModal && selectedMapping &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TestTube className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Test Account Mapping</h3>
                    <p className="text-sm text-gray-500">{selectedMapping.gatewayName}</p>
                  </div>
                </div>
                <button
                onClick={() => {
                  setShowTestModal(false);
                  setSelectedMapping(null);
                  setTestResult(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {isTesting ?
            <div className="text-center py-8">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Validating account mapping...</p>
                  <p className="text-sm text-gray-500 mt-1">Generating sample journal entry</p>
                </div> :
            testResult ?
            <div className="space-y-6">
                  {/* Result Status */}
                  <div
                className={`p-4 rounded-lg border flex items-start gap-3 ${
                testResult.success ?
                'bg-green-50 border-green-200' :
                'bg-red-50 border-red-200'}`
                }>

                    {testResult.success ?
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" /> :

                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                }
                    <div>
                      <p
                    className={`font-medium ${
                    testResult.success ? 'text-green-800' : 'text-red-800'}`
                    }>

                        {testResult.success ? 'Validation Successful' : 'Validation Failed'}
                      </p>
                      <p
                    className={`text-sm ${
                    testResult.success ? 'text-green-700' : 'text-red-700'}`
                    }>

                        {testResult.message}
                      </p>
                    </div>
                  </div>

                  {/* Sample Journal Entry */}
                  {testResult.success && testResult.entries.length > 0 &&
              <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Sample Journal Entry (₹25,000 Payment)
                      </h4>
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left px-4 py-2 font-medium text-gray-700">Account</th>
                              <th className="text-left px-4 py-2 font-medium text-gray-700">Code</th>
                              <th className="text-right px-4 py-2 font-medium text-gray-700">Debit</th>
                              <th className="text-right px-4 py-2 font-medium text-gray-700">Credit</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {testResult.entries.map((entry, index) =>
                      <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  <div>{entry.account}</div>
                                  <div className="text-xs text-gray-500">{entry.narration}</div>
                                </td>
                                <td className="px-4 py-3 font-mono text-gray-600">{entry.code}</td>
                                <td className="px-4 py-3 text-right font-medium">
                                  {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '-'}
                                </td>
                                <td className="px-4 py-3 text-right font-medium">
                                  {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '-'}
                                </td>
                              </tr>
                      )}
                          </tbody>
                          <tfoot className="bg-gray-50 font-semibold">
                            <tr>
                              <td colSpan={2} className="px-4 py-2 text-right">
                                Total
                              </td>
                              <td className="px-4 py-2 text-right">
                                ₹{testResult.entries.reduce((sum, e) => sum + e.debit, 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 text-right">
                                ₹{testResult.entries.reduce((sum, e) => sum + e.credit, 0).toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
              }
                </div> :
            null}
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowTestModal(false);
                setSelectedMapping(null);
                setTestResult(null);
              }}>

                Close
              </Button>
              {testResult &&
            <Button variant="primary" onClick={() => handleTestMapping(selectedMapping)}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-test
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMapping &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Mapping</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg mb-4">
                <div className="font-medium text-gray-900">{selectedMapping.gatewayName}</div>
                <div className="text-sm text-gray-500 mt-1">
                  → {selectedMapping.bankLedgerAccountName}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedMapping.transactionCount.toLocaleString()} transactions processed
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700">
                  <strong>Warning:</strong> Deleting this mapping will:
                </p>
                <ul className="text-sm text-red-600 mt-2 list-disc list-inside space-y-1">
                  <li>Stop automatic journal entry creation for this gateway</li>
                  <li>Require manual posting for future transactions</li>
                  <li>Not affect existing posted journal entries</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedMapping(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteMapping}
              disabled={isSubmitting}>

                {isSubmitting ?
              <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </> :

              <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Mapping
                  </>
              }
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}