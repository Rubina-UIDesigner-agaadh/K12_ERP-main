import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Save,
  FileText,
  TrendingUp,
  Home,
  Heart,
  BookOpen,
  DollarSign,
  AlertCircle,
  CheckCircle,
  X,
  Upload,
  Trash2,
  Download,
  Printer,
  RefreshCw,
  Eye,
  Edit2,
  Copy,
  History,
  Calculator,
  Info,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Send,
  FileCheck,
  Clock,
  Plus,
  Minus } from
'lucide-react';

// Types
interface Employee {
  id: string;
  employeeId: string;
  name: string;
  initials: string;
  department: string;
  designation: string;
  email: string;
  pan: string;
  regime: 'New' | 'Old';
  joiningDate: string;
}

interface IncomeDetails {
  basicSalary: number;
  hra: number;
  otherAllowances: number;
  previousEmployerIncome: number;
  otherIncome: number;
  interestIncome: number;
  rentalIncome: number;
  capitalGains: number;
}

interface Investment80C {
  id: string;
  name: string;
  category: string;
  declaredAmount: number;
  approvedAmount: number;
  remarks: string;
  proofUploaded: boolean;
  proofFileName: string | null;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface Medical80D {
  selfHealthInsurance: number;
  selfPreventiveCheckup: number;
  parentsHealthInsurance: number;
  parentsPreventiveCheckup: number;
  parentsAreSenior: boolean;
}

interface HRADetails {
  annualRentPaid: number;
  landlordName: string;
  landlordPAN: string;
  landlordAddress: string;
  cityType: 'metro' | 'non-metro';
  fromMonth: string;
  toMonth: string;
  rentReceipts: boolean;
}

interface HousingLoan {
  interestOnHomeLoan: number;
  principalRepayment: number;
  lenderName: string;
  lenderPAN: string;
  propertyAddress: string;
  possessionDate: string;
  isSelfOccupied: boolean;
}

interface OtherDeductions {
  section80E: number;
  section80G: number;
  section80TTA: number;
  section80U: number;
  section80DD: number;
  section80DDB: number;
  section80GG: number;
  nps80CCD1B: number;
  nps80CCD2: number;
  otherSections: number;
}

interface Declaration {
  id: string;
  fiscalYear: string;
  employeeId: string;
  incomeDetails: IncomeDetails;
  investments80C: Investment80C[];
  medical80D: Medical80D;
  hraDetails: HRADetails;
  housingLoan: HousingLoan;
  otherDeductions: OtherDeductions;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  lastModified: string;
  comments: DeclarationComment[];
  history: DeclarationHistory[];
}

interface DeclarationComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  section: string;
}

interface DeclarationHistory {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
  previousValue?: string;
  newValue?: string;
}

interface Notification {
  show: boolean;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface ValidationError {
  field: string;
  message: string;
  section: string;
}

// Constants
const FISCAL_YEARS = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-2023' }];


const EMPLOYEES: Employee[] = [
{
  id: '1',
  employeeId: 'EMP001',
  name: 'Rajesh Kumar',
  initials: 'RK',
  department: 'IT',
  designation: 'Senior Developer',
  email: 'rajesh.kumar@company.com',
  pan: 'ABCPK1234A',
  regime: 'New',
  joiningDate: '2020-03-15'
},
{
  id: '2',
  employeeId: 'EMP002',
  name: 'Priya Sharma',
  initials: 'PS',
  department: 'HR',
  designation: 'HR Manager',
  email: 'priya.sharma@company.com',
  pan: 'DEFPS5678B',
  regime: 'Old',
  joiningDate: '2019-07-01'
},
{
  id: '3',
  employeeId: 'EMP003',
  name: 'Amit Patel',
  initials: 'AP',
  department: 'Finance',
  designation: 'Financial Analyst',
  email: 'amit.patel@company.com',
  pan: 'GHIAP9012C',
  regime: 'New',
  joiningDate: '2021-01-10'
}];


const INVESTMENT_80C_CATEGORIES = [
{ id: 'lic', name: 'LIC Premium', limit: 150000, category: 'Insurance' },
{ id: 'ppf', name: 'PPF', limit: 150000, category: 'Savings' },
{ id: 'elss', name: 'ELSS Mutual Funds', limit: 150000, category: 'Investment' },
{ id: 'home_loan_principal', name: 'Home Loan Principal', limit: 150000, category: 'Housing' },
{ id: 'nsc', name: 'NSC', limit: 150000, category: 'Savings' },
{ id: 'tax_saver_fd', name: 'Tax Saver FD', limit: 150000, category: 'Savings' },
{ id: 'sukanya', name: 'Sukanya Samriddhi', limit: 150000, category: 'Savings' },
{ id: 'tuition_fees', name: 'Children Tuition Fees', limit: 150000, category: 'Education' },
{ id: 'ulip', name: 'ULIP', limit: 150000, category: 'Insurance' },
{ id: 'nps_80ccd1', name: 'NPS (80CCD1)', limit: 150000, category: 'Pension' }];


const CITY_TYPE_OPTIONS = [
{ value: 'metro', label: 'Metro (Delhi, Mumbai, Chennai, Kolkata)' },
{ value: 'non-metro', label: 'Non-Metro' }];


const MONTHS = [
{ value: '04', label: 'April' },
{ value: '05', label: 'May' },
{ value: '06', label: 'June' },
{ value: '07', label: 'July' },
{ value: '08', label: 'August' },
{ value: '09', label: 'September' },
{ value: '10', label: 'October' },
{ value: '11', label: 'November' },
{ value: '12', label: 'December' },
{ value: '01', label: 'January' },
{ value: '02', label: 'February' },
{ value: '03', label: 'March' }];


const LIMITS = {
  section80C: 150000,
  section80D_self: 25000,
  section80D_self_senior: 50000,
  section80D_parents: 25000,
  section80D_parents_senior: 50000,
  section80D_preventive: 5000,
  homeLoanInterest: 200000,
  section80TTA: 10000,
  section80TTB: 50000,
  nps80CCD1B: 50000,
  section80GG: 60000,
  section80E: Infinity,
  section80G: Infinity
};

// Tax Calculation Functions
const calculateNewRegimeTax = (taxableIncome: number): number => {
  let tax = 0;

  if (taxableIncome <= 300000) {
    tax = 0;
  } else if (taxableIncome <= 600000) {
    tax = (taxableIncome - 300000) * 0.05;
  } else if (taxableIncome <= 900000) {
    tax = 15000 + (taxableIncome - 600000) * 0.10;
  } else if (taxableIncome <= 1200000) {
    tax = 45000 + (taxableIncome - 900000) * 0.15;
  } else if (taxableIncome <= 1500000) {
    tax = 90000 + (taxableIncome - 1200000) * 0.20;
  } else {
    tax = 150000 + (taxableIncome - 1500000) * 0.30;
  }

  // Rebate under 87A for income up to 7 lakhs
  if (taxableIncome <= 700000) {
    tax = Math.max(0, tax - 25000);
  }

  // Add 4% cess
  tax = tax * 1.04;

  return Math.round(tax);
};

const calculateOldRegimeTax = (taxableIncome: number): number => {
  let tax = 0;

  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 12500 + (taxableIncome - 500000) * 0.20;
  } else {
    tax = 112500 + (taxableIncome - 1000000) * 0.30;
  }

  // Rebate under 87A for income up to 5 lakhs
  if (taxableIncome <= 500000) {
    tax = Math.max(0, tax - 12500);
  }

  // Add 4% cess
  tax = tax * 1.04;

  return Math.round(tax);
};

const calculateHRAExemption = (
basicSalary: number,
hraReceived: number,
rentPaid: number,
isMetro: boolean)
: number => {
  const exemption1 = hraReceived;
  const exemption2 = rentPaid - 0.1 * basicSalary;
  const exemption3 = (isMetro ? 0.5 : 0.4) * basicSalary;

  return Math.max(0, Math.min(exemption1, exemption2, exemption3));
};

// Utility Functions
const generateId = (): string => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Initial States
const getInitialIncomeDetails = (): IncomeDetails => ({
  basicSalary: 800000,
  hra: 240000,
  otherAllowances: 160000,
  previousEmployerIncome: 0,
  otherIncome: 0,
  interestIncome: 0,
  rentalIncome: 0,
  capitalGains: 0
});

const getInitial80CInvestments = (): Investment80C[] =>
INVESTMENT_80C_CATEGORIES.map((cat) => ({
  id: cat.id,
  name: cat.name,
  category: cat.category,
  declaredAmount: 0,
  approvedAmount: 0,
  remarks: '',
  proofUploaded: false,
  proofFileName: null,
  status: 'Pending'
}));

const getInitialMedical80D = (): Medical80D => ({
  selfHealthInsurance: 0,
  selfPreventiveCheckup: 0,
  parentsHealthInsurance: 0,
  parentsPreventiveCheckup: 0,
  parentsAreSenior: false
});

const getInitialHRADetails = (): HRADetails => ({
  annualRentPaid: 0,
  landlordName: '',
  landlordPAN: '',
  landlordAddress: '',
  cityType: 'metro',
  fromMonth: '04',
  toMonth: '03',
  rentReceipts: false
});

const getInitialHousingLoan = (): HousingLoan => ({
  interestOnHomeLoan: 0,
  principalRepayment: 0,
  lenderName: '',
  lenderPAN: '',
  propertyAddress: '',
  possessionDate: '',
  isSelfOccupied: true
});

const getInitialOtherDeductions = (): OtherDeductions => ({
  section80E: 0,
  section80G: 0,
  section80TTA: 0,
  section80U: 0,
  section80DD: 0,
  section80DDB: 0,
  section80GG: 0,
  nps80CCD1B: 0,
  nps80CCD2: 0,
  otherSections: 0
});

export function EmployeeIncomeInvestmentDeclaration() {
  // Core State
  const [activeTab, setActiveTab] = useState('income');
  const [fiscalYear, setFiscalYear] = useState('2024-25');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('EMP001');
  const [regime, setRegime] = useState<'New' | 'Old'>('New');

  // Form State
  const [incomeDetails, setIncomeDetails] = useState<IncomeDetails>(getInitialIncomeDetails());
  const [investments80C, setInvestments80C] = useState<Investment80C[]>(getInitial80CInvestments());
  const [medical80D, setMedical80D] = useState<Medical80D>(getInitialMedical80D());
  const [hraDetails, setHRADetails] = useState<HRADetails>(getInitialHRADetails());
  const [housingLoan, setHousingLoan] = useState<HousingLoan>(getInitialHousingLoan());
  const [otherDeductions, setOtherDeductions] = useState<OtherDeductions>(getInitialOtherDeductions());

  // Declaration State
  const [declarationStatus, setDeclarationStatus] = useState<'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected'>('Draft');
  const [declarationHistory, setDeclarationHistory] = useState<DeclarationHistory[]>([]);
  const [declarationComments, setDeclarationComments] = useState<DeclarationComment[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showRegimeComparison, setShowRegimeComparison] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showProofUpload, setShowProofUpload] = useState(false);
  const [selectedInvestmentForProof, setSelectedInvestmentForProof] = useState<string | null>(null);
  const [showTaxCalculator, setShowTaxCalculator] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Notification State
  const [notification, setNotification] = useState<Notification>({
    show: false,
    type: 'success',
    message: ''
  });

  // Computed Values
  const selectedEmployee = useMemo(
    () => EMPLOYEES.find((e) => e.employeeId === selectedEmployeeId),
    [selectedEmployeeId]
  );

  const totalIncome = useMemo(() => {
    return (
      incomeDetails.basicSalary +
      incomeDetails.hra +
      incomeDetails.otherAllowances +
      incomeDetails.previousEmployerIncome +
      incomeDetails.otherIncome +
      incomeDetails.interestIncome +
      incomeDetails.rentalIncome +
      incomeDetails.capitalGains);

  }, [incomeDetails]);

  const total80C = useMemo(() => {
    const sum = investments80C.reduce((acc, inv) => acc + inv.declaredAmount, 0);
    return Math.min(sum, LIMITS.section80C);
  }, [investments80C]);

  const total80CRaw = useMemo(() => {
    return investments80C.reduce((acc, inv) => acc + inv.declaredAmount, 0);
  }, [investments80C]);

  const total80D = useMemo(() => {
    const selfLimit = LIMITS.section80D_self;
    const parentsLimit = medical80D.parentsAreSenior ?
    LIMITS.section80D_parents_senior :
    LIMITS.section80D_parents;

    const selfTotal = Math.min(
      medical80D.selfHealthInsurance + medical80D.selfPreventiveCheckup,
      selfLimit
    );
    const parentsTotal = Math.min(
      medical80D.parentsHealthInsurance + medical80D.parentsPreventiveCheckup,
      parentsLimit
    );

    return selfTotal + parentsTotal;
  }, [medical80D]);

  const hraExemption = useMemo(() => {
    if (hraDetails.annualRentPaid <= 0) return 0;
    return calculateHRAExemption(
      incomeDetails.basicSalary,
      incomeDetails.hra,
      hraDetails.annualRentPaid,
      hraDetails.cityType === 'metro'
    );
  }, [incomeDetails.basicSalary, incomeDetails.hra, hraDetails]);

  const homeLoanInterestDeduction = useMemo(() => {
    return Math.min(housingLoan.interestOnHomeLoan, LIMITS.homeLoanInterest);
  }, [housingLoan.interestOnHomeLoan]);

  const totalOtherDeductions = useMemo(() => {
    return (
      Math.min(otherDeductions.section80TTA, LIMITS.section80TTA) +
      otherDeductions.section80E +
      otherDeductions.section80G +
      otherDeductions.section80U +
      otherDeductions.section80DD +
      otherDeductions.section80DDB +
      Math.min(otherDeductions.section80GG, LIMITS.section80GG) +
      Math.min(otherDeductions.nps80CCD1B, LIMITS.nps80CCD1B) +
      otherDeductions.nps80CCD2 +
      otherDeductions.otherSections);

  }, [otherDeductions]);

  const totalDeductions = useMemo(() => {
    if (regime === 'New') {
      // New regime only allows standard deduction
      return 50000; // Standard deduction
    }
    return total80C + total80D + hraExemption + homeLoanInterestDeduction + totalOtherDeductions + 50000;
  }, [regime, total80C, total80D, hraExemption, homeLoanInterestDeduction, totalOtherDeductions]);

  const taxableIncome = useMemo(() => {
    return Math.max(0, totalIncome - totalDeductions);
  }, [totalIncome, totalDeductions]);

  const estimatedTax = useMemo(() => {
    if (regime === 'New') {
      return calculateNewRegimeTax(taxableIncome);
    }
    return calculateOldRegimeTax(taxableIncome);
  }, [regime, taxableIncome]);

  const taxComparison = useMemo(() => {
    const newRegimeTaxableIncome = totalIncome - 50000;
    const oldRegimeTaxableIncome = totalIncome - totalDeductions;

    return {
      newRegime: {
        taxableIncome: Math.max(0, newRegimeTaxableIncome),
        tax: calculateNewRegimeTax(Math.max(0, newRegimeTaxableIncome))
      },
      oldRegime: {
        taxableIncome: Math.max(0, oldRegimeTaxableIncome),
        tax: calculateOldRegimeTax(Math.max(0, oldRegimeTaxableIncome))
      }
    };
  }, [totalIncome, totalDeductions]);

  const recommendedRegime = useMemo(() => {
    return taxComparison.newRegime.tax <= taxComparison.oldRegime.tax ? 'New' : 'Old';
  }, [taxComparison]);

  const taxSavings = useMemo(() => {
    return Math.abs(taxComparison.newRegime.tax - taxComparison.oldRegime.tax);
  }, [taxComparison]);

  const isLocked = declarationStatus === 'Submitted' || declarationStatus === 'Approved';

  // Tabs Configuration
  const tabs = [
  { id: 'income', label: 'Income Details', icon: DollarSign },
  { id: '80c', label: '80C Investments', icon: TrendingUp },
  { id: '80d', label: '80D Medical', icon: Heart },
  { id: 'hra', label: 'HRA & Housing', icon: Home },
  { id: 'other', label: 'Other Deductions', icon: BookOpen },
  { id: 'summary', label: 'Summary', icon: FileText }];


  // Effects
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  // Load saved declaration on mount and when employee/year changes
  useEffect(() => {
    loadDeclaration();
  }, [selectedEmployeeId, fiscalYear]);

  // Auto-save
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty || isLocked) return;

    const autoSaveTimer = setTimeout(() => {
      handleSaveAsDraft(true);
    }, 30000);

    return () => clearTimeout(autoSaveTimer);
  }, [isDirty, autoSaveEnabled, isLocked]);

  // Mark as dirty when form changes
  useEffect(() => {
    setIsDirty(true);
  }, [incomeDetails, investments80C, medical80D, hraDetails, housingLoan, otherDeductions]);

  // Utility Functions
  const showNotification = (type: Notification['type'], message: string) => {
    setNotification({ show: true, type, message });
  };

  const addToHistory = (action: string, details: string, previousValue?: string, newValue?: string) => {
    const entry: DeclarationHistory = {
      id: generateId(),
      action,
      performedBy: selectedEmployee?.name || 'User',
      timestamp: new Date().toISOString(),
      details,
      previousValue,
      newValue
    };
    setDeclarationHistory((prev) => [entry, ...prev]);
  };

  // Load Declaration
  const loadDeclaration = async () => {
    setIsLoading(true);
    try {
      const storageKey = `declaration_${selectedEmployeeId}_${fiscalYear}`;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        const data = JSON.parse(saved);
        setIncomeDetails(data.incomeDetails || getInitialIncomeDetails());
        setInvestments80C(data.investments80C || getInitial80CInvestments());
        setMedical80D(data.medical80D || getInitialMedical80D());
        setHRADetails(data.hraDetails || getInitialHRADetails());
        setHousingLoan(data.housingLoan || getInitialHousingLoan());
        setOtherDeductions(data.otherDeductions || getInitialOtherDeductions());
        setDeclarationStatus(data.status || 'Draft');
        setDeclarationHistory(data.history || []);
        setDeclarationComments(data.comments || []);
        setRegime(data.regime || selectedEmployee?.regime || 'New');
        if (data.lastSaved) {
          setLastSaved(new Date(data.lastSaved));
        }
      } else {
        resetForm();
      }
      setIsDirty(false);
    } catch (error) {
      showNotification('error', 'Failed to load declaration');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Form
  const resetForm = () => {
    setIncomeDetails(getInitialIncomeDetails());
    setInvestments80C(getInitial80CInvestments());
    setMedical80D(getInitialMedical80D());
    setHRADetails(getInitialHRADetails());
    setHousingLoan(getInitialHousingLoan());
    setOtherDeductions(getInitialOtherDeductions());
    setDeclarationStatus('Draft');
    setDeclarationHistory([]);
    setDeclarationComments([]);
    setValidationErrors([]);
    setRegime(selectedEmployee?.regime || 'New');
    setLastSaved(null);
    setIsDirty(false);
  };

  // Handle Employee Change
  const handleEmployeeChange = (employeeId: string) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Do you want to continue?')) {
        return;
      }
    }
    setSelectedEmployeeId(employeeId);
    const employee = EMPLOYEES.find((e) => e.employeeId === employeeId);
    if (employee) {
      setRegime(employee.regime);
    }
  };

  // Handle Fiscal Year Change
  const handleFiscalYearChange = (year: string) => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Do you want to continue?')) {
        return;
      }
    }
    setFiscalYear(year);
  };

  // Handle Regime Change
  const handleRegimeChange = (newRegime: 'New' | 'Old') => {
    if (isLocked) {
      showNotification('warning', 'Cannot change regime after submission');
      return;
    }
    const prevRegime = regime;
    setRegime(newRegime);
    addToHistory('Regime Changed', `Tax regime changed`, prevRegime, newRegime);
    showNotification('info', `Switched to ${newRegime} Regime`);
  };

  // Income Details Handlers
  const handleIncomeChange = (field: keyof IncomeDetails, value: number) => {
    if (isLocked) return;
    setIncomeDetails((prev) => ({ ...prev, [field]: value }));
  };

  // 80C Investment Handlers
  const handleInvestment80CChange = (id: string, field: keyof Investment80C, value: any) => {
    if (isLocked) return;
    setInvestments80C((prev) =>
    prev.map((inv) => inv.id === id ? { ...inv, [field]: value } : inv)
    );
  };

  const handleAddCustomInvestment = () => {
    if (isLocked) return;
    const newInvestment: Investment80C = {
      id: generateId(),
      name: 'Custom Investment',
      category: 'Other',
      declaredAmount: 0,
      approvedAmount: 0,
      remarks: '',
      proofUploaded: false,
      proofFileName: null,
      status: 'Pending'
    };
    setInvestments80C((prev) => [...prev, newInvestment]);
    showNotification('info', 'Custom investment added');
  };

  const handleRemoveInvestment = (id: string) => {
    if (isLocked) return;
    const investment = investments80C.find((inv) => inv.id === id);
    if (investment && INVESTMENT_80C_CATEGORIES.some((cat) => cat.id === id)) {
      showNotification('warning', 'Cannot remove standard investment categories');
      return;
    }
    setInvestments80C((prev) => prev.filter((inv) => inv.id !== id));
    showNotification('info', 'Investment removed');
  };

  // 80D Medical Handlers
  const handleMedical80DChange = (field: keyof Medical80D, value: any) => {
    if (isLocked) return;
    setMedical80D((prev) => ({ ...prev, [field]: value }));
  };

  // HRA Details Handlers
  const handleHRAChange = (field: keyof HRADetails, value: any) => {
    if (isLocked) return;
    setHRADetails((prev) => ({ ...prev, [field]: value }));
  };

  // Housing Loan Handlers
  const handleHousingLoanChange = (field: keyof HousingLoan, value: any) => {
    if (isLocked) return;
    setHousingLoan((prev) => ({ ...prev, [field]: value }));
  };

  // Other Deductions Handlers
  const handleOtherDeductionsChange = (field: keyof OtherDeductions, value: number) => {
    if (isLocked) return;
    setOtherDeductions((prev) => ({ ...prev, [field]: value }));
  };

  // Validation
  const validateDeclaration = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Income validation
    if (totalIncome <= 0) {
      errors.push({
        field: 'totalIncome',
        message: 'Total income must be greater than zero',
        section: 'income'
      });
    }

    // HRA validation
    if (hraDetails.annualRentPaid > 0) {
      if (!hraDetails.landlordName.trim()) {
        errors.push({
          field: 'landlordName',
          message: 'Landlord name is required when claiming HRA',
          section: 'hra'
        });
      }
      if (hraDetails.annualRentPaid > 100000 && !hraDetails.landlordPAN.trim()) {
        errors.push({
          field: 'landlordPAN',
          message: 'Landlord PAN is mandatory for rent above ₹1,00,000',
          section: 'hra'
        });
      }
      if (hraDetails.landlordPAN && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(hraDetails.landlordPAN)) {
        errors.push({
          field: 'landlordPAN',
          message: 'Invalid PAN format',
          section: 'hra'
        });
      }
    }

    // Housing loan validation
    if (housingLoan.interestOnHomeLoan > 0 || housingLoan.principalRepayment > 0) {
      if (!housingLoan.lenderName.trim()) {
        errors.push({
          field: 'lenderName',
          message: 'Lender name is required for home loan deduction',
          section: 'hra'
        });
      }
    }

    // 80C limit warning
    if (total80CRaw > LIMITS.section80C) {
      errors.push({
        field: '80c',
        message: `Total 80C exceeds limit by ${formatCurrency(total80CRaw - LIMITS.section80C)}. Only ${formatCurrency(LIMITS.section80C)} will be considered.`,
        section: '80c'
      });
    }

    return errors;
  };

  // Save as Draft
  const handleSaveAsDraft = async (isAutoSave: boolean = false) => {
    if (isLocked) {
      showNotification('warning', 'Cannot modify submitted declaration');
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storageKey = `declaration_${selectedEmployeeId}_${fiscalYear}`;
      const data = {
        incomeDetails,
        investments80C,
        medical80D,
        hraDetails,
        housingLoan,
        otherDeductions,
        status: 'Draft',
        regime,
        history: declarationHistory,
        comments: declarationComments,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(data));

      setLastSaved(new Date());
      setIsDirty(false);
      setDeclarationStatus('Draft');

      if (!isAutoSave) {
        addToHistory('Draft Saved', 'Declaration saved as draft');
        showNotification('success', 'Declaration saved as draft');
      }
    } catch (error) {
      showNotification('error', 'Failed to save declaration');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Declaration
  const handleSubmitDeclaration = async () => {
    const errors = validateDeclaration();
    setValidationErrors(errors);

    if (errors.some((e) => !e.message.includes('exceeds limit'))) {
      showNotification('error', 'Please fix validation errors before submitting');
      const firstError = errors.find((e) => !e.message.includes('exceeds limit'));
      if (firstError) {
        setActiveTab(firstError.section);
      }
      return;
    }

    if (!showConfirmSubmit) {
      setShowConfirmSubmit(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storageKey = `declaration_${selectedEmployeeId}_${fiscalYear}`;
      const data = {
        incomeDetails,
        investments80C,
        medical80D,
        hraDetails,
        housingLoan,
        otherDeductions,
        status: 'Submitted',
        regime,
        history: [
        {
          id: generateId(),
          action: 'Declaration Submitted',
          performedBy: selectedEmployee?.name || 'User',
          timestamp: new Date().toISOString(),
          details: `Total deductions: ${formatCurrency(totalDeductions)}, Estimated tax: ${formatCurrency(estimatedTax)}`
        },
        ...declarationHistory],

        comments: declarationComments,
        lastSaved: new Date().toISOString(),
        submittedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(data));

      setDeclarationStatus('Submitted');
      setShowConfirmSubmit(false);
      setIsDirty(false);
      showNotification('success', 'Declaration submitted successfully');
    } catch (error) {
      showNotification('error', 'Failed to submit declaration');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Submit
  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false);
  };

  // Withdraw Declaration
  const handleWithdrawDeclaration = async () => {
    if (declarationStatus !== 'Submitted') {
      showNotification('warning', 'Only submitted declarations can be withdrawn');
      return;
    }

    if (!window.confirm('Are you sure you want to withdraw this declaration? You will need to resubmit.')) {
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const storageKey = `declaration_${selectedEmployeeId}_${fiscalYear}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved);
        data.status = 'Draft';
        data.history = [
        {
          id: generateId(),
          action: 'Declaration Withdrawn',
          performedBy: selectedEmployee?.name || 'User',
          timestamp: new Date().toISOString(),
          details: 'Declaration withdrawn for modification'
        },
        ...data.history];

        localStorage.setItem(storageKey, JSON.stringify(data));
      }

      setDeclarationStatus('Draft');
      addToHistory('Declaration Withdrawn', 'Declaration withdrawn for modification');
      showNotification('info', 'Declaration withdrawn. You can now make changes.');
    } catch (error) {
      showNotification('error', 'Failed to withdraw declaration');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear All Data
  const handleClearAll = () => {
    if (isLocked) {
      showNotification('warning', 'Cannot clear submitted declaration');
      return;
    }

    if (!window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return;
    }

    resetForm();
    addToHistory('Form Cleared', 'All declaration data cleared');
    showNotification('info', 'All data cleared');
  };

  // Proof Upload Handlers
  const handleOpenProofUpload = (investmentId: string) => {
    setSelectedInvestmentForProof(investmentId);
    setShowProofUpload(true);
  };

  const handleCloseProofUpload = () => {
    setShowProofUpload(false);
    setSelectedInvestmentForProof(null);
  };

  const handleUploadProof = async (file: File) => {
    if (!selectedInvestmentForProof) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInvestments80C((prev) =>
      prev.map((inv) =>
      inv.id === selectedInvestmentForProof ?
      { ...inv, proofUploaded: true, proofFileName: file.name } :
      inv
      )
      );

      addToHistory('Proof Uploaded', `Proof uploaded for investment`, undefined, file.name);
      handleCloseProofUpload();
      showNotification('success', 'Proof uploaded successfully');
    } catch (error) {
      showNotification('error', 'Failed to upload proof');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProof = (investmentId: string) => {
    if (isLocked) return;

    setInvestments80C((prev) =>
    prev.map((inv) =>
    inv.id === investmentId ?
    { ...inv, proofUploaded: false, proofFileName: null } :
    inv
    )
    );
    addToHistory('Proof Removed', 'Proof removed from investment');
    showNotification('info', 'Proof removed');
  };

  // Print Declaration
  const handlePrintDeclaration = () => {
    window.print();
  };

  // Export Declaration
  const handleExportDeclaration = () => {
    const exportData = {
      employee: selectedEmployee,
      fiscalYear,
      regime,
      incomeDetails,
      investments80C,
      medical80D,
      hraDetails,
      housingLoan,
      otherDeductions,
      summary: {
        totalIncome,
        totalDeductions,
        taxableIncome,
        estimatedTax
      },
      status: declarationStatus,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `declaration_${selectedEmployeeId}_${fiscalYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('success', 'Declaration exported');
  };

  // Copy Summary
  const handleCopySummary = async () => {
    const summary = `
Investment Declaration Summary
Employee: ${selectedEmployee?.name} (${selectedEmployee?.employeeId})
Fiscal Year: ${fiscalYear}
Regime: ${regime}

Income Details:
- Total Income: ${formatCurrency(totalIncome)}

Deductions:
- 80C Investments: ${formatCurrency(total80C)}
- 80D Medical: ${formatCurrency(total80D)}
- HRA Exemption: ${formatCurrency(hraExemption)}
- Home Loan Interest: ${formatCurrency(homeLoanInterestDeduction)}
- Other Deductions: ${formatCurrency(totalOtherDeductions)}
- Total Deductions: ${formatCurrency(totalDeductions)}

Tax Calculation:
- Taxable Income: ${formatCurrency(taxableIncome)}
- Estimated Tax: ${formatCurrency(estimatedTax)}
    `.trim();

    try {
      await navigator.clipboard.writeText(summary);
      showNotification('success', 'Summary copied to clipboard');
    } catch (error) {
      showNotification('error', 'Failed to copy');
    }
  };

  // Navigate Tabs
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePreviousTab = () => {
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  // Get section errors
  const getSectionErrors = (section: string): ValidationError[] => {
    return validationErrors.filter((e) => e.section === section);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Notification */}
      {notification.show &&
      <div
        className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
        notification.type === 'success' ?
        'bg-green-50 border border-green-200' :
        notification.type === 'error' ?
        'bg-red-50 border border-red-200' :
        notification.type === 'warning' ?
        'bg-yellow-50 border border-yellow-200' :
        'bg-blue-50 border border-blue-200'}`
        }>

          {notification.type === 'success' ?
        <CheckCircle className="w-5 h-5 text-green-600" /> :
        notification.type === 'error' ?
        <AlertCircle className="w-5 h-5 text-red-600" /> :
        notification.type === 'warning' ?
        <AlertCircle className="w-5 h-5 text-yellow-600" /> :

        <Info className="w-5 h-5 text-blue-600" />
        }
          <span
          className={
          notification.type === 'success' ?
          'text-green-800' :
          notification.type === 'error' ?
          'text-red-800' :
          notification.type === 'warning' ?
          'text-yellow-800' :
          'text-blue-800'
          }>

            {notification.message}
          </span>
          <button
          onClick={() => setNotification((prev) => ({ ...prev, show: false }))}
          className="ml-2 text-gray-500 hover:text-gray-700">

            <X className="w-4 h-4" />
          </button>
        </div>
      }

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Employee Income & Investment Declaration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR &gt; Payroll &gt; Income Tax &gt; Declaration
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved &&
          <span className="text-xs text-gray-500">
              Last saved: {formatDateTime(lastSaved.toISOString())}
            </span>
          }
          {isDirty &&
          <span className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Unsaved changes
            </span>
          }
          <Select
            options={FISCAL_YEARS}
            value={fiscalYear}
            onChange={handleFiscalYearChange} />

          <Select
            options={EMPLOYEES.map((e) => ({
              value: e.employeeId,
              label: `${e.name} (${e.employeeId})`
            }))}
            value={selectedEmployeeId}
            onChange={handleEmployeeChange} />

          {isLocked ?
          <Button variant="outline" onClick={handleWithdrawDeclaration}>
              <Unlock className="w-4 h-4 mr-2" />
              Withdraw
            </Button> :

          <>
              <Button variant="outline" onClick={() => handleSaveAsDraft(false)} disabled={isSaving}>
                {isSaving ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Save className="w-4 h-4 mr-2" />
              }
                Save Draft
              </Button>
              <Button variant="primary" onClick={handleSubmitDeclaration} disabled={isSubmitting}>
                {isSubmitting ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <Send className="w-4 h-4 mr-2" />
              }
                Submit Declaration
              </Button>
            </>
          }
        </div>
      </div>

      {/* Loading State */}
      {isLoading &&
      <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      }

      {!isLoading &&
      <>
          {/* Employee Info Card */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedEmployee?.initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedEmployee?.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee?.employeeId} • {selectedEmployee?.department} •{' '}
                    {selectedEmployee?.designation}
                  </p>
                  <p className="text-xs text-gray-500">PAN: {selectedEmployee?.pan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                  onClick={() => handleRegimeChange('New')}
                  disabled={isLocked}
                  className={`px-3 py-1.5 rounded-l-lg text-sm font-medium transition-colors ${
                  regime === 'New' ?
                  'bg-blue-600 text-white' :
                  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>

                    New Regime
                  </button>
                  <button
                  onClick={() => handleRegimeChange('Old')}
                  disabled={isLocked}
                  className={`px-3 py-1.5 rounded-r-lg text-sm font-medium transition-colors ${
                  regime === 'Old' ?
                  'bg-purple-600 text-white' :
                  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'} ${
                  isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>

                    Old Regime
                  </button>
                </div>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRegimeComparison(true)}>

                  <Calculator className="w-4 h-4 mr-1" />
                  Compare
                </Button>
                <Badge
                className={
                declarationStatus === 'Draft' ?
                'bg-gray-100 text-gray-700' :
                declarationStatus === 'Submitted' ?
                'bg-blue-100 text-blue-700' :
                declarationStatus === 'Approved' ?
                'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
                }>

                  {isLocked && <Lock className="w-3 h-3 mr-1" />}
                  {declarationStatus}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Validation Errors */}
          {validationErrors.length > 0 &&
        <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">
                    Please fix the following issues:
                  </p>
                  <ul className="mt-2 space-y-1">
                    {validationErrors.map((error, index) =>
                <li key={index} className="text-sm text-red-700">
                        • {error.message}
                        <button
                    onClick={() => setActiveTab(error.section)}
                    className="ml-2 text-red-600 underline">

                          Go to {tabs.find((t) => t.id === error.section)?.label}
                        </button>
                      </li>
                )}
                  </ul>
                </div>
                <button
              onClick={() => setValidationErrors([])}
              className="text-red-600 hover:text-red-800">

                  <X className="w-4 h-4" />
                </button>
              </div>
            </Card>
        }

          {/* Submit Confirmation */}
          {showConfirmSubmit &&
        <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-800">Confirm Submission</p>
                  <p className="text-sm text-blue-700 mt-1">
                    You are about to submit your investment declaration for {fiscalYear}. After
                    submission, you cannot make changes without withdrawing first.
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-gray-600">Total Income:</span>
                      <span className="font-medium">{formatCurrency(totalIncome)}</span>
                      <span className="text-gray-600">Total Deductions:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(totalDeductions)}
                      </span>
                      <span className="text-gray-600">Taxable Income:</span>
                      <span className="font-medium">{formatCurrency(taxableIncome)}</span>
                      <span className="text-gray-600">Estimated Tax:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(estimatedTax)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button
                  variant="primary"
                  onClick={handleSubmitDeclaration}
                  disabled={isSubmitting}>

                      {isSubmitting ?
                  <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </> :

                  <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Submit
                        </>
                  }
                    </Button>
                    <Button variant="outline" onClick={handleCancelSubmit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
        }

          {/* Tabs */}
          <Card>
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                const sectionErrors = getSectionErrors(tab.id);
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ?
                    'border-blue-600 text-blue-600' :
                    'border-transparent text-gray-600 hover:text-gray-900'}`
                    }>

                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                      {sectionErrors.length > 0 &&
                    <span className="bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                          {sectionErrors.length}
                        </span>
                    }
                    </button>);

              })}
              </div>
            </div>

            <div className="p-6">
              {/* Income Details Tab */}
              {activeTab === 'income' &&
            <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Income Details</h3>
                    {isLocked &&
                <Badge className="bg-yellow-100 text-yellow-700">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                }
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Basic Salary (Annual)
                      </label>
                      <Input
                    value={formatCurrency(incomeDetails.basicSalary)}
                    disabled
                    className="bg-gray-50" />

                      <p className="text-xs text-gray-500 mt-1">Auto-calculated from payroll</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        HRA (Annual)
                      </label>
                      <Input
                    value={formatCurrency(incomeDetails.hra)}
                    disabled
                    className="bg-gray-50" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Allowances
                      </label>
                      <Input
                    value={formatCurrency(incomeDetails.otherAllowances)}
                    disabled
                    className="bg-gray-50" />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Previous Employer Income
                      </label>
                      <Input
                    type="number"
                    placeholder="Enter amount"
                    value={incomeDetails.previousEmployerIncome || ''}
                    onChange={(e) =>
                    handleIncomeChange(
                      'previousEmployerIncome',
                      parseInt(e.target.value) || 0
                    )
                    }
                    disabled={isLocked} />

                      <p className="text-xs text-gray-500 mt-1">
                        If you joined mid-year, enter previous employer's income
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interest Income
                      </label>
                      <Input
                    type="number"
                    placeholder="Enter amount"
                    value={incomeDetails.interestIncome || ''}
                    onChange={(e) =>
                    handleIncomeChange('interestIncome', parseInt(e.target.value) || 0)
                    }
                    disabled={isLocked} />

                      <p className="text-xs text-gray-500 mt-1">
                        Interest from savings, FD, etc.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rental Income
                      </label>
                      <Input
                    type="number"
                    placeholder="Enter amount"
                    value={incomeDetails.rentalIncome || ''}
                    onChange={(e) =>
                    handleIncomeChange('rentalIncome', parseInt(e.target.value) || 0)
                    }
                    disabled={isLocked} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Other Income
                      </label>
                      <Input
                    type="number"
                    placeholder="Enter amount"
                    value={incomeDetails.otherIncome || ''}
                    onChange={(e) =>
                    handleIncomeChange('otherIncome', parseInt(e.target.value) || 0)
                    }
                    disabled={isLocked} />

                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capital Gains
                      </label>
                      <Input
                    type="number"
                    placeholder="Enter amount"
                    value={incomeDetails.capitalGains || ''}
                    onChange={(e) =>
                    handleIncomeChange('capitalGains', parseInt(e.target.value) || 0)
                    }
                    disabled={isLocked} />

                    </div>
                  </div>

                  <Card className="p-4 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Annual Income</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatCurrency(totalIncome)}
                      </span>
                    </div>
                  </Card>
                </div>
            }

              {/* 80C Tab */}
              {activeTab === '80c' &&
            <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">80C Investments</h3>
                    <div className="flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Limit: </span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(LIMITS.section80C)}
                        </span>
                      </div>
                      {!isLocked &&
                  <Button variant="outline" size="sm" onClick={handleAddCustomInvestment}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Custom
                        </Button>
                  }
                    </div>
                  </div>

                  <div className="space-y-4">
                    {investments80C.map((investment) =>
                <div
                  key={investment.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">

                        <div className="md:col-span-1 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">{investment.name}</span>
                            <p className="text-xs text-gray-500">{investment.category}</p>
                          </div>
                          {!INVESTMENT_80C_CATEGORIES.some((cat) => cat.id === investment.id) &&
                    <button
                      onClick={() => handleRemoveInvestment(investment.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isLocked}>

                              <Trash2 className="w-4 h-4" />
                            </button>
                    }
                        </div>
                        <div>
                          <Input
                      type="number"
                      placeholder="Declared amount"
                      value={investment.declaredAmount || ''}
                      onChange={(e) =>
                      handleInvestment80CChange(
                        investment.id,
                        'declaredAmount',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        </div>
                        <div>
                          <Input
                      placeholder="Remarks (optional)"
                      value={investment.remarks}
                      onChange={(e) =>
                      handleInvestment80CChange(investment.id, 'remarks', e.target.value)
                      }
                      disabled={isLocked} />

                        </div>
                        <div className="flex items-center gap-2">
                          {investment.proofUploaded ?
                    <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700">
                                <FileText className="w-3 h-3 mr-1" />
                                {investment.proofFileName?.substring(0, 15)}...
                              </Badge>
                              {!isLocked &&
                      <button
                        onClick={() => handleRemoveProof(investment.id)}
                        className="text-red-500 hover:text-red-700">

                                  <X className="w-4 h-4" />
                                </button>
                      }
                            </div> :

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenProofUpload(investment.id)}
                      disabled={isLocked || investment.declaredAmount === 0}>

                              <Upload className="w-4 h-4 mr-1" />
                              Upload Proof
                            </Button>
                    }
                        </div>
                      </div>
                )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Total 80C Declared</span>
                      <span
                    className={`text-xl font-bold ${
                    total80CRaw > LIMITS.section80C ? 'text-amber-600' : 'text-blue-600'}`
                    }>

                        {formatCurrency(total80CRaw)}
                        {total80CRaw > LIMITS.section80C &&
                    <span className="text-sm ml-2">
                            (Eligible: {formatCurrency(total80C)})
                          </span>
                    }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                    className={`h-2 rounded-full ${
                    total80CRaw > LIMITS.section80C ? 'bg-amber-500' : 'bg-blue-600'}`
                    }
                    style={{
                      width: `${Math.min(total80CRaw / LIMITS.section80C * 100, 100)}%`
                    }}>
                  </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {(total80C / LIMITS.section80C * 100).toFixed(1)}% of{' '}
                      {formatCurrency(LIMITS.section80C)} limit utilized
                    </p>
                  </div>
                </div>
            }

              {/* 80D Tab */}
              {activeTab === '80d' &&
            <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">80D Medical Insurance</h3>

                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Self & Family</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Health Insurance Premium
                          </label>
                          <Input
                        type="number"
                        placeholder="Enter amount"
                        value={medical80D.selfHealthInsurance || ''}
                        onChange={(e) =>
                        handleMedical80DChange(
                          'selfHealthInsurance',
                          parseInt(e.target.value) || 0
                        )
                        }
                        disabled={isLocked} />

                          <p className="text-xs text-gray-500 mt-1">
                            Limit: {formatCurrency(LIMITS.section80D_self)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preventive Health Checkup
                          </label>
                          <Input
                        type="number"
                        placeholder="Enter amount"
                        value={medical80D.selfPreventiveCheckup || ''}
                        onChange={(e) =>
                        handleMedical80DChange(
                          'selfPreventiveCheckup',
                          parseInt(e.target.value) || 0
                        )
                        }
                        disabled={isLocked} />

                          <p className="text-xs text-gray-500 mt-1">
                            Limit: {formatCurrency(LIMITS.section80D_preventive)} (within overall
                            limit)
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Parents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Health Insurance Premium
                          </label>
                          <Input
                        type="number"
                        placeholder="Enter amount"
                        value={medical80D.parentsHealthInsurance || ''}
                        onChange={(e) =>
                        handleMedical80DChange(
                          'parentsHealthInsurance',
                          parseInt(e.target.value) || 0
                        )
                        }
                        disabled={isLocked} />

                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preventive Health Checkup
                          </label>
                          <Input
                        type="number"
                        placeholder="Enter amount"
                        value={medical80D.parentsPreventiveCheckup || ''}
                        onChange={(e) =>
                        handleMedical80DChange(
                          'parentsPreventiveCheckup',
                          parseInt(e.target.value) || 0
                        )
                        }
                        disabled={isLocked} />

                        </div>
                        <div className="md:col-span-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                          type="checkbox"
                          className="rounded"
                          checked={medical80D.parentsAreSenior}
                          onChange={(e) =>
                          handleMedical80DChange('parentsAreSenior', e.target.checked)
                          }
                          disabled={isLocked} />

                            Parents are Senior Citizens (60+ years)
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Limit:{' '}
                            {medical80D.parentsAreSenior ?
                        formatCurrency(LIMITS.section80D_parents_senior) :
                        formatCurrency(LIMITS.section80D_parents)}{' '}
                            for parents
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total 80D Deduction</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(total80D)}
                      </span>
                    </div>
                  </Card>
                </div>
            }

              {/* HRA Tab */}
              {activeTab === 'hra' &&
            <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">HRA & Housing Loan</h3>

                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">House Rent Allowance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annual Rent Paid
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={hraDetails.annualRentPaid || ''}
                      onChange={(e) =>
                      handleHRAChange('annualRentPaid', parseInt(e.target.value) || 0)
                      }
                      disabled={isLocked} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landlord Name *
                        </label>
                        <Input
                      placeholder="Enter name"
                      value={hraDetails.landlordName}
                      onChange={(e) => handleHRAChange('landlordName', e.target.value)}
                      disabled={isLocked} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landlord PAN {hraDetails.annualRentPaid > 100000 && '*'}
                        </label>
                        <Input
                      placeholder="ABCDE1234F"
                      value={hraDetails.landlordPAN}
                      onChange={(e) =>
                      handleHRAChange('landlordPAN', e.target.value.toUpperCase())
                      }
                      disabled={isLocked}
                      maxLength={10} />

                        {hraDetails.annualRentPaid > 100000 &&
                    <p className="text-xs text-amber-600 mt-1">
                            PAN mandatory for rent above ₹1,00,000
                          </p>
                    }
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landlord Address
                        </label>
                        <Input
                      placeholder="Enter address"
                      value={hraDetails.landlordAddress}
                      onChange={(e) => handleHRAChange('landlordAddress', e.target.value)}
                      disabled={isLocked} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City Type
                        </label>
                        <Select
                      options={CITY_TYPE_OPTIONS}
                      value={hraDetails.cityType}
                      onChange={(value) => handleHRAChange('cityType', value)}
                      disabled={isLocked} />

                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                        type="checkbox"
                        className="rounded"
                        checked={hraDetails.rentReceipts}
                        onChange={(e) => handleHRAChange('rentReceipts', e.target.checked)}
                        disabled={isLocked} />

                          I have rent receipts for the period
                        </label>
                      </div>
                    </div>
                    {hraDetails.annualRentPaid > 0 &&
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Estimated HRA Exemption:</strong>{' '}
                          {formatCurrency(hraExemption)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Calculated as minimum of: Actual HRA, 50%/40% of Basic, Rent paid - 10%
                          Basic
                        </p>
                      </div>
                }
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">House Property Loan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interest on Home Loan (Section 24)
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={housingLoan.interestOnHomeLoan || ''}
                      onChange={(e) =>
                      handleHousingLoanChange(
                        'interestOnHomeLoan',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">
                          Limit: {formatCurrency(LIMITS.homeLoanInterest)} for self-occupied
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Principal Repayment (80C)
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={housingLoan.principalRepayment || ''}
                      onChange={(e) =>
                      handleHousingLoanChange(
                        'principalRepayment',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">Included in 80C limit</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lender Name
                        </label>
                        <Input
                      placeholder="Bank/Institution name"
                      value={housingLoan.lenderName}
                      onChange={(e) => handleHousingLoanChange('lenderName', e.target.value)}
                      disabled={isLocked} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lender PAN
                        </label>
                        <Input
                      placeholder="PAN of lender"
                      value={housingLoan.lenderPAN}
                      onChange={(e) =>
                      handleHousingLoanChange('lenderPAN', e.target.value.toUpperCase())
                      }
                      disabled={isLocked}
                      maxLength={10} />

                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                        type="checkbox"
                        className="rounded"
                        checked={housingLoan.isSelfOccupied}
                        onChange={(e) =>
                        handleHousingLoanChange('isSelfOccupied', e.target.checked)
                        }
                        disabled={isLocked} />

                          Property is self-occupied
                        </label>
                      </div>
                    </div>
                  </Card>
                </div>
            }

              {/* Other Deductions Tab */}
              {activeTab === 'other' &&
            <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Other Deductions</h3>

                  <Card className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80E - Education Loan Interest
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.section80E || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange('section80E', parseInt(e.target.value) || 0)
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">No limit</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80G - Donations
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.section80G || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange('section80G', parseInt(e.target.value) || 0)
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">50% or 100% deduction</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80TTA - Savings Interest
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.section80TTA || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange(
                        'section80TTA',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">
                          Limit: {formatCurrency(LIMITS.section80TTA)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80CCD(1B) - NPS Additional
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.nps80CCD1B || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange(
                        'nps80CCD1B',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">
                          Limit: {formatCurrency(LIMITS.nps80CCD1B)} (over and above 80C)
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80CCD(2) - Employer NPS Contribution
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.nps80CCD2 || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange(
                        'nps80CCD2',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">10% of salary limit</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80GG - Rent Paid (No HRA)
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.section80GG || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange(
                        'section80GG',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                        <p className="text-xs text-gray-500 mt-1">
                          Only if not receiving HRA
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          80U - Disability
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.section80U || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange('section80U', parseInt(e.target.value) || 0)
                      }
                      disabled={isLocked} />

                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Other Sections
                        </label>
                        <Input
                      type="number"
                      placeholder="Enter amount"
                      value={otherDeductions.otherSections || ''}
                      onChange={(e) =>
                      handleOtherDeductionsChange(
                        'otherSections',
                        parseInt(e.target.value) || 0
                      )
                      }
                      disabled={isLocked} />

                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Total Other Deductions</span>
                      <span className="text-xl font-bold text-blue-600">
                        {formatCurrency(totalOtherDeductions)}
                      </span>
                    </div>
                  </Card>
                </div>
            }

              {/* Summary Tab */}
              {activeTab === 'summary' &&
            <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Declaration Summary</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopySummary}>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePrintDeclaration}>
                        <Printer className="w-4 h-4 mr-1" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleExportDeclaration}>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(true)}>

                        <History className="w-4 h-4 mr-1" />
                        History
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Income Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Basic Salary:</span>
                          <span className="font-medium">
                            {formatCurrency(incomeDetails.basicSalary)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">HRA:</span>
                          <span className="font-medium">{formatCurrency(incomeDetails.hra)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Allowances:</span>
                          <span className="font-medium">
                            {formatCurrency(incomeDetails.otherAllowances)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Income:</span>
                          <span className="font-medium">
                            {formatCurrency(
                          incomeDetails.previousEmployerIncome +
                          incomeDetails.otherIncome +
                          incomeDetails.interestIncome +
                          incomeDetails.rentalIncome +
                          incomeDetails.capitalGains
                        )}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Income:</span>
                          <span className="text-blue-600">{formatCurrency(totalIncome)}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Deduction Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Standard Deduction:</span>
                          <span className="font-medium">{formatCurrency(50000)}</span>
                        </div>
                        {regime === 'Old' &&
                    <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">80C Investments:</span>
                              <span className="font-medium">{formatCurrency(total80C)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">80D Medical:</span>
                              <span className="font-medium">{formatCurrency(total80D)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">HRA Exemption:</span>
                              <span className="font-medium">{formatCurrency(hraExemption)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Home Loan Interest:</span>
                              <span className="font-medium">
                                {formatCurrency(homeLoanInterestDeduction)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Other Deductions:</span>
                              <span className="font-medium">
                                {formatCurrency(totalOtherDeductions)}
                              </span>
                            </div>
                          </>
                    }
                        <div className="flex justify-between pt-2 border-t font-semibold">
                          <span>Total Deductions:</span>
                          <span className="text-green-600">{formatCurrency(totalDeductions)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-green-800">Taxable Income</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                              {formatCurrency(taxableIncome)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-800">Estimated Tax</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">
                              {formatCurrency(estimatedTax)}
                            </p>
                            <p className="text-sm text-green-600">
                              Under {regime} Regime (incl. 4% cess)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Regime Comparison Quick View */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-800">Tax Savings Opportunity</p>
                        <p className="text-sm text-blue-600 mt-1">
                          Switch to {recommendedRegime} Regime to save{' '}
                          <strong>{formatCurrency(taxSavings)}</strong>
                        </p>
                      </div>
                      <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRegimeComparison(true)}>

                        <Calculator className="w-4 h-4 mr-1" />
                        Compare Regimes
                      </Button>
                    </div>
                  </Card>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-800">Important Notes</p>
                        <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                          <li>• Ensure all investment proofs are submitted by 31st March</li>
                          <li>• Declarations are subject to verification by HR</li>
                          <li>• Changes after submission require withdrawal and resubmission</li>
                          <li>
                            • Tax calculation is indicative and may vary based on actual tax
                            computation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleClearAll} disabled={isLocked}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <div className="flex gap-3">
                      <Button
                    variant="outline"
                    onClick={() => handleSaveAsDraft(false)}
                    disabled={isLocked || isSaving}>

                        {isSaving ?
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                    <Save className="w-4 h-4 mr-2" />
                    }
                        Save as Draft
                      </Button>
                      {isLocked ?
                  <Button variant="primary" onClick={handleWithdrawDeclaration}>
                          <Unlock className="w-4 h-4 mr-2" />
                          Withdraw to Edit
                        </Button> :

                  <Button
                    variant="primary"
                    onClick={handleSubmitDeclaration}
                    disabled={isSubmitting}>

                          {isSubmitting ?
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                    <Send className="w-4 h-4 mr-2" />
                    }
                          Submit Declaration
                        </Button>
                  }
                    </div>
                  </div>
                </div>
            }
            </div>

            {/* Tab Navigation */}
            <div className="px-6 pb-4 flex justify-between border-t pt-4">
              <Button
              variant="outline"
              onClick={handlePreviousTab}
              disabled={activeTab === tabs[0].id}>

                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
              variant="outline"
              onClick={handleNextTab}
              disabled={activeTab === tabs[tabs.length - 1].id}>

                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </Card>
        </>
      }

      {/* Regime Comparison Modal */}
      {showRegimeComparison &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Tax Regime Comparison</h2>
                <button
                onClick={() => setShowRegimeComparison(false)}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card
                className={`p-4 ${
                regime === 'New' ? 'border-2 border-blue-500 bg-blue-50' : ''}`
                }>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">New Regime</h3>
                    {recommendedRegime === 'New' &&
                  <Badge className="bg-green-100 text-green-700">Recommended</Badge>
                  }
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Income:</span>
                      <span>{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span>{formatCurrency(50000)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Taxable Income:</span>
                      <span>{formatCurrency(taxComparison.newRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Tax Payable:</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(taxComparison.newRegime.tax)}
                      </span>
                    </div>
                  </div>
                  {!isLocked && regime !== 'New' &&
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    handleRegimeChange('New');
                    setShowRegimeComparison(false);
                  }}>

                      Select New Regime
                    </Button>
                }
                </Card>

                <Card
                className={`p-4 ${
                regime === 'Old' ? 'border-2 border-purple-500 bg-purple-50' : ''}`
                }>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Old Regime</h3>
                    {recommendedRegime === 'Old' &&
                  <Badge className="bg-green-100 text-green-700">Recommended</Badge>
                  }
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Income:</span>
                      <span>{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deductions:</span>
                      <span>{formatCurrency(totalDeductions)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Taxable Income:</span>
                      <span>{formatCurrency(taxComparison.oldRegime.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Tax Payable:</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(taxComparison.oldRegime.tax)}
                      </span>
                    </div>
                  </div>
                  {!isLocked && regime !== 'Old' &&
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    handleRegimeChange('Old');
                    setShowRegimeComparison(false);
                  }}>

                      Select Old Regime
                    </Button>
                }
                </Card>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-center text-green-800 font-medium">
                  By choosing {recommendedRegime} Regime, you can save{' '}
                  <strong>{formatCurrency(taxSavings)}</strong> in taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      }

      {/* History Modal */}
      {showHistory &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Declaration History</h2>
                <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {declarationHistory.length === 0 ?
            <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No history available</p>
                </div> :

            <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  {declarationHistory.map((entry) =>
              <div key={entry.id} className="relative pl-10 pb-6">
                      <div className="absolute left-2.5 w-3 h-3 bg-blue-600 rounded-full"></div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(entry.timestamp)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                        <p className="text-xs text-gray-400 mt-1">By: {entry.performedBy}</p>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>

            <div className="p-4 border-t">
              <Button variant="outline" onClick={() => setShowHistory(false)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Proof Upload Modal */}
      {showProofUpload &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Upload Proof</h2>
                <button
                onClick={handleCloseProofUpload}
                className="text-gray-500 hover:text-gray-700">

                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Browse Files
                  </span>
                  <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUploadProof(file);
                    }
                  }} />

                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={handleCloseProofUpload}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}