import React, { useState, useMemo, useCallback } from 'react';
import {
  Building,
  X,
  Globe,
  FileText,
  Eye,
  Copy,
  Send,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  BarChart3,
  Edit,
  Trash2,
  ExternalLink,
  Tag,
  Search,
  Filter,
  Download,
  Upload,
  Save,
  RefreshCw,
  Archive,
  Play,
  Pause,
  Link,
  Share2,
  MessageSquare,
  Bell,
  Settings,
  ChevronDown,
  ChevronUp,
  Star,
  Briefcase,
  MapPin,
  DollarSign,
  GraduationCap,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  Check,
  XCircle,
  Info,
  History,
  Linkedin,
  Facebook,
  Twitter } from
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
'Mathematics',
'Science',
'English',
'Computer Science',
'Administration',
'Physical Education',
'Arts',
'Music',
'Library',
'Counseling'];


const JOB_TYPES = [
{ value: 'full-time', label: 'Full Time' },
{ value: 'part-time', label: 'Part Time' },
{ value: 'contract', label: 'Contract' },
{ value: 'temporary', label: 'Temporary' }];


const EXPERIENCE_LEVELS = [
{ value: 'entry', label: 'Entry Level (0-2 years)' },
{ value: 'mid', label: 'Mid Level (2-5 years)' },
{ value: 'senior', label: 'Senior Level (5-10 years)' },
{ value: 'expert', label: 'Expert (10+ years)' }];


const platforms = [
{ id: 'website', label: 'School Website', icon: Globe, color: 'blue' },
{ id: 'naukri', label: 'Naukri.com', icon: Globe, color: 'orange' },
{ id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'indigo' },
{ id: 'indeed', label: 'Indeed', icon: Globe, color: 'purple' },
{ id: 'social', label: 'Social Media', icon: Share2, color: 'pink' },
{ id: 'facebook', label: 'Facebook', icon: Facebook, color: 'blue' },
{ id: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'gray' }];


const REQUISITIONS = [
{ id: 'REQ-2024-001', title: 'Math Teacher', department: 'Mathematics', positions: 2 },
{ id: 'REQ-2024-002', title: 'Physics Teacher', department: 'Science', positions: 1 },
{ id: 'REQ-2024-003', title: 'English Teacher', department: 'English', positions: 3 },
{ id: 'REQ-2024-004', title: 'Admin Officer', department: 'Administration', positions: 1 },
{ id: 'REQ-2024-005', title: 'CS Teacher', department: 'Computer Science', positions: 2 }];


type PostingStatus = 'Draft' | 'Active' | 'Paused' | 'Closed' | 'Expired';

interface Application {
  id: string;
  candidateName: string;
  email: string;
  appliedDate: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Rejected' | 'Hired';
  source: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface ActivityLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details?: string;
}

interface JobPosting {
  id: string;
  title: string;
  dept: string;
  description: string;
  responsibilities: string;
  skills: string;
  eligibility: string;
  salaryMin: number;
  salaryMax: number;
  applications: number;
  status: PostingStatus;
  publishDate: string;
  expiryDate: string;
  branch: string;
  platforms: string[];
  requisitionId?: string;
  jobType: string;
  experienceLevel: string;
  location: string;
  vacancies: number;
  applicationList?: Application[];
  notes?: Note[];
  activityLog?: ActivityLog[];
  views: number;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  featured: boolean;
  urgent: boolean;
}

const initialPostings: JobPosting[] = [
{
  id: 'JP-001',
  title: 'Senior Math Teacher',
  dept: 'Mathematics',
  description: 'We are looking for an experienced Mathematics teacher to join our team. The ideal candidate will have a strong background in mathematics education and a passion for student development.',
  responsibilities: '- Teach mathematics to students of various grade levels\n- Prepare lesson plans and curriculum\n- Assess student progress through regular evaluations\n- Collaborate with other teachers and staff',
  skills: 'Strong mathematical knowledge, Excellent communication, Classroom management, Technology proficiency',
  eligibility: 'M.Sc. Mathematics with B.Ed., Minimum 5 years of teaching experience',
  salaryMin: 50000,
  salaryMax: 75000,
  applications: 24,
  status: 'Active',
  publishDate: '2024-11-15',
  expiryDate: '2025-01-15',
  branch: 'main',
  platforms: ['website', 'naukri', 'linkedin'],
  requisitionId: 'REQ-2024-001',
  jobType: 'full-time',
  experienceLevel: 'senior',
  location: 'Main Campus, Delhi',
  vacancies: 2,
  views: 342,
  shareCount: 28,
  createdAt: '2024-11-10',
  updatedAt: '2024-11-15',
  createdBy: 'HR Manager',
  featured: true,
  urgent: false,
  applicationList: [
  { id: 'APP-001', candidateName: 'Priya Sharma', email: 'priya@email.com', appliedDate: '2024-11-20', status: 'Shortlisted', source: 'LinkedIn' },
  { id: 'APP-002', candidateName: 'Rahul Verma', email: 'rahul@email.com', appliedDate: '2024-11-22', status: 'New', source: 'Naukri' },
  { id: 'APP-003', candidateName: 'Anita Desai', email: 'anita@email.com', appliedDate: '2024-11-25', status: 'Reviewed', source: 'Website' }],

  notes: [
  { id: 'n1', content: 'Position is critical, need to fill ASAP', author: 'HR Manager', createdAt: '2024-11-10' }],

  activityLog: [
  { id: 'a1', action: 'Created', performedBy: 'HR Manager', timestamp: '2024-11-10 09:00' },
  { id: 'a2', action: 'Published', performedBy: 'HR Manager', timestamp: '2024-11-15 10:30' }]

},
{
  id: 'JP-002',
  title: 'Science HOD',
  dept: 'Science',
  description: 'Head of Department position for Science faculty. Leadership role requiring experience in curriculum development and team management.',
  responsibilities: '- Lead the Science department\n- Develop and review curriculum\n- Mentor junior teachers\n- Coordinate with administration',
  skills: 'Leadership, Curriculum development, Team management, Research aptitude',
  eligibility: 'Ph.D. in Science preferred, M.Sc. with B.Ed. minimum, 10+ years experience',
  salaryMin: 80000,
  salaryMax: 120000,
  applications: 18,
  status: 'Active',
  publishDate: '2024-11-20',
  expiryDate: '2025-01-20',
  branch: 'main',
  platforms: ['website', 'linkedin'],
  requisitionId: 'REQ-2024-002',
  jobType: 'full-time',
  experienceLevel: 'expert',
  location: 'Main Campus, Delhi',
  vacancies: 1,
  views: 256,
  shareCount: 15,
  createdAt: '2024-11-18',
  updatedAt: '2024-11-20',
  createdBy: 'Principal',
  featured: true,
  urgent: true,
  applicationList: [],
  notes: [],
  activityLog: []
},
{
  id: 'JP-003',
  title: 'Admin Officer',
  dept: 'Administration',
  description: 'Administrative officer to manage day-to-day operations of the school office.',
  responsibilities: '- Manage administrative tasks\n- Coordinate with departments\n- Handle correspondence\n- Maintain records',
  skills: 'Office management, Communication, Computer skills, Organization',
  eligibility: 'Graduate with office administration experience',
  salaryMin: 35000,
  salaryMax: 50000,
  applications: 31,
  status: 'Active',
  publishDate: '2024-11-10',
  expiryDate: '2025-01-10',
  branch: 'north',
  platforms: ['website', 'naukri', 'indeed'],
  jobType: 'full-time',
  experienceLevel: 'mid',
  location: 'North Wing Campus',
  vacancies: 1,
  views: 189,
  shareCount: 12,
  createdAt: '2024-11-08',
  updatedAt: '2024-11-10',
  createdBy: 'HR Manager',
  featured: false,
  urgent: false,
  applicationList: [],
  notes: [],
  activityLog: []
},
{
  id: 'JP-004',
  title: 'CS Teacher',
  dept: 'Computer Science',
  description: 'Computer Science teacher for secondary and senior secondary classes.',
  responsibilities: '- Teach programming and CS concepts\n- Manage computer lab\n- Conduct practical sessions',
  skills: 'Programming, Teaching, Technical knowledge, Patience',
  eligibility: 'B.Tech/MCA with B.Ed., 3+ years experience',
  salaryMin: 45000,
  salaryMax: 65000,
  applications: 15,
  status: 'Closed',
  publishDate: '2024-10-01',
  expiryDate: '2024-11-30',
  branch: 'east',
  platforms: ['website', 'linkedin', 'social'],
  requisitionId: 'REQ-2024-005',
  jobType: 'full-time',
  experienceLevel: 'mid',
  location: 'East Campus',
  vacancies: 2,
  views: 423,
  shareCount: 35,
  createdAt: '2024-09-28',
  updatedAt: '2024-12-01',
  createdBy: 'HR Manager',
  featured: false,
  urgent: false,
  applicationList: [],
  notes: [
  { id: 'n1', content: 'Position filled successfully', author: 'HR Manager', createdAt: '2024-12-01' }],

  activityLog: [
  { id: 'a1', action: 'Created', performedBy: 'HR Manager', timestamp: '2024-09-28 14:00' },
  { id: 'a2', action: 'Published', performedBy: 'HR Manager', timestamp: '2024-10-01 09:00' },
  { id: 'a3', action: 'Closed', performedBy: 'HR Manager', timestamp: '2024-12-01 16:00', details: 'Position filled' }]

},
{
  id: 'JP-005',
  title: 'English Teacher',
  dept: 'English',
  description: 'English language and literature teacher for middle school.',
  responsibilities: '- Teach English language skills\n- Conduct literature classes\n- Grade assignments and tests',
  skills: 'English proficiency, Literature knowledge, Communication',
  eligibility: 'M.A. English with B.Ed.',
  salaryMin: 40000,
  salaryMax: 55000,
  applications: 0,
  status: 'Draft',
  publishDate: '',
  expiryDate: '',
  branch: 'south',
  platforms: [],
  jobType: 'full-time',
  experienceLevel: 'entry',
  location: 'South Wing Campus',
  vacancies: 1,
  views: 0,
  shareCount: 0,
  createdAt: '2024-12-01',
  updatedAt: '2024-12-01',
  createdBy: 'HR Manager',
  featured: false,
  urgent: false,
  applicationList: [],
  notes: [],
  activityLog: []
}];


export function JobPostingAdvertisement() {
  const [postings, setPostings] = useState<JobPosting[]>(initialPostings);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'drafts' | 'closed'>('list');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['website']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'applications' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [selectedPosting, setSelectedPosting] = useState<JobPosting | null>(null);
  const [editingPosting, setEditingPosting] = useState<JobPosting | null>(null);

  const [newNote, setNewNote] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [form, setForm] = useState({
    requisitionId: '',
    jobTitle: '',
    description: '',
    responsibilities: '',
    skills: '',
    eligibility: '',
    salaryMin: '',
    salaryMax: '',
    publishDate: '',
    expiryDate: '',
    dept: '',
    branch: 'main',
    jobType: 'full-time',
    experienceLevel: 'mid',
    location: '',
    vacancies: '1',
    featured: false,
    urgent: false
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

  const activeBranches = selectedBranches.includes('all') ?
  ['main', 'north', 'south', 'east'] :
  selectedBranches;

  const filteredPostings = useMemo(() => {
    let result = postings.filter((p) => {
      const branchMatch = activeBranches.includes(p.branch);
      const statusMatch =
      filterStatus === 'all' ||
      activeTab === 'list' && p.status === 'Active' ||
      activeTab === 'drafts' && p.status === 'Draft' ||
      activeTab === 'closed' && (p.status === 'Closed' || p.status === 'Expired') ||
      p.status === filterStatus;
      const deptMatch = !filterDept || p.dept === filterDept;
      const searchMatch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'list') {
        return branchMatch && (p.status === 'Active' || p.status === 'Paused') && deptMatch && searchMatch;
      } else if (activeTab === 'drafts') {
        return branchMatch && p.status === 'Draft' && deptMatch && searchMatch;
      } else if (activeTab === 'closed') {
        return branchMatch && (p.status === 'Closed' || p.status === 'Expired') && deptMatch && searchMatch;
      }
      return branchMatch && statusMatch && deptMatch && searchMatch;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.publishDate || a.createdAt).getTime() - new Date(b.publishDate || b.createdAt).getTime();
          break;
        case 'applications':
          comparison = a.applications - b.applications;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [postings, activeBranches, filterStatus, filterDept, searchQuery, sortBy, sortDirection, activeTab]);

  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
    prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setForm({
      requisitionId: '',
      jobTitle: '',
      description: '',
      responsibilities: '',
      skills: '',
      eligibility: '',
      salaryMin: '',
      salaryMax: '',
      publishDate: '',
      expiryDate: '',
      dept: '',
      branch: 'main',
      jobType: 'full-time',
      experienceLevel: 'mid',
      location: '',
      vacancies: '1',
      featured: false,
      urgent: false
    });
    setSelectedPlatforms(['website']);
  };

  const createPosting = (status: 'Draft' | 'Active') => {
    if (!form.jobTitle || !form.dept) {
      alert('Please fill in required fields: Job Title and Department');
      return;
    }

    const now = new Date().toISOString().split('T')[0];
    const newPosting: JobPosting = {
      id: `JP-${Date.now()}`,
      title: form.jobTitle,
      dept: form.dept,
      description: form.description,
      responsibilities: form.responsibilities,
      skills: form.skills,
      eligibility: form.eligibility,
      salaryMin: parseInt(form.salaryMin) || 0,
      salaryMax: parseInt(form.salaryMax) || 0,
      applications: 0,
      status: status,
      publishDate: status === 'Active' ? form.publishDate || now : '',
      expiryDate: form.expiryDate,
      branch: form.branch,
      platforms: status === 'Active' ? selectedPlatforms : [],
      requisitionId: form.requisitionId,
      jobType: form.jobType,
      experienceLevel: form.experienceLevel,
      location: form.location || getBranchName(form.branch),
      vacancies: parseInt(form.vacancies) || 1,
      views: 0,
      shareCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: 'Current User',
      featured: form.featured,
      urgent: form.urgent,
      applicationList: [],
      notes: [],
      activityLog: [
      {
        id: `log-${Date.now()}`,
        action: status === 'Draft' ? 'Created as Draft' : 'Published',
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString()
      }]

    };

    setPostings((prev) => [...prev, newPosting]);
    resetForm();
    setActiveTab('list');
    alert(`Job posting ${status === 'Draft' ? 'saved as draft' : 'published'} successfully!`);
  };

  const updatePosting = () => {
    if (!editingPosting) return;

    setPostings((prev) =>
    prev.map((p) =>
    p.id === editingPosting.id ?
    {
      ...editingPosting,
      updatedAt: new Date().toISOString().split('T')[0],
      activityLog: [
      ...(editingPosting.activityLog || []),
      {
        id: `log-${Date.now()}`,
        action: 'Updated',
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString()
      }]

    } :
    p
    )
    );
    setShowEditModal(false);
    setEditingPosting(null);
    alert('Job posting updated successfully!');
  };

  const duplicatePosting = (posting: JobPosting) => {
    const now = new Date().toISOString().split('T')[0];
    const duplicated: JobPosting = {
      ...posting,
      id: `JP-${Date.now()}`,
      title: `${posting.title} (Copy)`,
      status: 'Draft',
      applications: 0,
      publishDate: '',
      expiryDate: '',
      views: 0,
      shareCount: 0,
      createdAt: now,
      updatedAt: now,
      applicationList: [],
      notes: [],
      activityLog: [
      {
        id: `log-${Date.now()}`,
        action: `Duplicated from ${posting.id}`,
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString()
      }]

    };
    setPostings((prev) => [...prev, duplicated]);
    alert('Job posting duplicated successfully!');
  };

  const deletePosting = (id: string) => {
    setPostings((prev) => prev.filter((p) => p.id !== id));
    setShowDeleteModal(false);
    setSelectedPosting(null);
    alert('Job posting deleted successfully!');
  };

  const changePostingStatus = (id: string, newStatus: PostingStatus, reason?: string) => {
    setPostings((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      status: newStatus,
      publishDate: newStatus === 'Active' && !p.publishDate ? new Date().toISOString().split('T')[0] : p.publishDate,
      updatedAt: new Date().toISOString().split('T')[0],
      activityLog: [
      ...(p.activityLog || []),
      {
        id: `log-${Date.now()}`,
        action: `Status changed to ${newStatus}`,
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString(),
        details: reason
      }]

    } :
    p
    )
    );
  };

  const publishPosting = (posting: JobPosting) => {
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform to publish');
      return;
    }

    setPostings((prev) =>
    prev.map((p) =>
    p.id === posting.id ?
    {
      ...p,
      status: 'Active',
      platforms: selectedPlatforms,
      publishDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      activityLog: [
      ...(p.activityLog || []),
      {
        id: `log-${Date.now()}`,
        action: 'Published',
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString(),
        details: `Published to: ${selectedPlatforms.map((pl) => platforms.find((p) => p.id === pl)?.label).join(', ')}`
      }]

    } :
    p
    )
    );
    alert('Job posting published successfully!');
  };

  const unpublishPosting = (id: string) => {
    changePostingStatus(id, 'Paused', 'Manually paused by user');
    alert('Job posting unpublished (paused) successfully!');
  };

  const closePosting = (id: string) => {
    changePostingStatus(id, 'Closed', 'Position filled or no longer needed');
    alert('Job posting closed successfully!');
  };

  const reopenPosting = (id: string) => {
    changePostingStatus(id, 'Active', 'Reopened for applications');
    alert('Job posting reopened successfully!');
  };

  const addNote = (postingId: string, content: string) => {
    if (!content.trim()) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: content.trim(),
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPostings((prev) =>
    prev.map((p) =>
    p.id === postingId ?
    {
      ...p,
      notes: [...(p.notes || []), note],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    p
    )
    );

    if (selectedPosting && selectedPosting.id === postingId) {
      setSelectedPosting({
        ...selectedPosting,
        notes: [...(selectedPosting.notes || []), note]
      });
    }

    setNewNote('');
  };

  const deleteNote = (postingId: string, noteId: string) => {
    setPostings((prev) =>
    prev.map((p) =>
    p.id === postingId ?
    {
      ...p,
      notes: p.notes?.filter((n) => n.id !== noteId)
    } :
    p
    )
    );

    if (selectedPosting && selectedPosting.id === postingId) {
      setSelectedPosting({
        ...selectedPosting,
        notes: selectedPosting.notes?.filter((n) => n.id !== noteId)
      });
    }
  };

  const updateApplicationStatus = (
  postingId: string,
  applicationId: string,
  newStatus: Application['status']) =>
  {
    setPostings((prev) =>
    prev.map((p) =>
    p.id === postingId ?
    {
      ...p,
      applicationList: p.applicationList?.map((app) =>
      app.id === applicationId ? { ...app, status: newStatus } : app
      )
    } :
    p
    )
    );

    if (selectedPosting && selectedPosting.id === postingId) {
      setSelectedPosting({
        ...selectedPosting,
        applicationList: selectedPosting.applicationList?.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
        )
      });
    }
  };

  const toggleFeatured = (id: string) => {
    setPostings((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      featured: !p.featured,
      activityLog: [
      ...(p.activityLog || []),
      {
        id: `log-${Date.now()}`,
        action: p.featured ? 'Removed from featured' : 'Marked as featured',
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString()
      }]

    } :
    p
    )
    );
  };

  const toggleUrgent = (id: string) => {
    setPostings((prev) =>
    prev.map((p) =>
    p.id === id ?
    {
      ...p,
      urgent: !p.urgent,
      activityLog: [
      ...(p.activityLog || []),
      {
        id: `log-${Date.now()}`,
        action: p.urgent ? 'Removed urgent flag' : 'Marked as urgent',
        performedBy: 'Current User',
        timestamp: new Date().toLocaleString()
      }]

    } :
    p
    )
    );
  };

  const sharePosting = (posting: JobPosting, platform: string) => {
    const shareUrl = `https://school.edu/careers/${posting.id}`;
    const shareText = `${posting.title} - ${posting.dept} | Apply Now!`;

    let shareLink = '';
    switch (platform) {
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(posting.title)}&body=${encodeURIComponent(`Check out this job opportunity: ${shareUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        return;
    }

    if (shareLink) {
      window.open(shareLink, '_blank');
    }

    setPostings((prev) =>
    prev.map((p) =>
    p.id === posting.id ? { ...p, shareCount: p.shareCount + 1 } : p
    )
    );
  };

  const copyPostingLink = (posting: JobPosting) => {
    const url = `https://school.edu/careers/${posting.id}`;
    navigator.clipboard.writeText(url);
    alert('Job posting link copied to clipboard!');
  };

  const exportPostings = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      const headers = ['ID', 'Title', 'Department', 'Status', 'Applications', 'Publish Date', 'Expiry Date', 'Branch'];
      const rows = filteredPostings.map((p) => [
      p.id,
      p.title,
      p.dept,
      p.status,
      p.applications,
      p.publishDate,
      p.expiryDate,
      getBranchName(p.branch)]
      );

      const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

      const link = document.createElement('a');
      link.setAttribute('href', encodeURI(csvContent));
      link.setAttribute('download', `job_postings_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataToExport = {
        exportedAt: new Date().toISOString(),
        totalPostings: filteredPostings.length,
        postings: filteredPostings
      };
      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job_postings_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const printPosting = (posting: JobPosting) => {
    const printContent = `
      <html>
        <head>
          <title>${posting.title} - Job Posting</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { font-size: 24px; margin-bottom: 5px; }
            .meta { color: #666; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; }
          </style>
        </head>
        <body>
          <h1>${posting.title}</h1>
          <div class="meta">
            <p>${posting.dept} | ${getBranchName(posting.branch)} | ${posting.jobType}</p>
            <p>Reference: ${posting.id}</p>
          </div>
          <div class="section">
            <div class="section-title">Description</div>
            <p>${posting.description}</p>
          </div>
          <div class="section">
            <div class="section-title">Responsibilities</div>
            <p>${posting.responsibilities.replace(/\n/g, '<br>')}</p>
          </div>
          <div class="section">
            <div class="section-title">Required Skills</div>
            <p>${posting.skills}</p>
          </div>
          <div class="section">
            <div class="section-title">Eligibility</div>
            <p>${posting.eligibility}</p>
          </div>
          <div class="section">
            <div class="section-title">Compensation</div>
            <p>₹${posting.salaryMin.toLocaleString()} - ₹${posting.salaryMax.toLocaleString()} per month</p>
          </div>
          <div class="section">
            <div class="section-title">Application Deadline</div>
            <p>${posting.expiryDate || 'Open until filled'}</p>
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

  const openViewModal = (posting: JobPosting) => {
    setSelectedPosting(posting);
    setShowViewModal(true);
  };

  const openEditModal = (posting: JobPosting) => {
    setEditingPosting({ ...posting });
    setSelectedPlatforms(posting.platforms);
    setShowEditModal(true);
  };

  const openDeleteModal = (posting: JobPosting) => {
    setSelectedPosting(posting);
    setShowDeleteModal(true);
  };

  const openApplicationsModal = (posting: JobPosting) => {
    setSelectedPosting(posting);
    setShowApplicationsModal(true);
  };

  const openShareModal = (posting: JobPosting) => {
    setSelectedPosting(posting);
    setShowShareModal(true);
  };

  const openActivityModal = (posting: JobPosting) => {
    setSelectedPosting(posting);
    setShowActivityModal(true);
  };

  const openPreviewModal = () => {
    if (!form.jobTitle) {
      alert('Please enter a job title to preview');
      return;
    }
    setShowPreviewModal(true);
  };

  const fillFormFromRequisition = (reqId: string) => {
    const requisition = REQUISITIONS.find((r) => r.id === reqId);
    if (requisition) {
      setForm((f) => ({
        ...f,
        requisitionId: reqId,
        jobTitle: requisition.title,
        dept: requisition.department,
        vacancies: requisition.positions.toString()
      }));
    }
  };

  const checkExpiredPostings = () => {
    const today = new Date();
    let expiredCount = 0;

    setPostings((prev) =>
    prev.map((p) => {
      if (p.status === 'Active' && p.expiryDate && new Date(p.expiryDate) < today) {
        expiredCount++;
        return {
          ...p,
          status: 'Expired',
          activityLog: [
          ...(p.activityLog || []),
          {
            id: `log-${Date.now()}`,
            action: 'Auto-expired',
            performedBy: 'System',
            timestamp: new Date().toLocaleString(),
            details: 'Posting expired based on expiry date'
          }]

        };
      }
      return p;
    })
    );

    if (expiredCount > 0) {
      alert(`${expiredCount} posting(s) have been marked as expired`);
    } else {
      alert('No expired postings found');
    }
  };

  const refreshData = () => {
    checkExpiredPostings();
    alert('Data refreshed successfully');
  };

  const stats = useMemo(() => {
    const activePostings = postings.filter((p) => p.status === 'Active' && activeBranches.includes(p.branch));
    const totalApplications = postings.
    filter((p) => activeBranches.includes(p.branch)).
    reduce((s, p) => s + p.applications, 0);
    const closedPostings = postings.filter(
      (p) => (p.status === 'Closed' || p.status === 'Expired') && activeBranches.includes(p.branch)
    );
    const draftPostings = postings.filter((p) => p.status === 'Draft' && activeBranches.includes(p.branch));

    return {
      active: activePostings.length,
      applications: totalApplications,
      closed: closedPostings.length,
      drafts: draftPostings.length,
      avgApplications: Math.round(totalApplications / Math.max(postings.length, 1))
    };
  }, [postings, activeBranches]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Posting & Advertisement</h1>
              <p className="text-sm text-gray-500">Manage job postings across multiple platforms</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-36" />

            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportPostings('csv')}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setActiveTab('create')}>
              <Plus className="w-4 h-4 mr-1" />
              New Posting
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
            'bg-orange-600 text-white' :
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

        {/* Tabs */}
        <div className="mt-4 flex gap-1 border-b border-gray-200">
          {[
          { key: 'list', label: 'Active Postings', count: stats.active },
          { key: 'drafts', label: 'Drafts', count: stats.drafts },
          { key: 'closed', label: 'Closed', count: stats.closed },
          { key: 'create', label: 'Create New', count: null }].
          map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === tab.key ?
            'border-orange-600 text-orange-600' :
            'border-transparent text-gray-500 hover:text-gray-700'}`
            }>

              {tab.label}
              {tab.count !== null &&
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{tab.count}</span>
            }
            </button>
          )}
        </div>
      </Card>

      {activeTab === 'list' || activeTab === 'drafts' || activeTab === 'closed' ?
      <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
          { label: 'Active Postings', value: stats.active, color: 'green', icon: CheckCircle },
          { label: 'Total Applications', value: stats.applications, color: 'blue', icon: Users },
          { label: 'Drafts', value: stats.drafts, color: 'yellow', icon: FileText },
          { label: 'Closed', value: stats.closed, color: 'gray', icon: Clock },
          { label: 'Avg. Applications', value: stats.avgApplications, color: 'orange', icon: BarChart3 }].
          map((stat, i) =>
          <Card key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </Card>
          )}
          </div>

          {/* Search and Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="Search postings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />

                {searchQuery &&
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
              }
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-1" />
                Filters
              </Button>
              <Select
              label=""
              options={[
              { value: 'date', label: 'Sort by Date' },
              { value: 'applications', label: 'Sort by Applications' },
              { value: 'title', label: 'Sort by Title' }]
              }
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-40" />

              <button
              onClick={() => setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 hover:bg-gray-100 rounded">

                {sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showFilters &&
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
                <Select
              label=""
              options={[
              { value: '', label: 'All Departments' },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]
              }
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-40" />

                <Button variant="outline" size="sm" onClick={() => {setSearchQuery('');setFilterDept('');}}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
              </div>
          }
          </Card>

          {/* Postings List */}
          <div className="space-y-4">
            {filteredPostings.length === 0 ?
          <Card className="p-12 text-center">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No job postings found</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-1" />
                  Create New Posting
                </Button>
              </Card> :

          filteredPostings.map((posting) =>
          <Card key={posting.id} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3
                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-orange-600"
                    onClick={() => openViewModal(posting)}>

                          {posting.title}
                        </h3>
                        <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    posting.status === 'Active' ?
                    'bg-green-100 text-green-700' :
                    posting.status === 'Paused' ?
                    'bg-yellow-100 text-yellow-700' :
                    posting.status === 'Draft' ?
                    'bg-gray-100 text-gray-600' :
                    posting.status === 'Expired' ?
                    'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-600'}`
                    }>

                          {posting.status}
                        </span>
                        {posting.featured &&
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            Featured
                          </span>
                  }
                        {posting.urgent &&
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Urgent
                          </span>
                  }
                        <span className="text-xs text-gray-400 font-mono">{posting.id}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {posting.dept}
                        </span>
                        <span
                    className="flex items-center gap-1 cursor-pointer hover:text-orange-600"
                    onClick={() => openApplicationsModal(posting)}>

                          <Users className="w-4 h-4" />
                          {posting.applications} applications
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {posting.views} views
                        </span>
                        {posting.expiryDate &&
                  <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Expires: {posting.expiryDate}
                          </span>
                  }
                        <span className="text-blue-600">{getBranchName(posting.branch)}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {posting.platforms.map((p) => {
                    const platform = platforms.find((pl) => pl.id === p);
                    return platform ?
                    <span
                      key={p}
                      className={`text-xs px-2 py-0.5 rounded-full bg-${platform.color}-100 text-${platform.color}-700 font-medium`}>

                              {platform.label}
                            </span> :
                    null;
                  })}
                        {posting.platforms.length === 0 && posting.status === 'Draft' &&
                  <span className="text-xs text-gray-400">No platforms selected</span>
                  }
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={() => openViewModal(posting)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditModal(posting)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => duplicatePosting(posting)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Duplicate
                      </Button>
                      {posting.status === 'Draft' &&
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedPosting(posting);
                    setSelectedPlatforms(posting.platforms.length > 0 ? posting.platforms : ['website']);
                    publishPosting(posting);
                  }}>

                          <Send className="w-4 h-4 mr-1" />
                          Publish
                        </Button>
                }
                      {posting.status === 'Active' &&
                <>
                          <Button variant="outline" size="sm" onClick={() => openShareModal(posting)}>
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => unpublishPosting(posting.id)}>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                        </>
                }
                      {posting.status === 'Paused' &&
                <Button variant="primary" size="sm" onClick={() => changePostingStatus(posting.id, 'Active', 'Resumed')}>
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                }
                      {(posting.status === 'Closed' || posting.status === 'Expired') &&
                <Button variant="outline" size="sm" onClick={() => reopenPosting(posting.id)}>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reopen
                        </Button>
                }
                      {posting.status !== 'Closed' && posting.status !== 'Expired' &&
                <Button variant="outline" size="sm" onClick={() => closePosting(posting.id)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Close
                        </Button>
                }
                      <Button variant="outline" size="sm" onClick={() => openDeleteModal(posting)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </Card>
          )
          }
          </div>
        </> : (

      /* Create Form */
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Job Details">
              <div className="space-y-4">
                <Select
                label="Linked Requisition"
                options={[
                { value: '', label: 'Select Requisition (Optional)' },
                ...REQUISITIONS.map((r) => ({ value: r.id, label: `${r.id} - ${r.title} (${r.department})` }))]
                }
                value={form.requisitionId}
                onChange={(e) => fillFormFromRequisition(e.target.value)} />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
                    placeholder="e.g. Senior Mathematics Teacher"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                  <Select
                  label="Department *"
                  options={[
                  { value: '', label: 'Select Department' },
                  ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]
                  }
                  value={form.dept}
                  onChange={(e) => setForm((f) => ({ ...f, dept: e.target.value }))} />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                  <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the role, what the candidate will do, and why this is a great opportunity..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Responsibilities</label>
                  <textarea
                  value={form.responsibilities}
                  onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))}
                  rows={3}
                  placeholder="- Teaching assigned subjects&#10;- Preparing lesson plans&#10;- Evaluating student progress"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                  <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm((f) => ({ ...f, skills: e.target.value }))}
                  placeholder="e.g. Strong communication, Subject expertise, Classroom management"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                  <textarea
                  value={form.eligibility}
                  onChange={(e) => setForm((f) => ({ ...f, eligibility: e.target.value }))}
                  rows={2}
                  placeholder="Minimum qualifications, certifications, experience required..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                  label="Job Type"
                  options={JOB_TYPES}
                  value={form.jobType}
                  onChange={(e) => setForm((f) => ({ ...f, jobType: e.target.value }))} />

                  <Select
                  label="Experience Level"
                  options={EXPERIENCE_LEVELS}
                  value={form.experienceLevel}
                  onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))} />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                  label="Branch"
                  options={BRANCHES.filter((b) => b.id !== 'all').map((b) => ({ value: b.id, label: b.name }))}
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))} />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Vacancies</label>
                    <input
                    type="number"
                    min="1"
                    value={form.vacancies}
                    onChange={(e) => setForm((f) => ({ ...f, vacancies: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Main Campus, New Delhi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min (₹/month)</label>
                    <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
                    placeholder="e.g. 40000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max (₹/month)</label>
                    <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
                    placeholder="e.g. 60000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                    <input
                    type="date"
                    value={form.publishDate}
                    onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="rounded" />

                    <span className="text-sm text-gray-700">Featured Position</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={form.urgent}
                    onChange={(e) => setForm((f) => ({ ...f, urgent: e.target.checked }))}
                    className="rounded" />

                    <span className="text-sm text-gray-700">Urgent Hiring</span>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Posting Platforms">
              <div className="space-y-2">
                {platforms.map((platform) =>
              <label
                key={platform.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedPlatforms.includes(platform.id) ?
                `bg-${platform.color}-50 border border-${platform.color}-200` :
                'bg-gray-50 hover:bg-gray-100'}`
                }>

                    <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform.id)}
                  onChange={() => togglePlatform(platform.id)}
                  className="rounded" />

                    <platform.icon className={`w-4 h-4 text-${platform.color}-600`} />
                    <span className="text-sm font-medium text-gray-700">{platform.label}</span>
                  </label>
              )}
              </div>
            </Card>

            <Card title="Actions">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={openPreviewModal}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Posting
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => createPosting('Draft')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button variant="primary" className="w-full justify-start" size="sm" onClick={() => createPosting('Active')}>
                  <Send className="w-4 h-4 mr-2" />
                  Publish Now
                </Button>
                <Button variant="outline" className="w-full justify-start text-gray-500" size="sm" onClick={resetForm}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
              </div>
            </Card>

            <Card title="Tips">
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  Use clear, descriptive job titles
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  Include salary range to attract more candidates
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  List specific skills and qualifications required
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-3 h-3 mt-0.5 text-blue-500 flex-shrink-0" />
                  Post on multiple platforms for better reach
                </li>
              </ul>
            </Card>
          </div>
        </div>)
      }

      {/* View Modal */}
      {showViewModal && selectedPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Job Posting Details</h2>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedPosting.title}</h3>
                  <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  selectedPosting.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`
                  }>

                    {selectedPosting.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{selectedPosting.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span>Department: {selectedPosting.dept}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Location: {selectedPosting.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>Type: {JOB_TYPES.find((t) => t.value === selectedPosting.jobType)?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Vacancies: {selectedPosting.vacancies}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span>
                    Salary: ₹{selectedPosting.salaryMin.toLocaleString()} - ₹{selectedPosting.salaryMax.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span>Experience: {EXPERIENCE_LEVELS.find((e) => e.value === selectedPosting.experienceLevel)?.label}</span>
                </div>
              </div>

              {selectedPosting.description &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedPosting.description}</p>
                </div>
            }

              {selectedPosting.responsibilities &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Responsibilities</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded whitespace-pre-line">
                    {selectedPosting.responsibilities}
                  </p>
                </div>
            }

              {selectedPosting.skills &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedPosting.skills}</p>
                </div>
            }

              {selectedPosting.eligibility &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Eligibility</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedPosting.eligibility}</p>
                </div>
            }

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedPosting.applications}</p>
                  <p className="text-xs text-gray-500">Applications</p>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedPosting.views}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="bg-purple-50 p-3 rounded text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedPosting.shareCount}</p>
                  <p className="text-xs text-gray-500">Shares</p>
                </div>
              </div>

              {/* Notes Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="flex gap-2 mb-3">
                  <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                  <Button variant="primary" size="sm" onClick={() => addNote(selectedPosting.id, newNote)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedPosting.notes && selectedPosting.notes.length > 0 ?
              <div className="space-y-2">
                    {selectedPosting.notes.map((note) =>
                <div key={note.id} className="flex items-start justify-between bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {note.author} • {note.createdAt}
                          </p>
                        </div>
                        <button
                    onClick={() => deleteNote(selectedPosting.id, note.id)}
                    className="p-1 hover:bg-red-50 rounded">

                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                )}
                  </div> :

              <p className="text-sm text-gray-400 text-center py-2">No notes yet</p>
              }
              </div>
            </div>
            <div className="flex justify-between gap-2 p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(selectedPosting)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => openApplicationsModal(selectedPosting)}>
                  <Users className="w-4 h-4 mr-1" />
                  Applications
                </Button>
                <Button variant="outline" size="sm" onClick={() => openActivityModal(selectedPosting)}>
                  <History className="w-4 h-4 mr-1" />
                  Activity
                </Button>
                <Button variant="outline" size="sm" onClick={() => printPosting(selectedPosting)}>
                  <Printer className="w-4 h-4 mr-1" />
                  Print
                </Button>
              </div>
              <Button variant="primary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Modal */}
      {showEditModal && editingPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Job Posting</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Job Title *"
                value={editingPosting.title}
                onChange={(e) => setEditingPosting({ ...editingPosting, title: e.target.value })} />

                <Select
                label="Department *"
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
                value={editingPosting.dept}
                onChange={(e) => setEditingPosting({ ...editingPosting, dept: e.target.value })} />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                value={editingPosting.description}
                onChange={(e) => setEditingPosting({ ...editingPosting, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                <textarea
                value={editingPosting.responsibilities}
                onChange={(e) => setEditingPosting({ ...editingPosting, responsibilities: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Skills"
                value={editingPosting.skills}
                onChange={(e) => setEditingPosting({ ...editingPosting, skills: e.target.value })} />

                <Input
                label="Eligibility"
                value={editingPosting.eligibility}
                onChange={(e) => setEditingPosting({ ...editingPosting, eligibility: e.target.value })} />

              </div>
              <div className="grid grid-cols-4 gap-4">
                <Input
                label="Salary Min"
                type="number"
                value={editingPosting.salaryMin}
                onChange={(e) => setEditingPosting({ ...editingPosting, salaryMin: parseInt(e.target.value) || 0 })} />

                <Input
                label="Salary Max"
                type="number"
                value={editingPosting.salaryMax}
                onChange={(e) => setEditingPosting({ ...editingPosting, salaryMax: parseInt(e.target.value) || 0 })} />

                <Input
                label="Publish Date"
                type="date"
                value={editingPosting.publishDate}
                onChange={(e) => setEditingPosting({ ...editingPosting, publishDate: e.target.value })} />

                <Input
                label="Expiry Date"
                type="date"
                value={editingPosting.expiryDate}
                onChange={(e) => setEditingPosting({ ...editingPosting, expiryDate: e.target.value })} />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Status"
                options={[
                { value: 'Draft', label: 'Draft' },
                { value: 'Active', label: 'Active' },
                { value: 'Paused', label: 'Paused' },
                { value: 'Closed', label: 'Closed' }]
                }
                value={editingPosting.status}
                onChange={(e) => setEditingPosting({ ...editingPosting, status: e.target.value as PostingStatus })} />

                <Select
                label="Job Type"
                options={JOB_TYPES}
                value={editingPosting.jobType}
                onChange={(e) => setEditingPosting({ ...editingPosting, jobType: e.target.value })} />

                <Select
                label="Branch"
                options={BRANCHES.filter((b) => b.id !== 'all').map((b) => ({ value: b.id, label: b.name }))}
                value={editingPosting.branch}
                onChange={(e) => setEditingPosting({ ...editingPosting, branch: e.target.value })} />

              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={editingPosting.featured}
                  onChange={(e) => setEditingPosting({ ...editingPosting, featured: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={editingPosting.urgent}
                  onChange={(e) => setEditingPosting({ ...editingPosting, urgent: e.target.checked })}
                  className="rounded" />

                  <span className="text-sm">Urgent</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) =>
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => {
                    const currentPlatforms = editingPosting.platforms || [];
                    if (currentPlatforms.includes(platform.id)) {
                      setEditingPosting({
                        ...editingPosting,
                        platforms: currentPlatforms.filter((p) => p !== platform.id)
                      });
                    } else {
                      setEditingPosting({
                        ...editingPosting,
                        platforms: [...currentPlatforms, platform.id]
                      });
                    }
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  editingPosting.platforms?.includes(platform.id) ?
                  'bg-orange-600 text-white' :
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  }>

                      {platform.label}
                    </button>
                )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={updatePosting}>
                <Save className="w-4 h-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold">Delete Job Posting</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedPosting.title}"? This action cannot be undone.
              </p>
              {selectedPosting.applications > 0 &&
            <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-yellow-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    This posting has {selectedPosting.applications} application(s) that will also be affected.
                  </p>
                </div>
            }
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deletePosting(selectedPosting.id)}>

                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Applications Modal */}
      {showApplicationsModal && selectedPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Applications</h2>
                <p className="text-sm text-gray-500">{selectedPosting.title}</p>
              </div>
              <button onClick={() => setShowApplicationsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedPosting.applicationList && selectedPosting.applicationList.length > 0 ?
            <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Candidate</th>
                      <th className="text-left py-2 px-3">Email</th>
                      <th className="text-center py-2 px-3">Applied Date</th>
                      <th className="text-center py-2 px-3">Source</th>
                      <th className="text-center py-2 px-3">Status</th>
                      <th className="text-center py-2 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPosting.applicationList.map((app) =>
                <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-medium">{app.candidateName}</td>
                        <td className="py-2 px-3 text-gray-500">{app.email}</td>
                        <td className="py-2 px-3 text-center">{app.appliedDate}</td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">{app.source}</span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <select
                      value={app.status}
                      onChange={(e) =>
                      updateApplicationStatus(selectedPosting.id, app.id, e.target.value as Application['status'])
                      }
                      className={`text-xs px-2 py-1 rounded border-0 ${
                      app.status === 'Shortlisted' ?
                      'bg-green-100 text-green-700' :
                      app.status === 'Rejected' ?
                      'bg-red-100 text-red-700' :
                      app.status === 'Hired' ?
                      'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'}`
                      }>

                            <option value="New">New</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Hired">Hired</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                )}
                  </tbody>
                </table> :

            <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No applications received yet</p>
                </div>
            }
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowApplicationsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Share Modal */}
      {showShareModal && selectedPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Share Job Posting</h2>
              <button onClick={() => setShowShareModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedPosting.title}</p>
                <p className="text-xs text-gray-500">{selectedPosting.dept}</p>
              </div>
              <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => sharePosting(selectedPosting, 'linkedin')}>

                <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                Share on LinkedIn
              </Button>
              <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => sharePosting(selectedPosting, 'facebook')}>

                <Facebook className="w-4 h-4 mr-2 text-blue-500" />
                Share on Facebook
              </Button>
              <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => sharePosting(selectedPosting, 'twitter')}>

                <Twitter className="w-4 h-4 mr-2 text-gray-700" />
                Share on Twitter/X
              </Button>
              <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => sharePosting(selectedPosting, 'email')}>

                <Send className="w-4 h-4 mr-2" />
                Share via Email
              </Button>
              <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => sharePosting(selectedPosting, 'copy')}>

                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowShareModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Activity Log Modal */}
      {showActivityModal && selectedPosting &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Activity Log</h2>
                <p className="text-sm text-gray-500">{selectedPosting.title}</p>
              </div>
              <button onClick={() => setShowActivityModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {selectedPosting.activityLog && selectedPosting.activityLog.length > 0 ?
            <div className="space-y-3">
                  {selectedPosting.activityLog.
              slice().
              reverse().
              map((log) =>
              <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-1.5 bg-white rounded-full">
                          <History className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{log.action}</p>
                          {log.details && <p className="text-xs text-gray-500">{log.details}</p>}
                          <p className="text-xs text-gray-400 mt-1">
                            By {log.performedBy} • {log.timestamp}
                          </p>
                        </div>
                      </div>
              )}
                </div> :

            <p className="text-center text-gray-400 py-8">No activity recorded</p>
            }
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowActivityModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Preview Modal */}
      {showPreviewModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b bg-orange-50">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold">Preview Mode</h2>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{form.jobTitle || 'Job Title'}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {form.dept || 'Department'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {form.location || getBranchName(form.branch)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {JOB_TYPES.find((t) => t.value === form.jobType)?.label || 'Full Time'}
                  </span>
                </div>
              </div>

              {(form.salaryMin || form.salaryMax) &&
            <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-semibold text-green-700">
                    ₹{parseInt(form.salaryMin || '0').toLocaleString()} - ₹{parseInt(form.salaryMax || '0').toLocaleString()}{' '}
                    per month
                  </p>
                </div>
            }

              {form.description &&
            <div>
                  <h3 className="text-lg font-semibold mb-2">About the Role</h3>
                  <p className="text-gray-600">{form.description}</p>
                </div>
            }

              {form.responsibilities &&
            <div>
                  <h3 className="text-lg font-semibold mb-2">Key Responsibilities</h3>
                  <p className="text-gray-600 whitespace-pre-line">{form.responsibilities}</p>
                </div>
            }

              {form.skills &&
            <div>
                  <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                  <p className="text-gray-600">{form.skills}</p>
                </div>
            }

              {form.eligibility &&
            <div>
                  <h3 className="text-lg font-semibold mb-2">Eligibility Criteria</h3>
                  <p className="text-gray-600">{form.eligibility}</p>
                </div>
            }

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  {form.expiryDate ? `Application Deadline: ${form.expiryDate}` : 'Open until filled'}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Back to Edit
              </Button>
              <Button variant="primary" onClick={() => {setShowPreviewModal(false);createPosting('Active');}}>
                <Send className="w-4 h-4 mr-1" />
                Publish Now
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}