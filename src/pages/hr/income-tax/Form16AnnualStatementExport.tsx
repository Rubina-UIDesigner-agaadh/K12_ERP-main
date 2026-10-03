import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  FileText,
  Mail,
  CheckCircle,
  Users,
  Eye,
  X,
  Loader2,
  AlertCircle,
  RefreshCw } from
'lucide-react';

// Types
interface Employee {
  id: string;
  name: string;
  code: string;
  email: string;
  pan: string;
  regime: 'New' | 'Old';
  department: string;
  gross: number;
  tax: number;
  status: 'Generated' | 'Pending' | 'Processing' | 'Error';
  generatedDate?: string;
  downloadCount: number;
  lastDownloaded?: string;
  lastEmailed?: string;
}

interface Form16Data {
  employeeId: string;
  employeeName: string;
  employeePan: string;
  employeeCode: string;
  employeeEmail: string;
  financialYear: string;
  assessmentYear: string;
  grossSalary: number;
  exemptions: number;
  deductions: number;
  taxableIncome: number;
  taxOnIncome: number;
  rebate87A: number;
  healthEducationCess: number;
  totalTaxLiability: number;
  employerName: string;
  employerTan: string;
  employerPan: string;
  generatedOn: string;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface StatsSummary {
  totalEligible: number;
  formsGenerated: number;
  pendingGeneration: number;
  downloadedCount: number;
}

// Initial mock data
const initialEmployees: Employee[] = [
{
  id: '1',
  name: 'Rajesh Kumar',
  code: 'EMP001',
  email: 'rajesh.kumar@school.edu',
  pan: 'ABCDE1234F',
  regime: 'New',
  department: 'IT',
  gross: 1200000,
  tax: 112500,
  status: 'Generated',
  generatedDate: '2025-04-15',
  downloadCount: 2,
  lastDownloaded: '2025-04-20',
  lastEmailed: '2025-04-15'
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  email: 'priya.sharma@school.edu',
  pan: 'FGHIJ5678K',
  regime: 'Old',
  department: 'HR',
  gross: 950000,
  tax: 62500,
  status: 'Generated',
  generatedDate: '2025-04-14',
  downloadCount: 1,
  lastDownloaded: '2025-04-18'
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  email: 'amit.patel@school.edu',
  pan: 'LMNOP9012Q',
  regime: 'New',
  department: 'Finance',
  gross: 1500000,
  tax: 195000,
  status: 'Pending',
  downloadCount: 0
},
{
  id: '4',
  name: 'Sneha Gupta',
  code: 'EMP004',
  email: 'sneha.gupta@school.edu',
  pan: 'RSTUV3456W',
  regime: 'Old',
  department: 'IT',
  gross: 800000,
  tax: 45000,
  status: 'Generated',
  generatedDate: '2025-04-13',
  downloadCount: 3,
  lastDownloaded: '2025-04-22',
  lastEmailed: '2025-04-13'
},
{
  id: '5',
  name: 'Vikram Singh',
  code: 'EMP005',
  email: 'vikram.singh@school.edu',
  pan: 'WXYZA7890B',
  regime: 'New',
  department: 'Operations',
  gross: 1100000,
  tax: 97500,
  status: 'Pending',
  downloadCount: 0
},
{
  id: '6',
  name: 'Anita Desai',
  code: 'EMP006',
  email: 'anita.desai@school.edu',
  pan: 'CDEFG1234H',
  regime: 'Old',
  department: 'HR',
  gross: 750000,
  tax: 37500,
  status: 'Error',
  downloadCount: 0
},
{
  id: '7',
  name: 'Rohit Mehta',
  code: 'EMP007',
  email: 'rohit.mehta@school.edu',
  pan: 'IJKLM5678N',
  regime: 'New',
  department: 'Finance',
  gross: 1350000,
  tax: 157500,
  status: 'Generated',
  generatedDate: '2025-04-12',
  downloadCount: 0
},
{
  id: '8',
  name: 'Kavita Reddy',
  code: 'EMP008',
  email: 'kavita.reddy@school.edu',
  pan: 'OPQRS9012T',
  regime: 'Old',
  department: 'IT',
  gross: 900000,
  tax: 52500,
  status: 'Pending',
  downloadCount: 0
}];


const fiscalYearOptions = [
{ value: '2024-25', label: 'FY 2024-25' },
{ value: '2023-24', label: 'FY 2023-24' },
{ value: '2022-23', label: 'FY 2022-23' }];


const departmentOptions = [
{ value: 'all', label: 'All Departments' },
{ value: 'IT', label: 'IT' },
{ value: 'HR', label: 'HR' },
{ value: 'Finance', label: 'Finance' },
{ value: 'Operations', label: 'Operations' }];


const regimeOptions = [
{ value: 'all', label: 'All Regimes' },
{ value: 'New', label: 'New Regime' },
{ value: 'Old', label: 'Old Regime' }];


const statusOptions = [
{ value: 'all', label: 'All Status' },
{ value: 'Generated', label: 'Generated' },
{ value: 'Pending', label: 'Pending' },
{ value: 'Processing', label: 'Processing' },
{ value: 'Error', label: 'Error' }];


export function Form16AnnualStatementExport() {
  // State management
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewEmployee, setPreviewEmployee] = useState<Employee | null>(null);
  const [previewForm16Data, setPreviewForm16Data] = useState<Form16Data | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState('2024-25');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRegime, setSelectedRegime] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Loading states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [processingEmployeeIds, setProcessingEmployeeIds] = useState<string[]>([]);

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState<Employee[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
      searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
      selectedDepartment === 'all' || emp.department === selectedDepartment;

      const matchesRegime =
      selectedRegime === 'all' || emp.regime === selectedRegime;

      const matchesStatus =
      selectedStatus === 'all' || emp.status === selectedStatus;

      return matchesSearch && matchesDepartment && matchesRegime && matchesStatus;
    });
  }, [employees, searchQuery, selectedDepartment, selectedRegime, selectedStatus]);

  // Statistics calculation
  const stats: StatsSummary = useMemo(() => {
    return {
      totalEligible: employees.length,
      formsGenerated: employees.filter((e) => e.status === 'Generated').length,
      pendingGeneration: employees.filter(
        (e) => e.status === 'Pending' || e.status === 'Error'
      ).length,
      downloadedCount: employees.reduce((acc, e) => acc + e.downloadCount, 0)
    };
  }, [employees]);

  // Notification helper
  const addNotification = useCallback(
    (type: Notification['type'], message: string) => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 5000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Toggle employee selection
  const toggleEmployee = useCallback((id: string) => {
    setSelectedEmployees((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  // Toggle all employees selection
  const toggleAll = useCallback(() => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((e) => e.id));
    }
  }, [selectedEmployees.length, filteredEmployees]);

  // Generate Form-16 data for an employee
  const generateForm16Data = useCallback(
    (employee: Employee): Form16Data => {
      const exemptions = Math.round(employee.gross * 0.05);
      const deductions = Math.round(employee.gross * 0.15);
      const taxableIncome = employee.gross - exemptions - deductions;
      const rebate87A = taxableIncome <= 500000 ? Math.min(employee.tax, 12500) : 0;
      const healthEducationCess = Math.round((employee.tax - rebate87A) * 0.04);
      const totalTaxLiability = employee.tax - rebate87A + healthEducationCess;

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        employeePan: employee.pan,
        employeeCode: employee.code,
        employeeEmail: employee.email,
        financialYear: selectedFiscalYear,
        assessmentYear: getAssessmentYear(selectedFiscalYear),
        grossSalary: employee.gross,
        exemptions,
        deductions,
        taxableIncome,
        taxOnIncome: employee.tax,
        rebate87A,
        healthEducationCess,
        totalTaxLiability,
        employerName: 'ABC International School',
        employerTan: 'DELA12345E',
        employerPan: 'AAACA1234A',
        generatedOn: new Date().toISOString()
      };
    },
    [selectedFiscalYear]
  );

  // Get assessment year from fiscal year
  const getAssessmentYear = (fiscalYear: string): string => {
    const [startYear, endYear] = fiscalYear.split('-');
    return `20${endYear}-${parseInt(endYear) + 1}`;
  };

  // Open preview modal
  const openPreview = useCallback(
    (employee: Employee) => {
      setPreviewEmployee(employee);
      setPreviewForm16Data(generateForm16Data(employee));
      setShowPreview(true);
    },
    [generateForm16Data]
  );

  // Close preview modal
  const closePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewEmployee(null);
    setPreviewForm16Data(null);
  }, []);

  // Generate Form-16 for single employee
  const generateForm16Single = useCallback(
    async (employeeId: string) => {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return;

      if (employee.status === 'Generated') {
        addNotification('info', `Form-16 already generated for ${employee.name}`);
        return;
      }

      setProcessingEmployeeIds((prev) => [...prev, employeeId]);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setEmployees((prev) =>
        prev.map((e) =>
        e.id === employeeId ?
        {
          ...e,
          status: 'Generated' as const,
          generatedDate: new Date().toISOString().split('T')[0]
        } :
        e
        )
        );

        addNotification('success', `Form-16 generated successfully for ${employee.name}`);
      } catch (error) {
        setEmployees((prev) =>
        prev.map((e) => e.id === employeeId ? { ...e, status: 'Error' as const } : e)
        );
        addNotification('error', `Failed to generate Form-16 for ${employee.name}`);
      } finally {
        setProcessingEmployeeIds((prev) => prev.filter((id) => id !== employeeId));
      }
    },
    [employees, addNotification]
  );

  // Generate Form-16 for selected employees
  const generateForm16Selected = useCallback(async () => {
    if (selectedEmployees.length === 0) {
      addNotification('warning', 'Please select at least one employee');
      return;
    }

    const pendingEmployees = employees.filter(
      (e) => selectedEmployees.includes(e.id) && e.status !== 'Generated'
    );

    if (pendingEmployees.length === 0) {
      addNotification('info', 'All selected employees already have Form-16 generated');
      return;
    }

    setIsGenerating(true);
    setProcessingEmployeeIds(pendingEmployees.map((e) => e.id));

    try {
      // Simulate batch processing
      for (const emp of pendingEmployees) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEmployees((prev) =>
        prev.map((e) =>
        e.id === emp.id ?
        {
          ...e,
          status: 'Generated' as const,
          generatedDate: new Date().toISOString().split('T')[0]
        } :
        e
        )
        );
      }

      addNotification(
        'success',
        `Form-16 generated successfully for ${pendingEmployees.length} employee(s)`
      );
      setSelectedEmployees([]);
    } catch (error) {
      addNotification('error', 'Failed to generate Form-16 for some employees');
    } finally {
      setIsGenerating(false);
      setProcessingEmployeeIds([]);
    }
  }, [selectedEmployees, employees, addNotification]);

  // Generate Form-16 for all pending employees
  const generateForm16All = useCallback(async () => {
    const pendingEmployees = employees.filter(
      (e) => e.status === 'Pending' || e.status === 'Error'
    );

    if (pendingEmployees.length === 0) {
      addNotification('info', 'All employees already have Form-16 generated');
      return;
    }

    setConfirmAction({
      type: 'generate',
      message: `Are you sure you want to generate Form-16 for ${pendingEmployees.length} pending employee(s)?`,
      onConfirm: async () => {
        setShowConfirmModal(false);
        setIsGenerating(true);
        setProcessingEmployeeIds(pendingEmployees.map((e) => e.id));

        try {
          for (const emp of pendingEmployees) {
            await new Promise((resolve) => setTimeout(resolve, 800));

            setEmployees((prev) =>
            prev.map((e) =>
            e.id === emp.id ?
            {
              ...e,
              status: 'Generated' as const,
              generatedDate: new Date().toISOString().split('T')[0]
            } :
            e
            )
            );
          }

          addNotification(
            'success',
            `Form-16 generated successfully for ${pendingEmployees.length} employee(s)`
          );
        } catch (error) {
          addNotification('error', 'Failed to generate Form-16 for some employees');
        } finally {
          setIsGenerating(false);
          setProcessingEmployeeIds([]);
        }
      }
    });
    setShowConfirmModal(true);
  }, [employees, addNotification]);

  // Download Form-16 for single employee
  const downloadForm16Single = useCallback(
    async (employeeId: string) => {
      const employee = employees.find((e) => e.id === employeeId);
      if (!employee) return;

      if (employee.status !== 'Generated') {
        addNotification('warning', `Please generate Form-16 for ${employee.name} first`);
        return;
      }

      setProcessingEmployeeIds((prev) => [...prev, employeeId]);

      try {
        // Simulate download
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const form16Data = generateForm16Data(employee);
        const blob = new Blob([JSON.stringify(form16Data, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Form16_${employee.code}_${selectedFiscalYear}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Update download count
        setEmployees((prev) =>
        prev.map((e) =>
        e.id === employeeId ?
        {
          ...e,
          downloadCount: e.downloadCount + 1,
          lastDownloaded: new Date().toISOString().split('T')[0]
        } :
        e
        )
        );

        addNotification('success', `Form-16 downloaded for ${employee.name}`);
      } catch (error) {
        addNotification('error', `Failed to download Form-16 for ${employee.name}`);
      } finally {
        setProcessingEmployeeIds((prev) => prev.filter((id) => id !== employeeId));
      }
    },
    [employees, generateForm16Data, selectedFiscalYear, addNotification]
  );

  // Download Form-16 for selected employees
  const downloadForm16Selected = useCallback(async () => {
    if (selectedEmployees.length === 0) {
      addNotification('warning', 'Please select at least one employee');
      return;
    }

    const generatedEmployees = employees.filter(
      (e) => selectedEmployees.includes(e.id) && e.status === 'Generated'
    );

    if (generatedEmployees.length === 0) {
      addNotification(
        'warning',
        'None of the selected employees have Form-16 generated'
      );
      return;
    }

    setIsDownloading(true);
    setProcessingEmployeeIds(generatedEmployees.map((e) => e.id));

    try {
      // Simulate batch download preparation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const downloadData = generatedEmployees.map((emp) => ({
        employee: emp,
        form16: generateForm16Data(emp)
      }));

      const blob = new Blob([JSON.stringify(downloadData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Form16_Batch_${selectedFiscalYear}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update download counts
      setEmployees((prev) =>
      prev.map((e) =>
      generatedEmployees.some((ge) => ge.id === e.id) ?
      {
        ...e,
        downloadCount: e.downloadCount + 1,
        lastDownloaded: new Date().toISOString().split('T')[0]
      } :
      e
      )
      );

      addNotification(
        'success',
        `Form-16 downloaded for ${generatedEmployees.length} employee(s)`
      );
      setSelectedEmployees([]);
    } catch (error) {
      addNotification('error', 'Failed to download Form-16 files');
    } finally {
      setIsDownloading(false);
      setProcessingEmployeeIds([]);
    }
  }, [selectedEmployees, employees, generateForm16Data, selectedFiscalYear, addNotification]);

  // Download all as ZIP
  const downloadAllAsZip = useCallback(async () => {
    const generatedEmployees = employees.filter((e) => e.status === 'Generated');

    if (generatedEmployees.length === 0) {
      addNotification('warning', 'No Form-16 available for download');
      return;
    }

    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const downloadData = generatedEmployees.map((emp) => ({
        employee: emp,
        form16: generateForm16Data(emp)
      }));

      const blob = new Blob([JSON.stringify(downloadData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Form16_All_${selectedFiscalYear}_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification(
        'success',
        `All Form-16 files downloaded (${generatedEmployees.length} files)`
      );
    } catch (error) {
      addNotification('error', 'Failed to download ZIP file');
    } finally {
      setIsDownloading(false);
    }
  }, [employees, generateForm16Data, selectedFiscalYear, addNotification]);

  // Open email modal for single employee
  const openEmailModalSingle = useCallback(
    (employee: Employee) => {
      if (employee.status !== 'Generated') {
        addNotification('warning', `Please generate Form-16 for ${employee.name} first`);
        return;
      }

      setEmailRecipients([employee]);
      setEmailSubject(`Form-16 for Financial Year ${selectedFiscalYear}`);
      setEmailBody(
        `Dear ${employee.name},\n\nPlease find attached your Form-16 for the Financial Year ${selectedFiscalYear}.\n\nThis is a system-generated email. For any queries, please contact the HR department.\n\nBest Regards,\nHR Department\nABC International School`
      );
      setCcEmail('');
      setBccEmail('');
      setShowEmailModal(true);
    },
    [selectedFiscalYear, addNotification]
  );

  // Open email modal for selected employees
  const openEmailModalSelected = useCallback(() => {
    if (selectedEmployees.length === 0) {
      addNotification('warning', 'Please select at least one employee');
      return;
    }

    const generatedEmployees = employees.filter(
      (e) => selectedEmployees.includes(e.id) && e.status === 'Generated'
    );

    if (generatedEmployees.length === 0) {
      addNotification(
        'warning',
        'None of the selected employees have Form-16 generated'
      );
      return;
    }

    setEmailRecipients(generatedEmployees);
    setEmailSubject(`Form-16 for Financial Year ${selectedFiscalYear}`);
    setEmailBody(
      `Dear Employee,\n\nPlease find attached your Form-16 for the Financial Year ${selectedFiscalYear}.\n\nThis is a system-generated email. For any queries, please contact the HR department.\n\nBest Regards,\nHR Department\nABC International School`
    );
    setCcEmail('');
    setBccEmail('');
    setShowEmailModal(true);
  }, [selectedEmployees, employees, selectedFiscalYear, addNotification]);

  // Send email
  const sendEmail = useCallback(async () => {
    if (emailRecipients.length === 0) return;

    setIsEmailing(true);

    try {
      // Simulate sending emails
      for (const recipient of emailRecipients) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Update last emailed date
      setEmployees((prev) =>
      prev.map((e) =>
      emailRecipients.some((r) => r.id === e.id) ?
      {
        ...e,
        lastEmailed: new Date().toISOString().split('T')[0]
      } :
      e
      )
      );

      addNotification(
        'success',
        `Form-16 emailed successfully to ${emailRecipients.length} employee(s)`
      );
      setShowEmailModal(false);
      setSelectedEmployees([]);
    } catch (error) {
      addNotification('error', 'Failed to send emails');
    } finally {
      setIsEmailing(false);
    }
  }, [emailRecipients, addNotification]);

  // Retry failed generation
  const retryGeneration = useCallback(
    async (employeeId: string) => {
      await generateForm16Single(employeeId);
    },
    [generateForm16Single]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedDepartment('all');
    setSelectedRegime('all');
    setSelectedStatus('all');
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  // Cancel selection
  const cancelSelection = useCallback(() => {
    setSelectedEmployees([]);
  }, []);

  // Download PDF from preview
  const downloadPreviewPdf = useCallback(async () => {
    if (!previewEmployee || !previewForm16Data) return;

    setIsDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const blob = new Blob([JSON.stringify(previewForm16Data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Form16_${previewEmployee.code}_${selectedFiscalYear}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Update download count
      setEmployees((prev) =>
      prev.map((e) =>
      e.id === previewEmployee.id ?
      {
        ...e,
        downloadCount: e.downloadCount + 1,
        lastDownloaded: new Date().toISOString().split('T')[0]
      } :
      e
      )
      );

      addNotification('success', `Form-16 downloaded for ${previewEmployee.name}`);
    } catch (error) {
      addNotification('error', 'Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  }, [previewEmployee, previewForm16Data, selectedFiscalYear, addNotification]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) =>
        <div
          key={notification.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' ?
          'bg-green-50 border border-green-200' :
          notification.type === 'error' ?
          'bg-red-50 border border-red-200' :
          notification.type === 'warning' ?
          'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'}`
          }>

            {notification.type === 'success' &&
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          }
            {notification.type === 'error' &&
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          }
            {notification.type === 'warning' &&
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          }
            {notification.type === 'info' &&
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          }
            <span
            className={`text-sm ${
            notification.type === 'success' ?
            'text-green-800' :
            notification.type === 'error' ?
            'text-red-800' :
            notification.type === 'warning' ?
            'text-yellow-800' :
            'text-blue-800'}`
            }>

              {notification.message}
            </span>
            <button
            onClick={() => removeNotification(notification.id)}
            className="ml-auto">

              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Form-16 / Annual Statement Data Export
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            HR {'>'} Payroll {'>'} Income Tax {'>'} Reports
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadAllAsZip}
            disabled={isDownloading || stats.formsGenerated === 0}>

            {isDownloading ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <Download className="w-4 h-4 mr-2" />
            }
            Download ZIP
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Select
            options={fiscalYearOptions}
            value={selectedFiscalYear}
            onChange={(e) => setSelectedFiscalYear(e.target.value)} />

          <Select
            options={departmentOptions}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)} />

          <Select
            options={regimeOptions}
            value={selectedRegime}
            onChange={(e) => setSelectedRegime(e.target.value)} />

          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search employee..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange} />

          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex-shrink-0">

              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={generateForm16All}
              disabled={isGenerating || stats.pendingGeneration === 0}>

              {isGenerating ?
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

              <FileText className="w-4 h-4 mr-2" />
              }
              Generate All
            </Button>
          </div>
        </div>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalEligible}</p>
          <p className="text-sm text-gray-600">Total Employees Eligible</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">{stats.formsGenerated}</p>
          <p className="text-sm text-gray-600">Forms Generated</p>
        </Card>

        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-700">
            {stats.pendingGeneration}
          </p>
          <p className="text-sm text-gray-600">Pending Generation</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <Download className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-700">
            {stats.downloadedCount}
          </p>
          <p className="text-sm text-gray-600">Downloaded Count</p>
        </Card>
      </div>

      {/* Form-16 Generation Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={
                    filteredEmployees.length > 0 &&
                    selectedEmployees.length === filteredEmployees.length
                    }
                    onChange={toggleAll}
                    className="rounded"
                    disabled={filteredEmployees.length === 0} />

                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">
                  Employee Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  PAN
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Regime
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Annual Gross
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">
                  Total Tax
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Form Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ?
              <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No employees found matching the current filters.
                  </td>
                </tr> :

              filteredEmployees.map((emp) =>
              <tr
                key={emp.id}
                className={`hover:bg-gray-50 ${
                selectedEmployees.includes(emp.id) ? 'bg-blue-50' : ''}`
                }>

                    <td className="px-4 py-3 text-center">
                      <input
                    type="checkbox"
                    checked={selectedEmployees.includes(emp.id)}
                    onChange={() => toggleEmployee(emp.id)}
                    className="rounded"
                    disabled={processingEmployeeIds.includes(emp.id)} />

                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-xs text-gray-500">{emp.code}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-sm text-gray-700">
                        {emp.pan.slice(0, 6)}****
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-700">{emp.department}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    emp.regime === 'New' ?
                    'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                    }>

                        {emp.regime}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(emp.gross)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      {formatCurrency(emp.tax)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                      className={
                      emp.status === 'Generated' ?
                      'bg-green-100 text-green-700 border border-green-300' :
                      emp.status === 'Pending' ?
                      'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                      emp.status === 'Processing' ?
                      'bg-blue-100 text-blue-700 border border-blue-300' :
                      'bg-red-100 text-red-700 border border-red-300'
                      }>

                          {processingEmployeeIds.includes(emp.id) ?
                      <span className="flex items-center gap-1">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing
                            </span> :

                      emp.status
                      }
                        </Badge>
                        {emp.generatedDate &&
                    <span className="text-xs text-gray-500">
                            {formatDate(emp.generatedDate)}
                          </span>
                    }
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {emp.status === 'Error' ?
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryGeneration(emp.id)}
                      disabled={processingEmployeeIds.includes(emp.id)}
                      title="Retry Generation">

                            <RefreshCw className="w-4 h-4" />
                          </Button> :

                    <>
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openPreview(emp)}
                        disabled={
                        emp.status !== 'Generated' ||
                        processingEmployeeIds.includes(emp.id)
                        }
                        title="Preview Form-16">

                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadForm16Single(emp.id)}
                        disabled={
                        emp.status !== 'Generated' ||
                        processingEmployeeIds.includes(emp.id)
                        }
                        title="Download Form-16">

                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEmailModalSingle(emp)}
                        disabled={
                        emp.status !== 'Generated' ||
                        processingEmployeeIds.includes(emp.id)
                        }
                        title="Email Form-16">

                              <Mail className="w-4 h-4" />
                            </Button>
                          </>
                    }
                        {emp.status === 'Pending' &&
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateForm16Single(emp.id)}
                      disabled={processingEmployeeIds.includes(emp.id)}
                      title="Generate Form-16">

                            <FileText className="w-4 h-4" />
                          </Button>
                    }
                      </div>
                    </td>
                  </tr>
              )
              }
            </tbody>
          </table>
        </div>

        {/* Bulk Action Bar */}
        {selectedEmployees.length > 0 &&
        <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                {selectedEmployees.length} employee(s) selected
              </span>
              <div className="flex gap-3">
                <Button variant="outline" onClick={cancelSelection}>
                  Cancel
                </Button>
                <Button
                variant="outline"
                onClick={generateForm16Selected}
                disabled={isGenerating}>

                  {isGenerating ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <FileText className="w-4 h-4 mr-2" />
                }
                  Generate Selected
                </Button>
                <Button
                variant="outline"
                onClick={downloadForm16Selected}
                disabled={isDownloading}>

                  {isDownloading ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Download className="w-4 h-4 mr-2" />
                }
                  Download Selected
                </Button>
                <Button variant="primary" onClick={openEmailModalSelected}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Selected
                </Button>
              </div>
            </div>
          </div>
        }

        {/* Table Footer with Summary */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
            <div className="flex gap-4">
              <span>
                Total Gross:{' '}
                <strong>
                  {formatCurrency(
                    filteredEmployees.reduce((acc, e) => acc + e.gross, 0)
                  )}
                </strong>
              </span>
              <span>
                Total Tax:{' '}
                <strong>
                  {formatCurrency(
                    filteredEmployees.reduce((acc, e) => acc + e.tax, 0)
                  )}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Form-16 Preview Modal */}
      {showPreview && previewEmployee && previewForm16Data &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Form-16 Preview</h2>
                <Button variant="ghost" size="sm" onClick={closePreview}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form-16 Content */}
              <div className="border-2 border-gray-300 rounded-lg p-8 bg-white">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {previewForm16Data.employerName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    TAN: {previewForm16Data.employerTan} | PAN:{' '}
                    {previewForm16Data.employerPan}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-md font-bold text-gray-900">FORM NO. 16</h4>
                  <p className="text-sm text-gray-600">[See rule 31(1)(a)]</p>
                  <p className="text-sm text-gray-600">
                    Certificate under section 203 of the Income-tax Act, 1961
                  </p>
                  <p className="text-sm text-gray-600">
                    for tax deducted at source on salary
                  </p>
                </div>

                {/* Employee Details */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm border rounded-lg p-4 bg-gray-50">
                  <div>
                    <p className="text-gray-600">Name of Employee</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.employeeName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee Code</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.employeeCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">PAN of Employee</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.employeePan}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.employeeEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Financial Year</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.financialYear}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assessment Year</p>
                    <p className="font-medium text-gray-900">
                      {previewForm16Data.assessmentYear}
                    </p>
                  </div>
                </div>

                {/* Income Summary */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                    Income Summary
                  </h5>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 text-gray-700">Gross Salary</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹{previewForm16Data.grossSalary.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">Less: Exemptions</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹{previewForm16Data.exemptions.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">
                          Less: Deductions (Chapter VI-A)
                        </td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹{previewForm16Data.deductions.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-300">
                        <td className="py-2 font-semibold text-gray-900">
                          Taxable Income
                        </td>
                        <td className="py-2 text-right font-bold text-blue-600">
                          ₹{previewForm16Data.taxableIncome.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Tax Summary */}
                <div className="mb-6">
                  <h5 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                    Tax Summary
                  </h5>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-2 text-gray-700">Tax on Income</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹{previewForm16Data.taxOnIncome.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">Less: Rebate u/s 87A</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹{previewForm16Data.rebate87A.toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-gray-700">
                          Health & Education Cess (4%)
                        </td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ₹
                          {previewForm16Data.healthEducationCess.toLocaleString(
                          'en-IN'
                        )}
                        </td>
                      </tr>
                      <tr className="border-t-2 border-gray-300">
                        <td className="py-2 font-semibold text-gray-900">
                          Total Tax Liability
                        </td>
                        <td className="py-2 text-right font-bold text-green-600">
                          ₹
                          {previewForm16Data.totalTaxLiability.toLocaleString(
                          'en-IN'
                        )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Generation Info */}
                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Generated On:</strong>{' '}
                    {formatDate(previewForm16Data.generatedOn)}
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
                  <p>
                    This is a computer-generated document and does not require a
                    signature
                  </p>
                  <p className="mt-1">
                    Generated by {previewForm16Data.employerName} HRMS System
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-3 mt-6">
                <div className="flex gap-3">
                  <Button
                  variant="outline"
                  onClick={() => openEmailModalSingle(previewEmployee)}>

                    <Mail className="w-4 h-4 mr-2" />
                    Email to Employee
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={closePreview}>
                    Close
                  </Button>
                  <Button
                  variant="primary"
                  onClick={downloadPreviewPdf}
                  disabled={isDownloading}>

                    {isDownloading ?
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                  <Download className="w-4 h-4 mr-2" />
                  }
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Email Modal */}
      {showEmailModal &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Email Form-16 to{' '}
                  {emailRecipients.length === 1 ?
                emailRecipients[0].name :
                `${emailRecipients.length} Employees`}
                </h2>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEmailModal(false)}>

                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Recipients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-2">
                      {emailRecipients.map((recipient) =>
                    <span
                      key={recipient.id}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">

                          {recipient.email}
                        </span>
                    )}
                    </div>
                  </div>
                </div>

                {/* CC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CC (Optional)
                  </label>
                  <Input
                  type="email"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="Enter CC email addresses separated by comma" />

                </div>

                {/* BCC */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BCC (Optional)
                  </label>
                  <Input
                  type="email"
                  value={bccEmail}
                  onChange={(e) => setBccEmail(e.target.value)}
                  placeholder="Enter BCC email addresses separated by comma" />

                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject" />

                </div>

                {/* Body */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={8}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter email message" />

                </div>

                {/* Attachment Info */}
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Attachment
                      </p>
                      <p className="text-sm text-yellow-700">
                        Form-16 PDF will be automatically attached to the email for
                        each recipient.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowEmailModal(false)}>
                  Cancel
                </Button>
                <Button
                variant="primary"
                onClick={sendEmail}
                disabled={isEmailing || !emailSubject.trim() || !emailBody.trim()}>

                  {isEmailing ?
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

                <Mail className="w-4 h-4 mr-2" />
                }
                  Send Email{emailRecipients.length > 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }

      {/* Confirmation Modal */}
      {showConfirmModal && confirmAction &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Confirm Action</h2>
              </div>

              <p className="text-gray-600 mb-6">{confirmAction.message}</p>

              <div className="flex justify-end gap-3">
                <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmAction(null);
                }}>

                  Cancel
                </Button>
                <Button variant="primary" onClick={confirmAction.onConfirm}>
                  Confirm
                </Button>
              </div>
            </div>
          </Card>
        </div>
      }
    </div>);

}