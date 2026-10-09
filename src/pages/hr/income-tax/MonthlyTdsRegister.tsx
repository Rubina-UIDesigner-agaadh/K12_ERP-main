// src/pages/hr/payroll/MonthlyTdsRegister.tsx

import React, { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { Download, Printer, Calendar, Mail, RefreshCw } from 'lucide-react';

interface Employee {
  name: string;
  code: string;
  pan: string;
  gross: number;
  taxable: number;
  tds: number;
  cumulative: number;
  regime: 'New' | 'Old';
  status: string;
  department: string;
  email: string;
}

interface jsPDFWithAutoTable {
  autoTable: (options: {
    startY: number;
    head: string[][];
    body: (string | number)[][];
    theme: string;
    headStyles: {fillColor: number[];fontSize: number;};
    bodyStyles: {fontSize: number;};
    columnStyles: Record<number, {halign: string;}>;
    didParseCell: (data: {row: {index: number;};cell: {styles: {fillColor: number[];fontStyle: string;};};}) => void;
  }) => void;
  internal: {
    pages: unknown[];
    pageSize: {height: number;};
  };
  setPage: (page: number) => void;
  setFontSize: (size: number) => void;
  text: (text: string, x: number, y: number, options?: {align: string;}) => void;
  save: (filename: string) => void;
}

const initialEmployees: Employee[] = [
{
  name: 'Rajesh Kumar',
  code: 'EMP001',
  pan: 'ABCDE1234F',
  gross: 100000,
  taxable: 83333,
  tds: 9375,
  cumulative: 84375,
  regime: 'New',
  status: 'Processed',
  department: 'IT',
  email: 'rajesh.kumar@company.com'
},
{
  name: 'Priya Sharma',
  code: 'EMP002',
  pan: 'FGHIJ5678K',
  gross: 79167,
  taxable: 62500,
  tds: 5208,
  cumulative: 46875,
  regime: 'Old',
  status: 'Processed',
  department: 'HR',
  email: 'priya.sharma@company.com'
},
{
  name: 'Amit Patel',
  code: 'EMP003',
  pan: 'LMNOP9012Q',
  gross: 125000,
  taxable: 111667,
  tds: 16250,
  cumulative: 146250,
  regime: 'New',
  status: 'Processed',
  department: 'Finance',
  email: 'amit.patel@company.com'
},
{
  name: 'Sneha Reddy',
  code: 'EMP004',
  pan: 'RSTUV3456W',
  gross: 66667,
  taxable: 54167,
  tds: 3542,
  cumulative: 31875,
  regime: 'Old',
  status: 'Processed',
  department: 'IT',
  email: 'sneha.reddy@company.com'
},
{
  name: 'Vikram Singh',
  code: 'EMP005',
  pan: 'XYZAB7890C',
  gross: 150000,
  taxable: 133333,
  tds: 21250,
  cumulative: 191250,
  regime: 'New',
  status: 'Processed',
  department: 'Finance',
  email: 'vikram.singh@company.com'
}];


export function MonthlyTdsRegister() {
  const [selectedMonth, setSelectedMonth] = useState('jan-2025');
  const [selectedFY, setSelectedFY] = useState('2024-25');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [employees] = useState<Employee[]>(initialEmployees);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(initialEmployees);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const monthOptions = [
  { value: 'jan-2025', label: 'January 2025' },
  { value: 'dec-2024', label: 'December 2024' },
  { value: 'nov-2024', label: 'November 2024' },
  { value: 'oct-2024', label: 'October 2024' },
  { value: 'sep-2024', label: 'September 2024' },
  { value: 'aug-2024', label: 'August 2024' },
  { value: 'jul-2024', label: 'July 2024' },
  { value: 'jun-2024', label: 'June 2024' },
  { value: 'may-2024', label: 'May 2024' },
  { value: 'apr-2024', label: 'April 2024' }];


  const fyOptions = [
  { value: '2024-25', label: 'FY 2024-25' },
  { value: '2023-24', label: 'FY 2023-24' },
  { value: '2022-23', label: 'FY 2022-23' }];


  const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' }];


  const calculateTotals = () => {
    return filteredEmployees.reduce(
      (acc, emp) => ({
        gross: acc.gross + emp.gross,
        taxable: acc.taxable + emp.taxable,
        tds: acc.tds + emp.tds,
        cumulative: acc.cumulative + emp.cumulative
      }),
      { gross: 0, taxable: 0, tds: 0, cumulative: 0 }
    );
  };

  const totals = calculateTotals();

  const handleGenerateRegister = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let filtered = [...employees];

      if (selectedDepartment !== 'all') {
        filtered = filtered.filter(
          (emp) => emp.department.toLowerCase() === selectedDepartment
        );
      }

      setFilteredEmployees(filtered);
      setIsGenerating(false);

      const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label;
      const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

      alert(
        `TDS Register generated successfully!\n\nMonth: ${monthLabel}\nDepartment: ${deptLabel}\nTotal Employees: ${filtered.length}`
      );
    }, 1500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to print the register');
      return;
    }

    const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label;
    const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
    const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Monthly TDS Register - ${monthLabel}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              margin: 20px;
              font-size: 12px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #1e40af;
              padding-bottom: 15px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .header h1 {
              margin: 10px 0;
              font-size: 22px;
              color: #1f2937;
            }
            .header p {
              margin: 3px 0;
              color: #6b7280;
              font-size: 11px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 20px;
              background: #f3f4f6;
              padding: 15px;
              border-radius: 8px;
            }
            .info-item {
              text-align: center;
            }
            .info-item label {
              display: block;
              font-size: 10px;
              color: #6b7280;
              text-transform: uppercase;
              margin-bottom: 3px;
            }
            .info-item span {
              font-size: 14px;
              font-weight: bold;
              color: #1f2937;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
            }
            th, td { 
              border: 1px solid #d1d5db; 
              padding: 10px 8px; 
              text-align: left;
            }
            th { 
              background-color: #1e40af; 
              color: white;
              font-weight: 600;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals {
              background-color: #dbeafe;
              font-weight: bold;
            }
            .totals td {
              border-top: 2px solid #1e40af;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            tr:hover {
              background-color: #eff6ff;
            }
            .emp-code {
              font-size: 9px;
              color: #6b7280;
              font-family: monospace;
            }
            .regime-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 9px;
              font-weight: 600;
            }
            .regime-new {
              background: #dbeafe;
              color: #1e40af;
            }
            .regime-old {
              background: #f3e8ff;
              color: #7c3aed;
            }
            .status-badge {
              display: inline-block;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 9px;
              font-weight: 600;
              background: #dcfce7;
              color: #15803d;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 30px;
              margin-top: 30px;
            }
            .signature-box {
              text-align: center;
              padding-top: 40px;
              border-top: 1px solid #333;
            }
            .signature-box p {
              font-size: 10px;
              color: #6b7280;
            }
            .notes {
              background: #fef3c7;
              padding: 10px;
              border-radius: 5px;
              margin-top: 20px;
              font-size: 10px;
            }
            .notes strong {
              color: #92400e;
            }
            @media print {
              .no-print { display: none; }
              body { margin: 10px; }
            }
            .print-btn {
              margin-top: 20px;
              padding: 12px 24px;
              background: #1e40af;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
            }
            .print-btn:hover {
              background: #1e3a8a;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">ACME Corporation Pvt. Ltd.</div>
            <h1>Monthly TDS Register</h1>
            <p>Tax Deduction at Source - Employee Wise Summary</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <label>Financial Year</label>
              <span>${fyLabel}</span>
            </div>
            <div class="info-item">
              <label>Month</label>
              <span>${monthLabel}</span>
            </div>
            <div class="info-item">
              <label>Department</label>
              <span>${deptLabel}</span>
            </div>
            <div class="info-item">
              <label>Generated On</label>
              <span>${new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">S.No</th>
                <th style="width: 18%;">Employee Name</th>
                <th class="text-center" style="width: 12%;">PAN Number</th>
                <th class="text-right" style="width: 13%;">Gross Salary</th>
                <th class="text-right" style="width: 13%;">Taxable Income</th>
                <th class="text-right" style="width: 12%;">TDS Deducted</th>
                <th class="text-right" style="width: 12%;">Cumulative TDS</th>
                <th class="text-center" style="width: 8%;">Regime</th>
                <th class="text-center" style="width: 7%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredEmployees.
    map(
      (emp, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>
                    <strong>${emp.name}</strong><br/>
                    <span class="emp-code">${emp.code}</span>
                  </td>
                  <td class="text-center" style="font-family: monospace;">${emp.pan}</td>
                  <td class="text-right">${formatCurrency(emp.gross)}</td>
                  <td class="text-right">${formatCurrency(emp.taxable)}</td>
                  <td class="text-right">${formatCurrency(emp.tds)}</td>
                  <td class="text-right">${formatCurrency(emp.cumulative)}</td>
                  <td class="text-center">
                    <span class="regime-badge ${emp.regime === 'New' ? 'regime-new' : 'regime-old'}">
                      ${emp.regime}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="status-badge">${emp.status}</span>
                  </td>
                </tr>
              `
    ).
    join('')}
              <tr class="totals">
                <td colspan="3" class="text-right"><strong>Grand Total:</strong></td>
                <td class="text-right"><strong>${formatCurrency(totals.gross)}</strong></td>
                <td class="text-right"><strong>${formatCurrency(totals.taxable)}</strong></td>
                <td class="text-right"><strong>${formatCurrency(totals.tds)}</strong></td>
                <td class="text-right"><strong>${formatCurrency(totals.cumulative)}</strong></td>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
          
          <div class="notes">
            <strong>Note:</strong> This is a computer-generated document. TDS has been calculated as per Income Tax Act, 1961.
            For any discrepancies, please contact the HR/Payroll Department within 7 working days.
          </div>
          
          <div class="footer">
            <div class="footer-grid">
              <div class="signature-box">
                <p>Prepared By</p>
              </div>
              <div class="signature-box">
                <p>Verified By</p>
              </div>
              <div class="signature-box">
                <p>Authorized Signatory</p>
              </div>
            </div>
          </div>
          
          <button class="no-print print-btn" onclick="window.print()">
            🖨️ Print Document
          </button>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label;
    const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
    const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

    const headers = [
    'S.No',
    'Employee Name',
    'Employee Code',
    'PAN',
    'Department',
    'Gross Salary',
    'Taxable Income',
    'TDS Deducted',
    'Cumulative TDS',
    'Tax Regime',
    'Status',
    'Email'];


    const csvData = filteredEmployees.map((emp, index) => [
    index + 1,
    emp.name,
    emp.code,
    emp.pan,
    emp.department,
    emp.gross,
    emp.taxable,
    emp.tds,
    emp.cumulative,
    emp.regime,
    emp.status,
    emp.email]
    );

    const totalsRow = [
    '',
    'GRAND TOTAL',
    '',
    '',
    '',
    totals.gross,
    totals.taxable,
    totals.tds,
    totals.cumulative,
    '',
    '',
    ''];


    csvData.push(totalsRow);

    let csvContent = `Monthly TDS Register\n`;
    csvContent += `Company: ACME Corporation Pvt. Ltd.\n`;
    csvContent += `Financial Year: ${fyLabel}\n`;
    csvContent += `Month: ${monthLabel}\n`;
    csvContent += `Department: ${deptLabel}\n`;
    csvContent += `Generated on: ${new Date().toLocaleString('en-IN')}\n`;
    csvContent += `Total Employees: ${filteredEmployees.length}\n\n`;
    csvContent += headers.join(',') + '\n';
    csvContent += csvData.map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `TDS_Register_${selectedMonth}_${selectedFY}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      await import('jspdf-autotable');

      const jsPDF = jsPDFModule.default;
      const doc = new jsPDF('l', 'mm', 'a4') as unknown as jsPDFWithAutoTable;

      const monthLabel = monthOptions.find((m) => m.value === selectedMonth)?.label;
      const fyLabel = fyOptions.find((f) => f.value === selectedFY)?.label;
      const deptLabel = departmentOptions.find((d) => d.value === selectedDepartment)?.label;

      doc.setFontSize(20);
      doc.text('ACME Corporation Pvt. Ltd.', 148, 12, { align: 'center' });

      doc.setFontSize(16);
      doc.text('Monthly TDS Register', 148, 20, { align: 'center' });

      doc.setFontSize(10);
      doc.text(`Financial Year: ${fyLabel} | Month: ${monthLabel} | Department: ${deptLabel}`, 148, 28, {
        align: 'center'
      });
      doc.text(`Generated on: ${new Date().toLocaleString('en-IN')} | Total Employees: ${filteredEmployees.length}`, 148, 34, {
        align: 'center'
      });

      const tableData = filteredEmployees.map((emp, index) => [
      index + 1,
      `${emp.name}\n${emp.code}`,
      emp.pan,
      formatCurrency(emp.gross),
      formatCurrency(emp.taxable),
      formatCurrency(emp.tds),
      formatCurrency(emp.cumulative),
      emp.regime,
      emp.status]
      );

      tableData.push([
      '',
      'Grand Total',
      '',
      formatCurrency(totals.gross),
      formatCurrency(totals.taxable),
      formatCurrency(totals.tds),
      formatCurrency(totals.cumulative),
      '',
      '']
      );

      doc.autoTable({
        startY: 40,
        head: [['S.No', 'Employee', 'PAN', 'Gross Salary', 'Taxable Income', 'TDS Deducted', 'Cumulative TDS', 'Regime', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175], fontSize: 9 },
        bodyStyles: { fontSize: 8 },
        columnStyles: {
          0: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
          7: { halign: 'center' },
          8: { halign: 'center' }
        },
        didParseCell: function (data: {row: {index: number;};cell: {styles: {fillColor: number[];fontStyle: string;};};}) {
          if (data.row.index === tableData.length - 1) {
            data.cell.styles.fillColor = [219, 234, 254];
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} of ${pageCount} | Confidential - For Internal Use Only`, 148, doc.internal.pageSize.height - 10, {
          align: 'center'
        });
      }

      doc.save(`TDS_Register_${selectedMonth}_${selectedFY}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF generation failed. Please try CSV export instead.');
    }
  };

  const handleExport = () => {
    setIsExporting(true);

    const exportChoice = window.confirm(
      'Export TDS Register\n\n• Click OK for PDF format\n• Click Cancel for CSV/Excel format'
    );

    if (exportChoice) {
      handleExportPDF();
    } else {
      handleExportCSV();
    }

    setTimeout(() => {
      setIsExporting(false);
      alert('Export completed successfully!');
    }, 1000);
  };

  const handleSendEmail = () => {
    const confirmation = window.confirm(
      `📧 Email TDS Details\n\nThis will send individual TDS statements to ${filteredEmployees.length} employees.\n\nEmployees:\n${filteredEmployees.map((e) => `• ${e.name} (${e.email})`).join('\n')}\n\nDo you want to proceed?`
    );

    if (confirmation) {
      setIsSendingEmail(true);

      const emailPromises = filteredEmployees.map((emp, index) => {
        return new Promise<string>((resolve) => {
          setTimeout(() => {
            console.log(`Email sent to ${emp.email}:`);
            console.log(`  - Employee: ${emp.name}`);
            console.log(`  - TDS Deducted: ${formatCurrency(emp.tds)}`);
            console.log(`  - Cumulative TDS: ${formatCurrency(emp.cumulative)}`);
            resolve(emp.name);
          }, (index + 1) * 200);
        });
      });

      Promise.all(emailPromises).then((names) => {
        setIsSendingEmail(false);
        alert(
          `✅ Email Sent Successfully!\n\nTDS details have been sent to ${names.length} employees:\n${names.map((n) => `• ${n}`).join('\n')}`
        );
      });
    }
  };

  const handleRefresh = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let filtered = [...employees];

      if (selectedDepartment !== 'all') {
        filtered = filtered.filter((emp) => emp.department.toLowerCase() === selectedDepartment);
      }

      setFilteredEmployees(filtered);
      setIsGenerating(false);
    }, 1000);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const handleFYChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFY(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monthly TDS Register</h1>
          <p className="text-sm text-gray-500 mt-1">HR &gt; Payroll &gt; Income Tax &gt; TDS Register</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isGenerating}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button variant="outline" onClick={handleSendEmail} disabled={isSendingEmail}>
            <Mail className={`w-4 h-4 mr-2 ${isSendingEmail ? 'animate-pulse' : ''}`} />
            {isSendingEmail ? 'Sending...' : 'Email'}
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="primary" onClick={handleExport} disabled={isExporting}>
            <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select options={monthOptions} value={selectedMonth} onChange={handleMonthChange} />
          <Select options={fyOptions} value={selectedFY} onChange={handleFYChange} />
          <Select options={departmentOptions} value={selectedDepartment} onChange={handleDepartmentChange} />
          <Button variant="outline" className="w-full" onClick={handleGenerateRegister} disabled={isGenerating}>
            <Calendar className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate Register'}
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table ref={tableRef} className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Employee Name</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">PAN</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Gross Salary</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Taxable Income</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">TDS Deducted</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Cumulative TDS</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Regime</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ?
              <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No employees found for the selected filters. Please adjust your filters and try again.
                  </td>
                </tr> :

              filteredEmployees.map((employee, index) =>
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{employee.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-mono text-sm text-gray-700">{employee.pan.slice(0, 6)}****</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {formatCurrency(employee.gross)}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-600 font-medium">
                      {formatCurrency(employee.taxable)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">
                      {formatCurrency(employee.tds)}
                    </td>
                    <td className="px-4 py-3 text-right text-purple-600 font-medium">
                      {formatCurrency(employee.cumulative)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                    className={
                    employee.regime === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }>

                        {employee.regime}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge className="bg-green-100 text-green-700">{employee.status}</Badge>
                    </td>
                  </tr>
              )
              }
            </tbody>
            {filteredEmployees.length > 0 &&
            <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-900">
                    Grand Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">{formatCurrency(totals.gross)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">{formatCurrency(totals.taxable)}</td>
                  <td className="px-4 py-3 text-right font-bold text-green-600">{formatCurrency(totals.tds)}</td>
                  <td className="px-4 py-3 text-right font-bold text-purple-600">{formatCurrency(totals.cumulative)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            }
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-gray-900">{filteredEmployees.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total TDS Deducted</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.tds)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Taxable Income</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totals.taxable)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cumulative TDS (YTD)</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(totals.cumulative)}</p>
          </div>
        </div>
      </Card>
    </div>);

}