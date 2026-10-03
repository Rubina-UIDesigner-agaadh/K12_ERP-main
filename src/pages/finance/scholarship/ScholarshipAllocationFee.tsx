import React, { useMemo, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Table } from '../../../components/ui/Table';
import {
  Search,
  Calculator,
  ArrowRightLeft,
  Wallet,
  Receipt,
  UserCheck,
  AlertCircle,
  Save,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  X,
  Eye,
  Info,
  ChevronRight,
  ChevronLeft,
  Users,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Zap,
  History,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  MoreVertical,
  Undo2,
  Play,
  Pause,
  Settings,
  HelpCircle,
  ArrowRight,
  Percent,
  CreditCard,
  PiggyBank,
  BarChart3,
  Award,
  GraduationCap,
  Building,
  Calendar,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Check } from
'lucide-react';

// Types
interface Student {
  id: string;
  grNo: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  fatherName: string;
  photo: string;
  category: string;
  isRTE: boolean;
  isEWS: boolean;
}

interface ScholarshipWallet {
  studentId: string;
  schemeId: string;
  schemeName: string;
  schemeType: string;
  totalSanctioned: number;
  totalDisbursed: number;
  totalAllocated: number;
  availableBalance: number;
  expiryDate: string;
  status: 'Active' | 'Exhausted' | 'Expired' | 'On Hold';
}

interface FeeHead {
  id: string;
  name: string;
  amount: number;
  paid: number;
  due: number;
  scholarshipApplied: number;
  isScholarshipApplicable: boolean;
}

interface StudentAllocation {
  student: Student;
  scholarshipWallets: ScholarshipWallet[];
  feeHeads: FeeHead[];
  totalScholarshipAvailable: number;
  totalFeeDue: number;
  proposedAllocation: number;
  allocationBreakdown: {
    walletId: string;
    feeHeadId: string;
    amount: number;
  }[];
  allocationStatus: 'Not Allocated' | 'Partial' | 'Fully Allocated' | 'Over Allocated';
}

interface AllocationHistory {
  id: string;
  date: string;
  time: string;
  studentId: string;
  studentName: string;
  schemeId: string;
  schemeName: string;
  feeHeadId: string;
  feeHeadName: string;
  amount: number;
  allocatedBy: string;
  transactionRef: string;
  status: 'Completed' | 'Pending' | 'Reversed';
}

type AllocationMode = 'manual' | 'smart' | 'bulk' | 'percentage';
type AllocationStep = 'select' | 'configure' | 'review' | 'confirm';

export function ScholarshipAllocationFee() {
  // State Management
  const [currentStep, setCurrentStep] = useState<AllocationStep>('select');
  const [allocationMode, setAllocationMode] = useState<AllocationMode>('smart');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    scheme: 'all',
    feeHead: 'all',
    class: 'all',
    section: 'all',
    category: 'all',
    status: 'all',
    hasBalance: 'all'
  });

  // Allocation Settings
  const [allocationSettings, setAllocationSettings] = useState({
    selectedScheme: 'all',
    selectedFeeHead: 'all',
    percentageAllocation: 100,
    priorityOrder: 'fee_due', // fee_due, scholarship_expiry, class_wise
    maxAllocationPerStudent: 0, // 0 means no limit
    minAllocationAmount: 100,
    autoAdjustExcess: true
  });

  // Allocations state
  const [allocations, setAllocations] = useState<Record<string, {
    walletAllocations: Record<string, number>;
    feeHeadAllocations: Record<string, number>;
    totalAllocation: number;
    isLocked: boolean;
  }>>({});

  // Mock Students Data
  const students: Student[] = [
  {
    id: 'STU001',
    grNo: 'GR001',
    admissionNo: 'ADM-2024-001',
    name: 'Aarav Sharma',
    class: '10',
    section: 'A',
    rollNumber: '15',
    fatherName: 'Rajesh Sharma',
    photo: 'https://ui-avatars.com/api/?name=Aarav+Sharma&background=0D8ABC&color=fff',
    category: 'General',
    isRTE: false,
    isEWS: true
  },
  {
    id: 'STU002',
    grNo: 'GR002',
    admissionNo: 'ADM-2024-002',
    name: 'Priya Patel',
    class: '9',
    section: 'B',
    rollNumber: '08',
    fatherName: 'Mahesh Patel',
    photo: 'https://ui-avatars.com/api/?name=Priya+Patel&background=6366f1&color=fff',
    category: 'OBC',
    isRTE: false,
    isEWS: true
  },
  {
    id: 'STU003',
    grNo: 'GR003',
    admissionNo: 'ADM-2024-005',
    name: 'Rohan Kumar',
    class: '11',
    section: 'A',
    rollNumber: '12',
    fatherName: 'Vijay Kumar',
    photo: 'https://ui-avatars.com/api/?name=Rohan+Kumar&background=10b981&color=fff',
    category: 'SC',
    isRTE: true,
    isEWS: false
  },
  {
    id: 'STU004',
    grNo: 'GR004',
    admissionNo: 'ADM-2024-008',
    name: 'Ananya Singh',
    class: '8',
    section: 'A',
    rollNumber: '05',
    fatherName: 'Late Rakesh Singh',
    photo: 'https://ui-avatars.com/api/?name=Ananya+Singh&background=f59e0b&color=fff',
    category: 'General',
    isRTE: false,
    isEWS: true
  },
  {
    id: 'STU005',
    grNo: 'GR005',
    admissionNo: 'ADM-2024-012',
    name: 'Mohammed Imran',
    class: '10',
    section: 'B',
    rollNumber: '22',
    fatherName: 'Abdul Karim',
    photo: 'https://ui-avatars.com/api/?name=Mohammed+Imran&background=ef4444&color=fff',
    category: 'Other',
    isRTE: true,
    isEWS: true
  },
  {
    id: 'STU006',
    grNo: 'GR006',
    admissionNo: 'ADM-2024-015',
    name: 'Sneha Desai',
    class: '12',
    section: 'A',
    rollNumber: '03',
    fatherName: 'Hitesh Desai',
    photo: 'https://ui-avatars.com/api/?name=Sneha+Desai&background=8b5cf6&color=fff',
    category: 'General',
    isRTE: false,
    isEWS: false
  }];


  // Mock Scholarship Wallets
  const scholarshipWallets: ScholarshipWallet[] = [
  { studentId: 'STU001', schemeId: 'SCH001', schemeName: 'Merit Scholarship', schemeType: 'Merit', totalSanctioned: 25000, totalDisbursed: 25000, totalAllocated: 0, availableBalance: 25000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU001', schemeId: 'SCH002', schemeName: 'EWS Fee Waiver', schemeType: 'EWS', totalSanctioned: 15000, totalDisbursed: 15000, totalAllocated: 5000, availableBalance: 10000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU002', schemeId: 'SCH002', schemeName: 'EWS Fee Waiver', schemeType: 'EWS', totalSanctioned: 15000, totalDisbursed: 15000, totalAllocated: 0, availableBalance: 15000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU003', schemeId: 'SCH003', schemeName: 'RTE Reimbursement', schemeType: 'RTE', totalSanctioned: 50000, totalDisbursed: 50000, totalAllocated: 30000, availableBalance: 20000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU003', schemeId: 'SCH004', schemeName: 'SC/ST Scholarship', schemeType: 'SC/ST', totalSanctioned: 20000, totalDisbursed: 20000, totalAllocated: 0, availableBalance: 20000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU004', schemeId: 'SCH005', schemeName: 'Single Parent Support', schemeType: 'Need-based', totalSanctioned: 12000, totalDisbursed: 12000, totalAllocated: 4000, availableBalance: 8000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU005', schemeId: 'SCH003', schemeName: 'RTE Reimbursement', schemeType: 'RTE', totalSanctioned: 50000, totalDisbursed: 50000, totalAllocated: 35000, availableBalance: 15000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU005', schemeId: 'SCH006', schemeName: 'Minority Scholarship', schemeType: 'Minority', totalSanctioned: 20000, totalDisbursed: 20000, totalAllocated: 0, availableBalance: 20000, expiryDate: '2025-03-31', status: 'Active' },
  { studentId: 'STU006', schemeId: 'SCH001', schemeName: 'Merit Scholarship', schemeType: 'Merit', totalSanctioned: 30000, totalDisbursed: 30000, totalAllocated: 15000, availableBalance: 15000, expiryDate: '2025-03-31', status: 'Active' }];


  // Mock Fee Heads
  const feeHeadsData: Record<string, FeeHead[]> = {
    'STU001': [
    { id: 'FH001', name: 'Tuition Fee', amount: 50000, paid: 15000, due: 35000, scholarshipApplied: 0, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Computer Fee', amount: 5000, paid: 0, due: 5000, scholarshipApplied: 0, isScholarshipApplicable: true },
    { id: 'FH003', name: 'Library Fee', amount: 2000, paid: 0, due: 2000, scholarshipApplied: 0, isScholarshipApplicable: true }],

    'STU002': [
    { id: 'FH001', name: 'Tuition Fee', amount: 45000, paid: 33000, due: 12000, scholarshipApplied: 0, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Lab Fee', amount: 3000, paid: 0, due: 3000, scholarshipApplied: 0, isScholarshipApplicable: true }],

    'STU003': [
    { id: 'FH001', name: 'Tuition Fee', amount: 55000, paid: 10000, due: 45000, scholarshipApplied: 30000, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Activity Fee', amount: 4000, paid: 0, due: 4000, scholarshipApplied: 0, isScholarshipApplicable: true }],

    'STU004': [
    { id: 'FH001', name: 'Tuition Fee', amount: 40000, paid: 32000, due: 8000, scholarshipApplied: 4000, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Sports Fee', amount: 2000, paid: 0, due: 2000, scholarshipApplied: 0, isScholarshipApplicable: true }],

    'STU005': [
    { id: 'FH001', name: 'Tuition Fee', amount: 50000, paid: 0, due: 50000, scholarshipApplied: 35000, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Exam Fee', amount: 3000, paid: 0, due: 3000, scholarshipApplied: 0, isScholarshipApplicable: true }],

    'STU006': [
    { id: 'FH001', name: 'Tuition Fee', amount: 60000, paid: 30000, due: 30000, scholarshipApplied: 15000, isScholarshipApplicable: true },
    { id: 'FH002', name: 'Lab Fee', amount: 5000, paid: 0, due: 5000, scholarshipApplied: 0, isScholarshipApplicable: true }]

  };

  // Mock Allocation History
  const allocationHistory: AllocationHistory[] = [
  { id: 'ALC001', date: '2024-03-15', time: '10:30 AM', studentId: 'STU003', studentName: 'Rohan Kumar', schemeId: 'SCH003', schemeName: 'RTE Reimbursement', feeHeadId: 'FH001', feeHeadName: 'Tuition Fee', amount: 30000, allocatedBy: 'Mr. Rajesh Kumar', transactionRef: 'TXN-2024-0125', status: 'Completed' },
  { id: 'ALC002', date: '2024-03-14', time: '02:15 PM', studentId: 'STU005', studentName: 'Mohammed Imran', schemeId: 'SCH003', schemeName: 'RTE Reimbursement', feeHeadId: 'FH001', feeHeadName: 'Tuition Fee', amount: 35000, allocatedBy: 'Mr. Rajesh Kumar', transactionRef: 'TXN-2024-0124', status: 'Completed' },
  { id: 'ALC003', date: '2024-03-14', time: '11:00 AM', studentId: 'STU006', studentName: 'Sneha Desai', schemeId: 'SCH001', schemeName: 'Merit Scholarship', feeHeadId: 'FH001', feeHeadName: 'Tuition Fee', amount: 15000, allocatedBy: 'Ms. Priya Singh', transactionRef: 'TXN-2024-0123', status: 'Completed' },
  { id: 'ALC004', date: '2024-03-13', time: '04:30 PM', studentId: 'STU001', studentName: 'Aarav Sharma', schemeId: 'SCH002', schemeName: 'EWS Fee Waiver', feeHeadId: 'FH001', feeHeadName: 'Tuition Fee', amount: 5000, allocatedBy: 'Mr. Rajesh Kumar', transactionRef: 'TXN-2024-0122', status: 'Completed' },
  { id: 'ALC005', date: '2024-03-12', time: '09:45 AM', studentId: 'STU004', studentName: 'Ananya Singh', schemeId: 'SCH005', schemeName: 'Single Parent Support', feeHeadId: 'FH001', feeHeadName: 'Tuition Fee', amount: 4000, allocatedBy: 'Ms. Priya Singh', transactionRef: 'TXN-2024-0121', status: 'Completed' }];


  // Scholarship Schemes List
  const schemes = [
  { id: 'SCH001', name: 'Merit Scholarship', type: 'Merit' },
  { id: 'SCH002', name: 'EWS Fee Waiver', type: 'EWS' },
  { id: 'SCH003', name: 'RTE Reimbursement', type: 'RTE' },
  { id: 'SCH004', name: 'SC/ST Scholarship', type: 'SC/ST' },
  { id: 'SCH005', name: 'Single Parent Support', type: 'Need-based' },
  { id: 'SCH006', name: 'Minority Scholarship', type: 'Minority' }];


  // Fee Heads List
  const feeHeads = [
  { id: 'FH001', name: 'Tuition Fee' },
  { id: 'FH002', name: 'Computer Fee' },
  { id: 'FH003', name: 'Library Fee' },
  { id: 'FH004', name: 'Lab Fee' },
  { id: 'FH005', name: 'Activity Fee' },
  { id: 'FH006', name: 'Sports Fee' },
  { id: 'FH007', name: 'Exam Fee' }];


  // Build Student Allocation Data
  const studentAllocations: StudentAllocation[] = useMemo(() => {
    return students.map((student) => {
      const wallets = scholarshipWallets.filter((w) => w.studentId === student.id && w.status === 'Active');
      const fees = feeHeadsData[student.id] || [];
      const totalScholarship = wallets.reduce((sum, w) => sum + w.availableBalance, 0);
      const totalFee = fees.reduce((sum, f) => sum + f.due - f.scholarshipApplied, 0);
      const currentAllocation = allocations[student.id]?.totalAllocation || 0;

      let status: StudentAllocation['allocationStatus'] = 'Not Allocated';
      if (currentAllocation > 0) {
        const netFeeDue = totalFee - currentAllocation;
        if (netFeeDue <= 0) status = 'Fully Allocated';else
        if (currentAllocation > totalScholarship) status = 'Over Allocated';else
        status = 'Partial';
      }

      return {
        student,
        scholarshipWallets: wallets,
        feeHeads: fees,
        totalScholarshipAvailable: totalScholarship,
        totalFeeDue: totalFee,
        proposedAllocation: currentAllocation,
        allocationBreakdown: [],
        allocationStatus: status
      };
    });
  }, [students, scholarshipWallets, allocations]);

  // Filter student allocations
  const filteredAllocations = useMemo(() => {
    return studentAllocations.filter((sa) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
      sa.student.name.toLowerCase().includes(searchLower) ||
      sa.student.grNo.toLowerCase().includes(searchLower) ||
      sa.student.admissionNo.toLowerCase().includes(searchLower);

      // Class filter
      const matchesClass = filters.class === 'all' || sa.student.class === filters.class;

      // Section filter
      const matchesSection = filters.section === 'all' || sa.student.section === filters.section;

      // Category filter
      const matchesCategory = filters.category === 'all' || sa.student.category === filters.category;

      // Has balance filter
      let matchesBalance = true;
      if (filters.hasBalance === 'yes') {
        matchesBalance = sa.totalScholarshipAvailable > 0;
      } else if (filters.hasBalance === 'no') {
        matchesBalance = sa.totalScholarshipAvailable === 0;
      }

      // Scheme filter
      let matchesScheme = true;
      if (filters.scheme !== 'all') {
        matchesScheme = sa.scholarshipWallets.some((w) => w.schemeId === filters.scheme);
      }

      return matchesSearch && matchesClass && matchesSection && matchesCategory && matchesBalance && matchesScheme;
    });
  }, [studentAllocations, searchTerm, filters]);

  // Statistics
  const stats = useMemo(() => {
    const totalStudents = filteredAllocations.length;
    const studentsWithBalance = filteredAllocations.filter((sa) => sa.totalScholarshipAvailable > 0).length;
    const totalAvailableScholarship = filteredAllocations.reduce((sum, sa) => sum + sa.totalScholarshipAvailable, 0);
    const totalFeeDue = filteredAllocations.reduce((sum, sa) => sum + sa.totalFeeDue, 0);
    const totalProposedAllocation = filteredAllocations.reduce((sum, sa) => sum + sa.proposedAllocation, 0);
    const fullyAllocated = filteredAllocations.filter((sa) => sa.allocationStatus === 'Fully Allocated').length;
    const partiallyAllocated = filteredAllocations.filter((sa) => sa.allocationStatus === 'Partial').length;

    return {
      totalStudents,
      studentsWithBalance,
      totalAvailableScholarship,
      totalFeeDue,
      totalProposedAllocation,
      fullyAllocated,
      partiallyAllocated,
      selectedCount: selectedStudentIds.length,
      canAllocate: Math.min(totalAvailableScholarship, totalFeeDue)
    };
  }, [filteredAllocations, selectedStudentIds]);

  // Smart Auto-Allocate Function
  const handleSmartAutoAllocate = () => {
    const newAllocations: typeof allocations = {};

    const studentsToProcess = selectedStudentIds.length > 0 ?
    filteredAllocations.filter((sa) => selectedStudentIds.includes(sa.student.id)) :
    filteredAllocations;

    studentsToProcess.forEach((sa) => {
      const maxAllocation = Math.min(sa.totalScholarshipAvailable, sa.totalFeeDue);
      const adjustedAllocation = allocationSettings.percentageAllocation < 100 ?
      Math.round(maxAllocation * (allocationSettings.percentageAllocation / 100)) :
      maxAllocation;

      if (adjustedAllocation >= allocationSettings.minAllocationAmount) {
        newAllocations[sa.student.id] = {
          walletAllocations: {},
          feeHeadAllocations: {},
          totalAllocation: adjustedAllocation,
          isLocked: false
        };

        // Distribute across wallets
        let remaining = adjustedAllocation;
        sa.scholarshipWallets.forEach((wallet) => {
          if (remaining > 0) {
            const walletAllocation = Math.min(remaining, wallet.availableBalance);
            newAllocations[sa.student.id].walletAllocations[wallet.schemeId] = walletAllocation;
            remaining -= walletAllocation;
          }
        });

        // Distribute across fee heads
        remaining = adjustedAllocation;
        sa.feeHeads.filter((fh) => fh.isScholarshipApplicable).forEach((feeHead) => {
          if (remaining > 0) {
            const feeHeadDue = feeHead.due - feeHead.scholarshipApplied;
            const feeAllocation = Math.min(remaining, feeHeadDue);
            newAllocations[sa.student.id].feeHeadAllocations[feeHead.id] = feeAllocation;
            remaining -= feeAllocation;
          }
        });
      }
    });

    setAllocations(newAllocations);
  };

  // Manual allocation update
  const updateManualAllocation = (studentId: string, amount: number) => {
    const sa = studentAllocations.find((s) => s.student.id === studentId);
    if (!sa) return;

    const maxAmount = Math.min(sa.totalScholarshipAvailable, sa.totalFeeDue);
    const validAmount = Math.min(Math.max(0, amount), maxAmount);

    setAllocations((prev) => ({
      ...prev,
      [studentId]: {
        walletAllocations: {},
        feeHeadAllocations: {},
        totalAllocation: validAmount,
        isLocked: prev[studentId]?.isLocked || false
      }
    }));
  };

  // Toggle lock allocation
  const toggleLockAllocation = (studentId: string) => {
    setAllocations((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        isLocked: !prev[studentId]?.isLocked
      }
    }));
  };

  // Clear all allocations
  const clearAllAllocations = () => {
    if (confirm('Are you sure you want to clear all allocations?')) {
      setAllocations({});
    }
  };

  // Select all students
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredAllocations.map((sa) => sa.student.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
    prev.includes(studentId) ?
    prev.filter((id) => id !== studentId) :
    [...prev, studentId]
    );
  };

  // Commit allocations to ledger
  const commitToLedger = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully allocated ₹${stats.totalProposedAllocation.toLocaleString()} across ${Object.keys(allocations).length} student(s)!`);
      setAllocations({});
      setSelectedStudentIds([]);
    }, 2000);
  };

  // Export allocations
  const exportAllocations = () => {
    alert('Exporting allocation report...');
  };

  // Get status badge
  const getStatusBadge = (status: StudentAllocation['allocationStatus']) => {
    switch (status) {
      case 'Fully Allocated':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Fully Allocated
          </Badge>);

      case 'Partial':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Partial
          </Badge>);

      case 'Over Allocated':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Over Allocated
          </Badge>);

      default:
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Not Allocated
          </Badge>);

    }
  };

  // Steps configuration
  const steps = [
  { id: 'select', label: 'Select Students', icon: Users },
  { id: 'configure', label: 'Configure Allocation', icon: Settings },
  { id: 'review', label: 'Review & Adjust', icon: Eye },
  { id: 'confirm', label: 'Confirm & Commit', icon: CheckCircle }];


  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ArrowRightLeft className="w-8 h-8 text-purple-600" />
            Scholarship Allocation to Fee
          </h1>
          <p className="text-gray-500 mt-1">
            Allocate sanctioned scholarship amounts against student fee ledgers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button variant="outline" onClick={() => setShowHelpModal(true)}>
            <HelpCircle className="w-4 h-4 mr-2" />
            Help
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
                    if (isCompleted || isActive) setCurrentStep(step.id as AllocationStep);
                  }}>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive ?
                    'bg-purple-600 text-white shadow-lg' :
                    isCompleted ?
                    'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'}`
                    }>

                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                    isActive ? 'text-purple-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`
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
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Students</p>
              <p className="text-2xl font-bold text-purple-900">{stats.totalStudents}</p>
              <p className="text-xs text-purple-500">{stats.studentsWithBalance} with balance</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                ₹{(stats.totalAvailableScholarship / 1000).toFixed(0)}K
              </p>
            </div>
            <Wallet className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Fee Due</p>
              <p className="text-2xl font-bold text-orange-900">
                ₹{(stats.totalFeeDue / 1000).toFixed(0)}K
              </p>
            </div>
            <Receipt className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Proposed Allocation</p>
              <p className="text-2xl font-bold text-green-900">
                ₹{(stats.totalProposedAllocation / 1000).toFixed(0)}K
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Fully Allocated</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.fullyAllocated}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-indigo-600 font-medium">Selected</p>
              <p className="text-2xl font-bold text-indigo-900">{stats.selectedCount}</p>
            </div>
            <UserCheck className="w-8 h-8 text-indigo-500" />
          </div>
        </Card>
      </div>

      {/* Step 1: Select Students */}
      {currentStep === 'select' &&
      <div className="space-y-4">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                placeholder="Search by student name, GR No, or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-gray-400" />} />

              </div>
              <div className="flex gap-2">
                <Select
                options={[
                { value: 'all', label: 'All Schemes' },
                ...schemes.map((s) => ({ value: s.id, label: s.name }))]
                }
                value={filters.scheme}
                onChange={(e) => setFilters({ ...filters, scheme: e.target.value })} />

                <Select
                options={[
                { value: 'all', label: 'All Classes' },
                { value: '8', label: 'Class 8' },
                { value: '9', label: 'Class 9' },
                { value: '10', label: 'Class 10' },
                { value: '11', label: 'Class 11' },
                { value: '12', label: 'Class 12' }]
                }
                value={filters.class}
                onChange={(e) => setFilters({ ...filters, class: e.target.value })} />

                <Select
                options={[
                { value: 'all', label: 'Balance Status' },
                { value: 'yes', label: 'Has Balance' },
                { value: 'no', label: 'No Balance' }]
                }
                value={filters.hasBalance}
                onChange={(e) => setFilters({ ...filters, hasBalance: e.target.value })} />

              </div>
            </div>
          </Card>

          {/* Selection Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                className="rounded w-5 h-5"
                checked={selectedStudentIds.length === filteredAllocations.length && filteredAllocations.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)} />

                <span className="text-sm font-medium">Select All ({filteredAllocations.length})</span>
              </label>
              {selectedStudentIds.length > 0 &&
            <Badge variant="info" className="px-3 py-1">
                  {selectedStudentIds.length} selected
                </Badge>
            }
            </div>
            <span className="text-sm text-gray-500">
              Showing {filteredAllocations.length} students with scholarship wallets
            </span>
          </div>

          {/* Student Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAllocations.map((sa) => {
            const isSelected = selectedStudentIds.includes(sa.student.id);
            const hasAllocation = allocations[sa.student.id]?.totalAllocation > 0;

            return (
              <Card
                key={sa.student.id}
                className={`p-4 cursor-pointer transition-all ${
                isSelected ?
                'border-2 border-purple-500 bg-purple-50' :
                'hover:shadow-md hover:border-gray-300'}`
                }
                onClick={() => toggleStudentSelection(sa.student.id)}>

                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                      src={sa.student.photo}
                      alt={sa.student.name}
                      className="w-14 h-14 rounded-full" />

                      {isSelected &&
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                    }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{sa.student.name}</h3>
                        {hasAllocation &&
                      <Badge variant="success" className="text-xs">Allocated</Badge>
                      }
                      </div>
                      <p className="text-sm text-gray-500">
                        {sa.student.grNo} | Class {sa.student.class}-{sa.student.section}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {sa.student.isRTE &&
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] rounded font-medium">
                            RTE
                          </span>
                      }
                        {sa.student.isEWS &&
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-medium">
                            EWS
                          </span>
                      }
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] rounded font-medium">
                          {sa.student.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-center">
                      <p className="text-xs text-blue-600">Scholarship Balance</p>
                      <p className="text-lg font-bold text-blue-900">
                        ₹{sa.totalScholarshipAvailable.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded-lg text-center">
                      <p className="text-xs text-orange-600">Fee Due</p>
                      <p className="text-lg font-bold text-orange-900">
                        ₹{sa.totalFeeDue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Scholarship Wallets */}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">Scholarship Wallets:</p>
                    <div className="flex flex-wrap gap-1">
                      {sa.scholarshipWallets.map((wallet) =>
                    <span
                      key={wallet.schemeId}
                      className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded-full">

                          {wallet.schemeName.split(' ')[0]} (₹{(wallet.availableBalance / 1000).toFixed(0)}K)
                        </span>
                    )}
                    </div>
                  </div>
                </Card>);

          })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <div />
            <Button
            variant="primary"
            onClick={() => setCurrentStep('configure')}
            disabled={selectedStudentIds.length === 0}>

              Continue to Configure
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      }

      {/* Step 2: Configure Allocation */}
      {currentStep === 'configure' &&
      <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Allocation Configuration</h2>

            {/* Allocation Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Allocation Mode
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
              { id: 'smart', label: 'Smart Auto', icon: Zap, description: 'Automatically allocate based on fee due and available balance' },
              { id: 'percentage', label: 'Percentage', icon: Percent, description: 'Allocate a fixed percentage of available balance' },
              { id: 'manual', label: 'Manual Entry', icon: Edit, description: 'Enter allocation amount for each student manually' },
              { id: 'bulk', label: 'Bulk Fixed', icon: Calculator, description: 'Allocate a fixed amount to all selected students' }].
              map((mode) => {
                const Icon = mode.icon;
                const isSelected = allocationMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected ?
                    'border-purple-500 bg-purple-50' :
                    'border-gray-200 hover:border-gray-300'}`
                    }
                    onClick={() => setAllocationMode(mode.id as AllocationMode)}>

                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100' : 'bg-gray-100'}`}>
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-600' : 'text-gray-500'}`} />
                        </div>
                        <span className="font-bold text-gray-900">{mode.label}</span>
                      </div>
                      <p className="text-xs text-gray-500">{mode.description}</p>
                    </button>);

              })}
              </div>
            </div>

            {/* Mode-specific Settings */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-gray-700 mb-4">Allocation Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allocationMode === 'percentage' &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allocation Percentage
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                    type="number"
                    value={allocationSettings.percentageAllocation}
                    onChange={(e) =>
                    setAllocationSettings({
                      ...allocationSettings,
                      percentageAllocation: Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                    })
                    }
                    className="w-24" />

                      <span className="text-gray-500">%</span>
                      <input
                    type="range"
                    min="0"
                    max="100"
                    value={allocationSettings.percentageAllocation}
                    onChange={(e) =>
                    setAllocationSettings({
                      ...allocationSettings,
                      percentageAllocation: parseInt(e.target.value)
                    })
                    }
                    className="flex-1" />

                    </div>
                  </div>
              }

                {allocationMode === 'bulk' &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Amount per Student
                    </label>
                    <Input
                  type="number"
                  placeholder="Enter amount"
                  value={allocationSettings.maxAllocationPerStudent || ''}
                  onChange={(e) =>
                  setAllocationSettings({
                    ...allocationSettings,
                    maxAllocationPerStudent: parseInt(e.target.value) || 0
                  })
                  } />

                  </div>
              }

                <Select
                label="Priority Scheme"
                options={[
                { value: 'all', label: 'All Schemes' },
                ...schemes.map((s) => ({ value: s.id, label: s.name }))]
                }
                value={allocationSettings.selectedScheme}
                onChange={(e) =>
                setAllocationSettings({ ...allocationSettings, selectedScheme: e.target.value })
                } />


                <Select
                label="Apply to Fee Head"
                options={[
                { value: 'all', label: 'All Applicable Fee Heads' },
                ...feeHeads.map((f) => ({ value: f.id, label: f.name }))]
                }
                value={allocationSettings.selectedFeeHead}
                onChange={(e) =>
                setAllocationSettings({ ...allocationSettings, selectedFeeHead: e.target.value })
                } />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Allocation Amount
                  </label>
                  <Input
                  type="number"
                  value={allocationSettings.minAllocationAmount}
                  onChange={(e) =>
                  setAllocationSettings({
                    ...allocationSettings,
                    minAllocationAmount: parseInt(e.target.value) || 0
                  })
                  } />

                </div>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={allocationSettings.autoAdjustExcess}
                  onChange={(e) =>
                  setAllocationSettings({
                    ...allocationSettings,
                    autoAdjustExcess: e.target.checked
                  })
                  }
                  className="rounded" />

                  <span className="text-sm">Auto-adjust if allocation exceeds fee due</span>
                </label>
              </div>
            </div>

            {/* Preview Summary */}
            <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
              <h4 className="font-bold text-purple-800 mb-3">Allocation Preview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-purple-600">Selected Students:</span>
                  <span className="font-bold text-purple-900 ml-2">{selectedStudentIds.length}</span>
                </div>
                <div>
                  <span className="text-purple-600">Total Available:</span>
                  <span className="font-bold text-purple-900 ml-2">
                    ₹{filteredAllocations.
                  filter((sa) => selectedStudentIds.includes(sa.student.id)).
                  reduce((sum, sa) => sum + sa.totalScholarshipAvailable, 0).
                  toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600">Total Fee Due:</span>
                  <span className="font-bold text-purple-900 ml-2">
                    ₹{filteredAllocations.
                  filter((sa) => selectedStudentIds.includes(sa.student.id)).
                  reduce((sum, sa) => sum + sa.totalFeeDue, 0).
                  toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-purple-600">Est. Allocation:</span>
                  <span className="font-bold text-green-600 ml-2">
                    ₹{filteredAllocations.
                  filter((sa) => selectedStudentIds.includes(sa.student.id)).
                  reduce((sum, sa) => {
                    const max = Math.min(sa.totalScholarshipAvailable, sa.totalFeeDue);
                    return sum + (allocationMode === 'percentage' ?
                    Math.round(max * (allocationSettings.percentageAllocation / 100)) :
                    max);
                  }, 0).
                  toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('select')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
            variant="primary"
            onClick={() => {
              handleSmartAutoAllocate();
              setCurrentStep('review');
            }}>

              Calculate & Review
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      }

      {/* Step 3: Review & Adjust */}
      {currentStep === 'review' &&
      <div className="space-y-4">
          {/* Action Bar */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleSmartAutoAllocate}>
                  <Zap className="w-4 h-4 mr-2" />
                  Recalculate
                </Button>
                <Button variant="outline" onClick={clearAllAllocations}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Total Allocation: 
                </span>
                <span className="text-xl font-bold text-green-600">
                  ₹{stats.totalProposedAllocation.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Allocation Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Student
                    </th>
                    <th className="p-4 text-left text-xs font-bold text-gray-600 uppercase">
                      Scholarship Wallets
                    </th>
                    <th className="p-4 text-right text-xs font-bold text-gray-600 uppercase">
                      Available
                    </th>
                    <th className="p-4 text-right text-xs font-bold text-gray-600 uppercase">
                      Fee Due
                    </th>
                    <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase w-48">
                      Allocation Amount
                    </th>
                    <th className="p-4 text-right text-xs font-bold text-gray-600 uppercase">
                      Remaining
                    </th>
                    <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="p-4 text-center text-xs font-bold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredAllocations.
                filter((sa) => selectedStudentIds.includes(sa.student.id)).
                map((sa) => {
                  const allocation = allocations[sa.student.id]?.totalAllocation || 0;
                  const isLocked = allocations[sa.student.id]?.isLocked || false;
                  const remainingScholarship = sa.totalScholarshipAvailable - allocation;
                  const remainingFee = sa.totalFeeDue - allocation;

                  return (
                    <tr key={sa.student.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                            src={sa.student.photo}
                            alt=""
                            className="w-10 h-10 rounded-full" />

                              <div>
                                <p className="font-bold text-gray-900">{sa.student.name}</p>
                                <p className="text-xs text-gray-500">
                                  {sa.student.grNo} | Class {sa.student.class}-{sa.student.section}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {sa.scholarshipWallets.map((w) =>
                          <span
                            key={w.schemeId}
                            className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">

                                  {w.schemeName.split(' ')[0]}
                                </span>
                          )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Wallet className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold text-blue-700">
                                ₹{sa.totalScholarshipAvailable.toLocaleString()}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="font-semibold text-orange-600">
                              ₹{sa.totalFeeDue.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
                              <Input
                            type="number"
                            className={`pl-7 text-center font-bold ${
                            isLocked ? 'bg-gray-100' : 'bg-white'}`
                            }
                            value={allocation || ''}
                            onChange={(e) =>
                            !isLocked &&
                            updateManualAllocation(sa.student.id, parseFloat(e.target.value) || 0)
                            }
                            disabled={isLocked}
                            placeholder="0" />

                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="space-y-1">
                              <div className="flex justify-end items-center gap-2 text-sm">
                                <span className="text-gray-400">Wallet:</span>
                                <span className={remainingScholarship >= 0 ? 'text-blue-600' : 'text-red-600'}>
                                  ₹{remainingScholarship.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-end items-center gap-2 text-sm">
                                <span className="text-gray-400">Fee:</span>
                                <span className={remainingFee <= 0 ? 'text-green-600' : 'text-orange-600'}>
                                  ₹{remainingFee.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {getStatusBadge(sa.allocationStatus)}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-1">
                              <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLockAllocation(sa.student.id)}
                            title={isLocked ? 'Unlock' : 'Lock'}>

                                {isLocked ?
                            <Lock className="w-4 h-4 text-red-500" /> :

                            <Unlock className="w-4 h-4 text-gray-400" />
                            }
                              </Button>
                              <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const max = Math.min(sa.totalScholarshipAvailable, sa.totalFeeDue);
                              updateManualAllocation(sa.student.id, max);
                            }}
                            title="Max Allocation">

                                <TrendingUp className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateManualAllocation(sa.student.id, 0)}
                            title="Clear">

                                <X className="w-4 h-4 text-gray-400" />
                              </Button>
                            </div>
                          </td>
                        </tr>);

                })}
                </tbody>
              </table>
            </div>

            {/* Summary Footer */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-600">
                      Fully Allocated: <strong>{stats.fullyAllocated}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-gray-600">
                      Partial: <strong>{stats.partiallyAllocated}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Total Allocation:</span>
                  <span className="text-2xl font-black text-green-600">
                    ₹{stats.totalProposedAllocation.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('configure')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Configure
            </Button>
            <Button
            variant="primary"
            onClick={() => setCurrentStep('confirm')}
            disabled={stats.totalProposedAllocation === 0}>

              Proceed to Confirm
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      }

      {/* Step 4: Confirm & Commit */}
      {currentStep === 'confirm' &&
      <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Confirm Allocation</h2>
              <p className="text-gray-500 mt-2">
                Review the summary below and confirm to commit allocations to student ledgers
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-purple-50 rounded-xl text-center">
                <p className="text-sm text-purple-600 font-medium">Students Affected</p>
                <p className="text-4xl font-bold text-purple-900 mt-2">
                  {Object.keys(allocations).length}
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl text-center">
                <p className="text-sm text-green-600 font-medium">Total Allocation</p>
                <p className="text-4xl font-bold text-green-900 mt-2">
                  ₹{stats.totalProposedAllocation.toLocaleString()}
                </p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl text-center">
                <p className="text-sm text-blue-600 font-medium">Fee Heads Covered</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">
                  {feeHeads.length}
                </p>
              </div>
            </div>

            {/* Allocation Breakdown */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Allocation Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Student</th>
                      <th className="p-3 text-left">Scheme</th>
                      <th className="p-3 text-right">Allocation</th>
                      <th className="p-3 text-right">Fee Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAllocations.
                  filter((sa) => allocations[sa.student.id]?.totalAllocation > 0).
                  map((sa) =>
                  <tr key={sa.student.id}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <img src={sa.student.photo} alt="" className="w-8 h-8 rounded-full" />
                              <span className="font-medium">{sa.student.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            {sa.scholarshipWallets.map((w) => w.schemeName.split(' ')[0]).join(', ')}
                          </td>
                          <td className="p-3 text-right font-bold text-green-600">
                            ₹{allocations[sa.student.id]?.totalAllocation.toLocaleString()}
                          </td>
                          <td className="p-3 text-right">
                            ₹{(sa.totalFeeDue - (allocations[sa.student.id]?.totalAllocation || 0)).toLocaleString()}
                          </td>
                        </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800">Important Notice</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Once committed, these allocations will be posted to student fee ledgers immediately.
                    This action cannot be undone directly. Any corrections will require a reversal entry.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={exportAllocations}>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print Preview
              </Button>
              <Button
              variant="primary"
              className="bg-green-600 hover:bg-green-700 px-8"
              onClick={commitToLedger}
              disabled={isProcessing}>

                {isProcessing ?
              <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </> :

              <>
                    <Save className="w-4 h-4 mr-2" />
                    Commit to Ledger
                  </>
              }
              </Button>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep('review')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Review
            </Button>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Allocation History</h2>
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
                      <th className="p-3 text-left">Date & Time</th>
                      <th className="p-3 text-left">Student</th>
                      <th className="p-3 text-left">Scheme</th>
                      <th className="p-3 text-left">Fee Head</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allocationHistory.map((record) =>
                  <tr key={record.id}>
                        <td className="p-3">
                          <div>{record.date}</div>
                          <div className="text-xs text-gray-500">{record.time}</div>
                        </td>
                        <td className="p-3 font-medium">{record.studentName}</td>
                        <td className="p-3">{record.schemeName}</td>
                        <td className="p-3">{record.feeHeadName}</td>
                        <td className="p-3 text-right font-bold text-green-600">
                          ₹{record.amount.toLocaleString()}
                        </td>
                        <td className="p-3 text-center">
                          <Badge
                        variant={
                        record.status === 'Completed' ?
                        'success' :
                        record.status === 'Reversed' ?
                        'danger' :
                        'warning'
                        }>

                            {record.status}
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
            <p className="font-medium mb-1">How Scholarship Allocation Works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li><strong>Step 1:</strong> Select students with available scholarship balance</li>
              <li><strong>Step 2:</strong> Configure allocation mode (Smart Auto, Percentage, Manual, or Bulk)</li>
              <li><strong>Step 3:</strong> Review and adjust individual allocations as needed</li>
              <li><strong>Step 4:</strong> Confirm and commit allocations to student fee ledgers</li>
              <li>Allocations are posted as credits against fee dues, reducing the payable amount</li>
              <li>RTE and government schemes are typically allocated to tuition fee first</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>);

}