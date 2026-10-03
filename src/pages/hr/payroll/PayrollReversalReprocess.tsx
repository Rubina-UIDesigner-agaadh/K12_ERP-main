import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  RotateCcwIcon,
  AlertTriangleIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  RefreshCwIcon,
  DownloadIcon,
  FileTextIcon,
  HistoryIcon,
  ChevronRightIcon,
  AlertCircleIcon,
  LockIcon,
  UnlockIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Input } from '../../../components/ui/Input';

// Types
interface PayrollHistoryItem {
  id: number;
  stage: PayrollStage;
  date: string;
  time: string;
  user: string;
  status: 'Completed' | 'Current' | 'Pending' | 'Reversed';
  notes?: string;
}

interface ReversalRecord {
  id: string;
  month: string;
  department: string;
  reversedFrom: PayrollStage;
  reversedTo: PayrollStage;
  reason: string;
  reversedBy: string;
  timestamp: Date;
  employeesAffected: number;
}

interface ReprocessStep {
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
}

type PayrollStage = 'Draft Created' | 'Verified' | 'Approved' | 'Locked' | 'Released';

interface PayrollData {
  history: PayrollHistoryItem[];
  currentStatus: PayrollStage;
  employeesImpacted: number;
  totalAmount: number;
  isLocked: boolean;
}

// Stage order for progression
const STAGE_ORDER: PayrollStage[] = ['Draft Created', 'Verified', 'Approved', 'Locked', 'Released'];

// Sample payroll data by month
const PAYROLL_DATA_BY_MONTH: Record<string, Record<string, PayrollData>> = {
  'May 2025': {
    all: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-05-01', time: '09:30 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-05-05', time: '02:15 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-05-10', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-05-15', time: '04:45 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-05-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 248,
      totalAmount: 12450000,
      isLocked: true
    },
    teaching: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-05-01', time: '09:30 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-05-05', time: '02:15 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-05-10', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-05-15', time: '04:45 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-05-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 120,
      totalAmount: 6000000,
      isLocked: true
    },
    admin: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-05-01', time: '09:30 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-05-05', time: '02:15 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-05-10', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-05-15', time: '04:45 PM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Locked',
      employeesImpacted: 80,
      totalAmount: 4000000,
      isLocked: true
    },
    it: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-05-01', time: '09:30 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-05-05', time: '02:15 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-05-10', time: '11:00 AM', user: 'Finance Head', status: 'Current' }],

      currentStatus: 'Approved',
      employeesImpacted: 48,
      totalAmount: 2450000,
      isLocked: false
    }
  },
  'April 2025': {
    all: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-04-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-04-04', time: '03:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-04-08', time: '10:30 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-04-12', time: '05:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-04-18', time: '09:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 245,
      totalAmount: 12300000,
      isLocked: true
    },
    teaching: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-04-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-04-04', time: '03:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-04-08', time: '10:30 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-04-12', time: '05:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-04-18', time: '09:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 118,
      totalAmount: 5900000,
      isLocked: true
    },
    admin: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-04-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-04-04', time: '03:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-04-08', time: '10:30 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-04-12', time: '05:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-04-18', time: '09:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 78,
      totalAmount: 3900000,
      isLocked: true
    },
    it: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-04-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-04-04', time: '03:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-04-08', time: '10:30 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-04-12', time: '05:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-04-18', time: '09:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 49,
      totalAmount: 2500000,
      isLocked: true
    }
  },
  'March 2025': {
    all: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-03-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-03-05', time: '02:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-03-09', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-03-14', time: '04:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-03-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 240,
      totalAmount: 12000000,
      isLocked: true
    },
    teaching: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-03-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-03-05', time: '02:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-03-09', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-03-14', time: '04:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-03-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 115,
      totalAmount: 5750000,
      isLocked: true
    },
    admin: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-03-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-03-05', time: '02:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-03-09', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-03-14', time: '04:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-03-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 77,
      totalAmount: 3850000,
      isLocked: true
    },
    it: {
      history: [
      { id: 1, stage: 'Draft Created', date: '2025-03-01', time: '09:00 AM', user: 'Admin User', status: 'Completed' },
      { id: 2, stage: 'Verified', date: '2025-03-05', time: '02:00 PM', user: 'HR Manager', status: 'Completed' },
      { id: 3, stage: 'Approved', date: '2025-03-09', time: '11:00 AM', user: 'Finance Head', status: 'Completed' },
      { id: 4, stage: 'Locked', date: '2025-03-14', time: '04:00 PM', user: 'Admin User', status: 'Completed' },
      { id: 5, stage: 'Released', date: '2025-03-20', time: '10:00 AM', user: 'Admin User', status: 'Current' }],

      currentStatus: 'Released',
      employeesImpacted: 48,
      totalAmount: 2400000,
      isLocked: true
    }
  }
};

// Department labels
const DEPARTMENT_LABELS: Record<string, string> = {
  all: 'All Departments',
  teaching: 'Teaching',
  admin: 'Administration',
  it: 'IT Department'
};

// Initial reprocess steps
const INITIAL_REPROCESS_STEPS: ReprocessStep[] = [
{ id: 1, name: 'Validate Employee Data', status: 'pending' },
{ id: 2, name: 'Calculate Gross Salary', status: 'pending' },
{ id: 3, name: 'Apply Deductions', status: 'pending' },
{ id: 4, name: 'Calculate Tax Components', status: 'pending' },
{ id: 5, name: 'Generate Net Salary', status: 'pending' },
{ id: 6, name: 'Create Payslips', status: 'pending' },
{ id: 7, name: 'Finalize Processing', status: 'pending' }];


// Current user (simulated)
const CURRENT_USER = 'Admin User';

export function PayrollReversalReprocess() {
  // Filter state
  const [month, setMonth] = useState('May 2025');
  const [department, setDepartment] = useState('');

  // Modal states
  const [showReversalModal, setShowReversalModal] = useState(false);
  const [showReprocessModal, setShowReprocessModal] = useState(false);
  const [showStageSelectModal, setShowStageSelectModal] = useState(false);
  const [showHistoryDetailModal, setShowHistoryDetailModal] = useState(false);
  const [showReversalHistoryModal, setShowReversalHistoryModal] = useState(false);

  // Reversal state
  const [reversalReason, setReversalReason] = useState('');
  const [targetStage, setTargetStage] = useState<PayrollStage>('Draft Created');
  const [reversalLoading, setReversalLoading] = useState(false);
  const [reversalError, setReversalError] = useState<string | null>(null);

  // Reprocess state
  const [reprocessSteps, setReprocessSteps] = useState<ReprocessStep[]>(INITIAL_REPROCESS_STEPS);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [reprocessPaused, setReprocessPaused] = useState(false);
  const [currentReprocessStep, setCurrentReprocessStep] = useState(0);
  const [reprocessComplete, setReprocessComplete] = useState(false);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data state
  const [payrollDataStore, setPayrollDataStore] = useState(PAYROLL_DATA_BY_MONTH);
  const [reversalHistory, setReversalHistory] = useState<ReversalRecord[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<PayrollHistoryItem | null>(null);

  // Get current payroll data based on selected filters
  const currentPayrollData = useMemo(() => {
    const deptKey = department || 'all';
    return payrollDataStore[month]?.[deptKey] || payrollDataStore[month]?.all;
  }, [month, department, payrollDataStore]);

  // Get available stages to reverse to
  const availableReversalStages = useMemo(() => {
    if (!currentPayrollData) return [];
    const currentIndex = STAGE_ORDER.indexOf(currentPayrollData.currentStatus);
    return STAGE_ORDER.slice(0, currentIndex);
  }, [currentPayrollData]);

  // Check if reversal is allowed
  const canReverse = useMemo(() => {
    if (!currentPayrollData) return false;
    const currentIndex = STAGE_ORDER.indexOf(currentPayrollData.currentStatus);
    return currentIndex > 0;
  }, [currentPayrollData]);

  // Handle month change
  const handleMonthChange = useCallback((newMonth: string) => {
    setMonth(newMonth);
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  // Handle department change
  const handleDepartmentChange = useCallback((newDept: string) => {
    setDepartment(newDept);
    setSuccessMessage(null);
    setErrorMessage(null);
  }, []);

  // Open reversal modal
  const openReversalModal = useCallback(() => {
    if (!canReverse) {
      setErrorMessage('Cannot reverse payroll at Draft stage');
      return;
    }
    setReversalReason('');
    setTargetStage(availableReversalStages[availableReversalStages.length - 1] || 'Draft Created');
    setReversalError(null);
    setShowReversalModal(true);
  }, [canReverse, availableReversalStages]);

  // Close reversal modal
  const closeReversalModal = useCallback(() => {
    setShowReversalModal(false);
    setReversalReason('');
    setReversalError(null);
    setReversalLoading(false);
  }, []);

  // Validate reversal
  const validateReversal = useCallback(() => {
    if (!reversalReason.trim()) {
      setReversalError('Please provide a reason for reversal');
      return false;
    }
    if (reversalReason.trim().length < 10) {
      setReversalError('Reason must be at least 10 characters');
      return false;
    }
    return true;
  }, [reversalReason]);

  // Perform reversal
  const performReversal = useCallback(async () => {
    if (!validateReversal()) return;
    if (!currentPayrollData) return;

    setReversalLoading(true);
    setReversalError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const deptKey = department || 'all';
      const previousStatus = currentPayrollData.currentStatus;
      const targetIndex = STAGE_ORDER.indexOf(targetStage);

      // Create new history
      const newHistory: PayrollHistoryItem[] = currentPayrollData.history.
      filter((_, index) => index <= targetIndex).
      map((item, index) => ({
        ...item,
        status: index === targetIndex ? 'Current' as const : 'Completed' as const
      }));

      // Add reversal entry to history
      const reversalEntry: PayrollHistoryItem = {
        id: newHistory.length + 1,
        stage: previousStatus,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        user: CURRENT_USER,
        status: 'Reversed',
        notes: `Reversed to ${targetStage}: ${reversalReason}`
      };

      // Create reversal record
      const reversalRecord: ReversalRecord = {
        id: `REV-${Date.now()}`,
        month,
        department: DEPARTMENT_LABELS[deptKey],
        reversedFrom: previousStatus,
        reversedTo: targetStage,
        reason: reversalReason,
        reversedBy: CURRENT_USER,
        timestamp: new Date(),
        employeesAffected: currentPayrollData.employeesImpacted
      };

      // Update payroll data store
      setPayrollDataStore((prev) => ({
        ...prev,
        [month]: {
          ...prev[month],
          [deptKey]: {
            ...prev[month][deptKey],
            history: [...newHistory],
            currentStatus: targetStage,
            isLocked: targetStage === 'Locked' || targetStage === 'Released'
          }
        }
      }));

      // Add to reversal history
      setReversalHistory((prev) => [reversalRecord, ...prev]);

      setReversalLoading(false);
      closeReversalModal();
      setSuccessMessage(
        `Payroll successfully reversed from "${previousStatus}" to "${targetStage}". ${currentPayrollData.employeesImpacted} employees affected.`
      );

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(null), 10000);

      // Log for debugging
      console.log('Reversal completed:', reversalRecord);
    } catch (error) {
      setReversalError('An error occurred during reversal. Please try again.');
      setReversalLoading(false);
    }
  }, [validateReversal, currentPayrollData, department, targetStage, reversalReason, month, closeReversalModal]);

  // Open reprocess modal
  const openReprocessModal = useCallback(() => {
    setReprocessSteps(INITIAL_REPROCESS_STEPS.map((step) => ({ ...step, status: 'pending' })));
    setCurrentReprocessStep(0);
    setIsReprocessing(false);
    setReprocessPaused(false);
    setReprocessComplete(false);
    setShowReprocessModal(true);
  }, []);

  // Close reprocess modal
  const closeReprocessModal = useCallback(() => {
    if (isReprocessing && !reprocessComplete) {
      if (!window.confirm('Reprocessing is in progress. Are you sure you want to cancel?')) {
        return;
      }
    }
    setShowReprocessModal(false);
    setIsReprocessing(false);
    setReprocessPaused(false);
    setReprocessSteps(INITIAL_REPROCESS_STEPS);
    setCurrentReprocessStep(0);
    setReprocessComplete(false);
  }, [isReprocessing, reprocessComplete]);

  // Start reprocessing
  const startReprocessing = useCallback(() => {
    setIsReprocessing(true);
    setReprocessPaused(false);
    setReprocessComplete(false);
  }, []);

  // Pause reprocessing
  const pauseReprocessing = useCallback(() => {
    setReprocessPaused(true);
  }, []);

  // Resume reprocessing
  const resumeReprocessing = useCallback(() => {
    setReprocessPaused(false);
  }, []);

  // Reprocessing effect
  useEffect(() => {
    if (!isReprocessing || reprocessPaused || reprocessComplete) return;

    if (currentReprocessStep >= reprocessSteps.length) {
      setReprocessComplete(true);
      setIsReprocessing(false);
      return;
    }

    // Set current step to in-progress
    setReprocessSteps((prev) =>
    prev.map((step, index) =>
    index === currentReprocessStep ?
    { ...step, status: 'in-progress', startTime: new Date() } :
    step
    )
    );

    // Simulate step processing
    const timeout = setTimeout(() => {
      // Random chance of error for demonstration (5%)
      const hasError = Math.random() < 0.05;

      setReprocessSteps((prev) =>
      prev.map((step, index) =>
      index === currentReprocessStep ?
      {
        ...step,
        status: hasError ? 'error' : 'completed',
        endTime: new Date(),
        errorMessage: hasError ? 'Processing failed. Please retry.' : undefined
      } :
      step
      )
      );

      if (hasError) {
        setIsReprocessing(false);
        setReprocessPaused(true);
      } else {
        setCurrentReprocessStep((prev) => prev + 1);
      }
    }, 1500 + Math.random() * 1000);

    return () => clearTimeout(timeout);
  }, [isReprocessing, reprocessPaused, currentReprocessStep, reprocessSteps.length, reprocessComplete]);

  // Retry failed step
  const retryFailedStep = useCallback(() => {
    setReprocessSteps((prev) =>
    prev.map((step, index) =>
    index === currentReprocessStep ? { ...step, status: 'pending', errorMessage: undefined } : step
    )
    );
    setIsReprocessing(true);
    setReprocessPaused(false);
  }, [currentReprocessStep]);

  // Complete reprocessing and update status
  const finalizeReprocessing = useCallback(() => {
    if (!currentPayrollData) return;

    const deptKey = department || 'all';
    const newStatus: PayrollStage = 'Verified';

    // Update history with new verification
    const newHistory: PayrollHistoryItem[] = [
    ...currentPayrollData.history,
    {
      id: currentPayrollData.history.length + 1,
      stage: 'Verified',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      user: CURRENT_USER,
      status: 'Current',
      notes: 'Reprocessed and verified'
    }].
    map((item, index, arr) => ({
      ...item,
      status: index === arr.length - 1 ? 'Current' as const :
      item.status === 'Reversed' ? 'Reversed' as const : 'Completed' as const
    }));

    // Update payroll data store
    setPayrollDataStore((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [deptKey]: {
          ...prev[month][deptKey],
          history: newHistory,
          currentStatus: newStatus,
          isLocked: false
        }
      }
    }));

    closeReprocessModal();
    setSuccessMessage(`Payroll reprocessed successfully. Status updated to "${newStatus}".`);

    // Auto-hide success message
    setTimeout(() => setSuccessMessage(null), 10000);
  }, [currentPayrollData, department, month, closeReprocessModal]);

  // View history item details
  const viewHistoryDetail = useCallback((item: PayrollHistoryItem) => {
    setSelectedHistoryItem(item);
    setShowHistoryDetailModal(true);
  }, []);

  // Export reversal report
  const exportReversalReport = useCallback(() => {
    if (reversalHistory.length === 0) {
      setErrorMessage('No reversal history to export');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    const reportData = {
      generatedAt: new Date().toISOString(),
      generatedBy: CURRENT_USER,
      totalReversals: reversalHistory.length,
      reversals: reversalHistory.map((record) => ({
        id: record.id,
        month: record.month,
        department: record.department,
        reversedFrom: record.reversedFrom,
        reversedTo: record.reversedTo,
        reason: record.reason,
        reversedBy: record.reversedBy,
        timestamp: record.timestamp.toISOString(),
        employeesAffected: record.employeesAffected
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reversal_report_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [reversalHistory]);

  // Export current payroll status
  const exportPayrollStatus = useCallback(() => {
    if (!currentPayrollData) return;

    const deptKey = department || 'all';
    const exportData = {
      month,
      department: DEPARTMENT_LABELS[deptKey],
      currentStatus: currentPayrollData.currentStatus,
      employeesImpacted: currentPayrollData.employeesImpacted,
      totalAmount: currentPayrollData.totalAmount,
      isLocked: currentPayrollData.isLocked,
      history: currentPayrollData.history,
      exportedAt: new Date().toISOString(),
      exportedBy: CURRENT_USER
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `payroll_status_${month.replace(' ', '_')}_${deptKey}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [currentPayrollData, month, department]);

  // Progress to next stage
  const progressToNextStage = useCallback(() => {
    if (!currentPayrollData) return;

    const deptKey = department || 'all';
    const currentIndex = STAGE_ORDER.indexOf(currentPayrollData.currentStatus);

    if (currentIndex >= STAGE_ORDER.length - 1) {
      setErrorMessage('Payroll is already at the final stage');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];

    // Add new stage to history
    const newHistory: PayrollHistoryItem[] = currentPayrollData.history.map((item) => ({
      ...item,
      status: 'Completed' as const
    }));

    newHistory.push({
      id: newHistory.length + 1,
      stage: nextStage,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      user: CURRENT_USER,
      status: 'Current'
    });

    // Update payroll data store
    setPayrollDataStore((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [deptKey]: {
          ...prev[month][deptKey],
          history: newHistory,
          currentStatus: nextStage,
          isLocked: nextStage === 'Locked' || nextStage === 'Released'
        }
      }
    }));

    setSuccessMessage(`Payroll progressed to "${nextStage}"`);
    setTimeout(() => setSuccessMessage(null), 5000);
  }, [currentPayrollData, department, month]);

  // Get stage icon
  const getStageIcon = (item: PayrollHistoryItem) => {
    if (item.status === 'Current') {
      return <ClockIcon className="w-6 h-6 text-indigo-600" />;
    }
    if (item.status === 'Reversed') {
      return <RotateCcwIcon className="w-5 h-5 text-amber-600" />;
    }
    return <div className="w-3 h-3 rounded-full bg-emerald-500" />;
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string): 'success' | 'info' | 'warning' | 'secondary' => {
    switch (status) {
      case 'Released':
        return 'success';
      case 'Locked':
        return 'info';
      case 'Approved':
        return 'success';
      case 'Verified':
        return 'info';
      case 'Draft Created':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (!currentPayrollData) {
    return (
      <div className="min-h-screen w-full bg-white font-sans text-slate-900 flex items-center justify-center">
        <p className="text-slate-600">No payroll data available for selected filters.</p>
      </div>);

  }

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              Payroll Reversal / Re-process
            </h1>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<HistoryIcon className="w-4 h-4" />}
                onClick={() => setShowReversalHistoryModal(true)}
                disabled={reversalHistory.length === 0}>

                Reversal History ({reversalHistory.length})
              </Button>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={exportPayrollStatus}>

                Export Status
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <Select
              value={month}
              onChange={(val) => handleMonthChange(val as string)}
              options={[
              { value: 'May 2025', label: 'May 2025' },
              { value: 'April 2025', label: 'April 2025' },
              { value: 'March 2025', label: 'March 2025' }]
              }
              className="w-40" />

            <Select
              value={department}
              onChange={(val) => handleDepartmentChange(val as string)}
              placeholder="All Departments"
              options={[
              { value: '', label: 'All Departments' },
              { value: 'teaching', label: 'Teaching' },
              { value: 'admin', label: 'Administration' },
              { value: 'it', label: 'IT Department' }]
              }
              className="w-48" />

          </div>
        </div>

        {/* Success Message */}
        {successMessage &&
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5" />
                <p className="text-emerald-800">{successMessage}</p>
              </div>
              <button onClick={() => setSuccessMessage(null)}>
                <XCircleIcon className="w-5 h-5 text-emerald-600" />
              </button>
            </div>
          </div>
        }

        {/* Error Message */}
        {errorMessage &&
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-red-800">{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)}>
                <XCircleIcon className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        }

        {/* Current Status Card */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                Current Payroll Status
              </h3>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant={getStatusBadgeVariant(currentPayrollData.currentStatus)} className="text-sm">
                  {currentPayrollData.currentStatus}
                </Badge>
                {currentPayrollData.isLocked &&
                <span className="flex items-center gap-1 text-xs text-indigo-700">
                    <LockIcon className="w-3 h-3" />
                    Locked
                  </span>
                }
              </div>
              <div className="space-y-1 text-sm text-indigo-700">
                <p>
                  <span className="font-medium">{currentPayrollData.employeesImpacted}</span> employees impacted
                </p>
                <p>
                  Total Amount: <span className="font-medium">₹{currentPayrollData.totalAmount.toLocaleString()}</span>
                </p>
                <p>
                  Department: <span className="font-medium">{DEPARTMENT_LABELS[department || 'all']}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {currentPayrollData.currentStatus !== 'Released' &&
              <Button
                variant="primary"
                leftIcon={<ChevronRightIcon className="w-4 h-4" />}
                onClick={progressToNextStage}>

                  Progress to Next Stage
                </Button>
              }
              {currentPayrollData.currentStatus === 'Draft Created' &&
              <Button
                variant="secondary"
                leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                onClick={openReprocessModal}>

                  Process Payroll
                </Button>
              }
              <Button
                variant="danger"
                leftIcon={<RotateCcwIcon className="w-4 h-4" />}
                onClick={openReversalModal}
                disabled={!canReverse}>

                Re-process Payroll
              </Button>
            </div>
          </div>
        </div>

        {/* Payroll History Timeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-slate-700">
              Payroll Processing History
            </h3>
            <span className="text-xs text-slate-500">
              Click on any stage to view details
            </span>
          </div>
          <div className="space-y-6">
            {currentPayrollData.history.map((item, index) =>
            <div
              key={item.id}
              className="flex items-start gap-4 relative cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-2 rounded-lg transition-colors"
              onClick={() => viewHistoryDetail(item)}>

                {/* Connector Line */}
                {index < currentPayrollData.history.length - 1 &&
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-slate-200" />
              }

                {/* Icon */}
                <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                item.status === 'Current' ?
                'bg-indigo-100 ring-4 ring-indigo-50' :
                item.status === 'Reversed' ?
                'bg-amber-100' :
                'bg-slate-100'}`
                }>

                  {getStageIcon(item)}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-semibold text-slate-900">
                      {item.stage}
                    </h4>
                    <div className="flex items-center gap-2">
                      {item.status === 'Current' &&
                    <Badge variant="info" className="text-xs">
                          Current Stage
                        </Badge>
                    }
                      {item.status === 'Reversed' &&
                    <Badge variant="warning" className="text-xs">
                          Reversed
                        </Badge>
                    }
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      {new Date(item.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}{' '}
                      at {item.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3" />
                      {item.user}
                    </span>
                  </div>
                  {item.notes &&
                <p className="text-xs text-slate-600 mt-1 italic">{item.notes}</p>
                }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reversal Confirmation Modal */}
        <Modal
          isOpen={showReversalModal}
          onClose={closeReversalModal}
          title="Confirm Payroll Reversal"
          size="md">

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  Warning: Critical Action
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Reversing payroll will undo all processing for {month}. This
                  will affect {currentPayrollData.employeesImpacted} employees. All payslips will
                  be invalidated and the process will need to be run again.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Month:</span>
                <span className="font-semibold text-slate-900">{month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Department:</span>
                <span className="font-semibold text-slate-900">
                  {DEPARTMENT_LABELS[department || 'all']}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Employees Impacted:</span>
                <span className="font-semibold text-slate-900">
                  {currentPayrollData.employeesImpacted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Current Status:</span>
                <Badge variant={getStatusBadgeVariant(currentPayrollData.currentStatus)}>
                  {currentPayrollData.currentStatus}
                </Badge>
              </div>
            </div>

            <Select
              label="Reverse To Stage"
              value={targetStage}
              onChange={(val) => setTargetStage(val as PayrollStage)}
              options={availableReversalStages.map((stage) => ({
                value: stage,
                label: stage
              }))} />


            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="text-sm text-amber-800">After Reversal:</span>
              <Badge variant="warning">{targetStage}</Badge>
            </div>

            <Textarea
              label="Reversal Reason (Required)"
              placeholder="Enter detailed reason for reversal (minimum 10 characters)..."
              rows={4}
              value={reversalReason}
              onChange={(e) => {
                setReversalReason(e.target.value);
                setReversalError(null);
              }} />


            {reversalError &&
            <p className="text-sm text-red-600">{reversalError}</p>
            }

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={closeReversalModal} disabled={reversalLoading}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={reversalLoading}
                leftIcon={
                reversalLoading ?
                <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

                <RotateCcwIcon className="w-4 h-4" />

                }
                onClick={performReversal}>

                {reversalLoading ? 'Processing...' : 'Confirm Reversal'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Reprocess Modal */}
        <Modal
          isOpen={showReprocessModal}
          onClose={closeReprocessModal}
          title="Reprocess Payroll"
          size="lg">

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Month:</span>
                <span className="font-semibold text-slate-900">{month}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Department:</span>
                <span className="font-semibold text-slate-900">
                  {DEPARTMENT_LABELS[department || 'all']}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Employees:</span>
                <span className="font-semibold text-slate-900">
                  {currentPayrollData.employeesImpacted}
                </span>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700">Processing Steps</h4>
              {reprocessSteps.map((step, index) =>
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                step.status === 'completed' ?
                'bg-emerald-50 border-emerald-200' :
                step.status === 'in-progress' ?
                'bg-indigo-50 border-indigo-200' :
                step.status === 'error' ?
                'bg-red-50 border-red-200' :
                'bg-slate-50 border-slate-200'}`
                }>

                  <div className="flex-shrink-0">
                    {step.status === 'completed' &&
                  <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                  }
                    {step.status === 'in-progress' &&
                  <RefreshCwIcon className="w-5 h-5 text-indigo-600 animate-spin" />
                  }
                    {step.status === 'error' &&
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  }
                    {step.status === 'pending' &&
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  }
                  </div>
                  <div className="flex-1">
                    <p
                    className={`text-sm font-medium ${
                    step.status === 'completed' ?
                    'text-emerald-800' :
                    step.status === 'in-progress' ?
                    'text-indigo-800' :
                    step.status === 'error' ?
                    'text-red-800' :
                    'text-slate-600'}`
                    }>

                      {step.name}
                    </p>
                    {step.errorMessage &&
                  <p className="text-xs text-red-600 mt-1">{step.errorMessage}</p>
                  }
                  </div>
                  <div className="flex-shrink-0 text-xs text-slate-500">
                    {step.startTime && step.endTime &&
                  <span>
                        {((step.endTime.getTime() - step.startTime.getTime()) / 1000).toFixed(1)}s
                      </span>
                  }
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Progress</span>
                <span>
                  {reprocessSteps.filter((s) => s.status === 'completed').length} / {reprocessSteps.length}
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{
                    width: `${reprocessSteps.filter((s) => s.status === 'completed').length / reprocessSteps.length * 100}%`
                  }} />

              </div>
            </div>

            {reprocessComplete &&
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">
                    Processing Complete!
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    All steps completed successfully. Click "Finalize" to update the payroll status.
                  </p>
                </div>
              </div>
            }

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <Button variant="outline" onClick={closeReprocessModal}>
                {reprocessComplete ? 'Close' : 'Cancel'}
              </Button>
              {!isReprocessing && !reprocessComplete &&
              <Button
                variant="primary"
                leftIcon={<PlayIcon className="w-4 h-4" />}
                onClick={startReprocessing}>

                  Start Processing
                </Button>
              }
              {isReprocessing && !reprocessPaused &&
              <Button
                variant="secondary"
                leftIcon={<PauseIcon className="w-4 h-4" />}
                onClick={pauseReprocessing}>

                  Pause
                </Button>
              }
              {reprocessPaused && !reprocessComplete &&
              <>
                  {reprocessSteps.some((s) => s.status === 'error') &&
                <Button
                  variant="danger"
                  leftIcon={<RefreshCwIcon className="w-4 h-4" />}
                  onClick={retryFailedStep}>

                      Retry Failed Step
                    </Button>
                }
                  <Button
                  variant="primary"
                  leftIcon={<PlayIcon className="w-4 h-4" />}
                  onClick={resumeReprocessing}>

                    Resume
                  </Button>
                </>
              }
              {reprocessComplete &&
              <Button
                variant="primary"
                leftIcon={<CheckCircleIcon className="w-4 h-4" />}
                onClick={finalizeReprocessing}>

                  Finalize
                </Button>
              }
            </div>
          </div>
        </Modal>

        {/* History Detail Modal */}
        <Modal
          isOpen={showHistoryDetailModal}
          onClose={() => setShowHistoryDetailModal(false)}
          title="Stage Details"
          size="sm">

          {selectedHistoryItem &&
          <div className="space-y-4">
              <div className="bg-slate-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Stage:</span>
                  <span className="font-semibold text-slate-900">{selectedHistoryItem.stage}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(selectedHistoryItem.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Time:</span>
                  <span className="font-semibold text-slate-900">{selectedHistoryItem.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Processed By:</span>
                  <span className="font-semibold text-slate-900">{selectedHistoryItem.user}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge
                  variant={
                  selectedHistoryItem.status === 'Current' ?
                  'info' :
                  selectedHistoryItem.status === 'Reversed' ?
                  'warning' :
                  'success'
                  }>

                    {selectedHistoryItem.status}
                  </Badge>
                </div>
                {selectedHistoryItem.notes &&
              <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-600 block mb-1">Notes:</span>
                    <p className="text-slate-900">{selectedHistoryItem.notes}</p>
                  </div>
              }
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowHistoryDetailModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          }
        </Modal>

        {/* Reversal History Modal */}
        <Modal
          isOpen={showReversalHistoryModal}
          onClose={() => setShowReversalHistoryModal(false)}
          title="Reversal History"
          size="lg">

          <div className="space-y-4">
            {reversalHistory.length === 0 ?
            <p className="text-slate-600 text-center py-8">No reversal history available.</p> :

            <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {reversalHistory.map((record) =>
                <div
                  key={record.id}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">

                      <div className="flex items-start justify-between">
                        <span className="font-mono text-xs text-slate-500">{record.id}</span>
                        <span className="text-xs text-slate-500">
                          {record.timestamp.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="danger">{record.reversedFrom}</Badge>
                        <span className="text-slate-400">→</span>
                        <Badge variant="warning">{record.reversedTo}</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-slate-600">Month:</span>{' '}
                          <span className="font-medium">{record.month}</span>
                        </p>
                        <p>
                          <span className="text-slate-600">Department:</span>{' '}
                          <span className="font-medium">{record.department}</span>
                        </p>
                        <p>
                          <span className="text-slate-600">Employees:</span>{' '}
                          <span className="font-medium">{record.employeesAffected}</span>
                        </p>
                        <p>
                          <span className="text-slate-600">By:</span>{' '}
                          <span className="font-medium">{record.reversedBy}</span>
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-xs text-slate-600">Reason:</span>
                        <p className="text-sm text-slate-900 mt-1">{record.reason}</p>
                      </div>
                    </div>
                )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}
                  onClick={exportReversalReport}>

                    Export Report
                  </Button>
                  <Button variant="outline" onClick={() => setShowReversalHistoryModal(false)}>
                    Close
                  </Button>
                </div>
              </>
            }
          </div>
        </Modal>
      </div>
    </div>);

}