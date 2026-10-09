import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Select } from '../../../components/ui/Select';
import {
  Download,
  Upload,
  Search,
  Filter,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Clock,
  Settings,
  Eye,
  Edit,
  MoreHorizontal,
  Info,
  X } from
'lucide-react';

interface MusterEmployee {
  id: string;
  name: string;
  department: string;
  designation: string;
  attendance: string[];
  summary: Record<string, number>;
}

interface Notice {
  type: 'success' | 'error' | 'info';
  text: string;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }];

const YEARS = ['2022', '2023', '2024', '2025', '2026'];

// Sample attendance is only stored for January 2024.
const SAMPLE_YEAR = '2024';
const SAMPLE_MONTH = '01';

const PAGE_SIZES = ['10', '25', '50', '100'];

const SEARCH_FIELDS = [
  { value: 'all', label: 'All fields' },
  { value: 'name', label: 'Employee name' },
  { value: 'id', label: 'Employee ID' },
  { value: 'designation', label: 'Designation' },
  { value: 'department', label: 'Department' }];

const SUMMARY_COLUMNS = [
  { code: 'P', label: 'P', head: 'bg-green-50', cell: 'text-green-600 bg-green-50/50' },
  { code: 'A', label: 'A', head: 'bg-red-50', cell: 'text-red-600 bg-red-50/50' },
  { code: 'L', label: 'L', head: 'bg-blue-50', cell: 'text-blue-600 bg-blue-50/50' },
  { code: 'WO', label: 'WO', head: 'bg-gray-100', cell: 'text-gray-600 bg-gray-50' },
  { code: 'H', label: 'H', head: 'bg-purple-50', cell: 'text-purple-600 bg-purple-50/50' },
  { code: 'HD', label: 'HD', head: 'bg-yellow-50', cell: 'text-yellow-600 bg-yellow-50/50' }];

const SUMMARY_KEY: Record<string, string> = {
  P: 'present',
  A: 'absent',
  L: 'leave',
  WO: 'wo',
  H: 'holiday',
  HD: 'halfDay'
};

const summaryKeyOf = (code: string) => SUMMARY_KEY[code] ?? code.toLowerCase();

const attendanceCodes: Record<string, { label: string; color: string }> = {
  P: {
    label: 'Present',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  A: {
    label: 'Absent',
    color: 'bg-red-100 text-red-700 border-red-200'
  },
  L: {
    label: 'Leave',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  WO: {
    label: 'Week Off',
    color: 'bg-gray-100 text-gray-500 border-gray-200'
  },
  H: {
    label: 'Holiday',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  HD: {
    label: 'Half Day',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200'
  },
  WFH: {
    label: 'Work From Home',
    color: 'bg-teal-100 text-teal-700 border-teal-200'
  },
  OD: {
    label: 'On Duty',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  },
  CO: {
    label: 'Comp Off',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  LOP: {
    label: 'Loss of Pay',
    color: 'bg-red-200 text-red-800 border-red-300'
  }
};

const CODE_OPTIONS = Object.keys(attendanceCodes).map((code) => ({
  value: code,
  label: `${code} — ${attendanceCodes[code].label}`
}));

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const cloneSeed = (): MusterEmployee[] => JSON.parse(JSON.stringify(EMPLOYEE_SEED));

// Applies one attendance code to one employee/day and keeps the summary counters in step.
const patchEmployee = (emp: MusterEmployee, day: number, code: string): MusterEmployee => {
  const oldCode = emp.attendance[day - 1];
  if (oldCode === code) return emp;
  const attendance = emp.attendance.slice();
  attendance[day - 1] = code;
  const summary = { ...emp.summary };
  if (oldCode) {
    const oldKey = summaryKeyOf(oldCode);
    summary[oldKey] = Math.max(0, (summary[oldKey] || 0) - 1);
  }
  const newKey = summaryKeyOf(code);
  summary[newKey] = (summary[newKey] || 0) + 1;
  return { ...emp, attendance, summary };
};

const applyEdits = (list: MusterEmployee[], edits: { empId: string; day: number; code: string }[]) => {
  let next = list;
  edits.forEach(({ empId, day, code }) => {
    next = next.map((emp) => (emp.id === empId ? patchEmployee(emp, day, code) : emp));
  });
  return next;
};

const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const cellClass = (code: string) => {
  const style = attendanceCodes[code];
  return style ? style.color : 'bg-gray-50 text-gray-400 border-gray-200';
};

const EMPLOYEE_SEED: MusterEmployee[] = [
  {
    id: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'L',
    'L',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 22,
      absent: 0,
      leave: 2,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    designation: 'HR Manager',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'A',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 23,
      absent: 1,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP003',
    name: 'Robert Johnson',
    department: 'Finance',
    designation: 'Accountant',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'WFH',
    'WFH',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 20,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      wfh: 2
    }
  },
  {
    id: 'EMP004',
    name: 'Emily Davis',
    department: 'Marketing',
    designation: 'Marketing Lead',
    attendance: [
    'P',
    'P',
    'P',
    'HD',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'A',
    'A',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 20,
      absent: 2,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 1
    }
  },
  {
    id: 'EMP005',
    name: 'Michael Brown',
    department: 'Engineering',
    designation: 'Developer',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'L',
    'L',
    'L',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 21,
      absent: 0,
      leave: 3,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP006',
    name: 'Sarah Wilson',
    department: 'Operations',
    designation: 'Operations Manager',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'OD',
    'OD',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 21,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      od: 2
    }
  },
  {
    id: 'EMP007',
    name: 'David Lee',
    department: 'IT Support',
    designation: 'IT Administrator',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 24,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  },
  {
    id: 'EMP008',
    name: 'Lisa Anderson',
    department: 'Sales',
    designation: 'Sales Executive',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'LOP',
    'LOP',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 22,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      lop: 2
    }
  },
  {
    id: 'EMP009',
    name: 'James Taylor',
    department: 'Engineering',
    designation: 'Tech Lead',
    attendance: [
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'CO',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P'],

    summary: {
      present: 23,
      absent: 0,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0,
      co: 1
    }
  },
  {
    id: 'EMP010',
    name: 'Jennifer Martinez',
    department: 'HR',
    designation: 'HR Executive',
    attendance: [
    'A',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'H',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'P',
    'P',
    'WO',
    'WO',
    'P',
    'P',
    'P',
    'A'],

    summary: {
      present: 22,
      absent: 2,
      leave: 0,
      wo: 6,
      holiday: 1,
      halfDay: 0
    }
  }];


export function MonthlyAttendanceRegisterHr() {
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [records, setRecords] = useState<MusterEmployee[]>(cloneSeed);
  const [searchBy, setSearchBy] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [codeFilter, setCodeFilter] = useState('all');
  const [pageSize, setPageSize] = useState('10');
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState<'filters' | 'columns' | null>(null);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SUMMARY_COLUMNS.map((col) => [col.code, true]))
  );
  const [notice, setNotice] = useState<Notice | null>(null);

  const [viewId, setViewId] = useState<string | null>(null);
  const [actionsId, setActionsId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ empId: string; day: string; code: string } | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkIds, setBulkIds] = useState<string[]>([]);
  const [bulkDay, setBulkDay] = useState('1');
  const [bulkCode, setBulkCode] = useState('P');
  const [holidayOpen, setHolidayOpen] = useState(false);
  const [holidayDay, setHolidayDay] = useState('1');
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const monthNum = Number(selectedMonth);
  const yearNum = Number(selectedYear);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const isSampleMonth = selectedYear === SAMPLE_YEAR && selectedMonth === SAMPLE_MONTH;
  const monthLabel = `${MONTHS[monthNum - 1].label} ${selectedYear}`;

  const getDayName = (day: number) => WEEKDAYS[new Date(yearNum, monthNum - 1, day).getDay()];
  const isWeekend = (day: number) => {
    const weekday = new Date(yearNum, monthNum - 1, day).getDay();
    return weekday === 0 || weekday === 6;
  };

  const departments = Array.from(new Set(EMPLOYEE_SEED.map((emp) => emp.department)));
  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map((dept) => ({ value: dept, label: dept }))];

  // Search + department + attendance-code filters
  const term = searchText.trim().toLowerCase();
  const filtered = records.filter((emp) => {
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    const matchesCode =
      codeFilter === 'all' || (isSampleMonth && emp.attendance.includes(codeFilter));
    const fields: Record<string, string[]> = {
      all: [emp.name, emp.id, emp.designation, emp.department],
      name: [emp.name],
      id: [emp.id],
      designation: [emp.designation],
      department: [emp.department]
    };
    const matchesSearch =
      term === '' || (fields[searchBy] || fields.all).some((value) => value.toLowerCase().includes(term));
    return matchesDept && matchesCode && matchesSearch;
  });

  const perPage = Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice((safePage - 1) * perPage, safePage * perPage);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1;
  const rangeEnd = Math.min(safePage * perPage, filtered.length);

  const cellCode = (emp: MusterEmployee, day: number) => (isSampleMonth ? emp.attendance[day - 1] : undefined);

  const totals = SUMMARY_COLUMNS.reduce<Record<string, number>>((acc, col) => {
    acc[col.code] = filtered.reduce((sum, emp) => sum + (emp.summary[summaryKeyOf(col.code)] || 0), 0);
    return acc;
  }, {});

  const hasActiveFilters = deptFilter !== 'all' || codeFilter !== 'all' || term !== '' || searchBy !== 'all';

  const clearFilters = () => {
    setSearchText('');
    setSearchBy('all');
    setDeptFilter('all');
    setCodeFilter('all');
    setPage(1);
  };

  const shiftMonth = (delta: number) => {
    const next = new Date(yearNum, monthNum - 1 + delta, 1);
    setSelectedMonth(String(next.getMonth() + 1).padStart(2, '0'));
    setSelectedYear(String(next.getFullYear()));
    setPage(1);
    setNotice({ type: 'info', text: `Showing ${MONTHS[next.getMonth()].label} ${next.getFullYear()}.` });
  };

  const requireSampleMonth = (action: string) => {
    if (isSampleMonth) return true;
    setNotice({
      type: 'error',
      text: `${action} is available for ${MONTHS[Number(SAMPLE_MONTH) - 1].label} ${SAMPLE_YEAR} (sample data) only.`
    });
    return false;
  };

  // Header buttons
  const handleRefresh = () => {
    setRecords(cloneSeed());
    clearFilters();
    setPanel(null);
    setNotice({ type: 'success', text: 'Register reloaded. Filters cleared and unsaved edits discarded.' });
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      setNotice({ type: 'error', text: 'Printing is not available in this browser.' });
    }
  };

  const gridRows = () => {
    const header = ['Employee ID', 'Employee', 'Designation', 'Department', ...days.map((d) => `${d} ${getDayName(d)}`), ...SUMMARY_COLUMNS.map((c) => c.label)];
    const body = filtered.map((emp) => [
      emp.id,
      emp.name,
      emp.designation,
      emp.department,
      ...days.map((d) => cellCode(emp, d) ?? ''),
      ...SUMMARY_COLUMNS.map((c) => (isSampleMonth ? emp.summary[summaryKeyOf(c.code)] || 0 : ''))
    ]);
    return [header, ...body];
  };

  const handleExportExcel = () => {
    if (filtered.length === 0) return;
    downloadCsv(`monthly-attendance-register-${selectedYear}-${selectedMonth}.csv`, gridRows());
    setNotice({ type: 'success', text: `Exported ${filtered.length} employee row(s) for ${monthLabel} (opens in Excel).` });
  };

  const handleDownloadReport = () => {
    const rows: (string | number)[][] = [['Department', 'Employees', 'Present (P)', 'Absent (A)', 'Leave (L)', 'Week Off (WO)', 'Holiday (H)', 'Half Day (HD)']];
    departments.forEach((dept) => {
      const members = records.filter((emp) => emp.department === dept);
      const sum = (key: string) => members.reduce((total, emp) => total + (emp.summary[key] || 0), 0);
      rows.push([dept, members.length, sum('present'), sum('absent'), sum('leave'), sum('wo'), sum('holiday'), sum('halfDay')]);
    });
    downloadCsv(`attendance-department-summary-${selectedYear}-${selectedMonth}.csv`, rows);
    setNotice({ type: 'success', text: `Department summary for ${monthLabel} downloaded.` });
  };

  const handleGenerateMusterRoll = () => {
    if (!requireSampleMonth('Muster roll generation')) return;
    const rows: (string | number)[][] = [['Employee ID', 'Employee', 'Department', 'Present', 'Absent', 'Leave', 'Week Off', 'Holiday', 'Half Day', 'Payable Days']];
    records.forEach((emp) => {
      const s = emp.summary;
      const payable = (s.present || 0) + (s.leave || 0) + (s.wo || 0) + (s.holiday || 0) + (s.halfDay || 0) * 0.5;
      rows.push([emp.id, emp.name, emp.department, s.present || 0, s.absent || 0, s.leave || 0, s.wo || 0, s.holiday || 0, s.halfDay || 0, payable]);
    });
    downloadCsv(`muster-roll-${selectedYear}-${selectedMonth}.csv`, rows);
    setNotice({ type: 'success', text: `Muster roll for ${monthLabel} generated for ${records.length} employees.` });
  };

  // Row actions
  const viewEmp = records.find((emp) => emp.id === viewId) ?? null;
  const actionsEmp = records.find((emp) => emp.id === actionsId) ?? null;

  const exportEmployee = (emp: MusterEmployee) => {
    const rows: (string | number)[][] = [
      ['Date', 'Day', 'Status'],
      ...days.map((d) => [`${selectedYear}-${selectedMonth}-${String(d).padStart(2, '0')}`, getDayName(d), cellCode(emp, d) ?? ''])];
    downloadCsv(`attendance-${emp.id}-${selectedYear}-${selectedMonth}.csv`, rows);
    setNotice({ type: 'success', text: `Attendance for ${emp.name} downloaded.` });
  };

  const resetEmployee = (emp: MusterEmployee) => {
    const seed = EMPLOYEE_SEED.find((item) => item.id === emp.id);
    if (!seed) return;
    setRecords((list) => list.map((item) => (item.id === emp.id ? JSON.parse(JSON.stringify(seed)) : item)));
    setActionsId(null);
    setNotice({ type: 'success', text: `${emp.name}'s register restored to the sample data.` });
  };

  const openEdit = (emp: MusterEmployee) => {
    if (!requireSampleMonth('Editing attendance')) return;
    setModalError(null);
    setEditDraft({ empId: emp.id, day: '1', code: emp.attendance[0] || 'P' });
  };

  const saveEdit = () => {
    if (!editDraft) return;
    const emp = records.find((item) => item.id === editDraft.empId);
    if (!emp) return;
    setRecords((list) => applyEdits(list, [{ empId: emp.id, day: Number(editDraft.day), code: editDraft.code }]));
    setEditDraft(null);
    setNotice({
      type: 'success',
      text: `${emp.name}: day ${editDraft.day} set to ${editDraft.code} (${attendanceCodes[editDraft.code].label}).`
    });
  };

  // Bulk actions
  const openBulk = () => {
    if (!requireSampleMonth('Bulk edit')) return;
    setModalError(null);
    setBulkIds(filtered.map((emp) => emp.id));
    setBulkDay('1');
    setBulkCode('P');
    setBulkOpen(true);
  };

  const toggleBulkId = (id: string) => {
    setBulkIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const saveBulk = () => {
    if (bulkIds.length === 0) {
      setModalError('Select at least one employee.');
      return;
    }
    const edits = bulkIds.map((empId) => ({ empId, day: Number(bulkDay), code: bulkCode }));
    setRecords((list) => applyEdits(list, edits));
    setBulkOpen(false);
    setNotice({
      type: 'success',
      text: `${bulkIds.length} employee(s): day ${bulkDay} set to ${bulkCode} (${attendanceCodes[bulkCode].label}).`
    });
  };

  const openHoliday = () => {
    if (!requireSampleMonth('Marking a holiday')) return;
    setModalError(null);
    setHolidayDay('1');
    setHolidayOpen(true);
  };

  const saveHoliday = () => {
    const day = Number(holidayDay);
    setRecords((list) => applyEdits(list, list.map((emp) => ({ empId: emp.id, day, code: 'H' }))));
    setHolidayOpen(false);
    setNotice({ type: 'success', text: `${MONTHS[monthNum - 1].label} ${holidayDay} marked as Holiday (H) for ${records.length} employees.` });
  };

  const openImport = () => {
    if (!requireSampleMonth('Import')) return;
    setModalError(null);
    setImportFile(null);
    setImportOpen(true);
  };

  const runImport = async () => {
    if (!importFile) return;
    const text = await importFile.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const edits: { empId: string; day: number; code: string }[] = [];
    let skipped = 0;
    lines.forEach((line) => {
      const [rawId, rawDay, rawCode] = line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, ''));
      const day = Number(rawDay);
      const code = (rawCode || '').toUpperCase();
      const exists = records.some((emp) => emp.id === rawId);
      const validRow = exists && Number.isInteger(day) && day >= 1 && day <= daysInMonth && !!attendanceCodes[code];
      if (validRow) edits.push({ empId: rawId, day, code });
      else skipped += 1;
    });
    if (edits.length === 0) {
      setModalError('No valid rows found. Use the format employee_id,day,status (for example EMP001,12,P).');
      return;
    }
    setRecords((list) => applyEdits(list, edits));
    setImportOpen(false);
    setNotice({
      type: skipped ? 'info' : 'success',
      text: `Imported ${edits.length} attendance entr${edits.length === 1 ? 'y' : 'ies'}${skipped ? `; ${skipped} row(s) skipped` : ''}.`
    });
  };

  const getAttendanceCell = (code: string | undefined) => (
    <span
      className={`inline-flex items-center justify-center w-8 h-6 text-xs font-semibold rounded border ${code ? cellClass(code) : 'bg-white text-gray-300 border-gray-100'}`}>
      {code || '–'}
    </span>);

  const inputClass = 'pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Monthly Attendance Register
          </h1>
          <p className="text-sm text-gray-500">
            Muster roll view with daily attendance for all employees
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportExcel} disabled={filtered.length === 0}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="primary" onClick={handleDownloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {notice &&
      <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : notice.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100" title="Dismiss">
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {!isSampleMonth &&
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-800">
            Sample attendance is loaded for {MONTHS[Number(SAMPLE_MONTH) - 1].label} {SAMPLE_YEAR} only. {monthLabel} shows empty cells and cannot be edited.
          </p>
        </div>
      }

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button variant="outline" className="p-2" onClick={() => shiftMonth(-1)} title="Previous month">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2 px-2">
                  <Select
                    options={MONTHS}
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setPage(1);
                    }} />
                  <Select
                    options={YEARS.map((year) => ({ value: year, label: year }))}
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setPage(1);
                    }} />
                </div>
                <Button variant="outline" className="p-2" onClick={() => shiftMonth(1)} title="Next month">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Select
                options={departmentOptions}
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setPage(1);
                }} />

              <div className="flex flex-wrap items-center gap-2">
                <div className="w-44">
                  <Select
                    options={SEARCH_FIELDS}
                    value={searchBy}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                      setPage(1);
                    }} />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search employee..."
                    className={`${inputClass} w-56`} />
                </div>
                {searchText &&
                <button type="button" onClick={() => { setSearchText(''); setPage(1); }} className="text-xs text-blue-700 hover:underline">
                    Clear search
                  </button>
                }
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Button variant="outline" onClick={() => setPanel(panel === 'filters' ? null : 'filters')}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filters{hasActiveFilters ? ' •' : ''}
                </Button>
                {panel === 'filters' &&
                <div className="absolute right-0 z-30 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3">
                    <Select
                      label="Has attendance code"
                      options={[{ value: 'all', label: 'Any status' }, ...CODE_OPTIONS]}
                      value={codeFilter}
                      onChange={(e) => {
                        setCodeFilter(e.target.value);
                        setPage(1);
                      }} />
                    {!isSampleMonth && <p className="text-xs text-gray-500">Status filters need sample data ({MONTHS[Number(SAMPLE_MONTH) - 1].label} {SAMPLE_YEAR}).</p>}
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={clearFilters}>Clear all filters</Button>
                      <Button variant="primary" onClick={() => setPanel(null)}>Done</Button>
                    </div>
                  </div>
                }
              </div>

              <div className="relative">
                <Button variant="outline" onClick={() => setPanel(panel === 'columns' ? null : 'columns')}>
                  <Settings className="w-4 h-4 mr-2" />
                  Column Settings
                </Button>
                {panel === 'columns' &&
                <div className="absolute right-0 z-30 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Summary columns</p>
                    {SUMMARY_COLUMNS.map((col) =>
                    <label key={col.code} className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={visibleCols[col.code]}
                          onChange={() => setVisibleCols((cols) => ({ ...cols, [col.code]: !cols[col.code] }))}
                          className="rounded border-gray-300" />
                        {col.code} {col.code === 'P' ? '(Present)' : col.code === 'A' ? '(Absent)' : col.code === 'L' ? '(Leave)' : col.code === 'WO' ? '(Week Off)' : col.code === 'H' ? '(Holiday)' : '(Half Day)'}
                      </label>
                    )}
                    <div className="pt-2 border-t">
                      <Button variant="outline" className="w-full" onClick={() => setPanel(null)}>Close</Button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Showing {filtered.length} of {records.length} employees</span>
            <span>·</span>
            <span>{monthLabel}</span>
            {hasActiveFilters &&
            <button type="button" onClick={clearFilters} className="text-blue-700 hover:underline">Reset filters</button>
            }
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 border-r min-w-[40px]">
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-10 bg-gray-50 z-20 border-r min-w-[60px]">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-24 bg-gray-50 z-20 border-r min-w-[150px]">
                      Employee
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-48 bg-gray-50 z-20 border-r min-w-[100px]">
                      Dept
                    </th>
                    {days.map((day) =>
                    <th
                      key={day}
                      className={`px-1 py-2 text-center text-xs font-medium uppercase tracking-wider min-w-[36px] ${isWeekend(day) ? 'bg-gray-200 text-gray-600' : 'bg-gray-50 text-gray-500'}`}>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-400">{getDayName(day)}</span>
                          <span className="font-bold">{day}</span>
                        </div>
                      </th>
                    )}
                    {SUMMARY_COLUMNS.filter((col) => visibleCols[col.code]).map((col) =>
                    <th key={col.code} className={`px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[40px] ${col.head}`}>
                        {col.label}
                      </th>
                    )}
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-l min-w-[90px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pageRows.length === 0 &&
                  <tr>
                      <td colSpan={days.length + 5} className="px-4 py-10 text-center text-sm text-gray-500">
                        No employees match the current search or filters.
                      </td>
                    </tr>
                  }
                  {pageRows.map((employee, index) =>
                  <tr key={employee.id} className="hover:bg-blue-50/50">
                      <td className="px-2 py-2 text-xs text-gray-500 sticky left-0 bg-white z-10 border-r">
                        {rangeStart + index}
                      </td>
                      <td className="px-3 py-2 text-xs font-medium text-blue-600 sticky left-10 bg-white z-10 border-r">
                        {employee.id}
                      </td>
                      <td className="px-3 py-2 sticky left-24 bg-white z-10 border-r">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-medium text-white">
                              {employee.name.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{employee.name}</p>
                            <p className="text-[10px] text-gray-500 truncate">{employee.designation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 sticky left-48 bg-white z-10 border-r">
                        {employee.department}
                      </td>
                      {days.map((day) =>
                      <td key={day} className={`px-1 py-1 text-center ${isWeekend(day) ? 'bg-gray-50' : ''}`}>
                          {getAttendanceCell(cellCode(employee, day))}
                        </td>
                      )}
                      {SUMMARY_COLUMNS.filter((col) => visibleCols[col.code]).map((col) =>
                      <td key={col.code} className={`px-2 py-2 text-center text-sm font-bold ${col.cell}`}>
                          {isSampleMonth ? employee.summary[summaryKeyOf(col.code)] || 0 : '–'}
                        </td>
                      )}
                      <td className="px-3 py-2 text-center border-l">
                        <div className="flex items-center justify-center gap-1">
                          <button type="button" className="p-1 hover:bg-gray-200 rounded" title="View" onClick={() => setViewId(employee.id)}>
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded" title="Edit" onClick={() => openEdit(employee)}>
                            <Edit className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded" title="More" onClick={() => setActionsId(employee.id)}>
                            <MoreHorizontal className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-gray-100">
                  <tr>
                    <td colSpan={4} className="px-3 py-3 text-xs font-semibold text-gray-700 sticky left-0 bg-gray-100 border-r">
                      Total ({filtered.length} Employees)
                    </td>
                    {days.map((day) => {
                      const presentCount = filtered.filter((emp) => cellCode(emp, day) === 'P').length;
                      return (
                        <td
                          key={day}
                          className={`px-1 py-2 text-center text-xs font-semibold ${isWeekend(day) ? 'bg-gray-200 text-gray-500' : 'text-gray-700'}`}>
                          {isSampleMonth ? presentCount : '–'}
                        </td>);
                    })}
                    {SUMMARY_COLUMNS.filter((col) => visibleCols[col.code]).map((col) =>
                    <td key={col.code} className="px-2 py-2 text-center text-sm font-bold text-gray-700 bg-gray-200">
                        {isSampleMonth ? totals[col.code] : '–'}
                      </td>
                    )}
                    <td className="px-3 py-2 bg-gray-100 border-l"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{rangeStart}-{rangeEnd}</span> of{' '}
                <span className="font-medium">{filtered.length}</span> employees
              </p>
              <Select
                options={PAGE_SIZES.map((size) => ({ value: size, label: `${size} per page` }))}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPage(1);
                }} />
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNo) =>
              <button
                key={pageNo}
                type="button"
                onClick={() => setPage(pageNo)}
                className={`px-3 py-1 text-sm rounded ${pageNo === safePage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {pageNo}
                </button>
              )}
              <Button variant="outline" disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Attendance Code Legend">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(attendanceCodes).map(([code, { label, color }]) =>
            <div key={code} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                <span className={`inline-flex items-center justify-center w-10 h-6 text-xs font-semibold rounded border ${color}`}>
                  {code}
                </span>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            )}
          </div>
        </Card>

        <Card title="Monthly Statistics">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Average Attendance Rate</span>
                <span className="text-sm font-bold text-green-600">94.2%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '94.2%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">On-Time Arrival Rate</span>
                <span className="text-sm font-bold text-blue-600">87.5%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '87.5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Leave Utilization</span>
                <span className="text-sm font-bold text-orange-600">32.4%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: '32.4%' }}></div>
              </div>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">24.5</p>
                  <p className="text-xs text-gray-500">Avg. Working Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">8.2</p>
                  <p className="text-xs text-gray-500">Avg. Hours/Day</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Quick Actions">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={openImport}>
              <Upload className="w-4 h-4 mr-2" />
              Import Attendance Data
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={openBulk}>
              <Edit className="w-4 h-4 mr-2" />
              Bulk Edit Attendance
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={openHoliday}>
              <Calendar className="w-4 h-4 mr-2" />
              Mark Holiday
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleGenerateMusterRoll}>
              <Users className="w-4 h-4 mr-2" />
              Generate Muster Roll
            </Button>
            <div className="border-t pt-3">
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-800">Data Last Updated</p>
                  <p className="text-xs text-blue-700 mt-1">31 Jan 2024, 06:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Department-wise Attendance Summary">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Days</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
              { dept: 'Engineering', employees: 4, present: 86, absent: 0, leave: 5, percentage: 94.5, trend: 'up' },
              { dept: 'Human Resources', employees: 2, present: 45, absent: 3, leave: 0, percentage: 91.8, trend: 'down' },
              { dept: 'Finance', employees: 1, present: 22, absent: 0, leave: 0, percentage: 100, trend: 'up' },
              { dept: 'Marketing', employees: 1, present: 20, absent: 2, leave: 0, percentage: 90.9, trend: 'same' },
              { dept: 'Operations', employees: 1, present: 23, absent: 0, leave: 0, percentage: 100, trend: 'up' },
              { dept: 'Sales', employees: 1, present: 22, absent: 0, leave: 0, percentage: 100, trend: 'up' }].
              map((row) =>
              <tr key={row.dept} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.dept}</td>
                  <td className="px-4 py-3 text-sm text-center text-gray-600">{row.employees}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-green-600">{row.present}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-red-600">{row.absent}</td>
                  <td className="px-4 py-3 text-sm text-center font-medium text-blue-600">{row.leave}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${row.percentage >= 95 ? 'bg-green-500' : row.percentage >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${row.percentage}%` }}>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{row.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.trend === 'up' && <span className="text-green-600 text-sm">↑ +2.1%</span>}
                    {row.trend === 'down' && <span className="text-red-600 text-sm">↓ -1.5%</span>}
                    {row.trend === 'same' && <span className="text-gray-500 text-sm">→ 0%</span>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View employee month */}
      <Modal
        isOpen={!!viewEmp}
        onClose={() => setViewId(null)}
        title={viewEmp ? `Attendance — ${viewEmp.name} (${viewEmp.id})` : 'Attendance'}
        size="lg"
        footer={viewEmp &&
        <div className="flex justify-between gap-2">
            <Button variant="outline" onClick={() => exportEmployee(viewEmp)}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="primary" onClick={() => setViewId(null)}>Close</Button>
          </div>}>
        {viewEmp &&
        <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
              <span>Department: <span className="font-medium text-gray-900">{viewEmp.department}</span></span>
              <span>Designation: <span className="font-medium text-gray-900">{viewEmp.designation}</span></span>
              <span>Month: <span className="font-medium text-gray-900">{monthLabel}</span></span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUMMARY_COLUMNS.map((col) =>
              <span key={col.code} className={`px-3 py-1 rounded-full text-xs font-semibold ${col.head} text-gray-800`}>
                  {col.label}: {isSampleMonth ? viewEmp.summary[summaryKeyOf(col.code)] || 0 : '–'}
                </span>
              )}
            </div>
            {isSampleMonth ?
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {days.map((day) => {
                const code = viewEmp.attendance[day - 1];
                return (
                  <div key={day} className={`flex flex-col items-center rounded-lg border p-2 ${isWeekend(day) ? 'bg-gray-50' : 'bg-white'}`}>
                      <span className="text-[10px] text-gray-500">{getDayName(day)} {day}</span>
                      <span className={`mt-1 inline-flex items-center justify-center w-10 h-6 text-xs font-semibold rounded border ${cellClass(code)}`}>
                        {code || '–'}
                      </span>
                    </div>);
              })}
              </div> :
            <p className="text-sm text-gray-500">No attendance records for {monthLabel}.</p>
            }
          </div>}
      </Modal>

      {/* More actions */}
      <Modal
        isOpen={!!actionsEmp}
        onClose={() => setActionsId(null)}
        title={actionsEmp ? `Actions — ${actionsEmp.name}` : 'Actions'}
        size="sm"
        footer={<div className="flex justify-end"><Button variant="outline" onClick={() => setActionsId(null)}>Close</Button></div>}>
        {actionsEmp &&
        <div className="space-y-3">
            <p className="text-xs text-gray-500">{actionsEmp.id} · {actionsEmp.department}</p>
            <Button variant="outline" className="w-full justify-start" onClick={() => exportEmployee(actionsEmp)}>
              <Download className="w-4 h-4 mr-2" />
              Export this employee (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => resetEmployee(actionsEmp)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to sample data
            </Button>
          </div>}
      </Modal>

      {/* Edit a single day */}
      <Modal
        isOpen={!!editDraft}
        onClose={() => setEditDraft(null)}
        title="Edit Attendance"
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditDraft(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </div>}>
        {editDraft &&
        <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {records.find((emp) => emp.id === editDraft.empId)?.name} ({editDraft.empId})
            </p>
            <Select
              label="Day"
              options={days.map((d) => ({ value: String(d), label: `${d} ${getDayName(d)} ${MONTHS[monthNum - 1].label}` }))}
              value={editDraft.day}
              onChange={(e) => {
                const day = Number(e.target.value);
                const emp = records.find((item) => item.id === editDraft.empId);
                setEditDraft({ ...editDraft, day: e.target.value, code: emp?.attendance[day - 1] || editDraft.code });
              }} />
            <Select
              label="Attendance status"
              options={CODE_OPTIONS}
              value={editDraft.code}
              onChange={(e) => setEditDraft({ ...editDraft, code: e.target.value })} />
          </div>}
      </Modal>

      {/* Bulk edit */}
      <Modal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        title="Bulk Edit Attendance"
        size="lg"
        footer={
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-gray-500">{bulkIds.length} employee(s) selected</span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={saveBulk}>Apply to selected</Button>
            </div>
          </div>}>
        <div className="space-y-4">
          {modalError && <p className="text-sm text-red-600">{modalError}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Day"
              options={days.map((d) => ({ value: String(d), label: `${d} ${getDayName(d)} ${MONTHS[monthNum - 1].label}` }))}
              value={bulkDay}
              onChange={(e) => setBulkDay(e.target.value)} />
            <Select
              label="Attendance status"
              options={CODE_OPTIONS}
              value={bulkCode}
              onChange={(e) => setBulkCode(e.target.value)} />
          </div>
          <div className="border rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b text-sm">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={filtered.length > 0 && filtered.every((emp) => bulkIds.includes(emp.id))}
                  onChange={(e) => setBulkIds(e.target.checked ? filtered.map((emp) => emp.id) : [])} />
                Select all in current view
              </label>
              <button type="button" className="text-xs text-blue-700 hover:underline" onClick={() => setBulkIds([])}>Clear</button>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y">
              {filtered.map((emp) =>
              <label key={emp.id} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={bulkIds.includes(emp.id)}
                    onChange={() => toggleBulkId(emp.id)} />
                  <span className="font-medium text-gray-900">{emp.name}</span>
                  <span className="text-xs text-gray-500">{emp.id} · {emp.department}</span>
                </label>
              )}
              {filtered.length === 0 && <p className="px-3 py-4 text-sm text-gray-500">No employees in the current view.</p>}
            </div>
          </div>
        </div>
      </Modal>

      {/* Mark holiday */}
      <Modal
        isOpen={holidayOpen}
        onClose={() => setHolidayOpen(false)}
        title="Mark Holiday"
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setHolidayOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveHoliday}>Mark as Holiday</Button>
          </div>}>
        <div className="space-y-4">
          <Select
            label="Day"
            options={days.map((d) => ({ value: String(d), label: `${d} ${getDayName(d)} ${MONTHS[monthNum - 1].label}` }))}
            value={holidayDay}
            onChange={(e) => setHolidayDay(e.target.value)} />
          <p className="text-xs text-gray-500">This sets status H for all {records.length} employees on the selected day.</p>
        </div>
      </Modal>

      {/* Import */}
      <Modal
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import Attendance Data"
        size="sm"
        footer={
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={runImport} disabled={!importFile}>Import</Button>
          </div>}>
        <div className="space-y-4">
          <p className="text-xs text-gray-600">
            Upload a CSV file with one row per entry in the format <span className="font-mono">employee_id,day,status</span>, for example <span className="font-mono">EMP001,12,P</span>.
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              setImportFile(e.target.files?.[0] ?? null);
              setModalError(null);
            }}
            className="block w-full text-sm text-gray-700" />
          {importFile && <p className="text-xs text-gray-500">Selected: {importFile.name}</p>}
          {modalError && <p className="text-sm text-red-600">{modalError}</p>}
        </div>
      </Modal>
    </div>);

}
