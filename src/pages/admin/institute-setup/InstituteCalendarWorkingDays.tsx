// filepath: src/pages/settings/InstituteCalendarWorkingDays/InstituteCalendarWorkingDays.tsx

import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import {
  Plus,
  Edit2,
  Calendar,
  Trash2,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  RefreshCw } from
'lucide-react';

interface Holiday {
  id: number;
  startDate: string;
  endDate: string;
  name: string;
  description: string;
  type: 'National' | 'Religious' | 'Vacation' | 'Regional' | 'Institutional' | 'Exam';
  recurring: boolean;
  affectsAllBranches: boolean;
  applicableBranches: string[];
  academicYear: string;
  status: 'Active' | 'Inactive';
}

interface WorkingDay {
  day: string;
  dayIndex: number;
  type: 'Full Day' | 'Half Day' | 'Holiday';
  startTime: string;
  endTime: string;
  isWorking: boolean;
}

interface SpecialWorkingDay {
  id: number;
  date: string;
  reason: string;
  originalType: string;
  newType: 'Full Day' | 'Half Day' | 'Holiday';
}

export function InstituteCalendarWorkingDays() {
  const [holidays, setHolidays] = useState<Holiday[]>([
  {
    id: 1,
    startDate: '2024-01-26',
    endDate: '2024-01-26',
    name: 'Republic Day',
    description: 'National holiday celebrating the constitution of India',
    type: 'National',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 2,
    startDate: '2024-03-25',
    endDate: '2024-03-25',
    name: 'Holi',
    description: 'Festival of colors',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 3,
    startDate: '2024-04-14',
    endDate: '2024-04-14',
    name: 'Ambedkar Jayanti',
    description: 'Birth anniversary of Dr. B.R. Ambedkar',
    type: 'National',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 4,
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    name: 'Summer Vacation',
    description: 'Annual summer break for students',
    type: 'Vacation',
    recurring: false,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 5,
    startDate: '2024-08-15',
    endDate: '2024-08-15',
    name: 'Independence Day',
    description: 'National holiday celebrating independence',
    type: 'National',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 6,
    startDate: '2024-08-26',
    endDate: '2024-08-26',
    name: 'Janmashtami',
    description: 'Birth of Lord Krishna',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 7,
    startDate: '2024-09-07',
    endDate: '2024-09-07',
    name: 'Milad un-Nabi',
    description: 'Birth anniversary of Prophet Muhammad',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 8,
    startDate: '2024-10-02',
    endDate: '2024-10-02',
    name: 'Gandhi Jayanti',
    description: 'Birth anniversary of Mahatma Gandhi',
    type: 'National',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 9,
    startDate: '2024-10-12',
    endDate: '2024-10-12',
    name: 'Dussehra',
    description: 'Victory of good over evil',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 10,
    startDate: '2024-10-31',
    endDate: '2024-11-04',
    name: 'Diwali Break',
    description: 'Festival of lights holiday period',
    type: 'Vacation',
    recurring: false,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 11,
    startDate: '2024-11-15',
    endDate: '2024-11-15',
    name: 'Guru Nanak Jayanti',
    description: 'Birth anniversary of Guru Nanak Dev',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 12,
    startDate: '2024-12-25',
    endDate: '2024-12-25',
    name: 'Christmas',
    description: 'Christmas Day',
    type: 'Religious',
    recurring: true,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 13,
    startDate: '2024-12-26',
    endDate: '2025-01-01',
    name: 'Winter Break',
    description: 'Year-end vacation period',
    type: 'Vacation',
    recurring: false,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 14,
    startDate: '2025-01-14',
    endDate: '2025-01-14',
    name: 'Makar Sankranti',
    description: 'Harvest festival',
    type: 'Regional',
    recurring: true,
    affectsAllBranches: false,
    applicableBranches: ['Main Campus', 'City Center Branch'],
    academicYear: '2024-25',
    status: 'Active'
  },
  {
    id: 15,
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    name: 'Board Examination Period',
    description: 'Class 10 and 12 board examinations - no regular classes',
    type: 'Exam',
    recurring: false,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  }]
  );

  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
  { day: 'Monday', dayIndex: 1, type: 'Full Day', startTime: '08:00', endTime: '15:30', isWorking: true },
  { day: 'Tuesday', dayIndex: 2, type: 'Full Day', startTime: '08:00', endTime: '15:30', isWorking: true },
  { day: 'Wednesday', dayIndex: 3, type: 'Full Day', startTime: '08:00', endTime: '15:30', isWorking: true },
  { day: 'Thursday', dayIndex: 4, type: 'Full Day', startTime: '08:00', endTime: '15:30', isWorking: true },
  { day: 'Friday', dayIndex: 5, type: 'Full Day', startTime: '08:00', endTime: '15:30', isWorking: true },
  { day: 'Saturday', dayIndex: 6, type: 'Half Day', startTime: '08:00', endTime: '12:30', isWorking: true },
  { day: 'Sunday', dayIndex: 0, type: 'Holiday', startTime: '', endTime: '', isWorking: false }]
  );

  const [specialWorkingDays, setSpecialWorkingDays] = useState<SpecialWorkingDay[]>([
  { id: 1, date: '2024-08-17', reason: 'Independence Day Celebration (Shifted)', originalType: 'Saturday', newType: 'Holiday' },
  { id: 2, date: '2024-11-09', reason: 'Parent-Teacher Meeting', originalType: 'Saturday', newType: 'Full Day' },
  { id: 3, date: '2025-01-25', reason: 'Republic Day Preparation', originalType: 'Saturday', newType: 'Full Day' }]
  );

  const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);
  const [isEditHolidayModalOpen, setIsEditHolidayModalOpen] = useState(false);
  const [isEditPatternModalOpen, setIsEditPatternModalOpen] = useState(false);
  const [isViewHolidayModalOpen, setIsViewHolidayModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSpecialDaysModalOpen, setIsSpecialDaysModalOpen] = useState(false);
  const [isAddSpecialDayModalOpen, setIsAddSpecialDayModalOpen] = useState(false);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [isCopyHolidaysModalOpen, setIsCopyHolidaysModalOpen] = useState(false);

  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [filterType, setFilterType] = useState<string>('All');

  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const [holidayForm, setHolidayForm] = useState<Partial<Holiday>>({
    startDate: '',
    endDate: '',
    name: '',
    description: '',
    type: 'National',
    recurring: false,
    affectsAllBranches: true,
    applicableBranches: [],
    academicYear: '2024-25',
    status: 'Active'
  });

  const [workingDaysForm, setWorkingDaysForm] = useState<WorkingDay[]>([...workingDays]);

  const [specialDayForm, setSpecialDayForm] = useState<Partial<SpecialWorkingDay>>({
    date: '',
    reason: '',
    originalType: '',
    newType: 'Holiday'
  });

  const [copyFromYear, setCopyFromYear] = useState('2023-24');
  const [copyToYear, setCopyToYear] = useState('2025-26');

  const holidayTypeOptions = [
  { value: 'National', label: 'National Holiday' },
  { value: 'Religious', label: 'Religious Holiday' },
  { value: 'Vacation', label: 'Vacation Period' },
  { value: 'Regional', label: 'Regional Holiday' },
  { value: 'Institutional', label: 'Institutional Holiday' },
  { value: 'Exam', label: 'Examination Period' }];


  const workingTypeOptions = [
  { value: 'Full Day', label: 'Full Day' },
  { value: 'Half Day', label: 'Half Day' },
  { value: 'Holiday', label: 'Holiday' }];


  const academicYearOptions = [
  { value: '2023-24', label: '2023-24' },
  { value: '2024-25', label: '2024-25' },
  { value: '2025-26', label: '2025-26' }];


  const branchOptions = [
  { value: 'Main Campus', label: 'Main Campus' },
  { value: 'City Center Branch', label: 'City Center Branch' },
  { value: 'North Zone Campus', label: 'North Zone Campus' }];


  const monthOptions = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' }];


  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: null, text: '' }), 3000);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    if (startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getDaysBetween = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getTypeVariant = (type: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'secondary' => {
    switch (type) {
      case 'National':
        return 'primary';
      case 'Religious':
        return 'info';
      case 'Vacation':
        return 'success';
      case 'Regional':
        return 'warning';
      case 'Institutional':
        return 'secondary';
      case 'Exam':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const filteredHolidays = filterType === 'All' ?
  holidays :
  holidays.filter((h) => h.type === filterType);

  const handleAddHoliday = () => {
    setHolidayForm({
      startDate: '',
      endDate: '',
      name: '',
      description: '',
      type: 'National',
      recurring: false,
      affectsAllBranches: true,
      applicableBranches: [],
      academicYear: '2024-25',
      status: 'Active'
    });
    setIsAddHolidayModalOpen(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setHolidayForm({ ...holiday });
    setIsEditHolidayModalOpen(true);
  };

  const handleViewHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsViewHolidayModalOpen(true);
  };

  const handleDeleteHoliday = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteHoliday = () => {
    if (selectedHoliday) {
      setHolidays((prev) => prev.filter((h) => h.id !== selectedHoliday.id));
      showMessage('success', `Holiday "${selectedHoliday.name}" deleted successfully`);
      setIsDeleteConfirmOpen(false);
      setSelectedHoliday(null);
    }
  };

  const handleSaveNewHoliday = () => {
    if (!holidayForm.name || !holidayForm.startDate || !holidayForm.endDate) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    if (new Date(holidayForm.startDate) > new Date(holidayForm.endDate)) {
      showMessage('error', 'End date must be after start date');
      return;
    }

    const newHoliday: Holiday = {
      id: Math.max(...holidays.map((h) => h.id), 0) + 1,
      startDate: holidayForm.startDate || '',
      endDate: holidayForm.endDate || '',
      name: holidayForm.name || '',
      description: holidayForm.description || '',
      type: holidayForm.type as Holiday['type'] || 'National',
      recurring: holidayForm.recurring || false,
      affectsAllBranches: holidayForm.affectsAllBranches !== false,
      applicableBranches: holidayForm.applicableBranches || [],
      academicYear: holidayForm.academicYear || '2024-25',
      status: holidayForm.status as 'Active' | 'Inactive' || 'Active'
    };

    setHolidays((prev) =>
    [...prev, newHoliday].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    );
    showMessage('success', `Holiday "${newHoliday.name}" added successfully`);
    setIsAddHolidayModalOpen(false);
  };

  const handleUpdateHoliday = () => {
    if (!holidayForm.name || !holidayForm.startDate || !holidayForm.endDate) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    if (new Date(holidayForm.startDate) > new Date(holidayForm.endDate)) {
      showMessage('error', 'End date must be after start date');
      return;
    }

    setHolidays((prev) =>
    prev.
    map((h) =>
    h.id === selectedHoliday?.id ? { ...h, ...holidayForm } as Holiday : h
    ).
    sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    );
    showMessage('success', `Holiday "${holidayForm.name}" updated successfully`);
    setIsEditHolidayModalOpen(false);
    setSelectedHoliday(null);
  };

  const handleEditPattern = () => {
    setWorkingDaysForm([...workingDays]);
    setIsEditPatternModalOpen(true);
  };

  const handleSavePattern = () => {
    setWorkingDays([...workingDaysForm]);
    showMessage('success', 'Working pattern updated successfully');
    setIsEditPatternModalOpen(false);
  };

  const handleWorkingDayChange = (
  dayIndex: number,
  field: keyof WorkingDay,
  value: string | boolean) =>
  {
    setWorkingDaysForm((prev) =>
    prev.map((day) => {
      if (day.dayIndex === dayIndex) {
        const updatedDay = { ...day, [field]: value };
        if (field === 'type') {
          updatedDay.isWorking = value !== 'Holiday';
          if (value === 'Holiday') {
            updatedDay.startTime = '';
            updatedDay.endTime = '';
          } else if (value === 'Half Day') {
            updatedDay.startTime = '08:00';
            updatedDay.endTime = '12:30';
          } else {
            updatedDay.startTime = '08:00';
            updatedDay.endTime = '15:30';
          }
        }
        return updatedDay;
      }
      return day;
    })
    );
  };

  const handleToggleHolidayStatus = (holiday: Holiday) => {
    const newStatus = holiday.status === 'Active' ? 'Inactive' : 'Active';
    setHolidays((prev) =>
    prev.map((h) => h.id === holiday.id ? { ...h, status: newStatus } : h)
    );
    showMessage('success', `Holiday "${holiday.name}" is now ${newStatus.toLowerCase()}`);
  };

  const handleOpenSpecialDays = () => {
    setIsSpecialDaysModalOpen(true);
  };

  const handleAddSpecialDay = () => {
    setSpecialDayForm({
      date: '',
      reason: '',
      originalType: '',
      newType: 'Holiday'
    });
    setIsAddSpecialDayModalOpen(true);
  };

  const handleSaveSpecialDay = () => {
    if (!specialDayForm.date || !specialDayForm.reason) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    const dayOfWeek = new Date(specialDayForm.date).getDay();
    const originalDay = workingDays.find((d) => d.dayIndex === dayOfWeek);

    const newSpecialDay: SpecialWorkingDay = {
      id: Math.max(...specialWorkingDays.map((s) => s.id), 0) + 1,
      date: specialDayForm.date || '',
      reason: specialDayForm.reason || '',
      originalType: originalDay?.type || 'Regular',
      newType: specialDayForm.newType as SpecialWorkingDay['newType'] || 'Holiday'
    };

    setSpecialWorkingDays((prev) =>
    [...prev, newSpecialDay].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    );
    showMessage('success', 'Special working day added successfully');
    setIsAddSpecialDayModalOpen(false);
  };

  const handleDeleteSpecialDay = (id: number) => {
    setSpecialWorkingDays((prev) => prev.filter((s) => s.id !== id));
    showMessage('success', 'Special working day deleted');
  };

  const handleCopyHolidays = () => {
    const recurringHolidays = holidays.filter((h) => h.recurring);
    const copiedCount = recurringHolidays.length;
    showMessage(
      'success',
      `${copiedCount} recurring holidays can be copied to ${copyToYear}. This is a preview - implement actual copy logic.`
    );
    setIsCopyHolidaysModalOpen(false);
  };

  const calculateWorkingDays = (): {total: number;holidays: number;working: number;} => {
    const totalHolidayDays = holidays.
    filter((h) => h.status === 'Active').
    reduce((total, h) => total + getDaysBetween(h.startDate, h.endDate), 0);

    const workingDaysPerWeek = workingDays.filter((d) => d.isWorking).length;
    const weeksInYear = 52;
    const totalWorkingDays = workingDaysPerWeek * weeksInYear;

    return {
      total: 365,
      holidays: totalHolidayDays,
      working: totalWorkingDays - totalHolidayDays
    };
  };

  const stats = calculateWorkingDays();

  const columns = [
  {
    key: 'date',
    header: 'Date / Range',
    render: (row: Holiday) =>
    <div>
          <div className="font-medium">{formatDateRange(row.startDate, row.endDate)}</div>
          {row.startDate !== row.endDate &&
      <div className="text-xs text-gray-500">
              {getDaysBetween(row.startDate, row.endDate)} days
            </div>
      }
        </div>

  },
  {
    key: 'name',
    header: 'Holiday Name',
    render: (row: Holiday) =>
    <button
      onClick={() => handleViewHoliday(row)}
      className="text-blue-600 hover:underline font-medium">

          {row.name}
        </button>

  },
  {
    key: 'type',
    header: 'Type',
    render: (row: Holiday) =>
    <Badge variant={getTypeVariant(row.type)}>{row.type}</Badge>

  },
  {
    key: 'recurring',
    header: 'Recurring',
    render: (row: Holiday) =>
    <span className={row.recurring ? 'text-green-600' : 'text-gray-400'}>
          {row.recurring ?
      <span className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Yes
            </span> :

      'No'
      }
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: Holiday) =>
    <button onClick={() => handleToggleHolidayStatus(row)}>
          <Badge variant={row.status === 'Active' ? 'success' : 'secondary'}>
            {row.status}
          </Badge>
        </button>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: Holiday) =>
    <div className="flex gap-2">
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleEditHoliday(row)}
        title="Edit Holiday">

            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
        variant="ghost"
        size="xs"
        onClick={() => handleDeleteHoliday(row)}
        title="Delete Holiday">

            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>

  }];


  const specialDaysColumns = [
  {
    key: 'date',
    header: 'Date',
    render: (row: SpecialWorkingDay) => formatDate(row.date)
  },
  {
    key: 'reason',
    header: 'Reason'
  },
  {
    key: 'originalType',
    header: 'Original'
  },
  {
    key: 'newType',
    header: 'Changed To',
    render: (row: SpecialWorkingDay) =>
    <Badge
      variant={
      row.newType === 'Holiday' ?
      'danger' :
      row.newType === 'Half Day' ?
      'warning' :
      'success'
      }>

          {row.newType}
        </Badge>

  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: SpecialWorkingDay) =>
    <Button
      variant="ghost"
      size="xs"
      onClick={() => handleDeleteSpecialDay(row.id)}>

          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>

  }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institute Calendar</h1>
          <p className="text-sm text-gray-500">
            Manage holidays, vacations, and working days
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCalendarViewOpen(true)}>
            <Calendar className="w-4 h-4 mr-2" />
            Calendar View
          </Button>
          <Button variant="outline" onClick={() => setIsCopyHolidaysModalOpen(true)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Holidays
          </Button>
          <Button onClick={handleAddHoliday}>
            <Plus className="w-4 h-4 mr-2" />
            Add Holiday
          </Button>
        </div>
      </div>

      {message.type &&
      <div
        className={`flex items-center gap-2 p-4 rounded-lg ${
        message.type === 'success' ?
        'bg-green-50 border border-green-200 text-green-800' :
        'bg-red-50 border border-red-200 text-red-800'}`
        }>

          {message.type === 'success' ?
        <CheckCircle className="w-5 h-5" /> :

        <AlertCircle className="w-5 h-5" />
        }
          <span className="font-medium">{message.text}</span>
        </div>
      }

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold">{holidays.length}</p>
            <p className="text-sm text-gray-500">Total Holidays</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {holidays.reduce(
                (total, h) =>
                h.status === 'Active' ?
                total + getDaysBetween(h.startDate, h.endDate) :
                total,
                0
              )}
            </p>
            <p className="text-sm text-gray-500">Holiday Days</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {holidays.filter((h) => h.recurring).length}
            </p>
            <p className="text-sm text-gray-500">Recurring Holidays</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold">{specialWorkingDays.length}</p>
            <p className="text-sm text-gray-500">Special Days</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Working Pattern" className="lg:col-span-1">
          <div className="space-y-4">
            {workingDays.map((day) =>
            <div
              key={day.day}
              className="flex justify-between items-center p-2 bg-gray-50 rounded">

                <div>
                  <span className="font-medium">{day.day}</span>
                  {day.isWorking &&
                <span className="text-xs text-gray-500 ml-2">
                      {day.startTime} - {day.endTime}
                    </span>
                }
                </div>
                <Badge
                variant={
                day.type === 'Full Day' ?
                'success' :
                day.type === 'Half Day' ?
                'warning' :
                'danger'
                }>

                  {day.type}
                </Badge>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={handleEditPattern}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Pattern
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleOpenSpecialDays}>

                <Calendar className="w-4 h-4 mr-2" />
                Special Days
              </Button>
            </div>
          </div>
        </Card>

        <Card title="Holiday List" className="lg:col-span-2">
          <div className="mb-4 flex justify-between items-center">
            <Select
              options={[
              { value: 'All', label: 'All Types' },
              ...holidayTypeOptions]
              }
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-48" />

            <span className="text-sm text-gray-500">
              Showing {filteredHolidays.length} of {holidays.length} holidays
            </span>
          </div>
          <Table columns={columns} data={filteredHolidays} />
        </Card>
      </div>

      {/* Add Holiday Modal */}
      {isAddHolidayModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Holiday</h2>
              <button
              onClick={() => setIsAddHolidayModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name *
                </label>
                <Input
                value={holidayForm.name || ''}
                onChange={(e) =>
                setHolidayForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter holiday name" />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <Input
                  type="date"
                  value={holidayForm.startDate || ''}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                    endDate: prev.endDate || e.target.value
                  }))
                  } />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <Input
                  type="date"
                  value={holidayForm.endDate || ''}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  min={holidayForm.startDate} />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Type
                </label>
                <Select
                options={holidayTypeOptions}
                value={holidayForm.type || 'National'}
                onChange={(e) =>
                setHolidayForm((prev) => ({
                  ...prev,
                  type: e.target.value as Holiday['type']
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                value={holidayForm.description || ''}
                onChange={(e) =>
                setHolidayForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Brief description" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Academic Year
                </label>
                <Select
                options={academicYearOptions}
                value={holidayForm.academicYear || '2024-25'}
                onChange={(e) =>
                setHolidayForm((prev) => ({ ...prev, academicYear: e.target.value }))
                } />

              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={holidayForm.recurring || false}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({ ...prev, recurring: e.target.checked }))
                  }
                  className="rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Recurring Annually</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={holidayForm.affectsAllBranches !== false}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({
                    ...prev,
                    affectsAllBranches: e.target.checked
                  }))
                  }
                  className="rounded border-gray-300" />

                  <span className="text-sm text-gray-700">All Branches</span>
                </label>
              </div>

              {!holidayForm.affectsAllBranches &&
            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Applicable Branches
                  </label>
                  <div className="space-y-2">
                    {branchOptions.map((branch) =>
                <label key={branch.value} className="flex items-center gap-2">
                        <input
                    type="checkbox"
                    checked={holidayForm.applicableBranches?.includes(branch.value)}
                    onChange={(e) => {
                      const branches = holidayForm.applicableBranches || [];
                      if (e.target.checked) {
                        setHolidayForm((prev) => ({
                          ...prev,
                          applicableBranches: [...branches, branch.value]
                        }));
                      } else {
                        setHolidayForm((prev) => ({
                          ...prev,
                          applicableBranches: branches.filter((b) => b !== branch.value)
                        }));
                      }
                    }}
                    className="rounded border-gray-300" />

                        <span className="text-sm text-gray-700">{branch.label}</span>
                      </label>
                )}
                  </div>
                </div>
            }
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddHolidayModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNewHoliday}>
                <Save className="w-4 h-4 mr-2" />
                Add Holiday
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Holiday Modal */}
      {isEditHolidayModalOpen && selectedHoliday &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Holiday: {selectedHoliday.name}</h2>
              <button
              onClick={() => setIsEditHolidayModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Name *
                </label>
                <Input
                value={holidayForm.name || ''}
                onChange={(e) =>
                setHolidayForm((prev) => ({ ...prev, name: e.target.value }))
                } />

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <Input
                  type="date"
                  value={holidayForm.startDate || ''}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({ ...prev, startDate: e.target.value }))
                  } />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <Input
                  type="date"
                  value={holidayForm.endDate || ''}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  min={holidayForm.startDate} />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Holiday Type
                </label>
                <Select
                options={holidayTypeOptions}
                value={holidayForm.type || 'National'}
                onChange={(e) =>
                setHolidayForm((prev) => ({
                  ...prev,
                  type: e.target.value as Holiday['type']
                }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Input
                value={holidayForm.description || ''}
                onChange={(e) =>
                setHolidayForm((prev) => ({ ...prev, description: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                options={[
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' }]
                }
                value={holidayForm.status || 'Active'}
                onChange={(e) =>
                setHolidayForm((prev) => ({
                  ...prev,
                  status: e.target.value as 'Active' | 'Inactive'
                }))
                } />

              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={holidayForm.recurring || false}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({ ...prev, recurring: e.target.checked }))
                  }
                  className="rounded border-gray-300" />

                  <span className="text-sm text-gray-700">Recurring Annually</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                  type="checkbox"
                  checked={holidayForm.affectsAllBranches !== false}
                  onChange={(e) =>
                  setHolidayForm((prev) => ({
                    ...prev,
                    affectsAllBranches: e.target.checked
                  }))
                  }
                  className="rounded border-gray-300" />

                  <span className="text-sm text-gray-700">All Branches</span>
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditHolidayModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleUpdateHoliday}>
                <Save className="w-4 h-4 mr-2" />
                Update Holiday
              </Button>
            </div>
          </div>
        </div>
      }

      {/* View Holiday Modal */}
      {isViewHolidayModalOpen && selectedHoliday &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Holiday Details</h2>
              <button
              onClick={() => setIsViewHolidayModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedHoliday.name}</h3>
                  <Badge variant={getTypeVariant(selectedHoliday.type)}>
                    {selectedHoliday.type}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-gray-900">
                  {formatDateRange(selectedHoliday.startDate, selectedHoliday.endDate)}
                </p>
                {selectedHoliday.startDate !== selectedHoliday.endDate &&
              <p className="text-sm text-gray-500">
                    ({getDaysBetween(selectedHoliday.startDate, selectedHoliday.endDate)} days)
                  </p>
              }
              </div>

              {selectedHoliday.description &&
            <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-gray-900">{selectedHoliday.description}</p>
                </div>
            }

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Recurring</p>
                  <p className="text-gray-900 flex items-center gap-1">
                    {selectedHoliday.recurring ?
                  <>
                        <RefreshCw className="w-4 h-4 text-green-600" />
                        Yes
                      </> :

                  'No'
                  }
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                  variant={selectedHoliday.status === 'Active' ? 'success' : 'secondary'}>

                    {selectedHoliday.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Applicable To</p>
                <p className="text-gray-900">
                  {selectedHoliday.affectsAllBranches ?
                'All Branches' :
                selectedHoliday.applicableBranches.join(', ')}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Academic Year</p>
                <p className="text-gray-900">{selectedHoliday.academicYear}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setIsViewHolidayModalOpen(false);
                handleEditHoliday(selectedHoliday);
              }}>

                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="primary" onClick={() => setIsViewHolidayModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Edit Working Pattern Modal */}
      {isEditPatternModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Working Pattern</h2>
              <button
              onClick={() => setIsEditPatternModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {workingDaysForm.map((day) =>
            <div
              key={day.day}
              className="grid grid-cols-4 gap-4 items-center p-3 bg-gray-50 rounded-lg">

                  <div className="font-medium">{day.day}</div>
                  <div>
                    <Select
                  options={workingTypeOptions}
                  value={day.type}
                  onChange={(e) =>
                  handleWorkingDayChange(
                    day.dayIndex,
                    'type',
                    e.target.value as WorkingDay['type']
                  )
                  } />

                  </div>
                  <div>
                    <Input
                  type="time"
                  value={day.startTime}
                  onChange={(e) =>
                  handleWorkingDayChange(day.dayIndex, 'startTime', e.target.value)
                  }
                  disabled={day.type === 'Holiday'}
                  placeholder="Start Time" />

                  </div>
                  <div>
                    <Input
                  type="time"
                  value={day.endTime}
                  onChange={(e) =>
                  handleWorkingDayChange(day.dayIndex, 'endTime', e.target.value)
                  }
                  disabled={day.type === 'Holiday'}
                  placeholder="End Time" />

                  </div>
                </div>
            )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditPatternModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSavePattern}>
                <Save className="w-4 h-4 mr-2" />
                Save Pattern
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Special Working Days Modal */}
      {isSpecialDaysModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">Special Working Days</h2>
                <p className="text-sm text-gray-500">
                  Override regular working pattern for specific dates
                </p>
              </div>
              <button
              onClick={() => setIsSpecialDaysModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddSpecialDay}>
                <Plus className="w-4 h-4 mr-2" />
                Add Special Day
              </Button>
            </div>

            {specialWorkingDays.length > 0 ?
          <Table columns={specialDaysColumns} data={specialWorkingDays} /> :

          <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No special working days configured</p>
              </div>
          }

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setIsSpecialDaysModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Add Special Day Modal */}
      {isAddSpecialDayModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add Special Working Day</h2>
              <button
              onClick={() => setIsAddSpecialDayModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <Input
                type="date"
                value={specialDayForm.date || ''}
                onChange={(e) =>
                setSpecialDayForm((prev) => ({ ...prev, date: e.target.value }))
                } />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason *
                </label>
                <Input
                value={specialDayForm.reason || ''}
                onChange={(e) =>
                setSpecialDayForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="e.g., Parent-Teacher Meeting" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change To
                </label>
                <Select
                options={workingTypeOptions}
                value={specialDayForm.newType || 'Holiday'}
                onChange={(e) =>
                setSpecialDayForm((prev) => ({
                  ...prev,
                  newType: e.target.value as SpecialWorkingDay['newType']
                }))
                } />

              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setIsAddSpecialDayModalOpen(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveSpecialDay}>
                <Save className="w-4 h-4 mr-2" />
                Add Special Day
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Calendar View Modal */}
      {isCalendarViewOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Calendar View</h2>
              <button
              onClick={() => setIsCalendarViewOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <Select
              options={monthOptions}
              value={String(selectedMonth)}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-40" />

              <Select
              options={[
              { value: '2024', label: '2024' },
              { value: '2025', label: '2025' }]
              }
              value={String(selectedYear)}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-32" />

            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
            <div
              key={day}
              className="text-center font-semibold p-2 bg-gray-100 rounded">

                  {day}
                </div>
            )}

              {(() => {
              const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
              const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
              const cells = [];

              // Empty cells before first day
              for (let i = 0; i < firstDay; i++) {
                cells.push(
                  <div key={`empty-${i}`} className="p-2 min-h-[60px]"></div>
                );
              }

              // Days of the month
              for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
                const workingDay = workingDays.find((d) => d.dayIndex === dayOfWeek);
                const holiday = holidays.find(
                  (h) =>
                  h.status === 'Active' &&
                  dateStr >= h.startDate &&
                  dateStr <= h.endDate
                );
                const specialDay = specialWorkingDays.find((s) => s.date === dateStr);

                let bgColor = 'bg-white';
                if (holiday) {
                  bgColor = 'bg-red-50 border-red-200';
                } else if (specialDay) {
                  bgColor = 'bg-yellow-50 border-yellow-200';
                } else if (workingDay?.type === 'Holiday') {
                  bgColor = 'bg-gray-100';
                } else if (workingDay?.type === 'Half Day') {
                  bgColor = 'bg-blue-50';
                }

                cells.push(
                  <div
                    key={day}
                    className={`p-2 min-h-[60px] border rounded ${bgColor}`}
                    title={holiday?.name || specialDay?.reason || ''}>

                      <div className="font-medium">{day}</div>
                      {holiday &&
                    <div className="text-xs text-red-600 truncate">
                          {holiday.name}
                        </div>
                    }
                      {specialDay && !holiday &&
                    <div className="text-xs text-yellow-600 truncate">
                          {specialDay.reason}
                        </div>
                    }
                    </div>
                );
              }

              return cells;
            })()}
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border rounded"></div>
                <span>Working Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 border rounded"></div>
                <span>Half Day</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border rounded"></div>
                <span>Weekly Off</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 border border-red-200 rounded"></div>
                <span>Holiday</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
                <span>Special Day</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="primary" onClick={() => setIsCalendarViewOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Copy Holidays Modal */}
      {isCopyHolidaysModalOpen &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Copy Recurring Holidays</h2>
              <button
              onClick={() => setIsCopyHolidaysModalOpen(false)}
              className="text-gray-500 hover:text-gray-700">

                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy From Year
                </label>
                <Select
                options={academicYearOptions}
                value={copyFromYear}
                onChange={(e) => setCopyFromYear(e.target.value)} />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy To Year
                </label>
                <Select
                options={academicYearOptions}
                value={copyToYear}
                onChange={(e) => setCopyToYear(e.target.value)} />

              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Only recurring holidays will be copied.
                  Dates will be adjusted to the new year automatically.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  {holidays.filter((h) => h.recurring).length} recurring holidays found
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setIsCopyHolidaysModalOpen(false)}>

                Cancel
              </Button>
              <Button variant="primary" onClick={handleCopyHolidays}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Holidays
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selectedHoliday &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Delete Holiday</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "
              <strong>{selectedHoliday.name}</strong>"?
            </p>

            <div className="flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => {
                setIsDeleteConfirmOpen(false);
                setSelectedHoliday(null);
              }}>

                Cancel
              </Button>
              <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteHoliday}>

                <Trash2 className="w-4 h-4 mr-2" />
                Delete Holiday
              </Button>
            </div>
          </div>
        </div>
      }
    </div>);

}