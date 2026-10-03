import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  SearchIcon,
  FilterIcon,
  CheckIcon,
  ClockIcon,
  XIcon,
  UploadIcon,
  MailIcon,
  SaveIcon,
  AlertCircleIcon,
  UserIcon,
  CalendarIcon,
  BuildingIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  DownloadIcon,
  FileTextIcon,
  EyeIcon,
  PrinterIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  PhoneIcon,
  UserCheckIcon,
  ClipboardListIcon,
  FileSpreadsheetIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  MessageSquareIcon,
  HistoryIcon,
  AwardIcon,
  TrendingUpIcon,
  IndianRupeeIcon } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  designation: string;
  employeeType: string;
  joiningDate: string;
  probationStartDate: string;
  probationEndDate: string;
  probationPeriod: string;
  probationMonths: number;
  currentSalary: number;
  reportingManager: string;
  branch: string;
  gender: string;
  daysLeft: number;
  daysCompleted: number;
  totalProbationDays: number;
  performanceRating: number;
  status: 'On Probation' | 'Ending Soon' | 'Overdue' | 'Extended';
  extensionCount: number;
  lastExtensionDate?: string;
  lastExtensionReason?: string;
}

interface ConfirmationFormData {
  confirmationDate: string;
  newDesignation: string;
  newSalary: string;
  salaryIncrement: string;
  incrementType: 'percentage' | 'amount';
  effectiveDate: string;
  remarks: string;
  confirmationLetter: File | null;
  sendEmail: boolean;
  generateLetter: boolean;
}

interface ExtensionFormData {
  newEndDate: string;
  extensionPeriod: string;
  reason: string;
  improvementAreas: string[];
  pipDocument: File | null;
  reviewDate: string;
  notifyEmployee: boolean;
  notifyManager: boolean;
}

// Mock Data
const mockEmployees: Employee[] = [
{
  id: '1',
  employeeCode: 'EMP001',
  name: 'Priya Sharma',
  email: 'priya.sharma@school.edu',
  phone: '+91 98765 43210',
  avatar: 'PS',
  department: 'Science',
  designation: 'Physics Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-08-01',
  probationStartDate: '2024-08-01',
  probationEndDate: '2025-02-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 45000,
  reportingManager: 'Dr. Rajesh Kumar',
  branch: 'Main Campus',
  gender: 'Female',
  daysLeft: 5,
  daysCompleted: 175,
  totalProbationDays: 180,
  performanceRating: 4.2,
  status: 'Ending Soon',
  extensionCount: 0
},
{
  id: '2',
  employeeCode: 'EMP002',
  name: 'James Wilson',
  email: 'james.wilson@school.edu',
  phone: '+91 98765 43211',
  avatar: 'JW',
  department: 'English',
  designation: 'English Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-07-15',
  probationStartDate: '2024-07-15',
  probationEndDate: '2025-01-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 42000,
  reportingManager: 'Mrs. Sarah Johnson',
  branch: 'Main Campus',
  gender: 'Male',
  daysLeft: -12,
  daysCompleted: 192,
  totalProbationDays: 180,
  performanceRating: 3.5,
  status: 'Overdue',
  extensionCount: 0
},
{
  id: '3',
  employeeCode: 'EMP003',
  name: 'Anita Desai',
  email: 'anita.desai@school.edu',
  phone: '+91 98765 43212',
  avatar: 'AD',
  department: 'Primary',
  designation: 'Primary Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-09-01',
  probationStartDate: '2024-09-01',
  probationEndDate: '2025-03-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 38000,
  reportingManager: 'Mrs. Kavitha Nair',
  branch: 'Junior Wing',
  gender: 'Female',
  daysLeft: 34,
  daysCompleted: 146,
  totalProbationDays: 180,
  performanceRating: 4.5,
  status: 'On Probation',
  extensionCount: 0
},
{
  id: '4',
  employeeCode: 'EMP004',
  name: 'Rahul Verma',
  email: 'rahul.verma@school.edu',
  phone: '+91 98765 43213',
  avatar: 'RV',
  department: 'Mathematics',
  designation: 'Mathematics Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-10-01',
  probationStartDate: '2024-10-01',
  probationEndDate: '2025-01-01',
  probationPeriod: '3 Months',
  probationMonths: 3,
  currentSalary: 40000,
  reportingManager: 'Dr. Suresh Patel',
  branch: 'Main Campus',
  gender: 'Male',
  daysLeft: -26,
  daysCompleted: 116,
  totalProbationDays: 90,
  performanceRating: 3.8,
  status: 'Overdue',
  extensionCount: 1,
  lastExtensionDate: '2025-01-01',
  lastExtensionReason: 'Need more time to assess teaching capabilities'
},
{
  id: '5',
  employeeCode: 'EMP005',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@school.edu',
  phone: '+91 98765 43214',
  avatar: 'SR',
  department: 'Computer Science',
  designation: 'Computer Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-11-01',
  probationStartDate: '2024-11-01',
  probationEndDate: '2025-05-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 48000,
  reportingManager: 'Mr. Anil Sharma',
  branch: 'Main Campus',
  gender: 'Female',
  daysLeft: 95,
  daysCompleted: 85,
  totalProbationDays: 180,
  performanceRating: 4.8,
  status: 'On Probation',
  extensionCount: 0
},
{
  id: '6',
  employeeCode: 'EMP006',
  name: 'Mohammed Iqbal',
  email: 'mohammed.iqbal@school.edu',
  phone: '+91 98765 43215',
  avatar: 'MI',
  department: 'Administration',
  designation: 'Office Assistant',
  employeeType: 'Non-Teaching Staff',
  joiningDate: '2024-06-15',
  probationStartDate: '2024-06-15',
  probationEndDate: '2025-06-15',
  probationPeriod: '12 Months',
  probationMonths: 12,
  currentSalary: 25000,
  reportingManager: 'Mr. Rajendra Singh',
  branch: 'Main Campus',
  gender: 'Male',
  daysLeft: 140,
  daysCompleted: 220,
  totalProbationDays: 360,
  performanceRating: 4.0,
  status: 'On Probation',
  extensionCount: 0
},
{
  id: '7',
  employeeCode: 'EMP007',
  name: 'Kavitha Menon',
  email: 'kavitha.menon@school.edu',
  phone: '+91 98765 43216',
  avatar: 'KM',
  department: 'Hindi',
  designation: 'Hindi Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-12-01',
  probationStartDate: '2024-12-01',
  probationEndDate: '2025-06-01',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 35000,
  reportingManager: 'Dr. Priya Gupta',
  branch: 'Senior Wing',
  gender: 'Female',
  daysLeft: 126,
  daysCompleted: 54,
  totalProbationDays: 180,
  performanceRating: 3.9,
  status: 'On Probation',
  extensionCount: 0
},
{
  id: '8',
  employeeCode: 'EMP008',
  name: 'Vikram Singh',
  email: 'vikram.singh@school.edu',
  phone: '+91 98765 43217',
  avatar: 'VS',
  department: 'Physical Education',
  designation: 'Sports Teacher',
  employeeType: 'Teaching Staff',
  joiningDate: '2024-08-15',
  probationStartDate: '2024-08-15',
  probationEndDate: '2025-02-15',
  probationPeriod: '6 Months',
  probationMonths: 6,
  currentSalary: 32000,
  reportingManager: 'Mr. Deepak Chauhan',
  branch: 'Main Campus',
  gender: 'Male',
  daysLeft: 3,
  daysCompleted: 177,
  totalProbationDays: 180,
  performanceRating: 4.6,
  status: 'Ending Soon',
  extensionCount: 0
}];


const departments = [
'All Departments',
'Science',
'Mathematics',
'English',
'Hindi',
'Computer Science',
'Physical Education',
'Music',
'Art',
'Primary',
'Library',
'Administration',
'Accounts'];


const statusOptions = ['All Status', 'On Probation', 'Ending Soon', 'Overdue', 'Extended'];

const improvementAreaOptions = [
'Teaching Methodology',
'Classroom Management',
'Student Engagement',
'Subject Knowledge',
'Communication Skills',
'Punctuality & Attendance',
'Documentation & Records',
'Parent Interaction',
'Team Collaboration',
'Professional Development'];


// Progress Bar Component
const ProgressBar: React.FC<{completed: number;total: number;status: string;}> = ({
  completed,
  total,
  status
}) => {
  const percentage = Math.min(completed / total * 100, 100);

  const getColor = () => {
    if (status === 'Overdue' || status === 'Extended') return 'bg-red-500';
    if (status === 'Ending Soon') return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }} />

      </div>
    </div>);

};

// Rating Stars Component
const RatingStars: React.FC<{rating: number;}> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
      <StarIcon
        key={star}
        className={`w-4 h-4 ${
        star <= rating ?
        'text-yellow-400 fill-yellow-400' :
        star - 0.5 <= rating ?
        'text-yellow-400 fill-yellow-400 opacity-50' :
        'text-gray-300'}`
        } />

      )}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>);

};

// Main Component
export function EmployeeConfirmation() {
  // State
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Form States
  const [confirmationForm, setConfirmationForm] = useState<ConfirmationFormData>({
    confirmationDate: new Date().toISOString().split('T')[0],
    newDesignation: '',
    newSalary: '',
    salaryIncrement: '',
    incrementType: 'percentage',
    effectiveDate: new Date().toISOString().split('T')[0],
    remarks: '',
    confirmationLetter: null,
    sendEmail: true,
    generateLetter: true
  });

  const [extensionForm, setExtensionForm] = useState<ExtensionFormData>({
    newEndDate: '',
    extensionPeriod: '3',
    reason: '',
    improvementAreas: [],
    pipDocument: null,
    reviewDate: '',
    notifyEmployee: true,
    notifyManager: true
  });

  const [terminationForm, setTerminationForm] = useState({
    terminationDate: new Date().toISOString().split('T')[0],
    reason: '',
    noticePeriod: '0',
    lastWorkingDate: new Date().toISOString().split('T')[0],
    settlementDetails: '',
    notifyEmployee: true
  });

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
    selectedDepartment === 'All Departments' || emp.department === selectedDepartment;

    const matchesStatus = selectedStatus === 'All Status' || emp.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + rowsPerPage);

  // Count employees ending soon or overdue
  const urgentCount = employees.filter(
    (emp) => emp.status === 'Ending Soon' || emp.status === 'Overdue'
  ).length;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status variant
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'On Probation':
        return 'default';
      case 'Ending Soon':
        return 'warning';
      case 'Overdue':
      case 'Extended':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Get days left text
  const getDaysLeftText = (daysLeft: number) => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days overdue`;
    if (daysLeft === 0) return 'Ends today';
    return `${daysLeft} days left`;
  };

  // Get days left color
  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'text-red-600';
    if (daysLeft <= 7) return 'text-orange-600';
    if (daysLeft <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  // Handle confirm click
  const handleConfirmClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setConfirmationForm({
      ...confirmationForm,
      newDesignation: employee.designation,
      newSalary: String(employee.currentSalary)
    });
    setShowConfirmModal(true);
  };

  // Handle extend click
  const handleExtendClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    const newEndDate = new Date(employee.probationEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + 3);
    setExtensionForm({
      ...extensionForm,
      newEndDate: newEndDate.toISOString().split('T')[0],
      reviewDate: newEndDate.toISOString().split('T')[0]
    });
    setShowExtendModal(true);
  };

  // Handle view click
  const handleViewClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // Handle terminate click
  const handleTerminateClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowTerminateModal(true);
  };

  // Submit confirmation
  const handleSubmitConfirmation = () => {
    setShowConfirmModal(false);
    setSuccessMessage(
      `${selectedEmployee?.name} has been successfully confirmed as a permanent employee.`
    );
    setShowSuccessModal(true);
    setSelectedEmployee(null);
  };

  // Submit extension
  const handleSubmitExtension = () => {
    setShowExtendModal(false);
    setSuccessMessage(
      `Probation period for ${selectedEmployee?.name} has been extended successfully.`
    );
    setShowSuccessModal(true);
    setSelectedEmployee(null);
  };

  // Submit termination
  const handleSubmitTermination = () => {
    setShowTerminateModal(false);
    setSuccessMessage(
      `Employment termination for ${selectedEmployee?.name} has been processed.`
    );
    setShowSuccessModal(true);
    setSelectedEmployee(null);
  };

  // Close all modals
  const closeModals = () => {
    setShowConfirmModal(false);
    setShowExtendModal(false);
    setShowViewModal(false);
    setShowTerminateModal(false);
    setShowSuccessModal(false);
    setSelectedEmployee(null);
  };

  // Calculate new salary
  const calculateNewSalary = () => {
    if (!selectedEmployee) return 0;
    const currentSalary = selectedEmployee.currentSalary;
    const increment = parseFloat(confirmationForm.salaryIncrement) || 0;

    if (confirmationForm.incrementType === 'percentage') {
      return currentSalary + currentSalary * increment / 100;
    }
    return currentSalary + increment;
  };

  // Toggle improvement area
  const toggleImprovementArea = (area: string) => {
    setExtensionForm((prev) => ({
      ...prev,
      improvementAreas: prev.improvementAreas.includes(area) ?
      prev.improvementAreas.filter((a) => a !== area) :
      [...prev.improvementAreas, area]
    }));
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UserCheckIcon className="w-7 h-7 text-blue-600" />
            Employee Confirmation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employees moving from probation to permanent status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExportDropdown(!showExportDropdown)}>
              <DownloadIcon className="w-4 h-4 mr-2" />
              Export
              <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
            {showExportDropdown &&
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 w-48 z-20">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileSpreadsheetIcon className="w-4 h-4 text-green-600" />
                  Export to Excel
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <FileTextIcon className="w-4 h-4 text-red-600" />
                  Export to PDF
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <PrinterIcon className="w-4 h-4 text-gray-600" />
                  Print List
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Alert for urgent confirmations */}
      {urgentCount > 0 &&
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircleIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-sm text-amber-800">
              <strong>{urgentCount} employees</strong> have probation ending soon or overdue and
              require immediate action.
            </span>
          </div>
          <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedStatus('Ending Soon')}
          className="border-amber-300 text-amber-700 hover:bg-amber-100">

            View Urgent
          </Button>
        </div>
      }

      {/* Filters Card */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, employee code, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>

          {/* Department Filter */}
          <div className="w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {departments.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {statusOptions.map((status) =>
              <option key={status} value={status}>
                  {status}
                </option>
              )}
            </select>
          </div>

          {/* More Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={showFilterPanel ? 'bg-blue-50 border-blue-200' : ''}>

            <FilterIcon className="w-4 h-4 mr-2" />
            More Filters
          </Button>

          {/* Clear */}
          {(searchQuery || selectedDepartment !== 'All Departments' || selectedStatus !== 'All Status') &&
          <Button
            variant="ghost"
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All Departments');
              setSelectedStatus('All Status');
            }}>

              <XIcon className="w-4 h-4 mr-1" />
              Clear
            </Button>
          }
        </div>

        {/* Extended Filters */}
        {showFilterPanel &&
        <div className="pt-4 mt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Probation End From
                </label>
                <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Probation End To
                </label>
                <input
                type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Performance Rating
                </label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Ratings</option>
                  <option value="4.5+">4.5+ (Excellent)</option>
                  <option value="4+">4+ (Good)</option>
                  <option value="3+">3+ (Average)</option>
                  <option value="below3">Below 3 (Needs Improvement)</option>
                </select>
              </div>
            </div>
          </div>
        }
      </Card>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-medium">{paginatedEmployees.length}</span> of{' '}
          <span className="font-medium">{filteredEmployees.length}</span> probation employees
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Rows:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-200 rounded px-2 py-1 text-sm">

            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="space-y-4">
        {paginatedEmployees.map((employee) =>
        <Card
          key={employee.id}
          className={`p-4 ${
          employee.status === 'Overdue' ?
          'border-l-4 border-l-red-500' :
          employee.status === 'Ending Soon' ?
          'border-l-4 border-l-orange-500' :
          ''}`
          }>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Employee Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-semibold">
                  {employee.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <span className="text-xs text-blue-600 font-medium">{employee.employeeCode}</span>
                    <Badge variant={getStatusVariant(employee.status)}>{employee.status}</Badge>
                    {employee.extensionCount > 0 &&
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        Extended {employee.extensionCount}x
                      </span>
                  }
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="w-4 h-4" />
                      {employee.designation}
                    </span>
                    <span className="flex items-center gap-1">
                      <BuildingIcon className="w-4 h-4" />
                      {employee.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Joined: {formatDate(employee.joiningDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Probation Details */}
              <div className="flex flex-wrap items-center gap-6">
                {/* Probation Period */}
                <div className="text-center min-w-[100px]">
                  <p className="text-xs text-gray-500">Probation Period</p>
                  <p className="text-sm font-medium text-gray-900">{employee.probationPeriod}</p>
                </div>

                {/* End Date */}
                <div className="text-center min-w-[100px]">
                  <p className="text-xs text-gray-500">Probation Ends</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDate(employee.probationEndDate)}
                  </p>
                  <p className={`text-xs font-medium ${getDaysLeftColor(employee.daysLeft)}`}>
                    {getDaysLeftText(employee.daysLeft)}
                  </p>
                </div>

                {/* Progress */}
                <div className="min-w-[120px]">
                  <p className="text-xs text-gray-500 mb-1">Progress</p>
                  <ProgressBar
                  completed={employee.daysCompleted}
                  total={employee.totalProbationDays}
                  status={employee.status} />

                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(employee.daysCompleted / employee.totalProbationDays * 100)}% completed
                  </p>
                </div>

                {/* Performance */}
                <div className="min-w-[140px]">
                  <p className="text-xs text-gray-500 mb-1">Performance</p>
                  <RatingStars rating={employee.performanceRating} />
                </div>

                {/* Current Salary */}
                <div className="text-center min-w-[100px]">
                  <p className="text-xs text-gray-500">Current Salary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(employee.currentSalary)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleViewClick(employee)}>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                variant="primary"
                size="sm"
                onClick={() => handleConfirmClick(employee)}
                className="bg-teal-600 hover:bg-teal-700">

                  <CheckIcon className="w-4 h-4 mr-1" />
                  Confirm
                </Button>
                <Button
                variant="outline"
                size="sm"
                onClick={() => handleExtendClick(employee)}
                className="text-amber-600 border-amber-300 hover:bg-amber-50">

                  <ClockIcon className="w-4 h-4 mr-1" />
                  Extend
                </Button>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTerminateClick(employee)}
                className="text-red-600 hover:bg-red-50">

                  <XCircleIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Empty State */}
        {paginatedEmployees.length === 0 &&
        <div className="text-center py-12 bg-white rounded-xl">
            <UserCheckIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No employees found</h3>
            <p className="text-sm text-gray-500">
              Try adjusting your filters to find employees.
            </p>
          </div>
        }
      </div>

      {/* Pagination */}
      {totalPages > 1 &&
      <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50">

              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) =>
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-lg text-sm font-medium ${
            currentPage === page ?
            'bg-blue-600 text-white' :
            'hover:bg-gray-100 text-gray-700'}`
            }>

                {page}
              </button>
          )}
            <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50">

              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      }

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModals} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Employee Details</h2>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Employee Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.employeeCode}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusVariant(selectedEmployee.status)}>
                      {selectedEmployee.status}
                    </Badge>
                    {selectedEmployee.extensionCount > 0 &&
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        Extended {selectedEmployee.extensionCount}x
                      </span>
                  }
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployee.department}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Designation</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployee.designation}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Employee Type</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployee.employeeType}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Branch</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployee.branch}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Reporting Manager</p>
                  <p className="text-sm font-medium text-gray-900">{selectedEmployee.reportingManager}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Current Salary</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(selectedEmployee.currentSalary)}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MailIcon className="w-4 h-4 text-gray-400" />
                    {selectedEmployee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    {selectedEmployee.phone}
                  </div>
                </div>
              </div>

              {/* Probation Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Probation Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-xs text-blue-600">Joining Date</p>
                    <p className="text-sm font-semibold text-blue-700">
                      {formatDate(selectedEmployee.joiningDate)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg text-center">
                    <p className="text-xs text-orange-600">Probation Period</p>
                    <p className="text-sm font-semibold text-orange-700">
                      {selectedEmployee.probationPeriod}
                    </p>
                  </div>
                  <div
                  className={`p-3 rounded-lg text-center ${
                  selectedEmployee.daysLeft < 0 ?
                  'bg-red-50' :
                  selectedEmployee.daysLeft <= 7 ?
                  'bg-orange-50' :
                  'bg-green-50'}`
                  }>

                    <p
                    className={`text-xs ${
                    selectedEmployee.daysLeft < 0 ?
                    'text-red-600' :
                    selectedEmployee.daysLeft <= 7 ?
                    'text-orange-600' :
                    'text-green-600'}`
                    }>

                      Days Left
                    </p>
                    <p
                    className={`text-sm font-semibold ${
                    selectedEmployee.daysLeft < 0 ?
                    'text-red-700' :
                    selectedEmployee.daysLeft <= 7 ?
                    'text-orange-700' :
                    'text-green-700'}`
                    }>

                      {getDaysLeftText(selectedEmployee.daysLeft)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Probation Progress</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {selectedEmployee.daysCompleted} of {selectedEmployee.totalProbationDays} days
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(
                      selectedEmployee.daysCompleted / selectedEmployee.totalProbationDays * 100
                    )}
                      %
                    </span>
                  </div>
                  <ProgressBar
                  completed={selectedEmployee.daysCompleted}
                  total={selectedEmployee.totalProbationDays}
                  status={selectedEmployee.status} />

                </div>
              </div>

              {/* Performance */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Rating</h4>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <RatingStars rating={selectedEmployee.performanceRating} />
                  <span
                  className={`text-sm font-medium px-3 py-1 rounded ${
                  selectedEmployee.performanceRating >= 4 ?
                  'bg-green-100 text-green-700' :
                  selectedEmployee.performanceRating >= 3 ?
                  'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}`
                  }>

                    {selectedEmployee.performanceRating >= 4 ?
                  'Excellent' :
                  selectedEmployee.performanceRating >= 3 ?
                  'Good' :
                  'Needs Improvement'}
                  </span>
                </div>
              </div>

              {/* Extension History */}
              {selectedEmployee.extensionCount > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Extension History</h4>
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <HistoryIcon className="w-5 h-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900">
                          Previous Extension on {formatDate(selectedEmployee.lastExtensionDate || '')}
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Reason: {selectedEmployee.lastExtensionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
            }
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeModals}>
                Close
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                closeModals();
                handleConfirmClick(selectedEmployee);
              }}
              className="bg-teal-600 hover:bg-teal-700">

                <CheckIcon className="w-4 h-4 mr-2" />
                Confirm as Permanent
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModals} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <CheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Confirm as Permanent</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Employee Summary */}
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.designation} • {selectedEmployee.department}
                  </p>
                </div>
              </div>

              {/* Confirmation Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmation Date <span className="text-red-500">*</span>
                </label>
                <input
                type="date"
                value={confirmationForm.confirmationDate}
                onChange={(e) =>
                setConfirmationForm({ ...confirmationForm, confirmationDate: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* New Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Designation
                </label>
                <input
                type="text"
                value={confirmationForm.newDesignation}
                onChange={(e) =>
                setConfirmationForm({ ...confirmationForm, newDesignation: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Salary Section */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                <h4 className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <IndianRupeeIcon className="w-4 h-4" />
                  Salary Revision
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Salary</label>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(selectedEmployee.currentSalary)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Increment Type</label>
                    <select
                    value={confirmationForm.incrementType}
                    onChange={(e) =>
                    setConfirmationForm({
                      ...confirmationForm,
                      incrementType: e.target.value as 'percentage' | 'amount'
                    })
                    }
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm">

                      <option value="percentage">Percentage (%)</option>
                      <option value="amount">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {confirmationForm.incrementType === 'percentage' ?
                    'Increment (%)' :
                    'Increment Amount (₹)'}
                    </label>
                    <input
                    type="number"
                    value={confirmationForm.salaryIncrement}
                    onChange={(e) =>
                    setConfirmationForm({ ...confirmationForm, salaryIncrement: e.target.value })
                    }
                    placeholder={confirmationForm.incrementType === 'percentage' ? '10' : '5000'}
                    className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />

                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Salary</label>
                    <p className="text-sm font-semibold text-green-700">
                      {formatCurrency(calculateNewSalary())}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Effective From</label>
                  <input
                  type="date"
                  value={confirmationForm.effectiveDate}
                  onChange={(e) =>
                  setConfirmationForm({ ...confirmationForm, effectiveDate: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded px-2 py-1 text-sm" />

                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                value={confirmationForm.remarks}
                onChange={(e) =>
                setConfirmationForm({ ...confirmationForm, remarks: e.target.value })
                }
                rows={3}
                placeholder="Any additional remarks or notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Upload Confirmation Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Confirmation Letter
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Click to upload signed letter</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={confirmationForm.sendEmail}
                  onChange={(e) =>
                  setConfirmationForm({ ...confirmationForm, sendEmail: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Send confirmation email to employee</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={confirmationForm.generateLetter}
                  onChange={(e) =>
                  setConfirmationForm({ ...confirmationForm, generateLetter: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Auto-generate confirmation letter</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeModals}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleSubmitConfirmation}
              className="bg-teal-600 hover:bg-teal-700">

                <CheckIcon className="w-4 h-4 mr-2" />
                Confirm & Make Permanent
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Extension Modal */}
      {showExtendModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModals} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ClockIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Extend Probation</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Current Status */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Current Probation End Date:</strong>{' '}
                  {formatDate(selectedEmployee.probationEndDate)}
                </p>
                {selectedEmployee.extensionCount > 0 &&
              <p className="text-xs text-amber-700 mt-1">
                    This employee has been extended {selectedEmployee.extensionCount} time(s) before.
                  </p>
              }
              </div>

              {/* Extension Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extension Period <span className="text-red-500">*</span>
                </label>
                <select
                value={extensionForm.extensionPeriod}
                onChange={(e) => {
                  const months = parseInt(e.target.value);
                  const newEndDate = new Date(selectedEmployee.probationEndDate);
                  newEndDate.setMonth(newEndDate.getMonth() + months);
                  setExtensionForm({
                    ...extensionForm,
                    extensionPeriod: e.target.value,
                    newEndDate: newEndDate.toISOString().split('T')[0]
                  });
                }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="1">1 Month</option>
                  <option value="2">2 Months</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                </select>
              </div>

              {/* New End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Probation End Date
                </label>
                <input
                type="date"
                value={extensionForm.newEndDate}
                onChange={(e) =>
                setExtensionForm({ ...extensionForm, newEndDate: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Extension <span className="text-red-500">*</span>
                </label>
                <textarea
                value={extensionForm.reason}
                onChange={(e) => setExtensionForm({ ...extensionForm, reason: e.target.value })}
                rows={3}
                placeholder="Provide detailed reason for extending probation..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />

              </div>

              {/* Improvement Areas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement
                </label>
                <div className="flex flex-wrap gap-2">
                  {improvementAreaOptions.map((area) =>
                <button
                  key={area}
                  onClick={() => toggleImprovementArea(area)}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  extensionForm.improvementAreas.includes(area) ?
                  'bg-blue-100 border-blue-300 text-blue-700' :
                  'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`
                  }>

                      {area}
                    </button>
                )}
                </div>
              </div>

              {/* Review Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Review Date
                </label>
                <input
                type="date"
                value={extensionForm.reviewDate}
                onChange={(e) =>
                setExtensionForm({ ...extensionForm, reviewDate: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* PIP Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Performance Improvement Plan (PIP)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center">
                      <UploadIcon className="w-6 h-6 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-500">Upload PIP document</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                  </label>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={extensionForm.notifyEmployee}
                  onChange={(e) =>
                  setExtensionForm({ ...extensionForm, notifyEmployee: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Notify employee via email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={extensionForm.notifyManager}
                  onChange={(e) =>
                  setExtensionForm({ ...extensionForm, notifyManager: e.target.checked })
                  }
                  className="rounded border-gray-300 text-blue-600" />

                  <span className="text-sm text-gray-700">Notify reporting manager</span>
                </label>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeModals}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleSubmitExtension}
              className="bg-amber-600 hover:bg-amber-700">

                <SaveIcon className="w-4 h-4 mr-2" />
                Save Extension
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Termination Modal */}
      {showTerminateModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModals} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                  <XCircleIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Terminate Employment</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
              </div>
              <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Warning */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Warning: This action is irreversible</p>
                    <p className="text-sm text-red-700 mt-1">
                      You are about to terminate {selectedEmployee.name}'s employment during their
                      probation period.
                    </p>
                  </div>
                </div>
              </div>

              {/* Termination Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Termination Date <span className="text-red-500">*</span>
                </label>
                <input
                type="date"
                value={terminationForm.terminationDate}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, terminationDate: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Notice Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Period
                </label>
                <select
                value={terminationForm.noticePeriod}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, noticePeriod: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="0">Immediate (No Notice)</option>
                  <option value="7">7 Days</option>
                  <option value="15">15 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              {/* Last Working Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Working Date
                </label>
                <input
                type="date"
                value={terminationForm.lastWorkingDate}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, lastWorkingDate: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Termination <span className="text-red-500">*</span>
                </label>
                <textarea
                value={terminationForm.reason}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, reason: e.target.value })
                }
                rows={3}
                placeholder="Provide detailed reason for termination..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required />

              </div>

              {/* Settlement Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settlement Details
                </label>
                <textarea
                value={terminationForm.settlementDetails}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, settlementDetails: e.target.value })
                }
                rows={2}
                placeholder="Any pending settlements, dues, or notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Notification */}
              <label className="flex items-center gap-2">
                <input
                type="checkbox"
                checked={terminationForm.notifyEmployee}
                onChange={(e) =>
                setTerminationForm({ ...terminationForm, notifyEmployee: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600" />

                <span className="text-sm text-gray-700">Send termination notice to employee</span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeModals}>
                Cancel
              </Button>
              <button
              onClick={handleSubmitTermination}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">

                <XCircleIcon className="w-4 h-4" />
                Terminate Employment
              </button>
            </div>
          </div>
        </div>
      }

      {/* Success Modal */}
      {showSuccessModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModals} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
              <p className="text-sm text-gray-600 mb-6">{successMessage}</p>
              <Button variant="primary" onClick={closeModals} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Click outside to close dropdowns */}
      {showExportDropdown &&
      <div className="fixed inset-0 z-10" onClick={() => setShowExportDropdown(false)} />
      }
    </div>);

}