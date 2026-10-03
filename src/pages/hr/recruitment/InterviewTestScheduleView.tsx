import React, { useMemo, useState, useCallback } from 'react';
import {
  Building,
  X,
  Calendar,
  List,
  Clock,
  MapPin,
  Video,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Plus,
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit,
  RotateCcw,
  UserCheck,
  FileText,
  Search,
  Trash2,
  Eye,
  Save,
  MessageSquare,
  Phone,
  Mail,
  Send,
  Printer,
  Filter,
  XCircle,
  Star,
  Paperclip,
  Upload,
  FileSpreadsheet,
  File,
  ExternalLink,
  Copy,
  MoreVertical } from
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


const POSITIONS = [
'Math Teacher',
'Science Teacher',
'English Teacher',
'CS Teacher',
'PE Teacher',
'Science HOD',
'Math HOD',
'English HOD',
'Admin Officer',
'Librarian',
'Counselor'];


const INTERVIEW_TYPES = [
'Demo Class',
'Written Test',
'HR Interview',
'Panel Interview',
'Technical'];


const PANEL_MEMBERS = [
'Principal',
'Vice Principal',
'HR Manager',
'Dr. Amit Shah',
'Mrs. Kavita',
'Mr. Rajan',
'Mr. Suresh',
'Mr. Vikram',
'HOD English',
'HOD Science',
'HOD Math'];


const VENUES = [
{ value: 'room-101', label: 'Room 101', isOnline: false },
{ value: 'room-102', label: 'Room 102', isOnline: false },
{ value: 'conf-room', label: 'Conference Room', isOnline: false },
{ value: 'hr-office', label: 'HR Office', isOnline: false },
{ value: 'computer-lab', label: 'Computer Lab', isOnline: false },
{ value: 'sports-ground', label: 'Sports Ground', isOnline: false },
{ value: 'auditorium', label: 'Auditorium', isOnline: false },
{ value: 'zoom', label: 'Online - Zoom', isOnline: true },
{ value: 'meet', label: 'Online - Google Meet', isOnline: true },
{ value: 'teams', label: 'Online - MS Teams', isOnline: true }];


type InterviewStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
type InterviewType = 'Demo Class' | 'Written Test' | 'HR Interview' | 'Panel Interview' | 'Technical';

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Feedback {
  id: string;
  rating: number;
  strengths: string;
  weaknesses: string;
  recommendation: 'Hire' | 'Reject' | 'Next Round' | 'Hold';
  comments: string;
  givenBy: string;
  createdAt: string;
}

interface RescheduleHistory {
  id: string;
  previousDate: string;
  previousTime: string;
  newDate: string;
  newTime: string;
  reason: string;
  rescheduledBy: string;
  rescheduledAt: string;
}

interface Interview {
  id: string;
  candidate: string;
  candidateEmail?: string;
  candidatePhone?: string;
  avatar: string;
  position: string;
  round: string;
  type: InterviewType;
  panel: string[];
  date: string;
  time: string;
  duration?: number;
  venue: string;
  isOnline: boolean;
  meetingLink?: string;
  status: InterviewStatus;
  branch: string;
  day: number;
  notes?: Note[];
  attachments?: Attachment[];
  feedback?: Feedback[];
  rescheduleHistory?: RescheduleHistory[];
  createdAt?: string;
  updatedAt?: string;
  reminderSent?: boolean;
  lastReminderAt?: string;
}

const initialInterviews: Interview[] = [
{
  id: 'INT-001',
  candidate: 'Priya Sharma',
  candidateEmail: 'priya.sharma@email.com',
  candidatePhone: '+91 9876543210',
  avatar: 'PS',
  position: 'Math Teacher',
  round: 'Round 1',
  type: 'Demo Class',
  panel: ['Dr. Amit Shah', 'Mrs. Kavita'],
  date: '2024-12-18',
  time: '10:00 AM',
  duration: 60,
  venue: 'Room 101',
  isOnline: false,
  status: 'Scheduled',
  branch: 'main',
  day: 18,
  createdAt: '2024-12-10',
  notes: [],
  attachments: [],
  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-002',
  candidate: 'Rahul Verma',
  candidateEmail: 'rahul.verma@email.com',
  candidatePhone: '+91 9876543211',
  avatar: 'RV',
  position: 'Science HOD',
  round: 'Round 2',
  type: 'Panel Interview',
  panel: ['Principal', 'HR Manager', 'Dr. Amit Shah'],
  date: '2024-12-18',
  time: '2:00 PM',
  duration: 90,
  venue: 'Conference Room',
  isOnline: false,
  status: 'Scheduled',
  branch: 'main',
  day: 18,
  createdAt: '2024-12-08',
  notes: [
  {
    id: 'n1',
    content: 'Candidate has 10 years of experience',
    author: 'HR Manager',
    createdAt: '2024-12-08'
  }],

  attachments: [],
  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-003',
  candidate: 'Anita Desai',
  candidateEmail: 'anita.desai@email.com',
  candidatePhone: '+91 9876543212',
  avatar: 'AD',
  position: 'Admin Officer',
  round: 'Round 1',
  type: 'HR Interview',
  panel: ['Mrs. Kavita'],
  date: '2024-12-19',
  time: '11:00 AM',
  duration: 45,
  venue: 'HR Office',
  isOnline: false,
  status: 'Scheduled',
  branch: 'north',
  day: 19,
  createdAt: '2024-12-09',
  notes: [],
  attachments: [],
  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-004',
  candidate: 'Suresh Kumar',
  candidateEmail: 'suresh.kumar@email.com',
  candidatePhone: '+91 9876543213',
  avatar: 'SK',
  position: 'PE Teacher',
  round: 'Round 1',
  type: 'Demo Class',
  panel: ['Mr. Rajan', 'Mr. Suresh'],
  date: '2024-12-20',
  time: '9:00 AM',
  duration: 60,
  venue: 'Sports Ground',
  isOnline: false,
  status: 'Scheduled',
  branch: 'south',
  day: 20,
  createdAt: '2024-12-07',
  notes: [],
  attachments: [],
  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-005',
  candidate: 'Meera Patel',
  candidateEmail: 'meera.patel@email.com',
  candidatePhone: '+91 9876543214',
  avatar: 'MP',
  position: 'CS Teacher',
  round: 'Round 1',
  type: 'Written Test',
  panel: ['Mr. Vikram'],
  date: '2024-12-20',
  time: '10:30 AM',
  duration: 120,
  venue: 'Computer Lab',
  isOnline: false,
  status: 'Scheduled',
  branch: 'east',
  day: 20,
  createdAt: '2024-12-06',
  notes: [],
  attachments: [
  {
    id: 'att1',
    name: 'Written_Test_CS.pdf',
    type: 'PDF',
    size: '2.5 MB',
    uploadedAt: '2024-12-06',
    uploadedBy: 'Mr. Vikram'
  }],

  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-006',
  candidate: 'Vikram Singh',
  candidateEmail: 'vikram.singh@email.com',
  candidatePhone: '+91 9876543215',
  avatar: 'VS',
  position: 'English Teacher',
  round: 'Round 2',
  type: 'Panel Interview',
  panel: ['Principal', 'HOD English'],
  date: '2024-12-21',
  time: '11:00 AM',
  duration: 60,
  venue: 'Online - Google Meet',
  isOnline: true,
  meetingLink: 'https://meet.google.com/abc-defg-hij',
  status: 'Scheduled',
  branch: 'south',
  day: 21,
  createdAt: '2024-12-05',
  notes: [],
  attachments: [],
  feedback: [],
  rescheduleHistory: []
},
{
  id: 'INT-007',
  candidate: 'Amit Gupta',
  candidateEmail: 'amit.gupta@email.com',
  candidatePhone: '+91 9876543216',
  avatar: 'AG',
  position: 'Math Teacher',
  round: 'Round 3',
  type: 'HR Interview',
  panel: ['HR Manager'],
  date: '2024-12-15',
  time: '3:00 PM',
  duration: 45,
  venue: 'HR Office',
  isOnline: false,
  status: 'Completed',
  branch: 'east',
  day: 15,
  createdAt: '2024-12-01',
  updatedAt: '2024-12-15',
  notes: [],
  attachments: [],
  feedback: [
  {
    id: 'f1',
    rating: 4,
    strengths: 'Strong subject knowledge, good communication',
    weaknesses: 'Limited experience with smart classrooms',
    recommendation: 'Hire',
    comments: 'Recommended for hiring with training on digital tools',
    givenBy: 'HR Manager',
    createdAt: '2024-12-15'
  }],

  rescheduleHistory: []
},
{
  id: 'INT-008',
  candidate: 'Deepak Nair',
  candidateEmail: 'deepak.nair@email.com',
  candidatePhone: '+91 9876543217',
  avatar: 'DN',
  position: 'CS Teacher',
  round: 'Round 1',
  type: 'Technical',
  panel: ['Mr. Vikram', 'Mr. Rajan'],
  date: '2024-12-16',
  time: '10:00 AM',
  duration: 90,
  venue: 'Online - Zoom',
  isOnline: true,
  meetingLink: 'https://zoom.us/j/123456789',
  status: 'Rescheduled',
  branch: 'north',
  day: 16,
  createdAt: '2024-12-02',
  updatedAt: '2024-12-14',
  notes: [],
  attachments: [],
  feedback: [],
  rescheduleHistory: [
  {
    id: 'rh1',
    previousDate: '2024-12-14',
    previousTime: '2:00 PM',
    newDate: '2024-12-16',
    newTime: '10:00 AM',
    reason: 'Candidate requested due to prior commitment',
    rescheduledBy: 'HR Manager',
    rescheduledAt: '2024-12-12'
  }]

}];


const statusConfig: Record<InterviewStatus, {color: string;bg: string;icon: React.ElementType;}> = {
  Scheduled: { color: 'text-blue-700', bg: 'bg-blue-100', icon: Clock },
  Completed: { color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle },
  Cancelled: { color: 'text-red-700', bg: 'bg-red-100', icon: AlertCircle },
  Rescheduled: { color: 'text-orange-700', bg: 'bg-orange-100', icon: RotateCcw }
};

const typeConfig: Record<InterviewType, string> = {
  'Demo Class': 'bg-orange-100 text-orange-700',
  'Written Test': 'bg-blue-100 text-blue-700',
  'HR Interview': 'bg-purple-100 text-purple-700',
  'Panel Interview': 'bg-indigo-100 text-indigo-700',
  Technical: 'bg-teal-100 text-teal-700'
};

export function InterviewTestScheduleView() {
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['all']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentWeekStart, setCurrentWeekStart] = useState(16);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);

  // Form states
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    candidate: '',
    candidateEmail: '',
    candidatePhone: '',
    position: '',
    round: 'Round 1',
    type: 'HR Interview',
    panel: [],
    date: '',
    time: '',
    duration: 60,
    venue: '',
    isOnline: false,
    branch: 'main',
    status: 'Scheduled'
  });

  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });

  const [feedbackData, setFeedbackData] = useState({
    rating: 3,
    strengths: '',
    weaknesses: '',
    recommendation: 'Next Round' as 'Hire' | 'Reject' | 'Next Round' | 'Hold',
    comments: ''
  });

  const [cancelReason, setCancelReason] = useState('');
  const [newNote, setNewNote] = useState('');

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

  const filtered = useMemo(() => {
    return interviews.filter((i) => {
      const branchMatch = activeBranches.includes(i.branch);
      const statusMatch = filterStatus === 'all' || i.status === filterStatus;
      const typeMatch = filterType === 'all' || i.type === filterType;
      const searchMatch =
      !searchQuery ||
      i.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && statusMatch && typeMatch && searchMatch;
    });
  }, [interviews, activeBranches, filterStatus, filterType, searchQuery]);

  const getBranchName = (id: string) => BRANCHES.find((b) => b.id === id)?.name || id;

  const getWeekDates = (startDay: number) => {
    return Array.from({ length: 7 }, (_, i) => ({
      day: startDay + i,
      label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      interviews: filtered.filter((interview) => interview.day === startDay + i)
    }));
  };

  const weekDays = getWeekDates(currentWeekStart);

  const goToToday = () => {
    setCurrentWeekStart(16);
  };

  const generateAvatar = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  // Schedule new interview
  const scheduleInterview = () => {
    if (!newInterview.candidate || !newInterview.date || !newInterview.time || !newInterview.position) {
      alert('Please fill in all required fields');
      return;
    }

    const interview: Interview = {
      id: `INT-${Date.now()}`,
      candidate: newInterview.candidate || '',
      candidateEmail: newInterview.candidateEmail,
      candidatePhone: newInterview.candidatePhone,
      avatar: generateAvatar(newInterview.candidate || ''),
      position: newInterview.position || '',
      round: newInterview.round || 'Round 1',
      type: newInterview.type as InterviewType || 'HR Interview',
      panel: newInterview.panel || [],
      date: newInterview.date || '',
      time: newInterview.time || '',
      duration: newInterview.duration || 60,
      venue: newInterview.venue || '',
      isOnline: newInterview.isOnline || false,
      meetingLink: newInterview.meetingLink,
      status: 'Scheduled',
      branch: newInterview.branch || 'main',
      day: parseInt(newInterview.date?.split('-')[2] || '1'),
      createdAt: new Date().toISOString().split('T')[0],
      notes: [],
      attachments: [],
      feedback: [],
      rescheduleHistory: []
    };

    setInterviews((prev) => [...prev, interview]);
    setShowScheduleModal(false);
    resetNewInterview();
    alert(`Interview scheduled successfully for ${interview.candidate}`);
  };

  const resetNewInterview = () => {
    setNewInterview({
      candidate: '',
      candidateEmail: '',
      candidatePhone: '',
      position: '',
      round: 'Round 1',
      type: 'HR Interview',
      panel: [],
      date: '',
      time: '',
      duration: 60,
      venue: '',
      isOnline: false,
      branch: 'main',
      status: 'Scheduled'
    });
  };

  // Edit interview
  const openEditModal = (interview: Interview) => {
    setEditingInterview({ ...interview });
    setShowEditModal(true);
  };

  const saveEditedInterview = () => {
    if (!editingInterview) return;
    setInterviews((prev) =>
    prev.map((i) =>
    i.id === editingInterview.id ?
    { ...editingInterview, updatedAt: new Date().toISOString().split('T')[0] } :
    i
    )
    );
    setShowEditModal(false);
    setEditingInterview(null);
  };

  // Reschedule interview
  const openRescheduleModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setRescheduleData({ newDate: '', newTime: '', reason: '' });
    setShowRescheduleModal(true);
  };

  const rescheduleInterview = () => {
    if (!selectedInterview || !rescheduleData.newDate || !rescheduleData.newTime) {
      alert('Please fill in all required fields');
      return;
    }

    const historyEntry: RescheduleHistory = {
      id: `rh-${Date.now()}`,
      previousDate: selectedInterview.date,
      previousTime: selectedInterview.time,
      newDate: rescheduleData.newDate,
      newTime: rescheduleData.newTime,
      reason: rescheduleData.reason,
      rescheduledBy: 'Current User',
      rescheduledAt: new Date().toISOString().split('T')[0]
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === selectedInterview.id ?
    {
      ...i,
      date: rescheduleData.newDate,
      time: rescheduleData.newTime,
      day: parseInt(rescheduleData.newDate.split('-')[2]),
      status: 'Rescheduled' as InterviewStatus,
      rescheduleHistory: [...(i.rescheduleHistory || []), historyEntry],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );

    setShowRescheduleModal(false);
    setSelectedInterview(null);
    alert(`Interview rescheduled to ${rescheduleData.newDate} at ${rescheduleData.newTime}`);
  };

  // Cancel interview
  const openCancelModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const cancelInterview = () => {
    if (!selectedInterview) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: `Interview cancelled. Reason: ${cancelReason || 'No reason provided'}`,
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === selectedInterview.id ?
    {
      ...i,
      status: 'Cancelled' as InterviewStatus,
      notes: [...(i.notes || []), note],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );

    setShowCancelModal(false);
    setSelectedInterview(null);
    alert('Interview cancelled successfully');
  };

  // Mark as completed
  const markAsCompleted = (interview: Interview) => {
    setInterviews((prev) =>
    prev.map((i) =>
    i.id === interview.id ?
    {
      ...i,
      status: 'Completed' as InterviewStatus,
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );
    alert(`Interview with ${interview.candidate} marked as completed`);
  };

  // Send reminder
  const sendReminder = (interview: Interview) => {
    const note: Note = {
      id: `note-${Date.now()}`,
      content: `Reminder sent to candidate and panel members`,
      author: 'System',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === interview.id ?
    {
      ...i,
      reminderSent: true,
      lastReminderAt: new Date().toISOString(),
      notes: [...(i.notes || []), note]
    } :
    i
    )
    );

    alert(`Reminder sent to ${interview.candidate} and panel members: ${interview.panel.join(', ')}`);
  };

  // Add feedback
  const openFeedbackModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setFeedbackData({
      rating: 3,
      strengths: '',
      weaknesses: '',
      recommendation: 'Next Round',
      comments: ''
    });
    setShowFeedbackModal(true);
  };

  const submitFeedback = () => {
    if (!selectedInterview) return;

    const feedback: Feedback = {
      id: `f-${Date.now()}`,
      ...feedbackData,
      givenBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === selectedInterview.id ?
    {
      ...i,
      feedback: [...(i.feedback || []), feedback],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );

    setShowFeedbackModal(false);
    setSelectedInterview(null);
    alert('Feedback submitted successfully');
  };

  // Attachments
  const openAttachmentModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowAttachmentModal(true);
  };

  const addAttachment = (fileName: string) => {
    if (!selectedInterview || !fileName) return;

    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      name: fileName,
      type: fileName.split('.').pop()?.toUpperCase() || 'FILE',
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User'
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === selectedInterview.id ?
    {
      ...i,
      attachments: [...(i.attachments || []), attachment],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );

    if (selectedInterview) {
      setSelectedInterview({
        ...selectedInterview,
        attachments: [...(selectedInterview.attachments || []), attachment]
      });
    }
  };

  const removeAttachment = (interviewId: string, attachmentId: string) => {
    setInterviews((prev) =>
    prev.map((i) =>
    i.id === interviewId ?
    {
      ...i,
      attachments: i.attachments?.filter((a) => a.id !== attachmentId)
    } :
    i
    )
    );
    if (selectedInterview && selectedInterview.id === interviewId) {
      setSelectedInterview({
        ...selectedInterview,
        attachments: selectedInterview.attachments?.filter((a) => a.id !== attachmentId)
      });
    }
  };

  // Notes
  const addNote = (interviewId: string, content: string) => {
    if (!content.trim()) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      content: content.trim(),
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInterviews((prev) =>
    prev.map((i) =>
    i.id === interviewId ?
    {
      ...i,
      notes: [...(i.notes || []), note],
      updatedAt: new Date().toISOString().split('T')[0]
    } :
    i
    )
    );

    if (selectedInterview && selectedInterview.id === interviewId) {
      setSelectedInterview({
        ...selectedInterview,
        notes: [...(selectedInterview.notes || []), note]
      });
    }
    setNewNote('');
  };

  // Detail modal
  const openDetailModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setShowDetailModal(true);
  };

  // Selection
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedItems(new Set(filtered.map((i) => i.id)));
  };

  const deselectAll = () => {
    setSelectedItems(new Set());
  };

  // Bulk actions
  const bulkSendReminders = () => {
    const selectedInterviews = interviews.filter((i) => selectedItems.has(i.id));
    selectedInterviews.forEach((interview) => {
      const note: Note = {
        id: `note-${Date.now()}-${interview.id}`,
        content: 'Bulk reminder sent',
        author: 'System',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setInterviews((prev) =>
      prev.map((i) =>
      i.id === interview.id ?
      { ...i, reminderSent: true, lastReminderAt: new Date().toISOString(), notes: [...(i.notes || []), note] } :
      i
      )
      );
    });
    alert(`Reminders sent to ${selectedInterviews.length} interviews`);
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  const bulkCancel = () => {
    if (!window.confirm(`Are you sure you want to cancel ${selectedItems.size} interviews?`)) return;

    setInterviews((prev) =>
    prev.map((i) =>
    selectedItems.has(i.id) ?
    { ...i, status: 'Cancelled' as InterviewStatus, updatedAt: new Date().toISOString().split('T')[0] } :
    i
    )
    );
    alert(`${selectedItems.size} interviews cancelled`);
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  const bulkMarkCompleted = () => {
    setInterviews((prev) =>
    prev.map((i) =>
    selectedItems.has(i.id) ?
    { ...i, status: 'Completed' as InterviewStatus, updatedAt: new Date().toISOString().split('T')[0] } :
    i
    )
    );
    alert(`${selectedItems.size} interviews marked as completed`);
    setSelectedItems(new Set());
    setShowBulkActionModal(false);
  };

  // Delete
  const deleteInterview = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;
    setInterviews((prev) => prev.filter((i) => i.id !== id));
  };

  // Duplicate
  const duplicateInterview = (interview: Interview) => {
    const duplicated: Interview = {
      ...interview,
      id: `INT-${Date.now()}`,
      status: 'Scheduled',
      notes: [],
      feedback: [],
      rescheduleHistory: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: undefined
    };
    setInterviews((prev) => [...prev, duplicated]);
    alert('Interview duplicated successfully');
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
    'ID',
    'Candidate',
    'Email',
    'Phone',
    'Position',
    'Round',
    'Type',
    'Panel',
    'Date',
    'Time',
    'Venue',
    'Status',
    'Branch'];

    const rows = filtered.map((i) => [
    i.id,
    i.candidate,
    i.candidateEmail || '',
    i.candidatePhone || '',
    i.position,
    i.round,
    i.type,
    i.panel.join('; '),
    i.date,
    i.time,
    i.venue,
    i.status,
    getBranchName(i.branch)]
    );

    const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `interview_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const dataToExport = {
      exportedAt: new Date().toISOString(),
      academicYear,
      totalInterviews: filtered.length,
      interviews: filtered
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview_schedule_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Interview Schedule</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { font-size: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Interview & Test Schedule</h1>
          <p>Academic Year: ${academicYear}</p>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Candidate</th>
                <th>Position</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.
    map(
      (i) => `
                <tr>
                  <td>${i.id}</td>
                  <td>${i.candidate}</td>
                  <td>${i.position}</td>
                  <td>${i.type}</td>
                  <td>${i.date} ${i.time}</td>
                  <td>${i.venue}</td>
                  <td>${i.status}</td>
                </tr>
              `
    ).
    join('')}
            </tbody>
          </table>
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

  const refreshData = () => {
    setInterviews([...initialInterviews]);
    setSelectedItems(new Set());
    alert('Data refreshed');
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard');
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview & Test Schedule</h1>
              <p className="text-sm text-gray-500">View and manage all scheduled interviews and tests</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-36" />

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`
                }>

                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`
                }>

                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="primary" size="sm" onClick={() => setShowScheduleModal(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Schedule
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
            'bg-purple-600 text-white' :
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
        {
          label: 'Total Scheduled',
          value: filtered.filter((i) => i.status === 'Scheduled').length,
          color: 'blue',
          icon: Calendar
        },
        {
          label: "Today's Interviews",
          value: filtered.filter((i) => i.day === 18).length,
          color: 'purple',
          icon: Clock
        },
        {
          label: 'Completed',
          value: filtered.filter((i) => i.status === 'Completed').length,
          color: 'green',
          icon: CheckCircle
        },
        {
          label: 'Rescheduled',
          value: filtered.filter((i) => i.status === 'Rescheduled').length,
          color: 'orange',
          icon: RotateCcw
        }].
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

      {/* Bulk Actions Bar */}
      {selectedItems.size > 0 &&
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-purple-800">{selectedItems.size} interviews selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowBulkActionModal(true)}>
              Bulk Actions
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Clear Selection
            </Button>
          </div>
        </div>
      }

      {viewMode === 'calendar' ? (
      /* Calendar View */
      <Card>
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
              onClick={() => setCurrentWeekStart((w) => w - 7)}
              className="p-1.5 hover:bg-gray-100 rounded-lg">

                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">December {currentWeekStart}–{currentWeekStart + 6}, 2024</h3>
              <button
              onClick={() => setCurrentWeekStart((w) => w + 7)}
              className="p-1.5 hover:bg-gray-100 rounded-lg">

                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <div className="grid grid-cols-7 divide-x divide-gray-100">
            {weekDays.map((wd) =>
          <div key={wd.day} className={`min-h-48 ${wd.day === 18 ? 'bg-purple-50' : ''}`}>
                <div
              className={`p-3 text-center border-b border-gray-100 ${
              wd.day === 18 ? 'bg-purple-100' : 'bg-gray-50'}`
              }>

                  <p className="text-xs text-gray-500">{wd.label}</p>
                  <p className={`text-lg font-bold ${wd.day === 18 ? 'text-purple-700' : 'text-gray-900'}`}>{wd.day}</p>
                </div>
                <div className="p-2 space-y-1.5">
                  {wd.interviews.map((interview) =>
              <div
                key={interview.id}
                onClick={() => openDetailModal(interview)}
                className={`p-2 rounded-lg text-xs cursor-pointer hover:opacity-90 ${typeConfig[interview.type]}`}>

                      <p className="font-semibold truncate">{interview.candidate}</p>
                      <p className="truncate opacity-80">{interview.time}</p>
                      <p className="truncate opacity-70">{interview.type}</p>
                    </div>
              )}
                </div>
              </div>
          )}
          </div>
        </Card>) : (

      /* List View */
      <Card>
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
              type="text"
              placeholder="Search candidates, positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />

              {searchQuery &&
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
            }
            </div>
            <Select
            label=""
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'Scheduled', label: 'Scheduled' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Rescheduled', label: 'Rescheduled' },
            { value: 'Cancelled', label: 'Cancelled' }]
            }
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-40" />

            <Select
            label=""
            options={[
            { value: 'all', label: 'All Types' },
            ...INTERVIEW_TYPES.map((t) => ({ value: t, label: t }))]
            }
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-40" />

            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
            <div className="border-l pl-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="py-3 px-2 w-10">
                    <input
                    type="checkbox"
                    checked={selectedItems.size === filtered.length && filtered.length > 0}
                    onChange={(e) => e.target.checked ? selectAll() : deselectAll()}
                    className="rounded" />

                  </th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Candidate</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Position</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Round</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Panel</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Venue</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-center py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((interview) => {
                const sc = statusConfig[interview.status];
                const StatusIcon = sc.icon;
                return (
                  <tr
                    key={interview.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedItems.has(interview.id) ? 'bg-purple-50' : ''}`
                    }>

                      <td className="py-3 px-2">
                        <input
                        type="checkbox"
                        checked={selectedItems.has(interview.id)}
                        onChange={() => toggleSelectItem(interview.id)}
                        className="rounded" />

                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {interview.avatar}
                          </div>
                          <div>
                            <p
                            className="font-medium text-gray-900 cursor-pointer hover:text-purple-600"
                            onClick={() => openDetailModal(interview)}>

                              {interview.candidate}
                            </p>
                            <p className="text-xs text-gray-400">{getBranchName(interview.branch)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{interview.position}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                          {interview.round}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeConfig[interview.type]}`}>
                          {interview.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {interview.panel.slice(0, 2).map((p, i) =>
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {p}
                            </span>
                        )}
                          {interview.panel.length > 2 &&
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              +{interview.panel.length - 2}
                            </span>
                        }
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{interview.date}</p>
                        <p className="text-xs text-gray-500">{interview.time}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {interview.isOnline ?
                        <>
                              <Video className="w-3.5 h-3.5 text-blue-500" />
                              <span className="text-xs text-gray-600">{interview.venue}</span>
                              {interview.meetingLink &&
                          <button
                            onClick={() => copyMeetingLink(interview.meetingLink!)}
                            className="p-0.5 hover:bg-gray-100 rounded"
                            title="Copy link">

                                  <Copy className="w-3 h-3 text-gray-400" />
                                </button>
                          }
                            </> :

                        <>
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-xs text-gray-600">{interview.venue}</span>
                            </>
                        }
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${sc.bg} ${sc.color}`}>

                          <StatusIcon className="w-3 h-3" />
                          {interview.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                          onClick={() => openDetailModal(interview)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="View Details">

                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => openRescheduleModal(interview)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                          title="Reschedule"
                          disabled={interview.status === 'Completed' || interview.status === 'Cancelled'}>

                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => sendReminder(interview)}
                          className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600 transition-colors"
                          title="Send Reminder"
                          disabled={interview.status === 'Completed' || interview.status === 'Cancelled'}>

                            <Bell className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => markAsCompleted(interview)}
                          className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 transition-colors"
                          title="Mark Completed"
                          disabled={interview.status === 'Completed' || interview.status === 'Cancelled'}>

                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => openAttachmentModal(interview)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="Attachments">

                            <FileText className="w-4 h-4" />
                            {interview.attachments && interview.attachments.length > 0 &&
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                                {interview.attachments.length}
                              </span>
                          }
                          </button>
                          <button
                          onClick={() => openFeedbackModal(interview)}
                          className="p-1.5 hover:bg-yellow-50 rounded-lg text-yellow-600 transition-colors"
                          title="Add Feedback">

                            <Star className="w-4 h-4" />
                          </button>
                          <button
                          onClick={() => openCancelModal(interview)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                          title="Cancel"
                          disabled={interview.status === 'Completed' || interview.status === 'Cancelled'}>

                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>);

              })}
                {filtered.length === 0 &&
              <tr>
                    <td colSpan={10} className="py-12 text-center text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No interviews found matching your criteria</p>
                    </td>
                  </tr>
              }
              </tbody>
            </table>
          </div>
        </Card>)
      }

      {/* Schedule Interview Modal */}
      {showScheduleModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Schedule New Interview</h2>
              <button onClick={() => setShowScheduleModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Candidate Name *"
                value={newInterview.candidate || ''}
                onChange={(e) => setNewInterview({ ...newInterview, candidate: e.target.value })}
                placeholder="Enter candidate name" />

                <Select
                label="Position *"
                options={[{ value: '', label: 'Select Position...' }, ...POSITIONS.map((p) => ({ value: p, label: p }))]}
                value={newInterview.position || ''}
                onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Email"
                type="email"
                value={newInterview.candidateEmail || ''}
                onChange={(e) => setNewInterview({ ...newInterview, candidateEmail: e.target.value })}
                placeholder="candidate@email.com" />

                <Input
                label="Phone"
                value={newInterview.candidatePhone || ''}
                onChange={(e) => setNewInterview({ ...newInterview, candidatePhone: e.target.value })}
                placeholder="+91 9876543210" />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <Select
                label="Round"
                options={[
                { value: 'Round 1', label: 'Round 1' },
                { value: 'Round 2', label: 'Round 2' },
                { value: 'Round 3', label: 'Round 3' },
                { value: 'Final Round', label: 'Final Round' }]
                }
                value={newInterview.round || 'Round 1'}
                onChange={(e) => setNewInterview({ ...newInterview, round: e.target.value })} />

                <Select
                label="Type *"
                options={INTERVIEW_TYPES.map((t) => ({ value: t, label: t }))}
                value={newInterview.type || 'HR Interview'}
                onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as InterviewType })} />

                <Select
                label="Branch"
                options={BRANCHES.filter((b) => b.id !== 'all').map((b) => ({ value: b.id, label: b.name }))}
                value={newInterview.branch || 'main'}
                onChange={(e) => setNewInterview({ ...newInterview, branch: e.target.value })} />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Date *"
                type="date"
                value={newInterview.date || ''}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })} />

                <Input
                label="Time *"
                type="time"
                value={newInterview.time || ''}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })} />

                <Input
                label="Duration (mins)"
                type="number"
                value={newInterview.duration || 60}
                onChange={(e) => setNewInterview({ ...newInterview, duration: parseInt(e.target.value) })} />

              </div>
              <Select
              label="Venue"
              options={VENUES.map((v) => ({ value: v.label, label: `${v.label}${v.isOnline ? ' 🌐' : ''}` }))}
              value={newInterview.venue || ''}
              onChange={(e) => {
                const venue = VENUES.find((v) => v.label === e.target.value);
                setNewInterview({
                  ...newInterview,
                  venue: e.target.value,
                  isOnline: venue?.isOnline || false
                });
              }} />

              {newInterview.isOnline &&
            <Input
              label="Meeting Link"
              value={newInterview.meetingLink || ''}
              onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/..." />

            }
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Panel Members</label>
                <div className="flex flex-wrap gap-2">
                  {PANEL_MEMBERS.map((member) =>
                <button
                  key={member}
                  type="button"
                  onClick={() => {
                    const currentPanel = newInterview.panel || [];
                    if (currentPanel.includes(member)) {
                      setNewInterview({ ...newInterview, panel: currentPanel.filter((p) => p !== member) });
                    } else {
                      setNewInterview({ ...newInterview, panel: [...currentPanel, member] });
                    }
                  }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  (newInterview.panel || []).includes(member) ?
                  'bg-purple-600 text-white' :
                  'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                  }>

                      {member}
                    </button>
                )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={scheduleInterview}>
                <Plus className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  {selectedInterview.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedInterview.candidate}</h2>
                  <p className="text-sm text-gray-500">{selectedInterview.id}</p>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">Position: {selectedInterview.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      {selectedInterview.date} at {selectedInterview.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedInterview.isOnline ?
                  <Video className="w-4 h-4 text-blue-500" /> :

                  <MapPin className="w-4 h-4 text-gray-400" />
                  }
                    <span className="text-sm">{selectedInterview.venue}</span>
                    {selectedInterview.isOnline && selectedInterview.meetingLink &&
                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1">

                        <ExternalLink className="w-3 h-3" />
                        Join
                      </a>
                  }
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedInterview.candidateEmail &&
                <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedInterview.candidateEmail}</span>
                    </div>
                }
                  {selectedInterview.candidatePhone &&
                <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{selectedInterview.candidatePhone}</span>
                    </div>
                }
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{getBranchName(selectedInterview.branch)}</span>
                  </div>
                </div>
              </div>

              {/* Status and Type */}
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeConfig[selectedInterview.type]}`}>
                  {selectedInterview.type}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                  {selectedInterview.round}
                </span>
                <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig[selectedInterview.status].bg} ${statusConfig[selectedInterview.status].color}`}>

                  {selectedInterview.status}
                </span>
              </div>

              {/* Panel */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Panel Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInterview.panel.map((p, i) =>
                <span key={i} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      {p}
                    </span>
                )}
                </div>
              </div>

              {/* Reschedule History */}
              {selectedInterview.rescheduleHistory && selectedInterview.rescheduleHistory.length > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Reschedule History</h4>
                  <div className="space-y-2">
                    {selectedInterview.rescheduleHistory.map((rh) =>
                <div key={rh.id} className="bg-orange-50 p-3 rounded-lg text-sm">
                        <p>
                          Changed from {rh.previousDate} {rh.previousTime} to {rh.newDate} {rh.newTime}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Reason: {rh.reason} | By: {rh.rescheduledBy} | {rh.rescheduledAt}
                        </p>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Feedback */}
              {selectedInterview.feedback && selectedInterview.feedback.length > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                  <div className="space-y-2">
                    {selectedInterview.feedback.map((f) =>
                <div key={f.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) =>
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= f.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />

                      )}
                          </div>
                          <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                      f.recommendation === 'Hire' ?
                      'bg-green-100 text-green-700' :
                      f.recommendation === 'Reject' ?
                      'bg-red-100 text-red-700' :
                      f.recommendation === 'Hold' ?
                      'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'}`
                      }>

                            {f.recommendation}
                          </span>
                        </div>
                        <p className="text-sm">
                          <strong>Strengths:</strong> {f.strengths}
                        </p>
                        <p className="text-sm">
                          <strong>Weaknesses:</strong> {f.weaknesses}
                        </p>
                        {f.comments &&
                  <p className="text-sm">
                            <strong>Comments:</strong> {f.comments}
                          </p>
                  }
                        <p className="text-xs text-gray-400 mt-2">
                          By {f.givenBy} on {f.createdAt}
                        </p>
                      </div>
                )}
                  </div>
                </div>
            }

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="flex gap-2 mb-3">
                  <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addNote(selectedInterview.id, newNote);
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />

                  <Button variant="primary" onClick={() => addNote(selectedInterview.id, newNote)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {selectedInterview.notes && selectedInterview.notes.length > 0 ?
              <div className="space-y-2">
                    {selectedInterview.notes.map((note) =>
                <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {note.author} • {note.createdAt}
                        </p>
                      </div>
                )}
                  </div> :

              <p className="text-sm text-gray-400 text-center py-4">No notes yet</p>
              }
              </div>

              {/* Attachments */}
              {selectedInterview.attachments && selectedInterview.attachments.length > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedInterview.attachments.map((att) =>
                <div key={att.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{att.name}</p>
                            <p className="text-xs text-gray-400">
                              {att.size} • {att.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                )}
                  </div>
                </div>
            }
            </div>
            <div className="flex justify-between gap-2 p-4 border-t">
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEditModal(selectedInterview)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => duplicateInterview(selectedInterview)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                variant="outline"
                onClick={() => deleteInterview(selectedInterview.id)}
                className="text-red-600 hover:bg-red-50">

                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
              <Button variant="primary" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Reschedule Interview</h2>
              <button onClick={() => setShowRescheduleModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedInterview.candidate}</p>
                <p className="text-xs text-gray-500">
                  Current: {selectedInterview.date} at {selectedInterview.time}
                </p>
              </div>
              <Input
              label="New Date *"
              type="date"
              value={rescheduleData.newDate}
              onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })} />

              <Input
              label="New Time *"
              type="time"
              value={rescheduleData.newTime}
              onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                value={rescheduleData.reason}
                onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Reason for rescheduling..." />

              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={rescheduleInterview}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Cancel Modal */}
      {showCancelModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Cancel Interview</h2>
              <button onClick={() => setShowCancelModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-700">
                  Are you sure you want to cancel the interview with {selectedInterview.candidate}?
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
                <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Reason for cancellation..." />

              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                Keep Interview
              </Button>
              <Button variant="primary" onClick={cancelInterview} className="bg-red-600 hover:bg-red-700">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Interview
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Add Feedback</h2>
              <button onClick={() => setShowFeedbackModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">{selectedInterview.candidate}</p>
                <p className="text-xs text-gray-500">
                  {selectedInterview.position} - {selectedInterview.type}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) =>
                <button
                  key={star}
                  onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                  className="p-1">

                      <Star
                    className={`w-8 h-8 ${
                    star <= feedbackData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`
                    } />

                    </button>
                )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strengths</label>
                <textarea
                value={feedbackData.strengths}
                onChange={(e) => setFeedbackData({ ...feedbackData, strengths: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
                placeholder="Candidate's strengths..." />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weaknesses</label>
                <textarea
                value={feedbackData.weaknesses}
                onChange={(e) => setFeedbackData({ ...feedbackData, weaknesses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
                placeholder="Areas for improvement..." />

              </div>
              <Select
              label="Recommendation"
              options={[
              { value: 'Hire', label: 'Hire' },
              { value: 'Reject', label: 'Reject' },
              { value: 'Next Round', label: 'Next Round' },
              { value: 'Hold', label: 'Hold' }]
              }
              value={feedbackData.recommendation}
              onChange={(e) =>
              setFeedbackData({
                ...feedbackData,
                recommendation: e.target.value as 'Hire' | 'Reject' | 'Next Round' | 'Hold'
              })
              } />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                <textarea
                value={feedbackData.comments}
                onChange={(e) => setFeedbackData({ ...feedbackData, comments: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={2}
                placeholder="Any additional comments..." />

              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowFeedbackModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitFeedback}>
                <Save className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Attachment Modal */}
      {showAttachmentModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Manage Attachments</h2>
              <button onClick={() => setShowAttachmentModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click or drag files to upload</p>
                <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    addAttachment(file.name);
                  }
                  e.target.value = '';
                }}
                className="hidden"
                id="file-upload" />

                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" as="span" className="cursor-pointer">
                    Select File
                  </Button>
                </label>
              </div>
              <div className="space-y-2">
                {selectedInterview.attachments && selectedInterview.attachments.length > 0 ?
              selectedInterview.attachments.map((att) =>
              <div key={att.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">{att.name}</p>
                          <p className="text-xs text-gray-400">{att.size}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAttachment(selectedInterview.id, att.id)}>

                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
              ) :

              <p className="text-sm text-gray-400 text-center py-4">No attachments yet</p>
              }
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="primary" onClick={() => setShowAttachmentModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Bulk Action Modal */}
      {showBulkActionModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Bulk Actions ({selectedItems.size} selected)</h2>
              <button onClick={() => setShowBulkActionModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <Button variant="outline" className="w-full justify-start" onClick={bulkSendReminders}>
                <Bell className="w-4 h-4 mr-2" />
                Send Reminders to All
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={bulkMarkCompleted}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All as Completed
              </Button>
              <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={bulkCancel}>

                <XCircle className="w-4 h-4 mr-2" />
                Cancel All Selected
              </Button>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowBulkActionModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Export Modal */}
      {showExportModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Export Schedule</h2>
              <button onClick={() => setShowExportModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => {exportToCSV();setShowExportModal(false);}}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Export as CSV
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {exportToJSON();setShowExportModal(false);}}>
                <File className="w-4 h-4 mr-2" />
                Export as JSON
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {handlePrint();setShowExportModal(false);}}>
                <Printer className="w-4 h-4 mr-2" />
                Print Schedule
              </Button>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Modal */}
      {showEditModal && editingInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Interview</h2>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Candidate Name"
                value={editingInterview.candidate}
                onChange={(e) => setEditingInterview({ ...editingInterview, candidate: e.target.value })} />

                <Select
                label="Position"
                options={POSITIONS.map((p) => ({ value: p, label: p }))}
                value={editingInterview.position}
                onChange={(e) => setEditingInterview({ ...editingInterview, position: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                label="Email"
                type="email"
                value={editingInterview.candidateEmail || ''}
                onChange={(e) => setEditingInterview({ ...editingInterview, candidateEmail: e.target.value })} />

                <Input
                label="Phone"
                value={editingInterview.candidatePhone || ''}
                onChange={(e) => setEditingInterview({ ...editingInterview, candidatePhone: e.target.value })} />

              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input
                label="Date"
                type="date"
                value={editingInterview.date}
                onChange={(e) => setEditingInterview({ ...editingInterview, date: e.target.value })} />

                <Input
                label="Time"
                type="time"
                value={editingInterview.time}
                onChange={(e) => setEditingInterview({ ...editingInterview, time: e.target.value })} />

                <Select
                label="Status"
                options={[
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Cancelled', label: 'Cancelled' },
                { value: 'Rescheduled', label: 'Rescheduled' }]
                }
                value={editingInterview.status}
                onChange={(e) => setEditingInterview({ ...editingInterview, status: e.target.value as InterviewStatus })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select
                label="Type"
                options={INTERVIEW_TYPES.map((t) => ({ value: t, label: t }))}
                value={editingInterview.type}
                onChange={(e) => setEditingInterview({ ...editingInterview, type: e.target.value as InterviewType })} />

                <Select
                label="Venue"
                options={VENUES.map((v) => ({ value: v.label, label: v.label }))}
                value={editingInterview.venue}
                onChange={(e) => {
                  const venue = VENUES.find((v) => v.label === e.target.value);
                  setEditingInterview({
                    ...editingInterview,
                    venue: e.target.value,
                    isOnline: venue?.isOnline || false
                  });
                }} />

              </div>
              {editingInterview.isOnline &&
            <Input
              label="Meeting Link"
              value={editingInterview.meetingLink || ''}
              onChange={(e) => setEditingInterview({ ...editingInterview, meetingLink: e.target.value })} />

            }
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={saveEditedInterview}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}