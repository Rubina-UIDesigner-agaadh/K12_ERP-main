import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Upload,
  X,
  AlertCircle,
  Info,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Filter,
  Printer,
  Mail,
  Share2,
  History,
  Edit,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
  MoreVertical,
  Calendar,
  Building,
  User } from
'lucide-react';

// Types
interface ProofDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}

interface VerificationHistory {
  id: string;
  action: string;
  by: string;
  date: string;
  remarks: string;
  previousStatus: string;
  newStatus: string;
}

interface Proof {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  department: string;
  section: string;
  sectionCode: string;
  declaredAmount: number;
  verifiedAmount: number | null;
  uploaded: boolean;
  documents: ProofDocument[];
  status: 'Verified' | 'Pending' | 'Rejected' | 'Partially Verified';
  verifiedDate: string | null;
  verifiedBy: string | null;
  remarks: string;
  fiscalYear: string;
  submittedDate: string;
  history: VerificationHistory[];
}

interface Employee {
  id: string;
  name: string;
  code: string;
  department: string;
  email: string;
  phone: string;
}

// Constants
const FISCAL_YEARS = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-23' }];


const DEPARTMENTS = [
{ value: 'all', label: 'All Departments' },
{ value: 'IT', label: 'IT' },
{ value: 'HR', label: 'HR' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Operations', label: 'Operations' },
{ value: 'Marketing', label: 'Marketing' },
{ value: 'Sales', label: 'Sales' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'Verified', label: 'Verified' },
{ value: 'Pending', label: 'Pending' },
{ value: 'Rejected', label: 'Rejected' },
{ value: 'Partially Verified', label: 'Partially Verified' }];


const SECTION_OPTIONS = [
{ value: 'all', label: 'All Sections' },
{ value: '80C', label: '80C - Investments' },
{ value: '80D', label: '80D - Health Insurance' },
{ value: '80E', label: '80E - Education Loan' },
{ value: '80G', label: '80G - Donations' },
{ value: 'HRA', label: 'HRA - House Rent' },
{ value: '24', label: '24 - Home Loan Interest' }];


const EXPORT_FORMATS = [
{ value: 'csv', label: 'CSV Spreadsheet' },
{ value: 'excel', label: 'Excel Workbook' },
{ value: 'pdf', label: 'PDF Report' },
{ value: 'json', label: 'JSON Data' }];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Initial Data
const initialProofs: Proof[] = [
{
  id: 'PRF001',
  employeeId: 'EMP001',
  employeeName: 'Rajesh Kumar',
  employeeCode: 'EMP001',
  department: 'IT',
  section: '80C - LIC Premium',
  sectionCode: '80C',
  declaredAmount: 150000,
  verifiedAmount: 150000,
  uploaded: true,
  documents: [
  {
    id: 'DOC001',
    name: 'LIC_Premium_Receipt_2024.pdf',
    type: 'application/pdf',
    size: '256 KB',
    uploadDate: '15 Jan 2025',
    url: '/documents/lic_receipt.pdf'
  }],

  status: 'Verified',
  verifiedDate: '18 Jan 2025',
  verifiedBy: 'HR Admin',
  remarks: 'All documents verified successfully',
  fiscalYear: '2024-25',
  submittedDate: '10 Jan 2025',
  history: [
  {
    id: 'H001',
    action: 'Verified',
    by: 'HR Admin',
    date: '18 Jan 2025',
    remarks: 'All documents verified successfully',
    previousStatus: 'Pending',
    newStatus: 'Verified'
  },
  {
    id: 'H002',
    action: 'Submitted',
    by: 'Rajesh Kumar',
    date: '10 Jan 2025',
    remarks: 'Proof submitted for verification',
    previousStatus: '-',
    newStatus: 'Pending'
  }]

},
{
  id: 'PRF002',
  employeeId: 'EMP002',
  employeeName: 'Priya Sharma',
  employeeCode: 'EMP002',
  department: 'HR',
  section: '80D - Health Insurance',
  sectionCode: '80D',
  declaredAmount: 25000,
  verifiedAmount: null,
  uploaded: true,
  documents: [
  {
    id: 'DOC002',
    name: 'Health_Insurance_Policy.pdf',
    type: 'application/pdf',
    size: '512 KB',
    uploadDate: '12 Jan 2025',
    url: '/documents/health_insurance.pdf'
  },
  {
    id: 'DOC003',
    name: 'Premium_Receipt.pdf',
    type: 'application/pdf',
    size: '128 KB',
    uploadDate: '12 Jan 2025',
    url: '/documents/premium_receipt.pdf'
  }],

  status: 'Pending',
  verifiedDate: null,
  verifiedBy: null,
  remarks: '',
  fiscalYear: '2024-25',
  submittedDate: '12 Jan 2025',
  history: [
  {
    id: 'H003',
    action: 'Submitted',
    by: 'Priya Sharma',
    date: '12 Jan 2025',
    remarks: 'Proof submitted for verification',
    previousStatus: '-',
    newStatus: 'Pending'
  }]

},
{
  id: 'PRF003',
  employeeId: 'EMP003',
  employeeName: 'Amit Patel',
  employeeCode: 'EMP003',
  department: 'Finance',
  section: 'HRA - Rent Receipts',
  sectionCode: 'HRA',
  declaredAmount: 120000,
  verifiedAmount: 0,
  uploaded: true,
  documents: [
  {
    id: 'DOC004',
    name: 'Rent_Receipts_Q1.pdf',
    type: 'application/pdf',
    size: '1.2 MB',
    uploadDate: '08 Jan 2025',
    url: '/documents/rent_receipts.pdf'
  }],

  status: 'Rejected',
  verifiedDate: '20 Jan 2025',
  verifiedBy: 'HR Manager',
  remarks: 'Rent receipts are incomplete. Missing landlord PAN for amount exceeding ₹1 lakh.',
  fiscalYear: '2024-25',
  submittedDate: '08 Jan 2025',
  history: [
  {
    id: 'H004',
    action: 'Rejected',
    by: 'HR Manager',
    date: '20 Jan 2025',
    remarks: 'Rent receipts are incomplete. Missing landlord PAN for amount exceeding ₹1 lakh.',
    previousStatus: 'Pending',
    newStatus: 'Rejected'
  },
  {
    id: 'H005',
    action: 'Submitted',
    by: 'Amit Patel',
    date: '08 Jan 2025',
    remarks: 'Proof submitted for verification',
    previousStatus: '-',
    newStatus: 'Pending'
  }]

},
{
  id: 'PRF004',
  employeeId: 'EMP004',
  employeeName: 'Sneha Reddy',
  employeeCode: 'EMP004',
  department: 'Marketing',
  section: '80C - PPF',
  sectionCode: '80C',
  declaredAmount: 100000,
  verifiedAmount: 100000,
  uploaded: true,
  documents: [
  {
    id: 'DOC005',
    name: 'PPF_Statement.pdf',
    type: 'application/pdf',
    size: '340 KB',
    uploadDate: '05 Jan 2025',
    url: '/documents/ppf_statement.pdf'
  }],

  status: 'Verified',
  verifiedDate: '15 Jan 2025',
  verifiedBy: 'HR Admin',
  remarks: 'PPF statement verified',
  fiscalYear: '2024-25',
  submittedDate: '05 Jan 2025',
  history: [
  {
    id: 'H006',
    action: 'Verified',
    by: 'HR Admin',
    date: '15 Jan 2025',
    remarks: 'PPF statement verified',
    previousStatus: 'Pending',
    newStatus: 'Verified'
  }]

},
{
  id: 'PRF005',
  employeeId: 'EMP005',
  employeeName: 'Vikram Singh',
  employeeCode: 'EMP005',
  department: 'Operations',
  section: '24 - Home Loan Interest',
  sectionCode: '24',
  declaredAmount: 200000,
  verifiedAmount: 180000,
  uploaded: true,
  documents: [
  {
    id: 'DOC006',
    name: 'Home_Loan_Certificate.pdf',
    type: 'application/pdf',
    size: '420 KB',
    uploadDate: '03 Jan 2025',
    url: '/documents/home_loan.pdf'
  },
  {
    id: 'DOC007',
    name: 'Interest_Certificate.pdf',
    type: 'application/pdf',
    size: '180 KB',
    uploadDate: '03 Jan 2025',
    url: '/documents/interest_cert.pdf'
  }],

  status: 'Partially Verified',
  verifiedDate: '22 Jan 2025',
  verifiedBy: 'HR Manager',
  remarks: 'Interest amount verified as ₹1,80,000 based on bank certificate. Declared amount was higher.',
  fiscalYear: '2024-25',
  submittedDate: '03 Jan 2025',
  history: [
  {
    id: 'H007',
    action: 'Partially Verified',
    by: 'HR Manager',
    date: '22 Jan 2025',
    remarks: 'Interest amount verified as ₹1,80,000 based on bank certificate.',
    previousStatus: 'Pending',
    newStatus: 'Partially Verified'
  }]

},
{
  id: 'PRF006',
  employeeId: 'EMP006',
  employeeName: 'Anita Desai',
  employeeCode: 'EMP006',
  department: 'Sales',
  section: '80G - Donations',
  sectionCode: '80G',
  declaredAmount: 15000,
  verifiedAmount: null,
  uploaded: true,
  documents: [
  {
    id: 'DOC008',
    name: 'Donation_Receipt.pdf',
    type: 'application/pdf',
    size: '98 KB',
    uploadDate: '18 Jan 2025',
    url: '/documents/donation.pdf'
  }],

  status: 'Pending',
  verifiedDate: null,
  verifiedBy: null,
  remarks: '',
  fiscalYear: '2024-25',
  submittedDate: '18 Jan 2025',
  history: []
},
{
  id: 'PRF007',
  employeeId: 'EMP007',
  employeeName: 'Rahul Mehta',
  employeeCode: 'EMP007',
  department: 'IT',
  section: '80E - Education Loan',
  sectionCode: '80E',
  declaredAmount: 50000,
  verifiedAmount: null,
  uploaded: false,
  documents: [],
  status: 'Pending',
  verifiedDate: null,
  verifiedBy: null,
  remarks: 'Awaiting document upload',
  fiscalYear: '2024-25',
  submittedDate: '20 Jan 2025',
  history: []
},
{
  id: 'PRF008',
  employeeId: 'EMP001',
  employeeName: 'Rajesh Kumar',
  employeeCode: 'EMP001',
  department: 'IT',
  section: '80D - Health Insurance (Self)',
  sectionCode: '80D',
  declaredAmount: 25000,
  verifiedAmount: 25000,
  uploaded: true,
  documents: [
  {
    id: 'DOC009',
    name: 'Self_Health_Insurance.pdf',
    type: 'application/pdf',
    size: '310 KB',
    uploadDate: '10 Jan 2025',
    url: '/documents/self_health.pdf'
  }],

  status: 'Verified',
  verifiedDate: '19 Jan 2025',
  verifiedBy: 'HR Admin',
  remarks: 'Health insurance premium verified',
  fiscalYear: '2024-25',
  submittedDate: '10 Jan 2025',
  history: []
},
{
  id: 'PRF009',
  employeeId: 'EMP008',
  employeeName: 'Kavita Joshi',
  employeeCode: 'EMP008',
  department: 'Finance',
  section: '80C - ELSS',
  sectionCode: '80C',
  declaredAmount: 75000,
  verifiedAmount: null,
  uploaded: true,
  documents: [
  {
    id: 'DOC010',
    name: 'ELSS_Statement.pdf',
    type: 'application/pdf',
    size: '245 KB',
    uploadDate: '22 Jan 2025',
    url: '/documents/elss.pdf'
  }],

  status: 'Pending',
  verifiedDate: null,
  verifiedBy: null,
  remarks: '',
  fiscalYear: '2024-25',
  submittedDate: '22 Jan 2025',
  history: []
},
{
  id: 'PRF010',
  employeeId: 'EMP009',
  employeeName: 'Suresh Nair',
  employeeCode: 'EMP009',
  department: 'HR',
  section: 'HRA - Rent Receipts',
  sectionCode: 'HRA',
  declaredAmount: 180000,
  verifiedAmount: 180000,
  uploaded: true,
  documents: [
  {
    id: 'DOC011',
    name: 'Rent_Agreement.pdf',
    type: 'application/pdf',
    size: '890 KB',
    uploadDate: '05 Jan 2025',
    url: '/documents/rent_agreement.pdf'
  },
  {
    id: 'DOC012',
    name: 'Landlord_PAN.pdf',
    type: 'application/pdf',
    size: '120 KB',
    uploadDate: '05 Jan 2025',
    url: '/documents/landlord_pan.pdf'
  },
  {
    id: 'DOC013',
    name: 'Rent_Receipts_All.pdf',
    type: 'application/pdf',
    size: '1.5 MB',
    uploadDate: '05 Jan 2025',
    url: '/documents/rent_receipts_all.pdf'
  }],

  status: 'Verified',
  verifiedDate: '16 Jan 2025',
  verifiedBy: 'HR Manager',
  remarks: 'All HRA documents including landlord PAN verified',
  fiscalYear: '2024-25',
  submittedDate: '05 Jan 2025',
  history: []
}];


type SortField = 'employeeName' | 'section' | 'declaredAmount' | 'status' | 'verifiedDate' | 'submittedDate';
type SortDirection = 'asc' | 'desc';

export function ProofVerificationStatus() {
  // Data state
  const [proofs, setProofs] = useState<Proof[]>(initialProofs);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2024-25');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sort state
  const [sortField, setSortField] = useState<SortField>('submittedDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // UI state
  const [selectedProofId, setSelectedProofId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [selectedProofIds, setSelectedProofIds] = useState<Set<string>>(new Set());

  // Verification form state
  const [verifiedAmount, setVerifiedAmount] = useState<string>('');
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<string>('Pending');
  const [isSaving, setIsSaving] = useState(false);

  // Get selected proof
  const selectedProof = useMemo(
    () => proofs.find((p) => p.id === selectedProofId),
    [proofs, selectedProofId]
  );

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize verification form when proof is selected
  useEffect(() => {
    if (selectedProof) {
      setVerifiedAmount(selectedProof.verifiedAmount?.toString() || '');
      setVerificationRemarks(selectedProof.remarks || '');
      setVerificationStatus(selectedProof.status);
    }
  }, [selectedProofId]);

  // Filter and sort proofs
  const filteredProofs = useMemo(() => {
    let result = proofs.filter((proof) => {
      // Fiscal year filter
      if (proof.fiscalYear !== fiscalYear) return false;

      // Department filter
      if (departmentFilter !== 'all' && proof.department !== departmentFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && proof.status !== statusFilter) return false;

      // Section filter
      if (sectionFilter !== 'all' && proof.sectionCode !== sectionFilter) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
        !proof.employeeName.toLowerCase().includes(query) &&
        !proof.employeeCode.toLowerCase().includes(query) &&
        !proof.section.toLowerCase().includes(query) &&
        !proof.id.toLowerCase().includes(query))
        {
          return false;
        }
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number | null;
      let bVal: string | number | null;

      switch (sortField) {
        case 'employeeName':
          aVal = a.employeeName;
          bVal = b.employeeName;
          break;
        case 'section':
          aVal = a.section;
          bVal = b.section;
          break;
        case 'declaredAmount':
          aVal = a.declaredAmount;
          bVal = b.declaredAmount;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        case 'verifiedDate':
          aVal = a.verifiedDate || '';
          bVal = b.verifiedDate || '';
          break;
        case 'submittedDate':
          aVal = a.submittedDate;
          bVal = b.submittedDate;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return result;
  }, [proofs, fiscalYear, departmentFilter, statusFilter, sectionFilter, searchQuery, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProofs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProofs = filteredProofs.slice(startIndex, endIndex);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const yearProofs = proofs.filter((p) => p.fiscalYear === fiscalYear);
    const total = yearProofs.length;
    const verified = yearProofs.filter((p) => p.status === 'Verified').length;
    const pending = yearProofs.filter((p) => p.status === 'Pending').length;
    const rejected = yearProofs.filter((p) => p.status === 'Rejected').length;
    const partiallyVerified = yearProofs.filter((p) => p.status === 'Partially Verified').length;

    return {
      total,
      verified,
      pending,
      rejected,
      partiallyVerified,
      verifiedPercentage: total > 0 ? Math.round(verified / total * 100) : 0,
      pendingPercentage: total > 0 ? Math.round(pending / total * 100) : 0,
      rejectedPercentage: total > 0 ? Math.round(rejected / total * 100) : 0
    };
  }, [proofs, fiscalYear]);

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => dir === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('desc');
      return field;
    });
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedProofIds(new Set());
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  }, []);

  // Open verification drawer
  const openVerificationDrawer = useCallback((proofId: string) => {
    setSelectedProofId(proofId);
  }, []);

  // Close verification drawer
  const closeVerificationDrawer = useCallback(() => {
    setSelectedProofId(null);
    setVerifiedAmount('');
    setVerificationRemarks('');
    setVerificationStatus('Pending');
  }, []);

  // Save verification
  const saveVerification = useCallback(async () => {
    if (!selectedProof) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const newHistory: VerificationHistory = {
        id: `H${Date.now()}`,
        action: verificationStatus,
        by: 'HR Admin',
        date: dateStr,
        remarks: verificationRemarks,
        previousStatus: selectedProof.status,
        newStatus: verificationStatus as Proof['status']
      };

      setProofs((prev) =>
      prev.map((p) =>
      p.id === selectedProof.id ?
      {
        ...p,
        verifiedAmount: verifiedAmount ? parseFloat(verifiedAmount) : null,
        remarks: verificationRemarks,
        status: verificationStatus as Proof['status'],
        verifiedDate: ['Verified', 'Rejected', 'Partially Verified'].includes(verificationStatus) ?
        dateStr :
        null,
        verifiedBy: ['Verified', 'Rejected', 'Partially Verified'].includes(verificationStatus) ?
        'HR Admin' :
        null,
        history: [newHistory, ...p.history]
      } :
      p
      )
      );

      setNotification({
        type: 'success',
        message: `Proof ${verificationStatus.toLowerCase()} successfully`
      });

      closeVerificationDrawer();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save verification. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedProof, verifiedAmount, verificationRemarks, verificationStatus, closeVerificationDrawer]);

  // Approve proof
  const approveProof = useCallback(async () => {
    if (!selectedProof) return;

    const amount = verifiedAmount || selectedProof.declaredAmount.toString();
    setVerifiedAmount(amount);
    setVerificationStatus('Verified');

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const newHistory: VerificationHistory = {
        id: `H${Date.now()}`,
        action: 'Verified',
        by: 'HR Admin',
        date: dateStr,
        remarks: verificationRemarks || 'Proof verified and approved',
        previousStatus: selectedProof.status,
        newStatus: 'Verified'
      };

      setProofs((prev) =>
      prev.map((p) =>
      p.id === selectedProof.id ?
      {
        ...p,
        verifiedAmount: parseFloat(amount),
        remarks: verificationRemarks || 'Proof verified and approved',
        status: 'Verified',
        verifiedDate: dateStr,
        verifiedBy: 'HR Admin',
        history: [newHistory, ...p.history]
      } :
      p
      )
      );

      setNotification({
        type: 'success',
        message: `Proof approved for ${selectedProof.employeeName}`
      });

      closeVerificationDrawer();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to approve. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedProof, verifiedAmount, verificationRemarks, closeVerificationDrawer]);

  // Reject proof
  const rejectProof = useCallback(async () => {
    if (!selectedProof) return;

    if (!verificationRemarks.trim()) {
      setNotification({
        type: 'warning',
        message: 'Please provide rejection remarks'
      });
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      const newHistory: VerificationHistory = {
        id: `H${Date.now()}`,
        action: 'Rejected',
        by: 'HR Admin',
        date: dateStr,
        remarks: verificationRemarks,
        previousStatus: selectedProof.status,
        newStatus: 'Rejected'
      };

      setProofs((prev) =>
      prev.map((p) =>
      p.id === selectedProof.id ?
      {
        ...p,
        verifiedAmount: 0,
        remarks: verificationRemarks,
        status: 'Rejected',
        verifiedDate: dateStr,
        verifiedBy: 'HR Admin',
        history: [newHistory, ...p.history]
      } :
      p
      )
      );

      setNotification({
        type: 'success',
        message: `Proof rejected for ${selectedProof.employeeName}`
      });

      closeVerificationDrawer();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to reject. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedProof, verificationRemarks, closeVerificationDrawer]);

  // Download document
  const downloadDocument = useCallback((doc: ProofDocument) => {
    // Simulate document download
    setNotification({
      type: 'info',
      message: `Downloading ${doc.name}...`
    });

    setTimeout(() => {
      // Create a dummy download
      const link = document.createElement('a');
      link.href = '#';
      link.download = doc.name;
      setNotification({
        type: 'success',
        message: `${doc.name} downloaded successfully`
      });
    }, 1000);
  }, []);

  // Export report
  const handleExport = useCallback(
    async (format: string) => {
      setIsExporting(true);
      setShowExportMenu(false);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const exportData = filteredProofs.map((p) => ({
          proofId: p.id,
          employeeName: p.employeeName,
          employeeCode: p.employeeCode,
          department: p.department,
          section: p.section,
          declaredAmount: p.declaredAmount,
          verifiedAmount: p.verifiedAmount ?? 'N/A',
          uploaded: p.uploaded ? 'Yes' : 'No',
          status: p.status,
          verifiedDate: p.verifiedDate || 'N/A',
          verifiedBy: p.verifiedBy || 'N/A',
          remarks: p.remarks || 'N/A',
          submittedDate: p.submittedDate
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        switch (format) {
          case 'csv':
            const headers = Object.keys(exportData[0]).join(',');
            const rows = exportData.map((row) =>
            Object.values(row).
            map((v) => `"${v}"`).
            join(',')
            );
            content = [headers, ...rows].join('\n');
            filename = `proof-verification-${fiscalYear}-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            break;

          case 'json':
            content = JSON.stringify(
              {
                exportDate: new Date().toISOString(),
                fiscalYear,
                summary: summaryStats,
                data: exportData
              },
              null,
              2
            );
            filename = `proof-verification-${fiscalYear}-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
            break;

          case 'excel':
            content = [
            Object.keys(exportData[0]).join('\t'),
            ...exportData.map((row) => Object.values(row).join('\t'))].
            join('\n');
            filename = `proof-verification-${fiscalYear}-${new Date().toISOString().split('T')[0]}.xls`;
            mimeType = 'application/vnd.ms-excel';
            break;

          case 'pdf':
            setNotification({
              type: 'success',
              message: 'PDF report generated and downloading...'
            });
            setIsExporting(false);
            return;

          default:
            throw new Error('Unsupported format');
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setNotification({
          type: 'success',
          message: `Exported ${filteredProofs.length} records to ${format.toUpperCase()}`
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Export failed. Please try again.'
        });
      } finally {
        setIsExporting(false);
      }
    },
    [filteredProofs, fiscalYear, summaryStats]
  );

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLastRefreshed(new Date());
      setNotification({
        type: 'success',
        message: 'Data refreshed successfully'
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to refresh data'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setStatusFilter('all');
    setSectionFilter('all');
    setCurrentPage(1);
    setNotification({
      type: 'info',
      message: 'Filters cleared'
    });
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      departmentFilter !== 'all' ||
      statusFilter !== 'all' ||
      sectionFilter !== 'all');

  }, [searchQuery, departmentFilter, statusFilter, sectionFilter]);

  // Toggle proof selection
  const toggleProofSelection = useCallback((proofId: string) => {
    setSelectedProofIds((prev) => {
      const next = new Set(prev);
      if (next.has(proofId)) {
        next.delete(proofId);
      } else {
        next.add(proofId);
      }
      return next;
    });
  }, []);

  // Select all proofs on current page
  const selectAllOnPage = useCallback(() => {
    const pageIds = paginatedProofs.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedProofIds.has(id));

    if (allSelected) {
      setSelectedProofIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedProofIds((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [paginatedProofs, selectedProofIds]);

  // Bulk approve
  const bulkApprove = useCallback(async () => {
    if (selectedProofIds.size === 0) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      setProofs((prev) =>
      prev.map((p) => {
        if (selectedProofIds.has(p.id) && p.status === 'Pending' && p.uploaded) {
          const newHistory: VerificationHistory = {
            id: `H${Date.now()}-${p.id}`,
            action: 'Verified',
            by: 'HR Admin (Bulk)',
            date: dateStr,
            remarks: 'Bulk approved',
            previousStatus: p.status,
            newStatus: 'Verified'
          };

          return {
            ...p,
            verifiedAmount: p.declaredAmount,
            remarks: 'Bulk approved',
            status: 'Verified' as const,
            verifiedDate: dateStr,
            verifiedBy: 'HR Admin (Bulk)',
            history: [newHistory, ...p.history]
          };
        }
        return p;
      })
      );

      setNotification({
        type: 'success',
        message: `${selectedProofIds.size} proofs approved successfully`
      });

      setSelectedProofIds(new Set());
      setShowBulkActionMenu(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Bulk approval failed'
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedProofIds]);

  // Bulk reject
  const bulkReject = useCallback(async () => {
    if (selectedProofIds.size === 0) return;

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      setProofs((prev) =>
      prev.map((p) => {
        if (selectedProofIds.has(p.id) && p.status === 'Pending') {
          const newHistory: VerificationHistory = {
            id: `H${Date.now()}-${p.id}`,
            action: 'Rejected',
            by: 'HR Admin (Bulk)',
            date: dateStr,
            remarks: reason,
            previousStatus: p.status,
            newStatus: 'Rejected'
          };

          return {
            ...p,
            verifiedAmount: 0,
            remarks: reason,
            status: 'Rejected' as const,
            verifiedDate: dateStr,
            verifiedBy: 'HR Admin (Bulk)',
            history: [newHistory, ...p.history]
          };
        }
        return p;
      })
      );

      setNotification({
        type: 'success',
        message: `${selectedProofIds.size} proofs rejected`
      });

      setSelectedProofIds(new Set());
      setShowBulkActionMenu(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Bulk rejection failed'
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedProofIds]);

  // Send reminder
  const sendReminder = useCallback(async (proof: Proof) => {
    setNotification({
      type: 'info',
      message: `Sending reminder to ${proof.employeeName}...`
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setNotification({
      type: 'success',
      message: `Reminder sent to ${proof.employeeName}`
    });
  }, []);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'Partially Verified':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400 ml-1" />;
    }
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600 ml-1" /> :

    <ChevronDown className="w-3 h-3 text-blue-600 ml-1" />;

  };

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification &&
      <div
        className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${
        notification.type === 'success' ?
        'bg-green-100 text-green-800' :
        notification.type === 'error' ?
        'bg-red-100 text-red-800' :
        notification.type === 'warning' ?
        'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'}`
        }>

          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proof Verification Status</h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Proof Verification
            {lastRefreshed &&
            <span className="ml-2 text-xs">Last updated: {lastRefreshed.toLocaleTimeString()}</span>
            }
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <div className="relative">
            <Button
              variant="primary"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || filteredProofs.length === 0}>

              {isExporting ?
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export Report
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                {EXPORT_FORMATS.map((format) =>
              <button
                key={format.value}
                onClick={() => handleExport(format.value)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg">

                    {format.label}
                  </button>
              )}
              </div>
            }
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('all')}>

          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{summaryStats.total}</p>
          <p className="text-sm text-gray-600">Total Proofs Submitted</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('Verified')}>

          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">{summaryStats.verifiedPercentage}%</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{summaryStats.verified}</p>
          <p className="text-sm text-gray-600">Verified</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('Pending')}>

          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">{summaryStats.pendingPercentage}%</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{summaryStats.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setStatusFilter('Rejected')}>

          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">{summaryStats.rejectedPercentage}%</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{summaryStats.rejected}</p>
          <p className="text-sm text-gray-600">Rejected</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee, code, section..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2">

                <X className="w-4 h-4 text-gray-400" />
              </button>
            }
          </div>

          <Select
            options={FISCAL_YEARS}
            value={fiscalYear}
            onChange={(value) => {
              setFiscalYear(value);
              setCurrentPage(1);
            }} />


          <Select
            options={DEPARTMENTS}
            value={departmentFilter}
            onChange={(value) => {
              setDepartmentFilter(value);
              setCurrentPage(1);
            }} />


          <Select
            options={SECTION_OPTIONS}
            value={sectionFilter}
            onChange={(value) => {
              setSectionFilter(value);
              setCurrentPage(1);
            }} />


          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }} />

        </div>

        {hasActiveFilters &&
        <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {filteredProofs.length} of {proofs.filter((p) => p.fiscalYear === fiscalYear).length} proofs
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        }
      </Card>

      {/* Bulk Actions */}
      {selectedProofIds.size > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedProofIds.size} proof(s) selected
            </span>
            <div className="flex gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={bulkApprove}
              disabled={isLoading}
              className="text-green-600 border-green-600">

                <CheckCircle className="w-4 h-4 mr-1" />
                Approve Selected
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={bulkReject}
              disabled={isLoading}
              className="text-red-600 border-red-600">

                <XCircle className="w-4 h-4 mr-1" />
                Reject Selected
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProofIds(new Set())}>

                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Proof Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                    paginatedProofs.length > 0 &&
                    paginatedProofs.every((p) => selectedProofIds.has(p.id))
                    }
                    onChange={selectAllOnPage}
                    className="rounded border-gray-300" />

                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('employeeName')}>

                  <div className="flex items-center">
                    Employee Name
                    {renderSortIndicator('employeeName')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('section')}>

                  <div className="flex items-center">
                    Investment Section
                    {renderSortIndicator('section')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('declaredAmount')}>

                  <div className="flex items-center justify-end">
                    Declared Amount
                    {renderSortIndicator('declaredAmount')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Proof Uploaded
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center">
                    Status
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('verifiedDate')}>

                  <div className="flex items-center">
                    Verified Date
                    {renderSortIndicator('verifiedDate')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedProofs.length === 0 ?
              <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No proofs found matching your criteria</p>
                    {hasActiveFilters &&
                  <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
                        Clear Filters
                      </Button>
                  }
                  </td>
                </tr> :

              paginatedProofs.map((proof) =>
              <tr key={proof.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                    type="checkbox"
                    checked={selectedProofIds.has(proof.id)}
                    onChange={() => toggleProofSelection(proof.id)}
                    className="rounded border-gray-300" />

                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{proof.employeeName}</p>
                        <p className="text-xs text-gray-500">
                          {proof.employeeCode} · {proof.department}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{proof.section}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{proof.declaredAmount.toLocaleString()}
                      {proof.verifiedAmount !== null && proof.verifiedAmount !== proof.declaredAmount &&
                  <p className="text-xs text-gray-500">
                          Verified: ₹{proof.verifiedAmount.toLocaleString()}
                        </p>
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      {proof.uploaded ?
                  <Badge className="bg-blue-100 text-blue-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Yes ({proof.documents.length})
                        </Badge> :

                  <Badge className="bg-gray-100 text-gray-700">
                          <XCircle className="w-3 h-3 mr-1" />
                          No
                        </Badge>
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusBadge(proof.status)}>{proof.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {proof.verifiedDate || '-'}
                      {proof.verifiedBy &&
                  <p className="text-xs text-gray-500">by {proof.verifiedBy}</p>
                  }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openVerificationDrawer(proof.id)}
                      title="View & Verify">

                          <Eye className="w-4 h-4" />
                        </Button>
                        {proof.status === 'Pending' && !proof.uploaded &&
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => sendReminder(proof)}
                      title="Send Reminder">

                            <Mail className="w-4 h-4" />
                          </Button>
                    }
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProofs.length)} of{' '}
              {filteredProofs.length} proofs
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm">

                {ITEMS_PER_PAGE_OPTIONS.map((option) =>
                <option key={option} value={option}>
                    {option}
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>

              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page)}>

                    {page}
                  </Button>);

              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}>

              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Verification Drawer */}
      {selectedProofId && selectedProof &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div
          className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-xl"
          onClick={(e) => e.stopPropagation()}>

            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-900">Proof Verification</h2>
              <div className="flex items-center gap-2">
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistoryModal(true)}
                title="View History">

                  <History className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={closeVerificationDrawer}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Employee Name</p>
                    <p className="font-medium text-gray-900">{selectedProof.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee Code</p>
                    <p className="font-medium text-gray-900">{selectedProof.employeeCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedProof.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Section</p>
                    <p className="font-medium text-gray-900">{selectedProof.section}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Declared Amount</p>
                    <p className="font-medium text-gray-900">
                      ₹{selectedProof.declaredAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted Date</p>
                    <p className="font-medium text-gray-900">{selectedProof.submittedDate}</p>
                  </div>
                </div>
              </Card>

              {/* Current Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Current Status:</span>
                <Badge className={getStatusBadge(selectedProof.status)}>{selectedProof.status}</Badge>
              </div>

              {/* Uploaded Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploaded Documents ({selectedProof.documents.length})
                </label>
                {selectedProof.documents.length === 0 ?
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No documents uploaded</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Employee needs to upload proof documents
                    </p>
                  </div> :

              <div className="space-y-2">
                    {selectedProof.documents.map((doc) =>
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">

                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.size} · Uploaded {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(doc)}>

                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        window.open(doc.url, '_blank');
                      }}>

                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                )}
                  </div>
              }
              </div>

              {/* Verification Form */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verified Amount (₹)
                </label>
                <input
                type="number"
                value={verifiedAmount}
                onChange={(e) => setVerifiedAmount(e.target.value)}
                placeholder={`Declared: ₹${selectedProof.declaredAmount.toLocaleString()}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />

                {verifiedAmount && parseFloat(verifiedAmount) !== selectedProof.declaredAmount &&
              <p className="text-xs text-orange-600 mt-1">
                    Difference: ₹
                    {Math.abs(
                  parseFloat(verifiedAmount) - selectedProof.declaredAmount
                ).toLocaleString()}
                    {parseFloat(verifiedAmount) < selectedProof.declaredAmount ? ' less' : ' more'} than
                    declared
                  </p>
              }
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">HR Remarks</label>
                <textarea
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows={4}
                placeholder="Enter verification remarks..." />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Status
                </label>
                <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">

                  <option value="Pending">Pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Partially Verified">Partially Verified</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Previous Remarks (if any) */}
              {selectedProof.history.length > 0 &&
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Previous Verification</h4>
                  <p className="text-sm text-yellow-700">
                    <strong>{selectedProof.history[0].action}</strong> by {selectedProof.history[0].by} on{' '}
                    {selectedProof.history[0].date}
                  </p>
                  {selectedProof.history[0].remarks &&
              <p className="text-sm text-yellow-600 mt-1">
                      Remarks: {selectedProof.history[0].remarks}
                    </p>
              }
                </div>
            }

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                variant="primary"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={approveProof}
                disabled={isSaving || !selectedProof.uploaded}>

                  {isSaving ?
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                <CheckCircle className="w-4 h-4 mr-2" />
                }
                  Approve
                </Button>
                <Button
                variant="outline"
                className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                onClick={rejectProof}
                disabled={isSaving}>

                  {isSaving ?
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                <XCircle className="w-4 h-4 mr-2" />
                }
                  Reject
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={saveVerification} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                variant="ghost"
                className="flex-1"
                onClick={() => sendReminder(selectedProof)}
                disabled={selectedProof.uploaded}>

                  <Mail className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div className="flex-1" onClick={closeVerificationDrawer} />
        </div>
      }

      {/* History Modal */}
      {showHistoryModal && selectedProof &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Verification History</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              {selectedProof.history.length === 0 ?
            <p className="text-center text-gray-500 py-8">No history available</p> :

            <div className="space-y-4">
                  {selectedProof.history.map((entry, index) =>
              <div
                key={entry.id}
                className={`relative pl-6 pb-4 ${
                index < selectedProof.history.length - 1 ? 'border-l-2 border-gray-200' : ''}`
                }>

                      <div className="absolute left-0 top-0 w-3 h-3 rounded-full bg-blue-500 -translate-x-[5px]" />
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={getStatusBadge(entry.newStatus)}>{entry.action}</Badge>
                          <span className="text-xs text-gray-500">{entry.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">by {entry.by}</p>
                        {entry.remarks &&
                  <p className="text-sm text-gray-600 mt-1">"{entry.remarks}"</p>
                  }
                        {entry.previousStatus !== '-' &&
                  <p className="text-xs text-gray-400 mt-1">
                            Changed from {entry.previousStatus} to {entry.newStatus}
                          </p>
                  }
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Click outside handler for export menu */}
      {showExportMenu && <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />}
    </div>);

}