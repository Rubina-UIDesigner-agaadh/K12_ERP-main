import React, { useMemo, useState, createElement, Component } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Copy,
  Printer,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Receipt,
  Wallet,
  TrendingUp,
  AlertCircle,
  IndianRupee,
  Hash,
  GraduationCap,
  Users,
  FileCheck,
  Send,
  ExternalLink,
  Info,
  CheckCircle2,
  XOctagon,
  ClockIcon,
  RotateCcw,
  Share2,
  Bookmark,
  Flag } from
'lucide-react';
// Types
interface Transaction {
  id: string;
  txnId: string;
  orderId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  admissionNo: string;
  rollNo: string;
  classSection: string;
  className: string;
  section: string;
  academicYear: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  paymentDate: string;
  paymentTime: string;
  gateway: string;
  gatewayTxnId: string;
  amount: number;
  convenienceFee: number;
  totalAmount: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Refunded' | 'Processing';
  bankRef: string;
  bankName: string;
  paymentMode: string;
  cardLast4?: string;
  upiId?: string;
  feeType: string;
  feeComponents: {
    name: string;
    amount: number;
  }[];
  receiptNo?: string;
  remarks?: string;
  ipAddress: string;
  deviceInfo: string;
  retryCount: number;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
}
interface FilterState {
  searchQuery: string;
  status: string;
  gateway: string;
  dateFrom: string;
  dateTo: string;
  className: string;
  section: string;
  feeType: string;
  amountMin: string;
  amountMax: string;
  academicYear: string;
  paymentMode: string;
}
type SortField = 'paymentDate' | 'amount' | 'studentName' | 'txnId' | 'status';
type SortOrder = 'asc' | 'desc';
export function OnlineTransactionList() {
  // State Management
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: 'all',
    gateway: 'all',
    dateFrom: '',
    dateTo: '',
    className: 'all',
    section: 'all',
    feeType: 'all',
    amountMin: '',
    amountMax: '',
    academicYear: '2024-25',
    paymentMode: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('paymentDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'all' | 'success' | 'pending' | 'failed'>(
    'all');
  // Mock Data
  const transactions: Transaction[] = [
  {
    id: '1',
    txnId: 'TXN_2024031501',
    orderId: 'ORD_2024031501',
    studentId: 'STU001',
    studentName: 'Rahul Sharma',
    fatherName: 'Rajesh Sharma',
    motherName: 'Sunita Sharma',
    admissionNo: 'ADM2024001',
    rollNo: '01',
    classSection: '10-A',
    className: 'Class 10',
    section: 'A',
    academicYear: '2024-25',
    email: 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    alternatePhone: '+91 9876543211',
    address: '123, Main Street, New Delhi - 110001',
    paymentDate: '2024-03-15',
    paymentTime: '10:30 AM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_NxYz123ABC456',
    amount: 24500,
    convenienceFee: 500,
    totalAmount: 25000,
    status: 'Success',
    bankRef: 'RZP_REF_123456789',
    bankName: 'HDFC Bank',
    paymentMode: 'UPI',
    upiId: 'rahul@upi',
    feeType: 'Quarterly Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 15000
    },
    {
      name: 'Lab Fee',
      amount: 3000
    },
    {
      name: 'Library Fee',
      amount: 1500
    },
    {
      name: 'Sports Fee',
      amount: 2000
    },
    {
      name: 'Computer Fee',
      amount: 3000
    }],

    receiptNo: 'RCP/2024/001234',
    remarks: 'Q1 Fee Payment',
    ipAddress: '192.168.1.100',
    deviceInfo: 'Chrome/Windows 10',
    retryCount: 0
  },
  {
    id: '2',
    txnId: 'TXN_2024031502',
    orderId: 'ORD_2024031502',
    studentId: 'STU002',
    studentName: 'Priya Patel',
    fatherName: 'Rakesh Patel',
    motherName: 'Meena Patel',
    admissionNo: 'ADM2024002',
    rollNo: '02',
    classSection: '9-B',
    className: 'Class 9',
    section: 'B',
    academicYear: '2024-25',
    email: 'priya.patel@email.com',
    phone: '+91 9876543220',
    alternatePhone: '+91 9876543221',
    address: '456, Park Avenue, Mumbai - 400001',
    paymentDate: '2024-03-15',
    paymentTime: '11:15 AM',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_ABC123XYZ',
    amount: 4800,
    convenienceFee: 200,
    totalAmount: 5000,
    status: 'Pending',
    bankRef: 'PAYU_REF_987654321',
    bankName: 'ICICI Bank',
    paymentMode: 'Net Banking',
    feeType: 'Transport Fee',
    feeComponents: [
    {
      name: 'Transport Fee',
      amount: 4800
    }],

    remarks: 'Monthly Transport',
    ipAddress: '192.168.1.101',
    deviceInfo: 'Safari/iOS 17',
    retryCount: 1
  },
  {
    id: '3',
    txnId: 'TXN_2024031503',
    orderId: 'ORD_2024031503',
    studentId: 'STU003',
    studentName: 'Amit Kumar',
    fatherName: 'Suresh Kumar',
    motherName: 'Kamla Devi',
    admissionNo: 'ADM2024003',
    rollNo: '03',
    classSection: '8-C',
    className: 'Class 8',
    section: 'C',
    academicYear: '2024-25',
    email: 'amit.kumar@email.com',
    phone: '+91 9876543230',
    alternatePhone: '',
    address: '789, Industrial Area, Bangalore - 560001',
    paymentDate: '2024-03-14',
    paymentTime: '04:45 PM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_FailedXYZ789',
    amount: 11500,
    convenienceFee: 500,
    totalAmount: 12000,
    status: 'Failed',
    bankRef: 'RZP_REF_456789123',
    bankName: 'SBI',
    paymentMode: 'Debit Card',
    cardLast4: '4521',
    feeType: 'Exam Fee',
    feeComponents: [
    {
      name: 'Board Exam Fee',
      amount: 8000
    },
    {
      name: 'Practical Exam Fee',
      amount: 3500
    }],

    remarks: 'Card declined - Insufficient funds',
    ipAddress: '192.168.1.102',
    deviceInfo: 'Firefox/Ubuntu',
    retryCount: 2
  },
  {
    id: '4',
    txnId: 'TXN_2024031504',
    orderId: 'ORD_2024031504',
    studentId: 'STU004',
    studentName: 'Sneha Gupta',
    fatherName: 'Vinod Gupta',
    motherName: 'Rekha Gupta',
    admissionNo: 'ADM2024004',
    rollNo: '04',
    classSection: '11-A',
    className: 'Class 11',
    section: 'A',
    academicYear: '2024-25',
    email: 'sneha.gupta@email.com',
    phone: '+91 9876543240',
    alternatePhone: '+91 9876543241',
    address: '321, College Road, Chennai - 600001',
    paymentDate: '2024-03-14',
    paymentTime: '02:30 PM',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CCA_SUCCESS_789',
    amount: 34000,
    convenienceFee: 1000,
    totalAmount: 35000,
    status: 'Success',
    bankRef: 'CCA_REF_789123456',
    bankName: 'Axis Bank',
    paymentMode: 'Credit Card',
    cardLast4: '8876',
    feeType: 'Annual Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 20000
    },
    {
      name: 'Development Fee',
      amount: 5000
    },
    {
      name: 'Activity Fee',
      amount: 4000
    },
    {
      name: 'Infrastructure Fee',
      amount: 5000
    }],

    receiptNo: 'RCP/2024/001235',
    remarks: 'Annual Fee Payment - Science Stream',
    ipAddress: '192.168.1.103',
    deviceInfo: 'Chrome/Android 14',
    retryCount: 0
  },
  {
    id: '5',
    txnId: 'TXN_2024031505',
    orderId: 'ORD_2024031505',
    studentId: 'STU005',
    studentName: 'Vikram Singh',
    fatherName: 'Mahendra Singh',
    motherName: 'Saroj Singh',
    admissionNo: 'ADM2024005',
    rollNo: '05',
    classSection: '12-B',
    className: 'Class 12',
    section: 'B',
    academicYear: '2024-25',
    email: 'vikram.singh@email.com',
    phone: '+91 9876543250',
    alternatePhone: '+91 9876543251',
    address: '567, University Campus, Hyderabad - 500001',
    paymentDate: '2024-03-14',
    paymentTime: '11:00 AM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_BoardFee_456',
    amount: 44000,
    convenienceFee: 1000,
    totalAmount: 45000,
    status: 'Success',
    bankRef: 'RZP_REF_321654987',
    bankName: 'Kotak Bank',
    paymentMode: 'UPI',
    upiId: 'vikram.singh@okaxis',
    feeType: 'Board Exam Fee',
    feeComponents: [
    {
      name: 'Board Registration',
      amount: 10000
    },
    {
      name: 'Practical Exam',
      amount: 15000
    },
    {
      name: 'Theory Exam',
      amount: 15000
    },
    {
      name: 'Document Processing',
      amount: 4000
    }],

    receiptNo: 'RCP/2024/001236',
    remarks: 'Class 12 Board Exam Registration',
    ipAddress: '192.168.1.104',
    deviceInfo: 'Edge/Windows 11',
    retryCount: 0
  },
  {
    id: '6',
    txnId: 'TXN_2024031506',
    orderId: 'ORD_2024031506',
    studentId: 'STU006',
    studentName: 'Ananya Reddy',
    fatherName: 'Krishna Reddy',
    motherName: 'Lakshmi Reddy',
    admissionNo: 'ADM2024006',
    rollNo: '06',
    classSection: '7-A',
    className: 'Class 7',
    section: 'A',
    academicYear: '2024-25',
    email: 'ananya.reddy@email.com',
    phone: '+91 9876543260',
    alternatePhone: '',
    address: '890, Tech Park, Pune - 411001',
    paymentDate: '2024-03-13',
    paymentTime: '03:20 PM',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_FAIL_654',
    amount: 7500,
    convenienceFee: 500,
    totalAmount: 8000,
    status: 'Failed',
    bankRef: 'PAYU_REF_654987321',
    bankName: 'Bank of Baroda',
    paymentMode: 'Net Banking',
    feeType: 'Hostel Fee',
    feeComponents: [
    {
      name: 'Hostel Room Rent',
      amount: 5000
    },
    {
      name: 'Mess Charges',
      amount: 2500
    }],

    remarks: 'Session timeout - Please retry',
    ipAddress: '192.168.1.105',
    deviceInfo: 'Chrome/MacOS',
    retryCount: 3
  },
  {
    id: '7',
    txnId: 'TXN_2024031507',
    orderId: 'ORD_2024031507',
    studentId: 'STU007',
    studentName: 'Rohan Mehta',
    fatherName: 'Ajay Mehta',
    motherName: 'Priti Mehta',
    admissionNo: 'ADM2024007',
    rollNo: '07',
    classSection: '6-C',
    className: 'Class 6',
    section: 'C',
    academicYear: '2024-25',
    email: 'rohan.mehta@email.com',
    phone: '+91 9876543270',
    alternatePhone: '+91 9876543271',
    address: '234, Garden City, Ahmedabad - 380001',
    paymentDate: '2024-03-13',
    paymentTime: '10:45 AM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_Admission_123',
    amount: 14500,
    convenienceFee: 500,
    totalAmount: 15000,
    status: 'Success',
    bankRef: 'RZP_REF_147258369',
    bankName: 'PNB',
    paymentMode: 'Debit Card',
    cardLast4: '7788',
    feeType: 'Admission Fee',
    feeComponents: [
    {
      name: 'Admission Fee',
      amount: 10000
    },
    {
      name: 'Registration Fee',
      amount: 2000
    },
    {
      name: 'Uniform Fee',
      amount: 2500
    }],

    receiptNo: 'RCP/2024/001237',
    remarks: 'New Admission - Class 6',
    ipAddress: '192.168.1.106',
    deviceInfo: 'Safari/iPadOS',
    retryCount: 0
  },
  {
    id: '8',
    txnId: 'TXN_2024031508',
    orderId: 'ORD_2024031508',
    studentId: 'STU008',
    studentName: 'Kavya Nair',
    fatherName: 'Sunil Nair',
    motherName: 'Deepa Nair',
    admissionNo: 'ADM2024008',
    rollNo: '08',
    classSection: '9-A',
    className: 'Class 9',
    section: 'A',
    academicYear: '2024-25',
    email: 'kavya.nair@email.com',
    phone: '+91 9876543280',
    alternatePhone: '+91 9876543281',
    address: '678, IT Hub, Kochi - 682001',
    paymentDate: '2024-03-12',
    paymentTime: '04:00 PM',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CCA_PENDING_321',
    amount: 21500,
    convenienceFee: 500,
    totalAmount: 22000,
    status: 'Pending',
    bankRef: 'CCA_REF_258369147',
    bankName: 'Federal Bank',
    paymentMode: 'Net Banking',
    feeType: 'Quarterly Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 12000
    },
    {
      name: 'Lab Fee',
      amount: 4000
    },
    {
      name: 'Library Fee',
      amount: 2000
    },
    {
      name: 'Sports Fee',
      amount: 3500
    }],

    remarks: 'Awaiting bank confirmation',
    ipAddress: '192.168.1.107',
    deviceInfo: 'Chrome/Linux',
    retryCount: 0
  },
  {
    id: '9',
    txnId: 'TXN_2024031509',
    orderId: 'ORD_2024031509',
    studentId: 'STU009',
    studentName: 'Arjun Das',
    fatherName: 'Bikash Das',
    motherName: 'Soma Das',
    admissionNo: 'ADM2024009',
    rollNo: '09',
    classSection: '10-B',
    className: 'Class 10',
    section: 'B',
    academicYear: '2024-25',
    email: 'arjun.das@email.com',
    phone: '+91 9876543290',
    alternatePhone: '',
    address: '901, Lake View, Kolkata - 700001',
    paymentDate: '2024-03-12',
    paymentTime: '09:30 AM',
    gateway: 'PayU',
    gatewayTxnId: 'PAYU_SUCCESS_999',
    amount: 27500,
    convenienceFee: 500,
    totalAmount: 28000,
    status: 'Success',
    bankRef: 'PAYU_REF_369147258',
    bankName: 'YES Bank',
    paymentMode: 'Credit Card',
    cardLast4: '5566',
    feeType: 'Semi-Annual Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 18000
    },
    {
      name: 'Development Fee',
      amount: 4000
    },
    {
      name: 'Activity Fee',
      amount: 3000
    },
    {
      name: 'Miscellaneous',
      amount: 2500
    }],

    receiptNo: 'RCP/2024/001238',
    remarks: 'H2 Fee Payment',
    ipAddress: '192.168.1.108',
    deviceInfo: 'Chrome/Windows 10',
    retryCount: 0
  },
  {
    id: '10',
    txnId: 'TXN_2024031510',
    orderId: 'ORD_2024031510',
    studentId: 'STU010',
    studentName: 'Meera Joshi',
    fatherName: 'Prakash Joshi',
    motherName: 'Kavita Joshi',
    admissionNo: 'ADM2024010',
    rollNo: '10',
    classSection: '8-A',
    className: 'Class 8',
    section: 'A',
    academicYear: '2024-25',
    email: 'meera.joshi@email.com',
    phone: '+91 9876543300',
    alternatePhone: '+91 9876543301',
    address: '432, Valley Road, Jaipur - 302001',
    paymentDate: '2024-03-11',
    paymentTime: '02:15 PM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_Monthly_789',
    amount: 17500,
    convenienceFee: 500,
    totalAmount: 18000,
    status: 'Success',
    bankRef: 'RZP_REF_951753468',
    bankName: 'IndusInd Bank',
    paymentMode: 'UPI',
    upiId: 'meera.joshi@ybl',
    feeType: 'Monthly Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 10000
    },
    {
      name: 'Activity Fee',
      amount: 2500
    },
    {
      name: 'Transport Fee',
      amount: 5000
    }],

    receiptNo: 'RCP/2024/001239',
    remarks: 'March 2024 Fee',
    ipAddress: '192.168.1.109',
    deviceInfo: 'Chrome/Android 13',
    retryCount: 0
  },
  {
    id: '11',
    txnId: 'TXN_2024031511',
    orderId: 'ORD_2024031511',
    studentId: 'STU011',
    studentName: 'Karan Malhotra',
    fatherName: 'Deepak Malhotra',
    motherName: 'Neha Malhotra',
    admissionNo: 'ADM2024011',
    rollNo: '11',
    classSection: '11-B',
    className: 'Class 11',
    section: 'B',
    academicYear: '2024-25',
    email: 'karan.malhotra@email.com',
    phone: '+91 9876543310',
    alternatePhone: '+91 9876543311',
    address: '567, Model Town, Ludhiana - 141001',
    paymentDate: '2024-03-11',
    paymentTime: '11:30 AM',
    gateway: 'Razorpay',
    gatewayTxnId: 'pay_Refund_456',
    amount: 30000,
    convenienceFee: 750,
    totalAmount: 30750,
    status: 'Refunded',
    bankRef: 'RZP_REF_753951456',
    bankName: 'HDFC Bank',
    paymentMode: 'Debit Card',
    cardLast4: '3344',
    feeType: 'Quarterly Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 20000
    },
    {
      name: 'Lab Fee',
      amount: 5000
    },
    {
      name: 'Library Fee',
      amount: 2500
    },
    {
      name: 'Computer Fee',
      amount: 2500
    }],

    receiptNo: 'RCP/2024/001240',
    remarks: 'Duplicate payment - Refunded',
    refundAmount: 30750,
    refundDate: '2024-03-12',
    refundReason: 'Duplicate payment made',
    ipAddress: '192.168.1.110',
    deviceInfo: 'Firefox/Windows 11',
    retryCount: 0
  },
  {
    id: '12',
    txnId: 'TXN_2024031512',
    orderId: 'ORD_2024031512',
    studentId: 'STU012',
    studentName: 'Ishita Verma',
    fatherName: 'Alok Verma',
    motherName: 'Shalini Verma',
    admissionNo: 'ADM2024012',
    rollNo: '12',
    classSection: '5-A',
    className: 'Class 5',
    section: 'A',
    academicYear: '2024-25',
    email: 'ishita.verma@email.com',
    phone: '+91 9876543320',
    alternatePhone: '',
    address: '789, Civil Lines, Lucknow - 226001',
    paymentDate: '2024-03-10',
    paymentTime: '03:45 PM',
    gateway: 'CCAvenue',
    gatewayTxnId: 'CCA_PROCESS_789',
    amount: 9500,
    convenienceFee: 250,
    totalAmount: 9750,
    status: 'Processing',
    bankRef: 'CCA_REF_159357486',
    bankName: 'Canara Bank',
    paymentMode: 'Net Banking',
    feeType: 'Monthly Fee',
    feeComponents: [
    {
      name: 'Tuition Fee',
      amount: 6000
    },
    {
      name: 'Activity Fee',
      amount: 1500
    },
    {
      name: 'Books & Stationery',
      amount: 2000
    }],

    remarks: 'Payment being processed',
    ipAddress: '192.168.1.111',
    deviceInfo: 'Chrome/MacOS',
    retryCount: 0
  }];

  // Dropdown Options
  const classOptions = [
  {
    value: 'all',
    label: 'All Classes'
  },
  {
    value: 'Class 1',
    label: 'Class 1'
  },
  {
    value: 'Class 2',
    label: 'Class 2'
  },
  {
    value: 'Class 3',
    label: 'Class 3'
  },
  {
    value: 'Class 4',
    label: 'Class 4'
  },
  {
    value: 'Class 5',
    label: 'Class 5'
  },
  {
    value: 'Class 6',
    label: 'Class 6'
  },
  {
    value: 'Class 7',
    label: 'Class 7'
  },
  {
    value: 'Class 8',
    label: 'Class 8'
  },
  {
    value: 'Class 9',
    label: 'Class 9'
  },
  {
    value: 'Class 10',
    label: 'Class 10'
  },
  {
    value: 'Class 11',
    label: 'Class 11'
  },
  {
    value: 'Class 12',
    label: 'Class 12'
  }];

  const sectionOptions = [
  {
    value: 'all',
    label: 'All Sections'
  },
  {
    value: 'A',
    label: 'Section A'
  },
  {
    value: 'B',
    label: 'Section B'
  },
  {
    value: 'C',
    label: 'Section C'
  },
  {
    value: 'D',
    label: 'Section D'
  }];

  const gatewayOptions = [
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
  },
  {
    value: 'Paytm',
    label: 'Paytm'
  }];

  const statusOptions = [
  {
    value: 'all',
    label: 'All Status'
  },
  {
    value: 'Success',
    label: 'Success'
  },
  {
    value: 'Pending',
    label: 'Pending'
  },
  {
    value: 'Failed',
    label: 'Failed'
  },
  {
    value: 'Refunded',
    label: 'Refunded'
  },
  {
    value: 'Processing',
    label: 'Processing'
  }];

  const feeTypeOptions = [
  {
    value: 'all',
    label: 'All Fee Types'
  },
  {
    value: 'Admission Fee',
    label: 'Admission Fee'
  },
  {
    value: 'Monthly Fee',
    label: 'Monthly Fee'
  },
  {
    value: 'Quarterly Fee',
    label: 'Quarterly Fee'
  },
  {
    value: 'Semi-Annual Fee',
    label: 'Semi-Annual Fee'
  },
  {
    value: 'Annual Fee',
    label: 'Annual Fee'
  },
  {
    value: 'Transport Fee',
    label: 'Transport Fee'
  },
  {
    value: 'Hostel Fee',
    label: 'Hostel Fee'
  },
  {
    value: 'Exam Fee',
    label: 'Exam Fee'
  },
  {
    value: 'Board Exam Fee',
    label: 'Board Exam Fee'
  }];

  const paymentModeOptions = [
  {
    value: 'all',
    label: 'All Payment Modes'
  },
  {
    value: 'UPI',
    label: 'UPI'
  },
  {
    value: 'Credit Card',
    label: 'Credit Card'
  },
  {
    value: 'Debit Card',
    label: 'Debit Card'
  },
  {
    value: 'Net Banking',
    label: 'Net Banking'
  },
  {
    value: 'Wallet',
    label: 'Wallet'
  }];

  const academicYearOptions = [
  {
    value: '2024-25',
    label: '2024-25'
  },
  {
    value: '2023-24',
    label: '2023-24'
  },
  {
    value: '2022-23',
    label: '2022-23'
  }];

  // Calculate Statistics
  const stats = useMemo(() => {
    const successTxns = transactions.filter((t) => t.status === 'Success');
    const pendingTxns = transactions.filter((t) => t.status === 'Pending');
    const failedTxns = transactions.filter((t) => t.status === 'Failed');
    const refundedTxns = transactions.filter((t) => t.status === 'Refunded');
    const processingTxns = transactions.filter((t) => t.status === 'Processing');
    return {
      total: transactions.length,
      success: successTxns.length,
      pending: pendingTxns.length,
      failed: failedTxns.length,
      refunded: refundedTxns.length,
      processing: processingTxns.length,
      totalAmount: successTxns.reduce((sum, t) => sum + t.totalAmount, 0),
      pendingAmount: pendingTxns.reduce((sum, t) => sum + t.totalAmount, 0),
      failedAmount: failedTxns.reduce((sum, t) => sum + t.totalAmount, 0),
      refundedAmount: refundedTxns.reduce(
        (sum, t) => sum + (t.refundAmount || 0),
        0
      ),
      avgAmount:
      successTxns.length > 0 ?
      Math.round(
        successTxns.reduce((sum, t) => sum + t.totalAmount, 0) /
        successTxns.length
      ) :
      0,
      convenienceFee: successTxns.reduce((sum, t) => sum + t.convenienceFee, 0)
    };
  }, [transactions]);
  // Filter Transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    // Filter by tab
    if (activeTab !== 'all') {
      const statusMap = {
        success: 'Success',
        pending: 'Pending',
        failed: 'Failed'
      };
      filtered = filtered.filter(
        (t) => t.status === statusMap[activeTab as keyof typeof statusMap]
      );
    }
    // Search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
        t.txnId.toLowerCase().includes(query) ||
        t.orderId.toLowerCase().includes(query) ||
        t.studentName.toLowerCase().includes(query) ||
        t.admissionNo.toLowerCase().includes(query) ||
        t.fatherName.toLowerCase().includes(query) ||
        t.phone.includes(query) ||
        t.email.toLowerCase().includes(query) ||
        t.bankRef.toLowerCase().includes(query) ||
        t.gatewayTxnId.toLowerCase().includes(query) ||
        t.receiptNo && t.receiptNo.toLowerCase().includes(query)
      );
    }
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    // Gateway filter
    if (filters.gateway !== 'all') {
      filtered = filtered.filter((t) => t.gateway === filters.gateway);
    }
    // Class filter
    if (filters.className !== 'all') {
      filtered = filtered.filter((t) => t.className === filters.className);
    }
    // Section filter
    if (filters.section !== 'all') {
      filtered = filtered.filter((t) => t.section === filters.section);
    }
    // Fee type filter
    if (filters.feeType !== 'all') {
      filtered = filtered.filter((t) => t.feeType === filters.feeType);
    }
    // Payment mode filter
    if (filters.paymentMode !== 'all') {
      filtered = filtered.filter((t) => t.paymentMode === filters.paymentMode);
    }
    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter((t) => t.paymentDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((t) => t.paymentDate <= filters.dateTo);
    }
    // Amount range filter
    if (filters.amountMin) {
      filtered = filtered.filter(
        (t) => t.totalAmount >= parseInt(filters.amountMin)
      );
    }
    if (filters.amountMax) {
      filtered = filtered.filter(
        (t) => t.totalAmount <= parseInt(filters.amountMax)
      );
    }
    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'paymentDate':
          comparison =
          new Date(b.paymentDate).getTime() -
          new Date(a.paymentDate).getTime();
          break;
        case 'amount':
          comparison = b.totalAmount - a.totalAmount;
          break;
        case 'studentName':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'txnId':
          comparison = a.txnId.localeCompare(b.txnId);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
    return filtered;
  }, [transactions, filters, activeTab, sortField, sortOrder]);
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  // Event Handlers
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      gateway: 'all',
      dateFrom: '',
      dateTo: '',
      className: 'all',
      section: 'all',
      feeType: 'all',
      amountMin: '',
      amountMax: '',
      academicYear: '2024-25',
      paymentMode: 'all'
    });
    setCurrentPage(1);
  };
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };
  const handleViewReceipt = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowReceiptModal(true);
  };
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    console.log(`Copied ${label}: ${text}`);
  };
  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    console.log(`Exporting to ${format}...`);
    setShowExportMenu(false);
    // Implement export logic
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedTransactions.map((t) => t.id));
    } else {
      setSelectedRows([]);
    }
  };
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };
  const getStatusConfig = (status: string) => {
    const configs = {
      Success: {
        variant: 'success' as const,
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      },
      Pending: {
        variant: 'warning' as const,
        icon: Clock,
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
      },
      Failed: {
        variant: 'danger' as const,
        icon: XCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      },
      Refunded: {
        variant: 'secondary' as const,
        icon: RotateCcw,
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200'
      },
      Processing: {
        variant: 'info' as const,
        icon: RefreshCw,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      }
    };
    return configs[status as keyof typeof configs] || configs.Pending;
  };
  const getGatewayColor = (gateway: string) => {
    const colors = {
      Razorpay: 'bg-blue-500',
      PayU: 'bg-green-500',
      CCAvenue: 'bg-purple-500',
      Paytm: 'bg-cyan-500'
    };
    return colors[gateway as keyof typeof colors] || 'bg-gray-500';
  };
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'searchQuery') return value !== '';
    if (key === 'academicYear') return false;
    if (
    [
    'status',
    'gateway',
    'className',
    'section',
    'feeType',
    'paymentMode'].
    includes(key))
    {
      return value !== 'all';
    }
    return value !== '';
  });
  // Table Columns
  const columns = [
  {
    key: 'checkbox',
    header:
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={
      selectedRows.length === paginatedTransactions.length &&
      paginatedTransactions.length > 0
      }
      onChange={(e) => handleSelectAll(e.target.checked)} />,


    render: (row: Transaction) =>
    <input
      type="checkbox"
      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      checked={selectedRows.includes(row.id)}
      onChange={(e) => handleSelectRow(row.id, e.target.checked)} />


  },
  {
    key: 'txnId',
    header:
    <button
      onClick={() => handleSort('txnId')}
      className="flex items-center gap-1 hover:text-gray-900 font-medium">

          Transaction ID
          {sortField === 'txnId' ?
      sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3" /> :

      <ArrowDown className="w-3 h-3" /> :


      <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
        </button>,

    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-medium">
              {row.txnId}
            </span>
            <button
          onClick={() => handleCopyToClipboard(row.txnId, 'Transaction ID')}
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          title="Copy Transaction ID">

              <Copy className="w-3 h-3 text-gray-400" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Order: {row.orderId}</span>
        </div>

  },
  {
    key: 'student',
    header:
    <button
      onClick={() => handleSort('studentName')}
      className="flex items-center gap-1 hover:text-gray-900 font-medium">

          Student Details
          {sortField === 'studentName' ?
      sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3" /> :

      <ArrowDown className="w-3 h-3" /> :


      <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
        </button>,

    render: (row: Transaction) =>
    <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {row.studentName.
        split(' ').
        map((n) => n[0]).
        join('')}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">
              {row.studentName}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{row.admissionNo}</span>
              <span>•</span>
              <span>Roll: {row.rollNo}</span>
            </div>
            <span className="text-xs text-gray-400">{row.email}</span>
          </div>
        </div>

  },
  {
    key: 'classSection',
    header: 'Class/Section',
    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <Badge variant="outline" className="font-medium w-fit">
            {row.classSection}
          </Badge>
          <span className="text-xs text-gray-500">{row.academicYear}</span>
        </div>

  },
  {
    key: 'payment',
    header:
    <button
      onClick={() => handleSort('paymentDate')}
      className="flex items-center gap-1 hover:text-gray-900 font-medium">

          Payment Details
          {sortField === 'paymentDate' ?
      sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3" /> :

      <ArrowDown className="w-3 h-3" /> :


      <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
        </button>,

    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {row.paymentDate}
            </span>
          </div>
          <span className="text-xs text-gray-500 ml-5">{row.paymentTime}</span>
          <div className="flex items-center gap-2 mt-1">
            <div
          className={`w-2 h-2 rounded-full ${getGatewayColor(row.gateway)}`} />

            <span className="text-xs text-gray-600">{row.gateway}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600">{row.paymentMode}</span>
          </div>
        </div>

  },
  {
    key: 'feeType',
    header: 'Fee Type',
    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-900">
            {row.feeType}
          </span>
          <span className="text-xs text-gray-500">
            {row.feeComponents.length} component(s)
          </span>
        </div>

  },
  {
    key: 'amount',
    header:
    <button
      onClick={() => handleSort('amount')}
      className="flex items-center gap-1 hover:text-gray-900 font-medium">

          Amount
          {sortField === 'amount' ?
      sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3" /> :

      <ArrowDown className="w-3 h-3" /> :


      <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
        </button>,

    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <span className="text-lg font-bold text-gray-900">
            ₹{row.totalAmount.toLocaleString()}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Fee: ₹{row.amount.toLocaleString()}</span>
            <span>+</span>
            <span>Conv: ₹{row.convenienceFee}</span>
          </div>
        </div>

  },
  {
    key: 'status',
    header:
    <button
      onClick={() => handleSort('status')}
      className="flex items-center gap-1 hover:text-gray-900 font-medium">

          Status
          {sortField === 'status' ?
      sortOrder === 'asc' ?
      <ArrowUp className="w-3 h-3" /> :

      <ArrowDown className="w-3 h-3" /> :


      <ArrowUpDown className="w-3 h-3 opacity-50" />
      }
        </button>,

    render: (row: Transaction) => {
      const config = getStatusConfig(row.status);
      const StatusIcon = config.icon;
      return (
        <div className="flex flex-col gap-1">
            <Badge
            variant={config.variant}
            className="flex items-center gap-1 w-fit">

              <StatusIcon className="w-3 h-3" />
              {row.status}
            </Badge>
            {row.receiptNo &&
          <span className="text-xs text-gray-500">
                Rcpt: {row.receiptNo}
              </span>
          }
            {row.status === 'Refunded' && row.refundAmount &&
          <span className="text-xs text-purple-600">
                Refund: ₹{row.refundAmount.toLocaleString()}
              </span>
          }
          </div>);

    }
  },
  {
    key: 'bankRef',
    header: 'References',
    render: (row: Transaction) =>
    <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Bank:</span>
            <span className="font-mono text-xs text-gray-700">
              {row.bankRef.substring(0, 15)}...
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Gateway:</span>
            <span className="font-mono text-xs text-gray-700">
              {row.gatewayTxnId.substring(0, 12)}...
            </span>
          </div>
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Transaction) =>
    <div className="flex items-center gap-1">
          <button
        onClick={() => handleViewDetails(row)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        title="View Details">

            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'Success' &&
      <>
              <button
          onClick={() => handleViewReceipt(row)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="View Receipt">

                <Receipt className="w-4 h-4" />
              </button>
              <button
          onClick={() => console.log('Print:', row.txnId)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Print Receipt">

                <Printer className="w-4 h-4" />
              </button>
            </>
      }
          {row.status === 'Pending' &&
      <button
        onClick={() => console.log('Refresh:', row.txnId)}
        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
        title="Refresh Status">

              <RefreshCw className="w-4 h-4" />
            </button>
      }
          {row.status === 'Failed' &&
      <button
        onClick={() => console.log('Retry:', row.txnId)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Send Retry Link">

              <Send className="w-4 h-4" />
            </button>
      }
          <button
        onClick={() => console.log('More:', row.txnId)}
        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        title="More Actions">

            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

  }];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Online Transaction List
          </h1>
          <p className="text-gray-500 mt-1">
            View, manage, and analyze all online payment transactions
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            className="w-32"
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            options={academicYearOptions} />

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2">

            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />

            Refresh
          </Button>
          <div className="relative">
            <Button
              variant="primary"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2">

              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">

                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="font-medium">Export to Excel</div>
                    <div className="text-xs text-gray-500">
                      Download as .xlsx file
                    </div>
                  </div>
                </button>
                <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">

                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-medium">Export to CSV</div>
                    <div className="text-xs text-gray-500">
                      Download as .csv file
                    </div>
                  </div>
                </button>
                <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">

                  <FileText className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="font-medium">Export to PDF</div>
                    <div className="text-xs text-gray-500">
                      Download as .pdf file
                    </div>
                  </div>
                </button>
                <div className="border-t border-gray-100 my-2" />
                <button
                onClick={() => console.log('Email report')}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">

                  <Mail className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-medium">Email Report</div>
                    <div className="text-xs text-gray-500">
                      Send to your email
                    </div>
                  </div>
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {stats.total}
              </p>
              <p className="text-xs text-blue-500 mt-1">All status combined</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-xl">
              <CreditCard className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Successful</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {stats.success}
              </p>
              <p className="text-xs text-green-500 mt-1">
                ₹{stats.totalAmount.toLocaleString()} collected
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <CheckCircle className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900 mt-1">
                {stats.pending}
              </p>
              <p className="text-xs text-yellow-500 mt-1">
                ₹{stats.pendingAmount.toLocaleString()} awaiting
              </p>
            </div>
            <div className="p-3 bg-yellow-200 rounded-xl">
              <Clock className="w-6 h-6 text-yellow-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Failed</p>
              <p className="text-2xl font-bold text-red-900 mt-1">
                {stats.failed}
              </p>
              <p className="text-xs text-red-500 mt-1">
                ₹{stats.failedAmount.toLocaleString()} lost
              </p>
            </div>
            <div className="p-3 bg-red-200 rounded-xl">
              <XCircle className="w-6 h-6 text-red-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Refunded</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {stats.refunded}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                ₹{stats.refundedAmount.toLocaleString()} returned
              </p>
            </div>
            <div className="p-3 bg-purple-200 rounded-xl">
              <RotateCcw className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-600">
                Avg. Transaction
              </p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">
                ₹{stats.avgAmount.toLocaleString()}
              </p>
              <p className="text-xs text-indigo-500 mt-1">Per successful txn</p>
            </div>
            <div className="p-3 bg-indigo-200 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Status Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-0">
        {[
        {
          key: 'all',
          label: 'All Transactions',
          count: stats.total
        },
        {
          key: 'success',
          label: 'Success',
          count: stats.success
        },
        {
          key: 'pending',
          label: 'Pending',
          count: stats.pending
        },
        {
          key: 'failed',
          label: 'Failed',
          count: stats.failed
        }].
        map((tab) =>
        <button
          key={tab.key}
          onClick={() => {
            setActiveTab(tab.key as typeof activeTab);
            setCurrentPage(1);
          }}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>

            {tab.label}
            <span
            className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>

              {tab.count}
            </span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Transaction ID, Order ID, Student Name, Admission No, Email, Phone, Receipt No..."
                className="pl-10 w-full h-11"
                value={filters.searchQuery}
                onChange={(e) =>
                handleFilterChange('searchQuery', e.target.value)
                } />

              {filters.searchQuery &&
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                  <X className="w-4 h-4" />
                </button>
              }
            </div>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 whitespace-nowrap">

              <Filter className="w-4 h-4" />
              Advanced Filters
              {hasActiveFilters &&
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  Active
                </span>
              }
            </Button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters &&
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  Filter Transactions
                </h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date From
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                    type="date"
                    className="pl-10 w-full"
                    value={filters.dateFrom}
                    onChange={(e) =>
                    handleFilterChange('dateFrom', e.target.value)
                    } />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date To
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                    type="date"
                    className="pl-10 w-full"
                    value={filters.dateTo}
                    onChange={(e) =>
                    handleFilterChange('dateTo', e.target.value)
                    } />

                  </div>
                </div>

                {/* Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Class
                  </label>
                  <Select
                  className="w-full"
                  value={filters.className}
                  onChange={(e) =>
                  handleFilterChange('className', e.target.value)
                  }
                  options={classOptions} />

                </div>

                {/* Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Section
                  </label>
                  <Select
                  className="w-full"
                  value={filters.section}
                  onChange={(e) =>
                  handleFilterChange('section', e.target.value)
                  }
                  options={sectionOptions} />

                </div>

                {/* Payment Gateway */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Payment Gateway
                  </label>
                  <Select
                  className="w-full"
                  value={filters.gateway}
                  onChange={(e) =>
                  handleFilterChange('gateway', e.target.value)
                  }
                  options={gatewayOptions} />

                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Status
                  </label>
                  <Select
                  className="w-full"
                  value={filters.status}
                  onChange={(e) =>
                  handleFilterChange('status', e.target.value)
                  }
                  options={statusOptions} />

                </div>

                {/* Fee Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Fee Type
                  </label>
                  <Select
                  className="w-full"
                  value={filters.feeType}
                  onChange={(e) =>
                  handleFilterChange('feeType', e.target.value)
                  }
                  options={feeTypeOptions} />

                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Payment Mode
                  </label>
                  <Select
                  className="w-full"
                  value={filters.paymentMode}
                  onChange={(e) =>
                  handleFilterChange('paymentMode', e.target.value)
                  }
                  options={paymentModeOptions} />

                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Min Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                    type="number"
                    placeholder="0"
                    className="pl-10 w-full"
                    value={filters.amountMin}
                    onChange={(e) =>
                    handleFilterChange('amountMin', e.target.value)
                    } />

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Max Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                    type="number"
                    placeholder="∞"
                    className="pl-10 w-full"
                    value={filters.amountMax}
                    onChange={(e) =>
                    handleFilterChange('amountMax', e.target.value)
                    } />

                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={clearFilters}>
                  Reset Filters
                </Button>
                <Button variant="primary" onClick={() => setShowFilters(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          }

          {/* Active Filter Tags */}
          {hasActiveFilters &&
          <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active Filters:</span>
              {filters.status !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  Status: {filters.status}
                  <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:bg-blue-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.gateway !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                  Gateway: {filters.gateway}
                  <button
                onClick={() => handleFilterChange('gateway', 'all')}
                className="hover:bg-green-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.className !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  Class: {filters.className}
                  <button
                onClick={() => handleFilterChange('className', 'all')}
                className="hover:bg-purple-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.section !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm">
                  Section: {filters.section}
                  <button
                onClick={() => handleFilterChange('section', 'all')}
                className="hover:bg-orange-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.feeType !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm">
                  Fee: {filters.feeType}
                  <button
                onClick={() => handleFilterChange('feeType', 'all')}
                className="hover:bg-cyan-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.paymentMode !== 'all' &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                  Mode: {filters.paymentMode}
                  <button
                onClick={() => handleFilterChange('paymentMode', 'all')}
                className="hover:bg-indigo-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.dateFrom &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">
                  From: {filters.dateFrom}
                  <button
                onClick={() => handleFilterChange('dateFrom', '')}
                className="hover:bg-pink-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {filters.dateTo &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-sm">
                  To: {filters.dateTo}
                  <button
                onClick={() => handleFilterChange('dateTo', '')}
                className="hover:bg-pink-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              {(filters.amountMin || filters.amountMax) &&
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm">
                  Amount: ₹{filters.amountMin || '0'} - ₹
                  {filters.amountMax || '∞'}
                  <button
                onClick={() => {
                  handleFilterChange('amountMin', '');
                  handleFilterChange('amountMax', '');
                }}
                className="hover:bg-teal-100 rounded-full p-0.5">

                    <X className="w-3 h-3" />
                  </button>
                </span>
            }
              <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium ml-2">

                Clear all
              </button>
            </div>
          }
        </div>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 &&
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-sm text-blue-700">
            <strong>{selectedRows.length}</strong> transaction(s) selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print Selected
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
            <Button variant="outline" size="sm">
              <Send className="w-4 h-4 mr-2" />
              Send Receipts
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

      {/* Transactions Table */}
      <Card
        title={
        <div className="flex items-center gap-2">
            <span>Transactions</span>
            <Badge variant="secondary" className="font-normal">
              {filteredTransactions.length} records
            </Badge>
          </div>
        }
        headerAction={
        <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              Showing {(currentPage - 1) * rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, filteredTransactions.length)}{' '}
              of {filteredTransactions.length}
            </span>
          </div>
        }>

        <div className="overflow-x-auto">
          <Table
            columns={columns}
            data={paginatedTransactions}
            className="[&_tr]:group" />

        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-gray-200 gap-4">
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
              },
              {
                value: '100',
                label: '100'
              }]
              }
              value={rowsPerPage.toString()}
              onChange={(e) => {
                setRowsPerPage(parseInt(e.target.value));
                setCurrentPage(1);
              }} />

          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}>

                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}>

                <ChevronLeft className="w-4 h-4" />
              </Button>
              {/* Page Numbers */}
              {Array.from(
                {
                  length: Math.min(5, totalPages)
                },
                (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8">

                      {pageNum}
                    </Button>);

                }
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}>

                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}>

                Last
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Empty State */}
      {filteredTransactions.length === 0 &&
      <Card className="p-12">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <CreditCard className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No transactions found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              We couldn't find any transactions matching your search criteria.
              Try adjusting your filters or search query.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
              <Button variant="primary" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Transaction Detail Modal */}
      {showDetailModal && selectedTransaction &&
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Transaction Details"
        size="xl">

          <div className="space-y-6">
            {/* Status Header */}
            <div
            className={`p-4 rounded-xl ${getStatusConfig(selectedTransaction.status).bgColor} ${getStatusConfig(selectedTransaction.status).borderColor} border`}>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {createElement(
                  getStatusConfig(selectedTransaction.status).icon,
                  {
                    className: `w-8 h-8 ${getStatusConfig(selectedTransaction.status).textColor}`
                  }
                )}
                  <div>
                    <h3
                    className={`text-lg font-semibold ${getStatusConfig(selectedTransaction.status).textColor}`}>

                      Payment {selectedTransaction.status}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedTransaction.paymentDate} at{' '}
                      {selectedTransaction.paymentTime}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{selectedTransaction.totalAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Amount</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Transaction Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Transaction Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">
                        {selectedTransaction.txnId}
                      </span>
                      <button
                      onClick={() =>
                      handleCopyToClipboard(
                        selectedTransaction.txnId,
                        'Transaction ID'
                      )
                      }
                      className="p-1 hover:bg-gray-200 rounded">

                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-mono">
                      {selectedTransaction.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Gateway Transaction ID
                    </span>
                    <span className="font-mono text-sm">
                      {selectedTransaction.gatewayTxnId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Reference</span>
                    <span className="font-mono text-sm">
                      {selectedTransaction.bankRef}
                    </span>
                  </div>
                  {selectedTransaction.receiptNo &&
                <div className="flex justify-between">
                      <span className="text-gray-500">Receipt No</span>
                      <span className="font-medium">
                        {selectedTransaction.receiptNo}
                      </span>
                    </div>
                }
                </div>
              </div>

              {/* Student Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {selectedTransaction.studentName.
                    split(' ').
                    map((n) => n[0]).
                    join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedTransaction.studentName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedTransaction.admissionNo}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Father's Name</span>
                    <span>{selectedTransaction.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Class/Section</span>
                    <span>{selectedTransaction.classSection}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Roll No</span>
                    <span>{selectedTransaction.rollNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span>{selectedTransaction.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="text-sm">{selectedTransaction.email}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Gateway</span>
                    <div className="flex items-center gap-2">
                      <div
                      className={`w-2 h-2 rounded-full ${getGatewayColor(selectedTransaction.gateway)}`} />

                      <span>{selectedTransaction.gateway}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Mode</span>
                    <span>{selectedTransaction.paymentMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank Name</span>
                    <span>{selectedTransaction.bankName}</span>
                  </div>
                  {selectedTransaction.cardLast4 &&
                <div className="flex justify-between">
                      <span className="text-gray-500">Card Number</span>
                      <span>
                        **** **** **** {selectedTransaction.cardLast4}
                      </span>
                    </div>
                }
                  {selectedTransaction.upiId &&
                <div className="flex justify-between">
                      <span className="text-gray-500">UPI ID</span>
                      <span>{selectedTransaction.upiId}</span>
                    </div>
                }
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Fee Breakdown
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-medium text-gray-900">
                      {selectedTransaction.feeType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedTransaction.academicYear}
                    </span>
                  </div>
                  {selectedTransaction.feeComponents.map((comp, idx) =>
                <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{comp.name}</span>
                      <span>₹{comp.amount.toLocaleString()}</span>
                    </div>
                )}
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Convenience Fee</span>
                    <span>
                      ₹{selectedTransaction.convenienceFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-lg">
                      ₹{selectedTransaction.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Info (if applicable) */}
            {selectedTransaction.status === 'Refunded' &&
          selectedTransaction.refundAmount &&
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Refund Information
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-purple-600">Refund Amount</p>
                      <p className="font-semibold text-purple-900">
                        ₹{selectedTransaction.refundAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Refund Date</p>
                      <p className="font-semibold text-purple-900">
                        {selectedTransaction.refundDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-purple-600">Reason</p>
                      <p className="font-semibold text-purple-900">
                        {selectedTransaction.refundReason}
                      </p>
                    </div>
                  </div>
                </div>
          }

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Additional Information
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">IP Address</p>
                  <p className="font-mono">{selectedTransaction.ipAddress}</p>
                </div>
                <div>
                  <p className="text-gray-500">Device Info</p>
                  <p>{selectedTransaction.deviceInfo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Retry Count</p>
                  <p>{selectedTransaction.retryCount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Remarks</p>
                  <p>{selectedTransaction.remarks || '-'}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              {selectedTransaction.status === 'Success' &&
            <>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Email Receipt
                  </Button>
                </>
            }
              {selectedTransaction.status === 'Pending' &&
            <Button variant="primary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
            }
              {selectedTransaction.status === 'Failed' &&
            <Button variant="primary">
                  <Send className="w-4 h-4 mr-2" />
                  Send Retry Link
                </Button>
            }
              <Button variant="ghost" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      }

      {/* Receipt Modal */}
      {showReceiptModal && selectedTransaction &&
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Payment Receipt"
        size="lg">

          <div className="space-y-6">
            {/* Receipt Header */}
            <div className="text-center border-b border-gray-200 pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Payment Successful
              </h3>
              <p className="text-gray-500">
                Receipt No: {selectedTransaction.receiptNo}
              </p>
            </div>

            {/* Receipt Body */}
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Student Name</span>
                <span className="font-medium">
                  {selectedTransaction.studentName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Admission No</span>
                <span className="font-medium">
                  {selectedTransaction.admissionNo}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Class/Section</span>
                <span className="font-medium">
                  {selectedTransaction.classSection}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Fee Type</span>
                <span className="font-medium">
                  {selectedTransaction.feeType}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Date</span>
                <span className="font-medium">
                  {selectedTransaction.paymentDate}{' '}
                  {selectedTransaction.paymentTime}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Payment Mode</span>
                <span className="font-medium">
                  {selectedTransaction.gateway} -{' '}
                  {selectedTransaction.paymentMode}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-sm">
                  {selectedTransaction.txnId}
                </span>
              </div>

              {/* Fee Components */}
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Fee Components
                </h4>
                {selectedTransaction.feeComponents.map((comp, idx) =>
              <div key={idx} className="flex justify-between py-1 text-sm">
                    <span className="text-gray-600">{comp.name}</span>
                    <span>₹{comp.amount.toLocaleString()}</span>
                  </div>
              )}
                <div className="flex justify-between py-1 text-sm border-t border-gray-200 mt-2 pt-2">
                  <span className="text-gray-600">Convenience Fee</span>
                  <span>
                    ₹{selectedTransaction.convenienceFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-300 mt-2 pt-2 font-bold text-lg">
                  <span>Total Paid</span>
                  <span className="text-green-600">
                    ₹{selectedTransaction.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
              variant="ghost"
              onClick={() => setShowReceiptModal(false)}>

                Close
              </Button>
            </div>
          </div>
        </Modal>
      }
    </div>);

}