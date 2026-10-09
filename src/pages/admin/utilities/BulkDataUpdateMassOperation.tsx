import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Table } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { AlertTriangle, Play, RefreshCw, CheckCircle, XCircle, Loader2, History, Download, Upload } from 'lucide-react';

// Types
interface Student {
  id: number;
  name: string;
  admissionNo: string;
  class: string;
  section: string;
  house: string;
  transport: string;
  status: string;
  rollNo: number;
  fatherName: string;
  contact: string;
}

interface Employee {
  id: number;
  name: string;
  employeeId: string;
  department: string;
  designation: string;
  status: string;
  shift: string;
  reportingTo: string;
  location: string;
}

interface FeeRecord {
  id: number;
  name: string;
  studentId: string;
  feeType: string;
  amount: number;
  status: string;
  dueDate: string;
  discountType: string;
  paymentMode: string;
}

interface PreviewRecord {
  id: number;
  name: string;
  identifier: string;
  current: string;
  new: string;
  status: 'Pending' | 'Processing' | 'Success' | 'Failed';
  errorMessage?: string;
}

interface OperationHistory {
  id: number;
  timestamp: Date;
  entity: string;
  field: string;
  oldValue: string;
  newValue: string;
  recordsAffected: number;
  status: 'Completed' | 'Partial' | 'Failed';
  executedBy: string;
}

interface FieldOption {
  value: string;
  label: string;
}

interface ValueOption {
  value: string;
  label: string;
}

// Mock Data
const mockStudents: Student[] = [
{ id: 1, name: 'Rahul Sharma', admissionNo: 'ADM001', class: '10', section: 'A', house: 'Red', transport: 'Route 1', status: 'Active', rollNo: 1, fatherName: 'Rajesh Sharma', contact: '9876543210' },
{ id: 2, name: 'Priya Patel', admissionNo: 'ADM002', class: '10', section: 'A', house: 'Blue', transport: 'Route 2', status: 'Active', rollNo: 2, fatherName: 'Mahesh Patel', contact: '9876543211' },
{ id: 3, name: 'Amit Kumar', admissionNo: 'ADM003', class: '10', section: 'A', house: 'Green', transport: 'Route 1', status: 'Active', rollNo: 3, fatherName: 'Suresh Kumar', contact: '9876543212' },
{ id: 4, name: 'Sneha Gupta', admissionNo: 'ADM004', class: '10', section: 'A', house: 'Yellow', transport: 'Route 3', status: 'Active', rollNo: 4, fatherName: 'Ramesh Gupta', contact: '9876543213' },
{ id: 5, name: 'Vikram Singh', admissionNo: 'ADM005', class: '10', section: 'A', house: 'Red', transport: 'Route 2', status: 'Active', rollNo: 5, fatherName: 'Vijay Singh', contact: '9876543214' },
{ id: 6, name: 'Neha Verma', admissionNo: 'ADM006', class: '10', section: 'B', house: 'Blue', transport: 'Route 1', status: 'Active', rollNo: 1, fatherName: 'Anil Verma', contact: '9876543215' },
{ id: 7, name: 'Rohit Jain', admissionNo: 'ADM007', class: '10', section: 'B', house: 'Green', transport: 'Route 3', status: 'Inactive', rollNo: 2, fatherName: 'Manoj Jain', contact: '9876543216' },
{ id: 8, name: 'Kavita Mishra', admissionNo: 'ADM008', class: '9', section: 'A', house: 'Yellow', transport: 'Route 2', status: 'Active', rollNo: 1, fatherName: 'Prakash Mishra', contact: '9876543217' },
{ id: 9, name: 'Arjun Reddy', admissionNo: 'ADM009', class: '9', section: 'A', house: 'Red', transport: 'Route 1', status: 'Active', rollNo: 2, fatherName: 'Krishna Reddy', contact: '9876543218' },
{ id: 10, name: 'Pooja Nair', admissionNo: 'ADM010', class: '9', section: 'B', house: 'Blue', transport: 'Route 3', status: 'Active', rollNo: 1, fatherName: 'Gopalan Nair', contact: '9876543219' },
{ id: 11, name: 'Sanjay Mehta', admissionNo: 'ADM011', class: '8', section: 'A', house: 'Green', transport: 'Route 2', status: 'Active', rollNo: 1, fatherName: 'Dinesh Mehta', contact: '9876543220' },
{ id: 12, name: 'Anita Rao', admissionNo: 'ADM012', class: '8', section: 'A', house: 'Yellow', transport: 'Route 1', status: 'Active', rollNo: 2, fatherName: 'Venkat Rao', contact: '9876543221' }];


const mockEmployees: Employee[] = [
{ id: 1, name: 'Dr. Suresh Menon', employeeId: 'EMP001', department: 'Science', designation: 'Senior Teacher', status: 'Active', shift: 'Morning', reportingTo: 'Principal', location: 'Main Campus' },
{ id: 2, name: 'Ms. Lakshmi Iyer', employeeId: 'EMP002', department: 'Mathematics', designation: 'Teacher', status: 'Active', shift: 'Morning', reportingTo: 'HOD Math', location: 'Main Campus' },
{ id: 3, name: 'Mr. Rajesh Khanna', employeeId: 'EMP003', department: 'English', designation: 'Teacher', status: 'Active', shift: 'Morning', reportingTo: 'HOD English', location: 'Main Campus' },
{ id: 4, name: 'Mrs. Geeta Sharma', employeeId: 'EMP004', department: 'Hindi', designation: 'Senior Teacher', status: 'Active', shift: 'Morning', reportingTo: 'Principal', location: 'Branch Campus' },
{ id: 5, name: 'Mr. Arun Nair', employeeId: 'EMP005', department: 'Science', designation: 'Lab Assistant', status: 'Active', shift: 'Afternoon', reportingTo: 'HOD Science', location: 'Main Campus' },
{ id: 6, name: 'Ms. Priyanka Das', employeeId: 'EMP006', department: 'Administration', designation: 'Clerk', status: 'Active', shift: 'Morning', reportingTo: 'Admin Head', location: 'Main Campus' },
{ id: 7, name: 'Mr. Vinod Kumar', employeeId: 'EMP007', department: 'Accounts', designation: 'Accountant', status: 'On Leave', shift: 'Morning', reportingTo: 'Finance Head', location: 'Main Campus' },
{ id: 8, name: 'Mrs. Sunita Devi', employeeId: 'EMP008', department: 'Support', designation: 'Attendant', status: 'Active', shift: 'Morning', reportingTo: 'Admin Head', location: 'Branch Campus' }];


const mockFeeRecords: FeeRecord[] = [
{ id: 1, name: 'Rahul Sharma - Tuition Fee', studentId: 'ADM001', feeType: 'Tuition', amount: 25000, status: 'Pending', dueDate: '2024-02-15', discountType: 'None', paymentMode: 'Online' },
{ id: 2, name: 'Priya Patel - Tuition Fee', studentId: 'ADM002', feeType: 'Tuition', amount: 25000, status: 'Pending', dueDate: '2024-02-15', discountType: 'Staff', paymentMode: 'Cash' },
{ id: 3, name: 'Amit Kumar - Transport Fee', studentId: 'ADM003', feeType: 'Transport', amount: 8000, status: 'Overdue', dueDate: '2024-01-15', discountType: 'None', paymentMode: 'Online' },
{ id: 4, name: 'Sneha Gupta - Tuition Fee', studentId: 'ADM004', feeType: 'Tuition', amount: 25000, status: 'Paid', dueDate: '2024-02-15', discountType: 'Sibling', paymentMode: 'Cheque' },
{ id: 5, name: 'Vikram Singh - Lab Fee', studentId: 'ADM005', feeType: 'Lab', amount: 5000, status: 'Pending', dueDate: '2024-02-20', discountType: 'None', paymentMode: 'Online' },
{ id: 6, name: 'Neha Verma - Tuition Fee', studentId: 'ADM006', feeType: 'Tuition', amount: 25000, status: 'Pending', dueDate: '2024-02-15', discountType: 'Merit', paymentMode: 'Online' },
{ id: 7, name: 'Rohit Jain - Sports Fee', studentId: 'ADM007', feeType: 'Sports', amount: 3000, status: 'Waived', dueDate: '2024-02-10', discountType: 'Full', paymentMode: 'NA' },
{ id: 8, name: 'Kavita Mishra - Transport Fee', studentId: 'ADM008', feeType: 'Transport', amount: 8000, status: 'Pending', dueDate: '2024-02-15', discountType: 'None', paymentMode: 'Cash' }];


const mockOperationHistory: OperationHistory[] = [
{ id: 1, timestamp: new Date('2024-01-15T10:30:00'), entity: 'Students', field: 'Section', oldValue: 'A', newValue: 'B', recordsAffected: 12, status: 'Completed', executedBy: 'Admin User' },
{ id: 2, timestamp: new Date('2024-01-14T14:45:00'), entity: 'Employees', field: 'Shift', oldValue: 'Morning', newValue: 'Afternoon', recordsAffected: 5, status: 'Completed', executedBy: 'HR Manager' },
{ id: 3, timestamp: new Date('2024-01-13T09:15:00'), entity: 'Fee Records', field: 'Status', oldValue: 'Pending', newValue: 'Overdue', recordsAffected: 45, status: 'Partial', executedBy: 'Accounts' },
{ id: 4, timestamp: new Date('2024-01-12T16:00:00'), entity: 'Students', field: 'House', oldValue: 'Red', newValue: 'Blue', recordsAffected: 8, status: 'Completed', executedBy: 'Admin User' }];


// Field configurations for each entity
const entityFieldConfig: Record<string, {fields: FieldOption[];filters: Record<string, string[]>;}> = {
  students: {
    fields: [
    { value: 'section', label: 'Section' },
    { value: 'house', label: 'House' },
    { value: 'transport', label: 'Transport Route' },
    { value: 'status', label: 'Status' }],

    filters: {
      class: ['8', '9', '10', '11', '12'],
      section: ['A', 'B', 'C', 'D'],
      house: ['Red', 'Blue', 'Green', 'Yellow'],
      status: ['Active', 'Inactive']
    }
  },
  employees: {
    fields: [
    { value: 'department', label: 'Department' },
    { value: 'designation', label: 'Designation' },
    { value: 'status', label: 'Status' },
    { value: 'shift', label: 'Shift' },
    { value: 'location', label: 'Location' }],

    filters: {
      department: ['Science', 'Mathematics', 'English', 'Hindi', 'Administration', 'Accounts', 'Support'],
      status: ['Active', 'Inactive', 'On Leave'],
      shift: ['Morning', 'Afternoon', 'Night'],
      location: ['Main Campus', 'Branch Campus']
    }
  },
  fees: {
    fields: [
    { value: 'status', label: 'Status' },
    { value: 'discountType', label: 'Discount Type' },
    { value: 'paymentMode', label: 'Payment Mode' }],

    filters: {
      feeType: ['Tuition', 'Transport', 'Lab', 'Sports', 'Library'],
      status: ['Pending', 'Paid', 'Overdue', 'Waived', 'Partial'],
      discountType: ['None', 'Staff', 'Sibling', 'Merit', 'Full']
    }
  }
};

// Value options for each field
const fieldValueOptions: Record<string, ValueOption[]> = {
  section: [
  { value: 'A', label: 'Section A' },
  { value: 'B', label: 'Section B' },
  { value: 'C', label: 'Section C' },
  { value: 'D', label: 'Section D' }],

  house: [
  { value: 'Red', label: 'Red House' },
  { value: 'Blue', label: 'Blue House' },
  { value: 'Green', label: 'Green House' },
  { value: 'Yellow', label: 'Yellow House' }],

  transport: [
  { value: 'Route 1', label: 'Route 1 - North' },
  { value: 'Route 2', label: 'Route 2 - South' },
  { value: 'Route 3', label: 'Route 3 - East' },
  { value: 'Route 4', label: 'Route 4 - West' },
  { value: 'None', label: 'No Transport' }],

  status: [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'On Leave', label: 'On Leave' },
  { value: 'Suspended', label: 'Suspended' }],

  department: [
  { value: 'Science', label: 'Science' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Administration', label: 'Administration' },
  { value: 'Accounts', label: 'Accounts' },
  { value: 'Support', label: 'Support Staff' }],

  designation: [
  { value: 'Senior Teacher', label: 'Senior Teacher' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Lab Assistant', label: 'Lab Assistant' },
  { value: 'Clerk', label: 'Clerk' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Attendant', label: 'Attendant' }],

  shift: [
  { value: 'Morning', label: 'Morning Shift' },
  { value: 'Afternoon', label: 'Afternoon Shift' },
  { value: 'Night', label: 'Night Shift' }],

  location: [
  { value: 'Main Campus', label: 'Main Campus' },
  { value: 'Branch Campus', label: 'Branch Campus' }],

  discountType: [
  { value: 'None', label: 'No Discount' },
  { value: 'Staff', label: 'Staff Discount' },
  { value: 'Sibling', label: 'Sibling Discount' },
  { value: 'Merit', label: 'Merit Based' },
  { value: 'Full', label: 'Full Waiver' }],

  paymentMode: [
  { value: 'Online', label: 'Online Payment' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Cheque', label: 'Cheque' },
  { value: 'DD', label: 'Demand Draft' }],

  feeStatus: [
  { value: 'Pending', label: 'Pending' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Waived', label: 'Waived' },
  { value: 'Partial', label: 'Partially Paid' }]

};

export function BulkDataUpdateMassOperation() {
  // State for form inputs
  const [targetEntity, setTargetEntity] = useState<string>('');
  const [fieldToUpdate, setFieldToUpdate] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  // State for filters
  const [filterField1, setFilterField1] = useState<string>('');
  const [filterValue1, setFilterValue1] = useState<string>('');
  const [filterField2, setFilterField2] = useState<string>('');
  const [filterValue2, setFilterValue2] = useState<string>('');

  // State for preview and execution
  const [previewData, setPreviewData] = useState<PreviewRecord[]>([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionProgress, setExecutionProgress] = useState<number>(0);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [executionComplete, setExecutionComplete] = useState<boolean>(false);
  const [executionSummary, setExecutionSummary] = useState<{success: number;failed: number;} | null>(null);

  // State for operation history
  const [operationHistory, setOperationHistory] = useState<OperationHistory[]>(mockOperationHistory);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // State for confirmation modal
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // State for data storage (simulating database)
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(mockFeeRecords);

  // Get available fields based on selected entity
  const getAvailableFields = useCallback((): FieldOption[] => {
    if (!targetEntity) return [];
    return entityFieldConfig[targetEntity]?.fields || [];
  }, [targetEntity]);

  // Get available values based on selected field
  const getAvailableValues = useCallback((): ValueOption[] => {
    if (!fieldToUpdate) return [];
    if (targetEntity === 'fees' && fieldToUpdate === 'status') {
      return fieldValueOptions.feeStatus || [];
    }
    return fieldValueOptions[fieldToUpdate] || [];
  }, [fieldToUpdate, targetEntity]);

  // Get filter options based on entity
  const getFilterOptions = useCallback((filterIndex: 1 | 2): {fields: FieldOption[];values: ValueOption[];} => {
    if (!targetEntity) return { fields: [], values: [] };

    const config = entityFieldConfig[targetEntity];
    if (!config) return { fields: [], values: [] };

    const fields = Object.keys(config.filters).map((key) => ({
      value: key,
      label: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    const selectedField = filterIndex === 1 ? filterField1 : filterField2;
    const values = selectedField && config.filters[selectedField] ?
    config.filters[selectedField].map((v) => ({ value: v, label: v })) :
    [];

    return { fields, values };
  }, [targetEntity, filterField1, filterField2]);

  // Reset dependent fields when entity changes
  useEffect(() => {
    setFieldToUpdate('');
    setNewValue('');
    setFilterField1('');
    setFilterValue1('');
    setFilterField2('');
    setFilterValue2('');
    setPreviewData([]);
    setShowPreview(false);
    setExecutionComplete(false);
    setExecutionSummary(null);
  }, [targetEntity]);

  // Reset new value when field changes
  useEffect(() => {
    setNewValue('');
    setPreviewData([]);
    setShowPreview(false);
  }, [fieldToUpdate]);

  // Preview Changes function
  const handlePreviewChanges = async () => {
    if (!targetEntity || !fieldToUpdate || !newValue) {
      alert('Please select target entity, field to update, and new value');
      return;
    }

    setIsPreviewLoading(true);
    setShowPreview(false);
    setExecutionComplete(false);
    setExecutionSummary(null);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    let filteredRecords: PreviewRecord[] = [];

    if (targetEntity === 'students') {
      let filtered = [...students];

      // Apply filters
      if (filterField1 && filterValue1) {
        filtered = filtered.filter((s) => (s as any)[filterField1] === filterValue1);
      }
      if (filterField2 && filterValue2) {
        filtered = filtered.filter((s) => (s as any)[filterField2] === filterValue2);
      }

      // Only include records where current value differs from new value
      filtered = filtered.filter((s) => (s as any)[fieldToUpdate] !== newValue);

      filteredRecords = filtered.map((s) => ({
        id: s.id,
        name: s.name,
        identifier: s.admissionNo,
        current: (s as any)[fieldToUpdate],
        new: newValue,
        status: 'Pending' as const
      }));
    } else if (targetEntity === 'employees') {
      let filtered = [...employees];

      if (filterField1 && filterValue1) {
        filtered = filtered.filter((e) => (e as any)[filterField1] === filterValue1);
      }
      if (filterField2 && filterValue2) {
        filtered = filtered.filter((e) => (e as any)[filterField2] === filterValue2);
      }

      filtered = filtered.filter((e) => (e as any)[fieldToUpdate] !== newValue);

      filteredRecords = filtered.map((e) => ({
        id: e.id,
        name: e.name,
        identifier: e.employeeId,
        current: (e as any)[fieldToUpdate],
        new: newValue,
        status: 'Pending' as const
      }));
    } else if (targetEntity === 'fees') {
      let filtered = [...feeRecords];

      if (filterField1 && filterValue1) {
        filtered = filtered.filter((f) => (f as any)[filterField1] === filterValue1);
      }
      if (filterField2 && filterValue2) {
        filtered = filtered.filter((f) => (f as any)[filterField2] === filterValue2);
      }

      filtered = filtered.filter((f) => (f as any)[fieldToUpdate] !== newValue);

      filteredRecords = filtered.map((f) => ({
        id: f.id,
        name: f.name,
        identifier: f.studentId,
        current: (f as any)[fieldToUpdate],
        new: newValue,
        status: 'Pending' as const
      }));
    }

    setPreviewData(filteredRecords);
    setShowPreview(true);
    setIsPreviewLoading(false);
  };

  // Execute Update function
  const handleExecuteUpdate = async () => {
    if (previewData.length === 0) {
      alert('No records to update');
      return;
    }

    setShowConfirmation(false);
    setIsExecuting(true);
    setExecutionProgress(0);

    const totalRecords = previewData.length;
    let successCount = 0;
    let failedCount = 0;

    // Process records one by one with simulated delay
    for (let i = 0; i < previewData.length; i++) {
      const record = previewData[i];

      // Update preview status to Processing
      setPreviewData((prev) => prev.map((r, idx) =>
      idx === i ? { ...r, status: 'Processing' as const } : r
      ));

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

      // Simulate occasional failures (5% chance)
      const isSuccess = Math.random() > 0.05;

      if (isSuccess) {
        // Update the actual data
        if (targetEntity === 'students') {
          setStudents((prev) => prev.map((s) =>
          s.id === record.id ? { ...s, [fieldToUpdate]: newValue } : s
          ));
        } else if (targetEntity === 'employees') {
          setEmployees((prev) => prev.map((e) =>
          e.id === record.id ? { ...e, [fieldToUpdate]: newValue } : e
          ));
        } else if (targetEntity === 'fees') {
          setFeeRecords((prev) => prev.map((f) =>
          f.id === record.id ? { ...f, [fieldToUpdate]: newValue } : f
          ));
        }

        successCount++;
        setPreviewData((prev) => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'Success' as const } : r
        ));
      } else {
        failedCount++;
        setPreviewData((prev) => prev.map((r, idx) =>
        idx === i ? { ...r, status: 'Failed' as const, errorMessage: 'Database connection timeout' } : r
        ));
      }

      setExecutionProgress((i + 1) / totalRecords * 100);
    }

    // Add to operation history
    const newHistoryEntry: OperationHistory = {
      id: operationHistory.length + 1,
      timestamp: new Date(),
      entity: targetEntity.charAt(0).toUpperCase() + targetEntity.slice(1),
      field: fieldToUpdate.charAt(0).toUpperCase() + fieldToUpdate.slice(1),
      oldValue: previewData[0]?.current || 'Multiple',
      newValue: newValue,
      recordsAffected: successCount,
      status: failedCount === 0 ? 'Completed' : failedCount === totalRecords ? 'Failed' : 'Partial',
      executedBy: 'Admin User'
    };
    setOperationHistory((prev) => [newHistoryEntry, ...prev]);

    setIsExecuting(false);
    setExecutionComplete(true);
    setExecutionSummary({ success: successCount, failed: failedCount });
  };

  // Reset form
  const handleReset = () => {
    setTargetEntity('');
    setFieldToUpdate('');
    setNewValue('');
    setFilterField1('');
    setFilterValue1('');
    setFilterField2('');
    setFilterValue2('');
    setPreviewData([]);
    setShowPreview(false);
    setExecutionComplete(false);
    setExecutionSummary(null);
    setExecutionProgress(0);
  };

  // Export preview to CSV
  const handleExportPreview = () => {
    if (previewData.length === 0) return;

    const headers = ['ID', 'Name', 'Identifier', 'Current Value', 'New Value', 'Status'];
    const rows = previewData.map((r) => [r.id, r.name, r.identifier, r.current, r.new, r.status]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_update_preview_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Remove record from preview
  const handleRemoveFromPreview = (id: number) => {
    setPreviewData((prev) => prev.filter((r) => r.id !== id));
  };

  // Table columns
  const columns = [
  {
    key: 'identifier',
    header: 'ID',
    render: (row: PreviewRecord) =>
    <span className="font-mono text-sm">{row.identifier}</span>

  },
  {
    key: 'name',
    header: 'Record Name'
  },
  {
    key: 'current',
    header: 'Current Value',
    render: (row: PreviewRecord) =>
    <span className="text-gray-600">{row.current}</span>

  },
  {
    key: 'new',
    header: 'New Value',
    render: (row: PreviewRecord) =>
    <span className="font-medium text-blue-600">{row.new}</span>

  },
  {
    key: 'status',
    header: 'Status',
    render: (row: PreviewRecord) => {
      const variants: Record<string, any> = {
        'Pending': 'secondary',
        'Processing': 'warning',
        'Success': 'success',
        'Failed': 'danger'
      };
      const icons: Record<string, React.ReactNode> = {
        'Processing': <Loader2 className="w-3 h-3 animate-spin mr-1" />,
        'Success': <CheckCircle className="w-3 h-3 mr-1" />,
        'Failed': <XCircle className="w-3 h-3 mr-1" />
      };
      return (
        <div className="flex items-center gap-2">
            <Badge variant={variants[row.status]}>
              <span className="flex items-center">
                {icons[row.status]}
                {row.status}
              </span>
            </Badge>
            {row.errorMessage &&
          <span className="text-xs text-red-500">{row.errorMessage}</span>
          }
          </div>);

    }
  },
  {
    key: 'actions',
    header: 'Actions',
    render: (row: PreviewRecord) =>
    row.status === 'Pending' && !isExecuting ?
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleRemoveFromPreview(row.id)}>

            <XCircle className="w-4 h-4 text-gray-400 hover:text-red-500" />
          </Button> :
    null

  }];


  // History table columns
  const historyColumns = [
  {
    key: 'timestamp',
    header: 'Date & Time',
    render: (row: OperationHistory) =>
    <span className="text-sm">
          {row.timestamp.toLocaleDateString()} {row.timestamp.toLocaleTimeString()}
        </span>

  },
  { key: 'entity', header: 'Entity' },
  { key: 'field', header: 'Field' },
  {
    key: 'change',
    header: 'Change',
    render: (row: OperationHistory) =>
    <span className="text-sm">
          {row.oldValue} → <span className="font-medium text-blue-600">{row.newValue}</span>
        </span>

  },
  { key: 'recordsAffected', header: 'Records' },
  {
    key: 'status',
    header: 'Status',
    render: (row: OperationHistory) => {
      const variants: Record<string, any> = {
        'Completed': 'success',
        'Partial': 'warning',
        'Failed': 'danger'
      };
      return <Badge variant={variants[row.status]}>{row.status}</Badge>;
    }
  },
  { key: 'executedBy', header: 'Executed By' }];


  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Data Update</h1>
          <p className="text-sm text-gray-500">
            Perform mass updates on system records
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}>

            <History className="w-4 h-4 mr-2" />
            {showHistory ? 'Hide History' : 'View History'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Form
          </Button>
        </div>
      </div>

      {/* Operation History */}
      {showHistory &&
      <Card title="Operation History">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              View past bulk update operations performed on the system.
            </p>
            <Table columns={historyColumns} data={operationHistory} />
          </div>
        </Card>
      }

      <Card title="Operation Setup">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select
            label="Target Entity"
            value={targetEntity}
            onChange={(e) => setTargetEntity(e.target.value)}
            options={[
            { value: '', label: 'Select Entity' },
            { value: 'students', label: 'Students' },
            { value: 'employees', label: 'Employees' },
            { value: 'fees', label: 'Fee Records' }]
            } />

          <Select
            label="Field to Update"
            value={fieldToUpdate}
            onChange={(e) => setFieldToUpdate(e.target.value)}
            options={[
            { value: '', label: 'Select Field' },
            ...getAvailableFields()]
            }
            disabled={!targetEntity} />

          <Select
            label="New Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            options={[
            { value: '', label: 'Select Value' },
            ...getAvailableValues()]
            }
            disabled={!fieldToUpdate} />

        </div>

        <div className="border-t border-gray-100 pt-4 mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Filter Criteria (Narrow down records)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select
              label="Filter Field 1"
              value={filterField1}
              onChange={(e) => {
                setFilterField1(e.target.value);
                setFilterValue1('');
              }}
              options={[
              { value: '', label: 'Select Field' },
              ...getFilterOptions(1).fields]
              }
              disabled={!targetEntity} />

            <Select
              label="Filter Value 1"
              value={filterValue1}
              onChange={(e) => setFilterValue1(e.target.value)}
              options={[
              { value: '', label: 'Select Value' },
              ...getFilterOptions(1).values]
              }
              disabled={!filterField1} />

            <Select
              label="Filter Field 2"
              value={filterField2}
              onChange={(e) => {
                setFilterField2(e.target.value);
                setFilterValue2('');
              }}
              options={[
              { value: '', label: 'Select Field' },
              ...getFilterOptions(2).fields.filter((f) => f.value !== filterField1)]
              }
              disabled={!targetEntity} />

            <Select
              label="Filter Value 2"
              value={filterValue2}
              onChange={(e) => setFilterValue2(e.target.value)}
              options={[
              { value: '', label: 'Select Value' },
              ...getFilterOptions(2).values]
              }
              disabled={!filterField2} />

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={handlePreviewChanges}
                disabled={!targetEntity || !fieldToUpdate || !newValue || isPreviewLoading}>

                {isPreviewLoading ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <RefreshCw className="w-4 h-4 mr-2" />
                }
                Preview Changes
              </Button>
            </div>
          </div>
        </div>

        {/* Current Data Summary */}
        {targetEntity &&
        <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Current Data Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              {targetEntity === 'students' &&
            <>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Total Students</p>
                    <p className="text-lg font-semibold">{students.length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Active Students</p>
                    <p className="text-lg font-semibold">{students.filter((s) => s.status === 'Active').length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Classes</p>
                    <p className="text-lg font-semibold">{new Set(students.map((s) => s.class)).size}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Sections</p>
                    <p className="text-lg font-semibold">{new Set(students.map((s) => s.section)).size}</p>
                  </div>
                </>
            }
              {targetEntity === 'employees' &&
            <>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Total Employees</p>
                    <p className="text-lg font-semibold">{employees.length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Active</p>
                    <p className="text-lg font-semibold">{employees.filter((e) => e.status === 'Active').length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Departments</p>
                    <p className="text-lg font-semibold">{new Set(employees.map((e) => e.department)).size}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Locations</p>
                    <p className="text-lg font-semibold">{new Set(employees.map((e) => e.location)).size}</p>
                  </div>
                </>
            }
              {targetEntity === 'fees' &&
            <>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Total Records</p>
                    <p className="text-lg font-semibold">{feeRecords.length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Pending</p>
                    <p className="text-lg font-semibold">{feeRecords.filter((f) => f.status === 'Pending').length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Overdue</p>
                    <p className="text-lg font-semibold">{feeRecords.filter((f) => f.status === 'Overdue').length}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-gray-500">Total Amount</p>
                    <p className="text-lg font-semibold">₹{feeRecords.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}</p>
                  </div>
                </>
            }
            </div>
          </div>
        }
      </Card>

      {/* Preview & Execution */}
      {showPreview &&
      <Card title="Preview & Execution">
          <div className="space-y-4">
            {/* Warning Message */}
            {!executionComplete && previewData.length > 0 &&
          <div className="bg-yellow-50 p-3 rounded-md flex gap-3 text-yellow-800 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                  This operation will update <strong>{previewData.length} records</strong>. Please
                  verify the preview below before executing. This action cannot be
                  easily undone.
                </p>
              </div>
          }

            {/* No Records Message */}
            {previewData.length === 0 && !isPreviewLoading &&
          <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm text-center">
                <p>No records match the selected criteria, or all matching records already have the new value.</p>
              </div>
          }

            {/* Execution Progress */}
            {isExecuting &&
          <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    Executing Update...
                  </span>
                  <span className="text-sm text-blue-600">
                    {Math.round(executionProgress)}%
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${executionProgress}%` }} />

                </div>
              </div>
          }

            {/* Execution Complete Summary */}
            {executionComplete && executionSummary &&
          <div className={`p-4 rounded-md ${executionSummary.failed === 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <div className="flex items-center gap-3">
                  {executionSummary.failed === 0 ?
              <CheckCircle className="w-6 h-6 text-green-600" /> :

              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              }
                  <div>
                    <p className={`font-medium ${executionSummary.failed === 0 ? 'text-green-800' : 'text-yellow-800'}`}>
                      Execution Complete
                    </p>
                    <p className="text-sm text-gray-600">
                      {executionSummary.success} records updated successfully
                      {executionSummary.failed > 0 && `, ${executionSummary.failed} failed`}
                    </p>
                  </div>
                </div>
              </div>
          }

            {/* Preview Table */}
            {previewData.length > 0 &&
          <>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Showing {previewData.length} record(s) to be updated
                  </span>
                  <Button
                variant="outline"
                size="sm"
                onClick={handleExportPreview}
                disabled={isExecuting}>

                    <Download className="w-4 h-4 mr-2" />
                    Export Preview
                  </Button>
                </div>
                
                <Table columns={columns} data={previewData} />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  {!executionComplete &&
              <>
                      <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={isExecuting}>

                        Cancel
                      </Button>
                      <Button
                  variant="danger"
                  onClick={() => setShowConfirmation(true)}
                  disabled={isExecuting || previewData.filter((r) => r.status === 'Pending').length === 0}>

                        {isExecuting ?
                  <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Executing...
                          </> :

                  <>
                            <Play className="w-4 h-4 mr-2" />
                            Execute Update
                          </>
                  }
                      </Button>
                    </>
              }
                  {executionComplete &&
              <Button variant="primary" onClick={handleReset}>
                      Start New Operation
                    </Button>
              }
                </div>
              </>
          }
          </div>
        </Card>
      }

      {/* Confirmation Modal */}
      {showConfirmation &&
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Bulk Update</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-600">
                You are about to update <strong>{previewData.length} records</strong> in the{' '}
                <strong>{targetEntity}</strong> entity.
              </p>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p><strong>Field:</strong> {fieldToUpdate}</p>
                <p><strong>New Value:</strong> {newValue}</p>
              </div>
              <p className="text-sm text-red-600">
                This action cannot be easily undone. Are you sure you want to proceed?
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}>

                Cancel
              </Button>
              <Button
              variant="danger"
              onClick={handleExecuteUpdate}>

                <Play className="w-4 h-4 mr-2" />
                Confirm & Execute
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Retry Failed Records Section */}
      {executionComplete && executionSummary && executionSummary.failed > 0 &&
      <Card title="Failed Records">
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              The following records failed to update. You can retry the operation for these records.
            </p>
            <Table
            columns={columns.filter((c) => c.key !== 'actions')}
            data={previewData.filter((r) => r.status === 'Failed')} />

            <div className="flex justify-end">
              <Button
              variant="outline"
              onClick={() => {
                setPreviewData((prev) => prev.filter((r) => r.status === 'Failed').map((r) => ({ ...r, status: 'Pending' as const, errorMessage: undefined })));
                setExecutionComplete(false);
                setExecutionSummary(null);
              }}>

                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Failed Records
              </Button>
            </div>
          </div>
        </Card>
      }
    </div>);

}