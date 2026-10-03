// src/pages/hr/payroll/EmployeeTaxProjectionReport.tsx

import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import {
  Search,
  Download,
  Printer,
  ChevronDown,
  ChevronRight,
  Users,
  DollarSign,
  TrendingDown,
  Calculator,
  RefreshCw,
  Mail,
  FileText } from
'lucide-react';

interface IncomeBreakdown {
  basicSalary: number;
  hra: number;
  otherAllowances: number;
  specialAllowance: number;
  lta: number;
  bonus: number;
}

interface DeductionBreakdown {
  section80C: number;
  section80D: number;
  section80E: number;
  section80G: number;
  hraExemption: number;
  standardDeduction: number;
  nps: number;
  homeLoanInterest: number;
}

interface TDSPlan {
  aprToDecRate: number;
  aprToDecMonths: number;
  janToMarRate: number;
  janToMarMonths: number;
  totalTDS: number;
}

interface Employee {
  id: string;
  name: string;
  code: string;
  email: string;
  department: string;
  regime: 'New' | 'Old';
  gross: number;
  exemptions: number;
  deductions: number;
  taxable: number;
  tax: number;
  monthly: number;
  status: 'Complete' | 'Pending' | 'Review';
  financialYear: string;
  pan: string;
  incomeBreakdown: IncomeBreakdown;
  deductionBreakdown: DeductionBreakdown;
  tdsPlan: TDSPlan;
}

const initialEmployees: Employee[] = [
{
  id: '1',
  name: 'Rajesh Kumar',
  code: 'EMP001',
  email: 'rajesh.kumar@company.com',
  department: 'IT',
  regime: 'New',
  gross: 1200000,
  exemptions: 50000,
  deductions: 245000,
  taxable: 905000,
  tax: 112500,
  monthly: 9375,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'ABCDE1234F',
  incomeBreakdown: {
    basicSalary: 800000,
    hra: 240000,
    otherAllowances: 100000,
    specialAllowance: 40000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 150000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    hraExemption: 70000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 9375,
    aprToDecMonths: 9,
    janToMarRate: 9375,
    janToMarMonths: 3,
    totalTDS: 112500
  }
},
{
  id: '2',
  name: 'Priya Sharma',
  code: 'EMP002',
  email: 'priya.sharma@company.com',
  department: 'HR',
  regime: 'Old',
  gross: 950000,
  exemptions: 75000,
  deductions: 125000,
  taxable: 750000,
  tax: 62500,
  monthly: 5208,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'FGHIJ5678K',
  incomeBreakdown: {
    basicSalary: 600000,
    hra: 180000,
    otherAllowances: 120000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 100000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    hraExemption: 50000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 5208,
    aprToDecMonths: 9,
    janToMarRate: 5208,
    janToMarMonths: 3,
    totalTDS: 62500
  }
},
{
  id: '3',
  name: 'Amit Patel',
  code: 'EMP003',
  email: 'amit.patel@company.com',
  department: 'Finance',
  regime: 'New',
  gross: 1500000,
  exemptions: 60000,
  deductions: 100000,
  taxable: 1340000,
  tax: 195000,
  monthly: 16250,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'LMNOP9012Q',
  incomeBreakdown: {
    basicSalary: 1000000,
    hra: 300000,
    otherAllowances: 150000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 50000,
    section80D: 25000,
    section80E: 0,
    section80G: 25000,
    hraExemption: 0,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 16250,
    aprToDecMonths: 9,
    janToMarRate: 16250,
    janToMarMonths: 3,
    totalTDS: 195000
  }
},
{
  id: '4',
  name: 'Sneha Reddy',
  code: 'EMP004',
  email: 'sneha.reddy@company.com',
  department: 'IT',
  regime: 'Old',
  gross: 800000,
  exemptions: 50000,
  deductions: 200000,
  taxable: 550000,
  tax: 42500,
  monthly: 3542,
  status: 'Pending',
  financialYear: '2024-25',
  pan: 'RSTUV3456W',
  incomeBreakdown: {
    basicSalary: 500000,
    hra: 150000,
    otherAllowances: 100000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 150000,
    section80D: 50000,
    section80E: 0,
    section80G: 0,
    hraExemption: 50000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 3542,
    aprToDecMonths: 9,
    janToMarRate: 3542,
    janToMarMonths: 3,
    totalTDS: 42500
  }
},
{
  id: '5',
  name: 'Vikram Singh',
  code: 'EMP005',
  email: 'vikram.singh@company.com',
  department: 'Finance',
  regime: 'New',
  gross: 1800000,
  exemptions: 50000,
  deductions: 150000,
  taxable: 1600000,
  tax: 255000,
  monthly: 21250,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'XYZAB7890C',
  incomeBreakdown: {
    basicSalary: 1200000,
    hra: 360000,
    otherAllowances: 180000,
    specialAllowance: 40000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 100000,
    section80D: 25000,
    section80E: 0,
    section80G: 25000,
    hraExemption: 0,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 21250,
    aprToDecMonths: 9,
    janToMarRate: 21250,
    janToMarMonths: 3,
    totalTDS: 255000
  }
},
{
  id: '6',
  name: 'Kavita Joshi',
  code: 'EMP006',
  email: 'kavita.joshi@company.com',
  department: 'HR',
  regime: 'Old',
  gross: 700000,
  exemptions: 50000,
  deductions: 175000,
  taxable: 475000,
  tax: 22500,
  monthly: 1875,
  status: 'Review',
  financialYear: '2024-25',
  pan: 'DEFGH2345I',
  incomeBreakdown: {
    basicSalary: 450000,
    hra: 135000,
    otherAllowances: 80000,
    specialAllowance: 20000,
    lta: 10000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 125000,
    section80D: 25000,
    section80E: 0,
    section80G: 0,
    hraExemption: 25000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 1875,
    aprToDecMonths: 9,
    janToMarRate: 1875,
    janToMarMonths: 3,
    totalTDS: 22500
  }
},
{
  id: '7',
  name: 'Rahul Verma',
  code: 'EMP007',
  email: 'rahul.verma@company.com',
  department: 'IT',
  regime: 'New',
  gross: 2000000,
  exemptions: 50000,
  deductions: 100000,
  taxable: 1850000,
  tax: 330000,
  monthly: 27500,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'JKLMN6789O',
  incomeBreakdown: {
    basicSalary: 1400000,
    hra: 420000,
    otherAllowances: 130000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 50000,
    section80D: 25000,
    section80E: 0,
    section80G: 25000,
    hraExemption: 0,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 27500,
    aprToDecMonths: 9,
    janToMarRate: 27500,
    janToMarMonths: 3,
    totalTDS: 330000
  }
},
{
  id: '8',
  name: 'Anita Desai',
  code: 'EMP008',
  email: 'anita.desai@company.com',
  department: 'Finance',
  regime: 'Old',
  gross: 1100000,
  exemptions: 75000,
  deductions: 225000,
  taxable: 800000,
  tax: 72500,
  monthly: 6042,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'PQRST1234U',
  incomeBreakdown: {
    basicSalary: 700000,
    hra: 210000,
    otherAllowances: 140000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 150000,
    section80D: 50000,
    section80E: 25000,
    section80G: 0,
    hraExemption: 50000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 6042,
    aprToDecMonths: 9,
    janToMarRate: 6042,
    janToMarMonths: 3,
    totalTDS: 72500
  }
},
{
  id: '9',
  name: 'Suresh Menon',
  code: 'EMP009',
  email: 'suresh.menon@company.com',
  department: 'HR',
  regime: 'New',
  gross: 600000,
  exemptions: 50000,
  deductions: 50000,
  taxable: 500000,
  tax: 12500,
  monthly: 1042,
  status: 'Pending',
  financialYear: '2024-25',
  pan: 'VWXYZ5678A',
  incomeBreakdown: {
    basicSalary: 400000,
    hra: 120000,
    otherAllowances: 50000,
    specialAllowance: 15000,
    lta: 10000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 0,
    section80D: 0,
    section80E: 0,
    section80G: 0,
    hraExemption: 0,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 1042,
    aprToDecMonths: 9,
    janToMarRate: 1042,
    janToMarMonths: 3,
    totalTDS: 12500
  }
},
{
  id: '10',
  name: 'Deepa Nair',
  code: 'EMP010',
  email: 'deepa.nair@company.com',
  department: 'IT',
  regime: 'Old',
  gross: 1350000,
  exemptions: 100000,
  deductions: 250000,
  taxable: 1000000,
  tax: 117500,
  monthly: 9792,
  status: 'Complete',
  financialYear: '2024-25',
  pan: 'BCDEF9012G',
  incomeBreakdown: {
    basicSalary: 900000,
    hra: 270000,
    otherAllowances: 130000,
    specialAllowance: 30000,
    lta: 15000,
    bonus: 5000
  },
  deductionBreakdown: {
    section80C: 150000,
    section80D: 50000,
    section80E: 0,
    section80G: 0,
    hraExemption: 100000,
    standardDeduction: 50000,
    nps: 0,
    homeLoanInterest: 0
  },
  tdsPlan: {
    aprToDecRate: 9792,
    aprToDecMonths: 9,
    janToMarRate: 9792,
    janToMarMonths: 3,
    totalTDS: 117500
  }
}];


export function EmployeeTaxProjectionReport() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(initialEmployees);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [selectedRegime, setSelectedRegime] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const fyOptions = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' }];


  const regimeOptions = [
  { value: 'all', label: 'All Regimes' },
  { value: 'old', label: 'Old Regime' },
  { value: 'new', label: 'New Regime' }];


  const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' }];


  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const formatLakhs = (amount: number) => `₹${(amount / 100000).toFixed(2)}L`;

  const applyFilters = useCallback(() => {
    let filtered = [...employees];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
        emp.name.toLowerCase().includes(query) ||
        emp.code.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.pan.toLowerCase().includes(query)
      );
    }

    if (selectedFY !== 'all') {
      filtered = filtered.filter((emp) => emp.financialYear === selectedFY);
    }

    if (selectedRegime !== 'all') {
      filtered = filtered.filter((emp) => emp.regime.toLowerCase() === selectedRegime);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((emp) => emp.department.toLowerCase() === selectedDepartment);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [employees, searchQuery, selectedFY, selectedRegime, selectedDepartment]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const calculateSummary = () => {
    return {
      totalEmployees: filteredEmployees.length,
      totalProjectedTax: filteredEmployees.reduce((sum, emp) => sum + emp.tax, 0),
      totalDeductions: filteredEmployees.reduce((sum, emp) => sum + emp.deductions, 0),
      averageTax:
      filteredEmployees.length > 0 ?
      filteredEmployees.reduce((sum, emp) => sum + emp.tax, 0) / filteredEmployees.length :
      0
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

  const handleRegimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegime(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setExpandedRow(null);

    setTimeout(() => {
      applyFilters();
      setIsGenerating(false);

      const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
      const regimeLabel = regimeOptions.find((r) => r.value === selectedRegime)?.label;
      const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

      alert(
        `Tax Projection Report Generated!\n\nFilters Applied:\n- Financial Year: ${fyLabel}\n- Regime: ${regimeLabel}\n- Department: ${deptLabel}\n\nResults: ${filteredEmployees.length} employees found\nTotal Projected Tax: ${formatLakhs(summary.totalProjectedTax)}`
      );
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
    const regimeLabel = regimeOptions.find((r) => r.value === selectedRegime)?.label;
    const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee Tax Projection Report - ${fyLabel}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 11px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 15px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
            .report-title { font-size: 18px; margin: 10px 0; }
            .report-info { font-size: 11px; color: #666; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px; }
            .summary-card { background: #f8f9fa; padding: 12px; border-radius: 6px; text-align: center; border-left: 4px solid #1e40af; }
            .summary-value { font-size: 18px; font-weight: bold; color: #1e40af; }
            .summary-label { font-size: 10px; color: #666; margin-top: 3px; }
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
            <div class="report-title">Employee Tax Projection Report</div>
            <div class="report-info">
              Financial Year: ${fyLabel} | Regime: ${regimeLabel} | Department: ${deptLabel}<br/>
              Generated on: ${new Date().toLocaleString('en-IN')}
            </div>
          </div>
          
          <div class="summary-grid">
            <div class="summary-card">
              <div class="summary-value">${summary.totalEmployees}</div>
              <div class="summary-label">Total Employees</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatLakhs(summary.totalProjectedTax)}</div>
              <div class="summary-label">Total Projected Tax</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatLakhs(summary.totalDeductions)}</div>
              <div class="summary-label">Total Deductions</div>
            </div>
            <div class="summary-card">
              <div class="summary-value">${formatCurrency(Math.round(summary.averageTax))}</div>
              <div class="summary-label">Average Tax/Employee</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Employee</th>
                <th class="text-center">Dept</th>
                <th class="text-center">Regime</th>
                <th class="text-right">Annual Gross</th>
                <th class="text-right">Exemptions</th>
                <th class="text-right">Deductions</th>
                <th class="text-right">Taxable Income</th>
                <th class="text-right">Tax Liability</th>
                <th class="text-right">Monthly TDS</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.map((emp, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td><strong>${emp.name}</strong><br/><small>${emp.code}</small></td>
                  <td class="text-center">${emp.department}</td>
                  <td class="text-center">${emp.regime}</td>
                  <td class="text-right">${formatLakhs(emp.gross)}</td>
                  <td class="text-right">${formatLakhs(emp.exemptions)}</td>
                  <td class="text-right">${formatLakhs(emp.deductions)}</td>
                  <td class="text-right">${formatLakhs(emp.taxable)}</td>
                  <td class="text-right"><strong>${formatLakhs(emp.tax)}</strong></td>
                  <td class="text-right">${formatCurrency(emp.monthly)}</td>
                  <td class="text-center">${emp.status}</td>
                </tr>
              `).join('')}
              <tr class="totals-row">
                <td colspan="4" class="text-right"><strong>GRAND TOTAL:</strong></td>
                <td class="text-right">${formatLakhs(filteredEmployees.reduce((s, e) => s + e.gross, 0))}</td>
                <td class="text-right">${formatLakhs(filteredEmployees.reduce((s, e) => s + e.exemptions, 0))}</td>
                <td class="text-right">${formatLakhs(filteredEmployees.reduce((s, e) => s + e.deductions, 0))}</td>
                <td class="text-right">${formatLakhs(filteredEmployees.reduce((s, e) => s + e.taxable, 0))}</td>
                <td class="text-right">${formatLakhs(filteredEmployees.reduce((s, e) => s + e.tax, 0))}</td>
                <td class="text-right">${formatCurrency(filteredEmployees.reduce((s, e) => s + e.monthly, 0))}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #eee; font-size: 10px; color: #666;">
            <p><strong>Note:</strong> This is a projected tax calculation based on declared investments and current salary structure.</p>
            <p style="margin-top: 5px;">Report generated by HR Payroll System | Confidential - For Internal Use Only</p>
          </div>
          
          <button class="no-print print-btn" onclick="window.print()">Print Report</button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setIsPrinting(false);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const jsPDFModule = await import('jspdf');
      await import('jspdf-autotable');

      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF('l', 'mm', 'a4') as any;

      const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;

      doc.setFontSize(18);
      doc.text('Employee Tax Projection Report', 148, 12, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Financial Year: ${fyLabel} | Generated on: ${new Date().toLocaleString('en-IN')}`, 148, 20, { align: 'center' });

      doc.setFontSize(9);
      doc.text(
        `Total Employees: ${summary.totalEmployees} | Total Tax: ${formatLakhs(summary.totalProjectedTax)} | Total Deductions: ${formatLakhs(summary.totalDeductions)}`,
        148, 28, { align: 'center' }
      );

      const tableData = filteredEmployees.map((emp, index) => [
      index + 1,
      `${emp.name}\n${emp.code}`,
      emp.department,
      emp.regime,
      formatLakhs(emp.gross),
      formatLakhs(emp.exemptions),
      formatLakhs(emp.deductions),
      formatLakhs(emp.taxable),
      formatLakhs(emp.tax),
      formatCurrency(emp.monthly),
      emp.status]
      );

      tableData.push([
      '',
      'GRAND TOTAL',
      '',
      '',
      formatLakhs(filteredEmployees.reduce((s, e) => s + e.gross, 0)),
      formatLakhs(filteredEmployees.reduce((s, e) => s + e.exemptions, 0)),
      formatLakhs(filteredEmployees.reduce((s, e) => s + e.deductions, 0)),
      formatLakhs(filteredEmployees.reduce((s, e) => s + e.taxable, 0)),
      formatLakhs(filteredEmployees.reduce((s, e) => s + e.tax, 0)),
      formatCurrency(filteredEmployees.reduce((s, e) => s + e.monthly, 0)),
      '']
      );

      doc.autoTable({
        startY: 35,
        head: [['S.No', 'Employee', 'Dept', 'Regime', 'Gross', 'Exemptions', 'Deductions', 'Taxable', 'Tax', 'Monthly TDS', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 12 },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
          7: { halign: 'right' },
          8: { halign: 'right' },
          9: { halign: 'right' },
          10: { halign: 'center' }
        },
        didParseCell: function (data: any) {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = [224, 231, 255];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      doc.save(`Tax_Projection_Report_${selectedFY}.pdf`);
      setIsExporting(false);
      alert('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      setIsExporting(false);
      alert('PDF generation failed. Please try Excel export instead.');
    }
  };

  const handleExportExcel = () => {
    setIsExporting(true);

    const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;

    const headers = [
    'S.No', 'Employee Name', 'Employee Code', 'Email', 'PAN', 'Department', 'Regime',
    'Annual Gross', 'Exemptions', 'Deductions', 'Taxable Income', 'Tax Liability',
    'Monthly TDS', 'Status', 'Basic Salary', 'HRA', 'Other Allowances', '80C', '80D',
    'HRA Exemption', 'Standard Deduction'];


    const csvData = filteredEmployees.map((emp, index) => [
    index + 1, emp.name, emp.code, emp.email, emp.pan, emp.department, emp.regime,
    emp.gross, emp.exemptions, emp.deductions, emp.taxable, emp.tax, emp.monthly,
    emp.status, emp.incomeBreakdown.basicSalary, emp.incomeBreakdown.hra,
    emp.incomeBreakdown.otherAllowances, emp.deductionBreakdown.section80C,
    emp.deductionBreakdown.section80D, emp.deductionBreakdown.hraExemption,
    emp.deductionBreakdown.standardDeduction]
    );

    csvData.push([
    '', 'GRAND TOTAL', '', '', '', '', '',
    filteredEmployees.reduce((s, e) => s + e.gross, 0),
    filteredEmployees.reduce((s, e) => s + e.exemptions, 0),
    filteredEmployees.reduce((s, e) => s + e.deductions, 0),
    filteredEmployees.reduce((s, e) => s + e.taxable, 0),
    filteredEmployees.reduce((s, e) => s + e.tax, 0),
    filteredEmployees.reduce((s, e) => s + e.monthly, 0),
    '', '', '', '', '', '', '', '']
    );

    let csvContent = `Employee Tax Projection Report\n`;
    csvContent += `Company: ACME Corporation Pvt. Ltd.\n`;
    csvContent += `Financial Year: ${fyLabel}\n`;
    csvContent += `Generated on: ${new Date().toLocaleString('en-IN')}\n`;
    csvContent += `Total Employees: ${summary.totalEmployees}\n`;
    csvContent += `Total Projected Tax: ${formatCurrency(summary.totalProjectedTax)}\n\n`;
    csvContent += headers.join(',') + '\n';
    csvContent += csvData.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Tax_Projection_Report_${selectedFY}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setIsExporting(false);
    alert('Excel (CSV) report downloaded successfully!');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setExpandedRow(null);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleRowExpand = (empId: string) => {
    setExpandedRow(expandedRow === empId ? null : empId);
  };

  const handleRefresh = () => {
    setIsGenerating(true);
    setExpandedRow(null);

    setTimeout(() => {
      applyFilters();
      setIsGenerating(false);
      alert('Data refreshed successfully!');
    }, 1000);
  };

  const handleSendReport = () => {
    const confirmSend = window.confirm(
      `Send Tax Projection Report\n\nThis will email individual tax projection details to ${filteredEmployees.length} employees.\n\nDo you want to proceed?`
    );

    if (confirmSend) {
      setIsGenerating(true);

      setTimeout(() => {
        filteredEmployees.forEach((emp) => {
          console.log(`Email sent to ${emp.email}: Tax Projection for FY ${selectedFY}`);
        });

        setIsGenerating(false);
        alert(`Tax projection reports sent to ${filteredEmployees.length} employees!`);
      }, 2000);
    }
  };

  const handleViewDetailedReport = (emp: Employee) => {
    const reportWindow = window.open('', '_blank', 'width=900,height=700');
    if (!reportWindow) {
      alert('Please allow pop-ups to view detailed report');
      return;
    }

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Projection - ${emp.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1e40af; padding-bottom: 15px; margin-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #1e40af; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .label { color: #666; }
            .value { font-weight: 600; }
            .highlight { background: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .total-row { font-size: 18px; font-weight: bold; color: #1e40af; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Tax Projection Report</h1>
            <p>Financial Year: ${selectedFY}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Employee Information</div>
            <div class="item"><span class="label">Name:</span><span class="value">${emp.name}</span></div>
            <div class="item"><span class="label">Employee Code:</span><span class="value">${emp.code}</span></div>
            <div class="item"><span class="label">Department:</span><span class="value">${emp.department}</span></div>
            <div class="item"><span class="label">PAN:</span><span class="value">${emp.pan}</span></div>
            <div class="item"><span class="label">Tax Regime:</span><span class="value">${emp.regime} Regime</span></div>
          </div>
          
          <div class="section">
            <div class="section-title">Income Breakdown</div>
            <div class="item"><span class="label">Basic Salary:</span><span class="value">${formatCurrency(emp.incomeBreakdown.basicSalary)}</span></div>
            <div class="item"><span class="label">HRA:</span><span class="value">${formatCurrency(emp.incomeBreakdown.hra)}</span></div>
            <div class="item"><span class="label">Other Allowances:</span><span class="value">${formatCurrency(emp.incomeBreakdown.otherAllowances)}</span></div>
            <div class="item total-row"><span>Total Gross Income:</span><span>${formatCurrency(emp.gross)}</span></div>
          </div>
          
          <div class="section">
            <div class="section-title">Deduction Breakdown</div>
            <div class="item"><span class="label">Section 80C:</span><span class="value">${formatCurrency(emp.deductionBreakdown.section80C)}</span></div>
            <div class="item"><span class="label">Section 80D:</span><span class="value">${formatCurrency(emp.deductionBreakdown.section80D)}</span></div>
            <div class="item"><span class="label">HRA Exemption:</span><span class="value">${formatCurrency(emp.deductionBreakdown.hraExemption)}</span></div>
            <div class="item"><span class="label">Standard Deduction:</span><span class="value">${formatCurrency(emp.deductionBreakdown.standardDeduction)}</span></div>
            <div class="item total-row"><span>Total Deductions:</span><span>${formatCurrency(emp.deductions)}</span></div>
          </div>
          
          <div class="highlight">
            <div class="section-title">Tax Liability Summary</div>
            <div class="item"><span class="label">Taxable Income:</span><span class="value">${formatCurrency(emp.taxable)}</span></div>
            <div class="item"><span class="label">Annual Tax Liability:</span><span class="value" style="color: #dc2626; font-size: 18px;">${formatCurrency(emp.tax)}</span></div>
            <div class="item"><span class="label">Monthly TDS:</span><span class="value" style="color: #7c3aed; font-size: 16px;">${formatCurrency(emp.monthly)}</span></div>
          </div>
          
          <div style="margin-top: 30px; font-size: 11px; color: #666;">
            <p><strong>Disclaimer:</strong> This is a projected tax calculation. Actual tax may vary.</p>
            <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
          </div>
          
          <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #1e40af; color: white; border: none; border-radius: 6px; cursor: pointer;">Print Report</button>
        </body>
      </html>
    `;

    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

  const handleDownloadIndividual = (emp: Employee) => {
    const content = `Tax Projection - ${emp.name}\nCode: ${emp.code}\nRegime: ${emp.regime}\nGross: ${formatCurrency(emp.gross)}\nTaxable: ${formatCurrency(emp.taxable)}\nTax: ${formatCurrency(emp.tax)}\nMonthly TDS: ${formatCurrency(emp.monthly)}\n\nGenerated on: ${new Date().toLocaleString('en-IN')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Tax_Projection_${emp.code}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
    alert('Individual report downloaded!');
  };

  const handleEmailIndividual = (emp: Employee) => {
    alert(`Email sent to ${emp.email}\n\nSubject: Your Tax Projection for FY ${selectedFY}\nProjected Tax: ${formatCurrency(emp.tax)}\nMonthly TDS: ${formatCurrency(emp.monthly)}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Tax Projection Report</h1>
          <p className="text-sm text-gray-500 mt-1">HR &gt; Payroll &gt; Income Tax &gt; Reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isGenerating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleSendReport} disabled={isGenerating}>
            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="primary" onClick={handleExportExcel} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search employee..." className="pl-10" value={searchQuery} onChange={handleSearch} />
          </div>
          <Select options={fyOptions} value={selectedFY} onChange={handleFYChange} />
          <Select options={regimeOptions} value={selectedRegime} onChange={handleRegimeChange} />
          <Select options={departmentOptions} value={selectedDepartment} onChange={handleDepartmentChange} />
          <Button variant="primary" className="w-full" onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees}</p>
          <p className="text-sm text-gray-600">Total Employees Included</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatLakhs(summary.totalProjectedTax)}</p>
          <p className="text-sm text-gray-600">Total Projected Tax</p>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatLakhs(summary.totalDeductions)}</p>
          <p className="text-sm text-gray-600">Total Projected Deduction</p>
        </Card>

        <Card className="p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.round(summary.averageTax))}</p>
          <p className="text-sm text-gray-600">Average Tax per Employee</p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Department</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Regime</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Annual Gross</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Exemptions</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Deductions</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Taxable Income</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Tax Liability</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Monthly TDS</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentEmployees.length === 0 ?
              <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                    No employees found matching your filters.
                  </td>
                </tr> :

              currentEmployees.map((emp) =>
              <Fragment key={emp.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleRowExpand(emp.id)} className="p-1 hover:bg-gray-100 rounded">
                            {expandedRow === emp.id ?
                        <ChevronDown className="w-4 h-4 text-gray-600" /> :

                        <ChevronRight className="w-4 h-4 text-gray-600" />
                        }
                          </button>
                          <div>
                            <p className="font-medium text-gray-900">{emp.name}</p>
                            <p className="text-xs text-gray-500">{emp.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">{emp.department}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={emp.regime === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                          {emp.regime}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{formatLakhs(emp.gross)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{formatLakhs(emp.exemptions)}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-medium">{formatLakhs(emp.deductions)}</td>
                      <td className="px-4 py-3 text-right text-blue-600 font-bold">{formatLakhs(emp.taxable)}</td>
                      <td className="px-4 py-3 text-right font-bold text-gray-900">{formatLakhs(emp.tax)}</td>
                      <td className="px-4 py-3 text-right text-purple-600 font-medium">{formatCurrency(emp.monthly)}</td>
                      <td className="px-4 py-3 text-center">
                        <Badge className={
                    emp.status === 'Complete' ? 'bg-green-100 text-green-700' :
                    emp.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }>
                          {emp.status}
                        </Badge>
                      </td>
                    </tr>
                    {expandedRow === emp.id &&
                <tr>
                        <td colSpan={10} className="px-4 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Income Breakdown</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Basic Salary:</span>
                                  <span className="font-medium">{formatCurrency(emp.incomeBreakdown.basicSalary)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">HRA:</span>
                                  <span className="font-medium">{formatCurrency(emp.incomeBreakdown.hra)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Other Allowances:</span>
                                  <span className="font-medium">{formatCurrency(emp.incomeBreakdown.otherAllowances)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                  <span className="font-semibold">Total:</span>
                                  <span className="font-bold">{formatCurrency(emp.gross)}</span>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Deduction Breakdown</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">80C:</span>
                                  <span className="font-medium">{formatCurrency(emp.deductionBreakdown.section80C)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">80D:</span>
                                  <span className="font-medium">{formatCurrency(emp.deductionBreakdown.section80D)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">HRA Exemption:</span>
                                  <span className="font-medium">{formatCurrency(emp.deductionBreakdown.hraExemption)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                  <span className="font-semibold">Total:</span>
                                  <span className="font-bold">{formatCurrency(emp.deductions)}</span>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Monthly TDS Plan</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Apr-Dec:</span>
                                  <span className="font-medium">{formatCurrency(emp.tdsPlan.aprToDecRate)} × 9</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Jan-Mar:</span>
                                  <span className="font-medium">{formatCurrency(emp.tdsPlan.janToMarRate)} × 3</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                  <span className="font-semibold">Total TDS:</span>
                                  <span className="font-bold">{formatCurrency(emp.tdsPlan.totalTDS)}</span>
                                </div>
                              </div>
                            </Card>

                            <Card className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                              <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewDetailedReport(emp)}>
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Detailed Report
                                </Button>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleEmailIndividual(emp)}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Email to Employee
                                </Button>
                                <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownloadIndividual(emp)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Individual
                                </Button>
                              </div>
                            </Card>
                          </div>
                        </td>
                      </tr>
                }
                  </Fragment>
              )
              }
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}>

                  {pageNum}
                </Button>);

            })}
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}