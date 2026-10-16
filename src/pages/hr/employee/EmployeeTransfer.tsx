import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Toggle } from '../../../components/ui/Toggle';
import {
  Search,
  ArrowRight,
  ArrowRightLeft,
  User,
  Building2,
  Calendar,
  FileText,
  History,
  X,
  CheckCircle,
  MapPin,
  ChevronRight,
  Home,
  AlertCircle,
  Loader2,
  Clock,
  Send,
  Inbox,
  UserCheck,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Phone,
  Mail,
  Eye,
  MoreHorizontal,
  Download,
  Printer,
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  DollarSign,
  ShieldCheck,
  Paperclip,
  Upload,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  avatar: string;
  designation: string;
  department: string;
  branch: string;
  reportingManager: string;
  email: string;
  phone: string;
  joiningDate: string;
  staffType: 'Teaching' | 'Non-Teaching' | 'Support' | 'Contract';
}

interface TransferRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeDesignation: string;
  fromBranch: string;
  toBranch: string;
  fromDepartment: string;
  toDepartment: string;
  newDesignation: string;
  newManager: string;
  requestDate: string;
  effectiveDate: string;
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected' | 'Cancelled';
  currentStep: number;
  initiatedBy: string;
  remarks: string;
  approvalDate?: string;
  approvedBy?: string;
  type: 'Outgoing' | 'Incoming';
}

interface TransferStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  completedDate?: string;
  completedBy?: string;
}

const mockEmployees: Employee[] = [
  { id: 'EMP001', name: 'Dr. Rajesh Kumar', avatar: 'RK', designation: 'HOD Mathematics', department: 'Mathematics', branch: 'Main Campus', reportingManager: 'Principal', email: 'rajesh.k@school.edu', phone: '+91 9876543201', joiningDate: '2018-06-15', staffType: 'Teaching' },
  { id: 'EMP002', name: 'Sarah Jenkins', avatar: 'SJ', designation: 'Senior Teacher', department: 'English', branch: 'Main Campus', reportingManager: 'Dr. Rajesh Kumar', email: 'sarah.j@school.edu', phone: '+91 9876543202', joiningDate: '2019-04-01', staffType: 'Teaching' },
  { id: 'EMP003', name: 'Michael Chen', avatar: 'MC', designation: 'Admin Officer', department: 'Administration', branch: 'Main Campus', reportingManager: 'HR Manager', email: 'michael.c@school.edu', phone: '+91 9876543203', joiningDate: '2020-01-10', staffType: 'Non-Teaching' },
  { id: 'EMP004', name: 'Priya Sharma', avatar: 'PS', designation: 'Lab Assistant', department: 'Science', branch: 'Main Campus', reportingManager: 'Science HOD', email: 'priya.s@school.edu', phone: '+91 9876543204', joiningDate: '2023-08-01', staffType: 'Support' },
  { id: 'EMP005', name: 'David Wilson', avatar: 'DW', designation: 'Sports Coach', department: 'Physical Education', branch: 'Main Campus', reportingManager: 'Vice Principal', email: 'david.w@school.edu', phone: '+91 9876543205', joiningDate: '2021-03-15', staffType: 'Teaching' }
];

const mockIncomingTransfers: TransferRequest[] = [
  { id: 'TRF-IN-001', employeeId: 'EMP101', employeeName: 'Arun Krishnan', employeeAvatar: 'AK', employeeDesignation: 'Mathematics Teacher', fromBranch: 'South Campus', toBranch: 'Main Campus', fromDepartment: 'Mathematics', toDepartment: 'Mathematics', newDesignation: 'Senior Mathematics Teacher', newManager: 'Dr. Rajesh Kumar', requestDate: '2024-03-01', effectiveDate: '2024-04-01', status: 'Pending', currentStep: 1, initiatedBy: 'South Campus Admin', remarks: 'Requested transfer due to family relocation', type: 'Incoming' },
  { id: 'TRF-IN-002', employeeId: 'EMP102', employeeName: 'Kavitha Nair', employeeAvatar: 'KN', employeeDesignation: 'Hindi Teacher', fromBranch: 'East Campus', toBranch: 'Main Campus', fromDepartment: 'Hindi', toDepartment: 'Hindi', newDesignation: 'Hindi Teacher', newManager: 'Hindi HOD', requestDate: '2024-02-20', effectiveDate: '2024-03-15', status: 'In Progress', currentStep: 3, initiatedBy: 'East Campus Admin', remarks: 'Promotion and transfer', approvalDate: '2024-02-25', approvedBy: 'Principal', type: 'Incoming' },
  { id: 'TRF-IN-003', employeeId: 'EMP103', employeeName: 'Robert Williams', employeeAvatar: 'RW', employeeDesignation: 'IT Administrator', fromBranch: 'West Campus', toBranch: 'Main Campus', fromDepartment: 'IT', toDepartment: 'IT', newDesignation: 'Senior IT Administrator', newManager: 'IT Manager', requestDate: '2024-02-10', effectiveDate: '2024-03-01', status: 'Completed', currentStep: 5, initiatedBy: 'West Campus Admin', remarks: 'Centralization of IT operations', approvalDate: '2024-02-15', approvedBy: 'Director', type: 'Incoming' }
];

const mockOutgoingTransfers: TransferRequest[] = [
  { id: 'TRF-OUT-001', employeeId: 'EMP005', employeeName: 'David Wilson', employeeAvatar: 'DW', employeeDesignation: 'Sports Coach', fromBranch: 'Main Campus', toBranch: 'North Campus', fromDepartment: 'Physical Education', toDepartment: 'Physical Education', newDesignation: 'Head Coach', newManager: 'North Campus Principal', requestDate: '2024-03-05', effectiveDate: '2024-04-15', status: 'Approved', currentStep: 2, initiatedBy: 'HR Manager', remarks: 'Promotion to Head Coach position', approvalDate: '2024-03-08', approvedBy: 'Principal', type: 'Outgoing' }
];

const mockTransferredInEmployees: Employee[] = [
  { id: 'EMP103', name: 'Robert Williams', avatar: 'RW', designation: 'Senior IT Administrator', department: 'IT', branch: 'Main Campus', reportingManager: 'IT Manager', email: 'robert.w@school.edu', phone: '+91 9876543310', joiningDate: '2024-03-01', staffType: 'Non-Teaching' },
  { id: 'EMP098', name: 'Meera Patel', avatar: 'MP', designation: 'Librarian', department: 'Library', branch: 'Main Campus', reportingManager: 'Academic Coordinator', email: 'meera.p@school.edu', phone: '+91 9876543311', joiningDate: '2024-02-01', staffType: 'Non-Teaching' },
  { id: 'EMP087', name: 'James Anderson', avatar: 'JA', designation: 'Music Teacher', department: 'Arts', branch: 'Main Campus', reportingManager: 'Arts Coordinator', email: 'james.a@school.edu', phone: '+91 9876543312', joiningDate: '2024-01-15', staffType: 'Teaching' }
];

const branches = [
  { value: 'main-campus', label: 'Main Campus' },
  { value: 'north-campus', label: 'North Campus' },
  { value: 'south-campus', label: 'South Campus' },
  { value: 'east-campus', label: 'East Campus' },
  { value: 'west-campus', label: 'West Campus' },
  { value: 'city-center', label: 'City Center Branch' }
];

const departments = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'english', label: 'English' },
  { value: 'science', label: 'Science' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'physical-education', label: 'Physical Education' },
  { value: 'arts', label: 'Arts' },
  { value: 'administration', label: 'Administration' },
  { value: 'it', label: 'IT' },
  { value: 'library', label: 'Library' },
  { value: 'accounts', label: 'Accounts' }
];

const designations = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'senior-teacher', label: 'Senior Teacher' },
  { value: 'hod', label: 'Head of Department' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'admin-officer', label: 'Admin Officer' },
  { value: 'assistant', label: 'Assistant' },
  { value: 'manager', label: 'Manager' }
];

const managers = [
  { value: 'principal', label: 'Principal' },
  { value: 'vice-principal', label: 'Vice Principal' },
  { value: 'dr-rajesh', label: 'Dr. Rajesh Kumar' },
  { value: 'hr-manager', label: 'HR Manager' },
  { value: 'academic-coord', label: 'Academic Coordinator' },
  { value: 'it-manager', label: 'IT Manager' }
];

const outgoingTransferSteps: TransferStep[] = [
  { id: 1, title: 'Initiate Transfer', description: 'Submit transfer request with details', status: 'pending' },
  { id: 2, title: 'Manager Approval', description: 'Approval from current reporting manager', status: 'pending' },
  { id: 3, title: 'HR Review', description: 'HR reviews and processes documentation', status: 'pending' },
  { id: 4, title: 'Destination Acceptance', description: 'Receiving branch accepts the transfer', status: 'pending' },
  { id: 5, title: 'Handover', description: 'Complete work handover and clearance', status: 'pending' },
  { id: 6, title: 'Transfer Complete', description: 'Employee relocated to new branch', status: 'pending' }
];

const incomingTransferSteps: TransferStep[] = [
  { id: 1, title: 'Request Received', description: 'Transfer request received from source branch', status: 'pending' },
  { id: 2, title: 'Review & Verify', description: 'Verify employee records and eligibility', status: 'pending' },
  { id: 3, title: 'Accept Transfer', description: 'Formally accept the incoming transfer', status: 'pending' },
  { id: 4, title: 'Assignment Setup', description: 'Assign department, manager, and workspace', status: 'pending' },
  { id: 5, title: 'Onboarding', description: 'Complete onboarding and orientation', status: 'pending' }
];

const TRANSFER_REASON_OPTIONS = [
  { value: 'promotion', label: 'Promotion' },
  { value: 'restructuring', label: 'Restructuring' },
  { value: 'performance', label: 'Performance' },
  { value: 'disciplinary', label: 'Disciplinary' },
  { value: 'personal-request', label: 'Personal Request' },
  { value: 'operational', label: 'Operational Requirement' },
  { value: 'medical', label: 'Medical / Health Reason' },
  { value: 'family', label: 'Family Circumstances' },
  { value: 'mutual', label: 'Mutual Transfer' },
  { value: 'skills', label: 'Skills Utilization' },
  { value: 'closure', label: 'Branch Closure / Merger' },
  { value: 'vacancy', label: 'Vacancy / Staffing Shortage' },
  { value: 'directive', label: 'Management Directive' },
  { value: 'self', label: 'Employee Request (self-initiated)' },
  { value: 'other', label: 'Other' }
];

const FORM_WIZARD_STEPS = [
  { id: 1, title: 'Employee & Location', hint: 'Identity and current posting' },
  { id: 2, title: 'Transfer Details', hint: 'Destination, type and reason' },
  { id: 3, title: 'Conditions', hint: 'Pay, role and benefits' },
  { id: 4, title: 'Handover & Documents', hint: 'Clearance and attachments' },
  { id: 5, title: 'Approvals', hint: 'Consent and submit' }
];
const transferFieldClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white';
const transferLabelClass = 'block text-sm font-medium text-gray-700 mb-1';
const transferSectionHeadingClass = 'flex items-center gap-2 text-base font-semibold text-gray-900 mb-4';
const transferCardClass = 'rounded-xl border border-gray-200 bg-white p-5 shadow-sm';
const HANDOVER_ITEMS = [
  { id: 'docs', label: 'Work documentation handed over to replacement' },
  { id: 'tasks', label: 'Pending tasks briefed to team' },
  { id: 'access', label: 'System and software access deactivated' },
  { id: 'assets', label: 'Company assets returned (laptop, ID card, keys)' },
  { id: 'email', label: 'Email auto-responder set up pointing to new contact' },
  { id: 'clearance', label: 'Exit clearance form signed by HOD' }
];
const stepsForType = (type: TransferRequest['type']) => type === 'Incoming' ? incomingTransferSteps : outgoingTransferSteps;
const maxStepForType = (type: TransferRequest['type']) => stepsForType(type).length;
const initialsFrom = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const dateNowIso = () => new Date().toISOString().slice(0, 10);

export function EmployeeTransfer() {
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming' | 'history'>('outgoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTransferStep, setCurrentTransferStep] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  const [newBranch, setNewBranch] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [empFullName, setEmpFullName] = useState('');
  const [empId, setEmpId] = useState('');
  const [empJobTitle, setEmpJobTitle] = useState('');
  const [empDepartment, setEmpDepartment] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [staffType, setStaffType] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [contractType, setContractType] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [payrollCostCenter, setPayrollCostCenter] = useState('');
  const [assetAssignment, setAssetAssignment] = useState('');
  const [accessPermissions, setAccessPermissions] = useState('');
  const [probationStatus, setProbationStatus] = useState('');
  const [lastAppraisal, setLastAppraisal] = useState('');
  const [lastTransferDate, setLastTransferDate] = useState('');
  const [transferCategory, setTransferCategory] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Normal');
  const [newProbation, setNewProbation] = useState('');
  const [newWorkSchedule, setNewWorkSchedule] = useState('');
  const [newCostCenter, setNewCostCenter] = useState('');
  const [newOfficeRoom, setNewOfficeRoom] = useState('');
  const [initiatedByWhom, setInitiatedByWhom] = useState('HR');
  const [payGradeChange, setPayGradeChange] = useState(false);
  const [taxLocationChange, setTaxLocationChange] = useState(false);
  const [pfTransfer, setPfTransfer] = useState('');
  const [insuranceUpdate, setInsuranceUpdate] = useState(false);
  const [transportAllowance, setTransportAllowance] = useState('');
  const [housingAllowance, setHousingAllowance] = useState('');
  const [leaveCarryForward, setLeaveCarryForward] = useState(true);
  const [handoverTo, setHandoverTo] = useState('');
  const [handoverDate, setHandoverDate] = useState('');
  const [pendingTasks, setPendingTasks] = useState('');
  const [docUploads, setDocUploads] = useState<string[]>([]);
  const [formStep, setFormStep] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySort, setHistorySort] = useState<'id' | 'employee' | 'type' | 'status' | 'date'>('date');
  const [searchDept, setSearchDept] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentManager, setCurrentManager] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [officeRoomNo, setOfficeRoomNo] = useState('');
  const [reportingDateNewBranch, setReportingDateNewBranch] = useState('');
  const [transferType, setTransferType] = useState('');
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [transferReasons, setTransferReasons] = useState<string[]>([]);
  const [salaryChange, setSalaryChange] = useState(false);
  const [newSalary, setNewSalary] = useState('');
  const [benefitsChange, setBenefitsChange] = useState(false);
  const [roleChange, setRoleChange] = useState(false);
  const [roleChangeDetails, setRoleChangeDetails] = useState('');
  const [relocationAssistance, setRelocationAssistance] = useState(false);

  const toggleTransferReason = (value: string) => {
    setTransferReasons((prev) => prev.includes(value) ? prev.filter((reason) => reason !== value) : [...prev, value]);
  };

  const [incomingTransfers, setIncomingTransfers] = useState<TransferRequest[]>(mockIncomingTransfers);
  const [outgoingTransfers, setOutgoingTransfers] = useState<TransferRequest[]>(mockOutgoingTransfers);
  const [incomingFilter, setIncomingFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState('All Types');
  const [historyStatus, setHistoryStatus] = useState('All Status');
  const [actionError, setActionError] = useState<{ message: string; action: string } | null>(null);
  const [consentInformed, setConsentInformed] = useState(false);
  const [consentManager, setConsentManager] = useState(false);
  const [consentAccurate, setConsentAccurate] = useState(false);
  const [initiatedBy, setInitiatedBy] = useState('');
  const [hrDesignation, setHrDesignation] = useState('');
  const [eligibilityReady, setEligibilityReady] = useState(false);
  const [eligibilityOverride, setEligibilityOverride] = useState(false);
  const [handoverChecks, setHandoverChecks] = useState<Record<string, Record<string, boolean>>>({});
  const [activityOpen, setActivityOpen] = useState<Record<string, boolean>>({});
  const [letterPreview, setLetterPreview] = useState<TransferRequest | null>(null);
  const [transferredInEmployees] = useState<Employee[]>(mockTransferredInEmployees);
  const [expandedSection, setExpandedSection] = useState<string | null>('transferred-list');

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = !searchDept || emp.department === searchDept;
    const matchesType = !searchType || emp.staffType === searchType;
    const matchesBranch = !searchBranch || emp.branch === searchBranch;
    return matchesSearch && matchesDept && matchesType && matchesBranch;
  });

  const filteredIncomingTransfers = incomingTransfers.filter((transfer) => {
    if (incomingFilter === 'all') return true;
    return transfer.status.toLowerCase() === incomingFilter.toLowerCase();
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchQuery('');
    setShowSuggestions(false);
    setCurrentTransferStep(0);
    setNewBranch('');
    setNewDepartment('');
    setNewDesignation('');
    setNewManager('');
    setEffectiveDate('');
    setRemarks('');
    setShowSuccess(false);
    setEmpFullName(employee.name);
    setEmpId(employee.id);
    setEmpJobTitle(employee.designation);
    setEmpDepartment(departments.find((dept) => dept.label === employee.department)?.value ?? '');
    setEmpEmail(employee.email);
    setEmpMobile(employee.phone);
    setStaffType(employee.staffType);
    setContractType(employee.staffType === 'Contract' ? 'Contract' : 'Permanent');
    setFormStep(1);
    setCurrentBranch(branches.find((branch) => branch.label === employee.branch)?.value ?? '');
    setCurrentManager(employee.reportingManager);
    setShiftStart('');
    setShiftEnd('');
    setOfficeRoomNo('');
    setReportingDateNewBranch('');
    setTransferType('');
    setDurationFrom('');
    setDurationTo('');
    setTransferReasons([]);
    setSalaryChange(false);
    setNewSalary('');
    setBenefitsChange(false);
    setRoleChange(false);
    setRoleChangeDetails('');
    setRelocationAssistance(false);
  };

  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setCurrentTransferStep(0);
    setFormStep(1);
    setShowSuccess(false);
  };

  const fakeRequest = async () => new Promise<void>((resolve) => { window.setTimeout(resolve, 800); });

  const handleInitiateTransfer = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await fakeRequest();
      setCurrentTransferStep(1);
      setShowSuccess(true);
      setOutgoingTransfers((prev) => [{
        id: `TRF-OUT-${String(prev.length + 1).padStart(3, '0')}`,
        employeeId: empId,
        employeeName: empFullName,
        employeeAvatar: selectedEmployee?.avatar || initialsFrom(empFullName),
        employeeDesignation: empJobTitle,
        fromBranch: selectedEmployee?.branch || currentBranch,
        toBranch: branches.find((item) => item.value === newBranch)?.label || newBranch,
        fromDepartment: selectedEmployee?.department || empDepartment,
        toDepartment: departments.find((item) => item.value === newDepartment)?.label || newDepartment,
        newDesignation: designations.find((item) => item.value === newDesignation)?.label || newDesignation,
        newManager: managers.find((item) => item.value === newManager)?.label || newManager,
        requestDate: dateNowIso(),
        effectiveDate,
        status: 'Pending',
        currentStep: 1,
        initiatedBy: initiatedBy || 'HR Manager',
        remarks,
        type: 'Outgoing'
      }, ...prev]);
    } catch {
      setActionError({ message: 'Failed to initiate transfer.', action: 'initiate' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessIncomingTransfer = async (transfer: TransferRequest, action: 'accept' | 'reject') => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await fakeRequest();
      setIncomingTransfers((prev) =>
        prev.map((t) => t.id === transfer.id
          ? action === 'accept'
            ? { ...t, status: 'In Progress' as const, currentStep: Math.min(t.currentStep + 1, maxStepForType(t.type)) }
            : { ...t, status: 'Rejected' as const }
          : t)
      );
    } catch {
      setActionError({ message: `Failed to ${action} transfer. Server not responding.`, action });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvanceIncomingStep = async (transfer: TransferRequest) => {
    if (transfer.type !== 'Incoming' && transfer.type !== 'Outgoing') return;
    const max = maxStepForType(transfer.type);
    if (transfer.currentStep >= max) return;
    setIsProcessing(true);
    setActionError(null);
    try {
      await fakeRequest();
      const newStep = Math.min(transfer.currentStep + 1, max);
      const newStatus: TransferRequest['status'] = newStep >= max ? 'Completed' : 'In Progress';
      const updater = (list: TransferRequest[]) => list.map((t) => t.id === transfer.id ? { ...t, currentStep: newStep, status: newStatus } : t);
      if (transfer.type === 'Incoming') setIncomingTransfers(updater);
      else setOutgoingTransfers(updater);
    } catch {
      setActionError({ message: 'Failed to advance transfer step.', action: 'advance' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepStatus = (stepId: number, currentStep: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);
  const formErrors = {
    newBranch: !newBranch ? 'Please select a destination branch' : '',
    effectiveDate: !effectiveDate ? 'Effective date is required' : effectiveDate <= dateNowIso() ? 'Effective date must be a future date' : '',
    transferReasons: transferReasons.length === 0 ? 'Select at least one transfer reason' : '',
    transferType: !['Permanent', 'Temporary', 'Provisional'].includes(transferType) ? 'Select a transfer type' : '',
    durationFrom: transferType === 'Temporary' && !durationFrom ? 'Start date is required' : '',
    durationTo: transferType === 'Temporary' && !durationTo ? 'End date is required' : transferType === 'Temporary' && durationFrom && durationTo && durationTo <= durationFrom ? 'End date must be after start date' : '',
    newSalary: salaryChange && !(Number(newSalary) > 0) ? 'Please enter a valid salary amount' : '',
    roleChangeDetails: roleChange && roleChangeDetails.trim().length < 20 ? 'Describe the role change in at least 20 characters' : '',
    consent: !(consentInformed && consentManager && consentAccurate) ? 'Required' : '',
    initiatedBy: !initiatedBy.trim() ? 'Required' : '',
    hrDesignation: !hrDesignation.trim() ? 'Required' : ''
  };
  const isFormValid = Object.values(formErrors).every((error) => !error);
  const stepValid = {
    1: Boolean(empFullName.trim() && empId.trim() && staffType && empEmail.trim() && empMobile.trim()),
    2: !formErrors.newBranch && !formErrors.effectiveDate && !formErrors.transferReasons && !formErrors.transferType && !formErrors.durationFrom && !formErrors.durationTo,
    3: !formErrors.newSalary && !formErrors.roleChangeDetails,
    4: true,
    5: !formErrors.consent && !formErrors.initiatedBy && !formErrors.hrDesignation
  } as Record<number, boolean>;
  const yearsOfService = selectedEmployee ? Math.max(0, Math.floor((Date.now() - new Date(selectedEmployee.joiningDate).getTime()) / (1000 * 60 * 60 * 24 * 365))) : 0;
  const outgoingActiveCount = outgoingTransfers.filter((t) => t.status !== 'Completed' && t.status !== 'Rejected' && t.status !== 'Cancelled').length;
  const incomingPendingCount = incomingTransfers.filter((t) => t.status === 'Pending').length;
  const historyCount = [...incomingTransfers, ...outgoingTransfers].filter((item) => ['Completed', 'Rejected', 'Cancelled'].includes(item.status)).length;
  const isUrgentIncoming = (transfer: TransferRequest) => {
    if (transfer.status !== 'Pending') return false;
    const days = (new Date(transfer.effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return days <= 14;
  };

  const historyRecords = useMemo(() => {
    const combined = [...incomingTransfers, ...outgoingTransfers].filter((item) => ['Completed', 'Rejected', 'Cancelled'].includes(item.status));
    const filtered = combined.filter((item) => {
      const matchesSearch = !historySearch || item.employeeName.toLowerCase().includes(historySearch.toLowerCase()) || item.id.toLowerCase().includes(historySearch.toLowerCase());
      const matchesType = historyType === 'All Types' || item.type === historyType;
      const matchesStatus = historyStatus === 'All Status' || item.status === historyStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
    return filtered.sort((a, b) => {
      if (historySort === 'id') return a.id.localeCompare(b.id);
      if (historySort === 'employee') return a.employeeName.localeCompare(b.employeeName);
      if (historySort === 'type') return a.type.localeCompare(b.type);
      if (historySort === 'status') return a.status.localeCompare(b.status);
      return new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime();
    });
  }, [incomingTransfers, outgoingTransfers, historySearch, historyType, historyStatus, historySort]);
  const historyPageSize = 5;
  const historyPages = Math.max(1, Math.ceil(historyRecords.length / historyPageSize));
  const pagedHistory = historyRecords.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

  useEffect(() => {
    if (!showSuccess) return undefined;
    const timer = window.setTimeout(() => setShowSuccess(false), 6000);
    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historySearch, historyType, historyStatus, historySort]);

  useEffect(() => {
    if (historyPage > historyPages) setHistoryPage(historyPages);
  }, [historyPage, historyPages]);

  const tenureOk = selectedEmployee ? (Date.now() - new Date(selectedEmployee.joiningDate).getTime()) / (1000 * 60 * 60 * 24) > 182 : false;
  const noActiveTransfer = selectedEmployee ? !outgoingTransfers.some((item) => item.employeeId === selectedEmployee.id && ['Pending', 'Approved', 'In Progress'].includes(item.status)) : false;
  const employmentOk = selectedEmployee ? selectedEmployee.staffType !== 'Contract' : false;
  const contactOk = selectedEmployee ? Boolean(selectedEmployee.email && selectedEmployee.phone) : false;
  const eligibilityPass = tenureOk && noActiveTransfer && employmentOk && contactOk;
  useEffect(() => {
    if (!selectedEmployee) { setEligibilityReady(false); setEligibilityOverride(false); return undefined; }
    setEligibilityReady(false);
    const timer = window.setTimeout(() => setEligibilityReady(true), 1000);
    return () => window.clearTimeout(timer);
  }, [selectedEmployee]);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>HR</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Employee</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Branch Transfer</span>
      </nav>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Branch Transfer</h1>
          <p className="text-sm text-gray-500 mt-1">Manage employee transfers between branches with complete process tracking</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
          <Building2 className="w-4 h-4" />
          <span className="text-sm font-medium">Main Campus</span>
        </div>
      </div>

      {actionError &&
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="flex-1 text-sm text-red-800">{actionError.message}</p>
          <button type="button" className="text-sm font-medium text-red-700" onClick={() => setActionError(null)}>Retry</button>
          <button type="button" onClick={() => setActionError(null)}><X className="w-4 h-4 text-red-600" /></button>
        </div>
      }

      {showSuccess &&
        <div className="relative overflow-hidden flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Transfer Request Initiated Successfully!</p>
            <p className="text-sm text-green-700">The transfer request has been submitted and is pending approval.</p>
            <button type="button" className="text-sm font-medium text-green-800 underline" onClick={() => setActiveTab('outgoing')}>View Request →</button>
          </div>
          <button type="button" onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800"><X className="w-4 h-4" /></button>
          <span className="absolute bottom-0 left-0 h-[3px] w-full bg-green-500 origin-left animate-[pulse_6s_linear]" />
        </div>
      }

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          <button type="button" onClick={() => setActiveTab('outgoing')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'outgoing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <ArrowUpFromLine className="w-4 h-4" /> Outgoing Transfers
            <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">{outgoingActiveCount}</span>
          </button>
          <button type="button" onClick={() => setActiveTab('incoming')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'incoming' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <ArrowDownToLine className="w-4 h-4" /> Incoming Transfers
            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{incomingPendingCount}</span>
          </button>
          <button type="button" onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <History className="w-4 h-4" /> Transfer History
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{historyCount}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'outgoing' &&
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-gray-500" /> Select Employee for Transfer</h3>
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by employee name or ID..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                    {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>}
                  </div>
                  <button type="button" onClick={() => setShowSearchFilters((open) => !open)} className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800">
                    <Filter className="w-4 h-4" /> {showSearchFilters ? 'Hide filters' : 'More filters'}
                  </button>
                  {showSearchFilters &&
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select value={searchDept} onChange={(e) => setSearchDept(e.target.value)} className={transferFieldClass}>
                        <option value="">All departments</option>
                        {departments.map((dept) => <option key={dept.value} value={dept.label}>{dept.label}</option>)}
                      </select>
                      <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={transferFieldClass}>
                        <option value="">All staff types</option>
                        {['Teaching', 'Non-Teaching', 'Support', 'Contract'].map((type) => <option key={type} value={type}>{type}</option>)}
                      </select>
                      <select value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} className={transferFieldClass}>
                        <option value="">All branches</option>
                        {branches.map((branch) => <option key={branch.value} value={branch.label}>{branch.label}</option>)}
                      </select>
                    </div>
                  }
                  {showSuggestions && searchQuery &&
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {filteredEmployees.length > 0 ?
                        filteredEmployees.map((employee) =>
                          <button type="button" key={employee.id} onClick={() => handleSelectEmployee(employee)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">{employee.avatar}</div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-500">{employee.id} • {employee.designation}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{employee.department}</p>
                              <p className="text-xs text-gray-400">{employee.branch}</p>
                            </div>
                          </button>
                        ) :
                        <div className="p-4 text-center text-gray-500"><User className="w-8 h-8 mx-auto mb-2 text-gray-300" /><p>No employees found</p></div>
                      }
                    </div>
                  }
                </div>

                {selectedEmployee &&
                  <div className="mt-4 flex items-center justify-between p-4 bg-white border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold">{selectedEmployee.avatar}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                        <p className="text-sm text-gray-600">{selectedEmployee.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{selectedEmployee.designation}</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{selectedEmployee.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Current Branch</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{selectedEmployee.branch}</p>
                      </div>
                      <button type="button" onClick={handleClearSelection} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                }

                {!selectedEmployee && !searchQuery &&
                  <div className="mt-4 flex flex-col items-center justify-center py-8 text-gray-400">
                    <ArrowUpFromLine className="w-12 h-12 mb-3 text-indigo-200" />
                    <p className="text-lg font-medium text-gray-700">No Active Outgoing Transfers</p>
                    <p className="text-sm">Search for an employee above to begin a branch transfer request</p>
                  </div>
                }

                {selectedEmployee && !eligibilityReady &&
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white">
                    <p className="text-sm font-medium text-gray-800">Checking eligibility for {selectedEmployee.name}...</p>
                    <div className="mt-2 h-2 rounded bg-gray-100 overflow-hidden"><div className="h-2 w-2/3 bg-indigo-400 animate-pulse" /></div>
                  </div>
                }
                {selectedEmployee && eligibilityReady &&
                  <div className={`mt-4 p-4 border rounded-lg ${eligibilityPass || eligibilityOverride ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="font-semibold text-gray-900 mb-3">{eligibilityPass || eligibilityOverride ? '✅' : '❌'} Eligibility Check — {selectedEmployee.name}</p>
                    <div className="space-y-1 text-sm">
                      <p>{tenureOk ? '✅' : '❌'} Minimum Tenure — {tenureOk ? `Joined ${selectedEmployee.joiningDate}` : 'Less than 6 months'}</p>
                      <p>{noActiveTransfer ? '✅' : '❌'} No Active Transfer — {noActiveTransfer ? 'No pending transfers found' : 'An active transfer already exists'}</p>
                      <p>{employmentOk ? '✅' : '❌'} Employment Type — {selectedEmployee.staffType}</p>
                      <p>{contactOk ? '✅' : '❌'} Contact Details — {contactOk ? 'Email & phone verified' : 'Missing email or phone'}</p>
                    </div>
                    {eligibilityPass || eligibilityOverride ? <p className="mt-3 text-sm text-green-800">Employee is eligible for branch transfer</p> : (
                      <div className="mt-3">
                        <p className="text-sm text-red-800">Transfer Not Recommended — resolve issues first</p>
                        <button type="button" className="mt-2 px-3 py-1.5 border border-red-300 rounded-lg text-sm" onClick={() => { if (window.confirm('Override eligibility and proceed?')) setEligibilityOverride(true); }}>Admin Override & Proceed</button>
                      </div>
                    )}
                  </div>
                }
              </div>

              {selectedEmployee && eligibilityReady && (eligibilityPass || eligibilityOverride) &&
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-indigo-600" /> Transfer Request Form</h3>
                        <p className="text-sm text-gray-500 mt-1">Step {formStep} of {FORM_WIZARD_STEPS.length} — {FORM_WIZARD_STEPS[formStep - 1].title} for {selectedEmployee.name}</p>
                      </div>
                      <p className="text-xs text-gray-500"><span className="text-red-500">*</span> Required &nbsp;·&nbsp; unmarked fields are optional</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                      {FORM_WIZARD_STEPS.map((step, index) =>
                        <button type="button" key={step.id} onClick={() => { if (step.id <= formStep || stepValid[formStep]) setFormStep(step.id); }} className="flex items-center gap-2 min-w-0">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${formStep === step.id ? 'bg-indigo-600 text-white' : formStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{formStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}</span>
                          <span className={`hidden sm:block text-xs ${formStep === step.id ? 'text-indigo-700 font-semibold' : 'text-gray-500'}`}>{step.title}</span>
                          {index < FORM_WIZARD_STEPS.length - 1 && <span className={`hidden sm:block w-8 h-0.5 ${formStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6">
                    <div className="space-y-6 min-w-0">
                    {formStep === 1 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><User className="w-4 h-4 text-indigo-600" /> Employee Identification</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={transferLabelClass}>Employee Full Name <span className="text-red-500">*</span></label><input type="text" value={empFullName} onChange={(e) => setEmpFullName(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Employee ID <span className="text-red-500">*</span></label><input type="text" value={empId} onChange={(e) => setEmpId(e.target.value)} className={transferFieldClass} /></div>
                        <div>
                          <label className={transferLabelClass}>Staff Type <span className="text-red-500">*</span></label>
                          <select value={staffType} onChange={(e) => setStaffType(e.target.value)} className={transferFieldClass}>
                            <option value="">Select...</option>
                            {['Teaching', 'Non-Teaching', 'Support', 'Contract'].map((type) => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}>Contract Type</label>
                          <select value={contractType} onChange={(e) => setContractType(e.target.value)} className={transferFieldClass}>
                            <option value="">Select...</option>
                            {['Permanent', 'Contract', 'Probation', 'Visiting'].map((type) => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                        <div><label className={transferLabelClass}>Designation / Job Title</label><input type="text" value={empJobTitle} onChange={(e) => setEmpJobTitle(e.target.value)} className={transferFieldClass} /></div>
                        <div>
                          <label className={transferLabelClass}>Department</label>
                          <select value={empDepartment} onChange={(e) => setEmpDepartment(e.target.value)} className={transferFieldClass}>
                            <option value="">Select Department...</option>
                            {departments.map((dept) => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
                          </select>
                        </div>
                        <div><label className={transferLabelClass}>Date of Birth</label><input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={transferFieldClass} /></div>
                        <div>
                          <label className={transferLabelClass}>Gender</label>
                          <select value={gender} onChange={(e) => setGender(e.target.value)} className={transferFieldClass}>
                            <option value="">Select...</option>
                            {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                        <div><label className={transferLabelClass}>Nationality</label><input type="text" value={nationality} onChange={(e) => setNationality(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Email Address <span className="text-red-500">*</span></label><input type="email" value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Mobile Number <span className="text-red-500">*</span></label><input type="tel" value={empMobile} onChange={(e) => setEmpMobile(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Emergency Contact</label><input type="tel" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className={transferFieldClass} /></div>
                        <div className="md:col-span-2"><label className={transferLabelClass}>Current Address</label><textarea value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} rows={2} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                        <div><label className={transferLabelClass}>Years of Service</label><input type="text" readOnly value={`${yearsOfService} year${yearsOfService === 1 ? '' : 's'}`} className={`${transferFieldClass} bg-gray-50`} /></div>
                        <div>
                          <label className={transferLabelClass}>Probation Status</label>
                          <select value={probationStatus} onChange={(e) => setProbationStatus(e.target.value)} className={transferFieldClass}>
                            <option value="">Select...</option>
                            {['Confirmed', 'On Probation', 'Extended Probation'].map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div><label className={transferLabelClass}>Last Appraisal Date</label><input type="date" value={lastAppraisal} onChange={(e) => setLastAppraisal(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Last Transfer Date</label><input type="date" value={lastTransferDate} onChange={(e) => setLastTransferDate(e.target.value)} className={transferFieldClass} /></div>
                      </div>
                    </section>
                    }

                    {formStep === 1 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><MapPin className="w-4 h-4 text-indigo-600" /> Current Branch Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={transferLabelClass}>Current Branch / Location</label>
                          <select value={currentBranch} onChange={(e) => setCurrentBranch(e.target.value)} className={transferFieldClass}>
                            <option value="">Select Branch...</option>
                            {branches.map((branch) => <option key={branch.value} value={branch.value}>{branch.label}</option>)}
                          </select>
                        </div>
                        <div><label className={transferLabelClass}>Current Reporting Manager</label><input type="text" value={currentManager} onChange={(e) => setCurrentManager(e.target.value)} className={transferFieldClass} /></div>
                        <div className="md:col-span-2">
                          <p className={transferLabelClass}><Clock className="w-4 h-4 inline mr-1" /> Current Work Schedule (Start & End Shift)</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">Shift Start</label><input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className={transferFieldClass} /></div>
                            <div><label className="block text-xs font-medium text-gray-600 mb-1">Shift End</label><input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className={transferFieldClass} /></div>
                          </div>
                        </div>
                        <div><label className={transferLabelClass}>Office / Floor / Room No.</label><input type="text" value={officeRoomNo} onChange={(e) => setOfficeRoomNo(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Payroll Cost Center</label><input type="text" value={payrollCostCenter} onChange={(e) => setPayrollCostCenter(e.target.value)} className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Asset Assignment</label><input type="text" value={assetAssignment} onChange={(e) => setAssetAssignment(e.target.value)} placeholder="Laptop, ID card, keys..." className={transferFieldClass} /></div>
                        <div className="md:col-span-2"><label className={transferLabelClass}>Access Permissions</label><textarea value={accessPermissions} onChange={(e) => setAccessPermissions(e.target.value)} rows={2} placeholder="ERP, biometric, campus access..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                      </div>
                    </section>
                    }

                    {formStep === 2 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><ArrowRight className="w-4 h-4 text-indigo-600" /> Transfer Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={transferLabelClass}>New Branch / Location <span className="text-red-500">*</span></label>
                          <select value={newBranch} onChange={(e) => setNewBranch(e.target.value)} className={transferFieldClass}>
                            <option value="">Select Branch...</option>
                            {branches.filter((b) => b.label !== selectedEmployee.branch).map((branch) => <option key={branch.value} value={branch.value}>{branch.label}</option>)}
                          </select>
                          {formErrors.newBranch && <p className="mt-1 text-xs text-red-600">{formErrors.newBranch}</p>}
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Department</label>
                          <select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} className={transferFieldClass}>
                            <option value="">Same as current</option>
                            {departments.map((dept) => <option key={dept.value} value={dept.value}>{dept.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Job Title / Position</label>
                          <select value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} className={transferFieldClass}>
                            <option value="">Same as current</option>
                            {designations.map((desig) => <option key={desig.value} value={desig.value}>{desig.label}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}><span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> Transfer Effective Date <span className="text-red-500">*</span></span></label>
                          <input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} min={tomorrowIso} className={transferFieldClass} />
                          {formErrors.effectiveDate && <p className="mt-1 text-xs text-red-600">{formErrors.effectiveDate}</p>}
                        </div>
                        <div><label className={transferLabelClass}>Reporting Date at New Branch</label><input type="date" value={reportingDateNewBranch} onChange={(e) => setReportingDateNewBranch(e.target.value)} className={transferFieldClass} /></div>
                        <div>
                          <label className={transferLabelClass}>New Reporting Manager</label>
                          <select value={newManager} onChange={(e) => setNewManager(e.target.value)} className={transferFieldClass}>
                            <option value="">Select Manager...</option>
                            {managers.map((mgr) => <option key={mgr.value} value={mgr.value}>{mgr.label}</option>)}
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <p className={transferLabelClass}>Transfer Type</p>
                          <div className="flex flex-wrap gap-6">
                            {['Permanent', 'Temporary', 'Provisional'].map((type) =>
                              <label key={type} className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="radio" name="transferType" value={type} checked={transferType === type} onChange={() => setTransferType(type)} className="h-4 w-4 text-indigo-600 border-gray-300" />
                                {type}
                              </label>
                            )}
                          </div>
                        </div>
                        {transferType === 'Temporary' &&
                          <div className="md:col-span-2 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <p className={transferLabelClass}>Transfer Duration (if Temporary)</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><label className="block text-xs font-medium text-gray-600 mb-1">From</label><input type="date" value={durationFrom} onChange={(e) => setDurationFrom(e.target.value)} className={transferFieldClass} /></div>
                              <div><label className="block text-xs font-medium text-gray-600 mb-1">To</label><input type="date" value={durationTo} min={durationFrom || undefined} onChange={(e) => setDurationTo(e.target.value)} className={transferFieldClass} /></div>
                            </div>
                          </div>
                        }
                        <div>
                          <label className={transferLabelClass}>Transfer Category</label>
                          <select value={transferCategory} onChange={(e) => setTransferCategory(e.target.value)} className={transferFieldClass}>
                            <option value="">Select...</option>
                            {['Inter-branch', 'Intra-city', 'Inter-city', 'Inter-state', 'International'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}>Priority</label>
                          <select value={priorityLevel} onChange={(e) => setPriorityLevel(e.target.value)} className={transferFieldClass}>
                            {['Normal', 'High', 'Urgent'].map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}>Initiated By</label>
                          <select value={initiatedByWhom} onChange={(e) => setInitiatedByWhom(e.target.value)} className={transferFieldClass}>
                            {['HR', 'Employee', 'Manager', 'Management'].map((who) => <option key={who} value={who}>{who}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Work Schedule</label>
                          <input type="text" value={newWorkSchedule} onChange={(e) => setNewWorkSchedule(e.target.value)} placeholder="e.g. 08:30–15:30" className={transferFieldClass} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Office / Room</label>
                          <input type="text" value={newOfficeRoom} onChange={(e) => setNewOfficeRoom(e.target.value)} className={transferFieldClass} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Cost Center</label>
                          <input type="text" value={newCostCenter} onChange={(e) => setNewCostCenter(e.target.value)} className={transferFieldClass} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>New Probation (if applicable)</label>
                          <input type="text" value={newProbation} onChange={(e) => setNewProbation(e.target.value)} placeholder="e.g. 3 months" className={transferFieldClass} />
                        </div>
                      </div>
                    </section>
                    }

                    {formStep === 2 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><FileText className="w-4 h-4 text-indigo-600" /> Reason for Transfer</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TRANSFER_REASON_OPTIONS.map((reason) =>
                          <label key={reason.value} className="inline-flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input type="checkbox" checked={transferReasons.includes(reason.value)} onChange={() => toggleTransferReason(reason.value)} className="h-4 w-4 rounded text-indigo-600 border-gray-300" />
                            {reason.label}
                          </label>
                        )}
                      </div>
                      <div className="mt-4">
                        <label className={transferLabelClass}>Additional Notes / Comments</label>
                        <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter any additional notes or instructions..." rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                      </div>
                      {formErrors.transferReasons && <p className="mt-2 text-xs text-red-600">{formErrors.transferReasons}</p>}
                    </section>
                    }

                    {formStep === 3 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><DollarSign className="w-4 h-4 text-indigo-600" /> Employment Condition Changes</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-gray-700">Salary Change?</span>
                            <Toggle checked={salaryChange} onChange={(checked) => setSalaryChange(checked)} label={salaryChange ? 'Yes' : 'No'} />
                          </div>
                          {salaryChange && <div><label className={transferLabelClass}>New Salary (₹ per month)</label><input type="number" min={0} value={newSalary} onChange={(e) => setNewSalary(e.target.value)} className={transferFieldClass} />{formErrors.newSalary && <p className="mt-1 text-xs text-red-600">{formErrors.newSalary}</p>}</div>}
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-700">Benefits Change?</span>
                          <Toggle checked={benefitsChange} onChange={(checked) => setBenefitsChange(checked)} label={benefitsChange ? 'Yes' : 'No'} />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg space-y-3 md:col-span-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-sm font-medium text-gray-700">Role / Responsibilities Change?</span>
                            <Toggle checked={roleChange} onChange={(checked) => setRoleChange(checked)} label={roleChange ? 'Yes' : 'No'} />
                          </div>
                          {roleChange && <textarea value={roleChangeDetails} onChange={(e) => setRoleChangeDetails(e.target.value)} placeholder="Describe the change in role or responsibilities..." rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />}
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4 md:col-span-2">
                          <span className="text-sm font-medium text-gray-700">Relocation Assistance Provided?</span>
                          <Toggle checked={relocationAssistance} onChange={(checked) => setRelocationAssistance(checked)} label={relocationAssistance ? 'Yes' : 'No'} />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-700">Pay Grade Change?</span>
                          <Toggle checked={payGradeChange} onChange={setPayGradeChange} label={payGradeChange ? 'Yes' : 'No'} />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-700">Tax Location Change?</span>
                          <Toggle checked={taxLocationChange} onChange={setTaxLocationChange} label={taxLocationChange ? 'Yes' : 'No'} />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-700">Insurance Update Required?</span>
                          <Toggle checked={insuranceUpdate} onChange={setInsuranceUpdate} label={insuranceUpdate ? 'Yes' : 'No'} />
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-gray-700">Leave Carry Forward?</span>
                          <Toggle checked={leaveCarryForward} onChange={setLeaveCarryForward} label={leaveCarryForward ? 'Yes' : 'No'} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>PF / ESI Transfer Note</label>
                          <input type="text" value={pfTransfer} onChange={(e) => setPfTransfer(e.target.value)} className={transferFieldClass} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>Transport Allowance (₹)</label>
                          <input type="number" min={0} value={transportAllowance} onChange={(e) => setTransportAllowance(e.target.value)} className={transferFieldClass} />
                        </div>
                        <div>
                          <label className={transferLabelClass}>Housing Allowance (₹)</label>
                          <input type="number" min={0} value={housingAllowance} onChange={(e) => setHousingAllowance(e.target.value)} className={transferFieldClass} />
                        </div>
                      </div>
                    </section>
                    }

                    {formStep === 4 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><Briefcase className="w-4 h-4 text-indigo-600" /> Handover</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className={transferLabelClass}>Handover To</label><input type="text" value={handoverTo} onChange={(e) => setHandoverTo(e.target.value)} placeholder="Replacement / colleague name" className={transferFieldClass} /></div>
                        <div><label className={transferLabelClass}>Handover Date</label><input type="date" value={handoverDate} onChange={(e) => setHandoverDate(e.target.value)} className={transferFieldClass} /></div>
                        <div className="md:col-span-2"><label className={transferLabelClass}>Pending Tasks</label><textarea value={pendingTasks} onChange={(e) => setPendingTasks(e.target.value)} rows={3} placeholder="List pending work, classes, or files to hand over..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" /></div>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {HANDOVER_ITEMS.map((item) =>
                          <li key={item.id} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" /> {item.label}
                          </li>
                        )}
                      </ul>
                    </section>
                    }
                    {formStep === 4 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><Paperclip className="w-4 h-4 text-indigo-600" /> Supporting Documents</h4>
                      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-600">Upload request letter, NOC, medical certificate, or other attachments</span>
                        <input type="file" multiple className="hidden" onChange={(e) => {
                          const names = Array.from(e.target.files || []).map((file) => file.name);
                          setDocUploads((prev) => [...prev, ...names]);
                        }} />
                      </label>
                      {docUploads.length > 0 &&
                        <ul className="mt-3 space-y-1">
                          {docUploads.map((name) => <li key={name} className="text-sm text-gray-700 flex items-center gap-2"><Paperclip className="w-3.5 h-3.5" /> {name}</li>)}
                        </ul>
                      }
                    </section>
                    }

                    {formStep === 5 &&
                    <section className={transferCardClass}>
                      <h4 className={transferSectionHeadingClass}><ShieldCheck className="w-4 h-4 text-indigo-600" /> Authorization & Consent</h4>
                      <div className="space-y-3">
                        <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={consentInformed} onChange={(e) => setConsentInformed(e.target.checked)} className="mt-1" />The employee has been verbally informed of this transfer</label>
                        <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={consentManager} onChange={(e) => setConsentManager(e.target.checked)} className="mt-1" />The reporting manager has acknowledged this request{!consentManager && <span className="block text-xs text-red-600">This confirmation is required</span>}</label>
                        <label className="flex items-start gap-2 text-sm text-gray-700"><input type="checkbox" checked={consentAccurate} onChange={(e) => setConsentAccurate(e.target.checked)} className="mt-1" />All information provided is accurate to the best of my knowledge</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className={transferLabelClass}>Initiated By *</label><input value={initiatedBy} onChange={(e) => setInitiatedBy(e.target.value)} className={transferFieldClass} /></div>
                          <div><label className={transferLabelClass}>HR Officer Designation *</label><input value={hrDesignation} onChange={(e) => setHrDesignation(e.target.value)} className={transferFieldClass} /></div>
                        </div>
                        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs text-gray-600">By submitting this form, you confirm the above statements are true. This submission will be logged with your user ID, timestamp, and IP address for audit purposes.</div>
                      </div>
                    </section>
                    }

                    {!stepValid[formStep] &&
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <p className="text-sm text-amber-800">{formStep === 5 ? 'Please complete required fields, future effective date, consent checkboxes, and officer details.' : 'Please complete the required fields on this step before continuing.'}</p>
                      </div>
                    }
                    </div>

                    <aside className="xl:sticky xl:top-4 h-fit rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-3">
                      <h4 className="text-sm font-semibold text-indigo-900">Live summary</h4>
                      <dl className="space-y-2 text-sm">
                        <div><dt className="text-xs text-indigo-700">Employee</dt><dd className="font-medium text-gray-900">{empFullName || '—'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">From → To</dt><dd className="font-medium text-gray-900">{branches.find((b) => b.value === currentBranch)?.label || selectedEmployee.branch} → {branches.find((b) => b.value === newBranch)?.label || 'Select branch'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">Effective</dt><dd className="font-medium text-gray-900">{effectiveDate || 'Not set'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">Type</dt><dd className="font-medium text-gray-900">{transferType || '—'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">Priority</dt><dd className="font-medium text-gray-900">{priorityLevel}</dd></div>
                        <div><dt className="text-xs text-indigo-700">Reasons</dt><dd className="font-medium text-gray-900">{transferReasons.length ? TRANSFER_REASON_OPTIONS.filter((r) => transferReasons.includes(r.value)).map((r) => r.label).join(', ') : 'None selected'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">New manager</dt><dd className="font-medium text-gray-900">{managers.find((m) => m.value === newManager)?.label || '—'}</dd></div>
                        <div><dt className="text-xs text-indigo-700">Documents</dt><dd className="font-medium text-gray-900">{docUploads.length} file(s)</dd></div>
                      </dl>
                      <p className="text-xs text-indigo-700">Process after submit: Initiate → Manager → HR → Destination → Handover → Complete</p>
                    </aside>
                  </div>

                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Transfer Process Steps</h4>
                      <div className="flex items-center justify-between">
                        {outgoingTransferSteps.map((step, index) =>
                          <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${getStepStatus(step.id, currentTransferStep + 1) === 'completed' ? 'bg-green-500 text-white' : getStepStatus(step.id, currentTransferStep + 1) === 'current' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {getStepStatus(step.id, currentTransferStep + 1) === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                              </div>
                              <p className="text-xs text-gray-600 mt-1 text-center max-w-[80px]">{step.title}</p>
                            </div>
                            {index < outgoingTransferSteps.length - 1 && <div className={`w-12 h-0.5 mx-1 ${getStepStatus(step.id, currentTransferStep + 1) === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex flex-wrap justify-between gap-3">
                    <button type="button" onClick={handleClearSelection} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                    <div className="flex gap-3">
                      {formStep > 1 && <button type="button" onClick={() => setFormStep((s) => s - 1)} className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /> Back</button>}
                      {formStep < FORM_WIZARD_STEPS.length && <button type="button" disabled={!stepValid[formStep]} onClick={() => setFormStep((s) => s + 1)} className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">Next <ChevronRight className="w-4 h-4" /></button>}
                      {formStep === FORM_WIZARD_STEPS.length &&
                        <button type="button" onClick={handleInitiateTransfer} disabled={!isFormValid || isProcessing} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                          {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Initiate Transfer</>}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }

              {outgoingTransfers.length > 0 &&
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /> Active Outgoing Transfers</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {outgoingTransfers.map((transfer) =>
                      <div key={transfer.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">{transfer.employeeAvatar}</div>
                            <div>
                              <p className="font-medium text-gray-900">{transfer.employeeName}</p>
                              <p className="text-sm text-gray-500">{transfer.employeeId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center"><p className="text-xs text-gray-500">From</p><p className="text-sm font-medium text-gray-700">{transfer.fromBranch}</p></div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <div className="text-center"><p className="text-xs text-gray-500">To</p><p className="text-sm font-medium text-gray-700">{transfer.toBranch}</p></div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transfer.status)}`}>{transfer.status}</span>
                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" /> Effective: {formatDate(transfer.effectiveDate)}
                          <span className="mx-2">•</span> Step {transfer.currentStep} of 6
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              }
            </div>
          }

          {activeTab === 'incoming' &&
            <div className="space-y-6">
              {incomingTransfers.filter(isUrgentIncoming).length > 0 &&
                <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">{incomingTransfers.filter(isUrgentIncoming).length} urgent incoming transfer{incomingTransfers.filter(isUrgentIncoming).length === 1 ? '' : 's'}</p>
                    <p className="text-xs text-amber-800">Pending requests with reporting dates in the next 14 days (or overdue) need acceptance.</p>
                  </div>
                </div>
              }
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Filter:</span>
                  <div className="flex gap-2">
                    {['all', 'pending', 'in progress', 'completed'].map((filter) =>
                      <button type="button" key={filter} onClick={() => setIncomingFilter(filter)} className={`px-3 py-1 rounded-full text-xs font-medium ${incomingFilter === filter ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    )}
                  </div>
                </div>
                <button type="button" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><RefreshCw className="w-4 h-4" /> Refresh</button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-gray-500" /> Incoming Transfer Requests
                    {filteredIncomingTransfers.filter((t) => t.status === 'Pending').length > 0 && <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{filteredIncomingTransfers.filter((t) => t.status === 'Pending').length} Pending</span>}
                  </h3>
                </div>
                {filteredIncomingTransfers.length > 0 ?
                  <div className="divide-y divide-gray-200">
                    {filteredIncomingTransfers.map((transfer) =>
                      <div key={transfer.id} className={`p-4 ${isUrgentIncoming(transfer) ? 'bg-amber-50/70' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center text-lg font-semibold">{transfer.employeeAvatar}</div>
                            <div>
                              <p className="font-medium text-gray-900 flex items-center gap-2">{transfer.employeeName}{isUrgentIncoming(transfer) && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 uppercase"><AlertTriangle className="w-3 h-3" /> Urgent</span>}</p>
                              <p className="text-sm text-gray-500">{transfer.employeeId} • {transfer.employeeDesignation}</p>
                              <div className="flex items-center gap-2 mt-2 text-sm">
                                <span className="text-gray-600">{transfer.fromBranch}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-indigo-600">{transfer.toBranch}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transfer.status)}`}>{transfer.status}</span>
                            <p className="text-xs text-gray-500">Requested: {formatDate(transfer.requestDate)}</p>
                          </div>
                        </div>
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Transfer Progress</span>
                            <span className="text-sm text-gray-500">Step {transfer.currentStep} of {incomingTransferSteps.length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {incomingTransferSteps.map((step, index) =>
                              <React.Fragment key={step.id}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step.id <= transfer.currentStep ? step.id < transfer.currentStep ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                  {step.id < transfer.currentStep ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                                </div>
                                {index < incomingTransferSteps.length - 1 && <div className={`flex-1 h-1 rounded ${step.id < transfer.currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Effective: {formatDate(transfer.effectiveDate)}</span>
                            <span className="flex items-center gap-1"><User className="w-4 h-4" /> By: {transfer.initiatedBy}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {transfer.status === 'Pending' &&
                              <>
                                <button type="button" onClick={() => handleProcessIncomingTransfer(transfer, 'reject')} className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm"><XCircle className="w-4 h-4" /> Reject</button>
                                <button type="button" onClick={() => handleProcessIncomingTransfer(transfer, 'accept')} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"><CheckCircle className="w-4 h-4" /> Accept</button>
                              </>
                            }
                            {transfer.status === 'In Progress' && transfer.currentStep < maxStepForType(transfer.type) &&
                              <button type="button" onClick={() => handleAdvanceIncomingStep(transfer)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"><ArrowRight className="w-4 h-4" /> Advance to Next Step</button>
                            }
                            {transfer.currentStep >= maxStepForType(transfer.type) && <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">✓ Transfer Complete</span>}
                            {(transfer.status === 'Approved' || transfer.status === 'Completed') &&
                              <button type="button" onClick={() => setLetterPreview(transfer)} className="flex items-center gap-1 px-3 py-1.5 border border-indigo-200 text-indigo-700 rounded-lg text-sm">Generate Letter</button>
                            }
                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div> :
                  <div className="p-12 text-center">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-500">No incoming transfers</p>
                  </div>
                }
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <button type="button" onClick={() => setExpandedSection(expandedSection === 'transferred-list' ? null : 'transferred-list')} className="w-full p-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-500" /> Employees Transferred In
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{transferredInEmployees.length}</span>
                  </h3>
                  {expandedSection === 'transferred-list' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {expandedSection === 'transferred-list' &&
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {['Employee', 'Department', 'Designation', 'Transfer Date', 'Reporting To', 'Contact', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transferredInEmployees.map((employee) =>
                          <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-semibold">{employee.avatar}</div>
                                <div><p className="font-medium text-gray-900">{employee.name}</p><p className="text-xs text-gray-500">{employee.id}</p></div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">{employee.department}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{employee.designation}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{formatDate(employee.joiningDate)}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">{employee.reportingManager}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button type="button" className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title={employee.email}><Mail className="w-4 h-4" /></button>
                                <button type="button" className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title={employee.phone}><Phone className="w-4 h-4" /></button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><Eye className="w-4 h-4" /></button>
                                <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><MoreHorizontal className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                }
              </div>
            </div>
          }

          {activeTab === 'history' &&
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Search name or ID..." className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm" />
                  </div>
                  <select value={historyType} onChange={(e) => setHistoryType(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Types</option><option>Incoming</option><option>Outgoing</option>
                  </select>
                  <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Status</option><option>Completed</option><option>Rejected</option><option>Cancelled</option>
                  </select>
                  <select value={historySort} onChange={(e) => setHistorySort(e.target.value as typeof historySort)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="date">Sort: Date</option>
                    <option value="id">Sort: ID</option>
                    <option value="employee">Sort: Employee</option>
                    <option value="type">Sort: Type</option>
                    <option value="status">Sort: Status</option>
                  </select>
                  <button type="button" onClick={() => { setHistorySearch(''); setHistoryType('All Types'); setHistoryStatus('All Status'); setHistorySort('date'); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">Clear Filters</button>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => {
                    const header = 'Transfer ID,Employee,Type,From,To,Date,Status';
                    const rows = historyRecords.map((t) => [t.id, t.employeeName, t.type, t.fromBranch, t.toBranch, t.effectiveDate, t.status].join(','));
                    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'transfer-history.csv'; a.click(); URL.revokeObjectURL(url);
                  }} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"><Download className="w-4 h-4" /> Export</button>
                  <button type="button" onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"><Printer className="w-4 h-4" /> Print</button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Transfer ID', 'Employee', 'Type', 'From → To', 'Date', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pagedHistory.map((transfer) =>
                      <tr key={transfer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm text-gray-600">{transfer.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center text-sm font-semibold">{transfer.employeeAvatar}</div>
                            <div><p className="text-sm font-medium text-gray-900">{transfer.employeeName}</p><p className="text-xs text-gray-500">{transfer.employeeId}</p></div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${transfer.type === 'Incoming' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {transfer.type === 'Incoming' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                            {transfer.type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm"><span className="text-gray-600">{transfer.fromBranch}</span><ArrowRight className="w-4 h-4 text-gray-400" /><span className="text-gray-900 font-medium">{transfer.toBranch}</span></div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(transfer.effectiveDate)}</td>
                        <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transfer.status)}`}>{transfer.status}</span></td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button type="button" className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Eye className="w-4 h-4" /></button>
                            <button type="button" className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"><Download className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {historyRecords.length === 0 &&
                  <div className="p-12 text-center">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-700">No transfers match your current filters</p>
                    <button type="button" className="mt-3 px-3 py-1.5 border rounded-lg text-sm" onClick={() => { setHistorySearch(''); setHistoryType('All Types'); setHistoryStatus('All Status'); }}>Clear Filters</button>
                  </div>
                }
                {historyRecords.length > 0 &&
                  <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                    <p>Showing {(historyPage - 1) * historyPageSize + 1}–{Math.min(historyPage * historyPageSize, historyRecords.length)} of {historyRecords.length}</p>
                    <div className="flex items-center gap-2">
                      <button type="button" disabled={historyPage <= 1} onClick={() => setHistoryPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded disabled:opacity-40">Prev</button>
                      <span>Page {historyPage} of {historyPages}</span>
                      <button type="button" disabled={historyPage >= historyPages} onClick={() => setHistoryPage((p) => Math.min(historyPages, p + 1))} className="px-2 py-1 border rounded disabled:opacity-40">Next</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>

      {letterPreview &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-lg w-full bg-white rounded-xl p-6 space-y-3">
            <div className="flex justify-between"><h3 className="font-semibold">Transfer Letter Preview</h3><button type="button" onClick={() => setLetterPreview(null)}><X className="w-4 h-4" /></button></div>
            <div className="border rounded-lg p-4 text-sm space-y-2">
              <p className="font-bold">SCHOOL NAME</p>
              <p className="text-xs text-gray-500">Address Line, City - PIN</p>
              <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
              <p>To,<br />{letterPreview.employeeName}<br />{letterPreview.employeeDesignation}</p>
              <p className="font-medium">Sub: Transfer Order — {letterPreview.id}</p>
              <p>This is to inform you that you are hereby transferred to {letterPreview.toBranch} effective {formatDate(letterPreview.effectiveDate)}, reporting to {letterPreview.newManager} in {letterPreview.toDepartment} as {letterPreview.newDesignation}.</p>
              <p className="text-xs text-gray-500">This is a computer-generated document.</p>
            </div>
            <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => { const blob = new Blob([`Transfer Order ${letterPreview.id}\n${letterPreview.employeeName}\nTo ${letterPreview.toBranch} effective ${letterPreview.effectiveDate}`], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Transfer_${letterPreview.id}_${letterPreview.employeeName}.txt`; a.click(); URL.revokeObjectURL(url); }}>Download Letter</button>
          </div>
        </div>
      }
    </div>
  );
}

export default EmployeeTransfer;
