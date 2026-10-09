import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  AlertCircle,
  X,
  Send,
  Mail,
  Printer,
  RefreshCw,
  Filter,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Edit2,
  Trash2,
  Save,
  Loader2,
  Bell,
  Calendar,
  IndianRupee,
  FileSpreadsheet,
  History,
  MessageSquare,
  Copy,
  ExternalLink,
  MoreVertical,
  Check,
  Info } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  regime: 'New' | 'Old';
  declarationSubmitted: 'Yes' | 'Partial' | 'No';
  submittedDate: string | null;
  totalDeclaredAmount: number;
  declarationStatus: 'Complete' | 'Partial' | 'Not Started' | 'Under Review';
  lastReminderSent: string | null;
  reminderCount: number;
  declarations: Declaration[];
  proofStatus: 'All Uploaded' | 'Partial' | 'None';
  verificationStatus: 'Verified' | 'Pending' | 'Rejected' | 'Not Applicable';
  comments: Comment[];
  history: HistoryEntry[];
}

interface Declaration {
  id: string;
  section: string;
  category: string;
  declaredAmount: number;
  approvedAmount: number;
  proofUploaded: boolean;
  proofFileName: string | null;
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface HistoryEntry {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

interface FilterState {
  search: string;
  fiscalYear: string;
  department: string;
  status: string;
  regime: string;
  proofStatus: string;
}

interface SortConfig {
  key: keyof Employee | 'totalDeclaredAmount';
  direction: 'asc' | 'desc';
}

interface Notification {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// Constants
const FISCAL_YEARS = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-23' }];


const DEPARTMENTS = [
{ value: 'all', label: 'All Departments' },
{ value: 'it', label: 'IT' },
{ value: 'hr', label: 'HR' },
{ value: 'finance', label: 'Finance' },
{ value: 'sales', label: 'Sales' },
{ value: 'marketing', label: 'Marketing' },
{ value: 'operations', label: 'Operations' },
{ value: 'admin', label: 'Administration' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'submitted', label: 'Submitted' },
{ value: 'pending', label: 'Pending' },
{ value: 'not-started', label: 'Not Started' },
{ value: 'under-review', label: 'Under Review' }];


const REGIME_OPTIONS = [
{ value: 'all', label: 'All Regimes' },
{ value: 'new', label: 'New Regime' },
{ value: 'old', label: 'Old Regime' }];


const PROOF_STATUS_OPTIONS = [
{ value: 'all', label: 'All Proof Status' },
{ value: 'uploaded', label: 'All Uploaded' },
{ value: 'partial', label: 'Partial' },
{ value: 'none', label: 'None' }];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Sample Data
const initialEmployees: Employee[] = [
{
  id: '1',
  employeeId: 'EMP001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  phone: '+91 98765 43210',
  department: 'IT',
  designation: 'Senior Developer',
  joiningDate: '2020-03-15',
  regime: 'New',
  declarationSubmitted: 'Yes',
  submittedDate: '2025-01-15',
  totalDeclaredAmount: 295000,
  declarationStatus: 'Complete',
  lastReminderSent: null,
  reminderCount: 0,
  proofStatus: 'All Uploaded',
  verificationStatus: 'Verified',
  declarations: [
  { id: 'd1', section: '80C', category: 'PPF', declaredAmount: 150000, approvedAmount: 150000, proofUploaded: true, proofFileName: 'ppf_statement.pdf', status: 'Approved' },
  { id: 'd2', section: '80D', category: 'Health Insurance', declaredAmount: 25000, approvedAmount: 25000, proofUploaded: true, proofFileName: 'health_insurance.pdf', status: 'Approved' },
  { id: 'd3', section: '24(b)', category: 'Home Loan Interest', declaredAmount: 120000, approvedAmount: 120000, proofUploaded: true, proofFileName: 'home_loan.pdf', status: 'Approved' }],

  comments: [
  { id: 'c1', author: 'HR Admin', text: 'All documents verified', timestamp: '2025-01-16T10:30:00' }],

  history: [
  { id: 'h1', action: 'Declaration Submitted', performedBy: 'Rajesh Kumar', timestamp: '2025-01-15T09:00:00', details: 'Initial submission' },
  { id: 'h2', action: 'Verified', performedBy: 'HR Admin', timestamp: '2025-01-16T10:30:00', details: 'All proofs verified' }]

},
{
  id: '2',
  employeeId: 'EMP002',
  name: 'Priya Sharma',
  email: 'priya.sharma@company.com',
  phone: '+91 98765 43211',
  department: 'HR',
  designation: 'HR Manager',
  joiningDate: '2019-07-01',
  regime: 'Old',
  declarationSubmitted: 'Partial',
  submittedDate: '2025-01-18',
  totalDeclaredAmount: 150000,
  declarationStatus: 'Partial',
  lastReminderSent: '2025-01-20',
  reminderCount: 1,
  proofStatus: 'Partial',
  verificationStatus: 'Pending',
  declarations: [
  { id: 'd4', section: '80C', category: 'ELSS', declaredAmount: 100000, approvedAmount: 0, proofUploaded: true, proofFileName: 'elss_statement.pdf', status: 'Pending' },
  { id: 'd5', section: '80D', category: 'Health Insurance', declaredAmount: 50000, approvedAmount: 0, proofUploaded: false, proofFileName: null, status: 'Pending' }],

  comments: [],
  history: [
  { id: 'h3', action: 'Declaration Started', performedBy: 'Priya Sharma', timestamp: '2025-01-18T14:00:00', details: 'Partial submission' },
  { id: 'h4', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-20T09:00:00', details: 'Auto reminder for completion' }]

},
{
  id: '3',
  employeeId: 'EMP003',
  name: 'Amit Patel',
  email: 'amit.patel@company.com',
  phone: '+91 98765 43212',
  department: 'Finance',
  designation: 'Financial Analyst',
  joiningDate: '2021-01-10',
  regime: 'New',
  declarationSubmitted: 'No',
  submittedDate: null,
  totalDeclaredAmount: 0,
  declarationStatus: 'Not Started',
  lastReminderSent: '2025-01-22',
  reminderCount: 2,
  proofStatus: 'None',
  verificationStatus: 'Not Applicable',
  declarations: [],
  comments: [],
  history: [
  { id: 'h5', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-15T09:00:00', details: 'First reminder' },
  { id: 'h6', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-22T09:00:00', details: 'Second reminder' }]

},
{
  id: '4',
  employeeId: 'EMP004',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@company.com',
  phone: '+91 98765 43213',
  department: 'Sales',
  designation: 'Sales Executive',
  joiningDate: '2022-06-15',
  regime: 'New',
  declarationSubmitted: 'Yes',
  submittedDate: '2025-01-10',
  totalDeclaredAmount: 180000,
  declarationStatus: 'Under Review',
  lastReminderSent: null,
  reminderCount: 0,
  proofStatus: 'All Uploaded',
  verificationStatus: 'Pending',
  declarations: [
  { id: 'd6', section: '80C', category: 'Life Insurance', declaredAmount: 80000, approvedAmount: 0, proofUploaded: true, proofFileName: 'lic_premium.pdf', status: 'Pending' },
  { id: 'd7', section: '80C', category: 'NSC', declaredAmount: 50000, approvedAmount: 0, proofUploaded: true, proofFileName: 'nsc_certificate.pdf', status: 'Pending' },
  { id: 'd8', section: '80TTA', category: 'Savings Interest', declaredAmount: 10000, approvedAmount: 0, proofUploaded: true, proofFileName: 'bank_statement.pdf', status: 'Pending' },
  { id: 'd9', section: '80D', category: 'Health Insurance', declaredAmount: 40000, approvedAmount: 0, proofUploaded: true, proofFileName: 'health_policy.pdf', status: 'Pending' }],

  comments: [],
  history: [
  { id: 'h7', action: 'Declaration Submitted', performedBy: 'Sneha Reddy', timestamp: '2025-01-10T11:30:00', details: 'Complete submission' }]

},
{
  id: '5',
  employeeId: 'EMP005',
  name: 'Vikram Singh',
  email: 'vikram.singh@company.com',
  phone: '+91 98765 43214',
  department: 'Marketing',
  designation: 'Marketing Lead',
  joiningDate: '2018-11-20',
  regime: 'Old',
  declarationSubmitted: 'Yes',
  submittedDate: '2025-01-12',
  totalDeclaredAmount: 350000,
  declarationStatus: 'Complete',
  lastReminderSent: null,
  reminderCount: 0,
  proofStatus: 'All Uploaded',
  verificationStatus: 'Verified',
  declarations: [
  { id: 'd10', section: '80C', category: 'PPF', declaredAmount: 150000, approvedAmount: 150000, proofUploaded: true, proofFileName: 'ppf.pdf', status: 'Approved' },
  { id: 'd11', section: '80D', category: 'Health Insurance (Parents)', declaredAmount: 50000, approvedAmount: 50000, proofUploaded: true, proofFileName: 'parent_health.pdf', status: 'Approved' },
  { id: 'd12', section: '24(b)', category: 'Home Loan Interest', declaredAmount: 150000, approvedAmount: 150000, proofUploaded: true, proofFileName: 'loan_statement.pdf', status: 'Approved' }],

  comments: [
  { id: 'c2', author: 'Finance Team', text: 'Verified and approved', timestamp: '2025-01-14T15:00:00' }],

  history: [
  { id: 'h8', action: 'Declaration Submitted', performedBy: 'Vikram Singh', timestamp: '2025-01-12T10:00:00', details: 'Complete submission' },
  { id: 'h9', action: 'Verified', performedBy: 'Finance Team', timestamp: '2025-01-14T15:00:00', details: 'All documents approved' }]

},
{
  id: '6',
  employeeId: 'EMP006',
  name: 'Ananya Gupta',
  email: 'ananya.gupta@company.com',
  phone: '+91 98765 43215',
  department: 'Operations',
  designation: 'Operations Manager',
  joiningDate: '2020-09-01',
  regime: 'New',
  declarationSubmitted: 'No',
  submittedDate: null,
  totalDeclaredAmount: 0,
  declarationStatus: 'Not Started',
  lastReminderSent: '2025-01-23',
  reminderCount: 3,
  proofStatus: 'None',
  verificationStatus: 'Not Applicable',
  declarations: [],
  comments: [],
  history: [
  { id: 'h10', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-10T09:00:00', details: 'First reminder' },
  { id: 'h11', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-17T09:00:00', details: 'Second reminder' },
  { id: 'h12', action: 'Reminder Sent', performedBy: 'System', timestamp: '2025-01-23T09:00:00', details: 'Third reminder - urgent' }]

},
{
  id: '7',
  employeeId: 'EMP007',
  name: 'Rahul Verma',
  email: 'rahul.verma@company.com',
  phone: '+91 98765 43216',
  department: 'IT',
  designation: 'Tech Lead',
  joiningDate: '2017-04-10',
  regime: 'Old',
  declarationSubmitted: 'Partial',
  submittedDate: '2025-01-19',
  totalDeclaredAmount: 200000,
  declarationStatus: 'Partial',
  lastReminderSent: null,
  reminderCount: 0,
  proofStatus: 'Partial',
  verificationStatus: 'Pending',
  declarations: [
  { id: 'd13', section: '80C', category: 'PPF', declaredAmount: 150000, approvedAmount: 0, proofUploaded: true, proofFileName: 'ppf_statement.pdf', status: 'Pending' },
  { id: 'd14', section: '80D', category: 'Health Insurance', declaredAmount: 25000, approvedAmount: 0, proofUploaded: false, proofFileName: null, status: 'Pending' },
  { id: 'd15', section: '80E', category: 'Education Loan', declaredAmount: 25000, approvedAmount: 0, proofUploaded: false, proofFileName: null, status: 'Pending' }],

  comments: [],
  history: [
  { id: 'h13', action: 'Declaration Started', performedBy: 'Rahul Verma', timestamp: '2025-01-19T16:00:00', details: 'Partial submission - proofs pending' }]

},
{
  id: '8',
  employeeId: 'EMP008',
  name: 'Meera Joshi',
  email: 'meera.joshi@company.com',
  phone: '+91 98765 43217',
  department: 'Admin',
  designation: 'Admin Executive',
  joiningDate: '2023-02-01',
  regime: 'New',
  declarationSubmitted: 'Yes',
  submittedDate: '2025-01-08',
  totalDeclaredAmount: 75000,
  declarationStatus: 'Complete',
  lastReminderSent: null,
  reminderCount: 0,
  proofStatus: 'All Uploaded',
  verificationStatus: 'Verified',
  declarations: [
  { id: 'd16', section: '80C', category: 'ELSS', declaredAmount: 50000, approvedAmount: 50000, proofUploaded: true, proofFileName: 'elss.pdf', status: 'Approved' },
  { id: 'd17', section: '80D', category: 'Health Insurance', declaredAmount: 25000, approvedAmount: 25000, proofUploaded: true, proofFileName: 'health.pdf', status: 'Approved' }],

  comments: [
  { id: 'c3', author: 'HR Admin', text: 'Approved', timestamp: '2025-01-09T11:00:00' }],

  history: [
  { id: 'h14', action: 'Declaration Submitted', performedBy: 'Meera Joshi', timestamp: '2025-01-08T10:30:00', details: 'Complete submission' },
  { id: 'h15', action: 'Verified', performedBy: 'HR Admin', timestamp: '2025-01-09T11:00:00', details: 'Approved' }]

}];


// Utility Functions
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function InvestmentDeclarationStatus() {
  // State Management
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    fiscalYear: '2024-25',
    department: 'all',
    status: 'all',
    regime: 'all',
    proofStatus: 'all'
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  // Modal States
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showBulkReminderModal, setShowBulkReminderModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // Selected Item States
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'declarations' | 'documents' | 'history' | 'comments'>('declarations');

  // Loading States
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Form States
  const [reminderMessage, setReminderMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel');

  // Notification State
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: ''
  });

  // Computed Statistics
  const statistics = useMemo(() => {
    const total = employees.length;
    const submitted = employees.filter(
      (e) => e.declarationSubmitted === 'Yes' && e.declarationStatus === 'Complete'
    ).length;
    const pending = employees.filter(
      (e) => e.declarationSubmitted === 'Partial' || e.declarationStatus === 'Partial'
    ).length;
    const notStarted = employees.filter((e) => e.declarationSubmitted === 'No').length;
    const underReview = employees.filter((e) => e.declarationStatus === 'Under Review').length;

    return {
      total,
      submitted,
      pending,
      notStarted,
      underReview,
      submittedPercentage: total > 0 ? Math.round(submitted / total * 100) : 0,
      pendingPercentage: total > 0 ? Math.round(pending / total * 100) : 0,
      notStartedPercentage: total > 0 ? Math.round(notStarted / total * 100) : 0,
      totalDeclaredAmount: employees.reduce((sum, e) => sum + e.totalDeclaredAmount, 0)
    };
  }, [employees]);

  // Filtered and Sorted Data
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
        e.name.toLowerCase().includes(searchLower) ||
        e.employeeId.toLowerCase().includes(searchLower) ||
        e.email.toLowerCase().includes(searchLower) ||
        e.department.toLowerCase().includes(searchLower)
      );
    }

    // Department filter
    if (filters.department !== 'all') {
      result = result.filter((e) => e.department.toLowerCase() === filters.department);
    }

    // Status filter
    if (filters.status !== 'all') {
      result = result.filter((e) => {
        switch (filters.status) {
          case 'submitted':
            return e.declarationStatus === 'Complete';
          case 'pending':
            return e.declarationStatus === 'Partial';
          case 'not-started':
            return e.declarationStatus === 'Not Started';
          case 'under-review':
            return e.declarationStatus === 'Under Review';
          default:
            return true;
        }
      });
    }

    // Regime filter
    if (filters.regime !== 'all') {
      result = result.filter((e) => e.regime.toLowerCase() === filters.regime);
    }

    // Proof status filter
    if (filters.proofStatus !== 'all') {
      result = result.filter((e) => {
        switch (filters.proofStatus) {
          case 'uploaded':
            return e.proofStatus === 'All Uploaded';
          case 'partial':
            return e.proofStatus === 'Partial';
          case 'none':
            return e.proofStatus === 'None';
          default:
            return true;
        }
      });
    }

    // Sorting
    result.sort((a, b) => {
      let aValue: any = a[sortConfig.key];
      let bValue: any = b[sortConfig.key];

      if (sortConfig.key === 'totalDeclaredAmount') {
        aValue = a.totalDeclaredAmount;
        bValue = b.totalDeclaredAmount;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, filters, sortConfig]);

  // Pagination
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Auto-dismiss notifications
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('investmentDeclarations');
    if (savedData) {
      try {
        setEmployees(JSON.parse(savedData));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('investmentDeclarations', JSON.stringify(employees));
  }, [employees]);

  // Show notification
  const showNotification = (type: Notification['type'], message: string) => {
    setNotification({ show: true, type, message });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      fiscalYear: '2024-25',
      department: 'all',
      status: 'all',
      regime: 'all',
      proofStatus: 'all'
    });
    setCurrentPage(1);
    showNotification('info', 'Filters reset');
  };

  // Handle sort
  const handleSort = (key: SortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Handle view details
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setActiveTab('declarations');
    setShowDetailModal(true);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
    setActiveTab('declarations');
  };

  // Handle send reminder to single employee
  const handleOpenReminderModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setReminderMessage(
      `Dear ${employee.name},\n\nThis is a reminder to submit your investment declaration for FY ${filters.fiscalYear}. The deadline is approaching soon.\n\nPlease complete your declaration at the earliest.\n\nRegards,\nHR Team`
    );
    setShowReminderModal(true);
  };

  // Close reminder modal
  const handleCloseReminderModal = () => {
    setShowReminderModal(false);
    setSelectedEmployee(null);
    setReminderMessage('');
  };

  // Send reminder
  const handleSendReminder = async () => {
    if (!selectedEmployee) return;

    setIsSendingReminder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setEmployees((prev) =>
      prev.map((e) =>
      e.id === selectedEmployee.id ?
      {
        ...e,
        lastReminderSent: new Date().toISOString(),
        reminderCount: e.reminderCount + 1,
        history: [
        ...e.history,
        {
          id: generateId(),
          action: 'Reminder Sent',
          performedBy: 'HR Admin',
          timestamp: new Date().toISOString(),
          details: 'Manual reminder sent'
        }]

      } :
      e
      )
      );

      handleCloseReminderModal();
      showNotification('success', `Reminder sent to ${selectedEmployee.name}`);
    } catch (error) {
      showNotification('error', 'Failed to send reminder');
    } finally {
      setIsSendingReminder(false);
    }
  };

  // Handle bulk reminder
  const handleOpenBulkReminderModal = () => {
    const pendingEmployees = employees.filter(
      (e) => e.declarationStatus === 'Not Started' || e.declarationStatus === 'Partial'
    );
    if (pendingEmployees.length === 0) {
      showNotification('info', 'No pending declarations to remind');
      return;
    }
    setReminderMessage(
      `Dear Employee,\n\nThis is a reminder to submit your investment declaration for FY ${filters.fiscalYear}. The deadline is 31st January 2025.\n\nPlease complete your declaration at the earliest to ensure accurate tax calculations.\n\nRegards,\nHR Team`
    );
    setShowBulkReminderModal(true);
  };

  // Close bulk reminder modal
  const handleCloseBulkReminderModal = () => {
    setShowBulkReminderModal(false);
    setReminderMessage('');
  };

  // Send bulk reminders
  const handleSendBulkReminders = async () => {
    setIsSendingReminder(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const pendingIds = employees.
      filter((e) => e.declarationStatus === 'Not Started' || e.declarationStatus === 'Partial').
      map((e) => e.id);

      setEmployees((prev) =>
      prev.map((e) =>
      pendingIds.includes(e.id) ?
      {
        ...e,
        lastReminderSent: new Date().toISOString(),
        reminderCount: e.reminderCount + 1,
        history: [
        ...e.history,
        {
          id: generateId(),
          action: 'Reminder Sent',
          performedBy: 'HR Admin',
          timestamp: new Date().toISOString(),
          details: 'Bulk reminder sent'
        }]

      } :
      e
      )
      );

      handleCloseBulkReminderModal();
      showNotification('success', `Reminders sent to ${pendingIds.length} employees`);
    } catch (error) {
      showNotification('error', 'Failed to send reminders');
    } finally {
      setIsSendingReminder(false);
    }
  };

  // Handle export
  const handleOpenExportModal = () => {
    setShowExportModal(true);
  };

  // Close export modal
  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setExportFormat('excel');
  };

  // Export report
  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const dataToExport = selectedEmployees.length > 0 ?
      filteredEmployees.filter((e) => selectedEmployees.includes(e.id)) :
      filteredEmployees;

      if (exportFormat === 'csv') {
        exportAsCSV(dataToExport);
      } else if (exportFormat === 'excel') {
        exportAsExcel(dataToExport);
      } else if (exportFormat === 'pdf') {
        exportAsPDF(dataToExport);
      }

      handleCloseExportModal();
      showNotification('success', `Report exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      showNotification('error', 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Export as CSV
  const exportAsCSV = (data: Employee[]) => {
    const headers = [
    'Employee ID',
    'Name',
    'Department',
    'Regime',
    'Declaration Status',
    'Submitted Date',
    'Total Declared Amount',
    'Verification Status'];


    const rows = data.map((e) => [
    e.employeeId,
    e.name,
    e.department,
    e.regime,
    e.declarationStatus,
    e.submittedDate || '-',
    e.totalDeclaredAmount,
    e.verificationStatus]
    );

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadFile(csvContent, `investment-declaration-status-${filters.fiscalYear}.csv`, 'text/csv');
  };

  // Export as Excel (CSV with .xlsx for demo)
  const exportAsExcel = (data: Employee[]) => {
    exportAsCSV(data);
  };

  // Export as PDF (text format for demo)
  const exportAsPDF = (data: Employee[]) => {
    const content = `
Investment Declaration Status Report
FY: ${filters.fiscalYear}
Generated: ${new Date().toLocaleString()}

${'='.repeat(60)}

${data.
    map(
      (e) => `
${e.employeeId} - ${e.name}
Department: ${e.department}
Regime: ${e.regime}
Status: ${e.declarationStatus}
Declared Amount: ${formatCurrency(e.totalDeclaredAmount)}
`
    ).
    join('\n' + '-'.repeat(40) + '\n')}

${'='.repeat(60)}
Total Employees: ${data.length}
Total Declared Amount: ${formatCurrency(data.reduce((sum, e) => sum + e.totalDeclaredAmount, 0))}
    `.trim();

    downloadFile(content, `investment-declaration-status-${filters.fiscalYear}.txt`, 'text/plain');
  };

  // Download file utility
  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, would fetch fresh data from API
      showNotification('success', 'Data refreshed');
    } catch (error) {
      showNotification('error', 'Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle select employee
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
    prev.includes(employeeId) ?
    prev.filter((id) => id !== employeeId) :
    [...prev, employeeId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedEmployees.length === paginatedEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(paginatedEmployees.map((e) => e.id));
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedEmployees([]);
  };

  // Handle add comment
  const handleOpenCommentModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewComment('');
    setShowCommentModal(true);
  };

  // Close comment modal
  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setSelectedEmployee(null);
    setNewComment('');
  };

  // Save comment
  const handleSaveComment = async () => {
    if (!selectedEmployee || !newComment.trim()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const comment: Comment = {
        id: generateId(),
        author: 'HR Admin',
        text: newComment.trim(),
        timestamp: new Date().toISOString()
      };

      setEmployees((prev) =>
      prev.map((e) =>
      e.id === selectedEmployee.id ?
      {
        ...e,
        comments: [...e.comments, comment],
        history: [
        ...e.history,
        {
          id: generateId(),
          action: 'Comment Added',
          performedBy: 'HR Admin',
          timestamp: new Date().toISOString(),
          details: `Comment: "${newComment.trim().substring(0, 50)}..."`
        }]

      } :
      e
      )
      );

      handleCloseCommentModal();
      showNotification('success', 'Comment added');
    } catch (error) {
      showNotification('error', 'Failed to add comment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle view history
  const handleOpenHistoryModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowHistoryModal(true);
  };

  // Close history modal
  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedEmployee(null);
  };

  // Handle verification
  const handleOpenVerificationModal = (employee: Employee) => {
    if (employee.declarationStatus === 'Not Started') {
      showNotification('info', 'No declarations to verify');
      return;
    }
    setSelectedEmployee(employee);
    setShowVerificationModal(true);
  };

  // Close verification modal
  const handleCloseVerificationModal = () => {
    setShowVerificationModal(false);
    setSelectedEmployee(null);
  };

  // Approve declaration
  const handleApproveDeclaration = async (declarationId: string) => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === selectedEmployee.id) {
          const updatedDeclarations = e.declarations.map((d) =>
          d.id === declarationId ?
          { ...d, status: 'Approved' as const, approvedAmount: d.declaredAmount } :
          d
          );
          const allApproved = updatedDeclarations.every((d) => d.status === 'Approved');
          return {
            ...e,
            declarations: updatedDeclarations,
            verificationStatus: allApproved ? 'Verified' : 'Pending',
            declarationStatus: allApproved ? 'Complete' : e.declarationStatus,
            history: [
            ...e.history,
            {
              id: generateId(),
              action: 'Declaration Approved',
              performedBy: 'HR Admin',
              timestamp: new Date().toISOString(),
              details: `Declaration ID: ${declarationId}`
            }]

          };
        }
        return e;
      })
      );

      // Update selected employee
      setSelectedEmployee((prev) => {
        if (!prev) return null;
        const updatedDeclarations = prev.declarations.map((d) =>
        d.id === declarationId ?
        { ...d, status: 'Approved' as const, approvedAmount: d.declaredAmount } :
        d
        );
        return { ...prev, declarations: updatedDeclarations };
      });

      showNotification('success', 'Declaration approved');
    } catch (error) {
      showNotification('error', 'Failed to approve');
    } finally {
      setIsLoading(false);
    }
  };

  // Reject declaration
  const handleRejectDeclaration = async (declarationId: string) => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === selectedEmployee.id) {
          const updatedDeclarations = e.declarations.map((d) =>
          d.id === declarationId ?
          { ...d, status: 'Rejected' as const, approvedAmount: 0 } :
          d
          );
          return {
            ...e,
            declarations: updatedDeclarations,
            verificationStatus: 'Rejected',
            history: [
            ...e.history,
            {
              id: generateId(),
              action: 'Declaration Rejected',
              performedBy: 'HR Admin',
              timestamp: new Date().toISOString(),
              details: `Declaration ID: ${declarationId}`
            }]

          };
        }
        return e;
      })
      );

      // Update selected employee
      setSelectedEmployee((prev) => {
        if (!prev) return null;
        const updatedDeclarations = prev.declarations.map((d) =>
        d.id === declarationId ?
        { ...d, status: 'Rejected' as const, approvedAmount: 0 } :
        d
        );
        return { ...prev, declarations: updatedDeclarations };
      });

      showNotification('success', 'Declaration rejected');
    } catch (error) {
      showNotification('error', 'Failed to reject');
    } finally {
      setIsLoading(false);
    }
  };

  // Approve all declarations for employee
  const handleApproveAll = async () => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === selectedEmployee.id) {
          const updatedDeclarations = e.declarations.map((d) => ({
            ...d,
            status: 'Approved' as const,
            approvedAmount: d.declaredAmount
          }));
          return {
            ...e,
            declarations: updatedDeclarations,
            verificationStatus: 'Verified',
            declarationStatus: 'Complete',
            history: [
            ...e.history,
            {
              id: generateId(),
              action: 'All Declarations Approved',
              performedBy: 'HR Admin',
              timestamp: new Date().toISOString(),
              details: `${updatedDeclarations.length} declarations approved`
            }]

          };
        }
        return e;
      })
      );

      handleCloseVerificationModal();
      showNotification('success', 'All declarations approved');
    } catch (error) {
      showNotification('error', 'Failed to approve');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy employee ID
  const handleCopyEmployeeId = async (employeeId: string) => {
    try {
      await navigator.clipboard.writeText(employeeId);
      showNotification('success', `Copied: ${employeeId}`);
    } catch (error) {
      showNotification('error', 'Failed to copy');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :

    <ChevronDown className="w-3 h-3 text-blue-600" />;

  };

  // Check if has active filters
  const hasActiveFilters =
  filters.search !== '' ||
  filters.department !== 'all' ||
  filters.status !== 'all' ||
  filters.regime !== 'all' ||
  filters.proofStatus !== 'all';

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification.show &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        notification.type === 'success' ?
        'bg-green-50 border border-green-200' :
        notification.type === 'error' ?
        'bg-red-50 border border-red-200' :
        notification.type === 'warning' ?
        'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'}`
        }>

          {notification.type === 'success' ?
        <CheckCircle className="w-5 h-5 text-green-600" /> :
        notification.type === 'error' ?
        <XCircle className="w-5 h-5 text-red-600" /> :
        notification.type === 'warning' ?
        <AlertCircle className="w-5 h-5 text-yellow-600" /> :

        <Info className="w-5 h-5 text-blue-600" />
        }
          <span
          className={
          notification.type === 'success' ?
          'text-green-800' :
          notification.type === 'error' ?
          'text-red-800' :
          notification.type === 'warning' ?
          'text-yellow-800' :
          'text-blue-800'
          }>

            {notification.message}
          </span>
          <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700">

            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Investment Declaration Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Declaration Status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <RefreshCw className="w-4 h-4 mr-2" />
            }
            Refresh
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleOpenBulkReminderModal}>
            <Bell className="w-4 h-4 mr-2" />
            Send Reminders
          </Button>
          <Button variant="primary" onClick={handleOpenExportModal}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          className="p-4 border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleFilterChange('status', 'all')}>

          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleFilterChange('status', 'submitted')}>

          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              {statistics.submittedPercentage}%
            </span>
          </div>
          <p className="text-2xl font-bold text-green-700">{statistics.submitted}</p>
          <p className="text-sm text-gray-600">Submitted</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleFilterChange('status', 'pending')}>

          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">
              {statistics.pendingPercentage}%
            </span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{statistics.pending}</p>
          <p className="text-sm text-gray-600">Pending</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-red-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleFilterChange('status', 'not-started')}>

          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-xs text-red-600 font-medium">
              {statistics.notStartedPercentage}%
            </span>
          </div>
          <p className="text-2xl font-bold text-red-700">{statistics.notStarted}</p>
          <p className="text-sm text-gray-600">Not Started</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters</span>
            {hasActiveFilters &&
            <button
              onClick={handleResetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline">

                Reset all
              </button>
            }
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="text-sm text-gray-600 hover:text-gray-800">

            {showFilterPanel ? 'Hide advanced' : 'Show advanced'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search employee..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)} />

            {filters.search &&
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                <X className="w-4 h-4" />
              </button>
            }
          </div>
          <Select
            options={FISCAL_YEARS}
            value={filters.fiscalYear}
            onChange={(value) => handleFilterChange('fiscalYear', value)} />

          <Select
            options={DEPARTMENTS}
            value={filters.department}
            onChange={(value) => handleFilterChange('department', value)} />

          <Select
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)} />

        </div>

        {showFilterPanel &&
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <Select
            label="Tax Regime"
            options={REGIME_OPTIONS}
            value={filters.regime}
            onChange={(value) => handleFilterChange('regime', value)} />

            <Select
            label="Proof Status"
            options={PROOF_STATUS_OPTIONS}
            value={filters.proofStatus}
            onChange={(value) => handleFilterChange('proofStatus', value)} />

          </div>
        }
      </Card>

      {/* Selection Actions */}
      {selectedEmployees.length > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium text-blue-800">
                {selectedEmployees.length} employee(s) selected
              </span>
              <button
              onClick={handleClearSelection}
              className="text-sm text-blue-600 hover:text-blue-800 underline">

                Clear selection
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const selectedEmps = employees.filter((e) =>
                selectedEmployees.includes(e.id)
                );
                const pendingEmps = selectedEmps.filter(
                  (e) =>
                  e.declarationStatus === 'Not Started' ||
                  e.declarationStatus === 'Partial'
                );
                if (pendingEmps.length === 0) {
                  showNotification('info', 'No pending declarations in selection');
                  return;
                }
                handleOpenBulkReminderModal();
              }}>

                <Bell className="w-4 h-4 mr-1" />
                Send Reminder
              </Button>
              <Button variant="outline" size="sm" onClick={handleOpenExportModal}>
                <Download className="w-4 h-4 mr-1" />
                Export Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Declaration Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                    selectedEmployees.length === paginatedEmployees.length &&
                    paginatedEmployees.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded" />

                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-1">
                    Employee Name
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('regime')}>

                  <div className="flex items-center justify-center gap-1">
                    Regime
                    {renderSortIndicator('regime')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Declaration Submitted
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('submittedDate')}>

                  <div className="flex items-center gap-1">
                    Submitted Date
                    {renderSortIndicator('submittedDate')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('totalDeclaredAmount')}>

                  <div className="flex items-center justify-end gap-1">
                    Total Declared Amount
                    {renderSortIndicator('totalDeclaredAmount')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-gray-800"
                  onClick={() => handleSort('declarationStatus')}>

                  <div className="flex items-center justify-center gap-1">
                    Declaration Status
                    {renderSortIndicator('declarationStatus')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployees.length === 0 ?
              <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No employees found</p>
                    {hasActiveFilters &&
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline">

                        Clear filters
                      </button>
                  }
                  </td>
                </tr> :

              paginatedEmployees.map((employee) =>
              <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleSelectEmployee(employee.id)}
                    className="rounded" />

                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-gray-500">{employee.employeeId}</p>
                            <button
                          onClick={() => handleCopyEmployeeId(employee.employeeId)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy ID">

                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    employee.regime === 'New' ?
                    'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                    }>

                        {employee.regime}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    employee.declarationSubmitted === 'Yes' ?
                    'bg-green-100 text-green-700' :
                    employee.declarationSubmitted === 'Partial' ?
                    'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                    }>

                        {employee.declarationSubmitted === 'Yes' ?
                    <CheckCircle className="w-3 h-3 mr-1" /> :
                    employee.declarationSubmitted === 'Partial' ?
                    <Clock className="w-3 h-3 mr-1" /> :

                    <XCircle className="w-3 h-3 mr-1" />
                    }
                        {employee.declarationSubmitted}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(employee.submittedDate)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {employee.totalDeclaredAmount > 0 ?
                  formatCurrency(employee.totalDeclaredAmount) :
                  '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    employee.declarationStatus === 'Complete' ?
                    'bg-green-100 text-green-700 border border-green-300' :
                    employee.declarationStatus === 'Partial' ?
                    'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                    employee.declarationStatus === 'Under Review' ?
                    'bg-blue-100 text-blue-700 border border-blue-300' :
                    'bg-red-100 text-red-700 border border-red-300'
                    }>

                        {employee.declarationStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(employee)}
                      title="View Details">

                          <Eye className="w-4 h-4" />
                        </Button>
                        {(employee.declarationStatus === 'Not Started' ||
                    employee.declarationStatus === 'Partial') &&
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenReminderModal(employee)}
                      title="Send Reminder">

                            <Bell className="w-4 h-4" />
                          </Button>
                    }
                        {employee.declarationStatus !== 'Not Started' &&
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenVerificationModal(employee)}
                      title="Verify">

                            <Check className="w-4 h-4" />
                          </Button>
                    }
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenCommentModal(employee)}
                      title="Add Comment">

                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenHistoryModal(employee)}
                      title="View History">

                          <History className="w-4 h-4" />
                        </Button>
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
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of{' '}
              {filteredEmployees.length} employees
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm">

                {ITEMS_PER_PAGE_OPTIONS.map((option) =>
                <option key={option} value={option}>
                    {option}
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>

              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
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
                  onClick={() => handlePageChange(pageNum)}>

                  {pageNum}
                </Button>);

            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}>

              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Alert Banner */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">
              Declaration Deadline Approaching
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              {statistics.notStarted + statistics.pending} employees have not completed their
              investment declarations. The deadline is 31st January 2025. Please remind them to
              complete their declarations.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenBulkReminderModal}
            className="border-yellow-600 text-yellow-700 hover:bg-yellow-100">

            <Send className="w-4 h-4 mr-1" />
            Send Bulk Reminder
          </Button>
        </div>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.employeeId} • {selectedEmployee.department} •{' '}
                    {selectedEmployee.designation}
                  </p>
                </div>
                <button
                onClick={handleCloseDetailModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Employee Summary */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Regime</p>
                  <p className="font-medium">{selectedEmployee.regime}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium">{selectedEmployee.declarationStatus}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Declared</p>
                  <p className="font-medium">
                    {formatCurrency(selectedEmployee.totalDeclaredAmount)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Verification</p>
                  <p className="font-medium">{selectedEmployee.verificationStatus}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-4 border-b">
                {(['declarations', 'documents', 'history', 'comments'] as const).map((tab) =>
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ?
                'border-blue-600 text-blue-600' :
                'border-transparent text-gray-500 hover:text-gray-700'}`
                }>

                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {tab === 'comments' && selectedEmployee.comments.length > 0 &&
                <span className="ml-1 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {selectedEmployee.comments.length}
                      </span>
                }
                  </button>
              )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'declarations' &&
            <div className="space-y-3">
                  {selectedEmployee.declarations.length === 0 ?
              <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No declarations submitted</p>
                    </div> :

              selectedEmployee.declarations.map((declaration) =>
              <div
                key={declaration.id}
                className="p-4 border rounded-lg flex items-center justify-between">

                        <div>
                          <p className="font-medium text-gray-900">
                            {declaration.section} - {declaration.category}
                          </p>
                          <p className="text-sm text-gray-500">
                            Declared: {formatCurrency(declaration.declaredAmount)}
                            {declaration.approvedAmount > 0 &&
                    <span className="text-green-600 ml-2">
                                Approved: {formatCurrency(declaration.approvedAmount)}
                              </span>
                    }
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                    className={
                    declaration.status === 'Approved' ?
                    'bg-green-100 text-green-700' :
                    declaration.status === 'Rejected' ?
                    'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                    }>

                            {declaration.status}
                          </Badge>
                          {declaration.proofUploaded &&
                  <Badge className="bg-blue-100 text-blue-700">
                              <FileText className="w-3 h-3 mr-1" />
                              Proof
                            </Badge>
                  }
                        </div>
                      </div>
              )
              }
                </div>
            }

              {activeTab === 'documents' &&
            <div className="space-y-3">
                  {selectedEmployee.declarations.filter((d) => d.proofUploaded).length === 0 ?
              <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded</p>
                    </div> :

              selectedEmployee.declarations.
              filter((d) => d.proofUploaded).
              map((declaration) =>
              <div
                key={declaration.id}
                className="p-4 border rounded-lg flex items-center justify-between">

                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {declaration.proofFileName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {declaration.section} - {declaration.category}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
              )
              }
                </div>
            }

              {activeTab === 'history' &&
            <div className="space-y-3">
                  {selectedEmployee.history.length === 0 ?
              <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No history available</p>
                    </div> :

              <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      {selectedEmployee.history.map((entry, index) =>
                <div key={entry.id} className="relative pl-10 pb-6">
                          <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{entry.action}</p>
                              <p className="text-xs text-gray-500">
                                {formatDateTime(entry.timestamp)}
                              </p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                            <p className="text-xs text-gray-400 mt-1">By: {entry.performedBy}</p>
                          </div>
                        </div>
                )}
                    </div>
              }
                </div>
            }

              {activeTab === 'comments' &&
            <div className="space-y-4">
                  {selectedEmployee.comments.length === 0 ?
              <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No comments yet</p>
                    </div> :

              selectedEmployee.comments.map((comment) =>
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">{comment.author}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(comment.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
              )
              }
                  <div className="pt-4 border-t">
                    <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-3 border rounded-lg text-sm resize-none"
                  rows={3} />

                    <div className="flex justify-end mt-2">
                      <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (newComment.trim()) {
                        handleSaveComment();
                      }
                    }}
                    disabled={!newComment.trim() || isLoading}>

                        {isLoading ?
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

                    <Send className="w-4 h-4 mr-1" />
                    }
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="p-4 border-t flex gap-2 justify-end">
              {selectedEmployee.declarationStatus !== 'Not Started' &&
            <Button
              variant="outline"
              onClick={() => {
                handleCloseDetailModal();
                handleOpenVerificationModal(selectedEmployee);
              }}>

                  <Check className="w-4 h-4 mr-2" />
                  Verify Declarations
                </Button>
            }
              {(selectedEmployee.declarationStatus === 'Not Started' ||
            selectedEmployee.declarationStatus === 'Partial') &&
            <Button
              variant="outline"
              onClick={() => {
                handleCloseDetailModal();
                handleOpenReminderModal(selectedEmployee);
              }}>

                  <Bell className="w-4 h-4 mr-2" />
                  Send Reminder
                </Button>
            }
              <Button variant="outline" onClick={handleCloseDetailModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Reminder Modal */}
      {showReminderModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Send Reminder</h2>
                <button
                onClick={handleCloseReminderModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{selectedEmployee.name}</p>
                <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                {selectedEmployee.lastReminderSent &&
              <p className="text-xs text-gray-400 mt-1">
                    Last reminder: {formatDate(selectedEmployee.lastReminderSent)} (
                    {selectedEmployee.reminderCount} sent)
                  </p>
              }
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm resize-none"
                rows={6} />

              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseReminderModal}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSendReminder}
                disabled={isSendingReminder || !reminderMessage.trim()}>

                  {isSendingReminder ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </> :

                <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Reminder
                    </>
                }
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Bulk Reminder Modal */}
      {showBulkReminderModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Send Bulk Reminders</h2>
                <button
                onClick={handleCloseBulkReminderModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This will send reminders to{' '}
                  <strong>
                    {
                  employees.filter(
                    (e) =>
                    e.declarationStatus === 'Not Started' ||
                    e.declarationStatus === 'Partial'
                  ).length
                  }
                  </strong>{' '}
                  employees with pending declarations.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Template
                </label>
                <textarea
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm resize-none"
                rows={6} />

              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseBulkReminderModal}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSendBulkReminders}
                disabled={isSendingReminder || !reminderMessage.trim()}>

                  {isSendingReminder ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </> :

                <>
                      <Send className="w-4 h-4 mr-2" />
                      Send to All
                    </>
                }
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Export Report</h2>
                <button
                onClick={handleCloseExportModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Exporting {selectedEmployees.length > 0 ? selectedEmployees.length : filteredEmployees.length} employee records
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['csv', 'excel', 'pdf'] as const).map((format) =>
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  exportFormat === format ?
                  'bg-blue-600 text-white border-blue-600' :
                  'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`
                  }>

                      {format.toUpperCase()}
                    </button>
                )}
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseExportModal}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleExportReport}
                disabled={isExporting}>

                  {isExporting ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Exporting...
                    </> :

                <>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </>
                }
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Verification Modal */}
      {showVerificationModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Verify Declarations</h2>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.name} • {selectedEmployee.employeeId}
                  </p>
                </div>
                <button
                onClick={handleCloseVerificationModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedEmployee.declarations.map((declaration) =>
              <div
                key={declaration.id}
                className="p-4 border rounded-lg">

                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {declaration.section} - {declaration.category}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Declared: {formatCurrency(declaration.declaredAmount)}
                        </p>
                        {declaration.proofUploaded &&
                    <div className="flex items-center gap-2 mt-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-blue-600">
                              {declaration.proofFileName}
                            </span>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                    }
                      </div>
                      <div className="flex items-center gap-2">
                        {declaration.status === 'Pending' ?
                    <>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveDeclaration(declaration.id)}
                        disabled={isLoading}
                        className="text-green-600 border-green-300 hover:bg-green-50">

                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectDeclaration(declaration.id)}
                        disabled={isLoading}
                        className="text-red-600 border-red-300 hover:bg-red-50">

                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </> :

                    <Badge
                      className={
                      declaration.status === 'Approved' ?
                      'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                      }>

                            {declaration.status}
                          </Badge>
                    }
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div className="p-4 border-t flex gap-2 justify-end">
              {selectedEmployee.declarations.some((d) => d.status === 'Pending') &&
            <Button
              variant="primary"
              onClick={handleApproveAll}
              disabled={isLoading}>

                  {isLoading ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <CheckCircle className="w-4 h-4 mr-2" />
              }
                  Approve All
                </Button>
            }
              <Button variant="outline" onClick={handleCloseVerificationModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Activity History</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
                <button
                onClick={handleCloseHistoryModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {selectedEmployee.history.length === 0 ?
            <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No history available</p>
                </div> :

            <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  {selectedEmployee.history.map((entry) =>
              <div key={entry.id} className="relative pl-10 pb-6">
                      <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(entry.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        <p className="text-xs text-gray-400 mt-1">By: {entry.performedBy}</p>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>

            <div className="p-4 border-t">
              <Button variant="outline" onClick={handleCloseHistoryModal} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Comment Modal */}
      {showCommentModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Add Comment</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
                <button
                onClick={handleCloseCommentModal}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4">
                <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
                className="w-full p-3 border rounded-lg text-sm resize-none"
                rows={4} />

              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseCommentModal}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={handleSaveComment}
                disabled={!newComment.trim() || isLoading}>

                  {isLoading ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </> :

                <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Comment
                    </>
                }
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}