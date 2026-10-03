// src/pages/hr/payroll/TdsDeductionReport.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import {
  Download,
  Printer,
  BarChart3,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Mail,
  Eye,
  X } from
'lucide-react';

interface EmployeeData {
  id: string;
  name: string;
  code: string;
  email: string;
  pan: string;
  department: string;
  gross: number;
  taxable: number;
  monthly: number;
  cumulative: number;
  adjustment: number;
  net: number;
  regime: 'New' | 'Old';
  financialYear: string;
}

interface DepartmentData {
  id: string;
  dept: string;
  amount: number;
  employees: number;
  percentage: number;
  avgTds: number;
  highestTds: number;
  lowestTds: number;
  totalGross: number;
  totalTaxable: number;
}

interface MonthlyTdsData {
  month: string;
  totalTds: number;
  employees: number;
  avgTds: number;
}

const initialEmployees: EmployeeData[] = [
{
  id: '1',
  name: 'Rajesh Kumar',
  code: 'EMP001',
  email: 'rajesh.kumar@company.com',
  pan: 'ABCDE1234F',
  department: 'IT',
  gross: 100000,
  taxable: 83333,
  monthly: 9375,
  cumulative: 84375,
  adjustment: 0,
  net: 9375,
  regime: 'New',
  financialYear: '2024-25'
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  email: 'priya.sharma@company.com',
  pan: 'FGHIJ5678K',
  department: 'HR',
  gross: 79167,
  taxable: 62500,
  monthly: 5208,
  cumulative: 46875,
  adjustment: 0,
  net: 5208,
  regime: 'Old',
  financialYear: '2024-25'
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  email: 'amit.patel@company.com',
  pan: 'LMNOP9012Q',
  department: 'Finance',
  gross: 125000,
  taxable: 111667,
  monthly: 16250,
  cumulative: 146250,
  adjustment: 0,
  net: 16250,
  regime: 'New',
  financialYear: '2024-25'
},
{
  id: '4',
  name: 'Sneha Reddy',
  code: 'EMP004',
  email: 'sneha.reddy@company.com',
  pan: 'RSTUV3456W',
  department: 'IT',
  gross: 66667,
  taxable: 54167,
  monthly: 3542,
  cumulative: 31875,
  adjustment: 0,
  net: 3542,
  regime: 'Old',
  financialYear: '2024-25'
},
{
  id: '5',
  name: 'Vikram Singh',
  code: 'EMP005',
  email: 'vikram.singh@company.com',
  pan: 'XYZAB7890C',
  department: 'Finance',
  gross: 150000,
  taxable: 133333,
  monthly: 21250,
  cumulative: 191250,
  adjustment: 0,
  net: 21250,
  regime: 'New',
  financialYear: '2024-25'
},
{
  id: '6',
  name: 'Kavita Joshi',
  code: 'EMP006',
  email: 'kavita.joshi@company.com',
  pan: 'DEFGH2345I',
  department: 'HR',
  gross: 58333,
  taxable: 45833,
  monthly: 1875,
  cumulative: 16875,
  adjustment: 0,
  net: 1875,
  regime: 'Old',
  financialYear: '2024-25'
},
{
  id: '7',
  name: 'Rahul Verma',
  code: 'EMP007',
  email: 'rahul.verma@company.com',
  pan: 'JKLMN6789O',
  department: 'IT',
  gross: 166667,
  taxable: 150000,
  monthly: 27500,
  cumulative: 247500,
  adjustment: 0,
  net: 27500,
  regime: 'New',
  financialYear: '2024-25'
},
{
  id: '8',
  name: 'Anita Desai',
  code: 'EMP008',
  email: 'anita.desai@company.com',
  pan: 'PQRST1234U',
  department: 'Operations',
  gross: 91667,
  taxable: 75000,
  monthly: 6042,
  cumulative: 54375,
  adjustment: 0,
  net: 6042,
  regime: 'Old',
  financialYear: '2024-25'
},
{
  id: '9',
  name: 'Suresh Menon',
  code: 'EMP009',
  email: 'suresh.menon@company.com',
  pan: 'VWXYZ5678A',
  department: 'Sales',
  gross: 50000,
  taxable: 37500,
  monthly: 1042,
  cumulative: 9375,
  adjustment: 0,
  net: 1042,
  regime: 'New',
  financialYear: '2024-25'
},
{
  id: '10',
  name: 'Deepa Nair',
  code: 'EMP010',
  email: 'deepa.nair@company.com',
  pan: 'BCDEF9012G',
  department: 'Operations',
  gross: 112500,
  taxable: 95833,
  monthly: 9792,
  cumulative: 88125,
  adjustment: 0,
  net: 9792,
  regime: 'Old',
  financialYear: '2024-25'
}];


const initialDepartments: DepartmentData[] = [
{ id: '1', dept: 'IT', amount: 125000, employees: 85, percentage: 45, avgTds: 13472, highestTds: 27500, lowestTds: 3542, totalGross: 333334, totalTaxable: 287500 },
{ id: '2', dept: 'HR', amount: 75000, employees: 42, percentage: 27, avgTds: 3542, highestTds: 5208, lowestTds: 1875, totalGross: 137500, totalTaxable: 108333 },
{ id: '3', dept: 'Finance', amount: 95000, employees: 58, percentage: 34, avgTds: 18750, highestTds: 21250, lowestTds: 16250, totalGross: 275000, totalTaxable: 245000 },
{ id: '4', dept: 'Operations', amount: 55000, employees: 38, percentage: 20, avgTds: 7917, highestTds: 9792, lowestTds: 6042, totalGross: 204167, totalTaxable: 170833 },
{ id: '5', dept: 'Sales', amount: 37500, employees: 25, percentage: 13, avgTds: 1042, highestTds: 1042, lowestTds: 1042, totalGross: 50000, totalTaxable: 37500 }];


const monthlyTdsData: MonthlyTdsData[] = [
{ month: 'April 2024', totalTds: 2850000, employees: 245, avgTds: 11633 },
{ month: 'May 2024', totalTds: 2875000, employees: 246, avgTds: 11687 },
{ month: 'June 2024', totalTds: 2890000, employees: 247, avgTds: 11700 },
{ month: 'July 2024', totalTds: 2920000, employees: 248, avgTds: 11774 },
{ month: 'August 2024', totalTds: 2880000, employees: 248, avgTds: 11613 },
{ month: 'September 2024', totalTds: 2910000, employees: 248, avgTds: 11734 },
{ month: 'October 2024', totalTds: 2950000, employees: 248, avgTds: 11895 },
{ month: 'November 2024', totalTds: 2870000, employees: 248, avgTds: 11573 },
{ month: 'December 2024', totalTds: 2920000, employees: 248, avgTds: 11774 },
{ month: 'January 2025', totalTds: 2870000, employees: 248, avgTds: 11573 }];


export function TdsDeductionReport() {
  const [employees] = useState<EmployeeData[]>(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>(initialEmployees);
  const [departments] = useState<DepartmentData[]>(initialDepartments);
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentData[]>(initialDepartments);
  const [reportType, setReportType] = useState<'employee' | 'department' | 'summary'>('employee');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [selectedPeriod, setSelectedPeriod] = useState('range');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  const fyOptions = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' }];


  const periodOptions = [
  { value: 'jan', label: 'January 2025' },
  { value: 'dec', label: 'December 2024' },
  { value: 'nov', label: 'November 2024' },
  { value: 'q3', label: 'Q3 (Oct-Dec 2024)' },
  { value: 'q2', label: 'Q2 (Jul-Sep 2024)' },
  { value: 'q1', label: 'Q1 (Apr-Jun 2024)' },
  { value: 'range', label: 'Apr 2024 - Jan 2025' }];


  const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'sales', label: 'Sales' }];


  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const applyFilters = useCallback(() => {
    let filtered = [...employees];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.code.toLowerCase().includes(query) ||
        emp.pan.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query)
      );
    }

    if (selectedFY !== 'all') {
      filtered = filtered.filter((emp) => emp.financialYear === selectedFY);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((emp) => emp.department.toLowerCase() === selectedDepartment);
    }

    setFilteredEmployees(filtered);

    if (selectedDepartment !== 'all') {
      setFilteredDepartments(departments.filter((d) => d.dept.toLowerCase() === selectedDepartment));
    } else {
      setFilteredDepartments(departments);
    }

    setCurrentPage(1);
  }, [employees, departments, searchQuery, selectedFY, selectedDepartment]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const calculateSummary = () => {
    const totalTds = filteredEmployees.reduce((sum, emp) => sum + emp.cumulative, 0);
    const totalEmployees = filteredEmployees.length;
    const highestTds = filteredEmployees.reduce(
      (max, emp) => emp.monthly > max.monthly ? emp : max,
      filteredEmployees[0] || { monthly: 0, name: '', code: '' }
    );
    const lowestTds = filteredEmployees.reduce(
      (min, emp) => emp.monthly < min.monthly ? emp : min,
      filteredEmployees[0] || { monthly: 0, name: '', code: '' }
    );

    return {
      totalTds,
      totalEmployees,
      highestTds,
      lowestTds,
      totalGross: filteredEmployees.reduce((sum, emp) => sum + emp.gross, 0),
      totalTaxable: filteredEmployees.reduce((sum, emp) => sum + emp.taxable, 0),
      totalMonthly: filteredEmployees.reduce((sum, emp) => sum + emp.monthly, 0),
      totalAdjustment: filteredEmployees.reduce((sum, emp) => sum + emp.adjustment, 0),
      totalNet: filteredEmployees.reduce((sum, emp) => sum + emp.net, 0)
    };
  };

  const summary = calculateSummary();
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFY(e.target.value);
  };

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      applyFilters();
      setIsGenerating(false);

      const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
      const periodLabel = periodOptions.find((p) => p.value === selectedPeriod)?.label;
      const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

      alert(`TDS Deduction Report Generated!\n\nFilters Applied:\n- Financial Year: ${fyLabel}\n- Period: ${periodLabel}\n- Department: ${deptLabel}\n\nResults: ${filteredEmployees.length} employees\nTotal TDS: ${formatCurrency(summary.totalTds)}`);
    }, 1500);
  };

  const handlePrint = () => {
    setIsPrinting(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the report');
      setIsPrinting(false);
      return;
    }

    const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
    const periodLabel = periodOptions.find((p) => p.value === selectedPeriod)?.label;
    const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

    let tableContent = '';

    if (reportType === 'employee') {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Employee</th>
              <th class="text-center">PAN</th>
              <th class="text-right">Gross Salary</th>
              <th class="text-right">Taxable Income</th>
              <th class="text-right">TDS (Month)</th>
              <th class="text-right">Cumulative TDS</th>
              <th class="text-right">Net TDS</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEmployees.map((emp, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td><strong>${emp.name}</strong><br/><small>${emp.code}</small></td>
                <td class="text-center">${emp.pan}</td>
                <td class="text-right">${formatCurrency(emp.gross)}</td>
                <td class="text-right">${formatCurrency(emp.taxable)}</td>
                <td class="text-right">${formatCurrency(emp.monthly)}</td>
                <td class="text-right">${formatCurrency(emp.cumulative)}</td>
                <td class="text-right">${formatCurrency(emp.net)}</td>
              </tr>
            `).join('')}
            <tr class="totals-row">
              <td colspan="3" class="text-right"><strong>GRAND TOTAL:</strong></td>
              <td class="text-right">${formatCurrency(summary.totalGross)}</td>
              <td class="text-right">${formatCurrency(summary.totalTaxable)}</td>
              <td class="text-right">${formatCurrency(summary.totalMonthly)}</td>
              <td class="text-right">${formatCurrency(summary.totalTds)}</td>
              <td class="text-right">${formatCurrency(summary.totalNet)}</td>
            </tr>
          </tbody>
        </table>
      `;
    } else if (reportType === 'department') {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Department</th>
              <th class="text-center">Employees</th>
              <th class="text-right">Total TDS</th>
              <th class="text-right">Avg TDS</th>
              <th class="text-right">Highest TDS</th>
              <th class="text-right">Lowest TDS</th>
              <th class="text-right">% Share</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDepartments.map((dept, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td><strong>${dept.dept}</strong></td>
                <td class="text-center">${dept.employees}</td>
                <td class="text-right">${formatCurrency(dept.amount)}</td>
                <td class="text-right">${formatCurrency(dept.avgTds)}</td>
                <td class="text-right">${formatCurrency(dept.highestTds)}</td>
                <td class="text-right">${formatCurrency(dept.lowestTds)}</td>
                <td class="text-right">${dept.percentage}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      tableContent = `
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th class="text-center">Employees</th>
              <th class="text-right">Total TDS</th>
              <th class="text-right">Avg TDS/Employee</th>
            </tr>
          </thead>
          <tbody>
            ${monthlyTdsData.map((data) => `
              <tr>
                <td>${data.month}</td>
                <td class="text-center">${data.employees}</td>
                <td class="text-right">${formatCurrency(data.totalTds)}</td>
                <td class="text-right">${formatCurrency(data.avgTds)}</td>
              </tr>
            `).join('')}
            <tr class="totals-row">
              <td><strong>TOTAL (YTD)</strong></td>
              <td class="text-center">-</td>
              <td class="text-right">${formatCurrency(monthlyTdsData.reduce((s, d) => s + d.totalTds, 0))}</td>
              <td class="text-right">${formatCurrency(Math.round(monthlyTdsData.reduce((s, d) => s + d.avgTds, 0) / monthlyTdsData.length))}</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TDS Deduction Report - ${fyLabel}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 15px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .report-info { font-size: 11px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #1e40af; color: white; font-weight: 600; text-transform: uppercase; font-size: 9px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            tr:nth-child(even) { background: #f9f9f9; }
            .totals-row { background: #e0e7ff !important; font-weight: bold; }
            @media print { .no-print { display: none; } body { margin: 10px; } }
            .print-btn { padding: 12px 24px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">ACME Corporation Pvt. Ltd.</div>
            <div class="report-title">TDS Deduction Report - ${reportType === 'employee' ? 'Employee Wise' : reportType === 'department' ? 'Department Wise' : 'Summary View'}</div>
            <div class="report-info">
              Financial Year: ${fyLabel} | Period: ${periodLabel} | Department: ${deptLabel}<br/>
              Generated on: ${new Date().toLocaleString('en-IN')}
            </div>
          </div>
          ${tableContent}
          <div style="margin-top: 30px; font-size: 10px; color: #666;">
            <p><strong>Note:</strong> TDS deducted as per Income Tax Act, 1961.</p>
          </div>
          <button class="no-print print-btn" onclick="window.print()">Print Report</button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setIsPrinting(false);
  };

  const handleExport = () => {
    setIsExporting(true);

    const exportChoice = window.confirm('Export TDS Deduction Report\n\n• Click OK for PDF format\n• Click Cancel for CSV format');

    setTimeout(() => {
      if (exportChoice) {
        handleExportPDF();
      } else {
        handleExportCSV();
      }
      setIsExporting(false);
    }, 1000);
  };

  const handleExportCSV = () => {
    const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
    const periodLabel = periodOptions.find((p) => p.value === selectedPeriod)?.label;
    const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

    let csvContent = `TDS Deduction Report - ${reportType === 'employee' ? 'Employee Wise' : reportType === 'department' ? 'Department Wise' : 'Summary View'}\n`;
    csvContent += `Company: ACME Corporation Pvt. Ltd.\n`;
    csvContent += `Financial Year: ${fyLabel}\n`;
    csvContent += `Period: ${periodLabel}\n`;
    csvContent += `Department: ${deptLabel}\n`;
    csvContent += `Generated on: ${new Date().toLocaleString('en-IN')}\n\n`;

    if (reportType === 'employee') {
      const headers = ['S.No', 'Employee Name', 'Employee Code', 'Email', 'PAN', 'Department', 'Gross Salary', 'Taxable Income', 'TDS (Month)', 'Cumulative TDS', 'Adjustment', 'Net TDS', 'Regime'];
      const csvData = filteredEmployees.map((emp, index) => [
      index + 1, emp.name, emp.code, emp.email, emp.pan, emp.department, emp.gross, emp.taxable, emp.monthly, emp.cumulative, emp.adjustment, emp.net, emp.regime]
      );
      csvData.push(['', 'GRAND TOTAL', '', '', '', '', summary.totalGross, summary.totalTaxable, summary.totalMonthly, summary.totalTds, summary.totalAdjustment, summary.totalNet, '']);
      csvContent += headers.join(',') + '\n';
      csvContent += csvData.map((row) => row.join(',')).join('\n');
    } else if (reportType === 'department') {
      const headers = ['S.No', 'Department', 'Employees', 'Total TDS', 'Avg TDS', 'Highest TDS', 'Lowest TDS', 'Total Gross', 'Total Taxable', '% Share'];
      const csvData = filteredDepartments.map((dept, index) => [
      index + 1, dept.dept, dept.employees, dept.amount, dept.avgTds, dept.highestTds, dept.lowestTds, dept.totalGross, dept.totalTaxable, dept.percentage]
      );
      csvContent += headers.join(',') + '\n';
      csvContent += csvData.map((row) => row.join(',')).join('\n');
    } else {
      const headers = ['Month', 'Employees', 'Total TDS', 'Avg TDS/Employee'];
      const csvData = monthlyTdsData.map((data) => [data.month, data.employees, data.totalTds, data.avgTds]);
      csvContent += headers.join(',') + '\n';
      csvContent += csvData.map((row) => row.join(',')).join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `TDS_Deduction_Report_${reportType}_${selectedFY}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    alert('CSV report downloaded successfully!');
  };

  const handleExportPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      await import('jspdf-autotable');

      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF('l', 'mm', 'a4') as any;

      const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
      const periodLabel = periodOptions.find((p) => p.value === selectedPeriod)?.label;

      doc.setFontSize(18);
      doc.text(`TDS Deduction Report - ${reportType === 'employee' ? 'Employee Wise' : reportType === 'department' ? 'Department Wise' : 'Summary'}`, 148, 12, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Financial Year: ${fyLabel} | Period: ${periodLabel} | Generated: ${new Date().toLocaleString('en-IN')}`, 148, 20, { align: 'center' });

      let tableData: any[] = [];
      let headers: string[] = [];

      if (reportType === 'employee') {
        headers = ['S.No', 'Employee', 'PAN', 'Gross', 'Taxable', 'TDS/Month', 'Cumulative', 'Net TDS'];
        tableData = filteredEmployees.map((emp, index) => [
        index + 1, `${emp.name}\n${emp.code}`, emp.pan.slice(0, 6) + '****',
        formatCurrency(emp.gross), formatCurrency(emp.taxable), formatCurrency(emp.monthly),
        formatCurrency(emp.cumulative), formatCurrency(emp.net)]
        );
        tableData.push(['', 'TOTAL', '', formatCurrency(summary.totalGross), formatCurrency(summary.totalTaxable), formatCurrency(summary.totalMonthly), formatCurrency(summary.totalTds), formatCurrency(summary.totalNet)]);
      } else if (reportType === 'department') {
        headers = ['S.No', 'Department', 'Employees', 'Total TDS', 'Avg TDS', 'Highest', 'Lowest', '% Share'];
        tableData = filteredDepartments.map((dept, index) => [
        index + 1, dept.dept, dept.employees, formatCurrency(dept.amount),
        formatCurrency(dept.avgTds), formatCurrency(dept.highestTds), formatCurrency(dept.lowestTds), `${dept.percentage}%`]
        );
      } else {
        headers = ['Month', 'Employees', 'Total TDS', 'Avg TDS/Employee'];
        tableData = monthlyTdsData.map((data) => [data.month, data.employees, formatCurrency(data.totalTds), formatCurrency(data.avgTds)]);
      }

      doc.autoTable({
        startY: 28,
        head: [headers],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        didParseCell: function (data: any) {
          if (data.row.index === tableData.length - 1 && reportType === 'employee') {
            data.cell.styles.fillColor = [224, 231, 255];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      doc.save(`TDS_Deduction_Report_${reportType}_${selectedFY}.pdf`);
      alert('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF generation failed. Downloading CSV instead.');
      handleExportCSV();
    }
  };

  const handleRefresh = () => {
    setIsGenerating(true);
    setTimeout(() => {
      applyFilters();
      setIsGenerating(false);
      alert('Data refreshed successfully!');
    }, 1000);
  };

  const handleSendReport = () => {
    const confirmSend = window.confirm(`Send TDS Deduction Report\n\nThis will email TDS details to ${filteredEmployees.length} employees.\n\nDo you want to proceed?`);

    if (confirmSend) {
      setIsGenerating(true);
      setTimeout(() => {
        filteredEmployees.forEach((emp) => {
          console.log(`Email sent to ${emp.email}: TDS Report for ${selectedPeriod}`);
        });
        setIsGenerating(false);
        alert(`TDS reports sent to ${filteredEmployees.length} employees!`);
      }, 2000);
    }
  };

  const handleViewEmployee = (emp: EmployeeData) => {
    setSelectedEmployee(emp);
  };

  const handleCloseEmployeeDetail = () => {
    setSelectedEmployee(null);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDepartmentClick = (dept: DepartmentData) => {
    setSelectedDepartment(dept.dept.toLowerCase());
    setReportType('employee');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">TDS Deduction Report</h1>
          <p className="text-sm text-gray-500 mt-1">HR &gt; Payroll &gt; Income Tax &gt; Reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isGenerating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleSendReport} disabled={isGenerating}>
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search employee, PAN..." className="pl-10" value={searchQuery} onChange={handleSearch} />
          </div>
          <Select options={fyOptions} value={selectedFY} onChange={handleFYChange} />
          <Select options={periodOptions} value={selectedPeriod} onChange={handlePeriodChange} />
          <Select options={departmentOptions} value={selectedDepartment} onChange={handleDepartmentChange} />
          <Button variant="primary" className="w-full" onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex gap-2">
          {[
          { id: 'employee', label: 'Employee Wise' },
          { id: 'department', label: 'Department Wise' },
          { id: 'summary', label: 'Summary View' }].
          map((type) =>
          <Button key={type.id} variant={reportType === type.id ? 'primary' : 'outline'} onClick={() => setReportType(type.id as any)}>
              {type.label}
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalTds)}</p>
          <p className="text-sm text-gray-600">Total TDS Deducted</p>
          <p className="text-xs text-gray-500 mt-1">{periodOptions.find((p) => p.value === selectedPeriod)?.label}</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.highestTds?.monthly || 0)}</p>
          <p className="text-sm text-gray-600">Highest TDS Deducted</p>
          <p className="text-xs text-gray-500 mt-1">{summary.highestTds?.name} ({summary.highestTds?.code})</p>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.lowestTds?.monthly || 0)}</p>
          <p className="text-sm text-gray-600">Lowest TDS Deducted</p>
          <p className="text-xs text-gray-500 mt-1">{summary.lowestTds?.name} ({summary.lowestTds?.code})</p>
        </Card>
      </div>

      {reportType === 'employee' &&
      <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">PAN</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Gross Salary</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Taxable Income</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">TDS (Month)</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Cumulative TDS</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Net TDS</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentEmployees.length === 0 ?
              <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">No employees found matching your filters.</td>
                  </tr> :

              currentEmployees.map((emp) =>
              <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.code}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-sm text-gray-700">{emp.pan.slice(0, 6)}****</span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(emp.gross)}</td>
                      <td className="px-4 py-3 text-right text-blue-600 font-medium">{formatCurrency(emp.taxable)}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-bold">{formatCurrency(emp.monthly)}</td>
                      <td className="px-4 py-3 text-right text-purple-600 font-medium">{formatCurrency(emp.cumulative)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(emp.net)}</td>
                      <td className="px-4 py-3 text-center">
                        <Button variant="ghost" size="sm" onClick={() => handleViewEmployee(emp)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
              )
              }
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900">Grand Total:</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(summary.totalGross)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency(summary.totalTaxable)}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(summary.totalMonthly)}</td>
                  <td className="px-4 py-3 text-right font-bold text-purple-600">{formatCurrency(summary.totalTds)}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(summary.totalNet)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-500">Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((pageNum) =>
            <Button key={pageNum} variant={currentPage === pageNum ? 'primary' : 'outline'} size="sm" onClick={() => handlePageChange(pageNum)}>{pageNum}</Button>
            )}
              <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</Button>
            </div>
          </div>
        </Card>
      }

      {reportType === 'department' &&
      <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Department</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Employees</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Total TDS</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Avg TDS</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Highest TDS</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Lowest TDS</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">% Share</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map((dept) =>
              <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{dept.dept}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{dept.employees}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(dept.amount)}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(dept.avgTds)}</td>
                    <td className="px-4 py-3 text-right text-purple-600">{formatCurrency(dept.highestTds)}</td>
                    <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(dept.lowestTds)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-blue-100 text-blue-700">{dept.percentage}%</Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm" onClick={() => handleDepartmentClick(dept)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td className="px-4 py-3 font-bold text-gray-900">TOTAL</td>
                  <td className="px-4 py-3 text-center font-bold">{filteredDepartments.reduce((s, d) => s + d.employees, 0)}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(filteredDepartments.reduce((s, d) => s + d.amount, 0))}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">-</td>
                  <td className="px-4 py-3 text-right font-bold text-purple-600">-</td>
                  <td className="px-4 py-3 text-right font-bold text-orange-600">-</td>
                  <td className="px-4 py-3 text-center font-bold">100%</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      }

      {reportType === 'summary' &&
      <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Month</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Employees</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Total TDS</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Avg TDS/Employee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyTdsData.map((data, index) =>
              <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{data.month}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{data.employees}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(data.totalTds)}</td>
                    <td className="px-4 py-3 text-right text-blue-600">{formatCurrency(data.avgTds)}</td>
                  </tr>
              )}
              </tbody>
              <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td className="px-4 py-3 font-bold text-gray-900">TOTAL (YTD)</td>
                  <td className="px-4 py-3 text-center font-bold">-</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(monthlyTdsData.reduce((s, d) => s + d.totalTds, 0))}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency(Math.round(monthlyTdsData.reduce((s, d) => s + d.avgTds, 0) / monthlyTdsData.length))}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      }

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Department-wise TDS Distribution</h3>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {filteredDepartments.map((dept) =>
          <div key={dept.dept} className="cursor-pointer" onClick={() => handleDepartmentClick(dept)}>
              <div className="flex justify-between text-sm mb-2">
                <div>
                  <span className="font-medium text-gray-900">{dept.dept}</span>
                  <span className="text-gray-500 ml-2">({dept.employees} employees)</span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(dept.amount)}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500 hover:bg-blue-700" style={{ width: `${dept.percentage * 2}%` }} />
              </div>
            </div>
          )}
        </div>
      </Card>

      {selectedEmployee &&
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
              <h2 className="text-lg font-bold text-gray-900">Employee TDS Details</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseEmployeeDetail}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <Card className="p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Employee Name</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Employee Code</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.code}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">PAN</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.pan}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tax Regime</p>
                    <Badge className={selectedEmployee.regime === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                      {selectedEmployee.regime}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900 text-xs">{selectedEmployee.email}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">TDS Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Salary (Monthly)</span>
                    <span className="font-medium">{formatCurrency(selectedEmployee.gross)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Income (Monthly)</span>
                    <span className="font-medium text-blue-600">{formatCurrency(selectedEmployee.taxable)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TDS Deducted (This Month)</span>
                    <span className="font-bold text-green-600">{formatCurrency(selectedEmployee.monthly)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Cumulative TDS (YTD)</span>
                    <span className="font-bold text-purple-600">{formatCurrency(selectedEmployee.cumulative)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adjustment</span>
                    <span className="font-medium">{selectedEmployee.adjustment === 0 ? '-' : formatCurrency(selectedEmployee.adjustment)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Net TDS</span>
                    <span className="font-bold text-gray-900">{formatCurrency(selectedEmployee.net)}</span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const content = `TDS Details - ${selectedEmployee.name}\nCode: ${selectedEmployee.code}\nPAN: ${selectedEmployee.pan}\nGross: ${formatCurrency(selectedEmployee.gross)}\nTDS: ${formatCurrency(selectedEmployee.monthly)}\nCumulative: ${formatCurrency(selectedEmployee.cumulative)}`;
                  const blob = new Blob([content], { type: 'text/plain' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `TDS_${selectedEmployee.code}.txt`;
                  link.click();
                  alert('TDS details downloaded!');
                }}>

                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  alert(`Email sent to ${selectedEmployee.email}\n\nSubject: Your TDS Details for ${periodOptions.find((p) => p.value === selectedPeriod)?.label}\nTDS Deducted: ${formatCurrency(selectedEmployee.monthly)}\nCumulative TDS: ${formatCurrency(selectedEmployee.cumulative)}`);
                }}>

                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>);

}