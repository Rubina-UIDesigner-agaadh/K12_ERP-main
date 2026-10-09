import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Printer,
  Mail,
  FileText,
  Download,
  Eye,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Settings,
  Upload,
  Copy,
  Share2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Save,
  XCircle,
  Info,
  AlertTriangle,
  Layers,
  Hash,
  BarChart3,
  User,
  Calendar,
  MapPin,
  Phone,
  GraduationCap,
  Building,
  BookOpen,
  Award,
  FileCheck,
  Send,
  Check,
  History,
  Plus,
  Filter,
  Star,
  StarOff,
  ExternalLink,
  Stamp,
  ClipboardList,
  FileSignature,
  Shield,
  Lock,
  Unlock,
  RotateCcw,
  Zap,
  Globe,
  Tag } from
'lucide-react';

// Types
interface Student {
  id: string;
  grNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  class: string;
  section: string;
  rollNo: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  category: string;
  admissionDate: string;
  academicYear: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  house: string;
  status: 'Active' | 'Passed Out' | 'Left' | 'TC Issued';
  aadharNo: string;
  bloodGroup: string;
}

interface IssuedCertificate {
  id: string;
  certNo: string;
  type: 'Bonafide' | 'Leaving' | 'Character' | 'Transfer' | 'Study' | 'Migration';
  studentId: string;
  studentName: string;
  grNo: string;
  class: string;
  purpose?: string;
  issueDate: string;
  status: 'Original' | 'Duplicate' | 'Cancelled' | 'Expired';
  issuedBy: string;
  signatory: string;
  printCount: number;
  lastPrintedAt?: string;
  lastEmailedAt?: string;
  template: string;
  remarks?: string;
  validUntil?: string;
}

interface PrintLog {
  id: string;
  certificateId: string;
  certNo: string;
  action: 'Print' | 'Reprint' | 'Email' | 'Download';
  performedBy: string;
  performedAt: string;
  reason?: string;
  ipAddress: string;
  templateUsed: string;
  markAsDuplicate: boolean;
}

// Card Component
function Card({
  title,
  children,
  className = '',
  headerAction,
  noPadding = false






}: {title?: string;children: React.ReactNode;className?: string;headerAction?: React.ReactNode;noPadding?: boolean;}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>

      {title &&
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {headerAction}
        </div>
      }
      <div className={noPadding ? '' : title ? 'p-5' : 'p-5'}>{children}</div>
    </div>);

}

// Badge Component
function Badge({
  children,
  variant = 'default'



}: {children: React.ReactNode;variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange' | 'pink' | 'teal' | 'cyan';}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    pink: 'bg-pink-100 text-pink-700',
    teal: 'bg-teal-100 text-teal-700',
    cyan: 'bg-cyan-100 text-cyan-700'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>

      {children}
    </span>);

}

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  footer







}: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';footer?: React.ReactNode;}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
          {footer &&
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              {footer}
            </div>
          }
        </div>
      </div>
    </div>);

}

// Toast Component
function Toast({
  message,
  type,
  onClose




}: {message: string;type: 'success' | 'error' | 'info' | 'warning';onClose: () => void;}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle
  };
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600'
  };
  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${colors[type]} text-white`}>

      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>);

}

// Sample Data
const sampleStudents: Student[] = [
{
  id: '1',
  grNo: 'GR-2022-001',
  name: 'Rahul Sharma',
  fatherName: 'Rajesh Sharma',
  motherName: 'Sunita Sharma',
  class: 'X',
  section: 'A',
  rollNo: '24',
  dob: '2008-05-15',
  gender: 'Male',
  category: 'General',
  admissionDate: '2018-06-01',
  academicYear: '2023-2024',
  address: '123, Gandhi Nagar, Near City Mall',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  phone: '+91 98765 43210',
  email: 'rajesh.sharma@email.com',
  house: 'Red House',
  status: 'Active',
  aadharNo: '1234-5678-9012',
  bloodGroup: 'B+'
},
{
  id: '2',
  grNo: 'GR-2021-045',
  name: 'Priya Patel',
  fatherName: 'Mukesh Patel',
  motherName: 'Kavita Patel',
  class: 'IX',
  section: 'B',
  rollNo: '12',
  dob: '2009-03-22',
  gender: 'Female',
  category: 'OBC',
  admissionDate: '2019-04-15',
  academicYear: '2023-2024',
  address: '456, Shanti Nagar, Sector 12',
  city: 'Ahmedabad',
  state: 'Gujarat',
  pincode: '380015',
  phone: '+91 87654 32109',
  email: 'mukesh.patel@email.com',
  house: 'Blue House',
  status: 'Active',
  aadharNo: '9876-5432-1098',
  bloodGroup: 'A+'
},
{
  id: '3',
  grNo: 'GR-2019-105',
  name: 'Amit Kumar',
  fatherName: 'Suresh Kumar',
  motherName: 'Meena Kumar',
  class: 'XII',
  section: 'Com',
  rollNo: '05',
  dob: '2006-02-20',
  gender: 'Male',
  category: 'SC',
  admissionDate: '2017-06-01',
  academicYear: '2023-2024',
  address: '45, MG Road, Phase 2',
  city: 'Pune',
  state: 'Maharashtra',
  pincode: '411001',
  phone: '+91 76543 21098',
  email: 'suresh.kumar@email.com',
  house: 'Green House',
  status: 'Active',
  aadharNo: '5678-1234-9876',
  bloodGroup: 'O+'
}];


const MOCK_ISSUED_CERTS: IssuedCertificate[] = [
{
  id: '1',
  certNo: 'BON-2024-001',
  type: 'Bonafide',
  studentId: '1',
  studentName: 'Rahul Sharma',
  grNo: 'GR-2022-001',
  class: 'X-A',
  purpose: 'Bank Account Opening',
  issueDate: '2024-03-15',
  status: 'Original',
  issuedBy: 'Admin',
  signatory: 'Principal',
  printCount: 1,
  lastPrintedAt: '2024-03-15 10:30 AM',
  template: 'Standard English',
  validUntil: '2024-09-15'
},
{
  id: '2',
  certNo: 'CHR-2024-025',
  type: 'Character',
  studentId: '1',
  studentName: 'Rahul Sharma',
  grNo: 'GR-2022-001',
  class: 'X-A',
  purpose: 'College Admission',
  issueDate: '2024-02-20',
  status: 'Original',
  issuedBy: 'Admin',
  signatory: 'Principal',
  printCount: 2,
  lastPrintedAt: '2024-02-22 02:15 PM',
  template: 'Standard English'
},
{
  id: '3',
  certNo: 'BON-2023-456',
  type: 'Bonafide',
  studentId: '1',
  studentName: 'Rahul Sharma',
  grNo: 'GR-2022-001',
  class: 'IX-A',
  purpose: 'Scholarship Application',
  issueDate: '2023-08-10',
  status: 'Duplicate',
  issuedBy: 'Office Staff',
  signatory: 'Vice-Principal',
  printCount: 3,
  lastPrintedAt: '2023-10-05 11:00 AM',
  lastEmailedAt: '2023-10-06 09:30 AM',
  template: 'Standard English',
  remarks: 'Original lost, duplicate issued'
},
{
  id: '4',
  certNo: 'STD-2023-089',
  type: 'Study',
  studentId: '1',
  studentName: 'Rahul Sharma',
  grNo: 'GR-2022-001',
  class: 'IX-A',
  purpose: 'Visa Application',
  issueDate: '2023-06-15',
  status: 'Original',
  issuedBy: 'Admin',
  signatory: 'Principal',
  printCount: 1,
  lastPrintedAt: '2023-06-15 03:45 PM',
  template: 'Detailed Format'
}];


const MOCK_PRINT_LOGS: PrintLog[] = [
{
  id: '1',
  certificateId: '1',
  certNo: 'BON-2024-001',
  action: 'Print',
  performedBy: 'Admin',
  performedAt: '2024-03-15 10:30 AM',
  ipAddress: '192.168.1.100',
  templateUsed: 'Standard English',
  markAsDuplicate: false
},
{
  id: '2',
  certificateId: '2',
  certNo: 'CHR-2024-025',
  action: 'Print',
  performedBy: 'Admin',
  performedAt: '2024-02-20 11:00 AM',
  ipAddress: '192.168.1.100',
  templateUsed: 'Standard English',
  markAsDuplicate: false
},
{
  id: '3',
  certificateId: '2',
  certNo: 'CHR-2024-025',
  action: 'Reprint',
  performedBy: 'Office Staff',
  performedAt: '2024-02-22 02:15 PM',
  reason: 'Student requested additional copy',
  ipAddress: '192.168.1.105',
  templateUsed: 'Standard English',
  markAsDuplicate: true
},
{
  id: '4',
  certificateId: '3',
  certNo: 'BON-2023-456',
  action: 'Email',
  performedBy: 'Admin',
  performedAt: '2023-10-06 09:30 AM',
  reason: 'Sent to parent email',
  ipAddress: '192.168.1.100',
  templateUsed: 'Standard English',
  markAsDuplicate: false
}];


const templateOptions = [
{ value: 'original', label: 'Original Template (Default)' },
{ value: 'duplicate', label: 'Duplicate Copy Template' },
{ value: 'simple', label: 'Simple Format' },
{ value: 'detailed', label: 'Detailed Format' },
{ value: 'letterhead', label: 'With School Letterhead' }];


const certificateTypeOptions = [
{ value: 'all', label: 'All Types' },
{ value: 'Bonafide', label: 'Bonafide' },
{ value: 'Character', label: 'Character' },
{ value: 'Leaving', label: 'Leaving/Transfer' },
{ value: 'Study', label: 'Study' },
{ value: 'Migration', label: 'Migration' }];


// Main Component
export function PrintTemplateStudent() {
  const navigate = useNavigate();

  // State
  const [activeTab, setActiveTab] = useState<'print' | 'history' | 'settings'>('print');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  // Modal States
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isBulkPrintModalOpen, setIsBulkPrintModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<IssuedCertificate | null>(null);

  // Reprint Form State
  const [reprintFormData, setReprintFormData] = useState({
    template: 'original',
    markAsDuplicate: true,
    reason: '',
    copies: 1,
    includeWatermark: true
  });

  // Email Form State
  const [emailFormData, setEmailFormData] = useState({
    to: '',
    cc: '',
    subject: '',
    message: '',
    attachPdf: true,
    template: 'original'
  });

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handlers
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showToast('Please enter a search term', 'error');
      return;
    }

    setIsSearching(true);

    setTimeout(() => {
      const results = sampleStudents.filter(
        (student) =>
        student.grNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm)
      );

      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);

      if (results.length === 0) {
        showToast('No students found matching your search', 'info');
      }
    }, 500);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowSearchResults(false);
    setSearchTerm('');
    setEmailFormData({
      ...emailFormData,
      to: student.email
    });
    showToast(`Selected: ${student.name}`, 'success');
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSelectedCertificates([]);
  };

  const handleReprintClick = (cert: IssuedCertificate) => {
    setSelectedCert(cert);
    setReprintFormData({
      template: 'original',
      markAsDuplicate: cert.status === 'Original',
      reason: '',
      copies: 1,
      includeWatermark: true
    });
    setIsReprintModalOpen(true);
  };

  const handleEmailClick = (cert: IssuedCertificate) => {
    setSelectedCert(cert);
    setEmailFormData({
      to: selectedStudent?.email || '',
      cc: '',
      subject: `${cert.type} Certificate - ${cert.certNo}`,
      message: `Dear Parent/Guardian,\n\nPlease find attached the ${cert.type} Certificate (${cert.certNo}) for ${selectedStudent?.name}.\n\nRegards,\nSchool Administration`,
      attachPdf: true,
      template: 'original'
    });
    setIsEmailModalOpen(true);
  };

  const handlePreviewClick = (cert: IssuedCertificate) => {
    setSelectedCert(cert);
    setIsPreviewModalOpen(true);
  };

  const handleReprint = () => {
    if (!reprintFormData.reason && reprintFormData.markAsDuplicate) {
      showToast('Please provide a reason for reprint', 'error');
      return;
    }

    showToast(`Certificate ${selectedCert?.certNo} sent to printer!`, 'success');
    setIsReprintModalOpen(false);
  };

  const handleSendEmail = () => {
    if (!emailFormData.to) {
      showToast('Please enter recipient email', 'error');
      return;
    }

    showToast(`Certificate emailed to ${emailFormData.to}!`, 'success');
    setIsEmailModalOpen(false);
  };

  const handleDownload = (cert: IssuedCertificate) => {
    showToast(`Downloading ${cert.certNo}...`, 'info');
  };

  const handleSelectCertificate = (id: string) => {
    if (selectedCertificates.includes(id)) {
      setSelectedCertificates(selectedCertificates.filter((c) => c !== id));
    } else {
      setSelectedCertificates([...selectedCertificates, id]);
    }
  };

  const handleSelectAllCertificates = () => {
    if (selectedCertificates.length === studentCertificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(studentCertificates.map((c) => c.id));
    }
  };

  const handleBulkPrint = () => {
    if (selectedCertificates.length === 0) {
      showToast('Please select certificates to print', 'error');
      return;
    }
    setIsBulkPrintModalOpen(true);
  };

  const handleBulkPrintConfirm = () => {
    showToast(`${selectedCertificates.length} certificates sent to printer!`, 'success');
    setSelectedCertificates([]);
    setIsBulkPrintModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Get student's certificates
  const studentCertificates = selectedStudent ?
  MOCK_ISSUED_CERTS.filter((cert) => cert.studentId === selectedStudent.id) :
  [];

  // Filter certificates
  const filteredCertificates = studentCertificates.filter((cert) => {
    if (filters.type !== 'all' && cert.type !== filters.type) return false;
    if (filters.status !== 'all' && cert.status !== filters.status) return false;
    if (filters.dateFrom && cert.issueDate < filters.dateFrom) return false;
    if (filters.dateTo && cert.issueDate > filters.dateTo) return false;
    return true;
  });

  // Get print logs for selected student
  const studentPrintLogs = selectedStudent ?
  MOCK_PRINT_LOGS.filter((log) =>
  studentCertificates.some((cert) => cert.id === log.certificateId)
  ) :
  MOCK_PRINT_LOGS;

  const getCertTypeColor = (type: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange' | 'pink' | 'teal' | 'cyan' => {
    const colorMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'orange' | 'pink' | 'teal' | 'cyan'> = {
      Bonafide: 'info',
      Character: 'success',
      Leaving: 'purple',
      Transfer: 'purple',
      Study: 'teal',
      Migration: 'orange'
    };
    return colorMap[type] || 'default';
  };

  const getCertTypeIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Bonafide: <FileCheck className="w-4 h-4" />,
      Character: <Star className="w-4 h-4" />,
      Leaving: <FileSignature className="w-4 h-4" />,
      Transfer: <FileSignature className="w-4 h-4" />,
      Study: <BookOpen className="w-4 h-4" />,
      Migration: <Globe className="w-4 h-4" />
    };
    return iconMap[type] || <FileText className="w-4 h-4" />;
  };

  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    const colorMap: Record<string, 'default' | 'success' | 'warning' | 'error'> = {
      Original: 'success',
      Duplicate: 'warning',
      Cancelled: 'error',
      Expired: 'default'
    };
    return colorMap[status] || 'default';
  };

  const getActionColor = (action: string): 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' => {
    const colorMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple'> = {
      Print: 'success',
      Reprint: 'warning',
      Email: 'info',
      Download: 'purple'
    };
    return colorMap[action] || 'default';
  };

  const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500';
  const selectClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white';

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
           
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Certificate Printing</h1>
              <p className="text-gray-500 text-sm">
                Search student to view, print, or email existing certificates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {[
          { id: 'print', label: 'Print / Reprint', icon: Printer },
          { id: 'history', label: 'Print History', icon: History },
          { id: 'settings', label: 'Settings', icon: Settings }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id ?
            'border-indigo-600 text-indigo-600' :
            'border-transparent text-gray-600 hover:text-gray-900'}`
            }>

              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Print Tab */}
        {activeTab === 'print' &&
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Search & Student Details */}
            <div className="space-y-6">
              {/* Search Card */}
              <Card title="Student Search">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                        type="text"
                        placeholder="Enter GR No, Name, or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className={`${inputClass} pl-10`} />

                      </div>
                      <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">

                        {isSearching ?
                      <RefreshCw className="w-4 h-4 animate-spin" /> :

                      <Search className="w-4 h-4" />
                      }
                        Search
                      </button>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 &&
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {searchResults.map((student) =>
                    <button
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left">

                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-xs text-gray-500">
                                {student.grNo} | Class {student.class}-{student.section}
                              </p>
                            </div>
                            <Badge variant={student.status === 'Active' ? 'success' : 'default'}>
                              {student.status}
                            </Badge>
                          </button>
                    )}
                      </div>
                  }

                    {showSearchResults && searchResults.length === 0 &&
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                        No students found
                      </div>
                  }
                  </div>

                  <p className="text-xs text-gray-500">
                    Search by GR Number, Student Name, or Phone Number
                  </p>
                </div>
              </Card>

              {/* Student Details Card */}
              {selectedStudent ?
            <Card
              title="Student Details"
              headerAction={
              <button
                onClick={handleClearStudent}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">

                      <X className="w-4 h-4" />
                    </button>
              }>

                  <div className="space-y-4">
                    {/* Student Header */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        {selectedStudent.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {selectedStudent.name}
                        </h3>
                        <p className="text-sm text-gray-500">{selectedStudent.grNo}</p>
                        <Badge variant={selectedStudent.status === 'Active' ? 'success' : 'warning'}>
                          {selectedStudent.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Student Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <GraduationCap className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">Class</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {selectedStudent.class}-{selectedStudent.section}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Hash className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">Roll No</span>
                        </div>
                        <p className="font-semibold text-gray-900">{selectedStudent.rollNo}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <User className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">Father's Name</span>
                        </div>
                        <p className="font-semibold text-gray-900">{selectedStudent.fatherName}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">DOB</span>
                        </div>
                        <p className="font-semibold text-gray-900">
                          {new Date(selectedStudent.dob).toLocaleDateString('en-IN')}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">Phone</span>
                        </div>
                        <p className="font-semibold text-gray-900">{selectedStudent.phone}</p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Mail className="w-4 h-4" />
                          <span className="text-xs uppercase font-medium">Email</span>
                        </div>
                        <p className="font-semibold text-gray-900 text-xs truncate">
                          {selectedStudent.email}
                        </p>
                      </div>
                    </div>

                    {/* Certificate Stats */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase font-medium mb-3">
                        Certificate Summary
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold text-gray-900">
                            {studentCertificates.length}
                          </p>
                          <p className="text-xs text-gray-500">Total Issued</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">
                            {studentCertificates.filter((c) => c.status === 'Original').length}
                          </p>
                          <p className="text-xs text-gray-500">Original</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                          <p className="text-2xl font-bold text-yellow-600">
                            {studentCertificates.filter((c) => c.status === 'Duplicate').length}
                          </p>
                          <p className="text-xs text-gray-500">Duplicate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card> :

            <Card>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Search className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-1">No Student Selected</p>
                    <p className="text-sm text-center">
                      Search and select a student to view their issued certificates
                    </p>
                  </div>
                </Card>
            }

              
            </div>

            {/* Right Column - Certificates List */}
            <div className="lg:col-span-2">
              {selectedStudent ?
            <div className="space-y-6">
                  {/* Filters & Bulk Actions */}
                  <Card>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="w-40">
                        <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className={selectClass}>

                          {certificateTypeOptions.map((opt) =>
                      <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                      )}
                        </select>
                      </div>

                      <div className="w-36">
                        <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className={selectClass}>

                          <option value="all">All Status</option>
                          <option value="Original">Original</option>
                          <option value="Duplicate">Duplicate</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className={`${inputClass} w-36`} />

                        <span className="text-gray-400">to</span>
                        <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className={`${inputClass} w-36`} />

                      </div>

                      <button
                    onClick={resetFilters}
                    className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">

                        Reset
                      </button>

                      <div className="flex-1" />

                      {selectedCertificates.length > 0 &&
                  <button
                    onClick={handleBulkPrint}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">

                          <Printer className="w-4 h-4" />
                          Print Selected ({selectedCertificates.length})
                        </button>
                  }
                    </div>
                  </Card>

                  {/* Certificates List */}
                  <Card
                title={`Issued Certificates (${filteredCertificates.length})`}
                headerAction={
                <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                      type="checkbox"
                      checked={
                      selectedCertificates.length === filteredCertificates.length &&
                      filteredCertificates.length > 0
                      }
                      onChange={handleSelectAllCertificates}
                      className="rounded text-indigo-600 focus:ring-indigo-500" />

                          <span className="text-sm text-gray-600">Select All</span>
                        </label>
                      </div>
                }>

                    {filteredCertificates.length > 0 ?
                <div className="space-y-4">
                        {filteredCertificates.map((cert) =>
                  <div
                    key={cert.id}
                    className={`border rounded-lg p-4 transition-colors ${
                    selectedCertificates.includes(cert.id) ?
                    'border-indigo-500 bg-indigo-50' :
                    'border-gray-200 hover:border-gray-300'}`
                    }>

                            <div className="flex items-start gap-4">
                              <input
                        type="checkbox"
                        checked={selectedCertificates.includes(cert.id)}
                        onChange={() => handleSelectCertificate(cert.id)}
                        className="mt-1 rounded text-indigo-600 focus:ring-indigo-500" />


                              <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg">
                                {getCertTypeIcon(cert.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-mono text-sm font-bold text-indigo-600">
                                        {cert.certNo}
                                      </span>
                                      <Badge variant={getCertTypeColor(cert.type)}>
                                        {cert.type}
                                      </Badge>
                                      <Badge variant={getStatusColor(cert.status)}>
                                        {cert.status}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {cert.purpose && `Purpose: ${cert.purpose} • `}
                                      Class: {cert.class}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Issued: {new Date(cert.issueDate).toLocaleDateString('en-IN')}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5" />
                                    By: {cert.issuedBy}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Printer className="w-3.5 h-3.5" />
                                    Printed: {cert.printCount}x
                                  </div>
                                  {cert.lastPrintedAt &&
                          <div className="flex items-center gap-1">
                                      <Clock className="w-3.5 h-3.5" />
                                      Last: {cert.lastPrintedAt}
                                    </div>
                          }
                                </div>

                                {cert.remarks &&
                        <p className="mt-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                    Note: {cert.remarks}
                                  </p>
                        }
                              </div>

                              <div className="flex flex-col gap-1">
                                <button
                          onClick={() => handlePreviewClick(cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200">

                                  <Eye className="w-3.5 h-3.5" />
                                  Preview
                                </button>
                                <button
                          onClick={() => handleReprintClick(cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">

                                  <Printer className="w-3.5 h-3.5" />
                                  Print
                                </button>
                                <button
                          onClick={() => handleDownload(cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-100 rounded hover:bg-purple-200">

                                  <Download className="w-3.5 h-3.5" />
                                  PDF
                                </button>
                                <button
                          onClick={() => handleEmailClick(cert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-700 bg-teal-100 rounded hover:bg-teal-200">

                                  <Mail className="w-3.5 h-3.5" />
                                  Email
                                </button>
                              </div>
                            </div>
                          </div>
                  )}
                      </div> :

                <div className="text-center py-12">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No certificates found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your filters or issue a new certificate
                        </p>
                      </div>
                }
                  </Card>
                </div> :

            <Card>
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Printer className="w-20 h-20 mb-4 opacity-20" />
                    <p className="text-xl font-medium mb-2">No Student Selected</p>
                    <p className="text-sm text-center max-w-md">
                      Please search and select a student from the left panel to view and manage
                      their issued certificates.
                    </p>
                  </div>
                </Card>
            }
            </div>
          </div>
        }

        {/* History Tab */}
        {activeTab === 'history' &&
        <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                    type="text"
                    placeholder="Search by certificate number or student..."
                    className={`${inputClass} pl-10`} />

                  </div>
                </div>

                <div className="w-36">
                  <select className={selectClass}>
                    <option value="all">All Actions</option>
                    <option value="Print">Print</option>
                    <option value="Reprint">Reprint</option>
                    <option value="Email">Email</option>
                    <option value="Download">Download</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input type="date" className={`${inputClass} w-36`} />
                  <span className="text-gray-400">to</span>
                  <input type="date" className={`${inputClass} w-36`} />
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </Card>

            <Card title={`Print History (${studentPrintLogs.length} records)`}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Certificate No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Template
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Performed By
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Reason
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {studentPrintLogs.map((log) =>
                  <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-medium text-indigo-600">
                            {log.certNo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                          {log.markAsDuplicate &&
                      <Badge variant="warning">
                              Duplicate
                            </Badge>
                      }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {log.templateUsed}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {log.performedBy}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {log.performedAt}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {log.reason || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-500">
                            {log.ipAddress}
                          </span>
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              {studentPrintLogs.length === 0 &&
            <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No print history found</p>
                </div>
            }
            </Card>
          </div>
        }

        {/* Settings Tab */}
        {activeTab === 'settings' &&
        <div className="space-y-6">
            <Card title="Print Settings">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Default Template</h4>
                    <p className="text-sm text-gray-500">
                      Select the default template for printing
                    </p>
                  </div>
                  <select className={`${selectClass} w-64`}>
                    {templateOptions.map((opt) =>
                  <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                  )}
                  </select>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-mark Duplicate</h4>
                    <p className="text-sm text-gray-500">
                      Automatically mark reprints as duplicate copies
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Include Watermark</h4>
                    <p className="text-sm text-gray-500">
                      Add watermark to duplicate copies
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Require Reprint Reason</h4>
                    <p className="text-sm text-gray-500">
                      Mandate reason for reprinting certificates
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>
              </div>
            </Card>

            <Card title="Email Settings">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">CC School Email</h4>
                    <p className="text-sm text-gray-500">
                      Send a copy of all emails to school admin
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                    <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Email Subject Template
                  </label>
                  <input
                  type="text"
                  defaultValue="{CertificateType} Certificate - {CertificateNo}"
                  className={inputClass} />

                  <p className="text-xs text-gray-500 mt-1">
                    Use {'{CertificateType}'}, {'{CertificateNo}'}, {'{StudentName}'} as placeholders
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Email Message Template
                  </label>
                  <textarea
                  rows={4}
                  defaultValue={`Dear Parent/Guardian,\n\nPlease find attached the {CertificateType} Certificate ({CertificateNo}) for {StudentName}.\n\nRegards,\nSchool Administration`}
                  className={`${inputClass} resize-none`} />

                </div>
              </div>
            </Card>

            <Card title="Audit & Logging">
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Enable Audit Trail</h4>
                    <p className="text-sm text-gray-500">
                      Log all print, reprint, and email actions
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900">Log IP Address</h4>
                    <p className="text-sm text-gray-500">
                      Record IP address for each action
                    </p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                    <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Retention Period</h4>
                    <p className="text-sm text-gray-500">
                      How long to keep audit logs
                    </p>
                  </div>
                  <select className={`${selectClass} w-48`}>
                    <option value="30">30 Days</option>
                    <option value="90">90 Days</option>
                    <option value="180">6 Months</option>
                    <option value="365" selected>1 Year</option>
                    <option value="730">2 Years</option>
                    <option value="-1">Forever</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        }
      </div>

      {/* Reprint Modal */}
      <Modal
        isOpen={isReprintModalOpen}
        onClose={() => setIsReprintModalOpen(false)}
        title="Reprint Certificate"
        size="lg"
        footer={
        <>
            <button
            onClick={() => setIsReprintModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            <button
            onClick={handleReprint}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">

              <Printer className="w-4 h-4" />
              Print Now
            </button>
          </>
        }>

        {selectedCert &&
        <div className="space-y-6">
            {/* Warning */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Audit Notice</p>
                  <p>
                    Re-printing will create an entry in the audit trail. This action will be logged with your username, timestamp, and IP address.
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Certificate No
                </label>
                <p className="font-mono font-bold text-gray-900">{selectedCert.certNo}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Type
                </label>
                <Badge variant={getCertTypeColor(selectedCert.type)}>
                  {selectedCert.type}
                </Badge>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Original Issue Date
                </label>
                <p className="font-medium text-gray-900">{selectedCert.issueDate}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Current Status
                </label>
                <Badge variant={getStatusColor(selectedCert.status)}>
                  {selectedCert.status}
                </Badge>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Print Count
                </label>
                <p className="font-medium text-gray-900">{selectedCert.printCount} times</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  Last Printed
                </label>
                <p className="font-medium text-gray-900">{selectedCert.lastPrintedAt || 'N/A'}</p>
              </div>
            </div>

            {/* Print Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Print Template
                </label>
                <select
                value={reprintFormData.template}
                onChange={(e) => setReprintFormData({ ...reprintFormData, template: e.target.value })}
                className={selectClass}>

                  {templateOptions.map((opt) =>
                <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Copies
                </label>
                <input
                type="number"
                min="1"
                max="5"
                value={reprintFormData.copies}
                onChange={(e) => setReprintFormData({ ...reprintFormData, copies: parseInt(e.target.value) || 1 })}
                className={inputClass} />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Reprint *
              </label>
              <input
              type="text"
              value={reprintFormData.reason}
              onChange={(e) => setReprintFormData({ ...reprintFormData, reason: e.target.value })}
              placeholder="e.g., Original lost by student, Additional copy requested"
              className={inputClass} />

            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="checkbox"
                checked={reprintFormData.markAsDuplicate}
                onChange={(e) => setReprintFormData({ ...reprintFormData, markAsDuplicate: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500" />

                <span className="text-sm text-gray-700">
                  Mark as "DUPLICATE COPY" on certificate
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                type="checkbox"
                checked={reprintFormData.includeWatermark}
                onChange={(e) => setReprintFormData({ ...reprintFormData, includeWatermark: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500" />

                <span className="text-sm text-gray-700">
                  Include watermark for duplicate copies
                </span>
              </label>
            </div>
          </div>
        }
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Email Certificate"
        size="lg"
        footer={
        <>
            <button
            onClick={() => setIsEmailModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            <button
            onClick={handleSendEmail}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">

              <Send className="w-4 h-4" />
              Send Email
            </button>
          </>
        }>

        {selectedCert &&
        <div className="space-y-6">
            {/* Certificate Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-3 bg-indigo-100 rounded-lg">
                {getCertTypeIcon(selectedCert.type)}
              </div>
              <div>
                <p className="font-mono font-bold text-gray-900">{selectedCert.certNo}</p>
                <p className="text-sm text-gray-500">
                  {selectedCert.type} Certificate • {selectedCert.issueDate}
                </p>
              </div>
            </div>

            {/* Email Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To *
              </label>
              <input
              type="email"
              value={emailFormData.to}
              onChange={(e) => setEmailFormData({ ...emailFormData, to: e.target.value })}
              placeholder="recipient@email.com"
              className={inputClass} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CC (Optional)
              </label>
              <input
              type="email"
              value={emailFormData.cc}
              onChange={(e) => setEmailFormData({ ...emailFormData, cc: e.target.value })}
              placeholder="cc@email.com"
              className={inputClass} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
              type="text"
              value={emailFormData.subject}
              onChange={(e) => setEmailFormData({ ...emailFormData, subject: e.target.value })}
              className={inputClass} />

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
              value={emailFormData.message}
              onChange={(e) => setEmailFormData({ ...emailFormData, message: e.target.value })}
              rows={5}
              className={`${inputClass} resize-none`} />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Template
                </label>
                <select
                value={emailFormData.template}
                onChange={(e) => setEmailFormData({ ...emailFormData, template: e.target.value })}
                className={selectClass}>

                  {templateOptions.map((opt) =>
                <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                )}
                </select>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={emailFormData.attachPdf}
                  onChange={(e) => setEmailFormData({ ...emailFormData, attachPdf: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500" />

                  <span className="text-sm text-gray-700">
                    Attach PDF to email
                  </span>
                </label>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Certificate Preview"
        size="xl"
        footer={
        <>
            <button
            onClick={() => setIsPreviewModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Close
            </button>
            <button
            onClick={() => {
              setIsPreviewModalOpen(false);
              if (selectedCert) handleReprintClick(selectedCert);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">

              <Printer className="w-4 h-4" />
              Print
            </button>
          </>
        }>

        {selectedCert && selectedStudent &&
        <div className="bg-white border-2 border-gray-300 p-8 min-h-[500px]">
            {/* Certificate Header */}
            <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">
                    ABC International School
                  </h1>
                  <p className="text-sm text-gray-600">
                    (Affiliated to CBSE, New Delhi - Affiliation No: 123456)
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-2 border-gray-800 inline-block px-8 py-2">
                  {selectedCert.type} Certificate
                </h2>
              </div>

              {selectedCert.status === 'Duplicate' &&
            <p className="mt-2 text-red-600 font-bold">*** DUPLICATE COPY ***</p>
            }
            </div>

            {/* Certificate Details */}
            <div className="flex justify-between text-sm mb-6">
              <div>
                <span className="text-gray-600">Certificate No: </span>
                <span className="font-mono font-bold">{selectedCert.certNo}</span>
              </div>
              <div>
                <span className="text-gray-600">Date: </span>
                <span className="font-bold">
                  {new Date(selectedCert.issueDate).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
                </span>
              </div>
            </div>

            {/* Certificate Body */}
            <div className="text-gray-800 leading-relaxed text-justify space-y-4 mb-8">
              <p className="text-lg font-semibold">TO WHOM IT MAY CONCERN</p>

              <p className="text-base leading-8">
                This is to certify that{' '}
                <span className="font-bold border-b-2 border-gray-400 px-1">
                  {selectedStudent.gender === 'Male' ? 'Mr.' : 'Ms.'} {selectedStudent.name}
                </span>
                , {selectedStudent.gender === 'Male' ? 'Son' : 'Daughter'} of{' '}
                <span className="font-bold border-b-2 border-gray-400 px-1">
                  Mr. {selectedStudent.fatherName}
                </span>
                , is a bonafide student of this school studying in Class{' '}
                <span className="font-bold border-b-2 border-gray-400 px-1">
                  {selectedCert.class}
                </span>
                .
              </p>

              {selectedCert.purpose &&
            <p className="text-base leading-8 italic">
                  This certificate is issued for the purpose of{' '}
                  <span className="font-bold">{selectedCert.purpose}</span>.
                </p>
            }
            </div>

            {/* Signature */}
            <div className="mt-16 flex justify-between">
              <div className="text-center">
                <div className="h-12 border-b border-gray-400 w-40 mb-2"></div>
                <p className="text-sm font-medium">Class Teacher</p>
              </div>
              <div className="text-center">
                <div className="h-12 border-b border-gray-400 w-40 mb-2 flex items-end justify-center">
                  <Stamp className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-sm font-medium">{selectedCert.signatory}</p>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* Bulk Print Modal */}
      <Modal
        isOpen={isBulkPrintModalOpen}
        onClose={() => setIsBulkPrintModalOpen(false)}
        title="Bulk Print Certificates"
        size="md"
        footer={
        <>
            <button
            onClick={() => setIsBulkPrintModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            <button
            onClick={handleBulkPrintConfirm}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">

              <Printer className="w-4 h-4" />
              Print {selectedCertificates.length} Certificates
            </button>
          </>
        }>

        <div className="space-y-6">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-700">
              You are about to print <span className="font-bold">{selectedCertificates.length}</span> certificates.
              This action will be logged in the audit trail.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Print Template for All
            </label>
            <select className={selectClass}>
              {templateOptions.map((opt) =>
              <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected Certificates:</p>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {selectedCertificates.map((id) => {
                const cert = studentCertificates.find((c) => c.id === id);
                return cert ?
                <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{cert.certNo}</span>
                    <Badge variant={getCertTypeColor(cert.type)}>{cert.type}</Badge>
                  </div> :
                null;
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>);

}