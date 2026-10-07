import React, { useState, useCallback, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import {
  Plus,
  Edit2,
  Calendar,
  Trash2,
  X,
  Save,
  Copy,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Filter,
  Search,
  Eye,
  Lock,
  Unlock,
  Archive,
  Clock,
  FileText,
  Activity,
  AlertTriangle,
  History } from
'lucide-react';

// ==================== TYPES ====================
interface Term {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  holidays: Holiday[];
  examSchedules: ExamSchedule[];
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'school' | 'optional';
}

interface ExamSchedule {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'midterm' | 'final' | 'unit_test' | 'practical';
}

interface AcademicSession {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  status: 'current' | 'past' | 'future' | 'draft';
  terms: Term[];
  isLocked: boolean;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  totalStudents?: number;
  totalClasses?: number;
  totalSubjects?: number;
}

interface Notification {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

// ==================== MOCK DATA ====================
const getAcademicYearRange = (yearLabel: string) => {
  const match = yearLabel.trim().match(/^(\d{4})\s*[-–/]\s*(\d{2}|\d{4})$/);
  if (!match) return null;

  const startYear = Number(match[1]);
  const endLabel = match[2];
  let endYear = endLabel.length === 2
    ? Math.floor(startYear / 100) * 100 + Number(endLabel)
    : Number(endLabel);

  if (endLabel.length === 2 && endYear <= startYear) endYear += 100;
  if (endYear !== startYear + 1) return null;

  return {
    year: `${startYear}-${endYear}`,
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`
  };
};

const generateMockTerms = (
  yearPrefix: string,
  count: number = 2,
  sessionStartDate?: string,
  sessionEndDate?: string,
  includeSampleEvents: boolean = true
): Term[] => {
  const yearRange = getAcademicYearRange(yearPrefix);
  const startDate = sessionStartDate || yearRange?.startDate || '2024-04-01';
  const endDate = sessionEndDate || yearRange?.endDate || '2025-03-31';
  const academicStart = new Date(`${startDate}T00:00:00Z`);
  const academicEnd = new Date(`${endDate}T00:00:00Z`);
  const startMonthIndex = academicStart.getUTCFullYear() * 12 + academicStart.getUTCMonth();
  const totalMonths = academicEnd.getUTCFullYear() * 12 + academicEnd.getUTCMonth() - startMonthIndex + 1;
  const yearStart = Number(yearPrefix.slice(0, 4)) || 2024;
  const yearEnd = yearStart + 1;

  return Array.from({ length: count }, (_, index) => {
    const termStartOffset = Math.floor(totalMonths * index / count);
    const termEndOffset = Math.floor(totalMonths * (index + 1) / count);
    const termStart = new Date(Date.UTC(academicStart.getUTCFullYear(), academicStart.getUTCMonth() + termStartOffset, 1));
    const termEnd = index === count - 1
      ? academicEnd
      : new Date(Date.UTC(academicStart.getUTCFullYear(), academicStart.getUTCMonth() + termEndOffset, 1) - 86400000);
    const isoDate = (date: Date) => date.toISOString().slice(0, 10);
    const sampleHolidays = index === 0 ? [
      { id: `${yearPrefix}-holiday-${index}-1`, name: 'Independence Day', date: `${yearStart}-08-15`, type: 'public' as const },
      { id: `${yearPrefix}-holiday-${index}-2`, name: 'Mid-term Break', date: `${yearStart}-07-15`, type: 'school' as const }
    ] : [
      { id: `${yearPrefix}-holiday-${index}-1`, name: 'Republic Day', date: `${yearEnd}-01-26`, type: 'public' as const },
      { id: `${yearPrefix}-holiday-${index}-2`, name: 'Mid-term Break', date: `${yearEnd}-12-15`, type: 'school' as const }
    ];
    const sampleExams = index === 0 ? [
      { id: `${yearPrefix}-exam-${index}-1`, name: 'Mid-term Examination', startDate: `${yearStart}-07-01`, endDate: `${yearStart}-07-10`, type: 'midterm' as const },
      { id: `${yearPrefix}-exam-${index}-2`, name: 'Final Examination', startDate: `${yearStart}-09-15`, endDate: `${yearStart}-09-25`, type: 'final' as const }
    ] : [
      { id: `${yearPrefix}-exam-${index}-1`, name: 'Mid-term Examination', startDate: `${yearEnd}-11-01`, endDate: `${yearEnd}-11-10`, type: 'midterm' as const },
      { id: `${yearPrefix}-exam-${index}-2`, name: 'Final Examination', startDate: `${yearEnd}-02-15`, endDate: `${yearEnd}-02-25`, type: 'final' as const }
    ];

    return {
      id: `${yearPrefix}-term-${index + 1}`,
      name: `Term ${index + 1}`,
      startDate: isoDate(termStart),
      endDate: isoDate(termEnd),
      isActive: index === 0,
      holidays: includeSampleEvents ? sampleHolidays : [],
      examSchedules: includeSampleEvents ? sampleExams : []
    };
  });
};

const initialSessions: AcademicSession[] = [
{
  id: 'session-1',
  year: '2024-2025',
  startDate: '2024-04-01',
  endDate: '2025-03-31',
  status: 'current',
  terms: generateMockTerms('2024-2025', 2),
  isLocked: false,
  createdAt: '2024-03-15T10:00:00',
  modifiedAt: '2024-03-20T14:30:00',
  createdBy: 'Admin User',
  totalStudents: 1250,
  totalClasses: 45,
  totalSubjects: 28
},
{
  id: 'session-2',
  year: '2023-2024',
  startDate: '2023-04-01',
  endDate: '2024-03-31',
  status: 'past',
  terms: generateMockTerms('2023-2024', 2),
  isLocked: true,
  createdAt: '2023-03-10T10:00:00',
  modifiedAt: '2024-04-01T09:00:00',
  createdBy: 'Admin User',
  totalStudents: 1180,
  totalClasses: 42,
  totalSubjects: 26
},
{
  id: 'session-3',
  year: '2025-2026',
  startDate: '2025-04-01',
  endDate: '2026-03-31',
  status: 'future',
  terms: generateMockTerms('2025-2026', 2),
  isLocked: false,
  createdAt: '2024-03-25T11:00:00',
  modifiedAt: '2024-03-25T11:00:00',
  createdBy: 'Admin User',
  totalStudents: 0,
  totalClasses: 0,
  totalSubjects: 0
},
{
  id: 'session-4',
  year: '2022-2023',
  startDate: '2022-04-01',
  endDate: '2023-03-31',
  status: 'past',
  terms: generateMockTerms('2022-2023', 2),
  isLocked: true,
  createdAt: '2022-03-05T10:00:00',
  modifiedAt: '2023-04-01T09:00:00',
  createdBy: 'Admin User',
  totalStudents: 1100,
  totalClasses: 40,
  totalSubjects: 25
},
{
  id: 'session-5',
  year: '2026-2027',
  startDate: '2026-04-01',
  endDate: '2027-03-31',
  status: 'draft',
  terms: [],
  isLocked: false,
  createdAt: '2024-03-28T15:00:00',
  modifiedAt: '2024-03-28T15:00:00',
  createdBy: 'Admin User',
  totalStudents: 0,
  totalClasses: 0,
  totalSubjects: 0
}];


const isImportedAcademicSession = (value: unknown): value is AcademicSession => {
  if (!value || typeof value !== 'object') return false;
  const session = value as Record<string, unknown>;
  if (
    typeof session.id !== 'string' || typeof session.year !== 'string' ||
    typeof session.startDate !== 'string' || typeof session.endDate !== 'string' ||
    typeof session.createdAt !== 'string' || typeof session.modifiedAt !== 'string' || typeof session.createdBy !== 'string' ||
    !['current', 'past', 'future', 'draft'].includes(String(session.status)) ||
    typeof session.isLocked !== 'boolean' || !Array.isArray(session.terms)
  ) return false;

  return session.terms.every((value) => {
    if (!value || typeof value !== 'object') return false;
    const term = value as Record<string, unknown>;
    if (
      typeof term.id !== 'string' || typeof term.name !== 'string' ||
      typeof term.startDate !== 'string' || typeof term.endDate !== 'string' ||
      typeof term.isActive !== 'boolean' || !Array.isArray(term.holidays) ||
      !Array.isArray(term.examSchedules)
    ) return false;
    const validHoliday = (holiday: unknown) => {
      if (!holiday || typeof holiday !== 'object') return false;
      const item = holiday as Record<string, unknown>;
      return typeof item.id === 'string' && typeof item.name === 'string' &&
        typeof item.date === 'string' && ['public', 'school', 'optional'].includes(String(item.type));
    };
    const validExam = (exam: unknown) => {
      if (!exam || typeof exam !== 'object') return false;
      const item = exam as Record<string, unknown>;
      return typeof item.id === 'string' && typeof item.name === 'string' &&
        typeof item.startDate === 'string' && typeof item.endDate === 'string' &&
        ['midterm', 'final', 'unit_test', 'practical'].includes(String(item.type));
    };
    return term.holidays.every(validHoliday) && term.examSchedules.every(validExam);
  });
};

// ==================== MAIN COMPONENT ====================
export function AcademicSessionTermSetup() {
  // State Management
  const [sessions, setSessions] = useState<AcademicSession[]>(initialSessions);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTermModal, setShowTermModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<AcademicSession | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [duplicateYear, setDuplicateYear] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    year: '',
    startDate: '',
    endDate: '',
    numberOfTerms: '2',
    status: 'draft' as AcademicSession['status']
  });

  const [termFormData, setTermFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  const [holidayFormData, setHolidayFormData] = useState({
    name: '',
    date: '',
    type: 'school' as Holiday['type']
  });

  const [examFormData, setExamFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    type: 'midterm' as ExamSchedule['type']
  });

  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [showAddHolidayForm, setShowAddHolidayForm] = useState(false);
  const [showAddExamForm, setShowAddExamForm] = useState(false);

  // Notification Helper
  const showNotification = useCallback((type: Notification['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Filter and Search
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
      session.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.status.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, searchTerm, statusFilter]);

  // Session Management Functions
  const handleAcademicYearChange = (year: string) => {
    const yearRange = getAcademicYearRange(year);
    setFormData((prev) => ({
      ...prev,
      year,
      startDate: yearRange?.startDate || '',
      endDate: yearRange?.endDate || ''
    }));
  };

  const handleAddSession = () => {
    const yearRange = getAcademicYearRange(formData.year);
    const termCount = Number(formData.numberOfTerms);
    if (!yearRange) {
      showNotification('error', 'Enter a valid academic year, such as 2027-2028');
      return;
    }
    if (!Number.isInteger(termCount) || termCount < 1 || termCount > 12) {
      showNotification('error', 'Enter a number of terms from 1 to 12');
      return;
    }

    // Validate date range
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      showNotification('error', 'End date must be after start date');
      return;
    }

    // Check for overlapping sessions
    const hasOverlap = sessions.some((session) => {
      const existingStart = new Date(session.startDate);
      const existingEnd = new Date(session.endDate);
      const newStart = new Date(formData.startDate);
      const newEnd = new Date(formData.endDate);

      return newStart <= existingEnd && newEnd >= existingStart;
    });

    if (hasOverlap) {
      showNotification('warning', 'Date range overlaps with existing session');
      return;
    }

    const newSession: AcademicSession = {
      id: `session-${Date.now()}`,
      year: yearRange.year,
      startDate: yearRange.startDate,
      endDate: yearRange.endDate,
      status: formData.status,
      terms: generateMockTerms(yearRange.year, termCount, yearRange.startDate, yearRange.endDate, false),
      isLocked: false,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      createdBy: 'Current User',
      totalStudents: 0,
      totalClasses: 0,
      totalSubjects: 0
    };

    setSessions((prev) => [...prev, newSession]);
    setShowAddModal(false);
    resetForm();
    showNotification('success', `Academic year ${yearRange.year} created successfully`);
  };

  const handleEditSession = () => {
    if (!selectedSession || !formData.year.trim() || !formData.startDate || !formData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot edit locked session');
      return;
    }

    const yearRange = getAcademicYearRange(formData.year);
    if (!yearRange) {
      showNotification('error', 'Enter a valid academic year, such as 2027-2028');
      return;
    }
    if (sessions.some((session) => session.id !== selectedSession.id && getAcademicYearRange(session.year)?.year === yearRange.year)) {
      showNotification('warning', `Academic year ${yearRange.year} already exists`);
      return;
    }

    const start = new Date(`${formData.startDate}T00:00:00`);
    const end = new Date(`${formData.endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      showNotification('error', 'End date must be after start date');
      return;
    }
    if (selectedSession.terms.some((term) => term.startDate < formData.startDate || term.endDate > formData.endDate)) {
      showNotification('error', 'The session dates must contain all existing terms. Update term dates first.');
      return;
    }

    const hasOverlap = sessions.some((session) => {
      if (session.id === selectedSession.id) return false;
      const existingStart = new Date(`${session.startDate}T00:00:00`);
      const existingEnd = new Date(`${session.endDate}T00:00:00`);
      return start <= existingEnd && end >= existingStart;
    });
    if (hasOverlap) {
      showNotification('warning', 'Date range overlaps with another academic session');
      return;
    }

    const modifiedAt = new Date().toISOString();
    setSessions((prev) => prev.map((session) => {
      if (session.id === selectedSession.id) {
        return {
          ...session,
          year: yearRange.year,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          modifiedAt
        };
      }
      if (formData.status === 'current' && session.status === 'current') {
        return { ...session, status: 'past', modifiedAt };
      }
      return session;
    }));

    setShowEditModal(false);
    setSelectedSession(null);
    resetForm();
    showNotification('success', 'Academic year updated successfully');
  };

  const handleDeleteSession = () => {
    if (!selectedSession) return;

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot delete locked session');
      return;
    }

    if (selectedSession.status === 'current') {
      showNotification('error', 'Cannot delete current academic year');
      return;
    }

    setSessions((prev) => prev.filter((session) => session.id !== selectedSession.id));
    setShowDeleteConfirm(false);
    setSelectedSession(null);
    showNotification('success', 'Academic year deleted successfully');
  };

  const handleDuplicateSession = () => {
    if (!selectedSession) return;
    const yearRange = getAcademicYearRange(duplicateYear);
    if (!yearRange) {
      showNotification('error', 'Enter a valid academic year, such as 2027-2028');
      return;
    }
    if (sessions.some((session) => session.year === yearRange.year)) {
      showNotification('warning', `Academic year ${yearRange.year} already exists`);
      return;
    }

    const newStart = new Date(`${yearRange.startDate}T00:00:00`);
    const newEnd = new Date(`${yearRange.endDate}T00:00:00`);
    const overlaps = sessions.some((session) => newStart <= new Date(`${session.endDate}T00:00:00`) && newEnd >= new Date(`${session.startDate}T00:00:00`));
    if (overlaps) {
      showNotification('warning', 'The selected year overlaps with an existing academic session');
      return;
    }

    const sourceStartYear = Number(selectedSession.startDate.slice(0, 4));
    const yearOffset = Number(yearRange.startDate.slice(0, 4)) - sourceStartYear;
    const shiftDate = (value: string) => {
      const date = new Date(`${value}T00:00:00`);
      date.setFullYear(date.getFullYear() + yearOffset);
      return date.toISOString().slice(0, 10);
    };
    const now = new Date().toISOString();
    const duplicatedSession: AcademicSession = {
      ...selectedSession,
      id: `session-${Date.now()}`,
      year: yearRange.year,
      startDate: yearRange.startDate,
      endDate: yearRange.endDate,
      status: 'draft',
      isLocked: false,
      createdAt: now,
      modifiedAt: now,
      createdBy: 'Current User',
      totalStudents: 0,
      totalClasses: 0,
      totalSubjects: 0,
      terms: selectedSession.terms.map((term, index) => ({
        ...term,
        id: `${yearRange.year}-term-${index + 1}`,
        startDate: shiftDate(term.startDate),
        endDate: shiftDate(term.endDate),
        isActive: index === 0,
        holidays: term.holidays.map((holiday, holidayIndex) => ({
          ...holiday,
          id: `${yearRange.year}-term-${index + 1}-holiday-${holidayIndex + 1}`,
          date: shiftDate(holiday.date)
        })),
        examSchedules: term.examSchedules.map((exam, examIndex) => ({
          ...exam,
          id: `${yearRange.year}-term-${index + 1}-exam-${examIndex + 1}`,
          startDate: shiftDate(exam.startDate),
          endDate: shiftDate(exam.endDate)
        }))
      }))
    };

    setSessions((prev) => [...prev, duplicatedSession]);
    setShowDuplicateModal(false);
    setSelectedSession(null);
    setDuplicateYear('');
    showNotification('success', `Academic year duplicated as ${yearRange.year}`);
  };

  const handleToggleLock = (session: AcademicSession) => {
    if (session.status === 'current') {
      showNotification('warning', 'Cannot lock/unlock current academic year');
      return;
    }

    setSessions((prev) => prev.map((s) =>
    s.id === session.id ?
    { ...s, isLocked: !s.isLocked, modifiedAt: new Date().toISOString() } :
    s
    ));

    showNotification('info', `Academic year ${session.isLocked ? 'unlocked' : 'locked'}`);
  };

  const handleSetAsCurrent = (session: AcademicSession) => {
    if (session.isLocked) {
      showNotification('error', 'Unlock the academic year before setting it as current');
      return;
    }

    if (session.status === 'past') {
      showNotification('error', 'Cannot set past academic year as current');
      return;
    }

    if (session.status === 'draft') {
      showNotification('error', 'Cannot set draft academic year as current. Please activate it first.');
      return;
    }

    setSessions((prev) => prev.map((s) => ({
      ...s,
      status: s.id === session.id ? 'current' as const :
      s.status === 'current' ? 'past' as const :
      s.status,
      modifiedAt: new Date().toISOString()
    })));

    showNotification('success', `${session.year} set as current academic year`);
  };

  const handleArchiveSession = (session: AcademicSession) => {
    if (session.status === 'current') {
      showNotification('error', 'Cannot archive current academic year');
      return;
    }

    setSessions((prev) => prev.map((s) =>
    s.id === session.id ?
    { ...s, status: 'past' as const, isLocked: true, modifiedAt: new Date().toISOString() } :
    s
    ));

    showNotification('success', 'Academic year archived successfully');
  };

  // Term Management Functions
  const handleAddTerm = () => {
    if (!selectedSession || !termFormData.name.trim() || !termFormData.startDate || !termFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    const start = new Date(`${termFormData.startDate}T00:00:00`);
    const end = new Date(`${termFormData.endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      showNotification('error', 'End date must be after start date');
      return;
    }
    if (termFormData.startDate < selectedSession.startDate || termFormData.endDate > selectedSession.endDate) {
      showNotification('error', 'Term dates must fall within the academic session');
      return;
    }
    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot add term to locked session');
      return;
    }
    if (selectedSession.terms.some((term) => termFormData.startDate <= term.endDate && termFormData.endDate >= term.startDate)) {
      showNotification('error', 'Term dates cannot overlap another term');
      return;
    }

    const newTerm: Term = {
      id: `${selectedSession.id}-term-${Date.now()}`,
      name: termFormData.name.trim(),
      startDate: termFormData.startDate,
      endDate: termFormData.endDate,
      isActive: termFormData.isActive,
      holidays: [],
      examSchedules: []
    };
    const modifiedAt = new Date().toISOString();

    const appendTerm = (terms: Term[]) => [
      ...(newTerm.isActive ? terms.map((term) => ({ ...term, isActive: false })) : terms),
      newTerm
    ];
    setSessions((prev) => prev.map((session) => session.id === selectedSession.id
      ? { ...session, terms: appendTerm(session.terms), modifiedAt }
      : session));
    setSelectedSession((prev) => prev?.id === selectedSession.id
      ? { ...prev, terms: appendTerm(prev.terms), modifiedAt }
      : prev);
    resetTermForm();
    showNotification('success', 'Term added successfully');
  };

  const handleEditTerm = () => {
    if (!selectedSession || !selectedTerm || !termFormData.name.trim() || !termFormData.startDate || !termFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    const start = new Date(`${termFormData.startDate}T00:00:00`);
    const end = new Date(`${termFormData.endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
      showNotification('error', 'End date must be after start date');
      return;
    }
    if (termFormData.startDate < selectedSession.startDate || termFormData.endDate > selectedSession.endDate) {
      showNotification('error', 'Term dates must fall within the academic session');
      return;
    }
    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot edit term in locked session');
      return;
    }
    if (selectedSession.terms.some((term) => term.id !== selectedTerm.id && termFormData.startDate <= term.endDate && termFormData.endDate >= term.startDate)) {
      showNotification('error', 'Term dates cannot overlap another term');
      return;
    }

    const updatedTerm: Term = {
      ...selectedTerm,
      name: termFormData.name.trim(),
      startDate: termFormData.startDate,
      endDate: termFormData.endDate,
      isActive: termFormData.isActive
    };
    const modifiedAt = new Date().toISOString();
    const updateTerms = (terms: Term[]) => terms.map((term) => {
      if (term.id === updatedTerm.id) return updatedTerm;
      return updatedTerm.isActive ? { ...term, isActive: false } : term;
    });
    setSessions((prev) => prev.map((session) => session.id === selectedSession.id
      ? { ...session, terms: updateTerms(session.terms), modifiedAt }
      : session));
    setSelectedSession((prev) => prev?.id === selectedSession.id
      ? { ...prev, terms: updateTerms(prev.terms), modifiedAt }
      : prev);
    setSelectedTerm(updatedTerm);
    showNotification('success', 'Term updated successfully');
  };

  const handleDeleteTerm = (session: AcademicSession, term: Term) => {
    if (session.isLocked) {
      showNotification('error', 'Cannot delete term from locked session');
      return;
    }
    if (session.terms.length <= 1) {
      showNotification('error', 'Cannot delete the last term');
      return;
    }

    const modifiedAt = new Date().toISOString();
    setSessions((prev) => prev.map((item) => item.id === session.id
      ? { ...item, terms: item.terms.filter((existing) => existing.id !== term.id), modifiedAt }
      : item));
    setSelectedSession((prev) => prev?.id === session.id
      ? { ...prev, terms: prev.terms.filter((existing) => existing.id !== term.id), modifiedAt }
      : prev);
    setSelectedTerm((prev) => prev?.id === term.id ? null : prev);
    setShowAddHolidayForm(false);
    setShowAddExamForm(false);
    resetTermForm();
    showNotification('success', 'Term deleted successfully');
  };

  const handleToggleTermActive = (session: AcademicSession, term: Term) => {
    if (session.isLocked) {
      showNotification('error', 'Cannot modify term in locked session');
      return;
    }

    const nextActive = !term.isActive;
    const toggleTerms = (terms: Term[]) => terms.map((item) => ({
      ...item,
      isActive: item.id === term.id ? nextActive : nextActive ? false : item.isActive
    }));
    const modifiedAt = new Date().toISOString();
    setSessions((prev) => prev.map((item) => item.id === session.id
      ? { ...item, terms: toggleTerms(item.terms), modifiedAt }
      : item));
    setSelectedSession((prev) => prev?.id === session.id
      ? { ...prev, terms: toggleTerms(prev.terms), modifiedAt }
      : prev);
    showNotification('info', `Term ${nextActive ? 'activated' : 'deactivated'}`);
  };

  // Holiday Management Functions
  const handleAddHoliday = () => {
    if (!selectedSession || !selectedTerm || !holidayFormData.name.trim() || !holidayFormData.date) {
      showNotification('error', 'Please fill all required fields');
      return;
    }
    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot add a holiday to a locked session');
      return;
    }
    if (holidayFormData.date < selectedTerm.startDate || holidayFormData.date > selectedTerm.endDate) {
      showNotification('error', 'Holiday date must fall within the selected term');
      return;
    }

    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      name: holidayFormData.name.trim(),
      date: holidayFormData.date,
      type: holidayFormData.type
    };
    const modifiedAt = new Date().toISOString();
    const updateTerm = (term: Term) => term.id === selectedTerm.id
      ? { ...term, holidays: [...term.holidays, newHoliday] }
      : term;

    setSessions((prev) => prev.map((session) => session.id === selectedSession.id
      ? { ...session, terms: session.terms.map(updateTerm), modifiedAt }
      : session));
    setSelectedSession((prev) => prev?.id === selectedSession.id
      ? { ...prev, terms: prev.terms.map(updateTerm), modifiedAt }
      : prev);
    setSelectedTerm((prev) => prev?.id === selectedTerm.id
      ? { ...prev, holidays: [...prev.holidays, newHoliday] }
      : prev);
    resetHolidayForm();
    setShowAddHolidayForm(false);
    showNotification('success', 'Holiday added successfully');
  };

  const handleDeleteHoliday = (session: AcademicSession, term: Term, holidayId: string) => {
    if (session.isLocked) {
      showNotification('error', 'Cannot delete a holiday from a locked session');
      return;
    }
    const modifiedAt = new Date().toISOString();
    const updateTerm = (item: Term) => item.id === term.id
      ? { ...item, holidays: item.holidays.filter((holiday) => holiday.id !== holidayId) }
      : item;

    setSessions((prev) => prev.map((item) => item.id === session.id
      ? { ...item, terms: item.terms.map(updateTerm), modifiedAt }
      : item));
    setSelectedSession((prev) => prev?.id === session.id
      ? { ...prev, terms: prev.terms.map(updateTerm), modifiedAt }
      : prev);
    setSelectedTerm((prev) => prev?.id === term.id
      ? { ...prev, holidays: prev.holidays.filter((holiday) => holiday.id !== holidayId) }
      : prev);
    showNotification('success', 'Holiday deleted successfully');
  };

  // Exam Schedule Management Functions
  const handleAddExam = () => {
    if (!selectedSession || !selectedTerm || !examFormData.name.trim() || !examFormData.startDate || !examFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }
    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot add an exam to a locked session');
      return;
    }

    const start = new Date(`${examFormData.startDate}T00:00:00`);
    const end = new Date(`${examFormData.endDate}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
      showNotification('error', 'Exam end date cannot be before its start date');
      return;
    }
    if (examFormData.startDate < selectedTerm.startDate || examFormData.endDate > selectedTerm.endDate) {
      showNotification('error', 'Exam dates must fall within the selected term');
      return;
    }

    const newExam: ExamSchedule = {
      id: `exam-${Date.now()}`,
      name: examFormData.name.trim(),
      startDate: examFormData.startDate,
      endDate: examFormData.endDate,
      type: examFormData.type
    };
    const modifiedAt = new Date().toISOString();
    const updateTerm = (term: Term) => term.id === selectedTerm.id
      ? { ...term, examSchedules: [...term.examSchedules, newExam] }
      : term;

    setSessions((prev) => prev.map((session) => session.id === selectedSession.id
      ? { ...session, terms: session.terms.map(updateTerm), modifiedAt }
      : session));
    setSelectedSession((prev) => prev?.id === selectedSession.id
      ? { ...prev, terms: prev.terms.map(updateTerm), modifiedAt }
      : prev);
    setSelectedTerm((prev) => prev?.id === selectedTerm.id
      ? { ...prev, examSchedules: [...prev.examSchedules, newExam] }
      : prev);
    resetExamForm();
    setShowAddExamForm(false);
    showNotification('success', 'Exam schedule added successfully');
  };

  const handleDeleteExam = (session: AcademicSession, term: Term, examId: string) => {
    if (session.isLocked) {
      showNotification('error', 'Cannot delete an exam from a locked session');
      return;
    }
    const modifiedAt = new Date().toISOString();
    const updateTerm = (item: Term) => item.id === term.id
      ? { ...item, examSchedules: item.examSchedules.filter((exam) => exam.id !== examId) }
      : item;

    setSessions((prev) => prev.map((item) => item.id === session.id
      ? { ...item, terms: item.terms.map(updateTerm), modifiedAt }
      : item));
    setSelectedSession((prev) => prev?.id === session.id
      ? { ...prev, terms: prev.terms.map(updateTerm), modifiedAt }
      : prev);
    setSelectedTerm((prev) => prev?.id === term.id
      ? { ...prev, examSchedules: prev.examSchedules.filter((exam) => exam.id !== examId) }
      : prev);
    showNotification('success', 'Exam schedule deleted successfully');
  };

  // Import/Export Functions
  const handleExportAll = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-academic-sessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('success', 'All sessions exported successfully');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const importedData: unknown = JSON.parse(String(loadEvent.target?.result || ''));
        if (!Array.isArray(importedData) || !importedData.every(isImportedAcademicSession)) {
          showNotification('error', 'Invalid file format. Upload an exported academic sessions JSON file.');
          return;
        }
        const newSessions = importedData.filter((session) => !sessions.some((existing) =>
          existing.id === session.id || existing.year === session.year
        ));
        if (!newSessions.length) {
          showNotification('warning', 'No new sessions to import. Existing academic years were skipped.');
          return;
        }
        setSessions((prev) => [...prev, ...newSessions]);
        showNotification('success', `${newSessions.length} session(s) imported; existing academic years were skipped.`);
        setShowImportModal(false);
      } catch {
        showNotification('error', 'Failed to parse the selected JSON file');
      }
    };
    reader.onerror = () => showNotification('error', 'Unable to read the selected file');
    reader.readAsText(file);
  };

  // UI Helper Functions
  const toggleRowExpansion = (sessionId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  // Form Reset Functions
  const resetForm = () => {
    setFormData({
      year: '',
      startDate: '',
      endDate: '',
      numberOfTerms: '2',
      status: 'draft'
    });
  };

  const resetTermForm = () => {
    setTermFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    });
  };

  const resetHolidayForm = () => {
    setHolidayFormData({
      name: '',
      date: '',
      type: 'school'
    });
  };

  const resetExamForm = () => {
    setExamFormData({
      name: '',
      startDate: '',
      endDate: '',
      type: 'midterm'
    });
  };

  // Open Modal Functions
  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (session: AcademicSession) => {
    setSelectedSession(session);
    setFormData({
      year: session.year,
      startDate: session.startDate,
      endDate: session.endDate,
      numberOfTerms: session.terms.length.toString(),
      status: session.status
    });
    setShowEditModal(true);
  };

  const openTermModal = (session: AcademicSession) => {
    setSelectedSession(session);
    setShowTermModal(true);
    setSelectedTerm(null);
    setShowAddHolidayForm(false);
    setShowAddExamForm(false);
    resetTermForm();
    resetHolidayForm();
    resetExamForm();
  };

  const openDeleteConfirm = (session: AcademicSession) => {
    setSelectedSession(session);
    setShowDeleteConfirm(true);
  };

  const openDuplicateModal = (session: AcademicSession) => {
    setSelectedSession(session);
    const yearRange = getAcademicYearRange(session.year);
    const nextStart = yearRange ? Number(yearRange.year.slice(5)) : Number(session.year.slice(0, 4)) + 1;
    setDuplicateYear(`${nextStart}-${nextStart + 1}`);
    setShowDuplicateModal(true);
  };

  const openEditTermForm = (term: Term) => {
    setSelectedTerm(term);
    setTermFormData({
      name: term.name,
      startDate: term.startDate,
      endDate: term.endDate,
      isActive: term.isActive
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: AcademicSession['status']): 'success' | 'secondary' | 'info' | 'default' => {
    const variants = {
      current: 'success' as const,
      past: 'secondary' as const,
      future: 'info' as const,
      draft: 'default' as const
    };
    return variants[status];
  };

  // Table Columns
  const columns = [
  {
    key: 'expand',
    header: '',
    render: (row: AcademicSession) =>
    <button
      onClick={() => toggleRowExpansion(row.id)}
      className="p-1 hover:bg-gray-100 rounded">

          {expandedRows.has(row.id) ?
      <ChevronDown className="w-4 h-4" /> :

      <ChevronRight className="w-4 h-4" />
      }
        </button>

  },
  {
    key: 'year',
    header: 'Academic Year',
    render: (row: AcademicSession) =>
    <div>
          <div className="font-medium">{row.year}</div>
          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            {row.isLocked && <Lock className="w-3 h-3" />}
            {row.terms.length} Terms
          </div>
        </div>

  },
  {
    key: 'start',
    header: 'Start Date',
    render: (row: AcademicSession) => formatDate(row.startDate)
  },
  {
    key: 'end',
    header: 'End Date',
    render: (row: AcademicSession) => formatDate(row.endDate)
  },
  {
    key: 'terms',
    header: 'No. of Terms',
    render: (row: AcademicSession) =>
    <div className="text-center">
          <div className="font-medium">{row.terms.length}</div>
          <div className="text-xs text-gray-500">
            {row.terms.filter((t) => t.isActive).length} active
          </div>
        </div>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: AcademicSession) =>
    <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(row.status)}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Badge>
          {row.isLocked &&
      <Lock className="w-3 h-3 text-gray-400" title="Locked" />
      }
        </div>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: AcademicSession) =>
    <div className="flex gap-1">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openEditModal(row)}
        disabled={row.isLocked}
        title="Edit">

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openTermModal(row)}
        title="Manage Terms">

            <Calendar className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleToggleLock(row)}
        title={row.isLocked ? 'Unlock' : 'Lock'}>

            {row.isLocked ?
        <Unlock className="w-4 h-4" /> :

        <Lock className="w-4 h-4" />
        }
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openDuplicateModal(row)}
        title="Duplicate">

            <Copy className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => openDeleteConfirm(row)}
        disabled={row.isLocked || row.status === 'current'}
        title="Delete">

            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

  }];


  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification &&
      <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 min-w-[300px] ${
      notification.type === 'success' ? 'bg-green-100 text-green-800' :
      notification.type === 'error' ? 'bg-red-100 text-red-800' :
      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
      'bg-blue-100 text-blue-800'}`
      }>
          {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
          {notification.type === 'error' && <AlertCircle className="w-5 h-5" />}
          {notification.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
          {notification.type === 'info' && <Info className="w-5 h-5" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Sessions & Terms
          </h1>
          <p className="text-sm text-gray-500">
            Configure academic years and term durations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            title="View History">

            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="outline"
            onClick={handleExportAll}>

            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImportModal(true)}>

            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={openAddModal}>
            <Plus className="w-4 h-4 mr-2" />
            New Academic Year
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search academic years..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" />

            </div>
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
            { value: 'all', label: 'All Status' },
            { value: 'current', label: 'Current' },
            { value: 'future', label: 'Future' },
            { value: 'past', label: 'Past' },
            { value: 'draft', label: 'Draft' }]
            }
            className="w-40" />

          {searchTerm &&
          <Button
            variant="outline"
            onClick={() => setSearchTerm('')}
            size="sm">

              Clear
            </Button>
          }
        </div>
      </Card>

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredSessions}
          expandedContent={(row: AcademicSession) => expandedRows.has(row.id) ?
          <div className="p-4 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,0.65fr)_minmax(0,1fr)]">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-500 mb-2">Session Info</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(row.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Modified:</span>
                      <span className="font-medium">{formatDate(row.modifiedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created By:</span>
                      <span className="font-medium">{row.createdBy}</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-500 mb-2">Statistics</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Classes:</span>
                      <span className="font-medium">{row.totalClasses || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subjects:</span>
                      <span className="font-medium">{row.totalSubjects || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-500 mb-2">Quick Actions</div>
                  <div className="space-y-2">
                    {row.status !== 'current' &&
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleSetAsCurrent(row)}
                    disabled={row.status === 'draft' || row.status === 'past' || row.isLocked}>

                        <Activity className="w-4 h-4 mr-2" />
                        Set as Current
                      </Button>
                  }
                    {row.status !== 'past' &&
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleArchiveSession(row)}
                    disabled={row.status === 'current'}>

                        <Archive className="w-4 h-4 mr-2" />
                        Archive Session
                      </Button>
                  }
                    <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => openDuplicateModal(row)}>

                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate Session
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Terms ({row.terms.length})</h4>
                  {!row.isLocked &&
                <Button
                  size="sm"
                  onClick={() => openTermModal(row)}>

                      <Plus className="w-4 h-4 mr-1" />
                      Add Term
                    </Button>
                }
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {row.terms.map((term) =>
                <div key={term.id} className="border rounded p-3 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {term.name}
                            {term.isActive &&
                        <Badge variant="success" className="text-xs">Active</Badge>
                        }
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(term.startDate)} - {formatDate(term.endDate)}
                          </div>
                        </div>
                        {!row.isLocked &&
                    <div className="flex gap-1">
                            <button
                        onClick={() => {
                          openTermModal(row);
                          openEditTermForm(term);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit Term">

                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                        onClick={() => handleToggleTermActive(row, term)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={term.isActive ? 'Deactivate' : 'Activate'}>

                              {term.isActive ?
                        <Eye className="w-3 h-3" /> :

                        <Eye className="w-3 h-3 text-gray-400" />
                        }
                            </button>
                            <button
                        onClick={() => handleDeleteTerm(row, term)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete Term">

                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                    }
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {term.holidays.length} Holiday(s)
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {term.examSchedules.length} Exam Schedule(s)
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            </div> :
          null} />

        {filteredSessions.length === 0 &&
        <div className="text-center py-8 text-gray-500">
            No academic sessions found
          </div>
        }
      </Card>

      {/* Add Session Modal */}
      {showAddModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Add New Academic Year</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Academic Year *
                </label>
                <Input
                placeholder="e.g., 2027-2028"
                value={formData.year}
                onChange={(e) => handleAcademicYearChange(e.target.value)} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date *
                  </label>
                  <Input
                  type="date"
                  value={formData.startDate}
                  readOnly
                  />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date *
                  </label>
                  <Input
                  type="date"
                  value={formData.endDate}
                  readOnly
                  />

                </div>
              </div>
              <p className="-mt-2 text-xs text-gray-500">
                Dates are generated automatically from April 1 through March 31 for the selected academic year.
              </p>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Terms
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  step="1"
                  placeholder="Enter number of terms"
                  value={formData.numberOfTerms}
                  onChange={(e) => setFormData({ ...formData, numberOfTerms: e.target.value })}
                />
                <p className="mt-1 text-xs text-gray-500">Choose between 1 and 12 terms.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                options={[
                { value: 'draft', label: 'Draft' },
                { value: 'future', label: 'Future' }]
                } />

              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSession}>
                <Save className="w-4 h-4 mr-2" />
                Create Academic Year
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Session Modal */}
      {showEditModal && selectedSession &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Edit Academic Year</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Academic Year *
                </label>
                <Input
                placeholder="e.g., 2024-2025"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })} />

              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date *
                  </label>
                  <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />

                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date *
                  </label>
                  <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />

                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Status
                </label>
                <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                options={[
                { value: 'draft', label: 'Draft' },
                { value: 'future', label: 'Future' },
                { value: 'current', label: 'Current' },
                { value: 'past', label: 'Past' }]
                } />

              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSession}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Term Management Modal */}
      {showTermModal && selectedSession &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Manage Terms - {selectedSession.year}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedSession.terms.length} term(s)</p>
              </div>
              <button onClick={() => {
              setShowTermModal(false);
              setShowAddHolidayForm(false);
              setShowAddExamForm(false);
              setSelectedTerm(null);
              setSelectedSession(null);
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Add/Edit Term Form */}
              {!selectedSession.isLocked &&
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-3">
                    {selectedTerm ? 'Edit Term' : 'Add New Term'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Term Name *</label>
                      <Input
                    placeholder="e.g., First Term"
                    value={termFormData.name}
                    onChange={(e) => setTermFormData({ ...termFormData, name: e.target.value })} />

                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                      type="checkbox"
                      checked={termFormData.isActive}
                      onChange={(e) => setTermFormData({ ...termFormData, isActive: e.target.checked })}
                      className="rounded" />

                        <span className="text-sm">Active Term</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Date *</label>
                      <Input
                    type="date"
                    value={termFormData.startDate}
                    onChange={(e) => setTermFormData({ ...termFormData, startDate: e.target.value })} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Date *</label>
                      <Input
                    type="date"
                    value={termFormData.endDate}
                    onChange={(e) => setTermFormData({ ...termFormData, endDate: e.target.value })} />

                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={selectedTerm ? handleEditTerm : handleAddTerm}>
                      {selectedTerm ? 'Update Term' : 'Add Term'}
                    </Button>
                    {selectedTerm &&
                <Button variant="outline" onClick={() => {
                  setSelectedTerm(null);
                  resetTermForm();
                }}>
                        Cancel Edit
                      </Button>
                }
                  </div>
                </div>
            }

              {/* Terms List */}
              <div className="space-y-4">
                {selectedSession.terms.map((term) =>
              <div key={term.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{term.name}</h4>
                          {term.isActive && <Badge variant="success">Active</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(term.startDate)} - {formatDate(term.endDate)}
                        </p>
                      </div>
                      {!selectedSession.isLocked &&
                  <div className="flex gap-2">
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditTermForm(term)}>

                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTerm(selectedSession, term)}>

                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                  }
                    </div>

                    {/* Holidays Section */}
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium">Holidays ({term.holidays.length})</h5>
                        {!selectedSession.isLocked &&
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setSelectedTerm(term);
                        setShowAddHolidayForm(true);
                        resetHolidayForm();
                      }}>

                            <Plus className="w-3 h-3 mr-1" />
                            Add Holiday
                          </Button>
                    }
                      </div>
                      {showAddHolidayForm && selectedTerm?.id === term.id &&
                  <div className="mb-2 p-3 bg-gray-50 rounded space-y-2">
                          <Input
                      placeholder="Holiday Name"
                      value={holidayFormData.name}
                      onChange={(e) => setHolidayFormData({ ...holidayFormData, name: e.target.value })}
                      size="sm" />

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                        type="date"
                        value={holidayFormData.date}
                        onChange={(e) => setHolidayFormData({ ...holidayFormData, date: e.target.value })}
                        size="sm" />

                            <Select
                        value={holidayFormData.type}
                        onChange={(e) => setHolidayFormData({ ...holidayFormData, type: e.target.value as any })}
                        options={[
                        { value: 'public', label: 'Public Holiday' },
                        { value: 'school', label: 'School Holiday' },
                        { value: 'optional', label: 'Optional Holiday' }]
                        } />

                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddHoliday}>Add</Button>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddHolidayForm(false);
                          setSelectedTerm(null);
                        }}>

                              Cancel
                            </Button>
                          </div>
                        </div>
                  }
                      <div className="space-y-1">
                        {term.holidays.map((holiday) =>
                    <div key={holiday.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{holiday.name}</span>
                              <span className="text-gray-500 ml-2">{formatDate(holiday.date)}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {holiday.type}
                              </Badge>
                            </div>
                            {!selectedSession.isLocked &&
                      <button
                        onClick={() => handleDeleteHoliday(selectedSession, term, holiday.id)}
                        className="text-red-600 hover:text-red-800">

                                <Trash2 className="w-3 h-3" />
                              </button>
                      }
                          </div>
                    )}
                        {term.holidays.length === 0 &&
                    <p className="text-sm text-gray-500 text-center py-2">No holidays added</p>
                    }
                      </div>
                    </div>

                    {/* Exam Schedules Section */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-medium">Exam Schedules ({term.examSchedules.length})</h5>
                        {!selectedSession.isLocked &&
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setSelectedTerm(term);
                        setShowAddExamForm(true);
                        resetExamForm();
                      }}>

                            <Plus className="w-3 h-3 mr-1" />
                            Add Exam
                          </Button>
                    }
                      </div>
                      {showAddExamForm && selectedTerm?.id === term.id &&
                  <div className="mb-2 p-3 bg-gray-50 rounded space-y-2">
                          <Input
                      placeholder="Exam Name"
                      value={examFormData.name}
                      onChange={(e) => setExamFormData({ ...examFormData, name: e.target.value })}
                      size="sm" />

                          <div className="grid grid-cols-3 gap-2">
                            <Input
                        type="date"
                        placeholder="Start Date"
                        value={examFormData.startDate}
                        onChange={(e) => setExamFormData({ ...examFormData, startDate: e.target.value })}
                        size="sm" />

                            <Input
                        type="date"
                        placeholder="End Date"
                        value={examFormData.endDate}
                        onChange={(e) => setExamFormData({ ...examFormData, endDate: e.target.value })}
                        size="sm" />

                            <Select
                        value={examFormData.type}
                        onChange={(e) => setExamFormData({ ...examFormData, type: e.target.value as any })}
                        options={[
                        { value: 'midterm', label: 'Mid-term' },
                        { value: 'final', label: 'Final' },
                        { value: 'unit_test', label: 'Unit Test' },
                        { value: 'practical', label: 'Practical' }]
                        } />

                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleAddExam}>Add</Button>
                            <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowAddExamForm(false);
                          setSelectedTerm(null);
                        }}>

                              Cancel
                            </Button>
                          </div>
                        </div>
                  }
                      <div className="space-y-1">
                        {term.examSchedules.map((exam) =>
                    <div key={exam.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{exam.name}</span>
                              <span className="text-gray-500 ml-2">
                                {formatDate(exam.startDate)} - {formatDate(exam.endDate)}
                              </span>
                              <Badge variant="info" className="ml-2 text-xs">
                                {exam.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            {!selectedSession.isLocked &&
                      <button
                        onClick={() => handleDeleteExam(selectedSession, term, exam.id)}
                        className="text-red-600 hover:text-red-800">

                                <Trash2 className="w-3 h-3" />
                              </button>
                      }
                          </div>
                    )}
                        {term.examSchedules.length === 0 &&
                    <p className="text-sm text-gray-500 text-center py-2">No exam schedules added</p>
                    }
                      </div>
                    </div>
                  </div>
              )}
                {selectedSession.terms.length === 0 &&
              <p className="text-center text-gray-500 py-8">No terms added yet</p>
              }
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => {
              setShowTermModal(false);
              setShowAddHolidayForm(false);
              setShowAddExamForm(false);
              setSelectedSession(null);
              setSelectedTerm(null);
            }}>
                Done
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSession &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Delete Academic Year</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete academic year <strong>{selectedSession.year}</strong>?
                This will remove all associated terms, holidays, and exam schedules.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                setShowDeleteConfirm(false);
                setSelectedSession(null);
              }}>
                  Cancel
                </Button>
                <Button
                onClick={handleDeleteSession}
                className="bg-red-600 hover:bg-red-700">

                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Duplicate Modal */}
      {showDuplicateModal && selectedSession &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Duplicate Academic Year</h3>
              <button onClick={() => {
              setShowDuplicateModal(false);
              setSelectedSession(null);
              setDuplicateYear('');
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Create a new draft based on <strong>{selectedSession.year}</strong>, including its terms, holidays, and exam schedules.
              </p>
              <Input
                label="New Academic Year *"
                placeholder="e.g., 2027-2028"
                value={duplicateYear}
                onChange={(event) => setDuplicateYear(event.target.value)}
              />
              <p className="mt-2 text-xs text-gray-500">The copied dates shift to the new academic year. You can edit the session after creating it.</p>
            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
              setShowDuplicateModal(false);
              setSelectedSession(null);
              setDuplicateYear('');
            }}>
                Cancel
              </Button>
              <Button onClick={handleDuplicateSession}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Import Modal */}
      {showImportModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Import Academic Sessions</h3>
              <button onClick={() => setShowImportModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Upload a JSON file containing academic session data.
              </p>
              <Input
              type="file"
              accept=".json"
              onChange={handleImport} />

            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Activity History</h3>
              <button onClick={() => setShowHistoryModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {sessions.slice().sort((a, b) =>
              new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime()
              ).slice(0, 10).map((session) =>
              <div key={session.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{session.year}</div>
                      <div className="text-sm text-gray-500">
                        Last modified: {formatDate(session.modifiedAt)} by {session.createdBy}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
              )}
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      }
    </div>);

}