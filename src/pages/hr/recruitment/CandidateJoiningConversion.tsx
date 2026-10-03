import React, { useState, useMemo, useCallback } from 'react';
import {
  Building,
  X,
  UserCheck,
  CheckCircle,
  AlertCircle,
  FileText,
  Briefcase,
  DollarSign,
  BookOpen,
  Bell,
  ArrowRight,
  Clock,
  Shield,
  Search,
  Edit,
  Trash2,
  Eye,
  Save,
  Send,
  Download,
  Upload,
  RefreshCw,
  Copy,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Printer,
  RotateCcw,
  History,
  User,
  Calendar,
  MapPin,
  Award,
  GraduationCap,
  CreditCard,
  Building2,
  Users,
  FileCheck,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Paperclip,
  File,
  ExternalLink,
  Settings,
  Check,
  AlertTriangle,
  Undo } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';

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
{ value: 'Mathematics', label: 'Mathematics' },
{ value: 'Science', label: 'Science' },
{ value: 'English', label: 'English' },
{ value: 'Computer Science', label: 'Computer Science' },
{ value: 'Administration', label: 'Administration' },
{ value: 'Physical Education', label: 'Physical Education' }];


const SALARY_STRUCTURES = [
{ value: 'Grade A - Teacher', label: 'Grade A - Teacher (₹50,000 - ₹75,000)' },
{ value: 'Grade B - Teacher', label: 'Grade B - Teacher (₹40,000 - ₹55,000)' },
{ value: 'Grade C - Teacher', label: 'Grade C - Teacher (₹30,000 - ₹45,000)' },
{ value: 'Admin Grade 1', label: 'Admin Grade 1 (₹35,000 - ₹50,000)' },
{ value: 'Admin Grade 2', label: 'Admin Grade 2 (₹25,000 - ₹40,000)' },
{ value: 'HOD Grade', label: 'HOD Grade (₹80,000 - ₹120,000)' }];


const PROBATION_PERIODS = [
{ value: '3', label: '3 months' },
{ value: '6', label: '6 months' },
{ value: '9', label: '9 months' },
{ value: '12', label: '12 months' }];


const REPORTING_MANAGERS = [
{ value: 'Dr. Amit Shah', label: 'Dr. Amit Shah - Principal' },
{ value: 'Mrs. Sunita Reddy', label: 'Mrs. Sunita Reddy - Vice Principal' },
{ value: 'Mr. Rajan Gupta', label: 'Mr. Rajan Gupta - HOD Math' },
{ value: 'Mr. Vikram Mehta', label: 'Mr. Vikram Mehta - HOD Science' },
{ value: 'Ms. Priya Nair', label: 'Ms. Priya Nair - HOD English' },
{ value: 'Mrs. Kavita Sharma', label: 'Mrs. Kavita Sharma - HR Manager' }];


interface ChecklistItem {
  id: string;
  label: string;
  category: string;
  completed: boolean;
  required: boolean;
  document?: {
    name: string;
    uploadedAt: string;
    size: string;
  };
  notes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface Candidate {
  id: string;
  applicationId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  status: 'Offer Accepted' | 'Pending Joining' | 'Converted' | 'Declined';
  offerDate: string;
  expectedJoiningDate?: string;
  branch: string;
  interviewScore: number;
  avatar: string;
}

interface ConvertedEmployee {
  id: string;
  candidateId: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  position: string;
  reportingManager: string;
  salaryStructure: string;
  joiningDate: string;
  probationPeriod: number;
  probationEndDate: string;
  branch: string;
  bankDetails: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  convertedAt: string;
  convertedBy: string;
  status: 'Active' | 'Probation' | 'Confirmed' | 'Terminated';
  notificationsSent: string[];
}

interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const initialCandidates: Candidate[] = [
{
  id: 'CAND-001',
  applicationId: 'APP-2024-001',
  name: 'Priya Sharma',
  email: 'priya.sharma@email.com',
  phone: '+91 9876543210',
  position: 'Math Teacher',
  department: 'Mathematics',
  status: 'Offer Accepted',
  offerDate: '2024-12-10',
  expectedJoiningDate: '2025-01-02',
  branch: 'main',
  interviewScore: 85,
  avatar: 'PS'
},
{
  id: 'CAND-002',
  applicationId: 'APP-2024-002',
  name: 'Rahul Verma',
  email: 'rahul.verma@email.com',
  phone: '+91 9876543211',
  position: 'Science HOD',
  department: 'Science',
  status: 'Offer Accepted',
  offerDate: '2024-12-08',
  expectedJoiningDate: '2025-01-15',
  branch: 'main',
  interviewScore: 92,
  avatar: 'RV'
},
{
  id: 'CAND-003',
  applicationId: 'APP-2024-003',
  name: 'Anita Desai',
  email: 'anita.desai@email.com',
  phone: '+91 9876543212',
  position: 'English Teacher',
  department: 'English',
  status: 'Pending Joining',
  offerDate: '2024-12-05',
  branch: 'north',
  interviewScore: 78,
  avatar: 'AD'
},
{
  id: 'CAND-004',
  applicationId: 'APP-2024-004',
  name: 'Suresh Kumar',
  email: 'suresh.kumar@email.com',
  phone: '+91 9876543213',
  position: 'PE Teacher',
  department: 'Physical Education',
  status: 'Offer Accepted',
  offerDate: '2024-12-12',
  branch: 'south',
  interviewScore: 80,
  avatar: 'SK'
},
{
  id: 'CAND-005',
  applicationId: 'APP-2024-005',
  name: 'Meera Patel',
  email: 'meera.patel@email.com',
  phone: '+91 9876543214',
  position: 'CS Teacher',
  department: 'Computer Science',
  status: 'Converted',
  offerDate: '2024-11-20',
  branch: 'east',
  interviewScore: 88,
  avatar: 'MP'
}];


const initialChecklist: ChecklistItem[] = [
{
  id: '1',
  label: 'Original Degree Certificate',
  category: 'Document Verification',
  completed: true,
  required: true,
  document: { name: 'degree_certificate.pdf', uploadedAt: '2024-12-11', size: '2.5 MB' },
  verifiedBy: 'HR Manager',
  verifiedAt: '2024-12-11'
},
{
  id: '2',
  label: 'B.Ed / Teaching Certificate',
  category: 'Document Verification',
  completed: true,
  required: true,
  document: { name: 'bed_certificate.pdf', uploadedAt: '2024-12-11', size: '1.8 MB' },
  verifiedBy: 'HR Manager',
  verifiedAt: '2024-12-11'
},
{
  id: '3',
  label: 'Previous Employment Certificate',
  category: 'Document Verification',
  completed: false,
  required: true
},
{
  id: '4',
  label: 'Address Proof (Aadhar/Passport)',
  category: 'Document Verification',
  completed: true,
  required: true,
  document: { name: 'aadhar_card.pdf', uploadedAt: '2024-12-10', size: '0.5 MB' }
},
{
  id: '5',
  label: 'PAN Card',
  category: 'Document Verification',
  completed: true,
  required: true,
  document: { name: 'pan_card.pdf', uploadedAt: '2024-12-10', size: '0.3 MB' }
},
{
  id: '6',
  label: 'Passport Size Photographs (4)',
  category: 'Document Verification',
  completed: true,
  required: true
},
{
  id: '7',
  label: 'Qualification Verification Complete',
  category: 'Qualification Verification',
  completed: true,
  required: true,
  verifiedBy: 'Academic Coordinator',
  verifiedAt: '2024-12-12'
},
{
  id: '8',
  label: 'Previous Employer Reference Check',
  category: 'Qualification Verification',
  completed: false,
  required: true,
  notes: 'Waiting for response from previous employer'
},
{
  id: '9',
  label: 'Background Check Initiated',
  category: 'Background Check',
  completed: true,
  required: true,
  verifiedBy: 'Security Team',
  verifiedAt: '2024-12-10'
},
{
  id: '10',
  label: 'Background Check Cleared',
  category: 'Background Check',
  completed: false,
  required: true,
  notes: 'In progress - Expected completion by Dec 20'
},
{
  id: '11',
  label: 'Medical Certificate Submitted',
  category: 'Medical Check',
  completed: false,
  required: false
},
{
  id: '12',
  label: 'Medical Fitness Verified',
  category: 'Medical Check',
  completed: false,
  required: false
},
{
  id: '13',
  label: 'Police Verification Initiated',
  category: 'Background Check',
  completed: true,
  required: false
},
{
  id: '14',
  label: 'Police Verification Cleared',
  category: 'Background Check',
  completed: false,
  required: false
}];


const initialConvertedEmployees: ConvertedEmployee[] = [
{
  id: 'CONV-001',
  candidateId: 'CAND-005',
  employeeId: 'EMP-2024-105',
  name: 'Meera Patel',
  email: 'meera.patel@school.edu',
  phone: '+91 9876543214',
  department: 'Computer Science',
  subject: 'Computer Science',
  position: 'CS Teacher',
  reportingManager: 'Mr. Deepak Verma',
  salaryStructure: 'Grade A - Teacher',
  joiningDate: '2024-12-01',
  probationPeriod: 6,
  probationEndDate: '2025-06-01',
  branch: 'east',
  bankDetails: {
    bankName: 'HDFC Bank',
    accountNumber: '50100XXXXXXXX',
    ifscCode: 'HDFC0001234',
    accountHolderName: 'Meera Patel'
  },
  convertedAt: '2024-11-28',
  convertedBy: 'HR Manager',
  status: 'Probation',
  notificationsSent: ['Employee Profile Created', 'Payroll Module Notified', 'IT Access Provisioned']
}];


interface FormState {
  candidateId: string;
  employeeId: string;
  department: string;
  subject: string;
  reportingManager: string;
  salaryStructure: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  probationPeriod: string;
  joiningDate: string;
  workEmail: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
}

export function CandidateJoiningConversion() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [convertedEmployees, setConvertedEmployees] = useState<ConvertedEmployee[]>(initialConvertedEmployees);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [converted, setConverted] = useState(false);
  const [convertedEmployee, setConvertedEmployee] = useState<ConvertedEmployee | null>(null);

  // Modal states
  const [showCandidateListModal, setShowCandidateListModal] = useState(false);
  const [showConversionHistoryModal, setShowConversionHistoryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [showAddChecklistItemModal, setShowAddChecklistItemModal] = useState(false);
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
  const [showNotificationSettingsModal, setShowNotificationSettingsModal] = useState(false);
  const [showUndoConversionModal, setShowUndoConversionModal] = useState(false);
  const [showChecklistNoteModal, setShowChecklistNoteModal] = useState(false);

  const [selectedChecklistItem, setSelectedChecklistItem] = useState<ChecklistItem | null>(null);
  const [checklistNote, setChecklistNote] = useState('');
  const [searchCandidate, setSearchCandidate] = useState('');

  const [newChecklistItem, setNewChecklistItem] = useState({
    label: '',
    category: 'Document Verification',
    required: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    createEmployeeProfile: true,
    notifyPayroll: true,
    notifyAcademic: true,
    provisionITAccess: true,
    sendWelcomeEmail: true,
    sendWelcomeSMS: true,
    notifyReportingManager: true,
    addToDirectory: true
  });

  const [form, setForm] = useState<FormState>({
    candidateId: '',
    employeeId: '',
    department: '',
    subject: '',
    reportingManager: '',
    salaryStructure: 'Grade A - Teacher',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    probationPeriod: '6',
    joiningDate: '',
    workEmail: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    notes: ''
  });

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

  const generateEmployeeId = () => {
    const year = new Date().getFullYear();
    const count = convertedEmployees.length + 1;
    return `EMP-${year}-${String(count).padStart(3, '0')}`;
  };

  const generateWorkEmail = (name: string) => {
    const nameParts = name.toLowerCase().split(' ');
    return `${nameParts[0]}.${nameParts[nameParts.length - 1]}@school.edu`;
  };

  const selectCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setConverted(false);
    setConvertedEmployee(null);
    setChecklist(initialChecklist);

    const employeeId = generateEmployeeId();
    const workEmail = generateWorkEmail(candidate.name);

    setForm({
      candidateId: candidate.id,
      employeeId,
      department: candidate.department,
      subject: candidate.department,
      reportingManager: '',
      salaryStructure: 'Grade A - Teacher',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: candidate.name,
      probationPeriod: '6',
      joiningDate: candidate.expectedJoiningDate || '',
      workEmail,
      emergencyContactName: '',
      emergencyContactPhone: '',
      notes: ''
    });

    setShowCandidateListModal(false);
    addActivityLog('info', 'Candidate Selected', `Selected ${candidate.name} for joining process`);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
    prev.map((item) =>
    item.id === id ?
    {
      ...item,
      completed: !item.completed,
      verifiedAt: !item.completed ? new Date().toISOString().split('T')[0] : undefined,
      verifiedBy: !item.completed ? 'Current User' : undefined
    } :
    item
    )
    );

    const item = checklist.find((i) => i.id === id);
    if (item) {
      addActivityLog(
        'info',
        item.completed ? 'Checklist Item Unchecked' : 'Checklist Item Checked',
        item.label
      );
    }
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.label.trim()) {
      alert('Please enter a label for the checklist item');
      return;
    }

    const newItem: ChecklistItem = {
      id: `custom-${Date.now()}`,
      label: newChecklistItem.label.trim(),
      category: newChecklistItem.category,
      required: newChecklistItem.required,
      completed: false
    };

    setChecklist((prev) => [...prev, newItem]);
    setNewChecklistItem({ label: '', category: 'Document Verification', required: false });
    setShowAddChecklistItemModal(false);
    addActivityLog('info', 'Checklist Item Added', newItem.label);
  };

  const removeChecklistItem = (id: string) => {
    if (!id.startsWith('custom-')) {
      alert('Cannot remove default checklist items');
      return;
    }

    if (window.confirm('Are you sure you want to remove this checklist item?')) {
      const item = checklist.find((i) => i.id === id);
      setChecklist((prev) => prev.filter((i) => i.id !== id));
      if (item) {
        addActivityLog('warning', 'Checklist Item Removed', item.label);
      }
    }
  };

  const uploadDocument = (itemId: string, fileName: string) => {
    setChecklist((prev) =>
    prev.map((item) =>
    item.id === itemId ?
    {
      ...item,
      document: {
        name: fileName,
        uploadedAt: new Date().toISOString().split('T')[0],
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`
      }
    } :
    item
    )
    );

    const item = checklist.find((i) => i.id === itemId);
    if (item) {
      addActivityLog('success', 'Document Uploaded', `${fileName} for ${item.label}`);
    }
    setShowDocumentUploadModal(false);
    setSelectedChecklistItem(null);
  };

  const removeDocument = (itemId: string) => {
    setChecklist((prev) =>
    prev.map((item) => item.id === itemId ? { ...item, document: undefined } : item)
    );
  };

  const addChecklistNote = () => {
    if (!selectedChecklistItem || !checklistNote.trim()) return;

    setChecklist((prev) =>
    prev.map((item) =>
    item.id === selectedChecklistItem.id ?
    { ...item, notes: checklistNote.trim() } :
    item
    )
    );

    addActivityLog('info', 'Note Added', `Note added to ${selectedChecklistItem.label}`);
    setShowChecklistNoteModal(false);
    setSelectedChecklistItem(null);
    setChecklistNote('');
  };

  const openChecklistNoteModal = (item: ChecklistItem) => {
    setSelectedChecklistItem(item);
    setChecklistNote(item.notes || '');
    setShowChecklistNoteModal(true);
  };

  const openDocumentUploadModal = (item: ChecklistItem) => {
    setSelectedChecklistItem(item);
    setShowDocumentUploadModal(true);
  };

  const addActivityLog = (
  type: ActivityLog['type'],
  action: string,
  details?: string) =>
  {
    const log: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      performedBy: 'Current User',
      timestamp: new Date().toLocaleString(),
      details,
      type
    };
    setActivityLog((prev) => [log, ...prev]);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!selectedCandidate) errors.push('Please select a candidate');
    if (!form.joiningDate) errors.push('Please enter joining date');
    if (!form.department) errors.push('Please select department');
    if (!form.reportingManager) errors.push('Please select reporting manager');
    if (!form.salaryStructure) errors.push('Please select salary structure');

    // Validate bank details
    if (form.bankName && (!form.accountNumber || !form.ifscCode)) {
      errors.push('Please complete all bank details');
    }

    if (form.accountNumber && form.accountNumber.length < 9) {
      errors.push('Invalid account number');
    }

    if (form.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase())) {
      errors.push('Invalid IFSC code format');
    }

    return errors;
  };

  const validateChecklist = (): boolean => {
    const requiredItems = checklist.filter((i) => i.required);
    const completedRequired = requiredItems.filter((i) => i.completed);
    return completedRequired.length === requiredItems.length;
  };

  const completedRequired = checklist.filter((i) => i.required && i.completed).length;
  const totalRequired = checklist.filter((i) => i.required).length;
  const canConvert = completedRequired === totalRequired;

  const categories = [...new Set(checklist.map((i) => i.category))];

  const previewConversion = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    if (!validateChecklist()) {
      alert('Please complete all required checklist items before conversion');
      return;
    }

    setShowPreviewModal(true);
  };

  const confirmConversion = () => {
    setShowPreviewModal(false);
    setShowConfirmationModal(true);
  };

  const executeConversion = () => {
    if (!selectedCandidate) return;

    const joiningDate = new Date(form.joiningDate);
    const probationMonths = parseInt(form.probationPeriod);
    const probationEndDate = new Date(joiningDate);
    probationEndDate.setMonth(probationEndDate.getMonth() + probationMonths);

    const employee: ConvertedEmployee = {
      id: `CONV-${Date.now()}`,
      candidateId: selectedCandidate.id,
      employeeId: form.employeeId,
      name: selectedCandidate.name,
      email: form.workEmail,
      phone: selectedCandidate.phone,
      department: form.department,
      subject: form.subject,
      position: selectedCandidate.position,
      reportingManager: form.reportingManager,
      salaryStructure: form.salaryStructure,
      joiningDate: form.joiningDate,
      probationPeriod: probationMonths,
      probationEndDate: probationEndDate.toISOString().split('T')[0],
      branch: selectedCandidate.branch,
      bankDetails: {
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode.toUpperCase(),
        accountHolderName: form.accountHolderName
      },
      convertedAt: new Date().toISOString().split('T')[0],
      convertedBy: 'Current User',
      status: 'Probation',
      notificationsSent: []
    };

    // Send notifications based on settings
    const sentNotifications: string[] = [];
    if (notificationSettings.createEmployeeProfile) sentNotifications.push('Employee Profile Created');
    if (notificationSettings.notifyPayroll) sentNotifications.push('Payroll Module Notified');
    if (notificationSettings.notifyAcademic) sentNotifications.push('Academic Module Notified');
    if (notificationSettings.provisionITAccess) sentNotifications.push('IT Access Provisioned');
    if (notificationSettings.sendWelcomeEmail) sentNotifications.push('Welcome Email Sent');
    if (notificationSettings.sendWelcomeSMS) sentNotifications.push('Welcome SMS Sent');
    if (notificationSettings.notifyReportingManager) sentNotifications.push('Reporting Manager Notified');
    if (notificationSettings.addToDirectory) sentNotifications.push('Added to Employee Directory');

    employee.notificationsSent = sentNotifications;

    // Update state
    setConvertedEmployees((prev) => [...prev, employee]);
    setCandidates((prev) =>
    prev.map((c) => c.id === selectedCandidate.id ? { ...c, status: 'Converted' as const } : c)
    );
    setConvertedEmployee(employee);
    setConverted(true);
    setShowConfirmationModal(false);

    addActivityLog('success', 'Conversion Successful', `${selectedCandidate.name} converted to ${employee.employeeId}`);
  };

  const undoConversion = () => {
    if (!convertedEmployee) return;

    // Remove from converted employees
    setConvertedEmployees((prev) => prev.filter((e) => e.id !== convertedEmployee.id));

    // Restore candidate status
    setCandidates((prev) =>
    prev.map((c) =>
    c.id === convertedEmployee.candidateId ? { ...c, status: 'Offer Accepted' as const } : c
    )
    );

    addActivityLog('warning', 'Conversion Undone', `${convertedEmployee.name} reverted to candidate`);

    setConverted(false);
    setConvertedEmployee(null);
    setShowUndoConversionModal(false);
  };

  const resetForm = () => {
    setSelectedCandidate(null);
    setConverted(false);
    setConvertedEmployee(null);
    setChecklist(initialChecklist);
    setForm({
      candidateId: '',
      employeeId: '',
      department: '',
      subject: '',
      reportingManager: '',
      salaryStructure: 'Grade A - Teacher',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      probationPeriod: '6',
      joiningDate: '',
      workEmail: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      notes: ''
    });
  };

  const printJoiningLetter = () => {
    if (!selectedCandidate || !converted || !convertedEmployee) return;

    const printContent = `
      <html>
        <head>
          <title>Joining Letter - ${convertedEmployee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #0d9488; }
            .date { text-align: right; margin-bottom: 20px; }
            .content { line-height: 1.8; }
            .signature { margin-top: 60px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">School Name</div>
            <p>Excellence in Education</p>
          </div>
          <div class="date">Date: ${new Date().toLocaleDateString()}</div>
          <div class="content">
            <p><strong>To,</strong></p>
            <p>${convertedEmployee.name}</p>
            <p>${convertedEmployee.email}</p>
            <br/>
            <p><strong>Subject: Appointment Letter</strong></p>
            <br/>
            <p>Dear ${convertedEmployee.name.split(' ')[0]},</p>
            <p>We are pleased to inform you that you have been appointed as <strong>${convertedEmployee.position}</strong> in our organization.</p>
            
            <table>
              <tr><th>Employee ID</th><td>${convertedEmployee.employeeId}</td></tr>
              <tr><th>Department</th><td>${convertedEmployee.department}</td></tr>
              <tr><th>Reporting To</th><td>${convertedEmployee.reportingManager}</td></tr>
              <tr><th>Date of Joining</th><td>${convertedEmployee.joiningDate}</td></tr>
              <tr><th>Probation Period</th><td>${convertedEmployee.probationPeriod} months</td></tr>
              <tr><th>Salary Grade</th><td>${convertedEmployee.salaryStructure}</td></tr>
            </table>
            
            <p>Please report to the HR department on your joining date with all original documents.</p>
            <p>We welcome you to our team and wish you a successful career with us.</p>
            
            <div class="signature">
              <p>Best Regards,</p>
              <br/><br/>
              <p><strong>HR Manager</strong></p>
              <p>School Name</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const sendReminderToCandidate = () => {
    if (!selectedCandidate) return;

    alert(`Reminder sent to ${selectedCandidate.name} at ${selectedCandidate.email}`);
    addActivityLog('info', 'Reminder Sent', `Reminder email sent to ${selectedCandidate.name}`);
  };

  const filteredCandidates = useMemo(() => {
    let result = candidates.filter(
      (c) => c.status === 'Offer Accepted' || c.status === 'Pending Joining'
    );

    const activeBranches = selectedBranches.includes('all') ?
    ['main', 'north', 'south', 'east'] :
    selectedBranches;

    result = result.filter((c) => activeBranches.includes(c.branch));

    if (searchCandidate) {
      result = result.filter(
        (c) =>
        c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.applicationId.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.position.toLowerCase().includes(searchCandidate.toLowerCase())
      );
    }

    return result;
  }, [candidates, selectedBranches, searchCandidate]);

  const pendingCandidatesCount = candidates.filter(
    (c) => c.status === 'Offer Accepted' || c.status === 'Pending Joining'
  ).length;

  const exportChecklistReport = () => {
    if (!selectedCandidate) return;

    const report = {
      candidate: selectedCandidate,
      checklist: checklist,
      completionStatus: `${completedRequired}/${totalRequired} required items completed`,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `checklist_report_${selectedCandidate.applicationId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Joining & Conversion</h1>
              <p className="text-sm text-gray-500">Convert selected candidate to employee profile</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-36" />

            <Button variant="outline" size="sm" onClick={() => setShowCandidateListModal(true)}>
              <Users className="w-4 h-4 mr-1" />
              Select Candidate ({pendingCandidatesCount})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowConversionHistoryModal(true)}>
              <History className="w-4 h-4 mr-1" />
              History ({convertedEmployees.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowActivityLogModal(true)}>
              <FileText className="w-4 h-4 mr-1" />
              Activity Log
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branch:</span>
          {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ?
            'bg-teal-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }>

              {branch.name}
              {selectedBranches.includes(branch.id) &&
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

      {/* No Candidate Selected */}
      {!selectedCandidate &&
      <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Candidate Selected</h3>
          <p className="text-gray-400 mb-4">Select a candidate to begin the joining process</p>
          <Button variant="primary" onClick={() => setShowCandidateListModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Select Candidate
          </Button>
        </Card>
      }

      {/* Conversion Success Banner */}
      {converted && convertedEmployee &&
      <div className="p-5 bg-green-50 border border-green-300 rounded-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">Conversion Successful!</h3>
                <p className="text-sm text-green-700">
                  {convertedEmployee.name} has been converted to Employee ID:{' '}
                  <strong>{convertedEmployee.employeeId}</strong>
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {convertedEmployee.notificationsSent.map((notification, i) =>
                <span
                  key={i}
                  className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">

                      <Check className="w-3 h-3" />
                      {notification}
                    </span>
                )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={printJoiningLetter}>
                <Printer className="w-4 h-4 mr-1" />
                Print Letter
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowUndoConversionModal(true)}>
                <Undo className="w-4 h-4 mr-1" />
                Undo
              </Button>
              <Button variant="primary" size="sm" onClick={resetForm}>
                <Plus className="w-4 h-4 mr-1" />
                New Conversion
              </Button>
            </div>
          </div>
        </div>
      }

      {selectedCandidate && !converted &&
      <>
          {/* Progress Bar */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Pre-Joining Checklist Progress</h3>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${canConvert ? 'text-green-600' : 'text-orange-600'}`}>
                  {completedRequired}/{totalRequired} Required Items Complete
                </span>
                <Button variant="outline" size="sm" onClick={exportChecklistReport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
              className={`h-full rounded-full transition-all duration-500 ${
              canConvert ? 'bg-green-500' : 'bg-orange-500'}`
              }
              style={{ width: `${completedRequired / totalRequired * 100}%` }} />

            </div>
            {!canConvert &&
          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Complete all required items before converting to employee
              </p>
          }
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Candidate Info */}
              <Card title="Candidate Information">
                <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-xl border border-teal-200 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {selectedCandidate.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{selectedCandidate.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedCandidate.position} · {selectedCandidate.status} ·{' '}
                      {BRANCHES.find((b) => b.id === selectedCandidate.branch)?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Application ID: {selectedCandidate.applicationId} · Offer Date:{' '}
                      {selectedCandidate.offerDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={sendReminderToCandidate}>
                      <Bell className="w-4 h-4 mr-1" />
                      Send Reminder
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowCandidateListModal(true)}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedCandidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>Interview Score: {selectedCandidate.interviewScore}%</span>
                  </div>
                </div>
              </Card>

              {/* Pre-Joining Checklist */}
              <Card
              title="Pre-Joining Checklist"
              action={
              <Button variant="outline" size="sm" onClick={() => setShowAddChecklistItemModal(true)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
              }>

                <div className="space-y-5">
                  {categories.map((category) =>
                <div key={category}>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-teal-600" />
                        {category}
                      </h4>
                      <div className="space-y-2 ml-6">
                        {checklist.
                    filter((i) => i.category === category).
                    map((item) =>
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      item.completed ?
                      'bg-green-50 border border-green-200' :
                      'bg-gray-50 border border-gray-200'}`
                      }>

                              <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="rounded text-teal-600" />

                              <span
                        className={`text-sm flex-1 ${
                        item.completed ? 'text-green-800 line-through' : 'text-gray-700'}`
                        }>

                                {item.label}
                              </span>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-1">
                                {item.document ?
                        <button
                          onClick={() => removeDocument(item.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Remove document">

                                    <Paperclip className="w-4 h-4 text-green-500" />
                                  </button> :

                        <button
                          onClick={() => openDocumentUploadModal(item)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Upload document">

                                    <Upload className="w-4 h-4 text-gray-400" />
                                  </button>
                        }
                                <button
                          onClick={() => openChecklistNoteModal(item)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Add note">

                                  <MessageSquare
                            className={`w-4 h-4 ${item.notes ? 'text-blue-500' : 'text-gray-400'}`} />

                                </button>
                                {item.id.startsWith('custom-') &&
                        <button
                          onClick={() => removeChecklistItem(item.id)}
                          className="p-1 hover:bg-red-50 rounded"
                          title="Remove item">

                                    <Trash2 className="w-4 h-4 text-red-400" />
                                  </button>
                        }
                              </div>

                              {item.required &&
                      <span className="text-xs text-red-500 font-medium flex-shrink-0">Required</span>
                      }
                              {item.completed && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                            </div>
                    )}
                      </div>
                    </div>
                )}
                </div>
              </Card>

              {/* Joining Details */}
              <Card title="Joining Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee ID (Auto-Generated)
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="font-mono text-sm font-bold text-teal-700">{form.employeeId}</span>
                      <span className="text-xs text-gray-400 ml-auto">Auto-generated</span>
                      <button
                      onClick={() => {
                        const newId = generateEmployeeId();
                        setForm((f) => ({ ...f, employeeId: newId }));
                      }}
                      className="p-1 hover:bg-gray-200 rounded">

                        <RefreshCw className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
                    <input
                    type="date"
                    value={form.joiningDate}
                    onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <Select
                  label="Department Allocation *"
                  options={DEPARTMENTS}
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Allocation</label>
                    <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <Select
                  label="Reporting Manager *"
                  options={[{ value: '', label: 'Select Manager' }, ...REPORTING_MANAGERS]}
                  value={form.reportingManager}
                  onChange={(e) => setForm((f) => ({ ...f, reportingManager: e.target.value }))} />

                  <Select
                  label="Salary Structure Mapping *"
                  options={SALARY_STRUCTURES}
                  value={form.salaryStructure}
                  onChange={(e) => setForm((f) => ({ ...f, salaryStructure: e.target.value }))} />

                  <Select
                  label="Probation Period"
                  options={PROBATION_PERIODS}
                  value={form.probationPeriod}
                  onChange={(e) => setForm((f) => ({ ...f, probationPeriod: e.target.value }))} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                    <input
                    type="email"
                    value={form.workEmail}
                    onChange={(e) => setForm((f) => ({ ...f, workEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                </div>
              </Card>

              {/* Bank Details */}
              <Card title="Bank Details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                    type="text"
                    value={form.bankName}
                    onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                    placeholder="e.g. SBI, HDFC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                    <input
                    type="text"
                    value={form.accountHolderName}
                    onChange={(e) => setForm((f) => ({ ...f, accountHolderName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                    type="text"
                    value={form.accountNumber}
                    onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                    type="text"
                    value={form.ifscCode}
                    onChange={(e) => setForm((f) => ({ ...f, ifscCode: e.target.value.toUpperCase() }))}
                    placeholder="e.g. SBIN0001234"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                </div>
              </Card>

              {/* Emergency Contact */}
              <Card title="Emergency Contact (Optional)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                    <input
                    type="text"
                    value={form.emergencyContactName}
                    onChange={(e) => setForm((f) => ({ ...f, emergencyContactName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                    type="tel"
                    value={form.emergencyContactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, emergencyContactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  </div>
                </div>
              </Card>

              {/* Notes */}
              <Card title="Additional Notes">
                <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                placeholder="Any additional notes or special instructions..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500" />

              </Card>

              {/* Convert Button */}
              <div
              className={`p-5 rounded-xl border-2 ${
              canConvert ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-gray-50'}`
              }>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-bold ${canConvert ? 'text-teal-800' : 'text-gray-500'}`}>
                      {canConvert ? 'Ready to Convert to Employee' : 'Complete checklist to enable conversion'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      This will auto-create employee profile, notify payroll and academic modules
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNotificationSettingsModal(true)}>
                      <Settings className="w-4 h-4 mr-1" />
                      Settings
                    </Button>
                    <Button variant="outline" onClick={previewConversion} disabled={!canConvert}>
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                    variant="primary"
                    disabled={!canConvert}
                    onClick={previewConversion}
                    className={canConvert ? 'bg-teal-600 hover:bg-teal-700' : ''}>

                      <UserCheck className="w-4 h-4 mr-2" />
                      Convert to Employee
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <Card title="Auto Notifications">
                <div className="space-y-3">
                  {[
                { key: 'createEmployeeProfile', label: 'Employee Profile Created', icon: UserCheck, color: 'teal' },
                { key: 'notifyPayroll', label: 'Payroll Module Notified', icon: DollarSign, color: 'green' },
                { key: 'notifyAcademic', label: 'Academic Module Notified', icon: BookOpen, color: 'blue' },
                { key: 'provisionITAccess', label: 'IT Access Provisioned', icon: Shield, color: 'purple' },
                { key: 'sendWelcomeEmail', label: 'Welcome Email Sent', icon: Mail, color: 'orange' },
                { key: 'sendWelcomeSMS', label: 'Welcome SMS Sent', icon: MessageSquare, color: 'green' },
                { key: 'notifyReportingManager', label: 'Manager Notified', icon: Users, color: 'blue' },
                { key: 'addToDirectory', label: 'Added to Directory', icon: Building2, color: 'gray' }].
                map((item) =>
                <div key={item.key} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`p-1.5 bg-${item.color}-100 rounded`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                      </div>
                      <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                      <span
                    className={`text-xs ${
                    notificationSettings[item.key as keyof typeof notificationSettings] ?
                    'text-green-600' :
                    'text-gray-400'}`
                    }>

                        {notificationSettings[item.key as keyof typeof notificationSettings] ? '✓ Enabled' : 'Disabled'}
                      </span>
                    </div>
                )}
                </div>
              </Card>

              <Card title="Conversion Summary">
                <div className="space-y-3 text-sm">
                  {[
                { label: 'Candidate', value: selectedCandidate?.name || '-' },
                { label: 'New Employee ID', value: form.employeeId },
                { label: 'Department', value: form.department || '-' },
                { label: 'Joining Date', value: form.joiningDate || '-' },
                { label: 'Reporting To', value: form.reportingManager || '-' },
                { label: 'Probation', value: `${form.probationPeriod} months` },
                { label: 'Salary Grade', value: form.salaryStructure },
                { label: 'Work Email', value: form.workEmail || '-' }].
                map((item) =>
                <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-medium text-gray-900 text-right max-w-32 truncate">{item.value}</span>
                    </div>
                )}
                </div>
              </Card>

              <Card title="Documents Status">
                <div className="space-y-2">
                  {checklist.
                filter((i) => i.document).
                slice(0, 5).
                map((item) =>
                <div key={item.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                        <FileCheck className="w-4 h-4 text-green-500" />
                        <span className="flex-1 truncate">{item.document?.name}</span>
                        <span className="text-xs text-gray-400">{item.document?.size}</span>
                      </div>
                )}
                  {checklist.filter((i) => i.document).length === 0 &&
                <p className="text-sm text-gray-400 text-center py-4">No documents uploaded</p>
                }
                </div>
              </Card>
            </div>
          </div>
        </>
      }

      {/* Candidate List Modal */}
      {showCandidateListModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Candidate for Joining</h2>
              <button onClick={() => setShowCandidateListModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search candidates..."
                value={searchCandidate}
                onChange={(e) => setSearchCandidate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
              {filteredCandidates.length === 0 ?
            <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No candidates available for joining</p>
                </div> :

            <div className="space-y-3">
                  {filteredCandidates.map((candidate) =>
              <div
                key={candidate.id}
                onClick={() => selectCandidate(candidate)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedCandidate?.id === candidate.id ? 'border-teal-500 bg-teal-50' : ''}`
                }>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center text-lg font-bold">
                          {candidate.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">{candidate.position}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span>{candidate.applicationId}</span>
                            <span>Offer: {candidate.offerDate}</span>
                            <span>{BRANCHES.find((b) => b.id === candidate.branch)?.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                      className={`text-xs px-2 py-1 rounded-full ${
                      candidate.status === 'Offer Accepted' ?
                      'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'}`
                      }>

                            {candidate.status}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">Score: {candidate.interviewScore}%</p>
                        </div>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Conversion History Modal */}
      {showConversionHistoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Conversion History</h2>
              <button onClick={() => setShowConversionHistoryModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {convertedEmployees.length === 0 ?
            <div className="text-center py-12 text-gray-400">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No conversions yet</p>
                </div> :

            <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Employee</th>
                      <th className="text-left py-2 px-3">Employee ID</th>
                      <th className="text-left py-2 px-3">Department</th>
                      <th className="text-center py-2 px-3">Joining Date</th>
                      <th className="text-center py-2 px-3">Status</th>
                      <th className="text-center py-2 px-3">Converted On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convertedEmployees.map((emp) =>
                <tr key={emp.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <p className="font-medium">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.position}</p>
                        </td>
                        <td className="py-3 px-3 font-mono text-teal-600">{emp.employeeId}</td>
                        <td className="py-3 px-3">{emp.department}</td>
                        <td className="py-3 px-3 text-center">{emp.joiningDate}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                      emp.status === 'Probation' ?
                      'bg-yellow-100 text-yellow-700' :
                      emp.status === 'Confirmed' ?
                      'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'}`
                      }>

                            {emp.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center text-gray-500">{emp.convertedAt}</td>
                      </tr>
                )}
                  </tbody>
                </table>
            }
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreviewModal && selectedCandidate &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-teal-50">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-semibold">Conversion Preview</h2>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center text-2xl font-bold">
                  {selectedCandidate.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCandidate.name}</h3>
                  <p className="text-gray-600">{form.employeeId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Position</p>
                  <p className="font-medium">{selectedCandidate.position}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium">{form.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Joining Date</p>
                  <p className="font-medium">{form.joiningDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reporting Manager</p>
                  <p className="font-medium">{form.reportingManager}</p>
                </div>
                <div>
                  <p className="text-gray-500">Salary Structure</p>
                  <p className="font-medium">{form.salaryStructure}</p>
                </div>
                <div>
                  <p className="text-gray-500">Probation Period</p>
                  <p className="font-medium">{form.probationPeriod} months</p>
                </div>
                <div>
                  <p className="text-gray-500">Work Email</p>
                  <p className="font-medium">{form.workEmail}</p>
                </div>
                <div>
                  <p className="text-gray-500">Branch</p>
                  <p className="font-medium">{BRANCHES.find((b) => b.id === selectedCandidate.branch)?.name}</p>
                </div>
              </div>

              {form.bankName &&
            <div>
                  <h4 className="font-medium text-gray-700 mb-2">Bank Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                    <div>
                      <p className="text-gray-500">Bank</p>
                      <p className="font-medium">{form.bankName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Account</p>
                      <p className="font-medium">{form.accountNumber}</p>
                    </div>
                  </div>
                </div>
            }

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Notifications to be sent</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(notificationSettings).
                filter(([_, enabled]) => enabled).
                map(([key]) =>
                <span key={key} className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Back to Edit
              </Button>
              <Button variant="primary" onClick={confirmConversion} className="bg-teal-600 hover:bg-teal-700">
                <UserCheck className="w-4 h-4 mr-2" />
                Confirm Conversion
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmationModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-teal-600" />
                </div>
                <h2 className="text-lg font-semibold">Confirm Conversion</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to convert <strong>{selectedCandidate?.name}</strong> to an employee? This
                action will:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Create employee profile with ID {form.employeeId}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Notify relevant departments
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Send welcome communications
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowConfirmationModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={executeConversion} className="bg-teal-600 hover:bg-teal-700">
                <UserCheck className="w-4 h-4 mr-2" />
                Convert Now
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Activity Log Modal */}
      {showActivityLogModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Activity Log</h2>
              <button onClick={() => setShowActivityLogModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {activityLog.length === 0 ?
            <p className="text-center text-gray-400 py-8">No activity recorded</p> :

            <div className="space-y-3">
                  {activityLog.map((log) =>
              <div
                key={log.id}
                className={`p-3 rounded-lg border ${
                log.type === 'success' ?
                'bg-green-50 border-green-200' :
                log.type === 'warning' ?
                'bg-yellow-50 border-yellow-200' :
                log.type === 'error' ?
                'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'}`
                }>

                      <p className="text-sm font-medium">{log.action}</p>
                      {log.details && <p className="text-xs text-gray-500">{log.details}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {log.performedBy} • {log.timestamp}
                      </p>
                    </div>
              )}
                </div>
            }
            </div>
          </div>
        </div>
      }

      {/* Add Checklist Item Modal */}
      {showAddChecklistItemModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Checklist Item</h2>
              <button onClick={() => setShowAddChecklistItemModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Label</label>
                <input
                type="text"
                value={newChecklistItem.label}
                onChange={(e) => setNewChecklistItem({ ...newChecklistItem, label: e.target.value })}
                placeholder="Enter checklist item..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
              <Select
              label="Category"
              options={categories.map((c) => ({ value: c, label: c }))}
              value={newChecklistItem.category}
              onChange={(e) => setNewChecklistItem({ ...newChecklistItem, category: e.target.value })} />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                type="checkbox"
                checked={newChecklistItem.required}
                onChange={(e) => setNewChecklistItem({ ...newChecklistItem, required: e.target.checked })}
                className="rounded" />

                <span className="text-sm">Mark as Required</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowAddChecklistItemModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={addChecklistItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Document Upload Modal */}
      {showDocumentUploadModal && selectedChecklistItem &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button onClick={() => setShowDocumentUploadModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">Upload document for: {selectedChecklistItem.label}</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click or drag file to upload</p>
                <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    uploadDocument(selectedChecklistItem.id, file.name);
                  }
                }}
                className="hidden"
                id="doc-upload" />

                <label htmlFor="doc-upload">
                  <Button variant="outline" size="sm" as="span" className="cursor-pointer">
                    Select File
                  </Button>
                </label>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Checklist Note Modal */}
      {showChecklistNoteModal && selectedChecklistItem &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Note</h2>
              <button onClick={() => setShowChecklistNoteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600">Add note for: {selectedChecklistItem.label}</p>
              <textarea
              value={checklistNote}
              onChange={(e) => setChecklistNote(e.target.value)}
              rows={4}
              placeholder="Enter note..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowChecklistNoteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={addChecklistNote}>
                <Save className="w-4 h-4 mr-2" />
                Save Note
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Notification Settings Modal */}
      {showNotificationSettingsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Notification Settings</h2>
              <button onClick={() => setShowNotificationSettingsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {[
            { key: 'createEmployeeProfile', label: 'Create Employee Profile' },
            { key: 'notifyPayroll', label: 'Notify Payroll Module' },
            { key: 'notifyAcademic', label: 'Notify Academic Module' },
            { key: 'provisionITAccess', label: 'Provision IT Access' },
            { key: 'sendWelcomeEmail', label: 'Send Welcome Email' },
            { key: 'sendWelcomeSMS', label: 'Send Welcome SMS' },
            { key: 'notifyReportingManager', label: 'Notify Reporting Manager' },
            { key: 'addToDirectory', label: 'Add to Employee Directory' }].
            map((item) =>
            <label key={item.key} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                type="checkbox"
                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                onChange={(e) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked
                }))
                }
                className="rounded" />

                  <span className="text-sm">{item.label}</span>
                </label>
            )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="primary" onClick={() => setShowNotificationSettingsModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Undo Conversion Modal */}
      {showUndoConversionModal && convertedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold">Undo Conversion</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to undo the conversion of <strong>{convertedEmployee.name}</strong>? This will:
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Delete employee profile {convertedEmployee.employeeId}
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Revert candidate status to "Offer Accepted"
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Revoke all sent notifications
                </li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowUndoConversionModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={undoConversion} className="bg-red-600 hover:bg-red-700">
                <Undo className="w-4 h-4 mr-2" />
                Undo Conversion
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}