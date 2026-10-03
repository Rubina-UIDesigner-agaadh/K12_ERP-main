import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Modal } from '../../../components/ui/Modal';
import {
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Upload,
  FileText,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  Download,
  Send,
  Paperclip,
  X,
  AlertOctagon,
  CreditCard,
  Calendar,
  User,
  Building,
  Trash2,
  Edit,
  MoreVertical,
  ExternalLink } from
'lucide-react';

type TabType = 'failed' | 'disputed';
type DisputeStatus = 'Open' | 'Under Review' | 'Resolved' | 'Lost';

interface FailedTransaction {
  id: string;
  txnId: string;
  date: string;
  student: string;
  studentId: string;
  class: string;
  amount: number;
  gateway: string;
  errorCode: string;
  errorMessage: string;
  retryCount: number;
  lastRetryDate: string | null;
}

interface DisputedTransaction {
  id: string;
  txnId: string;
  originalTxnDate: string;
  disputeDate: string;
  student: string;
  studentId: string;
  class: string;
  amount: number;
  gateway: string;
  reason: string;
  status: DisputeStatus;
  caseId: string;
  dueDate: string;
  documents: {name: string;uploadedAt: string;size: string;}[];
  notes: {author: string;date: string;content: string;}[];
}

export function FailedDisputedTransactions() {
  const [activeTab, setActiveTab] = useState<TabType>('failed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [selectedErrorType, setSelectedErrorType] = useState('all');
  const [selectedDisputeStatus, setSelectedDisputeStatus] = useState('all');
  const [dateRange, setDateRange] = useState('week');
  const [selectedFailedTxns, setSelectedFailedTxns] = useState<string[]>([]);
  const [selectedDisputedTxn, setSelectedDisputedTxn] =
  useState<DisputedTransaction | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isRetryModalOpen, setIsRetryModalOpen] = useState(false);
  const [selectedRetryTxn, setSelectedRetryTxn] =
  useState<FailedTransaction | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<DisputeStatus>('Open');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Mock data for failed transactions
  const failedTransactions: FailedTransaction[] = [
  {
    id: '1',
    txnId: 'TXN_F001234',
    date: '2024-03-15 10:30 AM',
    student: 'Rahul Sharma',
    studentId: 'STU001',
    class: '10-A',
    amount: 25000,
    gateway: 'Razorpay',
    errorCode: 'ERR_001',
    errorMessage: 'Insufficient Funds',
    retryCount: 2,
    lastRetryDate: '2024-03-15 02:30 PM'
  },
  {
    id: '2',
    txnId: 'TXN_F001235',
    date: '2024-03-15 11:45 AM',
    student: 'Priya Patel',
    studentId: 'STU002',
    class: '9-B',
    amount: 15000,
    gateway: 'PayU',
    errorCode: 'ERR_002',
    errorMessage: 'Transaction Timeout',
    retryCount: 1,
    lastRetryDate: '2024-03-15 12:00 PM'
  },
  {
    id: '3',
    txnId: 'TXN_F001236',
    date: '2024-03-14 03:20 PM',
    student: 'Amit Kumar',
    studentId: 'STU003',
    class: '8-C',
    amount: 12000,
    gateway: 'Razorpay',
    errorCode: 'ERR_003',
    errorMessage: 'Card Declined by Bank',
    retryCount: 0,
    lastRetryDate: null
  },
  {
    id: '4',
    txnId: 'TXN_F001237',
    date: '2024-03-14 04:50 PM',
    student: 'Sneha Reddy',
    studentId: 'STU004',
    class: '11-A',
    amount: 30000,
    gateway: 'Paytm',
    errorCode: 'ERR_004',
    errorMessage: 'Invalid Card Number',
    retryCount: 0,
    lastRetryDate: null
  },
  {
    id: '5',
    txnId: 'TXN_F001238',
    date: '2024-03-13 09:15 AM',
    student: 'Vikram Singh',
    studentId: 'STU005',
    class: '12-B',
    amount: 45000,
    gateway: 'Razorpay',
    errorCode: 'ERR_005',
    errorMessage: 'Authentication Failed (3DS)',
    retryCount: 3,
    lastRetryDate: '2024-03-14 10:00 AM'
  },
  {
    id: '6',
    txnId: 'TXN_F001239',
    date: '2024-03-13 02:30 PM',
    student: 'Ananya Gupta',
    studentId: 'STU006',
    class: '7-A',
    amount: 8000,
    gateway: 'PayU',
    errorCode: 'ERR_006',
    errorMessage: 'Bank Server Unavailable',
    retryCount: 1,
    lastRetryDate: '2024-03-13 04:00 PM'
  }];


  // Mock data for disputed transactions
  const disputedTransactions: DisputedTransaction[] = [
  {
    id: '1',
    txnId: 'TXN_D002001',
    originalTxnDate: '2024-02-28 10:30 AM',
    disputeDate: '2024-03-10',
    student: 'Karan Mehta',
    studentId: 'STU010',
    class: '10-B',
    amount: 35000,
    gateway: 'Razorpay',
    reason: 'Customer claims unauthorized transaction',
    status: 'Open',
    caseId: 'DISP_2024_001',
    dueDate: '2024-03-25',
    documents: [],
    notes: [
    {
      author: 'System',
      date: '2024-03-10 09:00 AM',
      content: 'Dispute case opened by bank notification'
    }]

  },
  {
    id: '2',
    txnId: 'TXN_D002002',
    originalTxnDate: '2024-02-20 02:15 PM',
    disputeDate: '2024-03-05',
    student: 'Meera Joshi',
    studentId: 'STU011',
    class: '9-A',
    amount: 22000,
    gateway: 'PayU',
    reason: 'Service not received as described',
    status: 'Under Review',
    caseId: 'DISP_2024_002',
    dueDate: '2024-03-20',
    documents: [
    {
      name: 'Fee_Receipt_STU011.pdf',
      uploadedAt: '2024-03-06 10:30 AM',
      size: '245 KB'
    },
    {
      name: 'Attendance_Record.pdf',
      uploadedAt: '2024-03-06 10:35 AM',
      size: '128 KB'
    }],

    notes: [
    {
      author: 'System',
      date: '2024-03-05 11:00 AM',
      content: 'Dispute case opened by bank notification'
    },
    {
      author: 'Finance Officer',
      date: '2024-03-06 10:40 AM',
      content:
      'Uploaded fee receipt and attendance records as evidence. Student has been attending classes regularly.'
    },
    {
      author: 'Finance Officer',
      date: '2024-03-08 03:00 PM',
      content:
      'Called HDFC Bank dispute team. Reference: REF123456. They confirmed documents received.'
    }]

  },
  {
    id: '3',
    txnId: 'TXN_D002003',
    originalTxnDate: '2024-02-15 11:00 AM',
    disputeDate: '2024-02-28',
    student: 'Rohan Agarwal',
    studentId: 'STU012',
    class: '11-C',
    amount: 28000,
    gateway: 'Razorpay',
    reason: 'Duplicate transaction charged',
    status: 'Resolved',
    caseId: 'DISP_2024_003',
    dueDate: '2024-03-15',
    documents: [
    {
      name: 'Transaction_Proof.pdf',
      uploadedAt: '2024-03-01 09:00 AM',
      size: '180 KB'
    },
    {
      name: 'Bank_Statement.pdf',
      uploadedAt: '2024-03-01 09:05 AM',
      size: '320 KB'
    },
    {
      name: 'Resolution_Letter.pdf',
      uploadedAt: '2024-03-12 02:00 PM',
      size: '95 KB'
    }],

    notes: [
    {
      author: 'System',
      date: '2024-02-28 10:00 AM',
      content: 'Dispute case opened by bank notification'
    },
    {
      author: 'Finance Officer',
      date: '2024-03-01 09:10 AM',
      content:
      'Verified our records - only single transaction found. Uploaded proof documents.'
    },
    {
      author: 'Finance Officer',
      date: '2024-03-12 02:05 PM',
      content:
      'Bank confirmed in our favor. Dispute resolved. No chargeback applied.'
    }]

  },
  {
    id: '4',
    txnId: 'TXN_D002004',
    originalTxnDate: '2024-02-10 04:30 PM',
    disputeDate: '2024-02-25',
    student: 'Nisha Kapoor',
    studentId: 'STU013',
    class: '8-B',
    amount: 18000,
    gateway: 'Paytm',
    reason: 'Transaction not recognized by cardholder',
    status: 'Lost',
    caseId: 'DISP_2024_004',
    dueDate: '2024-03-10',
    documents: [
    {
      name: 'Fee_Receipt.pdf',
      uploadedAt: '2024-02-26 11:00 AM',
      size: '156 KB'
    }],

    notes: [
    {
      author: 'System',
      date: '2024-02-25 09:00 AM',
      content: 'Dispute case opened by bank notification'
    },
    {
      author: 'Finance Officer',
      date: '2024-02-26 11:05 AM',
      content: 'Uploaded fee receipt as evidence.'
    },
    {
      author: 'Finance Officer',
      date: '2024-03-10 04:00 PM',
      content:
      'Bank ruled in favor of cardholder. Amount debited from settlement. Need to follow up with parent.'
    }]

  }];


  // Error type options for filtering
  const errorTypeOptions = [
  { value: 'all', label: 'All Error Types' },
  { value: 'insufficient', label: 'Insufficient Funds' },
  { value: 'timeout', label: 'Transaction Timeout' },
  { value: 'declined', label: 'Card Declined' },
  { value: 'invalid', label: 'Invalid Card' },
  { value: 'auth', label: 'Authentication Failed' },
  { value: 'server', label: 'Server Error' }];


  // Gateway options
  const gatewayOptions = [
  { value: 'all', label: 'All Gateways' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'payu', label: 'PayU' },
  { value: 'paytm', label: 'Paytm' }];


  // Dispute status options
  const disputeStatusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'lost', label: 'Lost' }];


  // Date range options
  const dateRangeOptions = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'custom', label: 'Custom Range' }];


  // Status update options for disputes
  const statusUpdateOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Lost', label: 'Lost' }];


  // Get error badge variant
  const getErrorBadgeVariant = (errorMessage: string) => {
    if (errorMessage.includes('Insufficient')) return 'warning';
    if (errorMessage.includes('Timeout') || errorMessage.includes('Server'))
    return 'secondary';
    if (errorMessage.includes('Declined') || errorMessage.includes('Invalid'))
    return 'danger';
    if (errorMessage.includes('Authentication')) return 'danger';
    return 'secondary';
  };

  // Get dispute status badge variant
  const getDisputeStatusVariant = (status: DisputeStatus) => {
    switch (status) {
      case 'Open':
        return 'warning';
      case 'Under Review':
        return 'info';
      case 'Resolved':
        return 'success';
      case 'Lost':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  // Handle checkbox selection for failed transactions
  const handleSelectFailedTxn = (id: string) => {
    setSelectedFailedTxns((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Handle select all failed transactions
  const handleSelectAllFailed = () => {
    if (selectedFailedTxns.length === failedTransactions.length) {
      setSelectedFailedTxns([]);
    } else {
      setSelectedFailedTxns(failedTransactions.map((t) => t.id));
    }
  };

  // Handle retry single transaction
  const handleRetryTransaction = (txn: FailedTransaction) => {
    setSelectedRetryTxn(txn);
    setIsRetryModalOpen(true);
  };

  // Handle open dispute details
  const handleOpenDisputeDetails = (txn: DisputedTransaction) => {
    setSelectedDisputedTxn(txn);
    setNewStatus(txn.status);
    setNewNote('');
    setUploadedFiles([]);
    setIsDisputeModalOpen(true);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  // Handle remove uploaded file
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle add note
  const handleAddNote = () => {
    if (newNote.trim() && selectedDisputedTxn) {
      // In real app, this would update the state or call API
      console.log('Adding note:', newNote);
      setNewNote('');
    }
  };

  // Handle update dispute status
  const handleUpdateDisputeStatus = () => {
    if (selectedDisputedTxn) {
      // In real app, this would update the state or call API
      console.log('Updating status to:', newStatus);
      console.log('Files to upload:', uploadedFiles);
      setIsDisputeModalOpen(false);
    }
  };

  // Failed transactions table columns
  const failedColumns = [
  {
    key: 'checkbox',
    header:
    <input
      type="checkbox"
      checked={selectedFailedTxns.length === failedTransactions.length}
      onChange={handleSelectAllFailed}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />,


    render: (row: FailedTransaction) =>
    <input
      type="checkbox"
      checked={selectedFailedTxns.includes(row.id)}
      onChange={() => handleSelectFailedTxn(row.id)}
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />


  },
  {
    key: 'txnId',
    header: 'Transaction ID',
    render: (row: FailedTransaction) =>
    <div>
          <span className="font-mono text-xs text-gray-900">{row.txnId}</span>
          <p className="text-xs text-gray-500 mt-0.5">{row.date}</p>
        </div>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: FailedTransaction) =>
    <div>
          <span className="font-medium text-gray-900">{row.student}</span>
          <p className="text-xs text-gray-500">
            {row.studentId} • {row.class}
          </p>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: FailedTransaction) =>
    <span className="font-bold text-gray-900">
          ₹{row.amount.toLocaleString()}
        </span>

  },
  {
    key: 'gateway',
    header: 'Gateway',
    render: (row: FailedTransaction) =>
    <Badge variant="outline">{row.gateway}</Badge>

  },
  {
    key: 'error',
    header: 'Error Details',
    render: (row: FailedTransaction) =>
    <div>
          <Badge variant={getErrorBadgeVariant(row.errorMessage)}>
            {row.errorMessage}
          </Badge>
          <p className="text-xs text-gray-400 mt-1 font-mono">{row.errorCode}</p>
        </div>

  },
  {
    key: 'retry',
    header: 'Retry Info',
    render: (row: FailedTransaction) =>
    <div className="text-sm">
          <span
        className={`font-medium ${row.retryCount >= 3 ? 'text-red-600' : 'text-gray-700'}`}>

            {row.retryCount}/3 attempts
          </span>
          {row.lastRetryDate &&
      <p className="text-xs text-gray-500 mt-0.5">
              Last: {row.lastRetryDate}
            </p>
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: FailedTransaction) =>
    <div className="flex items-center gap-2">
          <Button
        variant="ghost"
        size="sm"
        onClick={() => handleRetryTransaction(row)}
        disabled={row.retryCount >= 3}
        title={row.retryCount >= 3 ? 'Max retries reached' : 'Retry payment'}>

            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="View details">
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" title="Contact parent">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>

  }];


  // Disputed transactions table columns
  const disputedColumns = [
  {
    key: 'caseId',
    header: 'Case Details',
    render: (row: DisputedTransaction) =>
    <div>
          <span className="font-mono text-xs font-medium text-gray-900">
            {row.caseId}
          </span>
          <p className="text-xs text-gray-500 mt-0.5">TXN: {row.txnId}</p>
        </div>

  },
  {
    key: 'dates',
    header: 'Timeline',
    render: (row: DisputedTransaction) =>
    <div className="text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <CreditCard className="w-3 h-3" />
            <span>Txn: {row.originalTxnDate}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 mt-1">
            <AlertTriangle className="w-3 h-3" />
            <span>Dispute: {row.disputeDate}</span>
          </div>
        </div>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: DisputedTransaction) =>
    <div>
          <span className="font-medium text-gray-900">{row.student}</span>
          <p className="text-xs text-gray-500">
            {row.studentId} • {row.class}
          </p>
        </div>

  },
  {
    key: 'amount',
    header: 'Amount',
    render: (row: DisputedTransaction) =>
    <span className="font-bold text-red-600">
          ₹{row.amount.toLocaleString()}
        </span>

  },
  {
    key: 'reason',
    header: 'Dispute Reason',
    render: (row: DisputedTransaction) =>
    <div className="max-w-xs">
          <p className="text-sm text-gray-700 truncate" title={row.reason}>
            {row.reason}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">via {row.gateway}</p>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: DisputedTransaction) =>
    <div>
          <Badge variant={getDisputeStatusVariant(row.status)}>
            {row.status}
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            Due: {row.dueDate}
          </p>
        </div>

  },
  {
    key: 'evidence',
    header: 'Evidence',
    render: (row: DisputedTransaction) =>
    <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Paperclip className="w-3 h-3" />
            <span>{row.documents.length} files</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MessageSquare className="w-3 h-3" />
            <span>{row.notes.length} notes</span>
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: DisputedTransaction) =>
    <div className="flex items-center gap-2">
          <Button
        variant="primary"
        size="sm"
        onClick={() => handleOpenDisputeDetails(row)}>

            Manage
          </Button>
          <Button variant="ghost" size="sm" title="More options">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Failed & Disputed Transactions
          </h1>
          <p className="text-sm text-gray-500">
            Manage failed payments and handle chargeback disputes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Select
            className="w-40"
            options={dateRangeOptions}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)} />

        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'failed' ?
            'border-red-500 text-red-600' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }>

            <XCircle className="w-5 h-5" />
            Failed Transactions
            <Badge variant="danger" className="ml-1">
              {failedTransactions.length}
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab('disputed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
            activeTab === 'disputed' ?
            'border-orange-500 text-orange-600' :
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
            }>

            <AlertTriangle className="w-5 h-5" />
            Disputed / Chargebacks
            <Badge variant="warning" className="ml-1">
              {disputedTransactions.filter((t) => t.status !== 'Resolved').length}
            </Badge>
          </button>
        </nav>
      </div>

      {/* Failed Transactions Tab */}
      {activeTab === 'failed' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                  placeholder="Search by Transaction ID, Student Name, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10" />

                </div>
              </div>
              <Select
              className="w-44"
              options={gatewayOptions}
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)} />

              <Select
              className="w-48"
              options={errorTypeOptions}
              value={selectedErrorType}
              onChange={(e) => setSelectedErrorType(e.target.value)} />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Bulk Actions */}
          {selectedFailedTxns.length > 0 &&
        <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedFailedTxns.length} transaction(s) selected
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Payment Reminder
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Selected
                  </Button>
                </div>
              </div>
            </Card>
        }

          {/* Failed Transactions Table */}
          <Card>
            <Table columns={failedColumns} data={failedTransactions} />
          </Card>

          {/* Summary Footer */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span>
                Total Failed Amount:{' '}
                <strong className="text-red-600">
                  ₹
                  {failedTransactions.
                reduce((sum, t) => sum + t.amount, 0).
                toLocaleString()}
                </strong>
              </span>
              <span>
                Recoverable (≤3 retries):{' '}
                <strong>
                  ₹
                  {failedTransactions.
                filter((t) => t.retryCount < 3).
                reduce((sum, t) => sum + t.amount, 0).
                toLocaleString()}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>Showing 1-{failedTransactions.length} of {failedTransactions.length}</span>
            </div>
          </div>
        </div>
      }

      {/* Disputed Transactions Tab */}
      {activeTab === 'disputed' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                  placeholder="Search by Case ID, Transaction ID, or Student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10" />

                </div>
              </div>
              <Select
              className="w-44"
              options={gatewayOptions}
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)} />

              <Select
              className="w-44"
              options={disputeStatusOptions}
              value={selectedDisputeStatus}
              onChange={(e) => setSelectedDisputeStatus(e.target.value)} />

              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </Card>

          {/* Urgent Cases Alert */}
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900">
                  2 disputes require immediate attention
                </p>
                <p className="text-xs text-orange-700">
                  Response deadline approaching within 5 days
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                View Urgent Cases
              </Button>
            </div>
          </Card>

          {/* Disputed Transactions Table */}
          <Card>
            <Table columns={disputedColumns} data={disputedTransactions} />
          </Card>

          {/* Summary Footer */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-6">
              <span>
                Total Disputed Amount:{' '}
                <strong className="text-orange-600">
                  ₹
                  {disputedTransactions.
                reduce((sum, t) => sum + t.amount, 0).
                toLocaleString()}
                </strong>
              </span>
              <span>
                Open Cases:{' '}
                <strong>
                  {disputedTransactions.filter((t) => t.status === 'Open').length}
                </strong>
              </span>
              <span>
                Under Review:{' '}
                <strong>
                  {disputedTransactions.filter((t) => t.status === 'Under Review').length}
                </strong>
              </span>
              <span>
                Lost (Chargedback):{' '}
                <strong className="text-red-600">
                  ₹
                  {disputedTransactions.
                filter((t) => t.status === 'Lost').
                reduce((sum, t) => sum + t.amount, 0).
                toLocaleString()}
                </strong>
              </span>
            </div>
          </div>
        </div>
      }

      {/* Retry Confirmation Modal */}
      {isRetryModalOpen && selectedRetryTxn &&
      <Modal
        isOpen={isRetryModalOpen}
        onClose={() => setIsRetryModalOpen(false)}
        title="Retry Payment">

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="text-sm font-mono">{selectedRetryTxn.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Student</span>
                <span className="text-sm font-medium">
                  {selectedRetryTxn.student} ({selectedRetryTxn.class})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-bold">
                  ₹{selectedRetryTxn.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Previous Error</span>
                <Badge variant={getErrorBadgeVariant(selectedRetryTxn.errorMessage)}>
                  {selectedRetryTxn.errorMessage}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retry Attempt</span>
                <span className="text-sm">
                  {selectedRetryTxn.retryCount + 1} of 3
                </span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Before retrying
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Ensure the parent has sufficient balance or has resolved the
                    card issue. Consider contacting them before retrying.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
              variant="outline"
              onClick={() => setIsRetryModalOpen(false)}>

                Cancel
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Parent First
              </Button>
              <Button variant="primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Payment
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Dispute Management Modal */}
      {isDisputeModalOpen && selectedDisputedTxn &&
      <Modal
        isOpen={isDisputeModalOpen}
        onClose={() => setIsDisputeModalOpen(false)}
        title="Manage Dispute"
        size="lg">

          <div className="space-y-6">
            {/* Dispute Summary */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Case ID</p>
                <p className="font-mono text-sm font-medium">
                  {selectedDisputedTxn.caseId}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="font-mono text-sm">{selectedDisputedTxn.txnId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Student</p>
                <p className="text-sm font-medium">
                  {selectedDisputedTxn.student} ({selectedDisputedTxn.class})
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-bold text-red-600">
                  ₹{selectedDisputedTxn.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Dispute Reason</p>
                <p className="text-sm">{selectedDisputedTxn.reason}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Response Due Date</p>
                <p className="text-sm font-medium text-orange-600">
                  {selectedDisputedTxn.dueDate}
                </p>
              </div>
            </div>

            {/* Status Update */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Status
              </label>
              <Select
              className="w-full"
              options={statusUpdateOptions}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as DisputeStatus)} />

            </div>

            {/* Evidence Documents */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Evidence Documents
                </label>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View All
                </Button>
              </div>
              
              {/* Existing Documents */}
              {selectedDisputedTxn.documents.length > 0 &&
            <div className="space-y-2 mb-3">
                  {selectedDisputedTxn.documents.map((doc, index) =>
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.size} • Uploaded {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
              )}
                </div>
            }

              {/* Upload New Documents */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />

                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, JPG, PNG (max 10MB each)
                  </p>
                </label>
              </div>

              {/* Newly Uploaded Files */}
              {uploadedFiles.length > 0 &&
            <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) =>
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">

                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFile(index)}>

                        <X className="w-4 h-4 text-gray-500" />
                      </Button>
                    </div>
              )}
                </div>
            }
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Internal Notes & Bank Communication
              </label>
              
              {/* Existing Notes */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {selectedDisputedTxn.notes.map((note, index) =>
              <div
                key={index}
                className={`p-3 rounded-lg ${
                note.author === 'System' ?
                'bg-gray-100' :
                'bg-blue-50 border-l-4 border-blue-400'}`
                }>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        {note.author}
                      </span>
                      <span className="text-xs text-gray-500">{note.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{note.content}</p>
                  </div>
              )}
              </div>

              {/* Add New Note */}
              <div className="space-y-2">
                <Textarea
                placeholder="Add a note about bank communication, actions taken, or internal remarks..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3} />

                <div className="flex justify-end">
                  <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}>

                    <Send className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Mark as Lost
              </Button>
              <div className="flex gap-3">
                <Button
                variant="outline"
                onClick={() => setIsDisputeModalOpen(false)}>

                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateDisputeStatus}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      }
    </div>);

}