import React, { useState, useMemo, useRef } from 'react';
import {
  DownloadIcon,
  PrinterIcon,
  SettingsIcon,
  FilterIcon,
  ChevronDownIcon,
  EyeIcon,
  SearchIcon,
  XIcon,
  CheckIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// Sample data
const SALARY_DATA = [
{
  id: 1,
  empCode: 'EMP001',
  empName: 'Rajesh Kumar',
  department: 'Teaching',
  designation: 'Senior Teacher',
  employeeType: 'Permanent',
  basic: 25000,
  hra: 10000,
  allowances: 5000,
  gross: 40000,
  pf: 3000,
  esi: 600,
  tds: 2000,
  otherDed: 500,
  totalDed: 6100,
  netSalary: 33900,
  status: 'Processed'
},
{
  id: 2,
  empCode: 'EMP002',
  empName: 'Priya Sharma',
  department: 'Administration',
  designation: 'Admin Officer',
  employeeType: 'Permanent',
  basic: 20000,
  hra: 8000,
  allowances: 4000,
  gross: 32000,
  pf: 2400,
  esi: 480,
  tds: 1500,
  otherDed: 300,
  totalDed: 4680,
  netSalary: 27320,
  status: 'Processed'
},
{
  id: 3,
  empCode: 'EMP003',
  empName: 'Amit Patel',
  department: 'IT Department',
  designation: 'IT Manager',
  employeeType: 'Permanent',
  basic: 30000,
  hra: 12000,
  allowances: 6000,
  gross: 48000,
  pf: 3600,
  esi: 720,
  tds: 2500,
  otherDed: 400,
  totalDed: 7220,
  netSalary: 40780,
  status: 'Locked'
},
{
  id: 4,
  empCode: 'EMP004',
  empName: 'Sneha Reddy',
  department: 'Finance',
  designation: 'Accountant',
  employeeType: 'Contract',
  basic: 22000,
  hra: 8800,
  allowances: 4500,
  gross: 35300,
  pf: 2640,
  esi: 530,
  tds: 1800,
  otherDed: 350,
  totalDed: 5320,
  netSalary: 29980,
  status: 'Pending'
},
{
  id: 5,
  empCode: 'EMP005',
  empName: 'Vikram Singh',
  department: 'Support Staff',
  designation: 'Lab Assistant',
  employeeType: 'Temporary',
  basic: 15000,
  hra: 6000,
  allowances: 3000,
  gross: 24000,
  pf: 1800,
  esi: 360,
  tds: 800,
  otherDed: 200,
  totalDed: 3160,
  netSalary: 20840,
  status: 'Processed'
},
{
  id: 6,
  empCode: 'EMP006',
  empName: 'Anita Desai',
  department: 'Teaching',
  designation: 'Teacher',
  employeeType: 'Permanent',
  basic: 22000,
  hra: 8800,
  allowances: 4400,
  gross: 35200,
  pf: 2640,
  esi: 528,
  tds: 1700,
  otherDed: 300,
  totalDed: 5168,
  netSalary: 30032,
  status: 'Processed'
},
{
  id: 7,
  empCode: 'EMP007',
  empName: 'Suresh Menon',
  department: 'Administration',
  designation: 'Clerk',
  employeeType: 'Contract',
  basic: 18000,
  hra: 7200,
  allowances: 3600,
  gross: 28800,
  pf: 2160,
  esi: 432,
  tds: 1200,
  otherDed: 250,
  totalDed: 4042,
  netSalary: 24758,
  status: 'Pending'
},
{
  id: 8,
  empCode: 'EMP008',
  empName: 'Kavitha Nair',
  department: 'Finance',
  designation: 'Senior Accountant',
  employeeType: 'Permanent',
  basic: 28000,
  hra: 11200,
  allowances: 5600,
  gross: 44800,
  pf: 3360,
  esi: 672,
  tds: 2300,
  otherDed: 450,
  totalDed: 6782,
  netSalary: 38018,
  status: 'Locked'
},
{
  id: 9,
  empCode: 'EMP009',
  empName: 'Mohan Das',
  department: 'Support Staff',
  designation: 'Security Guard',
  employeeType: 'Temporary',
  basic: 12000,
  hra: 4800,
  allowances: 2400,
  gross: 19200,
  pf: 1440,
  esi: 288,
  tds: 500,
  otherDed: 150,
  totalDed: 2378,
  netSalary: 16822,
  status: 'Processed'
},
{
  id: 10,
  empCode: 'EMP010',
  empName: 'Lakshmi Iyer',
  department: 'Teaching',
  designation: 'Principal',
  employeeType: 'Permanent',
  basic: 45000,
  hra: 18000,
  allowances: 9000,
  gross: 72000,
  pf: 5400,
  esi: 1080,
  tds: 5000,
  otherDed: 800,
  totalDed: 12280,
  netSalary: 59720,
  status: 'Locked'
},
{
  id: 11,
  empCode: 'EMP011',
  empName: 'Ramesh Gupta',
  department: 'IT Department',
  designation: 'Developer',
  employeeType: 'Contract',
  basic: 35000,
  hra: 14000,
  allowances: 7000,
  gross: 56000,
  pf: 4200,
  esi: 840,
  tds: 3500,
  otherDed: 500,
  totalDed: 9040,
  netSalary: 46960,
  status: 'Processed'
},
{
  id: 12,
  empCode: 'EMP012',
  empName: 'Deepa Krishnan',
  department: 'Administration',
  designation: 'HR Manager',
  employeeType: 'Permanent',
  basic: 32000,
  hra: 12800,
  allowances: 6400,
  gross: 51200,
  pf: 3840,
  esi: 768,
  tds: 2800,
  otherDed: 400,
  totalDed: 7808,
  netSalary: 43392,
  status: 'Pending'
}];


// Column definitions
const ALL_COLUMNS = [
{ key: 'empCode', label: 'Emp Code', visible: true },
{ key: 'empName', label: 'Employee Name', visible: true },
{ key: 'department', label: 'Department', visible: true },
{ key: 'designation', label: 'Designation', visible: true },
{ key: 'basic', label: 'Basic', visible: true, numeric: true },
{ key: 'hra', label: 'HRA', visible: true, numeric: true },
{ key: 'allowances', label: 'Allowances', visible: true, numeric: true },
{ key: 'gross', label: 'Gross', visible: true, numeric: true },
{ key: 'pf', label: 'PF', visible: true, numeric: true },
{ key: 'esi', label: 'ESI', visible: true, numeric: true },
{ key: 'tds', label: 'TDS', visible: true, numeric: true },
{ key: 'otherDed', label: 'Other Ded.', visible: true, numeric: true },
{ key: 'totalDed', label: 'Total Ded.', visible: true, numeric: true },
{ key: 'netSalary', label: 'Net Salary', visible: true, numeric: true },
{ key: 'status', label: 'Status', visible: true }];


const ITEMS_PER_PAGE = 5;

type SalaryRecord = (typeof SALARY_DATA)[0];

export function SalaryRegisterView() {
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryRecord | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(ALL_COLUMNS);
  const [appliedFilters, setAppliedFilters] = useState({
    financialYear: '2024-25',
    month: 'May 2025',
    department: '',
    employeeType: '',
    status: '',
    minSalary: '',
    maxSalary: '',
    search: ''
  });
  const [filters, setFilters] = useState({
    financialYear: '2024-25',
    month: 'May 2025',
    department: '',
    employeeType: '',
    status: '',
    minSalary: '',
    maxSalary: '',
    search: ''
  });

  const tableRef = useRef<HTMLDivElement>(null);
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  // Filter data based on applied filters
  const filteredData = useMemo(() => {
    return SALARY_DATA.filter((record) => {
      // Search filter
      if (appliedFilters.search) {
        const searchLower = appliedFilters.search.toLowerCase();
        if (
        !record.empName.toLowerCase().includes(searchLower) &&
        !record.empCode.toLowerCase().includes(searchLower))
        {
          return false;
        }
      }

      // Department filter
      if (appliedFilters.department) {
        const deptMap: Record<string, string> = {
          teaching: 'Teaching',
          admin: 'Administration',
          it: 'IT Department',
          finance: 'Finance',
          support: 'Support Staff'
        };
        if (record.department !== deptMap[appliedFilters.department]) {
          return false;
        }
      }

      // Employee type filter
      if (appliedFilters.employeeType) {
        const typeMap: Record<string, string> = {
          permanent: 'Permanent',
          contract: 'Contract',
          temporary: 'Temporary'
        };
        if (record.employeeType !== typeMap[appliedFilters.employeeType]) {
          return false;
        }
      }

      // Status filter
      if (appliedFilters.status) {
        if (
        record.status.toLowerCase() !== appliedFilters.status.toLowerCase())
        {
          return false;
        }
      }

      // Min salary filter
      if (appliedFilters.minSalary) {
        if (record.netSalary < Number(appliedFilters.minSalary)) {
          return false;
        }
      }

      // Max salary filter
      if (appliedFilters.maxSalary) {
        if (record.netSalary > Number(appliedFilters.maxSalary)) {
          return false;
        }
      }

      return true;
    });
  }, [appliedFilters]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset to page 1 when filters change
  const applyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const defaultFilters = {
      financialYear: '2024-25',
      month: 'May 2025',
      department: '',
      employeeType: '',
      status: '',
      minSalary: '',
      maxSalary: '',
      search: ''
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  // Column visibility toggle
  const toggleColumn = (columnKey: string) => {
    setColumns((prev) =>
    prev.map((col) =>
    col.key === columnKey ? { ...col, visible: !col.visible } : col
    )
    );
  };

  // View employee details
  const viewEmployee = (employee: SalaryRecord) => {
    setSelectedEmployee(employee);
    setShowEmployeeModal(true);
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Salary Register - ${appliedFilters.month} (${appliedFilters.financialYear})</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #1e293b; }
          h2 { text-align: center; color: #64748b; font-size: 14px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; color: #475569; }
          .numeric { text-align: right; }
          .status-processed { color: #16a34a; }
          .status-pending { color: #ca8a04; }
          .status-locked { color: #2563eb; }
          .total-row { font-weight: bold; background: #f8fafc; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <h1>Salary Register</h1>
        <h2>${appliedFilters.month} | Financial Year: ${appliedFilters.financialYear}</h2>
        <table>
          <thead>
            <tr>
              ${columns.
    filter((c) => c.visible).
    map((c) => `<th class="${c.numeric ? 'numeric' : ''}">${c.label}</th>`).
    join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredData.
    map(
      (row) => `
              <tr>
                ${columns.
      filter((c) => c.visible).
      map((c) => {
        const value = row[c.key as keyof SalaryRecord];
        if (c.key === 'status') {
          return `<td class="status-${value.toString().toLowerCase()}">${value}</td>`;
        }
        if (c.numeric) {
          return `<td class="numeric">₹${Number(value).toLocaleString()}</td>`;
        }
        return `<td>${value}</td>`;
      }).
      join('')}
              </tr>
            `
    ).
    join('')}
            <tr class="total-row">
              <td colspan="4">Total (${filteredData.length} employees)</td>
              ${columns.
    filter((c) => c.visible && c.numeric).
    map((c) => {
      const total = filteredData.reduce(
        (sum, row) => sum + Number(row[c.key as keyof SalaryRecord]),
        0
      );
      return `<td class="numeric">₹${total.toLocaleString()}</td>`;
    }).
    join('')}
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Export to Excel (CSV format)
  const handleExportExcel = () => {
    const visibleColumns = columns.filter((c) => c.visible);
    const headers = visibleColumns.map((c) => c.label).join(',');

    const rows = filteredData.map((row) =>
    visibleColumns.
    map((c) => {
      const value = row[c.key as keyof SalaryRecord];
      if (c.numeric) {
        return value;
      }
      return `"${value}"`;
    }).
    join(',')
    );

    // Add totals row
    const totals = visibleColumns.map((c) => {
      if (c.numeric) {
        return filteredData.reduce(
          (sum, row) => sum + Number(row[c.key as keyof SalaryRecord]),
          0
        );
      }
      if (c.key === 'empCode') {
        return '"TOTAL"';
      }
      return '""';
    });

    const csvContent = [headers, ...rows, totals.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salary_register_${appliedFilters.month.replace(' ', '_')}_${appliedFilters.financialYear}.csv`;
    link.click();
  };

  // Export to PDF
  const handleExportPDF = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Salary Register - ${appliedFilters.month} (${appliedFilters.financialYear})</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: Arial, sans-serif; padding: 10px; }
          h1 { text-align: center; color: #1e293b; font-size: 18px; margin-bottom: 5px; }
          h2 { text-align: center; color: #64748b; font-size: 12px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; font-size: 9px; }
          th, td { border: 1px solid #e2e8f0; padding: 6px; text-align: left; }
          th { background: #f1f5f9; font-weight: 600; color: #475569; }
          .numeric { text-align: right; }
          .status-processed { color: #16a34a; font-weight: 600; }
          .status-pending { color: #ca8a04; font-weight: 600; }
          .status-locked { color: #2563eb; font-weight: 600; }
          .total-row { font-weight: bold; background: #f8fafc; }
          .footer { margin-top: 15px; text-align: center; font-size: 10px; color: #64748b; }
          .net-salary { color: #059669; font-weight: bold; }
          .total-ded { color: #dc2626; }
        </style>
      </head>
      <body>
        <h1>Salary Register Report</h1>
        <h2>${appliedFilters.month} | Financial Year: ${appliedFilters.financialYear} | Total Employees: ${filteredData.length}</h2>
        <table>
          <thead>
            <tr>
              ${columns.
    filter((c) => c.visible).
    map((c) => `<th class="${c.numeric ? 'numeric' : ''}">${c.label}</th>`).
    join('')}
            </tr>
          </thead>
          <tbody>
            ${filteredData.
    map(
      (row) => `
              <tr>
                ${columns.
      filter((c) => c.visible).
      map((c) => {
        const value = row[c.key as keyof SalaryRecord];
        if (c.key === 'status') {
          return `<td class="status-${value.toString().toLowerCase()}">${value}</td>`;
        }
        if (c.key === 'netSalary') {
          return `<td class="numeric net-salary">₹${Number(value).toLocaleString()}</td>`;
        }
        if (c.key === 'totalDed') {
          return `<td class="numeric total-ded">₹${Number(value).toLocaleString()}</td>`;
        }
        if (c.numeric) {
          return `<td class="numeric">₹${Number(value).toLocaleString()}</td>`;
        }
        return `<td>${value}</td>`;
      }).
      join('')}
              </tr>
            `
    ).
    join('')}
            <tr class="total-row">
              <td colspan="4"><strong>Grand Total</strong></td>
              ${columns.
    filter((c) => c.visible && c.numeric).
    map((c) => {
      const total = filteredData.reduce(
        (sum, row) => sum + Number(row[c.key as keyof SalaryRecord]),
        0
      );
      const className =
      c.key === 'netSalary' ?
      'numeric net-salary' :
      c.key === 'totalDed' ?
      'numeric total-ded' :
      'numeric';
      return `<td class="${className}">₹${total.toLocaleString()}</td>`;
    }).
    join('')}
              <td></td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>Generated on ${new Date().toLocaleString()}</p>
          <p>This is a computer generated report</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info'> = {
      Processed: 'success',
      Pending: 'warning',
      Locked: 'info'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  };

  // Calculate totals for visible data
  const totals = useMemo(() => {
    return {
      basic: filteredData.reduce((sum, r) => sum + r.basic, 0),
      hra: filteredData.reduce((sum, r) => sum + r.hra, 0),
      allowances: filteredData.reduce((sum, r) => sum + r.allowances, 0),
      gross: filteredData.reduce((sum, r) => sum + r.gross, 0),
      pf: filteredData.reduce((sum, r) => sum + r.pf, 0),
      esi: filteredData.reduce((sum, r) => sum + r.esi, 0),
      tds: filteredData.reduce((sum, r) => sum + r.tds, 0),
      otherDed: filteredData.reduce((sum, r) => sum + r.otherDed, 0),
      totalDed: filteredData.reduce((sum, r) => sum + r.totalDed, 0),
      netSalary: filteredData.reduce((sum, r) => sum + r.netSalary, 0)
    };
  }, [filteredData]);

  const visibleColumns = columns.filter((c) => c.visible);

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-xs text-slate-500 mb-2">
            <span>HR</span>
            <ChevronDownIcon className="w-3 h-3 mx-1 rotate-[-90deg]" />
            <span>Payroll</span>
            <ChevronDownIcon className="w-3 h-3 mx-1 rotate-[-90deg]" />
            <span className="text-slate-900 font-medium">Salary Register</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold text-slate-900">
              Salary Register View
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Column Selector */}
              <div className="relative" ref={columnSelectorRef}>
                <Button
                  variant={showColumnSelector ? 'primary' : 'outline'}
                  size="sm"
                  leftIcon={<SettingsIcon className="w-4 h-4" />}
                  onClick={() => setShowColumnSelector(!showColumnSelector)}>

                  Columns
                </Button>
                {showColumnSelector &&
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-2 max-h-80 overflow-y-auto">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-xs font-medium text-slate-500 uppercase">
                        Toggle Columns
                      </span>
                    </div>
                    {columns.map((col) =>
                  <button
                    key={col.key}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 transition-colors"
                    onClick={() => toggleColumn(col.key)}>

                        <span className="text-sm text-slate-700">
                          {col.label}
                        </span>
                        {col.visible ?
                    <CheckIcon className="w-4 h-4 text-emerald-500" /> :

                    <div className="w-4 h-4 border border-slate-300 rounded" />
                    }
                      </button>
                  )}
                    <div className="border-t border-slate-100 px-3 py-2 mt-1">
                      <button
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                      onClick={() =>
                      setColumns(
                        ALL_COLUMNS.map((c) => ({ ...c, visible: true }))
                      )
                      }>

                        Show All Columns
                      </button>
                    </div>
                  </div>
                }
              </div>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<PrinterIcon className="w-4 h-4" />}
                onClick={handlePrint}>

                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={handleExportExcel}>

                Export Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={handleExportPDF}>

                Export PDF
              </Button>
              <Button
                variant={showFilters ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<FilterIcon className="w-4 h-4" />}
                onClick={() => setShowFilters(!showFilters)}>

                Filters
                {Object.values(appliedFilters).filter(
                  (v) =>
                  v &&
                  v !== '2024-25' &&
                  v !== 'May 2025'
                ).length > 0 &&
                <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                    {
                  Object.values(appliedFilters).filter(
                    (v) =>
                    v &&
                    v !== '2024-25' &&
                    v !== 'May 2025'
                  ).length
                  }
                  </span>
                }
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Total Employees
            </p>
            <p className="text-2xl font-bold text-slate-900">
              {filteredData.length}
            </p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">
              Total Net Salary
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              ₹{totals.netSalary.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">
              Total Gross
            </p>
            <p className="text-2xl font-bold text-blue-700">
              ₹{totals.gross.toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-xs text-red-600 uppercase tracking-wide mb-1">
              Total Deductions
            </p>
            <p className="text-2xl font-bold text-red-700">
              ₹{totals.totalDed.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Collapsible Filter Panel */}
        {showFilters &&
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
              label="Financial Year"
              value={filters.financialYear}
              onChange={(val) =>
              setFilters({
                ...filters,
                financialYear: val as string
              })
              }
              options={[
              { value: '2024-25', label: '2024-25' },
              { value: '2023-24', label: '2023-24' },
              { value: '2022-23', label: '2022-23' }]
              } />

              <Select
              label="Month"
              value={filters.month}
              onChange={(val) =>
              setFilters({
                ...filters,
                month: val as string
              })
              }
              options={[
              { value: 'May 2025', label: 'May 2025' },
              { value: 'April 2025', label: 'April 2025' },
              { value: 'March 2025', label: 'March 2025' }]
              } />

              <Select
              label="Department"
              value={filters.department}
              onChange={(val) =>
              setFilters({
                ...filters,
                department: val as string
              })
              }
              placeholder="All Departments"
              options={[
              { value: 'teaching', label: 'Teaching' },
              { value: 'admin', label: 'Administration' },
              { value: 'it', label: 'IT Department' },
              { value: 'finance', label: 'Finance' },
              { value: 'support', label: 'Support Staff' }]
              } />

              <Select
              label="Employee Type"
              value={filters.employeeType}
              onChange={(val) =>
              setFilters({
                ...filters,
                employeeType: val as string
              })
              }
              placeholder="All Types"
              options={[
              { value: 'permanent', label: 'Permanent' },
              { value: 'contract', label: 'Contract' },
              { value: 'temporary', label: 'Temporary' }]
              } />

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Select
              label="Status"
              value={filters.status}
              onChange={(val) =>
              setFilters({
                ...filters,
                status: val as string
              })
              }
              placeholder="All Status"
              options={[
              { value: 'processed', label: 'Processed' },
              { value: 'pending', label: 'Pending' },
              { value: 'locked', label: 'Locked' }]
              } />

              <Input
              label="Min Salary"
              type="number"
              placeholder="₹0"
              value={filters.minSalary}
              onChange={(e) =>
              setFilters({
                ...filters,
                minSalary: e.target.value
              })
              } />

              <Input
              label="Max Salary"
              type="number"
              placeholder="₹100000"
              value={filters.maxSalary}
              onChange={(e) =>
              setFilters({
                ...filters,
                maxSalary: e.target.value
              })
              } />

              <Input
              label="Search Employee"
              placeholder="Name or Code"
              leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
              value={filters.search}
              onChange={(e) =>
              setFilters({
                ...filters,
                search: e.target.value
              })
              } />

            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>
        }

        {/* Main Table */}
        <div
          className="bg-white border border-slate-200 rounded-xl overflow-hidden"
          ref={tableRef}>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1400px]">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr>
                  {visibleColumns.map((col) =>
                  <th
                    key={col.key}
                    className={`py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    col.numeric ? 'text-right' : ''}`
                    }>

                      {col.label}
                    </th>
                  )}
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {paginatedData.length === 0 ?
                <tr>
                    <td
                    colSpan={visibleColumns.length + 1}
                    className="py-12 text-center text-slate-500">

                      <div className="flex flex-col items-center">
                        <SearchIcon className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-medium">No records found</p>
                        <p className="text-sm">
                          Try adjusting your filters to find what you're looking
                          for.
                        </p>
                      </div>
                    </td>
                  </tr> :

                paginatedData.map((row) =>
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors">

                      {visibleColumns.map((col) => {
                    const value = row[col.key as keyof SalaryRecord];
                    if (col.key === 'status') {
                      return (
                        <td key={col.key} className="py-3 px-4 text-center">
                              {getStatusBadge(value as string)}
                            </td>);

                    }
                    if (col.key === 'empCode') {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 font-medium text-slate-700">

                              {value}
                            </td>);

                    }
                    if (col.key === 'empName') {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-slate-900 font-medium">

                              {value}
                            </td>);

                    }
                    if (col.key === 'netSalary') {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-emerald-600 font-bold text-right">

                              ₹{Number(value).toLocaleString()}
                            </td>);

                    }
                    if (col.key === 'totalDed') {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-red-600 font-medium text-right">

                              ₹{Number(value).toLocaleString()}
                            </td>);

                    }
                    if (col.key === 'gross') {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-slate-900 font-semibold text-right">

                              ₹{Number(value).toLocaleString()}
                            </td>);

                    }
                    if (col.numeric) {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-slate-600 text-right">

                              ₹{Number(value).toLocaleString()}
                            </td>);

                    }
                    return (
                      <td
                        key={col.key}
                        className="py-3 px-4 text-slate-600">

                            {value}
                          </td>);

                  })}
                      <td className="py-3 px-4 text-center">
                        <button
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      onClick={() => viewEmployee(row)}
                      title="View Details">

                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                )
                }
              </tbody>
              {paginatedData.length > 0 &&
              <tfoot className="bg-slate-100 border-t-2 border-slate-200">
                  <tr>
                    {visibleColumns.map((col, idx) => {
                    if (idx === 0) {
                      return (
                        <td
                          key={col.key}
                          className="py-3 px-4 font-bold text-slate-700">

                            TOTAL
                          </td>);

                    }
                    if (col.key === 'status') {
                      return (
                        <td key={col.key} className="py-3 px-4"></td>);

                    }
                    if (col.numeric) {
                      const total =
                      totals[col.key as keyof typeof totals] || 0;
                      const className =
                      col.key === 'netSalary' ?
                      'py-3 px-4 text-emerald-600 font-bold text-right' :
                      col.key === 'totalDed' ?
                      'py-3 px-4 text-red-600 font-bold text-right' :
                      'py-3 px-4 text-slate-700 font-semibold text-right';
                      return (
                        <td key={col.key} className={className}>
                            ₹{total.toLocaleString()}
                          </td>);

                    }
                    return <td key={col.key} className="py-3 px-4"></td>;
                  })}
                    <td className="py-3 px-4"></td>
                  </tr>
                </tfoot>
              }
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              Showing{' '}
              <span className="font-medium">
                {filteredData.length === 0 ?
                0 :
                (currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
              </span>{' '}
              of <span className="font-medium">{filteredData.length}</span>{' '}
              employees
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}>

                Previous
              </Button>
              {getPageNumbers().map((page, idx) =>
              page === '...' ?
              <span
                key={`ellipsis-${idx}`}
                className="px-2 text-slate-400">

                    ...
                  </span> :

              <Button
                key={page}
                variant={currentPage === page ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page as number)}>

                    {page}
                  </Button>

              )}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }>

                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      {showEmployeeModal && selectedEmployee &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Employee Salary Details
                </h2>
                <p className="text-sm text-slate-500">
                  {appliedFilters.month} | FY {appliedFilters.financialYear}
                </p>
              </div>
              <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setShowEmployeeModal(false)}>

                <XIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              {/* Employee Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {selectedEmployee.empName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {selectedEmployee.empName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedEmployee.empCode} • {selectedEmployee.designation}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedEmployee.department}
                    </p>
                  </div>
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </div>

              {/* Earnings */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                  Earnings
                </h4>
                <div className="bg-emerald-50 rounded-xl overflow-hidden">
                  <div className="divide-y divide-emerald-100">
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.basic.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">
                        House Rent Allowance (HRA)
                      </span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.hra.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">Other Allowances</span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.allowances.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3 bg-emerald-100">
                      <span className="font-semibold text-emerald-800">
                        Gross Salary
                      </span>
                      <span className="font-bold text-emerald-800">
                        ₹{selectedEmployee.gross.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                  Deductions
                </h4>
                <div className="bg-red-50 rounded-xl overflow-hidden">
                  <div className="divide-y divide-red-100">
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">
                        Provident Fund (PF)
                      </span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.pf.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">
                        Employee State Insurance (ESI)
                      </span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.esi.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">
                        Tax Deducted at Source (TDS)
                      </span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.tds.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3">
                      <span className="text-slate-600">Other Deductions</span>
                      <span className="font-medium text-slate-900">
                        ₹{selectedEmployee.otherDed.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-3 bg-red-100">
                      <span className="font-semibold text-red-800">
                        Total Deductions
                      </span>
                      <span className="font-bold text-red-800">
                        ₹{selectedEmployee.totalDed.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-indigo-100 text-sm">Net Salary</p>
                    <p className="text-3xl font-bold">
                      ₹{selectedEmployee.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm">Pay Date</p>
                    <p className="text-lg font-semibold">Last working day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <Button
              variant="outline"
              size="sm"
              leftIcon={<PrinterIcon className="w-4 h-4" />}
              onClick={() => {
                const printContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <title>Salary Slip - ${selectedEmployee.empName}</title>
                      <style>
                        body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
                        .header h1 { margin: 0; color: #1e293b; }
                        .header p { color: #64748b; margin: 5px 0; }
                        .emp-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                        .section { margin-bottom: 20px; }
                        .section h3 { color: #475569; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; }
                        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                        .row.total { background: #f1f5f9; font-weight: bold; padding: 10px; margin-top: 5px; }
                        .net-salary { background: #4f46e5; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 20px; }
                        .net-salary p { margin: 0; }
                        .net-salary .amount { font-size: 28px; font-weight: bold; }
                      </style>
                    </head>
                    <body>
                      <div class="header">
                        <h1>Salary Slip</h1>
                        <p>${appliedFilters.month} | FY ${appliedFilters.financialYear}</p>
                      </div>
                      <div class="emp-info">
                        <strong>${selectedEmployee.empName}</strong><br/>
                        ${selectedEmployee.empCode} • ${selectedEmployee.designation}<br/>
                        ${selectedEmployee.department}
                      </div>
                      <div class="section">
                        <h3>Earnings</h3>
                        <div class="row"><span>Basic Salary</span><span>₹${selectedEmployee.basic.toLocaleString()}</span></div>
                        <div class="row"><span>HRA</span><span>₹${selectedEmployee.hra.toLocaleString()}</span></div>
                        <div class="row"><span>Allowances</span><span>₹${selectedEmployee.allowances.toLocaleString()}</span></div>
                        <div class="row total"><span>Gross Salary</span><span>₹${selectedEmployee.gross.toLocaleString()}</span></div>
                      </div>
                      <div class="section">
                        <h3>Deductions</h3>
                        <div class="row"><span>PF</span><span>₹${selectedEmployee.pf.toLocaleString()}</span></div>
                        <div class="row"><span>ESI</span><span>₹${selectedEmployee.esi.toLocaleString()}</span></div>
                        <div class="row"><span>TDS</span><span>₹${selectedEmployee.tds.toLocaleString()}</span></div>
                        <div class="row"><span>Other Deductions</span><span>₹${selectedEmployee.otherDed.toLocaleString()}</span></div>
                        <div class="row total"><span>Total Deductions</span><span>₹${selectedEmployee.totalDed.toLocaleString()}</span></div>
                      </div>
                      <div class="net-salary">
                        <p>Net Salary</p>
                        <p class="amount">₹${selectedEmployee.netSalary.toLocaleString()}</p>
                      </div>
                    </body>
                    </html>
                  `;
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(printContent);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}>

                Print Slip
              </Button>
              <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEmployeeModal(false)}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Click outside to close column selector */}
      {showColumnSelector &&
      <div
        className="fixed inset-0 z-40"
        onClick={() => setShowColumnSelector(false)} />

      }
    </div>);

}