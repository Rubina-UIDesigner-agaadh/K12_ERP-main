import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Edit2,
  Trash2,
  Filter,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Sun,
  Moon,
  Star,
  Flag,
  PartyPopper,
  Briefcase,
  GraduationCap,
  Heart,
  Landmark,
  RefreshCw,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarOff,
  Settings,
  FileText,
  Printer,
  List,
  Grid3X3,
  Info } from
'lucide-react';

// Types
interface Holiday {
  id: string;
  date: string;
  name: string;
  type: 'national' | 'festival' | 'restricted' | 'school' | 'exam' | 'other';
  description?: string;
  isRecurring?: boolean;
}

interface WorkingDayException {
  id: string;
  date: string;
  reason: string;
  originalType: 'sunday' | 'saturday' | 'holiday';
}

// Card Component
function Card({
  title,
  children,
  className = '',
  headerAction





}: {title?: string;children: React.ReactNode;className?: string;headerAction?: React.ReactNode;}) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${className}`}>

      {title &&
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {headerAction}
        </div>
      }
      <div className={title ? 'p-5' : ''}>{children}</div>
    </div>);

}

// Badge Component
function Badge({
  children,
  variant = 'default'



}: {children: React.ReactNode;variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'pink' | 'orange';}) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
    orange: 'bg-orange-100 text-orange-700'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>

      {children}
    </span>);

}

// Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'






}: {isOpen: boolean;onClose: () => void;title: string;children: React.ReactNode;size?: 'sm' | 'md' | 'lg' | 'xl';}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div
          className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col`}>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>);

}

// Toast Component
function Toast({
  message,
  type,
  onClose




}: {message: string;type: 'success' | 'error' | 'info';onClose: () => void;}) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Clock
  };
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  };
  const Icon = icons[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${colors[type]} text-white`}>

      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded">
        <X className="w-4 h-4" />
      </button>
    </div>);

}

// Sample Data - Holidays
const initialHolidays: Holiday[] = [
{
  id: '1',
  date: '2024-01-26',
  name: 'Republic Day',
  type: 'national',
  description: 'National Holiday - Republic Day of India',
  isRecurring: true
},
{
  id: '2',
  date: '2024-03-08',
  name: 'Maha Shivaratri',
  type: 'festival',
  description: 'Hindu Festival'
},
{
  id: '3',
  date: '2024-03-25',
  name: 'Holi',
  type: 'festival',
  description: 'Festival of Colors'
},
{
  id: '4',
  date: '2024-03-29',
  name: 'Good Friday',
  type: 'restricted',
  description: 'Christian Holiday'
},
{
  id: '5',
  date: '2024-04-11',
  name: 'Eid-ul-Fitr',
  type: 'festival',
  description: 'Islamic Festival'
},
{
  id: '6',
  date: '2024-04-14',
  name: 'Ambedkar Jayanti',
  type: 'national',
  description: 'Birth Anniversary of Dr. B.R. Ambedkar'
},
{
  id: '7',
  date: '2024-04-17',
  name: 'Ram Navami',
  type: 'festival',
  description: 'Hindu Festival'
},
{
  id: '8',
  date: '2024-04-21',
  name: 'Mahavir Jayanti',
  type: 'festival',
  description: 'Jain Festival'
},
{
  id: '9',
  date: '2024-05-01',
  name: 'May Day',
  type: 'national',
  description: 'International Workers Day'
},
{
  id: '10',
  date: '2024-05-23',
  name: 'Buddha Purnima',
  type: 'festival',
  description: 'Buddhist Festival'
},
{
  id: '11',
  date: '2024-06-17',
  name: 'Eid-ul-Adha',
  type: 'festival',
  description: 'Islamic Festival'
},
{
  id: '12',
  date: '2024-07-17',
  name: 'Muharram',
  type: 'restricted',
  description: 'Islamic Observance'
},
{
  id: '13',
  date: '2024-08-15',
  name: 'Independence Day',
  type: 'national',
  description: 'National Holiday - Independence Day of India',
  isRecurring: true
},
{
  id: '14',
  date: '2024-08-26',
  name: 'Janmashtami',
  type: 'festival',
  description: 'Birth of Lord Krishna'
},
{
  id: '15',
  date: '2024-09-16',
  name: 'Milad-un-Nabi',
  type: 'restricted',
  description: 'Prophet Muhammad Birthday'
},
{
  id: '16',
  date: '2024-10-02',
  name: 'Gandhi Jayanti',
  type: 'national',
  description: 'Birth Anniversary of Mahatma Gandhi',
  isRecurring: true
},
{
  id: '17',
  date: '2024-10-12',
  name: 'Dussehra',
  type: 'festival',
  description: 'Vijayadashami'
},
{
  id: '18',
  date: '2024-10-31',
  name: 'Diwali Eve',
  type: 'festival',
  description: 'Festival of Lights'
},
{
  id: '19',
  date: '2024-11-01',
  name: 'Diwali',
  type: 'festival',
  description: 'Festival of Lights'
},
{
  id: '20',
  date: '2024-11-02',
  name: 'Govardhan Puja',
  type: 'festival',
  description: 'Day after Diwali'
},
{
  id: '21',
  date: '2024-11-15',
  name: 'Guru Nanak Jayanti',
  type: 'festival',
  description: 'Sikh Festival'
},
{
  id: '22',
  date: '2024-12-25',
  name: 'Christmas',
  type: 'festival',
  description: 'Christian Holiday',
  isRecurring: true
},
// School specific holidays
{
  id: '23',
  date: '2024-05-15',
  name: 'Summer Vacation Starts',
  type: 'school',
  description: 'Summer vacation begins'
},
{
  id: '24',
  date: '2024-06-30',
  name: 'Summer Vacation Ends',
  type: 'school',
  description: 'Summer vacation ends'
},
{
  id: '25',
  date: '2024-10-14',
  name: 'Dussehra Vacation',
  type: 'school',
  description: 'Dussehra break'
},
{
  id: '26',
  date: '2024-10-15',
  name: 'Dussehra Vacation',
  type: 'school',
  description: 'Dussehra break'
},
// Exam holidays
{
  id: '27',
  date: '2024-03-01',
  name: 'Annual Exam Prep Leave',
  type: 'exam',
  description: 'Preparation leave for annual exams'
},
{
  id: '28',
  date: '2024-09-20',
  name: 'Half-yearly Exam',
  type: 'exam',
  description: 'Half-yearly examination'
}];


const initialWorkingExceptions: WorkingDayException[] = [
{
  id: '1',
  date: '2024-02-11',
  reason: 'Annual Day Preparation',
  originalType: 'sunday'
},
{
  id: '2',
  date: '2024-08-10',
  reason: 'Independence Day Celebration Practice',
  originalType: 'saturday'
},
{
  id: '3',
  date: '2024-01-27',
  reason: 'Republic Day Cultural Event',
  originalType: 'saturday'
}];


// Helper Functions
const MONTH_NAMES = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'];


const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getTypeConfig = (type: Holiday['type']) => {
  const configs = {
    national: {
      bg: 'bg-red-500',
      text: 'text-white',
      badge: 'error',
      icon: Landmark,
      label: 'National Holiday'
    },
    festival: {
      bg: 'bg-orange-500',
      text: 'text-white',
      badge: 'orange',
      icon: PartyPopper,
      label: 'Festival'
    },
    restricted: {
      bg: 'bg-purple-500',
      text: 'text-white',
      badge: 'purple',
      icon: Star,
      label: 'Restricted Holiday'
    },
    school: {
      bg: 'bg-blue-500',
      text: 'text-white',
      badge: 'info',
      icon: GraduationCap,
      label: 'School Holiday'
    },
    exam: {
      bg: 'bg-yellow-500',
      text: 'text-white',
      badge: 'warning',
      icon: FileText,
      label: 'Exam'
    },
    other: {
      bg: 'bg-gray-500',
      text: 'text-white',
      badge: 'default',
      icon: Calendar,
      label: 'Other'
    }
  };
  return configs[type] || configs.other;
};

// Main Component
export function HolidayWorkingDayCalendar() {
  // State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [workingExceptions, setWorkingExceptions] = useState<WorkingDayException[]>(
    initialWorkingExceptions
  );
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWorkingDayModal, setShowWorkingDayModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    date: '',
    name: '',
    type: 'festival' as Holiday['type'],
    description: '',
    isRecurring: false
  });

  const [workingFormData, setWorkingFormData] = useState({
    date: '',
    reason: ''
  });

  // Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Calendar Logic
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isSunday = (date: Date) => date.getDay() === 0;
  const isSaturday = (date: Date) => date.getDay() === 6;

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getHolidayForDate = (dateStr: string) => {
    return holidays.find((h) => h.date === dateStr);
  };

  const isWorkingException = (dateStr: string) => {
    return workingExceptions.some((w) => w.date === dateStr);
  };

  const getWorkingException = (dateStr: string) => {
    return workingExceptions.find((w) => w.date === dateStr);
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === day);

  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const goToMonth = (month: number) => {
    setCurrentDate(new Date(currentYear, month, 1));
  };

  // Filter Holidays
  const filterHolidays = () => {
    let filtered = holidays;

    if (selectedMonth !== 'all') {
      filtered = filtered.filter((h) => {
        const month = new Date(h.date).getMonth();
        return month === selectedMonth;
      });
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((h) => h.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (h) =>
        h.name.toLowerCase().includes(query) ||
        h.description?.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const filteredHolidays = filterHolidays();

  // Statistics
  const stats = {
    totalHolidays: holidays.length,
    nationalHolidays: holidays.filter((h) => h.type === 'national').length,
    festivals: holidays.filter((h) => h.type === 'festival').length,
    restrictedHolidays: holidays.filter((h) => h.type === 'restricted').length,
    schoolHolidays: holidays.filter((h) => h.type === 'school').length,
    examDays: holidays.filter((h) => h.type === 'exam').length,
    workingExceptions: workingExceptions.length,
    upcomingHolidays: holidays.filter((h) => new Date(h.date) >= new Date()).length
  };

  // Handlers
  const handleAddHoliday = () => {
    if (!formData.date || !formData.name) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newHoliday: Holiday = {
      id: Date.now().toString(),
      date: formData.date,
      name: formData.name,
      type: formData.type,
      description: formData.description,
      isRecurring: formData.isRecurring
    };

    if (editMode && selectedHoliday) {
      setHolidays(holidays.map((h) => h.id === selectedHoliday.id ? { ...newHoliday, id: h.id } : h));
      showToast('Holiday updated successfully!');
    } else {
      setHolidays([...holidays, newHoliday]);
      showToast('Holiday added successfully!');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleAddWorkingDay = () => {
    if (!workingFormData.date || !workingFormData.reason) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const date = new Date(workingFormData.date);
    let originalType: 'sunday' | 'saturday' | 'holiday' = 'holiday';

    if (isSunday(date)) originalType = 'sunday';else
    if (isSaturday(date)) originalType = 'saturday';

    const newException: WorkingDayException = {
      id: Date.now().toString(),
      date: workingFormData.date,
      reason: workingFormData.reason,
      originalType
    };

    setWorkingExceptions([...workingExceptions, newException]);
    showToast('Working day exception added!');
    setShowWorkingDayModal(false);
    setWorkingFormData({ date: '', reason: '' });
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
    showToast('Holiday deleted successfully!');
    setShowDetailModal(false);
  };

  const handleDeleteWorkingException = (id: string) => {
    setWorkingExceptions(workingExceptions.filter((w) => w.id !== id));
    showToast('Working exception removed!');
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      date: holiday.date,
      name: holiday.name,
      type: holiday.type,
      description: holiday.description || '',
      isRecurring: holiday.isRecurring || false
    });
    setEditMode(true);
    setShowAddModal(true);
  };

  const handleDateClick = (dateStr: string) => {
    const holiday = getHolidayForDate(dateStr);
    const exception = getWorkingException(dateStr);

    setSelectedDate(dateStr);

    if (holiday) {
      setSelectedHoliday(holiday);
      setShowDetailModal(true);
    } else {
      setFormData({ ...formData, date: dateStr });
      setShowAddModal(true);
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      name: '',
      type: 'festival',
      description: '',
      isRecurring: false
    });
    setEditMode(false);
    setSelectedHoliday(null);
  };

  // Render Calendar Grid
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentYear, currentMonth, day);
      const date = new Date(currentYear, currentMonth, day);
      const holiday = getHolidayForDate(dateStr);
      const isWorkingEx = isWorkingException(dateStr);
      const weekend = isWeekend(date);
      const today = isToday(currentYear, currentMonth, day);

      let cellClass = 'h-24 border border-gray-200 p-1 cursor-pointer transition-all hover:shadow-md relative';
      let bgClass = 'bg-white';

      if (today) {
        cellClass += ' ring-2 ring-blue-500';
      }

      if (weekend && !isWorkingEx) {
        bgClass = isSunday(date) ? 'bg-red-50' : 'bg-orange-50';
      }

      if (holiday && !isWorkingEx) {
        const config = getTypeConfig(holiday.type);
        bgClass = `${config.bg.replace('500', '100')}`;
      }

      if (isWorkingEx) {
        bgClass = 'bg-green-50';
      }

      days.push(
        <div
          key={day}
          className={`${cellClass} ${bgClass}`}
          onClick={() => handleDateClick(dateStr)}>

          <div className="flex justify-between items-start">
            <span
              className={`text-sm font-medium ${
              today ?
              'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' :
              weekend && !isWorkingEx ?
              'text-red-600' :
              'text-gray-700'}`
              }>

              {day}
            </span>
            {isWorkingEx &&
            <span className="bg-green-500 text-white text-[10px] px-1 rounded">
                Working
              </span>
            }
          </div>

          {holiday && !isWorkingEx &&
          <div className="mt-1">
              <div
              className={`text-[10px] font-medium px-1 py-0.5 rounded truncate ${getTypeConfig(holiday.type).bg} ${getTypeConfig(holiday.type).text}`}>

                {holiday.name}
              </div>
            </div>
          }

          {weekend && !holiday && !isWorkingEx &&
          <div className="mt-1">
              <span className="text-[10px] text-gray-500">
                {isSunday(date) ? 'Sunday' : 'Saturday'}
              </span>
            </div>
          }
        </div>
      );
    }

    return days;
  };

  const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500';
  const selectClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';

  return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Holiday & Working Day Calendar
            </h1>
            <p className="text-gray-500 text-sm">
              Manage academic calendar, holidays, and working day exceptions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowWorkingDayModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              <CalendarCheck className="w-4 h-4" />
              Mark Working Day
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">

              <Plus className="w-4 h-4" />
              Add Holiday
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      

      {/* View Toggle and Filters */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'calendar' ?
                'bg-white text-blue-600 shadow-sm' :
                'text-gray-600 hover:text-gray-900'}`
                }>

                <Grid3X3 className="w-4 h-4" />
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list' ?
                'bg-white text-blue-600 shadow-sm' :
                'text-gray-600 hover:text-gray-900'}`
                }>

                <List className="w-4 h-4" />
                List
              </button>
            </div>

            {/* Month Quick Select */}
            {viewMode === 'list' &&
            <div className="flex items-center gap-2">
                <select
                value={selectedMonth === 'all' ? 'all' : selectedMonth}
                onChange={(e) =>
                setSelectedMonth(e.target.value === 'all' ? 'all' : parseInt(e.target.value))
                }
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white">

                  <option value="all">All Months</option>
                  {MONTH_NAMES.map((month, idx) =>
                <option key={idx} value={idx}>
                      {month}
                    </option>
                )}
                </select>

                <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white">

                  <option value="all">All Types</option>
                  <option value="national">National Holiday</option>
                  <option value="festival">Festival</option>
                  <option value="restricted">Restricted</option>
                  <option value="school">School Holiday</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>
              </div>
            }
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search holidays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg w-64" />

            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {viewMode === 'calendar' ?
        <div className="space-y-6">
            {/* Calendar Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                  onClick={goToPreviousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg">

                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h2>
                  <button onClick={goToNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">

                    Today
                  </button>
                  <select
                  value={currentMonth}
                  onChange={(e) => goToMonth(parseInt(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white">

                    {MONTH_NAMES.map((month, idx) =>
                  <option key={idx} value={idx}>
                        {month}
                      </option>
                  )}
                  </select>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Legend:</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-100 rounded border border-red-300" />
                  <span className="text-xs text-gray-600">Sunday</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-100 rounded border border-orange-300" />
                  <span className="text-xs text-gray-600">Saturday</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-xs text-gray-600">National</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span className="text-xs text-gray-600">Festival</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-purple-500 rounded" />
                  <span className="text-xs text-gray-600">Restricted</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-blue-500 rounded" />
                  <span className="text-xs text-gray-600">School</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600">Working Day</span>
                </div>
              </div>

              {/* Day Names Header */}
              <div className="grid grid-cols-7 gap-0 mb-1">
                {DAY_NAMES.map((day, idx) =>
              <div
                key={day}
                className={`text-center py-2 text-sm font-semibold ${
                idx === 0 ? 'text-red-600' : idx === 6 ? 'text-orange-600' : 'text-gray-700'}`
                }>

                    {day}
                  </div>
              )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0">{renderCalendarGrid()}</div>
            </div>

            {/* Month Mini Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Navigation</h3>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                {MONTH_NAMES.map((month, idx) => {
                const monthHolidays = holidays.filter(
                  (h) => new Date(h.date).getMonth() === idx
                ).length;
                return (
                  <button
                    key={month}
                    onClick={() => goToMonth(idx)}
                    className={`p-2 text-center rounded-lg transition-colors ${
                    idx === currentMonth ?
                    'bg-blue-600 text-white' :
                    'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
                    }>

                      <span className="text-xs font-medium">{month.slice(0, 3)}</span>
                      {monthHolidays > 0 &&
                    <span
                      className={`block text-[10px] ${idx === currentMonth ? 'text-blue-100' : 'text-gray-500'}`}>

                          {monthHolidays} days
                        </span>
                    }
                    </button>);

              })}
              </div>
            </div>
          </div> : (

        /* List View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holiday List */}
            <div className="lg:col-span-2">
              <Card title={`Holiday List ${currentYear}`}>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Holiday Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredHolidays.map((holiday) => {
                      const date = new Date(holiday.date);
                      const config = getTypeConfig(holiday.type);
                      const isPast = date < new Date();

                      return (
                        <tr
                          key={holiday.id}
                          className={`hover:bg-gray-50 ${isPast ? 'opacity-60' : ''}`}>

                            <td className="px-4 py-3">
                              <span className="font-mono text-sm font-medium text-gray-900">
                                {new Date(holiday.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span
                              className={`text-sm ${
                              isSunday(date) ?
                              'text-red-600 font-medium' :
                              isSaturday(date) ?
                              'text-orange-600 font-medium' :
                              'text-gray-600'}`
                              }>

                                {DAY_NAMES[date.getDay()]}day
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <span className="font-semibold text-gray-900">{holiday.name}</span>
                                {holiday.description &&
                              <p className="text-xs text-gray-500">{holiday.description}</p>
                              }
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={config.badge as any}>{config.label}</Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                onClick={() => handleEditHoliday(holiday)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">

                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                onClick={() => handleDeleteHoliday(holiday.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">

                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>);

                    })}
                    </tbody>
                  </table>
                </div>

                {filteredHolidays.length === 0 &&
              <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No holidays found matching your criteria</p>
                  </div>
              }
              </Card>

              {/* Working Day Exceptions */}
              <Card title="Working Day Exceptions" className="mt-6">
                <div className="space-y-3">
                  {workingExceptions.map((exception) => {
                  const date = new Date(exception.date);
                  return (
                    <div
                      key={exception.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">

                        <div className="flex items-center gap-3">
                          <CalendarCheck className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {date.toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                              <span className="text-gray-500 ml-2">
                                ({DAY_NAMES[date.getDay()]}day)
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">{exception.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success">Working Day</Badge>
                          <button
                          onClick={() => handleDeleteWorkingException(exception.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">

                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>);

                })}

                  {workingExceptions.length === 0 &&
                <div className="text-center py-8">
                      <CalendarCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No working day exceptions</p>
                    </div>
                }
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Add Holiday */}
              <Card title="Quick Add Holiday">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={inputClass} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Holiday Name *
                    </label>
                    <input
                    type="text"
                    placeholder="e.g. Diwali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                    value={formData.type}
                    onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as Holiday['type'] })
                    }
                    className={selectClass}>

                      <option value="national">National Holiday</option>
                      <option value="festival">Festival</option>
                      <option value="restricted">Restricted Holiday</option>
                      <option value="school">School Holiday</option>
                      <option value="exam">Exam</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                    type="text"
                    placeholder="Optional description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={inputClass} />

                  </div>
                  <button
                  onClick={handleAddHoliday}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">

                    <Plus className="w-4 h-4" />
                    Add to Calendar
                  </button>
                </div>
              </Card>

              {/* Mark Working Day */}
              <Card title="Working Day Exception">
                <div className="space-y-4">
                  <p className="text-xs text-gray-500">
                    Mark a Sunday, Saturday, or Holiday as a working day.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input
                    type="date"
                    value={workingFormData.date}
                    onChange={(e) =>
                    setWorkingFormData({ ...workingFormData, date: e.target.value })
                    }
                    className={inputClass} />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                    <input
                    type="text"
                    placeholder="e.g. Annual Day"
                    value={workingFormData.reason}
                    onChange={(e) =>
                    setWorkingFormData({ ...workingFormData, reason: e.target.value })
                    }
                    className={inputClass} />

                  </div>
                  <button
                  onClick={handleAddWorkingDay}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

                    <CalendarCheck className="w-4 h-4" />
                    Mark as Working
                  </button>
                </div>
              </Card>

              {/* Upcoming Holidays */}
              <Card title="Upcoming Holidays">
                <div className="space-y-3">
                  {holidays.
                filter((h) => new Date(h.date) >= new Date()).
                sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).
                slice(0, 5).
                map((holiday) => {
                  const config = getTypeConfig(holiday.type);
                  const Icon = config.icon;
                  return (
                    <div
                      key={holiday.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">

                          <div className={`p-2 rounded-lg ${config.bg}`}>
                            <Icon className={`w-4 h-4 ${config.text}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {holiday.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(holiday.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short'
                          })}
                            </p>
                          </div>
                        </div>);

                })}
                </div>
              </Card>

              {/* Monthly Summary */}
              <Card title="Monthly Summary">
                <div className="space-y-2">
                  {MONTH_NAMES.map((month, idx) => {
                  const count = holidays.filter(
                    (h) => new Date(h.date).getMonth() === idx
                  ).length;
                  return (
                    <div
                      key={month}
                      className="flex items-center justify-between py-1 text-sm">

                        <span className="text-gray-600">{month}</span>
                        <span className="font-medium text-gray-900">{count} holidays</span>
                      </div>);

                })}
                </div>
              </Card>
            </div>
          </div>)
        }
      </div>

      {/* Add/Edit Holiday Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title={editMode ? 'Edit Holiday' : 'Add New Holiday'}
        size="md">

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={inputClass} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Holiday Name *</label>
            <input
              type="text"
              placeholder="Enter holiday name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputClass} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as Holiday['type'] })
              }
              className={selectClass}>

              <option value="national">National Holiday</option>
              <option value="festival">Festival</option>
              <option value="restricted">Restricted Holiday</option>
              <option value="school">School Holiday</option>
              <option value="exam">Exam</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              placeholder="Enter description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`${inputClass} h-20 resize-none`} />

          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />

            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring annually
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            <button
              onClick={handleAddHoliday}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">

              {editMode ? 'Update Holiday' : 'Add Holiday'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Working Day Modal */}
      <Modal
        isOpen={showWorkingDayModal}
        onClose={() => setShowWorkingDayModal(false)}
        title="Mark Working Day Exception"
        size="md">

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-700">
                Use this to mark a weekend (Saturday/Sunday) or a declared holiday as a working
                day for special occasions like Annual Day, Sports Day, or any school event.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={workingFormData.date}
              onChange={(e) => setWorkingFormData({ ...workingFormData, date: e.target.value })}
              className={inputClass} />

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <input
              type="text"
              placeholder="e.g. Annual Day Celebration"
              value={workingFormData.reason}
              onChange={(e) => setWorkingFormData({ ...workingFormData, reason: e.target.value })}
              className={inputClass} />

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => setShowWorkingDayModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">

              Cancel
            </button>
            <button
              onClick={handleAddWorkingDay}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">

              <CalendarCheck className="w-4 h-4" />
              Mark as Working Day
            </button>
          </div>
        </div>
      </Modal>

      {/* Holiday Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Holiday Details"
        size="md">

        {selectedHoliday &&
        <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-3 rounded-lg ${getTypeConfig(selectedHoliday.type).bg}`}>
                {React.createElement(getTypeConfig(selectedHoliday.type).icon, {
                className: `w-8 h-8 ${getTypeConfig(selectedHoliday.type).text}`
              })}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">{selectedHoliday.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedHoliday.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
                </p>
                <div className="mt-2">
                  <Badge variant={getTypeConfig(selectedHoliday.type).badge as any}>
                    {getTypeConfig(selectedHoliday.type).label}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedHoliday.description &&
          <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Description</h5>
                <p className="text-sm text-gray-600">{selectedHoliday.description}</p>
              </div>
          }

            {selectedHoliday.isRecurring &&
          <div className="flex items-center gap-2 text-sm text-green-600">
                <RefreshCw className="w-4 h-4" />
                This holiday recurs annually
              </div>
          }

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
              onClick={() => handleDeleteHoliday(selectedHoliday.id)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">

                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
              onClick={() => {
                setShowDetailModal(false);
                handleEditHoliday(selectedHoliday);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">

                <Edit2 className="w-4 h-4" />
                Edit Holiday
              </button>
            </div>
          </div>
        }
      </Modal>
    </div>);

}