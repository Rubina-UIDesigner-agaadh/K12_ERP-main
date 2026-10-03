// src/features/academics/components/MonthlyActivityCalendar.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  CalendarIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon, XIcon, EditIcon, TrashIcon,
  EyeIcon, DownloadIcon, FilterIcon, SearchIcon, ClockIcon, MapPinIcon, UsersIcon,
  AlertCircleIcon, CheckCircleIcon, RepeatIcon, BellIcon, ListIcon, GridIcon,
  CalendarDaysIcon, SunIcon, CopyIcon, TagIcon } from
'lucide-react';

// Types
interface Activity {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  type: ActivityType;
  category: string;
  location: string;
  organizer: string;
  organizerId: string;
  participants: string[];
  targetAudience: 'All' | 'Students' | 'Teachers' | 'Parents' | 'Staff' | 'Specific Classes';
  targetClasses: string[];
  isAllDay: boolean;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern | null;
  status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Postponed';
  priority: 'Low' | 'Normal' | 'High' | 'Critical';
  isHoliday: boolean;
  requiresRegistration: boolean;
  registrationDeadline: Date | null;
  maxParticipants: number | null;
  registeredCount: number;
  attachments: Attachment[];
  reminders: Reminder[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  color: string;
}

type ActivityType = 'Academic' | 'Sports' | 'Cultural' | 'Holiday' | 'Exam' | 'Meeting' | 'Workshop' | 'Competition' | 'Celebration' | 'PTM' | 'Other';

interface RecurrencePattern {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  interval: number;
  daysOfWeek: number[];
  endDate: Date | null;
  occurrences: number | null;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface Reminder {
  id: string;
  time: number;
  unit: 'minutes' | 'hours' | 'days';
  sent: boolean;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  activities: Activity[];
}

interface FilterState {
  search: string;
  typeFilter: string;
  statusFilter: string;
  categoryFilter: string;
  audienceFilter: string;
}

interface ActivityFormData {
  title: string;
  description: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  type: string;
  category: string;
  location: string;
  targetAudience: string;
  targetClasses: string[];
  isAllDay: boolean;
  isRecurring: boolean;
  status: string;
  priority: string;
  isHoliday: boolean;
  requiresRegistration: boolean;
  registrationDeadline: string;
  maxParticipants: string;
  notes: string;
}

type ViewMode = 'month' | 'week' | 'day' | 'list';

const ACTIVITY_TYPES: ActivityType[] = ['Academic', 'Sports', 'Cultural', 'Holiday', 'Exam', 'Meeting', 'Workshop', 'Competition', 'Celebration', 'PTM', 'Other'];
const CATEGORIES = ['Classroom', 'Assembly', 'Outdoor', 'Indoor', 'Online', 'Off-campus', 'Lab', 'Library', 'Auditorium', 'Playground', 'Other'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TYPE_COLORS: Record<ActivityType, string> = {
  Academic: 'bg-blue-500', Sports: 'bg-green-500', Cultural: 'bg-purple-500', Holiday: 'bg-red-500',
  Exam: 'bg-orange-500', Meeting: 'bg-yellow-500', Workshop: 'bg-cyan-500', Competition: 'bg-pink-500',
  Celebration: 'bg-indigo-500', PTM: 'bg-teal-500', Other: 'bg-gray-500'
};

export function MonthlyActivityCalendar() {
  const [activities, setActivities] = useState<Activity[]>([
  {
    id: '1', title: 'Independence Day Celebration', description: 'National flag hoisting and cultural program', date: new Date(2025, 7, 15), endDate: null,
    startTime: '08:00', endTime: '12:00', type: 'Celebration', category: 'Assembly', location: 'School Ground',
    organizer: 'Principal', organizerId: 't1', participants: [], targetAudience: 'All', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'High',
    isHoliday: true, requiresRegistration: false, registrationDeadline: null, maxParticipants: null, registeredCount: 0,
    attachments: [], reminders: [{ id: 'r1', time: 1, unit: 'days', sent: false }], notes: 'All students must wear white uniform',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Celebration
  },
  {
    id: '2', title: 'Term 1 Examination', description: 'Mid-term examination for all classes', date: new Date(2025, 8, 15), endDate: new Date(2025, 8, 25),
    startTime: '09:00', endTime: '12:00', type: 'Exam', category: 'Classroom', location: 'All Classrooms',
    organizer: 'Exam Controller', organizerId: 't2', participants: [], targetAudience: 'Students', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'Critical',
    isHoliday: false, requiresRegistration: false, registrationDeadline: null, maxParticipants: null, registeredCount: 0,
    attachments: [], reminders: [{ id: 'r2', time: 7, unit: 'days', sent: false }], notes: 'Datesheet will be shared separately',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Exam
  },
  {
    id: '3', title: 'Annual Sports Day', description: 'Inter-house sports competition', date: new Date(2025, 11, 20), endDate: new Date(2025, 11, 21),
    startTime: '08:00', endTime: '17:00', type: 'Sports', category: 'Outdoor', location: 'School Stadium',
    organizer: 'Sports HOD', organizerId: 't3', participants: [], targetAudience: 'All', targetClasses: [],
    isAllDay: true, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'High',
    isHoliday: false, requiresRegistration: true, registrationDeadline: new Date(2025, 11, 15), maxParticipants: 500, registeredCount: 320,
    attachments: [], reminders: [], notes: 'Students to register for specific events',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Sports
  },
  {
    id: '4', title: 'Parent-Teacher Meeting', description: 'PTM for Term 1 results discussion', date: new Date(2025, 9, 5), endDate: null,
    startTime: '09:00', endTime: '13:00', type: 'PTM', category: 'Classroom', location: 'Respective Classrooms',
    organizer: 'Class Teachers', organizerId: 't4', participants: [], targetAudience: 'Parents', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'High',
    isHoliday: false, requiresRegistration: false, registrationDeadline: null, maxParticipants: null, registeredCount: 0,
    attachments: [], reminders: [{ id: 'r3', time: 3, unit: 'days', sent: false }], notes: 'Parents must carry ID proof',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.PTM
  },
  {
    id: '5', title: 'Science Exhibition', description: 'Annual science project exhibition', date: new Date(2025, 10, 10), endDate: new Date(2025, 10, 11),
    startTime: '09:00', endTime: '16:00', type: 'Academic', category: 'Indoor', location: 'School Hall',
    organizer: 'Science HOD', organizerId: 't5', participants: [], targetAudience: 'All', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'Normal',
    isHoliday: false, requiresRegistration: true, registrationDeadline: new Date(2025, 10, 1), maxParticipants: 100, registeredCount: 45,
    attachments: [], reminders: [], notes: 'Project submission deadline: Nov 5',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Academic
  },
  {
    id: '6', title: 'Diwali Vacation', description: 'School closed for Diwali festival', date: new Date(2025, 9, 20), endDate: new Date(2025, 9, 25),
    startTime: '', endTime: '', type: 'Holiday', category: 'Other', location: '',
    organizer: 'Administration', organizerId: 't1', participants: [], targetAudience: 'All', targetClasses: [],
    isAllDay: true, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'Normal',
    isHoliday: true, requiresRegistration: false, registrationDeadline: null, maxParticipants: null, registeredCount: 0,
    attachments: [], reminders: [], notes: 'School reopens on Oct 26',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Holiday
  },
  {
    id: '7', title: 'Staff Meeting', description: 'Monthly staff coordination meeting', date: new Date(2025, 8, 1), endDate: null,
    startTime: '14:00', endTime: '16:00', type: 'Meeting', category: 'Indoor', location: 'Conference Room',
    organizer: 'Principal', organizerId: 't1', participants: [], targetAudience: 'Teachers', targetClasses: [],
    isAllDay: false, isRecurring: true, recurrencePattern: { frequency: 'Monthly', interval: 1, daysOfWeek: [], endDate: null, occurrences: 12 },
    status: 'Scheduled', priority: 'Normal', isHoliday: false, requiresRegistration: false,
    registrationDeadline: null, maxParticipants: null, registeredCount: 0, attachments: [], reminders: [],
    notes: 'Attendance mandatory for all teaching staff',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Meeting
  },
  {
    id: '8', title: 'Annual Day Function', description: 'Annual cultural program and prize distribution', date: new Date(2025, 11, 28), endDate: null,
    startTime: '16:00', endTime: '21:00', type: 'Cultural', category: 'Auditorium', location: 'School Auditorium',
    organizer: 'Cultural Committee', organizerId: 't6', participants: [], targetAudience: 'All', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'High',
    isHoliday: false, requiresRegistration: false, registrationDeadline: null, maxParticipants: 1000, registeredCount: 0,
    attachments: [], reminders: [{ id: 'r4', time: 1, unit: 'days', sent: false }], notes: 'Parents invited. Entry by invitation card only.',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Cultural
  },
  {
    id: '9', title: 'Teacher Training Workshop', description: 'Workshop on modern teaching methodologies', date: new Date(2025, 7, 25), endDate: new Date(2025, 7, 26),
    startTime: '10:00', endTime: '16:00', type: 'Workshop', category: 'Indoor', location: 'Training Hall',
    organizer: 'HR Department', organizerId: 't7', participants: [], targetAudience: 'Teachers', targetClasses: [],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'Normal',
    isHoliday: false, requiresRegistration: true, registrationDeadline: new Date(2025, 7, 20), maxParticipants: 50, registeredCount: 35,
    attachments: [], reminders: [], notes: 'Certificates will be provided',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Workshop
  },
  {
    id: '10', title: 'Inter-School Quiz Competition', description: 'District level quiz competition', date: new Date(2025, 9, 15), endDate: null,
    startTime: '09:00', endTime: '14:00', type: 'Competition', category: 'Auditorium', location: 'School Auditorium',
    organizer: 'Academic Committee', organizerId: 't8', participants: [], targetAudience: 'Specific Classes', targetClasses: ['IX-A', 'IX-B', 'X-A', 'X-B'],
    isAllDay: false, isRecurring: false, recurrencePattern: null, status: 'Scheduled', priority: 'High',
    isHoliday: false, requiresRegistration: true, registrationDeadline: new Date(2025, 9, 10), maxParticipants: 20, registeredCount: 15,
    attachments: [], reminders: [], notes: 'Team of 4 students each',
    createdAt: new Date(), updatedAt: new Date(), createdBy: 'Admin', color: TYPE_COLORS.Competition
  }]
  );

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [filters, setFilters] = useState<FilterState>({ search: '', typeFilter: 'all', statusFilter: 'all', categoryFilter: 'all', audienceFilter: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [formData, setFormData] = useState<ActivityFormData>({
    title: '', description: '', date: '', endDate: '', startTime: '09:00', endTime: '17:00',
    type: 'Academic', category: 'Classroom', location: '', targetAudience: 'All', targetClasses: [],
    isAllDay: false, isRecurring: false, status: 'Scheduled', priority: 'Normal', isHoliday: false,
    requiresRegistration: false, registrationDeadline: '', maxParticipants: '', notes: ''
  });

  const classes = ['VI-A', 'VI-B', 'VII-A', 'VII-B', 'VIII-A', 'VIII-B', 'IX-A', 'IX-B', 'X-A', 'X-B', 'XI-Sci', 'XI-Arts', 'XII-Sci', 'XII-Arts'];

  // Calendar Generation
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateOnly = new Date(date);dateOnly.setHours(0, 0, 0, 0);
      const dayActivities = activities.filter((a) => {
        const actDate = new Date(a.date);actDate.setHours(0, 0, 0, 0);
        if (a.endDate) {
          const endDate = new Date(a.endDate);endDate.setHours(0, 0, 0, 0);
          return dateOnly >= actDate && dateOnly <= endDate;
        }
        return actDate.getTime() === dateOnly.getTime();
      }).filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.typeFilter === 'all' || a.type === filters.typeFilter;
        const matchesStatus = filters.statusFilter === 'all' || a.status === filters.statusFilter;
        const matchesCategory = filters.categoryFilter === 'all' || a.category === filters.categoryFilter;
        const matchesAudience = filters.audienceFilter === 'all' || a.targetAudience === filters.audienceFilter;
        return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesAudience;
      });
      days.push({
        date, isCurrentMonth: date.getMonth() === month, isToday: dateOnly.getTime() === today.getTime(),
        isWeekend: date.getDay() === 0 || date.getDay() === 6, activities: dayActivities
      });
    }
    return days;
  }, [currentDate, activities, filters]);

  const weekDays = useMemo((): CalendarDay[] => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return calendarDays.filter((_, i) => {
      const weekStart = calendarDays.findIndex((d) => d.date.getTime() === start.getTime());
      return i >= weekStart && i < weekStart + 7;
    });
  }, [currentDate, calendarDays]);

  const dayActivities = useMemo(() => {
    if (!selectedDate) return [];
    return activities.filter((a) => {
      const actDate = new Date(a.date);actDate.setHours(0, 0, 0, 0);
      const selDate = new Date(selectedDate);selDate.setHours(0, 0, 0, 0);
      if (a.endDate) {
        const endDate = new Date(a.endDate);endDate.setHours(0, 0, 0, 0);
        return selDate >= actDate && selDate <= endDate;
      }
      return actDate.getTime() === selDate.getTime();
    });
  }, [selectedDate, activities]);

  const monthActivities = useMemo(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    return activities.filter((a) => {
      const actDate = new Date(a.date);
      return actDate.getMonth() === month && actDate.getFullYear() === year;
    });
  }, [currentDate, activities]);

  const stats = useMemo(() => {
    const total = monthActivities.length;
    const holidays = monthActivities.filter((a) => a.isHoliday).length;
    const exams = monthActivities.filter((a) => a.type === 'Exam').length;
    const events = monthActivities.filter((a) => ['Cultural', 'Sports', 'Celebration'].includes(a.type)).length;
    const meetings = monthActivities.filter((a) => a.type === 'Meeting' || a.type === 'PTM').length;
    const upcoming = monthActivities.filter((a) => new Date(a.date) > new Date() && a.status === 'Scheduled').length;
    return { total, holidays, exams, events, meetings, upcoming };
  }, [monthActivities]);

  // Navigation
  const navigatePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') d.setMonth(d.getMonth() - 1);else
      if (viewMode === 'week') d.setDate(d.getDate() - 7);else
      d.setDate(d.getDate() - 1);
      return d;
    });
  }, [viewMode]);

  const navigateNext = useCallback(() => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'month') d.setMonth(d.getMonth() + 1);else
      if (viewMode === 'week') d.setDate(d.getDate() + 7);else
      d.setDate(d.getDate() + 1);
      return d;
    });
  }, [viewMode]);

  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  // Handlers
  const updateFilter = useCallback((key: keyof FilterState, value: string) => setFilters((p) => ({ ...p, [key]: value })), []);
  const clearFilters = useCallback(() => setFilters({ search: '', typeFilter: 'all', statusFilter: 'all', categoryFilter: 'all', audienceFilter: 'all' }), []);

  const resetForm = useCallback(() => {
    setFormData({
      title: '', description: '', date: '', endDate: '', startTime: '09:00', endTime: '17:00',
      type: 'Academic', category: 'Classroom', location: '', targetAudience: 'All', targetClasses: [],
      isAllDay: false, isRecurring: false, status: 'Scheduled', priority: 'Normal', isHoliday: false,
      requiresRegistration: false, registrationDeadline: '', maxParticipants: '', notes: ''
    });
    setEditingActivity(null);
  }, []);

  const handleCreateActivity = useCallback(() => {
    if (!formData.title || !formData.date) {alert('Please fill required fields');return;}
    const newActivity: Activity = {
      id: `act-${Date.now()}`, title: formData.title, description: formData.description,
      date: new Date(formData.date), endDate: formData.endDate ? new Date(formData.endDate) : null,
      startTime: formData.startTime, endTime: formData.endTime, type: formData.type as ActivityType,
      category: formData.category, location: formData.location, organizer: 'Current User', organizerId: 'current',
      participants: [], targetAudience: formData.targetAudience as Activity['targetAudience'], targetClasses: formData.targetClasses,
      isAllDay: formData.isAllDay, isRecurring: formData.isRecurring, recurrencePattern: null,
      status: formData.status as Activity['status'], priority: formData.priority as Activity['priority'],
      isHoliday: formData.isHoliday, requiresRegistration: formData.requiresRegistration,
      registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline) : null,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null, registeredCount: 0,
      attachments: [], reminders: [], notes: formData.notes, createdAt: new Date(), updatedAt: new Date(),
      createdBy: 'Current User', color: TYPE_COLORS[formData.type as ActivityType]
    };
    setActivities((p) => [...p, newActivity]);
    resetForm();
    setShowCreateModal(false);
    alert('Activity created successfully!');
  }, [formData, resetForm]);

  const handleUpdateActivity = useCallback(() => {
    if (!editingActivity || !formData.title) {alert('Please fill required fields');return;}
    setActivities((p) => p.map((a) => a.id === editingActivity.id ? {
      ...a, title: formData.title, description: formData.description,
      date: formData.date ? new Date(formData.date) : a.date, endDate: formData.endDate ? new Date(formData.endDate) : null,
      startTime: formData.startTime, endTime: formData.endTime, type: formData.type as ActivityType,
      category: formData.category, location: formData.location, targetAudience: formData.targetAudience as Activity['targetAudience'],
      targetClasses: formData.targetClasses, isAllDay: formData.isAllDay, isRecurring: formData.isRecurring,
      status: formData.status as Activity['status'], priority: formData.priority as Activity['priority'],
      isHoliday: formData.isHoliday, requiresRegistration: formData.requiresRegistration,
      registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline) : null,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
      notes: formData.notes, updatedAt: new Date(), color: TYPE_COLORS[formData.type as ActivityType]
    } : a));
    resetForm();
    setShowCreateModal(false);
    alert('Activity updated successfully!');
  }, [editingActivity, formData, resetForm]);

  const handleDeleteActivity = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setActivities((p) => p.filter((a) => a.id !== id));
      setShowDetailModal(false);
      alert('Activity deleted successfully!');
    }
  }, []);

  const handleEditClick = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title, description: activity.description, date: activity.date.toISOString().split('T')[0],
      endDate: activity.endDate ? activity.endDate.toISOString().split('T')[0] : '', startTime: activity.startTime,
      endTime: activity.endTime, type: activity.type, category: activity.category, location: activity.location,
      targetAudience: activity.targetAudience, targetClasses: activity.targetClasses, isAllDay: activity.isAllDay,
      isRecurring: activity.isRecurring, status: activity.status, priority: activity.priority, isHoliday: activity.isHoliday,
      requiresRegistration: activity.requiresRegistration, registrationDeadline: activity.registrationDeadline ? activity.registrationDeadline.toISOString().split('T')[0] : '',
      maxParticipants: activity.maxParticipants?.toString() || '', notes: activity.notes
    });
    setShowCreateModal(true);
    setShowDetailModal(false);
  }, []);

  const handleViewDetail = useCallback((activity: Activity) => {setSelectedActivity(activity);setShowDetailModal(true);}, []);

  const handleDayClick = useCallback((day: CalendarDay) => {setSelectedDate(day.date);setShowDayModal(true);}, []);

  const handleDuplicateActivity = useCallback((activity: Activity) => {
    const newActivity: Activity = { ...activity, id: `act-${Date.now()}`, status: 'Scheduled', createdAt: new Date(), updatedAt: new Date() };
    setActivities((p) => [...p, newActivity]);
    alert('Activity duplicated!');
  }, []);

  const handleQuickAdd = useCallback((date: Date) => {
    setFormData((p) => ({ ...p, date: date.toISOString().split('T')[0] }));
    setShowCreateModal(true);
  }, []);

  const handleExport = useCallback(() => {
    const headers = ['Title', 'Date', 'End Date', 'Time', 'Type', 'Category', 'Location', 'Status', 'Priority', 'Audience', 'Organizer', 'Description'];
    const rows = activities.map((a) => [a.title, formatDate(a.date), a.endDate ? formatDate(a.endDate) : '', `${a.startTime}-${a.endTime}`, a.type, a.category, a.location, a.status, a.priority, a.targetAudience, a.organizer, a.description]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');a.href = url;a.download = `calendar-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}.csv`;a.click();
    window.URL.revokeObjectURL(url);
  }, [activities, currentDate]);

  const formatDate = (date: Date) => date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateShort = (date: Date) => date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info' | 'outline'> = { Scheduled: 'info', Ongoing: 'warning', Completed: 'success', Cancelled: 'error', Postponed: 'outline' };
    return variants[status] || 'outline';
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = { Low: 'bg-gray-100 text-gray-800', Normal: 'bg-blue-100 text-blue-800', High: 'bg-orange-100 text-orange-800', Critical: 'bg-red-100 text-red-800' };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const hasActiveFilters = filters.search || filters.typeFilter !== 'all' || filters.statusFilter !== 'all' || filters.categoryFilter !== 'all' || filters.audienceFilter !== 'all';

  const getNavigationTitle = () => {
    if (viewMode === 'month') return `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    if (viewMode === 'week') {
      const start = new Date(currentDate);start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);end.setDate(end.getDate() + 6);
      return `${formatDateShort(start)} - ${formatDateShort(end)}, ${currentDate.getFullYear()}`;
    }
    return formatDate(currentDate);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly Activity Calendar</h1>
          <p className="text-sm text-gray-500">High-level monthly view of all school activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}><DownloadIcon className="w-4 h-4 mr-2" />Export</Button>
          <Button variant="primary" onClick={() => {resetForm();setShowCreateModal(true);}}><PlusIcon className="w-4 h-4 mr-2" />New Activity</Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card><div className="p-3"><p className="text-2xl font-bold text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Total Activities</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p><p className="text-xs text-gray-500">Upcoming</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-red-600">{stats.holidays}</p><p className="text-xs text-gray-500">Holidays</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-orange-500">{stats.exams}</p><p className="text-xs text-gray-500">Exams</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-purple-600">{stats.events}</p><p className="text-xs text-gray-500">Events</p></div></Card>
        <Card><div className="p-3"><p className="text-2xl font-bold text-teal-600">{stats.meetings}</p><p className="text-xs text-gray-500">Meetings</p></div></Card>
      </div>

      {/* Calendar */}
      <Card>
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={navigatePrev}><ChevronLeftIcon className="w-4 h-4" /></Button>
              <h2 className="text-lg font-semibold min-w-[200px] text-center">{getNavigationTitle()}</h2>
              <Button variant="outline" size="sm" onClick={navigateNext}><ChevronRightIcon className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" onClick={goToToday}>Today</Button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                {(['month', 'week', 'day', 'list'] as ViewMode[]).map((mode) =>
                <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1.5 text-sm capitalize ${viewMode === mode ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {mode === 'month' && <GridIcon className="w-4 h-4" />}
                    {mode === 'week' && <CalendarDaysIcon className="w-4 h-4" />}
                    {mode === 'day' && <SunIcon className="w-4 h-4" />}
                    {mode === 'list' && <ListIcon className="w-4 h-4" />}
                  </button>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon className="w-4 h-4 mr-1" />{hasActiveFilters && <Badge variant="danger" className="ml-1">!</Badge>}
              </Button>
            </div>
          </div>

          {/* Filters */}
          {showFilters &&
          <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-3">
                <div className="flex-1 min-w-[150px] relative">
                  <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input placeholder="Search..." className="pl-10" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} />
                </div>
                <Select options={[{ value: 'all', label: 'All Types' }, ...ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))]} value={filters.typeFilter} onChange={(e) => updateFilter('typeFilter', e.target.value)} />
                <Select options={[{ value: 'all', label: 'All Status' }, { value: 'Scheduled', label: 'Scheduled' }, { value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }, { value: 'Cancelled', label: 'Cancelled' }]} value={filters.statusFilter} onChange={(e) => updateFilter('statusFilter', e.target.value)} />
                <Select options={[{ value: 'all', label: 'All Audience' }, { value: 'All', label: 'All' }, { value: 'Students', label: 'Students' }, { value: 'Teachers', label: 'Teachers' }, { value: 'Parents', label: 'Parents' }]} value={filters.audienceFilter} onChange={(e) => updateFilter('audienceFilter', e.target.value)} />
                {hasActiveFilters && <Button variant="outline" size="sm" onClick={clearFilters}><XIcon className="w-4 h-4" /></Button>}
              </div>
            </div>
          }

          {/* Month View */}
          {viewMode === 'month' &&
          <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-gray-50">
                {WEEKDAYS.map((day) =>
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">{day}</div>
              )}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map((day, i) =>
              <div key={i} onClick={() => handleDayClick(day)} className={`min-h-[100px] p-1 border-b border-r cursor-pointer hover:bg-gray-50 transition-colors ${!day.isCurrentMonth ? 'bg-gray-50' : ''} ${day.isToday ? 'bg-blue-50' : ''} ${day.isWeekend ? 'bg-red-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium ${day.isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>{day.date.getDate()}</span>
                      {day.activities.length > 0 && <span className="text-xs bg-gray-200 px-1 rounded">{day.activities.length}</span>}
                    </div>
                    <div className="space-y-0.5 overflow-hidden">
                      {day.activities.slice(0, 3).map((act) =>
                  <div key={act.id} onClick={(e) => {e.stopPropagation();handleViewDetail(act);}} className={`text-xs px-1 py-0.5 rounded truncate text-white ${act.color}`} title={act.title}>{act.title}</div>
                  )}
                      {day.activities.length > 3 && <div className="text-xs text-gray-500 pl-1">+{day.activities.length - 3} more</div>}
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Week View */}
          {viewMode === 'week' &&
          <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-7 bg-gray-50">
                {weekDays.map((day, i) =>
              <div key={i} className={`p-2 text-center border-b ${day.isToday ? 'bg-blue-50' : ''}`}>
                    <div className="text-sm font-medium text-gray-600">{WEEKDAYS[day.date.getDay()]}</div>
                    <div className={`text-lg font-semibold ${day.isToday ? 'text-blue-600' : 'text-gray-900'}`}>{day.date.getDate()}</div>
                  </div>
              )}
              </div>
              <div className="grid grid-cols-7 min-h-[400px]">
                {weekDays.map((day, i) =>
              <div key={i} onClick={() => handleDayClick(day)} className={`p-2 border-r cursor-pointer hover:bg-gray-50 ${day.isToday ? 'bg-blue-50/50' : ''}`}>
                    <div className="space-y-1">
                      {day.activities.map((act) =>
                  <div key={act.id} onClick={(e) => {e.stopPropagation();handleViewDetail(act);}} className={`p-2 rounded text-white text-xs ${act.color}`}>
                          <p className="font-medium truncate">{act.title}</p>
                          <p className="opacity-80">{act.isAllDay ? 'All Day' : `${act.startTime}-${act.endTime}`}</p>
                        </div>
                  )}
                      <Button variant="ghost" size="sm" className="w-full opacity-0 hover:opacity-100" onClick={() => handleQuickAdd(day.date)}><PlusIcon className="w-3 h-3" /></Button>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* Day View */}
          {viewMode === 'day' &&
          <div className="border rounded-lg">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold">{currentDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              </div>
              <div className="p-4 space-y-3">
                {calendarDays.find((d) => d.date.toDateString() === currentDate.toDateString())?.activities.length === 0 ?
              <div className="text-center py-12 text-gray-500"><CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" /><p>No activities scheduled</p><Button variant="outline" className="mt-4" onClick={() => handleQuickAdd(currentDate)}><PlusIcon className="w-4 h-4 mr-2" />Add Activity</Button></div> :
              calendarDays.find((d) => d.date.toDateString() === currentDate.toDateString())?.activities.map((act) =>
              <div key={act.id} className={`p-4 rounded-lg border-l-4 bg-gray-50 cursor-pointer hover:bg-gray-100`} style={{ borderLeftColor: act.color.replace('bg-', '').replace('-500', '') }} onClick={() => handleViewDetail(act)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{act.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span><ClockIcon className="w-3 h-3 inline mr-1" />{act.isAllDay ? 'All Day' : `${act.startTime} - ${act.endTime}`}</span>
                          {act.location && <span><MapPinIcon className="w-3 h-3 inline mr-1" />{act.location}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadge(act.status)}>{act.status}</Badge>
                        <span className={`px-2 py-0.5 rounded text-xs text-white ${act.color}`}>{act.type}</span>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* List View */}
          {viewMode === 'list' &&
          <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Activity</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Time</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Audience</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {monthActivities.length === 0 ?
                <tr><td colSpan={8} className="py-12 text-center text-gray-500">No activities this month</td></tr> :
                monthActivities.sort((a, b) => a.date.getTime() - b.date.getTime()).map((act) =>
                <tr key={act.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4"><p className="font-medium">{formatDateShort(act.date)}</p>{act.endDate && <p className="text-xs text-gray-500">to {formatDateShort(act.endDate)}</p>}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleViewDetail(act)}>{act.title}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{act.description}</p>
                      </td>
                      <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded text-xs text-white ${act.color}`}>{act.type}</span></td>
                      <td className="py-3 px-4 text-sm">{act.isAllDay ? 'All Day' : `${act.startTime}-${act.endTime}`}</td>
                      <td className="py-3 px-4 text-sm">{act.location || '-'}</td>
                      <td className="py-3 px-4"><Badge variant="outline">{act.targetAudience}</Badge></td>
                      <td className="py-3 px-4"><Badge variant={getStatusBadge(act.status)}>{act.status}</Badge></td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetail(act)}><EyeIcon className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditClick(act)}><EditIcon className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteActivity(act.id)}><TrashIcon className="w-4 h-4 text-red-500" /></Button>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }

          {/* Legend */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <span className="text-sm font-medium text-gray-700">Legend:</span>
            {ACTIVITY_TYPES.slice(0, 8).map((type) =>
            <div key={type} className="flex items-center gap-1 text-xs"><div className={`w-3 h-3 rounded ${TYPE_COLORS[type]}`} />{type}</div>
            )}
          </div>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      {showCreateModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">{editingActivity ? 'Edit Activity' : 'New Activity'}</h2>
                <Button variant="ghost" onClick={() => {setShowCreateModal(false);resetForm();}}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                <Input label="Title" placeholder="Activity title" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required />
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={3} value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" value={formData.date} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} required />
                  <Input label="End Date (optional)" type="date" value={formData.endDate} onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input label="Start Time" type="time" value={formData.startTime} onChange={(e) => setFormData((p) => ({ ...p, startTime: e.target.value }))} disabled={formData.isAllDay} />
                  <Input label="End Time" type="time" value={formData.endTime} onChange={(e) => setFormData((p) => ({ ...p, endTime: e.target.value }))} disabled={formData.isAllDay} />
                  <div className="flex items-end pb-2"><label className="flex items-center gap-2"><input type="checkbox" checked={formData.isAllDay} onChange={(e) => setFormData((p) => ({ ...p, isAllDay: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">All Day</span></label></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Activity Type" options={ACTIVITY_TYPES.map((t) => ({ value: t, label: t }))} value={formData.type} onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))} />
                  <Select label="Category" options={CATEGORIES.map((c) => ({ value: c, label: c }))} value={formData.category} onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))} />
                </div>
                <Input label="Location" placeholder="Venue/Location" value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} />
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Target Audience" options={[{ value: 'All', label: 'All' }, { value: 'Students', label: 'Students' }, { value: 'Teachers', label: 'Teachers' }, { value: 'Parents', label: 'Parents' }, { value: 'Staff', label: 'Staff' }, { value: 'Specific Classes', label: 'Specific Classes' }]} value={formData.targetAudience} onChange={(e) => setFormData((p) => ({ ...p, targetAudience: e.target.value }))} />
                  <Select label="Priority" options={[{ value: 'Low', label: 'Low' }, { value: 'Normal', label: 'Normal' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]} value={formData.priority} onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))} />
                </div>
                {formData.targetAudience === 'Specific Classes' &&
              <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Classes</label>
                    <div className="flex flex-wrap gap-2">
                      {classes.map((cls) =>
                  <label key={cls} className="flex items-center gap-1 p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input type="checkbox" checked={formData.targetClasses.includes(cls)} onChange={(e) => setFormData((p) => ({ ...p, targetClasses: e.target.checked ? [...p.targetClasses, cls] : p.targetClasses.filter((c) => c !== cls) }))} className="h-4 w-4 text-blue-600 rounded" />
                          <span className="text-sm">{cls}</span>
                        </label>
                  )}
                    </div>
                  </div>
              }
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Status" options={[{ value: 'Scheduled', label: 'Scheduled' }, { value: 'Ongoing', label: 'Ongoing' }, { value: 'Completed', label: 'Completed' }, { value: 'Cancelled', label: 'Cancelled' }, { value: 'Postponed', label: 'Postponed' }]} value={formData.status} onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))} />
                  <div className="flex flex-col justify-end gap-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isHoliday} onChange={(e) => setFormData((p) => ({ ...p, isHoliday: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">Mark as Holiday</span></label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isRecurring} onChange={(e) => setFormData((p) => ({ ...p, isRecurring: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">Recurring</span></label>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={formData.requiresRegistration} onChange={(e) => setFormData((p) => ({ ...p, requiresRegistration: e.target.checked }))} className="h-4 w-4 text-blue-600 rounded" /><span className="text-sm">Requires Registration</span></label>
                </div>
                {formData.requiresRegistration &&
              <div className="grid grid-cols-2 gap-4">
                    <Input label="Registration Deadline" type="date" value={formData.registrationDeadline} onChange={(e) => setFormData((p) => ({ ...p, registrationDeadline: e.target.value }))} />
                    <Input label="Max Participants" type="number" value={formData.maxParticipants} onChange={(e) => setFormData((p) => ({ ...p, maxParticipants: e.target.value }))} />
                  </div>
              }
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes</label><textarea className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" rows={2} value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} /></div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => {setShowCreateModal(false);resetForm();}}>Cancel</Button>
                  <Button variant="primary" onClick={editingActivity ? handleUpdateActivity : handleCreateActivity}>{editingActivity ? 'Update' : 'Create'} Activity</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Detail Modal */}
      {showDetailModal && selectedActivity &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6 pb-4 border-b">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${selectedActivity.color}`}>{selectedActivity.type}</span>
                    <Badge variant={getStatusBadge(selectedActivity.status)}>{selectedActivity.status}</Badge>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(selectedActivity.priority)}`}>{selectedActivity.priority}</span>
                    {selectedActivity.isHoliday && <Badge variant="danger">Holiday</Badge>}
                    {selectedActivity.isRecurring && <Badge variant="info"><RepeatIcon className="w-3 h-3 inline mr-1" />Recurring</Badge>}
                  </div>
                  <h2 className="text-xl font-bold">{selectedActivity.title}</h2>
                </div>
                <Button variant="ghost" onClick={() => setShowDetailModal(false)}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-4">
                {selectedActivity.description && <p className="text-gray-600">{selectedActivity.description}</p>}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-gray-400" /><div><p className="font-medium">{formatDate(selectedActivity.date)}</p>{selectedActivity.endDate && <p className="text-gray-500">to {formatDate(selectedActivity.endDate)}</p>}</div></div>
                  <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-400" /><span>{selectedActivity.isAllDay ? 'All Day' : `${selectedActivity.startTime} - ${selectedActivity.endTime}`}</span></div>
                  {selectedActivity.location && <div className="flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-400" /><span>{selectedActivity.location}</span></div>}
                  <div className="flex items-center gap-2"><UsersIcon className="w-4 h-4 text-gray-400" /><span>{selectedActivity.targetAudience}</span></div>
                  <div className="flex items-center gap-2"><TagIcon className="w-4 h-4 text-gray-400" /><span>{selectedActivity.category}</span></div>
                  <div><span className="text-gray-500">Organizer:</span> <span className="font-medium">{selectedActivity.organizer}</span></div>
                </div>
                {selectedActivity.targetClasses.length > 0 &&
              <div><p className="text-sm font-medium mb-1">Target Classes:</p><div className="flex flex-wrap gap-1">{selectedActivity.targetClasses.map((c) => <Badge key={c} variant="outline">{c}</Badge>)}</div></div>
              }
                {selectedActivity.requiresRegistration &&
              <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium mb-2">Registration Details</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Registered:</span> <span className="font-medium">{selectedActivity.registeredCount}/{selectedActivity.maxParticipants || '∞'}</span></div>
                      {selectedActivity.registrationDeadline && <div><span className="text-gray-500">Deadline:</span> <span className="font-medium">{formatDate(selectedActivity.registrationDeadline)}</span></div>}
                    </div>
                    {selectedActivity.maxParticipants &&
                <div className="mt-2"><div className="bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedActivity.registeredCount / selectedActivity.maxParticipants * 100}%` }} /></div></div>
                }
                  </div>
              }
                {selectedActivity.notes && <div className="p-4 bg-yellow-50 rounded-lg"><p className="text-sm font-medium mb-1">Notes:</p><p className="text-sm">{selectedActivity.notes}</p></div>}
                <div className="text-xs text-gray-500"><p>Created: {formatDate(selectedActivity.createdAt)} by {selectedActivity.createdBy}</p><p>Updated: {formatDate(selectedActivity.updatedAt)}</p></div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => handleDuplicateActivity(selectedActivity)}><CopyIcon className="w-4 h-4 mr-2" />Duplicate</Button>
                  <Button variant="outline" onClick={() => handleEditClick(selectedActivity)}><EditIcon className="w-4 h-4 mr-2" />Edit</Button>
                  <Button variant="outline" onClick={() => handleDeleteActivity(selectedActivity.id)}><TrashIcon className="w-4 h-4 mr-2 text-red-500" />Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Day Modal */}
      {showDayModal && selectedDate &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h2 className="text-xl font-bold">{selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</h2>
                <Button variant="ghost" onClick={() => setShowDayModal(false)}><XIcon className="w-5 h-5" /></Button>
              </div>
              <div className="space-y-3">
                {dayActivities.length === 0 ?
              <div className="text-center py-8 text-gray-500"><CalendarIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" /><p>No activities scheduled</p></div> :
              dayActivities.map((act) =>
              <div key={act.id} className={`p-3 rounded-lg border-l-4 bg-gray-50 cursor-pointer hover:bg-gray-100`} style={{ borderLeftColor: act.color.replace('bg-', '').replace('-500', '') }} onClick={() => {setShowDayModal(false);handleViewDetail(act);}}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{act.title}</h4>
                        <p className="text-xs text-gray-500">{act.isAllDay ? 'All Day' : `${act.startTime} - ${act.endTime}`} {act.location && `• ${act.location}`}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs text-white ${act.color}`}>{act.type}</span>
                    </div>
                  </div>
              )}
                <Button variant="outline" className="w-full" onClick={() => {setShowDayModal(false);handleQuickAdd(selectedDate);}}><PlusIcon className="w-4 h-4 mr-2" />Add Activity</Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}