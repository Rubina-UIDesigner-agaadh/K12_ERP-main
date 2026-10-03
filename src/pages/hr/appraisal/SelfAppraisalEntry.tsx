// File: SelfAppraisalEntry.tsx

import React, { useState, Fragment, useRef, useCallback, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  Plus,
  Trash2,
  Upload,
  FileText,
  CheckCircle,
  Award,
  X,
  Info,
  Image,
  AlertCircle,
  Loader2 } from
'lucide-react';

interface KpiRow {
  id: string;
  name: string;
  weightage: number;
  rating: number;
  justification: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ValidationError {
  field: string;
  message: string;
}

const initialKpis: KpiRow[] = [
{
  id: '1',
  name: 'Classroom Management',
  weightage: 15,
  rating: 0,
  justification: ''
},
{
  id: '2',
  name: 'Subject Knowledge',
  weightage: 20,
  rating: 0,
  justification: ''
},
{
  id: '3',
  name: 'Student Engagement',
  weightage: 15,
  rating: 0,
  justification: ''
},
{
  id: '4',
  name: 'Assessment & Evaluation',
  weightage: 10,
  rating: 0,
  justification: ''
},
{
  id: '5',
  name: 'Professional Development',
  weightage: 10,
  rating: 0,
  justification: ''
},
{
  id: '6',
  name: 'Communication Skills',
  weightage: 10,
  rating: 0,
  justification: ''
},
{
  id: '7',
  name: 'Technology Integration',
  weightage: 10,
  rating: 0,
  justification: ''
},
{
  id: '8',
  name: 'Teamwork & Collaboration',
  weightage: 10,
  rating: 0,
  justification: ''
}];


const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function SelfAppraisalEntry() {
  // Core state
  const [step, setStep] = useState(1);
  const [kpis, setKpis] = useState<KpiRow[]>(initialKpis);
  const [achievements, setAchievements] = useState<Achievement[]>([
  {
    id: '1',
    title: 'Best Teacher Award',
    description: 'Received annual best teacher award for innovative teaching methods',
    date: '2024-08-15',
    category: 'Award'
  }]
  );
  const [files, setFiles] = useState<UploadedFile[]>([
  {
    id: '1',
    name: 'Teaching_Portfolio_2024.pdf',
    size: '2.4 MB',
    type: 'pdf'
  }]
  );
  const [newAch, setNewAch] = useState({
    title: '',
    description: '',
    date: '',
    category: ''
  });
  const [showAchForm, setShowAchForm] = useState(false);

  // New interactive states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteAchModal, setShowDeleteAchModal] = useState<string | null>(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Computed values
  const totalRated = kpis.filter((k) => k.rating > 0).length;
  const totalKpis = kpis.length;
  const achCount = achievements.length;
  const fileCount = files.length;
  const completionPct = Math.round(
    (step === 1 ?
    totalRated / totalKpis :
    step === 2 ?
    (totalRated + achCount) / (totalKpis + 1) :
    (totalRated + achCount + fileCount) / (totalKpis + 2)) * 100
  );
  const weightedScore = kpis.reduce(
    (sum, k) => sum + k.rating * k.weightage / 100,
    0
  );

  // Mark as dirty when data changes
  useEffect(() => {
    setIsDirty(true);
  }, [kpis, achievements, files]);

  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Toast notification helper
  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Validation functions
  const validateStep1 = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    const unratedKpis = kpis.filter((k) => k.rating === 0);

    if (unratedKpis.length > 0) {
      errors.push({
        field: 'kpis',
        message: `Please rate all competencies. ${unratedKpis.length} remaining.`
      });
    }

    const highRatedWithoutJustification = kpis.filter(
      (k) => k.rating >= 4 && !k.justification.trim()
    );

    if (highRatedWithoutJustification.length > 0) {
      errors.push({
        field: 'justification',
        message: `Please provide justification for high ratings (4 or 5 stars). ${highRatedWithoutJustification.length} missing.`
      });
    }

    return errors;
  }, [kpis]);

  const validateStep2 = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (achievements.length === 0) {
      errors.push({
        field: 'achievements',
        message: 'Please add at least one achievement.'
      });
    }

    return errors;
  }, [achievements]);

  const validateStep3 = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (files.length === 0) {
      errors.push({
        field: 'files',
        message: 'Please upload at least one evidence file.'
      });
    }

    return errors;
  }, [files]);

  const validateAllSteps = useCallback((): ValidationError[] => {
    return [...validateStep1(), ...validateStep2(), ...validateStep3()];
  }, [validateStep1, validateStep2, validateStep3]);

  // KPI functions
  const setRating = useCallback((id: string, rating: number) => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }
    setKpis((prev) =>
    prev.map((k) =>
    k.id === id ? { ...k, rating } : k
    )
    );
  }, [isSubmitted, showToast]);

  const setJustification = useCallback((id: string, val: string) => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }
    setKpis((prev) =>
    prev.map((k) =>
    k.id === id ? { ...k, justification: val } : k
    )
    );
  }, [isSubmitted, showToast]);

  // Achievement functions
  const addAchievement = useCallback(() => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }

    if (!newAch.title.trim()) {
      showToast('Achievement title is required', 'error');
      return;
    }

    const newAchievement: Achievement = {
      ...newAch,
      id: Date.now().toString()
    };

    setAchievements((prev) => [...prev, newAchievement]);
    setNewAch({
      title: '',
      description: '',
      date: '',
      category: ''
    });
    setShowAchForm(false);
    showToast('Achievement added successfully', 'success');
  }, [newAch, isSubmitted, showToast]);

  const confirmDeleteAchievement = useCallback((id: string) => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }
    setShowDeleteAchModal(id);
  }, [isSubmitted, showToast]);

  const removeAch = useCallback((id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
    setShowDeleteAchModal(null);
    showToast('Achievement removed', 'success');
  }, [showToast]);

  const cancelAchievementForm = useCallback(() => {
    setNewAch({
      title: '',
      description: '',
      date: '',
      category: ''
    });
    setShowAchForm(false);
  }, []);

  // File functions
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  const getFileType = useCallback((file: File): string => {
    if (file.type.includes('pdf')) return 'pdf';
    if (file.type.includes('image')) return 'image';
    if (file.type.includes('word') || file.type.includes('document')) return 'doc';
    return 'other';
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `File type not allowed: ${file.name}`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name} (max 10MB)`;
    }
    return null;
  }, []);

  const processFiles = useCallback(async (fileList: FileList) => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validationError = validateFile(file);

      if (validationError) {
        errors.push(validationError);
        continue;
      }

      // Check for duplicate
      const isDuplicate = files.some((f) => f.name === file.name);
      if (isDuplicate) {
        errors.push(`File already exists: ${file.name}`);
        continue;
      }

      newFiles.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: formatFileSize(file.size),
        type: getFileType(file)
      });
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
      showToast(`${newFiles.length} file(s) uploaded successfully`, 'success');
    }

    if (errors.length > 0) {
      errors.forEach((error) => showToast(error, 'error'));
    }

    setIsUploading(false);
  }, [files, isSubmitted, showToast, validateFile, formatFileSize, getFileType]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input value to allow uploading same file again
    e.target.value = '';
  }, [processFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const openFileDialog = useCallback(() => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }
    fileInputRef.current?.click();
  }, [isSubmitted, showToast]);

  const confirmDeleteFile = useCallback((id: string) => {
    if (isSubmitted) {
      showToast('Cannot modify submitted appraisal', 'error');
      return;
    }
    setShowDeleteFileModal(id);
  }, [isSubmitted, showToast]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setShowDeleteFileModal(null);
    showToast('File removed', 'success');
  }, [showToast]);

  // Navigation functions
  const goToNextStep = useCallback(() => {
    let errors: ValidationError[] = [];

    if (step === 1) {
      errors = validateStep1();
    } else if (step === 2) {
      errors = validateStep2();
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach((error) => showToast(error.message, 'warning'));
      return;
    }

    setValidationErrors([]);
    setStep(Math.min(3, step + 1));
  }, [step, validateStep1, validateStep2, showToast]);

  const goToPreviousStep = useCallback(() => {
    setValidationErrors([]);
    setStep(Math.max(1, step - 1));
  }, [step]);

  const goToStep = useCallback((targetStep: number) => {
    // Allow going back without validation
    if (targetStep < step) {
      setValidationErrors([]);
      setStep(targetStep);
      return;
    }

    // Validate current and intermediate steps before going forward
    let canProceed = true;
    let errors: ValidationError[] = [];

    for (let s = step; s < targetStep; s++) {
      if (s === 1) {
        errors = [...errors, ...validateStep1()];
      } else if (s === 2) {
        errors = [...errors, ...validateStep2()];
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      showToast('Please complete current step before proceeding', 'warning');
      canProceed = false;
    }

    if (canProceed) {
      setValidationErrors([]);
      setStep(targetStep);
    }
  }, [step, validateStep1, validateStep2, showToast]);

  // Save draft function
  const saveDraft = useCallback(async () => {
    if (isSubmitted) {
      showToast('Appraisal already submitted', 'info');
      return;
    }

    setIsDraftSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const draftData = {
      kpis,
      achievements,
      files,
      currentStep: step,
      savedAt: new Date().toISOString()
    };

    // Simulate saving to localStorage or API
    try {
      localStorage.setItem('selfAppraisalDraft', JSON.stringify(draftData));
      setLastSavedAt(new Date());
      setIsDirty(false);
      showToast('Draft saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save draft', 'error');
    }

    setIsDraftSaving(false);
  }, [kpis, achievements, files, step, isSubmitted, showToast]);

  // Load draft function
  const loadDraft = useCallback(() => {
    try {
      const savedDraft = localStorage.getItem('selfAppraisalDraft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setKpis(draftData.kpis || initialKpis);
        setAchievements(draftData.achievements || []);
        setFiles(draftData.files || []);
        setStep(draftData.currentStep || 1);
        setLastSavedAt(new Date(draftData.savedAt));
        setIsDirty(false);
        showToast('Draft loaded successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to load draft', 'error');
    }
  }, [showToast]);

  // Submit functions
  const openSubmitModal = useCallback(() => {
    const errors = validateAllSteps();

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach((error) => showToast(error.message, 'error'));
      return;
    }

    setShowSubmitModal(true);
  }, [validateAllSteps, showToast]);

  const submitAppraisal = useCallback(async () => {
    setIsSubmitting(true);
    setShowSubmitModal(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submissionData = {
      kpis,
      achievements,
      files,
      weightedScore,
      submittedAt: new Date().toISOString()
    };

    try {
      // Simulate submission
      console.log('Submitting appraisal:', submissionData);

      // Clear draft from storage
      localStorage.removeItem('selfAppraisalDraft');

      setIsSubmitted(true);
      setIsDirty(false);
      showToast('Appraisal submitted successfully!', 'success');
    } catch (error) {
      showToast('Failed to submit appraisal. Please try again.', 'error');
    }

    setIsSubmitting(false);
  }, [kpis, achievements, files, weightedScore, showToast]);

  // Star Rating Component
  const StarRating = ({
    value,
    onChange,
    disabled = false




  }: {value: number;onChange: (v: number) => void;disabled?: boolean;}) =>
  <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) =>
    <button
      key={i}
      onClick={() => !disabled && onChange(i)}
      disabled={disabled}
      className={`focus:outline-none transition-transform ${!disabled ? 'hover:scale-110' : 'cursor-not-allowed opacity-60'}`}
      title={`Rate ${i} star${i > 1 ? 's' : ''}`}>

          <Star
        className={`w-5 h-5 ${i <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />

        </button>
    )}
    </div>;


  // Toast Component
  const ToastContainer = () =>
  <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
    <div
      key={toast.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      toast.type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-blue-500 text-white'}`
      }>

          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
        onClick={() => removeToast(toast.id)}
        className="ml-auto hover:opacity-80">

            <X className="w-4 h-4" />
          </button>
        </div>
    )}
    </div>;


  // Confirmation Modal Component
  const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    isLoading = false,
    variant = 'primary'










  }: {isOpen: boolean;title: string;message: string;confirmText: string;cancelText: string;onConfirm: () => void;onCancel: () => void;isLoading?: boolean;variant?: 'primary' | 'danger';}) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'outline' : 'primary'}
              onClick={onConfirm}
              disabled={isLoading}
              className={variant === 'danger' ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}>

              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>);

  };

  const steps = [
  { num: 1, label: 'KPI Ratings', icon: Star },
  { num: 2, label: 'Achievements', icon: Award },
  { num: 3, label: 'Evidence & Submit', icon: Upload }];


  // If submitted, show success state
  if (isSubmitted) {
    return (
      <div className="space-y-6 p-6">
        <ToastContainer />
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Appraisal Submitted Successfully!
          </h1>
          <p className="text-gray-600 text-center max-w-md mb-6">
            Your self-appraisal has been submitted for review. You will be notified once your supervisor completes their assessment.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Submission Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Weighted Score</span>
                <span className="text-sm font-semibold text-blue-600">{weightedScore.toFixed(2)} / 5.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Achievements</span>
                <span className="text-sm font-semibold">{achievements.length} entries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Evidence Files</span>
                <span className="text-sm font-semibold">{files.length} uploaded</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Submitted At</span>
                <span className="text-sm font-semibold">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="space-y-6 p-6">
      <ToastContainer />
      
      {/* Delete Achievement Modal */}
      <ConfirmationModal
        isOpen={showDeleteAchModal !== null}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => showDeleteAchModal && removeAch(showDeleteAchModal)}
        onCancel={() => setShowDeleteAchModal(null)}
        variant="danger" />


      {/* Delete File Modal */}
      <ConfirmationModal
        isOpen={showDeleteFileModal !== null}
        title="Delete File"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => showDeleteFileModal && removeFile(showDeleteFileModal)}
        onCancel={() => setShowDeleteFileModal(null)}
        variant="danger" />


      {/* Submit Confirmation Modal */}
      <ConfirmationModal
        isOpen={showSubmitModal}
        title="Submit Appraisal"
        message="Once submitted, you cannot edit your self-appraisal. Are you sure you want to proceed?"
        confirmText="Submit"
        cancelText="Cancel"
        onConfirm={submitAppraisal}
        onCancel={() => setShowSubmitModal(false)}
        isLoading={isSubmitting} />


      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Self Appraisal Entry
          </h1>
          <p className="text-sm text-gray-500">
            Annual Review 2024-25 · Teaching Staff Template
            {lastSavedAt &&
            <span className="ml-2 text-green-600">
                · Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            }
            {isDirty && !lastSavedAt &&
            <span className="ml-2 text-amber-600">· Unsaved changes</span>
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={saveDraft}
            disabled={isDraftSaving || isSubmitting}>

            {isDraftSaving ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Save className="w-4 h-4 mr-2" />
            }
            {isDraftSaving ? 'Saving...' : 'Save Draft'}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Overall Progress
          </span>
          <span className="text-sm font-bold text-blue-600">
            {completionPct}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${completionPct}%` }} />

        </div>
        <div className="flex items-center justify-between mt-4">
          {steps.map((s, i) =>
          <Fragment key={s.num}>
              <button
              onClick={() => goToStep(s.num)}
              className="flex items-center gap-2 focus:outline-none">

                <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === s.num ?
                'bg-blue-600 text-white' :
                step > s.num ?
                'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'}`
                }>

                  {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span
                className={`text-sm font-medium ${
                step === s.num ? 'text-blue-600' : 'text-gray-500'}`
                }>

                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 &&
            <div
              className={`flex-1 h-0.5 mx-3 transition-colors ${
              step > s.num ? 'bg-green-500' : 'bg-gray-200'}`
              } />

            }
            </Fragment>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Please fix the following issues:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) =>
              <li key={index} className="text-sm text-red-700">
                    {error.message}
                  </li>
              )}
              </ul>
            </div>
          </div>
        </div>
      }

      {/* Step 1: KPI Ratings */}
      {step === 1 &&
      <Card title="KPI Self-Assessment">
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <Info className="w-4 h-4 text-blue-600" />
            <p className="text-sm text-blue-800">
              Rate yourself honestly on each competency. Provide justification
              for ratings of 4 or 5.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Competency
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-24">
                    Weight %
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 w-40">
                    Self Rating
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Justification
                  </th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi) =>
              <tr
                key={kpi.id}
                className={`border-b border-gray-100 ${
                kpi.rating >= 4 && !kpi.justification.trim() ?
                'bg-amber-50' :
                ''}`
                }>

                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900">
                        {kpi.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-7 rounded bg-gray-100 text-sm font-semibold text-gray-700">
                        {kpi.weightage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StarRating
                    value={kpi.rating}
                    onChange={(v) => setRating(kpi.id, v)}
                    disabled={isSubmitted} />

                    </td>
                    <td className="py-3 px-4">
                      <textarea
                    value={kpi.justification}
                    onChange={(e) => setJustification(kpi.id, e.target.value)}
                    placeholder={kpi.rating >= 4 ? "Justification required for high ratings..." : "Brief justification..."}
                    rows={1}
                    disabled={isSubmitted}
                    className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                    kpi.rating >= 4 && !kpi.justification.trim() ?
                    'border-amber-400 bg-amber-50' :
                    'border-gray-300'} ${
                    isSubmitted ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Rated:{' '}
                <span className={`font-bold ${totalRated === totalKpis ? 'text-green-600' : ''}`}>
                  {totalRated}/{totalKpis}
                </span>
              </span>
              <span className="text-sm text-gray-600">
                Weighted Score:{' '}
                <span className="font-bold text-blue-600">
                  {weightedScore.toFixed(2)} / 5.00
                </span>
              </span>
            </div>
          </div>
        </Card>
      }

      {/* Step 2: Achievements */}
      {step === 2 &&
      <Card title="Achievements & Awards">
          <div className="space-y-4">
            {achievements.length === 0 && !showAchForm &&
          <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No achievements added yet.</p>
                <p className="text-xs mt-1">Click the button below to add your first achievement.</p>
              </div>
          }
            {achievements.map((ach) =>
          <div
            key={ach.id}
            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">

                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {ach.title}
                    </h4>
                    {ach.category &&
                <Badge variant="secondary">{ach.category}</Badge>
                }
                  </div>
                  <p className="text-sm text-gray-600">{ach.description}</p>
                  {ach.date &&
              <p className="text-xs text-gray-400 mt-1">
                      {new Date(ach.date).toLocaleDateString()}
                    </p>
              }
                </div>
                <button
              onClick={() => confirmDeleteAchievement(ach.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              disabled={isSubmitted}
              title="Delete achievement">

                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
          )}
            {showAchForm ?
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
                <Input
              label="Title *"
              value={newAch.title}
              onChange={(e) =>
              setNewAch((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Achievement title" />

                <Textarea
              label="Description"
              value={newAch.description}
              onChange={(e) =>
              setNewAch((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Brief description" />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                label="Date"
                type="date"
                value={newAch.date}
                onChange={(e) =>
                setNewAch((p) => ({ ...p, date: e.target.value }))
                } />

                  <Select
                label="Category"
                options={[
                { value: '', label: 'Select...' },
                { value: 'Award', label: 'Award' },
                { value: 'Publication', label: 'Publication' },
                { value: 'Training', label: 'Training' },
                { value: 'Other', label: 'Other' }]
                }
                value={newAch.category}
                onChange={(e) =>
                setNewAch((p) => ({ ...p, category: e.target.value }))
                } />

                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={addAchievement}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Achievement
                  </Button>
                  <Button variant="outline" size="sm" onClick={cancelAchievementForm}>
                    Cancel
                  </Button>
                </div>
              </div> :

          <Button
            variant="outline"
            onClick={() => setShowAchForm(true)}
            disabled={isSubmitted}>

                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
          }
          </div>
        </Card>
      }

      {/* Step 3: Evidence & Submit */}
      {step === 3 &&
      <div className="space-y-6">
          <Card title="Evidence Upload">
            <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileInputChange}
            className="hidden" />

            <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors cursor-pointer ${
            isDragging ?
            'border-blue-400 bg-blue-50' :
            'border-gray-300 hover:border-blue-400'} ${
            isUploading ? 'pointer-events-none opacity-60' : ''}`}>

              {isUploading ?
            <>
                  <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-3 animate-spin" />
                  <p className="text-sm font-medium text-gray-700">
                    Uploading files...
                  </p>
                </> :

            <>
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ?
                'Drop files here...' :
                'Drag & drop files here or click to browse'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, JPG, PNG up to 10MB each
                  </p>
                </>
            }
            </div>
            {files.length > 0 &&
          <div className="space-y-2">
                {files.map((f) =>
            <div
              key={f.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">

                    {f.type === 'pdf' ?
              <FileText className="w-5 h-5 text-red-500" /> :
              f.type === 'image' ?
              <Image className="w-5 h-5 text-blue-500" /> :

              <FileText className="w-5 h-5 text-gray-500" />
              }
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-500">{f.size}</p>
                    </div>
                    <button
                onClick={() => confirmDeleteFile(f.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={isSubmitted}
                title="Delete file">

                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
            )}
              </div>
          }
          </Card>

          <Card title="Review Summary">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-600">Weighted Score</p>
                <p className="text-2xl font-bold text-blue-700">
                  {weightedScore.toFixed(2)}
                </p>
                <p className="text-xs text-blue-500">out of 5.00</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-amber-600">Achievements</p>
                <p className="text-2xl font-bold text-amber-700">
                  {achievements.length}
                </p>
                <p className="text-xs text-amber-500">entries added</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-xs text-green-600">Evidence Files</p>
                <p className="text-2xl font-bold text-green-700">
                  {files.length}
                </p>
                <p className="text-xs text-green-500">uploaded</p>
              </div>
            </div>

            {/* KPI Summary */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">KPI Ratings Summary</h4>
              <div className="grid grid-cols-2 gap-2">
                {kpis.map((kpi) =>
              <div key={kpi.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">{kpi.name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) =>
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i <= kpi.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />

                  )}
                    </div>
                  </div>
              )}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm text-amber-800">
                Once submitted, you cannot edit your self-appraisal. Please
                review carefully.
              </p>
            </div>
          </Card>
        </div>
      }

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <Button
          variant="outline"
          onClick={goToPreviousStep}
          disabled={step === 1 || isSubmitting}>

          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={saveDraft}
            disabled={isDraftSaving || isSubmitting}>

            {isDraftSaving ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Save className="w-4 h-4 mr-2" />
            }
            Save Draft
          </Button>
          {step < 3 ?
          <Button
            variant="primary"
            onClick={goToNextStep}
            disabled={isSubmitting}>

              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button> :

          <Button
            variant="primary"
            onClick={openSubmitModal}
            disabled={isSubmitting}>

              {isSubmitting ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Send className="w-4 h-4 mr-2" />
            }
              {isSubmitting ? 'Submitting...' : 'Submit Appraisal'}
            </Button>
          }
        </div>
      </div>
    </div>);

}