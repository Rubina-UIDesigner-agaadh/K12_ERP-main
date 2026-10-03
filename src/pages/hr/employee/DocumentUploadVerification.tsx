import React, { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  SearchIcon,
  UploadIcon,
  FileTextIcon,
  EyeIcon,
  DownloadIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  FolderOpenIcon,
  FilterIcon,
  ClockIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  LockIcon,
  FileImageIcon,
  FileType2Icon,
  CalendarIcon,
  UserIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  BuildingIcon,
  BriefcaseIcon,
  MailIcon,
  PhoneIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  FileIcon,
  ListIcon,
  GridIcon,
  InfoIcon,
  ShieldIcon,
  FileSpreadsheetIcon,
  ArchiveIcon,
  ImageIcon,
  PaperclipIcon,
  CircleIcon,
  CheckCircle2Icon,
  MinusCircleIcon } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employeeType: string;
  dateOfJoining: string;
  branch: string;
  gender: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

interface Document {
  id: string;
  employeeId: string;
  name: string;
  category: string;
  categoryValue: string;
  fileType: 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'archive' | 'other';
  size: string;
  uploadedDate: string;
  uploadedBy: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: string;
  remarks?: string;
  expiryDate?: string;
}

interface DocumentCategory {
  value: string;
  label: string;
  required: boolean;
  description: string;
}

// Document Categories with required flag
const documentCategories: DocumentCategory[] = [
{ value: 'passport', label: 'Passport', required: false, description: 'Valid passport copy' },
{ value: 'national_id', label: 'National ID / Aadhar', required: true, description: 'Government issued ID proof' },
{ value: 'pan_card', label: 'PAN Card', required: true, description: 'Permanent Account Number card' },
{ value: 'degree', label: 'Degree Certificate', required: true, description: 'Highest education degree' },
{ value: 'diploma', label: 'Diploma Certificate', required: false, description: 'Professional diploma if any' },
{ value: 'experience_letter', label: 'Experience Letter', required: false, description: 'Previous employment experience' },
{ value: 'relieving_letter', label: 'Relieving Letter', required: false, description: 'Previous employer relieving letter' },
{ value: 'offer_letter', label: 'Offer Letter', required: true, description: 'Current employment offer letter' },
{ value: 'salary_slip', label: 'Salary Slip', required: false, description: 'Previous employer salary slips' },
{ value: 'bank_statement', label: 'Bank Statement', required: false, description: 'Bank account statement' },
{ value: 'address_proof', label: 'Address Proof', required: true, description: 'Current address verification' },
{ value: 'photo', label: 'Photograph', required: true, description: 'Passport size photograph' },
{ value: 'medical_report', label: 'Medical Report', required: false, description: 'Medical fitness certificate' },
{ value: 'contract', label: 'Employment Contract', required: true, description: 'Signed employment contract' },
{ value: 'other', label: 'Other Document', required: false, description: 'Any other relevant document' }];


// Mock Employees
const mockEmployees: Employee[] = [
{
  id: 'EMP001',
  employeeCode: 'EMP001',
  name: 'John Smith',
  email: 'john.smith@school.edu',
  phone: '+91 98765 43210',
  department: 'Science',
  designation: 'Physics Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2023-06-15',
  branch: 'Main Campus',
  gender: 'Male',
  status: 'Active',
  avatar: 'JS'
},
{
  id: 'EMP002',
  employeeCode: 'EMP002',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@school.edu',
  phone: '+91 98765 43211',
  department: 'English',
  designation: 'English Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2023-08-01',
  branch: 'Main Campus',
  gender: 'Female',
  status: 'Active',
  avatar: 'SJ'
},
{
  id: 'EMP003',
  employeeCode: 'EMP003',
  name: 'Michael Chen',
  email: 'michael.chen@school.edu',
  phone: '+91 98765 43212',
  department: 'Mathematics',
  designation: 'Mathematics Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2023-07-10',
  branch: 'Main Campus',
  gender: 'Male',
  status: 'Active',
  avatar: 'MC'
},
{
  id: 'EMP004',
  employeeCode: 'EMP004',
  name: 'Emily Davis',
  email: 'emily.davis@school.edu',
  phone: '+91 98765 43213',
  department: 'Administration',
  designation: 'HR Coordinator',
  employeeType: 'Non-Teaching Staff',
  dateOfJoining: '2022-04-20',
  branch: 'Main Campus',
  gender: 'Female',
  status: 'Active',
  avatar: 'ED'
},
{
  id: 'EMP005',
  employeeCode: 'EMP005',
  name: 'David Wilson',
  email: 'david.wilson@school.edu',
  phone: '+91 98765 43214',
  department: 'Computer Science',
  designation: 'Computer Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2024-01-05',
  branch: 'Main Campus',
  gender: 'Male',
  status: 'Active',
  avatar: 'DW'
},
{
  id: 'EMP006',
  employeeCode: 'EMP006',
  name: 'Lisa Taylor',
  email: 'lisa.taylor@school.edu',
  phone: '+91 98765 43215',
  department: 'Primary',
  designation: 'Primary Teacher',
  employeeType: 'Teaching Staff',
  dateOfJoining: '2023-09-01',
  branch: 'Junior Wing',
  gender: 'Female',
  status: 'Active',
  avatar: 'LT'
}];


// Mock Documents
const mockDocuments: Document[] = [
{
  id: 'DOC001',
  employeeId: 'EMP001',
  name: 'John_Smith_Passport.pdf',
  category: 'Passport',
  categoryValue: 'passport',
  fileType: 'pdf',
  size: '2.4 MB',
  uploadedDate: '2023-06-15',
  uploadedBy: 'HR Admin',
  verificationStatus: 'verified',
  verifiedBy: 'Sarah Johnson',
  verifiedDate: '2023-06-16'
},
{
  id: 'DOC002',
  employeeId: 'EMP001',
  name: 'John_Smith_Aadhar.pdf',
  category: 'National ID / Aadhar',
  categoryValue: 'national_id',
  fileType: 'pdf',
  size: '1.2 MB',
  uploadedDate: '2023-06-15',
  uploadedBy: 'HR Admin',
  verificationStatus: 'verified',
  verifiedBy: 'Sarah Johnson',
  verifiedDate: '2023-06-16'
},
{
  id: 'DOC003',
  employeeId: 'EMP001',
  name: 'John_Smith_PAN.jpg',
  category: 'PAN Card',
  categoryValue: 'pan_card',
  fileType: 'image',
  size: '856 KB',
  uploadedDate: '2023-06-15',
  uploadedBy: 'John Smith',
  verificationStatus: 'verified',
  verifiedBy: 'Emily Davis',
  verifiedDate: '2023-06-17'
},
{
  id: 'DOC004',
  employeeId: 'EMP001',
  name: 'John_Smith_Degree.pdf',
  category: 'Degree Certificate',
  categoryValue: 'degree',
  fileType: 'pdf',
  size: '3.1 MB',
  uploadedDate: '2023-06-16',
  uploadedBy: 'John Smith',
  verificationStatus: 'pending'
},
{
  id: 'DOC005',
  employeeId: 'EMP001',
  name: 'John_Smith_Photo.jpg',
  category: 'Photograph',
  categoryValue: 'photo',
  fileType: 'image',
  size: '245 KB',
  uploadedDate: '2023-06-15',
  uploadedBy: 'HR Admin',
  verificationStatus: 'verified',
  verifiedBy: 'Emily Davis',
  verifiedDate: '2023-06-15'
},
{
  id: 'DOC006',
  employeeId: 'EMP002',
  name: 'Sarah_Johnson_Degree.pdf',
  category: 'Degree Certificate',
  categoryValue: 'degree',
  fileType: 'pdf',
  size: '1.8 MB',
  uploadedDate: '2023-08-01',
  uploadedBy: 'HR Admin',
  verificationStatus: 'pending'
},
{
  id: 'DOC007',
  employeeId: 'EMP002',
  name: 'Sarah_Johnson_Aadhar.pdf',
  category: 'National ID / Aadhar',
  categoryValue: 'national_id',
  fileType: 'pdf',
  size: '1.1 MB',
  uploadedDate: '2023-08-01',
  uploadedBy: 'Sarah Johnson',
  verificationStatus: 'verified',
  verifiedBy: 'Emily Davis',
  verifiedDate: '2023-08-02'
},
{
  id: 'DOC008',
  employeeId: 'EMP003',
  name: 'Michael_Chen_PAN.jpg',
  category: 'PAN Card',
  categoryValue: 'pan_card',
  fileType: 'image',
  size: '756 KB',
  uploadedDate: '2023-07-10',
  uploadedBy: 'Michael Chen',
  verificationStatus: 'verified',
  verifiedBy: 'Emily Davis',
  verifiedDate: '2023-07-11'
},
{
  id: 'DOC009',
  employeeId: 'EMP001',
  name: 'John_Smith_Contract.pdf',
  category: 'Employment Contract',
  categoryValue: 'contract',
  fileType: 'pdf',
  size: '2.8 MB',
  uploadedDate: '2023-06-15',
  uploadedBy: 'HR Admin',
  verificationStatus: 'verified',
  verifiedBy: 'Sarah Johnson',
  verifiedDate: '2023-06-16'
},
{
  id: 'DOC010',
  employeeId: 'EMP001',
  name: 'John_Smith_Address_Proof.pdf',
  category: 'Address Proof',
  categoryValue: 'address_proof',
  fileType: 'pdf',
  size: '1.5 MB',
  uploadedDate: '2023-06-17',
  uploadedBy: 'John Smith',
  verificationStatus: 'rejected',
  verifiedBy: 'Emily Davis',
  verifiedDate: '2023-06-18',
  remarks: 'Document is not clearly visible. Please upload a clearer copy.'
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


// Main Component
export function DocumentUploadVerification() {
  // State
  const [employees] = useState<Employee[]>(mockEmployees);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterDocStatus, setFilterDocStatus] = useState('all');
  const [filterDocCategory, setFilterDocCategory] = useState('all');

  // Modal States
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [showDocumentChecklistModal, setShowDocumentChecklistModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadRemarks, setUploadRemarks] = useState('');
  const [uploadExpiryDate, setUploadExpiryDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Admin Password State
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [pendingAction, setPendingAction] = useState<{
    type: 'delete' | 'unverify' | 'reject';
    documentId: string;
  } | null>(null);

  // Filter employees based on search
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.phone.includes(searchQuery);

    const matchesDepartment =
    selectedDepartment === 'All Departments' || emp.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Get documents for selected employee
  const employeeDocuments = selectedEmployee ?
  documents.filter((doc) => doc.employeeId === selectedEmployee.id) :
  [];

  // Filter employee documents
  const filteredEmployeeDocuments = employeeDocuments.filter((doc) => {
    const matchesStatus =
    filterDocStatus === 'all' || doc.verificationStatus === filterDocStatus;
    const matchesCategory =
    filterDocCategory === 'all' || doc.categoryValue === filterDocCategory;
    return matchesStatus && matchesCategory;
  });

  // Get document statistics for selected employee
  const getDocumentStats = () => {
    if (!selectedEmployee) return { total: 0, verified: 0, pending: 0, rejected: 0, required: 0, uploaded: 0 };

    const empDocs = documents.filter((doc) => doc.employeeId === selectedEmployee.id);
    const requiredCategories = documentCategories.filter((cat) => cat.required);
    const uploadedCategories = new Set(empDocs.map((doc) => doc.categoryValue));
    const requiredUploaded = requiredCategories.filter((cat) =>
    uploadedCategories.has(cat.value)
    ).length;

    return {
      total: empDocs.length,
      verified: empDocs.filter((d) => d.verificationStatus === 'verified').length,
      pending: empDocs.filter((d) => d.verificationStatus === 'pending').length,
      rejected: empDocs.filter((d) => d.verificationStatus === 'rejected').length,
      required: requiredCategories.length,
      uploaded: requiredUploaded
    };
  };

  const stats = getDocumentStats();

  // Get document checklist status
  const getChecklistStatus = (categoryValue: string) => {
    if (!selectedEmployee) return 'not_uploaded';
    const doc = documents.find(
      (d) => d.employeeId === selectedEmployee.id && d.categoryValue === categoryValue
    );
    if (!doc) return 'not_uploaded';
    return doc.verificationStatus;
  };

  // Handle employee selection
  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle clear employee
  const handleClearEmployee = () => {
    setSelectedEmployee(null);
    setFilterDocStatus('all');
    setFilterDocCategory('all');
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get file icon
  const getFileIcon = (fileType: string, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
    switch (fileType) {
      case 'pdf':
        return <FileType2Icon className={`${sizeClass} text-red-500`} />;
      case 'image':
        return <ImageIcon className={`${sizeClass} text-blue-500`} />;
      case 'doc':
        return <FileTextIcon className={`${sizeClass} text-blue-600`} />;
      case 'spreadsheet':
        return <FileSpreadsheetIcon className={`${sizeClass} text-green-600`} />;
      case 'archive':
        return <ArchiveIcon className={`${sizeClass} text-amber-600`} />;
      default:
        return <FileIcon className={`${sizeClass} text-gray-500`} />;
    }
  };

  // Get file type from name
  const getFileType = (fileName: string): Document['fileType'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['doc', 'docx'].includes(extension || '')) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(extension || '')) return 'spreadsheet';
    if (['zip', 'rar', '7z'].includes(extension || '')) return 'archive';
    return 'other';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get status badge variant
  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'verified':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-amber-500" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFiles(files);
      setShowUploadModal(true);
    }
  };

  // Handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setUploadedFiles(files);
      setShowUploadModal(true);
    }
  };

  // Handle upload confirm
  const handleUploadConfirm = () => {
    if (!selectedEmployee || !uploadCategory || uploadedFiles.length === 0) return;

    const category = documentCategories.find((c) => c.value === uploadCategory);

    const newDocuments: Document[] = uploadedFiles.map((file, index) => ({
      id: `DOC${Date.now()}${index}`,
      employeeId: selectedEmployee.id,
      name: `${selectedEmployee.name.replace(' ', '_')}_${category?.label.replace(/ /g, '_')}.${file.name.split('.').pop()}`,
      category: category?.label || 'Other Document',
      categoryValue: uploadCategory,
      fileType: getFileType(file.name),
      size: formatFileSize(file.size),
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      verificationStatus: 'pending' as const,
      remarks: uploadRemarks || undefined,
      expiryDate: uploadExpiryDate || undefined
    }));

    setDocuments([...newDocuments, ...documents]);
    closeUploadModal();
  };

  // Close upload modal
  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadedFiles([]);
    setUploadCategory('');
    setUploadRemarks('');
    setUploadExpiryDate('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle view document
  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowViewModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    if (document.verificationStatus === 'verified') {
      setPendingAction({ type: 'delete', documentId: document.id });
      setShowAdminPasswordModal(true);
    } else {
      setShowDeleteModal(true);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (selectedDocument) {
      setDocuments(documents.filter((doc) => doc.id !== selectedDocument.id));
    }
    setShowDeleteModal(false);
    setSelectedDocument(null);
  };

  // Handle verification
  const handleVerify = (document: Document) => {
    setDocuments(
      documents.map((doc) =>
      doc.id === document.id ?
      {
        ...doc,
        verificationStatus: 'verified' as const,
        verifiedBy: 'Current Admin',
        verifiedDate: new Date().toISOString().split('T')[0],
        remarks: undefined
      } :
      doc
      )
    );
  };

  // Handle reject
  const handleReject = (document: Document, reason: string) => {
    setDocuments(
      documents.map((doc) =>
      doc.id === document.id ?
      {
        ...doc,
        verificationStatus: 'rejected' as const,
        verifiedBy: 'Current Admin',
        verifiedDate: new Date().toISOString().split('T')[0],
        remarks: reason
      } :
      doc
      )
    );
  };

  // Handle unverify
  const handleUnverify = (document: Document) => {
    setPendingAction({ type: 'unverify', documentId: document.id });
    setShowAdminPasswordModal(true);
  };

  // Handle admin password submit
  const handleAdminPasswordSubmit = () => {
    if (adminPassword === 'admin123') {
      if (pendingAction?.type === 'delete') {
        setDocuments(documents.filter((doc) => doc.id !== pendingAction.documentId));
      } else if (pendingAction?.type === 'unverify') {
        setDocuments(
          documents.map((doc) =>
          doc.id === pendingAction.documentId ?
          {
            ...doc,
            verificationStatus: 'pending' as const,
            verifiedBy: undefined,
            verifiedDate: undefined
          } :
          doc
          )
        );
      }
      closeAdminPasswordModal();
    } else {
      setPasswordError('Invalid admin password. Please try again.');
    }
  };

  // Close admin password modal
  const closeAdminPasswordModal = () => {
    setShowAdminPasswordModal(false);
    setAdminPassword('');
    setPasswordError('');
    setPendingAction(null);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpenIcon className="w-7 h-7 text-blue-600" />
            Document Upload & Verification
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Digital filing cabinet for employee documents with verification workflow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Employee Search Section */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee by name, code, email, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />


            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery &&
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto z-20">
                {filteredEmployees.length > 0 ?
              filteredEmployees.map((employee) =>
              <button
                key={employee.id}
                onClick={() => handleSelectEmployee(employee)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                        {employee.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500">
                          {employee.employeeCode} • {employee.department} • {employee.designation}
                        </p>
                      </div>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </button>
              ) :

              <div className="p-4 text-center text-gray-500">
                    <UserIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No employees found</p>
                  </div>
              }
              </div>
            }
          </div>

          <div className="w-48">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

              {departments.map((dept) =>
              <option key={dept} value={dept}>
                  {dept}
                </option>
              )}
            </select>
          </div>

          <Button variant="primary" onClick={() => setShowSearchResults(true)}>
            <SearchIcon className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Selected Employee Section */}
      {selectedEmployee ?
      <>
          {/* Employee Profile Card */}
          <Card className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Employee Info */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-semibold">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedEmployee.name}</h2>
                    <Badge variant="success">{selectedEmployee.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.employeeCode} • {selectedEmployee.designation}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BuildingIcon className="w-4 h-4" />
                      {selectedEmployee.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MailIcon className="w-4 h-4" />
                      {selectedEmployee.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <PhoneIcon className="w-4 h-4" />
                      {selectedEmployee.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Docs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
                  <p className="text-xs text-gray-500">Verified</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-xs text-gray-500">Rejected</p>
                </div>
                <div className="text-center border-l border-gray-200 pl-6">
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.uploaded}/{stats.required}
                  </p>
                  <p className="text-xs text-gray-500">Required</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setShowDocumentChecklistModal(true)}>
                  <ListIcon className="w-4 h-4 mr-2" />
                  Checklist
                </Button>
                <Button variant="ghost" onClick={handleClearEmployee}>
                  <XIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Document Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <select
              value={filterDocStatus}
              onChange={(e) => setFilterDocStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
              value={filterDocCategory}
              onChange={(e) => setFilterDocCategory(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                <option value="all">All Categories</option>
                {documentCategories.map((cat) =>
              <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
              )}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredEmployeeDocuments.length} documents
              </span>
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>

                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}>

                  <GridIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Documents List/Grid */}
          {filteredEmployeeDocuments.length > 0 ?
        viewMode === 'list' ?
        <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Document
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Uploaded
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredEmployeeDocuments.map((doc) =>
                <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {getFileIcon(doc.fileType)}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.fileType.toUpperCase()} • Uploaded by {doc.uploadedBy}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{doc.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{doc.size}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600">{formatDate(doc.uploadedDate)}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(doc.verificationStatus)}
                              <Badge variant={getStatusVariant(doc.verificationStatus)}>
                                {doc.verificationStatus.charAt(0).toUpperCase() +
                        doc.verificationStatus.slice(1)}
                              </Badge>
                            </div>
                            {doc.verifiedBy &&
                    <p className="text-xs text-gray-500 mt-1">
                                by {doc.verifiedBy} on {formatDate(doc.verifiedDate!)}
                              </p>
                    }
                            {doc.remarks &&
                    <p className="text-xs text-red-500 mt-1">{doc.remarks}</p>
                    }
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                        onClick={() => handleViewDocument(doc)}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                        title="View">

                                <EyeIcon className="w-4 h-4" />
                              </button>
                              <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="Download">

                                <DownloadIcon className="w-4 h-4" />
                              </button>
                              {doc.verificationStatus === 'pending' &&
                      <>
                                  <button
                          onClick={() => handleVerify(doc)}
                          className="p-1.5 rounded-lg hover:bg-green-50 text-green-600"
                          title="Verify">

                                    <CheckIcon className="w-4 h-4" />
                                  </button>
                                  <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) handleReject(doc, reason);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                          title="Reject">

                                    <XIcon className="w-4 h-4" />
                                  </button>
                                </>
                      }
                              {doc.verificationStatus === 'verified' &&
                      <button
                        onClick={() => handleUnverify(doc)}
                        className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600"
                        title="Unverify (Admin)">

                                  <LockIcon className="w-4 h-4" />
                                </button>
                      }
                              <button
                        onClick={() => handleDeleteClick(doc)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        title="Delete">

                                <Trash2Icon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                )}
                    </tbody>
                  </table>
                </div>
              </Card> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEmployeeDocuments.map((doc) =>
          <Card key={doc.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-24 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b">
                      {getFileIcon(doc.fileType, 'lg')}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.category}</p>
                        </div>
                        <Badge variant={getStatusVariant(doc.verificationStatus)}>
                          {doc.verificationStatus.charAt(0).toUpperCase() +
                  doc.verificationStatus.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        <p>{doc.size} • {formatDate(doc.uploadedDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                  onClick={() => handleViewDocument(doc)}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100">

                          <EyeIcon className="w-3 h-3" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded hover:bg-gray-100">
                          <DownloadIcon className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  </Card>
          )}
              </div> :


        <Card className="p-12 text-center">
              <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
              <p className="text-sm text-gray-500">
                {filterDocStatus !== 'all' || filterDocCategory !== 'all' ?
            'Try adjusting your filters' :
            'Upload documents using the panel below'}
              </p>
            </Card>
        }

          {/* Upload Panel */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UploadIcon className="w-5 h-5 text-blue-600" />
                Upload Documents for {selectedEmployee.name}
              </h3>
            </div>
            <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`
            }
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}>

              <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />

              <div className="flex flex-col items-center">
                <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                isDragging ? 'bg-blue-100' : 'bg-gray-100'}`
                }>

                  <UploadIcon
                  className={`w-6 h-6 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} />

                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isDragging ? 'Drop files here' : 'Drag and drop files or click to browse'}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Supports PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB)
                </p>
                <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Select Files
                </Button>
              </div>
            </div>
          </Card>
        </> : (

      /* No Employee Selected State */
      <Card className="p-12 text-center">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Select an Employee</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Search and select an employee above to view their documents, upload new documents, and
            manage verification status.
          </p>
        </Card>)
      }

      {/* Upload Modal */}
      {showUploadModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeUploadModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UploadIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
                  <p className="text-sm text-gray-500">{uploadedFiles.length} file(s) selected</p>
                </div>
              </div>
              <button onClick={closeUploadModal} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Selected Files */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Files</label>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {uploadedFiles.map((file, index) =>
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      {getFileIcon(getFileType(file.name), 'sm')}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                      <button
                    onClick={() =>
                    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
                    }
                    className="text-gray-400 hover:text-red-500">

                        <XIcon className="w-4 h-4" />
                      </button>
                    </div>
                )}
                </div>
              </div>

              {/* Document Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">

                  <option value="">Select document type...</option>
                  {documentCategories.map((cat) =>
                <option key={cat.value} value={cat.value}>
                      {cat.label} {cat.required && '(Required)'}
                    </option>
                )}
                </select>
                {uploadCategory &&
              <p className="text-xs text-gray-500 mt-1">
                    {documentCategories.find((c) => c.value === uploadCategory)?.description}
                  </p>
              }
              </div>

              {/* Expiry Date (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date (if applicable)
                </label>
                <input
                type="date"
                value={uploadExpiryDate}
                onChange={(e) => setUploadExpiryDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                value={uploadRemarks}
                onChange={(e) => setUploadRemarks(e.target.value)}
                rows={2}
                placeholder="Any additional notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

              </div>

              {/* Info */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircleIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Documents will be marked as "Pending" until verified by an admin.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeUploadModal}>
                Cancel
              </Button>
              <Button
              variant="primary"
              onClick={handleUploadConfirm}
              disabled={!uploadCategory || uploadedFiles.length === 0}>

                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Documents
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Document Modal */}
      {showViewModal && selectedDocument &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedDocument.fileType)}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedDocument.name}</h2>
                  <p className="text-sm text-gray-500">{selectedDocument.category}</p>
                </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Preview Area */}
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  {getFileIcon(selectedDocument.fileType, 'lg')}
                  <p className="text-sm text-gray-500 mt-2">Document Preview</p>
                  <p className="text-xs text-gray-400">(Preview would be shown here)</p>
                </div>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.category}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">File Size</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.size}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Uploaded Date</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedDocument.uploadedDate)}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Uploaded By</p>
                  <p className="text-sm font-medium text-gray-900">{selectedDocument.uploadedBy}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedDocument.verificationStatus)}
                    <Badge variant={getStatusVariant(selectedDocument.verificationStatus)}>
                      {selectedDocument.verificationStatus.charAt(0).toUpperCase() +
                    selectedDocument.verificationStatus.slice(1)}
                    </Badge>
                  </div>
                </div>
                {selectedDocument.verifiedBy &&
              <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">Verified By</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedDocument.verifiedBy} on {formatDate(selectedDocument.verifiedDate!)}
                    </p>
                  </div>
              }
              </div>

              {/* Remarks */}
              {selectedDocument.remarks &&
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{selectedDocument.remarks}</p>
                </div>
            }
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button variant="primary">
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDocument &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangleIcon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Delete Document</h2>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600">
                Are you sure you want to delete <strong>"{selectedDocument.name}"</strong>? This action
                cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">

                Delete
              </button>
            </div>
          </div>
        </div>
      }

      {/* Admin Password Modal */}
      {showAdminPasswordModal &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAdminPasswordModal} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <LockIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Admin Verification</h2>
                  <p className="text-sm text-gray-500">Required for this action</p>
                </div>
              </div>
              <button onClick={closeAdminPasswordModal} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <ShieldCheckIcon className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  This action requires admin verification.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
                <input
                type="password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter admin password..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

                {passwordError && <p className="text-sm text-red-600 mt-1">{passwordError}</p>}
              </div>
              <p className="text-xs text-gray-400">Hint: Use "admin123" for demo purposes</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={closeAdminPasswordModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleAdminPasswordSubmit} disabled={!adminPassword}>
                <CheckIcon className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Document Checklist Modal */}
      {showDocumentChecklistModal && selectedEmployee &&
      <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowDocumentChecklistModal(false)} />

          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ListIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Document Checklist</h2>
                  <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                </div>
              </div>
              <button
              onClick={() => setShowDocumentChecklistModal(false)}
              className="text-gray-400 hover:text-gray-600">

                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Progress */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm text-gray-500">
                    {stats.uploaded} of {stats.required} required documents uploaded
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.uploaded / stats.required * 100}%` }} />

                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {documentCategories.map((category) => {
                const status = getChecklistStatus(category.value);
                return (
                  <div
                    key={category.value}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                    status === 'verified' ?
                    'bg-green-50 border-green-200' :
                    status === 'pending' ?
                    'bg-amber-50 border-amber-200' :
                    status === 'rejected' ?
                    'bg-red-50 border-red-200' :
                    'bg-gray-50 border-gray-200'}`
                    }>

                      <div className="flex items-center gap-3">
                        {status === 'verified' ?
                      <CheckCircle2Icon className="w-5 h-5 text-green-600" /> :
                      status === 'pending' ?
                      <ClockIcon className="w-5 h-5 text-amber-600" /> :
                      status === 'rejected' ?
                      <XCircleIcon className="w-5 h-5 text-red-600" /> :

                      <CircleIcon className="w-5 h-5 text-gray-400" />
                      }
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {category.label}
                            {category.required &&
                          <span className="text-red-500 ml-1">*</span>
                          }
                          </p>
                          <p className="text-xs text-gray-500">{category.description}</p>
                        </div>
                      </div>
                      <Badge
                      variant={
                      status === 'verified' ?
                      'success' :
                      status === 'pending' ?
                      'warning' :
                      status === 'rejected' ?
                      'danger' :
                      'default'
                      }>

                        {status === 'not_uploaded' ?
                      'Not Uploaded' :
                      status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </div>);

              })}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <Button variant="outline" onClick={() => setShowDocumentChecklistModal(false)}>
                Close
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                setShowDocumentChecklistModal(false);
                fileInputRef.current?.click();
              }}>

                <UploadIcon className="w-4 h-4 mr-2" />
                Upload Missing Documents
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}