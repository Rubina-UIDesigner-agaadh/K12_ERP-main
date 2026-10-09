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
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  FileSpreadsheet,
  FileText,
  MessageSquare,
  Edit3,
  Save,
  Clock,
  AlertCircle,
  ChevronDown,
  ArrowUpDown,
  Eye,
  Printer,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  Info,
  History,
  User,
  Calendar,
  IndianRupee,
  Loader2,
  MoreHorizontal,
  Flag,
  BookOpen } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
interface MismatchRecord {
  id: string;
  txnId: string;
  orderId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  txnDate: string;
  gateway: string;
  erpAmount: number;
  bankAmount: number;
  erpStatus: 'Success' | 'Pending' | 'Failed';
  bankStatus: 'Success' | 'Pending' | 'Failed' | 'Not Found';
  mismatchType: 'Amount Variance' | 'Status Mismatch' | 'Both';
  variance: number;
  variancePercentage: number;
  settlementDate: string | null;
  utr: string | null;
  remarks: string;
  resolution:
  'Pending' |
  'Write-off' |
  'Manual Adjustment' |
  'Refund Initiated' |
  'Under Investigation' |
  'Resolved';
  resolvedBy: string | null;
  resolvedAt: string | null;
  auditTrail: {
    action: string;
    by: string;
    at: string;
    notes: string;
  }[];
}
export function SettlementMismatchReport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMismatchType, setSelectedMismatchType] = useState('all');
  const [selectedResolution, setSelectedResolution] = useState('all');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editingRemarkText, setEditingRemarkText] = useState('');
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MismatchRecord | null>(
    null
  );
  const [resolutionType, setResolutionType] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showBulkResolutionModal, setShowBulkResolutionModal] = useState(false);
  const [mismatchRecords, setMismatchRecords] = useState<MismatchRecord[]>([
  {
    id: '1',
    txnId: 'TXN_2024031501',
    orderId: 'ORD_001',
    studentName: 'Rahul Sharma',
    admissionNo: 'ADM2024001',
    classSection: '10-A',
    txnDate: '2024-03-15T10:30:00',
    gateway: 'Razorpay',
    erpAmount: 25000,
    bankAmount: 24850,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: -150,
    variancePercentage: -0.6,
    settlementDate: '2024-03-15T14:00:00',
    utr: 'UTR123456789',
    remarks: '',
    resolution: 'Pending',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: []
  },
  {
    id: '2',
    txnId: 'TXN_2024031502',
    orderId: 'ORD_002',
    studentName: 'Priya Patel',
    admissionNo: 'ADM2024002',
    classSection: '9-B',
    txnDate: '2024-03-15T09:15:00',
    gateway: 'PayU',
    erpAmount: 15000,
    bankAmount: 0,
    erpStatus: 'Success',
    bankStatus: 'Failed',
    mismatchType: 'Status Mismatch',
    variance: -15000,
    variancePercentage: -100,
    settlementDate: null,
    utr: null,
    remarks: 'Payment failed at bank level, but ERP shows success',
    resolution: 'Under Investigation',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: [
    {
      action: 'Marked for Investigation',
      by: 'Admin User',
      at: '2024-03-15T16:00:00',
      notes: 'Escalated to payment team'
    }]

  },
  {
    id: '3',
    txnId: 'TXN_2024031503',
    orderId: 'ORD_003',
    studentName: 'Amit Kumar',
    admissionNo: 'ADM2024003',
    classSection: '8-C',
    txnDate: '2024-03-14T16:45:00',
    gateway: 'Razorpay',
    erpAmount: 12000,
    bankAmount: 11820,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: -180,
    variancePercentage: -1.5,
    settlementDate: '2024-03-15T14:00:00',
    utr: 'UTR567890123',
    remarks: 'Gateway charges deducted',
    resolution: 'Write-off',
    resolvedBy: 'Finance Admin',
    resolvedAt: '2024-03-15T17:00:00',
    auditTrail: [
    {
      action: 'Resolved as Write-off',
      by: 'Finance Admin',
      at: '2024-03-15T17:00:00',
      notes: 'Gateway processing fee - approved by CFO'
    }]

  },
  {
    id: '4',
    txnId: 'TXN_2024031504',
    orderId: 'ORD_004',
    studentName: 'Sneha Gupta',
    admissionNo: 'ADM2024004',
    classSection: '11-A',
    txnDate: '2024-03-14T14:30:00',
    gateway: 'CCAvenue',
    erpAmount: 35000,
    bankAmount: 35000,
    erpStatus: 'Success',
    bankStatus: 'Failed',
    mismatchType: 'Status Mismatch',
    variance: -35000,
    variancePercentage: -100,
    settlementDate: null,
    utr: null,
    remarks: '',
    resolution: 'Pending',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: []
  },
  {
    id: '5',
    txnId: 'TXN_2024031505',
    orderId: 'ORD_005',
    studentName: 'Vikram Singh',
    admissionNo: 'ADM2024005',
    classSection: '12-B',
    txnDate: '2024-03-13T11:00:00',
    gateway: 'Razorpay',
    erpAmount: 45000,
    bankAmount: 44550,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: -450,
    variancePercentage: -1,
    settlementDate: '2024-03-14T14:00:00',
    utr: 'UTR234567890',
    remarks: 'TDS deducted by gateway',
    resolution: 'Manual Adjustment',
    resolvedBy: 'Accounts Manager',
    resolvedAt: '2024-03-14T18:00:00',
    auditTrail: [
    {
      action: 'Manual Adjustment Created',
      by: 'Accounts Manager',
      at: '2024-03-14T18:00:00',
      notes: 'Journal entry JV-2024-0456 created for TDS adjustment'
    }]

  },
  {
    id: '6',
    txnId: 'TXN_2024031506',
    orderId: 'ORD_006',
    studentName: 'Ananya Reddy',
    admissionNo: 'ADM2024006',
    classSection: '7-A',
    txnDate: '2024-03-15T08:00:00',
    gateway: 'PayU',
    erpAmount: 8000,
    bankAmount: 8200,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: 200,
    variancePercentage: 2.5,
    settlementDate: '2024-03-15T14:00:00',
    utr: 'UTR111222333',
    remarks: '',
    resolution: 'Pending',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: []
  },
  {
    id: '7',
    txnId: 'TXN_2024031507',
    orderId: 'ORD_007',
    studentName: 'Rohan Mehta',
    admissionNo: 'ADM2024007',
    classSection: '6-C',
    txnDate: '2024-03-14T10:45:00',
    gateway: 'Razorpay',
    erpAmount: 18000,
    bankAmount: 0,
    erpStatus: 'Success',
    bankStatus: 'Not Found',
    mismatchType: 'Both',
    variance: -18000,
    variancePercentage: -100,
    settlementDate: null,
    utr: null,
    remarks: 'No corresponding settlement record found',
    resolution: 'Under Investigation',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: [
    {
      action: 'Flagged for Review',
      by: 'System',
      at: '2024-03-15T00:00:00',
      notes: 'Automatic flagging - no settlement match'
    }]

  },
  {
    id: '8',
    txnId: 'TXN_2024031508',
    orderId: 'ORD_008',
    studentName: 'Kavya Nair',
    admissionNo: 'ADM2024008',
    classSection: '9-A',
    txnDate: '2024-03-12T16:00:00',
    gateway: 'CCAvenue',
    erpAmount: 22000,
    bankAmount: 21780,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: -220,
    variancePercentage: -1,
    settlementDate: '2024-03-13T14:00:00',
    utr: 'UTR444555666',
    remarks: 'Gateway MDR charges',
    resolution: 'Write-off',
    resolvedBy: 'Finance Admin',
    resolvedAt: '2024-03-13T17:30:00',
    auditTrail: [
    {
      action: 'Resolved as Write-off',
      by: 'Finance Admin',
      at: '2024-03-13T17:30:00',
      notes: 'Standard MDR deduction - within acceptable range'
    }]

  },
  {
    id: '9',
    txnId: 'TXN_2024031509',
    orderId: 'ORD_009',
    studentName: 'Arjun Das',
    admissionNo: 'ADM2024009',
    classSection: '10-B',
    txnDate: '2024-03-11T09:30:00',
    gateway: 'Razorpay',
    erpAmount: 30000,
    bankAmount: 30000,
    erpStatus: 'Success',
    bankStatus: 'Failed',
    mismatchType: 'Status Mismatch',
    variance: -30000,
    variancePercentage: -100,
    settlementDate: null,
    utr: null,
    remarks: 'Refund already initiated to parent',
    resolution: 'Refund Initiated',
    resolvedBy: 'Refund Team',
    resolvedAt: '2024-03-12T10:00:00',
    auditTrail: [
    {
      action: 'Refund Initiated',
      by: 'Refund Team',
      at: '2024-03-12T10:00:00',
      notes: 'Refund ID: RFD_2024031201 - Amount ₹30,000'
    }]

  },
  {
    id: '10',
    txnId: 'TXN_2024031510',
    orderId: 'ORD_010',
    studentName: 'Meera Joshi',
    admissionNo: 'ADM2024010',
    classSection: '8-A',
    txnDate: '2024-03-10T14:20:00',
    gateway: 'PayU',
    erpAmount: 16000,
    bankAmount: 15840,
    erpStatus: 'Success',
    bankStatus: 'Success',
    mismatchType: 'Amount Variance',
    variance: -160,
    variancePercentage: -1,
    settlementDate: '2024-03-11T14:00:00',
    utr: 'UTR777888999',
    remarks: '',
    resolution: 'Pending',
    resolvedBy: null,
    resolvedAt: null,
    auditTrail: []
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
  const filteredRecords = mismatchRecords.filter((record) => {
    const matchesSearch =
    searchQuery === '' ||
    record.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.admissionNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMismatchType =
    selectedMismatchType === 'all' ||
    record.mismatchType === selectedMismatchType;
    const matchesResolution =
    selectedResolution === 'all' || record.resolution === selectedResolution;
    const matchesGateway =
    selectedGateway === 'all' || record.gateway === selectedGateway;
    return (
      matchesSearch &&
      matchesMismatchType &&
      matchesResolution &&
      matchesGateway);

  });
  const stats = {
    totalMismatches: mismatchRecords.length,
    amountVariance: mismatchRecords.filter(
      (r) => r.mismatchType === 'Amount Variance'
    ).length,
    statusMismatch: mismatchRecords.filter(
      (r) => r.mismatchType === 'Status Mismatch'
    ).length,
    pending: mismatchRecords.filter((r) => r.resolution === 'Pending').length,
    resolved: mismatchRecords.filter(
      (r) =>
      r.resolution !== 'Pending' && r.resolution !== 'Under Investigation'
    ).length,
    totalVariance: mismatchRecords.reduce((sum, r) => sum + r.variance, 0)
  };
  const handleSaveRemark = (recordId: string) => {
    setMismatchRecords((prev) =>
    prev.map((r) =>
    r.id === recordId ?
    {
      ...r,
      remarks: editingRemarkText,
      auditTrail: [
      ...r.auditTrail,
      {
        action: 'Remark Added',
        by: 'Current User',
        at: new Date().toISOString(),
        notes: editingRemarkText
      }]

    } :
    r
    )
    );
    setEditingRemarkId(null);
    setEditingRemarkText('');
  };
  const handleResolve = () => {
    if (!selectedRecord || !resolutionType) return;
    setMismatchRecords((prev) =>
    prev.map((r) =>
    r.id === selectedRecord.id ?
    {
      ...r,
      resolution: resolutionType as MismatchRecord['resolution'],
      resolvedBy: 'Current User',
      resolvedAt: new Date().toISOString(),
      remarks: resolutionNotes || r.remarks,
      auditTrail: [
      ...r.auditTrail,
      {
        action: `Resolved as ${resolutionType}`,
        by: 'Current User',
        at: new Date().toISOString(),
        notes: resolutionNotes
      }]

    } :
    r
    )
    );
    setShowResolutionModal(false);
    setSelectedRecord(null);
    setResolutionType('');
    setResolutionNotes('');
  };
  const handleBulkResolve = () => {
    if (!resolutionType || selectedRows.length === 0) return;
    setMismatchRecords((prev) =>
    prev.map((r) =>
    selectedRows.includes(r.id) ?
    {
      ...r,
      resolution: resolutionType as MismatchRecord['resolution'],
      resolvedBy: 'Current User',
      resolvedAt: new Date().toISOString(),
      remarks: resolutionNotes || r.remarks,
      auditTrail: [
      ...r.auditTrail,
      {
        action: `Bulk Resolved as ${resolutionType}`,
        by: 'Current User',
        at: new Date().toISOString(),
        notes: resolutionNotes
      }]

    } :
    r
    )
    );
    setShowBulkResolutionModal(false);
    setSelectedRows([]);
    setResolutionType('');
    setResolutionNotes('');
  };
  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    setShowExportMenu(false);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsExporting(false);
    console.log('Exported to:', format);
  };
  const clearFilters = () => {
    setSelectedMismatchType('all');
    setSelectedResolution('all');
    setSelectedGateway('all');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };
  const hasActiveFilters =
  selectedMismatchType !== 'all' ||
  selectedResolution !== 'all' ||
  selectedGateway !== 'all' ||
  dateFrom ||
  dateTo ||
  searchQuery;
  const getMismatchTypeIcon = (type: string) => {
    switch (type) {
      case 'Amount Variance':
        return <IndianRupee className="w-3 h-3" />;
      case 'Status Mismatch':
        return <AlertTriangle className="w-3 h-3" />;
      case 'Both':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Info className="w-3 h-3" />;
    }
  };
  const getMismatchTypeColor = (type: string) => {
    switch (type) {
      case 'Amount Variance':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Status Mismatch':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Both':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  const getResolutionBadge = (resolution: string) => {
    switch (resolution) {
      case 'Pending':
        return (
          <Badge variant="warning" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>);

      case 'Write-off':
        return (
          <Badge variant="outline" className="text-xs bg-gray-100">
            <Minus className="w-3 h-3 mr-1" />
            Write-off
          </Badge>);

      case 'Manual Adjustment':
        return (
          <Badge variant="info" className="text-xs">
            <Edit3 className="w-3 h-3 mr-1" />
            Manual Adj.
          </Badge>);

      case 'Refund Initiated':
        return (
          <Badge variant="success" className="text-xs">
            <RefreshCw className="w-3 h-3 mr-1" />
            Refund
          </Badge>);

      case 'Under Investigation':
        return (
          <Badge variant="danger" className="text-xs">
            <Search className="w-3 h-3 mr-1" />
            Investigating
          </Badge>);

      case 'Resolved':
        return (
          <Badge variant="success" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>);

      default:
        return (
          <Badge variant="outline" className="text-xs">
            {resolution}
          </Badge>);

    }
  };
  const columns = [
  {
    key: 'checkbox',
    header:
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedRows(
            filteredRecords.
            filter((r) => r.resolution === 'Pending').
            map((r) => r.id)
          );
        } else {
          setSelectedRows([]);
        }
      }}
      checked={
      selectedRows.length ===
      filteredRecords.filter((r) => r.resolution === 'Pending').
      length &&
      filteredRecords.filter((r) => r.resolution === 'Pending').length > 0
      } />,


    render: (row: MismatchRecord) =>
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={selectedRows.includes(row.id)}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedRows([...selectedRows, row.id]);
        } else {
          setSelectedRows(selectedRows.filter((id) => id !== row.id));
        }
      }}
      disabled={
      row.resolution !== 'Pending' &&
      row.resolution !== 'Under Investigation'
      } />


  },
  {
    key: 'txnDetails',
    header: 'Transaction Details',
    render: (row: MismatchRecord) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{row.txnId}</span>
          </div>
          <div className="text-xs text-gray-500">{row.orderId}</div>
          <div className="text-sm text-gray-700">{row.studentName}</div>
          <div className="text-xs text-gray-500">{row.classSection}</div>
        </div>

  },
  {
    key: 'mismatchType',
    header: 'Mismatch Type',
    render: (row: MismatchRecord) =>
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getMismatchTypeColor(row.mismatchType)}`}>

          {getMismatchTypeIcon(row.mismatchType)}
          {row.mismatchType}
        </div>

  },
  {
    key: 'erpDetails',
    header: 'ERP Record',
    render: (row: MismatchRecord) =>
    <div className="space-y-1">
          <div className="font-bold text-gray-900">
            ₹{row.erpAmount.toLocaleString()}
          </div>
          <Badge
        variant={
        row.erpStatus === 'Success' ?
        'success' :
        row.erpStatus === 'Pending' ?
        'warning' :
        'danger'
        }
        className="text-xs">

            {row.erpStatus}
          </Badge>
        </div>

  },
  {
    key: 'bankDetails',
    header: 'Bank Settlement',
    render: (row: MismatchRecord) =>
    <div className="space-y-1">
          <div className="font-bold text-gray-900">
            {row.bankAmount > 0 ? `₹${row.bankAmount.toLocaleString()}` : '-'}
          </div>
          <Badge
        variant={
        row.bankStatus === 'Success' ?
        'success' :
        row.bankStatus === 'Pending' ?
        'warning' :
        row.bankStatus === 'Not Found' ?
        'outline' :
        'danger'
        }
        className="text-xs">

            {row.bankStatus}
          </Badge>
          {row.utr &&
      <div className="text-xs text-gray-500">UTR: {row.utr}</div>
      }
        </div>

  },
  {
    key: 'variance',
    header: 'Variance',
    render: (row: MismatchRecord) =>
    <div className="space-y-1">
          <div
        className={`font-bold flex items-center gap-1 ${row.variance > 0 ? 'text-green-600' : row.variance < 0 ? 'text-red-600' : 'text-gray-600'}`}>

            {row.variance > 0 ?
        <TrendingUp className="w-4 h-4" /> :
        row.variance < 0 ?
        <TrendingDown className="w-4 h-4" /> :
        null}
            ₹{Math.abs(row.variance).toLocaleString()}
          </div>
          <div
        className={`text-xs ${row.variance > 0 ? 'text-green-600' : row.variance < 0 ? 'text-red-600' : 'text-gray-500'}`}>

            ({row.variancePercentage > 0 ? '+' : ''}
            {row.variancePercentage.toFixed(1)}%)
          </div>
        </div>

  },
  {
    key: 'gateway',
    header: 'Gateway',
    render: (row: MismatchRecord) =>
    <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div
          className={`w-2 h-2 rounded-full ${row.gateway === 'Razorpay' ? 'bg-blue-500' : row.gateway === 'PayU' ? 'bg-green-500' : 'bg-purple-500'}`}>
        </div>
            <span className="text-sm">{row.gateway}</span>
          </div>
          <div className="text-xs text-gray-500">
            {formatDateTime(row.txnDate).date}
          </div>
        </div>

  },
  {
    key: 'remarks',
    header: 'Remarks',
    render: (row: MismatchRecord) =>
    <div className="min-w-[200px]">
          {editingRemarkId === row.id ?
      <div className="flex gap-2">
              <Input
          type="text"
          value={editingRemarkText}
          onChange={(e) => setEditingRemarkText(e.target.value)}
          className="text-sm flex-1"
          placeholder="Enter remarks..."
          autoFocus />

              <Button
          size="sm"
          variant="primary"
          onClick={() => handleSaveRemark(row.id)}>

                <Save className="w-3 h-3" />
              </Button>
              <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingRemarkId(null);
            setEditingRemarkText('');
          }}>

                <X className="w-3 h-3" />
              </Button>
            </div> :

      <div className="flex items-start gap-2">
              <div className="flex-1">
                {row.remarks ?
          <p className="text-sm text-gray-700">{row.remarks}</p> :

          <p className="text-sm text-gray-400 italic">No remarks</p>
          }
              </div>
              <button
          onClick={() => {
            setEditingRemarkId(row.id);
            setEditingRemarkText(row.remarks);
          }}
          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
          title="Edit Remarks">

                <Edit3 className="w-3 h-3" />
              </button>
            </div>
      }
        </div>

  },
  {
    key: 'resolution',
    header: 'Resolution',
    render: (row: MismatchRecord) =>
    <div className="space-y-2">
          {getResolutionBadge(row.resolution)}
          {row.resolvedBy &&
      <div className="text-xs text-gray-500">
              by {row.resolvedBy}
              <br />
              {row.resolvedAt && formatDateTime(row.resolvedAt).date}
            </div>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: MismatchRecord) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => {
          setSelectedRecord(row);
          setShowDetailModal(true);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        title="View Details">

            <Eye className="w-4 h-4" />
          </button>
          <button
        onClick={() => {
          setSelectedRecord(row);
          setShowAuditTrailModal(true);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
        title="Audit Trail">

            <History className="w-4 h-4" />
          </button>
          {(row.resolution === 'Pending' ||
      row.resolution === 'Under Investigation') &&
      <button
        onClick={() => {
          setSelectedRecord(row);
          setShowResolutionModal(true);
        }}
        className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
        title="Resolve">

              <CheckCircle2 className="w-4 h-4" />
            </button>
      }
        </div>

  }];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Settlement Mismatch Report
          </h1>
          <p className="text-sm text-gray-500">
            Exception report for transactions with amount variance or status
            discrepancies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="relative">
            <Button
              variant="primary"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}>

              {isExporting ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </> :

              <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                  <ChevronDown className="w-4 h-4 ml-2" />
                </>
              }
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export to Excel
                </button>
                <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">

                  <FileText className="w-4 h-4 text-red-600" />
                  Export to PDF
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Report Info Banner */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">
              Exception Report Criteria
            </h4>
            <ul className="mt-1 text-sm text-amber-700 space-y-1">
              <li>
                • <strong>Amount Variance:</strong> ERP Amount ≠ Settled Bank
                Amount (after gateway charges)
              </li>
              <li>
                • <strong>Status Mismatch:</strong> ERP Status = 'Success' but
                Bank Settlement = 'Failed' or 'Not Found'
              </li>
              <li>
                • All mismatches require auditor review and resolution
                annotation
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-6 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-gray-500">
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalMismatches}
          </div>
          <div className="text-xs text-gray-500 mt-1">Total Mismatches</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-orange-500">
          <div className="text-2xl font-bold text-orange-600">
            {stats.amountVariance}
          </div>
          <div className="text-xs text-gray-500 mt-1">Amount Variance</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-red-500">
          <div className="text-2xl font-bold text-red-600">
            {stats.statusMismatch}
          </div>
          <div className="text-xs text-gray-500 mt-1">Status Mismatch</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-yellow-500">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-xs text-gray-500 mt-1">Pending Resolution</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-green-500">
          <div className="text-2xl font-bold text-green-600">
            {stats.resolved}
          </div>
          <div className="text-xs text-gray-500 mt-1">Resolved</div>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-purple-500">
          <div
            className={`text-2xl font-bold ${stats.totalVariance < 0 ? 'text-red-600' : 'text-green-600'}`}>

            ₹{Math.abs(stats.totalVariance).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Total Variance {stats.totalVariance < 0 ? '(Loss)' : '(Gain)'}
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Transaction ID, Order ID, Student Name, Admission No..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />

            </div>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}>

              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters &&
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                  Active
                </span>
              }
            </Button>
          </div>

          {showFilters &&
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mismatch Type
                  </label>
                  <Select
                  className="w-full"
                  value={selectedMismatchType}
                  onChange={(e) => setSelectedMismatchType(e.target.value)}
                  options={[
                  {
                    value: 'all',
                    label: 'All Types'
                  },
                  {
                    value: 'Amount Variance',
                    label: 'Amount Variance'
                  },
                  {
                    value: 'Status Mismatch',
                    label: 'Status Mismatch'
                  },
                  {
                    value: 'Both',
                    label: 'Both'
                  }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Status
                  </label>
                  <Select
                  className="w-full"
                  value={selectedResolution}
                  onChange={(e) => setSelectedResolution(e.target.value)}
                  options={[
                  {
                    value: 'all',
                    label: 'All Status'
                  },
                  {
                    value: 'Pending',
                    label: 'Pending'
                  },
                  {
                    value: 'Write-off',
                    label: 'Write-off'
                  },
                  {
                    value: 'Manual Adjustment',
                    label: 'Manual Adjustment'
                  },
                  {
                    value: 'Refund Initiated',
                    label: 'Refund Initiated'
                  },
                  {
                    value: 'Under Investigation',
                    label: 'Under Investigation'
                  }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Gateway
                  </label>
                  <Select
                  className="w-full"
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  options={[
                  {
                    value: 'all',
                    label: 'All Gateways'
                  },
                  {
                    value: 'Razorpay',
                    label: 'Razorpay'
                  },
                  {
                    value: 'PayU',
                    label: 'PayU'
                  },
                  {
                    value: 'CCAvenue',
                    label: 'CCAvenue'
                  }]
                  } />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date From
                  </label>
                  <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date To
                  </label>
                  <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full" />

                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="ghost" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <Button variant="primary" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          }

          {hasActiveFilters &&
          <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {searchQuery &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  Search: "{searchQuery}"
                  <button
                onClick={() => setSearchQuery('')}
                className="hover:bg-gray-200 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {selectedMismatchType !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                  Type: {selectedMismatchType}
                  <button
                onClick={() => setSelectedMismatchType('all')}
                className="hover:bg-orange-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {selectedResolution !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Resolution: {selectedResolution}
                  <button
                onClick={() => setSelectedResolution('all')}
                className="hover:bg-blue-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {selectedGateway !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Gateway: {selectedGateway}
                  <button
                onClick={() => setSelectedGateway('all')}
                className="hover:bg-green-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium">

                Clear all
              </button>
            </div>
          }
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedRows.length > 0 &&
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            <strong>{selectedRows.length}</strong> mismatch(es) selected
          </span>
          <div className="flex gap-2">
            <Button
            variant="primary"
            size="sm"
            onClick={() => setShowBulkResolutionModal(true)}>

              <CheckCircle2 className="w-4 h-4 mr-2" />
              Bulk Resolve
            </Button>
            <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRows([])}>

              Clear Selection
            </Button>
          </div>
        </div>
      }

      {/* Data Table */}
      <Card
        title={`Mismatch Records (${filteredRecords.length})`}
        headerAction={
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        }>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={filteredRecords}
            className="[&_tr]:group" />

        </div>

        {filteredRecords.length === 0 &&
        <div className="py-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Mismatches Found
              </h3>
              <p className="text-sm text-gray-500">
                {hasActiveFilters ?
              'Try adjusting your filter criteria' :
              'All settlements are matching correctly'}
              </p>
            </div>
          </div>
        }

        {filteredRecords.length > 0 &&
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rows per page:</span>
              <Select
              className="w-20"
              options={[
              {
                value: '10',
                label: '10'
              },
              {
                value: '25',
                label: '25'
              },
              {
                value: '50',
                label: '50'
              }]
              }
              defaultValue="10" />

            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                1-{Math.min(10, filteredRecords.length)} of{' '}
                {filteredRecords.length}
              </span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button
                variant="outline"
                size="sm"
                disabled={filteredRecords.length <= 10}>

                  Next
                </Button>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Resolution Modal */}
      {showResolutionModal && selectedRecord &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Resolve Mismatch
                </h3>
                <button
                onClick={() => {
                  setShowResolutionModal(false);
                  setSelectedRecord(null);
                  setResolutionType('');
                  setResolutionNotes('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Record Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Transaction ID
                    </div>
                    <div className="font-mono font-medium">
                      {selectedRecord.txnId}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Student</div>
                    <div className="font-medium">
                      {selectedRecord.studentName}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">ERP Amount</div>
                    <div className="font-bold">
                      ₹{selectedRecord.erpAmount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Bank Amount
                    </div>
                    <div className="font-bold">
                      ₹{selectedRecord.bankAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Variance</div>
                    <div
                    className={`font-bold text-lg ${selectedRecord.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>

                      ₹{Math.abs(selectedRecord.variance).toLocaleString()} (
                      {selectedRecord.variancePercentage.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>

              {/* Resolution Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Type <span className="text-red-500">*</span>
                </label>
                <Select
                className="w-full"
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                options={[
                {
                  value: '',
                  label: 'Select Resolution'
                },
                {
                  value: 'Write-off',
                  label: 'Write-off (Accept the loss)'
                },
                {
                  value: 'Manual Adjustment',
                  label: 'Manual Adjustment (Create journal entry)'
                },
                {
                  value: 'Refund Initiated',
                  label: 'Refund Initiated (Refund to parent)'
                },
                {
                  value: 'Under Investigation',
                  label: 'Under Investigation (Escalate)'
                },
                {
                  value: 'Resolved',
                  label: 'Resolved (Issue fixed)'
                }]
                } />

              </div>

              {/* Resolution Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes / Remarks{' '}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                placeholder="Explain how this mismatch was resolved..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)} />

                <p className="text-xs text-gray-500 mt-1">
                  This note will be added to the audit trail for compliance
                  purposes.
                </p>
              </div>

              {/* Resolution Examples */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">
                      Example Resolution Notes:
                    </p>
                    <ul className="text-xs space-y-1 list-disc list-inside">
                      <li>Gateway MDR charges of 1.5% - approved by CFO</li>
                      <li>TDS deducted at source - JV-2024-0456 created</li>
                      <li>Refund processed - RFD_2024031201</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowResolutionModal(false);
                setSelectedRecord(null);
                setResolutionType('');
                setResolutionNotes('');
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleResolve}
              disabled={!resolutionType || !resolutionNotes}>

                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Resolution
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Bulk Resolution Modal */}
      {showBulkResolutionModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Bulk Resolve Mismatches
                </h3>
                <button
                onClick={() => {
                  setShowBulkResolutionModal(false);
                  setResolutionType('');
                  setResolutionNotes('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  You are about to resolve{' '}
                  <strong>{selectedRows.length}</strong> mismatch records with
                  the same resolution.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Type <span className="text-red-500">*</span>
                </label>
                <Select
                className="w-full"
                value={resolutionType}
                onChange={(e) => setResolutionType(e.target.value)}
                options={[
                {
                  value: '',
                  label: 'Select Resolution'
                },
                {
                  value: 'Write-off',
                  label: 'Write-off'
                },
                {
                  value: 'Manual Adjustment',
                  label: 'Manual Adjustment'
                },
                {
                  value: 'Under Investigation',
                  label: 'Under Investigation'
                }]
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
                placeholder="Enter notes for all selected records..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)} />

              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowBulkResolutionModal(false);
                setResolutionType('');
                setResolutionNotes('');
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleBulkResolve}
              disabled={!resolutionType || !resolutionNotes}>

                Resolve {selectedRows.length} Records
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal && selectedRecord &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  Mismatch Details
                </h3>
                <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedRecord(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Mismatch Type Badge */}
              <div className="flex items-center justify-between">
                <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getMismatchTypeColor(selectedRecord.mismatchType)}`}>

                  {getMismatchTypeIcon(selectedRecord.mismatchType)}
                  {selectedRecord.mismatchType}
                </div>
                {getResolutionBadge(selectedRecord.resolution)}
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">
                    Transaction ID
                  </div>
                  <div className="font-mono font-medium">
                    {selectedRecord.txnId}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Order ID</div>
                  <div className="font-mono font-medium">
                    {selectedRecord.orderId}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Student</div>
                  <div className="font-medium">
                    {selectedRecord.studentName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {selectedRecord.admissionNo} • {selectedRecord.classSection}
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Gateway</div>
                  <div className="font-medium">{selectedRecord.gateway}</div>
                  <div className="text-sm text-gray-500">
                    {formatDateTime(selectedRecord.txnDate).date}
                  </div>
                </div>
              </div>

              {/* Amount Comparison */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">
                  Amount Comparison
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-xs text-gray-500 mb-1">ERP Amount</div>
                    <div className="text-xl font-bold text-blue-600">
                      ₹{selectedRecord.erpAmount.toLocaleString()}
                    </div>
                    <Badge
                    variant={
                    selectedRecord.erpStatus === 'Success' ?
                    'success' :
                    'danger'
                    }
                    className="mt-2 text-xs">

                      {selectedRecord.erpStatus}
                    </Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-xs text-gray-500 mb-1">Variance</div>
                    <div
                    className={`text-xl font-bold ${selectedRecord.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>

                      {selectedRecord.variance > 0 ? '+' : ''}₹
                      {selectedRecord.variance.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-2">
                      ({selectedRecord.variancePercentage.toFixed(2)}%)
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <div className="text-xs text-gray-500 mb-1">
                      Bank Amount
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      ₹{selectedRecord.bankAmount.toLocaleString()}
                    </div>
                    <Badge
                    variant={
                    selectedRecord.bankStatus === 'Success' ?
                    'success' :
                    selectedRecord.bankStatus === 'Not Found' ?
                    'outline' :
                    'danger'
                    }
                    className="mt-2 text-xs">

                      {selectedRecord.bankStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Settlement Info */}
              {selectedRecord.settlementDate &&
            <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Settlement Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500">
                        Settlement Date
                      </div>
                      <div className="font-medium">
                        {formatDateTime(selectedRecord.settlementDate).date}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">UTR Number</div>
                      <div className="font-mono text-sm">
                        {selectedRecord.utr}
                      </div>
                    </div>
                  </div>
                </div>
            }

              {/* Remarks */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Remarks
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedRecord.remarks || 'No remarks added yet'}
                </p>
              </div>

              {/* Resolution Info */}
              {selectedRecord.resolvedBy &&
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Resolution
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Resolved By</div>
                      <div className="font-medium">
                        {selectedRecord.resolvedBy}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Resolved At</div>
                      <div className="font-medium">
                        {selectedRecord.resolvedAt &&
                    formatDateTime(selectedRecord.resolvedAt).date}
                      </div>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowDetailModal(false);
                setSelectedRecord(null);
              }}>

                Close
              </Button>
              {(selectedRecord.resolution === 'Pending' ||
            selectedRecord.resolution === 'Under Investigation') &&
            <Button
              variant="primary"
              onClick={() => {
                setShowDetailModal(false);
                setShowResolutionModal(true);
              }}>

                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Resolve
                </Button>
            }
            </div>
          </div>
        </div>
      }

      {/* Audit Trail Modal */}
      {showAuditTrailModal && selectedRecord &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Audit Trail</h3>
                <button
                onClick={() => {
                  setShowAuditTrailModal(false);
                  setSelectedRecord(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {selectedRecord.txnId}
                </span>
              </div>

              {selectedRecord.auditTrail.length === 0 ?
            <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No audit trail entries yet</p>
                </div> :

            <div className="space-y-4">
                  {selectedRecord.auditTrail.map((entry, index) =>
              <div
                key={index}
                className="relative pl-6 pb-4 border-l-2 border-gray-200 last:pb-0">

                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {entry.action}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(entry.at).date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <User className="w-3 h-3" />
                          {entry.by}
                        </div>
                        {entry.notes &&
                  <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                            {entry.notes}
                          </p>
                  }
                      </div>
                    </div>
              )}
                </div>
            }
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
              <Button
              variant="outline"
              onClick={() => {
                setShowAuditTrailModal(false);
                setSelectedRecord(null);
              }}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}