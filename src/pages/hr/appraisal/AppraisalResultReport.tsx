import React, { useState, useRef } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { Input } from '../../../components/ui/Input';
import { Badge } from '../../../components/ui/Badge';
import {
  Download,
  Printer,
  Filter,
  Search,
  FileText,
  FileSpreadsheet,
  Eye,
  Users,
  BarChart3,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Mail,
  X,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle } from
'lucide-react';

interface ResultRow {
  id: string;
  name: string;
  department: string;
  designation: string;
  selfScore: number;
  managerScore: number;
  peerScore: number;
  studentScore: number;
  finalScore: number;
  grade: string;
  recommendation: string;
  rank: number;
}

interface EmailFormData {
  recipients: string;
  subject: string;
  message: string;
  includeExcel: boolean;
  includePdf: boolean;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const gradeColor = (g: string) => {
  if (g === 'A+' || g === 'A') return 'bg-green-100 text-green-800';
  if (g === 'B+' || g === 'B') return 'bg-blue-100 text-blue-800';
  if (g === 'C') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

const recColor = (r: string) => {
  if (r === 'Promotion') return 'bg-green-100 text-green-700';
  if (r === 'Retention') return 'bg-blue-100 text-blue-700';
  if (r === 'Training') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

const mockResults: ResultRow[] = [
{
  id: 'EMP009',
  name: 'Dr. Patricia Martinez',
  department: 'Mathematics',
  designation: 'Teacher',
  selfScore: 95,
  managerScore: 90,
  peerScore: 88,
  studentScore: 92,
  finalScore: 91,
  grade: 'A+',
  recommendation: 'Promotion',
  rank: 1
},
{
  id: 'EMP002',
  name: 'Mrs. Sarah Johnson',
  department: 'Science',
  designation: 'HOD',
  selfScore: 92,
  managerScore: 88,
  peerScore: 85,
  studentScore: 85,
  finalScore: 87,
  grade: 'A',
  recommendation: 'Promotion',
  rank: 2
},
{
  id: 'EMP006',
  name: 'Mrs. Lisa Taylor',
  department: 'Science',
  designation: 'Teacher',
  selfScore: 90,
  managerScore: 85,
  peerScore: 82,
  studentScore: 88,
  finalScore: 86,
  grade: 'A',
  recommendation: 'Retention',
  rank: 3
},
{
  id: 'EMP001',
  name: 'Dr. Robert Smith',
  department: 'Mathematics',
  designation: 'Senior Teacher',
  selfScore: 88,
  managerScore: 82,
  peerScore: 80,
  studentScore: 90,
  finalScore: 84,
  grade: 'A',
  recommendation: 'Retention',
  rank: 4
},
{
  id: 'EMP010',
  name: 'Mr. Richard Lee',
  department: 'Support Staff',
  designation: 'Sports Coach',
  selfScore: 78,
  managerScore: 72,
  peerScore: 75,
  studentScore: 88,
  finalScore: 77,
  grade: 'B+',
  recommendation: 'Retention',
  rank: 5
},
{
  id: 'EMP008',
  name: 'Ms. Jennifer Brown',
  department: 'Support Staff',
  designation: 'Librarian',
  selfScore: 82,
  managerScore: 78,
  peerScore: 76,
  studentScore: 85,
  finalScore: 79,
  grade: 'B+',
  recommendation: 'Retention',
  rank: 6
},
{
  id: 'EMP004',
  name: 'Ms. Emily Davis',
  department: 'English',
  designation: 'Senior Teacher',
  selfScore: 80,
  managerScore: 75,
  peerScore: 72,
  studentScore: 82,
  finalScore: 77,
  grade: 'B+',
  recommendation: 'Training',
  rank: 7
},
{
  id: 'EMP003',
  name: 'Mr. Michael Chen',
  department: 'Science',
  designation: 'Teacher',
  selfScore: 75,
  managerScore: 70,
  peerScore: 68,
  studentScore: 78,
  finalScore: 72,
  grade: 'B',
  recommendation: 'Training',
  rank: 8
},
{
  id: 'EMP007',
  name: 'Mr. James Anderson',
  department: 'Administration',
  designation: 'Office Manager',
  selfScore: 70,
  managerScore: 65,
  peerScore: 62,
  studentScore: 0,
  finalScore: 65,
  grade: 'B',
  recommendation: 'Training',
  rank: 9
},
{
  id: 'EMP005',
  name: 'Mr. David Wilson',
  department: 'English',
  designation: 'Teacher',
  selfScore: 65,
  managerScore: 58,
  peerScore: 55,
  studentScore: 70,
  finalScore: 61,
  grade: 'B',
  recommendation: 'Training',
  rank: 10
},
{
  id: 'EMP011',
  name: 'Mr. Thomas White',
  department: 'Administration',
  designation: 'Clerk',
  selfScore: 55,
  managerScore: 48,
  peerScore: 50,
  studentScore: 0,
  finalScore: 49,
  grade: 'C',
  recommendation: 'PIP',
  rank: 11
}];


export function AppraisalResultReport() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [sortBy, setSortBy] = useState('rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // New state for interactive features
  const [isExporting, setIsExporting] = useState<'excel' | 'pdf' | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailFormData>({
    recipients: '',
    subject: 'Appraisal Result Report - Annual Review 2024-25',
    message: 'Please find attached the appraisal result report for your review.',
    includeExcel: true,
    includePdf: true
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});

  const printRef = useRef<HTMLDivElement>(null);

  const filtered = mockResults.
  filter((r) => {
    const matchSearch =
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || r.department === deptFilter;
    const matchGrade = !gradeFilter || r.grade === gradeFilter;
    return matchSearch && matchDept && matchGrade;
  }).
  sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'rank') return (a.rank - b.rank) * dir;
    if (sortBy === 'score') return (a.finalScore - b.finalScore) * dir;
    if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
    return 0;
  });

  const avgScore =
  filtered.length > 0 ?
  Math.round(
    filtered.reduce((s, r) => s + r.finalScore, 0) / filtered.length
  ) :
  0;

  const topPerformer = filtered[0];

  const toggleSort = (col: string) => {
    if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');else
    {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: {col: string;}) =>
  sortBy === col ?
  sortDir === 'asc' ?
  <ChevronUp className="w-3 h-3" /> :

  <ChevronDown className="w-3 h-3" /> :

  null;

  // Toast notification system
  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Export to Excel (CSV format)
  const handleExportExcel = async () => {
    setIsExporting('excel');

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create CSV content
      const headers = [
      'Rank',
      'Employee ID',
      'Name',
      'Department',
      'Designation',
      'Self Score',
      'Manager Score',
      'Peer Score',
      'Student Score',
      'Final Score',
      'Grade',
      'Recommendation'];


      const csvRows = [
      headers.join(','),
      ...filtered.map((row) =>
      [
      row.rank,
      row.id,
      `"${row.name}"`,
      row.department,
      row.designation,
      row.selfScore,
      row.managerScore,
      row.peerScore,
      row.studentScore || 'N/A',
      row.finalScore,
      row.grade,
      row.recommendation].
      join(',')
      )];


      // Add summary section
      csvRows.push('');
      csvRows.push('Summary');
      csvRows.push(`Total Employees,${filtered.length}`);
      csvRows.push(`Average Score,${avgScore}`);
      csvRows.push(`Top Performer,"${topPerformer?.name || 'N/A'}"`);
      csvRows.push(
        `For Promotion,${filtered.filter((r) => r.recommendation === 'Promotion').length}`
      );
      csvRows.push(
        `For Training,${filtered.filter((r) => r.recommendation === 'Training').length}`
      );
      csvRows.push(
        `For PIP,${filtered.filter((r) => r.recommendation === 'PIP').length}`
      );

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Appraisal_Result_Report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast('success', 'Excel report exported successfully!');
    } catch (error) {
      addToast('error', 'Failed to export Excel report. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  // Export to PDF
  const handleExportPdf = async () => {
    setIsExporting('pdf');

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create printable HTML content
      const printContent = generatePrintableContent();

      // Create a new window for PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Wait for content to load then trigger print
        printWindow.onload = () => {
          printWindow.print();
        };

        addToast('success', 'PDF report generated successfully!');
      } else {
        throw new Error('Could not open print window');
      }
    } catch (error) {
      addToast('error', 'Failed to generate PDF. Please check your popup blocker settings.');
    } finally {
      setIsExporting(null);
    }
  };

  // Generate printable HTML content
  const generatePrintableContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appraisal Result Report - Annual Review 2024-25</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { font-size: 24px; margin-bottom: 5px; }
            .header p { color: #666; }
            .summary { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .summary-item { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 5px; flex: 1; margin: 0 5px; }
            .summary-item .value { font-size: 24px; font-weight: bold; }
            .summary-item .label { color: #666; font-size: 11px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .name-cell { text-align: left; }
            .grade-a { background-color: #d4edda; }
            .grade-b { background-color: #cce5ff; }
            .grade-c { background-color: #fff3cd; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Appraisal Result Report</h1>
            <p>Annual Review 2024-25 — Final Published Results</p>
            <p>Generated on: ${currentDate}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <div class="value">${filtered.length}</div>
              <div class="label">Total Employees</div>
            </div>
            <div class="summary-item">
              <div class="value">${avgScore}</div>
              <div class="label">Average Score</div>
            </div>
            <div class="summary-item">
              <div class="value">${filtered.filter((r) => r.recommendation === 'Promotion').length}</div>
              <div class="label">For Promotion</div>
            </div>
            <div class="summary-item">
              <div class="value">${filtered.filter((r) => r.recommendation === 'Training').length}</div>
              <div class="label">For Training</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Self</th>
                <th>Manager</th>
                <th>Peer</th>
                <th>Student</th>
                <th>Final</th>
                <th>Grade</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.
    map(
      (r) => `
                <tr>
                  <td>${r.rank}</td>
                  <td class="name-cell">${r.name}<br><small>${r.id} · ${r.designation}</small></td>
                  <td>${r.department}</td>
                  <td>${r.selfScore}</td>
                  <td>${r.managerScore}</td>
                  <td>${r.peerScore}</td>
                  <td>${r.studentScore || '—'}</td>
                  <td><strong>${r.finalScore}</strong></td>
                  <td class="${r.grade.startsWith('A') ? 'grade-a' : r.grade.startsWith('B') ? 'grade-b' : 'grade-c'}">${r.grade}</td>
                  <td>${r.recommendation}</td>
                </tr>
              `
    ).
    join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is a computer-generated report. No signature required.</p>
            <p>Confidential - For Internal Use Only</p>
          </div>
        </body>
      </html>
    `;
  };

  // Validate email form
  const validateEmailForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!emailForm.recipients.trim()) {
      errors.recipients = 'At least one recipient email is required';
    } else {
      const emails = emailForm.recipients.split(',').map((e) => e.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter((e) => !emailRegex.test(e));
      if (invalidEmails.length > 0) {
        errors.recipients = `Invalid email(s): ${invalidEmails.join(', ')}`;
      }
    }

    if (!emailForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!emailForm.includeExcel && !emailForm.includePdf) {
      errors.attachments = 'Please select at least one attachment format';
    }

    setEmailErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle email send
  const handleSendEmail = async () => {
    if (!validateEmailForm()) return;

    setIsSendingEmail(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real application, this would send the email via an API
      const emailData = {
        recipients: emailForm.recipients.split(',').map((e) => e.trim()),
        subject: emailForm.subject,
        message: emailForm.message,
        attachments: {
          excel: emailForm.includeExcel,
          pdf: emailForm.includePdf
        },
        reportData: filtered,
        generatedAt: new Date().toISOString()
      };

      console.log('Email sent with data:', emailData);

      addToast('success', `Report sent successfully to ${emailData.recipients.length} recipient(s)!`);
      setShowEmailModal(false);
      setEmailForm({
        recipients: '',
        subject: 'Appraisal Result Report - Annual Review 2024-25',
        message: 'Please find attached the appraisal result report for your review.',
        includeExcel: true,
        includePdf: true
      });
    } catch (error) {
      addToast('error', 'Failed to send email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    const printContent = generatePrintableContent();
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
      addToast('info', 'Print dialog opened');
    } else {
      addToast('error', 'Could not open print window. Please check your popup blocker.');
    }
  };

  // Email Modal Component
  const EmailModal = () => {
    if (!showEmailModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowEmailModal(false)} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Email Appraisal Report
            </h2>
            <button
              onClick={() => setShowEmailModal(false)}
              className="p-1 hover:bg-gray-100 rounded">

              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipients (comma-separated)
              </label>
              <input
                type="text"
                value={emailForm.recipients}
                onChange={(e) =>
                setEmailForm((prev) => ({ ...prev, recipients: e.target.value }))
                }
                placeholder="email1@example.com, email2@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {emailErrors.recipients &&
              <p className="text-sm text-red-600 mt-1">{emailErrors.recipients}</p>
              }
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) =>
                setEmailForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />

              {emailErrors.subject &&
              <p className="text-sm text-red-600 mt-1">{emailErrors.subject}</p>
              }
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={emailForm.message}
                onChange={(e) =>
                setEmailForm((prev) => ({ ...prev, message: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />

            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailForm.includeExcel}
                    onChange={(e) =>
                    setEmailForm((prev) => ({
                      ...prev,
                      includeExcel: e.target.checked
                    }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />

                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Excel Report</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailForm.includePdf}
                    onChange={(e) =>
                    setEmailForm((prev) => ({
                      ...prev,
                      includePdf: e.target.checked
                    }))
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />

                  <FileText className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700">PDF Report</span>
                </label>
              </div>
              {emailErrors.attachments &&
              <p className="text-sm text-red-600 mt-1">{emailErrors.attachments}</p>
              }
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <strong>Report Summary:</strong> {filtered.length} employees, Average
                Score: {avgScore}, Generated on:{' '}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 p-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowEmailModal(false)}
              disabled={isSendingEmail}>

              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ?
              <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </> :

              <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </>
              }
            </Button>
          </div>
        </div>
      </div>);

  };

  // Toast Notifications Component
  const ToastNotifications = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) =>
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ?
          'bg-green-500 text-white' :
          toast.type === 'error' ?
          'bg-red-500 text-white' :
          'bg-blue-500 text-white'}`
          }>

            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
            {toast.type === 'info' && <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-80">

              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>);

  };

  return (
    <div className="space-y-6 p-6">
      <ToastNotifications />
      <EmailModal />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appraisal Result Report
          </h1>
          <p className="text-sm text-gray-500">
            Annual Review 2024-25 — Final published results
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={isExporting !== null}>

            {isExporting === 'excel' ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <FileSpreadsheet className="w-4 h-4 mr-2" />
            }
            Export Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={isExporting !== null}>

            {isExporting === 'pdf' ?
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :

            <FileText className="w-4 h-4 mr-2" />
            }
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowEmailModal(true)}
            disabled={isExporting !== null}>

            <Mail className="w-4 h-4 mr-2" />
            Email Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
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
            <BarChart3 className="w-6 h-6 text-green-600" />
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
            <p className="text-sm font-bold text-gray-900">
              {topPerformer?.name || '—'}
            </p>
            <p className="text-sm text-gray-500">Top Performer</p>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {filtered.filter((r) => r.recommendation === 'Promotion').length}
            </p>
            <p className="text-sm text-gray-500">For Promotion</p>
          </div>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />

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

        </div>

        <div className="overflow-x-auto" ref={printRef}>
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th
                  className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 w-16"
                  onClick={() => toggleSort('rank')}>

                  <div className="flex items-center justify-center gap-1">
                    Rank <SortIcon col="rank" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSort('name')}>

                  <div className="flex items-center gap-1">
                    Employee <SortIcon col="name" />
                  </div>
                </th>
                <th className="py-3 px-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Department
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Self
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Manager
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Peer
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Student
                </th>
                <th
                  className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase bg-blue-50 cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleSort('score')}>

                  <div className="flex items-center justify-center gap-1">
                    Final <SortIcon col="score" />
                  </div>
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase bg-blue-50">
                  Grade
                </th>
                <th className="py-3 px-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Recommendation
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) =>
              <tr
                key={r.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 ? 'bg-gray-50/30' : ''}`}>

                  <td className="py-3 px-3 text-center">
                    <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${r.rank <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>

                      {r.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">
                      {r.id} · {r.designation}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-sm text-gray-600">
                    {r.department}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-medium text-gray-700">
                    {r.selfScore}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-medium text-gray-700">
                    {r.managerScore}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-medium text-gray-700">
                    {r.peerScore}
                  </td>
                  <td className="py-3 px-3 text-center text-sm font-medium text-gray-700">
                    {r.studentScore || '—'}
                  </td>
                  <td className="py-3 px-3 text-center bg-blue-50/50">
                    <span className="text-lg font-bold text-gray-900">
                      {r.finalScore}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center bg-blue-50/50">
                    <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-full ${gradeColor(r.grade)}`}>

                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${recColor(r.recommendation)}`}>

                      {r.recommendation}
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
          <span>
            Showing {filtered.length} of {mockResults.length} employees
          </span>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </Card>
    </div>);

}