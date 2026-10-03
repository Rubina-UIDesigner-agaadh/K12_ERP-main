import React, { useState, useMemo, useCallback } from 'react';
import {
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  X,
  Save,
  RefreshCw,
  Download,
  Printer,
  FileText,
  Check,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  User,
  IndianRupee,
  Calendar,
  Building2,
  Loader2,
  CheckCircle2,
  XCircle,
  Pause,
  RotateCcw,
  Send,
  Lock,
  Unlock,
  Edit,
  Trash2,
  Filter,
  Search,
  MoreVertical } from
'lucide-react';

// ==================== TYPES ====================

interface Employee {
  id: string;
  empCode: string;
  empName: string;
  department: string;
  designation: string;
  basicSalary: number;
  gross: number;
  deduction: number;
  net: number;
  status: 'Pending' | 'Calculated' | 'Error' | 'Approved' | 'Locked';
  errorMessage?: string;
  earnings: EarningComponent[];
  deductions: DeductionComponent[];
  workingDays: number;
  presentDays: number;
  lop: number;
  lopAmount: number;
}

interface EarningComponent {
  name: string;
  amount: number;
}

interface DeductionComponent {
  name: string;
  amount: number;
}

interface PayrollRun {
  id: string;
  month: string;
  year: string;
  payrollType: 'regular' | 'supplementary' | 'arrear';
  status: 'draft' | 'processing' | 'verification' | 'review' | 'approval' | 'completed' | 'cancelled';
  currentStep: number;
  totalEmployees: number;
  processedCount: number;
  errorCount: number;
  totalGross: number;
  totalDeduction: number;
  totalNet: number;
  createdAt: string;
  updatedAt: string;
  processedBy?: string;
  approvedBy?: string;
}

interface ProcessingLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

type StepStatus = 'completed' | 'active' | 'pending' | 'error';

interface Step {
  id: number;
  label: string;
  status: StepStatus;
  description: string;
}

// ==================== CONSTANTS ====================

const MONTHS = [
'January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];


const YEARS = ['2024', '2025', '2026'];

const DEPARTMENTS = [
{ value: '', label: 'All Departments' },
{ value: 'teaching', label: 'Teaching' },
{ value: 'admin', label: 'Administration' },
{ value: 'it', label: 'IT Department' },
{ value: 'finance', label: 'Finance' },
{ value: 'support', label: 'Support Staff' }];


const PAYROLL_TYPES = [
{ value: 'regular', label: 'Regular' },
{ value: 'supplementary', label: 'Supplementary' },
{ value: 'arrear', label: 'Arrear' }];


// ==================== INITIAL DATA ====================

const INITIAL_EMPLOYEES: Employee[] = [
{
  id: '1',
  empCode: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'teaching',
  designation: 'Senior Teacher',
  basicSalary: 35000,
  gross: 60000,
  deduction: 7350,
  net: 52650,
  status: 'Calculated',
  workingDays: 26,
  presentDays: 26,
  lop: 0,
  lopAmount: 0,
  earnings: [
  { name: 'Basic Salary', amount: 35000 },
  { name: 'HRA', amount: 14000 },
  { name: 'DA', amount: 3500 },
  { name: 'Special Allowance', amount: 5000 },
  { name: 'Medical Allowance', amount: 2500 }],

  deductions: [
  { name: 'Provident Fund', amount: 4200 },
  { name: 'ESI', amount: 450 },
  { name: 'Professional Tax', amount: 200 },
  { name: 'TDS', amount: 2500 }]

},
{
  id: '2',
  empCode: 'EMP002',
  empName: 'Priya Sharma',
  department: 'admin',
  designation: 'Admin Officer',
  basicSalary: 28000,
  gross: 43600,
  deduction: 5560,
  net: 38040,
  status: 'Calculated',
  workingDays: 26,
  presentDays: 25,
  lop: 1,
  lopAmount: 1677,
  earnings: [
  { name: 'Basic Salary', amount: 28000 },
  { name: 'HRA', amount: 11200 },
  { name: 'DA', amount: 2800 },
  { name: 'Conveyance', amount: 1600 }],

  deductions: [
  { name: 'Provident Fund', amount: 3360 },
  { name: 'Professional Tax', amount: 200 },
  { name: 'LOP Deduction', amount: 2000 }]

},
{
  id: '3',
  empCode: 'EMP003',
  empName: 'Amit Patel',
  department: 'it',
  designation: 'IT Manager',
  basicSalary: 45000,
  gross: 77500,
  deduction: 10600,
  net: 66900,
  status: 'Error',
  errorMessage: 'Missing PF account number',
  workingDays: 26,
  presentDays: 26,
  lop: 0,
  lopAmount: 0,
  earnings: [
  { name: 'Basic Salary', amount: 45000 },
  { name: 'HRA', amount: 22500 },
  { name: 'Technical Allowance', amount: 8000 },
  { name: 'Internet Allowance', amount: 2000 }],

  deductions: [
  { name: 'Provident Fund', amount: 5400 },
  { name: 'Professional Tax', amount: 200 },
  { name: 'TDS', amount: 5000 }]

},
{
  id: '4',
  empCode: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'finance',
  designation: 'Accountant',
  basicSalary: 30000,
  gross: 46800,
  deduction: 5960,
  net: 40840,
  status: 'Pending',
  workingDays: 26,
  presentDays: 24,
  lop: 2,
  lopAmount: 3600,
  earnings: [
  { name: 'Basic Salary', amount: 30000 },
  { name: 'HRA', amount: 12000 },
  { name: 'DA', amount: 3000 },
  { name: 'Special Allowance', amount: 1800 }],

  deductions: [
  { name: 'Provident Fund', amount: 3600 },
  { name: 'Professional Tax', amount: 200 },
  { name: 'LOP Deduction', amount: 2160 }]

},
{
  id: '5',
  empCode: 'EMP005',
  empName: 'Vikram Singh',
  department: 'support',
  designation: 'Lab Assistant',
  basicSalary: 20000,
  gross: 28000,
  deduction: 2640,
  net: 25360,
  status: 'Calculated',
  workingDays: 26,
  presentDays: 26,
  lop: 0,
  lopAmount: 0,
  earnings: [
  { name: 'Basic Salary', amount: 20000 },
  { name: 'HRA', amount: 6000 },
  { name: 'DA', amount: 2000 }],

  deductions: [
  { name: 'Provident Fund', amount: 2400 },
  { name: 'ESI', amount: 240 }]

},
{
  id: '6',
  empCode: 'EMP006',
  empName: 'Meera Nair',
  department: 'support',
  designation: 'Librarian',
  basicSalary: 25000,
  gross: 38500,
  deduction: 3200,
  net: 35300,
  status: 'Calculated',
  workingDays: 26,
  presentDays: 26,
  lop: 0,
  lopAmount: 0,
  earnings: [
  { name: 'Basic Salary', amount: 25000 },
  { name: 'HRA', amount: 10000 },
  { name: 'DA', amount: 2500 },
  { name: 'Special Allowance', amount: 1000 }],

  deductions: [
  { name: 'Provident Fund', amount: 3000 },
  { name: 'Professional Tax', amount: 200 }]

}];


const INITIAL_STEPS: Step[] = [
{ id: 1, label: 'Draft', status: 'completed', description: 'Payroll initialized' },
{ id: 2, label: 'Processing', status: 'completed', description: 'Calculate salaries' },
{ id: 3, label: 'Verification', status: 'active', description: 'Verify calculations' },
{ id: 4, label: 'Review', status: 'pending', description: 'Review by manager' },
{ id: 5, label: 'Approval', status: 'pending', description: 'Final approval' },
{ id: 6, label: 'Completed', status: 'pending', description: 'Payroll finalized' }];


// ==================== HELPER FUNCTIONS ====================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// ==================== MAIN COMPONENT ====================

export function PayrollProcess() {
  // ==================== STATE ====================

  // Payroll Selection State
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [payrollType, setPayrollType] = useState<'regular' | 'supplementary' | 'arrear'>('regular');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Data State
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState(2); // 0-indexed, currently at Verification
  const [processingLogs, setProcessingLogs] = useState<ProcessingLog[]>([]);

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [payrollStatus, setPayrollStatus] = useState<'draft' | 'processing' | 'verification' | 'review' | 'approval' | 'completed'>('verification');

  // Modal State
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [confirmAction, setConfirmAction] = useState<string>('');
  const [confirmMessage, setConfirmMessage] = useState<string>('');

  // ==================== COMPUTED VALUES ====================

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDepartment = !departmentFilter || emp.department === departmentFilter;
      const matchesSearch =
      !searchTerm ||
      emp.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || emp.status === statusFilter;
      return matchesDepartment && matchesSearch && matchesStatus;
    });
  }, [employees, departmentFilter, searchTerm, statusFilter]);

  const totalGross = useMemo(() => {
    return employees.reduce((sum, emp) => sum + emp.gross, 0);
  }, [employees]);

  const totalDeduction = useMemo(() => {
    return employees.reduce((sum, emp) => sum + emp.deduction, 0);
  }, [employees]);

  const totalNet = useMemo(() => {
    return employees.reduce((sum, emp) => sum + emp.net, 0);
  }, [employees]);

  const employeesProcessed = useMemo(() => {
    return employees.filter((emp) => emp.status === 'Calculated' || emp.status === 'Approved').length;
  }, [employees]);

  const employeesPending = useMemo(() => {
    return employees.filter((emp) => emp.status === 'Pending').length;
  }, [employees]);

  const exceptionsFound = useMemo(() => {
    return employees.filter((emp) => emp.status === 'Error').length;
  }, [employees]);

  const canProceedToNextStep = useMemo(() => {
    // Can proceed only if no errors and no pending
    return exceptionsFound === 0 && employeesPending === 0;
  }, [exceptionsFound, employeesPending]);

  const progressPercentage = useMemo(() => {
    return (currentStepIndex + 1) / steps.length * 100;
  }, [currentStepIndex, steps.length]);

  // ==================== LOG HANDLER ====================

  const addLog = useCallback((action: string, details?: string) => {
    const newLog: ProcessingLog = {
      id: generateId(),
      timestamp: getCurrentTimestamp(),
      action,
      user: 'Admin User', // In real app, get from auth context
      details
    };
    setProcessingLogs((prev) => [newLog, ...prev]);
  }, []);

  // ==================== PROCESS HANDLERS ====================

  const handleStartProcessing = useCallback(() => {
    setConfirmAction('process');
    setConfirmMessage('Are you sure you want to start processing payroll for ' + selectedMonth + ' ' + selectedYear + '?');
    setShowConfirmModal(true);
  }, [selectedMonth, selectedYear]);

  const executeProcessing = useCallback(async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    setProcessingProgress(0);

    addLog('Started payroll processing', `Month: ${selectedMonth} ${selectedYear}, Type: ${payrollType}`);

    // Simulate processing each employee
    const totalEmployees = employees.length;
    let processedCount = 0;

    for (let i = 0; i < totalEmployees; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

      processedCount++;
      setProcessingProgress(Math.round(processedCount / totalEmployees * 100));

      // Update employee status (simulate some random results)
      setEmployees((prev) =>
      prev.map((emp, index) => {
        if (index === i && emp.status === 'Pending') {
          // Simulate: 90% success, 10% error
          const isSuccess = Math.random() > 0.1;
          return {
            ...emp,
            status: isSuccess ? 'Calculated' : 'Error',
            errorMessage: isSuccess ? undefined : 'Processing failed - Please retry'
          };
        }
        return emp;
      })
      );
    }

    setIsProcessing(false);
    addLog('Completed payroll processing', `Processed: ${processedCount} employees`);

    // Update steps
    setSteps((prev) =>
    prev.map((step) => {
      if (step.id === 2) return { ...step, status: 'completed' as StepStatus };
      if (step.id === 3) return { ...step, status: 'active' as StepStatus };
      return step;
    })
    );
    setCurrentStepIndex(2);
    setPayrollStatus('verification');
  }, [employees, selectedMonth, selectedYear, payrollType, addLog]);

  const handleReprocessEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: 'Calculated',
          errorMessage: undefined
        };
      }
      return emp;
    })
    );
    addLog('Reprocessed employee', `Employee ID: ${employeeId}`);
  }, [addLog]);

  const handleRecalculateAll = useCallback(() => {
    setConfirmAction('recalculate');
    setConfirmMessage('Are you sure you want to recalculate all salaries? This will reset all calculated values.');
    setShowConfirmModal(true);
  }, []);

  const executeRecalculate = useCallback(() => {
    setShowConfirmModal(false);

    setEmployees((prev) =>
    prev.map((emp) => ({
      ...emp,
      status: 'Pending',
      errorMessage: undefined
    }))
    );

    // Reset steps
    setSteps((prev) =>
    prev.map((step) => {
      if (step.id === 1) return { ...step, status: 'completed' as StepStatus };
      if (step.id === 2) return { ...step, status: 'active' as StepStatus };
      return { ...step, status: 'pending' as StepStatus };
    })
    );
    setCurrentStepIndex(1);
    setPayrollStatus('processing');

    addLog('Reset payroll for recalculation', 'All employee statuses reset to Pending');
  }, [addLog]);

  // ==================== STEP NAVIGATION ====================

  const handleMoveToNextStep = useCallback(() => {
    if (!canProceedToNextStep) {
      setShowErrorModal(true);
      return;
    }

    setConfirmAction('next-step');
    const nextStep = steps[currentStepIndex + 1];
    setConfirmMessage(`Move payroll to "${nextStep?.label}" stage?`);
    setShowConfirmModal(true);
  }, [canProceedToNextStep, currentStepIndex, steps]);

  const executeMoveToNextStep = useCallback(() => {
    setShowConfirmModal(false);

    const newStepIndex = currentStepIndex + 1;
    if (newStepIndex >= steps.length) return;

    setSteps((prev) =>
    prev.map((step, index) => {
      if (index < newStepIndex) return { ...step, status: 'completed' as StepStatus };
      if (index === newStepIndex) return { ...step, status: 'active' as StepStatus };
      return { ...step, status: 'pending' as StepStatus };
    })
    );

    setCurrentStepIndex(newStepIndex);

    const statusMap: Record<number, typeof payrollStatus> = {
      1: 'processing',
      2: 'verification',
      3: 'review',
      4: 'approval',
      5: 'completed'
    };
    setPayrollStatus(statusMap[newStepIndex] || 'draft');

    addLog(`Moved to ${steps[newStepIndex].label}`, `Step ${newStepIndex + 1} of ${steps.length}`);

    // If completed, lock all employees
    if (newStepIndex === steps.length - 1) {
      setEmployees((prev) =>
      prev.map((emp) => ({
        ...emp,
        status: 'Locked'
      }))
      );
      addLog('Payroll completed and locked', 'All employee records have been finalized');
    }
  }, [currentStepIndex, steps, addLog]);

  const handleMoveToPreviousStep = useCallback(() => {
    if (currentStepIndex <= 0) return;

    setConfirmAction('prev-step');
    const prevStep = steps[currentStepIndex - 1];
    setConfirmMessage(`Move payroll back to "${prevStep?.label}" stage? This will allow modifications.`);
    setShowConfirmModal(true);
  }, [currentStepIndex, steps]);

  const executeMoveToPreviousStep = useCallback(() => {
    setShowConfirmModal(false);

    const newStepIndex = currentStepIndex - 1;
    if (newStepIndex < 0) return;

    setSteps((prev) =>
    prev.map((step, index) => {
      if (index < newStepIndex) return { ...step, status: 'completed' as StepStatus };
      if (index === newStepIndex) return { ...step, status: 'active' as StepStatus };
      return { ...step, status: 'pending' as StepStatus };
    })
    );

    setCurrentStepIndex(newStepIndex);

    const statusMap: Record<number, typeof payrollStatus> = {
      0: 'draft',
      1: 'processing',
      2: 'verification',
      3: 'review',
      4: 'approval'
    };
    setPayrollStatus(statusMap[newStepIndex] || 'draft');

    // Unlock employees if moved back from completed
    if (currentStepIndex === steps.length - 1) {
      setEmployees((prev) =>
      prev.map((emp) => ({
        ...emp,
        status: 'Calculated'
      }))
      );
    }

    addLog(`Moved back to ${steps[newStepIndex].label}`, `Step ${newStepIndex + 1} of ${steps.length}`);
  }, [currentStepIndex, steps, addLog]);

  // ==================== EMPLOYEE HANDLERS ====================

  const handleViewEmployee = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  }, []);

  const handleApproveEmployee = useCallback((employeeId: string) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id === employeeId && emp.status === 'Calculated') {
        return { ...emp, status: 'Approved' };
      }
      return emp;
    })
    );
    addLog('Approved employee payroll', `Employee ID: ${employeeId}`);
  }, [addLog]);

  const handleRejectEmployee = useCallback((employeeId: string, reason: string) => {
    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: 'Error',
          errorMessage: reason || 'Rejected during review'
        };
      }
      return emp;
    })
    );
    addLog('Rejected employee payroll', `Employee ID: ${employeeId}, Reason: ${reason}`);
  }, [addLog]);

  const handleApproveAll = useCallback(() => {
    setConfirmAction('approve-all');
    setConfirmMessage('Approve payroll for all calculated employees?');
    setShowConfirmModal(true);
  }, []);

  const executeApproveAll = useCallback(() => {
    setShowConfirmModal(false);

    setEmployees((prev) =>
    prev.map((emp) => {
      if (emp.status === 'Calculated') {
        return { ...emp, status: 'Approved' };
      }
      return emp;
    })
    );

    addLog('Approved all calculated employees', `Count: ${employeesProcessed}`);
  }, [employeesProcessed, addLog]);

  // ==================== EXPORT HANDLERS ====================

  const handleExportPayroll = useCallback(() => {
    const csvData = [
    ['Employee Code', 'Employee Name', 'Department', 'Gross', 'Deductions', 'Net', 'Status'],
    ...employees.map((emp) => [
    emp.empCode,
    emp.empName,
    emp.department,
    emp.gross.toString(),
    emp.deduction.toString(),
    emp.net.toString(),
    emp.status]
    )];


    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
    link.click();

    addLog('Exported payroll to CSV', `File: payroll_${selectedMonth}_${selectedYear}.csv`);
  }, [employees, selectedMonth, selectedYear, addLog]);

  const handlePrintPayroll = useCallback(() => {
    addLog('Printed payroll report', `Month: ${selectedMonth} ${selectedYear}`);
    window.print();
  }, [selectedMonth, selectedYear, addLog]);

  // ==================== CONFIRM MODAL HANDLER ====================

  const handleConfirmAction = useCallback(() => {
    switch (confirmAction) {
      case 'process':
        executeProcessing();
        break;
      case 'recalculate':
        executeRecalculate();
        break;
      case 'next-step':
        executeMoveToNextStep();
        break;
      case 'prev-step':
        executeMoveToPreviousStep();
        break;
      case 'approve-all':
        executeApproveAll();
        break;
      default:
        setShowConfirmModal(false);
    }
  }, [confirmAction, executeProcessing, executeRecalculate, executeMoveToNextStep, executeMoveToPreviousStep, executeApproveAll]);

  // ==================== STATUS BADGE ====================

  const getStatusBadge = (status: string) => {
    const config: Record<string, {bg: string;text: string;icon: React.ElementType;}> = {
      Calculated: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      Error: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
      Approved: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
      Locked: { bg: 'bg-gray-100', text: 'text-gray-700', icon: Lock }
    };

    const statusConfig = config[status] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: Clock };
    const Icon = statusConfig.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>);

  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Process</h1>
          <p className="text-sm text-gray-500">Process and verify payroll for the selected period</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogsModal(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">

            <FileText className="w-4 h-4 mr-2" />
            View Logs
          </button>
          <button
            onClick={handleExportPayroll}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">

            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handlePrintPayroll}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">

            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleStartProcessing}
            disabled={isProcessing || payrollStatus === 'completed'}
            className="inline-flex items-center px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">

            {isProcessing ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing... {processingProgress}%
              </> :

            <>
                <Play className="w-4 h-4 mr-2" />
                Process Payroll
              </>
            }
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500">

              {MONTHS.map((month) =>
              <option key={month} value={month}>{month}</option>
              )}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500">

              {YEARS.map((year) =>
              <option key={year} value={year}>{year}</option>
              )}
            </select>
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payroll Type</label>
            <select
              value={payrollType}
              onChange={(e) => setPayrollType(e.target.value as 'regular' | 'supplementary' | 'arrear')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500">

              {PAYROLL_TYPES.map((type) =>
              <option key={type.value} value={type.value}>{type.label}</option>
              )}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500">

              {DEPARTMENTS.map((dept) =>
              <option key={dept.value} value={dept.value}>{dept.label}</option>
              )}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or code..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500" />

            </div>
          </div>
        </div>
      </div>

      {/* Stepper Workflow */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Payroll Workflow</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMoveToPreviousStep}
              disabled={currentStepIndex <= 0 || isProcessing}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            <button
              onClick={handleMoveToNextStep}
              disabled={currentStepIndex >= steps.length - 1 || isProcessing}
              className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">

              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-teal-600 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }} />

          </div>
          {steps.map((step) =>
          <div key={step.id} className="flex flex-col items-center relative">
              <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm mb-2 transition-all ${
              step.status === 'completed' ?
              'bg-teal-600 text-white' :
              step.status === 'active' ?
              'bg-teal-100 text-teal-700 ring-4 ring-teal-50' :
              step.status === 'error' ?
              'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-400'}`
              }>

                {step.status === 'completed' ?
              <CheckCircle className="w-6 h-6" /> :
              step.status === 'error' ?
              <AlertCircle className="w-6 h-6" /> :

              step.id
              }
              </div>
              <div
              className={`text-xs font-medium text-center max-w-[90px] ${
              step.status === 'active' ?
              'text-teal-600' :
              step.status === 'completed' ?
              'text-gray-900' :
              'text-gray-400'}`
              }>

                {step.label}
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-1 max-w-[90px]">
                {step.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payroll Summary */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Payroll Summary Preview</h3>
            <button
              onClick={handleRecalculateAll}
              disabled={isProcessing || payrollStatus === 'completed'}
              className="inline-flex items-center px-3 py-1.5 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50">

              <RefreshCw className="w-4 h-4 mr-1" />
              Recalculate All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Gross</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalGross)}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Deductions</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeduction)}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Net Payable</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalNet)}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">
              <Clock className="w-3 h-3 mr-1" />
              Status: {payrollStatus.charAt(0).toUpperCase() + payrollStatus.slice(1)} – {steps[currentStepIndex]?.label} Stage
            </span>
            {payrollStatus !== 'completed' && exceptionsFound === 0 && employeesPending === 0 &&
            <button
              onClick={handleApproveAll}
              className="inline-flex items-center px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">

                <CheckCircle className="w-4 h-4 mr-1" />
                Approve All
              </button>
            }
          </div>
        </div>

        {/* Processing Status */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Processing Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Employees Processed</span>
                <span className="text-sm font-semibold text-gray-900">{employeesProcessed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${employeesProcessed / employees.length * 100}%` }} />

              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Employees Pending</span>
                <span className="text-sm font-semibold text-gray-900">{employeesPending}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${employeesPending / employees.length * 100}%` }} />

              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Exceptions Found</span>
                <span className="text-sm font-semibold text-gray-900">{exceptionsFound}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${exceptionsFound / employees.length * 100}%` }} />

              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Processing Progress</span>
                <span className="text-sm font-semibold text-teal-600">
                  {isProcessing ? `${processingProgress}%` : 'Ready'}
                </span>
              </div>
            </div>
            {exceptionsFound > 0 &&
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Attention Required</p>
                    <p className="text-xs text-red-600 mt-1">
                      {exceptionsFound} employee(s) have errors that need to be resolved before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Employee Processing Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Employee Processing Details</h3>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500">

              <option value="">All Status</option>
              <option value="Calculated">Calculated</option>
              <option value="Pending">Pending</option>
              <option value="Error">Error</option>
              <option value="Approved">Approved</option>
              <option value="Locked">Locked</option>
            </select>
            <span className="text-sm text-gray-500">
              Showing {filteredEmployees.length} of {employees.length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Salary
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEmployees.map((row) =>
              <tr
                key={row.id}
                className={`hover:bg-gray-50 transition-colors ${
                row.status === 'Error' ? 'bg-red-50 border-l-4 border-l-red-400' : ''}`
                }>

                  <td className="py-3 px-6">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{row.empName}</p>
                      <p className="text-xs text-gray-500">{row.empCode}</p>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-gray-600 text-sm capitalize">{row.department}</td>
                  <td className="py-3 px-6 text-right text-gray-900 text-sm font-medium">
                    {formatCurrency(row.gross)}
                  </td>
                  <td className="py-3 px-6 text-right text-red-600 text-sm">
                    {formatCurrency(row.deduction)}
                  </td>
                  <td className="py-3 px-6 text-right font-semibold text-green-600 text-sm">
                    {formatCurrency(row.net)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {getStatusBadge(row.status)}
                    {row.errorMessage &&
                  <p className="text-xs text-red-500 mt-1">{row.errorMessage}</p>
                  }
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                      onClick={() => handleViewEmployee(row)}
                      className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      title="View Details">

                        <Eye className="w-4 h-4" />
                      </button>
                      {row.status === 'Error' &&
                    <button
                      onClick={() => handleReprocessEmployee(row.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Retry Processing">

                          <RotateCcw className="w-4 h-4" />
                        </button>
                    }
                      {row.status === 'Calculated' && payrollStatus !== 'completed' &&
                    <button
                      onClick={() => handleApproveEmployee(row.id)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve">

                          <CheckCircle className="w-4 h-4" />
                        </button>
                    }
                    </div>
                  </td>
                </tr>
              )}
              {filteredEmployees.length === 0 &&
              <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No employees found matching your criteria</p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Employee Detail Modal */}
      {showEmployeeModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{selectedEmployee.empName}</h2>
                <p className="text-sm text-gray-500">{selectedEmployee.empCode} • {selectedEmployee.designation}</p>
              </div>
              <button
              onClick={() => setShowEmployeeModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Attendance Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Attendance Summary</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Working Days</p>
                    <p className="text-lg font-bold text-gray-900">{selectedEmployee.workingDays}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">Present</p>
                    <p className="text-lg font-bold text-green-600">{selectedEmployee.presentDays}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">LOP Days</p>
                    <p className="text-lg font-bold text-red-600">{selectedEmployee.lop}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500">LOP Amount</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(selectedEmployee.lopAmount)}</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Earnings</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmployee.earnings.map((earning, idx) =>
                    <tr key={idx}>
                          <td className="py-2 px-4 text-gray-600">{earning.name}</td>
                          <td className="py-2 px-4 text-right font-medium text-gray-900">
                            {formatCurrency(earning.amount)}
                          </td>
                        </tr>
                    )}
                      <tr className="bg-green-50">
                        <td className="py-2 px-4 font-semibold text-gray-900">Total Earnings</td>
                        <td className="py-2 px-4 text-right font-bold text-green-600">
                          {formatCurrency(selectedEmployee.gross)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Deductions</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {selectedEmployee.deductions.map((deduction, idx) =>
                    <tr key={idx}>
                          <td className="py-2 px-4 text-gray-600">{deduction.name}</td>
                          <td className="py-2 px-4 text-right font-medium text-red-600">
                            {formatCurrency(deduction.amount)}
                          </td>
                        </tr>
                    )}
                      <tr className="bg-red-50">
                        <td className="py-2 px-4 font-semibold text-gray-900">Total Deductions</td>
                        <td className="py-2 px-4 text-right font-bold text-red-600">
                          {formatCurrency(selectedEmployee.deduction)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-teal-900">Net Payable</span>
                  <span className="text-2xl font-bold text-teal-600">
                    {formatCurrency(selectedEmployee.net)}
                  </span>
                </div>
              </div>

              {/* Error Message */}
              {selectedEmployee.errorMessage &&
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Error</p>
                      <p className="text-sm text-red-600 mt-1">{selectedEmployee.errorMessage}</p>
                    </div>
                  </div>
                </div>
            }
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
              onClick={() => setShowEmployeeModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">

                Close
              </button>
              {selectedEmployee.status === 'Error' &&
            <button
              onClick={() => {
                handleReprocessEmployee(selectedEmployee.id);
                setShowEmployeeModal(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">

                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Retry Processing
                </button>
            }
              {selectedEmployee.status === 'Calculated' &&
            <button
              onClick={() => {
                handleApproveEmployee(selectedEmployee.id);
                setShowEmployeeModal(false);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">

                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Approve
                </button>
            }
            </div>
          </div>
        </div>
      }

      {/* Confirm Modal */}
      {showConfirmModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Action</h3>
              <p className="text-sm text-gray-500">{confirmMessage}</p>
            </div>
            <div className="flex items-center gap-3 p-4 border-t border-gray-200 bg-gray-50">
              <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">

                Cancel
              </button>
              <button
              onClick={handleConfirmAction}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">

                Confirm
              </button>
            </div>
          </div>
        </div>
      }

      {/* Logs Modal */}
      {showLogsModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Processing Logs</h2>
              <button
              onClick={() => setShowLogsModal(false)}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">

                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {processingLogs.length > 0 ?
            <div className="divide-y divide-gray-100">
                  {processingLogs.map((log) =>
              <div key={log.id} className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{log.action}</span>
                        <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                      </div>
                      {log.details && <p className="text-sm text-gray-600">{log.details}</p>}
                      <p className="text-xs text-gray-400 mt-1">By: {log.user}</p>
                    </div>
              )}
                </div> :

            <div className="p-8 text-center text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No processing logs yet</p>
                </div>
            }
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
              onClick={() => setShowLogsModal(false)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">

                Close
              </button>
            </div>
          </div>
        </div>
      }

      {/* Error Modal */}
      {showErrorModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cannot Proceed</h3>
              <p className="text-sm text-gray-500">
                There are {exceptionsFound} error(s) and {employeesPending} pending employee(s).
                Please resolve all issues before proceeding to the next step.
              </p>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
              onClick={() => setShowErrorModal(false)}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">

                Understood
              </button>
            </div>
          </div>
        </div>
      }
    </div>);

}

export default PayrollProcess;