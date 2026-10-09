import React, { useState, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  FileSpreadsheet,
  Download,
  Filter,
  AlertTriangle,
  CheckCircle,
  Landmark,
  FileText,
  Search,
  Users,
  IndianRupee,
  Calendar,
  RefreshCw,
  Eye,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Printer,
  Mail,
  Phone,
  Upload,
  History,
  Settings,
  Info,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building,
  CreditCard,
  Wallet,
  Send,
  Copy,
  ExternalLink,
  FileCheck,
  Zap,
  BarChart3,
  TrendingUp,
  Shield,
  Lock,
  Unlock,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
  Globe,
  User,
  GraduationCap,
  Award,
  PiggyBank } from
'lucide-react';

// Types
interface Student {
  id: string;
  grNo: string;
  admissionNo: string;
  name: string;
  fatherName: string;
  class: string;
  section: string;
  rollNumber: string;
  category: string;
  photo: string;
  phone: string;
  email: string;
  aadharNo: string;
  isRTE: boolean;
  isEWS: boolean;
}

interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  accountType: string;
  isAadharLinked: boolean;
  isVerified: boolean;
}

interface ScholarshipDisbursement {
  id: string;
  student: Student;
  bankDetails: BankDetails;
  schemeId: string;
  schemeName: string;
  schemeType: string;
  schemeCategory: 'Central' | 'State' | 'Institution';
  academicYear: string;
  sanctionedAmount: number;
  previousDisbursed: number;
  currentDisbursement: number;
  pendingAmount: number;
  disbursementMode: 'DBT' | 'Cheque' | 'Cash';
  status: 'Sanctioned' | 'Pending Disbursement' | 'In Process' | 'Disbursed' | 'Failed' | 'On Hold';
  validationStatus: 'Valid' | 'Invalid' | 'Pending Verification';
  validationErrors: string[];
  remarks: string;
  approvedBy: string;
  approvalDate: string;
}

interface DisbursementBatch {
  id: string;
  batchNo: string;
  date: string;
  time: string;
  scheme: string;
  bankFormat: string;
  totalStudents: number;
  totalAmount: number;
  successCount: number;
  failedCount: number;
  status: 'Generated' | 'Uploaded' | 'Processed' | 'Completed' | 'Partial' | 'Failed';
  processedBy: string;
  fileName: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  voucherNo: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
  status: 'Posted' | 'Pending' | 'Reversed';
}

type DisbursementStep = 'select' | 'validate' | 'review' | 'generate' | 'confirm';

export function BulkScholarshipDisbursement() {
  // State Management
  const [currentStep, setCurrentStep] = useState<DisbursementStep>('select');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState<ScholarshipDisbursement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<string | null>(null);

  // Configuration
  const [config, setConfig] = useState({
    scheme: 'all',
    class: 'all',
    section: 'all',
    category: 'all',
    status: 'Sanctioned',
    bankFormat: 'generic_csv',
    disbursementDate: new Date().toISOString().split('T')[0],
    narration: 'Scholarship Disbursement',
    debitAccount: 'Scholarship Payable A/C',
    creditAccount: 'Bank A/C - Main'
  });

  // Disbursement amounts (editable)
  const [disbursementAmounts, setDisbursementAmounts] = useState<Record<string, number>>({});

  // Mock Students Data
  const students: Student[] = [
  {
    id: 'STU001',
    grNo: 'GR001',
    admissionNo: 'ADM-2024-001',
    name: 'Rahul Sharma',
    fatherName: 'Rajesh Sharma',
    class: '10',
    section: 'A',
    rollNumber: '15',
    category: 'General',
    photo: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff',
    phone: '9876543210',
    email: 'rajesh.sharma@email.com',
    aadharNo: '1234-5678-9012',
    isRTE: false,
    isEWS: true
  },
  {
    id: 'STU002',
    grNo: 'GR002',
    admissionNo: 'ADM-2024-002',
    name: 'Priya Patel',
    fatherName: 'Mahesh Patel',
    class: '10',
    section: 'A',
    rollNumber: '08',
    category: 'OBC',
    photo: 'https://ui-avatars.com/api/?name=Priya+Patel&background=6366f1&color=fff',
    phone: '9876543211',
    email: 'mahesh.patel@email.com',
    aadharNo: '2345-6789-0123',
    isRTE: false,
    isEWS: true
  },
  {
    id: 'STU003',
    grNo: 'GR003',
    admissionNo: 'ADM-2024-005',
    name: 'Amit Singh',
    fatherName: 'Vijay Singh',
    class: '9',
    section: 'B',
    rollNumber: '12',
    category: 'SC',
    photo: 'https://ui-avatars.com/api/?name=Amit+Singh&background=10b981&color=fff',
    phone: '9876543212',
    email: 'vijay.singh@email.com',
    aadharNo: '3456-7890-1234',
    isRTE: true,
    isEWS: false
  },
  {
    id: 'STU004',
    grNo: 'GR004',
    admissionNo: 'ADM-2024-008',
    name: 'Sneha Gupta',
    fatherName: 'Anil Gupta',
    class: '9',
    section: 'B',
    rollNumber: '05',
    category: 'General',
    photo: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=f59e0b&color=fff',
    phone: '9876543213',
    email: 'anil.gupta@email.com',
    aadharNo: '4567-8901-2345',
    isRTE: false,
    isEWS: false
  },
  {
    id: 'STU005',
    grNo: 'GR005',
    admissionNo: 'ADM-2024-012',
    name: 'Mohammed Imran',
    fatherName: 'Abdul Karim',
    class: '10',
    section: 'B',
    rollNumber: '22',
    category: 'Other',
    photo: 'https://ui-avatars.com/api/?name=Mohammed+Imran&background=ef4444&color=fff',
    phone: '9876543214',
    email: 'abdul.karim@email.com',
    aadharNo: '5678-9012-3456',
    isRTE: true,
    isEWS: true
  },
  {
    id: 'STU006',
    grNo: 'GR006',
    admissionNo: 'ADM-2024-015',
    name: 'Kavya Reddy',
    fatherName: 'Venkat Reddy',
    class: '8',
    section: 'A',
    rollNumber: '18',
    category: 'OBC',
    photo: 'https://ui-avatars.com/api/?name=Kavya+Reddy&background=8b5cf6&color=fff',
    phone: '9876543215',
    email: 'venkat.reddy@email.com',
    aadharNo: '6789-0123-4567',
    isRTE: false,
    isEWS: true
  }];


  // Mock Bank Details
  const bankDetailsData: Record<string, BankDetails> = {
    'STU001': {
      bankName: 'State Bank of India',
      branchName: 'Andheri West',
      accountNumber: '30001234567',
      ifscCode: 'SBIN0001234',
      accountHolderName: 'Rajesh Sharma',
      accountType: 'Savings',
      isAadharLinked: true,
      isVerified: true
    },
    'STU002': {
      bankName: 'HDFC Bank',
      branchName: 'Bandra',
      accountNumber: '501000998877',
      ifscCode: 'HDFC0000123',
      accountHolderName: 'Mahesh Patel',
      accountType: 'Savings',
      isAadharLinked: true,
      isVerified: true
    },
    'STU003': {
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      accountType: '',
      isAadharLinked: false,
      isVerified: false
    },
    'STU004': {
      bankName: 'ICICI Bank',
      branchName: 'Powai',
      accountNumber: '100100200300',
      ifscCode: 'ICIC0001001',
      accountHolderName: 'Anil Gupta',
      accountType: 'Savings',
      isAadharLinked: true,
      isVerified: true
    },
    'STU005': {
      bankName: 'Bank of India',
      branchName: 'Kurla',
      accountNumber: '112233445566',
      ifscCode: 'BKID0001234',
      accountHolderName: 'Abdul Karim',
      accountType: 'Savings',
      isAadharLinked: false,
      isVerified: true
    },
    'STU006': {
      bankName: 'Punjab National Bank',
      branchName: 'Dadar',
      accountNumber: '778899001122',
      ifscCode: 'PUNB0001234',
      accountHolderName: 'Venkat Reddy',
      accountType: 'Savings',
      isAadharLinked: true,
      isVerified: true
    }
  };

  // Mock Disbursements Data
  const disbursements: ScholarshipDisbursement[] = students.map((student, index) => {
    const bankDetails = bankDetailsData[student.id];
    const hasValidBank = bankDetails.accountNumber !== '';
    const schemes = [
    { id: 'SCH001', name: 'Merit Scholarship', type: 'Merit', category: 'Institution' as const },
    { id: 'SCH002', name: 'EWS Fee Waiver', type: 'EWS', category: 'State' as const },
    { id: 'SCH003', name: 'RTE Reimbursement', type: 'RTE', category: 'Central' as const },
    { id: 'SCH004', name: 'SC/ST Scholarship', type: 'SC/ST', category: 'Central' as const },
    { id: 'SCH005', name: 'Minority Scholarship', type: 'Minority', category: 'Central' as const }];

    const scheme = schemes[index % schemes.length];
    const amounts = [5000, 7500, 10000, 12500, 15000, 8000];
    const sanctioned = amounts[index % amounts.length];
    const previousDisbursed = index % 2 === 0 ? Math.round(sanctioned * 0.4) : 0;

    return {
      id: `DIS00${index + 1}`,
      student,
      bankDetails,
      schemeId: scheme.id,
      schemeName: scheme.name,
      schemeType: scheme.type,
      schemeCategory: scheme.category,
      academicYear: '2024-25',
      sanctionedAmount: sanctioned,
      previousDisbursed,
      currentDisbursement: sanctioned - previousDisbursed,
      pendingAmount: sanctioned - previousDisbursed,
      disbursementMode: 'DBT',
      status: 'Sanctioned',
      validationStatus: hasValidBank ? bankDetails.isAadharLinked ? 'Valid' : 'Pending Verification' : 'Invalid',
      validationErrors: hasValidBank ?
      bankDetails.isAadharLinked ?
      [] :
      ['Aadhar not linked with bank account'] :
      ['Bank details missing', 'Account verification pending'],
      remarks: '',
      approvedBy: 'Principal',
      approvalDate: '2024-03-10'
    };
  });

  // Mock Batch History
  const batchHistory: DisbursementBatch[] = [
  {
    id: 'BATCH001',
    batchNo: 'DISB-2024-0015',
    date: '2024-03-14',
    time: '02:30 PM',
    scheme: 'Merit Scholarship',
    bankFormat: 'SBI Bulk Upload',
    totalStudents: 25,
    totalAmount: 125000,
    successCount: 24,
    failedCount: 1,
    status: 'Completed',
    processedBy: 'Mr. Rajesh Kumar',
    fileName: 'SBI_BULK_20240314_0015.txt'
  },
  {
    id: 'BATCH002',
    batchNo: 'DISB-2024-0014',
    date: '2024-03-10',
    time: '11:15 AM',
    scheme: 'EWS Fee Waiver',
    bankFormat: 'Generic CSV',
    totalStudents: 45,
    totalAmount: 337500,
    successCount: 45,
    failedCount: 0,
    status: 'Completed',
    processedBy: 'Ms. Priya Singh',
    fileName: 'EWS_DISBURSEMENT_20240310.csv'
  },
  {
    id: 'BATCH003',
    batchNo: 'DISB-2024-0013',
    date: '2024-03-05',
    time: '04:00 PM',
    scheme: 'RTE Reimbursement',
    bankFormat: 'HDFC E-Net',
    totalStudents: 60,
    totalAmount: 600000,
    successCount: 58,
    failedCount: 2,
    status: 'Partial',
    processedBy: 'Mr. Amit Shah',
    fileName: 'HDFC_RTE_20240305.xls'
  }];


  // Mock Ledger Entries
  const ledgerEntries: LedgerEntry[] = [
  {
    id: 'LED001',
    date: '2024-03-14',
    voucherNo: 'JV-2024-0125',
    description: 'Merit Scholarship Disbursement - Batch DISB-2024-0015',
    debitAccount: 'Scholarship Payable A/C',
    creditAccount: 'Bank A/C - Main',
    amount: 125000,
    reference: 'DISB-2024-0015',
    status: 'Posted'
  },
  {
    id: 'LED002',
    date: '2024-03-10',
    voucherNo: 'JV-2024-0118',
    description: 'EWS Fee Waiver Disbursement - Batch DISB-2024-0014',
    debitAccount: 'Scholarship Payable A/C',
    creditAccount: 'Bank A/C - Main',
    amount: 337500,
    reference: 'DISB-2024-0014',
    status: 'Posted'
  }];


  // Scholarship Schemes
  const schemes = [
  { id: 'SCH001', name: 'Merit Scholarship', type: 'Merit' },
  { id: 'SCH002', name: 'EWS Fee Waiver', type: 'EWS' },
  { id: 'SCH003', name: 'RTE Reimbursement', type: 'RTE' },
  { id: 'SCH004', name: 'SC/ST Scholarship', type: 'SC/ST' },
  { id: 'SCH005', name: 'Minority Scholarship', type: 'Minority' }];


  // Bank Formats
  const bankFormats = [
  { id: 'generic_csv', name: 'Generic CSV', extension: '.csv', description: 'Universal format compatible with most banks' },
  { id: 'sbi_txt', name: 'SBI Bulk Upload', extension: '.txt', description: 'State Bank of India CMP format' },
  { id: 'hdfc_xls', name: 'HDFC E-Net', extension: '.xls', description: 'HDFC Corporate Net Banking format' },
  { id: 'icici_csv', name: 'ICICI CIB', extension: '.csv', description: 'ICICI Corporate Internet Banking format' },
  { id: 'axis_xml', name: 'Axis Connect', extension: '.xml', description: 'Axis Bank Corporate Banking format' },
  { id: 'pnb_txt', name: 'PNB Corp', extension: '.txt', description: 'Punjab National Bank format' },
  { id: 'neft_standard', name: 'NEFT Standard', extension: '.csv', description: 'RBI NEFT standard format' }];


  // Filter disbursements
  const filteredDisbursements = useMemo(() => {
    return disbursements.filter((d) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
      d.student.name.toLowerCase().includes(searchLower) ||
      d.student.grNo.toLowerCase().includes(searchLower) ||
      d.student.admissionNo.toLowerCase().includes(searchLower) ||
      d.schemeName.toLowerCase().includes(searchLower);

      // Scheme filter
      const matchesScheme = config.scheme === 'all' || d.schemeId === config.scheme;

      // Class filter
      const matchesClass = config.class === 'all' || d.student.class === config.class;

      // Section filter
      const matchesSection = config.section === 'all' || d.student.section === config.section;

      // Category filter
      const matchesCategory = config.category === 'all' || d.student.category === config.category;

      // Status filter
      const matchesStatus = config.status === 'all' || d.status === config.status;

      return matchesSearch && matchesScheme && matchesClass && matchesSection && matchesCategory && matchesStatus;
    });
  }, [disbursements, searchTerm, config]);

  // Statistics
  const stats = useMemo(() => {
    const validDisbursements = filteredDisbursements.filter((d) => d.validationStatus === 'Valid');
    const invalidDisbursements = filteredDisbursements.filter((d) => d.validationStatus === 'Invalid');
    const pendingVerification = filteredDisbursements.filter((d) => d.validationStatus === 'Pending Verification');

    const totalSanctioned = filteredDisbursements.reduce((sum, d) => sum + d.sanctionedAmount, 0);
    const totalPreviouslyDisbursed = filteredDisbursements.reduce((sum, d) => sum + d.previousDisbursed, 0);
    const totalPending = filteredDisbursements.reduce((sum, d) => sum + d.pendingAmount, 0);

    const selectedDisbursements = filteredDisbursements.filter((d) => selectedIds.includes(d.id));
    const totalSelected = selectedDisbursements.reduce((sum, d) => {
      const amount = disbursementAmounts[d.id] !== undefined ? disbursementAmounts[d.id] : d.currentDisbursement;
      return sum + amount;
    }, 0);

    return {
      totalStudents: filteredDisbursements.length,
      validCount: validDisbursements.length,
      invalidCount: invalidDisbursements.length,
      pendingVerification: pendingVerification.length,
      totalSanctioned,
      totalPreviouslyDisbursed,
      totalPending,
      selectedCount: selectedIds.length,
      totalSelected
    };
  }, [filteredDisbursements, selectedIds, disbursementAmounts]);

  // Validate bank details
  const validateBankDetails = (bankDetails: BankDetails): {isValid: boolean;errors: string[];} => {
    const errors: string[] = [];

    if (!bankDetails.bankName) errors.push('Bank name is required');
    if (!bankDetails.accountNumber) errors.push('Account number is required');
    if (!bankDetails.ifscCode) errors.push('IFSC code is required');
    if (!bankDetails.accountHolderName) errors.push('Account holder name is required');
    if (bankDetails.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankDetails.ifscCode)) {
      errors.push('Invalid IFSC code format');
    }
    if (!bankDetails.isAadharLinked) errors.push('Bank account not linked with Aadhar');
    if (!bankDetails.isVerified) errors.push('Bank account not verified');

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const validIds = filteredDisbursements.
      filter((d) => d.validationStatus === 'Valid' && d.status === 'Sanctioned').
      map((d) => d.id);
      setSelectedIds(validIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Handle row selection
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
    prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Update disbursement amount
  const updateDisbursementAmount = (id: string, amount: number) => {
    const disbursement = disbursements.find((d) => d.id === id);
    if (!disbursement) return;

    const maxAmount = disbursement.pendingAmount;
    const validAmount = Math.min(Math.max(0, amount), maxAmount);

    setDisbursementAmounts((prev) => ({
      ...prev,
      [id]: validAmount
    }));
  };

  // Generate bank file
  const generateBankFile = () => {
    const selectedDisbursements = filteredDisbursements.filter((d) => selectedIds.includes(d.id));
    const format = bankFormats.find((f) => f.id === config.bankFormat);

    if (selectedDisbursements.length === 0) return;

    setIsProcessing(true);

    // Simulate file generation
    setTimeout(() => {
      const fileName = `${config.bankFormat.toUpperCase()}_${new Date().toISOString().split('T')[0]}_${Date.now()}${format?.extension}`;
      setGeneratedFile(fileName);
      setIsProcessing(false);
      setCurrentStep('confirm');
    }, 2000);
  };

  // Confirm disbursement
  const confirmDisbursement = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Generate batch number
      const batchNo = `DISB-${new Date().getFullYear()}-${String(batchHistory.length + 1).padStart(4, '0')}`;

      // Generate ledger entry
      const ledgerEntry: LedgerEntry = {
        id: `LED${Date.now()}`,
        date: config.disbursementDate,
        voucherNo: `JV-${new Date().getFullYear()}-${String(ledgerEntries.length + 1).padStart(4, '0')}`,
        description: `${config.narration} - Batch ${batchNo}`,
        debitAccount: config.debitAccount,
        creditAccount: config.creditAccount,
        amount: stats.totalSelected,
        reference: batchNo,
        status: 'Posted'
      };

      setIsProcessing(false);
      alert(`Disbursement completed successfully!\n\nBatch No: ${batchNo}\nAmount: ₹${stats.totalSelected.toLocaleString()}\nStudents: ${selectedIds.length}\n\nLedger Entry: ${ledgerEntry.voucherNo}`);

      // Reset
      setSelectedIds([]);
      setDisbursementAmounts({});
      setGeneratedFile(null);
      setCurrentStep('select');
    }, 2000);
  };

  // Download file
  const downloadFile = () => {
    if (!generatedFile) return;
    alert(`Downloading file: ${generatedFile}`);
  };

  // Reset filters
  const resetFilters = () => {
    setConfig({
      ...config,
      scheme: 'all',
      class: 'all',
      section: 'all',
      category: 'all',
      status: 'Sanctioned'
    });
    setSearchTerm('');
    setSelectedIds([]);
  };

  // Get validation badge
  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'Valid':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Valid
          </Badge>);

      case 'Invalid':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Invalid
          </Badge>);

      case 'Pending Verification':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>);

      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Sanctioned':
        return <Badge variant="info">{status}</Badge>;
      case 'Disbursed':
        return <Badge variant="success">{status}</Badge>;
      case 'Failed':
        return <Badge variant="danger">{status}</Badge>;
      case 'In Process':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // Steps configuration
  const steps = [
  { id: 'select', label: 'Select Students', icon: Users },
  { id: 'validate', label: 'Validate Data', icon: Shield },
  { id: 'review', label: 'Review Amounts', icon: Eye },
  { id: 'generate', label: 'Generate File', icon: FileSpreadsheet },
  { id: 'confirm', label: 'Confirm & Post', icon: CheckCircle }];


  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-green-600" />
            Bulk Scholarship Disbursement
          </h1>
          <p className="text-gray-500 mt-1">
            Generate bank transfer files and post disbursement entries to General Ledger
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
            <History className="w-4 h-4 mr-2" />
            Batch History
          </Button>
          <Button variant="outline" onClick={() => setShowLedgerModal(true)}>
            <FileText className="w-4 h-4 mr-2" />
            View Ledger
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <button
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (isCompleted || isActive) setCurrentStep(step.id as DisbursementStep);
                  }}>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive ?
                    'bg-green-600 text-white shadow-lg' :
                    isCompleted ?
                    'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'}`
                    }>

                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                    isActive ? 'text-green-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`
                    }>

                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 &&
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`
                  } />

                }
              </React.Fragment>);

          })}
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Valid for DBT</p>
              <p className="text-2xl font-bold text-green-900">{stats.validCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Invalid Data</p>
              <p className="text-2xl font-bold text-red-900">{stats.invalidCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Sanctioned</p>
              <p className="text-2xl font-bold text-purple-900">
                ₹{(stats.totalSanctioned / 1000).toFixed(0)}K
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Pending Amount</p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{(stats.totalPending / 1000).toFixed(0)}K
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Selected Amount</p>
              <p className="text-2xl font-bold text-emerald-900">
                ₹{stats.totalSelected.toLocaleString()}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </h3>

            <div className="space-y-4">
              <Select
                label="Scholarship Scheme"
                options={[
                { value: 'all', label: 'All Schemes' },
                ...schemes.map((s) => ({ value: s.id, label: s.name }))]
                }
                value={config.scheme}
                onChange={(e) => setConfig({ ...config, scheme: e.target.value })} />


              <Select
                label="Class"
                options={[
                { value: 'all', label: 'All Classes' },
                { value: '8', label: 'Class 8' },
                { value: '9', label: 'Class 9' },
                { value: '10', label: 'Class 10' },
                { value: '11', label: 'Class 11' },
                { value: '12', label: 'Class 12' }]
                }
                value={config.class}
                onChange={(e) => setConfig({ ...config, class: e.target.value })} />


              <Select
                label="Category"
                options={[
                { value: 'all', label: 'All Categories' },
                { value: 'General', label: 'General' },
                { value: 'OBC', label: 'OBC' },
                { value: 'SC', label: 'SC' },
                { value: 'ST', label: 'ST' },
                { value: 'Other', label: 'Other' }]
                }
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })} />


              <div className="pt-4 border-t">
                <Select
                  label="Bank File Format"
                  options={bankFormats.map((f) => ({ value: f.id, label: f.name }))}
                  value={config.bankFormat}
                  onChange={(e) => setConfig({ ...config, bankFormat: e.target.value })} />

                <p className="text-xs text-gray-500 mt-1">
                  {bankFormats.find((f) => f.id === config.bankFormat)?.description}
                </p>
              </div>

              <Input
                label="Disbursement Date"
                type="date"
                value={config.disbursementDate}
                onChange={(e) => setConfig({ ...config, disbursementDate: e.target.value })} />


              <Button variant="outline" className="w-full" onClick={resetFilters}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </Card>

          {/* General Ledger Settings */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              General Ledger
            </h3>

            <div className="space-y-3 text-sm">
              <div>
                <label className="text-xs text-blue-600 font-medium">Debit Account</label>
                <p className="font-medium text-blue-900">{config.debitAccount}</p>
              </div>
              <div>
                <label className="text-xs text-blue-600 font-medium">Credit Account</label>
                <p className="font-medium text-blue-900">{config.creditAccount}</p>
              </div>
              <div>
                <label className="text-xs text-blue-600 font-medium">Narration</label>
                <Input
                  value={config.narration}
                  onChange={(e) => setConfig({ ...config, narration: e.target.value })}
                  className="mt-1" />

              </div>
            </div>
          </Card>

          {/* Process Info */}
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Process Guide
            </h4>
            <ul className="text-xs text-green-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                Select students with valid bank details
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                Verify all data is validated for DBT
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                Review and adjust amounts if needed
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                Generate bank transfer file
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                Confirm to post to General Ledger
              </li>
            </ul>
          </Card>
        </div>

        {/* Right Panel - Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search */}
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by student name, GR No, or scheme..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              {selectedIds.length > 0 &&
              <Badge variant="info" className="px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {selectedIds.length} Selected
                </Badge>
              }
            </div>
          </Card>

          {/* Step Content */}
          {currentStep === 'select' &&
          <Card className="overflow-hidden">
              {/* Table Header */}
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    className="rounded w-5 h-5"
                    checked={
                    filteredDisbursements.filter((d) => d.validationStatus === 'Valid').length > 0 &&
                    selectedIds.length === filteredDisbursements.filter((d) => d.validationStatus === 'Valid').length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)} />

                    <span className="text-sm font-medium">Select All Valid</span>
                  </label>
                </div>
                <span className="text-sm text-gray-500">
                  Eligible: {filteredDisbursements.filter((d) => d.validationStatus === 'Valid').length} students
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left w-12"></th>
                      <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Student</th>
                      <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Scheme</th>
                      <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Bank Details</th>
                      <th className="p-3 text-right text-xs font-bold text-gray-600 uppercase">Amount</th>
                      <th className="p-3 text-center text-xs font-bold text-gray-600 uppercase">Validation</th>
                      <th className="p-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredDisbursements.map((d) => {
                    const isSelected = selectedIds.includes(d.id);
                    const isDisabled = d.validationStatus !== 'Valid' || d.status !== 'Sanctioned';

                    return (
                      <tr
                        key={d.id}
                        className={`transition-colors ${
                        isSelected ? 'bg-green-50' : isDisabled ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`
                        }>

                          <td className="p-3">
                            <input
                            type="checkbox"
                            className="rounded w-5 h-5"
                            checked={isSelected}
                            onChange={() => handleSelectRow(d.id)}
                            disabled={isDisabled} />

                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                              src={d.student.photo}
                              alt=""
                              className="w-10 h-10 rounded-full" />

                              <div>
                                <p className="font-bold text-gray-900">{d.student.name}</p>
                                <p className="text-xs text-gray-500">
                                  {d.student.grNo} | Class {d.student.class}-{d.student.section}
                                </p>
                                <div className="flex gap-1 mt-1">
                                  {d.student.isRTE &&
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[9px] rounded font-medium">
                                      RTE
                                    </span>
                                }
                                  {d.student.isEWS &&
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] rounded font-medium">
                                      EWS
                                    </span>
                                }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-medium text-blue-600">{d.schemeName}</p>
                            <p className="text-xs text-gray-500">{d.schemeCategory}</p>
                          </td>
                          <td className="p-3">
                            {d.bankDetails.accountNumber ?
                          <div className="text-sm">
                                <p className="font-medium text-gray-700">{d.bankDetails.bankName}</p>
                                <p className="text-xs text-gray-500 font-mono">
                                  A/C: {d.bankDetails.accountNumber.slice(-4).padStart(d.bankDetails.accountNumber.length, '*')}
                                </p>
                                <p className="text-xs text-gray-400">IFSC: {d.bankDetails.ifscCode}</p>
                                {d.bankDetails.isAadharLinked &&
                            <span className="text-xs text-green-600 flex items-center gap-1 mt-1">
                                    <Check className="w-3 h-3" /> Aadhar Linked
                                  </span>
                            }
                              </div> :

                          <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-2 rounded">
                                <AlertTriangle className="w-4 h-4" />
                                <div>
                                  <p>Missing Bank Data</p>
                                  <p className="font-normal text-red-500">Update required</p>
                                </div>
                              </div>
                          }
                          </td>
                          <td className="p-3 text-right">
                            <div className="space-y-1">
                              <p className="font-bold text-gray-900">
                                ₹{d.currentDisbursement.toLocaleString()}
                              </p>
                              {d.previousDisbursed > 0 &&
                            <p className="text-xs text-gray-500">
                                  Prev: ₹{d.previousDisbursed.toLocaleString()}
                                </p>
                            }
                              <p className="text-xs text-gray-400">
                                of ₹{d.sanctionedAmount.toLocaleString()}
                              </p>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {getValidationBadge(d.validationStatus)}
                            {d.validationErrors.length > 0 &&
                          <button
                            className="text-xs text-red-600 underline mt-1 block mx-auto"
                            onClick={() => {
                              setSelectedDisbursement(d);
                              setShowPreviewModal(true);
                            }}>

                                {d.validationErrors.length} issue(s)
                              </button>
                          }
                          </td>
                          <td className="p-3 text-center">
                            {getStatusBadge(d.status)}
                          </td>
                        </tr>);

                  })}
                  </tbody>
                </table>
              </div>

              {filteredDisbursements.length === 0 &&
            <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No students found matching your criteria</p>
                </div>
            }

              {/* Footer */}
              <div className="p-4 bg-gray-900 text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <Landmark className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase">Total Selected Amount</p>
                    <p className="text-2xl font-bold">₹{stats.totalSelected.toLocaleString()}</p>
                  </div>
                </div>
                <Button
                variant="primary"
                size="lg"
                className="bg-green-600 hover:bg-green-500"
                onClick={() => setCurrentStep('validate')}
                disabled={selectedIds.length === 0}>

                  Continue to Validate
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          }

          {currentStep === 'validate' &&
          <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Data Validation</h2>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-900">{stats.validCount}</p>
                    <p className="text-sm text-green-600">Valid Records</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-xl text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-900">{stats.pendingVerification}</p>
                    <p className="text-sm text-yellow-600">Pending Verification</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl text-center">
                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-900">{stats.invalidCount}</p>
                    <p className="text-sm text-red-600">Invalid Records</p>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-700">Validation Checklist</h3>
                  {[
                { label: 'All bank account numbers verified', status: stats.validCount === stats.selectedCount },
                { label: 'IFSC codes validated', status: stats.validCount === stats.selectedCount },
                { label: 'Aadhar linking confirmed for DBT', status: stats.pendingVerification === 0 },
                { label: 'No duplicate entries', status: true },
                { label: 'Amount within sanctioned limit', status: true }].
                map((item, index) =>
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.status ? 'bg-green-50' : 'bg-yellow-50'}`
                  }>

                      {item.status ?
                  <CheckCircle className="w-5 h-5 text-green-600" /> :

                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  }
                      <span className={item.status ? 'text-green-800' : 'text-yellow-800'}>
                        {item.label}
                      </span>
                    </div>
                )}
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('select')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep('review')}>
                  Continue to Review
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {currentStep === 'review' &&
          <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Adjust Amounts</h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Student</th>
                        <th className="p-3 text-left text-xs font-bold text-gray-600 uppercase">Scheme</th>
                        <th className="p-3 text-right text-xs font-bold text-gray-600 uppercase">Sanctioned</th>
                        <th className="p-3 text-right text-xs font-bold text-gray-600 uppercase">Previous</th>
                        <th className="p-3 text-center text-xs font-bold text-gray-600 uppercase w-36">Current Disbursement</th>
                        <th className="p-3 text-right text-xs font-bold text-gray-600 uppercase">Balance After</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredDisbursements.
                    filter((d) => selectedIds.includes(d.id)).
                    map((d) => {
                      const amount = disbursementAmounts[d.id] !== undefined ? disbursementAmounts[d.id] : d.currentDisbursement;
                      const balanceAfter = d.pendingAmount - amount;

                      return (
                        <tr key={d.id}>
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img src={d.student.photo} alt="" className="w-8 h-8 rounded-full" />
                                  <div>
                                    <p className="font-medium">{d.student.name}</p>
                                    <p className="text-xs text-gray-500">{d.student.grNo}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-blue-600">{d.schemeName}</td>
                              <td className="p-3 text-right">₹{d.sanctionedAmount.toLocaleString()}</td>
                              <td className="p-3 text-right text-gray-500">₹{d.previousDisbursed.toLocaleString()}</td>
                              <td className="p-3">
                                <Input
                              type="number"
                              className="text-center font-bold"
                              value={amount}
                              onChange={(e) => updateDisbursementAmount(d.id, parseFloat(e.target.value) || 0)}
                              max={d.pendingAmount} />

                              </td>
                              <td className={`p-3 text-right font-medium ${balanceAfter === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                ₹{balanceAfter.toLocaleString()}
                              </td>
                            </tr>);

                    })}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr>
                        <td colSpan={4} className="p-3 text-right font-bold">Total Disbursement:</td>
                        <td className="p-3 text-center text-xl font-black text-green-600">
                          ₹{stats.totalSelected.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('validate')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep('generate')}>
                  Continue to Generate File
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          }

          {currentStep === 'generate' &&
          <div className="space-y-4">
              <Card className="p-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileSpreadsheet className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Generate Bank Transfer File</h2>
                  <p className="text-gray-500 mt-2">
                    File will be generated in {bankFormats.find((f) => f.id === config.bankFormat)?.name} format
                  </p>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-blue-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-900">{selectedIds.length}</p>
                    <p className="text-sm text-blue-600">Students</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-900">₹{stats.totalSelected.toLocaleString()}</p>
                    <p className="text-sm text-green-600">Total Amount</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl text-center">
                    <p className="text-3xl font-bold text-purple-900">{config.disbursementDate}</p>
                    <p className="text-sm text-purple-600">Disbursement Date</p>
                  </div>
                </div>

                {/* Bank Format Info */}
                <div className="p-4 bg-gray-50 rounded-xl mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">File Format Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Format:</span>{' '}
                      <span className="font-medium">{bankFormats.find((f) => f.id === config.bankFormat)?.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Extension:</span>{' '}
                      <span className="font-medium">{bankFormats.find((f) => f.id === config.bankFormat)?.extension}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Description:</span>{' '}
                      <span className="font-medium">{bankFormats.find((f) => f.id === config.bankFormat)?.description}</span>
                    </div>
                  </div>
                </div>

                {/* Ledger Entry Preview */}
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Landmark className="w-4 h-4" />
                    General Ledger Entry Preview
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-blue-600">
                        <th className="pb-2">Account</th>
                        <th className="pb-2 text-right">Debit</th>
                        <th className="pb-2 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-blue-200">
                        <td className="py-2 font-medium">{config.debitAccount}</td>
                        <td className="py-2 text-right font-bold text-green-700">₹{stats.totalSelected.toLocaleString()}</td>
                        <td className="py-2 text-right">-</td>
                      </tr>
                      <tr className="border-t border-blue-200">
                        <td className="py-2 font-medium">{config.creditAccount}</td>
                        <td className="py-2 text-right">-</td>
                        <td className="py-2 text-right font-bold text-blue-700">₹{stats.totalSelected.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-blue-600 mt-2">
                    <strong>Narration:</strong> {config.narration}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button
                  variant="primary"
                  size="lg"
                  className="bg-green-600 hover:bg-green-500 px-12"
                  onClick={generateBankFile}
                  disabled={isProcessing}>

                    {isProcessing ?
                  <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Generating File...
                      </> :

                  <>
                        <Download className="w-5 h-5 mr-2" />
                        Generate Bank File
                      </>
                  }
                  </Button>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('review')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          }

          {currentStep === 'confirm' && generatedFile &&
          <div className="space-y-4">
              <Card className="p-6">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">File Generated Successfully!</h2>
                  <p className="text-gray-500 mt-2">
                    Download the file and confirm disbursement to post to General Ledger
                  </p>
                </div>

                {/* Generated File */}
                <div className="p-4 bg-green-50 rounded-xl border border-green-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-bold text-green-900">{generatedFile}</p>
                        <p className="text-sm text-green-600">
                          {selectedIds.length} records | ₹{stats.totalSelected.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={downloadFile}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* Confirmation Warning */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800">Before confirming disbursement:</p>
                      <ul className="text-sm text-amber-700 mt-2 space-y-1">
                        <li>• Download and save the bank transfer file</li>
                        <li>• Upload the file to your corporate banking portal</li>
                        <li>• Verify all transactions are processed successfully</li>
                        <li>• Then confirm below to post ledger entry</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="lg">
                    <Printer className="w-4 h-4 mr-2" />
                    Print Summary
                  </Button>
                  <Button
                  variant="primary"
                  size="lg"
                  className="bg-green-600 hover:bg-green-500 px-8"
                  onClick={confirmDisbursement}
                  disabled={isProcessing}>

                    {isProcessing ?
                  <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </> :

                  <>
                        <Check className="w-5 h-5 mr-2" />
                        Confirm Disbursement & Post to Ledger
                      </>
                  }
                  </Button>
                </div>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('generate')}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </div>
          }
        </div>
      </div>

      {/* Batch History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Disbursement Batch History</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Batch No</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Scheme</th>
                      <th className="p-3 text-center">Students</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {batchHistory.map((batch) =>
                  <tr key={batch.id}>
                        <td className="p-3 font-mono font-medium">{batch.batchNo}</td>
                        <td className="p-3">
                          <div>{batch.date}</div>
                          <div className="text-xs text-gray-500">{batch.time}</div>
                        </td>
                        <td className="p-3">{batch.scheme}</td>
                        <td className="p-3 text-center">
                          <span className="text-green-600">{batch.successCount}</span>
                          {batch.failedCount > 0 &&
                      <span className="text-red-600"> / {batch.failedCount}</span>
                      }
                        </td>
                        <td className="p-3 text-right font-bold">₹{batch.totalAmount.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <Badge
                        variant={
                        batch.status === 'Completed' ?
                        'success' :
                        batch.status === 'Partial' ?
                        'warning' :
                        'danger'
                        }>

                            {batch.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Ledger Modal */}
      {showLedgerModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5" />
                  General Ledger Entries
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowLedgerModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Voucher No</th>
                      <th className="p-3 text-left">Description</th>
                      <th className="p-3 text-left">Debit A/C</th>
                      <th className="p-3 text-left">Credit A/C</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ledgerEntries.map((entry) =>
                  <tr key={entry.id}>
                        <td className="p-3">{entry.date}</td>
                        <td className="p-3 font-mono">{entry.voucherNo}</td>
                        <td className="p-3 max-w-xs truncate">{entry.description}</td>
                        <td className="p-3">{entry.debitAccount}</td>
                        <td className="p-3">{entry.creditAccount}</td>
                        <td className="p-3 text-right font-bold">₹{entry.amount.toLocaleString()}</td>
                        <td className="p-3 text-center">
                          <Badge variant={entry.status === 'Posted' ? 'success' : 'warning'}>
                            {entry.status}
                          </Badge>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Bulk Disbursement Process:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>Only students with valid and verified bank details can be selected for DBT</li>
              <li>Bank account must be linked with Aadhar for Direct Benefit Transfer</li>
              <li>Generated files are compatible with respective bank's corporate banking portal</li>
              <li>All disbursements are posted to General Ledger for accounting</li>
              <li>Batch history is maintained for audit and reconciliation purposes</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}