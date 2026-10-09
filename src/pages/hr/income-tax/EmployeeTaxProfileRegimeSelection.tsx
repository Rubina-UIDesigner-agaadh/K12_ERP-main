import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Save,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Download,
  RefreshCw,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  History,
  Edit,
  Copy,
  Printer,
  Mail,
  Calculator,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  XCircle,
  Building,
  Calendar,
  Shield,
  Lock } from
'lucide-react';

// Types
interface TaxSettings {
  previousEmployerIncome: boolean;
  previousEmployerTaxDeducted: number;
  previousEmployerIncomeTaxable: number;
  hraApplicable: boolean;
  hraMonthlyRent: number;
  hraMetroCity: boolean;
  ltaApplicable: boolean;
  ltaAmount: number;
  cityType: 'metro' | 'non-metro';
  ptApplicable: boolean;
  ptAmount: number;
}

interface TaxDeclaration {
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  section24: number;
  nps80CCD: number;
  otherDeductions: number;
}

interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  dateOfBirth: string;
  pan: string;
  panVerified: boolean;
  aadhaar: string;
  aadhaarLinked: boolean;
  residentialStatus: 'resident' | 'non-resident' | 'rnor';
  regime: 'Old' | 'New' | 'Not Selected';
  regimeLockedDate: string | null;
  regimeConfirmed: boolean;
  taxSettings: TaxSettings;
  declarations: TaxDeclaration;
  annualIncome: number;
  estimatedTaxOld: number;
  estimatedTaxNew: number;
  lastUpdated: string;
  updatedBy: string;
}

interface ProfileHistory {
  id: string;
  employeeId: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
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


const REGIME_FILTER_OPTIONS = [
{ value: 'all', label: 'All Regimes' },
{ value: 'Old', label: 'Old Regime' },
{ value: 'New', label: 'New Regime' },
{ value: 'Not Selected', label: 'Not Selected' }];


const RESIDENTIAL_STATUS_OPTIONS = [
{ value: 'resident', label: 'Resident' },
{ value: 'non-resident', label: 'Non-Resident' },
{ value: 'rnor', label: 'Resident but Not Ordinarily Resident' }];


const CITY_TYPE_OPTIONS = [
{ value: 'metro', label: 'Metro' },
{ value: 'non-metro', label: 'Non-Metro' }];


// Initial Data
const initialEmployees: Employee[] = [
{
  id: '1',
  code: 'EMP001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  phone: '+91 98765 43210',
  department: 'IT',
  designation: 'Senior Developer',
  dateOfJoining: '2020-04-01',
  dateOfBirth: '1990-05-15',
  pan: 'ABCPK1234F',
  panVerified: true,
  aadhaar: 'XXXX XXXX 1234',
  aadhaarLinked: true,
  residentialStatus: 'resident',
  regime: 'New',
  regimeLockedDate: '2024-04-15',
  regimeConfirmed: true,
  taxSettings: {
    previousEmployerIncome: false,
    previousEmployerTaxDeducted: 0,
    previousEmployerIncomeTaxable: 0,
    hraApplicable: true,
    hraMonthlyRent: 25000,
    hraMetroCity: true,
    ltaApplicable: true,
    ltaAmount: 50000,
    cityType: 'metro',
    ptApplicable: true,
    ptAmount: 2500
  },
  declarations: {
    section80C: 150000,
    section80D: 25000,
    section80E: 0,
    section80G: 10000,
    section24: 0,
    nps80CCD: 50000,
    otherDeductions: 0
  },
  annualIncome: 1500000,
  estimatedTaxOld: 195000,
  estimatedTaxNew: 150000,
  lastUpdated: '2025-01-15',
  updatedBy: 'HR Admin'
},
{
  id: '2',
  code: 'EMP002',
  name: 'Priya Sharma',
  email: 'priya.sharma@company.com',
  phone: '+91 98765 43211',
  department: 'HR',
  designation: 'HR Manager',
  dateOfJoining: '2019-06-15',
  dateOfBirth: '1988-08-22',
  pan: 'DEFPS5678G',
  panVerified: true,
  aadhaar: 'XXXX XXXX 5678',
  aadhaarLinked: true,
  residentialStatus: 'resident',
  regime: 'Old',
  regimeLockedDate: '2024-04-10',
  regimeConfirmed: true,
  taxSettings: {
    previousEmployerIncome: false,
    previousEmployerTaxDeducted: 0,
    previousEmployerIncomeTaxable: 0,
    hraApplicable: true,
    hraMonthlyRent: 30000,
    hraMetroCity: true,
    ltaApplicable: true,
    ltaAmount: 60000,
    cityType: 'metro',
    ptApplicable: true,
    ptAmount: 2500
  },
  declarations: {
    section80C: 150000,
    section80D: 50000,
    section80E: 0,
    section80G: 25000,
    section24: 200000,
    nps80CCD: 50000,
    otherDeductions: 0
  },
  annualIncome: 1800000,
  estimatedTaxOld: 180000,
  estimatedTaxNew: 210000,
  lastUpdated: '2025-01-12',
  updatedBy: 'Self'
},
{
  id: '3',
  code: 'EMP003',
  name: 'Amit Patel',
  email: 'amit.patel@company.com',
  phone: '+91 98765 43212',
  department: 'Finance',
  designation: 'Financial Analyst',
  dateOfJoining: '2022-01-10',
  dateOfBirth: '1995-03-08',
  pan: '',
  panVerified: false,
  aadhaar: '',
  aadhaarLinked: false,
  residentialStatus: 'resident',
  regime: 'Not Selected',
  regimeLockedDate: null,
  regimeConfirmed: false,
  taxSettings: {
    previousEmployerIncome: true,
    previousEmployerTaxDeducted: 45000,
    previousEmployerIncomeTaxable: 350000,
    hraApplicable: true,
    hraMonthlyRent: 15000,
    hraMetroCity: false,
    ltaApplicable: false,
    ltaAmount: 0,
    cityType: 'non-metro',
    ptApplicable: true,
    ptAmount: 2000
  },
  declarations: {
    section80C: 100000,
    section80D: 25000,
    section80E: 30000,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 0
  },
  annualIncome: 900000,
  estimatedTaxOld: 52000,
  estimatedTaxNew: 45000,
  lastUpdated: '2025-01-20',
  updatedBy: 'HR Admin'
},
{
  id: '4',
  code: 'EMP004',
  name: 'Sneha Reddy',
  email: 'sneha.reddy@company.com',
  phone: '+91 98765 43213',
  department: 'Marketing',
  designation: 'Marketing Lead',
  dateOfJoining: '2021-03-01',
  dateOfBirth: '1992-11-25',
  pan: 'GHISR9012H',
  panVerified: true,
  aadhaar: 'XXXX XXXX 9012',
  aadhaarLinked: true,
  residentialStatus: 'resident',
  regime: 'New',
  regimeLockedDate: '2024-04-20',
  regimeConfirmed: true,
  taxSettings: {
    previousEmployerIncome: false,
    previousEmployerTaxDeducted: 0,
    previousEmployerIncomeTaxable: 0,
    hraApplicable: true,
    hraMonthlyRent: 20000,
    hraMetroCity: true,
    ltaApplicable: true,
    ltaAmount: 40000,
    cityType: 'metro',
    ptApplicable: true,
    ptAmount: 2500
  },
  declarations: {
    section80C: 120000,
    section80D: 25000,
    section80E: 0,
    section80G: 5000,
    section24: 150000,
    nps80CCD: 30000,
    otherDeductions: 0
  },
  annualIncome: 1200000,
  estimatedTaxOld: 120000,
  estimatedTaxNew: 97500,
  lastUpdated: '2025-01-18',
  updatedBy: 'Self'
},
{
  id: '5',
  code: 'EMP005',
  name: 'Vikram Singh',
  email: 'vikram.singh@company.com',
  phone: '+91 98765 43214',
  department: 'Operations',
  designation: 'Operations Manager',
  dateOfJoining: '2018-09-01',
  dateOfBirth: '1985-07-12',
  pan: 'JKLVS3456I',
  panVerified: true,
  aadhaar: 'XXXX XXXX 3456',
  aadhaarLinked: true,
  residentialStatus: 'resident',
  regime: 'Old',
  regimeLockedDate: '2024-04-05',
  regimeConfirmed: true,
  taxSettings: {
    previousEmployerIncome: false,
    previousEmployerTaxDeducted: 0,
    previousEmployerIncomeTaxable: 0,
    hraApplicable: true,
    hraMonthlyRent: 35000,
    hraMetroCity: true,
    ltaApplicable: true,
    ltaAmount: 80000,
    cityType: 'metro',
    ptApplicable: true,
    ptAmount: 2500
  },
  declarations: {
    section80C: 150000,
    section80D: 75000,
    section80E: 0,
    section80G: 50000,
    section24: 200000,
    nps80CCD: 50000,
    otherDeductions: 25000
  },
  annualIncome: 2200000,
  estimatedTaxOld: 285000,
  estimatedTaxNew: 330000,
  lastUpdated: '2025-01-10',
  updatedBy: 'HR Admin'
},
{
  id: '6',
  code: 'EMP006',
  name: 'Kavita Joshi',
  email: 'kavita.joshi@company.com',
  phone: '+91 98765 43215',
  department: 'Sales',
  designation: 'Sales Executive',
  dateOfJoining: '2023-07-15',
  dateOfBirth: '1997-02-28',
  pan: 'MNOKJ7890J',
  panVerified: true,
  aadhaar: 'XXXX XXXX 7890',
  aadhaarLinked: false,
  residentialStatus: 'resident',
  regime: 'Not Selected',
  regimeLockedDate: null,
  regimeConfirmed: false,
  taxSettings: {
    previousEmployerIncome: true,
    previousEmployerTaxDeducted: 20000,
    previousEmployerIncomeTaxable: 200000,
    hraApplicable: true,
    hraMonthlyRent: 12000,
    hraMetroCity: false,
    ltaApplicable: false,
    ltaAmount: 0,
    cityType: 'non-metro',
    ptApplicable: true,
    ptAmount: 1500
  },
  declarations: {
    section80C: 50000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    section24: 0,
    nps80CCD: 0,
    otherDeductions: 0
  },
  annualIncome: 600000,
  estimatedTaxOld: 15000,
  estimatedTaxNew: 15000,
  lastUpdated: '2025-01-22',
  updatedBy: 'Self'
}];


export function EmployeeTaxProfileRegimeSelection() {
  // Data state
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [profileHistory, setProfileHistory] = useState<ProfileHistory[]>([]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2024-25');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [regimeFilter, setRegimeFilter] = useState('all');

  // Selection state
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('1');

  // Form state
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);
  const [selectedRegime, setSelectedRegime] = useState<'Old' | 'New' | 'Not Selected'>('New');
  const [regimeConfirmation, setRegimeConfirmation] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // UI state
  const [showComparison, setShowComparison] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['basic', 'regime', 'settings'])
  );

  // Get selected employee
  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
        !emp.name.toLowerCase().includes(query) &&
        !emp.code.toLowerCase().includes(query) &&
        !emp.email.toLowerCase().includes(query))
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

      return true;
    });
  }, [employees, searchQuery, departmentFilter, regimeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = employees.length;
    const newRegime = employees.filter((e) => e.regime === 'New').length;
    const oldRegime = employees.filter((e) => e.regime === 'Old').length;
    const notSelected = employees.filter((e) => e.regime === 'Not Selected').length;
    const panMissing = employees.filter((e) => !e.panVerified).length;

    return { total, newRegime, oldRegime, notSelected, panMissing };
  }, [employees]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Initialize form when employee changes
  useEffect(() => {
    if (selectedEmployee) {
      setEditedEmployee({ ...selectedEmployee });
      setSelectedRegime(selectedEmployee.regime);
      setRegimeConfirmation(selectedEmployee.regimeConfirmed);
      setHasUnsavedChanges(false);
    }
  }, [selectedEmployeeId]);

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  // Update edited employee field
  const updateField = useCallback((field: string, value: any) => {
    setEditedEmployee((prev) => {
      if (!prev) return prev;

      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      } else if (keys.length === 2) {
        return {
          ...prev,
          [keys[0]]: {
            ...(prev[keys[0] as keyof Employee] as object),
            [keys[1]]: value
          }
        };
      }
      return prev;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Update regime selection
  const handleRegimeChange = useCallback((regime: 'Old' | 'New') => {
    setSelectedRegime(regime);
    setRegimeConfirmation(false);
    setHasUnsavedChanges(true);
  }, []);

  // Save profile
  const saveProfile = useCallback(async () => {
    if (!editedEmployee || !selectedEmployee) return;

    // Validation
    if (!editedEmployee.pan && selectedRegime !== 'Not Selected') {
      setNotification({
        type: 'error',
        message: 'PAN number is required for tax regime selection'
      });
      return;
    }

    if (selectedRegime !== 'Not Selected' && !regimeConfirmation) {
      setNotification({
        type: 'warning',
        message: 'Please confirm the tax regime selection'
      });
      return;
    }

    setIsSaving(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Track changes
      const changes: ProfileHistory[] = [];

      if (selectedEmployee.regime !== selectedRegime) {
        changes.push({
          id: `H${Date.now()}-1`,
          employeeId: selectedEmployee.id,
          field: 'Tax Regime',
          oldValue: selectedEmployee.regime,
          newValue: selectedRegime,
          changedBy: 'HR Admin',
          changedAt: dateStr
        });
      }

      if (selectedEmployee.pan !== editedEmployee.pan) {
        changes.push({
          id: `H${Date.now()}-2`,
          employeeId: selectedEmployee.id,
          field: 'PAN Number',
          oldValue: selectedEmployee.pan || 'Not Set',
          newValue: editedEmployee.pan || 'Not Set',
          changedBy: 'HR Admin',
          changedAt: dateStr
        });
      }

      // Update employee
      const updatedEmployee: Employee = {
        ...editedEmployee,
        regime: selectedRegime,
        regimeConfirmed: regimeConfirmation,
        regimeLockedDate: selectedRegime !== 'Not Selected' ? dateStr : null,
        lastUpdated: dateStr,
        updatedBy: 'HR Admin'
      };

      setEmployees((prev) =>
      prev.map((e) => e.id === selectedEmployee.id ? updatedEmployee : e)
      );

      setProfileHistory((prev) => [...changes, ...prev]);
      setHasUnsavedChanges(false);

      setNotification({
        type: 'success',
        message: `Tax profile saved for ${editedEmployee.name}`
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  }, [editedEmployee, selectedEmployee, selectedRegime, regimeConfirmation]);

  // Reset form
  const resetForm = useCallback(() => {
    if (selectedEmployee) {
      setEditedEmployee({ ...selectedEmployee });
      setSelectedRegime(selectedEmployee.regime);
      setRegimeConfirmation(selectedEmployee.regimeConfirmed);
      setHasUnsavedChanges(false);
      setNotification({
        type: 'info',
        message: 'Form reset to last saved values'
      });
    }
  }, [selectedEmployee]);

  // Calculate tax estimate
  const calculateTax = useCallback((income: number, regime: 'Old' | 'New', deductions: TaxDeclaration) => {
    let taxableIncome = income - 50000; // Standard deduction

    if (regime === 'Old') {
      // Apply deductions
      taxableIncome -= Math.min(deductions.section80C, 150000);
      taxableIncome -= Math.min(deductions.section80D, 75000);
      taxableIncome -= deductions.section80E;
      taxableIncome -= deductions.section80G;
      taxableIncome -= Math.min(deductions.section24, 200000);
      taxableIncome -= Math.min(deductions.nps80CCD, 50000);
      taxableIncome -= deductions.otherDeductions;

      // Old regime slabs
      let tax = 0;
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.30;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.20;
        taxableIncome = 500000;
      }
      if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }

      return Math.round(tax * 1.04); // Including cess
    } else {
      // New regime slabs
      let tax = 0;
      if (taxableIncome > 1500000) {
        tax += (taxableIncome - 1500000) * 0.30;
        taxableIncome = 1500000;
      }
      if (taxableIncome > 1200000) {
        tax += (taxableIncome - 1200000) * 0.20;
        taxableIncome = 1200000;
      }
      if (taxableIncome > 900000) {
        tax += (taxableIncome - 900000) * 0.15;
        taxableIncome = 900000;
      }
      if (taxableIncome > 600000) {
        tax += (taxableIncome - 600000) * 0.10;
        taxableIncome = 600000;
      }
      if (taxableIncome > 300000) {
        tax += (taxableIncome - 300000) * 0.05;
      }

      return Math.round(tax * 1.04); // Including cess
    }
  }, []);

  // Get recommended regime
  const getRecommendedRegime = useCallback(() => {
    if (!editedEmployee) return null;

    const oldTax = calculateTax(editedEmployee.annualIncome, 'Old', editedEmployee.declarations);
    const newTax = calculateTax(editedEmployee.annualIncome, 'New', editedEmployee.declarations);

    return {
      recommended: oldTax < newTax ? 'Old' : 'New',
      oldTax,
      newTax,
      savings: Math.abs(oldTax - newTax)
    };
  }, [editedEmployee, calculateTax]);

  const recommendation = getRecommendedRegime();

  // Export profile
  const exportProfile = useCallback(() => {
    if (!editedEmployee) return;

    const data = {
      exportDate: new Date().toISOString(),
      fiscalYear,
      employee: {
        code: editedEmployee.code,
        name: editedEmployee.name,
        pan: editedEmployee.pan,
        regime: selectedRegime,
        declarations: editedEmployee.declarations,
        taxSettings: editedEmployee.taxSettings
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-profile-${editedEmployee.code}-${fiscalYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: 'Tax profile exported successfully'
    });
  }, [editedEmployee, fiscalYear, selectedRegime]);

  // Print profile
  const printProfile = useCallback(() => {
    window.print();
    setNotification({
      type: 'info',
      message: 'Print dialog opened'
    });
  }, []);

  // Send to employee
  const sendToEmployee = useCallback(() => {
    if (!editedEmployee) return;

    setNotification({
      type: 'success',
      message: `Tax profile sent to ${editedEmployee.email}`
    });
  }, [editedEmployee]);

  // Copy PAN
  const copyPAN = useCallback(() => {
    if (editedEmployee?.pan) {
      navigator.clipboard.writeText(editedEmployee.pan);
      setNotification({
        type: 'success',
        message: 'PAN copied to clipboard'
      });
    }
  }, [editedEmployee]);

  // Validate PAN format
  const validatePAN = useCallback((pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  }, []);

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Tax Profile & Regime Selection
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Tax Profile
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" onClick={exportProfile} disabled={!editedEmployee}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={printProfile}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={resetForm} disabled={!hasUnsavedChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button variant="primary" onClick={saveProfile} disabled={isSaving || !hasUnsavedChanges}>
            {isSaving ?
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

            <Save className="w-4 h-4 mr-2" />
            }
            Save Profile
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges &&
      <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">You have unsaved changes</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetForm}>
                Discard
              </Button>
              <Button variant="primary" size="sm" onClick={saveProfile}>
                Save Now
              </Button>
            </div>
          </div>
        </Card>
      }

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            onChange={setFiscalYear} />

          <Select
            options={DEPARTMENTS}
            value={departmentFilter}
            onChange={setDepartmentFilter} />

          <Select
            options={REGIME_FILTER_OPTIONS}
            value={regimeFilter}
            onChange={setRegimeFilter} />

        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t grid grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-500">Total Employees</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{stats.newRegime}</p>
            <p className="text-xs text-gray-500">New Regime</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{stats.oldRegime}</p>
            <p className="text-xs text-gray-500">Old Regime</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{stats.notSelected}</p>
            <p className="text-xs text-gray-500">Not Selected</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{stats.panMissing}</p>
            <p className="text-xs text-gray-500">PAN Missing</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Employee List Sidebar */}
        <Card className="lg:col-span-1 p-4 h-[700px] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">
            Employee List ({filteredEmployees.length})
          </h3>
          <div className="space-y-2">
            {filteredEmployees.length === 0 ?
            <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p>No employees found</p>
              </div> :

            filteredEmployees.map((emp) =>
            <div
              key={emp.id}
              onClick={() => {
                if (hasUnsavedChanges) {
                  const confirm = window.confirm('You have unsaved changes. Discard them?');
                  if (!confirm) return;
                }
                setSelectedEmployeeId(emp.id);
              }}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedEmployeeId === emp.id ?
              'bg-blue-50 border-2 border-blue-500' :
              'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}`
              }>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.code}</p>
                      <p className="text-xs text-gray-500">{emp.department}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                  className={
                  emp.regime === 'New' ?
                  'bg-blue-100 text-blue-700 text-xs' :
                  emp.regime === 'Old' ?
                  'bg-purple-100 text-purple-700 text-xs' :
                  'bg-red-100 text-red-700 text-xs'
                  }>

                      {emp.regime}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {emp.panVerified ?
                  <CheckCircle className="w-4 h-4 text-green-600" title="PAN Verified" /> :

                  <AlertCircle className="w-4 h-4 text-red-600" title="PAN Missing" />
                  }
                      {emp.regimeConfirmed &&
                  <Lock className="w-4 h-4 text-blue-600" title="Regime Locked" />
                  }
                    </div>
                  </div>
                </div>
            )
            }
          </div>
        </Card>

        {/* Tax Profile Form */}
        <div className="lg:col-span-3 space-y-6">
          {editedEmployee ?
          <>
              {/* Basic Tax Information */}
              <Card className="p-6">
                <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('basic')}>

                  <h3 className="text-lg font-bold text-gray-900">Basic Tax Information</h3>
                  {expandedSections.has('basic') ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :

                <ChevronDown className="w-5 h-5 text-gray-500" />
                }
                </div>

                {expandedSections.has('basic') &&
              <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Name
                        </label>
                        <Input value={editedEmployee.name} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Code
                        </label>
                        <Input value={editedEmployee.code} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input value={editedEmployee.email} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department
                        </label>
                        <Input value={editedEmployee.department} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number *
                        </label>
                        <div className="flex gap-2">
                          <input
                        type="text"
                        value={editedEmployee.pan}
                        onChange={(e) => updateField('pan', e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        editedEmployee.pan && !validatePAN(editedEmployee.pan) ?
                        'border-red-500' :
                        'border-gray-300'}`
                        } />

                          {editedEmployee.pan &&
                      <Button variant="outline" size="sm" onClick={copyPAN}>
                              <Copy className="w-4 h-4" />
                            </Button>
                      }
                        </div>
                        {editedEmployee.pan && !validatePAN(editedEmployee.pan) &&
                    <p className="text-xs text-red-500 mt-1">Invalid PAN format</p>
                    }
                        {editedEmployee.panVerified &&
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            PAN Verified
                          </p>
                    }
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhaar Number
                        </label>
                        <input
                      type="text"
                      value={editedEmployee.aadhaar}
                      onChange={(e) => updateField('aadhaar', e.target.value)}
                      placeholder="XXXX XXXX 1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                        {editedEmployee.aadhaarLinked &&
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Linked with PAN
                          </p>
                    }
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Joining
                        </label>
                        <Input value={formatDate(editedEmployee.dateOfJoining)} disabled />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Residential Status
                        </label>
                        <select
                      value={editedEmployee.residentialStatus}
                      onChange={(e) => updateField('residentialStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">

                          {RESIDENTIAL_STATUS_OPTIONS.map((opt) =>
                      <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                      )}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Annual Income</p>
                        <p className="text-lg font-bold text-gray-900">
                          ₹{editedEmployee.annualIncome.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Old Regime Tax</p>
                        <p className="text-lg font-bold text-purple-700">
                          ₹{editedEmployee.estimatedTaxOld.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">New Regime Tax</p>
                        <p className="text-lg font-bold text-blue-700">
                          ₹{editedEmployee.estimatedTaxNew.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Potential Savings</p>
                        <p className="text-lg font-bold text-green-700">
                          ₹{Math.abs(editedEmployee.estimatedTaxOld - editedEmployee.estimatedTaxNew).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
              }
              </Card>

              {/* Tax Regime Selection */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Tax Regime Selection</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowCalculatorModal(true)}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculator
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowComparison(true)}>
                      <Info className="w-4 h-4 mr-2" />
                      Compare Regimes
                    </Button>
                  </div>
                </div>

                {/* Recommendation Banner */}
                {recommendation && selectedRegime === 'Not Selected' &&
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        Recommended: {recommendation.recommended} Regime
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      You could save ₹{recommendation.savings.toLocaleString()} with the{' '}
                      {recommendation.recommended} regime based on your declarations.
                    </p>
                  </div>
              }

                {/* Locked Regime Warning */}
                {editedEmployee.regimeConfirmed && editedEmployee.regimeLockedDate &&
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Regime Locked on {editedEmployee.regimeLockedDate}
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Tax regime has been confirmed and cannot be changed for this fiscal year.
                      Contact HR for any modifications.
                    </p>
                  </div>
              }

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div
                  onClick={() => !editedEmployee.regimeConfirmed && handleRegimeChange('Old')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                  editedEmployee.regimeConfirmed ?
                  'cursor-not-allowed opacity-75' :
                  'cursor-pointer'} ${

                  selectedRegime === 'Old' ?
                  'border-purple-500 bg-purple-50' :
                  'border-gray-300 hover:border-purple-300'}`
                  }>

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">Old Regime</h4>
                      {selectedRegime === 'Old' &&
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    }
                    </div>
                    <p className="text-sm text-gray-600">With deductions & exemptions</p>
                    <ul className="mt-3 space-y-1 text-xs text-gray-600">
                      <li>✓ 80C, 80D deductions allowed</li>
                      <li>✓ HRA exemption available</li>
                      <li>✓ Standard deduction ₹50,000</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-lg font-bold text-purple-700">
                        Estimated Tax: ₹{editedEmployee.estimatedTaxOld.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div
                  onClick={() => !editedEmployee.regimeConfirmed && handleRegimeChange('New')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                  editedEmployee.regimeConfirmed ?
                  'cursor-not-allowed opacity-75' :
                  'cursor-pointer'} ${

                  selectedRegime === 'New' ?
                  'border-blue-500 bg-blue-50' :
                  'border-gray-300 hover:border-blue-300'}`
                  }>

                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">New Regime</h4>
                      {selectedRegime === 'New' && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">Lower tax rates</p>
                    <ul className="mt-3 space-y-1 text-xs text-gray-600">
                      <li>✓ Lower tax slabs</li>
                      <li>✓ Standard deduction ₹50,000</li>
                      <li>✗ No other deductions</li>
                    </ul>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-lg font-bold text-blue-700">
                        Estimated Tax: ₹{editedEmployee.estimatedTaxNew.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                {selectedRegime !== 'Not Selected' && !editedEmployee.regimeConfirmed &&
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Declaration Required</p>
                        <label className="flex items-center gap-2 mt-2 text-sm text-yellow-700 cursor-pointer">
                          <input
                        type="checkbox"
                        checked={regimeConfirmation}
                        onChange={(e) => {
                          setRegimeConfirmation(e.target.checked);
                          setHasUnsavedChanges(true);
                        }}
                        className="rounded border-yellow-400" />

                          I confirm the selected tax regime ({selectedRegime}) for FY {fiscalYear}. I understand
                          this selection cannot be changed after confirmation.
                        </label>
                      </div>
                    </div>
                  </div>
              }
              </Card>

              {/* Tax Settings */}
              <Card className="p-6">
                <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('settings')}>

                  <h3 className="text-lg font-bold text-gray-900">Tax Settings</h3>
                  {expandedSections.has('settings') ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :

                <ChevronDown className="w-5 h-5 text-gray-500" />
                }
                </div>

                {expandedSections.has('settings') &&
              <div className="mt-4 space-y-4">
                    {/* Previous Employer Income */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">Previous Employer Income</p>
                          <p className="text-sm text-gray-600">Include income from previous employer</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={editedEmployee.taxSettings.previousEmployerIncome}
                        onChange={(e) =>
                        updateField('taxSettings.previousEmployerIncome', e.target.checked)
                        }
                        className="sr-only peer" />

                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {editedEmployee.taxSettings.previousEmployerIncome &&
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Taxable Income (₹)
                            </label>
                            <input
                        type="number"
                        value={editedEmployee.taxSettings.previousEmployerIncomeTaxable}
                        onChange={(e) =>
                        updateField(
                          'taxSettings.previousEmployerIncomeTaxable',
                          parseInt(e.target.value) || 0
                        )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Tax Deducted (₹)
                            </label>
                            <input
                        type="number"
                        value={editedEmployee.taxSettings.previousEmployerTaxDeducted}
                        onChange={(e) =>
                        updateField(
                          'taxSettings.previousEmployerTaxDeducted',
                          parseInt(e.target.value) || 0
                        )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                          </div>
                        </div>
                  }
                    </div>

                    {/* HRA Settings */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">HRA Applicable</p>
                          <p className="text-sm text-gray-600">House Rent Allowance exemption</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={editedEmployee.taxSettings.hraApplicable}
                        onChange={(e) => updateField('taxSettings.hraApplicable', e.target.checked)}
                        className="sr-only peer" />

                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {editedEmployee.taxSettings.hraApplicable &&
                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Monthly Rent (₹)
                            </label>
                            <input
                        type="number"
                        value={editedEmployee.taxSettings.hraMonthlyRent}
                        onChange={(e) =>
                        updateField('taxSettings.hraMonthlyRent', parseInt(e.target.value) || 0)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">City Type</label>
                            <select
                        value={editedEmployee.taxSettings.cityType}
                        onChange={(e) => updateField('taxSettings.cityType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">

                              {CITY_TYPE_OPTIONS.map((opt) =>
                        <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                        )}
                            </select>
                          </div>
                        </div>
                  }
                    </div>

                    {/* LTA Settings */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">LTA Applicable</p>
                          <p className="text-sm text-gray-600">Leave Travel Allowance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={editedEmployee.taxSettings.ltaApplicable}
                        onChange={(e) => updateField('taxSettings.ltaApplicable', e.target.checked)}
                        className="sr-only peer" />

                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {editedEmployee.taxSettings.ltaApplicable &&
                  <div className="mt-3 pt-3 border-t">
                          <label className="block text-sm text-gray-600 mb-1">LTA Amount (₹)</label>
                          <input
                      type="number"
                      value={editedEmployee.taxSettings.ltaAmount}
                      onChange={(e) =>
                      updateField('taxSettings.ltaAmount', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                        </div>
                  }
                    </div>

                    {/* Professional Tax */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">Professional Tax</p>
                          <p className="text-sm text-gray-600">State professional tax deduction</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                        type="checkbox"
                        checked={editedEmployee.taxSettings.ptApplicable}
                        onChange={(e) => updateField('taxSettings.ptApplicable', e.target.checked)}
                        className="sr-only peer" />

                          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      {editedEmployee.taxSettings.ptApplicable &&
                  <div className="mt-3 pt-3 border-t">
                          <label className="block text-sm text-gray-600 mb-1">
                            Annual PT Amount (₹)
                          </label>
                          <input
                      type="number"
                      value={editedEmployee.taxSettings.ptAmount}
                      onChange={(e) =>
                      updateField('taxSettings.ptAmount', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                        </div>
                  }
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Standard Deduction:</strong> ₹50,000 (Applicable for both regimes from FY
                        2023-24)
                      </p>
                    </div>
                  </div>
              }
              </Card>

              {/* Investment Declarations (Old Regime Only) */}
              {selectedRegime === 'Old' &&
            <Card className="p-6">
                  <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection('declarations')}>

                    <h3 className="text-lg font-bold text-gray-900">Investment Declarations</h3>
                    {expandedSections.has('declarations') ?
                <ChevronUp className="w-5 h-5 text-gray-500" /> :

                <ChevronDown className="w-5 h-5 text-gray-500" />
                }
                  </div>

                  {expandedSections.has('declarations') &&
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 80C (Max ₹1.5L)
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.section80C}
                    onChange={(e) =>
                    updateField(
                      'declarations.section80C',
                      Math.min(parseInt(e.target.value) || 0, 150000)
                    )
                    }
                    max={150000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 80D - Health Insurance (Max ₹75K)
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.section80D}
                    onChange={(e) =>
                    updateField(
                      'declarations.section80D',
                      Math.min(parseInt(e.target.value) || 0, 75000)
                    )
                    }
                    max={75000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 80E - Education Loan
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.section80E}
                    onChange={(e) =>
                    updateField('declarations.section80E', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 80G - Donations
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.section80G}
                    onChange={(e) =>
                    updateField('declarations.section80G', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section 24 - Home Loan Interest (Max ₹2L)
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.section24}
                    onChange={(e) =>
                    updateField(
                      'declarations.section24',
                      Math.min(parseInt(e.target.value) || 0, 200000)
                    )
                    }
                    max={200000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NPS 80CCD(1B) (Max ₹50K)
                        </label>
                        <input
                    type="number"
                    value={editedEmployee.declarations.nps80CCD}
                    onChange={(e) =>
                    updateField(
                      'declarations.nps80CCD',
                      Math.min(parseInt(e.target.value) || 0, 50000)
                    )
                    }
                    max={50000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />

                      </div>
                    </div>
              }
                </Card>
            }

              {/* Profile History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Profile History</h3>
                  <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
                    <History className="w-4 h-4 mr-2" />
                    View All
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    Last Updated: {editedEmployee.lastUpdated} by {editedEmployee.updatedBy}
                  </p>
                  {editedEmployee.regimeLockedDate &&
                <p className="mt-1">
                      Regime Locked: {editedEmployee.regimeLockedDate}
                    </p>
                }
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={sendToEmployee}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send to Employee
                </Button>
                <Button variant="outline" onClick={resetForm} disabled={!hasUnsavedChanges}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button variant="primary" onClick={saveProfile} disabled={isSaving || !hasUnsavedChanges}>
                  {isSaving ?
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> :

                <Save className="w-4 h-4 mr-2" />
                }
                  Save Profile
                </Button>
              </div>
            </> :

          <Card className="p-12 text-center">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select an employee to view and edit their tax profile</p>
            </Card>
          }
        </div>
      </div>

      {/* Regime Comparison Modal */}
      {showComparison &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tax Regime Comparison</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {editedEmployee && recommendation &&
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-green-800">
                      Recommendation for {editedEmployee.name}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Based on your income of ₹{editedEmployee.annualIncome.toLocaleString()} and
                    declarations, the <strong>{recommendation.recommended} Regime</strong> is
                    recommended. You could save ₹{recommendation.savings.toLocaleString()}.
                  </p>
                </div>
            }

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Old Regime */}
                <div className="border-2 border-purple-200 rounded-lg p-4">
                  <h3 className="font-bold text-purple-700 mb-4 text-lg">Old Regime</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tax Slabs</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Up to ₹2.5L</span>
                          <span className="font-medium text-green-600">Nil</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹2.5L - ₹5L</span>
                          <span className="font-medium">5%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹5L - ₹10L</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Above ₹10L</span>
                          <span className="font-medium">30%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deductions Allowed</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          80C - Up to ₹1.5L
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          80D - Up to ₹25K/₹50K
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          HRA Exemption
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          LTA Exemption
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Standard Deduction - ₹50K
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Section 24 - Home Loan Interest
                        </li>
                      </ul>
                    </div>
                    {editedEmployee &&
                  <div className="mt-4 pt-4 border-t">
                        <p className="text-lg font-bold text-purple-700">
                          Estimated Tax: ₹{recommendation?.oldTax.toLocaleString()}
                        </p>
                      </div>
                  }
                  </div>
                </div>

                {/* New Regime */}
                <div className="border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-700 mb-4 text-lg">New Regime</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tax Slabs</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Up to ₹3L</span>
                          <span className="font-medium text-green-600">Nil</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹3L - ₹6L</span>
                          <span className="font-medium">5%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹6L - ₹9L</span>
                          <span className="font-medium">10%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹9L - ₹12L</span>
                          <span className="font-medium">15%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>₹12L - ₹15L</span>
                          <span className="font-medium">20%</span>
                        </div>
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Above ₹15L</span>
                          <span className="font-medium">30%</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Deductions Allowed</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Standard Deduction - ₹50K
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          No 80C deductions
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          No 80D deductions
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          No HRA exemption
                        </li>
                        <li className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600" />
                          No LTA exemption
                        </li>
                      </ul>
                    </div>
                    {editedEmployee &&
                  <div className="mt-4 pt-4 border-t">
                        <p className="text-lg font-bold text-blue-700">
                          Estimated Tax: ₹{recommendation?.newTax.toLocaleString()}
                        </p>
                      </div>
                  }
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowComparison(false)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Tax Calculator Modal */}
      {showCalculatorModal && editedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tax Calculator</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCalculatorModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Income Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Gross Annual Income</label>
                      <p className="text-lg font-bold">₹{editedEmployee.annualIncome.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Standard Deduction</label>
                      <p className="text-lg font-bold">₹50,000</p>
                    </div>
                  </div>
                </div>

                {selectedRegime === 'Old' &&
              <div className="p-4 bg-purple-50 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-3">Deductions (Old Regime)</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>80C:</span>
                        <span className="font-medium">₹{editedEmployee.declarations.section80C.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>80D:</span>
                        <span className="font-medium">₹{editedEmployee.declarations.section80D.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Section 24:</span>
                        <span className="font-medium">₹{editedEmployee.declarations.section24.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>NPS 80CCD:</span>
                        <span className="font-medium">₹{editedEmployee.declarations.nps80CCD.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
              }

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-100 rounded-lg text-center">
                    <p className="text-sm text-purple-700">Old Regime Tax</p>
                    <p className="text-2xl font-bold text-purple-800">
                      ₹{recommendation?.oldTax.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-lg text-center">
                    <p className="text-sm text-blue-700">New Regime Tax</p>
                    <p className="text-2xl font-bold text-blue-800">
                      ₹{recommendation?.newTax.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-100 rounded-lg text-center">
                  <p className="text-sm text-green-700">Recommended Regime</p>
                  <p className="text-xl font-bold text-green-800">{recommendation?.recommended}</p>
                  <p className="text-sm text-green-700 mt-1">
                    Save ₹{recommendation?.savings.toLocaleString()} annually
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setShowCalculatorModal(false)}>
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
                <h2 className="text-xl font-bold text-gray-900">Profile Change History</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {profileHistory.filter((h) => h.employeeId === selectedEmployeeId).length === 0 ?
            <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>No history available for this employee</p>
                </div> :

            <div className="space-y-3">
                  {profileHistory.
              filter((h) => h.employeeId === selectedEmployeeId).
              map((entry) =>
              <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{entry.field}</span>
                          <span className="text-xs text-gray-500">{entry.changedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-red-600 line-through">{entry.oldValue}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="text-green-600">{entry.newValue}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Changed by {entry.changedBy}</p>
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
    </div>);

}