import React, { useState, Fragment, useMemo } from 'react';
import {
  DownloadIcon,
  MailIcon,
  EyeIcon,
  SendIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  LayoutGridIcon,
  ListIcon,
  XIcon,
  CheckIcon,
  PrinterIcon,
  CheckCircleIcon,
  AlertCircleIcon } from
'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';

// Sample data
const PAYSLIP_DATA = [
{
  id: 1,
  empCode: 'EMP001',
  empName: 'Rajesh Kumar',
  empPhoto: 'https://i.pravatar.cc/150?img=12',
  empEmail: 'rajesh.kumar@company.com',
  department: 'Teaching',
  designation: 'Senior Teacher',
  netSalary: 33900,
  status: 'Sent',
  gross: 40000,
  deduction: 6100,
  basic: 25000,
  hra: 10000,
  allowances: 5000,
  pf: 3000,
  esi: 600,
  tds: 2000,
  otherDed: 500,
  paymentMode: 'Bank Transfer',
  bankName: 'HDFC Bank',
  accountNumber: 'XXXX1234',
  utrNumber: 'UTR202505001234',
  payDate: '2025-05-31'
},
{
  id: 2,
  empCode: 'EMP002',
  empName: 'Priya Sharma',
  empPhoto: 'https://i.pravatar.cc/150?img=5',
  empEmail: 'priya.sharma@company.com',
  department: 'Administration',
  designation: 'Admin Officer',
  netSalary: 27320,
  status: 'Generated',
  gross: 32000,
  deduction: 4680,
  basic: 20000,
  hra: 8000,
  allowances: 4000,
  pf: 2400,
  esi: 480,
  tds: 1500,
  otherDed: 300,
  paymentMode: 'Bank Transfer',
  bankName: 'SBI',
  accountNumber: 'XXXX5678',
  utrNumber: 'UTR202505001235',
  payDate: '2025-05-31'
},
{
  id: 3,
  empCode: 'EMP003',
  empName: 'Amit Patel',
  empPhoto: 'https://i.pravatar.cc/150?img=33',
  empEmail: 'amit.patel@company.com',
  department: 'IT Department',
  designation: 'IT Manager',
  netSalary: 40780,
  status: 'Viewed',
  gross: 48000,
  deduction: 7220,
  basic: 30000,
  hra: 12000,
  allowances: 6000,
  pf: 3600,
  esi: 720,
  tds: 2500,
  otherDed: 400,
  paymentMode: 'Bank Transfer',
  bankName: 'ICICI Bank',
  accountNumber: 'XXXX9012',
  utrNumber: 'UTR202505001236',
  payDate: '2025-05-31'
},
{
  id: 4,
  empCode: 'EMP004',
  empName: 'Sneha Reddy',
  empPhoto: 'https://i.pravatar.cc/150?img=9',
  empEmail: 'sneha.reddy@company.com',
  department: 'Finance',
  designation: 'Accountant',
  netSalary: 29980,
  status: 'Sent',
  gross: 35300,
  deduction: 5320,
  basic: 22000,
  hra: 8800,
  allowances: 4500,
  pf: 2640,
  esi: 530,
  tds: 1800,
  otherDed: 350,
  paymentMode: 'Bank Transfer',
  bankName: 'Axis Bank',
  accountNumber: 'XXXX3456',
  utrNumber: 'UTR202505001237',
  payDate: '2025-05-31'
},
{
  id: 5,
  empCode: 'EMP005',
  empName: 'Vikram Singh',
  empPhoto: 'https://i.pravatar.cc/150?img=15',
  empEmail: 'vikram.singh@company.com',
  department: 'Support Staff',
  designation: 'Lab Assistant',
  netSalary: 20840,
  status: 'Generated',
  gross: 24000,
  deduction: 3160,
  basic: 15000,
  hra: 6000,
  allowances: 3000,
  pf: 1800,
  esi: 360,
  tds: 800,
  otherDed: 200,
  paymentMode: 'Cash',
  bankName: '-',
  accountNumber: '-',
  utrNumber: '-',
  payDate: '2025-05-31'
},
{
  id: 6,
  empCode: 'EMP006',
  empName: 'Anita Desai',
  empPhoto: 'https://i.pravatar.cc/150?img=25',
  empEmail: 'anita.desai@company.com',
  department: 'Teaching',
  designation: 'Teacher',
  netSalary: 30032,
  status: 'Sent',
  gross: 35200,
  deduction: 5168,
  basic: 22000,
  hra: 8800,
  allowances: 4400,
  pf: 2640,
  esi: 528,
  tds: 1700,
  otherDed: 300,
  paymentMode: 'Bank Transfer',
  bankName: 'HDFC Bank',
  accountNumber: 'XXXX7890',
  utrNumber: 'UTR202505001238',
  payDate: '2025-05-31'
}];


type PayslipRecord = (typeof PAYSLIP_DATA)[0];

interface Toast {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export function EmployeePayslipList() {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    month: 'May 2025',
    department: '',
    search: ''
  });
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailTargets, setEmailTargets] = useState<PayslipRecord[]>([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [payslipData, setPayslipData] = useState(PAYSLIP_DATA);

  // Filter data
  const filteredData = useMemo(() => {
    return payslipData.filter((record) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
        !record.empName.toLowerCase().includes(searchLower) &&
        !record.empCode.toLowerCase().includes(searchLower))
        {
          return false;
        }
      }

      // Department filter
      if (filters.department) {
        const deptMap: Record<string, string> = {
          teaching: 'Teaching',
          admin: 'Administration',
          it: 'IT Department',
          finance: 'Finance',
          support: 'Support Staff'
        };
        if (record.department !== deptMap[filters.department]) {
          return false;
        }
      }

      return true;
    });
  }, [payslipData, filters]);

  // Show toast notification
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Remove toast
  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Generate payslip HTML content
  const generatePayslipHTML = (employee: PayslipRecord) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${employee.empName} - ${filters.month}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { margin: 0; color: #1e293b; font-size: 24px; }
          .header p { color: #64748b; margin: 5px 0; }
          .company-name { font-size: 28px; font-weight: bold; color: #4f46e5; margin-bottom: 10px; }
          .emp-info { display: flex; justify-content: space-between; background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .emp-info-left, .emp-info-right { }
          .emp-info p { margin: 5px 0; }
          .emp-info label { color: #64748b; font-size: 12px; }
          .emp-info span { color: #1e293b; font-weight: 500; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #475569; font-size: 14px; text-transform: uppercase; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
          .row:last-child { border-bottom: none; }
          .row.total { background: #f1f5f9; padding: 12px; margin-top: 10px; font-weight: bold; border-radius: 4px; }
          .earnings { }
          .deductions { }
          .net-salary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 25px; border-radius: 8px; text-align: center; margin-top: 30px; }
          .net-salary p { margin: 0; }
          .net-salary .label { font-size: 14px; opacity: 0.9; }
          .net-salary .amount { font-size: 32px; font-weight: bold; margin-top: 5px; }
          .payment-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 25px; }
          .payment-info h4 { margin: 0 0 15px 0; color: #475569; font-size: 14px; text-transform: uppercase; }
          .payment-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          .two-columns { display: flex; gap: 30px; }
          .two-columns > div { flex: 1; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">ABC Organization</div>
          <h1>Salary Slip</h1>
          <p>${filters.month} | Pay Date: ${new Date(employee.payDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div class="emp-info">
          <div class="emp-info-left">
            <p><label>Employee Name</label><br/><span>${employee.empName}</span></p>
            <p><label>Employee Code</label><br/><span>${employee.empCode}</span></p>
            <p><label>Designation</label><br/><span>${employee.designation}</span></p>
          </div>
          <div class="emp-info-right">
            <p><label>Department</label><br/><span>${employee.department}</span></p>
            <p><label>Bank Account</label><br/><span>${employee.accountNumber}</span></p>
            <p><label>Bank Name</label><br/><span>${employee.bankName}</span></p>
          </div>
        </div>

        <div class="two-columns">
          <div class="section earnings">
            <h3>Earnings</h3>
            <div class="row"><span>Basic Salary</span><span>₹${employee.basic.toLocaleString()}</span></div>
            <div class="row"><span>House Rent Allowance</span><span>₹${employee.hra.toLocaleString()}</span></div>
            <div class="row"><span>Other Allowances</span><span>₹${employee.allowances.toLocaleString()}</span></div>
            <div class="row total"><span>Gross Salary</span><span>₹${employee.gross.toLocaleString()}</span></div>
          </div>

          <div class="section deductions">
            <h3>Deductions</h3>
            <div class="row"><span>Provident Fund (PF)</span><span>₹${employee.pf.toLocaleString()}</span></div>
            <div class="row"><span>ESI</span><span>₹${employee.esi.toLocaleString()}</span></div>
            <div class="row"><span>Tax Deducted at Source</span><span>₹${employee.tds.toLocaleString()}</span></div>
            <div class="row"><span>Other Deductions</span><span>₹${employee.otherDed.toLocaleString()}</span></div>
            <div class="row total"><span>Total Deductions</span><span>₹${employee.deduction.toLocaleString()}</span></div>
          </div>
        </div>

        <div class="net-salary">
          <p class="label">Net Salary Payable</p>
          <p class="amount">₹${employee.netSalary.toLocaleString()}</p>
        </div>

        <div class="payment-info">
          <h4>Payment Details</h4>
          <div class="payment-row"><span>Payment Mode</span><span>${employee.paymentMode}</span></div>
          <div class="payment-row"><span>Bank Name</span><span>${employee.bankName}</span></div>
          <div class="payment-row"><span>UTR Number</span><span>${employee.utrNumber}</span></div>
        </div>

        <div class="footer">
          <p>This is a computer generated payslip and does not require signature.</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
  };

  // Download individual payslip
  const downloadPayslip = (employee: PayslipRecord) => {
    const htmlContent = generatePayslipHTML(employee);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Payslip_${employee.empCode}_${filters.month.replace(' ', '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', `Payslip downloaded for ${employee.empName}`);
  };

  // Bulk download payslips
  const bulkDownloadPayslips = () => {
    const targetEmployees = selectedEmployees.length > 0 ?
    filteredData.filter((emp) => selectedEmployees.includes(emp.id)) :
    filteredData;

    if (targetEmployees.length === 0) {
      showToast('error', 'No employees to download payslips for');
      return;
    }

    targetEmployees.forEach((employee, index) => {
      setTimeout(() => {
        downloadPayslip(employee);
      }, index * 500);
    });

    showToast('info', `Downloading ${targetEmployees.length} payslips...`);
  };

  // View payslip
  const viewPayslip = (employee: PayslipRecord) => {
    setSelectedPayslip(employee);
    setShowPayslipModal(true);

    // Update status to Viewed if it was Generated
    if (employee.status === 'Generated') {
      setPayslipData((prev) =>
      prev.map((emp) =>
      emp.id === employee.id ? { ...emp, status: 'Viewed' } : emp
      )
      );
    }
  };

  // Print payslip
  const printPayslip = (employee: PayslipRecord) => {
    const htmlContent = generatePayslipHTML(employee);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Open email modal for single employee
  const openEmailModalSingle = (employee: PayslipRecord) => {
    setEmailTargets([employee]);
    setEmailSubject(`Your Payslip for ${filters.month}`);
    setEmailMessage(
      `Dear ${employee.empName},\n\nPlease find attached your payslip for ${filters.month}.\n\nNet Salary: ₹${employee.netSalary.toLocaleString()}\n\nIf you have any questions, please contact the HR department.\n\nBest regards,\nHR Team`
    );
    setShowEmailModal(true);
  };

  // Open email modal for bulk
  const openEmailModalBulk = () => {
    const targetEmployees = selectedEmployees.length > 0 ?
    filteredData.filter((emp) => selectedEmployees.includes(emp.id)) :
    filteredData;

    if (targetEmployees.length === 0) {
      showToast('error', 'No employees selected for sending emails');
      return;
    }

    setEmailTargets(targetEmployees);
    setEmailSubject(`Your Payslip for ${filters.month}`);
    setEmailMessage(
      `Dear Employee,\n\nPlease find attached your payslip for ${filters.month}.\n\nIf you have any questions, please contact the HR department.\n\nBest regards,\nHR Team`
    );
    setShowEmailModal(true);
  };

  // Send emails
  const sendEmails = async () => {
    setIsSendingEmail(true);

    // Simulate sending emails
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update status to Sent
    setPayslipData((prev) =>
    prev.map((emp) =>
    emailTargets.some((t) => t.id === emp.id) ?
    { ...emp, status: 'Sent' } :
    emp
    )
    );

    setIsSendingEmail(false);
    setShowEmailModal(false);
    showToast(
      'success',
      `Payslips sent to ${emailTargets.length} employee${emailTargets.length > 1 ? 's' : ''}`
    );
    setEmailTargets([]);
    setEmailSubject('');
    setEmailMessage('');
  };

  // Toggle employee selection
  const toggleEmployeeSelection = (id: number) => {
    setSelectedEmployees((prev) =>
    prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  // Select all employees
  const toggleSelectAll = () => {
    if (selectedEmployees.length === filteredData.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredData.map((emp) => emp.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info'> = {
      Generated: 'warning',
      Sent: 'info',
      Viewed: 'success'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-900">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }`}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-4">
            Employee Payslip List
          </h1>

          {/* Top Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Select
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
                }
                className="w-40" />

              <Select
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
                }
                className="w-48" />

              <Input
                placeholder="Search employee..."
                leftIcon={<SearchIcon className="w-4 h-4 text-slate-400" />}
                value={filters.search}
                onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value
                })
                }
                className="w-64" />

            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>

                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-1.5 rounded ${viewMode === 'card' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}>

                  <LayoutGridIcon className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={bulkDownloadPayslips}>

                Bulk Download
                {selectedEmployees.length > 0 &&
                <span className="ml-1 px-1.5 py-0.5 bg-slate-100 rounded-full text-xs">
                    {selectedEmployees.length}
                  </span>
                }
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<MailIcon className="w-4 h-4" />}
                onClick={openEmailModalBulk}>

                Send Email
                {selectedEmployees.length > 0 &&
                <span className="ml-1 px-1.5 py-0.5 bg-indigo-400 rounded-full text-xs">
                    {selectedEmployees.length}
                  </span>
                }
              </Button>
            </div>
          </div>

          {/* Selection Info */}
          {selectedEmployees.length > 0 &&
          <div className="flex items-center gap-3 mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-indigo-600" />
              <span className="text-sm text-indigo-700">
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </span>
              <button
              className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              onClick={() => setSelectedEmployees([])}>

                Clear selection
              </button>
            </div>
          }
        </div>

        {/* Table View */}
        {viewMode === 'table' &&
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
                    <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />

                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider w-12"></th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">
                    Net Salary
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {filteredData.length === 0 ?
              <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <SearchIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </td>
                  </tr> :

              filteredData.map((row) =>
              <Fragment key={row.id}>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                      type="checkbox"
                      checked={selectedEmployees.includes(row.id)}
                      onChange={() => toggleEmployeeSelection(row.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />

                        </td>
                        <td className="py-3 px-4">
                          <button
                      onClick={() => toggleRow(row.id)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors">

                            {expandedRow === row.id ?
                      <ChevronUpIcon className="w-4 h-4" /> :

                      <ChevronDownIcon className="w-4 h-4" />
                      }
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                        src={row.empPhoto}
                        alt={row.empName}
                        className="w-8 h-8 rounded-full object-cover" />

                            <div>
                              <div className="font-medium text-slate-900">
                                {row.empName}
                              </div>
                              <div className="text-xs text-slate-500">
                                {row.empCode}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {row.department}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">
                          ₹{row.netSalary.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(row.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => downloadPayslip(row)}
                        title="Download Payslip">

                              <DownloadIcon className="w-4 h-4" />
                            </button>
                            <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => viewPayslip(row)}
                        title="View Payslip">

                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        onClick={() => openEmailModalSingle(row)}
                        title="Send via Email">

                              <SendIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === row.id &&
                <tr>
                          <td colSpan={7} className="bg-slate-50 px-4 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  Gross Salary
                                </div>
                                <div className="font-semibold text-slate-900">
                                  ₹{row.gross.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  Total Deduction
                                </div>
                                <div className="font-semibold text-red-600">
                                  ₹{row.deduction.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  Payment Mode
                                </div>
                                <div className="font-medium text-slate-700">
                                  {row.paymentMode}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  Bank Name
                                </div>
                                <div className="font-medium text-slate-700">
                                  {row.bankName}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  UTR Number
                                </div>
                                <div className="font-medium text-slate-700 font-mono text-xs">
                                  {row.utrNumber}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                  Email
                                </div>
                                <div className="font-medium text-slate-700 text-xs truncate">
                                  {row.empEmail}
                                </div>
                              </div>
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
        }

        {/* Card View */}
        {viewMode === 'card' &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.length === 0 ?
          <div className="col-span-full py-12 text-center text-slate-500">
                <SearchIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-lg font-medium">No employees found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div> :

          filteredData.map((item) =>
          <div
            key={item.id}
            className={`bg-white border rounded-xl p-5 transition-colors ${
            selectedEmployees.includes(item.id) ?
            'border-indigo-400 ring-2 ring-indigo-100' :
            'border-slate-200 hover:border-slate-300'}`
            }>

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                    type="checkbox"
                    checked={selectedEmployees.includes(item.id)}
                    onChange={() => toggleEmployeeSelection(item.id)}
                    className="absolute -top-1 -left-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />

                        <img
                    src={item.empPhoto}
                    alt={item.empName}
                    className="w-12 h-12 rounded-full object-cover" />

                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {item.empName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.empCode}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Department</span>
                      <span className="font-medium text-slate-700">
                        {item.department}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Month</span>
                      <span className="font-medium text-slate-700">
                        {filters.month}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Gross</span>
                      <span className="font-medium text-slate-700">
                        ₹{item.gross.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Deductions</span>
                      <span className="font-medium text-red-600">
                        -₹{item.deduction.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-medium text-slate-500">
                        Net Salary
                      </span>
                      <span className="text-lg font-bold text-slate-900">
                        ₹{item.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                variant="outline"
                size="sm"
                className="flex-1"
                leftIcon={<DownloadIcon className="w-4 h-4" />}
                onClick={() => downloadPayslip(item)}>

                      Download
                    </Button>
                    <button
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                onClick={() => viewPayslip(item)}
                title="View">

                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
                onClick={() => openEmailModalSingle(item)}
                title="Send Email">

                      <SendIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
          )
          }
          </div>
        }
      </div>

      {/* Payslip View Modal */}
      {showPayslipModal && selectedPayslip &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Payslip Preview
                </h2>
                <p className="text-sm text-slate-500">
                  {filters.month} | {selectedPayslip.empCode}
                </p>
              </div>
              <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setShowPayslipModal(false)}>

                <XIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Employee Info */}
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4">
                  <img
                  src={selectedPayslip.empPhoto}
                  alt={selectedPayslip.empName}
                  className="w-16 h-16 rounded-full object-cover" />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {selectedPayslip.empName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {selectedPayslip.empCode} • {selectedPayslip.designation}
                    </p>
                    <p className="text-sm text-slate-500">
                      {selectedPayslip.department}
                    </p>
                  </div>
                  {getStatusBadge(selectedPayslip.status)}
                </div>
              </div>

              {/* Earnings & Deductions */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Earnings */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    Earnings
                  </h4>
                  <div className="bg-emerald-50 rounded-xl overflow-hidden">
                    <div className="divide-y divide-emerald-100">
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">Basic Salary</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.basic.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">HRA</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.hra.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">Allowances</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.allowances.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 bg-emerald-100">
                        <span className="font-semibold text-emerald-800">
                          Gross Salary
                        </span>
                        <span className="font-bold text-emerald-800">
                          ₹{selectedPayslip.gross.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                    Deductions
                  </h4>
                  <div className="bg-red-50 rounded-xl overflow-hidden">
                    <div className="divide-y divide-red-100">
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">Provident Fund</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.pf.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">ESI</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.esi.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">TDS</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.tds.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3">
                        <span className="text-slate-600">Other</span>
                        <span className="font-medium text-slate-900">
                          ₹{selectedPayslip.otherDed.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between px-4 py-3 bg-red-100">
                        <span className="font-semibold text-red-800">
                          Total Deductions
                        </span>
                        <span className="font-bold text-red-800">
                          ₹{selectedPayslip.deduction.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-indigo-100 text-sm">Net Salary</p>
                    <p className="text-3xl font-bold">
                      ₹{selectedPayslip.netSalary.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-100 text-sm">Pay Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(selectedPayslip.payDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                  Payment Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Payment Mode</p>
                    <p className="font-medium text-slate-900">
                      {selectedPayslip.paymentMode}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Bank Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedPayslip.bankName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Account Number</p>
                    <p className="font-medium text-slate-900">
                      {selectedPayslip.accountNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">UTR Number</p>
                    <p className="font-medium text-slate-900 font-mono text-sm">
                      {selectedPayslip.utrNumber}
                    </p>
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
              onClick={() => printPayslip(selectedPayslip)}>

                Print
              </Button>
              <Button
              variant="outline"
              size="sm"
              leftIcon={<DownloadIcon className="w-4 h-4" />}
              onClick={() => downloadPayslip(selectedPayslip)}>

                Download
              </Button>
              <Button
              variant="outline"
              size="sm"
              leftIcon={<SendIcon className="w-4 h-4" />}
              onClick={() => {
                setShowPayslipModal(false);
                openEmailModalSingle(selectedPayslip);
              }}>

                Send Email
              </Button>
              <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPayslipModal(false)}>

                Close
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Email Modal */}
      {showEmailModal &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Send Payslip via Email
                </h2>
                <p className="text-sm text-slate-500">
                  {emailTargets.length} recipient{emailTargets.length > 1 ? 's' : ''}
                </p>
              </div>
              <button
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setShowEmailModal(false)}>

                <XIcon className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6">
              {/* Recipients */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Recipients
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg max-h-32 overflow-y-auto">
                  {emailTargets.map((emp) =>
                <span
                  key={emp.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded-full text-sm">

                      <img
                    src={emp.empPhoto}
                    alt={emp.empName}
                    className="w-5 h-5 rounded-full" />

                      <span className="text-slate-700">{emp.empName}</span>
                      <span className="text-slate-400 text-xs">
                        ({emp.empEmail})
                      </span>
                    </span>
                )}
                </div>
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject" />

              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Email message..." />

              </div>

              {/* Attachment Info */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <MailIcon className="w-4 h-4" />
                <span>Payslip PDF will be attached automatically</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
              <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmailModal(false)}
              disabled={isSendingEmail}>

                Cancel
              </Button>
              <Button
              variant="primary"
              size="sm"
              leftIcon={
              isSendingEmail ?
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> :

              <SendIcon className="w-4 h-4" />

              }
              onClick={sendEmails}
              disabled={isSendingEmail || !emailSubject.trim()}>

                {isSendingEmail ? 'Sending...' : `Send to ${emailTargets.length} recipient${emailTargets.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      }

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) =>
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-in ${
          toast.type === 'success' ?
          'bg-emerald-600 text-white' :
          toast.type === 'error' ?
          'bg-red-600 text-white' :
          'bg-slate-800 text-white'}`
          }>

            {toast.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircleIcon className="w-5 h-5" />}
            {toast.type === 'info' && <MailIcon className="w-5 h-5" />}
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:bg-white/20 rounded transition-colors">

              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}
      </style>
    </div>);

}