import React, { useState, useMemo, useCallback } from 'react';
import {
  Building,
  X,
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Bell,
  CheckCircle,
  Plus,
  FileText,
  AlertCircle,
  BookOpen,
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
  ExternalLink,
  Check,
  XCircle,
  Info,
  Paperclip,
  File,
  History,
  RotateCcw,
  Link,
  ChevronDown,
  ChevronUp,
  Settings,
  Star,
  UserCheck,
  UserX,
  Filter } from
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


const ROUND_TYPES = [
{ value: 'Round 1', label: 'Round 1 - Initial Screening' },
{ value: 'Round 2', label: 'Round 2 - Technical' },
{ value: 'Round 3', label: 'Round 3 - Final' },
{ value: 'Demo', label: 'Demo Class' },
{ value: 'Written', label: 'Written Test' }];


const INTERVIEW_TYPES = [
{ value: 'Demo Class', label: 'Demo Class' },
{ value: 'Written Test', label: 'Written Test' },
{ value: 'HR Interview', label: 'HR Interview' },
{ value: 'Panel Interview', label: 'Panel Interview' },
{ value: 'Technical', label: 'Technical Interview' }];


const DURATIONS = [
{ value: '30', label: '30 minutes' },
{ value: '45', label: '45 minutes' },
{ value: '60', label: '60 minutes' },
{ value: '90', label: '90 minutes' },
{ value: '120', label: '120 minutes' }];


const VENUES = [
{ value: 'room-101', label: 'Room 101', branch: 'main' },
{ value: 'room-102', label: 'Room 102', branch: 'main' },
{ value: 'conf-room', label: 'Conference Room', branch: 'main' },
{ value: 'hr-office', label: 'HR Office', branch: 'main' },
{ value: 'computer-lab', label: 'Computer Lab', branch: 'east' },
{ value: 'auditorium', label: 'Auditorium', branch: 'main' },
{ value: 'north-101', label: 'North Wing Room 101', branch: 'north' },
{ value: 'south-101', label: 'South Wing Room 101', branch: 'south' }];


const CLASSROOMS = [
{ value: 'class-8a', label: 'Class 8A - Room 205' },
{ value: 'class-8b', label: 'Class 8B - Room 206' },
{ value: 'class-9a', label: 'Class 9A - Room 301' },
{ value: 'class-9b', label: 'Class 9B - Room 302' },
{ value: 'class-10a', label: 'Class 10A - Room 401' },
{ value: 'class-10b', label: 'Class 10B - Room 402' }];


interface Candidate {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  applicationId: string;
  status: 'Pending' | 'Scheduled' | 'Completed' | 'Rejected';
  branch: string;
}

interface PanelMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  available: boolean;
  expertise: string[];
  scheduledSlots?: {date: string;time: string;duration: number;}[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'test-paper' | 'evaluation-form' | 'resume' | 'other';
}

interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  position: string;
  roundType: string;
  interviewType: string;
  date: string;
  time: string;
  duration: number;
  venue: string;
  isOnline: boolean;
  onlineLink?: string;
  demoTopic?: string;
  classroomAssigned?: string;
  panelMembers: string[];
  attachments: Attachment[];
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled' | 'Draft';
  branch: string;
  sendEmail: boolean;
  sendSMS: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  feedback?: {
    rating: number;
    comments: string;
    recommendation: string;
    givenBy: string;
    givenAt: string;
  }[];
}

const initialCandidates: Candidate[] = [
{
  id: 'CAND-001',
  name: 'Priya Sharma',
  position: 'Math Teacher',
  email: 'priya.sharma@email.com',
  phone: '+91 9876543210',
  applicationId: 'APP-2024-001',
  status: 'Pending',
  branch: 'main'
},
{
  id: 'CAND-002',
  name: 'Rahul Verma',
  position: 'Science HOD',
  email: 'rahul.verma@email.com',
  phone: '+91 9876543211',
  applicationId: 'APP-2024-002',
  status: 'Scheduled',
  branch: 'main'
},
{
  id: 'CAND-003',
  name: 'Suresh Kumar',
  position: 'PE Teacher',
  email: 'suresh.kumar@email.com',
  phone: '+91 9876543212',
  applicationId: 'APP-2024-003',
  status: 'Pending',
  branch: 'south'
},
{
  id: 'CAND-004',
  name: 'Anita Desai',
  position: 'English Teacher',
  email: 'anita.desai@email.com',
  phone: '+91 9876543213',
  applicationId: 'APP-2024-004',
  status: 'Pending',
  branch: 'north'
},
{
  id: 'CAND-005',
  name: 'Vikram Singh',
  position: 'CS Teacher',
  email: 'vikram.singh@email.com',
  phone: '+91 9876543214',
  applicationId: 'APP-2024-005',
  status: 'Pending',
  branch: 'east'
}];


const initialPanelMembers: PanelMember[] = [
{
  id: '1',
  name: 'Dr. Amit Shah',
  role: 'Principal',
  email: 'amit.shah@school.edu',
  phone: '+91 9876543001',
  available: true,
  expertise: ['Administration', 'Leadership', 'General'],
  scheduledSlots: []
},
{
  id: '2',
  name: 'Mrs. Kavita Sharma',
  role: 'HR Manager',
  email: 'kavita@school.edu',
  phone: '+91 9876543002',
  available: true,
  expertise: ['HR', 'Recruitment', 'Policy'],
  scheduledSlots: []
},
{
  id: '3',
  name: 'Mr. Vikram Mehta',
  role: 'HOD Science',
  email: 'vikram.m@school.edu',
  phone: '+91 9876543003',
  available: false,
  expertise: ['Science', 'Physics', 'Chemistry'],
  scheduledSlots: [{ date: '2024-12-18', time: '10:00', duration: 60 }]
},
{
  id: '4',
  name: 'Mr. Rajan Gupta',
  role: 'HOD Math',
  email: 'rajan@school.edu',
  phone: '+91 9876543004',
  available: true,
  expertise: ['Mathematics', 'Statistics'],
  scheduledSlots: []
},
{
  id: '5',
  name: 'Ms. Priya Nair',
  role: 'Senior Teacher',
  email: 'priya.n@school.edu',
  phone: '+91 9876543005',
  available: true,
  expertise: ['English', 'Literature', 'Communication'],
  scheduledSlots: []
},
{
  id: '6',
  name: 'Mr. Deepak Verma',
  role: 'HOD Computer Science',
  email: 'deepak@school.edu',
  phone: '+91 9876543006',
  available: true,
  expertise: ['Computer Science', 'Programming', 'Technology'],
  scheduledSlots: []
},
{
  id: '7',
  name: 'Mrs. Sunita Reddy',
  role: 'Vice Principal',
  email: 'sunita@school.edu',
  phone: '+91 9876543007',
  available: true,
  expertise: ['Administration', 'Curriculum', 'General'],
  scheduledSlots: []
}];


const initialScheduledInterviews: ScheduledInterview[] = [
{
  id: 'INT-001',
  candidateId: 'CAND-002',
  candidateName: 'Rahul Verma',
  candidateEmail: 'rahul.verma@email.com',
  candidatePhone: '+91 9876543211',
  position: 'Science HOD',
  roundType: 'Round 2',
  interviewType: 'Panel Interview',
  date: '2024-12-18',
  time: '14:00',
  duration: 90,
  venue: 'Conference Room',
  isOnline: false,
  panelMembers: ['1', '2', '4'],
  attachments: [],
  status: 'Scheduled',
  branch: 'main',
  sendEmail: true,
  sendSMS: true,
  createdAt: '2024-12-10',
  updatedAt: '2024-12-10',
  createdBy: 'HR Manager'
}];


interface FormState {
  candidateId: string;
  roundType: string;
  interviewType: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  onlineLink: string;
  demoTopic: string;
  classroomAssigned: string;
  sendEmail: boolean;
  sendSMS: boolean;
  notes: string;
}

const initialFormState: FormState = {
  candidateId: '',
  roundType: '',
  interviewType: '',
  date: '',
  time: '',
  duration: '60',
  venue: '',
  onlineLink: '',
  demoTopic: '',
  classroomAssigned: '',
  sendEmail: true,
  sendSMS: true,
  notes: ''
};

export function InterviewTestScheduling() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [panelMembers, setPanelMembers] = useState<PanelMember[]>(initialPanelMembers);
  const [scheduledInterviews, setScheduledInterviews] = useState<ScheduledInterview[]>(initialScheduledInterviews);
  const [drafts, setDrafts] = useState<ScheduledInterview[]>([]);

  const [selectedBranches, setSelectedBranches] = useState<string[]>(['main']);
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [selectedPanel, setSelectedPanel] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Modal states
  const [showScheduleListModal, setShowScheduleListModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDraftsModal, setShowDraftsModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showPanelDetailsModal, setShowPanelDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showNotificationPreviewModal, setShowNotificationPreviewModal] = useState(false);

  const [selectedInterview, setSelectedInterview] = useState<ScheduledInterview | null>(null);
  const [editingInterview, setEditingInterview] = useState<ScheduledInterview | null>(null);
  const [selectedPanelMember, setSelectedPanelMember] = useState<PanelMember | null>(null);
  const [conflicts, setConflicts] = useState<{type: string;message: string;details?: any;}[]>([]);
  const [searchCandidate, setSearchCandidate] = useState('');
  const [filterPanelExpertise, setFilterPanelExpertise] = useState('');

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

  const togglePanel = (id: string) => {
    const member = panelMembers.find((m) => m.id === id);
    if (!member?.available) return;

    setSelectedPanel((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setSelectedPanel([]);
    setIsOnline(false);
    setAttachments([]);
  };

  const getSelectedCandidate = () => {
    return candidates.find((c) => c.id === form.candidateId || c.applicationId === form.candidateId);
  };

  const checkConflicts = (): {type: string;message: string;details?: any;}[] => {
    const conflicts: {type: string;message: string;details?: any;}[] = [];

    if (!form.date || !form.time) return conflicts;

    const selectedDate = form.date;
    const selectedTime = form.time;
    const duration = parseInt(form.duration);

    // Check panel member conflicts
    selectedPanel.forEach((panelId) => {
      const member = panelMembers.find((m) => m.id === panelId);
      if (member?.scheduledSlots) {
        member.scheduledSlots.forEach((slot) => {
          if (slot.date === selectedDate) {
            const slotStart = parseInt(slot.time.replace(':', ''));
            const slotEnd = slotStart + slot.duration;
            const newStart = parseInt(selectedTime.replace(':', ''));
            const newEnd = newStart + duration;

            if (newStart >= slotStart && newStart < slotEnd || newEnd > slotStart && newEnd <= slotEnd) {
              conflicts.push({
                type: 'panel',
                message: `${member.name} has a conflict at ${slot.time}`,
                details: { member, slot }
              });
            }
          }
        });
      }
    });

    // Check venue conflicts
    if (!isOnline && form.venue) {
      const existingBookings = scheduledInterviews.filter(
        (i) => i.date === selectedDate && i.venue === form.venue && i.status !== 'Cancelled'
      );
      existingBookings.forEach((booking) => {
        const bookingStart = parseInt(booking.time.replace(':', ''));
        const bookingEnd = bookingStart + booking.duration;
        const newStart = parseInt(selectedTime.replace(':', ''));
        const newEnd = newStart + duration;

        if (newStart >= bookingStart && newStart < bookingEnd || newEnd > bookingStart && newEnd <= bookingEnd) {
          conflicts.push({
            type: 'venue',
            message: `Venue "${form.venue}" is booked at ${booking.time} for ${booking.candidateName}`,
            details: booking
          });
        }
      });
    }

    // Check if candidate already has interview on same date
    const candidate = getSelectedCandidate();
    if (candidate) {
      const existingInterview = scheduledInterviews.find(
        (i) => i.candidateId === candidate.id && i.date === selectedDate && i.status !== 'Cancelled'
      );
      if (existingInterview) {
        conflicts.push({
          type: 'candidate',
          message: `${candidate.name} already has an interview scheduled on ${selectedDate}`,
          details: existingInterview
        });
      }
    }

    return conflicts;
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!form.candidateId) errors.push('Please select a candidate');
    if (!form.roundType) errors.push('Please select a round type');
    if (!form.interviewType) errors.push('Please select an interview type');
    if (!form.date) errors.push('Please select a date');
    if (!form.time) errors.push('Please select a time');
    if (!isOnline && !form.venue) errors.push('Please select a venue');
    if (isOnline && !form.onlineLink) errors.push('Please enter an online meeting link');
    if (selectedPanel.length === 0) errors.push('Please select at least one panel member');
    if (form.interviewType === 'Demo Class' && !form.demoTopic) errors.push('Please enter a demo topic');

    return errors;
  };

  const scheduleInterview = (asDraft: boolean = false) => {
    const errors = validateForm();
    if (errors.length > 0 && !asDraft) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    const detectedConflicts = checkConflicts();
    if (detectedConflicts.length > 0 && !asDraft) {
      setConflicts(detectedConflicts);
      setShowConflictModal(true);
      return;
    }

    createInterview(asDraft ? 'Draft' : 'Scheduled');
  };

  const createInterview = (status: 'Scheduled' | 'Draft') => {
    const candidate = getSelectedCandidate();
    if (!candidate && status === 'Scheduled') return;

    const now = new Date().toISOString().split('T')[0];
    const newInterview: ScheduledInterview = {
      id: `INT-${Date.now()}`,
      candidateId: candidate?.id || form.candidateId,
      candidateName: candidate?.name || 'Unknown',
      candidateEmail: candidate?.email || '',
      candidatePhone: candidate?.phone || '',
      position: candidate?.position || '',
      roundType: form.roundType,
      interviewType: form.interviewType,
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration),
      venue: isOnline ? 'Online' : form.venue,
      isOnline,
      onlineLink: isOnline ? form.onlineLink : undefined,
      demoTopic: form.interviewType === 'Demo Class' ? form.demoTopic : undefined,
      classroomAssigned: form.interviewType === 'Demo Class' ? form.classroomAssigned : undefined,
      panelMembers: selectedPanel,
      attachments,
      status,
      branch: selectedBranches[0] || 'main',
      sendEmail: form.sendEmail,
      sendSMS: form.sendSMS,
      notes: form.notes,
      createdAt: now,
      updatedAt: now,
      createdBy: 'Current User'
    };

    if (status === 'Draft') {
      setDrafts((prev) => [...prev, newInterview]);
      alert('Interview saved as draft!');
    } else {
      setScheduledInterviews((prev) => [...prev, newInterview]);

      // Update panel member scheduled slots
      setPanelMembers((prev) =>
      prev.map((m) =>
      selectedPanel.includes(m.id) ?
      {
        ...m,
        scheduledSlots: [
        ...(m.scheduledSlots || []),
        { date: form.date, time: form.time, duration: parseInt(form.duration) }]

      } :
      m
      )
      );

      // Update candidate status
      setCandidates((prev) =>
      prev.map((c) => c.id === candidate?.id ? { ...c, status: 'Scheduled' } : c)
      );

      // Send notifications
      if (form.sendEmail || form.sendSMS) {
        sendNotifications(newInterview);
      }

      alert(`Interview scheduled successfully for ${candidate?.name}!`);
    }

    resetForm();
    setShowConflictModal(false);
  };

  const sendNotifications = (interview: ScheduledInterview) => {
    const panelNames = interview.panelMembers.
    map((id) => panelMembers.find((m) => m.id === id)?.name).
    filter(Boolean).
    join(', ');

    if (interview.sendEmail) {
      console.log(`Email sent to ${interview.candidateEmail}`);
      console.log(`Email sent to panel: ${panelNames}`);
    }

    if (interview.sendSMS) {
      console.log(`SMS sent to ${interview.candidatePhone}`);
    }

    alert(
      `Notifications sent:\n${interview.sendEmail ? '✓ Email to candidate and panel\n' : ''}${
      interview.sendSMS ? '✓ SMS to candidate' : ''}`

    );
  };

  const loadDraft = (draft: ScheduledInterview) => {
    setForm({
      candidateId: draft.candidateId,
      roundType: draft.roundType,
      interviewType: draft.interviewType,
      date: draft.date,
      time: draft.time,
      duration: draft.duration.toString(),
      venue: draft.venue,
      onlineLink: draft.onlineLink || '',
      demoTopic: draft.demoTopic || '',
      classroomAssigned: draft.classroomAssigned || '',
      sendEmail: draft.sendEmail,
      sendSMS: draft.sendSMS,
      notes: draft.notes || ''
    });
    setSelectedPanel(draft.panelMembers);
    setIsOnline(draft.isOnline);
    setAttachments(draft.attachments);
    setShowDraftsModal(false);
  };

  const deleteDraft = (draftId: string) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    }
  };

  const cancelInterview = (interviewId: string) => {
    if (!window.confirm('Are you sure you want to cancel this interview?')) return;

    setScheduledInterviews((prev) =>
    prev.map((i) =>
    i.id === interviewId ?
    { ...i, status: 'Cancelled', updatedAt: new Date().toISOString().split('T')[0] } :
    i
    )
    );

    // Update candidate status
    const interview = scheduledInterviews.find((i) => i.id === interviewId);
    if (interview) {
      setCandidates((prev) =>
      prev.map((c) => c.id === interview.candidateId ? { ...c, status: 'Pending' } : c)
      );
    }

    alert('Interview cancelled successfully');
  };

  const rescheduleInterview = (interview: ScheduledInterview) => {
    setEditingInterview({ ...interview });
    setForm({
      candidateId: interview.candidateId,
      roundType: interview.roundType,
      interviewType: interview.interviewType,
      date: '',
      time: '',
      duration: interview.duration.toString(),
      venue: interview.venue,
      onlineLink: interview.onlineLink || '',
      demoTopic: interview.demoTopic || '',
      classroomAssigned: interview.classroomAssigned || '',
      sendEmail: interview.sendEmail,
      sendSMS: interview.sendSMS,
      notes: interview.notes || ''
    });
    setSelectedPanel(interview.panelMembers);
    setIsOnline(interview.isOnline);
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const updateInterview = () => {
    if (!editingInterview) return;

    const errors = validateForm();
    if (errors.length > 0) {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
      return;
    }

    const candidate = getSelectedCandidate();
    const updatedInterview: ScheduledInterview = {
      ...editingInterview,
      candidateId: candidate?.id || form.candidateId,
      candidateName: candidate?.name || editingInterview.candidateName,
      candidateEmail: candidate?.email || editingInterview.candidateEmail,
      candidatePhone: candidate?.phone || editingInterview.candidatePhone,
      position: candidate?.position || editingInterview.position,
      roundType: form.roundType,
      interviewType: form.interviewType,
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration),
      venue: isOnline ? 'Online' : form.venue,
      isOnline,
      onlineLink: isOnline ? form.onlineLink : undefined,
      demoTopic: form.interviewType === 'Demo Class' ? form.demoTopic : undefined,
      classroomAssigned: form.interviewType === 'Demo Class' ? form.classroomAssigned : undefined,
      panelMembers: selectedPanel,
      attachments,
      sendEmail: form.sendEmail,
      sendSMS: form.sendSMS,
      notes: form.notes,
      status: 'Rescheduled',
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setScheduledInterviews((prev) => prev.map((i) => i.id === editingInterview.id ? updatedInterview : i));

    if (form.sendEmail || form.sendSMS) {
      sendNotifications(updatedInterview);
    }

    setShowEditModal(false);
    setEditingInterview(null);
    resetForm();
    alert('Interview rescheduled successfully!');
  };

  const markAsCompleted = (interviewId: string) => {
    setScheduledInterviews((prev) =>
    prev.map((i) =>
    i.id === interviewId ?
    { ...i, status: 'Completed', updatedAt: new Date().toISOString().split('T')[0] } :
    i
    )
    );

    const interview = scheduledInterviews.find((i) => i.id === interviewId);
    if (interview) {
      setCandidates((prev) =>
      prev.map((c) => c.id === interview.candidateId ? { ...c, status: 'Completed' } : c)
      );
    }

    alert('Interview marked as completed');
  };

  const addAttachment = (category: Attachment['category'], fileName?: string) => {
    const name = fileName || prompt(`Enter ${category.replace('-', ' ')} name:`);
    if (!name) return;

    const attachment: Attachment = {
      id: `att-${Date.now()}`,
      name,
      type: name.split('.').pop()?.toUpperCase() || 'FILE',
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      category
    };

    setAttachments((prev) => [...prev, attachment]);
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  };

  const openViewModal = (interview: ScheduledInterview) => {
    setSelectedInterview(interview);
    setShowViewModal(true);
  };

  const openPanelDetails = (member: PanelMember) => {
    setSelectedPanelMember(member);
    setShowPanelDetailsModal(true);
  };

  const checkPanelAvailability = (date: string, time: string) => {
    if (!date || !time) return;

    setPanelMembers((prev) =>
    prev.map((member) => {
      const hasConflict = member.scheduledSlots?.some((slot) => {
        if (slot.date !== date) return false;
        const slotStart = parseInt(slot.time.replace(':', ''));
        const slotEnd = slotStart + slot.duration;
        const checkTime = parseInt(time.replace(':', ''));
        return checkTime >= slotStart && checkTime < slotEnd;
      });

      return { ...member, available: !hasConflict };
    })
    );
  };

  const generateMeetingLink = () => {
    const link = `https://meet.school.edu/${Date.now().toString(36)}`;
    setForm((f) => ({ ...f, onlineLink: link }));
  };

  const copyMeetingLink = () => {
    if (form.onlineLink) {
      navigator.clipboard.writeText(form.onlineLink);
      alert('Meeting link copied to clipboard!');
    }
  };

  const previewNotification = () => {
    const candidate = getSelectedCandidate();
    if (!candidate) {
      alert('Please select a candidate first');
      return;
    }
    setShowNotificationPreviewModal(true);
  };

  const filteredPanelMembers = useMemo(() => {
    let result = panelMembers;
    if (filterPanelExpertise) {
      result = result.filter((m) =>
      m.expertise.some((e) => e.toLowerCase().includes(filterPanelExpertise.toLowerCase()))
      );
    }
    return result;
  }, [panelMembers, filterPanelExpertise]);

  const filteredCandidates = useMemo(() => {
    let result = candidates.filter((c) => c.status === 'Pending' || c.status === 'Scheduled');
    if (searchCandidate) {
      result = result.filter(
        (c) =>
        c.name.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.applicationId.toLowerCase().includes(searchCandidate.toLowerCase()) ||
        c.position.toLowerCase().includes(searchCandidate.toLowerCase())
      );
    }
    return result;
  }, [candidates, searchCandidate]);

  const upcomingInterviews = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return scheduledInterviews.
    filter((i) => i.status === 'Scheduled' && i.date >= today).
    sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [scheduledInterviews]);

  const todayInterviews = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return scheduledInterviews.filter((i) => i.date === today && i.status === 'Scheduled');
  }, [scheduledInterviews]);

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
              <h1 className="text-2xl font-bold text-gray-900">Interview & Test Scheduling</h1>
              <p className="text-sm text-gray-500">Schedule interviews with panel availability check</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              label=""
              options={ACADEMIC_YEARS}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-36" />

            <Button variant="outline" size="sm" onClick={() => setShowScheduleListModal(true)}>
              <Calendar className="w-4 h-4 mr-1" />
              View Schedule ({upcomingInterviews.length})
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowDraftsModal(true)}>
              <FileText className="w-4 h-4 mr-1" />
              Drafts ({drafts.length})
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
            'bg-purple-600 text-white' :
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

        {/* Today's Interviews Alert */}
        {todayInterviews.length > 0 &&
        <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">
                {todayInterviews.length} interview(s) scheduled for today
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowScheduleListModal(true)}>
              View All
            </Button>
          </div>
        }
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate & Round */}
          <Card title="Interview Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate *</label>
                <div className="flex gap-2">
                  <select
                    value={form.candidateId}
                    onChange={(e) => setForm((f) => ({ ...f, candidateId: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">

                    <option value="">Select Candidate</option>
                    {filteredCandidates.map((c) =>
                    <option key={c.id} value={c.id}>
                        {c.name} - {c.position} ({c.applicationId})
                      </option>
                    )}
                  </select>
                  <Button variant="outline" size="sm" onClick={() => setShowCandidateModal(true)}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Select
                label="Round Type *"
                options={[{ value: '', label: 'Select Round' }, ...ROUND_TYPES]}
                value={form.roundType}
                onChange={(e) => setForm((f) => ({ ...f, roundType: e.target.value }))} />

              <Select
                label="Interview Type *"
                options={[{ value: '', label: 'Select Type' }, ...INTERVIEW_TYPES]}
                value={form.interviewType}
                onChange={(e) => setForm((f) => ({ ...f, interviewType: e.target.value }))} />

              <Select
                label="Duration"
                options={DURATIONS}
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, date: e.target.value }));
                    checkPanelAvailability(e.target.value, form.time);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, time: e.target.value }));
                    checkPanelAvailability(form.date, e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

              </div>
            </div>
          </Card>

          {/* Venue */}
          <Card title="Venue / Location">
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!isOnline}
                  onChange={() => setIsOnline(false)}
                  className="text-purple-600" />

                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Physical Venue</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isOnline}
                  onChange={() => setIsOnline(true)}
                  className="text-purple-600" />

                <Video className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Online</span>
              </label>
            </div>
            {isOnline ?
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Meeting Link</label>
                <div className="flex gap-2">
                  <input
                  type="url"
                  value={form.onlineLink}
                  onChange={(e) => setForm((f) => ({ ...f, onlineLink: e.target.value }))}
                  placeholder="https://meet.google.com/..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  <Button variant="outline" size="sm" onClick={generateMeetingLink}>
                    <Link className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                  {form.onlineLink &&
                <Button variant="outline" size="sm" onClick={copyMeetingLink}>
                      <Copy className="w-4 h-4" />
                    </Button>
                }
                </div>
              </div> :

            <div className="grid grid-cols-2 gap-4">
                <Select
                label="Venue / Room"
                options={[
                { value: '', label: 'Select Venue' },
                ...VENUES.filter(
                  (v) => selectedBranches.includes('all') || selectedBranches.includes(v.branch)
                ).map((v) => ({ value: v.value, label: v.label }))]
                }
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))} />

                {form.interviewType === 'Demo Class' &&
              <Select
                label="Classroom Assigned"
                options={[{ value: '', label: 'Select Classroom' }, ...CLASSROOMS]}
                value={form.classroomAssigned}
                onChange={(e) => setForm((f) => ({ ...f, classroomAssigned: e.target.value }))} />

              }
              </div>
            }
            {form.interviewType === 'Demo Class' &&
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo Class Topic *</label>
                <input
                type="text"
                value={form.demoTopic}
                onChange={(e) => setForm((f) => ({ ...f, demoTopic: e.target.value }))}
                placeholder="e.g. Quadratic Equations - Class 10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

              </div>
            }
          </Card>

          {/* Notes */}
          <Card title="Additional Notes">
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Any special instructions or notes for the interview..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500" />

          </Card>

          {/* Notifications */}
          <Card title="Notifications">
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm((f) => ({ ...f, sendEmail: e.target.checked }))}
                  className="rounded" />

                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Send Email Notification</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sendSMS}
                  onChange={(e) => setForm((f) => ({ ...f, sendSMS: e.target.checked }))}
                  className="rounded" />

                <MessageSquare className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Send SMS Notification</span>
              </label>
              <Button variant="outline" size="sm" onClick={previewNotification}>
                <Eye className="w-4 h-4 mr-1" />
                Preview Notification
              </Button>
            </div>
          </Card>

          {/* Attachments Preview */}
          {attachments.length > 0 &&
          <Card title={`Attachments (${attachments.length})`}>
              <div className="space-y-2">
                {attachments.map((att) =>
              <div key={att.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{att.name}</p>
                        <p className="text-xs text-gray-400">
                          {att.category.replace('-', ' ')} • {att.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => removeAttachment(att.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
              )}
              </div>
            </Card>
          }

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => scheduleInterview(false)}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
            <Button variant="outline" onClick={() => scheduleInterview(true)}>
              <Save className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Right: Panel Selection */}
        <div className="space-y-6">
          <Card title="Interview Panel">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Filter by expertise..."
                value={filterPanelExpertise}
                onChange={(e) => setFilterPanelExpertise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

            </div>
            <p className="text-xs text-gray-500 mb-3">Select panel members (availability shown)</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPanelMembers.map((member) =>
              <label
                key={member.id}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                selectedPanel.includes(member.id) ?
                'border-purple-500 bg-purple-50' :
                'border-gray-200 hover:border-gray-300'} ${
                !member.available ? 'opacity-50' : ''}`}
                onClick={() => openPanelDetails(member)}>

                  <input
                  type="checkbox"
                  checked={selectedPanel.includes(member.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    member.available && togglePanel(member.id);
                  }}
                  disabled={!member.available}
                  className="rounded"
                  onClick={(e) => e.stopPropagation()} />

                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {member.name.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                  <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  member.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                  }>

                    {member.available ? 'Free' : 'Busy'}
                  </span>
                </label>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-3">{selectedPanel.length} member(s) selected</p>
          </Card>

          <Card title="Attach Documents">
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addAttachment('test-paper')}>

                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                Attach Test Paper
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addAttachment('evaluation-form')}>

                <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                Attach Evaluation Form
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addAttachment('resume')}>

                <File className="w-4 h-4 mr-2 text-gray-500" />
                Attach Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => addAttachment('other')}>

                <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
                Attach Other Document
              </Button>
            </div>
            {attachments.length > 0 &&
            <p className="text-xs text-gray-500 mt-3">{attachments.length} document(s) attached</p>
            }
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Stats">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Today's Interviews</span>
                <span className="text-sm font-bold text-purple-600">{todayInterviews.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Upcoming</span>
                <span className="text-sm font-bold text-blue-600">{upcomingInterviews.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Pending Candidates</span>
                <span className="text-sm font-bold text-orange-600">
                  {candidates.filter((c) => c.status === 'Pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Drafts</span>
                <span className="text-sm font-bold text-gray-600">{drafts.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule List Modal */}
      {showScheduleListModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Scheduled Interviews</h2>
              <button onClick={() => setShowScheduleListModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {scheduledInterviews.length === 0 ?
            <div className="text-center py-12 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No interviews scheduled</p>
                </div> :

            <div className="space-y-3">
                  {scheduledInterviews.map((interview) =>
              <div
                key={interview.id}
                className={`p-4 border rounded-lg ${
                interview.status === 'Cancelled' ?
                'bg-red-50 border-red-200' :
                interview.status === 'Completed' ?
                'bg-green-50 border-green-200' :
                'bg-white'}`
                }>

                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{interview.candidateName}</h3>
                            <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                        interview.status === 'Scheduled' ?
                        'bg-blue-100 text-blue-700' :
                        interview.status === 'Completed' ?
                        'bg-green-100 text-green-700' :
                        interview.status === 'Cancelled' ?
                        'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'}`
                        }>

                              {interview.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{interview.position}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {interview.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {interview.time}
                            </span>
                            <span className="flex items-center gap-1">
                              {interview.isOnline ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                              {interview.venue}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {interview.panelMembers.
                        map((id) => panelMembers.find((m) => m.id === id)?.name).
                        filter(Boolean).
                        join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openViewModal(interview)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {interview.status === 'Scheduled' &&
                    <>
                              <Button variant="outline" size="sm" onClick={() => rescheduleInterview(interview)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => markAsCompleted(interview.id)}>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => cancelInterview(interview.id)}>
                                <XCircle className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                    }
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

      {/* View Interview Modal */}
      {showViewModal && selectedInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Interview Details</h2>
              <button
              onClick={() => {
                setShowViewModal(false);
                setSelectedInterview(null);
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-xl font-bold">{selectedInterview.candidateName}</h3>
                <p className="text-gray-600">{selectedInterview.position}</p>
                <span
                className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                selectedInterview.status === 'Scheduled' ?
                'bg-blue-100 text-blue-700' :
                selectedInterview.status === 'Completed' ?
                'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'}`
                }>

                  {selectedInterview.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Date: {selectedInterview.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Time: {selectedInterview.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Duration: {selectedInterview.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedInterview.isOnline ?
                <Video className="w-4 h-4 text-blue-500" /> :

                <MapPin className="w-4 h-4 text-gray-400" />
                }
                  <span>{selectedInterview.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedInterview.candidateEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedInterview.candidatePhone}</span>
                </div>
              </div>

              {selectedInterview.isOnline && selectedInterview.onlineLink &&
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Link className="w-4 h-4 text-blue-600" />
                  <a
                href={selectedInterview.onlineLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm">

                    {selectedInterview.onlineLink}
                  </a>
                  <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(selectedInterview.onlineLink || '');
                  alert('Link copied!');
                }}>

                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
            }

              {selectedInterview.demoTopic &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Demo Topic</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedInterview.demoTopic}</p>
                </div>
            }

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Panel Members</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInterview.panelMembers.map((id) => {
                  const member = panelMembers.find((m) => m.id === id);
                  return member ?
                  <span key={id} className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        {member.name} ({member.role})
                      </span> :
                  null;
                })}
                </div>
              </div>

              {selectedInterview.attachments.length > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {selectedInterview.attachments.map((att) =>
                <div key={att.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{att.name}</span>
                        <span className="text-gray-400">({att.size})</span>
                      </div>
                )}
                  </div>
                </div>
            }

              {selectedInterview.notes &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedInterview.notes}</p>
                </div>
            }
            </div>
            <div className="flex justify-between gap-2 p-4 border-t">
              <div className="flex gap-2">
                {selectedInterview.status === 'Scheduled' &&
              <>
                    <Button variant="outline" onClick={() => rescheduleInterview(selectedInterview)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Reschedule
                    </Button>
                    <Button variant="outline" onClick={() => cancelInterview(selectedInterview.id)}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </>
              }
              </div>
              <Button variant="primary" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit/Reschedule Modal */}
      {showEditModal && editingInterview &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Reschedule Interview</h2>
              <button
              onClick={() => {
                setShowEditModal(false);
                setEditingInterview(null);
                resetForm();
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{editingInterview.candidateName}</p>
                <p className="text-sm text-gray-600">
                  Previous: {editingInterview.date} at {editingInterview.time}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Date *</label>
                  <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Time *</label>
                  <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Rescheduling</label>
                <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Enter reason..." />

              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={form.sendEmail}
                  onChange={(e) => setForm((f) => ({ ...f, sendEmail: e.target.checked }))}
                  className="rounded" />

                  <span className="text-sm">Send Email Notification</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                  type="checkbox"
                  checked={form.sendSMS}
                  onChange={(e) => setForm((f) => ({ ...f, sendSMS: e.target.checked }))}
                  className="rounded" />

                  <span className="text-sm">Send SMS Notification</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingInterview(null);
                resetForm();
              }}>

                Cancel
              </Button>
              <Button variant="primary" onClick={updateInterview}>
                <Calendar className="w-4 h-4 mr-1" />
                Reschedule
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Drafts Modal */}
      {showDraftsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Saved Drafts ({drafts.length})</h2>
              <button onClick={() => setShowDraftsModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {drafts.length === 0 ?
            <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No drafts saved</p>
                </div> :

            <div className="space-y-3">
                  {drafts.map((draft) =>
              <div key={draft.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{draft.candidateName || 'Unknown Candidate'}</h3>
                          <p className="text-sm text-gray-600">
                            {draft.interviewType} - {draft.roundType}
                          </p>
                          <p className="text-xs text-gray-400">
                            {draft.date || 'No date'} {draft.time || ''}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => loadDraft(draft)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Load
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteDraft(draft.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
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

      {/* Conflict Modal */}
      {showConflictModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b bg-yellow-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold">Scheduling Conflicts Detected</h2>
              </div>
              <button onClick={() => setShowConflictModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {conflicts.map((conflict, index) =>
            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">{conflict.message}</p>
                </div>
            )}
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowConflictModal(false)}>
                Go Back & Fix
              </Button>
              <Button
              variant="primary"
              onClick={() => createInterview('Scheduled')}
              className="bg-yellow-600 hover:bg-yellow-700">

                Schedule Anyway
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Candidate Search Modal */}
      {showCandidateModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Select Candidate</h2>
              <button onClick={() => setShowCandidateModal(false)} className="p-1 hover:bg-gray-100 rounded">
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
              <div className="space-y-2">
                {filteredCandidates.map((candidate) =>
              <div
                key={candidate.id}
                onClick={() => {
                  setForm((f) => ({ ...f, candidateId: candidate.id }));
                  setShowCandidateModal(false);
                }}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                form.candidateId === candidate.id ? 'border-purple-500 bg-purple-50' : ''}`
                }>

                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-sm text-gray-600">{candidate.position}</p>
                        <p className="text-xs text-gray-400">{candidate.applicationId}</p>
                      </div>
                      <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                    candidate.status === 'Pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    candidate.status === 'Scheduled' ?
                    'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'}`
                    }>

                        {candidate.status}
                      </span>
                    </div>
                  </div>
              )}
              </div>
            </div>
          </div>
        </div>
      }

      {/* Panel Member Details Modal */}
      {showPanelDetailsModal && selectedPanelMember &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Panel Member Details</h2>
              <button
              onClick={() => {
                setShowPanelDetailsModal(false);
                setSelectedPanelMember(null);
              }}
              className="p-1 hover:bg-gray-100 rounded">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  {selectedPanelMember.name.
                split(' ').
                map((n) => n[0]).
                join('')}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedPanelMember.name}</h3>
                  <p className="text-gray-600">{selectedPanelMember.role}</p>
                  <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedPanelMember.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`
                  }>

                    {selectedPanelMember.available ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{selectedPanelMember.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{selectedPanelMember.phone}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPanelMember.expertise.map((exp, i) =>
                <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {exp}
                    </span>
                )}
                </div>
              </div>
              {selectedPanelMember.scheduledSlots && selectedPanelMember.scheduledSlots.length > 0 &&
            <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Scheduled Slots</h4>
                  <div className="space-y-1">
                    {selectedPanelMember.scheduledSlots.map((slot, i) =>
                <div key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                        {slot.date} at {slot.time} ({slot.duration} mins)
                      </div>
                )}
                  </div>
                </div>
            }
            </div>
            <div className="flex justify-between gap-2 p-4 border-t">
              <Button
              variant="outline"
              onClick={() => {
                if (selectedPanelMember.available) {
                  togglePanel(selectedPanelMember.id);
                }
                setShowPanelDetailsModal(false);
              }}
              disabled={!selectedPanelMember.available}>

                {selectedPanel.includes(selectedPanelMember.id) ? 'Remove from Panel' : 'Add to Panel'}
              </Button>
              <Button variant="primary" onClick={() => setShowPanelDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Notification Preview Modal */}
      {showNotificationPreviewModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Notification Preview</h2>
              <button onClick={() => setShowNotificationPreviewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {form.sendEmail &&
            <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="font-medium">Email Notification</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>
                      <strong>To:</strong> {getSelectedCandidate()?.email}
                    </p>
                    <p>
                      <strong>Subject:</strong> Interview Scheduled - {form.interviewType}
                    </p>
                    <hr className="my-2" />
                    <p>Dear {getSelectedCandidate()?.name},</p>
                    <p className="mt-2">
                      Your {form.interviewType} for the position of {getSelectedCandidate()?.position} has been
                      scheduled.
                    </p>
                    <p className="mt-2">
                      <strong>Date:</strong> {form.date}
                      <br />
                      <strong>Time:</strong> {form.time}
                      <br />
                      <strong>Duration:</strong> {form.duration} minutes
                      <br />
                      <strong>Venue:</strong> {isOnline ? form.onlineLink : form.venue}
                    </p>
                    {form.demoTopic &&
                <p className="mt-2">
                        <strong>Demo Topic:</strong> {form.demoTopic}
                      </p>
                }
                    <p className="mt-3">Best regards,</p>
                    <p>HR Team</p>
                  </div>
                </div>
            }
              {form.sendSMS &&
            <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    <h3 className="font-medium">SMS Notification</h3>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <p>
                      <strong>To:</strong> {getSelectedCandidate()?.phone}
                    </p>
                    <hr className="my-2" />
                    <p>
                      Your {form.interviewType} is scheduled for {form.date} at {form.time}.{' '}
                      {isOnline ? `Join link: ${form.onlineLink}` : `Venue: ${form.venue}`}
                    </p>
                  </div>
                </div>
            }
            </div>
            <div className="flex justify-end p-4 border-t">
              <Button variant="primary" onClick={() => setShowNotificationPreviewModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}