import React, { useMemo, useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  UserCheck,
  UserX,
  CalendarDays,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  Sun,
  Umbrella,
  Coffee,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  User,
  Building,
  Timer,
  Activity,
  Search,
  Filter,
  X,
  Check,
  ChevronDown,
  MapPin,
  Info,
  Users,
  Percent,
  Award,
  Target,
  Eye,
  ArrowUpRight } from
'lucide-react';
// ============ TYPES ============
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  joiningDate: string;
  shift: string;
  shiftTiming: string;
  reportingManager: string;
  branch: string;
  batchYear: number;
}
interface EmployeeAttendance extends Employee {
  present: number;
  absent: number;
  late: number;
  leave: number;
  halfDay: number;
  totalWorkdays: number;
  attendancePercentage: number;
  avgWorkHours: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
}
interface Branch {
  id: string;
  name: string;
  location: string;
}
interface InfoModalContent {
  title: string;
  description: string;
  whyNecessary: string;
  actionRequired: string;
  tips?: string[];
}
// ============ DATA ============
const branches: Branch[] = [
{
  id: 'BR001',
  name: 'Main Campus',
  location: 'Downtown'
},
{
  id: 'BR002',
  name: 'North Branch',
  location: 'North District'
},
{
  id: 'BR003',
  name: 'South Branch',
  location: 'South District'
},
{
  id: 'BR004',
  name: 'East Branch',
  location: 'East Zone'
},
{
  id: 'BR005',
  name: 'West Branch',
  location: 'West Zone'
}];

const batchYears = [
2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014];

const months = [
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

const generateEmployeeAttendance = (): EmployeeAttendance[] => {
  const employeesData: Omit<Employee, 'branch' | 'batchYear'>[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Dr. Rajesh Kumar',
    avatar: 'RK',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    email: 'rajesh.kumar@school.edu',
    phone: '+91 98765 43210',
    joiningDate: '2018-06-15',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Dr. Amit Shah'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Mrs. Priya Sharma',
    avatar: 'PS',
    department: 'Science',
    designation: 'Teacher',
    email: 'priya.sharma@school.edu',
    phone: '+91 98765 43211',
    joiningDate: '2020-01-10',
    shift: 'Morning Shift',
    shiftTiming: '8:00 AM - 4:00 PM',
    reportingManager: 'Mr. Vikram Singh'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Mr. Amit Patel',
    avatar: 'AP',
    department: 'Science',
    designation: 'HOD',
    email: 'amit.patel@school.edu',
    phone: '+91 98765 43212',
    joiningDate: '2015-03-20',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Principal'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Ms. Sneha Gupta',
    avatar: 'SG',
    department: 'English',
    designation: 'Teacher',
    email: 'sneha.gupta@school.edu',
    phone: '+91 98765 43213',
    joiningDate: '2021-07-01',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Mrs. Kavita Menon'
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Mr. Rahul Verma',
    avatar: 'RV',
    department: 'Computer Science',
    designation: 'Lab Instructor',
    email: 'rahul.verma@school.edu',
    phone: '+91 98765 43214',
    joiningDate: '2019-04-15',
    shift: 'Morning Shift',
    shiftTiming: '8:00 AM - 4:00 PM',
    reportingManager: 'Dr. Rajesh Kumar'
  },
  {
    id: '6',
    employeeId: 'EMP006',
    name: 'Mrs. Anita Singh',
    avatar: 'AS',
    department: 'History',
    designation: 'Senior Teacher',
    email: 'anita.singh@school.edu',
    phone: '+91 98765 43215',
    joiningDate: '2016-08-20',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Principal'
  },
  {
    id: '7',
    employeeId: 'EMP007',
    name: 'Mr. Vikram Joshi',
    avatar: 'VJ',
    department: 'Physical Education',
    designation: 'Sports Coach',
    email: 'vikram.joshi@school.edu',
    phone: '+91 98765 43216',
    joiningDate: '2022-01-10',
    shift: 'Morning Shift',
    shiftTiming: '7:00 AM - 3:00 PM',
    reportingManager: 'Mr. Amit Patel'
  },
  {
    id: '8',
    employeeId: 'EMP008',
    name: 'Dr. Meera Nair',
    avatar: 'MN',
    department: 'Mathematics',
    designation: 'HOD',
    email: 'meera.nair@school.edu',
    phone: '+91 98765 43217',
    joiningDate: '2014-02-28',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Principal'
  },
  {
    id: '9',
    employeeId: 'EMP009',
    name: 'Mr. Sanjay Mehta',
    avatar: 'SM',
    department: 'Arts',
    designation: 'Teacher',
    email: 'sanjay.mehta@school.edu',
    phone: '+91 98765 43218',
    joiningDate: '2019-09-01',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Mrs. Anita Singh'
  },
  {
    id: '10',
    employeeId: 'EMP010',
    name: 'Mrs. Kavita Menon',
    avatar: 'KM',
    department: 'English',
    designation: 'HOD',
    email: 'kavita.menon@school.edu',
    phone: '+91 98765 43219',
    joiningDate: '2015-06-15',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Principal'
  },
  {
    id: '11',
    employeeId: 'EMP011',
    name: 'Mr. Arjun Reddy',
    avatar: 'AR',
    department: 'Science',
    designation: 'Lab Assistant',
    email: 'arjun.reddy@school.edu',
    phone: '+91 98765 43220',
    joiningDate: '2021-03-01',
    shift: 'Morning Shift',
    shiftTiming: '8:00 AM - 4:00 PM',
    reportingManager: 'Mr. Amit Patel'
  },
  {
    id: '12',
    employeeId: 'EMP012',
    name: 'Ms. Divya Krishnan',
    avatar: 'DK',
    department: 'Computer Science',
    designation: 'Teacher',
    email: 'divya.krishnan@school.edu',
    phone: '+91 98765 43221',
    joiningDate: '2020-07-15',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Dr. Rajesh Kumar'
  },
  {
    id: '13',
    employeeId: 'EMP013',
    name: 'Mr. Prakash Iyer',
    avatar: 'PI',
    department: 'Administration',
    designation: 'Office Manager',
    email: 'prakash.iyer@school.edu',
    phone: '+91 98765 43222',
    joiningDate: '2017-01-10',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Principal'
  },
  {
    id: '14',
    employeeId: 'EMP014',
    name: 'Mrs. Lakshmi Rao',
    avatar: 'LR',
    department: 'Mathematics',
    designation: 'Teacher',
    email: 'lakshmi.rao@school.edu',
    phone: '+91 98765 43223',
    joiningDate: '2018-08-01',
    shift: 'General Shift',
    shiftTiming: '9:00 AM - 5:00 PM',
    reportingManager: 'Dr. Meera Nair'
  },
  {
    id: '15',
    employeeId: 'EMP015',
    name: 'Mr. Karthik Nair',
    avatar: 'KN',
    department: 'Physical Education',
    designation: 'Assistant Coach',
    email: 'karthik.nair@school.edu',
    phone: '+91 98765 43224',
    joiningDate: '2023-01-15',
    shift: 'Morning Shift',
    shiftTiming: '7:00 AM - 3:00 PM',
    reportingManager: 'Mr. Vikram Joshi'
  }];

  const branchIds = branches.map((b) => b.id);
  return employeesData.map((emp, index) => {
    const totalWorkdays = 22;
    const present = Math.floor(Math.random() * 8) + 14;
    const late = Math.floor(Math.random() * 4);
    const leave = Math.floor(Math.random() * 3);
    const halfDay = Math.floor(Math.random() * 2);
    const absent = Math.max(0, totalWorkdays - present - leave - halfDay);
    const attendancePercentage = (present + late) / totalWorkdays * 100;
    const avgWorkHours = 7 + Math.random() * 2;
    let status: EmployeeAttendance['status'];
    if (attendancePercentage >= 95) status = 'excellent';else
    if (attendancePercentage >= 85) status = 'good';else
    if (attendancePercentage >= 75) status = 'average';else
    status = 'poor';
    return {
      ...emp,
      branch: branchIds[index % branchIds.length],
      batchYear: batchYears[index % batchYears.length],
      present,
      absent,
      late,
      leave,
      halfDay,
      totalWorkdays,
      attendancePercentage,
      avgWorkHours,
      status
    };
  });
};
// Info Modal Content
const infoContents: Record<string, InfoModalContent> = {
  totalEmployees: {
    title: 'Total Employees',
    description:
    'This KPI shows the total number of employees currently being tracked in the attendance system for the selected filters.',
    whyNecessary:
    'Understanding the total workforce helps in resource planning and calculating attendance percentages accurately.',
    actionRequired:
    'Regularly verify that all active employees are included in the count.',
    tips: [
    'Compare with HR records periodically',
    'Check for recently joined or departed employees']

  },
  presentToday: {
    title: 'Present Today',
    description:
    'Shows the number of employees who have marked their attendance for the current day.',
    whyNecessary:
    'Real-time visibility of workforce availability helps in daily operations planning.',
    actionRequired:
    'If the number is significantly lower than expected, investigate possible causes.',
    tips: [
    'Check for public holidays or special events',
    'Monitor for patterns of low attendance']

  },
  absentToday: {
    title: 'Absent Today',
    description:
    'Displays the count of employees who have not marked attendance and do not have approved leave.',
    whyNecessary: 'Tracking absences helps identify attendance issues early.',
    actionRequired: 'Contact absent employees to verify their status.',
    tips: ['Follow up with department heads for verification']
  },
  avgAttendance: {
    title: 'Average Attendance Rate',
    description:
    'The overall attendance percentage calculated across all employees for the selected period.',
    whyNecessary:
    'This metric provides a health check of organizational discipline.',
    actionRequired:
    'If below 90%, analyze department-wise breakdown to identify problem areas.',
    tips: [
    'Target should be 95%+ for healthy organizations',
    'Compare month-over-month trends']

  },
  onLeave: {
    title: 'On Leave',
    description: 'Number of employees currently on approved leave.',
    whyNecessary:
    'Tracking approved leaves helps distinguish between authorized and unauthorized absences.',
    actionRequired: 'Ensure all leaves are properly approved in the system.',
    tips: ['Check for leave clustering around holidays']
  },
  lateArrivals: {
    title: 'Late Arrivals',
    description:
    'Count of employees who checked in after their scheduled shift start time.',
    whyNecessary: 'Chronic late arrivals impact team productivity and morale.',
    actionRequired:
    'If late arrivals exceed 10% of workforce, review shift timings.',
    tips: [
    'Consider grace period policies',
    'Analyze common late arrival times']

  },
  departmentBreakdown: {
    title: 'Department-wise Attendance',
    description:
    'A breakdown showing attendance statistics for each department.',
    whyNecessary:
    'Department-level analysis helps identify which teams need attention.',
    actionRequired:
    'Departments with below-average attendance should have meetings with HODs.',
    tips: ['Share reports with department heads weekly']
  },
  branchBreakdown: {
    title: 'Branch-wise Attendance',
    description: 'Attendance statistics broken down by school branch/campus.',
    whyNecessary:
    "Multi-location organizations need visibility into each branch's performance.",
    actionRequired:
    'Branches with significantly lower attendance should be audited.',
    tips: ['Consider local holidays and events']
  },
  employeeList: {
    title: 'Employee Attendance Details',
    description:
    'A detailed list of all employees with their individual attendance metrics.',
    whyNecessary:
    'Individual tracking enables performance reviews and accurate payroll records.',
    actionRequired: 'Review employees with poor attendance status.',
    tips: [
    'Export data for detailed analysis',
    'Use filters to focus on specific groups']

  },
  attendanceTrend: {
    title: 'Attendance Trend',
    description:
    'A visual representation of attendance patterns over the selected time period.',
    whyNecessary:
    'Trend analysis helps identify patterns like day-of-week effects or seasonal variations.',
    actionRequired:
    'If trends show declining attendance, investigate potential causes.',
    tips: ['Look for patterns around paydays or month-ends']
  }
};
// ============ COMPONENTS ============
interface MultiSelectProps {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}
function MultiSelect({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Select...'
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };
  const selectAll = () => onChange(options.map((o) => o.value));
  const clearAll = () => onChange([]);
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">

        <div className="flex items-center justify-between">
          <span
            className={
            selectedValues.length > 0 ? 'text-gray-900' : 'text-gray-400'
            }>

            {selectedValues.length > 0 ?
            `${selectedValues.length} selected` :
            placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />

        </div>
      </button>

      {isOpen &&
      <>
          <div
          className="fixed inset-0 z-10"
          onClick={() => setIsOpen(false)} />

          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
              <button
              type="button"
              onClick={selectAll}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium">

                Select All
              </button>
              <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-800 font-medium">

                Clear All
              </button>
            </div>
            {options.map((option) =>
          <label
            key={option.value}
            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleOption(option.value)}>

                <div
              className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedValues.includes(option.value) ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}>

                  {selectedValues.includes(option.value) &&
              <Check className="w-3 h-3 text-white" />
              }
                </div>
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
          )}
          </div>
        </>
      }
    </div>);

}
interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: InfoModalContent | null;
}
function InfoModal({ isOpen, onClose, content }: InfoModalProps) {
  if (!isOpen || !content) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}>

      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}>

        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">{content.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors">

              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-3 h-3 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Description</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-8">
              {content.description}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Why is it Necessary?
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-8">
              {content.whyNecessary}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-3 h-3 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Action Required</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed pl-8">
              {content.actionRequired}
            </p>
          </div>
          {content.tips && content.tips.length > 0 &&
          <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-3 h-3 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Pro Tips</h3>
              </div>
              <ul className="space-y-2 pl-8">
                {content.tips.map((tip, index) =>
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600">

                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
              )}
              </ul>
            </div>
          }
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">

            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>);

}
function InfoButton({ onClick }: {onClick: () => void;}) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 hover:bg-gray-100 rounded-full transition-colors group"
      title="More Information">

      <Info className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
    </button>);

}
function StatusBadge({ status }: {status: EmployeeAttendance['status'];}) {
  const config = {
    excellent: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Excellent'
    },
    good: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      label: 'Good'
    },
    average: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Average'
    },
    poor: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Poor'
    }
  };
  const { bg, text, label } = config[status];
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>

      {label}
    </span>);

}
function SummaryCard({
  children,
  title,
  infoKey,
  onInfoClick





}: {children: React.ReactNode;title?: string;infoKey?: string;onInfoClick?: (key: string) => void;}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {title &&
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {infoKey && onInfoClick &&
        <InfoButton onClick={() => onInfoClick(infoKey)} />
        }
        </div>
      }
      <div className="p-6">{children}</div>
    </div>);

}
// ============ MAIN COMPONENT ============
export function EmployeeAttendanceSummary() {
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedBatchYear, setSelectedBatchYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [infoModal, setInfoModal] = useState<{
    isOpen: boolean;
    contentKey: string | null;
  }>({
    isOpen: false,
    contentKey: null
  });
  const [sortBy, setSortBy] = useState<'name' | 'attendance' | 'department'>(
    'name'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const allEmployees = useMemo(() => generateEmployeeAttendance(), []);
  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((emp) => {
      const matchesSearch =
      searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
      selectedBranches.length === 0 || selectedBranches.includes(emp.branch);
      const matchesBatchYear =
      selectedBatchYear === 'all' ||
      emp.batchYear === parseInt(selectedBatchYear);
      return matchesSearch && matchesBranch && matchesBatchYear;
    });
  }, [allEmployees, searchQuery, selectedBranches, selectedBatchYear]);
  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'attendance':
          comparison = a.attendancePercentage - b.attendancePercentage;
          break;
        case 'department':
          comparison = a.department.localeCompare(b.department);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredEmployees, sortBy, sortOrder]);
  const summaryStats = useMemo(() => {
    const total = filteredEmployees.length;
    const presentToday = filteredEmployees.filter((e) => e.present > 0).length;
    const absentToday = filteredEmployees.filter((e) => e.absent > 0).length;
    const onLeave = filteredEmployees.filter((e) => e.leave > 0).length;
    const lateArrivals = filteredEmployees.filter((e) => e.late > 0).length;
    const avgAttendance =
    total > 0 ?
    filteredEmployees.reduce(
      (sum, e) => sum + e.attendancePercentage,
      0
    ) / total :
    0;
    const excellent = filteredEmployees.filter(
      (e) => e.status === 'excellent'
    ).length;
    const good = filteredEmployees.filter((e) => e.status === 'good').length;
    const average = filteredEmployees.filter(
      (e) => e.status === 'average'
    ).length;
    const poor = filteredEmployees.filter((e) => e.status === 'poor').length;
    return {
      total,
      presentToday,
      absentToday,
      onLeave,
      lateArrivals,
      avgAttendance,
      excellent,
      good,
      average,
      poor
    };
  }, [filteredEmployees]);
  const departmentStats = useMemo(() => {
    const stats: Record<
      string,
      {
        total: number;
        present: number;
        avgAttendance: number;
      }> =
    {};
    filteredEmployees.forEach((emp) => {
      if (!stats[emp.department])
      stats[emp.department] = {
        total: 0,
        present: 0,
        avgAttendance: 0
      };
      stats[emp.department].total++;
      stats[emp.department].present += emp.present;
      stats[emp.department].avgAttendance += emp.attendancePercentage;
    });
    return Object.entries(stats).
    map(([dept, data]) => ({
      department: dept,
      total: data.total,
      avgAttendance: data.avgAttendance / data.total
    })).
    sort((a, b) => b.avgAttendance - a.avgAttendance);
  }, [filteredEmployees]);
  const branchStats = useMemo(() => {
    const stats: Record<
      string,
      {
        total: number;
        avgAttendance: number;
      }> =
    {};
    filteredEmployees.forEach((emp) => {
      if (!stats[emp.branch])
      stats[emp.branch] = {
        total: 0,
        avgAttendance: 0
      };
      stats[emp.branch].total++;
      stats[emp.branch].avgAttendance += emp.attendancePercentage;
    });
    return Object.entries(stats).
    map(([branchId, data]) => ({
      branchId,
      branchName: branches.find((b) => b.id === branchId)?.name || branchId,
      total: data.total,
      avgAttendance: data.avgAttendance / data.total
    })).
    sort((a, b) => b.avgAttendance - a.avgAttendance);
  }, [filteredEmployees]);
  const openInfoModal = (key: string) =>
  setInfoModal({
    isOpen: true,
    contentKey: key
  });
  const closeInfoModal = () =>
  setInfoModal({
    isOpen: false,
    contentKey: null
  });
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranches([]);
    setSelectedBatchYear('all');
  };
  const hasActiveFilters =
  searchQuery !== '' ||
  selectedBranches.length > 0 ||
  selectedBatchYear !== 'all';
  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');else
    {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
  const weeklyTrendData = useMemo(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => ({
      day,
      value: 75 + Math.random() * 20
    }));
  }, []);
  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Attendance Summary
          </h1>
          <p className="text-sm text-gray-500">
            Overview of employee attendance across all branches •{' '}
            {months[selectedMonth]} {new Date().getFullYear()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">

            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters &&
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              {hasActiveFilters &&
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800 font-medium">

                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </button>
            }
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                  type="text"
                  placeholder="Name, ID, Department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                </div>
              </div>
              <MultiSelect
              label="School Branch"
              placeholder="All Branches"
              options={branches.map((b) => ({
                value: b.id,
                label: b.name
              }))}
              selectedValues={selectedBranches}
              onChange={setSelectedBranches} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Year
                </label>
                <select
                value={selectedBatchYear}
                onChange={(e) => setSelectedBatchYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">

                  <option value="all">All Years</option>
                  {batchYears.map((year) =>
                <option key={year} value={year.toString()}>
                      {year}
                    </option>
                )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                value={selectedMonth.toString()}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">

                  {months.map((month, index) =>
                <option key={month} value={index.toString()}>
                      {month}
                    </option>
                )}
                </select>
              </div>
            </div>
            {hasActiveFilters &&
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-500">Active:</span>
                {searchQuery &&
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
            }
                {selectedBranches.length > 0 &&
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    {selectedBranches.length} Branch(es)
                    <button onClick={() => setSelectedBranches([])}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
            }
                {selectedBatchYear !== 'all' &&
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                    Batch: {selectedBatchYear}
                    <button onClick={() => setSelectedBatchYear('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
            }
              </div>
          }
          </div>
        </div>
      }

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('totalEmployees')} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {summaryStats.total}
          </p>
          <p className="text-xs text-gray-500">Total Employees</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('presentToday')} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {summaryStats.presentToday}
          </p>
          <p className="text-xs text-gray-500">Present Today</p>
          <div className="flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3 h-3 text-green-500" />
            <span className="text-xs text-green-600">
              {summaryStats.total > 0 ?
              (
              summaryStats.presentToday / summaryStats.total *
              100).
              toFixed(0) :
              0}
              %
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('absentToday')} />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {summaryStats.absentToday}
          </p>
          <p className="text-xs text-gray-500">Absent Today</p>
          {summaryStats.absentToday > 3 &&
          <div className="flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600">High</span>
            </div>
          }
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-teal-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('avgAttendance')} />
          </div>
          <p className="text-2xl font-bold text-teal-600">
            {summaryStats.avgAttendance.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-500">Avg Attendance</p>
          <div className="flex items-center gap-1 mt-1">
            {summaryStats.avgAttendance >= 90 ?
            <>
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">Good</span>
              </> :

            <>
                <TrendingDown className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-600">
                  Needs Improvement
                </span>
              </>
            }
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Umbrella className="w-5 h-5 text-purple-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('onLeave')} />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {summaryStats.onLeave}
          </p>
          <p className="text-xs text-gray-500">On Leave</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <InfoButton onClick={() => openInfoModal('lateArrivals')} />
          </div>
          <p className="text-2xl font-bold text-yellow-600">
            {summaryStats.lateArrivals}
          </p>
          <p className="text-xs text-gray-500">Late Arrivals</p>
        </div>
      </div>

      {/* Status Distribution & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummaryCard
          title="Attendance Status Distribution"
          infoKey="avgAttendance"
          onInfoClick={openInfoModal}>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {summaryStats.excellent}
              </p>
              <p className="text-xs text-gray-500">Excellent</p>
              <p className="text-xs text-green-600">≥95%</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {summaryStats.good}
              </p>
              <p className="text-xs text-gray-500">Good</p>
              <p className="text-xs text-blue-600">85-94%</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {summaryStats.average}
              </p>
              <p className="text-xs text-gray-500">Average</p>
              <p className="text-xs text-yellow-600">75-84%</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="w-10 h-10 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                {summaryStats.poor}
              </p>
              <p className="text-xs text-gray-500">Poor</p>
              <p className="text-xs text-red-600">&lt;75%</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
              {summaryStats.total > 0 &&
              <>
                  <div
                  className="bg-green-500 transition-all"
                  style={{
                    width: `${summaryStats.excellent / summaryStats.total * 100}%`
                  }} />

                  <div
                  className="bg-blue-500 transition-all"
                  style={{
                    width: `${summaryStats.good / summaryStats.total * 100}%`
                  }} />

                  <div
                  className="bg-yellow-500 transition-all"
                  style={{
                    width: `${summaryStats.average / summaryStats.total * 100}%`
                  }} />

                  <div
                  className="bg-red-500 transition-all"
                  style={{
                    width: `${summaryStats.poor / summaryStats.total * 100}%`
                  }} />

                </>
              }
            </div>
          </div>
        </SummaryCard>

        <SummaryCard
          title="Department-wise Attendance"
          infoKey="departmentBreakdown"
          onInfoClick={openInfoModal}>

          <div className="space-y-3">
            {departmentStats.slice(0, 6).map((dept, index) =>
            <div key={dept.department} className="flex items-center gap-4">
                <div className="w-8 text-center">
                  <span
                  className={`text-sm font-bold ${index < 3 ? 'text-teal-600' : 'text-gray-500'}`}>

                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {dept.department}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {dept.avgAttendance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                    className={`h-full rounded-full transition-all ${dept.avgAttendance >= 90 ? 'bg-green-500' : dept.avgAttendance >= 80 ? 'bg-teal-500' : dept.avgAttendance >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{
                      width: `${dept.avgAttendance}%`
                    }} />

                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-xs text-gray-500">
                    {dept.total} staff
                  </span>
                </div>
              </div>
            )}
            {departmentStats.length === 0 &&
            <div className="text-center py-8 text-gray-500">
                <Building className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No department data available</p>
              </div>
            }
          </div>
        </SummaryCard>
      </div>

      {/* Branch Breakdown */}
      <SummaryCard
        title="Branch-wise Attendance Overview"
        infoKey="branchBreakdown"
        onInfoClick={openInfoModal}>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {branchStats.map((branch, index) =>
          <div
            key={branch.branchId}
            className={`p-4 rounded-xl border-2 ${index === 0 ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-white'}`}>

              <div className="flex items-center gap-3 mb-3">
                <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-teal-200' : 'bg-gray-100'}`}>

                  <Building
                  className={`w-5 h-5 ${index === 0 ? 'text-teal-700' : 'text-gray-600'}`} />

                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {branch.branchName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {branch.total} employees
                  </p>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p
                  className={`text-2xl font-bold ${branch.avgAttendance >= 90 ? 'text-green-600' : branch.avgAttendance >= 80 ? 'text-teal-600' : 'text-orange-600'}`}>

                    {branch.avgAttendance.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">Avg Attendance</p>
                </div>
                {index === 0 &&
              <div className="px-2 py-1 bg-teal-200 rounded-full">
                    <span className="text-xs font-medium text-teal-800">
                      Best
                    </span>
                  </div>
              }
              </div>
            </div>
          )}
          {branchStats.length === 0 &&
          <div className="col-span-full text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No branch data available</p>
            </div>
          }
        </div>
      </SummaryCard>

      {/* Employee List */}
      <SummaryCard
        title="Employee Attendance Details"
        infoKey="employeeList"
        onInfoClick={openInfoModal}>

        <div className="mb-4 flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
            {filteredEmployees.length} employees
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-900"
                    onClick={() => handleSort('name')}>

                    Employee
                    {sortBy === 'name' &&
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />

                    }
                  </button>
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-900"
                    onClick={() => handleSort('department')}>

                    Department
                    {sortBy === 'department' &&
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />

                    }
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Present
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Absent
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Late
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    className="flex items-center gap-1 hover:text-gray-900 mx-auto"
                    onClick={() => handleSort('attendance')}>

                    Attendance %
                    {sortBy === 'attendance' &&
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />

                    }
                  </button>
                </th>
                <th className="text-center py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.map((emp) => {
                const branchName =
                branches.find((b) => b.id === emp.branch)?.name || emp.branch;
                return (
                  <tr
                    key={emp.id}
                    className="border-b border-gray-100 hover:bg-gray-50">

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center text-sm font-bold">
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {emp.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {emp.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-700">{emp.department}</p>
                      <p className="text-xs text-gray-500">{emp.designation}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                        {branchName}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-green-600 font-semibold">
                        {emp.present}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-semibold ${emp.absent > 2 ? 'text-red-600' : 'text-gray-600'}`}>

                        {emp.absent}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-semibold ${emp.late > 2 ? 'text-yellow-600' : 'text-gray-600'}`}>

                        {emp.late}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-purple-600 font-semibold">
                        {emp.leave}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${emp.attendancePercentage >= 95 ? 'bg-green-500' : emp.attendancePercentage >= 85 ? 'bg-teal-500' : emp.attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{
                              width: `${emp.attendancePercentage}%`
                            }} />

                        </div>
                        <span
                          className={`text-sm font-bold ${emp.attendancePercentage >= 95 ? 'text-green-600' : emp.attendancePercentage >= 85 ? 'text-teal-600' : emp.attendancePercentage >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>

                          {emp.attendancePercentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={emp.status} />
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
        {filteredEmployees.length === 0 &&
        <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No employees found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters</p>
          </div>
        }
      </SummaryCard>

      {/* Weekly Trend */}
      <SummaryCard
        title="Weekly Attendance Trend"
        infoKey="attendanceTrend"
        onInfoClick={openInfoModal}>

        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {weeklyTrendData.map((item) =>
          <div key={item.day} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end h-48">
                <span className="text-xs font-semibold text-gray-700 mb-1">
                  {item.value.toFixed(0)}%
                </span>
                <div
                className={`w-full max-w-[40px] rounded-t-lg transition-all ${item.value >= 90 ? 'bg-green-500' : item.value >= 80 ? 'bg-teal-500' : item.value >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{
                  height: `${item.value}%`
                }} />

              </div>
              <span className="text-sm text-gray-600 mt-2">{item.day}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500" />
            <span className="text-xs text-gray-600">≥90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-teal-500" />
            <span className="text-xs text-gray-600">80-89%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <span className="text-xs text-gray-600">70-79%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500" />
            <span className="text-xs text-gray-600">&lt;70%</span>
          </div>
        </div>
      </SummaryCard>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors text-left">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5 text-teal-600" />
            </div>
            <p className="font-medium text-gray-900">Generate Report</p>
            <p className="text-xs text-gray-500">Monthly attendance report</p>
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <p className="font-medium text-gray-900">View Calendar</p>
            <p className="text-xs text-gray-500">Monthly calendar view</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="font-medium text-gray-900">Review Absences</p>
            <p className="text-xs text-gray-500">
              {summaryStats.poor} employees need attention
            </p>
          </button>
          <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
              <Activity className="w-5 h-5 text-orange-600" />
            </div>
            <p className="font-medium text-gray-900">Analytics</p>
            <p className="text-xs text-gray-500">Detailed analytics</p>
          </button>
        </div>
      </div>

      <InfoModal
        isOpen={infoModal.isOpen}
        onClose={closeInfoModal}
        content={
        infoModal.contentKey ? infoContents[infoModal.contentKey] : null
        } />

    </div>);

}
// Alias export for registry compatibility
export { EmployeeAttendanceSummary as AttendanceSummary };