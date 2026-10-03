import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  ArrowRightLeft,
  User,
  Building2,
  Briefcase,
  Users,
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
  FileCheck,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Circle,
  MessageSquare,
  Phone,
  Mail,
  Eye,
  MoreHorizontal,
  Download,
  Printer,
  Edit,
  XCircle,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp } from
'lucide-react';

// Types
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

// Mock Data
const mockEmployees: Employee[] = [
{
  id: 'EMP001',
  name: 'Dr. Rajesh Kumar',
  avatar: 'RK',
  designation: 'HOD Mathematics',
  department: 'Mathematics',
  branch: 'Main Campus',
  reportingManager: 'Principal',
  email: 'rajesh.k@school.edu',
  phone: '+91 9876543201',
  joiningDate: '2018-06-15',
  staffType: 'Teaching'
},
{
  id: 'EMP002',
  name: 'Sarah Jenkins',
  avatar: 'SJ',
  designation: 'Senior Teacher',
  department: 'English',
  branch: 'Main Campus',
  reportingManager: 'Dr. Rajesh Kumar',
  email: 'sarah.j@school.edu',
  phone: '+91 9876543202',
  joiningDate: '2019-04-01',
  staffType: 'Teaching'
},
{
  id: 'EMP003',
  name: 'Michael Chen',
  avatar: 'MC',
  designation: 'Admin Officer',
  department: 'Administration',
  branch: 'Main Campus',
  reportingManager: 'HR Manager',
  email: 'michael.c@school.edu',
  phone: '+91 9876543203',
  joiningDate: '2020-01-10',
  staffType: 'Non-Teaching'
},
{
  id: 'EMP004',
  name: 'Priya Sharma',
  avatar: 'PS',
  designation: 'Lab Assistant',
  department: 'Science',
  branch: 'Main Campus',
  reportingManager: 'Science HOD',
  email: 'priya.s@school.edu',
  phone: '+91 9876543204',
  joiningDate: '2023-08-01',
  staffType: 'Support'
},
{
  id: 'EMP005',
  name: 'David Wilson',
  avatar: 'DW',
  designation: 'Sports Coach',
  department: 'Physical Education',
  branch: 'Main Campus',
  reportingManager: 'Vice Principal',
  email: 'david.w@school.edu',
  phone: '+91 9876543205',
  joiningDate: '2021-03-15',
  staffType: 'Teaching'
}];


const mockIncomingTransfers: TransferRequest[] = [
{
  id: 'TRF-IN-001',
  employeeId: 'EMP101',
  employeeName: 'Arun Krishnan',
  employeeAvatar: 'AK',
  employeeDesignation: 'Mathematics Teacher',
  fromBranch: 'South Campus',
  toBranch: 'Main Campus',
  fromDepartment: 'Mathematics',
  toDepartment: 'Mathematics',
  newDesignation: 'Senior Mathematics Teacher',
  newManager: 'Dr. Rajesh Kumar',
  requestDate: '2024-03-01',
  effectiveDate: '2024-04-01',
  status: 'Pending',
  currentStep: 1,
  initiatedBy: 'South Campus Admin',
  remarks: 'Requested transfer due to family relocation',
  type: 'Incoming'
},
{
  id: 'TRF-IN-002',
  employeeId: 'EMP102',
  employeeName: 'Kavitha Nair',
  employeeAvatar: 'KN',
  employeeDesignation: 'Hindi Teacher',
  fromBranch: 'East Campus',
  toBranch: 'Main Campus',
  fromDepartment: 'Hindi',
  toDepartment: 'Hindi',
  newDesignation: 'Hindi Teacher',
  newManager: 'Hindi HOD',
  requestDate: '2024-02-20',
  effectiveDate: '2024-03-15',
  status: 'In Progress',
  currentStep: 3,
  initiatedBy: 'East Campus Admin',
  remarks: 'Promotion and transfer',
  approvalDate: '2024-02-25',
  approvedBy: 'Principal',
  type: 'Incoming'
},
{
  id: 'TRF-IN-003',
  employeeId: 'EMP103',
  employeeName: 'Robert Williams',
  employeeAvatar: 'RW',
  employeeDesignation: 'IT Administrator',
  fromBranch: 'West Campus',
  toBranch: 'Main Campus',
  fromDepartment: 'IT',
  toDepartment: 'IT',
  newDesignation: 'Senior IT Administrator',
  newManager: 'IT Manager',
  requestDate: '2024-02-10',
  effectiveDate: '2024-03-01',
  status: 'Completed',
  currentStep: 5,
  initiatedBy: 'West Campus Admin',
  remarks: 'Centralization of IT operations',
  approvalDate: '2024-02-15',
  approvedBy: 'Director',
  type: 'Incoming'
}];


const mockOutgoingTransfers: TransferRequest[] = [
{
  id: 'TRF-OUT-001',
  employeeId: 'EMP005',
  employeeName: 'David Wilson',
  employeeAvatar: 'DW',
  employeeDesignation: 'Sports Coach',
  fromBranch: 'Main Campus',
  toBranch: 'North Campus',
  fromDepartment: 'Physical Education',
  toDepartment: 'Physical Education',
  newDesignation: 'Head Coach',
  newManager: 'North Campus Principal',
  requestDate: '2024-03-05',
  effectiveDate: '2024-04-15',
  status: 'Approved',
  currentStep: 2,
  initiatedBy: 'HR Manager',
  remarks: 'Promotion to Head Coach position',
  approvalDate: '2024-03-08',
  approvedBy: 'Principal',
  type: 'Outgoing'
}];


const mockTransferredInEmployees: Employee[] = [
{
  id: 'EMP103',
  name: 'Robert Williams',
  avatar: 'RW',
  designation: 'Senior IT Administrator',
  department: 'IT',
  branch: 'Main Campus',
  reportingManager: 'IT Manager',
  email: 'robert.w@school.edu',
  phone: '+91 9876543310',
  joiningDate: '2024-03-01',
  staffType: 'Non-Teaching'
},
{
  id: 'EMP098',
  name: 'Meera Patel',
  avatar: 'MP',
  designation: 'Librarian',
  department: 'Library',
  branch: 'Main Campus',
  reportingManager: 'Academic Coordinator',
  email: 'meera.p@school.edu',
  phone: '+91 9876543311',
  joiningDate: '2024-02-01',
  staffType: 'Non-Teaching'
},
{
  id: 'EMP087',
  name: 'James Anderson',
  avatar: 'JA',
  designation: 'Music Teacher',
  department: 'Arts',
  branch: 'Main Campus',
  reportingManager: 'Arts Coordinator',
  email: 'james.a@school.edu',
  phone: '+91 9876543312',
  joiningDate: '2024-01-15',
  staffType: 'Teaching'
}];


const branches = [
{ value: 'main-campus', label: 'Main Campus' },
{ value: 'north-campus', label: 'North Campus' },
{ value: 'south-campus', label: 'South Campus' },
{ value: 'east-campus', label: 'East Campus' },
{ value: 'west-campus', label: 'West Campus' },
{ value: 'city-center', label: 'City Center Branch' }];


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
{ value: 'accounts', label: 'Accounts' }];


const designations = [
{ value: 'teacher', label: 'Teacher' },
{ value: 'senior-teacher', label: 'Senior Teacher' },
{ value: 'hod', label: 'Head of Department' },
{ value: 'coordinator', label: 'Coordinator' },
{ value: 'admin-officer', label: 'Admin Officer' },
{ value: 'assistant', label: 'Assistant' },
{ value: 'manager', label: 'Manager' }];


const managers = [
{ value: 'principal', label: 'Principal' },
{ value: 'vice-principal', label: 'Vice Principal' },
{ value: 'dr-rajesh', label: 'Dr. Rajesh Kumar' },
{ value: 'hr-manager', label: 'HR Manager' },
{ value: 'academic-coord', label: 'Academic Coordinator' },
{ value: 'it-manager', label: 'IT Manager' }];


const outgoingTransferSteps: TransferStep[] = [
{ id: 1, title: 'Initiate Transfer', description: 'Submit transfer request with details', status: 'pending' },
{ id: 2, title: 'Manager Approval', description: 'Approval from current reporting manager', status: 'pending' },
{ id: 3, title: 'HR Review', description: 'HR reviews and processes documentation', status: 'pending' },
{ id: 4, title: 'Destination Acceptance', description: 'Receiving branch accepts the transfer', status: 'pending' },
{ id: 5, title: 'Handover', description: 'Complete work handover and clearance', status: 'pending' },
{ id: 6, title: 'Transfer Complete', description: 'Employee relocated to new branch', status: 'pending' }];


const incomingTransferSteps: TransferStep[] = [
{ id: 1, title: 'Request Received', description: 'Transfer request received from source branch', status: 'pending' },
{ id: 2, title: 'Review & Verify', description: 'Verify employee records and eligibility', status: 'pending' },
{ id: 3, title: 'Accept Transfer', description: 'Formally accept the incoming transfer', status: 'pending' },
{ id: 4, title: 'Assignment Setup', description: 'Assign department, manager, and workspace', status: 'pending' },
{ id: 5, title: 'Onboarding', description: 'Complete onboarding and orientation', status: 'pending' }];


export function EmployeeTransfer() {
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming' | 'history'>('outgoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTransferStep, setCurrentTransferStep] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Transfer form state
  const [newBranch, setNewBranch] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newManager, setNewManager] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // Incoming transfer state
  const [incomingTransfers, setIncomingTransfers] = useState<TransferRequest[]>(mockIncomingTransfers);
  const [outgoingTransfers, setOutgoingTransfers] = useState<TransferRequest[]>(mockOutgoingTransfers);
  const [selectedIncomingTransfer, setSelectedIncomingTransfer] = useState<TransferRequest | null>(null);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [incomingFilter, setIncomingFilter] = useState('all');
  const [transferredInEmployees] = useState<Employee[]>(mockTransferredInEmployees);

  // Expanded sections
  const [expandedSection, setExpandedSection] = useState<string | null>('transferred-list');

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setTransferReason('');
    setShowSuccess(false);
  };

  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setCurrentTransferStep(0);
    setShowSuccess(false);
  };

  const handleInitiateTransfer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentTransferStep(1);
      setShowSuccess(true);
    }, 1500);
  };

  const handleProcessIncomingTransfer = (transfer: TransferRequest, action: 'accept' | 'reject') => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (action === 'accept') {
        setIncomingTransfers((prev) =>
        prev.map((t) =>
        t.id === transfer.id ?
        { ...t, status: 'In Progress' as const, currentStep: t.currentStep + 1 } :
        t
        )
        );
      } else {
        setIncomingTransfers((prev) =>
        prev.map((t) => t.id === transfer.id ? { ...t, status: 'Rejected' as const } : t)
        );
      }
      setShowIncomingModal(false);
      setSelectedIncomingTransfer(null);
    }, 1500);
  };

  const handleAdvanceIncomingStep = (transfer: TransferRequest) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newStep = transfer.currentStep + 1;
      const newStatus = newStep >= 5 ? 'Completed' : 'In Progress';
      setIncomingTransfers((prev) =>
      prev.map((t) =>
      t.id === transfer.id ? { ...t, currentStep: newStep, status: newStatus as any } : t
      )
      );
    }, 1000);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStepStatus = (stepId: number, currentStep: number): 'completed' | 'current' | 'pending' => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const isFormValid = newBranch && effectiveDate && transferReason;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-500">
        <Home className="w-4 h-4" />
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>HR</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>Employee</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-gray-900 font-medium">Branch Transfer</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Branch Transfer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employee transfers between branches with complete process tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Main Campus</span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccess &&
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Transfer Request Initiated Successfully!</p>
            <p className="text-sm text-green-700">
              The transfer request has been submitted and is pending approval.
            </p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'outgoing' ?
            'border-indigo-600 text-indigo-600' :
            'border-transparent text-gray-500 hover:text-gray-700'}`
            }>

            <ArrowUpFromLine className="w-4 h-4" />
            Outgoing Transfers
            {outgoingTransfers.filter((t) => t.status !== 'Completed').length > 0 &&
            <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded-full">
                {outgoingTransfers.filter((t) => t.status !== 'Completed').length}
              </span>
            }
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'incoming' ?
            'border-indigo-600 text-indigo-600' :
            'border-transparent text-gray-500 hover:text-gray-700'}`
            }>

            <ArrowDownToLine className="w-4 h-4" />
            Incoming Transfers
            {incomingTransfers.filter((t) => t.status === 'Pending').length > 0 &&
            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                {incomingTransfers.filter((t) => t.status === 'Pending').length}
              </span>
            }
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'history' ?
            'border-indigo-600 text-indigo-600' :
            'border-transparent text-gray-500 hover:text-gray-700'}`
            }>

            <History className="w-4 h-4" />
            Transfer History
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* OUTGOING TRANSFERS TAB */}
          {activeTab === 'outgoing' &&
          <div className="space-y-6">
              {/* Employee Search Section */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  Select Employee for Transfer
                </h3>

                {/* Search Bar */}
                <div ref={searchRef} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search by employee name or ID..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-12 pr-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white" />

                    {searchQuery &&
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">

                        <X className="w-5 h-5" />
                      </button>
                  }
                  </div>

                  {/* Auto-complete Suggestions */}
                  {showSuggestions && searchQuery &&
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                      {filteredEmployees.length > 0 ?
                  filteredEmployees.map((employee) =>
                  <button
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">

                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                              {employee.avatar}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-500">
                                {employee.id} • {employee.designation}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{employee.department}</p>
                              <p className="text-xs text-gray-400">{employee.branch}</p>
                            </div>
                          </button>
                  ) :

                  <div className="p-4 text-center text-gray-500">
                          <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>No employees found</p>
                        </div>
                  }
                    </div>
                }
                </div>

                {/* Selected Employee Card */}
                {selectedEmployee &&
              <div className="mt-4 flex items-center justify-between p-4 bg-white border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                        {selectedEmployee.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                        <p className="text-sm text-gray-600">{selectedEmployee.id}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {selectedEmployee.designation}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {selectedEmployee.department}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Current Branch</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {selectedEmployee.branch}
                        </p>
                      </div>
                      <button
                    onClick={handleClearSelection}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">

                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
              }

                {/* Empty State */}
                {!selectedEmployee && !searchQuery &&
              <div className="mt-4 flex flex-col items-center justify-center py-8 text-gray-400">
                    <Search className="w-12 h-12 mb-3" />
                    <p className="text-lg font-medium">Search for an employee</p>
                    <p className="text-sm">Enter employee name or ID to begin the transfer process</p>
                  </div>
              }
              </div>

              {/* Transfer Details Form */}
              {selectedEmployee &&
            <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                      Transfer Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Fill in the transfer details for {selectedEmployee.name}
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Current vs New Assignment */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Assignment */}
                      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-gray-600" />
                          </div>
                          <h4 className="font-semibold text-gray-700">Current Assignment</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Branch</p>
                              <p className="text-sm text-gray-900">{selectedEmployee.branch}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Department</p>
                              <p className="text-sm text-gray-900">{selectedEmployee.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Designation</p>
                              <p className="text-sm text-gray-900">{selectedEmployee.designation}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 p-3 bg-white rounded-md border border-gray-200">
                            <Users className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Reporting Manager</p>
                              <p className="text-sm text-gray-900">{selectedEmployee.reportingManager}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* New Assignment */}
                      <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-200">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                            <ArrowRight className="w-4 h-4 text-indigo-600" />
                          </div>
                          <h4 className="font-semibold text-indigo-700">New Assignment</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              New Branch <span className="text-red-500">*</span>
                            </label>
                            <select
                          value={newBranch}
                          onChange={(e) => setNewBranch(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm">

                              <option value="">Select Branch...</option>
                              {branches.
                          filter((b) => b.label !== selectedEmployee.branch).
                          map((branch) =>
                          <option key={branch.value} value={branch.value}>
                                    {branch.label}
                                  </option>
                          )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              New Department
                            </label>
                            <select
                          value={newDepartment}
                          onChange={(e) => setNewDepartment(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm">

                              <option value="">Same as current</option>
                              {departments.map((dept) =>
                          <option key={dept.value} value={dept.value}>
                                  {dept.label}
                                </option>
                          )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              New Designation
                            </label>
                            <select
                          value={newDesignation}
                          onChange={(e) => setNewDesignation(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm">

                              <option value="">Same as current</option>
                              {designations.map((desig) =>
                          <option key={desig.value} value={desig.value}>
                                  {desig.label}
                                </option>
                          )}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              New Reporting Manager
                            </label>
                            <select
                          value={newManager}
                          onChange={(e) => setNewManager(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-sm">

                              <option value="">Select Manager...</option>
                              {managers.map((mgr) =>
                          <option key={mgr.value} value={mgr.value}>
                                  {mgr.label}
                                </option>
                          )}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Effective Transfer Date <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <input
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Transfer Reason <span className="text-red-500">*</span>
                          </span>
                        </label>
                        <select
                      value={transferReason}
                      onChange={(e) => setTransferReason(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

                          <option value="">Select Reason...</option>
                          <option value="promotion">Promotion</option>
                          <option value="request">Employee Request</option>
                          <option value="operational">Operational Requirement</option>
                          <option value="restructuring">Organization Restructuring</option>
                          <option value="performance">Performance Based</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Additional Remarks
                        </span>
                      </label>
                      <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter any additional notes or instructions..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" />

                    </div>

                    {/* Validation Warning */}
                    {!isFormValid &&
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          Please fill in all required fields (New Branch, Effective Date, and Transfer Reason)
                        </p>
                      </div>
                }
                  </div>

                  {/* Transfer Process Steps Preview */}
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Transfer Process Steps
                      </h4>
                      <div className="flex items-center justify-between">
                        {outgoingTransferSteps.map((step, index) =>
                    <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          getStepStatus(step.id, currentTransferStep + 1) === 'completed' ?
                          'bg-green-500 text-white' :
                          getStepStatus(step.id, currentTransferStep + 1) === 'current' ?
                          'bg-indigo-500 text-white' :
                          'bg-gray-200 text-gray-500'}`
                          }>

                                {getStepStatus(step.id, currentTransferStep + 1) === 'completed' ?
                          <CheckCircle2 className="w-5 h-5" /> :

                          step.id
                          }
                              </div>
                              <p className="text-xs text-gray-600 mt-1 text-center max-w-[80px]">
                                {step.title}
                              </p>
                            </div>
                            {index < outgoingTransferSteps.length - 1 &&
                      <div
                        className={`w-12 h-0.5 mx-1 ${
                        getStepStatus(step.id, currentTransferStep + 1) === 'completed' ?
                        'bg-green-500' :
                        'bg-gray-200'}`
                        } />

                      }
                          </div>
                    )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6 flex justify-end gap-3">
                    <button
                  onClick={handleClearSelection}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">

                      Cancel
                    </button>
                    <button
                  onClick={handleInitiateTransfer}
                  disabled={!isFormValid || isProcessing}
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

                      {isProcessing ?
                  <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </> :

                  <>
                          <Send className="w-4 h-4" />
                          Initiate Transfer
                        </>
                  }
                    </button>
                  </div>
                </div>
            }

              {/* Active Outgoing Transfers */}
              {outgoingTransfers.length > 0 &&
            <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      Active Outgoing Transfers
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {outgoingTransfers.map((transfer) =>
                <div key={transfer.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-lg font-semibold">
                              {transfer.employeeAvatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transfer.employeeName}</p>
                              <p className="text-sm text-gray-500">{transfer.employeeId}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">From</p>
                              <p className="text-sm font-medium text-gray-700">{transfer.fromBranch}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <div className="text-center">
                              <p className="text-xs text-gray-500">To</p>
                              <p className="text-sm font-medium text-gray-700">{transfer.toBranch}</p>
                            </div>
                            <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          transfer.status
                        )}`}>

                              {transfer.status}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          Effective: {formatDate(transfer.effectiveDate)}
                          <span className="mx-2">•</span>
                          Step {transfer.currentStep} of 6
                        </div>
                      </div>
                )}
                  </div>
                </div>
            }
            </div>
          }

          {/* INCOMING TRANSFERS TAB */}
          {activeTab === 'incoming' &&
          <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Filter:</span>
                  <div className="flex gap-2">
                    {['all', 'pending', 'in progress', 'completed'].map((filter) =>
                  <button
                    key={filter}
                    onClick={() => setIncomingFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    incomingFilter === filter ?
                    'bg-indigo-100 text-indigo-700' :
                    'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                    }>

                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                  )}
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              {/* Incoming Transfer Requests */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-gray-500" />
                    Incoming Transfer Requests
                    {filteredIncomingTransfers.filter((t) => t.status === 'Pending').length > 0 &&
                  <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                        {filteredIncomingTransfers.filter((t) => t.status === 'Pending').length} Pending
                      </span>
                  }
                  </h3>
                </div>

                {filteredIncomingTransfers.length > 0 ?
              <div className="divide-y divide-gray-200">
                    {filteredIncomingTransfers.map((transfer) =>
                <div key={transfer.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center text-lg font-semibold">
                              {transfer.employeeAvatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transfer.employeeName}</p>
                              <p className="text-sm text-gray-500">
                                {transfer.employeeId} • {transfer.employeeDesignation}
                              </p>
                              <div className="flex items-center gap-2 mt-2 text-sm">
                                <span className="text-gray-600">{transfer.fromBranch}</span>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-indigo-600">{transfer.toBranch}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          transfer.status
                        )}`}>

                              {transfer.status}
                            </span>
                            <p className="text-xs text-gray-500">
                              Requested: {formatDate(transfer.requestDate)}
                            </p>
                          </div>
                        </div>

                        {/* Transfer Progress */}
                        <div className="mt-4 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Transfer Progress</span>
                            <span className="text-sm text-gray-500">
                              Step {transfer.currentStep} of {incomingTransferSteps.length}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {incomingTransferSteps.map((step, index) =>
                      <React.Fragment key={step.id}>
                                <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          step.id <= transfer.currentStep ?
                          step.id < transfer.currentStep ?
                          'bg-green-500 text-white' :
                          'bg-indigo-500 text-white' :
                          'bg-gray-200 text-gray-500'}`
                          }>

                                  {step.id < transfer.currentStep ?
                          <CheckCircle2 className="w-4 h-4" /> :

                          step.id
                          }
                                </div>
                                {index < incomingTransferSteps.length - 1 &&
                        <div
                          className={`flex-1 h-1 rounded ${
                          step.id < transfer.currentStep ? 'bg-green-500' : 'bg-gray-200'}`
                          } />

                        }
                              </React.Fragment>
                      )}
                          </div>
                          <div className="flex justify-between mt-2">
                            {incomingTransferSteps.map((step) =>
                      <span
                        key={step.id}
                        className="text-xs text-gray-500 text-center"
                        style={{ width: '18%' }}>

                                {step.title}
                              </span>
                      )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Effective: {formatDate(transfer.effectiveDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              By: {transfer.initiatedBy}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {transfer.status === 'Pending' &&
                      <>
                                <button
                          onClick={() => handleProcessIncomingTransfer(transfer, 'reject')}
                          className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm">

                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                                <button
                          onClick={() => handleProcessIncomingTransfer(transfer, 'accept')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">

                                  <CheckCircle className="w-4 h-4" />
                                  Accept
                                </button>
                              </>
                      }
                            {transfer.status === 'In Progress' && transfer.currentStep < 5 &&
                      <button
                        onClick={() => handleAdvanceIncomingStep(transfer)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">

                                <ArrowRight className="w-4 h-4" />
                                Advance to Next Step
                              </button>
                      }
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                )}
                  </div> :

              <div className="p-12 text-center">
                    <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-500">No incoming transfers</p>
                    <p className="text-sm text-gray-400 mt-1">
                      There are no incoming transfer requests at this time
                    </p>
                  </div>
              }
              </div>

              {/* Transferred In Employees List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <button
                onClick={() =>
                setExpandedSection(expandedSection === 'transferred-list' ? null : 'transferred-list')
                }
                className="w-full p-4 flex items-center justify-between border-b border-gray-200 hover:bg-gray-50">

                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-500" />
                    Employees Transferred In
                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                      {transferredInEmployees.length}
                    </span>
                  </h3>
                  {expandedSection === 'transferred-list' ?
                <ChevronUp className="w-5 h-5 text-gray-400" /> :

                <ChevronDown className="w-5 h-5 text-gray-400" />
                }
                </button>

                {expandedSection === 'transferred-list' &&
              <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Employee
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Department
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Designation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Transfer Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Reporting To
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Contact
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transferredInEmployees.map((employee) =>
                    <tr key={employee.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-semibold">
                                  {employee.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{employee.name}</p>
                                  <p className="text-xs text-gray-500">{employee.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{employee.department}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{employee.designation}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{formatDate(employee.joiningDate)}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-gray-700">{employee.reportingManager}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                            onClick={() => console.log('Email:', employee.email)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                            title={employee.email}>

                                  <Mail className="w-4 h-4" />
                                </button>
                                <button
                            onClick={() => console.log('Phone:', employee.phone)}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                            title={employee.phone}>

                                  <Phone className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                    )}
                      </tbody>
                    </table>
                  </div>
              }
              </div>

              {/* Incoming Transfer Process Guide */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  Incoming Transfer Process Guide
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {incomingTransferSteps.map((step, index) =>
                <div
                  key={step.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 relative">

                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {step.id}
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500">{step.description}</p>
                      {index < incomingTransferSteps.length - 1 &&
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                          <ChevronRight className="w-5 h-5 text-gray-300" />
                        </div>
                  }
                    </div>
                )}
                </div>
              </div>
            </div>
          }

          {/* HISTORY TAB */}
          {activeTab === 'history' &&
          <div className="space-y-6">
              {/* History Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search transfer history..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />

                  </div>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All Types</option>
                    <option value="incoming">Incoming</option>
                    <option value="outgoing">Outgoing</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Transfer ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        From → To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...incomingTransfers, ...outgoingTransfers].
                  filter((t) => t.status === 'Completed' || t.status === 'Rejected').
                  map((transfer) =>
                  <tr key={transfer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-sm text-gray-600">{transfer.id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white flex items-center justify-center text-sm font-semibold">
                                {transfer.employeeAvatar}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{transfer.employeeName}</p>
                                <p className="text-xs text-gray-500">{transfer.employeeId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        transfer.type === 'Incoming' ?
                        'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'}`
                        }>

                              {transfer.type === 'Incoming' ?
                        <ArrowDownToLine className="w-3 h-3" /> :

                        <ArrowUpFromLine className="w-3 h-3" />
                        }
                              {transfer.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">{transfer.fromBranch}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-900 font-medium">{transfer.toBranch}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-700">
                              {formatDate(transfer.effectiveDate)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          transfer.status
                        )}`}>

                              {transfer.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                  )}
                  </tbody>
                </table>

                {[...incomingTransfers, ...outgoingTransfers].filter(
                (t) => t.status === 'Completed' || t.status === 'Rejected'
              ).length === 0 &&
              <div className="p-12 text-center">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-500">No transfer history</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Completed transfers will appear here
                    </p>
                  </div>
              }
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}