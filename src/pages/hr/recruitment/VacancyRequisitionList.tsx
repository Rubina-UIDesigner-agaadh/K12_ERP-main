import React, { useMemo, useState, useCallback } from 'react';
import {
  Building,
  X,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  FileText,
  Users,
  Calendar,
  Briefcase,
  RefreshCw,
  MoreVertical,
  Loader2,
  Save,
  Trash2 } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';

const BRANCHES = [
{ id: 'all', name: 'All Branches' },
{ id: 'main', name: 'Main Campus' },
{ id: 'north', name: 'North Wing' },
{ id: 'south', name: 'South Wing' },
{ id: 'east', name: 'East Campus' }];


const ACADEMIC_YEARS = [
{ value: '2024-2025', label: '2024-2025' },
{ value: '2023-2024', label: '2023-2024' },
{ value: '2022-2023', label: '2022-2023' }];


const DEPARTMENTS = [
'Mathematics',
'Science',
'English',
'Computer Science',
'Physical Education',
'Arts',
'Library',
'Administration',
'Social Studies',
'Languages'];


const POSITIONS = [
'Senior Teacher',
'Junior Teacher',
'Teacher',
'HOD',
'Lab Assistant',
'Librarian',
'Admin Officer',
'Clerk',
'Counselor',
'Sports Coach'];


const SUBJECTS = [
'Mathematics',
'Physics',
'Chemistry',
'Biology',
'English Literature',
'English Grammar',
'Computer Science',
'Fine Arts',
'Hindi',
'History',
'Geography',
'Economics'];


type ReqStatus = 'Draft' | 'Approved' | 'In Hiring' | 'Closed';
type Priority = 'High' | 'Medium' | 'Low';
type RoleType = 'Teaching' | 'Non-Teaching';
type EmpType = 'Full-time' | 'Contract' | 'Part-time';

interface Requisition {
  id: string;
  department: string;
  position: string;
  subject?: string;
  empType: EmpType;
  vacancies: number;
  requestedBy: string;
  priority: Priority;
  status: ReqStatus;
  requestedDate: string;
  expectedJoining: string;
  branch: string;
  roleType: RoleType;
  description?: string;
  qualifications?: string;
  experience?: string;
  salaryRange?: string;
  approvedBy?: string;
  approvedDate?: string;
  closedDate?: string;
  closedReason?: string;
}

interface RequisitionFormData {
  department: string;
  position: string;
  subject: string;
  empType: EmpType;
  vacancies: number;
  requestedBy: string;
  priority: Priority;
  expectedJoining: string;
  branch: string;
  roleType: RoleType;
  description: string;
  qualifications: string;
  experience: string;
  salaryRange: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const initialRequisitions: Requisition[] = [
{
  id: 'REQ-2024-001',
  department: 'Mathematics',
  position: 'Senior Math Teacher',
  subject: 'Mathematics',
  empType: 'Full-time',
  vacancies: 2,
  requestedBy: 'Dr. Amit Shah',
  priority: 'High',
  status: 'In Hiring',
  requestedDate: '2024-11-01',
  expectedJoining: '2025-01-15',
  branch: 'main',
  roleType: 'Teaching',
  description: 'Senior mathematics teacher for higher secondary classes',
  qualifications: 'M.Sc Mathematics, B.Ed',
  experience: '5+ years',
  salaryRange: '50,000 - 70,000'
},
{
  id: 'REQ-2024-002',
  department: 'Science',
  position: 'Physics Teacher',
  subject: 'Physics',
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: 'Mrs. Kavita',
  priority: 'High',
  status: 'Approved',
  requestedDate: '2024-11-05',
  expectedJoining: '2025-01-20',
  branch: 'main',
  roleType: 'Teaching',
  description: 'Physics teacher for classes 11 and 12',
  qualifications: 'M.Sc Physics, B.Ed',
  experience: '3+ years',
  salaryRange: '45,000 - 60,000',
  approvedBy: 'Principal',
  approvedDate: '2024-11-08'
},
{
  id: 'REQ-2024-003',
  department: 'Administration',
  position: 'Admin Officer',
  subject: undefined,
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: 'Mr. Rajan',
  priority: 'Medium',
  status: 'In Hiring',
  requestedDate: '2024-11-10',
  expectedJoining: '2025-02-01',
  branch: 'north',
  roleType: 'Non-Teaching',
  description: 'Administrative officer for North Wing campus',
  qualifications: 'Graduate with administrative experience',
  experience: '2+ years',
  salaryRange: '30,000 - 40,000'
},
{
  id: 'REQ-2024-004',
  department: 'English',
  position: 'English Teacher',
  subject: 'English Literature',
  empType: 'Contract',
  vacancies: 2,
  requestedBy: 'Ms. Priya',
  priority: 'Medium',
  status: 'Draft',
  requestedDate: '2024-11-15',
  expectedJoining: '2025-02-15',
  branch: 'north',
  roleType: 'Teaching',
  description: 'English literature teacher for middle school',
  qualifications: 'M.A English, B.Ed',
  experience: '2+ years',
  salaryRange: '35,000 - 45,000'
},
{
  id: 'REQ-2024-005',
  department: 'Computer Science',
  position: 'CS Teacher',
  subject: 'Computer Science',
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: 'Mr. Vikram',
  priority: 'High',
  status: 'Approved',
  requestedDate: '2024-11-20',
  expectedJoining: '2025-01-10',
  branch: 'south',
  roleType: 'Teaching',
  description: 'Computer Science teacher for senior secondary',
  qualifications: 'M.Tech/MCA, B.Ed preferred',
  experience: '4+ years',
  salaryRange: '55,000 - 75,000',
  approvedBy: 'Principal',
  approvedDate: '2024-11-22'
},
{
  id: 'REQ-2024-006',
  department: 'Physical Education',
  position: 'PE Teacher',
  subject: undefined,
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: 'Mr. Suresh',
  priority: 'Low',
  status: 'Closed',
  requestedDate: '2024-10-01',
  expectedJoining: '2024-12-01',
  branch: 'south',
  roleType: 'Teaching',
  description: 'Physical education teacher',
  qualifications: 'B.P.Ed',
  experience: '2+ years',
  salaryRange: '30,000 - 40,000',
  closedDate: '2024-11-15',
  closedReason: 'Position filled'
},
{
  id: 'REQ-2024-007',
  department: 'Arts',
  position: 'Art & Craft Teacher',
  subject: 'Fine Arts',
  empType: 'Contract',
  vacancies: 2,
  requestedBy: 'Mrs. Meera',
  priority: 'Medium',
  status: 'In Hiring',
  requestedDate: '2024-11-25',
  expectedJoining: '2025-03-01',
  branch: 'east',
  roleType: 'Teaching',
  description: 'Art and craft teacher for primary and middle school',
  qualifications: 'BFA/MFA',
  experience: '1+ years',
  salaryRange: '25,000 - 35,000'
},
{
  id: 'REQ-2024-008',
  department: 'Library',
  position: 'Librarian',
  subject: undefined,
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: 'Principal',
  priority: 'Low',
  status: 'Draft',
  requestedDate: '2024-12-01',
  expectedJoining: '2025-03-15',
  branch: 'east',
  roleType: 'Non-Teaching',
  description: 'Librarian for East Campus library',
  qualifications: 'B.Lib.Sc/M.Lib.Sc',
  experience: '2+ years',
  salaryRange: '25,000 - 35,000'
}];


const statusConfig: Record<ReqStatus, {color: string;icon: React.ElementType;bg: string;}> = {
  Draft: { color: 'text-gray-600', icon: FileText, bg: 'bg-gray-100' },
  Approved: { color: 'text-blue-600', icon: CheckCircle, bg: 'bg-blue-100' },
  'In Hiring': { color: 'text-orange-600', icon: Clock, bg: 'bg-orange-100' },
  Closed: { color: 'text-green-600', icon: CheckCircle, bg: 'bg-green-100' }
};

const priorityConfig: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-gray-100 text-gray-600'
};

const initialFormData: RequisitionFormData = {
  department: '',
  position: '',
  subject: '',
  empType: 'Full-time',
  vacancies: 1,
  requestedBy: '',
  priority: 'Medium',
  expectedJoining: '',
  branch: 'main',
  roleType: 'Teaching',
  description: '',
  qualifications: '',
  experience: '',
  salaryRange: ''
};

export function VacancyRequisitionList() {
  // Existing state
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRoleType, setFilterRoleType] = useState('all');
  const [filterDept, setFilterDept] = useState('all');

  // New state for interactive features
  const [requisitions, setRequisitions] = useState<Requisition[]>(initialRequisitions);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Selected requisition for operations
  const [selectedRequisition, setSelectedRequisition] = useState<Requisition | null>(null);

  // Form state
  const [formData, setFormData] = useState<RequisitionFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Close modal state
  const [closeReason, setCloseReason] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Toast functions
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Branch handling (existing)
  const handleBranchToggle = (branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      const without = selectedBranches.filter((b) => b !== 'all' && b !== branchId);
      const adding = !selectedBranches.includes(branchId);
      const next = adding ? [...without, branchId] : without;
      setSelectedBranches(next.length === 0 ? ['all'] : next);
    }
  };

  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;

  // Filtering (existing with pagination)
  const filtered = useMemo(() => {
    return requisitions.filter((r) => {
      const branchMatch = activeBranches.includes(r.branch);
      const searchMatch =
      !searchQuery ||
      r.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = filterStatus === 'all' || r.status === filterStatus;
      const roleMatch = filterRoleType === 'all' || r.roleType === filterRoleType;
      const deptMatch = filterDept === 'all' || r.department === filterDept;
      return branchMatch && searchMatch && statusMatch && roleMatch && deptMatch;
    });
  }, [activeBranches, searchQuery, filterStatus, filterRoleType, filterDept, requisitions]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  const departments = [...new Set(requisitions.map((r) => r.department))];

  // Generate new requisition ID
  const generateRequisitionId = () => {
    const year = new Date().getFullYear();
    const existingIds = requisitions.
    filter((r) => r.id.startsWith(`REQ-${year}`)).
    map((r) => parseInt(r.id.split('-')[2]));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `REQ-${year}-${String(nextNum).padStart(3, '0')}`;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.department) errors.department = 'Department is required';
    if (!formData.position) errors.position = 'Position is required';
    if (!formData.requestedBy) errors.requestedBy = 'Requested By is required';
    if (!formData.expectedJoining) errors.expectedJoining = 'Expected Joining Date is required';
    if (formData.vacancies < 1) errors.vacancies = 'At least 1 vacancy is required';
    if (formData.roleType === 'Teaching' && !formData.subject) {
      errors.subject = 'Subject is required for teaching positions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create new requisition
  const handleCreateRequisition = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newRequisition: Requisition = {
        id: generateRequisitionId(),
        department: formData.department,
        position: formData.position,
        subject: formData.roleType === 'Teaching' ? formData.subject : undefined,
        empType: formData.empType,
        vacancies: formData.vacancies,
        requestedBy: formData.requestedBy,
        priority: formData.priority,
        status: 'Draft',
        requestedDate: new Date().toISOString().split('T')[0],
        expectedJoining: formData.expectedJoining,
        branch: formData.branch,
        roleType: formData.roleType,
        description: formData.description,
        qualifications: formData.qualifications,
        experience: formData.experience,
        salaryRange: formData.salaryRange
      };

      setRequisitions((prev) => [newRequisition, ...prev]);
      setShowCreateModal(false);
      setFormData(initialFormData);
      setFormErrors({});
      addToast('success', `Requisition ${newRequisition.id} created successfully!`);
    } catch (error) {
      addToast('error', 'Failed to create requisition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Update requisition
  const handleUpdateRequisition = async () => {
    if (!selectedRequisition || !validateForm()) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRequisitions((prev) =>
      prev.map((r) =>
      r.id === selectedRequisition.id ?
      {
        ...r,
        department: formData.department,
        position: formData.position,
        subject: formData.roleType === 'Teaching' ? formData.subject : undefined,
        empType: formData.empType,
        vacancies: formData.vacancies,
        requestedBy: formData.requestedBy,
        priority: formData.priority,
        expectedJoining: formData.expectedJoining,
        branch: formData.branch,
        roleType: formData.roleType,
        description: formData.description,
        qualifications: formData.qualifications,
        experience: formData.experience,
        salaryRange: formData.salaryRange
      } :
      r
      )
      );

      setShowEditModal(false);
      setSelectedRequisition(null);
      setFormData(initialFormData);
      setFormErrors({});
      addToast('success', `Requisition ${selectedRequisition.id} updated successfully!`);
    } catch (error) {
      addToast('error', 'Failed to update requisition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Approve requisition
  const handleApproveRequisition = async () => {
    if (!selectedRequisition) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRequisitions((prev) =>
      prev.map((r) =>
      r.id === selectedRequisition.id ?
      {
        ...r,
        status: 'Approved' as ReqStatus,
        approvedBy: 'Current User',
        approvedDate: new Date().toISOString().split('T')[0]
      } :
      r
      )
      );

      setShowApproveModal(false);
      setSelectedRequisition(null);
      addToast('success', `Requisition ${selectedRequisition.id} approved successfully!`);
    } catch (error) {
      addToast('error', 'Failed to approve requisition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Close requisition
  const handleCloseRequisition = async () => {
    if (!selectedRequisition) return;

    if (!closeReason.trim()) {
      addToast('error', 'Please provide a reason for closing');
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRequisitions((prev) =>
      prev.map((r) =>
      r.id === selectedRequisition.id ?
      {
        ...r,
        status: 'Closed' as ReqStatus,
        closedDate: new Date().toISOString().split('T')[0],
        closedReason: closeReason
      } :
      r
      )
      );

      setShowCloseModal(false);
      setSelectedRequisition(null);
      setCloseReason('');
      addToast('success', `Requisition ${selectedRequisition.id} closed successfully!`);
    } catch (error) {
      addToast('error', 'Failed to close requisition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete requisition
  const handleDeleteRequisition = async () => {
    if (!selectedRequisition) return;

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRequisitions((prev) => prev.filter((r) => r.id !== selectedRequisition.id));

      setShowDeleteModal(false);
      setSelectedRequisition(null);
      addToast('success', `Requisition ${selectedRequisition.id} deleted successfully!`);
    } catch (error) {
      addToast('error', 'Failed to delete requisition. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Export to CSV
  const handleExport = async () => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const headers = [
      'Requisition ID',
      'Department',
      'Position',
      'Subject',
      'Employment Type',
      'Vacancies',
      'Requested By',
      'Priority',
      'Status',
      'Requested Date',
      'Expected Joining',
      'Branch',
      'Role Type',
      'Description',
      'Qualifications',
      'Experience',
      'Salary Range'];


      const csvData = filtered.map((r) => [
      r.id,
      r.department,
      r.position,
      r.subject || 'N/A',
      r.empType,
      r.vacancies,
      r.requestedBy,
      r.priority,
      r.status,
      r.requestedDate,
      r.expectedJoining,
      getBranchName(r.branch),
      r.roleType,
      r.description || '',
      r.qualifications || '',
      r.experience || '',
      r.salaryRange || '']
      );

      const csvContent = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(','))].
      join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Vacancy_Requisitions_${academicYear}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('success', 'Export completed successfully!');
    } catch (error) {
      addToast('error', 'Failed to export data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setRequisitions([...initialRequisitions]);
      setCurrentPage(1);
      addToast('info', 'Data refreshed successfully!');
    } catch (error) {
      addToast('error', 'Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Open view modal
  const openViewModal = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setShowViewModal(true);
  };

  // Open edit modal
  const openEditModal = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setFormData({
      department: requisition.department,
      position: requisition.position,
      subject: requisition.subject || '',
      empType: requisition.empType,
      vacancies: requisition.vacancies,
      requestedBy: requisition.requestedBy,
      priority: requisition.priority,
      expectedJoining: requisition.expectedJoining,
      branch: requisition.branch,
      roleType: requisition.roleType,
      description: requisition.description || '',
      qualifications: requisition.qualifications || '',
      experience: requisition.experience || '',
      salaryRange: requisition.salaryRange || ''
    });
    setShowEditModal(true);
  };

  // Open approve modal
  const openApproveModal = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setShowApproveModal(true);
  };

  // Open close modal
  const openCloseModal = (requisition: Requisition) => {
    setSelectedRequisition(requisition);
    setShowCloseModal(true);
  };

  // Open create modal
  const openCreateModal = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setShowCreateModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowApproveModal(false);
    setShowCloseModal(false);
    setShowDeleteModal(false);
    setSelectedRequisition(null);
    setFormData(initialFormData);
    setFormErrors({});
    setCloseReason('');
  };

  // Toast Notifications Component
  const ToastNotifications = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) =>
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ?
          'bg-green-500 text-white' :
          toast.type === 'error' ?
          'bg-red-500 text-white' :
          toast.type === 'warning' ?
          'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'}`
          }>

            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>);

  };

  // Requisition Form Component
  const RequisitionForm = ({ isEdit = false }: {isEdit?: boolean;}) =>
  <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
          value={formData.department}
          onChange={(e) => setFormData((prev) => ({ ...prev, department: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) =>
          <option key={dept} value={dept}>
                {dept}
              </option>
          )}
          </select>
          {formErrors.department &&
        <p className="text-sm text-red-600 mt-1">{formErrors.department}</p>
        }
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position <span className="text-red-500">*</span>
          </label>
          <select
          value={formData.position}
          onChange={(e) => setFormData((prev) => ({ ...prev, position: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="">Select Position</option>
            {POSITIONS.map((pos) =>
          <option key={pos} value={pos}>
                {pos}
              </option>
          )}
          </select>
          {formErrors.position &&
        <p className="text-sm text-red-600 mt-1">{formErrors.position}</p>
        }
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role Type</label>
          <select
          value={formData.roleType}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, roleType: e.target.value as RoleType }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>
        </div>

        {formData.roleType === 'Teaching' &&
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <select
          value={formData.subject}
          onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Subject</option>
              {SUBJECTS.map((sub) =>
          <option key={sub} value={sub}>
                  {sub}
                </option>
          )}
            </select>
            {formErrors.subject &&
        <p className="text-sm text-red-600 mt-1">{formErrors.subject}</p>
        }
          </div>
      }
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
          <select
          value={formData.empType}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, empType: e.target.value as EmpType }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vacancies <span className="text-red-500">*</span>
          </label>
          <input
          type="number"
          min="1"
          value={formData.vacancies}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, vacancies: parseInt(e.target.value) || 1 }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {formErrors.vacancies &&
        <p className="text-sm text-red-600 mt-1">{formErrors.vacancies}</p>
        }
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
          value={formData.priority}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, priority: e.target.value as Priority }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <select
          value={formData.branch}
          onChange={(e) => setFormData((prev) => ({ ...prev, branch: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">

            {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
          <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
          )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expected Joining Date <span className="text-red-500">*</span>
          </label>
          <input
          type="date"
          value={formData.expectedJoining}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, expectedJoining: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

          {formErrors.expectedJoining &&
        <p className="text-sm text-red-600 mt-1">{formErrors.expectedJoining}</p>
        }
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requested By <span className="text-red-500">*</span>
        </label>
        <input
        type="text"
        value={formData.requestedBy}
        onChange={(e) => setFormData((prev) => ({ ...prev, requestedBy: e.target.value }))}
        placeholder="Enter requester name"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        {formErrors.requestedBy &&
      <p className="text-sm text-red-600 mt-1">{formErrors.requestedBy}</p>
      }
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
        <textarea
        value={formData.description}
        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        rows={3}
        placeholder="Enter job description"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
          <input
          type="text"
          value={formData.qualifications}
          onChange={(e) =>
          setFormData((prev) => ({ ...prev, qualifications: e.target.value }))
          }
          placeholder="e.g., M.Sc, B.Ed"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <input
          type="text"
          value={formData.experience}
          onChange={(e) => setFormData((prev) => ({ ...prev, experience: e.target.value }))}
          placeholder="e.g., 3+ years"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
        <input
        type="text"
        value={formData.salaryRange}
        onChange={(e) => setFormData((prev) => ({ ...prev, salaryRange: e.target.value }))}
        placeholder="e.g., 40,000 - 60,000"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

      </div>
    </div>;


  // Create Modal
  const CreateModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Create New Requisition</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <RequisitionForm />
          </div>

          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequisition} disabled={isSaving}>
              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </> :

              <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Requisition
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // View Modal
  const ViewModal = () => {
    if (!showViewModal || !selectedRequisition) return null;

    const req = selectedRequisition;
    const sc = statusConfig[req.status];
    const StatusIcon = sc.icon;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Requisition Details</h2>
              <p className="text-sm text-gray-500">{req.id}</p>
            </div>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>

                <StatusIcon className="w-4 h-4" />
                {req.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[req.priority]}`}>
                {req.priority} Priority
              </span>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{req.department}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{req.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{getBranchName(req.branch)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role Type</p>
                <p className="font-medium">{req.roleType}</p>
              </div>
              {req.subject &&
              <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium">{req.subject}</p>
                </div>
              }
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="font-medium">{req.empType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vacancies</p>
                <p className="font-medium">{req.vacancies}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requested By</p>
                <p className="font-medium">{req.requestedBy}</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Requested Date</p>
                <p className="font-medium">{req.requestedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Joining</p>
                <p className="font-medium">{req.expectedJoining}</p>
              </div>
              {req.approvedBy &&
              <>
                  <div>
                    <p className="text-sm text-gray-500">Approved By</p>
                    <p className="font-medium">{req.approvedBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Approved Date</p>
                    <p className="font-medium">{req.approvedDate}</p>
                  </div>
                </>
              }
              {req.closedDate &&
              <>
                  <div>
                    <p className="text-sm text-gray-500">Closed Date</p>
                    <p className="font-medium">{req.closedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Closed Reason</p>
                    <p className="font-medium">{req.closedReason}</p>
                  </div>
                </>
              }
            </div>

            {/* Additional Details */}
            {(req.description || req.qualifications || req.experience || req.salaryRange) &&
            <div className="pt-4 border-t space-y-3">
                {req.description &&
              <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{req.description}</p>
                  </div>
              }
                {req.qualifications &&
              <div>
                    <p className="text-sm text-gray-500">Qualifications</p>
                    <p className="font-medium">{req.qualifications}</p>
                  </div>
              }
                {req.experience &&
              <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{req.experience}</p>
                  </div>
              }
                {req.salaryRange &&
              <div>
                    <p className="text-sm text-gray-500">Salary Range</p>
                    <p className="font-medium">₹{req.salaryRange}</p>
                  </div>
              }
              </div>
            }
          </div>

          <div className="flex justify-end gap-2 p-4 border-t sticky bottom-0 bg-white">
            <Button variant="outline" onClick={closeAllModals}>
              Close
            </Button>
            {req.status === 'Draft' &&
            <>
                <Button
                variant="outline"
                onClick={() => {
                  closeAllModals();
                  openEditModal(req);
                }}>

                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                onClick={() => {
                  closeAllModals();
                  openApproveModal(req);
                }}>

                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
              </>
            }
          </div>
        </div>
      </div>);

  };

  // Edit Modal
  const EditModal = () => {
    if (!showEditModal || !selectedRequisition) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Edit Requisition</h2>
              <p className="text-sm text-gray-500">{selectedRequisition.id}</p>
            </div>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <RequisitionForm isEdit />
          </div>

          <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white">
            <Button
              variant="outline"
              onClick={() => {
                closeAllModals();
                setSelectedRequisition(selectedRequisition);
                setShowDeleteModal(true);
              }}
              className="text-red-600 hover:bg-red-50">

              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleUpdateRequisition} disabled={isSaving}>
                {isSaving ?
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </> :

                <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                }
              </Button>
            </div>
          </div>
        </div>
      </div>);

  };

  // Approve Modal
  const ApproveModal = () => {
    if (!showApproveModal || !selectedRequisition) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Approve Requisition</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Are you sure you want to approve this requisition?
                </p>
                <p className="text-sm text-gray-600">
                  {selectedRequisition.id} - {selectedRequisition.position}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Department:</span>
                <span className="font-medium">{selectedRequisition.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vacancies:</span>
                <span className="font-medium">{selectedRequisition.vacancies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requested By:</span>
                <span className="font-medium">{selectedRequisition.requestedBy}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleApproveRequisition} disabled={isSaving}>
              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </> :

              <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // Close Modal
  const CloseModal = () => {
    if (!showCloseModal || !selectedRequisition) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Close Requisition</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg mb-4">
              <XCircle className="w-8 h-8 text-orange-600" />
              <div>
                <p className="font-medium text-gray-900">Close this requisition?</p>
                <p className="text-sm text-gray-600">
                  {selectedRequisition.id} - {selectedRequisition.position}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Closing <span className="text-red-500">*</span>
              </label>
              <select
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">

                <option value="">Select reason</option>
                <option value="Position filled">Position filled</option>
                <option value="Budget constraints">Budget constraints</option>
                <option value="Requirement changed">Requirement changed</option>
                <option value="Position cancelled">Position cancelled</option>
                <option value="Other">Other</option>
              </select>
              {closeReason === 'Other' &&
              <textarea
                value={closeReason}
                onChange={(e) => setCloseReason(e.target.value)}
                placeholder="Enter custom reason"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

              }
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleCloseRequisition}
              disabled={isSaving}
              className="bg-orange-600 hover:bg-orange-700">

              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Closing...
                </> :

              <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Close Requisition
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!showDeleteModal || !selectedRequisition) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Delete Requisition</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">
                  Are you sure you want to delete this requisition?
                </p>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedRequisition.id}</p>
              <p className="text-sm text-gray-600">
                {selectedRequisition.position} - {selectedRequisition.department}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteRequisition}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700">

              {isSaving ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </> :

              <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  return (
    <div className="space-y-6 pb-8">
      <ToastNotifications />
      <CreateModal />
      <ViewModal />
      <EditModal />
      <ApproveModal />
      <CloseModal />
      <DeleteModal />

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vacancy / Requisition List</h1>
              <p className="text-sm text-gray-500">
                Manage all manpower requisitions raised by departments
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
              {isLoading ?
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

              <Download className="w-4 h-4 mr-1" />
              }
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-1" />
              New Requisition
            </Button>
          </div>
        </div>

        {/* Branch Selector */}
        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branches:</span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ||
            branch.id !== 'all' && selectedBranches.includes('all') ?
            'bg-blue-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }>

              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
            <X
              className="w-3 h-3"
              onClick={(e) => {
                e.stopPropagation();
                handleBranchToggle(branch.id);
              }} />

            }
            </button>
          )}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Requisitions',
          value: filtered.length,
          color: 'blue',
          icon: FileText
        },
        {
          label: 'In Hiring',
          value: filtered.filter((r) => r.status === 'In Hiring').length,
          color: 'orange',
          icon: Clock
        },
        {
          label: 'Approved',
          value: filtered.filter((r) => r.status === 'Approved').length,
          color: 'indigo',
          icon: CheckCircle
        },
        {
          label: 'Total Vacancies',
          value: filtered.reduce((s, r) => s + r.vacancies, 0),
          color: 'red',
          icon: Users
        }].
        map((stat, i) =>
        <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Filters + Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by position, department, ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

          </div>
          <Select
            label=""
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Draft', label: 'Draft' },
            { value: 'Approved', label: 'Approved' },
            { value: 'In Hiring', label: 'In Hiring' },
            { value: 'Closed', label: 'Closed' }]
            }
            value={filterStatus}
            onChange={(val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            }}
            className="w-36" />

          <Select
            label=""
            options={[
            { value: 'all', label: 'All Roles' },
            { value: 'Teaching', label: 'Teaching' },
            { value: 'Non-Teaching', label: 'Non-Teaching' }]
            }
            value={filterRoleType}
            onChange={(val) => {
              setFilterRoleType(val);
              setCurrentPage(1);
            }}
            className="w-40" />

          <Select
            label=""
            options={[
            { value: 'all', label: 'All Departments' },
            ...departments.map((d) => ({ value: d, label: d }))]
            }
            value={filterDept}
            onChange={(val) => {
              setFilterDept(val);
              setCurrentPage(1);
            }}
            className="w-44" />

          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Req. ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Department</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Position</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Type</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Vacancies</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Requested By</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Priority</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Expected DOJ</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((req) => {
                const sc = statusConfig[req.status];
                const StatusIcon = sc.icon;
                return (
                  <tr
                    key={req.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                    <td className="py-3 px-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-indigo-600">{req.id}</p>
                        <p className="text-xs text-gray-400">{req.requestedDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{req.department}</p>
                        <p className="text-xs text-gray-400">{getBranchName(req.branch)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{req.position}</p>
                        {req.subject && <p className="text-xs text-gray-400">{req.subject}</p>}
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                          req.roleType === 'Teaching' ?
                          'bg-indigo-50 text-indigo-600' :
                          'bg-gray-50 text-gray-600'}`
                          }>

                          {req.roleType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        req.empType === 'Full-time' ?
                        'bg-blue-50 text-blue-700' :
                        'bg-orange-50 text-orange-700'}`
                        }>

                        {req.empType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-gray-900">{req.vacancies}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{req.requestedBy}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[req.priority]}`}>

                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>

                        <StatusIcon className="w-3 h-3" />
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{req.expectedJoining}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="View"
                          onClick={() => openViewModal(req)}>

                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="Edit"
                          onClick={() => openEditModal(req)}
                          disabled={req.status === 'Closed'}>

                          <Edit className="w-4 h-4" />
                        </button>
                        {req.status === 'Draft' &&
                        <button
                          className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                          title="Approve"
                          onClick={() => openApproveModal(req)}>

                            <CheckCircle className="w-4 h-4" />
                          </button>
                        }
                        {req.status !== 'Closed' &&
                        <button
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          title="Close"
                          onClick={() => openCloseModal(req)}>

                            <XCircle className="w-4 h-4" />
                          </button>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="py-12 text-center text-gray-400">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No requisitions found matching your filters</p>
            </div>
          }
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {paginatedData.length} of {filtered.length} requisitions
            {filtered.length !== requisitions.length && ` (filtered from ${requisitions.length} total)`}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}>

              Previous
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}>

              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}