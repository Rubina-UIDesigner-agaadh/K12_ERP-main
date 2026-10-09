import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Calculator,
  Download,
  TrendingUp,
  AlertTriangle,
  Users,
  DollarSign,
  Search,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter,
  Printer,
  Mail,
  FileText,
  Settings,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  AlertCircle,
  Zap,
  Target,
  Minus,
  Plus,
  Save,
  History } from
'lucide-react';

// Types
interface TaxBreakdown {
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  lta: number;
  otherAllowances: number;
  bonus: number;
  grossSalary: number;
  standardDeduction: number;
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  section24: number;
  nps80CCD: number;
  otherDeductions: number;
  totalDeductions: number;
  taxableIncome: number;
  taxOldRegime: number;
  taxNewRegime: number;
  selectedRegimeTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  tdsDeducted: number;
  balanceTax: number;
  monthlyTds: number;
}

interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  regime: 'Old' | 'New';
  dateOfJoining: string;
  pan: string;
  grossAnnual: number;
  deductions: number;
  taxableIncome: number;
  estimatedTax: number;
  monthlyTds: number;
  tdsDeducted: number;
  balanceTax: number;
  status: 'Complete' | 'Shortfall' | 'Excess' | 'Pending';
  projectionDate: string;
  breakdown: TaxBreakdown;
  monthlyProjections: MonthlyProjection[];
}

interface MonthlyProjection {
  month: string;
  salary: number;
  tdsDeducted: number;
  cumulativeSalary: number;
  cumulativeTds: number;
  projectedTax: number;
  variance: number;
}

interface ProjectionSummary {
  totalEmployees: number;
  totalGrossIncome: number;
  totalDeductions: number;
  totalTaxableIncome: number;
  totalProjectedTax: number;
  totalTdsDeducted: number;
  totalBalanceTax: number;
  employeesWithShortfall: number;
  employeesWithExcess: number;
  employeesComplete: number;
  employeesPending: number;
  averageTaxRate: number;
  oldRegimeCount: number;
  newRegimeCount: number;
}

interface ProjectionHistory {
  id: string;
  generatedAt: string;
  generatedBy: string;
  fiscalYear: string;
  totalEmployees: number;
  totalProjectedTax: number;
  parameters: {
    month: number;
    includeBonus: boolean;
    includeArrears: boolean;
  };
}

// Constants
const FISCAL_YEARS = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-23' }];


const DEPARTMENTS = [
{ value: 'all', label: 'All Departments' },
{ value: 'IT', label: 'IT' },
{ value: 'HR', label: 'HR' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Operations', label: 'Operations' },
{ value: 'Marketing', label: 'Marketing' },
{ value: 'Sales', label: 'Sales' }];


const REGIME_OPTIONS = [
{ value: 'all', label: 'All Regimes' },
{ value: 'Old', label: 'Old Regime' },
{ value: 'New', label: 'New Regime' }];


const STATUS_OPTIONS = [
{ value: 'all', label: 'All Status' },
{ value: 'Complete', label: 'Complete' },
{ value: 'Shortfall', label: 'Shortfall' },
{ value: 'Excess', label: 'Excess' },
{ value: 'Pending', label: 'Pending' }];


const EXPORT_FORMATS = [
{ value: 'csv', label: 'CSV Spreadsheet' },
{ value: 'excel', label: 'Excel Workbook' },
{ value: 'pdf', label: 'PDF Report' },
{ value: 'json', label: 'JSON Data' }];


const MONTHS = [
'April', 'May', 'June', 'July', 'August', 'September',
'October', 'November', 'December', 'January', 'February', 'March'];


const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// Generate monthly projections
const generateMonthlyProjections = (annual: number, monthlyTds: number): MonthlyProjection[] => {
  const monthly = annual / 12;
  let cumulativeSalary = 0;
  let cumulativeTds = 0;

  return MONTHS.map((month, index) => {
    cumulativeSalary += monthly;
    cumulativeTds += monthlyTds;
    const projectedTax = cumulativeSalary * 0.12; // Simplified projection
    const variance = cumulativeTds - projectedTax;

    return {
      month,
      salary: monthly,
      tdsDeducted: monthlyTds,
      cumulativeSalary,
      cumulativeTds,
      projectedTax,
      variance
    };
  });
};

// Initial Data
const initialEmployees: Employee[] = [
{
  id: '1',
  code: 'EMP001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  department: 'IT',
  designation: 'Senior Developer',
  regime: 'New',
  dateOfJoining: '2020-04-01',
  pan: 'ABCPK1234F',
  grossAnnual: 1200000,
  deductions: 295000,
  taxableIncome: 905000,
  estimatedTax: 112500,
  monthlyTds: 9375,
  tdsDeducted: 84375,
  balanceTax: 28125,
  status: 'Complete',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 600000,
    hra: 240000,
    specialAllowance: 200000,
    lta: 50000,
    otherAllowances: 60000,
    bonus: 50000,
    grossSalary: 1200000,
    standardDeduction: 50000,
    section80C: 150000,
    section80D: 25000,
    section80E: 0,
    section80G: 10000,
    section24: 0,
    nps80CCD: 50000,
    otherDeductions: 10000,
    totalDeductions: 295000,
    taxableIncome: 905000,
    taxOldRegime: 130000,
    taxNewRegime: 112500,
    selectedRegimeTax: 112500,
    surcharge: 0,
    cess: 4500,
    totalTax: 117000,
    tdsDeducted: 84375,
    balanceTax: 32625,
    monthlyTds: 9375
  },
  monthlyProjections: generateMonthlyProjections(1200000, 9375)
},
{
  id: '2',
  code: 'EMP002',
  name: 'Priya Sharma',
  email: 'priya.sharma@company.com',
  department: 'HR',
  designation: 'HR Manager',
  regime: 'Old',
  dateOfJoining: '2019-06-15',
  pan: 'DEFPS5678G',
  grossAnnual: 950000,
  deductions: 200000,
  taxableIncome: 750000,
  estimatedTax: 62500,
  monthlyTds: 5208,
  tdsDeducted: 46872,
  balanceTax: 15628,
  status: 'Complete',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 475000,
    hra: 190000,
    specialAllowance: 150000,
    lta: 40000,
    otherAllowances: 55000,
    bonus: 40000,
    grossSalary: 950000,
    standardDeduction: 50000,
    section80C: 100000,
    section80D: 25000,
    section80E: 0,
    section80G: 5000,
    section24: 0,
    nps80CCD: 20000,
    otherDeductions: 0,
    totalDeductions: 200000,
    taxableIncome: 750000,
    taxOldRegime: 62500,
    taxNewRegime: 75000,
    selectedRegimeTax: 62500,
    surcharge: 0,
    cess: 2500,
    totalTax: 65000,
    tdsDeducted: 46872,
    balanceTax: 18128,
    monthlyTds: 5208
  },
  monthlyProjections: generateMonthlyProjections(950000, 5208)
},
{
  id: '3',
  code: 'EMP003',
  name: 'Amit Patel',
  email: 'amit.patel@company.com',
  department: 'Finance',
  designation: 'Financial Analyst',
  regime: 'New',
  dateOfJoining: '2022-01-10',
  pan: 'GHIAP9012H',
  grossAnnual: 1500000,
  deductions: 160000,
  taxableIncome: 1340000,
  estimatedTax: 195000,
  monthlyTds: 16250,
  tdsDeducted: 130000,
  balanceTax: 65000,
  status: 'Shortfall',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 750000,
    hra: 300000,
    specialAllowance: 250000,
    lta: 60000,
    otherAllowances: 80000,
    bonus: 60000,
    grossSalary: 1500000,
    standardDeduction: 50000,
    section80C: 80000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 5000,
    totalDeductions: 160000,
    taxableIncome: 1340000,
    taxOldRegime: 220000,
    taxNewRegime: 195000,
    selectedRegimeTax: 195000,
    surcharge: 0,
    cess: 7800,
    totalTax: 202800,
    tdsDeducted: 130000,
    balanceTax: 72800,
    monthlyTds: 16250
  },
  monthlyProjections: generateMonthlyProjections(1500000, 16250)
},
{
  id: '4',
  code: 'EMP004',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@company.com',
  department: 'Marketing',
  designation: 'Marketing Lead',
  regime: 'New',
  dateOfJoining: '2021-03-01',
  pan: 'JKLSR3456I',
  grossAnnual: 1100000,
  deductions: 180000,
  taxableIncome: 920000,
  estimatedTax: 95000,
  monthlyTds: 7916,
  tdsDeducted: 79160,
  balanceTax: 15840,
  status: 'Complete',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 550000,
    hra: 220000,
    specialAllowance: 180000,
    lta: 45000,
    otherAllowances: 60000,
    bonus: 45000,
    grossSalary: 1100000,
    standardDeduction: 50000,
    section80C: 90000,
    section80D: 25000,
    section80E: 0,
    section80G: 5000,
    section24: 0,
    nps80CCD: 10000,
    otherDeductions: 0,
    totalDeductions: 180000,
    taxableIncome: 920000,
    taxOldRegime: 110000,
    taxNewRegime: 95000,
    selectedRegimeTax: 95000,
    surcharge: 0,
    cess: 3800,
    totalTax: 98800,
    tdsDeducted: 79160,
    balanceTax: 19640,
    monthlyTds: 7916
  },
  monthlyProjections: generateMonthlyProjections(1100000, 7916)
},
{
  id: '5',
  code: 'EMP005',
  name: 'Vikram Singh',
  email: 'vikram.singh@company.com',
  department: 'Operations',
  designation: 'Operations Manager',
  regime: 'Old',
  dateOfJoining: '2018-09-01',
  pan: 'MNOVIS7890J',
  grossAnnual: 1800000,
  deductions: 425000,
  taxableIncome: 1375000,
  estimatedTax: 225000,
  monthlyTds: 18750,
  tdsDeducted: 206250,
  balanceTax: 18750,
  status: 'Excess',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 900000,
    hra: 360000,
    specialAllowance: 300000,
    lta: 80000,
    otherAllowances: 100000,
    bonus: 60000,
    grossSalary: 1800000,
    standardDeduction: 50000,
    section80C: 150000,
    section80D: 75000,
    section80E: 0,
    section80G: 25000,
    section24: 100000,
    nps80CCD: 50000,
    otherDeductions: 0,
    totalDeductions: 425000,
    taxableIncome: 1375000,
    taxOldRegime: 225000,
    taxNewRegime: 260000,
    selectedRegimeTax: 225000,
    surcharge: 0,
    cess: 9000,
    totalTax: 234000,
    tdsDeducted: 206250,
    balanceTax: 27750,
    monthlyTds: 18750
  },
  monthlyProjections: generateMonthlyProjections(1800000, 18750)
},
{
  id: '6',
  code: 'EMP006',
  name: 'Kavita Joshi',
  email: 'kavita.joshi@company.com',
  department: 'Sales',
  designation: 'Sales Executive',
  regime: 'New',
  dateOfJoining: '2023-07-15',
  pan: 'PQRKJ1234K',
  grossAnnual: 600000,
  deductions: 75000,
  taxableIncome: 525000,
  estimatedTax: 15000,
  monthlyTds: 1250,
  tdsDeducted: 11250,
  balanceTax: 3750,
  status: 'Complete',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 300000,
    hra: 120000,
    specialAllowance: 100000,
    lta: 25000,
    otherAllowances: 35000,
    bonus: 20000,
    grossSalary: 600000,
    standardDeduction: 50000,
    section80C: 25000,
    section80D: 0,
    section80E: 0,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 0,
    totalDeductions: 75000,
    taxableIncome: 525000,
    taxOldRegime: 17500,
    taxNewRegime: 15000,
    selectedRegimeTax: 15000,
    surcharge: 0,
    cess: 600,
    totalTax: 15600,
    tdsDeducted: 11250,
    balanceTax: 4350,
    monthlyTds: 1250
  },
  monthlyProjections: generateMonthlyProjections(600000, 1250)
},
{
  id: '7',
  code: 'EMP007',
  name: 'Rahul Mehta',
  email: 'rahul.mehta@company.com',
  department: 'IT',
  designation: 'Software Engineer',
  regime: 'New',
  dateOfJoining: '2022-08-01',
  pan: '',
  grossAnnual: 850000,
  deductions: 100000,
  taxableIncome: 750000,
  estimatedTax: 52500,
  monthlyTds: 4375,
  tdsDeducted: 0,
  balanceTax: 52500,
  status: 'Pending',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 425000,
    hra: 170000,
    specialAllowance: 140000,
    lta: 35000,
    otherAllowances: 50000,
    bonus: 30000,
    grossSalary: 850000,
    standardDeduction: 50000,
    section80C: 50000,
    section80D: 0,
    section80E: 0,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 0,
    totalDeductions: 100000,
    taxableIncome: 750000,
    taxOldRegime: 62500,
    taxNewRegime: 52500,
    selectedRegimeTax: 52500,
    surcharge: 0,
    cess: 2100,
    totalTax: 54600,
    tdsDeducted: 0,
    balanceTax: 54600,
    monthlyTds: 4375
  },
  monthlyProjections: generateMonthlyProjections(850000, 4375)
},
{
  id: '8',
  code: 'EMP008',
  name: 'Anita Desai',
  email: 'anita.desai@company.com',
  department: 'HR',
  designation: 'HR Executive',
  regime: 'Old',
  dateOfJoining: '2021-01-15',
  pan: 'STUAD5678L',
  grossAnnual: 720000,
  deductions: 175000,
  taxableIncome: 545000,
  estimatedTax: 22500,
  monthlyTds: 1875,
  tdsDeducted: 16875,
  balanceTax: 5625,
  status: 'Complete',
  projectionDate: '2025-01-15',
  breakdown: {
    basicSalary: 360000,
    hra: 144000,
    specialAllowance: 120000,
    lta: 30000,
    otherAllowances: 46000,
    bonus: 20000,
    grossSalary: 720000,
    standardDeduction: 50000,
    section80C: 100000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 0,
    totalDeductions: 175000,
    taxableIncome: 545000,
    taxOldRegime: 22500,
    taxNewRegime: 27500,
    selectedRegimeTax: 22500,
    surcharge: 0,
    cess: 900,
    totalTax: 23400,
    tdsDeducted: 16875,
    balanceTax: 6525,
    monthlyTds: 1875
  },
  monthlyProjections: generateMonthlyProjections(720000, 1875)
}];


type SortField = 'name' | 'grossAnnual' | 'deductions' | 'taxableIncome' | 'estimatedTax' | 'monthlyTds' | 'status';
type SortDirection = 'asc' | 'desc';

export function AnnualTaxProjectionCalculation() {
  // Data state
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [projectionHistory, setProjectionHistory] = useState<ProjectionHistory[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2024-25');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [regimeFilter, setRegimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sort and pagination state
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showShortfallModal, setShowShortfallModal] = useState(false);
  const [showAdjustTdsModal, setShowAdjustTdsModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  // Projection settings
  const [projectionSettings, setProjectionSettings] = useState({
    includeBonus: true,
    includeArrears: false,
    projectionMonth: 10, // January (10th month of fiscal year)
    assumedIncrementPercentage: 0,
    includeVariablePay: true
  });

  // TDS Adjustment state
  const [adjustedTds, setAdjustedTds] = useState<number>(0);

  // Get selected employee
  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter and sort employees
  const filteredEmployees = useMemo(() => {
    let result = employees.filter((emp) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
        !emp.name.toLowerCase().includes(query) &&
        !emp.code.toLowerCase().includes(query) &&
        !emp.email.toLowerCase().includes(query) &&
        !emp.pan.toLowerCase().includes(query))
        {
          return false;
        }
      }

      // Department filter
      if (departmentFilter !== 'all' && emp.department !== departmentFilter) {
        return false;
      }

      // Regime filter
      if (regimeFilter !== 'all' && emp.regime !== regimeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && emp.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'grossAnnual':
          aVal = a.grossAnnual;
          bVal = b.grossAnnual;
          break;
        case 'deductions':
          aVal = a.deductions;
          bVal = b.deductions;
          break;
        case 'taxableIncome':
          aVal = a.taxableIncome;
          bVal = b.taxableIncome;
          break;
        case 'estimatedTax':
          aVal = a.estimatedTax;
          bVal = b.estimatedTax;
          break;
        case 'monthlyTds':
          aVal = a.monthlyTds;
          bVal = b.monthlyTds;
          break;
        case 'status':
          const statusOrder = { Pending: 0, Shortfall: 1, Complete: 2, Excess: 3 };
          aVal = statusOrder[a.status];
          bVal = statusOrder[b.status];
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return result;
  }, [employees, searchQuery, departmentFilter, regimeFilter, statusFilter, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Calculate summary
  const summary: ProjectionSummary = useMemo(() => {
    const totalGrossIncome = employees.reduce((sum, e) => sum + e.grossAnnual, 0);
    const totalDeductions = employees.reduce((sum, e) => sum + e.deductions, 0);
    const totalTaxableIncome = employees.reduce((sum, e) => sum + e.taxableIncome, 0);
    const totalProjectedTax = employees.reduce((sum, e) => sum + e.estimatedTax, 0);
    const totalTdsDeducted = employees.reduce((sum, e) => sum + e.tdsDeducted, 0);
    const totalBalanceTax = employees.reduce((sum, e) => sum + e.balanceTax, 0);

    return {
      totalEmployees: employees.length,
      totalGrossIncome,
      totalDeductions,
      totalTaxableIncome,
      totalProjectedTax,
      totalTdsDeducted,
      totalBalanceTax,
      employeesWithShortfall: employees.filter((e) => e.status === 'Shortfall').length,
      employeesWithExcess: employees.filter((e) => e.status === 'Excess').length,
      employeesComplete: employees.filter((e) => e.status === 'Complete').length,
      employeesPending: employees.filter((e) => e.status === 'Pending').length,
      averageTaxRate: totalTaxableIncome > 0 ? totalProjectedTax / totalTaxableIncome * 100 : 0,
      oldRegimeCount: employees.filter((e) => e.regime === 'Old').length,
      newRegimeCount: employees.filter((e) => e.regime === 'New').length
    };
  }, [employees]);

  // Shortfall employees
  const shortfallEmployees = useMemo(
    () => employees.filter((e) => e.status === 'Shortfall'),
    [employees]
  );

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDirection((dir) => dir === 'asc' ? 'desc' : 'asc');
        return prev;
      }
      setSortDirection('asc');
      return field;
    });
  }, []);

  // Generate projection
  const generateProjection = useCallback(async () => {
    setIsGenerating(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Recalculate projections for all employees
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      setEmployees((prev) =>
      prev.map((emp) => {
        // Simulate recalculation with some variation
        const variation = Math.random() * 0.02 - 0.01; // -1% to +1%
        const newTax = Math.round(emp.estimatedTax * (1 + variation));
        const newMonthlyTds = Math.round(newTax / 12);
        const newBalance = newTax - emp.tdsDeducted;

        let newStatus: Employee['status'] = emp.status;
        if (Math.abs(newBalance) < newTax * 0.05) {
          newStatus = 'Complete';
        } else if (newBalance > 0) {
          newStatus = 'Shortfall';
        } else {
          newStatus = 'Excess';
        }

        return {
          ...emp,
          estimatedTax: newTax,
          monthlyTds: newMonthlyTds,
          balanceTax: newBalance,
          status: emp.pan ? newStatus : 'Pending',
          projectionDate: dateStr
        };
      })
      );

      // Add to history
      const historyEntry: ProjectionHistory = {
        id: `PROJ-${Date.now()}`,
        generatedAt: now.toISOString(),
        generatedBy: 'HR Admin',
        fiscalYear,
        totalEmployees: employees.length,
        totalProjectedTax: summary.totalProjectedTax,
        parameters: {
          month: projectionSettings.projectionMonth,
          includeBonus: projectionSettings.includeBonus,
          includeArrears: projectionSettings.includeArrears
        }
      };

      setProjectionHistory((prev) => [historyEntry, ...prev]);
      setLastGenerated(now);

      setNotification({
        type: 'success',
        message: `Tax projections generated for ${employees.length} employees`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to generate projections. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [employees, fiscalYear, projectionSettings, summary.totalProjectedTax]);

  // Export data
  const handleExport = useCallback(
    async (format: string) => {
      setIsExporting(true);
      setShowExportMenu(false);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const exportData = filteredEmployees.map((emp) => ({
          employeeCode: emp.code,
          employeeName: emp.name,
          department: emp.department,
          regime: emp.regime,
          pan: emp.pan || 'N/A',
          grossAnnual: emp.grossAnnual,
          totalDeductions: emp.deductions,
          taxableIncome: emp.taxableIncome,
          estimatedTax: emp.estimatedTax,
          monthlyTds: emp.monthlyTds,
          tdsDeducted: emp.tdsDeducted,
          balanceTax: emp.balanceTax,
          status: emp.status,
          projectionDate: emp.projectionDate
        }));

        let content: string;
        let filename: string;
        let mimeType: string;

        switch (format) {
          case 'csv':
            const headers = Object.keys(exportData[0]).join(',');
            const rows = exportData.map((row) =>
            Object.values(row).
            map((v) => `"${v}"`).
            join(',')
            );
            content = [headers, ...rows].join('\n');
            filename = `tax-projection-${fiscalYear}-${new Date().toISOString().split('T')[0]}.csv`;
            mimeType = 'text/csv';
            break;

          case 'json':
            content = JSON.stringify(
              {
                exportDate: new Date().toISOString(),
                fiscalYear,
                summary,
                projectionSettings,
                employees: exportData
              },
              null,
              2
            );
            filename = `tax-projection-${fiscalYear}-${new Date().toISOString().split('T')[0]}.json`;
            mimeType = 'application/json';
            break;

          case 'excel':
            content = [
            Object.keys(exportData[0]).join('\t'),
            ...exportData.map((row) => Object.values(row).join('\t'))].
            join('\n');
            filename = `tax-projection-${fiscalYear}-${new Date().toISOString().split('T')[0]}.xls`;
            mimeType = 'application/vnd.ms-excel';
            break;

          case 'pdf':
            setNotification({
              type: 'success',
              message: 'PDF report generated and downloading...'
            });
            setIsExporting(false);
            return;

          default:
            throw new Error('Unsupported format');
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setNotification({
          type: 'success',
          message: `Exported ${filteredEmployees.length} employee projections to ${format.toUpperCase()}`
        });
      } catch (error) {
        setNotification({
          type: 'error',
          message: 'Export failed. Please try again.'
        });
      } finally {
        setIsExporting(false);
      }
    },
    [filteredEmployees, fiscalYear, summary, projectionSettings]
  );

  // View employee details
  const viewEmployeeDetails = useCallback((employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowDetailModal(true);
  }, []);

  // View breakdown
  const viewBreakdown = useCallback((employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowBreakdownModal(true);
  }, []);

  // View monthly projection
  const viewMonthlyProjection = useCallback((employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setShowMonthlyModal(true);
  }, []);

  // Open TDS adjustment
  const openTdsAdjustment = useCallback((employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (emp) {
      setSelectedEmployeeId(employeeId);
      setAdjustedTds(emp.monthlyTds);
      setShowAdjustTdsModal(true);
    }
  }, [employees]);

  // Save TDS adjustment
  const saveTdsAdjustment = useCallback(() => {
    if (!selectedEmployeeId) return;

    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id === selectedEmployeeId) {
        const newBalance = emp.estimatedTax - emp.tdsDeducted - adjustedTds * 3; // Remaining 3 months
        let newStatus: Employee['status'] = emp.status;
        if (Math.abs(newBalance) < emp.estimatedTax * 0.05) {
          newStatus = 'Complete';
        } else if (newBalance > 0) {
          newStatus = 'Shortfall';
        } else {
          newStatus = 'Excess';
        }

        return {
          ...emp,
          monthlyTds: adjustedTds,
          balanceTax: newBalance,
          status: emp.pan ? newStatus : 'Pending'
        };
      }
      return emp;
    })
    );

    setShowAdjustTdsModal(false);
    setNotification({
      type: 'success',
      message: 'Monthly TDS updated successfully'
    });
  }, [selectedEmployeeId, adjustedTds]);

  // Recalculate single employee
  const recalculateEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id === employeeId) {
        // Recalculate tax
        const taxableIncome = emp.grossAnnual - emp.deductions;
        let estimatedTax: number;

        if (emp.regime === 'New') {
          // New regime calculation
          estimatedTax = 0;
          let remaining = taxableIncome;
          if (remaining > 1500000) {
            estimatedTax += (remaining - 1500000) * 0.30;
            remaining = 1500000;
          }
          if (remaining > 1200000) {
            estimatedTax += (remaining - 1200000) * 0.20;
            remaining = 1200000;
          }
          if (remaining > 900000) {
            estimatedTax += (remaining - 900000) * 0.15;
            remaining = 900000;
          }
          if (remaining > 600000) {
            estimatedTax += (remaining - 600000) * 0.10;
            remaining = 600000;
          }
          if (remaining > 300000) {
            estimatedTax += (remaining - 300000) * 0.05;
          }
        } else {
          // Old regime calculation
          estimatedTax = 0;
          let remaining = taxableIncome;
          if (remaining > 1000000) {
            estimatedTax += (remaining - 1000000) * 0.30;
            remaining = 1000000;
          }
          if (remaining > 500000) {
            estimatedTax += (remaining - 500000) * 0.20;
            remaining = 500000;
          }
          if (remaining > 250000) {
            estimatedTax += (remaining - 250000) * 0.05;
          }
        }

        // Add cess
        estimatedTax = Math.round(estimatedTax * 1.04);

        const monthlyTds = Math.round(estimatedTax / 12);
        const balanceTax = estimatedTax - emp.tdsDeducted;

        let status: Employee['status'] = 'Complete';
        if (!emp.pan) {
          status = 'Pending';
        } else if (balanceTax > estimatedTax * 0.1) {
          status = 'Shortfall';
        } else if (balanceTax < -estimatedTax * 0.05) {
          status = 'Excess';
        }

        return {
          ...emp,
          taxableIncome,
          estimatedTax,
          monthlyTds,
          balanceTax,
          status,
          projectionDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        };
      }
      return emp;
    })
    );

    setNotification({
      type: 'success',
      message: 'Tax projection recalculated'
    });
  }, []);

  // Bulk recalculate
  const bulkRecalculate = useCallback(() => {
    if (selectedEmployees.size === 0) {
      setNotification({
        type: 'warning',
        message: 'Please select employees to recalculate'
      });
      return;
    }

    selectedEmployees.forEach((id) => {
      recalculateEmployee(id);
    });

    setSelectedEmployees(new Set());
    setNotification({
      type: 'success',
      message: `Recalculated projections for ${selectedEmployees.size} employees`
    });
  }, [selectedEmployees, recalculateEmployee]);

  // Toggle employee selection
  const toggleEmployeeSelection = useCallback((employeeId: string) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  }, []);

  // Select all on page
  const selectAllOnPage = useCallback(() => {
    const pageIds = paginatedEmployees.map((e) => e.id);
    const allSelected = pageIds.every((id) => selectedEmployees.has(id));

    if (allSelected) {
      setSelectedEmployees((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedEmployees((prev) => {
        const next = new Set(prev);
        pageIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [paginatedEmployees, selectedEmployees]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setDepartmentFilter('all');
    setRegimeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  }, []);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      departmentFilter !== 'all' ||
      regimeFilter !== 'all' ||
      statusFilter !== 'all');

  }, [searchQuery, departmentFilter, regimeFilter, statusFilter]);

  // Format currency
  const formatCurrency = (amount: number, compact = false) => {
    if (compact) {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
      return `₹${amount.toLocaleString()}`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-700';
      case 'Shortfall':
        return 'bg-orange-100 text-orange-700';
      case 'Excess':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400 ml-1" />;
    }
    return sortDirection === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600 ml-1" /> :

    <ChevronDown className="w-3 h-3 text-blue-600 ml-1" />;

  };

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification &&
      <div
        className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${
        notification.type === 'success' ?
        'bg-green-100 text-green-800' :
        notification.type === 'error' ?
        'bg-red-100 text-red-800' :
        notification.type === 'warning' ?
        'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'}`
        }>

          {notification.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'error' && <XCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {notification.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="flex-1">{notification.message}</span>
          <button onClick={() => setNotification(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Annual Tax Projection Calculation</h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Tax Projection
            {lastGenerated &&
            <span className="ml-2">
                Last generated: {lastGenerated.toLocaleString()}
              </span>
            }
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={() => setShowSettingsModal(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" onClick={() => setShowHistoryModal(true)}>
            <History className="w-4 h-4 mr-2" />
            History
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting || filteredEmployees.length === 0}>

              {isExporting ?
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

              <Download className="w-4 h-4 mr-2" />
              }
              Export
            </Button>
            {showExportMenu &&
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20">
                {EXPORT_FORMATS.map((format) =>
              <button
                key={format.value}
                onClick={() => handleExport(format.value)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg">

                    {format.label}
                  </button>
              )}
              </div>
            }
          </div>
          <Button variant="primary" onClick={generateProjection} disabled={isGenerating}>
            {isGenerating ?
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

            <Calculator className="w-4 h-4 mr-2" />
            }
            {isGenerating ? 'Generating...' : 'Generate Projection'}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2">

                <X className="w-4 h-4 text-gray-400" />
              </button>
            }
          </div>
          <Select
            options={FISCAL_YEARS}
            value={fiscalYear}
            onChange={(value) => {
              setFiscalYear(value);
              setCurrentPage(1);
            }} />

          <Select
            options={DEPARTMENTS}
            value={departmentFilter}
            onChange={(value) => {
              setDepartmentFilter(value);
              setCurrentPage(1);
            }} />

          <Select
            options={REGIME_OPTIONS}
            value={regimeFilter}
            onChange={(value) => {
              setRegimeFilter(value);
              setCurrentPage(1);
            }} />

          <Select
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }} />

        </div>
        {hasActiveFilters &&
        <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        }
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500">
              Old: {summary.oldRegimeCount} | New: {summary.newRegimeCount}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-green-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            setStatusFilter('all');
            setCurrentPage(1);
          }}>

          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalGrossIncome, true)}
          </p>
          <p className="text-sm text-gray-600">Total Projected Income</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500">
              Avg: {summary.averageTaxRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalDeductions, true)}
          </p>
          <p className="text-sm text-gray-600">Total Projected Deduction</p>
        </Card>

        <Card
          className="p-4 border-l-4 border-orange-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowShortfallModal(true)}>

          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-xs text-orange-600">
              {summary.employeesWithShortfall} shortfall
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.totalProjectedTax, true)}
          </p>
          <p className="text-sm text-gray-600">Total Projected Tax</p>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedEmployees.size > 0 &&
      <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedEmployees.size} employee(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={bulkRecalculate}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Recalculate Selected
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedEmployees(new Set())}>
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Projection Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                    paginatedEmployees.length > 0 &&
                    paginatedEmployees.every((e) => selectedEmployees.has(e.id))
                    }
                    onChange={selectAllOnPage}
                    className="rounded border-gray-300" />

                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center">
                    Employee
                    {renderSortIndicator('name')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('grossAnnual')}>

                  <div className="flex items-center justify-end">
                    Annual Gross
                    {renderSortIndicator('grossAnnual')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('deductions')}>

                  <div className="flex items-center justify-end">
                    Deductions
                    {renderSortIndicator('deductions')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('taxableIncome')}>

                  <div className="flex items-center justify-end">
                    Taxable Income
                    {renderSortIndicator('taxableIncome')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('estimatedTax')}>

                  <div className="flex items-center justify-end">
                    Estimated Tax
                    {renderSortIndicator('estimatedTax')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('monthlyTds')}>

                  <div className="flex items-center justify-end">
                    Monthly TDS
                    {renderSortIndicator('monthlyTds')}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase cursor-pointer hover:text-blue-600"
                  onClick={() => handleSort('status')}>

                  <div className="flex items-center justify-center">
                    Status
                    {renderSortIndicator('status')}
                  </div>
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEmployees.length === 0 ?
              <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-gray-500">
                    <Calculator className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No employees found</p>
                    {hasActiveFilters &&
                  <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
                        Clear Filters
                      </Button>
                  }
                  </td>
                </tr> :

              paginatedEmployees.map((emp) =>
              <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                    type="checkbox"
                    checked={selectedEmployees.has(emp.id)}
                    onChange={() => toggleEmployeeSelection(emp.id)}
                    className="rounded border-gray-300" />

                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">
                          {emp.code} · {emp.department} · {emp.regime}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(emp.grossAnnual, true)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-medium">
                      {formatCurrency(emp.deductions, true)}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">
                      {formatCurrency(emp.taxableIncome, true)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrency(emp.estimatedTax, true)}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-600 font-medium">
                      {formatCurrency(emp.monthlyTds)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className={getStatusBadge(emp.status)}>{emp.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewEmployeeDetails(emp.id)}
                      title="View Details">

                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewBreakdown(emp.id)}
                      title="View Breakdown">

                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openTdsAdjustment(emp.id)}
                      title="Adjust TDS">

                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => recalculateEmployee(emp.id)}
                      title="Recalculate">

                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of{' '}
              {filteredEmployees.length} employees
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-sm">

                {ITEMS_PER_PAGE_OPTIONS.map((option) =>
                <option key={option} value={option}>
                    {option}
                  </option>
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}>

              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}>

                    {page}
                  </Button>);

              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages || totalPages === 0}>

              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Shortfall Alert */}
      {shortfallEmployees.length > 0 &&
      <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-orange-800">Employees with Tax Shortfall</p>
              <p className="text-sm text-orange-700 mt-1">
                {shortfallEmployees.length} employees have insufficient TDS deduction. Review their
                monthly TDS amounts to avoid year-end tax liability.
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300"
                onClick={() => setShowShortfallModal(true)}>

                  View Details
                </Button>
                <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300"
                onClick={() => {
                  setStatusFilter('Shortfall');
                  setCurrentPage(1);
                }}>

                  Filter Shortfall
                </Button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Employee Detail Modal */}
      {showDetailModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Employee Tax Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowDetailModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{selectedEmployee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Code</p>
                  <p className="font-medium">{selectedEmployee.code}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tax Regime</p>
                  <p className="font-medium">{selectedEmployee.regime}</p>
                </div>
              </div>

              {/* Tax Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedEmployee.grossAnnual, true)}
                  </p>
                  <p className="text-sm text-gray-500">Gross Annual</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(selectedEmployee.deductions, true)}
                  </p>
                  <p className="text-sm text-gray-500">Deductions</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-700">
                    {formatCurrency(selectedEmployee.taxableIncome, true)}
                  </p>
                  <p className="text-sm text-gray-500">Taxable Income</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-700">
                    {formatCurrency(selectedEmployee.estimatedTax, true)}
                  </p>
                  <p className="text-sm text-gray-500">Estimated Tax</p>
                </div>
              </div>

              {/* TDS Status */}
              <div className="p-4 bg-gray-50 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 mb-3">TDS Status</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedEmployee.tdsDeducted)}
                    </p>
                    <p className="text-sm text-gray-500">TDS Deducted</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedEmployee.monthlyTds)}
                    </p>
                    <p className="text-sm text-gray-500">Monthly TDS</p>
                  </div>
                  <div>
                    <p
                    className={`text-lg font-bold ${
                    selectedEmployee.balanceTax > 0 ? 'text-orange-600' : 'text-green-600'}`
                    }>

                      {formatCurrency(Math.abs(selectedEmployee.balanceTax))}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedEmployee.balanceTax > 0 ? 'Shortfall' : 'Excess'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => viewBreakdown(selectedEmployee.id)}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Breakdown
                </Button>
                <Button variant="outline" onClick={() => viewMonthlyProjection(selectedEmployee.id)}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Monthly Projection
                </Button>
                <Button variant="outline" onClick={() => openTdsAdjustment(selectedEmployee.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Adjust TDS
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Tax Breakdown Modal */}
      {showBreakdownModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Tax Breakdown - {selectedEmployee.name}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowBreakdownModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Breakdown */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Income Components</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Basic Salary</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.basicSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>HRA</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.hra)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Special Allowance</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.specialAllowance)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>LTA</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.lta)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Other Allowances</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.otherAllowances)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Bonus</span>
                      <span className="font-medium">
                        {formatCurrency(selectedEmployee.breakdown.bonus)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-blue-50 rounded font-medium">
                      <span>Gross Salary</span>
                      <span>{formatCurrency(selectedEmployee.breakdown.grossSalary)}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Deductions</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Standard Deduction</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.standardDeduction)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Section 80C</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.section80C)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Section 80D</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.section80D)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Section 24</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.section24)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>NPS 80CCD(1B)</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.nps80CCD)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>Other Deductions</span>
                      <span className="font-medium text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.otherDeductions)}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded font-medium">
                      <span>Total Deductions</span>
                      <span className="text-green-600">
                        -{formatCurrency(selectedEmployee.breakdown.totalDeductions)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Calculation */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Tax Calculation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(selectedEmployee.breakdown.taxableIncome)}
                    </p>
                    <p className="text-sm text-gray-500">Taxable Income</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-purple-600">
                      {formatCurrency(selectedEmployee.breakdown.selectedRegimeTax)}
                    </p>
                    <p className="text-sm text-gray-500">Tax ({selectedEmployee.regime})</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-600">
                      {formatCurrency(selectedEmployee.breakdown.cess)}
                    </p>
                    <p className="text-sm text-gray-500">Cess (4%)</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(selectedEmployee.breakdown.totalTax)}
                    </p>
                    <p className="text-sm text-gray-500">Total Tax</p>
                  </div>
                </div>
              </div>

              {/* Regime Comparison */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-lg font-bold text-purple-700">
                    {formatCurrency(selectedEmployee.breakdown.taxOldRegime)}
                  </p>
                  <p className="text-sm text-gray-500">Old Regime Tax</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-lg font-bold text-blue-700">
                    {formatCurrency(selectedEmployee.breakdown.taxNewRegime)}
                  </p>
                  <p className="text-sm text-gray-500">New Regime Tax</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowBreakdownModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Monthly Projection Modal */}
      {showMonthlyModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Monthly Projection - {selectedEmployee.name}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMonthlyModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Month</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Salary</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">TDS</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Cumulative Salary</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Cumulative TDS</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Projected Tax</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-600">Variance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedEmployee.monthlyProjections.map((proj, index) =>
                  <tr key={proj.month} className={index < 9 ? 'bg-gray-50/50' : ''}>
                        <td className="px-4 py-2 font-medium">{proj.month}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(proj.salary)}</td>
                        <td className="px-4 py-2 text-right text-purple-600">
                          {formatCurrency(proj.tdsDeducted)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(proj.cumulativeSalary)}
                        </td>
                        <td className="px-4 py-2 text-right text-purple-600">
                          {formatCurrency(proj.cumulativeTds)}
                        </td>
                        <td className="px-4 py-2 text-right text-blue-600">
                          {formatCurrency(proj.projectedTax)}
                        </td>
                        <td
                      className={`px-4 py-2 text-right font-medium ${
                      proj.variance >= 0 ? 'text-green-600' : 'text-red-600'}`
                      }>

                          {proj.variance >= 0 ? '+' : ''}
                          {formatCurrency(proj.variance)}
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowMonthlyModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* TDS Adjustment Modal */}
      {showAdjustTdsModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Adjust Monthly TDS</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAdjustTdsModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Employee: {selectedEmployee.name}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Current Monthly TDS: {formatCurrency(selectedEmployee.monthlyTds)}
                </p>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Monthly TDS (₹)
                </label>
                <input
                type="number"
                value={adjustedTds}
                onChange={(e) => setAdjustedTds(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />


                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p>
                    Estimated Tax: {formatCurrency(selectedEmployee.estimatedTax)}
                  </p>
                  <p>
                    TDS Already Deducted: {formatCurrency(selectedEmployee.tdsDeducted)}
                  </p>
                  <p>
                    Remaining Months: 3
                  </p>
                  <p className="font-medium mt-2">
                    New Balance: {formatCurrency(selectedEmployee.estimatedTax - selectedEmployee.tdsDeducted - adjustedTds * 3)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAdjustTdsModal(false)}>

                  Cancel
                </Button>
                <Button variant="primary" className="flex-1" onClick={saveTdsAdjustment}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Projection Settings Modal */}
      {showSettingsModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Projection Settings</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projection Month
                  </label>
                  <select
                  value={projectionSettings.projectionMonth}
                  onChange={(e) =>
                  setProjectionSettings((prev) => ({
                    ...prev,
                    projectionMonth: parseInt(e.target.value)
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg">

                    {MONTHS.map((month, index) =>
                  <option key={month} value={index + 1}>
                        {month}
                      </option>
                  )}
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Include Bonus</p>
                    <p className="text-sm text-gray-500">Include projected bonus in calculation</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={projectionSettings.includeBonus}
                  onChange={(e) =>
                  setProjectionSettings((prev) => ({
                    ...prev,
                    includeBonus: e.target.checked
                  }))
                  }
                  className="rounded" />

                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Include Arrears</p>
                    <p className="text-sm text-gray-500">Include pending arrears</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={projectionSettings.includeArrears}
                  onChange={(e) =>
                  setProjectionSettings((prev) => ({
                    ...prev,
                    includeArrears: e.target.checked
                  }))
                  }
                  className="rounded" />

                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Include Variable Pay</p>
                    <p className="text-sm text-gray-500">Include variable components</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={projectionSettings.includeVariablePay}
                  onChange={(e) =>
                  setProjectionSettings((prev) => ({
                    ...prev,
                    includeVariablePay: e.target.checked
                  }))
                  }
                  className="rounded" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assumed Increment (%)
                  </label>
                  <input
                  type="number"
                  value={projectionSettings.assumedIncrementPercentage}
                  onChange={(e) =>
                  setProjectionSettings((prev) => ({
                    ...prev,
                    assumedIncrementPercentage: parseInt(e.target.value) || 0
                  }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg" />

                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowSettingsModal(false)}>

                  Cancel
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setShowSettingsModal(false);
                  setNotification({
                    type: 'success',
                    message: 'Projection settings saved'
                  });
                }}>

                  Save Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Shortfall Modal */}
      {showShortfallModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Tax Shortfall Analysis ({shortfallEmployees.length} employees)
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowShortfallModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3">
                {shortfallEmployees.length === 0 ?
              <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                    <p>No employees with tax shortfall</p>
                  </div> :

              shortfallEmployees.map((emp) =>
              <div key={emp.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-sm text-gray-500">{emp.code} · {emp.department}</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700">
                          Shortfall: {formatCurrency(emp.balanceTax)}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Estimated Tax</p>
                          <p className="font-medium">{formatCurrency(emp.estimatedTax)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">TDS Deducted</p>
                          <p className="font-medium">{formatCurrency(emp.tdsDeducted)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Current Monthly TDS</p>
                          <p className="font-medium">{formatCurrency(emp.monthlyTds)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Required Monthly TDS</p>
                          <p className="font-medium text-orange-600">
                            {formatCurrency(Math.ceil((emp.estimatedTax - emp.tdsDeducted) / 3 + emp.monthlyTds))}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowShortfallModal(false);
                      openTdsAdjustment(emp.id);
                    }}>

                          Adjust TDS
                        </Button>
                        <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowShortfallModal(false);
                      viewBreakdown(emp.id);
                    }}>

                          View Breakdown
                        </Button>
                      </div>
                    </div>
              )
              }
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowShortfallModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* History Modal */}
      {showHistoryModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Projection History</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {projectionHistory.length === 0 ?
            <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>No projection history available</p>
                </div> :

            <div className="space-y-3">
                  {projectionHistory.map((entry) =>
              <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {new Date(entry.generatedAt).toLocaleString()}
                        </span>
                        <Badge className="bg-blue-100 text-blue-700">{entry.fiscalYear}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Generated by: {entry.generatedBy}</p>
                        <p>Employees: {entry.totalEmployees}</p>
                        <p>Total Projected Tax: {formatCurrency(entry.totalProjectedTax)}</p>
                        <p>
                          Settings: Month {entry.parameters.month}, Bonus:{' '}
                          {entry.parameters.includeBonus ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
              )}
                </div>
            }

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowHistoryModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Click outside handlers */}
      {showExportMenu &&
      <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
      }
    </div>);

}