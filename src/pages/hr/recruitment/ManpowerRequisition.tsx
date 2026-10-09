// File: ManpowerRequisition.tsx

import React, { useState, Fragment, useCallback, useEffect, useMemo } from 'react';
import {
  Building,
  X,
  FileText,
  ChevronRight,
  CheckCircle,
  Clock,
  Save,
  Send,
  AlertCircle,
  Plus,
  Trash2,
  Users,
  Briefcase,
  Loader2,
  Info,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Printer,
  RotateCcw,
  Copy,
  Check,
  History,
  MessageSquare,
  ChevronLeft,
  XCircle,
  ArrowRight,
  RefreshCw } from
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
{ value: '', label: 'Select Department' },
{ value: 'Mathematics', label: 'Mathematics' },
{ value: 'Science', label: 'Science' },
{ value: 'English', label: 'English' },
{ value: 'Administration', label: 'Administration' },
{ value: 'Computer Science', label: 'Computer Science' },
{ value: 'Physical Education', label: 'Physical Education' },
{ value: 'Arts', label: 'Arts' },
{ value: 'Library', label: 'Library' }];


type WorkflowStep = 'Draft' | 'Submitted' | 'Principal Approval' | 'HR Activation';

const workflowSteps: WorkflowStep[] = [
'Draft',
'Submitted',
'Principal Approval',
'HR Activation'];


interface FormData {
  department: string;
  positionTitle: string;
  subject: string;
  vacancies: string;
  empType: string;
  qualification: string;
  certifications: string[];
  minExperience: string;
  jobDescription: string;
  salaryMin: string;
  salaryMax: string;
  justification: string;
  reportingManager: string;
  requiredByDate: string;
  priority: string;
  roleType: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  user: string;
  step: WorkflowStep;
  notes?: string;
}

interface ApprovalComment {
  id: string;
  user: string;
  role: string;
  timestamp: Date;
  comment: string;
  action: 'Approved' | 'Rejected' | 'Comment';
}

interface SavedRequisition {
  id: string;
  form: FormData;
  branches: string[];
  academicYear: string;
  currentStep: WorkflowStep;
  createdAt: Date;
  updatedAt: Date;
  history: HistoryEntry[];
  comments: ApprovalComment[];
}

const initialFormData: FormData = {
  department: '',
  positionTitle: '',
  subject: '',
  vacancies: '1',
  empType: 'Full-time',
  qualification: '',
  certifications: [],
  minExperience: '0',
  jobDescription: '',
  salaryMin: '',
  salaryMax: '',
  justification: '',
  reportingManager: '',
  requiredByDate: '',
  priority: 'Medium',
  roleType: 'Teaching'
};

const generateRequisitionId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  return `REQ-${year}-${random}`;
};

export function ManpowerRequisition() {
  // Core state
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('Draft');
  const [form, setForm] = useState<FormData>(initialFormData);
  const [certInput, setCertInput] = useState('');
  const [requisitionId, setRequisitionId] = useState(generateRequisitionId());

  // Interactive states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [comments, setComments] = useState<ApprovalComment[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalComment, setApprovalComment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Mark as dirty when form changes
  useEffect(() => {
    setIsDirty(true);
  }, [form, selectedBranches]);

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && isDirty && currentStep === 'Draft') {
      const timer = setTimeout(() => {
        autoSaveDraft();
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [form, isDirty, autoSaveEnabled, currentStep]);

  // Toast management
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Step index calculation
  const stepIndex = workflowSteps.indexOf(currentStep);

  // Check if form is editable
  const isFormEditable = useMemo(() => {
    return currentStep === 'Draft' || isEditing;
  }, [currentStep, isEditing]);

  // Completion percentage
  const completionPercentage = useMemo(() => {
    const requiredFields = [
    form.department,
    form.positionTitle,
    form.vacancies,
    form.qualification,
    form.jobDescription,
    form.justification,
    form.requiredByDate];

    const filledFields = requiredFields.filter((f) => f && f.trim()).length;
    return Math.round(filledFields / requiredFields.length * 100);
  }, [form]);

  // Branch handling
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

  // Certification handling
  const addCertification = useCallback(() => {
    if (certInput.trim()) {
      if (form.certifications.includes(certInput.trim())) {
        showToast('Certification already added', 'warning');
        return;
      }
      setForm((f) => ({
        ...f,
        certifications: [...f.certifications, certInput.trim()]
      }));
      setCertInput('');
      showToast('Certification added', 'success');
    }
  }, [certInput, form.certifications, showToast]);

  const removeCert = useCallback((i: number) => {
    setForm((f) => ({
      ...f,
      certifications: f.certifications.filter((_, idx) => idx !== i)
    }));
  }, []);

  // Form field update
  const updateField = useCallback((field: keyof FormData, value: string) => {
    if (!isFormEditable) {
      showToast('Cannot edit submitted requisition', 'warning');
      return;
    }
    setForm((f) => ({ ...f, [field]: value }));
  }, [isFormEditable, showToast]);

  // Validation
  const validateForm = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!form.department) {
      errors.push({ field: 'department', message: 'Department is required' });
    }
    if (!form.positionTitle.trim()) {
      errors.push({ field: 'positionTitle', message: 'Position title is required' });
    }
    if (!form.vacancies || parseInt(form.vacancies) < 1) {
      errors.push({ field: 'vacancies', message: 'At least 1 vacancy is required' });
    }
    if (!form.qualification.trim()) {
      errors.push({ field: 'qualification', message: 'Qualification is required' });
    }
    if (!form.jobDescription.trim()) {
      errors.push({ field: 'jobDescription', message: 'Job description is required' });
    }
    if (!form.justification.trim()) {
      errors.push({ field: 'justification', message: 'Justification is required' });
    }
    if (!form.requiredByDate) {
      errors.push({ field: 'requiredByDate', message: 'Required by date is required' });
    } else {
      const reqDate = new Date(form.requiredByDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (reqDate < today) {
        errors.push({ field: 'requiredByDate', message: 'Required by date cannot be in the past' });
      }
    }
    if (form.salaryMin && form.salaryMax) {
      if (parseInt(form.salaryMin) > parseInt(form.salaryMax)) {
        errors.push({ field: 'salaryMax', message: 'Max salary must be greater than min salary' });
      }
    }
    if (selectedBranches.length === 0) {
      errors.push({ field: 'branch', message: 'At least one branch must be selected' });
    }

    return errors;
  }, [form, selectedBranches]);

  // Add to history
  const addToHistory = useCallback((action: string, notes?: string) => {
    const entry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action,
      user: 'Current User', // In real app, get from auth context
      step: currentStep,
      notes
    };
    setHistory((prev) => [entry, ...prev]);
  }, [currentStep]);

  // Auto-save draft
  const autoSaveDraft = useCallback(async () => {
    if (currentStep !== 'Draft') return;

    try {
      const draftData = {
        id: requisitionId,
        form,
        branches: selectedBranches,
        academicYear,
        currentStep,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(`requisition_draft_${requisitionId}`, JSON.stringify(draftData));
      setLastSavedAt(new Date());
      setIsDirty(false);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [form, selectedBranches, academicYear, currentStep, requisitionId]);

  // Save as Draft
  const saveDraft = useCallback(async () => {
    setIsSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const draftData = {
        id: requisitionId,
        form,
        branches: selectedBranches,
        academicYear,
        currentStep: 'Draft' as WorkflowStep,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem(`requisition_draft_${requisitionId}`, JSON.stringify(draftData));

      addToHistory('Saved as Draft');
      setLastSavedAt(new Date());
      setIsDirty(false);
      showToast('Requisition saved as draft', 'success');
    } catch (error) {
      showToast('Failed to save draft', 'error');
    }

    setIsSaving(false);
  }, [form, selectedBranches, academicYear, requisitionId, addToHistory, showToast]);

  // Load draft
  const loadDraft = useCallback((draftId: string) => {
    try {
      const savedDraft = localStorage.getItem(`requisition_draft_${draftId}`);
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setForm(draftData.form);
        setSelectedBranches(draftData.branches);
        setAcademicYear(draftData.academicYear);
        setCurrentStep(draftData.currentStep || 'Draft');
        setRequisitionId(draftData.id);
        setIsDirty(false);
        showToast('Draft loaded successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to load draft', 'error');
    }
  }, [showToast]);

  // Open submit modal
  const openSubmitModal = useCallback(() => {
    const errors = validateForm();

    if (errors.length > 0) {
      setValidationErrors(errors);
      showToast(`Please fix ${errors.length} validation error(s)`, 'error');
      return;
    }

    setValidationErrors([]);
    setShowSubmitModal(true);
  }, [validateForm, showToast]);

  // Submit for Approval
  const submitForApproval = useCallback(async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      setCurrentStep('Submitted');
      addToHistory('Submitted for Approval', 'Requisition submitted to Principal for approval');

      // Clear draft from local storage
      localStorage.removeItem(`requisition_draft_${requisitionId}`);

      setIsDirty(false);
      showToast('Requisition submitted successfully! Awaiting Principal approval.', 'success');
    } catch (error) {
      showToast('Failed to submit requisition', 'error');
    }

    setIsSubmitting(false);
  }, [requisitionId, addToHistory, showToast]);

  // Approve (Principal)
  const approveRequisition = useCallback(async () => {
    setIsApproving(true);
    setShowApprovalModal(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const nextStep: WorkflowStep = currentStep === 'Submitted' ?
      'Principal Approval' :
      'HR Activation';

      if (approvalComment.trim()) {
        const comment: ApprovalComment = {
          id: Date.now().toString(),
          user: currentStep === 'Submitted' ? 'Principal' : 'HR Manager',
          role: currentStep === 'Submitted' ? 'Principal' : 'HR',
          timestamp: new Date(),
          comment: approvalComment,
          action: 'Approved'
        };
        setComments((prev) => [...prev, comment]);
      }

      setCurrentStep(nextStep);
      addToHistory(`Approved by ${currentStep === 'Submitted' ? 'Principal' : 'HR'}`, approvalComment || undefined);

      setApprovalComment('');

      if (nextStep === 'HR Activation') {
        showToast('Requisition fully approved and activated for recruitment!', 'success');
      } else {
        showToast('Requisition approved by Principal. Forwarded to HR.', 'success');
      }
    } catch (error) {
      showToast('Failed to approve requisition', 'error');
    }

    setIsApproving(false);
  }, [currentStep, approvalComment, addToHistory, showToast]);

  // Reject requisition
  const rejectRequisition = useCallback(async () => {
    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    setIsApproving(true);
    setShowRejectModal(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const comment: ApprovalComment = {
        id: Date.now().toString(),
        user: currentStep === 'Submitted' ? 'Principal' : 'HR Manager',
        role: currentStep === 'Submitted' ? 'Principal' : 'HR',
        timestamp: new Date(),
        comment: rejectionReason,
        action: 'Rejected'
      };
      setComments((prev) => [...prev, comment]);

      setCurrentStep('Draft');
      addToHistory(`Rejected by ${currentStep === 'Submitted' ? 'Principal' : 'HR'}`, rejectionReason);

      setRejectionReason('');
      showToast('Requisition rejected and sent back to draft', 'warning');
    } catch (error) {
      showToast('Failed to reject requisition', 'error');
    }

    setIsApproving(false);
  }, [currentStep, rejectionReason, addToHistory, showToast]);

  // Add comment
  const addComment = useCallback(() => {
    if (!newComment.trim()) {
      showToast('Please enter a comment', 'warning');
      return;
    }

    const comment: ApprovalComment = {
      id: Date.now().toString(),
      user: 'Current User',
      role: 'Requester',
      timestamp: new Date(),
      comment: newComment,
      action: 'Comment'
    };

    setComments((prev) => [...prev, comment]);
    setNewComment('');
    addToHistory('Added Comment', newComment);
    showToast('Comment added', 'success');
  }, [newComment, addToHistory, showToast]);

  // Discard changes
  const discardChanges = useCallback(() => {
    setForm(initialFormData);
    setSelectedBranches(['main']);
    setCertInput('');
    setValidationErrors([]);
    setIsDirty(false);
    setRequisitionId(generateRequisitionId());
    setCurrentStep('Draft');
    setHistory([]);
    setComments([]);
    setShowDiscardModal(false);
    showToast('Changes discarded', 'info');
  }, [showToast]);

  // Copy requisition ID
  const copyRequisitionId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(requisitionId);
      setCopiedId(true);
      showToast('Requisition ID copied', 'success');
      setTimeout(() => setCopiedId(false), 2000);
    } catch (error) {
      showToast('Failed to copy ID', 'error');
    }
  }, [requisitionId, showToast]);

  // Export / Print
  const exportRequisition = useCallback(async (format: 'print' | 'pdf') => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Manpower Requisition - ${requisitionId}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
          h1 { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .section { margin-bottom: 25px; }
          .section-title { font-size: 14px; font-weight: bold; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
          .field { display: flex; margin-bottom: 8px; }
          .field-label { width: 180px; font-weight: 500; color: #666; }
          .field-value { flex: 1; color: #333; }
          .status { padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .certifications { display: flex; gap: 8px; flex-wrap: wrap; }
          .cert { background: #e3f2fd; padding: 4px 12px; border-radius: 15px; font-size: 12px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; }
          .workflow { display: flex; justify-content: space-between; margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
          .step { text-align: center; }
          .step-number { width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; }
          .step-complete { background: #4caf50; color: white; }
          .step-current { background: #2196f3; color: white; }
          .step-pending { background: #e0e0e0; color: #666; }
        </style>
      </head>
      <body>
        <h1>Manpower Requisition</h1>
        
        <div class="header">
          <div><strong>Requisition ID:</strong> ${requisitionId}</div>
          <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
          <div><strong>Status:</strong> <span class="status">${currentStep}</span></div>
        </div>

        <div class="workflow">
          ${workflowSteps.map((step, i) => `
            <div class="step">
              <div class="step-number ${i < stepIndex ? 'step-complete' : i === stepIndex ? 'step-current' : 'step-pending'}">${i + 1}</div>
              <div>${step}</div>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <div class="section-title">Position Details</div>
          <div class="field"><span class="field-label">Department:</span><span class="field-value">${form.department || 'Not specified'}</span></div>
          <div class="field"><span class="field-label">Position Title:</span><span class="field-value">${form.positionTitle || 'Not specified'}</span></div>
          <div class="field"><span class="field-label">Role Type:</span><span class="field-value">${form.roleType}</span></div>
          <div class="field"><span class="field-label">Subject:</span><span class="field-value">${form.subject || 'N/A'}</span></div>
          <div class="field"><span class="field-label">Number of Vacancies:</span><span class="field-value">${form.vacancies}</span></div>
          <div class="field"><span class="field-label">Employment Type:</span><span class="field-value">${form.empType}</span></div>
          <div class="field"><span class="field-label">Priority:</span><span class="field-value">${form.priority}</span></div>
          <div class="field"><span class="field-label">Required By:</span><span class="field-value">${form.requiredByDate || 'Not specified'}</span></div>
          <div class="field"><span class="field-label">Branch(es):</span><span class="field-value">${selectedBranches.map((b) => BRANCHES.find((br) => br.id === b)?.name || b).join(', ')}</span></div>
        </div>

        <div class="section">
          <div class="section-title">Qualification & Experience</div>
          <div class="field"><span class="field-label">Required Qualification:</span><span class="field-value">${form.qualification || 'Not specified'}</span></div>
          <div class="field"><span class="field-label">Minimum Experience:</span><span class="field-value">${form.minExperience} years</span></div>
          <div class="field">
            <span class="field-label">Certifications:</span>
            <span class="field-value">
              <div class="certifications">
                ${form.certifications.length > 0 ? form.certifications.map((c) => `<span class="cert">${c}</span>`).join('') : 'None specified'}
              </div>
            </span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Job Description</div>
          <p>${form.jobDescription || 'Not provided'}</p>
        </div>

        <div class="section">
          <div class="section-title">Compensation</div>
          <div class="field"><span class="field-label">Salary Range:</span><span class="field-value">₹${form.salaryMin || '0'} - ₹${form.salaryMax || '0'} per month</span></div>
          <div class="field"><span class="field-label">Reporting Manager:</span><span class="field-value">${form.reportingManager || 'Not specified'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">Justification</div>
          <p>${form.justification || 'Not provided'}</p>
        </div>

        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>Academic Year: ${academicYear}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        if (format === 'print') {
          printWindow.close();
        }
      }, 500);
      showToast(format === 'print' ? 'Print dialog opened' : 'PDF generated', 'success');
    } else {
      showToast('Pop-up blocked. Please allow pop-ups.', 'error');
    }
  }, [requisitionId, form, currentStep, stepIndex, selectedBranches, academicYear, showToast]);

  // Duplicate requisition
  const duplicateRequisition = useCallback(() => {
    const newId = generateRequisitionId();
    setRequisitionId(newId);
    setCurrentStep('Draft');
    setHistory([]);
    setComments([]);
    setIsDirty(true);
    addToHistory('Created from duplicate');
    showToast(`Requisition duplicated. New ID: ${newId}`, 'success');
  }, [addToHistory, showToast]);

  // Get next action text
  const getNextActionText = useMemo(() => {
    switch (currentStep) {
      case 'Draft':
        return 'Submit to Principal for approval';
      case 'Submitted':
        return 'Awaiting Principal approval';
      case 'Principal Approval':
        return 'Awaiting HR activation';
      case 'HR Activation':
        return 'Requisition is active for recruitment';
      default:
        return '';
    }
  }, [currentStep]);

  // Modal Component
  const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'






  }: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) => {
    if (!isOpen) return null;

    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </div>);

  };

  // Toast Container
  const ToastContainer = () =>
  <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
    <div
      key={toast.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      toast.type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-blue-500 text-white'}`
      }>

          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-auto hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
    )}
    </div>;


  return (
    <div className="space-y-6 pb-8">
      <ToastContainer />

      {/* Preview Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Requisition Preview"
        size="lg">

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Department</label>
              <p className="text-sm font-medium">{form.department || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Position Title</label>
              <p className="text-sm font-medium">{form.positionTitle || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Role Type</label>
              <p className="text-sm font-medium">{form.roleType}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Subject</label>
              <p className="text-sm font-medium">{form.subject || 'N/A'}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Vacancies</label>
              <p className="text-sm font-medium">{form.vacancies}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Employment Type</label>
              <p className="text-sm font-medium">{form.empType}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Priority</label>
              <p className={`text-sm font-medium ${
              form.priority === 'High' ? 'text-red-600' :
              form.priority === 'Medium' ? 'text-amber-600' :
              'text-green-600'}`
              }>{form.priority}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Required By</label>
              <p className="text-sm font-medium">{form.requiredByDate || '—'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Qualification</label>
            <p className="text-sm font-medium">{form.qualification || '—'}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Minimum Experience</label>
            <p className="text-sm font-medium">{form.minExperience} years</p>
          </div>

          {form.certifications.length > 0 &&
          <div>
              <label className="text-xs text-gray-500">Certifications</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {form.certifications.map((cert, i) =>
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {cert}
                  </span>
              )}
              </div>
            </div>
          }

          <div>
            <label className="text-xs text-gray-500">Job Description</label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.jobDescription || '—'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Salary Range</label>
              <p className="text-sm font-medium">
                {form.salaryMin || form.salaryMax ?
                `₹${form.salaryMin || '0'} - ₹${form.salaryMax || '0'}` :
                'Not specified'
                }
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-500">Reporting Manager</label>
              <p className="text-sm font-medium">{form.reportingManager || '—'}</p>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500">Justification</label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.justification || '—'}</p>
          </div>

          <div>
            <label className="text-xs text-gray-500">Branch(es)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedBranches.map((b) =>
              <span key={b} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {BRANCHES.find((br) => br.id === b)?.name || b}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => exportRequisition('print')}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </Modal>

      {/* History Modal */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Requisition History"
        size="lg">

        {history.length === 0 ?
        <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No history available</p>
          </div> :

        <div className="space-y-3">
            {history.map((entry) =>
          <div key={entry.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            entry.action.includes('Approved') ? 'bg-green-100 text-green-600' :
            entry.action.includes('Rejected') ? 'bg-red-100 text-red-600' :
            entry.action.includes('Submitted') ? 'bg-blue-100 text-blue-600' :
            'bg-gray-100 text-gray-600'}`
            }>
                  {entry.action.includes('Approved') && <CheckCircle className="w-4 h-4" />}
                  {entry.action.includes('Rejected') && <XCircle className="w-4 h-4" />}
                  {entry.action.includes('Submitted') && <Send className="w-4 h-4" />}
                  {entry.action.includes('Saved') && <Save className="w-4 h-4" />}
                  {entry.action.includes('Comment') && <MessageSquare className="w-4 h-4" />}
                  {entry.action.includes('Created') && <Plus className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  {entry.notes && <p className="text-xs text-gray-500 mt-1">{entry.notes}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    {entry.user} • {entry.timestamp.toLocaleString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
            entry.step === 'Draft' ? 'bg-gray-100 text-gray-600' :
            entry.step === 'Submitted' ? 'bg-blue-100 text-blue-600' :
            entry.step === 'Principal Approval' ? 'bg-green-100 text-green-600' :
            'bg-teal-100 text-teal-600'}`
            }>
                  {entry.step}
                </span>
              </div>
          )}
          </div>
        }
      </Modal>

      {/* Comments Modal */}
      <Modal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        title="Comments & Feedback"
        size="lg">

        <div className="space-y-4">
          {comments.length === 0 ?
          <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No comments yet</p>
            </div> :

          <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) =>
            <div key={comment.id} className={`p-3 rounded-lg ${
            comment.action === 'Approved' ? 'bg-green-50 border border-green-200' :
            comment.action === 'Rejected' ? 'bg-red-50 border border-red-200' :
            'bg-gray-50 border border-gray-200'}`
            }>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.user}</span>
                    <span className="text-xs text-gray-500">({comment.role})</span>
                    {comment.action !== 'Comment' &&
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                comment.action === 'Approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'}`
                }>
                        {comment.action}
                      </span>
                }
                  </div>
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">{comment.timestamp.toLocaleString()}</p>
                </div>
            )}
            </div>
          }

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Comment</label>
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type your comment..."
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

              <Button variant="primary" onClick={addComment}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Discard Modal */}
      <Modal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        title="Discard Changes"
        size="sm">

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Are you sure you want to discard all changes? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDiscardModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={discardChanges}
              className="border-red-500 text-red-500 hover:bg-red-50">

              Discard Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Submit Confirmation Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Requisition"
        size="md">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are about to submit this requisition for approval. Once submitted:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>The requisition will be sent to the Principal for approval</li>
            <li>You will not be able to edit the form until it's rejected or sent back</li>
            <li>You will receive notifications on approval status</li>
          </ul>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Summary:</strong> {form.positionTitle || 'Position'} in {form.department || 'Department'} ({form.vacancies} vacancy)
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitForApproval} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit for Approval
            </Button>
          </div>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title={`Approve Requisition - ${currentStep === 'Submitted' ? 'Principal' : 'HR'}`}
        size="md">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            You are approving this requisition as {currentStep === 'Submitted' ? 'Principal' : 'HR Manager'}.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comments (Optional)</label>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="Add any comments or notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />

          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowApprovalModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={approveRequisition} disabled={isApproving}>
              {isApproving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Requisition"
        size="md">

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Rejecting this requisition will send it back to draft status for revision.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent" />

          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={rejectRequisition}
              disabled={isApproving}
              className="border-red-500 text-red-500 hover:bg-red-50">

              {isApproving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manpower Requisition</h1>
              <p className="text-sm text-gray-500">
                Raise a hiring request for your department
                {lastSavedAt && currentStep === 'Draft' &&
                <span className="ml-2 text-green-600">
                    • Auto-saved {lastSavedAt.toLocaleTimeString()}
                  </span>
                }
                {isDirty && currentStep === 'Draft' &&
                <span className="ml-2 text-amber-600">• Unsaved changes</span>
                }
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              disabled={!isFormEditable}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">

              {ACADEMIC_YEARS.map((y) =>
              <option key={y.value} value={y.value}>{y.label}</option>
              )}
            </select>
            <button
              onClick={copyRequisitionId}
              className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-mono flex items-center gap-2 hover:bg-gray-200 transition-colors">

              {requisitionId}
              {copiedId ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branch:</span>
          {BRANCHES.filter((b) => b.id !== 'all').map((branch) =>
          <button
            key={branch.id}
            onClick={() => isFormEditable && handleBranchToggle(branch.id)}
            disabled={!isFormEditable}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) ?
            'bg-blue-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'} ${
            !isFormEditable ? 'opacity-60 cursor-not-allowed' : ''}`}>

              {branch.name}
              {selectedBranches.includes(branch.id) && isFormEditable &&
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

      {/* Workflow Status */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          {workflowSteps.map((step, i) =>
          <Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                i < stepIndex ?
                'bg-green-500 text-white' :
                i === stepIndex ?
                'bg-blue-600 text-white ring-4 ring-blue-100' :
                'bg-gray-200 text-gray-500'}`
                }>

                  {i < stepIndex ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span
                className={`text-xs font-medium text-center ${
                i === stepIndex ?
                'text-blue-600' :
                i < stepIndex ?
                'text-green-600' :
                'text-gray-400'}`
                }>

                  {step}
                </span>
              </div>
              {i < workflowSteps.length - 1 &&
            <div
              className={`flex-1 h-0.5 mx-2 ${i < stepIndex ? 'bg-green-500' : 'bg-gray-200'}`} />

            }
            </Fragment>
          )}
        </div>
      </Card>

      {/* Validation Errors */}
      {validationErrors.length > 0 &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Please fix the following errors:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) =>
              <li key={index} className="text-sm text-red-700">{error.message}</li>
              )}
              </ul>
            </div>
          </div>
        </div>
      }

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card title="Position Details">
            {!isFormEditable &&
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-800">
                  This requisition is locked for editing. Status: <strong>{currentStep}</strong>
                </p>
                {currentStep !== 'HR Activation' &&
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="ml-auto">

                    <Edit className="w-3 h-3 mr-1" />
                    Request Edit
                  </Button>
              }
              </div>
            }
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some((e) => e.field === 'department') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}>

                  {DEPARTMENTS.map((d) =>
                  <option key={d.value} value={d.value}>{d.label}</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.positionTitle}
                  onChange={(e) => updateField('positionTitle', e.target.value)}
                  disabled={!isFormEditable}
                  placeholder="e.g. Senior Math Teacher"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some((e) => e.field === 'positionTitle') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.roleType}
                  onChange={(e) => updateField('roleType', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}>

                  <option value="Teaching">Teaching</option>
                  <option value="Non-Teaching">Non-Teaching</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject (if Teacher)
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => updateField('subject', e.target.value)}
                  disabled={!isFormEditable}
                  placeholder="e.g. Mathematics, Physics"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Vacancies <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.vacancies}
                  onChange={(e) => updateField('vacancies', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some((e) => e.field === 'vacancies') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.empType}
                  onChange={(e) => updateField('empType', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}>

                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => updateField('priority', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`}>

                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required By Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.requiredByDate}
                  onChange={(e) => updateField('requiredByDate', e.target.value)}
                  disabled={!isFormEditable}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some((e) => e.field === 'requiredByDate') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
            </div>
          </Card>

          {/* Qualifications */}
          <Card title="Qualification & Experience">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Qualification <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) => updateField('qualification', e.target.value)}
                  disabled={!isFormEditable}
                  placeholder="e.g. M.Sc + B.Ed"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  validationErrors.some((e) => e.field === 'qualification') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.minExperience}
                  onChange={(e) => updateField('minExperience', e.target.value)}
                  disabled={!isFormEditable}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Certifications
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && isFormEditable && addCertification()}
                    disabled={!isFormEditable}
                    placeholder="e.g. B.Ed, TET, CTET..."
                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCertification}
                    disabled={!isFormEditable}>

                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.certifications.map((cert, i) =>
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">

                      {cert}
                      {isFormEditable &&
                    <button onClick={() => removeCert(i)} className="hover:text-blue-900">
                          <X className="w-3 h-3" />
                        </button>
                    }
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* JD & Salary */}
          <Card title="Job Description & Compensation">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.jobDescription}
                  onChange={(e) => updateField('jobDescription', e.target.value)}
                  disabled={!isFormEditable}
                  rows={4}
                  placeholder="Describe the role, responsibilities, and expectations..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  validationErrors.some((e) => e.field === 'jobDescription') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Budget Min (₹)
                  </label>
                  <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => updateField('salaryMin', e.target.value)}
                    disabled={!isFormEditable}
                    placeholder="e.g. 30000"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Budget Max (₹)
                  </label>
                  <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => updateField('salaryMax', e.target.value)}
                    disabled={!isFormEditable}
                    placeholder="e.g. 50000"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.some((e) => e.field === 'salaryMax') ? 'border-red-500' : 'border-gray-300'} ${
                    !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.justification}
                  onChange={(e) => updateField('justification', e.target.value)}
                  disabled={!isFormEditable}
                  rows={3}
                  placeholder="Explain why this position is needed..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  validationErrors.some((e) => e.field === 'justification') ? 'border-red-500' : 'border-gray-300'} ${
                  !isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reporting Manager
                </label>
                <input
                  type="text"
                  value={form.reportingManager}
                  onChange={(e) => updateField('reportingManager', e.target.value)}
                  disabled={!isFormEditable}
                  placeholder="e.g. Dr. Amit Shah"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!isFormEditable ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card title="Workflow Actions">
            <div className="space-y-3">
              {currentStep === 'Draft' &&
              <>
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                  onClick={saveDraft}
                  disabled={isSaving}>

                    {isSaving ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <Save className="w-4 h-4 mr-2 text-gray-500" />
                  }
                    {isSaving ? 'Saving...' : 'Save as Draft'}
                  </Button>
                  <Button
                  variant="primary"
                  className="w-full justify-start"
                  size="sm"
                  onClick={openSubmitModal}
                  disabled={isSubmitting}>

                    {isSubmitting ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <Send className="w-4 h-4 mr-2" />
                  }
                    Submit for Approval
                  </Button>
                </>
              }

              {(currentStep === 'Submitted' || currentStep === 'Principal Approval') &&
              <>
                  <Button
                  variant="primary"
                  className="w-full justify-start"
                  size="sm"
                  onClick={() => setShowApprovalModal(true)}>

                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                  variant="outline"
                  className="w-full justify-start border-red-500 text-red-500 hover:bg-red-50"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}>

                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </>
              }

              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => setShowPreviewModal(true)}>

                <Eye className="w-4 h-4 mr-2 text-gray-500" />
                Preview
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => setShowHistoryModal(true)}>

                <History className="w-4 h-4 mr-2 text-gray-500" />
                View History
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => setShowCommentsModal(true)}>

                <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
                Comments ({comments.length})
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={() => exportRequisition('print')}>

                <Printer className="w-4 h-4 mr-2 text-gray-500" />
                Print
              </Button>
              {currentStep === 'HR Activation' &&
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={duplicateRequisition}>

                  <Copy className="w-4 h-4 mr-2 text-gray-500" />
                  Duplicate
                </Button>
              }
              {currentStep === 'Draft' && isDirty &&
              <Button
                variant="outline"
                className="w-full justify-start border-red-500 text-red-500 hover:bg-red-50"
                size="sm"
                onClick={() => setShowDiscardModal(true)}>

                  <Trash2 className="w-4 h-4 mr-2" />
                  Discard Changes
                </Button>
              }
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 font-medium">
                Current Status: <span className="font-bold">{currentStep}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {getNextActionText}
              </p>
            </div>

            {/* Completion Progress */}
            {currentStep === 'Draft' &&
            <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-medium text-gray-900">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                  className={`h-full rounded-full transition-all ${
                  completionPercentage === 100 ? 'bg-green-500' :
                  completionPercentage >= 50 ? 'bg-blue-500' :
                  'bg-amber-500'}`
                  }
                  style={{ width: `${completionPercentage}%` }} />

                </div>
              </div>
            }
          </Card>

          <Card title="Requisition Summary">
            <div className="space-y-3 text-sm">
              {[
              { label: 'Department', value: form.department || '—' },
              { label: 'Position', value: form.positionTitle || '—' },
              { label: 'Vacancies', value: form.vacancies },
              { label: 'Employment Type', value: form.empType },
              { label: 'Priority', value: form.priority },
              { label: 'Role Type', value: form.roleType },
              { label: 'Required By', value: form.requiredByDate || '—' },
              { label: 'Experience', value: `${form.minExperience}+ years` }].
              map((item) =>
              <div key={item.label} className="flex justify-between">
                  <span className="text-gray-500">{item.label}</span>
                  <span className={`font-medium ${
                item.label === 'Priority' && item.value === 'High' ? 'text-red-600' :
                item.label === 'Priority' && item.value === 'Medium' ? 'text-amber-600' :
                item.label === 'Priority' && item.value === 'Low' ? 'text-green-600' :
                'text-gray-900'}`
                }>{item.value}</span>
                </div>
              )}
              {(form.salaryMin || form.salaryMax) &&
              <div className="flex justify-between">
                  <span className="text-gray-500">Salary Range</span>
                  <span className="font-medium text-gray-900">
                    ₹{form.salaryMin || '0'} - ₹{form.salaryMax || '0'}
                  </span>
                </div>
              }
            </div>
          </Card>

          <Card title="Guidelines">
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>All fields marked with * are mandatory</p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>Requisition requires Principal approval before HR can activate</p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>Salary budget must be within approved department limits</p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p>Auto-save is enabled every 30 seconds for drafts</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>);

}