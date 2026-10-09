import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  Search } from
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
  offerRespondedAt?: string;
  offerLetterUrl?: string;
}

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

export function SelectionOfferIssue() {
  // State for filters
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for candidates
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('APP-2024-001');

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
        message: `Offer email sent successfully to ${selectedCandidate.email}`
      });
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to send email. Please try again.' });
    } finally {
      setIsSendingEmail(false);
    }
  }, [selectedCandidate, selectedCandidateId, candidates, validateForm]);

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
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />

            {searchQuery &&
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Unsaved Changes Warning */}
          {hasUnsavedChanges &&
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <span className="text-sm text-yellow-800 flex-1">You have unsaved changes</span>
              <Button variant="outline" size="sm" onClick={resetChanges}>
                Reset
              </Button>
              <Button variant="primary" size="sm" onClick={saveChanges}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          }

          {/* Candidate Selection */}
          <Card title="Selected Candidate">
            <Select
              label="Candidate *"
              options={candidateOptions}
              value={selectedCandidateId}
              onChange={(value) => {
                if (hasUnsavedChanges) {
                  const confirm = window.confirm('You have unsaved changes. Continue without saving?');
                  if (!confirm) return;
                }
                setSelectedCandidateId(value);
              }} />


            {selectedCandidate &&
            <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 text-white flex items-center justify-center font-bold">
                    {selectedCandidate.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{selectedCandidate.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedCandidate.position} · {getBranchName(selectedCandidate.branch)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(selectedCandidate.status)}`}>
                        {selectedCandidate.status}
                      </span>
                      <span className="text-xs text-gray-400">Interview Score: {selectedCandidate.interviewScore}%</span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-gray-500">{selectedCandidate.email}</p>
                    <p className="text-gray-500">{selectedCandidate.phone}</p>
                  </div>
                </div>
              </div>
            }
          </Card>

          {/* Revision Mode Banner */}
          {isRevising &&
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Edit className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Revision Mode</span>
              </div>
              <p className="text-sm text-orange-700 mb-3">
                Make changes to the offer details and salary breakdown. After saving, you'll need to regenerate and resend the offer letter.
              </p>
              <div className="mb-3">
                <label className="block text-sm font-medium text-orange-800 mb-1">Revision Notes *</label>
                <textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Explain the reason for this revision..."
                rows={2}
                className="w-full px-3 py-2 border border-orange-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

              </div>
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={submitRevision}>
                  Submit Revision
                </Button>
                <Button variant="outline" size="sm" onClick={cancelRevision}>
                  Cancel
                </Button>
              </div>
            </div>
          }

          {/* Offer Details */}
          <Card title="Offer Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Approved Salary (₹) *</label>
                <input
                  type="number"
                  value={editedOfferDetails.approvedSalary}
                  onChange={(e) => updateOfferDetail('approvedSalary', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.approvedSalary ? 'border-red-500' : 'border-gray-300'}`
                  } />

                {validationErrors.approvedSalary &&
                <p className="text-xs text-red-500 mt-1">{validationErrors.approvedSalary}</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Date *</label>
                <input
                  type="date"
                  value={editedOfferDetails.reportingDate}
                  onChange={(e) => updateOfferDetail('reportingDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.reportingDate ? 'border-red-500' : 'border-gray-300'}`
                  } />

                {validationErrors.reportingDate &&
                <p className="text-xs text-red-500 mt-1">{validationErrors.reportingDate}</p>
                }
              </div>
              <Select
                label="Probation Period"
                options={PROBATION_OPTIONS}
                value={editedOfferDetails.probationPeriod}
                onChange={(v) => updateOfferDetail('probationPeriod', v)} />

              <Select
                label="Contract Type"
                options={CONTRACT_OPTIONS}
                value={editedOfferDetails.contractType}
                onChange={(v) => updateOfferDetail('contractType', v)} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Authority *</label>
                <select
                  value={editedOfferDetails.approvalAuthority}
                  onChange={(e) => updateOfferDetail('approvalAuthority', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  validationErrors.approvalAuthority ? 'border-red-500' : 'border-gray-300'}`
                  }>

                  {APPROVAL_AUTHORITIES.map((opt) =>
                  <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  )}
                </select>
                {validationErrors.approvalAuthority &&
                <p className="text-xs text-red-500 mt-1">{validationErrors.approvalAuthority}</p>
                }
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                <input
                  type="text"
                  value={editedOfferDetails.benefits}
                  onChange={(e) => updateOfferDetail('benefits', e.target.value)}
                  placeholder="e.g. Medical, PF, Gratuity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent" />

              </div>
            </div>
          </Card>

          {/* Salary Breakdown */}
          <Card
            title="Salary Breakdown"
            headerAction={
            <Button variant="outline" size="xs" onClick={addComponent}>
                <Plus className="w-3 h-3 mr-1" />
                Add Component
              </Button>
            }>

            {validationErrors.salaryComponents &&
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {validationErrors.salaryComponents}
              </div>
            }

            <div className="space-y-2">
              {editedSalaryComponents.map((comp) =>
              <div key={comp.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <input
                  type="text"
                  value={comp.head}
                  onChange={(e) => updateComponent(comp.id, 'head', e.target.value)}
                  placeholder="Head name"
                  className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-transparent" />

                  <select
                  value={comp.type}
                  onChange={(e) => updateComponent(comp.id, 'type', e.target.value)}
                  className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500">

                    <option value="earning">Earning</option>
                    <option value="deduction">Deduction</option>
                  </select>
                  <input
                  type="number"
                  value={comp.amount}
                  onChange={(e) => updateComponent(comp.id, 'amount', parseInt(e.target.value) || 0)}
                  className="w-28 px-2 py-1.5 border border-gray-300 rounded text-sm text-right focus:ring-1 focus:ring-green-500 focus:border-transparent" />

                  <button
                  onClick={() => removeComponent(comp.id)}
                  disabled={editedSalaryComponents.length <= 1}
                  className="p-1 hover:bg-red-50 rounded text-red-500 disabled:opacity-50 disabled:cursor-not-allowed">

                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Earnings</span>
                <span className="font-semibold text-green-700">₹{totalEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Deductions</span>
                <span className="font-semibold text-red-600">₹{totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2">
                <span className="text-gray-900">Net Salary</span>
                <span className="text-green-700">₹{netSalary.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={generateOfferLetter}
              disabled={isGeneratingPdf || isRevising}>

              {isGeneratingPdf ?
              <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </> :

              <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Offer Letter (PDF)
                </>
              }
            </Button>

            <Button
              variant="outline"
              onClick={sendOfferEmail}
              disabled={isSendingEmail || isRevising}>

              {isSendingEmail ?
              <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </> :

              <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Offer Email
                </>
              }
            </Button>

            <Button
              variant="outline"
              onClick={startRevision}
              disabled={isRevising || selectedCandidate?.status === 'Joined'}>

              <RefreshCw className="w-4 h-4 mr-2" />
              Revise Offer
            </Button>

            <Button variant="outline" onClick={copyOfferLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>

            <Button variant="outline" onClick={printOffer}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <Button variant="outline" onClick={() => setShowOfferPreview(true)}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>

          {/* Simulation Buttons (for testing) */}
          <Card title="Simulation Controls (For Testing)">
            <p className="text-sm text-gray-500 mb-3">
              Use these buttons to simulate candidate actions for testing purposes.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={simulateCandidateView}>
                <Eye className="w-4 h-4 mr-1" />
                Simulate: Candidate Views Offer
              </Button>
              <Button variant="outline" size="sm" onClick={() => recordCandidateResponse(true)}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Simulate: Accept Offer
              </Button>
              <Button variant="outline" size="sm" onClick={() => recordCandidateResponse(false)}>
                <XCircle className="w-4 h-4 mr-1" />
                Simulate: Reject Offer
              </Button>
              <Button variant="outline" size="sm" onClick={confirmJoining}>
                <User className="w-4 h-4 mr-1" />
                Confirm Joining
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Offer Tracking */}
          <Card title="Offer Tracking">
            <div className="space-y-3">
              {selectedCandidate &&
              candidates.find((c) => c.id === selectedCandidateId)?.trackingSteps.map((step, i) =>
              <div key={step.id} className="flex items-start gap-3">
                    <div className="relative">
                      <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.done ? 'bg-green-100' : 'bg-gray-100'}`
                    }>

                        {step.done ?
                    <CheckCircle className="w-4 h-4 text-green-600" /> :

                    <Clock className="w-4 h-4 text-gray-300" />
                    }
                      </div>
                      {i < 4 &&
                  <div
                    className={`absolute left-1/2 top-8 w-0.5 h-6 -translate-x-1/2 ${
                    step.done ? 'bg-green-200' : 'bg-gray-200'}`
                    } />

                  }
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`text-sm font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        {step.done ? step.date : 'Pending'}
                        {step.actor && ` · ${step.actor}`}
                      </p>
                    </div>
                  </div>
              )}
            </div>

            {/* Progress indicator */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{getCurrentTrackingStep()} / 5 steps</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${getCurrentTrackingStep() / 5 * 100}%` }} />

              </div>
            </div>
          </Card>

          {/* Offer Summary */}
          <Card title="Offer Summary">
            {selectedCandidate &&
            <div className="space-y-3 text-sm">
                {[
              { label: 'Candidate', value: selectedCandidate.name },
              { label: 'Position', value: selectedCandidate.position },
              { label: 'Branch', value: getBranchName(selectedCandidate.branch) },
              { label: 'Gross Salary', value: `₹${totalEarnings.toLocaleString()}` },
              { label: 'Net Salary', value: `₹${netSalary.toLocaleString()}` },
              { label: 'Contract Type', value: editedOfferDetails.contractType },
              { label: 'Probation', value: `${editedOfferDetails.probationPeriod} months` },
              { label: 'Reporting Date', value: editedOfferDetails.reportingDate || 'Not set' },
              { label: 'Benefits', value: editedOfferDetails.benefits || 'Not specified' }].
              map((item) =>
              <div key={item.label} className="flex justify-between">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium text-gray-900 text-right max-w-[60%] truncate">{item.value}</span>
                  </div>
              )}
              </div>
            }
          </Card>

          {/* Revision History */}
          {selectedCandidate && selectedCandidate.revisions.length > 0 &&
          <Card
            title="Revision History"
            headerAction={
            <button onClick={() => setShowRevisionHistory(!showRevisionHistory)}>
                  {showRevisionHistory ?
              <ChevronUp className="w-4 h-4 text-gray-500" /> :

              <ChevronDown className="w-4 h-4 text-gray-500" />
              }
                </button>
            }>

              <div className={`space-y-3 ${showRevisionHistory ? '' : 'max-h-24 overflow-hidden'}`}>
                {candidates.
              find((c) => c.id === selectedCandidateId)?.
              revisions.slice().
              reverse().
              map((revision) =>
              <div key={revision.id} className="p-2 bg-gray-50 rounded-lg text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{revision.revisedBy}</span>
                        <span className="text-gray-400">
                          {new Date(revision.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <ul className="space-y-0.5 text-gray-600">
                        {revision.changes.map((change, idx) =>
                  <li key={idx}>
                            {change.field}: {change.oldValue} → {change.newValue}
                          </li>
                  )}
                      </ul>
                    </div>
              )}
              </div>
              {!showRevisionHistory && selectedCandidate.revisions.length > 1 &&
            <button
              onClick={() => setShowRevisionHistory(true)}
              className="mt-2 text-xs text-green-600 hover:underline">

                  Show all {selectedCandidate.revisions.length} revisions
                </button>
            }
            </Card>
          }

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  if (selectedCandidate) {
                    window.open(`mailto:${selectedCandidate.email}`, '_blank');
                  }
                }}>

                <Mail className="w-4 h-4 mr-2" />
                Email Candidate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowRevisionHistory(true)}>

                <History className="w-4 h-4 mr-2" />
                View History
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  const candidateData = candidates.find((c) => c.id === selectedCandidateId);
                  if (candidateData?.offerLetterUrl) {
                    setNotification({ type: 'info', message: 'Downloading offer letter...' });
                  } else {
                    setNotification({ type: 'warning', message: 'Offer letter not generated yet' });
                  }
                }}>

                <Download className="w-4 h-4 mr-2" />
                Download Offer Letter
              </Button>
            </div>
          </Card>
        </div>
      </div>

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