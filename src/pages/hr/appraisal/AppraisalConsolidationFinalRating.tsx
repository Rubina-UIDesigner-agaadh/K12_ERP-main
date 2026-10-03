// File: AppraisalConsolidationFinalRating.tsx

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Send,
  Download,
  Printer,
  Eye,
  AlertCircle,
  CheckCircle,
  Filter,
  BarChart3,
  Users,
  Target,
  Award,
  X,
  Search,
  ChevronUp,
  ChevronDown,
  Loader2,
  Info,
  RefreshCw,
  Save,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  ArrowUpDown,
  RotateCcw } from
'lucide-react';

interface EmployeeScore {
  id: string;
  name: string;
  department: string;
  designation: string;
  selfScore: number;
  managerScore: number;
  studentScore: number;
  calculatedFinal: number;
  finalGrade: string;
  overrideGrade: string;
  overrideReason: string;
  isPublished: boolean;
  publishedAt: string | null;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface SortConfig {
  key: keyof EmployeeScore | '';
  direction: 'asc' | 'desc';
}

interface ValidationError {
  employeeId: string;
  message: string;
}

const gradeFromScore = (score: number): string => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B+';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  return 'D';
};

const gradeColor = (g: string): string => {
  if (g === 'A+' || g === 'A') return 'bg-green-100 text-green-800';
  if (g === 'B+' || g === 'B') return 'bg-blue-100 text-blue-800';
  if (g === 'C') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const scoreColor = (s: number): string => {
  if (s >= 80) return 'text-green-600';
  if (s >= 60) return 'text-blue-600';
  if (s >= 40) return 'text-amber-600';
  return 'text-red-600';
};

const calcFinal = (self: number, mgr: number, stu: number) =>
Math.round(self * 0.1 + mgr * 0.6 + stu * 0.3);

const mockData: EmployeeScore[] = [
{
  id: 'EMP001',
  name: 'Dr. Robert Smith',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  selfScore: 88,
  managerScore: 82,
  studentScore: 90,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP002',
  name: 'Mrs. Sarah Johnson',
  department: 'Science',
  designation: 'HOD',
  selfScore: 92,
  managerScore: 88,
  studentScore: 85,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP003',
  name: 'Mr. Michael Chen',
  department: 'Science',
  designation: 'Teacher',
  selfScore: 75,
  managerScore: 70,
  studentScore: 78,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP004',
  name: 'Ms. Emily Davis',
  department: 'English',
  designation: 'Senior Teacher',
  selfScore: 80,
  managerScore: 75,
  studentScore: 82,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP005',
  name: 'Mr. David Wilson',
  department: 'English',
  designation: 'Teacher',
  selfScore: 65,
  managerScore: 58,
  studentScore: 70,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP006',
  name: 'Mrs. Lisa Taylor',
  department: 'Science',
  designation: 'Teacher',
  selfScore: 90,
  managerScore: 85,
  studentScore: 88,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP007',
  name: 'Mr. James Anderson',
  department: 'Administration',
  designation: 'Office Manager',
  selfScore: 70,
  managerScore: 65,
  studentScore: 0,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP008',
  name: 'Ms. Jennifer Brown',
  department: 'Support Staff',
  designation: 'Librarian',
  selfScore: 82,
  managerScore: 78,
  studentScore: 85,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP009',
  name: 'Dr. Patricia Martinez',
  department: 'Mathematics',
  designation: 'Teacher',
  selfScore: 95,
  managerScore: 90,
  studentScore: 92,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP010',
  name: 'Mr. Richard Lee',
  department: 'Support Staff',
  designation: 'Sports Coach',
  selfScore: 78,
  managerScore: 72,
  studentScore: 88,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
},
{
  id: 'EMP011',
  name: 'Mr. Thomas White',
  department: 'Administration',
  designation: 'Clerk',
  selfScore: 55,
  managerScore: 48,
  studentScore: 0,
  calculatedFinal: 0,
  finalGrade: '',
  overrideGrade: '',
  overrideReason: '',
  isPublished: false,
  publishedAt: null
}].
map((e) => {
  const f =
  e.studentScore > 0 ?
  calcFinal(e.selfScore, e.managerScore, e.studentScore) :
  Math.round(e.selfScore * 0.2 + e.managerScore * 0.8);
  return {
    ...e,
    calculatedFinal: f,
    finalGrade: gradeFromScore(f)
  };
});

export function AppraisalConsolidationFinalRating() {
  // Core state
  const [data, setData] = useState<EmployeeScore[]>(mockData);
  const [deptFilter, setDeptFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });

  // Interactive states
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState<EmployeeScore | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showBulkOverrideModal, setShowBulkOverrideModal] = useState(false);
  const [bulkOverrideGrade, setBulkOverrideGrade] = useState('');
  const [bulkOverrideReason, setBulkOverrideReason] = useState('');

  const printRef = useRef<HTMLDivElement>(null);

  // Computed values
  const filtered = useMemo(() => {
    let result = data.filter((e) => {
      const matchesDept = !deptFilter || e.department === deptFilter;
      const matchesGrade = !gradeFilter || (e.overrideGrade || e.finalGrade) === gradeFilter;
      const matchesSearch = !searchQuery ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesGrade && matchesSearch;
    });

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key as keyof EmployeeScore];
        const bVal = b[sortConfig.key as keyof EmployeeScore];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, deptFilter, gradeFilter, searchQuery, sortConfig]);

  const avgScore = useMemo(() => {
    if (filtered.length === 0) return 0;
    return Math.round(
      filtered.reduce((s, e) => s + e.calculatedFinal, 0) / filtered.length
    );
  }, [filtered]);

  const gradeDistribution = useMemo(() => {
    return ['A+', 'A', 'B+', 'B', 'C', 'D'].map((g) => ({
      grade: g,
      count: filtered.filter((e) => (e.overrideGrade || e.finalGrade) === g).length
    }));
  }, [filtered]);

  const publishedCount = useMemo(() => {
    return filtered.filter((e) => e.isPublished).length;
  }, [filtered]);

  const unpublishedCount = useMemo(() => {
    return filtered.filter((e) => !e.isPublished).length;
  }, [filtered]);

  const allSelected = useMemo(() => {
    return filtered.length > 0 && selectedEmployees.length === filtered.length;
  }, [filtered, selectedEmployees]);

  const someSelected = useMemo(() => {
    return selectedEmployees.length > 0 && selectedEmployees.length < filtered.length;
  }, [filtered, selectedEmployees]);

  // Toast management
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Mark as dirty when data changes
  useEffect(() => {
    setIsDirty(true);
  }, [data]);

  // Override functions
  const setOverride = useCallback((id: string, grade: string) => {
    setData((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      overrideGrade: grade,
      overrideReason: grade ? e.overrideReason : ''
    } :
    e
    )
    );

    // Clear validation error for this employee if grade is cleared
    if (!grade) {
      setValidationErrors((prev) => prev.filter((err) => err.employeeId !== id));
    }
  }, []);

  const setOverrideReason = useCallback((id: string, reason: string) => {
    setData((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      overrideReason: reason
    } :
    e
    )
    );

    // Clear validation error if reason is provided
    if (reason.trim()) {
      setValidationErrors((prev) => prev.filter((err) => err.employeeId !== id));
    }
  }, []);

  const clearOverride = useCallback((id: string) => {
    setData((prev) =>
    prev.map((e) =>
    e.id === id ?
    {
      ...e,
      overrideGrade: '',
      overrideReason: ''
    } :
    e
    )
    );
    setValidationErrors((prev) => prev.filter((err) => err.employeeId !== id));
    showToast('Override cleared', 'info');
  }, [showToast]);

  // Sorting
  const handleSort = useCallback((key: keyof EmployeeScore) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const getSortIcon = useCallback((key: keyof EmployeeScore) => {
    if (sortConfig.key !== key) {
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ?
    <ChevronUp className="w-3 h-3 text-blue-600" /> :
    <ChevronDown className="w-3 h-3 text-blue-600" />;
  }, [sortConfig]);

  // Selection functions
  const toggleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filtered.map((e) => e.id));
    }
  }, [allSelected, filtered]);

  const toggleSelectEmployee = useCallback((id: string) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(id)) {
        return prev.filter((empId) => empId !== id);
      }
      return [...prev, id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  // Bulk override
  const applyBulkOverride = useCallback(() => {
    if (!bulkOverrideGrade) {
      showToast('Please select a grade', 'error');
      return;
    }
    if (!bulkOverrideReason.trim()) {
      showToast('Please provide a reason for bulk override', 'error');
      return;
    }

    setData((prev) =>
    prev.map((e) =>
    selectedEmployees.includes(e.id) ?
    {
      ...e,
      overrideGrade: bulkOverrideGrade,
      overrideReason: bulkOverrideReason
    } :
    e
    )
    );

    showToast(`Bulk override applied to ${selectedEmployees.length} employees`, 'success');
    setShowBulkOverrideModal(false);
    setBulkOverrideGrade('');
    setBulkOverrideReason('');
    setSelectedEmployees([]);
  }, [bulkOverrideGrade, bulkOverrideReason, selectedEmployees, showToast]);

  const clearBulkOverrides = useCallback(() => {
    setData((prev) =>
    prev.map((e) =>
    selectedEmployees.includes(e.id) ?
    {
      ...e,
      overrideGrade: '',
      overrideReason: ''
    } :
    e
    )
    );

    setValidationErrors((prev) =>
    prev.filter((err) => !selectedEmployees.includes(err.employeeId))
    );

    showToast(`Overrides cleared for ${selectedEmployees.length} employees`, 'success');
    setSelectedEmployees([]);
  }, [selectedEmployees, showToast]);

  // Validation
  const validateBeforePublish = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];

    const employeesToPublish = selectedEmployees.length > 0 ?
    data.filter((e) => selectedEmployees.includes(e.id) && !e.isPublished) :
    data.filter((e) => !e.isPublished);

    employeesToPublish.forEach((emp) => {
      if (emp.overrideGrade && !emp.overrideReason.trim()) {
        errors.push({
          employeeId: emp.id,
          message: `${emp.name}: Override reason is required`
        });
      }
    });

    return errors;
  }, [data, selectedEmployees]);

  // Save function
  const saveChanges = useCallback(async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      localStorage.setItem('appraisalConsolidationData', JSON.stringify(data));
      setLastSavedAt(new Date());
      setIsDirty(false);
      showToast('Changes saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save changes', 'error');
    }

    setIsSaving(false);
  }, [data, showToast]);

  // Export Excel function
  const exportToExcel = useCallback(async () => {
    setIsExporting(true);

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      // Create CSV content
      const headers = [
      'Employee ID',
      'Name',
      'Department',
      'Designation',
      'Self Score',
      'Manager Score',
      'Student Score',
      'Final Score',
      'Calculated Grade',
      'Override Grade',
      'Override Reason',
      'Published'];


      const rows = filtered.map((emp) => [
      emp.id,
      emp.name,
      emp.department,
      emp.designation,
      emp.selfScore,
      emp.managerScore,
      emp.studentScore || 'N/A',
      emp.calculatedFinal,
      emp.finalGrade,
      emp.overrideGrade || '-',
      emp.overrideReason || '-',
      emp.isPublished ? 'Yes' : 'No']
      );

      const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].
      join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `appraisal_consolidation_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${filtered.length} records to Excel`, 'success');
    } catch (error) {
      showToast('Failed to export data', 'error');
    }

    setIsExporting(false);
  }, [filtered, showToast]);

  // Print PDF function
  const printToPDF = useCallback(async () => {
    setIsPrinting(true);

    // Simulate print preparation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Create print content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Appraisal Consolidation Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 10px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 30px; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; padding: 15px; background: #f5f5f5; }
            .summary-item { text-align: center; }
            .summary-value { font-size: 24px; font-weight: bold; }
            .summary-label { font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .grade { padding: 2px 8px; border-radius: 4px; font-weight: bold; }
            .grade-a { background: #dcfce7; color: #166534; }
            .grade-b { background: #dbeafe; color: #1e40af; }
            .grade-c { background: #fef3c7; color: #92400e; }
            .grade-d { background: #fee2e2; color: #991b1b; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Appraisal Consolidation Report</h1>
          <p class="subtitle">Generated on ${new Date().toLocaleString()}</p>
          
          <div class="summary">
            <div class="summary-item">
              <div class="summary-value">${filtered.length}</div>
              <div class="summary-label">Total Employees</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${avgScore}</div>
              <div class="summary-label">Average Score</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${filtered.filter((e) => e.overrideGrade).length}</div>
              <div class="summary-label">Overridden</div>
            </div>
            <div class="summary-item">
              <div class="summary-value">${publishedCount}</div>
              <div class="summary-label">Published</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Self</th>
                <th>Manager</th>
                <th>Student</th>
                <th>Final</th>
                <th>Grade</th>
                <th>Override</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((emp) => {
        const grade = emp.overrideGrade || emp.finalGrade;
        const gradeClass = grade.startsWith('A') ? 'grade-a' : grade.startsWith('B') ? 'grade-b' : grade === 'C' ? 'grade-c' : 'grade-d';
        return `
                  <tr>
                    <td>${emp.id}</td>
                    <td>${emp.name}</td>
                    <td>${emp.department}</td>
                    <td>${emp.designation}</td>
                    <td>${emp.selfScore}</td>
                    <td>${emp.managerScore}</td>
                    <td>${emp.studentScore || 'N/A'}</td>
                    <td><strong>${emp.calculatedFinal}</strong></td>
                    <td><span class="grade ${gradeClass}">${grade}</span></td>
                    <td>${emp.overrideGrade ? `${emp.overrideGrade} (${emp.overrideReason})` : '-'}</td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Weights: Self 10% | Manager 60% | Student 30%</p>
            <p>This report is system generated and confidential.</p>
          </div>
        </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);

        showToast('Print dialog opened', 'success');
      } else {
        showToast('Pop-up blocked. Please allow pop-ups and try again.', 'error');
      }
    } catch (error) {
      showToast('Failed to generate print document', 'error');
    }

    setIsPrinting(false);
  }, [filtered, avgScore, publishedCount, showToast]);

  // Publish function
  const openPublishModal = useCallback(() => {
    const errors = validateBeforePublish();

    if (errors.length > 0) {
      setValidationErrors(errors);
      showToast(`Please fix ${errors.length} validation error(s) before publishing`, 'error');
      return;
    }

    setValidationErrors([]);
    setShowPublishModal(true);
  }, [validateBeforePublish, showToast]);

  const publishResults = useCallback(async () => {
    setIsPublishing(true);
    setShowPublishModal(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const publishTime = new Date().toISOString();

      const employeesToPublish = selectedEmployees.length > 0 ?
      selectedEmployees :
      data.filter((e) => !e.isPublished).map((e) => e.id);

      setData((prev) =>
      prev.map((e) =>
      employeesToPublish.includes(e.id) ?
      {
        ...e,
        isPublished: true,
        publishedAt: publishTime
      } :
      e
      )
      );

      // Clear selection after publishing
      setSelectedEmployees([]);
      setIsDirty(false);

      showToast(`Results published for ${employeesToPublish.length} employees`, 'success');
    } catch (error) {
      showToast('Failed to publish results', 'error');
    }

    setIsPublishing(false);
  }, [data, selectedEmployees, showToast]);

  // View employee details
  const viewEmployeeDetails = useCallback((emp: EmployeeScore) => {
    setShowEmployeeModal(emp);
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setDeptFilter('');
    setGradeFilter('');
    setSearchQuery('');
    setSortConfig({ key: '', direction: 'asc' });
    showToast('Filters reset', 'info');
  }, [showToast]);

  // Refresh data
  const refreshData = useCallback(async () => {
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setData(mockData);
    setSelectedEmployees([]);
    setValidationErrors([]);
    showToast('Data refreshed', 'success');
  }, [showToast]);

  // Toast Container Component
  const ToastContainer = () =>
  <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) =>
    <div
      key={toast.id}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm ${
      toast.type === 'success' ? 'bg-green-500 text-white' :
      toast.type === 'error' ? 'bg-red-500 text-white' :
      toast.type === 'warning' ? 'bg-amber-500 text-white' :
      'bg-blue-500 text-white'}`
      }>

          {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 flex-shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
        onClick={() => removeToast(toast.id)}
        className="ml-auto hover:opacity-80">

            <X className="w-4 h-4" />
          </button>
        </div>
    )}
    </div>;


  // Confirmation Modal Component
  const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    isLoading = false,
    variant = 'primary',
    children











  }: {isOpen: boolean;title: string;message: string;confirmText: string;cancelText: string;onConfirm: () => void;onCancel: () => void;isLoading?: boolean;variant?: 'primary' | 'danger';children?: React.ReactNode;}) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onCancel} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{message}</p>
          {children}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              variant={variant === 'danger' ? 'outline' : 'primary'}
              onClick={onConfirm}
              disabled={isLoading}
              className={variant === 'danger' ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}>

              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </div>
      </div>);

  };

  // Employee Detail Modal
  const EmployeeDetailModal = () => {
    if (!showEmployeeModal) return null;

    const emp = showEmployeeModal;
    const effectiveGrade = emp.overrideGrade || emp.finalGrade;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEmployeeModal(null)} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
            <button
              onClick={() => setShowEmployeeModal(null)}
              className="text-gray-400 hover:text-gray-600">

              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Employee Info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{emp.name}</h4>
                <p className="text-sm text-gray-500">{emp.id} · {emp.designation}</p>
                <p className="text-sm text-gray-500">{emp.department}</p>
              </div>
              <div className="ml-auto text-right">
                <span className={`inline-flex px-3 py-1.5 text-lg font-bold rounded-full ${gradeColor(effectiveGrade)}`}>
                  {effectiveGrade}
                </span>
                {emp.isPublished &&
                <p className="text-xs text-green-600 mt-1">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    Published
                  </p>
                }
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Self Score</p>
                <p className="text-2xl font-bold text-gray-700">{emp.selfScore}</p>
                <p className="text-xs text-gray-400">Weight: 10%</p>
                <p className="text-sm font-medium text-blue-600">+{(emp.selfScore * 0.1).toFixed(1)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Manager Score</p>
                <p className="text-2xl font-bold text-gray-700">{emp.managerScore}</p>
                <p className="text-xs text-gray-400">Weight: 60%</p>
                <p className="text-sm font-medium text-blue-600">+{(emp.managerScore * 0.6).toFixed(1)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-500">Student Score</p>
                <p className="text-2xl font-bold text-gray-700">
                  {emp.studentScore || 'N/A'}
                </p>
                <p className="text-xs text-gray-400">Weight: 30%</p>
                <p className="text-sm font-medium text-blue-600">
                  {emp.studentScore ? `+${(emp.studentScore * 0.3).toFixed(1)}` : '-'}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-blue-600">Final Score</p>
                <p className={`text-2xl font-bold ${scoreColor(emp.calculatedFinal)}`}>
                  {emp.calculatedFinal}
                </p>
                <p className="text-xs text-blue-400">Calculated</p>
                <p className="text-sm font-medium text-blue-600">
                  Grade: {emp.finalGrade}
                </p>
              </div>
            </div>

            {/* Override Info */}
            {emp.overrideGrade &&
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Grade Override Applied</span>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-amber-600">Original Grade:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded ${gradeColor(emp.finalGrade)}`}>
                      {emp.finalGrade}
                    </span>
                  </div>
                  <div className="text-amber-600">→</div>
                  <div>
                    <span className="text-xs text-amber-600">Override Grade:</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-bold rounded ${gradeColor(emp.overrideGrade)}`}>
                      {emp.overrideGrade}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-amber-700 mt-2">
                  <strong>Reason:</strong> {emp.overrideReason}
                </p>
              </div>
            }

            {/* Published Info */}
            {emp.isPublished && emp.publishedAt &&
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">Results Published</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Published on: {new Date(emp.publishedAt).toLocaleString()}
                </p>
              </div>
            }
          </div>

          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <Button variant="outline" onClick={() => setShowEmployeeModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </div>);

  };

  return (
    <div className="space-y-6 p-6">
      <ToastContainer />
      <EmployeeDetailModal />
      
      {/* Publish Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPublishModal}
        title="Publish Results"
        message={`Are you sure you want to publish appraisal results for ${
        selectedEmployees.length > 0 ?
        `${selectedEmployees.length} selected employee(s)` :
        `${unpublishedCount} unpublished employee(s)`}? This action will notify all affected employees.`
        }
        confirmText="Publish"
        cancelText="Cancel"
        onConfirm={publishResults}
        onCancel={() => setShowPublishModal(false)}
        isLoading={isPublishing} />


      {/* Bulk Override Modal */}
      <ConfirmationModal
        isOpen={showBulkOverrideModal}
        title="Bulk Override"
        message={`Apply override to ${selectedEmployees.length} selected employee(s)`}
        confirmText="Apply Override"
        cancelText="Cancel"
        onConfirm={applyBulkOverride}
        onCancel={() => {
          setShowBulkOverrideModal(false);
          setBulkOverrideGrade('');
          setBulkOverrideReason('');
        }}>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Override Grade
            </label>
            <select
              value={bulkOverrideGrade}
              onChange={(e) => setBulkOverrideGrade(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">

              <option value="">Select Grade...</option>
              {['A+', 'A', 'B+', 'B', 'C', 'D'].map((g) =>
              <option key={g} value={g}>{g}</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Override Reason
            </label>
            <textarea
              value={bulkOverrideReason}
              onChange={(e) => setBulkOverrideReason(e.target.value)}
              placeholder="Provide reason for bulk override..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />

          </div>
        </div>
      </ConfirmationModal>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Consolidation & Final Rating
          </h1>
          <p className="text-sm text-gray-500">
            Review weighted scores and publish final grades
            {lastSavedAt &&
            <span className="ml-2 text-green-600">
                · Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            }
            {isDirty &&
            <span className="ml-2 text-amber-600">· Unsaved changes</span>
            }
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={exportToExcel}
            disabled={isExporting || filtered.length === 0}>

            {isExporting ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Download className="w-4 h-4 mr-2" />
            }
            {isExporting ? 'Exporting...' : 'Export Excel'}
          </Button>
          <Button
            variant="outline"
            onClick={printToPDF}
            disabled={isPrinting || filtered.length === 0}>

            {isPrinting ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Printer className="w-4 h-4 mr-2" />
            }
            {isPrinting ? 'Preparing...' : 'Print PDF'}
          </Button>
          <Button
            variant="outline"
            onClick={saveChanges}
            disabled={isSaving || !isDirty}>

            {isSaving ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Save className="w-4 h-4 mr-2" />
            }
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="primary"
            onClick={openPublishModal}
            disabled={isPublishing || unpublishedCount === 0}>

            {isPublishing ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Send className="w-4 h-4 mr-2" />
            }
            {isPublishing ? 'Publishing...' : 'Publish Results'}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{filtered.length}</p>
            <p className="text-sm text-gray-500">Employees</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{avgScore}</p>
            <p className="text-sm text-gray-500">Avg Score</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {filtered.filter((e) => e.overrideGrade).length}
            </p>
            <p className="text-sm text-gray-500">Overridden</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{publishedCount}</p>
            <p className="text-sm text-gray-500">Published</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4">
          <p className="text-xs text-gray-500 mb-2">Grade Distribution</p>
          <div className="flex flex-wrap gap-1">
            {gradeDistribution.
            filter((g) => g.count > 0).
            map((g) =>
            <span
              key={g.grade}
              className={`px-2 py-1 text-xs font-bold rounded ${gradeColor(g.grade)}`}>

                  {g.grade}: {g.count}
                </span>
            )}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 &&
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-1">
                Validation Errors ({validationErrors.length})
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) =>
              <li key={index} className="text-sm text-red-700">
                    {error.message}
                  </li>
              )}
              </ul>
            </div>
          </div>
        </div>
      }

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or designation..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

        </div>
        <Select
          options={[
          { value: '', label: 'All Departments' },
          { value: 'Mathematics', label: 'Mathematics' },
          { value: 'Science', label: 'Science' },
          { value: 'English', label: 'English' },
          { value: 'Administration', label: 'Administration' },
          { value: 'Support Staff', label: 'Support Staff' }]
          }
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)} />

        <Select
          options={[
          { value: '', label: 'All Grades' },
          { value: 'A+', label: 'A+' },
          { value: 'A', label: 'A' },
          { value: 'B+', label: 'B+' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' }]
          }
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)} />

        <Button variant="outline" onClick={resetFilters}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" onClick={refreshData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
        <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
          <span>Weights:</span>
          <Badge variant="secondary">Self 10%</Badge>
          <Badge variant="secondary">Manager 60%</Badge>
          <Badge variant="secondary">Student 30%</Badge>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedEmployees.length > 0 &&
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-blue-800">
              {selectedEmployees.length} employee(s) selected
            </span>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkOverrideModal(true)}>

              <Award className="w-4 h-4 mr-2" />
              Bulk Override
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={clearBulkOverrides}>

              <X className="w-4 h-4 mr-2" />
              Clear Overrides
            </Button>
            <Button
            variant="primary"
            size="sm"
            onClick={openPublishModal}
            disabled={selectedEmployees.every((id) => data.find((e) => e.id === id)?.isPublished)}>

              <Send className="w-4 h-4 mr-2" />
              Publish Selected
            </Button>
          </div>
        </div>
      }

      {/* Table */}
      <Card>
        <div className="overflow-x-auto" ref={printRef}>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                </th>
                <th
                  className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}>

                  <div className="flex items-center gap-1">
                    Employee
                    {getSortIcon('name')}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('department')}>

                  <div className="flex items-center gap-1">
                    Department
                    {getSortIcon('department')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('selfScore')}>

                  <div className="flex items-center justify-center gap-1">
                    Self (10%)
                    {getSortIcon('selfScore')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('managerScore')}>

                  <div className="flex items-center justify-center gap-1">
                    Manager (60%)
                    {getSortIcon('managerScore')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('studentScore')}>

                  <div className="flex items-center justify-center gap-1">
                    Student (30%)
                    {getSortIcon('studentScore')}
                  </div>
                </th>
                <th
                  className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase bg-blue-50 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSort('calculatedFinal')}>

                  <div className="flex items-center justify-center gap-1">
                    Final Score
                    {getSortIcon('calculatedFinal')}
                  </div>
                </th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase bg-blue-50">
                  Grade
                </th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase">
                  Override
                </th>
                <th className="text-left py-3 px-3 text-xs font-semibold text-gray-600 uppercase">
                  Override Reason
                </th>
                <th className="text-center py-3 px-3 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ?
              <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No employees found matching your filters.</p>
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mt-3">
                      Reset Filters
                    </Button>
                  </td>
                </tr> :

              filtered.map((emp, i) => {
                const hasValidationError = validationErrors.some((e) => e.employeeId === emp.id);

                return (
                  <tr
                    key={emp.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                    i % 2 === 0 ? '' : 'bg-gray-50/30'} ${
                    hasValidationError ? 'bg-red-50' : ''} ${
                    emp.isPublished ? 'opacity-75' : ''}`
                    }>

                      <td className="py-3 px-3">
                        <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleSelectEmployee(emp.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />

                      </td>
                      <td className="py-3 px-3">
                        <p className="text-sm font-medium text-gray-900">
                          {emp.name}
                          {emp.isPublished &&
                        <CheckCircle className="w-3 h-3 inline ml-2 text-green-500" />
                        }
                        </p>
                        <p className="text-xs text-gray-500">
                          {emp.id} · {emp.designation}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">
                        {emp.department}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {emp.selfScore}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({(emp.selfScore * 0.1).toFixed(0)})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {emp.managerScore}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({(emp.managerScore * 0.6).toFixed(0)})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {emp.studentScore > 0 ?
                      <>
                            <span className="text-sm font-semibold text-gray-700">
                              {emp.studentScore}
                            </span>
                            <span className="text-xs text-gray-400 ml-1">
                              ({(emp.studentScore * 0.3).toFixed(0)})
                            </span>
                          </> :

                      <span className="text-xs text-gray-400">N/A</span>
                      }
                      </td>
                      <td className="py-3 px-3 text-center bg-blue-50/50">
                        <span
                        className={`text-lg font-bold ${scoreColor(emp.calculatedFinal)}`}>

                          {emp.calculatedFinal}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center bg-blue-50/50">
                        <span
                        className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${gradeColor(emp.overrideGrade || emp.finalGrade)}`}>

                          {emp.overrideGrade || emp.finalGrade}
                        </span>
                        {emp.overrideGrade &&
                      <span className="text-xs text-gray-400 ml-1">
                            ({emp.finalGrade})
                          </span>
                      }
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center gap-1">
                          <select
                          value={emp.overrideGrade}
                          onChange={(e) => setOverride(emp.id, e.target.value)}
                          disabled={emp.isPublished}
                          className={`px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          emp.isPublished ? 'bg-gray-100 cursor-not-allowed' : ''}`
                          }>

                            <option value="">—</option>
                            {['A+', 'A', 'B+', 'B', 'C', 'D'].map((g) =>
                          <option key={g} value={g}>
                                {g}
                              </option>
                          )}
                          </select>
                          {emp.overrideGrade && !emp.isPublished &&
                        <button
                          onClick={() => clearOverride(emp.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                          title="Clear override">

                              <X className="w-3 h-3" />
                            </button>
                        }
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {emp.overrideGrade &&
                      <input
                        type="text"
                        value={emp.overrideReason}
                        onChange={(e) => setOverrideReason(emp.id, e.target.value)}
                        placeholder="Reason required..."
                        disabled={emp.isPublished}
                        className={`w-full px-2 py-1 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        !emp.overrideReason && !emp.isPublished ?
                        'border-red-300 bg-red-50' :
                        'border-gray-300'} ${
                        emp.isPublished ? 'bg-gray-100 cursor-not-allowed' : ''}`} />

                      }
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                        onClick={() => viewEmployeeDetails(emp)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="View Details">

                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>);

              })
              }
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {filtered.length} of {data.length} employees
          </span>
          <span>
            {publishedCount} published · {unpublishedCount} pending
          </span>
        </div>
      </Card>
    </div>);

}