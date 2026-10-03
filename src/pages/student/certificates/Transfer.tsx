import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Printer,
  Save,
  FileText,
  ArrowRightLeft,
  Building,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Settings,
  RefreshCw,
  Edit3,
  ChevronRight,
  Info,
  User,
  Users,
  Hash,
  BookOpen,
  Award,
  AlertTriangle,
  Check,
  XCircle,
  Loader2,
  History,
  LayoutTemplate,
  Signature,
  GraduationCap,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  FileCheck,
  Plus,
  Minus,
  Shield,
  Lock,
  Unlock,
  Library,
  Bus,
  Utensils,
  Home,
  Briefcase,
  Beaker,
  Dumbbell,
  Music,
  Computer,
  CreditCard,
  Wallet,
  Receipt,
  BadgeCheck,
  ClipboardCheck,
  ClipboardList,
  UserX,
  UserCheck,
  Building2,
  School,
  MapPinned,
  Globe,
  Flag,
  Navigation,
  Truck,
  Package,
  FileWarning,
  FilePlus,
  FileOutput,
  ArrowRight,
  ArrowLeftRight,
  ExternalLink,
  Send,
  Sparkles,
  Star,
  MessageSquare,
  Paperclip,
  Upload,
  Image,
  Camera } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
interface DuesClearance {
  id: string;
  department: string;
  icon: any;
  cleared: boolean;
  pendingAmount?: number;
  pendingItems?: number;
  remarks?: string;
  clearedBy?: string;
  clearedDate?: string;
}
interface DocumentStatus {
  id: string;
  name: string;
  required: boolean;
  submitted: boolean;
  verified: boolean;
  remarks?: string;
}
interface StudentData {
  id: string;
  name: string;
  grNo: string;
  rollNo: string;
  class: string;
  section: string;
  stream: string;
  admissionNo: string;
  admissionDate: string;
  fatherName: string;
  motherName: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  photo: string;
  category: string;
  nationality: string;
  religion: string;
  caste: string;
  aadharNo: string;
  bloodGroup: string;
  status: string;
  currentBranch: string;
  previousSchool: string;
  conduct: string;
  progress: string;
  attendance: number;
  lastExamResult: string;
  feesStatus: 'clear' | 'pending';
  pendingFees: number;
  duesClearance: DuesClearance[];
  documents: DocumentStatus[];
  transferHistory: TransferRecord[];
}
interface TransferRecord {
  id: string;
  tcNo: string;
  type: 'external' | 'internal';
  fromSchool: string;
  toSchool: string;
  transferDate: string;
  reason: string;
  status: 'completed' | 'pending' | 'cancelled';
  issuedBy: string;
}
interface BranchData {
  id: string;
  name: string;
  code: string;
  address: string;
  principal: string;
  phone: string;
  email: string;
  studentsCount: number;
}
interface TransferSettings {
  transferType: 'external' | 'internal';
  destinationSchool: string;
  destinationBoard: string;
  destinationBranch: string;
  transferDate: string;
  lastAttendanceDate: string;
  effectiveDate: string;
  reason: string;
  customReason: string;
  lastClassAttended: string;
  promotedToClass: string;
  resultStatus: string;
  conduct: string;
  progress: string;
  feesClearance: boolean;
  allDuesCleared: boolean;
  tcNumber: string;
  issueDate: string;
  signatory: string;
  template: string;
  remarks: string;
  includePhoto: boolean;
  includeQR: boolean;
  copies: number;
  applicationDate: string;
  parentConsent: boolean;
  nocRequired: boolean;
  nocObtained: boolean;
}
const MOCK_DUES_CLEARANCE: DuesClearance[] = [
{
  id: '1',
  department: 'Library',
  icon: Library,
  cleared: true,
  clearedBy: 'Mr. Sharma',
  clearedDate: '2024-02-15'
},
{
  id: '2',
  department: 'Laboratory',
  icon: Beaker,
  cleared: true,
  clearedBy: 'Mrs. Gupta',
  clearedDate: '2024-02-14'
},
{
  id: '3',
  department: 'Fees Office',
  icon: DollarSign,
  cleared: false,
  pendingAmount: 5000,
  remarks: 'Pending lab fees'
},
{
  id: '4',
  department: 'Transport',
  icon: Bus,
  cleared: true,
  clearedBy: 'Mr. Kumar',
  clearedDate: '2024-02-10'
},
{
  id: '5',
  department: 'Hostel',
  icon: Home,
  cleared: true,
  clearedBy: 'Warden',
  clearedDate: '2024-02-12'
},
{
  id: '6',
  department: 'Sports',
  icon: Dumbbell,
  cleared: true,
  clearedBy: 'PT Teacher',
  clearedDate: '2024-02-13'
},
{
  id: '7',
  department: 'Computer Lab',
  icon: Computer,
  cleared: false,
  pendingItems: 1,
  remarks: 'Mouse not returned'
},
{
  id: '8',
  department: 'Music Room',
  icon: Music,
  cleared: true,
  clearedBy: 'Music Teacher',
  clearedDate: '2024-02-11'
},
{
  id: '9',
  department: 'Canteen',
  icon: Utensils,
  cleared: true,
  clearedBy: 'Canteen Manager',
  clearedDate: '2024-02-09'
},
{
  id: '10',
  department: 'Store',
  icon: Package,
  cleared: true,
  clearedBy: 'Store Keeper',
  clearedDate: '2024-02-08'
}];

const MOCK_DOCUMENTS: DocumentStatus[] = [
{
  id: '1',
  name: 'Birth Certificate',
  required: true,
  submitted: true,
  verified: true
},
{
  id: '2',
  name: 'Previous TC (if any)',
  required: false,
  submitted: true,
  verified: true
},
{
  id: '3',
  name: 'Caste Certificate',
  required: true,
  submitted: true,
  verified: true
},
{
  id: '4',
  name: 'Aadhar Card',
  required: true,
  submitted: true,
  verified: true
},
{
  id: '5',
  name: 'Migration Certificate',
  required: false,
  submitted: false,
  verified: false,
  remarks: 'Not applicable'
},
{
  id: '6',
  name: 'Character Certificate',
  required: true,
  submitted: true,
  verified: true
},
{
  id: '7',
  name: 'Mark Sheets',
  required: true,
  submitted: true,
  verified: true
},
{
  id: '8',
  name: 'Photos',
  required: true,
  submitted: true,
  verified: true
}];

const MOCK_STUDENT: StudentData = {
  id: '1',
  name: 'Kabir Das',
  grNo: 'GR-2018-022',
  rollNo: '15',
  class: 'VIII',
  section: 'A',
  stream: 'General',
  admissionNo: 'ADM-2018-022',
  admissionDate: '2018-06-01',
  fatherName: 'Ramesh Das',
  motherName: 'Sunita Das',
  dob: '2010-05-15',
  phone: '+91 98765 43210',
  email: 'kabir.das@email.com',
  address: '123, Green Valley, Mumbai - 400001',
  photo: '/api/placeholder/100/100',
  category: 'OBC',
  nationality: 'Indian',
  religion: 'Hindu',
  caste: 'Das',
  aadharNo: '1234-5678-9012',
  bloodGroup: 'B+',
  status: 'Active',
  currentBranch: 'Main Campus',
  previousSchool: 'Little Flower Primary School',
  conduct: 'Good',
  progress: 'Good',
  attendance: 92,
  lastExamResult: 'Passed',
  feesStatus: 'pending',
  pendingFees: 5000,
  duesClearance: MOCK_DUES_CLEARANCE,
  documents: MOCK_DOCUMENTS,
  transferHistory: [
  {
    id: 'T1',
    tcNo: 'TC-2016-001',
    type: 'external',
    fromSchool: 'Little Flower Primary School',
    toSchool: 'City Public School',
    transferDate: '2018-05-15',
    reason: 'Completed Primary Education',
    status: 'completed',
    issuedBy: 'Principal'
  }]

};
const MOCK_BRANCHES: BranchData[] = [
{
  id: '1',
  name: 'North Campus',
  code: 'NC',
  address: 'North Street, Mumbai - 400001',
  principal: 'Dr. Sharma',
  phone: '+91 22 1234 5678',
  email: 'north@school.edu',
  studentsCount: 1200
},
{
  id: '2',
  name: 'South Campus',
  code: 'SC',
  address: 'South Avenue, Mumbai - 400002',
  principal: 'Dr. Verma',
  phone: '+91 22 2345 6789',
  email: 'south@school.edu',
  studentsCount: 980
},
{
  id: '3',
  name: 'East Campus',
  code: 'EC',
  address: 'East Road, Mumbai - 400003',
  principal: 'Dr. Kumar',
  phone: '+91 22 3456 7890',
  email: 'east@school.edu',
  studentsCount: 850
},
{
  id: '4',
  name: 'West Campus',
  code: 'WC',
  address: 'West Lane, Mumbai - 400004',
  principal: 'Dr. Singh',
  phone: '+91 22 4567 8901',
  email: 'west@school.edu',
  studentsCount: 1100
}];

const RECENT_TRANSFERS: TransferRecord[] = [
{
  id: 'T1',
  tcNo: 'TC-2024-045',
  type: 'external',
  fromSchool: 'City Public School - Main',
  toSchool: 'ABC International School',
  transferDate: '2024-02-15',
  reason: 'Family Relocation',
  status: 'completed',
  issuedBy: 'Principal'
},
{
  id: 'T2',
  tcNo: 'TC-2024-044',
  type: 'internal',
  fromSchool: 'Main Campus',
  toSchool: 'North Campus',
  transferDate: '2024-02-10',
  reason: 'Branch Change',
  status: 'completed',
  issuedBy: 'Principal'
},
{
  id: 'T3',
  tcNo: 'TC-2024-043',
  type: 'external',
  fromSchool: 'City Public School - Main',
  toSchool: 'State Board School',
  transferDate: '2024-02-05',
  reason: 'Board Change',
  status: 'completed',
  issuedBy: 'Vice-Principal'
}];

const TEMPLATES = [
{
  id: 'standard',
  name: 'Standard TC Format',
  description: 'Official transfer certificate format as per education board',
  preview: '/api/placeholder/200/280'
},
{
  id: 'detailed',
  name: 'Detailed Format',
  description: 'Includes complete academic history and conduct details',
  preview: '/api/placeholder/200/280'
},
{
  id: 'internal',
  name: 'Internal Transfer Format',
  description: 'Simplified format for inter-branch transfers',
  preview: '/api/placeholder/200/280'
}];

const SIGNATORIES = [
{
  id: 'principal',
  name: 'Dr. Ramesh Sharma',
  designation: 'Principal',
  signature: true
},
{
  id: 'vice-principal',
  name: 'Mrs. Sunita Verma',
  designation: 'Vice-Principal',
  signature: true
},
{
  id: 'registrar',
  name: 'Mr. Anil Kumar',
  designation: 'Registrar',
  signature: true
},
{
  id: 'admin',
  name: 'Mr. Suresh Patil',
  designation: 'Administrative Officer',
  signature: false
}];

const TRANSFER_REASONS = [
{
  value: 'relocation',
  label: 'Family Relocation'
},
{
  value: 'job-transfer',
  label: "Parent's Job Transfer"
},
{
  value: 'branch-change',
  label: 'Branch Change'
},
{
  value: 'board-change',
  label: 'Board/Stream Change'
},
{
  value: 'higher-education',
  label: 'Higher Education'
},
{
  value: 'medical',
  label: 'Medical Reasons'
},
{
  value: 'personal',
  label: 'Personal Reasons'
},
{
  value: 'completed',
  label: 'Completed Education'
},
{
  value: 'other',
  label: 'Other'
}];

const BOARDS = [
{
  value: 'cbse',
  label: 'CBSE'
},
{
  value: 'icse',
  label: 'ICSE'
},
{
  value: 'state',
  label: 'State Board'
},
{
  value: 'ib',
  label: 'IB'
},
{
  value: 'cambridge',
  label: 'Cambridge'
},
{
  value: 'other',
  label: 'Other'
}];

export function Transfer() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState<StudentData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showDuesModal, setShowDuesModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);
  const [confirmationText, setConfirmationText] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    transferType: true,
    duesClearance: true,
    documents: true,
    recentTransfers: true
  });
  const [settings, setSettings] = useState<TransferSettings>({
    transferType: 'external',
    destinationSchool: '',
    destinationBoard: '',
    destinationBranch: '',
    transferDate: new Date().toISOString().split('T')[0],
    lastAttendanceDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: '',
    customReason: '',
    lastClassAttended: '',
    promotedToClass: '',
    resultStatus: 'passed',
    conduct: 'good',
    progress: 'good',
    feesClearance: false,
    allDuesCleared: false,
    tcNumber: 'TC-2024-046',
    issueDate: new Date().toISOString().split('T')[0],
    signatory: 'principal',
    template: 'standard',
    remarks: '',
    includePhoto: false,
    includeQR: true,
    copies: 2,
    applicationDate: new Date().toISOString().split('T')[0],
    parentConsent: false,
    nocRequired: false,
    nocObtained: false
  });
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        setStudent(MOCK_STUDENT);
        setSettings((prev) => ({
          ...prev,
          lastClassAttended: MOCK_STUDENT.class + '-' + MOCK_STUDENT.section
        }));
        setIsSearching(false);
      }, 1000);
    }
  };
  const clearStudent = () => {
    setStudent(null);
    setSearchTerm('');
    setSelectedBranch(null);
  };
  const toggleDueClearance = (id: string) => {
    if (student) {
      const updatedDues = student.duesClearance.map((due) =>
      due.id === id ?
      {
        ...due,
        cleared: !due.cleared,
        clearedDate: !due.cleared ?
        new Date().toISOString().split('T')[0] :
        undefined,
        clearedBy: !due.cleared ? 'Current User' : undefined
      } :
      due
      );
      setStudent({
        ...student,
        duesClearance: updatedDues
      });
    }
  };
  const toggleDocumentVerified = (id: string) => {
    if (student) {
      const updatedDocs = student.documents.map((doc) =>
      doc.id === id ?
      {
        ...doc,
        verified: !doc.verified
      } :
      doc
      );
      setStudent({
        ...student,
        documents: updatedDocs
      });
    }
  };
  const selectBranch = (branch: BranchData) => {
    setSelectedBranch(branch);
    setSettings((prev) => ({
      ...prev,
      destinationBranch: branch.id
    }));
    setShowBranchModal(false);
  };
  const startProcessing = () => {
    if (
    settings.transferType === 'external' &&
    confirmationText !== 'TRANSFER')
    {
      return;
    }
    setShowConfirmModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessingComplete(true);
    }, 2500);
  };
  const calculateClearanceStatus = () => {
    if (!student)
    return {
      cleared: 0,
      pending: 0,
      total: 0
    };
    const cleared = student.duesClearance.filter((d) => d.cleared).length;
    const total = student.duesClearance.length;
    return {
      cleared,
      pending: total - cleared,
      total
    };
  };
  const calculateDocumentStatus = () => {
    if (!student)
    return {
      verified: 0,
      pending: 0,
      total: 0
    };
    const verified = student.documents.filter((d) => d.verified).length;
    const total = student.documents.length;
    return {
      verified,
      pending: total - verified,
      total
    };
  };
  const allDuesCleared = () => {
    if (!student) return false;
    return student.duesClearance.every((d) => d.cleared);
  };
  const allDocsVerified = () => {
    if (!student) return false;
    return student.documents.filter((d) => d.required).every((d) => d.verified);
  };
  const canProceed = () => {
    if (!student) return false;
    if (settings.transferType === 'external') {
      return (
        settings.destinationSchool &&
        settings.reason &&
        settings.parentConsent &&
        allDuesCleared());

    } else {
      return selectedBranch && settings.reason && allDuesCleared();
    }
  };
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const clearanceStatus = calculateClearanceStatus();
  const documentStatus = calculateDocumentStatus();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Transfer Certificate (TC)
            </h1>
            <p className="text-gray-500">
              Process student transfers - internal branch or external school
            </p>
          </div>
        </div>
        {student &&
        <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryModal(true)}>

              <History className="w-4 h-4 mr-2" />
              Transfer History
            </Button>
          </div>
        }
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Student Search */}
          <Card>
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Student Search</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter GR No, Admission No, or Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchTerm.trim()}>

                  {isSearching ?
                  <Loader2 className="w-4 h-4 animate-spin" /> :

                  <Search className="w-4 h-4" />
                  }
                </Button>
              </div>

              {student &&
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-orange-200 rounded-full flex items-center justify-center text-xl font-bold text-orange-700">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {student.grNo} • Class {student.class}-
                            {student.section}
                          </p>
                        </div>
                        <button
                        onClick={clearStudent}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded">

                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="success" size="sm">
                          {student.status}
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {student.currentBranch}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-orange-200 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {clearanceStatus.cleared}/{clearanceStatus.total}
                      </div>
                      <div className="text-xs text-gray-500">Dues Cleared</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-600">
                        {documentStatus.verified}/{documentStatus.total}
                      </div>
                      <div className="text-xs text-gray-500">Docs Verified</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {student.attendance}%
                      </div>
                      <div className="text-xs text-gray-500">Attendance</div>
                    </div>
                  </div>

                  {student.pendingFees > 0 &&
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Pending Fees: ₹{student.pendingFees.toLocaleString()}
                        </span>
                      </div>
                    </div>
                }

                  <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => setShowStudentModal(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              }
            </div>
          </Card>

          {/* Transfer Type */}
          <Card>
            <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('transferType')}>

              <div className="flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Transfer Type</h3>
              </div>
              {expandedSections.transferType ?
              <ChevronUp className="w-4 h-4 text-gray-400" /> :

              <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>

            {expandedSections.transferType &&
            <div className="p-4 space-y-3">
                <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${settings.transferType === 'external' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>

                  <input
                  type="radio"
                  name="transferType"
                  checked={settings.transferType === 'external'}
                  onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    transferType: 'external'
                  }))
                  }
                  className="sr-only" />

                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">External Transfer</div>
                    <div className="text-sm text-gray-500">
                      Transfer to a different school/institution
                    </div>
                  </div>
                  {settings.transferType === 'external' &&
                <CheckCircle className="w-5 h-5 text-blue-600" />
                }
                </label>

                <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${settings.transferType === 'internal' ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}>

                  <input
                  type="radio"
                  name="transferType"
                  checked={settings.transferType === 'internal'}
                  onChange={() =>
                  setSettings((prev) => ({
                    ...prev,
                    transferType: 'internal'
                  }))
                  }
                  className="sr-only" />

                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Internal Branch Transfer</div>
                    <div className="text-sm text-gray-500">
                      Transfer to another campus/branch
                    </div>
                  </div>
                  {settings.transferType === 'internal' &&
                <CheckCircle className="w-5 h-5 text-green-600" />
                }
                </label>
              </div>
            }
          </Card>

          {/* Quick Dues Overview */}
          {student &&
          <Card>
              <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('duesClearance')}>

                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">
                    Dues Clearance
                  </h3>
                  {allDuesCleared() ?
                <Badge variant="success" size="sm">
                      All Clear
                    </Badge> :

                <Badge variant="warning" size="sm">
                      {clearanceStatus.pending} Pending
                    </Badge>
                }
                </div>
                {expandedSections.duesClearance ?
              <ChevronUp className="w-4 h-4 text-gray-400" /> :

              <ChevronDown className="w-4 h-4 text-gray-400" />
              }
              </div>

              {expandedSections.duesClearance &&
            <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {student.duesClearance.slice(0, 6).map((due) => {
                  const Icon = due.icon;
                  return (
                    <div
                      key={due.id}
                      className={`p-2 rounded-lg border text-center ${due.cleared ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>

                          <Icon
                        className={`w-4 h-4 mx-auto mb-1 ${due.cleared ? 'text-green-600' : 'text-red-600'}`} />

                          <div className="text-xs font-medium truncate">
                            {due.department}
                          </div>
                        </div>);

                })}
                  </div>
                  <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowDuesModal(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    View All Departments
                  </Button>
                </div>
            }
            </Card>
          }

          {/* Recent Transfers */}
          <Card>
            <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('recentTransfers')}>

              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold text-gray-900">
                  Recent Transfers
                </h3>
              </div>
              {expandedSections.recentTransfers ?
              <ChevronUp className="w-4 h-4 text-gray-400" /> :

              <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </div>

            {expandedSections.recentTransfers &&
            <div className="divide-y divide-gray-100">
                {RECENT_TRANSFERS.map((transfer) =>
              <div key={transfer.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm">{transfer.tcNo}</span>
                      <Badge
                    variant={
                    transfer.type === 'external' ? 'primary' : 'success'
                    }
                    size="sm">

                        {transfer.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      <p className="flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {transfer.toSchool}
                      </p>
                      <p className="mt-1">{transfer.transferDate}</p>
                    </div>
                  </div>
              )}
              </div>
            }
          </Card>
        </div>

        {/* Right Panel - Transfer Form */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${settings.transferType === 'external' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>

                  {settings.transferType === 'external' ?
                  <Globe className="w-5 h-5" /> :

                  <Building2 className="w-5 h-5" />
                  }
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {settings.transferType === 'external' ?
                    'External Transfer Details' :
                    'Internal Branch Transfer'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {settings.transferType === 'external' ?
                    'Complete details for transfer to another institution' :
                    'Transfer student to another campus/branch'}
                  </p>
                </div>
              </div>
              {student &&
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplateModal(true)}>

                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Template
                </Button>
              }
            </div>

            {student ?
            <div className="p-6 space-y-6">
                {/* External Transfer Fields */}
                {settings.transferType === 'external' &&
              <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">
                            External Transfer Notice
                          </h4>
                          <p className="text-sm text-blue-700 mt-1">
                            This will generate a Transfer Certificate (TC) and
                            mark the student's record as "Transferred Out". This
                            action requires all dues to be cleared.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                    label="Destination School Name *"
                    placeholder="Name of new school/institution"
                    value={settings.destinationSchool}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      destinationSchool: e.target.value
                    }))
                    } />

                      <Select
                    label="Board / Affiliation"
                    value={settings.destinationBoard}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      destinationBoard: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: '',
                      label: 'Select Board'
                    },
                    ...BOARDS]
                    } />

                    </div>
                  </div>
              }

                {/* Internal Transfer Fields */}
                {settings.transferType === 'internal' &&
              <div className="space-y-6">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Building2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-800">
                            Internal Branch Transfer
                          </h4>
                          <p className="text-sm text-green-700 mt-1">
                            This will transfer the student record to the
                            selected branch. The student will continue with the
                            same GR number and academic history.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Destination Branch *
                      </label>
                      {selectedBranch ?
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-green-700" />
                              </div>
                              <div>
                                <h4 className="font-medium text-green-800">
                                  {selectedBranch.name}
                                </h4>
                                <p className="text-sm text-green-600">
                                  {selectedBranch.address}
                                </p>
                              </div>
                            </div>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBranchModal(true)}>

                              Change
                            </Button>
                          </div>
                        </div> :

                  <Button
                    variant="outline"
                    className="w-full py-8 border-dashed"
                    onClick={() => setShowBranchModal(true)}>

                          <Building2 className="w-6 h-6 mr-2 text-gray-400" />
                          Click to Select Destination Branch
                        </Button>
                  }
                    </div>
                  </div>
              }

                {/* Common Transfer Details */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Transfer Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                    label="Reason for Transfer *"
                    value={settings.reason}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      reason: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: '',
                      label: 'Select Reason'
                    },
                    ...TRANSFER_REASONS]
                    } />

                    {settings.reason === 'other' &&
                  <Input
                    label="Specify Reason"
                    placeholder="Enter reason"
                    value={settings.customReason}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      customReason: e.target.value
                    }))
                    } />

                  }
                    <Input
                    label="Transfer Effective Date"
                    type="date"
                    value={settings.effectiveDate}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      effectiveDate: e.target.value
                    }))
                    } />

                    <Input
                    label="Last Date of Attendance"
                    type="date"
                    value={settings.lastAttendanceDate}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lastAttendanceDate: e.target.value
                    }))
                    } />

                  </div>
                </div>

                {/* Academic Details */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Academic Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                    label="Last Class Attended"
                    value={settings.lastClassAttended}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lastClassAttended: e.target.value
                    }))
                    } />

                    <Input
                    label="Promoted To Class"
                    placeholder="e.g. IX-A"
                    value={settings.promotedToClass}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      promotedToClass: e.target.value
                    }))
                    } />

                    <Select
                    label="Result Status"
                    value={settings.resultStatus}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      resultStatus: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: 'passed',
                      label: 'Passed'
                    },
                    {
                      value: 'promoted',
                      label: 'Promoted'
                    },
                    {
                      value: 'failed',
                      label: 'Failed'
                    },
                    {
                      value: 'detained',
                      label: 'Detained'
                    }]
                    } />

                    <Select
                    label="Conduct"
                    value={settings.conduct}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      conduct: e.target.value
                    }))
                    }
                    options={[
                    {
                      value: 'excellent',
                      label: 'Excellent'
                    },
                    {
                      value: 'very-good',
                      label: 'Very Good'
                    },
                    {
                      value: 'good',
                      label: 'Good'
                    },
                    {
                      value: 'satisfactory',
                      label: 'Satisfactory'
                    }]
                    } />

                  </div>
                </div>

                {/* Dues Clearance Section */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      No-Dues Clearance
                    </h4>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDuesModal(true)}>

                      <Eye className="w-4 h-4 mr-2" />
                      Manage Clearance
                    </Button>
                  </div>

                  <div className="grid grid-cols-5 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {student.duesClearance.slice(0, 10).map((due) => {
                    const Icon = due.icon;
                    return (
                      <button
                        key={due.id}
                        onClick={() => toggleDueClearance(due.id)}
                        className={`p-3 rounded-lg border text-center transition-all ${due.cleared ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-white border-gray-200 hover:bg-gray-100'}`}>

                          {due.cleared ?
                        <CheckCircle className="w-5 h-5 mx-auto mb-1 text-green-600" /> :

                        <Icon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        }
                          <div className="text-xs font-medium truncate">
                            {due.department}
                          </div>
                        </button>);

                  })}
                  </div>

                  {!allDuesCleared() &&
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {clearanceStatus.pending} department(s) have pending
                          dues. All dues must be cleared before transfer.
                        </span>
                      </div>
                    </div>
                }

                  {allDuesCleared() &&
                <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          All dues cleared. Student is eligible for transfer.
                        </span>
                      </div>
                    </div>
                }
                </div>

                {/* Documents Section */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Document Verification
                    </h4>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocumentsModal(true)}>

                      <FileCheck className="w-4 h-4 mr-2" />
                      View Documents
                    </Button>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    {student.documents.
                  filter((d) => d.required).
                  map((doc) =>
                  <div
                    key={doc.id}
                    className={`p-3 rounded-lg border ${doc.verified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>

                          <div className="flex items-center gap-2">
                            {doc.verified ?
                      <CheckCircle className="w-4 h-4 text-green-600" /> :

                      <Clock className="w-4 h-4 text-yellow-600" />
                      }
                            <span className="text-xs font-medium truncate">
                              {doc.name}
                            </span>
                          </div>
                        </div>
                  )}
                  </div>
                </div>

                {/* Consent & NOC */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Consent & NOC
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <UserCheck className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-sm">
                            Parent/Guardian Consent
                          </div>
                          <div className="text-xs text-gray-500">
                            Written consent from parent/guardian obtained
                          </div>
                        </div>
                      </div>
                      <input
                      type="checkbox"
                      checked={settings.parentConsent}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        parentConsent: e.target.checked
                      }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />

                    </label>

                    {settings.transferType === 'external' &&
                  <>
                        <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <div className="font-medium text-sm">
                                NOC Required
                              </div>
                              <div className="text-xs text-gray-500">
                                No Objection Certificate required from current
                                school
                              </div>
                            </div>
                          </div>
                          <input
                        type="checkbox"
                        checked={settings.nocRequired}
                        onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          nocRequired: e.target.checked
                        }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />

                        </label>

                        {settings.nocRequired &&
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ml-8">
                            <div className="flex items-center gap-3">
                              <BadgeCheck className="w-5 h-5 text-gray-400" />
                              <div>
                                <div className="font-medium text-sm">
                                  NOC Obtained
                                </div>
                                <div className="text-xs text-gray-500">
                                  NOC has been obtained and verified
                                </div>
                              </div>
                            </div>
                            <input
                        type="checkbox"
                        checked={settings.nocObtained}
                        onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          nocObtained: e.target.checked
                        }))
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-5 h-5" />

                          </label>
                    }
                      </>
                  }
                  </div>
                </div>

                {/* TC Details */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">TC Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                    label="TC Number"
                    value={settings.tcNumber}
                    disabled
                    className="bg-gray-50 font-mono" />

                    <Input
                    label="Application Date"
                    type="date"
                    value={settings.applicationDate}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      applicationDate: e.target.value
                    }))
                    } />

                    <Input
                    label="Issue Date"
                    type="date"
                    value={settings.issueDate}
                    onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      issueDate: e.target.value
                    }))
                    } />

                  </div>
                </div>

                {/* Signatory */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Signatory</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SIGNATORIES.map((sig) =>
                  <label
                    key={sig.id}
                    className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${settings.signatory === sig.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>

                        <input
                      type="radio"
                      name="signatory"
                      value={sig.id}
                      checked={settings.signatory === sig.id}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        signatory: e.target.value
                      }))
                      }
                      className="sr-only" />

                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="text-sm font-medium text-center">
                          {sig.name}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {sig.designation}
                        </div>
                      </label>
                  )}
                  </div>
                </div>

                {/* Remarks */}
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks (Optional)
                  </label>
                  <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Any additional remarks for the transfer certificate"
                  value={settings.remarks}
                  onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    remarks: e.target.value
                  }))
                  } />

                </div>

                {/* Additional Options */}
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Additional Options
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                      type="checkbox"
                      checked={settings.includePhoto}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        includePhoto: e.target.checked
                      }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                      <span className="text-sm">Include Photo</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                      type="checkbox"
                      checked={settings.includeQR}
                      onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        includeQR: e.target.checked
                      }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                      <span className="text-sm">Include QR Code</span>
                    </label>
                    <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg">
                      <span className="text-sm">Copies:</span>
                      <div className="flex items-center gap-1">
                        <button
                        onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          copies: Math.max(1, prev.copies - 1)
                        }))
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100">

                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {settings.copies}
                        </span>
                        <button
                        onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          copies: prev.copies + 1
                        }))
                        }
                        className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100">

                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                  <Button
                  variant="outline"
                  onClick={() => setShowPreviewModal(true)}>

                    <Eye className="w-4 h-4 mr-2" />
                    Preview TC
                  </Button>
                  <Button variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button
                  onClick={() => setShowConfirmModal(true)}
                  disabled={!canProceed()}
                  className={
                  settings.transferType === 'external' ?
                  'bg-red-600 hover:bg-red-700' :
                  'bg-green-600 hover:bg-green-700'
                  }>

                    <Send className="w-4 h-4 mr-2" />
                    {settings.transferType === 'external' ?
                  'Generate TC' :
                  'Process Transfer'}
                  </Button>
                </div>

                {!canProceed() &&
              <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg mt-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">
                          Cannot proceed with transfer
                        </p>
                        <ul className="text-xs mt-1 space-y-1">
                          {!allDuesCleared() &&
                      <li>• All dues must be cleared</li>
                      }
                          {!settings.reason &&
                      <li>• Transfer reason is required</li>
                      }
                          {!settings.parentConsent &&
                      <li>• Parent consent is required</li>
                      }
                          {settings.transferType === 'external' &&
                      !settings.destinationSchool &&
                      <li>• Destination school name is required</li>
                      }
                          {settings.transferType === 'internal' &&
                      !selectedBranch &&
                      <li>• Destination branch must be selected</li>
                      }
                        </ul>
                      </div>
                    </div>
                  </div>
              }
              </div> :

            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <ArrowRightLeft className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                  Search for a Student
                </h3>
                <p className="text-sm text-gray-400">
                  Enter GR Number, Admission Number, or Name to initiate
                  transfer
                </p>
              </div>
            }
          </Card>
        </div>
      </div>

      {/* Student Details Modal */}
      <Modal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        title="Student Profile"
        size="xl">

        {student &&
        <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-orange-200 rounded-full flex items-center justify-center text-2xl font-bold text-orange-700">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {student.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary">{student.grNo}</Badge>
                  <Badge variant="secondary">{student.admissionNo}</Badge>
                  <Badge variant="success">{student.status}</Badge>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Class {student.class}-{student.section} |{' '}
                  {student.currentBranch}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Personal Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Father's Name</div>
                      <div className="text-sm font-medium">
                        {student.fatherName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Mother's Name</div>
                      <div className="text-sm font-medium">
                        {student.motherName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Date of Birth</div>
                      <div className="text-sm font-medium">{student.dob}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Aadhar Number</div>
                      <div className="text-sm font-medium font-mono">
                        {student.aadharNo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Academic Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Admission Date
                      </div>
                      <div className="text-sm font-medium">
                        {student.admissionDate}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <School className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Previous School
                      </div>
                      <div className="text-sm font-medium">
                        {student.previousSchool}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">
                        Last Exam Result
                      </div>
                      <div className="text-sm font-medium">
                        {student.lastExamResult}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ClipboardCheck className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Attendance</div>
                      <div className="text-sm font-medium">
                        {student.attendance}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                  Contact Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="text-sm font-medium">{student.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm font-medium">{student.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <div className="text-xs text-gray-500">Address</div>
                      <div className="text-sm font-medium">
                        {student.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
              variant="outline"
              onClick={() => setShowStudentModal(false)}>

                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Dues Clearance Modal */}
      <Modal
        isOpen={showDuesModal}
        onClose={() => setShowDuesModal(false)}
        title="Dues Clearance Management"
        size="lg">

        {student &&
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {clearanceStatus.cleared}
                </div>
                <div className="text-sm text-green-600">Cleared</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {clearanceStatus.pending}
                </div>
                <div className="text-sm text-red-600">Pending</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {clearanceStatus.total}
                </div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Details
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {student.duesClearance.map((due) => {
                  const Icon = due.icon;
                  return (
                    <tr key={due.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-sm">
                              {due.department}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {due.cleared ?
                        <Badge variant="success" size="sm">
                              Cleared
                            </Badge> :

                        <Badge variant="danger" size="sm">
                              Pending
                            </Badge>
                        }
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {due.cleared ?
                        <span>
                              Cleared by {due.clearedBy} on {due.clearedDate}
                            </span> :

                        <span className="text-red-600">
                              {due.pendingAmount ?
                          `₹${due.pendingAmount.toLocaleString()} pending` :
                          due.pendingItems ?
                          `${due.pendingItems} item(s) pending` :
                          due.remarks}
                            </span>
                        }
                        </td>
                        <td className="px-4 py-3">
                          <Button
                          variant={due.cleared ? 'outline' : 'primary'}
                          size="xs"
                          onClick={() => toggleDueClearance(due.id)}>

                            {due.cleared ? 'Revert' : 'Mark Cleared'}
                          </Button>
                        </td>
                      </tr>);

                })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDuesModal(false)}>
                Close
              </Button>
              <Button
              onClick={() => {
                student.duesClearance.forEach((due) => {
                  if (!due.cleared) toggleDueClearance(due.id);
                });
              }}
              disabled={allDuesCleared()}>

                <CheckCircle className="w-4 h-4 mr-2" />
                Clear All Pending
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Documents Modal */}
      <Modal
        isOpen={showDocumentsModal}
        onClose={() => setShowDocumentsModal(false)}
        title="Document Verification"
        size="lg">

        {student &&
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {documentStatus.verified}
                </div>
                <div className="text-sm text-green-600">Verified</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {documentStatus.pending}
                </div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {documentStatus.total}
                </div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Document
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Required
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Verified
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {student.documents.map((doc) =>
                <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-sm">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {doc.required ?
                    <Badge variant="danger" size="sm">
                            Required
                          </Badge> :

                    <Badge variant="secondary" size="sm">
                            Optional
                          </Badge>
                    }
                      </td>
                      <td className="px-4 py-3">
                        {doc.submitted ?
                    <CheckCircle className="w-5 h-5 text-green-500" /> :

                    <XCircle className="w-5 h-5 text-gray-300" />
                    }
                      </td>
                      <td className="px-4 py-3">
                        {doc.verified ?
                    <Badge variant="success" size="sm">
                            Verified
                          </Badge> :
                    doc.submitted ?
                    <Badge variant="warning" size="sm">
                            Pending
                          </Badge> :

                    <span className="text-xs text-gray-400">N/A</span>
                    }
                      </td>
                      <td className="px-4 py-3">
                        {doc.submitted &&
                    <Button
                      variant={doc.verified ? 'outline' : 'primary'}
                      size="xs"
                      onClick={() => toggleDocumentVerified(doc.id)}>

                            {doc.verified ? 'Unverify' : 'Verify'}
                          </Button>
                    }
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowDocumentsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Branch Selection Modal */}
      <Modal
        isOpen={showBranchModal}
        onClose={() => setShowBranchModal(false)}
        title="Select Destination Branch"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {MOCK_BRANCHES.map((branch) =>
            <div
              key={branch.id}
              onClick={() => selectBranch(branch)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedBranch?.id === branch.id ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {branch.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {branch.address}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {branch.principal}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {branch.studentsCount} students
                      </span>
                    </div>
                  </div>
                  {selectedBranch?.id === branch.id &&
                <CheckCircle className="w-5 h-5 text-green-600" />
                }
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Select TC Template"
        size="lg">

        <div className="grid grid-cols-3 gap-4">
          {TEMPLATES.map((template) =>
          <div
            key={template.id}
            onClick={() => {
              setSettings((prev) => ({
                ...prev,
                template: template.id
              }));
              setShowTemplateModal(false);
            }}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${settings.template === template.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}`}>

              <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center relative">
                <FileText className="w-12 h-12 text-gray-400" />
                {settings.template === template.id &&
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
              }
              </div>
              <h4 className="font-medium text-sm">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-1">
                {template.description}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Transfer Certificate Preview"
        size="xl">

        {student &&
        <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="bg-white rounded shadow-lg p-6 aspect-[3/4] flex flex-col text-sm">
                <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
                  <h3 className="text-lg font-bold uppercase">
                    Transfer Certificate
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    TC No: {settings.tcNumber}
                  </p>
                </div>

                <div className="flex-1 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">GR No:</span>
                      <span className="font-medium ml-1">{student.grNo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Admission No:</span>
                      <span className="font-medium ml-1">
                        {student.admissionNo}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded border">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-gray-600">S/O {student.fatherName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Class:</span>
                      <span className="font-medium ml-1">
                        {settings.lastClassAttended}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Promoted To:</span>
                      <span className="font-medium ml-1">
                        {settings.promotedToClass || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500">Reason:</span>
                    <span className="font-medium ml-1">
                      {
                    TRANSFER_REASONS.find(
                      (r) => r.value === settings.reason
                    )?.label
                    }
                    </span>
                  </div>

                  {settings.transferType === 'external' &&
                <div>
                      <span className="text-gray-500">Destination:</span>
                      <span className="font-medium ml-1">
                        {settings.destinationSchool}
                      </span>
                    </div>
                }

                  {settings.transferType === 'internal' && selectedBranch &&
                <div>
                      <span className="text-gray-500">Transfer To:</span>
                      <span className="font-medium ml-1">
                        {selectedBranch.name}
                      </span>
                    </div>
                }

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-500">Conduct:</span>
                      <span className="font-medium ml-1 capitalize">
                        {settings.conduct}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Result:</span>
                      <span className="font-medium ml-1 capitalize">
                        {settings.resultStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-4 mt-4 flex justify-between items-end">
                  <div className="text-xs">
                    <div>Date: {settings.issueDate}</div>
                  </div>
                  <div className="text-center">
                    <div className="w-24 border-t border-gray-400 pt-1">
                      <span className="text-xs">
                        {
                      SIGNATORIES.find((s) => s.id === settings.signatory)?.
                      name
                      }
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {
                    SIGNATORIES.find((s) => s.id === settings.signatory)?.
                    designation
                    }
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Transfer Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Transfer Type</span>
                  <Badge
                  variant={
                  settings.transferType === 'external' ?
                  'primary' :
                  'success'
                  }>

                    {settings.transferType === 'external' ?
                  'External' :
                  'Internal'}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Student</span>
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">From</span>
                  <span className="font-medium">{student.currentBranch}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">To</span>
                  <span className="font-medium">
                    {settings.transferType === 'external' ?
                  settings.destinationSchool :
                  selectedBranch?.name}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Effective Date</span>
                  <span className="font-medium">{settings.effectiveDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Dues Status</span>
                  {allDuesCleared() ?
                <Badge variant="success">All Cleared</Badge> :

                <Badge variant="danger">Pending</Badge>
                }
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button
                className="w-full"
                onClick={() => {
                  setShowPreviewModal(false);
                  setShowConfirmModal(true);
                }}
                disabled={!canProceed()}>

                  <Check className="w-4 h-4 mr-2" />
                  Confirm & Process
                </Button>
                <Button variant="outline" className="w-full">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Preview
                </Button>
              </div>
            </div>
          </div>
        }
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isProcessing && setShowConfirmModal(false)}
        title={
        isProcessing ?
        'Processing Transfer...' :
        processingComplete ?
        'Transfer Complete' :
        'Confirm Transfer'
        }
        size="md">

        {!isProcessing && !processingComplete && student &&
        <div className="space-y-6">
            <div
            className={`p-4 rounded-lg ${settings.transferType === 'external' ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>

              <div className="flex items-start gap-3">
                <AlertTriangle
                className={`w-6 h-6 ${settings.transferType === 'external' ? 'text-red-600' : 'text-green-600'}`} />

                <div>
                  <h4
                  className={`font-semibold ${settings.transferType === 'external' ? 'text-red-800' : 'text-green-800'}`}>

                    {settings.transferType === 'external' ?
                  'External Transfer Confirmation' :
                  'Internal Transfer Confirmation'}
                  </h4>
                  <ul
                  className={`mt-2 space-y-1 text-sm ${settings.transferType === 'external' ? 'text-red-700' : 'text-green-700'}`}>

                    <li>• Student: {student.name}</li>
                    <li>• From: {student.currentBranch}</li>
                    <li>
                      • To:{' '}
                      {settings.transferType === 'external' ?
                    settings.destinationSchool :
                    selectedBranch?.name}
                    </li>
                    {settings.transferType === 'external' &&
                  <li>
                        • Student record will be marked as "Transferred Out"
                      </li>
                  }
                  </ul>
                </div>
              </div>
            </div>

            {settings.transferType === 'external' &&
          <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">TRANSFER</span>{' '}
                  to confirm
                </label>
                <Input
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type confirmation text here"
              className="font-mono" />

              </div>
          }

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
              variant="outline"
              onClick={() => {
                setShowConfirmModal(false);
                setConfirmationText('');
              }}>

                Cancel
              </Button>
              <Button
              onClick={startProcessing}
              disabled={
              settings.transferType === 'external' &&
              confirmationText !== 'TRANSFER'
              }
              className={
              settings.transferType === 'external' ?
              'bg-red-600 hover:bg-red-700' :
              'bg-green-600 hover:bg-green-700'
              }>

                <Send className="w-4 h-4 mr-2" />
                {settings.transferType === 'external' ?
              'Generate TC' :
              'Process Transfer'}
              </Button>
            </div>
          </div>
        }

        {isProcessing &&
        <div className="flex flex-col items-center py-8">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold">Processing Transfer</h3>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        }

        {processingComplete &&
        <div className="space-y-6">
            <div className="flex flex-col items-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">
                Transfer Processed Successfully!
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                TC No: {settings.tcNumber}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download TC
              </Button>
              <Button className="w-full">
                <Printer className="w-4 h-4 mr-2" />
                Print TC
              </Button>
            </div>

            <Button
            variant="ghost"
            className="w-full"
            onClick={() => {
              setShowConfirmModal(false);
              setProcessingComplete(false);
              setConfirmationText('');
              clearStudent();
            }}>

              Close & Start New Transfer
            </Button>
          </div>
        }
      </Modal>

      {/* Transfer History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Transfer History"
        size="lg">

        {student &&
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-xl font-bold text-orange-700">
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-semibold">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.grNo}</p>
              </div>
            </div>

            {student.transferHistory.length > 0 ?
          <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        TC No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {student.transferHistory.map((transfer) =>
                <tr key={transfer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-sm">
                          {transfer.tcNo}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                      variant={
                      transfer.type === 'external' ?
                      'primary' :
                      'success'
                      }
                      size="sm">

                            {transfer.type}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transfer.fromSchool}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transfer.toSchool}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {transfer.transferDate}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="success" size="sm">
                            {transfer.status}
                          </Badge>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table>
              </div> :

          <div className="text-center py-8 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No previous transfers found</p>
              </div>
          }

            <div className="flex justify-end">
              <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}