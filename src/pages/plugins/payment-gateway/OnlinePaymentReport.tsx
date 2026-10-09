import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  FileText,
  Download,
  Printer,
  Filter,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Search,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUp,
  IndianRupee,
  CreditCard,
  Building,
  GraduationCap,
  Bus,
  Layers,
  Users,
  FileSpreadsheet,
  Mail,
  Eye,
  Settings,
  Check,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List,
  CalendarDays,
  BookOpen,
  Receipt,
  Percent,
  ArrowUpDown,
  ArrowUp,
  ArrowDown } from
'lucide-react';
import { ReportFilters } from '../../../components/ReportFilters';
type GroupByOption =
'none' |
'academic_year' |
'class' |
'fee_head' |
'date' |
'gateway' |
'month';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'grouped' | 'flat';
interface PaymentTransaction {
  id: string;
  studentName: string;
  studentId: string;
  class: string;
  section: string;
  receiptNo: string;
  paymentDate: string;
  paymentTime: string;
  mode: string;
  gateway: string;
  feeHead: string;
  academicYear: string;
  grossAmount: number;
  convenienceFee: number;
  tax: number;
  netAmount: number;
  status: 'Success' | 'Failed' | 'Refunded';
  txnId: string;
}
interface GroupedData {
  key: string;
  label: string;
  transactions: PaymentTransaction[];
  totalGross: number;
  totalFee: number;
  totalTax: number;
  totalNet: number;
  count: number;
  isExpanded: boolean;
}
interface SummaryData {
  totalTransactions: number;
  totalGrossAmount: number;
  totalConvenienceFee: number;
  totalTax: number;
  totalNetAmount: number;
  successCount: number;
  failedCount: number;
  refundedCount: number;
  averageTransactionValue: number;
}
export function OnlinePaymentReport() {
  // Filter states
  const [academicYear, setAcademicYear] = useState('2023-24');
  const [dateFrom, setDateFrom] = useState('2024-03-01');
  const [dateTo, setDateTo] = useState('2024-03-31');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedFeeHead, setSelectedFeeHead] = useState('all');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // Grouping and view states
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [viewMode, setViewMode] = useState<ViewMode>('flat');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('paymentDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  // UI states
  const [showFilters, setShowFilters] = useState(true);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // Visible columns
  const [visibleColumns, setVisibleColumns] = useState({
    studentName: true,
    class: true,
    receiptNo: true,
    paymentDate: true,
    feeHead: true,
    mode: true,
    gateway: true,
    grossAmount: true,
    convenienceFee: true,
    tax: true,
    netAmount: true,
    status: true,
    txnId: false
  });
  // Mock transactions data
  const transactions: PaymentTransaction[] = [
  {
    id: '1',
    studentName: 'Rahul Sharma',
    studentId: 'STU001',
    class: '10',
    section: 'A',
    receiptNo: 'RCP2024001234',
    paymentDate: '2024-03-15',
    paymentTime: '10:30 AM',
    mode: 'UPI',
    gateway: 'Razorpay',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 25000,
    convenienceFee: 500,
    tax: 90,
    netAmount: 25590,
    status: 'Success',
    txnId: 'TXN_RAZ_001234'
  },
  {
    id: '2',
    studentName: 'Priya Patel',
    studentId: 'STU002',
    class: '9',
    section: 'B',
    receiptNo: 'RCP2024001235',
    paymentDate: '2024-03-15',
    paymentTime: '11:45 AM',
    mode: 'Credit Card',
    gateway: 'PayU',
    feeHead: 'Transport Fee',
    academicYear: '2023-24',
    grossAmount: 8000,
    convenienceFee: 160,
    tax: 29,
    netAmount: 8189,
    status: 'Success',
    txnId: 'TXN_PAYU_001235'
  },
  {
    id: '3',
    studentName: 'Amit Kumar',
    studentId: 'STU003',
    class: '10',
    section: 'A',
    receiptNo: 'RCP2024001236',
    paymentDate: '2024-03-14',
    paymentTime: '02:30 PM',
    mode: 'Net Banking',
    gateway: 'Razorpay',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 25000,
    convenienceFee: 500,
    tax: 90,
    netAmount: 25590,
    status: 'Success',
    txnId: 'TXN_RAZ_001236'
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    studentId: 'STU004',
    class: '11',
    section: 'A',
    receiptNo: 'RCP2024001237',
    paymentDate: '2024-03-14',
    paymentTime: '04:15 PM',
    mode: 'Debit Card',
    gateway: 'Paytm',
    feeHead: 'Library Fee',
    academicYear: '2023-24',
    grossAmount: 2000,
    convenienceFee: 40,
    tax: 7,
    netAmount: 2047,
    status: 'Success',
    txnId: 'TXN_PAYTM_001237'
  },
  {
    id: '5',
    studentName: 'Vikram Singh',
    studentId: 'STU005',
    class: '12',
    section: 'B',
    receiptNo: 'RCP2024001238',
    paymentDate: '2024-03-13',
    paymentTime: '09:00 AM',
    mode: 'UPI',
    gateway: 'Razorpay',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 30000,
    convenienceFee: 600,
    tax: 108,
    netAmount: 30708,
    status: 'Failed',
    txnId: 'TXN_RAZ_001238'
  },
  {
    id: '6',
    studentName: 'Ananya Gupta',
    studentId: 'STU006',
    class: '8',
    section: 'C',
    receiptNo: 'RCP2024001239',
    paymentDate: '2024-03-13',
    paymentTime: '11:30 AM',
    mode: 'Credit Card',
    gateway: 'PayU',
    feeHead: 'Transport Fee',
    academicYear: '2023-24',
    grossAmount: 6000,
    convenienceFee: 120,
    tax: 22,
    netAmount: 6142,
    status: 'Success',
    txnId: 'TXN_PAYU_001239'
  },
  {
    id: '7',
    studentName: 'Karan Mehta',
    studentId: 'STU007',
    class: '10',
    section: 'B',
    receiptNo: 'RCP2024001240',
    paymentDate: '2024-03-12',
    paymentTime: '03:45 PM',
    mode: 'UPI',
    gateway: 'Razorpay',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 25000,
    convenienceFee: 500,
    tax: 90,
    netAmount: 25590,
    status: 'Success',
    txnId: 'TXN_RAZ_001240'
  },
  {
    id: '8',
    studentName: 'Meera Joshi',
    studentId: 'STU008',
    class: '9',
    section: 'A',
    receiptNo: 'RCP2024001241',
    paymentDate: '2024-03-12',
    paymentTime: '10:15 AM',
    mode: 'Net Banking',
    gateway: 'Razorpay',
    feeHead: 'Lab Fee',
    academicYear: '2023-24',
    grossAmount: 3500,
    convenienceFee: 70,
    tax: 13,
    netAmount: 3583,
    status: 'Refunded',
    txnId: 'TXN_RAZ_001241'
  },
  {
    id: '9',
    studentName: 'Rohan Agarwal',
    studentId: 'STU009',
    class: '11',
    section: 'C',
    receiptNo: 'RCP2024001242',
    paymentDate: '2024-03-11',
    paymentTime: '02:00 PM',
    mode: 'Debit Card',
    gateway: 'PayU',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 28000,
    convenienceFee: 560,
    tax: 101,
    netAmount: 28661,
    status: 'Success',
    txnId: 'TXN_PAYU_001242'
  },
  {
    id: '10',
    studentName: 'Nisha Kapoor',
    studentId: 'STU010',
    class: '8',
    section: 'A',
    receiptNo: 'RCP2024001243',
    paymentDate: '2024-03-11',
    paymentTime: '11:00 AM',
    mode: 'UPI',
    gateway: 'Paytm',
    feeHead: 'Transport Fee',
    academicYear: '2023-24',
    grossAmount: 7500,
    convenienceFee: 150,
    tax: 27,
    netAmount: 7677,
    status: 'Success',
    txnId: 'TXN_PAYTM_001243'
  },
  {
    id: '11',
    studentName: 'Arjun Nair',
    studentId: 'STU011',
    class: '12',
    section: 'A',
    receiptNo: 'RCP2024001244',
    paymentDate: '2024-03-10',
    paymentTime: '04:30 PM',
    mode: 'Credit Card',
    gateway: 'Razorpay',
    feeHead: 'Examination Fee',
    academicYear: '2023-24',
    grossAmount: 5000,
    convenienceFee: 100,
    tax: 18,
    netAmount: 5118,
    status: 'Success',
    txnId: 'TXN_RAZ_001244'
  },
  {
    id: '12',
    studentName: 'Divya Sharma',
    studentId: 'STU012',
    class: '9',
    section: 'C',
    receiptNo: 'RCP2024001245',
    paymentDate: '2024-03-10',
    paymentTime: '09:45 AM',
    mode: 'Net Banking',
    gateway: 'PayU',
    feeHead: 'Tuition Fee',
    academicYear: '2023-24',
    grossAmount: 22000,
    convenienceFee: 440,
    tax: 79,
    netAmount: 22519,
    status: 'Success',
    txnId: 'TXN_PAYU_001245'
  }];

  // Filter options
  const academicYearOptions = [
  {
    value: '2023-24',
    label: '2023-24'
  },
  {
    value: '2022-23',
    label: '2022-23'
  },
  {
    value: '2021-22',
    label: '2021-22'
  }];

  const classOptions = [
  {
    value: 'all',
    label: 'All Classes'
  },
  {
    value: '8',
    label: 'Class 8'
  },
  {
    value: '9',
    label: 'Class 9'
  },
  {
    value: '10',
    label: 'Class 10'
  },
  {
    value: '11',
    label: 'Class 11'
  },
  {
    value: '12',
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
  }];

  const feeHeadOptions = [
  {
    value: 'all',
    label: 'All Fee Heads'
  },
  {
    value: 'Tuition Fee',
    label: 'Tuition Fee'
  },
  {
    value: 'Transport Fee',
    label: 'Transport Fee'
  },
  {
    value: 'Library Fee',
    label: 'Library Fee'
  },
  {
    value: 'Lab Fee',
    label: 'Lab Fee'
  },
  {
    value: 'Examination Fee',
    label: 'Examination Fee'
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
    value: 'Failed',
    label: 'Failed'
  },
  {
    value: 'Refunded',
    label: 'Refunded'
  }];

  const groupByOptions = [
  {
    value: 'none',
    label: 'No Grouping'
  },
  {
    value: 'academic_year',
    label: 'Academic Year'
  },
  {
    value: 'class',
    label: 'Class'
  },
  {
    value: 'fee_head',
    label: 'Fee Head'
  },
  {
    value: 'date',
    label: 'Date'
  },
  {
    value: 'gateway',
    label: 'Gateway'
  },
  {
    value: 'month',
    label: 'Month'
  }];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (selectedClass !== 'all' && txn.class !== selectedClass) return false;
      if (selectedSection !== 'all' && txn.section !== selectedSection)
      return false;
      if (selectedFeeHead !== 'all' && txn.feeHead !== selectedFeeHead)
      return false;
      if (selectedGateway !== 'all' && txn.gateway !== selectedGateway)
      return false;
      if (selectedStatus !== 'all' && txn.status !== selectedStatus)
      return false;
      if (txn.academicYear !== academicYear) return false;
      if (dateFrom && txn.paymentDate < dateFrom) return false;
      if (dateTo && txn.paymentDate > dateTo) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          txn.studentName.toLowerCase().includes(query) ||
          txn.receiptNo.toLowerCase().includes(query) ||
          txn.txnId.toLowerCase().includes(query) ||
          txn.studentId.toLowerCase().includes(query));

      }
      return true;
    });
  }, [
  transactions,
  selectedClass,
  selectedSection,
  selectedFeeHead,
  selectedGateway,
  selectedStatus,
  academicYear,
  dateFrom,
  dateTo,
  searchQuery]
  );
  // Sort transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aVal: any = a[sortColumn as keyof PaymentTransaction];
      let bVal: any = b[sortColumn as keyof PaymentTransaction];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [filteredTransactions, sortColumn, sortDirection]);
  // Group transactions
  const groupedData = useMemo((): GroupedData[] => {
    if (groupBy === 'none') return [];
    const groups: Record<string, PaymentTransaction[]> = {};
    sortedTransactions.forEach((txn) => {
      let key: string;
      let label: string;
      switch (groupBy) {
        case 'academic_year':
          key = txn.academicYear;
          label = `Academic Year: ${txn.academicYear}`;
          break;
        case 'class':
          key = `${txn.class}-${txn.section}`;
          label = `Class ${txn.class}-${txn.section}`;
          break;
        case 'fee_head':
          key = txn.feeHead;
          label = txn.feeHead;
          break;
        case 'date':
          key = txn.paymentDate;
          label = new Date(txn.paymentDate).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          break;
        case 'gateway':
          key = txn.gateway;
          label = txn.gateway;
          break;
        case 'month':
          const date = new Date(txn.paymentDate);
          key = `${date.getFullYear()}-${date.getMonth()}`;
          label = date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long'
          });
          break;
        default:
          key = 'all';
          label = 'All Transactions';
      }
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(txn);
    });
    return Object.entries(groups).map(([key, txns]) => {
      const successTxns = txns.filter((t) => t.status === 'Success');
      return {
        key,
        label: getGroupLabel(key, groupBy),
        transactions: txns,
        totalGross: successTxns.reduce((sum, t) => sum + t.grossAmount, 0),
        totalFee: successTxns.reduce((sum, t) => sum + t.convenienceFee, 0),
        totalTax: successTxns.reduce((sum, t) => sum + t.tax, 0),
        totalNet: successTxns.reduce((sum, t) => sum + t.netAmount, 0),
        count: txns.length,
        isExpanded: expandedGroups.has(key)
      };
    });
  }, [sortedTransactions, groupBy, expandedGroups]);
  // Get group label
  const getGroupLabel = (key: string, groupType: GroupByOption): string => {
    switch (groupType) {
      case 'academic_year':
        return `Academic Year: ${key}`;
      case 'class':
        return `Class ${key}`;
      case 'fee_head':
        return key;
      case 'date':
        return new Date(key).toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'gateway':
        return key;
      case 'month':
        const [year, month] = key.split('-');
        return new Date(parseInt(year), parseInt(month)).toLocaleDateString(
          'en-IN',
          {
            year: 'numeric',
            month: 'long'
          }
        );
      default:
        return key;
    }
  };
  // Calculate summary
  const summary: SummaryData = useMemo(() => {
    const successTxns = filteredTransactions.filter(
      (t) => t.status === 'Success'
    );
    return {
      totalTransactions: filteredTransactions.length,
      totalGrossAmount: successTxns.reduce((sum, t) => sum + t.grossAmount, 0),
      totalConvenienceFee: successTxns.reduce(
        (sum, t) => sum + t.convenienceFee,
        0
      ),
      totalTax: successTxns.reduce((sum, t) => sum + t.tax, 0),
      totalNetAmount: successTxns.reduce((sum, t) => sum + t.netAmount, 0),
      successCount: successTxns.length,
      failedCount: filteredTransactions.filter((t) => t.status === 'Failed').
      length,
      refundedCount: filteredTransactions.filter((t) => t.status === 'Refunded').
      length,
      averageTransactionValue:
      successTxns.length > 0 ?
      successTxns.reduce((sum, t) => sum + t.grossAmount, 0) /
      successTxns.length :
      0
    };
  }, [filteredTransactions]);
  // Toggle group expansion
  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };
  // Expand/Collapse all groups
  const toggleAllGroups = (expand: boolean) => {
    if (expand) {
      setExpandedGroups(new Set(groupedData.map((g) => g.key)));
    } else {
      setExpandedGroups(new Set());
    }
  };
  // Toggle column visibility
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [column]: !prev[column]
    }));
  };
  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'danger';
      case 'Refunded':
        return 'warning';
      default:
        return 'secondary';
    }
  };
  // Get fee head icon
  const getFeeHeadIcon = (feeHead: string) => {
    switch (feeHead) {
      case 'Tuition Fee':
        return <GraduationCap className="w-4 h-4" />;
      case 'Transport Fee':
        return <Bus className="w-4 h-4" />;
      case 'Library Fee':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Receipt className="w-4 h-4" />;
    }
  };
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  // Handle export
  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Simulate download
      console.log(`Exporting as ${format}`);
    }, 1500);
  };
  // Reset filters
  const resetFilters = () => {
    setSelectedClass('all');
    setSelectedSection('all');
    setSelectedFeeHead('all');
    setSelectedGateway('all');
    setSelectedStatus('all');
    setSearchQuery('');
    setDateFrom('2024-03-01');
    setDateTo('2024-03-31');
  };
  // Sort icon component
  const SortIcon = ({ column }: {column: string;}) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortDirection === 'asc' ?
    <ArrowUp className="w-3 h-3 text-blue-600" /> :

    <ArrowDown className="w-3 h-3 text-blue-600" />;

  };
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Online Payment Report
          </h1>
          <p className="text-sm text-gray-500">
            Comprehensive report of all online payment transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <div className="relative group">
            <Button variant="outline" disabled={isExporting}>
              {isExporting ?
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => handleExport('excel')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                Export as Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileText className="w-4 h-4 text-red-600" />
                Export as PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">

                <FileText className="w-4 h-4 text-blue-600" />
                Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <ReportFilters />

      {/* Filters Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Report Filters</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}>

              {showFilters ?
              <ChevronUp className="w-4 h-4" /> :

              <ChevronDown className="w-4 h-4" />
              }
            </Button>
          </div>
        </div>

        {showFilters &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Academic Year
              </label>
              <Select
              options={academicYearOptions}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date From
              </label>
              <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date To
              </label>
              <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                placeholder="Student, Receipt, Txn ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9" />

              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <Select
              options={classOptions}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section
              </label>
              <Select
              options={sectionOptions}
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Head
              </label>
              <Select
              options={feeHeadOptions}
              value={selectedFeeHead}
              onChange={(e) => setSelectedFeeHead(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gateway
              </label>
              <Select
              options={gatewayOptions}
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)} />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Group By
              </label>
              <Select
              options={groupByOptions}
              value={groupBy}
              onChange={(e) => {
                setGroupBy(e.target.value as GroupByOption);
                setExpandedGroups(new Set());
              }} />

            </div>
            <div className="flex items-end">
              <Button
              variant="ghost"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              className="w-full">

                <Settings className="w-4 h-4 mr-2" />
                Column Settings
              </Button>
            </div>
          </div>
        }

        {/* Column Settings */}
        {showColumnSettings &&
        <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Visible Columns
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(visibleColumns).map(([key, visible]) =>
            <button
              key={key}
              onClick={() =>
              toggleColumn(key as keyof typeof visibleColumns)
              }
              className={`px-3 py-1.5 text-sm rounded-full border transition-all ${visible ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>

                  {visible && <Check className="w-3 h-3 inline mr-1" />}
                  {key.
              replace(/([A-Z])/g, ' $1').
              replace(/^./, (s) => s.toUpperCase())}
                </button>
            )}
            </div>
          </div>
        }
      </Card>

      {/* Summary Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Report Summary</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Receipt className="w-4 h-4" />
              <span>Total Transactions</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalTransactions}
            </p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-green-600">✓ {summary.successCount}</span>
              <span className="text-red-600">✗ {summary.failedCount}</span>
              <span className="text-yellow-600">↺ {summary.refundedCount}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <IndianRupee className="w-4 h-4" />
              <span>Gross Amount</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{summary.totalGrossAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Fee collected from parents
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <CreditCard className="w-4 h-4" />
              <span>Convenience Fee</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₹{summary.totalConvenienceFee.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Gateway processing charges
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Percent className="w-4 h-4" />
              <span>Total Tax (GST)</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              ₹{summary.totalTax.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              18% GST on convenience fee
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Net Amount</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{summary.totalNetAmount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Total collected (incl. fees)
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BarChart3 className="w-4 h-4" />
              <span>Avg. Transaction</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{Math.round(summary.averageTransactionValue).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Average transaction value
            </p>
          </div>
        </div>
      </Card>

      {/* Data Section */}
      <Card className="overflow-hidden">
        {/* Table Header */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900">Transaction Details</h3>
            <Badge variant="secondary">
              {filteredTransactions.length} records
            </Badge>
          </div>

          {groupBy !== 'none' &&
          <div className="flex items-center gap-2">
              <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAllGroups(true)}>

                Expand All
              </Button>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleAllGroups(false)}>

                Collapse All
              </Button>
            </div>
          }
        </div>

        {/* Grouped View */}
        {groupBy !== 'none' &&
        <div className="divide-y">
            {groupedData.map((group) =>
          <div key={group.key}>
                {/* Group Header */}
                <div
              onClick={() => toggleGroup(group.key)}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">

                  <div className="flex items-center gap-3">
                    {group.isExpanded ?
                <ChevronDown className="w-5 h-5 text-gray-500" /> :

                <ChevronRight className="w-5 h-5 text-gray-500" />
                }
                    <div className="flex items-center gap-2">
                      {groupBy === 'fee_head' && getFeeHeadIcon(group.key)}
                      {groupBy === 'class' &&
                  <Users className="w-4 h-4 text-blue-600" />
                  }
                      {groupBy === 'gateway' &&
                  <CreditCard className="w-4 h-4 text-purple-600" />
                  }
                      {groupBy === 'date' &&
                  <Calendar className="w-4 h-4 text-green-600" />
                  }
                      {groupBy === 'month' &&
                  <CalendarDays className="w-4 h-4 text-orange-600" />
                  }
                      <span className="font-medium text-gray-900">
                        {group.label}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {group.count} transactions
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <span className="text-gray-500">Gross: </span>
                      <span className="font-medium">
                        ₹{group.totalGross.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Fee: </span>
                      <span className="font-medium">
                        ₹{group.totalFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500">Tax: </span>
                      <span className="font-medium">
                        ₹{group.totalTax.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <span className="text-gray-500">Net: </span>
                      <span className="font-bold text-green-600">
                        ₹{group.totalNet.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Group Transactions */}
                {group.isExpanded &&
            <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          {visibleColumns.studentName &&
                    <th
                      className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort('studentName')}>

                              <div className="flex items-center gap-1">
                                Student Name
                                <SortIcon column="studentName" />
                              </div>
                            </th>
                    }
                          {visibleColumns.class &&
                    <th className="text-left p-3 font-medium text-gray-700">
                              Class
                            </th>
                    }
                          {visibleColumns.receiptNo &&
                    <th
                      className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort('receiptNo')}>

                              <div className="flex items-center gap-1">
                                Receipt No
                                <SortIcon column="receiptNo" />
                              </div>
                            </th>
                    }
                          {visibleColumns.paymentDate &&
                    <th
                      className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort('paymentDate')}>

                              <div className="flex items-center gap-1">
                                Payment Date
                                <SortIcon column="paymentDate" />
                              </div>
                            </th>
                    }
                          {visibleColumns.feeHead &&
                    <th className="text-left p-3 font-medium text-gray-700">
                              Fee Head
                            </th>
                    }
                          {visibleColumns.mode &&
                    <th className="text-left p-3 font-medium text-gray-700">
                              Mode
                            </th>
                    }
                          {visibleColumns.gateway &&
                    <th className="text-left p-3 font-medium text-gray-700">
                              Gateway
                            </th>
                    }
                          {visibleColumns.grossAmount &&
                    <th
                      className="text-right p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort('grossAmount')}>

                              <div className="flex items-center justify-end gap-1">
                                Gross
                                <SortIcon column="grossAmount" />
                              </div>
                            </th>
                    }
                          {visibleColumns.convenienceFee &&
                    <th className="text-right p-3 font-medium text-gray-700">
                              Fee
                            </th>
                    }
                          {visibleColumns.tax &&
                    <th className="text-right p-3 font-medium text-gray-700">
                              Tax
                            </th>
                    }
                          {visibleColumns.netAmount &&
                    <th className="text-right p-3 font-medium text-gray-700">
                              Net Amount
                            </th>
                    }
                          {visibleColumns.status &&
                    <th className="text-center p-3 font-medium text-gray-700">
                              Status
                            </th>
                    }
                          {visibleColumns.txnId &&
                    <th className="text-left p-3 font-medium text-gray-700">
                              Txn ID
                            </th>
                    }
                        </tr>
                      </thead>
                      <tbody>
                        {group.transactions.map((txn) =>
                  <tr
                    key={txn.id}
                    className="border-b hover:bg-gray-50">

                            {visibleColumns.studentName &&
                    <td className="p-3">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {txn.studentName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {txn.studentId}
                                  </p>
                                </div>
                              </td>
                    }
                            {visibleColumns.class &&
                    <td className="p-3">
                                {txn.class}-{txn.section}
                              </td>
                    }
                            {visibleColumns.receiptNo &&
                    <td className="p-3 font-mono text-xs">
                                {txn.receiptNo}
                              </td>
                    }
                            {visibleColumns.paymentDate &&
                    <td className="p-3">
                                <div>
                                  <p>{txn.paymentDate}</p>
                                  <p className="text-xs text-gray-500">
                                    {txn.paymentTime}
                                  </p>
                                </div>
                              </td>
                    }
                            {visibleColumns.feeHead &&
                    <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {getFeeHeadIcon(txn.feeHead)}
                                  <span>{txn.feeHead}</span>
                                </div>
                              </td>
                    }
                            {visibleColumns.mode &&
                    <td className="p-3">{txn.mode}</td>
                    }
                            {visibleColumns.gateway &&
                    <td className="p-3">
                                <Badge variant="outline">{txn.gateway}</Badge>
                              </td>
                    }
                            {visibleColumns.grossAmount &&
                    <td className="p-3 text-right font-medium">
                                ₹{txn.grossAmount.toLocaleString()}
                              </td>
                    }
                            {visibleColumns.convenienceFee &&
                    <td className="p-3 text-right text-gray-600">
                                ₹{txn.convenienceFee.toLocaleString()}
                              </td>
                    }
                            {visibleColumns.tax &&
                    <td className="p-3 text-right text-gray-600">
                                ₹{txn.tax.toLocaleString()}
                              </td>
                    }
                            {visibleColumns.netAmount &&
                    <td className="p-3 text-right font-bold text-green-600">
                                ₹{txn.netAmount.toLocaleString()}
                              </td>
                    }
                            {visibleColumns.status &&
                    <td className="p-3 text-center">
                                <Badge variant={getStatusVariant(txn.status)}>
                                  {txn.status}
                                </Badge>
                              </td>
                    }
                            {visibleColumns.txnId &&
                    <td className="p-3 font-mono text-xs">
                                {txn.txnId}
                              </td>
                    }
                          </tr>
                  )}
                      </tbody>
                    </table>
                  </div>
            }
              </div>
          )}
          </div>
        }

        {/* Flat View (No Grouping) */}
        {groupBy === 'none' &&
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {visibleColumns.studentName &&
                <th
                  className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('studentName')}>

                      <div className="flex items-center gap-1">
                        Student Name
                        <SortIcon column="studentName" />
                      </div>
                    </th>
                }
                  {visibleColumns.class &&
                <th className="text-left p-3 font-medium text-gray-700">
                      Class
                    </th>
                }
                  {visibleColumns.receiptNo &&
                <th
                  className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('receiptNo')}>

                      <div className="flex items-center gap-1">
                        Receipt No
                        <SortIcon column="receiptNo" />
                      </div>
                    </th>
                }
                  {visibleColumns.paymentDate &&
                <th
                  className="text-left p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('paymentDate')}>

                      <div className="flex items-center gap-1">
                        Payment Date
                        <SortIcon column="paymentDate" />
                      </div>
                    </th>
                }
                  {visibleColumns.feeHead &&
                <th className="text-left p-3 font-medium text-gray-700">
                      Fee Head
                    </th>
                }
                  {visibleColumns.mode &&
                <th className="text-left p-3 font-medium text-gray-700">
                      Mode
                    </th>
                }
                  {visibleColumns.gateway &&
                <th className="text-left p-3 font-medium text-gray-700">
                      Gateway
                    </th>
                }
                  {visibleColumns.grossAmount &&
                <th
                  className="text-right p-3 font-medium text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('grossAmount')}>

                      <div className="flex items-center justify-end gap-1">
                        Gross
                        <SortIcon column="grossAmount" />
                      </div>
                    </th>
                }
                  {visibleColumns.convenienceFee &&
                <th className="text-right p-3 font-medium text-gray-700">
                      Fee
                    </th>
                }
                  {visibleColumns.tax &&
                <th className="text-right p-3 font-medium text-gray-700">
                      Tax
                    </th>
                }
                  {visibleColumns.netAmount &&
                <th className="text-right p-3 font-medium text-gray-700">
                      Net Amount
                    </th>
                }
                  {visibleColumns.status &&
                <th className="text-center p-3 font-medium text-gray-700">
                      Status
                    </th>
                }
                  {visibleColumns.txnId &&
                <th className="text-left p-3 font-medium text-gray-700">
                      Txn ID
                    </th>
                }
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((txn) =>
              <tr key={txn.id} className="border-b hover:bg-gray-50">
                    {visibleColumns.studentName &&
                <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">
                            {txn.studentName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {txn.studentId}
                          </p>
                        </div>
                      </td>
                }
                    {visibleColumns.class &&
                <td className="p-3">
                        {txn.class}-{txn.section}
                      </td>
                }
                    {visibleColumns.receiptNo &&
                <td className="p-3 font-mono text-xs">{txn.receiptNo}</td>
                }
                    {visibleColumns.paymentDate &&
                <td className="p-3">
                        <div>
                          <p>{txn.paymentDate}</p>
                          <p className="text-xs text-gray-500">
                            {txn.paymentTime}
                          </p>
                        </div>
                      </td>
                }
                    {visibleColumns.feeHead &&
                <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getFeeHeadIcon(txn.feeHead)}
                          <span>{txn.feeHead}</span>
                        </div>
                      </td>
                }
                    {visibleColumns.mode && <td className="p-3">{txn.mode}</td>}
                    {visibleColumns.gateway &&
                <td className="p-3">
                        <Badge variant="outline">{txn.gateway}</Badge>
                      </td>
                }
                    {visibleColumns.grossAmount &&
                <td className="p-3 text-right font-medium">
                        ₹{txn.grossAmount.toLocaleString()}
                      </td>
                }
                    {visibleColumns.convenienceFee &&
                <td className="p-3 text-right text-gray-600">
                        ₹{txn.convenienceFee.toLocaleString()}
                      </td>
                }
                    {visibleColumns.tax &&
                <td className="p-3 text-right text-gray-600">
                        ₹{txn.tax.toLocaleString()}
                      </td>
                }
                    {visibleColumns.netAmount &&
                <td className="p-3 text-right font-bold text-green-600">
                        ₹{txn.netAmount.toLocaleString()}
                      </td>
                }
                    {visibleColumns.status &&
                <td className="p-3 text-center">
                        <Badge variant={getStatusVariant(txn.status)}>
                          {txn.status}
                        </Badge>
                      </td>
                }
                    {visibleColumns.txnId &&
                <td className="p-3 font-mono text-xs">{txn.txnId}</td>
                }
                  </tr>
              )}
              </tbody>
              {/* Table Footer with Totals */}
              <tfoot>
                <tr className="bg-gray-100 font-medium">
                  <td
                  colSpan={
                  Object.values(visibleColumns).filter(Boolean).length - (
                  visibleColumns.grossAmount ? 1 : 0) - (
                  visibleColumns.convenienceFee ? 1 : 0) - (
                  visibleColumns.tax ? 1 : 0) - (
                  visibleColumns.netAmount ? 1 : 0) - (
                  visibleColumns.status ? 1 : 0) - (
                  visibleColumns.txnId ? 1 : 0)
                  }
                  className="p-3 text-right">

                    <strong>Totals:</strong>
                  </td>
                  {visibleColumns.grossAmount &&
                <td className="p-3 text-right font-bold">
                      ₹{summary.totalGrossAmount.toLocaleString()}
                    </td>
                }
                  {visibleColumns.convenienceFee &&
                <td className="p-3 text-right font-bold">
                      ₹{summary.totalConvenienceFee.toLocaleString()}
                    </td>
                }
                  {visibleColumns.tax &&
                <td className="p-3 text-right font-bold">
                      ₹{summary.totalTax.toLocaleString()}
                    </td>
                }
                  {visibleColumns.netAmount &&
                <td className="p-3 text-right font-bold text-green-600">
                      ₹{summary.totalNetAmount.toLocaleString()}
                    </td>
                }
                  {visibleColumns.status && <td className="p-3"></td>}
                  {visibleColumns.txnId && <td className="p-3"></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        }

        {/* Empty State */}
        {filteredTransactions.length === 0 &&
        <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">
              Try adjusting your filters to see more results
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        }
      </Card>

      {/* Print Footer */}
      <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-gray-500">
        <p>
          Report Generated on {new Date().toLocaleString()} | Academic Year:{' '}
          {academicYear}
        </p>
        <p className="mt-1">
          Period: {dateFrom} to {dateTo} | Total Records:{' '}
          {filteredTransactions.length}
        </p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .no-print {
            display: none !important;
          }
          table {
            font-size: 10px;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>);

}