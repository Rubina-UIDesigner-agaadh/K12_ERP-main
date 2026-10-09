import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Server,
  Database,
  ArrowRight,
  Zap,
  Info,
  AlertCircle,
  RotateCcw,
  Activity,
  Shield,
  Copy,
  HelpCircle,
  TrendingUp,
  Calendar,
  CreditCard,
  User,
  Hash,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Eye,
  FileText } from
'lucide-react';

interface StuckTransaction {
  id: string;
  txnId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  amount: number;
  initiatedAt: string;
  gateway: string;
  gatewayTxnId: string;
  currentStatus: 'Processing' | 'Timeout' | 'Unknown' | 'Gateway Error';
  lastSyncAttempt: string | null;
  syncAttempts: number;
  errorMessage: string | null;
  feeType: string;
}

interface SyncResult {
  txnId: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  message: string;
  gatewayStatus: string;
  updatedAt: string;
}

interface SyncLogEntry {
  id: string;
  timestamp: string;
  txnId: string;
  action: string;
  status: 'info' | 'success' | 'error' | 'warning';
  details: string;
}

export function OnlinePaymentRetryStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentSyncingTxn, setCurrentSyncingTxn] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [showSyncResults, setShowSyncResults] = useState(false);
  const [individualSyncing, setIndividualSyncing] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [syncLog, setSyncLog] = useState<SyncLogEntry[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock data for stuck transactions
  const stuckTransactions: StuckTransaction[] = [
  {
    id: '1',
    txnId: 'TXN_2024031501',
    studentName: 'Rahul Sharma',
    admissionNo: 'ADM2024001',
    classSection: '10-A',
    amount: 25000,
    initiatedAt: '2024-03-15T10:30:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_NxYz123456789',
    currentStatus: 'Processing',
    lastSyncAttempt: '2024-03-15T11:00:00',
    syncAttempts: 2,
    errorMessage: 'Gateway timeout during callback',
    feeType: 'Tuition Fee'
  },
  {
    id: '2',
    txnId: 'TXN_2024031502',
    studentName: 'Priya Patel',
    admissionNo: 'ADM2024002',
    classSection: '9-B',
    amount: 15000,
    initiatedAt: '2024-03-15T09:15:00',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_ABC987654321',
    currentStatus: 'Timeout',
    lastSyncAttempt: null,
    syncAttempts: 0,
    errorMessage: 'Callback not received within timeout period',
    feeType: 'Annual Fee'
  },
  {
    id: '3',
    txnId: 'TXN_2024031503',
    studentName: 'Amit Kumar',
    admissionNo: 'ADM2024003',
    classSection: '8-C',
    amount: 12000,
    initiatedAt: '2024-03-14T16:45:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_AbCd567890123',
    currentStatus: 'Unknown',
    lastSyncAttempt: '2024-03-14T17:30:00',
    syncAttempts: 3,
    errorMessage: 'Inconsistent status between gateway and ERP',
    feeType: 'Exam Fee'
  },
  {
    id: '4',
    txnId: 'TXN_2024031504',
    studentName: 'Sneha Gupta',
    admissionNo: 'ADM2024004',
    classSection: '11-A',
    amount: 35000,
    initiatedAt: '2024-03-14T14:30:00',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CC_ORDER_789456123',
    currentStatus: 'Gateway Error',
    lastSyncAttempt: '2024-03-14T15:00:00',
    syncAttempts: 1,
    errorMessage: 'Gateway returned error code 504',
    feeType: 'Tuition Fee'
  },
  {
    id: '5',
    txnId: 'TXN_2024031505',
    studentName: 'Vikram Singh',
    admissionNo: 'ADM2024005',
    classSection: '12-B',
    amount: 45000,
    initiatedAt: '2024-03-13T11:00:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_EfGh234567890',
    currentStatus: 'Processing',
    lastSyncAttempt: '2024-03-13T12:00:00',
    syncAttempts: 5,
    errorMessage: 'Multiple sync attempts failed',
    feeType: 'Transport Fee'
  },
  {
    id: '6',
    txnId: 'TXN_2024031506',
    studentName: 'Ananya Reddy',
    admissionNo: 'ADM2024006',
    classSection: '7-A',
    amount: 8000,
    initiatedAt: '2024-03-15T08:00:00',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_XYZ123456789',
    currentStatus: 'Processing',
    lastSyncAttempt: null,
    syncAttempts: 0,
    errorMessage: 'Awaiting gateway confirmation',
    feeType: 'Lab Fee'
  },
  {
    id: '7',
    txnId: 'TXN_2024031507',
    studentName: 'Rohan Mehta',
    admissionNo: 'ADM2024007',
    classSection: '6-C',
    amount: 18000,
    initiatedAt: '2024-03-14T10:45:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_IjKl345678901',
    currentStatus: 'Timeout',
    lastSyncAttempt: '2024-03-14T11:30:00',
    syncAttempts: 2,
    errorMessage: 'Connection timeout to gateway API',
    feeType: 'Tuition Fee'
  },
  {
    id: '8',
    txnId: 'TXN_2024031508',
    studentName: 'Kavya Nair',
    admissionNo: 'ADM2024008',
    classSection: '9-A',
    amount: 22000,
    initiatedAt: '2024-03-12T16:00:00',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CC_ORDER_456789012',
    currentStatus: 'Unknown',
    lastSyncAttempt: '2024-03-12T17:00:00',
    syncAttempts: 4,
    errorMessage: 'Status mismatch - requires manual verification',
    feeType: 'Hostel Fee'
  }];


  // Calculate summary statistics
  const summaryStats = {
    total: stuckTransactions.length,
    processing: stuckTransactions.filter((t) => t.currentStatus === 'Processing').length,
    timeout: stuckTransactions.filter((t) => t.currentStatus === 'Timeout').length,
    unknown: stuckTransactions.filter((t) => t.currentStatus === 'Unknown').length,
    gatewayError: stuckTransactions.filter((t) => t.currentStatus === 'Gateway Error').length,
    totalAmount: stuckTransactions.reduce((sum, t) => sum + t.amount, 0)
  };

  // Filter transactions
  const filteredTransactions = stuckTransactions.filter((txn) => {
    const matchesSearch =
    searchQuery === '' ||
    txn.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.gatewayTxnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGateway = selectedGateway === 'all' || txn.gateway === selectedGateway;
    const matchesStatus = selectedStatus === 'all' || txn.currentStatus === selectedStatus;

    return matchesSearch && matchesGateway && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const simulateSyncResult = (): SyncResult['status'] => {
    const random = Math.random();
    if (random < 0.5) return 'success';
    if (random < 0.7) return 'failed';
    if (random < 0.9) return 'pending';
    return 'refunded';
  };

  const addToLog = (entry: Omit<SyncLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: SyncLogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    };
    setSyncLog((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIndividualSync = async (transaction: StuckTransaction) => {
    setIndividualSyncing(transaction.txnId);
    addToLog({
      txnId: transaction.txnId,
      action: 'Sync Started',
      status: 'info',
      details: `Connecting to ${transaction.gateway} API...`
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const resultStatus = simulateSyncResult();
    const result: SyncResult = {
      txnId: transaction.txnId,
      status: resultStatus,
      message:
      resultStatus === 'success' ?
      'Payment confirmed by gateway' :
      resultStatus === 'failed' ?
      'Payment failed - declined by bank' :
      resultStatus === 'refunded' ?
      'Payment was refunded' :
      'Still processing at gateway',
      gatewayStatus:
      resultStatus === 'success' ?
      'captured' :
      resultStatus === 'failed' ?
      'failed' :
      resultStatus === 'refunded' ?
      'refunded' :
      'authorized',
      updatedAt: new Date().toISOString()
    };

    addToLog({
      txnId: transaction.txnId,
      action: 'Sync Completed',
      status: resultStatus === 'success' ? 'success' : resultStatus === 'failed' ? 'error' : 'warning',
      details: result.message
    });

    setSyncResults((prev) => [result, ...prev.filter((r) => r.txnId !== transaction.txnId)]);
    setIndividualSyncing(null);
  };

  const handleBulkSync = async () => {
    if (selectedRows.length === 0) return;

    setIsSyncing(true);
    setSyncProgress(0);
    setSyncResults([]);
    setShowSyncResults(true);

    const selectedTransactions = stuckTransactions.filter((t) => selectedRows.includes(t.id));

    addToLog({
      txnId: 'BULK',
      action: 'Bulk Sync Started',
      status: 'info',
      details: `Processing ${selectedTransactions.length} transactions...`
    });

    for (let i = 0; i < selectedTransactions.length; i++) {
      const txn = selectedTransactions[i];
      setCurrentSyncingTxn(txn.txnId);

      addToLog({
        txnId: txn.txnId,
        action: 'Fetching Status',
        status: 'info',
        details: `Querying ${txn.gateway} for transaction status`
      });

      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

      const resultStatus = simulateSyncResult();
      const result: SyncResult = {
        txnId: txn.txnId,
        status: resultStatus,
        message:
        resultStatus === 'success' ?
        'Payment confirmed by gateway' :
        resultStatus === 'failed' ?
        'Payment failed - declined by bank' :
        resultStatus === 'refunded' ?
        'Payment was refunded' :
        'Still processing at gateway',
        gatewayStatus:
        resultStatus === 'success' ?
        'captured' :
        resultStatus === 'failed' ?
        'failed' :
        resultStatus === 'refunded' ?
        'refunded' :
        'authorized',
        updatedAt: new Date().toISOString()
      };

      addToLog({
        txnId: txn.txnId,
        action: 'Status Updated',
        status: resultStatus === 'success' ? 'success' : resultStatus === 'failed' ? 'error' : 'warning',
        details: result.message
      });

      setSyncResults((prev) => [...prev, result]);
      setSyncProgress((i + 1) / selectedTransactions.length * 100);
    }

    addToLog({
      txnId: 'BULK',
      action: 'Bulk Sync Completed',
      status: 'success',
      details: `Successfully processed ${selectedTransactions.length} transactions`
    });

    setCurrentSyncingTxn(null);
    setIsSyncing(false);
    setSelectedRows([]);
  };

  const handleStopSync = () => {
    setIsSyncing(false);
    setCurrentSyncingTxn(null);
    addToLog({
      txnId: 'SYSTEM',
      action: 'Sync Cancelled',
      status: 'warning',
      details: 'Sync operation was cancelled by user'
    });
  };

  const clearFilters = () => {
    setSelectedGateway('all');
    setSelectedStatus('all');
    setSelectedDateRange('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedGateway !== 'all' || selectedStatus !== 'all' || searchQuery !== '';

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Processing':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          variant: 'warning' as const,
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
          description: 'Payment is being processed by the gateway'
        };
      case 'Timeout':
        return {
          icon: <Clock className="w-4 h-4" />,
          variant: 'danger' as const,
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          description: 'Gateway callback was not received in time'
        };
      case 'Unknown':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          variant: 'info' as const,
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          description: 'Status could not be determined'
        };
      case 'Gateway Error':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          variant: 'danger' as const,
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
          description: 'Gateway returned an error response'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          variant: 'outline' as const,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
          description: 'Unknown status'
        };
    }
  };

  const getSyncResultConfig = (status: SyncResult['status']) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          label: 'Payment Successful'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          label: 'Payment Failed'
        };
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-700',
          label: 'Still Pending'
        };
      case 'refunded':
        return {
          icon: <RotateCcw className="w-5 h-5 text-blue-600" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          label: 'Refunded'
        };
    }
  };

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

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Status Sync</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Sync stuck transactions with payment gateways to get the latest status
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className={`${showHowItWorks ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}>

              <HelpCircle className="w-4 h-4 mr-2" />
              How It Works
            </Button>
            <Button
              variant="primary"
              onClick={handleBulkSync}
              disabled={selectedRows.length === 0 || isSyncing}
              className="bg-blue-600 hover:bg-blue-700">

              {isSyncing ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </> :

              <>
                  <Zap className="w-4 h-4 mr-2" />
                  Sync Selected ({selectedRows.length})
                </>
              }
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works Panel */}
      {showHowItWorks &&
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">How Payment Sync Works</h3>
            </div>
            <button
            onClick={() => setShowHowItWorks(false)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-semibold text-gray-900">Select Transactions</h4>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                Choose the stuck transactions you want to sync from the list below
              </p>
              <div className="hidden md:block absolute top-4 -right-3 text-blue-300">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-semibold text-gray-900">Query Gateway</h4>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                System connects to payment gateway API to fetch the actual payment status
              </p>
              <div className="hidden md:block absolute top-4 -right-3 text-blue-300">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-semibold text-gray-900">Get Response</h4>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                Gateway returns the definitive status: Success, Failed, Pending, or Refunded
              </p>
              <div className="hidden md:block absolute top-4 -right-3 text-blue-300">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h4 className="font-semibold text-gray-900">Update Records</h4>
              </div>
              <p className="text-sm text-gray-600 ml-11">
                ERP database is automatically updated and appropriate actions are taken
              </p>
            </div>
          </div>

          {/* Visual Flow */}
          <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">ERP Database</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-lg">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">API Request</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-lg">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Payment Gateway</span>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Status Synced</span>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
              <p className="text-xs text-gray-500">Total Stuck</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Loader2 className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{summaryStats.processing}</p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-orange-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{summaryStats.timeout}</p>
              <p className="text-xs text-gray-500">Timeout</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700">{summaryStats.unknown}</p>
              <p className="text-xs text-gray-500">Unknown</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">{summaryStats.gatewayError}</p>
              <p className="text-xs text-gray-500">Gateway Error</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">₹{(summaryStats.totalAmount / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-500">Total Amount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Progress Panel */}
      {isSyncing &&
      <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Syncing in Progress</h4>
                <p className="text-sm text-gray-500">
                  Processing: <span className="font-mono text-blue-600">{currentSyncingTxn}</span>
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleStopSync}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {syncResults.length} of {selectedRows.length} completed
              </span>
              <span className="font-semibold text-blue-600">{Math.round(syncProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${syncProgress}%` }} />

            </div>
          </div>
        </div>
      }

      {/* Sync Results Panel */}
      {showSyncResults && syncResults.length > 0 && !isSyncing &&
      <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sync Results</h4>
                <p className="text-sm text-gray-500">{syncResults.length} transactions processed</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => setShowSyncResults(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">
                {syncResults.filter((r) => r.status === 'success').length}
              </p>
              <p className="text-sm text-green-600">Successful</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">
                {syncResults.filter((r) => r.status === 'failed').length}
              </p>
              <p className="text-sm text-red-600">Failed</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">
                {syncResults.filter((r) => r.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600">Still Pending</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">
                {syncResults.filter((r) => r.status === 'refunded').length}
              </p>
              <p className="text-sm text-blue-600">Refunded</p>
            </div>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {syncResults.map((result) => {
            const config = getSyncResultConfig(result.status);
            return (
              <div
                key={result.txnId}
                className={`flex items-center justify-between p-4 rounded-xl border ${config.bgColor} ${config.borderColor}`}>

                  <div className="flex items-center gap-4">
                    {config.icon}
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{result.txnId}</p>
                      <p className={`text-sm ${config.textColor}`}>{result.message}</p>
                    </div>
                  </div>
                  <Badge
                  variant={
                  result.status === 'success' ?
                  'success' :
                  result.status === 'failed' ?
                  'danger' :
                  result.status === 'refunded' ?
                  'info' :
                  'warning'
                  }>

                    {config.label}
                  </Badge>
                </div>);

          })}
          </div>
        </div>
      }

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by Transaction ID, Student Name, Gateway ID..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSyncing} />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">

                <X className="w-4 h-4 text-gray-400" />
              </button>
            }
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            disabled={isSyncing}>

            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters &&
            <span className="ml-2 w-5 h-5 bg-blue-100 text-blue-700 rounded-full text-xs flex items-center justify-center">
                {[selectedGateway !== 'all', selectedStatus !== 'all', searchQuery !== ''].filter(Boolean).length}
              </span>
            }
          </Button>
        </div>

        {showFilters &&
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Gateway</label>
                <Select
                className="w-full"
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                options={[
                { value: 'all', label: 'All Gateways' },
                { value: 'Razorpay', label: 'Razorpay' },
                { value: 'PayU', label: 'PayU' },
                { value: 'CCAvenue', label: 'CCAvenue' }]
                } />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select
                className="w-full"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                options={[
                { value: 'all', label: 'All Status' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Timeout', label: 'Timeout' },
                { value: 'Unknown', label: 'Unknown' },
                { value: 'Gateway Error', label: 'Gateway Error' }]
                } />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <Select
                className="w-full"
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                options={[
                { value: 'all', label: 'All Time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'Last 7 Days' },
                { value: 'month', label: 'Last 30 Days' }]
                } />

              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="ghost" onClick={clearFilters}>
                Clear All
              </Button>
              <Button variant="primary" onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        }

        {hasActiveFilters &&
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {searchQuery &&
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:bg-gray-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
          }
            {selectedGateway !== 'all' &&
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedGateway}
                <button onClick={() => setSelectedGateway('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
          }
            {selectedStatus !== 'all' &&
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {selectedStatus}
                <button onClick={() => setSelectedStatus('all')} className="hover:bg-orange-200 rounded-full p-0.5">
                  <X className="w-3 h-3" />
                </button>
              </span>
          }
          </div>
        }
      </div>

      {/* Selection Bar */}
      {selectedRows.length > 0 && !isSyncing &&
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600"
            checked={selectedRows.length === filteredTransactions.length}
            onChange={(e) => handleSelectAll(e.target.checked)} />

            <span className="text-sm text-blue-800">
              <strong>{selectedRows.length}</strong> of {filteredTransactions.length} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
              Clear
            </Button>
            <Button variant="primary" size="sm" onClick={handleBulkSync}>
              <Zap className="w-4 h-4 mr-2" />
              Sync Selected
            </Button>
          </div>
        </div>
      }

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                Stuck Transactions ({filteredTransactions.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSelectAll(selectedRows.length !== filteredTransactions.length)}
                disabled={isSyncing}>

                {selectedRows.length === filteredTransactions.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {filteredTransactions.length === 0 ?
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Stuck Transactions</h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters ?
                'No transactions match your current filters' :
                'All transactions are in sync with payment gateways'}
                </p>
                {hasActiveFilters &&
              <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
              }
              </div> :

            <div className="divide-y divide-gray-100">
                {filteredTransactions.map((txn) => {
                const statusConfig = getStatusConfig(txn.currentStatus);
                const syncResult = syncResults.find((r) => r.txnId === txn.txnId);
                const isExpanded = expandedRow === txn.id;
                const isCurrentlySyncing = individualSyncing === txn.txnId || currentSyncingTxn === txn.txnId;

                return (
                  <div key={txn.id} className={`${selectedRows.includes(txn.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                          type="checkbox"
                          className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600"
                          checked={selectedRows.includes(txn.id)}
                          onChange={(e) => handleRowSelect(txn.id, e.target.checked)}
                          disabled={isSyncing} />


                          {/* Main Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                {/* Transaction ID */}
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded font-medium">
                                    {txn.txnId}
                                  </span>
                                  <button
                                  onClick={() => handleCopyId(txn.txnId)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Copy Transaction ID">

                                    {copiedId === txn.txnId ?
                                  <CheckCircle className="w-4 h-4 text-green-600" /> :

                                  <Copy className="w-4 h-4 text-gray-400" />
                                  }
                                  </button>
                                </div>

                                {/* Status Badge */}
                                <Badge variant={statusConfig.variant} className="flex items-center gap-1">
                                  {statusConfig.icon}
                                  <span>{txn.currentStatus}</span>
                                </Badge>

                                {/* Gateway Badge */}
                                <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${
                                txn.gateway === 'Razorpay' ?
                                'bg-blue-100 text-blue-700' :
                                txn.gateway === 'PayU' ?
                                'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'}`
                                }>

                                  {txn.gateway}
                                </span>
                              </div>

                              {/* Amount */}
                              <span className="text-lg font-bold text-gray-900">
                                ₹{txn.amount.toLocaleString('en-IN')}
                              </span>
                            </div>

                            {/* Student Info Row */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{txn.studentName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span>{txn.admissionNo}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{txn.classSection}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>{formatDateTime(txn.initiatedAt).date}</span>
                                <span className="text-gray-400">{formatDateTime(txn.initiatedAt).time}</span>
                              </div>
                            </div>

                            {/* Error Message */}
                            {txn.errorMessage &&
                          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg mb-3">
                                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-sm text-red-700">{txn.errorMessage}</p>
                                  <p className="text-xs text-red-500 mt-1">
                                    {txn.syncAttempts} sync attempt{txn.syncAttempts !== 1 ? 's' : ''} made
                                    {txn.lastSyncAttempt && ` • Last attempt: ${getTimeSince(txn.lastSyncAttempt)}`}
                                  </p>
                                </div>
                              </div>
                          }

                            {/* Sync Result */}
                            {syncResult &&
                          <div
                            className={`flex items-center gap-3 p-3 rounded-lg border ${getSyncResultConfig(syncResult.status).bgColor} ${getSyncResultConfig(syncResult.status).borderColor}`}>

                                {getSyncResultConfig(syncResult.status).icon}
                                <div>
                                  <p className={`text-sm font-medium ${getSyncResultConfig(syncResult.status).textColor}`}>
                                    {getSyncResultConfig(syncResult.status).label}
                                  </p>
                                  <p className="text-xs text-gray-600">{syncResult.message}</p>
                                </div>
                              </div>
                          }

                            {/* Expanded Details */}
                            {isExpanded &&
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h5 className="text-sm font-semibold text-gray-700 mb-3">Transaction Details</h5>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500">Gateway TXN ID</p>
                                    <p className="font-mono text-gray-900">{txn.gatewayTxnId}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Fee Type</p>
                                    <p className="text-gray-900">{txn.feeType}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Sync Attempts</p>
                                    <p className="text-gray-900">{txn.syncAttempts}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Last Sync</p>
                                    <p className="text-gray-900">
                                      {txn.lastSyncAttempt ? formatDateTime(txn.lastSyncAttempt).date : 'Never'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                          }
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedRow(isExpanded ? null : txn.id)}
                            className="text-gray-500">

                              <Eye className="w-4 h-4" />
                            </Button>

                            {!syncResult &&
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleIndividualSync(txn)}
                            disabled={isCurrentlySyncing || isSyncing}>

                                {isCurrentlySyncing ?
                            <Loader2 className="w-4 h-4 animate-spin" /> :

                            <>
                                    <RefreshCw className="w-4 h-4 mr-1" />
                                    Sync
                                  </>
                            }
                              </Button>
                          }
                          </div>
                        </div>
                      </div>
                    </div>);

              })}
              </div>
            }

            {/* Pagination */}
            {filteredTransactions.length > 0 &&
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Show</span>
                  <Select
                  className="w-20"
                  options={[
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                  { value: '50', label: '50' }]
                  }
                  defaultValue="10" />

                  <span>per page</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    1-{Math.min(10, filteredTransactions.length)} of {filteredTransactions.length}
                  </span>
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={filteredTransactions.length <= 10}>
                    Next
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Sync Activity</h3>
              </div>
              {syncLog.length > 0 &&
              <Button variant="ghost" size="sm" onClick={() => setSyncLog([])}>
                  Clear
                </Button>
              }
            </div>

            <div className="h-80 overflow-y-auto">
              {syncLog.length === 0 ?
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No sync activity yet</p>
                  <p className="text-gray-400 text-xs mt-1">Select transactions and click Sync</p>
                </div> :

              <div className="divide-y divide-gray-100">
                  {syncLog.map((log) =>
                <div key={log.id} className="p-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      log.status === 'success' ?
                      'bg-green-500' :
                      log.status === 'error' ?
                      'bg-red-500' :
                      log.status === 'warning' ?
                      'bg-yellow-500' :
                      'bg-blue-500'}`
                      } />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-xs text-gray-500">{log.txnId}</span>
                            <span className="text-xs text-gray-400">{log.timestamp}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mt-1">{log.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              }
            </div>
          </div>

          {/* Gateway Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Gateway Status</h3>
            </div>

            <div className="space-y-3">
              {[
              { name: 'Razorpay', status: 'online' },
              { name: 'PayU', status: 'online' },
              { name: 'CCAvenue', status: 'online' }].
              map((gateway) =>
              <div key={gateway.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                    className={`w-3 h-3 rounded-full ${
                    gateway.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`
                    } />

                    <span className="font-medium text-gray-700">{gateway.name}</span>
                  </div>
                  <Badge variant={gateway.status === 'online' ? 'success' : 'danger'}>
                    {gateway.status === 'online' ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Important Notes</h4>
                <ul className="space-y-2 text-sm text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>Force sync queries the payment gateway directly for latest status</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>Database records are automatically updated with gateway response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>Failed transactions may require manual intervention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                    <span>Excessive sync attempts may be rate-limited by gateway</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}