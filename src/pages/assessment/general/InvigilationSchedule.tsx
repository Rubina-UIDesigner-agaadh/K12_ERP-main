import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  Fragment,
  createElement,
  Component } from
'react';
import {
  Calendar,
  Users,
  MapPin,
  AlertTriangle,
  Bell,
  Download,
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  History,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Printer,
  X,
  ChevronDown,
  Building,
  BookOpen,
  User,
  Check,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  Send,
  Layers,
  GraduationCap,
  CalendarDays,
  UserCheck,
  UserPlus,
  Info,
  Zap,
  ClipboardList,
  Lightbulb,
  School,
  DoorOpen,
  LayoutGrid,
  Table,
  Star,
  AlertOctagon,
  Activity,
  TrendingUp,
  BookMarked,
  Mail,
  Flag,
  Settings,
  FileDown,
  List,
  ArrowRight } from
'lucide-react';
// Types
interface Staff {
  id: string;
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  gender: 'Male' | 'Female';
  status: 'Active' | 'On Leave' | 'Inactive';
  leaveDetails?: {
    type: string;
    from: string;
    to: string;
  };
  totalDutiesAssigned: number;
  maxDutiesAllowed: number;
  rating: number;
}
interface ExamHall {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  capacity: number;
  facilities: string[];
  status: 'Available' | 'Under Maintenance';
}
interface Exam {
  id: string;
  name: string;
  code: string;
  class: string;
  section: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  totalStudents: number;
  examType: 'Theory' | 'Practical';
}
interface InvigilationDuty {
  id: string;
  exam: Exam;
  hall: ExamHall;
  staff: Staff[];
  date: string;
  startTime: string;
  endTime: string;
  reportingTime: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  remarks: string;
  priority: 'Normal' | 'High' | 'Critical';
}
interface Conflict {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  staffId: string;
  staffName: string;
  description: string;
  affectedDuties: string[];
  suggestions: string[];
  resolved: boolean;
}
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}
// Constants
const departments = [
'Science',
'Mathematics',
'Languages',
'Social Science',
'Computer Science',
'Commerce'];

const designations = [
'PGT',
'TGT',
'PRT',
'Head of Department',
'Senior Teacher'];

// Mock Data Generators
const generateStaff = (): Staff[] => {
  const names = [
  'Rajesh Sharma',
  'Sunita Verma',
  'Amit Gupta',
  'Priya Singh',
  'Suresh Kumar',
  'Kavita Patel',
  'Ramesh Reddy',
  'Anita Nair',
  'Vikram Iyer',
  'Neeta Chopra',
  'Mahesh Malhotra',
  'Geeta Kapoor',
  'Dinesh Joshi',
  'Meena Menon',
  'Prakash Das',
  'Seema Banerjee',
  'Arun Sharma',
  'Rekha Verma',
  'Vijay Gupta',
  'Suman Singh',
  'Rakesh Kumar',
  'Pooja Patel',
  'Manish Reddy',
  'Nisha Nair'];

  return names.map((name, i) => {
    const [firstName, lastName] = name.split(' ');
    const isOnLeave = Math.random() > 0.88;
    return {
      id: `STF${1001 + i}`,
      empId: `EMP${5001 + i}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`,
      phone: `9${Math.floor(Math.random() * 900000000) + 100000000}`,
      department: departments[i % departments.length],
      designation: designations[i % designations.length],
      gender: i % 3 === 0 ? 'Female' : 'Male',
      status: isOnLeave ? 'On Leave' : i > 21 ? 'Inactive' : 'Active',
      leaveDetails: isOnLeave ?
      {
        type: 'Sick Leave',
        from: '2024-03-15',
        to: '2024-03-17'
      } :
      undefined,
      totalDutiesAssigned: Math.floor(Math.random() * 8),
      maxDutiesAllowed: 10,
      rating: Math.floor(Math.random() * 2) + 4
    };
  });
};
const generateHalls = (): ExamHall[] => [
{
  id: 'H1',
  name: 'Examination Hall A',
  code: 'EH-A',
  building: 'Main Building',
  floor: 'Ground Floor',
  capacity: 50,
  facilities: ['AC', 'CCTV'],
  status: 'Available'
},
{
  id: 'H2',
  name: 'Examination Hall B',
  code: 'EH-B',
  building: 'Main Building',
  floor: 'First Floor',
  capacity: 45,
  facilities: ['AC', 'CCTV', 'Projector'],
  status: 'Available'
},
{
  id: 'H3',
  name: 'Science Lab Hall',
  code: 'SL-H',
  building: 'Science Block',
  floor: 'Ground Floor',
  capacity: 30,
  facilities: ['AC'],
  status: 'Under Maintenance'
},
{
  id: 'H4',
  name: 'Computer Lab',
  code: 'CL-1',
  building: 'Science Block',
  floor: 'First Floor',
  capacity: 35,
  facilities: ['AC', 'CCTV'],
  status: 'Available'
},
{
  id: 'H5',
  name: 'Auditorium',
  code: 'AUD',
  building: 'Main Building',
  floor: 'Ground Floor',
  capacity: 200,
  facilities: ['AC', 'CCTV', 'PA System'],
  status: 'Available'
},
{
  id: 'H6',
  name: 'Conference Hall',
  code: 'CNF',
  building: 'Main Building',
  floor: 'Second Floor',
  capacity: 60,
  facilities: ['AC', 'Projector'],
  status: 'Available'
}];

const generateExams = (): Exam[] => {
  const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Computer Science',
  'Social Studies'];

  const classes = ['IX', 'X', 'XI', 'XII'];
  const sections = ['A', 'B', 'C'];
  const dates = [
  '2024-03-15',
  '2024-03-16',
  '2024-03-18',
  '2024-03-19',
  '2024-03-20'];

  const exams: Exam[] = [];
  let id = 1;
  dates.forEach((date) => {
    subjects.slice(0, 4).forEach((subject, idx) => {
      classes.forEach((cls) => {
        sections.slice(0, 2).forEach((sec) => {
          exams.push({
            id: `EXM${String(id++).padStart(4, '0')}`,
            name: `Annual Exam - ${subject}`,
            code: `AE24-${subject.slice(0, 3).toUpperCase()}-${cls}-${sec}`,
            class: cls,
            section: sec,
            subject,
            date,
            startTime: idx % 2 === 0 ? '09:00' : '14:00',
            endTime: idx % 2 === 0 ? '12:00' : '17:00',
            duration: '3 hours',
            totalStudents: Math.floor(Math.random() * 25) + 30,
            examType: idx % 5 === 0 ? 'Practical' : 'Theory'
          });
        });
      });
    });
  });
  return exams;
};
const mockStaff = generateStaff();
const mockHalls = generateHalls();
const mockExams = generateExams();
const generateDuties = (): InvigilationDuty[] =>
mockExams.slice(0, 6).map((exam, i) => ({
  id: `DTY${String(i + 1).padStart(4, '0')}`,
  exam,
  hall: mockHalls[i % mockHalls.length],
  staff: [mockStaff[i], mockStaff[i + 1]].filter(Boolean),
  date: exam.date,
  startTime: exam.startTime,
  endTime: exam.endTime,
  reportingTime: exam.startTime === '09:00' ? '08:30' : '13:30',
  status: i === 0 ? 'In Progress' : i === 5 ? 'Completed' : 'Scheduled',
  createdAt: new Date().toISOString(),
  remarks: '',
  priority: i % 3 === 0 ? 'High' : 'Normal'
}));
// Components
const Card: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) =>
<div
  className={`bg-white rounded-xl border border-gray-200 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-all' : ''} ${className}`}
  onClick={onClick}>

    {children}
  </div>;

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  loading?: boolean;
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  onClick,
  loading
}) => {
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  const sizes: Record<string, string> = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2'
  };
  return (
    <button
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}>

      {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
      {children}
    </button>);

};
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: string;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
}> = ({ children, variant = 'default', className = '', dot, pulse }) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  const dots: Record<string, string> = {
    default: 'bg-gray-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500'
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>

      {dot &&
      <span
        className={`w-1.5 h-1.5 rounded-full ${dots[variant] || dots.default} ${pulse ? 'animate-pulse' : ''}`} />

      }
      {children}
    </span>);

};
const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: {
    value: string;
    label: string;
  }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled
}) =>
<div className="relative">
    <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none cursor-pointer ${className}`}>

      <option value="">{placeholder}</option>
      {options.map((o) =>
    <option key={o.value} value={o.value}>
          {o.label}
        </option>
    )}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>;

const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  icon?: React.ReactNode;
}> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  icon
}) =>
<div className="relative">
    {icon &&
  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
  }
    <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${icon ? 'pl-10' : ''} ${className}`} />

  </div>;

const Checkbox: React.FC<{
  checked: boolean;
  onChange: (c: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label }) =>
<label className="inline-flex items-center gap-2 cursor-pointer">
    <div
    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>

      {checked && <Check className="w-3 h-3 text-white" />}
    </div>
    {label && <span className="text-sm text-gray-700">{label}</span>}
    <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="sr-only" />

  </label>;

const ToastContainer: React.FC<{
  toasts: Toast[];
  remove: (id: string) => void;
}> = ({ toasts, remove }) =>
<div className="fixed bottom-4 right-4 z-50 space-y-2">
    {toasts.map((t) =>
  <div
    key={t.id}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : t.type === 'warning' ? 'bg-amber-500' : 'bg-blue-600'}`}>

        {t.type === 'success' ?
    <CheckCircle2 className="w-5 h-5" /> :
    t.type === 'error' ?
    <X className="w-5 h-5" /> :

    <Info className="w-5 h-5" />
    }
        <span className="text-sm font-medium">{t.message}</span>
        <button onClick={() => remove(t.id)} className="ml-2 hover:opacity-80">
          <X className="w-4 h-4" />
        </button>
      </div>
  )}
  </div>;

const StepIndicator: React.FC<{
  steps: {
    id: number;
    title: string;
    icon: React.ElementType;
  }[];
  current: number;
  onClick?: (s: number) => void;
}> = ({ steps, current, onClick }) =>
<div className="flex items-center justify-between">
    {steps.map((step, i) =>
  <Fragment key={step.id}>
        <button
      onClick={() => onClick && current > step.id && onClick(step.id)}
      disabled={current < step.id}
      className={`flex items-center gap-3 ${current > step.id ? 'cursor-pointer' : current < step.id ? 'cursor-not-allowed' : ''}`}>

          <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${current > step.id ? 'bg-green-500 text-white shadow-lg' : current === step.id ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' : 'bg-gray-200 text-gray-500'}`}>

            {current > step.id ?
        <Check className="w-6 h-6" /> :

        <step.icon className="w-5 h-5" />
        }
          </div>
          <span
        className={`hidden md:block text-sm font-semibold ${current >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>

            {step.title}
          </span>
        </button>
        {i < steps.length - 1 &&
    <div
      className={`flex-1 h-1 mx-4 rounded-full ${current > step.id ? 'bg-green-500' : 'bg-gray-200'}`} />

    }
      </Fragment>
  )}
  </div>;

const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  variant?: 'danger' | 'warning' | 'info';
}> = ({ isOpen, onClose, onConfirm, title, message, variant = 'info' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${variant === 'danger' ? 'bg-red-100 text-red-600' : variant === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>

          {variant === 'danger' ?
          <Trash2 className="w-6 h-6" /> :

          <AlertTriangle className="w-6 h-6" />
          }
        </div>
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}>

            Confirm
          </Button>
        </div>
      </div>
    </div>);

};
// Main Component
export function InvigilationSchedule() {
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'create' | 'conflicts' | 'halltickets' | 'reports'>(
    'schedule');
  const [duties, setDuties] = useState<InvigilationDuty[]>(generateDuties());
  const [selectedDate, setSelectedDate] = useState('2024-03-15');
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'timeline'>(
    'table'
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExamDate, setSelectedExamDate] = useState('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [selectedHall, setSelectedHall] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<Staff[]>([]);
  const [assignmentDetails, setAssignmentDetails] = useState({
    reportingTime: '',
    remarks: '',
    priority: 'Normal' as const,
    notifyStaff: true
  });
  const [scheduleFilters, setScheduleFilters] = useState({
    search: '',
    status: ''
  });
  const [staffSearch, setStaffSearch] = useState('');
  const [staffFilters, setStaffFilters] = useState({
    department: '',
    availableOnly: true,
    sortBy: 'name' as const
  });
  const [ticketSearch, setTicketSearch] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showHallTicketModal, setShowHallTicketModal] = useState(false);
  const [selectedStaffForTicket, setSelectedStaffForTicket] =
  useState<Staff | null>(null);
  const [showDutyModal, setShowDutyModal] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<InvigilationDuty | null>(
    null
  );
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    variant: 'info' as const
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resolvedConflicts, setResolvedConflicts] = useState<string[]>([]);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [conflictToResolve, setConflictToResolve] = useState<Conflict | null>(
    null
  );
  const [replacementStaff, setReplacementStaff] = useState<Staff | null>(null);
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((p) => [
    ...p,
    {
      id,
      type,
      message
    }]
    );
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const steps = [
  {
    id: 1,
    title: 'Select Exam',
    icon: BookOpen
  },
  {
    id: 2,
    title: 'Select Hall',
    icon: DoorOpen
  },
  {
    id: 3,
    title: 'Assign Staff',
    icon: Users
  },
  {
    id: 4,
    title: 'Review',
    icon: CheckCircle2
  }];

  const availableDates = useMemo(
    () => [...new Set(mockExams.map((e) => e.date))].sort(),
    []
  );
  const filteredExamsByDate = useMemo(
    () =>
    selectedExamDate ?
    mockExams.filter((e) => e.date === selectedExamDate) :
    [],
    [selectedExamDate]
  );
  const filteredStaff = useMemo(() => {
    let f = [...mockStaff];
    if (staffSearch) {
      const q = staffSearch.toLowerCase();
      f = f.filter(
        (s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.empId.toLowerCase().includes(q)
      );
    }
    if (staffFilters.department)
    f = f.filter((s) => s.department === staffFilters.department);
    if (staffFilters.availableOnly) f = f.filter((s) => s.status === 'Active');
    if (staffFilters.sortBy === 'duties')
    f.sort((a, b) => a.totalDutiesAssigned - b.totalDutiesAssigned);else
    if (staffFilters.sortBy === 'rating')
    f.sort((a, b) => b.rating - a.rating);
    return f;
  }, [staffSearch, staffFilters]);
  const filteredDuties = useMemo(() => {
    let f = duties;
    if (selectedDate) f = f.filter((d) => d.date === selectedDate);
    if (scheduleFilters.search) {
      const q = scheduleFilters.search.toLowerCase();
      f = f.filter(
        (d) =>
        d.exam.subject.toLowerCase().includes(q) ||
        d.hall.name.toLowerCase().includes(q) ||
        d.staff.some((s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
        )
      );
    }
    if (scheduleFilters.status)
    f = f.filter((d) => d.status === scheduleFilters.status);
    return f;
  }, [duties, selectedDate, scheduleFilters]);
  const conflicts = useMemo((): Conflict[] => {
    const c: Conflict[] = [];
    const map = new Map<string, InvigilationDuty[]>();
    duties.forEach((d) =>
    d.staff.forEach((s) => map.set(s.id, [...(map.get(s.id) || []), d]))
    );
    map.forEach((staffDuties, staffId) => {
      for (let i = 0; i < staffDuties.length; i++) {
        for (let j = i + 1; j < staffDuties.length; j++) {
          if (
          staffDuties[i].date === staffDuties[j].date &&
          staffDuties[i].startTime === staffDuties[j].startTime)
          {
            const staff = mockStaff.find((s) => s.id === staffId);
            const conflictId = `C-DB-${staffId}-${staffDuties[i].id}-${staffDuties[j].id}`;
            if (!resolvedConflicts.includes(conflictId)) {
              c.push({
                id: conflictId,
                type: 'Double Booking',
                severity: 'High',
                staffId,
                staffName: staff ?
                `${staff.firstName} ${staff.lastName}` :
                'Unknown',
                description: `Assigned to ${staffDuties[i].hall.name} and ${staffDuties[j].hall.name} at same time on ${staffDuties[i].date}`,
                affectedDuties: [staffDuties[i].id, staffDuties[j].id],
                suggestions: ['Replace staff in one duty', 'Change timing'],
                resolved: false
              });
            }
          }
        }
      }
      const staff = mockStaff.find((s) => s.id === staffId);
      if (staff?.status === 'On Leave' && staff.leaveDetails) {
        staffDuties.forEach((d) => {
          if (
          d.date >= staff.leaveDetails!.from &&
          d.date <= staff.leaveDetails!.to)
          {
            const conflictId = `C-OL-${staffId}-${d.id}`;
            if (!resolvedConflicts.includes(conflictId)) {
              c.push({
                id: conflictId,
                type: 'On Leave',
                severity: 'High',
                staffId,
                staffName: `${staff.firstName} ${staff.lastName}`,
                description: `Staff is on ${staff.leaveDetails!.type} from ${staff.leaveDetails!.from} to ${staff.leaveDetails!.to}`,
                affectedDuties: [d.id],
                suggestions: ['Replace with available staff'],
                resolved: false
              });
            }
          }
        });
      }
      if (staff && staffDuties.length > staff.maxDutiesAllowed) {
        const conflictId = `C-MD-${staffId}`;
        if (!resolvedConflicts.includes(conflictId)) {
          c.push({
            id: conflictId,
            type: 'Max Duties Exceeded',
            severity: 'Medium',
            staffId,
            staffName: `${staff.firstName} ${staff.lastName}`,
            description: `Assigned ${staffDuties.length} duties, exceeds maximum limit of ${staff.maxDutiesAllowed}`,
            affectedDuties: staffDuties.map((d) => d.id),
            suggestions: ['Redistribute duties to other staff'],
            resolved: false
          });
        }
      }
    });
    return c;
  }, [duties, resolvedConflicts]);
  const stats = useMemo(
    () => ({
      totalDuties: duties.length,
      assignedStaff: new Set(duties.flatMap((d) => d.staff.map((s) => s.id))).
      size,
      totalHalls: new Set(duties.map((d) => d.hall.id)).size,
      pendingDuties: duties.filter((d) => d.status === 'Scheduled').length,
      inProgress: duties.filter((d) => d.status === 'In Progress').length,
      completed: duties.filter((d) => d.status === 'Completed').length,
      conflicts: conflicts.length,
      availableStaff: mockStaff.filter((s) => s.status === 'Active').length,
      availableHalls: mockHalls.filter((h) => h.status === 'Available').length
    }),
    [duties, conflicts]
  );
  const getStaffDuties = (staffId: string) =>
  duties.filter((d) => d.staff.some((s) => s.id === staffId));
  const getSeverityBadge = (s: string) =>
  s === 'High' ? 'danger' : s === 'Medium' ? 'warning' : 'info';
  const handleAddStaff = (staff: Staff) => {
    if (!selectedStaff.find((s) => s.id === staff.id)) {
      setSelectedStaff([...selectedStaff, staff]);
      addToast('success', `${staff.firstName} ${staff.lastName} added`);
    }
  };
  const handleRemoveStaff = (id: string) => {
    const s = selectedStaff.find((x) => x.id === id);
    setSelectedStaff(selectedStaff.filter((x) => x.id !== id));
    if (s) addToast('info', `${s.firstName} ${s.lastName} removed`);
  };
  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    addToast(
      'info',
      `Selected: ${exam.subject} - Class ${exam.class}-${exam.section}`
    );
  };
  const handleCreateAssignment = () => {
    if (!selectedExam || !selectedHall || selectedStaff.length === 0) {
      addToast('error', 'Please complete all required fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const newDuty: InvigilationDuty = {
        id: `DTY${String(duties.length + 1).padStart(4, '0')}`,
        exam: selectedExam,
        hall: mockHalls.find((h) => h.id === selectedHall)!,
        staff: selectedStaff,
        date: selectedExam.date,
        startTime: selectedExam.startTime,
        endTime: selectedExam.endTime,
        reportingTime:
        assignmentDetails.reportingTime || (
        selectedExam.startTime === '09:00' ? '08:30' : '13:30'),
        status: 'Scheduled',
        createdAt: new Date().toISOString(),
        remarks: assignmentDetails.remarks,
        priority: assignmentDetails.priority
      };
      setDuties([...duties, newDuty]);
      resetForm();
      setIsLoading(false);
      addToast('success', 'Invigilation duty created successfully!');
      setActiveTab('schedule');
    }, 1000);
  };
  const resetForm = () => {
    setCurrentStep(1);
    setSelectedExamDate('');
    setSelectedExam(null);
    setSelectedHall('');
    setSelectedStaff([]);
    setAssignmentDetails({
      reportingTime: '',
      remarks: '',
      priority: 'Normal',
      notifyStaff: true
    });
  };
  const handleDeleteDuty = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Duty',
      variant: 'danger',
      message:
      'Are you sure you want to delete this invigilation duty? This action cannot be undone.',
      onConfirm: () => {
        setDuties((p) => p.filter((d) => d.id !== id));
        addToast('success', 'Duty deleted successfully');
        setShowDutyModal(false);
      }
    });
  };
  const openResolveModal = (conflict: Conflict) => {
    setConflictToResolve(conflict);
    setReplacementStaff(null);
    setShowResolveModal(true);
  };
  const handleResolveConflict = () => {
    if (!conflictToResolve) return;
    if (
    conflictToResolve.type === 'Double Booking' ||
    conflictToResolve.type === 'On Leave')
    {
      if (!replacementStaff) {
        addToast('error', 'Please select a replacement staff');
        return;
      }
      const dutyToUpdate = conflictToResolve.affectedDuties[0];
      setDuties((prev) =>
      prev.map((d) => {
        if (d.id === dutyToUpdate) {
          return {
            ...d,
            staff: d.staff.
            filter((s) => s.id !== conflictToResolve.staffId).
            concat(replacementStaff)
          };
        }
        return d;
      })
      );
      addToast(
        'success',
        `Replaced ${conflictToResolve.staffName} with ${replacementStaff.firstName} ${replacementStaff.lastName}`
      );
    } else if (conflictToResolve.type === 'Max Duties Exceeded') {
      if (!replacementStaff) {
        addToast('error', 'Please select a replacement staff');
        return;
      }
      const dutyToUpdate =
      conflictToResolve.affectedDuties[
      conflictToResolve.affectedDuties.length - 1];

      setDuties((prev) =>
      prev.map((d) => {
        if (d.id === dutyToUpdate) {
          return {
            ...d,
            staff: d.staff.
            filter((s) => s.id !== conflictToResolve.staffId).
            concat(replacementStaff)
          };
        }
        return d;
      })
      );
      addToast(
        'success',
        `Reassigned duty to ${replacementStaff.firstName} ${replacementStaff.lastName}`
      );
    }
    setResolvedConflicts((prev) => [...prev, conflictToResolve.id]);
    setShowResolveModal(false);
    setConflictToResolve(null);
    setReplacementStaff(null);
  };
  const getAvailableReplacements = (conflict: Conflict) => {
    return mockStaff.filter(
      (s) =>
      s.status === 'Active' &&
      s.id !== conflict.staffId &&
      s.totalDutiesAssigned < s.maxDutiesAllowed
    );
  };
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <ToastContainer
        toasts={toasts}
        remove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />

      <ConfirmModal
        {...confirmModal}
        onClose={() =>
        setConfirmModal((p) => ({
          ...p,
          isOpen: false
        }))
        } />


      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-blue-600" />
            </div>
            Invigilation Schedule
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Manage invigilation duties, staff assignments, and resolve conflicts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {stats.conflicts > 0 &&
          <Badge variant="danger" pulse dot>
              {stats.conflicts} Conflicts
            </Badge>
          }
          <Button variant="outline" size="sm">
            <History className="w-4 h-4" />
            Logs
          </Button>
          <Button variant="outline" size="sm" className="text-blue-600">
            <Bell className="w-4 h-4" />
            Notify
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('create')}>

            <Plus className="w-4 h-4" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        {[
        {
          icon: ClipboardList,
          label: 'Total',
          value: stats.totalDuties,
          color: 'blue'
        },
        {
          icon: Users,
          label: 'Staff',
          value: `${stats.assignedStaff}/${stats.availableStaff}`,
          color: 'green'
        },
        {
          icon: DoorOpen,
          label: 'Halls',
          value: `${stats.totalHalls}/${stats.availableHalls}`,
          color: 'purple'
        },
        {
          icon: Clock,
          label: 'Scheduled',
          value: stats.pendingDuties,
          color: 'amber'
        },
        {
          icon: Activity,
          label: 'In Progress',
          value: stats.inProgress,
          color: 'cyan'
        },
        {
          icon: AlertTriangle,
          label: 'Conflicts',
          value: stats.conflicts,
          color: stats.conflicts > 0 ? 'red' : 'green'
        }].
        map((s, i) =>
        <Card
          key={i}
          className={`p-4 cursor-pointer hover:shadow-md transition-all ${s.color === 'red' && stats.conflicts > 0 ? 'border-red-200 bg-red-50' : ''}`}>

            <div className="flex items-center justify-between mb-2">
              <s.icon className={`w-5 h-5 text-${s.color}-600`} />
              <Badge
              variant={
              s.color === 'red' && stats.conflicts > 0 ? 'danger' : 'info'
              }
              className="text-[10px]">

                {s.label}
              </Badge>
            </div>
            <p className={`text-2xl font-bold text-${s.color}-600`}>
              {s.value}
            </p>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-gray-200 w-fit">
          {[
          {
            id: 'schedule',
            label: 'Schedule',
            icon: Calendar
          },
          {
            id: 'create',
            label: 'Create',
            icon: Plus
          },
          {
            id: 'conflicts',
            label: 'Conflicts',
            icon: AlertTriangle,
            badge: stats.conflicts
          },
          {
            id: 'halltickets',
            label: 'Hall Tickets',
            icon: FileText
          },
          {
            id: 'reports',
            label: 'Reports',
            icon: TrendingUp
          }].
          map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}>

              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 &&
            <span
              className={`ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-bold ${activeTab === tab.id ? 'bg-white text-blue-600' : 'bg-red-500 text-white'}`}>

                  {tab.badge}
                </span>
            }
            </button>
          )}
        </div>
      </div>

      {/* Schedule Tab */}
      {activeTab === 'schedule' &&
      <div className="flex gap-6">
          <div className="w-72 flex-shrink-0 space-y-4 hidden lg:block">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                variant="primary"
                className="w-full justify-start"
                onClick={() => setActiveTab('create')}>

                  <Plus className="w-4 h-4" />
                  Create Assignment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4" />
                  Export Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4" />
                  Send Notifications
                </Button>
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Filter by Date
              </h3>
              <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />

              <div className="mt-4 space-y-2">
                {availableDates.slice(0, 4).map((d) =>
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg flex items-center justify-between transition-all ${selectedDate === d ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}>

                    <span>
                      {new Date(d).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                    </span>
                    <Badge variant={selectedDate === d ? 'info' : 'default'}>
                      {duties.filter((x) => x.date === d).length}
                    </Badge>
                  </button>
              )}
              </div>
            </Card>
            {conflicts.length > 0 &&
          <Card className="p-4 border-red-200 bg-red-50">
                <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Active Conflicts ({conflicts.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {conflicts.slice(0, 3).map((c) =>
              <div
                key={c.id}
                className="p-2 bg-white rounded-lg border border-red-100">

                      <Badge
                  variant={getSeverityBadge(c.severity)}
                  className="text-[10px] mb-1">

                        {c.type}
                      </Badge>
                      <p className="text-xs font-medium text-red-700">
                        {c.staffName}
                      </p>
                    </div>
              )}
                </div>
                <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-red-600"
              onClick={() => setActiveTab('conflicts')}>

                  Resolve Conflicts
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Card>
          }
          </div>

          <div className="flex-1 min-w-0">
            <Card>
              <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-blue-600" />
                    Invigilation Duties
                  </h3>
                  <Badge variant="info">{filteredDuties.length}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="w-full md:w-64">
                    <Input
                    value={scheduleFilters.search}
                    onChange={(v) =>
                    setScheduleFilters({
                      ...scheduleFilters,
                      search: v
                    })
                    }
                    placeholder="Search duties..."
                    icon={<Search className="w-4 h-4" />} />

                  </div>
                  <Select
                  value={scheduleFilters.status}
                  onChange={(v) =>
                  setScheduleFilters({
                    ...scheduleFilters,
                    status: v
                  })
                  }
                  options={[
                  {
                    value: 'Scheduled',
                    label: 'Scheduled'
                  },
                  {
                    value: 'In Progress',
                    label: 'In Progress'
                  },
                  {
                    value: 'Completed',
                    label: 'Completed'
                  }]
                  }
                  placeholder="Status"
                  className="w-32" />

                  <div className="flex items-center border rounded-lg overflow-hidden">
                    {[
                  {
                    m: 'table',
                    I: Table
                  },
                  {
                    m: 'cards',
                    I: LayoutGrid
                  },
                  {
                    m: 'timeline',
                    I: List
                  }].
                  map((v) =>
                  <button
                    key={v.m}
                    onClick={() => setViewMode(v.m as any)}
                    className={`p-2 ${viewMode === v.m ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}>

                        <v.I className="w-4 h-4" />
                      </button>
                  )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {viewMode === 'table' && filteredDuties.length > 0 &&
            <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {[
                    'Exam & Hall',
                    'Date & Time',
                    'Invigilators',
                    'Students',
                    'Status',
                    'Actions'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">

                            {h}
                          </th>
                    )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDuties.map((duty) => {
                    const hasConflict = conflicts.some((c) =>
                    c.affectedDuties.includes(duty.id)
                    );
                    return (
                      <tr
                        key={duty.id}
                        className={`hover:bg-gray-50 transition-colors ${hasConflict ? 'bg-red-50' : ''}`}>

                            <td className="px-4 py-4">
                              <div className="flex items-start gap-3">
                                <div
                              className={`w-1.5 h-14 rounded-full ${hasConflict ? 'bg-red-500' : duty.status === 'Completed' ? 'bg-green-500' : duty.status === 'In Progress' ? 'bg-amber-500' : 'bg-blue-500'}`} />

                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-gray-900">
                                      {duty.exam.subject}
                                    </p>
                                    {duty.priority === 'High' &&
                                <Badge
                                  variant="danger"
                                  className="text-[10px]">

                                        Priority
                                      </Badge>
                                }
                                    {hasConflict &&
                                <Badge
                                  variant="danger"
                                  className="text-[10px]">

                                        Conflict
                                      </Badge>
                                }
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Class {duty.exam.class}-{duty.exam.section}
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {duty.hall.name}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <p className="font-medium text-gray-900">
                                {new Date(duty.date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              }
                            )}
                              </p>
                              <p className="text-sm text-blue-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {duty.startTime} - {duty.endTime}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex -space-x-2">
                                {duty.staff.slice(0, 3).map((s, i) =>
                            <div
                              key={s.id}
                              title={`${s.firstName} ${s.lastName}`}
                              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}
                              style={{
                                zIndex: 3 - i
                              }}>

                                    {s.firstName[0]}
                                  </div>
                            )}
                                {duty.staff.length > 3 &&
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold">
                                    +{duty.staff.length - 3}
                                  </div>
                            }
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge variant="default">
                                <Users className="w-3 h-3" />
                                {duty.exam.totalStudents}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                            variant={
                            duty.status === 'Completed' ?
                            'success' :
                            duty.status === 'In Progress' ?
                            'warning' :
                            'info'
                            }
                            dot={duty.status === 'In Progress'}
                            pulse={duty.status === 'In Progress'}>

                                {duty.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => {
                                setSelectedDuty(duty);
                                setShowDutyModal(true);
                              }}>

                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="xs">
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                              variant="ghost"
                              size="xs"
                              className="text-red-600"
                              onClick={() => handleDeleteDuty(duty.id)}>

                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>);

                  })}
                    </tbody>
                  </table>
                </div>
            }

              {viewMode === 'cards' && filteredDuties.length > 0 &&
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDuties.map((duty) => {
                const hasConflict = conflicts.some((c) =>
                c.affectedDuties.includes(duty.id)
                );
                return (
                  <Card
                    key={duty.id}
                    className={`p-4 ${hasConflict ? 'border-red-300 bg-red-50' : ''}`}
                    onClick={() => {
                      setSelectedDuty(duty);
                      setShowDutyModal(true);
                    }}>

                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {duty.exam.subject}
                              </h4>
                              {duty.priority === 'High' &&
                          <Flag className="w-4 h-4 text-red-500" />
                          }
                            </div>
                            <p className="text-sm text-gray-500">
                              Class {duty.exam.class}-{duty.exam.section}
                            </p>
                          </div>
                          <Badge
                        variant={
                        duty.status === 'Completed' ?
                        'success' :
                        duty.status === 'In Progress' ?
                        'warning' :
                        'info'
                        }
                        dot={duty.status === 'In Progress'}>

                            {duty.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {duty.hall.name}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {duty.date}
                          </p>
                          <p className="flex items-center gap-2 text-blue-600 font-medium">
                            <Clock className="w-4 h-4" />
                            {duty.startTime} - {duty.endTime}
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {duty.staff.slice(0, 3).map((s, i) =>
                        <div
                          key={s.id}
                          className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}
                          style={{
                            zIndex: 3 - i
                          }}>

                                {s.firstName[0]}
                              </div>
                        )}
                          </div>
                          <Badge variant="default">
                            <Users className="w-3 h-3" />
                            {duty.exam.totalStudents}
                          </Badge>
                        </div>
                        {hasConflict &&
                    <div className="mt-3 p-2 bg-red-100 rounded-lg flex items-center gap-2 text-red-700 text-xs">
                            <AlertTriangle className="w-4 h-4" />
                            Conflict detected
                          </div>
                    }
                      </Card>);

              })}
                </div>
            }

              {viewMode === 'timeline' && filteredDuties.length > 0 &&
            <div className="p-4">
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                    <div className="space-y-4">
                      {filteredDuties.map((duty) =>
                  <div key={duty.id} className="relative pl-10">
                          <div
                      className={`absolute left-2.5 w-4 h-4 rounded-full ${duty.status === 'Completed' ? 'bg-green-500' : duty.status === 'In Progress' ? 'bg-amber-500 animate-pulse' : 'bg-blue-500'}`} />

                          <Card
                      className="p-4"
                      onClick={() => {
                        setSelectedDuty(duty);
                        setShowDutyModal(true);
                      }}>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div className="flex items-center gap-4">
                                <div className="text-center min-w-[60px]">
                                  <p className="text-lg font-bold text-blue-600">
                                    {duty.startTime}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {duty.endTime}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {duty.exam.subject}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    Class {duty.exam.class}-{duty.exam.section}{' '}
                                    • {duty.hall.name}
                                  </p>
                                </div>
                              </div>
                              <Badge
                          variant={
                          duty.status === 'Completed' ?
                          'success' :
                          duty.status === 'In Progress' ?
                          'warning' :
                          'info'
                          }>

                                {duty.status}
                              </Badge>
                            </div>
                          </Card>
                        </div>
                  )}
                    </div>
                  </div>
                </div>
            }

              {filteredDuties.length === 0 &&
            <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Duties Found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No invigilation duties match your filters
                  </p>
                  <Button
                variant="primary"
                onClick={() => setActiveTab('create')}>

                    <Plus className="w-4 h-4" />
                    Create Assignment
                  </Button>
                </div>
            }
            </Card>
          </div>
        </div>
      }

      {/* Create Tab */}
      {activeTab === 'create' &&
      <Card className="p-6">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <StepIndicator
            steps={steps}
            current={currentStep}
            onClick={(s) => setCurrentStep(s)} />

          </div>

          {currentStep === 1 &&
        <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Examination
                </h2>
                <p className="text-gray-500 mt-2">
                  Choose a date and select the exam to assign invigilation duty
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Exam Date *
                </label>
                <Select
              value={selectedExamDate}
              onChange={(v) => {
                setSelectedExamDate(v);
                setSelectedExam(null);
              }}
              options={availableDates.map((d) => ({
                value: d,
                label: new Date(d).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }))}
              placeholder="Choose a date" />

              </div>

              {selectedExamDate &&
          <div className="mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Exams on{' '}
                    {new Date(selectedExamDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
                    <Badge variant="info">
                      {filteredExamsByDate.length} exams
                    </Badge>
                  </h3>

                  {filteredExamsByDate.length === 0 ?
            <div className="text-center py-12 text-gray-500">
                      <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No exams scheduled for this date</p>
                    </div> :

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                      {filteredExamsByDate.map((exam) =>
              <div
                key={exam.id}
                onClick={() => handleSelectExam(exam)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${selectedExam?.id === exam.id ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 bg-white'}`}>

                          <div className="flex items-center justify-between mb-3">
                            <Badge
                    variant={
                    exam.examType === 'Theory' ? 'info' : 'purple'
                    }>

                              {exam.examType}
                            </Badge>
                            {selectedExam?.id === exam.id &&
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                  }
                          </div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {exam.subject}
                          </h4>
                          <p className="text-sm text-gray-500 mb-3">
                            Class {exam.class} - Section {exam.section}
                          </p>
                          <div className="space-y-2 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-green-500" />
                              {exam.startTime} - {exam.endTime} ({exam.duration}
                              )
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4 text-purple-500" />
                              {exam.totalStudents} Students
                            </div>
                          </div>
                        </div>
              )}
                    </div>
            }
                </div>
          }

              {!selectedExamDate &&
          <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">
                    Select a date to view available exams
                  </p>
                </div>
          }
            </div>
        }

          {currentStep === 2 &&
        <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <DoorOpen className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Examination Hall
                </h2>
                <p className="text-gray-500 mt-2">
                  Choose a venue with adequate seating capacity
                </p>
              </div>

              {selectedExam &&
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      {selectedExam.subject} - Class {selectedExam.class}-
                      {selectedExam.section}
                    </h4>
                    <p className="text-sm text-blue-700">
                      {selectedExam.date} • {selectedExam.startTime} -{' '}
                      {selectedExam.endTime}
                    </p>
                  </div>
                  <Badge variant="info" className="self-start">
                    <Users className="w-3 h-3" />
                    {selectedExam.totalStudents} Students (Required Capacity)
                  </Badge>
                </div>
          }

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockHalls.map((hall) => {
              const isAvailable = hall.status === 'Available';
              const hasCapacity =
              !selectedExam || hall.capacity >= selectedExam.totalStudents;
              const isSelectable = isAvailable && hasCapacity;
              return (
                <div
                  key={hall.id}
                  onClick={() => isSelectable && setSelectedHall(hall.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${!isSelectable ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60' : selectedHall === hall.id ? 'border-purple-500 bg-purple-50 cursor-pointer shadow-lg ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300 cursor-pointer bg-white hover:shadow-md'}`}>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                          <Badge variant={isAvailable ? 'success' : 'warning'}>
                            {hall.status}
                          </Badge>
                          {!hasCapacity &&
                      <Badge variant="danger">Low Capacity</Badge>
                      }
                        </div>
                        {selectedHall === hall.id &&
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                    }
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        {hall.name}
                      </h4>
                      <p className="text-sm text-gray-500">{hall.code}</p>
                      <div className="mt-3 space-y-2 text-sm text-gray-600">
                        <p className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {hall.building}
                        </p>
                        <p className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-gray-400" />
                          {hall.floor}
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          Capacity:{' '}
                          <span
                        className={`font-semibold ${hasCapacity ? 'text-green-600' : 'text-red-600'}`}>

                            {hall.capacity}
                          </span>
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {hall.facilities.map((f) =>
                    <span
                      key={f}
                      className="px-2 py-0.5 text-[10px] bg-gray-100 rounded-full">

                            {f}
                          </span>
                    )}
                      </div>
                    </div>);

            })}
              </div>
            </div>
        }

          {currentStep === 3 &&
        <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Assign Invigilators
                </h2>
                <p className="text-gray-500 mt-2">
                  Select staff members to invigilate this examination
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <Input
                    value={staffSearch}
                    onChange={setStaffSearch}
                    placeholder="Search by name or ID..."
                    icon={<Search className="w-4 h-4" />} />

                    </div>
                    <Select
                  value={staffFilters.department}
                  onChange={(v) =>
                  setStaffFilters({
                    ...staffFilters,
                    department: v
                  })
                  }
                  options={departments.map((d) => ({
                    value: d,
                    label: d
                  }))}
                  placeholder="Department"
                  className="w-40" />

                    <Select
                  value={staffFilters.sortBy}
                  onChange={(v) =>
                  setStaffFilters({
                    ...staffFilters,
                    sortBy: v as any
                  })
                  }
                  options={[
                  {
                    value: 'name',
                    label: 'By Name'
                  },
                  {
                    value: 'duties',
                    label: 'Least Duties'
                  },
                  {
                    value: 'rating',
                    label: 'Top Rated'
                  }]
                  }
                  className="w-36" />

                  </div>

                  <Checkbox
                checked={staffFilters.availableOnly}
                onChange={(c) =>
                setStaffFilters({
                  ...staffFilters,
                  availableOnly: c
                })
                }
                label="Show only available staff" />


                  <div className="border rounded-xl overflow-hidden bg-white max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                    {filteredStaff.map((s) => {
                  const isSelected = selectedStaff.some(
                    (x) => x.id === s.id
                  );
                  const maxReached =
                  s.totalDutiesAssigned >= s.maxDutiesAllowed;
                  return (
                    <div
                      key={s.id}
                      className={`p-4 transition-colors ${isSelected ? 'bg-green-50' : s.status !== 'Active' ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'}`}>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${s.gender === 'Female' ? 'bg-gradient-to-br from-pink-400 to-pink-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'}`}>

                                {s.firstName[0]}
                                {s.lastName[0]}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {s.firstName} {s.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {s.empId} • {s.department} • {s.designation}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right hidden sm:block">
                                <p
                              className={`text-sm font-medium ${maxReached ? 'text-red-600' : 'text-gray-700'}`}>

                                  {s.totalDutiesAssigned}/{s.maxDutiesAllowed}{' '}
                                  duties
                                </p>
                                <div className="flex gap-0.5 justify-end">
                                  {[...Array(5)].map((_, i) =>
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < s.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />

                              )}
                                </div>
                              </div>
                              <Badge
                            variant={
                            s.status === 'Active' ?
                            'success' :
                            s.status === 'On Leave' ?
                            'warning' :
                            'danger'
                            }>

                                {s.status}
                              </Badge>
                              {isSelected ?
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveStaff(s.id)}>

                                  <X className="w-3 h-3" />
                                  Remove
                                </Button> :

                          <Button
                            variant="primary"
                            size="sm"
                            disabled={s.status !== 'Active' || maxReached}
                            onClick={() => handleAddStaff(s)}>

                                  <Plus className="w-3 h-3" />
                                  Add
                                </Button>
                          }
                            </div>
                          </div>
                        </div>);

                })}
                  </div>
                </div>

                <Card className="p-4 sticky top-6 h-fit">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    Selected Invigilators ({selectedStaff.length})
                  </h3>
                  {selectedStaff.length === 0 ?
              <div className="text-center py-8 text-gray-500">
                      <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No staff selected yet</p>
                      <p className="text-xs mt-1">Add staff from the list</p>
                    </div> :

              <div className="space-y-2">
                      {selectedStaff.map((s, i) =>
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                              {i + 1}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {s.firstName} {s.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {s.department}
                              </p>
                            </div>
                          </div>
                          <button
                    onClick={() => handleRemoveStaff(s.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded">

                            <X className="w-4 h-4" />
                          </button>
                        </div>
                )}
                    </div>
              }
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 flex-shrink-0" />
                      Recommendation: Assign 2 invigilators for up to 50
                      students, 3 for larger halls.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
        }

          {currentStep === 4 &&
        <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Review & Confirm
                </h2>
                <p className="text-gray-500 mt-2">
                  Verify all details before creating the assignment
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Examination Details
                    </h4>
                    {selectedExam &&
                <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Subject</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.subject}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Class</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.class}-{selectedExam.section}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Time</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.startTime} - {selectedExam.endTime}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.duration}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Students</p>
                          <p className="font-semibold text-gray-900">
                            {selectedExam.totalStudents}
                          </p>
                        </div>
                      </div>
                }
                  </Card>

                  <Card className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <DoorOpen className="w-5 h-5 text-purple-600" />
                      Venue Details
                    </h4>
                    {(() => {
                  const h = mockHalls.find((x) => x.id === selectedHall);
                  return h ?
                  <div className="text-sm space-y-2">
                          <div>
                            <p className="text-gray-500">Hall</p>
                            <p className="font-semibold text-gray-900">
                              {h.name} ({h.code})
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p className="font-semibold text-gray-900">
                              {h.building}, {h.floor}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Capacity</p>
                            <p className="font-semibold text-green-600">
                              {h.capacity} seats
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Facilities</p>
                            <div className="flex gap-1 mt-1">
                              {h.facilities.map((f) =>
                        <Badge key={f} variant="default">
                                  {f}
                                </Badge>
                        )}
                            </div>
                          </div>
                        </div> :
                  null;
                })()}
                  </Card>

                  <Card className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      Assigned Invigilators ({selectedStaff.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedStaff.map((s, i) =>
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">

                          <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              {s.firstName} {s.lastName}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {s.department}
                            </span>
                          </div>
                        </div>
                  )}
                    </div>
                  </Card>
                </div>

                <Card className="p-5">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    Additional Settings
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reporting Time
                      </label>
                      <input
                    type="time"
                    value={assignmentDetails.reportingTime}
                    onChange={(e) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      reportingTime: e.target.value
                    })
                    }
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" />

                      <p className="text-xs text-gray-500 mt-1">
                        Default: 30 minutes before exam
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority Level
                      </label>
                      <Select
                    value={assignmentDetails.priority}
                    onChange={(v) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      priority: v as any
                    })
                    }
                    options={[
                    {
                      value: 'Normal',
                      label: '🟢 Normal'
                    },
                    {
                      value: 'High',
                      label: '🟡 High'
                    },
                    {
                      value: 'Critical',
                      label: '🔴 Critical'
                    }]
                    } />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks / Instructions
                      </label>
                      <textarea
                    value={assignmentDetails.remarks}
                    onChange={(e) =>
                    setAssignmentDetails({
                      ...assignmentDetails,
                      remarks: e.target.value
                    })
                    }
                    rows={3}
                    className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions for invigilators..." />

                    </div>
                    <Checkbox
                  checked={assignmentDetails.notifyStaff}
                  onChange={(c) =>
                  setAssignmentDetails({
                    ...assignmentDetails,
                    notifyStaff: c
                  })
                  }
                  label="Send notification to assigned staff" />

                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800">
                        Ready to Create
                      </h4>
                      <p className="text-sm text-green-600">
                        All required information has been provided
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
        }

          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
            <Button
            variant="outline"
            onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
            disabled={currentStep === 1}>

              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="flex gap-3">
              <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                setActiveTab('schedule');
              }}>

                Cancel
              </Button>
              {currentStep < 4 ?
            <Button
              variant="primary"
              onClick={() => setCurrentStep((p) => p + 1)}
              disabled={
              currentStep === 1 && !selectedExam ||
              currentStep === 2 && !selectedHall ||
              currentStep === 3 && selectedStaff.length === 0
              }>

                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button> :

            <Button
              variant="success"
              onClick={handleCreateAssignment}
              loading={isLoading}>

                  <CheckCircle2 className="w-4 h-4" />
                  Create Assignment
                </Button>
            }
            </div>
          </div>
        </Card>
      }

      {/* Conflicts Tab */}
      {activeTab === 'conflicts' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Conflict Monitor
                </h3>
                <Button
                variant="outline"
                size="sm"
                onClick={() => addToast('info', 'Checking for conflicts...')}>

                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>

              {conflicts.length === 0 ?
            <div className="p-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No Active Conflicts
                  </h3>
                  <p className="text-gray-500">
                    All invigilation duties are conflict-free
                  </p>
                </div> :

            <div className="divide-y divide-gray-100">
                  {conflicts.map((c) =>
              <div key={c.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                      className={`p-2.5 rounded-xl ${c.severity === 'High' ? 'bg-red-100 text-red-600' : c.severity === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>

                            <AlertOctagon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getSeverityBadge(c.severity)}>
                                {c.severity}
                              </Badge>
                              <Badge variant="default">{c.type}</Badge>
                            </div>
                            <h4 className="font-semibold text-gray-900 mt-1">
                              {c.staffName}
                            </h4>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">
                        {c.description}
                      </p>

                      <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <h5 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" />
                          Suggested Actions
                        </h5>
                        <ul className="space-y-1">
                          {c.suggestions.map((s, i) =>
                    <li
                      key={i}
                      className="text-sm text-blue-700 flex items-start gap-2">

                              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                    )}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openResolveModal(c)}>

                          <UserCheck className="w-4 h-4" />
                          Resolve Now
                        </Button>
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setResolvedConflicts((p) => [...p, c.id]);
                      addToast('warning', 'Conflict marked as ignored');
                    }}>

                          Ignore
                        </Button>
                      </div>
                    </div>
              )}
                </div>
            }
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">
                Conflict Summary
              </h3>
              <div className="space-y-3">
                {[
              {
                l: 'High Severity',
                c: 'red',
                n: conflicts.filter((x) => x.severity === 'High').length
              },
              {
                l: 'Medium Severity',
                c: 'amber',
                n: conflicts.filter((x) => x.severity === 'Medium').length
              },
              {
                l: 'Low Severity',
                c: 'blue',
                n: conflicts.filter((x) => x.severity === 'Low').length
              }].
              map((x) =>
              <div
                key={x.l}
                className={`flex items-center justify-between p-3 rounded-lg ${x.c === 'red' ? 'bg-red-50' : x.c === 'amber' ? 'bg-amber-50' : 'bg-blue-50'}`}>

                    <span
                  className={`text-sm ${x.c === 'red' ? 'text-red-700' : x.c === 'amber' ? 'text-amber-700' : 'text-blue-700'}`}>

                      {x.l}
                    </span>
                    <Badge
                  variant={
                  x.c === 'red' ?
                  'danger' :
                  x.c === 'amber' ?
                  'warning' :
                  'info'
                  }>

                      {x.n}
                    </Badge>
                  </div>
              )}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4">By Type</h3>
              <div className="space-y-2">
                {['Double Booking', 'On Leave', 'Max Duties Exceeded'].map(
                (type) =>
                <div
                  key={type}
                  className="flex items-center justify-between py-2">

                      <span className="text-sm text-gray-600">{type}</span>
                      <span className="font-bold text-gray-900">
                        {conflicts.filter((c) => c.type === type).length}
                      </span>
                    </div>

              )}
              </div>
            </Card>

            <Card className="p-5 bg-green-50 border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Resolved</h3>
              <p className="text-2xl font-bold text-green-600">
                {resolvedConflicts.length}
              </p>
              <p className="text-sm text-green-700">conflicts resolved</p>
            </Card>
          </div>
        </div>
      }

      {/* Hall Tickets Tab */}
      {activeTab === 'halltickets' &&
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Generate Hall Tickets
                </h3>
                <div className="flex items-center gap-2">
                  {selectedTickets.length > 0 &&
                <Badge variant="info">
                      {selectedTickets.length} selected
                    </Badge>
                }
                  <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (selectedTickets.length) {
                      addToast(
                        'success',
                        `Generated ${selectedTickets.length} hall tickets`
                      );
                      setSelectedTickets([]);
                    } else addToast('warning', 'Please select staff first');
                  }}
                  loading={isLoading}>

                    <Download className="w-4 h-4" />
                    Generate
                  </Button>
                </div>
              </div>
              <div className="p-4 border-b">
                <Input
                value={ticketSearch}
                onChange={setTicketSearch}
                placeholder="Search staff..."
                icon={<Search className="w-4 h-4" />} />

              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <Checkbox
                        checked={
                        selectedTickets.length ===
                        mockStaff.filter(
                          (s) =>
                          s.status === 'Active' &&
                          getStaffDuties(s.id).length > 0
                        ).length
                        }
                        onChange={(c) =>
                        setSelectedTickets(
                          c ?
                          mockStaff.
                          filter(
                            (s) =>
                            s.status === 'Active' &&
                            getStaffDuties(s.id).length > 0
                          ).
                          map((s) => s.id) :
                          []
                        )
                        } />

                      </th>
                      {[
                    'Staff Member',
                    'Assigned Duties',
                    'Status',
                    'Actions'].
                    map((h) =>
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600">

                          {h}
                        </th>
                    )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockStaff.
                  filter(
                    (s) =>
                    s.status === 'Active' && (
                    !ticketSearch ||
                    `${s.firstName} ${s.lastName}`.
                    toLowerCase().
                    includes(ticketSearch.toLowerCase()))
                  ).
                  slice(0, 15).
                  map((s) => {
                    const staffDuties = getStaffDuties(s.id);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <Checkbox
                            checked={selectedTickets.includes(s.id)}
                            onChange={(c) =>
                            setSelectedTickets(
                              c ?
                              [...selectedTickets, s.id] :
                              selectedTickets.filter(
                                (x) => x !== s.id
                              )
                            )
                            }
                            disabled={staffDuties.length === 0} />

                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>

                                  {s.firstName[0]}
                                  {s.lastName[0]}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {s.firstName} {s.lastName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {s.empId} • {s.department}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                            variant={
                            staffDuties.length > 0 ? 'info' : 'default'
                            }>

                                {staffDuties.length} Duties
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="success">{s.status}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Button
                              variant="primary"
                              size="xs"
                              disabled={staffDuties.length === 0}
                              onClick={() => {
                                setSelectedStaffForTicket(s);
                                setShowHallTicketModal(true);
                              }}>

                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                                <Button
                              variant="outline"
                              size="xs"
                              disabled={staffDuties.length === 0}>

                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>);

                  })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Hall Ticket Info
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {[
              'Staff details & photo',
              'All assigned duties',
              'Hall & timing details',
              'Reporting instructions',
              'QR code for verification'].
              map((t, i) =>
              <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {t}
                  </li>
              )}
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Hall Tickets
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                Send hall tickets directly to staff email addresses
              </p>
              <Button
              variant="primary"
              className="w-full"
              onClick={() =>
              addToast('success', 'Hall tickets emailed to all staff!')
              }>

                <Send className="w-4 h-4" />
                Email All Staff
              </Button>
            </Card>
          </div>
        </div>
      }

      {/* Reports Tab */}
      {activeTab === 'reports' &&
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Duty Distribution
            </h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">Chart visualization placeholder</p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Staff Workload
            </h3>
            <div className="space-y-4">
              {mockStaff.slice(0, 6).map((s) =>
            <div key={s.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                    {s.firstName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {s.firstName} {s.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {s.totalDutiesAssigned}/{s.maxDutiesAllowed}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                    className={`h-full rounded-full transition-all ${s.totalDutiesAssigned / s.maxDutiesAllowed > 0.8 ? 'bg-red-500' : s.totalDutiesAssigned / s.maxDutiesAllowed > 0.5 ? 'bg-amber-500' : 'bg-green-500'}`}
                    style={{
                      width: `${s.totalDutiesAssigned / s.maxDutiesAllowed * 100}%`
                    }} />

                    </div>
                  </div>
                </div>
            )}
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-purple-600" />
              Export Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
            {
              l: 'Schedule Report',
              i: Calendar,
              d: 'Complete invigilation schedule'
            },
            {
              l: 'Staff Report',
              i: Users,
              d: 'Staff assignments summary'
            },
            {
              l: 'Hall Report',
              i: Building,
              d: 'Hall utilization report'
            }].
            map((r) =>
            <button
              key={r.l}
              onClick={() =>
              addToast('success', `${r.l} downloaded successfully`)
              }
              className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left">

                  <r.i className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold text-gray-900">{r.l}</h4>
                  <p className="text-sm text-gray-500">{r.d}</p>
                </button>
            )}
            </div>
          </Card>
        </div>
      }

      {/* Resolve Conflict Modal */}
      {showResolveModal && conflictToResolve &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Resolve Conflict
              </h2>
              <button
              onClick={() => setShowResolveModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getSeverityBadge(conflictToResolve.severity)}>
                    {conflictToResolve.severity}
                  </Badge>
                  <Badge variant="default">{conflictToResolve.type}</Badge>
                </div>
                <h4 className="font-semibold text-red-800">
                  {conflictToResolve.staffName}
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {conflictToResolve.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Select Replacement Staff
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Choose an available staff member to replace{' '}
                  {conflictToResolve.staffName}
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2">
                  {getAvailableReplacements(conflictToResolve).map((s) =>
                <div
                  key={s.id}
                  onClick={() => setReplacementStaff(s)}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${replacementStaff?.id === s.id ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`}>

                      <div className="flex items-center gap-3">
                        <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>

                          {s.firstName[0]}
                          {s.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {s.department} • {s.totalDutiesAssigned}/
                            {s.maxDutiesAllowed} duties
                          </p>
                        </div>
                      </div>
                      {replacementStaff?.id === s.id &&
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  }
                    </div>
                )}
                  {getAvailableReplacements(conflictToResolve).length === 0 &&
                <div className="text-center py-8 text-gray-500">
                      <UserPlus className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No available staff found</p>
                    </div>
                }
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResolveModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="success"
                className="flex-1"
                onClick={handleResolveConflict}
                disabled={!replacementStaff}>

                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Resolution
                </Button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Hall Ticket Modal */}
      {showHallTicketModal && selectedStaffForTicket &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-3xl my-8">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-xl z-10">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Invigilation Hall Ticket
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="primary" size="sm">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <button
                onClick={() => setShowHallTicketModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg">

                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="border-2 border-gray-300 rounded-lg p-6">
                <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
                  <div className="flex justify-center items-center gap-4 mb-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <School className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">
                        DELHI PUBLIC SCHOOL
                      </h1>
                      <p className="text-sm text-gray-600">
                        Sector 45, Gurugram, Haryana
                      </p>
                    </div>
                  </div>
                  <h2 className="text-lg font-bold text-blue-700 mt-4">
                    INVIGILATION DUTY HALL TICKET
                  </h2>
                  <p className="text-sm text-gray-500">
                    Annual Examination 2024
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="col-span-2">
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                      [
                      'Name',
                      `${selectedStaffForTicket.firstName} ${selectedStaffForTicket.lastName}`],

                      ['Employee ID', selectedStaffForTicket.empId],
                      ['Department', selectedStaffForTicket.department],
                      ['Designation', selectedStaffForTicket.designation],
                      ['Contact', selectedStaffForTicket.phone]].
                      map(([l, v]) =>
                      <tr key={l}>
                            <td className="py-2 text-gray-500 w-32">{l}:</td>
                            <td className="py-2 font-semibold">{v}</td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-28 h-32 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-center bg-gray-100 py-2 rounded">
                    ASSIGNED INVIGILATION DUTIES
                  </h3>
                  <table className="w-full text-sm border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                      '#',
                      'Date',
                      'Subject',
                      'Class',
                      'Hall',
                      'Timing',
                      'Report At'].
                      map((h) =>
                      <th
                        key={h}
                        className="border border-gray-300 px-3 py-2 text-left">

                            {h}
                          </th>
                      )}
                      </tr>
                    </thead>
                    <tbody>
                      {getStaffDuties(selectedStaffForTicket.id).map((d, i) =>
                    <tr key={d.id}>
                          <td className="border border-gray-300 px-3 py-2">
                            {i + 1}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.date}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.exam.subject}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.exam.class}-{d.exam.section}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.hall.name}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.startTime}-{d.endTime}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {d.reportingTime}
                          </td>
                        </tr>
                    )}
                      {getStaffDuties(selectedStaffForTicket.id).length ===
                    0 &&
                    <tr>
                          <td
                        colSpan={7}
                        className="border border-gray-300 px-3 py-4 text-center text-gray-500">

                            No duties assigned
                          </td>
                        </tr>
                    }
                    </tbody>
                  </table>
                </div>

                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    Important Instructions:
                  </h4>
                  <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                    {[
                  'Report to the examination hall at least 30 minutes before scheduled time',
                  'Carry this hall ticket and your ID card during duty',
                  'Ensure proper seating arrangement before exam begins',
                  'Collect answer sheets and question papers from exam cell',
                  'Report any unfair means or misconduct immediately'].
                  map((t, i) =>
                  <li key={i}>{t}</li>
                  )}
                  </ol>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-sm pt-8 border-t border-gray-300">
                  {['Staff Signature', 'Exam Controller', 'Principal'].map(
                  (l) =>
                  <div key={l}>
                        <div className="border-t border-gray-400 pt-2 mt-12">
                          {l}
                        </div>
                      </div>

                )}
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>
                    Ticket No: HT-{selectedStaffForTicket.empId}-2024 |
                    Generated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Duty Detail Modal */}
      {showDutyModal && selectedDuty &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">Duty Details</h2>
              <button
              onClick={() => setShowDutyModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg">

                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Examination
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                ['Subject', selectedDuty.exam.subject],
                [
                'Class',
                `${selectedDuty.exam.class}-${selectedDuty.exam.section}`],

                ['Date', selectedDuty.date],
                [
                'Time',
                `${selectedDuty.startTime} - ${selectedDuty.endTime}`],

                ['Duration', selectedDuty.exam.duration],
                ['Students', selectedDuty.exam.totalStudents]].
                map(([l, v]) =>
                <div key={l}>
                      <p className="text-blue-600">{l}</p>
                      <p className="font-semibold text-gray-900">{v}</p>
                    </div>
                )}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-xl">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <DoorOpen className="w-5 h-5" />
                  Venue
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                ['Hall', selectedDuty.hall.name],
                ['Code', selectedDuty.hall.code],
                [
                'Location',
                `${selectedDuty.hall.building}, ${selectedDuty.hall.floor}`],

                ['Capacity', `${selectedDuty.hall.capacity} seats`]].
                map(([l, v]) =>
                <div key={l}>
                      <p className="text-purple-600">{l}</p>
                      <p className="font-semibold text-gray-900">{v}</p>
                    </div>
                )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Assigned Invigilators
                </h3>
                <div className="space-y-3">
                  {selectedDuty.staff.map((s) =>
                <div
                  key={s.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">

                      <div className="flex items-center gap-3">
                        <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${s.gender === 'Female' ? 'bg-pink-500' : 'bg-blue-500'}`}>

                          {s.firstName[0]}
                          {s.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium">
                            {s.firstName} {s.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {s.empId} • {s.department}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">Assigned</Badge>
                    </div>
                )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1">
                  <Edit3 className="w-4 h-4" />
                  Edit Duty
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4" />
                  Print
                </Button>
                <Button
                variant="danger"
                className="flex-1"
                onClick={() => handleDeleteDuty(selectedDuty.id)}>

                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}