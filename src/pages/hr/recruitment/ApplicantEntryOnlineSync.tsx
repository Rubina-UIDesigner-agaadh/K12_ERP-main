import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  Building,
  X,
  UserPlus,
  Upload,
  Search,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  Tag,
  Plus,
  FileText,
  Users,
  Globe,
  Phone,
  Loader2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Link,
  ExternalLink,
  Copy,
  Check,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  Clock } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
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


const POSITIONS = [
{ value: '', label: 'Select Position' },
{ value: 'Math Teacher', label: 'Math Teacher' },
{ value: 'Science Teacher', label: 'Science Teacher' },
{ value: 'English Teacher', label: 'English Teacher' },
{ value: 'Hindi Teacher', label: 'Hindi Teacher' },
{ value: 'Computer Teacher', label: 'Computer Teacher' },
{ value: 'PE Teacher', label: 'PE Teacher' },
{ value: 'Art Teacher', label: 'Art Teacher' },
{ value: 'Admin Officer', label: 'Admin Officer' },
{ value: 'Librarian', label: 'Librarian' },
{ value: 'Lab Assistant', label: 'Lab Assistant' }];


const SOURCES = [
{ value: '', label: 'Select Source' },
{ value: 'Website', label: 'School Website' },
{ value: 'Naukri', label: 'Naukri.com' },
{ value: 'LinkedIn', label: 'LinkedIn' },
{ value: 'Indeed', label: 'Indeed' },
{ value: 'Referral', label: 'Referral' },
{ value: 'Walk-in', label: 'Walk-in' },
{ value: 'Social Media', label: 'Social Media' },
{ value: 'Campus', label: 'Campus Recruitment' }];


interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  position: string;
  subject: string;
  qualification: string;
  experience: string;
  source: string;
  expectedSalary: string;
  tags: string[];
  resume?: UploadedFile;
  certifications: UploadedFile[];
  branch: string;
  status: 'New' | 'Screening' | 'Interview' | 'Shortlisted' | 'Rejected' | 'Hired';
  createdAt: string;
  updatedAt: string;
}

interface OnlineApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  source: string;
  date: string;
  status: 'New' | 'Synced' | 'Duplicate' | 'Importing';
  resumeUrl?: string;
  qualification?: string;
  experience?: string;
}

interface BulkUploadResult {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
  errors: Array<{row: number;error: string;}>;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  position: string;
  subject: string;
  qualification: string;
  experience: string;
  source: string;
  expectedSalary: string;
  tags: string[];
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  position: '',
  subject: '',
  qualification: '',
  experience: '',
  source: '',
  expectedSalary: '',
  tags: []
};

const initialApplicants: Applicant[] = [
{
  id: 'APP-2024-001',
  firstName: 'Priya',
  lastName: 'Sharma',
  email: 'priya@email.com',
  phone: '+91 98765 43210',
  address: '123, Sector 15, Noida',
  position: 'Math Teacher',
  subject: 'Mathematics',
  qualification: 'M.Sc Mathematics, B.Ed',
  experience: '5',
  source: 'LinkedIn',
  expectedSalary: '45000',
  tags: ['Experienced', 'Senior'],
  branch: 'main',
  status: 'Screening',
  certifications: [],
  createdAt: '2024-12-01',
  updatedAt: '2024-12-01'
},
{
  id: 'APP-2024-002',
  firstName: 'Rahul',
  lastName: 'Verma',
  email: 'rahul.verma@email.com',
  phone: '+91 98765 43211',
  address: '456, MG Road, Delhi',
  position: 'Science Teacher',
  subject: 'Physics',
  qualification: 'M.Sc Physics, B.Ed',
  experience: '3',
  source: 'Naukri',
  expectedSalary: '40000',
  tags: ['Physics', 'Lab Experience'],
  branch: 'main',
  status: 'New',
  certifications: [],
  createdAt: '2024-12-05',
  updatedAt: '2024-12-05'
}];


const initialOnlineApplications: OnlineApplication[] = [
{
  id: 'OA-001',
  name: 'Ravi Kumar',
  email: 'ravi@email.com',
  phone: '+91 98765 11111',
  position: 'Math Teacher',
  source: 'Naukri',
  date: '2024-12-15',
  status: 'New',
  qualification: 'M.Sc Mathematics',
  experience: '4 years'
},
{
  id: 'OA-002',
  name: 'Sita Devi',
  email: 'sita@email.com',
  phone: '+91 98765 22222',
  position: 'Science Teacher',
  source: 'LinkedIn',
  date: '2024-12-14',
  status: 'Synced',
  qualification: 'M.Sc Chemistry',
  experience: '6 years'
},
{
  id: 'OA-003',
  name: 'Mohan Das',
  email: 'priya@email.com',
  phone: '+91 98765 33333',
  position: 'Admin Officer',
  source: 'Indeed',
  date: '2024-12-13',
  status: 'Duplicate',
  qualification: 'MBA',
  experience: '2 years'
},
{
  id: 'OA-004',
  name: 'Geeta Sharma',
  email: 'geeta@email.com',
  phone: '+91 98765 44444',
  position: 'English Teacher',
  source: 'Website',
  date: '2024-12-12',
  status: 'New',
  qualification: 'M.A English, B.Ed',
  experience: '3 years'
},
{
  id: 'OA-005',
  name: 'Vikram Singh',
  email: 'vikram.singh@email.com',
  phone: '+91 98765 55555',
  position: 'PE Teacher',
  source: 'Indeed',
  date: '2024-12-11',
  status: 'New',
  qualification: 'B.P.Ed, M.P.Ed',
  experience: '5 years'
}];


export function ApplicantEntryOnlineSync() {
  // Existing state
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [activeTab, setActiveTab] = useState<'manual' | 'online' | 'bulk'>('manual');
  const [tagInput, setTagInput] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  // New state for interactive features
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [onlineApplications, setOnlineApplications] = useState<OnlineApplication[]>(initialOnlineApplications);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // File upload state
  const [resumeFile, setResumeFile] = useState<UploadedFile | null>(null);
  const [certificationFiles, setCertificationFiles] = useState<UploadedFile[]>([]);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [bulkUploadResult, setBulkUploadResult] = useState<BulkUploadResult | null>(null);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [duplicateApplicant, setDuplicateApplicant] = useState<Applicant | null>(null);
  const [selectedOnlineApp, setSelectedOnlineApp] = useState<OnlineApplication | null>(null);

  // Generated ID state
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [idCopied, setIdCopied] = useState(false);

  // File input refs
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  // Toast functions
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Branch handling (existing)
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

  // Tag management (existing with enhancement)
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((f) => ({
        ...f,
        tags: [...f.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setForm((f) => ({
      ...f,
      tags: f.tags.filter((_, idx) => idx !== index)
    }));
  };

  // Duplicate check (enhanced)
  const checkDuplicate = useCallback(() => {
    if (!form.email) {
      setDuplicateWarning(false);
      setDuplicateApplicant(null);
      return;
    }

    const existing = applicants.find(
      (a) => a.email.toLowerCase() === form.email.toLowerCase()
    );

    if (existing) {
      setDuplicateWarning(true);
      setDuplicateApplicant(existing);
    } else {
      setDuplicateWarning(false);
      setDuplicateApplicant(null);
    }
  }, [form.email, applicants]);

  // Check duplicate by phone
  const checkDuplicatePhone = useCallback(() => {
    if (!form.phone) return;

    const existing = applicants.find((a) => a.phone === form.phone);
    if (existing && !duplicateWarning) {
      setDuplicateWarning(true);
      setDuplicateApplicant(existing);
    }
  }, [form.phone, applicants, duplicateWarning]);

  // Generate application ID
  const generateApplicationId = () => {
    const year = new Date().getFullYear();
    const existingIds = applicants.
    filter((a) => a.id.startsWith(`APP-${year}`)).
    map((a) => parseInt(a.id.split('-')[2]));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `APP-${year}-${String(nextNum).padStart(3, '0')}`;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(form.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone format';
    }
    if (!form.position) errors.position = 'Position is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save applicant
  const handleSaveApplicant = async (addAnother: boolean = false) => {
    if (!validateForm()) {
      addToast('error', 'Please fix the form errors');
      return;
    }

    if (duplicateWarning) {
      setShowDuplicateModal(true);
      return;
    }

    await saveApplicantData(addAnother);
  };

  const saveApplicantData = async (addAnother: boolean = false) => {
    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newId = generateApplicationId();
      const currentDate = new Date().toISOString().split('T')[0];

      const newApplicant: Applicant = {
        id: newId,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        position: form.position,
        subject: form.subject,
        qualification: form.qualification,
        experience: form.experience,
        source: form.source,
        expectedSalary: form.expectedSalary,
        tags: form.tags,
        resume: resumeFile || undefined,
        certifications: certificationFiles,
        branch: selectedBranches[0] || 'main',
        status: 'New',
        createdAt: currentDate,
        updatedAt: currentDate
      };

      setApplicants((prev) => [newApplicant, ...prev]);
      setGeneratedId(newId);

      addToast('success', `Applicant saved successfully! ID: ${newId}`);

      if (addAnother) {
        resetForm();
      } else {

        // Keep the form data but show the generated ID
      }} catch (error) {
      addToast('error', 'Failed to save applicant. Please try again.');
    } finally {
      setIsSaving(false);
      setShowDuplicateModal(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm(initialFormData);
    setFormErrors({});
    setDuplicateWarning(false);
    setDuplicateApplicant(null);
    setResumeFile(null);
    setCertificationFiles([]);
    setGeneratedId(null);
    setTagInput('');
    addToast('info', 'Form has been reset');
  };

  // Copy ID to clipboard
  const copyIdToClipboard = async () => {
    if (generatedId) {
      try {
        await navigator.clipboard.writeText(generatedId);
        setIdCopied(true);
        addToast('success', 'Application ID copied to clipboard');
        setTimeout(() => setIdCopied(false), 2000);
      } catch (error) {
        addToast('error', 'Failed to copy ID');
      }
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      addToast('error', 'Please upload PDF or DOC/DOCX file only');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'File size must be less than 5MB');
      return;
    }

    setUploadingResume(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };

      setResumeFile(uploadedFile);
      addToast('success', `Resume "${file.name}" uploaded successfully`);
    } catch (error) {
      addToast('error', 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  // Handle certification upload
  const handleCertificationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingCert(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
        id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      }));

      setCertificationFiles((prev) => [...prev, ...newFiles]);
      addToast('success', `${files.length} certificate(s) uploaded successfully`);
    } catch (error) {
      addToast('error', 'Failed to upload certificates');
    } finally {
      setUploadingCert(false);
    }
  };

  // Remove uploaded file
  const removeResumeFile = () => {
    setResumeFile(null);
    addToast('info', 'Resume removed');
  };

  const removeCertificationFile = (fileId: string) => {
    setCertificationFiles((prev) => prev.filter((f) => f.id !== fileId));
    addToast('info', 'Certificate removed');
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Online sync functionality
  const handleSyncNow = async () => {
    setIsSyncing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate finding new applications
      const newApps: OnlineApplication[] = [
      {
        id: `OA-${String(onlineApplications.length + 1).padStart(3, '0')}`,
        name: 'New Applicant',
        email: `new${Date.now()}@email.com`,
        phone: '+91 98765 99999',
        position: 'Science Teacher',
        source: 'LinkedIn',
        date: new Date().toISOString().split('T')[0],
        status: 'New',
        qualification: 'M.Sc Biology',
        experience: '2 years'
      }];


      setOnlineApplications((prev) => [...newApps, ...prev]);
      addToast('success', `Sync complete! ${newApps.length} new application(s) found`);
    } catch (error) {
      addToast('error', 'Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Import online application
  const handleImportApplication = async (app: OnlineApplication) => {
    // Check for duplicates first
    const existing = applicants.find(
      (a) => a.email.toLowerCase() === app.email.toLowerCase()
    );

    if (existing) {
      setSelectedOnlineApp(app);
      setDuplicateApplicant(existing);
      setShowDuplicateModal(true);
      return;
    }

    // Update status to importing
    setOnlineApplications((prev) =>
    prev.map((a) => a.id === app.id ? { ...a, status: 'Importing' as const } : a)
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const nameParts = app.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      const newId = generateApplicationId();
      const currentDate = new Date().toISOString().split('T')[0];

      const newApplicant: Applicant = {
        id: newId,
        firstName,
        lastName,
        email: app.email,
        phone: app.phone,
        position: app.position,
        subject: '',
        qualification: app.qualification || '',
        experience: app.experience?.replace(' years', '') || '',
        source: app.source,
        expectedSalary: '',
        tags: ['Imported', app.source],
        branch: selectedBranches[0] || 'main',
        status: 'New',
        certifications: [],
        createdAt: currentDate,
        updatedAt: currentDate
      };

      setApplicants((prev) => [newApplicant, ...prev]);

      // Update online application status
      setOnlineApplications((prev) =>
      prev.map((a) => a.id === app.id ? { ...a, status: 'Synced' as const } : a)
      );

      addToast('success', `${app.name} imported successfully! ID: ${newId}`);
    } catch (error) {
      setOnlineApplications((prev) =>
      prev.map((a) => a.id === app.id ? { ...a, status: 'New' as const } : a)
      );
      addToast('error', `Failed to import ${app.name}`);
    }
  };

  // Review duplicate
  const handleReviewDuplicate = (app: OnlineApplication) => {
    const existing = applicants.find(
      (a) => a.email.toLowerCase() === app.email.toLowerCase()
    );
    if (existing) {
      setSelectedOnlineApp(app);
      setDuplicateApplicant(existing);
      setShowDuplicateModal(true);
    }
  };

  // Force import (ignore duplicate)
  const handleForceImport = async () => {
    if (selectedOnlineApp) {
      setShowDuplicateModal(false);

      // Update status to importing
      setOnlineApplications((prev) =>
      prev.map((a) => a.id === selectedOnlineApp.id ? { ...a, status: 'Importing' as const } : a)
      );

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const nameParts = selectedOnlineApp.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || '';

        const newId = generateApplicationId();
        const currentDate = new Date().toISOString().split('T')[0];

        const newApplicant: Applicant = {
          id: newId,
          firstName,
          lastName,
          email: selectedOnlineApp.email,
          phone: selectedOnlineApp.phone,
          position: selectedOnlineApp.position,
          subject: '',
          qualification: selectedOnlineApp.qualification || '',
          experience: selectedOnlineApp.experience?.replace(' years', '') || '',
          source: selectedOnlineApp.source,
          expectedSalary: '',
          tags: ['Imported', selectedOnlineApp.source, 'Duplicate Ignored'],
          branch: selectedBranches[0] || 'main',
          status: 'New',
          certifications: [],
          createdAt: currentDate,
          updatedAt: currentDate
        };

        setApplicants((prev) => [newApplicant, ...prev]);

        setOnlineApplications((prev) =>
        prev.map((a) => a.id === selectedOnlineApp.id ? { ...a, status: 'Synced' as const } : a)
        );

        addToast('success', `${selectedOnlineApp.name} imported (duplicate ignored)! ID: ${newId}`);
      } catch (error) {
        setOnlineApplications((prev) =>
        prev.map((a) => a.id === selectedOnlineApp.id ? { ...a, status: 'Duplicate' as const } : a)
        );
        addToast('error', 'Failed to import application');
      }

      setSelectedOnlineApp(null);
      setDuplicateApplicant(null);
    } else if (form.email) {
      // Force save from manual entry
      await saveApplicantData(false);
    }
  };

  // Bulk upload functionality
  const handleBulkFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'];


    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      addToast('error', 'Please upload Excel or CSV file only');
      return;
    }

    setBulkFile(file);
    setBulkUploadResult(null);
    addToast('info', `File "${file.name}" selected. Click "Process Upload" to continue.`);
  };

  const handleProcessBulkUpload = async () => {
    if (!bulkFile) {
      addToast('error', 'Please select a file first');
      return;
    }

    setIsProcessingBulk(true);
    setBulkUploadProgress(0);

    try {
      // Simulate processing
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setBulkUploadProgress(i);
      }

      // Simulate results
      const result: BulkUploadResult = {
        total: 25,
        successful: 20,
        failed: 3,
        duplicates: 2,
        errors: [
        { row: 5, error: 'Invalid email format' },
        { row: 12, error: 'Missing required field: Position' },
        { row: 18, error: 'Phone number already exists' }]

      };

      setBulkUploadResult(result);

      // Add simulated applicants
      const newApplicants: Applicant[] = Array.from({ length: result.successful }, (_, i) => ({
        id: generateApplicationId(),
        firstName: `Bulk${i + 1}`,
        lastName: 'Applicant',
        email: `bulk${Date.now()}${i}@email.com`,
        phone: `+91 9876${String(i).padStart(6, '0')}`,
        position: POSITIONS[Math.floor(Math.random() * (POSITIONS.length - 1)) + 1].value,
        subject: '',
        qualification: 'Graduate',
        experience: String(Math.floor(Math.random() * 10)),
        source: 'Bulk Upload',
        expectedSalary: String(30000 + Math.floor(Math.random() * 20000)),
        tags: ['Bulk Upload'],
        branch: selectedBranches[0] || 'main',
        status: 'New',
        certifications: [],
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }));

      setApplicants((prev) => [...newApplicants, ...prev]);

      addToast(
        'success',
        `Bulk upload complete: ${result.successful} imported, ${result.duplicates} duplicates, ${result.failed} failed`
      );
    } catch (error) {
      addToast('error', 'Bulk upload failed. Please try again.');
    } finally {
      setIsProcessingBulk(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Position',
    'Subject',
    'Qualification',
    'Experience (Years)',
    'Source',
    'Expected Salary',
    'Tags'];


    const sampleData = [
    ['John', 'Doe', 'john@email.com', '+91 9876543210', 'Math Teacher', 'Mathematics', 'M.Sc, B.Ed', '5', 'Website', '45000', 'Experienced'],
    ['Jane', 'Smith', 'jane@email.com', '+91 9876543211', 'Science Teacher', 'Physics', 'M.Sc Physics', '3', 'Referral', '40000', 'Physics']];


    const csvContent = [
    headers.join(','),
    ...sampleData.map((row) => row.map((cell) => `"${cell}"`).join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Applicant_Upload_Template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast('success', 'Template downloaded successfully');
  };

  // View applicant details
  const openViewModal = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowViewModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowViewModal(false);
    setShowDuplicateModal(false);
    setSelectedApplicant(null);
    setDuplicateApplicant(null);
    setSelectedOnlineApp(null);
  };

  // Stats
  const newApplicationsCount = onlineApplications.filter((a) => a.status === 'New').length;

  // Toast Notifications Component
  const ToastNotifications = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) =>
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ?
          'bg-green-500 text-white' :
          toast.type === 'error' ?
          'bg-red-500 text-white' :
          toast.type === 'warning' ?
          'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'}`
          }>

            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="ml-2 hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>);

  };

  // View Applicant Modal
  const ViewModal = () => {
    if (!showViewModal || !selectedApplicant) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedApplicant.firstName} {selectedApplicant.lastName}
              </h2>
              <p className="text-sm text-gray-500">{selectedApplicant.id}</p>
            </div>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{selectedApplicant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{selectedApplicant.phone}</span>
              </div>
              {selectedApplicant.address &&
              <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{selectedApplicant.address}</span>
                </div>
              }
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-medium">{selectedApplicant.position}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium">{selectedApplicant.subject || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Qualification</p>
                <p className="font-medium">{selectedApplicant.qualification || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{selectedApplicant.experience ? `${selectedApplicant.experience} years` : '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium">{selectedApplicant.source || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Expected Salary</p>
                <p className="font-medium">
                  {selectedApplicant.expectedSalary ? `₹${parseInt(selectedApplicant.expectedSalary).toLocaleString()}` : '—'}
                </p>
              </div>
            </div>

            {selectedApplicant.tags.length > 0 &&
            <div>
                <p className="text-sm text-gray-500 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selectedApplicant.tags.map((tag, i) =>
                <span key={i} className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">
                      {tag}
                    </span>
                )}
                </div>
              </div>
            }

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{selectedApplicant.createdAt}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {selectedApplicant.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals}>
              Close
            </Button>
          </div>
        </div>
      </div>);

  };

  // Duplicate Warning Modal
  const DuplicateModal = () => {
    if (!showDuplicateModal || !duplicateApplicant) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeAllModals} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Duplicate Detected</h2>
            <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">This applicant may already exist</p>
                <p className="text-sm text-gray-600">An applicant with similar details was found in the system.</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-2">Existing Applicant</p>
              <p className="font-medium">{duplicateApplicant.firstName} {duplicateApplicant.lastName}</p>
              <p className="text-sm text-gray-600">{duplicateApplicant.email}</p>
              <p className="text-sm text-gray-600">{duplicateApplicant.phone}</p>
              <p className="text-xs text-gray-400 mt-2">ID: {duplicateApplicant.id}</p>
            </div>

            <p className="text-sm text-gray-600 mb-4">What would you like to do?</p>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={closeAllModals}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                closeAllModals();
                openViewModal(duplicateApplicant);
              }}>

              <Eye className="w-4 h-4 mr-2" />
              View Existing
            </Button>
            <Button onClick={handleForceImport}>
              <Plus className="w-4 h-4 mr-2" />
              Add Anyway
            </Button>
          </div>
        </div>
      </div>);

  };

  return (
    <div className="space-y-6 pb-8">
      <ToastNotifications />
      <ViewModal />
      <DuplicateModal />

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={resumeInputRef}
        onChange={handleResumeUpload}
        accept=".pdf,.doc,.docx"
        className="hidden" />

      <input
        type="file"
        ref={certInputRef}
        onChange={handleCertificationUpload}
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="hidden" />

      <input
        type="file"
        ref={bulkInputRef}
        onChange={handleBulkFileSelect}
        accept=".xlsx,.xls,.csv"
        className="hidden" />


      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <UserPlus className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applicant Entry / Online Sync</h1>
              <p className="text-sm text-gray-500">Add candidates manually or sync from online portals</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={setAcademicYear}
              className="w-36" />

            <div className="text-sm text-gray-500">
              Total Applicants: <span className="font-semibold text-gray-900">{applicants.length}</span>
            </div>
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

        <div className="mt-4 flex gap-1 border-b border-gray-200">
          {(['manual', 'online', 'bulk'] as const).map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === tab ?
            'border-teal-600 text-teal-600' :
            'border-transparent text-gray-500 hover:text-gray-700'}`
            }>

              {tab === 'manual' ? 'Manual Entry' : tab === 'online' ? 'Online Sync' : 'Bulk Upload'}
              {tab === 'online' && newApplicationsCount > 0 &&
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {newApplicationsCount}
                </span>
            }
            </button>
          )}
        </div>
      </Card>

      {activeTab === 'manual' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card title="Candidate Information">
              {duplicateWarning &&
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                      Duplicate detected! A candidate with this email already exists.
                    </p>
                  </div>
                  {duplicateApplicant &&
              <Button
                variant="outline"
                size="xs"
                onClick={() => openViewModal(duplicateApplicant)}>

                      View
                    </Button>
              }
                </div>
            }

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formErrors.firstName ? 'border-red-300' : 'border-gray-300'}`
                  } />

                  {formErrors.firstName &&
                <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>
                }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formErrors.lastName ? 'border-red-300' : 'border-gray-300'}`
                  } />

                  {formErrors.lastName &&
                <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>
                }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onBlur={checkDuplicate}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formErrors.email ? 'border-red-300' : duplicateWarning ? 'border-yellow-300' : 'border-gray-300'}`
                  } />

                  {formErrors.email &&
                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  onBlur={checkDuplicatePhone}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formErrors.phone ? 'border-red-300' : 'border-gray-300'}`
                  } />

                  {formErrors.phone &&
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                }
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Applied <span className="text-red-500">*</span>
                  </label>
                  <select
                  value={form.position}
                  onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                  formErrors.position ? 'border-red-300' : 'border-gray-300'}`
                  }>

                    {POSITIONS.map((pos) =>
                  <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                  )}
                  </select>
                  {formErrors.position &&
                <p className="text-xs text-red-500 mt-1">{formErrors.position}</p>
                }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Specialization
                  </label>
                  <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                  type="text"
                  value={form.qualification}
                  onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))}
                  placeholder="e.g. M.Sc + B.Ed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (Years)
                  </label>
                  <input
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">

                    {SOURCES.map((src) =>
                  <option key={src.value} value={src.value}>
                        {src.label}
                      </option>
                  )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Salary (₹)
                  </label>
                  <input
                  type="number"
                  value={form.expectedSalary}
                  onChange={(e) => setForm((f) => ({ ...f, expectedSalary: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                </div>
              </div>

              {/* File Uploads */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume Upload</label>
                  {resumeFile ?
                <div className="border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-sm font-medium truncate max-w-[150px]">{resumeFile.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(resumeFile.size)}</p>
                        </div>
                      </div>
                      <button
                    onClick={removeResumeFile}
                    className="p-1 hover:bg-red-50 rounded text-red-500">

                        <X className="w-4 h-4" />
                      </button>
                    </div> :

                <div
                  onClick={() => resumeInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 cursor-pointer transition-colors">

                      {uploadingResume ?
                  <Loader2 className="w-6 h-6 text-teal-600 mx-auto mb-1 animate-spin" /> :

                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  }
                      <p className="text-xs text-gray-500">
                        {uploadingResume ? 'Uploading...' : 'Click to upload PDF/DOC'}
                      </p>
                    </div>
                }
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certifications Upload
                  </label>
                  {certificationFiles.length > 0 ?
                <div className="border border-gray-300 rounded-lg p-2 space-y-1 max-h-[100px] overflow-y-auto">
                      {certificationFiles.map((file) =>
                  <div key={file.id} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                          <span className="text-xs truncate max-w-[120px]">{file.name}</span>
                          <button
                      onClick={() => removeCertificationFile(file.id)}
                      className="p-0.5 hover:bg-red-50 rounded text-red-500">

                            <X className="w-3 h-3" />
                          </button>
                        </div>
                  )}
                      <button
                    onClick={() => certInputRef.current?.click()}
                    className="w-full text-xs text-teal-600 hover:underline">

                        + Add more
                      </button>
                    </div> :

                <div
                  onClick={() => certInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-400 cursor-pointer transition-colors">

                      {uploadingCert ?
                  <Loader2 className="w-6 h-6 text-teal-600 mx-auto mb-1 animate-spin" /> :

                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  }
                      <p className="text-xs text-gray-500">
                        {uploadingCert ? 'Uploading...' : 'Upload certificates'}
                      </p>
                    </div>
                }
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  <Button variant="outline" size="sm" onClick={addTag}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map((tag, i) =>
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs">

                      <Tag className="w-3 h-3" />
                      {tag}
                      <button onClick={() => removeTag(i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-3">
                <Button variant="primary" onClick={() => handleSaveApplicant(false)} disabled={isSaving}>
                  {isSaving ?
                <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </> :

                'Save & Generate ID'
                }
                </Button>
                <Button variant="outline" onClick={() => handleSaveApplicant(true)} disabled={isSaving}>
                  Save & Add Another
                </Button>
                <Button variant="ghost" onClick={resetForm} disabled={isSaving}>
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card title="Auto-Generated ID">
              <div className="p-4 bg-teal-50 rounded-xl text-center">
                <p className="text-xs text-teal-600 mb-1">Application ID</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-2xl font-bold font-mono text-teal-700">
                    {generatedId || generateApplicationId()}
                  </p>
                  {generatedId &&
                <button
                  onClick={copyIdToClipboard}
                  className="p-1 hover:bg-teal-100 rounded"
                  title="Copy to clipboard">

                      {idCopied ?
                  <Check className="w-4 h-4 text-green-600" /> :

                  <Copy className="w-4 h-4 text-teal-600" />
                  }
                    </button>
                }
                </div>
                <p className="text-xs text-teal-500 mt-1">
                  {generatedId ? 'ID Generated' : 'Auto-generated on save'}
                </p>
              </div>
            </Card>

            <Card title="Duplicate Check">
              <div className="space-y-2 text-sm">
                <p className="text-gray-500">System checks for duplicates based on:</p>
                <div className="space-y-1">
                  {['Email address', 'Phone number', 'Name + Position'].map((item) =>
                <div key={item} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-teal-500" />
                      {item}
                    </div>
                )}
                </div>
              </div>
            </Card>

            <Card title="Recent Applicants">
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {applicants.slice(0, 5).map((app) =>
              <div
                key={app.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => openViewModal(app)}>

                    <div>
                      <p className="text-sm font-medium">{app.firstName} {app.lastName}</p>
                      <p className="text-xs text-gray-400">{app.position}</p>
                    </div>
                    <span className="text-xs text-teal-600 font-mono">{app.id}</span>
                  </div>
              )}
              </div>
            </Card>
          </div>
        </div>
      }

      {activeTab === 'online' &&
      <Card title="Online Applications Sync">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {newApplicationsCount} new application(s) pending sync
            </p>
            <Button variant="primary" size="sm" onClick={handleSyncNow} disabled={isSyncing}>
              {isSyncing ?
            <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Syncing...
                </> :

            <>
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Sync Now
                </>
            }
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Candidate</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Position</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {onlineApplications.map((app) =>
              <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-xs text-teal-600">{app.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{app.name}</p>
                      <p className="text-xs text-gray-400">{app.email}</p>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{app.position}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {app.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{app.date}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    app.status === 'New' ?
                    'bg-blue-100 text-blue-700' :
                    app.status === 'Synced' ?
                    'bg-green-100 text-green-700' :
                    app.status === 'Importing' ?
                    'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'}`
                    }>

                        {app.status === 'Importing' &&
                    <Loader2 className="w-3 h-3 inline mr-1 animate-spin" />
                    }
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {app.status === 'New' &&
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleImportApplication(app)}>

                          Import
                        </Button>
                  }
                      {app.status === 'Duplicate' &&
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleReviewDuplicate(app)}>

                          Review
                        </Button>
                  }
                      {app.status === 'Synced' &&
                  <span className="text-xs text-green-600 flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Imported
                        </span>
                  }
                      {app.status === 'Importing' &&
                  <span className="text-xs text-purple-600">Processing...</span>
                  }
                    </td>
                  </tr>
              )}
              </tbody>
            </table>

            {onlineApplications.length === 0 &&
          <div className="py-12 text-center text-gray-400">
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No online applications found</p>
                <p className="text-sm">Click "Sync Now" to fetch new applications</p>
              </div>
          }
          </div>
        </Card>
      }

      {activeTab === 'bulk' &&
      <Card title="Bulk Upload">
          <div className="max-w-lg mx-auto py-8 text-center space-y-4">
            <div
            onClick={() => bulkInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-colors ${
            bulkFile ? 'border-teal-400 bg-teal-50' : 'border-gray-300 hover:border-teal-400'}`
            }>

              {isProcessingBulk ?
            <>
                  <Loader2 className="w-12 h-12 text-teal-600 mx-auto mb-3 animate-spin" />
                  <p className="text-gray-600 font-medium">Processing upload...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                  className="bg-teal-600 h-2 rounded-full transition-all"
                  style={{ width: `${bulkUploadProgress}%` }}>
                </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{bulkUploadProgress}% complete</p>
                </> :
            bulkFile ?
            <>
                  <FileSpreadsheet className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">{bulkFile.name}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {formatFileSize(bulkFile.size)} • Click to change file
                  </p>
                </> :

            <>
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Drop Excel/CSV file here</p>
                  <p className="text-sm text-gray-400 mt-1">or click to browse</p>
                </>
            }
            </div>

            {bulkFile && !isProcessingBulk && !bulkUploadResult &&
          <Button variant="primary" onClick={handleProcessBulkUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Process Upload
              </Button>
          }

            {bulkUploadResult &&
          <div className="text-left p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Upload Results</h3>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-2 bg-white rounded">
                    <p className="text-lg font-bold text-gray-900">{bulkUploadResult.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-600">{bulkUploadResult.successful}</p>
                    <p className="text-xs text-gray-500">Imported</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="text-lg font-bold text-yellow-600">{bulkUploadResult.duplicates}</p>
                    <p className="text-xs text-gray-500">Duplicates</p>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <p className="text-lg font-bold text-red-600">{bulkUploadResult.failed}</p>
                    <p className="text-xs text-gray-500">Failed</p>
                  </div>
                </div>

                {bulkUploadResult.errors.length > 0 &&
            <div className="border-t pt-3">
                    <p className="text-sm font-medium text-red-600 mb-2">Errors:</p>
                    <div className="space-y-1 max-h-[100px] overflow-y-auto">
                      {bulkUploadResult.errors.map((err, i) =>
                <p key={i} className="text-xs text-gray-600">
                          Row {err.row}: {err.error}
                        </p>
                )}
                    </div>
                  </div>
            }

                <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setBulkFile(null);
                setBulkUploadResult(null);
              }}>

                  Upload Another File
                </Button>
              </div>
          }

            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-1" />
                Download Template
              </Button>
            </div>

            <p className="text-xs text-gray-400">
              Supports .xlsx, .csv formats. Max 500 records per upload.
            </p>
          </div>
        </Card>
      }
    </div>);

}