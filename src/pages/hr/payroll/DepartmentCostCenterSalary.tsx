import React, { useState, useMemo, useCallback } from 'react';
import {
  BuildingIcon,
  TrendingUpIcon,
  DownloadIcon,
  SearchIcon,
  FilterIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  XIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  PieChartIcon,
  BarChart3Icon,
  TableIcon,
  PrinterIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  MaximizeIcon,
  MinimizeIcon } from
'lucide-react';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line } from
'recharts';

// Types
interface Employee {
  id: number;
  name: string;
  designation: string;
  salary: number;
  deductions: number;
  netPay: number;
}

interface DepartmentData {
  id: number;
  department: string;
  employees: number;
  gross: number;
  deduction: number;
  net: number;
  costCenter: string;
  avgSalary: number;
  maxSalary: number;
  minSalary: number;
  employeeList: Employee[];
}

interface MonthlyTrend {
  month: string;
  gross: number;
  deduction: number;
  net: number;
}

type SortField = 'department' | 'employees' | 'gross' | 'deduction' | 'net' | 'costCenter';
type SortDirection = 'asc' | 'desc';
type ViewMode = 'cards' | 'table' | 'chart';
type ChartType = 'bar' | 'pie' | 'comparison';

// Sample employee data for each department
const EMPLOYEE_DATA: Record<string, Employee[]> = {
  'Teaching Staff': [
  { id: 1, name: 'Dr. Rajesh Kumar', designation: 'Professor', salary: 85000, deductions: 12000, netPay: 73000 },
  { id: 2, name: 'Dr. Priya Sharma', designation: 'Associate Professor', salary: 65000, deductions: 9000, netPay: 56000 },
  { id: 3, name: 'Mr. Amit Singh', designation: 'Assistant Professor', salary: 45000, deductions: 6000, netPay: 39000 },
  { id: 4, name: 'Ms. Sneha Reddy', designation: 'Lecturer', salary: 35000, deductions: 4500, netPay: 30500 },
  { id: 5, name: 'Dr. Vikram Patel', designation: 'Professor', salary: 82000, deductions: 11500, netPay: 70500 }],

  Administration: [
  { id: 1, name: 'Mr. Suresh Iyer', designation: 'Admin Manager', salary: 55000, deductions: 7500, netPay: 47500 },
  { id: 2, name: 'Ms. Kavita Nair', designation: 'Admin Officer', salary: 42000, deductions: 5500, netPay: 36500 },
  { id: 3, name: 'Mr. Deepak Gupta', designation: 'Admin Assistant', salary: 28000, deductions: 3500, netPay: 24500 }],

  'Support Staff': [
  { id: 1, name: 'Mr. Ramesh Kumar', designation: 'Supervisor', salary: 32000, deductions: 4000, netPay: 28000 },
  { id: 2, name: 'Mr. Sunil Yadav', designation: 'Technician', salary: 25000, deductions: 3000, netPay: 22000 },
  { id: 3, name: 'Ms. Anita Devi', designation: 'Helper', salary: 18000, deductions: 2000, netPay: 16000 }],

  'Finance & Accounts': [
  { id: 1, name: 'Mr. Anil Mehta', designation: 'Finance Manager', salary: 72000, deductions: 10000, netPay: 62000 },
  { id: 2, name: 'Ms. Pooja Verma', designation: 'Accountant', salary: 45000, deductions: 6000, netPay: 39000 },
  { id: 3, name: 'Mr. Rakesh Sharma', designation: 'Accounts Assistant', salary: 32000, deductions: 4000, netPay: 28000 }],

  'IT Department': [
  { id: 1, name: 'Mr. Sanjay Tech', designation: 'IT Manager', salary: 75000, deductions: 10500, netPay: 64500 },
  { id: 2, name: 'Ms. Ritu Singh', designation: 'System Admin', salary: 55000, deductions: 7500, netPay: 47500 },
  { id: 3, name: 'Mr. Karan Patel', designation: 'Developer', salary: 48000, deductions: 6500, netPay: 41500 }],

  Operations: [
  { id: 1, name: 'Mr. Vijay Kumar', designation: 'Operations Head', salary: 68000, deductions: 9500, netPay: 58500 },
  { id: 2, name: 'Mr. Ashok Singh', designation: 'Operations Officer', salary: 45000, deductions: 6000, netPay: 39000 }]

};

// Sample data with monthly variations
const DEPARTMENT_DATA_BY_MONTH: Record<string, DepartmentData[]> = {
  'May 2025': [
  {
    id: 1,
    department: 'Teaching Staff',
    employees: 142,
    gross: 2450000,
    deduction: 320000,
    net: 2130000,
    costCenter: 'CC-001',
    avgSalary: 17253,
    maxSalary: 85000,
    minSalary: 25000,
    employeeList: EMPLOYEE_DATA['Teaching Staff']
  },
  {
    id: 2,
    department: 'Administration',
    employees: 45,
    gross: 850000,
    deduction: 110000,
    net: 740000,
    costCenter: 'CC-002',
    avgSalary: 18888,
    maxSalary: 55000,
    minSalary: 20000,
    employeeList: EMPLOYEE_DATA['Administration']
  },
  {
    id: 3,
    department: 'Support Staff',
    employees: 38,
    gross: 620000,
    deduction: 85000,
    net: 535000,
    costCenter: 'CC-003',
    avgSalary: 16315,
    maxSalary: 35000,
    minSalary: 15000,
    employeeList: EMPLOYEE_DATA['Support Staff']
  },
  {
    id: 4,
    department: 'Finance & Accounts',
    employees: 12,
    gross: 450000,
    deduction: 60000,
    net: 390000,
    costCenter: 'CC-004',
    avgSalary: 37500,
    maxSalary: 72000,
    minSalary: 28000,
    employeeList: EMPLOYEE_DATA['Finance & Accounts']
  },
  {
    id: 5,
    department: 'IT Department',
    employees: 8,
    gross: 380000,
    deduction: 45000,
    net: 335000,
    costCenter: 'CC-005',
    avgSalary: 47500,
    maxSalary: 75000,
    minSalary: 35000,
    employeeList: EMPLOYEE_DATA['IT Department']
  },
  {
    id: 6,
    department: 'Operations',
    employees: 3,
    gross: 280000,
    deduction: 35000,
    net: 245000,
    costCenter: 'CC-006',
    avgSalary: 93333,
    maxSalary: 68000,
    minSalary: 45000,
    employeeList: EMPLOYEE_DATA['Operations']
  }],

  'April 2025': [
  {
    id: 1,
    department: 'Teaching Staff',
    employees: 140,
    gross: 2400000,
    deduction: 315000,
    net: 2085000,
    costCenter: 'CC-001',
    avgSalary: 17142,
    maxSalary: 85000,
    minSalary: 25000,
    employeeList: EMPLOYEE_DATA['Teaching Staff']
  },
  {
    id: 2,
    department: 'Administration',
    employees: 44,
    gross: 830000,
    deduction: 108000,
    net: 722000,
    costCenter: 'CC-002',
    avgSalary: 18863,
    maxSalary: 55000,
    minSalary: 20000,
    employeeList: EMPLOYEE_DATA['Administration']
  },
  {
    id: 3,
    department: 'Support Staff',
    employees: 36,
    gross: 600000,
    deduction: 82000,
    net: 518000,
    costCenter: 'CC-003',
    avgSalary: 16666,
    maxSalary: 35000,
    minSalary: 15000,
    employeeList: EMPLOYEE_DATA['Support Staff']
  },
  {
    id: 4,
    department: 'Finance & Accounts',
    employees: 12,
    gross: 445000,
    deduction: 59000,
    net: 386000,
    costCenter: 'CC-004',
    avgSalary: 37083,
    maxSalary: 72000,
    minSalary: 28000,
    employeeList: EMPLOYEE_DATA['Finance & Accounts']
  },
  {
    id: 5,
    department: 'IT Department',
    employees: 7,
    gross: 350000,
    deduction: 42000,
    net: 308000,
    costCenter: 'CC-005',
    avgSalary: 50000,
    maxSalary: 75000,
    minSalary: 35000,
    employeeList: EMPLOYEE_DATA['IT Department']
  },
  {
    id: 6,
    department: 'Operations',
    employees: 3,
    gross: 275000,
    deduction: 34000,
    net: 241000,
    costCenter: 'CC-006',
    avgSalary: 91666,
    maxSalary: 68000,
    minSalary: 45000,
    employeeList: EMPLOYEE_DATA['Operations']
  }],

  'March 2025': [
  {
    id: 1,
    department: 'Teaching Staff',
    employees: 138,
    gross: 2350000,
    deduction: 308000,
    net: 2042000,
    costCenter: 'CC-001',
    avgSalary: 17028,
    maxSalary: 85000,
    minSalary: 25000,
    employeeList: EMPLOYEE_DATA['Teaching Staff']
  },
  {
    id: 2,
    department: 'Administration',
    employees: 43,
    gross: 810000,
    deduction: 105000,
    net: 705000,
    costCenter: 'CC-002',
    avgSalary: 18837,
    maxSalary: 55000,
    minSalary: 20000,
    employeeList: EMPLOYEE_DATA['Administration']
  },
  {
    id: 3,
    department: 'Support Staff',
    employees: 35,
    gross: 580000,
    deduction: 78000,
    net: 502000,
    costCenter: 'CC-003',
    avgSalary: 16571,
    maxSalary: 35000,
    minSalary: 15000,
    employeeList: EMPLOYEE_DATA['Support Staff']
  },
  {
    id: 4,
    department: 'Finance & Accounts',
    employees: 11,
    gross: 420000,
    deduction: 55000,
    net: 365000,
    costCenter: 'CC-004',
    avgSalary: 38181,
    maxSalary: 72000,
    minSalary: 28000,
    employeeList: EMPLOYEE_DATA['Finance & Accounts']
  },
  {
    id: 5,
    department: 'IT Department',
    employees: 7,
    gross: 340000,
    deduction: 40000,
    net: 300000,
    costCenter: 'CC-005',
    avgSalary: 48571,
    maxSalary: 75000,
    minSalary: 35000,
    employeeList: EMPLOYEE_DATA['IT Department']
  },
  {
    id: 6,
    department: 'Operations',
    employees: 3,
    gross: 270000,
    deduction: 33000,
    net: 237000,
    costCenter: 'CC-006',
    avgSalary: 90000,
    maxSalary: 68000,
    minSalary: 45000,
    employeeList: EMPLOYEE_DATA['Operations']
  }]

};

// Monthly trend data
const MONTHLY_TRENDS: MonthlyTrend[] = [
{ month: 'Jan', gross: 4800000, deduction: 620000, net: 4180000 },
{ month: 'Feb', gross: 4850000, deduction: 630000, net: 4220000 },
{ month: 'Mar', gross: 4770000, deduction: 619000, net: 4151000 },
{ month: 'Apr', gross: 4900000, deduction: 640000, net: 4260000 },
{ month: 'May', gross: 5030000, deduction: 655000, net: 4375000 }];


// Cost center mapping
const COST_CENTER_MAP: Record<string, string[]> = {
  'CC-001': ['Teaching Staff'],
  'CC-002': ['Administration'],
  'CC-003': ['Support Staff'],
  'CC-004': ['Finance & Accounts'],
  'CC-005': ['IT Department'],
  'CC-006': ['Operations']
};

// Department key mapping
const DEPARTMENT_KEY_MAP: Record<string, string> = {
  teaching: 'Teaching Staff',
  admin: 'Administration',
  support: 'Support Staff',
  finance: 'Finance & Accounts',
  it: 'IT Department',
  operations: 'Operations'
};

// Pie chart colors
const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function DepartmentCostCenterSalary() {
  // Filter states
  const [month, setMonth] = useState('May 2025');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // View states
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [isChartExpanded, setIsChartExpanded] = useState(false);

  // Sort states
  const [sortField, setSortField] = useState<SortField>('department');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Modal states
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState<DepartmentData | null>(null);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonDepartments, setComparisonDepartments] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTrendModal, setShowTrendModal] = useState(false);

  // Loading and message states
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selection state for comparison
  const [selectedForComparison, setSelectedForComparison] = useState<Set<number>>(new Set());

  // Get base data for selected month
  const baseData = useMemo(() => {
    return DEPARTMENT_DATA_BY_MONTH[month] || DEPARTMENT_DATA_BY_MONTH['May 2025'];
  }, [month]);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let data = [...baseData];

    // Filter by department
    if (selectedDepartment) {
      const deptName = DEPARTMENT_KEY_MAP[selectedDepartment];
      if (deptName) {
        data = data.filter((d) => d.department === deptName);
      }
    }

    // Filter by cost center
    if (costCenter) {
      const deptNames = COST_CENTER_MAP[costCenter.toUpperCase()] || [];
      if (deptNames.length > 0) {
        data = data.filter((d) => deptNames.includes(d.department));
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (d) =>
        d.department.toLowerCase().includes(query) ||
        d.costCenter.toLowerCase().includes(query)
      );
    }

    return data;
  }, [baseData, selectedDepartment, costCenter, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...filteredData];
    sorted.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
    return sorted;
  }, [filteredData, sortField, sortDirection]);

  // Calculate totals
  const totals = useMemo(() => {
    return sortedData.reduce(
      (acc, d) => ({
        employees: acc.employees + d.employees,
        gross: acc.gross + d.gross,
        deduction: acc.deduction + d.deduction,
        net: acc.net + d.net
      }),
      { employees: 0, gross: 0, deduction: 0, net: 0 }
    );
  }, [sortedData]);

  // Chart data
  const chartData = useMemo(() => {
    return sortedData.map((dept) => ({
      name: dept.department.split(' ')[0],
      fullName: dept.department,
      Gross: dept.gross / 1000,
      Deduction: dept.deduction / 1000,
      Net: dept.net / 1000,
      employees: dept.employees
    }));
  }, [sortedData]);

  // Pie chart data
  const pieChartData = useMemo(() => {
    return sortedData.map((dept) => ({
      name: dept.department,
      value: dept.net
    }));
  }, [sortedData]);

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
        return field;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ?
    <ArrowUpIcon className="w-3 h-3 inline ml-1" /> :

    <ArrowDownIcon className="w-3 h-3 inline ml-1" />;

  };

  // View department details
  const viewDepartmentDetails = useCallback((dept: DepartmentData) => {
    setSelectedDepartmentData(dept);
    setShowDepartmentModal(true);
  }, []);

  // Toggle department selection for comparison
  const toggleDepartmentComparison = useCallback((deptId: number) => {
    setSelectedForComparison((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId)) {
        newSet.delete(deptId);
      } else {
        if (newSet.size < 3) {
          newSet.add(deptId);
        } else {
          setErrorMessage('You can compare up to 3 departments at a time');
          setTimeout(() => setErrorMessage(null), 3000);
        }
      }
      return newSet;
    });
  }, []);

  // Open comparison modal
  const openComparisonModal = useCallback(() => {
    if (selectedForComparison.size < 2) {
      setErrorMessage('Please select at least 2 departments to compare');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    const depts = sortedData.
    filter((d) => selectedForComparison.has(d.id)).
    map((d) => d.department);
    setComparisonDepartments(depts);
    setShowComparisonModal(true);
  }, [selectedForComparison, sortedData]);

  // Clear comparison selection
  const clearComparisonSelection = useCallback(() => {
    setSelectedForComparison(new Set());
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedDepartment('');
    setCostCenter('');
    setSearchQuery('');
    setSortField('department');
    setSortDirection('asc');
    setSelectedForComparison(new Set());
    setSuccessMessage('Filters reset successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Export data
  const exportData = useCallback(
    (format: 'csv' | 'json' | 'pdf') => {
      setIsLoading(true);

      setTimeout(() => {
        const exportPayload = {
          month,
          department: selectedDepartment ? DEPARTMENT_KEY_MAP[selectedDepartment] : 'All',
          costCenter: costCenter || 'All',
          generatedAt: new Date().toISOString(),
          totals,
          data: sortedData.map((d) => ({
            department: d.department,
            costCenter: d.costCenter,
            employees: d.employees,
            grossSalary: d.gross,
            deductions: d.deduction,
            netSalary: d.net,
            averageSalary: d.avgSalary
          }))
        };

        if (format === 'csv') {
          const headers = ['Department', 'Cost Center', 'Employees', 'Gross', 'Deduction', 'Net'];
          const rows = sortedData.map((d) =>
          [d.department, d.costCenter, d.employees, d.gross, d.deduction, d.net].join(',')
          );
          const csvContent = [
          `Month: ${month}`,
          `Generated: ${new Date().toLocaleString()}`,
          '',
          headers.join(','),
          ...rows,
          '',
          `Total,, ${totals.employees}, ${totals.gross}, ${totals.deduction}, ${totals.net}`].
          join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `department_salary_${month.replace(' ', '_')}.csv`;
          link.click();
          URL.revokeObjectURL(link.href);
        } else if (format === 'json') {
          const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
            type: 'application/json'
          });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `department_salary_${month.replace(' ', '_')}.json`;
          link.click();
          URL.revokeObjectURL(link.href);
        } else if (format === 'pdf') {
          // In a real app, you would generate a PDF here
          console.log('PDF export data:', exportPayload);
          setSuccessMessage('PDF export initiated. Check your downloads.');
        }

        setIsLoading(false);
        setShowExportModal(false);
        setSuccessMessage(`Data exported successfully as ${format.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(null), 3000);
      }, 1000);
    },
    [month, selectedDepartment, costCenter, sortedData, totals]
  );

  // Print report
  const printReport = useCallback(() => {
    window.print();
  }, []);

  // Get comparison data
  const comparisonData = useMemo(() => {
    return sortedData.filter((d) => comparisonDepartments.includes(d.department));
  }, [sortedData, comparisonDepartments]);

  // Month over month change calculation
  const monthOverMonthChange = useMemo(() => {
    const months = Object.keys(DEPARTMENT_DATA_BY_MONTH);
    const currentIndex = months.indexOf(month);
    if (currentIndex <= 0) return null;

    const previousMonth = months[currentIndex + 1]; // months are in reverse order
    if (!previousMonth) return null;

    const currentTotal = totals.net;
    const previousData = DEPARTMENT_DATA_BY_MONTH[previousMonth];
    if (!previousData) return null;

    const previousTotal = previousData.reduce((sum, d) => sum + d.net, 0);
    const change = (currentTotal - previousTotal) / previousTotal * 100;

    return {
      previousMonth,
      change: change.toFixed(2),
      isPositive: change >= 0
    };
  }, [month, totals.net]);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
          @media print {
            .no-print { display: none !important; }
          }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              Department / Cost Center Salary
            </h1>
            <div className="flex flex-wrap gap-2 no-print">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<TrendingUpIcon className="w-4 h-4" />}
                onClick={() => setShowTrendModal(true)}>

                View Trends
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={() => setShowExportModal(true)}>

                Export
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<PrinterIcon className="w-4 h-4" />}
                onClick={printReport}>

                Print
              </Button>
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage &&
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 text-sm">{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)}>
                <XIcon className="w-4 h-4 text-emerald-600" />
              </button>
            </div>
          }

          {errorMessage &&
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircleIcon className="w-4 h-4 text-red-600" />
                <span className="text-red-800 text-sm">{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)}>
                <XIcon className="w-4 h-4 text-red-600" />
              </button>
            </div>
          }

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 no-print">
            <Select
              value={month}
              onChange={(val) => setMonth(val as string)}
              options={[
              { value: 'May 2025', label: 'May 2025' },
              { value: 'April 2025', label: 'April 2025' },
              { value: 'March 2025', label: 'March 2025' }]
              }
              className="w-40" />

            <Select
              value={selectedDepartment}
              onChange={(val) => setSelectedDepartment(val as string)}
              placeholder="All Departments"
              options={[
              { value: '', label: 'All Departments' },
              { value: 'teaching', label: 'Teaching' },
              { value: 'admin', label: 'Administration' },
              { value: 'support', label: 'Support Staff' },
              { value: 'finance', label: 'Finance & Accounts' },
              { value: 'it', label: 'IT Department' },
              { value: 'operations', label: 'Operations' }]
              }
              className="w-48" />

            <Select
              value={costCenter}
              onChange={(val) => setCostCenter(val as string)}
              placeholder="All Cost Centers"
              options={[
              { value: '', label: 'All Cost Centers' },
              { value: 'cc-001', label: 'CC-001' },
              { value: 'cc-002', label: 'CC-002' },
              { value: 'cc-003', label: 'CC-003' },
              { value: 'cc-004', label: 'CC-004' },
              { value: 'cc-005', label: 'CC-005' },
              { value: 'cc-006', label: 'CC-006' }]
              }
              className="w-48" />

            <div className="relative flex-1 max-w-xs">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />

            </div>
            <Button variant="secondary" size="sm" onClick={resetFilters}>
              <RefreshCwIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* View Mode Toggle & Comparison Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 no-print">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">View:</span>
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 text-sm ${
                  viewMode === 'cards' ?
                  'bg-indigo-600 text-white' :
                  'bg-white text-slate-600 hover:bg-slate-50'}`
                  }>

                  <BuildingIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 text-sm border-l border-slate-200 ${
                  viewMode === 'table' ?
                  'bg-indigo-600 text-white' :
                  'bg-white text-slate-600 hover:bg-slate-50'}`
                  }>

                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-3 py-1.5 text-sm border-l border-slate-200 ${
                  viewMode === 'chart' ?
                  'bg-indigo-600 text-white' :
                  'bg-white text-slate-600 hover:bg-slate-50'}`
                  }>

                  <BarChart3Icon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {selectedForComparison.size > 0 &&
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {selectedForComparison.size} selected
                </span>
                <Button variant="primary" size="sm" onClick={openComparisonModal}>
                  Compare
                </Button>
                <Button variant="secondary" size="sm" onClick={clearComparisonSelection}>
                  Clear
                </Button>
              </div>
            }
          </div>
        </div>

        {/* Department Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Total Employees
            </div>
            <div className="text-2xl font-bold text-slate-900">{totals.employees}</div>
            <div className="text-xs text-slate-500 mt-1">
              {sortedData.length} department(s)
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
              Total Gross
            </div>
            <div className="text-2xl font-bold text-emerald-900">
              ₹{(totals.gross / 100000).toFixed(1)}L
            </div>
            {monthOverMonthChange &&
            <div
              className={`text-xs mt-1 ${
              monthOverMonthChange.isPositive ? 'text-emerald-600' : 'text-red-600'}`
              }>

                {monthOverMonthChange.isPositive ? '↑' : '↓'} {monthOverMonthChange.change}% vs{' '}
                {monthOverMonthChange.previousMonth}
              </div>
            }
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-xs text-red-600 uppercase tracking-wide mb-1">
              Total Deduction
            </div>
            <div className="text-2xl font-bold text-red-900">
              ₹{(totals.deduction / 100000).toFixed(1)}L
            </div>
            <div className="text-xs text-red-500 mt-1">
              {(totals.deduction / totals.gross * 100).toFixed(1)}% of gross
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="text-xs text-indigo-600 uppercase tracking-wide mb-1">
              Total Net
            </div>
            <div className="text-2xl font-bold text-indigo-900">
              ₹{(totals.net / 100000).toFixed(1)}L
            </div>
            <div className="text-xs text-indigo-500 mt-1">
              Avg: ₹{Math.round(totals.net / totals.employees).toLocaleString()}/emp
            </div>
          </div>
        </div>

        {/* No Results */}
        {sortedData.length === 0 &&
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200">
            <InfoIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No Results Found</h3>
            <p className="text-slate-500 mb-4">
              No departments match your current filters.
            </p>
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        }

        {/* Cards View */}
        {viewMode === 'cards' && sortedData.length > 0 &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sortedData.map((dept) =>
          <div
            key={dept.id}
            className={`bg-white border rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer ${
            selectedForComparison.has(dept.id) ?
            'border-indigo-500 ring-2 ring-indigo-200' :
            'border-slate-200'}`
            }
            onClick={() => viewDepartmentDetails(dept)}>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BuildingIcon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{dept.department}</h3>
                      <p className="text-xs text-slate-500">{dept.costCenter}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 no-print">
                    <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDepartmentComparison(dept.id);
                  }}
                  className={`p-1 rounded ${
                  selectedForComparison.has(dept.id) ?
                  'text-indigo-600' :
                  'text-slate-400 hover:text-slate-600'}`
                  }
                  title="Select for comparison">

                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Employees</span>
                    <span className="font-semibold text-slate-900">{dept.employees}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Gross Salary</span>
                    <span className="font-semibold text-emerald-600">
                      ₹{(dept.gross / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Deductions</span>
                    <span className="font-semibold text-red-600">
                      ₹{(dept.deduction / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                    <span className="text-slate-500 font-medium">Net Payable</span>
                    <span className="font-bold text-indigo-600">
                      ₹{(dept.net / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <span>Avg: ₹{Math.round(dept.net / dept.employees).toLocaleString()}</span>
                  <span className="flex items-center gap-1 text-indigo-600 hover:underline">
                    View Details <EyeIcon className="w-3 h-3" />
                  </span>
                </div>
              </div>
          )}
          </div>
        }

        {/* Table View */}
        {viewMode === 'table' && sortedData.length > 0 &&
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-700">
                Department Breakdown
              </h3>
              <span className="text-xs text-slate-500">
                Click headers to sort
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-10 no-print">
                      <input
                      type="checkbox"
                      checked={
                      selectedForComparison.size === sortedData.length &&
                      sortedData.length > 0
                      }
                      onChange={() => {
                        if (selectedForComparison.size === sortedData.length) {
                          setSelectedForComparison(new Set());
                        } else {
                          setSelectedForComparison(
                            new Set(sortedData.slice(0, 3).map((d) => d.id))
                          );
                        }
                      }}
                      className="rounded border-slate-300" />

                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('department')}>

                      Department {getSortIcon('department')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('employees')}>

                      Employees {getSortIcon('employees')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('gross')}>

                      Gross {getSortIcon('gross')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('deduction')}>

                      Deduction {getSortIcon('deduction')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('net')}>

                      Net {getSortIcon('net')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('costCenter')}>

                      Cost Center {getSortIcon('costCenter')}
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center no-print">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {sortedData.map((row) =>
                <tr
                  key={row.id}
                  className={`hover:bg-slate-50 transition-colors ${
                  selectedForComparison.has(row.id) ? 'bg-indigo-50' : ''}`
                  }>

                      <td className="py-3 px-4 no-print">
                        <input
                      type="checkbox"
                      checked={selectedForComparison.has(row.id)}
                      onChange={() => toggleDepartmentComparison(row.id)}
                      className="rounded border-slate-300" />

                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.department}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        {row.employees}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        ₹{row.gross.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600">
                        ₹{row.deduction.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-indigo-600">
                        ₹{row.net.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                        {row.costCenter}
                      </td>
                      <td className="py-3 px-4 text-center no-print">
                        <button
                      onClick={() => viewDepartmentDetails(row)}
                      className="text-indigo-600 hover:text-indigo-800">

                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                )}
                </tbody>
                <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                  <tr className="font-semibold">
                    <td className="py-3 px-4 no-print"></td>
                    <td className="py-3 px-4 text-slate-700">Total</td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      {totals.employees}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-700">
                      ₹{totals.gross.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-red-700">
                      ₹{totals.deduction.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-indigo-700">
                      ₹{totals.net.toLocaleString()}
                    </td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 no-print"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        }

        {/* Chart View */}
        {viewMode === 'chart' && sortedData.length > 0 &&
        <div className="space-y-6 mb-6">
            {/* Chart Type Toggle */}
            <div className="flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Chart Type:</span>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                  <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 text-sm ${
                  chartType === 'bar' ?
                  'bg-indigo-600 text-white' :
                  'bg-white text-slate-600 hover:bg-slate-50'}`
                  }>

                    Bar
                  </button>
                  <button
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1.5 text-sm border-l border-slate-200 ${
                  chartType === 'pie' ?
                  'bg-indigo-600 text-white' :
                  'bg-white text-slate-600 hover:bg-slate-50'}`
                  }>

                    Pie
                  </button>
                </div>
              </div>
              <button
              onClick={() => setIsChartExpanded(!isChartExpanded)}
              className="text-slate-500 hover:text-slate-700">

                {isChartExpanded ?
              <MinimizeIcon className="w-5 h-5" /> :

              <MaximizeIcon className="w-5 h-5" />
              }
              </button>
            </div>

            {chartType === 'bar' &&
          <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Department-wise Salary Comparison
                </h3>
                <div className={isChartExpanded ? 'h-[500px]' : 'h-[350px]'}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>

                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis
                    dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }} />

                      <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    label={{
                      value: 'Amount (₹ in thousands)',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: '#64748b', fontSize: 12 }
                    }} />

                      <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                    `₹${value.toFixed(0)}K`,
                    name]
                    }
                    labelFormatter={(label) => {
                      const item = chartData.find((d) => d.name === label);
                      return item?.fullName || label;
                    }} />

                      <Legend />
                      <Bar
                    dataKey="Gross"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => {
                      const dept = sortedData.find(
                        (d) => d.department.startsWith(data.name)
                      );
                      if (dept) viewDepartmentDetails(dept);
                    }}
                    style={{ cursor: 'pointer' }} />

                      <Bar
                    dataKey="Deduction"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => {
                      const dept = sortedData.find(
                        (d) => d.department.startsWith(data.name)
                      );
                      if (dept) viewDepartmentDetails(dept);
                    }}
                    style={{ cursor: 'pointer' }} />

                      <Bar
                    dataKey="Net"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    onClick={(data) => {
                      const dept = sortedData.find(
                        (d) => d.department.startsWith(data.name)
                      );
                      if (dept) viewDepartmentDetails(dept);
                    }}
                    style={{ cursor: 'pointer' }} />

                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
          }

            {chartType === 'pie' &&
          <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Net Salary Distribution by Department
                </h3>
                <div className={isChartExpanded ? 'h-[500px]' : 'h-[350px]'}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isChartExpanded ? 180 : 120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                    `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`
                    }
                    onClick={(data) => {
                      const dept = sortedData.find((d) => d.department === data.name);
                      if (dept) viewDepartmentDetails(dept);
                    }}
                    style={{ cursor: 'pointer' }}>

                        {pieChartData.map((entry, index) =>
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]} />

                    )}
                      </Pie>
                      <Tooltip
                    formatter={(value: number) => `₹${value.toLocaleString()}`} />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
          }
          </div>
        }

        {/* Detailed Table (shown in cards and chart views) */}
        {viewMode !== 'table' && sortedData.length > 0 &&
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-6">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">
                Detailed Department Breakdown
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('department')}>

                      Department {getSortIcon('department')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('employees')}>

                      Employees {getSortIcon('employees')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('gross')}>

                      Gross {getSortIcon('gross')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('deduction')}>

                      Deduction {getSortIcon('deduction')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('net')}>

                      Net {getSortIcon('net')}
                    </th>
                    <th
                    className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('costCenter')}>

                      Cost Center {getSortIcon('costCenter')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {sortedData.map((row) =>
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => viewDepartmentDetails(row)}>

                      <td className="py-3 px-4 font-medium text-slate-900">
                        {row.department}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        {row.employees}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        ₹{row.gross.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600">
                        ₹{row.deduction.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-indigo-600">
                        ₹{row.net.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-xs">
                        {row.costCenter}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }

        {/* Department Detail Modal */}
        <Modal
          isOpen={showDepartmentModal}
          onClose={() => setShowDepartmentModal(false)}
          title={selectedDepartmentData?.department || 'Department Details'}
          size="lg">

          {selectedDepartmentData &&
          <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Employees</div>
                  <div className="text-xl font-bold text-slate-900">
                    {selectedDepartmentData.employees}
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <div className="text-xs text-emerald-600 mb-1">Gross Salary</div>
                  <div className="text-xl font-bold text-emerald-900">
                    ₹{(selectedDepartmentData.gross / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-xs text-red-600 mb-1">Deductions</div>
                  <div className="text-xl font-bold text-red-900">
                    ₹{(selectedDepartmentData.deduction / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <div className="text-xs text-indigo-600 mb-1">Net Payable</div>
                  <div className="text-xl font-bold text-indigo-900">
                    ₹{(selectedDepartmentData.net / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Cost Center</span>
                  <span className="font-mono font-medium">
                    {selectedDepartmentData.costCenter}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Average Salary</span>
                  <span className="font-medium">
                    ₹
                    {Math.round(
                    selectedDepartmentData.net / selectedDepartmentData.employees
                  ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Deduction Rate</span>
                  <span className="font-medium">
                    {(
                  selectedDepartmentData.deduction / selectedDepartmentData.gross *
                  100).
                  toFixed(1)}
                    %
                  </span>
                </div>
              </div>

              {/* Employee List */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Sample Employees
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 uppercase">
                          Name
                        </th>
                        <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 uppercase">
                          Designation
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Salary
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Deduction
                        </th>
                        <th className="py-2 px-3 text-right text-xs font-medium text-slate-500 uppercase">
                          Net Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedDepartmentData.employeeList.map((emp) =>
                    <tr key={emp.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium">{emp.name}</td>
                          <td className="py-2 px-3 text-slate-600">{emp.designation}</td>
                          <td className="py-2 px-3 text-right">
                            ₹{emp.salary.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right text-red-600">
                            ₹{emp.deductions.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-indigo-600">
                            ₹{emp.netPay.toLocaleString()}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Showing sample employees. Total: {selectedDepartmentData.employees}
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <Button variant="outline" onClick={() => setShowDepartmentModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          }
        </Modal>

        {/* Comparison Modal */}
        <Modal
          isOpen={showComparisonModal}
          onClose={() => setShowComparisonModal(false)}
          title="Department Comparison"
          size="lg">

          <div className="space-y-6">
            {comparisonData.length > 0 &&
            <>
                {/* Comparison Chart */}
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={comparisonData.map((d) => ({
                      name: d.department.split(' ')[0],
                      Gross: d.gross / 1000,
                      Deduction: d.deduction / 1000,
                      Net: d.net / 1000
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>

                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => `₹${value.toFixed(0)}K`} />
                      <Legend />
                      <Bar dataKey="Gross" fill="#10b981" />
                      <Bar dataKey="Deduction" fill="#ef4444" />
                      <Bar dataKey="Net" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="py-2 px-3 text-left text-xs font-medium text-slate-500 uppercase">
                          Metric
                        </th>
                        {comparisonData.map((d) =>
                      <th
                        key={d.id}
                        className="py-2 px-3 text-right text-xs font-medium text-slate-500 uppercase">

                            {d.department.split(' ')[0]}
                          </th>
                      )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 font-medium">Employees</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right">
                            {d.employees}
                          </td>
                      )}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Gross Salary</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right text-emerald-600">
                            ₹{(d.gross / 1000).toFixed(0)}K
                          </td>
                      )}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Deductions</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right text-red-600">
                            ₹{(d.deduction / 1000).toFixed(0)}K
                          </td>
                      )}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Net Payable</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right font-bold text-indigo-600">
                            ₹{(d.net / 1000).toFixed(0)}K
                          </td>
                      )}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Avg per Employee</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right">
                            ₹{Math.round(d.net / d.employees).toLocaleString()}
                          </td>
                      )}
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-medium">Deduction Rate</td>
                        {comparisonData.map((d) =>
                      <td key={d.id} className="py-2 px-3 text-right">
                            {(d.deduction / d.gross * 100).toFixed(1)}%
                          </td>
                      )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            }

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setShowComparisonModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>

        {/* Export Modal */}
        <Modal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Export Data"
          size="sm">

          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Choose a format to export the department salary data.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => exportData('csv')}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">

                <FileTextIcon className="w-5 h-5 text-emerald-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">CSV Format</div>
                  <div className="text-xs text-slate-500">
                    Compatible with Excel, Google Sheets
                  </div>
                </div>
              </button>
              <button
                onClick={() => exportData('json')}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">

                <FileTextIcon className="w-5 h-5 text-indigo-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">JSON Format</div>
                  <div className="text-xs text-slate-500">
                    For developers and API integration
                  </div>
                </div>
              </button>
              <button
                onClick={() => exportData('pdf')}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">

                <FileTextIcon className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-slate-900">PDF Report</div>
                  <div className="text-xs text-slate-500">Formatted report for printing</div>
                </div>
              </button>
            </div>
            {isLoading &&
            <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <RefreshCwIcon className="w-4 h-4 animate-spin" />
                Generating export...
              </div>
            }
          </div>
        </Modal>

        {/* Trend Modal */}
        <Modal
          isOpen={showTrendModal}
          onClose={() => setShowTrendModal(false)}
          title="Monthly Salary Trends"
          size="lg">

          <div className="space-y-6">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={MONTHLY_TRENDS}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />

                  <Tooltip
                    formatter={(value: number) => `₹${(value / 100000).toFixed(2)}L`} />

                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="gross"
                    name="Gross"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }} />

                  <Line
                    type="monotone"
                    dataKey="deduction"
                    name="Deduction"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444' }} />

                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }} />

                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Monthly Summary
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-2 text-xs font-medium text-slate-500 uppercase">
                        Month
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-slate-500 uppercase">
                        Gross
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-slate-500 uppercase">
                        Deduction
                      </th>
                      <th className="pb-2 text-right text-xs font-medium text-slate-500 uppercase">
                        Net
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {MONTHLY_TRENDS.map((trend) =>
                    <tr key={trend.month}>
                        <td className="py-2 font-medium">{trend.month}</td>
                        <td className="py-2 text-right text-emerald-600">
                          ₹{(trend.gross / 100000).toFixed(2)}L
                        </td>
                        <td className="py-2 text-right text-red-600">
                          ₹{(trend.deduction / 100000).toFixed(2)}L
                        </td>
                        <td className="py-2 text-right font-semibold text-indigo-600">
                          ₹{(trend.net / 100000).toFixed(2)}L
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={() => setShowTrendModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>);

}