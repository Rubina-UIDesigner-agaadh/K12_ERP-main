// File: ApplicantList.tsx

import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import {
  Building,
  X,
  Search,
  Download,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Star,
  Filter,
  RefreshCw,
  FileText,
  Users,
  ChevronRight,
  Award,
  GraduationCap,
  Briefcase,
  Globe,
  Phone,
  Mail,
  Plus,
  Loader2,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Send,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Upload,
  FileUp,
  Check,
  MoreVertical,
  ArrowUpRight,
  MessageSquare,
  Printer,
  Copy } from
'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
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


const STAGES_ORDER: Stage[] = [
'Applied',
'Screened',
'Shortlisted',
'Interviewed',
'Selected',
'Offered',
'Joined'];


type Stage =
'Applied' |
'Screened' |
'Shortlisted' |
'Interviewed' |
'Selected' |
'Offered' |
'Joined' |
'Rejected';

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  position: string;
  subject?: string;
  qualification: string;
  experience: number;
  source: string;
  stage: Stage;
  rating: number;
  status: 'Active' | 'Rejected' | 'On Hold';
  appliedDate: string;
  branch: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: string;
  rejectionReason?: string;
  resumeUrl?: string;
  skills?: string[];
  expectedSalary?: string;
  noticePeriod?: string;
  stageHistory?: {stage: Stage;date: string;notes?: string;}[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ScheduledInterview {
  applicantId: string;
  date: string;
  time: string;
  type: string;
  interviewers: string;
  location: string;
  notes: string;
}

const initialApplicants: Applicant[] = [
{
  id: 'APP-2024-001',
  name: 'Priya Sharma',
  avatar: 'PS',
  position: 'Math Teacher',
  subject: 'Mathematics',
  qualification: 'M.Sc + B.Ed',
  experience: 5,
  source: 'Job Portal',
  stage: 'Shortlisted',
  rating: 4,
  status: 'Active',
  appliedDate: '2024-11-10',
  branch: 'main',
  email: 'priya@email.com',
  phone: '9876543210',
  address: '123, MG Road, Delhi',
  skills: ['Algebra', 'Geometry', 'Calculus', 'Problem Solving'],
  expectedSalary: '₹45,000/month',
  noticePeriod: '30 days',
  stageHistory: [
  { stage: 'Applied', date: '2024-11-10', notes: 'Applied via Job Portal' },
  { stage: 'Screened', date: '2024-11-12', notes: 'Passed initial screening' },
  { stage: 'Shortlisted', date: '2024-11-15', notes: 'Shortlisted for interview' }]

},
{
  id: 'APP-2024-002',
  name: 'Rahul Verma',
  avatar: 'RV',
  position: 'Science HOD',
  subject: 'Physics',
  qualification: 'M.Sc + PhD',
  experience: 12,
  source: 'Referral',
  stage: 'Interviewed',
  rating: 5,
  status: 'Active',
  appliedDate: '2024-11-08',
  branch: 'main',
  email: 'rahul@email.com',
  phone: '9876543211',
  address: '456, Park Street, Mumbai',
  skills: ['Physics', 'Research', 'Team Leadership', 'Curriculum Development'],
  expectedSalary: '₹85,000/month',
  noticePeriod: '60 days',
  interviewDate: '2024-11-20',
  interviewTime: '10:00 AM',
  interviewType: 'In-Person'
},
{
  id: 'APP-2024-003',
  name: 'Anita Desai',
  avatar: 'AD',
  position: 'Admin Officer',
  subject: undefined,
  qualification: 'MBA',
  experience: 7,
  source: 'Website',
  stage: 'Selected',
  rating: 4,
  status: 'Active',
  appliedDate: '2024-11-05',
  branch: 'north',
  email: 'anita@email.com',
  phone: '9876543212',
  skills: ['Administration', 'MS Office', 'Communication', 'Event Management'],
  expectedSalary: '₹55,000/month',
  noticePeriod: '45 days'
},
{
  id: 'APP-2024-004',
  name: 'Suresh Kumar',
  avatar: 'SK',
  position: 'PE Teacher',
  subject: undefined,
  qualification: 'B.P.Ed',
  experience: 3,
  source: 'Walk-in',
  stage: 'Applied',
  rating: 3,
  status: 'Active',
  appliedDate: '2024-11-20',
  branch: 'north',
  email: 'suresh@email.com',
  phone: '9876543213',
  skills: ['Sports', 'Fitness Training', 'First Aid', 'Team Sports'],
  expectedSalary: '₹35,000/month',
  noticePeriod: 'Immediate'
},
{
  id: 'APP-2024-005',
  name: 'Meera Patel',
  avatar: 'MP',
  position: 'CS Teacher',
  subject: 'Computer Science',
  qualification: 'MCA + B.Ed',
  experience: 4,
  source: 'Job Portal',
  stage: 'Screened',
  rating: 4,
  status: 'Active',
  appliedDate: '2024-11-18',
  branch: 'south',
  email: 'meera@email.com',
  phone: '9876543214',
  skills: ['Python', 'Java', 'Web Development', 'Database Management'],
  expectedSalary: '₹50,000/month',
  noticePeriod: '30 days'
},
{
  id: 'APP-2024-006',
  name: 'Vikram Singh',
  avatar: 'VS',
  position: 'English Teacher',
  subject: 'English',
  qualification: 'MA + B.Ed',
  experience: 6,
  source: 'Social Media',
  stage: 'Shortlisted',
  rating: 4,
  status: 'Active',
  appliedDate: '2024-11-15',
  branch: 'south',
  email: 'vikram@email.com',
  phone: '9876543215',
  skills: ['Literature', 'Grammar', 'Creative Writing', 'Public Speaking'],
  expectedSalary: '₹48,000/month',
  noticePeriod: '30 days'
},
{
  id: 'APP-2024-007',
  name: 'Kavita Joshi',
  avatar: 'KJ',
  position: 'Art Teacher',
  subject: 'Fine Arts',
  qualification: 'BFA + B.Ed',
  experience: 2,
  source: 'Referral',
  stage: 'Rejected',
  rating: 2,
  status: 'Rejected',
  appliedDate: '2024-11-12',
  branch: 'east',
  email: 'kavita@email.com',
  phone: '9876543216',
  rejectionReason: 'Did not meet minimum experience requirements',
  skills: ['Painting', 'Sculpture', 'Art History'],
  expectedSalary: '₹30,000/month',
  noticePeriod: 'Immediate'
},
{
  id: 'APP-2024-008',
  name: 'Amit Gupta',
  avatar: 'AG',
  position: 'Math Teacher',
  subject: 'Mathematics',
  qualification: 'M.Sc + B.Ed',
  experience: 8,
  source: 'Website',
  stage: 'Offered',
  rating: 5,
  status: 'Active',
  appliedDate: '2024-11-01',
  branch: 'east',
  email: 'amit@email.com',
  phone: '9876543217',
  skills: ['Mathematics', 'Statistics', 'Data Analysis', 'Tutoring'],
  expectedSalary: '₹60,000/month',
  noticePeriod: '45 days'
},
{
  id: 'APP-2024-009',
  name: 'Sunita Rao',
  avatar: 'SR',
  position: 'Librarian',
  subject: undefined,
  qualification: 'MLIS',
  experience: 5,
  source: 'Job Portal',
  stage: 'Applied',
  rating: 3,
  status: 'Active',
  appliedDate: '2024-11-22',
  branch: 'main',
  email: 'sunita@email.com',
  phone: '9876543218',
  skills: ['Library Management', 'Cataloging', 'Research', 'Digital Libraries'],
  expectedSalary: '₹40,000/month',
  noticePeriod: '30 days'
},
{
  id: 'APP-2024-010',
  name: 'Deepak Nair',
  avatar: 'DN',
  position: 'CS Teacher',
  subject: 'Computer Science',
  qualification: 'B.Tech + B.Ed',
  experience: 3,
  source: 'Social Media',
  stage: 'Screened',
  rating: 3,
  status: 'On Hold',
  appliedDate: '2024-11-19',
  branch: 'north',
  email: 'deepak@email.com',
  phone: '9876543219',
  notes: 'Candidate requested to hold application due to personal reasons',
  skills: ['Programming', 'Hardware', 'Networking'],
  expectedSalary: '₹42,000/month',
  noticePeriod: '30 days'
}];


const stageConfig: Record<Stage, {color: string;bg: string;}> = {
  Applied: { color: 'text-gray-700', bg: 'bg-gray-100' },
  Screened: { color: 'text-blue-700', bg: 'bg-blue-100' },
  Shortlisted: { color: 'text-indigo-700', bg: 'bg-indigo-100' },
  Interviewed: { color: 'text-violet-700', bg: 'bg-violet-100' },
  Selected: { color: 'text-green-700', bg: 'bg-green-100' },
  Offered: { color: 'text-orange-700', bg: 'bg-orange-100' },
  Joined: { color: 'text-teal-700', bg: 'bg-teal-100' },
  Rejected: { color: 'text-red-700', bg: 'bg-red-100' }
};

const ITEMS_PER_PAGE = 5;

export function ApplicantList() {
  // Core state
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');
  const [filterSource, setFilterSource] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Interactive states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [stageNotes, setStageNotes] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Add applicant form state
  const [newApplicant, setNewApplicant] = useState({
    name: '',
    position: '',
    subject: '',
    qualification: '',
    experience: '',
    source: 'Website',
    branch: 'main',
    email: '',
    phone: '',
    address: '',
    expectedSalary: '',
    noticePeriod: '',
    skills: ''
  });

  // Schedule interview form state
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time: '',
    type: 'In-Person',
    interviewers: '',
    location: '',
    notes: ''
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    body: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setCurrentPage(1);
  }, []);

  const activeBranches = useMemo(() => {
    return selectedBranches.includes('all') ?
    ['main', 'north', 'south', 'east'] :
    selectedBranches;
  }, [selectedBranches]);

  // Filtering
  const filtered = useMemo(() => {
    return applicants.filter((a) => {
      const branchMatch = activeBranches.includes(a.branch);
      const searchMatch =
      !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
      const stageMatch = filterStage === 'all' || a.stage === filterStage;
      const posMatch = filterPosition === 'all' || a.position === filterPosition;
      const sourceMatch = filterSource === 'all' || a.source === filterSource;
      return branchMatch && searchMatch && stageMatch && posMatch && sourceMatch;
    });
  }, [applicants, activeBranches, searchQuery, filterStage, filterPosition, filterSource]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  // Computed values
  const positions = useMemo(() => [...new Set(applicants.map((a) => a.position))], [applicants]);
  const sources = useMemo(() => [...new Set(applicants.map((a) => a.source))], [applicants]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((a) => {
      counts[a.stage] = (counts[a.stage] || 0) + 1;
    });
    return counts;
  }, [filtered]);

  const getBranchName = useCallback((id: string) => {
    return BRANCHES.find((b) => b.id === id)?.name || id;
  }, []);

  // Rating component
  const renderStars = useCallback((rating: number, applicantId?: string, interactive = false) =>
  <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
    <button
      key={s}
      onClick={() => {
        if (interactive && applicantId) {
          updateApplicantRating(applicantId, s);
        }
      }}
      disabled={!interactive}
      className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}>

          <Star
        className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />

        </button>
    )}
    </div>,
  []);

  // Update rating
  const updateApplicantRating = useCallback((id: string, rating: number) => {
    setApplicants((prev) =>
    prev.map((a) =>
    a.id === id ? { ...a, rating } : a
    )
    );
    showToast(`Rating updated to ${rating} stars`, 'success');
  }, [showToast]);

  // View applicant profile
  const viewApplicant = useCallback((applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowViewModal(true);
  }, []);

  // Move to next stage
  const openStageModal = useCallback((applicant: Applicant) => {
    if (applicant.stage === 'Joined' || applicant.stage === 'Rejected') {
      showToast(`Cannot change stage for ${applicant.stage} applicants`, 'warning');
      return;
    }
    setSelectedApplicant(applicant);
    setStageNotes('');
    setShowStageModal(true);
  }, [showToast]);

  const moveToNextStage = useCallback(async () => {
    if (!selectedApplicant) return;

    const currentIndex = STAGES_ORDER.indexOf(selectedApplicant.stage as any);
    if (currentIndex === -1 || currentIndex >= STAGES_ORDER.length - 1) {
      showToast('Cannot move to next stage', 'warning');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const nextStage = STAGES_ORDER[currentIndex + 1];
    const stageEntry = {
      stage: nextStage,
      date: new Date().toISOString().split('T')[0],
      notes: stageNotes || `Moved to ${nextStage}`
    };

    setApplicants((prev) =>
    prev.map((a) =>
    a.id === selectedApplicant.id ?
    {
      ...a,
      stage: nextStage,
      stageHistory: [...(a.stageHistory || []), stageEntry]
    } :
    a
    )
    );

    setIsSaving(false);
    setShowStageModal(false);
    setSelectedApplicant(null);
    showToast(`${selectedApplicant.name} moved to ${nextStage}`, 'success');
  }, [selectedApplicant, stageNotes, showToast]);

  // Schedule interview
  const openScheduleModal = useCallback((applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setScheduleForm({
      date: applicant.interviewDate || '',
      time: applicant.interviewTime || '',
      type: applicant.interviewType || 'In-Person',
      interviewers: '',
      location: '',
      notes: ''
    });
    setShowScheduleModal(true);
  }, []);

  const scheduleInterview = useCallback(async () => {
    if (!selectedApplicant) return;

    if (!scheduleForm.date || !scheduleForm.time) {
      showToast('Please fill in date and time', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setApplicants((prev) =>
    prev.map((a) =>
    a.id === selectedApplicant.id ?
    {
      ...a,
      interviewDate: scheduleForm.date,
      interviewTime: scheduleForm.time,
      interviewType: scheduleForm.type,
      notes: scheduleForm.notes ? `${a.notes || ''}\nInterview: ${scheduleForm.notes}` : a.notes
    } :
    a
    )
    );

    setIsSaving(false);
    setShowScheduleModal(false);
    setSelectedApplicant(null);
    showToast(`Interview scheduled for ${selectedApplicant.name}`, 'success');
  }, [selectedApplicant, scheduleForm, showToast]);

  // Download resume
  const downloadResume = useCallback(async (applicant: Applicant) => {
    showToast(`Downloading resume for ${applicant.name}...`, 'info');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate file download
    const blob = new Blob([`Resume for ${applicant.name}\n\nPosition: ${applicant.position}\nQualification: ${applicant.qualification}\nExperience: ${applicant.experience} years\nEmail: ${applicant.email}\nPhone: ${applicant.phone}\n\nSkills:\n${applicant.skills?.join(', ') || 'N/A'}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${applicant.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Resume downloaded for ${applicant.name}`, 'success');
  }, [showToast]);

  // Reject applicant
  const openRejectModal = useCallback((applicant: Applicant) => {
    if (applicant.stage === 'Rejected') {
      showToast('Applicant is already rejected', 'warning');
      return;
    }
    setSelectedApplicant(applicant);
    setRejectionReason('');
    setShowRejectModal(true);
  }, [showToast]);

  const rejectApplicant = useCallback(async () => {
    if (!selectedApplicant) return;

    if (!rejectionReason.trim()) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setApplicants((prev) =>
    prev.map((a) =>
    a.id === selectedApplicant.id ?
    {
      ...a,
      stage: 'Rejected' as Stage,
      status: 'Rejected' as const,
      rejectionReason,
      stageHistory: [
      ...(a.stageHistory || []),
      { stage: 'Rejected' as Stage, date: new Date().toISOString().split('T')[0], notes: rejectionReason }]

    } :
    a
    )
    );

    setIsSaving(false);
    setShowRejectModal(false);
    setSelectedApplicant(null);
    showToast(`${selectedApplicant.name} has been rejected`, 'success');
  }, [selectedApplicant, rejectionReason, showToast]);

  // Delete applicant
  const openDeleteModal = useCallback((applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDeleteModal(true);
  }, []);

  const deleteApplicant = useCallback(async () => {
    if (!selectedApplicant) return;

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setApplicants((prev) => prev.filter((a) => a.id !== selectedApplicant.id));

    setIsSaving(false);
    setShowDeleteModal(false);
    setSelectedApplicant(null);
    showToast(`${selectedApplicant.name} has been deleted`, 'success');
  }, [selectedApplicant, showToast]);

  // Send email
  const openEmailModal = useCallback((applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setEmailForm({
      subject: `Regarding Your Application - ${applicant.position}`,
      body: `Dear ${applicant.name},\n\nThank you for your application for the position of ${applicant.position}.\n\n\n\nBest regards,\nHR Team`
    });
    setShowEmailModal(true);
  }, []);

  const sendEmail = useCallback(async () => {
    if (!selectedApplicant) return;

    if (!emailForm.subject.trim() || !emailForm.body.trim()) {
      showToast('Please fill in subject and body', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSaving(false);
    setShowEmailModal(false);
    setSelectedApplicant(null);
    showToast(`Email sent to ${selectedApplicant.name}`, 'success');
  }, [selectedApplicant, emailForm, showToast]);

  // Add new applicant
  const addApplicant = useCallback(async () => {
    if (!newApplicant.name.trim() || !newApplicant.position.trim() || !newApplicant.email.trim()) {
      showToast('Please fill in required fields (Name, Position, Email)', 'error');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const id = `APP-2024-${String(applicants.length + 1).padStart(3, '0')}`;
    const avatar = newApplicant.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    const applicant: Applicant = {
      id,
      name: newApplicant.name,
      avatar,
      position: newApplicant.position,
      subject: newApplicant.subject || undefined,
      qualification: newApplicant.qualification,
      experience: parseInt(newApplicant.experience) || 0,
      source: newApplicant.source,
      stage: 'Applied',
      rating: 0,
      status: 'Active',
      appliedDate: new Date().toISOString().split('T')[0],
      branch: newApplicant.branch,
      email: newApplicant.email,
      phone: newApplicant.phone,
      address: newApplicant.address || undefined,
      expectedSalary: newApplicant.expectedSalary || undefined,
      noticePeriod: newApplicant.noticePeriod || undefined,
      skills: newApplicant.skills ? newApplicant.skills.split(',').map((s) => s.trim()) : undefined,
      stageHistory: [{ stage: 'Applied', date: new Date().toISOString().split('T')[0], notes: 'Application received' }]
    };

    setApplicants((prev) => [applicant, ...prev]);

    setNewApplicant({
      name: '',
      position: '',
      subject: '',
      qualification: '',
      experience: '',
      source: 'Website',
      branch: 'main',
      email: '',
      phone: '',
      address: '',
      expectedSalary: '',
      noticePeriod: '',
      skills: ''
    });

    setIsSaving(false);
    setShowAddModal(false);
    showToast(`${applicant.name} added successfully`, 'success');
  }, [newApplicant, applicants.length, showToast]);

  // Export functionality
  const exportData = useCallback(async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      if (format === 'csv') {
        const headers = ['ID', 'Name', 'Position', 'Qualification', 'Experience', 'Source', 'Stage', 'Rating', 'Status', 'Applied Date', 'Branch', 'Email', 'Phone'];
        const rows = filtered.map((a) => [
        a.id,
        a.name,
        a.position,
        a.qualification,
        a.experience,
        a.source,
        a.stage,
        a.rating,
        a.status,
        a.appliedDate,
        getBranchName(a.branch),
        a.email,
        a.phone]
        );

        const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].
        join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `applicants_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(`Exported ${filtered.length} applicants to CSV`, 'success');
      } else {
        // Simulate PDF export
        showToast('PDF export initiated. Document will download shortly.', 'info');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        showToast(`Exported ${filtered.length} applicants to PDF`, 'success');
      }
    } catch (error) {
      showToast('Export failed', 'error');
    }

    setIsExporting(false);
  }, [filtered, getBranchName, showToast]);

  // Refresh data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // In real app, would fetch from API
    showToast('Data refreshed', 'success');
    setIsRefreshing(false);
  }, [showToast]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilterStage('all');
    setFilterPosition('all');
    setFilterSource('all');
    setSelectedBranches(['all']);
    setCurrentPage(1);
    showToast('Filters reset', 'info');
  }, [showToast]);

  // Bulk selection
  const toggleSelectAll = useCallback(() => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((a) => a.id));
    }
  }, [paginatedData, selectedRows]);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  // Bulk actions
  const bulkMoveToStage = useCallback(async (stage: Stage) => {
    if (selectedRows.length === 0) {
      showToast('No applicants selected', 'warning');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setApplicants((prev) =>
    prev.map((a) =>
    selectedRows.includes(a.id) ?
    {
      ...a,
      stage,
      stageHistory: [
      ...(a.stageHistory || []),
      { stage, date: new Date().toISOString().split('T')[0], notes: 'Bulk stage update' }]

    } :
    a
    )
    );

    setIsSaving(false);
    setSelectedRows([]);
    showToast(`${selectedRows.length} applicants moved to ${stage}`, 'success');
  }, [selectedRows, showToast]);

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

      {/* View Applicant Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedApplicant(null);
        }}
        title="Applicant Profile"
        size="lg">

        {selectedApplicant &&
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                {selectedApplicant.avatar}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900">{selectedApplicant.name}</h4>
                <p className="text-sm text-gray-500">{selectedApplicant.id}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${stageConfig[selectedApplicant.stage].bg} ${stageConfig[selectedApplicant.stage].color}`}>
                    {selectedApplicant.stage}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                selectedApplicant.status === 'Active' ? 'bg-green-100 text-green-700' :
                selectedApplicant.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                'bg-amber-100 text-amber-700'}`
                }>
                    {selectedApplicant.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                {renderStars(selectedApplicant.rating, selectedApplicant.id, true)}
                <p className="text-xs text-gray-500 mt-1">Click to update rating</p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Position</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.position}</p>
                  {selectedApplicant.subject &&
                <p className="text-xs text-gray-500">{selectedApplicant.subject}</p>
                }
                </div>
                <div>
                  <label className="text-xs text-gray-500">Qualification</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.qualification}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Experience</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.experience} years</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Source</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.source}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedApplicant.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedApplicant.phone}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Branch</label>
                  <p className="text-sm font-medium text-gray-900">{getBranchName(selectedApplicant.branch)}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Applied Date</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.appliedDate}</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {selectedApplicant.skills && selectedApplicant.skills.length > 0 &&
          <div>
                <label className="text-xs text-gray-500">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedApplicant.skills.map((skill, i) =>
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
              )}
                </div>
              </div>
          }

            {selectedApplicant.expectedSalary &&
          <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Expected Salary</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.expectedSalary}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Notice Period</label>
                  <p className="text-sm font-medium text-gray-900">{selectedApplicant.noticePeriod || 'Not specified'}</p>
                </div>
              </div>
          }

            {/* Interview Details */}
            {selectedApplicant.interviewDate &&
          <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <h5 className="text-sm font-semibold text-violet-800 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Scheduled Interview
                </h5>
                <p className="text-sm text-violet-700">
                  {selectedApplicant.interviewDate} at {selectedApplicant.interviewTime}
                </p>
                <p className="text-xs text-violet-600">{selectedApplicant.interviewType}</p>
              </div>
          }

            {/* Stage History */}
            {selectedApplicant.stageHistory && selectedApplicant.stageHistory.length > 0 &&
          <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Stage History</h5>
                <div className="space-y-2">
                  {selectedApplicant.stageHistory.map((h, i) =>
              <div key={i} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${stageConfig[h.stage].bg} ${stageConfig[h.stage].color}`}>
                        {h.stage}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">{h.date}</p>
                        {h.notes && <p className="text-sm text-gray-700">{h.notes}</p>}
                      </div>
                    </div>
              )}
                </div>
              </div>
          }

            {/* Rejection Reason */}
            {selectedApplicant.rejectionReason &&
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="text-sm font-semibold text-red-800 mb-1">Rejection Reason</h5>
                <p className="text-sm text-red-700">{selectedApplicant.rejectionReason}</p>
              </div>
          }

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowViewModal(false);
                openEmailModal(selectedApplicant);
              }}>

                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button
              variant="outline"
              size="sm"
              onClick={() => downloadResume(selectedApplicant)}>

                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              {selectedApplicant.stage !== 'Rejected' && selectedApplicant.stage !== 'Joined' &&
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setShowViewModal(false);
                openStageModal(selectedApplicant);
              }}>

                  <ChevronRight className="w-4 h-4 mr-2" />
                  Move to Next Stage
                </Button>
            }
            </div>
          </div>
        }
      </Modal>

      {/* Add Applicant Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Applicant"
        size="lg">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newApplicant.name}
                onChange={(e) => setNewApplicant((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="Enter full name" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position <span className="text-red-500">*</span>
              </label>
              <select
                value={newApplicant.position}
                onChange={(e) => setNewApplicant((p) => ({ ...p, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent">

                <option value="">Select Position</option>
                {positions.map((p) =>
                <option key={p} value={p}>{p}</option>
                )}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject (if applicable)</label>
              <input
                type="text"
                value={newApplicant.subject}
                onChange={(e) => setNewApplicant((p) => ({ ...p, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="e.g., Mathematics" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                value={newApplicant.qualification}
                onChange={(e) => setNewApplicant((p) => ({ ...p, qualification: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="e.g., M.Sc + B.Ed" />

            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
              <input
                type="number"
                value={newApplicant.experience}
                onChange={(e) => setNewApplicant((p) => ({ ...p, experience: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="0"
                min="0" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <select
                value={newApplicant.source}
                onChange={(e) => setNewApplicant((p) => ({ ...p, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent">

                {sources.map((s) =>
                <option key={s} value={s}>{s}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <select
                value={newApplicant.branch}
                onChange={(e) => setNewApplicant((p) => ({ ...p, branch: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent">

                {BRANCHES.filter((b) => b.id !== 'all').map((b) =>
                <option key={b.id} value={b.id}>{b.name}</option>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={newApplicant.email}
                onChange={(e) => setNewApplicant((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="email@example.com" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={newApplicant.phone}
                onChange={(e) => setNewApplicant((p) => ({ ...p, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="9876543210" />

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary</label>
              <input
                type="text"
                value={newApplicant.expectedSalary}
                onChange={(e) => setNewApplicant((p) => ({ ...p, expectedSalary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="₹40,000/month" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
              <input
                type="text"
                value={newApplicant.noticePeriod}
                onChange={(e) => setNewApplicant((p) => ({ ...p, noticePeriod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                placeholder="30 days" />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={newApplicant.skills}
              onChange={(e) => setNewApplicant((p) => ({ ...p, skills: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Teaching, Communication, Leadership" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={newApplicant.address}
              onChange={(e) => setNewApplicant((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={2}
              placeholder="Enter address" />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={addApplicant} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Applicant
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedApplicant(null);
        }}
        title={`Schedule Interview - ${selectedApplicant?.name || ''}`}
        size="md">

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent" />

            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm((p) => ({ ...p, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent" />

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type</label>
            <select
              value={scheduleForm.type}
              onChange={(e) => setScheduleForm((p) => ({ ...p, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent">

              <option value="In-Person">In-Person</option>
              <option value="Video Call">Video Call</option>
              <option value="Phone">Phone</option>
              <option value="Panel Interview">Panel Interview</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interviewers</label>
            <input
              type="text"
              value={scheduleForm.interviewers}
              onChange={(e) => setScheduleForm((p) => ({ ...p, interviewers: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Names of interviewers" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location / Meeting Link</label>
            <input
              type="text"
              value={scheduleForm.location}
              onChange={(e) => setScheduleForm((p) => ({ ...p, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Conference Room A / Zoom link" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={3}
              placeholder="Additional notes for the interview" />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={scheduleInterview} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Schedule Interview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedApplicant(null);
        }}
        title={`Reject Applicant - ${selectedApplicant?.name || ''}`}
        size="md">

        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">This action cannot be undone</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              Rejecting this applicant will mark them as rejected and remove them from the active pipeline.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
              placeholder="Please provide a reason for rejection..." />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={rejectApplicant}
              disabled={isSaving}
              className="border-red-500 text-red-500 hover:bg-red-50">

              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject Applicant
            </Button>
          </div>
        </div>
      </Modal>

      {/* Move to Next Stage Modal */}
      <Modal
        isOpen={showStageModal}
        onClose={() => {
          setShowStageModal(false);
          setSelectedApplicant(null);
        }}
        title={`Move to Next Stage - ${selectedApplicant?.name || ''}`}
        size="md">

        {selectedApplicant &&
        <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
              <div className="text-center">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${stageConfig[selectedApplicant.stage].bg} ${stageConfig[selectedApplicant.stage].color}`}>
                  {selectedApplicant.stage}
                </span>
                <p className="text-xs text-gray-500 mt-1">Current</p>
              </div>
              <ChevronRight className="w-5 h-5 text-violet-500" />
              <div className="text-center">
                {(() => {
                const currentIndex = STAGES_ORDER.indexOf(selectedApplicant.stage as any);
                const nextStage = currentIndex >= 0 && currentIndex < STAGES_ORDER.length - 1 ?
                STAGES_ORDER[currentIndex + 1] :
                null;

                if (!nextStage) return <span className="text-sm text-gray-500">No next stage</span>;

                return (
                  <>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${stageConfig[nextStage].bg} ${stageConfig[nextStage].color}`}>
                        {nextStage}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Next</p>
                    </>);

              })()}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <textarea
              value={stageNotes}
              onChange={(e) => setStageNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={3}
              placeholder="Add notes for this stage transition..." />

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowStageModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={moveToNextStage} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Move to Next Stage
              </Button>
            </div>
          </div>
        }
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedApplicant(null);
        }}
        title="Delete Applicant"
        size="sm">

        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{selectedApplicant?.name}</strong>? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={deleteApplicant}
              disabled={isSaving}
              className="border-red-500 text-red-500 hover:bg-red-50">

              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedApplicant(null);
        }}
        title={`Send Email to ${selectedApplicant?.name || ''}`}
        size="lg">

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>To:</strong> {selectedApplicant?.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={emailForm.subject}
              onChange={(e) => setEmailForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent" />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={emailForm.body}
              onChange={(e) => setEmailForm((p) => ({ ...p, body: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={8} />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={sendEmail} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Applicant List</h1>
              <p className="text-sm text-gray-500">
                Track all candidates across recruitment stages
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500">

              {ACADEMIC_YEARS.map((y) =>
              <option key={y.value} value={y.value}>{y.label}</option>
              )}
            </select>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportData('csv')}
                disabled={isExporting}>

                {isExporting ?
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> :

                <Download className="w-4 h-4 mr-1" />
                }
                Export
              </Button>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Applicant
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t flex flex-wrap items-center gap-3">
          <Building className="w-5 h-5 text-gray-500 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Branches:</span>
          {BRANCHES.map((branch) =>
          <button
            key={branch.id}
            onClick={() => handleBranchToggle(branch.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
            selectedBranches.includes(branch.id) || branch.id !== 'all' && selectedBranches.includes('all') ?
            'bg-violet-600 text-white' :
            'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
            }>

              {branch.name}
              {selectedBranches.includes(branch.id) && branch.id !== 'all' &&
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

      {/* Stage Summary */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {STAGES_ORDER.map((stage) =>
        <button
          key={stage}
          onClick={() => setFilterStage(filterStage === stage ? 'all' : stage)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
          filterStage === stage ?
          `border-current ${stageConfig[stage].bg} ${stageConfig[stage].color}` :
          'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`
          }>

            <span>{stage}</span>
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold ${stageConfig[stage].bg} ${stageConfig[stage].color}`}>
              {stageCounts[stage] || 0}
            </span>
          </button>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 &&
      <div className="bg-violet-50 border border-violet-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium text-violet-800">
            {selectedRows.length} applicant(s) selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedRows([])}>
              Clear Selection
            </Button>
            <select
            onChange={(e) => {
              if (e.target.value) {
                bulkMoveToStage(e.target.value as Stage);
                e.target.value = '';
              }
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            defaultValue="">

              <option value="" disabled>Move to Stage...</option>
              {STAGES_ORDER.map((s) =>
            <option key={s} value={s}>{s}</option>
            )}
            </select>
          </div>
        </div>
      }

      {/* Filters + Table */}
      <Card>
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, position, ID, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent" />

          </div>
          <select
            value={filterPosition}
            onChange={(e) => {
              setFilterPosition(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm">

            <option value="all">All Positions</option>
            {positions.map((p) =>
            <option key={p} value={p}>{p}</option>
            )}
          </select>
          <select
            value={filterSource}
            onChange={(e) => {
              setFilterSource(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm">

            <option value="all">All Sources</option>
            {sources.map((s) =>
            <option key={s} value={s}>{s}</option>
            )}
          </select>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <Filter className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}>

            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300" />

                </th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">App. ID</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Candidate</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Position</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Qualification</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Exp.</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Source</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Stage</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Rating</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((app) =>
              <tr
                key={app.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                selectedRows.includes(app.id) ? 'bg-violet-50' : ''}`
                }>

                  <td className="py-3 px-4">
                    <input
                    type="checkbox"
                    checked={selectedRows.includes(app.id)}
                    onChange={() => toggleSelectRow(app.id)}
                    className="w-4 h-4 rounded border-gray-300" />

                  </td>
                  <td className="py-3 px-4">
                    <p className="font-mono text-xs font-semibold text-violet-600">{app.id}</p>
                    <p className="text-xs text-gray-400">{app.appliedDate}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {app.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{app.name}</p>
                        <p className="text-xs text-gray-400">{getBranchName(app.branch)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{app.position}</p>
                    {app.subject && <p className="text-xs text-gray-400">{app.subject}</p>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-700">{app.qualification}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium text-gray-900">{app.experience}y</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-gray-600">{app.source}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${stageConfig[app.stage].bg} ${stageConfig[app.stage].color}`}>
                      {app.stage}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {renderStars(app.rating, app.id, true)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => viewApplicant(app)}
                      className="p-1.5 hover:bg-violet-50 rounded-lg text-violet-600 transition-colors"
                      title="View Profile">

                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => openStageModal(app)}
                      className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                      title="Move to Next Stage"
                      disabled={app.stage === 'Joined' || app.stage === 'Rejected'}>

                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => openScheduleModal(app)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      title="Schedule Interview">

                        <Calendar className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => downloadResume(app)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                      title="Download Resume">

                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => openEmailModal(app)}
                      className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                      title="Send Email">

                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                      onClick={() => openRejectModal(app)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                      title="Reject"
                      disabled={app.stage === 'Rejected'}>

                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {filtered.length === 0 &&
          <div className="py-12 text-center text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No applicants found matching your filters</p>
              <Button variant="outline" size="sm" onClick={resetFilters} className="mt-3">
                Reset Filters
              </Button>
            </div>
          }
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} applicants
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}>

              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}>

              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-3 py-1 bg-gray-100 rounded text-sm font-medium">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}>

              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage >= totalPages}>

              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}