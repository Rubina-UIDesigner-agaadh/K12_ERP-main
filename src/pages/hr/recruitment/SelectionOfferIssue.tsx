import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building,
  X,
  Award,
  FileText,
  Send,
  CheckCircle,
  DollarSign,
  Calendar,
  Edit,
  Download,
  RefreshCw,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Mail,
  Clock,
  Eye,
  XCircle,
  Copy,
  Printer,
  History,
  User,
  Briefcase,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  ChevronLeft } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';

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


const PROBATION_OPTIONS = [
{ value: '3', label: '3 months' },
{ value: '6', label: '6 months' },
{ value: '12', label: '12 months' }];


const CONTRACT_OPTIONS = [
{ value: 'Permanent', label: 'Permanent' },
{ value: 'Contract', label: 'Contract' },
{ value: 'Probation', label: 'Probation' }];


const APPROVAL_AUTHORITIES = [
{ value: '', label: 'Select Authority' },
{ value: 'Principal', label: 'Principal' },
{ value: 'Director', label: 'Director' },
{ value: 'HR Manager', label: 'HR Manager' },
{ value: 'Chairman', label: 'Chairman' }];


interface SalaryComponent {
  id: string;
  head: string;
  amount: number;
  type: 'earning' | 'deduction';
}

interface OfferTrackingStep {
  id: string;
  label: string;
  done: boolean;
  date: string | null;
  actor?: string;
}

interface OfferRevision {
  id: string;
  timestamp: string;
  changes: {field: string;oldValue: string;newValue: string;}[];
  revisedBy: string;
}

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  position: string;
  branch: string;
  interviewScore: number;
  email: string;
  phone: string;
  status: 'Selected' | 'Offer Sent' | 'Offer Accepted' | 'Offer Rejected' | 'Joined';
  salaryComponents: SalaryComponent[];
  offerDetails: {
    approvedSalary: string;
    reportingDate: string;
    probationPeriod: string;
    contractType: string;
    approvalAuthority: string;
    benefits: string;
  };
  trackingSteps: OfferTrackingStep[];
  revisions: OfferRevision[];
  offerGeneratedAt?: string;
  offerSentAt?: string;
  offerViewedAt?: string;
  documentsShared?: boolean;
  converted?: boolean;
  selectedOnboardingDocs?: string[];
  offerRespondedAt?: string;
  offerLetterUrl?: string;
  actualDoj?: string;
  employeeId?: string;
}

const formatDisplayDate = (value?: string) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatSalary = (value?: string) => {
  if (!value) return '—';
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return `₹${amount.toLocaleString('en-IN')}`;
};

const defaultSalaryComponents: SalaryComponent[] = [
{ id: '1', head: 'Basic Salary', amount: 25000, type: 'earning' },
{ id: '2', head: 'HRA', amount: 10000, type: 'earning' },
{ id: '3', head: 'Transport Allowance', amount: 3000, type: 'earning' },
{ id: '4', head: 'Medical Allowance', amount: 2000, type: 'earning' },
{ id: '5', head: 'PF Deduction', amount: 3000, type: 'deduction' }];


const defaultTrackingSteps: OfferTrackingStep[] = [
{ id: '1', label: 'Offer Generated', done: false, date: null },
{ id: '2', label: 'Email Sent', done: false, date: null },
{ id: '3', label: 'Candidate Viewed', done: false, date: null },
{ id: '4', label: 'Acceptance Received', done: false, date: null },
{ id: '5', label: 'Joining Confirmed', done: false, date: null }];


const initialCandidates: Candidate[] = [
{
  id: 'APP-2024-001',
  name: 'Priya Sharma',
  avatar: 'PS',
  position: 'Math Teacher',
  branch: 'main',
  interviewScore: 88,
  email: 'priya.sharma@email.com',
  phone: '+91 98765 43210',
  status: 'Selected',
  salaryComponents: [...defaultSalaryComponents],
  offerDetails: {
    approvedSalary: '45000',
    reportingDate: '',
    probationPeriod: '6',
    contractType: 'Permanent',
    approvalAuthority: '',
    benefits: 'Medical, PF, Gratuity'
  },
  trackingSteps: [...defaultTrackingSteps],
  revisions: []
},
{
  id: 'APP-2024-002',
  name: 'Rahul Verma',
  avatar: 'RV',
  position: 'Science HOD',
  branch: 'main',
  interviewScore: 92,
  email: 'rahul.verma@email.com',
  phone: '+91 98765 43211',
  status: 'Offer Sent',
  salaryComponents: [
  { id: '1', head: 'Basic Salary', amount: 45000, type: 'earning' },
  { id: '2', head: 'HRA', amount: 18000, type: 'earning' },
  { id: '3', head: 'Transport Allowance', amount: 5000, type: 'earning' },
  { id: '4', head: 'Medical Allowance', amount: 3000, type: 'earning' },
  { id: '5', head: 'Special Allowance', amount: 4000, type: 'earning' },
  { id: '6', head: 'PF Deduction', amount: 5400, type: 'deduction' }],

  offerDetails: {
    approvedSalary: '75000',
    reportingDate: '2024-01-15',
    probationPeriod: '3',
    contractType: 'Permanent',
    approvalAuthority: 'Director',
    benefits: 'Medical, PF, Gratuity, Bonus'
  },
  trackingSteps: [
  { id: '1', label: 'Offer Generated', done: true, date: 'Dec 08, 2024', actor: 'HR Admin' },
  { id: '2', label: 'Email Sent', done: true, date: 'Dec 08, 2024', actor: 'System' },
  { id: '3', label: 'Candidate Viewed', done: true, date: 'Dec 09, 2024' },
  { id: '4', label: 'Acceptance Received', done: false, date: null },
  { id: '5', label: 'Joining Confirmed', done: false, date: null }],

  revisions: [],
  offerGeneratedAt: '2024-12-08T10:30:00',
  offerSentAt: '2024-12-08T10:35:00',
  offerViewedAt: '2024-12-09T14:20:00'
},
{
  id: 'APP-2024-003',
  name: 'Meera Patel',
  avatar: 'MP',
  position: 'CS Teacher',
  branch: 'south',
  interviewScore: 85,
  email: 'meera.patel@email.com',
  phone: '+91 98765 43212',
  status: 'Offer Accepted',
  salaryComponents: [
  { id: '1', head: 'Basic Salary', amount: 30000, type: 'earning' },
  { id: '2', head: 'HRA', amount: 12000, type: 'earning' },
  { id: '3', head: 'Transport Allowance', amount: 3500, type: 'earning' },
  { id: '4', head: 'Medical Allowance', amount: 2500, type: 'earning' },
  { id: '5', head: 'PF Deduction', amount: 3600, type: 'deduction' }],

  offerDetails: {
    approvedSalary: '52000',
    reportingDate: '2024-01-08',
    probationPeriod: '6',
    contractType: 'Permanent',
    approvalAuthority: 'Principal',
    benefits: 'Medical, PF, Gratuity'
  },
  trackingSteps: [
  { id: '1', label: 'Offer Generated', done: true, date: 'Dec 05, 2024', actor: 'HR Admin' },
  { id: '2', label: 'Email Sent', done: true, date: 'Dec 05, 2024', actor: 'System' },
  { id: '3', label: 'Candidate Viewed', done: true, date: 'Dec 06, 2024' },
  { id: '4', label: 'Acceptance Received', done: true, date: 'Dec 07, 2024' },
  { id: '5', label: 'Joining Confirmed', done: false, date: null }],

  revisions: [],
  offerGeneratedAt: '2024-12-05T09:00:00',
  offerSentAt: '2024-12-05T09:05:00',
  offerViewedAt: '2024-12-06T11:30:00',
  offerRespondedAt: '2024-12-07T16:45:00'
},
{
  id: 'APP-2024-004',
  name: 'Suresh Kumar',
  avatar: 'SK',
  position: 'PE Teacher',
  branch: 'north',
  interviewScore: 78,
  email: 'suresh.kumar@email.com',
  phone: '+91 98765 43213',
  status: 'Selected',
  salaryComponents: [
  { id: '1', head: 'Basic Salary', amount: 22000, type: 'earning' },
  { id: '2', head: 'HRA', amount: 8800, type: 'earning' },
  { id: '3', head: 'Transport Allowance', amount: 2500, type: 'earning' },
  { id: '4', head: 'Medical Allowance', amount: 1500, type: 'earning' },
  { id: '5', head: 'PF Deduction', amount: 2640, type: 'deduction' }],

  offerDetails: {
    approvedSalary: '38000',
    reportingDate: '',
    probationPeriod: '6',
    contractType: 'Probation',
    approvalAuthority: '',
    benefits: 'Medical, PF'
  },
  trackingSteps: [...defaultTrackingSteps],
  revisions: []
}];


interface ValidationErrors {
  approvedSalary?: string;
  reportingDate?: string;
  approvalAuthority?: string;
  salaryComponents?: string;
}

const ONBOARDING_DOCUMENTS = [
  'Offer Letter',
  'Joining Form',
  'Code of Conduct',
  'Document Checklist',
  'Bank Mandate Form',
  'PF / ESI Nomination',
  'ID & Address Proof Request',
  'Medical Fitness Form'
];

const getPipeline = (candidate: Candidate) => {
  const offerGenerated = Boolean(candidate.offerGeneratedAt) || Boolean(candidate.trackingSteps[0]?.done);
  const emailSent = Boolean(candidate.offerSentAt) || Boolean(candidate.trackingSteps[1]?.done) || candidate.status === 'Offer Sent' || candidate.status === 'Offer Accepted' || candidate.status === 'Joined';
  const joiningConfirmed = candidate.status === 'Joined' || Boolean(candidate.trackingSteps[4]?.done);
  const documentsShared = Boolean(candidate.documentsShared);
  const employeeConverted = Boolean(candidate.converted) || candidate.status === 'Joined';
  return [
    { key: 'offerGenerated', label: 'Offer Generated', done: offerGenerated },
    { key: 'emailSent', label: 'Email sent', done: emailSent },
    { key: 'joiningConfirmed', label: 'Joining confirmed', done: joiningConfirmed },
    { key: 'documentsShared', label: 'Documents shared', done: documentsShared },
    { key: 'employeeConverted', label: 'Employee converted', done: employeeConverted }
  ];
};

export function SelectionOfferIssue() {
  const navigate = useNavigate();
  // State for filters
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // State for candidates
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');

  // State for editing
  const [editedSalaryComponents, setEditedSalaryComponents] = useState<SalaryComponent[]>([]);
  const [editedOfferDetails, setEditedOfferDetails] = useState({
    approvedSalary: '',
    reportingDate: '',
    probationPeriod: '6',
    contractType: 'Permanent',
    approvalAuthority: '',
    benefits: ''
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // State for modals and UI
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [showOfferPreview, setShowOfferPreview] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [onboardingDocs, setOnboardingDocs] = useState<string[]>(['Offer Letter']);
  const [joiningForm, setJoiningForm] = useState({
    employeeId: 'EMP-2026-002',
    department: 'Mathematics',
    subject: 'Mathematics',
    joiningDate: '2025-01-02',
    reportingManager: '',
    salaryStructure: 'Grade A - Teacher (₹50,000 - ₹75,000)',
    probationPeriod: '6 months',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifscCode: '',
    workEmail: 'priya.sharma@school.edu',
    emergencyName: '',
    emergencyPhone: '',
    notes: ''
  });
  const [joiningChecks, setJoiningChecks] = useState<Record<string, boolean>>({});
  const [joiningUploads, setJoiningUploads] = useState<{ name: string; url: string }[]>([]);

  // Get selected candidate
  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedCandidateId),
    [candidates, selectedCandidateId]
  );

  // Initialize edited values when candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      setEditedSalaryComponents(selectedCandidate.salaryComponents.map((c) => ({ ...c })));
      setEditedOfferDetails({ ...selectedCandidate.offerDetails });
      setHasUnsavedChanges(false);
      setValidationErrors({});
      setIsRevising(false);
      setRevisionNotes('');
      setOnboardingDocs(selectedCandidate.selectedOnboardingDocs?.length ? selectedCandidate.selectedOnboardingDocs : ['Offer Letter']);
      setJoiningForm({
        employeeId: selectedCandidate.employeeId || 'EMP-2026-002',
        department: selectedCandidate.position.includes('Math') ? 'Mathematics' : selectedCandidate.position,
        subject: selectedCandidate.position.includes('Math') ? 'Mathematics' : selectedCandidate.position,
        joiningDate: selectedCandidate.offerDetails.reportingDate || '2025-01-02',
        reportingManager: selectedCandidate.offerDetails.approvalAuthority,
        salaryStructure: 'Grade A - Teacher (₹50,000 - ₹75,000)',
        probationPeriod: `${selectedCandidate.offerDetails.probationPeriod || '6'} months`,
        bankName: '',
        accountHolder: selectedCandidate.name,
        accountNumber: '',
        ifscCode: '',
        workEmail: selectedCandidate.email.replace('@email.com', '@school.edu'),
        emergencyName: '',
        emergencyPhone: '',
        notes: ''
      });
      setJoiningChecks({});
      setJoiningUploads([]);
    }
  }, [selectedCandidateId]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    let result = candidates;

    // Branch filter
    if (!selectedBranches.includes('all')) {
      result = result.filter((c) => selectedBranches.includes(c.branch));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
        c.name.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.position.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [candidates, selectedBranches, searchQuery, statusFilter]);

  // Candidate options for select
  const candidateOptions = useMemo(
    () =>
    filteredCandidates.map((c) => ({
      value: c.id,
      label: `${c.name} - ${c.position}`
    })),
    [filteredCandidates]
  );

  // Branch toggle handler
  const handleBranchToggle = useCallback((branchId: string) => {
    if (branchId === 'all') {
      setSelectedBranches(['all']);
    } else {
      setSelectedBranches((prev) => {
        const without = prev.filter((b) => b !== 'all' && b !== branchId);
        const adding = !prev.includes(branchId);
        const next = adding ? [...without, branchId] : without;
        return next.length === 0 ? ['all'] : next;
      });
    }
  }, []);

  // Calculate totals
  const totalEarnings = useMemo(
    () => editedSalaryComponents.filter((c) => c.type === 'earning').reduce((s, c) => s + c.amount, 0),
    [editedSalaryComponents]
  );

  const totalDeductions = useMemo(
    () => editedSalaryComponents.filter((c) => c.type === 'deduction').reduce((s, c) => s + c.amount, 0),
    [editedSalaryComponents]
  );

  const netSalary = totalEarnings - totalDeductions;

  // Generate unique ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Update salary component
  const updateComponent = useCallback(
    (id: string, field: keyof SalaryComponent, value: string | number) => {
      setEditedSalaryComponents((prev) =>
      prev.map((c) => c.id === id ? { ...c, [field]: value } : c)
      );
      setHasUnsavedChanges(true);
    },
    []
  );

  // Add salary component
  const addComponent = useCallback(() => {
    setEditedSalaryComponents((prev) => [
    ...prev,
    { id: generateId(), head: '', amount: 0, type: 'earning' }]
    );
    setHasUnsavedChanges(true);
  }, []);

  // Remove salary component
  const removeComponent = useCallback((id: string) => {
    setEditedSalaryComponents((prev) => prev.filter((c) => c.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  // Update offer details
  const updateOfferDetail = useCallback((field: string, value: string) => {
    setEditedOfferDetails((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    // Clear validation error for this field
    setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    if (!editedOfferDetails.approvedSalary || parseFloat(editedOfferDetails.approvedSalary) <= 0) {
      errors.approvedSalary = 'Approved salary is required and must be greater than 0';
    }

    if (!editedOfferDetails.reportingDate) {
      errors.reportingDate = 'Reporting date is required';
    } else {
      const reportDate = new Date(editedOfferDetails.reportingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reportDate < today) {
        errors.reportingDate = 'Reporting date cannot be in the past';
      }
    }

    if (!editedOfferDetails.approvalAuthority) {
      errors.approvalAuthority = 'Approval authority is required';
    }

    const validComponents = editedSalaryComponents.filter((c) => c.head.trim() && c.amount > 0);
    if (validComponents.length === 0) {
      errors.salaryComponents = 'At least one valid salary component is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editedOfferDetails, editedSalaryComponents]);

  // Save changes
  const saveChanges = useCallback(() => {
    if (!selectedCandidate) return;

    setCandidates((prev) =>
    prev.map((c) =>
    c.id === selectedCandidateId ?
    {
      ...c,
      salaryComponents: editedSalaryComponents,
      offerDetails: editedOfferDetails
    } :
    c
    )
    );

    setHasUnsavedChanges(false);
    setNotification({ type: 'success', message: 'Changes saved successfully' });
  }, [selectedCandidateId, editedSalaryComponents, editedOfferDetails, selectedCandidate]);

  // Reset changes
  const resetChanges = useCallback(() => {
    if (selectedCandidate) {
      setEditedSalaryComponents(selectedCandidate.salaryComponents.map((c) => ({ ...c })));
      setEditedOfferDetails({ ...selectedCandidate.offerDetails });
      setHasUnsavedChanges(false);
      setValidationErrors({});
      setNotification({ type: 'info', message: 'Changes reset to last saved values' });
    }
  }, [selectedCandidate]);

  // Generate offer letter PDF
  const generateOfferLetter = useCallback(async () => {
    if (!selectedCandidate) return;

    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Please fix validation errors before generating offer letter' });
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const offerLetterContent = `
OFFER LETTER

Date: ${new Date().toLocaleDateString()}

To,
${selectedCandidate.name}
${selectedCandidate.email}

Subject: Offer of Employment - ${selectedCandidate.position}

Dear ${selectedCandidate.name},

We are pleased to offer you the position of ${selectedCandidate.position} at ${BRANCHES.find((b) => b.id === selectedCandidate.branch)?.name || selectedCandidate.branch}.

Terms of Employment:
- Position: ${selectedCandidate.position}
- Gross Salary: ₹${totalEarnings.toLocaleString()} per month
- Net Salary: ₹${netSalary.toLocaleString()} per month
- Contract Type: ${editedOfferDetails.contractType}
- Probation Period: ${editedOfferDetails.probationPeriod} months
- Reporting Date: ${editedOfferDetails.reportingDate}
- Benefits: ${editedOfferDetails.benefits || 'As per company policy'}

Salary Breakdown:
${editedSalaryComponents.
      map((c) => `- ${c.head}: ₹${c.amount.toLocaleString()} (${c.type === 'earning' ? 'Earning' : 'Deduction'})`).
      join('\n')}

Please confirm your acceptance by signing and returning this letter within 7 days.

Best regards,
${editedOfferDetails.approvalAuthority}
HR Department
      `;

      // Create and download PDF (simulated as text file)
      const blob = new Blob([offerLetterContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Offer_Letter_${selectedCandidate.name.replace(/\s+/g, '_')}_${selectedCandidate.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update candidate status and tracking
      const now = new Date();
      setCandidates((prev) =>
      prev.map((c) =>
      c.id === selectedCandidateId ?
      {
        ...c,
        salaryComponents: editedSalaryComponents,
        offerDetails: editedOfferDetails,
        offerGeneratedAt: now.toISOString(),
        offerLetterUrl: `offer_${c.id}.pdf`,
        trackingSteps: c.trackingSteps.map((step, idx) =>
        idx === 0 ?
        { ...step, done: true, date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), actor: 'HR Admin' } :
        step
        )
      } :
      c
      )
      );

      setHasUnsavedChanges(false);
      setNotification({ type: 'success', message: 'Offer letter generated and downloaded successfully' });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to generate offer letter. Please try again.' });
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [selectedCandidate, selectedCandidateId, validateForm, editedSalaryComponents, editedOfferDetails, totalEarnings, netSalary]);

  // Send offer email
  const sendOfferEmail = useCallback(async () => {
    if (!selectedCandidate) return;

    // Check if offer is generated
    const candidateData = candidates.find((c) => c.id === selectedCandidateId);
    if (!candidateData?.trackingSteps[0].done) {
      setNotification({ type: 'warning', message: 'Please generate offer letter first before sending email' });
      return;
    }

    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Please fix validation errors before sending email' });
      return;
    }

    setIsSendingEmail(true);

    try {
      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const now = new Date();
      setCandidates((prev) =>
      prev.map((c) =>
      c.id === selectedCandidateId ?
      {
        ...c,
        status: 'Offer Sent',
        offerSentAt: now.toISOString(),
        documentsShared: onboardingDocs.length > 0,
        selectedOnboardingDocs: onboardingDocs,
        trackingSteps: c.trackingSteps.map((step, idx) =>
        idx === 1 ?
        { ...step, done: true, date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), actor: 'System' } :
        step
        )
      } :
      c
      )
      );

      setNotification({
        type: 'success',
        message: `Offer letter${onboardingDocs.length ? ` and ${onboardingDocs.length} onboarding document(s)` : ''} emailed to ${selectedCandidate.email}`
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to send email. Please try again.' });
    } finally {
      setIsSendingEmail(false);
    }
  }, [selectedCandidate, selectedCandidateId, candidates, validateForm, onboardingDocs]);

  const convertApplicantToEmployee = () => {
    if (!selectedCandidate) return;
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === selectedCandidateId
          ? {
              ...c,
              converted: true,
              status: 'Joined',
              actualDoj: c.actualDoj || new Date().toISOString().split('T')[0],
              employeeId: c.employeeId || `EMP${c.id.replace(/\D/g, '').slice(-4)}`,
              trackingSteps: c.trackingSteps.map((step, idx) =>
                idx === 4
                  ? { ...step, done: true, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), actor: 'HR' }
                  : step
              )
            }
          : c
      )
    );
    setNotification({
      type: 'success',
      message: `${selectedCandidate.name} converted to employee with the information captured so far.`
    });
  };

  const openEmployeeForm = () => {
    if (!selectedCandidate) return;
    const [firstName, ...rest] = selectedCandidate.name.split(' ');
    navigate('/hr/employee/add-edit-employee-profile', {
      state: {
        prefill: {
          firstName,
          lastName: rest.join(' '),
          personalEmail: selectedCandidate.email,
          primaryMobile: selectedCandidate.phone,
          designation: selectedCandidate.position,
          department: joiningForm.department,
          campus: getBranchName(selectedCandidate.branch),
          officialEmail: joiningForm.workEmail
        }
      }
    });
  };

  // Start revision
  const startRevision = useCallback(() => {
    setIsRevising(true);
    setRevisionNotes('');
  }, []);

  // Cancel revision
  const cancelRevision = useCallback(() => {
    resetChanges();
    setIsRevising(false);
    setRevisionNotes('');
  }, [resetChanges]);

  // Submit revision
  const submitRevision = useCallback(async () => {
    if (!selectedCandidate) return;

    if (!validateForm()) {
      setNotification({ type: 'error', message: 'Please fix validation errors before submitting revision' });
      return;
    }

    if (!revisionNotes.trim()) {
      setNotification({ type: 'warning', message: 'Please provide revision notes' });
      return;
    }

    // Track changes
    const changes: {field: string;oldValue: string;newValue: string;}[] = [];

    // Compare offer details
    Object.keys(editedOfferDetails).forEach((key) => {
      const oldVal = selectedCandidate.offerDetails[key as keyof typeof selectedCandidate.offerDetails];
      const newVal = editedOfferDetails[key as keyof typeof editedOfferDetails];
      if (oldVal !== newVal) {
        changes.push({ field: key, oldValue: oldVal, newValue: newVal });
      }
    });

    // Compare salary totals
    const oldTotal = selectedCandidate.salaryComponents.
    filter((c) => c.type === 'earning').
    reduce((s, c) => s + c.amount, 0);
    if (oldTotal !== totalEarnings) {
      changes.push({
        field: 'totalEarnings',
        oldValue: `₹${oldTotal.toLocaleString()}`,
        newValue: `₹${totalEarnings.toLocaleString()}`
      });
    }

    const revision: OfferRevision = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      changes,
      revisedBy: 'HR Admin'
    };

    setCandidates((prev) =>
    prev.map((c) =>
    c.id === selectedCandidateId ?
    {
      ...c,
      salaryComponents: editedSalaryComponents,
      offerDetails: editedOfferDetails,
      revisions: [...c.revisions, revision],
      // Reset tracking for re-sending
      trackingSteps: c.trackingSteps.map((step, idx) =>
      idx >= 1 ? { ...step, done: false, date: null, actor: undefined } : step
      ),
      status: 'Selected',
      offerSentAt: undefined,
      offerViewedAt: undefined,
      offerRespondedAt: undefined
    } :
    c
    )
    );

    setIsRevising(false);
    setRevisionNotes('');
    setHasUnsavedChanges(false);
    setNotification({ type: 'success', message: 'Offer revised successfully. You can now regenerate and resend the offer.' });
  }, [selectedCandidate, selectedCandidateId, editedOfferDetails, editedSalaryComponents, totalEarnings, revisionNotes, validateForm]);

  // Simulate candidate viewing offer
  const simulateCandidateView = useCallback(() => {
    if (!selectedCandidate) return;

    const candidateData = candidates.find((c) => c.id === selectedCandidateId);
    if (!candidateData?.trackingSteps[1].done) {
      setNotification({ type: 'warning', message: 'Offer email has not been sent yet' });
      return;
    }

    if (candidateData?.trackingSteps[2].done) {
      setNotification({ type: 'info', message: 'Candidate has already viewed the offer' });
      return;
    }

    const now = new Date();
    setCandidates((prev) =>
    prev.map((c) =>
    c.id === selectedCandidateId ?
    {
      ...c,
      offerViewedAt: now.toISOString(),
      trackingSteps: c.trackingSteps.map((step, idx) =>
      idx === 2 ?
      { ...step, done: true, date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) } :
      step
      )
    } :
    c
    )
    );

    setNotification({ type: 'success', message: 'Simulated: Candidate viewed the offer' });
  }, [selectedCandidate, selectedCandidateId, candidates]);

  // Record candidate response
  const recordCandidateResponse = useCallback(
    (accepted: boolean) => {
      if (!selectedCandidate) return;

      const candidateData = candidates.find((c) => c.id === selectedCandidateId);
      if (!candidateData?.trackingSteps[2].done) {
        setNotification({ type: 'warning', message: 'Candidate has not viewed the offer yet' });
        return;
      }

      const now = new Date();
      setCandidates((prev) =>
      prev.map((c) =>
      c.id === selectedCandidateId ?
      {
        ...c,
        status: accepted ? 'Offer Accepted' : 'Offer Rejected',
        offerRespondedAt: now.toISOString(),
        trackingSteps: c.trackingSteps.map((step, idx) =>
        idx === 3 ?
        {
          ...step,
          done: true,
          date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          label: accepted ? 'Acceptance Received' : 'Offer Rejected'
        } :
        step
        )
      } :
      c
      )
      );

      setNotification({
        type: accepted ? 'success' : 'warning',
        message: accepted ? 'Offer accepted by candidate' : 'Offer rejected by candidate'
      });
    },
    [selectedCandidate, selectedCandidateId, candidates]
  );

  // Confirm joining
  const confirmJoining = useCallback(() => {
    if (!selectedCandidate) return;

    const candidateData = candidates.find((c) => c.id === selectedCandidateId);
    if (candidateData?.status !== 'Offer Accepted') {
      setNotification({ type: 'warning', message: 'Offer must be accepted first' });
      return;
    }

    const now = new Date();
    setCandidates((prev) =>
    prev.map((c) =>
    c.id === selectedCandidateId ?
    {
      ...c,
      status: 'Joined',
      trackingSteps: c.trackingSteps.map((step, idx) =>
      idx === 4 ?
      { ...step, done: true, date: now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), actor: 'HR Admin' } :
      step
      )
    } :
    c
    )
    );

    setNotification({ type: 'success', message: 'Joining confirmed! Employee onboarding can begin.' });
  }, [selectedCandidate, selectedCandidateId, candidates]);

  // Copy offer link
  const copyOfferLink = useCallback(() => {
    if (!selectedCandidate) return;

    const link = `https://hr.school.edu/offers/${selectedCandidate.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setNotification({ type: 'success', message: 'Offer link copied to clipboard' });
    });
  }, [selectedCandidate]);

  // Print offer
  const printOffer = useCallback(() => {
    window.print();
    setNotification({ type: 'info', message: 'Print dialog opened' });
  }, []);

  // Get branch name
  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  // Get status color
  const getStatusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Selected':
        return 'bg-blue-100 text-blue-700';
      case 'Offer Sent':
        return 'bg-yellow-100 text-yellow-700';
      case 'Offer Accepted':
        return 'bg-green-100 text-green-700';
      case 'Offer Rejected':
        return 'bg-red-100 text-red-700';
      case 'Joined':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get current tracking step
  const getCurrentTrackingStep = () => {
    const candidateData = candidates.find((c) => c.id === selectedCandidateId);
    if (!candidateData) return 0;
    const lastDoneIndex = candidateData.trackingSteps.findLastIndex((s) => s.done);
    return lastDoneIndex + 1;
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Notification */}
      {notification &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${
        notification.type === 'success' ?
        'bg-green-100 text-green-800' :
        notification.type === 'error' ?
        'bg-red-100 text-red-800' :
        notification.type === 'warning' ?
        'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'}`
        }>

          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-2 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selection & Offer Issue</h1>
              <p className="text-sm text-gray-500">Generate and send offer letters to selected candidates</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <Select
              label=""
              options={[
              { value: 'all', label: 'All Status' },
              { value: 'Selected', label: 'Selected' },
              { value: 'Offer Sent', label: 'Offer Sent' },
              { value: 'Offer Accepted', label: 'Accepted' },
              { value: 'Offer Rejected', label: 'Rejected' },
              { value: 'Joined', label: 'Joined' }]
              }
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-36" />

          </div>
        </div>

        <div className="mt-5 pt-5 border-t space-y-4">
          {/* Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or position..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (hasUnsavedChanges) {
                      const confirmLeave = window.confirm('You have unsaved changes. Continue without saving?');
                      if (!confirmLeave) return;
                    }
                    setHasSearched(true);
                    setSelectedCandidateId('');
                  }
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />

              {searchQuery &&
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              }
            </div>
            <Button
              variant="primary"
              onClick={() => {
                if (hasUnsavedChanges) {
                  const confirmLeave = window.confirm('You have unsaved changes. Continue without saving?');
                  if (!confirmLeave) return;
                }
                setHasSearched(true);
                setSelectedCandidateId('');
              }}>
              <Search className="w-4 h-4 mr-1" />
              Search
            </Button>
          </div>

          {/* Branch filter */}
          <div className="flex flex-wrap items-center gap-3">
            <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branch:</span>
            {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
            <button
              key={branch.id}
              onClick={() => handleBranchToggle(branch.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              selectedBranches.includes(branch.id) || selectedBranches.includes('all') ?
              'bg-green-600 text-white' :
              'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }>

                {branch.name}
                {selectedBranches.includes(branch.id) && !selectedBranches.includes('all') &&
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
        </div>
      </Card>

      {!hasSearched && !selectedCandidate &&
      <Card className="p-10">
          <div className="text-center text-gray-400 max-w-md mx-auto">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-gray-600">Search applicants to begin offer issue</p>
            <p className="text-sm mt-1">Use name, ID, or position, then click Search to see the applicant list.</p>
          </div>
        </Card>
      }

      {hasSearched && !selectedCandidate &&
      <Card title={`Applicants (${filteredCandidates.length})`}>
        <div className="overflow-x-auto">
          {filteredCandidates.length === 0 ?
          <div className="text-center py-8 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No applicants found</p>
            </div> :

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-3 px-3 font-semibold">Candidate</th>
                <th className="py-3 px-3 font-semibold">Position</th>
                <th className="py-3 px-3 font-semibold">Offered Salary</th>
                <th className="py-3 px-3 font-semibold">Offer Date</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Offer & joining progress</th>
                <th className="py-3 px-3 font-semibold">Expected DOJ</th>
                <th className="py-3 px-3 font-semibold">Actual DOJ</th>
                <th className="py-3 px-3 font-semibold">Documents</th>
                <th className="py-3 px-3 font-semibold">Employee</th>
                <th className="py-3 px-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) =>
              <tr key={candidate.id} className="border-b last:border-0 hover:bg-green-50/40">
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {candidate.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-xs text-gray-400">{candidate.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-800">{candidate.position}</td>
                <td className="py-3 px-3 font-medium text-gray-900">{formatSalary(candidate.offerDetails.approvedSalary)}</td>
                <td className="py-3 px-3 text-gray-700">{formatDisplayDate(candidate.offerGeneratedAt || candidate.offerSentAt)}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="py-3 px-3 min-w-[180px]">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${getPipeline(candidate).filter((s) => s.done).length / 5 * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1">{getPipeline(candidate).filter((s) => s.done).length}/5 · {getPipeline(candidate).find((s) => !s.done)?.label || 'Complete'}</p>
                </td>
                <td className="py-3 px-3 text-gray-700">{formatDisplayDate(candidate.offerDetails.reportingDate)}</td>
                <td className="py-3 px-3 text-gray-700">{formatDisplayDate(candidate.actualDoj)}</td>
                <td className="py-3 px-3 text-gray-700">
                  {candidate.selectedOnboardingDocs?.length
                    ? `${candidate.selectedOnboardingDocs.length} docs`
                    : candidate.documentsShared
                      ? 'Shared'
                      : '—'}
                </td>
                <td className="py-3 px-3 text-gray-700">{candidate.employeeId || (candidate.converted ? 'Converted' : '—')}</td>
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedCandidateId(candidate.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-green-700 hover:bg-green-50"
                    title="View">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
              )}
            </tbody>
          </table>
          }
        </div>
      </Card>
      }

      {selectedCandidate &&
      <>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (hasUnsavedChanges) {
              const confirmLeave = window.confirm('You have unsaved changes. Continue without saving?');
              if (!confirmLeave) return;
            }
            setSelectedCandidateId('');
          }}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Applicants
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Offer & joining progress</h2>
          <span className="text-xs text-gray-500">{getPipeline(selectedCandidate).filter((s) => s.done).length} of 5 complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-green-500 transition-all" style={{ width: `${getPipeline(selectedCandidate).filter((s) => s.done).length / 5 * 100}%` }} />
        </div>
        <div className="flex items-start">
          {getPipeline(selectedCandidate).map((step, index, arr) =>
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${step.done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {step.done ? '✓' : index + 1}
                </div>
                <p className={`mt-2 text-[11px] text-center leading-tight ${step.done ? 'text-green-700 font-medium' : 'text-gray-500'}`}>{step.label}</p>
              </div>
              {index < arr.length - 1 && <div className={`h-1 mt-4 flex-1 rounded ${arr[index].done ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </React.Fragment>
          )}
        </div>
      </div>

      {hasUnsavedChanges &&
      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <span className="text-sm text-yellow-800 flex-1">You have unsaved changes</span>
          <Button variant="outline" size="sm" onClick={resetChanges}>Reset</Button>
          <Button variant="primary" size="sm" onClick={saveChanges}><Save className="w-4 h-4 mr-1" />Save</Button>
        </div>
      }

      {!getPipeline(selectedCandidate).find((s) => s.key === 'emailSent')?.done ?
      <Card title="Selection & Offer">
        <div className="space-y-6">
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-bold">{selectedCandidate.avatar}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{selectedCandidate.name}</p>
              <p className="text-sm text-gray-500">{selectedCandidate.position} · {getBranchName(selectedCandidate.branch)} · {selectedCandidate.email} · {selectedCandidate.phone}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(selectedCandidate.status)}`}>{selectedCandidate.status}</span>
            </div>
            <p className="text-sm font-bold text-green-700">Score {selectedCandidate.interviewScore}%</p>
          </div>

          {isRevising &&
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="font-medium text-orange-800 mb-2">Revision Mode</p>
              <textarea value={revisionNotes} onChange={(e) => setRevisionNotes(e.target.value)} placeholder="Revision notes..." rows={2} className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm" />
              <div className="mt-2 flex gap-2">
                <Button variant="primary" size="sm" onClick={submitRevision}>Submit Revision</Button>
                <Button variant="outline" size="sm" onClick={cancelRevision}>Cancel</Button>
              </div>
            </div>
          }

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Offer details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Approved Salary (₹) *</label>
                <input type="number" value={editedOfferDetails.approvedSalary} onChange={(e) => updateOfferDetail('approvedSalary', e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${validationErrors.approvedSalary ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Date *</label>
                <input type="date" value={editedOfferDetails.reportingDate} onChange={(e) => updateOfferDetail('reportingDate', e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${validationErrors.reportingDate ? 'border-red-500' : 'border-gray-300'}`} />
              </div>
              <Select label="Probation Period" options={PROBATION_OPTIONS} value={editedOfferDetails.probationPeriod} onChange={(v) => updateOfferDetail('probationPeriod', v)} />
              <Select label="Contract Type" options={CONTRACT_OPTIONS} value={editedOfferDetails.contractType} onChange={(v) => updateOfferDetail('contractType', v)} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Authority *</label>
                <select value={editedOfferDetails.approvalAuthority} onChange={(e) => updateOfferDetail('approvalAuthority', e.target.value)} className={`w-full px-3 py-2 border rounded-lg text-sm ${validationErrors.approvalAuthority ? 'border-red-500' : 'border-gray-300'}`}>
                  {APPROVAL_AUTHORITIES.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                <input type="text" value={editedOfferDetails.benefits} onChange={(e) => updateOfferDetail('benefits', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Salary breakdown</h3>
              <Button variant="outline" size="sm" onClick={addComponent}><Plus className="w-3 h-3 mr-1" />Add Component</Button>
            </div>
            <div className="space-y-2">
              {editedSalaryComponents.map((comp) =>
              <div key={comp.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <input type="text" value={comp.head} onChange={(e) => updateComponent(comp.id, 'head', e.target.value)} className="flex-1 px-2 py-1.5 border rounded text-sm" />
                  <select value={comp.type} onChange={(e) => updateComponent(comp.id, 'type', e.target.value)} className="px-2 py-1.5 border rounded text-sm">
                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                  </select>
                  <input type="number" value={comp.amount} onChange={(e) => updateComponent(comp.id, 'amount', parseInt(e.target.value) || 0)} className="w-28 px-2 py-1.5 border rounded text-sm text-right" />
                  <button onClick={() => removeComponent(comp.id)} disabled={editedSalaryComponents.length <= 1} className="p-1 text-red-500 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-between text-sm"><span>Gross / Net</span><span className="font-semibold">₹{totalEarnings.toLocaleString()} / ₹{netSalary.toLocaleString()}</span></div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={generateOfferLetter} disabled={isGeneratingPdf}><FileText className="w-4 h-4 mr-1" />{isGeneratingPdf ? 'Generating...' : 'Generate Offer Letter'}</Button>
            <Button variant="outline" onClick={() => setShowOfferPreview(true)}><Eye className="w-4 h-4 mr-1" />Preview</Button>
            <Button variant="outline" onClick={printOffer}><Printer className="w-4 h-4 mr-1" />Print</Button>
            <Button variant="outline" onClick={startRevision}><Edit className="w-4 h-4 mr-1" />Revise</Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-gray-900 mb-2">Onboarding documents checklist</h3>
            <p className="text-xs text-gray-500 mb-3">Select documents to email with the offer letter.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ONBOARDING_DOCUMENTS.map((doc) =>
              <label key={doc} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                  <input
                    type="checkbox"
                    checked={onboardingDocs.includes(doc)}
                    onChange={() => setOnboardingDocs((prev) => prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc])}
                  />
                  {doc}
                </label>
              )}
            </div>
            <Button variant="primary" className="mt-4" onClick={sendOfferEmail} disabled={isSendingEmail}>
              <Send className="w-4 h-4 mr-1" />
              {isSendingEmail ? 'Sending...' : 'Email offer letter with selected documents'}
            </Button>
          </div>
        </div>
      </Card> :

      <Card title="Joining & Conversion">
        <div className="space-y-6">
          <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-600 text-white flex items-center justify-center font-bold">{selectedCandidate.avatar}</div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{selectedCandidate.name}</p>
              <p className="text-sm text-gray-500">{selectedCandidate.position} · {getBranchName(selectedCandidate.branch)}</p>
              <p className="text-xs text-gray-400">{selectedCandidate.email} · {selectedCandidate.phone} · Offer sent</p>
            </div>
            {selectedCandidate.converted && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Converted</span>}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Pre-Joining Checklist</h3>
            <div className="space-y-4">
              {([
                ['Document Verification', [
                  ['origDegree', 'Original Degree Certificate', true],
                  ['bedCert', 'B.Ed / Teaching Certificate', true],
                  ['prevEmp', 'Previous Employment Certificate', true],
                  ['addressProof', 'Address Proof (Aadhar/Passport)', true],
                  ['pan', 'PAN Card', true],
                  ['photos', 'Passport Size Photographs (4)', true]
                ]],
                ['Qualification Verification', [
                  ['qualComplete', 'Qualification Verification Complete', true],
                  ['refCheck', 'Previous Employer Reference Check', true]
                ]],
                ['Background Check', [
                  ['bgInitiated', 'Background Check Initiated', true],
                  ['bgCleared', 'Background Check Cleared', true],
                  ['policeInitiated', 'Police Verification Initiated', false],
                  ['policeCleared', 'Police Verification Cleared', false]
                ]],
                ['Medical Check', [
                  ['medCert', 'Medical Certificate Submitted', false],
                  ['medFit', 'Medical Fitness Verified', false]
                ]]
              ] as [string, [string, string, boolean][]][]).map(([section, items]) =>
                <div key={section} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">{section}</div>
                  <div className="divide-y">
                    {items.map(([key, label, required]) =>
                      <label key={key} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                        <span className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(joiningChecks[key])}
                            onChange={(e) => setJoiningChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
                          />
                          {label}
                        </span>
                        {required ? <span className="text-[11px] font-medium text-red-600">Required</span> : <span className="text-[11px] text-gray-400">Optional</span>}
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Joining Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID (Auto-Generated)</label>
                <input value={joiningForm.employeeId} readOnly className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50" />
                <p className="text-[11px] text-gray-400 mt-1">Auto-generated</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date <span className="text-red-500">*</span></label>
                <input type="date" value={joiningForm.joiningDate} onChange={(e) => setJoiningForm((p) => ({ ...p, joiningDate: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Allocation <span className="text-red-500">*</span></label>
                <input value={joiningForm.department} onChange={(e) => setJoiningForm((p) => ({ ...p, department: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Allocation</label>
                <input value={joiningForm.subject} onChange={(e) => setJoiningForm((p) => ({ ...p, subject: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager <span className="text-red-500">*</span></label>
                <select value={joiningForm.reportingManager} onChange={(e) => setJoiningForm((p) => ({ ...p, reportingManager: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="">Select Manager</option>
                  <option>Principal</option>
                  <option>Vice Principal</option>
                  <option>HOD Mathematics</option>
                  <option>HOD Science</option>
                  <option>HR Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Structure Mapping <span className="text-red-500">*</span></label>
                <select value={joiningForm.salaryStructure} onChange={(e) => setJoiningForm((p) => ({ ...p, salaryStructure: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option>Grade A - Teacher (₹50,000 - ₹75,000)</option>
                  <option>Grade B - Teacher (₹35,000 - ₹50,000)</option>
                  <option>Grade C - Staff (₹25,000 - ₹40,000)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Probation Period</label>
                <select value={joiningForm.probationPeriod} onChange={(e) => setJoiningForm((p) => ({ ...p, probationPeriod: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                <input type="email" value={joiningForm.workEmail} onChange={(e) => setJoiningForm((p) => ({ ...p, workEmail: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input value={joiningForm.bankName} onChange={(e) => setJoiningForm((p) => ({ ...p, bankName: e.target.value }))} placeholder="e.g. SBI, HDFC" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                <input value={joiningForm.accountHolder} onChange={(e) => setJoiningForm((p) => ({ ...p, accountHolder: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input value={joiningForm.accountNumber} onChange={(e) => setJoiningForm((p) => ({ ...p, accountNumber: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input value={joiningForm.ifscCode} onChange={(e) => setJoiningForm((p) => ({ ...p, ifscCode: e.target.value }))} placeholder="e.g. SBIN0001234" className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Emergency Contact (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <input value={joiningForm.emergencyName} onChange={(e) => setJoiningForm((p) => ({ ...p, emergencyName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input value={joiningForm.emergencyPhone} onChange={(e) => setJoiningForm((p) => ({ ...p, emergencyPhone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
            <textarea rows={3} value={joiningForm.notes} onChange={(e) => setJoiningForm((p) => ({ ...p, notes: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Any joining remarks" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Document upload</h3>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 text-white text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload document
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const url = URL.createObjectURL(file);
                    setJoiningUploads((prev) => [...prev, { name: file.name, url }]);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            {joiningUploads.length === 0 && <p className="text-sm text-gray-400">No documents uploaded yet.</p>}
            <div className="space-y-2">
              {joiningUploads.map((doc) =>
                <div key={doc.url} className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2 text-sm">
                  <span className="truncate">{doc.name}</span>
                  <Button variant="outline" size="sm" onClick={() => window.open(doc.url, '_blank')}>
                    <Eye className="w-4 h-4 mr-1" /> Preview document
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={convertApplicantToEmployee} disabled={selectedCandidate.converted}>
              Convert Employee
            </Button>
            <Button variant="outline" onClick={openEmployeeForm}>
              Open Employee Form
            </Button>
          </div>
        </div>
      </Card>
      }

      </>
      }

      {/* Offer Preview Modal */}
      {showOfferPreview && selectedCandidate &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Offer Letter Preview</h2>
              <button onClick={() => setShowOfferPreview(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="text-xl font-bold">OFFER OF EMPLOYMENT</h3>
                <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
              </div>

              <div>
                <p className="mb-2">To,</p>
                <p className="font-medium">{selectedCandidate.name}</p>
                <p className="text-sm text-gray-600">{selectedCandidate.email}</p>
              </div>

              <div>
                <p className="mb-2">
                  <strong>Subject:</strong> Offer of Employment - {selectedCandidate.position}
                </p>
              </div>

              <div>
                <p className="mb-2">Dear {selectedCandidate.name},</p>
                <p className="text-gray-700">
                  We are pleased to offer you the position of <strong>{selectedCandidate.position}</strong> at{' '}
                  <strong>{getBranchName(selectedCandidate.branch)}</strong>.
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">Terms of Employment:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Position: {selectedCandidate.position}</li>
                  <li>Gross Salary: ₹{totalEarnings.toLocaleString()} per month</li>
                  <li>Net Salary: ₹{netSalary.toLocaleString()} per month</li>
                  <li>Contract Type: {editedOfferDetails.contractType}</li>
                  <li>Probation Period: {editedOfferDetails.probationPeriod} months</li>
                  <li>Reporting Date: {editedOfferDetails.reportingDate || 'To be confirmed'}</li>
                  <li>Benefits: {editedOfferDetails.benefits || 'As per company policy'}</li>
                </ul>
              </div>

              <div>
                <p className="font-medium mb-2">Salary Breakdown:</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Component</th>
                      <th className="text-left py-1">Type</th>
                      <th className="text-right py-1">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editedSalaryComponents.map((comp) =>
                  <tr key={comp.id} className="border-b">
                        <td className="py-1">{comp.head}</td>
                        <td className="py-1 capitalize">{comp.type}</td>
                        <td className="py-1 text-right">₹{comp.amount.toLocaleString()}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-700">
                  Please confirm your acceptance by signing and returning this letter within 7 days.
                </p>
              </div>

              <div className="pt-4">
                <p>Best regards,</p>
                <p className="font-medium">{editedOfferDetails.approvalAuthority || 'HR Department'}</p>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowOfferPreview(false)}>
                Close
              </Button>
              <Button
              variant="primary"
              onClick={() => {
                setShowOfferPreview(false);
                generateOfferLetter();
              }}>

                Generate PDF
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}