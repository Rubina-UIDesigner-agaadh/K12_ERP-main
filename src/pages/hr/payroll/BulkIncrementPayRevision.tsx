import React, { useState, useMemo, useCallback } from 'react';
import {
  TrendingUpIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  XCircleIcon,
  AlertCircleIcon,
  DownloadIcon,
  EditIcon,
  SaveIcon,
  XIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';

// Types
interface Employee {
  id: number;
  empName: string;
  department: string;
  designation: string;
  currentSalary: number;
}

interface RevisionPreview extends Employee {
  increment: number;
  revisedSalary: number;
  difference: number;
  isSelected: boolean;
  isEditing: boolean;
  customIncrement: number | null;
}

interface RevisionHistory {
  id: string;
  timestamp: Date;
  employeeCount: number;
  totalImpact: number;
  effectiveDate: string;
  incrementType: string;
  incrementValue: string;
}

// Sample employee data with department and designation
const EMPLOYEES: Employee[] = [
{
  id: 1,
  empName: 'Rajesh Kumar',
  department: 'teaching',
  designation: 'teacher',
  currentSalary: 40000
},
{
  id: 2,
  empName: 'Priya Sharma',
  department: 'admin',
  designation: 'assistant',
  currentSalary: 32000
},
{
  id: 3,
  empName: 'Amit Patel',
  department: 'it',
  designation: 'manager',
  currentSalary: 48000
},
{
  id: 4,
  empName: 'Sneha Reddy',
  department: 'teaching',
  designation: 'teacher',
  currentSalary: 35300
},
{
  id: 5,
  empName: 'Vikram Singh',
  department: 'admin',
  designation: 'assistant',
  currentSalary: 24000
},
{
  id: 6,
  empName: 'Anita Desai',
  department: 'teaching',
  designation: 'manager',
  currentSalary: 55000
},
{
  id: 7,
  empName: 'Mohammed Ali',
  department: 'it',
  designation: 'assistant',
  currentSalary: 28000
},
{
  id: 8,
  empName: 'Kavita Nair',
  department: 'admin',
  designation: 'manager',
  currentSalary: 52000
},
{
  id: 9,
  empName: 'Suresh Iyer',
  department: 'it',
  designation: 'teacher',
  currentSalary: 45000
},
{
  id: 10,
  empName: 'Deepa Menon',
  department: 'teaching',
  designation: 'assistant',
  currentSalary: 30000
},
{
  id: 11,
  empName: 'Rahul Verma',
  department: 'admin',
  designation: 'teacher',
  currentSalary: 42000
},
{
  id: 12,
  empName: 'Sunita Gupta',
  department: 'it',
  designation: 'manager',
  currentSalary: 58000
}];


// Department and Designation labels
const DEPARTMENT_LABELS: Record<string, string> = {
  teaching: 'Teaching',
  admin: 'Administration',
  it: 'IT Department'
};

const DESIGNATION_LABELS: Record<string, string> = {
  teacher: 'Teacher',
  manager: 'Manager',
  assistant: 'Assistant'
};

export function BulkIncrementPayRevision() {
  // Form state
  const [effectiveDate, setEffectiveDate] = useState('2025-06-01');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [incrementType, setIncrementType] = useState('percentage');
  const [incrementValue, setIncrementValue] = useState('10');

  // Preview state
  const [revisionPreview, setRevisionPreview] = useState<RevisionPreview[]>([]);
  const [isPreviewGenerated, setIsPreviewGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string | null>(null);

  // Error and validation state
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Editing state for individual rows
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [tempEditValue, setTempEditValue] = useState<string>('');

  // History state
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistory[]>([]);

  // Validate form inputs
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!effectiveDate) {
      errors.effectiveDate = 'Effective date is required';
    } else {
      const selectedDate = new Date(effectiveDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.effectiveDate = 'Effective date cannot be in the past';
      }
    }

    const value = parseFloat(incrementValue);
    if (isNaN(value) || value <= 0) {
      errors.incrementValue = 'Please enter a valid increment value greater than 0';
    }

    if (incrementType === 'percentage' && value > 100) {
      errors.incrementValue = 'Percentage cannot exceed 100%';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [effectiveDate, incrementValue, incrementType]);

  // Calculate increment for an employee
  const calculateIncrement = useCallback(
    (currentSalary: number, customIncrement?: number | null): number => {
      if (customIncrement !== null && customIncrement !== undefined) {
        return customIncrement;
      }
      const value = parseFloat(incrementValue) || 0;
      if (incrementType === 'percentage') {
        return Math.round(currentSalary * (value / 100));
      }
      return value;
    },
    [incrementType, incrementValue]
  );

  // Filter and calculate preview
  const generatePreview = useCallback(() => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call delay
    setTimeout(() => {
      try {
        // Filter employees based on department and designation
        let filteredEmployees = [...EMPLOYEES];

        if (department) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.department === department
          );
        }

        if (designation) {
          filteredEmployees = filteredEmployees.filter(
            (emp) => emp.designation === designation
          );
        }

        if (filteredEmployees.length === 0) {
          setError('No employees found matching the selected criteria');
          setIsLoading(false);
          return;
        }

        // Calculate revisions for filtered employees
        const preview: RevisionPreview[] = filteredEmployees.map((emp) => {
          const increment = calculateIncrement(emp.currentSalary);
          return {
            ...emp,
            increment,
            revisedSalary: emp.currentSalary + increment,
            difference: increment,
            isSelected: true,
            isEditing: false,
            customIncrement: null
          };
        });

        setRevisionPreview(preview);
        setIsPreviewGenerated(true);
        setIsConfirmed(false);
        setShowSuccessMessage(false);
        setConfirmationId(null);
        setIsLoading(false);
      } catch (err) {
        setError('An error occurred while generating preview');
        setIsLoading(false);
      }
    }, 500);
  }, [department, designation, calculateIncrement, validateForm]);

  // Toggle employee selection
  const toggleEmployeeSelection = useCallback(
    (employeeId: number) => {
      if (isConfirmed) return;

      setRevisionPreview((prev) =>
      prev.map((emp) =>
      emp.id === employeeId ? { ...emp, isSelected: !emp.isSelected } : emp
      )
      );
    },
    [isConfirmed]
  );

  // Select/Deselect all employees
  const toggleSelectAll = useCallback(() => {
    if (isConfirmed) return;

    const allSelected = revisionPreview.every((emp) => emp.isSelected);
    setRevisionPreview((prev) =>
    prev.map((emp) => ({ ...emp, isSelected: !allSelected }))
    );
  }, [revisionPreview, isConfirmed]);

  // Start editing individual row increment
  const startEditingRow = useCallback(
    (employeeId: number, currentIncrement: number) => {
      if (isConfirmed) return;
      setEditingRowId(employeeId);
      setTempEditValue(currentIncrement.toString());
    },
    [isConfirmed]
  );

  // Save individual row edit
  const saveRowEdit = useCallback(
    (employeeId: number) => {
      const newIncrement = parseFloat(tempEditValue);
      if (isNaN(newIncrement) || newIncrement < 0) {
        setError('Please enter a valid increment value');
        return;
      }

      setRevisionPreview((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            customIncrement: newIncrement,
            increment: newIncrement,
            revisedSalary: emp.currentSalary + newIncrement,
            difference: newIncrement,
            isEditing: false
          };
        }
        return emp;
      })
      );
      setEditingRowId(null);
      setTempEditValue('');
      setError(null);
    },
    [tempEditValue]
  );

  // Cancel row edit
  const cancelRowEdit = useCallback(() => {
    setEditingRowId(null);
    setTempEditValue('');
  }, []);

  // Reset individual row to calculated value
  const resetRowToCalculated = useCallback(
    (employeeId: number) => {
      setRevisionPreview((prev) =>
      prev.map((emp) => {
        if (emp.id === employeeId) {
          const increment = calculateIncrement(emp.currentSalary, null);
          return {
            ...emp,
            customIncrement: null,
            increment,
            revisedSalary: emp.currentSalary + increment,
            difference: increment
          };
        }
        return emp;
      })
      );
    },
    [calculateIncrement]
  );

  // Confirm revision
  const confirmRevision = useCallback(() => {
    const selectedEmployees = revisionPreview.filter((emp) => emp.isSelected);

    if (selectedEmployees.length === 0) {
      setError('Please select at least one employee for revision');
      return;
    }

    setConfirmationLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      const newConfirmationId = `REV-${Date.now()}`;

      // Create history entry
      const historyEntry: RevisionHistory = {
        id: newConfirmationId,
        timestamp: new Date(),
        employeeCount: selectedEmployees.length,
        totalImpact: selectedEmployees.reduce((sum, emp) => sum + emp.difference, 0),
        effectiveDate,
        incrementType,
        incrementValue
      };

      setRevisionHistory((prev) => [historyEntry, ...prev]);

      // Log the confirmed data (this would be sent to API in production)
      console.log('Confirmed revisions:', {
        confirmationId: newConfirmationId,
        effectiveDate,
        incrementType,
        incrementValue,
        employees: selectedEmployees.map((emp) => ({
          id: emp.id,
          name: emp.empName,
          currentSalary: emp.currentSalary,
          increment: emp.increment,
          revisedSalary: emp.revisedSalary,
          customIncrement: emp.customIncrement
        }))
      });

      setConfirmationId(newConfirmationId);
      setIsConfirmed(true);
      setConfirmationLoading(false);
      setShowSuccessMessage(true);

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 10000);
    }, 1500);
  }, [revisionPreview, effectiveDate, incrementType, incrementValue]);

  // Reset form completely
  const resetForm = useCallback(() => {
    setEffectiveDate('2025-06-01');
    setDepartment('');
    setDesignation('');
    setIncrementType('percentage');
    setIncrementValue('10');
    setRevisionPreview([]);
    setIsPreviewGenerated(false);
    setIsConfirmed(false);
    setShowSuccessMessage(false);
    setError(null);
    setValidationErrors({});
    setConfirmationId(null);
    setEditingRowId(null);
    setTempEditValue('');
  }, []);

  // Start new revision (keeps history)
  const startNewRevision = useCallback(() => {
    setRevisionPreview([]);
    setIsPreviewGenerated(false);
    setIsConfirmed(false);
    setShowSuccessMessage(false);
    setError(null);
    setValidationErrors({});
    setConfirmationId(null);
    setEditingRowId(null);
    setTempEditValue('');
  }, []);

  // Export preview data as CSV
  const exportToCSV = useCallback(() => {
    const dataToExport = isConfirmed ?
    revisionPreview.filter((emp) => emp.isSelected) :
    revisionPreview;

    if (dataToExport.length === 0) {
      setError('No data to export');
      return;
    }

    const headers = [
    'Employee ID',
    'Employee Name',
    'Department',
    'Designation',
    'Current Salary',
    'Increment',
    'Revised Salary',
    'Difference'];


    const rows = dataToExport.map((emp) => [
    emp.id,
    emp.empName,
    DEPARTMENT_LABELS[emp.department] || emp.department,
    DESIGNATION_LABELS[emp.designation] || emp.designation,
    emp.currentSalary,
    emp.increment,
    emp.revisedSalary,
    emp.difference]
    );

    const csvContent = [
    `Effective Date: ${effectiveDate}`,
    `Increment Type: ${incrementType === 'percentage' ? 'Percentage' : 'Flat Amount'}`,
    `Increment Value: ${incrementValue}${incrementType === 'percentage' ? '%' : ''}`,
    `Generated On: ${new Date().toLocaleString()}`,
    confirmationId ? `Confirmation ID: ${confirmationId}` : '',
    '',
    headers.join(','),
    ...rows.map((row) => row.join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salary_revision_${effectiveDate}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [revisionPreview, isConfirmed, effectiveDate, incrementType, incrementValue, confirmationId]);

  // Export as JSON
  const exportToJSON = useCallback(() => {
    const dataToExport = isConfirmed ?
    revisionPreview.filter((emp) => emp.isSelected) :
    revisionPreview;

    if (dataToExport.length === 0) {
      setError('No data to export');
      return;
    }

    const exportData = {
      metadata: {
        effectiveDate,
        incrementType,
        incrementValue,
        generatedOn: new Date().toISOString(),
        confirmationId: confirmationId || undefined,
        totalEmployees: dataToExport.length,
        totalImpact: dataToExport.reduce((sum, emp) => sum + emp.difference, 0)
      },
      employees: dataToExport.map((emp) => ({
        id: emp.id,
        name: emp.empName,
        department: emp.department,
        departmentLabel: DEPARTMENT_LABELS[emp.department] || emp.department,
        designation: emp.designation,
        designationLabel: DESIGNATION_LABELS[emp.designation] || emp.designation,
        currentSalary: emp.currentSalary,
        increment: emp.increment,
        revisedSalary: emp.revisedSalary,
        hasCustomIncrement: emp.customIncrement !== null
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salary_revision_${effectiveDate}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }, [revisionPreview, isConfirmed, effectiveDate, incrementType, incrementValue, confirmationId]);

  // Calculate totals for selected employees
  const { totalImpact, employeesAffected, averageIncrement } = useMemo(() => {
    const selectedEmployees = revisionPreview.filter((emp) => emp.isSelected);
    const total = selectedEmployees.reduce((sum, emp) => sum + emp.difference, 0);
    const count = selectedEmployees.length;
    return {
      totalImpact: total,
      employeesAffected: count,
      averageIncrement: count > 0 ? Math.round(total / count) : 0
    };
  }, [revisionPreview]);

  // Check if all employees are selected
  const allSelected =
  revisionPreview.length > 0 && revisionPreview.every((emp) => emp.isSelected);
  const someSelected =
  revisionPreview.some((emp) => emp.isSelected) && !allSelected;

  // Check if any row has custom increment
  const hasCustomIncrements = revisionPreview.some(
    (emp) => emp.customIncrement !== null
  );

  // Get minimum effective date (today)
  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Bulk Increment / Pay Revision
            </h1>
            <p className="text-sm text-slate-600">
              Apply salary increments to multiple employees at once
            </p>
          </div>
          <div className="flex gap-2">
            {isPreviewGenerated && !isConfirmed &&
            <Button
              variant="secondary"
              onClick={resetForm}
              leftIcon={<RefreshCwIcon className="w-4 h-4" />}>

                Reset All
              </Button>
            }
            {isConfirmed &&
            <Button
              variant="primary"
              onClick={startNewRevision}
              leftIcon={<TrendingUpIcon className="w-4 h-4" />}>

                New Revision
              </Button>
            }
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage &&
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="font-medium text-emerald-800">
                    Revision Confirmed Successfully!
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    {employeesAffected} employee(s) salary has been revised effective
                    from{' '}
                    {new Date(effectiveDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                  </p>
                  {confirmationId &&
                <p className="text-xs text-emerald-500 mt-2">
                      Confirmation ID: {confirmationId}
                    </p>
                }
                </div>
              </div>
              <button
              onClick={() => setShowSuccessMessage(false)}
              className="text-emerald-600 hover:text-emerald-800">

                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        }

        {/* Error Message */}
        {error &&
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
              <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800">

                <XCircleIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        }

        {/* Top Controls */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Revision Parameters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <Input
                label="Effective Date"
                type="date"
                value={effectiveDate}
                onChange={(e) => {
                  setEffectiveDate(e.target.value);
                  setValidationErrors((prev) => ({ ...prev, effectiveDate: '' }));
                }}
                disabled={isConfirmed}
                min={minDate} />

              {validationErrors.effectiveDate &&
              <p className="text-xs text-red-500 mt-1">
                  {validationErrors.effectiveDate}
                </p>
              }
            </div>
            <Select
              label="Department"
              value={department}
              onChange={(val) => {
                setDepartment(val as string);
                setIsPreviewGenerated(false);
                setRevisionPreview([]);
              }}
              placeholder="All Departments"
              disabled={isConfirmed}
              options={[
              { value: '', label: 'All Departments' },
              { value: 'teaching', label: 'Teaching' },
              { value: 'admin', label: 'Administration' },
              { value: 'it', label: 'IT Department' }]
              } />

            <Select
              label="Designation"
              value={designation}
              onChange={(val) => {
                setDesignation(val as string);
                setIsPreviewGenerated(false);
                setRevisionPreview([]);
              }}
              placeholder="All Designations"
              disabled={isConfirmed}
              options={[
              { value: '', label: 'All Designations' },
              { value: 'teacher', label: 'Teacher' },
              { value: 'manager', label: 'Manager' },
              { value: 'assistant', label: 'Assistant' }]
              } />

          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Increment Type"
              value={incrementType}
              onChange={(val) => {
                setIncrementType(val as string);
                setIsPreviewGenerated(false);
                setRevisionPreview([]);
                setValidationErrors((prev) => ({ ...prev, incrementValue: '' }));
              }}
              disabled={isConfirmed}
              options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' }]
              } />

            <div>
              <Input
                label={
                incrementType === 'percentage' ?
                'Increment %' :
                'Increment Amount (₹)'
                }
                type="number"
                value={incrementValue}
                onChange={(e) => {
                  setIncrementValue(e.target.value);
                  setIsPreviewGenerated(false);
                  setRevisionPreview([]);
                  setValidationErrors((prev) => ({ ...prev, incrementValue: '' }));
                }}
                placeholder={
                incrementType === 'percentage' ? 'e.g., 10' : 'e.g., 5000'
                }
                disabled={isConfirmed}
                min="0"
                step={incrementType === 'percentage' ? '0.5' : '100'} />

              {validationErrors.incrementValue &&
              <p className="text-xs text-red-500 mt-1">
                  {validationErrors.incrementValue}
                </p>
              }
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              variant="primary"
              leftIcon={
              isLoading ?
              <RefreshCwIcon className="w-4 h-4 animate-spin" /> :

              <TrendingUpIcon className="w-4 h-4" />

              }
              onClick={generatePreview}
              disabled={isLoading || isConfirmed}>

              {isLoading ? 'Generating Preview...' : 'Preview Changes'}
            </Button>
            {isPreviewGenerated && !isConfirmed && hasCustomIncrements &&
            <Button
              variant="secondary"
              onClick={() => {
                // Recalculate all rows
                setRevisionPreview((prev) =>
                prev.map((emp) => {
                  const increment = calculateIncrement(emp.currentSalary, null);
                  return {
                    ...emp,
                    customIncrement: null,
                    increment,
                    revisedSalary: emp.currentSalary + increment,
                    difference: increment
                  };
                })
                );
              }}>

                Reset All Increments
              </Button>
            }
          </div>
        </div>

        {/* Preview Table */}
        {isPreviewGenerated &&
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-700">
                  Revision Preview
                </h3>
                {isConfirmed &&
              <span className="text-xs font-normal text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
                    Confirmed
                  </span>
              }
                {hasCustomIncrements && !isConfirmed &&
              <span className="text-xs font-normal text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                    Custom Values Applied
                  </span>
              }
              </div>
              <div className="flex items-center gap-3">
                {!isConfirmed &&
              <span className="text-sm text-slate-600">
                    {revisionPreview.filter((e) => e.isSelected).length} of{' '}
                    {revisionPreview.length} selected
                  </span>
              }
                <div className="flex gap-2">
                  <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}
                  onClick={exportToCSV}>

                    CSV
                  </Button>
                  <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<DownloadIcon className="w-4 h-4" />}
                  onClick={exportToJSON}>

                    JSON
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {!isConfirmed &&
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = someSelected;
                      }}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />

                      </th>
                  }
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                      Current Salary
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                      Increment
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right bg-emerald-50">
                      Revised Salary
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                      Difference
                    </th>
                    {!isConfirmed &&
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                        Actions
                      </th>
                  }
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {revisionPreview.map((row) => {
                  if (isConfirmed && !row.isSelected) return null;

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50 transition-colors ${
                      !row.isSelected && !isConfirmed ? 'opacity-50 bg-slate-25' : ''}`
                      }>

                        {!isConfirmed &&
                      <td className="py-3 px-4">
                            <input
                          type="checkbox"
                          checked={row.isSelected}
                          onChange={() => toggleEmployeeSelection(row.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />

                          </td>
                      }
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {row.empName}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {DEPARTMENT_LABELS[row.department] || row.department}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {DESIGNATION_LABELS[row.designation] || row.designation}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          ₹{row.currentSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {editingRowId === row.id ?
                        <div className="flex items-center justify-end gap-2">
                              <input
                            type="number"
                            value={tempEditValue}
                            onChange={(e) => setTempEditValue(e.target.value)}
                            className="w-24 px-2 py-1 text-right border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRowEdit(row.id);
                              if (e.key === 'Escape') cancelRowEdit();
                            }} />

                              <button
                            onClick={() => saveRowEdit(row.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-800">

                                <SaveIcon className="w-4 h-4" />
                              </button>
                              <button
                            onClick={cancelRowEdit}
                            className="p-1 text-slate-400 hover:text-slate-600">

                                <XIcon className="w-4 h-4" />
                              </button>
                            </div> :

                        <span
                          className={`font-medium ${
                          row.customIncrement !== null ?
                          'text-amber-600' :
                          'text-emerald-600'}`
                          }>

                              +₹{row.increment.toLocaleString()}
                              {row.customIncrement === null &&
                          incrementType === 'percentage' &&
                          <span className="text-xs text-slate-500 ml-1">
                                    ({incrementValue}%)
                                  </span>
                          }
                              {row.customIncrement !== null &&
                          <span className="text-xs text-amber-500 ml-1">
                                  (custom)
                                </span>
                          }
                            </span>
                        }
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900 bg-emerald-50">
                          ₹{row.revisedSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-semibold">
                          +₹{row.difference.toLocaleString()}
                        </td>
                        {!isConfirmed &&
                      <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {editingRowId !== row.id &&
                          <button
                            onClick={() =>
                            startEditingRow(row.id, row.increment)
                            }
                            className="p-1 text-slate-400 hover:text-indigo-600"
                            title="Edit increment">

                                  <EditIcon className="w-4 h-4" />
                                </button>
                          }
                              {row.customIncrement !== null &&
                          editingRowId !== row.id &&
                          <button
                            onClick={() => resetRowToCalculated(row.id)}
                            className="p-1 text-slate-400 hover:text-amber-600"
                            title="Reset to calculated value">

                                    <RefreshCwIcon className="w-4 h-4" />
                                  </button>
                          }
                            </div>
                          </td>
                      }
                      </tr>);

                })}
                </tbody>
                {/* Summary Row */}
                <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                  <tr className="font-semibold">
                    {!isConfirmed && <td className="py-3 px-4"></td>}
                    <td
                    className="py-3 px-4 text-slate-700"
                    colSpan={3}>

                      Total ({employeesAffected} employees)
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">
                      ₹
                      {revisionPreview.
                    filter((e) => e.isSelected).
                    reduce((sum, e) => sum + e.currentSalary, 0).
                    toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600">
                      +₹{totalImpact.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-900 bg-emerald-50">
                      ₹
                      {revisionPreview.
                    filter((e) => e.isSelected).
                    reduce((sum, e) => sum + e.revisedSalary, 0).
                    toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600">
                      +₹{totalImpact.toLocaleString()}
                    </td>
                    {!isConfirmed && <td className="py-3 px-4"></td>}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        }

        {/* Confirmation Section */}
        {isPreviewGenerated &&
        <div
          className={`border rounded-xl p-6 sticky bottom-4 ${
          isConfirmed ?
          'bg-emerald-50 border-emerald-200' :
          'bg-indigo-50 border-indigo-200'}`
          }>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div
                  className={`text-xs uppercase tracking-wide mb-1 ${
                  isConfirmed ? 'text-emerald-600' : 'text-indigo-600'}`
                  }>

                    Total Impact (Monthly)
                  </div>
                  <div
                  className={`text-2xl font-bold ${
                  isConfirmed ? 'text-emerald-900' : 'text-indigo-900'}`
                  }>

                    ₹{totalImpact.toLocaleString()}
                  </div>
                </div>
                <div
                className={`h-12 w-px ${
                isConfirmed ? 'bg-emerald-200' : 'bg-indigo-200'}`
                } />

                <div>
                  <div
                  className={`text-xs uppercase tracking-wide mb-1 ${
                  isConfirmed ? 'text-emerald-600' : 'text-indigo-600'}`
                  }>

                    Employees Affected
                  </div>
                  <div
                  className={`text-2xl font-bold ${
                  isConfirmed ? 'text-emerald-900' : 'text-indigo-900'}`
                  }>

                    {employeesAffected}
                  </div>
                </div>
                <div
                className={`h-12 w-px ${
                isConfirmed ? 'bg-emerald-200' : 'bg-indigo-200'}`
                } />

                <div>
                  <div
                  className={`text-xs uppercase tracking-wide mb-1 ${
                  isConfirmed ? 'text-emerald-600' : 'text-indigo-600'}`
                  }>

                    Avg. Increment
                  </div>
                  <div
                  className={`text-xl font-bold ${
                  isConfirmed ? 'text-emerald-900' : 'text-indigo-900'}`
                  }>

                    ₹{averageIncrement.toLocaleString()}
                  </div>
                </div>
                <div
                className={`h-12 w-px hidden lg:block ${
                isConfirmed ? 'bg-emerald-200' : 'bg-indigo-200'}`
                } />

                <div className="hidden lg:block">
                  <div
                  className={`text-xs uppercase tracking-wide mb-1 ${
                  isConfirmed ? 'text-emerald-600' : 'text-indigo-600'}`
                  }>

                    Effective Date
                  </div>
                  <div
                  className={`text-lg font-semibold ${
                  isConfirmed ? 'text-emerald-900' : 'text-indigo-900'}`
                  }>

                    {new Date(effectiveDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                  </div>
                </div>
              </div>
              {!isConfirmed ?
            <Button
              variant="primary"
              size="lg"
              leftIcon={
              confirmationLoading ?
              <RefreshCwIcon className="w-5 h-5 animate-spin" /> :

              <CheckCircleIcon className="w-5 h-5" />

              }
              onClick={confirmRevision}
              disabled={confirmationLoading || employeesAffected === 0}>

                  {confirmationLoading ? 'Confirming...' : 'Confirm Revision'}
                </Button> :

            <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-emerald-800 font-semibold">
                      Revision Confirmed
                    </div>
                    {confirmationId &&
                <div className="text-xs text-emerald-600">
                        ID: {confirmationId}
                      </div>
                }
                  </div>
                </div>
            }
            </div>
          </div>
        }

        {/* Revision History */}
        {revisionHistory.length > 0 &&
        <div className="mt-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-semibold text-slate-700">
                Recent Revision History (This Session)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Confirmation ID
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Effective Date
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                      Employees
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Increment
                    </th>
                    <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                      Total Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {revisionHistory.map((history) =>
                <tr
                  key={history.id}
                  className="hover:bg-slate-50">

                      <td className="py-3 px-4 font-mono text-xs text-slate-600">
                        {history.id}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {history.timestamp.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {new Date(history.effectiveDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        {history.employeeCount}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {history.incrementValue}
                        {history.incrementType === 'percentage' ? '%' : ' (Flat)'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                        ₹{history.totalImpact.toLocaleString()}
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>);

}