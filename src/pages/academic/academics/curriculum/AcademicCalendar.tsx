import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Select } from '../../../../components/ui/Select';
import { Badge } from '../../../../components/ui/Badge';
import {
  CalendarIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  FilterIcon,
  DownloadIcon,
  PrinterIcon,
  BellIcon,
  RepeatIcon,
  UsersIcon,
  BookOpenIcon,
  GraduationCapIcon,
  PartyPopperIcon,
  TrophyIcon,
  ClockIcon,
  MapPinIcon,
  CopyIcon,
  SearchIcon,
  CheckIcon,
  AlertTriangleIcon,
  BuildingIcon,
  UserIcon,
  ChevronDownIcon } from
'lucide-react';

// ============ TYPES ============
type EventType = 'exam' | 'holiday' | 'ptm' | 'sports' | 'cultural' | 'academic' | 'meeting' | 'deadline' | 'other';
type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
type EventPriority = 'low' | 'medium' | 'high' | 'critical';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  location: string;
  organizer: string;
  targetClasses: string[];
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'staff';
  status: EventStatus;
  priority: EventPriority;
  isRecurring: boolean;
  recurrence: RecurrenceType;
  recurrenceEndDate: string;
  attachments: string[];
  reminders: number[];
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  branches: string[];
  batches: string[];
  students: string[];
  staffs: string[];
}

interface Branch {
  id: string;
  name: string;
}

interface Batch {
  id: string;
  name: string;
  branch: string;
  class: string;
  division: string;
}

interface Student {
  id: string;
  name: string;
  branch: string;
  batch: string;
  class: string;
  division: string;
  rollNo: string;
}

interface Staff {
  id: string;
  name: string;
  branches: string[];
  batches: string[];
  subject: string;
  designation: string;
}

interface MultiSelectOption {
  id: string;
  label: string;
  description?: string;
}

// ============ CONSTANTS ============
const EVENT_TYPES: {value: EventType;label: string;icon: any;color: string;}[] = [
{ value: 'exam', label: 'Examination', icon: BookOpenIcon, color: 'bg-red-100 text-red-700 border-red-200' },
{ value: 'holiday', label: 'Holiday', icon: PartyPopperIcon, color: 'bg-green-100 text-green-700 border-green-200' },
{ value: 'ptm', label: 'PTM / Meeting', icon: UsersIcon, color: 'bg-blue-100 text-blue-700 border-blue-200' },
{ value: 'sports', label: 'Sports Event', icon: TrophyIcon, color: 'bg-orange-100 text-orange-700 border-orange-200' },
{ value: 'cultural', label: 'Cultural Event', icon: PartyPopperIcon, color: 'bg-purple-100 text-purple-700 border-purple-200' },
{ value: 'academic', label: 'Academic', icon: GraduationCapIcon, color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
{ value: 'meeting', label: 'Staff Meeting', icon: UsersIcon, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
{ value: 'deadline', label: 'Deadline', icon: ClockIcon, color: 'bg-pink-100 text-pink-700 border-pink-200' },
{ value: 'other', label: 'Other', icon: CalendarIcon, color: 'bg-gray-100 text-gray-700 border-gray-200' }];


const STATUS_CONFIG: Record<EventStatus, {label: string;variant: 'success' | 'warning' | 'danger' | 'primary' | 'default';}> = {
  upcoming: { label: 'Upcoming', variant: 'primary' },
  ongoing: { label: 'Ongoing', variant: 'warning' },
  completed: { label: 'Completed', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
  postponed: { label: 'Postponed', variant: 'default' }
};

const PRIORITY_CONFIG: Record<EventPriority, {label: string;color: string;}> = {
  low: { label: 'Low', color: 'text-gray-500' },
  medium: { label: 'Medium', color: 'text-blue-500' },
  high: { label: 'High', color: 'text-orange-500' },
  critical: { label: 'Critical', color: 'text-red-500' }
};

const CLASSES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const MASTER_FRANCHISES = [
{ value: 'all', label: 'All Franchises' },
{ value: 'mf1', label: 'ABC Education Group' },
{ value: 'mf2', label: 'XYZ Learning Hub' },
{ value: 'mf3', label: 'PQR Academy Network' }];


const CENTRES = [
{ value: 'all', label: 'All Centres' },
{ value: 'c1', label: 'Main Campus' },
{ value: 'c2', label: 'North Branch' },
{ value: 'c3', label: 'South Branch' },
{ value: 'c4', label: 'East Wing' },
{ value: 'c5', label: 'West Campus' }];


// ============ MOCK DATA ============
const BRANCHES: Branch[] = [
{ id: 'b1', name: 'Main Campus' },
{ id: 'b2', name: 'North Branch' },
{ id: 'b3', name: 'South Branch' },
{ id: 'b4', name: 'East Wing' },
{ id: 'b5', name: 'West Campus' }];


const BATCHES: Batch[] = [
{ id: 'bt1', name: 'VI-A', branch: 'Main Campus', class: 'VI', division: 'A' },
{ id: 'bt2', name: 'VI-B', branch: 'Main Campus', class: 'VI', division: 'B' },
{ id: 'bt3', name: 'VII-A', branch: 'Main Campus', class: 'VII', division: 'A' },
{ id: 'bt4', name: 'VII-B', branch: 'North Branch', class: 'VII', division: 'B' },
{ id: 'bt5', name: 'VIII-A', branch: 'North Branch', class: 'VIII', division: 'A' },
{ id: 'bt6', name: 'VIII-B', branch: 'South Branch', class: 'VIII', division: 'B' },
{ id: 'bt7', name: 'IX-A', branch: 'South Branch', class: 'IX', division: 'A' },
{ id: 'bt8', name: 'IX-B', branch: 'East Wing', class: 'IX', division: 'B' },
{ id: 'bt9', name: 'X-A', branch: 'East Wing', class: 'X', division: 'A' },
{ id: 'bt10', name: 'X-B', branch: 'West Campus', class: 'X', division: 'B' },
{ id: 'bt11', name: 'XI-Science', branch: 'West Campus', class: 'XI', division: 'Science' },
{ id: 'bt12', name: 'XI-Commerce', branch: 'Main Campus', class: 'XI', division: 'Commerce' },
{ id: 'bt13', name: 'XII-Science', branch: 'North Branch', class: 'XII', division: 'Science' },
{ id: 'bt14', name: 'XII-Commerce', branch: 'South Branch', class: 'XII', division: 'Commerce' }];


const STUDENTS: Student[] = [
{ id: 's1', name: 'Aarav Patel', branch: 'Main Campus', batch: 'X-A', class: 'X', division: 'A', rollNo: '01' },
{ id: 's2', name: 'Priya Sharma', branch: 'Main Campus', batch: 'X-A', class: 'X', division: 'A', rollNo: '02' },
{ id: 's3', name: 'Rohan Gupta', branch: 'Main Campus', batch: 'IX-A', class: 'IX', division: 'A', rollNo: '03' },
{ id: 's4', name: 'Ananya Singh', branch: 'North Branch', batch: 'VIII-A', class: 'VIII', division: 'A', rollNo: '04' },
{ id: 's5', name: 'Vikram Reddy', branch: 'North Branch', batch: 'VII-B', class: 'VII', division: 'B', rollNo: '05' },
{ id: 's6', name: 'Sneha Kumar', branch: 'South Branch', batch: 'IX-A', class: 'IX', division: 'A', rollNo: '06' },
{ id: 's7', name: 'Arjun Verma', branch: 'South Branch', batch: 'VIII-B', class: 'VIII', division: 'B', rollNo: '07' },
{ id: 's8', name: 'Kavya Devi', branch: 'East Wing', batch: 'X-A', class: 'X', division: 'A', rollNo: '08' },
{ id: 's9', name: 'Rahul Mehta', branch: 'East Wing', batch: 'IX-B', class: 'IX', division: 'B', rollNo: '09' },
{ id: 's10', name: 'Ishita Jain', branch: 'West Campus', batch: 'XI-Science', class: 'XI', division: 'Science', rollNo: '10' },
{ id: 's11', name: 'Aditya Nair', branch: 'West Campus', batch: 'X-B', class: 'X', division: 'B', rollNo: '11' },
{ id: 's12', name: 'Meera Krishnan', branch: 'Main Campus', batch: 'VI-A', class: 'VI', division: 'A', rollNo: '12' },
{ id: 's13', name: 'Sanjay Rao', branch: 'Main Campus', batch: 'VI-B', class: 'VI', division: 'B', rollNo: '13' },
{ id: 's14', name: 'Divya Menon', branch: 'North Branch', batch: 'XII-Science', class: 'XII', division: 'Science', rollNo: '14' },
{ id: 's15', name: 'Karthik Iyer', branch: 'South Branch', batch: 'XII-Commerce', class: 'XII', division: 'Commerce', rollNo: '15' },
{ id: 's16', name: 'Neha Saxena', branch: 'Main Campus', batch: 'XI-Commerce', class: 'XI', division: 'Commerce', rollNo: '16' },
{ id: 's17', name: 'Amit Pandey', branch: 'North Branch', batch: 'VIII-A', class: 'VIII', division: 'A', rollNo: '17' },
{ id: 's18', name: 'Pooja Desai', branch: 'East Wing', batch: 'IX-B', class: 'IX', division: 'B', rollNo: '18' },
{ id: 's19', name: 'Varun Kapoor', branch: 'West Campus', batch: 'XI-Science', class: 'XI', division: 'Science', rollNo: '19' },
{ id: 's20', name: 'Shreya Bansal', branch: 'Main Campus', batch: 'VII-A', class: 'VII', division: 'A', rollNo: '20' }];


const STAFFS: Staff[] = [
{ id: 'st1', name: 'R. Sharma', branches: ['Main Campus', 'North Branch'], batches: ['X-A', 'IX-A', 'VIII-A'], subject: 'Mathematics', designation: 'Senior Teacher' },
{ id: 'st2', name: 'A. Gupta', branches: ['Main Campus', 'South Branch'], batches: ['X-A', 'IX-A', 'VIII-B'], subject: 'Science', designation: 'HOD Science' },
{ id: 'st3', name: 'M. Singh', branches: ['North Branch', 'East Wing'], batches: ['VII-B', 'IX-B', 'X-A'], subject: 'English', designation: 'Teacher' },
{ id: 'st4', name: 'S. Patel', branches: ['South Branch', 'West Campus'], batches: ['IX-A', 'X-B', 'XI-Science'], subject: 'Physics', designation: 'Senior Teacher' },
{ id: 'st5', name: 'P. Kumar', branches: ['East Wing', 'West Campus'], batches: ['IX-B', 'XI-Science', 'X-B'], subject: 'Chemistry', designation: 'Teacher' },
{ id: 'st6', name: 'V. Verma', branches: ['Main Campus'], batches: ['VI-A', 'VI-B', 'VII-A'], subject: 'Hindi', designation: 'Teacher' },
{ id: 'st7', name: 'K. Devi', branches: ['North Branch', 'South Branch'], batches: ['VIII-A', 'VIII-B', 'XII-Science', 'XII-Commerce'], subject: 'Biology', designation: 'HOD Biology' },
{ id: 'st8', name: 'D. Singh', branches: ['Main Campus', 'East Wing'], batches: ['XI-Commerce', 'X-A', 'IX-B'], subject: 'Commerce', designation: 'Teacher' },
{ id: 'st9', name: 'N. Reddy', branches: ['West Campus'], batches: ['X-B', 'XI-Science'], subject: 'Computer Science', designation: 'Teacher' },
{ id: 'st10', name: 'T. Krishnan', branches: ['Main Campus', 'North Branch', 'South Branch'], batches: ['VI-A', 'VII-B', 'VIII-B'], subject: 'Social Science', designation: 'Senior Teacher' }];


// ============ UTILITY FUNCTIONS ============
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const formatDateShort = (date: string) => new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
const formatTime = (time: string) => time ? new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : '';
const getDateString = (year: number, month: number, day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const isDateInRange = (date: string, start: string, end: string) => date >= start && date <= end;
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const getEventStatus = (event: CalendarEvent): EventStatus => {
  const today = new Date().toISOString().split('T')[0];
  if (event.status === 'cancelled' || event.status === 'postponed') return event.status;
  if (today < event.startDate) return 'upcoming';
  if (today > event.endDate) return 'completed';
  return 'ongoing';
};

const getEventTypeConfig = (type: EventType) => EVENT_TYPES.find((t) => t.value === type) || EVENT_TYPES[EVENT_TYPES.length - 1];

// ============ MULTI-SELECT DROPDOWN COMPONENT ============
interface MultiSelectDropdownProps {
  label: string;
  placeholder: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  searchable?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder,
  options,
  selected,
  onChange,
  icon,
  disabled = false,
  searchable = true,
  maxHeight = '250px',
  emptyMessage = 'No options available'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
  opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
  opt.description && opt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const selectAll = () => onChange(selected.length === options.length ? [] : options.map((o) => o.id));
  const clearAll = () => onChange([]);

  const selectedLabels = options.filter((o) => selected.includes(o.id)).map((o) => o.label);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-lg text-left transition-colors ${
        disabled ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-gray-400 cursor-pointer'} ${
        isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}>
        
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <span className="text-gray-400 flex-shrink-0">{icon}</span>}
          {selected.length === 0 ?
          <span className="text-gray-400 text-sm">{placeholder}</span> :
          selected.length <= 2 ?
          <div className="flex flex-wrap gap-1">
              {selectedLabels.map((lbl, idx) =>
            <Badge key={idx} variant="primary" className="text-xs">{lbl}</Badge>
            )}
            </div> :

          <Badge variant="primary" className="text-xs">{selected.length} selected</Badge>
          }
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen &&
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {searchable &&
        <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus />
            
              </div>
            </div>
        }
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
            <button type="button" onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              {selected.length === options.length ? 'Deselect All' : 'Select All'}
            </button>
            {selected.length > 0 &&
          <button type="button" onClick={clearAll} className="text-xs text-gray-500 hover:text-gray-700">
                Clear ({selected.length})
              </button>
          }
          </div>
          <div className="overflow-y-auto" style={{ maxHeight }}>
            {filteredOptions.length === 0 ?
          <div className="px-3 py-6 text-center text-gray-500 text-sm">{emptyMessage}</div> :

          filteredOptions.map((option) =>
          <div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
            selected.includes(option.id) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'}`
            }>
            
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
            selected.includes(option.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`
            }>
                    {selected.includes(option.id) && <CheckIcon className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${selected.includes(option.id) ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                      {option.label}
                    </p>
                    {option.description && <p className="text-xs text-gray-500 truncate">{option.description}</p>}
                  </div>
                </div>
          )
          }
          </div>
          {selected.length > 0 &&
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500">{selected.length} item(s) selected</p>
            </div>
        }
        </div>
      }
    </div>);

};

// ============ MOCK EVENTS ============
const INITIAL_EVENTS: CalendarEvent[] = [
{
  id: 'e1',
  title: 'Mid-Term Examinations',
  description: 'Mid-term examinations for all classes',
  type: 'exam',
  startDate: '2026-03-05',
  endDate: '2026-03-15',
  startTime: '09:00',
  endTime: '13:00',
  isAllDay: false,
  location: 'All Classrooms',
  organizer: 'Examination Cell',
  targetClasses: CLASSES,
  targetAudience: 'students',
  status: 'upcoming',
  priority: 'critical',
  isRecurring: false,
  recurrence: 'none',
  recurrenceEndDate: '',
  attachments: [],
  reminders: [1, 7],
  notes: 'Hall tickets will be issued 3 days before',
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: 'red',
  branches: ['Main Campus', 'North Branch'],
  batches: ['X-A', 'IX-A'],
  students: [],
  staffs: ['st1', 'st2']
},
{
  id: 'e2',
  title: 'Holi Holiday',
  description: 'School closed on account of Holi festival',
  type: 'holiday',
  startDate: '2026-03-20',
  endDate: '2026-03-20',
  startTime: '',
  endTime: '',
  isAllDay: true,
  location: '',
  organizer: 'Administration',
  targetClasses: [],
  targetAudience: 'all',
  status: 'upcoming',
  priority: 'medium',
  isRecurring: false,
  recurrence: 'none',
  recurrenceEndDate: '',
  attachments: [],
  reminders: [1],
  notes: '',
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: 'green',
  branches: [],
  batches: [],
  students: [],
  staffs: []
},
{
  id: 'e3',
  title: 'Parent Teacher Meeting',
  description: 'PTM for Classes I to V',
  type: 'ptm',
  startDate: '2026-03-28',
  endDate: '2026-03-28',
  startTime: '09:00',
  endTime: '14:00',
  isAllDay: false,
  location: 'Respective Classrooms',
  organizer: 'Academic Department',
  targetClasses: ['I', 'II', 'III', 'IV', 'V'],
  targetAudience: 'parents',
  status: 'upcoming',
  priority: 'high',
  isRecurring: false,
  recurrence: 'none',
  recurrenceEndDate: '',
  attachments: [],
  reminders: [1, 3, 7],
  notes: 'Progress reports will be distributed',
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: 'blue',
  branches: ['Main Campus'],
  batches: ['VI-A', 'VI-B'],
  students: ['s12', 's13'],
  staffs: ['st6']
},
{
  id: 'e4',
  title: 'New Academic Session Begins',
  description: 'Start of new academic year 2026-27',
  type: 'academic',
  startDate: '2026-04-04',
  endDate: '2026-04-04',
  startTime: '08:00',
  endTime: '',
  isAllDay: true,
  location: 'School Campus',
  organizer: 'Administration',
  targetClasses: [],
  targetAudience: 'all',
  status: 'upcoming',
  priority: 'critical',
  isRecurring: false,
  recurrence: 'none',
  recurrenceEndDate: '',
  attachments: [],
  reminders: [7, 14],
  notes: 'Special assembly scheduled',
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: 'indigo',
  branches: [],
  batches: [],
  students: [],
  staffs: []
},
{
  id: 'e5',
  title: 'Annual Sports Day',
  description: 'Annual sports and athletic meet',
  type: 'sports',
  startDate: '2026-04-15',
  endDate: '2026-04-16',
  startTime: '08:00',
  endTime: '17:00',
  isAllDay: false,
  location: 'Sports Ground',
  organizer: 'Sports Department',
  targetClasses: [],
  targetAudience: 'all',
  status: 'upcoming',
  priority: 'high',
  isRecurring: false,
  recurrence: 'none',
  recurrenceEndDate: '',
  attachments: [],
  reminders: [7, 14, 30],
  notes: 'Parents are invited',
  createdBy: 'Admin',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  color: 'orange',
  branches: [],
  batches: [],
  students: [],
  staffs: []
}];


// ============ MAIN COMPONENT ============
export function AcademicCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EventStatus | 'all'>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterMasterFranchise, setFilterMasterFranchise] = useState('all');
  const [filterCentre, setFilterCentre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'academic' as EventType,
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    isAllDay: false,
    location: '',
    organizer: '',
    targetClasses: [] as string[],
    targetAudience: 'all' as 'all' | 'students' | 'teachers' | 'parents' | 'staff',
    priority: 'medium' as EventPriority,
    isRecurring: false,
    recurrence: 'none' as RecurrenceType,
    recurrenceEndDate: '',
    notes: ''
  });

  // Multi-select states for form
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);

  // Filtered options based on selections
  const availableBatches = useMemo(() =>
  BATCHES.filter((batch) => selectedBranches.length === 0 || selectedBranches.includes(batch.branch)),
  [selectedBranches]
  );

  const availableStudents = useMemo(() =>
  STUDENTS.filter((student) => {
    const branchMatch = selectedBranches.length === 0 || selectedBranches.includes(student.branch);
    const batchMatch = selectedBatches.length === 0 || selectedBatches.includes(student.batch);
    return branchMatch && batchMatch;
  }),
  [selectedBranches, selectedBatches]
  );

  const availableStaffs = useMemo(() =>
  STAFFS.filter((staff) => {
    const branchMatch = selectedBranches.length === 0 || staff.branches.some((b) => selectedBranches.includes(b));
    const batchMatch = selectedBatches.length === 0 || staff.batches.some((b) => selectedBatches.includes(b));
    return branchMatch && batchMatch;
  }),
  [selectedBranches, selectedBatches]
  );

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    if (selectedBranches.length > 0) {
      const validBatches = BATCHES.filter((b) => selectedBranches.includes(b.branch)).map((b) => b.name);
      setSelectedBatches((prev) => prev.filter((b) => validBatches.includes(b)));
    }
  }, [selectedBranches]);

  useEffect(() => {
    const validStudentIds = availableStudents.map((s) => s.id);
    setSelectedStudents((prev) => prev.filter((id) => validStudentIds.includes(id)));
  }, [availableStudents]);

  useEffect(() => {
    const validStaffIds = availableStaffs.map((s) => s.id);
    setSelectedStaffs((prev) => prev.filter((id) => validStaffIds.includes(id)));
  }, [availableStaffs]);

  // Convert data for MultiSelectDropdown
  const branchOptions: MultiSelectOption[] = BRANCHES.map((b) => ({ id: b.name, label: b.name }));
  const batchOptions: MultiSelectOption[] = availableBatches.map((b) => ({
    id: b.name,
    label: b.name,
    description: `Class ${b.class}-${b.division} | ${b.branch}`
  }));
  const studentOptions: MultiSelectOption[] = availableStudents.map((s) => ({
    id: s.id,
    label: s.name,
    description: `Roll: ${s.rollNo} | ${s.batch} | ${s.branch}`
  }));
  const staffOptions: MultiSelectOption[] = availableStaffs.map((s) => ({
    id: s.id,
    label: s.name,
    description: `${s.subject} | ${s.designation}`
  }));

  const [academicYears] = useState<AcademicYear[]>([
  { id: 'ay1', name: '2025-26', startDate: '2025-04-01', endDate: '2026-03-31', isActive: true },
  { id: 'ay2', name: '2026-27', startDate: '2026-04-01', endDate: '2027-03-31', isActive: false }]
  );

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: {date: string;day: number;isCurrentMonth: boolean;isToday: boolean;}[] = [];

    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({ date: getDateString(prevYear, prevMonth, day), day, isCurrentMonth: false, isToday: false });
    }

    const todayStr = today.toISOString().split('T')[0];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = getDateString(currentYear, currentMonth, day);
      days.push({ date, day, isCurrentMonth: true, isToday: date === todayStr });
    }

    const remaining = 42 - days.length;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    for (let day = 1; day <= remaining; day++) {
      days.push({ date: getDateString(nextYear, nextMonth, day), day, isCurrentMonth: false, isToday: false });
    }

    return days;
  }, [currentMonth, currentYear]);

  const getEventsForDate = useCallback(
    (date: string) => events.filter((e) => isDateInRange(date, e.startDate, e.endDate) && e.status !== 'cancelled'),
    [events]
  );

  const filteredEvents = useMemo(() => {
    return events.
    filter((e) => {
      if (filterType !== 'all' && e.type !== filterType) return false;
      if (filterStatus !== 'all' && getEventStatus(e) !== filterStatus) return false;
      if (filterClass !== 'all' && e.targetClasses.length > 0 && !e.targetClasses.includes(filterClass)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q);
      }
      return true;
    }).
    sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, filterType, filterStatus, filterClass, searchQuery]);

  const upcomingEvents = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    return events.
    filter((e) => e.startDate >= todayStr && e.status !== 'cancelled').
    sort((a, b) => a.startDate.localeCompare(b.startDate)).
    slice(0, 10);
  }, [events]);

  const stats = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    const thisMonth = events.filter((e) => e.startDate.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`));
    return {
      totalEvents: events.length,
      upcomingCount: events.filter((e) => e.startDate >= todayStr && e.status !== 'cancelled').length,
      thisMonthCount: thisMonth.length,
      holidaysThisMonth: thisMonth.filter((e) => e.type === 'holiday').length,
      examsThisMonth: thisMonth.filter((e) => e.type === 'exam').length
    };
  }, [events, currentMonth, currentYear]);

  const navigateMonth = (delta: number) => {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) {newMonth = 11;newYear--;} else
    if (newMonth > 11) {newMonth = 0;newYear++;}
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'academic',
      startDate: selectedDate || '',
      endDate: '',
      startTime: '09:00',
      endTime: '17:00',
      isAllDay: false,
      location: '',
      organizer: '',
      targetClasses: [],
      targetAudience: 'all',
      priority: 'medium',
      isRecurring: false,
      recurrence: 'none',
      recurrenceEndDate: '',
      notes: ''
    });
    setSelectedBranches([]);
    setSelectedBatches([]);
    setSelectedStudents([]);
    setSelectedStaffs([]);
  };

  const openAddModal = (date?: string) => {
    resetForm();
    if (date) setFormData((p) => ({ ...p, startDate: date, endDate: date }));
    setShowAddModal(true);
  };

  const handleAddEvent = useCallback(() => {
    if (!formData.title || !formData.startDate) return;

    const newEvent: CalendarEvent = {
      id: generateId(),
      title: formData.title,
      description: formData.description,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate || formData.startDate,
      startTime: formData.isAllDay ? '' : formData.startTime,
      endTime: formData.isAllDay ? '' : formData.endTime,
      isAllDay: formData.isAllDay,
      location: formData.location,
      organizer: formData.organizer,
      targetClasses: formData.targetClasses,
      targetAudience: formData.targetAudience,
      status: 'upcoming',
      priority: formData.priority,
      isRecurring: formData.isRecurring,
      recurrence: formData.recurrence,
      recurrenceEndDate: formData.recurrenceEndDate,
      attachments: [],
      reminders: [1, 7],
      notes: formData.notes,
      createdBy: 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: getEventTypeConfig(formData.type).color.split(' ')[0].replace('bg-', '') || 'gray',
      branches: selectedBranches,
      batches: selectedBatches,
      students: selectedStudents,
      staffs: selectedStaffs
    };

    setEvents((prev) => [...prev, newEvent]);
    resetForm();
    setShowAddModal(false);
  }, [formData, selectedBranches, selectedBatches, selectedStudents, selectedStaffs]);

  const handleUpdateEvent = useCallback(() => {
    if (!editingEvent) return;
    setEvents((prev) =>
    prev.map((e) =>
    e.id === editingEvent.id ?
    {
      ...editingEvent,
      branches: selectedBranches,
      batches: selectedBatches,
      students: selectedStudents,
      staffs: selectedStaffs,
      updatedAt: new Date().toISOString()
    } :
    e
    )
    );
    setEditingEvent(null);
    resetForm();
  }, [editingEvent, selectedBranches, selectedBatches, selectedStudents, selectedStaffs]);

  const handleDeleteEvent = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      setShowDetailModal(null);
    }
  }, []);

  const handleCancelEvent = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, status: 'cancelled' as EventStatus } : e));
  }, []);

  const handleDuplicateEvent = useCallback((event: CalendarEvent) => {
    const newEvent = {
      ...event,
      id: generateId(),
      title: `${event.title} (Copy)`,
      status: 'upcoming' as EventStatus,
      createdAt: new Date().toISOString()
    };
    setEvents((prev) => [...prev, newEvent]);
  }, []);

  const toggleClassSelection = (cls: string) => {
    setFormData((p) => ({
      ...p,
      targetClasses: p.targetClasses.includes(cls) ?
      p.targetClasses.filter((c) => c !== cls) :
      [...p.targetClasses, cls]
    }));
  };

  const handleExport = useCallback(() => {
    const data = filteredEvents.map((e) => ({
      Title: e.title,
      Type: getEventTypeConfig(e.type).label,
      StartDate: formatDate(e.startDate),
      EndDate: formatDate(e.endDate),
      Time: e.isAllDay ? 'All Day' : `${formatTime(e.startTime)} - ${formatTime(e.endTime)}`,
      Location: e.location,
      Status: STATUS_CONFIG[getEventStatus(e)].label,
      Classes: e.targetClasses.join(', ') || 'All',
      Branches: e.branches.join(', ') || 'All'
    }));
    const csv = [Object.keys(data[0] || {}).join(','), ...data.map((row) => Object.values(row).map((v) => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic_calendar_${currentYear}_${currentMonth + 1}.csv`;
    a.click();
  }, [filteredEvents, currentYear, currentMonth]);

  const openEditModal = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedBranches(event.branches);
    setSelectedBatches(event.batches);
    setSelectedStudents(event.students);
    setSelectedStaffs(event.staffs);
    setShowDetailModal(null);
  };

  const clearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setFilterClass('all');
    setFilterMasterFranchise('all');
    setFilterCentre('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-sm text-gray-500">
            School-wide events, holidays, and academic milestones • {academicYears.find((y) => y.isActive)?.name}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <FilterIcon className="w-4 h-4 mr-1" /> Filters
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <DownloadIcon className="w-4 h-4 mr-1" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <PrinterIcon className="w-4 h-4 mr-1" /> Print
          </Button>
          <Button onClick={() => openAddModal()}>
            <PlusIcon className="w-4 h-4 mr-1" /> Add Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
        { value: stats.totalEvents, label: 'Total Events' },
        { value: stats.upcomingCount, label: 'Upcoming' },
        { value: stats.thisMonthCount, label: 'This Month' },
        { value: stats.holidaysThisMonth, label: 'Holidays (Month)' },
        { value: stats.examsThisMonth, label: 'Exams (Month)' }].
        map((s, i) =>
        <Card key={i}>
            <div className="p-3 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Filters */}
      {showFilters &&
      <Card>
          <div className="flex flex-wrap gap-4 p-4">
            <Select label="Master Franchise" value={filterMasterFranchise} onChange={setFilterMasterFranchise} options={MASTER_FRANCHISES} className="w-40" />
            <Select label="Centre" value={filterCentre} onChange={setFilterCentre} options={CENTRES} className="w-40" />
            <Select label="Event Type" value={filterType} onChange={(v) => setFilterType(v as any)} options={[{ value: 'all', label: 'All Types' }, ...EVENT_TYPES.map((t) => ({ value: t.value, label: t.label }))]} className="w-40" />
            <Select label="Status" value={filterStatus} onChange={(v) => setFilterStatus(v as any)} options={[{ value: 'all', label: 'All Status' }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))]} className="w-40" />
            <Select label="Class" value={filterClass} onChange={setFilterClass} options={[{ value: 'all', label: 'All Classes' }, ...CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))]} className="w-32" />
            <div className="flex-1 min-w-48">
              <Input placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} label="Search" />
            </div>
            <div className="flex items-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>Clear</Button>
            </div>
          </div>
        </Card>
      }

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}><ChevronLeftIcon className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}><ChevronRightIcon className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={goToToday}>Today</Button>
              </div>
              <h2 className="text-lg font-semibold">{MONTHS[currentMonth]} {currentYear}</h2>
              <div className="flex gap-1">
                {['month', 'week', 'list'].map((mode) =>
                <Button key={mode} variant={viewMode === mode ? 'primary' : 'ghost'} size="sm" onClick={() => setViewMode(mode as any)}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                )}
              </div>
            </div>

            {viewMode === 'month' &&
            <div className="p-4">
                <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  {DAYS.map((d) =>
                <div key={d} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-500">{d}</div>
                )}
                  {calendarDays.map((day, i) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isSelected = selectedDate === day.date;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(day.date)}
                      className={`bg-white min-h-[90px] p-1 border-t border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${!day.isCurrentMonth ? 'bg-gray-50/50' : ''} ${day.isToday ? 'bg-blue-50/50' : ''} ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                      
                        <div className="flex justify-between items-start">
                          <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${day.isToday ? 'bg-blue-600 text-white' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                            {day.day}
                          </span>
                          {dayEvents.length > 0 && <span className="text-[10px] text-gray-400">{dayEvents.length}</span>}
                        </div>
                        <div className="mt-1 space-y-0.5">
                          {dayEvents.slice(0, 2).map((ev) => {
                          const typeConfig = getEventTypeConfig(ev.type);
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {e.stopPropagation();setShowDetailModal(ev.id);}}
                              className={`p-0.5 px-1 text-[10px] leading-tight rounded truncate cursor-pointer hover:opacity-80 ${typeConfig.color}`}
                              title={ev.title}>
                              
                                {ev.title}
                              </div>);

                        })}
                          {dayEvents.length > 2 && <div className="text-[10px] text-gray-500 pl-1">+{dayEvents.length - 2} more</div>}
                        </div>
                      </div>);

                })}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  {EVENT_TYPES.slice(0, 6).map((type) =>
                <div key={type.value} className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded ${type.color.split(' ')[0]}`}></div>
                      <span>{type.label}</span>
                    </div>
                )}
                </div>
              </div>
            }

            {viewMode === 'list' &&
            <div className="p-4">
                {filteredEvents.length === 0 ?
              <p className="text-center text-gray-500 py-8">No events found</p> :

              <div className="space-y-2">
                    {filteredEvents.map((ev) => {
                  const typeConfig = getEventTypeConfig(ev.type);
                  const status = getEventStatus(ev);
                  const TypeIcon = typeConfig.icon;
                  return (
                    <div key={ev.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowDetailModal(ev.id)}>
                          <div className={`p-2 rounded-lg ${typeConfig.color}`}><TypeIcon className="w-5 h-5" /></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{ev.title}</h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(ev.startDate)}{ev.endDate !== ev.startDate && ` - ${formatDate(ev.endDate)}`} • {ev.isAllDay ? 'All Day' : `${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}`}
                            </p>
                          </div>
                          <Badge variant={STATUS_CONFIG[status].variant}>{STATUS_CONFIG[status].label}</Badge>
                        </div>);

                })}
                  </div>
              }
              </div>
            }

            {viewMode === 'week' &&
            <div className="p-4"><p className="text-center text-gray-500 py-8">Week view - Coming soon</p></div>
            }
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedDate &&
          <Card title={`Events on ${formatDate(selectedDate)}`}>
              <div className="space-y-2">
                {getEventsForDate(selectedDate).length === 0 ?
              <p className="text-sm text-gray-500 text-center py-4">No events on this date</p> :

              getEventsForDate(selectedDate).map((ev) => {
                const typeConfig = getEventTypeConfig(ev.type);
                return (
                  <div key={ev.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setShowDetailModal(ev.id)}>
                        <div className={`w-2 h-2 rounded-full ${typeConfig.color.split(' ')[0]}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{ev.title}</p>
                          <p className="text-xs text-gray-500">{ev.isAllDay ? 'All Day' : `${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}`}</p>
                        </div>
                      </div>);

              })
              }
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => openAddModal(selectedDate)}>
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Event
                </Button>
              </div>
            </Card>
          }

          <Card title="Upcoming Events">
            <div className="space-y-3">
              {upcomingEvents.length === 0 ?
              <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p> :

              upcomingEvents.map((ev) => {
                const typeConfig = getEventTypeConfig(ev.type);
                const dateParts = formatDateShort(ev.startDate).split(' ');
                return (
                  <div key={ev.id} className="flex gap-3 p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => setShowDetailModal(ev.id)}>
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-white rounded border border-gray-200 shrink-0">
                        <span className="text-xs text-gray-500 font-medium">{dateParts[1]}</span>
                        <span className="text-sm font-bold text-gray-900">{dateParts[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{ev.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {typeConfig.label} • {ev.targetClasses.length > 0 ? `Classes ${ev.targetClasses.slice(0, 3).join(', ')}${ev.targetClasses.length > 3 ? '...' : ''}` : 'All'}
                        </p>
                      </div>
                      {ev.isRecurring && <RepeatIcon className="w-4 h-4 text-gray-400 shrink-0" />}
                    </div>);

              })
              }
            </div>
          </Card>

          <Card title="Events by Type">
            <div className="space-y-2">
              {EVENT_TYPES.map((type) => {
                const count = events.filter((e) => e.type === type.value).length;
                if (count === 0) return null;
                return (
                  <div key={type.value} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${type.color.split(' ')[0]}`}></div>
                      <span className="text-sm">{type.label}</span>
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>);

              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || editingEvent) &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[95vh] flex flex-col">
            <div className="flex-none p-4 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
                <p className="text-sm text-gray-500">Fill in the event details below</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => {setShowAddModal(false);setEditingEvent(null);resetForm();}}>
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Basic Information
                </h4>
                <div className="space-y-4">
                  <Input
                  label="Event Title *"
                  value={editingEvent?.title || formData.title}
                  onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, title: e.target.value } : null) : setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Mid-Term Examinations" />
                
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                    label="Event Type *"
                    value={editingEvent?.type || formData.type}
                    onChange={(v) => editingEvent ? setEditingEvent((p) => p ? { ...p, type: v as EventType } : null) : setFormData((p) => ({ ...p, type: v as EventType }))}
                    options={EVENT_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
                  
                    <Select
                    label="Priority"
                    value={editingEvent?.priority || formData.priority}
                    onChange={(v) => editingEvent ? setEditingEvent((p) => p ? { ...p, priority: v as EventPriority } : null) : setFormData((p) => ({ ...p, priority: v as EventPriority }))}
                    options={Object.entries(PRIORITY_CONFIG).map(([v, c]) => ({ value: v, label: c.label }))} />
                  
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                    type="date"
                    label="Start Date *"
                    value={editingEvent?.startDate || formData.startDate}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, startDate: e.target.value } : null) : setFormData((p) => ({ ...p, startDate: e.target.value }))} />
                  
                    <Input
                    type="date"
                    label="End Date"
                    value={editingEvent?.endDate || formData.endDate}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, endDate: e.target.value } : null) : setFormData((p) => ({ ...p, endDate: e.target.value }))} />
                  
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                      type="checkbox"
                      checked={editingEvent?.isAllDay ?? formData.isAllDay}
                      onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, isAllDay: e.target.checked } : null) : setFormData((p) => ({ ...p, isAllDay: e.target.checked }))}
                      className="rounded" />
                    
                      <span className="text-sm">All Day Event</span>
                    </label>
                  </div>
                  {!(editingEvent?.isAllDay ?? formData.isAllDay) &&
                <div className="grid grid-cols-2 gap-4">
                      <Input
                    type="time"
                    label="Start Time"
                    value={editingEvent?.startTime || formData.startTime}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, startTime: e.target.value } : null) : setFormData((p) => ({ ...p, startTime: e.target.value }))} />
                  
                      <Input
                    type="time"
                    label="End Time"
                    value={editingEvent?.endTime || formData.endTime}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, endTime: e.target.value } : null) : setFormData((p) => ({ ...p, endTime: e.target.value }))} />
                  
                    </div>
                }
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                    label="Location"
                    value={editingEvent?.location || formData.location}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, location: e.target.value } : null) : setFormData((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Main Hall / Classroom" />
                  
                    <Input
                    label="Organizer"
                    value={editingEvent?.organizer || formData.organizer}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, organizer: e.target.value } : null) : setFormData((p) => ({ ...p, organizer: e.target.value }))}
                    placeholder="Academic Department" />
                  
                  </div>
                </div>
              </div>

              {/* Target Selection */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <UsersIcon className="w-4 h-4" /> Target Selection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MultiSelectDropdown
                  label="Branches"
                  placeholder="Select branches..."
                  options={branchOptions}
                  selected={selectedBranches}
                  onChange={setSelectedBranches}
                  icon={<BuildingIcon className="w-4 h-4" />} />
                
                  <MultiSelectDropdown
                  label="Batches / Classes"
                  placeholder={selectedBranches.length === 0 ? 'Select branches first...' : 'Select batches...'}
                  options={batchOptions}
                  selected={selectedBatches}
                  onChange={setSelectedBatches}
                  icon={<GraduationCapIcon className="w-4 h-4" />}
                  emptyMessage={selectedBranches.length === 0 ? 'Select branches to see available batches' : 'No batches available'} />
                
                  <MultiSelectDropdown
                  label="Students"
                  placeholder={selectedBatches.length === 0 ? 'Select batches first...' : 'Select students...'}
                  options={studentOptions}
                  selected={selectedStudents}
                  onChange={setSelectedStudents}
                  icon={<UserIcon className="w-4 h-4" />}
                  maxHeight="200px"
                  emptyMessage="No students available for selected filters" />
                
                  <MultiSelectDropdown
                  label="Staff / Teachers"
                  placeholder="Select staff members..."
                  options={staffOptions}
                  selected={selectedStaffs}
                  onChange={setSelectedStaffs}
                  icon={<UsersIcon className="w-4 h-4" />}
                  maxHeight="200px"
                  emptyMessage="No staff available for selected filters" />
                
                </div>

                {/* Selection Summary */}
                {(selectedBranches.length > 0 || selectedBatches.length > 0 || selectedStudents.length > 0 || selectedStaffs.length > 0) &&
              <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                    <h5 className="text-xs font-semibold text-gray-500 uppercase mb-2">Selection Summary</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedBranches.length > 0 && <Badge variant="outline"><BuildingIcon className="w-3 h-3 mr-1" />{selectedBranches.length} Branch(es)</Badge>}
                      {selectedBatches.length > 0 && <Badge variant="outline"><GraduationCapIcon className="w-3 h-3 mr-1" />{selectedBatches.length} Batch(es)</Badge>}
                      {selectedStudents.length > 0 && <Badge variant="primary"><UserIcon className="w-3 h-3 mr-1" />{selectedStudents.length} Student(s)</Badge>}
                      {selectedStaffs.length > 0 && <Badge variant="success"><UsersIcon className="w-3 h-3 mr-1" />{selectedStaffs.length} Staff</Badge>}
                    </div>
                  </div>
              }
              </div>

              {/* Target Classes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <GraduationCapIcon className="w-4 h-4" /> Target Classes & Audience
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Classes (leave empty for all)</label>
                    <div className="flex flex-wrap gap-2">
                      {CLASSES.map((cls) => {
                      const selected = editingEvent ? editingEvent.targetClasses.includes(cls) : formData.targetClasses.includes(cls);
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            if (editingEvent) {
                              setEditingEvent((p) => p ? { ...p, targetClasses: selected ? p.targetClasses.filter((c) => c !== cls) : [...p.targetClasses, cls] } : null);
                            } else {
                              toggleClassSelection(cls);
                            }
                          }}
                          className={`px-3 py-1.5 text-sm rounded border ${selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-200'}`}>
                          
                            {cls}
                          </button>);

                    })}
                    </div>
                  </div>
                  <Select
                  label="Target Audience"
                  value={editingEvent?.targetAudience || formData.targetAudience}
                  onChange={(v) => editingEvent ? setEditingEvent((p) => p ? { ...p, targetAudience: v as any } : null) : setFormData((p) => ({ ...p, targetAudience: v as any }))}
                  options={[
                  { value: 'all', label: 'Everyone' },
                  { value: 'students', label: 'Students Only' },
                  { value: 'teachers', label: 'Teachers Only' },
                  { value: 'parents', label: 'Parents Only' },
                  { value: 'staff', label: 'Staff Only' }]
                  } />
                
                </div>
              </div>

              {/* Recurrence */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <RepeatIcon className="w-4 h-4" /> Recurrence
                </h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                    type="checkbox"
                    checked={editingEvent?.isRecurring ?? formData.isRecurring}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, isRecurring: e.target.checked } : null) : setFormData((p) => ({ ...p, isRecurring: e.target.checked }))}
                    className="rounded" />
                  
                    <span className="text-sm">Recurring Event</span>
                  </label>
                  {(editingEvent?.isRecurring ?? formData.isRecurring) &&
                <div className="grid grid-cols-2 gap-4">
                      <Select
                    label="Recurrence Pattern"
                    value={editingEvent?.recurrence || formData.recurrence}
                    onChange={(v) => editingEvent ? setEditingEvent((p) => p ? { ...p, recurrence: v as RecurrenceType } : null) : setFormData((p) => ({ ...p, recurrence: v as RecurrenceType }))}
                    options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                    { value: 'yearly', label: 'Yearly' }]
                    } />
                  
                      <Input
                    type="date"
                    label="Recurrence End Date"
                    value={editingEvent?.recurrenceEndDate || formData.recurrenceEndDate}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, recurrenceEndDate: e.target.value } : null) : setFormData((p) => ({ ...p, recurrenceEndDate: e.target.value }))} />
                  
                    </div>
                }
                </div>
              </div>

              {/* Description & Notes */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <BookOpenIcon className="w-4 h-4" /> Description & Notes
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                    value={editingEvent?.description || formData.description}
                    onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, description: e.target.value } : null) : setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Event description..."
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3} />
                  
                  </div>
                  <Input
                  label="Notes"
                  value={editingEvent?.notes || formData.notes}
                  onChange={(e) => editingEvent ? setEditingEvent((p) => p ? { ...p, notes: e.target.value } : null) : setFormData((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Additional notes" />
                
                </div>
              </div>
            </div>
            
            <div className="flex-none p-4 border-t flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-500">
                {selectedBranches.length === 0 && selectedBatches.length === 0 && selectedStudents.length === 0 &&
              <span className="text-amber-600 flex items-center gap-1">
                    <AlertTriangleIcon className="w-4 h-4" /> No specific selection - will apply to all
                  </span>
              }
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {setShowAddModal(false);setEditingEvent(null);resetForm();}}>Cancel</Button>
                <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent}>
                  <CheckIcon className="w-4 h-4 mr-1" />
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Event Detail Modal */}
      {showDetailModal && (() => {
        const event = events.find((e) => e.id === showDetailModal);
        if (!event) return null;
        const typeConfig = getEventTypeConfig(event.type);
        const TypeIcon = typeConfig.icon;
        const status = getEventStatus(event);
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className={`p-4 ${typeConfig.color} rounded-t-lg`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <TypeIcon className="w-6 h-6" />
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm opacity-80">{typeConfig.label}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(null)}><XIcon className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_CONFIG[status].variant}>{STATUS_CONFIG[status].label}</Badge>
                  <Badge variant="default">{PRIORITY_CONFIG[event.priority].label} Priority</Badge>
                  {event.isRecurring && <Badge variant="primary"><RepeatIcon className="w-3 h-3 mr-1" />{event.recurrence}</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(event.startDate)}{event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-medium">{event.isAllDay ? 'All Day' : `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`}</p>
                    </div>
                  </div>
                </div>

                {event.location &&
                <div className="flex items-center gap-2 text-sm">
                    <MapPinIcon className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                }

                {event.branches.length > 0 &&
                <div className="text-sm">
                    <p className="text-gray-500 mb-1">Branches</p>
                    <div className="flex flex-wrap gap-1">
                      {event.branches.map((b) => <Badge key={b} variant="outline">{b}</Badge>)}
                    </div>
                  </div>
                }

                {event.batches.length > 0 &&
                <div className="text-sm">
                    <p className="text-gray-500 mb-1">Batches</p>
                    <div className="flex flex-wrap gap-1">
                      {event.batches.map((b) => <Badge key={b} variant="outline">{b}</Badge>)}
                    </div>
                  </div>
                }

                {event.staffs.length > 0 &&
                <div className="text-sm">
                    <p className="text-gray-500 mb-1">Assigned Staff</p>
                    <div className="flex flex-wrap gap-1">
                      {event.staffs.map((sId) => {
                      const staff = STAFFS.find((s) => s.id === sId);
                      return staff ? <Badge key={sId} variant="primary">{staff.name}</Badge> : null;
                    })}
                    </div>
                  </div>
                }

                <div className="text-sm">
                  <p className="text-gray-500 mb-1">Target</p>
                  <p className="font-medium">
                    {event.targetClasses.length > 0 ? `Classes: ${event.targetClasses.join(', ')}` : 'All Classes'} • {event.targetAudience.charAt(0).toUpperCase() + event.targetAudience.slice(1)}
                  </p>
                </div>

                {event.description &&
                <div className="text-sm">
                    <p className="text-gray-500 mb-1">Description</p>
                    <p>{event.description}</p>
                  </div>
                }

                {event.notes &&
                <div className="text-sm">
                    <p className="text-gray-500 mb-1">Notes</p>
                    <p className="text-gray-600">{event.notes}</p>
                  </div>
                }

                <div className="text-xs text-gray-400 pt-2 border-t">
                  Created: {formatDate(event.createdAt)} by {event.createdBy} • Updated: {formatDate(event.updatedAt)}
                </div>
              </div>
              <div className="p-4 border-t flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  {status !== 'cancelled' && status !== 'completed' &&
                  <Button variant="outline" size="sm" onClick={() => handleCancelEvent(event.id)}>
                      <XIcon className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  }
                  <Button variant="outline" size="sm" onClick={() => handleDuplicateEvent(event)}>
                    <CopyIcon className="w-4 h-4 mr-1" /> Duplicate
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                    <TrashIcon className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button size="sm" onClick={() => openEditModal(event)}>
                    <EditIcon className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </div>
              </div>
            </Card>
          </div>);

      })()}
    </div>);

}