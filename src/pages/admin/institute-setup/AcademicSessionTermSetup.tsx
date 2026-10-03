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
  Users,
  BookOpen,
  FileText,
  Settings,
  BarChart,
  TrendingUp,
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
const generateMockTerms = (yearPrefix: string, count: number = 2): Term[] => {
  const terms: Term[] = [];
  const termNames = ['First Term', 'Second Term', 'Third Term', 'Fourth Term'];

  for (let i = 0; i < count; i++) {
    const startMonth = i * (12 / count);
    const endMonth = (i + 1) * (12 / count) - 1;

    terms.push({
      id: `${yearPrefix}-term-${i + 1}`,
      name: termNames[i],
      startDate: `2024-${String(startMonth + 4).padStart(2, '0')}-01`,
      endDate: `2024-${String(endMonth + 4).padStart(2, '0')}-${endMonth % 2 === 0 ? '30' : '31'}`,
      isActive: i === 0,
      holidays: [
      {
        id: `${yearPrefix}-holiday-${i}-1`,
        name: i === 0 ? 'Independence Day' : 'Republic Day',
        date: i === 0 ? '2024-08-15' : '2025-01-26',
        type: 'public'
      },
      {
        id: `${yearPrefix}-holiday-${i}-2`,
        name: 'Mid-term Break',
        date: i === 0 ? '2024-07-15' : '2024-12-15',
        type: 'school'
      }],

      examSchedules: [
      {
        id: `${yearPrefix}-exam-${i}-1`,
        name: 'Mid-term Examination',
        startDate: i === 0 ? '2024-07-01' : '2024-11-01',
        endDate: i === 0 ? '2024-07-10' : '2024-11-10',
        type: 'midterm'
      },
      {
        id: `${yearPrefix}-exam-${i}-2`,
        name: 'Final Examination',
        startDate: i === 0 ? '2024-09-15' : '2025-02-15',
        endDate: i === 0 ? '2024-09-25' : '2025-02-25',
        type: 'final'
      }]

    });
  }

  return terms;
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
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
  const handleAddSession = () => {
    if (!formData.year || !formData.startDate || !formData.endDate) {
      showNotification('error', 'Please fill all required fields');
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
    }

    const newSession: AcademicSession = {
      id: `session-${Date.now()}`,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      terms: generateMockTerms(formData.year, parseInt(formData.numberOfTerms)),
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
    showNotification('success', `Academic year ${formData.year} created successfully`);
  };

  const handleEditSession = () => {
    if (!selectedSession || !formData.year || !formData.startDate || !formData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot edit locked session');
      return;
    }

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession.id ?
    {
      ...session,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

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

    const newYear = prompt('Enter new academic year (e.g., 2027-2028):');
    if (!newYear) return;

    const yearRegex = /^\d{4}-\d{4}$/;
    if (!yearRegex.test(newYear)) {
      showNotification('error', 'Invalid year format. Use YYYY-YYYY format');
      return;
    }

    const duplicatedSession: AcademicSession = {
      ...selectedSession,
      id: `session-${Date.now()}`,
      year: newYear,
      status: 'draft',
      isLocked: false,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      totalStudents: 0,
      totalClasses: 0,
      totalSubjects: 0,
      terms: selectedSession.terms.map((term, index) => ({
        ...term,
        id: `${newYear}-term-${index + 1}`,
        isActive: index === 0
      }))
    };

    setSessions((prev) => [...prev, duplicatedSession]);
    setShowDuplicateModal(false);
    setSelectedSession(null);
    showNotification('success', `Academic year duplicated as ${newYear}`);
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
    if (!selectedSession || !termFormData.name || !termFormData.startDate || !termFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (new Date(termFormData.startDate) >= new Date(termFormData.endDate)) {
      showNotification('error', 'End date must be after start date');
      return;
    }

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot add term to locked session');
      return;
    }

    const newTerm: Term = {
      id: `${selectedSession.id}-term-${Date.now()}`,
      name: termFormData.name,
      startDate: termFormData.startDate,
      endDate: termFormData.endDate,
      isActive: termFormData.isActive,
      holidays: [],
      examSchedules: []
    };

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession.id ?
    {
      ...session,
      terms: [...session.terms, newTerm],
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedSession((prev) => prev ? { ...prev, terms: [...prev.terms, newTerm] } : null);
    resetTermForm();
    showNotification('success', 'Term added successfully');
  };

  const handleEditTerm = () => {
    if (!selectedSession || !selectedTerm || !termFormData.name || !termFormData.startDate || !termFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot edit term in locked session');
      return;
    }

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession.id ?
    {
      ...session,
      terms: session.terms.map((term) =>
      term.id === selectedTerm.id ?
      {
        ...term,
        name: termFormData.name,
        startDate: termFormData.startDate,
        endDate: termFormData.endDate,
        isActive: termFormData.isActive
      } :
      term
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedTerm(null);
    resetTermForm();
    showNotification('success', 'Term updated successfully');
  };

  const handleDeleteTerm = (term: Term) => {
    if (!selectedSession) return;

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot delete term from locked session');
      return;
    }

    if (selectedSession.terms.length <= 1) {
      showNotification('error', 'Cannot delete the last term');
      return;
    }

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession.id ?
    {
      ...session,
      terms: session.terms.filter((t) => t.id !== term.id),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedSession((prev) => prev ? {
      ...prev,
      terms: prev.terms.filter((t) => t.id !== term.id)
    } : null);

    showNotification('success', 'Term deleted successfully');
  };

  const handleToggleTermActive = (term: Term) => {
    if (!selectedSession) return;

    if (selectedSession.isLocked) {
      showNotification('error', 'Cannot modify term in locked session');
      return;
    }

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession.id ?
    {
      ...session,
      terms: session.terms.map((t) =>
      t.id === term.id ?
      { ...t, isActive: !t.isActive } :
      t
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedSession((prev) => prev ? {
      ...prev,
      terms: prev.terms.map((t) =>
      t.id === term.id ? { ...t, isActive: !t.isActive } : t
      )
    } : null);

    showNotification('info', `Term ${term.isActive ? 'deactivated' : 'activated'}`);
  };

  // Holiday Management Functions
  const handleAddHoliday = () => {
    if (!selectedTerm || !holidayFormData.name || !holidayFormData.date) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      name: holidayFormData.name,
      date: holidayFormData.date,
      type: holidayFormData.type
    };

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession?.id ?
    {
      ...session,
      terms: session.terms.map((term) =>
      term.id === selectedTerm.id ?
      { ...term, holidays: [...term.holidays, newHoliday] } :
      term
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedTerm((prev) => prev ? {
      ...prev,
      holidays: [...prev.holidays, newHoliday]
    } : null);

    resetHolidayForm();
    setShowAddHolidayForm(false);
    showNotification('success', 'Holiday added successfully');
  };

  const handleDeleteHoliday = (holidayId: string) => {
    if (!selectedTerm) return;

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession?.id ?
    {
      ...session,
      terms: session.terms.map((term) =>
      term.id === selectedTerm.id ?
      { ...term, holidays: term.holidays.filter((h) => h.id !== holidayId) } :
      term
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedTerm((prev) => prev ? {
      ...prev,
      holidays: prev.holidays.filter((h) => h.id !== holidayId)
    } : null);

    showNotification('success', 'Holiday deleted successfully');
  };

  // Exam Schedule Management Functions
  const handleAddExam = () => {
    if (!selectedTerm || !examFormData.name || !examFormData.startDate || !examFormData.endDate) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    if (new Date(examFormData.startDate) >= new Date(examFormData.endDate)) {
      showNotification('error', 'Exam end date must be after start date');
      return;
    }

    const newExam: ExamSchedule = {
      id: `exam-${Date.now()}`,
      name: examFormData.name,
      startDate: examFormData.startDate,
      endDate: examFormData.endDate,
      type: examFormData.type
    };

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession?.id ?
    {
      ...session,
      terms: session.terms.map((term) =>
      term.id === selectedTerm.id ?
      { ...term, examSchedules: [...term.examSchedules, newExam] } :
      term
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedTerm((prev) => prev ? {
      ...prev,
      examSchedules: [...prev.examSchedules, newExam]
    } : null);

    resetExamForm();
    setShowAddExamForm(false);
    showNotification('success', 'Exam schedule added successfully');
  };

  const handleDeleteExam = (examId: string) => {
    if (!selectedTerm) return;

    setSessions((prev) => prev.map((session) =>
    session.id === selectedSession?.id ?
    {
      ...session,
      terms: session.terms.map((term) =>
      term.id === selectedTerm.id ?
      { ...term, examSchedules: term.examSchedules.filter((e) => e.id !== examId) } :
      term
      ),
      modifiedAt: new Date().toISOString()
    } :
    session
    ));

    setSelectedTerm((prev) => prev ? {
      ...prev,
      examSchedules: prev.examSchedules.filter((e) => e.id !== examId)
    } : null);

    showNotification('success', 'Exam schedule deleted successfully');
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    const canDelete = Array.from(selectedSessions).every((id) => {
      const session = sessions.find((s) => s.id === id);
      return session && !session.isLocked && session.status !== 'current';
    });

    if (!canDelete) {
      showNotification('error', 'Cannot delete locked or current sessions');
      return;
    }

    setSessions((prev) => prev.filter((s) => !selectedSessions.has(s.id)));
    setSelectedSessions(new Set());
    showNotification('success', `${selectedSessions.size} sessions deleted`);
  };

  const handleBulkArchive = () => {
    const canArchive = Array.from(selectedSessions).every((id) => {
      const session = sessions.find((s) => s.id === id);
      return session && session.status !== 'current';
    });

    if (!canArchive) {
      showNotification('error', 'Cannot archive current session');
      return;
    }

    setSessions((prev) => prev.map((s) =>
    selectedSessions.has(s.id) ?
    { ...s, status: 'past' as const, isLocked: true } :
    s
    ));

    setSelectedSessions(new Set());
    showNotification('success', `${selectedSessions.size} sessions archived`);
  };

  const handleBulkExport = () => {
    const selectedSessionsData = sessions.filter((s) => selectedSessions.has(s.id));
    const dataStr = JSON.stringify(selectedSessionsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `academic-sessions-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('success', 'Sessions exported successfully');
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

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setSessions((prev) => [...prev, ...importedData]);
          showNotification('success', `${importedData.length} sessions imported successfully`);
          setShowImportModal(false);
        } else {
          showNotification('error', 'Invalid file format');
        }
      } catch (error) {
        showNotification('error', 'Failed to parse file');
      }
    };
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

  const toggleSessionSelection = (sessionId: string) => {
    setSelectedSessions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sessionId)) {
        newSet.delete(sessionId);
      } else {
        newSet.add(sessionId);
      }
      return newSet;
    });
  };

  const selectAllSessions = () => {
    if (selectedSessions.size === filteredSessions.length) {
      setSelectedSessions(new Set());
    } else {
      setSelectedSessions(new Set(filteredSessions.map((s) => s.id)));
    }
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
    resetTermForm();
  };

  const openDeleteConfirm = (session: AcademicSession) => {
    setSelectedSession(session);
    setShowDeleteConfirm(true);
  };

  const openDuplicateModal = (session: AcademicSession) => {
    setSelectedSession(session);
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

  // Statistics Calculation
  const stats = useMemo(() => {
    return {
      total: sessions.length,
      current: sessions.filter((s) => s.status === 'current').length,
      past: sessions.filter((s) => s.status === 'past').length,
      future: sessions.filter((s) => s.status === 'future').length,
      draft: sessions.filter((s) => s.status === 'draft').length,
      locked: sessions.filter((s) => s.isLocked).length,
      totalStudents: sessions.reduce((sum, s) => sum + (s.totalStudents || 0), 0),
      totalClasses: sessions.reduce((sum, s) => sum + (s.totalClasses || 0), 0),
      totalTerms: sessions.reduce((sum, s) => sum + s.terms.length, 0)
    };
  }, [sessions]);

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
    key: 'select',
    header: showBulkActions ?
    <input
      type="checkbox"
      checked={selectedSessions.size === filteredSessions.length && filteredSessions.length > 0}
      onChange={selectAllSessions}
      className="rounded" /> :

    null,
    render: (row: AcademicSession) => showBulkActions ?
    <input
      type="checkbox"
      checked={selectedSessions.has(row.id)}
      onChange={() => toggleSessionSelection(row.id)}
      className="rounded" /> :

    null
  },
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
    key: 'students',
    header: 'Students',
    render: (row: AcademicSession) =>
    <div className="text-center">
          {row.totalStudents || 0}
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
            onClick={() => setShowStatsModal(true)}
            title="View Statistics">

            <BarChart className="w-4 h-4 mr-2" />
            Stats
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowHistoryModal(true)}
            title="View History">

            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowBulkActions(!showBulkActions)}>

            <Settings className="w-4 h-4 mr-2" />
            Bulk Actions
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Sessions</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.current}</div>
            <div className="text-sm text-gray-500">Current</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.future}</div>
            <div className="text-sm text-gray-500">Future</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.past}</div>
            <div className="text-sm text-gray-500">Past</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalTerms}</div>
            <div className="text-sm text-gray-500">Total Terms</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.locked}</div>
            <div className="text-sm text-gray-500">Locked</div>
          </div>
        </Card>
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

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedSessions.size > 0 &&
      <Card>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedSessions.size} session(s) selected
            </div>
            <div className="flex gap-2">
              <Button
              variant="outline"
              onClick={handleBulkExport}>

                <Download className="w-4 h-4 mr-2" />
                Export Selected
              </Button>
              <Button
              variant="outline"
              onClick={handleBulkArchive}>

                <Archive className="w-4 h-4 mr-2" />
                Archive Selected
              </Button>
              <Button
              variant="outline"
              onClick={handleBulkDelete}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          data={filteredSessions}
          expandedContent={(row: AcademicSession) => expandedRows.has(row.id) ?
          <div className="p-4 bg-gray-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
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
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Statistics</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{row.totalStudents || 0}</span>
                    </div>
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
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Quick Actions</div>
                  <div className="space-y-2">
                    {row.status !== 'current' &&
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleSetAsCurrent(row)}
                    disabled={row.status === 'draft' || row.status === 'past'}>

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
                  onClick={() => {
                    setSelectedSession(row);
                    resetTermForm();
                    setSelectedTerm(null);
                  }}>

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
                          setSelectedSession(row);
                          openEditTermForm(term);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit Term">

                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                        onClick={() => handleToggleTermActive(term)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title={term.isActive ? 'Deactivate' : 'Activate'}>

                              {term.isActive ?
                        <Eye className="w-3 h-3" /> :

                        <Eye className="w-3 h-3 text-gray-400" />
                        }
                            </button>
                            <button
                        onClick={() => {
                          setSelectedSession(row);
                          handleDeleteTerm(term);
                        }}
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
                  Number of Terms
                </label>
                <Select
                value={formData.numberOfTerms}
                onChange={(e) => setFormData({ ...formData, numberOfTerms: e.target.value })}
                options={[
                { value: '1', label: '1 Term' },
                { value: '2', label: '2 Terms' },
                { value: '3', label: '3 Terms' },
                { value: '4', label: '4 Terms' }]
                } />

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
                      onClick={() => handleDeleteTerm(term)}>

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
                        onClick={() => {
                          setSelectedTerm(term);
                          handleDeleteHoliday(holiday.id);
                        }}
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
                        onClick={() => {
                          setSelectedTerm(term);
                          handleDeleteExam(exam.id);
                        }}
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
            }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                This will create a copy of <strong>{selectedSession.year}</strong> with all its terms,
                holidays, and exam schedules.
              </p>
              <p className="text-sm text-gray-500">
                You will be prompted to enter the new academic year name.
              </p>
            </div>
            <div className="p-6 border-t flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
              setShowDuplicateModal(false);
              setSelectedSession(null);
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

      {/* Statistics Modal */}
      {showStatsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-lg font-bold">Academic Session Statistics</h3>
              <button onClick={() => setShowStatsModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm text-gray-500">Total Sessions</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.current}</div>
                    <div className="text-sm text-gray-500">Current</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.future}</div>
                    <div className="text-sm text-gray-500">Future</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">{stats.past}</div>
                    <div className="text-sm text-gray-500">Past</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
                    <div className="text-sm text-gray-500">Draft</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{stats.locked}</div>
                    <div className="text-sm text-gray-500">Locked</div>
                  </div>
                </Card>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <div className="text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{stats.totalStudents}</div>
                    <div className="text-sm text-gray-500">Total Students</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{stats.totalClasses}</div>
                    <div className="text-sm text-gray-500">Total Classes</div>
                  </div>
                </Card>
                <Card>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{stats.totalTerms}</div>
                    <div className="text-sm text-gray-500">Total Terms</div>
                  </div>
                </Card>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end">
              <Button onClick={() => setShowStatsModal(false)}>Close</Button>
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