import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Upload,
  Download,
  ArrowLeftRight,
  ArrowRight,
  FileSpreadsheet,
  Database,
  Building2,
  Link2,
  Unlink,
  Filter,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  MoreHorizontal,
  Clock,
  Ban,
  Copy,
  SplitSquareVertical,
  Layers,
  GitCompare } from
'lucide-react';

interface SystemRecord {
  id: string;
  txnId: string;
  orderId: string;
  studentName: string;
  amount: number;
  paidAt: string;
  gateway: string;
  status: 'Success' | 'Pending' | 'Failed';
  matched: boolean;
  matchedWith?: string;
}

interface BankRecord {
  id: string;
  settlementId: string;
  orderId: string;
  txnRef: string;
  amount: number;
  settledAt: string;
  gateway: string;
  utr: string;
  matched: boolean;
  matchedWith?: string;
}

interface MatchedPair {
  systemRecord: SystemRecord;
  bankRecord: BankRecord;
  matchType: 'Auto' | 'Manual';
  variance: number;
}

export function OnlinePaymentReconciliation() {
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAutoReconciling, setIsAutoReconciling] = useState(false);
  const [reconcileProgress, setReconcileProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualMatchModal, setShowManualMatchModal] = useState(false);
  const [showJournalEntryModal, setShowJournalEntryModal] = useState(false);
  const [selectedSystemRecord, setSelectedSystemRecord] = useState<SystemRecord | null>(null);
  const [selectedBankRecord, setSelectedBankRecord] = useState<BankRecord | null>(null);
  const [selectedUnmatchedRecord, setSelectedUnmatchedRecord] = useState<SystemRecord | BankRecord | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [reconciliationComplete, setReconciliationComplete] = useState(false);
  const [journalEntryType, setJournalEntryType] = useState('');
  const [journalNotes, setJournalNotes] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'matched' | 'unmatched'>('split');
  const [expandedSections, setExpandedSections] = useState({
    matched: true,
    systemUnmatched: true,
    bankUnmatched: true
  });

  // System Records (ERP Transactions)
  const [systemRecords, setSystemRecords] = useState<SystemRecord[]>([
  {
    id: 's1',
    txnId: 'TXN_2024031501',
    orderId: 'ORD_001',
    studentName: 'Rahul Sharma',
    amount: 25000,
    paidAt: '2024-03-15T10:30:00',
    gateway: 'Razorpay',
    status: 'Success',
    matched: false
  },
  {
    id: 's2',
    txnId: 'TXN_2024031502',
    orderId: 'ORD_002',
    studentName: 'Priya Patel',
    amount: 15000,
    paidAt: '2024-03-15T09:15:00',
    gateway: 'PayU',
    status: 'Success',
    matched: false
  },
  {
    id: 's3',
    txnId: 'TXN_2024031503',
    orderId: 'ORD_003',
    studentName: 'Amit Kumar',
    amount: 12000,
    paidAt: '2024-03-14T16:45:00',
    gateway: 'Razorpay',
    status: 'Success',
    matched: false
  },
  {
    id: 's4',
    txnId: 'TXN_2024031504',
    orderId: 'ORD_004',
    studentName: 'Sneha Gupta',
    amount: 35000,
    paidAt: '2024-03-14T14:30:00',
    gateway: 'CCAvenue',
    status: 'Success',
    matched: false
  },
  {
    id: 's5',
    txnId: 'TXN_2024031505',
    orderId: 'ORD_005',
    studentName: 'Vikram Singh',
    amount: 45000,
    paidAt: '2024-03-13T11:00:00',
    gateway: 'Razorpay',
    status: 'Success',
    matched: false
  },
  {
    id: 's6',
    txnId: 'TXN_2024031506',
    orderId: 'ORD_006',
    studentName: 'Ananya Reddy',
    amount: 8000,
    paidAt: '2024-03-15T08:00:00',
    gateway: 'PayU',
    status: 'Success',
    matched: false
  },
  {
    id: 's7',
    txnId: 'TXN_2024031507',
    orderId: 'ORD_007',
    studentName: 'Rohan Mehta',
    amount: 18000,
    paidAt: '2024-03-14T10:45:00',
    gateway: 'Razorpay',
    status: 'Success',
    matched: false
  },
  {
    id: 's8',
    txnId: 'TXN_2024031508',
    orderId: 'ORD_008',
    studentName: 'Kavya Nair',
    amount: 22000,
    paidAt: '2024-03-12T16:00:00',
    gateway: 'CCAvenue',
    status: 'Pending',
    matched: false
  }]
  );

  // Bank/Gateway Settlement Records
  const [bankRecords, setBankRecords] = useState<BankRecord[]>([
  {
    id: 'b1',
    settlementId: 'STL_001',
    orderId: 'ORD_001',
    txnRef: 'pay_NxYz123456789',
    amount: 25000,
    settledAt: '2024-03-15T14:00:00',
    gateway: 'Razorpay',
    utr: 'UTR123456789',
    matched: false
  },
  {
    id: 'b2',
    settlementId: 'STL_002',
    orderId: 'ORD_002',
    txnRef: 'PAYU_ABC987654321',
    amount: 15000,
    settledAt: '2024-03-15T14:00:00',
    gateway: 'PayU',
    utr: 'UTR987654321',
    matched: false
  },
  {
    id: 'b3',
    settlementId: 'STL_003',
    orderId: 'ORD_003',
    txnRef: 'pay_AbCd567890123',
    amount: 12000,
    settledAt: '2024-03-15T14:00:00',
    gateway: 'Razorpay',
    utr: 'UTR567890123',
    matched: false
  },
  {
    id: 'b4',
    settlementId: 'STL_004',
    orderId: 'ORD_004',
    txnRef: 'CC_ORDER_789456123',
    amount: 35000,
    settledAt: '2024-03-15T14:00:00',
    gateway: 'CCAvenue',
    utr: 'UTR789456123',
    matched: false
  },
  {
    id: 'b5',
    settlementId: 'STL_005',
    orderId: 'ORD_005',
    txnRef: 'pay_EfGh234567890',
    amount: 45000,
    settledAt: '2024-03-14T14:00:00',
    gateway: 'Razorpay',
    utr: 'UTR234567890',
    matched: false
  },
  {
    id: 'b6',
    settlementId: 'STL_006',
    orderId: 'ORD_009',
    txnRef: 'pay_Unknown123',
    amount: 10000,
    settledAt: '2024-03-15T14:00:00',
    gateway: 'Razorpay',
    utr: 'UTR111222333',
    matched: false
  },
  {
    id: 'b7',
    settlementId: 'STL_007',
    orderId: 'ORD_010',
    txnRef: 'PAYU_Unknown456',
    amount: 7500,
    settledAt: '2024-03-14T14:00:00',
    gateway: 'PayU',
    utr: 'UTR444555666',
    matched: false
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

  const handleAutoReconcile = async () => {
    setIsAutoReconciling(true);
    setReconcileProgress(0);
    setMatchedPairs([]);

    const newMatchedPairs: MatchedPair[] = [];
    const updatedSystemRecords = [...systemRecords];
    const updatedBankRecords = [...bankRecords];

    // Simulate matching process
    for (let i = 0; i < systemRecords.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setReconcileProgress((i + 1) / systemRecords.length * 100);

      const sysRecord = systemRecords[i];
      const matchingBankRecord = bankRecords.find(
        (br) => br.orderId === sysRecord.orderId && !br.matched
      );

      if (matchingBankRecord) {
        const sysIndex = updatedSystemRecords.findIndex((r) => r.id === sysRecord.id);
        const bankIndex = updatedBankRecords.findIndex((r) => r.id === matchingBankRecord.id);

        updatedSystemRecords[sysIndex] = {
          ...updatedSystemRecords[sysIndex],
          matched: true,
          matchedWith: matchingBankRecord.id
        };

        updatedBankRecords[bankIndex] = {
          ...updatedBankRecords[bankIndex],
          matched: true,
          matchedWith: sysRecord.id
        };

        newMatchedPairs.push({
          systemRecord: updatedSystemRecords[sysIndex],
          bankRecord: updatedBankRecords[bankIndex],
          matchType: 'Auto',
          variance: sysRecord.amount - matchingBankRecord.amount
        });
      }
    }

    setSystemRecords(updatedSystemRecords);
    setBankRecords(updatedBankRecords);
    setMatchedPairs(newMatchedPairs);
    setIsAutoReconciling(false);
    setReconciliationComplete(true);
  };

  const handleManualMatch = () => {
    if (!selectedSystemRecord || !selectedBankRecord) return;

    const updatedSystemRecords = systemRecords.map((r) =>
    r.id === selectedSystemRecord.id ?
    { ...r, matched: true, matchedWith: selectedBankRecord.id } :
    r
    );

    const updatedBankRecords = bankRecords.map((r) =>
    r.id === selectedBankRecord.id ?
    { ...r, matched: true, matchedWith: selectedSystemRecord.id } :
    r
    );

    const newPair: MatchedPair = {
      systemRecord: { ...selectedSystemRecord, matched: true, matchedWith: selectedBankRecord.id },
      bankRecord: { ...selectedBankRecord, matched: true, matchedWith: selectedSystemRecord.id },
      matchType: 'Manual',
      variance: selectedSystemRecord.amount - selectedBankRecord.amount
    };

    setSystemRecords(updatedSystemRecords);
    setBankRecords(updatedBankRecords);
    setMatchedPairs([...matchedPairs, newPair]);
    setShowManualMatchModal(false);
    setSelectedSystemRecord(null);
    setSelectedBankRecord(null);
  };

  const handleCreateJournalEntry = () => {
    console.log('Creating journal entry for:', selectedUnmatchedRecord, journalEntryType, journalNotes);
    setShowJournalEntryModal(false);
    setSelectedUnmatchedRecord(null);
    setJournalEntryType('');
    setJournalNotes('');
  };

  const unmatchedSystemRecords = systemRecords.filter((r) => !r.matched && r.status === 'Success');
  const unmatchedBankRecords = bankRecords.filter((r) => !r.matched);

  const stats = {
    totalSystemRecords: systemRecords.length,
    totalBankRecords: bankRecords.length,
    matchedCount: matchedPairs.length,
    unmatchedSystem: unmatchedSystemRecords.length,
    unmatchedBank: unmatchedBankRecords.length,
    totalSystemAmount: systemRecords.filter((r) => r.status === 'Success').reduce((sum, r) => sum + r.amount, 0),
    totalBankAmount: bankRecords.reduce((sum, r) => sum + r.amount, 0),
    matchedAmount: matchedPairs.reduce((sum, p) => sum + p.systemRecord.amount, 0)
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Reconciliation</h1>
          <p className="text-sm text-gray-500">
            Compare system records with gateway settlements and resolve discrepancies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import Settlement
          </Button>
          <Button
            variant="primary"
            onClick={handleAutoReconcile}
            disabled={isAutoReconciling || reconciliationComplete}>

            {isAutoReconciling ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Reconciling...
              </> :

            <>
                <Zap className="w-4 h-4 mr-2" />
                Auto-Reconcile
              </>
            }
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Transaction ID, Order ID..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
          </div>
          <Select
            className="w-40"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            options={[
            { value: 'today', label: 'Today' },
            { value: 'yesterday', label: 'Yesterday' },
            { value: 'week', label: 'This Week' },
            { value: 'month', label: 'This Month' }]
            } />

          <Select
            className="w-40"
            value={selectedGateway}
            onChange={(e) => setSelectedGateway(e.target.value)}
            options={[
            { value: 'all', label: 'All Gateways' },
            { value: 'Razorpay', label: 'Razorpay' },
            { value: 'PayU', label: 'PayU' },
            { value: 'CCAvenue', label: 'CCAvenue' }]
            } />

          <div className="flex items-center gap-1 border rounded-lg p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded ${viewMode === 'split' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Split View">

              <SplitSquareVertical className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('matched')}
              className={`p-2 rounded ${viewMode === 'matched' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Matched Records">

              <Link2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('unmatched')}
              className={`p-2 rounded ${viewMode === 'unmatched' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`}
              title="Unmatched Records">

              <Unlink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Reconciliation Progress */}
      {isAutoReconciling &&
      <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              <div>
                <h4 className="font-medium text-gray-900">Auto-Reconciliation in Progress</h4>
                <p className="text-sm text-gray-600">Matching records based on Order ID / Transaction ID...</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{Math.round(reconcileProgress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${reconcileProgress}%` }}>
              </div>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Reconciliation Summary */}
      {reconciliationComplete &&
      <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">Reconciliation Complete</h4>
                <p className="text-sm text-green-700">
                  {matchedPairs.length} records matched • {unmatchedSystemRecords.length + unmatchedBankRecords.length} exceptions found
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setReconciliationComplete(false);
                setMatchedPairs([]);
                setSystemRecords(systemRecords.map((r) => ({ ...r, matched: false, matchedWith: undefined })));
                setBankRecords(bankRecords.map((r) => ({ ...r, matched: false, matchedWith: undefined })));
              }}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
      }

      

      {/* Split Screen View */}
      {viewMode === 'split' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - System Records */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">System Records (ERP)</h3>
                </div>
                <Badge variant="info">{systemRecords.length} records</Badge>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {systemRecords.map((record) =>
            <div
              key={record.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
              record.matched ?
              'bg-green-50 border-l-4 border-l-green-500' :
              record.status === 'Success' ?
              'bg-red-50 border-l-4 border-l-red-500' :
              ''} ${

              selectedSystemRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''}`
              }
              onClick={() => !record.matched && record.status === 'Success' && setSelectedSystemRecord(record)}>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{record.txnId}</span>
                      {record.matched ?
                  <Badge variant="success" className="text-xs">
                          <Link2 className="w-3 h-3 mr-1" />
                          Matched
                        </Badge> :
                  record.status === 'Success' ?
                  <Badge variant="danger" className="text-xs">
                          <Unlink className="w-3 h-3 mr-1" />
                          Unmatched
                        </Badge> :

                  <Badge variant="warning" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {record.status}
                        </Badge>
                  }
                    </div>
                    <span className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-600">{record.studentName}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-500 font-mono text-xs">{record.orderId}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDateTime(record.paidAt).date}</span>
                  </div>
                  {record.matched && record.matchedWith &&
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      Matched with {bankRecords.find((b) => b.id === record.matchedWith)?.settlementId}
                    </div>
              }
                </div>
            )}
            </div>
          </Card>

          {/* Right Side - Bank Records */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-green-50 border-b border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Bank/Gateway Settlements</h3>
                </div>
                <Badge variant="success">{bankRecords.length} records</Badge>
              </div>
            </div>
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              {bankRecords.map((record) =>
            <div
              key={record.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
              record.matched ?
              'bg-green-50 border-l-4 border-l-green-500' :
              'bg-orange-50 border-l-4 border-l-orange-500'} ${

              selectedBankRecord?.id === record.id ? 'ring-2 ring-blue-500' : ''}`
              }
              onClick={() => !record.matched && setSelectedBankRecord(record)}>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{record.settlementId}</span>
                      {record.matched ?
                  <Badge variant="success" className="text-xs">
                          <Link2 className="w-3 h-3 mr-1" />
                          Matched
                        </Badge> :

                  <Badge variant="warning" className="text-xs">
                          <Unlink className="w-3 h-3 mr-1" />
                          Unmatched
                        </Badge>
                  }
                    </div>
                    <span className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-gray-500 font-mono text-xs">{record.orderId}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-gray-600">{record.gateway}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDateTime(record.settledAt).date}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    UTR: {record.utr}
                  </div>
                  {record.matched && record.matchedWith &&
              <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      Matched with {systemRecords.find((s) => s.id === record.matchedWith)?.txnId}
                    </div>
              }
                </div>
            )}
            </div>
          </Card>
        </div>
      }

      {/* Manual Match Action Bar */}
      {selectedSystemRecord && selectedBankRecord &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs text-gray-500">System Record</div>
                <div className="font-mono font-medium">{selectedSystemRecord.txnId}</div>
                <div className="text-sm font-bold text-gray-900">₹{selectedSystemRecord.amount.toLocaleString()}</div>
              </div>
              <ArrowLeftRight className="w-6 h-6 text-blue-600" />
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-xs text-gray-500">Bank Record</div>
                <div className="font-mono font-medium">{selectedBankRecord.settlementId}</div>
                <div className="text-sm font-bold text-gray-900">₹{selectedBankRecord.amount.toLocaleString()}</div>
              </div>
              {selectedSystemRecord.amount !== selectedBankRecord.amount &&
            <div className="p-3 bg-yellow-100 rounded-lg border border-yellow-300">
                  <div className="text-xs text-yellow-700">Variance</div>
                  <div className="font-bold text-yellow-800">
                    ₹{Math.abs(selectedSystemRecord.amount - selectedBankRecord.amount).toLocaleString()}
                  </div>
                </div>
            }
            </div>
            <div className="flex gap-2">
              <Button
              variant="ghost"
              onClick={() => {
                setSelectedSystemRecord(null);
                setSelectedBankRecord(null);
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleManualMatch}>
                <Link2 className="w-4 h-4 mr-2" />
                Manually Match
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Matched Records View */}
      {(viewMode === 'matched' || viewMode === 'split' && matchedPairs.length > 0) && matchedPairs.length > 0 &&
      <Card className="overflow-hidden">
          <div
          className="p-4 bg-green-50 border-b border-green-200 cursor-pointer"
          onClick={() => toggleSection('matched')}>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Matched Records ({matchedPairs.length})</h3>
              </div>
              {expandedSections.matched ?
            <ChevronUp className="w-5 h-5 text-gray-400" /> :

            <ChevronDown className="w-5 h-5 text-gray-400" />
            }
            </div>
          </div>
          {expandedSections.matched &&
        <div className="divide-y divide-gray-100">
              {matchedPairs.map((pair, index) =>
          <div key={index} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-blue-600 font-medium">SYSTEM</span>
                        <Badge variant="outline" className="text-xs">{pair.matchType}</Badge>
                      </div>
                      <div className="font-mono text-sm font-medium">{pair.systemRecord.txnId}</div>
                      <div className="text-sm text-gray-600">{pair.systemRecord.studentName}</div>
                      <div className="font-bold text-gray-900 mt-1">₹{pair.systemRecord.amount.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                      {pair.variance !== 0 &&
                <span className="text-xs text-yellow-600 mt-1">
                          Variance: ₹{Math.abs(pair.variance).toLocaleString()}
                        </span>
                }
                    </div>
                    <div className="flex-1 p-3 bg-green-50 rounded-lg">
                      <div className="text-xs text-green-600 font-medium mb-1">BANK</div>
                      <div className="font-mono text-sm font-medium">{pair.bankRecord.settlementId}</div>
                      <div className="text-sm text-gray-600">UTR: {pair.bankRecord.utr}</div>
                      <div className="font-bold text-gray-900 mt-1">₹{pair.bankRecord.amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
          )}
            </div>
        }
        </Card>
      }

      {/* Unmatched Records View */}
      {(viewMode === 'unmatched' || viewMode === 'split') &&
      <>
          {/* Unmatched System Records */}
          {unmatchedSystemRecords.length > 0 &&
        <Card className="overflow-hidden">
              <div
            className="p-4 bg-red-50 border-b border-red-200 cursor-pointer"
            onClick={() => toggleSection('systemUnmatched')}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">
                      System Records with No Bank Settlement ({unmatchedSystemRecords.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="danger">Needs Attention</Badge>
                    {expandedSections.systemUnmatched ?
                <ChevronUp className="w-5 h-5 text-gray-400" /> :

                <ChevronDown className="w-5 h-5 text-gray-400" />
                }
                  </div>
                </div>
              </div>
              {expandedSections.systemUnmatched &&
          <div className="divide-y divide-gray-100">
                  {unmatchedSystemRecords.map((record) =>
            <div key={record.id} className="p-4 bg-red-50/50 hover:bg-red-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-medium">{record.txnId}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-mono text-xs text-gray-500">{record.orderId}</span>
                            <Badge variant="outline" className="text-xs">{record.gateway}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-900 font-medium">{record.studentName}</span>
                            <span className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</span>
                            <span className="text-gray-500">{formatDateTime(record.paidAt).date}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedSystemRecord(record);
                      setShowManualMatchModal(true);
                    }}>

                            <Link2 className="w-4 h-4 mr-1" />
                            Manual Match
                          </Button>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUnmatchedRecord(record);
                      setShowJournalEntryModal(true);
                    }}>

                            <FileText className="w-4 h-4 mr-1" />
                            Journal Entry
                          </Button>
                        </div>
                      </div>
                    </div>
            )}
                </div>
          }
            </Card>
        }

          {/* Unmatched Bank Records */}
          {unmatchedBankRecords.length > 0 &&
        <Card className="overflow-hidden">
              <div
            className="p-4 bg-orange-50 border-b border-orange-200 cursor-pointer"
            onClick={() => toggleSection('bankUnmatched')}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">
                      Bank Settlements with No System Record ({unmatchedBankRecords.length})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Money Received - No ERP Entry</Badge>
                    {expandedSections.bankUnmatched ?
                <ChevronUp className="w-5 h-5 text-gray-400" /> :

                <ChevronDown className="w-5 h-5 text-gray-400" />
                }
                  </div>
                </div>
              </div>
              {expandedSections.bankUnmatched &&
          <div className="divide-y divide-gray-100">
                  {unmatchedBankRecords.map((record) =>
            <div key={record.id} className="p-4 bg-orange-50/50 hover:bg-orange-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-medium">{record.settlementId}</span>
                            <span className="text-gray-400">•</span>
                            <span className="font-mono text-xs text-gray-500">{record.orderId}</span>
                            <Badge variant="outline" className="text-xs">{record.gateway}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-600">Ref: {record.txnRef}</span>
                            <span className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</span>
                            <span className="text-gray-500">UTR: {record.utr}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBankRecord(record);
                      setShowManualMatchModal(true);
                    }}>

                            <Link2 className="w-4 h-4 mr-1" />
                            Manual Match
                          </Button>
                          <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedUnmatchedRecord(record);
                      setShowJournalEntryModal(true);
                    }}>

                            <FileText className="w-4 h-4 mr-1" />
                            Journal Entry
                          </Button>
                        </div>
                      </div>
                    </div>
            )}
                </div>
          }
            </Card>
        }
        </>
      }

      {/* No Exceptions State */}
      {viewMode === 'unmatched' && unmatchedSystemRecords.length === 0 && unmatchedBankRecords.length === 0 &&
      <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Exceptions Found</h3>
            <p className="text-sm text-gray-500">
              All records have been successfully reconciled
            </p>
          </div>
        </Card>
      }

      {/* Import Settlement Modal */}
      {showUploadModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Import Gateway Settlement</h3>
                <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Gateway
                </label>
                <Select
                className="w-full"
                options={[
                { value: '', label: 'Select Gateway' },
                { value: 'razorpay', label: 'Razorpay' },
                { value: 'payu', label: 'PayU' },
                { value: 'ccavenue', label: 'CCAvenue' }]
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Settlement File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports: CSV, XLS, XLSX (Max 10MB)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium">File Format Requirements:</p>
                    <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                      <li>Must contain Order ID / Transaction ID column</li>
                      <li>Amount column should be in INR</li>
                      <li>Settlement date in DD/MM/YYYY format</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                <Upload className="w-4 h-4 mr-2" />
                Upload & Process
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Manual Match Modal */}
      {showManualMatchModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Manual Record Matching</h3>
                <button
                onClick={() => {
                  setShowManualMatchModal(false);
                  setSelectedSystemRecord(null);
                  setSelectedBankRecord(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* System Record Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select System Record
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unmatchedSystemRecords.map((record) =>
                  <div
                    key={record.id}
                    onClick={() => setSelectedSystemRecord(record)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedSystemRecord?.id === record.id ?
                    'border-blue-500 bg-blue-50 ring-2 ring-blue-200' :
                    'border-gray-200 hover:border-gray-300'}`
                    }>

                        <div className="font-mono text-sm font-medium">{record.txnId}</div>
                        <div className="text-sm text-gray-600">{record.studentName}</div>
                        <div className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</div>
                      </div>
                  )}
                  </div>
                </div>

                {/* Bank Record Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Bank Record
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {unmatchedBankRecords.map((record) =>
                  <div
                    key={record.id}
                    onClick={() => setSelectedBankRecord(record)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedBankRecord?.id === record.id ?
                    'border-green-500 bg-green-50 ring-2 ring-green-200' :
                    'border-gray-200 hover:border-gray-300'}`
                    }>

                        <div className="font-mono text-sm font-medium">{record.settlementId}</div>
                        <div className="text-sm text-gray-600">Order: {record.orderId}</div>
                        <div className="font-bold text-gray-900">₹{record.amount.toLocaleString()}</div>
                      </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Match Preview */}
              {selectedSystemRecord && selectedBankRecord &&
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">System</div>
                      <div className="font-bold">₹{selectedSystemRecord.amount.toLocaleString()}</div>
                    </div>
                    <ArrowLeftRight className="w-6 h-6 text-gray-400" />
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Bank</div>
                      <div className="font-bold">₹{selectedBankRecord.amount.toLocaleString()}</div>
                    </div>
                    {selectedSystemRecord.amount !== selectedBankRecord.amount &&
                <>
                        <div className="text-gray-400">=</div>
                        <div className="text-center">
                          <div className="text-xs text-yellow-600 mb-1">Variance</div>
                          <div className="font-bold text-yellow-700">
                            ₹{Math.abs(selectedSystemRecord.amount - selectedBankRecord.amount).toLocaleString()}
                          </div>
                        </div>
                      </>
                }
                  </div>
                </div>
            }
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowManualMatchModal(false);
                setSelectedSystemRecord(null);
                setSelectedBankRecord(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleManualMatch}
              disabled={!selectedSystemRecord || !selectedBankRecord}>

                <Link2 className="w-4 h-4 mr-2" />
                Confirm Match
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Journal Entry Modal */}
      {showJournalEntryModal && selectedUnmatchedRecord &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Journal Entry</h3>
                <button
                onClick={() => {
                  setShowJournalEntryModal(false);
                  setSelectedUnmatchedRecord(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Record Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-2">Creating entry for:</div>
                <div className="font-mono font-medium">
                  {'txnId' in selectedUnmatchedRecord ?
                selectedUnmatchedRecord.txnId :
                selectedUnmatchedRecord.settlementId}
                </div>
                <div className="font-bold text-lg mt-1">
                  ₹{selectedUnmatchedRecord.amount.toLocaleString()}
                </div>
              </div>

              {/* Entry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Journal Entry Type <span className="text-red-500">*</span>
                </label>
                <Select
                className="w-full"
                value={journalEntryType}
                onChange={(e) => setJournalEntryType(e.target.value)}
                options={[
                { value: '', label: 'Select Entry Type' },
                { value: 'advance_receipt', label: 'Advance Receipt' },
                { value: 'suspense', label: 'Suspense Account' },
                { value: 'refund_pending', label: 'Refund Pending' },
                { value: 'bank_charges', label: 'Bank Charges Adjustment' },
                { value: 'write_off', label: 'Write Off' },
                { value: 'other', label: 'Other' }]
                } />

              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes / Remarks
                </label>
                <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Enter any additional notes for this journal entry..."
                value={journalNotes}
                onChange={(e) => setJournalNotes(e.target.value)} />

              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium">This action will:</p>
                    <ul className="mt-1 list-disc list-inside text-xs space-y-1">
                      <li>Create a journal entry in the accounting system</li>
                      <li>Mark this record as resolved in reconciliation</li>
                      <li>Generate an audit trail for compliance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowJournalEntryModal(false);
                setSelectedUnmatchedRecord(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleCreateJournalEntry}
              disabled={!journalEntryType}>

                <FileText className="w-4 h-4 mr-2" />
                Create Journal Entry
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}