import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Toggle } from '../../../components/ui/Toggle';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpFromLine,
  Building2,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  History,
  Home,
  Inbox,
  Loader2,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Upload,
  User,
  UserCheck,
  X,
  XCircle
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
  type: 'Outgoing' | 'Incoming';
  nature?: string;
  duration?: string;
  approvalDate?: string;
  approvedBy?: string;
  rejectReason?: string;
}

interface TransferStep {
  id: number;
  title: string;
  description: string;
}

const mockEmployees: Employee[] = [
  { id: 'EMP001', name: 'Dr. Rajesh Kumar', avatar: 'RK', designation: 'HOD Mathematics', department: 'Mathematics', branch: 'Main Campus', reportingManager: 'Principal', email: 'rajesh.k@school.edu', phone: '+91 9876543201', joiningDate: '2018-06-15', staffType: 'Teaching' },
  { id: 'EMP002', name: 'Sarah Jenkins', avatar: 'SJ', designation: 'Senior Teacher', department: 'English', branch: 'Main Campus', reportingManager: 'Dr. Rajesh Kumar', email: 'sarah.j@school.edu', phone: '+91 9876543202', joiningDate: '2019-04-01', staffType: 'Teaching' },
  { id: 'EMP003', name: 'Michael Chen', avatar: 'MC', designation: 'Admin Officer', department: 'Administration', branch: 'Main Campus', reportingManager: 'HR Manager', email: 'michael.c@school.edu', phone: '+91 9876543203', joiningDate: '2020-01-10', staffType: 'Non-Teaching' },
  { id: 'EMP004', name: 'Priya Sharma', avatar: 'PS', designation: 'Lab Assistant', department: 'Science', branch: 'Main Campus', reportingManager: 'Science HOD', email: 'priya.s@school.edu', phone: '+91 9876543204', joiningDate: '2023-08-01', staffType: 'Support' },
  { id: 'EMP005', name: 'David Wilson', avatar: 'DW', designation: 'Sports Coach', department: 'Physical Education', branch: 'Main Campus', reportingManager: 'Vice Principal', email: 'david.w@school.edu', phone: '+91 9876543205', joiningDate: '2021-03-15', staffType: 'Teaching' },
  { id: 'EMP006', name: 'Anita Desai', avatar: 'AD', designation: 'Librarian', department: 'Library', branch: 'North Campus', reportingManager: 'Academic Coordinator', email: 'anita.d@school.edu', phone: '+91 9876543206', joiningDate: '2017-11-20', staffType: 'Non-Teaching' },
  { id: 'EMP007', name: 'Farhan Qureshi', avatar: 'FQ', designation: 'IT Administrator', department: 'IT', branch: 'Main Campus', reportingManager: 'IT Manager', email: 'farhan.q@school.edu', phone: '+91 9876543207', joiningDate: '2022-02-01', staffType: 'Non-Teaching' },
  { id: 'EMP008', name: 'Kavita Nair', avatar: 'KN', designation: 'Hindi Teacher', department: 'Hindi', branch: 'South Campus', reportingManager: 'Hindi HOD', email: 'kavita.n@school.edu', phone: '+91 9876543208', joiningDate: '2016-07-12', staffType: 'Teaching' },
  { id: 'EMP009', name: 'Rohit Mehta', avatar: 'RM', designation: 'Accounts Officer', department: 'Accounts', branch: 'Main Campus', reportingManager: 'HR Manager', email: 'rohit.m@school.edu', phone: '+91 9876543209', joiningDate: '2024-09-01', staffType: 'Contract' },
  { id: 'EMP010', name: 'Neha Patel', avatar: 'NP', designation: 'Art Teacher', department: 'Arts', branch: 'West Campus', reportingManager: 'Arts Coordinator', email: 'neha.p@school.edu', phone: '+91 9876543210', joiningDate: '2019-12-05', staffType: 'Teaching' }
];

const mockIncomingTransfers: TransferRequest[] = [
  { id: 'TRF-IN-001', employeeId: 'EMP101', employeeName: 'Arun Krishnan', employeeAvatar: 'AK', employeeDesignation: 'Mathematics Teacher', fromBranch: 'East Campus', toBranch: 'Main Campus', fromDepartment: 'Mathematics', toDepartment: 'Mathematics', newDesignation: 'Senior Mathematics Teacher', newManager: 'Dr. Rajesh Kumar', requestDate: '2026-09-15', effectiveDate: '2026-10-10', status: 'Pending', currentStep: 1, initiatedBy: 'East Campus Admin', remarks: 'Family relocation', type: 'Incoming', nature: 'Lateral', duration: 'Permanent' },
  { id: 'TRF-IN-002', employeeId: 'EMP102', employeeName: 'Kavitha Nair', employeeAvatar: 'KN', employeeDesignation: 'Hindi Teacher', fromBranch: 'South Campus', toBranch: 'Main Campus', fromDepartment: 'Hindi', toDepartment: 'Hindi', newDesignation: 'Hindi Teacher', newManager: 'Hindi HOD', requestDate: '2026-10-01', effectiveDate: '2026-10-25', status: 'Pending', currentStep: 1, initiatedBy: 'South Campus Admin', remarks: 'Vacancy fill', type: 'Incoming', nature: 'Replacement', duration: 'Permanent' },
  { id: 'TRF-IN-003', employeeId: 'EMP103', employeeName: 'Anita Desai', employeeAvatar: 'AD', employeeDesignation: 'Librarian', fromBranch: 'North Campus', toBranch: 'Main Campus', fromDepartment: 'Library', toDepartment: 'Library', newDesignation: 'Librarian', newManager: 'Academic Coordinator', requestDate: '2026-09-12', effectiveDate: '2026-11-02', status: 'In Progress', currentStep: 3, initiatedBy: 'North Campus Admin', remarks: 'Workload balancing', type: 'Incoming' },
  { id: 'TRF-IN-004', employeeId: 'EMP104', employeeName: 'Meera Iyer', employeeAvatar: 'MI', employeeDesignation: 'Coordinator', fromBranch: 'Mumbai Campus', toBranch: 'Main Campus', fromDepartment: 'English', toDepartment: 'English', newDesignation: 'Coordinator', newManager: 'Principal', requestDate: '2026-08-20', effectiveDate: '2026-10-30', status: 'In Progress', currentStep: 4, initiatedBy: 'Mumbai Campus Admin', remarks: 'Inter-state posting', type: 'Incoming' },
  { id: 'TRF-IN-005', employeeId: 'EMP105', employeeName: 'Robert Williams', employeeAvatar: 'RW', employeeDesignation: 'Senior IT Administrator', fromBranch: 'West Campus', toBranch: 'Main Campus', fromDepartment: 'IT', toDepartment: 'IT', newDesignation: 'Senior IT Administrator', newManager: 'IT Manager', requestDate: '2026-08-01', effectiveDate: '2026-10-02', status: 'Completed', currentStep: 6, initiatedBy: 'West Campus Admin', remarks: 'IT centralisation', type: 'Incoming' }
];

const mockOutgoingTransfers: TransferRequest[] = [
  { id: 'TRF-OUT-001', employeeId: 'EMP005', employeeName: 'David Wilson', employeeAvatar: 'DW', employeeDesignation: 'Sports Coach', fromBranch: 'Main Campus', toBranch: 'North Campus', fromDepartment: 'Physical Education', toDepartment: 'Physical Education', newDesignation: 'Head Coach', newManager: 'North Campus Principal', requestDate: '2026-10-05', effectiveDate: '2026-11-01', status: 'Pending', currentStep: 1, initiatedBy: 'HR Manager', remarks: 'Promotion to Head Coach', type: 'Outgoing', nature: 'Promotional', duration: 'Permanent' },
  { id: 'TRF-OUT-002', employeeId: 'EMP002', employeeName: 'Sarah Jenkins', employeeAvatar: 'SJ', employeeDesignation: 'Senior Teacher', fromBranch: 'Main Campus', toBranch: 'South Campus', fromDepartment: 'English', toDepartment: 'English', newDesignation: 'Senior Teacher', newManager: 'South Campus Principal', requestDate: '2026-09-20', effectiveDate: '2026-10-28', status: 'Approved', currentStep: 2, initiatedBy: 'HR Manager', remarks: 'Operational requirement', type: 'Outgoing', approvalDate: '2026-09-25', approvedBy: 'Principal' },
  { id: 'TRF-OUT-003', employeeId: 'EMP007', employeeName: 'Farhan Qureshi', employeeAvatar: 'FQ', employeeDesignation: 'IT Administrator', fromBranch: 'Main Campus', toBranch: 'Mumbai Campus', fromDepartment: 'IT', toDepartment: 'IT', newDesignation: 'Senior IT Administrator', newManager: 'IT Manager', requestDate: '2026-09-01', effectiveDate: '2026-11-15', status: 'In Progress', currentStep: 4, initiatedBy: 'IT Manager', remarks: 'Centralisation of IT', type: 'Outgoing' },
  { id: 'TRF-OUT-004', employeeId: 'EMP003', employeeName: 'Michael Chen', employeeAvatar: 'MC', employeeDesignation: 'Admin Officer', fromBranch: 'Main Campus', toBranch: 'City Center Branch', fromDepartment: 'Administration', toDepartment: 'Administration', newDesignation: 'Admin Officer', newManager: 'HR Manager', requestDate: '2026-08-18', effectiveDate: '2026-10-20', status: 'In Progress', currentStep: 6, initiatedBy: 'HR Manager', remarks: 'Job rotation', type: 'Outgoing' },
  { id: 'TRF-OUT-005', employeeId: 'EMP010', employeeName: 'Neha Patel', employeeAvatar: 'NP', employeeDesignation: 'Art Teacher', fromBranch: 'West Campus', toBranch: 'Main Campus', fromDepartment: 'Arts', toDepartment: 'Arts', newDesignation: 'Art Teacher', newManager: 'Arts Coordinator', requestDate: '2026-07-10', effectiveDate: '2026-08-15', status: 'Rejected', currentStep: 2, initiatedBy: 'West Campus Admin', remarks: 'Personal request', type: 'Outgoing', rejectReason: 'No vacancy' }
];

const mockTransferredIn: Employee[] = [
  { id: 'EMP103', name: 'Robert Williams', avatar: 'RW', designation: 'Senior IT Administrator', department: 'IT', branch: 'Main Campus', reportingManager: 'IT Manager', email: 'robert.w@school.edu', phone: '+91 9876543310', joiningDate: '2026-10-02', staffType: 'Non-Teaching' },
  { id: 'EMP098', name: 'Meera Patel', avatar: 'MP', designation: 'Librarian', department: 'Library', branch: 'Main Campus', reportingManager: 'Academic Coordinator', email: 'meera.p@school.edu', phone: '+91 9876543311', joiningDate: '2026-09-01', staffType: 'Non-Teaching' },
  { id: 'EMP087', name: 'James Anderson', avatar: 'JA', designation: 'Music Teacher', department: 'Arts', branch: 'Main Campus', reportingManager: 'Arts Coordinator', email: 'james.a@school.edu', phone: '+91 9876543312', joiningDate: '2026-08-15', staffType: 'Teaching' }
];

const branches = [
  { value: 'main-campus', label: 'Main Campus' },
  { value: 'north-campus', label: 'North Campus' },
  { value: 'south-campus', label: 'South Campus' },
  { value: 'east-campus', label: 'East Campus' },
  { value: 'west-campus', label: 'West Campus' },
  { value: 'city-center', label: 'City Center Branch' },
  { value: 'mumbai-campus', label: 'Mumbai Campus' }
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

const TRANSFER_NATURES = [
  { value: 'Lateral', label: 'Lateral', hint: 'Same grade, no pay change' },
  { value: 'Promotional', label: 'Promotional', hint: 'Higher grade, pay increase' },
  { value: 'Remedial', label: 'Remedial', hint: 'Corrective placement' },
  { value: 'Production', label: 'Production', hint: 'Workload balancing' },
  { value: 'Replacement', label: 'Replacement', hint: 'Fill a vacancy' },
  { value: 'Versatility', label: 'Versatility / Job Rotation', hint: 'Skill development' }
];

const TRANSFER_JUSTIFICATIONS = [
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
  { value: 'vacancy', label: 'Vacancy / Staffing Shortage' },
  { value: 'other', label: 'Other' }
];

const HANDOVER_ITEMS = [
  { id: 'docs', label: 'Work documentation handed over to replacement' },
  { id: 'tasks', label: 'Pending tasks briefed to team' },
  { id: 'access', label: 'System and software access deactivated' },
  { id: 'assets', label: 'Company assets returned (laptop, ID card, keys)' },
  { id: 'email', label: 'Email auto-responder set up pointing to new contact' },
  { id: 'clearance', label: 'Exit clearance form signed by HOD' }
];

const FORM_STEPS = [
  { id: 1, title: 'Employee & Location' },
  { id: 2, title: 'Transfer Details' },
  { id: 3, title: 'Conditions' },
  { id: 4, title: 'Handover & Documents' },
  { id: 5, title: 'Approvals' }
];

const outgoingTransferSteps: TransferStep[] = [
  { id: 1, title: 'Request Initiated', description: 'HR/Manager submits form' },
  { id: 2, title: 'Manager Approval', description: 'Current manager reviews' },
  { id: 3, title: 'HR Review', description: 'Eligibility and records' },
  { id: 4, title: 'Compensation Review', description: 'Payroll confirms changes' },
  { id: 5, title: 'Destination Acceptance', description: 'Receiving branch accepts' },
  { id: 6, title: 'Employee Acknowledgment', description: 'Employee signs' },
  { id: 7, title: 'Handover', description: 'Clearance and assets' },
  { id: 8, title: 'Transfer Executed', description: 'Employee reports to new branch' }
];

const incomingTransferSteps: TransferStep[] = [
  { id: 1, title: 'Request Received', description: 'From source branch' },
  { id: 2, title: 'Review & Verify', description: 'Records and vacancy' },
  { id: 3, title: 'Acceptance', description: 'Formally accept' },
  { id: 4, title: 'Assignment Setup', description: 'Dept, manager, workspace' },
  { id: 5, title: 'Onboarding', description: 'New-branch induction' },
  { id: 6, title: '30-Day Check-in', description: 'Post-transfer review' }
];

const fieldClass = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const cardClass = 'rounded-xl border border-gray-200 bg-white p-5 shadow-sm';
const dateNowIso = () => new Date().toISOString().slice(0, 10);
const labelOf = (opts: { value: string; label: string }[], value: string) => opts.find((o) => o.value === value)?.label || value;
const stepsForType = (type: TransferRequest['type']) => type === 'Incoming' ? incomingTransferSteps : outgoingTransferSteps;
const maxStepForType = (type: TransferRequest['type']) => stepsForType(type).length;
const initialsFrom = (name: string) => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

export function EmployeeTransfer() {
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming' | 'history'>('outgoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [searchDept, setSearchDept] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchBranch, setSearchBranch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const searchRef = useRef<HTMLDivElement>(null);

  const [empFullName, setEmpFullName] = useState('');
  const [empId, setEmpId] = useState('');
  const [staffType, setStaffType] = useState('');
  const [empJobTitle, setEmpJobTitle] = useState('');
  const [empDepartment, setEmpDepartment] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empMobile, setEmpMobile] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentBranch, setCurrentBranch] = useState('');
  const [currentManager, setCurrentManager] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [officeRoomNo, setOfficeRoomNo] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reportingDateNewBranch, setReportingDateNewBranch] = useState('');
  const [transferNature, setTransferNature] = useState('');
  const [transferDuration, setTransferDuration] = useState('');
  const [durationFrom, setDurationFrom] = useState('');
  const [durationTo, setDurationTo] = useState('');
  const [transferReasons, setTransferReasons] = useState<string[]>([]);
  const [remarks, setRemarks] = useState('');
  const [salaryChange, setSalaryChange] = useState(false);
  const [newSalary, setNewSalary] = useState('');
  const [benefitsChange, setBenefitsChange] = useState(false);
  const [roleChange, setRoleChange] = useState(false);
  const [roleChangeDetails, setRoleChangeDetails] = useState('');
  const [relocationAssistance, setRelocationAssistance] = useState(false);
  const [handoverTo, setHandoverTo] = useState('');
  const [handoverDate, setHandoverDate] = useState('');
  const [pendingTasks, setPendingTasks] = useState('');
  const [handoverChecks, setHandoverChecks] = useState<Record<string, boolean>>({});
  const [docUploads, setDocUploads] = useState<string[]>([]);
  const [consentInformed, setConsentInformed] = useState(false);
  const [consentManager, setConsentManager] = useState(false);
  const [consentAccurate, setConsentAccurate] = useState(false);
  const [initiatedBy, setInitiatedBy] = useState('');
  const [hrDesignation, setHrDesignation] = useState('');

  const [incomingTransfers, setIncomingTransfers] = useState<TransferRequest[]>(mockIncomingTransfers);
  const [outgoingTransfers, setOutgoingTransfers] = useState<TransferRequest[]>(mockOutgoingTransfers);
  const [incomingFilter, setIncomingFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState('All Types');
  const [historyStatus, setHistoryStatus] = useState('All Status');
  const [historySort, setHistorySort] = useState<'id' | 'employee' | 'type' | 'status' | 'date'>('date');
  const [historyPage, setHistoryPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const [eligibilityReady, setEligibilityReady] = useState(false);
  const [eligibilityOverride, setEligibilityOverride] = useState(false);
  const [letterPreview, setLetterPreview] = useState<TransferRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<TransferRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [expandedIn, setExpandedIn] = useState(true);

  const filteredEmployees = mockEmployees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = emp.name.toLowerCase().includes(q) || emp.id.toLowerCase().includes(q);
    return matchesSearch && (!searchDept || emp.department === searchDept) && (!searchType || emp.staffType === searchType) && (!searchBranch || emp.branch === searchBranch);
  });

  const filteredIncoming = incomingTransfers.filter((t) => incomingFilter === 'all' || t.status.toLowerCase() === incomingFilter.toLowerCase());

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setSearchQuery('');
    setShowSuggestions(false);
    setFormStep(1);
    setShowSuccess(false);
    setEmpFullName(employee.name);
    setEmpId(employee.id);
    setStaffType(employee.staffType);
    setEmpJobTitle(employee.designation);
    setEmpDepartment(departments.find((d) => d.label === employee.department)?.value ?? '');
    setEmpEmail(employee.email);
    setEmpMobile(employee.phone);
    setCurrentBranch(branches.find((b) => b.label === employee.branch)?.value ?? '');
    setCurrentManager(employee.reportingManager);
    setNewBranch('');
    setNewDepartment('');
    setNewDesignation('');
    setNewManager('');
    setEffectiveDate('');
    setReportingDateNewBranch('');
    setTransferNature('');
    setTransferDuration('');
    setDurationFrom('');
    setDurationTo('');
    setTransferReasons([]);
    setRemarks('');
    setSalaryChange(false);
    setNewSalary('');
    setBenefitsChange(false);
    setRoleChange(false);
    setRoleChangeDetails('');
    setRelocationAssistance(false);
    setConsentInformed(false);
    setConsentManager(false);
    setConsentAccurate(false);
    setInitiatedBy('');
    setHrDesignation('');
    setHandoverChecks({});
    setDocUploads([]);
  };

  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setFormStep(1);
    setShowSuccess(false);
    setEligibilityOverride(false);
  };

  const fakeRequest = async () => new Promise<void>((resolve) => { window.setTimeout(resolve, 700); });

  const handleInitiateTransfer = async () => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await fakeRequest();
      setShowSuccess(true);
      setOutgoingTransfers((prev) => [{
        id: `TRF-OUT-${String(prev.length + 1).padStart(3, '0')}`,
        employeeId: empId,
        employeeName: empFullName,
        employeeAvatar: selectedEmployee?.avatar || initialsFrom(empFullName),
        employeeDesignation: empJobTitle,
        fromBranch: selectedEmployee?.branch || labelOf(branches, currentBranch),
        toBranch: labelOf(branches, newBranch),
        fromDepartment: selectedEmployee?.department || empDepartment,
        toDepartment: labelOf(departments, newDepartment) || empDepartment,
        newDesignation: labelOf(designations, newDesignation) || empJobTitle,
        newManager: labelOf(managers, newManager),
        requestDate: dateNowIso(),
        effectiveDate,
        status: 'Pending',
        currentStep: 1,
        initiatedBy: initiatedBy || 'HR Manager',
        remarks,
        type: 'Outgoing',
        nature: transferNature,
        duration: transferDuration
      }, ...prev]);
      handleClearSelection();
      setShowSuccess(true);
    } catch {
      setActionError('Failed to initiate transfer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessIncoming = async (transfer: TransferRequest, action: 'accept' | 'reject', reason?: string) => {
    setIsProcessing(true);
    setActionError(null);
    try {
      await fakeRequest();
      setIncomingTransfers((prev) => prev.map((t) => t.id !== transfer.id ? t : action === 'accept'
        ? { ...t, status: 'In Progress', currentStep: Math.min(t.currentStep + 1, maxStepForType(t.type)) }
        : { ...t, status: 'Rejected', rejectReason: reason }));
    } catch {
      setActionError(`Failed to ${action} transfer.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdvance = async (transfer: TransferRequest) => {
    const max = maxStepForType(transfer.type);
    if (transfer.currentStep >= max) return;
    setIsProcessing(true);
    try {
      await fakeRequest();
      const newStep = Math.min(transfer.currentStep + 1, max);
      const updater = (list: TransferRequest[]) => list.map((t) => t.id === transfer.id ? { ...t, currentStep: newStep, status: newStep >= max ? 'Completed' : 'In Progress' } : t);
      if (transfer.type === 'Incoming') setIncomingTransfers(updater);
      else setOutgoingTransfers(updater);
    } catch {
      setActionError('Failed to advance step.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (value: string) => new Date(value).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const getStatusColor = (status: string) => {
    if (status === 'Pending') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (status === 'Approved') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (status === 'In Progress') return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (status === 'Completed') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'Rejected') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };
  const getStepStatus = (stepId: number, current: number) => (stepId < current ? 'completed' : stepId === current ? 'current' : 'pending');

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const noticeDate = new Date(); noticeDate.setDate(noticeDate.getDate() + 7);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);
  const noticeIso = noticeDate.toISOString().slice(0, 10);

  const formErrors = {
    newBranch: !newBranch ? 'Please select a destination branch' : newBranch === currentBranch ? 'Destination must differ from current branch' : '',
    effectiveDate: !effectiveDate ? 'Effective date is required' : effectiveDate <= dateNowIso() ? 'Must be a future date' : effectiveDate < noticeIso ? 'Allow at least 7 days’ notice' : '',
    transferNature: !transferNature ? 'Select transfer nature' : '',
    transferDuration: !transferDuration ? 'Select transfer duration' : '',
    durationFrom: transferDuration !== 'Permanent' && transferDuration && !durationFrom ? 'Start date required' : '',
    durationTo: transferDuration !== 'Permanent' && transferDuration && !durationTo ? 'End date required' : transferDuration !== 'Permanent' && durationFrom && durationTo && durationTo <= durationFrom ? 'End date must be after start' : '',
    transferReasons: transferReasons.length === 0 ? 'Select at least one justification' : '',
    newSalary: salaryChange && !(Number(newSalary) > 0) ? 'Enter a valid salary' : '',
    roleChangeDetails: roleChange && roleChangeDetails.trim().length < 20 ? 'Describe role change (20+ chars)' : '',
    consent: !(consentInformed && consentManager && consentAccurate) ? 'Required' : '',
    initiatedBy: !initiatedBy.trim() ? 'Required' : '',
    hrDesignation: !hrDesignation.trim() ? 'Required' : '',
    empFullName: empFullName.trim().length < 2 ? 'Required' : '',
    empId: !/^EMP\d{3,}$/i.test(empId) ? 'ID must be EMP + digits' : '',
    staffType: !staffType ? 'Required' : '',
    empEmail: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empEmail) ? 'Valid email required' : '',
    empMobile: !empMobile.trim() ? 'Required' : ''
  };
  const stepValid: Record<number, boolean> = {
    1: !formErrors.empFullName && !formErrors.empId && !formErrors.staffType && !formErrors.empEmail && !formErrors.empMobile,
    2: !formErrors.newBranch && !formErrors.effectiveDate && !formErrors.transferNature && !formErrors.transferDuration && !formErrors.durationFrom && !formErrors.durationTo && !formErrors.transferReasons,
    3: !formErrors.newSalary && !formErrors.roleChangeDetails,
    4: true,
    5: !formErrors.consent && !formErrors.initiatedBy && !formErrors.hrDesignation
  };
  const isFormValid = Object.values(formErrors).every((e) => !e);

  const historyRecords = useMemo(() => {
    const combined = [...incomingTransfers, ...outgoingTransfers].filter((i) => ['Completed', 'Rejected', 'Cancelled'].includes(i.status));
    const filtered = combined.filter((item) => {
      const q = historySearch.toLowerCase();
      const matchesSearch = !historySearch || item.employeeName.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
      return matchesSearch && (historyType === 'All Types' || item.type === historyType) && (historyStatus === 'All Status' || item.status === historyStatus);
    });
    return filtered.sort((a, b) => {
      if (historySort === 'id') return a.id.localeCompare(b.id);
      if (historySort === 'employee') return a.employeeName.localeCompare(b.employeeName);
      if (historySort === 'type') return a.type.localeCompare(b.type);
      if (historySort === 'status') return a.status.localeCompare(b.status);
      return b.effectiveDate.localeCompare(a.effectiveDate);
    });
  }, [incomingTransfers, outgoingTransfers, historySearch, historyType, historyStatus, historySort]);

  const historyPageSize = 5;
  const historyPages = Math.max(1, Math.ceil(historyRecords.length / historyPageSize));
  const pagedHistory = historyRecords.slice((historyPage - 1) * historyPageSize, historyPage * historyPageSize);

  useEffect(() => { setHistoryPage(1); }, [historySearch, historyType, historyStatus, historySort]);
  useEffect(() => { if (historyPage > historyPages) setHistoryPage(historyPages); }, [historyPage, historyPages]);
  useEffect(() => {
    if (!showSuccess) return undefined;
    const t = window.setTimeout(() => setShowSuccess(false), 6000);
    return () => window.clearTimeout(t);
  }, [showSuccess]);

  const tenureOk = selectedEmployee ? (Date.now() - new Date(selectedEmployee.joiningDate).getTime()) / 86400000 > 182 : false;
  const noActiveTransfer = selectedEmployee ? !outgoingTransfers.some((i) => i.employeeId === selectedEmployee.id && ['Pending', 'Approved', 'In Progress'].includes(i.status)) : false;
  const employmentOk = selectedEmployee ? selectedEmployee.staffType !== 'Contract' : false;
  const contactOk = selectedEmployee ? Boolean(selectedEmployee.email && selectedEmployee.phone) : false;
  const eligibilityPass = tenureOk && noActiveTransfer && employmentOk && contactOk;

  useEffect(() => {
    if (!selectedEmployee) { setEligibilityReady(false); setEligibilityOverride(false); return undefined; }
    setEligibilityReady(false);
    const t = window.setTimeout(() => setEligibilityReady(true), 900);
    return () => window.clearTimeout(t);
  }, [selectedEmployee]);

  const isUrgent = (t: TransferRequest) => t.status === 'Pending' && (new Date(t.effectiveDate).getTime() - Date.now()) / 86400000 <= 14;
  const outgoingActiveCount = outgoingTransfers.filter((t) => !['Completed', 'Rejected', 'Cancelled'].includes(t.status)).length;
  const incomingPendingCount = incomingTransfers.filter((t) => t.status === 'Pending').length;
  const historyCount = [...incomingTransfers, ...outgoingTransfers].filter((t) => ['Completed', 'Rejected', 'Cancelled'].includes(t.status)).length;
  const toggleReason = (value: string) => setTransferReasons((prev) => prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Home className="w-4 h-4" /> <ChevronRight className="w-3 h-3" /> HR <ChevronRight className="w-3 h-3" /> <Building2 className="w-4 h-4" /> Employee <ChevronRight className="w-3 h-3" /> Employee Transfer
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employee Transfer</h1>
        <p className="text-sm text-gray-500 mt-1">Initiate outgoing transfers, accept incoming staff, and review history.</p>
      </div>

      {actionError && <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800" role="alert"><AlertCircle className="w-4 h-4" />{actionError}</div>}
      {showSuccess && (
        <div className="relative flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Transfer request initiated</p>
            <button type="button" className="text-sm font-medium text-green-800 underline" onClick={() => setActiveTab('outgoing')}>View request</button>
          </div>
          <button type="button" onClick={() => setShowSuccess(false)}><X className="w-4 h-4 text-green-700" /></button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          <button type="button" onClick={() => setActiveTab('outgoing')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'outgoing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            <ArrowUpFromLine className="w-4 h-4" /> Outgoing Transfers <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">{outgoingActiveCount}</span>
          </button>
          <button type="button" onClick={() => setActiveTab('incoming')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'incoming' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            <ArrowDownToLine className="w-4 h-4" /> Incoming Transfers <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">{incomingPendingCount}</span>
          </button>
          <button type="button" onClick={() => setActiveTab('history')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'}`}>
            <History className="w-4 h-4" /> Transfer History <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">{historyCount}</span>
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'outgoing' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-gray-500" /> Select Employee for Transfer</h3>
                <div ref={searchRef} className="relative">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input placeholder="Search by employee name or ID..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" />
                  {searchQuery && <button type="button" className="absolute right-3 top-3.5 text-gray-400" onClick={() => setSearchQuery('')}><X className="w-5 h-5" /></button>}
                  {showSuggestions && (
                    <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {filteredEmployees.length === 0 && <div className="p-4 text-center text-gray-500"><User className="w-8 h-8 mx-auto mb-2 text-gray-300" />No employees found</div>}
                      {filteredEmployees.map((emp) => (
                        <button type="button" key={emp.id} onMouseDown={(event) => event.preventDefault()} onClick={() => handleSelectEmployee(emp)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 border-b last:border-b-0 text-left">
                          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{emp.avatar}</div>
                          <div className="flex-1"><p className="font-medium">{emp.name}</p><p className="text-sm text-gray-500">{emp.id} · {emp.designation}</p></div>
                          <div className="text-right text-sm text-gray-600"><p>{emp.department}</p><p className="text-xs text-gray-400">{emp.branch}</p></div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => setShowSearchFilters((v) => !v)} className="mt-3 inline-flex items-center gap-2 text-sm text-indigo-600"><Filter className="w-4 h-4" /> {showSearchFilters ? 'Hide filters' : 'More filters'}</button>
                {showSearchFilters && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select value={searchDept} onChange={(e) => setSearchDept(e.target.value)} className={fieldClass}><option value="">All departments</option>{departments.map((d) => <option key={d.value} value={d.label}>{d.label}</option>)}</select>
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className={fieldClass}><option value="">All staff types</option>{['Teaching', 'Non-Teaching', 'Support', 'Contract'].map((t) => <option key={t}>{t}</option>)}</select>
                    <select value={searchBranch} onChange={(e) => setSearchBranch(e.target.value)} className={fieldClass}><option value="">All branches</option>{branches.map((b) => <option key={b.value} value={b.label}>{b.label}</option>)}</select>
                  </div>
                )}
                {!selectedEmployee && (
                  <div className="mt-4 divide-y rounded-lg border bg-white">
                    {filteredEmployees.map((emp) => (
                      <button type="button" key={`list-${emp.id}`} onClick={() => handleSelectEmployee(emp)} className="w-full flex items-center gap-4 p-3 hover:bg-indigo-50 text-left">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">{emp.avatar}</div>
                        <div className="flex-1"><p className="font-medium text-gray-900">{emp.name}</p><p className="text-xs text-gray-500">{emp.id} · {emp.designation} · {emp.department}</p></div>
                        <span className="text-xs font-medium text-indigo-600">Select</span>
                      </button>
                    ))}
                    {filteredEmployees.length === 0 && <p className="p-4 text-sm text-gray-500">No employees match the search.</p>}
                  </div>
                )}
                {selectedEmployee && (
                  <div className="mt-4 flex items-center justify-between p-4 bg-white border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">{selectedEmployee.avatar}</div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedEmployee.name}</h3>
                        <p className="text-sm text-gray-600">{selectedEmployee.id} · {selectedEmployee.designation}</p>
                      </div>
                    </div>
                    <button type="button" onClick={handleClearSelection} className="p-2 text-gray-400"><X className="w-5 h-5" /></button>
                  </div>
                )}
                {selectedEmployee && !eligibilityReady && <div className="mt-4 p-4 border rounded-lg bg-white"><p className="text-sm">Checking eligibility for {selectedEmployee.name}...</p><div className="mt-2 h-2 rounded bg-gray-100 overflow-hidden"><div className="h-2 w-2/3 bg-indigo-400 animate-pulse" /></div></div>}
                {selectedEmployee && eligibilityReady && (
                  <div className={`mt-4 p-4 border rounded-lg ${eligibilityPass || eligibilityOverride ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <p className="font-semibold mb-3">{eligibilityPass || eligibilityOverride ? 'Eligible' : 'Not eligible'} — {selectedEmployee.name}</p>
                    <p className="text-sm">{tenureOk ? '✅' : '❌'} Minimum tenure — {tenureOk ? `Joined ${selectedEmployee.joiningDate}` : 'Less than 6 months'}</p>
                    <p className="text-sm">{noActiveTransfer ? '✅' : '❌'} No active transfer</p>
                    <p className="text-sm">{employmentOk ? '✅' : '❌'} Employment type — {selectedEmployee.staffType}</p>
                    <p className="text-sm">{contactOk ? '✅' : '❌'} Contact details</p>
                    {!eligibilityPass && !eligibilityOverride && <button type="button" className="mt-2 px-3 py-1.5 border border-red-300 rounded-lg text-sm" onClick={() => setEligibilityOverride(true)}>Admin override & proceed</button>}
                  </div>
                )}
              </div>

              {selectedEmployee && eligibilityReady && (eligibilityPass || eligibilityOverride) && (
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-indigo-600" /> Transfer Request Form</h3>
                        <p className="text-sm text-gray-500">Step {formStep} of 5 — {FORM_STEPS[formStep - 1].title}</p>
                      </div>
                      <p className="text-xs text-gray-500"><span className="text-red-500">*</span> Required</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                      {FORM_STEPS.map((step) => (
                        <button type="button" key={step.id} onClick={() => { if (step.id <= formStep || stepValid[formStep]) setFormStep(step.id); }} className="flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${formStep === step.id ? 'bg-indigo-600 text-white' : formStep > step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>{formStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}</span>
                          <span className={`hidden sm:block text-xs ${formStep === step.id ? 'text-indigo-700 font-semibold' : 'text-gray-500'}`}>{step.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-6">
                    <div className="space-y-6 min-w-0">
                      {formStep === 1 && (
                        <>
                          <section className={cardClass}>
                            <h4 className="flex items-center gap-2 font-semibold mb-4"><User className="w-4 h-4 text-indigo-600" /> Employee Identification</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className={labelClass}>Full name *</label><input readOnly value={empFullName} className={`${fieldClass} bg-gray-50`} /></div>
                              <div><label className={labelClass}>Employee ID *</label><input readOnly value={empId} className={`${fieldClass} bg-gray-50`} /></div>
                              <div><label className={labelClass}>Staff type *</label><select value={staffType} onChange={(e) => setStaffType(e.target.value)} className={fieldClass}><option value="">Select...</option>{['Teaching', 'Non-Teaching', 'Support', 'Contract'].map((t) => <option key={t}>{t}</option>)}</select></div>
                              <div><label className={labelClass}>Email *</label><input value={empEmail} onChange={(e) => setEmpEmail(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Mobile *</label><input value={empMobile} onChange={(e) => setEmpMobile(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Designation</label><input value={empJobTitle} onChange={(e) => setEmpJobTitle(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Department</label><select value={empDepartment} onChange={(e) => setEmpDepartment(e.target.value)} className={fieldClass}><option value="">Select...</option>{departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                              <div><label className={labelClass}>Date of birth</label><input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Emergency contact</label><input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} className={fieldClass} /></div>
                              <div className="md:col-span-2"><label className={labelClass}>Current address</label><textarea rows={2} value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} className={fieldClass} /></div>
                            </div>
                          </section>
                          <section className={cardClass}>
                            <h4 className="flex items-center gap-2 font-semibold mb-4"><MapPin className="w-4 h-4 text-indigo-600" /> Current Branch</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className={labelClass}>Current branch *</label><select value={currentBranch} onChange={(e) => setCurrentBranch(e.target.value)} className={fieldClass}><option value="">Select...</option>{branches.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></div>
                              <div><label className={labelClass}>Reporting manager</label><input value={currentManager} onChange={(e) => setCurrentManager(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Shift start</label><input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Shift end</label><input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Office / room</label><input value={officeRoomNo} onChange={(e) => setOfficeRoomNo(e.target.value)} className={fieldClass} /></div>
                            </div>
                          </section>
                        </>
                      )}
                      {formStep === 2 && (
                        <>
                          <section className={cardClass}>
                            <h4 className="flex items-center gap-2 font-semibold mb-4"><ArrowRight className="w-4 h-4 text-indigo-600" /> Transfer Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className={labelClass}>Destination branch *</label>
                                <select value={newBranch} onChange={(e) => setNewBranch(e.target.value)} className={fieldClass}><option value="">Select...</option>{branches.filter((b) => b.value !== currentBranch).map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select>
                                {formErrors.newBranch && <p className="mt-1 text-xs text-red-600">{formErrors.newBranch}</p>}
                              </div>
                              <div><label className={labelClass}>New department</label><select value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} className={fieldClass}><option value="">Same as current</option>{departments.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                              <div><label className={labelClass}>New job title</label><select value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} className={fieldClass}><option value="">Same as current</option>{designations.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}</select></div>
                              <div><label className={labelClass}>New manager</label><select value={newManager} onChange={(e) => setNewManager(e.target.value)} className={fieldClass}><option value="">Select...</option>{managers.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
                              <div>
                                <label className={labelClass}><Calendar className="w-4 h-4 inline" /> Effective date *</label>
                                <input type="date" min={tomorrowIso} value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className={fieldClass} />
                                {formErrors.effectiveDate && <p className="mt-1 text-xs text-red-600">{formErrors.effectiveDate}</p>}
                              </div>
                              <div><label className={labelClass}>Reporting date</label><input type="date" value={reportingDateNewBranch} onChange={(e) => setReportingDateNewBranch(e.target.value)} className={fieldClass} /></div>
                              <div className="md:col-span-2">
                                <p className={labelClass}>Transfer nature *</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {TRANSFER_NATURES.map((n) => (
                                    <label key={n.value} className="flex items-start gap-2 text-sm border rounded-lg p-2 cursor-pointer">
                                      <input type="radio" name="nature" checked={transferNature === n.value} onChange={() => setTransferNature(n.value)} />
                                      <span><span className="font-medium">{n.label}</span><span className="block text-xs text-gray-500">{n.hint}</span></span>
                                    </label>
                                  ))}
                                </div>
                                {formErrors.transferNature && <p className="mt-1 text-xs text-red-600">{formErrors.transferNature}</p>}
                              </div>
                              <div className="md:col-span-2">
                                <p className={labelClass}>Transfer duration *</p>
                                <div className="flex flex-wrap gap-4">
                                  {['Permanent', 'Temporary', 'Deputation'].map((d) => (
                                    <label key={d} className="inline-flex items-center gap-2 text-sm"><input type="radio" name="duration" checked={transferDuration === d} onChange={() => setTransferDuration(d)} />{d}</label>
                                  ))}
                                </div>
                                {formErrors.transferDuration && <p className="mt-1 text-xs text-red-600">{formErrors.transferDuration}</p>}
                              </div>
                              {transferDuration && transferDuration !== 'Permanent' && (
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                                  <div><label className={labelClass}>From</label><input type="date" value={durationFrom} onChange={(e) => setDurationFrom(e.target.value)} className={fieldClass} /></div>
                                  <div><label className={labelClass}>To</label><input type="date" value={durationTo} onChange={(e) => setDurationTo(e.target.value)} className={fieldClass} /></div>
                                </div>
                              )}
                            </div>
                          </section>
                          <section className={cardClass}>
                            <h4 className="flex items-center gap-2 font-semibold mb-4"><FileText className="w-4 h-4 text-indigo-600" /> Transfer Justification</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {TRANSFER_JUSTIFICATIONS.map((r) => (
                                <label key={r.value} className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={transferReasons.includes(r.value)} onChange={() => toggleReason(r.value)} />{r.label}</label>
                              ))}
                            </div>
                            {formErrors.transferReasons && <p className="mt-2 text-xs text-red-600">{formErrors.transferReasons}</p>}
                            <div className="mt-4"><label className={labelClass}>Additional notes</label><textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} className={fieldClass} /></div>
                          </section>
                        </>
                      )}
                      {formStep === 3 && (
                        <section className={cardClass}>
                          <h4 className="font-semibold mb-4">Employment condition changes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border rounded-lg space-y-3">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium">Salary change?</span><Toggle checked={salaryChange} onChange={setSalaryChange} label={salaryChange ? 'Yes' : 'No'} /></div>
                              {salaryChange && <div><label className={labelClass}>New salary (₹ / month)</label><input type="number" min={0} value={newSalary} onChange={(e) => setNewSalary(e.target.value)} className={fieldClass} />{formErrors.newSalary && <p className="text-xs text-red-600">{formErrors.newSalary}</p>}</div>}
                            </div>
                            <div className="p-4 border rounded-lg flex items-center justify-between"><span className="text-sm font-medium">Benefits change?</span><Toggle checked={benefitsChange} onChange={setBenefitsChange} label={benefitsChange ? 'Yes' : 'No'} /></div>
                            <div className="p-4 border rounded-lg space-y-3 md:col-span-2">
                              <div className="flex items-center justify-between"><span className="text-sm font-medium">Role change?</span><Toggle checked={roleChange} onChange={setRoleChange} label={roleChange ? 'Yes' : 'No'} /></div>
                              {roleChange && <textarea rows={3} value={roleChangeDetails} onChange={(e) => setRoleChangeDetails(e.target.value)} className={fieldClass} placeholder="Describe the change..." />}
                            </div>
                            <div className="p-4 border rounded-lg flex items-center justify-between md:col-span-2"><span className="text-sm font-medium">Relocation assistance?</span><Toggle checked={relocationAssistance} onChange={setRelocationAssistance} label={relocationAssistance ? 'Yes' : 'No'} /></div>
                          </div>
                        </section>
                      )}
                      {formStep === 4 && (
                        <>
                          <section className={cardClass}>
                            <h4 className="font-semibold mb-4">Handover</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className={labelClass}>Handover to</label><input value={handoverTo} onChange={(e) => setHandoverTo(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>Handover date</label><input type="date" value={handoverDate} onChange={(e) => setHandoverDate(e.target.value)} className={fieldClass} /></div>
                              <div className="md:col-span-2"><label className={labelClass}>Pending tasks</label><textarea rows={3} value={pendingTasks} onChange={(e) => setPendingTasks(e.target.value)} className={fieldClass} /></div>
                            </div>
                            <ul className="mt-4 space-y-2">
                              {HANDOVER_ITEMS.map((item) => (
                                <li key={item.id}><label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={Boolean(handoverChecks[item.id])} onChange={(e) => setHandoverChecks((p) => ({ ...p, [item.id]: e.target.checked }))} />{item.label}</label></li>
                              ))}
                            </ul>
                          </section>
                          <section className={cardClass}>
                            <h4 className="flex items-center gap-2 font-semibold mb-4"><Paperclip className="w-4 h-4 text-indigo-600" /> Documents</h4>
                            <label className="flex flex-col items-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer">
                              <Upload className="w-6 h-6 text-gray-400" />
                              <span className="text-sm text-gray-600">PDF, DOC, JPG, PNG</span>
                              <input type="file" multiple className="hidden" onChange={(e) => setDocUploads((p) => [...p, ...Array.from(e.target.files || []).map((f) => f.name)])} />
                            </label>
                            {docUploads.map((n) => <p key={n} className="text-sm mt-2 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" />{n}</p>)}
                          </section>
                        </>
                      )}
                      {formStep === 5 && (
                        <section className={cardClass}>
                          <h4 className="flex items-center gap-2 font-semibold mb-4"><ShieldCheck className="w-4 h-4 text-indigo-600" /> Authorization & review</h4>
                          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
                            <div><dt className="text-xs text-gray-500">Employee</dt><dd>{empFullName} ({empId})</dd></div>
                            <div><dt className="text-xs text-gray-500">From → To</dt><dd>{labelOf(branches, currentBranch)} → {labelOf(branches, newBranch) || '—'}</dd></div>
                            <div><dt className="text-xs text-gray-500">Nature / duration</dt><dd>{transferNature || '—'} · {transferDuration || '—'}</dd></div>
                            <div><dt className="text-xs text-gray-500">Effective</dt><dd>{effectiveDate || '—'}</dd></div>
                          </dl>
                          <div className="space-y-3">
                            <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={consentInformed} onChange={(e) => setConsentInformed(e.target.checked)} />Employee has been informed</label>
                            <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={consentManager} onChange={(e) => setConsentManager(e.target.checked)} />Manager has acknowledged</label>
                            <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={consentAccurate} onChange={(e) => setConsentAccurate(e.target.checked)} />Information is accurate</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div><label className={labelClass}>Initiated by *</label><input value={initiatedBy} onChange={(e) => setInitiatedBy(e.target.value)} className={fieldClass} /></div>
                              <div><label className={labelClass}>HR designation *</label><input value={hrDesignation} onChange={(e) => setHrDesignation(e.target.value)} className={fieldClass} /></div>
                            </div>
                          </div>
                        </section>
                      )}
                      {!stepValid[formStep] && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">Complete required fields on this step before continuing.</div>}
                    </div>
                    <aside className="h-fit rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-2 text-sm">
                      <h4 className="font-semibold text-indigo-900">Live summary</h4>
                      <p><span className="text-xs text-indigo-700">Employee</span><br />{empFullName || '—'}</p>
                      <p><span className="text-xs text-indigo-700">From → To</span><br />{labelOf(branches, currentBranch) || '—'} → {labelOf(branches, newBranch) || 'Select'}</p>
                      <p><span className="text-xs text-indigo-700">Nature</span><br />{transferNature || '—'}</p>
                      <p><span className="text-xs text-indigo-700">Effective</span><br />{effectiveDate || 'Not set'}</p>
                      <button type="button" className="w-full mt-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => setFormStep(5)}>Review & Submit</button>
                    </aside>
                  </div>
                  <div className="px-6 pb-4">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Process after submit</h4>
                      <div className="flex items-center overflow-x-auto">
                        {outgoingTransferSteps.map((step, i) => (
                          <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getStepStatus(step.id, 1) === 'current' ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{step.id}</div>
                              <p className="text-[10px] text-gray-600 mt-1 text-center max-w-[72px]">{step.title}</p>
                            </div>
                            {i < outgoingTransferSteps.length - 1 && <div className="w-6 h-0.5 mx-1 bg-gray-200" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 pb-6 flex flex-wrap justify-between gap-3">
                    <button type="button" onClick={handleClearSelection} className="px-4 py-2 border rounded-lg">Cancel</button>
                    <div className="flex gap-3">
                      {formStep > 1 && <button type="button" onClick={() => setFormStep((s) => s - 1)} className="inline-flex items-center gap-1 px-4 py-2 border rounded-lg"><ChevronLeft className="w-4 h-4" /> Back</button>}
                      {formStep < 5 && <button type="button" disabled={!stepValid[formStep]} onClick={() => setFormStep((s) => s + 1)} className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">Next <ChevronRight className="w-4 h-4" /></button>}
                      {formStep === 5 && (
                        <button type="button" onClick={handleInitiateTransfer} disabled={!isFormValid || isProcessing} className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Initiate Transfer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {outgoingTransfers.filter((t) => !['Completed', 'Rejected', 'Cancelled'].includes(t.status)).length > 0 && (
                <div className="bg-white rounded-lg border">
                  <div className="p-4 border-b"><h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="w-5 h-5" /> Active outgoing transfers</h3></div>
                  {outgoingTransfers.filter((t) => !['Completed', 'Rejected', 'Cancelled'].includes(t.status)).map((t) => (
                    <div key={t.id} className="p-4 border-b last:border-b-0">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">{t.employeeAvatar}</div>
                          <div><p className="font-medium">{t.employeeName}</p><p className="text-sm text-gray-500">{t.id} · {t.employeeDesignation}</p></div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <span>{t.fromBranch}</span><ArrowRight className="w-4 h-4 text-gray-400" /><span className="font-medium">{t.toBranch}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusColor(t.status)}`}>{t.status}</span>
                          {['Approved', 'In Progress'].includes(t.status) && t.currentStep < maxStepForType(t.type) && <button type="button" onClick={() => handleAdvance(t)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">Advance</button>}
                          <button type="button" onClick={() => setLetterPreview(t)} className="p-2 text-gray-400" aria-label="View letter"><Eye className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 flex items-center gap-1"><Calendar className="w-4 h-4" /> Effective {formatDate(t.effectiveDate)} · Step {t.currentStep} of {maxStepForType(t.type)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incoming' && (
            <div className="space-y-6">
              {incomingTransfers.filter(isUrgent).length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">{incomingTransfers.filter(isUrgent).length} urgent incoming transfer(s)</p>
                    <p className="text-xs text-amber-800">Pending requests due within 14 days or overdue need acceptance.</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  {['all', 'pending', 'in progress', 'completed'].map((f) => (
                    <button type="button" key={f} onClick={() => setIncomingFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium ${incomingFilter === f ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{f}</button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg border">
                <div className="p-4 border-b"><h3 className="font-semibold flex items-center gap-2"><Inbox className="w-5 h-5" /> Incoming transfer requests</h3></div>
                {filteredIncoming.length === 0 && <div className="p-12 text-center text-gray-500"><Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />No incoming transfers</div>}
                {filteredIncoming.map((t) => (
                  <div key={t.id} className={`p-4 border-b last:border-b-0 ${isUrgent(t) ? 'bg-amber-50/70' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">{t.employeeAvatar}</div>
                        <div>
                          <p className="font-medium flex items-center gap-2">{t.employeeName}{isUrgent(t) && <span className="text-[10px] uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Urgent</span>}</p>
                          <p className="text-sm text-gray-500">{t.employeeId} · {t.employeeDesignation}</p>
                          <p className="text-sm mt-1 flex items-center gap-2">{t.fromBranch} <ArrowRight className="w-4 h-4 text-gray-400" /> <span className="text-indigo-600 font-medium">{t.toBranch}</span></p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusColor(t.status)}`}>{t.status}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(t.effectiveDate)} · Step {t.currentStep} of {incomingTransferSteps.length}</span>
                      <div className="flex gap-2">
                        {t.status === 'Pending' && (
                          <>
                            <button type="button" onClick={() => { setRejectTarget(t); setRejectReason(''); }} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm inline-flex items-center gap-1"><XCircle className="w-4 h-4" /> Reject</button>
                            <button type="button" onClick={() => handleProcessIncoming(t, 'accept')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm inline-flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Accept</button>
                          </>
                        )}
                        {t.status === 'In Progress' && t.currentStep < maxStepForType(t.type) && <button type="button" onClick={() => handleAdvance(t)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">Advance</button>}
                        <button type="button" onClick={() => setLetterPreview(t)} className="px-3 py-1.5 border rounded-lg text-sm">Letter</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg border">
                <button type="button" onClick={() => setExpandedIn((v) => !v)} className="w-full p-4 flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2"><UserCheck className="w-5 h-5 text-green-500" /> Employees transferred in <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{mockTransferredIn.length}</span></h3>
                </button>
                {expandedIn && (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50"><tr>{['Employee', 'Department', 'Designation', 'Date', 'Reporting to', 'Contact'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>)}</tr></thead>
                    <tbody>
                      {mockTransferredIn.map((e) => (
                        <tr key={e.id} className="border-t">
                          <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold">{e.avatar}</div><div><p className="font-medium">{e.name}</p><p className="text-xs text-gray-500">{e.id}</p></div></div></td>
                          <td className="px-4 py-3">{e.department}</td>
                          <td className="px-4 py-3">{e.designation}</td>
                          <td className="px-4 py-3">{formatDate(e.joiningDate)}</td>
                          <td className="px-4 py-3">{e.reportingManager}</td>
                          <td className="px-4 py-3"><button type="button" title={e.email} className="p-1.5 text-gray-400"><Mail className="w-4 h-4" /></button><button type="button" title={e.phone} className="p-1.5 text-gray-400"><Phone className="w-4 h-4" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} placeholder="Search name or ID..." className="pl-10 pr-4 py-2 border rounded-lg text-sm" /></div>
                  <select value={historyType} onChange={(e) => setHistoryType(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All Types</option><option>Incoming</option><option>Outgoing</option></select>
                  <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option>All Status</option><option>Completed</option><option>Rejected</option><option>Cancelled</option></select>
                  <select value={historySort} onChange={(e) => setHistorySort(e.target.value as typeof historySort)} className="px-3 py-2 border rounded-lg text-sm"><option value="date">Sort: Date</option><option value="id">Sort: ID</option><option value="employee">Sort: Employee</option><option value="type">Sort: Type</option><option value="status">Sort: Status</option></select>
                </div>
                <button type="button" className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm" onClick={() => {
                  const header = 'Transfer ID,Employee,Type,From,To,Date,Status,Nature,Duration';
                  const rows = historyRecords.map((t) => [t.id, t.employeeName, t.type, t.fromBranch, t.toBranch, t.effectiveDate, t.status, t.nature || '', t.duration || ''].join(','));
                  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'transfer-history.csv'; a.click(); URL.revokeObjectURL(url);
                }}><Download className="w-4 h-4" /> Export</button>
              </div>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr>{['Transfer ID', 'Employee', 'Type', 'From → To', 'Date', 'Status', 'Actions'].map((h) => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">{h}</th>)}</tr></thead>
                  <tbody>
                    {pagedHistory.map((t) => (
                      <tr key={t.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs">{t.id}</td>
                        <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs">{t.employeeAvatar}</div><div><p className="font-medium">{t.employeeName}</p><p className="text-xs text-gray-500">{t.employeeId}</p></div></div></td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${t.type === 'Incoming' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{t.type === 'Incoming' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}{t.type}</span></td>
                        <td className="px-4 py-3">{t.fromBranch} → {t.toBranch}</td>
                        <td className="px-4 py-3">{formatDate(t.effectiveDate)}</td>
                        <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-full text-xs border ${getStatusColor(t.status)}`}>{t.status}</span></td>
                        <td className="px-4 py-3"><button type="button" onClick={() => setLetterPreview(t)} className="p-1.5 text-gray-400" aria-label="View"><Eye className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {historyRecords.length === 0 && <div className="p-12 text-center text-gray-500"><History className="w-12 h-12 mx-auto mb-3 text-gray-300" />No transfers match your filters</div>}
                {historyRecords.length > 0 && (
                  <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing {(historyPage - 1) * historyPageSize + 1}–{Math.min(historyPage * historyPageSize, historyRecords.length)} of {historyRecords.length}</p>
                    <div className="flex gap-2">
                      <button type="button" disabled={historyPage <= 1} onClick={() => setHistoryPage((p) => p - 1)} className="px-2 py-1 border rounded disabled:opacity-40">Prev</button>
                      <span>Page {historyPage} of {historyPages}</span>
                      <button type="button" disabled={historyPage >= historyPages} onClick={() => setHistoryPage((p) => p + 1)} className="px-2 py-1 border rounded disabled:opacity-40">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {letterPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-lg w-full bg-white rounded-xl p-6 space-y-3">
            <div className="flex justify-between"><h3 className="font-semibold">Transfer letter</h3><button type="button" onClick={() => setLetterPreview(null)}><X className="w-4 h-4" /></button></div>
            <div className="border rounded-lg p-4 text-sm space-y-2">
              <p className="font-bold">SCHOOL NAME</p>
              <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
              <p>To, {letterPreview.employeeName}</p>
              <p className="font-medium">Sub: Transfer Order — {letterPreview.id}</p>
              <p>You are transferred from {letterPreview.fromBranch} to {letterPreview.toBranch} effective {formatDate(letterPreview.effectiveDate)}, reporting to {letterPreview.newManager} as {letterPreview.newDesignation}.</p>
            </div>
            <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm" onClick={() => {
              const blob = new Blob([`Transfer Order ${letterPreview.id}\n${letterPreview.employeeName}\nTo ${letterPreview.toBranch}`], { type: 'text/plain' });
              const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Transfer_${letterPreview.id}.txt`; a.click(); URL.revokeObjectURL(url);
            }}>Download</button>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-w-md w-full bg-white rounded-xl p-6 space-y-3">
            <h3 className="font-semibold">Reject {rejectTarget.employeeName}?</h3>
            <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Reason" className={fieldClass} />
            <div className="flex justify-end gap-2">
              <button type="button" className="px-4 py-2 border rounded-lg" onClick={() => setRejectTarget(null)}>Cancel</button>
              <button type="button" disabled={rejectReason.trim().length < 3} className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50" onClick={() => { void handleProcessIncoming(rejectTarget, 'reject', rejectReason); setRejectTarget(null); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeTransfer;
