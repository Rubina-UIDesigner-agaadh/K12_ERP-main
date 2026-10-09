import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Shield,
  AlertCircle,
  RotateCcw,
  User,
  CreditCard,
  Calendar,
  IndianRupee,
  FileText,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Clock,
  Info,
  ChevronRight,
  Copy,
  CheckCircle2,
  Ban,
  Receipt,
  Building,
  Smartphone } from
'lucide-react';

interface Transaction {
  id: string;
  txnId: string;
  studentName: string;
  admissionNo: string;
  classSection: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  amount: number;
  paidAt: string;
  gateway: string;
  gatewayTxnId: string;
  paymentMethod: string;
  status: 'Success' | 'Refunded' | 'Partial Refund';
  refundedAmount: number;
  bankName: string;
  lastFourDigits: string;
}

interface RefundHistoryItem {
  id: string;
  txnId: string;
  studentName: string;
  refundAmount: number;
  reason: string;
  processedAt: string;
  processedBy: string;
  status: 'Completed' | 'Processing' | 'Failed';
  gatewayRefundId: string;
}

export function OnlineRefundProcessing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [approvalNote, setApprovalNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [refundResult, setRefundResult] = useState<{
    gatewayRefundId: string;
    status: string;
    message: string;
  } | null>(null);
  const [amountError, setAmountError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const allTransactions: Transaction[] = [
  {
    id: '1',
    txnId: 'TXN_2024031501',
    studentName: 'Rahul Sharma',
    admissionNo: 'ADM2024001',
    classSection: '10-A',
    parentName: 'Rajesh Sharma',
    parentEmail: 'rajesh.sharma@email.com',
    parentPhone: '+91 98765 43210',
    amount: 25000,
    paidAt: '2024-03-15T10:30:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_NxYz123456789',
    paymentMethod: 'Credit Card',
    status: 'Success',
    refundedAmount: 0,
    bankName: 'HDFC Bank',
    lastFourDigits: '4532'
  },
  {
    id: '2',
    txnId: 'TXN_2024031502',
    studentName: 'Priya Patel',
    admissionNo: 'ADM2024002',
    classSection: '9-B',
    parentName: 'Suresh Patel',
    parentEmail: 'suresh.patel@email.com',
    parentPhone: '+91 98765 43211',
    amount: 15000,
    paidAt: '2024-03-15T09:15:00',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_ABC987654321',
    paymentMethod: 'Debit Card',
    status: 'Partial Refund',
    refundedAmount: 5000,
    bankName: 'ICICI Bank',
    lastFourDigits: '8976'
  },
  {
    id: '3',
    txnId: 'TXN_2024031503',
    studentName: 'Amit Kumar',
    admissionNo: 'ADM2024003',
    classSection: '8-C',
    parentName: 'Vinod Kumar',
    parentEmail: 'vinod.kumar@email.com',
    parentPhone: '+91 98765 43212',
    amount: 12000,
    paidAt: '2024-03-14T16:45:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_AbCd567890123',
    paymentMethod: 'UPI',
    status: 'Success',
    refundedAmount: 0,
    bankName: 'SBI',
    lastFourDigits: '1234'
  },
  {
    id: '4',
    txnId: 'TXN_2024031504',
    studentName: 'Sneha Gupta',
    admissionNo: 'ADM2024004',
    classSection: '11-A',
    parentName: 'Mohan Gupta',
    parentEmail: 'mohan.gupta@email.com',
    parentPhone: '+91 98765 43213',
    amount: 35000,
    paidAt: '2024-03-14T14:30:00',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CC_ORDER_789456123',
    paymentMethod: 'Net Banking',
    status: 'Refunded',
    refundedAmount: 35000,
    bankName: 'Axis Bank',
    lastFourDigits: '5678'
  },
  {
    id: '5',
    txnId: 'TXN_2024031505',
    studentName: 'Vikram Singh',
    admissionNo: 'ADM2024005',
    classSection: '12-B',
    parentName: 'Harpreet Singh',
    parentEmail: 'harpreet.singh@email.com',
    parentPhone: '+91 98765 43214',
    amount: 45000,
    paidAt: '2024-03-13T11:00:00',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_EfGh234567890',
    paymentMethod: 'Credit Card',
    status: 'Success',
    refundedAmount: 0,
    bankName: 'Kotak Bank',
    lastFourDigits: '9012'
  }];


  const refundHistory: RefundHistoryItem[] = [
  {
    id: '1',
    txnId: 'TXN_2024031504',
    studentName: 'Sneha Gupta',
    refundAmount: 35000,
    reason: 'Student Withdrawal',
    processedAt: '2024-03-14T16:00:00',
    processedBy: 'Admin User',
    status: 'Completed',
    gatewayRefundId: 'rfnd_CC789456'
  },
  {
    id: '2',
    txnId: 'TXN_2024031502',
    studentName: 'Priya Patel',
    refundAmount: 5000,
    reason: 'Fee Adjustment',
    processedAt: '2024-03-15T11:30:00',
    processedBy: 'Admin User',
    status: 'Completed',
    gatewayRefundId: 'rfnd_PAYU123456'
  },
  {
    id: '3',
    txnId: 'TXN_2024031410',
    studentName: 'Karan Mehta',
    refundAmount: 8000,
    reason: 'Double Payment',
    processedAt: '2024-03-14T09:15:00',
    processedBy: 'Finance Admin',
    status: 'Processing',
    gatewayRefundId: 'rfnd_RZP789012'
  }];


  const refundReasons = [
  { value: '', label: 'Select Reason for Refund' },
  { value: 'double_payment', label: 'Double Payment' },
  { value: 'student_withdrawal', label: 'Student Withdrawal' },
  { value: 'fee_adjustment', label: 'Fee Adjustment' },
  { value: 'course_cancellation', label: 'Course/Activity Cancellation' },
  { value: 'overcharge', label: 'Overcharge Correction' },
  { value: 'transfer', label: 'Transfer to Another Institution' },
  { value: 'scholarship', label: 'Scholarship Applied Retroactively' },
  { value: 'other', label: 'Other (Specify in Notes)' }];


  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSelectedTransaction(null);
    setSearchResults([]);

    // Simulate API search
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results = allTransactions.filter(
      (txn) =>
      txn.txnId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.gatewayTxnId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount('');
    setRefundReason('');
    setApprovalNote('');
    setAmountError('');
    setSearchResults([]);
  };

  const validateRefundAmount = (value: string) => {
    const amount = parseFloat(value);
    if (!selectedTransaction) return;

    const maxRefundable = selectedTransaction.amount - selectedTransaction.refundedAmount;

    if (isNaN(amount) || amount <= 0) {
      setAmountError('Please enter a valid amount');
      return false;
    }

    if (amount > maxRefundable) {
      setAmountError(`Maximum refundable amount is ₹${maxRefundable.toLocaleString()}`);
      return false;
    }

    setAmountError('');
    return true;
  };

  const handleRefundAmountChange = (value: string) => {
    setRefundAmount(value);
    if (value) {
      validateRefundAmount(value);
    } else {
      setAmountError('');
    }
  };

  const handleSetFullRefund = () => {
    if (!selectedTransaction) return;
    const maxRefundable = selectedTransaction.amount - selectedTransaction.refundedAmount;
    setRefundAmount(maxRefundable.toString());
    setAmountError('');
  };

  const handleInitiateRefund = () => {
    if (!selectedTransaction || !refundAmount || !refundReason) return;

    if (!validateRefundAmount(refundAmount)) return;

    setShowConfirmModal(true);
  };

  const handleConfirmRefund = () => {
    setShowConfirmModal(false);
    setShowOtpModal(true);
    // Simulate sending OTP
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter complete OTP');
      return;
    }

    // Simulate OTP verification (use 123456 as valid OTP)
    if (otpString !== '123456') {
      setOtpError('Invalid OTP. Please try again.');
      return;
    }

    setShowOtpModal(false);
    setIsProcessing(true);

    // Simulate refund processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setRefundResult({
      gatewayRefundId: `rfnd_${Date.now()}`,
      status: 'success',
      message: 'Refund processed successfully. Amount will be credited within 5-7 business days.'
    });

    setIsProcessing(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setSelectedTransaction(null);
    setRefundAmount('');
    setRefundReason('');
    setApprovalNote('');
    setRefundResult(null);
    setOtp(['', '', '', '', '', '']);
    setSearchQuery('');
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

  const historyColumns = [
  {
    key: 'txnId',
    header: 'Transaction ID',
    render: (row: RefundHistoryItem) =>
    <span className="font-mono text-xs">{row.txnId}</span>

  },
  {
    key: 'student',
    header: 'Student',
    render: (row: RefundHistoryItem) =>
    <span className="font-medium text-gray-900">{row.studentName}</span>

  },
  {
    key: 'amount',
    header: 'Refund Amount',
    render: (row: RefundHistoryItem) =>
    <span className="font-bold text-red-600">-₹{row.refundAmount.toLocaleString()}</span>

  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row: RefundHistoryItem) =>
    <Badge variant="outline">{row.reason}</Badge>

  },
  {
    key: 'processedAt',
    header: 'Processed At',
    render: (row: RefundHistoryItem) => {
      const { date, time } = formatDateTime(row.processedAt);
      return (
        <div className="text-sm">
            <div className="text-gray-900">{date}</div>
            <div className="text-xs text-gray-500">{time}</div>
          </div>);

    }
  },
  {
    key: 'status',
    header: 'Status',
    render: (row: RefundHistoryItem) =>
    <Badge
      variant={
      row.status === 'Completed' ?
      'success' :
      row.status === 'Processing' ?
      'warning' :
      'danger'
      }
      className="flex items-center gap-1 w-fit">

          {row.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
          {row.status === 'Processing' && <Clock className="w-3 h-3" />}
          {row.status === 'Failed' && <XCircle className="w-3 h-3" />}
          {row.status}
        </Badge>

  }];


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Online Refund Processing</h1>
          <p className="text-sm text-gray-500">
            Process secure refunds for online payment transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Secure Mode Active</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-amber-800">Important Security Notice</h4>
            <ul className="mt-1 text-sm text-amber-700 space-y-1">
              <li>• All refund transactions are logged and audited</li>
              <li>• OTP verification is required for each refund</li>
              <li>• Refunds are processed directly through the payment gateway</li>
              <li>• Processing time: 5-7 business days for credit to parent's account</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Search and Transaction Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Section */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Transaction</h3>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter Transaction ID or Gateway Transaction ID..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />

              </div>
              <Button variant="primary" onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
                {isSearching ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </> :

                <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                }
              </Button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 &&
            <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} transaction(s). Click to select:
                </p>
                <div className="space-y-2">
                  {searchResults.map((txn) =>
                <div
                  key={txn.id}
                  onClick={() => txn.status !== 'Refunded' && handleSelectTransaction(txn)}
                  className={`p-4 border rounded-lg transition-all ${
                  txn.status === 'Refunded' ?
                  'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' :
                  'hover:border-blue-300 hover:bg-blue-50 cursor-pointer border-gray-200'}`
                  }>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-medium">{txn.txnId}</span>
                              <Badge
                            variant={
                            txn.status === 'Success' ?
                            'success' :
                            txn.status === 'Refunded' ?
                            'danger' :
                            'warning'
                            }>

                                {txn.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {txn.studentName} • {txn.classSection}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{txn.amount.toLocaleString()}</p>
                          {txn.refundedAmount > 0 &&
                      <p className="text-xs text-red-600">
                              Refunded: ₹{txn.refundedAmount.toLocaleString()}
                            </p>
                      }
                        </div>
                      </div>
                      {txn.status === 'Refunded' &&
                  <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                          <Ban className="w-3 h-3" />
                          This transaction has been fully refunded
                        </p>
                  }
                    </div>
                )}
                </div>
              </div>
            }

            {searchResults.length === 0 && searchQuery && !isSearching &&
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No transactions found for "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please check the transaction ID and try again
                </p>
              </div>
            }
          </Card>

          {/* Selected Transaction Details */}
          {selectedTransaction &&
          <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTransaction(null)}>

                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Transaction Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Receipt className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Transaction ID</span>
                  </div>
                  <p className="font-mono font-medium">{selectedTransaction.txnId}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Gateway Reference</span>
                  </div>
                  <p className="font-mono text-sm">{selectedTransaction.gatewayTxnId}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Student</span>
                  </div>
                  <p className="font-medium">{selectedTransaction.studentName}</p>
                  <p className="text-sm text-gray-600">
                    {selectedTransaction.admissionNo} • {selectedTransaction.classSection}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Parent</span>
                  </div>
                  <p className="font-medium">{selectedTransaction.parentName}</p>
                  <p className="text-sm text-gray-600">{selectedTransaction.parentPhone}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Payment Date</span>
                  </div>
                  <p className="font-medium">{formatDateTime(selectedTransaction.paidAt).date}</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(selectedTransaction.paidAt).time}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Building className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Payment Method</span>
                  </div>
                  <p className="font-medium">{selectedTransaction.paymentMethod}</p>
                  <p className="text-sm text-gray-600">
                    {selectedTransaction.bankName} •••• {selectedTransaction.lastFourDigits}
                  </p>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Paid</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{selectedTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-red-600 font-medium">Already Refunded</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{selectedTransaction.refundedAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Refundable Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{(selectedTransaction.amount - selectedTransaction.refundedAmount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Form */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Refund Details</h4>

                {/* Refund Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                      type="number"
                      placeholder="Enter refund amount"
                      className={`pl-10 w-full ${amountError ? 'border-red-500' : ''}`}
                      value={refundAmount}
                      onChange={(e) => handleRefundAmountChange(e.target.value)}
                      max={selectedTransaction.amount - selectedTransaction.refundedAmount} />

                    </div>
                    <Button variant="outline" onClick={handleSetFullRefund}>
                      Full Refund
                    </Button>
                  </div>
                  {amountError &&
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {amountError}
                    </p>
                }
                  {refundAmount && !amountError && parseFloat(refundAmount) < selectedTransaction.amount - selectedTransaction.refundedAmount &&
                <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      This will be processed as a partial refund
                    </p>
                }
                </div>

                {/* Reason for Refund */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Refund <span className="text-red-500">*</span>
                  </label>
                  <Select
                  className="w-full"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  options={refundReasons} />

                </div>

                {/* Approval Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Note <span className="text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  placeholder="Enter any additional notes or approval reference..."
                  value={approvalNote}
                  onChange={(e) => setApprovalNote(e.target.value)} />

                </div>

                {/* Process Refund Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                  variant="primary"
                  className="w-full bg-red-600 hover:bg-red-700 py-3"
                  onClick={handleInitiateRefund}
                  disabled={!refundAmount || !refundReason || !!amountError || isProcessing}>

                    <RotateCcw className="w-5 h-5 mr-2" />
                    Process Refund - ₹{refundAmount ? parseFloat(refundAmount).toLocaleString() : '0'}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    You will be required to verify with OTP before processing
                  </p>
                </div>
              </div>
            </Card>
          }

          {/* Empty State */}
          {!selectedTransaction && searchResults.length === 0 && !searchQuery &&
          <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Search for a Transaction</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Enter a Transaction ID or Gateway Transaction ID above to find and process refunds
                </p>
              </div>
            </Card>
          }
        </div>

        {/* Right Column - Recent Refunds and Quick Info */}
        <div className="space-y-6">
          {/* Processing Status */}
          {isProcessing &&
          <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <h4 className="font-medium text-gray-900">Processing Refund</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Communicating with payment gateway...
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              </div>
            </Card>
          }

          {/* Refund Guidelines */}
          <Card title="Refund Guidelines">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Full & Partial Refunds</p>
                  <p className="text-xs text-gray-600">
                    You can process full or partial refunds based on the requirement
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Processing Time</p>
                  <p className="text-xs text-gray-600">
                    Refunds typically take 5-7 business days to reflect
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">OTP Verification</p>
                  <p className="text-xs text-gray-600">
                    Each refund requires OTP verification for security
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Audit Trail</p>
                  <p className="text-xs text-gray-600">
                    All refunds are logged with user, timestamp, and reason
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Gateway Status */}
          <Card title="Gateway Status">
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">Razorpay</span>
                </div>
                <Badge variant="success" className="text-xs">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">PayU</span>
                </div>
                <Badge variant="success" className="text-xs">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium">CCAvenue</span>
                </div>
                <Badge variant="success" className="text-xs">Online</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Refund History */}
      <Card
        title="Recent Refund History"
        headerAction={
        <Button variant="ghost" size="sm">
            View All
          </Button>
        }>

        <Table columns={historyColumns} data={refundHistory} />
      </Card>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedTransaction &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Confirm Refund</h3>
                  <p className="text-sm text-gray-500">Please review the refund details</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono font-medium">{selectedTransaction.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium">{selectedTransaction.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Amount</span>
                  <span className="font-medium">₹{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-900 font-medium">Refund Amount</span>
                  <span className="font-bold text-red-600 text-lg">
                    ₹{parseFloat(refundAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Reason:</strong>{' '}
                  {refundReasons.find((r) => r.value === refundReason)?.label}
                </p>
                {approvalNote &&
              <p className="text-sm text-yellow-700 mt-1">
                    <strong>Note:</strong> {approvalNote}
                  </p>
              }
              </div>

              <p className="text-sm text-gray-600 text-center">
                This action will initiate a refund through the payment gateway. 
                An OTP will be sent to your registered mobile number.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={handleConfirmRefund}>
                Continue to OTP Verification
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      }

      {/* OTP Verification Modal */}
      {showOtpModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">OTP Verification</h3>
                  <p className="text-sm text-gray-500">Enter the 6-digit code sent to your phone</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  A verification code has been sent to
                </p>
                <p className="font-medium text-gray-900">+91 98765 *****</p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) =>
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                otpError ? 'border-red-500' : 'border-gray-300'}`
                }
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && index > 0) {
                    const prevInput = document.getElementById(`otp-${index - 1}`);
                    prevInput?.focus();
                  }
                }} />

              )}
              </div>

              {otpError &&
            <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {otpError}
                </p>
            }

              <p className="text-sm text-gray-500 text-center">
                Didn't receive code?{' '}
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Resend OTP
                </button>
              </p>

              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-700">
                  <Info className="w-3 h-3 inline mr-1" />
                  For demo, use OTP: <strong>123456</strong>
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setShowOtpModal(false);
                setOtp(['', '', '', '', '', '']);
                setOtpError('');
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleVerifyOtp}>
                <Lock className="w-4 h-4 mr-2" />
                Verify & Process Refund
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Success Modal */}
      {showSuccessModal && refundResult && selectedTransaction &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Refund Processed Successfully!</h3>
              <p className="text-gray-600 mb-6">{refundResult.message}</p>

              <div className="p-4 bg-gray-50 rounded-lg text-left space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Refund ID</span>
                  <span className="font-mono text-sm">{refundResult.gatewayRefundId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Refunded</span>
                  <span className="font-bold text-green-600">
                    ₹{parseFloat(refundAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Parent Email</span>
                  <span className="text-sm">{selectedTransaction.parentEmail}</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to the parent's email address.
              </p>

              <Button variant="primary" className="w-full" onClick={handleCloseSuccess}>
                Done
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}